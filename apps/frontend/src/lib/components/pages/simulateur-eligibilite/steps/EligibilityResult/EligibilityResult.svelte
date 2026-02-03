<script lang="ts">
  import Notice from '$components/common/Notice.svelte';
  import Description from '$components/common/Simulator/Description.svelte';
  import Wrapper from '$components/common/Simulator/Wrapper.svelte';

  import eligibilitySimulatorManager from '$lib/managers/eligibility-simulator.svelte';
  import ResultDetail from '$components/pages/simulateur-eligibilite/steps/EligibilityResult/ResultDetails.svelte';
  import UserDetails from '$components/pages/simulateur-eligibilite/steps/EligibilityResult/UserDetails.svelte';

  const { currentStep, steps, currentPhase } = $derived(
    eligibilitySimulatorManager,
  );
</script>

<Wrapper>
  <Description
    title="Simulateur d'éligibilité"
    stepTitle={`${currentStep.step}. ${currentStep.title}`}
    currentStep={currentStep.step}
    stepCount={steps.length}>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam veritatis,
      quidem perspiciatis aspernatur id tempora, esse quis saepe necessitatibus
      similique animi praesentium? Distinctio sunt rerum quidem. Hic error natus
      facere?
    </p>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga accusantium
      a error praesentium veritatis quisquam officia iste sit eveniet dolorem
      deserunt ut, laborum dolores. Nesciunt nisi soluta minima provident
      voluptatibus.
    </p>
  </Description>

  {#if currentPhase.phase === 1}
    <ResultDetail />
  {:else if currentPhase.phase === 2}
    <UserDetails />
  {/if}
</Wrapper>
