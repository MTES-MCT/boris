<script lang="ts">
  import 'leaflet/dist/leaflet.css';
  import L, { Map, Marker } from 'leaflet';
  import { onMount } from 'svelte';
  import annuaireManager from '$lib/managers/annuaire.svelte';

  const initialZoom = 13;
  let mapRef: HTMLDivElement;
  let map = $state<Map | null>(null);
  let markers: Marker[] = [];

  onMount(() => {
    if (mapRef) {
      createMap();
    }
  });

  $effect(() => {
    map?.setView(
      [annuaireManager.latitude, annuaireManager.longitude],
      initialZoom,
    );

    if (map) {
      deleteMarkersFromMap();
      addMarkersToMap();
    }
  });

  const createMap = () => {
    map = L.map(mapRef, {
      center: [annuaireManager.latitude, annuaireManager.longitude],
      zoom: initialZoom,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  };

  const deleteMarkersFromMap = () => {
    markers.forEach((marker) => {
      map?.removeLayer(marker);
    });

    markers = [];
  };

  const addMarkersToMap = () => {
    annuaireManager.brsDiffusionWebsites?.items.forEach((item) => {
      markers.push(L.marker([item.latitude, item.longitude]));
    });

    markers.forEach((marker) => marker.addTo(map as Map));
  };
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
