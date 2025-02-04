// import { AnimeZ, Anitaku, HiAnime } from '../..';
// import { getInfoById } from './jikan';
// import { Providers } from './types';

// export async function getAnimeTitle(
//   id: number,
//   provider: Providers = Providers.Anitaku
// ) {
//   try {
//     const data = await getInfoById(id);
//     const englishTitle = data.animeInfo?.title.english as string;
//     // const Romanjititle = data.animeInfo?.title.Romanji as string;
//     let resultProvider;
//     switch (provider) {
//       case Providers.Anitaku: {
//         const gogoanime = new Anitaku();
//         try {
//           const gogo = gogoanime.search(englishTitle);
//           resultProvider = (await gogo).anime?.map((item: any) => ({
//             animeId: item.id,
//             romanji: item.title,
//           }));
//         } catch (error) {
//           return error;
//         }

//         break;
//       } //////can ony scrape english titles this needs promise all stuff and also search suggestions here
//       case Providers.AnimeZ: {
//         const animeZ = new AnimeZ();
//         try {
//           const data = animeZ.search(englishTitle);

//           resultProvider = (await data).anime?.map((item: any) => ({
//             animeId: item.id,
//             name: item.title,
//           }));
//         } catch (error) {
//           return error;
//         }

//         break;
//       }

//       default:
//       case Providers.HiAnime: {
//         const zoro = new HiAnime();
//         try {
//           const data = zoro.search(englishTitle);
//           resultProvider = (await data).anime?.map((item: any) => ({
//             animeId: item.id,
//             name: item.name,
//             romanji: item.romanji,
//           }));
//         } catch (error) {
//           return error;
//         }

//         break;
//       }
//     }
//     return {
//       data,
//       resultProvider,
//     };
//   } catch (error) {
//     return error;
//   }
// }
// // Example usage
// // getAnimeByID(56784);
