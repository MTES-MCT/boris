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

  const markerClusterGroupOptions: L.MarkerClusterGroupOptions = {
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
  let hoveredMarker = $state<BrsDiffusionWebsiteView | null>(null);

  onMount(() => {
    createMap();
  });

  $effect(() => {
    map?.setView(
      [annuaireManager.latitude, annuaireManager.longitude],
      annuaireManager.zoom,
    );
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

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    addMarkersToMap();

    map.on('zoomlevelschange', debounce(handleMapBoundsChange, 50));
    map.on('move', handleMapBoundsChange);
  };

  const deleteMarkersFromMap = () => {
    map?.removeLayer(markers);
    markers = L.markerClusterGroup(markerClusterGroupOptions);
  };

  const setIcon = (isSelected: boolean, isHovered: boolean) => {
    const className = `map-icon ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`;

    return L.divIcon({
      className,
      html: `<span class="fr-icon-map-pin-2-fill" aria-hidden="true"></span>`,
      iconSize: isSelected || isHovered ? [40, 40] : [32, 32],
      iconAnchor: isSelected || isHovered ? [20, 40] : [16, 32],
    });
  };

  const addMarkersToMap = () => {
    brsDiffusionWebsites?.items.forEach((item) => {
      const isSelected = item.id === selectedMarker?.id;
      const isHovered = item.id === hoveredMarker?.id;

      const markerLayer = L.marker([item.latitude, item.longitude], {
        icon: setIcon(isSelected, isHovered),
      });

      markerLayer.on('click', () => {
        selectedMarker = brsDiffusionWebsites.items.find(
          (brsDiffusionWebsite) => brsDiffusionWebsite.id === item.id,
        ) as BrsDiffusionWebsiteView;

        map.setView([selectedMarker.latitude, selectedMarker.longitude], 13);
      });

      markers.addLayer(markerLayer);
    });

    map?.addLayer(markers);
  };

  const handleMapBoundsChange = () => {
    deleteMarkersFromMap();
    addMarkersToMap();

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

  const handleOnMouseEnter = (e: MouseEvent) => {
    const id = (e.currentTarget as HTMLElement).id;

    hoveredMarker = brsDiffusionWebsites.items.find(
      (item) => item.id === id,
    ) as BrsDiffusionWebsiteView;

    deleteMarkersFromMap();
    addMarkersToMap();
  };

  const handleOnMouseLeave = (e: MouseEvent) => {
    hoveredMarker = null;

    deleteMarkersFromMap();
    addMarkersToMap();
  };

  const handleCardClick = (e: MouseEvent) => {
    const id = (e.currentTarget as HTMLElement).id;

    selectedMarker = brsDiffusionWebsites.items.find(
      (item) => item.id === id,
    ) as BrsDiffusionWebsiteView;

    map.setView([selectedMarker.latitude, selectedMarker.longitude], 13);
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
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <li
          id={item.id}
          onclick={handleCardClick}
          onmouseenter={handleOnMouseEnter}
          onmouseleave={handleOnMouseLeave}>
          <Card
            {...item}
            cardTitleElement="h3"
            narrow
            selected={item.id === selectedMarker?.id ||
              item.id === hoveredMarker?.id} />
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
