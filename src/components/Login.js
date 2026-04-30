import React, { useState } from 'react';
import { loginUser } from '../auth';

export default function Login({ onLogin, onGoRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Both fields are required.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = loginUser(username.trim(), password);
      setLoading(false);
      if (!result.success) {
        setError(result.error);
      } else {
        onLogin(result.user);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'linear-gradient(#1e293b 1px,transparent 1px),linear-gradient(90deg,#1e293b 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border border-cyan-500/30 mb-4">
            <span className="text-3xl">∑</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">MathSim <span className="text-cyan-400">Nexus</span></h1>
          <p className="text-slate-400 text-sm mt-1">Mathematical Laboratory</p>
        </div>

        {/* Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1 uppercase tracking-widest">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition placeholder-slate-600"
                placeholder="Enter username"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1 uppercase tracking-widest">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition placeholder-slate-600"
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg py-2.5 text-sm transition-all duration-200 shadow-lg shadow-cyan-500/20"
            >
              {loading ? 'Authenticating...' : 'Launch'}
            </button>
          </form>
          <p className="text-center text-slate-500 text-xs mt-6">
            New here?{' '}
            <button onClick={onGoRegister} className="text-cyan-400 hover:text-cyan-300 transition">
              Create account →
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
