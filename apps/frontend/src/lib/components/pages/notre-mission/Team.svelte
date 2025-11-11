<script lang="ts">
  import Section from '$components/common/Section.svelte';
  import laure from '$assets/images/laure.jpg';
  import amandine from '$assets/images/amandine.jpg';
  import arthur from '$assets/images/arthur.jpg';
  import benoit from '$assets/images/benoit.jpg';
  import mathieu from '$assets/images/mathieu.jpg';
  import nathan from '$assets/images/nathan.jpg';

  type Person = {
    name: string;
    title: string;
    image: string;
  };

  const persons: Person[] = [
    { name: 'Laure Magdelain', title: 'Chargée de déploiement', image: laure },
    { name: 'Arthur Massonneau', title: 'Coach', image: arthur },
    { name: 'Benoît Paquier', title: 'Développeur', image: benoit },
    { name: 'Nathan Gaudelet', title: 'Intrapreneur', image: nathan },
    {
      name: 'Mathieu Gimenez',
      title: 'Responsable de portefeuille',
      image: mathieu,
    },
    {
      name: 'Amandine Guegano',
      title: 'Responsable de portefeuille',
      image: amandine,
    },
  ];
</script>

<Section>
  <h2 class="fr-h3 text-center !mt-8 !mb-8 md:!mt-16 !text-blue-primary">
    L'équipe derrière BoRiS.
  </h2>

  <div class="fr-grid-row fr-grid-row--gutters">
    {#each persons as person}
      {@render teamMember(person.name, person.title, person.image)}
    {/each}
  </div>
</Section>

{#snippet teamMember(name: string, title: string, image: string)}
  <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
    <div
      class="relative flex items-center h-[128px] overflow-hidden rounded-tl-xl rounded-tr-xl bg-white">
      <div class="w-[128px] h-full">
        <img
          src={image}
          alt="" />
      </div>
      <div class="flex flex-col justify-center px-3 xs:px-6 flex-1">
        <p class="fr-text--lead fr-text--bold fr-mb-0">{name}</p>
        <p class="fr-text--sm fr-mb-0">{title}</p>
      </div>
    </div>
  </div>
{/snippet}
