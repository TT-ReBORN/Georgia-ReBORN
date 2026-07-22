export function getConfig(cfg) {
	cfg.name = 'Musixmatch (Synced)';
	cfg.version = '0.2.1';
	cfg.author = 'ohyeah & TT';
	cfg.useRawMeta = false;
}

export function getLyrics(meta, man) {
	evalLib('querystring/querystring.min.js');

	const token = queryToken(man);
	if (token === '') {
		log('cannot query token!');
		return;
	}

	const params = {
		user_language: 'en',
		app_id: 'web-desktop-app-v1.0',
		format: 'json',
		subtitle_format: 'lrc',
		q_track: meta.title,
		q_artist: meta.artist,
		q_album: meta.album,
		f_has_lyrics: 1,
		usertoken: token,
		t: new Date().getTime()
	};

	const headers = {};
	headers.cookie = 'AWSELBCORS=0; AWSELB=0';

	let url = 'https://apic-desktop.musixmatch.com/ws/1.1/track.search?';
	url += querystring.stringify(params);

	const settings = {
		url,
		method: 'GET',
		headers
	};

	const songList = [];
	request(settings, (err, res, body) => {
		if (err || res.statusCode !== 200) return;

		try {
			const obj = JSON.parse(body);
			const header = obj.message && obj.message.header;
			const statusCode = header && header.status_code;

			if (statusCode !== 200) {
				if (statusCode === 401 && header.hint === 'captcha') {
					log('search blocked: musixmatch is requiring a captcha for this token/IP, cannot recover automatically');
				}
				else if (statusCode === 401 && header.hint === 'renew') {
					log('search rejected: token needs renewal, clearing cached token');
					man.setSvcData('token', '');
				}
				else {
					log(`search failed: status_code=${statusCode}, hint=${header && header.hint}`);
				}
				return;
			}

			const trackList = obj.message.body.track_list;
			if (!Array.isArray(trackList)) {
				log('search succeeded but track_list is missing/not an array');
				return;
			}

			for (const trackObj of trackList) {
				const track = trackObj.track;
				const id = track.commontrack_id | 0;
				const title = track.track_name;
				const artist = track.artist_name;
				const album = track.album_name;
				const has_lyrics = track.has_lyrics | 0;
				const has_subtitles = track.has_subtitles | 0;

				if (id === 0) {
					continue;
				}

				if (has_lyrics === 0 && has_subtitles === 0) {
					continue;
				}

				songList.push({ id, title, artist, album, has_lyrics: has_lyrics !== 0, has_subtitles: has_subtitles !== 0 });
			}
		} catch (e) {
			log(`parse exception: ${e.message}`);
		}
	});

	const lyricMeta = man.createLyric();

	for (const song of songList) {
		if (man.checkAbort()) {
			return;
		}

		let lyricText = null;
		if (song.has_subtitles) {
			lyricText = queryLyric(token, song.id, true);
		}
		else if (song.has_lyrics) {
			lyricText = queryLyric(token, song.id, false);
		}

		if (lyricText == null) {
			continue;
		}

		lyricMeta.title = song.title;
		lyricMeta.artist = song.artist;
		lyricMeta.album = song.album;
		lyricMeta.lyricText = lyricText;
		man.addLyric(lyricMeta);
	}
}

function queryLyric(token, id, isSync) {
	const kUrl = `https://apic-desktop.musixmatch.com/ws/1.1/track.${isSync ? 'subtitle' : 'lyrics'}.get?`;
	const kBodyKey = isSync ? 'subtitle' : 'lyrics';
	const kLyricKey = isSync ? 'subtitle_body' : 'lyrics_body';
	const params = {
		user_language: 'en',
		app_id: 'web-desktop-app-v1.0',
		commontrack_id: id,
		usertoken: token
	};

	const headers = {};
	headers.cookie = 'AWSELBCORS=0; AWSELB=0';

	const queryUrl = kUrl + querystring.stringify(params);
	const settings = {
		url: queryUrl,
		method: 'GET',
		headers
	};

	let lyricText = null;

	request(settings, (err, res, body) => {
		if (err || res.statusCode !== 200) {
			return;
		}

		try {
			const obj = JSON.parse(body);
			const header = obj.message && obj.message.header;
			const statusCode = header && header.status_code;

			if (statusCode !== 200) {
				log(`queryLyric failed: status_code=${statusCode}, hint=${header && header.hint}`);
				return;
			}

			const bodyObj = obj.message.body && obj.message.body[kBodyKey];
			lyricText = bodyObj ? bodyObj[kLyricKey] : null;
		}
		catch (e) {
			log(`queryLyric exception: ${e.message}`);
		}
	});

	return lyricText;
}

function queryToken(man) {
	let token = man.getSvcData('token');

	if (token === '') {
		const kUrl = 'https://apic-desktop.musixmatch.com/ws/1.1/token.get?';
		const params = {
			user_language: 'en',
			app_id: 'web-desktop-app-v1.0',
			t: new Date().getTime()
		};

		const headers = {};
		headers.cookie = 'AWSELBCORS=0; AWSELB=0';

		const queryUrl = kUrl + querystring.stringify(params);
		const settings = {
			url: queryUrl,
			method: 'GET',
			headers
		};

		log('query token...');

		request(settings, (err, res, body) => {
			if (err || res.statusCode !== 200) {
				return;
			}

			try {
				const obj = JSON.parse(body);
				token = obj.message.body.user_token || '';
			} catch (e) {
				log(`queryToken exception: ${e.message}`);
			}
		});

		if (token === 'UpgradeOnlyUpgradeOnlyUpgradeOnlyUpgradeOnly') {
			token = '';
		}

		if (token !== '') {
			man.setSvcData('token', token);
			man.setSvcData('lastTokenUpdated', new Date().toUTCString());
		}
	}

	return token;
}

function log(str) {
	console.log(`[musixmatch]${str}`);
}
