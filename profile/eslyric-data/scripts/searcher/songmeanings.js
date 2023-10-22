import { parse } from 'himalaya/src/index.js';

const lyricContainerElements = [];

export function getConfig(cfg) {
	cfg.name = 'SongMeanings (Unsynced)';
	cfg.version = '0.1';
	cfg.author = 'TT';
	cfg.useRawMeta = false;
}

export function getLyrics(meta, man) {
	const Clean = (text) => text
		.replace(/\(.*\)|{.*}|\[.*\]|【.*】/g, '').normalize().trim().toLowerCase()
		.replace(/[^a-z0-9\- ]/g, '')
		.replace(/@/g, 'at')
		.replace(/&/g, 'and')
		.replace(/ /g, '-'); // SongMeanings formatting

	let lyricsId;
	const artist = Clean(meta.artist);
	const title = Clean(meta.title);
	const url = `https://songmeanings.com/query/?query=${artist}+${title}&type=songtitles`;
	const settings = { url, timeout: 5000 };

	if (artist === '' || title === '') return;

	// Get the lyrics id from the search results
	request(settings, (err, res, body) => {
		if (err || res.statusCode !== 200) return;

		const lyricsLinkId = /href="https:\/\/songmeanings.com\/songs\/view\/(\d+)\/"/;
		const match = body.match(lyricsLinkId);
		lyricsId = match ? match[1] : null;
	});

	// Construct the new url with the lyrics id
	const lyricsUrl = `https://songmeanings.com/songs/view/${lyricsId}`;
	const newSettings = { url: lyricsUrl, timeout: 5000 };

	request(newSettings, (err, res, body) => {
		if (err || res.statusCode !== 200) return;

		const jsonElement = parse(body);
		const htmlElement = jsonElement.find(element => element.type === 'element' && element.tagName === 'html');
		if (!htmlElement) return;

		const bodyElement = htmlElement.children.find(element => element.type === 'element' && element.tagName === 'body');
		if (!bodyElement) return;

		let lyricText = '';
		if (findLyrics(bodyElement)) {
			for (const element of lyricContainerElements) {
				lyricText = parseLyrics(element, lyricText);
			}
			if (lyricText === '') return;
		}

		const lyricMeta = man.createLyric();
		lyricMeta.title = meta.title;
		lyricMeta.artist = meta.artist;
		lyricMeta.lyricText = lyricText;
		lyricMeta.location = url;
		man.addLyric(lyricMeta);
	});
}

function findLyrics(rootElement) {
	if (rootElement.type !== 'element' || !rootElement.children || rootElement.children.length === 0) {
		return false;
	}

	for (const attribute of rootElement.attributes || []) {
		if (attribute.key === 'class' && attribute.value === 'holder lyric-box') {
			lyricContainerElements.push(rootElement);
			return true;
		}
	}

	for (const child of rootElement.children) {
		if (findLyrics(child)) {
			return true;
		}
	}

	return false;
}

function parseLyrics(element, lyricText) {
	const Clean = (rawString) => rawString.trim()
		.replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16))) // HTML characters decode
		.replace(/&amp(;|)/gi, '&')
		.replace(/&gt(;|)/gi, '>')
		.replace(/&lt(;|)/gi, '<')
		.replace(/&nbsp(;|)/gi, '')
		.replace(/&quot(;|)/gi, '"')
		.replace(/<br>/gi, '')
		.replace(/\uFF1A/gi, ':')
		.replace(/\uFF08/gi, '(')
		.replace(/\uFF09/gi, ')')
		.replace(/\u00E2\u20AC\u2122|\u2019|\uFF07|[\u0060\u00B4]|â€™(;|)|â€˜(;|)|&apos(;|)|&#39(;|)|(&#(?:039|8216|8217|8220|8221|8222|8223|x27);)/gi, "'") // Apostrophe variants
		.replace(/[\u2000-\u200F\u2028-\u202F\u205F-\u206F\u3000\uFEFF]/gi, ' ') // Whitespace variants
		.replace(/\t/g, '') // SongMeanings formatting
		.replace(/Edit Lyrics/gi, ''); // SongMeanings formatting

	const tag = element.tagName || '';
	const type = element.type || '';
	const children = element.children || [];
	const content = element.content || '';

	if (type === 'text') {
		return lyricText + content;
	}

	if (tag === 'br') { // SongMeanings formatting
		return lyricText.replace(/<br>/gi, '');
	}

	for (const child of children) {
		lyricText = parseLyrics(child, lyricText);
	}

	return Clean(lyricText);
}
