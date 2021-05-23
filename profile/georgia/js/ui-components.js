class PauseButton {
    constructor() {
        this.xCenter = 0;
        this.yCenter = 0;
        this.top = 0;
        this.left = 0;
    }

    /**
     * Set the coordinates of the center point of the pause button
     * @param {number} xCenter The x-coordinate of the center of the pause button
     * @param {number} yCenter The y-coordinate of the center of the pause button
     */
    setCoords(xCenter, yCenter) {
        this.xCenter = xCenter;
        this.yCenter = yCenter;
        this.top = Math.round(this.yCenter - geo.pause_size / 2);
        this.left = Math.round(this.xCenter - geo.pause_size / 2);
    };

    draw(gr) {
        var pauseBorderWidth = scaleForDisplay(2);
        var halfBorderWidth = Math.floor(pauseBorderWidth / 2);

        gr.FillRoundRect(this.left, this.top, geo.pause_size, geo.pause_size,
            0.1 * geo.pause_size, 0.1 * geo.pause_size, rgba(0, 0, 0, 150));
        gr.DrawRoundRect(this.left + halfBorderWidth, this.top + halfBorderWidth, geo.pause_size - pauseBorderWidth, geo.pause_size - pauseBorderWidth,
            0.1 * geo.pause_size, 0.1 * geo.pause_size, pauseBorderWidth, rgba(128, 128, 128, 60));
        gr.FillRoundRect(this.left + 0.26 * geo.pause_size, this.top + 0.25 * geo.pause_size,
            0.12 * geo.pause_size, 0.5 * geo.pause_size, 2, 2, rgba(255, 255, 255, 160));
        gr.FillRoundRect(this.left + 0.62 * geo.pause_size, this.top + 0.25 * geo.pause_size,
            0.12 * geo.pause_size, 0.5 * geo.pause_size, 2, 2, rgba(255, 255, 255, 160));
    };

    repaint() {
        window.RepaintRect(this.left - 1, this.top - 1, geo.pause_size + 2, geo.pause_size + 2);
    };

    mouseInThis(x, y) {
        // console.log(x, y, this.top, x >= this.left, y >= this.top, x < this.left + geo.pause_size + 1, y <= this.top + geo.pause_size + 1)
        return (x >= this.left && y >= this.top && x < this.left + geo.pause_size + 1 && y <= this.top + geo.pause_size + 1);
    };
}

class ProgressBar {
    /**
     * @param {number} ww window width
     * @param {number} wh window height
     */
    constructor(ww, wh) {
        if (pref.layout_mode === 'default_mode') {
            this.x = scaleForDisplay(40);
            this.w = ww - scaleForDisplay(80);
        } if (pref.layout_mode === 'playlist_mode') {
            this.x = scaleForDisplay(20);
            this.w = ww - scaleForDisplay(40);
        }
        this.y = 0;
        this.h = geo.prog_bar_h;
        this.progressLength = 0; // fixing jumpiness in progressBar
        this.progressMoved = false; // playback position changed, so reset progressLength
        this.drag = false;	// progress bar is being dragged
        this.progressAlphaCol = undefined;
        this.lastAccentCol = undefined;
    }

    repaint() {
        window.RepaintRect(this.x, this.y, this.w, this.h);
    }

    setY(y) {
        this.y = y;
    }

    /**
     * @param {GdiGraphics} gr
     */
    draw(gr) {
        if (pref.show_progress_bar) {
            gr.SetSmoothingMode(SmoothingMode.None); // disable smoothing
            gr.FillSolidRect(this.x, this.y, this.w, this.h, col.progress_bar);
            if (pref.blueTheme) {
                gr.DrawRect(this.x - 2, this.y - 2, this.w + 3, this.h + 3, 1, RGB(23, 111, 194));
            } else if (pref.darkblueTheme) {
                gr.DrawRect(this.x - 2, this.y - 2, this.w + 3, this.h + 3, 1, RGB(22, 37, 54));
            } else if (pref.redTheme) {
                gr.DrawRect(this.x - 2, this.y - 2, this.w + 3, this.h + 3, 1, RGB(92, 21, 21));
            } else if (pref.creamTheme) {
                gr.DrawRect(this.x - 2, this.y - 2, this.w + 3, this.h + 3, 1, RGB(230, 230, 230));
            }

            if (fb.PlaybackLength) {
                let progressStationary = false;
                let fillColor = col.primary;
                /* in some cases the progress bar would move backwards at the end of a song while buffering/streaming was occurring.
                    This created strange looking jitter so now the progress bar can only increase unless the user seeked in the track. */
                if (this.progressMoved || Math.floor(this.w * (fb.PlaybackTime / fb.PlaybackLength)) > this.progressLength) {
                    this.progressLength = Math.floor(this.w * (fb.PlaybackTime / fb.PlaybackLength));
                } else {
                    progressStationary = true;
                }
                this.progressMoved = false;

                if (colorDistance(col.primary, col.progress_bar) < 50) {
                    if (pref.blackTheme) {
                        fillColor = rgb(140, 140, 140);
                    } else {
                        fillColor = col.darkAccent;
                    }
                }

                if (pref.blueTheme) {
                    fillColor = rgb(242, 230, 170);
                    } else if (pref.darkblueTheme) {
                    fillColor = rgb(255, 202, 128);
                    } else if (pref.redTheme) {
                    fillColor = rgb(245, 212, 165);
                    } else if (pref.creamTheme) {
                    fillColor = rgb(120, 170, 130);
                    } else if (pref.nblueTheme) {
                    fillColor = rgb(0, 200, 255);
                    } else if (pref.ngreenTheme) {
                    fillColor = rgb(0, 200, 0);
                    } else if (pref.nredTheme) {
                    fillColor = rgb(229, 7, 44);
                    } else if (pref.ngoldTheme) {
                    fillColor = rgb(254, 204, 3);
                }

                gr.FillSolidRect(this.x, this.y, this.progressLength, this.h, fillColor);
                //gr.DrawRect(this.x, this.y, this.progressLength, this.h - 1, 1, col.darkAccent);
                if (progressStationary && fb.IsPlaying && !fb.IsPaused) {
                    if (col.accent !== this.lastAccentCol || this.progressAlphaCol === undefined) {
                        const c = new Color(col.accent);
                        this.progressAlphaCol = rgba(c.r, c.g, c.b, 128); // fake anti-aliased edge so things look a little smoother
                        this.lastAccentCol = col.accent;
                    }
                    gr.DrawLine(this.progressLength + this.x + 1, this.y, this.progressLength + this.x + 1, this.y + this.h - 1, 1, this.progressAlphaCol);
                }
            }
        }
    }

    on_size(windowWidth, windowHeight) {
        this.y = 0;
        this.h = geo.prog_bar_h;
        this.progressMoved = true;
        if (pref.layout_mode === 'default_mode') {
            this.x = windowWidth ? scaleForDisplay(40) : 0;
            this.w = windowWidth - scaleForDisplay(80);
        } if (pref.layout_mode === 'playlist_mode') {
            this.x = windowWidth ? scaleForDisplay(20) : 0;
            this.w = windowWidth - scaleForDisplay(40);
        }
    }

    on_mouse_lbtn_down(x, y) {
        this.drag = true;
    }

    on_mouse_lbtn_up(x, y) {
        this.drag = false;
        if (this.mouseInThis(x, y)) {
            this.setPlaybackTime(x);
        }
    }

    on_mouse_move(x, y) {
        if (this.drag) {
            this.setPlaybackTime(x);
        }
    }

    mouseInThis(x, y) {
        return (x >= this.x && y >= this.y && x < this.x + this.w && y <= this.y + this.h);
    }

    /** @private
     * @param {number} x
     */
    setPlaybackTime(x) {
        let v = (x - this.x) / this.w;
        v = (v < 0) ? 0 : (v < 1) ? v : 1;
        if (fb.PlaybackTime !== v * fb.PlaybackLength) {
            fb.PlaybackTime = v * fb.PlaybackLength;
        }
    }
}

class Timeline {
    constructor(height) {
        this.x = 0;
        this.y = 0;
        this.w = albumart_size.x;
        this.h = height;

        this.playCol = rgba(255, 255, 255, 75); // TODO: remove from theme.js

        /** @private */ this.firstPlayedPercent = 0.33;
        /** @private */ this.lastPlayedPercent = 0.66;
        /** @private */ this.playedTimesPercents = [];
        /** @private */ this.playedTimes = [];

        // recalc'd in setSize
        /** @private */ this.lineWidth = is_4k ? 3 : 2;
        /** @private */ this.extraLeftSpace = scaleForDisplay(3); // add a little space to the left so songs that were played a long time ago show more in the "added" stage
        /** @private */ this.drawWidth = Math.floor(this.w - this.extraLeftSpace - 1 - this.lineWidth / 2); // area that the timeline percents can be drawn in
        /** @private */ this.leeway = (1 / this.drawWidth) * (this.lineWidth + scaleForDisplay(2)) / 2; // percent of timeline that we use to determine if mouse is over a playline. Equals half line with + 1 or 2 pixels on either side

        this.tooltipText = '';
    }

    setColors(addedCol, playedCol, unplayedCol) {
        this.addedCol = addedCol;
        this.playedCol = playedCol;
        this.unplayedCol = unplayedCol;
    };

    setPlayTimes(firstPlayed, lastPlayed, playedTimeRatios, playedTimesValues) {
        this.firstPlayedPercent = firstPlayed;
        this.lastPlayedPercent = lastPlayed;
        this.playedTimesPercents = playedTimeRatios;
        this.playedTimes = playedTimesValues;
    };

    setSize(x, y, width) {
        if (this.x !== x || this.y !== y || this.w !== width) {
            this.x = x;
            this.y = y;
            this.w = width;

            // recalc these values
            this.lineWidth = is_4k ? 3 : 2;
            this.extraLeftSpace = scaleForDisplay(3); // add a little space to the left so songs that were played a long time ago show more in the "added" stage
            this.drawWidth = Math.floor(this.w - this.extraLeftSpace - 1 - this.lineWidth / 2);
            this.leeway = (1 / this.drawWidth) * (this.lineWidth + scaleForDisplay(2)) / 2;
        }
    };

    setHeight(height) {
        this.h = height;
    };

    draw(gr) {
        if (this.addedCol && this.playedCol && this.unplayedCol) {
            gr.SetSmoothingMode(SmoothingMode.None); // disable smoothing

            gr.FillSolidRect(0, this.y, this.drawWidth + this.extraLeftSpace + this.lineWidth, this.h, this.addedCol);
            if (this.firstPlayedPercent >= 0 && this.lastPlayedPercent >= 0) {
                const x1 = Math.floor(this.drawWidth * this.firstPlayedPercent) + this.extraLeftSpace;
                const x2 = Math.floor(this.drawWidth * this.lastPlayedPercent) + this.extraLeftSpace;
                gr.FillSolidRect(x1, this.y, this.drawWidth - x1 + this.extraLeftSpace, this.h, this.playedCol);
                gr.FillSolidRect(x2, this.y, this.drawWidth - x2 + this.extraLeftSpace + this.lineWidth, this.h, this.unplayedCol);
            }
            for (let i = 0; i < this.playedTimesPercents.length; i++) {
                const x = Math.floor(this.drawWidth * this.playedTimesPercents[i]) + this.extraLeftSpace;
                if (!isNaN(x) && x <= this.w) {
                    gr.DrawLine(x, this.y, x, this.y + this.h, this.lineWidth, this.playCol);
                } else {
                    // console.log('Played Times Error! ratio: ' + this.playedTimesPercents[i], 'x: ' + x);
                }
            }
            gr.SetSmoothingMode(SmoothingMode.AntiAlias);
        }
    };

    mouseInThis(x, y) {
        var inTimeline = (x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h);
        if (!inTimeline && this.tooltipText.length) {
            this.clearTooltip();
        }
        return inTimeline;
    };

    on_mouse_move(x, y, m) {
        if (pref.show_timeline_tooltips) {
            let tooltip = '';
            let percent = toFixed((x + this.x - this.extraLeftSpace) / this.drawWidth, 3);

            // TODO: is this really slow with hundreds of plays?
            for (var i = 0; i < this.playedTimesPercents.length; i++) {
                if (percent >= this.playedTimesPercents[i] - this.leeway && percent < this.playedTimesPercents[i] + this.leeway) {
                    var date = new Date(this.playedTimes[i]);
                    if (tooltip.length) {
                        tooltip += '\n';
                    }
                    tooltip += date.toLocaleString();
                }
                else if (percent < this.playedTimesPercents[i]) {
                    // the list is sorted so we can abort early
                    if (!tooltip.length) {
                        if (i === 0) {
                            const added = dateDiff($date('[%added%]'), this.playedTimes[0]);
                            tooltip = added ? `First played after ${added}` : '';
                        } else {
                            tooltip = 'No plays for ' + dateDiff(new Date(this.playedTimes[i - 1]).toISOString(), this.playedTimes[i]);
                        }
                    }
                    break;
                }
            }
            if (tooltip.length) {
                this.tooltipText = tooltip;
                tt.showImmediate(this.tooltipText);
            } else {
                this.clearTooltip();
            }
        }
    };

    clearTooltip() {
        this.tooltipText = '';
        tt.stop();
    };
}
