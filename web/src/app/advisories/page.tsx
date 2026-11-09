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
    <div className="mx-auto max-w-7xl px-gutter py-stack sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ name: 'Advisori Abu Vulkanik', url: '/advisories' }]} />

      <div className="mb-stack flex flex-col gap-cell border-b border-line pb-stack">
        <h1 className="text-display text-fg-1 md:text-display-lg">
          Advisori <span className="serif-accent text-accent">abu</span> vulkanik
        </h1>
        <p className="max-w-2xl text-body text-fg-2">
          Buletin Darwin VAAC untuk ruang udara Indonesia, diperbarui tiap 5 menit.
        </p>
      </div>

      <LiveAdvisoriesList
        initialAdvisories={data.advisories}
        initialUpdatedAt={data.updatedAt}
      />
    </div>
  );
}
