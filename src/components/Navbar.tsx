'use client';
import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { label: 'Home',        href: '#home'        },
  { label: 'About',       href: '#about'       },
  { label: 'Facilities',  href: '#facilities'  },
  { label: 'Trainers',    href: '#trainers'    },
  { label: 'Pricing',     href: '#pricing'     },
  { label: 'Testimonials',href: '#testimonials'},
  { label: 'Contact',     href: '#contact'     },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight">
              MJ<span className="text-accent"> FITNESS</span>
            </span>
            <span className="text-xs text-[#555] font-semibold tracking-widest uppercase mt-1">Dehradun</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <a key={l.href} href={l.href}
                className="nav-link text-sm font-semibold text-gray-300 tracking-wide uppercase">
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA + Admin */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/admin"
              className="text-xs font-semibold text-[#555] hover:text-accent transition-colors uppercase tracking-widest">
              Admin
            </Link>
            <a href="#pricing"
              className="bg-accent text-black px-5 py-2 rounded font-bold text-sm uppercase tracking-wider hover:bg-[#2de010] transition-colors btn-glow">
              Join Now
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1.5 p-2 group" aria-label="Menu">
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`}/>
            <span className={`block w-6 h-0.5 bg-accent transition-all duration-300 ${open ? 'opacity-0' : ''}`}/>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`}/>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#111] border-t border-[#1a1a1a] px-4 py-4 space-y-3">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block text-sm font-semibold text-gray-300 uppercase tracking-wide hover:text-accent transition-colors py-1">
              {l.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <Link href="/admin" onClick={() => setOpen(false)}
              className="text-xs font-semibold text-[#555] hover:text-accent transition-colors uppercase">
              Admin
            </Link>
            <a href="#pricing" onClick={() => setOpen(false)}
              className="bg-accent text-black px-4 py-2 rounded font-bold text-sm uppercase tracking-wide">
              Join Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
