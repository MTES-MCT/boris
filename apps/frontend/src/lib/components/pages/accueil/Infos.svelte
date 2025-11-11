<script>
  import HorizontalCard from '$components/common/HorizontalCard.svelte';
  import Section from '$components/common/Section.svelte';
  import card1 from '$assets/images/home-card-1.jpg?as=run';
  import card2 from '$assets/images/home-card-2.jpg?as=run';
  import card3 from '$assets/images/home-card-3.jpg?as=run';
  import { default as MascotteThinking } from '$assets/icons/mascotte-thinking.svg?raw';
  import { default as MascotteCelebrating } from '$assets/icons/mascotte-celebrating.svg?raw';
  import { default as EndOfPath } from '$assets/icons/end-of-path.svg?raw';
</script>

<Section>
  <div
    class={`
    relative w-[34px] h-[34px]
    after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-[4px] after:h-[16px] after:bg-blue-primary
  `}>
    <div class="absolute top-[-17px] left-[-15px] rotate-180">
      {@html EndOfPath}
    </div>
  </div>

  <div
    class={`
        relative mt-1 ml-1 mr-[6px]
        before:content-[''] before:absolute before:top-0 before:left-[-4px] before:w-[calc(50%+6px)] before:h-[calc(100%+4px)] before:bg-blue-primary before:rounded-bl-2xl
      `}>
    <HorizontalCard
      title="Accédez à une information qualifiée."
      content="Le Bail Réel Solidaire (BRS) est un dispositif permettant à des ménages ne pouvant plus acheter dans le marché libre de devenir propriétaire. Il dispose de nombreux avantages mais aussi beaucoup de particularités à connaître. BoRiS vous propose des renseignements officiels et travaillés de sorte à rendre la propriété accessibles pour tous·tes."
      href="/tout-savoir-sur-le-bail-reel-solidaire-brs"
      imgSrc={card1}
      photograph="David Hellmann"
      linkLabel="Découvrir le BRS et débuter mon parcours" />
  </div>

  <div
    class={`
        relative pt-[6rem] mt-1 ml-1 ml-[6px]
        before:content-[''] before:absolute before:top-[6rem] before:right-[-4px] before:w-[calc(50%+6px)] before:h-[calc(100%+4px-6rem)] before:bg-blue-primary before:rounded-br-2xl
      `}>
    <div
      class="absolute top-[-4px] right-[-4px] w-[calc(50%+6px)] h-[calc(6rem+4px)] border-t-4 border-r-4 border-blue-primary rounded-tr-2xl">
    </div>

    <div class="absolute left-[calc(50%-5rem)] top-[1.5rem]">
      {@html MascotteThinking}
    </div>
    <HorizontalCard
      title="Vérifiez si vous êtes éligibles !"
      content="BoRiS vous accompagne notamment grâce à son simulateur. Découvrez maintenant si vous pouvez prétendre au dispositif !"
      href="/simulateur-eligibilite"
      imgSrc={card2}
      photograph="Julian Bock"
      linkLabel="Vérifier mon éligibilité"
      reversed />
  </div>

  <div
    class={`
        relative pt-[6rem] mt-1 ml-1 mr-[6px]
        before:content-[''] before:absolute before:top-[6rem] before:left-[-4px] before:w-[calc(50%+6px)] before:h-[calc(100%+4px-6rem)] before:bg-blue-primary before:rounded-bl-2xl
      `}>
    <div
      class="absolute top-[-4px] left-[-4px] w-[calc(50%+6px)] h-[calc(6rem+4px)] border-t-4 border-l-4 border-blue-primary rounded-tl-2xl">
    </div>
    <HorizontalCard
      title="BoRiS vous met en relation avec des organismes dans votre zone de recherche."
      content="BoRiS est en lien avec les organismes de foncier solidaires (OFS) agréés par l'Etat qui font construire des logements en BRS et présentent actuellement des programmes en cours de commercialisation."
      href="/logements-brs-disponibles"
      imgSrc={card3}
      photograph="Hannah Busing"
      linkLabel="Trouver un logement en BRS" />
  </div>

  <div
    class={`
      relative flex justify-center items-end w-full h-[166px]
      before:content-[''] before:absolute before:left-[calc(50%-2px)] before:top-0 before:w-[4px] before:h-[130px] before:bg-blue-primary
    `}>
    <div class="absolute top-[2.5rem] left-[calc(50%+1rem)]">
      {@html MascotteCelebrating}
    </div>
    {@html EndOfPath}
  </div>
</Section>
