<script lang="ts">
  import { pictograms } from '$lib/utils/pictograms';

  type Props = {
    pictogram: keyof typeof pictograms;
    width?: number;
    height?: number;
  };

  const { pictogram, width = 80, height = 80 }: Props = $props();
</script>

<svg
  aria-hidden="true"
  class="fr-artwork"
  viewBox={`0 0 ${width} ${height}`}
  width={`${width}px`}
  height={`${height}px`}>
  <use
    class="fr-artwork-decorative"
    href={`${pictograms[pictogram]}#artwork-decorative`}>
  </use>
  <use
    class="fr-artwork-minor"
    href={`${pictograms[pictogram]}#artwork-minor`}>
  </use>
  <use
    class="fr-artwork-major"
    href={`${pictograms[pictogram]}#artwork-major`}>
  </use>
</svg>
