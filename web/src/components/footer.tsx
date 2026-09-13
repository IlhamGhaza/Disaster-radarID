import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SITE_CONFIG } from '@/config/site';
import { AlertTriangle, ExternalLink } from 'lucide-react';

const DISASTER_LINKS = [
  { href: '/disasters/earthquake', label: 'Gempa Bumi (BMKG)' },
  { href: '/disasters/flood', label: 'Peta Banjir (BNPB)' },
  { href: '/disasters/volcano', label: 'Aktivitas Gunung Api (PVMBG)' },
  { href: '/disasters/volcanic-ash', label: 'Sebaran Abu Vulkanik (VAAC)' },
  { href: '/disasters/landslide', label: 'Tanah Longsor' },
  { href: '/disasters/forest-fire', label: 'Kebakaran Hutan & Lahan' },
  { href: '/disasters/extreme-weather', label: 'Cuaca Ekstrem' },
  { href: '/disasters/tsunami', label: 'Peringatan Dini Tsunami' },
];

const NAV_LINKS = [
  { href: '/map', label: 'Peta Interaktif Radar' },
  { href: '/safety-guide', label: 'Panduan Evakuasi & Keselamatan', highlight: true },
  { href: '/volcanoes', label: 'Direktori 127+ Gunung Api' },
  { href: '/advisories', label: 'Arsip Advisori Darwin VAAC' },
  { href: '/data-sources', label: 'Transparansi Sumber Data' },
  { href: '/faq', label: 'Pertanyaan Umum (FAQ)' },
  { href: '/about', label: 'Tentang Proyek' },
];

const DATA_SOURCES = [
  { href: 'https://data.bmkg.go.id/', label: 'BMKG Indonesia' },
  { href: 'https://gis.bnpb.go.id/', label: 'BNPB & InaRISK' },
  { href: 'https://magma.esdm.go.id/', label: 'PVMBG / MAGMA ESDM' },
  { href: 'https://www.bom.gov.au/products/Volc_ash_recent.shtml', label: 'Darwin VAAC BoM' },
  { href: 'https://www.openstreetmap.org/', label: 'OpenStreetMap Engine' },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.05] bg-[#060910] text-[#8B95A7]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/[0.05]">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg border border-white/[0.08] bg-[#0D1117]">
                <Image
                  src="/logo.png"
                  alt="Disaster Radar Indonesia Logo"
                  width={28}
                  height={28}
                  className="h-full w-full object-contain p-0.5"
                />
              </div>
              <span className="text-sm font-extrabold text-[#E8ECF1] tracking-tight">
                DISASTER <span className="text-[#EF4444]">RADAR</span>
              </span>
            </div>
            <p className="text-[11px] text-[#5A6478] leading-relaxed">
              Platform independen agregasi dan visualisasi informasi kebencanaan di Indonesia. Memantau gempa, banjir, gunung api, karhutla, dan cuaca ekstrem melalui peta geospasial interaktif.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-semibold uppercase tracking-widest bg-white/[0.03] border border-white/[0.06] text-[#5A6478]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sistem Aktif</span>
            </div>
          </div>

          {/* Col 2: Kategori Bencana */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#5A6478]">
              Kategori Bencana
            </h3>
            <ul className="space-y-1.5">
              {DISASTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[11px] text-[#8B95A7] hover:text-[#E8ECF1] transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigasi & Edukasi */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#5A6478]">
              Navigasi & Edukasi
            </h3>
            <ul className="space-y-1.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-[11px] transition-colors duration-150 ${
                      link.highlight
                        ? 'font-semibold text-red-400 hover:text-red-300'
                        : 'text-[#8B95A7] hover:text-[#E8ECF1]'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Sumber Data Resmi */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#5A6478]">
              Sumber Data Resmi
            </h3>
            <ul className="space-y-1.5">
              {DATA_SOURCES.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] text-[#8B95A7] hover:text-[#E8ECF1] transition-colors duration-150"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="h-2.5 w-2.5 text-[#5A6478]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="mt-6 p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[10px] leading-relaxed">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500/70 shrink-0 mt-0.5" />
            <div className="text-[#5A6478]">
              <span className="font-bold text-[#8B95A7]">Bukan Situs Resmi Pemerintah: </span>
              <span>
                Disaster Radar Indonesia adalah proyek independen dan tidak terafiliasi secara kelembagaan dengan BNPB, BMKG, atau PVMBG. Data dihimpun dari feed publik resmi tanpa modifikasi substansi. Untuk tindakan kedaruratan, selalu ikuti instruksi resmi dari instansi pemerintah terkait.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-[#3E4A5C]">
          <p>© {new Date().getFullYear()} Disaster Radar Indonesia. Dikembangkan untuk transparansi kebencanaan publik.</p>
          <p>
            Dibuat oleh{' '}
            <a
              href="https://github.com/IlhamGhaza"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5A6478] hover:text-[#E8ECF1] transition-colors font-semibold"
            >
              Ilham Ghazali
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
