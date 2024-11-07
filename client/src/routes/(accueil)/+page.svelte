<script lang="ts">
  import Section from '$components/section/section.svelte';
</script>

<svelte:head>
  <title>Boris</title>
</svelte:head>

<Section
  title="Simuler mon éligibilité"
  titleElement="h1">
  <p>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam dolore
    doloribus nisi, quos vero voluptatibus! Debitis ducimus hic illo minima
    mollitia non quas quis quod ratione recusandae velit voluptas, voluptates.
  </p>

  <a
    href="/simuler-mon-eligibilite"
    class="fr-btn fr-btn--lg">
    Simuler mon éligibilité
  </a>
</Section>

<Section
  title="Organismes fonciers solidaires"
  titleElement="h2"
  backgroundClass="fr-background-contrast--blue-cumulus">
  <p>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam dolore
    doloribus nisi, quos vero voluptatibus! Debitis ducimus hic illo minima
    mollitia non quas quis quod ratione recusandae velit voluptas, voluptates.
  </p>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium animi
    error et maxime optio. Aliquam aut autem, dolor eveniet harum id, impedit
    minima porro possimus praesentium, provident quia quos voluptates?
  </p>

  <a
    href="/organismes-fonciers-solidaires"
    class="fr-btn fr-btn--secondary">
    Voir la liste des organismes fonciers solidaires
  </a>
</Section>

<Section
  title="Le Bail Réel Solidaire ?"
  titleElement="h2"
  backgroundClass="fr-background-alt--red-marianne">
  <p>
    Le bail réel solidaire (BRS) est un dispositif d’accession sociale à la
    propriété. Il permet à des ménages sous plafond de ressources de devenir
    propriétaire d’un logement et ce, à un prix abordable.
  </p>
  <p>
    Le principe du bail réel solidaire (BRS) repose sur la dissociation du
    foncier et du bâti : vous achetez uniquement le logement tandis qu'un
    Organisme de Foncier Solidaire (OFS) agréé par l'Etat garde la propriété du
    terrain.
  </p>
  <p>
    Vous n’achetez donc que la partie bâtie du logement, ce qui représente entre
    30 % à 50 % d’économie lors de l'achat.
  </p>
  <p>
    En contrepartie, vous vous engagez à vivre dans votre logement au titre de
    votre résidence principale.
  </p>
  <p>
    Vous devez par ailleurs vous acquitter une faible redevance mensuelle auprès
    de l'OFS.
  </p>

  <a
    href="/tout-savoir-sur-le-BRS"
    class="fr-btn fr-btn--secondary">
    Tout connaître sur le bail réel solidaire
  </a>
</Section>
