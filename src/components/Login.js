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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#F4F1EA' }}>
      {/* Grid background */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(#1C1C1C 1px,transparent 1px),linear-gradient(90deg,#1C1C1C 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-[12px] bg-white border-2 border-[#1C1C1C] mb-4" style={{ boxShadow: '4px 4px 0px #1C1C1C' }}>
            <span className="text-[32px] font-bold text-[#1C1C1C]" style={{ fontFamily: 'DM Sans, sans-serif' }}>∑</span>
          </div>
          <h1 className="text-[32px] font-bold tracking-tight text-[#1C1C1C]" style={{ fontFamily: 'DM Sans, sans-serif' }}>MathSim <span style={{ color: '#A8D5D2' }}>Nexus</span></h1>
          <p className="text-[14px] text-[#1C1C1C] mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>Mathematical Laboratory</p>
        </div>

        {/* Card */}
        <div className="bg-white border-2 border-[#1C1C1C] rounded-[12px] p-8 shadow-2xl" style={{ boxShadow: '4px 4px 0px #1C1C1C' }}>
          <h2 className="text-lg font-bold text-[#1C1C1C] mb-6" style={{ fontFamily: 'DM Sans, sans-serif' }}>Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-[#1C1C1C] mb-1 font-medium uppercase" style={{ fontFamily: 'DM Sans, sans-serif' }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-white border-2 border-[#1C1C1C] rounded-[8px] px-4 py-2.5 text-[#1C1C1C] text-sm focus:outline-none focus:border-[#A8D5D2] transition placeholder-[#1C1C1C]/50"
                style={{ fontFamily: 'Inter, sans-serif', boxShadow: 'inset 2px 2px 0px rgba(0,0,0,0.1)' }}
                placeholder="Enter username"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-xs text-[#1C1C1C] mb-1 font-medium uppercase" style={{ fontFamily: 'DM Sans, sans-serif' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white border-2 border-[#1C1C1C] rounded-[8px] px-4 py-2.5 text-[#1C1C1C] text-sm focus:outline-none focus:border-[#A8D5D2] transition placeholder-[#1C1C1C]/50"
                style={{ fontFamily: 'Inter, sans-serif', boxShadow: 'inset 2px 2px 0px rgba(0,0,0,0.1)' }}
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p className="text-[#1C1C1C] text-xs bg-white border-2 border-[#1C1C1C] rounded-[8px] px-3 py-2" style={{ fontFamily: 'Inter, sans-serif' }}>{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A8D5D2] hover:bg-[#CFA8B8] disabled:opacity-50 text-[#1C1C1C] font-bold rounded-[8px] py-2.5 text-sm transition-all duration-200 border-2 border-[#1C1C1C] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1C1C1C]"
              style={{ fontFamily: 'DM Sans, sans-serif', boxShadow: '4px 4px 0px #1C1C1C' }}
            >
              {loading ? 'Authenticating...' : 'Launch'}
            </button>
          </form>
          <p className="text-center text-[#1C1C1C] text-xs mt-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            New here?{' '}
            <button 
              onClick={onGoRegister} 
              className="text-[#A8D5D2] hover:text-[#CFA8B8] transition font-medium border-b-2 border-transparent hover:border-[#A8D5D2]"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Create account →
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
