import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ticketService from '../../services/ticketService';
import categoryService from '../../services/categoryService';
import {
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Laptop,
  Smartphone,
} from 'lucide-react';

export const CreateTicket = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'Laptop Issue',
    priority: 'Medium',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.subject.trim() || !formData.description.trim() || !formData.category) {
      setError('Please provide subject, problem type, and description');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        subject: formData.subject.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
      };

      const res = await ticketService.createTicket(payload);
      setSuccess(res.ticket);

      // Redirect after brief delay
      setTimeout(() => {
        navigate(`/user/tickets/${res.ticket.ticketId || res.ticket._id}`);
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to submit ticket');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Create Support Ticket
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Submit your laptop or mobile issue and our support team will help you
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-emerald-900">Ticket Created Successfully</h4>
            <p className="text-xs text-emerald-700 mt-0.5">
              Assigned Ticket ID:{' '}
              <strong className="font-mono bg-emerald-100/80 px-1.5 py-0.5 rounded">
                {success.ticketId}
              </strong>
              . Redirecting to ticket details...
            </p>
          </div>
        </div>
      )}

      {/* Ticket Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6"
      >
        {/* ONLY 2 CHOICES: Laptop or Mobile */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Select Problem Device (Kisme problem hai?) *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Laptop Option */}
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, category: 'Laptop Issue' }))}
              className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3.5 cursor-pointer ${
                formData.category === 'Laptop Issue'
                  ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  formData.category === 'Laptop Issue'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <h4
                  className={`text-sm font-bold ${
                    formData.category === 'Laptop Issue' ? 'text-indigo-900' : 'text-slate-800'
                  }`}
                >
                  💻 Laptop Problem
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Screen, battery, keyboard, speed, heat etc.
                </p>
              </div>
            </button>

            {/* Mobile Option */}
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, category: 'Mobile Issue' }))}
              className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3.5 cursor-pointer ${
                formData.category === 'Mobile Issue'
                  ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                  formData.category === 'Mobile Issue'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4
                  className={`text-sm font-bold ${
                    formData.category === 'Mobile Issue' ? 'text-indigo-900' : 'text-slate-800'
                  }`}
                >
                  📱 Mobile Problem
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Display, charging, network, apps etc.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Subject (Problem Title) *
          </label>
          <input
            type="text"
            name="subject"
            required
            placeholder="Enter problem title"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Priority (Urgency) *
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Description (Problem Detail) *
          </label>
          <textarea
            name="description"
            required
            rows={5}
            placeholder="Describe your issue..."
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-y"
          />
        </div>



        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-600/25 transition-all"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <PlusCircle className="w-4 h-4" />
            )}
            <span>Submit Ticket</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;
