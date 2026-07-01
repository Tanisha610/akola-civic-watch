import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { issueCategories } from '../data/civicConstants';
import { wards } from '../data/wards';
import { useAuth } from '../context/AuthContext';

export default function ReportIssuePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: issueCategories[0], ward: '', latitude: '', longitude: '' });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      toast.error('Please login before reporting an issue.');
      navigate('/login', { replace: true, state: { from: '/report' } });
      return;
    }

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    if (image) payload.append('image', image);

    try {
      setSubmitting(true);
      const { data } = await api.post('/issues', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      const createdIssue = data?.data;
      toast.success('Complaint submitted successfully.');
      setForm({ title: '', description: '', category: issueCategories[0], ward: '', latitude: '', longitude: '' });
      setImage(null);
      // Navigate to the ward-focused map and select the exact new complaint.
      navigate(`/map?ward=${encodeURIComponent(form.ward)}&issue=${encodeURIComponent(createdIssue?._id || createdIssue?.id || '')}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-10">
      <div>
        <h1 className="section-title">Report an issue</h1>
        <p className="section-subtitle">Submit civic complaints by selecting your Akola ward and adding image evidence.</p>
      </div>

      <div className="glass-card rounded-3xl p-4 text-sm text-slate-600">
        Not sure about your ward?{' '}
        <Link to="/ward-check" className="font-semibold text-civic-700 underline decoration-civic-300 underline-offset-4">
          Check your Ward
        </Link>
        .
      </div>

      <form onSubmit={handleSubmit} className="glass-card space-y-5 rounded-[2rem] p-6 md:p-8">
        <div className="grid gap-4 md:grid-cols-2">
          <input className="input-field" placeholder="Issue title" value={form.title} onChange={(e) => updateField('title', e.target.value)} />
          <select className="input-field" value={form.category} onChange={(e) => updateField('category', e.target.value)}>
            {issueCategories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>
        <textarea className="input-field min-h-36" placeholder="Describe the issue" value={form.description} onChange={(e) => updateField('description', e.target.value)} />
        <div className="grid gap-4 md:grid-cols-2">
          <select className="input-field" value={form.ward} onChange={(e) => updateField('ward', e.target.value)} required>
            <option value="">Select your ward</option>
            {wards.map((ward) => (
              <option key={ward.number} value={`Ward ${String(ward.number).padStart(2, '0')}: ${ward.name}`}>
                Ward {String(ward.number).padStart(2, '0')}: {ward.name}
              </option>
            ))}
          </select>
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            The app uses the selected Akola ward, so GPS from another city will not affect the complaint location.
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="input-field py-2" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="btn-primary" disabled={submitting || !user}>
            {submitting ? 'Submitting...' : 'Submit Complaint'}
          </button>
          <p className="text-sm text-slate-500">
            {user ? `Signed in as ${user.name}` : 'Login required to submit and pin a complaint.'}
          </p>
        </div>
      </form>
    </div>
  );
}
