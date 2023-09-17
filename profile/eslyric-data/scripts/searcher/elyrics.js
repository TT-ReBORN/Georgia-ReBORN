import { parse } from 'himalaya/src/index.js';

const lyricContainerElements = [];

export function getConfig(cfg) {
	cfg.name = 'eLyrics (Unsynced)';
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
		.replace(/ /g, '-'); // eLyrics formatting

	const Num2Word = (number) => {
		const numWords = {
			0: 'zero',
			1: 'one',
			2: 'two',
			3: 'three',
			4: 'four',
			5: 'five',
			6: 'six',
			7: 'seven',
			8: 'eight',
			9: 'nine',
			10: 'ten',
			11: 'eleven',
			12: 'twelve',
			13: 'thirteen',
			14: 'fourteen',
			15: 'fifteen',
			16: 'sixteen',
			17: 'seventeen',
			18: 'eighteen',
			19: 'nineteen',
			20: 'twenty',
			30: 'thirty',
			40: 'forty',
			50: 'fifty',
			60: 'sixty',
			70: 'seventy',
			80: 'eighty',
			90: 'ninety'
		};

		let words = '';

		if (number >= 100) {
			words += `${Num2Word(Math.floor(number / 100))}hundred`;
			number %= 100;
		}

		if (number > 0) {
			if (words !== '') {
				words += '-and-';
			}
			if (number < 20) {
				words += numWords[number];
			} else {
				words += numWords[Math.floor(number / 10) * 10];
				if (number % 10 > 0) {
					words += `-${numWords[number % 10]}`;
				}
			}
		}

		return words;
	};

	const artist = Clean(meta.artist).replaceAll('the-', '').trim(); // eLyrics formatting
	const artistLetter = !isNaN(artist.charAt(0)) ? '0-9' : artist.charAt(0); // eLyrics formatting
	const title = Clean(meta.title).replace(/\d+/g, (match) => Num2Word(match)); // eLyrics formatting - title name containing numbers are converted to words
	const url = `https://www.elyrics.net/read/${artistLetter}/${artist}-lyrics/${title}-lyrics.html`;
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
		if (attribute.key === 'id' && attribute.value === 'inlyr') {
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
		.replace(/[\u2000-\u200F\u2028-\u202F\u205F-\u206F\u3000\uFEFF]/gi, ' '); // Whitespace variants

	const tag = element.tagName || '';
	const type = element.type || '';
	const children = element.children || [];
	const content = element.content || '';

	if (type === 'text') {
		return lyricText + content;
	}

	if (tag === 'br') { // eLyrics formatting
		return lyricText.replace(/<br>/gi, '');
	}

	for (const child of children) {
		if (tag === 'script') {  // eLyrics formatting
			return lyricText;
		}
		lyricText = parseLyrics(child, lyricText);
	}

	return Clean(lyricText);
}
