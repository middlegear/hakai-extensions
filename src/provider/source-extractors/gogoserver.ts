import CryptoJS from "crypto-js";
import * as cheerio from "cheerio";

import { anitakuClient } from "../../config";

export async function GogoServer(videoUrl: URL) {
  const keys = {
    key: CryptoJS.enc.Utf8.parse("37911490979715163134003223491201"),
    iv: CryptoJS.enc.Utf8.parse("3134003223491201"),
    secondKey: CryptoJS.enc.Utf8.parse("54674138327930866480207815084989"),
  } as const;

  try {
    const res = await anitakuClient.get(`${videoUrl.href}`);
    const data$: cheerio.CheerioAPI = cheerio.load(res.data);
    const scriptVal = data$('script[data-name="episode"]').attr(
      "data-value"
    ) as string;

    const id = videoUrl.searchParams.get("id") ?? "";

    const encryptedKey = CryptoJS.AES.encrypt(id, keys.key, {
      iv: keys.iv,
    });
    const token = CryptoJS.AES.decrypt(scriptVal, keys.key, {
      iv: keys.iv,
    }).toString(CryptoJS.enc.Utf8);

    try {
      const response = await anitakuClient.get(
        `${videoUrl.protocol}//${videoUrl.hostname}/encrypt-ajax.php?id=${encryptedKey}&alias=${id}&${token}`,
        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            Referer: videoUrl.href,
          },
        }
      );
      const encryptedRes = response.data.data;
      const decryptRes = CryptoJS.AES.decrypt(encryptedRes, keys.secondKey, {
        iv: keys.iv,
      }).toString(CryptoJS.enc.Utf8);

      return JSON.parse(decryptRes);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : " unkown stuff",
      };
    }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Check for valid videoUrl href",
    };
  }
}
