<script lang="ts">
  import Photograph from '$components/common/Photograph.svelte';
</script>

<section class="fr-container flex py-16 md:py-30">
  <h1
    class="text-center !mx-auto md:text-left md:!ml-0 !text-3xl !leading-[2rem] !leading-[2.5rem] sm:!text-4xl md:!leading-[3rem] lg:!text-5xl">
    Avec BoRiS, <br />
    découvrez si vous êtes
    <br />
    éligible au
    <br />
    <span class="!mt-2 sm:!mt-4 px-1 py-1 sm:py-2 inline-block bg-red-primary">
      Bail Réel Solidaire !
    </span>
  </h1>
  <div
    class="hidden md:flex justify-center items-center w-1/2 translate-x-[-3rem] translate-y-[3rem]">
    <div
      class={`
        relative w-[284px] h-[350px] rounded-tl-full rounded-tr-full bg-[url('$assets/images/simuler-eligibilite-hero.jpg')] bg-cover bg-center
        after:content-[''] after:absolute after:bottom-[96px] after:left-[96px] after:w-full after:h-full after:rounded-tl-full after:rounded-tr-full after:border-3 after:border-red-primary after:z-[-1]
      `}>
      <Photograph
        position="bottom-right"
        photograph="Chewy" />
    </div>
  </div>
</section>
