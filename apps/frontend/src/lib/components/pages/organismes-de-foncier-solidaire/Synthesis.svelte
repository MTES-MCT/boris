<script lang="ts">
  import CalloutPanel from '$components/common/Panels/CalloutPanel.svelte';

  import Table from '$components/common/Table.svelte';
  import Section from '$components/common/Section.svelte';
</script>

<CalloutPanel
  title="En résumé"
  mascotte="MascotteCelebrating">
  <div class="fr-col-12 table-container">
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
  <div class="content">
    <p>
      Vous avez encore des questions sur les OFS ou sur la manière dont
      fonctionne le Bail Réel Solidaire ? <a
        href="/tout-savoir-sur-le-bail-reel-solidaire-brs"
        class="fr-link">
        BoRiS vous accompagne pas à pas
      </a>
      pour mieux comprendre ce dispositif d'accession sociale à la propriété et faire
      les bons choix pour votre projet immobilier.
    </p>
    <p>
      Votre OFS n'est pas listé ici ? <a
        href="/nous-contacter"
        class="fr-link">
        Contactez notre équipe
      </a>
      du ministère du logement.
    </p>
  </div>
</CalloutPanel>

<style lang="postcss">
  .table-container {
    @media (--sm-viewport) {
      padding-inline: 2rem;
    }
  }

  .content {
    text-align: center;
    padding-bottom: 2rem;
  }
</style>
