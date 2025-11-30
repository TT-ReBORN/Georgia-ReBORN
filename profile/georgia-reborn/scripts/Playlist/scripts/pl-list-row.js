/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Playlist Row                             * //
// * Author:         TT                                                      * //
// * Org. Author:    extremeHunter, TheQwertiest                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    30-11-2025                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////
// * ROW * //
/////////////
/**
 * A class that creates and draws the playlist rows.
 * @augments {BaseListItem}
 */
class PlaylistRow extends BaseListItem {
	/**
	 * Creates the `PlaylistRow` instance.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 * @param {number} idx - The playlist row index.
	 * @param {number} cur_playlist_idx_arg - The current playlist index.
	 */
	constructor(x, y, w, h, metadb, idx, cur_playlist_idx_arg) {
		super(x, y, w, h);

		/** @private @constant @type {FbMetadbHandle} */
		this.metadb = metadb;
		/** @public @constant @type {number} */
		this.idx = idx;
		/** @private @constant @type {number} */
		this.cur_playlist_idx = cur_playlist_idx_arg;
		/** @public @type {?number[]} */
		this.queue_indexes = undefined;
		/** @public @type {number} */
		this.queue_idx_count = 0;
		/** @public @type {number} */
		this.idx_in_header = undefined;
		/** @public @constant @type {PlaylistBaseHeader} */
		this.parent = undefined;

		/** @public @type {boolean} */
		this.is_playing = false;
		/** @public @type {boolean} */
		this.is_focused = false;
		/** @public @type {boolean} */
		this.is_hovered = false;
		/** @public @type {boolean} */
		this.is_cropped = false;
		/** @public @type {boolean} */
		this.is_odd = false;
		/** @public @type {boolean} */
		this.is_drop_boundary_reached = false;
		/** @public @type {boolean} */
		this.is_drop_bottom_selected = false;
		/** @public @type {boolean} */
		this.is_drop_top_selected = false;

		/** @private @type {number} */
		this.rating_left_pad = 0;
		/** @private @type {number} */
		this.rating_right_pad = 10;
		/** @private @type {?PlaylistRating} */
		this.rating = undefined;

		/** @private @type {number} Playlist title color for row hover. */
		this.title_color = pl.col.row_title_normal;
		/** @private @type {?string} */
		this.title_text = undefined;
		/** @private @type {?string} */
		this.title_artist_text = undefined;
		/** @private @type {?string} */
		this.count_text = undefined;
		/** @private @type {?string} */
		this.length_text = undefined;

		/** @public @type {?PlaylistMetaProvider} The instance of the PlaylistMetaProvider class. */
		this.meta_provider = new PlaylistMetaProvider();

		this.initialize_rating();
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Draws the playlist rows, including the titles, artists, lengths, ratings, playcounts, and queue positions.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	draw(gr) {
		if (grSet.panelWidthAuto && !plSet.show_header) {
			this.x = pl.playlist.x;
		}

		gr.SetSmoothingMode(SmoothingMode.None);

		if (this.is_odd && plSet.show_row_stripes) {
			gr.FillSolidRect(this.x, this.y, this.w, this.h, grSet.playlistBgImg ? RGBtoRGBA(pl.col.row_stripes_bg, grSet.playlistBgRowOpacity) : pl.col.row_stripes_bg);
		}

		let title_font = pl.font.title_normal;
		const title_artist_font = pl.font.title_selected;
		let title_artist_color = pl.col.row_title_selected;
		const scrollbar = plSet.show_scrollbar && pl.playlist.is_scrollbar_available;

		if (this.is_selected()) {
			this.title_color = pl.col.row_title_selected;
			title_font = pl.font.title_selected;
			title_artist_color = pl.col.row_title_normal;

			// if (plSet.show_row_stripes) { // Don't need this!?
			// 	// Last item is cropped
			// 	const rect_h = this.is_cropped ? this.h - 1 : this.h;
			// 	gr.DrawRect(this.x, this.y, this.w, rect_h, 1, pl.col.row_selection_frame_cropped);
			// }

			// if (grSet.theme.startsWith('custom')) {
			// 	gr.FillSolidRect(this.x, this.y, this.w, this.h, pl.col.row_selection_bg);
			// }
			if (!this.is_playing) { // Do not draw selection on now playing to prevent 1px overlapping
				gr.DrawRect(this.x, this.is_playing ? this.y - 1 : this.y, scrollbar ? this.w - HD_4K(13, 25) : this.w, this.h, 1, pl.col.row_selection_frame);
				// Hide DrawRect 1px gaps when all songs are completely selected
				gr.DrawRect(this.x, this.is_playing ? this.y - 1 : this.y, SCALE(7), this.h, 1, pl.col.row_sideMarker);
				gr.FillSolidRect(this.x, this.y, SCALE(8), this.h, pl.col.row_sideMarker);
			}
		} else {
			this.title_color = grSet.playlistRowHover && this.is_hovered ? pl.col.row_title_hovered : pl.col.row_title_normal;
		}

		if (this.is_playing && pl.col.row_nowplaying_bg !== '') { // * Wait until nowplaying bg has a new color to prevent flashing
			this.title_color = pl.col.row_title_playing;
			title_font = pl.font.title_playing;

			const bg_color = grSet.playlistBgImg ? RGBtoRGBA(pl.col.row_nowplaying_bg, grSet.playlistBgRowOpacity) : pl.col.row_nowplaying_bg;
			if (!grSet.styleBlend && !grSet.playlistBgImg || grSet.playlistBgImg && !grSet.playlistBgRowNowPlaying) gr.FillSolidRect(this.x, this.y, scrollbar ? this.w - SCALE(12) : this.w, this.h, bg_color); // Correct bg alpha for nowplaying
			gr.FillSolidRect(this.x, this.y, scrollbar ? this.w - SCALE(12) : this.w, this.h, bg_color);
			if (ColorDistance(bg_color, title_artist_color) < 195) {
				title_artist_color = this.title_color;
			}

			if (grCol.lightBg && (grSet.theme === 'white' && !grSet.styleBlackAndWhite && !grSet.styleBlackAndWhite2 || grSet.theme === 'black')) {
				this.title_color = RGB(20, 20, 20);
				title_artist_color = RGB(0, 0, 0);
			}
			if (!grCol.lightBg && grSet.theme === 'white' && !grSet.styleBlackAndWhite && !grSet.styleBlackAndWhite2 && !grm.ui.isStreaming && grSet.layout === 'default') {
				this.title_color = RGB(240, 240, 240);
				title_artist_color = RGB(220, 220, 220);
			}
			if (grSet.theme === 'white' && (grSet.styleBlackAndWhite || grSet.styleBlackAndWhite2) || !['white', 'black', 'cream'].includes(grSet.theme)) {
				gr.FillSolidRect(this.x, this.y, SCALE(8), this.h, pl.col.row_sideMarker);
			}
		}

		//--->
		if (this.is_drop_top_selected) {
			gr.DrawLine(this.x, this.y + 1, this.x + this.w, this.y + 1, 2, this.is_drop_boundary_reached ? pl.col.row_drag_line_reached : pl.col.row_drag_line);
		}
		if (this.is_drop_bottom_selected) {
			gr.DrawLine(this.x, this.y + this.h - 1, this.x + this.w, this.y + this.h - 1, 2, this.is_drop_boundary_reached ? pl.col.row_drag_line_reached : pl.col.row_drag_line);
		}

		////////////////////////////////////////////////////////////

		const is_radio = Regex.WebStreaming.test(this.metadb.RawPath);

		const right_spacing = SCALE(20);
		let cur_x = this.x + right_spacing;
		let right_pad = SCALE(20);
		const testRect = false; // For debug

		if ($('$ifgreater(%totaldiscs%,1,true,false)', this.metadb) !== 'false') {
			cur_x += SCALE(0);
		}

		// * LENGTH
		{
			const length_w = SCALE(60);
			if (this.length_text == null) {
				this.length_text = $('[%length%]', this.metadb);
			}
			this.length_text =
				this.is_playing && grSet.playlistPlaybackTimeDisplay === 'remaining' ? $('[-%playback_time_remaining%]') :
				this.is_playing && grSet.playlistPlaybackTimeDisplay === 'percent' ? PlaybackTimePercentage() :
				$('[%length%]', this.metadb);

			if (this.length_text) {
				const length_x = this.x + this.w - length_w - right_pad;
				gr.DrawString(this.length_text, title_font, this.title_color, length_x, this.y, length_w, this.h, Stringformat.H_Align_Far | Stringformat.V_Align_Center);
				testRect && gr.DrawRect(length_x, this.y - 1, length_w, this.h, 1, RGBA(155, 155, 255, 250));

				// * Refresh playlist time display every second if it is not default
				if (grSet.playlistPlaybackTimeDisplay !== 'default' && this.is_playing && fb.IsPlaying && !this.repaintScheduled) {
					this.repaintScheduled = true;
					setTimeout(() => {
						window.RepaintRect(length_x + 5, this.y, length_w + 5, this.h);
						this.repaintScheduled = false;
					}, 1000);
				}
			}
			// We always want that padding
			right_pad += Math.max(length_w, Math.ceil(gr.MeasureString(this.length_text, title_font, 0, 0, 0, 0).Width + 10));
		}

		// * RATING
		if (plSet.show_rating) {
			this.rating.x = this.x + this.w - this.rating.w - right_pad;
			this.rating.y = this.y;
			this.rating.draw(gr, pl.col.row_rating_color);

			right_pad += this.rating.w + this.rating_right_pad + this.rating_left_pad;
		}

		// * PLR
		if (plSet.show_PLR) {
			if ($('[%replaygain_track_gain%]', this.metadb) && $('[%replaygain_track_peak_db%]', this.metadb)) {
				this.plr_track = this.meta_provider.get_PLR($('%replaygain_track_gain%', this.metadb), $('%replaygain_track_peak_db%', this.metadb));
			}

			if (this.plr_track) {
				if (this.plr_track < 10) {
					this.plr_track = `  ${this.plr_track}`
				}
				this.plr_track += ' LU |';

				const plr_track_w = Math.ceil(gr.MeasureString(this.plr_track, pl.font.plr_track, 0, 0, 0, 0).Width);
				const plr_track_x = this.x + this.w - plr_track_w - right_pad;

				gr.DrawString(this.plr_track, pl.font.plr_track, this.title_color, plr_track_x, this.y, plr_track_w, this.h, Stringformat.Align_Center);
				testRect && gr.DrawRect(plr_track_x, this.y - 1, plr_track_w, this.h, 1, RGBA(155, 155, 255, 250));

				right_pad = this.w - (plr_track_x - this.x) + 5;
			}
		}

		// * COUNT
		if (plSet.show_playcount) {
			if (this.count_text == null) {
				if (is_radio) {
					this.count_text = '';
				}
				else {
					this.count_text = $('%play_count%', this.metadb);
					if (this.count_text !== '0') {
						this.count_text = $('[$max(%play_count%, %lastfm_play_count%)]', this.metadb);
						this.count_text = !Number(this.count_text) ? '' : (`${this.count_text} |`);
					}
					else if (grSet.lastFmScrobblesFallback) {
						this.count_text = $('[$max(%lastfm_play_count%, %play_count%)]', this.metadb);
						this.count_text = !Number(this.count_text) ? '' : (`${this.count_text} |`);
					}
					else {
						// Don't want to show lastfm play count if track hasn't been played locally
						this.count_text = '';
					}
				}
			}

			if (this.count_text) {
				const count_w = Math.ceil(
					/** @type {!number} */
					gr.MeasureString(this.count_text, pl.font.playcount, 0, 0, 0, 0).Width
				);
				const count_x = this.x + this.w - count_w - right_pad;

				gr.DrawString(this.count_text, pl.font.playcount, this.title_color, count_x, this.y, count_w, this.h, Stringformat.Align_Center);
				testRect && gr.DrawRect(count_x, this.y - 1, count_w, this.h, 1, RGBA(155, 155, 255, 250));

				right_pad += count_w;
			}
		}

		// * TITLE
		if (this.title_text == null) {
			const margin = !grSet.showPlaylistTrackNumbers && !grSet.showPlaylistIndexNumbers ? this.is_playing ? '      ' : '' : ' ';
			const indexNumbers = this.idx < 9 ? `0${this.idx + 1}. ` : `${this.idx + 1}. `;
			const trackNumbers = grSet.showPlaylistIndexNumbers ? indexNumbers : `$if2(%tracknumber%,$pad_right(${this.idx_in_header + 1},2,0)). `;
			const trackNumbersVinyl = grSet.showPlaylistIndexNumbers ? indexNumbers : `$if2(${grTF.vinyl_track},00. )`;
			const trackNumberQuery = this.is_playing ? (plSet.show_header ? '      ' : (grSet.showVinylNums ? trackNumbersVinyl : trackNumbers)) : (grSet.showVinylNums ? trackNumbersVinyl : trackNumbers);
			const showTrackNumber = grSet.showPlaylistTrackNumbers || grSet.showPlaylistIndexNumbers ? trackNumberQuery : '';
			const customTitle = grCfg.settings.playlistCustomTitle;
			const customTitleNoHeader = grCfg.settings.playlistCustomTitleNoHeader;

			const titleQuery =
				plSet.show_header ?
					(grSet.showArtistPlaylistRows && grSet.showAlbumPlaylistRows && customTitle === '' ? `${showTrackNumber}${margin}%artist% - %album% -  %title%[ '('%original artist%' cover)']` :
					 grSet.showArtistPlaylistRows && customTitle === '' ? `${showTrackNumber}${margin}%artist% -  %title%[ '('%original artist%' cover)']` :
					 grSet.showAlbumPlaylistRows  && customTitle === '' ? `${showTrackNumber}${margin}%album% -  %title%[ '('%original artist%' cover)']` :
					 customTitle !== '' ? `${showTrackNumber}${margin}${customTitle}` :
					 `${showTrackNumber}${margin}%title%[ '('%original artist%' cover)']`) :
				customTitleNoHeader !== '' ? `${showTrackNumber}${margin}     ${customTitleNoHeader}` :
				`${margin}     %artist% - %album% - ${showTrackNumber} %title%[ '('%original artist%' cover)']`;

			this.title_text = (fb.IsPlaying && this.is_playing && is_radio) ? $(titleQuery) : $(titleQuery, this.metadb);
		}
		if (this.title_text) {
			const title_w = this.w - right_pad - SCALE(44);
			const title_text_format = Stringformat.V_Align_Center | Stringformat.Trim_Ellipsis_Char | Stringformat.No_Wrap;

			DrawString(gr, this.title_text, title_font, this.title_color, cur_x, this.y, title_w, this.h, title_text_format);
			if (this.is_playing) {
				DrawString(gr, fb.IsPaused ? RebornSymbols.Pause : RebornSymbols.Play, pl.font.playback_icon, this.title_color, cur_x, this.y, title_w, this.h, title_text_format);
			}

			testRect && gr.DrawRect(this.x, this.y - 1, title_w, this.h, 1, RGBA(155, 155, 255, 250));

			// * Set widths for rowTooltip
			this.title_w = this.w - right_pad - SCALE(44);
			this.title_text_w = gr.MeasureString(this.title_text, title_font, 0, 0, 0, 0).Width;

			cur_x += this.title_text_w;
		}

		// * TITLE ARTIST
		if (this.title_artist_text == null) {
			const regex = new RegExp(`^${$('%album artist%', this.metadb).replace(Regex.UtilRegexEscape, '\\$&')} `);
			this.title_artist_text = $(`[$if($strcmp(${grTF.artist},%artist%),$if(%album artist%,$if(%track artist%,%track artist%,),),${grTF.artist})]`, this.metadb);
			if (this.title_artist_text.length) {
				// if tf.artist evaluates to something different than %album artist% strip %artist% from the start of the string
				// i.e. tf.artist = "Metallica feat. Iron Maiden" then we want this.title_artist_text = "feat. Iron Maiden"
				this.title_artist_text = this.title_artist_text.replace(regex, '');
				this.title_artist_text = `  ${Unicode.BlackSmallSquare}  ${this.title_artist_text}`;
			}
		}
		if (this.title_artist_text) {
			const title_artist_x = cur_x;
			const title_artist_w = this.w - (title_artist_x - this.x) - right_pad;
			const title_artist_text_format = Stringformat.V_Align_Center | Stringformat.Trim_Ellipsis_Char | Stringformat.No_Wrap;

			if (grSet.showDifferentArtist) {
				DrawString(gr, this.title_artist_text, title_artist_font, this.title_color, title_artist_x, this.y, title_artist_w, this.h, title_artist_text_format);
			}
			cur_x += Math.ceil(
				/** @type {!number} */
				gr.MeasureString(this.title_artist_text, title_artist_font, 0, 0, title_artist_w, this.h, title_artist_text_format).Width
			);
		}

		// * QUEUE
		const queueText = plSet.show_queue_position && this.queue_indexes != null ? `  [${this.queue_indexes}]` : '';
		if (queueText) {
			const queueX = cur_x;
			const queueW = this.w - (queueX - this.x) - right_pad;
			const queueTextFormat = Stringformat.V_Align_Center | Stringformat.Trim_Ellipsis_Char | Stringformat.No_Wrap;
			let queueColor = this.title_color; // col.primary;

			if (this.is_playing || ColorDistance(queueColor, pl.col.row_stripes_bg) < 165) {
				queueColor = this.title_color;
			}
			gr.DrawString(queueText, title_font, queueColor, queueX, this.y, queueW, this.h, queueTextFormat);
		}
		gr.SetSmoothingMode(SmoothingMode.HighQuality);
	}

	/**
	 * Sets the x-coordinate for the ListItem object and updates the x-coordinate for the rating property.
	 * @override
	 * @param {number} x - The x-coordinate.
	 */
	set_x(x) {
		BaseListItem.prototype.set_x.apply(this, [x]);
		this.rating.x = x;
	}

	/**
	 * Sets the y-coordinate for the ListItem object and updates the y-coordinate for the rating property.
	 * @override
	 * @param {number} y - The y-coordinate.
	 */
	set_y(y) {
		BaseListItem.prototype.set_y.apply(this, [y]);
		this.rating.y = y;
	}

	/**
	 * Sets the width for the ListItem object and updates the width for the rating property.
	 * @override
	 * @param {number} w - The width.
	 */
	set_w(w) {
		BaseListItem.prototype.set_w.apply(this, [w]);
		this.initialize_rating();
	}

	/**
	 * Checks if a playlist item is selected.
	 * @returns {boolean} True or false.
	 */
	is_selected() {
		return plman.IsPlaylistItemSelected(this.cur_playlist_idx, this.idx);
	}

	/**
	 * Initializes the rating and sets its position within a given area.
	 */
	initialize_rating() {
		this.rating = new PlaylistRating(0, this.y, this.w - this.rating_right_pad, this.h, this.metadb);
		this.rating.x = this.x + this.w - (this.rating.w + this.rating_right_pad);
	}

	/**
	 * Handles mouse click events on the rating.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	rating_click(x, y) {
		Assert(plSet.show_rating, LogicError, 'Rating_click was called, when there was no rating object.\nShould use trace before calling click');
		this.rating.click(x, y);
	}

	/**
	 * Checks if the rating is being traced.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	rating_trace(x, y) {
		if (!plSet.show_rating) {
			return false;
		}
		return this.rating.trace(x, y);
	}

	/**
	 * Checks if the mouse is on a playlist item and sets its hover state.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	trace(x, y) {
		const mouseOnItem = this.x <= x && x < this.x + this.w && this.y <= y && y < this.y + this.h;

		// Check if any other row is hovered and reset its state if necessary
		if (PlaylistRow.hovered && PlaylistRow.hovered !== this && PlaylistRow.hovered.is_hovered) {
			PlaylistRow.hovered.is_hovered = false;
		}

		if (mouseOnItem) {
			this.is_hovered = true;
			PlaylistRow.hovered = this; // Set this row as the currently hovered row
		} else {
			this.is_hovered = false;
			PlaylistRow.hovered = null;
		}

		return mouseOnItem;
	}

	/**
	 * Resets the queried data for title, title artist, count, and length.
	 */
	reset_queried_data() {
		this.title_text = undefined;
		this.title_artist_text = undefined;
		this.count_text = undefined;
		this.length_text = undefined;
	}

	/**
	 * Clears the title text from an item in the playlist row.
	 */
	clear_title_text() {
		this.title_text = null;
	}

	/**
	 * Displays the playlist row tooltip when title text is truncated.
	 */
	rowTooltip() {
		if (!grSet.showTooltipMain && !grSet.showTooltipTruncated || grm.ui.displayCustomThemeMenu && grm.ui.displayBiography) {
			return;
		}

		const is_radio = Regex.WebStreaming.test(this.metadb.RawPath);
		const margin = '';
		const indexNumbers = this.idx < 9 ? `0${this.idx + 1}. ` : `${this.idx + 1}. `;
		const trackNumbers = grSet.showPlaylistIndexNumbers ? indexNumbers : `$if2(%tracknumber%,$pad_right(${this.idx_in_header + 1},2,0)). `;
		const trackNumberQuery = grSet.showVinylNums ? grSet.showPlaylistIndexNumbers ? indexNumbers : grTF.vinyl_track : trackNumbers;
		const showTrackNumber = grSet.showPlaylistTrackNumbers || grSet.showPlaylistIndexNumbers ? trackNumberQuery : '';
		const customTitle = grCfg.settings.playlistCustomTitle;
		const customTitleNoHeader = grCfg.settings.playlistCustomTitleNoHeader;

		const titleQuery =
			plSet.show_header ?
				(grSet.showArtistPlaylistRows && grSet.showAlbumPlaylistRows && customTitle === '' ? `${showTrackNumber}${margin}%artist% - %album% -  %title%[ '('%original artist%' cover)']` :
				 grSet.showArtistPlaylistRows && customTitle === '' ? `${showTrackNumber}${margin}%artist% -  %title%[ '('%original artist%' cover)']` :
				 grSet.showAlbumPlaylistRows  && customTitle === '' ? `${showTrackNumber}${margin}%album% -  %title%[ '('%original artist%' cover)']` :
				 customTitle !== '' ? `${showTrackNumber}${margin}${customTitle}` :
				 `${showTrackNumber}${margin}%title%[ '('%original artist%' cover)']`) :
			customTitleNoHeader !== '' ? `${showTrackNumber}${margin}     ${customTitleNoHeader}` :
			`%artist%$crlf()%album%$crlf()${showTrackNumber} %title%[ '('%original artist%' cover)']`;

		const title_text = (fb.IsPlaying && this.is_playing && is_radio) ? $(titleQuery) : $(titleQuery, this.metadb);

		if (this.title_text_w > this.title_w) {
			grm.ttip.showDelayed(title_text);
		} else {
			grm.ttip.stop();
		}
	}

	/**
	 * Updates and determines the color of the playlist row title text.
	 */
	update_title_color() {
		const panelWhite = grCol.colBrightness > 210 && grSet.styleRebornFusion || grCol.colBrightness2 > 210 && grSet.styleRebornFusion2 || grSet.styleBlackAndWhite2;
		const panelBlack = grCol.colBrightness <  25 && grSet.styleRebornFusion || grCol.colBrightness2 < 25  && grSet.styleRebornFusion2 || grSet.styleBlackAndWhite;
		this.title_color = panelWhite ? RGB(80, 80, 80) : panelBlack ? RGB(200, 200, 200) : pl.col.row_title_normal;
	}
	// #endregion
}
