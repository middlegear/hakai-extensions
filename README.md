

# Hakai Extensions

## Overview

**Hakai Extensions** is a  **TypeScript** package that simplifies fetching detailed **media data** from popular APIs like **Anilist**, **Jikan**, **The Movie Database**, and **TVMaze**. It maps this data into easy-to-use, structured class providers.An API is available visit the  <strong> [Docs 🤷](https://github.com/middlegear/documentation) </strong>

> **Disclaimer:**
> This package is **unofficial** and has **no affiliation** with Anilist, Jikan, The Movie Database, TVMaze, or any third-party providers. It does not host, own, or distribute content. All data remains the property of its respective owners.

-----

## 📦 Installation

Before you begin, make sure **Node.js** is installed on your system. You can then install using either npm or Yarn:

```bash
npm install hakai-extensions
```

```bash
yarn add hakai-extensions
```

-----

## Usage

To start using Hakai Extensions, import the classes you need:

```typescript
import { Meta, Anime, FlixHQ } from 'hakai-extensions';
```

-----

## 🏛 Modules and Classes

Hakai Extensions organizes its functionality into distinct modules, each accessible via a dedicated class.

### `Meta` Class

The `Meta` class is your go-to for retrieving **metadata** across various media sources.

#### Structure

  * **`Meta.Anilist`**: Fetches anime metadata from the **Anilist API**.
  * **`Meta.Jikan`**: Retrieves metadata from **Jikan (MyAnimeList API)**.
  * **`Meta.TheMovieDatabase`**: Accesses movie and TV show metadata from **The Movie Database API**.
  * **`Meta.TvMaze`**: Retrieves metadata from the **TVMaze API**.

#### Example

```typescript
const anilist = new Meta.Anilist();
const data = await anilist.search('akame ga kill');
console.log(data); 
```

### `Anime` Class

The `Anime` class provides access to specific anime content providers.

#### Structure

  * **`Anime.HiAnime`**
  * **`Anime.AnimeKai`**

### `FlixHQ` Class

The `FlixHQ` class serves as a dedicated provider for **movie and TV show content sources**.

-----

## 🎖 Credits

 **[Consumet](https://github.com/consumet/consumet.ts)**.





## ⚖ License

This project is licensed under the **[MIT License](LICENSE)**.

-----