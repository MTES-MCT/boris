<script lang="ts">
  import { default as MascotteWaving } from '$assets/icons/mascotte-waving.svg?raw';

  type Props = {
    content: string;
  };

  const { content }: Props = $props();
</script>

<div class="disclaimer">
  <div class="mascotte">
    {@html MascotteWaving}
  </div>
  <p class="brand">
    <span>B</span>
    <span>o</span>
    <span>R</span>
    <span>i</span>
    <span>S</span>
  </p>

  <p>{content}</p>
</div>

<style lang="postcss">
  .disclaimer {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-block-end: var(--5w);

    .mascotte {
      position: absolute;
      width: 82px;
      top: -50px;
      left: calc(50%);
    }

    .brand {
      display: inline-block;
      font-size: 2rem;
      padding-block: var(--1w);
      padding-inline: var(--2w);
      background-color: var(--color-red-primary);
      margin: 0;
      font-weight: normal;

      span:nth-child(odd) {
        font-weight: 900;
      }
    }

    p {
      font-size: 1.25rem;
      font-weight: 700;
      margin-top: var(--1v);
    }
  }

  @media (--sm-viewport) {
    .disclaimer {
      p {
        font-size: 1.5rem;
      }
    }
  }

  @media (--md-viewport) {
    .disclaimer {
      margin-block-end: var(--8w);

      p {
        font-size: 2rem;
      }
    }
  }
</style>
