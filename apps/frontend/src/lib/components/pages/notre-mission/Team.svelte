<script lang="ts">
  import Section from '$components/common/Section.svelte';
  import laure from '$assets/images/laure.jpg';
  import amandine from '$assets/images/amandine.jpg';
  import arthur from '$assets/images/arthur.jpg';
  import benoit from '$assets/images/benoit.jpg';
  import mathieu from '$assets/images/mathieu.jpg';
  import nathan from '$assets/images/nathan.jpg';
</script>

<div class="">
  <Section>
    <h2 class="text-center fr-mb-5w fr-mb-8w color-blue-primary">
      L'équipe derrière BoRiS.
    </h2>

    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
        <div
          class="content flex align-center overflow-hidden rounded-box-md background-color-white">
          <div class="picture height-100">
            <img
              class="width-100 height-100"
              src={laure}
              alt="" />
          </div>
          <div class="fr-px-3v fr-px-md-3w flex-1">
            <p class="fr-text--lg fr-text--bold fr-mb-0">Laure Magdelain</p>
            <p class="fr-text--sm fr-mb-0">Chargée de déploiement</p>
          </div>
        </div>
      </div>
      <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
        <div
          class="content flex align-center overflow-hidden rounded-box-md background-color-white">
          <div class="picture height-100">
            <img
              class="width-100 height-100"
              src={arthur}
              alt="" />
          </div>
          <div class="fr-px-3v fr-px-md-3w flex-1">
            <p class="fr-text--lg fr-text--bold fr-mb-0">Arthur Massonneau</p>
            <p class="fr-text--sm fr-mb-0">Coach</p>
          </div>
        </div>
      </div>
      <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
        <div
          class="content flex align-center overflow-hidden rounded-box-md background-color-white">
          <div class="picture height-100">
            <img
              class="width-100 height-100"
              src={benoit}
              alt="" />
          </div>
          <div class="fr-px-3v fr-px-md-3w flex-1">
            <p class="fr-text--lg fr-text--bold fr-mb-0">Benoît Paquier</p>
            <p class="fr-text--sm fr-mb-0">Développeur</p>
          </div>
        </div>
      </div>
      <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
        <div
          class="content flex align-center overflow-hidden rounded-box-md background-color-white">
          <div class="picture height-100">
            <img
              class="width-100 height-100"
              src={nathan}
              alt="" />
          </div>
          <div class="fr-px-3v fr-px-md-3w flex-1">
            <p class="fr-text--lg fr-text--bold fr-mb-0">Nathan Gaudelet</p>
            <p class="fr-text--sm fr-mb-0">Intrapreneur</p>
          </div>
        </div>
      </div>
      <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
        <div
          class="content flex align-center overflow-hidden rounded-box-md background-color-white">
          <div class="picture height-100">
            <img
              class="width-100 height-100"
              src={mathieu}
              alt="" />
          </div>
          <div class="fr-px-3v fr-px-md-3w flex-1">
            <p class="fr-text--lg fr-text--bold fr-mb-0">Mathieu Gimenez</p>
            <p class="fr-text--sm fr-mb-0">Responsable de portefeuille</p>
          </div>
        </div>
      </div>
      <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
        <div
          class="content flex align-center overflow-hidden rounded-box-md background-color-white">
          <div class="picture height-100">
            <img
              class="width-100 height-100"
              src={amandine}
              alt="" />
          </div>
          <div class="fr-px-3v fr-px-md-3w flex-1">
            <p class="fr-text--lg fr-text--bold fr-mb-0">Amandine Guegano</p>
            <p class="fr-text--sm fr-mb-0">Designeuse</p>
          </div>
        </div>
      </div>
    </div>
  </Section>
</div>

<style lang="postcss">
  .content {
    --square-size: 128px;

    height: var(--square-size);
  }

  .picture {
    width: var(--square-size);

    img {
      object-fit: cover;
    }
  }
</style>
