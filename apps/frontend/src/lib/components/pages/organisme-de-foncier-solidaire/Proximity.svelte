<script lang="ts">
  import BoxBlueOverlayed from '$components/common/ShadowedBox.svelte';
  import Alert from '$components/common/Alert.svelte';
</script>

<BoxBlueOverlayed>
  <h2>Un acteur de proximité</h2>
  <p>
    On dénombre plus de 155 organismes de foncier solidaire (OFS) agréés au 30
    Janvier 2025. Ils sont répartis sur le territoire: on trouve des organismes
    de foncier solidaire (OFS) dans toutes les régions de France métropolitaine.
    Des OFS sont également agréés en Martinique, Guyane…
  </p>
  <p>
    Certains couvrent une <b>commune ou une métropole</b>
    , d'autres ont un
    <b>rayonnement régional ou inter-régional.</b>
  </p>

  <Alert
    type="info"
    title="Vous cherchez un logement en BRS ?">
    <p>
      <a
        href="/logements-brs-disponibles"
        class="fr-link">
        Trouver un logement près de chez vous
      </a>
      en consultant la liste des sites qui proposent des logements en BRS à vendre.
    </p>
  </Alert>
</BoxBlueOverlayed>
