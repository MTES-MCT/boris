<script lang="ts">
  import '@gouvfr/dsfr/dist/component/form/form.min.css';
  import '@gouvfr/dsfr/dist/component/input/input.min.css';
  import '@gouvfr/dsfr/dist/component/radio/radio.min.css';
  import '@gouvfr/dsfr/dist/component/tooltip/tooltip.min.css';
  import '@gouvfr/dsfr/dist/component/table/table.min.css';
  import '@gouvfr/dsfr/dist/component/alert/alert.min.css';

  import Section from '$components/common/Section.svelte';
  import Tooltip from '$components/common/Tooltip.svelte';
  import Autocomplete from '$components/common/Autocomplete.svelte';
  import type { GeocodedResponse } from '$lib/utils/definitions';
  import { type Zone } from '$lib/utils/lissage-ptz';

  let housingPrice: number = $state(0);
  let surface: number = $state(0);
  let selectedLocation: GeocodedResponse['properties'] | undefined = $state();
  let autocompleteValue = $derived(selectedLocation?.name || '');
  let housingType: 'new' | 'old' = $state('new');
  let ownContribution: number = $state(5000);
  let notaryFees: number = $state(0);
  let loanFees: number = $state(0);
  let realEstateFees: number = $state(0);
  let oneTimeExpenses: number = $state(0);
  let interestRate: number = $state(4);
  let loanDuration: number = $state(25);
  let brsFees: number = $state(0);
  let propertyTax: number = $state(0);
  let yearlyExpenses: number = $state(0);
  let meterSquareCost: number = $state(0);
  let totalMeterSquareCost: number = $state(0);
  let homeInsurance: number = $state(150);
  let condominiumFees: number = $derived(35 * surface);
  let brsZone: Zone | undefined = $state('Abis');
  let inHousePeopleAmount: number = $state(1);
  let fiscalIncome: number = $state(24000);
  let ptzType: Logement = $state('collectif');
  let lissage: PhaseRemboursement[] = $state([]);

  let estimatedNotaryFees: number = $derived.by(() => {
    if (housingPrice) {
      if (housingType === 'new') {
        return Math.round(housingPrice * 0.023);
      } else {
        return Math.round(housingPrice * 0.078);
      }
    }

    return 0;
  });

  let estimatedNotaryFeesString: string = $derived.by(() => {
    if (estimatedNotaryFees) {
      if (housingType === 'new') {
        return `${Math.round(estimatedNotaryFees)}€ (2,3% du prix)`;
      } else {
        return `${Math.round(estimatedNotaryFees)}€ (7,8% du prix)`;
      }
    }

    return '';
  });

  let estimatedRealEstateFees: number | undefined = $derived.by(() => {
    if (!housingPrice) return 0;

    if (realEstateFees === 0) return;

    return Math.round(housingPrice * 0.055);
  });

  let totalFees: number = $derived(
    (notaryFees || estimatedNotaryFees) +
      (realEstateFees || estimatedRealEstateFees || 0) +
      oneTimeExpenses,
  );

  let ownContributionAfterFees: number = $derived(ownContribution - totalFees);

  let loanAmount: number = $derived(
    Math.max(housingPrice - ownContributionAfterFees, 0),
  );

  let estimatedLoanFees: number = $derived.by(() => {
    if (!housingPrice) return 0;

    return Math.round(500 + loanAmount * 0.008);
  });

  let loanMonthlyCost = $derived.by(() => {
    if (!loanAmount || !interestRate || !loanDuration) return 0;

    return Math.round(
      (loanAmount * (interestRate / 1200)) /
        (1 - Math.pow(1 + interestRate / 1200, -loanDuration * 12)),
    );
  });

  let monthlyCost: number = $derived(
    loanMonthlyCost +
      brsFees +
      (propertyTax + yearlyExpenses + homeInsurance) / 12,
  );

  // const onLocationSelect = async (suggestion: AutocompleteSuggestion) => {
  //   selectedLocation = suggestion;

  //   const response = await fetch(
  //     `api/brs-zones?longitude=${selectedLocation.x}&latitude=${selectedLocation.y}`,
  //   );

  //   brsZone = await response.json();
  // };
</script>

<svelte:head>
  <title>Simulateur d'acquisition en BRS | BoRiS</title>
  <meta
    name="robots"
    content="noindex, nofollow" />
</svelte:head>

<div class="container">
  <div class="wrapper">
    <Section
      title="Simulateur d'acquisition en BRS"
      titleElement="h1">
      <form autocomplete="off">
        <div class="fieldset-container">
          <fieldset class="fr-fieldset">
            <legend class="fr-h4">1. Votre futur logement</legend>
            <div class="fr-fieldset__element">
              <Input
                value={housingPrice}
                label="Prix du logement (€)"
                labelTooltip="Prix de vente affiché par l'opérateur ou le promoteur, hors frais annexes."
                placeholder="200000"
                id="housing-price"
                type="number"
                min={10000}
                step={1000}
                required
                onChange={(e) => {
                  housingPrice = Number((e.target as HTMLInputElement).value);
                }} />
            </div>

            <!-- <div class="fr-fieldset__element">
              <Autocomplete
                bind:value={autocompleteValue}
                excludedPois={['commune', 'département', 'région']}
                label="Ville ou code postal du logement"
                placeholder="Quimper ou 23200"
                onSelect={onLocationSelect} />
              {#if brsZone}
                <p class="fr-mt-1w fr-text--sm">
                  <b>
                    Zone BRS: {brsZone}
                  </b>
                </p>
              {/if}
            </div> -->

            <div class="fr-fieldset__element">
              <Input
                value={surface}
                required
                id="surface"
                label="Superficie du logement (m²)"
                placeholder="50"
                onChange={(e) => {
                  const value = (e.target as HTMLInputElement).value;
                  const numericValue = value.replace(/\D/g, '').slice(0, 3);
                  (e.target as HTMLInputElement).value = numericValue;
                  surface = Number(numericValue);
                }} />
            </div>

            <div class="fr-fieldset__element">
              <label class="fr-label fr-mb-1w">
                Type de bien
                <Tooltip>
                  <div class="fr-p-2w">
                    Le taux des frais de notaire dépend du type de bien.
                    <ul>
                      <li>Neuf: logement jamais habité.</li>
                      <li>Ancien: logement déjà occupé.</li>
                    </ul>
                  </div>
                </Tooltip>
              </label>
              <div class="fr-input-wrap">
                <div class="fr-radio-group fr-mb-1v">
                  <input
                    type="radio"
                    id="bien-neuf"
                    name="type-bien"
                    value="new"
                    oninput={() => {
                      housingType = 'new';
                    }}
                    checked={housingType === 'new'} />
                  <label for="bien-neuf">Neuf</label>
                </div>
                <div class="fr-radio-group">
                  <input
                    type="radio"
                    id="bien-ancien"
                    name="type-bien"
                    value="old"
                    oninput={() => {
                      housingType = 'old';
                    }}
                    checked={housingType === 'old'} />
                  <label for="bien-ancien">Ancien</label>
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        <div class="fieldset-container">
          <fieldset class="fr-fieldset">
            <legend class="fr-h4">2. Votre apport personnel</legend>
            <div class="fr-fieldset__element">
              <Input
                value={ownContribution}
                label="Montant de votre apport (€)"
                labelTooltip="Somme dont vous disposez pour le projet (épargne, donation,
                    aide familiale, etc.)."
                type="number"
                id="own-contribution"
                min={0}
                step={500}
                required
                placeholder="25000"
                onChange={(e) => {
                  ownContribution = Number(
                    (e.target as HTMLInputElement).value,
                  );
                }} />
            </div>
          </fieldset>
        </div>

        <div class="fieldset-container">
          <fieldset class="fr-fieldset">
            <legend class="fr-h4">3. Frais annexes à l'acquisition</legend>
            <div class="fr-fieldset__element">
              <Input
                label="Frais de notaire (€)"
                labelTooltip={`
                  Frais obligatoires lors de l'achat, couvrant taxes et
                  rémunération du notaire.
                  <ul>
                    <li>Pour un achat neuf: 2,3% du prix du logement</li>
                    <li>Pour de l'ancien: 7,8%.</li>
                  </ul>
                `}
                type="number"
                id="notary-fees"
                min={0}
                step={100}
                placeholder="Laissez vide pour estimation automatique"
                forceNoMarginBottom
                onChange={(e) => {
                  notaryFees = Number((e.target as HTMLInputElement).value);
                }} />
              {#if notaryFees === 0 && housingPrice}
                <p class="fr-text--sm fr-mb-1w">
                  Estimation automatique: <b>{estimatedNotaryFeesString}</b>
                </p>
              {/if}
            </div>

            <div class="fr-fieldset__element">
              <Input
                label="Frais de garantie/prêt (€)"
                labelTooltip="Frais liés à la mise en place de votre prêt immobilier
                  (caution, garantie, dossier). Généralement autour de 0,8% du
                  montant emprunté + frais de dossier. Environ 70% de cette
                  somme vous serons reversés lorsque que vous aurez remboursé
                  l'intégralité de votre prêt."
                type="number"
                id="loan-fees"
                min={0}
                step={50}
                placeholder="Laissez vide pour estimation automatique"
                forceNoMarginBottom
                onChange={(e) => {
                  loanFees = Number((e.target as HTMLInputElement).value);
                }} />
              {#if loanFees === 0 && housingPrice}
                <p class="fr-text--sm fr-mb-1w">
                  Estimation automatique: <b>{estimatedLoanFees}€</b>
                </p>
              {/if}
            </div>

            <div class="fr-fieldset__element">
              <Input
                label="Frais d'agence immobilière (€)"
                labelTooltip="Si l'achat se fait via une agence, prévoir entre 3% et 8% du
                  prix du bien. Laissez vide si achat sans agence."
                type="number"
                id="real-estate-fees"
                min={0}
                step={100}
                placeholder="Inscrivez 0 si vous n'avez pas de frais d'agence"
                forceNoMarginBottom
                onChange={(e) => {
                  realEstateFees = Number((e.target as HTMLInputElement).value);
                }} />
              {#if realEstateFees === undefined && housingPrice}
                <p class="fr-text--small">
                  Estimation automatique: <b>
                    {estimatedRealEstateFees}€ (5,5% du prix)
                  </b>
                </p>
              {/if}
            </div>

            <div class="fr-fieldset__element">
              <Input
                label="Autres frais ponctuels (€)"
                labelTooltip="Coût du déménagement, ouverture des compteurs, etc. si pertinent"
                type="number"
                id="one-time-expenses"
                min={0}
                step={100}
                placeholder="1200"
                onChange={(e) => {
                  oneTimeExpenses = Number(
                    (e.target as HTMLInputElement).value,
                  );
                }} />
            </div>
          </fieldset>
        </div>

        <div class="fieldset-container">
          <fieldset class="fr-fieldset">
            <legend class="fr-h4">4. Synthèse de l'apport et des frais</legend>
            <div class="fr-table fr-table--lg fr-table--no-caption">
              <div class="fr-table__wrapper">
                <div class="fr-table__container">
                  <div class="fr-table__content">
                    <table>
                      <thead>
                        <tr>
                          <th>Poste</th>
                          <th>Montant (€)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Prix du logement</td>
                          <td>
                            {housingPrice || '-'}
                          </td>
                        </tr>
                        <tr>
                          <td>Apport personnel</td>
                          <td>
                            {ownContribution || '-'}
                          </td>
                        </tr>
                        <tr>
                          <td>Frais de notaire</td>
                          <td>
                            {notaryFees || estimatedNotaryFees || '-'}
                          </td>
                        </tr>
                        <tr>
                          <td>Frais de garantie/prêt</td>
                          <td>
                            {loanFees || estimatedLoanFees || '-'}
                          </td>
                        </tr>
                        <tr>
                          <td>Frais d’agence</td>
                          <td>
                            {realEstateFees || estimatedRealEstateFees || '-'}
                          </td>
                        </tr>
                        <tr>
                          <td>Autres frais ponctuels</td>
                          <td>
                            {oneTimeExpenses || '-'}
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <th>Total frais annexes</th>
                          <th>
                            {housingPrice +
                              ownContribution +
                              totalFees +
                              estimatedLoanFees || '-'}
                          </th>
                        </tr>
                        <tr>
                          <th>Apport restant après frais</th>
                          <th>
                            {ownContributionAfterFees > 0
                              ? ownContributionAfterFees
                              : '-'}
                          </th>
                        </tr>
                        <tr>
                          <th>Besoin d’emprunt</th>
                          <th>
                            {loanAmount || '-'}
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="fr-btn fr-btn--secondary fr-btn--download"
              onclick={() => window.print()}>
              Télécharger le récapitulatif
            </button>
          </fieldset>
        </div>

        <div class="fieldset-container">
          <fieldset class="fr-fieldset">
            <legend class="fr-h4">
              5. Prêt immobilier & prêt à taux zéro (PTZ, lissage)
            </legend>

            <div class="fr-fieldset__element">
              <p class="fr-h5 fr-mb-2w fr-mt-3w"><u>Paramètres du prêt</u></p>
              <Input
                value={interestRate}
                label="Taux d'intérêt de votre crédit (%)"
                labelTooltip="Taux annuel effectif global (TAEG) proposé par votre banque.
                    Indiquez 0 si vous n'avez pas encore d'offre."
                type="number"
                id="interest-rate"
                min={0}
                step={0.01}
                placeholder="3.25"
                onChange={(e) => {
                  interestRate = Number((e.target as HTMLInputElement).value);
                }} />
            </div>

            <div class="fr-fieldset__element">
              <Input
                value={loanDuration}
                label="Durée de remboursement (années)"
                labelTooltip="Durée classique: 20 à 25 ans."
                type="number"
                id="loan-duration"
                min={5}
                max={30}
                step={1}
                placeholder="25"
                onChange={(e) => {
                  loanDuration = Number((e.target as HTMLInputElement).value);
                }} />
            </div>

            <div class="fr-fieldset__element">
              <Input
                label="Montant à emprunter (€)"
                type="number"
                id="loan-amount"
                min={0}
                step={1000}
                placeholder="Laissez vide pour estimation automatique"
                forceNoMarginBottom
                onChange={(e) => {
                  loanAmount = Number((e.target as HTMLInputElement).value);

                  if (loanAmount === 0) {
                    loanAmount = housingPrice - ownContributionAfterFees;
                  }
                }} />
              {#if loanAmount}
                <p class="fr-text--sm fr-mb-1w">
                  Estimation automatique: <b>{loanAmount}€</b>
                </p>
              {/if}
            </div>

            <div class="fr-fieldset__element">
              <p class="fr-h5 fr-mb-2w fr-mt-5w">
                <u>Paramètres du prêt à taux zéro (PTZ)</u>
              </p>
              <Input
                value={inHousePeopleAmount}
                label="Nombre de personnes dans le foyer"
                type="number"
                id="in-house-people-amount"
                min={1}
                max={50}
                step={1}
                placeholder="2"
                onChange={(e) => {
                  inHousePeopleAmount = Number(
                    (e.target as HTMLInputElement).value,
                  );
                }} />
            </div>

            <div class="fr-fieldset__element">
              <Input
                value={fiscalIncome}
                label="Revenu fiscal de référence N-2 (€)"
                type="number"
                id="fiscal-income"
                min={1}
                max={1000000}
                step={1000}
                placeholder="10000"
                onChange={(e) => {
                  fiscalIncome = Number((e.target as HTMLInputElement).value);
                }} />
            </div>

            <div class="fr-fieldset__element">
              <label
                for="ptz-type"
                class="fr-label fr-mb-1w">
                Nature (PTZ)
              </label>
              <div class="fr-input-wrap">
                <div class="fr-radio-group fr-mb-1v">
                  <input
                    type="radio"
                    id="ptz-neuf"
                    name="type-ptz"
                    value="new"
                    oninput={() => {
                      ptzType = 'collectif';
                    }}
                    checked={ptzType === 'collectif'} />
                  <label for="ptz-neuf">Neuf collectif</label>
                </div>
                <div class="fr-radio-group">
                  <input
                    type="radio"
                    id="ptz-ancien"
                    name="type-ptz"
                    value="old"
                    oninput={() => {
                      ptzType = 'individuel';
                    }}
                    checked={ptzType === 'individuel'} />
                  <label for="ptz-ancien">Neuf individuel</label>
                </div>
              </div>
            </div>

            <button
              type="button"
              class="fr-btn fr-btn--secondary fr-btn--download fr-mt-2w"
              onclick={calculateGlobalLoan}>
              Simuler le lissage des prêts
            </button>
          </fieldset>

          {#if lissage.length > 0}
            <Table
              caption="Détails du lissage des prêts"
              size="sm"
              theads={[
                'Durée',
                'Mensualité PTZ',
                'Mensualité classique',
                'Mensualité globale',
              ]}
              tbodies={lissage.map((phase) => [
                `${String(phase.dureeAnnees)} ans`,
                `${String(phase.mensualitePTZ)} €`,
                `${String(phase.mensualiteClassique)} €`,
                `${String(
                  Number(phase.mensualitePTZ) +
                    Number(phase.mensualiteClassique),
                )} €`,
              ])} />
          {/if}
        </div>

        <div class="fieldset-container">
          <fieldset class="fr-fieldset">
            <legend class="fr-h4">6. Redevance BRS & charges mensuelles</legend>

            <div class="fr-fieldset__element">
              <label
                class="fr-label"
                for="brs-fees">
                Redevance BRS (€ / mois)
              </label>
              <input
                class="fr-input"
                type="number"
                id="brs-fees"
                min="0"
                step="1"
                placeholder="Ex : 1,50 €/m²"
                oninput={(e) => {
                  brsFees = Number((e.target as HTMLInputElement).value);
                }} />
            </div>

            <div class="fr-fieldset__element">
              <div class="fr-grid-row fr-grid-row--gutters">
                <div class="fr-col-6">
                  <label
                    class="fr-label"
                    for="meter-square-cost">
                    Coût par m²
                  </label>
                  <input
                    class="fr-input"
                    type="number"
                    id="meter-square-cost"
                    value={meterSquareCost}
                    oninput={(e) => {
                      meterSquareCost = Number(
                        (e.target as HTMLInputElement).value,
                      );

                      totalMeterSquareCost = meterSquareCost * surface;
                    }} />
                </div>
                <div class="fr-col-6">
                  <label
                    class="fr-label"
                    for="total-meter-square-cost">
                    Coût total
                  </label>
                  <input
                    class="fr-input"
                    type="number"
                    id="total-meter-square-cost"
                    value={totalMeterSquareCost}
                    oninput={(e) => {
                      totalMeterSquareCost = Number(
                        (e.target as HTMLInputElement).value,
                      );

                      meterSquareCost = totalMeterSquareCost / surface;
                    }} />
                </div>
              </div>
            </div>

            <div class="fr-fieldset__element">
              <label
                class="fr-label"
                for="property-tax">
                Taxe foncière (€ / an)
              </label>
              <input
                class="fr-input"
                type="number"
                id="property-tax"
                min="0"
                step="1"
                placeholder="Ex : 900"
                oninput={(e) => {
                  propertyTax = Number((e.target as HTMLInputElement).value);
                }} />
            </div>

            <div class="fr-fieldset__element">
              <label
                class="fr-label"
                for="home-insurance">
                Assurance habitation (€ / an)
                <Tooltip>
                  <div class="fr-p-2w">
                    L'assurance habitation est obligatoire pour votre logement,
                    que vous soyez propriétaire ou locataire.
                  </div>
                </Tooltip>
              </label>
              <input
                class="fr-input"
                type="number"
                id="home-insurance"
                min="0"
                step="1"
                placeholder="Ex : 150"
                value={homeInsurance}
                oninput={(e) => {
                  homeInsurance = Number((e.target as HTMLInputElement).value);
                }} />
            </div>

            <div class="fr-fieldset__element">
              <label
                class="fr-label"
                for="yearly-expenses">
                Autres charges annuelles (€ / an)
              </label>
              <input
                class="fr-input"
                type="number"
                id="yearly-expenses"
                min="0"
                step="1"
                placeholder="Ex : 600"
                oninput={(e) => {
                  yearlyExpenses = Number((e.target as HTMLInputElement).value);
                }} />
            </div>

            <div class="fr-fieldset__element">
              <p><b>Charges de copropriété</b></p>
              <div class="fr-grid-row fr-grid-row--gutters">
                <div class="fr-col-4">
                  <label
                    class="fr-label"
                    for="monthly-condominium-fees">
                    Coût mensuel
                  </label>
                  <input
                    class="fr-input"
                    type="number"
                    id="monthly-condominium-fees"
                    value={Math.round(condominiumFees / 12)}
                    oninput={(e) => {
                      condominiumFees =
                        Number((e.target as HTMLInputElement).value) * 12;
                    }} />
                </div>
                <div class="fr-col-4">
                  <label
                    class="fr-label"
                    for="trimestrial-condominium-fees">
                    Coût trimestriel
                  </label>
                  <input
                    class="fr-input"
                    type="number"
                    id="trimestrial-condominium-fees"
                    value={Math.round(condominiumFees / 4)}
                    oninput={(e) => {
                      condominiumFees =
                        Number((e.target as HTMLInputElement).value) * 4;
                    }} />
                </div>
                <div class="fr-col-4">
                  <label
                    class="fr-label"
                    for="yearly-condominium-fees">
                    Coût annuel
                  </label>
                  <input
                    class="fr-input"
                    type="number"
                    id="yearly-condominium-fees"
                    value={condominiumFees}
                    oninput={(e) => {
                      condominiumFees = Number(
                        (e.target as HTMLInputElement).value,
                      );
                    }} />
                </div>
              </div>
            </div>

            <div>
              <p class="fr-mb-0">
                <b>Coût mensuel estimé (hors charges courantes):</b>
              </p>
              <ul>
                <li>
                  Mensualité de crédit: {loanMonthlyCost || '-'}€
                </li>
                <li>
                  Redevance BRS: {brsFees || ''}€
                </li>
                <li>
                  Taxe foncière: {propertyTax || '-'}€/an ({propertyTax
                    ? Math.round(propertyTax / 12)
                    : '-'}€/mois)
                </li>
                <li>
                  Assurance habitation: {homeInsurance || '-'}€/an ({homeInsurance
                    ? Math.round(homeInsurance / 12)
                    : '-'}€/mois)
                </li>
                <li>
                  Autres charges: {yearlyExpenses || '-'}€/an ({yearlyExpenses
                    ? Math.round(yearlyExpenses / 12)
                    : '-'}€/mois)
                </li>
              </ul>
              <p>
                <b>
                  Total mensuel estimé: {monthlyCost
                    ? Math.round(monthlyCost)
                    : '-'}€
                </b>
              </p>
              {#if monthlyCost}
                <div class="fr-alert fr-alert--error fr-mb-2w">
                  <span>
                    Attention: ce montant ne comprend pas l’assurance emprunteur
                    ni les charges courantes (eau, énergie, etc.).
                  </span>
                </div>
              {/if}
              <div>
                <strong>
                  Coût annuel global: {monthlyCost
                    ? Math.round(monthlyCost * 12)
                    : '-'}€
                </strong>
              </div>
            </div>

            <button
              type="button"
              class="fr-btn fr-btn--secondary fr-btn--download fr-mt-2w"
              onclick={() => window.print()}>
              Télécharger le récapitulatif
            </button>
          </fieldset>
        </div>
      </form>
    </Section>
  </div>
</div>

<style lang="postcss">
  .container {
    background-color: #f8f8ff;
  }

  .wrapper {
    max-width: 800px;

    margin: 0 auto;
  }

  .fieldset-container {
    background-color: white;
    padding: var(--2w);
    border-radius: var(--1w);
    box-shadow: 0 2px 8px #eee;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: var(--6w);
  }

  fieldset {
    padding: 0.75rem;
  }

  label {
    display: inline-flex;
    align-items: flex-end;
    gap: var(--1v);
  }

  .fr-table {
    width: 100%;
    border: 1px solid var(--border-contrast-grey);
    border-bottom: none;

    th:nth-child(even) {
      border-left: 1px solid var(--border-plain-grey);
    }

    td:nth-child(even) {
      border-left: 1px solid var(--border-contrast-grey);
    }

    tfoot tr {
      background-color: var(--background-alt-grey);
      border-bottom: 1px solid var(--border-contrast-grey);
    }
  }
</style>
