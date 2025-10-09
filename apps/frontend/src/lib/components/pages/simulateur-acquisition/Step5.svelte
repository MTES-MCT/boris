<script lang="ts">
  import z, { ZodError } from 'zod';

  import type { FormFieldError } from '$lib/utils/definitions';
  import { formatFormErrors } from '$lib/utils/helpers';
  import { PretLisse, type Logement, type Zone } from '$lib/utils/lissage-ptz';

  import Wrapper from '$components/pages/simulateur-acquisition/Wrapper.svelte';
  import Description from '$components/pages/simulateur-acquisition/Description.svelte';
  import Form from '$components/pages/simulateur-acquisition/Form.svelte';
  import Input from '$components/common/Input.svelte';
  import Actions from '$components/pages/simulateur-acquisition/Actions.svelte';
  import Action from '$components/pages/simulateur-acquisition/Action.svelte';
  import { formatEuro } from '$lib/utils/formatters';
  import Badge from '$components/common/Badge.svelte';
  import RadioFieldset from '$components/common/RadioFieldset.svelte';
  import Radio from '$components/common/Radio.svelte';

  import acquisitionSimulatorManager from '$lib/managers/acquisition-simulator.svelte';

  let {
    interestRate,
    loanDuration,
    loanAmount,
    housingType,
    inHousePeopleAmount,
    fiscalIncome,
    ptzType,
    brsZone,
    ownContribution,
    previousStep,
    nextStep,
    goToPreviousStep,
    goToNextStep,
  } = $derived(acquisitionSimulatorManager);

  let errors: FormFieldError = $state({});

  const FormData = z.object({
    interestRate: z
      .number({
        message: 'Veuillez remplir ce champs.',
      })
      .positive('Veuillez saisir un chiffre supérieur à 0.'),
    loanDuration: z
      .number({
        message: 'Veuillez remplir ce champs.',
      })
      .gte(10, 'La durée du prêt ne peut pas être inférieure à 10 ans.')
      .lte(25, 'La durée du prêt ne peut pas être supérieure à 25 ans.'),
    inHousePeopleAmount: z
      .number({
        message: 'Veuillez remplir ce champs.',
      })
      .positive('Veuillez saisir un chiffre supérieur à 0.'),
    fiscalIncome: z
      .number({
        message: 'Veuillez remplir ce champs.',
      })
      .positive('Veuillez saisir un chiffre supérieur à 0.'),
    ptzType: z.string({
      message: 'Veuillez selectionner le type du logement.',
    }),
  });

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    try {
      FormData.parse({
        interestRate,
        loanDuration,
        inHousePeopleAmount,
        fiscalIncome,
        ptzType,
      });

      errors = {};

      acquisitionSimulatorManager.pretLisse = new PretLisse(
        loanAmount,
        brsZone as Zone,
        ownContribution as number,
        interestRate as number,
        loanDuration as number,
        inHousePeopleAmount as number,
        fiscalIncome as number,
        ptzType as Logement,
      );

      goToNextStep();
    } catch (e) {
      errors = formatFormErrors((e as ZodError).issues);
    }
  };
</script>

<Wrapper>
  <Description
    content="[TEXTE A DEFINIR] Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
  <Form onSubmit={handleSubmit}>
    <div class="fieldset-container">
      <fieldset class="fr-fieldset">
        <div class="fr-fieldset__element">
          <p class="fr-h6"><u>Paramètres du prêt immobilier</u></p>
        </div>

        <div class="fr-fieldset__element fr-mb-4w">
          <div class="fr-input-group">
            <p class="fr-label fr-mb-0"><b>Montant à emprunter (€)</b></p>
            <p class="fr-hint-text fr-mb-1w">
              Le montant à emprunter est pré-calculé en fonction de vos réponses
              précédentes.
            </p>
            <Badge
              status="success"
              hideIcon>
              {formatEuro(loanAmount as number)}
            </Badge>
          </div>
        </div>

        <div class="fr-fieldset__element fr-mb-4w">
          <Input
            value={interestRate}
            label="Taux d'intérêt de votre crédit (%) *"
            labelTooltip="Renseigner le taux d'intérêt hors assurance."
            type="number"
            id="interest-rate"
            step={0.01}
            placeholder="Exemple: 3.25"
            error={errors.interestRate}
            onChange={(e) => {
              acquisitionSimulatorManager.interestRate = Number(
                (e.target as HTMLInputElement).value,
              );
            }} />
        </div>

        <div class="fr-fieldset__element fr-mb-4w">
          <Input
            value={loanDuration}
            label="Durée de remboursement (années) *"
            labelTooltip="La durée de remboursement est en moyenne de 20 à 25 ans."
            type="number"
            id="loan-duration"
            step={1}
            placeholder="Exemple: 25"
            error={errors.loanDuration}
            onChange={(e) => {
              acquisitionSimulatorManager.loanDuration = Number(
                (e.target as HTMLInputElement).value,
              );
            }} />
        </div>
      </fieldset>
    </div>

    <div class="fieldset-container">
      {#if housingType !== 'new'}
        <fieldset class="fr-fieldset">
          <div class="fr-fieldset__element">
            <p class="fr-h6"><u>Paramètres du prêt à taux zéro (PTZ)</u></p>
          </div>
          <div class="fr-fieldset__element">
            <p>
              Notre simulateur ne propose pas encore de simulation de prêt à
              taux zéro pour les biens anciens.
            </p>
          </div>
        </fieldset>
      {:else}
        <fieldset class="fr-fieldset">
          <div class="fr-fieldset__element fr-mb-4w">
            <Input
              value={inHousePeopleAmount}
              label="Nombre de personnes dans le foyer *"
              type="number"
              id="in-house-people-amount"
              step={1}
              placeholder="Exemple: 5"
              error={errors.inHousePeopleAmount}
              onChange={(e) => {
                acquisitionSimulatorManager.inHousePeopleAmount = Number(
                  (e.target as HTMLInputElement).value,
                );
              }} />
          </div>

          <div class="fr-fieldset__element">
            <Input
              value={fiscalIncome}
              label="Revenu fiscal de référence N-2 (€) *"
              labelTooltip={`Le revenu fiscal de référence est la somme des revenus fiscaux de référence de tous les futurs occupants, basée sur l'année n-2.
                <br/> Exemple : Pour un prêt en 2025, on prend les revenus fiscaux de référence de 2023.`}
              type="number"
              id="fiscal-income"
              step={1}
              placeholder="Exemple: 25 000€"
              error={errors.fiscalIncome}
              onChange={(e) => {
                acquisitionSimulatorManager.fiscalIncome = Number(
                  (e.target as HTMLInputElement).value,
                );
              }} />
          </div>
        </fieldset>

        <RadioFieldset
          legend="Type du logement *"
          legendTooltip={`
            <div class="fr-p-2w">
              Un logement collectif fait partie d'une copropriété, alors que un logement individuel ne fait partie d'aucune copropriété.
            </div>
          `}
          error={errors.ptzType}>
          <Radio
            label="Collectif"
            checked={ptzType === 'collectif'}
            oninput={() =>
              (acquisitionSimulatorManager.ptzType = 'collectif')} />
          <Radio
            label="Individuel"
            checked={ptzType === 'individuel'}
            oninput={() =>
              (acquisitionSimulatorManager.ptzType = 'individuel')} />
        </RadioFieldset>
      {/if}
    </div>

    <Actions>
      <Action
        direction="previous"
        label={previousStep?.title as string}
        onClick={goToPreviousStep} />
      <Action
        direction="next"
        label={nextStep?.title as string}
        type="submit" />
    </Actions>
  </Form>
</Wrapper>

<style lang="postcss">
  .fieldset-container {
    &:nth-child(1) {
      fieldset {
        &::after {
          content: '';
          display: block;
          width: calc(100% - 8rem);
          height: 1px;
          margin: 0 auto;
          margin-bottom: 1rem;
          background-color: var(--color-grey-default);
        }
      }
    }
  }
</style>
