import { getBrsDiffusionWebsites } from '$lib/api/brs-diffusion-websites';

import type { BrsDiffusionWebsiteView, Pagination } from '$lib/utils/api-types';
import { defaultCoords, defaultPagination, defaultRadius } from '$lib/utils/constants';

class AnnuaireManager {
  radius = $state<number>(defaultRadius);
  latitude = $state<number>(defaultCoords.latitude);
  longitude = $state<number>(defaultCoords.longitude);
  brsDiffusionWebsites = $state<Pagination<BrsDiffusionWebsiteView> | null>(
    null,
  );
  viewType = $state<'list' | 'map'>('list')

  setBrsDiffusionWebsites = async ({
    coords,
    radius,
  }: {
    coords?: { latitude: number; longitude: number };
    radius?: number;
  }) => {

    const query = {
      page: defaultPagination.page,
      pageSize: defaultPagination.pageSize,
      latitude: coords?.latitude || this.latitude,
      longitude: coords?.longitude || this.longitude,
      radius: radius || this.radius,
    };

    const brsDiffusionWebsites = await getBrsDiffusionWebsites(query);
    this.brsDiffusionWebsites = brsDiffusionWebsites;

    this.latitude = coords?.latitude || this.latitude;
    this.longitude = coords?.longitude || this.longitude;
    this.radius = radius || this.radius;
  };
}

const annuaireManager = new AnnuaireManager();

export default annuaireManager;
