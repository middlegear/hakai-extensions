export class Decrypter {
  private static readonly DefaultCharacterSet: string[] = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i));
  private readonly characterSet: string[];

  constructor(characterSet: string[] = Decrypter.DefaultCharacterSet) {
    this.characterSet = [...characterSet];
  }

  private LinearCongruentialPrng(seed: number): () => number {
    let currentSeed = seed >>> 0;
    return () => {
      currentSeed = (currentSeed * 16807) % 2147483647;
      return currentSeed;
    };
  }

  private hashKeyphraseToSeed(keyphrase: string): number {
    let seed = 0;
    for (let i = 0; i < keyphrase.length; i++) {
      seed = (seed << 5) - seed + keyphrase.charCodeAt(i);
      seed |= 0;
    }
    return seed;
  }

  private FisherYatesShuffle(array: string[], keyphrase: string): string[] {
    const seed = this.hashKeyphraseToSeed(keyphrase);
    const prng = this.LinearCongruentialPrng(seed);
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
      const j = prng() % (i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }

  private ColumnarTranspositionCipher(encryptedText: string, keyphrase: string): string {
    const cols = keyphrase.length;
    const key = keyphrase.split('').map((char, index) => ({ char, index }));
    const sortedKey = key.sort((a, b) => a.char.localeCompare(b.char));

    const numRows = Math.ceil(encryptedText.length / cols);
    const numFullCols = encryptedText.length % cols || cols;

    const decryptedGrid: string[][] = Array.from({ length: numRows }, () => Array(cols).fill(''));

    let charIndex = 0;
    for (const { index: originalColIndex } of sortedKey) {
      for (let row = 0; row < numRows; row++) {
        if (row === numRows - 1 && originalColIndex >= numFullCols) {
          continue;
        }
        decryptedGrid[row][originalColIndex] = encryptedText[charIndex++];
      }
    }
    return decryptedGrid.flat().join('');
  }

  public decrypt(encrypted: string, nonce: string, secret: string, iterations: number = 3): string {
    if (!encrypted || !nonce || !secret) {
      throw new Error('Missing encrypted data, nonce, or secret.');
    }

    let result: string;
    try {
      result = Buffer.from(encrypted, 'base64').toString('utf8');
    } catch (error) {
      throw new Error(`Base64 decoding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    const keyphrase = secret + nonce;

    for (let i = 1; i <= iterations; i++) {
      const passphrase = keyphrase + i;

      const shuffled = this.FisherYatesShuffle(this.characterSet, passphrase);
      const mapping = new Map<string, string>();
      this.characterSet.forEach((char, idx) => {
        mapping.set(shuffled[idx], char);
      });
      result = result
        .split('')
        .map(c => mapping.get(c) || c)
        .join('');

      result = this.ColumnarTranspositionCipher(result, passphrase);

      const seed = this.hashKeyphraseToSeed(passphrase);
      const prng = this.LinearCongruentialPrng(seed);
      result = result
        .split('')
        .map(char => {
          const charIndex = this.characterSet.indexOf(char);
          if (charIndex === -1) {
            return char;
          }
          const offset = prng() % this.characterSet.length;
          return this.characterSet[(charIndex - offset + this.characterSet.length) % this.characterSet.length];
        })
        .join('');
    }

    const lengthStr = result.slice(0, 4);
    const content = result.slice(4);
    const length = parseInt(lengthStr, 10);

    if (isNaN(length) || length <= 0 || length > content.length) {
      console.error('Invalid length prefix. Returning full decrypted string.');
      return content;
    }

    return content.slice(0, length);
  }
}
