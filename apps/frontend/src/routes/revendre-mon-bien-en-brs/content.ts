import type { Step } from '$lib/utils/definitions';

const step1 = {
  title: 'Revendre mon bien en BRS',
  slug: 'revendre-mon-bien-en-brs',
  description:
    'Découvrez les étapes clés pour revendre votre logement en Bail Réel Solidaire (BRS). BoRiS vous guide dans ce processus encadré : conditions d’éligibilité des acheteurs, prix plafonné, rôle de l’OFS, diagnostics obligatoires et accompagnement gratuit par le Ministère du Logement.',
};

export const steps: Step[] = [
  {
    ...step1,
    sections: [
      {
        id: 'etape-1',
        title:
          'Notifier l’Organisme de Foncier Solidaire (OFS) et déterminer votre prix de vente',
        content: `
          <p>
            Quand vous décidez de mettre en vente votre logement, prévenez tout de suite l’OFS avec qui vous avez contractualisé lors de l’achat.
          </p>
          <p>
            L’OFS a un droit de préemption, ce qui signifie qu’il peut racheter le bien avant que celui-ci ne soit proposé à d’autres acheteurs.
          </p>
          <p>
            De plus, l’OFS pourra vous indiquer le prix de vente maximum autorisé pour votre logement. Ce prix de vente est fixé en fonction de votre prix d’achat ainsi que de l’indice de référence fixé par l’INSEE. L’OFS pourra de plus vous accompagner dans la préparation de la cession.
          </p>
          <p>
            Pour préciser votre prix de vente, vous pouvez également consulter des professionnels de l’immobilier spécialisés en BRS.
          </p>
        `,
      },
      {
        id: 'etape-2',
        title: 'Préparer votre logement et le mettre en vente',
        content: `
          <p>
            Assurez-vous que le logement est en bon état et conforme aux normes en faisant réaliser les diagnostics obligatoires.
          </p>

          <details>
            <summary class="fr-mb-2w">
              Voir la liste des diagnostics obligatoires
            </summary>
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
          </details>
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
        `,
      },
      {
        id: 'etape-3',
        title: 'Trouvez un acheteur',
        content: `
          <p>
            Comme dans le cas d’une vente d’un appartement dans le marché libre,
            l’étape cruciale est de trouver un acheteur ! La seule différence est
            que celui-ci doit être éligible au BRS. Cette éligibilité peut être
            vérifiée rapidement en utilisant notre simulateur. Celle-ci devra
            ensuite être vérifiée officiellement par l’OFS.
          </p>
          <a
            href="/simulateur-eligibilite"
            class="fr-btn fr-btn--lg fr-mb-3w">
            Simuler mon éligibilité
          </a>
          <p>
            Votre acheteur achète dans les mêmes conditions que vous à l’époque : il
            faut que ce logement devienne sa résidence principale, sa plus-value
            sera encadrée et il devra payer une redevance mensuelle auprès de l’OFS.
            Mais il a aussi le même avantage principal : il achète un logement
            beaucoup moins cher que le prix du marché !
          </p>
          <p>Pour trouver l’acheteur, vous avez deux options :</p>
          <p class="fr-mb-0">
            <b>Option 1 : la vente entre particuliers.</b>
          </p>
          <p>
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
          <p class="fr-mb-0">
            <b>Option 2 : faire appel à un professionnel de l’immobilier.</b>
          </p>
          <p>
            Comme 70% des ménages, vous pouvez choisir de passer par un professionnel
            de l’immobilier pour commercialiser votre bien à votre place. Demandez à
            votre OFS s’il a des contacts à vous partager : il est important de choisir
            un agent qui connaît le BRS et pourra l’expliquer aux acheteurs potentiels.
            L’intérêt de cette solution, c’est de gagner du temps sur la vente et de
            toucher plus de ménages potentiels via les outils réservés aux professionnels.
            L’inconvénient, c’est que cette prestation a un coût : en moyenne entre 4%
            et 6% du prix de vente.
          </p>
        `,
      },
      {
        id: 'etape-4',
        title:
          'Rédigez votre offre préalable de cession et vérifiez que tout est bon avec votre Organisme de Foncier Solidaire',
        content: `
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
        `,
      },
      {
        id: 'etape-5',
        title: 'Passez devant le notaire pour finaliser la vente',
        content: `
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
          <p>
            Nous vous proposons un template d’offre préalable de cession des droits
            réels entre preneurs. Il s’agit d’un acte rédigé par un notaire, dédié à
            la revente d’un bien en Bail Réel Solidaire.
          </p>
          <a
            href="https://docs.google.com/document/d/1iEUKObH-4JPEYVzrpI50M3LTN9yl65KE/edit?tab=t.0#bookmark=id.taxh8lmhokue"
            class="fr-btn fr-btn--lg"
            target="_blank">
            Télécharger un template de notaire dédié à la revente en BRS
          </a>
        `,
      },
      {
        id: 'etape-6',
        title: 'Les difficultés que vous pouvez rencontrer',
        content: `
          <p>
            Revendre un logement et trouver le bon acheteur n’est pas toujours facile. Dans le cas du bail réel solidaire (BRS), vous pouvez faire face à deux difficultés majeures :
          </p>
          <ol>
            <li>
              Vous ne trouvez aucun acheteur pour votre bien
            </li>
            <li>
              Vous trouvez un acheteur mais l’Organisme de Foncier Solidaire (OFS) refuse de l’agréer
            </li>
          </ol>
          <p>
            Dans les deux cas, pas de panique, l’OFS pourra vous aider ou vous
            indemniser selon certaines conditions : explorons ensemble les deux
            scénarios.
          </p>
          <ul>
            <li>
              <p class="fr-mb-0"><b>Si vous ne trouvez aucun acheteur potentiel :</b></p>
              <p class="fr-mb-1w">
                Vous pouvez alors demander à l’OFS de vous proposer un acquéreur
                qui respecte les conditions prévues par la loi. Le prix de vente doit
                alors être calculé selon les règles fixées dans le bail.
                Si l’OFS ne trouve pas d’acquéreur dans un délai de six mois, ou si l’agrément est refusé
                lors d’une donation, le bail réel solidaire (BRS) peut être résilié d’un commun accord.
                Dans ce cas, le preneur (l’occupant) reçoit une indemnisation correspondant à la valeur de ses droits,
                selon les modalités prévues dans le bail (souvent dans une section intitulée “Résiliation du bail” ou “Fin de bail”).
                C’est sécurisant pour vous mais attention : <b>le montant de l’indemnisation est la plupart du temps inférieur à votre prix d’achat</b>.
                Ce montant est précisé dans le bail que vous avez signé au moment de l’acquisition de votre logement.
              </p>
              <p>
                Vous avez donc plutôt intérêt à chercher un acheteur directement qui
                puisse vous racheter le bien à un meilleur prix !
              </p>
            </li>
            <li>
              <p class="fr-mb-0"><b>Si vous trouvez un acheteur mais que l’OFS refuse de l’agréer :</b></p>
              <p class="fr-mb-1w">
                Dans certains cas, l’OFS peut refuser l’acheteur pour différentes raisons, par exemple parce qu’il ne respecte pas les conditions d’éligibilité au Bail Réel Solidaire ou parce qu’il n’a pas une capacité de financement suffisante. 
              </p>
              <p class="fr-mb-0">Plusieurs options sont alors possibles :</p>
              <ul>
                <li>
                  Vous pouvez alors rechercher un autre acheteur et le soumettre à l’OFS pour agréement et ce nouveau ménage est accepté.
                </li>
                <li>

                Vous pouvez aussi choisir de demander à l’OFS de vous proposer un autre acquéreur qui respecte les conditions prévues par la loi. Le prix de vente doit alors être calculé selon les règles fixées dans le bail.
                </li>
                <li>
                  Dans un délai de 6 mois, l’OFS ne trouve pas d’acquéreur, le bail réel solidaire (BRS) peut être résilié d’un commun accord. Dans ce cas, le preneur (l’occupant) reçoit une indemnisation correspondant à la valeur de ses droits, selon les modalités prévues dans le bail (souvent dans une section intitulée “Résiliation du bail” ou “Fin de bail”).
                  <br/>
                  C’est sécurisant pour vous mais attention : <b>le montant de l’indemnisation est la plupart du temps inférieur à votre prix d’achat</b>. Ce montant est précisé dans le bail que vous avez signé au moment de l’acquisition de votre logement. 
                </li>
              </ul>
            </li>
          </ul>
          <p class="fr-m-0"></p>
        `,
      },
    ],
  },
];
