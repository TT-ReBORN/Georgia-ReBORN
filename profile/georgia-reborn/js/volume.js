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
        this.w = transport.show_reload_artwork && pref.layout_mode === 'artwork_mode' || transport.show_reload_compact && pref.layout_mode === 'compact_mode' ? scaleForDisplay(64) : scaleForDisplay(104);
        this.h = scaleForDisplay(12);

        this.inThisPadding = Math.min(this.w / 2);

        // Runtime state
        this.mouse_in_panel = false;
        this.show_volume_bar = pref.autoHideVolumeBar ? false : true;

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
            if (pref.themeStyleVolumeBarRounded) gr.SetSmoothingMode(SmoothingMode.AntiAlias); else gr.SetSmoothingMode(SmoothingMode.None);
            // Default background
            if (pref.themeStyleVolumeBarRounded && pref.themeStyleTransportButtons !== 'minimal') {
                gr.FillRoundRect(x - scaleForDisplay(2), y + (is_4k ? p + 1 : p), w + scaleForDisplay(2), h, scaleForDisplay(5), scaleForDisplay(5), col.volumeBar);
                gr.DrawRoundRect(x - (is_4k ? 5 : transport.show_reload_default || transport.show_reload_artwork || transport.show_reload_compact ? 3 : 2), y + scaleForDisplay(1), w + (is_4k ? 5 : 3), h + 2, scaleForDisplay(6), scaleForDisplay(6), 1, col.volumeBarFrame);
            }
            else if (!pref.themeStyleVolumeBarRounded && pref.themeStyleTransportButtons !== 'minimal') {
                gr.FillSolidRect(x - scaleForDisplay(2), y + (is_4k ? p + 1 : p), w + scaleForDisplay(2), h, col.volumeBar);
                gr.DrawRect(x - (is_4k ? 5 : transport.show_reload_default || transport.show_reload_artwork || transport.show_reload_compact ? 3 : 2), y + scaleForDisplay(1), w + (is_4k ? 5 : 3), h + 1, 1, col.volumeBarFrame);
            }
            // Theme style background
            if ((pref.themeStyleVolumeBar === 'bevel' || pref.themeStyleVolumeBar === 'inner') && pref.themeStyleTransportButtons !== 'minimal') {
                if (pref.themeStyleVolumeBarRounded) {
                    FillGradRoundRect(gr, x - scaleForDisplay(2), y + (is_4k ? p + 1 : p) - (pref.themeStyleVolumeBar === 'inner' ? 1 : 0), w + scaleForDisplay(5), h + scaleForDisplay(4), scaleForDisplay(6), scaleForDisplay(6),
                    pref.themeStyleVolumeBar === 'inner' ? -89 : 89, pref.themeStyleVolumeBar === 'inner' ? col.themeStyleVolumeBar : 0, pref.themeStyleVolumeBar === 'inner' ? 0 : col.themeStyleVolumeBar, pref.themeStyleVolumeBar === 'inner' ? 0 : 1);
                } else {
                    gr.FillGradRect(x - scaleForDisplay(2), y + (is_4k ? p + (pref.themeStyleVolumeBar === 'inner' ? 0 : 2) : p), w + scaleForDisplay(2), h, pref.themeStyleVolumeBar === 'inner' ? -90 : 90, 0, col.themeStyleVolumeBar);
                }
            }
            // Default fill
            if (pref.themeStyleVolumeBarRounded) {
                try { gr.FillRoundRect(x + 1, y + (is_4k ? 7 : 4), fillWidth - scaleForDisplay(3), h - scaleForDisplay(4), scaleForDisplay(3), scaleForDisplay(3), col.volumeBarFill); } catch(e) {};
            } else {
                gr.FillSolidRect(x, y + (is_4k ? 7 : 4), fillWidth - scaleForDisplay(2), h - scaleForDisplay(4), col.volumeBarFill);
            }
            // Theme style fill
            if (pref.themeStyleVolumeBarFill === 'bevel' || pref.themeStyleVolumeBarFill === 'inner') {
                try {
                    if (pref.themeStyleVolumeBarRounded) {
                        FillGradRoundRect(gr, x + 1, y + (is_4k ? 7 : 4), fillWidth - scaleForDisplay(0.5), h - scaleForDisplay(2), scaleForDisplay(3), scaleForDisplay(3), pref.themeStyleVolumeBarFill === 'inner' ? -89 : 89, 0, col.themeStyleVolumeBarFill, 1);
                    } else {
                        gr.FillGradRect(x, y + (is_4k ? 7 : 4), fillWidth - scaleForDisplay(2), h - scaleForDisplay(3), pref.themeStyleVolumeBarFill === 'inner' ? -90 : 90, pref.themeStyleBlackAndWhite ? col.themeStyleVolumeBarFill : 0, pref.themeStyleBlackAndWhite ? 0 : col.themeStyleVolumeBarFill);
                    }
                } catch(e) {};
            }
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
        this.x = x + (pref.layout_mode === 'artwork_mode' ? pref.transport_buttons_size_artwork * scaleForDisplay(1.25) : pref.layout_mode === 'compact_mode' ? pref.transport_buttons_size_compact * scaleForDisplay(1.25) : pref.transport_buttons_size_default * scaleForDisplay(1.25));
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
            } else if (pref.autoHideVolumeBar) {
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

        if (this.show_volume_bar && pref.autoHideVolumeBar) {
            this.showVolumeBar(false);
            this.repaint();
        }
        if (pref.autoHideVolumeBar) {
            this.volume_bar.leave();
        }
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
