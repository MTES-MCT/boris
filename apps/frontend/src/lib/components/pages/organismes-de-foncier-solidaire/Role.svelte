<script lang="ts">
  import Section from '$components/common/Section.svelte';
  import Tile from '$components/common/Tile.svelte';

  import { default as MascotteThinking } from '$assets/icons/mascotte-thinking.svg?raw';
  import Alert from '$components/common/Alert.svelte';
  import TitleWithMascotte from '$components/pages/organismes-de-foncier-solidaire/TitleWithMascotte.svelte';
</script>

<div class="my-20 bg-white">
  <Section>
    <TitleWithMascotte
      title="Le rôle des OFS"
      mascotte={MascotteThinking} />

    <div
      class="flex flex-wrap gap-4 lg:gap-8 justify-center mb-16 w-[calc(100%-1rem)] mx-auto">
      <div class="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-2rem)]">
        <Tile
          title="Achat"
          description="Acquisition des terrains pour construire des logements vendus en bail réel solidaire"
          pictogram="money" />
      </div>

      <div class="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-2rem)]">
        <Tile
          title="Sélection"
          description="Processus de sélection des ménages éligibles à l'acquisition"
          pictogram="community" />
      </div>

      <div class="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-2rem)]">
        <Tile
          title="Signature"
          description="Formalisation de la vente en bail réel solidaire avec les ménages acquéreurs"
          pictogram="contract" />
      </div>

      <div class="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-2rem)]">
        <Tile
          title="Partage"
          description="Partage de la propriété des terrains avec les ménages acquéreurs"
          pictogram="environment" />
      </div>
      <div class="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.33%-2rem)]">
        <Tile
          title="Gestion"
          description="Suivi de la gestion du bien et des potentielles reventes ou transmission du logement"
          pictogram="binders" />
      </div>
    </div>
    <div class="flex flex-col items-center text-center gap-8 lg:gap-12">
      <h3 class="fr-mb-0">La mission des OFS</h3>
      <div>
        <p>
          Les Organismes de Foncier Solidaire (OFS) ont pour mission de réaliser
          des logements et de les vendre sous le régime spécifique du bail réel
          solidaire (BRS), favorisant ainsi l'accession à la propriété des
          ménages.
        </p>
        <p class="fr-mb-0">
          Pour réaliser cette mission, l'organisme de fonctier solidaire (OFS) <span
            class="fr-text--bold">
            achète et conserve des terrains
          </span>
          , sur lesquels il bâtit des logements, qu'il met ensuite en vente à des
          ménages
          <a
            href="/simulateur-eligibilite"
            class="fr-link">
            éligibles
          </a>
          afin qu'ils puissent devenir propriétaires via un
          <span class="fr-text--bold">
            bail réel solidaire, dont la durée est très longue
          </span>
          (de 18 à 99 ans). Ce dispositif permet ainsi à l'organisme de foncier solidaire
          (OFS) et au ménage de partager la propriété du logement, ce qui se traduit
          par un prix réduit à l'achat. Attention ! Le dispositif du bail réel solidaire
          (BRS) n'est pas exempt de contrepartie.
        </p>
      </div>

      <Alert type="info">
        <p class="fr-text--bold">
          Vous pouvez consulter <a
            href="/tout-savoir-sur-le-bail-reel-solidaire-brs"
            class="fr-link">
            notre page dédiée
          </a>
          pour en savoir plus sur le bail réel solidaire (BRS).
        </p>
      </Alert>

      <a
        href="/simulateur-eligibilite"
        class="fr-btn fr-btn--lg">
        Simuler mon éligibilité au Bail Réel Solidaire
      </a>
    </div>
  </Section>
</div>
