
## Overview

The **hakai-extensions** is a TypeScript package designed to fetch detailed anime-related data from the Anilist/Jikan API. It provides a comprehensive set of methods to search for anime, retrieve detailed information, fetch characters, episodes, and more.

## Some Methods

- **Search Anime**: Search for anime by title with pagination support.
- **Fetch Anime Details**: Retrieve detailed information about an anime by its Anilist ID.
- **Top Airing Anime**: Fetch a list of top airing anime.
- **Popular Anime**: Get the most popular anime based on format (TV, Movie, etc.).
- **Top Rated Anime**: Fetch top-rated anime with customizable filters.
- **Seasonal Anime**: Retrieve anime for a specific season and year.
- **Trending Anime**: Get trending anime with pagination support.
- **Upcoming Anime**: Fetch a list of upcoming anime.
- **Related Anime**: Retrieve related anime for a specific title.
- **Anime Characters**: Fetch characters from an anime with sorting options.
- **Anime Episodes**: Retrieve anime episodes with provider-specific details.

## Installation

To use this package, ensure you have Node.js and npm installed. Then, install the package via npm:

```bash
npm i hakai-extensions
```

## Usage example

### Importing the Package

```typescript
import { Anilist } from 'hakai-extensions';
```

### Initializing the Anilist Class

```typescript
const anilist = new Anilist();
```

### Example Methods

#### Search for Anime

```typescript
const searchResults = await anilist.search("Naruto", 1, 10);
console.log(searchResults);
```

#### Fetch Anime Details

```typescript
const animeInfo = await anilist.fetchInfo(1); // Replace 1 with the desired Anilist ID
console.log(animeInfo);
```

#### Fetch Top Airing Anime

```typescript
const topAiring = await anilist.fetchAiring(1, 10);
console.log(topAiring);
```
