<script lang="ts">
  import Notice from '$components/common/Notice.svelte';
  import CalloutPanel from '$components/common/Panels/CalloutPanel.svelte';
</script>

<CalloutPanel
  title="Définition d'un OFS"
  mascotte="MascotteWaving">
  <div class="flex flex-col items-center px-4 md:px-8">
    <Notice
      content="OFS = Organisme de Foncier Solidaire."
      type="info" />

    <p class="text-center !my-8 md:!my-12">
      Un organisme de foncier solidaire (OFS) est <span class="fr-text--bold">
        une structure à but non lucratif ou à lucrativité limitée
      </span>
      agréée par l'État. Il peut s'agir d'un établissement public foncier local,
      d'un bailleur social, d'une association loi 1901, d'un groupe d'intérêt public
      (GIP) ou d'une société coopérative d'intérêt collectif (SCIC).
    </p>
  </div>
</CalloutPanel>
