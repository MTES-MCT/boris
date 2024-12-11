<script lang="ts">
  import Photographer from '$components/photographer/photographer.svelte';
</script>

<section class="fr-container">
  <h1>
    Acec BoRiS, <br />
    découvrez si vous êtes
    <br />
    éligible au
    <br />
    <span>Bail Réel Solidaire !</span>
  </h1>
  <div class="illustration">
    <div class="image-container">
      <Photographer
        position="bottom-right"
        photographer="Chewy" />
    </div>
  </div>
</section>

<style lang="postcss">
  section {
    padding-block: var(--8w);
    display: flex;
  }

  h1 {
    width: 100%;
    display: inline-block;
    border-top-right-radius: var(--border-radius-md);
    border-top-left-radius: var(--border-radius-md);
    font-size: 1.5rem;
    line-height: 2rem;

    span {
      margin-block-start: var(--1w);
      display: inline-block;
      background-color: var(--color-red-primary);
      padding-inline: var(--2w);
    }
  }

  @media (--xxs-viewport) {
    h1 {
      font-size: 2rem;
      line-height: 2.5rem;
    }
  }

  @media (--sm-viewport) {
    section {
      padding-block: var(--15w);
    }

    h1 {
      width: 50%;
      font-size: 2rem;
      line-height: 2.5rem;

      span {
        margin-block-start: var(--2w);
      }
    }

    .illustration {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50%;
      transform: translate(calc(-1 * var(--6w)), var(--6w));

      .image-container {
        --border-radius: 142px;

        position: relative;
        width: 284px;
        height: 350px;
        border-top-left-radius: var(--border-radius);
        border-top-right-radius: var(--border-radius);
        background-image: url('$assets/images/simuler-eligibilite-hero.jpg');
        background-position: center;
        background-size: cover;

        &::after {
          content: '';
          width: 100%;
          height: 100%;
          position: absolute;
          bottom: var(--12w);
          left: var(--12w);
          border: solid 3px var(--color-red-primary);
          border-top-left-radius: var(--border-radius);
          border-top-right-radius: var(--border-radius);
          z-index: -1;
        }
      }
    }
  }

  @media (--md-viewport) {
    h1 {
      font-size: 2.5rem;
      line-height: 3rem;
    }
  }
</style>
