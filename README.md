

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

#### **Examples**  

```typescript
import { Meta } from 'hakai-extensions';

const anilist = new Meta.Anilist();
const data = await anilist.search('akame ga kill');
``` 
## 🔄 API Response Example  

searching anime returns:  
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
```typescript
const jikan = new Meta.Jikan();
const data = await jikan.fetchRakuzanEpisodes(56784);
```
fetching episodes  returns: 
```json

{
  "success": true,
  "status": 200,
  "data": {
    "malId": 56784,
    "title": {
      "romaji": "Bleach: Sennen Kessen-hen - Soukoku-tan",
      "english": "Bleach: Thousand-Year Blood War - The Conflict",
      "native": "BLEACH 千年血戦篇-相剋譚-"
    },
    "image": "https://cdn.myanimelist.net/images/anime/1595/144074l.jpg",
    "bannerImage": "https://cdn.myanimelist.net/images/anime/1595/144074l.jpg",
    "trailer": "https://www.youtube.com/embed/tShYCQALuH8?enablejsapi=1&wmode=opaque&autoplay=1",
    "episodes": 14,
    "startDate": "October 5, 2024",
    "endDate": "December 28, 2024",
    "format": "TV",
    "status": "Finished Airing",
    "genres": [
      "Action",
      "Adventure",
      "Supernatural"
    ],
    "duration": "24 min per ep",
    "score": 8.69,
    "synopsis": "After an awe-inspiring battle with Ichibei Hyousube—leader of the Soul Society's Royal Guard—the powerful Yhwach moves into the final stage of his master plan. He aims to slay the Soul King, the being whose very existence maintains the status quo of three worlds: Hueco Mundo, the Soul Society, and the realm of humans that Ichigo Kurosaki and his closest friends hail from. Conquering his own bout with the remainder of the Royal Guard, Uryuu Ishida joins Yhwach in his efforts to create a new world in his image.\n\nWith a flood of resolution and newfound power, Ichigo rushes to stop Yhwach from accomplishing his ultimate goal and save the countless lives within the three existing realms. But Ichigo has a complicated lineage, one that leaves him susceptible to Yhwach's sinister influence.\n\nMeanwhile, in a final desperate gambit, Jirou Sakuranosuke Shunsui Kyouraku, the newly promoted head captain of the Soul Society's combat corps, enlists the help of an old enemy whose immense power may turn the tide of battle.\n\n[Written by MAL Rewrite]",
    "season": "fall",
    " studio": "[ [Object] ]",
   " producers": "[ [Object], [Object], [Object], [Object], [Object], [Object] ]"
  },
  "episodes": [
    {
      "episodeNumber": 1,
      "rating": 7.58,
      "aired": true,
      "episodeId": "bleach-thousand-year-blood-war-the-conflict-19322-episode-128444",
      "title": "A",
      "overview": "The battle between Squad Zero and Yhwach's Royal Guards for the Soul King rages on.",
      "thumbnail": "https://artworks.thetvdb.com/banners/v4/episode/10733782/screencap/6703166966621.jpg"
    },
    {
      "episodeNumber": 2,
      "rating": 9.12,
      "aired": true,
      "episodeId": "bleach-thousand-year-blood-war-the-conflict-19322-episode-128578",
      "title": "Kill the King",
      "overview": "Ichigo and his friends hurry to the Reio Greater Palace to stop Yhwach.",
      "thumbnail": "https://artworks.thetvdb.com/banners/v4/episode/10733783/screencap/67064b5b72759.jpg"
    },
    {
      "episodeNumber": 3,
      "rating": 7.24,
      "aired": true,
      "episodeId": "bleach-thousand-year-blood-war-the-conflict-19322-episode-128682",
      "title": "The Dark Arm",
      "overview": "Ichigo tries to remove the impaled sword from the Soul King and save his life.",
      "thumbnail": "https://artworks.thetvdb.com/banners/v4/episode/10733784/screencap/670f0ac4cb14b.jpg"
    },
    {
      "episodeNumber": 4,
      "rating": 1.83,
      "aired": true,
      "episodeId": "bleach-thousand-year-blood-war-the-conflict-19322-episode-128773",
      "title": "The Betrayer",
      "overview": "Ukitake takes the place of the slain Soul King by releasing the power of Mimihagi.",
      "thumbnail": "https://artworks.thetvdb.com/banners/v4/episode/10733785/screencap/671881ac5ad3e.jpg"
    },
    {
      "episodeNumber": 5,
      "rating": 3.9,
      "aired": true,
      "episodeId": "bleach-thousand-year-blood-war-the-conflict-19322-episode-128860",
      "title": "Against the Judgement",
      "overview": "Yhwach is overflowing with power from having absorbed the Soul King.",
      "thumbnail": "https://artworks.thetvdb.com/banners/v4/episode/10754400/screencap/6721cd466480f.jpg"
    },
    {
      "episodeNumber": 6,
      "rating": 3.21,
      "aired": true,
      "episodeId": "bleach-thousand-year-blood-war-the-conflict-19322-episode-128999",
      "title": "The Holy Newborn",
      "overview": "The Soul Reapers regroup to prepare their counterattack against the Quincies.",
      "thumbnail": "https://artworks.thetvdb.com/banners/v4/episode/10754401/screencap/672b02f429e7e.jpg"
    },
    {
      "episodeNumber": 7,
      "rating": 3.21,
      "aired": true,
      "episodeId": "bleach-thousand-year-blood-war-the-conflict-19322-episode-129095",
      "title": "Gate of the Sun",
      "overview": "Yhwach builds his new castle, Wahr Welt.",
      "thumbnail": "https://artworks.thetvdb.com/banners/v4/episode/10754402/screencap/6734384503e2a.jpg"
    },
    {
      "episodeNumber": 8,
      "rating": 4.74,
      "aired": true,
      "episodeId": "bleach-thousand-year-blood-war-the-conflict-19322-episode-129185",
      "title": "Baby, Hold Your Hand",
      "overview": "Kenpachi and Mayuri's group advance through Vier Ast.",
      "thumbnail": "https://artworks.thetvdb.com/banners/v4/episode/10754403/screencap/673cc01e6c685.jpg"
    },
    {
      "episodeNumber": 9,
      "rating": 6.53,
      "aired": true,
      "episodeId": "bleach-thousand-year-blood-war-the-conflict-19322-episode-129285",
      "title": "Don`t Chase a Shadow",
      "overview": "The change in Mayuri's Spiritual Pressure is also felt elsewhere by Urahara and Kyoraku.",
      "thumbnail": "https://artworks.thetvdb.com/banners/v4/episode/10754404/screencap/6746bdb457c"
    },
     {
      "episodeNumber": 10,
      "rating": 8.2,
      "aired": true,
      "episodeId": "bleach-thousand-year-blood-war-the-conflict-19322-episode-129599",
      "title": "Baby, Hold Your Hand 2 [Never Ending My Dream]",
      "overview": "Nemu ignores Mayuri's orders by intervening in his battle against Pernida.",
      "thumbnail": "https://artworks.thetvdb.com/banners/v4/episode/10754405/screencap/674f9ec7c0c16.jpg"
    },
    {
      "episodeNumber": 11,
      "rating": 6.6,
      "aired": true,
      "episodeId": "bleach-thousand-year-blood-war-the-conflict-19322-episode-130432",
      "title": "Shadows Gone",
      "overview": "Lille undergoes further transformation to hunt down and pass judgment on Kyoraku.",
      "thumbnail": "https://artworks.thetvdb.com/banners/v4/episode/10754406/screencap/675ab97feaf11.jpg"
    },
    {
    "episodeNumber": 12,
    "rating": 5.16,
    "aired": true,
    "episodeId": "bleach-thousand-year-blood-war-the-conflict-19322-episode-130768",
    "title": "Friend",
    "overview": "Haschwalth finds himself confronted by Bazz-B.",
    "thumbnail": "https://artworks.thetvdb.com/banners/v4/episode/10754407/screencap/6762a51f33dc7.jpg"
    },
    {
    "episodeNumber": 13,
    "rating": 5.26,
    "aired": true,
    "episodeId": "bleach-thousand-year-blood-war-the-conflict-19322-episode-131101",
    "title": "The Visible Answer",
    "overview": "Kyoraku has paved the way for the Soul Reapers to reach the enemy's stronghold.",
    "thumbnail": "https://artworks.thetvdb.com/banners/v4/episode/10857652/screencap/676d7bda7d440.jpg"
    },
    {
    "episodeNumber": 14,
    "rating": 2.02,
    "aired": true,
    "episodeId": "bleach-thousand-year-blood-war-the-conflict-19322-episode-131103",
    "title": "My Last Words",
    "overview": "The battle between Squad Zero and Yhwach's Royal Guards for the Soul King rages on.",
    "thumbnail": "https://artworks.thetvdb.com/banners/v4/episode/10733782/screencap/6703166966621.jpg"
    }

  ]
}
```
---

### `Anime` Class  

The `Anime` class provides access to anime providers for sources

#### **Structure**  

- **`Anime.RakuzanAnime`**  
- **`Anime.KagamiAnime`**  

#### **Example**  

```typescript
import { Anime } from 'hakai-extensions';

const zoro = new Anime.RakuzanAnime();
const data = await zoro.fetchSources('bleach-thousand-year-blood-war-the-conflict-19322-episode-128578');
console.log(data)
```
fetching episodeSources returns:
```json
{
  "success": true,
  "status": 200,
  "data": {
    "intro": {
      "start": 169,
      "end": 270
    },
    "outro": {
      "start": 1357,
      "end": 1448
    },
    "sources": [
      {
        "url": "https://gg3.jonextugundu.net/_v7/dda8797f088784e2d24e400a1f1850df291385b0fb0197eaac9e7bf8d0b565c6c2b2c8c0fe12b74bb83a55549c5ec6299025e6ce3f385f1804a3a6a0230f0d5aded0476ddfb61cec01389d45b062cb1de2246a7fb8e614aa5badfa8d844b70b0c56a969bf915ea543b2b0aa5340d5f0e2544ed000bb16442ce8de6534364954c/master.m3u8",
        "isM3U8": true,
        "type": "hls"
      }
    ],
    "subtitles": [
      {
        "url": "https://ccb.megafiles.store/6b/07/6b07fd2233dbeed89a932c63e460c871/eng-2.vtt",
        "lang": "English"
      },
      {
        "url": "https://imgb.megafiles.store/_a_preview/77/774781b623c2b02c78eb551da68ead3f/thumbnails/sprite.vtt",
        "lang": "thumbnails"
      }
    ]
  }
}

```
---  


## ⚖ License  

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.