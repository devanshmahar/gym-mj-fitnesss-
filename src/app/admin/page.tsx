'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin, isAdminLoggedIn } from '@/lib/data';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn()) router.replace('/admin/dashboard');
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 500));
    if (adminLogin(username, password)) {
      router.push('/admin/dashboard');
    } else {
      setError('Invalid credentials. Try admin / gym@2024');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5"
        style={{backgroundImage:'linear-gradient(rgba(57,255,20,0.3) 1px, transparent 1px),linear-gradient(90deg,rgba(57,255,20,0.3) 1px,transparent 1px)',backgroundSize:'40px 40px'}}/>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-block">
            <h1 className="text-3xl font-black">IRON<span className="text-accent">PEAK</span></h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Admin Portal</p>
          </a>
        </div>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-1">Staff Login</h2>
          <p className="text-sm text-gray-500 mb-6">Enter your credentials to access the dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm focus:border-accent focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-black py-3 rounded-lg font-black uppercase tracking-wider hover:bg-[#2de010] transition-all btn-glow disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#1a1a1a] text-center">
            <p className="text-xs text-gray-600">
              Demo: <span className="text-gray-400">admin</span> / <span className="text-gray-400">gym@2024</span>
            </p>
          </div>
        </div>

        <div className="text-center mt-4">
          <a href="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
}
