<script lang="ts">
  import 'leaflet/dist/leaflet.css';
  import L, { Map, Marker } from 'leaflet';
  import type {
    BrsDiffusionWebsiteView,
    Pagination as PaginationType,
  } from '$lib/utils/api-types';
  import { onMount } from 'svelte';
  import annuaireManager from '$lib/managers/annuaire.svelte';
  import { defaultZoom } from '$lib/utils/constants';
  import { debounce } from '$lib/utils/helpers';
  import { getBrsDiffusionWebsitesByBounds } from '$lib/api/brs-diffusion-websites';

  type Props = {
    brsDiffusionWebsites: PaginationType<BrsDiffusionWebsiteView>;
  };

  const { brsDiffusionWebsites }: Props = $props();

  let mapRef: HTMLDivElement;
  let map = $state<Map | null>(null);
  let markers: Marker[] = [];

  onMount(() => {
    createMap();
  });

  $effect(() => {
    if (annuaireManager.brsDiffusionWebsites) {
      map?.setView([annuaireManager.latitude, annuaireManager.longitude]);

      if (map) {
        deleteMarkersFromMap();
        addMarkersToMap(annuaireManager.brsDiffusionWebsites.items);
      }
    }
  });

  const createMap = () => {
    map = L.map(mapRef, {
      center: [annuaireManager.latitude, annuaireManager.longitude],
      zoom: defaultZoom,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    addMarkersToMap(brsDiffusionWebsites.items);

    map.on('zoomlevelschange', debounce(handleMapBoundsChange, 500));
    map.on('moveend', debounce(handleMapBoundsChange, 500));
  };

  const deleteMarkersFromMap = () => {
    markers.forEach((marker) => {
      map?.removeLayer(marker);
    });

    markers = [];
  };

  const addMarkersToMap = (brsDiffusionWebsites: BrsDiffusionWebsiteView[]) => {
    brsDiffusionWebsites?.forEach((item) => {
      markers.push(L.marker([item.latitude, item.longitude]));
    });

    markers.forEach((marker) => marker.addTo(map as Map));
  };

  const handleMapBoundsChange = async () => {
    const data = await getBrsDiffusionWebsitesByBounds({
      northEastLat: map?.getBounds().getNorthEast().lat as number,
      northEastLng: map?.getBounds().getNorthEast().lng as number,
      southWestLat: map?.getBounds().getSouthWest().lat as number,
      southWestLng: map?.getBounds().getSouthWest().lng as number,
    });

    let items = [...data.items];

    let currentPage = data.page;

    if (data.hasNextPage) {
      for (const pageNumber of new Array(data.pagesCount - 1)) {
        currentPage = currentPage + 1;

        const pageData = await getBrsDiffusionWebsitesByBounds({
          page: currentPage,
          northEastLat: map?.getBounds().getNorthEast().lat as number,
          northEastLng: map?.getBounds().getNorthEast().lng as number,
          southWestLat: map?.getBounds().getSouthWest().lat as number,
          southWestLng: map?.getBounds().getSouthWest().lng as number,
        });

        items = [...items, ...pageData.items];

        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    deleteMarkersFromMap();
    addMarkersToMap(items);
  };

  $inspect(annuaireManager.brsDiffusionWebsites);
</script>

<div class="fr-col-12">
  <div
    id="map"
    bind:this={mapRef}>
  </div>
</div>

<style lang="postcss">
  #map {
    height: calc(100vh - 150px);
  }
</style>
