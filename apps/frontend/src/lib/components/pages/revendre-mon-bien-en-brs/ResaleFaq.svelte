<script lang="ts">
  import Accordion from '$components/common/Accordion.svelte';
</script>

<article
  id="faq-etape-1"
  class="!pb-8 border-b border-gray-light">
  <h2 class="fr-h5 pt-12">
    FAQ · Étape 1 · Notifier l’OFS et préciser le plafond applicable au prix de
    revente
  </h2>

  <Accordion
    label="Quand dois-je prévenir mon OFS ?"
    labelElement="h4">
    <p class="fr-mt-1w">
      Dès que vous décidez de vendre, avant même de diffuser une annonce. Cette
      notification est obligatoire : l’OFS dispose d’un droit de préemption
      (Art. L255-15 du Code de la construction et de l’habitation) et fixe le
      prix de vente maximum autorisé. Sans cette étape, la vente peut être
      frappée de nullité.
    </p>
  </Accordion>

  <Accordion
    label="Comment est calculé le prix de vente maximum de mon bien en BRS ?"
    labelElement="h4">
    <p class="fr-mt-1w">
      Le prix est plafonné par la formule inscrite dans <b>votre bail</b>
      signé chez le notaire au moment de l’achat. Il s’appuie sur votre prix d’achat
      actualisé selon un indice de référence (généralement INSEE). C’est votre OFS
      qui calcule et vous communique ce prix maximum. Le BRS étant un dispositif
      non spéculatif, vous ne pouvez pas vendre au-dessus.
    </p>
  </Accordion>

  <Accordion
    label="Puis-je faire une plus-value ? Vendre à perte ?"
    labelElement="h4">
    <p class="fr-mt-1w">
      Une plus-value est possible mais encadrée par votre bail : elle est
      généralement indexée sur l’inflation depuis votre achat. Vous pouvez aussi
      vendre en dessous du prix maximum si vous le souhaitez. Au-dessus du
      plafond, c’est interdit.
    </p>
  </Accordion>

  <Accordion
    label="Mon OFS peut-il racheter le bien lui-même ?"
    labelElement="h4">
    <p class="fr-mt-1w">
      Oui. L’OFS dispose d’un <b>droit de préemption</b>
      (Art. L255-15 CCH). Il a deux mois après réception de l’offre préalable de
      cession pour décider de l’exercer, soit pour son propre compte, soit pour un
      acquéreur éligible qu’il propose. S’il préempte, vous êtes indemnisé selon
      les modalités du bail dans la limite du prix maximum.
    </p>
  </Accordion>
</article>

<article
  id="faq-etape-2"
  class="!pb-8 border-b border-gray-light">
  <h2 class="fr-h5 pt-12">FAQ · Étape 2 · Préparer le logement</h2>

  <Accordion
    label="Quels diagnostics sont obligatoires ?"
    labelElement="h4">
    <p class="fr-mt-1w">
      Les mêmes que pour toute vente immobilière, selon les caractéristiques du
      logement :
    </p>
    <ul>
      <li>
        <a
          href="https://www.service-public.fr/particuliers/vosdroits/F16096"
          class="fr-link"
          target="_blank"
          rel="noopener">
          Diagnostic de performance énergétique (DPE)
        </a>
        · surface ≥ 50 m²
      </li>
      <li>
        <a
          href="https://www.service-public.fr/particuliers/vosdroits/F37110"
          class="fr-link"
          target="_blank"
          rel="noopener">
          Audit énergétique
        </a>
        · étiquette E, F ou G au DPE
      </li>
      <li>
        <a
          href="https://www.service-public.fr/particuliers/vosdroits/F1142"
          class="fr-link"
          target="_blank"
          rel="noopener">
          Constat de risque d’exposition au plomb (CREP)
        </a>
        · bâti avant le 1er janvier 1949
      </li>
      <li>
        <a
          href="https://www.service-public.fr/particuliers/vosdroits/F742"
          class="fr-link"
          target="_blank"
          rel="noopener">
          Présence ou absence d’amiante
        </a>
        · permis avant le 1er juillet 1997
      </li>
      <li>
        <a
          href="https://www.service-public.fr/particuliers/vosdroits/F18692"
          class="fr-link"
          target="_blank"
          rel="noopener">
          État de l’installation électrique
        </a>
        · installation de plus de 15 ans
      </li>
      <li>
        <a
          href="https://www.service-public.fr/particuliers/vosdroits/F18692"
          class="fr-link"
          target="_blank"
          rel="noopener">
          État de l’installation gaz
        </a>
        · installation de plus de 15 ans
      </li>
      <li>
        <a
          href="https://www.service-public.fr/particuliers/vosdroits/F31685"
          class="fr-link"
          target="_blank"
          rel="noopener">
          Diagnostic assainissement
        </a>
        · installations autonomes ou territoires concernés
      </li>
      <li>
        <a
          href="https://www.service-public.fr/particuliers/vosdroits/F3150"
          class="fr-link"
          target="_blank"
          rel="noopener">
          État relatif à la présence de termites
        </a>
        · zone déclarée par arrêté préfectoral
      </li>
      <li>
        <a
          href="https://www.service-public.fr/particuliers/vosdroits/F12239"
          class="fr-link"
          target="_blank"
          rel="noopener">
          État des risques
        </a>
        · zone à risques (naturels, miniers, sismiques, radon)
      </li>
      <li>
        <a
          href="https://www.service-public.fr/particuliers/vosdroits/F35266"
          class="fr-link"
          target="_blank"
          rel="noopener">
          Diagnostic bruit
        </a>
        · zone d’exposition au bruit des aéroports
      </li>
      <li>
        <a
          href="https://www.service-public.fr/particuliers/vosdroits/F36759"
          class="fr-link"
          target="_blank"
          rel="noopener">
          Carnet d’information du logement (CIL)
        </a>
        · permis ou travaux après le 1er janvier 2023
      </li>
    </ul>
    <p>
      Un diagnostiqueur certifié réalise tout en une fois. Vous pouvez en
      trouver un sur l’
      <a
        href="https://diagnostiqueurs.din.developpement-durable.gouv.fr/index.action"
        class="fr-link"
        target="_blank"
        rel="noopener">
        annuaire officiel
      </a>
      .
    </p>
  </Accordion>

  <Accordion
    label="Faut-il faire des travaux avant de vendre ?"
    labelElement="h4">
    <p class="fr-mt-1w">
      Selon les résultats des diagnostics, certains travaux peuvent être
      nécessaires pour mettre le logement aux normes. Au-delà de l’obligatoire,
      quelques petites réparations ou un coup de peinture sur les murs abîmés
      rendent le logement plus attrayant pour les acheteurs et facilitent la
      vente.
    </p>
  </Accordion>
</article>

<article
  id="faq-etape-3"
  class="!pb-8 border-b border-gray-light">
  <h2 class="fr-h5 pt-12">
    FAQ · Étape 3 · Trouver un acheteur éligible au bail réel solidaire
  </h2>

  <Accordion
    label="Qui peut acheter mon logement ?"
    labelElement="h4">
    <p class="fr-mt-1w">
      Tout ménage qui respecte les conditions d’éligibilité au BRS : <a
        href="/simulateur-eligibilite#plafonds-de-ressources"
        class="fr-link">
        plafonds de ressources
      </a>
      (Art. L255-2 et L255-3 CCH) et engagement à en faire sa résidence principale.
      Environ 87 % des foyers français sont éligibles au bail réel solidaire. Vous
      pouvez vérifier rapidement l’éligibilité avec
      <a
        href="/simulateur-eligibilite"
        class="fr-link">
        notre simulateur
      </a>
      , mais c’est l’OFS qui valide officiellement.
    </p>
  </Accordion>

  <Accordion
    label="Vente entre particuliers ou via une agence ?"
    labelElement="h4">
    <p class="fr-mt-1w">Les deux options sont possibles :</p>
    <ul>
      <li>
        <b>Entre particuliers</b>
        (≈ 30 % des ventes en France) : vous gérez vous-même annonce, visites et
        négociation. Pas de frais d’agence, mais plus de temps et d’énergie.
      </li>
      <li>
        <b>Via une agence</b>
        (≈ 70 % des ventes) : gain de temps, accès aux outils professionnels. Coût
        moyen de
        <b>4 à 6 % du prix de vente</b>
        .
      </li>
    </ul>
    <p>
      Si vous passez par une agence, choisissez-en une qui connaît le BRS.
      Beaucoup ne maîtrisent pas le dispositif et peinent à l’expliquer aux
      acheteurs potentiels. Votre OFS pourra souvent vous conseiller sur ce
      sujet.
    </p>
  </Accordion>

  <Accordion
    label="Mon OFS peut-il m’aider à trouver un acheteur ?"
    labelElement="h4">
    <p class="fr-mt-1w">Oui, c’est l’une de ses missions. Demandez-lui :</p>
    <ul>
      <li>
        les agences immobilières partenaires connaissant le BRS dans votre
        territoire ;
      </li>
      <li>s’il a une liste de ménages déjà agréés cherchant un bien ;</li>
      <li>
        s’il peut diffuser votre annonce sur ses canaux (site web, newsletter).
      </li>
    </ul>
  </Accordion>

  <Accordion
    label="Mon acheteur peut-il bénéficier du PTZ ? Quels seront ses frais de notaire ?"
    labelElement="h4">
    <ul class="fr-mt-1w">
      <li>
        <b>Prêt à taux zéro</b>
        : non, sauf si le logement a moins de 5 ans et n’a jamais été occupé (cas
        du neuf). Pour une revente entre particuliers d’un BRS déjà occupé, le PTZ
        n’est pas mobilisable.
      </li>
      <li>
        <b>Frais de notaire</b>
        : ceux de l’ancien, soit
        <b>7 à 8 % du prix d’acquisition</b>
        (alors qu’ils sont réduits dans le neuf).
      </li>
    </ul>
    <p>À mentionner clairement à votre acheteur dès le départ.</p>
  </Accordion>
</article>

<article
  id="faq-etape-4"
  class="!pb-8 border-b border-gray-light">
  <h2 class="fr-h5 pt-12">
    FAQ · Étape 4 · Remettre l’offre préalable de cession
  </h2>

  <Accordion
    label="Qu’est-ce que l’offre préalable de cession ?"
    labelElement="h4">
    <p class="fr-mt-1w">
      C’est un document obligatoire (Art. L255-10 CCH) que vous remettez à
      l’acheteur <b>avant</b>
      la promesse de vente. Il précise notamment :
    </p>
    <ul>
      <li>le caractère temporaire du droit réel et sa date d’extinction ;</li>
      <li>la nouvelle durée du bail si l’OFS donne son agrément ;</li>
      <li>les conditions de délivrance de l’agrément par l’OFS ;</li>
      <li>les modalités de calcul du prix de vente prévues au bail.</li>
    </ul>
    <p>
      Vous pouvez télécharger un <a
        href="https://docs.google.com/document/d/1iEUKObH-4JPEYVzrpI50M3LTN9yl65KE/edit?tab=t.0#bookmark=id.taxh8lmhokue"
        class="fr-link"
        target="_blank"
        rel="noopener">
        modèle d’offre préalable de cession
      </a>
      et vous faire aider par votre OFS pour la rédiger.
    </p>
  </Accordion>

  <Accordion
    label="Quels délais respecter ?"
    labelElement="h4">
    <p class="fr-mt-1w">Trois délais à connaître (Art. L255-10 CCH) :</p>
    <ul>
      <li>
        vous devez <b>maintenir votre offre pendant 30 jours minimum</b>
        à compter de sa réception par l’acheteur ;
      </li>
      <li>
        l’acheteur <b>ne peut pas l’accepter avant 10 jours</b>
        après réception ;
      </li>
      <li>
        une fois l’offre acceptée, vous avez <b>30 jours pour informer l’OFS</b>
        et solliciter l’agrément, en joignant les pièces d’éligibilité de l’acheteur
        et le dossier de diagnostic immobilier.
      </li>
    </ul>
  </Accordion>
</article>

<article
  id="faq-etape-5"
  class="!pb-8 border-b border-gray-light">
  <h2 class="fr-h5 pt-12">FAQ · Étape 5 · Obtenir l’agrément de l’OFS</h2>

  <Accordion
    label="Combien de temps l’OFS a-t-il pour donner son agrément ?"
    labelElement="h4">
    <p class="fr-mt-1w">
      <b>Deux mois</b>
      à compter de la transmission de l’offre préalable de cession (Art. L255-11
      CCH).
    </p>
  </Accordion>

  <Accordion
    label="Sur quoi porte l’agrément ?"
    labelElement="h4">
    <p class="fr-mt-1w">L’OFS vérifie trois points (Art. L255-11 CCH) :</p>
    <ol>
      <li>
        l’
        <b>éligibilité</b>
        de l’acheteur (plafonds de ressources, résidence principale) ;
      </li>
      <li>
        la <b>conformité</b>
        de l’offre préalable avec le bail en vigueur, notamment le respect du prix
        de vente plafonné ;
      </li>
      <li>
        la <b>validité du plan de financement</b>
        de l’acheteur.
      </li>
    </ol>
  </Accordion>

  <Accordion
    label="Mon OFS a refusé l’acheteur. Pourquoi et que faire ?"
    labelElement="h4">
    <p class="fr-mt-1w">
      Le refus porte nécessairement sur l’un des trois critères ci-dessus.
      Demandez à l’OFS la motivation précise par écrit, puis vous avez trois
      options (Art. L255-13 CCH) :
    </p>
    <ol>
      <li>
        <b>trouver un nouvel acheteur</b>
        et le soumettre à agrément ;
      </li>
      <li>
        <b>demander à l’OFS de vous proposer un acquéreur éligible</b>
        . Il dispose alors de 6 mois ;
      </li>
      <li>
        si après ces 6 mois l’OFS n’a pas trouvé, <b>
          demander la résiliation conventionnelle du bail
        </b>
        (voir étape 7).
      </li>
    </ol>
  </Accordion>

  <Accordion
    label="Le bail repart-il à zéro pour mon acheteur ?"
    labelElement="h4">
    <p class="fr-mt-1w">
      Oui. Si l’OFS donne son agrément, la durée du bail est <b>
        prorogée de plein droit
      </b>
      pour que le nouveau preneur bénéficie d’une durée identique à celle prévue
      dans le contrat initial (Art. L255-12 CCH). C’est ce qu’on appelle le caractère
      « rechargeable » du BRS.
    </p>
  </Accordion>
</article>

<article
  id="faq-etape-6"
  class="!pb-8 border-b border-gray-light">
  <h2 class="fr-h5 pt-12">FAQ · Étape 6 · Signer chez le notaire</h2>

  <Accordion
    label="Comment se passe la signature ?"
    labelElement="h4">
    <p class="fr-mt-1w">Deux étapes successives :</p>
    <ol>
      <li>
        <b>La promesse de vente</b>
        : vous êtes engagé. L’acheteur dispose de 10 jours pour se rétracter.
      </li>
      <li>
        <b>L’acte authentique</b>
        : généralement 3 mois après la promesse, délai aménageable. Cette période
        permet à l’acheteur d’obtenir son prêt et au notaire de préparer les documents.
      </li>
    </ol>
    <p>
      À la signature de l’acte, vous remettez les clés et n’êtes plus
      propriétaire des droits réels. Les fonds vous parviennent sous quelques
      jours.
    </p>
  </Accordion>

  <Accordion
    label="Quels frais sont à ma charge ?"
    labelElement="h4">
    <ul class="fr-mt-1w">
      <li>
        les <b>diagnostics obligatoires</b>
        ;
      </li>
      <li>
        les <b>honoraires d’agence</b>
        si vous passez par un professionnel (4 à 6 % du prix) ;
      </li>
      <li>
        d’éventuelles <b>indemnités de remboursement anticipé</b>
        si vous soldez un prêt. À vérifier avec votre banque.
      </li>
    </ul>
    <p>
      Les frais de notaire sont, comme dans toute vente classique,
      essentiellement à la charge de l’acheteur.
    </p>
  </Accordion>

  <Accordion
    label="Quelle fiscalité sur la vente ?"
    labelElement="h4">
    <p class="fr-mt-1w">
      La vente d’un bien en BRS suit le régime fiscal général : exonération de
      plus-value immobilière dans la plupart des cas pour une résidence
      principale. Confirmez votre situation avec votre notaire.
    </p>
  </Accordion>
</article>

<article
  id="faq-etape-7"
  class="!pb-8 border-b border-gray-light">
  <h2 class="fr-h5 pt-12">FAQ · Étape 7 · En cas de blocage</h2>

  <Accordion
    label="Je n’arrive pas à trouver d’acheteur depuis plusieurs mois. Que faire ?"
    labelElement="h4">
    <p class="fr-mt-1w">Dans l’ordre :</p>
    <ol>
      <li>
        <b>Faites le point avec votre OFS</b>
        : votre prix est-il bien positionné par rapport au marché local ? L’annonce
        est-elle suffisamment diffusée ?
      </li>
      <li>
        <b>Demandez la liste de ses agences partenaires</b>
        spécialisées BRS et sa liste éventuelle d’acquéreurs éligibles en attente.
      </li>
      <li>
        <b>Élargissez la diffusion</b>
        : Leboncoin, Entreparticuliers, agences locales, bouche-à-oreille.
      </li>
      <li>
        Si rien ne bouge malgré ces démarches, <b>
          demandez formellement à l’OFS de vous proposer un acquéreur éligible
        </b>
        (Art. L255-13 CCH). À partir de cette demande, l’OFS dispose de 6 mois.
      </li>
    </ol>
  </Accordion>

  <Accordion
    label="Qu’est-ce que la résiliation conventionnelle du bail ?"
    labelElement="h4">
    <p class="fr-mt-1w">
      C’est un mécanisme prévu par la loi (Art. L255-13 CCH) pour les situations
      bloquées : si après refus d’agrément ou demande explicite, l’OFS n’a pas
      trouvé d’acquéreur sous 6 mois, vous pouvez convenir avec lui de mettre
      fin au bail. Vous êtes alors <b>
        indemnisé de la valeur de vos droits réels immobiliers
      </b>
      , selon les modalités prévues dans votre bail.
    </p>
  </Accordion>

  <Accordion
    label="Combien vais-je toucher ?"
    labelElement="h4">
    <p class="fr-mt-1w">
      L’indemnisation correspond à la valeur de vos droits réels immobiliers
      calculée selon <b>les modalités prévues dans votre bail</b>
      . La loi ne fixe pas de barème unique.
    </p>
    <blockquote
      class="border-l-4 border-[var(--border-default-blue-france)] pl-4">
      <p>
        <b>Point d’attention</b>
        : ce montant est très souvent
        <b>inférieur à votre prix d’achat</b>
        , parfois nettement. Avant d’engager la procédure, demandez à votre OFS un
        calcul prévisionnel précis pour décider en connaissance de cause.
      </p>
    </blockquote>
  </Accordion>

  <Accordion
    label="Comment lance-t-on la procédure ?"
    labelElement="h4">
    <ol class="fr-mt-1w">
      <li>
        Demande écrite à l’OFS (lettre recommandée avec accusé de réception
        conseillée).
      </li>
      <li>
        Échanges avec l’OFS pour calculer l’indemnisation selon les modalités du
        bail.
      </li>
      <li>Signature de l’accord de résiliation chez le notaire.</li>
      <li>
        Versement de l’indemnisation selon les modalités prévues dans le bail.
      </li>
    </ol>
  </Accordion>

  <Accordion
    label="Mon OFS est aussi un bailleur social. Cela change-t-il quelque chose ?"
    labelElement="h4">
    <p class="fr-mt-1w">
      Pas dans la procédure légale. Elle reste celle décrite par les articles
      L255-10 à L255-15 CCH, identique pour tous les OFS. <b>
        Votre bail particulier
      </b>
      peut toutefois prévoir des clauses de rachat plus favorables si l’OFS-bailleur
      a souhaité offrir une garantie supplémentaire. À vérifier dans votre bail et
      à demander à votre OFS. Ce n’est pas automatique.
    </p>
  </Accordion>
</article>

<article
  id="faq-cas-particuliers"
  class="!pb-8 border-b border-gray-light">
  <h2 class="fr-h5 pt-12">FAQ · Cas particuliers</h2>

  <Accordion
    label="Que se passe-t-il en cas de décès ?"
    labelElement="h4">
    <p class="fr-mt-1w">
      Les droits réels sont transmis à l’ayant droit, qui bénéficie d’un bail
      prorogé à durée identique, s’il est éligible au BRS (Art. L255-14 CCH). Le
      conjoint et le partenaire de PACS ne sont <b>
        pas soumis aux conditions d’éligibilité
      </b>
      .
    </p>
    <p>
      Si l’ayant droit n’est pas éligible, il dispose de <b>12 mois</b>
      pour vendre à un acquéreur éligible au bail réel solidaire et agréé. À défaut,
      le bail est résilié et l’ayant droit est indemnisé selon les modalités du bail.
    </p>
  </Accordion>

  <Accordion
    label="Et en cas de divorce ou séparation ?"
    labelElement="h4">
    <p class="fr-mt-1w">
      Le BRS reste un bien immobilier comme un autre dans la liquidation : soit
      l’un des conjoints rachète la part de l’autre (avec accord de l’OFS sur le
      maintien d’éligibilité), soit le bien est revendu selon la procédure
      standard. À traiter avec votre notaire et votre OFS très en amont.
    </p>
  </Accordion>
</article>
