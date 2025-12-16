<script lang="ts">
  import ShadowedBox from '$components/common/ShadowedBox.svelte';
  import Tile from '$components/common/Tile.svelte';
</script>

<ShadowedBox hidePath>
  <h2>L'OFS, un acteur de proximité</h2>
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

  <Tile
    title="Vous cherchez un logement en BRS ?"
    pictogram="locationFrance"
    description="Trouvez un logement près de chez vous en consultant la carte du bail réel solidaire en France. Découvrez les villes où des logements en bail réel solidaire (BRS) sont en vente !"
    enlarge
    href="/logements-brs-disponibles" />
</ShadowedBox>
