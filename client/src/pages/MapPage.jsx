import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterBar from '../components/FilterBar';
import MapView from '../components/MapView';
import StatusBadge from '../components/StatusBadge';
import api from '../services/api';
import { issueCategories, statusValues } from '../data/civicConstants';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { formatWardLabel } from '../utils/ward';

const normalizeWardText = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^ward\s*\d+\s*[:\-]?\s*/i, '')
    .replace(/^ward\s*/i, '')
    .trim();

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const initialWard = searchParams.get('ward') || '';
  const initialIssueId = searchParams.get('issue') || '';
  const [filters, setFilters] = useState({ search: '', category: '', status: '', ward: '' });
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialWard) {
      setFilters((current) => ({ ...current, ward: initialWard }));
    }
  }, [initialWard]);

  useEffect(() => {
    let cancelled = false;

    api
      .get('/issues?limit=200')
      .then(({ data }) => {
        if (!cancelled) setIssues(data.data || []);
      })
      .catch(() => {
        if (!cancelled) setIssues([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredIssues = useMemo(
    () =>
      issues.filter((issue) => {
        const query = `${issue.title} ${issue.category} ${issue.status} ${issue.ward}`.toLowerCase();
        const wardFilter = normalizeWardText(filters.ward);
        const issueWard = normalizeWardText(issue.ward);
        return (
          query.includes(filters.search.toLowerCase()) &&
          (!filters.category || issue.category === filters.category) &&
          (!filters.status || issue.status === filters.status) &&
          (!wardFilter || issueWard.includes(wardFilter))
        );
      }),
    [filters, issues]
  );

  useEffect(() => {
    if (initialIssueId) {
      const issue = filteredIssues.find((item) => (item._id || item.id) === initialIssueId);
      if (issue) {
        setSelectedIssue(issue);
        return;
      }
    }

    if (!filters.ward || !filteredIssues.length) return;

    setSelectedIssue((current) => {
      if (current && filteredIssues.some((issue) => (issue._id || issue.id) === (current._id || current.id))) {
        return current;
      }

      return filteredIssues[0];
    });
  }, [filteredIssues, filters.ward]);

  if (loading) return <LoadingSkeleton lines={6} />;

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="section-title">Interactive map</h1>
        <p className="section-subtitle">Browse issue markers across Akola with category and status filters.</p>
      </div>

      <FilterBar filters={filters} onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))} categories={issueCategories} statuses={statusValues} />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <MapView issues={filteredIssues} onMarkerClick={setSelectedIssue} />
        <div className="space-y-4">
          <div className="glass-card rounded-3xl p-5">
            <div className="text-sm font-semibold text-slate-900">Map summary</div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Visible issues</div>
                <div className="mt-1 text-2xl font-semibold text-slate-900">{filteredIssues.length}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Ward focus</div>
                <div className="mt-1 text-2xl font-semibold text-slate-900">{filters.ward ? filters.ward.replace(/^Ward\s+/i, 'Ward ') : 'All'}</div>
              </div>
            </div>
          </div>
          {selectedIssue ? (
            <div className="glass-card rounded-3xl p-5">
              <StatusBadge status={selectedIssue.status} />
              <h3 className="mt-3 text-lg font-semibold text-slate-900">{selectedIssue.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{selectedIssue.category}</p>
              <p className="mt-2 text-sm text-slate-600">{formatWardLabel(selectedIssue.ward)}</p>
              <p className="mt-2 text-sm text-slate-600">Click through to see the full complaint timeline and discussion.</p>
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-5 text-sm text-slate-600">
              Select a marker to see complaint details here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
