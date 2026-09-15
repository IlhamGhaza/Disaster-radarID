# Graph Report - Disaster-radarID  (2026-09-15)

## Corpus Check
- 84 files · ~183,393 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .ico 3, (none) 2, .webmanifest 2)

## Summary
- 510 nodes · 1027 edges · 30 communities (19 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0938e940`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- ash-map.tsx
- test-runner.ts
- seo.md
- package.json
- [id]/page.tsx
- What You Must Do When Invoked
- Laporan Audit Komprehensif — Disaster Radar Indonesia
- disasters/types.ts
- compilerOptions
- 🌋 AshWatch Web — Darwin VAAC Volcanic Ash Viewer & Technical SEO
- disaster-map.tsx
- graphify reference: extra exports and benchmark
- vercel.json
- graphify reference: query, path, explain
- opengraph-image.tsx
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- rules/graphify.md
- workflows/graphify.md
- CLAUDE.md
- .claude/CLAUDE.md
- extraction-spec.md
- AGENTS.md
- eslint.config.mjs
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `react` - 29 edges
2. `VolcanoAdvisory` - 29 edges
3. `lucide-react` - 26 edges
4. `next` - 18 edges
5. `getDarwinAdvisories()` - 18 edges
6. `SITE_URL` - 17 edges
7. `formatMovementHuman()` - 16 edges
8. `DisasterEvent` - 16 edges
9. `compilerOptions` - 16 edges
10. `getAggregatedDisasters()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `LiveAdvisoriesListProps` --references--> `VolcanoAdvisory`  [EXTRACTED]
  web/src/components/live-advisories-list.tsx → web/src/lib/types.ts
- `LiveAdvisoryTickerProps` --references--> `VolcanoAdvisory`  [EXTRACTED]
  web/src/components/live-advisory-ticker.tsx → web/src/lib/types.ts
- `AdvisoriesResponse` --references--> `VolcanoAdvisory`  [EXTRACTED]
  web/src/lib/advisories.ts → web/src/lib/types.ts
- `generateMetadata()` --calls--> `getDarwinAdvisories()`  [EXTRACTED]
  web/src/app/advisories/[id]/page.tsx → web/src/lib/advisories.ts
- `AdvisoriesPage()` --calls--> `getDarwinAdvisories()`  [EXTRACTED]
  web/src/app/advisories/page.tsx → web/src/lib/advisories.ts

## Import Cycles
- None detected.

## Communities (30 total, 10 thin omitted)

### Community 0 - "react"
Cohesion: 0.06
Nodes (50): lucide-react, next, react, nextConfig, metadata, metadata, revalidate, metadata (+42 more)

### Community 1 - "ash-map.tsx"
Cohesion: 0.08
Nodes (41): leaflet, sitemap(), CheckMyAreaCard(), CheckMyAreaCardProps, IndonesiaMiniMap(), initMiniMap(), IndonesiaMiniMapProps, AshMap() (+33 more)

### Community 2 - "test-runner.ts"
Cohesion: 0.07
Nodes (30): AdvisoriesResponse, MULTIPLE_ADVISORIES_FIXTURE, SINGLE_ADVISORY_FIXTURE, parseAviationComponent(), parseAviationCoordinate(), parsePolygonCoordinates(), parseDtg(), parseForecastDtg() (+22 more)

### Community 3 - "seo.md"
Cohesion: 0.05
Nodes (38): 10. Internal Linking, 11. Sitemap, 12. Robots.txt, 13. Canonical URLs, 14. Open Graph / Social SEO, 15. Technical SEO, 16. Performance SEO, 17. E-E-A-T / Trust Signals (+30 more)

### Community 4 - "package.json"
Cohesion: 0.05
Nodes (37): eslint, eslint-config-next, react-dom, tailwindcss, @tailwindcss/postcss, tsx, @types/leaflet, @types/node (+29 more)

### Community 5 - "[id]/page.tsx"
Cohesion: 0.14
Nodes (22): AdvisoryDetailPage(), generateMetadata(), PageProps, AdvisoriesPage(), dynamic, GET(), VolcanoesPage(), generateMetadata() (+14 more)

### Community 6 - "What You Must Do When Invoked"
Cohesion: 0.07
Nodes (26): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+18 more)

### Community 7 - "Laporan Audit Komprehensif — Disaster Radar Indonesia"
Cohesion: 0.09
Nodes (21): 1. Framework & Runtime, 1. Konsep Estetika: *"National Geospatial Defense & Telemetry Command"*, 2. Mesin Pemetaan & Geospasial, 2. Sistem Tipografi Modern, 3. Layer Agregasi & Normalisasi Data, 3. Palet Peringatan Terkalibrasi (WCAG AA), 4. Mesin Kalkulasi Spasial & Cache Klien, 4. Penyempurnaan Kartografi OpenStreetMap (+13 more)

### Community 8 - "disasters/types.ts"
Cohesion: 0.09
Nodes (31): dynamic, GET(), DisastersIndexPage(), CategoryDetailPage(), MapPage(), metadata, revalidate, TacticalRadarHud() (+23 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "🌋 AshWatch Web — Darwin VAAC Volcanic Ash Viewer & Technical SEO"
Cohesion: 0.13
Nodes (14): 1. Install Dependencies, 2. Run Unit Tests (VAA Parser, Coordinates, Dates), 3. Run Development Server, 4. Production Build Verification, 🌋 AshWatch Web — Darwin VAAC Volcanic Ash Viewer & Technical SEO, ⚙️ Environment Variables, 🔍 Google Search Console Setup, 🚀 Key Features (+6 more)

### Community 11 - "disaster-map.tsx"
Cohesion: 0.13
Nodes (27): GET(), revalidate, AirQualityCard(), AirQualityCardProps, createDisasterMarkerHtml(), DisasterIconProps, LocationAlertBanner(), DISASTER_VISUALS (+19 more)

### Community 12 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 13 - "vercel.json"
Cohesion: 0.29
Nodes (6): buildCommand, cleanUrls, framework, headers, $schema, trailingSlash

### Community 14 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 15 - "opengraph-image.tsx"
Cohesion: 0.33
Nodes (4): alt, contentType, runtime, size

### Community 16 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 17 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 18 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **246 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+241 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 284 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `ash-map.tsx`, `package.json`, `[id]/page.tsx`, `disasters/types.ts`, `disaster-map.tsx`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `ash-map.tsx`, `package.json`, `[id]/page.tsx`, `disasters/types.ts`, `disaster-map.tsx`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `next` connect `react` to `disasters/types.ts`, `ash-map.tsx`, `package.json`, `[id]/page.tsx`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _246 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.058544303797468354 - nodes in this community are weakly interconnected._
- **Should `ash-map.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08311688311688312 - nodes in this community are weakly interconnected._
- **Should `test-runner.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07272727272727272 - nodes in this community are weakly interconnected._