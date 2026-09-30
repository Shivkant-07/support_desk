import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// User Pages
import UserDashboard from '../pages/user/UserDashboard';
import CreateTicket from '../pages/user/CreateTicket';
import MyTickets from '../pages/user/MyTickets';
import UserTicketDetails from '../pages/user/UserTicketDetails';

// Agent Pages
import AgentDashboard from '../pages/agent/AgentDashboard';
import AgentTickets from '../pages/agent/AgentTickets';
import AgentTicketDetails from '../pages/agent/AgentTicketDetails';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminTickets from '../pages/admin/AdminTickets';
import AdminTicketDetails from '../pages/admin/AdminTicketDetails';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminAgents from '../pages/admin/AdminAgents';
import AdminCategories from '../pages/admin/AdminCategories';

// Shared Pages
import Profile from '../pages/shared/Profile';
import NotFound from '../pages/shared/NotFound';

// Smart Home redirection based on role
const RootRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'agent') return <Navigate to="/agent/dashboard" replace />;
  return <Navigate to="/user/dashboard" replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root smart redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Authenticated Application Routes */}
      <Route element={<MainLayout />}>
        {/* User Protected Routes */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/tickets"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <MyTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/tickets/new"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <CreateTicket />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/tickets/:id"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserTicketDetails />
            </ProtectedRoute>
          }
        />

        {/* Agent Protected Routes */}
        <Route
          path="/agent/dashboard"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <AgentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/tickets"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <AgentTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/tickets/:id"
          element={
            <ProtectedRoute allowedRoles={['agent']}>
              <AgentTicketDetails />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tickets"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tickets/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminTicketDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/agents"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAgents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminCategories />
            </ProtectedRoute>
          }
        />

        {/* Shared Authenticated Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['user', 'agent', 'admin']}>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
