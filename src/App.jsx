import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BookingPage } from './pages/BookingPage';
import { Dashboard } from './components/admin/Dashboard';
import { AdminProfile } from './components/admin/AdminProfile';
import { ServiceManagement } from './components/admin/ServiceManagement';
import { StaffManagement } from './components/admin/StaffManagement';
import { ClientManagement } from './components/admin/ClientManagement';
import { GlobalSettings } from './components/admin/GlobalSettings';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<BookingPage />} />
        
        {/* Admin Routes (Acceso directo para DEMO) */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/login" element={<Navigate to="/admin" />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/services" element={<ServiceManagement />} />
        <Route path="/admin/staff" element={<StaffManagement />} />
        <Route path="/admin/clients" element={<ClientManagement />} />
        <Route path="/admin/settings" element={<GlobalSettings />} />

        {/* Catch-all: redirect everything to home */}
        <Route path="*" element={<BookingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
