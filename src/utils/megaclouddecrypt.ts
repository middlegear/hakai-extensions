export class MegacloudDecryptor {
  private readonly DEFAULT_CHARSET = Array.from({ length: 95 }, (_, i) => String.fromCharCode(i + 32));

  private deriveKey(secret: string, nonce: string): string {
    const input = secret + nonce;
    let hash = 0n;

    for (let i = 0; i < input.length; i++) {
      hash += hash * 173n + BigInt(input.charCodeAt(i));
    }

    const modHash = hash % 0x7fffffffffffffffn;

    const xorProcessed = [...input].map(char => String.fromCharCode(char.charCodeAt(0) ^ (15835827 & 0xff))).join('');

    const shift = (Number(modHash) % xorProcessed.length) + 7;
    const rotated = xorProcessed.slice(shift) + xorProcessed.slice(0, shift);

    const reversedNonce = [...nonce].reverse().join('');

    let interleaved = '';
    const maxLen = Math.max(rotated.length, reversedNonce.length);
    for (let i = 0; i < maxLen; i++) {
      interleaved += (rotated[i] || '') + (reversedNonce[i] || '');
    }

    const len = 96 + (Number(modHash) % 33);
    const sliced = interleaved.substring(0, len);

    return [...sliced].map(ch => String.fromCharCode((ch.charCodeAt(0) % 95) + 32)).join('');
  }

  private columnarTranspositionCipher(text: string, key: string): string {
    const cols = key.length;
    const rows = Math.ceil(text.length / cols);

    const grid = Array.from({ length: rows }, () => Array(cols).fill(''));
    const columnOrder = [...key]
      .map((char, idx) => ({ char, idx }))
      .sort((a, b) => a.char.charCodeAt(0) - b.char.charCodeAt(0));

    let i = 0;
    for (const { idx } of columnOrder) {
      for (let row = 0; row < rows; row++) {
        grid[row][idx] = text[i++] || '';
      }
    }

    return grid.flat().join('');
  }

  private deterministicUnshuffle(charset: string[], key: string): string[] {
    let seed = [...key].reduce((acc, char) => (acc * 31n + BigInt(char.charCodeAt(0))) & 0xffffffffn, 0n);

    const random = (limit: number): number => {
      seed = (seed * 1103515245n + 12345n) & 0x7fffffffn;
      return Number(seed % BigInt(limit));
    };

    const result = [...charset];
    for (let i = result.length - 1; i > 0; i--) {
      const j = random(i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }

  public decrypt(secret: string, nonce: string, encrypted: string, rounds = 3): string {
    let data = Buffer.from(encrypted, 'base64').toString('utf-8');
    const keyphrase = this.deriveKey(secret, nonce);

    for (let round = rounds; round >= 1; round--) {
      const passphrase = keyphrase + round;

      let seed = [...passphrase].reduce((acc, char) => (acc * 31n + BigInt(char.charCodeAt(0))) & 0xffffffffn, 0n);
      const random = (limit: number): number => {
        seed = (seed * 1103515245n + 12345n) & 0x7fffffffn;
        return Number(seed % BigInt(limit));
      };

      data = [...data]
        .map(char => {
          const idx = this.DEFAULT_CHARSET.indexOf(char);
          if (idx === -1) return char;
          const offset = random(95);
          return this.DEFAULT_CHARSET[(idx - offset + 95) % 95];
        })
        .join('');

      data = this.columnarTranspositionCipher(data, passphrase);

      const shuffled = this.deterministicUnshuffle(this.DEFAULT_CHARSET, passphrase);
      const mapping: Record<string, string> = {};
      shuffled.forEach((c, i) => (mapping[c] = this.DEFAULT_CHARSET[i]));
      data = [...data].map(char => mapping[char] || char).join('');
    }
    const lengthStr = data.slice(0, 4);
    let length = parseInt(lengthStr, 10);
    if (isNaN(length) || length <= 0 || length > data.length - 4) {
      console.error('Invalid length in decrypted string');
      return data;
    }
    return data.slice(4, 4 + length);
  }
}

//
// const decryptor = new MegacloudDecryptor();
// const sources = decryptor.decrypt(
//   'qG2bX1DaU4iVlbZVB291UyUwwmp0eIQG6VFg2VmE9S2KznZieE', // secret
//   'tTJIdwuxn2qST1ozBxhQbuSUzBMifAQkhRxxXbYM3qTa9NVj', // nonce(dom)
//   'dT5xTlNsJXwufmtPPCR+WnV9LWcsYGFCI3VKXV5JZnIrajRPMSdXRU0ucS81Jm81Lyw+RltcZzctVD5HU2RpRSRqTjNUdGdHbU9uWWlXQ2pqa1NnLkR4LXd9Y3xSdV1mVFk8a3x7NU9QYHU/dntSUV9vImxnc1E6UWUgLVE8LlUnZ187Z005TWg+OTEvIV09KGtCbnFGcHw4M0gpdm8+MldxYCVjenpFKVl6IFc7RnV8JXcydUcjIiBmYV8+bz4oNn51dS42Uix8bDg9bkBFTn02bi0zfTs+eEFjbjc9Qk9ZPXVMUzp+biFxKidvWVZKVGY/a2dgOS9kd2RwaFcxXmhCKVQ/XWY0PmImWHhbZFcpI3JqTWQ9K1tCXEhkdEFhbmxuRXZjJiVLQGZLY2FhSkVtUEJHRzNXcF1hJ1Y1Tjc5bGNbZmhIQHwna293amc0MmsuWCIrQ35gUGJzZmR4ZzdyJjp7SSpvfFs4Jik+QCl0Uyh7PmM4LGd0I0xlPFEqWTdPcVlcTkp0XWNrXkFlLU41XjRQUVlFUlk1Rz5TZGtWS250SihEcDonNXtyYCwockd1IDUvV3FadW4nVXReY3htMSB5MSw1SXVVfGp3c1R2a01iWUBcNUZ4VWx2LUcmQlsqXCVbOSwxIHZObTNsJyBHZGU=',
// );
