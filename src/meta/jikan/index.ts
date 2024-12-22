import { getCharacters, getInfoById } from "./jikan";

class Jikan {
  async fetchInfo(id: number) {
    return getInfoById(id);
  }
  async fetchCharacters(id: number) {
    return getCharacters(id);
  }
}

export { Jikan };
