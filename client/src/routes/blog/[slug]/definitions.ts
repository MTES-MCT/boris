import type { BlogPost } from '$lib/utils/definitions';

export type Data = {
  blogPost: BlogPost;
};

export type Props = {
  data: Data;
};
