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

  const markerClusterGroupOptions = {
    spiderLegPolylineOptions: {
      color: '#3917b3',
      opacity: 1,
    },
    polygonOptions: {
      color: '#3917b3',
      fillColor: '#3917b3',
    },
  };

  const { brsDiffusionWebsites }: Props = $props();

  let mapRef: HTMLDivElement;
  let map: Map;
  let markers = L.markerClusterGroup(markerClusterGroupOptions);
  let brsDiffusionWebsitesInBounds = $state(brsDiffusionWebsites.items);
  let selectedMarker = $state<BrsDiffusionWebsiteView | null>(null);

  onMount(() => {
    createMap();
  });

  $effect(() => {
    map?.setView(
      [annuaireManager.latitude, annuaireManager.longitude],
      annuaireManager.zoom,
    );

    selectedMarker = null;
    deleteMarkersFromMap();
    addMarkersToMap();
  });

  $effect(() => {
    if (selectedMarker) {
      const element = document.getElementById(selectedMarker.id);

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

    L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png',
      {
        minZoom: 0,
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    ).addTo(map);

    addMarkersToMap();

    map.on('zoomlevelschange', debounce(handleMapBoundsChange, 200));
    map.on('moveend', debounce(handleMapBoundsChange, 200));

    handleMapBoundsChange();
  };

  const deleteMarkersFromMap = () => {
    map?.removeLayer(markers);
    markers = L.markerClusterGroup(markerClusterGroupOptions);
  };

  const addMarkersToMap = () => {
    const icon = L.divIcon({
      className: 'map-icon',
      html: `<span class="fr-icon-map-pin-2-fill" aria-hidden="true"></span>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    brsDiffusionWebsites?.items.forEach((item) => {
      const markerLayer = L.marker([item.latitude, item.longitude], { icon });

      markerLayer.on('click', () => {
        selectedMarker = brsDiffusionWebsites.items.find(
          (brsDiffusionWebsite) => brsDiffusionWebsite.id === item.id,
        ) as BrsDiffusionWebsiteView;
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

  const handleMobileCardClose = () => {
    selectedMarker = null;
  };
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
            selected={item.id === selectedMarker?.id} />
        </li>
      {/each}
    </ul>
  </div>
  <div
    id="map"
    bind:this={mapRef}>
    {#if selectedMarker}
      <div class="mobile-card">
        <Card
          {...selectedMarker}
          cardTitleElement="h3"
          narrow
          handleClose={handleMobileCardClose} />
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  .container {
    max-width: 110rem;
    width: 100%;
    margin: 0 auto;
    height: calc(100vh - 4rem);
    display: flex;
    padding-bottom: 4rem;
    padding-inline: var(--2w);
    position: relative;

    @media (--md-viewport) {
      height: calc(100vh - 12rem);
    }
  }

  .list-container {
    height: calc(100vh - 16rem);
    overflow: hidden;
    position: relative;
    display: none;

    @media (--md-viewport) {
      display: block;
    }
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
    position: relative;
  }

  .mobile-card {
    position: absolute;
    bottom: var(--1w);
    left: var(--1w);
    right: var(--1w);
    z-index: 1000;

    @media (--md-viewport) {
      display: none;
    }
  }
</style>
