import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SITE_CONFIG } from '@/config/site';
import { ShieldCheck, ExternalLink, Heart, AlertTriangle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#070A0F] text-[#8B95A7]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-[#111827]">
                <Image
                  src="/logo.png"
                  alt="Disaster Radar Indonesia Logo"
                  width={32}
                  height={32}
                  className="h-full w-full object-contain p-0.5"
                />
              </div>
              <span className="text-base font-black text-white tracking-tight">
                DISASTER <span className="text-[#EF4444]">RADAR</span>
              </span>
            </div>
            <p className="text-xs text-[#8B95A7] leading-relaxed">
              Platform independen agregasi dan visualisasi informasi kebencanaan di Indonesia. Memantau gempa, banjir, gunung api, karhutla, dan cuaca ekstrem melalui peta geospasial interaktif.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-white/5 border border-white/10 text-[#CBD5E1]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sistem Monitoring Aktif</span>
            </div>
          </div>

          {/* Col 2: Kategori Bencana */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Kategori Bencana
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/disasters/earthquake" className="hover:text-white transition">
                  Gempa Bumi (BMKG)
                </Link>
              </li>
              <li>
                <Link href="/disasters/flood" className="hover:text-white transition">
                  Peta Banjir (BNPB)
                </Link>
              </li>
              <li>
                <Link href="/disasters/volcano" className="hover:text-white transition">
                  Aktivitas Gunung Api (PVMBG)
                </Link>
              </li>
              <li>
                <Link href="/disasters/volcanic-ash" className="hover:text-white transition">
                  Sebaran Abu Vulkanik (VAAC)
                </Link>
              </li>
              <li>
                <Link href="/disasters/landslide" className="hover:text-white transition">
                  Tanah Longsor
                </Link>
              </li>
              <li>
                <Link href="/disasters/forest-fire" className="hover:text-white transition">
                  Kebakaran Hutan & Lahan
                </Link>
              </li>
              <li>
                <Link href="/disasters/extreme-weather" className="hover:text-white transition">
                  Cuaca Ekstrem
                </Link>
              </li>
              <li>
                <Link href="/disasters/tsunami" className="hover:text-white transition">
                  Peringatan Dini Tsunami
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Modul & Panduan */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigasi & Edukasi
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/map" className="hover:text-white transition">
                  Peta Interaktif Radar
                </Link>
              </li>
              <li>
                <Link href="/safety-guide" className="hover:text-white transition font-semibold text-red-400">
                  Panduan Evakuasi & Keselamatan
                </Link>
              </li>
              <li>
                <Link href="/volcanoes" className="hover:text-white transition">
                  Direktori 127+ Gunung Api
                </Link>
              </li>
              <li>
                <Link href="/advisories" className="hover:text-white transition">
                  Arsip Advisori Darwin VAAC
                </Link>
              </li>
              <li>
                <Link href="/data-sources" className="hover:text-white transition">
                  Transparansi Sumber Data
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  Pertanyaan Umum (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Tentang Proyek
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Data Sources & Official Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Sumber Data Resmi
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://data.bmkg.go.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  <span>BMKG Indonesia</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://gis.bnpb.go.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  <span>BNPB & InaRISK</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://magma.esdm.go.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  <span>PVMBG / MAGMA ESDM</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.bom.gov.au/products/Volc_ash_recent.shtml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  <span>Darwin VAAC BoM</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.openstreetmap.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  <span>OpenStreetMap Engine</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/5 text-[11px] leading-relaxed">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Bukan Situs Resmi Pemerintah: </span>
              <span>
                Disaster Radar Indonesia adalah proyek independen dan tidak terafiliasi secara kelembagaan dengan BNPB, BMKG, atau PVMBG. Data dihimpun dari feed publik resmi tanpa modifikasi substansi. Untuk tindakan kedaruratan, selalu ikuti instruksi resmi dari instansi pemerintah terkait.
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>© {new Date().getFullYear()} Disaster Radar Indonesia. Dikembangkan untuk transparansi kebencanaan publik.</p>
          <p>
            Dibuat oleh{' '}
            <a
              href="https://github.com/IlhamGhaza"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8B95A7] hover:text-white underline font-semibold"
            >
              Ilham Ghazali
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
