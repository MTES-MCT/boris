<script lang="ts">
  import Notice from '$components/common/Notice.svelte';
  import Promesses from '$components/common/StepPage/Promesses.svelte';

  import { default as MascotteWaving } from '$assets/icons/mascotte-waving.svg?raw';
</script>

<div class="container">
  <Promesses title="Définition d'un OFS">
    <div class="definition-container">
      <div class="mascotte">
        {@html MascotteWaving}
      </div>

      <div class="notice-container">
        <Notice
          content="OFS = Organisme de Foncier Solidaire."
          type="info" />
      </div>

      <p>
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
  .container {
    position: relative;
  }

  .definition-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-inline: 1rem;

    @media (--sm-viewport) {
      padding-inline: 2rem;
    }

    .mascotte {
      position: absolute;
      top: -52px;
      right: 40px;
    }
  }

  .notice-container {
    display: inline-flex;
    flex-direction: column;
  }

  p {
    text-align: center;
    font-size: 1rem;
    margin-block: 2rem;

    @media (--sm-viewport) {
      font-size: 1.125rem;
      margin-block: 3rem;
    }
  }
</style>
