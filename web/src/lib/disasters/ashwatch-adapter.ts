import { DisasterEvent } from './types';
import { getDarwinAdvisories } from '@/lib/advisories';
import { VolcanoAdvisory } from '@/lib/types';

export async function getAshwatchAdvisoryEvents(): Promise<{
  events: DisasterEvent[];
  advisories: VolcanoAdvisory[];
  lastUpdated: string;
}> {
  try {
    const data = await getDarwinAdvisories();
    const advisories = data.deduplicated || [];

    const events: DisasterEvent[] = advisories.map((adv) => {
      const lat = adv.position?.latitude || -7.5;
      const lon = adv.position?.longitude || 110.4;

      const hasObserved = adv.polygons.some((p) => p.type === 'observed');
      const severity = hasObserved ? 'critical' : 'high';

      return {
        id: `vaac-advisory-${adv.id}`,
        type: 'volcanic-ash',
        title: `Sebaran Abu Vulkanik ${adv.volcanoName}`,
        description: `Advisori Darwin VAAC No. ${adv.advisoryNumber}. Ketinggian Abu: ${adv.primaryFlightLevel}. Pergerakan: ${adv.primaryMovement}.`,
        latitude: lat,
        longitude: lon,
        locationName: `${adv.volcanoName}, ${adv.area}`,
        province: adv.area,
        eventTime: adv.dtg || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        severity,
        status: hasObserved ? 'Abu Teramati (Satelit)' : 'Prakiraan Sebaran',
        source: {
          name: 'Darwin VAAC / BoM Australia',
          url: 'https://www.bom.gov.au/products/Volc_ash_recent.shtml',
          description: 'Volcanic Ash Advisory Centre Darwin',
        },
        isOfficialWarning: true,
        radiusKm: 35,
        metadata: {
          advisoryId: adv.id,
          volcanoSlug: adv.volcanoSlug,
          flightLevel: adv.primaryFlightLevel,
          eruptionDetails: adv.eruptionDetails,
          remarks: adv.remarks,
        },
      };
    });

    return {
      events,
      advisories,
      lastUpdated: data.updatedAt || new Date().toISOString(),
    };
  } catch (err) {
    console.warn('Failed to load Darwin VAAC advisories:', err);
    return {
      events: [],
      advisories: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}
