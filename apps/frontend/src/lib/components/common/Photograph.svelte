<script lang="ts">
  type Props = {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    photograph: string;
  };

  const positionClass = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  };

  const { position, photograph }: Props = $props();
</script>

<span
  class={`absolute ${positionClass[position]} fr-text--xs fr-text--bold fr-mb-0 bg-white/70 px-2`}>
  Photo par {photograph}
</span>
