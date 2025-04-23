<script lang="ts">
  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import Details from '$components/common/Details.svelte';
  import Hero from '$components/pages/step-page/Hero.svelte';
  import Promesses from '$components/pages/step-page/Promesses.svelte';
  import Steps from '$components/pages/step-page/Steps.svelte';
  import PageCta from '$components/common/PageCta.svelte';
  import Promess from '$components/pages/step-page/Promess.svelte';
  import Step from '$components/pages/step-page/Step.svelte';
  import Warning from '$components/pages/step-page/Warning.svelte';
</script>

<svelte:head>
  <title>Tout savoir sur le BRS - Boris</title>
  <meta
    name="description"
    content="Découvrez le Bail Réel Solidaire (BRS), un dispositif qui permet d'accéder à la propriété à un prix abordable grâce à un partenariat avec des organismes fonciers solidaires. Apprenez-en plus sur ses avantages, critères et fonctionnement." />
</svelte:head>

<GradientBackgroundWrapper>
  <Hero title="Revendre mon bien en BRS">
    <p class="fr-mb-0">
      Vous souhaitez revendre votre bien en BRS ? BoRiS est là pour vous guider
      à chacune des phases ! Notre équipe du Ministère du logement peut même
      vous accompagner gratuitement dans ce projet. Cela vous intéresse ?
      Contactez-nous
      <a
        href="/nous-contacter"
        class="fr-link">
        ici
      </a>
      <br />
      <br />
      Sur cette page, vous découvrirez chaque étape jusqu’à la vente.
    </p>
  </Hero>

  <Promesses title="La revente en 3 points clés">
    <Promess>
      <p>
        <b>Vous êtes libre de vendre votre bien à tout moment.</b>
      </p>
      <p>
        Que ce soit pour changer de ville ou trouver un nouveau logement plus
        approprié à vos besoins, c’est vous qui décidez quand vous partez !
      </p>
    </Promess>
    <Promess>
      <p>
        <b>La revente d’un bien en BRS est encadrée :</b>
      </p>
      <p>
        Vous ne pouvez pas le vendre à n’importe qui : le ménage acheteur doit
        respecter les conditions d’éligibilité au BRS (c’est le cas de 87% des
        foyers !)
      </p>
      <p>
        Le prix de revente est encadré : vous pouvez faire une plus value à
        hauteur de l’inflation depuis votre achat. Le BRS est un dispositif non
        spéculatif.
      </p>
    </Promess>
    <Promess>
      <p>
        <b>Il faut impliquer l’OFS dans le processus.</b>
      </p>
      <p>
        D’abord parce qu’il a un droit de préemption (il peut racheter le bien
        avant qu’il soit proposé à d’autres personnes) ; ensuite parce qu’il
        doit donner son agrément ; parce qu’il doit être impliqué dans la
        rédaction du contrat de vente ; enfin parce qu’il peut vous aider à
        trouver un acheteur !
      </p>
    </Promess>
  </Promesses>

  <Steps>
    <Step
      title="Notifier l’Organisme de Foncier Solidaire (OFS) et déterminer votre prix de vente"
      position={1}>
      <p>
        Quand vous décidez de mettre en vente votre logement, prévenez tout de
        suite l’OFS avec qui vous avez contractualisé lors de l’achat.
      </p>

      <p>
        L’OFS a un droit de préemption, ce qui signifie qu’il peut racheter le
        bien avant que celui-ci ne soit proposé à d’autres acheteurs.
      </p>
      <p>
        De plus, l’OFS pourra vous indiquer le prix de vente maximum autorisé
        pour votre logement. Ce prix de vente est fixé en fonction de votre prix
        d’achat ainsi que de l’indice de référence fixé par l’INSEE. L’OFS
        pourra de plus vous accompagner dans la préparation de la cession.
      </p>
      <p>
        Pour préciser votre prix de vente, vous pouvez également consulter des
        professionnels de l’immobilier spécialisés en BRS.
      </p>
    </Step>
    <Step
      title="Préparer votre logement et le mettre en vente"
      position={2}>
      <p>
        Assurez-vous que le logement est en bon état et conforme aux normes en
        faisant réaliser les diagnostics obligatoires.
      </p>
      <Details summary="Voir la liste des diagnostics obligatoires">
        <ul>
          <li>
            <a
              href="https://www.service-public.fr/particuliers/vosdroits/F16096"
              class="fr-link"
              target="_blank"
              rel="noopener">
              Diagnostic de performance énergétique (DPE)
            </a>
            si la surface de plancher de la maison est supérieure ou égale à 50 m²
          </li>

          <li>
            <a
              href="https://www.service-public.fr/particuliers/vosdroits/F37110"
              class="fr-link"
              target="_blank"
              rel="noopener">
              Audit énergétique
            </a>
            si l'étiquette énergétique de la maison est E, F ou G sur le DPE
          </li>
          <li>
            <a
              href="https://www.service-public.fr/particuliers/vosdroits/F1142"
              class="fr-link"
              target="_blank"
              rel="noopener">
              Constat de risque d'exposition au plomb (Crep)
            </a>
            si la maison a été construite avant le 1er janvier 1949
          </li>
          <li>
            <a
              href="https://www.service-public.fr/particuliers/vosdroits/F742"
              class="fr-link"
              target="_blank"
              rel="noopener">
              État mentionnant la présence ou l'absence d'amiante
            </a>
            si le permis de construire de la maison a été délivré avant le 1er juillet
            1997
          </li>
          <li>
            <a
              href="https://www.service-public.fr/particuliers/vosdroits/F18692"
              class="fr-link"
              target="_blank"
              rel="noopener">
              État de l'installation intérieure de l'électricité
            </a>
            si l'installation a plus de 15 ans
          </li>
          <li>
            <a
              href="https://www.service-public.fr/particuliers/vosdroits/F18692"
              class="fr-link"
              target="_blank"
              rel="noopener">
              État de l'installation intérieure du gaz
            </a>
            si l'installation a plus de 15 ans
          </li>
          <li>
            <a
              href="https://www.service-public.fr/particuliers/vosdroits/F31685"
              class="fr-link"
              target="_blank"
              rel="noopener">
              Diagnostic assainissement des eaux usées
            </a>
            si la maison est équipée d'une installation autonome ou en cas d'installation
            collective et uniquement sur certains territoires ou s'il existe un arrêté
            municipal fixant cette obligation
          </li>
          <li>
            <a
              href="https://www.service-public.fr/particuliers/vosdroits/F3150"
              class="fr-link"
              target="_blank"
              rel="noopener">
              État relatif à la présence de termites
            </a>
            si la maison est située dans une zone déclarée par un arrêté préfectoral
            comme étant infestée par les termites ou pouvant l'être à court terme
          </li>
          <li>
            <a
              href="https://www.service-public.fr/particuliers/vosdroits/F12239"
              class="fr-link"
              target="_blank"
              rel="noopener">
              État des risques
            </a>
            si la maison est située dans une zone ou périmètre à risques (notamment
            risques naturels, miniers, sismiques, radon)
          </li>
          <li>
            <a
              href="https://www.service-public.fr/particuliers/vosdroits/F35266"
              class="fr-link"
              target="_blank"
              rel="noopener">
              Diagnostic Bruit
            </a>
            si la maison est située dans une zone dite
            <i>d'exposition au bruit des aéroports</i>
            car proche d'un aéroport
          </li>
          <li>
            <a
              href="https://www.service-public.fr/particuliers/vosdroits/F36759"
              class="fr-link"
              target="_blank"
              rel="noopener">
              Carnet d'information du logement (CIL)
            </a>
            si la maison a fait l'objet d'un permis de construire ou d'une déclaration
            préalable de travaux déposé(e) à partir du 1er janvier 2023 ou si elle
            a fait l'objet de travaux de rénovation depuis cette date.
          </li>
        </ul>
      </Details>
      <p>
        Ça vous paraît beaucoup ? Ne vous inquiétez pas, ces diagnostics sont
        réalisés par un expert indépendant qui fera tout d’un coup ! Vous pouvez
        trouver un diagnostiqueur immobilier certifié en <a
          href="https://diagnostiqueurs.din.developpement-durable.gouv.fr/index.action"
          class="fr-link"
          target="_blank"
          rel="noopener">
          cliquant ici
        </a>
        .
      </p>
      <p>
        En fonction des résultats, vous pourrez devoir faire quelques travaux
        pour remettre le logement en bon état et conforme aux normes. N’hésitez
        pas également à faire de petites réparations ou un coup de peinture sur
        les murs abîmés pour rendre le logement le plus attrayant possible pour
        les acheteurs.
      </p>
    </Step>
    <Step
      title="Trouvez un acheteur"
      position={3}>
      <p>
        Comme dans le cas d’une vente d’un appartement dans le marché libre,
        l’étape cruciale est de trouver un acheteur ! La seule différence est
        que celui-ci doit être éligible au BRS. Cette éligibilité peut être
        vérifiée rapidement en utilisant notre simulateur . Celle-ci devra
        ensuite être vérifiée officiellement par l’OFS.
      </p>
      <a
        href="/simulateur-eligibilite"
        class="fr-btn fr-btn--lg">
        Simuler mon éligibilité
      </a>
      <p></p>
      <p>
        Votre acheteur achète dans les mêmes conditions que vous à l’époque : il
        faut que ce logement devienne sa résidence principale, sa plus-value
        sera encadrée et il devra payer une redevance mensuelle auprès de l’OFS.
        Mais il a aussi le même avantage principal : il achète un logement
        beaucoup moins cher que le prix du marché !
      </p>
      <p>Pour trouver l’acheteur, vous avez deux options :</p>
      <p>
        <b>Option 1 : la vente entre particuliers.</b>
        Vous faites vous-même une annonce (sur des sites comme
        <a
          href="http://leboncoin.fr"
          class="fr-link"
          target="_blank"
          rel="noopener">
          leboncoin.fr
        </a>
        ou
        <a
          href="http://entreparticuliers.com"
          class="fr-link"
          target="_blank"
          rel="noopener">
          entreparticuliers.com
        </a>
        par exemple), vous organisez les visites, et vous vous rendez ensemble chez
        le notaire ! Environ 30% des ventes en France s’effectuent en direct.
      </p>
      <p>
        <b>Option 2 : faire appel à un professionnel de l’immobilier.</b>
        Comme 70% des ménages, vous pouvez choisir de passer par un professionnel
        de l’immobilier pour commercialiser votre bien à votre place. Demandez à
        votre OFS s’il a des contacts à vous partager : il est important de choisir
        un agent qui connaît le BRS et pourra l’expliquer aux acheteurs potentiels.
        L’intérêt de cette solution, c’est de gagner du temps sur la vente et de
        toucher plus de ménages potentiels via les outils réservés aux professionnels.
        L’inconvénient, c’est que cette prestation a un coût : en moyenne entre 4%
        et 6% du prix de vente.
      </p>
    </Step>
    <Step
      title="Rédigez votre offre préalable de cession et vérifiez que tout est bon avec votre Organisme de Foncier Solidaire"
      position={4}>
      <p>
        Une fois que vous avez trouvé un acheteur, vous devez lui faire une
        offre préalable de cession, qui précise toutes les modalités de l’achat
        en BRS. Un conseil, faites vous-aider par votre OFS ! Nous pouvons
        également vous accompagner dans cette démarche, alors n’hésitez pas à
        nous contacter.
      </p>
      <a
        href="/nous-contacter"
        class="fr-btn fr-btn--lg">
        Nous contacter
      </a>
      <p></p>
      <p>
        Une fois l’offre préalable de cession faite à l’acquéreur, votre OFS
        doit se charger de vérifier que celui-ci est bien éligible au dispositif
        et que votre offre de cession remplit les conditions nécessaires à la
        conclusion d’un Bail Réel Solidaire. Dans ce cas, on dit que l’OFS donne
        son agrément.
      </p>
      <p>
        En cas de refus d’agrément de la part de l’OFS, vous pouvez lui demander
        de vous présenter des acquéreurs potentiels éligibles au dispositif.
      </p>
    </Step>
    <Step
      title="Passez devant le notaire pour finaliser la vente"
      position={5}
      isLast>
      <p>
        Une personne ayant visité votre logement a accepté votre offre de
        cession ? Félicitations !
      </p>
      <p>
        Vous devez maintenant vous rendre chez le notaire pour signer la
        promesse de vente. Le notaire s’assure que toutes les conditions légales
        sont remplies et vous vous mettez d’accord avec l’acheteur sur les
        éventuelles conditions suspensives (par exemple, la vente ne se fera pas
        si l’acheteur n’obtient pas son prêt à la banque).
      </p>
      <p>
        Une fois cette promesse signée, vous ne pouvez plus annuler la vente.
        L’acheteur, lui, a 10 jours pour éventuellement se rétracter.
      </p>
      <p>
        L’étape suivante, c’est la signature de l’acte de vente, qui finalise la
        transaction. En général, il y a un délai maximum de 3 mois entre la
        signature de la promesse et celle de l’acte définitif, mais ce délai
        peut être aménagé à la baisse ou à la hausse en vous mettant d’accord
        avec l’acheteur. Cette période permet à l’acheteur d’obtenir son prêt
        bancaire et au notaire de préparer tous les documents nécessaires.
      </p>
      <p>
        Au moment de la signature, vous devez remettre à l’acheteur toutes les
        clefs du logement et les informations dont il pourrait avoir besoin
        (travaux effectués, informations pour souscrire à un abonnement
        d’électricité et d’eau, etc.). À compter de ce moment, vous n’êtes plus
        propriétaire ! Vous recevrez les fonds issus de la vente sur votre
        compte bancaire sous quelques jours.
      </p>
    </Step>
  </Steps>
  <Warning title="Que se passe-t-il si je ne trouve pas d’acheteur ?">
    <p>
      Lorsque vous avez acheté votre bien, vous avez peut-être remarqué une
      clause de garantie de rachat dans votre contrat.
    </p>
    <p class="fr-m-0">
      En effet, l’OFS s’engage à racheter le bien immobilier en cas de départ
      définitif (ou de non-respect des conditions d’occupation). C’est
      sécurisant pour vous mais attention : le prix de rachat est fixé lors de
      la signature du contrat. La plupart du temps, vous avez plutôt intérêt à
      chercher un acheteur directement qui puisse vous racheter le bien à un
      meilleur prix.
    </p>
  </Warning>
  <PageCta />
</GradientBackgroundWrapper>
