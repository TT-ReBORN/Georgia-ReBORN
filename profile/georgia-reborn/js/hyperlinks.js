//!@ts-check
const HyperlinkStates = {
	Normal: 0,
	Hovered: 1
}

const measureStringScratchImg = gdi.CreateImage(1000, 200);

class Hyperlink {
	/**
	 *
	 * @param {string} text The text that will be displayed in the hyperlink
	 * @param {GdiFont} font
	 * @param {string} type The field name which will be searched when clicking on the hyperlink
	 * @param {number} xOffset x-offset of the hyperlink. Negative values will be subtracted from the containerWidth to right justify.
	 * @param {number} yOffset y-offset of the hyperlink.
	 * @param {number} containerWidth The width of the container the hyperlink will be in. Used for right justification purposes.
	 * @param {boolean} [inPlaylist=false] If the hyperlink is drawing in a scrolling container like a playlist, then it is drawn differently
	 */
	constructor (text, font, type, xOffset, yOffset, containerWidth, inPlaylist = false) {
		this.text = text;
		this.type = type;
		this.x_offset = xOffset;
		if (xOffset < 0) {
			this.x = containerWidth + xOffset; // right justified links
		} else {
			this.x = xOffset;
		}
		this.y_offset = yOffset;
		this.y = yOffset;
		this.container_w = containerWidth;
		this.state = HyperlinkStates.Normal;
		this.inPlaylist = inPlaylist;

		this.setFont(font);
	}

	/**
	 * Gets the width of the hyperlink
	 * @return {number} The width of the hyperlink
	 */
	getWidth() {
		return Math.ceil(this.link_dimensions.Width);
	}

	set_y(y) {
		this.y = y + this.y_offset + (this.inPlaylist ? -2 : 0);	// playlist requires subtracting 2 additional pixels from y for some reason
	}

	/**
	 * Set the xOffset of the hyperlink after it has been created
	 * @param {number} xOffset x-offset of the hyperlink. Negative values will be subtracted from the containerWidth to right justify.
	 */
	set_xOffset(xOffset) {
		if (xOffset < 0) {
			this.x = this.container_w + xOffset; // right justified links
		} else {
			this.x = xOffset;
		}
	}

	/**
	 * Set the width of the container the hyperlink will be placed in.
	 * If hyperlink width is smaller than the container, it will be truncated.
	 * If the the xOffset is negative, the position will be adjusted as the container width changes.
	 * @param {number} w
	 */
	setContainerWidth(w) {
		if (this.x_offset < 0) {
			this.x = w + this.x_offset; // add because offset is negative
		}
		this.container_w = pref.showPlaylistFulldate ? w - scaleForDisplay(320) : w - scaleForDisplay(240);
		this.link_dimensions = this.updateDimensions();
		this.w = Math.ceil(Math.min(this.container_w, this.link_dimensions.Width + 1));
	}

	// private method
	updateDimensions() {
		const gr = measureStringScratchImg.GetGraphics();
		const dimensions = gr.MeasureString(this.text, this.font, 0, 0, 0, 0);
		this.h = Math.ceil(dimensions.Height) + 1;
		this.w = Math.min(Math.ceil(dimensions.Width) + 1, this.container_w);
		measureStringScratchImg.ReleaseGraphics(gr);
		return dimensions;
	}

	setFont(font) {
		this.font = font;
		this.hoverFont = gdi.Font(font.Name, font.Size, font.Style | g_font_style.underline);
		this.link_dimensions = this.updateDimensions();
	}

	trace(x, y) {
		return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
	}

	/**
	 * Draws the hyperlink. When drawing in a playlist, we draw from the y-offset instead of y, because the playlist scrolls.
	 * @param {GdiGraphics} gr
	 * @param {*} color
	 */
	draw(gr, color) {
		var font = this.state === HyperlinkStates.Hovered ? this.hoverFont : this.font;
		gr.DrawString(this.text, font, color, this.x, this.inPlaylist ? this.y_offset : this.y, this.w, this.h, g_string_format.trim_ellipsis_char);
	}

	repaint() {
		try {
			window.RepaintRect(this.x, this.y, this.w, this.h);
		} catch (e) {
			// probably already redrawing
		}
	}

	click() {
		const populatePlaylist = function (query) {
			debugLog(query);
			try {
				const handle_list = fb.GetQueryItems(fb.GetLibraryItems(), query);
				if (handle_list.Count) {
					const pl = plman.FindOrCreatePlaylist('Search', true);
					handle_list.Sort();
					const index = fb.IsPlaying ? handle_list.BSearch(fb.GetNowPlaying()) : -1;
					if (pl === plman.PlayingPlaylist && plman.GetPlayingItemLocation().PlaylistIndex === pl && index !== -1) {
						// remove everything in playlist except currently playing song
						plman.ClearPlaylistSelection(pl);
						plman.SetPlaylistSelection(pl, [plman.GetPlayingItemLocation().PlaylistItemIndex], true);
						plman.RemovePlaylistSelection(pl, true);
						plman.ClearPlaylistSelection(pl);

						handle_list.RemoveById(index);
					} else {
						// nothing playing or Search playlist is not active
						plman.ClearPlaylist(pl);
					}
					plman.InsertPlaylistItems(pl, 0, handle_list);
					plman.SortByFormat(pl, settings.defaultSortString);
					plman.ActivePlaylist = pl;
					return true;
				}
				return false;
			} catch (e) {
				console.log(`Could not succesfully execute: ${query}`);
			}
		}
		/** @type {string} */
		let query;
		switch (this.type) {
			case 'update':
				_.runCmd('https://github.com/TT-ReBORN/Georgia-ReBORN/releases');
				break;
			case 'date':
				if (pref.showPlaylistFulldate) {
					query = '"' + tf.date + '" IS ' + this.text;
				} else {
					query = '"$year(%date%)" IS ' + this.text;
				}
				break;
			case 'artist':
				query = `Artist HAS "${this.text.replace(/"/g,'')}" OR ARTISTFILTER HAS "${this.text.replace(/"/g,'')}"`;
				break;
			default:
				query = `${this.type} IS "${this.text}"`;
				break;
		}

		if (!populatePlaylist(query)) {
			var start = this.text.indexOf('[');
			if (start > 0) {
				query = this.type + ' IS ' + this.text.substr(0, start - 3);	// remove ' - [...]' from end of string in case we're showing "Album - [Deluxe Edition]", etc.
				populatePlaylist(query);
			}
		}
	}
}

// for every Hyperlink not created in playlist
function Hyperlinks_on_mouse_move (hyperlink, x, y) {
	var handled = false;
	if (hyperlink.trace(x, y)) {
		if (hyperlink.state !== HyperlinkStates.Hovered) {
			hyperlink.state = HyperlinkStates.Hovered;
			window.RepaintRect(hyperlink.x, hyperlink.y, hyperlink.w, hyperlink.h);
		}
		handled = true;
	} else {
		if (hyperlink.state !== HyperlinkStates.Normal) {
			hyperlink.state = HyperlinkStates.Normal;
			window.RepaintRect(hyperlink.x, hyperlink.y, hyperlink.w, hyperlink.h);
		}
	}
	return handled;
}
