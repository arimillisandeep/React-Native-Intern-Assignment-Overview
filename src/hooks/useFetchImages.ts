import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchPicsumImages } from '../api/picsumApi';
import type { PicsumImage } from '../types/gallery';

export function useFetchImages() {
  const [images, setImages] = useState<PicsumImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetching = useRef(false);
  const page = useRef(1);
  const hasMore = useRef(true);

  const load = useCallback(async (targetPage: number, replace = false) => {
    if (isFetching.current || (!replace && !hasMore.current)) return;
    isFetching.current = true;
    setError(null);
    try {
      const nextImages = await fetchPicsumImages(targetPage);
      hasMore.current = nextImages.length > 0;
      page.current = targetPage;
      setImages((current) => replace ? nextImages : [...current, ...nextImages.filter((image) => !current.some((currentImage) => currentImage.id === image.id))]);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to load photos.');
    } finally {
      isFetching.current = false;
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void load(1, true); }, [load]);
  const loadMore = useCallback(() => { void load(page.current + 1); }, [load]);
  const refresh = useCallback(() => { if (isFetching.current) return; setRefreshing(true); hasMore.current = true; void load(1, true); }, [load]);
  return { images, loading, refreshing, error, loadMore, refresh, retry: refresh };
}
