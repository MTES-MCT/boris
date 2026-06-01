<script lang="ts">
  import Page from '$components/common/SideNavPage/Page.svelte';
  import ContentPageHero from '$components/common/Heros/ContentPageHero.svelte';
  import { resaleSteps, steps } from './content';
  import CalloutPanel from '$components/common/Panels/CalloutPanel.svelte';
  import KeyPoint from '$components/common/KeyPoint.svelte';
  import FindMyOfs from '$components/pages/revendre-mon-bien-en-brs/FindMyOfs.svelte';
  import ResaleFaq from '$components/pages/revendre-mon-bien-en-brs/ResaleFaq.svelte';
  import Stepper from '$components/common/Stepper.svelte';

  const { title, description, sections, headTitle } = steps[0];

  let activeStepIndex = $state(0);
  const activeStep = $derived(resaleSteps[activeStepIndex]);
  const nextStepTitle = $derived(resaleSteps[activeStepIndex + 1]?.title);

  const goToPreviousStep = () => {
    activeStepIndex = Math.max(activeStepIndex - 1, 0);
  };

  const goToNextStep = () => {
    activeStepIndex = Math.min(activeStepIndex + 1, resaleSteps.length - 1);
  };
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
    </ContentPageHero>

    <CalloutPanel
      title="Trois points à retenir sur la revente en BRS"
      mascotte="MascotteWaving">
      <div class="fr-col-12 fr-col-lg-4 flex lg:flex-col gap-4">
        <KeyPoint>
          <p>
            <b>Vous êtes libre de revendre votre logement quand vous voulez.</b>
          </p>
          <p>
            Que ce soit pour changer de ville, agrandir la famille ou tout autre
            motif, c’est vous qui décidez du moment du départ.
          </p>
        </KeyPoint>
      </div>
      <div class="fr-col-12 fr-col-lg-4 flex lg:flex-col gap-4">
        <KeyPoint>
          <p>
            <b>La revente est encadrée mais accessible.</b>
          </p>
          <p>
            L’acheteur doit respecter les <a
              href="https://boris.beta.gouv.fr/simulateur-eligibilite"
              class="fr-link">
              conditions d’éligibilité au BRS
            </a>
            , ce qui couvre environ 87 % des foyers français. Le prix de vente est
            plafonné par votre bail : le BRS reste un dispositif non spéculatif.
          </p>
        </KeyPoint>
      </div>
      <div class="fr-col-12 fr-col-lg-4 flex lg:flex-col gap-4">
        <KeyPoint>
          <p>
            <b>
              Votre <a
                href="/organismes-de-foncier-solidaire"
                class="fr-link">
                OFS
              </a>
              est votre interlocuteur clé.
            </b>
          </p>
          <p>
            Il fixe le prix maximum de revente de votre logement, donne son
            agrément à l’acheteur, peut préempter ou vous aider à trouver un
            acquéreur. Prévenez-le dès que vous décidez de vendre.
          </p>
        </KeyPoint>
      </div>
    </CalloutPanel>

    {#snippet footerSections()}
      <article
        id="trouver-mon-ofs"
        class="!pb-8 border-b border-gray-light">
        <h2 class="fr-h5 pt-12">Qui est mon OFS ?</h2>
        <FindMyOfs />
      </article>

      <article
        id="revente-en-7-etapes"
        class="!pb-8 border-b border-gray-light">
        <h2 class="fr-h5 pt-12">
          Les 7 étapes de la revente en bail réel solidaire
        </h2>
        <div class="max-w-[48rem]">
          <Stepper
            title={activeStep.title}
            {nextStepTitle}
            currentStep={activeStepIndex + 1}
            stepCount={resaleSteps.length}
            titleElement="h3" />

          <p class="fr-text--lead mt-6">
            {activeStep.description}
          </p>

          <div class="flex flex-col sm:flex-row gap-4 mt-8">
            <button
              class="fr-btn fr-btn--secondary"
              type="button"
              onclick={goToPreviousStep}
              disabled={activeStepIndex === 0}>
              Étape précédente
            </button>
            <button
              class="fr-btn"
              type="button"
              onclick={goToNextStep}
              disabled={activeStepIndex === resaleSteps.length - 1}>
              Étape suivante
            </button>
          </div>
        </div>
      </article>

      <ResaleFaq />
    {/snippet}
  </Page>
{/key}
