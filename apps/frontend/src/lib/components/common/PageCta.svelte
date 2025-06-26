<script lang="ts">
  import { default as MascotteShowing } from '$assets/icons/mascotte-showing.svg?raw';
</script>

<section>
  <div class="mascotte-mobile">
    {@html MascotteShowing}
  </div>
  <div class="border-bottom-right">
    <div class="mascotte-desktop">
      {@html MascotteShowing}
    </div>
  </div>
  <div class="fr-container">
    <div class="content">
      <h3>
        Découvrez si des logements en BRS sont disponibles près de chez vous !
      </h3>
      <p>
        Les OFS partagent la propriété des logements en BRS avec les ménages
        bénéficiaires du dispositif, les aident, sécurisent leur achat et les
        accompagnent tout au long du processus, découvrez leurs offres !
      </p>
      <a
        href="/logements-brs-disponibles"
        class="fr-btn fr-btn--lg">
        Trouver un logement en BRS
      </a>
    </div>
  </div>
  <div class="border-bottom-left"></div>
</section>

<style lang="postcss">
  section {
    position: relative;
    padding-top: var(--9w);
    display: flex;
  }

  .mascotte-mobile {
    position: absolute;
    top: var(--3w);
    left: calc(50% - var(--12w));
  }

  .mascotte-desktop {
    display: none;
  }

  .content {
    padding-block-start: var(--4w);
    padding-block-end: var(--7w);
    max-width: 636px;
    margin: 0 auto;
    text-align: center;
    border: none;
  }

  .fr-container {
    position: relative;
    max-width: calc(588px + 2 * var(--12w));
    border-top: solid var(--path-thickness) var(--color-red-primary);

    &::before {
      border: none;
    }

    &::after {
      border: none;
    }
  }

  .border-bottom-right,
  .border-bottom-left {
    display: none;
    position: relative;
  }

  .border-bottom-left {
    border-left: solid var(--path-thickness) var(--color-red-primary);
    border-bottom-left-radius: var(--border-radius-lg);
  }

  .border-bottom-right {
    border-right: solid var(--path-thickness) var(--color-red-primary);
    border-bottom-right-radius: var(--border-radius-lg);
  }

  @media (--sm-viewport) {
    .content {
      border-top: solid var(--path-thickness) var(--color-red-primary);
    }

    .fr-container {
      border: none;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: calc(-1 * var(--path-thickness));
        width: var(--15w);
        height: calc(var(--15w) / 2);
        border-top: solid var(--path-thickness) var(--color-red-primary);
        border-left: solid var(--path-thickness) var(--color-red-primary);
        border-top-left-radius: var(--border-radius-lg);
      }

      &::after {
        content: '';
        position: absolute;
        top: 0;
        right: calc(-1 * var(--path-thickness));
        width: var(--15w);
        height: calc(var(--15w) / 2);
        border-top: solid var(--path-thickness) var(--color-red-primary);
        border-right: solid var(--path-thickness) var(--color-red-primary);
        border-top-right-radius: var(--border-radius-lg);
      }
    }

    .border-bottom-right,
    .border-bottom-left {
      display: block;
      flex: 1;
      height: calc(var(--15w) / 2);
      margin-block-start: calc(var(--15w) / 2);
      border-bottom: solid var(--path-thickness) var(--color-red-primary);
    }

    @media (--lg-viewport) {
      .mascotte-mobile {
        display: none;
      }

      .mascotte-desktop {
        display: block;
        position: absolute;
        top: 6px;
        right: var(--3w);
      }
    }
  }
</style>
