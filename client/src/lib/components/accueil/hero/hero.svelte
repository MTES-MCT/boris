<section class="hero">
  <div class="column text-container">
    <div class="title">
      <h1>
        Acheter son logement
        <br />
        <span>30 à 50% moins cher</span>
      </h1>
      <h2 class="caption">Avec le BRS c’est possible !</h2>
    </div>

    <div class="cta">
      <p>
        <strong>87% des ménages</strong>
        sont éligibles.
        <br />
        Et vous ?
      </p>
      <button class="fr-btn fr-btn--lg">
        <a href="/simuler-mon-eligibilite">Vérifier mon éligibilité</a>
      </button>
    </div>
  </div>
  <div class="column illustration-container"></div>
</section>

<style lang="postcss">
  .text-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-inline: var(--1w);
    padding-block-start: var(--10w);
    padding-block-end: var(--26w);
    background-image: url('$assets/images/home-hero.jpg');
    background-size: cover;
    background-position: center;

    h1 {
      font-size: 1.5rem;
    }

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

    .caption {
      font-size: 1.125rem;
      font-weight: 400;
      margin-bottom: 0;
    }

    .title {
      align-self: flex-start;
      margin-right: calc(-1 * var(--19w));
      padding-inline-start: var(--1w);
      padding-inline-end: var(--4w);
      clip-path: var(--clip-path-home-title);
      background-color: white;
    }

    .cta {
      align-self: flex-start;
      margin-block-start: var(--9w);
      margin-inline-end: var(--3w);
      display: inline-block;
      background: white;
      padding: var(--2w);
      border-radius: var(--1w);

      p {
        font-size: 1.125rem;
        line-height: 1.75rem;
      }
    }
  }

  .illustration-container {
    display: none;
  }

  @media (--xxs-viewport) {
    .text-container {
      padding-inline: var(--2w);

      h1 {
        font-size: 2rem;
      }
    }

    .title {
      padding-inline-start: var(--2w);
    }
  }

  @media (--sm-viewport) {
    padding-block-start: var(--15w);
    padding-block-end: var(--34w);
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
      padding-block-end: var(--34w);
      padding-inline: 0;
      background: white;
      z-index: 2;

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
      width: 50%;
      display: flex;
      justify-content: center;
      padding-block-start: var(--8w);
      background-image: url('$assets/images/home-hero.jpg');
      background-size: cover;
      background-position: center;

      &::before {
        content: '';
        width: 424px;
        height: 571px;
        background-image: url('$assets/illustrations/home-hero-trim.svg');
        background-size: 100%;
        background-repeat: no-repeat;
      }
    }
  }
</style>
