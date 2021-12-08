// ==PREPROCESSOR==
// @name 'Scrollbar Control'
// @author 'TheQwertiest'
// ==/PREPROCESSOR==

g_properties.add_properties(
    {
        wheel_scroll_page: ['user.scrollbar.wheel_whole_page', false]
    }
);

/** @constructor */
function ScrollBar(x, y, w, h, row_h, fn_redraw) {
    this.paint = function (gr) {
        gr.FillSolidRect(this.x - scaleForDisplay(8), this.y - scaleForDisplay(3), this.w + scaleForDisplay(8), playlist.h, g_pl_colors.background);

        for (let part in this.sb_parts) {
            const item = this.sb_parts[part];
            var x = item.x,
                y = item.y,
                w = item.w,
                h = item.h;

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
        };
    };

    this.repaint = function () {
        window.RepaintRect(this.x - (is_4k ? 13 : 6), this.y, this.w, this.h);
    };

    this.reset = () => {
        throttled_scroll_to.flush();
        alpha_timer.stop();
        this.stop_shift_timer();

        this.scroll = 0;
        this.calc_params();
    };

    this.trace = function (x, y) {
        return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
    };

    this.set_window_param = (rows_drawn, row_count) => {
        this.rows_drawn = rows_drawn;
        this.row_count = row_count;
        this.calc_params();
        this.create_parts();
    };

    this.calc_params = () => {
        this.btn_h = this.w;
        // draw info
        this.scrollbar_h = this.h - this.btn_h * 2;
        this.thumb_h = Math.max(Math.round(this.scrollbar_h * this.rows_drawn / this.row_count), is_4k ? 45 : 30);
        this.scrollbar_travel = this.scrollbar_h - this.thumb_h;
        // scrolling info
        this.scrollable_lines = this.row_count - this.rows_drawn;
        this.thumb_y = this.btn_h + this.scroll * this.scrollbar_travel / this.scrollable_lines;
        this.drag_distance_per_row = this.scrollbar_travel / this.scrollable_lines;
    };

    this.create_parts = () => {
        create_dynamic_scrollbar_images(this.w, this.thumb_h);

        var x = this.x;
        var y = this.y;
        var w = this.w;
        var h = this.h;

        this.sb_parts = {
            lineUp:   new ScrollBarPart(x - (is_4k ? 13 : 6), y, w, this.btn_h, scrollbar_images.lineUp),
            thumb:    new ScrollBarPart(x, y + this.thumb_y, w - scaleForDisplay(14), this.thumb_h, scrollbar_images.thumb),
            lineDown: new ScrollBarPart(x - (is_4k ? 13 : 6), y + h - this.btn_h, w, this.btn_h, scrollbar_images.lineDown)
        };
    };

    /** @type {number} */ this.desiredScrollPosition = undefined;
    /** @type {number} */ this.lastScrollPosition = undefined;
    this.wheel = (wheel_direction) => {
        var direction = -wheel_direction;

        if (this.wheel_scroll_page) {
            this.shift_page(direction);
        } else {
            var newScroll = this.nearestScroll(direction);
            if (!pref.smoothScrolling) {
                this.scroll_to(newScroll + direction * 2);
            } else {
                if (this.desiredScrollPosition === undefined) {
                    this.desiredScrollPosition = newScroll + direction * 2;
                } else {
                    this.desiredScrollPosition += (direction * 2);
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

        for (let part in this.sb_parts) {
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

    this.lbtn_dn = (p_x, p_y) => {
        if (!this.trace(p_x, p_y) || this.row_count <= this.rows_drawn) {
            return;
        }

        this.parts_lbtn_down();

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
    }

    this.shift_line = function (direction) {
        var newScroll = this.nearestScroll(direction);
        this.smooth_scroll_to(newScroll);
    };

    this.shift_page = function (direction) {
        var newScroll = this.nearestScroll(direction);
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
                    var new_thumb_y = this.btn_h + (this.scroll + shift_amount) * this.scrollbar_travel / this.scrollable_lines;

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

    this.stop_shift_timer = function () {
        if (timer_shift != null) {
            clearInterval(timer_shift);
            timer_shift = undefined;
        }
        timer_stop_y = -1;
    };

    this.nearestScroll = function (direction) {
        const scrollShift = this.scroll - Math.floor(this.scroll);
        var drawnShift = 1 - (this.rows_drawn - Math.floor(this.rows_drawn));
        var newScroll = 0;

        if (direction < 0 && scrollShift !== 0) {
            newScroll = Math.floor(this.scroll);
        } else if (direction > 0 && Math.abs(drawnShift - scrollShift) > 0.0001) {
            if (drawnShift > scrollShift) {
                newScroll = Math.floor(this.scroll) + drawnShift;
            }
            else {
                newScroll = Math.ceil(this.scroll) + drawnShift;
            }
        } else {
            newScroll = this.scroll + direction;
        }

        // console.log('current:', this.scroll, 'new:', newScroll, 'dir:', direction, Math.round(this.desiredScrollPosition));
        return newScroll;
    };

    // TODO: remove after compatibility fixes
    // this.check_scroll = function (new_scroll, set_scroll_only) {
    //     this.scroll_to(new_scroll, set_scroll_only);
    // };

    /**
     * @param {number} x represents the absolute progress of the animation in the bounds of 0 (beginning of the animation) and 1 (end of animation).
     * @returns {number}
     */
    const easeOut = (x) => {
        return 1 - Math.pow(1 - x, 3);  // easeOutCubic
    }

    let smoothScrollTimer = null;

    this.stopScrolling = () => {
        clearInterval(smoothScrollTimer);
        smoothScrollTimer = null;
    }

    /**
     * Scrolls to desired row over 400ms. Can be called repeatedly (during wheel or holding down arrows)
     * to update desired position.
     * @param {number} newPosition row position to scroll to
     * @returns
     */
    this.smooth_scroll_to = (newPosition) => {
        if (!pref.smoothScrolling) {
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
            animationProgress += 8; // slow things down slightly from 10
            let newVal = start + easeOut(animationProgress/100) * (end - start);
            if ((Math.abs(newPosition - newVal) < 0.1) ||
                (direction === 1 && newVal > newPosition) ||
                (direction === -1 && newVal < newPosition)) {
                newVal = newPosition;
                animationProgress = 100;    // clear interval
            } else if (newPosition <= 0) { // Fix crash for auto-hide scrollbar when removing almost everything in playlist and some tracks in top remain
                animationProgress = 100;
            }
            newVal = Math.round(newVal * 100)/100;
            // console.log(`${start} + easeOut(${animationProgress}/100) * (${end} - ${start}) = `, newVal)
            this.scroll_to(newVal, false);
            if (animationProgress >= 100) {
                this.desiredScrollPosition = undefined;
                this.stopScrolling();
            }
        }
        smoothScrollTimer = setInterval(() => {
            scrollFunc();
        }, 40);
        scrollFunc();   // want to immediately start scroll
    }

    this.scroll_to = (new_position, scroll_wo_redraw = false) => {
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

    this.set_x = (x) => {
        this.x = x;
        for (let part in this.sb_parts) {
            this.sb_parts[part].x = x;
        }
    };

    // private:
    var throttled_scroll_to = _.throttle(() => {
        this.smooth_scroll_to((throttled_scroll_y - this.btn_h) / this.drag_distance_per_row);
    }, 1000 / 60);

    function create_scrollbar_images() {
        if (scrollbar_images.length > 0) {
            return;
        }

        var fontSegoeUi = g_pl_fonts.scrollbar;

        var ico_back_colors =
        [
            g_pl_colors.background,
            g_pl_colors.background,
            g_pl_colors.background,
            g_pl_colors.background
        ];

        var ico_fore_colors =
        [
            pref.whiteTheme ? RGB(120, 120, 120) :
            pref.blackTheme ? RGB(100, 100, 100) :
            pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.lightAccent : RGB(120, 120, 120) :
            pref.blueTheme ? RGB(220, 220, 220) :
            pref.darkblueTheme ? RGB(220, 220, 220) :
            pref.redTheme ? RGB(220, 220, 220) :
            pref.creamTheme ? RGB(120, 170, 130) :
            pref.nblueTheme ? RGB(0, 200, 255) :
            pref.ngreenTheme ? RGB(0, 200, 0) :
            pref.nredTheme ? RGB(229, 7, 44) :
            pref.ngoldTheme ? RGB(254, 204, 3) : '',

            pref.whiteTheme ? RGB(0, 0, 0) :
            pref.blackTheme ? RGB(160, 160, 160) :
            pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.lightAccent : RGB(0, 0, 0) :
            pref.blueTheme ? RGB(242, 230, 170) :
            pref.darkblueTheme ? RGB(255, 255, 255) :
            pref.redTheme ? RGB(255, 255, 255) :
            pref.creamTheme ? RGB(100, 100, 100) :
            pref.nblueTheme ? RGB(0, 238, 255) :
            pref.ngreenTheme ? RGB(0, 255, 0) :
            pref.nredTheme ? RGB(255, 0, 0) :
            pref.ngoldTheme ? RGB(255, 242, 3) : '',

            pref.whiteTheme ? RGB(0, 0, 0) :
            pref.blackTheme ? RGB(160, 160, 160) :
            pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.lightAccent : RGB(0, 0, 0) :
            pref.blueTheme ? RGB(242, 230, 170) :
            pref.darkblueTheme ? RGB(255, 255, 255) :
            pref.redTheme ? RGB(255, 255, 255) :
            pref.creamTheme ? RGB(100, 100, 100) :
            pref.nblueTheme ? RGB(0, 238, 255) :
            pref.ngreenTheme ? RGB(0, 255, 0) :
            pref.nredTheme ? RGB(255, 0, 0) :
            pref.ngoldTheme ? RGB(255, 242, 3) : '',

            pref.whiteTheme ? RGB(120, 120, 120) :
            pref.blackTheme ? RGB(100, 100, 100) :
            pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.lightAccent : RGB(120, 120, 120) :
            pref.blueTheme ? RGB(220, 220, 220) :
            pref.darkblueTheme ? RGB(220, 220, 220) :
            pref.redTheme ? RGB(220, 220, 220) :
            pref.creamTheme ? RGB(120, 170, 130) :
            pref.nblueTheme ? RGB(0, 200, 255) :
            pref.ngreenTheme ? RGB(0, 200, 0) :
            pref.nredTheme ? RGB(229, 7, 44) :
            pref.ngoldTheme ? RGB(254, 204, 3) : ''
        ];

        let bgColor = col.primary;
        if (g_pl_colors.background != RGB(255, 255, 255)) {
            if (pref.rebornTheme && (new Color(bgColor).brightness > 130)) {
                ico_fore_colors = [col.superDarkAccent, col.maxDarkAccent, col.maxDarkAccent, col.superDarkAccent];
            }
            else if (pref.rebornTheme && (new Color(bgColor).brightness < 131)) {
                ico_fore_colors = [col.superLightAccent, col.maxLightAccent, col.maxLightAccent, col.superLightAccent];
            }
        }

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

        for (let i in btn) {
            const item = btn[i];
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

                var btn_format = g_string_format.h_align_center | g_string_format.v_align_far;
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

        var thumb_colors =
            [
                pref.whiteTheme ? RGB(200, 200, 200) :
                pref.blackTheme ? RGB(100, 100, 100) :
                pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.lightAccent : RGB(200, 200, 200) :
                pref.blueTheme ? RGB(10, 135, 225) :
                pref.darkblueTheme ? RGB(27, 55, 90) :
                pref.redTheme ? RGB(145, 25, 25) :
                pref.creamTheme ? RGB(200, 200, 200) :
                pref.nblueTheme ? RGB(0, 200, 255) :
                pref.ngreenTheme ? RGB(0, 200, 0) :
                pref.nredTheme ? RGB(229, 7, 44) :
                pref.ngoldTheme ? RGB(254, 204, 3) : '',

                pref.whiteTheme ? RGB(120, 120, 120) :
                pref.blackTheme ? RGB(160, 160, 160) :
                pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.lightAccent : RGB(120, 120, 120) :
                pref.blueTheme ? RGB(242, 230, 170) :
                pref.darkblueTheme ? RGB(255, 202, 128) :
                pref.redTheme ? RGB(245, 212, 165) :
                pref.creamTheme ? RGB(120, 170, 130) :
                pref.nblueTheme ? RGB(0, 238, 255) :
                pref.ngreenTheme ? RGB(0, 255, 0) :
                pref.nredTheme ? RGB(255, 0, 0) :
                pref.ngoldTheme ? RGB(255, 242, 3) : '',

                pref.whiteTheme ? RGB(120, 120, 120) :
                pref.blackTheme ? RGB(160, 160, 160) :
                pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.lightAccent : RGB(120, 120, 120) :
                pref.blueTheme ? RGB(242, 230, 170) :
                pref.darkblueTheme ? RGB(255, 202, 128) :
                pref.redTheme ? RGB(245, 212, 165) :
                pref.creamTheme ? RGB(120, 170, 130) :
                pref.nblueTheme ? RGB(0, 238, 255) :
                pref.ngreenTheme ? RGB(0, 255, 0) :
                pref.nredTheme ? RGB(255, 0, 0) :
                pref.ngoldTheme ? RGB(255, 242, 3) : '',
            ];

        let bgColor = col.primary;
        if (g_pl_colors.background != RGB(255, 255, 255)) {
            if (pref.rebornTheme && (new Color(bgColor).brightness > 130)) {
                thumb_colors = [col.accent, col.extraLightAccent, col.extraLightAccent];
            }
            else if (pref.rebornTheme && (new Color(bgColor).brightness < 131)) {
                thumb_colors = [col.lightMiddleAccent, col.extraLightAccent, col.extraLightAccent];
            }
        }

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

    this.sb_parts = {};

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

    var scrollbar_images = {};

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
                alpha_timer_internal = setInterval(() => {
                    for (let part in that.sb_parts) {
                        const item = that.sb_parts[part];
                        switch (item.state) {
                            case 'normal':
                                item.hover_alpha = Math.max(0, item.hover_alpha -= hoverOutStep);
                                item.hot_alpha = Math.max(0, item.hot_alpha -= hoverOutStep);
                                if (part === 'thumb') {
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
                    }

                    that.repaint();

                    var alpha_in_progress = Object.values(that.sb_parts).some((item) => {
                        return (item.hover_alpha > 0 && item.hover_alpha < 255)
                            || (item.pressed_alpha > 0 && item.pressed_alpha < 255)
                            || (item.hot_alpha > 0 && item.hot_alpha < 255);
                    });

                    if (!alpha_in_progress) {
                        this.stop();
                    }
                }, 25);
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

    this.cs = (s) => {
        this.state = s;
        this.repaint();
    };

    this.assign_imgs = function (imgs) {
        this.img_normal = this.img_hover = this.img_hover = this.img_hover = null;

        if (imgs === undefined) {
            return;
        }

        this.img_normal = /*_.isString(imgs.normal) ? _.img(imgs.normal) :*/ imgs.normal;
        this.img_hover = imgs.hover ? /*(_.isString(imgs.hover) ? _.img(imgs.hover) :*/ imgs.hover/*)*/ : this.img_normal;
        this.img_pressed = imgs.pressed ? /*(_.isString(imgs.pressed) ? _.img(imgs.pressed) :*/ imgs.pressed/*)*/ : this.img_normal;
        this.img_hot = imgs.hot ? /*(_.isString(imgs.hot) ? _.img(imgs.hot) :*/ imgs.hot/*)*/ : this.img_normal;
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
