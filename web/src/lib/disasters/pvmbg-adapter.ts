import { DisasterEvent } from './types';
import { getAllMonitoredVolcanoes, MonitoredVolcanoItem } from '@/lib/magma-status';

export function getPvmbgVolcanoEvents(): DisasterEvent[] {
  const volcanoes: MonitoredVolcanoItem[] = getAllMonitoredVolcanoes();

  // Filter and map all volcanoes with Level II (Waspada), Level III (Siaga), Level IV (Awas)
  // Plus key active monitored volcanoes
  return volcanoes
    .filter((v) => v.level >= 2)
    .map((v) => {
      const severity =
        v.level === 4 ? 'critical' : v.level === 3 ? 'high' : 'moderate';

      const radiusKm = v.level === 4 ? 12 : v.level === 3 ? 7 : 4;

      return {
        id: `pvmbg-volcano-${v.volcanoSlug}`,
        type: 'volcano',
        title: `Gunung ${v.volcanoName} (${v.levelRoman}: ${v.levelName})`,
        description: `${v.description} Rekomendasi: ${v.recommendation}`,
        latitude: v.position.latitude,
        longitude: v.position.longitude,
        locationName: `${v.volcanoName}, ${v.area}`,
        province: v.island,
        eventTime: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        severity,
        status: `${v.levelRoman} - ${v.levelName}`,
        source: {
          name: 'PVMBG / MAGMA ESDM',
          url: v.sourceUrl || 'https://magma.esdm.go.id/',
          description: 'Pusat Vulkanologi dan Mitigasi Bencana Geologi',
        },
        isOfficialWarning: v.level >= 3,
        radiusKm,
        metadata: {
          magmaLevel: v.level,
          magmaLevelName: v.levelName,
          volcanoSlug: v.volcanoSlug,
          elevation: v.elevation,
          island: v.island,
        },
      };
    });
}
