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
        addMarkersToMap(
          annuaireManager.brsDiffusionWebsites as PaginationType<BrsDiffusionWebsiteView>,
        );
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

    addMarkersToMap(brsDiffusionWebsites);

    map.on('zoomlevelschange', debounce(handleMapBoundsChange, 500));
    map.on('moveend', debounce(handleMapBoundsChange, 500));
  };

  const deleteMarkersFromMap = () => {
    markers.forEach((marker) => {
      map?.removeLayer(marker);
    });

    markers = [];
  };

  const addMarkersToMap = (
    brsDiffusionWebsites: PaginationType<BrsDiffusionWebsiteView>,
  ) => {
    brsDiffusionWebsites?.items.forEach((item) => {
      markers.push(L.marker([item.latitude, item.longitude]));
    });

    markers.forEach((marker) => marker.addTo(map as Map));
  };

  const handleMapBoundsChange = () => {
    console.log(map?.getBounds());
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
