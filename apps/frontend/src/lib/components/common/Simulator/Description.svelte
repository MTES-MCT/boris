<script lang="ts">
  import type { Snippet } from 'svelte';

  import Stepper from '$components/common/Stepper.svelte';

  type Props = {
    title: string;
    stepTitle: string;
    nextStepTitle?: string;
    currentStep: number;
    stepCount: number;
    children: Snippet;
  };

  const {
    title,
    children,
    stepTitle,
    nextStepTitle,
    currentStep,
    stepCount,
  }: Props = $props();
</script>

<div
  class="p-4 sm:p-8 lg:py-32 lg:px-8 lg:flex lg:justify-end lg:!w-[calc(50%-6rem)]">
  <div class="w-full lg:max-w-[28rem]">
    <div class="relative lg:sticky lg:top-16">
      <h1 class="!text-[2.3rem] underline">{title}</h1>
      <div>
        <Stepper
          title={stepTitle}
          {nextStepTitle}
          {currentStep}
          {stepCount} />
        {@render children()}
      </div>
    </div>
  </div>
</div>
