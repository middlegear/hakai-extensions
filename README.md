

#  Hakai Extensions  


##  Overview  

**Hakai Extensions** is a **TypeScript** package designed to fetch detailed **anime-related data** from the **Anilist** and **Jikan** APIs, mapped to structured class providers.  

> **Disclaimer:**  
> This package is **unofficial** and is **not affiliated** with Anilist, Jikan, or any third-party providers. It does not host, own, or distribute any content. All data belongs to its respective owners.  

---  

## Features  

✔ **Search Anime** – Look up anime by title with pagination.  
✔ **Fetch Anime Details** – Retrieve metadata such as synopsis, genres, and release dates.  
✔ **Anime Characters** – Fetch anime character lists with sorting options.  
✔ **Anime Episodes** – Retrieve episode lists with provider-specific details.  

---  

## 📦 Installation  

Ensure **Node.js** is installed, then install via npm or Yarn:  

```bash
npm install hakai-extensions
```

```bash
yarn add hakai-extensions
```

---  

##  Usage  

Import and fetch anime data from different sources:  

```typescript
import { Meta, Anime } from 'hakai-extensions';

// Fetch anime details from Anilist
const anilist = new Meta.Anilist();
const animeData = await anilist.getAnime('Naruto');

// Fetch episodes from a provider
const hiAnime = new Anime.HiAnime();
const episodes = await hiAnime.getEpisodes('One Piece');

console.log(animeData, episodes);
```

---  

## 🏛 Modules and Classes  

###  `Meta` Class  

The `Meta` class provides **metadata retrieval** from various sources.  

#### **Structure**  

- **`Meta.Anilist`** – Fetches anime/manga metadata from **Anilist API**.  
- **`Meta.Jikan`** – Retrieves metadata from **Jikan (MyAnimeList API)**.  

#### **Example**  

```typescript
import { Meta } from 'hakai-extensions';

const anilist = new Meta.Anilist();
const animeInfo = await anilist.getAnime('akame ga kill');

const jikan = new Meta.Jikan();
const animeList = await jikan.searchAnime('One Piece');
```

---

### `Anime` Class  

The `Anime` class provides access to anime providers.  

#### **Structure**  

- **`Anime.HiAnime`** – Fetches anime from **HiAnime**.  
- **`Anime.AnimeKai`** – Retrieves anime from **AnimeKai**.  

#### **Example**  

```typescript
import { Anime } from 'hakai-extensions';

const hiAnime = new Anime.HiAnime();
const episodes = await hiAnime.getEpisodes('Dragon Ball Z');
console.log(episodes)
```

---  

## 🔄 API Response Example  

searching anime details returns:  

```json
{
  "success": true,
  "status": 200,
  "hasNextPage": false,
  "currentPage": 1,
  "total": 2,
  "lastPage": 1,
  "perPage": 20,
  "data": [
    {
      "malId": 22199,
      "anilistId": 20613,
      "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx20613-4VGGPacciJBL.jpg",
      "color": "#e45d43",
      "bannerImage": "https://s4.anilist.co/file/anilistcdn/media/anime/banner/20613-CoEQF4qKiWDX.jpg",
      "title": {
        "english": "Akame ga Kill!",
        "romaji": "Akame ga Kill!",
        "native": "アカメが斬る！"
      },
      "trailer": {
        "id": "QFAIwYg4Fo4",
        "site": "YouTube",
        "thumbnail": "https://img.youtube.com/vi/QFAIwYg4Fo4/maxresdefault.jpg"
      },
      "format": "TV",
      "status": "FINISHED",
      "duration": 24,
      "score": 72,
      "genres": ["Action", "Fantasy", "Drama"],
      "episodes": 24,
      "synopsis": "In a land where corruption rules...",
      "season": "SUMMER",
      "startDate": "July 7, 2014",
      "endDate": "December 15, 2014",
      "studio": "White Fox",
      "producers": ["Square Enix", "TOHO animation"]
    }
  ]
}
```

---

## ⚖ License  

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.