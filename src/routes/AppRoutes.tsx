// src/routes/AppRoutes.tsx
import { Login, Signup } from '@/features/auth/pages';
import RequireAuth from './RequireAuth';
import { Routes, Route } from 'react-router-dom';
import DashboardPage from '@/features/dashboard/pages/Dashboard';
import BrokersPage from '@/features/brokers/pages/BrokersPage';
import BrokerCallback from '@/features/brokers/pages/BrokerCallback';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<RequireAuth />}>
        {/* Add more protected routes here */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/brokers" element={<BrokersPage />} />
      <Route path="/callback" element={<BrokerCallback />} />
      </Route>
    </Routes>
  );
}

