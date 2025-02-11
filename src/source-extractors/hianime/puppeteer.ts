import axios from 'axios';
export async function puppeteer(id: string) {
  try {
    const response = await axios.get(`https://megacloud-resolver.onrender.com/api/resolve?id=${id}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Err',
    };
  }
}
