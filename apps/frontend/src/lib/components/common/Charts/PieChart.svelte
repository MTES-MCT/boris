<script lang="ts">
  import type { ChartPalette } from '$lib/utils/definitions';

  type Props = {
    x: string[][];
    y: number[][];
    name: string[];
    selectedPalette?: ChartPalette;
    unitTooltip?: string;
  };

  const {
    x,
    y,
    name,
    selectedPalette = 'default',
    unitTooltip = '',
  }: Props = $props();
</script>

<pie-chart
  x={JSON.stringify(x)}
  y={JSON.stringify(y)}
  name={JSON.stringify(name)}
  selected-palette={selectedPalette}
  unit-tooltip={unitTooltip}>
</pie-chart>
