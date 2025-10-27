<script lang="ts">
  import { default as MascotteShowing } from '$assets/icons/mascotte-showing.svg?raw';
  import type { Heading } from '$lib/utils/definitions';

  type Props = {
    titleElement?: Heading;
  };

  const { titleElement = 'h3' }: Props = $props();
</script>

<section class="flex relative fr-pt-9w">
  <div class="mascotte-mobile absolute block lg_none">
    {@html MascotteShowing}
  </div>
  <div class="border-bottom-right relative none sm_block flex-1 fr-mt-15v">
    <div class="mascotte-desktop absolute none lg_block">
      {@html MascotteShowing}
    </div>
  </div>
  <div class="fr-container relative">
    <div class="content fr-m-auto fr-pt-4w fr-pb-7w text-center">
      <svelte:element
        this={titleElement}
        class="fr-h3">
        Découvrez si des logements en bail réel solidaire (BRS) sont disponibles
        près de chez vous !
      </svelte:element>
      <p>
        Les <a
          href="/organismes-de-foncier-solidaire"
          class="fr-link">
          organismes de foncier solidaire (OFS)
        </a>
        partagent la propriété des logements en bail réel solidaire (BRS) avec les
        ménages bénéficiaires du dispositif, les aident, sécurisent leur achat et
        les accompagnent tout au long du processus, découvrez leurs offres !
      </p>
      <a
        href="/logements-brs-disponibles"
        class="fr-btn fr-btn--lg">
        Trouver un logement en bail réel solidaire
      </a>
    </div>
  </div>
  <div class="border-bottom-left relative none sm_block flex-1 fr-mt-15v"></div>
</section>

<style lang="postcss">
  .mascotte-mobile {
    top: 1.5rem;
    left: calc(50% - 6rem);
  }

  .content {
    max-width: 636px;
  }

  .fr-container {
    max-width: calc(588px + 12rem);
    border-top: solid var(--path-thickness) var(--color-red-primary);

    &::before {
      border: none;
    }

    &::after {
      border: none;
    }
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
        width: 7.5rem;
        height: 3.75rem;
        border-top: solid var(--path-thickness) var(--color-red-primary);
        border-left: solid var(--path-thickness) var(--color-red-primary);
        border-top-left-radius: var(--border-radius-lg);
      }

      &::after {
        content: '';
        position: absolute;
        top: 0;
        right: calc(-1 * var(--path-thickness));
        width: 7.5rem;
        height: 3.75rem;
        border-top: solid var(--path-thickness) var(--color-red-primary);
        border-right: solid var(--path-thickness) var(--color-red-primary);
        border-top-right-radius: var(--border-radius-lg);
      }
    }

    .border-bottom-right,
    .border-bottom-left {
      height: 3.75rem;
      border-bottom: solid var(--path-thickness) var(--color-red-primary);
    }

    @media (--lg-viewport) {
      .mascotte-desktop {
        top: 6px;
        right: 1.5rem;
      }
    }
  }
</style>
