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
    content="Trouvez un logement en BRS: consultez les biens en BRS disponibles à l’achat partout en France. Appartements et maisons en Bail Réel Solidaire." />
</svelte:head>

<Section
  title="Voici la liste des sites sur lesquels vous pouvez trouver des logements en bail réel solidaire disponibles à l’achat."
  titleElement="h1">
  <ul>
    <li>
      <p>
        <b>
          Les sites avec l’ensemble des logements disponibles en BRS sont
          référencés ici <u>par région</u>
          et
          <u>par OFS</u>
          (Organismes de Foncier Solidaires).
        </b>
      </p>
    </li>
    <li>
      <p>
        <b>
          Chaque lien vous redirige vers la page programme de l’Organismes de
          Foncier Solidaires (OFS) ou de son commercialisateur. Vous pourrez y
          consulter les logements en BRS disponibles à l’achat ou prendre
          contact pour trouver un logement en Bail Réel Solidaire.
        </b>
      </p>
    </li>
  </ul>

  <p>
    <b>Les appartements en BRS ou maisons en BRS</b>
    sont proposés par des
    <b>Organismes de Foncier Solidaires (OFS)</b>
    qui jouent un rôle clé dans l'accès au dispositif de Bail Réel Solidaire (BRS).
    Ces organismes, sans but lucratif et agréés par l'État, sont les seuls acteurs
    autorisés à monter des programmes en BRS.
  </p>

  <p>
    Sur cette page, vous pourrez ainsi identifier les Organismes de Foncier
    Solidaire (OFS) producteurs de logements en BRS proche de chez vous et
    découvrir les logements en bail réel solidaire qu’ils proposent. Vous pouvez
    les contacter pour connaître les logements disponibles à l’achat en BRS en
    ce moment ou à venir dans votre région.
  </p>

  <p>
    Dans certains cas, les OFS travaillent avec d'autres organismes, qu’on
    appelle commercialisateurs, pour diffuser leurs logements disponibles : vous
    pourrez être mis en relation avec ces commercialisateurs dans le cadre de
    vos démarches.
  </p>

  <div class="fr-accordions-group">
    {#each regions as region}
      {@const regionLabel = `${region.name}`}

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
