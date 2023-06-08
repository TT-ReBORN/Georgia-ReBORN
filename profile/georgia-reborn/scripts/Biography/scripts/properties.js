'use strict';

class PanelPropertyBio {
	constructor(name, default_value) {
		this.name = name;
		this.default_value = default_value;
		this.value = pptBio.get(this.name, default_value);
	}

	// Methods

	get() {
		return this.value;
	}

	set(new_value) {
		if (this.value !== new_value) {
			pptBio.set(this.name, new_value);
			this.value = new_value;
		}
	}
}

class PanelPropertiesBio {
	constructor() { // this.name_list = {}; debug
	}

	// Methods

	init(type, properties, thisArg) {
		switch (type) {
			case 'auto':
				properties.forEach(v => { // this.validate(v); debug
					this.add(v);
				});
				break;
			case 'manual':
				properties.forEach(v => thisArg[v[2]] = this.get(v[0], v[1]));
				break;
		}
	}

	validate(item) {
		if (!$Bio.isArray(item) || item.length !== 3 || typeof item[2] !== 'string') {
			throw ('invalid property: requires array: [string, any, string]');
		}
		if (item[2] === 'add') {
			throw (`property_id: ${item[2]}\nThis id is reserved`);
		}
		if (this[item[2]] != null || this[`${item[2]}_internal`] != null) {
			throw (`property_id: ${item[2]}\nThis id is already occupied`);
		}
		if (this.name_list[item[0]] != null) {
			throw (`property_name: ${item[0]}\nThis name is already occupied`);
		}
	}

	add(item) {
		// this.name_list[item[0]] = 1; debug
		this[`${item[2]}_internal`] = new PanelPropertyBio(item[0], item[1]);

		Object.defineProperty(this, item[2], {
			get() {
				return this[`${item[2]}_internal`].get();
			},
			set(new_value) {
				this[`${item[2]}_internal`].set(new_value);
			}
		});
	}

	get(name, default_value) {
		return window.GetProperty(name, default_value);
	} // initialisation

	set(name, new_value) {
		return window.SetProperty(name, new_value);
	}

	toggle(name) {
		this[name] = !this[name];
	}
}

let propertiesBio = [
	['Panel Biography - - Show Html Dialog Unsupported-0 Supported-1 Autocheck-2', 2, 'isHtmlDialogSupported'],
	['Panel Biography - Album History', JSON.stringify([]), 'albumHistory'],
	['Panel Biography - Artist History', JSON.stringify([]), 'artistHistory'],
	['Panel Biography - Artist View', true, 'artistView'],

	['Panel Biography - Bio & Rev Same Style', true, 'sameStyle'],
	['Panel Biography - Button LookUp', 2, 'lookUp'],

	['Panel Biography - Classical Music Mode', false, 'classicalMusicMode'],
	['Panel Biography - Classical Music Mode Album Fallback', false, 'classicalAlbFallback'],
	['Panel Biography - Colour Line Dark', false, 'colLineDark'],
	['Panel Biography - Colour Swap', false, 'swapCol'],

	['Panel Biography - Cover Border [Dual Mode]', false, 'covBorderDual'],
	['Panel Biography - Cover Border [Image Only]', false, 'covBorderImgOnly'],
	['Panel Biography - Cover Load All', false, 'loadCovAllFb'],
	['Panel Biography - Cover Selection', JSON.stringify([0, 1, 2, 3, 4]), 'loadCovSelFb'],
	['Panel Biography - Cover Load Folder', false, 'loadCovFolder'],
	['Panel Biography - Cover Reflection [Dual Mode]', false, 'covReflDual'],
	['Panel Biography - Cover Reflection [Image Only]', false, 'covReflImgOnly'],
	['Panel Biography - Cover Shadow [Dual Mode]', false, 'covShadowDual'],
	['Panel Biography - Cover Shadow [Image Only]', false, 'covShadowImgOnly'],
	['Panel Biography - Cover Style [Dual Mode] Regular-0 Auto-Fill-1 Circular-2', 1, 'covStyleDual'],
	['Panel Biography - Cover Style [Image Only] Regular-0 Auto-Fill-1 Circular-2', 1, 'covStyleImgOnly'],
	['Panel Biography - Cover Type', 0, 'covType'],

	['Panel Biography - Custom Colour Background', '4,39,68', 'bg'],
	['Panel Biography - Custom Colour Film Active Item Frame', '29, 62, 99, 208', 'frame'],
	['Panel Biography - Custom Colour Heading Button', '121,194,255', 'headingBtn'],
	['Panel Biography - Custom Colour Heading Text', '121,194,255', 'headingText'],
	['Panel Biography - Custom Colour Line', '12,21,31', 'line'],
	['Panel Biography - Custom Colour Overlay Fill', 'rgb(64-0-0)', 'rectOv'],
	['Panel Biography - Custom Colour Overlay Border', '0,255,255', 'rectOvBor'],
	['Panel Biography - Custom Colour Rating Stars', '255,190,0', 'stars'],
	['Panel Biography - Custom Colour Summary', '128,228,0', 'summary'],
	['Panel Biography - Custom Colour Text', '171,171,190', 'text'],
	['Panel Biography - Custom Colour Text Highlight', '121,194,255', 'text_h'],
	['Panel Biography - Custom Colour Transparent Fill', '0,0,0,0.06', 'bgTrans'],

	['Panel Biography - Custom Colour Background Use', false, 'bgUse'],
	['Panel Biography - Custom Colour Film Active Item Frame Use', false, 'frameUse'],
	['Panel Biography - Custom Colour Heading Button Use', false, 'headingBtnUse'],
	['Panel Biography - Custom Colour Heading Text Use', false, 'headingTextUse'],
	['Panel Biography - Custom Colour Line Use', false, 'lineUse'],
	['Panel Biography - Custom Colour Overlay Fill Use', false, 'rectOvUse'],
	['Panel Biography - Custom Colour Overlay Border Use', false, 'rectOvBorUse'],
	['Panel Biography - Custom Colour Rating Stars Use', false, 'starsUse'],
	['Panel Biography - Custom Colour Summary Use', false, 'summaryUse'],
	['Panel Biography - Custom Colour Text Use', false, 'textUse'],
	['Panel Biography - Custom Colour Text Highlight Use', false, 'text_hUse'],
	['Panel Biography - Custom Colour Transparent Fill Use', false, 'bgTransUse'],

	['Panel Biography - Custom Font', 'Segoe UI,16,0', 'custFont'],
	['Panel Biography - Custom Font Heading', 'Segoe UI,18,2', 'custHeadFont'],

	['Panel Biography - Custom Font Use', false, 'custFontUse'],
	['Panel Biography - Custom Font Heading Use', false, 'custHeadFontUse'],

	['Panel Biography - Custom Font Scroll Icon', 'Segoe UI Symbol', 'butCustIconFont'],
	['Panel Biography - Cycle Item', false, 'cycItem'],
	['Panel Biography - Cycle Photo', true, 'cycPhoto'],
	['Panel Biography - Cycle Photo Location', 0, 'cycPhotoLocation'],
	['Panel Biography - Cycle Picture', true, 'cycPic'],
	['Panel Biography - Cycle Time Item', 45, 'cycTimeItem'],
	['Panel Biography - Cycle Time Picture', 15, 'cycTimePic'],

	['Panel Biography - Double-Click Toggle', false, 'dblClickToggle'],
	['Panel Biography - Expand Lists', true, 'expandLists'],
	['Panel Biography - Fallback Text Biography: Heading|No Heading', 'Nothing Found|There is no biography to display', 'bioFallbackText'],
	['Panel Biography - Fallback Text Review: Heading|No Heading', 'Nothing Found|There is no review to display', 'revFallbackText'],

	['Panel Biography - Filmstrip Autofit', false, 'filmStripAutofit'],
	['Panel Biography - Filmstrip Cover Regular-0 Auto-Fill-1 Circular-2', 1, 'filmCoverStyle'],
	['Panel Biography - Filmstrip Margin', 2, 'filmStripMargin'],
	['Panel Biography - Filmstrip Overlay Image', false, 'filmStripOverlay'],
	['Panel Biography - Filmstrip Photo Regular-0 Auto-Fill-1 Circular-2', 1, 'filmPhotoStyle'],
	['Panel Biography - Filmstrip Pos', 3, 'filmStripPos'],
	['Panel Biography - Filmstrip Size 0-1', 0.09, 'filmStripSize'],
	['Panel Biography - Filmstrip Show', false, 'showFilmStrip'],
	['Panel Biography - Filmstrip Show Auto', true, 'autoFilm'],
	['Panel Biography - Filmstrip Use Image Padding', 0, 'filmImagePadding'],
	['Panel Biography - Filmstrip Use Text Padding', 0, 'filmTextPadding'],

	['Panel Biography - Font Size (Default)', 12, 'baseFontSizeBio_default'],
	['Panel Biography - Font Size (Artwork)', 12, 'baseFontSizeBio_artwork'],
	['Panel Biography - Freestyle Custom', JSON.stringify([]), 'styleFree'],

	['Panel Biography - Heading Hide-0 Show-1', 1, 'heading'],
	['Panel Biography - Heading Always Full Width', true, 'fullWidthHeading'],
	['Panel Biography - Heading Button Hide-0 Left-1 Right-2', 2, 'src'],
	['Panel Biography - Heading Center', false, 'hdCenter'],
	['Panel Biography - Heading Button Position Left-0 Right-1 Center-2', 0, 'hdPos'],
	['Panel Biography - Heading Button Show', true, 'hdBtnShow'],
	['Panel Biography - Heading Button Show Label', 1, 'hdShowBtnLabel'],
	['Panel Biography - Heading Flag Artist View', true, 'bioFlagShow'],
	['Panel Biography - Heading Flag Album View', true, 'revFlagShow'],
	['Panel Biography - Heading Line Hide-0 Bottom-1 Center-2', 1, 'hdLine'],
	['Panel Biography - Heading Padding Button', 0, 'hdBtnPad'],
	['Panel Biography - Heading Padding Bottom Line', 8, 'hdLinePad'],
	['Panel Biography - Heading Padding', 0, 'hdPad'],
	['Panel Biography - Heading Position', 0, 'hdRight'],
	['Panel Biography - Heading Show Button Background', false, 'hdShowBtnBg'],
	['Panel Biography - Heading Show Button Red Lfm', false, 'hdShowRedLfm'],
	['Panel Biography - Heading Show Title', true, 'hdShowTitle'],
	['Panel Biography - Heading Style', 1, 'headFontStyle'],
	['Panel Biography - Heading Title Format Album Review', '$if2(%BIO_ALBUMARTIST%,Artist Unknown) - $if2(%BIO_ALBUM%,Album Unknown)', 'revHeading'],
	['Panel Biography - Heading Title Format Biography', '$if2(%BIO_ARTIST%,Artist Unknown)', 'bioHeading'],
	['Panel Biography - Heading Title Format Track Review', '> $if2(%BIO_ARTIST%,Artist Unknown) - $if2(%BIO_TITLE%,Title Unknown)', 'trkHeading'],
	['Panel Biography - Heading Title Format Lyrics', '$if2(%BIO_ARTIST%,Artist Unknown) - $if2(%BIO_TITLE%,Title Unknown)', 'lyricHeading'],

	['Panel Biography - Highlight Heading Button', false, 'highlightHdBtn'],
	['Panel Biography - Highlight Heading Text', true, 'highlightHdText'],
	['Panel Biography - Highlight Heading Line', true, 'highlightHdLine'],
	['Panel Biography - Highlight Image Border', false, 'highlightImgBor'],
	['Panel Biography - Highlight Overlay Border', true, 'highlightOvBor'],
	['Panel Biography - Highlight Rating Stars', true, 'highlightStars'],
	['Panel Biography - Highlight Subheadings', true, 'highlightSubHd'],
	['Panel Biography - Highlight Summary Text', false, 'highlightSummary'],
	['Panel Biography - Highlight Text', false, 'highlightText'],

	['Panel Biography - Image Align Auto', true, 'alignAuto'],
	['Panel Biography - Image Align With Text', false, 'textAlign'],
	['Panel Biography - Image Alignment Horizontal', 1, 'alignH'],
	['Panel Biography - Image Alignment Vertical', 1, 'alignV'],
	['Panel Biography - Image Auto Enlarge', false, 'autoEnlarge'],
	['Panel Biography - Image Blur Background Auto-Fill', false, 'blurAutofill'],
	['Panel Biography - Image Blur Background Level (%)', 90, 'blurTemp'],
	['Panel Biography - Image Blur Background Opacity (%)', 30, 'blurAlpha'],
	['Panel Biography - Image Blur Background Always Use Front Cover', false, 'covBlur'],
	['Panel Biography - Image Counter', false, 'imgCounter'],
	['Panel Biography - Image Filter Lastfm', false, 'imgFilterLfm'],
	['Panel Biography - Image Filter Size Max Size', 12000, 'imgFilterMaxSz'],
	['Panel Biography - Image Filter Size Max Size Enabled', false, 'imgFilterMaxSzEnabled'],
	['Panel Biography - Image Filter Size Min Number', 3, 'imgFilterMinNo'],
	['Panel Biography - Image Filter Size Min Px', 500, 'imgFilterMinPx'],
	['Panel Biography - Image Filter Size Min Px Enabled', false, 'imgFilterMinPxEnabled'],
	['Panel Biography - Image Filter Size Min Size', 50, 'imgFilterMinSz'],
	['Panel Biography - Image Filter Size Min Size Enabled', false, 'imgFilterMinSzEnabled'],
	['Panel Biography - Image Filter Size Width & Height', true, 'imgFilterBothPx'],
	['Panel Biography - Image Only', false, 'img_only'],
	['Panel Biography - Image Reflection Type', 0, 'imgReflType'],
	['Panel Biography - Image Seeker', true, 'imgSeeker'],
	['Panel Biography - Image Seeker Show', 0, 'imgSeekerShow'],
	['Panel Biography - Image Seeker Disabled', false, 'imgSeekerDisabled'],
	['Panel Biography - Image Seeker Dot Style', 1, 'imgSeekerDots'],
	['Panel Biography - Image Smooth Transition', false, 'imgSmoothTrans'],
	['Panel Biography - Image Smooth Transition Level (%)', 92, 'transLevel'],

	['Panel Biography - Language [Menu] EN-0 ZH-CN-1 ZH-TW-2', 0, 'menuLanguage'],
	['Panel Biography - Layout', 0, 'style'],
	['Panel Biography - Layout Bio Mode', 0, 'bioMode'],
	['Panel Biography - Layout Bio', 0, 'bioStyle'],
	['Panel Biography - Layout Image Size 0-1', 0.65, 'rel_imgs'],
	['Panel Biography - Layout Margin Between Image & Text', scaleForDisplay(15), 'gap'],
	['Panel Biography - Layout Margin Image Left', scaleForDisplay(40), 'borL'],
	['Panel Biography - Layout Margin Image Right', scaleForDisplay(40), 'borR'],
	['Panel Biography - Layout Margin Image Top', scaleForDisplay(30), 'borT'],
	['Panel Biography - Layout Margin Image Bottom', scaleForDisplay(30), 'borB'],
	['Panel Biography - Layout Margin Text Left', scaleForDisplay(40), 'textL'],
	['Panel Biography - Layout Margin Text Right', scaleForDisplay(40), 'textR'],
	['Panel Biography - Layout Margin Text Top', scaleForDisplay(30), 'textT'],
	['Panel Biography - Layout Margin Text Bottom', scaleForDisplay(30), 'textB'],
	['Panel Biography - Layout Padding Between Thumbnails', 0, 'thumbNailGap'],
	['Panel Biography - Layout Rev Mode', 0, 'revMode'],
	['Panel Biography - Layout Rev', 0, 'revStyle'],

	['Panel Biography - Line Padding', 0, 'textPad'],
	['Panel Biography - Lock Bio', false, 'lockBio'],
	['Panel Biography - Lock Auto', false, 'autoLock'],

	['Panel Biography - Menu Show Inactivate', 0, 'menuShowInactivate'],
	['Panel Biography - Menu Show Paste', 1, 'menuShowPaste'],
	['Panel Biography - Menu Show Playlists', 0, 'menuShowPlaylists'],
	['Panel Biography - Menu Show Missing Data', 0, 'menuShowMissingData'],
	['Panel Biography - Menu Show Tagger', 1, 'menuShowTagger'],
	['Panel Biography - Multi Server', false, 'multiServer'],

	['Panel Biography - Overlay', JSON.stringify({
		name: 'Overlay',
		imL: 0,
		imR: 0,
		imT: 0,
		imB: 0,
		txL: 0,
		txR: 0,
		txT: 0.632,
		txB: 0
	}), 'styleOverlay'],
	['Panel Biography - Overlay Border Width (px)', 1, 'overlayBorderWidth'],
	['Panel Biography - Overlay Gradient (%)', 10, 'overlayGradient'],
	['Panel Biography - Overlay Strength (%)', 84.5, 'overlayStrength'],
	['Panel Biography - Overlay Type', 0, 'typeOverlay'],

	['Panel Biography - Panel Active', true, 'panelActive'],
	['Panel Biography - Panel Focus Load Immediate', false, 'focusLoadImmediate'],
	['Panel Biography - Panel Focus Load Refresh Rate 200-3000 msec (Max)', 1000, 'focusLoadRate'],
	['Panel Biography - Panel Focus Server Refresh Rate 1500-15000 msec (Max)', 5000, 'focusServerRate'],
	['Panel Biography - Panel Lookup Refresh Rate 1500-15000 msec (Max)', 1500, 'lookUpServerRate'],

	['Panel Biography - Photo Border [Dual Mode]', false, 'artBorderDual'],
	['Panel Biography - Photo Border [Image Only]', false, 'artBorderImgOnly'],
	['Panel Biography - Photo Reflection [Dual Mode]', false, 'artReflDual'],
	['Panel Biography - Photo Reflection [Image Only]', false, 'artReflImgOnly'],
	['Panel Biography - Photo Shadow [Dual Mode]', false, 'artShadowDual'],
	['Panel Biography - Photo Shadow [Image Only]', false, 'artShadowImgOnly'],
	['Panel Biography - Photo Style [Dual Mode] Regular-0 Auto-Fill-1 Circular-2', 1, 'artStyleDual'],
	['Panel Biography - Photo Style [Image Only] Regular-0 Auto-Fill-1 Circular-2', 1, 'artStyleImgOnly'],

	['Panel Biography - Prefer Focus', false, 'focus'],
	['Panel Biography - Rating Position Prefer Heading-0 Text-1', 0, 'star'],
	['Panel Biography - Rating Show AllMusic', true, 'amRating'],
	['Panel Biography - Rating Show Last.fm', true, 'lfmRating'],
	['Panel Biography - Rating Text Name AllMusic', 'Album rating', 'amRatingName'],
	['Panel Biography - Rating Text Name Last.fm', 'Album rating', 'lfmRatingName'],
	['Panel Biography - Rating Text Position Auto-0 Embed-1 Own Line-2', 0, 'ratingTextPos'],

	['Panel Biography - Reflection Gradient (%)', 10, 'reflGradient'],
	['Panel Biography - Reflection Size (%)', 100, 'reflSize'],
	['Panel Biography - Reflection Strength (%)', 14.5, 'reflStrength'],

	['Panel Biography - Scroll Position Bio', JSON.stringify({}), 'bioScrollPos'],
	['Panel Biography - Scroll Position Rev', JSON.stringify({}), 'revScrollPos'],
	['Panel Biography - Scrollbar Scroll Step 0-10 (0 = Page)', 3, 'scrollStep'],
	['Panel Biography - Scrollbar Scroll Smooth Duration 0-5000 msec (Max)', 500, 'durationScroll'],
	['Panel Biography - Scrollbar Scroll Touch Flick Duration 0-5000 msec (Max)', 3000, 'durationTouchFlick'],
	['Panel Biography - Scrollbar Scroll Touch Flick Distance 0-10', 0.8, 'flickDistance'],
	['Panel Biography - Scrollbar Scroll: Smooth Scroll', true, 'smooth'],
	['Panel Biography - Scrollbar Arrow Custom Icon', '\uE0A0', 'arrowSymbol'],
	['Panel Biography - Scrollbar Arrow Custom Icon: Vertical Offset (%)', -24, 'sbarButPad'],
	['Panel Biography - Scrollbar Arrow Width', Math.round(11 * $Bio.scale), 'sbarArrowWidth'],
	['Panel Biography - Scrollbar Button Type', 0, 'sbarButType'],
	['Panel Biography - Scrollbar Colour Grey-0 Blend-1', 1, 'sbarCol'],
	['Panel Biography - Scrollbar Grip MinHeight', Math.round(20 * $Bio.scale), 'sbarGripHeight'],
	['Panel Biography - Scrollbar Height Prefer Full', false, 'sbarFullHeight'],
	['Panel Biography - Scrollbar Padding', 0, 'sbarPad'],
	['Panel Biography - Scrollbar Narrow Bar Width (0 = Auto)', 0, 'narrowSbarWidth'],
	['Panel Biography - Scrollbar Show', 1, 'sbarShow'],
	['Panel Biography - Scrollbar Type Default-0 Styled-1 Windows-2', 1, 'sbarType'],
	['Panel Biography - Scrollbar Width', Math.round(11 * $Bio.scale), 'sbarWidth'],
	['Panel Biography - Scrollbar Width Bar', 11, 'sbarBase_w'],
	['Panel Biography - Scrollbar Windows Metrics', false, 'sbarWinMetrics'],

	['Panel Biography - Server Name', 'biography', 'serverName'],

	['Panel Biography - Show Album History', true, 'showAlbumHistory'],
	['Panel Biography - Show Artist History', true, 'showArtistHistory'],
	['Panel Biography - Show More Tags', true, 'showMoreTags'],
	['Panel Biography - Show Similar Artists', true, 'showSimilarArtists'],
	['Panel Biography - Show Top Albums', true, 'showTopAlbums'],

	['Panel Biography - Source All', false, 'sourceAll'],
	['Panel Biography - Source Bio 0-Am 1-Lfm 2-Wiki 3-Text', 1, 'sourcebio'],
	['Panel Biography - Source Rev 0-Am 1-Lfm 2-Wiki 3-Text', 0, 'sourcerev'],

	['Panel Biography - Statistics Show Last.fm Metacritic Score', true, 'score'],
	['Panel Biography - Statistics Show Last.fm Scrobbles & Listeners', true, 'stats'],

	['Panel Biography - Stub Path Artist [No TF Bar %profile% & %storage_folder%]', '', 'panelArtStub'],
	['Panel Biography - Stub Path Back [No TF Bar %profile% & %storage_folder%]', '', 'panelBackStub'],
	['Panel Biography - Stub Path Disc [No TF Bar %profile% & %storage_folder%]', '', 'panelDiscStub'],
	['Panel Biography - Stub Path Front [No TF Bar %profile% & %storage_folder%]', '', 'panelFrontStub'],
	['Panel Biography - Stub Path Icon [No TF Bar %profile% & %storage_folder%]', '', 'panelIconStub'],

	['Panel Biography - Subheading [Track Review] Title Format', '> $if2(%BIO_ARTIST%,Artist Unknown) - $if2(%BIO_TITLE%,Title Unknown)', 'trackSubHeading'],
	['Panel Biography - Subheading Source Hide-0 Auto-1 Show-2', 1, 'sourceHeading'],
	['Panel Biography - Subheading Source Style', 1, 'sourceStyle'],
	['Panel Biography - Subheading Track Hide-0 Auto-1 Show-2', 1, 'trackHeading'],
	['Panel Biography - Subheading Track Style', 1, 'trackStyle'],
	['Panel Biography - Subheading Wikipedia Style', 1, 'wikiStyle'],

	['Panel Biography - Summary Compact', true, 'summaryCompact'],
	['Panel Biography - Summary Dates', true, 'summaryDate'],
	['Panel Biography - Summary Genres', true, 'summaryGenre'],
	['Panel Biography - Summary Locale', true, 'summaryLocale'],
	['Panel Biography - Summary Other', true, 'summaryOther'],
	['Panel Biography - Summary Popular Now', true, 'summaryPopNow'],
	['Panel Biography - Summary Latest Release', true, 'summaryLatest'],
	['Panel Biography - Summary Show', true, 'summaryShow'],
	['Panel Biography - Summary Style', 0, 'summaryStyle'],
	['Panel Biography - Text Align Always Top', false, 'topAlign'],
	['Panel Biography - Text Auto Optimise Multiple Items', true, 'autoOptimiseText'],
	['Panel Biography - Text Only', false, 'text_only'],

	['Panel Biography - Text Reader Enable', true, 'txtReaderEnable'],
	['Panel Biography - Text Reader Item Properties: Field Width', 0, 'fieldWidth'],
	['Panel Biography - Text Reader Item Properties: Show Line Dividers', true, 'lineDividers'],
	['Panel Biography - Text Reader Item Properties: Show Row Stripes', true, 'rowStripes'],
	['Panel Biography - Text Reader Nowplaying: Vertical Center', false, 'vCenter'],
	['Panel Biography - Text Reader Nowplaying: Horizontal Center', true, 'hCenter'],
	['Panel Biography - Text Reader 1 Use', true, 'useTxtReader0'],
	['Panel Biography - Text Reader 2 Use', true, 'useTxtReader1'],
	['Panel Biography - Text Reader 3 Use', true, 'useTxtReader2'],
	['Panel Biography - Text Reader 4 Use', true, 'useTxtReader3'],
	['Panel Biography - Text Reader 5 Use', true, 'useTxtReader4'],
	['Panel Biography - Text Reader 6 Use', true, 'useTxtReader5'],
	['Panel Biography - Text Reader 7 Use', true, 'useTxtReader6'],
	['Panel Biography - Text Reader 8 Use', true, 'useTxtReader7'],
	['Panel Biography - Text Reader Larger Sync Line', 1, 'largerSyncLyricLine'],
	['Panel Biography - Text Reader Lyrics Fade Height', 0, 'lyricsFadeHeight'],
	['Panel Biography - Text Reader Lyrics Font Style', 1, 'lyricsFontStyle'],
	['Panel Biography - Text Reader Lyrics Scroll Max Method', 0, 'lyricsScrollMaxMethod'],
	['Panel Biography - Text Reader Lyrics Scroll Time Max', 500, 'lyricsScrollTimeMax'],
	['Panel Biography - Text Reader Lyrics Scroll Time Average', 750, 'lyricsScrollTimeAvg'],
	['Panel Biography - Text Reader Scroll Synced Lyrics', true, 'scrollSynced'],
	['Panel Biography - Text Reader Scroll Unsynced Lyrics', true, 'scrollUnsynced'],
	['Panel Biography - Text Reader 1 Name', 'lyrics', 'nmTxtReader0'],
	['Panel Biography - Text Reader 2 Name', 'lyrics', 'nmTxtReader1'],
	['Panel Biography - Text Reader 3 Name', 'lyrics', 'nmTxtReader2'],
	['Panel Biography - Text Reader 4 Name', 'nowplaying', 'nmTxtReader3'],
	['Panel Biography - Text Reader 5 Name', 'lyrics', 'nmTxtReader4'],
	['Panel Biography - Text Reader 6 Name', 'lyrics', 'nmTxtReader5'],
	['Panel Biography - Text Reader 7 Name', 'lyrics', 'nmTxtReader6'],
	['Panel Biography - Text Reader 8 Name', 'item properties', 'nmTxtReader7'],
	['Panel Biography - Text Reader 1 Item (field or full path)', '%profile%\\cache\\lyrics\\%BIO_ARTIST% - %BIO_TITLE%.lrc', 'pthTxtReader0'],
	['Panel Biography - Text Reader 2 Item (field or full path)', '$if3(%lyrics%,%syncedlyrics%,%unsynced lyrics%,%unsyncedlyrics%)', 'pthTxtReader1'],
	['Panel Biography - Text Reader 3 Item (field or full path)', '%profile%\\cache\\lyrics\\%BIO_ARTIST% - %BIO_TITLE%.txt', 'pthTxtReader2'],
	['Panel Biography - Text Reader 4 Item (field or full path)', '%storage_folder%\\nowplaying.txt', 'pthTxtReader3'],
	['Panel Biography - Text Reader 5 Item (field or full path)', '%profile%\\cache\\lyrics\\%BIO_ARTIST% - %BIO_TITLE%.lrc', 'pthTxtReader4'],
	['Panel Biography - Text Reader 6 Item (field or full path)', '$if3(%lyrics%,%syncedlyrics%,%unsynced lyrics%,%unsyncedlyrics%)', 'pthTxtReader5'],
	['Panel Biography - Text Reader 7 Item (field or full path)', '%profile%\\cache\\lyrics\\%BIO_ARTIST% - %BIO_TITLE%.txt', 'pthTxtReader6'],
	['Panel Biography - Text Reader 8 Item (field or full path)', '%storage_folder%\\item_properties.json', 'pthTxtReader7'],
	['Panel Biography - Text Reader 1 Lyrics', true, 'lyricsTxtReader0'],
	['Panel Biography - Text Reader 2 Lyrics', true, 'lyricsTxtReader1'],
	['Panel Biography - Text Reader 3 Lyrics', true, 'lyricsTxtReader2'],
	['Panel Biography - Text Reader 4 Lyrics', false, 'lyricsTxtReader3'],
	['Panel Biography - Text Reader 5 Lyrics', true, 'lyricsTxtReader4'],
	['Panel Biography - Text Reader 6 Lyrics', true, 'lyricsTxtReader5'],
	['Panel Biography - Text Reader 7 Lyrics', true, 'lyricsTxtReader6'],
	['Panel Biography - Text Reader 8 Lyrics', false, 'lyricsTxtReader7'],
	['Panel Biography - Text Reader Lyrics/Nowplaying Drop Shadow Level', 0, 'dropShadowLevel'],
	['Panel Biography - Text Reader Synchronise With Lyrics Download', true, 'syncTxtReaderLyrics'],

	['Panel Biography - Theme', 0, 'theme'],
	['Panel Biography - Theme Background Image', false, 'themeBgImage'],
	['Panel Biography - Theme Colour', 3, 'themeColour'],
	['Panel Biography - Theme Light', false, 'themeLight'],
	['Panel Biography - Themed', false, 'themed'], // reserved: don't enable
	['Panel Biography - Touch Control', false, 'touchControl'],
	['Panel Biography - Track Review', 0, 'inclTrackRev'],
	['Panel Biography - Track Review Show Options', false, 'showTrackRevOptions'],
	['Panel Biography - Touch Step 1-10', 1, 'touchStep'],
	['Panel Biography - Zoom Font Size (%)', 100, 'zoomFont'],
	['Panel Biography - Zoom Heading Font Size (%)', 115, 'zoomHead'],
	['Panel Biography - Zoom Button Heading Size (%)', 100, 'zoomHeadBtn'],
	['Panel Biography - Zoom Button LookUp Size (%)', 100, 'zoomLookUpBtn'],
	['Panel Biography - Zoom Tooltip (%)', 100, 'zoomTooltip']
];

const pptBio = new PanelPropertiesBio();
pptBio.init('auto', propertiesBio);
propertiesBio = undefined;

if (pptBio.get('Panel Biography - Update Properties', true)) { // ~22.7.22
	pptBio.nmTxtReader7 = 'item properties';
	pptBio.pthTxtReader7 = '%storage_folder%\\item_properties.json';
	pptBio.lyricsTxtReader7 = false;
	if (pptBio.summary == '128,228,0') pptBio.summary = '128,228,27';
	const oldProperties = ['Stub Path: Front [No Title Format Except %profile%]', 'Stub Path: Back [No Title Format Except %profile%]', 'Stub Path: Disc [No Title Format Except %profile%]', 'Stub Path: Icon [No Title Format Except %profile%]', 'Stub Path: Artist [No Title Format Except %profile%]'];
	const props = ['panelFrontStub', 'panelBackStub', 'panelDiscStub', 'panelIconStub', 'panelArtStub'];
	oldProperties.forEach((v, i) => { const value = window.GetProperty(v); if (value) pptBio[props[i]] = value; window.SetProperty(v, null); });
	window.SetProperty('Lock Rev', null);
	pptBio.set('Panel Biography - Update Properties', false);
}

if (pptBio.get('Panel Biography - Reset Track Review', true)) {
	pptBio.inclTrackRev = 0;
	pptBio.set('Panel Biography - Reset Track Review', false);
}

if (pptBio.get('Panel Biography - Remove Old Properties', true)) {
	const oldProperties = ['Allmusic Alb', 'Allmusic Bio', 'Both Bio', 'Both Rev', 'Heading', 'Heading BtnName Biography [AllMusic]', 'Heading BtnName Biography [Last.fm]', 'Heading BtnName Biography [Wikipedia]', 'Heading BtnName Review [AllMusic]', 'Heading BtnName Review [Last.fm]', 'Heading BtnName Review [Wikipedia]', 'Heading Title Format Album Review [AllMusic]', 'Heading Title Format Album Review [Last.fm]', 'Heading Title Format Biography [AllMusic]', 'Heading Title Format Biography [Last.fm]', 'Heading Title Format Track Review [AllMusic]', 'Heading Title Format Track Review [Last.fm]', 'Layout Dual Image+Text', 'Image Seeker Dots', 'Subheading [Source] Text Biography [AllMusic]: Heading|No Heading', 'Subheading [Source] Text Biography [Last.fm]: Heading|No Heading', 'Subheading [Source] Text Biography [Wikipedia]: Heading|No Heading', 'Subheading [Source] Text Review [AllMusic]: Heading|No Heading', 'Subheading [Source] Text Review [Last.fm]: Heading|No Heading', 'Subheading Source Hide-0 Show-1', 'Subheading [Source] Text Review [Wikipedia]: Heading|No Heading', 'Subheading [Track Review] Title Format [AllMusic]', 'Subheading [Track Review] Title Format [Last.fm]', 'Summary First', 'Tagger Last.fm Genre Find>Replace', 'Tagger Last.fm Genre Number Clean Up', 'Tagger Last.fm Genre Run Find>Replace', 'Tagger Last.fm Genre Strip Artist+Album Names', 'Text Album + Track Auto Optimise', 'Text Reader Source 0 Name', 'Text Reader Source 1 Name', 'Text Reader Source 2 Name', 'Text Reader Source 3 Name', 'Text Reader Source 4 Name', 'Text Reader Source 5 Name', 'Text Reader Source 6 Name', 'Text Reader Source 7 Name', 'Text Reader Source 1 (field or full path)', 'Text Reader Source 2 (field or full path)', 'Text Reader Source 3 (field or full path)', 'Text Reader Source 4 (field or full path)', 'Text Reader Source 5 (field or full path)', 'Text Reader Source 6 (field or full path)', 'Text Reader Source 7 (field or full path)', 'Text Reader Source 8 (field or full path)', 'Text Reader Source 1 Lyrics', 'Text Reader Source 2 Lyrics', 'Text Reader Source 3 Lyrics', 'Text Reader Source 4 Lyrics', 'Text Reader Source 5 Lyrics', 'Text Reader Source 6 Lyrics', 'Text Reader Source 7 Lyrics', 'Text Reader Source 8 Lyrics'];
	oldProperties.forEach(v => window.SetProperty(v, null));
	pptBio.set('Panel Biography - Remove Old Properties', false);
}
