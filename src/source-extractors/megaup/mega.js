////RC4 algorithm
function f7(p16, p17) {
  var v6;
  var vA2 = [];
  var vLN04 = 0;
  var vLN05 = 0;
  var vLS2 = '';
  for (vLN05 = 0; vLN05 < 256; vLN05++) {
    vA2[vLN05] = vLN05;
  }
  for (vLN05 = 0; vLN05 < 256; vLN05++) {
    vLN04 = (vLN04 + vA2[vLN05] + p16.charCodeAt(vLN05 % p16.length)) % 256;
    v6 = vA2[vLN05];
    vA2[vLN05] = vA2[vLN04];
    vA2[vLN04] = v6;
  }
  for (var v7 = (vLN04 = vLN05 = 0); v7 < p17.length; v7++) {
    var v8 = '1|3|4|2|0'.split('|');
    var vLN06 = 0;
    while (true) {
      switch (v8[vLN06++]) {
        case '0':
          vLS2 += String.fromCharCode(p17.charCodeAt(v7) ^ vA2[(vA2[vLN05] + vA2[vLN04]) % 256]);
          continue;
        case '1':
          vLN04 = (vLN04 + vA2[(vLN05 = (vLN05 + 1) % 256)]) % 256;
          continue;
        case '2':
          vA2[vLN04] = v6;
          continue;
        case '3':
          v6 = vA2[vLN05];
          continue;
        case '4':
          vA2[vLN05] = vA2[vLN04];
          continue;
      }
      break;
    }
  }
  return vLS2;
}

// encodes the input string into a URL-safe Base64 representation without
function f8(p18) {
  return (p18 = (p18 = btoa(p18)).replace(/\+/g, '-').replace(/\//g, '_')).replace(/=+$/, '');
}

//  decodes a URL-safe Base64 string (potentially with added padding) back to its original string.
function f9(p19) {
  var vP19 = p19;
  if ((p19 = 4 - (p19.length % 4)) < 4) {
    vP19 += '='.repeat(p19);
  }
  vP19 = vP19.replace(/-/g, '+').replace(/_/g, '/');
  return atob(vP19);
}

///f10 substitutes characters in p20 according to the mapping defined by p21 and p22.
function f10(p20, p21, p22) {
  var v9 = p21.length;
  var vO4 = {};
  while (v9-- && (vO4[p21[v9]] = p22[v9] || ''));
  return p20
    .split('')
    .map(function (p23) {
      return vO4[p23] || p23;
    })
    .join('');
}

//reverses the input string
function f11(p24) {
  return p24.split('').reverse().join('');
}

//seems to be a complex encoding function that involves RC4 encryption,
// URL-safe Base64 encoding, string reversal, and character substitution
// applied in a specific sequence.
function f12(p25) {
  return (p25 = f8(
    f8(
      f7(
        'Zd5yYckQ38h',
        f10(
          f11(
            f11(
              f10(
                f8(
                  f7(
                    'HzdLUrxnhcS',
                    f10(f8(f7('hI8JxsWF9G', f11((p25 = encodeURIComponent(p25))))), 'mN9sQhVUPSz6', '9mz6PhsUQVNS'),
                  ),
                ),
                'JGQ34nPlRudgX',
                'GJRdPQgXn34ul',
              ),
            ),
          ),
          'RQunFW8AYt',
          'RuFt8YWnQA',
        ),
      ),
    ),
  ));
}

////This function appears to be the decoding counterpart of f12, reversing the encoding steps
function f13(p26) {
  p26 = f11(
    f7(
      'hI8JxsWF9G',
      f9(
        f10(
          f7(
            'HzdLUrxnhcS',
            f9(
              f10(
                f11(f11(f10(f7('Zd5yYckQ38h', f9(f9((p26 = `${p26}`)))), 'RuFt8YWnQA', 'RQunFW8AYt'))),
                'GJRdPQgXn34ul',
                'JGQ34nPlRudgX',
              ),
            ),
          ),
          '9mz6PhsUQVNS',
          'mN9sQhVUPSz6',
        ),
      ),
    ),
  );
  return decodeURIComponent(p26);
}
export { f13 };
