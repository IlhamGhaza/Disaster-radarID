import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Map, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-gutter text-center">
      <div className="relative mb-stack flex h-16 w-16 items-center justify-center overflow-hidden rounded-card border border-line bg-surface">
        <Image
          src="/logo.png"
          alt="Disaster Radar Indonesia Logo"
          width={64}
          height={64}
          className="h-full w-full object-contain p-1"
        />
      </div>

      <span className="font-mono text-small text-fg-3">
        404 — Halaman Tidak Ditemukan
      </span>
      <h1 className="mt-cell text-display text-fg-1 md:text-display-lg">
        Halaman Tidak <span className="serif-accent text-accent">tersedia</span>
      </h1>
      <p className="mx-auto mt-row max-w-md text-body text-fg-2">
        Halaman, kategori bencana, atau rute yang Anda cari tidak ditemukan atau telah dipindahkan.
      </p>

      <div className="mt-stack flex flex-wrap items-center justify-center gap-row">
        <Link
          href="/"
          className="flex min-h-tap items-center gap-2 rounded-control border border-line-strong px-gutter text-small font-semibold text-fg-1 transition-colors duration-120 hover:border-accent hover:text-accent"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          <span>Kembali ke Beranda</span>
        </Link>

        <Link
          href="/map"
          className="flex min-h-tap items-center gap-2 rounded-control bg-accent px-gutter text-small font-semibold text-fg-inverse transition-colors duration-120 hover:bg-accent-hover"
        >
          <Map className="h-4 w-4" aria-hidden="true" />
          <span>Buka peta</span>
        </Link>
      </div>
    </div>
  );
}
