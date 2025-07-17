/**
 * Decrypter class for JWPlayer sources decryption.
 */
class Decrypter {
  private key: string;
  private characterSet: string[];

  /**
   * Constructor for Decrypter.
   * @param key The dynamic decryption key provided by the user (from v27 + v32).
   * @param characterSet Optional character set for substitution (defaults to ASCII 32–126). /// needs investigation cause its picking 32object object(which is mostlikely the seed string)
   */
  constructor(key: string, characterSet: string[] = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i))) {
    if (!key) {
      throw new Error('Decryption key must be provided');
    }
    this.key = key;
    this.characterSet = [...characterSet];
  }

  /**
   * Linear Congruential Generator (LCG) for shuffling. Investigate  implementation(I dont know what happens here cause there are some decoys used)
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
   * Computes a 32-bit non-cryptographic hash of a given string. After investigation this is correct
   *
   * This uses a Java-style polynomial rolling hash function:
   *   hash = (hash * 31 + charCode) % 2^32
   *
   * It ensures the result stays within 32-bit unsigned integer range using bitwise AND.
   * This function is used for seeding pseudo-random number generators (PRNGs)
   * or for generating deterministic keys based on string input.
   *
   * @param {string} str - The input string to hash.
   * @returns {number} A 32-bit unsigned integer hash value.
   *
   * @example
   * const seed = hashString("[object Object][object Object]"); // what i know this object object stuff is where the keys are concatanated
   * console.log(seed); // e.g., 3923610588
   */
  private hashString(str: string): number {
    return str.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) & 0xffffffff, 0);
  }

  /**
   * Shuffles the character set. This too needs investigation, if the lcg crashes then im cooked
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
   * Transposition cipher using a grid-based permutation. This function i have verified personally that it works fine
   *
   * 🧩 Matches original function `H(v0, J4)` from the deobfuscated script.
   *
   * 💡 Decryption-only columnar transposition cipher.
   *    Input is assumed to be encrypted using a row-based read of a grid,
   *    where the columns were written in sorted keyword order.
   *
   * The grid is reconstructed by filling columns in the original keyword positions,
   * then reading the characters row by row.
   *
   * @param input - The encrypted text to decode.
   * @returns The decrypted (reordered) string.
   *
   * @example
   * const output = this.transposeString("ESOXIPTNTAICR", "KEY");
   * console.log(output); // Might output: "EXPOSITIONTRACK"
   */
  private transposeString(input: string): string {
    const keyLength = this.key.length;
    const rows = Math.ceil(input.length / keyLength);

    // Initialize empty matrix of size [rows x keyLength], filled with spaces
    const grid: string[][] = Array.from({ length: rows }, () => Array(keyLength).fill(' '));

    // Create sortable key metadata (char + original index)
    const keyChars = this.key.split('').map((char, idx) => ({ char, idx }));
    const sortedKey = [...keyChars].sort((a, b) => a.char.localeCompare(b.char));

    // Fill the grid column-wise in the sorted key order
    let inputIndex = 0;
    sortedKey.forEach(({ idx }) => {
      for (let row = 0; row < rows && inputIndex < input.length; row++) {
        grid[row][idx] = input[inputIndex++] || ' ';
      }
    });

    // Read the grid row-wise to reconstruct the original string
    let result = '';
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < keyLength; col++) {
        result += grid[row][col];
      }
    }

    return result;
  }

  /**
   * 🧩 Substitution Cipher Decoder  This function works fine and is correct that matches the script
   * 💡 Monoalphabetic substitution
   *
   * Given an input string and a mapping from `shuffled` to `original`,
   * replaces each character in `input` using the reverse mapping.
   *
   * @param input - The encoded string to decode
   * @param original - The original character set (e.g. base alphabet)
   * @param shuffled - The shuffled version used in encoding
   * @returns The decoded string
   */
  private substituteString(input: string, original: string[], shuffled: string[]): string {
    const mapping: { [key: string]: string } = {};

    // Build reverse mapping: shuffled -> original
    original.forEach((char, i) => {
      mapping[shuffled[i]] = char;
    });

    // Replace each character in input using the reverse map
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
