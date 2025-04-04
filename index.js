import { load } from 'cheerio';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0',
  Accept: 'text/html, */*; q=0.01',
  'Accept-Language': 'en-US,en;q=0.5',
  'Sec-GPC': '1',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  Priority: 'u=0',
  Pragma: 'no-cache',
  'Cache-Control': 'no-cache',
  referer: 'https://megaup.cc/e/m4TvIHOqWS2JcOLxErxI6hvpCQ?autostart=true',
  Cookie:
    'usertype=guest; session=hxYne0BNXguMc8zK1FHqQKXPmmoANzBBOuNPM64a; cf_clearance=WfGWV1bKGAaNySbh.yzCyuobBOtjg0ncfPwMhtsvsrs-1737611098-1.2.1.1-zWHcaytuokjFTKbCAxnSPDc_BWAeubpf9TAAVfuJ2vZuyYXByqZBXAZDl_VILwkO5NOLck8N0C4uQr4yGLbXRcZ_7jfWUvfPGayTADQLuh.SH.7bvhC7DmxrMGZ8SW.hGKEQzRJf8N7h6ZZ27GMyqOfz1zfrOiu9W30DhEtW2N7FAXUPrdolyKjCsP1AK3DqsDtYOiiPNLnu47l.zxK80XogfBRQkiGecCBaeDOJHenjn._Zgykkr.F_2bj2C3AS3A5mCpZSlWK5lqhV6jQSQLF9wKWitHye39V.6NoE3RE',
};
const decoder = new AnimekaiDecoder();
const proxy = 'https://slave.nopile6577.workers.dev/cors?url=';

const getEpisodes = async id => {
  const resp = await fetch('https://animekai.to/watch/' + id, {
    headers,
  });
  const doc = await resp.text();
  const dataId = doc.match(/class="rate-box".*?data-id\s*=\s*["'](.*?)['"]/)[1];
  const episodeHtml = await (
    await fetch(`https://animekai.to/ajax/episodes/list?ani_id=${dataId}&_=${decoder.generate_token(dataId)}`)
  ).json();
  const $ = load(episodeHtml.result);
  const episodes = $('a')
    .map((i, el) => {
      return {
        number: el.attribs['num'],
        slug: el.attribs['slug'],
        title: $(el).find('span').text(),
        id: el.attribs['token'],
      };
    })
    .get();
  console.log(episodes);
};
// getEpisodes(" ");
// getEpisodes("amagami-san-chi-no-enmusubi-90k5");
[
  { number: '1', title: '1', id: 'm0LcxEijT-5iyJvT58dr' },
  { number: '2', title: '2', id: '2xTZwg22WOdojpDa7pgv' },
];
const getServers = async id => {
  const resp = await (
    await fetch(`	https://animekai.to/ajax/links/list?token=${id}&_=${decoder.GenerateToken(id)}`, {
      headers: {
        ...headers,
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
  ).json();
  const $ = load(resp.result);
  const servers = $('.server-items')
    .map((i, el) => {
      const type = el.attribs['data-id'];
      const servers = $(el)
        .find('span')
        .map((i, server) => ({
          server: $(server).text(),
          id: server.attribs['data-lid'],
        }))
        .get();

      return {
        [`${type}`]: servers,
      };
    })
    .get();
  return servers;
};
//console.log(JSON.stringify(await getServers("JcvmuKfzqQnmkXoX2ofV")))

// [
//   {
//     sub: [
//       { server: "UpCloud", id: "mxWbnE3zBw" },
//       { server: "MegaCloud", id: "mxWbnE3zBA" },
//     ],
//   },
//   {
//     dub: [
//       { server: "UpCloud", id: "mxWbnEz1DQ" },
//       { server: "MegaCloud", id: "mxWbnEz1Ag" },
//     ],
//   },
// ];

var u = {};
function e(n, t) {
  var r = [];
  var u = 0;
  var e = 0;
  var f;
  var c = '';
  for (var e = 0; e < 256; e++) {
    r[e] = e;
  }
  for (e = 0; e < 256; e++) {
    u = (u + r[e] + n.charCodeAt(e % n.length)) % 256;
    f = r[e];
    r[e] = r[u];
    r[u] = f;
  }
  for (var v = (u = e = 0); v < t.length; v++) {
    u = (u + r[(e = (e + 1) % 256)]) % 256;
    f = r[e];
    r[e] = r[u];
    r[u] = f;
    c += String.fromCharCode(t.charCodeAt(v) ^ r[(r[e] + r[u]) % 256]);
  }
  return c;
}
function i(n) {
  return (n = (n = btoa(n)).replace(/\+/g, '-').replace(/\//g, '_')).replace(/=+$/, '');
}
function o(n) {
  var t = n;
  n = 4 - (n.length % 4);
  if (n < 4) {
    t += '='.repeat(n);
  }
  t = t.replace(/-/g, '+').replace(/_/g, '/');
  return atob(t);
}
function f(n, t, r) {
  var e = t.length;
  var i = {};
  while (e-- && (i[t[e]] = r[e] || ''));
  return n
    .split('')
    .map(function (n) {
      return i[n] || n;
    })
    .join('');
}
function c(n) {
  return n.split('').reverse().join('');
}
function v(n) {
  return (n = i(
    c(
      i(
        e(
          'QKbVomcBHysCW9',
          f(
            c(
              f(
                i(
                  e(
                    'PgiY5eIZWn',
                    i(e('3U8XtHJfgam02k', c(f((n = encodeURIComponent(n)), 'IM7Am4D2yYHctL', '7DtY4mHcMA2yIL')))),
                  ),
                ),
                'rXEsS3nbjhUd',
                'rXjnhU3SsbEd',
              ),
            ),
            'Go1UiY82st0Oa',
            '0GsO8otUi21aY',
          ),
        ),
      ),
    ),
  ));
}
function x(n) {
  n = f(
    c(
      e(
        '3U8XtHJfgam02k',
        o(
          e(
            'PgiY5eIZWn',
            o(
              f(
                c(f(e('QKbVomcBHysCW9', o(c(o((n = `${n}`))))), '0GsO8otUi21aY', 'Go1UiY82st0Oa')),
                'rXjnhU3SsbEd',
                'rXEsS3nbjhUd',
              ),
            ),
          ),
        ),
      ),
    ),
    '7DtY4mHcMA2yIL',
    'IM7Am4D2yYHctL',
  );
  return decodeURIComponent(n);
}
u.value = !0;
//Object.defineProperty(exports, "t", u);
//exports.default = undefined;
// exports.default = {
//   h: function (n, t) {
//     n = new RegExp(`[?&]${n}(=([^&\$]+))?`).exec(window.location.search);
//     var r = null;
//     return r = (r = n !== null ? n[2] ? decodeURIComponent(decodeURI(n[2])) : "" : r) !== null && t !== undefined && (/^(1|true|yes)$/.test(r) && (r = !0), /^(0|false|no)$/.test(r)) ? !1 : r;
//   },
//   p: function (n) {
//     return i(e("n1PEbDBiipbJZvZc", encodeURIComponent(`${n}`)));
//   },
//   m: function (n) {
//     return decodeURIComponent(e("n1PEbDBiipbJZvZc", o(n)));
//   },
//   _: v,
//   g: x
// };

const getSources = async id => {
  const { result } = await (
    await fetch(`https://animekai.to/ajax/links/view?id=${id}&_=${decoder.GenerateToken(id)}`, {
      headers: {
        ...headers,
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
  ).json();
  let data = JSON.parse(decoder.DecodeIframeData(result).replace(/\\/gm, ''));

  const url = data.url.replace(/\/(e|e2)\//, '/media/');
  const sources = await fetch(url).then(r => r.json());
  //.then((r) => JSON.parse(decoder.Decode(r.result).replace(/\\/gm, "")));
  console.log(x(sources.result));
  sources.intro = {
    start: data?.skip.intro[0],
    end: data?.skip.intro[1],
  };
  sources.outro = {
    start: data?.skip.outro[0],
    end: data?.skip.outro[1],
  };
  return sources;
};

//console.log(x("NGI3aHR6U1lhX1NmeWR4N3FFWVVlUEJQNWlscHZqbjJsX1h3bE5MX0xKSWE1UHJIbzFCeGJwVzFZaEN5Vy1Tc1VpQmE3R0RJSi0tNzRlTThFUDIydEtaVGdzVFYyNkhwdkJYaVBUdTAyRmlTZmNsZGMzMmRlMDctdjdabFpjSXVPWFdzYngxci02WEZTQnpqX2J3ZHh2VG40cHhoTHVSMzVrYk5meDNxaTZjUzRxSjBLMFVFS1hTV2NRT3F6N21ic3NmckM4aUJjMlpHeGtXWkF1ajVOc196cmRheXhXU2ZsOXk0VmFtbXo1S1ROazR2eW5yQlFtSHRfWU5RLWRodTh3U3NCUWtJcFZRT1JFSFBnai1ORS1OODVYbUwxUnV0NzEyMnc1ME8zRFJBMFZUTnlWVXVuRUp5NTlfTzVGVHZQVTMwbjJqdi13OWUwLTdOeVZzY3YxTFJ3eHNfbGpIWTJIaE44Nk1BM0ZYV1BUNGVjME03QWhWeFRfcnVOa0RBQjd0cVk3SXZSUms2ZjVqTWFKdmtBQ01zb0xhODVwR1BDTlB3M0NaY3RXS3FXVmlVUnZvemczLW5ndE02V012V0hMdVp1YWtrbTk3dlN2QldUT282M1BCdmRJSzZ6X0Q1Z0NfeHV4aU5Ob2txejY4dExRR2tqQXV6YTIzZWhxTmE1QlA3RnNtVDl5WFZSV0tnTzc0aFJSRDlBYTVPdkFnZGxvWFJaT204S2dvTGZJLU9IT1pRWUZrajdESG5pQVZYbjVTSzNmbVNLSTZjdDNXYUczeHhwZ0FldXhxNjR2MWQxQ3loQmwtSDZkSUVRU0RCV2h6M0RKZHk1akJPcDJkanJIYXBtSDdvcWJPNmdYMTd1cUp6YVJac1N0NzIyTWFkbUo4eVp5bUZ3dkpFZVRCOGtjUG1zZ0lpWldTZU9KdkY4RmcxUUZJcHRCRkVvU21GWGRhXzZ0MmlBWHZ6Mklkd0NtQ09yZURDTE0zb2I3S1pMSHc2SkZ1SVh0dW44dFl2eVducElrcjYxZ21iX3gwT2tER2Vidjh5OFl5dHdjNlRtX3E3YlNVWGhIU2Y4LVdaQ19zNEdrZ2g5RnVNTEVKbzJLNUI3aTBSSmlLclhNNEIxTlBFaEdORzJ4SC0xTW1USFI4WTB2UkxxLTRIQkFFOUxSWkNxWmRzZXhES1hoejdfRVRmWGJHejFzRU8tbGpuekx1YjBGM0NDMWtfU0JMRVh3aWJ3SGFSc3czLWVPc2tnSHVfOVVaS1h6TERNa3RvbUsyQ25QTTJWcENkZGdRbWlVdzlEaU1SN0o4Yk9uZzdTUG0ycGFhQ3VOTy1RejdSRnpzWTZNUHZSOERlZUFrSVFXTjlVNktkQzA3cFI5OHNwS3JjVG5JV2RsSG5rbXFFV2FId3RMSC1FZTU0NjgwbjBoZWxJSFF1S056VlVUUHVtdUotQUNfWmpPOWhRZjNfVkliT3Azcl9WaWJfOTlfRjVhcDQxS3V2T0t5QkhrNGx1NG5rdnctbkYwX3g1MFA3VDY4U2xUUWpBQ2E3Q2RySmxxRTlfNkdDS3ItOE1TWF9mSnNFXzNITktzVl9vb2IxZGlCVU1QT1RuY3lzVmszTUxjM2pva3BXUE5lZFFnNm9NTTZlQVZzdGstcXRRQVJZRGc1bmtDVVNBQnhTVG9YaTMtZmlSRWRYY3FWcW1XbkVzRGQwR0Vyck1oUmJQcEdQV0gyZThMWUVfdm85M2VhUnNwZl9ITllkeG9HbE1aTHFPdjYtRFcybWRUbktRd0poQkFwdkNHVjFrbEZ6UDFCUVkzVnJPcC1xc212c1RhcExDU2JtdGJWSi1aX1ZzempsU2xkcWlGZWVOWjlNVTlHZDBCbnBQZ0hVemxTT2d4R0pmdVVyQjFtc1VDemdKR3Rodm9yY1RpaEZTeUVhUFBlR0sxcjk4U1JKZ3djekhuRE8tMHoxVFkwVlFRdFdLbHhMUjFfR08xYUZ5MnJ0a0tfYjY4RnNPRW5mcTVZcVB1X0x3cEM3OUppR1EwY2lkVVd0MjNKY09feFBmSUhCM1JZNlRCczI3WS1rVVBBVlVFaXUxT0xOX3Y5czBLRDBDZnJVek1zZUJYX3lRNjZSSklWTUtOdlJyVmZtalpyRWN6TkxpdzJPODh3dnJTTUVWb3EtQVF2dFVWRHNsMUdLY1NHdWxwUVEwTF93ZUpvemF0bHJnMjRrMnUwSU1obWVxNmx3NS0xN1hCamF2RkN6U0JlckpFSzFDXzVSNXhfWm1NcXNVanVNT2xYYXdGenpxVTFYeUNpLXhyTDVnVVd0WFRtcVRMc3BkMzVUOVNHNDlVNC1XVk1YS2JjQ3hrX25QZERrUGttZDNSYmFKTzdienczMUpjQlYzWENVbXhRQV9nd1U5R3pSQ21qdWtjdlJhTlJOZ1NheVJhWnhNN0JLdEZhNUctamxhQmY5WWo3N3NlY0lTa29BLWoyaFNpYmFSb2J5ZHdjWWp5amRkWFpfT0VTXzVGNERwOERpS1owcmZWblQ4ZUZnSG4zSXJ2Zl9pTjZGMjFqaTFMTlBmaFlPRm10OVRXVUUyUzFEU3FRbWFPeFdQaE9OYkFOMWNjbVl6clBVUU1qYTE0VkRBaFpfMGxxRUNPMHZGTnpvYlplb3FQY0J2S01tM2MwWVpaQmJ1R3lULXRYSVBwWlp4YU5ETXFMZUQ5SHNaR1p2dDduSmJKTlVIRlZHM0E4VXdqQUxiVTlxY2xnQ2ZkQ0V0eHZKVTZsSXdYMWNPQTREajFycmdhRjN2bmR6WGM4YlJqcjVHdXFVQzFuaHlTMVJxN0tMRl9tbXNlQVRMZnl2M3FiTlpWOW52QVB0bDRhS0VpU2ZON214T1Z2RUhWbnY1Sk1wRjdSWjBTVDRJZzJINC05ZVhyQnhzVFNBZkRqNUFMejgyUHgwSHBrci1hS09NeVdNRk84N1AxaFZCR3N3WTNkTUJaZllFUk94MENjVklJa3lQRGxzV2NDNmNBX2pwZ0l5cWJ3V1U2eUVYLWdReGUxemhDcnJENkY2azBaZW5WU1NmcFJpLXlTN1I1Wmd5TFNnWnRVMHZOeUp3c2I1YmtmdlpWOWV1enY1S1VrVl9hZXFPSXV1dTZTVHFzYlJZUDZ4MUZOU1FuYjVKd05QMFVzb2RMaGljcmJ2ajRvTmJIYU9VNDhzTVF3bTh6SE5WWk5HWlFxZFdxMjBDVzJwQlFlV1d2TlRkM2Y0Y2EwMjRUR011Qld4QUc4QTRsVk02TTg3Rm1qT3NQeko2SjdEcjNGREV6QUpFRTVGOTU3ZlgtYnV2c1dIaEJsLXBpVTBGLTZBdkVOeUhTOUN5R0FNV09YX21Hb1V0UEdZLUFGcDRnSW1XejQ5QzFIVkxiUkRBZnRKa0JHWUQyX3hUMjYxNUFPeXJCSm5iaTVpcnlrc2Q2a1Q2MHA0eGdiLVpSenRRTDNTTXNHM3hyOGV0NkpadEVPa1BzY2NNM0JoM1IzM1hpV3dBTS1xWlZ2R3JLc01lZjVLY1FkQUtYRFhrRFFjaW53c3kxNXFxNkFYSHZveUw2Z3BjSzBjdENPLTVKYVdaVHVZVEdqNThsajRXWlJFR2JoSjdRWF9HVUsyYjBvMU5xbHR4Nl94T3RVU1lfSVBPUVk3TFNmd1dGRmV6cWt5RTRkRFZZUzRMQkNmOFZsWTA5ekJEMFN4VzdiZ0liX1BOemtxMlN5dDVrOHF1UDN5UmdkcGFKMnlnLTliZl9Uc195bE42Zk5jel9kUDRvUGo3ekc2V2ItWEI2YkZTNzBBNzA0X3QzbDQwN1ZQX3NacmVTM2tXY2YxWWFmVG5YejRBQzZqZkwzSjRhR0I2UUxlSzVlRm5ScWZyekt5aVl2RVZyUDFSQloxVkZHRUJVV251cy1mRUFFcVdXTEowQU1zRzFUbkw5RWhFRHFxZnROelFmbEE5NUMtVi00YzE3c3RfMmczZk9sSDF3X2pRd2JseXdXSEgxWlAzZnhWeXRmSlRDMS1QX1BDZTMyNFdFOE1fYXAyR0FpNUhoWEtQN2dfM2ktTjQtOXJTZVpWN1pxRWJuVTJnS2t1V1U0WlM2WU9tMmwxZkRULVNUbzIxeUdjNGJiWTB4SVFTUWdBLWZEMUMtTlpNMHItMEF2alpDUmd3VzhLZGRMNHBCcG5tRHdwc01qUjhNZjdzbU50LVNWeTNJdE41SEgycGVXNU5KQUh1aE1KWXpOSC1sVHM5aXhwRmh1WDJ5blRlSFNlNzUzOFZtZzQ1VnJXekNjWExDSVN3UFhmYm1MLUs1VFRjMzlfMER1T1NDekpuUUkzMGJmdVdkZDBYbnJfUVBjYnNUMlEwY2lYTU9Ta2Rpcy15elNwb0d4MFZiQ2xhSW51bzhTMUxEZkYxMUxOVzMtTGI2TDZFbmVVTzY2a1UzdVRueVIzVFBWMmFoXzZxNVZKR0w0R2VFRGtaSUd1U3YxS2VMZFo2eU03cXRPUF9mNGRLVE5RcVpKSGJ1SzBOM3Z1ck9ZcTNXUGoySlQ0N0J1QTBTUnBzUVV3VmRRcHRRVWVqYnZCMzFIbE9DdlJhdWJ3TFplcHV3RXJmVGNlNUdsYzJHb2ZCc3lPYkR2eUtzZVlzXzJFUzJUWW9EOHRFOFRmaGpaLThsVEpaNUtneGxMblQ4WTdYbmRGY2J5WnJLRXNkM2Q5c0I5WFJETW41a1BXSUVyMHIzbVZVS0N6NzFkMEN1bHZMMm5FbHE5b21VaWMxcVgzQWctQWZvRmM4dlUzZzJMQTVnN29XR2J6aUVQdjYxUFFrd2hjZU8zaElfV0pDRkhMNHRHNUVGU0E3ZHRWbHhEbWtBV1NNcGFqZ2FvdUtacWx2MlJUQTROZHhWb0xDelRha3Z3dmc2Mld0N0NIZlBkeXZwODJpVnZFc2s2NmNGVjQxbHJld2x6RE04SkdBQzFoYXNRUXVBODlUaTg2eDR3Mm1nQ1Vpa2tZd09iRWYtY3NtaDEzcm0wZ3FVaHRPbWNLWDFyZE1ZeTExWTNScFBMbG9iMWo3a2E5VlVWNnNBclhWSWxUNXllUG9IMThka09sWmpURVRKQXhRdnI1U0Z1aUJwQTZjY1ZDTFhERFFGTnJ1YWxLUUhIZzUtQy16SEJ0a0RiUndiVS1FZ0NLMGxCdGtHUldjMEJCcDRUdDZnTnhLVk9ER0NpRGNJWUZqLUNLSzNOTE1UUjRISVBvUC1ZT1F0LVB6cV9MclFiWUk4cmZDeWd0Zi1MX0FkNmVPel9ZUFNNOG1nSnI3a29BVmJoNWt1VTgyVFpGaUJLdHR4UFVlMTEyU3NVeVUyS0trT0JPWWxYb2NLQU9pRmNMWkFhYXBDX1FOVWRXZWdDQWZmWUxfMER2clFfMkIySUlYOWNnZUw4VWpuRHI1X05INklld21LakxETDdhbHlSa2F6MUx4RTN6ZTBtYzFDTnlyTmhPQ0FpT1ljckNXVXhoaWpVaE5PMklfLVI3SWcyYlBRQ0lVcTZvMkZSZ3RlQkMzTEIyUEl6ZEVjTUJPSnBieXk0c0FJZ1dCRm9yVVN3a3E4OE55cEVIVUQ1S2FWLW80NWdzN0J4Ynl2czlsOExnM1lVMTl0MGhmRHE4aWhTWEpNTjlzdzRMc1Rlc0RkaGxFdnNLa3JLX2JEUEV6NlFVd3JrMHhSa0pvM0RtSFV2UEQ4NzYzWURXZUVnVUZwNVNIaHZ4LXQ0RGJFUFBBcm82N0FVUXNqMmNKT1I4dG5Edk9QS2hmVjl2Y1NiUE1nY2dmMm9qTkpwWlZjWktxZ1FiSDFuanRXTjFDU2V3OW5IcklqNmEzbkZXeVljWGRza3ZFdXpKTUdOVVVTTGF6dm5memU2d1JmLW1IZE9aZHBZY0FCczlORkpqNjNncllNRmRnLTdXSzdjb2RVdnhTNlp5VWFOV1MzRmwyNktxSFgzanlFcUw5dVVtWldjM2JBVERvMkN0SFh4VnEtMWZHREVZTzhXZFZDTWpQM2YtZ2pKeFV2LTFYOUJIb2Fab3U3bGdyMTdoYk1PNkpaUTFqcjlGMlF1Y1N3bmxGZlJER0EwdmpRaV96azlnQU80d2dSaFFxVjJRTzNqOXlVcHljUm9pNV9taEFMZ0xqNTJKRlVzQ0M2NDkteHpWQWZhc1IzWkh2YmFGYnZqUlV0M0J1eEhCSzF4QVphaW0xU2Nnby1FTWJaNWJSRWNsQXR4VXVJWXgxd3dyUlBTZGV6Q1lla25Ub0twVlVtOHp6c0k2NEpMV0pobk03Y2ZjNmUwNlFabFY5cFRjUHdFSlZFZEFLbWN0MzZuZTliSEZWTjdvY3VLQjlnYTZiMTdpd19HUExBVU5Jb01MUXVSWjJxMmxRZzhVOHl6SkZsY0o5LVZzOElBc2pRSkVPX20ySkU2QW1NVEZTLWxNc19mcndJQlhSRC1oaF84U1E0dHVKa1dBZ1lNTXJQUF9nYmN4ekJGbFlQdXpoQmVoNkZLOHNHWkowTXRMUDlWdmp0cXNxbS1zdDU5b0tRbGVuLWRxWnhJdEVwWnFoVi0yLTZsR1ZwWnJZT00zRDFMX3NRT3ZmLUJ1Wl9EUVBuQ04xTjRpeXNpcDIzWTdsQ2pjWG9KdG80OFlrTXhFY2xleHBkRTZpUWpXTzNSaGp1SDRCdktySjh5MUdCUnZEbk4zZTZjemtLYUpNdzVmV3ktUFJUV3gtaXpDb0tydnpqcFhDcWZha3FKZEFOcGpOdFJqMXFCRmxtaWlHeHN6bUlHTVdwZ1FUT2xvMWdIMXJxNWRTZmpaQWVoSzQzWHVjRlFJdFp0SE4xWk4xT283Y0E1WHR1b0h4Sl9EZUZKQlFWTHh6cGNpUHQ0Q0I4Y29xRFBkN3BpYllrTUtvajNDcEluTkVzOUNjbFZUQW1iaHhwaENXaTI2LUliMk9HYk1QYXJnTER4V29NYmo0S3hxM3diNEdjbHRDWDBGLVY4NE9SOWVGNTl1eFZoa0pTekFVQjRDbk10akdBRjJaRHFKODIxV3ZZOTNEQ20takM3TGF5QWYyYWVTNk44Vks3RHRubHpRT0NyOURvc0pfR3NlQjZJNExUWHdLazdhR3hUNmt4d04zNmxIZS0tUWZLYlQ1bUtwR3N2UUdwZTkycDVDNVlVNU5nZWRYUW9zWFkyWEtyWThDUHlvMHdzaDlBbDFBbDdlNnZUbnNxdGh1eG9zRTRJbGxLLXZkcktVNk1RUERBYmNaV1pQa2UteDJUMHNUUnh5QW9aNFVhaDRWTW5WT2dSRFJ0U3JCMG1WdWM3UDZmSF96NEhzcUNNRUNQME11Njh3VHI5QVlfbnZjTHNfbVZvZXFIcjBYZXQtczhlMy1Cc0w5eGFOOUtVbDhHd3NzM05QdFVKQ0twSW93d2xLTjJkUjR3ZGVZT3Vha3A4UzgxSkVmdTdqWG9CR19YYzF1czJVOHRxNGQtQmJZZWRSbmdaaEpwZG9TTjZpSE9lQ3ZDRHlzNldEdnlHTWh2c3dWYUpKSVBUbHhfb0pYajhXRmtJa1VpM3ZhZEYweTI0VFdxVUZMR185bzFOUFpINm9oZUtSblVnODJzX2NUdk1VWmZ4eFh2c3A4UnhhU1REUFJTUEtnQlRHSUVMMElKdE5oSEtnZ2dTYVZsYWlKZ2RCU1NZU0tEay1pcWprN1hTclJVZnRIZmRTeEN5TFk0Q3pqcFV3azdVZ0NVc09iaWdLaGdaR05pNm5rbTY1dXludlJnT0p2T1hHUmhsODZyRUFYQ2V1SWtyMVhaMnBuMXRhUjZRRTJfeHpVVzhnMWFhNUd6RGZsLXgtSDdSWFV6TldHUldSZmtUNFRLTGF3dHQtU2hfWmhlSlB5dmxseGdiOFdrSzJFRm4tTFBuQmQ2ZnFzX2J0ZXhReEg2d3VnRTJJcTZJaC1JcXIySnk5YzJpdlNKLXZOR3NTWGdIaWFoTG9fS21HNzczTWhhY3c3VTRKbk5ENFd3ZC1Cb1lwUmxxSGE1STc2cHY5cDhYZC1GVXBGZHVNcS1qeXdvS0NtX0VXQmdqdEhGVFFfQUp3WE9EOHVOWEtTY1J0ZEpqUzZ6U05ROUd0NXNpWlhFZTBwTVh6dk16M0lhUm1zb1RwdjZfbFRnNjNIVnl0V1JiM3ZFXzdZZS05ZmZlVENqRmJFUDF1TlRfTkoxWnN0dGdGTGM3U0FvNFZZcEpVXzJrMnNnY3ZBTENtY1hDLTZPRVdRdWFKVE01UnJWX2p3N3EtQWJNekhlV1FkM21FWDJmdW4tb2dlekkwT25GUWJ3clIyU0lQcmQ5N2RGdUY4NFdNSnBfVkVyY1UtUzhaMEdSRDRVa2hoV2ZLcG5JVzBHRE1oYkQxVHhVMGZQaXZycHJ3R3JpTG9JS1pQbW8xQy1aY3VnSm1UTEpVbFlTYXZpaGZIRUJERWctNTlpWE1ZVk5SUlUzc2RuVmplMzdhM3VFVk42U0lDWWZWTWRqbm9jeWtMQkFfRTVwdGFmZkFlcjA4dWY3SEhmNWlVVlRyTzNUaEs3UUpqNm9nOUVCbm5oV09GV1ozMVlTaDd6ZTZKUU5mTHJXeGduR0hvcWpXOWxhVnlkLTQwSU44VTV6ZGJvZmdzWDhCbnVQbURjVWpYcUNYVzVwUWlsdkZDNkFnRHpnY3p2cDVZa01FSnpjcERLNGNvTlJ6eWZlZXV6eFZtclRMbkl6by0wQzhaTTAtZ1UtM2xWemtNbkxHajNmSWRiVUlOaEFTLXpaWVpEN1pIVUhLV3dyTEJ6NjJmV3ZDQVNuYVE0SkVPX29MeXRYSlpIdFYwQ3Y3cUs4VnlRWm5Cc1U2enU4akZUQW44V2toeGdHeG43WmtPcEZIRGdnNlFtZWdDYTJxY3o4V3BxazhOa3ZEd3dvdW5yalIwNUZMdS1pVi0yTVJOaFk0VWNIV1p0b0ZkMnJ5ckdaZE1RR0J1MV9UUWpOMUV4eE5DMThsQmMzV0RqRWtyQTBLV0V5S1M1NjVMUTRKcnFNamdjODlqNzVpcFpnN2JMMlh4YlRRRWpqTHMzXzFqRnlIejMxV2lkeUZ4VEtlMldwN3lZU2o5YndlYTBZRUJxYjNyUjMyNjY1RzBrVU9kS1lBemphTU5RRlJyc1E4RjgwMXMxZzVCWXZRU2U3MW5kVm02Z0JyT21mekQ3ZTdUazZKYWY5YnAxcTFuQVhzYUhvSDZKVGVYVFFNQTh6MDAwajhfTW5XS3pacTdsSDRkZFZ4TmFzNmlmajZvWUJJZ2haYXJjSk1lRTc0VjdKSDZ0ZEVYV29SNng4cEgzUkh4SExrSHlZMEw0U3lMOXZuU3hneG9fZThXNENLVm1OdEtpNXhSVjJhR1hpd1ZJXy1jZ3kwYnFTWFBWTlVORTQwb3dTbVZ3NWlyVEdkVkdlZGNrYlhSLS1uZ2N5MlVOckYwbkdSemJoY193MVowcDV4NTZUYlBEVnRYOC1ucEx4ME9PdkRfOUNHNEhWX0dpUGhMREdpNHF3SHd2XzJaUkhnRWNhLTlPS3BKOFUza29rc3NvNjN4OGE3bTdJcV9fb3Y2UFdRWU5PY1BBOVNsbmVwR0RpNGp2VjI4dW5TZ1RnWFRQdXBJaThNRGFKWmVFcWdhRVZhZ01vNHE2aVd1R0FwcFdzRjNvWkxGYktPLUxqcFI5ajQ5ZS1uenNZLUt6V3NDX1g0Ql9udV9DeTFzLWFMRlR5Wk5ISTVoMDNMOXMtTFhMR2FEYnhYakJvakl0T1hXTmJad1JrdkExTGlTOEZIckpSUUdoSXdldEpGMXQ4eFB6dkpYZUxGNXlWYjVQQWQtSTBrd0tWMEFFRUJIc010TUEzZU5QMlVBTW1DSmNfVm9JekNjZWtIekt0ZWxZWVlhcjk5MmF4VXZsYkx4c1pjR3RvMVhwbDQxNG5EWjVLbmJ1aTlBQWY1ckNBcG9LQUZhd2g3RE9pOGFWbi15RXFvQ3Bha0RScUlNcEFqVEtDQ3V0dmhGekhMc1dZTXd4NzBzWmN1YTZidUswVzdIb1VjU3VUNHViTGZiZ0Y1NkZYZTlWeFpGN1ZtS2hoQ0d4WV9aTVVJV29qQlBlbDRSeDlQOW91YjNnVF9UaVVxS2UxVG4xRHZOYjlwcm93eTRjMlJXbjZsdnJ4cXlrdDF0bmpIdWt5b01IbXZRTmtWeFZLWk5TUTBQRXB4clBTbVJnMlZGdHBPN1J4YWpUVTZpbHJBeG9lRVZNMlAwN0h5ZmRGZ1QwSmFQSlR4RVJ5V1hXOHlsX3Y3VVhLWEdGX0l1WlJzOWhIakZSLW14UXA4Y0JGaDJ0aGRaZXVyUDJSLWRiNms5bU5HSm83VFNRejRpam1rV3FDU2VuTDdlZUp4MVhyODN0aFhkS2NCRnk5YzdoTkl5SDFjWDZyR3MwTUhqY0ctYm0wRzVxZFVyWVpnV1FhZ2JpM1ZNbDlDLXlObU9iRXZHQVhJOWlfV2hWNEp3QUNwYVNJaGs1UUNSSnBnQ0NoamlGSGNfdHVmYnBmYkFoRTdabzFBalRKU1ExdnFwTzJMSWxPeFpHbGpTVXlyOWZpTVQ5YU8yRmdCRjAya1gzWTFlV0FuRjNTaWRxeV9IdGpKYkNEMldmbWNaWHFJZFV5NmpOVjNraThiY2w1T25MTnktTDdhOU0xWk1qMmN0TUF5QkZnWnNkN3J6UHhnY1ZvZGU5NmVTYi11RE1yWUtiTVlOdWNUbTJjWVhNcWktZ2lhbm1hdHZQVHBfTVplellqRTR5b0JhVTMxOVJlaXlUMHpJRU5VRzZsNGpscTh6aWVmOE5xYlJVUV8tV2xVdW9IbU8zaUZ1TFZHZ0VpajRhTGRvMzIxQWtEWWFZTkwzT1JQemh1VFpsRENfdy1QM3dvLVFqeWtSV1NoTl9Icl9FSTlfSXAwcnNuRTl3QUhuUlQwemxabWpYTF96NGloemlvamJNRGJpa2h3emZwOHYzWFcwdjRGeVA1SFdVRUJvdmhwdlo3bTREXzFKUXJSZW1vUHhWYmNhNUFKMUtaZVhQN3V4OEc2cHlJa2dnamZCNEJjcnVIVUExRDZIWHNJZWdrbl9qZVRQSVdmSDVQODJtR0ktRkJWQTV4YVlfT1lOck5CUFdMZ3F2VzlKZWo2M29kU0Iwd1hDZnE4emJ5M0pYV0I3N0VsUWtjM1d3d3dXSHdXOV85SWl5Mmg4bWZXYTJZNGdUU2xfWjZfcmIweS1VT09ackNValBNMHRUTGlwUDIyWHJYNnVjZGhRaWktb1pWR3VYcW9jdE8ybXlZMzQtV2lwNUVRa1JuTl9fb0s5a2NoX2l0aVBDMHh2aG1WSVMzSFR2M0pUTkd6T0dQV0hjaVZFV3JyQVA1M01CZmpRU0YtN0RTeTVDa055ck16TmE5TktsckNpUWxBVDFxdFJRd3pHZGIwd1J2UEZZdnp4OXh5QU1yUnNyVndyck1XSjV3dzNpaWgtRnNNc1BwZWhGY3NtVWYzTl82OGNoa1lEbEVYZmNPXzZ5Q3h2bkNlYXV0SFRxdXFoYjJ2YlhlelNSLVd5ODkwVzRkNFRlNHh2bVJNUDlPSEtpdWktOHl6NmIxS1dCd2RIZHBvbC1UMVhhR2FoZ1ZwcDI2SFczZUZ3Rm9RNGYwcVJsaVd3TWwyaWFMS09PeW5NMEhWcVN2OXItdG4yYjlsczRacVZZdnE1MVg0Q3Z3cTkzbzh6eWZkRHhOcGUwcXB5T1JKaVBPdTNtcWZfcEVJSmYzaHE2N29MdEN0SVh2SXd3emZIUWhEMHBhWHNjQ2FHTW4tVkJpZ3pIRk51S2VaREZBTktydEhkYVUzQVVlQ1k4SHRYNHItWjg1MHpoVGt2VEZRV2JuU2tmSmRTdnFHbEhvX0tVZVZXcHJIZHNKemd6SlBHXzdwNmlHOW4wX0JEREZFdnBXSkhkemlfNFdZdXBoZ3pBdHF3d0xRRGtTNHQ0OGJOWldaMVlCaVg4bHczZDNYcm45Z2kzdktBU0M3N184bmxNU0Q1RUxCVVliMndxVl9xSHQybTgwY2RpZkJZQkxQa1lreHJrcC1COEpoTzlMQnJpQWdTTkh3SlRwMzVQYUJ1VU00aFhoTjFrNjI4LUpmbFBRelVtM0pILXY1SnlpTHN5enpLTE84Y0FXME5EZXFuVUF3RkxFNUg3NUkxVTJfbmdUeUZ2aGJKV0UtcEZ5TUxNQ3JUcHI2Qm15anI3STJxUXFsczZWbnlaczFfTlFZUnVZWWNVMkRJdklVOTdQbWhrTHVma0lyUUZqM2RTSWdrSVBlMnd6dzVQYkdyeUFWZWw5aU5EUVd4cU05YThXSkVvdWFQSGNRZlJWMGk4U2stVnhXNlJnTlRac0pMTHdZdXZWRExKN3BBd0lyRExlZ2V5cmptWDY3YkhTWkVvNmQxNUY3VlctcmFKcFFuRWxIRzVPMzZjSTFsVFlUMThGeUZ5amI2RDQ2Nk45cEJhc2FpQ2Fidk9fZm5hbG93QVpRTlU4R21kTmVGN0h6UXQ1eEdqRElwU3FSby1PeWl0V1V3UlhKM0xHVjVtcFduN0JMdzkxemhzaTFLUHpwRURYSGRFcmRyTnR0Z2t4aEVaUjcxTkhwNXRCUEgyT2hWOFJ0Q1JiWGhiSGNmYVRJbm04RGNzcmxSbXNodWZVTWNKcVpZWUdYTHRDVW9xbkNkZlp5cEJRZE0zZG9LRHdkYkpySXZPUG16eThaQmJsckxVNVUxQmtaQXhlQURfX01ZVlRpZFFOSmZvQlVkRWVMb0Z3VldHUWJGYU1oMzdoMTV4eE5IWmwwTndQUWZwWXFMUmJHUmVUdmdpQnFKSTB2ZTN3V0NGeC1jeC12RkMyeUtSbW8wSWZPbDlrYUVfVTJKbE1PRzUyVEs3MzdlbUhkNElJeFNHUklhQTUxWXB2NG8tbzNvV1ZGenBUMDZOWkwwVE50UHp5TDhHWVQ5S04tdEpZUHBZLXd6MElZM0pKNWZYd1l6aWJYbkJnZjliakU5VEpBeUFpa1g2Y3k2RjlvVDhTNTJ1eWgxVk1qNDdKMlJMSE9qMjRscEhRVHVGUjhfU2l1UXpWYmc3bEdka2tHNEZodEF1dW1TeFR0V3FGZkU4eEtHMzg1cktJbHNNWFJ1Q3hRb3FFQjZWWUttQzFNekpxQndnQUl2OFFhMnZLckIzZVd6YkVVcmFTUUxmVUN0UFVNY29CbFpmQnMtVm9heTQxSVFCM3I5bUNxZTUxZF81MzF4TWRRWnl2dGV5bXNqU1hZMi15dVdZUDFxUVJQZ3Bmd28zeDI1NHo0ODdHX3hhd2UtOFlZa2lhQzhIZ3J2MVJfckQ5YVFWN0s2WHZBZVk5V2t1QVJCSF8"))
getSources('dIO-9aGh4w');
