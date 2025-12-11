<script lang="ts">
  type Props = {
    x: string[][];
    y: number[][];
    name: string[];
    selectedPalette?:
      | 'default'
      | 'neutral'
      | 'categorical'
      | 'sequentialAscending'
      | 'sequentialDescending'
      | 'divergentAscending'
      | 'divergentDescending';
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

<line-chart
  x={JSON.stringify(x)}
  y={JSON.stringify(y)}
  name={JSON.stringify(name)}
  selected-palette={selectedPalette}
  unit-tooltip={unitTooltip}>
</line-chart>
