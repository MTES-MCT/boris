<script>
  import HorizontalCard from '$components/cards/horizontal/horizontal.svelte';
  import Section from '$components/section/section.svelte';
  import card1 from '$assets/images/home-card-1.jpg';
  import card2 from '$assets/images/home-card-2.jpg';
  import card3 from '$assets/images/home-card-3.jpg';
  import { default as MascotteThinking } from '$assets/icons/mascotte-thinking.svg?raw';
  import { default as MascotteCelebrating } from '$assets/icons/mascotte-celebrating.svg?raw';
  import { default as EndOfPath } from '$assets/icons/end-of-path.svg?raw';
</script>

<Section>
  <div class="card-container">
    <HorizontalCard
      title="Accédez à une information qualifiée."
      content="Le Bail Réel Solidaire (BRS) est un dispositif permettant à des ménages ne pouvant plus acheter dans le marché libre de devenir propriétaire. Il dispose de nombreux avantages mais aussi beaucoup de particularités à connaître. BoRiS vous propose des renseignements officiels et travaillés de sorte à rendre la propriété accessibles pour tous·tes."
      href="/tout-savoir-sur-le-BRS"
      imgSrc={card1}
      photographer="David Hellmann"
      linkLabel="Découvrir le BRS et débuter mon parcours"
      style="border-bottom-left-radius: var(--border-radius-md);" />
  </div>

  <div class="card-container">
    <div class="border-box"></div>
    <div class="mascotte">
      {@html MascotteThinking}
    </div>
    <HorizontalCard
      title="Vérifiez si vous êtes éligibles !"
      content="BoRiS vous accompagne notamment grâce à son simulateur. Découvrez maintenant si vous pouvez prétendre au dispositif !"
      href="/simuler-mon-eligibilite"
      imgSrc={card2}
      photographer="Julian Bock"
      linkLabel="Vérifier mon éligibilité"
      style="border-bottom-right-radius: var(--border-radius-md)"
      reversed />
  </div>

  <div class="card-container">
    <div class="border-box"></div>
    <HorizontalCard
      title="BoRiS vous met en relation avec des organismes dans votre zone de recherche."
      content="BoRiS est en lien avec les Organismes de Foncier Solidaires (OFS) agréés par l’Etat qui font construire des logements en BRS et présentent actuellement des programmes en cours de commercialisation."
      href="/organismes-fonciers-solidaires"
      imgSrc={card3}
      photographer="Hannah Busing"
      linkLabel="Trouvez votre logement en BRS"
      style="border-bottom-left-radius: var(--border-radius-md);" />
  </div>

  <div class="end">
    <div class="mascotte">
      {@html MascotteCelebrating}
    </div>
    {@html EndOfPath}
  </div>
</Section>

<style lang="postcss">
  .card-container {
    --absolute-inline-offset: calc(-1 * var(--path-thickness));

    position: relative;
    padding-block-start: var(--12w);
    margin-block-start: var(--path-thickness);
    margin-inline-start: var(--path-thickness);
    margin-inline-end: var(--path-thickness);

    .border-box {
      position: absolute;
      top: var(--absolute-inline-offset);
      right: var(--absolute-inline-offset);
      width: calc(50% + var(--path-thickness) * 1.5);
      height: calc(var(--12w) + var(--path-thickness));
    }

    &::before {
      content: '';
      position: absolute;
      width: calc(50% + var(--path-thickness) * 1.5);
      height: calc(100% + var(--path-thickness));
      background-color: var(--color-blue-primary);
    }

    &:nth-child(1) {
      margin-inline-end: calc(1.5 * var(--path-thickness));
      padding-block-start: 0;

      &::before {
        top: 0;
        left: var(--absolute-inline-offset);
        height: calc(100% + var(--path-thickness));
        border-bottom-left-radius: var(--border-radius-lg);
      }

      &::after {
        content: '';
        position: absolute;
        left: var(--absolute-inline-offset);
        width: var(--path-thickness);
        top: -60px;
        height: 60px;
        background: linear-gradient(
          180deg,
          transparent 0%,
          var(--color-blue-primary) 100%
        );
        z-index: 100;

        @media (--md-viewport) {
          top: -100px;
          height: 100px;
        }
      }
    }

    &:nth-child(2) {
      margin-inline-start: calc(1.5 * var(--path-thickness));

      &::before {
        right: var(--absolute-inline-offset);
        top: var(--12w);
        height: calc(100% + var(--path-thickness) - var(--12w));
        border-bottom-right-radius: var(--border-radius-lg);
      }

      .border-box {
        border-top: solid var(--path-thickness) var(--color-blue-primary);
        border-right: solid var(--path-thickness) var(--color-blue-primary);
        border-top-right-radius: var(--border-radius-lg);
      }

      .mascotte {
        position: absolute;
        left: calc(50% - var(--10w));
        top: var(--3w);
      }
    }

    &:nth-child(3) {
      &::before {
        top: var(--12w);
        left: var(--absolute-inline-offset);
        height: calc(100% + var(--path-thickness) - var(--12w));
        border-bottom-left-radius: var(--border-radius-lg);
      }

      .border-box {
        left: var(--absolute-inline-offset);
        border-top: solid var(--path-thickness) var(--color-blue-primary);
        border-left: solid var(--path-thickness) var(--color-blue-primary);
        border-top-left-radius: var(--border-radius-lg);
      }
    }
  }

  .end {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    width: 100%;
    height: 166px;

    &::before {
      content: '';
      position: absolute;
      left: calc(50% - 2px);
      top: 0;
      width: 4px;
      height: 130px;
      background: var(--color-blue-primary);
    }

    .mascotte {
      position: absolute;
      top: var(--5w);
      left: calc(50% + var(--2w));
    }
  }
</style>
