/**
 * Decrypter class for JWPlayer sources decryption.
 */
class Decrypter {
  private key: string;
  private characterSet: string[];

  /**
   * Constructor for Decrypter.
   * @param key The dynamic decryption key provided by the user (from v27 + v32).
   * @param characterSet Optional character set for substitution (defaults to ASCII 32–126). /// needs investigation cause its picking 32object object
   */
  constructor(key: string, characterSet: string[] = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i))) {
    if (!key) {
      throw new Error('Decryption key must be provided');
    }
    this.key = key;
    this.characterSet = [...characterSet];
  }

  /**
   * Linear Congruential Generator (LCG) for shuffling.
   */
  private lcg(state: number): { next: (modulus: number) => number } {
    let currentState = state;
    return {
      next: (modulus: number): number => {
        currentState = (currentState * 1103515245 + 12345) & 0x7fffffff;
        return currentState % modulus;
      },
    };
  }

  /**
   * Hashes the key to seed the LCG.
   */
  private hashString(str: string): number {
    return str.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) & 0xffffffff, 0);
  }

  /**
   * Shuffles the character set.
   */
  private shuffleArray(array: string[]): string[] {
    const hash = this.hashString(this.key);
    const lcg = this.lcg(hash);
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
      const j = lcg.next(i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }

  /**
   * Transposition cipher using a grid-based permutation.
   */
  private transposeString(input: string): string {
    const keyLength = this.key.length;
    const rows = Math.ceil(input.length / keyLength);
    const grid: string[][] = Array.from({ length: rows }, () => Array(keyLength).fill(' '));

    const keyChars = this.key.split('').map((char, idx) => ({ char, idx }));
    const sortedKey = [...keyChars].sort((a, b) => a.char.localeCompare(b.char));

    let inputIndex = 0;
    sortedKey.forEach(({ idx }) => {
      for (let row = 0; row < rows && inputIndex < input.length; row++) {
        grid[row][idx] = input[inputIndex++] || ' ';
      }
    });

    let result = '';
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < keyLength; col++) {
        result += grid[row][col];
      }
    }

    return result;
  }

  /**
   * Substitution cipher using the shuffled character set.
   */
  private substituteString(input: string, original: string[], shuffled: string[]): string {
    const mapping: { [key: string]: string } = {};
    original.forEach((char, i) => {
      mapping[shuffled[i]] = char;
    });

    return input
      .split('')
      .map(char => mapping[char] || char)
      .join('');
  }

  /**
   * Decrypts the base64-encoded sources string.
   * @param encrypted Base64-encoded string
   * @param iterations Number of iterations (default 3)
   * @returns Decrypted string (JSON-parseable sources)
   */
  public decrypt(encrypted: string, iterations: number = 3): string {
    let result = atob(encrypted);
    console.log('Base64 decoded:', result); // Debug
    const originalCharacterSet = [...this.characterSet];

    for (let i = 0; i < iterations; i++) {
      const shuffledCharacterSet = this.shuffleArray(this.characterSet);
      result = this.transposeString(result);
      console.log(`After iteration ${i + 1} transpose:`, result); // Debug
      result = this.substituteString(result, originalCharacterSet, shuffledCharacterSet);
      console.log(`After iteration ${i + 1} substitute:`, result); // Debug
    }

    const final = result.slice(4);
    console.log('Final decrypted:', final); // Debug
    return final;
  }

  /**
   * Sets up JWPlayer sources by decrypting and parsing.
   * @param encryptedSources Base64-encoded sources string
   * @returns Parsed sources array or empty array on error
   */
  public setupPlayerSources(encryptedSources: string): any[] {
    try {
      const decrypted = this.decrypt(encryptedSources);
      const sources = JSON.parse(decrypted);
      if (!Array.isArray(sources)) {
        throw new Error('Decrypted sources is not an array');
      }
      console.log('Decrypted sources:', sources);
      return sources;
    } catch (error) {
      console.error('Decryption or parsing error:', error);
      return [];
    }
  }
}
export { Decrypter };
