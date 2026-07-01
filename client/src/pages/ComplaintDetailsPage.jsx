import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import MapView from '../components/MapView';
import StatusBadge from '../components/StatusBadge';
import Timeline from '../components/Timeline';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';
import { resolveApiAssetUrl } from '../services/api';
import { formatWardLabel } from '../utils/ward';

export default function ComplaintDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [issueData, setIssueData] = useState(null);
  const [comment, setComment] = useState('');
  const [markResolved, setMarkResolved] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [loading, setLoading] = useState(true);

  const issue = issueData?.issue || issueData;
  const comments = issueData?.comments || [];
  const issueImage = resolveApiAssetUrl(issue?.image);
  const canResolve = Boolean(user && issue && (user.role === 'admin' || String(user._id || user.id) === String(issue.createdBy?._id || issue.createdBy || '')));

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const { data } = await api.get(`/issues/${id}`);
        setIssueData(data.data);
      } catch (err) {
        setIssueData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  const handleUpvote = async () => {
    try {
      await api.patch(`/issues/${id}/upvote`);
      toast.success('Issue upvoted.');
    } catch {
      toast.error('Login required to upvote in production mode.');
    }
  };

  const postResolveUpdate = async (text) => {
    const { data } = await api.post(`/issues/${id}/comments`, {
      text,
      markResolved: true
    });

    setIssueData((current) =>
      current
        ? {
            ...current,
            issue: current.issue ? { ...current.issue, status: 'Resolved' } : current.issue,
            comments: [...(current.comments || []), data.data]
          }
        : current
    );

    toast.success('Issue dismissed and moved out of active feeds.');
    navigate('/');
  };

  const handleResolveAndDismiss = async () => {
    if (!canResolve) {
      toast.error('Only the issue creator or an admin can resolve it.');
      return;
    }

    try {
      await postResolveUpdate('Issue marked as solved and dismissed from active feeds.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not resolve the issue.');
    }
  };

  const handleComment = async (event) => {
    event.preventDefault();
    if (!comment.trim()) return;

    try {
      if (markResolved) {
        await postResolveUpdate(comment.trim());
        return;
      }

      const { data } = await api.post(`/issues/${id}/comments`, { text: comment, markResolved: false });
      setIssueData((current) =>
        current
          ? {
              ...current,
              comments: [...(current.comments || []), data.data]
            }
          : current
      );
      toast.success('Comment posted.');
      setComment('');
      setMarkResolved(false);
      setShowComposer(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Please login to comment.');
    }
  };

  if (loading) {
    return <LoadingSkeleton lines={6} />;
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-card rounded-[2rem] p-6">
          <StatusBadge status={issue.status} />
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{issue.title}</h1>
          <p className="mt-3 text-sm text-slate-600">{issue.description || 'Community reported complaint details.'}</p>
          <div className="mt-5 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
            <div><span className="font-semibold text-slate-900">Category:</span> {issue.category}</div>
            <div><span className="font-semibold text-slate-900">Ward:</span> {formatWardLabel(issue.ward)}</div>
            <div><span className="font-semibold text-slate-900">Votes:</span> {issue.votes || 0}</div>
            <div><span className="font-semibold text-slate-900">Status:</span> {issue.status}</div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn-primary" onClick={handleUpvote}>
              Upvote
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setShowComposer(true);
                setMarkResolved(false);
              }}
            >
              Share Update
            </button>
            <button
              type="button"
              className="btn-secondary"
              disabled={!canResolve}
              onClick={handleResolveAndDismiss}
            >
              Resolve & Dismiss
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            {canResolve
              ? 'You can post an update or directly mark the issue as solved.'
              : 'Only the issue creator or an admin can resolve this complaint.'}
          </p>
          {issueImage ? (
            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
              <img src={issueImage} alt={issue.title} className="h-72 w-full object-cover" />
            </div>
          ) : null}
        </div>
        <div className="space-y-4">
          <div className="glass-card rounded-[2rem] p-5">
            <div className="text-sm font-semibold text-slate-900">Location on map</div>
            {issue.latitude && issue.longitude ? (
              <div className="mt-4 overflow-hidden rounded-3xl">
                <MapView issues={[issue]} center={[issue.latitude, issue.longitude]} zoom={15} />
              </div>
            ) : (
              <div className="mt-4 text-sm text-slate-500">Location unavailable.</div>
            )}
          </div>
          <div className="glass-card rounded-[2rem] p-5">
            <div className="text-sm font-semibold text-slate-900">Status tracking</div>
            <div className="mt-4">
              <Timeline status={issue.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] p-6">
        <div className="text-lg font-semibold text-slate-900">Comments</div>
        {showComposer && (
          <div className="mt-4 rounded-3xl border border-civic-200 bg-civic-50 p-4">
            <div className="text-sm font-semibold text-slate-900">Share a public update</div>
            <p className="mt-1 text-xs text-slate-500">Post a short progress note or field update that others can see.</p>
            <form onSubmit={handleComment} className="mt-4 space-y-3">
              <textarea
                className="input-field min-h-28"
                placeholder="Write your update"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-3">
                <label className={`flex items-center gap-2 text-sm ${canResolve ? 'text-slate-700' : 'text-slate-400'}`}>
                  <input
                    type="checkbox"
                    checked={markResolved}
                    disabled={!canResolve}
                    onChange={(e) => setMarkResolved(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 disabled:opacity-50"
                  />
                  Mark this issue as solved and dismiss it from active feeds
                </label>
                <p className="mt-2 text-xs text-slate-500">
                  {canResolve
                      ? 'This will change the complaint status to Resolved and remove it from active feeds.'
                    : 'Only the issue creator or an admin can resolve it.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="btn-primary">
                  {markResolved ? 'Resolve & Dismiss' : 'Post Update'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowComposer(false);
                    setComment('');
                    setMarkResolved(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="mt-4 space-y-3">
          {comments.length ? (
            comments.map((item) => (
              <div key={item._id || item.id} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                <div className="font-semibold text-slate-900">{item.userId?.name || 'Citizen'}</div>
                <p className="mt-1">{item.text}</p>
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-500">No comments yet.</div>
          )}
        </div>
        {!showComposer && (
          <form onSubmit={handleComment} className="mt-5 flex gap-3">
            <input className="input-field" placeholder="Add a public comment" value={comment} onChange={(e) => setComment(e.target.value)} />
            <button type="submit" className="btn-primary">
              Post
            </button>
          </form>
        )}
        <p className="mt-3 text-xs text-slate-500">{user ? `Commenting as ${user.name}` : 'Login required to post public comments.'}</p>
      </div>
    </div>
  );
}
