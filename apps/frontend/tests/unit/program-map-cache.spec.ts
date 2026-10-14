import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import cache from '$lib/server/cache';
import {
  GET,
  prerender,
} from '../../src/routes/api/brs-diffusion-websites/all/+server';

vi.mock('$env/static/private', () => ({
  API_URL: 'http://backend.test',
  API_KEY: 'test-key',
}));

const fetchMock = vi.fn();
const programs = (name: string) => ({
  items: [{ id: 'program-1', programName: name }],
  page: 1,
  pagesCount: 1,
  totalCount: 1,
  hasNextPage: false,
});

beforeEach(async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-14T12:00:00Z'));
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockReset();
  await cache.clear();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('Public program map freshness', () => {
  it('serves live data rather than a build-time snapshot', () => {
    expect(prerender).toBe(false);
  });

  it('reuses the cache briefly and refetches edited programs after 30 seconds', async () => {
    fetchMock.mockResolvedValueOnce(Response.json(programs('Original')));
    expect((await (await GET()).json()).items[0].programName).toBe('Original');

    fetchMock.mockResolvedValueOnce(Response.json(programs('Edited')));
    vi.advanceTimersByTime(29_000);
    expect((await (await GET()).json()).items[0].programName).toBe('Original');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1_001);
    expect((await (await GET()).json()).items[0].programName).toBe('Edited');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('prevents browsers and proxies from extending the stale period', async () => {
    fetchMock.mockResolvedValueOnce(Response.json(programs('Original')));
    expect((await GET()).headers.get('cache-control')).toBe('no-store');
  });

  it('loads all pages and does not cache an incomplete list when a page fails', async () => {
    const firstPage = {
      ...programs('First'),
      pagesCount: 2,
      totalCount: 2,
      hasNextPage: true,
    };
    fetchMock.mockResolvedValueOnce(Response.json(firstPage));
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 500 }));
    await expect(GET()).rejects.toMatchObject({ status: 502 });

    fetchMock.mockResolvedValueOnce(Response.json(firstPage));
    fetchMock.mockResolvedValueOnce(
      Response.json({ ...programs('Second'), page: 2 }),
    );
    const response = await GET();
    expect(await response.json()).toMatchObject({
      items: [{ programName: 'First' }, { programName: 'Second' }],
      pageSize: 2,
      hasNextPage: false,
    });
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });
});
