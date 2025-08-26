<script lang="ts">
  import Autocomplete from './Autocomplete.svelte';
  import Radius from './Radius.svelte';
</script>

<div class="fr-container--fluid">
  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12 fr-col-md-6 fr-col-lg-8">
      <Autocomplete />
    </div>
    <div class="fr-col-6 fr-col-md-3 fr-col-lg-2">
      <Radius />
    </div>
    <div class="fr-col-6 fr-col-md-3 fr-col-lg-2"></div>
  </div>
</div>

<style lang="postcss">
  .fr-container--fluid {
    overflow: visible;
  }
</style>
