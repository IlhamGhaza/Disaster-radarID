'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  MapPin,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/map', label: 'Peta Radar' },
  { href: '/disasters', label: 'Bencana' },
  { href: '/volcanoes', label: 'Gunung Api' },
  { href: '/safety-guide', label: 'Panduan Evakuasi' },
  { href: '/about', label: 'Tentang' },
];

const ABOUT_LINKS = [
  { href: '/about', label: 'Tentang Proyek' },
  { href: '/data-sources', label: 'Sumber Data Resmi' },
  { href: '/faq', label: 'Tanya Jawab (FAQ)' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const drawerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close menus on route change using React 19 recommended pattern
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
    setAboutDropdownOpen(false);
  }

  // Lock body & documentElement scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAboutDropdownOpen(false);
      }
    };
    if (aboutDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [aboutDropdownOpen]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  const isLinkActive = (href: string) => {
    if (href === '/map') return pathname === '/map';
    if (href === '/disasters') return pathname.startsWith('/disasters');
    if (href === '/volcanoes') return pathname.startsWith('/volcanoes') || pathname.startsWith('/advisories');
    if (href === '/about') return pathname === '/about' || pathname === '/faq' || pathname === '/data-sources';
    return pathname === href;
  };

  return (
    <>
      <header
        suppressHydrationWarning
        className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#080C14]/90 backdrop-blur-xl"
        style={{ height: 'var(--navbar-height)' }}
      >
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-transform hover:scale-[1.01]"
            aria-label="Disaster Radar Indonesia Home"
          >
            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-white/[0.1] bg-[#0D1117] shadow-sm shadow-red-500/10">
              <Image
                src="/logo-mark.png"
                alt="Disaster Radar Indonesia Logo"
                width={32}
                height={32}
                className="h-full w-full object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold tracking-tight text-[#E8ECF1] group-hover:text-[#EF4444] transition-colors duration-200">
                  DISASTER <span className="text-[#EF4444]">RADAR</span>
                </span>
                <span className="relative flex h-1.5 w-1.5" title="Pemantauan Langsung (Live)">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
                </span>
              </div>
              <span className="text-[9px] font-medium tracking-widest uppercase text-[#5A6478]">
                Monitoring Bencana
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-0.5" aria-label="Navigasi Utama">
            {NAV_LINKS.map((link) => {
              const isActive = isLinkActive(link.href);

              if (link.href === '/about') {
                return (
                  <div
                    key={link.href}
                    ref={dropdownRef}
                    className="relative"
                    onMouseEnter={() => setAboutDropdownOpen(true)}
                    onMouseLeave={() => setAboutDropdownOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => setAboutDropdownOpen((prev) => !prev)}
                      aria-expanded={aboutDropdownOpen}
                      aria-haspopup="true"
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase transition-colors rounded-md ${
                        isActive
                          ? 'text-[#E8ECF1] bg-white/[0.08]'
                          : 'text-[#8B95A7] hover:text-[#E8ECF1] hover:bg-white/[0.04]'
                      }`}
                    >
                      <span>Tentang</span>
                      <ChevronDown
                        className={`h-3 w-3 text-[#8B95A7] transition-transform duration-200 ${
                          aboutDropdownOpen ? 'rotate-180 text-[#EF4444]' : ''
                        }`}
                      />
                    </button>

                    {aboutDropdownOpen && (
                      <div className="absolute right-0 top-full pt-1.5 z-50">
                        <div className="w-52 rounded-xl border border-white/[0.1] bg-[#0D1117] p-1.5 shadow-2xl shadow-black/80 backdrop-blur-xl">
                          {ABOUT_LINKS.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setAboutDropdownOpen(false)}
                              className={`block rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                                pathname === sub.href
                                  ? 'text-[#E8ECF1] bg-white/[0.08] font-semibold'
                                  : 'text-[#8B95A7] hover:text-white hover:bg-white/[0.04]'
                              }`}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase transition-colors rounded-md ${
                    isActive
                      ? 'text-[#E8ECF1] bg-white/[0.06]'
                      : 'text-[#8B95A7] hover:text-[#E8ECF1] hover:bg-white/[0.04]'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-3 bg-[#EF4444] rounded-full" />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Primary CTA: "Cek Lokasi Saya" */}
          <div className="hidden sm:flex sm:items-center sm:gap-3">
            <Link
              href="/map"
              className="flex items-center gap-1.5 rounded-lg bg-[#EF4444] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-md shadow-red-900/30 transition-all duration-200 hover:bg-[#DC2626] hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:ring-offset-2 focus:ring-offset-[#080C14]"
            >
              <MapPin className="h-3 w-3" />
              <span>Cek Lokasi Saya</span>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-[#8B95A7] hover:bg-white/[0.04] hover:text-white transition-colors md:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={isOpen ? 'Tutup Menu Navigasi' : 'Buka Menu Navigasi'}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4 text-[#E8ECF1]" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer — Rendered OUTSIDE <header> to avoid backdrop-filter containing block trap */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu Navigasi Mobile"
        >
          {/* Dark Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-[fadeIn_150ms_ease]"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Slide-in Panel */}
          <div
            ref={drawerRef}
            id="mobile-nav-drawer"
            className="fixed right-0 top-0 bottom-0 w-[280px] max-w-[85vw] bg-[#0A0E16] border-l border-white/[0.08] shadow-2xl flex flex-col z-[10000] overflow-y-auto animate-[slideInRight_200ms_ease]"
          >
            {/* Mobile Drawer Header with Logo & Close button */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.08] shrink-0 bg-[#080C14]/90">
              <div className="flex items-center gap-2">
                <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg border border-white/[0.1] bg-[#0D1117]">
                  <Image
                    src="/logo-mark.png"
                    alt="Disaster Radar Indonesia Logo"
                    width={28}
                    height={28}
                    className="h-full w-full object-contain p-0.5"
                  />
                </div>
                <span className="text-xs font-extrabold tracking-tight text-[#E8ECF1]">
                  DISASTER <span className="text-[#EF4444]">RADAR</span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-[#8B95A7] hover:text-white hover:bg-white/[0.06] transition-colors"
                aria-label="Tutup Menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex flex-col p-4 space-y-1 flex-1">
              <Link
                href="/map"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${
                  pathname === '/map'
                    ? 'bg-red-500/10 text-red-400 border-l-2 border-red-500 pl-2.5'
                    : 'text-[#E8ECF1] hover:bg-white/[0.04]'
                }`}
              >
                <span>Peta Radar</span>
              </Link>

              <Link
                href="/disasters"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${
                  pathname.startsWith('/disasters')
                    ? 'bg-red-500/10 text-red-400 border-l-2 border-red-500 pl-2.5'
                    : 'text-[#E8ECF1] hover:bg-white/[0.04]'
                }`}
              >
                <span>Kategori Bencana</span>
              </Link>

              <Link
                href="/volcanoes"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${
                  pathname.startsWith('/volcanoes')
                    ? 'bg-red-500/10 text-red-400 border-l-2 border-red-500 pl-2.5'
                    : 'text-[#E8ECF1] hover:bg-white/[0.04]'
                }`}
              >
                <span>Gunung Api (PVMBG)</span>
              </Link>

              <Link
                href="/advisories"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${
                  pathname.startsWith('/advisories')
                    ? 'bg-red-500/10 text-red-400 border-l-2 border-red-500 pl-2.5'
                    : 'text-[#E8ECF1] hover:bg-white/[0.04]'
                }`}
              >
                <span>Advisori Abu Vulkanik</span>
              </Link>

              <Link
                href="/safety-guide"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${
                  pathname === '/safety-guide'
                    ? 'bg-red-500/10 text-red-400 border-l-2 border-red-500 pl-2.5'
                    : 'text-[#E8ECF1] hover:bg-white/[0.04]'
                }`}
              >
                <span>Panduan Evakuasi</span>
              </Link>

              <div className="h-px bg-white/[0.06] my-2" />

              <div className="px-3 py-1 text-[10px] font-mono font-bold tracking-wider uppercase text-[#5A6478]">
                Informasi & Otoritas
              </div>

              <Link
                href="/data-sources"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                  pathname === '/data-sources'
                    ? 'bg-red-500/10 text-red-400 border-l-2 border-red-500 pl-2.5'
                    : 'text-[#8B95A7] hover:text-[#E8ECF1] hover:bg-white/[0.04]'
                }`}
              >
                <span>Sumber Data Resmi</span>
              </Link>

              <Link
                href="/faq"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                  pathname === '/faq'
                    ? 'bg-red-500/10 text-red-400 border-l-2 border-red-500 pl-2.5'
                    : 'text-[#8B95A7] hover:text-[#E8ECF1] hover:bg-white/[0.04]'
                }`}
              >
                <span>FAQ</span>
              </Link>

              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-colors ${
                  pathname === '/about'
                    ? 'bg-red-500/10 text-red-400 border-l-2 border-red-500 pl-2.5'
                    : 'text-[#8B95A7] hover:text-[#E8ECF1] hover:bg-white/[0.04]'
                }`}
              >
                <span>Tentang Proyek</span>
              </Link>

              <div className="pt-4 mt-auto border-t border-white/[0.06]">
                <Link
                  href="/map"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#EF4444] py-2.5 text-center text-xs font-bold uppercase tracking-wide text-white shadow-md shadow-red-900/30 transition-colors hover:bg-[#DC2626]"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Cek Lokasi Saya</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inline keyframes for mobile drawer animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
