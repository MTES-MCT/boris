import type { PageServerLoad } from './$types';
import { BORIS_CMS_URL } from '$env/static/private';
import type { Data } from './definitions';
import type {
  BlogPost,
  WagtailApiItemResponse,
  WagtailApiItemsResponse,
} from '$lib/utils/definitions';

export const load: PageServerLoad = async ({
  params,
  fetch,
}): Promise<Data> => {
  const { slug } = params;
  const response = await fetch(`${BORIS_CMS_URL}/api/v2/pages?slug=${slug}`);
  const data: WagtailApiItemsResponse = await response.json();
  const { id } = data.items[0];

  const blogPostResponse = await fetch(`${BORIS_CMS_URL}/api/v2/pages/${id}`);
  const blogPostData: WagtailApiItemResponse = await blogPostResponse.json();

  const { title, body } = blogPostData;
  const { first_published_at, search_description } = blogPostData.meta;

  const blogPost: BlogPost = {
    title,
    description: search_description,
    firstPublishedAt: first_published_at,
    slug,
    body,
  };

  return {
    blogPost,
  };
};
