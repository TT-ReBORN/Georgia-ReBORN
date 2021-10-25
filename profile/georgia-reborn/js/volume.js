class Volume {
    constructor (x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.mx = 0;
        this.my = 0;
        this.clickX = 0;
        this.clickY = 0;
        this.drag = false;
        this.drag_vol = 0;
        this.tt = new TooltipHandler();
    }

    /**
     * Determines if a point is "inside" the bounds of the volume control.
     * @param {number} x
     * @param {number} y
     */
    trace(x, y) {
        // const margin = this.drag ? 200 : 0; // the area the mouse can go outside physical bounds of the volume control
        const margin = 5; // the area the mouse can go outside physical bounds of the volume control
        return x > this.x - margin &&
                x < this.x + this.w + margin &&
                y > this.y - margin &&
                y < this.y + this.h + margin;
    }

    /**
     * @param {number} scrollAmt
     */
    wheel(scrollAmt) {
        if (!this.trace(this.mx, this.my)) {
            return false;
        }

        scrollAmt > 0 ? fb.VolumeUp() : fb.VolumeDown();

        return true;
    }


    move(x, y) {
        this.mx = x;
        this.my = y;

        if (this.clickX && this.clickY && (this.clickX !== x || this.clickY !== y)) {
            this.drag = true;
        }

        if (this.trace(x, y) || this.drag) {
            if (this.drag) {
                x -= this.x;
                const maxAreaExtraWidth = 0;   // give a little bigger target area to select -0.00dB
                const pos = (x < maxAreaExtraWidth) ?
                        0 :
                        (x > this.w) ?
                        1 : (x - maxAreaExtraWidth) / (this.w - maxAreaExtraWidth);

                this.drag_vol = _.toDb(pos);
                fb.Volume = this.drag_vol;
            }

            return true;

        } else {
            this.drag = false;

            return false;
        }
    }

    lbtn_down(x, y) {
        if (this.trace(x, y)) {
            this.clickX = x;
            this.clickY = y;
            this.move(x, y);    // force volume to update without needing to move or release lbtn
            return true;
        } else {
            return false;
        }
    }

    lbtn_up(x, y) {
        this.clickX = 0;
        this.clickY = 0;
        if (this.drag) {
            this.drag = false;
            return true;
        }
        const inVolumeSlider = this.trace(x,y);
        if (inVolumeSlider) {
            // we had not started a drag
            this.drag = true;
            this.move(x,y); // adjust volume
            this.drag = false;
        }
        return inVolumeSlider;
    }

    leave() {
        this.drag = false;
    }

    /**
     * Returns the size in pixels of the fill portion of the volume bar, based on current volume
     * @param {string} type Either 'h' or 'w' for vertical or horizontal volume bars
     */
    fillSize(type) {
        return Math.ceil((type === "w" ? this.w : this.h) * (Math.pow(10, fb.Volume / 50) - 0.01) / 0.99);
    }
}

class VolumeBtn {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.w = transport.show_reload_artwork || transport.show_reload_compact ? scaleForDisplay(86) : scaleForDisplay(104);
        this.h = scaleForDisplay(12);

        this.inThisPadding = Math.min(this.w / 2);
        this.volTextW = scaleForDisplay(150);
        this.volTextH = scaleForDisplay(30);


        // Runtime state
        this.mouse_in_panel = false;
        this.show_volume_bar = false;

        // Objects
        /** @type {Volume} */
        this.volume_bar = undefined;
    }

    /**
     * @param {GdiGraphics} gr
     */
    on_paint(gr) {
        if (this.show_volume_bar) {
            const x = this.x,
                y = this.y,
                w = this.w,
                h = this.h,
                p = 2;

            const fillWidth = this.volume_bar.fillSize('w');
            let fillColor = col.primary;
            if (colorDistance(col.primary, col.progress_bar) < 105 && pref.blackTheme) {
                fillColor = rgb(140, 140, 140);
            } else if (colorDistance(col.primary, col.bg) < 105) {
                fillColor = col.accent;
            }
            gr.FillSolidRect(x - scaleForDisplay(2), y + (is_4k ? p + 1 : p), w + scaleForDisplay(2), h,
                pref.whiteTheme ? RGB(255, 255, 255) :
                pref.blackTheme ? RGB(35, 35, 35) :
                pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.extraLightAccent : RGB(255, 255, 255) :
                pref.blueTheme ? RGB(10, 130, 220) :
                pref.darkblueTheme ? RGB(27, 55, 90) :
                pref.redTheme ? RGB(140, 25, 25) :
                pref.creamTheme ? RGB(255, 255, 255) :
                pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(30, 30, 30) : ''
            );
            gr.FillSolidRect(x, y + (is_4k ? 7 : 4), fillWidth - scaleForDisplay(2), h - scaleForDisplay(4),
                pref.whiteTheme ? col.primary :
                pref.blackTheme ? fillColor :
                pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.accent : col.primary :
                pref.blueTheme ? RGB(242, 230, 170) :
                pref.darkblueTheme ? RGB(255, 202, 128) :
                pref.redTheme ? RGB(245, 212, 165) :
                pref.creamTheme ? RGB(120, 170, 130) :
                pref.nblueTheme ? RGB(0, 200, 255) :
                pref.ngreenTheme ? RGB(0, 200, 0) :
                pref.nredTheme ? RGB(229, 7, 44) :
                pref.ngoldTheme ? RGB(254, 204, 3) : ''
            );
            gr.DrawRect(x - (is_4k ? 5 : transport.show_reload_default || transport.show_reload_artwork || transport.show_reload_compact ? 3 : 2), y + scaleForDisplay(1), w + (is_4k ? 5 : 3), h + 1, 1,
                pref.whiteTheme ? RGB(220, 220, 220) :
                pref.blackTheme ? RGB(60, 60, 60) :
                pref.rebornTheme ? g_pl_colors.background != RGB(255, 255, 255) ? col.accent : RGB(220, 220, 220) :
                pref.blueTheme ? RGB(22, 107, 186) :
                pref.darkblueTheme ? RGB(20, 33, 48) :
                pref.redTheme ? RGB(82, 19, 19) :
                pref.creamTheme ? RGB(220, 220, 220) :
                pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGB(50, 50, 50) : ''
            );
        }
    }

    repaint() {
        const xyPadding = scaleForDisplay(3), whPadding = xyPadding * 2;
        window.RepaintRect(this.x - xyPadding, this.volume_bar.y, this.volume_bar.w + whPadding, this.volume_bar.h + whPadding);
    }

    setPosition(x, y, btnWidth) {
        const wh = window.Height;
        const buttonSize_default = scaleForDisplay(pref.transport_buttons_size_default);
        const buttonSize_artwork = scaleForDisplay(pref.transport_buttons_size_artwork);
        const buttonSize_compact = scaleForDisplay(pref.transport_buttons_size_compact);
        const center_default = Math.floor(buttonSize_default / 2 + scaleForDisplay(4));
        const center_artwork = Math.floor(buttonSize_artwork / 2 + scaleForDisplay(4));
        const center_compact = Math.floor(buttonSize_compact / 2 + scaleForDisplay(4));
        this.w = this.w;
        this.x = x + scaleForDisplay(40);
        this.y = y + (pref.layout_mode === 'artwork_mode' ? center_artwork : pref.layout_mode === 'compact_mode' ? center_compact : center_default) - this.h;
        this.volume_bar = new Volume(this.x, this.y, this.w, Math.min(wh - this.y, this.h));
    }

    on_mouse_move(x, y, m) {
        qwr_utils.DisableSizing(m);

        if (!this.volume_bar || this.volume_bar.drag) {
            this.volume_bar.move(x, y);
            return;
        }

        if (this.show_volume_bar && this.volume_bar.trace(x, y)) {
            this.mouse_in_panel = true;
        } else {
            this.mouse_in_panel = false;
        }

        if (this.show_volume_bar) {
            if (this.mouseInThis(x, y)) {
                this.volume_bar.move(x, y);
            } else {
                this.showVolumeBar(false);
                this.repaint();
            }
        }
    }

    mouseInThis(x, y) {
        const padding = this.inThisPadding;
        if (x > this.x - padding &&
            x <= this.x + this.w + padding &&
            y > this.y - this.w &&  // allow entire button height to be considered
            y <= this.y + this.h + padding) {
            return true;
        }
        return false;
    }

    on_mouse_lbtn_down(x, y, m) {
        if (this.show_volume_bar) {
            const val = this.volume_bar.lbtn_down(x, y);
            return val;
        }
        return false;
    }

    on_mouse_lbtn_up(x, y, m) {
        qwr_utils.EnableSizing(m);

        if (this.show_volume_bar) {
            return this.volume_bar.lbtn_up(x, y);
        }
    }

    on_mouse_wheel(delta) {
        if (this.mouse_in_panel) {
            if (!this.show_volume_bar || !this.volume_bar.wheel(delta)) {
                if (delta > 0) {
                    fb.VolumeUp();
                }
                else {
                    fb.VolumeDown();
                }
            }
            return true;
        }
        return false;
    }

    on_mouse_leave() {
        if (!this.volume_bar || this.volume_bar.drag) {
            return;
        }

        this.mouse_in_panel = false;

        if (this.show_volume_bar) {
            this.showVolumeBar(false);
            this.repaint();
        }
        this.volume_bar.leave();
    }

    on_volume_change(val) {
        if (this.show_volume_bar) {
            this.repaint();
        }
    }

    /**
     * Show the Volume Bar
     * @param {boolean} show
     */
    showVolumeBar(show) {
        this.show_volume_bar = show;
        this.repaint();
        if (show) {
            this.volume_bar.tt.stop();
        }
    }

    /**
     * Toggles volume bar on/off
     */
    toggleVolumeBar() {
        this.showVolumeBar(!this.show_volume_bar);
    }
}
