<script lang="ts">
  import HomeHero from '$assets/images/home-hero.jpg?as=run';
  import { default as Frame } from '$assets/illustrations/home-hero-trim.svg?raw';
  import Image from '$components/common/Image.svelte';
</script>

<section class="relative lg:flex max-h-[772px]">
  <div
    class="text-container flex flex-col items-center px-2 pt-16 pb-52 xs:px-4 lg:w-1/2 lg:justify-center lg:px-0 lg:items-end lg:pt-30 lb:bg-white lg:border-r-(length:--path-thickness) lg:border-r-blue-primary">
    <div
      class="bg-white p-4 md:p-8 text-center rounded-xl lg:text-right lg:mr-[-4rem]">
      <h1
        class="!text-2xl leading-[2.5rem] xs:!text-[2rem] xs:leading-[3rem] md:!text-[2.75rem] md:!leading-[3.75rem]">
        Acheter son logement
        <br />
        <span class="bg-red-primary px-[2px]">30 à 50% moins cher</span>
      </h1>
      <h2 class="!mb-0 !text-base !font-normal xs:!text-lg md:!text-2xl">
        Avec le BRS <span class="fr-text--bold underline">
          c'est possible !
        </span>
      </h2>
    </div>

    <div class="bg-white p-4 md:p-8 text-center mt-18 rounded-lg">
      <p class="md:!text-lg lg:!text-xl">
        <strong>87% des ménages</strong>
        sont éligibles.
        <br />
        Et vous ?
      </p>
      <a
        href="/simulateur-eligibilite"
        class="fr-btn fr-btn--lg">
        Vérifier mon éligibilité
      </a>
    </div>
  </div>
  <div
    class="illustration-container absolute top-0 left-0 w-full h-full z-[-1] lg:relative lg:flex lg:justify-center lg:w-1/2 lg:h-auto">
    <Image
      image={HomeHero}
      photographPosition="bottom-right" />
    <div class="hidden lg:block absolute top-16 w-[400px] h-[540px]">
      {@html Frame}
    </div>
  </div>
</section>
