/**
 * https://github.com/jsososo/QQMusicApi
 * https://github.com/xmcp/QRCD
 */

export function getConfig(cfg) {
	cfg.name = 'QQ Music 音乐 (Synced)';
	cfg.version = '0.2';
	cfg.author = 'ohyeah & TT';
}

export function getLyrics(meta, man) {
	evalLib('querystring/querystring.min.js');

	let url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_search_pc_lrc.fcg?';
	const data = {
		SONGNAME: meta.title,
		SINGERNAME: meta.artist,
		TYPE: 2,
		RANGE_MIN: 1,
		RANGE_MAX: 20
	};
	url += querystring.stringify(data);

	const headers = {};
	headers.Referer = 'https://y.qq.com';

	const settings = {
		method: 'get',
		url,
		headers
	};

	const stageSongList = [];

	request(settings, (err, res, body) => {
		if (err || res.statusCode !== 200) return;

		const xml_doc = mxml.loadString(body);
		const song_list = xml_doc.findElement('songinfo') || [];

		for (const song of song_list) {
			const id = song.getAttr('id');
			if (id == null) continue;
			const title = decodeURIComponent(getChildElementCDATA(song, 'name'));
			const artist = decodeURIComponent(getChildElementCDATA(song, 'singername'));
			const album = decodeURIComponent(getChildElementCDATA(song, 'albumname'));

			stageSongList.push({ id, title, artist, album });
		}
	});

	if (stageSongList.length > 0) {
		const lyricCount = queryLyricV3(meta, man, stageSongList);
		if (lyricCount == null || lyricCount < 1) {
			queryLyricV2(meta, man, stageSongList);
		}
	}
}

function queryLyricV3(meta, man, songList) {
	let lyricCount = 0;
	const headers = {};
	headers.Referer = 'https://y.qq.com';
	headers.Host = 'u.y.qq.com';
	// notes: some params may not be required, I did not test.
	const postData = {
		'comm': {
			_channelid: '0',
			_os_version: '6.2.9200-2',
			authst: '',
			ct: '19',
			cv: '1873',
			//guid: '30D1D7C616938DDB575AF16E56D44BD4',
			patch: '118',
			psrf_access_token_expiresAt: 0,
			psrf_qqaccess_token: '',
			psrf_qqopenid: '',
			psrf_qqunionid: '',
			tmeAppID: 'qqmusic',
			tmeLoginType: 2,
			uin: '0',
			wid: '0'
		},
		'music.musichallSong.PlayLyricInfo.GetPlayLyricInfo': {
			method: 'GetPlayLyricInfo',
			module: 'music.musichallSong.PlayLyricInfo'
		}
	};

	for (const song of songList) {
		const songID = song.id | 0;
		postData['music.musichallSong.PlayLyricInfo.GetPlayLyricInfo'].param = {
			albumName : btoa(song.album),
			crypt : 1,
			ct : 19,
			cv : 1873,
			interval : meta.duration | 0,
			lrc_t : 0,
			qrc : 1,
			qrc_t : 0,
			roma : 1,
			roma_t : 0,
			singerName : btoa(song.album),
			songID,
			songName : btoa(song.artist),
			trans : 1,
			trans_t : 0,
			type : -1
		};

		let url = 'https://u.y.qq.com/cgi-bin/musicu.fcg?';
		const params = {
			pcachetime: new Date().getTime() | 0
		};
		url += querystring.stringify(params);

		const postDataString = JSON.stringify(postData);
		const settings = {
			method: 'post',
			url,
			headers,
			body: postDataString
		};

		request(settings, (err, res, body) => {
			if (err || res.statusCode !== 200) return;

			try {
				const obj = JSON.parse(body);
				if (obj.code !== 0) {
					return;
				}

				const lyricObjRoot = obj['music.musichallSong.PlayLyricInfo.GetPlayLyricInfo'];
				if (lyricObjRoot.code !== 0) {
					return;
				}

				const lyricObj = lyricObjRoot.data;
				if (lyricObj.songID !== songID) {
					return;
				}

				const lyricMeta = man.createLyric();
				const lyricData = restoreQrc(lyricObj.lyric);
				if (lyricData == null) {
					return;
				}

				lyricMeta.title = song.title;
				lyricMeta.artist = song.artist;
				lyricMeta.album = song.album;
				lyricMeta.fileType = 'qrc';
				lyricMeta.lyricData = lyricData;
				man.addLyric(lyricMeta);
				++lyricCount;
			} catch (e) {
				console.log(`[qqmusic]request lyric exception: ${e.message}`);
			}
		});
	}

	return lyricCount;
}

function queryLyricV2(meta, man, songList) {
	const headers = {};
	headers.Referer = 'https://y.qq.com';

	for (const song of songList) {
		let url = 'https://c.y.qq.com/qqmusic/fcgi-bin/lyric_download.fcg?';
		const data = {
			version: '15',
			miniversion: '82',
			lrctype: '4',
			musicid: song.id
		};
		url += querystring.stringify(data);

		const settings = {
			method: 'get',
			url,
			headers
		};

		request(settings, (err, res, body) => {
			if (err || res.statusCode !== 200) return;

			body = body.replace('<!--', '').replace('-->', '').replace(/<miniversion.*\/>/, '').trim();
			const xmlRoot = mxml.loadString(body);
			if (xmlRoot == null) return;

			const lyricMeta = man.createLyric();
			const lyrics = xmlRoot.findElement('lyric') || [];

			for (const lyricEntry of lyrics) {
				const content = getChildElementCDATA(lyricEntry, 'content');
				if (content == null) continue;
				const lyricData = restoreQrc(content);
				if (lyricData == null) continue;

				lyricMeta.title = song.title;
				lyricMeta.artist = song.artist;
				lyricMeta.album = song.album;
				lyricMeta.lyricData = lyricData;
				lyricMeta.fileType = 'qrc';
				man.addLyric(lyricMeta);
			}
		});
	}
}

function queryLyric(meta, man) {
	const headers = {};
	headers.Referer = 'https://y.qq.com';

	// query LRC lyrics
	const queryNum = 10;
	let url = 'http://c.y.qq.com/soso/fcgi-bin/client_search_cp?';
	let data = {
		format: 'json',
		n: queryNum,
		p: 0,
		w: `${meta.title}+${meta.artist}`,
		cr: 1,
		g_tk: 5381
	};
	url += querystring.stringify(data);

	let settings = {
		method: 'get',
		url,
		headers
	};

	const stageSongList = [];

	request(settings, (err, res, body) => {
		console.log(err + url);
		if (!err && res.statusCode === 200) {
			try {
				const obj = JSON.parse(body);
				const data = obj.data || {};
				const song = data.song || {};
				const song_list = song.list || {};

				for (const song_entry of song_list) {
					let artist = '';
					const title = song_entry.songname || '';
					const album = song_entry.albumname || '';
					const artist_list = song_entry.singer || [];
					const songmid = song_entry.songmid || '';

					if (artist_list.length > 0) {
						artist = artist_list[0].name || '';
					}

					if (songmid === '') {
						continue;
					}

					stageSongList.push({ title, album, artist, songmid });
				}
			} catch (e) {
				console.log(`qqmusic exception: ${e.message}`);
			}
		}
	});

	const lyricMeta = man.createLyric();
	for (const result of stageSongList) {
		url = 'http://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?';
		data = {
			songmid: result.songmid,
			pcachetime: new Date().getTime(),
			g_tk: 5381,
			loginUin: 0,
			hostUin: 0,
			inCharset: 'utf8',
			outCharset: 'utf-8',
			notice: 0,
			platform: 'yqq',
			needNewCode: 1,
			format: 'json'
		};
		url += querystring.stringify(data);

		settings = {
			method: 'get',
			url,
			headers
		};

		request(settings, (err, res, body) => {
			if (!(!err && res.statusCode === 200)) return;

			lyricMeta.title = result.title;
			lyricMeta.artist = result.artist;
			lyricMeta.album = result.album;

			try {
				const obj = JSON.parse(body);
				const b64lyric = obj.lyric || '';
				const b64tlyric = data.trans || '';
				const tlyric = atob(b64tlyric);
				let lyric = atob(b64lyric);

				if (tlyric !== '') lyric += tlyric;
				lyricMeta.lyricText = lyric;
				man.addLyric(lyricMeta);
			} catch (e) {
				console.log(`qqmusic parse lyric response exception: ${e.message}`);
			}
		});
	}
}

function getChildElementCDATA(node, name) {
	const child = node.findElement(name);
	if (child == null) return '';

	const schild = child.getFirstChild();
	if (schild == null) return '';

	return schild.getCDATA() || '';
}

function restoreQrc(hexText) {
	if (hexText.length % 2 !== 0) return null;

	const sig = '[offset:0]\n';
	const arrBuf = new Uint8Array(hexText.length / 2 + sig.length);
	for (let i = 0; i < sig.length; ++i) {
		arrBuf[i] = sig.charCodeAt(i);
	}

	const offset = sig.length;
	for (let i = 0; i < hexText.length; i += 2) {
		arrBuf[offset + i / 2] = parseInt(hexText.slice(i, i + 2), 16);
	}

	return arrBuf.buffer;
}
