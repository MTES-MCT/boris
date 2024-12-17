import type { PageServerLoad } from './$types';
import { PUBLIC_BORIS_CMS_URL } from '$env/static/public';
import type { Data } from './definitions';
import type {
  Article,
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

  const articleResponse = await fetch(
    `${PUBLIC_BORIS_CMS_URL}/api/v2/pages/${id}`,
  );
  const articleData: WagtailApiItemResponse = await articleResponse.json();

  const article: Article = {
    title: articleData.title,
    description: articleData.meta.search_description,
    firstPublishedAt: articleData.meta.first_published_at,
    slug,
    body: articleData.body,
  };

  for (const element of article.body as WagtailApiItemResponseBody[]) {
    if (element.type === 'image') {
      const response = await fetch(
        `${PUBLIC_BORIS_CMS_URL}/api/v2/images/${element.value.image}`,
      );
      const data: WagtailApiItemResponse = await response.json();

      element.value.url = data.meta.download_url;
    }
  }

  return {
    article,
  };
};
