/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Playlist Header                          * //
// * Author:         TT                                                      * //
// * Org. Author:    extremeHunter, TheQwertiest                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-DEV                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    04-06-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////////////
// * BASE HEADER * //
/////////////////////
/**
 * A class that represents the base header in the playlist and provides methods
 * for initializing sub-items and drawing the headers.
 * @augments {BaseListItem}
 */
class PlaylistBaseHeader extends BaseListItem {
	/**
	 * Creates the `PlaylistBaseHeader` instance.
	 * Represents a header element in a parent container.
	 * @abstract
	 * @param {BaseListContent|PlaylistBaseHeader} parent - The parent header.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 * @param {number} idx - The index.
	 */
	constructor(parent, x, y, w, h, idx) {
		super(x, y, w, h);

		/** @public @constant @type {PlaylistBaseHeader} */
		this.parent = parent;
		/** @public @constant @type {number} */
		this.idx = idx;
		/** @public @type {boolean} */
		this.is_collapsed = false;
		/** @public @type {boolean} Currently only updated at draw time */
		this.hasSelection = false;
		/** @private @type {number} */
		this.row_count = 0;
		/** @public @type {Array<PlaylistRow>|Array<PlaylistBaseHeader>} */
		this.sub_items = [];

		/** @public @type {PlaylistMetaHandler} */
		this.meta_handler = new PlaylistMetaHandler();
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Draws the header.
	 * @abstract
	 * @override
	 */
	draw(gr) {
		// Need this useless method to suppress warning =(
		throw new LogicError('draw not implemented');
	}

	/**
	 * Initializes the items in the header.
	 * @abstract
	 * @param {Array<PlaylistRow>|Array<PlaylistBaseHeader>} items - The items to initialize the contents with.
	 * @returns {number} The number of processed items.
	 */
	init_header_items(items) {
		throw new LogicError('initialize_contents not implemented');
	}

	/**
	 * Sets the width of a ListItem and recursively sets the width of its sub-items.
	 * @override
	 * @param {number} w - The width.
	 */
	set_w(w) {
		BaseListItem.prototype.set_w.apply(this, [w]);

		for (const item of this.sub_items) {
			item.set_w(w);
		}
	}

	/**
	 * Gets the first row object from a list of sub-items.
	 * @returns {PlaylistRow|null} The first row, or null if there are no rows.
	 */
	get_first_row() {
		let item = this.sub_items[0];

		while (item) {
			if (item instanceof PlaylistRow) {
				return item;
			}
			item = (item.sub_items && item.sub_items.length > 0) ? item.sub_items[0] : null;
		}

		return null;
	}

	/**
	 * Gets an array of row indexes by iteratively (non-recursively) traversing through sub_items using a stack.
	 * @returns {number[]} An array of row indexes from items of type PlaylistRow.
	 */
	get_row_indexes() { // Rewritten
		const row_indexes = [];
		const stack = [];

		// Initialize the stack with sub-items in reverse order to maintain traversal order when popping.
		for (let i = this.sub_items.length - 1; i >= 0; i--) {
			stack.push(this.sub_items[i]);
		}

		while (stack.length > 0) {
			const item = stack.pop();

			if (item instanceof PlaylistRow) {
				row_indexes.push(item.idx);
			} else if (item.sub_items) {
				// If the item has sub-items, add them to the stack in reverse order to continue depth-first search
				for (let i = item.sub_items.length - 1; i >= 0; i--) {
					stack.push(item.sub_items[i]);
				}
			}
		}

		return row_indexes;
	}

	/**
	 * Calculates the total height of sub-items in rows, taking into account any nested sub-items.
	 * @returns {number} The total height in rows.
	 */
	get_sub_items_total_h_in_rows() {
		if (!this.sub_items.length) {
			return 0;
		}

		if (this.sub_items[0] instanceof PlaylistRow) {
			return this.sub_items.length;
		}

		let h_in_rows = Math.round(this.sub_items[0].h / pl.geo.row_h) * this.sub_items.length;
		for (const item of this.sub_items) {
			if (!item.is_collapsed) {
				h_in_rows += item.get_sub_items_total_h_in_rows();
			}
		}

		return h_in_rows;
	}

	/**
	 * Calculates the total duration in seconds of a list of sub-items, recursively if the sub-items are not of type PlaylistRow.
	 * @returns {number} A float number.
	 */
	get_duration() {
		let duration_in_seconds = 0;

		if (this.sub_items[0] instanceof PlaylistRow) {
			for (const item of this.sub_items) {
				duration_in_seconds += item.metadb.Length;
			}
		}
		else {
			for (const item of this.sub_items) {
				duration_in_seconds += item.get_duration();
			}
		}

		return duration_in_seconds;
	}

	/**
	 * Checks if any of the sub_items have been selected, taking into account whether the first sub_item is a header or not.
	 * @returns {boolean} True or false.
	 */
	has_selected_items() {
		// const is_function = typeof this.sub_items[0].has_selected_items === 'function';
		const isHeader = this.sub_items[0] instanceof PlaylistBaseHeader;
		return this.sub_items.some(item => isHeader ? item.has_selected_items() : item.is_selected());
	}

	/**
	 * Checks if all sub-items are completely selected, taking into account whether the first sub-item is a header or not.
	 * @returns {boolean} True or false.
	 */
	is_completely_selected() {
		const isHeader = this.sub_items[0] instanceof PlaylistBaseHeader;
		return this.sub_items.every(item => isHeader ? item.is_completely_selected() : item.is_selected());
	}

	/**
	 * Checks if any of the sub_items are currently playing.
	 * @returns {boolean} True or false.
	 */
	is_playing() {
		const is_function = typeof this.sub_items[0].is_playing === 'function';
		return this.sub_items.some(item => is_function ? item.is_playing() : item.is_playing);
	}

	/**
	 * Checks if any of the sub_items are focused, taking into account whether the is_focused property is a function or a boolean value.
	 * @returns {boolean} True or false.
	 */
	is_focused() {
		const is_function = typeof this.sub_items[0].is_focused === 'function';
		return this.sub_items.some(item => is_function ? item.is_focused() : item.is_focused);
	}
	// #endregion

	// * CALLBACKS * //
	// #region CALLBACKS
	/**
	 * Handles mouse double click events on the playlist header.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 */
	on_mouse_lbtn_dblclk(x, y, m) {
		plman.ExecutePlaylistDefaultAction(plman.ActivePlaylist, this.get_first_row().idx);
	}
	// #endregion
}


////////////////
// * HEADER * //
////////////////
/**
 * A class that creates and draws the playlist header.
 * @augments {PlaylistBaseHeader}
 */
class PlaylistHeader extends PlaylistBaseHeader {
	/**
	 * Creates the `PlaylistHeader` instance.
	 * @param {BaseListContent|PlaylistBaseHeader} parent - The parent object or container that this object belongs to.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 * @param {number} idx - The index.
	 */
	constructor(parent, x, y, w, h, idx) {
		super(parent, x, y, w, h, idx);

		/** @private @type {FbMetadbHandle} */
		this.metadb = undefined;
		/** @private @type {boolean} Last value of this.is_playing() updated each draw cycle. */
		this.was_playing = undefined;

		/** @private @constant @type {number} */
		this.art_max_size = this.h - SCALE(16);
		/** @private @type {?GdiBitmap} undefined > Not Loaded; null > Loaded & Not Found; !isNil > Loaded & Found. */
		this.art = undefined;
		/** @public @type {GdiBitmap} */
		this.header_image = undefined;

		/** @private @type {array} */
		this.hyperlinks = {};
		/** @public @type {boolean} */
		this.hyperlinks_initialized = false;

		/** @private @type {number} */
		this.rating_left_pad = 0;
		/** @private @type {number} */
		this.rating_right_pad = 10;
		/** @private @type {PlaylistRating} */
		this.rating = undefined;

		/** @public @type {PlaylistGroupingHandler} */
		this.grouping_handler = PlaylistHeader.grouping_handler;

		pl.thumbnail_size = this.art_max_size;

		this.initialize_rating();
	}

	// * STATIC METHODS * //
	// #region STATIC METHODS
	/**
	 * Gets the image cache, creating it if it doesn't exist.
	 * @returns {PlaylistImageCache} The singleton instance of the PlaylistImageCache.
	 */
	static get img_cache() {
		if (!this._imgCache) {
			this._imgCache = new PlaylistImageCache(200);
		}
		return this._imgCache;
	}

	/**
	 * Gets the grouping handler, creating it if it doesn't exist.
	 * @returns {PlaylistGroupingHandler} The singleton instance of the PlaylistGroupingHandler.
	 */
	static get grouping_handler() {
		if (!this._groupingHandler) {
			this._groupingHandler = new PlaylistGroupingHandler();
		}
		return this._groupingHandler;
	}

	/**
	 * Prepares the initialization data for the playlist header.
	 * @param {Array<PlaylistRow>} rows_to_process - The rows to process.
	 * @param {FbMetadbHandleList} rows_metadb - The metadb of the rows to process.
	 * @returns {Array} An array of two elements, has the following format [Array<[row,row_data]>, disc_header_prepared_data].
	 */
	static prepare_header_data(rows_to_process, rows_metadb) {
		const showDiscHeader = plSet.show_disc_header;
		let query = PlaylistHeader.grouping_handler.get_query();

		if (showDiscHeader && query && PlaylistHeader.grouping_handler.show_disc()) {
			query = query.replace(/%discnumber%/, '').replace(/%totaldiscs%/, '').replace(/%subtitle%/, '');
		}

		const profiler = grm.ui.traceListPerformance && fb.CreateProfiler();
		const tfo = fb.TitleFormat(query || '');
		const rows_data = tfo.EvalWithMetadbs(rows_metadb);
		grm.ui.traceListPerformance && console.log(`rows_data initialized in ${profiler.Time}ms`);
		const prepared_disc_data = showDiscHeader ? PlaylistDiscHeader.prepare_disc_header_data(rows_to_process, rows_metadb) : [];

		return [Zip(rows_to_process, rows_data), prepared_disc_data];
	}

	/**
	 * Creates the playlist header for each item.
	 * @param {PlaylistContent} parent - The parent element.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 * @param {Array} prepared_rows - The prepared rows, has the following format [Array<[row,row_data]>, disc_header_prepared_data].
	 * @returns {Array<PlaylistHeader>} An array of headers.
	 */
	static create_headers(parent, x, y, w, h, prepared_rows) {
		const prepared_header_rows = prepared_rows[0];

		let header_idx = 0;
		const headers = [];
		while (prepared_header_rows.length) {
			const header = new PlaylistHeader(parent, x, y, w, h, header_idx);
			const processed_rows_count = header.init_header_items(prepared_rows);

			TrimArray(prepared_header_rows, processed_rows_count, true);

			headers.push(header);
			++header_idx;
		}

		return headers;
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Draws the playlist header either in normal or compact layout.
	 * @override
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {number} top - The y-coordinate of the top edge of the header area.
	 * @param {number} bottom - The y-coordinate of the bottom edge of the header.
	 */
	draw(gr, top, bottom) {
		if (this.w <= 0 || this.h <= 0) return;
		// drawProfiler = fb.CreateProfiler('PlaylistHeader.draw items:' + this.sub_items.length);
		if (plSet.use_compact_header) {
			this.draw_compact_header(gr);
		}
		else {
			this.draw_normal_header(gr, top, bottom);
		}
		// drawProfiler.Print();
	}

	/**
	 * Draws the playlist header in normal layout.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {number} top - The y-coordinate of the top edge of the header area.
	 * @param {number} bottom - The y-coordinate of the bottom edge of the header.
	 */
	draw_normal_header(gr, top, bottom) {
		let clipImg = gdi.CreateImage(this.w, this.h);
		const grClip = clipImg.GetGraphics();
		const scrollbar = plSet.show_scrollbar && pl.playlist.is_scrollbar_available;
		const headerFontSize = grSet[`playlistHeaderFontSize_${grSet.layout}`];

		if (!this.hyperlinks_initialized) {
			this.initialize_hyperlinks(gr);
		}
		let cache_header = true;  // Caching is a lot faster, but need to handle artwork loading
		if (this.was_playing !== this.is_playing()) {
			this.was_playing = this.is_playing();
			cache_header = false;
			this.clearCachedHeaderImg();
		}
		const hasSelection = this.has_selected_items();
		if (this.hasSelection !== hasSelection) {
			this.hasSelection = hasSelection;
			cache_header = false;
			this.clearCachedHeaderImg();
		}
		if (!cache_header || !this.header_image || this.clearCachedHeaderImg) {
			let artist_color = pl.col.header_artist_normal;
			let album_color = pl.col.header_album_normal;
			let info_color = pl.col.header_info_normal;
			let date_color = pl.col.header_date_normal;
			let line_color = pl.col.header_line_normal;
			let artist_font = pl.font.artist_normal;
			const date_font = pl.font.date;
			const updatedNowpBg = pl.col.header_nowplaying_bg !== ''; // * Wait until nowplaying bg has a new color to prevent flashing

			if (this.is_playing() && updatedNowpBg) {
				artist_color = pl.col.header_artist_playing;
				album_color = pl.col.header_album_playing;
				info_color = pl.col.header_info_playing;
				date_color = pl.col.header_date_playing;
				line_color = pl.col.header_line_playing;
				artist_font = pl.font.artist_playing;

				if (grCol.lightBg && grSet.theme === 'black') {
					artist_color = RGB(0, 0, 0);
					album_color = RGB(20, 20, 20);
					info_color = RGB(20, 20, 20);
					date_color = RGB(20, 20, 20);
				} else if (grCol.lightBg && grSet.theme === 'white' && grSet.layout !== 'default') {
					artist_color  = RGB(60, 60, 60);
					album_color = RGB(60, 60, 60);
					info_color = RGB(60, 60, 60);
					date_color = RGB(60, 60, 60);
					line_color = RGB(100, 100, 100);
				}
			}

			if (!grSet.styleBlend) grClip.FillSolidRect(0, 0, this.w, this.h, pl.col.bg); // Solid background for ClearTypeGridFit text rendering

			// if (this.hasSelection && grSet.theme.startsWith('custom')) {
			// 	grClip.FillSolidRect(0, 0, this.w, this.h, pl.col.row_selection_bg);
			// }

			if (this.is_playing() && updatedNowpBg) {
				const p = SCALE(6);  // From art below

				if (grSet.theme === 'white' && !grSet.styleBlackAndWhite && !grSet.styleBlackAndWhite2 && grSet.layout === 'default' || (grSet.theme === 'reborn' || grSet.theme === 'random') && grm.ui.noAlbumArtStub && !grSet.styleNighttime) {
					grClip.FillSolidRect(0, p, SCALE(8), this.h - p * 2, pl.col.header_nowplaying_bg);
				}
				else {
					grClip.FillSolidRect(0, 0, scrollbar ? this.w - SCALE(12) : this.w, this.h * 2, pl.col.header_nowplaying_bg);
				}
				if (grSet.theme === 'white' && (grSet.styleBlackAndWhite || grSet.styleBlackAndWhite2) || !['white', 'black', 'cream'].includes(grSet.theme)) {
					grClip.FillSolidRect(0, 0, SCALE(8), this.h, pl.col.header_sideMarker);
				}
			}

			// * Need to apply text rendering AntiAliasGridFit when using style Blend or when using custom theme fonts with larger font sizes
			grClip.SetTextRenderingHint(grSet.styleBlend || grSet.customThemeFonts && headerFontSize > 18 ? TextRenderingHint.AntiAliasGridFit : TextRenderingHint.ClearTypeGridFit);

			if (this.is_collapsed && this.is_focused() || this.is_completely_selected() && plSet.show_header && plSet.auto_collapse) {
				grClip.DrawRect(-1, 0, this.w + 1, this.h - 1, 1, line_color);
				grClip.FillSolidRect(0, 0, SCALE(8), this.h, pl.col.header_sideMarker);
			}

			//************************************************************//

			let left_pad = SCALE(10) + (this.art === null && plSet.auto_album_art || !plSet.show_album_art ? SCALE(10) : 0);

			// * ART BOX * //
			if (plSet.show_album_art) {
				const adjustHyperlinkOffsets = (hyperlinks, property, left_pad) => {
					let i = 0;
					let offset = 0;
					while (hyperlinks[`${property}${i}`]) {
						if (i === 0) {
							offset = hyperlinks[`${property}0`].x - left_pad;
							if (!offset) break;
						}
						hyperlinks[`${property}${i}`].x -= offset;
						i++;
					}
				};

				if (!this.is_art_loaded()) {
					const cached_art = PlaylistHeader.img_cache.get_image_for_meta(this.metadb);
					if (cached_art) {
						this.assign_art(cached_art);
					}
				}

				if (this.art !== null || !plSet.auto_album_art) {
					const p = SCALE(6);
					const spacing = SCALE(2);
					const art_box_size = this.art_max_size + spacing * 2;
					const art_box_x = p * 3;
					let art_box_y = p;
					let art_box_w = art_box_size;
					let art_box_h = art_box_size;

					if (this.art) {
						const art_x = art_box_x + spacing;
						let art_y = art_box_y + spacing;
						const art_h = this.art.Height;
						const art_w = this.art.Width;
						if (art_h > art_w) {
							art_box_w = art_w + spacing * 2;
						}
						else {
							art_box_h = art_h + spacing * 2;
							art_y += Math.round((this.art_max_size - art_h) / 2);
							art_box_y = art_y - spacing;
						}
						grClip.DrawImage(this.art, art_x, art_y, art_w, art_h, 0, 0, art_w, art_h, 0, 220);
					}
					else if (!this.is_art_loaded()) {
						grClip.DrawString('LOADING', pl.font.cover, this.is_playing() ? artist_color : pl.col.row_title_normal, art_box_x, art_box_y, art_box_size, art_box_size, Stringformat.align_center);
						cache_header = false;   // Don't cache until artwork is loaded
					}
					else { // null
						const is_radio = this.metadb.RawPath.startsWith('http') || this.metadb.Path.startsWith('spotify');
						grClip.DrawString(grm.ui.isStreaming && is_radio ? 'LIVE\n ON AIR' : 'NO COVER', pl.font.cover, this.is_playing() ? artist_color : pl.col.row_title_normal, art_box_x, art_box_y, art_box_size, art_box_size, Stringformat.align_center);
					}

					grClip.DrawRect(art_box_x, art_box_y, art_box_w - 1, art_box_h - 1, 1, line_color);

					left_pad += art_box_x + art_box_w;
					adjustHyperlinkOffsets(this.hyperlinks, 'artist', left_pad);
					adjustHyperlinkOffsets(this.hyperlinks, 'genre', left_pad);
					this.hyperlinks.album && this.hyperlinks.album.setXOffset(left_pad);
				}
				else if (this.art === null && plSet.auto_album_art && !this.hyperlinks_reinitialized) {
					adjustHyperlinkOffsets(this.hyperlinks, 'genre', left_pad);
					this.hyperlinks.artist0 && this.hyperlinks.artist0.setXOffset(left_pad);
					this.hyperlinks.album && this.hyperlinks.album.setXOffset(left_pad);
					this.hyperlinks.genre0 && this.hyperlinks.genre0.setXOffset(left_pad);
					this.initialize_hyperlinks(gr);
					this.hyperlinks_reinitialized = true;
				}
			}

			//************************************************************//

			const is_radio = this.metadb.RawPath.startsWith('http') || this.metadb.Path.startsWith('spotify');

			// * Part1: Artist
			// * Part2: Album + line + Date OR line
			// * Part3: Info OR album
			const part1_cur_x = left_pad;
			let part2_cur_x = left_pad;
			let part3_cur_x = left_pad;

			const part_h = !plSet.show_group_info ? this.h / 2 : this.h / 3;
			let part2_right_pad = 0;

			// * DATE * //
			if (this.grouping_handler.show_date()) {
				const date_query = grSet.showPlaylistFullDate ? grTF.date : grTF.year;
				const date_text = $(date_query, this.metadb);
				if (date_text && date_text !== '0000') {
					const date_w = Math.ceil(gr.MeasureString(date_text, date_font, 0, 0, 0, 0).Width + 5);
					const date_x = this.w - date_w;

					if (!this.hyperlinks.date && date_x > left_pad) {
						const date_y = 0;
						const date_h = this.h - 4;
						grClip.DrawString(date_text, date_font, date_color, date_x, date_y, date_w, date_h, Stringformat.v_align_center);
					} else {
						this.hyperlinks.date.draw(grClip, date_color);
					}

					part2_right_pad += this.w - date_x;
				}
			}

			// * ARTIST * //
			if (this.grouping_handler.get_title_query()) {
				const artist_text_format = Stringformat.v_align_far | Stringformat.trim_ellipsis_char | Stringformat.no_wrap;
				let artist_text = grSet.headerFlipRows ? $(this.grouping_handler.get_sub_title_query(), this.metadb) : $(this.grouping_handler.get_title_query(), this.metadb);

				if (!artist_text && is_radio) {
					artist_text = 'Radio Stream';
				}
				if (artist_text) {
					const artist_x = part1_cur_x;
					let artist_w = this.w - artist_x * 2;
					let artist_h = part_h;
					if (!plSet.show_group_info) {
						artist_w -= part2_right_pad + 5;
						artist_h -= 5;
					}

					if (is_radio || !this.hyperlinks.artist0) {
						grClip.DrawString(artist_text, artist_font, artist_color, artist_x, 0, artist_w, artist_h, artist_text_format);
					}
					else {
						let i = 0;
						let artist_hyperlink;
						while (this.hyperlinks[`artist${i}`]) {
							if (i > 0) {
								grClip.DrawString(' \u2022 ', artist_font, artist_color, artist_hyperlink.x + artist_hyperlink.getWidth(), artist_h * 0.25, SCALE(20), artist_h);
							}
							artist_hyperlink = this.hyperlinks[`artist${i}`];
							artist_hyperlink.draw(grClip, artist_color);
							i++;
						}
					}
					// part1_cur_x += artist_w;
				}
			}

			// * ALBUM * //
			if (this.grouping_handler.get_sub_title_query()) {
				const album_text = grSet.headerFlipRows ? $(this.grouping_handler.get_title_query(), this.metadb) : $(this.grouping_handler.get_sub_title_query(), this.metadb);

				if (album_text) {
					const album_h = part_h;
					let album_y = part_h;
					let album_x;
					if (plSet.show_group_info) {
						album_x = part2_cur_x;
					}
					else {
						album_y += 5;
						album_x = part3_cur_x;
					}
					const album_w = this.w - album_x - (part2_right_pad + 5);

					let album_text_format = Stringformat.trim_ellipsis_char | Stringformat.no_wrap;
					if (plSet.show_group_info) {
						album_text_format |= Stringformat.v_align_center;
					}

					if (!this.hyperlinks.album) {
						grClip.DrawString(album_text, pl.font.album, album_color, album_x, album_y, album_w, album_h, album_text_format);
					} else {
						this.hyperlinks.album.draw(grClip, album_color);
					}

					const album_text_w = Math.ceil(
						/** @type {!number} */
						gr.MeasureString(album_text, pl.font.album, 0, 0, 0, 0).Width
					);
					if (plSet.show_group_info) {
						part2_cur_x += album_text_w;
					}
					else {
						part3_cur_x += album_text_w;
					}
				}
			}

			// * INFO * //
			if (plSet.show_group_info) {
				const info_x = part3_cur_x;
				const info_y = 2 * part_h - (RES._4K ? 5 : 0);
				const info_h = part_h; //row_h;
				const info_w = this.w - info_x;
				const info_text_format = Stringformat.trim_ellipsis_char | Stringformat.no_wrap;

				// * Genres
				let genre_text_w = 0;
				const extraGenreSpacing = 0; // Don't use SCALE() due to font differences
				let genreX = info_x;
				if (!is_radio && this.grouping_handler.get_query_name() !== 'artist') {
					if (!this.hyperlinks.genre0) {
						const genre_text = $('[%genre%]', this.metadb).replace(/, /g, ' \u2022 ');
						genre_text_w = Math.ceil(gr.MeasureString(genre_text, pl.font.info, 0, 0, 0, 0).Width + extraGenreSpacing);
						grClip.DrawString(genre_text, pl.font.info, info_color, genreX, info_y, info_w, info_h, info_text_format);
					} else {
						let i = 0;
						let genre_hyperlink;
						while (this.hyperlinks[`genre${i}`]) {
							if (i > 0) {
								grClip.DrawString(' \u2022 ', pl.font.info, info_color, genre_hyperlink.x + genre_hyperlink.getWidth() + SCALE(2), info_y, SCALE(20), info_h);
							}
							genre_hyperlink = this.hyperlinks[`genre${i}`];
							genre_hyperlink.draw(grClip, info_color);
							genreX = genre_hyperlink.x;
							genre_text_w = genre_hyperlink.getWidth();
							i++;
						}
					}
				}

				const info_text = this.getGroupInfoString(is_radio, genre_text_w > 0);
				const info_text_w = Math.ceil(gr.MeasureString(info_text, pl.font.info, 0, 0, 0, 0).Width); // TODO: Mordred - should only call MeasureString once
				grClip.DrawString(info_text, pl.font.info, info_color, genreX + (genre_text_w || 0), info_y + 1, info_w - (genreX - info_x) - (genre_text_w || 0) - SCALE(20), info_h, info_text_format);

				// * Record labels
				if (!this.hyperlinks.label0) {
					const label_string = $('$if2(%label%,[%publisher%])', this.metadb).replace(/, /g, ' \u2022 ');
					const label_w = Math.ceil(gr.MeasureString(label_string, pl.font.info, 0, 0, 0, 0).Width + 10);
					if (info_w > label_w + info_text_w) {
						grClip.DrawString(label_string, pl.font.info, info_color, this.w - label_w - 10, info_y, label_w, info_h, Stringformat.h_align_far);
					}
				} else {
					let i = 0;
					let drawCount = 0;
					let lastLabel;
					while (this.hyperlinks[`label${i}`]) {
						const label_hyperlink = this.hyperlinks[`label${i}`];
						if (label_hyperlink.x > genreX + genre_text_w + info_text_w) {
							if (drawCount > 0) {
								grClip.DrawString(' \u2022', pl.font.info, info_color, lastLabel.x + lastLabel.getWidth(), info_y, SCALE(20), info_h);
							}
							label_hyperlink.draw(grClip, info_color);
							drawCount++;
						}
						lastLabel = label_hyperlink;    // We want to draw bullet AFTER the previous label
						i++;
					}
				}

				// * Info line
				const info_text_h = Math.ceil(gr.MeasureString(info_text, pl.font.info, 0, 0, 0, 0).Height + 5);
				const line_x1 = left_pad;
				const line_x2 = this.w - SCALE(20);
				const line_y = info_y + info_text_h;
				if (line_x2 - line_x1 > 0) {
					grClip.DrawLine(line_x1, line_y, line_x2, line_y, 1, line_color);
				}
			}

			// * PART 2 ALBUM LINE
			{
				let line_x1 = part2_cur_x;
				if (line_x1 !== left_pad) {
					line_x1 += RES._4K ? 20 : 9;
				}

				const album_text = $(this.grouping_handler.get_sub_title_query(), this.metadb);
				const album_height = gr.MeasureString(album_text, pl.font.album, 0, 0, 0, 0).Height;
				const date_query = grSet.showPlaylistFullDate ? grTF.date : grTF.year;
				const date_text = $(date_query, this.metadb);
				const date_height = gr.MeasureString(date_text, pl.font.date, 0, 0, 0, 0).Height;
				const line_x2 = this.w - part2_right_pad - (date_text ? (RES._4K ? 58 : 25) : SCALE(20));

				const yCorrSize = {
					22: { '4K': -4, 'HD': -1 },
					20: { '4K': -5, 'HD':  0 },
					18: { '4K': -5, 'HD': -1 },
					17: { '4K': -4, 'HD':  1 },
					16: { '4K': -3, 'HD': -1 },
					15: { '4K': -4, 'HD':  0 },
					14: { '4K': -4, 'HD':  0 },
					13: { '4K': -3, 'HD':  0 },
					12: { '4K': -5, 'HD':  0 },
					10: { '4K': -2, 'HD':  0 }
				};
				const yCorr = yCorrSize[headerFontSize] ? yCorrSize[headerFontSize][RES._4K ? '4K' : 'HD'] : 0;
				const line_y =
					!plSet.show_group_info ? Math.round(this.h / 2) :
					grSet.customThemeFonts ? Math.floor(this.h / 2 + (date_height - album_height)) :
					Math.round(this.h / 2) + SCALE(RES._4K ? 7 : 6) + yCorr;

				if (line_x2 - line_x1 > 0) {
					grClip.DrawLine(line_x1, line_y, line_x2, line_y, 1, line_color);
				}
			}

			clipImg.ReleaseGraphics(grClip);
			if (cache_header) {
				this.header_image = clipImg;
			}
		}

		let y = this.y;
		let h = this.h;
		let srcY = 0;
		if (this.y < top) {
			y = top;
			h = this.h - (top - this.y);
			srcY = this.h - h;
		} else if (this.y + this.h > bottom) {
			h = bottom - this.y;
		}
		gr.DrawImage(cache_header ? this.header_image : clipImg, this.x, y, this.w, h, 0, srcY, this.w, h);
		if (this.is_completely_selected() && (grSet.theme === 'white' || grSet.theme === 'black')) {
			gr.SetSmoothingMode(SmoothingMode.None);
			gr.FillSolidRect(this.x, y + SCALE(6), 0, h, grCol.primary);
			gr.SetSmoothingMode(SmoothingMode.HighQuality);
		}
		clipImg = null;
	}

	/**
	 * Draws the playlist header in compact layout.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	draw_compact_header(gr) {
		let artist_color = pl.col.header_artist_normal;
		let album_color = pl.col.header_album_normal;
		let date_color = pl.col.header_date_normal;
		let line_color = pl.col.header_line_normal;
		let artist_font = pl.font.artist_normal_compact;
		const date_font = pl.font.date_compact;
		const headerFontSize = grSet[`playlistHeaderFontSize_${grSet.layout}`];
		const updatedNowpBg = pl.col.header_nowplaying_bg !== ''; // * Wait until nowplaying bg has a new color to prevent flashing
		const scrollbar = plSet.show_scrollbar && pl.playlist.is_scrollbar_available;

		if (this.is_playing() && updatedNowpBg) {
			artist_color = pl.col.header_artist_playing;
			album_color = pl.col.header_album_playing;
			date_color = pl.col.header_date_playing;
			line_color = pl.col.header_line_playing;
			artist_font = pl.font.artist_playing_compact;

			if (grCol.lightBg && (grSet.theme === 'white' || grSet.theme === 'black')) {
				artist_color = RGB(0, 0, 0);
				album_color = RGB(20, 20, 20);
				date_color = RGB(20, 20, 20);
			}
			else if (!grCol.lightBg && (grSet.theme === 'white' || grSet.theme === 'black')) {
				artist_color = RGB(240, 240, 240);
				album_color = RGB(220, 220, 220);
				date_color = RGB(220, 220, 220);
			}
		}

		const clipImg = gdi.CreateImage(this.w, this.h);
		const grClip = clipImg.GetGraphics();

		//--->
		if (!grSet.styleBlend) grClip.FillSolidRect(0, 0, this.w, this.h, pl.col.bg); // Solid background for ClearTypeGridFit text rendering
		// if (this.has_selected_items() && grSet.theme.startsWith('custom')) {
		// 	grClip.FillSolidRect(0, 0, this.w, this.h, pl.col.row_selection_bg);
		// }

		if (this.is_playing() && updatedNowpBg) {
			grClip.FillSolidRect(0, 0, scrollbar ? this.w - SCALE(12) : this.w, this.h, pl.col.header_nowplaying_bg);
			grClip.FillSolidRect(0, 0, ['white', 'black', 'cream'].includes(grSet.theme) ? 0 : SCALE(8), this.h, pl.col.header_sideMarker);
		}

		// * Need to apply text rendering AntiAliasGridFit when using style Blend or when using custom theme fonts with larger font sizes
		grClip.SetTextRenderingHint(grSet.styleBlend || grSet.customThemeFonts && headerFontSize > 18 ? TextRenderingHint.AntiAliasGridFit : TextRenderingHint.ClearTypeGridFit);

		if (this.is_collapsed && this.is_focused()) {
			grClip.DrawRect(-1, 0, this.w + 1, this.h - 1, 1, line_color);
		}

		//************************************************************//

		const is_radio = this.metadb.RawPath.startsWith('http');

		const left_pad = SCALE(20);
		let right_pad = 0;
		let cur_x = left_pad;

		// * Date
		if (this.grouping_handler.show_date()) {
			const date_query = grSet.showPlaylistFullDate ? grTF.date : grTF.year;
			const date_text = $(date_query, this.metadb);
			if (date_text) {
				const date_w = Math.ceil(gr.MeasureString(date_text, date_font, 0, 0, 0, 0).Width + 5);
				const date_x = this.w - date_w - SCALE(12);
				const date_y = 0;
				const date_h = this.h;

				if (date_x > left_pad) {
					grClip.DrawString(date_text, date_font, date_color, date_x, date_y, date_w, date_h, Stringformat.v_align_center);
				}

				right_pad += this.w - date_x;
			}
		}

		// * Artist
		if (this.grouping_handler.get_title_query()) {
			let artist_text = $(this.grouping_handler.get_title_query(), this.metadb);
			if (!artist_text) {
				artist_text = is_radio ? 'Radio Stream' : '?';
			}

			if (artist_text) {
				const artist_x = cur_x;
				const artist_w = this.w - artist_x - (right_pad + 5);
				const artist_h = this.h;

				const artist_text_format = Stringformat.v_align_center | Stringformat.trim_ellipsis_char | Stringformat.no_wrap;
				grClip.DrawString(artist_text, artist_font, artist_color, artist_x, 0, artist_w, artist_h, artist_text_format);

				cur_x += Math.ceil(
					/** @type {!number} */
					gr.MeasureString(artist_text, artist_font, 0, 0, 0, 0).Width
				);
			}
		}

		// * Album
		if (this.grouping_handler.get_sub_title_query()) {
			// let album_text = $(this.grouping_handler.get_sub_title_query(), this.metadb);
			let album_text = plSet.show_disc_header ? $('[%album%]', this.metadb) : $(this.grouping_handler.get_sub_title_query(), this.metadb);

			if (album_text) {
				album_text = ` - ${album_text}`;

				const album_h = this.h;
				const album_x = cur_x;
				const album_w = this.w - album_x - (right_pad + SCALE(40));

				const album_text_format = Stringformat.v_align_center | Stringformat.trim_ellipsis_char | Stringformat.no_wrap;
				grClip.DrawString(album_text, pl.font.album, album_color, album_x, 0, album_w, album_h, album_text_format);

				// cur_x += gr.MeasureString(album_text, pl.font.album, 0, 0, 0, 0).Width;
			}
		}

		clipImg.ReleaseGraphics(grClip);
		gr.DrawImage(clipImg, this.x, this.y, this.w, this.h, 0, 0, this.w, this.h, 0, 255);

		// * Callbacks for headerTooltip
		this.artist_w_compact = this.w - cur_x - (right_pad + 5);
		this.album_w_compact = this.w - cur_x - (right_pad + SCALE(40));
		this.artist_text_w_compact = gr.MeasureString($(this.grouping_handler.get_title_query(), this.metadb), artist_font, 0, 0, 0, 0).Width;
		this.album_text_w_compact = gr.MeasureString($(this.grouping_handler.get_sub_title_query(), this.metadb), pl.font.album, 0, 0, 0, 0).Width;
	}

	/**
	 * Sets the x-coordinate for the ListItem object.
	 * @param {number} x - The x-coordinate.
	 */
	set_x(x) {
		BaseListItem.prototype.set_x.apply(this, [x]);
	}

	/**
	 * Sets the y-coordinate for the ListItem object.
	 * @param {number} y - The y-coordinate.
	 */
	set_y(y) {
		BaseListItem.prototype.set_y.apply(this, [y]);

		for (const h in this.hyperlinks) {
			this.hyperlinks[h].setY(y);
		}
	}

	/**
	 * Sets the width of a list item and its sub-items, as well as the container width of any hyperlinks within the item.
	 * @param {number} w - The width.
	 */
	set_w(w) {
		this.reset_hyperlinks(); // Update hyperlinks container width when this.list_w changes, i.e when auto-hide scrollbar visibility state changes
		BaseListItem.prototype.set_w.apply(this, [w]);

		for (const item of this.sub_items) {
			item.set_w(w);
		}

		for (const h in this.hyperlinks) {
			this.hyperlinks[h].setContainerWidth(w);
		}

		this.initialize_rating();
	}

	/**
	 * Initializes header items by creating sub headers and assigning properties to each item.
	 * @override
	 * @param {Array} rows_with_data - The rows with data.
	 * @returns {number} The length of the `owned_rows` array.
	 */
	init_header_items(rows_with_data) { // Rewritten
		if (!rows_with_data[0].length) {
			this.sub_items = [];
			return 0;
		}

		const showHeader = plSet.show_header;
		const isOddOffset = showHeader ? 0 : 1;
		const rows_with_header_data = rows_with_data[0];
		const first_data = rows_with_header_data[0][1];
		const len = rows_with_header_data.length;
		const owned_rows = [];
		let idx = 0;

		for (; idx < len; idx++) {
			if (first_data !== rows_with_header_data[idx][1]) {
				break;
			}
			const item = rows_with_header_data[idx][0];
			item.idx_in_header = idx;
			item.parent = this;
			item.is_odd = !(idx & 1) ^ isOddOffset;

			owned_rows.push(item);
		}

		this.metadb = owned_rows[0].metadb;

		const show_disc_headers = plSet.show_disc_header && this.grouping_handler.show_disc();
		const rows_with_disc_header_data = rows_with_data[1] || [];
		const sub_headers = show_disc_headers ? this.create_disc_headers(rows_with_disc_header_data, idx) : [];
		this.sub_items = sub_headers.length ? sub_headers : owned_rows;

		return idx;
	}

	/**
	 * Initializes hyperlinks for various metadata fields such as date, artist, album, record labels, and genres.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	initialize_hyperlinks(gr) {
		const date_font = pl.font.date;
		const artist_font = pl.font.artist_normal;
		const headerFontSize = grSet[`playlistHeaderFontSize_${grSet.layout}`];
		const art_box_x = 3 * SCALE(6);
		const spacing = SCALE(2);
		const art_box_size = this.art_max_size + spacing * 2;
		const left_pad = SCALE(20);
		const right_edge = SCALE(20);
		const part_h = this.h / 3;
		const separatorWidth = gr.MeasureString(' \u2020', pl.font.info, 0, 0, 0, 0).Width;
		const bulletWidth = Math.ceil(gr.MeasureString('\u2020', pl.font.info, 0, 0, 0, 0).Width);
		const spaceWidth = Math.ceil(separatorWidth - bulletWidth) + SCALE(1);
		const truncatedWidth = art_box_x + art_box_size * ((this.art === null && plSet.auto_album_art ? 1 : plSet.show_album_art ? 2 : 1) + (grSet.showPlaylistFullDate ? 0.5 : 0));

		// * Date
		const date_query = grSet.showPlaylistFullDate ? grTF.date : grTF.year;
		const date_text = $(date_query, this.metadb);
		if (date_text) {
			const date_w = Math.ceil(gr.MeasureString(date_text, date_font, 0, 0, 0, 0).Width + 5);
			const date_x = -date_w - right_edge + (RES._4K ? 5 : 7);
			const yCorrSize = {
				20: { '4K': -1, 'HD': 2 },
				18: { '4K': -1, 'HD': 0 },
				16: { '4K':  1, 'HD': 0 },
				13: { '4K': -1, 'HD': 0 },
				12: { '4K': -1, 'HD': 0 }
			};
			const HDCorr = !RES._4K && headerFontSize < 15 ? 1 : 0;
			const cThemeFontsCorr = RES._4K ? (grSet.customThemeFonts ? 1 : 3) : (grSet.customThemeFonts ? -1 : 0);
			const yCorr = yCorrSize[headerFontSize] && yCorrSize[headerFontSize][RES._4K ? '4K' : 'HD'] || 0;
			const date_y_base = !plSet.show_group_info ? part_h : part_h - cThemeFontsCorr;
			const date_y = date_y_base + yCorr + HDCorr;

			this.hyperlinks.date = new Hyperlink(date_text, date_font, 'date', date_x, date_y, this.w, true);
		}

		// * Artist
		const albumArtist = grSet.headerFlipRows ? this.grouping_handler.get_sub_title_query() : this.grouping_handler.get_title_query();
		const is_radio = this.metadb.RawPath.startsWith('http');
		let artist_text = [];
		let artist_x = left_pad;
		let artist_w;
		let multi_artist_spacing_w = 0;
		let multi_artist = false;
		if (!is_radio) {
			for (let i = 0; i < albumArtist.length; i++) {
				artist_text.push(...GetMetaValues(albumArtist, this.metadb));
			}
			artist_text = [...new Set(artist_text)]; // Remove duplicates
			for (let i = 0; i < artist_text.length; i++) {
				if (i > 0) {
					artist_x += bulletWidth + spaceWidth * 3; // Spacing between multi artists
					multi_artist_spacing_w = bulletWidth + spaceWidth * 3 * i; // Total spacing width
				}
				const single_artist_w = this.w - left_pad * 2 - truncatedWidth;
				const multi_artist_w = this.w - left_pad - artist_x - truncatedWidth;
				const ellipsis_w = gr.MeasureString('...', artist_font, 0, 0, 0, 0).Width;
				artist_w = gr.MeasureString(artist_text[i], artist_font, 0, 0, 0, 0).Width;
				if (artist_text.length > 1) {
					multi_artist = true;
					if (artist_w > multi_artist_w) {
						while (artist_w + ellipsis_w > multi_artist_w && artist_text[i].length > 0) {
							artist_text[i] = artist_text[i].substring(0, artist_text[i].length - 1);
							artist_w = gr.MeasureString(artist_text[i], artist_font, 0, 0, 0, 0).Width;
						}
						if (artist_text[i].length > 0) {
							artist_text[i] += '...';
							artist_w += ellipsis_w;
						}
					}
				} else {
					artist_w = single_artist_w;
				}
				this.hyperlinks[`artist${i}`] = new Hyperlink(artist_text[i], artist_font, 'artist', artist_x, SCALE(5 * (!plSet.show_group_info ? 2 : 1)), artist_w, true);
				artist_x += artist_w;
			}
		}

		// * Album
		const album_y = part_h * (!plSet.show_group_info ? 1.5 : 1) + ((RES._4K || RES._QHD && headerFontSize === 17 ? 5 : 4) * (!plSet.show_group_info ? 2 : 1));
		const album_text = grSet.headerFlipRows ? $(this.grouping_handler.get_title_query(), this.metadb) : $(this.grouping_handler.get_sub_title_query(), this.metadb);

		if (album_text) {
			this.hyperlinks.album = new Hyperlink(album_text, pl.font.album, 'album', left_pad, album_y, this.w - left_pad * 2 - truncatedWidth, true);
		}

		// * Record labels
		const labelTags = ['label', 'publisher', 'discogs_label'];
		let labels = [];
		for (const label of labelTags) {
			labels.push(...GetMetaValues(label, this.metadb));
		}
		labels = [...new Set(labels)]; // Remove duplicates
		let label_left = -right_edge * 2 + (RES._4K ? 42 : 20);
		const label_y = Math.round(2 * this.h / 3) - (RES._4K ? 4 : -1);
		for (let i = labels.length - 1; i >= 0; --i) {
			if (i !== labels.length - 1) {
				label_left -= (bulletWidth + spaceWidth * 2); // Spacing between labels
			}
			const label_w = gr.MeasureString(labels[i], pl.font.info, 0, 0, 0, 0).Width;
			label_left -= label_w;
			this.hyperlinks[`label${i}`] = new Hyperlink(labels[i], pl.font.info, 'label', label_left, label_y, this.w, true);
		}

		// * Genres
		const genres = GetMetaValues('%genre%', this.metadb);
		let genre_left = left_pad;
		const genre_y = label_y;
		for (let i = 0; i < genres.length; i++) {
			if (i > 0) {
				genre_left += bulletWidth + spaceWidth * 2; // Spacing between genres
			}
			const genre_w = gr.MeasureString(genres[i], pl.font.info, 0, 0, 0, 0).Width;
			this.hyperlinks[`genre${i}`] = new Hyperlink(genres[i], pl.font.info, 'genre', genre_left, genre_y, this.w, true);
			genre_left += genre_w;
		}

		for (const h in this.hyperlinks) {
			this.hyperlinks[h].setY(this.y);
		}

		// * Callbacks for headerTooltip
		this.artist_text_w = gr.MeasureString(artist_text, artist_font, 0, 0, 0, 0).Width + (multi_artist ? multi_artist_spacing_w : 0);
		this.album_text_w = gr.MeasureString(album_text, pl.font.album, 0, 0, 0, 0).Width;
		this.max_w = this.w - left_pad * 2 - truncatedWidth;

		// * Hyperlinks init done
		this.hyperlinks_initialized = true;
	}

	/**
	 * Initializes the rating and sets its position within a given area.
	 */
	initialize_rating() {
		this.rating = new PlaylistRating(0, this.y, this.w - this.rating_right_pad, this.h, this.metadb);
		this.rating.x = this.x + this.w - (this.rating.w + this.rating_right_pad);
	}

	/**
	 * Creates disc headers for the playlist based on the provided parameters.
	 * @param {Array} prepared_rows - The rows with data.
	 * @param {number} rows_to_process_count - The number of rows to process.
	 * @returns {Array<PlaylistDiscHeader>} The disc headers.
	 */
	create_disc_headers(prepared_rows, rows_to_process_count) {
		return PlaylistDiscHeader.create_disc_headers(this, this.x, 0, this.w, pl.geo.row_h, prepared_rows, rows_to_process_count);
	}

	/**
	 * Returns a string containing information about a group of audio files,
	 * including codec, sample rate, bit depth, track count, disc number, replay gain, genre tags and duration.
	 * @param {boolean} is_radio - If the playback source is from radio streaming.
	 * @param {boolean} hasGenreTags - If the group has genre tags or not.
	 * @returns {string} The information about the group.
	 */
	getGroupInfoString(is_radio, hasGenreTags) {
		const bitspersample = Number($('$info(bitspersample)', this.metadb));
		const samplerate = Number($('$info(samplerate)', this.metadb));
		const sample = ((bitspersample > 16 || samplerate > 44100 || grCfg.settings.playlistShowBitSampleAlways) ? $(' [$info(bitspersample)bit/]', this.metadb) + samplerate / 1000 + 'khz' : '');
		const formatAiffWav = 'aiff' || 'wav';
		let codec = formatAiffWav ? $('$upper($ext(%path%))', this.metadb) : $('$if2(%codec%,$ext(%path%))', this.metadb);

		if (codec === 'dca (dts coherent acoustics)') {
			codec = 'dts';
		}
		if (codec === 'cue') {
			codec = $('$ext($info(referenced_file))', this.metadb);
		}
		else if (codec === 'mpc') {
			codec += $('[-$info(codec_profile)]', this.metadb).replace('quality ', 'q');
		}
		else if (['dts', 'ac3', 'atsc a/52'].includes(codec)) {
			codec += $("[ $replace($replace($replace($info(channel_mode), + LFE,),' front, ','/'),' rear surround channels',$if($strstr($info(channel_mode),' + LFE'),.1,.0))] %bitrate%", this.metadb) + ' kbps';
			codec = codec.replace('atsc a/52', 'Dolby Digital');
		}
		else if ($('$info(encoding)', this.metadb) === 'lossy') {
			codec += $('$info(codec_profile)', this.metadb) === 'CBR' ? $('[-%bitrate% kbps]', this.metadb) : $('[-$info(codec_profile)]', this.metadb);
		}
		if (codec) {
			codec += sample;
		}
		else {
			codec = (this.metadb.RawPath.startsWith('3dydfy:') || this.metadb.RawPath.startsWith('fy+')) ? 'yt' : this.metadb.Path;
		}

		let track_count = this.sub_items.length;
		let has_discs = false;
		if (this.sub_items[0] instanceof PlaylistDiscHeader) {
			track_count = 0;
			has_discs = true;
			for (const discHeader of this.sub_items) {
				track_count += discHeader.sub_items.length;
			}
		}

		const disc_number = (!plSet.show_disc_header && $('[%totaldiscs%]', this.metadb) !== '1') ? $('[ | Disc: %discnumber%[/%totaldiscs%]]', this.metadb) : '';
		const track_text = is_radio ? '' : ' | ' +
			// (this.grouping_handler.show_disc() && has_discs ? this.sub_items.length + ' Discs - ' : '') +
			(this.grouping_handler.show_disc() && has_discs && ($('[%totaldiscs%]', this.metadb) > 1) ? `${this.sub_items.length} Discs - ` : '') +
			track_count + (track_count === 1 ? ' Track' : ' Tracks');
		const replaygain = (this.grouping_handler.show_disc() && (!has_discs || $('[%totaldiscs%]', this.metadb) === '')) ? $('[ | %replaygain_album_gain%]', this.metadb) : '';
		const plr_album = (plSet.show_PLR_header && this.grouping_handler.show_disc() && (!has_discs || $('[%totaldiscs%]', this.metadb) === '')) ? ` | ${this.meta_handler.get_PLR($('%replaygain_album_gain%', this.metadb), $('%replaygain_album_peak_db%', this.metadb))} LU` : '';
		let info_text = codec + disc_number + replaygain + plr_album + track_text;

		if (hasGenreTags) {
			info_text = ` | ${info_text}`;
		}
		if (this.get_duration()) {
			info_text += ` | Time: ${utils.FormatDuration(this.get_duration())}`;
		}

		if (plSet.show_rating_header && $('%rating%', this.metadb) !== '') {
			const albumName = $('%album%', this.metadb);
			const albumRating = this.rating.get_album_rating().get(albumName);

			if (albumRating !== undefined) {
				info_text += ` | Rating: ${albumRating}`;
			}
		}

		// * Use custom playlist header info if pattern was defined in the config file
		const customInfoText = $(grCfg.settings.playlistCustomHeaderInfo, this.metadb);
		if (customInfoText !== '') {
			return ` | ${customInfoText}`;
		}

		return info_text;
	}

	/**
	 * Assigns and resizes an image to the "art" property, based on certain conditions and constraints.
	 * @param {GdiBitmap} image - The album art image that is being assigned to the `art` property.
	 */
	assign_art(image) {
		if (!image || !plSet.show_album_art) {
			this.art = null;
			return;
		}

		if ((image.Height === this.art_max_size && image.Width <= this.art_max_size) ||
			(image.Height <= this.art_max_size && image.Width === this.art_max_size)) {
			this.art = image;
		}
		else {
			const ratio = image.Height / image.Width;
			let art_h = this.art_max_size;
			let art_w = this.art_max_size;
			if (image.Height > image.Width) {
				art_w = Math.round(art_h / ratio);
			}
			else {
				art_h = Math.round(art_w * ratio);
			}

			try { // Prevent crash if album art is corrupt, file format is not supported or has an unusual ICC profile embedded
				this.art = image.Resize(art_w, art_h);
			} catch (e) {
				console.log('\n>>> Error => assign_art: Album art in Playlist could not be scaled!\n>>> Maybe it is corrupt, file format is not supported or has an unusual ICC profile embedded.\n');
			}
		}

		PlaylistHeader.img_cache.add_image_for_meta(this.art, this.metadb);
	}

	/**
	 * Checks if the album art was successfully loaded.
	 * @returns {boolean} True or false.
	 */
	is_art_loaded() {
		return this.art !== undefined;
	}

	/**
	 * Clears the playlist header background image.
	 */
	clearCachedHeaderImg() {
		this.header_image = null;
	}

	/**
	 * Resets the current hyperlinks.
	 */
	reset_hyperlinks() {
		this.hyperlinks_initialized = false;
		this.hyperlinks = {};
	}

	/**
	 * Displays the playlist header tooltip when artist or album text is truncated.
	 */
	headerTooltip() {
		if (!grSet.showTooltipMain && !grSet.showTooltipTruncated || grm.ui.displayCustomThemeMenu && grm.ui.displayBiography) {
			return;
		}

		const artist_text = $(this.grouping_handler.get_title_query(), this.metadb);
		const album_text = $(this.grouping_handler.get_sub_title_query(), this.metadb);

		if (this.artist_text_w > this.max_w || this.album_text_w > this.max_w ||
			plSet.use_compact_header && (this.artist_text_w_compact > this.artist_w_compact || this.album_text_w_compact > this.album_w_compact)) {
			grm.ttip.showDelayed(`${artist_text}\n${album_text}`);
		} else {
			grm.ttip.stop();
		}
	}
	// #endregion

	// * CALLBACKS * //
	// #region CALLBACKS
	/**
	 * Checks if the mouse click is within the boundaries of any hyperlinks and triggers their click event.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 * @returns {boolean} True or false.
	 */
	on_mouse_lbtn_down(x, y, m) {
		for (const h in this.hyperlinks) {
			if (this.hyperlinks[h].trace(x - this.x, y)) {
				this.hyperlinks[h].click();
				return true;
			}
		}
		return false;
	}

	/**
	 * Handles mouse movement events and updates the state of hyperlinks based on the mouse position.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} m - The mouse mask.
	 * @returns {boolean} True or false.
	 */
	on_mouse_move(x, y, m) {
		let is_hovering = false;
		let handled = false;
		let needs_redraw = false;

		for (const h in this.hyperlinks) {
			if (this.hyperlinks[h].trace(x - this.x, y)) {
				is_hovering = true;
				if (this.hyperlinks[h].state !== HyperlinkStates.Hovered) {
					this.hyperlinks[h].state = HyperlinkStates.Hovered;
					needs_redraw = true;
				}
				handled = true;
			}
			else if (this.hyperlinks[h].state !== HyperlinkStates.Normal) {
				this.hyperlinks[h].state = HyperlinkStates.Normal;
				needs_redraw = true;
			}
		}

		this.headerTooltip();

		if (!is_hovering) {
			grm.ttip.stop();
		}

		if (needs_redraw) {
			this.clearCachedHeaderImg();
			this.repaint();
		}

		return handled;
	}
	// #endregion
}


/////////////////////
// * DISC HEADER * //
/////////////////////
/**
 * A class that creates collapsible headers in the playlist row for music albums that have multiple CD's.
 * @augments {PlaylistBaseHeader}
 */
class PlaylistDiscHeader extends PlaylistBaseHeader {
	/**
	 * Creates the `PlaylistDiscHeader` instance.
	 * @param {object} parent - The parent object or container that this object belongs to.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 * @param {number} idx - The index to identify the instance of the object.
	 */
	constructor(parent, x, y, w, h, idx) {
		super(parent, x, y, w, h, idx);
		/** @private @type {number} */
		this.idx = idx;
		/** @private @type {string} */
		this.disc_title = '';
	}

	// * STATIC METHODS * //
	// #region STATIC METHODS
	/**
	 * Prepares the initialization data for the disc header.
	 * @param {Array<PlaylistRow>} rows_to_process - The rows to process.
	 * @param {FbMetadbHandleList} rows_metadb - The metadb of the rows to process.
	 * @returns {Array<Array>} Has the following format Array<[row,row_data]>.
	 */
	static prepare_disc_header_data(rows_to_process, rows_metadb) {
		const tfo = fb.TitleFormat(`$ifgreater(%totaldiscs%,1,[Disc %discnumber% $if(${grTF.disc_subtitle}, \u2014 ,) ],)[${grTF.disc_subtitle}]`);
		const disc_data = tfo.EvalWithMetadbs(rows_metadb);

		return Zip(rows_to_process, disc_data);
	}

	/**
	 * Validates if the data for the disc header rows is valid.
	 * @param {Array} rows_with_data - The rows of data.
	 * @param {number} rows_to_check_count - The number of rows to check.
	 * @returns {boolean} True if the data is valid, false otherwise.
	 */
	static validate_disc_header_data(rows_with_data, rows_to_check_count) {
		for (let i = 0; i < rows_to_check_count; ++i) {
			if (!IsEmpty(rows_with_data[i][1])) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Creates a header for each disc.
	 * @param {PlaylistBaseHeader} parent - The parent element.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 * @param {Array<Array>} prepared_rows - The rows of data. Has the following format Array<[row,row_data]>.
	 * @param {number} rows_to_process_count - The number of rows to process.
	 * @returns {Array<PlaylistDiscHeader>} An array of PlaylistDiscHeader instances that have been created.
	 */
	static create_disc_headers(parent, x, y, w, h, prepared_rows, rows_to_process_count) {
		if (!this.validate_disc_header_data(prepared_rows, rows_to_process_count)) {
			TrimArray(prepared_rows, rows_to_process_count, true);
			return [];
		}

		let header_idx = 0;
		const headers = [];
		const prepared_rows_copy = new Array(rows_to_process_count);

		for (let i = 0; i < rows_to_process_count; i++) { // Make a copy
			prepared_rows_copy[i] = prepared_rows[i];
		}
		prepared_rows_copy.length = rows_to_process_count;

		while (prepared_rows_copy.length) {
			const header = new PlaylistDiscHeader(parent, x, y, w, h, header_idx);
			const processed_items = header.init_disc_header_items(prepared_rows_copy);

			TrimArray(prepared_rows_copy, processed_items, true);

			headers.push(header);
			++header_idx;
		}

		TrimArray(prepared_rows, rows_to_process_count, true);

		return headers;
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Draws the disc header in the rows when an album contains multiple CDs.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 * @param {number} top - The top of the header.
	 * @param {number} bottom - The bottom of the header.
	 */
	draw(gr, top, bottom) {
		gr.SetSmoothingMode(SmoothingMode.None);

		const cur_x = this.x + SCALE(20);
		const right_pad = SCALE(20);

		let title_font = pl.font.title_normal;
		let title_color = pl.col.row_title_normal;

		if (this.is_selected()) {
			title_color = pl.col.row_title_selected;
			title_font = pl.font.title_selected;
			gr.FillSolidRect(this.x, this.y, SCALE(8), this.h - 1, pl.col.row_sideMarker);
		}

		const disc_header_text_format = Stringformat.v_align_center | Stringformat.trim_ellipsis_char | Stringformat.no_wrap;
		const disc_text = this.disc_title; // $('[Disc %discnumber% $if('+ tf.disc_subtitle+', \u2014 ,) ]['+ tf.disc_subtitle +']', that.sub_items[0].metadb);
		gr.DrawString(disc_text, title_font, title_color, cur_x, this.y, this.w, this.h, disc_header_text_format);
		const disc_w = Math.ceil(gr.MeasureString(disc_text, title_font, 0, 0, 0, 0).Width + 14);

		const subheader_PLR_album = (plSet.show_PLR_header && $('[%totaldiscs%]', this.sub_items[0].metadb) > 1) ? `${this.meta_handler.get_PLR($('%replaygain_album_gain%', this.sub_items[0].metadb), $('%replaygain_album_peak_db%', this.sub_items[0].metadb))} LU | ` : '';
		const replayGain = ($('[%totaldiscs%]', this.sub_items[0].metadb) > 1) ? $('[%replaygain_album_gain% | ]', this.sub_items[0].metadb) : '';
		const tracks_text = `${(replayGain)}${(subheader_PLR_album)}${this.sub_items.length} Track${this.sub_items.length > 1 ? 's' : ''} - ${utils.FormatDuration(this.get_duration())}`;

		const tracks_w = Math.ceil(gr.MeasureString(tracks_text, title_font, 0, 0, 0, 0).Width + 20);
		const tracks_x = this.x + this.w - tracks_w - right_pad;

		gr.DrawString(tracks_text, title_font, title_color, tracks_x, this.y, tracks_w, this.h, Stringformat.v_align_center | Stringformat.h_align_far);

		if (this.is_collapsed || !this.is_collapsed) {
			const line_y = Math.round(this.y + this.h / 2) + SCALE(4);
			gr.DrawLine(RES._4K ? cur_x + disc_w + 5 : cur_x + disc_w - 5, line_y, RES._4K ? this.x + this.w - tracks_w - 40 : this.x + this.w - tracks_w - 10, line_y, 1, pl.col.row_disc_subheader_line);
		}
	}

	/**
	 * Initializes sub_items with rows from rows_with_data that have the same value in the second column,
	 * sets properties for each row, and returns the length of sub_items.
	 * @override
	 * @param {Array} rows_with_data - An array of arrays, where each inner array represents a row of data.
	 * Each inner array contains two elements: the row object and the data value for that row.
	 */
	init_disc_header_items(rows_with_data) { // Rewritten
		/** @type {PlaylistRow[]} */
		this.sub_items = [];

		const first_data = rows_with_data[0][1];
		const rows_length = rows_with_data.length;

		if (!rows_length) {
			return 0;
		}

		for (let index = 0; index < rows_length; index++) {
			if (first_data !== rows_with_data[index][1]) {
				break;
			}

			const row = rows_with_data[index][0];
			row.idx_in_header = index;
			row.is_odd = !(index & 1);
			row.parent = this;
			this.sub_items.push(row);
		}

		this.disc_title = first_data;

		return this.sub_items.length;
	}

	/**
	 * Calculates the total duration in seconds of a list of sub items.
	 * @override
	 * @returns {number} A float number.
	 */
	get_duration() {
		let duration_in_seconds = 0;

		for (const item of this.sub_items) {
			duration_in_seconds += item.metadb.Length;
		}

		if (!duration_in_seconds) {
			return 0;
		}

		return duration_in_seconds;
	}

	/**
	 * Checks if all sub_items are selected.
	 * @returns {boolean} True or false.
	 */
	is_selected() {
		return this.sub_items.every(row => row.is_selected());
	}

	/**
	 * Toggles the state of the disc header.
	 */
	toggle_collapse() {
		this.is_collapsed = !this.is_collapsed;

		// this.header.collapse();
		// this.header.expand();
	}
	// #endregion

	// * CALLBACKS * //
	// #region CALLBACKS
	/**
	 * Toggles the collapse state of the disc header when the left mouse button is double-clicked.
	 * @param {PlaylistCollapseHandler} collapse_handler - The collapse handler to use.
	 */
	on_mouse_lbtn_dblclk(collapse_handler) {
		collapse_handler.toggle_collapse(this);
	}
	// #endregion
}
