import { parse } from 'himalaya/src/index.js';

const lyricContainerElements = [];

export function getConfig(cfg) {
	cfg.name = 'LyricsMode (Unsynced)';
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
		.replace(/ /g, '_'); // LyricsMode formatting

	const artist = Clean(meta.artist).replaceAll('the_', '').trim(); // LyricsMode formatting
	const artistLetter = !isNaN(artist.charAt(0)) ? '0-9' : artist.charAt(0); // LyricsMode formatting
	const title = Clean(meta.title);
	const url = `https://www.lyricsmode.com/lyrics/${artistLetter}/${artist}/${title}.html`;
	const settings = { url, timeout: 5000 };

	if (artist === '' || title === '') return;

	request(settings, (err, res, body) => {
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
	const type = rootElement.type || '';
	const children = rootElement.children || [];
	const attributes = rootElement.attributes || [];

	if (type !== 'element' || !children || children.length === 0) {
		return false;
	}

	for (const attribute of attributes) {
		if (attribute.key === 'id' && attribute.value === 'lyrics_text') {
			lyricContainerElements.push(rootElement);
			return true;
		}
	}

	for (const child of children) {
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
		.replace(/Explain\n\s+Request\n\s+×/g, ''); // LyricsMode unwanted stuff

	const tag = element.tagName || '';
	const type = element.type || '';
	const children = element.children || [];
	const content = element.content || '';

	if (type === 'text') {
		return lyricText + content;
	}

	if (tag === 'br') { // LyricsMode formatting
		return lyricText.replace(/<br>/gi, '');
	}

	for (const child of children) {
		lyricText = parseLyrics(child, lyricText);
	}

	return Clean(lyricText);
}
