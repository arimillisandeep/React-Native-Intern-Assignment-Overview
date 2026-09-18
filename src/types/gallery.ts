export interface PicsumImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export type AuthorFilter = 'ALL' | 'A-M' | 'N-Z';
