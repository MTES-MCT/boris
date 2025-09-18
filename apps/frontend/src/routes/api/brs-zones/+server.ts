import { reverse } from '$lib/api/ign.js';
import type { ZoneABC } from '$lib/utils/definitions';
import { json } from '@sveltejs/kit';

const API_URL =
  'https://www.service-public.fr/simulateur/calcul/zonage-abc/Default/source';

export const GET = async ({ url }) => {
  const { searchParams } = url;
  const latitude = searchParams.get('latitude') as string;
  const longitude = searchParams.get('longitude') as string;

  let inseeCode;

  try {
    const reverseResponse = await reverse(latitude, longitude);

    if (reverseResponse.features.length) {
      const feature = reverseResponse.features[0];

      if (feature.properties?.city.includes('Paris')) {
        inseeCode = 75056;
      } else if (feature.properties?.city.includes('Lyon')) {
        inseeCode = 69123;
      } else if (feature.properties?.city.includes('Marseille')) {
        inseeCode = 13055;
      } else {
        inseeCode = feature.properties?.citycode;
      }
    }

    const formdata = new FormData();
    formdata.append('source', '1');
    formdata.append('param1', inseeCode);

    const brsZoneResponse = await fetch(API_URL, {
      method: 'POST',
      body: formdata,
    });

    const brsZoneData: string = await brsZoneResponse.text();
    const brsZone: ZoneABC = JSON.parse(brsZoneData);

    return json(brsZone?.zoneabc || 'C');
  } catch (e) {
    console.log(e);
  }
};
