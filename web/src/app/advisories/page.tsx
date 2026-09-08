import React from 'react';
import type { Metadata } from 'next';
import { getDarwinAdvisories } from '@/lib/advisories';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { LiveAdvisoriesList } from '@/components/live-advisories-list';

import { SITE_CONFIG, SITE_URL } from '@/config/site';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Advisori Abu Vulkanik Indonesia | Darwin VAAC | Disaster Radar',
  description:
    'Lihat buletin advisori sebaran abu vulkanik terbaru di ruang udara Indonesia dari Darwin VAAC.',
  alternates: {
    canonical: `${SITE_URL}/advisories`,
  },
  openGraph: {
    title: 'Advisori Abu Vulkanik Indonesia | Darwin VAAC | Disaster Radar',
    description:
      'Lihat buletin advisori sebaran abu vulkanik terbaru di ruang udara Indonesia dari Darwin VAAC.',
    url: `${SITE_URL}/advisories`,
    siteName: 'Disaster Radar Indonesia',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: 'Advisori Abu Vulkanik Indonesia — Disaster Radar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advisori Abu Vulkanik Indonesia | Darwin VAAC | Disaster Radar',
    description:
      'Lihat buletin advisori sebaran abu vulkanik terbaru di ruang udara Indonesia dari Darwin VAAC.',
    images: [`${SITE_URL}/opengraph-image`],
  },
};

export default async function AdvisoriesPage() {
  const data = await getDarwinAdvisories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Volcanic Ash Advisories', url: '/advisories' }]} />

      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF6B1A]">
          <span className="h-2 w-2 rounded-full bg-[#FF6B1A] animate-pulse"></span>
          <span>Darwin VAAC Feed</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
          Volcanic Ash Advisories
        </h1>
        <p className="text-xs sm:text-sm text-[#8B95A7] max-w-2xl">
          Recent volcanic ash advisories issued by Darwin VAAC for Indonesian airspace.
          Presented in human-readable format by default.
        </p>
      </div>

      <LiveAdvisoriesList
        initialAdvisories={data.advisories}
        initialUpdatedAt={data.updatedAt}
      />
    </div>
  );
}
