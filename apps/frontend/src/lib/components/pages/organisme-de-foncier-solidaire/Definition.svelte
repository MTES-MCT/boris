<script lang="ts">
  import Notice from '$components/common/Notice.svelte';
  import Promesses from '$components/common/StepPage/Promesses.svelte';

  import { default as MascotteWaving } from '$assets/icons/mascotte-waving.svg?raw';
</script>

<div class="relative">
  <Promesses title="Définition d'un OFS">
    <div class="definition-container flex flex-column align-center fr-px-2w">
      <div class="mascotte absolute">
        {@html MascotteWaving}
      </div>

      <Notice
        content="OFS = Organisme de Foncier Solidaire."
        type="info" />

      <p class="text-center fr-my-4w fr-my-md-6w">
        Un organisme de foncier solidaire (OFS) est <span class="fr-text--bold">
          une structure à but non lucratif ou à lucrativité limitée
        </span>
        agréée par l'État. Il peut s'agir d'un établissement public foncier local,
        d'un bailleur social, d'une association loi 1901, d'un groupe d'intérêt public
        (GIP) ou d'une société coopérative d'intérêt collectif (SCIC).
      </p>
    </div>
  </Promesses>
</div>

<style lang="postcss">
  .mascotte {
    top: -52px;
    right: 40px;
  }
</style>
