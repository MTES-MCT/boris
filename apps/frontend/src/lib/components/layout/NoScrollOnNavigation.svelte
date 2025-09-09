<script lang="ts">
  import { afterNavigate, beforeNavigate } from '$app/navigation';
  import { addSmoothScroll, removeSmoothScroll } from '$lib/utils/helpers';

  beforeNavigate(() => {
    removeSmoothScroll();
  });

  afterNavigate(() => {
    addSmoothScroll();
  });
</script>
