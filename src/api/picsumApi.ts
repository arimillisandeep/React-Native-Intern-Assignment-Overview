import type { PicsumImage } from '../types/gallery';

const BASE_URL = 'https://picsum.photos/v2/list';

export async function fetchPicsumImages(page: number, limit = 20): Promise<PicsumImage[]> {
  const response = await fetch(`${BASE_URL}?page=${page}&limit=${limit}`);
  if (!response.ok) throw new Error('Unable to load photos. Please try again.');
  return response.json() as Promise<PicsumImage[]>;
}
