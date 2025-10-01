import type { BrsDiffusionWebsiteView, Pagination } from '$lib/utils/api-types';
import {
  defaultCoords,
  defaultPagination,
  defaultRadius,
  defaultZoomMobile,
  defaultZoomDesktop,
} from '$lib/utils/constants';

class AnnuaireManager {
  public radius = $state<number>(defaultRadius);
  public latitude = $state<number>(defaultCoords.latitude);
  public longitude = $state<number>(defaultCoords.longitude);
  public isMobile = $state(window.innerWidth <= 44 * 16);
  public zoom = $derived<number>(
    this.isMobile ? defaultZoomMobile : defaultZoomDesktop,
  );
  public listBrsDiffusionWebsites =
    $state<Pagination<BrsDiffusionWebsiteView> | null>(null);
  public viewType = $state<'list' | 'map'>('map');
  public autocompleteValue = $state('');
  public hasSearchedTroughAutocomplete = $state(false);
  public isListLoading = $state(false);
  public mapElementRef = $state<HTMLDivElement | null>(null);
  public updateMapView = $state(false);

  setListBrsDiffusionWebsites = async ({
    page,
    coords,
    radius,
  }: {
    page?: number;
    coords?: { latitude: number; longitude: number };
    radius?: number;
  }) => {
    this.latitude = coords?.latitude || this.latitude;
    this.longitude = coords?.longitude || this.longitude;
    this.radius = radius || this.radius;

    const query = {
      page: page || defaultPagination.page,
      pageSize: defaultPagination.pageSize,
      latitude: coords?.latitude || this.latitude,
      longitude: coords?.longitude || this.longitude,
      radius: radius || this.radius,
    };

    this.isListLoading = true;

    const url = new URL(`${window.location.origin}/api/brs-diffusion-websites`);
    url.searchParams.set('page', query.page.toString());
    url.searchParams.set('pageSize', query.pageSize.toString());
    url.searchParams.set('latitude', query.latitude.toString());
    url.searchParams.set('longitude', query.longitude.toString());
    url.searchParams.set('radius', query.radius.toString());

    const response = await fetch(url);
    const brsDiffusionWebsites = await response.json();

    this.listBrsDiffusionWebsites = brsDiffusionWebsites;
    this.isListLoading = false;
  };
}

const annuaireManager = new AnnuaireManager();

export default annuaireManager;
