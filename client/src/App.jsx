import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import ReportIssuePage from './pages/ReportIssuePage';
import ComplaintDetailsPage from './pages/ComplaintDetailsPage';
import CitizenDashboard from './pages/CitizenDashboard';
import WardCheckPage from './pages/WardCheckPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="ward-check" element={<WardCheckPage />} />
        <Route path="report" element={<ReportIssuePage />} />
        <Route path="complaints/:id" element={<ComplaintDetailsPage />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={["citizen", "admin"]}>
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
