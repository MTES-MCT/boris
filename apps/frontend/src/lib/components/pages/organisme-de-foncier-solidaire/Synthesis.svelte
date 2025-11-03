<script lang="ts">
  import Promesses from '$components/common/StepPage/Promesses.svelte';

  import { default as MascotteCelebrating } from '$assets/icons/mascotte-celebrating.svg?raw';
  import Table from '$components/common/Table.svelte';
</script>

<div class="relative fr-mt-16w fr-pb-10w">
  <Promesses title="En résumé">
    <div>
      <div class="fr-col-12 fr-px-2w fr-px-md-4w">
        <div class="mascotte absolute">
          {@html MascotteCelebrating}
        </div>

        <Table
          multiline
          theads={["Rôle de l'OFS", "Pourquoi c'est important"]}
          tbodies={[
            [
              'Acquiert des terrains et en partage la propriété avec le ménage',
              'Réduit le coût du logement',
            ],
            [
              "Supervise les règles d'éligibilité et de revente, en accord avec la réglementation existante.",
              'Garantit la vocation sociale du dispositif',
            ],
            [
              'Perçoit une redevance mensuelle par les différents ménages propriétaires successifs du logement.',
              "Permet à l'OFS de rembourser son investissement initial correspondant à la baisse du prix du logement qu'il assume lors de la première vente.",
            ],
          ]} />
      </div>
      <p class="text-center fr-px-2w fr-px-md-4w">
        Vous avez encore des questions sur les OFS ou sur la manière dont
        fonctionne le Bail Réel Solidaire ? <a
          href="/tout-savoir-sur-le-bail-reel-solidaire-brs"
          class="fr-link">
          BoRiS vous accompagne pas à pas
        </a>
        pour mieux comprendre ce dispositif d'accession sociale à la propriété et
        faire les bons choix pour votre projet immobilier.
      </p>
      <p class="text-center fr-px-2w fr-px-md-4w fr-pb-4w">
        Votre OFS n'est pas listé ici ? <a
          href="/nous-contacter"
          class="fr-link">
          Contactez notre équipe
        </a>
        du ministère du logement.
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
