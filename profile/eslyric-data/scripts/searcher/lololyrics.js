import { parse } from 'himalaya/src/index.js';

const lyricContainerElements = [];

export function getConfig(cfg) {
	cfg.name = 'Lololyrics (Unsynced)';
	cfg.version = '0.2';
	cfg.author = 'TT';
	cfg.useRawMeta = true;
}

export function getLyrics(meta, man) {
	const Clean = (text) => text
		.replace(/\(.*\)|{.*}|\[.*\]|【.*】/g, '').normalize().trim().toLowerCase()
		.replace(/[^a-z0-9\- !#$%'()*+,./:-?@\\[\]^_|~.]/g, '')
		.replace(/@/g, 'at');

	let lyricsId;
	const artist = Clean(meta.rawArtist);
	const title = Clean(meta.rawTitle);
	const url = `https://www.lololyrics.com/artist/${artist}`;
	const settings = { url, timeout: 5000 };

	if (artist === '' || title === '') return;

	// Get the lyrics id from the search results
	request(settings, (err, res, body) => {
		if (err || res.statusCode !== 200) return;

		const cleanBodyLink = body.replace(/&amp;/g, '&').replace(/(<a[^>]*>.*?)[!#$%'()*+,./:-?@\\[\]^_|~.]*(.*?<\/a>)/gi, '$1$2');
		const titleRegex = new RegExp(`<a[^>]*>${title}.*</a>`, 'i');
		const match = cleanBodyLink.match(titleRegex);
		lyricsId = match ? match[0].match(/\/lyrics\/(\d+)\.html/)[1] : null;
	});

	// Construct the new url with the lyrics id
	const lyricsUrl = `https://www.lololyrics.com/lyrics/${lyricsId}.html`;
	const newSettings = { url: lyricsUrl, timeout: 5000 };

	// Get the lyrics
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
		lyricMeta.title = meta.rawTitle;
		lyricMeta.artist = meta.rawArtist;
		lyricMeta.lyricText = lyricText;
		lyricMeta.location = lyricsUrl;
		man.addLyric(lyricMeta);
	});
}

function findLyrics(rootElement) {
	if (rootElement.type !== 'element' || !rootElement.children || rootElement.children.length === 0) {
		return false;
	}

	for (const attribute of rootElement.attributes || []) {
		if (attribute.key === 'class' && attribute.value === 'lyrics_txt') {
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
		.replace(/[\u2000-\u200F\u2028-\u202F\u205F-\u206F\u3000\uFEFF]/gi, ' '); // Whitespace variants

	const children = element.children || [];
	const content = element.content || '';
	const tagName = element.tagName || '';
	const type = element.type || '';

	if (type === 'text') {
		return lyricText + content;
	}

	if (['br', 'script', 'comment'].includes(tagName)) { // Lololyrics formatting and remove unwanted stuff
		return lyricText.replace(/<br>/gi, '');
	}

	for (const child of children) {
		lyricText = parseLyrics(child, lyricText);
	}

	return Clean(lyricText);
}
