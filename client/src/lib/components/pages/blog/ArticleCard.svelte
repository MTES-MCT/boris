<script lang="ts">
  import type { Article } from '$lib/utils/definitions';
  import { formatPublishedAt } from '$lib/utils/formatters';
  type Props = Article;

  const { title, description, firstPublishedAt, slug }: Props = $props();
</script>

<div class="fr-card fr-enlarge-link">
  <div class="fr-card__body">
    <div class="fr-card__content">
      <h3 class="fr-card__title">
        <a href={`/blog/${slug}`}>{title}</a>
      </h3>
      <p class="fr-card__desc">{description}</p>
      <div class="fr-card__end">
        <p class="fr-card__detail fr-icon-calendar-2-line">
          {formatPublishedAt(firstPublishedAt)}
        </p>
      </div>
    </div>
  </div>
</div>

<style>
  .fr-card__detail {
    align-items: center;
  }
</style>
