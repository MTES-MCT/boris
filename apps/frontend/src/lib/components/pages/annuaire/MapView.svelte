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
  import NoResult from './NoResult.svelte';
  import { defaultCoords } from '$lib/utils/constants';

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

  let map: Map;
  let markers = L.markerClusterGroup(markerClusterGroupOptions);
  let brsDiffusionWebsitesInBounds = $state(brsDiffusionWebsites.items);
  let selectedMarker = $state<BrsDiffusionWebsiteView | null>(null);
  let hoveredMarker = $state<BrsDiffusionWebsiteView | null>(null);
  // let lockMapMoo

  onMount(() => {
    createMap();
  });

  $effect(() => {
    if (annuaireManager.updateMapView) {
      map?.setView([annuaireManager.latitude, annuaireManager.longitude], 13);
      annuaireManager.updateMapView = false;
    }
  });

  $effect(() => {
    if (selectedMarker) {
      const element = document.getElementById(selectedMarker.id);

      element?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  });

  const createMap = () => {
    map = L.map(annuaireManager.mapElementRef as HTMLElement, {
      center: [annuaireManager.latitude, annuaireManager.longitude],
      zoom: annuaireManager.zoom,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    if (
      annuaireManager.latitude !== defaultCoords.latitude &&
      annuaireManager.longitude !== defaultCoords.longitude
    ) {
      handleMapBoundsChange();
    } else {
      addMarkersToMap();
    }

    map.on('zoomlevelschange', debounce(handleMapBoundsChange, 50));
    map.on('moveend', handleMapBoundsChange);
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

        scrollMapToBottom();

        map?.setView([selectedMarker.latitude, selectedMarker.longitude], 13);
      });

      markers.addLayer(markerLayer);
    });

    map?.addLayer(markers);
    markers.on('clusterclick', () => {
      scrollMapToBottom();
    });
  };

  const handleMapBoundsChange = () => {
    deleteMarkersFromMap();

    if (annuaireManager.isMobile) {
      addMarkersToMap();
      return;
    }

    const northEastLat = map.getBounds().getNorthEast().lat;
    const northEastLng = map.getBounds().getNorthEast().lng;
    const southWestLat = map.getBounds().getSouthWest().lat;
    const southWestLng = map.getBounds().getSouthWest().lng;

    brsDiffusionWebsitesInBounds = brsDiffusionWebsites?.items.filter(
      (item) =>
        item.latitude <= northEastLat &&
        item.latitude >= southWestLat &&
        item.longitude <= northEastLng &&
        item.longitude >= southWestLng,
    );

    addMarkersToMap();
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

  const handleOnMouseLeave = () => {
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

  const scrollMapToBottom = () => {
    annuaireManager.mapElementRef?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  };
</script>

<div
  class="fr-col-12 container relative width-100 flex fr-m-auto fr-pb-8w fr-px-2w">
  <div class="list-container relative none md_block overflow-hidden">
    <div
      class="fr-text--sm fr-py-2w fr-pl-2w fr-mb-0 background-color-white border-bottom-light">
      <b>
        {brsDiffusionWebsitesInBounds.length} résultat{brsDiffusionWebsitesInBounds.length >
        1
          ? 's'
          : ''}
      </b>
    </div>
    <ul
      class="fr-m-auto fr-p-2w fr-pt-0 overflow-y-auto list-style-none background-color-white">
      {#if brsDiffusionWebsitesInBounds.length > 0}
        {#each brsDiffusionWebsitesInBounds as item}
          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <li
            class="fr-pt-1w"
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
      {:else}
        <li>
          <NoResult />
        </li>
      {/if}
    </ul>
  </div>
  <div
    id="map"
    class="height-100 flex-1 relative"
    bind:this={annuaireManager.mapElementRef}>
    {#if selectedMarker}
      <div class="mobile-card absolute block md_none">
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
    height: calc(100vh - 4rem);

    @media (--md-viewport) {
      height: calc(100vh - 12rem);
    }
  }

  .list-container {
    height: calc(100vh - 16rem);
  }

  ul {
    width: 18rem;
    height: calc(100% - var(--6w));

    @media (--lg-viewport) {
      width: 28rem;
    }
  }

  .mobile-card {
    bottom: 0.5rem;
    left: 0.5rem;
    right: 0.5rem;
    z-index: 1000;
  }
</style>
