/**
 * Single source of truth for Disaster Radar Indonesia configuration and SEO metadata.
 * Compliant with tugas.md and seo.md specifications.
 */

const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://disaster-radar-id.vercel.app');

export const SITE_URL = rawSiteUrl.replace(/\/+$/, '');

export const SITE_CONFIG = {
  name: 'Disaster Radar Indonesia',
  shortName: 'Disaster Radar',
  altName: 'Indonesia Disaster Radar',
  tagline: 'Peta & Monitoring Bencana Indonesia',
  title: 'Disaster Radar Indonesia — Peta & Monitoring Bencana Indonesia',
  subtitle: 'Peta dan Monitoring Bencana Indonesia Terkini',
  description:
    'Pantau bencana Indonesia melalui peta interaktif dan data dari berbagai sumber resmi. Lihat gempa, banjir, longsor, kebakaran, cuaca ekstrem, tsunami, gunung api, abu vulkanik, dan informasi kebencanaan lainnya.',
  siteUrl: SITE_URL,
  author: 'Ilham Ghazali',
  authorUrl: 'https://github.com/IlhamGhaza',
  links: {
    github: 'https://github.com/IlhamGhaza/ashwatch',
    authorGithub: 'https://github.com/IlhamGhaza',
    bmkgDataSource: 'https://data.bmkg.go.id/',
    bnpbDataSource: 'https://gis.bnpb.go.id/',
    magmaDataSource: 'https://magma.esdm.go.id/',
    bomDataSource: 'https://www.bom.gov.au/products/Volc_ash_recent.shtml',
  },
  themeColor: '#0B0F17',
  locale: 'id_ID',
  keywords: [
    // Primary Indonesian keywords (as defined in seo.md)
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
    'Darwin VAAC',
    'BMKG',
    'BNPB',
    'PVMBG',
  ],
};
