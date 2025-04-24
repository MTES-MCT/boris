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
  <title>Organismes de Foncier Solidaires - Boris</title>
  <meta
    name="description"
    content="Découvrez les Organismes de Foncier Solidaire (OFS) en France, acteurs clés du dispositif du Bail Réel Solidaire." />
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
      {@const regionLabel = `${region.name} (${region.totalOFSs})`}

      <Accordion
        label={regionLabel}
        labelElement="h2">
        <ul>
          {#each region.OFSs as ofs}
            <li>
              <p class="fr-text__lead fr-mb-0"><b>{ofs.nom}</b></p>
              {#if ofs.departements}
                <p class="fr-mb-0"><i>{ofs.departements}</i></p>
              {/if}
              <ul class="commercialisateurs">
                {#if ofs.formattedCommercialisateurs}
                  {#each ofs.formattedCommercialisateurs as { nom, lien }}
                    {@const hasName = Boolean(nom)}
                    {@const hasLink = Boolean(lien)}

                    <li>
                      {#if hasName && hasLink}
                        <p class="fr-mb-0">
                          Commercialisateur: {nom} &nbsp;-&nbsp;
                          <a
                            class="fr-link"
                            target="_blank"
                            href={lien}>
                            Site web
                          </a>
                        </p>
                      {:else if hasName}
                        <p class="fr-mb-0">{nom}</p>
                      {:else if hasLink}
                        <a
                          class="fr-link"
                          target="_blank"
                          href={lien}>
                          Site web
                        </a>
                      {/if}
                    </li>
                  {/each}
                {/if}
              </ul>
            </li>
          {/each}
        </ul>
      </Accordion>
    {/each}
  </div>
</Section>

<style lang="postcss">
  .commercialisateurs {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--1w);
    padding-inline-start: 0;
    margin-block-end: var(--3w);
  }
</style>
