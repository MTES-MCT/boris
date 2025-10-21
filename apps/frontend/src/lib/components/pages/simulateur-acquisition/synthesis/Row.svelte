<script lang="ts">
  import Badge from '$components/common/Badge.svelte';
  import Tooltip from '$components/common/Tooltip.svelte';
  import type { ComponentProps } from 'svelte';

  type Props = {
    title: string;
    value: string;
    status?: ComponentProps<typeof Badge>['status'];
    tooltip?: string;
  };

  const { title, value, status, tooltip }: Props = $props();
</script>

<div class="row">
  <div class="row-title">
    <p class="fr-text--sm fr-mb-0"><b>{title}</b></p>
    {#if tooltip}
      <Tooltip>
        <div class="fr-p-2w">
          {@html tooltip}
        </div>
      </Tooltip>
    {/if}
  </div>
  <div class="row-value">
    <Badge
      {status}
      hideIcon>
      {value}
    </Badge>
  </div>
</div>

<style lang="postcss">
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .row-title {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex: 1;
  }
</style>
