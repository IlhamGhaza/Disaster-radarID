import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SITE_CONFIG, SITE_URL } from '@/config/site';
import { JsonLd, getFaqJsonLd } from '@/components/json-ld';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pertanyaan Umum (FAQ) | Disaster Radar Indonesia',
  description:
    'Jawaban atas pertanyaan seputar Disaster Radar Indonesia: cara membaca peta bencana, sumber data resmi BMKG/BNPB, status gunung api PVMBG, dan panduan keselamatan.',
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
  openGraph: {
    title: 'Pertanyaan Umum (FAQ) | Disaster Radar Indonesia',
    description:
      'Jawaban atas pertanyaan seputar Disaster Radar Indonesia: cara membaca peta bencana, sumber data resmi BMKG/BNPB, status gunung api PVMBG, dan panduan keselamatan.',
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd data={getFaqJsonLd(FAQ_LIST)} />
      <Breadcrumbs items={[{ name: 'Pertanyaan Umum (FAQ)', url: '/faq' }]} />

      <div className="max-w-2xl mb-10">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Pertanyaan Umum (FAQ)
        </h1>
        <p className="mt-3 text-sm text-[#8B95A7]">
          Informasi panduan, interpretasi data peta bencana, serta metodologi sistem Disaster Radar Indonesia.
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_LIST.map((faq, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-[#111827] border border-white/10 space-y-2"
          >
            <h2 className="text-base font-bold text-white">{faq.question}</h2>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-3xl bg-white/5 border border-white/10 text-center">
        <h3 className="text-base font-bold text-white">Punya Pertanyaan Lain?</h3>
        <p className="text-xs text-[#8B95A7] mt-1">
          Pelajari lebih lanjut tentang arsitektur data atau jelajahi panduan keselamatan bencana.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Link
            href="/data-sources"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-semibold transition"
          >
            Sumber Data
          </Link>
          <Link
            href="/safety-guide"
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs text-white font-bold transition"
          >
            Panduan Evakuasi
          </Link>
        </div>
      </div>
    </div>
  );
}
