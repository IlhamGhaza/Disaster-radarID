# SEO Optimization Prompt — Disaster Radar Indonesia

Optimize the existing **Disaster Radar Indonesia** website for search engines, Google Search, social sharing, and discoverability.

## 1. SEO Positioning

The website is an independent public disaster-monitoring and visualization platform for Indonesia.

Primary positioning:

> **Disaster Radar Indonesia — Peta dan Monitoring Bencana Indonesia**

The website aggregates and visualizes disaster-related information from authoritative/public data sources. It is NOT an official government website and must never imply that it represents BNPB, BMKG, PVMBG, or any government institution.

Focus SEO around real user search intent:

* bencana Indonesia
* info bencana Indonesia
* peta bencana Indonesia
* monitoring bencana Indonesia
* bencana terkini Indonesia
* kejadian bencana Indonesia
* peta bencana terkini
* gempa terkini Indonesia
* gempa bumi Indonesia
* banjir Indonesia
* tanah longsor Indonesia
* kebakaran hutan Indonesia
* cuaca ekstrem Indonesia
* tsunami Indonesia
* gunung api Indonesia
* aktivitas gunung api Indonesia
* abu vulkanik Indonesia
* sebaran abu vulkanik
* peringatan dini bencana
* data bencana Indonesia
* kondisi bencana Indonesia
* disaster map Indonesia
* Indonesia disaster map
* Indonesia disaster monitoring

Do NOT keyword-stuff. Keywords must appear naturally.

---

# 2. Global Metadata

Update the global metadata to something similar to:

Title:

> Disaster Radar Indonesia — Peta & Monitoring Bencana Indonesia

Description:

> Pantau bencana Indonesia melalui peta interaktif dan data dari berbagai sumber resmi. Lihat gempa, banjir, longsor, kebakaran, cuaca ekstrem, tsunami, gunung api, abu vulkanik, dan informasi kebencanaan lainnya.

Use a concise title under approximately 60 characters where practical.

Meta description should be approximately 150–160 characters where practical.

Do not duplicate the exact same title and description on every page.

---

# 3. Homepage SEO

Homepage target intent:

**"peta bencana Indonesia" / "bencana Indonesia terkini"**

Recommended title:

> Peta Bencana Indonesia Terkini | Disaster Radar Indonesia

Recommended description:

> Pantau kondisi bencana Indonesia melalui peta interaktif. Lihat gempa, banjir, longsor, kebakaran, cuaca ekstrem, tsunami, gunung api, dan lainnya.

Create a strong H1:

> Peta dan Monitoring Bencana Indonesia

Add supporting introductory content naturally below/around the main interface:

> Disaster Radar Indonesia adalah platform pemantauan dan visualisasi informasi bencana di Indonesia. Jelajahi kejadian bencana, peringatan, aktivitas gunung api, sebaran abu vulkanik, dan informasi kebencanaan melalui peta interaktif.

Do not make this text visually dominant. The map remains the primary product experience.

---

# 4. Main Map Page `/map`

Optimize `/map` specifically for search intent around:

* peta bencana Indonesia
* peta bencana terkini
* disaster map Indonesia
* monitoring bencana Indonesia
* peta gempa Indonesia
* peta banjir Indonesia
* peta gunung api Indonesia

Suggested title:

> Peta Bencana Indonesia Terkini | Disaster Radar

Suggested description:

> Jelajahi peta interaktif bencana Indonesia dan pantau gempa, banjir, longsor, kebakaran, cuaca ekstrem, tsunami, gunung api, serta abu vulkanik.

H1:

> Peta Bencana Indonesia

Add an SEO-friendly explanatory section outside the map UI:

### Tentang Peta Bencana Indonesia

Explain:

* what the map displays
* supported disaster categories
* difference between events, warnings, hazards, and risk
* data freshness
* source attribution
* that information comes from public/authoritative sources
* that the platform is not a replacement for official emergency instructions

Avoid keyword stuffing.

---

# 5. Disaster Category Pages

Create SEO-friendly pages for each major disaster category if the application architecture supports it.

Suggested routes:

`/disasters/earthquake`

`/disasters/flood`

`/disasters/landslide`

`/disasters/forest-fire`

`/disasters/extreme-weather`

`/disasters/tsunami`

`/disasters/volcano`

`/disasters/volcanic-ash`

`/disasters/drought`

`/disasters/coastal-hazard`

Each page should have unique metadata.

Example:

## Earthquake

Title:

> Gempa Terkini Indonesia | Peta Gempa Bumi

H1:

> Gempa Terkini Indonesia

Description:

> Pantau informasi gempa bumi Indonesia melalui peta interaktif dan data yang tersedia dari sumber resmi.

## Flood

Title:

> Peta Banjir Indonesia | Monitoring Banjir Terkini

H1:

> Peta Banjir Indonesia

## Volcano

Title:

> Gunung Api Indonesia | Aktivitas & Peta Gunung Berapi

H1:

> Aktivitas Gunung Api Indonesia

## Volcanic Ash

Title:

> Peta Sebaran Abu Vulkanik Indonesia | Volcanic Ash

H1:

> Sebaran Abu Vulkanik Indonesia

Keep the existing AshWatch functionality and volcano pages intact.

---

# 6. Volcano / AshWatch SEO

IMPORTANT:

The existing AshWatch volcano implementation is already functional.

Do NOT rebuild or remove it.

Preserve existing:

* volcano directory
* volcano detail pages
* MAGMA/PVMBG information
* Darwin VAAC information
* volcanic ash polygons
* observed ash
* forecast ash
* flight levels
* ash movement
* advisory history
* source attribution
* map functionality

Improve its SEO metadata and integrate it naturally into Disaster Radar Indonesia.

Example volcano detail:

`/volcanoes/[slug]`

Dynamic title:

> [Volcano Name] — Aktivitas Gunung Api | Disaster Radar Indonesia

Example:

> Gunung Semeru — Aktivitas Gunung Api | Disaster Radar Indonesia

Dynamic description should include available factual information such as:

* volcano name
* location
* current status when available
* latest advisory information
* ash information when available

Do NOT generate fake status information.

---

# 7. Dynamic Event Pages

Where technically appropriate, create indexable disaster event pages.

Example:

`/events/[id]`

Metadata should dynamically use:

* disaster type
* location
* date/time
* event title

Example:

> Gempa M 5.2 di Indonesia — 7 September 2026 | Disaster Radar

However:

DO NOT create thousands of low-quality/thin pages automatically.

Only allow indexing when an event contains meaningful, stable information.

For temporary or low-value events, use:

`noindex, follow`

when appropriate.

---

# 8. Structured Data / JSON-LD

Implement valid JSON-LD where appropriate.

Homepage:

* WebSite
* Organization or WebApplication where appropriate

Article/advisory/event pages:

* Article / NewsArticle only when the content genuinely qualifies
* Event only when appropriate

Do NOT misuse structured data simply to manipulate search results.

Include:

* name
* description
* url
* publisher
* datePublished
* dateModified

when the corresponding information actually exists.

---

# 9. Organization / Website Identity

Create consistent brand identity:

Name:

> Disaster Radar Indonesia

Short brand:

> Disaster Radar ID

Description:

> Indonesia Disaster Monitoring

Do not describe the platform as:

* official BNPB
* official BMKG
* official PVMBG
* government disaster center

unless explicitly referring to those institutions as data sources.

---

# 10. Internal Linking

Build a strong internal linking structure.

Homepage should link to:

* Peta Bencana
* Gempa
* Banjir
* Longsor
* Kebakaran
* Cuaca Ekstrem
* Tsunami
* Gunung Api
* Abu Vulkanik
* Data Sources
* FAQ
* About

Disaster pages should link to:

* main map
* related disaster categories
* relevant event pages
* data sources
* volcano pages where relevant

Volcano pages should link back to:

* Volcano directory
* main map
* volcanic ash information
* data sources

Use descriptive anchor text.

Avoid generic anchors such as:

> Click here

Prefer:

> Lihat peta bencana Indonesia

---

# 11. Sitemap

Ensure `/sitemap.xml` exists and is dynamically generated where necessary.

Include important indexable routes:

* homepage
* map
* disaster category pages
* volcano directory
* volcano detail pages
* advisory pages
* data sources
* FAQ
* about

Do NOT include:

* API routes
* internal utility routes
* private/admin pages
* temporary pages
* pages marked noindex

If event pages are generated dynamically, only include eligible indexable events.

---

# 12. Robots.txt

Ensure `/robots.txt` is correctly configured.

Allow search engine crawlers to access public content.

Disallow internal/private/API paths when appropriate.

Do not accidentally block:

* homepage
* map
* disaster pages
* volcano pages
* important static assets

---

# 13. Canonical URLs

Implement canonical URLs for all indexable pages.

Every page should have a stable canonical URL.

Handle:

* query parameters
* filters
* sorting
* pagination
* duplicate URLs

Do not allow endless combinations of map filters to become indexed pages.

Example:

`/map?type=earthquake&days=7`

should generally canonicalize to the main map page unless there is a deliberate SEO page for that combination.

---

# 14. Open Graph / Social SEO

Implement high-quality Open Graph metadata.

Default:

Title:

> Disaster Radar Indonesia — Peta & Monitoring Bencana

Description:

> Pantau kondisi bencana Indonesia melalui peta interaktif dan data dari berbagai sumber resmi.

Image:

Create/use a dedicated branded OG image containing:

* Disaster Radar Indonesia
* radar/map visual
* Indonesia silhouette
* dark futuristic visual identity
* minimal text

Recommended size:

> 1200 × 630

Also configure:

* `og:type`
* `og:title`
* `og:description`
* `og:url`
* `og:image`
* `twitter:card`
* `twitter:title`
* `twitter:description`
* `twitter:image`

---

# 15. Technical SEO

Audit and improve:

* semantic HTML
* heading hierarchy
* H1 uniqueness
* title uniqueness
* meta descriptions
* canonical URLs
* sitemap
* robots.txt
* Open Graph
* structured data
* image alt text
* loading performance
* Core Web Vitals
* mobile responsiveness
* accessible navigation
* crawlability

Avoid excessive JavaScript for content that should be discoverable by search engines.

The interactive map can remain client-side, but important explanatory content should be available in crawlable HTML.

---

# 16. Performance SEO

The map is the main application and can be resource-heavy.

Optimize:

* JavaScript bundles
* map initialization
* GeoJSON loading
* polygon rendering
* images
* fonts
* unnecessary client-side components
* API requests

Use lazy loading where appropriate.

Do not sacrifice map functionality merely for SEO.

The target is a balance between:

> interactive GIS experience + strong organic search performance

---

# 17. E-E-A-T / Trust Signals

Create a clear `/data-sources` page.

Explain each data source and what information it provides.

Examples:

* BNPB
* BMKG
* PVMBG / MAGMA
* Darwin VAAC
* other verified/public sources actually used by the application

For every disaster dataset, show:

* source
* last updated
* data type
* freshness
* attribution

Add a clear disclaimer:

> Disaster Radar Indonesia is an independent information visualization platform. For emergency decisions and official warnings, always refer to the relevant official authorities.

Do NOT claim government affiliation.

---

# 18. FAQ SEO

Improve `/faq` with real questions users may search for.

Examples:

### Apa itu Disaster Radar Indonesia?

### Bagaimana cara melihat peta bencana Indonesia?

### Dari mana data bencana Disaster Radar Indonesia berasal?

### Apakah Disaster Radar Indonesia merupakan situs resmi pemerintah?

### Bagaimana cara melihat gempa terkini Indonesia?

### Bagaimana cara melihat aktivitas gunung api?

### Apa perbedaan kejadian bencana, peringatan, hazard, dan risk?

### Bagaimana cara melihat sebaran abu vulkanik?

### Seberapa sering data diperbarui?

Answers must be factual and based on the application's actual data sources and implementation.

---

# 19. Breadcrumbs

Implement breadcrumbs on deeper pages.

Example:

> Home → Bencana → Gempa → Gempa di [Location]

and:

> Home → Gunung Api → [Volcano Name]

Use BreadcrumbList structured data where appropriate.

---

# 20. Indonesian + English SEO

Primary language:

> Indonesian

The main SEO strategy should target Indonesian searches.

English metadata/content can be added later for international users searching:

* Indonesia disaster map
* Indonesia earthquake map
* Indonesia volcano monitoring
* Indonesia volcanic ash
* Indonesia disaster monitoring

Do not create duplicate translated pages unless the application properly supports localization.

---

# 21. Important SEO Rules

NEVER:

* fabricate disaster events
* fabricate official warnings
* fabricate earthquake predictions
* claim a disaster is happening without source data
* claim government affiliation
* create fake statistics for SEO
* keyword stuff
* generate thousands of thin event pages
* create fake reviews
* create fake organization information

Search engine optimization must never compromise data integrity.

---

# 22. Final SEO Brand Position

The overall search identity should communicate:

> **Disaster Radar Indonesia**
>
> Peta dan Monitoring Bencana Indonesia

Core SEO concept:

> **"Satu peta untuk memantau kondisi bencana Indonesia."**

The product should become discoverable for users searching for:

> "bencana Indonesia"

> "peta bencana Indonesia"

> "bencana terkini Indonesia"

> "gempa terkini"

> "peta gempa Indonesia"

> "banjir Indonesia"

> "gunung api Indonesia"

> "abu vulkanik Indonesia"

while maintaining a trustworthy, data-driven identity.

---

# 23. Implementation Requirement

Before changing anything:

1. Inspect the existing AshWatch codebase.
2. Identify the current metadata implementation.
3. Identify existing sitemap and robots implementation.
4. Identify existing routes.
5. Identify existing volcano/AshWatch SEO metadata.
6. Preserve working functionality.
7. Refactor rather than duplicate code.
8. Implement SEO improvements incrementally.
9. Run the production build.
10. Fix all TypeScript/build errors.

At the end, provide a concise report containing:

* SEO files changed
* routes optimized
* metadata implemented
* structured data implemented
* sitemap changes
* robots changes
* canonical strategy
* Open Graph changes
* internal linking changes
* remaining SEO opportunities
* build/test result

Do not break existing AshWatch functionality while implementing this SEO upgrade.
