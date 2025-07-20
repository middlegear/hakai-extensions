const DefaultCharacterSet = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)); /// this is what D is assigned to IFF

// ///  implements a columnar transposition cipher

// p = (P7, p4) => {
//   // 1. Split P7 into a grid of size (x2 rows × p4.length columns)
//   const T1 = p4.length;
//   const x2 = Math.ceil(P7.length / T1);
//   const B7 = Array(x2)
//     .fill()
//     .map(() => Array(T1).fill(' '));

//   // 2. Create a sorted array of { char, idx } pairs from p4
//   const B$ = p4.split('').map((Q6, v6) => ({ char: Q6, idx: v6 }));
//   const a_ = [...B$].sort((a, b) => a.char.charCodeAt(0) - b.char.charCodeAt(0));

//   // 3. Fill B7 grid column-wise using sorted order of p4's characters
//   let m5 = 0;
//   a_.forEach(({ idx }) => {
//     for (let k3 = 0; k3 < x2; k3++) {
//       if (P7[m5]) B7[k3][idx] = P7[m5++];
//     }
//   });

//   // 4. Read grid row-wise to construct final string
//   let f5 = '';
//   for (let H9 = 0; H9 < x2; H9++) {
//     for (let D2 = 0; D2 < T1; D2++) {
//       f5 += B7[H9][D2];
//     }
//   }
//   return f5;
// };
// /// Purpose: Shuffles an array (y_) using a deterministic PRNG seeded by H$
// //Computes a hash of H$ (similar to Java's String.hashCode()).
// h = (y_, H$) => {
//   // 1. Compute a hash of H$ using BigInt
//   let a$ = 0n;
//   for (let R9 = 0; R9 < H$.length; R9++) {
//     a$ = (a$ * 31n + BigInt(H$.charCodeAt(R9))) & 0xffffffffn;
//   }

//   // 2. Fisher-Yates shuffle using PRNG seeded with a$
//   const K3 = N1 => Number(a$ % BigInt(N1));
//   const c2 = [...y_];
//   for (let R5 = c2.length - 1; R5 > 0; R5--) {
//     const d7 = K3(R5 + 1); // Get random index [0, R5]
//     [c2[R5], c2[d7]] = [c2[d7], c2[R5]]; // Swap
//   }
//   return c2;
// };
