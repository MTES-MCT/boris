<script lang="ts">
  type Props = {
    data: Record<string, number>;
    value: string;
    name: string;
    level: 'dep' | 'reg';
    date: string;
  };

  const { data, value, name, level, date }: Props = $props();
</script>

<map-chart
  data={JSON.stringify(data)}
  {value}
  {name}
  {level}
  {date}>
</map-chart>
