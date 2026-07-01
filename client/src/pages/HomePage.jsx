import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import IssueCategoryCard from '../components/IssueCategoryCard';
import IssueCard from '../components/IssueCard';
import api from '../services/api';
import { issueCategories } from '../data/civicConstants';

const categoryMeta = {
  'Water Supply': { icon: '💧', description: 'Leaks, shortages, and pressure issues across wards.' },
  'Roads & Potholes': { icon: '🛣️', description: 'Road defects, surface damage, and unsafe stretches.' },
  'Drainage & Flooding': { icon: '🌧️', description: 'Blocked drains, stormwater overflow, and waterlogging.' },
  'Waste Management': { icon: '🗑️', description: 'Garbage accumulation, pickup delays, and dumping.' },
  'Healthcare Infrastructure': { icon: '🏥', description: 'Facility upkeep and service gaps in public health.' },
  'Public Transport': { icon: '🚌', description: 'Stops, route congestion, and commuter access problems.' },
  'Urban Planning & Encroachment': { icon: '🏗️', description: 'Encroachment, planning, and public space misuse.' }
};

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [overview, setOverview] = useState({ totalComplaints: 0, resolvedCount: 0, activeWardCount: 0, openCount: 0 });
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    let cancelled = false;

    Promise.all([api.get('/dashboard/public'), api.get('/issues?limit=100')])
      .then(([overviewRes, issuesRes]) => {
        if (cancelled) return;
        setOverview(overviewRes.data.data || overview);
        setIssues(issuesRes.data.data || []);
      })
      .catch(() => {
        if (!cancelled) {
          setOverview({ totalComplaints: 0, resolvedCount: 0, activeWardCount: 0, openCount: 0 });
          setIssues([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredComplaints = useMemo(
    () =>
      issues.filter((complaint) =>
        `${complaint.title} ${complaint.description || ''} ${complaint.category} ${complaint.ward}`.toLowerCase().includes(search.toLowerCase())
      ),
    [issues, search]
  );

  const activeComplaints = useMemo(
    () => filteredComplaints.filter((complaint) => complaint.status !== 'Resolved'),
    [filteredComplaints]
  );

  return (
    <div className="space-y-8 pb-10">
      <section className="grid gap-6 rounded-[2rem] border border-white/70 bg-gradient-to-br from-white via-civic-50 to-orange-50 p-6 shadow-soft md:grid-cols-[1.4fr_0.9fr] md:p-10">
        <div>
          <span className="chip bg-civic-100 text-civic-800">अपना Akola</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
            Report civic issues and track city response in one trusted place.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
            A modern civic reporting platform for citizens of Akola to flag problems, follow updates, and help the city respond faster.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/report" className="btn-primary">
              Report an Issue
            </Link>
            <Link to="/ward-check" className="btn-secondary">
              Check your Ward
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Total complaints', value: overview.totalComplaints, delta: 'Live data from MongoDB' },
              { label: 'Resolved', value: overview.resolvedCount, delta: 'Closed complaints' },
              { label: 'Active wards', value: overview.activeWardCount, delta: 'Wards with reported issues' },
              { label: 'Open cases', value: overview.openCount, delta: 'Need follow-up' }
            ].map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-5 md:p-6">
          <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
            <div className="text-sm text-slate-300">Search by location</div>
            <input
              className="mt-3 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400"
              placeholder="Enter ward, road, or landmark"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="mt-4 rounded-2xl bg-white/5 p-4 text-sm text-slate-200">
              Search results update instantly and can be filtered on the interactive map.
            </div>
          </div>
          <div className="mt-5 space-y-3">
              {activeComplaints.slice(0, 3).map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Issue categories</h2>
            <p className="section-subtitle">The city monitors service requests across the most common civic pain points.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {issueCategories.map((category) => (
            <IssueCategoryCard key={category} category={category} icon={categoryMeta[category].icon} description={categoryMeta[category].description} />
          ))}
        </div>
      </section>

      <section>
        <div>
          <h2 className="section-title">Recent complaints</h2>
          <p className="section-subtitle">New submissions and active cases in Akola.</p>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {activeComplaints.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>
    </div>
  );
}
