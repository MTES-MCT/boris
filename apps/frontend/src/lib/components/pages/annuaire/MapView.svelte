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
      html: `<span class="fr-icon-map-pin-2-fill fr-icon--lg" aria-hidden="true"></span>`,
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

        map?.setView([selectedMarker.latitude, selectedMarker.longitude], 13, {
          animate: false,
        });
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
  class="relative w-full max-w-[110rem] h-[calc(100vh-4rem)] md:h-[calc(100vh-12rem)] mx-auto flex pb-16 px-4">
  <div class="hidden lg:block h-[calc(100vh-16rem)] overflow-hidden relative">
    <div
      class="fr-mb-0 fr-text--sm bg-white h-[3rem] pl-4 flex items-center pt-2">
      <b>
        {brsDiffusionWebsitesInBounds.length} résultat{brsDiffusionWebsitesInBounds.length >
        1
          ? 's'
          : ''}
      </b>
    </div>
    <ul
      class="w-[18rem] xl:w-[28rem] !list-none !m-0 !p-[1rem] !pt-0 h-[calc(100%-3rem)] overflow-y-auto bg-white">
      {#if brsDiffusionWebsitesInBounds.length > 0}
        {#each brsDiffusionWebsitesInBounds as item}
          <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
          <!-- svelte-ignore a11y_click_events_have_key_events -->
          <li
            class="!pt-2"
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
    class="h-full flex-1 relative"
    bind:this={annuaireManager.mapElementRef}>
    {#if selectedMarker}
      <div
        class="block lg:hidden absolute bottom-[0.5rem] left-[0.5rem] right-[0.5rem] z-[1000]">
        <Card
          {...selectedMarker}
          cardTitleElement="h3"
          narrow
          handleClose={handleMobileCardClose} />
      </div>
    {/if}
  </div>
</div>
