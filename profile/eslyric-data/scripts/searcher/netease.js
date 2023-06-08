/*

all credits to：
https://github.com/Binaryify/NeteaseCloudMusicApi
https://github.com/entronad/crypto-es

*/

import crypto from 'crypto-es/lib/index.js';

evalLib('querystring/querystring.min.js');

const iv = crypto.enc.Latin1.parse('0102030405060708');
const linuxapiKey = crypto.enc.Latin1.parse('rFgB&h#%2?^eDg:Q');

const aesEncrypt = (buffer, mode, key, iv) => {
    const cipher = crypto.AES.encrypt(buffer, key, { mode: mode, iv: iv })
    return cipher.ciphertext;
}

const linuxapi = (object) => {
    const text = JSON.stringify(object);
    return {
        eparams: aesEncrypt(crypto.enc.Utf8.parse(text), crypto.mode.ECB, linuxapiKey, iv).toString(crypto.enc.Hex).toUpperCase()
    }
}

const doRequest = (method, url, data, options) => {
    return new Promise((resolve, reject) => {
        let headers = {};
        if (method.toUpperCase() === 'POST')
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        if (url.includes('music.163.com'))
            headers['Referer'] = 'https://music.163.com';
        if (options.crypto === 'linuxapi') {
            data = linuxapi({
                method: method,
                url: url.replace(/\w*api/, 'api'),
                params: data
            });
            headers['User-Agent'] = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36';
            url = 'https://music.163.com/api/linux/forward';
        } else {
            reject();
            return;
        }
        const settings = {
            method: method,
            url: url,
            headers: headers,
            body: querystring.stringify(data)
        };
        request(settings, (err, res, body) => {
            if (!err && res.statusCode === 200)
                resolve(body);
            else
                reject(err, res);
        });
    }).catch(error => console.log(error.message));
}

const procKeywords = (str) => {
    var s = str;
    s = s.toLowerCase();
    s = s.replace(/\'|·|\$|\&|–/g, "");
    //truncate all symbols
    s = s.replace(/\(.*?\)|\[.*?]|{.*?}|（.*?/g, "");
    s = s.replace(/[-/:-@[-`{-~]+/g, "");
    s = s.replace(/[\u2014\u2018\u201c\u2026\u3001\u3002\u300a\u300b\u300e\u300f\u3010\u3011\u30fb\uff01\uff08\uff09\uff0c\uff1a\uff1b\uff1f\uff5e\uffe5]+/g, "");
    return s;
}

export function getConfig(config) {
    config.name = "网易云音乐";
    config.version = "0.2";
    config.author = "ohyeah";
}

export function getLyrics(meta, man) {
    var title = procKeywords(meta.rawTitle);
    var artist = procKeywords(meta.rawArtist);
    const data = {
        s: title + " " + artist,
        type: 1,
        limit: 10,
        offset: 0
    }

    doRequest('POST',
        'https://music.163.com/weapi/search/get',
        data,
        { crypto: 'linuxapi' }
    ).then((body) => {
        let candicates = [];
        candicates = parseSearchResults(body);
        for (const item of candicates) {
            const queryData = {
                id: item.id
            };
            doRequest('POST',
                'https://music.163.com/weapi/song/lyric?lv=-1&kv=-1&tv=-1',
                queryData,
                { crypto: 'linuxapi' }
            ).then((body) => {
                parseLyricResponse(item, man, body);
            });
        }
    });
    // loop to 'wait' callback(promise)
    messageLoop(0);
}

function parseSearchResults(body) {
    let candicates = [];
    try {
        let obj = JSON.parse(body);
        let results = obj['result'] || {};
        let songs = results['songs'] || [];
        for (const song of songs) {
            if (typeof (song['id']) === 'undefined' || typeof (song['name']) === 'undefined')
                continue;
            let id = song['id'];
            let title = song['name'];
            let artist = '';
            let artists = song['artists'] || [];
            for (const item of artists) {
                if ('name' in item) {
                    artist = item['name'];
                    break;
                }
            }
            let album = song['album'] || {};
            album = album['name'] || '';
            candicates.push({ id: id, title: title, artist: artist, album: album });
        }
    } catch (e) { }
    return candicates;
}

function parseLyricResponse(item, man, body) {
    try {
        let lyricObj = JSON.parse(body);
        let lyricText = '';
        if (lyricObj['lrc']) {
            lyricText = lyricObj['lrc']['lyric'] || '';
            let version = lyricObj['lrc']['version'] || 0;
            if (version == 1) return;
        }
        if (lyricObj['tlyric']) {
            lyricText += lyricObj['tlyric']['lyric'] || '';
        }

        let meta = man.createLyric();
        meta.title = item.title;
        meta.artist = item.artist;
        meta.album = item.album;
        meta.lyricText = lyricText;
        man.addLyric(meta);
        /*
        lyricText = '';
        if (lyricObj['klyric']) {
            lyricText = lyricObj['klyric']['lyric'] || '';
        }

        if (lyricText != '') {
            meta.title += ' (Enhanced LRC)';
            meta.lyricText = parseKLyric(lyricText);
            console.log(meta.lyricText);
            man.addLyric(meta);
        }
        */
    } catch (e) { console.log(e); }
}

function parseKLyric(lyricText)
{
    let enhancedlyricText = "";
    let matches;
    let metaRegex = /^\[(\S+):(\S+)\]$/;
    let timestampsRegex = /^\[(\d+),(\d+)\]/;
    let timestamps2Regex = /\((\d+),(\d+)\)([^\(]*)/g;
    let lines = lyricText.split(/[\r\n]/);
    for (const line of lines) {
        console.log(line);
        if (matches = metaRegex.exec(line)) { // meta info
            enhancedlyricText += matches[0] + "\r\n";
        } else if (matches = timestampsRegex.exec(line)) {
            let lyricLine = "";
            let startTime = parseInt(matches[1]);
            let duration = parseInt(matches[2]);
            lyricLine = "[" + formatTime(startTime) + "]";
            // parse sub-timestamps
            let subMatches;
            let subStartTime = startTime;
            while (subMatches = timestamps2Regex.exec(line)) {
                let subDuration = parseInt(subMatches[2]);
                let subWord = subMatches[3];
                lyricLine += "<" + formatTime(subStartTime) + ">" + subWord;
                subStartTime += subDuration;
            }
            lyricLine += "<" + formatTime(startTime + duration) + ">";
            enhancedlyricText += lyricLine + "\r\n";
        }
    }
    return enhancedlyricText;
}

function zpad(n) {
    var s = n.toString();
    return (s.length < 2) ? "0" + s : s;
}

function formatTime(time) {
    var t = Math.abs(time / 1000);
    var h = Math.floor(t / 3600);
    t -= h * 3600;
    var m = Math.floor(t / 60);
    t -= m * 60;
    var s = Math.floor(t);
    var ms = t - s;
    var str = (h ? zpad(h) + ":" : "") + zpad(m) + ":" + zpad(s) + "." + zpad(Math.floor(ms * 100));
    return str;
}
