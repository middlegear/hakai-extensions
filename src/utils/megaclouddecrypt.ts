export class MegacloudDecryptor {
  private readonly charset: string[] = Array.from({ length: 95 }, (_, i) => String.fromCharCode(i + 32));

  private mulberry32(seed: number): () => number {
    return () => {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  private hashKeyToSeed(key: string): bigint {
    let hash = 0n;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31n + BigInt(key.charCodeAt(i))) & 0xffffffffn;
    }
    return hash;
  }

  private makePRNG(key: string): () => number {
    const seed = this.hashKeyToSeed(key);
    return this.mulberry32(Number(seed));
  }

  private fisherYatesUnshuffle(input: string, seedKey: string): string {
    const arr = [...input];
    const prng = this.makePRNG(seedKey);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(prng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  }

  private remapCharacters(data: string, dict: string[]): string {
    return [...data]
      .map(char => {
        const idx = dict.indexOf(char);
        return idx !== -1 ? this.charset[idx] : char;
      })
      .join('');
  }

  private columnarTranspositionCipher(input: string, key: string): string {
    const cols = key.length;
    const rows = Math.ceil(input.length / cols);
    const matrix = Array.from({ length: rows }, () => Array(cols).fill(' '));

    const keyOrder = [...key]
      .map((char, index) => ({ char, idx: index }))
      .sort((a, b) => a.char.charCodeAt(0) - b.char.charCodeAt(0));

    let pointer = 0;
    for (const { idx } of keyOrder) {
      for (let r = 0; r < rows; r++) {
        if (pointer < input.length) {
          matrix[r][idx] = input[pointer++];
        }
      }
    }

    return matrix.flat().join('');
  }

  /**

   * @param encoded The base64 'sources' value from the Megacloud player.
   * @param key The PRNG seed and transposition key.
   *
   * ⚠️ key may be '[object Object][object Object]'or static key(fk this shit) + nonce key
   */
  public decrypt(encoded: string, key: string): string {
    const raw = Buffer.from(encoded, 'base64').toString('utf-8');

    const unshuffled = this.fisherYatesUnshuffle(raw, key);
    const remapped = this.remapCharacters(unshuffled, this.charset);
    const transposed = this.columnarTranspositionCipher(remapped, key);

    const lenStr = transposed.slice(0, 4);
    const len = parseInt(lenStr, 10);
    if (isNaN(len) || len <= 0 || len > transposed.length - 4) {
      console.error('Invalid length in decrypted string');
      return transposed;
    }

    return transposed.slice(4, 4 + len);
  }
}
