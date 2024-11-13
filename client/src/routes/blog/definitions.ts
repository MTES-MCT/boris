import type { BlogPost } from '$lib/utils/definitions';

export type Data = {
  blogPosts: BlogPost[];
};

export type Props = {
  data: Data;
};
