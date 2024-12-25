export type AnimeInfo = {
  malId: number;
  title: {
    romanji: string;
    english: string;
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
export type seasonJikan = {
  pagination: {
    last_visible_page: 0;
    has_next_page: true;
    items: {
      count: 0;
      total: 0;
      per_page: 0;
    };
  };
  data: [
    {
      mal_id: 0;
      images: {
        jpg: {
          large_image_url: "string";
        };
        webp: {
          large_image_url: "string";
        };
      };
      trailer: {
        url: "string";
        embed_url: "string";
      };
      approved: true;
      titles: [
        {
          type: "string";
          title: "string";
        }
      ];
      title: "string";
      title_english: "string";
      title_japanese: "string";

      type: "TV";
      source: "string";
      episodes: 0;
      status: "Finished Airing";
      airing: true;
      aired: {
        from: "string";
        to: "string";
      };
      duration: "string";
      rating: "G - All Ages";
      score: 0;

      synopsis: "string";

      season: "summer";
      year: 0;
      broadcast: {
        day: "string";
        time: "string";
        timezone: "string";
        string: "string";
      };
      producers: [
        {
          mal_id: 0;
          type: "string";
          name: "string";
          url: "string";
        }
      ];
      licensors: [
        {
          mal_id: 0;
          type: "string";
          name: "string";
          url: "string";
        }
      ];
      studios: [
        {
          mal_id: 0;
          type: "string";
          name: "string";
          url: "string";
        }
      ];
      genres: [
        {
          mal_id: 0;
          type: "string";
          name: "string";
          url: "string";
        }
      ];
      explicit_genres: [
        {
          mal_id: 0;
          type: "string";
          name: "string";
          url: "string";
        }
      ];
      themes: [
        {
          mal_id: 0;
          type: "string";
          name: "string";
          url: "string";
        }
      ];
      demographics: [
        {
          mal_id: 0;
          type: "string";
          name: "string";
          url: "string";
        }
      ];
    }
  ];
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
export enum AnimeType {
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

export enum AnimeStatusFilter {
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
