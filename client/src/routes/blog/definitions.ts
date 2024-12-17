import type { Article } from '$lib/utils/definitions';

export type Data = {
  articles: Article[];
};

export type Props = {
  data: Data;
};
