<script lang="ts">
  import z, { ZodError } from 'zod';

  import type { FormFieldError } from '$lib/utils/definitions';
  import { formatFormErrors } from '$lib/utils/helpers';
  import { formatEuro } from '$lib/utils/formatters';

  import Wrapper from '$components/pages/simulateur-acquisition/Wrapper.svelte';
  import Description from '$components/pages/simulateur-acquisition/Description.svelte';
  import Form from '$components/pages/simulateur-acquisition/Form.svelte';
  import Actions from '$components/pages/simulateur-acquisition/Actions.svelte';
  import Action from '$components/pages/simulateur-acquisition/Action.svelte';
  import Input from '$components/common/Input.svelte';
  import Radio from '$components/common/Radio.svelte';
  import RadioFieldset from '$components/common/RadioFieldset.svelte';

  import acquisitionSimulatorManager from '$lib/managers/acquisition-simulator.svelte';

  let {
    brsFees,
    yearlyPropertyTax,
    yearlyHouseingInsurance,
    condominiumFeesFrequency,
    condominiumFees,
    monthlyExpenses,
    nextStep,
    previousStep,
    goToPreviousStep,
    goToNextStep,
  } = $derived(acquisitionSimulatorManager);

  let errors: FormFieldError = $state({});

  const FormData = z
    .object({
      brsFees: z
        .number()
        .gte(0, 'Veuillez saisir un chiffre supérieur ou égal à 0.')
        .optional(),
      yearlyPropertyTax: z
        .number()
        .gte(0, 'Veuillez saisir un chiffre supérieur ou égal à 0.')
        .optional(),
      yearlyHouseingInsurance: z
        .number()
        .gte(0, 'Veuillez saisir un chiffre supérieur ou égal à 0.')
        .optional(),
      condominiumFeesFrequency: z.string().optional(),
      condominiumFees: z
        .number()
        .gte(0, 'Veuillez saisir un chiffre supérieur ou égal à 0.')
        .optional(),
      monthlyExpenses: z
        .number()
        .gte(0, 'Veuillez saisir un chiffre supérieur ou égal à 0.')
        .optional(),
    })
    .refine(
      (data) => {
        if (data.condominiumFees && data.condominiumFees > 0) {
          return (
            data.condominiumFeesFrequency &&
            data.condominiumFeesFrequency.trim() !== ''
          );
        }

        return true;
      },
      {
        message:
          'Veuillez sélectionner la fréquence de paiement des frais de copropriété.',
        path: ['condominiumFeesFrequency'],
      },
    );

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();

    try {
      FormData.parse({
        brsFees,
        yearlyPropertyTax,
        yearlyHouseingInsurance,
        condominiumFeesFrequency,
        condominiumFees,
        monthlyExpenses,
      });

      errors = {};

      goToNextStep();
    } catch (e) {
      errors = formatFormErrors((e as ZodError).issues);
    }

    goToNextStep();
  };
</script>

<Wrapper>
  <Description>
    <p>
      En renseignant cette section, le simulateur vous donne une estimation
      claire du coût mensuel et annuel à prévoir une fois propriétaire. C'est
      une bonne idée de planifier votre budget en anticipant bien tous ces frais
      !
    </p>
    <p>
      Les valeurs préremplies sont des estimations, vous pouvez les modifier si
      vous le souhaitez.
    </p>
  </Description>

  <Form onSubmit={handleSubmit}>
    <div class="fieldset-container">
      <fieldset class="fr-fieldset">
        <div class="fr-fieldset__element fr-mb-4w">
          <Input
            value={brsFees}
            label="Redevance BRS mensuelle par m² (€)"
            hint="Laissez le champs vide si vous ne connaissez pas le montant de la redevance BRS mensuelle par m²."
            labelTooltip={`La redevance BRS mensuelle par m2 se situe en moyenne entre ${formatEuro(0.5, 2)} et ${formatEuro(3.5, 2)}.`}
            placeholder="Exemple: 1,50 € par m²"
            type="number"
            id="brs-fees"
            step={0.01}
            error={errors.brsFees}
            onChange={(e) => {
              acquisitionSimulatorManager.brsFees = Number(
                (e.target as HTMLInputElement).value,
              );
            }} />
        </div>

        <div class="fr-fieldset__element fr-mb-4w">
          <Input
            value={yearlyPropertyTax}
            label="Taxe foncière (€)"
            labelTooltip="La taxe foncière est une taxe annuelle perçue par les communes pour financer les services publics locaux."
            hint="Laissez le champs vide si vous ne connaissez pas le montant annuel de la taxe foncière."
            placeholder="Exemple: 1 000€ par an"
            type="number"
            id="yearly-property-tax"
            step={1}
            error={errors.yearlyPropertyTax}
            onChange={(e) => {
              acquisitionSimulatorManager.yearlyPropertyTax = Number(
                (e.target as HTMLInputElement).value,
              );
            }} />
        </div>

        <div class="fr-fieldset__element">
          <Input
            value={yearlyHouseingInsurance}
            label="Assurance habitation (€)"
            labelTooltip="L'assurance habitation est obligatoire pour votre logement, que vous soyez propriétaire ou locataire."
            hint="Laissez le champs vide si vous ne connaissez pas le montant annuel de l'assurance habitation."
            placeholder="Exemple: 300€ par an"
            type="number"
            id="yearly-houseing-insurance"
            step={1}
            error={errors.yearlyHouseingInsurance}
            onChange={(e) => {
              acquisitionSimulatorManager.yearlyHouseingInsurance = Number(
                (e.target as HTMLInputElement).value,
              );
            }} />
        </div>
      </fieldset>

      <RadioFieldset
        legend="Fréquence de paiement des charges de copropriété"
        error={errors.condominiumFeesFrequency}>
        <Radio
          label="Mensuel"
          checked={condominiumFeesFrequency === 'monthly'}
          oninput={() =>
            (acquisitionSimulatorManager.condominiumFeesFrequency =
              'monthly')} />
        <Radio
          label="Trimestriel"
          checked={condominiumFeesFrequency === 'trimestrial'}
          oninput={() =>
            (acquisitionSimulatorManager.condominiumFeesFrequency =
              'trimestrial')} />
        <Radio
          label="Annuel"
          checked={condominiumFeesFrequency === 'yearly'}
          oninput={() =>
            (acquisitionSimulatorManager.condominiumFeesFrequency =
              'yearly')} />
      </RadioFieldset>

      <fieldset class="fr-fieldset">
        <div class="fr-fieldset__element fr-mb-4w">
          <Input
            value={condominiumFees}
            label="Charges de copropriété (€)"
            hint="Laissez le champs vide ou saisissez 0 si vous ne connaissez pas le montant des charges de copropriété."
            placeholder="Exemple: 100€"
            type="number"
            id="condominium-fees"
            step={1}
            error={errors.condominiumFees}
            onChange={(e) => {
              acquisitionSimulatorManager.condominiumFees = Number(
                (e.target as HTMLInputElement).value,
              );
            }} />
        </div>

        <div class="fr-fieldset__element">
          <Input
            value={monthlyExpenses}
            label="Autres dépenses mensuelles (€)"
            labelTooltip="Ces dépenses sont par exemple l'électricité, l'eau, le gaz, internet, etc."
            hint="Laissez le champs vide si vous ne connaissez pas le montant des autres dépenses mensuelles."
            placeholder="Exemple: 100€ par mois"
            type="number"
            id="monthly-expenses"
            step={1}
            error={errors.monthlyExpenses}
            onChange={(e) => {
              acquisitionSimulatorManager.monthlyExpenses = Number(
                (e.target as HTMLInputElement).value,
              );
            }} />
        </div>
      </fieldset>
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
