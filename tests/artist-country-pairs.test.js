'use strict';

// Run with: node --test tests/artist-country-pairs.test.js
// Exercise the production methods with deterministic foobar2000/GDI stubs.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const base = path.join(__dirname, '../profile/georgia-reborn/scripts/Base');

// Let rejection handlers in the VM finish before checking their effects.
const flushPromises = () => new Promise(resolve => setImmediate(resolve));

function fixture(artists = ['Alice', 'Bob'], countries = ['US', 'GB']) {
	const font = { Size: 18, Style: 0 };
	const flags = new Map();
	const calls = [];
	const metadata = { artists, countries };
	const context = vm.createContext({
		grSet: { showGridArtistFlags_layout: true, showLowerBarArtistFlags_layout: true, gridArtistFontSize_layout: 18, lowerBarFontSize_layout: 18, theme: 'white' },
		grFont: { gridArtist: font, lowerBarArtist: font },
		grTF: { artist: 'artist-format', artist_country: '%artistcountry%' },
		grStr: { artist: artists.join(', ') },
		grCol: { detailsText: 1, lowerBarArtist: 2 },
		grm: { details: { clearCache: () => calls.push('grid-invalidated') }, debug: { debugLog: () => {} } },
		Regex: { UtilFontNeedsSymbols: /\u266b/ },
		gdi: { Font: (name, Size, Style) => ({ name, Size, Style }) },
		Unicode: { MiddleDot: '·' },
		SCALE: value => value,
		HD_4K: value => value,
		InterpolationMode: { HighQualityBicubic: 7 },
		Stringformat: { No_Wrap: 0x1000, Trim_Ellipsis_Char: 0x300000, Measure_Trailing_Spaces: 0x800 },
		GetMetaValues: () => metadata.countries,
		$: expression => {
			if (expression === '$meta_num(artist)') return String(metadata.artists.length);
			const match = expression.match(/^\$meta\(artist,(\d+)\)$/);
			if (match) return metadata.artists[Number(match[1])];
			if (expression === '$meta(artist)') return metadata.artists.join(', ');
			if (expression === 'artist-format') return metadata.customText || metadata.artists.join(', ');
			throw new Error(`Unexpected title format: ${expression}`);
		}
	});
	vm.runInContext(fs.readFileSync(path.join(base, 'gr-main.js'), 'utf8') + '\nthis.MainUI = MainUI;', context);
	vm.runInContext(fs.readFileSync(path.join(base, 'gr-details.js'), 'utf8') + '\nthis.Details = Details;', context);
	const ui = Object.create(context.MainUI.prototype);
	ui.clearCache = type => calls.push(type);
	ui.initMetadb = () => metadata;
	ui.loadFlagImage = country => {
		calls.push(`load:${country}`);
		if (country === 'unknown') return null;
		if (!flags.has(country)) flags.set(country, { country, Width: 32, Height: 32 });
		return flags.get(country);
	};
	context.grm.ui = ui;
	const drawCalls = [];
	const gr = {
		CalcTextHeight: () => 20,
		CalcTextWidth: text => text.length * 8,
		MeasureString: text => ({ Width: text.length * 8, Height: 20, Lines: 1 }),
		SetInterpolationMode: () => {},
		SetTextRenderingHint: () => {},
		DrawString: (...args) => drawCalls.push({ type: 'text', args }),
		DrawImage: (...args) => drawCalls.push({ type: 'flag', args })
	};
	ui.loadCountryFlags();
	return { context, ui, gr, calls, metadata, drawCalls };
}

test('pairs preserve tag order, including commas inside artist names', () => {
	const { ui } = fixture(['Surname, Name', 'Other'], ['US', 'GB']);
	assert.equal(ui.artistCountryPairs[0].artist, 'Surname, Name');
	assert.equal(ui.artistCountryPairs[1].flagImg.country, 'GB');
});

test('missing or unknown countries never shift subsequent flags', () => {
	const { ui } = fixture(['A', 'B', 'C', 'D'], ['US', 'unknown', 'GB']);
	assert.equal(ui.artistCountryPairs.length, 4);
	assert.equal(ui.artistCountryPairs[1].flagImg, null);
	assert.equal(ui.artistCountryPairs[2].flagImg.country, 'GB');
	assert.equal(ui.artistCountryPairs[3].country, '');
	assert.equal(ui.artistCountryPairs[3].flagImg, null);
});

test('repeated countries share images while retaining one pair per artist', () => {
	const { ui, calls } = fixture(['A', 'B'], ['US', 'US']);
	assert.equal(calls.filter(call => call === 'load:US').length, 1);
	assert.equal(ui.artistCountryPairs[0].flagImg, ui.artistCountryPairs[1].flagImg);
});

test('single artist, missing ARTIST and missing flags retain the legacy path', () => {
	for (const [artists, countries] of [[['A'], ['US', 'GB']], [[], ['US']], [['A', 'B'], []], [['A', 'B'], ['unknown']]]) {
		const { ui } = fixture(artists, countries);
		assert.equal(ui.artistCountryPairs.length, 0);
		if (artists.length === 1) assert.equal(ui.flagImgs.length, 2);
	}
});

test('custom artist title formatting is preserved; V2 middle-dot formatting is supported', () => {
	const { ui, metadata } = fixture();
	metadata.customText = 'Custom artist display';
	ui.loadCountryFlags();
	assert.equal(ui.artistCountryPairs.length, 0);
	assert.equal(ui.flagImgs.length, 2);
	metadata.customText = 'Alice · Bob';
	ui.loadCountryFlags();
	assert.equal(ui.artistCountryPairs.length, 2);
});

test('disabled flags and stopped playback release previous pairs and invalidate metrics', () => {
	const { ui, context, calls } = fixture();
	context.grSet.showGridArtistFlags_layout = false;
	context.grSet.showLowerBarArtistFlags_layout = false;
	ui.loadCountryFlags();
	assert.equal(ui.artistCountryPairs.length, 0);
	assert.equal(ui.flagImgs.length, 0);
	assert.ok(calls.includes('metrics'));
	assert.ok(calls.includes('grid-invalidated'));
	context.grSet.showGridArtistFlags_layout = true;
	ui.initMetadb = () => null;
	ui.loadCountryFlags();
	assert.equal(ui.artistCountryPairs.length, 0);
});

test('track changes, tag edits and explicit browse handles rebuild pair data', () => {
	const { ui, metadata } = fixture();
	metadata.artists = ['New A', 'New B'];
	metadata.countries = ['GB'];
	let receivedHandle;
	ui.loadFlagImage = (country, handle) => {
		receivedHandle = handle;
		return { country, Width: 32, Height: 32 };
	};
	const handle = { selected: true };
	ui.loadCountryFlags(handle);
	assert.equal(receivedHandle, handle);
	assert.equal(ui.artistCountryPairs[0].artist, 'New A');
	assert.equal(ui.artistCountryPairs[1].flagImg, null);
});

test('flag cache cleanup releases artist and image references', () => {
	const { ui, context } = fixture();
	context.MainUI.prototype.clearCache.call(ui, 'flag');
	assert.equal(ui.flagImgs.length, 0);
	assert.equal(ui.artistCountryPairs.length, 0);
});

test('lower bar draws alternating flags, names and separators with matching width', () => {
	const { ui, gr, drawCalls } = fixture();
	const layout = ui.getArtistCountryPairsLayout(gr, 'lowerBar');
	assert.equal(layout.totalWidth, 24 + 5 + 40 + 24 + 24 + 5 + 24);
	ui.drawArtistCountryPairs(gr, 'lowerBar', 10, 20, layout.totalWidth, 20);
	assert.deepEqual(drawCalls.map(call => call.type), ['flag', 'text', 'text', 'flag', 'text']);
	assert.deepEqual(drawCalls.filter(call => call.type === 'text').map(call => call.args[0]), ['Alice', ' · ', 'Bob']);
	for (const call of drawCalls) {
		if (call.type === 'text') assert.ok(call.args[3] + call.args[5] <= 10 + layout.totalWidth);
	}
});

test('Details wrapping uses two lines without a leading separator', () => {
	const { ui, gr, drawCalls } = fixture();
	const layout = ui.getArtistCountryPairsLayout(gr, 'metadataGrid', 80);
	assert.equal(layout.lineCount, 2);
	assert.equal(layout.height, 40);
	assert.equal(layout.truncated, false);
	assert.equal(layout.items[1].prefixW, 0);
	ui.drawArtistCountryPairs(gr, 'metadataGrid', 0, 0, 80, layout.height);
	assert.deepEqual(drawCalls.filter(call => call.type === 'text').map(call => [call.args[0], call.args[4]]), [['Alice', 0], ['Bob', 20]]);
});

test('long names and narrow or negative bounds stay clipped and report overflow', () => {
	const { ui, gr, drawCalls } = fixture(['A very long artist name', 'B']);
	for (const width of [-10, 0, 10, 40, 100]) {
		const layout = ui.getArtistCountryPairsLayout(gr, 'metadataGrid', width);
		assert.equal(layout.truncated, true);
		assert.ok(layout.lineCount <= 2);
		assert.ok(layout.totalWidth <= Math.max(0, width));
		for (const item of layout.items) assert.ok(item.x + item.prefixW + item.flagSpace + item.textW <= width);
	}
	ui.drawArtistCountryPairs(gr, 'metadataGrid', 0, 0, 100, 0);
	assert.equal(drawCalls.length, 0);
});

test('Details truncation remains available to existing tooltip logic', () => {
	const { ui, context, gr } = fixture(['A very long artist name', 'B']);
	Object.assign(context.grSet, { showGridArtist_layout: true });
	const details = Object.create(context.Details.prototype);
	details.gridContentWidth = 50;
	context.CalcWrapSpace = () => ({ lineCount: 1, totalWrapSpace: 0 });
	gr.MeasureString = text => ({ Width: (text || "").length * 8, Height: 20, Lines: 1 });
	details.setGridTextMetrics(gr, () => {});
	assert.equal(details.gridArtistWrapLinesExceed, true);
	assert.equal(details.gridArtistNumLinesHeight, ui.getArtistCountryPairsLayout(gr, 'metadataGrid', 50).height);
});

test('symbol fallback font is shared by measurement and drawing', () => {
	const { ui, gr, drawCalls } = fixture(['♫ Alice', 'Bob']);
	const layout = ui.getArtistCountryPairsLayout(gr, 'lowerBar');
	assert.equal(layout.items[0].font.name, 'Segoe UI Symbol');
	ui.drawArtistCountryPairs(gr, 'lowerBar', 0, 0, 300, 20);
	assert.equal(drawCalls.find(call => call.type === 'text').args[1].name, 'Segoe UI Symbol');
});


test('Details renderer keeps the legacy text when its flag option is disabled', () => {
	const { ui, context, gr, drawCalls } = fixture();
	context.grSet.showGridArtistFlags_layout = false;
	context.grStr.artist = 'Alice, Bob';
	context.RES = { _4K: false };
	context.TextRenderingHint = { ClearTypeGridFit: 1, AntiAliasGridFit: 2 };
	context.DrawString = (...args) => args[0].DrawString(...args.slice(1));
	ui.getFormattedString = () => 'Alice, Bob';
	const details = Object.create(context.Details.prototype);
	Object.assign(details, { gridMarginLeft: 5, gridTop: 10, gridContentWidth: 300, gridArtistNumLinesHeight: 20 });
	assert.equal(details.drawGridArtist(gr), 20);
	assert.equal(drawCalls.length, 1);
	assert.equal(drawCalls[0].args[0], 'Alice, Bob');
});

test('Details renderer uses the measured paired layout when enabled', () => {
	const { context, gr, drawCalls } = fixture();
	context.grStr.artist = 'Alice, Bob';
	context.RES = { _4K: false };
	context.TextRenderingHint = { ClearTypeGridFit: 1, AntiAliasGridFit: 2 };
	const details = Object.create(context.Details.prototype);
	Object.assign(details, { gridMarginLeft: 5, gridTop: 10, gridContentWidth: 80, gridArtistNumLinesHeight: 40 });
	assert.equal(details.drawGridArtist(gr), 40);
	assert.equal(details.gridArtistBottom, 50);
	assert.deepEqual(drawCalls.filter(call => call.type === 'text').map(call => call.args[0]), ['Alice', 'Bob']);
});

test('more countries than artists do not create phantom artist entries', () => {
	const { ui } = fixture(['A', 'B'], ['US', 'GB', 'FR']);
	assert.equal(ui.artistCountryPairs.length, 2);
	assert.equal(ui.flagImgs.length, 3);
});

test('scaled and 4K layouts retain nonnegative, bounded drawing geometry', () => {
	for (const scale of [0.5, 1, 1.25, 1.5, 2]) {
		const { ui, context, gr } = fixture(['A', 'B', 'C'], ['US', 'GB', 'US']);
		context.SCALE = value => value * scale;
		context.HD_4K = (hd, uhd) => uhd;
		for (const fontSize of [10, 18, 24]) {
			context.grSet.gridArtistFontSize_layout = fontSize;
			for (let width = 0; width <= 300; width += 7) {
				const layout = ui.getArtistCountryPairsLayout(gr, 'metadataGrid', width);
				assert.ok(layout.lineCount <= 2);
				assert.ok(layout.totalWidth <= width);
				for (const item of layout.items) {
					assert.ok(item.flagW >= 0 && item.textW >= 0);
					assert.ok(item.x + item.prefixW + item.flagSpace + item.textW <= width);
				}
			}
		}
	}
});

test('the drawing flags used by the feature exist in the upstream Stringformat enum', () => {
	const source = fs.readFileSync(path.join(base, 'gr-common.js'), 'utf8');
	const enumSource = source.match(/const Stringformat = \{[\s\S]*?\n\};/)[0];
	const actual = vm.runInNewContext(enumSource + '\nStringformat;');
	assert.equal(actual.No_Wrap, 0x1000);
	assert.equal(actual.Trim_Ellipsis_Char, 0x300000);
});

test('DrawString rectangles include GDI+ padding instead of GdiDrawText widths', () => {
	const { ui, gr, drawCalls } = fixture(['\u6210\u9f99', '\u91d1\u559c\u5584']);
	// GDI+ DrawString needs a wider rectangle than the GDI CalcTextWidth result.
	gr.MeasureString = text => ({ Width: text.length * 8 + 12, Height: 20, Lines: 1 });
	for (const type of ['lowerBar', 'metadataGrid']) {
		const layout = ui.getArtistCountryPairsLayout(gr, type, 600);
		assert.equal(layout.truncated, false);
		for (const item of layout.items) {
			assert.equal(item.textW, gr.MeasureString(item.pair.artist).Width);
		}
		assert.equal(layout.separatorW, gr.MeasureString(' · ').Width);
		ui.drawArtistCountryPairs(gr, type, 0, 0, 600, 40);
	}
	for (const call of drawCalls.filter(call => call.type === 'text')) {
		assert.ok(call.args[5] >= gr.MeasureString(call.args[0]).Width);
	}
});

test('failed metric calculations leave caches retryable and report the error', async () => {
	const { context, ui, gr } = fixture();
	const logs = [];
	context.grm.debug.debugLog = message => logs.push(message);
	context.grm.display = { hasPlayerSizeChanged: () => false };
	const details = Object.create(context.Details.prototype);
	for (const [target, run, main, text, cache] of [
		[ui, 'setLowerBarMetrics', 'setLowerBarMainMetrics', 'setLowerBarTextMetrics', 'cachedLowerBarMetrics'],
		[details, 'setGridMetrics', 'setGridMainMetrics', 'setGridTextMetrics', 'cachedGridMetrics']
	]) {
		target[main] = () => { throw new Error('metrics unavailable'); };
		target[text] = (graphics, resolve) => resolve();
		target[run](gr);
		await flushPromises();
		assert.equal(target[cache], false);
		target[main] = (graphics, resolve) => resolve();
		Object.assign(target, { loadingThemeComplete: true, displayDetails: false, gridColumnValueBottom: 20, gridColumnTop: 0 });
		target[run](gr);
		await flushPromises();
		assert.equal(target[cache], true);
	}
	assert.equal(logs.length, 2);
	assert.ok(logs.every(message => message.includes('metrics unavailable')));
});

test('first-launch background failures are handled without changing initialization order', async () => {
	const { context, ui } = fixture();
	const events = [];
	const logs = [];
	context.grSet.systemFirstLaunch = true;
	ui.initMain = async () => { events.push('main'); };
	ui.setDesign = design => events.push(design);
	context.grm.debug.debugLog = message => logs.push(message);
	context.grm.settings = { setThemeSettings: async (...args) => {
		assert.deepEqual(args, [false, false, true]);
		events.push('settings');
		throw new Error('settings unavailable');
	} };
	context.grm.display = { autoDetectRes: async () => {
		events.push('resolution');
		throw new Error('resolution unavailable');
	} };
	await ui.initSystemFirstLaunch();
	await flushPromises();
	assert.deepEqual(events, ['main', 'settings', 'resolution', 'reborn']);
	assert.equal(context.grSet.systemFirstLaunch, false);
	assert.equal(logs.length, 2);
	assert.ok(logs.some(message => message.includes('settings unavailable')));
	assert.ok(logs.some(message => message.includes('resolution unavailable')));
});

test('artwork decode failures are handled on each list display path', async () => {
	for (const method of ['cycleAlbumArtImage', 'displayAlbumArtImage', 'displayAlbumArtFromList']) {
		const { context, ui } = fixture();
		const logs = [];
		const oldArt = { name: 'previous cover' };
		Object.assign(ui, { albumArtList: ['cover.jpg'], albumArtIndex: 0, albumArt: oldArt });
		ui.loadAlbumArtFromList = async () => { throw new Error('decode failed'); };
		ui.checkAlbumArtFromListDiscArt = () => assert.fail('failed artwork must not reach success callbacks');
		context.grm.debug = { debugLog: message => logs.push(message), repaintWindow: () => {} };
		context.setTimeout = callback => { callback(); return 1; };
		ui[method]('next', false);
		await flushPromises();
		assert.equal(ui.albumArt, oldArt);
		assert.equal(logs.filter(message => message.includes('decode failed')).length, 1);
	}
});
