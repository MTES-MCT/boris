<script lang="ts">
  import { default as MascotteWaving } from '$assets/icons/mascotte-waving.svg?raw';
</script>

<section>
  <div class="fr-container">
    <div
      class="relative fr-p-4w fr-mt-8w rounded-tl-xl rounded-tr-xl bg-white text-center shadow-sm lg:shadow-xl">
      <div class="absolute top-[-52px] left-1/6">
        {@html MascotteWaving}
      </div>

      <h2>Le simulateur d'éligibilité de BoRiS</h2>
      <p>
        Le bail réel solidaire (BRS) est un dispositif mis en place par l'État
        permettant à des ménages qui ne pourraient pas devenir propriétaires
        d'un logement au prix du marché d'accéder à la propriété de leur
        résidence principale. Le Bail Réel Solidaire s'adresse à des ménages
        dont les ressources ne dépassent pas un certain plafond : environ 87%
        des personnes résidant en France sont éligibles.
      </p>
      <p>
        Pour savoir si vous êtes éligible au Bail Réel Solidaire, il vous suffit
        de remplir le simulateur d'éligibilité de BoRiS. Vous aurez besoin de
        vos avis d'imposition des années (n-1 et n-2)/(n-2 et n-3)À CLARIFIER
        ICI].
      </p>
      <a
        href="/simulateur-eligibilite"
        class="fr-btn fr-btn--lg">
        Je lance ma simulation
      </a>
    </div>
  </div>
</section>
