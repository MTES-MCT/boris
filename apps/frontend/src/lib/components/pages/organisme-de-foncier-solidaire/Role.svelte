<script lang="ts">
  import Section from '$components/common/Section.svelte';
  // import '@gouvfr/dsfr/dist/utility/icons/icons-business/icons-business.css';
  // import '@gouvfr/dsfr/dist/utility/icons/icons-buildings/icons-buildings.min.css';
</script>

<div class="wrapper background-color-white">
  <Section>
    <h2>OFS-BRS : le rôle des OFS</h2>

    <div class="container">
      <div class="content">
        <h3>La mission des OFS</h3>
        <p>
          Les Organismes de Foncier Solidaire (OFS) ont pour mission de réaliser
          des logements et de les vendre sous le régime spécifique du Bail Réel
          Solidaire.
        </p>
        <p>
          Pour réaliser cette mission, l'OFS <span class="fr-text--bold">
            achète et conserve des terrains
          </span>
          , sur lesquels il bâtit des logements, qu'il met ensuite en vente à des
          ménages modestes et moyens afin qu'ils puissent devenir propriétaires via
          un
          <span class="fr-text--bold">bail de très longue durée</span>
          (de 18 à 99 ans). Ce régime permet ainsi à l'OFS et au ménage de partager
          la propriété du logement, ce qui se traduit par un prix réduit à l'achat.
          Attention ! Le dispositif BRS n'est pas exempt de contrepartie.
        </p>
        <p>
          Pour en savoir plus : <a
            href="/blog/le-bail-reel-solidaire-brs-cest-quoi-exactement"
            class="fr-link">
            le Bail Réel Solidaire, c'est quoi exactement ?
          </a>
        </p>
      </div>
      <div class="content">
        <h3>Que font les OFS ?</h3>

        <div class="actions">
          {@render action(
            "Achat des terrains afin d'y construire des logements vendus en bail réel solidaire",
            'fr-icon-shake-hands-fill',
          )}
          {@render action(
            'Sélection des ménages acquéreurs',
            'fr-icon-team-fill',
          )}
          {@render action(
            'Signature de la vente en BRS avec les acquéreurs',
            'fr-icon-ball-pen-fill',
          )}
          {@render action(
            'Partage de la propriété des terrains avec les ménages acquéreurs',
            'fr-icon-community-fill',
          )}
          {@render action(
            'Suivi de la gestion du bien et des potentielles reventes ou transmission du logement',
            'fr-icon-presentation-fill',
          )}
        </div>
      </div>
    </div>
  </Section>
</div>

{#snippet action(content: string, icon: string)}
  <div class="action">
    <p class="fr-mb-0 fr-text--bold fr-text--sm">
      <span
        class={`${icon}`}
        aria-hidden="true">
      </span>
      {content}
    </p>
  </div>
{/snippet}

<style lang="postcss">
  .wrapper {
    margin-block: 5rem;
  }

  h2 {
    text-align: center;
    color: var(--color-blue-primary);
    margin-bottom: 3rem;
  }

  .container {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    @media (--md-viewport) {
      flex-direction: row;
    }
  }

  .content {
    flex: 1;
  }

  h3 {
    &:nth-last-child(1) {
      text-align: right;
    }
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .action {
    padding: 0.5rem;
    border: solid 1px var(--color-blue-primary);
    border-radius: var(--border-radius-md);
  }
</style>
