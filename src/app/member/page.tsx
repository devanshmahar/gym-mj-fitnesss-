'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMemberByPhone } from '@/lib/data';

export default function MemberLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 500));
    const member = getMemberByPhone(phone.trim());
    if (member) {
      sessionStorage.setItem('member_id', member.id);
      router.push('/member/portal');
    } else {
      setError('No member found with this phone number. Please contact the front desk.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-5"
        style={{backgroundImage:'linear-gradient(rgba(57,255,20,0.3) 1px, transparent 1px),linear-gradient(90deg,rgba(57,255,20,0.3) 1px,transparent 1px)',backgroundSize:'40px 40px'}}/>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-black">IRON<span className="text-accent">PEAK</span></h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Member Portal</p>
          </Link>
        </div>

        <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-accent/10 border border-accent/30 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              🏋️
            </div>
            <h2 className="text-xl font-bold">Member Login</h2>
            <p className="text-sm text-gray-500 mt-1">Enter your registered phone number to view your membership</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Your 10-digit mobile number"
                required
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white text-sm focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-accent text-black py-3 rounded-lg font-black uppercase tracking-wider hover:bg-[#2de010] transition-all btn-glow disabled:opacity-50">
              {loading ? 'Finding your account...' : 'View My Membership'}
            </button>
          </form>
        </div>

        <div className="text-center mt-4 space-y-2">
          <Link href="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors block">
            ← Back to website
          </Link>
          <p className="text-xs text-gray-700">Not a member yet?{' '}
            <a href="/#pricing" className="text-accent hover:underline">Join Now</a>
          </p>
        </div>
      </div>
    </div>
  );
}
