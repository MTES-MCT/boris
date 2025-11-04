<script lang="ts">
  import Img from '@zerodevx/svelte-img';
  import HomeHero from '$assets/images/home-hero.jpg?as=run';
</script>

<section class="hero">
  <div class="column text-container">
    <div class="title bg-white">
      <h1>
        Acheter son logement
        <br />
        <span>30 à 50% moins cher</span>
      </h1>
      <h2 class="caption">
        Avec le BRS <span>c’est possible !</span>
      </h2>
    </div>

    <div class="cta bg-white">
      <p>
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
  <div class="column illustration-container">
    <Img
      class="fr-responsive-img"
      src={HomeHero}
      loading="eager"
      alt="" />
  </div>
</section>

<style lang="postcss">
  .hero {
    position: relative;
    max-height: 772px;
  }

  .text-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-inline: var(--1w);
    padding-block-start: var(--8w);
    padding-block-end: var(--26w);

    h1 {
      font-size: 1.5rem;

      span {
        position: relative;
        display: inline-block;
        padding-inline: var(--1v);

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 4px;
          width: 100%;
          height: calc(100% - 8px);
          background-color: var(--color-red-primary);
          z-index: -1;
        }
      }
    }

    .caption {
      font-size: 1rem;
      font-weight: 400;
      margin-bottom: var(--1w);

      span {
        font-weight: 700;
        text-decoration: underline;
      }
    }

    .title {
      align-self: flex-start;
      margin-right: calc(-1 * var(--19w));
      padding-inline-start: var(--1w);
      padding-inline-end: var(--4w);
      clip-path: var(--clip-path-home-title);
    }

    .cta {
      align-self: flex-start;
      margin-block-start: var(--9w);
      margin-inline-end: var(--3w);
      display: inline-block;
      padding: var(--2w);
      border-radius: var(--1w);

      p {
        font-size: 1.125rem;
        line-height: 1.75rem;
      }
    }
  }

  .illustration-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;

    :global(img) {
      height: 100%;
      object-fit: cover;
    }

    :global(picture) {
      width: 100%;
    }
  }

  @media (--xxs-viewport) {
    .text-container {
      padding-inline: var(--2w);

      h1 {
        font-size: 2rem;
      }

      .caption {
        font-size: 1.125rem;
      }
    }

    .title {
      padding-inline-start: var(--2w);
    }
  }

  @media (--sm-viewport) {
    .text-container {
      h1 {
        font-size: 3rem;
        line-height: 5rem;

        span {
          &::before {
            top: 16px;
            width: 100%;
            height: calc(100% - 32px);
          }
        }
      }

      .caption {
        font-size: 1.75rem;
        line-height: 2.25rem;
        margin: var(--title-spacing);
      }
    }
  }

  @media (--md-viewport) {
    .hero {
      display: flex;
    }

    .text-container {
      width: 50%;
      justify-content: center;
      align-items: flex-end;
      padding-block-start: var(--15w);
      padding-block-end: var(--26w);
      padding-inline: 0;
      background: white;
      background-image: none;
      border-right: solid var(--path-thickness) var(--color-blue-primary);

      .title {
        align-self: flex-end;
      }

      .cta {
        align-self: flex-end;
        padding: 0;
        border-radius: var(--1w);
      }
    }

    .illustration-container {
      position: relative;
      display: flex;
      justify-content: center;
      width: 50%;
      height: auto;

      &::after {
        content: '';
        position: absolute;
        top: var(--8w);
        width: 400px;
        height: 540px;
        background-image: url('$assets/illustrations/home-hero-trim.svg');
        background-size: 100%;
        background-repeat: no-repeat;
      }
    }
  }
</style>
