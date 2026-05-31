import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, 
  Lock, 
  User, 
  AlertCircle,
  HelpCircle,
  CheckCircle,
  Database
} from 'lucide-react';
import { Employee } from '../types/database.types';
import { mockDB, useMockMode, getActiveCredentials, setForceMock } from '../services/supabase';

interface LoginProps {
  onLoginSuccess: (user: Employee) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [showCreds, setShowCreds] = React.useState(false);
  const [activeMode, setActiveMode] = React.useState(getActiveCredentials());
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      // Authenticate via our custom layer
      const user = await mockDB.login(username, password);
      
      // For mock testing, accept password123.
      if (useMockMode() && password !== 'password123') {
        setError('Incorrect password. For mock testing, use "password123".');
        return;
      }

      onLoginSuccess(user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    }
  };

  const fillCredentials = (user: string) => {
    setUsername(user);
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gov-navy flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Monogram Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,58,138,0.2),rgba(2,12,27,1))] pointer-events-none"></div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="bg-gov-gold/15 p-4 rounded-2xl border-2 border-gov-gold/50 flex items-center justify-center animate-bounce shadow-gold-glow">
            <Building size={48} className="text-gov-gold" />
          </div>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-display font-black tracking-tight text-white">
          SALMS GATEWAY
        </h2>
        <p className="mt-2 text-center text-xs text-slate-400 font-bold uppercase tracking-wider">
          Staff Attendance, Leave & Management System
        </p>
        <p className="text-[10px] text-center text-gov-gold font-semibold tracking-wide">
          Government Office Administration Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-8 px-4 shadow-2xl rounded-2xl sm:px-10 border border-slate-200">
          
          {/* Connection Status Box */}
          <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <Database size={13} className={activeMode.isMock ? 'text-amber-500' : 'text-emerald-500'} />
              <span>
                Mode: <strong>{activeMode.isMock ? 'Stateful Mock DB' : 'Live Supabase'}</strong>
              </span>
            </div>
            <button 
              onClick={() => {
                setForceMock(!activeMode.isMock);
              }}
              className="text-[10px] font-bold text-gov-navy hover:text-gov-navy-light underline cursor-pointer"
            >
              Switch to {activeMode.isMock ? 'Live' : 'Mock'}
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg text-xs flex items-center space-x-2">
              <AlertCircle size={16} className="text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="username" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Username or Employee Number
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={16} />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. rootadmin or EMP003"
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-navy/20 focus:border-gov-navy"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="gov-btn-primary w-full flex justify-center py-2.5 text-sm cursor-pointer shadow-md hover:shadow-lg"
              >
                Sign In to Gateway
              </button>
            </div>
          </form>

          {/* Expandable Mock Credentials Drawer */}
          <div className="mt-8 border-t border-slate-200 pt-4">
            <button
              onClick={() => setShowCreds(!showCreds)}
              className="w-full flex items-center justify-between text-xs font-semibold text-slate-500 hover:text-gov-navy cursor-pointer"
            >
              <span className="flex items-center">
                <HelpCircle size={14} className="mr-1.5" />
                Testing & Mock Accounts List
              </span>
              <span>{showCreds ? 'Hide' : 'Show'}</span>
            </button>
            
            {showCreds && (
              <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2 text-xs text-slate-600 animate-[fadeIn_0.2s_ease-out]">
                <p className="font-semibold text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">
                  Click an account below to auto-fill:
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => fillCredentials('rootadmin')}
                    className="p-2 border rounded-lg bg-white hover:bg-slate-100 hover:border-slate-300 text-left cursor-pointer"
                  >
                    <span className="font-bold block text-rose-700">Root Admin</span>
                    <span className="text-[10px] text-slate-500">username: rootadmin</span>
                  </button>

                  <button
                    onClick={() => fillCredentials('admin')}
                    className="p-2 border rounded-lg bg-white hover:bg-slate-100 hover:border-slate-300 text-left cursor-pointer"
                  >
                    <span className="font-bold block text-gov-gold-dark">Admin</span>
                    <span className="text-[10px] text-slate-500">username: admin</span>
                  </button>

                  <button
                    onClick={() => fillCredentials('emp_perm')}
                    className="p-2 border rounded-lg bg-white hover:bg-slate-100 hover:border-slate-300 text-left cursor-pointer"
                  >
                    <span className="font-bold block text-blue-700">Employee (Perm)</span>
                    <span className="text-[10px] text-slate-500">username: emp_perm</span>
                  </button>

                  <button
                    onClick={() => fillCredentials('emp_dw')}
                    className="p-2 border rounded-lg bg-white hover:bg-slate-100 hover:border-slate-300 text-left cursor-pointer"
                  >
                    <span className="font-bold block text-purple-700">Employee (Dw)</span>
                    <span className="text-[10px] text-slate-500">username: emp_dw</span>
                  </button>
                </div>
                
                <p className="text-[10px] text-slate-400 mt-2 text-center">
                  All accounts use password: <strong className="text-slate-600">password123</strong>
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
