export type AnimeInfo = {
  malId: number;
  title: {
    Romanji: string;
    English: string;
  };

  image_webp: string;
  image_jpg: string;
  trailer: string;
  type: string;
  status: string;
  duration: string;
  score: number;
  synopsis: string;
  season: string;
};

export enum Filters {
  TV = "tv",
  Movie = "movie",
  Ova = "ova",
  Ona = "ona",
  Special = "special",
  Music = "music",
}
export enum Season {
  Winter = "winter",
  Fall = "fall",
  Spring = "spring",
  Summer = "summer",
}
export enum TopAnime {
  TV = "tv",
  Movie = "movie",
  Ova = "ova",
  Ona = "ona",
  Special = "special",
  Music = "music",
  CM = "cm",
  PV = "pv",
  TV_Special = "tv_special",
}

export enum TopAnimeFilter {
  Airing = "airing",
  Popularity = "bypopularity",
  Upcoming = "upcoming",
  Favourite = "favourite",
}
export enum Providers {
  Anitaku = "anitaku",
  AnimeZ = "animez",
  HiAnime = "hianime",
}
