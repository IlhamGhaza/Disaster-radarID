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
  { href: '/map', label: 'Peta' },
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
        className="pointer-events-none sticky top-0 z-50 w-full px-3 pt-3 sm:px-6"
        style={{ height: 'var(--navbar-height)' }}
      >
        {/* Pulau navbar: pill mengambang, kaca hanya di elemen sticky ini */}
        <div className="pointer-events-auto mx-auto flex h-14 w-full max-w-6xl items-center justify-between rounded-full bg-bg/70 py-1.5 pl-2 pr-1.5 shadow-float backdrop-blur-xl backdrop-saturate-150">
          {/* Brand */}
          <Link
            href="/"
            className="group flex min-h-tap items-center gap-2.5 rounded-full pr-2"
            aria-label="Disaster Radar Indonesia Home"
          >
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-surface shadow-core">
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
              <span className="text-[16px] font-semibold leading-tight tracking-[-0.01em] text-fg-1">
                Disaster Radar
              </span>
              <span className="text-label font-normal text-fg-3">
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
                      className={`flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[15px] transition-colors duration-120 ease-data ${
                        isActive
                          ? 'bg-shell font-medium text-fg-1 shadow-core'
                          : 'text-fg-2 hover:bg-shell hover:text-fg-1'
                      }`}
                    >
                      <span>Tentang</span>
                      <ChevronDown
                        aria-hidden="true"
                        className={`h-4 w-4 text-fg-3 transition-transform duration-160 ease-data ${aboutDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {aboutDropdownOpen && (
                      <div className="absolute right-0 top-full pt-3 z-50">
                        <div className="w-60 rounded-3xl bg-raised p-1.5 shadow-float">
                          {ABOUT_LINKS.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setAboutDropdownOpen(false)}
                              aria-current={pathname === sub.href ? 'page' : undefined}
                              className={`flex min-h-11 items-center rounded-2xl px-3.5 text-[15px] transition-colors duration-120 ${
                                pathname === sub.href
                                  ? 'bg-surface font-semibold text-fg-1'
                                  : 'text-fg-2 hover:bg-surface hover:text-fg-1'
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
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative flex h-10 items-center rounded-full px-3.5 text-[15px] transition-colors duration-120 ease-data ${
                    isActive
                      ? 'bg-shell font-medium text-fg-1 shadow-core'
                      : 'text-fg-2 hover:bg-shell hover:text-fg-1'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Primary CTA: "Cek Lokasi Saya" */}
          <div className="hidden sm:flex sm:items-center sm:gap-3">
            <Link
              href="/map"
              className="group flex h-11 items-center gap-2 rounded-full bg-accent py-1.5 pl-4 pr-1.5 text-[15px] font-semibold text-fg-inverse transition-colors duration-160 ease-data hover:bg-accent-hover active:scale-[0.98]"
            >
              <span>Buka peta</span>
              <span className="pill-icon bg-fg-inverse/15">
                <MapPin className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex size-tap items-center justify-center rounded-full bg-shell text-fg-1 shadow-core transition-colors duration-120 hover:bg-surface md:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={isOpen ? 'Tutup Menu Navigasi' : 'Buka Menu Navigasi'}
          >
            {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
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
            className="fixed inset-0 bg-bg/85 animate-[fadeIn_160ms_ease-out] motion-reduce:animate-none"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Slide-in Panel */}
          <div
            ref={drawerRef}
            id="mobile-nav-drawer"
            className="fixed right-0 top-0 bottom-0 z-[10000] flex w-[300px] max-w-[85vw] flex-col overflow-y-auto border-l border-line-strong bg-surface animate-[slideInRight_160ms_ease-out] motion-reduce:animate-none"
          >
            {/* Mobile Drawer Header with Logo & Close button */}
            <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-control border border-line bg-bg">
                  <Image
                    src="/logo-mark.png"
                    alt="Disaster Radar Indonesia Logo"
                    width={28}
                    height={28}
                    className="h-full w-full object-contain p-0.5"
                  />
                </div>
                <span className="text-[17px] font-bold text-fg-1">Disaster Radar</span>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                autoFocus
                className="flex size-tap items-center justify-center rounded-control text-fg-2 transition-colors duration-120 hover:bg-raised hover:text-fg-1"
                aria-label="Tutup Menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex flex-1 flex-col gap-0.5 p-3">
              <Link
                href="/map"
                onClick={() => setIsOpen(false)}
                className={`flex min-h-tap items-center justify-between rounded-control px-3 text-body font-semibold transition-colors duration-120 ${
                  pathname === '/map'
                    ? 'border-l-2 border-accent bg-raised pl-2.5 text-fg-1'
                    : 'text-fg-1 hover:bg-raised'
                }`}
              >
                <span>Peta</span>
              </Link>

              <Link
                href="/disasters"
                onClick={() => setIsOpen(false)}
                className={`flex min-h-tap items-center justify-between rounded-control px-3 text-body font-semibold transition-colors duration-120 ${
                  pathname.startsWith('/disasters')
                    ? 'border-l-2 border-accent bg-raised pl-2.5 text-fg-1'
                    : 'text-fg-1 hover:bg-raised'
                }`}
              >
                <span>Kategori Bencana</span>
              </Link>

              <Link
                href="/volcanoes"
                onClick={() => setIsOpen(false)}
                className={`flex min-h-tap items-center justify-between rounded-control px-3 text-body font-semibold transition-colors duration-120 ${
                  pathname.startsWith('/volcanoes')
                    ? 'border-l-2 border-accent bg-raised pl-2.5 text-fg-1'
                    : 'text-fg-1 hover:bg-raised'
                }`}
              >
                <span>Gunung Api (PVMBG)</span>
              </Link>

              <Link
                href="/advisories"
                onClick={() => setIsOpen(false)}
                className={`flex min-h-tap items-center justify-between rounded-control px-3 text-body font-semibold transition-colors duration-120 ${
                  pathname.startsWith('/advisories')
                    ? 'border-l-2 border-accent bg-raised pl-2.5 text-fg-1'
                    : 'text-fg-1 hover:bg-raised'
                }`}
              >
                <span>Advisori Abu Vulkanik</span>
              </Link>

              <Link
                href="/safety-guide"
                onClick={() => setIsOpen(false)}
                className={`flex min-h-tap items-center justify-between rounded-control px-3 text-body font-semibold transition-colors duration-120 ${
                  pathname === '/safety-guide'
                    ? 'border-l-2 border-accent bg-raised pl-2.5 text-fg-1'
                    : 'text-fg-1 hover:bg-raised'
                }`}
              >
                <span>Panduan Evakuasi</span>
              </Link>

              <div className="my-2 h-px bg-line" />

              <div className="px-3 pb-1 pt-2 text-label text-fg-3">
                Informasi & Otoritas
              </div>

              <Link
                href="/data-sources"
                onClick={() => setIsOpen(false)}
                className={`flex min-h-tap items-center justify-between rounded-control px-3 text-body transition-colors duration-120 ${
                  pathname === '/data-sources'
                    ? 'border-l-2 border-accent bg-raised pl-2.5 text-fg-1'
                    : 'text-fg-2 hover:bg-raised hover:text-fg-1'
                }`}
              >
                <span>Sumber Data Resmi</span>
              </Link>

              <Link
                href="/faq"
                onClick={() => setIsOpen(false)}
                className={`flex min-h-tap items-center justify-between rounded-control px-3 text-body transition-colors duration-120 ${
                  pathname === '/faq'
                    ? 'border-l-2 border-accent bg-raised pl-2.5 text-fg-1'
                    : 'text-fg-2 hover:bg-raised hover:text-fg-1'
                }`}
              >
                <span>FAQ</span>
              </Link>

              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className={`flex min-h-tap items-center justify-between rounded-control px-3 text-body transition-colors duration-120 ${
                  pathname === '/about'
                    ? 'border-l-2 border-accent bg-raised pl-2.5 text-fg-1'
                    : 'text-fg-2 hover:bg-raised hover:text-fg-1'
                }`}
              >
                <span>Tentang Proyek</span>
              </Link>

              <div className="mt-auto border-t border-line pt-3">
                <Link
                  href="/map"
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-tap w-full items-center justify-center gap-2 rounded-control bg-accent text-body font-semibold text-fg-inverse transition-colors duration-120 hover:bg-accent-hover"
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  <span>Buka peta</span>
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
