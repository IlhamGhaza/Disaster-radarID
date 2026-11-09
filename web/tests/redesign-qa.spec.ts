/**
 * QA redesign (fase akhir). Dijalankan terhadap dev server yang sudah berjalan:
 *   npx playwright test tests/redesign-qa.spec.ts
 * @playwright/test tidak ada di package.json; pasang sementara dengan `npm i --no-save @playwright/test`.
 */
import { test, expect, type Page } from '@playwright/test';

const BASE = process.env.QA_BASE_URL ?? 'http://localhost:3000';
const ROUTES = [
  '/',
  '/map',
  '/disasters',
  '/disasters/earthquake',
  '/volcanoes',
  '/volcanoes/semeru',
  '/advisories',
  '/safety-guide',
  '/data-sources',
  '/faq',
  '/about',
  '/halaman-tidak-ada',
];

test.use({ channel: 'msedge', baseURL: BASE });
test.describe.configure({ mode: 'parallel' });

/** Info elemen yang sedang fokus + apakah indikator fokusnya terlihat. */
async function focused(page: Page) {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return null;
    const cs = getComputedStyle(el);
    const visible =
      (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) ||
      (cs.boxShadow !== 'none' && cs.boxShadow !== '');
    return {
      tag: el.tagName.toLowerCase(),
      label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 60),
      inNav: !!el.closest('header, nav'),
      inMap: !!el.closest('.leaflet-container'),
      isMarker: el.classList.contains('leaflet-marker-icon'),
      visible,
    };
  });
}

test('keyboard: Tab melewati navbar → kontrol peta → marker, fokus selalu terlihat', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/map');
  await page.waitForSelector('.leaflet-marker-icon', { timeout: 20_000 });

  // Catat urutan nyata. Di DOM, kontrol peta dirender SETELAH kontainer Leaflet, jadi Tab melewati
  // poligon & marker dulu baru sampai ke filter. Urutan itu dilaporkan (annotation), bukan disembunyikan.
  const seen = { nav: -1, control: -1, marker: -1 };
  const invisible: string[] = [];
  for (let i = 0; i < 400 && (seen.control < 0 || seen.marker < 0); i++) {
    await page.keyboard.press('Tab');
    const f = await focused(page);
    if (!f) continue;
    if (!f.visible) invisible.push(`${f.tag} "${f.label}"`);
    if (f.inNav && seen.nav < 0) seen.nav = i;
    if (!f.inNav && !f.inMap && seen.nav >= 0 && seen.control < 0 && (f.tag === 'button' || f.tag === 'input')) seen.control = i;
    if (f.isMarker && seen.marker < 0) seen.marker = i;
  }
  test.info().annotations.push({ type: 'urutan-tab', description: JSON.stringify(seen) });
  expect(seen.nav, 'navbar tercapai lewat Tab').toBeGreaterThanOrEqual(0);
  expect(seen.control, 'kontrol/filter peta tercapai lewat Tab').toBeGreaterThan(0);
  expect(seen.marker, 'marker peta tercapai lewat Tab').toBeGreaterThan(0);
  expect(invisible, 'elemen fokus tanpa indikator terlihat').toEqual([]);
});

test('keyboard: Enter pada marker membuka panel detail', async ({ page }) => {
  // KNOWN FAIL: marker fokus (tabindex=0, role=button) tapi Enter tidak memicu handler klik.
  // Perbaikannya butuh handler keyboard di disaster-map.tsx (logika; dilarang di fase redesign).
  test.fail(true, 'Enter pada marker belum membuka detail — lihat docs/redesign/REPORT.md');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/map');
  await page.waitForSelector('.leaflet-marker-icon', { timeout: 20_000 });
  await page.locator('.leaflet-marker-icon').first().focus();
  await page.keyboard.press('Enter');
  await expect(
    page.locator('.leaflet-popup, [role="region"][aria-label="Detail kejadian"]').first()
  ).toBeVisible({ timeout: 5_000 });
});

test('menu mobile di 390px bisa dibuka dan ditutup', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const open = page.getByRole('button', { name: 'Buka Menu Navigasi' });
  await open.click();
  const drawer = page.locator('#mobile-nav-drawer');
  await expect(drawer).toBeVisible();
  await expect(page.getByRole('button', { name: 'Tutup Menu Navigasi' })).toHaveAttribute('aria-expanded', 'true');
  // Tombol tutup di dalam drawer (tombol header tertutup overlay saat drawer terbuka).
  await page.getByRole('button', { name: 'Tutup Menu', exact: true }).click();
  await expect(drawer).toBeHidden();
});

for (const route of ROUTES) {
  test(`tanpa scroll horizontal di 390px: ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await page.waitForTimeout(route === '/map' ? 3000 : 800);
    const { sw, iw } = await page.evaluate(() => ({
      sw: document.scrollingElement!.scrollWidth,
      iw: window.innerWidth,
    }));
    expect(sw).toBeLessThanOrEqual(iw);
  });
}

test.describe('reducedMotion: reduce', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });
  for (const route of ['/', '/map', '/advisories', '/volcanoes']) {
    test(`tidak ada animasi tak berujung: ${route}`, async ({ page }) => {
      await page.goto(route);
      await page.waitForTimeout(route === '/map' ? 3000 : 1000);
      const infinite = await page.evaluate(() =>
        document
          .getAnimations()
          .filter(
            (a) =>
              a.playState === 'running' &&
              a.effect?.getComputedTiming().iterations === Infinity
          )
          .map((a) => String((a.effect as KeyframeEffect).target?.className ?? ''))
      );
      expect(infinite).toEqual([]);
    });
  }
});
