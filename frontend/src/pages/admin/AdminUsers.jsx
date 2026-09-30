import React, { useState, useEffect, useCallback } from 'react';
import userService from '../../services/userService';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { useAuth } from '../../context/AuthContext';
import { formatShortDate } from '../../utils/formatDate';
import {
  UserPlus,
  Search,
  Edit2,
  Trash2,
  ShieldCheck,
  Headphones,
  UserCheck,
  CheckCircle,
  XCircle,
  Power,
  RotateCcw,
} from 'lucide-react';

export const AdminUsers = () => {
  const { user: currentAdmin } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Add / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    department: 'General',
    phone: '',
    status: 'active',
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Status Toggle Confirm Dialog
  const [confirmToggleOpen, setConfirmToggleOpen] = useState(false);
  const [selectedUserForToggle, setSelectedUserForToggle] = useState(null);
  const [toggleLoading, setToggleLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers({
        search,
        role: 'user',
        status: statusFilter,
      });
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setEditingUserId(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      department: 'General',
      phone: '',
      status: 'active',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setIsEditing(true);
    setEditingUserId(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // optional on edit
      role: user.role,
      department: user.department || '',
      phone: user.phone || '',
      status: user.status,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.email) {
      setFormError('Name and email are required');
      return;
    }

    if (!isEditing && (!formData.password || formData.password.length < 6)) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    try {
      setModalLoading(true);
      if (isEditing) {
        await userService.updateUser(editingUserId, formData);
      } else {
        await userService.createUser(formData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      setFormError(err.message || 'Failed to save user');
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedUserForToggle) return;
    try {
      setToggleLoading(true);
      await userService.toggleUserStatus(selectedUserForToggle._id);
      setConfirmToggleOpen(false);
      setSelectedUserForToggle(null);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to change user status');
    } finally {
      setToggleLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />;
      case 'agent':
        return <Headphones className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <UserCheck className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage registered customer accounts and user profiles
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name, email, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
        </div>

        <div className="flex gap-2.5 flex-wrap">
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
              className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Phone</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    Loading users list...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No users matching criteria
                  </td>
                </tr>
              ) : (
                users.map((item) => {
                  const isSelf = currentAdmin?._id === item._id || currentAdmin?.id === item._id;

                  return (
                    <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-900">{item.name}</span>
                              {isSelf && (
                                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded-full">
                                  YOU
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-400 block">{item.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                        {item.phone || '—'}
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        {item.department || '—'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                            item.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          <span className="capitalize">{item.status}</span>
                        </span>
                      </td>

                      {/* Created Date */}
                      <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                        {formatShortDate(item.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit button */}
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Toggle Active / Inactive (Disabled for Self!) */}
                          <button
                            onClick={() => {
                              setSelectedUserForToggle(item);
                              setConfirmToggleOpen(true);
                            }}
                            disabled={isSelf}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isSelf
                                ? 'text-slate-200 cursor-not-allowed'
                                : item.status === 'active'
                                ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={
                              isSelf
                                ? 'Cannot deactivate your own account'
                                : item.status === 'active'
                                ? 'Deactivate User'
                                : 'Activate User'
                            }
                          >
                            <Power className="w-4 h-4" />
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

      {/* Add / Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit User Details' : 'Add New User'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Full Name *
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
              {isEditing ? 'New Password (Leave blank to keep current)' : 'Password *'}
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
                Account Status *
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
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Department (Optional)
            </label>
            <input
              type="text"
              placeholder="General, Sales, Accounts..."
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-sm"
            >
              {modalLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirm Status Toggle */}
      <ConfirmDialog
        isOpen={confirmToggleOpen}
        onClose={() => setConfirmToggleOpen(false)}
        onConfirm={handleToggleStatus}
        title={`${selectedUserForToggle?.status === 'active' ? 'Deactivate' : 'Activate'} User?`}
        message={`Are you sure you want to ${
          selectedUserForToggle?.status === 'active' ? 'deactivate' : 'activate'
        } ${selectedUserForToggle?.name}'s account? ${
          selectedUserForToggle?.status === 'active'
            ? 'They will immediately be blocked from logging into the platform.'
            : 'They will be allowed to log in and use the platform.'
        }`}
        confirmText={
          selectedUserForToggle?.status === 'active' ? 'Deactivate User' : 'Activate User'
        }
        danger={selectedUserForToggle?.status === 'active'}
        loading={toggleLoading}
      />
    </div>
  );
};

export default AdminUsers;
