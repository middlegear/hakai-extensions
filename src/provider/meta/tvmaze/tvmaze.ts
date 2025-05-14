import axios from 'axios';

const tvMazeApiUrl = 'https://api.tvmaze.com' as const;
export async function search() {
  try {
    const response = await axios.get(`${tvMazeApiUrl}`);
  } catch (error) {}
}
