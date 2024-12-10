<script>
  import Column from '$components/tout-savoir-sur-le-bail-reel-solidaire-brs/promesse/column/column.svelte';
</script>

<section class="fr-container promesse">
  <div class="content">
    <h2>Le BRS en 3 points clés.</h2>

    <div class="fr-grid-row fr-grid-row--gutters">
      <Column>
        <p>
          <b>
            Les logements mis en vente en BRS sont 30 à 50% moins chers que ceux
            mis en vente dans le marché traditionnel.
          </b>
        </p>
        <p>
          Les prix sont encadrés et contrôlés par l'État. Cela est rendu
          possible notamment parce que les propriétaires d'un logement en BRS
          achètent leur logement à 100%, mais pas le terrain sur lequel celui-ci
          est construit.
        </p>
        <p>
          En échange, les propriétaires d'un logement d'un BRS s'acquittent
          d'une redevance mensuelle contenue.
        </p>
      </Column>
      <Column>
        <p>
          <b>
            En tant que propriétaire d'un logement en BRS, vous disposez de tous
            les droits d'un·e propriétaire.
          </b>
        </p>
        <p>
          Vous pouvez notamment revendre votre logement (avec une plus-value
          toutefois encadrée) ou le transmettre à vos proches.
        </p>
        <p>
          Le dispositif se veut ainsi solidaire car il permet aux générations
          futures d'accéder à la propriété dans des conditions similaires, de
          manière abordable.
        </p>
      </Column>
      <Column>
        <p>
          Les premiers logements en BRS ont vu le jour en 2019 et depuis le
          dispositif se déploie sur l’ensemble du territoire national.
        </p>
        <p>
          Les acquéreurs sont accompagnés tout au long de leur procédure d'achat
          par un organisme dédié.
        </p>
      </Column>
    </div>
  </div>
</section>

<style lang="postcss">
  .promesse {
    max-width: 992px;

    .content {
      padding-block-start: var(--7w);
      padding-block-end: var(--3w);
      padding-inline: var(--2w);
      background-color: white;
      border-top-left-radius: var(--border-radius-md);
      border-top-right-radius: var(--border-radius-md);

      h2 {
        font-size: 1.5rem;
        text-align: center;
        color: var(--color-blue-primary);
        margin-block-end: var(--6w);
      }
    }

    @media (--md-viewport) {
      .content {
        position: relative;
        padding-inline: var(--4w);
        transform-style: preserve-3d;

        h2 {
          font-size: 1.75rem;
        }

        &::after {
          content: '';
          position: absolute;
          bottom: var(--8w);
          left: var(--10w);
          width: 100%;
          height: 100%;
          border: solid 3px var(--color-red-primary);
          border-top-left-radius: var(--border-radius-md);
          border-top-right-radius: var(--border-radius-md);
          transform: translateZ(-1px);
        }
      }
    }
  }
</style>
