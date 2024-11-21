<script lang="ts">
  import type { Props } from './definitions';
  import { onMount } from 'svelte';
  import Section from '$components/section/section.svelte';
  import Tooltip from '$components/tooltip/tooltip.svelte';

  const { data }: Props = $props();

  onMount(async () => {
    // @ts-expect-error cannot find module declaration
    await import('https://cdn.landbot.io/landbot-3/landbot-3.0.0.js');

    // @ts-expect-error cannot find Landbot name
    // eslint-disable-next-line no-undef
    new Landbot.Container({
      container: '#landbot',
      configUrl: data.landbotConfigUrl,
    });
  });
</script>

<svelte:head>
  <title>Boris - Simuler mon éligibilité</title>
</svelte:head>

<Section
  title="Simuler mon eligibilité"
  titleElement="h1">
  <p>
    Voici BoRiS. En vous posant quelques questions, il pourra vous indiquer
    votre éligibilité au Bail Réel Solidaire (BRS). Grâce à sa connaissance des
    différents dispositifs, il vous aiguillera également vers d'autres outils ou
    des aides vous concernant.
  </p>
  <div
    id="landbot"
    class="fr-my-3w fr-my-md-6w background-alt-raised-grey">
  </div>
</Section>

<Section title="Plafonds de ressources d'éligibilité au BRS">
  <div
    class="fr-table fr-table--bordered"
    id="table-bordered-component">
    <div class="fr-table__wrapper">
      <div class="fr-table__container">
        <div class="fr-table__content">
          <table id="table-bordered">
            <caption>
              Plafonds en vigueur depuis le premier Janvier 2024
            </caption>
            <thead>
              <tr>
                <th scope="col">Catégorie de ménage</th>
                <th scope="col">Zone A (et A bis)</th>
                <th scope="col">Zone B1</th>
                <th scope="col">Zone B2 et C</th>
              </tr>
            </thead>
            <tbody>
              <tr
                id="table-bordered-row-key-1"
                data-row-key="1">
                <td class="menage-category-datacell">
                  <span>1</span>
                  <Tooltip>Une personne seule</Tooltip>
                </td>
                <td>37 581</td>
                <td>37 581</td>
                <td>32 673</td>
              </tr>
              <tr
                id="table-bordered-row-key-2"
                data-row-key="2">
                <td class="menage-category-datacell">
                  <span>2</span>
                  <Tooltip>
                    Deux personnes ne comportant aucune personne à charge, <b>
                      à l'exclusion des jeunes ménages
                    </b>
                    <br />
                    <b>ou</b>
                    <br />
                    une personne seule en situation de handicap
                  </Tooltip>
                </td>
                <td>56 169</td>
                <td>56 169</td>
                <td>43 633</td>
              </tr>
              <tr
                id="table-bordered-row-key-3"
                data-row-key="3">
                <td class="menage-category-datacell">
                  <span>3</span>
                  <Tooltip>
                    Trois personnes
                    <br />
                    <b>ou</b>
                    <br />
                    une personne seule avec une personne à charge
                    <br />
                    <b>ou</b>
                    <br />
                    un jeune ménages (deux personnes dont la somme des âges ne dépasse
                    pas 55 ans)
                    <br />
                    <b>ou</b>
                    <br />
                    deux personnes dont au moins une est en situation de handicap
                  </Tooltip>
                </td>
                <td>73 630</td>
                <td>67 517</td>
                <td>52 471</td>
              </tr>
              <tr
                id="table-bordered-row-key-4"
                data-row-key="4">
                <td class="menage-category-datacell">
                  <span>4</span>
                  <Tooltip>
                    Quatre personnes
                    <br />
                    <b>ou</b>
                    <br />
                    une personne seule avec deux personnes à charge
                    <br />
                    <b>ou</b>
                    <br />
                    trois personnes dont au moins une est en situation de handicap
                  </Tooltip>
                </td>
                <td>87 909</td>
                <td>80 875</td>
                <td>63 347</td>
              </tr>
              <tr
                id="table-bordered-row-key-4"
                data-row-key="4">
              </tr>
              <tr
                id="table-bordered-row-key-4"
                data-row-key="4">
                <td class="menage-category-datacell">
                  <span>5</span>
                  <Tooltip>
                    Cinq personnes
                    <br />
                    <b>ou</b>
                    <br />
                    une personne seule avec trois personnes à charge
                    <br />
                    <b>ou</b>
                    <br />
                    quatre personnes dont au moins une est en situation de handicap
                  </Tooltip>
                </td>
                <td>104 592</td>
                <td>95 739</td>
                <td>74 518</td>
              </tr>
              <tr
                id="table-bordered-row-key-4"
                data-row-key="4">
                <td class="menage-category-datacell">
                  <span>6</span>
                  <Tooltip>
                    Six personnes
                    <br />
                    <b>ou</b>
                    <br />
                    une personne seule avec quatre personnes à charge
                    <br />
                    <b>ou</b>
                    <br />
                    cinq personnes dont au moins une est en situation de handicap
                  </Tooltip>
                </td>
                <td>117 694.</td>
                <td>107 738</td>
                <td>83 983</td>
              </tr>
              <tr
                id="table-bordered-row-key-4"
                data-row-key="4">
                <td>Personne supplémentaire</td>
                <td>13 116</td>
                <td>12 005</td>
                <td>9 368</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</Section>

<style>
  #landbot {
    height: 800px;
    background: var(--background-alt-blue-cumulus);
    border-radius: var(--border-radius);
  }

  .fr-table caption {
    font-size: 1rem;
    font-weight: normal;
  }

  .menage-category-datacell {
    display: flex;
    align-items: center;
    gap: var(--1w);
  }
</style>
