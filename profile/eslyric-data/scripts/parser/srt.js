export function getConfig(cfg) {
    cfg.name = 'SRT Parser';
    cfg.version = '0.4';
    cfg.author = 'wistaria & TT';
    cfg.parsePlainText = true;
    cfg.fileType = 'srt';
}

export function parseLyric(context) {
    let lrcText = '';

    ////////////////////////////////////////////////
    /** https://github.com/bazh/subtitles-parser - Copyright (c) 2013 bazh <interesno@gmail.com> */
    const parser = (function() { const r = {}; r.fromSrt = function(r, e) { const n = e ? !0 : !1; r = r.replace(/\r/g, ''); const i = /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/g; r = r.split(i), r.shift(); for (var a = [], d = 0; d < r.length; d += 4)a.push({ id:r[d].trim(), startTime:n ? t(r[d + 1].trim()) : r[d + 1].trim(), endTime:n ? t(r[d + 2].trim()) : r[d + 2].trim(), text:r[d + 3].trim() }); return a }, r.toSrt = function(r) { if (!r instanceof Array) return ''; for (var t = '', n = 0; n < r.length; n++) { const i = r[n]; isNaN(i.startTime) || isNaN(i.endTime) || (i.startTime = e(parseInt(i.startTime, 10)), i.endTime = e(parseInt(i.endTime, 10))), t += i.id + '\r\n', t += i.startTime + ' --> ' + i.endTime + '\r\n', t += i.text.replace('\n', '\r\n') + '\r\n\r\n' } return t }; var t = function(r) { const t = /(\d+):(\d{2}):(\d{2}),(\d{3})/; const e = t.exec(r); if (e === null) return 0; for (let n = 1; n < 5; n++)e[n] = parseInt(e[n], 10), isNaN(e[n]) && (e[n] = 0); return 36e5 * e[1] + 6e4 * e[2] + 1e3 * e[3] + e[4] }; var e = function(r) { const t = [36e5, 6e4, 1e3]; const e = []; for (var n in t) { let i = (r / t[n] >> 0).toString(); i.length < 2 && (i = '0' + i), r %= t[n], e.push(i) } let a = r.toString(); if (a.length < 3) for (n = 0; n <= 3 - a.length; n++)a = '0' + a; return e.join(':') + ',' + a }; return r }());
    ////////////////////////////////////////////////

    const srtBlocks = parser.fromSrt(context.lyricText, true);
    for (const block of srtBlocks) {
        lrcText += `[${formatTime(block.startTime)}]${block.text.replace(/\n/g, ' ')}\r\n`;
    }

    context.lyricText = lrcText;
}

function formatTime(time) {
	const zpad = (n) => {
		const s = n.toString();
		return (s.length < 2) ? `0${s}` : s;
	};

	let t = Math.abs(time / 1000);
	const h = Math.floor(t / 3600);
	t -= h * 3600;

	const m = Math.floor(t / 60);
	t -= m * 60;

	const s = Math.floor(t);
	const ms = t - s;

	return `${(h ? `${zpad(h)}:` : '') + zpad(m)}:${zpad(s)}.${zpad(Math.floor(ms * 100))}`;
}
