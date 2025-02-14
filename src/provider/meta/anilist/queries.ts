export const fetchByIdQuery = `query ($id: Int , $asHtml:Boolean = true) { 
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
    description(asHtml: $asHtml)
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
    season
    meanScore
    averageScore
    duration
    episodes
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
    studios {
        nodes {
          name
        }
    }
  }
}`;

export const topQuery = `query Query($page: Int, $perPage: Int, $type: MediaType, $format: MediaFormat, $status: MediaStatus, $isAdult: Boolean, $sort: [MediaSort]) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
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
      episodes
      duration
      season
      genres
      studios {
        nodes {
          name
        }
     }
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

export const popularAnimeQuery = `query Query($page: Int, $perPage: Int, $type: MediaType, $format: MediaFormat, $isAdult: Boolean, $sort: [MediaSort]) {
  Page(page: $page, perPage: $perPage) {
  pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
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
      episodes
      duration
      season
      genres
      studios {
        nodes {
          name
        }
     }
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
   pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
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
      episodes
      duration
      season
      genres
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
       format
      bannerImage
      coverImage {
        extraLarge
        large
        medium
        color
      }
      averageScore
      meanScore
      studios {
        nodes {
          name
        }
      }
    }
  }
}`;

export const searchQuery = `query Query($page: Int, $perPage: Int, $search: String, $type: MediaType, $isAdult: Boolean) {
  Page(page: $page, perPage: $perPage) {pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    media(search: $search, type: $type, isAdult: $isAdult) {
      id
      idMal
      episodes
      duration
      season
      title {
        romaji
        english
        native
        userPreferred
      }
      type
      format
      genres
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
      format
      averageScore
      meanScore
      studios {
        nodes {
          name
        }
      }
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
            medium
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

export const mediaTrendQuery = `query Query($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    media(type: ANIME, sort: [TRENDING_DESC, POPULARITY_DESC], isAdult: false) {
      id
      idMal
      title {
        romaji
        english
        native
        userPreferred
      }
      studios {
        nodes {
          name
        }
      }
      status
      description
      endDate {
        year
        month
        day
      }
      season
      episodes 
      averageScore
      meanScore
      popularity
      coverImage {
        extraLarge
        large
        medium
        color
      }
      format
      genres
    }
  }
}`;
export const relatedQuery = `query Media($mediaId: Int, $type: MediaType) {
  Media(id: $mediaId, type: $type) {
    relations {
      edges {
        node {
          id
          idMal
          title {
            romaji
            english
            native
            userPreferred
          }
          type
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
    }
  }
}`;

////kistu queries
export const kistuQuery = `query ExampleQuery($title: String!, $first: Int, $episodesFirst2: Int) {
  searchAnimeByTitle(title: $title, first: $first) {
    nodes {
      id
      slug
      titles {
        preferred
        romanized
        original
        translated
      
      }
      bannerImage {
        blurhash
        original {
          height
          name
          url
          width
        }
        views {
          height
          name
          url
          width
        }
      }
      episodes(first: $episodesFirst2) {
        nodes {
          thumbnail {
            blurhash
            original {
              url
            
            }
            views {
             
              name
              url
            }
          }
          description
          titles {
            localized
          }
          number
        }
      }
      posterImage {
        blurhash
        original {
          url
          name
        }
        views {
          name
          url
        }
      }
    }
  }
}


`;
// var  {
//   "title": "solo levelling",
//   "first": 5,
//   "episodesFirst2": 2000
// }
