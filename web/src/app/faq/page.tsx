import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SITE_URL } from '@/config/site';
import { JsonLd, getFaqJsonLd } from '@/components/json-ld';
import Link from 'next/link';
import { Compass, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pertanyaan yang Sering Ditanyakan (FAQ) — Info Gempa & Bencana | Disaster Radar',
  description:
    'Jawaban lengkap pertanyaan umum seputar cara cek info gempa BMKG hari ini, peta banjir, status gunung api meletus, kualitas udara, dan sumber data resmi pemerintah.',
  keywords: [
    'faq bencana alam indonesia',
    'tanya jawab gempa bmkg',
    'cara cek banjir hari ini',
    'status gunung meletus',
    'cara pakai disaster radar',
    'kualitas udara indonesia',
  ],
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
  openGraph: {
    title: 'Pertanyaan yang Sering Ditanyakan (FAQ) — Info Gempa & Bencana | Disaster Radar',
    description:
      'Jawaban lengkap pertanyaan umum seputar cara cek info gempa BMKG hari ini, peta banjir, status gunung api meletus, kualitas udara, dan sumber data resmi pemerintah.',
    url: `${SITE_URL}/faq`,
    siteName: 'Disaster Radar Indonesia',
    type: 'website',
  },
};

const FAQ_LIST = [
  {
    question: 'Apa itu Disaster Radar Indonesia?',
    answer:
      'Disaster Radar Indonesia adalah platform independen agregasi dan visualisasi informasi bencana di Indonesia. Platform ini mengintegrasikan data gempa bumi, banjir, longsor, karhutla, cuaca ekstrem, tsunami, gunung api, dan sebaran abu vulkanik ke dalam satu antarmuka peta geospasial.',
  },
  {
    question: 'Bagaimana cara melihat peta bencana Indonesia?',
    answer:
      'Akses menu "Peta" di navigasi atas. Peta interaktif akan menampilkan titik-titik kejadian bencana di kepulauan Indonesia. Anda dapat menyaring layer bencana di pojok kiri bawah, mengganti rentang waktu (Live, 24 Jam, 7 Hari, 30 Hari, 1 Tahun), atau mencari kota tertentu.',
  },
  {
    question: 'Dari mana data bencana Disaster Radar Indonesia berasal?',
    answer:
      'Seluruh data diambil dari otoritas resmi: BMKG untuk gempa bumi tektonik dan peringatan tsunami, BNPB & InaRISK untuk banjir, longsor, dan kebakaran hutan, PVMBG / MAGMA ESDM untuk status gunung api aktif, serta Darwin VAAC untuk advisori sebaran abu vulkanik penerbangan.',
  },
  {
    question: 'Apakah Disaster Radar Indonesia merupakan situs resmi pemerintah?',
    answer:
      'Bukan. Platform ini dikembangkan secara independen untuk tujuan transparansi informasi publik dan edukasi kesiapsiagaan bencana. Platform ini bukan pengganti otoritas darurat resmi pemerintah.',
  },
  {
    question: 'Bagaimana cara melihat gempa terkini Indonesia?',
    answer:
      'Pada peta, penanda berikon gempa menandai pusat gempa bumi terkini dari BMKG; penanda merah penuh bercincin berarti status kritis. Klik pada marker gempa untuk melihat informasi magnitudo, kedalaman, wilayah terdampak, dan status potensi tsunami.',
  },
  {
    question: 'Bagaimana cara melihat aktivitas gunung api?',
    answer:
      'Buka menu "Gunung Api" atau aktifkan layer Gunung Api pada peta. Setiap gunung diberi label 4 tingkat aktivitas resmi PVMBG: Level I (Normal/Hijau), Level II (Waspada/Kuning), Level III (Siaga/Oranye), dan Level IV (Awas/Merah).',
  },
  {
    question: 'Apa perbedaan kejadian bencana, peringatan, hazard, dan risk?',
    answer:
      'Kejadian (Event) adalah peristiwa yang telah atau sedang berlangsung (misal gempa yang baru saja terjadi). Peringatan (Warning) adalah maklumat bahaya yang dikeluarkan otoritas sebelum dampak terjadi. Hazard adalah potensi ancaman alamiah suatu wilayah (misal patahan sesar aktif). Sedangkan Risiko (Risk) adalah kalkulasi kemungkinan bahaya terhadap populasi dan infrastruktur di suatu daerah.',
  },
  {
    question: 'Bagaimana cara melihat sebaran abu vulkanik?',
    answer:
      'Pilih layer "Sebaran Abu Vulkanik" pada peta atau kunjungi menu Advisori. Poligon abu teramati (observed) dan proyeksi prakiraan sebaran per 6 jam (+6h, +12h, +18h) ditampilkan dengan tingkat ketinggian (Flight Level) sesuai buletin Darwin VAAC.',
  },
  {
    question: 'Seberapa sering data diperbarui?',
    answer:
      'Gempa dan cuaca BMKG tiap 2 menit; BNPB dan Darwin VAAC tiap 5 menit; titik api NASA FIRMS dan kualitas udara tiap 10 menit. Status gunung api PVMBG berasal dari katalog di aplikasi, bukan feed langsung.',
  },
  {
    question: 'Bagaimana cara kerja fitur cache lokasi pengguna?',
    answer:
      'Saat Anda mengizinkan geolokasi atau mencari kota Anda, koordinat disimpan di peramban lokal (localStorage). Sistem secara otomatis menghitung apakah Anda berada di dalam radius bahaya atau poligon dampak bencana aktif, lalu menampilkan banner peringatan beserta rekomendasi evakuasi mandiri.',
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-4xl px-gutter py-stack sm:px-6 lg:px-8">
      <JsonLd data={getFaqJsonLd(FAQ_LIST)} />
      <Breadcrumbs items={[{ name: 'Pertanyaan Umum (FAQ)', url: '/faq' }]} />

      {/* Hero Header */}
      <div className="mb-section pt-4">
        <div className="max-w-2xl">
          <h1 className="text-display text-fg-1 text-balance md:text-display-lg">
            Pertanyaan yang Sering <span className="serif-accent text-accent">ditanyakan</span>
          </h1>

          <p className="mt-row text-body text-fg-2">
            Jawaban cepat seputar cara membaca peta bencana, sumber data resmi BMKG dan BNPB, serta cara memantau bencana di sekitar Anda.
          </p>
        </div>
      </div>

      {/* Daftar tanya-jawab */}
      <div className="mb-section divide-y divide-line">
        {FAQ_LIST.map((faq, i) => (
          <article key={i} className="space-y-cell py-gutter first:pt-0">
            <div className="flex items-baseline gap-row">
              <span className="w-6 shrink-0 font-mono text-small text-fg-3 tabular-nums">
                {i + 1}
              </span>
              <h2 className="text-heading text-fg-1">
                {faq.question}
              </h2>
            </div>
            <p className="max-w-[68ch] pl-9 text-body text-fg-2">
              {faq.answer}
            </p>
          </article>
        ))}
      </div>

      {/* Halaman terkait */}
      <div className="flex flex-col justify-between gap-gutter border-t border-line pt-stack sm:flex-row sm:items-center">
        <div>
          <h3 className="text-heading text-fg-1">Halaman terkait</h3>
          <p className="mt-0.5 text-body text-fg-2">
            Baca panduan evakuasi atau lihat titik bencana di peta.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-row">
          <Link
            href="/safety-guide"
            className="inline-flex min-h-tap items-center gap-1.5 rounded-control border border-line-strong px-gutter text-small font-semibold text-fg-1 transition-colors duration-120 hover:border-accent hover:text-accent"
          >
            <Shield className="h-4 w-4" aria-hidden="true" />
            <span>Baca panduan evakuasi</span>
          </Link>
          <Link
            href="/map"
            className="inline-flex min-h-tap items-center gap-1.5 rounded-control bg-accent px-gutter text-small font-semibold text-fg-inverse transition-colors duration-120 hover:bg-accent-hover"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            <span>Buka Peta</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
