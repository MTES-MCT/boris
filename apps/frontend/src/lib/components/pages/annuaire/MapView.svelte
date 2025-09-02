<script lang="ts">
  import 'leaflet/dist/leaflet.css';
  import 'leaflet.markercluster/dist/MarkerCluster.css';
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
  import L, { Map } from 'leaflet';
  import 'leaflet.markercluster';
  import type {
    BrsDiffusionWebsiteView,
    Pagination as PaginationType,
  } from '$lib/utils/api-types';
  import { onMount } from 'svelte';
  import annuaireManager from '$lib/managers/annuaire.svelte';
  import { debounce } from '$lib/utils/helpers';
  import Card from '$components/pages/annuaire/Card.svelte';

  type Props = {
    brsDiffusionWebsites: PaginationType<BrsDiffusionWebsiteView>;
  };

  const { brsDiffusionWebsites }: Props = $props();

  let mapRef: HTMLDivElement;
  let map: Map;
  let markers = L.markerClusterGroup();
  let brsDiffusionWebsitesInBounds = $state(brsDiffusionWebsites.items);
  let selectedMarkerId = $state('');

  onMount(() => {
    createMap();
  });

  $effect(() => {
    map?.setView(
      [annuaireManager.latitude, annuaireManager.longitude],
      annuaireManager.zoom,
    );

    deleteMarkersFromMap();
    addMarkersToMap();
  });

  $effect(() => {
    if (selectedMarkerId) {
      const element = document.getElementById(selectedMarkerId);

      element?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  });

  const createMap = () => {
    map = L.map(mapRef, {
      center: [annuaireManager.latitude, annuaireManager.longitude],
      zoom: annuaireManager.zoom,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    addMarkersToMap();

    map.on('zoomlevelschange', debounce(handleMapBoundsChange, 200));
    map.on('moveend', debounce(handleMapBoundsChange, 200));

    handleMapBoundsChange();
  };

  const deleteMarkersFromMap = () => {
    map?.removeLayer(markers);
    markers = L.markerClusterGroup();
  };

  const addMarkersToMap = () => {
    brsDiffusionWebsites?.items.forEach((item) => {
      const markerLayer = L.marker([item.latitude, item.longitude]);

      markerLayer.on('click', () => {
        selectedMarkerId = item.id;
      });

      markers.addLayer(markerLayer);
    });

    map?.addLayer(markers);
  };

  const handleMapBoundsChange = () => {
    const northEastLat = map.getBounds().getNorthEast().lat;
    const northEastLng = map.getBounds().getNorthEast().lng;
    const southWestLat = map.getBounds().getSouthWest().lat;
    const southWestLng = map.getBounds().getSouthWest().lng;

    brsDiffusionWebsitesInBounds = brsDiffusionWebsites.items.filter(
      (item) =>
        item.latitude <= northEastLat &&
        item.latitude >= southWestLat &&
        item.longitude <= northEastLng &&
        item.longitude >= southWestLng,
    );

    const firstElement = document.getElementById(
      brsDiffusionWebsites.items[0].id,
    );

    firstElement?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    });
  };

  $inspect(selectedMarkerId);
</script>

<div class="fr-col-12 container">
  <div class="list-container">
    <div class="fr-mb-0 fr-text--sm search-results">
      <b>
        {brsDiffusionWebsitesInBounds.length} résultat{brsDiffusionWebsitesInBounds.length >
        1
          ? 's'
          : ''}
      </b>
    </div>
    <ul>
      {#each brsDiffusionWebsitesInBounds as item}
        <li id={item.id}>
          <Card
            {...item}
            cardTitleElement="h3"
            narrow
            selected={item.id === selectedMarkerId} />
        </li>
      {/each}
    </ul>
  </div>
  <div
    id="map"
    bind:this={mapRef}>
  </div>
</div>

<style lang="postcss">
  .container {
    max-width: 110rem;
    width: 100%;
    margin: 0 auto;
    height: calc(100vh - 22rem);
    display: flex;
    padding-bottom: 4rem;
    padding-inline: var(--2w);
  }

  .list-container {
    height: calc(100vh - 26rem);
    overflow: hidden;
    position: relative;
  }

  .search-results {
    background-color: white;
    height: var(--6w);
    padding-left: var(--2w);
    display: flex;
    align-items: center;
    padding-top: var(--1w);
  }

  ul {
    width: 18rem;
    list-style: none;
    background-color: white;
    margin: 0;
    padding: var(--2w);
    padding-top: 0;
    height: calc(100% - var(--6w));
    overflow-y: auto;

    @media (--lg-viewport) {
      width: 28rem;
    }

    li {
      padding-top: var(--1w);
    }
  }

  #map {
    height: 100%;
    flex: 1;
  }
</style>
