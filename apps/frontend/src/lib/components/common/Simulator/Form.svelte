<script lang="ts">
  import '@gouvfr/dsfr/dist/component/form/form.min.css';

  import type { Snippet } from 'svelte';

  type Props = {
    onSubmit: (e: SubmitEvent) => void;
    children: Snippet;
  };

  const { onSubmit, children }: Props = $props();
</script>

<div
  class="background-gradient p-4 sm:p-8 lg:py-32 lg:px-8 lg:w-[calc(50%+6rem)] lg:flex lg:items-center">
  <form
    class="!p-4 bg-white rounded-tl-2xl rounded-tr-2xl shadow-md !w-full sm:!p-8 lg:max-w-[41rem]"
    autocomplete="off"
    onsubmit={onSubmit}>
    {@render children()}
  </form>
</div>
