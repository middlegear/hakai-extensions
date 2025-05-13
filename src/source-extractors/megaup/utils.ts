class AnimekaiDecoder {
  private readonly keysChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-~!*().'";

  private base64DecodeArray(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  private base64Encode(bytes: Uint8Array): string {
    let binaryString = '';
    for (let i = 0; i < bytes.length; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    return btoa(binaryString);
  }

  generateToken(n: string, homeKeysSrc: string[]): string {
    const homeKeys: Uint8Array[] = homeKeysSrc.map(key => this.base64DecodeArray(key));
    const encoded = encodeURIComponent(n);
    const o: number[] = [];
    for (let i = 0; i < encoded.length; i++) {
      const key = homeKeys[this.keysChar.indexOf(encoded[i])];
      o.push(key[i % key.length]);
    }
    return this.base64Encode(new Uint8Array(o)).replace(/\//g, '_').replace(/\+/g, '-').replace(/=+$/, '');
  }

  decodeIframeData(n: string, homeKeysSrc: string[]): string {
    const homeKeys: Uint8Array[] = homeKeysSrc.map(key => {
      const base64 = key.replace(/_/g, '/').replace(/-/g, '+');
      const binaryString = atob(base64);
      const decodedKey = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        decodedKey[i] = binaryString.charCodeAt(i);
      }
      return decodedKey;
    });

    const base64Decoded = n.replace(/_/g, '/').replace(/-/g, '+');
    const binaryDecoded = atob(base64Decoded);
    const decoded = new Uint8Array(binaryDecoded.length);

    const o = new StringBuilder();
    for (let i = 0; i < decoded.length; i++) {
      const c = decoded[i];
      let cp = '%';
      for (let j = 0; j < homeKeys.length; j++) {
        const k = homeKeys[j];
        const ck = k[i % k.length];
        if (c === ck) {
          cp = this.keysChar[j];
          break;
        }
      }
      o.append(cp);
    }

    const url = decodeURIComponent(o.toString());
    return url.replace("'", '.'); // Corrected line: Replaces only the first occurrence
  }
  decode(n: string, megaKeysSrc: string[]): string {
    const megaKeys: Uint8Array[] = megaKeysSrc.map(key => {
      const base64 = key.replace(/_/g, '/').replace(/-/g, '+');
      const binaryString = atob(base64);
      const decodedKey = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        decodedKey[i] = binaryString.charCodeAt(i);
      }
      return decodedKey;
    });

    const base64Decoded = n.replace(/_/g, '/').replace(/-/g, '+');
    const binaryDecoded = atob(base64Decoded);
    const decoded = new Uint8Array(binaryDecoded.length);

    const o: number[] = [];
    for (let i = 0; i < decoded.length; i++) {
      const c = decoded[i] & 0xff;
      const k = megaKeys[c];
      o.push(k[i % k.length]);
    }
    return decodeURIComponent(String.fromCharCode(...o));
  }

  private base64UrlEncode(str: string): string {
    const bytes = new TextEncoder().encode(str);
    return this.base64Encode(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  private base64UrlDecode(n: string): string {
    const padded = n.padEnd(n.length + ((4 - (n.length % 4)) % 4), '=');
    const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder('iso-8859-1').decode(bytes);
  }

  private transform(n: string, t: string): string {
    const v = Array.from({ length: 256 }, (_, i) => i);
    let c = 0;
    const f = new StringBuilder();
    for (let w = 0; w < 256; w++) {
      c = (c + v[w] + n.charCodeAt(w % n.length)) % 256;
      [v[w], v[c]] = [v[c], v[w]];
    }
    let a = 0;
    let w = 0;
    c = 0;
    while (a < t.length) {
      w = (w + 1) % 256;
      c = (c + v[w]) % 256;
      [v[w], v[c]] = [v[c], v[w]];
      f.append(String.fromCharCode(t.charCodeAt(a) ^ v[(v[w] + v[c]) % 256]));
      a++;
    }
    return f.toString();
  }

  private reverseIt(input: string): string {
    return input.split('').reverse().join('');
  }

  private substitute(input: string, keys: string, values: string): string {
    const map: { [key: string]: string } = {};
    for (let i = 0; i < keys.length; i++) {
      map[keys[i]] = values[i] || keys[i];
    }
    let result = '';
    for (const char of input) {
      result += map[char] || char;
    }
    return result;
  }

  private encodeURIComponent(value: string): string {
    return encodeURIComponent(value);
  }

  private decodeURIComponent(value: string): string {
    return decodeURIComponent(value);
  }

  private decodeUri(value: string): string {
    return decodeURIComponent(value);
  }
}

// Helper class for StringBuilder functionality in JavaScript
class StringBuilder {
  private _buffer: string[] = [];

  public append(str: string): void {
    this._buffer.push(str);
  }

  public toString(): string {
    return this._buffer.join('');
  }
}
