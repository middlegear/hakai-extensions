import axios from 'axios';

const keyFetchers = [
  async (): Promise<string | null> => {
    const url = 'https://raw.githubusercontent.com/yogesh-hacker/MegacloudKeys/refs/heads/main/keys.json';
    try {
      const response = await axios.get(url);
      const jsonData = response.data;
      if (typeof jsonData === 'object' && jsonData !== null && 'rabbit' in jsonData) {
        const key = (jsonData as any).rabbit;
        if (typeof key === 'string' && key.length > 0) {
          return key;
        }
        console.warn(`'rabbit' field is empty or not a string from ${url}.`);
        return null;
      }
      console.warn(`JSON from  does not contain an expected  field or is invalid.`);
      return null;
    } catch (error) {
      console.warn(`Failed to fetch key :`, (error as Error).message);
      return null;
    }
  },
];
