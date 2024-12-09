import type { PageServerLoad } from './$types';
import { PUBLIC_BORIS_CMS_URL } from '$env/static/public';
import type { Data } from './definitions';
import type {
  BlogPost,
  WagtailApiItemResponse,
  WagtailApiItemResponseBody,
  WagtailApiItemsResponse,
} from '$lib/utils/definitions';

export const load: PageServerLoad = async ({
  params,
  fetch,
}): Promise<Data> => {
  const { slug } = params;
  const response = await fetch(
    `${PUBLIC_BORIS_CMS_URL}/api/v2/pages?slug=${slug}`,
  );
  const data: WagtailApiItemsResponse = await response.json();
  const { id } = data.items[0];

  const blogPostResponse = await fetch(
    `${PUBLIC_BORIS_CMS_URL}/api/v2/pages/${id}`,
  );
  const blogPostData: WagtailApiItemResponse = await blogPostResponse.json();

  const blogPost: BlogPost = {
    title: blogPostData.title,
    description: blogPostData.meta.search_description,
    firstPublishedAt: blogPostData.meta.first_published_at,
    slug,
    body: blogPostData.body,
  };

  for (const element of blogPost.body as WagtailApiItemResponseBody[]) {
    if (element.type === 'image') {
      const response = await fetch(
        `${PUBLIC_BORIS_CMS_URL}/api/v2/images/${element.value.image}`,
      );
      const data: WagtailApiItemResponse = await response.json();

      element.value.url = data.meta.download_url;
    }
  }

  return {
    blogPost,
  };
};
