import { getBrsDiffusionWebsites } from '$lib/api/brs-diffusion-websites';

import type { BrsDiffusionWebsiteView, Pagination } from '$lib/utils/api-types';
import { defaultCoords, defaultPagination } from '$lib/utils/constants';

class AnnuaireManager {
  radius = $state<number>(50);
  latitude = $state<number>(defaultCoords.latitude);
  longitude = $state<number>(defaultCoords.longitude);
  brsDiffusionWebsites = $state<Pagination<BrsDiffusionWebsiteView> | null>(
    null,
  );

  setBrsDiffusionWebsites = async ({
    coords,
    radius,
  }: {
    coords?: { latitude: number; longitude: number };
    radius?: number;
  }) => {
    this.latitude = coords?.latitude || this.latitude;
    this.longitude = coords?.longitude || this.longitude;
    this.radius = radius || this.radius;

    const query = {
      page: defaultPagination.page,
      pageSize: defaultPagination.pageSize,
      latitude: this.latitude,
      longitude: this.longitude,
      radius: this.radius,
    };

    const brsDiffusionWebsites = await getBrsDiffusionWebsites(query);
    this.brsDiffusionWebsites = brsDiffusionWebsites;
  };
}

const annuaireManager = new AnnuaireManager();

export default annuaireManager;
