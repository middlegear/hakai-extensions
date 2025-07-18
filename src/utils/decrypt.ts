// Define the character set (ASCII 32–126)
const DefaultCharacterSet: string[] = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i));

export class Decrypter {
  private nonce: string;
  private secret: string;
  private characterSet: string[];

  constructor(nonce: string, secret: string, characterSet: string[] = DefaultCharacterSet) {
    this.nonce = nonce;
    this.secret = secret;
    this.characterSet = [...characterSet];
  }

  private generateSeed(keyphrase: string): number {
    return [...keyphrase].reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) & 0xffffffff, 0);
  }

  private random(seed: number): (limit: number) => number {
    let currentSeed = seed;
    return (limit: number) => {
      currentSeed = (1103515245 * currentSeed + 12345) & 0x7fffffff;
      return currentSeed % limit;
    };
  }

  private deterministicShuffle(array: string[], keyphrase: string): string[] {
    const seed = this.generateSeed(keyphrase);
    const random = this.random(seed);
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
      const j = random(i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }

  private columnarTranspositionCipher(text: string, keyphrase: string): string {
    const cols = keyphrase.length;
    const rows = Math.ceil(text.length / cols);
    const grid = Array.from({ length: rows }, () => Array(cols).fill(''));

    const columnOrder = keyphrase
      .split('')
      .map((char, idx) => ({ char, idx }))
      .sort((a, b) => a.char.localeCompare(b.char));

    let i = 0;
    for (const { idx } of columnOrder) {
      for (let row = 0; row < rows; row++) {
        grid[row][idx] = text[i++] || '';
      }
    }

    let result = '';
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        result += grid[row][col];
      }
    }

    return result;
  }

  public decrypt(encrypted: string, iterations: number = 3): string {
    if (!encrypted) {
      throw new Error('Missing parameters: source data').message;
    }

    let result: string;
    try {
      result = Buffer.from(encrypted, 'base64').toString('utf8');
    } catch (error) {
      throw new Error(`Base64 decoding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    const keyphrase = this.secret + this.nonce;
    for (let i = iterations; i >= 1; i--) {
      const passphrase = keyphrase + i;

      const seed = this.generateSeed(passphrase);
      const random = this.random(seed);
      result = result
        .split('')
        .map(char => {
          const idx = this.characterSet.indexOf(char);
          if (idx === -1) return char;
          const offset = random(95);
          return this.characterSet[(idx - offset + 95) % 95];
        })
        .join('');

      // Apply columnar transposition cipher
      result = this.columnarTranspositionCipher(result, passphrase);

      // Apply deterministic substitution
      const shuffled = this.deterministicShuffle(this.characterSet, passphrase);
      const mapping: { [key: string]: string } = {};
      shuffled.forEach((char, idx) => {
        mapping[char] = this.characterSet[idx];
      });
      result = result
        .split('')
        .map(c => mapping[c] || c)
        .join('');
    }

    const lengthStr = result.slice(0, 4);
    let length = parseInt(lengthStr, 10);
    if (isNaN(length) || length <= 0 || length > result.length - 4) {
      console.error('Invalid length in decrypted string');
      return result;
    }
    return result.slice(4, 4 + length);
  }
}
