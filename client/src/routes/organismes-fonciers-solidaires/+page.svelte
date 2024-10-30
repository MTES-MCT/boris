<script lang="ts">
  import type { Props } from './definitions';

  const { data }: Props = $props();
  const { ofsList } = data;
</script>

<h1>Organismes fonciers solidaires</h1>

<ul>
  {#each ofsList as ofs}
    <li>{ofs.nom}</li>
  {/each}
</ul>
