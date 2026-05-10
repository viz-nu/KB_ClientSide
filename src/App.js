import { ApolloProvider } from '@apollo/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { apolloClient } from './apollo/client';
import { AuthProvider, useAuth } from './hooks/useAuth.js';
import './styles/globals.css';

import Sidebar from './components/layout/Sidebar.jsx';
import Topbar  from './components/layout/Topbar.jsx';
import LoginPage from './pages/LoginPage.jsx';

import { SystemOverview, UserManagement } from './pages/system_admin/SystemAdminPages.jsx';


import PAEntries from './pages/project_admin/entries/PAEntries.jsx';
import PAOverview from './pages/project_admin/overview/PAOverview.jsx';
import ReportsDashboard from './pages/project_admin/reports/ReportsDashboard.jsx';
import GISDashboard from './pages/project_admin/gis/GISDashboard.jsx';
import SpanManagement from './pages/project_admin/spans/SpanManagement.jsx';
import EngineerManagement from './pages/project_admin/engineers/EngineerManagement.jsx';



import FEDashboard from './pages/field_engineer/dashboard/FEDashboard.jsx';
import MyEntries from './pages/field_engineer/entries/MyEntries.jsx';

import NewEmbEntry from './pages/field_engineer/new-entry/NewEmbEntry.jsx';
import ProjectManagement from './pages/project_admin/builder/ProjectBuilder.jsx';

function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Topbar />
        <div className="page-content">
          <AppRoutes />
        </div>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  if (user?.role === 'system_admin') return (
    <Routes>
      <Route path="/dashboard" element={<SystemOverview />} />
      <Route path="/users"     element={<UserManagement />} />
      <Route path="*"          element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );

  if (user?.role === 'project_admin') return (
    <Routes>
      <Route path="/dashboard" element={<PAOverview />} />
      <Route path="/entries"   element={<PAEntries />} />
      <Route path="/engineers" element={<EngineerManagement />} />
      <Route path="/spans"     element={<SpanManagement />} />
      <Route path="/gis"       element={<GISDashboard />} />
      <Route path="/reports"   element={<ReportsDashboard />} />
      <Route path="/projects"  element={<ProjectManagement />} />
      <Route path="*"          element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );

  if (user?.role === 'field_engineer') return (
    <Routes>
      <Route path="/dashboard"  element={<FEDashboard />} />
      <Route path="/my-entries" element={<MyEntries />} />
      <Route path="/new-entry"  element={<NewEmbEntry />} />
      <Route path="*"           element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );

  return <Navigate to="/login" replace />;
}

function Guard() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="*"      element={user ? <AppLayout /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <BrowserRouter>
          <Guard />
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}
