<script lang="ts">
  import Section from '$components/common/Section.svelte';
  import alizee from '$assets/images/alizee.jpg';
  import amandine from '$assets/images/amandine.jpg';
  import arthur from '$assets/images/arthur.jpg';
  import benoit from '$assets/images/benoit.jpg';
  import mathieu from '$assets/images/mathieu.jpg';
  import nathan from '$assets/images/nathan.jpg';
</script>

<Section>
  <h3 aria-level="2">L’équipe derrière BoRiS.</h3>

  <div class="fr-grid-row fr-grid-row--gutters">
    <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
      <div class="content rounded-box-md fr-background-default--grey">
        <div class="picture">
          <img
            src={alizee}
            alt="" />
        </div>
        <div class="text">
          <p class="title">Chargée de déploiement</p>
          <p class="name fr-mb-0">Alizée Breton</p>
        </div>
      </div>
    </div>
    <div class="fr-col-12 fr-col-md-6 fr-col-xl-4">
      <div class="content rounded-box-md fr-background-default--grey">
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
      <div class="content rounded-box-md fr-background-default--grey">
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
      <div class="content rounded-box-md fr-background-default--grey">
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
      <div class="content">
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
      <div class="content">
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
  h3 {
    color: var(--color-blue-primary);
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
    h3 {
      margin-block-end: var(--10w);
    }
  }
</style>
