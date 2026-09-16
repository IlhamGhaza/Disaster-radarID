import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SITE_URL } from '@/config/site';
import { JsonLd, getFaqJsonLd } from '@/components/json-ld';
import Link from 'next/link';
import { HelpCircle, Compass, Shield } from 'lucide-react';

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
      'Disaster Radar Indonesia adalah platform independen agregasi dan visualisasi informasi bencana di Indonesia. Platform ini mengintegrasikan data gempa bumi, banjir, longsor, karhutla, cuaca ekstrem, tsunami, gunung api, dan sebaran abu vulkanik ke dalam satu antarmuka peta geospasial real-time.',
  },
  {
    question: 'Bagaimana cara melihat peta bencana Indonesia?',
    answer:
      'Akses menu "Peta Radar" di navigasi atas. Peta interaktif akan menampilkan titik-titik kejadian bencana di kepulauan Indonesia. Anda dapat menyaring layer bencana di pojok kiri bawah, mengganti rentang waktu (Live, 24 Jam, 7 Hari, 30 Hari, 1 Tahun), atau mencari kota tertentu.',
  },
  {
    question: 'Dari mana data bencana Disaster Radar Indonesia berasal?',
    answer:
      'Seluruh data diambil dari otoritas resmi: BMKG untuk gempa bumi tektonik dan peringatan tsunami, BNPB & InaRISK untuk banjir, longsor, dan kebakaran hutan, PVMBG / MAGMA ESDM untuk status 127+ gunung api aktif, serta Darwin VAAC untuk advisori sebaran abu vulkanik penerbangan.',
  },
  {
    question: 'Apakah Disaster Radar Indonesia merupakan situs resmi pemerintah?',
    answer:
      'Bukan. Platform ini dikembangkan secara independen untuk tujuan transparansi informasi publik dan edukasi kesiapsiagaan bencana. Platform ini bukan pengganti otoritas darurat resmi pemerintah.',
  },
  {
    question: 'Bagaimana cara melihat gempa terkini Indonesia?',
    answer:
      'Pada peta radar, titik lingkaran merah menandai pusat gempa bumi terkini dari BMKG. Klik pada marker gempa untuk melihat informasi magnitudo, kedalaman, wilayah terdampak, dan status potensi tsunami.',
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
      'Pilih layer "Sebaran Abu Vulkanik" pada peta radar atau kunjungi menu Advisori. Poligon abu teramati (observed) dan proyeksi prakiraan sebaran per 6 jam (+6h, +12h, +18h) ditampilkan dengan tingkat ketinggian (Flight Level) sesuai buletin Darwin VAAC.',
  },
  {
    question: 'Seberapa sering data diperbarui?',
    answer:
      'Sistem melakukan sinkronisasi otomatis setiap 2 hingga 5 menit untuk feed gempa BMKG dan advisori abu vulkanik, serta secara berkala untuk laporan insiden BNPB dan evaluasi PVMBG.',
  },
  {
    question: 'Bagaimana cara kerja fitur cache lokasi pengguna?',
    answer:
      'Saat Anda mengizinkan geolokasi atau mencari kota Anda, koordinat disimpan di peramban lokal (localStorage). Sistem secara otomatis menghitung apakah Anda berada di dalam radius bahaya atau poligon dampak bencana aktif, lalu menampilkan banner peringatan beserta rekomendasi evakuasi mandiri.',
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 bg-[#080C14] text-[#E8ECF1]">
      <JsonLd data={getFaqJsonLd(FAQ_LIST)} />
      <Breadcrumbs items={[{ name: 'Pertanyaan Umum (FAQ)', url: '/faq' }]} />

      {/* Hero Header */}
      <div className="relative mt-4 mb-10 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#101420] via-[#0D1017] to-[#070A10] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-cyan-600/10 blur-[100px]" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-[#141B26]/80 px-3 py-1 text-[11px] font-mono font-semibold tracking-wider text-cyan-400 uppercase mb-3 backdrop-blur-md">
            <HelpCircle className="h-3 w-3" />
            <span>PUSAT BANTUAN & TANYA JAWAB</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#E8ECF1] leading-[1.1]">
            Pertanyaan yang Sering Ditanyakan
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#94A3B8] leading-relaxed">
            Jawaban cepat seputar cara membaca peta bencana, sumber data resmi BMKG dan BNPB, serta cara memantau bencana di sekitar Anda.
          </p>
        </div>
      </div>

      {/* FAQ Cards List */}
      <div className="space-y-4 mb-14">
        {FAQ_LIST.map((faq, i) => (
          <article
            key={i}
            className="p-6 rounded-2xl bg-[#0D1117] border border-white/[0.07] shadow-lg transition-all hover:border-white/[0.16] space-y-2.5"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold mt-0.5">
                {i + 1}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#E8ECF1] leading-snug">
                {faq.question}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed pl-9">
              {faq.answer}
            </p>
          </article>
        ))}
      </div>

      {/* Quick Discovery Strip */}
      <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#0E1524] via-[#0D1117] to-[#0A0F1A] border border-white/[0.08] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#E8ECF1]">Masih Membutuhkan Informasi Tambahan?</h3>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Pelajari panduan evakuasi atau telusuri langsung titik bencana di peta interaktif.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/safety-guide"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-white/[0.1] bg-white/[0.04] text-xs font-semibold text-[#E8ECF1] hover:bg-white/[0.08] transition-all"
          >
            <Shield className="h-3.5 w-3.5 text-red-400" />
            <span>Panduan Keselamatan</span>
          </Link>
          <Link
            href="/map"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-600 text-xs font-bold text-white hover:bg-red-500 transition-all shadow-md shadow-red-600/30"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Buka Peta</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
