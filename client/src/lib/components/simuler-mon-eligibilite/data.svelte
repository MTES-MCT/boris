<script lang="ts">
  import Table from '$components/simuler-mon-eligibilite/table.svelte';
  import Accordions from '$components/simuler-mon-eligibilite/accordions.svelte';
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
