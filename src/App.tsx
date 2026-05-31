import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { Attendance } from './pages/Attendance';
import { Leaves } from './pages/Leaves';
import { Approvals } from './pages/Approvals';
import { EmployeeManagement } from './pages/EmployeeManagement';
import { HolidayManagement } from './pages/HolidayManagement';
import { Reports } from './pages/Reports';
import { Layout } from './components/Layout';
import { Employee } from './types/database.types';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = React.useState<Employee | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const savedUser = localStorage.getItem('salms_current_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        // Self-healing: clear the session if the cached user is from the old HRM schema
        if (!parsed || !parsed.date_of_birth) {
          throw new Error('Stale user session');
        }
        setCurrentUser(parsed);
      } catch (e) {
        console.warn('Clearing stale user session cache.');
        localStorage.removeItem('salms_current_user');
        setCurrentUser(null);
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (user: Employee) => {
    setCurrentUser(user);
    localStorage.setItem('salms_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('salms_current_user');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gov-navy flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-gov-gold border-t-transparent animate-spin"></div>
          <p className="text-white text-xs font-bold uppercase tracking-wider">Loading Gateway Session...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Routes>
        {/* Unprotected Login Route */}
        <Route 
          path="/login" 
          element={
            currentUser ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLoginSuccess} />
          } 
        />

        {/* Protected Layout Routes */}
        <Route 
          path="/*" 
          element={
            currentUser ? (
              <Layout user={currentUser} onLogout={handleLogout}>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard user={currentUser} />} />
                  <Route path="/profile" element={<Profile user={currentUser} />} />
                  <Route path="/attendance" element={<Attendance user={currentUser} />} />
                  <Route path="/leaves" element={<Leaves user={currentUser} />} />
                  
                  {/* Admin Only Routes */}
                  {(currentUser.role === 'root_admin' || currentUser.role === 'admin') && (
                    <>
                      <Route path="/approvals" element={<Approvals user={currentUser} />} />
                      <Route path="/employee-management" element={<EmployeeManagement />} />
                      <Route path="/holidays" element={<HolidayManagement />} />
                    </>
                  )}
                  
                  <Route path="/reports" element={<Reports />} />
                  
                  {/* Default fallback */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
