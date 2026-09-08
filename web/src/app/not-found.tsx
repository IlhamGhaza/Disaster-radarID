import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Map, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#111827] shadow-xl mb-6">
        <Image
          src="/logo.png"
          alt="Disaster Radar Indonesia Logo"
          width={64}
          height={64}
          className="h-full w-full object-contain p-1"
        />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-[#EF4444]">
        404 — Halaman Tidak Ditemukan
      </span>
      <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
        Halaman Tidak Tersedia
      </h1>
      <p className="mx-auto mt-3 max-w-md text-xs sm:text-sm text-[#8B95A7] leading-relaxed">
        Halaman, kategori bencana, atau rute yang Anda cari tidak ditemukan atau telah dipindahkan.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-[#151C28] px-5 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition border border-white/10"
        >
          <Home className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <Link
          href="/map"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#F97316] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-500/20 hover:brightness-110 transition"
        >
          <Map className="h-4 w-4" />
          <span>Buka Peta Radar</span>
        </Link>
      </div>
    </div>
  );
}
