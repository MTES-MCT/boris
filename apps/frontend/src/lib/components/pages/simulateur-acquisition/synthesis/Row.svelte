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

<div class="flex items-center justify-between gap-2">
  <div class="flex items-cemter gap-1 flex-1">
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
    <Badge {status}>
      {value}
    </Badge>
  </div>
</div>
