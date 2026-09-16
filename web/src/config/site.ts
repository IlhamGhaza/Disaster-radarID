/**
 * Single source of truth for Disaster Radar Indonesia configuration and SEO metadata.
 * Compliant with tugas.md and seo.md specifications.
 */

function resolveSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && !envUrl.includes('disaster-radar-indonesia')) {
    return envUrl;
  }
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProd && !vercelProd.includes('disaster-radar-indonesia')) {
    return `https://${vercelProd}`;
  }
  return 'https://disaster-radar-id.vercel.app';
}

export const SITE_URL = resolveSiteUrl().replace(/\/+$/, '');

export const SITE_CONFIG = {
  name: 'Disaster Radar Indonesia',
  shortName: 'Disaster Radar',
  altName: 'Indonesia Disaster Radar',
  tagline: 'Peta & Monitoring Bencana Indonesia',
  title: 'Disaster Radar Indonesia — Peta & Monitoring Bencana Indonesia',
  subtitle: 'Peta dan Monitoring Bencana Indonesia Terkini',
  description:
    'Pantau kondisi bencana alam Indonesia terkini: info gempa hari ini BMKG, peta banjir, kualitas udara ISPU, status gunung meletus PVMBG, cuaca ekstrem, dan sebaran abu vulkanik secara akurat dan real-time.',
  siteUrl: SITE_URL,
  author: 'Ilham Ghazali',
  authorUrl: 'https://github.com/IlhamGhaza',
  links: {
    github: 'https://github.com/IlhamGhaza/Disaster-radarID',
    authorGithub: 'https://github.com/IlhamGhaza',
    bmkgDataSource: 'https://data.bmkg.go.id/',
    bnpbDataSource: 'https://gis.bnpb.go.id/',
    magmaDataSource: 'https://magma.esdm.go.id/',
    bomDataSource: 'https://www.bom.gov.au/products/Volc_ash_recent.shtml',
  },
  themeColor: '#0B0F17',
  locale: 'id_ID',
  keywords: [
    // Top-ranking Indonesian search queries (High Search Volume)
    'gempa hari ini',
    'info gempa bmkg',
    'gempa bumi terkini',
    'gempa barusan',
    'kualitas udara hari ini',
    'kualitas udara jakarta',
    'cek polusi udara',
    'ispu hari ini',
    'gunung meletus hari ini',
    'status gunung api aktif',
    'erupsi gunung merapi',
    'erupsi lewotobi',
    'peta banjir hari ini',
    'titik banjir jakarta',
    'cuaca ekstrem bmkg hari ini',
    'peringatan dini cuaca',
    'peringatan tsunami bmkg',
    'titik api karhutla sipongi',
    'kebakaran hutan hari ini',
    'nomor darurat bencana 112',
    // Core brand & topical terms
    'bencana Indonesia',
    'info bencana Indonesia',
    'peta bencana Indonesia',
    'monitoring bencana Indonesia',
    'bencana terkini Indonesia',
    'kejadian bencana Indonesia',
    'peta bencana terkini',
    'gempa terkini Indonesia',
    'gempa bumi Indonesia',
    'banjir Indonesia',
    'tanah longsor Indonesia',
    'kebakaran hutan Indonesia',
    'cuaca ekstrem Indonesia',
    'tsunami Indonesia',
    'gunung api Indonesia',
    'aktivitas gunung api Indonesia',
    'abu vulkanik Indonesia',
    'sebaran abu vulkanik',
    'peringatan dini bencana',
    'data bencana Indonesia',
    'kondisi bencana Indonesia',
    // English & international keywords
    'disaster map Indonesia',
    'Indonesia disaster map',
    'Indonesia disaster monitoring',
    'Indonesia earthquake map',
    'volcanic ash map Indonesia',
    'air quality index indonesia',
    'Darwin VAAC',
    'BMKG',
    'BNPB',
    'PVMBG',
  ],
};
