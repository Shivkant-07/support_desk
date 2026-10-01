import React, { useState, useEffect, useCallback } from 'react';
import agentService from '../../services/agentService';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatShortDate } from '../../utils/formatDate';
import {
  Headphones,
  UserPlus,
  Search,
  Edit2,
  Power,
  RotateCcw,
  Clock,
  CheckCircle2,
  Ticket,
  Trash2,
} from 'lucide-react';

export const AdminAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Add / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Technical Support',
    phone: '',
    status: 'active',
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Status Toggle Confirm Dialog
  const [confirmToggleOpen, setConfirmToggleOpen] = useState(false);
  const [selectedAgentForToggle, setSelectedAgentForToggle] = useState(null);
  const [toggleLoading, setToggleLoading] = useState(false);

  // Delete Confirm Dialog
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedAgentForDelete, setSelectedAgentForDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await agentService.getAgents({
        search,
        status: statusFilter,
      });
      setAgents(data.agents || []);
    } catch (err) {
      console.error('Error fetching agents:', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);



  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingAgentId(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      department: 'Technical Support',
      phone: '',
      status: 'active',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (agent) => {
    setIsEditing(true);
    setEditingAgentId(agent._id);
    setFormData({
      name: agent.name,
      email: agent.email,
      password: '',
      department: agent.department || 'Technical Support',
      phone: agent.phone || '',
      status: agent.status,
    });
    setFormError('');
    setIsModalOpen(true);
  };







  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.email) {
      setFormError('Agent name and email are required');
      return;
    }

    if (!isEditing && (!formData.password || formData.password.length < 6)) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    try {
      setModalLoading(true);
      if (isEditing) {
        await agentService.updateAgent(editingAgentId, formData);
      } else {
        await agentService.createAgent(formData);
      }
      setIsModalOpen(false);
      fetchAgents();
    } catch (err) {
      setFormError(err.message || 'Failed to save agent');
    } finally {
      setModalLoading(false);
    }
  };






  const handleToggleStatus = async () => {
    if (!selectedAgentForToggle) return;
    try {
      setToggleLoading(true);
      await agentService.toggleAgentStatus(selectedAgentForToggle._id);
      setConfirmToggleOpen(false);
      setSelectedAgentForToggle(null);
      fetchAgents();
    } catch (err) {
      alert(err.message || 'Failed to toggle status');
    } finally {
      setToggleLoading(false);
    }
  };

  const handleDeleteAgent = async () => {
    if (!selectedAgentForDelete) return;
    try {
      setDeleteLoading(true);
      await agentService.deleteAgent(selectedAgentForDelete._id);
      setConfirmDeleteOpen(false);
      setSelectedAgentForDelete(null);
      fetchAgents();
    } catch (err) {
      alert(err.message || 'Failed to delete agent');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Support Agent Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor workloads, assign queues, and configure agent personnel
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Support Agent</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search agents by name, email, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {(search || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
              }}
              className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Agents Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Agent Name</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Workload Metrics</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    Loading agent directory...
                  </td>
                </tr>
              ) : agents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No support agents found
                  </td>
                </tr>
              ) : (
                agents.map((agent) => {
                  const workload = agent.workload || {
                    total: 0,
                    open: 0,
                    inProgress: 0,
                    resolved: 0,
                  };

                  return (
                    <tr key={agent._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                            {agent.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block">{agent.name}</span>
                            <span className="text-xs text-slate-400">{agent.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                        {agent.department || 'Technical Support'}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full"
                            title="In Progress"
                          >
                            <Clock className="w-3 h-3" />
                            {workload.inProgress} active
                          </span>
                          <span
                            className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full"
                            title="Resolved"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {workload.resolved} resolved
                          </span>
                          <span className="text-xs text-slate-400">({workload.total} total)</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                            agent.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              agent.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          <span className="capitalize">{agent.status}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {formatShortDate(agent.createdAt)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(agent)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit Agent"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAgentForToggle(agent);
                              setConfirmToggleOpen(true);
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              agent.status === 'active'
                                ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={agent.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAgentForDelete(agent);
                              setConfirmDeleteOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Agent"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>



      {/* Add / Edit Agent Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Agent Profile' : 'Add New Support Agent'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Agent Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              {isEditing ? 'New Password (Leave blank to keep existing)' : 'Temporary Password *'}
            </label>
            <input
              type="password"
              placeholder={isEditing ? '••••••••' : 'Min 6 characters'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none"
              >



                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Phone
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={modalLoading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-sm"
            >
              {modalLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Agent'}
            </button>
          </div>
        </form>
      </Modal>



      {/* Confirm Status Toggle */}
      <ConfirmDialog
        isOpen={confirmToggleOpen}
        onClose={() => setConfirmToggleOpen(false)}
        onConfirm={handleToggleStatus}
        title={`${selectedAgentForToggle?.status === 'active' ? 'Deactivate' : 'Activate'} Agent?`}
        message={`Are you sure you want to ${
          selectedAgentForToggle?.status === 'active' ? 'deactivate' : 'activate'
        } ${selectedAgentForToggle?.name}? Deactivated agents will not be able to log in or be assigned new tickets.`}
        confirmText={
          selectedAgentForToggle?.status === 'active' ? 'Deactivate Agent' : 'Activate Agent'
        }
        danger={selectedAgentForToggle?.status === 'active'}
        loading={toggleLoading}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDeleteAgent}
        title="Delete Agent?"
        message={`Are you sure you want to permanently delete ${selectedAgentForDelete?.name}? Any assigned tickets will be unassigned.`}
        confirmText="Delete Agent"
        danger={true}
        loading={deleteLoading}
      />
    </div>
  );
};

export default AdminAgents;
