export interface Movie {
  response: Response;
}

export interface Response {
  results: Result[];
  page: number;
  total_results: number;
  dates: Dates;
  total_pages: number;
}

export interface Dates {
  maximum: string;
  minimum: string;
}

export interface Result {
  vote_count: number;
  id: number;
  video: boolean;
  vote_average: number;
  title: string;
  popularity: number;
  poster_path: string;
  original_language: OriginalLanguage;
  original_title: string;
  genre_ids: number[];
  backdrop_path: string;
  adult: boolean;
  overview: string;
  release_date: string;
  favorite?: boolean;
  genre?: string;
}

export enum OriginalLanguage {
  En = 'en',
  Ja = 'ja'
}
