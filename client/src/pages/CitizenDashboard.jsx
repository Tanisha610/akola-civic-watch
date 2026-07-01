import { useEffect, useState } from 'react';
import api from '../services/api';
import IssueCard from '../components/IssueCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function CitizenDashboard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/dashboard/citizen')
      .then(({ data }) => setOverview(data.data))
      .catch(() => setOverview({ issues: [], counts: {}, total: 0 }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton lines={5} />;

  const issues = overview?.issues || [];
  const activeIssues = issues.filter((issue) => issue.status !== 'Resolved');
  const counts = overview?.counts || {};

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="section-title">Citizen dashboard</h1>
        <p className="section-subtitle">Track your complaints, profile activity, and notification history.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {['Reported', 'Under Review', 'In Progress', 'Resolved'].map((status) => (
          <div key={status} className="glass-card rounded-3xl p-5">
            <div className="text-sm text-slate-500">{status}</div>
            <div className="mt-2 text-3xl font-semibold text-slate-900">{counts[status] || 0}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4">
          <div className="text-lg font-semibold text-slate-900">My complaints</div>
          {activeIssues.length ? (
            activeIssues.map((issue) => <IssueCard key={issue._id} issue={issue} />)
          ) : (
            <div className="glass-card rounded-3xl p-5 text-sm text-slate-500">No active complaints found.</div>
          )}
        </div>
        <div className="space-y-4">
          <div className="glass-card rounded-3xl p-5">
            <div className="text-sm font-semibold text-slate-900">Profile management</div>
            <p className="mt-2 text-sm text-slate-600">Update your name, phone number, and notification preferences from the profile endpoint.</p>
          </div>
          <div className="glass-card rounded-3xl p-5">
            <div className="text-sm font-semibold text-slate-900">Notifications</div>
            <ul className="mt-3 space-y-3 text-sm text-slate-600">
              <li>Your complaint about road repairs has moved to In Progress.</li>
              <li>Ward 7 water supply restoration inspection is scheduled.</li>
              <li>New civic update available from Akola municipal team.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
