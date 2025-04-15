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
  <h2 class="fr-h3 heading color-blue-primary">L’équipe derrière BoRiS.</h2>

  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
      <div class="content rounded-box-md background-color-white">
        <div class="picture">
          <img
            src={laure}
            alt="" />
        </div>
        <div class="text">
          <p class="title">Chargée de déploiement</p>
          <p class="name fr-mb-0">Laure Magdelain</p>
        </div>
      </div>
    </div>
    <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
      <div class="content rounded-box-md background-color-white">
        <div class="picture">
          <img
            src={arthur}
            alt="" />
        </div>
        <div class="text">
          <p class="title">Coach</p>
          <p class="name fr-mb-0">Arthur Massonneau</p>
        </div>
      </div>
    </div>
    <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
      <div class="content rounded-box-md background-color-white">
        <div class="picture">
          <img
            src={benoit}
            alt="" />
        </div>
        <div class="text">
          <p class="title">Développeur</p>
          <p class="name fr-mb-0">Benoît Paquier</p>
        </div>
      </div>
    </div>
    <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
      <div class="content rounded-box-md background-color-white">
        <div class="picture">
          <img
            src={nathan}
            alt="" />
        </div>
        <div class="text">
          <p class="title">Intrapreneur</p>
          <p class="name fr-mb-0">Nathan Gaudelet</p>
        </div>
      </div>
    </div>
    <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
      <div class="content rounded-box-md background-color-white">
        <div class="picture">
          <img
            src={mathieu}
            alt="" />
        </div>
        <div class="text">
          <p class="title">Responsable de portefeuille</p>
          <p class="name fr-mb-0">Mathieu Gimenez</p>
        </div>
      </div>
    </div>
    <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
      <div class="content rounded-box-md background-color-white">
        <div class="picture">
          <img
            src={amandine}
            alt="" />
        </div>
        <div class="text">
          <p class="title">Designeuse</p>
          <p class="name fr-mb-0">Amandine Guegano</p>
        </div>
      </div>
    </div>
  </div>
</Section>

<style lang="postcss">
  .heading {
    text-align: center;
    margin-block-end: var(--5w);
  }

  .content {
    position: relative;
    display: flex;
    align-items: center;
    height: 128px;
    overflow: hidden;
  }

  .picture {
    width: 128px;
    height: 100%;
    background-color: teal;

    img {
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
  }

  .text {
    padding: var(--3w);
  }

  .title {
    font-size: 0.75rem;
    color: var(--color-grey-primary);
    margin-block-end: var(--2w);
  }

  .name {
    font-size: 1.25rem;
    font-weight: 700;
  }

  @media (--md-viewport) {
    .heading {
      margin-block-end: var(--10w);
    }
  }
</style>
