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
                const maxAreaExtraWidth = 5;   // give a little bigger target area to select -0.00dB
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
        this.w = is_4k ? scaleForDisplay(106) : scaleForDisplay(104);
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
                p = 3;

            const fillWidth = this.volume_bar.fillSize('w');
            const lineThickness = scaleForDisplay(1);

            let fillColor = col.primary;
            //gr.FillSolidRect(x, y, w, h, col.bg);
            if (colorDistance(col.primary, col.progress_bar) < 105 && pref.darkMode) {
                fillColor = rgb(255,255,255);
            } else if (colorDistance(col.primary, col.bg) < 105) {
                fillColor = col.darkAccent;
            }
            //gr.FillSolidRect(x, y + h - fillWidth, w, fillWidth, fillColor);
            //gr.DrawRect(x, y, w, h - lineThickness, lineThickness, col.progress_bar);
			if (pref.whiteTheme) {
			gr.FillSolidRect(is_4k ? x - 3 : x - 2, y + p, is_4k ? w + 3 : w + 2, h, RGB(255, 255, 255));
			gr.FillSolidRect(x, y + 5, fillWidth - 2, h - 5, col.primary);
			gr.DrawRect(is_4k ? x - 3 : x - 2, y + 2, w + 3, h, 1, col.progress_bar);
			} else if (pref.blackTheme) {
			gr.FillSolidRect(is_4k ? x - 3 : x - 2, y + p, is_4k ? w + 3 : w + 2, h, RGB(35, 35, 35));
			gr.FillSolidRect(x, y + 5, fillWidth - 2, h - 5, col.primary);
			gr.DrawRect(is_4k ? x - 3 : x - 2, y + 2, w + 3, h, 1, col.progress_bar);
			} else if (pref.blueTheme) {
			gr.FillSolidRect(is_4k ? x - 3 : x - 2, y + p, is_4k ? w + 3 : w + 2, h, RGB(10, 130, 220));
			gr.FillSolidRect(x, y + 5, fillWidth - 2, h - 5, RGB(242, 230, 170));
			gr.DrawRect(is_4k ? x - 3 : x - 2, y + 2, w + 3, h, 1, RGB(22, 107, 186));
			} else if (pref.darkblueTheme) {
			gr.FillSolidRect(is_4k ? x - 3 : x - 2, y + p, is_4k ? w + 3 : w + 2, h, RGB(27, 55, 90));
			gr.FillSolidRect(x, y + 5, fillWidth - 2, h - 5, RGB(255, 202, 128));
			gr.DrawRect(is_4k ? x - 3 : x - 2, y + 2, w + 3, h, 1, RGB(20, 33, 48));
			} else if (pref.redTheme) {
			gr.FillSolidRect(is_4k ? x - 3 : x - 2, y + p, is_4k ? w + 3 : w + 2, h, RGB(140, 25, 25));
			gr.FillSolidRect(x, y + 5, fillWidth - 2, h - 5, RGB(245, 212, 165));
			gr.DrawRect(is_4k ? x - 3 : x - 2, y + 2, w + 3, h, 1, RGB(82, 19, 19));
			} else if (pref.creamTheme) {
			gr.FillSolidRect(is_4k ? x - 3 : x - 2, y + p, is_4k ? w + 3 : w + 2, h, RGB(255, 255, 255));
			gr.FillSolidRect(x, y + 5, fillWidth - 2, h - 5, RGB(120, 170, 130));
			gr.DrawRect(is_4k ? x - 3 : x - 2, y + 2, w + 3, h, 1, RGB(220, 220, 220));
			} else if (pref.nblueTheme) {
			gr.FillSolidRect(is_4k ? x - 3 : x - 2, y + p, is_4k ? w + 3 : w + 2, h, RGB(30, 30, 30));
			gr.FillSolidRect(x, y + 5, fillWidth - 2, h - 5, RGB(0, 200, 255));
			gr.DrawRect(is_4k ? x - 3 : x - 2, y + 2, w + 3, h, 1, RGB(50, 50, 50));
			} else if (pref.ngreenTheme) {
			gr.FillSolidRect(is_4k ? x - 3 : x - 2, y + p, is_4k ? w + 3 : w + 2, h, RGB(30, 30, 30));
			gr.FillSolidRect(x, y + 5, fillWidth - 2, h - 5, RGB(0, 200, 0));
			gr.DrawRect(is_4k ? x - 3 : x - 2, y + 2, w + 3, h, 1, RGB(50, 50, 50));
			} else if (pref.nredTheme) {
			gr.FillSolidRect(is_4k ? x - 3 : x - 2, y + p, is_4k ? w + 3 : w + 2, h, RGB(30, 30, 30));
			gr.FillSolidRect(x, y + 5, fillWidth - 2, h - 5, RGB(229, 7, 44));
			gr.DrawRect(is_4k ? x - 3 : x - 2, y + 2, w + 3, h, 1, RGB(50, 50, 50));
			} else if (pref.ngoldTheme) {
			gr.FillSolidRect(is_4k ? x - 3 : x - 2, y + p, is_4k ? w + 3 : w + 2, h, RGB(30, 30, 30));
			gr.FillSolidRect(x, y + 5, fillWidth - 2, h - 5, RGB(254, 204, 3));
			gr.DrawRect(is_4k ? x - 3 : x - 2, y + 2, w + 3, h, 1, RGB(50, 50, 50));
			}

            const volume = fb.Volume.toFixed(2) + ' dB';
            const volFont = ft.SegoeUi;
            // const volMeasurements = gr.MeasureString(volume, volFont, 0, 0, 0, 0);
            // const volHeight = volMeasurements.Height;
            // const volWidth = volMeasurements.Width + 1;
            // const border = scaleForDisplay(3);
            let txtY = y;
            if (transport.displayBelowArtwork) {
                txtY = this.y - this.volTextH + scaleForDisplay(4);
            }
            /*
            if (pref.whiteTheme) {
            gr.DrawString(volume, volFont, rgb(140, 140, 140), x + (this.volume_bar.w / 2), txtY + h, this.volTextW, this.volTextH);
            } else if (pref.blackTheme) {
            gr.FillSolidRect(x - border, txtY + h, volWidth + border * 2, volHeight + border, rgba(0, 0, 0, 128));
            gr.DrawString(volume, volFont, rgb(0,0,0), x - 1, txtY - 1 + h, this.volTextW, this.volTextH);
            gr.DrawString(volume, volFont, rgb(0,0,0), x - 1, txtY + 1 + h, this.volTextW, this.volTextH);
            gr.DrawString(volume, volFont, rgb(0,0,0), x + 1, txtY - 1 + h, this.volTextW, this.volTextH);
            gr.DrawString(volume, volFont, rgb(0,0,0), x + 1, txtY + 1 + h, this.volTextW, this.volTextH);
            gr.DrawString(volume, volFont, rgb(255,255,255), x, txtY + h, this.volTextW, this.volTextH);
            }
            */
        }
    }

    repaint() {
        const xyPadding = scaleForDisplay(3), whPadding = xyPadding * 2;
        window.RepaintRect(this.x - xyPadding, this.volume_bar.y, this.volume_bar.w + whPadding, this.volume_bar.h + whPadding);

        let txtY = this.y + this.h;
        if (transport.displayBelowArtwork) {
            txtY = this.y - this.volTextH;
        }
        //window.RepaintRect(this.x - xyPadding, txtY, this.volTextW + xyPadding, this.volTextH + xyPadding);
    }

    setPosition(x, y, btnWidth) {
        const wh = window.Height;
        const center = Math.floor(this.w / 3);
        this.w = this.w;
        this.x = x + scaleForDisplay(40);
        if (transport.displayBelowArtwork) {
            this.y = y + center - this.h - scaleForDisplay(15);
        } else {
            this.y = y + center + scaleForDisplay(3);
        }
        this.volume_bar = new Volume(this.x, this.y, this.w, Math.min(wh - this.y - 4, this.h));
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
        if (this.volume_bar.drag) {
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