<script lang="ts">
  import ShadowedBox from '$components/common/ShadowedBox.svelte';
  import Alert from '$components/common/Alert.svelte';
</script>

<ShadowedBox hidePath>
  <h2>Un acteur de proximité</h2>
  <p>
    On dénombre plus de 155 organismes de foncier solidaire (OFS) agréés au 30
    Janvier 2025. Ils sont répartis sur le territoire: on trouve des organismes
    de foncier solidaire (OFS) dans toutes les régions de France métropolitaine.
    Des organismes de foncier solidaire (OFS) sont également agréés en
    Martinique, Guyane…
  </p>
  <p>
    Certains organismes de foncier solidaire (OFS) couvrent une <b>
      commune ou une métropole
    </b>
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
        Trouvez un logement près de chez vous
      </a>
      en consultant la carte du bail réel solidaire en France. Découvrez les villes
      où des logements en bail réel solidaire (BRS) sont en vente !
    </p>
  </Alert>
</ShadowedBox>
