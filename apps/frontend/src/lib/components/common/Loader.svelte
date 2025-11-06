<script lang="ts">
  type Props = {
    height?: number;
  };

  const { height = 240 }: Props = $props();
</script>

<div
  style={`height:${height}px;`}
  class="animate-pulse bg-gray-300">
</div>
