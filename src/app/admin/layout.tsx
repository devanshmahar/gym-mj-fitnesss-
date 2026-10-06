'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { isAdminLoggedIn, adminLogout } from '@/lib/data';

const navItems = [
  { label: 'Dashboard',     href: '/admin/dashboard',       icon: '📊' },
  { label: 'Members',       href: '/admin/members',         icon: '👥' },
  { label: 'Add Member',    href: '/admin/members/add',     icon: '➕' },
  { label: 'Workout Plans', href: '/admin/workout-plans',   icon: '🏋️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (pathname !== '/admin' && !isAdminLoggedIn()) {
      router.replace('/admin');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    adminLogout();
    router.push('/admin');
  };

  if (pathname === '/admin') return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Logo */}
        <div className="p-6 border-b border-[#1a1a1a]">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-black">IRON<span className="text-accent">PEAK</span></span>
          </Link>
          <p className="text-xs text-gray-600 mt-0.5 uppercase tracking-widest">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                pathname === item.href || pathname.startsWith(item.href + '/')
                  ? 'bg-accent text-black'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
              }`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#1a1a1a] space-y-2">
          <Link href="/member"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-semibold text-gray-500 hover:text-white hover:bg-[#1a1a1a] transition-all">
            <span>🔗</span><span>Member Portal</span>
          </Link>
          <Link href="/"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-semibold text-gray-500 hover:text-white hover:bg-[#1a1a1a] transition-all">
            <span>🌐</span><span>Public Website</span>
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
            <span>🚪</span><span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}/>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#0d0d0d]/90 backdrop-blur border-b border-[#1a1a1a] h-16 flex items-center px-4 sm:px-6 gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-gray-400 hover:text-white p-2" aria-label="Menu">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <div className="flex-1"/>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600 hidden sm:block">Logged in as</span>
            <span className="text-xs font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
