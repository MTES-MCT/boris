<script lang="ts">
  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import type { DataType } from './+page.server';

  type Props = {
    data: DataType;
  };

  const { data }: Props = $props();

  console.log(data);
</script>

<GradientBackgroundWrapper>
  <h1>Annuaire</h1>
</GradientBackgroundWrapper>
