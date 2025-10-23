import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, url }) => {
  console.log(url);
  console.log(request);

  return new Response(JSON.stringify({ hello: 'yoyo' }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
