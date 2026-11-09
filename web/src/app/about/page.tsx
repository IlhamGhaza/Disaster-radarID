import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ShieldAlert, Globe, Radio, Code2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { SITE_URL } from '@/config/site';

export const metadata: Metadata = {
  title: 'Tentang Disaster Radar Indonesia | Visi & Metodologi',
  description:
    'Disaster Radar Indonesia adalah platform independen agregasi dan visualisasi informasi kebencanaan di Indonesia. Dibangun untuk memberikan kesadaran dini dan akses cepat ke data resmi.',
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: 'Tentang Disaster Radar Indonesia | Visi & Metodologi',
    description:
      'Disaster Radar Indonesia adalah platform independen agregasi dan visualisasi informasi kebencanaan di Indonesia.',
    url: `${SITE_URL}/about`,
    siteName: 'Disaster Radar Indonesia',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-gutter py-stack sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Tentang Proyek', url: '/about' }]} />

      {/* Hero Header */}
      <div className="mb-section pt-4">
        <div className="max-w-2xl">
          <h1 className="text-display text-fg-1 text-balance md:text-display-lg">
            Tentang Disaster <span className="serif-accent text-accent">Radar</span> Indonesia
          </h1>

          <p className="mt-row text-body text-fg-2">
            Platform peta bencana independen yang merangkum data resmi BMKG, BNPB, dan PVMBG ke dalam satu tampilan agar mudah dipantau seluruh masyarakat Indonesia.
          </p>
        </div>
      </div>

      <div className="space-y-section text-body text-fg-2">
        {/* Mission */}
        <section className="max-w-[68ch] space-y-row">
          <div className="flex items-center gap-cell">
            <Globe className="h-5 w-5 text-fg-3" aria-hidden="true" />
            <h2 className="text-title text-fg-1">Misi & Latar Belakang</h2>
          </div>
          <p>
            Indonesia berada di jalur Cincin Api Pasifik (<em>Ring of Fire</em>) dan pertemuan lempeng tektonik dunia, sehingga rawan terhadap gempa bumi, letusan gunung api, tsunami, banjir, tanah longsor, dan cuaca ekstrem.
          </p>
          <p>
            Seringkali masyarakat kesulitan karena sumber informasi tersebar di banyak tempat: data gempa di BMKG, data banjir di BNPB, status gunung api di PVMBG, dan info sebaran abu di Darwin VAAC. <strong className="font-semibold text-fg-1">Disaster Radar Indonesia</strong> hadir untuk menyatukan seluruh laporan resmi ini ke dalam satu peta interaktif yang cepat, akurat, dan mudah dipahami siapa saja.
          </p>
        </section>

        {/* Foundation & AshWatch Heritage */}
        <section className="max-w-[68ch] space-y-row">
          <div className="flex items-center gap-cell">
            <Radio className="h-5 w-5 text-fg-3" aria-hidden="true" />
            <h2 className="text-title text-fg-1">Awal Mula Pengembangan</h2>
          </div>
          <p>
            Platform ini awalnya dikembangkan dari proyek <strong className="font-semibold text-fg-1">AshWatch</strong>, modul khusus pemantau sebaran abu vulkanik untuk jalur penerbangan. Fitur pemantauan gunung api aktif dan pergerakan abu dari buletin resmi Darwin VAAC tetap dipertahankan dan kini disempurnakan menjadi bagian dari Disaster Radar Indonesia.
          </p>
        </section>

        {/* Technology Architecture */}
        <section className="space-y-row">
          <div className="flex items-center gap-cell">
            <Code2 className="h-5 w-5 text-fg-3" aria-hidden="true" />
            <h2 className="text-title text-fg-1">Teknologi yang Digunakan</h2>
          </div>
          <p className="max-w-[68ch]">
            Platform ini dirancang agar ringan dan dapat diakses cepat bahkan di ponsel dengan jaringan lambat:
          </p>
          <ul className="grid grid-cols-1 gap-x-stack gap-y-gutter pt-1 sm:grid-cols-2">
            <li className="border-t border-line pt-row">
              <strong className="mb-1 block font-semibold text-fg-1">Next.js & React Cepat</strong>
              <span className="text-small">Halaman dimuat seketika dan hemat kuota data internet saat dibuka di berbagai perangkat.</span>
            </li>
            <li className="border-t border-line pt-row">
              <strong className="mb-1 block font-semibold text-fg-1">Peta Interaktif Ringan</strong>
              <span className="text-small">Menggunakan OpenStreetMap bertema gelap yang nyaman di mata dan lancar digeser atau diperbesar.</span>
            </li>
            <li className="border-t border-line pt-row">
              <strong className="mb-1 block font-semibold text-fg-1">Penyatuan Data Otomatis</strong>
              <span className="text-small">Mengambil data terbaru secara berkala dari BMKG, BNPB, PVMBG MAGMA, dan Darwin VAAC.</span>
            </li>
            <li className="border-t border-line pt-row">
              <strong className="mb-1 block font-semibold text-fg-1">Deteksi Jarak Otomatis</strong>
              <span className="text-small">Menghitung jarak lokasi pengguna ke pusat gempa atau letusan gunung api secara instan di peramban.</span>
            </li>
          </ul>
        </section>

        {/* Independence & Safety Disclaimer */}
        <section className="space-y-row rounded-card border border-line border-l-4 border-l-sev-warning bg-surface p-gutter sm:p-stack">
          <div className="flex items-center gap-cell">
            <ShieldAlert className="h-5 w-5 text-sev-warning" aria-hidden="true" />
            <h2 className="text-title text-fg-1">Penafian Independensi & Keselamatan</h2>
          </div>
          <p className="max-w-[68ch]">
            Disaster Radar Indonesia adalah proyek independen untuk edukasi publik dan penyebaran informasi kebencanaan. Kami <strong className="font-semibold text-fg-1">bukan</strong> lembaga resmi pemerintah Republik Indonesia. Seluruh informasi disajikan &quot;apa adanya&quot; dari sumber terbuka lembaga penanggung jawab terkait.
          </p>
          <p className="max-w-[68ch]">
            Dalam kondisi darurat atau saat bencana terjadi di wilayah Anda, <strong className="font-semibold text-fg-1">selalu patuhi komando resmi dan instruksi evakuasi</strong> yang dikeluarkan oleh BNPB, BPBD setempat, aparat kepolisian, TNI, atau Basarnas.
          </p>
        </section>

        {/* Quick Links Footer */}
        <div className="flex flex-wrap items-center gap-x-stack gap-y-cell border-t border-line pt-gutter text-small">
          <Link href="/data-sources" className="inline-flex min-h-tap items-center gap-1 font-semibold text-accent transition-colors duration-120 hover:text-accent-hover">
            <span>Lihat cara data diambil</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/safety-guide" className="inline-flex min-h-tap items-center gap-1 font-semibold text-accent transition-colors duration-120 hover:text-accent-hover">
            <span>Baca panduan evakuasi</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
