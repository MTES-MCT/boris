<script lang="ts">
  import { default as EndOfPath } from '$assets/icons/end-of-path.svg?raw';
  import type { Heading } from '$lib/utils/definitions';

  import Image from '$components/common/Image.svelte';

  type Step = {
    illustration?: string;
    image?: string;
    photograph?: string;
    title: string;
    description: string;
    hrefLabel?: string;
    href?: string;
  };

  type Props = {
    steps: Step[];
    stepTitleElement?: Heading;
  };

  const { steps, stepTitleElement = 'h3' }: Props = $props();

  $inspect(steps);
</script>

<div
  class={`
    fr-container relative flex flex-col gap-16 mt-16 mb-24
    after:content-[''] after:absolute after:top-[-48px] after:left-[30px] after:w-[4px] after:h-[calc(100%+96px)] after:bg-blue-primary after-z-[-1] after:rounded-full
    lg:after:left-[calc(50%-2px)] lg:gap-32
  `}>
  <div
    class="absolute top-[-88px] left-[15px] lg:left-[calc(50%-17px)] rotate-180">
    {@html EndOfPath}
  </div>

  {#each steps as step, index}
    {@render stepSnippet(step, index)}
  {/each}

  <div class="absolute bottom-[-88px] left-[15px] lg:left-[calc(50%-17px)]">
    {@html EndOfPath}
  </div>
</div>

{#snippet stepSnippet(
  {
    title,
    description,
    hrefLabel,
    href,
    illustration,
    image,
    photograph,
  }: Step,
  index: number,
)}
  {@const isOdd = index % 2 === 0}

  <div
    class={`
      flex flex-col
      lg:shadow-xl lg:rounded-tl-xl lg:rounded-tr-xl lg:overflow-hidden
    `}
    class:lg:flex-row={isOdd}
    class:lg:flex-row-reverse={!isOdd}>
    <div class="hidden relative lg:block lg:w-1/2">
      {#if image}
        <Image
          {image}
          {photograph}
          photographPosition={isOdd ? 'bottom-right' : 'bottom-left'} />
      {/if}
    </div>

    <div
      class={`
        relative w-[calc(100%-16px)] p-6 ml-[16px] bg-white shadow-lg rounded-tl-xl rounded-tr-xl
        sm:p-8 sm:pl-12
        lg:w-1/2 lg:ml-0 ${isOdd ? 'lg:pl-12' : 'lg:pl-8'} lg:rounded-none lg:shadow-none
      `}>
      <div
        class={`
          absolute top-[-16px] left-[-16px] w-[32px] h-[32px] bg-blue-primary rounded-full flex items-center justify-center z-[100000] shadow-lg
          sm:top-[calc(50%-20px)] sm:left-[-20px] sm:w-[40px] sm:h-[40px]
          lg:top-[calc(50%-25px)] lg:left-[-25px] lg:w-[50px] lg:h-[50px] ${isOdd ? 'lg:left-[-25px] ' : 'lg:right-[-25px] lg:left-auto'}
        `}>
        <span class="fr-text--bold text-white md:text-lg lg:text-xl">
          {index + 1}
        </span>
      </div>

      <div
        class={`
        hidden
        sm:flex sm:justify-center sm:mb-8
        lg:mb-16 ${isOdd ? 'lg:ml-[-96px]' : 'lg:mr-[-96px]'}
      `}>
        {#if illustration}
          {@html illustration}
        {/if}
      </div>

      <div class={`${isOdd ? 'lg:text-left' : 'lg:text-right'}`}>
        <svelte:element this={stepTitleElement}>{title}</svelte:element>
        <p>{description}</p>
      </div>

      {#if hrefLabel && href}
        <div class="text-right">
          <a
            class="fr-link fr-icon-arrow-right-line fr-link--icon-right fr-text--bold"
            {href}>
            {hrefLabel}
          </a>
        </div>
      {/if}
    </div>
  </div>
{/snippet}
