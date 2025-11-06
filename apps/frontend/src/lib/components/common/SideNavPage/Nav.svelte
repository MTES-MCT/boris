<script lang="ts">
  import type { StepSection } from '$lib/utils/definitions';

  type Props = {
    sections: StepSection[];
    activeSectionId?: string;
  };

  const { sections, activeSectionId }: Props = $props();
</script>

<nav
  id="navigation"
  class="border-b border-b-gray-light md:!sticky md:top-12 md:!mt-0 md:pr-6 md:border-b-0 md:border-r md:border-r-gray-light lg:pr-12">
  <ul class="!list-none !m-0 !pt-0 !px-0 !pb-4">
    {#each sections as section}
      {@const isActive = activeSectionId === section.id}

      <li class="!my-2 md:!mb-6">
        <a
          href={`#${section.id}`}
          class={`
            fr-link relative !block !bg-none !text- fr-text--bold ${isActive ? '!text-blue-active' : '!text-gray-default'}
            before:content-[''] before:absolute before:left-[-8px] before:top-0 before:h-full before:w-[2px] before:bg-blue-primary before:opacity-${isActive ? '100' : '0'}
          `}>
          {section.title}
        </a>
      </li>
    {/each}
  </ul>
</nav>
