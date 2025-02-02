export const fetchByIdQuery = `query ($id: Int ) { 
  Media (id: $id, type: ANIME ) { 
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
    season
    meanScore
    averageScore
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
    
    genres
    bannerImage
  }
}`;

export const airingQuery = `query Query($page: Int, $perPage: Int, $type: MediaType, $format: MediaFormat, $status: MediaStatus, $isAdult: Boolean, $sort: [MediaSort]) {
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

export const popularAnimeQuery = `query Query($page: Int, $perPage: Int, $type: MediaType, $format: MediaFormat, $isAdult: Boolean, $sort: [MediaSort]) {
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

export const seasonQuery = `query Query($page: Int, $perPage: Int, $type: MediaType, $format: MediaFormat, $isAdult: Boolean, $season: MediaSeason, $seasonYear: Int, $sort: [MediaSort]) {
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

export const searchQuery = `query Query($page: Int, $perPage: Int, $type: MediaType, $isAdult: Boolean, $search: String) {
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

export const characterQuery = `query Media($mediaId: Int, $sort: [CharacterSort], $voiceActorsSort2: [StaffSort]) {
  Media(id: $mediaId) {
    id
    idMal
    title {
      romaji
      english
      native
    }
    characters(sort: $sort) {
      edges {
        role
        node {
          id
          name {
            full
          }
          image {
            large
          }
        }
        voiceActors(sort: $voiceActorsSort2) {
          name {
            full
          }
          image {
            large
            medium
          }
          languageV2
        }
      }
    }
  }
}`;
