import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import SimulatorView from './components/SimulatorView';

export default function App() {
  const [page, setPage] = useState('login'); // 'login' | 'register' | 'dashboard' | 'simulator'
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSimulator, setActiveSimulator] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem('mathsim_session');
    if (session) {
      const user = JSON.parse(session);
      setCurrentUser(user);
      setPage('dashboard');
    }
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem('mathsim_session', JSON.stringify(user));
    setCurrentUser(user);
    setPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('mathsim_session');
    setCurrentUser(null);
    setPage('login');
  };

  const openSimulator = (sim) => {
    setActiveSimulator(sim);
    setPage('simulator');
  };

  const closeSimulator = () => {
    setActiveSimulator(null);
    setPage('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-mono">
      {page === 'login' && <Login onLogin={handleLogin} onGoRegister={() => setPage('register')} />}
      {page === 'register' && <Register onRegistered={handleLogin} onGoLogin={() => setPage('login')} />}
      {page === 'dashboard' && (
        <Dashboard user={currentUser} onLogout={handleLogout} onOpenSimulator={openSimulator} />
      )}
      {page === 'simulator' && activeSimulator && (
        <SimulatorView user={currentUser} simulator={activeSimulator} onBack={closeSimulator} />
      )}
    </div>
  );
}
