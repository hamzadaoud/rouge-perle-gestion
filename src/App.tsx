
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import OrdersPage from './pages/OrdersPage';
import TimeTrackingPage from './pages/TimeTrackingPage';
import AgentsPage from './pages/AgentsPage';
import InvoicesPage from './pages/InvoicesPage';
import RevenuePage from './pages/RevenuePage';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProductsPage from './pages/ProductsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/time-tracking" element={<TimeTrackingPage />} />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/revenue" element={<RevenuePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
