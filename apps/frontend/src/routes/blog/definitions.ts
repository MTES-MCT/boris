import type { ArticlePreview } from '$lib/utils/definitions';

export type Data = {
  articles: ArticlePreview[];
};

export type Props = {
  data: Data;
};
