// get anime by id returns titles(english romanji) images large , coverimage  large, synopsis , rating, type ,
// popular anime
// airing anime
// seasons (now ,next , a way to query for seasons based on year and season)
// search anime
//
const fetchById = `query ($id: Int ) { 
  Media (id: $id, type: ANIME ) { 
    id
    idMal
    title {
      romaji
      english
      native
    }
    type
    format
    status
    description
    season
    duration
    coverImage {
      extraLarge
      large
      medium
      color
    }
    trailer {
      id
      site
      thumbnail
    }
    meanScore
    averageScore
    genres
    bannerImage
  }
}`;

const airing = `query Query($page: Int, $perPage: Int, $type: MediaType, $format: MediaFormat, $status: MediaStatus, $isAdult: Boolean, $sort: [MediaSort]) {
  Page(page: $page, perPage: $perPage) {
    media(type: $type, format: $format, status: $status, isAdult: $isAdult, sort: $sort) {
      id
      idMal
      title {
        romaji
        english
        native
        userPreferred
      }
      type
      format
      status
      description
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      trailer {
        id
        site
        thumbnail
      }
      bannerImage
      coverImage {
        extraLarge
        large
        medium
        color
      }
      averageScore
      meanScore
      nextAiringEpisode {
   
        airingAt
      
        episode
       
      }
    }
  }
}`;
// // {
//   "page": 1,
//   "perPage": 25,
//   "type": "ANIME",
//   "format": "TV",
//   "status": "RELEASING",
//   "isAdult": false,
//   "sort": "SCORE_DESC"
// }

const topanime = `query Query($page: Int, $perPage: Int, $type: MediaType, $format: MediaFormat, $isAdult: Boolean, $sort: [MediaSort]) {
  Page(page: $page, perPage: $perPage) {
    media(type: $type, format: $format, isAdult: $isAdult, sort: $sort) {
      id
      idMal
      title {
        romaji
        english
        native
        userPreferred
      }
      type
      format
      status
      description
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      trailer {
        id
        site
        thumbnail
      }
      bannerImage
      coverImage {
        extraLarge
        large
        medium
        color
      }
      averageScore
      meanScore
    }
  }
}`;

// {
//     "page": 1,
//     "perPage": 25,
//     "type": "ANIME",
//     "format": "TV",

//     "isAdult": false,
//     "sort":"SCORE_DESC",

//   }

const popularanime = `query Query($page: Int, $perPage: Int, $type: MediaType, $format: MediaFormat, $isAdult: Boolean, $sort: [MediaSort]) {
  Page(page: $page, perPage: $perPage) {
    media(type: $type, format: $format, isAdult: $isAdult, sort: $sort) {
      id
      idMal
      title {
        romaji
        english
        native
        userPreferred
      }
      type
      format
      status
      description
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      trailer {
        id
        site
        thumbnail
      }
      bannerImage
      coverImage {
        extraLarge
        large
        medium
        color
      }
      averageScore
      meanScore
    }
  }
}`;

// {
//     "page": 1,
//     "perPage": 25,
//     "type": "ANIME",
//     "format": "TV",

//     "isAdult": false,
//     "sort":"POPULARITY_DESC",

//   }
const popularmovies = `take popularanime var and change format to movie`; // this can be done for ova and ona enum to get them this will be getpopoular category
const season = `query Query($page: Int, $perPage: Int, $type: MediaType, $format: MediaFormat, $isAdult: Boolean, $season: MediaSeason, $seasonYear: Int, $sort: [MediaSort]) {
  Page(page: $page, perPage: $perPage) {
    media(type: $type, format: $format, isAdult: $isAdult, season: $season, seasonYear: $seasonYear, sort: $sort) {
      id
      idMal
      title {
        romaji
        english
        native
        userPreferred
      }
      type
      format
      status
      description
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      trailer {
        id
        site
        thumbnail
      }
      bannerImage
      coverImage {
        extraLarge
        large
        medium
        color
      }
      averageScore
      meanScore
    }
  }
}`;
// {
//     "page": 1,
//     "perPage": 25,
//     "type": "ANIME",

//     "isAdult": false,

//     "season": "WINTER",

//     "seasonYear": 2025,
//     "sort": "POPULARITY_DESC"

//   }
const search = `query Query($page: Int, $perPage: Int, $type: MediaType, $isAdult: Boolean, $search: String) {
  Page(page: $page, perPage: $perPage) {pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    media(type: $type, isAdult: $isAdult, search: $search) {
      id
      idMal
      title {
        romaji
        english
        native
        userPreferred
      }
      type
      format
      status
      description
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      trailer {
        id
        site
        thumbnail
      }
      bannerImage
      coverImage {
        extraLarge
        large
        medium
        color
      }
      averageScore
      meanScore
    }
    
  }
}`;
// {
//     "page": 1,
//     "perPage": 25,
//     "type": "ANIME",
//     "isAdult": false,
//     "search": "bleach"
//   }
