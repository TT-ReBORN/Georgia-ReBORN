'use strict';

g_properties.add_properties(
	{
		wheel_scroll_page: ['user.scrollbar.wheel_whole_page', false]
	}
);

// SCROLLBAR
// SCROLLBARPARTS
const SBP_ARROWBTN = 1;
const SBP_THUMBBTNHORZ = 2;
const SBP_THUMBBTNVERT = 3;
const SBP_LOWERTRACKHORZ = 4;
const SBP_UPPERTRACKHORZ = 5;
const SBP_LOWERTRACKVERT = 6;
const SBP_UPPERTRACKVERT = 7;
const SBP_GRIPPERHORZ = 8;
const SBP_GRIPPERVERT = 9;
const SBP_SIZEBOX = 10;

// ARROWBTNSTATES
const ABS_UPNORMAL = 1;
const ABS_UPHOT = 2;
const ABS_UPPRESSED = 3;
const ABS_UPDISABLED = 4;
const ABS_DOWNNORMAL = 5;
const ABS_DOWNHOT = 6;
const ABS_DOWNPRESSED = 7;
const ABS_DOWNDISABLED = 8;
const ABS_LEFTNORMAL = 9;
const ABS_LEFTHOT = 10;
const ABS_LEFTPRESSED = 11;
const ABS_LEFTDISABLED = 12;
const ABS_RIGHTNORMAL = 13;
const ABS_RIGHTHOT = 14;
const ABS_RIGHTPRESSED = 15;
const ABS_RIGHTDISABLED = 16;
const ABS_UPHOVER = 17;
const ABS_DOWNHOVER = 18;
const ABS_LEFTHOVER = 19;
const ABS_RIGHTHOVER = 20;

/** @constructor */
function ScrollBar(x, y, w, h, row_h, fn_redraw) {
	this.paint = function (gr) {
		gr.FillSolidRect(this.x, this.y, this.w, this.h, _RGB(37, 37, 37));
		_.forEach(this.sb_parts, function (item, i) {
			var x = item.x,
				y = item.y,
				w = item.w,
				h = item.h;

			gr.DrawImage(item.img_normal, x, y, w, h, 0, 0, w, h, 0, 255);
			switch (i) {
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
		});
	};

	this.repaint = function () {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	};

	this.reset = function () {
		throttled_scroll_to.flush();
		alpha_timer.stop();
		this.stop_shift_timer();

		this.scroll = 0;
		this.calc_params();
	};

	this.trace = function (x, y) {
		return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
	};

	this.set_window_param = function (rows_drawn, row_count) {
		this.rows_drawn = rows_drawn;
		this.row_count = row_count;
		this.calc_params();
		this.create_parts();
	};

	this.calc_params = function () {
		this.btn_h = this.w;
		// draw info
		this.scrollbar_h = this.h - this.btn_h * 2;
		this.thumb_h = Math.max(Math.round(this.scrollbar_h * this.rows_drawn / this.row_count), 12);
		this.scrollbar_travel = this.scrollbar_h - this.thumb_h;
		// scrolling info
		this.scrollable_lines = this.row_count - this.rows_drawn;
		this.thumb_y = this.btn_h + this.scroll * this.scrollbar_travel / this.scrollable_lines;
		this.drag_distance_per_row = this.scrollbar_travel / this.scrollable_lines;
	};

	this.create_parts = function () {
		create_dynamic_scrollbar_images(this.w, this.thumb_h);

		var x = this.x;
		var y = this.y;
		var w = this.w;
		var h = this.h;

		this.sb_parts = {
			lineUp:   new ScrollBarPart(x, y, w, this.btn_h, scrollbar_images.lineUp),
			thumb:    new ScrollBarPart(x, y + this.thumb_y, w, this.thumb_h, scrollbar_images.thumb),
			lineDown: new ScrollBarPart(x, y + h - this.btn_h, w, this.btn_h, scrollbar_images.lineDown)
		};
	};

	this.wheel = function (wheel_direction) {
		var direction = -wheel_direction;

		if (this.wheel_scroll_page) {
			this.shift_page(direction);
		}
		else {
			var newScroll = this.nearestScroll(direction);
			this.scroll_to(newScroll + direction * 2);
		}
	};

	this.parts_leave = function () {
		this.in_sbar = false;
		cur_part_key = null;

		_.forEach(this.sb_parts, function (item) {
			item.cs('normal');
		});
		alpha_timer.start();
	};

	this.leave = function () {
		if (this.b_is_dragging) {
			return;
		}

		this.parts_leave();
	};

	this.parts_move = function (x, y) {
		var hover_part_key = _.findKey(this.sb_parts, function (item) {
			return item.trace(x, y);
		});

		var changeHotStatus = this.trace(x, y) !== this.in_sbar;
		if (changeHotStatus) {
			this.in_sbar = !this.in_sbar;
			if (this.in_sbar) {
				if (hover_part_key !== 'lineUp' && cur_part_key !== 'lineUp') {
					this.sb_parts['lineUp'].cs('hot');
				}
				if (hover_part_key !== 'lineDown' && cur_part_key !== 'lineDown') {
					this.sb_parts['lineDown'].cs('hot');
				}
				alpha_timer.start();
			}
			else {
				if (cur_part_key !== 'lineUp') {
					this.sb_parts['lineUp'].cs('normal');
				}
				if (cur_part_key !== 'lineDown') {
					this.sb_parts['lineDown'].cs('normal');
				}
				alpha_timer.start();
			}
		}

		if (cur_part_key === hover_part_key) {// Nothing to do: same button
			return cur_part_key;
		}

		if (cur_part_key) {
			if (cur_part_key === 'thumb') {
				this.sb_parts[cur_part_key].cs('normal');
				alpha_timer.start();
			}
			else {
				if (this.sb_parts[cur_part_key].state === 'pressed') {
					// Stop btn fast scroll
					this.stop_shift_timer();
				}

				// Return prev button to normal or hot state
				this.sb_parts[cur_part_key].cs(this.in_sbar ? 'hot' : 'normal');
				alpha_timer.start();
			}
		}

		if (hover_part_key) {// Select current button
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
			//this.scroll_to( (p_y - this.y - this.initial_drag_y - this.btn_h) / this.drag_distance_per_row);

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

	this.lbtn_dn = function (p_x, p_y) {
		if (!this.trace(p_x, p_y) || this.row_count <= this.rows_drawn) {
			return;
		}

		this.parts_lbtn_down(p_x, p_y);

		var y = p_y - this.y;

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
		else { // on bar
			this.b_is_dragging = true;
			this.initial_drag_y = y - this.thumb_y;
		}
	};

	this.parts_lbtn_up = function (x, y) {
		if (!cur_part_key || this.sb_parts[cur_part_key].state !== 'pressed') {
			return false;
		}

		var new_state = this.sb_parts[cur_part_key].trace(x, y) ? 'hover' : 'normal';

		this.sb_parts[cur_part_key].cs(new_state);
		alpha_timer.start();

		return true;
	};

	this.lbtn_up = function (x, y) {
		this.parts_lbtn_up(x, y);
		if (this.b_is_dragging) {
			this.b_is_dragging = false;
		}
		this.initial_drag_y = 0;

		this.stop_shift_timer();
	};

	this.shift_line = function (direction) {
		var newScroll = this.nearestScroll(direction);
		this.scroll_to(newScroll);
	};

	this.shift_page = function (direction) {
		var newScroll = this.nearestScroll(direction);
		this.scroll_to(newScroll + direction * Math.floor(Math.max(this.rows_drawn - 1, 1)));
	};

	this.scroll_to_end = function () {
		this.scroll_to(this.scrollable_lines);
	};

	this.start_shift_timer = function (shift) {
		if (_.isNil(timer_shift)) {
			var shift_amount = shift;
			timer_shift_count = 0;
			timer_shift = setInterval(_.bind(function () {
				if (this.thumb_y <= this.btn_h || this.thumb_y + this.thumb_h >= this.h - this.btn_h) {
					this.stop_shift_timer();
					return;
				}
				if (timer_stop_y !== -1) {
					var new_thumb_y = this.btn_h + (this.scroll + shift) * this.scrollbar_travel / this.scrollable_lines;

					if ((shift > 0 && new_thumb_y >= timer_stop_y)
						|| (shift < 0 && new_thumb_y + this.thumb_h <= timer_stop_y)) {
						this.stop_shift_timer();
						return;
					}
				}

				if (timer_shift_count > 8) {
					this.scroll_to(this.scroll + shift_amount);
				}
				else {
					timer_shift_count++;
				}
			}, this), 40);
		}
	};

	this.stop_shift_timer = function () {
		if (!_.isNil(timer_shift)) {
			clearInterval(timer_shift);
			timer_shift = undefined;
		}
		timer_stop_y = -1;
	};

	this.nearestScroll = function (direction) {
		var scrollShift = this.scroll - Math.floor(this.scroll);
		var drawnShift = 1 - (this.rows_drawn - Math.floor(this.rows_drawn));
		var newScroll = 0;

		if (direction < 0 && scrollShift !== 0) {
			newScroll = Math.floor(this.scroll);
		}
		else if (direction > 0 && Math.abs(drawnShift - scrollShift) > 0.0001) {
			if (drawnShift > scrollShift) {
				newScroll = Math.floor(this.scroll) + drawnShift;
			}
			else {
				newScroll = Math.ceil(this.scroll) + drawnShift;
			}
		}
		else {
			newScroll = this.scroll + direction;
		}

		return newScroll;
	};

	// TODO: remove after compatibility fixes
	this.check_scroll = function (new_scroll, set_scroll_only) {
		this.scroll_to(new_scroll, set_scroll_only);
	};

	this.scroll_to = function (new_position, scroll_wo_redraw) {
		var s = Math.max(0, Math.min(new_position, this.scrollable_lines));
		if (s === this.scroll) {
			return;
		}
		this.scroll = s;
		this.thumb_y = this.btn_h + this.scroll * this.scrollbar_travel / this.scrollable_lines;
		this.sb_parts['thumb'].y = this.y + this.thumb_y;

		this.is_scrolled_up = (this.scroll === 0);
		this.is_scrolled_down = Math.abs(this.scroll - this.scrollable_lines) < 0.0001;

		if (!scroll_wo_redraw) {
			this.fn_redraw();
		}
	};

	this.set_x = function (x) {
		this.x = x;
		_.forEach(this.sb_parts, function (item) {
			item.x = x;
		});
	};

	// private:
	var throttled_scroll_to = _.throttle(_.bind(function () {
		this.scroll_to((throttled_scroll_y - this.btn_h) / this.drag_distance_per_row);
	}, this), 1000 / 60);

	function create_scrollbar_images() {
		if (scrollbar_images.length > 0) {
			return;
		}

		var fontSegoeUi = gdi.Font('Segoe UI Symbol', 15);

		var ico_back_colors =
			[
				_RGB(37, 37, 37),
				_RGB(170, 172, 174),
				_RGB(90, 92, 94),
				_RGB(140, 142, 144)
			];
		var ico_fore_colors =
			[
				_RGB(140, 142, 144),
				_RGB(40, 42, 44),
				_RGB(30, 32, 34),
				_RGB(30, 32, 34)
			];

		var btn =
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

		_.forEach(btn, function (item, i) {
			var w = item.w,
				h = item.h;

			var m = 2;

			var stateImages = []; //0=normal, 1=hover, 2=down, 3=hot;

			for (var s = 0; s < 4; s++) {
				var img = gdi.CreateImage(w, h);
				var grClip = img.GetGraphics();

				var icoColor = ico_fore_colors[s];
				var backColor = ico_back_colors[s];

				if (i === 'lineUp') {
					grClip.FillSolidRect(m, 0, w - m * 2, h - 1, backColor);
				}
				else if (i === 'lineDown') {
					grClip.FillSolidRect(m, 1, w - m * 2, h - 1, backColor);
				}

				grClip.SetSmoothingMode(SmoothingMode.HighQuality);
				grClip.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

				var btn_format = StringFormat();
				btn_format.alignment = StringAlignment.center;
				btn_format.line_alignment = StringAlignment.far;

				if (i === 'lineDown') {
					grClip.DrawString(item.ico, item.font, icoColor, 0, 0, w, h, btn_format.value());
				}
				else if (i === 'lineUp') {
					grClip.DrawString(item.ico, item.font, icoColor, 0, 0, w, h - 1, btn_format.value());
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
		});
	}

	function create_dynamic_scrollbar_images(thumb_w, thumb_h) {
		var thumb_colors =
			[
				_RGB(110, 112, 114),
				_RGB(170, 172, 174),
				_RGB(90, 92, 94)
			];

		var w = thumb_w,
			h = thumb_h;
		var m = 2;

		var stateImages = []; //0=normal, 1=hover, 2=down;

		for (var s = 0; s <= 2; s++) {
			var img = gdi.CreateImage(w, h);
			var grClip = img.GetGraphics();

			var color = thumb_colors[s];
			grClip.FillSolidRect(m, 0, w - m * 2, h, color);

			img.ReleaseGraphics(grClip);
			stateImages[s] = img;
		}

		scrollbar_images['thumb'] =
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
	this.rows_drawn = 0; // visible list size in rows (might be float)
	this.row_count = 0; // all rows in associated list

	this.fn_redraw = fn_redraw; // callback for list redraw

	this.draw_timer = false;

	this.sb_parts = [];

	// Btns
	this.btn_h = 0;

	// Thumb
	this.thumb_h = 0;
	this.thumb_y = 0; // upper y

	this.in_sbar = false;

	this.b_is_dragging = false;
	this.is_scrolled_down = false;
	this.is_scrolled_up = true;
	this.drag_distance_per_row = 0; // how far should the thumb move, when the list shifts by one row
	this.initial_drag_y = 0; // dragging

	this.scroll = 0; // lines shifted in list (float)

	this.wheel_scroll_page = g_properties.wheel_scroll_page;

	this.scrollbar_h = 0; // space between sb_parts (arrows)
	this.scrollable_lines = 0; // not visible rows (row_count - rows_drawn)
	this.scrollbar_travel = 0; // space for thumb to travel (scrollbar_h - thumb_h)

	// private:
	var that = this;

	var scrollbar_images = [];

	var cur_part_key = null;

	// Timers
	var throttled_scroll_y = 0;
	var timer_shift;
	var timer_shift_count;
	var timer_stop_y = -1;

	var alpha_timer = new function () {
		this.start = function () {
			var hoverInStep = 50;
			var hoverOutStep = 15;
			var downOutStep = 50;

			if (!alpha_timer_internal) {
				alpha_timer_internal = setInterval(_.bind(function () {
					_.forEach(that.sb_parts, function (item, i) {
						switch (item.state) {
							case 'normal':
								item.hover_alpha = Math.max(0, item.hover_alpha -= hoverOutStep);
								item.hot_alpha = Math.max(0, item.hot_alpha -= hoverOutStep);
								if (i === 'thumb') {
									item.pressed_alpha = Math.max(0, item.pressed_alpha -= hoverOutStep);
								}
								else {
									item.pressed_alpha = Math.max(0, item.pressed_alpha -= downOutStep);
								}

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
						//console.log(i, item.state, item.hover_alpha , item.pressed_alpha , item.hot_alpha);
						//item.repaint();
					});

					that.repaint();

					var alpha_in_progress = _.some(that.sb_parts, function (item) {
						return (item.hover_alpha > 0 && item.hover_alpha < 255)
							|| (item.pressed_alpha > 0 && item.pressed_alpha < 255)
							|| (item.hot_alpha > 0 && item.hot_alpha < 255);
					});

					if (!alpha_in_progress) {
						this.stop();
					}
				}, this), 25);
			}
		};

		this.stop = function () {
			if (alpha_timer_internal) {
				clearInterval(alpha_timer_internal);
				alpha_timer_internal = null;
			}
		};

		var alpha_timer_internal = null;
	};

	create_scrollbar_images();
}

/** @constructor */
function ScrollBarPart(x, y, w, h, img_src) {
	this.repaint = function () {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	};

	this.trace = function (x, y) {
		return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
	};

	this.cs = function (s) {
		this.state = s;
		this.repaint();
	};

	this.assign_imgs = function (imgs) {
		this.img_normal = this.img_hover = this.img_hover = this.img_hover = null;

		if (imgs === undefined) {
			return;
		}

		this.img_normal = _.isString(imgs.normal) ? _img(imgs.normal) : imgs.normal;
		this.img_hover = imgs.hover ? (_.isString(imgs.hover) ? _img(imgs.hover) : imgs.hover) : this.img_normal;
		this.img_pressed = imgs.pressed ? (_.isString(imgs.pressed) ? _img(imgs.pressed) : imgs.pressed) : this.img_normal;
		this.img_hot = imgs.hot ? (_.isString(imgs.hot) ? _img(imgs.hot) : imgs.hot) : this.img_normal;
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
