'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Map,
  Menu,
  X,
  ChevronDown,
  MapPin,
  ShieldAlert,
  BookOpen,
  Radio,
  Layers,
  Mountain,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/map', label: 'Peta Radar' },
  { href: '/disasters', label: 'Bencana' },
  { href: '/volcanoes', label: 'Gunung Api' },
  { href: '/safety-guide', label: 'Panduan Evakuasi' },
  { href: '/about', label: 'Tentang' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      suppressHydrationWarning
      className="sticky top-0 z-50 w-full h-[60px] border-b border-white/10 bg-[#0B0F17]/90 backdrop-blur-md flex items-center"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-transform hover:scale-[1.01]"
          aria-label="Disaster Radar Indonesia Home"
        >
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-[#111827] shadow-md shadow-red-500/10">
            <Image
              src="/logo-mark.png"
              alt="Disaster Radar Indonesia Logo"
              width={36}
              height={36}
              className="h-full w-full object-contain p-0.5"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-[#F5F7FA] group-hover:text-[#EF4444] transition-colors">
                DISASTER <span className="text-[#EF4444]">RADAR</span>
              </span>
              <span className="relative flex h-2 w-2" title="Pemantauan Langsung (Live)">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
            </div>
            <span className="text-[10px] font-medium tracking-wide text-[#8B95A7]">
              Peta & Monitoring Bencana
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-1" aria-label="Navigasi Utama">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === '/map'
                ? pathname === '/map'
                : link.href === '/disasters'
                ? pathname.startsWith('/disasters')
                : link.href === '/volcanoes'
                ? pathname.startsWith('/volcanoes') || pathname.startsWith('/advisories')
                : pathname === link.href;

            if (link.href === '/about') {
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setAboutDropdownOpen(true)}
                  onMouseLeave={() => setAboutDropdownOpen(false)}
                >
                  <Link
                    href="/about"
                    className={`flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold transition-colors rounded-lg ${
                      isActive || pathname === '/faq' || pathname === '/data-sources'
                        ? 'text-white bg-[#151C28] font-bold'
                        : 'text-[#8B95A7] hover:text-white hover:bg-[#151C28]/60'
                    }`}
                  >
                    <span>Tentang</span>
                    <ChevronDown className="h-3 w-3 text-[#8B95A7]" />
                  </Link>

                  {aboutDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border border-white/10 bg-[#111827] p-1.5 shadow-2xl backdrop-blur-xl">
                      <Link
                        href="/about"
                        className="block rounded-lg px-3 py-2 text-xs text-[#F5F7FA] hover:bg-[#151C28]"
                      >
                        Tentang Proyek
                      </Link>
                      <Link
                        href="/data-sources"
                        className="block rounded-lg px-3 py-2 text-xs text-[#F5F7FA] hover:bg-[#151C28]"
                      >
                        Sumber Data Resmi
                      </Link>
                      <Link
                        href="/faq"
                        className="block rounded-lg px-3 py-2 text-xs text-[#F5F7FA] hover:bg-[#151C28]"
                      >
                        Tanya Jawab (FAQ)
                      </Link>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-1.5 text-xs font-semibold transition-colors rounded-lg ${
                  isActive
                    ? 'text-white bg-[#151C28] font-bold'
                    : 'text-[#8B95A7] hover:text-white hover:bg-[#151C28]/60'
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
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#F97316] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:brightness-110 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>Cek Lokasi Saya</span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-[#8B95A7] hover:bg-[#151C28] hover:text-white md:hidden"
          aria-expanded={isOpen}
          aria-label="Toggle Menu Navigasi"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="border-b border-white/10 bg-[#0B0F17] px-4 pt-2 pb-6 md:hidden animate-in fade-in slide-in-from-top-3">
          <div className="flex flex-col space-y-1">
            <Link
              href="/map"
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                pathname === '/map'
                  ? 'bg-red-500/15 text-red-400 font-semibold'
                  : 'text-[#F5F7FA] hover:bg-[#151C28]'
              }`}
            >
              <span>Peta Radar</span>
            </Link>

            <Link
              href="/disasters"
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                pathname.startsWith('/disasters')
                  ? 'bg-red-500/15 text-red-400 font-semibold'
                  : 'text-[#F5F7FA] hover:bg-[#151C28]'
              }`}
            >
              <span>Kategori Bencana</span>
            </Link>

            <Link
              href="/volcanoes"
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                pathname.startsWith('/volcanoes')
                  ? 'bg-red-500/15 text-red-400 font-semibold'
                  : 'text-[#F5F7FA] hover:bg-[#151C28]'
              }`}
            >
              <span>Gunung Api (PVMBG)</span>
            </Link>

            <Link
              href="/advisories"
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                pathname.startsWith('/advisories')
                  ? 'bg-red-500/15 text-red-400 font-semibold'
                  : 'text-[#F5F7FA] hover:bg-[#151C28]'
              }`}
            >
              <span>Advisori Abu Vulkanik</span>
            </Link>

            <Link
              href="/safety-guide"
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                pathname === '/safety-guide'
                  ? 'bg-red-500/15 text-red-400 font-semibold'
                  : 'text-[#F5F7FA] hover:bg-[#151C28]'
              }`}
            >
              <span>Panduan Evakuasi</span>
            </Link>

            <Link
              href="/data-sources"
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                pathname === '/data-sources'
                  ? 'bg-red-500/15 text-red-400 font-semibold'
                  : 'text-[#F5F7FA] hover:bg-[#151C28]'
              }`}
            >
              <span>Sumber Data Resmi</span>
            </Link>

            <Link
              href="/faq"
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                pathname === '/faq'
                  ? 'bg-red-500/15 text-red-400 font-semibold'
                  : 'text-[#F5F7FA] hover:bg-[#151C28]'
              }`}
            >
              <span>FAQ</span>
            </Link>

            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                pathname === '/about'
                  ? 'bg-red-500/15 text-red-400 font-semibold'
                  : 'text-[#F5F7FA] hover:bg-[#151C28]'
              }`}
            >
              <span>Tentang</span>
            </Link>

            <div className="pt-2 border-t border-white/10">
              <Link
                href="/map"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#F97316] py-2.5 text-center text-sm font-bold text-white shadow-md shadow-red-500/20"
              >
                <MapPin className="h-4 w-4" />
                <span>Cek Lokasi Saya</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
