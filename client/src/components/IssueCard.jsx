import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { formatWardLabel } from '../utils/ward';

const statusTone = {
  Reported: 'bg-amber-100 text-amber-800',
  'Under Review': 'bg-sky-100 text-sky-800',
  'In Progress': 'bg-civic-100 text-civic-800',
  Resolved: 'bg-emerald-100 text-emerald-800'
};

export default function IssueCard({ issue }) {
  return (
    <Link to={`/complaints/${issue.id || issue._id}`} className="block">
      <div className="glass-card group rounded-3xl p-5 transition hover:-translate-y-1 hover:shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">{issue.title}</div>
            <div className="mt-1 text-xs text-slate-500">{issue.location || formatWardLabel(issue.ward)}</div>
          </div>
          <span className={`chip ${statusTone[issue.status] || 'bg-slate-100 text-slate-600'}`}>{issue.status}</span>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>{issue.category}</span>
          <span>{issue.votes ?? 0} votes</span>
        </div>
        <div className="mt-4 text-xs text-slate-400">
          {issue.createdAt ? formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true }) : 'Recently reported'}
        </div>
      </div>
    </Link>
  );
}
