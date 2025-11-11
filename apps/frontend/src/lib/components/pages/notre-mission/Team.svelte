<script lang="ts">
  import Section from '$components/common/Section.svelte';
  import laure from '$assets/images/laure.jpg';
  import amandine from '$assets/images/amandine.jpg';
  import arthur from '$assets/images/arthur.jpg';
  import benoit from '$assets/images/benoit.jpg';
  import mathieu from '$assets/images/mathieu.jpg';
  import nathan from '$assets/images/nathan.jpg';
</script>

<Section>
  <h2 class="fr-h3 !text-blue-primary">L'équipe derrière BoRiS.</h2>

  <div class="fr-grid-row fr-grid-row--gutters">
    {@render teamMember('Laure Magdelain', 'Chargée de déploiement', laure)}
    {@render teamMember('Arthur Massonneau', 'Coach', arthur)}
    {@render teamMember('Benoît Paquier', 'Développeur', benoit)}
    {@render teamMember('Nathan Gaudelet', 'Intrapreneur', nathan)}
    {@render teamMember(
      'Mathieu Gimenez',
      'Responsable de portefeuille',
      mathieu,
    )}
    {@render teamMember(
      'Amandine Guegano',
      'Responsable de portefeuille',
      amandine,
    )}
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
