/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Library Explorer Addon Script                           * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   04-10-2025                                              * //
// * Last change:    03-06-2026                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


/**
 * The `LibExplorer` class for managing the Library Explorer views (album, artist, similar, details).
 * Handles drawing, metrics computation, mouse/keyboard interactions, and data loading.
 * @class
 */
class LibExplorerMain {
	/**
	 * Creates a LibExplorer instance.
	 * Initializes all state objects, caches, fonts, and UI metrics.
	 * @constructor
	 */
	constructor() {
		/**
		 * The artwork management object for image properties, positioning, and rendering.
		 * @typedef {Object} artwork
		 * @property {number} drawX - The x-position to draw the artwork.
		 * @property {number} drawY - The y-position to draw the artwork.
		 * @property {number} w - The drawn width of the artwork image.
		 * @property {number} h - The drawn height of the artwork image.
		 * @property {number} size - The overall size (side length) of the artwork container.
		 * @property {number} srcX - The source x-offset for cropping the original image.
		 * @property {number} srcY - The source y-offset for cropping the original image.
		 * @property {number} srcW - The source width for cropping the original image.
		 * @property {number} srcH - The source height for cropping the original image.
		 * @property {Array} cachedAlbumArtColors - The cache array for album art color extraction to avoid repeated GetColourSchemeJSON calls.
		 * @property {GdiBitmap|null} image - The raw artwork image bitmap.
		 * @property {GdiBitmap|null} resized - The pre-scaled and cropped artwork bitmap for drawing.
		 * @property {Array<GdiBitmap>} artistImages - The array of artist images for cycling.
		 * @property {Array<GdiBitmap>} albumImages - The array of album images for cycling.
		 * @property {Array<GdiBitmap>} currentImages - The array of currently active images.
		 * @property {number} currentIndex - The index of the currently displayed image.
		 * @property {boolean} cycleArtwork - The flag indicating if artworks should be cycled.
		 * @property {number} cycleArtworkTime - The time interval for artwork cycling in milliseconds.
		 * @property {number|null} cycleArtworkTimer - The timer ID for artwork cycling.
		 * @property {number} downloadIconSize - The size of the download icon.
		 * @property {number} downloadIconDrawSize - The draw size of the download icon.
		 * @property {number} downloadIconX - The x-position of the download icon.
		 * @property {number} downloadIconY - The y-position of the download icon.
		 * @property {boolean} needsFetch - The flag indicating if artwork needs to be reloaded.
		 */
		/** @type {artwork} The artwork management object. */
		this.artwork = {
			// Positioning & Dimensions
			drawX: 0,
			drawY: 0,
			w: 0,
			h: 0,
			size: 0,

			// Source cropping
			srcX: 0,
			srcY: 0,
			srcW: 0,
			srcH: 0,

			// Cache
			cachedAlbumArtColors: [],

			// Images
			image: null,
			resized: null,
			artistImages: [],
			albumImages: [],
			currentImages: [],
			currentIndex: 0,
			cycleArtwork: libSet.explorerArtworkCycle || true,
			cycleArtworkTime: libSet.explorerArtworkCycleTime || 15000,
			cycleArtworkTimer: null,

			// Download icon
			downloadIconSize: 0,
			downloadIconDrawSize: 0,
			downloadIconX: 0,
			downloadIconY: 0,

			// State
			needsFetch: true
		};

		/**
		 * The font object for UI fonts and icons.
		 * @typedef {Object} Fonts
		 * @property {GdiFont} close - The Reborn-Symbols font for close button (size 20).
		 * @property {GdiFont} header - The header font based on lib.ui.font.group (size 18).
		 * @property {GdiFont} playing - The Reborn-Symbols font for playback icons (size 16).
		 * @property {GdiFont} rebornSymbols - The Reborn-Symbols font for icons (size 14).
		 * @property {GdiFont} rebornSymbolsLarge - The large Reborn-Symbols font for icons (size 24).
		 * @property {GdiFont} rebornSymbolsXL - The XL Reborn-Symbols font for icons (size 34).
		 * @property {Object} icons - The object mapping icon names to Unicode glyphs.
		 */
		/** @type {Fonts} The fonts and icon glyphs for UI elements. */
		this.font = {
			close: null,
			header: null,
			playing: null,
			rebornSymbols: null,
			rebornSymbolsLarge: null,
			rebornSymbolsXL: null,

			icons: {
				// Tabs
				'Add': RebornSymbols.Add,
				'Artist': RebornSymbols.Artist,
				'Details': RebornSymbols.Details,
				'Edit': RebornSymbols.Edit,
				'Links': RebornSymbols.Links,
				'Missing': RebornSymbols.Missing,
				'Now': RebornSymbols.Now,
				'Similar': RebornSymbols.Similar,
				'Sort': RebornSymbols.Sort,
				'Stats': RebornSymbols.Stats,
				// Other UI elements
				'Prev': RebornSymbols.ChevronLeft,
				'Next': RebornSymbols.ChevronRight,
				'Download': RebornSymbols.Download,
				'Download2': RebornSymbols.Download2,
				'External' : RebornSymbols.External,
			}
		};

		/**
		 * The grid configuration for artist/similar views.
		 * @typedef {Object} Grid
		 * @property {number} thumbSize - The computed thumbnail size.
		 * @property {number} thumbGap - The gap between grid thumbs (SCALE(25)).
		 * @property {number} thumbMargin - The thumbnail margin in grid (SCALE(10)).
		 * @property {number} iconExternalSize - The external link icon size.
		 * @property {number} iconDownloadInset - The inset spacing for the download icon.
		 * @property {number} iconExternalInset - The inset spacing for the external link icon.
		 * @property {number} columns - The number of grid columns.
		 * @property {number} rowH - The height of a grid row.
		 * @property {number} singleRowLineH - The single line height in grid text.
		 * @property {number} textOffsetY - The Y-offset for grid text below thumbnail.
		 * @property {number} textStatsOffsetY - The Y-offset for grid text stats.
		 * @property {Object} loadingText - The loading text {x, y, w, h} for missing releases view.
		 * @property {boolean} externalLinkIcon - The flag to display the link icon on external sources.
		 * @property {string} yearType - The album year display type ('overlay', 'text', 'disable').
		 * @property {number} yearBarY - The relative Y-offset for year overlay background bar.
		 */
		/** @type {Grid} The grid configuration for artist/similar views. */
		this.grid = {
			// Sizing
			thumbSize: 0,
			thumbGap: SCALE(25),
			thumbMargin: SCALE(10),
			iconExternalSize: 0,
			iconDownloadInset: SCALE(8),
			iconExternalInset: SCALE(4),
			columns: 0,
			rowH: 0,
			singleRowLineH: 0,
			textOffsetY: 0,
			textStatsOffsetY: 0,

			loadingText: { x: 0, y: 0, w: 0, h: 0 },
			externalLinkIcon: libSet.explorerExternalLinkIcon || true,

			// Year overlay
			yearType: libSet.explorerAlbumYearType || 'overlay',
			yearBarY: 0
		};

		/**
		 * The application state object.
		 * @typedef {Object} AppState
		 * @property {string} view - The current view ('albumView', 'artistView' etc.).
		 * @property {string} viewSaved - The saved previous view for back navigation.
		 * @property {boolean} visible - The flag if explorer is visible.
		 * @property {boolean} compactMode - The flag for compact layout (no art).
		 * @property {boolean} explorerTreeView - The flag for displaying library explorer in tree view.
		 * @property {string} albumImgScaling - The scaling mode for album images ('cropped' etc.).
		 * @property {string} artistImgScaling - The scaling mode for artist images.
		 * @property {string} albumThumbImgScaling - The scaling mode for album thumbnails ('cropped' etc.).
		 * @property {string} artistThumbImgScaling - The scaling mode for artist thumbnails.
		 * @property {number} albumIndex - The current album index in navigation.
		 * @property {number} artistIndex - The current artist index in navigation.
		 * @property {number} nowPlayingIndex - The index of now-playing item (-1 none).
		 * @property {number} focusedIndex - The currently focused item index (-1 none).
		 * @property {Set<number>} selectedIndices - The set of selected item indices.
		 * @property {number} selectionAnchor - The anchor index for range selection (-1 none).
		 * @property {boolean} loadingMissingReleases - The flag for loading missing releases.
		 * @property {boolean} loadingSimilarArtist - The flag for loading similar artists.
		 * @property {Map} pendingHttpRequests - The map of pending HTTP requests.
		 * @property {Map} pendingImages - The map of pending image downloads.
		 * @property {Map} pendingThumbs - The map of pending thumbnail downloads.
		 * @property {number} pendingThumbsLimit - The maximum number of concurrent thumbnail downloads.
		 */
		/** @type {AppState} The core application state for views and selections. */
		this.state = {
			// View state
			view: 'albumView',
			viewSaved: '',
			visible: false,
			compactMode: false,
			explorerTreeView: libSet.explorerTreeView,

			// Image scaling
			albumImgScaling: libSet.explorerAlbumImgScaling || 'cropped',
			artistImgScaling: libSet.explorerArtistImgScaling || 'cropped',
			albumThumbImgScaling: libSet.explorerAlbumThumbImgScaling || 'cropped',
			artistThumbImgScaling: libSet.explorerArtistThumbImgScaling || 'cropped',

			// Navigation indices
			albumIndex: -1,
			artistIndex: -1,
			nowPlayingIndex: -1,
			focusedIndex: -1,

			// Selection state
			selectedIndices: new Set(),
			selectionAnchor: -1,

			// Loading state
			loadingMissingReleases: false,
			loadingSimilarArtist: false,

			pendingHttpRequests: new Map(),
			pendingImages: new Map(),
			pendingThumbs: new Map(),
			pendingThumbsLimit: 10
		};

		/**
		 * The string format flags for GDI text rendering.
		 * @typedef {Object} StringFormat
		 * @property {number} center - The center alignment flags.
		 * @property {number} centerEllipsis - The near-center alignment with ellipsis trimming.
		 * @property {number} multilineLeftTopEllipsis - The multiline left-top alignment with word ellipsis.
		 * @property {number} rightEllipsis - The right-aligned alignment with char ellipsis.
		 */
		/** @type {StringFormat} The GDI string format flags for text alignment/trimming. */
		this.stringFormat = {
			center: Stringformat.H_Align_Center | Stringformat.V_Align_Center,
			centerEllipsis: Stringformat.H_Align_Near | Stringformat.V_Align_Center | Stringformat.Trim_Ellipsis_Char | Stringformat.No_Wrap,
			multilineLeftTopEllipsis: Stringformat.H_Align_Near | Stringformat.V_Align_Near | Stringformat.Trim_Ellipsis_Word,
			rightEllipsis: Stringformat.H_Align_Far | Stringformat.V_Align_Center | Stringformat.Trim_Ellipsis_Char | Stringformat.No_Wrap
		};

		/**
		 * The UI metrics and layout object (shared across views).
		 * @typedef {Object} UIMetrics
		 * @property {number} margin - The base margin (SCALE(40)).
		 * @property {number} margin80 - The larger margin (SCALE(80)).
		 * @property {number} margin70 - The medium margin (SCALE(70)).
		 * @property {number} margin60 - The medium margin (SCALE(60)).
		 * @property {number} margin30 - The small margin (SCALE(30)).
		 * @property {number} margin20 - The small margin (SCALE(20)).
		 * @property {number} margin10 - The small margin (SCALE(10)).
		 * @property {Object} explorer - The explorer panel bounds {x, y, w, h}.
		 * @property {Object} mainContainer - The main content container {x, y, w, h}.
		 * @property {Object} mainBg - The main background {x, y, w, h}.
		 * @property {Object} column - The column bounds {x, y, w, h}.
		 * @property {number} contentW - The content width.
		 * @property {number} viewportH - The viewport height for scrolling.
		 * @property {number} headerH - The computed header height.
		 * @property {number} durationW - The max width for duration/year text.
		 * @property {number} infoH - The computed info row height.
		 * @property {number} colPad - The column padding.
		 * @property {number} headerY - The Y-position of header.
		 * @property {number} durationX - The X-position for duration column.
		 * @property {number} infoY - The Y-position of info row.
		 * @property {number} viewportY - The Y-position of viewport list.
		 * @property {number} suffixX - The X-position for suffix text.
		 * @property {number} headerLineHeight - The line height for header text.
		 * @property {number} headerSeparatorPad - The padding before header separator line.
		 * @property {number} headerArtistY - The Y-position for artist header text.
		 * @property {number} headerAlbumY - The Y-position for album/summary header text.
		 * @property {number} headerAlbumRatingY - The Y-position for header album rating stars.
		 * @property {number} headerSeparatorY - The Y-position for header separator line.
		 * @property {number} subheaderSeparatorPad - The padding before subheader separator line.
		 * @property {number} subheaderSeparatorY - The Y-position for subheader separator line.
		 * @property {string} artistOrg - The original artist string (pre-truncate).
		 * @property {string} albumOrg - The original album string.
		 * @property {string} artist - The truncated artist display string.
		 * @property {string} album - The truncated album display string.
		 * @property {string} summary - The truncated summary display string.
		 * @property {string} suffix - The suffix display string (e.g., "Similar Artists").
		 * @property {number} artistW - The width of artist string.
		 * @property {number} albumW - The width of album string.
		 * @property {number} summaryW - The width of summary string.
		 * @property {number} headerArtistW - The draw width for header artist text.
		 * @property {number} headerAlbumW - The draw width for header album text.
		 * @property {number} headerSummaryW - The draw width for header summary text.
		 * @property {number} headerSuffixW - The draw width for header suffix text.
		 * @property {number} subheaderMaxInfoW - The max info width for subheader.
		 * @property {number} subheaderMaxX - The maximum X-position for subheader content (column.x + subheaderMaxInfoW).
		 * @property {number} subheaderSepW - The width of subheader separator string.
		 * @property {string} subheaderAlbumLength - The formatted album length string.
		 * @property {Array<Object>} subheaderGroupInfo - The array of subheader parts {type, value}.
		 * @property {Array<number>} subheaderGroupInfoW - The array of part widths for subheader group info.
		 * @property {Array<number>} subheaderGroupInfoCumulW - The array of cumulative widths for subheader group info.
		 * @property {Array<number>} subheaderGroupInfoUnderline - The array of precomputed underline start positions for subheader parts.
		 * @property {number} flagMargin - The margin for flag placement.
		 * @property {number} flagSize - The size of flag image.
		 * @property {number} flagX - The X-position for country flag.
		 * @property {number} flagY - The Y-position for country flag.
		 */
		/** @type {UIMetrics} The layout metrics, positions, and computed sizes. */
		this.ui = {
			// Margins
			margin: SCALE(40),
			margin80: SCALE(80),
			margin70: SCALE(70),
			margin60: SCALE(60),
			margin30: SCALE(30),
			margin20: SCALE(20),
			margin10: SCALE(10),

			// Layout containers
			explorer: { x: 0, y: 0, w: 0, h: 0 },
			mainContainer: { x: 0, y: 0, w: 0, h: 0 },
			mainBg: { x: 0, y: 0, w: 0, h: 0 },
			column: { x: 0, y: 0, w: 0, h: 0 },

			// Content dimensions
			contentW: 0,
			viewportH: 0,
			headerH: 0,
			durationW: 0,
			infoH: 0,
			colPad: 0,

			// Positions
			headerY: 0,
			durationX: 0,
			infoY: 0,
			viewportY: 0,
			suffixX: 0,

			// Header offsets
			headerLineHeight: 0,
			headerSeparatorPad: 0,
			headerArtistY: 0,
			headerAlbumY: 0,
			headerAlbumRatingY: 0,
			headerSeparatorY: 0,

			// Subheader offsets
			subheaderSeparatorPad: 0,
			subheaderSeparatorY: 0,

			// Text content
			artistOrg: '',
			albumOrg: '',
			artist: '',
			album: '',
			summary: '',
			suffix: '',

			// Text measurements
			artistW: 0,
			albumW: 0,
			summaryW: 0,
			headerArtistW: 0,
			headerAlbumW: 0,
			headerSummaryW: 0,
			headerSuffixW: 0,
			subheaderMaxInfoW: 0,
			subheaderMaxX: 0,
			subheaderSepW: 0,
			subheaderAlbumLength: '',
			subheaderGroupInfo: [],
			subheaderGroupInfoW: [],
			subheaderGroupInfoCumulW: [],
			subheaderGroupInfoUnderline: [],

			// UI elements
			flagMargin: 0,
			flagSize: 0,
			flagX: 0,
			flagY: 0
		};

		this.initExplorer();
	}


	// * GETTERS * //
	// #region GETTERS
	/** @returns {boolean} The flag indicating if current view is the classic album tracklist. */
	get isAlbumView() {
		return this.state.view === 'albumView';
	}

	/** @returns {boolean} The flag indicating if showing artist albums in grid layout. */
	get isArtistView() {
		return this.state.view === 'artistView';
	}

	/** @returns {boolean} The flag indicating if showing detailed track/album metadata view. */
	get isDetailsView() {
		return this.state.view === 'detailsView';
	}

	/** @returns {boolean} The flag indicating if showing missing releases grid. */
	get isMissingReleasesView() {
		return this.state.view === 'missingReleasesView';
	}

	/** @returns {boolean} The flag indicating if showing similar artists grid. */
	get isSimilarArtistView() {
		return this.state.view === 'similarArtistView';
	}

	/** @returns {boolean} The flag indicating if showing main views album or artist. */
	get isAlbumOrArtistView() {
		return this.state.view === 'albumView' || this.state.view === 'artistView';
	}

	/** @returns {boolean} The flag indicating if showing a album tracklist (album or details). */
	get isAlbumOrDetailsView() {
		return this.state.view === 'albumView' || this.state.view === 'detailsView';
	}

	/** @returns {boolean} The flag indicating if showing artist view or missing releases view. */
	get isArtistOrMissingView() {
		return this.state.view === 'artistView' || this.state.view === 'missingReleasesView';
	}

	/** @returns {boolean} The flag indicating if showing artist view or similar artist view. */
	get isArtistOrSimilarView() {
		return this.state.view === 'artistView' || this.state.view === 'similarArtistView';
	}

	/** @returns {boolean} The flag indicating if showing missing releases view or similar artist view. */
	get isMissingOrSimilarView() {
		return this.state.view === 'missingReleasesView' || this.state.view === 'similarArtistView';
	}

	/** @returns {boolean} The flag indicating if current view is a grid-based view that displays thumbnails in columns. */
	get isGridView() {
		return ['artistView', 'missingReleasesView', 'similarArtistView'].includes(this.state.view);
	}
	// #endregion


	// * DRAW * //
	// #region DRAW
	/**
	 * Draws the entire explorer interface.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	draw(gr) {
		if (!this.state.explorerTreeView || !this.state.visible) return;

		this.drawBackground(gr);
		this.drawArtwork(gr);
		this.drawColumn(gr);
	}

	/**
	 * Draws the background of the explorer.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawBackground(gr) {
		gr.FillSolidRect(this.ui.mainBg.x, this.ui.mainBg.y, this.ui.mainBg.w, this.ui.mainBg.h, lib.ex.color.column_bg);
	}

	/**
	 * Draws the artwork image.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawArtwork(gr) {
		if (!this.artwork.resized || this.artwork.size <= 0) return;

		gr.DrawImage(this.artwork.resized, this.artwork.drawX, this.artwork.drawY, this.artwork.w, this.artwork.h, 0, 0, this.artwork.w, this.artwork.h);

		if (this.isArtworkStub() && this.isGridView) {
			this.drawDownloadIcon(gr, this.artwork.drawX, this.artwork.drawY, this.artwork.w, this.artwork.h, 'artwork');
		}
	}

	/**
	 * Draws the column containing header, subheader, and content.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawColumn(gr) {
		this.drawColumnHeader(gr);
		this.drawColumnSubheader(gr);

		if (this.isAlbumView) {
			lib.ex.album.drawAlbumView(gr);
		}
		else if (this.isGridView) {
			lib.ex.artist.drawArtistView(gr);
		}
		else if (this.isDetailsView) {
			lib.ex.details.drawDetailsView(gr);
		}

		lib.ex.sbar.drawScrollbar(gr);
		lib.ex.button.drawTabs(gr);
	}

	/**
	 * Draws the column header with artist, album, and year information.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawColumnHeader(gr) {
		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		lib.ex.button.drawCloseButton(gr);

		// Artist
		const artistColor = lib.ex.control.mouse.hoveredArtist ? lib.ex.color.column_text_hovered : lib.ex.color.column_text_normal;
		gr.DrawString(this.ui.artist, this.font.header, artistColor, this.ui.column.x, this.ui.headerArtistY, this.ui.headerArtistW, this.ui.headerLineHeight, this.stringFormat.centerEllipsis);

		// Country flag
		if (this.ui.flagSize > 0) {
			gr.DrawImage(lib.ex.data.flagImgs[0], this.ui.flagX, this.ui.flagY, this.ui.flagSize, this.ui.flagSize, 0, 0, lib.ex.data.flagImgs[0].Width, lib.ex.data.flagImgs[0].Height);
		}

		if (this.isAlbumOrDetailsView) {
			// Album
			const albumColor = lib.ex.control.mouse.hoveredAlbumTitle ? lib.ex.color.column_text_hovered : lib.ex.color.column_text_normal;
			gr.DrawString(this.ui.album, this.font.header, albumColor, this.ui.column.x, this.ui.headerAlbumY, this.ui.headerAlbumW, this.ui.headerLineHeight, this.stringFormat.centerEllipsis);

			// Album rating
			if (lib.ex.data.albumRating > 0) {
				this.drawRatingStars(gr, lib.ex.data.albumRating, this.font.rebornSymbolsLarge, lib.ex.album.albumRatingX, this.ui.headerAlbumRatingY, this.ui.headerLineHeight, SCALE(-2), true);
			}

			// Album year
			const yearColor = lib.ex.control.mouse.hoveredAlbumYear ? lib.ex.color.column_text_hovered : lib.ex.color.column_text_normal;
			if (lib.ex.data.year) {
				gr.DrawString(lib.ex.data.year, this.font.header, yearColor, this.ui.column.x + this.ui.durationX, this.ui.headerAlbumY, this.ui.durationW, this.ui.headerLineHeight, this.stringFormat.rightEllipsis);
			}
		}
		else {
			// Suffix
			if (this.ui.suffix) {
				gr.DrawString(this.ui.suffix, this.font.header, lib.ex.color.column_text_normal, this.ui.suffixX, this.ui.headerArtistY, this.ui.headerSuffixW, this.ui.headerLineHeight, this.stringFormat.centerEllipsis);
			}

			// Album summary
			const summaryColor = lib.ex.control.mouse.hoveredAlbumSummary ? lib.ex.color.column_text_hovered : lib.ex.color.column_text_normal;
			gr.DrawString(this.ui.summary, this.font.header, summaryColor, this.ui.column.x, this.ui.headerAlbumY, this.ui.headerSummaryW, this.ui.headerLineHeight, this.stringFormat.centerEllipsis);

			// Source
			if (this.isMissingReleasesView) {
				const missingSourceColor = lib.ex.control.mouse.hoveredMissingSource ? lib.ex.color.column_text_hovered : lib.ex.color.column_text_normal;
				gr.DrawString(lib.ex.missing.sourceText, this.font.header, missingSourceColor, lib.ex.missing.sourceBoxX, this.ui.headerAlbumY, this.ui.durationW, this.ui.headerLineHeight, this.stringFormat.rightEllipsis);
			}
			else if (this.isSimilarArtistView) {
				const similarToggleColor = lib.ex.control.mouse.hoveredSimilarToggle ? lib.ex.color.column_text_hovered : lib.ex.color.column_text_normal;
				gr.DrawString(lib.ex.similar.toggleText, this.font.header, similarToggleColor, lib.ex.similar.toggleX, this.ui.headerAlbumY, lib.ex.similar.toggleTextW, this.ui.headerLineHeight, this.stringFormat.center);

				const similarSourceColor = lib.ex.control.mouse.hoveredSimilarSource ? lib.ex.color.column_text_hovered : lib.ex.color.column_text_normal;
				gr.DrawString(lib.ex.similar.sourceText, this.font.header, similarSourceColor, lib.ex.similar.sourceBoxX, this.ui.headerAlbumY, this.ui.durationW, this.ui.headerLineHeight, this.stringFormat.rightEllipsis);
			}
		}

		// Hover underline
		if (lib.ex.control.mouse.hoveredArtist) {
			gr.DrawLine(this.ui.column.x, this.ui.headerArtistY + this.ui.headerLineHeight, this.ui.column.x + this.ui.artistW, this.ui.headerArtistY + this.ui.headerLineHeight, 1, lib.ex.color.column_text_hovered);
		}
		else if (lib.ex.control.mouse.hoveredArtistFlag && this.ui.flagSize > 0) {
			gr.DrawLine(this.ui.flagX, this.ui.headerArtistY + this.ui.headerLineHeight, this.ui.flagX + this.ui.flagSize, this.ui.headerArtistY + this.ui.headerLineHeight, 1, lib.ex.color.column_text_hovered);
		}
		else if ((this.isAlbumOrDetailsView) && lib.ex.control.mouse.hoveredAlbumTitle) {
			gr.DrawLine(this.ui.column.x, this.ui.headerAlbumY + this.ui.headerLineHeight, this.ui.column.x + this.ui.albumW, this.ui.headerAlbumY + this.ui.headerLineHeight, 1, lib.ex.color.column_text_hovered);
		}
		else if ((this.isAlbumOrDetailsView) && lib.ex.control.mouse.hoveredAlbumRating && lib.ex.data.albumRating > 0) {
			const starSize = this.ui.headerLineHeight;
			const starPad = SCALE(-2);
			const fullStars = Math.floor(lib.ex.data.albumRating);
			const hasPartial = lib.ex.data.albumRating % 1 > 0;
			const numStarsToUnderline = fullStars + (hasPartial ? 1 : 0);
			const underlineW = numStarsToUnderline * starSize + Math.max(0, numStarsToUnderline - 1) * starPad;
			gr.DrawLine(lib.ex.album.albumRatingX, this.ui.headerAlbumY + this.ui.headerLineHeight, lib.ex.album.albumRatingX + underlineW, this.ui.headerAlbumY + this.ui.headerLineHeight, 1, lib.ex.color.column_text_hovered);
		}
		else if ((this.isArtistOrSimilarView) && lib.ex.control.mouse.hoveredAlbumSummary) {
			gr.DrawLine(this.ui.column.x, this.ui.headerAlbumY + this.ui.headerLineHeight, this.ui.column.x + this.ui.summaryW, this.ui.headerAlbumY + this.ui.headerLineHeight, 1, lib.ex.color.column_text_hovered);
		}
		else if ((this.isAlbumOrDetailsView) && lib.ex.control.mouse.hoveredAlbumYear) {
			gr.DrawLine(this.ui.column.x + this.ui.durationX, this.ui.headerAlbumY + this.ui.headerLineHeight, this.ui.column.x + this.ui.durationX + this.ui.durationW, this.ui.headerAlbumY + this.ui.headerLineHeight, 1, lib.ex.color.column_text_hovered);
		}
		else if (this.isSimilarArtistView && lib.ex.control.mouse.hoveredSimilarToggle) {
			gr.DrawLine(lib.ex.similar.toggleX, this.ui.headerAlbumY + this.ui.headerLineHeight, lib.ex.similar.toggleX + lib.ex.similar.toggleTextW, this.ui.headerAlbumY + this.ui.headerLineHeight, 1, lib.ex.color.column_text_hovered);
		}
		else if (this.isSimilarArtistView && lib.ex.control.mouse.hoveredSimilarSource) {
			gr.DrawLine(lib.ex.similar.sourceX, this.ui.headerAlbumY + this.ui.headerLineHeight, lib.ex.similar.sourceX + lib.ex.similar.sourceTextW, this.ui.headerAlbumY + this.ui.headerLineHeight, 1, lib.ex.color.column_text_hovered);
		}
		else if (this.isMissingReleasesView && lib.ex.control.mouse.hoveredMissingSource) {
			gr.DrawLine(lib.ex.missing.sourceX, this.ui.headerAlbumY + this.ui.headerLineHeight, lib.ex.missing.sourceX + lib.ex.missing.sourceTextW, this.ui.headerAlbumY + this.ui.headerLineHeight, 1, lib.ex.color.column_text_hovered);
		}

		// Separator line
		gr.DrawLine(this.ui.column.x, this.ui.headerSeparatorY, this.ui.column.x + this.ui.column.w, this.ui.headerSeparatorY, 1, lib.ex.color.column_line);
	}

	/**
	 * Draws the column subheader with genre, label, and album length.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawColumnSubheader(gr) {
		if (!this.isAlbumOrDetailsView) return;

		// Genre and label info
		let cumulX = this.ui.column.x;
		const pad = SCALE(5);

		for (let i = 0; i < this.ui.subheaderGroupInfo.length; i++) {
			const remaining = this.ui.subheaderMaxX - cumulX;
			if (remaining <= 0) break;

			const part = this.ui.subheaderGroupInfo[i];
			const partW = this.ui.subheaderGroupInfoW[i];
			const isHovered = lib.ex.control.mouse.hoveredSubheaderGroupInfo === i;
			const infoColor = isHovered ? lib.ex.color.column_text_hovered : lib.ex.color.column_text_normal;
			const textBoxW = Math.min(partW + pad, remaining);

			gr.DrawString(part.value, lib.ui.font.main, infoColor, cumulX, this.ui.infoY, textBoxW, this.ui.infoH,
				Stringformat.H_Align_Near | Stringformat.V_Align_Center | Stringformat.No_Wrap | (textBoxW < partW ? Stringformat.Trim_Ellipsis_Char : 0)
			);

			cumulX += Math.min(partW, textBoxW);
			if (textBoxW < partW) break;

			if (i < this.ui.subheaderGroupInfo.length - 1) {
				const sepRemaining = this.ui.subheaderMaxX - cumulX;
				if (sepRemaining < this.ui.subheaderSepW) break;
				const sepBoxW = Math.min(this.ui.subheaderSepW + pad, sepRemaining);
				const nextPart = this.ui.subheaderGroupInfo[i + 1];
				const sepStr = part.type !== nextPart.type ? ' | ' : ` ${Unicode.MiddleDot} `;
				gr.DrawString(sepStr, lib.ui.font.main, lib.ex.color.column_text_normal, cumulX, this.ui.infoY, sepBoxW, this.ui.infoH, Stringformat.H_Align_Near | Stringformat.V_Align_Center | Stringformat.No_Wrap);
				cumulX += this.ui.subheaderSepW;
			}
		}

		// Album length
		gr.DrawString(this.ui.subheaderAlbumLength, lib.ui.font.main, lib.ex.color.column_text_normal, this.ui.column.x + this.ui.durationX, this.ui.infoY, this.ui.durationW, this.ui.infoH, this.stringFormat.rightEllipsis);

		// Hover underline
		if (lib.ex.control.mouse.hoveredSubheaderGroupInfo !== -1) {
			const partW = this.ui.subheaderGroupInfoW[lib.ex.control.mouse.hoveredSubheaderGroupInfo];
			const underlineX = this.ui.subheaderGroupInfoUnderline[lib.ex.control.mouse.hoveredSubheaderGroupInfo];
			const underlineW = Math.min(partW, this.ui.subheaderMaxX - underlineX);
			gr.DrawLine(underlineX, this.ui.infoY + this.ui.infoH, underlineX + underlineW, this.ui.infoY + this.ui.infoH, 1, lib.ex.color.column_text_hovered);
		}

		// Separator line
		gr.DrawLine(this.ui.column.x, this.ui.subheaderSeparatorY, this.ui.column.x + this.ui.column.w, this.ui.subheaderSeparatorY, 1, lib.ex.color.column_line);
	}

	/**
	 * Draws a grid thumbnail with optional year overlay and download icon.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {Object} item - The album or artist item to draw.
	 * @param {number} relX - The relative X position.
	 * @param {number} relY - The relative Y position.
	 * @param {string} mode - The scaling mode ('cropped', 'proportional', 'stretched').
	 */
	drawGridThumbnail(gr, item, relX, relY, mode) {
		if (item.thumb === null) {
			this.fetchThumbnail(item);
		}

		// Show placeholder while loading or if stub
		if (item.thumb === null || item.thumb === 'loading' || item.thumbStub) {
			const placeholderType = this.isSimilarArtistView ? 'artist' : 'album';
			const placeholder = lib.ex.cache.getCachedPlaceholder(placeholderType, this.grid.thumbSize, mode);
			if (placeholder) gr.DrawImage(placeholder, relX, relY, this.grid.thumbSize, this.grid.thumbSize, 0, 0, placeholder.Width, placeholder.Height);
		}
		else {
			// Resize on-demand if needed
			if (!item.thumbResized || item.thumbSize !== this.grid.thumbSize) {
				item.thumbResized = this.getResizedImage(item.thumb, this.grid.thumbSize, mode);
				item.thumbSize = this.grid.thumbSize;
			}

			// Draw the cached resized image
			const croppedStretched = mode === 'cropped' || mode === 'stretched';
			const thumbW = croppedStretched ? this.grid.thumbSize : item.thumbResized.Width;
			const thumbH = croppedStretched ? this.grid.thumbSize : item.thumbResized.Height;
			const thumbX = croppedStretched ? relX : relX + Math.floor((this.grid.thumbSize - thumbW) / 2);
			const thumbY = croppedStretched ? relY : relY + Math.floor((this.grid.thumbSize - thumbH) / 2);

			gr.DrawImage(item.thumbResized, thumbX, thumbY, thumbW, thumbH, 0, 0, item.thumbResized.Width, item.thumbResized.Height);

			// Year overlay
			if (this.isArtistOrMissingView && this.grid.yearType === 'overlay' && item.year) {
				const yearTextW = lib.ex.utils.measureTextWidth(item.year, lib.ui.font.main);
				const yearBarW = Math.min(yearTextW + SCALE(6), this.grid.thumbSize);
				gr.FillSolidRect(thumbX, relY + this.grid.yearBarY, yearBarW, this.grid.singleRowLineH, RGBA(0, 0, 0, 125));
				gr.DrawString(item.year, lib.ui.font.main, RGB(255, 255, 255), thumbX + SCALE(1), relY + this.grid.yearBarY, this.grid.thumbSize, this.grid.singleRowLineH, this.stringFormat.leftEllipsis);
			}
		}

		// Draw download icon
		if (item.thumb !== 'loading' && item.thumbStub) {
			this.drawDownloadIcon(gr, relX, relY, this.grid.thumbSize, this.grid.thumbSize, 'thumb');
		}
	}

	/**
	 * Draws a download icon on artwork or grid thumbnails.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {number} x - The X position.
	 * @param {number} y - The Y position.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 * @param {string} type - The icon type ('artwork' or 'thumb').
	 */
	drawDownloadIcon(gr, x, y, w, h, type) {
		const typeArtwork = type === 'artwork';
		const font = typeArtwork ? this.font.rebornSymbolsXL : this.font.rebornSymbols;

		let iconX;
		let iconY;
		let iconSize;
		let drawSize;
		let isActiveHover = false;

		if (typeArtwork) {
			drawSize = this.artwork.downloadIconDrawSize;
			iconSize = this.artwork.downloadIconSize;
			iconX = this.artwork.downloadIconX;
			iconY = this.artwork.downloadIconY;
			isActiveHover = lib.ex.control.mouse.hoveredDownloadIconArtwork;
		} else {
			const bounds = lib.ex.utils.getGridDownloadIconBounds(x, y);
			drawSize = bounds.drawSize;
			iconSize = bounds.size;
			iconX = bounds.x;
			iconY = bounds.y;
			isActiveHover = lib.ex.control.mouse.hoveredDownloadIconGrid === lib.ex.utils.getGridAlbumIndex(x, y);
		}

		// Shrink background by 2 scaled pixel on all sides to stay fully under rounded glyph edges
		const padding = SCALE(2);
		const bgX = iconX + padding;
		const bgY = iconY + padding;
		const bgSize = iconSize - padding * 2;

		const bgColor = isActiveHover ? RGB(255, 255, 255) : RGBA(0, 0, 0, 125);
		const textColor = isActiveHover ? RGB(0, 0, 0) : RGB(255, 255, 255);

		gr.FillSolidRect(bgX, bgY, bgSize, bgSize, bgColor);
		gr.DrawString(this.font.icons.Download2, font, textColor, iconX, iconY, drawSize, drawSize, this.stringFormat.leftEllipsis);
	}

	/**
	 * Draws rating stars for an album or track.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {number} rating - The rating value (0-5).
	 * @param {GdiFont} font - The font to use for stars.
	 * @param {number} x - The X position.
	 * @param {number} y - The Y position.
	 * @param {number} starSize - The size of each star.
	 * @param {number} textPadding - The padding between stars.
	 * @param {boolean} [isAlbum] - The flag indicating if this is an album rating.
	 */
	drawRatingStars(gr, rating, font, x, y, starSize, textPadding, isAlbum = false) {
		const starPadding = starSize + textPadding;
		const starFull = Math.floor(rating);
		const starFrac = rating % 1;

		const getStarType = (index) => {
			if (index < starFull) return RebornSymbols.StarFull;
			if (index < rating) {
				if (starFrac >= 0.75) return RebornSymbols.StarThreeQuarter;
				if (starFrac >= 0.50) return RebornSymbols.StarHalf;
				if (starFrac >= 0.25) return RebornSymbols.StarQuarter;
			}
			return RebornSymbols.StarEmpty;
		};

		for (let i = 0; i < 5; i++) {
			let star = getStarType(i);
			const calcX = x + i * starPadding;

			if (star === RebornSymbols.StarEmpty && !isAlbum && !lib.ex.album.showTrackRatingGrid) {
				continue;
			}

			if (star === RebornSymbols.StarEmpty && !isAlbum && lib.ex.album.showTrackRatingGrid) {
				star = RebornSymbols.BulletOperator; // Dot for track empty grid
			}

			if (star !== RebornSymbols.StarEmpty) {
				// Draw the star shadow
				gr.DrawString(star, font, lib.ex.color.rating_star_shadow, calcX + SCALE(1), y + SCALE(1), starSize, starSize, this.stringFormat.center);
				// Draw the star
				gr.DrawString(star, font, lib.ex.color.rating_star, calcX, y, starSize, starSize, this.stringFormat.center);
			}
		}
	}
	// #endregion


	// * METRICS * //
	// #region  METRICS
	/**
	 * Sets artwork image metrics based on scaling mode.
	 * @param {string} mode - The scaling mode ('cropped', 'proportional', 'stretched', 'reset').
	 */
	setArtworkImageMetrics(mode) {
		const imageMode = {
			cropped: () => {
				const maxDrawW = this.artwork.size - this.ui.margin;
				const scaleFactor = this.ui.mainContainer.h / this.artwork.image.Height;
				let drawW = Math.max(1, Math.ceil(this.artwork.image.Width * scaleFactor));
				let srcX = 0;
				let srcW = this.artwork.image.Width;
				if (drawW > maxDrawW) {
					srcW = maxDrawW / scaleFactor;
					srcX = (this.artwork.image.Width - srcW) / 2;
					drawW = maxDrawW;
				}
				this.artwork.w = Math.max(1, Math.ceil(drawW));
				this.artwork.h = Math.max(1, Math.ceil(this.ui.mainContainer.h));
				this.artwork.srcX = srcX;
				this.artwork.srcY = 0;
				this.artwork.srcW = srcW;
				this.artwork.srcH = this.artwork.image.Height;
				this.artwork.drawX = this.ui.mainContainer.x;
				this.artwork.drawY = this.ui.mainContainer.y;
			},
			proportional: () => {
				const scaleFactor = Math.min(
					(this.artwork.size - this.ui.margin30 * 2.5) / this.artwork.image.Width,
					(this.ui.mainContainer.h - this.ui.margin30 * 2.5) / this.artwork.image.Height
				);
				this.artwork.w = Math.max(1, Math.ceil(this.artwork.image.Width * scaleFactor));
				this.artwork.h = Math.max(1, Math.ceil(this.artwork.image.Height * scaleFactor));
				this.artwork.srcX = 0;
				this.artwork.srcY = 0;
				this.artwork.srcW = this.artwork.image.Width;
				this.artwork.srcH = this.artwork.image.Height;
				this.artwork.drawX = this.ui.mainContainer.x + this.ui.margin30;
				this.artwork.drawY = this.ui.mainContainer.y + this.ui.margin30;
			},
			stretched: () => {
				const maxDrawW = this.artwork.size - this.ui.margin;
				this.artwork.w = Math.max(1, Math.ceil(maxDrawW));
				this.artwork.h = Math.max(1, Math.ceil(this.ui.mainContainer.h));
				this.artwork.srcX = 0;
				this.artwork.srcY = 0;
				this.artwork.srcW = this.artwork.image.Width;
				this.artwork.srcH = this.artwork.image.Height;
				this.artwork.drawX = this.ui.mainContainer.x;
				this.artwork.drawY = this.ui.mainContainer.y;
			},
			reset: () => {
				this.artwork.w = this.artwork.h = 0;
				this.artwork.drawX = 0;
				this.artwork.drawY = 0;
				this.artwork.srcX = 0;
				this.artwork.srcY = 0;
				this.artwork.srcW = 0;
				this.artwork.srcH = 0;
			}
		};

		if (imageMode[mode]) imageMode[mode]();
	}

	/**
	 * Sets overall artwork container metrics.
	 */
	setArtworkMetrics() {
		const minArtSize = SCALE(200);
		const minRightSize = SCALE(300);
		const requiredW = minArtSize + this.ui.margin30 + minRightSize + this.ui.margin70;

		const scalingModeCurrent = {
			artistView: this.state.artistImgScaling,
			albumView: this.state.albumImgScaling,
			detailsView: this.state.albumImgScaling,
			missingReleasesView: this.state.artistImgScaling,
			similarArtistView: this.state.artistImgScaling
		}[this.state.view];

		this.state.compactMode = this.ui.mainContainer.w < requiredW || grSet.libraryLayout === 'normal';
		this.artwork.size = this.state.compactMode ? 0 : Math.floor(Math.min(this.ui.explorer.w / 2 - this.ui.margin, this.ui.explorer.h - this.ui.margin));
		const scalingMode = this.artwork.size === 0 || !this.artwork.image ? 'reset' : scalingModeCurrent;

		this.setArtworkImageMetrics(scalingMode);
	}

	/**
	 * Sets download icon metrics for artwork.
	 */
	setArtworkDownloadIconMetrics() {
		this.artwork.downloadIconDrawSize = lib.ex.utils.measureTextHeight(RebornSymbols.Download2, this.font.rebornSymbolsXL);
		this.artwork.downloadIconSize = this.artwork.downloadIconDrawSize - SCALE(8);
		this.artwork.downloadIconX = this.artwork.drawX + this.artwork.w * 0.5 - this.artwork.downloadIconSize * 0.5;
		this.artwork.downloadIconY = this.artwork.drawY + this.artwork.h * 0.5 - this.artwork.downloadIconSize * 0.5;
	}

	/**
	 * Sets grid thumbnail metrics for artist/similar views.
	 */
	setAlbumGridMetrics() {
		if (!this.isGridView) return;

		// Fixed grid properties
		this.grid.thumbGap = SCALE(25);
		this.grid.thumbMargin = SCALE(10);
		this.grid.iconExternalSize = lib.ex.utils.measureTextHeight(RebornSymbols.External, lib.ex.main.font.rebornSymbols);
		this.grid.iconDownloadInset = SCALE(8);
		this.grid.iconExternalInset = SCALE(4);
		this.grid.singleRowLineH = lib.ex.utils.measureTextHeight("Ag", lib.ui.font.main);
		this.grid.textOffsetY = SCALE(4);
		this.grid.textStatsOffsetY = SCALE(2);

		// Loading text metrics
		this.grid.loadingText.x = this.grid.thumbMargin;
		this.grid.loadingText.y = 0;
		this.grid.loadingText.w = this.ui.contentW;
		this.grid.loadingText.h = this.ui.viewportH;

		const albumRowTextH = this.grid.singleRowLineH * 2;
		const availableW = this.ui.column.w - 2 * this.grid.thumbMargin;
		const availableH = this.ui.viewportH - 2 * this.grid.thumbMargin;
		const minRows = 2;
		const maxRows = 3;
		const minThumb = SCALE(64); // Minimum thumbnail size is Playlist thumbnail size
		let bestThumbSize = minThumb;

		// Find optimal thumb size, preferring configurations that allow more visible rows if thumb meets minimum
		for (let rows = maxRows; rows >= minRows; rows--) {
			const maxThumbByHeight = Math.floor((availableH - rows * albumRowTextH - (rows - 1) * this.grid.thumbGap) / rows);

			if (maxThumbByHeight >= minThumb) {
				const colWidth = maxThumbByHeight + this.grid.thumbGap;
				const gridColumns = Math.max(1, Math.min(10, Math.floor((availableW + this.grid.thumbGap) / colWidth)));
				const betweenTotal = (gridColumns - 1) * this.grid.thumbGap;
				const widthThumb = (availableW - betweenTotal) / gridColumns;
				bestThumbSize = Math.floor(Math.max(minThumb, Math.min(widthThumb, maxThumbByHeight)));
				break; // Use the highest viable row count
			}
		}

		// Apply configuration (recalculate columns if thumb was width-constrained to a smaller size)
		const oldThumbSize = this.grid.thumbSize;
		this.grid.thumbSize = bestThumbSize;
		this.grid.columns = Math.max(1, Math.min(10, Math.floor((availableW + this.grid.thumbGap) / (bestThumbSize + this.grid.thumbGap))));
		this.grid.rowH = bestThumbSize + albumRowTextH + this.grid.thumbGap;
		this.grid.yearBarY = bestThumbSize - this.grid.singleRowLineH - this.grid.thumbMargin / 1.333;

		if (oldThumbSize !== bestThumbSize) this.setThumbnailStubsScaled();

		// Artist grid temp bitmap metrics
		lib.ex.artist.tempImgW = this.ui.contentW + 2 * this.grid.thumbMargin;
		lib.ex.artist.tempImgH = this.ui.viewportH + this.grid.thumbMargin;
		lib.ex.artist.tempImgOffsetX = this.ui.column.x;
		lib.ex.artist.tempImgOffsetY = this.ui.viewportY - this.grid.thumbMargin;

		// Update items
		const statsSelected = lib.ex.data.getStatsSelected();
		const useYearPrefix = !this.isSimilarArtistView && (
			this.isMissingReleasesView ? this.grid.yearType !== 'overlay' :
			this.grid.yearType !== 'overlay' && this.grid.yearType !== 'disable'
		);

		const items = lib.ex.utils.getGridItems();

		for (const item of items) {
			if (lib.ex.similar.isSimilarExternal && statsSelected === 'Similarity') {
				item.statistic = item.similarity;
			}

			// Build main text
			const yearPrefix = useYearPrefix && item.year ? `${item.year} - ` : '';
			const baseText = this.isMissingReleasesView ? item.title : this.isSimilarArtistView ? item.name : item.album;
			const mainText = yearPrefix + baseText;
			item.mainText = mainText;
			item.fullAlbumText = mainText;

			const mainFullW = lib.ex.utils.measureTextWidth(mainText, lib.ui.font.main);
			item.tooltipMain = mainFullW > this.grid.thumbSize;
			item.mainDisplay = item.tooltipMain ? lib.ex.utils.truncateText('width', mainText, lib.ui.font.main, this.grid.thumbSize) : mainText;

			// Handle stat text (skip if rating or no stat)
			item.statText = '';
			item.statDisplay = '';
			item.tooltipStat = false;
			const hasStat = item.statistic !== undefined && item.statistic !== '' && statsSelected !== 'rating';

			if (hasStat) {
				const isSimilarityStat = lib.ex.similar.isSimilarExternal && statsSelected === 'Similarity';
				item.statText = isSimilarityStat ? `${item.statistic}%` : `${item.statistic}`;
				item.statDisplay = item.statText;
				const statFullW = lib.ex.utils.measureTextWidth(item.statText, lib.ui.font.main);
				item.tooltipStat = statFullW > lib.ex.main.grid.thumbSize;
			}

			item.tooltipAlbumRow = item.tooltipMain || item.tooltipStat;
			item.thumbResized = null;
			item.thumbSize = 0;
		}
	}

	/**
	 * Sets column layout metrics.
	 */
	setColumnMetrics() {
		// Column container metrics
		this.ui.column.x = this.state.compactMode ? this.ui.mainContainer.x + this.ui.margin10 : this.artwork.size + this.ui.margin30;
		this.ui.column.y = this.ui.mainContainer.y + (this.state.compactMode ? -this.ui.margin20 : 0);
		this.ui.column.w = this.state.compactMode ? this.ui.mainContainer.w - this.ui.margin20 : this.ui.explorer.w - this.ui.column.x - this.ui.margin70;
		this.ui.column.h = this.ui.mainContainer.h + (this.state.compactMode ? this.ui.margin : 0);
		this.ui.contentW = this.ui.column.w;

		// Background metrics
		this.ui.mainBg.x = this.ui.mainContainer.x - (this.state.compactMode ? this.ui.margin20 : 0);
		this.ui.mainBg.y = this.ui.mainContainer.y - (this.state.compactMode ? this.ui.margin20 : 0);
		this.ui.mainBg.w = this.ui.mainContainer.w + (this.state.compactMode ? this.ui.margin : 0);
		this.ui.mainBg.h = this.ui.mainContainer.h + (this.state.compactMode ? this.ui.margin : 0);

		// Header metrics
		this.ui.headerLineHeight = lib.ex.utils.measureTextHeight('Ag', this.font.header);
		this.ui.headerSeparatorPad = Math.ceil(this.ui.headerLineHeight / 4);
		this.ui.headerH = this.ui.headerLineHeight * 3 + this.ui.headerSeparatorPad;
		this.ui.headerY = this.ui.mainContainer.y + this.ui.margin20 + (this.state.compactMode ? -this.ui.margin20 : 0);
		this.ui.headerArtistY = this.ui.headerY;
		this.ui.headerAlbumY = this.ui.headerY + this.ui.headerLineHeight;
		this.ui.headerAlbumRatingY = this.ui.headerAlbumY + HD_4K(1, 4);
		this.ui.headerSeparatorY = this.ui.headerAlbumY + this.ui.headerLineHeight + this.ui.headerSeparatorPad;

		// Subheader metrics
		let maxRightWidth;
		if (this.isMissingOrSimilarView) {
			const sourceTexts = this.isSimilarArtistView ? ['Last.fm', 'ListenBrainz', 'Custom'] : ['Last.fm', 'Discogs', 'MusicBrainz'];
			maxRightWidth = Math.max(...sourceTexts.map(s => lib.ex.utils.measureTextWidth(s, this.font.header)));
		} else {
			const maxTrackDur = Math.max(...lib.ex.data.tracksList.map(t => lib.ex.utils.measureTextWidth(t.duration, lib.ui.font.main)), 0);
			const albumLenWidth = lib.ex.utils.measureTextWidth(utils.FormatDuration(lib.ex.data.albumLength), lib.ui.font.main) + SCALE(4);
			const yearWidth = lib.ex.utils.measureTextWidth(lib.ex.data.year || '', this.font.header) + SCALE(6);
			maxRightWidth = Math.max(maxTrackDur, albumLenWidth, yearWidth);
		}

		const usesRightColumn = ['albumView', 'similarArtistView', 'missingReleasesView'].includes(this.state.view);
		this.ui.durationW = maxRightWidth;
		this.ui.durationX = this.ui.contentW - this.ui.durationW;
		this.ui.subheaderMaxInfoW = (usesRightColumn ? this.ui.durationX : this.ui.contentW) - this.ui.headerLineHeight * 0.5;

		if (this.isMissingOrSimilarView) {
			this.ui.headerSummaryW = this.ui.durationX - this.ui.headerLineHeight * 0.5;
		}

		this.ui.infoY = this.ui.headerSeparatorY + this.ui.headerSeparatorPad;
		this.ui.infoH = lib.ex.utils.measureTextHeight('Ag', lib.ui.font.main);
		this.ui.subheaderSeparatorPad = this.ui.headerSeparatorPad;
		this.ui.subheaderSeparatorY = this.ui.infoY + this.ui.infoH + this.ui.subheaderSeparatorPad;
		this.ui.subheaderAlbumLength = this.isAlbumOrDetailsView ? `${utils.FormatDuration(lib.ex.data.albumLength)}` : '';

		// Subheader group info metrics (for album/details views only)
		if (this.isAlbumOrDetailsView) {
			this.ui.subheaderGroupInfo = [
				...lib.ex.data.genres.map(genre => ({ type: 'genre', value: genre })),
				...lib.ex.data.labels.map(label => ({ type: 'label', value: label }))
			];

			const dotSepW = lib.ex.utils.measureTextWidth(` ${Unicode.MiddleDot} `, lib.ui.font.main);
			const pipeSepW = lib.ex.utils.measureTextWidth(' | ', lib.ui.font.main);
			this.ui.subheaderGroupInfoW = [];
			this.ui.subheaderGroupInfoCumulW = [];
			this.ui.subheaderGroupInfoUnderline = [];
			this.ui.subheaderSepW = Math.max(dotSepW, pipeSepW);
			this.ui.subheaderMaxX = this.ui.column.x + this.ui.subheaderMaxInfoW;
			let cum = 0;

			for (let i = 0; i < this.ui.subheaderGroupInfo.length; i++) {
				const partW = lib.ex.utils.measureTextWidth(this.ui.subheaderGroupInfo[i].value, lib.ui.font.main);
				this.ui.subheaderGroupInfoW.push(partW);
				this.ui.subheaderGroupInfoCumulW.push(cum);
				this.ui.subheaderGroupInfoUnderline.push(this.ui.column.x + cum);
				cum += partW;
				if (i < this.ui.subheaderGroupInfo.length - 1) cum += this.ui.subheaderSepW;
			}
		}

		// Viewport metrics
		this.ui.viewportY = this.ui.subheaderSeparatorY + this.ui.subheaderSeparatorPad * 2;
		this.ui.viewportH = lib.ex.button.getTabsY() - this.ui.viewportY - this.ui.subheaderSeparatorPad * 2;
	}

	/**
	 * Sets main container metrics.
	 */
	setMainMetrics() {
		this.ui.margin   = SCALE(40);
		this.ui.margin80 = SCALE(80);
		this.ui.margin70 = SCALE(70);
		this.ui.margin60 = SCALE(60);
		this.ui.margin30 = SCALE(30);
		this.ui.margin20 = SCALE(20);
		this.ui.margin10 = SCALE(10);

		// Full bounds
		this.ui.explorer.x = lib.ui.x;
		this.ui.explorer.y = lib.ui.y + this.ui.margin;
		this.ui.explorer.w = lib.ui.w;
		this.ui.explorer.h = lib.ui.h - this.ui.margin;

		// Main container: Padded interior
		this.ui.mainContainer.x = this.ui.explorer.x + this.ui.margin;
		this.ui.mainContainer.y = this.ui.explorer.y + this.ui.margin;
		this.ui.mainContainer.w = this.ui.explorer.w - this.ui.margin80;
		this.ui.mainContainer.h = this.ui.explorer.h - this.ui.margin80;
	}

	/**
	 * Sets all metrics for the explorer interface.
	 */
	setMetrics() {
		// Main metrics
		this.setMainMetrics();
		this.setArtworkMetrics();
		this.setArtworkScaled();
		this.setArtworkDownloadIconMetrics();
		this.setColumnMetrics();
		this.setAlbumGridMetrics();

		// View-specific metrics
		lib.ex.album.setAlbumViewMetrics();
		lib.ex.artist.setArtistViewMetrics();
		lib.ex.details.setDetailsViewMetrics();

		// UI metrics
		lib.ex.button.setCloseButtonMetrics();
		lib.ex.button.setTabMetrics();
		lib.ex.sbar.setScrollbarMetrics();
		lib.ex.tooltip.setTooltipMetrics();
	}
	// #endregion


	// * GRAPHICS * //
	// #region GRAPHICS
	/**
	 * Applies text rendering hint based on blend settings: `AntiAliasGridFit` when `styleBlend`, `styleBlend2`, `styleAlternative2` is active, otherwise ClearTypeGridFit.
	 * When `ClearTypeGridFit` is used without blending, fills a background rectangle to prevent text artifacts on transparent/undefined backgrounds.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {number} x - The X position.
	 * @param {number} y - The Y position.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 * @param {number} bgColor- The background color to use for the fill when ClearType is active.
	 */
	applyTextRendering(gr, x, y, w, h, bgColor) {
		// * Need to apply text rendering AntiAliasGridFit when using style Blend
		const useAntiAlias = !!grSet.styleBlend || !!grSet.styleBlend2 || grSet.styleAlternative2;

		gr.SetTextRenderingHint(useAntiAlias ? TextRenderingHint.AntiAliasGridFit : TextRenderingHint.ClearTypeGridFit);

		// * Needed for ClearTypeGridFit to avoid text artifacts
		if (!useAntiAlias) gr.FillSolidRect(x, y, w, h, bgColor);
	}

	/**
	 * Starts cycling through multiple artwork images.
	 */
	artworkCycleStart() {
		if (this.artwork.cycleArtworkTimer) {
			clearInterval(this.artwork.cycleArtworkTimer);
		}
		if (!this.artwork.cycleArtwork || this.artwork.currentImages.length <= 1) {
			return;
		}
		this.artwork.cycleArtworkTimer = setInterval(() => this.artworkCycleImage(1), this.artwork.cycleArtworkTime);
	}

	/**
	 * Stops the artwork cycling timer.
	 */
	artworkCycleStop() {
		if (!this.artwork.cycleArtworkTimer) return;
		clearInterval(this.artwork.cycleArtworkTimer);
		this.artwork.cycleArtworkTimer = null;
	}

	/**
	 * Cycles to the next or previous artwork image.
	 * @param {number} direction - The direction to cycle (1 for next, -1 for previous).
	 */
	artworkCycleImage(direction) {
		const len = this.artwork.currentImages.length;

		if (!grm.ui.displayLibrary || !lib.ex.main.state.visible || len <= 1) {
			return;
		}

		this.artwork.currentIndex = (this.artwork.currentIndex + direction + len) % len;
		const nextImg = this.artwork.currentImages[this.artwork.currentIndex];

		this.updateArtworkImage(nextImg);
	}

	/**
	 * Updates the artwork cycling interval time.
	 * @param {number} time - The new cycle interval time.
	 */
	artworkCycleUpdateTime(time) {
		if (time <= 0) {
			this.artworkCycleStop();
			return;
		}

		this.artwork.cycleArtworkTime = time;

		if (this.artwork.currentImages.length > 1) {
			this.artworkCycleStop();
			this.artworkCycleStart();
		}
	}

	/**
	 * Checks if artist directory needs high-quality artist images.
	 * @param {string} artistName - The artist name.
	 * @returns {boolean} True if quality images are needed.
	 */
	artworkDirNeedsArtistImages(artistName) {
		const dir = lib.ex.cache.getCachePath('artistImageDir', artistName);
		const artist = lib.ex.utils.cleanFilename(artistName);
		const qualities = ['mini', 'small', 'medium', 'original'];

		for (const quality of qualities) {
			const pattern = `${dir}${artist}_*_${quality}.jpg`;
			const files = utils.Glob(pattern) || [];

			// Found quality image files
			if (files.length > 0) return false;
		}

		// No quality images were found, we have thumbs, or no images
		return true;
	}

	/**
	 * Loads artist and album image lists for cycling.
	 */
	artworkLoadImageLists() {
		this.artwork.artistImages = [];
		this.artwork.albumImages = [];
		this.artwork.currentImages = [];
		this.artwork.currentIndex = 0;

		if (this.isGridView) {
			const dir = lib.ex.cache.getCachePath('artistImageDir', lib.ex.data.artist);
			const artist = lib.ex.utils.cleanFilename(lib.ex.data.artist);
			const pattern = `${dir}${artist}*.jpg`;
			const files = utils.Glob(pattern) || [];

			files.sort((a, b) => {
				const getNumber = (name) => {
					const match = name.match(Regex.ArtImageFileSortNumber);
					return match ? Number(match[1]) : 0;
				};
				return getNumber(a) - getNumber(b);
			});

			this.artwork.artistImages = files.map(f => {
				const img = gdi.Image(f);
				return (img && typeof img === 'object') ? img : null;
			}).filter(img => img);
		}
		else if (this.isAlbumOrDetailsView) { // For album view, use Georgia-ReBORN's album art list
			this.artwork.albumImages = grm.ui.albumArtList.filter(img => img && typeof img === 'object');
		}
		this.artwork.currentImages = this.isGridView ? this.artwork.artistImages : this.artwork.albumImages;
	}

	/**
	 * Loads the main artwork image for current view.
	 */
	artworkLoadImage() {
		const artID = this.isAlbumView ? AlbumArtId.Front : AlbumArtId.Artist;
		const stub = this.isAlbumView ? libImg.no_cover_img : libImg.no_artist_img;

		// Set initial image
		if (this.artwork.currentImages.length > 0) {
			this.artwork.image = this.artwork.currentImages[0];
		}
		else { // Fallback to single image if no list
			this.artwork.image = utils.GetAlbumArtV2(lib.ex.data.metadb, artID) || stub;
			this.artwork.currentImages = [this.artwork.image];
		}

		const isStub = this.artwork.image === stub;
		const isSmallImage = this.artwork.image.Width < this.artwork.size && this.artwork.image.Height < this.artwork.size;

		// * Album view: fetch album cover
		if (this.isAlbumView && lib.ex.web.albumImageDLAuto && (isStub || isSmallImage)) {
			lib.ex.web.fetchAlbumCover(
				lib.ex.data.artist, lib.ex.data.album, lib.ex.web.albumImageDLQuality, (img, source, error) => {
					this.updateArtworkImage(img, true);

					// Handle auto-action for main artwork only
					if (img && lib.ex.web.albumImageAutoAction !== 'disabled') {
						const cachePath = lib.ex.cache.getCachePath('albumCover', lib.ex.data.artist, {
							albumName: lib.ex.data.album, size: lib.ex.web.albumImageDLQuality
						});
						lib.ex.web.albumCoverAutoAction(cachePath, lib.ex.data.artist, lib.ex.data.album, img);
					}
				}
			);
		}
		// * Artist views: fetch artist images
		else if (this.isGridView && lib.ex.web.artistImageDLAuto && (isStub || isSmallImage)) {
			if (!this.artworkDirNeedsArtistImages(lib.ex.data.artist)) return;
			lib.ex.web.lastfmFetchArtistImage(
				lib.ex.data.artist, lib.ex.web.artistImageDLCount, lib.ex.web.artistImageDLQuality, false, (img) => {
					this.updateArtworkImage(img, true);
				}
			);
		}
	}

	/**
	 * Checks if artwork needs to be fetched.
	 * @returns {boolean} True if artwork needs fetching.
	 */
	artworkNeedsFetch() {
		return this.artwork.image == null
		|| this.artwork.image === libImg.no_cover_img
		|| this.artwork.image === libImg.no_artist_img
		|| lib.ex.cache.lastAlbumForArtwork !== lib.ex.data.album
		|| lib.ex.cache.lastArtistForArtwork !== lib.ex.data.artist
		|| lib.ex.cache.lastViewForArtwork !== this.state.view;
	}

	/**
	 * Fetches artwork for the current view.
	 */
	fetchArtwork() {
		this.artwork.needsFetch = this.artworkNeedsFetch();

		if (!this.artwork.needsFetch) return;

		lib.ex.cache.clearCache('color');
		this.artworkLoadImageLists();
		this.artworkLoadImage();

		if (grm.ui.displayLibrary && lib.ex.main.state.visible &&
			this.artwork.cycleArtwork && this.artwork.currentImages.length > 1) {
			this.artworkCycleStop(); // Clear previous timer if existing
			this.artworkCycleStart();
		}

		lib.ex.cache.lastAlbumForArtwork = lib.ex.data.album;
		lib.ex.cache.lastArtistForArtwork = lib.ex.data.artist;
		lib.ex.cache.lastViewForArtwork = this.state.view;
	}

	/**
	 * Fetches country flags for the current artist.
	 * @param {FbMetadbHandle} metadb - The metadata handle.
	 */
	fetchCountryFlags(metadb) {
		if (!grSet.showGridArtistFlags_layout && !grSet.showLowerBarArtistFlags_layout) return;

		lib.ex.data.flagImgs = [];
		const countries = GetMetaValues(grTF.artist_country, metadb);

		const getFlagImage = (country, metadb) => {
			const countryName = (ConvertIsoCountryCodeToFull(country) || country).trim().replace(Regex.SpaceSingle, '-'); // In case we have a 2-digit country code
			const path = `${lib.ex.data.$($Escape(grPath.flagsBase), metadb) + HD_4K('32\\', '64\\') + countryName}.png`;
			return gdi.Image(path);
		}

		for (const country of countries) {
			const flagImage = getFlagImage(country, metadb);
			flagImage && lib.ex.data.flagImgs.push(flagImage);
		}
	}

	/**
	 * Fetches a thumbnail image for a grid item.
	 * @param {Object} item - The item to fetch thumbnail for.
	 * @async
	 */
	async fetchThumbnail(item) {
		if (item.thumb !== null) return;

		// Enforce concurrent download limit
		if (this.state.pendingThumbs.size >= this.state.pendingThumbsLimit) {
			return; // Defer until slots available
		}

		// Missing releases: handle URL-based downloads
		if (item.thumbUrl) {
			const cachePath = lib.ex.cache.getCachePath('missingReleasesImage', lib.ex.data.artist, item);

			if (this.state.pendingThumbs.has(cachePath)) return;

			if ($Lib.file(cachePath)) {
				item.thumb = gdi.Image(cachePath) || libImg.stub.noImg;
				item.thumbStub = item.thumb === libImg.stub.noImg;
			}
			else if (lib.ex.web.missingReleasesImageDLAuto) {
				this.state.pendingThumbs.set(cachePath, item);
				item.thumb = 'loading';
				utils.DownloadFileAsync(item.thumbUrl, cachePath);
			}
			else {
				item.thumb = libImg.stub.noImg;
				item.thumbStub = true;
			}
		}
		// Similar artists: handle local vs external
		else if (this.isSimilarArtistView) {
			const cachePath = lib.ex.cache.getCachePath('similarArtistThumb', item.name, item);

			if (this.state.pendingThumbs.has(cachePath)) return;

			if ($Lib.file(cachePath)) {
				item.thumb = gdi.Image(cachePath) || libImg.no_artist_img;
				item.thumbStub = item.thumb === libImg.no_artist_img;
			} else {
				this.state.pendingThumbs.set(cachePath, item);
				item.thumb = 'loading';

				// Local mode: fetch from library
				if (lib.ex.similar.isSimilarLocal) {
					const handles = item.handles && item.handles.Count > 0 ? item.handles[0] : null;
					const thumb = await utils.GetAlbumArtAsyncV2(0, handles, AlbumArtId.Artist, true);
					let localArt = thumb.image;

					if (localArt) {
						const thumbSize = 300;
						localArt = this.getResizedImage(localArt, thumbSize, this.state.artistThumbImgScaling);
						localArt.SaveAs(cachePath, 2);
						item.thumb = localArt;
						this.state.pendingThumbs.delete(cachePath);
						lib.ex.utils.repaintViewport();
						return;
					}
				}

				// External mode or local fallback: fetch from web
				if (lib.ex.web.similarArtistImageDLAuto) {
					lib.ex.web.lastfmFetchArtistImage(item.name, 1, 'small', false, (img, error) => {
						item.thumb = img || libImg.no_artist_img;
						item.thumbStub = item.thumb === libImg.no_artist_img;
						item.thumbResized = null;
						item.thumbSize = 0;
						img && img.SaveAs(cachePath, 2);
						this.state.pendingThumbs.delete(cachePath);
						lib.ex.utils.repaintViewport();
					}, cachePath);
				}
				else {
					item.thumb = libImg.no_artist_img;
					item.thumbStub = item.thumb === libImg.no_artist_img;
					this.state.pendingThumbs.delete(cachePath);
				}
			}
		}
		// Artist view albums: load from library
		else if (item.metadb) {
			const thumb = await utils.GetAlbumArtAsyncV2(0, item.metadb, AlbumArtId.Front, true);
			item.thumb = thumb.image || libImg.stub.noImg;
			item.thumbStub = item.thumb === libImg.stub.noImg;

			// Auto-download missing album covers in artist view
			if (item.thumbStub && lib.ex.web.albumImageDLAuto && item.album) {
				const artistName = lib.ex.data.artist;
				const albumName = item.album;
				lib.ex.web.fetchAlbumCover(artistName, albumName, 'small', (img, source, error) => {
					if (!img) return;
					item.thumb = img;
					item.thumbStub = false;
					item.thumbResized = null;
					item.thumbSize = 0;
					lib.ex.utils.repaintViewport();
				});
			}
			// Only pre-resize if successfully loaded a real image
			else if (item.thumb && item.thumb !== libImg.stub.noImg) {
				item.thumbResized = this.getResizedImage(item.thumb, this.grid.thumbSize, this.state.albumThumbImgScaling);
				item.thumbSize = this.grid.thumbSize;
				lib.ex.utils.repaintViewport();
			}
		}
		// Fallback
		else {
			item.thumb = libImg.stub.noImg;
			item.thumbStub = true;
		}

		// Reset resize cache if loaded
		if (item.thumb && item.thumb !== 'loading') {
			item.thumbResized = null;
			item.thumbSize = 0;
		}
	}

	/**
	 * Resizes and optionally crops an image based on the given mode and target size (square).
	 * @param {GdiBitmap} image - The source image.
	 * @param {number} size - The target square size.
	 * @param {string} mode - The scaling mode ('cropped', 'proportional', 'stretched').
	 * @param {boolean} [highQuality] - The optional flag indicating if high quality interpolation should be used.
	 * @returns {GdiBitmap} The resized/cropped image.
	 */
	getResizedImage(image, size, mode, highQuality = false) {
		if (!image) return null;

		const interp = highQuality ? InterpolationMode.HighQualityBicubic : InterpolationMode.Bicubic;

		const modes = {
			cropped: () => {
				const minDim = Math.min(image.Width, image.Height);
				const imgSize = Math.max(1, minDim);
				const srcX = (image.Width - minDim) / 2;
				const srcY = (image.Height - minDim) / 2;
				const cropped = gdi.CreateImage(imgSize, imgSize);
				const g = cropped.GetGraphics();

				g.DrawImage(image, 0, 0, minDim, minDim, srcX, srcY, minDim, minDim);
				cropped.ReleaseGraphics(g);

				return cropped.Resize(size, size, interp);
			},

			proportional: () => {
				const scale = Math.min(size / image.Width, size / image.Height);
				const newW = Math.floor(image.Width * scale);
				const newH = Math.floor(image.Height * scale);
				return image.Resize(newW, newH, interp);
			},

			stretched: () => {
				return image.Resize(size, size, interp);
			}
		};

		return (modes[mode] || modes.proportional)();
	}

	/**
	 * Checks if current artwork is a stub/placeholder.
	 * @returns {boolean} True if artwork is a stub.
	 */
	isArtworkStub() {
		return this.artwork.image == null
			|| this.artwork.image === libImg.no_cover_img
			|| this.artwork.image === libImg.no_artist_img;
	}

	/**
	 * Scales the current artwork image to fit the container.
	 */
	setArtworkScaled() {
		if (this.artwork.resized) {
			this.artwork.resized = null;
		}

		try {
			// ! Avoid weird 2px anti-aliased scaling artifacts of HighQualityBicubic along border of images:
			// ! https://stackoverflow.com/questions/4772273/interpolationmode-highqualitybicubic-introducing-artefacts-on-edge-of-resized-im
			this.artwork.corrupt = false;

			// * 1. Create the cropped source section
			const croppedArt = gdi.CreateImage(this.artwork.srcW, this.artwork.srcH);
			const g = croppedArt.GetGraphics();
			g.DrawImage(this.artwork.image, 0, 0, this.artwork.srcW, this.artwork.srcH, this.artwork.srcX, this.artwork.srcY, this.artwork.srcW, this.artwork.srcH);
			croppedArt.ReleaseGraphics(g);

			// * 2. Resize with HighQualityBicubic with +4px border (2px on each side)
			const hqScaled = croppedArt.Resize(this.artwork.w + 4, this.artwork.h + 4, InterpolationMode.HighQualityBicubic);

			// * 3. Clone final image at exact target size, cropping 2px from each side
			this.artwork.resized = hqScaled.Clone(2, 2, this.artwork.w, this.artwork.h);
		}
		catch (e) {
			console.log('Library Explorer => setArtworkScaled => Error pre-resizing artwork:', e);
			this.artwork.corrupt = true;
			this.artwork.resized = this.artwork.image;
		}
	}

	/**
	 * Scales all thumbnail stub placeholders to current grid size.
	 */
	setThumbnailStubsScaled() {
		const modes = ['cropped', 'proportional', 'stretched'];
		const types = ['artistThumb', 'albumThumb'];

		lib.ex.cache.clearCache('placeholder');

		for (const type of types) {
			for (const mode of modes) {
				const sourceImg = type === 'artistThumb' ? libImg.no_artist_img : libImg.stub.noImg;
				const resized = this.getResizedImage(sourceImg, this.grid.thumbSize, mode);
				lib.ex.cache.placeholderCache[type].set(`${this.grid.thumbSize}_${mode}`, resized);
			}
		}

		lib.ex.cache.clearCache('thumbnail');
	}

	/**
	 * Updates the artwork image and repaints the explorer.
	 * @param {GdiBitmap} img - The new artwork image.
	 * @param {boolean} [rebuildLists] - The flag indicating if image lists should be rebuilt.
	 */
	updateArtworkImage(img, rebuildLists = false) {
		if (!img) return;

		this.artwork.image = img;
		lib.ex.cache.clearCache('color');

		if (rebuildLists) this.artworkLoadImageLists(); // Only when new images were added

		this.setArtworkMetrics();
		this.setArtworkScaled();
		lib.ex.color.setArtworkColor();
		lib.ex.utils.repaintExplorer();
	}
	// #endregion


	// * INITIALIZATION * //
	// #region INITIALIZATION * //
	/**
	 * Initializes the explorer after fonts are ready.
	 * @async
	 */
	async initExplorer() {
		// Wait for on_size to be loaded in gr-callbacks.js after gr-initialize.js
		// Needed for the font size setting grSet.libraryFontSize_layout to be ready
		await WaitUntil(() => typeof on_size !== 'undefined');
		this.setFonts(true);
		this.setSettings();
	}

	/**
	 * Initializes a view with metadata and settings.
	 * @param {string} viewType - The view type to initialize.
	 * @param {FbMetadbHandle} [metadb] - The optional metadata handle.
	 */
	initView(viewType, metadb = null) {
		if (metadb) lib.ex.data.metadb = metadb;

		this.fetchCountryFlags(lib.ex.data.metadb);
		this.fetchArtwork();
		lib.ex.color.setArtworkColor();
		lib.ex.data.setHeaderMeta(viewType !== 'albumView');
		lib.ex.data.setSorting();
		lib.ex.data.updateNowPlaying();
		this.setMetrics();

		lib.ex.control.explorerShow();
	}

	/**
	 * Sets fonts for the explorer interface.
	 * @param {boolean} forceCreate - The flag to force font creation.
	 */
	setFonts(forceCreate) {
		if (forceCreate) {
			grFont.libExClose = Font(grFont.fontRebornSymbols, grSet.libraryFontSize_layout + 6, 0);
			grFont.libExHeader = Font(grFont.fontLibExHeader, grSet.libraryFontSize_layout + 6, 0);
			grFont.libExPlaying = Font(grFont.fontRebornSymbols, grSet.libraryFontSize_layout + 1, 0);
			grFont.libExRebornSymbols = Font(grFont.fontRebornSymbols, grSet.libraryFontSize_layout + 2, 0);
			grFont.libExRebornSymbolsLarge = Font(grFont.fontRebornSymbols, grSet.libraryFontSize_layout + 10, 0);
			grFont.libExrebornSymbolsXL = Font(grFont.fontRebornSymbols, grSet.libraryFontSize_layout + 20, 0);
		}

		this.font.close = grFont.libExClose;
		this.font.header = grFont.libExHeader;
		this.font.playing = grFont.libExPlaying;
		this.font.rebornSymbols = grFont.libExRebornSymbols;
		this.font.rebornSymbolsLarge = grFont.libExRebornSymbolsLarge;
		this.font.rebornSymbolsXL = grFont.libExrebornSymbolsXL;
	}

	/**
	 * Sets all explorer settings from library configuration.
	 */
	setSettings() {
		// * ARTWORK * //
		this.state.albumImgScaling = libSet.explorerAlbumImgScaling;
		this.state.artistImgScaling = libSet.explorerArtistImgScaling;
		this.state.albumThumbImgScaling = libSet.explorerAlbumThumbImgScaling;
		this.state.artistThumbImgScaling = libSet.explorerArtistThumbImgScaling;
		lib.ex.color.fullThemeColorChange = libSet.explorerFullThemeColorChange;
		this.artwork.cycleArtwork = libSet.explorerArtworkCycle;
		this.artwork.cycleArtworkTime = libSet.explorerArtworkCycleTime;

		// * CONTROLS * //
		lib.ex.control.mouse.wheelOutsideClose = libSet.explorerWheelOutsideClose;

		// * DISPLAY * //
		this.state.explorerTreeView = libSet.explorerTreeView;
		lib.ex.button.closeButton.display = libSet.explorerCloseButtonAlways;
		lib.ex.button.tabs.showTabText = libSet.explorerTabIconsOnly;
		lib.ex.button.tabs.showTabIconNowPlaying = libSet.explorerTabIconNowPlaying;
		this.grid.externalLinkIcon = libSet.explorerExternalLinkIcon;
		this.grid.yearType = libSet.explorerAlbumYearType;
		lib.ex.album.showTrackRatingGrid = libSet.explorerShowTrackRatingGrid;
		lib.ex.album.showDifferentArtist = libSet.explorerShowDifferentArtist;
		lib.ex.album.showDiscHeader = libSet.explorerShowDiscHeader;

		// * DOWNLOADS * //
		lib.ex.web.albumImageDLAuto = libSet.explorerAlbumImageDLAuto;
		lib.ex.web.albumImageDLQuality = libSet.explorerAlbumImageDLQuality;
		lib.ex.web.albumImageAutoAction = libSet.explorerAlbumImageAutoAction;
		lib.ex.web.albumImageNameMoveToDir = libSet.explorerAlbumImageNameMoveToDir;
		lib.ex.web.artistImageDLAuto = libSet.explorerArtistImageDLAuto;
		lib.ex.web.artistImageDLCount = libSet.explorerArtistImageDLCount;
		lib.ex.web.artistImageDLQuality = libSet.explorerArtistImageDLQuality;
		lib.ex.web.missingReleasesImageDLAuto = libSet.explorerMissingReleasesImageDLAuto;
		lib.ex.web.similarArtistImageDLAuto = libSet.explorerSimilarArtistImageDLAuto;

		// * MISSING RELEASES * //
		lib.ex.missing.source = libSet.explorerMissingReleasesFetchSource;

		// * POPULARITY * //
		lib.ex.web.popularityFetchSource = libSet.explorerPopularityFetchSource;

		// * SIMILAR ARTISTS * //
		lib.ex.similar.view = libSet.explorerSimilarArtistView;
		lib.ex.similar.source = libSet.explorerSimilarArtistFetchSource;
		lib.ex.similar.sourceLimitExternal = libSet.explorerSimilarArtistFetchLimitExternal;

		// * SORT * //
		lib.ex.data.sortDirAlbum = libSet.explorerSortDirAlbum;
		lib.ex.data.sortDirArtist = libSet.explorerSortDirArtist;
		lib.ex.data.sortDirSimilar = libSet.explorerSortDirSimilar;
		lib.ex.data.sortTypeAlbum = libSet.explorerSortAlbum;
		lib.ex.data.sortTypeArtist = libSet.explorerSortArtist;
		lib.ex.data.sortTypeSimilar = libSet.explorerSortSimilar;

		// * STATS * //
		lib.ex.data.statsSelectedAlbum = libSet.explorerStatsAlbum;
		lib.ex.data.statsSelectedArtist = libSet.explorerStatsArtist;
		lib.ex.data.statsSelectedSimilar = libSet.explorerStatsSimilar;
	}
	// #endregion
}


/**
 * The `LibExplorerArtistView` class for managing the artist view grid layout.
 * @class
 */
class LibExplorerArtistView {
	/**
	 * Creates a LibExplorerArtistView instance.
	 * @constructor
	 */
	constructor() {
		// Temporary image rendering
		/** @type {number} The width of the temporary image used for rendering calculations. */
		this.tempImgW = 1;
		/** @type {number} The height of the temporary image used for rendering calculations. */
		this.tempImgH = 1;
		/** @type {number} The horizontal offset for drawing the temporary image. */
		this.tempImgOffsetX = 0;
		/** @type {number} The vertical offset for drawing the temporary image. */
		this.tempImgOffsetY = 0;
	}

	/**
	 * Draws the artist view grid with albums or similar artists.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawArtistView(gr) {
		// Temp bitmap for clipped content
		const tempImg = gdi.CreateImage(Math.max(1, this.tempImgW), Math.max(1, this.tempImgH));
		const g = tempImg.GetGraphics();

		lib.ex.main.applyTextRendering(g, 0, 0, this.tempImgW, lib.ex.main.ui.viewportH, lib.ex.color.column_bg);

		if (lib.ex.main.isSimilarArtistView) {
			if (lib.ex.main.state.loadingSimilarArtist) {
				g.DrawString('Loading similar artists...', lib.ex.main.font.header, lib.ex.color.column_text_normal, lib.ex.main.grid.loadingText.x, lib.ex.main.grid.loadingText.y, lib.ex.main.grid.loadingText.w, lib.ex.main.grid.loadingText.h, lib.ex.main.stringFormat.center);
				tempImg.ReleaseGraphics(g);
				gr.DrawImage(tempImg, this.tempImgOffsetX, this.tempImgOffsetY, this.tempImgW, this.tempImgH, 0, 0, this.tempImgW, this.tempImgH);
				return;
			}
			else if (lib.ex.data.similarArtistError) {
				g.DrawString(lib.ex.data.similarArtistError, lib.ex.main.font.header, lib.ex.color.column_text_normal, lib.ex.main.grid.loadingText.x, lib.ex.main.grid.loadingText.y, lib.ex.main.grid.loadingText.w, lib.ex.main.grid.loadingText.h, lib.ex.main.stringFormat.center);
				tempImg.ReleaseGraphics(g);
				gr.DrawImage(tempImg, this.tempImgOffsetX, this.tempImgOffsetY, this.tempImgW, this.tempImgH, 0, 0, this.tempImgW, this.tempImgH);
				return;
			}
		}
		else if (lib.ex.main.isMissingReleasesView) {
			if (lib.ex.main.state.loadingMissingReleases) {
				g.DrawString('Finding missing releases...', lib.ex.main.font.header, lib.ex.color.column_text_normal, lib.ex.main.grid.loadingText.x, lib.ex.main.grid.loadingText.y, lib.ex.main.grid.loadingText.w, lib.ex.main.grid.loadingText.h, lib.ex.main.stringFormat.center);
				tempImg.ReleaseGraphics(g);
				gr.DrawImage(tempImg, this.tempImgOffsetX, this.tempImgOffsetY, this.tempImgW, this.tempImgH, 0, 0, this.tempImgW, this.tempImgH);
				return;
			}
			else if (lib.ex.data.missingReleasesError) {
				g.DrawString(lib.ex.data.missingReleasesError, lib.ex.main.font.header, lib.ex.color.column_text_normal, lib.ex.main.grid.loadingText.x, lib.ex.main.grid.loadingText.y, lib.ex.main.grid.loadingText.w, lib.ex.main.grid.loadingText.h, lib.ex.main.stringFormat.center);
				tempImg.ReleaseGraphics(g);
				gr.DrawImage(tempImg, this.tempImgOffsetX, this.tempImgOffsetY, this.tempImgW, this.tempImgH, 0, 0, this.tempImgW, this.tempImgH);
				return;
			}
		}

		const items = lib.ex.utils.getGridItems();
		const numRows = Math.ceil(items.length / lib.ex.main.grid.columns);
		const rowMin = Math.max(0, Math.floor(lib.ex.sbar.scrollCurrent / lib.ex.main.grid.rowH));
		const rowMax = Math.min(numRows - 1, Math.floor((lib.ex.sbar.scrollCurrent + lib.ex.main.ui.viewportH - 1) / lib.ex.main.grid.rowH));

		for (let row = rowMin; row <= rowMax; row++) {
			const absY = lib.ex.main.ui.viewportY + row * lib.ex.main.grid.rowH - lib.ex.sbar.scrollCurrent;
			const relY = Math.floor(absY - lib.ex.main.ui.viewportY + lib.ex.main.grid.thumbMargin);

			for (let column = 0; column < lib.ex.main.grid.columns; column++) {
				const i = row * lib.ex.main.grid.columns + column;
				if (i >= items.length) break;
				const item = items[i];

				const isHovered = i === lib.ex.control.mouse.hoveredAlbum;
				const isPlaying = fb.IsPlaying && i === lib.ex.main.state.nowPlayingIndex;
				const isSelected = lib.ex.main.state.selectedIndices.has(i);

				const textColor =
					isHovered && !isPlaying  && !isSelected ? lib.ex.color.grid_title_hovered :
					isPlaying  ? lib.ex.color.grid_title_playing :
					isSelected ? lib.ex.color.grid_title_selected :
					lib.ex.color.grid_title_normal;

				const relX = Math.floor(column * (lib.ex.main.grid.thumbSize + lib.ex.main.grid.thumbGap) + lib.ex.main.grid.thumbMargin);

				// Playing background
				if (isPlaying) {
					g.FillSolidRect(relX - lib.ex.main.grid.thumbMargin, relY - lib.ex.main.grid.thumbMargin, lib.ex.main.grid.thumbSize + 2 * lib.ex.main.grid.thumbMargin, lib.ex.main.grid.rowH, lib.ex.color.grid_playing_bg);
				}

				// Selection
				if (isSelected) {
					g.FillSolidRect(relX - lib.ex.main.grid.thumbMargin, relY - lib.ex.main.grid.thumbMargin, lib.ex.main.grid.thumbSize + 2 * lib.ex.main.grid.thumbMargin, lib.ex.main.grid.rowH, lib.ex.color.grid_selection_bg);
				}

				// Draw grid thumbnail
				const mode = lib.ex.utils.getGridThumbScalingMode();
				lib.ex.main.drawGridThumbnail(g, item, relX, relY, mode);

				// External indicator for missing releases and similar artist external
				if (lib.ex.main.grid.externalLinkIcon && (lib.ex.main.isMissingReleasesView || lib.ex.similar.isSimilarExternal)) {
					const iconX = relX + lib.ex.main.grid.thumbSize - lib.ex.main.grid.iconExternalSize + SCALE(4);
					const iconBgSize = lib.ex.main.grid.iconExternalSize - SCALE(4);
					g.FillSolidRect(iconX, relY + lib.ex.main.grid.yearBarY, iconBgSize, iconBgSize, RGBA(0, 0, 0, 125));
					g.DrawString(lib.ex.main.font.icons.External, lib.ex.main.font.rebornSymbols, RGB(255, 255, 255), iconX, relY + lib.ex.main.grid.yearBarY, lib.ex.main.grid.iconExternalSize, lib.ex.main.grid.iconExternalSize, lib.ex.main.stringFormat.leftEllipsis);
				}

				// Draw main text
				const textRelY = Math.floor(relY + lib.ex.main.grid.thumbSize + lib.ex.main.grid.textOffsetY);
				g.DrawString(item.mainDisplay, lib.ui.font.main, textColor, relX, textRelY, lib.ex.main.grid.thumbSize, lib.ex.main.grid.singleRowLineH, lib.ex.main.stringFormat.centerEllipsis);

				// Draw stats if available
				if (item.statistic !== undefined && item.statistic !== '') {
					const statY = textRelY + lib.ex.main.grid.singleRowLineH + lib.ex.main.grid.textStatsOffsetY;
					if (lib.ex.data.getStatsSelected() === 'rating') {
						const rating = Number(item.statistic);
						if (rating > 0) {
							lib.ex.main.drawRatingStars(g, rating, lib.ex.main.font.rebornSymbols, relX, statY, lib.ex.main.grid.singleRowLineH, SCALE(-2), false);
						}
					} else {
						g.DrawString(item.statDisplay, lib.ui.font.main, textColor, relX, statY, lib.ex.main.grid.thumbSize, lib.ex.main.grid.singleRowLineH, lib.ex.main.stringFormat.centerEllipsis);
					}
				}
			}
		}

		tempImg.ReleaseGraphics(g);
		gr.DrawImage(tempImg, this.tempImgOffsetX, this.tempImgOffsetY, this.tempImgW, this.tempImgH, 0, 0, this.tempImgW, this.tempImgH);
	}

	/**
	 * Gets the formatted source label text.
	 * @returns {string} The source label text.
	 */
	getSourceLabelText() {
		if (lib.ex.main.isMissingReleasesView) {
			return (
				lib.ex.missing.sourceCustomList ? 'Custom' :
				lib.ex.missing.source === 'lastfm' ? 'Last.fm' :
				lib.ex.missing.source === 'discogs' ? 'Discogs' :
				'MusicBrainz'
			);
		}
		else if (lib.ex.main.isSimilarArtistView) {
			return (
				lib.ex.similar.sourceCustomList ? 'Custom' :
				lib.ex.similar.source === 'lastfm' ? 'Last.fm' :
				'ListenBrainz'
			);
		}
	}

	/**
	 * Sets metrics for artist view layout.
	 */
	setArtistViewMetrics() {
		if (!lib.ex.main.isGridView) return;

		lib.ex.main.ui.artistOrg = lib.ex.main.isArtistView ? lib.ex.data.artist : lib.ex.data.artistOrigName;

		if (lib.ex.main.isMissingReleasesView) {
			const formattedSource = this.getSourceLabelText();
			lib.ex.missing.sourceText = formattedSource;
			lib.ex.missing.sourceTextW = lib.ex.utils.measureTextWidth(formattedSource, lib.ex.main.font.header);
			lib.ex.missing.sourceBoxX = lib.ex.main.ui.column.x + lib.ex.main.ui.durationX;
			lib.ex.missing.sourceX = lib.ex.main.ui.column.x + lib.ex.main.ui.durationX + lib.ex.main.ui.durationW - lib.ex.missing.sourceTextW;
		}

		if (lib.ex.main.isSimilarArtistView) {
			const formattedSource = this.getSourceLabelText();
			lib.ex.similar.sourceText = formattedSource;
			lib.ex.similar.sourceTextW = lib.ex.utils.measureTextWidth(formattedSource, lib.ex.main.font.header);
			lib.ex.similar.sourceBoxX = lib.ex.main.ui.column.x + lib.ex.main.ui.durationX;
			lib.ex.similar.sourceX = lib.ex.main.ui.column.x + lib.ex.main.ui.durationX + lib.ex.main.ui.durationW - lib.ex.similar.sourceTextW;

			lib.ex.similar.toggleText = lib.ex.similar.isSimilarLocal ? 'Local' : 'External';
			lib.ex.similar.toggleTextW = lib.ex.utils.measureTextWidth(lib.ex.similar.toggleText, lib.ex.main.font.header) + SCALE(2);
			lib.ex.similar.toggleX = lib.ex.similar.sourceX - SCALE(10) - lib.ex.similar.toggleTextW;
			lib.ex.main.ui.headerSummaryW = lib.ex.similar.toggleX - lib.ex.main.ui.column.x;
		}

		// Flags
		const hasFlag = lib.ex.data.flagImgs.length > 0;
		lib.ex.main.ui.flagSize = hasFlag ? lib.ex.main.ui.headerLineHeight * 0.85 : 0;
		lib.ex.main.ui.flagMargin = hasFlag ? lib.ex.main.ui.flagSize + SCALE(10) : 0;

		// Suffix
		lib.ex.main.ui.suffix = lib.ex.main.isArtistView ? '' :
			lib.ex.main.isSimilarArtistView ? (hasFlag ? '  Similar Artists' : `${Unicode.MiddleDot}  Similar Artists`) :
			lib.ex.main.isMissingReleasesView ? (hasFlag ? '  Missing Releases' : `${Unicode.MiddleDot} Missing Releases`) : '';
		const suffixW = lib.ex.main.ui.suffix ? lib.ex.utils.measureTextWidth(lib.ex.main.ui.suffix, lib.ex.main.font.header) : 0;

		// Artist
		lib.ex.main.ui.artist = lib.ex.main.ui.artistOrg;
		const maxArtistW = lib.ex.main.ui.contentW - lib.ex.main.ui.flagMargin - suffixW;
		const artistFullW = lib.ex.utils.measureTextWidth(lib.ex.main.ui.artistOrg, lib.ex.main.font.header);
		if (artistFullW > maxArtistW) {
			lib.ex.main.ui.artist = lib.ex.utils.truncateText('width', lib.ex.main.ui.artistOrg, lib.ex.main.font.header, maxArtistW);
		}
		lib.ex.main.ui.artistW = lib.ex.utils.measureTextWidth(lib.ex.main.ui.artist, lib.ex.main.font.header);

		// Flags 2
		lib.ex.main.ui.flagX = lib.ex.main.ui.column.x + lib.ex.main.ui.artistW + SCALE(10);
		lib.ex.main.ui.flagY = lib.ex.main.ui.headerArtistY + lib.ex.main.ui.headerLineHeight * 0.15 - SCALE(1);
		lib.ex.main.ui.suffixX = lib.ex.main.ui.flagX + lib.ex.main.ui.flagSize;

		// Album summary
		if (lib.ex.main.isMissingReleasesView) {
			const count = lib.ex.data.missingReleasesList.length;
			const releaseStr = count === 1 ? 'release' : 'releases';
			lib.ex.main.ui.summary = `${count} missing ${releaseStr}`;
		} else {
			lib.ex.main.ui.summary = lib.ex.data.albumSummary;
		}

		if (lib.ex.main.isArtistView) {
			lib.ex.main.ui.headerSummaryW = lib.ex.main.ui.contentW;
		}

		const summaryFullW = lib.ex.utils.measureTextWidth(lib.ex.main.ui.summary, lib.ex.main.font.header);
		if (summaryFullW > lib.ex.main.ui.headerSummaryW) {
			lib.ex.main.ui.summary = lib.ex.utils.truncateText('width', lib.ex.main.ui.summary, lib.ex.main.font.header, lib.ex.main.ui.headerSummaryW);
		}
		lib.ex.main.ui.summaryW = lib.ex.utils.measureTextWidth(lib.ex.main.ui.summary, lib.ex.main.font.header);

		// Header draw widths
		lib.ex.main.ui.headerArtistW = lib.ex.main.ui.contentW;
		lib.ex.main.ui.headerSuffixW = lib.ex.main.ui.contentW - (lib.ex.main.ui.suffixX - lib.ex.main.ui.column.x);
	}

	/**
	 * Loads artist view with albums for a given artist.
	 * @param {FbMetadbHandleList} handles - The handles for the artist.
	 * @param {number} [artistIndex=-1] - The optional artist index for navigation.
	 * @returns {boolean} True if successfully loaded.
	 */
	loadArtistView(handles, artistIndex = -1) {
		if (handles.Count === 0) return false;

		lib.ex.main.state.view = 'artistView';
		lib.ex.main.state.artistIndex = artistIndex;
		lib.ex.data.artist = lib.ex.data.$(lib.ex.data.TF.album_artist, handles[0]);
		lib.ex.data.albumsList = lib.ex.data.getAlbumsListFromHandles(handles);

		for (const album of lib.ex.data.albumsList) {
			album.thumb = null;
			album.statistic = lib.ex.data.getTracksStatistic(album.handles, lib.ex.data.getStatsSelected(), false);
		}

		if (lib.ex.data.albumsList.length > 0) {
			lib.ex.data.metadb = lib.ex.data.albumsList[0].metadb;
			lib.ex.data.getAlbumSummary();
		}

		lib.ex.main.initView('artistView', lib.ex.data.metadb);

		if (lib.ex.data.getStatsSelected() === 'popularity') {
			lib.ex.web.fetchPopularityArtist();
		}

		return true;
	}
}


/**
 * The `LibExplorerAlbumView` class for managing the album view tracklist.
 * @class
 */
class LibExplorerAlbumView {
	/**
	 * Creates a LibExplorerAlbumView instance.
	 * @constructor
	 */
	constructor() {
		// Track layout
		/** @type {number} The computed track row height. */
		this.trackHeight = 0;
		/** @type {number} The width for track titles. */
		this.titleW = 0;
		/** @type {number} The X-position for stats. */
		this.statisticX = 0;
		/** @type {number} The X-position for track rating stars. */
		this.trackRatingX = 0;
		/** @type {number} The X-position for album rating. */
		this.albumRatingX = 0;
		/** @type {number} The width for album rating. */
		this.albumRatingW = 0;

		// Disc header layout
		/** @type {boolean} The flag to show disc headers for multi-disc albums. */
		this.showDiscHeader = libSet.explorerShowDiscHeader || true;
		/** @type {number} The height of a disc subheader row. */
		this.discHeaderHeight = 0;
		/** @type {Array} The disc group objects: [{discIndex, discTitle, trackIndices[], collapsed}] */
		this.discGroups = [];
		/** @type {Array} The flat interleaved disc layout: [{type:'disc'|'track', discIndex|trackIndex, height}] */
		this.discLayoutItems = [];

		// Sizing constraints
		/** @type {number} The max width for play stats. */
		this.maxPlayW = 0;
		/** @type {number} The total width for rating stars. */
		this.ratingW = 0;

		// Rating stars
		/** @type {boolean} The flag that shows the track rating grid in the track rows. */
		this.showTrackRatingGrid = libSet.explorerShowTrackRatingGrid || true;
		/** @type {boolean} The flag that shows the artist name on difference between album artist in the track rows. */
		this.showDifferentArtist = libSet.explorerShowDifferentArtist || false;
		/** @type {number} The star icon size. */
		this.starSize = 0;
		/** @type {number} The padding between stars. */
		this.starPad = 0;

		// Temporary image rendering
		/** @type {number} The temp bitmap width for album list. */
		this.tempImgW = 1;
		/** @type {number} The temp bitmap draw offset X for album list. */
		this.tempImgOffsetX = 0;
	}

	/**
	 * Draws the album view tracklist.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawAlbumView(gr) {
		// Temp bitmap for clipped content, extended left and right for markers
		const tempImg = gdi.CreateImage(Math.max(1, this.tempImgW), Math.max(1, lib.ex.main.ui.viewportH));
		const g = tempImg.GetGraphics();

		lib.ex.main.applyTextRendering(g, 0, 0, this.tempImgW, lib.ex.main.ui.viewportH, lib.ex.color.column_bg);

		const leftOffset = SCALE(15);
		let cumY = 0;

		for (const item of this.discLayoutItems) {
			const relY = cumY - lib.ex.sbar.scrollCurrent;

			// Cull items outside viewport
			if (relY + item.height < 0) {
				cumY += item.height;
				continue;
			}
			if (relY > lib.ex.main.ui.viewportH) {
				break;
			}

			if (item.type === 'disc') {
				this.drawDiscHeader(g, item.discIndex, relY);
			}
			else {
				const i = item.trackIndex;
				const track = lib.ex.data.tracksList[i];

				const isHovered = i === lib.ex.control.mouse.hoveredTrack;
				const isPlaying = fb.IsPlaying && i === lib.ex.main.state.nowPlayingIndex;
				const isSelected = lib.ex.main.state.selectedIndices.has(i);
				const rowStripesBg = lib.ui.rowStripes && (i % 2 === 0) ? lib.ex.color.row_stripes_bg : 0;

				const textColor =
					isHovered && !isPlaying && !isSelected ? lib.ex.color.row_title_hovered :
					isPlaying ? lib.ex.color.row_title_playing :
					isSelected ? lib.ex.color.row_title_selected :
					lib.ex.color.row_title_normal;

				if (rowStripesBg) {
					g.FillSolidRect(leftOffset, relY, lib.ex.main.ui.contentW, this.trackHeight, rowStripesBg);
				}

				// Selection
				if (isSelected && !isPlaying) {
					g.DrawRect(0, relY, this.tempImgW - SCALE(1), this.trackHeight, 1, lib.ex.color.row_selection_frame);
					g.DrawRect(0, relY, SCALE(7), this.trackHeight, 1, lib.ex.color.row_sideMarker);
					g.FillSolidRect(0, relY, SCALE(8), this.trackHeight, lib.ex.color.row_sideMarker);
				}

				// Playing
				if (isPlaying) {
					const playbackIcon = fb.IsPaused ? RebornSymbols.Pause : RebornSymbols.Play;
					g.FillSolidRect(0, relY, this.tempImgW, this.trackHeight + 1, lib.ex.color.row_playing_bg);
					g.DrawRect(0, relY, SCALE(7), this.trackHeight, 1, lib.ex.color.row_sideMarker);
					g.FillSolidRect(0, relY, SCALE(8), this.trackHeight, lib.ex.color.row_sideMarker);
					g.DrawString(playbackIcon, lib.ex.main.font.playing, textColor, leftOffset, relY, SCALE(20), this.trackHeight, lib.ex.main.stringFormat.centerEllipsis);
				}

				// Statistic
				if (track.statDisplay) {
					g.DrawString(track.statDisplay, lib.ui.font.main, textColor, leftOffset + this.statisticX, relY, this.maxPlayW, this.trackHeight, lib.ex.main.stringFormat.rightEllipsis);
				}

				// Rating
				if (track.rating > 0) {
					lib.ex.main.drawRatingStars(g, track.rating, lib.ex.main.font.rebornSymbols, leftOffset + this.trackRatingX, relY, this.trackHeight, SCALE(-2), false);
				}

				// Track title and duration
				const fullTitle = isPlaying ? track.playingFullTitle : track.normalFullTitle;
				g.DrawString(fullTitle, lib.ui.font.main, textColor, leftOffset, relY, this.titleW, this.trackHeight, lib.ex.main.stringFormat.centerEllipsis);
				g.DrawString(track.duration, lib.ui.font.main, textColor, leftOffset + lib.ex.main.ui.durationX, relY, lib.ex.main.ui.durationW, this.trackHeight, lib.ex.main.stringFormat.rightEllipsis);
			}

			cumY += item.height;
		}

		tempImg.ReleaseGraphics(g);
		gr.DrawImage(tempImg, this.tempImgOffsetX, lib.ex.main.ui.viewportY, this.tempImgW, lib.ex.main.ui.viewportH, 0, 0, this.tempImgW, lib.ex.main.ui.viewportH);
	}

	/**
	 * Draws a disc subheader row.
	 * @param {GdiGraphics} g - The temp bitmap graphics context.
	 * @param {number} discIndex - The disc group index.
	 * @param {number} relY - The Y position relative to viewport top (in temp bitmap coords).
	 */
	drawDiscHeader(g, discIndex, relY) {
		const group = this.discGroups[discIndex];
		if (!group) return;

		const leftOffset = SCALE(15);
		const isHovered = lib.ex.control.mouse.hoveredDiscHeader === discIndex;
		const textColor = isHovered ? lib.ex.color.row_title_hovered : lib.ex.color.row_title_normal;
		const font = lib.ui.font.main;

		g.DrawString(group.discTitle, font, textColor, leftOffset, relY, this.titleW, this.discHeaderHeight, Stringformat.V_Align_Center | Stringformat.Trim_Ellipsis_Char | Stringformat.No_Wrap);

		const duration = group.trackIndices.reduce((acc, ti) => acc + lib.ex.data.tracksList[ti].handle.Length, 0);
		const trackCount = group.trackIndices.length;

		const maxTrackCount = Math.max(...this.discGroups.map(dg => dg.trackIndices.length));
		const maxDurStr = this.discGroups
			.map(dg => utils.FormatDuration(dg.trackIndices.reduce((acc, ti) => acc + lib.ex.data.tracksList[ti].handle.Length, 0)))
			.reduce((a, b) => a.length >= b.length ? a : b, '');

		const paddedCount = String(trackCount).padStart(maxTrackCount.toString().length, Unicode.FigureSpace);
		const formattedDuration = utils.FormatDuration(duration);
		const paddedDuration = formattedDuration.padStart(maxDurStr.length, Unicode.FigureSpace);
		const rightText = `${paddedCount} Track${trackCount === 1 ? '' : 's'} - ${paddedDuration}`;

		g.DrawString(rightText, font, textColor, leftOffset, relY, lib.ex.main.ui.contentW, this.discHeaderHeight, Stringformat.H_Align_Far | Stringformat.V_Align_Center | Stringformat.No_Wrap);

		g.DrawLine(leftOffset, relY + this.discHeaderHeight, leftOffset + lib.ex.main.ui.contentW, relY + this.discHeaderHeight, 1, lib.ex.color.row_selection_frame);
	}

	/**
	 * Sets metrics for album view layout.
	 */
	setAlbumViewMetrics() {
		if (!lib.ex.main.isAlbumOrDetailsView) return;

		lib.ex.main.ui.artistOrg = lib.ex.data.artist;
		lib.ex.main.ui.albumOrg = lib.ex.data.album;

		this.maxPlayW = Math.max(...lib.ex.data.tracksList.filter(t => t.statistic).map(t => lib.ex.utils.measureTextWidth(`${t.statistic} |`, lib.ui.font.main)), 0) + SCALE(10);
		this.starSize = SCALE(14);
		this.starPad = this.starSize + SCALE(1);
		this.ratingW = 5 * this.starPad + SCALE(10);
		lib.ex.main.ui.colPad = SCALE(10);

		lib.ex.album.trackHeight = lib.ex.utils.measureTextHeight('Ag', lib.ui.font.main) + SCALE(2);
		this.discHeaderHeight = lib.ex.album.trackHeight + SCALE(4);
		this.trackRatingX = lib.ex.main.ui.durationX - lib.ex.main.ui.colPad - this.ratingW;
		this.statisticX = this.trackRatingX - lib.ex.main.ui.colPad - this.maxPlayW;
		this.titleW = this.statisticX - lib.ex.main.ui.colPad - SCALE(15) - SCALE(8);

		// Album temp bitmap metrics
		const leftOffset = SCALE(15);
		const rightOffset = SCALE(7);
		this.tempImgW = lib.ex.main.ui.contentW + leftOffset + rightOffset;
		this.tempImgOffsetX = lib.ex.main.ui.column.x - leftOffset;

		for (const track of lib.ex.data.tracksList) {
			const artistSuffix = (
				this.showDifferentArtist && track.trackArtist && track.albumArtist &&
				track.trackArtist.toLowerCase() !== track.albumArtist.toLowerCase() ? ` ${Unicode.MiddleDot} ${track.trackArtist}` : ''
			);
			track.normalFullTitle = `${track.displayNum}. ${track.title}${artistSuffix}`;
			track.playingFullTitle = `      ${track.title}${artistSuffix}`;
			track.statDisplay = track.statistic !== undefined && track.statistic !== '' ? `${track.statistic} |` : '';

			const normalTitleWidth = lib.ex.utils.measureTextWidth(track.normalFullTitle, lib.ui.font.main);
			const playingTitleWidth = lib.ex.utils.measureTextWidth(track.playingFullTitle, lib.ui.font.main);
			track.tooltipNormal = normalTitleWidth > this.titleW;
			track.tooltipPlaying = playingTitleWidth > this.titleW;
		}

		// Flags
		const hasFlag = lib.ex.data.flagImgs.length > 0;
		lib.ex.main.ui.flagSize = hasFlag ? lib.ex.main.ui.headerLineHeight * 0.85 : 0;
		lib.ex.main.ui.flagMargin = hasFlag ? lib.ex.main.ui.flagSize + SCALE(10) : 0;

		// Artist
		lib.ex.main.ui.artist = lib.ex.main.ui.artistOrg;
		const maxArtistW = lib.ex.main.ui.durationX - lib.ex.main.ui.flagMargin;
		const artistFullW = lib.ex.utils.measureTextWidth(lib.ex.main.ui.artistOrg, lib.ex.main.font.header);
		if (artistFullW > maxArtistW) {
			lib.ex.main.ui.artist = lib.ex.utils.truncateText('width', lib.ex.main.ui.artistOrg, lib.ex.main.font.header, maxArtistW);
		}
		lib.ex.main.ui.artistW = lib.ex.utils.measureTextWidth(lib.ex.main.ui.artist, lib.ex.main.font.header);

		// Flags 2
		lib.ex.main.ui.flagX = lib.ex.main.ui.column.x + lib.ex.main.ui.artistW + SCALE(10);
		lib.ex.main.ui.flagY = lib.ex.main.ui.headerArtistY + lib.ex.main.ui.headerLineHeight * 0.15 - SCALE(1);

		// Album
		lib.ex.main.ui.album = lib.ex.main.ui.albumOrg;
		const albumRatingW = lib.ex.data.albumRating > 0 ? lib.ex.main.ui.headerLineHeight * 5 + SCALE(2) * 4 : 0;
		const maxAlbumW = lib.ex.main.ui.durationX - albumRatingW;
		const albumFullW = lib.ex.utils.measureTextWidth(lib.ex.main.ui.albumOrg, lib.ex.main.font.header);
		if (albumFullW > maxAlbumW) {
			lib.ex.main.ui.album = lib.ex.utils.truncateText('width', lib.ex.main.ui.albumOrg, lib.ex.main.font.header, maxAlbumW);
		}
		lib.ex.main.ui.albumW = lib.ex.utils.measureTextWidth(lib.ex.main.ui.album, lib.ex.main.font.header);
		this.albumRatingX = lib.ex.main.ui.column.x + lib.ex.main.ui.albumW + SCALE(5);
		this.albumRatingW = albumRatingW;

		// Header draw widths
		lib.ex.main.ui.headerArtistW = lib.ex.main.ui.durationX - lib.ex.main.ui.headerLineHeight;
		lib.ex.main.ui.headerAlbumW = lib.ex.main.ui.durationX - lib.ex.main.ui.headerLineHeight;

		// Disc header
		this.createDiscGroups();
	}

	/**
	 * Creates and groups tracksList into disc groups.
	 */
	createDiscGroups() {
		this.discGroups = [];
		const multiDisc = this.showDiscHeader && lib.ex.data.albumTotalDiscs > 1;

		if (!multiDisc || lib.ex.data.tracksList.length === 0) {
			this.createDiscLayoutItems();
			return;
		}

		const handles = new FbMetadbHandleList(lib.ex.data.tracksList.map(t => t.handle));
		const discTitles = fb.TitleFormat(lib.ex.data.TF.disc_header).EvalWithMetadbs(handles);

		let currentTitle = null;
		let currentGroup = null;
		let discIdx = 0;

		for (let i = 0; i < lib.ex.data.tracksList.length; i++) {
			const title = discTitles[i];

			if (title !== currentTitle) {
				currentTitle = title;
				currentGroup = { discIndex: discIdx++, discTitle: title, trackIndices: [], collapsed: false };
				this.discGroups.push(currentGroup);
			}

			currentGroup.trackIndices.push(i);
		}

		this.createDiscLayoutItems();
	}

	/**
	 * Creates the flat disc layout item list from discGroups.
	 */
	createDiscLayoutItems() {
		this.discLayoutItems = [];

		const multiDisc = this.showDiscHeader && lib.ex.data.albumTotalDiscs > 1 && this.discGroups.length > 0;

		if (!multiDisc) {
			for (let i = 0; i < lib.ex.data.tracksList.length; i++) {
				this.discLayoutItems.push({ type: 'track', trackIndex: i, height: this.trackHeight });
			}
			return;
		}

		for (const group of this.discGroups) {
			this.discLayoutItems.push({ type: 'disc', discIndex: group.discIndex, height: this.discHeaderHeight });

			if (!group.collapsed) {
				for (const trackIndex of group.trackIndices) {
					this.discLayoutItems.push({ type: 'track', trackIndex, height: this.trackHeight });
				}
			}
		}
	}

	/**
	 * Handles the toggled collapsed state of a disc group header and recreates layout.
	 * @param {number} discIndex - The disc group index.
	 */
	handleDiscHeaderCollapse(discIndex) {
		const group = this.discGroups[discIndex];
		if (!group) return;

		group.collapsed = !group.collapsed;
		this.createDiscLayoutItems();

		lib.ex.sbar.clearScrollbarPosition();
		lib.ex.utils.repaintViewport();
	}

	/**
	 * Shows the currently playing album in album view.
	 * @returns {boolean} True if successfully loaded.
	 */
	showNowPlaying() {
		if (!lib.ex.cache.nowPlayingMeta) return false;

		const { artist, album } = lib.ex.cache.nowPlayingMeta;
		const queryHandles = lib.ex.data.getHandlesAlbum(artist, album);

		if (queryHandles.Count === 0) return false;

		// * Update primary color for fullThemeColorChange
		if (lib.ex.color.fullThemeColorChange && !lib.ex.color.isArtworkPrimaryColorSame()) {
			lib.ex.cache.clearCache('artwork');
			grm.colorManager.setPrimaryColor(undefined, undefined, true);
		}

		queryHandles.OrderByFormat(fb.TitleFormat(lib.ex.data.TF.discnumber_tracknumber), 1);
		return this.loadAlbumView(queryHandles, -1);
	}

	/**
	 * Loads album view with tracks for a given album.
	 * @param {FbMetadbHandleList} handles - The handles for the album.
	 * @param {number} [albumIndex] - The optional album index for navigation.
	 * @returns {boolean} True if successfully loaded.
	 */
	loadAlbumView(handles, albumIndex = -1) {
		if (handles.Count === 0) return false;

		lib.ex.main.state.view = 'albumView';
		lib.ex.main.state.albumIndex = albumIndex;
		lib.ex.data.setAlbumMeta(handles);
		lib.ex.main.initView('albumView', lib.ex.data.metadb);

		if (lib.ex.data.getStatsSelected() === 'popularity') {
			lib.ex.web.fetchPopularityAlbum();
		}

		return true;
	}
}


/**
 * The `LibExplorerDetailsView` class for managing the details view for track/album metadata.
 * @class
 */
class LibExplorerDetailsView {
	/**
	 * Creates a LibExplorerDetailsView instance.
	 * @constructor
	 */
	constructor() {
		// Temporary image rendering
		/** @type {number} The temp bitmap width for details view. */
		this.tempImgW = 1;
		/** @type {number} The temp bitmap draw offset X for details view. */
		this.tempImgOffsetX = 0;

		// Data and selection
		/** @type {Array<FbMetadbHandle>} The array of metadb handles for details view tracks. */
		this.handles = [];
		/** @type {number} The current track index in details view navigation (-1 for aggregated). */
		this.indexCurrent = -1;
		/** @type {number} The selected item index in details list (-1 for none). */
		this.indexSelected = -1;

		// Layout dimensions
		/** @type {number} The computed header height for details. */
		this.headerH = 0;
		/** @type {number} The computed main row height for details. */
		this.mainH = 0;
		/** @type {number} The title width for details sections. */
		this.titleW = 0;

		// Navigation elements
		/** @type {number} The size of navigation glyphs (prev/next arrows). */
		this.glyphSize = 0;
		/** @type {number} The padding for navigation elements. */
		this.pad = 0;
		/** @type {number} The total width of navigation bar. */
		this.navW = 0;
		/** @type {number} The width of navigation text (e.g., "01/10"). */
		this.textW = 0;
		/** @type {number} The offset for navigation text positioning. */
		this.textOffset = 0;
		/** @type {string} The navigation text (e.g., "01/10"). */
		this.navText = '';

		// Navigation button positioning
		/** @type {number} The navigation X position for details. */
		this.navX = 0;
		/** @type {number} The navigation text X for details. */
		this.textX = 0;
		/** @type {number} The next button X for details. */
		this.nextX = 0;
		/** @type {number} The navigation button end y-position for details. */
		this.navEndY = 0;
		/** @type {number} The navigation Y offset for details. */
		this.navYOffset = 0;

		// Navigation buttons mouse detection boundaries
		/** @type {number} The previous button left screen x-coordinate (with SCALE(5) padding). */
		this.prevButtonScreenX1 = 0;
		/** @type {number} The previous button right screen x-coordinate (with SCALE(5) padding). */
		this.prevButtonScreenX2 = 0;
		/** @type {number} The next button left screen x-coordinate (with SCALE(5) padding). */
		this.nextButtonScreenX1 = 0;
		/** @type {number} The next button right screen x-coordinate (with SCALE(5) padding). */
		this.nextButtonScreenX2 = 0;
	}

	/**
	 * Draws the details view with metadata items.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawDetailsView(gr) {
		if (lib.ex.data.detailsList.length === 0) {
			gr.DrawString('No details available', lib.ui.font.main, lib.ex.color.column_text_normal, lib.ex.main.ui.column.x, lib.ex.main.ui.viewportY, lib.ex.main.ui.contentW, lib.ex.album.trackHeight, lib.ex.main.stringFormat.center);
			return;
		}

		// Temp bitmap for clipping, extended left for markers
		const tempImg = gdi.CreateImage(Math.max(1, this.tempImgW), Math.max(1, lib.ex.main.ui.viewportH));
		const g = tempImg.GetGraphics();

		lib.ex.main.applyTextRendering(g, 0, 0, this.tempImgW, lib.ex.main.ui.viewportH, lib.ex.color.column_bg);

		let currentY = lib.ex.main.ui.viewportY - lib.ex.sbar.scrollCurrent;
		const leftOffset = SCALE(15);

		for (let i = 0; i < lib.ex.data.detailsList.length; i++) {
			const detail = lib.ex.data.detailsList[i];
			const itemHeight = detail.height || lib.ex.album.trackHeight;
			const relY = currentY - lib.ex.main.ui.viewportY;
			const isHovered = i === lib.ex.control.mouse.hoveredTrack;
			const isSelected = detail.type === 'item' && i === this.indexSelected;
			const textColor = isHovered ? lib.ex.color.row_title_hovered : lib.ex.color.column_text_normal;

			// Cull if completely outside viewport
			if (relY + itemHeight < 0 || relY > lib.ex.main.ui.viewportH) {
				currentY += itemHeight;
				continue;
			}

			if (detail.type === 'section') {
				const prevColor = lib.ex.control.mouse.hoveredDetailsButtonPrev ? lib.ex.color.column_text_hovered : lib.ex.color.column_text_normal;
				const nextColor = lib.ex.control.mouse.hoveredDetailsButtonNext ? lib.ex.color.column_text_hovered : lib.ex.color.column_text_normal;

				g.DrawString(detail.title, lib.ex.main.font.header, textColor, leftOffset, relY, this.titleW, itemHeight, lib.ex.main.stringFormat.leftEllipsis);
				g.DrawString(lib.ex.main.font.icons.Prev, lib.ex.main.font.rebornSymbols, prevColor, this.navX, relY + this.navYOffset, this.glyphSize, this.glyphSize, lib.ex.main.stringFormat.center);
				g.DrawString(this.navText, lib.ui.font.main, lib.ex.color.column_text_normal, this.textX, relY, this.textW, itemHeight, lib.ex.main.stringFormat.center);
				g.DrawString(lib.ex.main.font.icons.Next, lib.ex.main.font.rebornSymbols, nextColor, this.nextX, relY + this.navYOffset, this.glyphSize, this.glyphSize, lib.ex.main.stringFormat.center);
			}
			else if (detail.type === 'spacer') {
				// Spacer: Draw nothing, just advance space
			}
			else {
				// Selection
				if (isSelected) {
					g.DrawRect(0, relY, this.tempImgW - SCALE(1), itemHeight, 1, lib.ex.color.row_selection_frame);
					g.DrawRect(0, relY, SCALE(7), itemHeight, 1, lib.ex.color.row_sideMarker); // Hide DrawRect 1px gaps when selected
					g.FillSolidRect(0, relY, SCALE(8), itemHeight, lib.ex.color.row_sideMarker);
				}

				g.DrawString(`${detail.key}:`, lib.ui.font.main, textColor, leftOffset, relY, lib.ex.main.ui.maxKeyW, itemHeight, lib.ex.main.stringFormat.centerEllipsis);
				g.DrawString(detail.value, lib.ui.font.main, textColor, leftOffset + lib.ex.main.ui.maxKeyW, relY, lib.ex.main.ui.contentW - lib.ex.main.ui.maxKeyW, itemHeight, lib.ex.main.stringFormat.rightEllipsis);
			}

			currentY += itemHeight;
		}

		tempImg.ReleaseGraphics(g);
		gr.DrawImage(tempImg, this.tempImgOffsetX, lib.ex.main.ui.viewportY, this.tempImgW, lib.ex.main.ui.viewportH, 0, 0, this.tempImgW, lib.ex.main.ui.viewportH);
	}

	/**
	 * Sets metrics for details view layout.
	 */
	setDetailsViewMetrics() {
		if (!lib.ex.main.isDetailsView) return;

		// Details temp bitmap metrics
		this.tempImgW = lib.ex.main.ui.contentW + SCALE(15) + SCALE(8);
		this.tempImgOffsetX = lib.ex.main.ui.column.x - SCALE(15);

		this.glyphSize = SCALE(14);
		this.pad = SCALE(5);
		this.textOffset = SCALE(2);
		this.navText = this.indexCurrent === -1 ? 'All' : `${String(this.indexCurrent + 1).padStart(2, '0')}/${String(this.handles.length).padStart(2, '0')}`;

		this.textW = lib.ex.utils.measureTextWidth(this.navText, lib.ui.font.main) + SCALE(2);
		this.navW = this.glyphSize * 2 + this.textW + this.pad * 2;
		this.titleW = lib.ex.main.ui.contentW - this.navW - this.pad;
		this.headerH = lib.ex.utils.measureTextHeight('Ag', lib.ex.main.font.header) + SCALE(4);
		this.mainH = lib.ex.utils.measureTextHeight('Ag', lib.ui.font.main) + SCALE(2);

		this.navX = lib.ex.main.ui.contentW - this.navW + SCALE(15);
		this.textX = this.navX + this.glyphSize + this.pad + this.textOffset;
		this.nextX = this.textX + this.textW + this.pad;
		this.navEndY = lib.ex.main.ui.viewportY + (lib.ex.data.detailsList[0] ? lib.ex.data.detailsList[0].height : this.headerH);
		this.navYOffset = (this.headerH - this.glyphSize) / 2;

		// Convert temp image coordinates to screen coordinates
		const hitPadding = SCALE(5); // 5px padding on each side for generious button hit area
		this.prevButtonScreenX1 = this.tempImgOffsetX + this.navX - hitPadding;
		this.prevButtonScreenX2 = this.prevButtonScreenX1 + this.glyphSize + 2 * hitPadding;
		this.nextButtonScreenX1 = this.tempImgOffsetX + this.nextX - hitPadding;
		this.nextButtonScreenX2 = this.nextButtonScreenX1 + this.glyphSize + 2 * hitPadding;
	}

	/**
	 * Loads details view with metadata for given handles.
	 * @param {FbMetadbHandleList} handles - The handles to display details for.
	 */
	loadDetailsView(handles) {
		if (handles.Count === 0) return;

		lib.ex.data.detailsList = [];
		lib.ex.main.setMetrics();

		const addLabel = (key, value) => value && lib.ex.data.detailsList.push({ type: 'item', key, value });
		const addSpacer = () => lib.ex.data.detailsList.push({ type: 'spacer', height: lib.ex.album.trackHeight * 0.666 });
		const addTitle = (title) => lib.ex.data.detailsList.push({ type: 'section', title });

		const unique = (arr) => new Set(arr.filter(Boolean));
		const joinUnique = (set) => [...set].join(` ${Unicode.MiddleDot} `);

		const formatUnit = (values, unit) => {
			const uniques = unique(values);
			const joined = joinUnique(uniques).replace(/,/g, ', ');
			return uniques.size === 0 ? '' : uniques.size === 1 ? `${[...uniques][0]}${unit}` : `${joined}${unit}`;
		};

		const sectionTitle = // Determine section title based on number of tracks
			handles.Count === 1 ? lib.ex.data.$(lib.ex.data.TF.title, handles)[0] || 'Unknown Track' : `${handles.Count} Selected Tracks`;

		// Title
		addTitle(sectionTitle);
		addSpacer();

		// Audio details
		addLabel('Duration', lib.ex.data.getStatsDuration(handles, true));
		addLabel('Size', lib.ex.data.getStatsSize(handles, true));
		addLabel('Codec', joinUnique(unique(lib.ex.data.$(lib.ex.data.TF.codec, handles))));
		addLabel('Bit Depth', formatUnit(lib.ex.data.$(lib.ex.data.TF.bitspersample, handles).filter(b => b), '-bit'));
		addLabel('Sample Rate', formatUnit(lib.ex.data.$(lib.ex.data.TF.samplerate, handles).filter(s => s), ' Hz'));
		addLabel('Channels', joinUnique(unique(lib.ex.data.$(lib.ex.data.TF.channel_mode, handles).filter(c => c))));
		addLabel('Bitrate', lib.ex.data.getStatsBitrate(handles, true));
		addSpacer();

		// Playback stats
		addLabel('Rating', `${lib.ex.data.getStatsRating(handles, false)}/5`);
		addLabel('Playcount', lib.ex.data.getStatsPlaycount(handles, true));
		addLabel('First Played', lib.ex.data.getStatsDate(libSet.tfFirstPlayed, handles, true, '', true));
		addLabel('Last Played', lib.ex.data.getStatsDate(libSet.tfLastPlayed, handles, true, '', false));
		addLabel('Added', lib.ex.data.getStatsDate(libSet.tfAdded, handles, true, '', true));

		for (const detail of lib.ex.data.detailsList) {
			if (detail.type === 'section') {
				detail.height = this.headerH;
			} else if (detail.type === 'item') {
				detail.height = this.mainH;
			} else if (detail.type === 'spacer') {
				detail.height = this.mainH / 2;
			}
		}

		lib.ex.main.ui.maxKeyW = Math.max(
			...lib.ex.data.detailsList.filter(d => d.type === 'item').map(d => lib.ex.utils.measureTextWidth(`${d.key}: `, lib.ui.font.main))
		) + SCALE(5) || 0;

		for (const item of lib.ex.data.detailsList) {
			if (item.type === 'item') {
				const fullText = `${item.key}: ${item.value}`;
				item.tooltipFull = lib.ex.utils.measureTextWidth(fullText, lib.ui.font.main) > lib.ex.main.ui.contentW - SCALE(20);
			}
		}

		lib.ex.utils.repaintViewport();
	}
}


/**
 * The `LibExplorerMissingReleasesView` class for managing the missing releases view.
 * @class
 */
class LibExplorerMissingReleasesView {
	/**
	 * Creates a LibExplorerMissingReleasesView instance.
	 * @constructor
	 */
	constructor() {
		/** @type {string} The missing releases fetch source ('discogs', 'lastfm', 'musicbrainz'). */
		this.source = libSet.explorerMissingReleasesFetchSource || 'discogs';
		/** @type {boolean} The flag if using custom missing releases list from cache. */
		this.sourceCustomList = false;
		/** @type {string} The formatted source text for display (e.g., 'Discogs'). */
		this.sourceText = '';
		/** @type {number} The computed width of source text. */
		this.sourceTextW = 0;
		/** @type {number} The x-position for source text drawing. */
		this.sourceX = 0;
	}

	/**
	 * Loads missing releases view for the current artist.
	 * @returns {boolean} True if successfully initiated.
	 */
	loadMissingReleasesView() {
		if (!lib.ex.data.artist) return false;

		lib.ex.main.state.viewSaved = lib.ex.main.state.view;
		lib.ex.main.state.view = 'missingReleasesView';
		lib.ex.main.state.loadingMissingReleases = true;
		lib.ex.data.missingReleasesList = [];
		lib.ex.data.missingReleasesError = '';
		lib.ex.data.artistOrigName = lib.ex.data.artist;

		lib.ex.main.initView('missingReleasesView', lib.ex.data.metadb);

		// Try to load from cache first
		const cachedData = this.missingReleasesCacheRetrieve(lib.ex.data.artist);
		if (cachedData) {
			this.missingReleasesDisplay(cachedData);
			lib.ex.main.state.loadingMissingReleases = false;
			return true;
		}

		// No cache - fetch fresh data
		lib.ex.main.state.loadingMissingReleases = true;
		lib.ex.utils.repaintViewport();
		this.missingReleasesFetch();
		return true;
	}

	/**
	 * Caches missing releases data to JSON file.
	 * @param {Array} onlineAlbums - The array of online album objects.
	 * @param {string} cacheFile - The path to cache file.
	 */
	missingReleasesCacheIt(onlineAlbums, cacheFile) {
		const cacheData = {
			albums: onlineAlbums,
			timestamp: Date.now(),
			version: lib.ex.cache.cacheVersion
		};
		$Lib.save(cacheFile, JSON.stringify(cacheData, null, 1));
	}

	/**
	 * Retrieves cached missing releases data.
	 * @param {string} artistName - The artist name.
	 * @returns {Array|null} The array of cached albums or null if not found.
	 */
	missingReleasesCacheRetrieve(artistName) {
		const cachePath = lib.ex.cache.getCachePath('missingReleasesJson', artistName, null, {}, false, true);

		if (!$Lib.file(cachePath)) return null;

		try {
			const cacheContent = $Lib.open(cachePath);
			const cacheData = JSON.parse(cacheContent || '{}');

			if (!lib.ex.cache.isCacheValid(cacheData)) {
				console.log('Library Explorer => missingReleasesCacheRetrieve => Cache invalid/expired for', artistName, ', refetching');
				return null;
			}

			const albums = cacheData.albums || [];

			if (albums.length === 0) {
				console.log('Library Explorer => missingReleasesCacheRetrieve => Empty cache detected for', artistName, ', forcing refetch');
				libFSO.DeleteFile(cachePath, false); // Clean up bad file
				return null;
			}

			this.sourceCustomList = cachePath.includes('_custom');
			return albums;
		}
		catch (e) {
			console.log('Library Explorer => missingReleasesCacheRetrieve => Cache corrupted for', artistName, ', refetching:', e.message);
			libFSO.DeleteFile(cachePath, false); // Clean up bad file
			return null;
		}
	}

	/**
	 * Updates custom missing releases cache from edited list.
	 * @param {Array<string>} items - The array of item strings.
	 * @param {string} cachePath - The path to cache file.
	 */
	missingReleasesCacheUpdate(items, cachePath) {
		if (!items.length) {
			if ($Lib.file(cachePath)) libFSO.DeleteFile(cachePath, true);
			return;
		}

		const seen = new Set();
		const uniqueAlbums = [];

		for (const item of items) {
			const parts = item.split('|').map(p => p.trim());
			if (parts.length < 2) continue; // Need at least year|title

			const year = parts[0];
			const title = parts[1];
			const type = parts[2] || 'Album';
			const url = parts[3] || '';
			const thumbUrl = parts[4] || '';

			const ltitle = title.toLowerCase();
			if (seen.has(ltitle)) continue;
			seen.add(ltitle);
			uniqueAlbums.push({ year, title, type, url, thumbUrl });
		}

		const cacheData = { albums: uniqueAlbums, timestamp: Date.now() };
		$Lib.save(cachePath, JSON.stringify(cacheData, null, 1));
	}

	/**
	 * Displays missing releases in the grid view.
	 * @param {Array} onlineAlbums - The array of album objects to display.
	 */
	missingReleasesDisplay(onlineAlbums) {
		lib.ex.data.missingReleasesList = onlineAlbums.map(album => ({
			...album,
			mainText: `${album.year ? `${album.year} - ` : ''}${album.title}`,
			statistic: album.type || '',
			tooltipMain: false,
			tooltipStat: false,
			mainDisplay: '',
			statDisplay: '',
			fullAlbumText: album.title,
			thumbUrl: album.thumbUrl || '',
			thumb: null,
			thumbResized: null,
			thumbSize: 0,
			thumbStub: true
		}));

		lib.ex.main.setMetrics();
		lib.ex.utils.repaintColumn();
	}

	/**
	 * Fetches missing releases from the selected source.
	 */
	missingReleasesFetch() {
		const artistName = lib.ex.utils.cleanFilename(lib.ex.data.artist);
		const handles = lib.ex.data.getHandlesArtist(lib.ex.data.artist);
		const localAlbumsList = lib.ex.data.getAlbumsListFromHandles(handles);
		const localAlbums = localAlbumsList.map(alb => lib.ex.utils.cleanAlbumTitle(alb.album));

		if (this.source === 'discogs') {
			lib.ex.web.discogsFetchDiscography(artistName, localAlbums, lib.ex.cache.getCachePath('missingReleasesJson', artistName));
		}
		else if (this.source === 'lastfm') {
			lib.ex.web.lastFmFetchDiscography(artistName, localAlbums, lib.ex.cache.getCachePath('missingReleasesJson', artistName));
		}
		else if (this.source === 'musicbrainz') {
			lib.ex.web.musicBrainzFetchDiscography(artistName, localAlbums, lib.ex.cache.getCachePath('missingReleasesJson', artistName));
		}
	}

	/**
	 * Opens edit dialog for missing releases list.
	 */
	missingReleasesEdit() {
		const customCachePath = lib.ex.cache.getCachePath('missingReleasesCustomJson', lib.ex.data.artistOrigName);
		const currentList = lib.ex.data.missingReleasesList.map(
			a => `${a.year || ''}|${a.title}|${a.type || 'Album'}|${a.url || ''}|${a.thumbUrl || ''}`
		);
		const initialLocals = currentList.slice(); // For initial (reset), use current list as base

		const onComplete = () => {
			this.sourceCustomList = $Lib.file(customCachePath);
			const cacheContent = $Lib.open(customCachePath);
			const cacheDataParsed = JSON.parse(cacheContent || '{}');
			const customData = cacheDataParsed.albums || [];
			this.missingReleasesDisplay(customData);
			lib.ex.artist.setArtistViewMetrics();
			lib.ex.utils.repaintHeader();
		};

		if (!DetectWine()) {
			this.missingReleasesHtmlPopup(currentList, initialLocals, customCachePath, onComplete);
		} else {
			this.missingReleasesStandardPopup(currentList, initialLocals, customCachePath, onComplete);
		}
	}

	/**
	 * Shows HTML-based popup for editing missing releases.
	 * @param {Array<string>} currentList - The current list items.
	 * @param {Array<string>} initialLocals - The initial list for reset.
	 * @param {string} customCachePath - The path to custom cache.
	 * @param {Function} onComplete - The callback after edit.
	 */
	missingReleasesHtmlPopup(currentList, initialLocals, customCachePath, onComplete) {
		const initialLocalJson = JSON.stringify(initialLocals);

		lib.popUpBox.inputList(currentList, initialLocals, (new_cfg) => {
			if (new_cfg === '') return;

			if (new_cfg === initialLocalJson) {
				if ($Lib.file(customCachePath)) libFSO.DeleteFile(customCachePath, true);
			} else {
				const newList = JSON.parse(new_cfg);
				this.missingReleasesCacheUpdate(newList, customCachePath);
			}
			onComplete();
		}, 0, 10, `${lib.ex.data.artistOrigName} ${Unicode.MiddleDot} Missing Releases`);
	}

	/**
	 * Shows standard input box for editing missing releases.
	 * @param {Array<string>} currentList - The current list items.
	 * @param {Array<string>} initialLocals - The initial list for reset.
	 * @param {string} customCachePath - The path to custom cache.
	 * @param {Function} onComplete - The callback after edit.
	 */
	missingReleasesStandardPopup(currentList, initialLocals, customCachePath, onComplete) {
		const msg = grm.msg.getMessage('menu', 'explorerEditMissingReleases');
		grm.msg.showPopup(true, msg, msg, 'OK', null, (confirmed) => {});

		try {
			OpenFile(customCachePath);
		} catch (e) {
			OpenExplorer(`explorer /select, "${customCachePath}"`, false);
		}

		onComplete();
	}

	/**
	 * Processes Discogs API results into missing releases list.
	 * @param {Object} data - The discogs API response data.
	 * @param {Array<string>} localReleases - The array of local album names.
	 * @returns {Array<Object>} The array of missing release objects.
	 */
	processDiscogsResults(data, localReleases) {
		const missing = [];
		const seenTitles = new Set();
		const releases = data.releases || [];

		for (const release of releases) {
			if (release.type !== 'master') continue;

			const title = lib.ex.utils.cleanAlbumTitle(release.title);
			const year = release.year || '';

			if (!seenTitles.has(title) && !lib.ex.utils.isAlbumInLocalCollection(title, localReleases)) {
				missing.push({
					title: release.title,
					year,
					thumbUrl: release.thumb || '',
					url: `https://www.discogs.com${release.uri || `/${release.type}/${release.id}`}`,
					type: release.format ? release.format.join(', ') : 'Album'
				});
				seenTitles.add(title);
			}
		}

		return missing;
	}

	/**
	 * Processes Last.fm API results into missing releases list.
	 * @param {Array} topAlbums - The last.fm top albums array.
	 * @param {Array<string>} localReleases - The array of local album names.
	 * @returns {Array<Object>} The array of missing release objects.
	 */
	processLastFmResults(topAlbums, localReleases) {
		const missing = [];
		const seenTitles = new Set();

		topAlbums.forEach(album => {
			const title = lib.ex.utils.cleanAlbumTitle(album.name);
			if (title.toLowerCase() === '(null)') return; // Skip invalid

			if (!seenTitles.has(title) && !lib.ex.utils.isAlbumInLocalCollection(title, localReleases)) {
				missing.push({
					title: album.name,
					year: '', // Last.fm doesn't provide year directly in topalbums, might need additional fetch if needed
					thumbUrl: album.image && album.image[album.image.length - 1]['#text'] || '',
					url: album.url || `https://www.last.fm/music/${encodeURIComponent(lib.ex.data.artist)}/${encodeURIComponent(album.name)}`,
					type: 'Album'
				});
				seenTitles.add(title);
			}
		});

		return missing;
	}

	/**
	 * Processes MusicBrainz API results into missing releases list.
	 * @param {Array} releaseGroups - The MusicBrainz release groups array.
	 * @param {Array<string>} localReleases - The array of local album names.
	 * @returns {Array<Object>} The array of missing release objects.
	 */
	processMusicBrainzResults(releaseGroups, localReleases) {
		const missing = [];
		const seenTitles = new Set();

		releaseGroups.forEach(rg => {
			// Skip compilations only
			if (rg['secondary-types'] && rg['secondary-types'].includes('compilation')) return;

			const title = lib.ex.utils.cleanAlbumTitle(rg.title);
			const year = rg['first-release-date'] ? rg['first-release-date'].split('-')[0] : '';

			if (!seenTitles.has(title) && !lib.ex.utils.isAlbumInLocalCollection(title, localReleases)) {
				const albumData = {
					title: rg.title,
					year,
					thumbUrl: `https://coverartarchive.org/release-group/${rg.id}/front-250`,
					url: `https://musicbrainz.org/release-group/${rg.id}`,
					type: rg['primary-type'] || 'Release',
					releaseGroupId: rg.id  // Key for next fetch
				};
				missing.push(albumData);
				seenTitles.add(title);
			}
		});

		return missing;
	}
}


/**
 * The `LibExplorerSimilarArtistView` class for managing the similar artists view.
 * @class
 */
class LibExplorerSimilarArtistView {
	/**
	 * Creates a LibExplorerSimilarArtistView instance.
	 * @constructor
	 */
	constructor() {
		/** @type {string} The current view mode ('local' or 'external'). */
		this.view = libSet.explorerSimilarArtistView || 'local';
		/** @type {string} The toggle button text. */
		this.toggleText = '';
		/** @type {number} The width of the toggle button text. */
		this.toggleTextW = 0;
		/** @type {number} The X-position of the toggle button. */
		this.toggleX = 0;
		/** @type {string} The source for external similar artists. */
		this.source = libSet.explorerSimilarArtistFetchSource || 'lastfm';
		/** @type {boolean} The flag indicating if a custom source list is used. */
		this.sourceCustomList = false;
		/** @type {number} The limit for external source results. */
		this.sourceLimitExternal = libSet.explorerSimilarArtistFetchLimitExternal;
		/** @type {string} The source label text. */
		this.sourceText = '';
		/** @type {number} The width of the source label text. */
		this.sourceTextW = 0;
		/** @type {number} The X-position of the source label. */
		this.sourceX = 0;
	}


	// * GETTERS * //
	// #region GETTERS
	/** @returns {boolean} The flag indicating if similar artist view mode is local. */
	get isSimilarLocal() {
		return lib.ex.main.isSimilarArtistView && this.view === 'local';
	}

	/** @returns {boolean} The flag indicating if similar artist view mode is external. */
	get isSimilarExternal() {
		return lib.ex.main.isSimilarArtistView && this.view === 'external';
	}
	// #endregion


	/**
	 * Loads similar artist view for given artist.
	 * @param {string} artistName - The artist name.
	 * @param {number} [artistIndex] - The optional artist index for navigation.
	 * @returns {boolean} True if successfully initiated.
	 */
	loadSimilarArtistView(artistName, artistIndex = -1) {
		if (!artistName) return false;

		lib.ex.main.state.view = 'similarArtistView';
		lib.ex.main.state.artistIndex = artistIndex;
		lib.ex.data.artist = artistName;
		lib.ex.data.artistOrigName = artistName;
		lib.ex.data.similarArtistList = [];
		lib.ex.data.similarArtistError = '';
		lib.ex.data.metadb = null;

		const handles = lib.ex.data.getHandlesArtist(artistName);
		lib.ex.data.metadb = handles.Count > 0 ? handles[0] : null;
		lib.ex.main.initView('similarArtistView', lib.ex.data.metadb);

		// Try to load from cache first
		const cachedData = this.similarArtistCacheRetrieve(artistName, this.sourceCustomList);
		if (cachedData) {
			this.similarArtistProcessData(cachedData);
			return true;
		}

		// No cache - fetch fresh data
		lib.ex.main.state.loadingSimilarArtist = true;
		lib.ex.utils.repaintViewport();
		this.similarArtistFetch(artistName);
		return true;
	}

	/**
	 * Caches similar artist data to JSON file.
	 * @param {string} artistName - The artist name.
	 * @param {Array} data - The array of similar artist objects.
	 */
	similarArtistCacheData(artistName, data) {
		const cachePath = lib.ex.cache.getCachePath('similarArtistJson', artistName);

		const cacheData = {
			artists: data,
			timestamp: Date.now(),
			version: lib.ex.cache.cacheVersion
		};

		$Lib.save(cachePath, JSON.stringify(cacheData, null, 1));
	}

	/**
	 * Retrieves cached similar artist data.
	 * @param {string} artistName - The artist name.
	 * @param {boolean} [probeCustom] - The optional flag to check for custom cache first.
	 * @returns {Array|null} The array of cached artists or null if not found.
	 */
	similarArtistCacheRetrieve(artistName, probeCustom = true) {
		const cachePath = lib.ex.cache.getCachePath('similarArtistJson', artistName, null, {}, false, probeCustom);

		if (!$Lib.file(cachePath)) return null;

		try {
			const cacheContent = $Lib.open(cachePath);
			const cacheData = JSON.parse(cacheContent || '{}');

			if (!lib.ex.cache.isCacheValid(cacheData)) {
				console.log('Library Explorer => similarArtistCacheRetrieve => Cache invalid/expired for', artistName, ', refetching');
				return null;
			}

			const artists = cacheData.artists || [];

			if (artists.length === 0) {
				console.log('Library Explorer => similarArtistCacheRetrieve => Empty cache detected for', artistName, ', forcing refetch');
				libFSO.DeleteFile(cachePath, false); // Clean up bad file
				return null;
			}

			this.sourceCustomList = cachePath.includes('_custom');
			return artists;
		}
		catch (e) {
			console.log('Library Explorer => similarArtistCacheRetrieve => Cache corrupted for', artistName, ', refetching:', e.message);
			libFSO.DeleteFile(cachePath, false); // Clean up bad file
			return null;
		}
	}

	/**
	 * Updates custom similar artists cache from edited list.
	 * @param {Array<string>} items - The array of artist names.
	 * @param {string} cachePath - The path to cache file.
	 */
	similarArtistCacheUpdate(items, cachePath) {
		if (!items.length) {
			if ($Lib.file(cachePath)) libFSO.DeleteFile(cachePath, true);
			return;
		}

		const seen = new Set();
		const uniqueArtists = [];

		const newArtists = items.map((name, i, arr) => ({
			name: name.trim(),
			match: 1 - (i / (arr.length - 1 || 1)) * 0.5
		}));

		// Dedupe
		for (const artist of newArtists) {
			const lname = artist.name.toLowerCase();
			if (!seen.has(lname)) {
			seen.add(lname);
			uniqueArtists.push(artist);
			}
		}

		uniqueArtists.sort((a, b) => b.match - a.match);
		const cacheData = { artists: uniqueArtists, timestamp: Date.now(), version: lib.ex.cache.cacheVersion };
		$Lib.save(cachePath, JSON.stringify(cacheData, null, 1));
	}

	/**
	 * Opens edit dialog for similar artists list.
	 */
	similarArtistEdit() {
		const customCachePath = lib.ex.cache.getCachePath('similarArtistCustomJson', lib.ex.data.artistOrigName);
		let currentList = lib.ex.data.similarArtistList.map(a => a.name);

		if ($Lib.file(customCachePath)) {
			const cacheContent = $Lib.open(customCachePath);
			const cacheDataParsed = JSON.parse(cacheContent || '{}');
			currentList = (cacheDataParsed.artists || []).map(a => a.name);
		}

		// For initial (reset), use current list as base
		const initialLocals = currentList.slice();

		const onComplete = () => {
			this.sourceCustomList = $Lib.file(customCachePath);
			this.loadSimilarArtistView(lib.ex.data.artistOrigName, lib.ex.main.state.artistIndex);
		};

		if (!DetectWine()) {
			this.similarArtistHtmlPopup(currentList, initialLocals, customCachePath, onComplete);
		} else {
			this.similarArtistStandardPopup(currentList, initialLocals, customCachePath, onComplete);
		}
	}

	/**
	 * Fetches similar artists from the selected source.
	 * @param {string} artistName - The artist name.
	 */
	similarArtistFetch(artistName) {
		const fetchCallback = (fetchedData) => {
			try {
				if (fetchedData && fetchedData.error) {
					this.similarArtistHandleError(fetchedData.error);
					return;
				}
				this.similarArtistProcessData(fetchedData);
				this.similarArtistCacheData(artistName, fetchedData); // Cache after successful process
			}
			finally {
				lib.ex.main.state.loadingSimilarArtist = false; // Always clear loading
				lib.ex.utils.repaintViewport();
			}
		};

		if (this.sourceCustomList) {
			this.similarArtistHandleError('No custom similar artists defined. Use Edit to add.');
			return;
		}

		// Temporarily adjust limit for local mode (unlimited fetch)
		const originalLimit = this.sourceLimitExternal;
		this.sourceLimitExternal = this.isSimilarLocal ? 1000 : originalLimit;

		try {
			if (this.source === 'lastfm') {
				lib.ex.web.lastfmFetchSimilarArtist(artistName, fetchCallback);
			} else {
				lib.ex.web.listenBrainzFetchSimilarArtist(artistName, fetchCallback);
			}
		}
		finally { // Restore original for external mode
			this.sourceLimitExternal = originalLimit;
		}
	}

	/**
	 * Finds local matches for similar artists.
	 * @param {Array} similarData - The array of similar artist objects from API.
	 * @returns {Array} The array of local artist matches.
	 */
	similarArtistFindLocals(similarData) {
		const batchSize = 50;
		const artistMap = new Map();
		const locals = [];

		for (let i = 0; i < similarData.length; i += batchSize) {
			const batch = similarData.slice(i, i + batchSize);
			const batchNames = batch.map(a => a.name);
			const batchHandles = lib.ex.data.getHandlesArtists(batchNames);

			if (batchHandles.Count > 0) {
				const batchArtists = fb.TitleFormat(lib.ex.data.TF.album_artist).EvalWithMetadbs(batchHandles);

				for (let j = 0; j < batchHandles.Count; j++) {
					const artistNameLower = batchArtists[j].toLowerCase();
					if (!artistMap.has(artistNameLower)) {
						artistMap.set(artistNameLower, {
							name: batchArtists[j],
							handles: new FbMetadbHandleList(),
							similarity: 0,
							mbid: ''
						});
					}
					artistMap.get(artistNameLower).handles.Add(batchHandles[j]);
				}
			}
		}

		// Link back to original for similarity/mbid
		for (const [key, data] of artistMap) {
			const original = similarData.find(a => a.name.toLowerCase() === key);
			if (!original) continue;
			data.similarity = Math.round(original.match * 100);
			data.mbid = original.mbid || '';
			locals.push(data);
		}

		return locals;
	}

	/**
	 * Handles errors during similar artist fetching.
	 * @param {string} errorMessage - The error message to display.
	 */
	similarArtistHandleError(errorMessage) {
		lib.ex.data.similarArtistError = errorMessage;
		lib.ex.data.similarArtistList = [];
		this.sourceCustomList = false;
		lib.ex.main.state.loadingSimilarArtist = false;
		lib.ex.utils.repaintViewport();
	}

	/**
	 * Shows HTML-based popup for editing similar artists.
	 * @param {Array<string>} currentList - The current list items.
	 * @param {Array<string>} initialLocals - The initial list for reset.
	 * @param {string} customCachePath - The path to custom cache.
	 * @param {Function} onComplete - The callback after edit.
	 */
	similarArtistHtmlPopup(currentList, initialLocals, customCachePath, onComplete) {
		const initialLocalJson = JSON.stringify(initialLocals);

		lib.popUpBox.inputList(currentList, initialLocals, (new_cfg) => {
			if (new_cfg === '') return;

			if (new_cfg === initialLocalJson) {
				// Reset to original locals: delete custom if exists
				if ($Lib.file(customCachePath)) {
					libFSO.DeleteFile(customCachePath, true);
				}
			} else {
				// Save as custom override
				const newList = JSON.parse(new_cfg);
				this.similarArtistCacheUpdate(newList, customCachePath);
			}

			// Trigger reload via callback
			onComplete();
		}, 0, 10, `${lib.ex.data.artistOrigName} ${Unicode.MiddleDot} Similar Artists`);
	}

	/**
	 * Shows standard input box for editing similar artists.
	 * @param {Array<string>} currentList - The current list items.
	 * @param {Array<string>} origList - The original list for comparison.
	 * @param {string} customCachePath - The path to custom cache.
	 * @param {Function} onComplete - The callback after edit.
	 */
	similarArtistStandardPopup(currentList, origList, customCachePath, onComplete) {
		const msg = grm.msg.getMessage('menu', 'explorerEditSimilarArtists');
		grm.msg.showPopup(true, msg, msg, 'OK', null, (confirmed) => {});

		try {
			OpenFile(customCachePath);
		} catch (e) {
			OpenExplorer(`explorer /select, "${customCachePath}"`, false);
		}

		// Trigger reload via callback
		onComplete();
	}

	/**
	 * Processes fetched similar artist data for display.
	 * @param {Array} similarData - The array of similar artist objects.
	 */
	similarArtistProcessData(similarData) {
		if (!similarData || similarData.length === 0) {
			this.similarArtistHandleError('No similar artists found.');
			return;
		}

		if (this.isSimilarLocal) {
			this.similarArtistProcessDataLocals(similarData);
		} else {
			this.similarArtistProcessDataExternals(similarData);
		}

		lib.ex.main.initView('similarArtist', lib.ex.data.metadb);
		lib.ex.main.state.loadingSimilarArtist = false; // Clear loading
		lib.ex.utils.repaintViewport();
	}

	/**
	 * Processes local similar artists data.
	 * @param {Array} similarData - The array of similar artist objects.
	 */
	similarArtistProcessDataLocals(similarData) {
		let localArtists = this.similarArtistFindLocals(similarData);
		localArtists = localArtists.sort((a, b) => b.similarity - a.similarity);

		lib.ex.data.similarArtistList = localArtists.map(artist => ({
			name: artist.name,
			thumb: null,
			thumbResized: null,
			thumbSize: 0,
			thumbStub: true,
			handles: artist.handles,
			mbid: artist.mbid || '',
			similarity: artist.similarity,
			statistic: lib.ex.data.getTracksStatistic(artist.handles, lib.ex.data.getStatsSelected(), false)
		}));

		lib.ex.data.albumSummary = `${localArtists.length} local matches`;
	}

	/**
	 * Processes external similar artists data.
	 * @param {Array} similarData - The array of similar artist objects.
	 */
	similarArtistProcessDataExternals(similarData) {
		let seenLocal = new Set();

		if (similarData.length > 0) {
			const potentialNames = similarData.map(a => a.name);
			const handles = lib.ex.data.getHandlesArtists(potentialNames);
			const localNames = handles.Count > 0 ? fb.TitleFormat(lib.ex.data.TF.album_artist).EvalWithMetadbs(handles) : [];
			seenLocal = new Set([...new Set(localNames)].map(name => name.toLowerCase()));
		}

		let externalArtists = similarData
			.filter(artist => !seenLocal.has(artist.name.toLowerCase()))
			.map(artist => ({
				name: artist.name,
				thumb: null,
				thumbResized: null,
				thumbSize: 0,
				thumbStub: true,
				handles: new FbMetadbHandleList(),
				match: artist.match,
				similarity: Math.round(artist.match * 100),
				mbid: artist.mbid || '',
				statistic: lib.ex.data.getStatsSelected() === 'Similarity' ? `${Math.round(artist.match * 100)}%` : ''
			}));

		externalArtists = externalArtists.sort((a, b) => b.similarity - a.similarity);
		lib.ex.data.similarArtistList = externalArtists;
		lib.ex.data.albumSummary = `${externalArtists.length} external matches`;
	}
}


/**
 * The `LibExplorerButtons` class for managing the buttons and tabs in the explorer.
 * @class
 */
class LibExplorerButtons {
	/**
	 * Creates a LibExplorerButtons instance.
	 * @constructor
	 */
	constructor() {
		/**
		 * The tabs object for tab navigation buttons.
		 * @typedef {Object} Tabs
		 * @property {Array} list - The current tabs array.
		 * @property {number} tabsIconSize - The tab icon size.
		 * @property {number} tabsHeight - The computed tabs height.
		 * @property {number} lineH - The line height for tab text.
		 * @property {number} tabsY - The Y-position of tabs.
		 * @property {number} tabIconY - The tab icon Y position.
		 * @property {number} tabUnderlineY - The tab underline Y position.
		 * @property {Array} tabPositions - The precomputed tab positions.
		 * @property {Array} tabWidths - The precomputed tab widths.
		 * @property {number} iconPadding - The padding between icon and text.
		 * @property {Array} iconWidths - The actual measured widths of each tab icon.
		 * @property {Array} iconContentWidths - The icon width + padding for each tab.
		 * @property {boolean} showTabText - The flag to show tab text.
		 * @property {boolean} showTabIconNowPlaying - The flag to show tab icon nowplaying.
		 * @property {Array} tabTextStartX - The precomputed X positions for text start (icon + padding).
		 * @property {Array} tabMaxTextWs - The precomputed max text widths per tab.
		 * @property {Array} tabFullTextWidths - The precomputed full text widths per tab.
		 * @property {Array} tabDisplayTexts - The precomputed display texts per tab.
		 * @property {Array} tabDisplayTextWs - The precomputed display text widths per tab.
		 * @property {Array} tabNeedsTooltips - The flags if tooltip needed per tab.
		 * @property {Array} tabContentX - The array of precomputed X-positions for tab content (for even spacing).
		 * @property {Array} tabContentWidths - The array of precomputed widths for tab content (for even spacing).
		 */
		/** @type {Tabs} The tabs buttons configuration. */
		this.tabs = {
			// Content
			list: [],

			// Dimensions
			tabsIconSize: 0,
			tabsHeight: 0,
			lineH: 0,

			// Positioning
			tabsY: 0,
			tabIconY: 0,
			tabUnderlineY: 0,
			tabPositions: [],
			tabWidths: [],

			// Icon metrics
			iconPadding: 0,
			iconWidths: [],
			iconContentWidths: [],

			// Text rendering
			showTabText: libSet.explorerTabIconsOnly,
			showTabIconNowPlaying: libSet.explorerTabIconNowPlaying,
			tabTextStartX: [],
			tabMaxTextWs: [],
			tabFullTextWidths: [],
			tabDisplayTexts: [],
			tabDisplayTextWs: [],
			tabNeedsTooltips: [],

			// Even spacing
			tabContentX: [],
			tabContentWidths: []
		};

		/**
		 * The close button object.
		 * @typedef {Object} closeButton
		 * @property {number} x - The close button x-position.
		 * @property {number} y - The close button y-position.
		 * @property {number} w - The close button width.
		 * @property {number} h - The close button height.
		 * @property {boolean} show - The close button display state.
		 */
		/** @type {closeButton} Close button configuration. */
		this.closeButton = {
			x: 0,
			y: 0,
			w: 0,
			h: 0,
			display: libSet.explorerCloseButtonAlways || false,
			show: false
		};
	}

	/**
	 * Draws the close button.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawCloseButton(gr) {
		if (!this.closeButton.show && !this.closeButton.display) return;

		gr.FillSolidRect(this.closeButton.x, this.closeButton.y, this.closeButton.w, this.closeButton.h, lib.ex.color.closeBtn_bg);
		gr.DrawString(RebornSymbols.Close, lib.ex.main.font.close, lib.ex.color.closeBtn, this.closeButton.x, this.closeButton.y, this.closeButton.w, this.closeButton.h, lib.ex.main.stringFormat.center);
	}

	/**
	 * Draws all tab buttons.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawTabs(gr) {
		// Separator line
		gr.DrawLine(lib.ex.main.ui.column.x, this.tabs.tabsY, lib.ex.main.ui.column.x + lib.ex.main.ui.column.w, this.tabs.tabsY, 1, lib.ex.color.column_line);

		for (let i = 0; i < this.tabs.list.length; i++) {
			const tab = this.tabs.list[i];
			const iconGlyph = lib.ex.main.font.icons[tab] || '';
			const isHovered = i === lib.ex.control.mouse.hoveredTab;
			const contentX = this.tabs.tabContentX[i];
			const contentW = this.tabs.tabContentWidths[i];
			const displayText = this.tabs.tabDisplayTexts[i];
			const displayTextW = this.tabs.tabDisplayTextWs[i];
			const textColor = isHovered ? lib.ex.color.column_text_hovered : lib.ex.color.column_text_normal;
			const textX = contentX + this.tabs.tabTextStartX[i];
			const underLineX = contentX + contentW;

			// Icon
			if (iconGlyph) {
				gr.GdiDrawText(iconGlyph, lib.ex.main.font.rebornSymbols, textColor, contentX, this.tabs.tabIconY, this.tabs.tabsIconSize, this.tabs.tabsIconSize, lib.ex.main.stringFormat.centerEllipsis);
			}

			// Text
			if (this.tabs.showTabText && displayText) {
				gr.GdiDrawText(displayText, lib.ui.font.main, textColor, textX, this.tabs.tabIconY, displayTextW, this.tabs.tabsHeight, lib.ex.main.stringFormat.centerEllipsis);
			}

			// Hover underline
			if (isHovered) {
				gr.DrawLine(contentX, this.tabs.tabUnderlineY, underLineX, this.tabs.tabUnderlineY, 1, lib.ex.color.column_text_hovered);
			}

			// Tooltip
			if (isHovered && this.tabs.tabNeedsTooltips[i]) {
				lib.ex.tooltip.activateTooltip(tab);
			}
		}
	}

	/**
	 * Gets the list of tabs for the current view.
	 * @returns {Array<string>} The array of tab names.
	 */
	getTabs() {
		let baseTabs;

		if (lib.ex.main.isArtistView) {
			baseTabs = ['Add', 'Details', 'Links', 'Missing', 'Similar', 'Sort', 'Stats'];
		}
		else if (lib.ex.main.isAlbumView) {
			baseTabs = ['Add', 'Artist', 'Details', 'Links', 'Missing', 'Similar', 'Sort', 'Stats'];
		}
		else if (lib.ex.main.isDetailsView) {
			baseTabs = ['Add', 'Artist', 'Details', 'Links', 'Missing', 'Similar', 'Sort', 'Stats'];
		}
		else if (lib.ex.main.isMissingReleasesView) {
			baseTabs = ['Artist', 'Edit', 'Links', 'Similar'];
		}
		else if (lib.ex.main.isSimilarArtistView) {
			baseTabs = ['Add', 'Artist', 'Details', 'Edit', 'Links', 'Missing', 'Sort', 'Stats'];
		}

		// Add 'Now' button if available and album is not the same
		if (fb.IsPlaying && this.tabs.showTabIconNowPlaying && lib.ex.cache.nowPlayingMeta) {
			const { artist, album } = lib.ex.cache.nowPlayingMeta;
			const isSameAlbum = (lib.ex.main.isAlbumView && lib.ex.data.artist === artist && lib.ex.data.album === album);
			if (!isSameAlbum) baseTabs.splice(baseTabs.indexOf('Sort'), 0, 'Now');
		}

		return baseTabs.sort();
	}

	/**
	 * Gets the Y position of the tabs bar.
	 * @returns {number} The Y position.
	 */
	getTabsY() {
		return lib.ex.main.ui.mainContainer.y + lib.ex.main.ui.mainContainer.h - lib.ex.main.ui.margin +
			(lib.ex.main.state.compactMode ? lib.ex.main.ui.margin20 : 0);
	}

	/**
	 * Gets the tab index at given coordinates.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {number} The tab index or -1 if not over a tab.
	 */
	getTabIndex(x, y) {
		if (!lib.ex.utils.mouseInTabs(x, y)) return -1;

		const tabs = this.getTabs();
		const tabWidth = lib.ex.main.ui.column.w / tabs.length;
		const tabIndex = Math.floor((x - lib.ex.main.ui.column.x) / tabWidth);

		return (tabIndex >= 0 && tabIndex < tabs.length) ? tabIndex : -1;
	}

	/**
	 * Sets metrics for the close button.
	 */
	setCloseButtonMetrics() {
		this.closeButton.w = SCALE(70);
		this.closeButton.h = SCALE(35);

		const scrollbarW = SCALE(6);
		const scrollbarX = lib.ex.main.ui.column.x + lib.ex.main.ui.column.w + lib.ex.main.ui.margin30 / 2 - scrollbarW / 2;
		this.closeButton.x = scrollbarX + scrollbarW - this.closeButton.w;

		this.closeButton.y = lib.ex.main.ui.headerY - lib.ex.main.ui.margin20;
		this.closeButton.show = false;
	}

	/**
	 * Sets metrics for all tab buttons.
	 */
	setTabMetrics() {
		this.tabs.list = this.getTabs();
		this.tabs.tabsY = this.getTabsY();

		const tabsTotal = this.tabs.list.length;
		const availableH = lib.ex.main.ui.mainContainer.y + lib.ex.main.ui.mainContainer.h - this.tabs.tabsY + (lib.ex.main.state.compactMode ? lib.ex.main.ui.margin20 : 0);
		const midY = this.tabs.tabsY + availableH / 2;
		const iconPadding = lib.ex.utils.measureTextWidth(' ', lib.ex.main.font.rebornSymbols);

		const contentWidths = [];
		this.tabs.iconWidths = [];
		this.tabs.iconContentWidths = [];
		this.tabs.tabPositions = [];
		this.tabs.tabContentX = [];
		this.tabs.tabTextStartX = [];
		this.tabs.tabWidths = [];
		this.tabs.tabMaxTextWs = [];
		this.tabs.tabDisplayTexts = [];
		this.tabs.tabDisplayTextWs = [];
		this.tabs.tabNeedsTooltips = [];

		for (const tabName of this.tabs.list) {
			const icon = lib.ex.main.font.icons[tabName];
			const iconWidth = lib.ex.utils.measureTextWidth(icon, lib.ex.main.font.rebornSymbols);
			this.tabs.iconWidths.push(Math.ceil(iconWidth));
			this.tabs.iconContentWidths.push(Math.ceil(iconWidth + iconPadding));
		}

		for (let i = 0; i <= tabsTotal; i++) {
			this.tabs.tabPositions.push(Math.round(lib.ex.main.ui.column.x + i * lib.ex.main.ui.column.w / tabsTotal));
		}

		for (let i = 0; i < tabsTotal; i++) {
			this.tabs.tabWidths.push(this.tabs.tabPositions[i + 1] - this.tabs.tabPositions[i]);
		}

		const perfectEmSize = Math.ceil(lib.ex.utils.measureTextHeight(RebornSymbols.BlackSquare, lib.ex.main.font.rebornSymbols));
		this.tabs.tabsIconSize = perfectEmSize;
		this.tabs.tabsHeight = perfectEmSize;
		this.tabs.tabIconY = midY - this.tabs.tabsIconSize / 2;
		this.tabs.tabUnderlineY = this.tabs.tabIconY + this.tabs.tabsIconSize + SCALE(1);
		this.tabs.tabFullTextWidths = this.tabs.list.map(name => lib.ex.utils.measureTextWidth(name, lib.ui.font.main));

		// Dynamically decide if text should show based on space
		if (!libSet.explorerTabIconsOnly) {
			const maxTextW = this.tabs.tabWidths[0] - this.tabs.tabsIconSize - (iconPadding * 2);
			const truncatedTotal = this.tabs.tabFullTextWidths.filter(w => w > maxTextW).length;
			this.tabs.showTabText = (truncatedTotal <= tabsTotal / 2);
		}

		// Proceed with display text computation
		for (let i = 0; i < tabsTotal; i++) {
			const tabName = this.tabs.list[i];
			const tabWidth = this.tabs.tabWidths[i];
			const maxTextW = tabWidth - this.tabs.iconContentWidths[i];
			const fullTextW = this.tabs.tabFullTextWidths[i];
			const displayText = this.tabs.showTabText ? lib.ex.utils.truncateText('width', tabName, lib.ui.font.main, maxTextW) : '';
			const displayTextW = lib.ex.utils.measureTextWidth(displayText, lib.ui.font.main);
			const needsTooltip = !this.tabs.showTabText || fullTextW > maxTextW;

			this.tabs.tabTextStartX.push(this.tabs.iconContentWidths[i]);
			this.tabs.tabMaxTextWs.push(maxTextW);
			this.tabs.tabDisplayTexts.push(displayText);
			this.tabs.tabDisplayTextWs.push(displayTextW);
			this.tabs.tabNeedsTooltips.push(needsTooltip);

			contentWidths.push(this.tabs.iconContentWidths[i] + (this.tabs.showTabText ? displayTextW : 0));
		}

		// Precompute even spacing for content - mimics CSS space-between justification
		this.tabs.tabContentWidths = contentWidths;
		const contentWidthTotal = contentWidths.reduce((sum, w) => sum + w, 0);
		const leftPadding = tabsTotal === 1 ? Math.floor((lib.ex.main.ui.column.w - contentWidthTotal) / 2) : 0;
		const interGap = tabsTotal > 1 ? (lib.ex.main.ui.column.w - contentWidthTotal) / (tabsTotal - 1) : 0;
		let currentX = lib.ex.main.ui.column.x + leftPadding;

		for (const width of contentWidths) {
			this.tabs.tabContentX.push(currentX);
			currentX += width + interGap;
		}
	}
}


/**
 * The `LibExplorerCache` class for managing the caching for the explorer.
 * @class
 */
class LibExplorerCache {
	/**
	 * Creates a LibExplorerCache instance.
	 * @constructor
	 */
	constructor() {
		// Measurement cache
		/** @type {GdiBitmap|null} The cached 1x1 bitmap for text measurements. */
		this.gdiMeasureTextImg = null;

		// Artwork caching
		/** @type {number} The current state of the cache version for invalidating. */
		this.cacheVersion = 0;
		/** @type {string|null} The last album key for artwork caching. */
		this.lastAlbumForArtwork = null;
		/** @type {string|null} The last artist key for artwork caching. */
		this.lastArtistForArtwork = null;
		/** @type {string|null} The last view state for artwork caching. */
		this.lastViewForArtwork = null;
		/** @type {number|null} The last computed artwork color for reuse. */
		this.lastArtworkColor = null;
		/** @type {boolean|null} The flag if last color was derived from artwork. */
		this.lastWasFromArt = null;

		// Placeholder caching
		/** @type {Object} The cache for artist and album thumbnails to improve performance. */
		this.placeholderCache = {
			artistThumb: new Map(),
			albumThumb: new Map()
		};

		// Now playing
		/** @type {Object|null} The metadata for now-playing track (artist/album). */
		this.nowPlayingMeta = null;
	}

	/**
	 * Clears specified cache type.
	 * @param {string} type - The cache type to clear ('artwork', 'color', 'placeholder', 'thumbnail').
	 */
	clearCache(type) {
		if (type === 'artwork') {
			lib.ex.main.artwork.image = null;
			lib.ex.main.artwork.resized = null;
			lib.ex.main.artwork.cachedAlbumArtColors = [];
		}
		else if (type ==='color') {
			lib.ex.main.artwork.cachedAlbumArtColors = [];
			this.lastArtworkColor = null;
		}
		else if (type === 'placeholder') {
			this.placeholderCache.artistThumb.clear();
			this.placeholderCache.albumThumb.clear();
		}
		else if (type === 'thumbnail') {
			const items = lib.ex.utils.getGridItems();
			for (const item of items) {
				item.thumbResized = null;
				item.thumbSize = 0;
			}
		}
	}

	/**
	 * Gets the cache file path for a given type and parameters.
	 * @param {string} type - The cache type.
	 * @param {string} artistName - The artist name.
	 * @param {Object} [item] - The optional item object.
	 * @param {Object} [extra] - The extra parameters.
	 * @param {boolean} [dirOnly] - The optional flag to return directory only.
	 * @param {boolean} [probeCustom] - The optional flag to check custom cache first.
	 * @returns {string} The cache path.
	 */
	getCachePath(type, artistName, item = null, extra = {}, dirOnly = false, probeCustom = false) {
		const { index = 1, size = 'small' } = extra;

		const artist = lib.ex.utils.cleanFilename(artistName || lib.ex.data.artist || 'unknown');
		const origArtist = lib.ex.utils.cleanFilename(lib.ex.data.artistOrigName || lib.ex.data.artist || 'unknown');
		const title = item ? lib.ex.utils.cleanFilename(item.title || item.name || 'unknown') : 'unknown';

		const artworkCache = `${fb.ProfilePath}cache\\artwork\\`;
		const explorerCache = `${fb.ProfilePath}cache\\library\\explorer-cache\\`;

		const cachePaths = {
			albumCoverDir: () => {
				const album = lib.ex.utils.cleanFilename(extra.albumName || lib.ex.data.album || 'unknown');
				return `${artworkCache}local\\albums\\${artist}\\${album}\\`;
			},

			albumCover: () => {
				const album = lib.ex.utils.cleanFilename(extra.albumName || lib.ex.data.album || 'unknown');
				const sizeSuffix = extra.size || 'original';
				return `${artworkCache}local\\albums\\${artist}\\${album}\\${album}_${sizeSuffix}.jpg`;
			},

			artistImageDir: () => {
				return `${artworkCache}local\\artists\\${artist}\\`
			},

			artistImage: () => {
				const sizeSuffix = size === 'mini' ? '_mini' : size === 'thumb' ? '_thumb' : size === 'small' ? '_small' : size === 'medium' ? '_medium' : '_original';
				return `${artworkCache}local\\artists\\${artist}\\${artist}_${String(index).padStart(2, '0')}${sizeSuffix}.jpg`;
			},

			missingReleasesDir: () => {
				return `${explorerCache}missing-releases\\${artist}\\`;
			},

			missingReleasesImage: () => {
				const sourceSuffix = lib.ex.missing.sourceCustomList ? 'custom' : lib.ex.missing.source;
				return `${artworkCache}\\external\\missing-releases\\${artist}\\${sourceSuffix}\\${title}.jpg`
			},

			missingReleasesJson: () => {
				const sourceSuffix =
					lib.ex.missing.sourceCustomList ? '_custom.json' :
					lib.ex.missing.source === 'discogs' ? '_discogs.json' :
					lib.ex.missing.source === 'musicbrainz' ? '_musicbrainz.json' : '_lastfm.json';
				return `${explorerCache}missing-releases\\${artist}\\${artist}${sourceSuffix}`;
			},

			missingReleasesCustomJson: () => {
				return `${explorerCache}missing-releases\\${artist}\\${artist}_custom.json`;
			},

			popularityDir: () => {
				return `${explorerCache}popularity\\${artist}\\`;
			},

			popularityJson: () => {
				const sourceSuffix = lib.ex.web.popularityFetchSource === 'lastfm' ? '_lastfm' : '_lbrainz';
				if (lib.ex.main.isAlbumView) {
					const albumName = item ? lib.ex.utils.cleanFilename(item.album || lib.ex.data.album || 'unknown') : lib.ex.utils.cleanFilename(lib.ex.data.album || 'unknown');
					return `${explorerCache}popularity\\${artist}\\${artist} - ${albumName}${sourceSuffix}.json`;
				} else {
					return `${explorerCache}popularity\\${artist}\\${artist}_discography${sourceSuffix}.json`;
				}
			},

			similarArtistDir: () => {
				return `${explorerCache}similar-artists\\${origArtist}\\`;
			},

			similarArtistThumb: () => {
				const viewDir = lib.ex.similar.isSimilarLocal ? 'local' : 'external';
				return `${artworkCache}\\${viewDir}\\artists\\${artist}\\${artist}_thumb.jpg`;
			},

			similarArtistJson: (probeCustom) => {
				if (probeCustom) {
					const customSuffix = `_custom${lib.ex.similar.isSimilarLocal ? '_local' : '_external'}`;
					const customPath = `${explorerCache}similar-artists\\${origArtist}\\${origArtist}${customSuffix}.json`;
					if ($Lib.file(customPath)) {
						const content = $Lib.open(customPath);
						const data = JSON.parse(content || '{}');
						if (this.isCacheValid(data)) {
							return customPath;
						}
					}
				}
				// Fallback to source
				const sourceSuffix = lib.ex.similar.source === 'lastfm' ? '_lastfm' : '_lbrainz';
				const viewSuffix = lib.ex.similar.isSimilarLocal ? '_local' : `_external_${lib.ex.similar.sourceLimitExternal}`;
				return `${explorerCache}similar-artists\\${origArtist}\\${origArtist}${sourceSuffix}${viewSuffix}.json`;
			},

			similarArtistCustomJson: () => {
				const viewSuffix = lib.ex.similar.isSimilarLocal ? '_local' : '_external';
				return `${explorerCache}similar-artists\\${origArtist}\\${origArtist}_custom${viewSuffix}.json`;
			}
		};

		const cachePath = type === 'similarArtistJson' && probeCustom ? cachePaths[type](probeCustom) : cachePaths[type]();
		const dir = cachePath.replace(Regex.PathFilenameStrict, '');

		if (!dirOnly) $Lib.buildPth(dir); // Auto-build dir if not dirOnly

		return dirOnly ? dir : cachePath;
	}

	/**
	 * Gets a cached placeholder image.
	 * @param {string} type - The placeholder type ('artist' or 'album').
	 * @param {number} size - The image size.
	 * @param {string} mode - The scaling mode.
	 * @returns {GdiBitmap} The cached placeholder image.
	 */
	getCachedPlaceholder(type, size, mode) {
		const cache = type === 'artist' ? this.placeholderCache.artistThumb : this.placeholderCache.albumThumb;
		const cacheKey = `${size}_${mode}`;

		if (cache.has(cacheKey)) {
			return cache.get(cacheKey);
		}

		// Fallback resize
		const sourceImg = type === 'artist' ? libImg.no_artist_img : libImg.stub.noImg;
		const resized = lib.ex.main.getResizedImage(sourceImg, size, mode);
		cache.set(cacheKey, resized);

		return resized;
	}

	/**
	 * Gets cached popularity statistics from the cache list.
	 * @param {Array} cached - The cached popularity items.
	 */
	getCachedPopularity(cached) {
		if (!cached || cached.length === 0) return;

		if (lib.ex.main.isArtistView) {
			for (const album of lib.ex.data.albumsList) {
				const cachedItem = cached.find(c => c.name === album.album);
				if (cachedItem) {
					album.statistic = lib.ex.utils.formatNumber(cachedItem.playcount);
				}
			}
		}
		else if (lib.ex.main.isAlbumView) {
			for (const track of lib.ex.data.tracksList) {
				const cachedItem = cached.find(c => c.name === track.title);
				if (cachedItem) {
					track.statistic = lib.ex.utils.formatNumber(cachedItem.playcount);
				}
			}
		}
	}

	/**
	 * Caches popularity data for entire album or discography.
	 * @param {string} artist - The artist name.
	 * @param {string} album - The album name (for album view, null for artist view).
	 * @param {Array} items - The array of {name, playcount, type}.
	 */
	popularityCacheBatch(artist, album, items) {
		const cachePath = lib.ex.cache.getCachePath(
			'popularityJson', artist, album ? { album } : null
		);

		const cacheData = {
			items,
			timestamp: Date.now(),
			version: lib.ex.cache.cacheVersion
		};

		$Lib.save(cachePath, JSON.stringify(cacheData, null, 1));
	}

	/**
	 * Retrieves cached popularity data for album or discography.
	 * @param {string} artist - The artist name.
	 * @param {string} album - The album name (for album view, null for artist view).
	 * @returns {Array|null} The array of items or null if not cached/expired.
	 */
	popularityCacheRetrieveBatch(artist, album) {
		const cachePath = lib.ex.cache.getCachePath(
			'popularityJson', artist, album ? { album } : null
		);

		if (!$Lib.file(cachePath)) return null;

		try {
			const cacheContent = $Lib.open(cachePath);
			const cacheData = JSON.parse(cacheContent || '{}');

			if (!lib.ex.cache.isCacheValid(cacheData, 7)) {
				console.log('Library Explorer => popularityCacheRetrieveBatch => Cache expired, refetching');
				return null;
			}

			return cacheData.items || [];
		}
		catch (e) {
			console.log('Library Explorer => popularityCacheRetrieveBatch => Cache corrupted, refetching:', e.message);
			libFSO.DeleteFile(cachePath, false);
			return null;
		}
	}

	/**
	 * Checks if cached data is still valid.
	 * @param {Object} data - The cache data object with version and timestamp.
	 * @param {number} [days] - The number of days the cache remains valid.
	 * @returns {boolean} True if cache is valid.
	 */
	isCacheValid(data, days = 30) {
		if (data.version !== this.cacheVersion) return false;

		const dayInMs = 86400000;
		const cacheExpiry = dayInMs * days;

		return (Date.now() - data.timestamp) < cacheExpiry;
	}
}


/**
 * The `LibExplorerColors` class for managing the colors for the explorer interface.
 * @class
 */
class LibExplorerColors {
	/**
	 * Creates a LibExplorerColors instance.
	 * @constructor
	 */
	constructor() {
		/** @type {boolean} The state if the column background color is light. */
		this.column_bg_light = false;
		/** @type {boolean} The full theme color change in Georgia-ReBORN main on new artwork fetches. */
		this.fullThemeColorChange = libSet.explorerFullThemeColorChange || true;

		/** @type {number} The primary theme color (from art or fallback). */
		this.primary = null;
		/** @type {number} The accent color derived from primary. */
		this.accent = null;
		/** @type {number} The darkened accent color. */
		this.darkAccent = null;
		/** @type {number} The dark accent at 50% shade. */
		this.darkAccent_50 = null;
		/** @type {number} The lightened accent color. */
		this.lightAccent = null;
		/** @type {number} The light accent at 50% tint. */
		this.lightAccent_50 = null;

		/** @type {number} The background color for the explorer column. */
		this.column_bg = null;
		/** @type {number} The separator column line color. */
		this.column_line = null;
		/** @type {number} The text color for column content. */
		this.column_text_normal = null;
		/** @type {number} The text hover color for column content. */
		this.column_text_hovered = null;
		/** @type {number} The now playing text color. */
		this.column_text_playing = null;
		/** @type {number} The text selection color for column content. */
		this.column_text_selected = null;

		/** @type {number} The highlight bg color for now-playing grid rows. */
		this.grid_playing_bg = null;
		/** @type {number} The background color for selected grid rows. */
		this.grid_selection_bg = null;
		/** @type {number} The frame color for selected grid rows. */
		this.grid_selection_frame = null;
		/** @type {number} The side marker color for selected grid rows. */
		this.grid_sideMarker = null;
		/** @type {number} The normal grid title color. */
		this.grid_title_normal = null;
		/** @type {number} The hovered grid title color. */
		this.grid_title_hovered = null;
		/** @type {number} The now playing grid title color. */
		this.grid_title_playing = null;
		/** @type {number} The selected grid title color. */
		this.grid_title_selected = null;

		/** @type {number} The background color for striped rows. */
		this.row_stripes_bg = null;
		/** @type {number} The highlight bg color for now-playing rows. */
		this.row_playing_bg = null;
		/** @type {number} The background color for selected rows. */
		this.row_selection_bg = null;
		/** @type {number} The frame color for selected rows. */
		this.row_selection_frame = null;
		/** @type {number} The side marker color for selected rows. */
		this.row_sideMarker = null;
		/** @type {number} The normal row title color. */
		this.row_title_normal = null;
		/** @type {number} The hovered row title color. */
		this.row_title_hovered = null;
		/** @type {number} The now playing row title color. */
		this.row_title_playing = null;
		/** @type {number} The selected row title color. */
		this.row_title_selected = null;

		/** @type {number} The rating row stars color. */
		this.rating_star = null;
		/** @type {number} The shadow color for rating stars. */
		this.rating_star_shadow = null;

		/** @type {number} The normal scrollbar color. */
		this.sbar_normal = null;
		/** @type {number} The hovered scrollbar color. */
		this.sbar_hovered = null;
		/** @type {number} The dragged scrollbar color. */
		this.sbar_drag = null;

		/** @type {number} The close button text color. */
		this.closeBtn = null;
		/** @type {number} The close button background color. */
		this.closeBtn_bg = null;
	}

	/**
	 * Blends two colors by a given factor.
	 * @param {number} c1 - The first color.
	 * @param {number} c2 - The second color.
	 * @param {number} f - The blend factor (0-1).
	 * @returns {number} The blended color.
	 */
	blendColors(c1, c2, f) {
		c1 = [c1 >> 16 & 0xff, c1 >> 8 & 0xff, c1 & 0xff];
		c2 = [c2 >> 16 & 0xff, c2 >> 8 & 0xff, c2 & 0xff];

		const r = Math.round(c1[0] + f * (c2[0] - c1[0]));
		const g = Math.round(c1[1] + f * (c2[1] - c1[1]));
		const b = Math.round(c1[2] + f * (c2[2] - c1[2]));

		return (0xff000000 | (r << 16) | (g << 8) | (b));
	}

	/**
	 * Gets the current scrollbar color based on alpha state.
	 * @returns {number} The scrollbar color.
	 */
	getScrollbarColor() {
		const alpha = lib.ex.sbar.alphaCurrent / 255;
		return this.blendColors(this.sbar_normal, this.sbar_hovered, alpha);
	}

	/**
	 * Checks if current theme is a custom theme.
	 * @returns {boolean} True if custom theme.
	 */
	isCustomTheme() {
		return grSet.theme.startsWith('custom') || $('[%GR_THEME%]').startsWith('custom');
	}

	/**
	 * Checks if current theme is a dynamic theme.
	 * @returns {boolean} True if dynamic theme.
	 */
	isDynamicTheme() {
		return (
			((grSet.theme === 'white' || $('[%GR_THEME%]').startsWith('white')) && (!grSet.styleBlackAndWhite && !grSet.styleBlackAndWhite2))
			||
			(grSet.theme === 'black' || $('[%GR_THEME%]').startsWith('black'))
			||
			['reborn', 'random'].includes(grSet.theme)
		);
	}

	/**
	 * Checks if artwork primary color is same as current.
	 * @returns {boolean} True if colors match.
	 */
	isArtworkPrimaryColorSame() {
		// * For reborn fusion styles, always update to ensure secondary is in sync
		if (grSet.styleRebornFusion || grSet.styleRebornFusion2 || grSet.styleRebornFusionAccent) {
			return false;
		}

		return (
			(this.primary === pl.col.row_nowplaying_bg && grSet.theme !== 'random')
			||
			(this.primary === lib.ex.cache.lastArtworkColor && !lib.ex.main.artwork.needsFetch && lib.ex.cache.lastWasFromArt)
		);
	}

	/**
	 * Checks if playing album color is same as current.
	 * @returns {boolean} True if colors match.
	 */
	isPlayingAlbumColorSame() {
		if (!lib.ex.main.isAlbumOrDetailsView) return false;

		return (
			fb.IsPlaying && grm.ui.albumArt && lib.ex.cache.nowPlayingMeta
			&&
			lib.ex.data.artist === lib.ex.cache.nowPlayingMeta.artist
			&&
			lib.ex.data.album  === lib.ex.cache.nowPlayingMeta.album
		);
	}

	/**
	 * Sets colors based on current artwork.
	 */
	setArtworkColor() {
		// * Fetch custom theme colors from JSON config
		if (this.isCustomTheme()) {
			if (this.isArtworkPrimaryColorSame()) return;
			lib.ex.cache.lastArtworkColor = this.primary;
			grm.colorThemes.initThemeColors('library');
			return;
		}

		// * Shortcut for themes where primary color (pl.col.row_nowplaying_bg) is already computed from Georgia-ReBORN main
		if (fb.IsPlaying && !this.fullThemeColorChange) {
			if (this.isArtworkPrimaryColorSame()) {
				return;
			}
			this.primary = pl.col.row_nowplaying_bg;
			this.setColors();
			lib.ex.cache.lastArtworkColor = this.primary;
			lib.ex.cache.lastWasFromArt = false;
			return;
		}

		// * Save performance where possible
		if (this.isArtworkPrimaryColorSame()) return;

		// * Compute new primary color
		this.setArtworkPrimaryColor();
		this.setStyleBlend();
		this.setColors();
		lib.ex.cache.lastArtworkColor = this.primary;
		lib.ex.cache.lastWasFromArt = !lib.ex.main.isArtworkStub();
	}

	/**
	 * Sets the primary color from artwork image.
	 */
	setArtworkPrimaryColor() {
		const stub = lib.ex.main.isArtworkStub();

		if (stub) {
			this.primary = RGB(230, 230, 230);
		}
		// * Use Georgia-ReBORN's already computed primary color (pl.col.row_nowplaying_bg)
		else if (fb.IsPlaying && !this.fullThemeColorChange ||
			fb.IsPlaying && this.fullThemeColorChange && !this.isDynamicTheme() || !fb.IsPlaying && !this.isDynamicTheme()) {
			this.primary = pl.col.row_nowplaying_bg;
		}
		// * If using dynamic themes while not playing, generate a new primary color from the artwork image
		else {
			const isPlayingAlbumColorSame = this.isPlayingAlbumColorSame();
			const artworkSource = isPlayingAlbumColorSame ? grm.ui.albumArt : lib.ex.main.artwork.image;
			const artworkCache = isPlayingAlbumColorSame ? grm.ui.cachedAlbumArtColors : lib.ex.main.artwork.cachedAlbumArtColors;
			const color = grm.colorManager.getAlbumArtThemeColors(artworkSource, artworkCache, grm.colorManager.isRebornFusion());

			this.primary = color.primary;
			this.secondary = color.secondary;
		}

		// * Save performance where possible
		if (!this.fullThemeColorChange || this.fullThemeColorChange && !fb.IsPlaying || stub) {
			return;
		}

		// * Create new primary color of current viewed artwork image and pass to Georgia-ReBORN main
		lib.ex.cache.clearCache('color');
		grm.colorManager.setPrimaryColor(this.primary, this.secondary);
	}

	/**
	 * Sets all UI colors based on primary color.
	 */
	setColors() {
		if (this.isCustomTheme()) return;

		const stub = lib.ex.main.isArtworkStub();

		// * BACKGROUND * //
		this.column_bg =
			grSet.styleBlackAndWhite ? RGB(30, 30, 30) :
			grSet.styleBlackAndWhite2 ? RGB(255, 255, 255) :
			grSet.styleRebornFusionAccent ? TintColor(this.primary, 10) :
			grSet.theme === 'cream' ? RGB(247, 237, 228) :
			grSet.styleBlend && fb.IsPlaying ? RGBtoRGBA(this.primary, 128) :
			this.primary;

		this.column_bg_light = Color.LUM(this.column_bg) > LUM.Y32;

		// * PRIMARY & ACCENTS * //
		if (this.fullThemeColorChange) {
			this.primary = TintColor(this.primary, this.column_bg_light ? 10 : 5);
		}
		if (grSet.theme === 'random') {
			this.primary = pl.col.row_nowplaying_bg;
		}

		this.accent = this.column_bg_light ? ShadeColor(this.primary, 15) : TintColor(this.primary, 10);
		this.darkAccent = this.column_bg_light ? ShadeColor(this.primary, 30) : ShadeColor(this.primary, 35);
		this.darkAccent_50 = ShadeColor(this.primary, 50);
		this.lightAccent = this.column_bg_light ? ShadeColor(this.primary, 10) : TintColor(this.primary, 20);
		this.lightAccent_50 = TintColor(this.primary, 50);

		// * COLUMN * //
		this.column_line = this.column_bg_light ? ShadeColor(this.primary, 20) : TintColor(this.primary, 20);
		this.column_text_normal = this.column_bg_light ? RGB(60, 60, 60) : RGB(230, 230, 230);
		this.column_text_hovered = this.column_bg_light ? RGB(0, 0, 0) : RGB(255, 255, 255);
		this.column_text_playing = this.column_text_hovered;
		this.column_text_selected = this.column_bg_light ? RGB(0, 0, 0) : RGB(255, 255, 255);

		// * GRID - ARTIST VIEW * //
		this.grid_playing_bg = stub ? TintColor(this.column_bg, 10) : grSet.styleBlackAndWhite2 ? lib.ui.col.bg : TintColor(this.primary, 10);
		this.grid_selection_bg = this.grid_playing_bg;
		this.grid_selection_frame = this.column_line;
		this.grid_sideMarker = stub ? RGB(120, 120, 120) : this.column_bg_light ? TintColor(this.primary, 30) : TintColor(this.primary, 25);
		this.grid_title_normal = this.column_text_normal;
		this.grid_title_hovered = this.column_text_hovered;
		this.grid_title_playing = grSet.styleBlackAndWhite ? RGB(0, 0, 0) : this.column_text_playing;
		this.grid_title_selected = grSet.styleBlackAndWhite ? RGB(0, 0, 0) : this.column_text_selected;

		// * TRACK ROWS - ALBUM VIEW * //
		this.row_stripes_bg = pl.col.row_stripes_bg;
		this.row_playing_bg = grSet.styleBlackAndWhite ? RGB(230, 230, 230) : grSet.styleBlackAndWhite2 ? lib.ui.col.bg : TintColor(this.primary, 10);
		this.row_selection_bg = this.row_playing_bg;
		this.row_selection_frame = this.column_line;
		this.row_sideMarker = stub ? RGB(120, 120, 120) : this.column_bg_light ? TintColor(this.primary, 30) : TintColor(this.primary, 25);
		this.row_title_normal = this.column_text_normal;
		this.row_title_hovered = this.column_text_hovered;
		this.row_title_playing = this.column_text_playing;
		this.row_title_selected = this.column_text_selected;

		// * RATING * //
		this.rating_star = pl.col.row_rating_color;
		this.rating_star_shadow = RGBA(0, 0, 0, 100);

		// * SCROLLBAR * //
		this.sbar_normal = this.column_bg_light ? this.darkAccent : this.lightAccent;
		this.sbar_hovered = this.lightAccent_50;
		this.sbar_drag = this.lightAccent_50;

		// * BUTTONS * //
		this.closeBtn = grSet.styleBlackAndWhite ? RGB(0, 0, 0) : this.column_text_hovered;
		this.closeBtn_bg = stub ? TintColor(this.column_bg, 10) : this.column_bg_light ? ShadeColor(this.primary, 15) : TintColor(this.primary, 15);

		// * THEME & STYLES ADJUSTMENTS * //
		if (grSet.styleAlternative || grSet.styleAlternative2) {
			this.row_selection_bg = this.column_bg_light ? ShadeColor(this.primary, 15) : TintColor(this.primary, 15);
			if (grSet.styleAlternative) this.column_bg = ShadeColorOKLCH(this.column_bg, 8);
		}
		if (grSet.styleRebornFusion || grSet.styleRebornFusion2 || grSet.styleRebornFusionAccent) {
			this.row_selection_bg = TintColor(grCol.secondary, 30);
		}
	}

	/**
	 * Sets the style blend images for the album art based on current theme settings.
	 * Calculates optimal alpha and blur values, then creates the processed blend image.
	 * Only runs when grSet.styleBlend, grSet.styleBlend2, or blend progress bar is enabled.
	 * @param {GdiBitmap} [image] - The album art image to analyze.
	 * @param {Array} [cache] - The cache array for album art color extraction to avoid repeated GetColourSchemeJSON calls.
	 */
	setStyleBlend(image = lib.ex.main.artwork.image, cache = lib.ex.main.artwork.cachedAlbumArtColors) {
		if (!image || (!grSet.styleBlend && !grSet.styleBlend2 && grSet.styleProgressBarFill !== 'blend')) {
			return;
		}

		grm.colorManager.setImageLuminance(image, cache);
		grm.colorStyles.setStyleBlend(image, cache);
		grm.colorManager.setBackgroundBrightnessRules();
		grm.colorThemes.initThemeColors();
		grm.ui.initUIComponents('all');
	}

	/**
	 * Updates Georgia-ReBORN's Main and Library Explorer's primary color
	 * when full theme color change features is enabled and switching top menu panels.
	 */
	updateFullThemeColorChange() {
		if (!this.fullThemeColorChange || !lib.ex.main.state.visible) {
			return;
		}

		if (grm.ui.displayLibrary && !this.isPlayingAlbumColorSame()) {
			this.setArtworkColor();
		}
		else if (grCol.primary !== grCol.primary_saved) {
			grm.colorManager.setPrimaryColor(undefined, undefined, true);
		}
	}
}


/**
 * The `LibExplorerControls` class for managing the user input controls for the explorer.
 * @class
 */
class LibExplorerControls {
	/**
	 * Creates a LibExplorerControls instance.
	 * @constructor
	 */
	constructor() {
		/**
		 * The mouse interaction state object.
		 * @typedef {Object} MouseState
		 * @property {boolean} lbtnDn - The left mouse button down state.
		 * @property {boolean} ignoreNextSingleClick - The flag to ignore next single click after double-click.
		 * @property {number} lastX - The last mouse X position.
		 * @property {number} lastY - The last mouse Y position.
		 * @property {Object} lastPressed - The last pressed mouse position {x, y}.
		 * @property {boolean} itemDrag - The flag if an item is being dragged.
		 * @property {number} itemDragId - The ID of the dragged item.
		 * @property {Object} hoveredSnapshot - The snapshot of previous hover states for comparison.
		 * @property {number} hoveredTrack - The index of hovered track (-1 none).
		 * @property {number} hoveredAlbum - The index of hovered album/artist item (-1 none).
		 * @property {number} hoveredSubheaderGroupInfo - The index of the hovered subheader group info.
		 * @property {number} hoveredTab - The index of hovered tab (-1 none).
		 * @property {boolean} hoveredArtist - The flag if mouse hovers artist title.
		 * @property {boolean} hoveredArtistFlag - The flag if mouse hovers artist country flag.
		 * @property {boolean} hoveredAlbumTitle - The flag if mouse hovers album title.
		 * @property {boolean} hoveredAlbumSummary - The flag if mouse hovers album summary.
		 * @property {boolean} hoveredAlbumYear - The flag if mouse hovers album year.
		 * @property {boolean} hoveredAlbumRating - The flag if mouse hovers album rating stars.
		 * @property {boolean} hoveredDetailsButtonPrev - The flag for details nav prev button hover.
		 * @property {boolean} hoveredDetailsButtonNext - The flag for details nav next button hover.
		 * @property {boolean} hoveredSimilarToggle - The flag for similar artist toggle button hover.
		 * @property {boolean} hoveredSimilarSource - The flag for similar artist source button hover.
		 * @property {boolean} hoveredMissingSource - The flag for missing releases source button hover.
		 * @property {boolean} hoveredDownloadIconArtwork - The flag for artwork download icon hover.
		 * @property {number} hoveredDownloadIconGrid - The index of the hovered grid download icon (-1 none).
		 * @property {Object} mouseHoverSections - The definitions of hover sections for partial repaints.
		 * @property {Array<string>} mouseHoverSectionKeys - The flattened array of keys tracked in hover sections.
		 * @property {boolean} wheelOutsideClose: The flag for wheel close in outside content area.
		 * @property {number} wheelOutsideCloseCount - The count of quick wheel scrolls for close.
		 * @property {number} wheelOutsideCloseThreshold - The threshold (ms) for quick wheel close.
		 * @property {number} wheelLastTime - The timestamp of last wheel event.
		 */
		/** @type {MouseState} The mouse interaction and hover states. */
		this.mouse = {
			// Button state
			lbtnDn: false,
			ignoreNextSingleClick: false,

			// Position tracking
			lastX: -1,
			lastY: -1,
			lastPressed: { x: undefined, y: undefined },

			// Drag state
			itemDrag: false,
			itemDragId: -1,

			// Hover states
			hoveredSnapshot: {},
			hoveredTrack: -1,
			hoveredAlbum: -1,
			hoveredDiscHeader: -1,
			hoveredSubheaderGroupInfo: -1,
			hoveredTab: -1,
			hoveredArtist: false,
			hoveredArtistFlag: false,
			hoveredAlbumTitle: false,
			hoveredAlbumSummary: false,
			hoveredAlbumYear: false,
			hoveredAlbumRating: false,
			hoveredDetailsButtonPrev: false,
			hoveredDetailsButtonNext: false,
			hoveredSimilarToggle: false,
			hoveredSimilarSource: false,
			hoveredMissingSource: false,
			hoveredDownloadIconArtwork: false,
			hoveredDownloadIconGrid: -1,

			// Mouse hover sections
			mouseHoverSections: {
				header: [
					'hoveredArtist', 'hoveredArtistFlag',
					'hoveredAlbumTitle', 'hoveredAlbumSummary', 'hoveredAlbumYear', 'hoveredAlbumRating',
					'hoveredSimilarSource', 'hoveredMissingSource', 'hoveredSimilarToggle'
				],
				subheader:['hoveredSubheaderGroupInfo'],
				viewport: [
					'hoveredTrack', 'hoveredAlbum', 'hoveredDiscHeader',
					'hoveredDetailsButtonPrev', 'hoveredDetailsButtonNext', 'hoveredDownloadIconGrid'
				],
				tabs: ['hoveredTab']
			},

			// Wheel state
			wheelOutsideClose: libSet.explorerWheelOutsideClose,
			wheelOutsideCloseCount: 0,
			wheelOutsideCloseThreshold: 500,
			wheelLastTime: 0
		};

		this.mouse.mouseHoverSectionKeys = [
			...new Set(Object.values(this.mouse.mouseHoverSections).flat())
		];
	}


	// * CORE - CONTROLS * //
	// #region CORE - CONTROLS
	/**
	 * Switches to playlist after adding tracks.
	 */
	addTracksPlaylistSwitch() {
		if (!grSet.addTracksPlaylistSwitch) return;

		grm.button.btn.library.enabled = false;
		grm.button.btn.library.changeButtonState(ButtonState.Default);
		grm.ui.displayLibrary = false;
		grm.ui.displayPlaylist = true;

		if (!grSet.playlistAutoScrollNowPlaying) grm.ui.setPlaylistSize();

		setTimeout(() => {
			if (pl.playlist.is_scrollbar_available) {
				pl.playlist.scrollbar.scroll_to_end();
			}
		}, 500);

		window.Repaint();
	}

	/**
	 * Hides the explorer and cleans up state.
	 */
	explorerHide() {
		for (const album of lib.ex.data.albumsList) album.thumbResized = null;
		for (const artist of lib.ex.data.similarArtistList) artist.thumbResized = null;

		lib.ex.button.closeButton.show = false;
		lib.ex.main.state.visible = false;
		lib.ex.main.state.albumIndex = -1;
		lib.ex.main.state.artistIndex = -1;
		lib.ex.data.tracksList = [];
		lib.ex.data.albumsList = [];
		lib.ex.data.similarArtistList = [];
		lib.ex.main.artwork.image = null;
		lib.ex.main.artwork.resized = null;
		lib.ex.main.state.pendingThumbs.clear();
		lib.ex.main.state.pendingHttpRequests.clear();
		lib.ex.main.state.selectedIndices.clear();
		lib.ex.main.state.selectionAnchor = -1;
		lib.ex.main.state.focusedIndex = -1;

		if (lib.ex.color.fullThemeColorChange && !lib.ex.color.isArtworkPrimaryColorSame()) {
			lib.ex.cache.clearCache('color');
			grm.colorManager.setPrimaryColor(undefined, undefined, true);
		}

		lib.ex.utils.repaintExplorer();
	}

	/**
	 * Shows the explorer and initializes state.
	 */
	explorerShow() {
		lib.ex.main.state.selectedIndices.clear();
		lib.ex.main.state.selectionAnchor = -1;
		lib.ex.main.state.focusedIndex = -1;
		lib.ex.main.state.visible = true;
		lib.ex.sbar.clearScrollbarPosition();
		lib.ex.utils.repaintExplorer();
	}
	// #endregion


	// * CORE - CONTROLS - KEYBOARD * //
	// #region CORE - CONTROLS - KEYBOARD
	/**
	 * Handles arrow key navigation in album/artist views.
	 * @param {number} deltaX - The horizontal movement (-1, 0, 1).
	 * @param {number} deltaY - The vertical movement (-1, 0, 1).
	 */
	handleKeyArrowAlbumArtist(deltaX, deltaY) {
		// Get current view parameters directly
		let len;
		let cols;
		let itemH;

		if (lib.ex.main.isAlbumView) {
			len = lib.ex.data.tracksList.length;
			cols = 1;
			itemH = lib.ex.album.trackHeight;
			if (deltaY === 0) return; // Album view only uses vertical
		} else {
			len = lib.ex.main.isSimilarArtistView ? lib.ex.data.similarArtistList.length
				: lib.ex.main.isMissingReleasesView ? lib.ex.data.missingReleasesList.length
				: lib.ex.data.albumsList.length;

			cols = lib.ex.main.grid.columns;
			itemH = lib.ex.main.grid.rowH;
		}

		if (len === 0) return;

		let currentFocused = lib.ex.main.state.focusedIndex;
		if (currentFocused === undefined || isNaN(currentFocused)) currentFocused = -1;

		// Calculate new focus
		const newFocused = lib.ex.main.isAlbumView
			? (currentFocused === -1 ? (deltaY > 0 ? 0 : len - 1) : currentFocused + deltaY)
			: lib.ex.utils.getGridMovePosition(currentFocused, deltaX, deltaY, cols, len);

		if (newFocused < 0 || newFocused >= len) return;

		// Update selection
		if (utils.IsKeyPressed(VKey.SHIFT)) {
			lib.ex.utils.setRangeSelection(newFocused);
		} else {
			lib.ex.main.state.selectedIndices.clear();
			lib.ex.main.state.selectedIndices.add(newFocused);
			lib.ex.main.state.selectionAnchor = newFocused;
		}

		lib.ex.main.state.focusedIndex = newFocused;

		// Scroll to make focused item visible
		const itemY = lib.ex.main.isAlbumView ? newFocused * itemH : Math.floor(newFocused / cols) * itemH;
		lib.ex.sbar.scrollPosToMakeVisible(itemY, itemH);
		lib.ex.utils.repaintViewport();
	}

	/**
	 * Handles arrow key navigation in details view.
	 * @param {number} deltaX - The horizontal movement for track navigation.
	 * @param {number} deltaY - The vertical movement for selection.
	 */
	handleKeyArrowDetails(deltaX, deltaY) {
		if (deltaX !== 0) {
			// Left/Right: Navigate between tracks in details view
			lib.ex.details.indexCurrent = Math.max(0, Math.min(lib.ex.details.handles.length - 1, lib.ex.details.indexCurrent + deltaX));
			const newHandleList = new FbMetadbHandleList([lib.ex.details.handles[lib.ex.details.indexCurrent]]);
			lib.ex.details.loadDetailsView(newHandleList);
			lib.ex.utils.repaintColumn();
			return;
		}

		if (deltaY === 0) return;

		// Up/Down: Navigate selection in details list
		let newSel = lib.ex.details.indexSelected;
		if (newSel === -1) newSel = deltaY > 0 ? 0 : lib.ex.data.detailsList.length - 1;

		do {
			newSel += deltaY;
			if (newSel < 0 || newSel >= lib.ex.data.detailsList.length) return;
		} while (lib.ex.data.detailsList[newSel].type !== 'item');

		lib.ex.details.indexSelected = newSel;

		// Scroll to make selected item visible
		const itemY = lib.ex.data.detailsList.slice(0, newSel).reduce((sum, d) => sum + (d.height || lib.ex.album.trackHeight), 0);
		lib.ex.sbar.scrollPosToMakeVisible(itemY, lib.ex.album.trackHeight);
		lib.ex.utils.repaintViewport();
	}

	/**
	 * Handles Enter key press.
	 */
	handleKeyEnter() {
		if (lib.ex.main.isDetailsView) {
			const handles = new FbMetadbHandleList(
				lib.ex.details.indexCurrent === -1 ? lib.ex.details.handles : lib.ex.details.handles[lib.ex.details.indexCurrent]
			);
			fb.RunContextCommandWithMetadb('Properties', handles);
		}
		else if (lib.ex.main.state.focusedIndex !== -1) {
			if (lib.ex.main.isAlbumView) {
				this.handleClickPlayTrack(lib.ex.main.state.focusedIndex);
			}
			else if (lib.ex.main.isArtistView && lib.ex.main.state.focusedIndex < lib.ex.data.albumsList.length) {
				lib.ex.album.loadAlbumView(lib.ex.data.albumsList[lib.ex.main.state.focusedIndex].handles, -1);
			}
			else if (lib.ex.main.isSimilarArtistView && lib.ex.main.state.focusedIndex < lib.ex.data.similarArtistList.length) {
				lib.ex.artist.loadArtistView(lib.ex.data.similarArtistList[lib.ex.main.state.focusedIndex].handles, -1);
			}
		}
	}
	// #endregion


	// * CORE - CONTROLS - MOUSE * //
	// #region CORE - MOUSE
	/**
	 * Clears mouse hover state for artwork.
	 */
	clearMouseHoverArtwork() {
		this.mouse.hoveredDownloadIconArtwork = false;
	}

	/**
	 * Clears mouse hover state for column elements.
	 */
	clearMouseHoverColumn() {
		this.mouse.hoveredTrack = -1;
		this.mouse.hoveredAlbum = -1;
		this.mouse.hoveredArtist = false;
		this.mouse.hoveredArtistFlag = false;
		this.mouse.hoveredAlbumTitle = false;
		this.mouse.hoveredAlbumSummary = false;
		this.mouse.hoveredAlbumYear = false;
		this.mouse.hoveredAlbumRating = false;
		this.mouse.hoveredTab = -1;
		this.mouse.hoveredDetailsButtonPrev = false;
		this.mouse.hoveredDetailsButtonNext = false;
		this.mouse.hoveredDownloadIconGrid = -1;
		lib.ex.button.closeButton.show = false;
	}

	/**
	 * Gets which sections have hover changes.
	 * @param {Object} oldState - The previous hover state snapshot.
	 * @returns {Object} The object with change flags for each section.
	 */
	getMouseHoverChangesBySection(oldState) {
		const changes = {
			anyChanged: false, header: false, subheader: false, viewport: false, tabs: false
		};

		for (const [section, keys] of Object.entries(this.mouse.mouseHoverSections)) {
			for (const key of keys) {
				if (oldState[key] !== this.mouse[key]) {
					changes[section] = true;
					changes.anyChanged = true;
					break; // Early out: no need to check rest of section
				}
			}
		}

		return changes;
	}

	/**
	 * Handles click on album rating stars.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if handled.
	 */
	handleClickAlbumRating(x, y) {
		if (!this.mouse.hoveredAlbumRating || lib.ex.data.albumRating <= 0 || !lib.ex.main.isAlbumOrDetailsView) {
			return false;
		}

		const rating = Math.round(lib.ex.data.albumRating); // Snap to nearest whole for query
		const escapedRating = lib.ex.utils.escapeForQuery(rating.toString());
		const query = `${lib.ex.data.TF.rating} IS ${escapedRating}`;

		lib.panel.search.txt = query;
		lib.but.setSearchBtnsHide();
		lib.lib.upd_search = true;
		lib.lib.setNodes();
		lib.search.logHistory();
		this.explorerHide();

		return true;
	}

	/**
	 * Handles click on album summary text.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if handled.
	 */
	handleClickAlbumSummary(x, y) {
		if (lib.ex.main.isAlbumView) return false; // Only for artist or similar artist views

		const boundsX = x >= lib.ex.main.ui.column.x && x < lib.ex.main.ui.column.x + lib.ex.main.ui.headerSummaryW;
		const boundsY = y >= lib.ex.main.ui.headerAlbumY && y < lib.ex.main.ui.headerAlbumY + lib.ex.main.ui.headerLineHeight;

		if (boundsX && boundsY) {
			// Select all albums/matches
			lib.ex.main.state.selectedIndices.clear();
			const length = lib.ex.main.isSimilarArtistView ? lib.ex.data.similarArtistList.length : lib.ex.data.albumsList.length;
			for (let i = 0; i < length; i++) {
				lib.ex.main.state.selectedIndices.add(i);
			}

			lib.ex.main.state.selectionAnchor = 0;
			lib.ex.utils.repaintViewport();

			return true;  // Handled
		}

		return false;
	}

	/**
	 * Handles click on album title.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if handled.
	 */
	handleClickAlbumTitle(x, y) {
		if (lib.ex.main.isArtistView) return false;

		const albumTextMaxW = lib.ex.data.albumRating > 0 ? lib.ex.album.albumRatingX - lib.ex.main.ui.column.x : lib.ex.main.ui.durationX;
		const boundsX = x >= lib.ex.main.ui.column.x && x < lib.ex.main.ui.column.x + albumTextMaxW;
		const boundsY = y >= lib.ex.main.ui.headerAlbumY && y < lib.ex.main.ui.headerAlbumY + lib.ex.main.ui.headerLineHeight;

		if (boundsX && boundsY) {
			if (lib.ex.main.isAlbumView) {
				// Existing: Select all tracks
				lib.ex.main.state.selectedIndices.clear();
				for (let i = 0; i < lib.ex.data.tracksList.length; i++) {
					lib.ex.main.state.selectedIndices.add(i);
				}
				lib.ex.main.state.selectionAnchor = 0;
				lib.ex.utils.repaintViewport();
			}
			else if (lib.ex.main.isDetailsView) {
				const { artist, album } = lib.ex.data;
				const fullHandles = lib.ex.data.getHandlesAlbum(artist, album);

				if (fullHandles.Count > 0) {
					fullHandles.OrderByFormat(fb.TitleFormat(lib.ex.data.TF.discnumber_tracknumber), 1);
					lib.ex.details.handles = fullHandles.Convert();  // Set to full album
					lib.ex.details.indexCurrent = -1;  // Indicate aggregated (no single focus)
					lib.ex.details.loadDetailsView(fullHandles);  // Loads aggregated view ("X Selected Tracks" with totals/avgs)
					lib.ex.utils.repaintColumn();
				}
			}

			return true;  // Handled
		}

		return false;
	}

	/**
	 * Handles click on album year.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if handled.
	 */
	handleClickAlbumYear(x, y) {
		if (!this.mouse.hoveredAlbumYear || !lib.ex.main.isAlbumOrDetailsView) {
			return false;
		}

		const escapedYear = lib.ex.utils.escapeForQuery(lib.ex.data.year);
		const query = `date HAS "${escapedYear}"`;

		lib.panel.search.txt = query;
		lib.but.setSearchBtnsHide();
		lib.lib.upd_search = true;
		lib.lib.setNodes();
		lib.search.logHistory();
		this.explorerHide();

		return true;
	}

	/**
	 * Handles click on artist title.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if handled.
	 */
	handleClickArtistTitle(x, y) {
		if (lib.ex.main.isArtistView) return false;

		const artistMaxW = lib.ex.main.ui.flagSize > 0 ? lib.ex.main.ui.flagX - lib.ex.main.ui.column.x : lib.ex.main.ui.durationX - lib.ex.main.ui.flagMargin;
		const boundsX = x >= lib.ex.main.ui.column.x && x < lib.ex.main.ui.column.x + artistMaxW;
		const boundsY = y >= lib.ex.main.ui.headerArtistY && y < lib.ex.main.ui.headerArtistY + lib.ex.main.ui.headerLineHeight;

		if (boundsX && boundsY) {
			const queryArtist = lib.ex.main.isSimilarArtistView ? lib.ex.data.artistOrigName : lib.ex.data.artist;
			const handles = lib.ex.data.getHandlesArtist(queryArtist);

			if (handles.Count > 0) {
				lib.ex.artist.loadArtistView(handles, lib.ex.main.state.artistIndex);
			}
			return true;  // Handled
		}

		return false;
	}

	/**
	 * Handles click on country flag.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if handled.
	 */
	handleClickFlag(x, y) {
		if (!this.mouse.hoveredArtistFlag || lib.ex.main.ui.flagSize <= 0 || lib.ex.data.flagImgs.length === 0) {
			return false;
		}

		const country = GetMetaValues(grTF.artist_country, lib.ex.data.metadb)[0] || '';
		if (!country) return false;

		const escapedCountry = lib.ex.utils.escapeForQuery(country);
		const query = `artistcountry HAS "${escapedCountry}"`;

		lib.panel.search.txt = query;
		lib.but.setSearchBtnsHide();
		lib.lib.upd_search = true;
		lib.lib.setNodes();
		lib.search.logHistory();
		this.explorerHide();

		return true;
	}

	/**
	 * Handles click on genre/label info.
	 * @returns {boolean} True if handled.
	 */
	handleClickGroupInfo() {
		if (this.mouse.hoveredSubheaderGroupInfo !== -1) {
			const part = lib.ex.main.ui.subheaderGroupInfo[this.mouse.hoveredSubheaderGroupInfo];
			const escapedValue = lib.ex.utils.escapeForQuery(part.value);

			const query = part.type === 'label'
				? `label HAS "${escapedValue}" OR publisher HAS "${escapedValue}"`
				: `${part.type} HAS "${escapedValue}"`;

			lib.panel.search.txt = query;
			lib.but.setSearchBtnsHide();
			lib.lib.upd_search = true;
			lib.lib.setNodes();
			lib.search.logHistory();
			this.explorerHide();
			return true;
		}

		return false;
	}

	/**
	 * Plays a track from the album view.
	 * @param {number} trackIndex - The index of track to play.
	 */
	handleClickPlayTrack(trackIndex) {
		const pln = plman.ActivePlaylist;
		const handles = new FbMetadbHandleList(lib.ex.data.tracksList.map(t => t.handle));

		// * Do not clear the playlist, just play the album
		if (libSet.explorerPlaybackKeepPlaylist || libSet.actionMode === 2) {
			plman.FlushPlaybackQueue();

			for (let i = 0; i < handles.Count; i++) {
				plman.AddItemToPlaybackQueue(handles[(trackIndex + i) % handles.Count]);
			}

			fb.Play();

			// * Find track in active playlist and mark it as now playing
			setTimeout(() => {
				const nowPlaying = fb.GetNowPlaying();
				if (!nowPlaying) return;

				const idx = plman.GetPlaylistItems(plman.ActivePlaylist).Find(nowPlaying);
				if (idx === -1) return;

				pl.playlist.playing_item = pl.playlist.cnt.rows[idx];

				if (pl.playlist.playing_item) {
					pl.playlist.playing_item.is_playing = true;
					pl.playlist.playing_item.clear_title_text();
				}

				pl.playlist.repaint();
			}, 250);
		}
		// * Current playlist will be cleared, playing album added (default behavior)
		else {
			plman.ClearPlaylist(pln);
			plman.InsertPlaylistItems(pln, 0, handles);
			plman.ExecutePlaylistDefaultAction(pln, trackIndex);
		}
	}

	/**
	 * Handles click on track rating stars.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} trackIndex - The track index.
	 * @returns {boolean} True if handled.
	 */
	handleClickTrackRating(x, y, trackIndex) {
		if (!lib.ex.utils.mouseInTrackRating(x, y, trackIndex)) return false;

		const track = lib.ex.data.tracksList[trackIndex];
		const currentRating = track.rating;
		const relativeX = x - (lib.ex.main.ui.column.x + lib.ex.album.trackRatingX);  // Relative to rating area start
		const starNum = Math.floor(relativeX / lib.ex.album.starPad) + 1;  // 1-based for rating (0-4 -> 1-5)

		let command;
		if (currentRating === starNum) {
			command = '<not set>';
			track.rating = 0;
		} else {
			command = starNum;
			track.rating = starNum;
		}

		if (!Regex.WebStreaming.test(track.handle.RawPath)) {
			fb.RunContextCommandWithMetadb(`Playback Statistics/Rating/${command}`, track.handle);
		}

		const trackId = lib.ex.data.$(lib.ex.data.TF.artist_album_title, track.handle) || track.handle.RawPath;
		pl.track_ratings.set(trackId, track.rating);
		pl.playlist.update_playlist_headers();

		// Recalculate album rating
		lib.ex.data.albumRating = lib.ex.data.getAlbumRating();
		lib.ex.utils.repaintColumn();
		return true;
	}

	/**
	 * Handles close button hover state.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	handleCloseButton(x, y) {
		const oldShowClose = lib.ex.button.closeButton.show;

		lib.ex.utils.mouseInCloseButton(x, y);

		if (oldShowClose !== lib.ex.button.closeButton.show) {
			lib.ex.utils.repaintCloseButton();
		}
	}

	/**
	 * Handles download button click.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {string} type - The download type ('artwork' or 'album').
	 */
	handleDownloadButton(x, y, type) {
		if (type === 'artwork') {
			lib.ex.web.manualFetch('artwork');
		}
		else if (type === 'album') {
			const albumIndex = lib.ex.utils.getHoveredGridAlbumIndex(x, y);

			if (albumIndex !== -1) {
				const fetchType = lib.ex.main.isMissingReleasesView ? 'missingRelease' : 'thumb';
				const items = lib.ex.utils.getGridItems();
				const item = items[albumIndex];
				lib.ex.web.manualFetch(fetchType, item);
			}
		}
	}

	/**
	 * Closes the explorer or navigates back to previous view.
	 */
	handleExplorerClose() {
		if (lib.ex.main.isAlbumOrArtistView) {
			this.explorerHide();
			return;
		}

		const loadArtistView = () => {
			const handles = lib.ex.data.getHandlesArtist(lib.ex.data.artistOrigName);
			lib.ex.artist.loadArtistView(handles, lib.ex.main.state.artistIndex);
		};

		if (lib.ex.main.isMissingOrSimilarView) {
			loadArtistView();
		}
		else if (lib.ex.main.isDetailsView) {
			if (lib.ex.main.state.viewSaved === 'missingReleasesView' || lib.ex.main.state.viewSaved === 'similarArtistView') {
				loadArtistView();
			} else {
				lib.ex.main.state.view = lib.ex.main.state.viewSaved || 'albumView';
				lib.ex.main.state.viewSaved = '';
				lib.ex.utils.repaintColumn();
			}
		}
	}

	/**
	 * Handles drag and drop operations.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	handleDragDrop(x, y) {
		if (lib.ex.sbar.scrollDrag) return;

		if (!this.mouse.lbtnDn) return;

		const adjustedX = x - lib.ui.x;
		const adjustedY = y - lib.ui.y;
		const { x: lastX, y: lastY } = this.mouse.lastPressed || {};

		if (lastX === undefined || lastY === undefined) return;

		const dragDiff = libSet.touchControl ? Math.abs(adjustedX - lastX) : Math.hypot(adjustedX - lastX, adjustedY - lastY);

		if (dragDiff <= 7) return;

		if (libSet.touchControl) {
			const hovered =
				lib.ex.main.isAlbumView ? lib.ex.utils.getHoveredAlbumTrackIndex(adjustedX, adjustedY) :
				lib.ex.utils.getHoveredGridAlbumIndex(adjustedX, adjustedY);

			if (this.mouse.itemDragId !== hovered || hovered < 0) return;

			if (!lib.ex.main.state.selectedIndices.has(hovered) && !utils.IsKeyPressed(VKey.CONTROL)) {
				lib.ex.main.state.selectedIndices.clear();
				lib.ex.main.state.selectedIndices.add(hovered);
				lib.ex.main.state.selectionAnchor = hovered;
				lib.ex.utils.repaintViewport();
			}
		}

		// Reset and prepare drag
		this.mouse.itemDrag = true;
		this.mouse.lastPressed = { x: undefined, y: undefined };

		const handleList = lib.ex.data.getHandlesFromSelected();

		// Sort if needed
		if (lib.panel.multiProcess && !libSet.customSort.length) {
			handleList.OrderByFormat(lib.panel.playlistSort, 1);
		} else if (libSet.customSort.length) {
			handleList.OrderByFormat(FbTitleFormat(libSet.customSort), 1);
		}

		// Execute drag
		if (grm.ui.displayLibrarySplit()) {
			grm.ui.librarySplitDragDrop(handleList);
		} else {
			fb.DoDragDrop(0, handleList, handleList.Count ? 1 | 4 : 0);
		}

		this.mouse.itemDrag = false;
		this.mouse.lbtnDn = false;
	}

	/**
	 * Handles double-click events.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	handleDoubleClick(x, y) {
		// Double click handled in the Library Explorer
		if (lib.ex.main.state.visible) {
			this.handleDoubleClickInExplorer(x, y);
		}
		// Double click handled in the original Library tree/grid view to open the Library Explorer
		else {
			this.handleDoubleClickInLibrary(x, y);
		}
	}

	/**
	 * Handles double-click within explorer.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	handleDoubleClickInExplorer(x, y) {
		if (lib.ex.main.isAlbumView && lib.ex.control.mouse.hoveredDiscHeader !== -1) {
			lib.ex.album.handleDiscHeaderCollapse(lib.ex.control.mouse.hoveredDiscHeader);
		}
		else if (lib.ex.main.isAlbumView) {
			const trackIndex = lib.ex.utils.getHoveredAlbumTrackIndex(x, y);

			if (trackIndex !== -1) {
				if (lib.ex.utils.mouseInTrackRating(x, y, trackIndex)) {
					this.handleClickTrackRating(x, y, trackIndex);
					return;
				}
				if (lib.ex.utils.mouseInViewport(x, y)) {
					this.handleClickPlayTrack(trackIndex);
				}
			}
		}
		else if (lib.ex.main.isArtistView) {
			const albumIndex = lib.ex.utils.getHoveredGridAlbumIndex(x, y);
			if (albumIndex !== -1 && lib.ex.utils.mouseInViewport(x, y)) {
				lib.ex.album.loadAlbumView(lib.ex.data.albumsList[albumIndex].handles, -1);
			}
		}
		else if (lib.ex.main.isMissingReleasesView) {
			const albumIndex = lib.ex.utils.getHoveredGridAlbumIndex(x, y);
			if (albumIndex !== -1 && lib.ex.utils.mouseInViewport(x, y)) {
				const album = lib.ex.data.missingReleasesList[albumIndex];
				lib.ex.web.openWebsite(album.url);
			}
		}
		else if (lib.ex.main.isSimilarArtistView) {
			const artistIndex = lib.ex.utils.getHoveredGridAlbumIndex(x, y);
			if (artistIndex !== -1 && lib.ex.utils.mouseInViewport(x, y)) {
				if (lib.ex.similar.isSimilarLocal) {
					lib.ex.artist.loadArtistView(lib.ex.data.similarArtistList[artistIndex].handles, -1);
				} else { // External - open source website
					lib.ex.web.openWebsiteSimilarArtist(artistIndex);
				}
			}
		}
		else if (lib.ex.main.isDetailsView) {
			const detailIndex = lib.ex.utils.getHoveredAlbumTrackIndex(x, y);
			if (detailIndex !== -1 && lib.ex.data.detailsList[detailIndex].type === 'item' && lib.ex.utils.mouseInViewport(x, y)) {
				const currentHandles = lib.ex.details.indexCurrent === -1
					? new FbMetadbHandleList(lib.ex.details.handles)
					: new FbMetadbHandleList([lib.ex.details.handles[lib.ex.details.indexCurrent]]);
				fb.RunContextCommandWithMetadb('Properties', currentHandles);
			}
		}
	}

	/**
	 * Handles double-click in the original Library (Grid or Tree).
	 * - Grid: Uses libSet.artId to decide Artist/Album Explorer view.
	 * - Tree: Uses item.level (1=Artist, 2=Album) to decide.
	 * Called when Explorer is not visible.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	handleDoubleClickInLibrary(x, y) {
		const index = lib.pop.get_ix(x, y, true, false);
		const item = lib.pop.tree[index];

		if (index < 0 || index >= lib.pop.tree.length || item.root || item.track && !lib.panel.imgView) {
			return;
		}

		// Get tracks for the item
		const handles = lib.ex.data.getHandleListFromItem(item);
		if (handles.Count === 0) return;

		// Tree View: Level-based routing
		if (lib.ex.main.state.explorerTreeView && !lib.panel.imgView) {
			if (item.level === 1) { // Artist group
				lib.ex.artist.loadArtistView(handles, -1);
			} else if (item.level === 2) { // Album group
				lib.ex.album.loadAlbumView(handles, -1);
			}
			// Else: Falls back to normal track play - handled by original Library code
		}
		// Grid View: artId-based routing
		else if (libSet.artId === 4) {
			lib.ex.artist.loadArtistView(handles, index);
		} else {
			lib.ex.album.loadAlbumView(handles, index);
		}

		this.mouse.ignoreNextSingleClick = true; // Ignore the trailing lbtn_up
	}

	/**
	 * Handles item auto-selection on right-click before showing the context menu.
	 * Selects the clicked track or album in the column, or selects all items when right-clicking on the artwork area.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	handleRightClickSelection(x, y) {
		// Artwork area: select all items for current view
		if (lib.ex.utils.mouseInAlbumArt(x, y) && lib.ex.main.state.selectedIndices.size === 0) {
			if (lib.ex.main.isAlbumView) {
				for (let i = 0; i < lib.ex.data.tracksList.length; i++) {
					lib.ex.main.state.selectedIndices.add(i);
				}
				lib.ex.main.state.selectionAnchor = 0;
			}
			else if (lib.ex.main.isArtistView) {
				for (let i = 0; i < lib.ex.data.albumsList.length; i++) {
					lib.ex.main.state.selectedIndices.add(i);
				}
				lib.ex.main.state.selectionAnchor = 0;
			}
			return;
		}

		// Column area: select the clicked track or album
		if (lib.ex.main.isAlbumView) {
			this.handleSingleClickAlbumView(x, y);
		}
		else if (lib.ex.main.isGridView) {
			this.handleSingleClickArtistView(x, y);
		}
	}

	/**
	 * Handles single-click events.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	handleSingleClick(x, y) {
		if (lib.ex.utils.mouseInCloseButton(x, y) && lib.ex.button.closeButton.show) {
			this.handleExplorerClose();
			return;
		}

		if (lib.ex.utils.mouseInDownloadIconArtwork(x, y)) {
			this.handleDownloadButton(x, y, 'artwork');
			return;
		}
		else if (this.mouse.hoveredDownloadIconGrid !== -1) {
			this.handleDownloadButton(x, y, 'album');
			return;
		}

		if (lib.ex.utils.mouseInTabs(x, y) && this.handleTabClick(x, y)) {
			return;
		}

		if (this.handleClickArtistTitle(x, y)) {
			return;
		}
		if (this.handleClickFlag(x, y)) {
			return;
		}
		if (this.handleClickAlbumTitle(x, y)) {
			return;
		}
		if (this.handleClickAlbumYear(x, y)) {
			return;
		}
		if (this.handleClickAlbumRating(x, y)) {
			return;
		}
		else if (this.handleClickAlbumSummary(x, y)) {
			return;
		}
		else if (this.handleClickGroupInfo()) {
			return;
		}

		if (lib.ex.main.isSimilarArtistView && this.mouse.hoveredSimilarToggle) {
			libSet.explorerSimilarArtistView = lib.ex.similar.view = lib.ex.similar.isSimilarLocal ? 'external' : 'local';
			lib.ex.similar.loadSimilarArtistView(lib.ex.data.artistOrigName, lib.ex.main.state.artistIndex);
			return;
		}
		if (lib.ex.main.isSimilarArtistView && this.mouse.hoveredSimilarSource) {
			lib.ex.menu.similarArtistSourceMenu(x, y);
			return;
		}
		if (lib.ex.main.isMissingReleasesView && this.mouse.hoveredMissingSource) {
			lib.ex.menu.missingReleasesSourceMenu(x, y);
			return;
		}

		if (this.handleSingleClickDetailsView(x, y)) {
			return;
		}

		if (lib.ex.main.isAlbumView) {
			this.handleSingleClickAlbumView(x, y);
		}
		else if (lib.ex.main.isGridView) {
			this.handleSingleClickArtistView(x, y);
		}

		lib.ex.utils.repaintViewport();
	}

	/**
	 * Handles single-click in album view.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	handleSingleClickAlbumView(x, y) {
		const trackIndex = lib.ex.utils.getHoveredAlbumTrackIndex(x, y);

		if (trackIndex === -1) return;

		const ctrl = utils.IsKeyPressed(VKey.CONTROL);
		const shift = utils.IsKeyPressed(VKey.SHIFT);

		if (ctrl) {
			if (lib.ex.main.state.selectedIndices.has(trackIndex)) {
				lib.ex.main.state.selectedIndices.delete(trackIndex);
			} else {
				lib.ex.main.state.selectedIndices.add(trackIndex);
			}
		}
		else if (shift) {
			lib.ex.utils.setRangeSelection(trackIndex);
		}
		else if (lib.ex.utils.mouseInViewport(x, y)) {
			lib.ex.main.state.selectedIndices.clear();
			lib.ex.main.state.selectedIndices.add(trackIndex);
			lib.ex.main.state.selectionAnchor = trackIndex;
		}
	}

	/**
	 * Handles single-click in artist view.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	handleSingleClickArtistView(x, y) {
		const albumIndex = lib.ex.utils.getHoveredGridAlbumIndex(x, y);

		if (albumIndex === -1) return;

		const ctrl = utils.IsKeyPressed(VKey.CONTROL);
		const shift = utils.IsKeyPressed(VKey.SHIFT);

		if (ctrl) {
			if (lib.ex.main.state.selectedIndices.has(albumIndex)) {
				lib.ex.main.state.selectedIndices.delete(albumIndex);
			} else {
				lib.ex.main.state.selectedIndices.add(albumIndex);
			}
		}
		else if (shift) {
			lib.ex.utils.setRangeSelection(albumIndex);
		}
		else if (lib.ex.utils.mouseInViewport(x, y)) {
			lib.ex.main.state.selectedIndices.clear();
			lib.ex.main.state.selectedIndices.add(albumIndex);
			lib.ex.main.state.selectionAnchor = albumIndex;
		}
	}

	/**
	 * Handles single-click in details view.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if handled.
	 */
	handleSingleClickDetailsView(x, y) {
		if (!lib.ex.main.isDetailsView) return false;

		// Details nav buttons
		if (this.mouse.hoveredDetailsButtonPrev) {
			lib.ex.details.indexCurrent = Math.max(0, lib.ex.details.indexCurrent - 1);
			const newHandleList = new FbMetadbHandleList(lib.ex.details.handles[lib.ex.details.indexCurrent]);
			lib.ex.details.loadDetailsView(newHandleList);
			lib.ex.utils.repaintColumn();
			return true;
		}
		else if (this.mouse.hoveredDetailsButtonNext) {
			lib.ex.details.indexCurrent = Math.min(lib.ex.details.handles.length - 1, lib.ex.details.indexCurrent + 1);
			const newHandleList = new FbMetadbHandleList(lib.ex.details.handles[lib.ex.details.indexCurrent]);
			lib.ex.details.loadDetailsView(newHandleList);
			lib.ex.utils.repaintColumn();
			return true;
		}

		const detail = lib.ex.data.detailsList[this.mouse.hoveredTrack];

		// Handle selection for items only
		if (detail && detail.type === 'item') {
			lib.ex.details.indexSelected = this.mouse.hoveredTrack === lib.ex.details.indexSelected ? -1 : this.mouse.hoveredTrack;
			lib.ex.utils.repaintViewport();
			return true;
		}

		// Deselect if click on non-item
		if (lib.ex.details.indexSelected !== -1) {
			lib.ex.details.indexSelected = -1;
			lib.ex.utils.repaintViewport();
			return true;
		}

		return false;
	}

	/**
	 * Handles tab button clicks.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if handled.
	 */
	handleTabClick(x, y) {
		const tabs = lib.ex.button.getTabs();
		const tabIndex = Math.floor((x - lib.ex.main.ui.column.x) / (lib.ex.main.ui.column.w / tabs.length));

		if (tabIndex < 0 || tabIndex >= tabs.length) return false;

		const tabsButtonAction = {
			Add: () => {
				if (plman.IsPlaylistLocked(plman.ActivePlaylist)) {
					const msg = grm.msg.getMessage('menu', 'explorerLockedPlaylist');
					grm.msg.showPopup(false, false, msg, 'OK', false, (confirmed) => {});
					return false;
				}
				const handlesSelected = lib.ex.data.getHandlesFromSelected();
				const handles = handlesSelected.Count > 0 ? handlesSelected : lib.ex.data.getHandlesFromVisible();
				if (handles.Count <= 0) return false;
				const insertPos = plman.PlaylistItemCount(plman.ActivePlaylist);
				plman.InsertPlaylistItems(plman.ActivePlaylist, insertPos, handles);
				this.addTracksPlaylistSwitch();
				return true;
			},

			Artist: () => {
				if (lib.ex.main.isArtistView) return false;
				const queryArtist = (lib.ex.main.isSimilarArtistView) ? lib.ex.data.artistOrigName : lib.ex.data.artist;
				const artistHandles = lib.ex.data.getHandlesArtist(queryArtist);
				lib.ex.artist.loadArtistView(artistHandles, lib.ex.main.state.artistIndex);
				return true;
			},

			Album: () => {
				if (lib.ex.main.isAlbumView) return false;
				const sortedAlbums = [...lib.ex.data.albumsList].sort((a, b) => parseInt(b.year || 0) - parseInt(a.year || 0));
				if (sortedAlbums.length > 0) {
					lib.ex.album.loadAlbumView(sortedAlbums[0].handles, -1);
				}
				return true;
			},

			Missing: () => {
				if (lib.ex.main.isMissingReleasesView) return false;
				lib.ex.missing.loadMissingReleasesView();
				return true;
			},

			Similar: () => {
				if (lib.ex.main.isSimilarArtistView) return false;
				lib.ex.similar.loadSimilarArtistView(lib.ex.data.artist, lib.ex.main.state.artistIndex);
				return true;
			},

			Details: () => {
				if (lib.ex.main.isDetailsView) {
					lib.ex.main.state.view = lib.ex.main.state.viewSaved || 'albumView';
					lib.ex.main.state.viewSaved = '';
					lib.ex.details.indexCurrent = -1;
				}
				else {
					lib.ex.main.state.viewSaved = lib.ex.main.state.view;
					const handlesSelected = lib.ex.data.getHandlesFromSelected();
					const handlesAll = lib.ex.data.getHandlesForAllTracks();
					lib.ex.details.handles = handlesAll.Convert(); // Set to full album
					let loadHandles;

					// No handles: fall back to first album's tracks
					if (lib.ex.details.handles.length === 0 && lib.ex.data.albumsList.length > 0) {
						const firstAlbum = lib.ex.data.albumsList[0];
						lib.ex.details.handles = firstAlbum.handles.Convert();
					}
					// No selection: start at first track
					if (handlesSelected.Count === 0) {
						lib.ex.details.indexCurrent = 0;
						loadHandles = new FbMetadbHandleList([lib.ex.details.handles[0]]);
					}
					// Single selection
					else if (handlesSelected.Count === 1) {
						lib.ex.details.indexCurrent = lib.ex.details.handles.findIndex(h => h.Compare(handlesSelected[0]));
						loadHandles = new FbMetadbHandleList([handlesSelected[0]]);
					}
					// Multi-selection: aggregated 'All' mode by default
					else {
						lib.ex.details.indexCurrent = -1;
						loadHandles = handlesSelected;
					}

					lib.ex.main.state.view = 'detailsView';
					lib.ex.details.loadDetailsView(loadHandles);
				}
				lib.ex.utils.repaintColumn();

				return true;
			},

			Edit: () => {
				if (lib.ex.main.isMissingReleasesView) {
					lib.ex.missing.missingReleasesEdit();
					return true;
				} else if (lib.ex.main.isSimilarArtistView) {
					lib.ex.similar.similarArtistEdit();
					return true;
				}
				return false;
			},

			Now: () => {
				return lib.ex.album.showNowPlaying()
			},

			Links: () => {
				const handles = lib.ex.data.getHandlesFromSelected();
				const metadb = handles.Count > 0 ? handles[0] : lib.ex.data.metadb;
				if (!metadb) return false;
				lib.ex.menu.linksMenu(x, y, metadb);
				return true;
			},

			Sort: () => {
				lib.ex.menu.sortMenu(x, y);
				return true;
			},

			Stats: () => {
				lib.ex.menu.statsMenu(x, y);
				return true;
			}
		};

		const tabName = tabs[tabIndex];
		return tabsButtonAction[tabName]();
	}

	/**
	 * Handles mouse wheel scrolling.
	 * @param {number} step - The scroll step amount.
	 */
	handleWheel(step) {
		const now = Date.now();
		const x = this.mouse.lastX;
		const y = this.mouse.lastY;

		// Cycle artwork images in large artwork container
		if (lib.ex.utils.mouseInAlbumArt(x, y) && lib.ex.main.artwork.currentImages.length > 1) {
			const canScrollUp = step > 0 && lib.ex.main.artwork.currentIndex > 0;
			const canScrollDown = step < 0 && lib.ex.main.artwork.currentIndex < lib.ex.main.artwork.currentImages.length - 1;

			if (canScrollUp || canScrollDown) {
				lib.ex.main.artworkCycleImage(step > 0 ? -1 : 1);
			}

			this.mouse.wheelOutsideCloseCount = 0;
			return;
		}

		// Details view track scroll
		if (lib.ex.main.isDetailsView && lib.ex.utils.mouseInViewport(x, y)) {
			const delta = step > 0 ? -1 : 1;
			lib.ex.details.indexCurrent = Math.max(0, Math.min(lib.ex.details.handles.length - 1, lib.ex.details.indexCurrent + delta));

			const newHandleList = new FbMetadbHandleList(lib.ex.details.handles[lib.ex.details.indexCurrent]);
			lib.ex.details.loadDetailsView(newHandleList);
			lib.ex.utils.repaintColumn();

			this.mouse.wheelOutsideCloseCount = 0;
			return;
		}

		// Normal scroll inside viewport
		if (lib.ex.utils.mouseInViewport(x, y)) {
			const itemH = lib.ex.main.isAlbumView ? lib.ex.album.trackHeight : lib.ex.main.grid.rowH;
			const delta = -step * itemH * lib.ex.sbar.scrollStep;
			lib.ex.sbar.scrollSmoothTo(lib.ex.sbar.scrollTarget + delta);

			this.mouse.wheelOutsideCloseCount = 0;
			return;
		}

		// Outside scroll close: Check for quick consecutive wheels
		const wheelClose = this.mouse.wheelOutsideClose && (
			now - this.mouse.wheelLastTime < this.mouse.wheelOutsideCloseThreshold
		);

		if (wheelClose) {
			this.mouse.wheelOutsideCloseCount++;
			if (this.mouse.wheelOutsideCloseCount >= 2) {
				this.explorerHide();
				this.mouse.wheelOutsideCloseCount = 0;
				return;
			}
		} else {
			this.mouse.wheelOutsideCloseCount = 1;
		}

		this.mouse.wheelLastTime = now;
	}

	/**
	 * Updates mouse hover state for artwork.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if state changed.
	 */
	updateMouseHoverArtwork(x, y) {
		const oldState = this.mouse.hoveredDownloadIconArtwork;
		this.mouse.hoveredDownloadIconArtwork = lib.ex.utils.mouseInDownloadIconArtwork(x, y);

		if (oldState !== this.mouse.hoveredDownloadIconArtwork) {
			lib.ex.utils.repaintArtwork();
			return true;
		}

		return false;
	}

	/**
	 * Updates mouse hover state for header elements.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	updateMouseHoverHeader(x, y) {
		this.mouse.hoveredArtist = lib.ex.utils.mouseInArtistName(x, y);
		this.mouse.hoveredArtistFlag = lib.ex.utils.mouseInArtistFlag(x, y);
		this.mouse.hoveredAlbumTitle = lib.ex.main.isAlbumOrDetailsView && lib.ex.utils.mouseInAlbumTitle(x, y);
		this.mouse.hoveredAlbumSummary = lib.ex.main.isGridView && lib.ex.utils.mouseInAlbumSummary(x, y);
		this.mouse.hoveredAlbumYear = lib.ex.main.isAlbumOrDetailsView && lib.ex.utils.mouseInAlbumYear(x, y);
		this.mouse.hoveredAlbumRating = lib.ex.main.isAlbumOrDetailsView && lib.ex.utils.mouseInAlbumRating(x, y);
		this.mouse.hoveredMissingSource = lib.ex.main.isMissingReleasesView && lib.ex.utils.mouseInMissingReleasesSource(x, y);
		this.mouse.hoveredSimilarToggle = lib.ex.main.isSimilarArtistView && lib.ex.utils.mouseInSimilarArtistToggle(x, y);
		this.mouse.hoveredSimilarSource = lib.ex.main.isSimilarArtistView && lib.ex.utils.mouseInSimilarArtistSource(x, y);
	}

	/**
	 * Updates mouse hover state for subheader elements.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	updateMouseHoverSubheader(x, y) {
		this.mouse.hoveredSubheaderGroupInfo = -1;

		if (!lib.ex.main.isAlbumOrDetailsView || !lib.ex.utils.mouseInSubheader(x, y)) {
			return;
		}

		const relativeX = x - lib.ex.main.ui.column.x;
		const fullInfoW = lib.ex.utils.measureTextWidth(lib.ex.data.infoText, lib.ui.font.main);
		const displayedW = Math.min(fullInfoW, lib.ex.main.ui.subheaderMaxInfoW);

		if (relativeX >= displayedW || !lib.ex.main.ui.subheaderGroupInfoCumulW) {
			return;
		}

		for (let i = 0; i < lib.ex.main.ui.subheaderGroupInfoCumulW.length; i++) {
			const cumul = lib.ex.main.ui.subheaderGroupInfoCumulW[i];
			const partW = lib.ex.main.ui.subheaderGroupInfoW[i];

			if (relativeX >= cumul && relativeX < cumul + partW) {
				this.mouse.hoveredSubheaderGroupInfo = i;
				break;
			}
		}
	}

	/**
	 * Updates mouse hover state for viewport elements.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	updateMouseHoverViewport(x, y) {
		this.mouse.hoveredTrack = lib.ex.main.isAlbumOrDetailsView ? lib.ex.utils.getHoveredAlbumTrackIndex(x, y) : -1;
		this.mouse.hoveredAlbum = lib.ex.main.isGridView ? lib.ex.utils.getHoveredGridAlbumIndex(x, y) : -1;
		this.mouse.hoveredDiscHeader = lib.ex.main.isAlbumView ? lib.ex.utils.getHoveredDiscHeaderIndex(x, y) : -1;
		this.mouse.hoveredTab = lib.ex.button.getTabIndex(x, y);
		this.mouse.hoveredDownloadIconGrid = lib.ex.utils.getHoveredGridDownloadIconIndex(x, y);

		// Handle details view special cases
		if (lib.ex.main.isDetailsView && this.mouse.hoveredTrack !== -1) {
			const item = lib.ex.data.detailsList[this.mouse.hoveredTrack];
			if (item.type === 'section') {
				// Don't set to -1, keep for nav hover
			} else if (item.type !== 'item') {
				this.mouse.hoveredTrack = -1;
			}
		}
	}

	/**
	 * Updates mouse hover state for details view buttons.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	updateMouseHoverDetailsButton(x, y) {
		this.mouse.hoveredDetailsButtonPrev = false;
		this.mouse.hoveredDetailsButtonNext = false;

		if (lib.ex.main.isDetailsView && this.mouse.hoveredTrack === 0) {
			if (lib.ex.utils.mouseInDetailsButton(x, y, 'prev')) {
				this.mouse.hoveredDetailsButtonPrev = true;
			}
			else if (lib.ex.utils.mouseInDetailsButton(x, y, 'next')) {
				this.mouse.hoveredDetailsButtonNext = true;
			}
		}
	}

	/**
	 * Updates all mouse hover states for column.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	updateMouseHoverColumn(x, y) {
		const oldState = this.mouse.hoveredSnapshot;

		for (const key of this.mouse.mouseHoverSectionKeys) {
			oldState[key] = this.mouse[key];
		}

		this.updateMouseHoverHeader(x, y);
		this.updateMouseHoverSubheader(x, y);
		this.updateMouseHoverViewport(x, y);
		this.updateMouseHoverDetailsButton(x, y);

		const {
			anyChanged, header, subheader, viewport, tabs
		} = this.getMouseHoverChangesBySection(oldState);

		if (!anyChanged) return;
		if (header) lib.ex.utils.repaintHeader();
		if (subheader) lib.ex.utils.repaintSubheader();
		if (viewport) lib.ex.utils.repaintViewport();
		if (tabs) lib.ex.utils.repaintTabs();
	}
	// #endregion
}


/**
 * The `LibExplorerData` class for managing the data and metadata for the explorer.
 * @class
 */
class LibExplorerData {
	/**
	 * Creates a LibExplorerData instance.
	 * @constructor
	 */
	constructor() {
		// Core metadata
		/** @type {FbMetadbHandle|null} The current metadata handle for the view. */
		this.metadb = null;
		/** @type {string} The current artist name. */
		this.artist = '';
		/** @type {string} The original artist name (for similar views). */
		this.artistOrigName = '';
		/** @type {string} The current album name. */
		this.album = '';
		/** @type {string} The album release year. */
		this.year = '';

		// Album stats
		/** @type {number} The total duration of the album in seconds. */
		this.albumLength = 0;
		/** @type {number} The average rating of the album (0-5). */
		this.albumRating = 0;
		/** @type {number}  The number of discs in the album. */
		this.albumTotalDiscs = 1;
		/** @type {string} The summary string for artist view (e.g., "5 albums • 42 tracks"). */
		this.albumSummary = '';

		// Categorical data
		/** @type {string} The album genre(s), formatted with bullets. */
		this.genre = '';
		/** @type {string} The album label(s), formatted with bullets. */
		this.label = '';
		/** @type {string} The combined info string (genre/label). */
		this.infoText = '';
		/** @type {string} The formatted codec info. */
		this.codec = '';
		/** @type {string} The error message for missing releases fetching. */
		this.missingReleasesError = '';
		/** @type {string} The error on similar artist fetching. */
		this.similarArtistError = '';

		// Lists
		/** @type {Array} The array of track objects for album view. */
		this.tracksList = [];
		/** @type {Array} The array of album objects for artist view. */
		this.albumsList = [];
		/** @type {Array} The array of missing releases objects for missing view. */
		this.missingReleasesList = [];
		/** @type {Array} The array of similar artist objects. */
		this.similarArtistList = [];
		/** @type {Array} The list of details items for details view (sections/items/spacers). */
		this.detailsList = [];

		/** @type {string[]} The list of genres for the currently selected item. */
		this.genres = [];
		/** @type {string[]} The list of labels for the currently selected item. */
		this.labels = [];
		/** @type {Array} The array of country flag images. */
		this.flagImgs = [];

		// Sort directions
		/** @type {string} The sort direction for album view ('ASC' or 'DSC'). */
		this.sortDirAlbum = libSet.explorerSortDirAlbum || 'ASC';
		/** @type {string} The sort direction for artist view ('ASC' or 'DSC'). */
		this.sortDirArtist = libSet.explorerSortDirArtist || 'ASC';
		/** @type {string} The sort direction for similar artists view ('ASC' or 'DSC'). */
		this.sortDirSimilar = libSet.explorerSortDirSimilar || 'DSC';

		// Sort types
		/** @type {string} The sort type for album view (e.g., 'Track number'). */
		this.sortTypeAlbum = libSet.explorerSortAlbum || 'Track number';
		/** @type {string} The sort type for artist view (e.g., 'Year'). */
		this.sortTypeArtist = libSet.explorerSortArtist || 'Year';
		/** @type {string} The sort type for similar artists view (e.g., 'Similarity'). */
		this.sortTypeSimilar = libSet.explorerSortSimilar || 'Similarity';

		// Stats configuration
		/** @type {Array} The array of available stats types (e.g., 'bitrate', 'playcount'). */
		this.stats = [
			'bitrate', 'duration', 'size', 'rating', 'playcount', 'popularity', 'trackcount',
			'queue', 'date', 'firstPlayed', 'lastPlayed', 'added', 'none'
		];
		/** @type {string} The selected stat for album view (e.g., 'playcount'). */
		this.statsSelectedAlbum = libSet.explorerStatsAlbum || 'playcount';
		/** @type {string} The selected stat for artist view (e.g., 'rating'). */
		this.statsSelectedArtist = libSet.explorerStatsArtist || 'rating';
		/** @type {string} The selected stat for similar artists view (e.g., 'rating'). */
		this.statsSelectedSimilar = libSet.explorerStatsSimilar || 'rating';

		// Meta
		/** @type {Object} The Library Explorer titleformat strings. */
		this.TF = {
			// Core track/album identity
			artist: '%artist%',
			album_artist: '$if3(%album artist%, %artist%, %composer%)',
			album: `[%album%][ '['${grTF.album_translation}']']`,
			title: grTF.title,
			date: grTF.date,
			artist_album_title: `${grTF.artist} - [%album%][ '['${grTF.album_translation}']'] - ${grTF.title}`,
			disc_header: `$ifgreater(%totaldiscs%,1,[Disc %discnumber% $if(${grTF.disc_subtitle}, ${Unicode.EmDash} ,) ],)[${grTF.disc_subtitle}]`,

			// Categorical
			genre: '[$meta_sep(genre, · )]',
			label: '[$if($meta(label),$meta_sep(label, · ),$if3(%publisher%,%discogs_label%,))]',

			// Playback stats
			rating: '%rating%',
			popularity: '%popularity%',

			// Structure
			totaldiscs: '[%totaldiscs%]',
			discnumber: '$if(%discsubtitle%,[Disc %discnumber% – ]%discsubtitle%)',
			tracknumber:'$pad(%tracknumber%,2,0)',
			tracknumber_raw: '[%tracknumber%]',
			discnumber_tracknumber: '%discnumber%|%tracknumber%',

			// Audio technical
			bitrate: '%bitrate%',
			length_seconds_fp: '%length_seconds_fp%',
			path_filesize: '%path%|%filesize%',
			codec: '%codec%',
			bitspersample: '$info(bitspersample)',
			samplerate: '$info(samplerate)',
			channel_mode: '$info(channel_mode)'
		};
	}


	// * DATA - META * //
	// #region DATA - META
	/**
	 * Formats a title and returns the result.
	 * @param {string} titleFormatString - The title format string to evaluate.
	 * @param {FbMetadbHandle|FbMetadbHandleList} [metadb] - The handle(s) to evaluate with (single or list).
	 * @param {boolean} [force] - The optional force evaluate (for no metadbs).
	 * @returns {string|Array<string>} The formatted title(s) or error message(s).
	 */
	$(titleFormatString, metadb = undefined, force = false) {
		try {
			const tf = fb.TitleFormat(titleFormatString);
			return metadb ? typeof metadb.Count === 'undefined' ? tf.EvalWithMetadb(metadb) : tf.EvalWithMetadbs(metadb) : tf.Eval(force);
		}
		catch (e) {
			const msg = `${e.message || e} (Invalid metadb!)`;
			return metadb ? typeof metadb.Count === 'undefined' ? msg : new Array(metadb.Count).fill(msg) : msg;
		}
	}

	/**
	 * Sets the album summary text (e.g., "5 albums • 42 tracks • 1990-2024").
	 */
	getAlbumSummary() {
		let totalTracks = 0;
		const years = this.albumsList.map(album => parseInt(album.year) || 0).filter(y => y > 0);
		const minYear = years.length > 0 ? Math.min(...years) : '';
		const maxYear = years.length > 0 ? Math.max(...years) : '';

		for (const album of this.albumsList) {
			totalTracks += album.handles.Count;
		}

		const trackStr = `${totalTracks} ${totalTracks === 1 ? 'track' : 'tracks'}`;
		const yearStr = years.length > 0 ? (minYear === maxYear ? `${minYear}` : `${minYear} ${Unicode.EmDash} ${maxYear}`) : '';
		const parts = [`${this.albumsList.length} ${this.albumsList.length === 1 ? 'album' : 'albums'}`];

		if (totalTracks > 0) parts.push(trackStr);
		if (yearStr) parts.push(yearStr);

		this.albumSummary = parts.join(` ${Unicode.MiddleDot} `);
	}

	/**
	 * Gets average album rating from tracks.
	 * @returns {number} The average rating (0-5).
	 */
	getAlbumRating() {
		let totalRating = 0;
		let trackCount = 0;

		for (const track of this.tracksList) {
			if (track.rating > 0) {
				totalRating += track.rating;
				trackCount++;
			}
		}

		return trackCount > 0 ? totalRating / trackCount : 0;
	}

	/**
	 * Gets average album rating from handle list.
	 * @param {FbMetadbHandleList} handles - The track handles.
	 * @returns {number} The average rating (0-5).
	 */
	getAlbumRatingFromHandles(handles) {
		if (handles.Count === 0) return 0;

		const ratings = this.$(this.TF.rating, handles);
		const validRatings = ratings.filter(r => r > 0);

		return validRatings.length ? validRatings.reduce((a, b) => a + b, 0) / validRatings.length : 0;
	}

	/**
	 * Gets albums list from handles.
	 * @param {FbMetadbHandleList} handles - The track handles.
	 * @returns {Array} The array of album objects.
	 */
	getAlbumsListFromHandles(handles) {
		const albumMap = new Map();
		const albumMeta = this.$(this.TF.album, handles);
		const yearMeta = this.$(this.TF.date, handles);

		for (let i = 0; i < handles.Count; i++) {
			const key = `${albumMeta[i]}|${yearMeta[i]}`;
			if (!albumMap.has(key)) {
				albumMap.set(key, { album: albumMeta[i], year: yearMeta[i], handles: new FbMetadbHandleList(), metadb: handles[i] });
			}
			albumMap.get(key).handles.Add(handles[i]);
		}

		// * Filter out raw CD image file when both the image (no tracknumber) and CUE virtual tracks are present in the library.
		for (const [key, entry] of albumMap) {
			const withTrackNum = entry.handles.Convert().filter(h => this.$(this.TF.tracknumber_raw, h) !== '');
			if (withTrackNum.length > 0) {
				entry.handles = new FbMetadbHandleList(withTrackNum);
			}
		}

		return Array.from(albumMap.values()).sort((a, b) => a.year.localeCompare(b.year));
	}

	/**
	 * Gets handle list from a library tree item.
	 * @param {Object} item - The library tree item.
	 * @returns {FbMetadbHandleList} The handle list.
	 */
	getHandleListFromItem(item) {
		const handles = new FbMetadbHandleList();
		const tracksTotal = lib.pop.range(item.item);

		for (const tracks of tracksTotal) {
			if (tracks >= lib.panel.list.Count) continue;
			handles.Add(lib.panel.list[tracks]);
		}

		return handles;
	}

	/**
	 * Gets handles for all tracks in current album view.
	 * @returns {FbMetadbHandleList} The handle list.
	 */
	getHandlesForAllTracks() {
		const handles = new FbMetadbHandleList();

		for (const tracks of this.tracksList) {
			if (tracks >= this.tracksList.length) continue;
			handles.Add(tracks.handle);
		}

		return handles;
	}

	/**
	 * Gets handles for an artist.
	 * @param {string} artistName - The artist name.
	 * @returns {FbMetadbHandleList} The handle list.
	 */
	getHandlesArtist(artistName) {
		const query = `"${this.TF.album_artist}" IS "${lib.ex.utils.escapeForQuery(artistName)}"`;
		return fb.GetQueryItems(fb.GetLibraryItems(), query);
	}

	/**
	 * Gets handles for multiple artists.
	 * @param {Array<string>} artistNames - The array of artist names.
	 * @returns {FbMetadbHandleList} The handle list.
	 */
	getHandlesArtists(artistNames) {
		const escaped = artistNames.map(name => lib.ex.utils.escapeForQuery(name));
		const query = escaped.map(n => `"${this.TF.album_artist}" IS "${n}"`).join(' OR ');
		return fb.GetQueryItems(fb.GetLibraryItems(), query);
	}

	/**
	 * Gets handles for an album.
	 * @param {string} artist - The artist name.
	 * @param {string} album - The album name.
	 * @returns {FbMetadbHandleList} The handle list.
	 */
	getHandlesAlbum(artist, album) {
		const safeArtist = lib.ex.utils.escapeForQuery(artist);
		const safeAlbum = lib.ex.utils.escapeForQuery(album);
		const query = `"${this.TF.album_artist}" IS "${safeArtist}" AND "${this.TF.album}" IS "${safeAlbum}"`;
		return fb.GetQueryItems(fb.GetLibraryItems(), query);
	}

	/**
	 * Gets handles from currently selected items.
	 * @returns {FbMetadbHandleList} The handle list.
	 */
	getHandlesFromSelected() {
		const handles = new FbMetadbHandleList();

		if (lib.ex.main.isAlbumView) {
			for (const index of lib.ex.main.state.selectedIndices) {
				if (index >= this.tracksList.length) continue;
				handles.Add(this.tracksList[index].handle);
			}
		}
		else if (lib.ex.main.isArtistView) {
			for (const index of lib.ex.main.state.selectedIndices) {
				if (index >= this.albumsList.length) continue;
				const albHandles = this.albumsList[index].handles;
				handles.AddRange(albHandles);
			}
		}
		else if (lib.ex.main.isSimilarArtistView) {
			for (const index of lib.ex.main.state.selectedIndices) {
				if (index >= this.similarArtistList.length) continue;
				const artHandles = this.similarArtistList[index].handles;
				handles.AddRange(artHandles);
			}
		}

		return handles;
	}

	/**
	 * Gets handles from all visible items in current view.
	 * @returns {FbMetadbHandleList} The handle list.
	 */
	getHandlesFromVisible() {
		const handles = new FbMetadbHandleList();

		if (lib.ex.main.isAlbumView) {
			return this.getHandlesForAllTracks();
		}

		if (lib.ex.main.isArtistView) {
			for (const album of this.albumsList) {
				handles.AddRange(album.handles);
			}
		}

		return handles;
	}

	/**
	 * Gets tracks list from handles.
	 * @param {FbMetadbHandleList} handles - The track handles.
	 * @returns {Array} The array of track objects.
	 */
	getTracksFromHandles(handles) {
		if (handles.Count === 0) return [];

		const tracks = [];
		const trackArtists = this.$(this.TF.artist, handles);
		const albumArtists = this.$(this.TF.album_artist, handles);
		const titles = this.$(this.TF.title, handles);
		const ratings = this.$(this.TF.rating, handles);

		for (let i = 0; i < handles.Count; i++) {
			tracks.push({
				handle: handles[i],
				index: i,
				trackArtist: trackArtists[i],
				albumArtist: albumArtists[i],
				title: titles[i],
				statistic: this.getTracksStatistic(new FbMetadbHandleList(handles[i]), this.getStatsSelected()),
				rating: Number(ratings[i]) || 0,
				duration: utils.FormatDuration(handles[i].Length)
			});
		}

		return tracks;
	}

	/**
	 * Gets timestamp from handles for a given format.
	 * @param {FbMetadbHandleList} handles - The track handles.
	 * @param {string} tf - The title format string.
	 * @param {boolean} [isMin] - The optional flag to get minimum or maximum timestamp.
	 * @returns {number} The timestamp in milliseconds.
	 */
	getTimestamp(handles, tf, isMin = true) {
		const dates = this.$(tf, handles);
		const timestamps = dates.map(d => Date.parse(d)).filter(t => !isNaN(t));

		if (!timestamps.length) return 0;

		return Math[isMin ? 'min' : 'max'](...timestamps);
	}

	/**
	 * Sets album metadata for the current album.
	 * @param {FbMetadbHandleList} handles - The track handles.
	 */
	setAlbumMeta(handles) {
		handles.OrderByFormat(fb.TitleFormat(this.TF.discnumber_tracknumber), 1);
		this.tracksList = this.getTracksFromHandles(handles);
		this.albumRating = this.getAlbumRating();

		// * Filter out raw CD image file when both the image (no tracknumber) and CUE virtual tracks are present in the library.
		const trackNumMeta = this.tracksList.filter(track => this.$(this.TF.tracknumber_raw, track.handle) !== '');
		const hasTrackNum = trackNumMeta.length > 0;

		// * Only filter if we actually found some tracks with numbers, otherwise it's a pure CD image, keep to avoid null metadb issues
		if (hasTrackNum) {
			this.tracksList = trackNumMeta;
		}

		if (this.tracksList.length > 0) {
			this.metadb = this.tracksList[0].handle;
			this.artist = this.$(this.TF.album_artist, this.metadb);
			this.album = this.$(this.TF.album, this.metadb);
			this.albumRating = this.getAlbumRating();

			for (const track of this.tracksList) {
				const disc = this.$(this.TF.discnumber, track.handle);
				const trackNum = hasTrackNum ? this.$(this.TF.tracknumber, track.handle) : (track.index + 1).toString().padStart(2, '0'); // Fallback if no tag
				track.displayNum = (this.albumTotalDiscs > 1 && disc) ? `${disc}-${trackNum}` : trackNum;
			}
		}
	}

	/**
	 * Sets header metadata for current view.
	 * @param {boolean} [artistView] - The optional flag if this is an artist view.
	 */
	setHeaderMeta(artistView = false) {
		if (this.tracksList.length === 0 && !artistView) return;

		const cleanUpAndSeparate = (value) =>
			value === '?' ? '' : value.replace(Regex.CommaSpace, ` ${Unicode.MiddleDot} `);

		this.genre = cleanUpAndSeparate(this.$(this.TF.genre, this.metadb));
		this.genres = this.genre ? this.genre.split(` ${Unicode.MiddleDot} `).filter(Boolean) : [];

		if (artistView) {
			this.infoText = this.genre;
			return;
		}

		this.albumLength = this.tracksList.reduce((acc, track) => acc + track.handle.Length, 0);
		this.albumTotalDiscs = Number(this.$(this.TF.totaldiscs, this.metadb)) || 1;
		this.year = this.$(this.TF.date, this.metadb);
		this.label = cleanUpAndSeparate(this.$(this.TF.label, this.metadb));
		this.labels = this.label ? this.label.split(` ${Unicode.MiddleDot} `).filter(Boolean) : [];
		this.infoText = [this.genre, this.label].filter(Boolean).join(` ${Unicode.MiddleDot} `);
	}

	/**
	 * Updates now playing index for current view.
	 * @param {FbMetadbHandle} [handle] - The optional handle, defaults to current playing.
	 */
	updateNowPlaying(handle = fb.GetNowPlaying()) {
		if (!handle) return;

		lib.ex.main.state.nowPlayingIndex = -1;
		lib.ex.cache.nowPlayingMeta = null;

		let list;
		let predicate;

		if (lib.ex.main.isAlbumView) {
			list = this.tracksList;
			predicate = (t) => t.handle.Compare(handle);
		}
		else {
			list = lib.ex.main.isArtistView ? this.albumsList : this.similarArtistList;
			predicate = (item) => item.handles.Convert().some((h) => h.Compare(handle));
		}

		if (list) {
			const index = list.findIndex(predicate);
			if (index !== -1) {
				lib.ex.main.state.nowPlayingIndex = index;
			}
		}

		lib.ex.cache.nowPlayingMeta = {
			artist: this.$(this.TF.album_artist, handle),
			album: this.$(this.TF.album, handle)
		};
	}

	/**
	 * Updates ratings for selected handles.
	 * @param {FbMetadbHandleList} selectedHandles - The selected track handles.
	 */
	updateRatings(selectedHandles) {
		if (selectedHandles.Count === 0) return;

		const handles = selectedHandles.Convert();
		const statsSelected = this.getStatsSelected();
		const nonAlbumList = !lib.ex.main.isAlbumView ? lib.ex.main.isArtistView ? this.albumsList : this.similarArtistList : null;
		let needsUpdate = false;

		const updateAlbumView = (handle, newRating) => {
			const trackIndex = this.tracksList.findIndex(t => t.handle.Compare(handle));
			if (trackIndex === -1) return false;

			const track = this.tracksList[trackIndex];
			track.rating = newRating;
			track.statistic = this.getTracksStatistic(new FbMetadbHandleList(handle), statsSelected);
			return true;
		};

		const updateArtistView = (handle) => {
			const itemIndex = nonAlbumList.findIndex(item => item.handles.Convert().some(albumHandle => albumHandle.Compare(handle)));
			if (itemIndex === -1) return false;

			const item = nonAlbumList[itemIndex];
			item.statistic = this.getTracksStatistic(item.handles, statsSelected, false);
			return true;
		};

		const updateTrackRating = (handle) => {
			const newRating = Number(this.$(this.TF.rating, handle)) || 0;
			const trackId = this.$(this.TF.artist_album_title, handle) || handle.RawPath;
			pl.track_ratings.set(trackId, newRating);
			return newRating;
		};

		// Update view-specific data only if relevant
		for (const handle of handles) {
			const newRating = updateTrackRating(handle);
			let updated = false;

			if (lib.ex.main.isAlbumView) {
				updated = updateAlbumView(handle, newRating);
			} else if (statsSelected === 'rating') {
				updated = updateArtistView(handle);
			}

			if (updated) needsUpdate = true;
		}

		if (needsUpdate) {
			if (lib.ex.main.isAlbumView) this.albumRating = this.getAlbumRating();
			lib.ex.utils.repaintColumn();
		}
	}

	/**
	 * Updates statistics for given handles.
	 * @param {FbMetadbHandleList} handleList - The track handles.
	 * @returns {Object} The object with needsUpdate and needsPlaylistUpdate flags.
	 */
	updateStatsForHandles(handleList) {
		const handles = handleList.Convert();
		let needsUpdate = false;
		let needsPlaylistUpdate = false;

		for (const handle of handles) {
			const trackId = this.$(this.TF.artist_album_title, handle) || handle.RawPath;
			const newRating = Number(this.$(this.TF.rating, handle)) || 0;
			pl.track_ratings.set(trackId, newRating);
			needsPlaylistUpdate = true;

			if (lib.ex.main.isAlbumView) {
				const index = this.tracksList.findIndex(t => t.handle.Compare(handle));
				if (index !== -1) {
					const track = this.tracksList[index];
					track.rating = newRating;
					track.statistic = this.getTracksStatistic(new FbMetadbHandleList(handle), this.getStatsSelected());
					track.title = this.$(this.TF.title, handle);
					track.duration = utils.FormatDuration(handle.Length);
					needsUpdate = true;
				}
			}
			else if (lib.ex.main.isArtistOrSimilarView) {
				const list = lib.ex.main.isArtistView ? this.albumsList : this.similarArtistList;
				const index = list.findIndex(item => item.handles.Convert().some(ah => ah.Compare(handle)));
				if (index !== -1) {
					list[index].statistic = this.getTracksStatistic(list[index].handles, this.getStatsSelected(), false);
					needsUpdate = true;
				}
			}
		}

		return { needsUpdate, needsPlaylistUpdate };
	}
	// #endregion


	// * DATA - SORT * //
	// #region DATA - SORT
	/**
	 * Gets sort configuration for a view and sort type.
	 * @param {string} view - The view type.
	 * @param {string} sortType - The sort type.
	 * @returns {Object} The sort configuration with keyFn and comparator.
	 */
	getSortConfig(view, sortType) {
		const configs = {
			albumView: {
				'Track number': {
					keyFn: t => t.index,
					comparator: (a, b) => a - b
				},
				'Track title': {
					keyFn: t => (t.title || '').toLowerCase(),
					comparator: (a, b) => a.localeCompare(b)
				},
				'Track rating': {
					keyFn: t => t.rating || 0,
					comparator: (a, b) => a - b
				},
				'Playcount': {
					keyFn: t => parseInt(this.getTracksStatistic(new FbMetadbHandleList(t.handle), 'playcount')) || 0,
					comparator: (a, b) => a - b
				},
				'Popularity': {
					keyFn: t => parseInt(t.statistic) || 0,
					comparator: (a, b) => a - b
				},
				'Queue': {
					keyFn: t => {
						const queue = plman.GetPlaybackQueueHandles();
						const j = queue.Find(t.handle);
						return j !== -1 ? j + 1 : Infinity;
					},
					comparator: (a, b) => a - b
				},
				'Added': {
					keyFn: t => Date.parse(this.$(libSet.tfAdded, t.handle)) || 0,
					comparator: (a, b) => a - b
				},
				'First played': {
					keyFn: t => Date.parse(this.$(libSet.tfFirstPlayed, t.handle)) || 0,
					comparator: (a, b) => a - b
				},
				'Last played': {
					keyFn: t => Date.parse(this.$(libSet.tfLastPlayed, t.handle)) || 0,
					comparator: (a, b) => a - b
				}
			},

			artistView: {
				'Album title': {
					keyFn: alb => (alb.album || '').toLowerCase(),
					comparator: (a, b) => a.localeCompare(b)
				},
				'Album rating': {
					keyFn: alb => this.getAlbumRatingFromHandles(alb.handles) || 0,
					comparator: (a, b) => a - b
				},
				'Playcount': {
					keyFn: alb => parseInt(this.getTracksStatistic(alb.handles, 'playcount')) || 0,
					comparator: (a, b) => a - b
				},
				'Popularity': {
					keyFn: alb => parseInt(alb.statistic) || 0,
					comparator: (a, b) => a - b
				},
				'Track count': {
					keyFn: alb => alb.handles.Count,
					comparator: (a, b) => a - b
				},
				'Year': {
					keyFn: alb => parseInt(alb.year) || 0,
					comparator: (a, b) => a - b
				},
				'Added': {
					keyFn: alb => this.getTimestamp(alb.handles, libSet.tfAdded, true),
					comparator: (a, b) => a - b
				},
				'First played': {
					keyFn: alb => this.getTimestamp(alb.handles, libSet.tfFirstPlayed, true),
					comparator: (a, b) => a - b
				},
				'Last played': {
					keyFn: alb => this.getTimestamp(alb.handles, libSet.tfLastPlayed, false),
					comparator: (a, b) => a - b
				}
			},

			similarArtistView: {
				'Similarity': {
					keyFn: art => art.match || 0,
					comparator: (a, b) => a - b
				},
				'Artist name': {
					keyFn: art => (art.name || '').toLowerCase(),
					comparator: (a, b) => a.localeCompare(b)
				},
				'Playcount': {
					keyFn: art => parseInt(this.getTracksStatistic(art.handles, 'playcount')) || 0,
					comparator: (a, b) => a - b
				},
				'Track count': {
					keyFn: art => art.handles.Count,
					comparator: (a, b) => a - b
				},
				'Added': {
					keyFn: art => this.getTimestamp(art.handles, libSet.tfAdded, true),
					comparator: (a, b) => a - b
				},
				'First played': {
					keyFn: art => this.getTimestamp(art.handles, libSet.tfFirstPlayed, true),
					comparator: (a, b) => a - b
				},
				'Last played': {
					keyFn: art => this.getTimestamp(art.handles, libSet.tfLastPlayed, false),
					comparator: (a, b) => a - b
				}
			}
		};

		const defaultTypes = { albumView: 'Track number', artistView: 'Year', similarArtistView: 'Similarity' };
		const defaultType = defaultTypes[view] || 'Track number';
		const viewConfigs = configs[view] || configs.albumView;

		return viewConfigs[sortType] || viewConfigs[defaultType];
	}

	/**
	 * Gets current sort direction.
	 * @returns {string} The 'ASC' or 'DSC' sort direction.
	 */
	getSortDirection() {
		if (lib.ex.main.isAlbumView) return this.sortDirAlbum;
		if (lib.ex.main.isArtistView) return this.sortDirArtist;
		if (lib.ex.main.isSimilarArtistView) return this.sortDirSimilar;
		return 'ASC';
	}

	/**
	 * Gets current sort type.
	 * @returns {string} The sort type name.
	 */
	getSortType() {
		if (lib.ex.main.isAlbumView) return this.sortTypeAlbum;
		if (lib.ex.main.isArtistView) return this.sortTypeArtist;
		if (lib.ex.main.isSimilarArtistView) return this.sortTypeSimilar;
		return 'Track number';
	}

	/**
	 * Sets current sort settings to items.
	 */
	setSorting() {
		const sortType = this.getSortType();
		const sortConfig = this.getSortConfig(lib.ex.main.state.view, sortType);
		const sortDirectionMultiplier =
			lib.ex.main.isSimilarArtistView && sortType === 'Similarity' ? -1 :
			this.getSortDirection() === 'DSC' ? -1 :
			1;

		const viewToSort =
			lib.ex.main.isArtistView ? this.albumsList :
			lib.ex.main.isMissingReleasesView ? this.missingReleasesList :
			lib.ex.main.isSimilarArtistView ? this.similarArtistList :
			this.tracksList;

		viewToSort.sort((a, b) => sortDirectionMultiplier * sortConfig.comparator(sortConfig.keyFn(a), sortConfig.keyFn(b)));

		lib.ex.sbar.clearScrollbarPosition();
		lib.ex.utils.repaintViewport();
	}
	// #endregion


	// * DATA - STATS * //
	// #region DATA - STATS
	/**
	 * Gets currently selected statistics type.
	 * @returns {string} The statistics type name.
	 */
	getStatsSelected() {
		if (lib.ex.main.isAlbumView) return this.statsSelectedAlbum;
		if (lib.ex.main.isArtistView) return this.statsSelectedArtist;
		if (lib.ex.main.isSimilarArtistView) return this.statsSelectedSimilar;
		return 'playcount';
	}

	/**
	 * Gets average bitrate from handles.
	 * @param {FbMetadbHandleList} handleList - The track handles.
	 * @param {boolean} label - The flag to include the label.
	 * @returns {string} The formatted bitrate.
	 */
	getStatsBitrate(handleList, label) {
		const bitrates = this.$(this.TF.bitrate, handleList);
		if (!bitrates.length) return '';
		let value;

		if (bitrates.length === 1) {
			value = bitrates[0];
		} else {
			const lengths = this.$(this.TF.length_seconds_fp, handleList);
			let totalBits = 0;
			let totalLen = 0;

			for (const [i, bitrate] of bitrates.entries()) {
				const bitrateNum = parseFloat(bitrate) || 0;
				const lenNum = parseFloat(lengths[i]) || 0;

				if (bitrateNum > 0 && lenNum > 0) {
					totalBits += bitrateNum * lenNum;
					totalLen += lenNum;
				}
			}

			value = totalLen > 0 ? Math.round(totalBits / totalLen) : '';
		}

		return label ? `${value} kbps` : value;
	}

	/**
	 * Gets date from handles.
	 * @param {string} format - The title format for date.
	 * @param {FbMetadbHandleList} handleList - The track handles.
	 * @param {boolean} label - The flag to include the label.
	 * @param {string} prefix - The label prefix.
	 * @param {boolean} [isMin] - The optional flag to get earliest or latest date.
	 * @returns {string} The formatted date.
	 */
	getStatsDate(format, handleList, label, prefix, isMin = true) {
		const dates = this.$(format, handleList).filter(v => v !== '');
		if (!dates.length) return '';

		const date = dates.length === 1 ? dates[0] : dates.reduce((pre, cur) => {
			const preTime = Date.parse(pre);
			const curTime = Date.parse(cur);
			return isMin ? (preTime > curTime ? cur : pre) : (curTime > preTime ? cur : pre);
		});

		return label ? `${prefix} ${date}` : date;
	}

	/**
	 * Gets total duration from handles.
	 * @param {FbMetadbHandleList} handleList - The track handles.
	 * @param {boolean} label - The flag to include the label.
	 * @returns {string} The formatted duration.
	 */
	getStatsDuration(handleList, label) {
		return utils.FormatDuration(handleList.CalcTotalDuration());
	}

	/**
	 * Gets total file size from handles.
	 * @param {FbMetadbHandleList} handleList - The track handles.
	 * @param {boolean} label - The flag to include the label.
	 * @returns {string} The formatted size.
	 */
	getStatsSize(handleList, label) {
		const bytes = this.$(this.TF.path_filesize, handleList);
		if (!bytes.length) return '';

		const sizes = bytes.map(v => parseInt(v.split('|').pop(), 10));
		const totalSize = sizes.reduce((a, b) => a + b, 0);

		return lib.pop.formatBytes(totalSize);
	}

	/**
	 * Gets average rating from handles.
	 * @param {FbMetadbHandleList} handleList - The track handles.
	 * @param {boolean} label - The flag to include the label.
	 * @returns {string|number} The formatted rating.
	 */
	getStatsRating(handleList, label) {
		const values = lib.pop.getNumbers(this.$(this.TF.rating, handleList));
		if (!values.length) return '';

		const sum = values.map(parseFloat).reduce((a, b) => a + b, 0);
		const avg = Math.ceil(sum / values.length);

		return label ? `Rating ${avg}` : avg;
	}

	/**
	 * Gets average popularity from handles.
	 * @param {FbMetadbHandleList} handleList - The track handles.
	 * @param {boolean} label - The flag to include the label.
	 * @returns {string|number} The formatted popularity.
	 */
	getStatsPopularity(handleList, label) {
		const values = lib.pop.getNumbers(this.$(this.TF.popularity, handleList));

		if (values.length > 0) {
			const sum = values.map(parseFloat).reduce((a, b) => a + b, 0);
			const avg = Math.ceil(sum / values.length);
			return label ? `Popularity ${lib.ex.utils.formatNumber(avg)}` : lib.ex.utils.formatNumber(avg);
		}

		return label ? 'Fetching...' : '';
	}

	/**
	 * Gets queue position(s) from handles.
	 * @param {FbMetadbHandleList} handleList - The track handles.
	 * @param {boolean} label - The flag to include the label.
	 * @returns {string} The formatted queue position(s).
	 */
	getStatsQueue(handleList, label) {
		const indices = [];
		const handles = handleList.Convert();
		const queueHandles = plman.GetPlaybackQueueHandles();

		for (const handle of handles) {
			const j = queueHandles.Find(handle);
			if (j !== -1) indices.push(j + 1);
		}

		if (!indices.length) return '';
		const index = indices.length === 1 ? indices[0] : lib.pop.arrayToRange(indices).join();

		return label ? `Queue ${index}` : index;
	}

	/**
	 * Gets total playcount from handles.
	 * @param {FbMetadbHandleList} handleList - The track handles.
	 * @param {boolean} label - The flag to include the label.
	 * @returns {string|number} The formatted playcount.
	 */
	getStatsPlaycount(handleList, label) {
		const playcounts = this.$(libSet.tfPc, handleList);
		if (!playcounts.length) return '';

		const counts = playcounts.map(v => parseInt(v.split('|').pop(), 10));
		const total = counts.filter(n => !isNaN(n)).reduce((a, b) => a + b, 0);
		if (total === 0) return '';

		return label ? `Played ${lib.ex.utils.formatNumber(total)}x` : lib.ex.utils.formatNumber(total);
	}

	/**
	 * Gets statistics for tracks.
	 * @param {FbMetadbHandleList} handleList - The track handles.
	 * @param {string} statsType - The type of statistics.
	 * @param {boolean} [label] - The flag to include the label.
	 * @returns {string|number} The formatted statistic.
	 */
	getTracksStatistic(handleList, statsType, label = false) {
		if (!handleList || handleList.Count === 0) return '';

		const stats = {
			bitrate: () => this.getStatsBitrate(handleList, label),
			duration: () => this.getStatsDuration(handleList, label),
			size: () => this.getStatsSize(handleList, label),
			rating: () => this.getStatsRating(handleList, label),
			playcount: () => this.getStatsPlaycount(handleList, label),
			popularity: () => this.getStatsPopularity(handleList, label),
			trackcount: () => label ? `${handleList.Count} tracks` : handleList.Count,
			queue: () => this.getStatsQueue(handleList, label),
			date: () => this.getStatsDate(libSet.tfDate, handleList, label, 'First release', true),
			added: () => this.getStatsDate(libSet.tfAdded, handleList, label, 'Added', true),
			firstPlayed: () => this.getStatsDate(libSet.tfFirstPlayed, handleList, label, 'First played', true),
			lastPlayed: () => this.getStatsDate(libSet.tfLastPlayed, handleList, label, 'Last played', false),
			none: () => ''
		};

		return stats[statsType]();
	}
	// #endregion
}


/**
 * The `LibExplorerScrollbar` class for managing the scrollbar for the explorer.
 * @class
 */
class LibExplorerScrollbar {
	/**
	 * Creates a LibExplorerScrollbar instance.
	 * @constructor
	 */
	constructor() {
		// Dimensions
		/** @type {number} The scrollbar x-position. */
		this.x = 0;
		/** @type {number} The scrollbar width. */
		this.w = 0;
		/** @type {number} The scrollbar arc size. */
		this.arc = 0;

		// Position state
		/** @type {number} The current scroll position. */
		this.scrollCurrent = 0;
		/** @type {number} The target scroll position. */
		this.scrollTarget = 0;
		/** @type {number} The starting position for smooth scroll. */
		this.scrollStartPos = 0;
		/** @type {boolean} The flag if scrolling via scrollbar drag. */
		this.scrollDrag = false;
		/** @type {number} The Y offset for scrollbar drag. */
		this.scrollDragPos = 0;

		// Animation
		/** @type {number|null} The interval ID for smooth scroll. */
		this.scrollTimer = null;
		/** @type {boolean} The flag for smooth scrolling enabled. */
		this.scrollSmoothEnabled = libSet.smooth || true;
		/** @type {number} The duration (ms) for smooth scroll easing. */
		this.scrollSmoothDuration = libSet.durationScroll || 500;
		/** @type {number} The scroll step size per wheel tick. */
		this.scrollStep = libSet.scrollStep || 1;

		// Visual state
		/** @type {number} The current alpha value for fade. */
		this.alphaCurrent = 0;
		/** @type {number} The target alpha value for fade. */
		this.alphaTarget = 0;
		/** @type {number} The step size for alpha animation. */
		this.alphaStep = 15;
		/** @type {number|null} The interval ID for alpha animation. */
		this.alphaTimer = null;
	}

	/**
	 * Draws the scrollbar.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	drawScrollbar(gr) {
		const totalH = lib.ex.utils.getScrollContentTotalHeight();
		if (totalH <= lib.ex.main.ui.viewportH) return;

		const y = lib.ex.main.ui.viewportY + (this.scrollCurrent / totalH) * lib.ex.main.ui.viewportH;
		const h = Math.max(20, (lib.ex.main.ui.viewportH / totalH) * lib.ex.main.ui.viewportH);
		const color = lib.ex.color.getScrollbarColor();

		gr.FillRoundRect(this.x, y, this.w, h, this.arc, this.arc, color);
	}

	/**
	 * Clears scrollbar position to top.
	 */
	clearScrollbarPosition() {
		if (this.scrollTimer) {
			clearInterval(this.scrollTimer);
			this.scrollTimer = null;
		}

		this.scrollCurrent = 0;
		this.scrollTarget = 0;
	}

	/**
	 * Gets the clamped scroll position within valid bounds.
	 * @param {number} targetPos - The target scroll position.
	 * @returns {number} The clamped scroll position.
	 */
	getClampedScrollPos(targetPos) {
		const totalH = lib.ex.utils.getScrollContentTotalHeight();
		const scrollMax = Math.max(0, totalH - lib.ex.main.ui.viewportH);
		return Math.round(Math.max(0, Math.min(scrollMax, targetPos)));
	}

	/**
	 * Handles scrollbar click for jump or drag.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	handleScrollbarClick(x, y) {
		if (!lib.ex.utils.mouseInScrollbar(x, y)) return;

		const totalH = lib.ex.utils.getScrollContentTotalHeight();
		const scrollH = lib.ex.main.ui.viewportH;
		const thumbH = Math.max(20, (scrollH / totalH) * scrollH);
		const scrollbarY = lib.ex.main.ui.viewportY;
		const thumbY = scrollbarY + (this.scrollCurrent / totalH) * scrollH;

		if (y >= thumbY && y < thumbY + thumbH) {
			this.scrollDrag = true;
			this.scrollDragPos = y - thumbY;
			if (!this.scrollTimer) {
				this.scrollStartPos = this.scrollCurrent;
				this.scrollStartTime = Date.now();
				this.scrollTimer = setInterval(() => this.scrollSmooth(), 17); // ~60fps
			}
			return;
		}

		// Jump to position
		const rawPos = (y - scrollbarY) / scrollH;
		this.scrollSmoothTo(rawPos * totalH);
		lib.ex.utils.repaintViewport();
	}

	/**
	 * Handles scrollbar drag movement.
	 * @param {number} y - The y-coordinate.
	 */
	handleScrollbarDrag(y) {
		if (!this.scrollDrag) return;

		const totalH = lib.ex.utils.getScrollContentTotalHeight();
		const newThumbY = y - this.scrollDragPos;
		const rawPos = (newThumbY - lib.ex.main.ui.viewportY) / lib.ex.main.ui.viewportH;
		const targetPos = rawPos * totalH;
		const clamped = this.getClampedScrollPos(targetPos);

		if (clamped !== this.scrollTarget) {
			this.scrollStartPos = this.scrollCurrent;
			this.scrollStartTime = Date.now();
			this.scrollTarget = clamped;
			if (!this.scrollTimer) {
				this.scrollTimer = setInterval(() => this.scrollSmooth(), 17); // ~60fps
			}
		}

		lib.ex.utils.repaintViewport();
	}

	/**
	 * Sets the animated scrollbar alpha fade.
	 */
	setScrollbarAlpha() {
		const diff = this.alphaTarget - this.alphaCurrent;

		if (Math.abs(diff) <= this.alphaStep) {
			this.alphaCurrent = this.alphaTarget;
			window.ClearInterval(this.alphaTimer);
			this.alphaTimer = null;
		} else {
			this.alphaCurrent += this.alphaStep * Math.sign(diff);
		}

		lib.ex.utils.repaintScrollbar();
	}

	/**
	 * Sets scrollbar metrics.
	 */
	setScrollbarMetrics() {
		this.w = SCALE(6);
		this.x = lib.ex.main.ui.column.x + lib.ex.main.ui.column.w + lib.ex.main.ui.margin30 / 2 - this.w / 2;
		this.arc = this.w / 2;
	}

	/**
	 * Scrolls to make an item visible.
	 * @param {number} itemY - The item Y position.
	 * @param {number} itemHeight - The item height.
	 */
	scrollPosToMakeVisible(itemY, itemHeight) {
		const viewportBottom = this.scrollCurrent + lib.ex.main.ui.viewportH;
		let targetPos;

		if (itemY < this.scrollCurrent) {
			targetPos = itemY;
		} else if (itemY + itemHeight > viewportBottom) {
			targetPos = itemY + itemHeight - lib.ex.main.ui.viewportH;
		} else {
			return; // Already visible, no scroll needed
		}

		this.scrollSmoothTo(targetPos);
	}

	/**
	 * Performs smooth scrolling animation step.
	 */
	scrollSmooth() {
		const duration = this.scrollSmoothDuration;
		const elapsed = Date.now() - this.scrollStartTime;
		const progress = Math.min(1, elapsed / duration);
		const eased = 1 - (1 - progress) ** 3;

		this.scrollCurrent = this.scrollStartPos + (this.scrollTarget - this.scrollStartPos) * eased;

		lib.ex.utils.repaintViewport();
		if (progress < 1) return;

		this.scrollCurrent = this.scrollTarget;
		clearInterval(this.scrollTimer);
		this.scrollTimer = null;
	}

	/**
	 * Initiates smooth scroll to target position.
	 * @param {number} target - The target scroll position.
	 */
	scrollSmoothTo(target) {
		target = this.getClampedScrollPos(target);

		if (target === this.scrollCurrent) return;

		if (!this.scrollSmoothEnabled) {
			this.scrollCurrent = target;
			this.scrollTarget = target;
			lib.ex.utils.repaintViewport();
			return;
		}

		this.scrollStartPos = this.scrollCurrent;
		this.scrollTarget = target;
		this.scrollStartTime = Date.now();

		if (this.scrollTimer) {
			clearInterval(this.scrollTimer);
		}
		this.scrollTimer = setInterval(() => this.scrollSmooth(), 17); // ~60fps
	}

	/**
	 * Updates scrollbar alpha for hover/drag state.
	 * @param {boolean} [hovered] - The optional flag if scrollbar is hovered.
	 * @param {boolean} [dragging] - The optional flag if scrollbar is being dragged.
	 */
	updateScrollbarAlpha(hovered = false, dragging = false) {
		const newTarget = (hovered || dragging) ? 255 : 0;

		if (newTarget !== this.alphaTarget) {
			this.alphaTarget = newTarget;
			if (!this.alphaTimer) {
				this.alphaTimer = window.SetInterval(() => this.setScrollbarAlpha(), 16);
			}
		}
	}
}


/**
 * The `LibExplorerMenu` class for managing the context menus for the explorer.
 * @class
 */
class LibExplorerMenu {
	/**
	 * Shows the weblinks popup menu at the given coordinates.
	 * @param {number} x - The x-coordinate for popup.
	 * @param {number} y - The y-coordinate for popup.
	 * @param {FbMetadbHandle} metadb - The metadb for link context (selected or view default).
	 */
	linksMenu(x, y, metadb) {
		const menu = window.CreatePopupMenu();

		const {
			websiteLabels, websiteValues
		} = lib.ex.web.createWebsiteLinks(grCfg.customWebsiteLinks || []);

		for (let i = 0; i < websiteLabels.length; i++) {
			const label = websiteLabels[i];
			menu.AppendMenuItem(LIB_MF_STRING, i + 1, label);
		}

		const index = menu.TrackPopupMenu(x, lib.ex.button.tabs.tabsY + lib.ex.button.tabs.tabsHeight);

		if (index > 0) {
			const selectedWebsite = websiteValues[index - 1];
			lib.ex.web.openWebsite(selectedWebsite, metadb);
		}
	}

	/**
	 * Shows missing releases source selection menu.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	missingReleasesSourceMenu(x, y) {
		const menu = window.CreatePopupMenu();
		const menuItems = ['Discogs', 'Last.fm', 'MusicBrainz', 'Custom'];
		const sources = ['discogs', 'lastfm', 'musicbrainz', 'custom'];
		const currentSource = lib.ex.missing.sourceCustomList ? 'custom' : lib.ex.missing.source;
		const currentIndex = sources.indexOf(currentSource) + 1;

		const customCachePath = lib.ex.cache.getCachePath('missingReleasesCustomJson', lib.ex.data.artistOrigName);
		const hasCustom = $Lib.file(customCachePath);

		for (let i = 0; i < 4; i++) {
			const flags = (i === 3 && !hasCustom) ? LIB_MF_GRAYED | LIB_MF_STRING : LIB_MF_STRING;
			menu.AppendMenuItem(flags, i + 1, menuItems[i]);
		}
		menu.CheckMenuRadioItem(1, 4, currentIndex);

		const index = menu.TrackPopupMenu(x, lib.ex.main.ui.headerAlbumY + lib.ex.main.ui.headerLineHeight);
		if (index <= 0 || (index === 4 && !hasCustom)) return;

		const selected = sources[index - 1];
		if (selected === currentSource) return;

		if (selected === 'custom') {
			const cacheContent = $Lib.open(customCachePath);
			const cacheDataParsed = JSON.parse(cacheContent || '{}');
			const customData = cacheDataParsed.albums || [];
			lib.ex.missing.missingReleasesDisplay(customData);
			lib.ex.missing.sourceCustomList = true;
			lib.ex.artist.setArtistViewMetrics();
			lib.ex.utils.repaintHeader();
			return;
		}

		libSet.explorerMissingReleasesFetchSource = selected;
		lib.ex.missing.source = selected;
		lib.ex.missing.sourceCustomList = false;
		lib.ex.missing.loadMissingReleasesView();
	}

	/**
	 * Shows similar artist source selection menu.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	similarArtistSourceMenu(x, y) {
		const menu = window.CreatePopupMenu();
		const menuItems = ['Last.fm', 'ListenBrainz', 'Custom'];
		const sources = ['lastfm', 'listenbrainz', 'custom'];
		const currentSource = lib.ex.similar.sourceCustomList ? 'custom' : lib.ex.similar.source;
		const currentIndex = sources.indexOf(currentSource) + 1;
		const customCachePath = lib.ex.cache.getCachePath('similarArtistCustomJson', lib.ex.data.artistOrigName);
		const hasCustom = $Lib.file(customCachePath);

		for (let i = 0; i < 3; i++) {
			const flags = (i === 2 && !hasCustom) ? LIB_MF_GRAYED | LIB_MF_STRING : LIB_MF_STRING;
			menu.AppendMenuItem(flags, i + 1, menuItems[i]);
		}

		menu.CheckMenuRadioItem(1, 3, currentIndex);
		const index = menu.TrackPopupMenu(x, lib.ex.main.ui.headerY + SCALE(45)); // Position near the source text

		if (index <= 0 || index === 3 && !hasCustom) return;
		const selected = sources[index - 1];
		if (selected === currentSource) return;

		if (selected === 'custom') { // Load custom JSON data
			const cacheContent = $Lib.open(customCachePath);
			const cacheDataParsed = JSON.parse(cacheContent || '{}');
			const customData = cacheDataParsed.artists || [];
			lib.ex.similar.similarArtistProcessData(customData);
			lib.ex.similar.sourceCustomList = true;
			lib.ex.artist.setArtistViewMetrics();
			lib.ex.utils.repaintHeader();
			return;
		}

		libSet.explorerSimilarArtistFetchSource = selected;
		lib.ex.similar.source = selected;
		lib.ex.similar.sourceCustomList = false;
		lib.ex.similar.loadSimilarArtistView(lib.ex.data.artistOrigName, lib.ex.main.state.artistIndex);
	}

	/**
	 * Shows sort options menu.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	sortMenu(x, y) {
		const menu = window.CreatePopupMenu();
		const directions = ['ASC', 'DSC'];
		const separatorIndex = 3;
		let types;

		if (lib.ex.main.isSimilarArtistView) {
			types = ['Similarity', 'Artist name', 'Playcount', 'Track count', 'Added', 'First played', 'Last played'];
		}
		else if (lib.ex.main.isArtistOrMissingView) {
			types = ['Album title', 'Album rating', 'Playcount', 'Popularity', 'Track count', 'Year', 'Added', 'First played', 'Last played'];
		}
		else { // albumView or detailsView
			types = ['Track number', 'Track title', 'Track rating', 'Playcount', 'Popularity', 'Queue', 'Added', 'First played', 'Last played'];
		}

		// Directions with radios
		for (const [index, dir] of directions.entries()) {
			menu.AppendMenuItem(MenuFlag.String, index + 1, dir);
		}
		menu.AppendMenuSeparator();

		// Types with radios
		for (const [index, type] of types.entries()) {
			menu.AppendMenuItem(MenuFlag.String, index + separatorIndex + 1, type);
		}

		// Check current direction
		const dirIndex = directions.indexOf(lib.ex.data.getSortDirection()) + 1;
		menu.CheckMenuRadioItem(1, 2, Math.max(1, Math.min(2, dirIndex)));

		// Check current type
		const typeIndex = Math.max(0, types.indexOf(lib.ex.data.getSortType()));
		const menuStart = separatorIndex + 1;
		menu.CheckMenuRadioItem(menuStart, menuStart + types.length - 1, menuStart + typeIndex);

		const index = menu.TrackPopupMenu(x, lib.ex.button.tabs.tabsY + lib.ex.button.tabs.tabsHeight);

		if (index > 0 && index <= 2) { // Direction selected
			const dir = directions[index - 1];
			if (lib.ex.main.isAlbumView) lib.ex.data.sortDirAlbum = dir;
			else if (lib.ex.main.isArtistView) lib.ex.data.sortDirArtist = dir;
			else if (lib.ex.main.isSimilarArtistView) lib.ex.data.sortDirSimilar = dir;
		}
		else if (index > separatorIndex) { // Type selected
			const selectedType = types[index - separatorIndex - 1];
			if (lib.ex.main.isAlbumView) lib.ex.data.sortTypeAlbum = selectedType;
			else if (lib.ex.main.isArtistView) lib.ex.data.sortTypeArtist = selectedType;
			else if (lib.ex.main.isSimilarArtistView) lib.ex.data.sortTypeSimilar = selectedType;
		}

		if (index > 0) lib.ex.data.setSorting(); // Re-sort and repaint
	}

	/**
	 * Shows statistics type selection menu.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	statsMenu(x, y) {
		const menu = window.CreatePopupMenu();

		const labels = {
			'bitrate': 'Bitrate',
			'duration': 'Duration',
			'size': 'Total Size',
			'rating': 'Rating',
			'playcount': 'Playcount',
			'popularity': `Popularity (${lib.ex.web.popularityFetchSource === 'lastfm' ? 'Last.fm' : 'ListenBrainz'})`,
			'trackcount': 'Track Count',
			'queue': 'Queue Position',
			'date': 'Date',
			'added': 'Added',
			'firstPlayed': 'First Played',
			'lastPlayed': 'Last Played',
			'none': 'None'
		};

		const stats = lib.ex.data.stats.slice();
		if (lib.ex.main.isAlbumView) {
			const trackcountIndex = stats.indexOf('trackcount');
			if (trackcountIndex !== -1) {
				stats.splice(trackcountIndex, 1);
			}
		}

		const indexFirst = 1;
		const indexLast = stats.length;
		const indexSelected = stats.indexOf(lib.ex.data.getStatsSelected()) + 1;

		for (const [index, stat] of stats.entries()) {
			const label = labels[stat] || stat.charAt(0).toUpperCase() + stat.slice(1);
			const indexItem = index + 1;
			menu.AppendMenuItem(MenuFlag.String, indexItem, label);
		};

		// Set up radio group if there's a selection
		if (indexSelected >= indexFirst && indexSelected <= indexLast) {
			menu.CheckMenuRadioItem(indexFirst, indexLast, indexSelected);
		}

		const index = menu.TrackPopupMenu(x, lib.ex.button.tabs.tabsY + lib.ex.button.tabs.tabsHeight);
		if (index <= 0) return;

		const oldStat = lib.ex.data.getStatsSelected();
		const newStat = stats[index - 1];
		if (newStat === oldStat) return;

		if (lib.ex.main.isAlbumView) lib.ex.data.statsSelectedAlbum = newStat;
		else if (lib.ex.main.isArtistView) lib.ex.data.statsSelectedArtist = newStat;
		else if (lib.ex.main.isSimilarArtistView) lib.ex.data.statsSelectedSimilar = newStat;

		// Special handling for popularity
		if (newStat === 'popularity') {
			const items =
				lib.ex.main.isAlbumView ? lib.ex.data.tracksList :
				lib.ex.main.isArtistView ? lib.ex.data.albumsList :
				lib.ex.data.similarArtistList;

			for (const item of items) {
				item.statistic = '';
			}

			lib.ex.main.setMetrics();
			lib.ex.utils.repaintViewport();
			if (lib.ex.main.isArtistView) {
				lib.ex.web.fetchPopularityArtist();
			}
			else if (lib.ex.main.isAlbumView) {
				lib.ex.web.fetchPopularityAlbum();
			}
			return;
		}

		// Recompute stats for current view
		if (lib.ex.main.isAlbumView && lib.ex.data.tracksList.length > 0) {
			for (const track of lib.ex.data.tracksList) {
				track.statistic = lib.ex.data.getTracksStatistic(new FbMetadbHandleList(track.handle), lib.ex.data.getStatsSelected());
			}
		} else if (lib.ex.main.isArtistView && lib.ex.data.albumsList.length > 0) {
			for (const album of lib.ex.data.albumsList) {
				album.statistic = lib.ex.data.getTracksStatistic(album.handles, lib.ex.data.getStatsSelected());
			}
		} else if (lib.ex.main.isSimilarArtistView && lib.ex.data.similarArtistList.length > 0) {
			for (const artist of lib.ex.data.similarArtistList) {
				artist.statistic = lib.ex.data.getTracksStatistic(artist.handles, lib.ex.data.getStatsSelected());
			}
		}

		lib.ex.main.setMetrics();
		lib.ex.utils.repaintViewport();
	}
	// #endregion
}


/**
 * The `LibExplorerTooltips` class for managing the tooltips for the explorer.
 * @class
 */
class LibExplorerTooltips {
	/**
	 * Creates a LibExplorerTooltips instance.
	 * @constructor
	 */
	constructor() {
		/** @type {boolean} The flag if tooltip is active. */
		this.active = false;
		/** @type {string} The current tooltip text. */
		this.text = '';
		/** @type {boolean} The flag if artist tooltip needed (truncated). */
		this.showArtist = false;
		/** @type {boolean} The flag if album tooltip needed. */
		this.showAlbum = false;
		/** @type {boolean} The flag if summary tooltip needed. */
		this.showAlbumSummary = false;
		/** @type {boolean} The flag if info text tooltip needed. */
		this.showGroupInfo = false;
	}


	// * UI - TOOLTIPS * //
	// #region UI - TOOLTIPS
	/**
	 * Activates a tooltip with given text.
	 * @param {string} text - The tooltip text.
	 */
	activateTooltip(text) {
		if (!grSet.showTooltipLibrary && !grSet.showTooltipTruncated || libTooltip.Text === text) return;

		this.active = true;
		this.text = text;

		if (grSet.showStyledTooltips) {
			grm.ui.styledTooltipText = text;
		} else {
			libTooltip.Text = text;
			libTooltip.Activate();
		}
	}

	/**
	 * Deactivates the current tooltip.
	 */
	deactivateTooltip() {
		if (!this.active) return;

		this.active = false;
		this.text = '';

		if (grSet.showStyledTooltips) {
			grm.ui.styledTooltipText = '';
		} else {
			libTooltip.Text = '';
			libTooltip.Deactivate();
		}

		// Custom tooltips can be outside the viewport, need to do full repaint to prevent leftovers
		window.Repaint();
	}

	/**
	 * Handles tooltips for track rows.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	handleTrackTooltips(x, y) {
		if (lib.ex.control.mouse.hoveredTrack === -1) {
			this.deactivateTooltip();
			return;
		}

		const track = lib.ex.data.tracksList[lib.ex.control.mouse.hoveredTrack];
		const trackY = lib.ex.utils.getAlbumTrackY(lib.ex.control.mouse.hoveredTrack);

		if (y < trackY || y >= trackY + lib.ex.album.trackHeight) {
			this.deactivateTooltip();
			return;
		}

		const isPlayingTrack = fb.IsPlaying && lib.ex.main.state.nowPlayingIndex === lib.ex.control.mouse.hoveredTrack;
		const needsTooltip = isPlayingTrack ? track.tooltipPlaying : track.tooltipNormal;
		const tooltipText = isPlayingTrack ? track.title : track.normalFullTitle;

		if (x >= lib.ex.main.ui.column.x && x < lib.ex.main.ui.column.x + lib.ex.album.titleW && needsTooltip) {
			this.activateTooltip(tooltipText);
		}
		else {
			this.deactivateTooltip();
		}
	}

	/**
	 * Handles tooltips for album grid items.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	handleAlbumTooltips(x, y) {
		if (lib.ex.control.mouse.hoveredAlbum === -1) {
			this.deactivateTooltip();
			return;
		}

		const items = lib.ex.utils.getGridItems();
		const item = items[lib.ex.control.mouse.hoveredAlbum];
		const column = lib.ex.control.mouse.hoveredAlbum % lib.ex.main.grid.columns;
		const row = Math.floor(lib.ex.control.mouse.hoveredAlbum / lib.ex.main.grid.columns);
		const relX = column * (lib.ex.main.grid.thumbSize + lib.ex.main.grid.thumbGap) + lib.ex.main.grid.thumbMargin;
		const relY = row * lib.ex.main.grid.rowH - lib.ex.sbar.scrollCurrent;
		const absTextX = lib.ex.main.ui.column.x + relX;

		// Calculate thumbnail boundaries
		const thumbnailTop = lib.ex.main.ui.viewportY + relY;
		const thumbnailBottom = thumbnailTop + lib.ex.main.grid.thumbSize;

		// Check if cursor is in thumbnail area
		if (y >= thumbnailTop && y <= thumbnailBottom) {
			this.deactivateTooltip();
			return;
		}

		// Calculate combined text area (both main and stat text)
		const textAreaTop = thumbnailBottom + lib.ex.main.grid.textOffsetY;
		const textAreaBottom = textAreaTop + (lib.ex.main.grid.singleRowLineH * 2) + lib.ex.main.grid.textStatsOffsetY;

		const inTextArea =
			x >= absTextX && x < absTextX + lib.ex.main.grid.thumbSize &&
			y >= textAreaTop && y <= textAreaBottom;

		if (inTextArea) {
			if (item.tooltipMain) {
				this.activateTooltip(item.mainText);
			}
			else if (item.tooltipStat) {
				this.activateTooltip(item.statText);
			}
		} else {
			this.deactivateTooltip();
		}
	}

	/**
	 * Handles tooltips for header elements.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	handleHeaderTooltips(x, y) {
		if (x < lib.ex.main.ui.column.x || x > lib.ex.main.ui.column.x + lib.ex.main.ui.column.w) {
			this.deactivateTooltip();
			return;
		}

		if (y >= lib.ex.main.ui.headerArtistY && y < lib.ex.main.ui.headerArtistY + lib.ex.main.ui.headerLineHeight) {
			if (this.showArtist) {
				this.activateTooltip(lib.ex.data.artist);
			} else {
				this.deactivateTooltip();
			}
		}
		else if (y >= lib.ex.main.ui.headerAlbumY && y < lib.ex.main.ui.headerAlbumY + lib.ex.main.ui.headerLineHeight) {
			if (lib.ex.main.isAlbumView) {
				if (this.showAlbum) {
					this.activateTooltip(lib.ex.data.album);
				} else {
					this.deactivateTooltip();
				}
			} else if (this.showAlbumSummary) {
				this.activateTooltip(lib.ex.data.albumSummary);
			} else {
				this.deactivateTooltip();
			}
		}
		else if (y >= lib.ex.main.ui.infoY && y < lib.ex.main.ui.infoY + lib.ex.main.ui.infoH + SCALE(5) && lib.ex.data.infoText) {
			if (this.showGroupInfo) {
				this.activateTooltip(lib.ex.data.infoText);
			} else {
				this.deactivateTooltip();
			}
		} else {
			this.deactivateTooltip();
		}
	}

	/**
	 * Sets tooltip metrics.
	 */
	setTooltipMetrics() {
		if (lib.ex.main.isAlbumOrDetailsView) {
			const maxArtistW = lib.ex.main.ui.durationX - lib.ex.main.ui.flagMargin;
			const artistFullW = lib.ex.utils.measureTextWidth(lib.ex.data.artist, lib.ex.main.font.header);
			lib.ex.tooltip.showArtist = artistFullW > maxArtistW;

			const ratingPad = lib.ex.data.albumRating > 0 ? SCALE(18) * 5 + SCALE(10) : 0;
			const maxAlbumW = lib.ex.main.ui.durationX - ratingPad;
			const albumFullW = lib.ex.utils.measureTextWidth(lib.ex.data.album, lib.ex.main.font.header);
			lib.ex.tooltip.showAlbum = albumFullW > maxAlbumW;
		}
		else if (lib.ex.main.isArtistOrSimilarView) {
			const suffix = lib.ex.main.isSimilarArtistView ? `${Unicode.MiddleDot}  Similar Artists` : '';
			const suffixW = suffix ? lib.ex.utils.measureTextWidth(suffix, lib.ex.main.font.header) : 0;
			const maxArtistW = lib.ex.main.ui.contentW - lib.ex.main.ui.flagMargin - suffixW;
			const artistFullW = lib.ex.utils.measureTextWidth(lib.ex.data.artist, lib.ex.main.font.header);
			lib.ex.tooltip.showArtist = artistFullW > maxArtistW;

			const maxSummaryW = lib.ex.main.ui.headerSummaryW;
			const summaryFullW = lib.ex.utils.measureTextWidth(lib.ex.data.albumSummary, lib.ex.main.font.header);
			lib.ex.tooltip.showAlbumSummary = summaryFullW > maxSummaryW;
		}

		const maxInfoW = lib.ex.main.isAlbumOrDetailsView ? lib.ex.main.ui.durationX : lib.ex.main.ui.contentW;
		const infoFullW = lib.ex.utils.measureTextWidth(lib.ex.data.infoText, lib.ui.font.main);
		lib.ex.tooltip.showGroupInfo = infoFullW > maxInfoW;
	}

	/**
	 * Updates tooltips based on mouse position.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	updateTooltips(x, y) {
		const oldTooltipActive = this.active;
		const oldTooltipText = this.text;

		if (lib.ex.main.isAlbumView && lib.ex.control.mouse.hoveredTrack !== -1) {
			this.handleTrackTooltips(x, y);
		}
		else if (lib.ex.main.isArtistOrSimilarView && lib.ex.control.mouse.hoveredAlbum !== -1) {
			this.handleAlbumTooltips(x, y);
		}
		if (lib.ex.control.mouse.hoveredTrack === -1 && lib.ex.control.mouse.hoveredAlbum === -1) {
			this.handleHeaderTooltips(x, y);
		}

		// Repaint only if tooltip state changed (for custom tooltips that require full repaint)
		const tooltipChanged = this.active !== oldTooltipActive || this.text !== oldTooltipText;
		if (tooltipChanged && grSet.showStyledTooltips) {
			lib.ex.utils.repaintViewport();
		}
	}
	// #endregion
}


/**
 * The `LibExplorerUtils` class for managing the utility methods for the explorer.
 * @class
 */
class LibExplorerUtils {
	// * UTILITY - COMMON * //
	// #region UTILITY - COMMON
	/**
	 * Cleans album title for comparison.
	 * @param {string} title - The album title.
	 * @returns {string} The cleaned title.
	 */
	cleanAlbumTitle(title) {
		return (title
			.toLowerCase()
			.replace(Regex.PunctBasic, '')
			.replace(Regex.SpaceAll, ' ')
			.trim()
		);
	}

	/**
	 * Cleans filename by removing illegal characters.
	 * @param {string} str - The filename string.
	 * @returns {string} The cleaned filename.
	 */
	cleanFilename(str) {
		return (str
			.replace(Regex.PathIllegalFilename, '_')
			.replace(Regex.TextDash, '-')
			.replace(Regex.SpaceNonLeading, '')
			.replace(Regex.EdgeDotSpaceTrailing, '')
		);
	}

	/**
	 * Escapes string for use in query.
	 * @param {string} str - The string to escape.
	 * @returns {string} The escaped string.
	 */
	escapeForQuery(str) {
		return str.replace(Regex.PunctQuoteDouble, '""');
	}

	/**
	 * Formats a number with separators.
	 * @param {string|number} value - The value to format.
	 * @param {string} [separator] - The optional separator (default '.').
	 * @returns {string} The formatted number string.
	 */
	formatNumber(value, separator = '.') {
		if (value == null || value === '') {
			return '0';
		}

		const num = typeof value === 'string' ? parseInt(value, 10) : value;

		if (isNaN(num) || !isFinite(num)) {
			return '0';
		}

		const isNegative = num < 0;
		const absNum = Math.abs(num);
		const numStr = absNum.toString();
		const formatted = numStr.replace(Regex.NumThousandSeparator, separator);

		return isNegative ? `-${formatted}` : formatted;
	}

	/**
	 * Checks if an album exists in local collection.
	 * @param {string} onlineTitle - The online album title.
	 * @param {Array<string>} localAlbums - The array of local album titles.
	 * @returns {boolean} True if album exists locally.
	 */
	isAlbumInLocalCollection(onlineTitle, localAlbums) {
		const normalizedOnline = this.cleanAlbumTitle(onlineTitle);

		return localAlbums.some(local => {
			const normalizedLocal = this.cleanAlbumTitle(local);
			return normalizedLocal.includes(normalizedOnline) || normalizedOnline.includes(normalizedLocal);
		});
	}

	/**
	 * Measures text dimensions.
	 * @param {string} text - The text to measure.
	 * @param {GdiFont} font - The font to use.
	 * @param {number} [maxWidth] - The optional maximum width.
	 * @param {number} [maxHeight] - The optional maximum height.
	 * @returns {Object} The measurement result with Width and Height.
	 */
	measureText(text, font, maxWidth = 0, maxHeight = 0) {
		if (!lib.ex.cache.gdiMeasureTextImg) {
			lib.ex.cache.gdiMeasureTextImg = gdi.CreateImage(1, 1);
		}

		const g = lib.ex.cache.gdiMeasureTextImg.GetGraphics();
		const result = g.MeasureString(text, font, 0, 0, maxWidth, maxHeight);
		lib.ex.cache.gdiMeasureTextImg.ReleaseGraphics(g);

		return result;
	}

	/**
	 * Measures text width.
	 * @param {string} text - The text to measure.
	 * @param {GdiFont} font - The font to use.
	 * @param {boolean} [useExact] - The optional flag to use exact measurement.
	 * @returns {number} The text width.
	 */
	measureTextWidth(text, font, useExact = false) {
		if (!lib.ex.cache.gdiMeasureTextImg) {
			lib.ex.cache.gdiMeasureTextImg = gdi.CreateImage(1, 1);
		}

		const g = lib.ex.cache.gdiMeasureTextImg.GetGraphics();
		const width = g.CalcTextWidth(text, font, useExact);
		lib.ex.cache.gdiMeasureTextImg.ReleaseGraphics(g);

		return width;
	}

	/**
	 * Measures text height.
	 * @param {string} text - The text to measure.
	 * @param {GdiFont} font - The font to use.
	 * @returns {number} The text height.
	 */
	measureTextHeight(text, font) {
		if (!lib.ex.cache.gdiMeasureTextImg) {
			lib.ex.cache.gdiMeasureTextImg = gdi.CreateImage(1, 1);
		}

		const g = lib.ex.cache.gdiMeasureTextImg.GetGraphics();
		const height = g.CalcTextHeight(text, font);
		lib.ex.cache.gdiMeasureTextImg.ReleaseGraphics(g);

		return height;
	}

	/**
	 * Sets range selection from anchor to current index.
	 * @param {number} indexCurrent - The current index.
	 */
	setRangeSelection(indexCurrent) {
		if (lib.ex.main.state.selectionAnchor === -1) {
			lib.ex.main.state.selectionAnchor = indexCurrent;
			lib.ex.main.state.selectedIndices.clear();
			lib.ex.main.state.selectedIndices.add(indexCurrent);
			return;
		}

		const start = Math.min(lib.ex.main.state.selectionAnchor, indexCurrent);
		const end = Math.max(lib.ex.main.state.selectionAnchor, indexCurrent);
		lib.ex.main.state.selectedIndices.clear();

		for (let i = start; i <= end; i++) {
			lib.ex.main.state.selectedIndices.add(i);
		}
	}

	/**
	 * Truncates text to fit within constraints.
	 * @param {string} mode - The truncation mode ('width' or 'height').
	 * @param {string} text - The text to truncate.
	 * @param {GdiFont} font - The font to use.
	 * @param {number} maxWidth - The maximum width.
	 * @param {number} [maxHeight] - The optional maximum height.
	 * @param {string} [ellipsis] - The optional ellipsis string.
	 * @returns {string} The truncated text.
	 */
	truncateText(mode, text, font, maxWidth, maxHeight = 0, ellipsis = '...') {
		const isHeightMode = mode === 'height';
		const measParams = isHeightMode ? [0, 0, maxWidth, 9999] : [0, 0, 9999, maxHeight];
		const fullMeas = this.measureText(text, font, ...measParams);
		const fullDim = isHeightMode ? fullMeas.Height : fullMeas.Width;
		const maxDim = isHeightMode ? maxHeight : maxWidth;

		if (fullDim <= maxDim) return text;

		const ellipsisMeas = this.measureText(ellipsis, font, ...measParams);
		const ellipsisDim = isHeightMode ? ellipsisMeas.Height : ellipsisMeas.Width;
		const availDim = maxDim - ellipsisDim;

		if (availDim <= 0) return ellipsis;

		let low = 0;
		let high = text.length;

		while (low < high) {
			const mid = Math.floor((low + high + 1) / 2);
			const testText = `${text.substring(0, mid)}${ellipsis}`;
			const testMeas = this.measureText(testText, font, ...measParams);
			const testDim = isHeightMode ? testMeas.Height : testMeas.Width;

			if (testDim <= maxDim) {
				low = mid;
			} else {
				high = mid - 1;
			}
		}

		return `${text.substring(0, low)}${ellipsis}`;
	}
	// #endregion


	// * LAYOUT * //
	// #region LAYOUT
	/**
	 * Gets Y position of an album track.
	 * @param {number} trackIndex - The track index.
	 * @returns {number} The Y position.
	 */
	getAlbumTrackY(trackIndex) {
		let cumY = 0;

		for (const item of lib.ex.album.discLayoutItems) {
			if (item.type === 'track' && item.trackIndex === trackIndex) {
				return lib.ex.main.ui.viewportY + cumY - lib.ex.sbar.scrollCurrent;
			}
			cumY += item.height;
		}

		return lib.ex.main.ui.viewportY;
	}

	/**
	 * Gets items array for current grid view.
	 * @returns {Array} The array of grid items.
	 */
	getGridItems() {
		return (
			lib.ex.main.isMissingReleasesView ? lib.ex.data.missingReleasesList :
			lib.ex.main.isSimilarArtistView ? lib.ex.data.similarArtistList :
			lib.ex.data.albumsList
		);
	}

	/**
	 * Gets thumbnail scaling mode for current grid view.
	 * @returns {string} The scaling mode.
	 */
	getGridThumbScalingMode() {
		return (
			lib.ex.main.isMissingReleasesView ? lib.ex.main.state.albumThumbImgScaling :
			lib.ex.main.isSimilarArtistView ? lib.ex.main.state.artistThumbImgScaling :
			lib.ex.main.state.albumThumbImgScaling
		);
	}

	/**
	 * Converts screen coordinates to album grid index.
	 * @param {number} x - The screen x-coordinate
	 * @param {number} y - The screen y-coordinate (relative to viewport)
	 * @returns {number} The album index in grid
	 */
	getGridAlbumIndex(x, y) {
		const relX = x - lib.ex.main.grid.thumbMargin;
		const relY = y + lib.ex.sbar.scrollCurrent;

		const column = Math.round(relX / (lib.ex.main.grid.thumbSize + lib.ex.main.grid.thumbGap));
		const row = Math.floor(relY / lib.ex.main.grid.rowH);

		return row * lib.ex.main.grid.columns + column;
	}

	/**
	 * Gets download icon bounds for a grid thumbnail.
	 * @param {number} thumbX - The thumbnail X position
	 * @param {number} thumbY - The thumbnail Y position
	 * @returns {Object} The icon bounds with x, y, size, drawSize.
	 */
	getGridDownloadIconBounds(thumbX, thumbY) {
		const external = lib.ex.main.isMissingReleasesView || lib.ex.similar.isSimilarExternal;

		const drawSize = lib.ex.main.grid.iconExternalSize;
		const iconSize = drawSize - lib.ex.main.grid.iconExternalInset;

		// Position relative to the thumb
		const iconX = thumbX + lib.ex.main.grid.thumbSize - drawSize - (external ? lib.ex.main.grid.iconDownloadInset : 0);
		const iconY = thumbY + lib.ex.main.grid.yearBarY;

		return { x: iconX, y: iconY, size: iconSize, drawSize };
	}

	/**
	 * Gets new position after grid arrow key movement.
	 * @param {number} indexCurrent - The current index.
	 * @param {number} deltaX - The horizontal delta.
	 * @param {number} deltaY - The vertical delta.
	 * @param {number} columns - The number of columns.
	 * @param {number} totalItems - The total items count.
	 * @returns {number} The new index.
	 */
	getGridMovePosition(indexCurrent, deltaX, deltaY, columns, totalItems) {
		if (indexCurrent === -1) return deltaY > 0 ? 0 : totalItems - 1;

		const currentRow = Math.floor(indexCurrent / columns);
		const currentCol = indexCurrent % columns;

		const newRow = Math.max(0, Math.min(Math.ceil(totalItems / columns) - 1, currentRow + deltaY));
		const newCol = Math.max(0, Math.min(columns - 1, currentCol + deltaX));

		const newIndex = newRow * columns + newCol;
		return newIndex >= totalItems ? totalItems - 1 : newIndex;
	}

	/**
	 * Gets screen position for a grid thumbnail by index.
	 * @param {number} albumIndex - The album index in grid.
	 * @returns {Object} The screen position with x and y.
	 */
	getGridThumbScreenPosition(albumIndex) {
		const column = albumIndex % lib.ex.main.grid.columns;
		const row = Math.floor(albumIndex / lib.ex.main.grid.columns);

		// Calculate relative position within the grid content
		const relX = column * (lib.ex.main.grid.thumbSize + lib.ex.main.grid.thumbGap) + lib.ex.main.grid.thumbMargin;
		const relY = row * lib.ex.main.grid.rowH - lib.ex.sbar.scrollCurrent;

		// Convert to absolute screen/viewport coordinates
		return { x: lib.ex.main.ui.column.x + relX, y: lib.ex.main.ui.viewportY + relY };
	}

	/**
	 * Gets hovered album track index.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {number} The track index or -1.
	 */
	getHoveredAlbumTrackIndex(x, y) {
		if (!lib.ex.main.isAlbumOrDetailsView || x < lib.ex.main.ui.column.x || y < lib.ex.main.ui.viewportY) {
			return -1;
		}

		// Details view
		if (lib.ex.main.isDetailsView) {
			let cumY = 0;
			const relativeY = y - lib.ex.main.ui.viewportY + lib.ex.sbar.scrollCurrent;

			for (let i = 0; i < lib.ex.data.detailsList.length; i++) {
				const h = lib.ex.data.detailsList[i].height || lib.ex.album.trackHeight;
				if (relativeY >= cumY && relativeY < cumY + h) return i;
				cumY += h;
			}

			return -1;
		}

		// Album view
		let cumY = 0;
		const relativeY = y - lib.ex.main.ui.viewportY + lib.ex.sbar.scrollCurrent;

		for (const item of lib.ex.album.discLayoutItems) {
			if (relativeY >= cumY && relativeY < cumY + item.height) {
				return item.type === 'track' ? item.trackIndex : -1; // -1 = disc header
			}
			cumY += item.height;
		}

		return -1;
	}

	/**
	 * Gets the disc group index under the mouse, or -1 if not over a disc header.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {number} The disc group index or -1.
	 */
	getHoveredDiscHeaderIndex(x, y) {
		if (!lib.ex.main.isAlbumView || x < lib.ex.main.ui.column.x || y < lib.ex.main.ui.viewportY) {
			return -1;
		}

		let cumY = 0;
		const relativeY = y - lib.ex.main.ui.viewportY + lib.ex.sbar.scrollCurrent;

		for (const item of lib.ex.album.discLayoutItems) {
			if (relativeY >= cumY && relativeY < cumY + item.height) {
				return item.type === 'disc' ? item.discIndex : -1;
			}
			cumY += item.height;
		}

		return -1;
	}

	/**
	 * Gets hovered grid album index.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {number} The album index or -1.
	 */
	getHoveredGridAlbumIndex(x, y) {
		if (lib.ex.main.isAlbumView || x < lib.ex.main.ui.column.x || y < lib.ex.main.ui.viewportY) {
			return -1;
		}

		const relativeY = y - lib.ex.main.ui.viewportY + lib.ex.sbar.scrollCurrent;
		const row = Math.floor(relativeY / lib.ex.main.grid.rowH);
		const relativeX = x - lib.ex.main.ui.column.x;
		const column = Math.floor(relativeX / (lib.ex.main.grid.thumbSize + lib.ex.main.grid.thumbGap));
		const albumIndex = row * lib.ex.main.grid.columns + column;
		const cellWidth = lib.ex.main.grid.thumbSize + lib.ex.main.grid.thumbGap;
		const thumbnailLeft = column * cellWidth + lib.ex.main.grid.thumbMargin;

		const isValidColumn = column >= 0 && column < lib.ex.main.grid.columns;
		const isInsideThumbnail = relativeX >= thumbnailLeft && relativeX < thumbnailLeft + lib.ex.main.grid.thumbSize;
		const isValidAlbumIndex = albumIndex < (
			lib.ex.main.isMissingReleasesView ? lib.ex.data.missingReleasesList.length :
			lib.ex.main.isSimilarArtistView ? lib.ex.data.similarArtistList.length :
			lib.ex.data.albumsList.length
		);

		if (isValidColumn && isInsideThumbnail && isValidAlbumIndex) {
			return albumIndex;
		}

		return -1;
	}

	/**
	 * Gets hovered grid download icon index.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {number} The album index or -1.
	 */
	getHoveredGridDownloadIconIndex(x, y) {
		if (!this.mouseInViewport(x, y)) return -1;

		const albumIndex = this.getHoveredGridAlbumIndex(x, y);
		if (albumIndex === -1) return -1;

		const items = lib.ex.utils.getGridItems();
		const item = items[albumIndex];

		if (!item.thumbStub) return -1;

		const thumbPos = lib.ex.utils.getGridThumbScreenPosition(albumIndex);
		const bounds = lib.ex.utils.getGridDownloadIconBounds(thumbPos.x, thumbPos.y);

		const inBounds =
			x >= bounds.x && x < bounds.x + bounds.size &&
			y >= bounds.y && y < bounds.y + bounds.size;

		return inBounds ? albumIndex : -1;
	}

	/**
	 * Gets total height of scrollable content.
	 * @returns {number} The total content height.
	 */
	getScrollContentTotalHeight() {
		if (lib.ex.main.isAlbumView) {
			return lib.ex.album.discLayoutItems.reduce((sum, item) => sum + item.height, 0);
		}
		else if (lib.ex.main.isArtistOrSimilarView) {
			const numRows = Math.ceil((lib.ex.main.isSimilarArtistView ? lib.ex.data.similarArtistList.length : lib.ex.data.albumsList.length) / lib.ex.main.grid.columns);
			return numRows * lib.ex.main.grid.rowH + 2 * lib.ex.main.grid.thumbMargin - lib.ex.main.grid.thumbGap;
		}
		else if (lib.ex.main.isMissingReleasesView) {
			const numRows = Math.ceil(lib.ex.data.missingReleasesList.length / lib.ex.main.grid.columns);
			return numRows * lib.ex.main.grid.rowH + 2 * lib.ex.main.grid.thumbMargin - lib.ex.main.grid.thumbGap;
		}
		else if (lib.ex.main.isDetailsView) {
			return lib.ex.data.detailsList.reduce((sum, detail) => sum + (detail.height || lib.ex.album.trackHeight), 0);
		}

		return 0;
	}
	// #endregion


	// * HIT TESTING * //
	// #region HIT TESTING
	/**
	 * Checks if mouse is in explorer bounds.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if in explorer.
	 */
	mouseInExplorer(x, y) {
		if (!lib.ex.main.state.visible) return false;

		return x >= lib.ex.main.ui.explorer.x && x < lib.ex.main.ui.explorer.x + lib.ex.main.ui.explorer.w
			&& y >= lib.ex.main.ui.explorer.y && y < lib.ex.main.ui.explorer.y + lib.ex.main.ui.explorer.h;
	}

	/**
	 * Checks if mouse is over the left album artwork.
	 * @param {number} x - x-coordinate.
	 * @param {number} y - y-coordinate.
	 * @returns {boolean} True if over artwork.
	 */
	mouseInAlbumArt(x, y) {
		if (lib.ex.main.artwork.size <= 0) return false;

		return x >= lib.ex.main.ui.mainContainer.x && x < lib.ex.main.ui.mainContainer.x + lib.ex.main.artwork.size
			&& y >= lib.ex.main.ui.mainContainer.y && y < lib.ex.main.ui.mainContainer.y + lib.ex.main.ui.mainContainer.h;
	}

	/**
	 * Checks if mouse is over album rating.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if over rating.
	 */
	mouseInAlbumRating(x, y) {
		if (!lib.ex.main.isAlbumOrDetailsView || lib.ex.data.albumRating <= 0) {
			return false;
		}

		return x >= lib.ex.album.albumRatingX && x < lib.ex.album.albumRatingX + lib.ex.album.albumRatingW
			&& y >= lib.ex.main.ui.headerAlbumRatingY && y < lib.ex.main.ui.headerAlbumRatingY + lib.ex.main.ui.headerLineHeight;
	}

	/**
	 * Checks if mouse is over album title.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if over title.
	 */
	mouseInAlbumTitle(x, y) {
		return x >= lib.ex.main.ui.column.x && x < lib.ex.main.ui.column.x + lib.ex.main.ui.albumW
			&& y >= lib.ex.main.ui.headerAlbumY && y < lib.ex.main.ui.headerAlbumY + lib.ex.main.ui.headerLineHeight;
	}

	/**
	 * Checks if mouse is over album summary.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if over summary.
	 */
	mouseInAlbumSummary(x, y) {
		return x >= lib.ex.main.ui.column.x && x < lib.ex.main.ui.column.x + lib.ex.main.ui.summaryW
			&& y >= lib.ex.main.ui.headerAlbumY && y < lib.ex.main.ui.headerAlbumY + lib.ex.main.ui.headerLineHeight;
	}

	/**
	 * Checks if mouse is over album year.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if over year.
	 */
	mouseInAlbumYear(x, y) {
		return x >= lib.ex.main.ui.column.x + lib.ex.main.ui.durationX && x < lib.ex.main.ui.column.x + lib.ex.main.ui.durationX + lib.ex.main.ui.durationW
			&& y >= lib.ex.main.ui.headerAlbumY && y < lib.ex.main.ui.headerAlbumY + lib.ex.main.ui.headerLineHeight;
	}

	/**
	 * Checks if mouse is over artist name.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if over artist name.
	 */
	mouseInArtistName(x, y) {
		return x >= lib.ex.main.ui.column.x && x < lib.ex.main.ui.column.x + lib.ex.main.ui.artistW
			&& y >= lib.ex.main.ui.headerArtistY && y < lib.ex.main.ui.headerArtistY + lib.ex.main.ui.headerLineHeight;
	}

	/**
	 * Checks if mouse is over country flag.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if over flag.
	 */
	mouseInArtistFlag(x, y) {
		if (lib.ex.main.ui.flagSize <= 0) return false;

		return x >= lib.ex.main.ui.flagX && x < lib.ex.main.ui.flagX + lib.ex.main.ui.flagSize
			&& y >= lib.ex.main.ui.headerArtistY && y < lib.ex.main.ui.headerArtistY + lib.ex.main.ui.headerLineHeight;
	}

	/**
	 * Checks if mouse is over close button.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if over close button.
	 */
	mouseInCloseButton(x, y) {
		lib.ex.button.closeButton.show =
			x >= lib.ex.button.closeButton.x && x < lib.ex.button.closeButton.x + lib.ex.button.closeButton.w &&
			y >= lib.ex.button.closeButton.y && y < lib.ex.button.closeButton.y + lib.ex.button.closeButton.h;

		return lib.ex.button.closeButton.show;
	}

	/**
	 * Checks if mouse is over details navigation button.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {string|null} [part] - The button part ('prev', 'next', or null for any).
	 * @returns {boolean} True if over button.
	 */
	mouseInDetailsButton(x, y, part = null) {
		if (!lib.ex.main.isDetailsView || lib.ex.data.detailsList.length === 0 ||
			y < lib.ex.main.ui.viewportY || y >= lib.ex.details.navEndY) {
			return false;
		}

		return part === 'prev' ? x >= lib.ex.details.prevButtonScreenX1 && x < lib.ex.details.prevButtonScreenX2 :
			   part === 'next' ? x >= lib.ex.details.nextButtonScreenX1 && x < lib.ex.details.nextButtonScreenX2 :
			   x >= lib.ex.details.prevButtonScreenX1 && x < lib.ex.details.nextButtonScreenX2;
	}

	/**
	 * Checks if mouse is over artwork download icon.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if over icon.
	 */
	mouseInDownloadIconArtwork(x, y) {
		if (!lib.ex.main.isArtworkStub() && !lib.ex.main.isGridView) {
			return false;
		}

		return x >= lib.ex.main.artwork.downloadIconX && x < lib.ex.main.artwork.downloadIconX + lib.ex.main.artwork.downloadIconSize
			&& y >= lib.ex.main.artwork.downloadIconY && y < lib.ex.main.artwork.downloadIconY + lib.ex.main.artwork.downloadIconSize;
	}

	/**
	 * Checks if mouse is over scrollbar.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if over scrollbar.
	 */
	mouseInScrollbar(x, y) {
		const hasScrollbar = this.getScrollContentTotalHeight() > lib.ex.main.ui.viewportH;
		if (!hasScrollbar) return false;

		return x >= lib.ex.main.ui.column.x + lib.ex.main.ui.column.w && x < lib.ex.main.ui.column.x + lib.ex.main.ui.column.w + lib.ex.main.ui.margin30
			&& y >= lib.ex.main.ui.viewportY && y < lib.ex.main.ui.viewportY + lib.ex.main.ui.viewportH;
	}

	/**
	 * Checks if mouse is over missing releases source.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if over source.
	 */
	mouseInMissingReleasesSource(x, y) {
		return x >= lib.ex.missing.sourceX && x < lib.ex.missing.sourceX + lib.ex.missing.sourceTextW
			&& y >= lib.ex.main.ui.headerAlbumY && y < lib.ex.main.ui.headerAlbumY + lib.ex.main.ui.headerLineHeight;
	}

	/**
	 * Checks if mouse is over similar artist source.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if over source.
	 */
	mouseInSimilarArtistSource(x, y) {
		return x >= lib.ex.similar.sourceX && x < lib.ex.similar.sourceX + lib.ex.similar.sourceTextW
			&& y >= lib.ex.main.ui.headerAlbumY && y < lib.ex.main.ui.headerAlbumY + lib.ex.main.ui.headerLineHeight;
	}

	/**
	 * Checks if mouse is over similar artist toggle.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if over toggle.
	 */
	mouseInSimilarArtistToggle(x, y) {
		return x >= lib.ex.similar.toggleX && x < lib.ex.similar.toggleX + lib.ex.similar.toggleTextW
			&& y >= lib.ex.main.ui.headerAlbumY && y < lib.ex.main.ui.headerAlbumY + lib.ex.main.ui.headerLineHeight;
	}

	/**
	 * Checks if mouse is over subheader.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if over subheader.
	 */
	mouseInSubheader(x, y) {
		return y >= lib.ex.main.ui.infoY && y < lib.ex.main.ui.infoY + lib.ex.main.ui.infoH
			&& x >= lib.ex.main.ui.column.x && x < lib.ex.main.ui.column.x + lib.ex.main.ui.subheaderMaxInfoW;
	}

	/**
	 * Checks if mouse is over tabs bar.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if over tabs.
	 */
	mouseInTabs(x, y) {
		return x >= lib.ex.main.ui.column.x && x < lib.ex.main.ui.column.x + lib.ex.main.ui.column.w
			&& y >= lib.ex.button.tabs.tabsY && y < lib.ex.button.tabs.tabIconY + lib.ex.button.tabs.tabsHeight;
	}

	/**
	 * Checks if mouse is over track rating.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} trackIndex - The track index.
	 * @returns {boolean} True if over rating.
	 */
	mouseInTrackRating(x, y, trackIndex) {
		if (trackIndex === undefined) return false;
		const trackY = this.getAlbumTrackY(trackIndex);

		return x >= lib.ex.main.ui.column.x + lib.ex.album.trackRatingX && x < lib.ex.main.ui.column.x + lib.ex.album.trackRatingX + lib.ex.album.ratingW
			&& y >= trackY && y < trackY + lib.ex.album.trackHeight;
	}

	/**
	 * Checks if mouse is in viewport area.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if in viewport.
	 */
	mouseInViewport(x, y) {
		return x >= lib.ex.main.ui.column.x && x < lib.ex.main.ui.column.x + lib.ex.main.ui.column.w
			&& y >= lib.ex.main.ui.viewportY && y < lib.ex.main.ui.viewportY + lib.ex.main.ui.viewportH;
	}
	// #endregion


	// * REPAINTS * //
	// #region REPAINTS
	/**
	 * Repaints the left artwork area.
	 */
	repaintArtwork() {
		if (lib.ex.main.state.compactMode || lib.ex.main.artwork.size <= 0) return;
		window.RepaintRect(lib.ex.main.ui.mainContainer.x, lib.ex.main.ui.mainContainer.y, lib.ex.main.artwork.size + lib.ex.main.ui.margin30, lib.ex.main.ui.mainContainer.h);
	}

	/**
	 * Repaints the entire explorer.
	 */
	repaintExplorer() {
		window.RepaintRect(lib.ex.main.ui.explorer.x, lib.ex.main.ui.explorer.y, lib.ex.main.ui.explorer.w, lib.ex.main.ui.explorer.h);
	}

	/**
	 * Repaints the close button.
	 */
	repaintCloseButton() {
		window.RepaintRect(lib.ex.button.closeButton.x, lib.ex.button.closeButton.y, lib.ex.button.closeButton.w, lib.ex.button.closeButton.h);
	}

	/**
	 * Repaints the column area.
	 */
	repaintColumn() {
		window.RepaintRect(lib.ex.main.ui.column.x - lib.ex.main.ui.margin30, lib.ex.main.ui.column.y, lib.ex.main.ui.column.w + lib.ex.main.ui.margin60, lib.ex.main.ui.column.h);
	}

	/**
	 * Repaints the header area.
	 */
	repaintHeader() {
		window.RepaintRect(lib.ex.main.ui.column.x - lib.ex.main.ui.margin20, lib.ex.main.ui.headerY, lib.ex.main.ui.column.w + lib.ex.main.ui.margin, lib.ex.main.ui.headerH);
	}

	/**
	 * Repaints the subheader area.
	 */
	repaintSubheader() {
		window.RepaintRect(lib.ex.main.ui.column.x - lib.ex.main.ui.margin20, lib.ex.main.ui.infoY - lib.ex.main.ui.margin10, lib.ex.main.ui.column.w + lib.ex.main.ui.margin, lib.ex.main.ui.infoH + lib.ex.main.ui.margin20);
	}

	/**
	 * Repaints the scrollbar.
	 */
	repaintScrollbar() {
		window.RepaintRect(lib.ex.main.ui.column.x + lib.ex.main.ui.column.w, lib.ex.main.ui.viewportY - lib.ex.main.ui.margin20, lib.ex.sbar.w * 3, lib.ex.main.ui.viewportH + lib.ex.main.ui.margin);
	}

	/**
	 * Repaints the tabs bar.
	 */
	repaintTabs() {
		window.RepaintRect(lib.ex.main.ui.column.x - lib.ex.main.ui.margin20, lib.ex.button.tabs.tabsY, lib.ex.main.ui.column.w + lib.ex.main.ui.margin, lib.ex.button.tabs.tabsHeight + lib.ex.main.ui.margin20);
	}

	/**
	 * Repaints the viewport area.
	 */
	repaintViewport() {
		window.RepaintRect(lib.ex.main.ui.column.x - lib.ex.main.ui.margin20, lib.ex.main.ui.viewportY - lib.ex.main.ui.margin20, lib.ex.main.ui.column.w + lib.ex.main.ui.margin, lib.ex.main.ui.viewportH + lib.ex.main.ui.margin);
	}
	// #endregion
}


/**
 * The `LibExplorerWeb` class for managing the web API interactions for the explorer.
 * @class
 */
class LibExplorerWeb {
	/**
	 * Creates a LibExplorerWeb instance.
	 * @constructor
	 */
	constructor() {
		/** @type {boolean} The flag to prevent duplicate error popups */
		this.albumImageMoveErrorShown = false;
		/** @type {boolean} The album cover auto-download state. */
		this.albumImageDLAuto = libSet.explorerAlbumImageDLAuto || true;
		/** @type {string} The album cover download quality. */
		this.albumImageDLQuality = libSet.explorerAlbumImageDLQuality || 'original';
		/** @type {boolean} The post-download auto action. */
		this.albumImageAutoAction = libSet.explorerAlbumImageAutoAction || 'move';
		/** @type {boolean} The auto-move album cover name to album directory. */
		this.albumImageNameMoveToDir = libSet.explorerAlbumImageNameMoveToDir || 'folder';
		/** @type {boolean} The artist image auto-downloads state. */
		this.artistImageDLAuto = libSet.explorerArtistImageDLAuto;
		/** @type {number} The artist image download count. */
		this.artistImageDLCount = libSet.explorerArtistImageDLCount;
		/** @type {string} The artist image download quality. */
		this.artistImageDLQuality = libSet.explorerArtistImageDLQuality;
		/** @type {string} The missing releases image auto-downloads. */
		this.missingReleasesImageDLAuto = libSet.explorerMissingReleasesImageDLAuto;
		/** @type {string} The similar artist image auto-downloads. */
		this.similarArtistImageDLAuto = libSet.explorerSimilarArtistImageDLAuto;

		/** @type {boolean} The flag to prevent concurrent popularity fetches. */
		this.popularityFetching = false;
		/** @type {string} The popularity fetch source ('lastfm', 'listenbrainz'). */
		this.popularityFetchSource = libSet.explorerPopularityFetchSource || 'lastfm';

		/** @type {string} Pre-processed and cleaned up request parameter string. */
		this.cleanStrLF = ((s = '=yek_ipa&L4|e9f21088bAd|64f9097b4Sf|349ad4e7f4T6|4387abab981e'.replace(Regex.UtilCleanStr, '')) =>
			s.slice(0, 9).split('').reverse().join('') + s.slice(9))();

		/** @type {string} Pre-processed and cleaned up request parameter string. */
		this.cleanStrDG = ((s = '=nekot&De|t3nKepWJqiIe|z9AZriBaesDcCo|4aoyaJSPZOiXGS|4fRujeFvYOKlfr'.replace(Regex.UtilCleanStr, '')) =>
			s.slice(0, 7).split('').reverse().join('') + s.slice(7))();
	}


	// * UTILITY - WEB * //
	// #region UTILITY - WEB
	/**
	 * Creates labels and values for predefined and custom website links.
	 * @param {Array} customWebsiteLinks - The array of custom website URLs.
	 * @returns {Object} - The object containing combined labels and values.
	 */
	createWebsiteLinks(customWebsiteLinks) {
		const customLabels = customWebsiteLinks.map((url) => this.getWebsiteDomain(url));
		const customValues = customWebsiteLinks.map((url) => this.getWebsiteDomain(url));

		const labels = ['Google', 'Google Images', 'Wikipedia', 'YouTube', 'Last.fm', 'AllMusic', 'Discogs', 'MusicBrainz', 'Bandcamp', 'Album of the Year', 'Rate Your Music', 'Sputnikmusic'];
		const values = ['google', 'googleImages', 'wikipedia', 'youTube', 'lastfm', 'allMusic', 'discogs', 'musicBrainz', 'bandcamp', 'aoty', 'rym', 'sputnikmusic'];

		const websiteLabels = labels.concat(customLabels);
		const websiteValues = values.concat(customValues);

		return { websiteLabels, websiteValues };
	}

	/**
	 * Extracts the domain name from a given URL and formats it.
	 * @param {string} url - The URL from which to extract the domain name.
	 * @returns {string} The formatted domain name.
	 */
	getWebsiteDomain(url) {
		const domain = url.match(Regex.WebDomain);
		return domain ? (domain[2].charAt(0).toUpperCase() + domain[2].slice(1).replace(Regex.WebTopLevelDomain, '')) : url;
	}

	/**
	 * Makes an HTTP GET request.
	 * @param {string} url - The request URL.
	 * @param {Function} callback - The callback function(error, data).
	 * @param {boolean} [parseJson] - The optional flag to parse response as JSON.
	 */
	httpGet(url, callback, parseJson = true) {
		const headers = JSON.stringify({ 'User-Agent': 'foobar2000' });
		const taskId = utils.HTTPRequestAsync(0, url, headers);
		lib.ex.main.state.pendingHttpRequests.set(taskId, { callback, parseJson });
	}

	/**
	 * Opens website for a similar artist.
	 * @param {number} artistIndex - The index of similar artist.
	 */
	openWebsiteSimilarArtist(artistIndex) {
		const item = lib.ex.data.similarArtistList[artistIndex];
		if (!item) return;

		const lastfm = `https://www.last.fm/music/${encodeURIComponent(item.name)}`;
		const mbrainzMBID = item.mbid ? `https://musicbrainz.org/artist/${item.mbid}` : null;
		const mbrainz = `https://musicbrainz.org/search?query=${encodeURIComponent(item.name)}&type=artist&method=indexed`;
		const url = lib.ex.similar.source === 'lastfm' ? lastfm : (mbrainzMBID || mbrainz);

		this.openWebsite(url);
	}

	/**
	 * Opens a website based on the provided input (site name, URL, or all predefined sites).
	 * @param {string} [input] - The name of the website, a direct URL, or undefined for openAll.
	 * @param {FbMetadbHandle} [metadb] - The metadata handle of the track (required for site names).
	 * @param {boolean} [openAll] - The optional flag to open all predefined websites (overrides input if true).
	 */
	openWebsite(input, metadb, openAll = false) {
		const websites = [
			'google', 'googleImages', 'wikipedia', 'youTube', 'lastfm', 'allMusic',
			'discogs', 'musicBrainz', 'bandcamp', 'aoty', 'rym', 'sputnikmusic'
		];

		if (openAll) {
			for (const site of websites) {
				this.websiteLink(site, metadb);
			}
			return;
		}

		// Direct full URL (used by Similar Artists external link, etc.)
		if (input && (input.startsWith('http://') || input.startsWith('https://'))) {
			RunCmd(input);
			return;
		}

		// Predefined site OR custom website domain key
		const site = input || websites[0];
		this.websiteLink(site, metadb);
	}

	/**
	 * Constructs a search URL for a specified website using available track metadata.
	 * @param {string} website - The name of the website to generate a search URL for.
	 * @param {FbMetadbHandle} metadb - The metadata handle of the track.
	 */
	websiteLink(website, metadb) {
		if (!metadb) return;

		const metaInfo = metadb.GetFileInfo();
		const getMetaValue = (metafield) => {
			const index = metaInfo.MetaFind(metafield);
			return index === -1 ? '' : metaInfo.MetaValue(index, 0);
		};

		const artist = getMetaValue('artist').replace(Regex.SpaceAll, '+').replace(/&/g, '%26');
		const album = getMetaValue('album').replace(Regex.SpaceAll, '+');
		const title = getMetaValue('title').replace(Regex.SpaceAll, '+');
		const searchQuery = artist || title;

		const metadata = { artist, album, title };
		const missingMeta = Object.keys(metadata).filter(key => !metadata[key]).map(key => `%${key}%`);

		if (missingMeta.length > 0) {
			const missingFields = missingMeta.join('\n');
			const msg = `Web search aborted!\n\nPlease provide the necessary\nmetadata fields for:\n\n${missingFields}\n\n`;
			grm.msg.showPopup(true, msg, msg, 'OK', null, (confirmed) => {});
			return;
		}

		const replacePlaceholders = (link) => link
			.replace('{artist}', artist)
			.replace('{title}', title)
			.replace('{album}', album);

		const urls = {
			google: `https://google.com/search?q=${searchQuery}`,
			googleImages: `https://images.google.com/images?hl=en&q=${searchQuery}`,
			wikipedia: `https://en.wikipedia.org/wiki/${artist.replace(Regex.PunctPlus, '_')}`,
			youTube: `https://www.youtube.com/results?search_type=&search_query=${searchQuery}`,
			lastfm: `https://www.last.fm/music/${searchQuery.replace('/', '%252F')}`,
			allMusic: `https://www.allmusic.com/search/all/${searchQuery}`,
			discogs: `https://www.discogs.com/search?q=${searchQuery}+${album}`,
			musicBrainz: `https://musicbrainz.org/taglookup/index?tag-lookup.artist=${searchQuery}&tag-lookup.release=${album}`,
			bandcamp: `https://bandcamp.com/search?q=${searchQuery}&item_type`,
			aoty: `https://www.albumoftheyear.org/search/?q=${searchQuery}+${album}`,
			rym: `https://rateyourmusic.com/search?searchterm=${searchQuery}+${album}`,
			sputnikmusic: `https://www.sputnikmusic.com/search_results.php?search_in=Bands&search_text=${searchQuery}`,
			default: 'https://github.com/TT-ReBORN/Georgia-ReBORN'
		};

		// Add custom URLs to the urls object
		for (const link of grCfg.customWebsiteLinks || []) {
			const domain = this.getWebsiteDomain(link);
			urls[domain] = replacePlaceholders(link);
		}

		RunCmd(urls[website] || urls.default);
	}
	// #endregion


	// * UTILITY - WEB - API * //
	// #region UTILITY - WEB - API
	/**
	 * Gets app-specific error messages for non-server issues.
	 * @param {string} code - The error code key (e.g., 'noToken', 'noArtistMatch').
	 * @param {string} [serverName] - The optional server name for context.
	 * @returns {string} The formatted error message.
	 */
	getErrorAppMessage(code, serverName = '') {
		const messages = {
			noToken: `${serverName} token not configured.`,
			noArtistMatch: `No exact artist match found on ${serverName}.`,
			noMBID: 'No MusicBrainz ID found for artist.',
		};

		return messages[code] || 'An unexpected error occurred.';
	}

	/**
	 * Gets server HTTP errors and translates them into human-readable messages.
	 * @param {Object} error - The error object from httpGet
	 * @param {string} serverName - The server name - 'Discogs', 'Last.fm', 'ListenBrainz', 'MusicBrainz'.
	 */
	getErrorServerMessage(error, serverName) {
		if (!error) return '';

		const errorMatch = error.message && error.message.match(Regex.NumHttpStatus);
		const errorStatus = error.status || (errorMatch && errorMatch[0]) || 0;
		const errorCode = error.message || `HTTP ${errorStatus}`;
		let userMessage = '';

		if (errorStatus >= 500 && errorStatus < 600) {
			userMessage = `${serverName} server is temporarily unavailable.\nPlease try again later.`;
		}
		else if (errorStatus === 401 || errorStatus === 403) {
			userMessage = `Authentication failed.\nPlease check your ${serverName} API token/key in settings.`;
		}
		else if (errorStatus === 404) {
			userMessage = `Artist not found on ${serverName}.`;
		}
		else if (errorStatus === 429) {
			userMessage = `${serverName} rate limit exceeded.\nPlease wait a moment before trying again.`;
		}
		else if (!errorStatus || errorStatus === 0) {
			userMessage = `Cannot connect to ${serverName}.\nCheck your internet connection.`;
		}
		else {
			userMessage = `${serverName} request failed.\nPlease try again.`;
		}

		return `${errorCode}\n\n${userMessage}`;
	}

	/**
	 * Handles automatic post-download action for successfully downloaded album covers.
	 * @param {string} cachePath - The full path to the downloaded cache file.
	 * @param {string} artistName - The artist name.
	 * @param {string} albumName - The album name.
	 * @param {GdiBitmap} downloadedImg - The loaded image (for embed or fallback display).
	 */
	albumCoverAutoAction(cachePath, artistName, albumName, downloadedImg) {
		if (!downloadedImg) return;

		lib.ex.main.updateArtworkImage(downloadedImg);

		if (this.albumImageAutoAction === 'disabled') {
			return;
		}

		const handles = lib.ex.data.getHandlesAlbum(artistName, albumName);

		if (handles.Count === 0) {
			console.log(`Library Explorer => No handles found, skipping auto-action`);
			return;
		}

		// * Move album cover to album directory
		if (this.albumImageAutoAction === 'move') {
			const firstTrackPath = handles[0].Path;
			const albumDir = firstTrackPath.substring(0, firstTrackPath.lastIndexOf('\\') + 1);
			const targetPath = `${albumDir}${this.albumImageNameMoveToDir}.jpg`;

			if ($Lib.file(targetPath)) {
				console.log(`Library Explorer => Album cover already exists in folder, skipping move`);
				return;
			}

			this.albumCoverMoveToDir(cachePath, artistName, albumName);

		}
		// * Embedd album cover to music files
		else if (this.albumImageAutoAction === 'embed') {
			try {
				const existingArt = utils.GetAlbumArtV2(handles[0], AlbumArtId.Front);

				// Skip if already has artwork with reasonable quality (500px+ width)
				if (existingArt && existingArt.Width >= 500) {
					console.log(`Library Explorer => Album cover already embedded (${existingArt.Width}x${existingArt.Height}), skipping`);
					return;
				}
			}
			catch (e) {
				console.log(`Library Explorer => Could not check existing artwork: ${e.message}`);
			}

			this.albumCoverEmbedToTracks(cachePath, handles, artistName, albumName, downloadedImg);
		}
	}

	/**
	 * Embeds the downloaded album cover into all tracks of the album.
	 * @param {string} cachePath - The full path to the downloaded cache file.
	 * @param {FbMetadbHandleList} handles - The track handles.
	 * @param {string} artistName - The artist name.
	 * @param {string} albumName - The album name.
	 * @param {GdiBitmap} downloadedImg - The loaded image (for final display fallback).
	 */
	albumCoverEmbedToTracks(cachePath, handles, artistName, albumName, downloadedImg) {
		if (!handles || handles.Count === 0 || !$Lib.file(cachePath)) {
			console.log(`Library Explorer => Embed skipped: no handles or file missing (${artistName} - ${albumName})`);
			lib.ex.main.updateArtworkImage(downloadedImg);
			return;
		}

		try {
			handles.AttachImage(cachePath, AlbumArtId.Front);
			handles.RefreshStats(); // Force refresh to see if it worked

			// Clean up cache file even on failure to re-download and try again
			try {
				if ($Lib.file(cachePath)) {
					libFSO.DeleteFile(cachePath, true);
				}
			} catch (e) {
				console.log(`Library Explorer => Could not delete cache file: ${e.message}`);
			}

			lib.ex.main.updateArtworkImage(downloadedImg);
		}
		catch (e) {
			const msg  = grm.msg.getMessage('menu', 'explorerAlbumImageAutoEmbedFail');
			grm.msg.showPopup(true, msg, msg, 'OK', null, (confirmed) => {});
			lib.ex.main.updateArtworkImage(downloadedImg);
			console.log(`Library Explorer => Embed failed (${artistName} - ${albumName}): ${e.message || e}`);
		}
	}

	/**
	 * Moves downloaded album cover to the album's local directory.
	 * @param {string} sourcePath - The source cache file path.
	 * @param {string} artistName - The artist name.
	 * @param {string} albumName - The album name.
	 * @returns {boolean} The success state.
	 */
	albumCoverMoveToDir(sourcePath, artistName, albumName) {
		// Get album directory from first track
		const handles = lib.ex.data.getHandlesAlbum(artistName, albumName);
		if (handles.Count === 0) {
			return false;
		}

		const firstTrackPath = handles[0].Path;
		const albumDir = firstTrackPath.substring(0, firstTrackPath.lastIndexOf('\\') + 1);
		const sourceExt = sourcePath.toLowerCase().split('.').pop();
		const targetPath = `${albumDir}${this.albumImageNameMoveToDir}.${sourceExt}`;

		// Don't overwrite existing album image
		if ($Lib.file(targetPath)) {
			return false;
		}

		try {
			libFSO.CopyFile(sourcePath, targetPath, false);

			// Only delete cache file if copy succeeded
			if ($Lib.file(sourcePath)) {
				libFSO.DeleteFile(sourcePath, true);
			}

			// Load the image from new location and update artwork
			const img = gdi.Image(targetPath);
			lib.ex.main.updateArtworkImage(img, true);
			this.albumImageMoveErrorShown = false;
			return true;
		}
		catch (e) {
			if (!this.albumImageMoveErrorShown) {
				const msg = grm.msg.getMessage('menu', 'explorerAlbumImageAutoMoveFail');
				grm.msg.showPopup(true, msg, msg, 'OK', null, (confirmed) => {});
				this.albumImageMoveErrorShown = true;
			}
			console.log(`Library Explorer => albumCoverMoveToDir failed (${artistName} - ${albumName})`);

			const img = gdi.Image(sourcePath);
			lib.ex.main.updateArtworkImage(img, true);
			return false;
		}
	}

	/**
	 * Fetches album cover by trying sources in order: iTunes -> MusicBrainz -> Bandcamp.
	 * @param {string} artistName - The artist name.
	 * @param {string} albumName - The album name.
	 * @param {string} quality - The image quality as sizes: 'thumb', 'small', 'large', 'original' (default: 'original').
	 * @param {Function} callback - The callback function(image, source, error).
	 */
	fetchAlbumCover(artistName, albumName, quality = 'original', callback) {
		if (libSet.explorerAlbumImageAutoAction === 'embed') {
			quality = 'medium'; // When embedding, force medium quality to avoid bloating file sizes
		}

		// Check if already in cache
		const errors = [];
		const cachePath = lib.ex.cache.getCachePath('albumCover', artistName, { albumName, size: quality });

		if ($Lib.file(cachePath)) {
			const img = gdi.Image(cachePath);
			if (img) {
				callback(img, null);
				return;
			}
		}

		// Promisify callback-based functions
		const promisify = (fn, ...args) => new Promise((resolve) => {
			fn.call(this, ...args, (result, err) => {
				const isSuccess = !!result;
				resolve({
					success: isSuccess,
					result,
					err: isSuccess ? null : (err || 'not found')
				});
			});
		});

		// Async source handlers for sequential execution
		// Highest quality (iTunes) to lowest quality (MusicBrainz)
		const sources = [
			{
				name: 'iTunes',
				handler: async () => {
					const res = await promisify(this.itunesFetchAlbumCover, artistName, albumName, quality);
					return { ...res, err: `fetch failed - ${res.err}` };
				}
			},
			{
				name: 'Bandcamp',
				handler: async () => {
					const res = await promisify(this.bandcampFetchAlbumCover, artistName, albumName, quality);
					return { ...res, err: `fetch failed - ${res.err}` };
				}
			},
			{
				name: 'MusicBrainz',
				handler: async () => {
					// Step 1: Search for Release ID
					const search = await promisify(this.musicBrainzSearchRelease, artistName, albumName);
					if (!search.success) {
						return { ...search, err: `search failed - ${search.err}` };
					}
					// Step 2: Fetch Cover using Release ID
					const fetch = await promisify(this.musicBrainzFetchAlbumCover, search.result, quality);
					return { ...fetch, err: `fetch failed - ${fetch.err || 'no cover available'}` };
				}
			}
		];

		const trySources = async () => {
			for (const source of sources) {
				const { success, result, err } = await source.handler();
				if (success) {
					return { img: result, source: source.name };
				}
				errors.push(`${source.name}: ${err}`);
			}
			return null; // All failed
		};

		trySources().then((result) => {
			if (result) {
				callback(result.img, result.source, null);
			} else {
				callback(null, null, `Failed to fetch album cover:\n${errors.join('\n')}`);
			}
		})
		.catch((unexpectedErr) => {
			callback(null, null, `Unexpected error: ${unexpectedErr.message || unexpectedErr}`);
		});
	}

	/**
	 * Fetches album cover from iTunes Search API.
	 * @param {string} artistName - The artist name.
	 * @param {string} albumName - The album name.
	 * @param {string} quality - The image quality as sizes: 'thumb' (340x340), 'small' (600x600), 'medium' (1200x1200), 'large' (1400x1400), 'original' (full resolution).
	 * @param {Function} callback - The callback function(image, error).
	 * @param {string} [cacheFile] - The optional cache file path, auto-generated if not provided.
	 */
	itunesFetchAlbumCover(artistName, albumName, quality = 'original', callback, cacheFile = null) {
		const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(artistName + ' ' + albumName)}&entity=album&limit=10`;

		this.httpGet(searchUrl, (err, json) => {
			if (err) {
				console.log(`Library Explorer => itunesFetchAlbumCover => Error: ${err.message}`);
				callback(null, this.getErrorServerMessage(err, 'iTunes'));
				return;
			}

			const results = json.results || [];
			if (results.length === 0) {
				console.log(`Library Explorer => itunesFetchAlbumCover => No results for ${artistName} - ${albumName}`);
				callback(null, this.getErrorAppMessage('noArtistMatch', 'iTunes'));
				return;
			}

			// Find best match - exact album name match preferred
			const albumLower = albumName.toLowerCase();
			const exactMatch = results.find(r => r.collectionName && r.collectionName.toLowerCase() === albumLower);
			const album = exactMatch || results[0];

			if (!album.artworkUrl100) {
				callback(null, 'No artwork available for this album.');
				return;
			}

			// iTunes image sizes - https://stackoverflow.com/questions/13382208/getting-bigger-artwork-images-from-itunes-web-search
			const imageSizes = {
				thumb: '340x340',
				small: '600x600',
				medium: '1200x1200',
				large: '1400x1400',
				original: '100000x100000-999'
			};
			const targetSize = imageSizes[quality] || imageSizes.original;
			const artworkUrl = album.artworkUrl100.replace('100x100', targetSize);
			const file = cacheFile || lib.ex.cache.getCachePath('albumCover', artistName, { albumName, size: quality });

			// Check if already cached
			if ($Lib.file(file)) {
				const cachedImg = gdi.Image(file);
				if (cachedImg) {
					lib.ex.main.state.pendingImages.delete(file);
					callback(cachedImg, null);
					return;
				}
				// If we get here, file exists but is corrupt. Log and re-download.
				console.log(`iTunes Cache corrupted for ${artistName}, re-downloading...`);
			}

			// Download the image
			lib.ex.main.state.pendingImages.set(file, (downloadedImg) => {
				lib.ex.main.state.pendingImages.delete(file);
				callback(downloadedImg || null, downloadedImg ? null : 'Download failed');
			});
			utils.DownloadFileAsync(artworkUrl, file);

		}, true);
	}

	/**
	 * Fetches album cover from Bandcamp (scraping).
	 * @param {string} artistName - The artist name.
	 * @param {string} albumName - The album name.
	 * @param {string} quality - The image quality as sizes: 'thumb' (300x300), 'small' (350x350), 'medium' (700x700), 'large' (1200x1200), 'original' (full resolution).
	 * @param {Function} callback - The callback function(image, error).
	 * @param {string} [cacheFile] - The optional cache file path, auto-generated if not provided.
	 */
	bandcampFetchAlbumCover(artistName, albumName, quality = 'original', callback, cacheFile = null) {
		const query = encodeURIComponent(`${artistName} ${albumName}`.trim());
		const searchUrl = `https://bandcamp.com/search?q=${query}&item_type=a`;

		this.httpGet(searchUrl, (err, responseText) => {
			if (err) {
				callback(null, this.getErrorServerMessage(err, 'Bandcamp'));
				return;
			}

			// Validate response
			if (!responseText || responseText.length < 100) {
				callback(null, 'Invalid response from Bandcamp.');
				return;
			}
			if (responseText.includes('Sorry, no results found')) {
				callback(null, 'No Bandcamp results for this album.');
				return;
			}

			let artUrl = null;

			// 1. popupImage href (most reliable)
			let match = responseText.match(Regex.WebBandcampPopupImageLink);
			if (match) artUrl = match[1];

			// 2. Fallback: img src in results
			if (!artUrl) {
				match = responseText.match(Regex.WebBandcampImgSrc);
				if (match) artUrl = match[1];
			}

			// 3. Any bcbits artwork URL
			if (!artUrl) {
				match = responseText.match(Regex.WebBandcampArtUrlAny);
				if (match) artUrl = match[1];
			}

			if (!artUrl) {
				callback(null, 'No Bandcamp artwork found for this album.');
				return;
			}

			// Bandcamp image sizes - https://community.metabrainz.org/t/reference-bandcamp-album-art-sizes/214623
			const imageSizes = {
				thumb: '4', // ~300px
				small: '2', // ~350px
				medium: '5', // ~700px
				large: '10', // ~1200px
				original: '0' // Original
			};
			const targetSize = imageSizes[quality] || imageSizes.original;

			// Replace size suffix safely
			artUrl = artUrl.replace(Regex.WebBandcampSizeSuffix, `_${targetSize}$1`);

			const file = cacheFile || lib.ex.cache.getCachePath('albumCover', artistName, { albumName, source: 'bandcamp', quality });

			// Check cache first
			if ($Lib.file(file)) {
				const cachedImg = gdi.Image(file);
				if (cachedImg) {
					lib.ex.main.state.pendingImages.delete(file);
					callback(cachedImg, null);
					return;
				}
				console.log(`Bandcamp Cache corrupted for ${artistName}, re-downloading...`);
			}

			// Download the image
			lib.ex.main.state.pendingImages.set(file, (downloadedImg) => {
				lib.ex.main.state.pendingImages.delete(file);
				callback(downloadedImg || null, downloadedImg ? null : 'Download failed');
			});
			utils.DownloadFileAsync(artUrl, file);
		}, false); // false = don't parse as JSON
	}

	/**
	 * Fetches album cover from MusicBrainz Cover Art Archive.
	 * @param {string} releaseMBID - The MusicBrainz release ID.
	 * @param {string} quality - The image quality as sizes: 'thumb' (250px), 'small' (500px), 'medium' (500px), 'large' (1200px), 'original' (full resolution).
	 * @param {Function} callback - The callback function(image, error).
	 * @param {string} [cacheFile] - The optional cache file path.
	 */
	musicBrainzFetchAlbumCover(releaseMBID, quality = 'original', callback, cacheFile = null) {
		if (!releaseMBID) {
			callback(null, 'No MusicBrainz Release ID provided.');
			return;
		}

		const apiUrl = `https://coverartarchive.org/release/${releaseMBID}`;

		this.httpGet(apiUrl, (err, json) => {
			if (err) {
				console.log(`Library Explorer => musicBrainzFetchAlbumCover => Error: ${err.message}`);
				callback(null, this.getErrorServerMessage(err, 'Cover Art Archive'));
				return;
			}

			const images = json.images || [];
			if (images.length === 0) {
				callback(null, 'No cover art available for this release.');
				return;
			}

			// Prefer front cover, fallback to first available
			const frontCover = images.find(img => img.front === true) || images[0];
			const imageUrls = frontCover.thumbnails || {};

			// Image sizes: https://musicbrainz.org/doc/Cover_Art_Archive/API
			const imageSizes = {
				thumb: imageUrls['250'] || imageUrls['500'] || frontCover.image,
				small: imageUrls['500'] || imageUrls['1200'] || frontCover.image,
				medium: imageUrls['500'] || imageUrls['1200'] || frontCover.image,
				large: imageUrls['1200'] || frontCover.image,
				original: frontCover.image
			};
			const imageUrl = imageSizes[quality] || imageSizes.original;

			if (!imageUrl) {
				callback(null, 'No valid image URL found.');
				return;
			}

			const file = cacheFile || lib.ex.cache.getCachePath('albumCover', releaseMBID, { quality });

			// Check if already cached
			if ($Lib.file(file)) {
				const cachedImg = gdi.Image(file);
				if (cachedImg) {
					lib.ex.main.state.pendingImages.delete(file);
					callback(cachedImg, null);
					return;
				}
				console.log(`MusicBrainz Cache corrupted for ${releaseMBID}, re-downloading...`);
			}

			// Download the image
			lib.ex.main.state.pendingImages.set(file, (downloadedImg) => {
				lib.ex.main.state.pendingImages.delete(file);
				callback(downloadedImg || null, downloadedImg ? null : 'Download failed');
			});
			utils.DownloadFileAsync(imageUrl, file);

		}, true);
	}

	/**
	 * Fetches artist discography from Discogs.
	 * @param {string} artistName - The artist name.
	 * @param {Array<string>} localAlbums - The array of local album names.
	 * @param {string} cacheFile - The cache file path.
	 */
	discogsFetchDiscography(artistName, localAlbums, cacheFile) {
		if (!this.cleanStrDG) {
			lib.ex.data.missingReleasesError = this.getErrorAppMessage('noToken', 'Discogs');
			lib.ex.main.state.loadingMissingReleases = false;
			lib.ex.utils.repaintViewport();
			return;
		}

		const artistUrl = `https://api.discogs.com/database/search?type=artist&q=${encodeURIComponent(artistName)}${this.cleanStrDG}&per_page=10`;

		this.httpGet(artistUrl, (err, data) => {
			if (err) {
				lib.ex.data.missingReleasesError = this.getErrorServerMessage(err, 'Discogs');
				lib.ex.main.state.loadingMissingReleases = false;
				lib.ex.utils.repaintViewport();
				return;
			}

			const artists = data.results || [];
			const matchingArtist = artists.find(a => a.title.startsWith(artistName)) ||
				artists.find(a => a.title.includes(artistName)) ||
				artists[0];

			if (!matchingArtist) {
				lib.ex.data.missingReleasesError = this.getErrorAppMessage('noArtistMatch', 'Discogs');
				lib.ex.main.state.loadingMissingReleases = false;
				lib.ex.utils.repaintViewport();
				return;
			}

			const artistId = matchingArtist.id;
			const allReleases = [];
			const fetchPage = (page) => {
				const releasesUrl = `https://api.discogs.com/artists/${artistId}/releases?sort=year&sort_order=desc&per_page=100&page=${page}${this.cleanStrDG}`;

				this.httpGet(releasesUrl, (err, releasesData) => {
					if (err) {
						lib.ex.data.missingReleasesError = this.getErrorServerMessage(err, 'Discogs');
						lib.ex.main.state.loadingMissingReleases = false;
						lib.ex.utils.repaintViewport();
						return;
					}

					allReleases.push(...releasesData.releases || []);

					if (page < releasesData.pagination.pages) {
						fetchPage(page + 1);
					} else {
						const onlineAlbums = lib.ex.missing.processDiscogsResults({ releases: allReleases }, localAlbums);
						lib.ex.missing.missingReleasesCacheIt(onlineAlbums, cacheFile);
						lib.ex.missing.missingReleasesDisplay(onlineAlbums);
						lib.ex.main.state.loadingMissingReleases = false;
						lib.ex.utils.repaintViewport();
					}
				});
			};
			fetchPage(1);
		});
	}

	/**
	 * Fetches artist images from Last.fm.
	 * @param {string} artistName - The artist name.
	 * @param {number} numImages - The number of images to fetch.
	 * @param {string} quality - The image quality as sizes: 'mini' (64px), 'thumb' (174px), 'small' (300px), 'medium' (770px), 'original' (full resolution).
	 * @param {boolean} force - The flag to force download even if cached.
	 * @param {Function} onComplete - The callback function(image).
	 * @param {string} [cacheFile] - The optional cache file path.
	 */
	lastfmFetchArtistImage(artistName, numImages, quality, force, onComplete, cacheFile = null) {
		const artistUrl = `https://www.last.fm/music/${encodeURIComponent(artistName)}/+images`;

		const imgSize = {
			mini: '64s',      // 64x64 px (square) - Small thumb
			thumb: '174s',    // 174x174 px (square) - Medium thumb.
			small: '300x300', // 300x300 px (square) - Large thumb
			medium: '770x0',  // 770px wide (auto-height, Downscaled "hero" size - balances quality/file size (~80-100 KB).
			original: '_'     // Full-res (aspect preserved, ~500-1000 KB).
		};
		const urlSize = imgSize[quality] || imgSize.high;
		const missingIndices = [];
		const getFileName = (index) => lib.ex.cache.getCachePath('artistImage', artistName, null, { index, size: quality });

		// Scan for missing files (now size-specific), or force all if requested
		for (let i = 1; i <= numImages; i++) {
			const file = cacheFile || getFileName(i);
			if (force || !$Lib.file(file)) {
				missingIndices.push(i);
			}
		}

		const mainCached = !missingIndices.includes(1);

		if (mainCached) {
			const mainFile = cacheFile || getFileName(1);
			const cachedImg = gdi.Image(mainFile);
			if (onComplete) onComplete(cachedImg || libImg.no_artist_img);
		}

		if (missingIndices.length === 0) return; // No missing files? Done.

		// Fetch image list and download missings (or all if force; overwrites existing)
		this.httpGet(artistUrl, (err, responseText) => {
			if (err || !responseText) {
				console.log(`Library Explorer => fetchArtistImage => HTTP error for ${artistName}: ${err ? err.message : 'No response text'}`);
				if (!mainCached && onComplete) onComplete(libImg.no_artist_img);
				return;
			}

			Regex.WebLastFmImg.lastIndex = 0; // Reset per URL
			const matches = responseText.match(Regex.WebLastFmImg) || [];

			// Replace captured size with our target urlSize
			const imgUrls = matches.map(url => {
				const match = Regex.WebLastFmImg.exec(url);
				if (match && match[1]) {
					return url.replace(`${match[1]}/`, `${urlSize}/`);
				}
				return url;
			});
			const urlsToUse = imgUrls.slice(0, numImages);

			if (!imgUrls.length) {
				console.log(`Library Explorer => fetchArtistImage => No image found for ${artistName} on Last.fm (size: ${urlSize})`);
				if (!mainCached && onComplete) onComplete(libImg.no_artist_img);
				return;
			}

			// Download only missings (or all if force; overwrites existing)
			for (const i of missingIndices) {
				const file = cacheFile || getFileName(i);
				const url = urlsToUse[i - 1];
				if (url) {
					if (i === 1) { // Defer main callback
						lib.ex.main.state.pendingImages.set(file, onComplete);
					}
					utils.DownloadFileAsync(url, file);
				}
			}
		}, false);
	}

	/**
	 * Fetches artist discography from Last.fm.
	 * @param {string} artistName - The artist name.
	 * @param {Array<string>} localAlbums - The array of local album names.
	 * @param {string} cacheFile - The cache file path.
	 */
	lastFmFetchDiscography(artistName, localAlbums, cacheFile) {
		const url = `http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(artistName)}${this.cleanStrLF}&format=json&limit=100`;

		this.httpGet(url, (err, json) => {
			if (err) {
				lib.ex.data.missingReleasesError = this.getErrorServerMessage(err, 'Last.fm');
				lib.ex.main.state.loadingMissingReleases = false;
				lib.ex.utils.repaintViewport();
				return;
			}

			const topAlbums = json.topalbums && json.topalbums.album || [];
			const onlineAlbums = lib.ex.missing.processLastFmResults(topAlbums, localAlbums);
			lib.ex.missing.missingReleasesCacheIt(onlineAlbums, cacheFile);
			lib.ex.missing.missingReleasesDisplay(onlineAlbums);

			lib.ex.main.state.loadingMissingReleases = false;
			lib.ex.utils.repaintViewport();
		});
	}

	/**
	 * Fetches artist popularity from ListenBrainz or Last.fm.
	 * @param {Function} callback - The callback function(success).
	 */
	fetchPopularityArtist(callback) {
		const applyPopularityUpdates = (callback, success) => {
			lib.ex.main.setMetrics();
			lib.ex.data.setSorting();
			lib.ex.utils.repaintViewport();
			if (callback) callback(success);
		}

		// 1. Check Cache
		const cached = lib.ex.cache.popularityCacheRetrieveBatch(lib.ex.data.artist, null);
		if (cached && cached.length > 0) {
			lib.ex.cache.getCachedPopularity(cached);
			applyPopularityUpdates(callback, true);
			return;
		}

		this.popularityFetching = true;

		// 2. ListenBrainz: BULK Strategy (Top Release Groups)
		if (this.popularityFetchSource === 'listenbrainz') {
			this.listenBrainzFetchPopularity('albums', lib.ex.data.artist, (results) => {
				const itemsToCache = [];
				if (results === null) {
					this.popularityFetching = false;
					applyPopularityUpdates(callback, false);
					return;
				}
				if (results && results.length) {
					for (const album of lib.ex.data.albumsList) {
						const localName = lib.ex.utils.cleanAlbumTitle(album.album);
						const match = results.find(r => {
							const apiName = lib.ex.utils.cleanAlbumTitle(r.name).toLowerCase();
							const localCleaned = localName.toLowerCase();
							return apiName === localCleaned || localCleaned.includes(apiName);
						});

						if (match) {
							album.statistic = lib.ex.utils.formatNumber(match.playcount);
							itemsToCache.push({ name: album.album, playcount: match.playcount, type: 'album' });
						}
					}
				}

				lib.ex.cache.popularityCacheBatch(lib.ex.data.artist, null, itemsToCache);

				this.popularityFetching = false;
				applyPopularityUpdates(callback, itemsToCache.length > 0);
			});
			return;
		}

		// 3. Last.fm: SEQUENTIAL Strategy
		const itemsToFetch = [...lib.ex.data.albumsList];
		const itemsToCache = [];
		let hasErrors = false;

		const fetchNext = () => {
			if (itemsToFetch.length === 0) {
				lib.ex.cache.popularityCacheBatch(lib.ex.data.artist, null, itemsToCache);
				this.popularityFetching = false;
				applyPopularityUpdates(callback, !hasErrors || itemsToCache.length > 0);
				return;
			}

			const album = itemsToFetch.shift();
			const albumCleaned = lib.ex.utils.cleanAlbumTitle(album.album);

			this.lastfmFetchPopularity('albums', lib.ex.data.artist, albumCleaned, (playcount, error) => {
				if (error) {
					hasErrors = true;
				} else if (playcount > 0) {
					itemsToCache.push({ name: album.album, playcount, type: 'album' });
					album.statistic = lib.ex.utils.formatNumber(playcount);
				}
				fetchNext();
			});
		};

		fetchNext();
	}

	/**
	 * Fetches album popularity from ListenBrainz or Last.fm.
	 * @param {Function} callback - The callback function(success).
	 */
	fetchPopularityAlbum(callback) {
		const applyPopularityUpdates = (callback, success) => {
			lib.ex.main.setMetrics();
			lib.ex.data.setSorting();
			lib.ex.utils.repaintViewport();
			if (callback) callback(success);
		}

		// 1. Check Cache
		const cached = lib.ex.cache.popularityCacheRetrieveBatch(lib.ex.data.artist, lib.ex.data.album);
		if (cached && cached.length > 0) {
			lib.ex.cache.getCachedPopularity(cached);
			applyPopularityUpdates(callback, true);
			return;
		}

		this.popularityFetching = true;

		// 2. ListenBrainz: BULK Strategy (Top Recordings)
		if (this.popularityFetchSource === 'listenbrainz') {
			this.listenBrainzFetchPopularity('tracks', lib.ex.data.artist, (results) => {
				const itemsToCache = [];
				if (results === null) {
					this.popularityFetching = false;
					applyPopularityUpdates(callback, false);
					return;
				}
				if (results && results.length) {
					for (const track of lib.ex.data.tracksList) {
						const localName = lib.ex.utils.cleanAlbumTitle(track.title);
						const match = results.find(r => {
							const apiName = lib.ex.utils.cleanAlbumTitle(r.name).toLowerCase();
							const localCleaned = localName.toLowerCase();
							return apiName === localCleaned || localCleaned.includes(apiName);
						});

						if (match) {
							track.statistic = lib.ex.utils.formatNumber(match.playcount);
							itemsToCache.push({ name: track.title, playcount: match.playcount, type: 'track' });
						}
					}
				}
				lib.ex.cache.popularityCacheBatch(lib.ex.data.artist, lib.ex.data.album, itemsToCache);
				this.popularityFetching = false;
				applyPopularityUpdates(callback, itemsToCache.length > 0);
			});
			return;
		}

		// 3. Last.fm: SEQUENTIAL Strategy
		const itemsToFetch = [...lib.ex.data.tracksList];
		const itemsToCache = [];
		let hasErrors = false;

		const fetchNext = () => {
			if (itemsToFetch.length === 0) {
				lib.ex.cache.popularityCacheBatch(lib.ex.data.artist, lib.ex.data.album, itemsToCache);
				this.popularityFetching = false;
				applyPopularityUpdates(callback, !hasErrors || itemsToCache.length > 0);
				return;
			}

			const track = itemsToFetch.shift();
			const trackArtist = lib.ex.data.$(lib.ex.data.TF.album_artist, track.handle);
			const trackArtistCleaned = lib.ex.utils.cleanAlbumTitle(track.title);

			this.lastfmFetchPopularity('tracks', trackArtist, trackArtistCleaned, (playcount, error) => {
				if (error) {
					hasErrors = true;
				} else if (playcount > 0) {
					itemsToCache.push({ name: track.title, playcount, type: 'track' });
					track.statistic = lib.ex.utils.formatNumber(playcount);
				}
				fetchNext();
			});
		};

		fetchNext();
	}

	/**
	 * Fetches popularity from Last.fm.
	 * @param {string} type - The type of fetch ('albums' or 'tracks').
	 * @param {string} artistName - The artist name.
	 * @param {string} itemName - The album or track name.
	 * @param {Function} callback - The callback function(playcount, error).
	 */
	lastfmFetchPopularity(type, artistName, itemName, callback) {
		const method = type === 'albums' ? 'album.getInfo' : 'track.getInfo';
		const itemParam = type === 'albums' ? 'album' : 'track';

		const url = `http://ws.audioscrobbler.com/2.0/?method=${method}&artist=${encodeURIComponent(artistName)}&${itemParam}=${encodeURIComponent(itemName)}${this.cleanStrLF}&format=json`;

		this.httpGet(url, (err, json) => {
			if (err) {
				callback(0, this.getErrorServerMessage(err, 'Last.fm'));
				return;
			}

			const data = type === 'albums' ? json.album : json.track;
			const playcount = data && data.playcount ? parseInt(data.playcount, 10) : 0;

			callback(playcount, null);
		}, true);
	}

	/**
	 * Fetches similar artists from Last.fm.
	 * @param {string} artistName - The artist name.
	 * @param {Function} callback - The callback function(data).
	 */
	lastfmFetchSimilarArtist(artistName, callback) {
		const limit = lib.ex.similar.sourceLimitExternal;
		const URL = `http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(artistName)}${this.cleanStrLF}&format=json&limit=${limit}&autocorrect=1`;

		this.httpGet(URL, (err, json) => {
			if (err) {
				callback({ error: this.getErrorServerMessage(err, 'Last.fm') });
				return;
			}

			const similar = json.similarartists && json.similarartists.artist || [];
			const seen = new Set();

			let similarData = similar.map(v => ({
				name: v.name,
				match: parseFloat(v.match) || 0
			}))
			.filter(a => a.name.toLowerCase() !== artistName.toLowerCase());

			similarData = similarData.filter(a => {
				const lname = a.name.toLowerCase();
				if (seen.has(lname)) return false;
				seen.add(lname);
				return true;
			});

			callback(similarData);
		});
	}

	/**
	 * Fetches popularity from ListenBrainz.
	 * @param {string} type - The type of fetch ('albums' or 'tracks').
	 * @param {string} artistName - The artist name.
	 * @param {Function} callback - The callback function(results).
	 */
	listenBrainzFetchPopularity(type, artistName, callback) {
		this.musicBrainzFetchArtistMBID(artistName, (mbid) => {
			if (!mbid) {
				callback([]);
				return;
			}

			const endpoint = type === 'albums'
				? `top-release-groups-for-artist/${mbid}`
				: `top-recordings-for-artist/${mbid}`;

			const url = `https://api.listenbrainz.org/1/popularity/${endpoint}`;

			this.httpGet(url, (err, json) => {
				if (err) {
					callback(null);
					return;
				}

				const results = Array.isArray(json) ? json.map(item => ({
					name: type === 'albums'
						? (item.release_group ? item.release_group.name : '')
						: (item.recording_name || ''),
					playcount: item.total_listen_count || 0
				})) : [];

				callback(results);
			}, true);
		});
	}

	/**
	 * Fetches similar artists from ListenBrainz.
	 * @param {string} artistName - The artist name.
	 * @param {Function} callback - The callback function(data).
	 */
	listenBrainzFetchSimilarArtist(artistName, callback) {
		this.musicBrainzFetchArtistMBID(artistName, (mbid) => {
			if (!mbid) {
				callback({ error: this.getErrorAppMessage('noMBID', 'MusicBrainz') });
				return;
			}

			// ListenBrainz similar-artists endpoint requires an exact pre-computed algorithm name.
			// This is the current recommended/default dataset (as per MetaBrainz blog, Nov 2024).
			// Changing any parameter (e.g., limit) returns 400 or empty array — no dynamic params supported.
			// Source: https://blog.metabrainz.org/2024/11/28/pissed-off-by-spotify-enshittifying-more-api-endpoints-we-can-help/
			const algorithm = `session_based_days_7500_session_300_contribution_5_threshold_10_limit_100_filter_True_skip_30`;
			const URL = `https://labs.api.listenbrainz.org/similar-artists/json?artist_mbids=${mbid}&algorithm=${algorithm}`;

			this.httpGet(URL, (err, json) => {
				if (err) {
					callback({ error: this.getErrorServerMessage(err, 'ListenBrainz') });
					return;
				}

				let similarData = [];

				if (Array.isArray(json) && json.length > 0) {
					const scores = json.map(v => v.score || 0); // Safe nulls
					const maxScore = Math.max(0, ...scores); // Clamp to 0 min
					const seen = new Set();
					similarData = json.map(v => ({
						name: v.name,
						match: maxScore > 0 ? (v.score / maxScore) : 0,
						mbid: v.artist_mbid || ''
					}))
					.filter(a => a.name.toLowerCase() !== artistName.toLowerCase());

					similarData = similarData.filter(a => {
						const lname = a.name.toLowerCase();
						if (seen.has(lname)) return false;
						seen.add(lname);
						return true;
					});

					const sourceLimit = Math.min(lib.ex.similar.sourceLimitExternal, 100);
					similarData = similarData.slice(0, sourceLimit);
				}

				callback(similarData);
			});
		});
	}

	/**
	 * Fetches artist MBID from MusicBrainz.
	 * @param {string} artistName - The artist name.
	 * @param {Function} callback - The callback function(mbid, error).
	 */
	musicBrainzFetchArtistMBID(artistName, callback) {
		const url = `https://musicbrainz.org/ws/2/artist/?query=artist:"${encodeURIComponent(artistName)}"&fmt=json&limit=10`;

		this.httpGet(url, (err, json) => {
			if (err) {
				callback(null, err);
				return;
			}

			const artists = json.artists || [];
			const exactMatch = artists.find(a => a['sort-name'] && a['sort-name'].toLowerCase().startsWith(artistName.toLowerCase()));
			const mbid = exactMatch ? exactMatch.id : (artists[0] ? artists[0].id : '');
			callback(mbid);
		});
	}

	/**
	 * Fetches artist discography from MusicBrainz.
	 * @param {string} artistName - The artist name.
	 * @param {Array<string>} localReleases - The array of local album names.
	 * @param {string} cacheFile - The cache file path.
	 */
	musicBrainzFetchDiscography(artistName, localReleases, cacheFile) {
		this.musicBrainzFetchArtistMBID(artistName, (mbid) => {
			if (!mbid) {
				lib.ex.data.missingReleasesError = this.getErrorAppMessage('noMBID', 'MusicBrainz');
				lib.ex.main.state.loadingMissingReleases = false;
				lib.ex.utils.repaintViewport();
				return;
			}

			const url = `https://musicbrainz.org/ws/2/artist/${mbid}?inc=release-groups&fmt=json&limit=100`;

			this.httpGet(url, (err, json) => {
				if (err) {
					lib.ex.data.missingReleasesError = this.getErrorServerMessage(err, 'MusicBrainz');
					lib.ex.main.state.loadingMissingReleases = false;
					lib.ex.utils.repaintViewport();
					return;
				}

				const releaseGroups = json['release-groups'] || [];
				const onlineReleases = lib.ex.missing.processMusicBrainzResults(releaseGroups, localReleases);
				lib.ex.missing.missingReleasesCacheIt(onlineReleases, cacheFile);
				lib.ex.missing.missingReleasesDisplay(onlineReleases);
				lib.ex.main.state.loadingMissingReleases = false;
				lib.ex.utils.repaintViewport();
			});
		});
	}

	/**
	 * Searches for MusicBrainz Release ID by artist and album.
	 * @param {string} artistName - The artist name.
	 * @param {string} albumName - The album name.
	 * @param {Function} callback - The callback function(releaseMBID, error).
	 */
	musicBrainzSearchRelease(artistName, albumName, callback) {
		const query = `artist:"${artistName}" AND release:"${albumName}"`;
		const searchUrl = `https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(query)}&fmt=json&limit=10`;

		this.httpGet(searchUrl, (err, json) => {
			if (err) {
				callback(null, this.getErrorServerMessage(err, 'MusicBrainz'));
				return;
			}

			const releases = json.releases || [];
			if (releases.length === 0) {
				callback(null, this.getErrorAppMessage('noArtistMatch', 'MusicBrainz'));
				return;
			}

			// Prefer exact title match AND official status
			const exactMatch = releases.find(
				r => r.title && r.title.toLowerCase() === albumName.toLowerCase() && (!r.status || r.status === 'Official')
			);
			// Fallback to any Official release, or just the first result
			const release = exactMatch || releases.find(r => !r.status || r.status === 'Official') || releases[0];

			if (release && release.id) {
				callback(release.id, null);
			} else {
				callback(null, 'No valid Release ID found.');
			}
		}, true);
	}

	/**
	 * Manually fetches artwork or thumbnails with user-triggered download.
	 * @param {string} type - The type of fetch: 'artwork', 'thumb', 'missingRelease'.
	 * @param {Object} [item] - The optional item object for thumb/missing release fetches.
	 */
	manualFetch(type, item = null) {
		// * Force download album cover or artist images for large artwork display
		if (type === 'artwork') {
			// * Album cover
			if (lib.ex.main.isAlbumView) {
				lib.ex.web.fetchAlbumCover(
					lib.ex.data.artist, lib.ex.data.album, this.albumImageDLQuality, (img, source, error) => {
						lib.ex.main.updateArtworkImage(img, true);
					}
				);
			}
			// * Artist images
			else {
				this.lastfmFetchArtistImage(
					lib.ex.data.artist, this.artistImageDLCount, this.artistImageDLQuality, true, (img) => {
						lib.ex.main.updateArtworkImage(img, true);
					}
				);
			}
		}
		// * Force download thumbnail for grid items (artist albums or similar artists)
		else if (type === 'thumb' && item) {
			if (lib.ex.main.isSimilarArtistView) {
				const cachePath = lib.ex.cache.getCachePath('similarArtistThumb', item.name, item);
				lib.ex.web.lastfmFetchArtistImage(item.name, 1, 'small', true, (img) => {
						item.thumb = img || libImg.no_artist_img;
						img && img.SaveAs(cachePath, 2);
						lib.ex.main.state.pendingThumbs.delete(cachePath);
						item.thumbResized = null;
						item.thumbSize = 0;
						item.thumbStub = item.thumb === libImg.no_artist_img;
						lib.ex.utils.repaintViewport();
					},
					cachePath
				);
			}
			else if (lib.ex.main.isArtistView) {
				item.thumb = null; // Reset to trigger refetch
				lib.ex.main.fetchThumbnail(item);
			}
		}
		// * Force download missing release thumbnail
		else if (type === 'missingRelease' && item) {
			if (!item.thumbUrl) return;

			const cachePath = lib.ex.cache.getCachePath('missingReleasesImage', lib.ex.data.artist, item);

			if (!lib.ex.main.state.pendingThumbs.has(cachePath)) {
				lib.ex.main.state.pendingThumbs.set(cachePath, item);
				item.thumb = 'loading';
				utils.DownloadFileAsync(item.thumbUrl, cachePath);
				lib.ex.utils.repaintViewport();
			}
		}
	}
	// #endregion
}


/**
 * The `LibExplorerCallbacks` class for managing the callbacks for the explorer.
 * @class
 */
class LibExplorerCallbacks {
	/**
	 * Called when {@link utils.DownloadFileAsync} thread is finished
	 * New callback and only available since SMP v1.7.25.12.8 or JSplitter v3.7.4/v4.0.4.4-beta.
	 * @param {string} path - The path of the downloaded file.
	 * @param {boolean} success - The success message if the download was successful.
	 * @param {string} error_text - The error message if the download failed.
	 */
	on_download_file_done(path, success, error_text) {
		// * Album cover image - post download handling
		if (success && path.includes('\\albums\\')) {
			const img = gdi.Image(path);
			if (img) { // Extract artist/album from path for auto-action
				const pathParts = path.split('\\');
				const artistName = pathParts[pathParts.length - 3];
				const albumName = pathParts[pathParts.length - 2];
				// Only auto-action if viewing this specific album
				if (lib.ex.main.isAlbumOrDetailsView &&
					(artistName === lib.ex.data.artist && albumName === lib.ex.data.album)) {
					lib.ex.web.albumCoverAutoAction(path, artistName, albumName, img);
				}
			}
			lib.ex.utils.repaintExplorer();
			return;
		}

		// * Artist image - post download handling
		if (lib.ex.main.state.pendingImages.has(path)) {
			const callback = lib.ex.main.state.pendingImages.get(path);
			lib.ex.main.state.pendingImages.delete(path);

			if (success) {
				const img = gdi.Image(path);
				callback(img, null);
			} else {
				callback(null, error_text);
			}

			lib.ex.utils.repaintExplorer();
			return;
		}

		// * Thumbnail image - post download handling
		if (lib.ex.main.state.pendingThumbs.has(path)) {
			const item = lib.ex.main.state.pendingThumbs.get(path);
			lib.ex.main.state.pendingThumbs.delete(path);

			item.thumb = success ? gdi.Image(path) : libImg.stub.noImg;
			item.thumbResized = null;
			item.thumbSize = 0;
			item.thumbStub = item.thumb === libImg.stub.noImg;

			lib.ex.utils.repaintViewport();
		}
	}

	/**
	 * Called when {@link utils.HTTPRequestAsync} request is finished
	 * New callback and only available with SMP v1.7.25.12.8 or JSplitter v3.7.4/v4.0.4.4-beta.
	 * @param {number} task_id - The task id returned by {@link utils.HTTPRequestAsync}
	 * @param {boolean} success - The state if the request was successful.
	 * @param {string} response_text - The response body as text.
	 * @param {string} status - The HTTP response code.
	 * @param {string} content_type - The 'Content-Type' HTTP response header.
	 */
	on_http_request_done(task_id, success, response_text, status, content_type) {
		const stored = lib.ex.main.state.pendingHttpRequests.get(task_id);
		if (!stored) return;

		const { callback, parseJson } = stored;
		lib.ex.main.state.pendingHttpRequests.delete(task_id);

		if (success && status === 200) {
			try {
				if (parseJson) {
					const data = JSON.parse(response_text);
					callback(null, data);
				} else { // Raw text for HTML scraping
					callback(null, response_text);
				}
			}
			catch (e) {
				callback(e);
			}
		}
		else {
			callback(new Error(`HTTP error ${status}`));
		}
	}

	/**
	 * Called when pressing down keyboard keys.
	 *
	 * Requires "Grab focus" enabled in the Configuration window.
	 *
	 * In order to use arrow keys, use window.DlgCode(DLGC_WANTARROWS) (see Flags.js > DLGC_WANTARROWS).
	 *
	 * Note: keyboard shortcuts defined in the main preferences are always executed first and are not passed to the callback.
	 * @param {number} vkey - The virtual key code.
	 */
	on_key_down(vkey) {
		if (!lib.ex.main.state.visible) return;

		if (vkey === VKey.ESCAPE) {
			lib.ex.control.handleExplorerClose();
			return;
		}

		if (vkey === VKey.RETURN) {
			lib.ex.control.handleKeyEnter();
			return;
		}

		const delta = {
			[VKey.LEFT]:  { dx: -1, dy:  0 },
			[VKey.RIGHT]: { dx:  1, dy:  0 },
			[VKey.UP]:    { dx:  0, dy: -1 },
			[VKey.DOWN]:  { dx:  0, dy:  1 }
		}[vkey];

		if (!delta) return;

		const handler = lib.ex.main.isDetailsView
			? lib.ex.control.handleKeyArrowDetails
			: lib.ex.control.handleKeyArrowAlbumArtist;

		handler(delta.dx, delta.dy);
	}

	/**
	 * Called when media library is being changed, i.e updated by removing/adding tracks.
	 * @param {FbMetadbHandleList} handleList - The handle list of the library items.
	 */
	on_library_items_changed(handleList) {
		lib.ex.cache.cacheVersion++;
	}

	/**
	 * Called when thread created by gdi.LoadImageAsync is done.
	 * @param {number} cookie - The return value from the gdi.LoadImageAsync call.
	 * @param {GdiBitmap} imagenullable - Null on failure (invalid path/not an image).
	 * @param {string} image_path - The path that was originally supplied to gdi.LoadImageAsync.
	 */
	on_load_image_done(cookie, imagenullable, image_path) {
		if (!lib.ex.main.state.pendingThumbs.has(image_path)) return;

		const item = lib.ex.main.state.pendingThumbs.get(image_path);
		item.thumb = imagenullable || libImg.stub.noImg;
		item.thumbStub = item.thumb === libImg.stub.noImg;
		lib.ex.main.state.pendingThumbs.delete(image_path);
		lib.ex.utils.repaintViewport();
	}

	/**
	 * Called when metadb contents change, i.e tag or database updates.
	 * @param {FbMetadbHandleList} [handle_list] - Can be undefined when called manually from on_playback_new_track.
	 * @param {boolean} [fromhook] - The flag indicating if notification is not from tag update, but a component that provides tag-like data from a database.
	 */
	on_metadb_changed(handleList, fromhook) {
		if (!lib.ex.main.state.visible) return;

		const {
			needsUpdate, needsPlaylistUpdate
		} = lib.ex.data.updateStatsForHandles(handleList);

		if (needsUpdate) {
			lib.ex.data.setHeaderMeta(false);
			lib.ex.data.setAlbumMeta(handleList);
			lib.ex.main.setMetrics();
			lib.ex.utils.repaintColumn();
		}

		if (needsPlaylistUpdate) {
			pl.playlist.update_playlist_headers();
		}
	}

	/**
	 * Called when double clicking the left mouse button.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	on_mouse_lbtn_dblclk(x, y) {
		if (!lib.ex.main.state.explorerTreeView && !lib.ex.main.state.visible) {
			return;
		}

		lib.ex.control.handleDoubleClick(x, y);
	}

	/**
	 * Called when left mouse button is pressed.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	on_mouse_lbtn_down(x, y) {
		if (!lib.ex.main.state.explorerTreeView || !lib.ex.main.state.visible) {
			return;
		}

		lib.ex.control.mouse.lastPressed.x = x - lib.ui.x;
		lib.ex.control.mouse.lastPressed.y = y - lib.ui.y;
		lib.ex.control.mouse.lbtnDn = true;

		if (libSet.touchControl) {
			lib.ex.control.mouse.itemDragId =
				lib.ex.main.isAlbumView ? lib.ex.utils.getHoveredAlbumTrackIndex(x, y) :
				lib.ex.main.isArtistOrSimilarView ? lib.ex.utils.getHoveredGridAlbumIndex(x, y) :
				-1;
		}

		lib.ex.sbar.handleScrollbarClick(x, y);
	}

	/**
	 * Called when left mouse button is released from pressed state.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	on_mouse_lbtn_up(x, y) {
		if (!lib.ex.main.state.explorerTreeView || !lib.ex.main.state.visible) {
			return;
		}
		else if (lib.panel.search.active) {
			lib.ex.control.explorerHide();
		}

		lib.ex.sbar.scrollDrag = false;
		if (lib.ex.control.mouse.itemDrag) {
			lib.ex.control.mouse.itemDrag = false;
			return;
		}

		// Ignore this lbtn_up if it immediately follows a double-click open
		if (lib.ex.control.mouse.ignoreNextSingleClick) {
			lib.ex.control.mouse.ignoreNextSingleClick = false;
			lib.ex.control.mouse.lbtnDn = false;
			return;
		}

		lib.ex.control.mouse.itemDragId = -1;
		lib.ex.control.mouse.lbtnDn = false;
		lib.ex.control.handleSingleClick(x, y);
	}

	/**
	 * Called when right mouse button is released from pressed state.
	 *
	 * You must return true, if you want to suppress the default context menu.
	 *
	 * Note: left shift + left windows key will bypass this callback and will open default context menu.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True to suppress the default context menu, otherwise depends on internal conditions.
	 */
	on_mouse_rbtn_up(x, y) {
		lib.ex.control.handleRightClickSelection(x, y);
		lib.men.items = lib.ex.data.getHandlesFromSelected();
		lib.men.show_context = true;
		libMenu.load(x, y);
		return true;
	}

	/**
	 * Called when mouse leaves the window.
	 */
	on_mouse_leave() {
		if (!lib.ex.main.state.explorerTreeView || !lib.ex.main.state.visible) {
			return false;
		}

		lib.ex.tooltip.deactivateTooltip();
		lib.ex.control.clearMouseHoverColumn();
		lib.ex.sbar.updateScrollbarAlpha();
		lib.ex.utils.repaintColumn();
	}

	/**
	 * Called when mouse moves in the panel.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	on_mouse_move(x, y) {
		lib.ex.control.mouse.lastX = x;
		lib.ex.control.mouse.lastY = y;

		if (!lib.ex.main.state.explorerTreeView || !lib.ex.main.state.visible) {
			return false;
		}

		if (!lib.ex.utils.mouseInAlbumArt(x, y)) {
			lib.ex.control.clearMouseHoverArtwork();
		}

		lib.ex.control.updateMouseHoverArtwork(x, y);

		if (x < lib.ex.main.ui.column.x) {
			lib.ex.control.clearMouseHoverColumn();
			return false;
		}

		lib.ex.control.updateMouseHoverColumn(x, y);
		lib.ex.sbar.updateScrollbarAlpha(lib.ex.utils.mouseInScrollbar(x, y), lib.ex.sbar.scrollDrag);
		lib.ex.sbar.handleScrollbarDrag(y);
		lib.ex.control.handleDragDrop(x, y);
		lib.ex.tooltip.updateTooltips(x, y);
		lib.ex.control.handleCloseButton(x, y);

		return true;
	}

	/**
	 * Called when using the mouse wheel, also used to cycle through album artworks and control the seekbar.
	 * @param {number} step - The scroll direction: -1 or 1.
	 */
	on_mouse_wheel(step) {
		if (!lib.ex.main.state.explorerTreeView || !lib.ex.main.state.visible) {
			return false;
		}

		lib.ex.control.handleWheel(step);
	}

	/**
	 * Called when playing a new track.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	on_playback_new_track(metadb) {
		if (!lib.ex.main.state.explorerTreeView || !lib.ex.main.state.visible) {
			return false;
		}

		lib.ex.data.updateNowPlaying(metadb);
	}

	/**
	 * Called when pausing current playing track.
	 * @param {boolean} state - The state if playback is paused or not.
	 */
	on_playback_pause(state) {
		if (!lib.ex.main.state.explorerTreeView || !lib.ex.main.state.visible) {
			return false;
		}

		lib.ex.utils.repaintViewport();
	}

	/**
	 * Called when adding new playlist tracks in queue.
	 * @param {number} origin - The parameter has following settings:
	 * - 0 - User added.
	 * - 1 - User removed.
	 * - 2 - Playback advance.
	 */
	on_playback_queue_changed(origin) {
		if (!lib.ex.main.state.visible || lib.ex.data.getStatsSelected() !== 'queue') {
			return;
		}

		if (lib.ex.main.isAlbumView && lib.ex.data.tracksList.length > 0) {
			for (const track of lib.ex.data.tracksList) {
				track.statistic = lib.ex.data.getTracksStatistic(new FbMetadbHandleList(track.handle), 'queue');
				track.statDisplay = track.statistic !== undefined && track.statistic !== '' ? `${track.statistic} |` : '';
			}
		}
		else if (lib.ex.main.isArtistView && lib.ex.data.albumsList.length > 0) {
			for (const album of lib.ex.data.albumsList) {
				album.statistic = lib.ex.data.getTracksStatistic(album.handles, 'queue');
				album.statDisplay = album.statistic !== undefined && album.statistic !== '' ? album.statistic : '';
			}
		}
		else if (lib.ex.main.isSimilarArtistView && lib.ex.data.similarArtistList.length > 0) {
			for (const artist of lib.ex.data.similarArtistList) {
				artist.statistic = lib.ex.data.getTracksStatistic(artist.handles, 'queue');
				artist.statDisplay = artist.statistic !== undefined && artist.statistic !== '' ? artist.statistic : '';
			}
		}

		lib.ex.utils.repaintViewport();
	}

	/**
	 * Called when window is being resized.
	 */
	on_size() {
		if (!lib.ex.main.state.explorerTreeView || !lib.ex.main.state.visible) {
			return;
		}

		lib.ex.main.setMetrics();
	}
}
