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
  { href: '/map', label: 'Peta Interaktif' },
  { href: '/safety-guide', label: 'Panduan Evakuasi & Keselamatan', highlight: true },
  { href: '/volcanoes', label: 'Direktori Gunung Api' },
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

// Link footer: 44px di mobile (target sentuh), rapat di desktop.
const linkBase =
  'flex min-h-tap items-center gap-1.5 text-small transition-colors duration-120 md:min-h-0 md:py-1';

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg text-fg-2">
      <div className="mx-auto max-w-7xl px-gutter py-section sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-stack border-b border-line pb-stack md:grid-cols-4 md:gap-8">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-control border border-line bg-surface">
                <Image
                  src="/logo.png"
                  alt=""
                  width={28}
                  height={28}
                  className="h-full w-full object-contain p-0.5"
                />
              </div>
              <span className="text-[17px] font-bold text-fg-1">Disaster Radar</span>
            </div>
            <p className="max-w-[36ch] text-small text-fg-2">
              Platform independen agregasi dan visualisasi informasi kebencanaan di Indonesia. Memantau
              gempa, banjir, gunung api, karhutla, dan cuaca ekstrem melalui peta geospasial interaktif.
            </p>
          </div>

          {/* Col 2: Kategori Bencana */}
          <nav aria-labelledby="footer-kategori">
            <h3 id="footer-kategori" className="mb-1 text-small font-semibold text-fg-1">
              Kategori Bencana
            </h3>
            <ul>
              {DISASTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={`${linkBase} text-fg-2 hover:text-fg-1`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 3: Navigasi & Edukasi */}
          <nav aria-labelledby="footer-navigasi">
            <h3 id="footer-navigasi" className="mb-1 text-small font-semibold text-fg-1">
              Navigasi & Edukasi
            </h3>
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`${linkBase} ${
                      link.highlight
                        ? 'font-semibold text-accent hover:text-accent-hover'
                        : 'text-fg-2 hover:text-fg-1'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Col 4: Sumber Data Resmi */}
          <nav aria-labelledby="footer-sumber">
            <h3 id="footer-sumber" className="mb-1 text-small font-semibold text-fg-1">
              Sumber Data Resmi
            </h3>
            <ul>
              {DATA_SOURCES.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${linkBase} text-fg-2 hover:text-fg-1`}
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-fg-3" aria-hidden="true" />
                    <span className="sr-only">(membuka tab baru)</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Disclaimer Notice */}
        <div className="mt-stack flex items-start gap-3 rounded-card border border-line border-l-4 border-l-sev-warning bg-surface p-gutter">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-sev-warning" aria-hidden="true" />
          <p className="max-w-[80ch] text-small text-fg-2">
            <strong className="font-semibold text-fg-1">Bukan Situs Resmi Pemerintah:</strong>{' '}
            Disaster Radar Indonesia adalah proyek independen dan tidak terafiliasi secara kelembagaan
            dengan BNPB, BMKG, atau PVMBG. Data dihimpun dari feed publik resmi tanpa modifikasi
            substansi. Untuk tindakan kedaruratan, selalu ikuti instruksi resmi dari instansi pemerintah
            terkait.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="mt-stack flex flex-col items-start justify-between gap-2 text-label font-normal text-fg-3 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Disaster Radar Indonesia. Dikembangkan untuk transparansi kebencanaan publik.</p>
          <p>
            Dibuat oleh{' '}
            <a
              href="https://github.com/IlhamGhaza"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-tap items-center font-semibold text-fg-2 underline-offset-2 hover:text-fg-1 hover:underline md:min-h-0"
            >
              Ilham Ghazali
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
