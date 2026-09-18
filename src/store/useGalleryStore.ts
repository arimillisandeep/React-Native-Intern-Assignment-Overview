import { create } from 'zustand';
import type { PicsumImage } from '../types/gallery';
import { readStorage, STORAGE_KEYS, writeStorage } from '../utils/storage';

type GalleryState = {
  favorites: PicsumImage[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  toggleFavorite: (image: PicsumImage) => Promise<void>;
};

export const useGalleryStore = create<GalleryState>((set, get) => ({
  favorites: [],
  hydrated: false,
  hydrate: async () => {
    try {
      set({ favorites: (await readStorage<PicsumImage[]>(STORAGE_KEYS.favorites)) ?? [] });
    } finally {
      set({ hydrated: true });
    }
  },
  toggleFavorite: async (image) => {
    const exists = get().favorites.some((favorite) => favorite.id === image.id);
    const favorites = exists
      ? get().favorites.filter((favorite) => favorite.id !== image.id)
      : [image, ...get().favorites];
    set({ favorites });
    await writeStorage(STORAGE_KEYS.favorites, favorites);
  },
}));
