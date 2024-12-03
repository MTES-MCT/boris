<script lang="ts">
  import Table from '$components/simulateur-eligibilite/table.svelte';
  import Accordions from '$components/simulateur-eligibilite/accordions.svelte';
</script>

<div class="table">
  <Table />
</div>
<div class="accordions">
  <Accordions />
</div>

<style lang="postcss">
  .table {
    display: none;
  }

  @media (--sm-viewport) {
    .accordions {
      display: none;
    }

    .table {
      display: block;
    }
  }
</style>
