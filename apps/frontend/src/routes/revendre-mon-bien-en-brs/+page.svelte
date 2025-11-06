<script lang="ts">
  import Page from '$components/common/SideNavPage/Page.svelte';
  import ContentPageHero from '$components/common/Heros/ContentPageHero.svelte';
  import { steps } from './content';
  import CalloutPanel from '$components/common/Panels/CalloutPanel.svelte';
  import KeyPoint from '$components/common/KeyPoint.svelte';

  const { title, description, sections, headTitle } = steps[0];
</script>

<svelte:head>
  <title>{headTitle}</title>
  <meta
    name="description"
    content={description} />
</svelte:head>

{#key title}
  <Page
    title="Les étapes de la revente de mon bien en BRS"
    titleElement="h3"
    {sections}>
    <ContentPageHero title="Revendre mon bien en BRS">
      <p>
        Vous souhaitez revendre votre bien en BRS ? BoRiS est là pour vous
        guider à chacune des phases ! Notre équipe du Ministère du logement peut
        même vous accompagner gratuitement dans ce projet. Cela vous intéresse ?
        Sur cette page, vous découvrirez chaque étape jusqu'à la vente.
      </p>
      <a
        href="/nous-contacter"
        class="fr-btn fr-btn--lg fr-mt-2w">
        Nous contacter
      </a>
    </ContentPageHero>

    <CalloutPanel
      title="La revente en 3 points clés"
      mascotte="MascotteWaving">
      <div class="fr-col-12 fr-col-lg-4 flex lg:flex-col gap-4">
        <KeyPoint>
          <p>
            <b>Vous êtes libre de vendre votre bien à tout moment.</b>
          </p>
          <p>
            Que ce soit pour changer de ville ou trouver un nouveau logement
            plus approprié à vos besoins, c'est vous qui décidez quand vous
            partez !
          </p>
        </KeyPoint>
      </div>
      <div class="fr-col-12 fr-col-lg-4 flex lg:flex-col gap-4">
        <KeyPoint>
          <p>
            <b>La revente d'un bien en BRS est encadrée :</b>
          </p>
          <p>
            Vous ne pouvez pas le vendre à n'importe qui : le ménage acheteur
            doit respecter les conditions d'éligibilité au BRS (c'est le cas de
            87% des foyers !)
          </p>
          <p>
            Le prix de revente est encadré : vous pouvez faire une plus value à
            hauteur de l'inflation depuis votre achat. Le BRS est un dispositif
            non spéculatif.
          </p>
        </KeyPoint>
      </div>
      <div class="fr-col-12 fr-col-lg-4 flex lg:flex-col gap-4">
        <KeyPoint>
          <p>
            <b>
              Il faut impliquer <a
                href="/organismes-de-foncier-solidaire"
                class="fr-link">
                l'organisme de foncier solidaire (OFS)
              </a>
              dans le processus.
            </b>
          </p>
          <p>
            D'abord parce qu'il a un droit de préemption (il peut racheter le
            bien avant qu'il soit proposé à d'autres personnes) ; ensuite parce
            qu'il doit donner son agrément ; parce qu'il doit être impliqué dans
            la rédaction du contrat de vente ; enfin parce qu'il peut vous aider
            à trouver un acheteur !
          </p>
        </KeyPoint>
      </div>
    </CalloutPanel>
  </Page>
{/key}
