export function getConfig(cfg) {
	cfg.name = 'KuGou 酷狗音乐 (Synced)';
	cfg.version = '0.2';
	cfg.author = 'anonymous & TT';
}

export function getLyrics(meta, man) {
	if (meta.duration === 0) return;

	let url = 'http://lyrics.kugou.com/search?ver=1&man=yes&client=pc&keyword='
		+ encodeURIComponent(`${meta.artist}-${meta.title}`)
		+ '&duration=' + Math.round(meta.duration) * 1000
		+ '&hash=';

	const lyricCandidates = [];

	request(url, (err, res, body) => {
		if (!err && res.statusCode === 200) {
			try {
				const obj = JSON.parse(body);
				const candidates = obj.candidates || [];
				for (const item of candidates) {
					if (item.id === null) {
						continue;
					}
					if (item.accesskey === null) {
						continue;
					}
					lyricCandidates.push({
						id: item.id,
						key: item.accesskey,
						title: item.song || '',
						artist: item.singer || ''
					});
				}
			} catch (e) { }
		}
	});

	const lyric_meta = man.createLyric();
	// request lyrics
	for (const candidate of lyricCandidates) {
		url = 'http://lyrics.kugou.com/download?ver=1&client=pc&id='
			+ candidate.id + '&accesskey=' + candidate.key
			+ '&fmt=krc&charset=utf8';
		request(url, (err, res, body) => {
			if (!err && res.statusCode === 200) {
				try {
					const obj = JSON.parse(body);
					if (obj.content) {
						lyric_meta.title = candidate.title;
						lyric_meta.artist = candidate.artist;
						lyric_meta.lyricData = base64Decode(obj.content);
						lyric_meta.fileType = 'krc';
						man.addLyric(lyric_meta);
					}
				} catch (e) {
					console.log(e);
				}
			}
		});
	}
}

// base64 decode
function base64Decode(str) {
	const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	const base64Table = new Uint8Array(256);

	for (let i = 0; i < base64Chars.length; ++i) {
		base64Table[base64Chars.charCodeAt(i)] = i;
	}

	const bufLen = str.length * 0.75;
	const arrBuf = new ArrayBuffer(bufLen);
	const bytes = new Uint8Array(arrBuf);

	let cursor = 0;
	for (let i = 0; i < str.length; i += 4) {
		const c1 = base64Table[str.charCodeAt(i)];
		const c2 = base64Table[str.charCodeAt(i + 1)];
		const c3 = base64Table[str.charCodeAt(i + 2)];
		const c4 = base64Table[str.charCodeAt(i + 3)];
		bytes[cursor++] = (c1 << 2) | (c2 >> 4);
		bytes[cursor++] = ((c2 & 15) << 4) | (c3 >> 2);
		bytes[cursor++] = ((c3 & 3) << 6) | (c4 & 63);
	}

	return arrBuf;
}
