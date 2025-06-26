<script lang="ts">
  import Section from '$components/common/Section.svelte';
  import Accordion from '$components/common/Accordion.svelte';
  import type { Region } from '$lib/utils/definitions';

  type Props = {
    data: {
      regions: Region[];
    };
  };

  const { data }: Props = $props();
  const { regions } = data;
</script>

<svelte:head>
  <title>Les logements disponibles en Bail Réel Solidaire - BRS - BoRiS</title>
  <meta
    name="description"
    content=" Les Organismes de Foncier Solidaires (OFS) ou leurs commercialisateurs proposent des logements en Bail Réel Solidaire (BRS) en vente. Découvrez les ici." />
</svelte:head>

<Section
  title="Voici la liste des Organismes de Foncier Solidaires (OFS) répertoriés par région"
  titleElement="h1">
  <p>
    Les OFS jouent un rôle clé dans l'accès au dispositif de Bail Réel Solidaire
    (BRS). Ces organismes sans but lucratif agréés par l'État sont les seuls
    acteurs autorisés à monter des programmes en BRS.
  </p>
  <p>
    Sur cette page, vous trouverez un annuaire des OFS producteurs de BRS en
    France, trié par région. Cet outil vous permettra d’identifier rapidement
    les OFS actifs près de chez vous, de découvrir les projets qu’ils portent,
    et de les contacter pour en savoir plus sur les opportunités de logement en
    BRS.
  </p>
  <p>
    Chaque OFS développe des programmes de logements spécifiques, adaptés aux
    besoins locaux. Vous pouvez les contacter pour connaître les logements
    disponibles ou à venir dans votre région.
  </p>
  <p>
    Dans certains cas, les OFS travaillent avec d'autres organismes pour
    diffuser leurs logements disponibles : vous pourrez être mis en relation
    avec ces organismes dans le cadre de vos démarches.
  </p>

  <div class="fr-accordions-group">
    {#each regions as region}
      {@const regionLabel = `${region.name} (${region.totalOfss})`}

      <Accordion
        label={regionLabel}
        labelElement="h2">
        <ul>
          {#each region.ofss as ofs}
            <li class="ofs">
              <p class="fr-text__lead fr-mb-0"><b>{ofs.name}</b></p>
              {#if ofs.departements}
                <p class="departements">
                  <i>
                    {ofs.departements
                      .map(({ name }) => `BRS ${name}`)
                      .join(', ')}
                  </i>
                </p>
              {/if}
              {#if ofs.distributors.length > 0}
                <ul class="commercialisateurs">
                  {#each ofs.distributors as { name, websiteUrl }}
                    {@const hasName = Boolean(name)}
                    {@const hasLink = Boolean(websiteUrl)}

                    <li>
                      {#if hasName && hasLink}
                        <p class="fr-mb-0">
                          Commercialisateur: {name} &nbsp;-&nbsp;
                          <a
                            class="fr-link"
                            target="_blank"
                            href={websiteUrl}>
                            Site web
                          </a>
                        </p>
                      {:else if hasName}
                        <p class="fr-mb-0">{name}</p>
                      {:else if hasLink}
                        <a
                          class="fr-link"
                          target="_blank"
                          href={websiteUrl}>
                          Site web
                        </a>
                      {/if}
                    </li>
                  {/each}
                </ul>
              {:else if ofs.websiteUrl}
                <a
                  class="fr-link"
                  target="_blank"
                  href={ofs.websiteUrl as unknown as string}>
                  Site web
                </a>
              {/if}
            </li>
          {/each}
        </ul>
      </Accordion>
    {/each}
  </div>
</Section>

<style lang="postcss">
  .ofs {
    margin-bottom: var(--2w);
  }

  .departements {
    margin-block-end: var(--1w);
  }

  .commercialisateurs {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--1w);
    padding-inline-start: 0;
    margin-block: 0;

    li {
      padding-bottom: 0;
    }
  }
</style>
