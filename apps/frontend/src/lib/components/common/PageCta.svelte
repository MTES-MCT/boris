<script lang="ts">
  import { default as MascotteShowing } from '$assets/icons/mascotte-showing.svg?raw';
  import type { Heading } from '$lib/utils/definitions';

  type Props = {
    titleElement?: Heading;
  };

  const { titleElement = 'h3' }: Props = $props();
</script>

<section class="relative fr-pt-9w flex">
  <div class="absolute top-5 left-[calc(50%-6rem)] z-[1]">
    {@html MascotteShowing}
  </div>

  <div
    class="relative hidden md:block flex-1 h-[60px] mt-15 border-b-(length:--path-thickness) border-b-red-primary border-r-(length:--path-thickness) border-r-red-primary rounded-br-2xl">
  </div>

  <div
    class={`
      fr-container relative !max-w-[772px] border-t border-t-(length:--path-thickness) border-red-primary md:border-none
      md:before:content-[''] md:before:absolute md:before:top-0 md:before:left-[-4px] md:before:w-[120px] md:before:h-[60px] md:before:border-t md:before:border-l md:before:border-l-(length:--path-thickness) md:before:border-t-(length:--path-thickness) md:before:border-red-primary md:before:rounded-tl-2xl
      md:after:content-[''] md:after:absolute md:after:top-0 md:after:right-[-4px] md:after:w-[120px] md:after:h-[60px] md:after:border-t md:after:border-r md:after:border-r-(length:--path-thickness) md:after:border-t-(length:--path-thickness) md:after:border-red-primary md:after:rounded-tr-2xl
    `}>
    <div
      class="content fr-pt-4w fr-pb-7w max-w-[636px] mx-auto text-center border-w-0 md:border-t md:border-t-4 md:border-red-primary">
      <svelte:element
        this={titleElement}
        class="fr-h3">
        Découvrez si des logements en bail réel solidaire (BRS) sont disponibles
        près de chez vous !
      </svelte:element>
      <p>
        Les <a
          href="/organismes-de-foncier-solidaire"
          class="fr-link">
          organismes de foncier solidaire (OFS)
        </a>
        partagent la propriété des logements en bail réel solidaire (BRS) avec les
        ménages bénéficiaires du dispositif, les aident, sécurisent leur achat et
        les accompagnent tout au long du processus, découvrez leurs offres !
      </p>
      <a
        href="/logements-brs-disponibles"
        class="fr-btn fr-btn--lg">
        Trouver un logement en bail réel solidaire
      </a>
    </div>
  </div>

  <div
    class="relative hidden md:block flex-1 h-[60px] mt-15 border-b-(length:--path-thickness) border-b-red-primary border-l-(length:--path-thickness) border-l-red-primary rounded-bl-2xl">
  </div>
</section>
