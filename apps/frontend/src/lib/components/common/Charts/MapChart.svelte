<script lang="ts">
  import AccessibleChart from './AccessibleChart.svelte';
  import { formatNumber } from '$lib/utils/formatters';
  import { regionNames, departementNames } from '$lib/utils/territories';

  type Props = {
    data: Record<string, number>;
    value: string;
    name: string;
    level: 'dep' | 'reg';
    date: string;
  };

  const { data, value, name, level, date }: Props = $props();
</script>

<AccessibleChart
  title={`Nombre de ménages mis en relation avec un OFS ou son commercialisateur ${level === 'reg' ? 'par région' : 'par département'}`}
  headings={[level === 'reg' ? 'Région' : 'Département', 'Nombre de ménages']}
  rows={Object.entries(data)
    .sort(([a], [b]) => a.localeCompare(b, 'fr'))
    .map(([code, count]) => [
      (level === 'reg' ? regionNames[code] : departementNames[code]) ||
        (code === 'undefined' || code === 'null'
          ? 'Territoire non renseigné'
          : `Code ${code}`),
      formatNumber(count),
    ])}>
  <map-chart
    data={JSON.stringify(data)}
    {value}
    {name}
    {level}
    {date}>
  </map-chart>
</AccessibleChart>
