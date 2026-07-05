import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import TicketDetail from './pages/TicketDetail';
import CreateTicket from './pages/CreateTicket';
import AdminUsers from './pages/AdminUsers';

const AppRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-center">Loading...</div>;

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/tickets" element={<PrivateRoute><Tickets /></PrivateRoute>} />
        <Route path="/tickets/new" element={<PrivateRoute><CreateTicket /></PrivateRoute>} />
        <Route path="/tickets/:id" element={<PrivateRoute><TicketDetail /></PrivateRoute>} />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute roles={['admin']}>
              <AdminUsers />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
