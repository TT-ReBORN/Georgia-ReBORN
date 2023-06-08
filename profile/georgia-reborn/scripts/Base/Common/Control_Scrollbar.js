/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Playlist Scrollbar Control           * //
// * Author:         TT                                                  * //
// * Org. Author:    TheQwertiest                                        * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-05-25                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////////////////////
// * PLAYLIST PROPERTIES * //
/////////////////////////////
g_properties.add_properties(
	{
		wheel_scroll_page: ['Panel Playlist - User: Scrollbar.wheel_whole_page', false]
	}
);


////////////////////////////
// * PLAYLIST SCROLLBAR * //
////////////////////////////
/** @constructor */
function ScrollBar(x, y, w, h, row_h, fn_redraw) {
	this.paint = function (gr) {
		gr.SetSmoothingMode(SmoothingMode.None); // Disable antialiasing, otherwise there will be an ugly 1px outline in style blending


		for (const part in this.sb_parts) {
			const item = this.sb_parts[part];
			const { x, y, w, h } = item;

			gr.DrawImage(item.img_normal, x, y, w, h, 0, 0, w, h, 0, 255);
			switch (part) {
				case 'lineUp':
				case 'lineDown':
					gr.DrawImage(item.img_hot, x, y, w, h, 0, 0, w, h, 0, item.hot_alpha);
					gr.DrawImage(item.img_hover, x, y, w, h, 0, 0, w, h, 0, item.hover_alpha);
					gr.DrawImage(item.img_pressed, x, y, w, h, 0, 0, w, h, 0, item.pressed_alpha);
					break;

				case 'thumb':
					gr.DrawImage(item.img_hover, x, y, w, h, 0, 0, w, h, 0, item.hover_alpha);
					gr.DrawImage(item.img_pressed, x, y, w, h, 0, 0, w, h, 0, item.pressed_alpha);
					break;
			}
		}
	};

	this.repaint = function () {
		window.RepaintRect(this.x - (is_4k ? 13 : 6), this.y, this.w, this.h);
	};

	this.flush = () => {
		if (this.desiredScrollPosition !== undefined) {
			this.scroll_to(this.desiredScrollPosition);
			this.desiredScrollPosition = undefined;
		}
	};

	this.reset = () => {
		this.flush(); // throttled_scroll_to.flush();
		alpha_timer.stop();
		this.stop_shift_timer();

		this.scroll = 0;
		this.calc_params();
	};

	this.trace = function (x, y) {
		return x + scaleForDisplay(10) > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
	};

	this.set_window_param = (rows_drawn, row_count) => {
		this.rows_drawn = rows_drawn;
		this.row_count = row_count;
		this.calc_params();
		this.create_parts();
	};

	this.calc_params = () => {
		this.btn_h = this.w;
		// * Draw info
		this.scrollbar_h = this.h - this.btn_h * 2;
		this.thumb_h = Math.max(Math.round(this.scrollbar_h * this.rows_drawn / this.row_count), is_4k ? 45 : 30);
		this.scrollbar_travel = this.scrollbar_h - this.thumb_h;
		// * Scrolling info
		this.scrollable_lines = this.row_count - this.rows_drawn;
		this.thumb_y = this.btn_h + this.scroll * this.scrollbar_travel / this.scrollable_lines;
		this.drag_distance_per_row = this.scrollbar_travel / this.scrollable_lines;
	};

	this.create_parts = () => {
		create_dynamic_scrollbar_images(this.w, this.thumb_h);

		const { x, y, w, h } = this;

		this.sb_parts = {
			lineUp:   new ScrollBarPart(x - (is_4k ? 13 : 6), y, w, this.btn_h, scrollbar_images.lineUp),
			thumb:    new ScrollBarPart(x, y + this.thumb_y, w - scaleForDisplay(14), this.thumb_h, scrollbar_images.thumb),
			lineDown: new ScrollBarPart(x - (is_4k ? 13 : 6), y + h - this.btn_h, w, this.btn_h, scrollbar_images.lineDown)
		};
	};

	/** @type {number} */ this.desiredScrollPosition = undefined;
	/** @type {number} */ this.lastScrollPosition = undefined;
	this.wheel = (wheel_direction) => {
		const direction = -wheel_direction;

		if (this.wheel_scroll_page) {
			this.shift_page(direction);
		} else {
			const newScroll = this.nearestScroll(direction);
			if (!pref.playlistSmoothScrolling) {
				this.scroll_to(newScroll + direction * pref.playlistWheelScrollSteps);
			} else {
				if (this.desiredScrollPosition === undefined) {
					this.desiredScrollPosition = newScroll + direction * pref.playlistWheelScrollSteps;
				} else {
					this.desiredScrollPosition += (direction * pref.playlistWheelScrollSteps);
				}
				if (direction === -1 && this.desiredScrollPosition < 0) {
					this.desiredScrollPosition = 0;
				} else if (direction === 1 && this.desiredScrollPosition > this.scrollable_lines) {
					this.desiredScrollPosition = this.scrollable_lines;
				}
				this.smooth_scroll_to(this.desiredScrollPosition);
			}
		}
	};

	this.parts_leave = () => {
		this.in_sbar = false;
		cur_part_key = null;

		for (const part in this.sb_parts) {
			this.sb_parts[part].cs('normal');
		}
		alpha_timer.start();
	};

	this.leave = function () {
		if (this.b_is_dragging) {
			return;
		}

		this.parts_leave();
	};

	this.parts_move = (x, y) => {
		const hover_part_key = findKey(this.sb_parts, (item) => item.trace(x, y));

		const changeHotStatus = this.trace(x, y) !== this.in_sbar;
		if (changeHotStatus) {
			this.in_sbar = !this.in_sbar;
			if (this.in_sbar) {
				if (hover_part_key !== 'lineUp' && cur_part_key !== 'lineUp') {
					this.sb_parts.lineUp.cs('hot');
				}
				if (hover_part_key !== 'lineDown' && cur_part_key !== 'lineDown') {
					this.sb_parts.lineDown.cs('hot');
				}
			}
			else {
				if (cur_part_key !== 'lineUp') {
					this.sb_parts.lineUp.cs('normal');
				}
				if (cur_part_key !== 'lineDown') {
					this.sb_parts.lineDown.cs('normal');
				}
			}
			alpha_timer.start();
		}

		if (cur_part_key === hover_part_key) { // Nothing to do: same button
			return cur_part_key;
		}

		if (cur_part_key) {
			if (cur_part_key === 'thumb') {
				this.sb_parts[cur_part_key].cs('normal');
			}
			else {
				if (this.sb_parts[cur_part_key].state === 'pressed') {
					// Stop btn fast scroll
					this.stop_shift_timer();
				}

				// Return prev button to normal or hot state
				this.sb_parts[cur_part_key].cs(this.in_sbar ? 'hot' : 'normal');
			}
			alpha_timer.start();
		}

		if (hover_part_key) { // Select current button
			this.sb_parts[hover_part_key].cs('hover');
			alpha_timer.start();
		}

		cur_part_key = hover_part_key;
		return cur_part_key;
	};

	this.move = function (p_x, p_y) {
		if (this.b_is_dragging) {
			throttled_scroll_y = p_y - this.y - this.initial_drag_y;
			throttled_scroll_to();
			// this.scroll_to( (p_y - this.y - this.initial_drag_y - this.btn_h) / this.drag_distance_per_row);
			return;
		}

		this.parts_move(p_x, p_y);
	};

	this.parts_lbtn_down = function () {
		if (cur_part_key) {
			this.sb_parts[cur_part_key].cs('pressed');
			alpha_timer.start();
		}
	};

	this.lbtn_dn = (p_x, p_y) => {
		if (!this.trace(p_x, p_y) || this.row_count <= this.rows_drawn) {
			return;
		}

		this.parts_lbtn_down();

		const y = p_y - this.y;

		if (y < this.btn_h) {
			this.shift_line(-1);
			this.start_shift_timer(-1);
		}
		else if (y > this.h - this.btn_h) {
			this.shift_line(1);
			this.start_shift_timer(1);
		}
		else if (y < this.thumb_y) {
			this.shift_page(-1);
			timer_stop_y = y;
			this.start_shift_timer(-this.rows_drawn);
		}
		else if (y > this.thumb_y + this.thumb_h) {
			this.shift_page(1);
			timer_stop_y = y;
			this.start_shift_timer(this.rows_drawn);
		}
		else { // On bar
			this.b_is_dragging = true;
			this.initial_drag_y = y - this.thumb_y;
		}
	};

	this.parts_lbtn_up = function (x, y) {
		if (!cur_part_key || this.sb_parts[cur_part_key].state !== 'pressed') {
			return false;
		}

		const new_state = this.sb_parts[cur_part_key].trace(x, y) ? 'hover' : 'normal';

		this.sb_parts[cur_part_key].cs(new_state);
		alpha_timer.start();

		return true;
	};

	this.lbtn_up = (x, y) => {
		this.parts_lbtn_up(x, y);
		if (this.b_is_dragging) {
			this.b_is_dragging = false;
			this.desiredScrollPosition = undefined;
		}
		this.initial_drag_y = 0;

		this.stop_shift_timer();
	};

	this.scroll_to_start = function () {
		this.smooth_scroll_to(0);
	};

	this.shift_line = function (direction) {
		const newScroll = this.nearestScroll(direction);
		this.smooth_scroll_to(newScroll);
	};

	this.shift_page = function (direction) {
		const newScroll = this.nearestScroll(direction);
		this.smooth_scroll_to(newScroll + direction * Math.floor(Math.max(this.rows_drawn - 1, 1)));
	};

	this.scroll_to_end = function () {
		this.smooth_scroll_to(this.scrollable_lines);
	};

	/**
	 * This method inserts a delay (8x45ms) when holding the mouse btn down before scrolling starts,
	 * after the first scroll event happens.
	 * @param {number} shift_amount number of rows to shift
	 */
	this.start_shift_timer = (shift_amount) => {
		if (timer_shift == null) {
			timer_shift_count = 0;
			timer_shift = setInterval(() => {
				if (this.thumb_y <= this.btn_h || this.thumb_y + this.thumb_h >= this.h - this.btn_h) {
					this.stop_shift_timer();
					return;
				}
				if (timer_stop_y !== -1) {
					const new_thumb_y = this.btn_h + (this.scroll + shift_amount) * this.scrollbar_travel / this.scrollable_lines;

					if ((shift_amount > 0 && new_thumb_y >= timer_stop_y)
						|| (shift_amount < 0 && new_thumb_y + this.thumb_h <= timer_stop_y)) {
						this.stop_shift_timer();
						return;
					}
				}

				if (timer_shift_count > 8) {
					if (this.desiredScrollPosition === undefined) {
						this.desiredScrollPosition = this.scroll + shift_amount;
					} else {
						this.desiredScrollPosition += shift_amount;
					}
					this.smooth_scroll_to(this.desiredScrollPosition);
				} else {
					timer_shift_count++;
				}
			}, 45);
		}
	};

	this.stop_shift_timer = () => {
		if (timer_shift != null) {
			clearInterval(timer_shift);
			timer_shift = undefined;
		}
		timer_stop_y = -1;
	};

	this.nearestScroll = function (direction) {
		const scrollShift = this.scroll - Math.floor(this.scroll);
		const drawnShift = 1 - (this.rows_drawn - Math.floor(this.rows_drawn));
		let newScroll = 0;

		if (direction < 0 && scrollShift !== 0) {
			newScroll = Math.floor(this.scroll);
		} else if (direction > 0 && Math.abs(drawnShift - scrollShift) > 0.0001) {
			newScroll = drawnShift > scrollShift ? Math.floor(this.scroll) + drawnShift : Math.ceil(this.scroll) + drawnShift;
		} else {
			newScroll = this.scroll + direction;
		}

		// console.log('current:', this.scroll, 'new:', newScroll, 'dir:', direction, Math.round(this.desiredScrollPosition));
		return newScroll;
	};

	// TODO: remove after compatibility fixes
	// this.check_scroll = function (new_scroll, set_scroll_only) {
	// 	this.scroll_to(new_scroll, set_scroll_only);
	// };

	/**
	 * @param {number} x represents the absolute progress of the animation in the bounds of 0 (beginning of the animation) and 1 (end of animation).
	 * @returns {number}
	 */
	const easeOut = (x) => 1 - Math.pow(1 - x, 3);

	let smoothScrollTimer = null;

	this.stopScrolling = () => {
		clearInterval(smoothScrollTimer);
		smoothScrollTimer = null;
	};

	/**
	 * Scrolls to desired row over 400ms. Can be called repeatedly (during wheel or holding down arrows)
	 * to update desired position.
	 * @param {number} newPosition row position to scroll to
	 * @returns
	 */
	this.smooth_scroll_to = (newPosition) => {
		if (!pref.playlistSmoothScrolling) {
			this.scroll_to(newPosition, false);
		}
		const end = Math.max(0, Math.min(newPosition, this.scrollable_lines));
		if (end === this.scroll) {
			return;
		}
		clearInterval(smoothScrollTimer);
		const start = this.scroll;
		const direction = start - end > 0 ? -1 : 1;
		let animationProgress = 0;  // Percent of animation completion: 0 (start) - 100 (end). Use 100 scale to avoid .009999 issues
		const scrollFunc = () => {
			animationProgress += 8; // Slow things down slightly from 10
			let newVal = start + easeOut(animationProgress / 100) * (end - start);
			if ((Math.abs(newPosition - newVal) < 0.1) ||
				(direction === 1 && newVal > newPosition) ||
				(direction === -1 && newVal < newPosition)) {
				newVal = newPosition;
				animationProgress = 100;    // Clear interval
			} else if (newPosition <= 0) { // Fix crash for auto-hide scrollbar when removing almost everything in playlist and some tracks in top remain
				animationProgress = 100;
			}
			newVal = Math.round(newVal * 100) / 100;
			// console.log(`${start} + easeOut(${animationProgress}/100) * (${end} - ${start}) = `, newVal)
			this.scroll_to(newVal, false);
			if (animationProgress >= 100 && newPosition > 0) {
				this.desiredScrollPosition = undefined;
				this.stopScrolling();
			}
		};
		smoothScrollTimer = setInterval(() => {
			scrollFunc();
		}, pref.playlistWheelScrollDuration / 10);
		scrollFunc();   // Want to immediately start scroll
	};

	this.scroll_to = (new_position, scroll_wo_redraw = false) => {
		const s = Math.max(0, Math.min(new_position, this.scrollable_lines));
		const invalidPos = (s || new_position) > this.scrollable_lines; // Prevent crash
		if (!playlistScrollReady || s === this.scroll) return;
		this.scroll = invalidPos ? 0 : s;
		this.thumb_y = this.btn_h + this.scroll * this.scrollbar_travel / this.scrollable_lines;
		this.sb_parts.thumb.y = this.y + this.thumb_y;

		this.is_scrolled_up = (this.scroll === 0);
		this.is_scrolled_down = Math.abs(this.scroll - this.scrollable_lines) < 0.0001;

		if (!scroll_wo_redraw) {
			this.fn_redraw();
		}
	};

	this.set_x = (x) => {
		this.x = x;
		for (const part in this.sb_parts) {
			this.sb_parts[part].x = x;
		}
	};

	// private:
	const throttled_scroll_to = throttle(() => {
		this.smooth_scroll_to((throttled_scroll_y - this.btn_h) / this.drag_distance_per_row);
	}, 1000 / 60);

	function create_scrollbar_images() {
		if (scrollbar_images.length > 0) {
			return;
		}

		const fontSegoeUi = g_pl_fonts.scrollbar;

		const ico_back_colors =
		[
			g_pl_colors.bg,
			g_pl_colors.bg,
			g_pl_colors.bg,
			g_pl_colors.bg
		];

		const ico_fore_colors =
		[
			g_pl_colors.sbar_btn_normal,
			g_pl_colors.sbar_btn_hovered,
			g_pl_colors.sbar_btn_hovered,
			g_pl_colors.sbar_btn_normal
		];

		const btn =
			{
				lineUp:   {
					ico:  '\uE010',
					font: fontSegoeUi,
					w:    that.w,
					h:    that.w
				},
				lineDown: {
					ico:  '\uE011',
					font: fontSegoeUi,
					w:    that.w,
					h:    that.w
				}
			};

		scrollbar_images = [];

		for (const i in btn) {
			const item = btn[i];
			const { w, h } = item;
			const m = 2;
			const stateImages = []; // 0=normal, 1=hover, 2=down, 3=hot;

			for (let s = 0; s < 4; s++) {
				const img = gdi.CreateImage(w, h);
				const grClip = img.GetGraphics();

				const icoColor = ico_fore_colors[s];
				const backColor = ico_back_colors[s];

				// Don't really need this button backgrounds
				// if (i === 'lineUp') {
				// 	grClip.FillSolidRect(m, 0, w - m * 2, h - 1, backColor);
				// }
				// else if (i === 'lineDown') {
				// 	grClip.FillSolidRect(m, 1, w - m * 2, h - 1, backColor);
				// }

				grClip.SetSmoothingMode(SmoothingMode.HighQuality);
				grClip.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);

				const btn_format = g_string_format.h_align_center | g_string_format.v_align_far;
				if (i === 'lineDown') {
					grClip.DrawString(item.ico, item.font, icoColor, 0, is_4k ? -25 : -12, w, h, btn_format);
				}
				else if (i === 'lineUp') {
					grClip.DrawString(item.ico, item.font, icoColor, 0, 0, w, h, btn_format);
				}

				img.ReleaseGraphics(grClip);
				stateImages[s] = img;
			}

			scrollbar_images[i] =
				{
					normal:  stateImages[0],
					hover:   stateImages[1],
					pressed: stateImages[2],
					hot:     stateImages[3]
				};
		}
	}

	function create_dynamic_scrollbar_images(thumb_w, thumb_h) {
		const thumb_colors =
			[
				g_pl_colors.sbar_thumb_normal,
				g_pl_colors.sbar_thumb_hovered,
				g_pl_colors.sbar_thumb_drag
			];

		const w = thumb_w;
		const h = thumb_h;
		const m = 2;
		const stateImages = []; // 0=normal, 1=hover, 2=down;

		for (let s = 0; s <= 2; s++) {
			const img = gdi.CreateImage(w, h);
			const grClip = img.GetGraphics();

			const color = thumb_colors[s];
			grClip.FillSolidRect(m, 0, w - m * 2, h, color);

			img.ReleaseGraphics(grClip);
			stateImages[s] = img;
		}

		scrollbar_images.thumb =
			{
				normal:  stateImages[0],
				hover:   stateImages[1],
				pressed: stateImages[2]
			};
	}

	// public:
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	this.row_h = row_h;
	this.rows_drawn = 0; // Visible list size in rows (might be float)
	this.row_count = 0; // All rows in associated list

	this.fn_redraw = fn_redraw; // Callback for list redraw

	this.draw_timer = false;

	this.sb_parts = {};

	// * Btns
	this.btn_h = 0;

	// * Thumb
	this.thumb_h = 0;
	this.thumb_y = 0; // Upper y

	this.in_sbar = false;

	this.b_is_dragging = false;
	this.is_scrolled_down = false;
	this.is_scrolled_up = true;
	this.drag_distance_per_row = 0; // How far should the thumb move, when the list shifts by one row
	this.initial_drag_y = 0; // Dragging

	this.scroll = 0; // Lines shifted in list (float)

	this.wheel_scroll_page = g_properties.wheel_scroll_page;

	this.scrollbar_h = 0; // space between sb_parts (arrows)
	this.scrollable_lines = 0; // not visible rows (row_count - rows_drawn)
	this.scrollbar_travel = 0; // space for thumb to travel (scrollbar_h - thumb_h)

	// private:
	const that = this;

	let scrollbar_images = {};

	let cur_part_key = null;

	// * Timers
	let throttled_scroll_y = 0;
	let timer_shift;
	let timer_shift_count;
	let timer_stop_y = -1;

	const alpha_timer = new function () {
		this.start = function () {
			const hoverInStep = 50;
			const hoverOutStep = 15;
			const downOutStep = 50;

			if (!alpha_timer_internal) {
				alpha_timer_internal = setInterval(() => {
					for (const part in that.sb_parts) {
						const item = that.sb_parts[part];
						switch (item.state) {
							case 'normal':
								item.hover_alpha = Math.max(0, item.hover_alpha -= hoverOutStep);
								item.hot_alpha = Math.max(0, item.hot_alpha -= hoverOutStep);
								item.pressed_alpha = part === 'thumb' ? Math.max(0, item.pressed_alpha -= hoverOutStep) : Math.max(0, item.pressed_alpha -= downOutStep);
								break;
							case 'hover':
								item.hover_alpha = Math.min(255, item.hover_alpha += hoverInStep);
								item.hot_alpha = Math.max(0, item.hot_alpha -= hoverOutStep);
								item.pressed_alpha = Math.max(0, item.pressed_alpha -= downOutStep);
								break;
							case 'pressed':
								item.hover_alpha = 0;
								item.hot_alpha = 0;
								item.pressed_alpha = 255;
								break;
							case 'hot':
								item.hover_alpha = Math.max(0, item.hover_alpha -= hoverOutStep);
								item.hot_alpha = Math.min(255, item.hot_alpha += hoverInStep);
								item.pressed_alpha = Math.max(0, item.pressed_alpha -= downOutStep);
								break;
						}
						// console.log(i, item.state, item.hover_alpha , item.pressed_alpha , item.hot_alpha);
						// item.repaint();
					}

					that.repaint();

					const alpha_in_progress = Object.values(that.sb_parts).some((item) =>
						(item.hover_alpha > 0 && item.hover_alpha < 255)
						|| (item.pressed_alpha > 0 && item.pressed_alpha < 255)
						|| (item.hot_alpha > 0 && item.hot_alpha < 255));

					if (!alpha_in_progress) {
						this.stop();
					}
				}, 25);
			}
		};

		this.stop = () => {
			if (alpha_timer_internal) {
				clearInterval(alpha_timer_internal);
				alpha_timer_internal = null;
			}
		};

		let alpha_timer_internal = null;
	}();

	create_scrollbar_images();
}


/////////////////////////////////
// * PLAYLIST SCROLLBAR PART * //
/////////////////////////////////
/** @constructor */
function ScrollBarPart(x, y, w, h, img_src) {
	this.repaint = function () {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	};

	this.trace = function (x, y) {
		return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
	};

	this.cs = (s) => {
		this.state = s;
		this.repaint();
	};

	this.assign_imgs = function (imgs) {
		this.img_normal = this.img_hover = this.img_hover = this.img_hover = null;

		if (imgs === undefined) {
			return;
		}

		this.img_normal = imgs.normal;
		this.img_hover = imgs.hover ? imgs.hover : this.img_normal;
		this.img_pressed = imgs.pressed ? imgs.pressed : this.img_normal;
		this.img_hot = imgs.hot ? imgs.hot : this.img_normal;
	};

	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.img_normal = undefined;
	this.img_hover = undefined;
	this.img_pressed = undefined;
	this.img_hot = undefined;
	this.hover_alpha = 0;
	this.hot_alpha = 0;
	this.pressed_alpha = 0;
	this.state = 'normal';

	this.assign_imgs(img_src);
}
