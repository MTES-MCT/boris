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

      <button class="fr-btn fr-btn--lg">Vérifier mon éligibilité</button>
    </div>
  </div>
  <div class="column illustration-container"></div>
</section>

<style lang="postcss">
  .hero {
    display: flex;
  }

  .column {
    width: 50%;
  }

  .text-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    text-align: left;
    padding-block-start: var(--15w);
    padding-block-end: var(--34w);
    z-index: 2;

    span {
      position: relative;
      display: inline-block;
      padding-inline: var(--1v);

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: calc(100% - 32px);
        margin-top: 16px;
        background-color: var(--color-red-primary);
        z-index: -1;
      }
    }

    .caption {
      font-size: 1.75rem;
      line-height: 2.25rem;
      font-weight: 400;
    }

    .title {
      margin-right: calc(-1 * var(--19w));
      padding-right: var(--3w);
      clip-path: var(--clip-path-home-title);
      background-color: white;
    }

    .cta {
      margin-block-start: var(--9w);
      margin-inline-end: var(--3w);

      p {
        font-size: 1.125rem;
        line-height: 1.75rem;
      }
    }
  }

  .illustration-container {
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
</style>
