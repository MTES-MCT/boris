<script>
  import Section from '$components/section/section.svelte';
</script>

<svelte:head>
  <title>Boris - Accessibilité</title>
</svelte:head>

<Section
  title="Déclaration d’accessibilité"
  titleElement="h1">
  <p>
    Établie le
    <span>19 novembre 2024</span>
    .
  </p>
  <p>
    <span>Le Ministère chargé du logement</span>
    s’engage à rendre son service accessible, conformément à l’article 47 de la loi
    n° 2005-102 du 11 février 2005.
  </p>
  <p>
    Cette déclaration d’accessibilité s’applique à
    <strong>Boris</strong>
    <span>
      (
      <span>boris.beta.gouv.fr</span>
      )
    </span>
    .
  </p>
  <h2>État de conformité</h2>
  <p>
    <strong>Boris</strong>
    est
    <strong><span data-printfilter="lowercase">non conforme</span></strong>
    avec le
    <abbr title="Référentiel général d’amélioration de l’accessibilité">
      RGAA
    </abbr>
    .
    <span>
      Le site n’a encore pas été audité.
      <br />
    </span>
  </p>
  <h2>Contenus non accessibles</h2>
  <p>
    Les contenus listés ci-dessous ne sont pas accessibles pour les raisons
    suivantes.
  </p>
  <h3>Non conformité</h3>
  <p>
    Malgré nos efforts, certains contenus sont inaccessibles. Vous trouverez
    ci-dessous une liste des limitations connues et des solutions
    potentielles&nbsp;:
  </p>
  <ol class="technical-information accessibility-limitations">
    <li>
      <strong>Simulateur d'éligibilité</strong>
      :parce que nous ne pouvons garantir le respect de l'accessibilité du chatbot.
      . .
    </li>
  </ol>
  <h2>Établissement de cette déclaration d’accessibilité</h2>
  <p>
    Cette déclaration a été établie le
    <span>19 novembre 2024</span>
    .
  </p>
  <h3>Technologies utilisées</h3>
  <p>
    L’accessibilité de
    <span>Boris</span>
    s’appuie sur les technologies suivantes&nbsp;:
  </p>
  <ul class="technical-information technologies-used">
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
  </ul>
  <h2>Amélioration et contact</h2>
  <p>
    Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez
    contacter le responsable de
    <span>Boris</span>
    pour être orienté vers une alternative accessible ou obtenir le contenu sous
    une autre forme.
  </p>
  <ul class="basic-information feedback h-card">
    <li>
      E-mail&nbsp;:
      <a href="mailto:boris@beta.gouv.fr">boris@beta.gouv.fr</a>
    </li>
  </ul>
  <h2>Voie de recours</h2>
  <p>
    Cette procédure est à utiliser dans le cas suivant&nbsp;: vous avez signalé
    au responsable du site internet un défaut d’accessibilité qui vous empêche
    d’accéder à un contenu ou à un des services du portail et vous n’avez pas
    obtenu de réponse satisfaisante.
  </p>
  <p>Vous pouvez&nbsp;:</p>
  <ul>
    <li>
      Écrire un message au
      <a href="https://formulaire.defenseurdesdroits.fr/">
        Défenseur des droits
      </a>
    </li>
    <li>
      Contacter
      <a href="https://www.defenseurdesdroits.fr/saisir/delegues">
        le délégué du Défenseur des droits dans votre région
      </a>
    </li>
    <li>
      Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre)&nbsp;:
      <br />
      Défenseur des droits
      <br />
      Libre réponse 71120 75342 Paris CEDEX 07
    </li>
  </ul>
  <hr />
  <p>
    Cette déclaration d’accessibilité a été créé le
    <span>19 novembre 2024</span>
    grâce au
    <a href="https://betagouv.github.io/a11y-generateur-declaration/#create">
      Générateur de Déclaration d’Accessibilité de BetaGouv
    </a>
    .
  </p>
</Section>
