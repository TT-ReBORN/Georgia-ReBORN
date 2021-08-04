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
        } if (pref.layout_mode === 'compact_mode') {
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
            // Callback for tooltip
            const ft_lower = ft.lower_bar;
            const textLeft = scaleForDisplay(40);
            const availableWidth = displayPlaylist || displayLibrary ? Math.min(ww / 2 - 20, btns.playlist.x - textLeft) : btns.playlist.x - textLeft;
            const artistFont = chooseFontForWidth(gr, availableWidth, str.artist, [ft.artist_lrg, ft.artist_med, ft.artist_sml]);
            this.artist_text_w = gr.MeasureString(str.artist, artistFont, 0, 0, 0, 0).Width;
            this.title_text_w = gr.MeasureString(pref.showComposer ? str.title_lower + str.composer : str.title_lower, ft_lower, 0, 0, 0, 0).Width;
        }
    }

    on_size(windowWidth, windowHeight) {
        this.y = 0;
        this.h = geo.prog_bar_h;
        this.progressMoved = true;
        if (pref.layout_mode === 'default_mode') {
            this.x = windowWidth ? scaleForDisplay(40) : 0;
            this.w = windowWidth - scaleForDisplay(80);
        } if (pref.layout_mode === 'compact_mode') {
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
        if (pref.show_tt || pref.show_truncatedText_tt) {
            this.lowerBar_truncatedText_tt(x, y);
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

    // Lowerbar truncated text tooltip
    lowerBar_truncatedText_tt(x, y) {
        if (pref.show_truncatedText_tt) {
            if (pref.layout_mode === 'default_mode') {
                const lowerBar_tt_hitarea_x = scaleForDisplay(20);
                const lowerBar_tt_hitarea_y = wh - geo.lower_bar_h - scaleForDisplay(20);
                const lowerBar_tt_hitarea_w = 0.35 * ww;
                const lowerBar_tt_hitarea_h = scaleForDisplay(40);

                if (lowerBar_tt_hitarea_x <= x && lowerBar_tt_hitarea_y <= y && lowerBar_tt_hitarea_x + lowerBar_tt_hitarea_w >= x && 
                    lowerBar_tt_hitarea_y + lowerBar_tt_hitarea_h >= y) {
                    if (this.artist_text_w > this.w * 0.32) {
                        tt.showDelayed(str.artist + "\n" + str.tracknum + str.title_lower + (pref.showComposer ? str.composer : ''));
                    }
                    else if (this.title_text_w > this.w * 0.37) {
                        tt.showDelayed(str.artist + "\n" + str.tracknum + str.title_lower + (pref.showComposer ? str.composer : ''));
                    }
                } else if (!displayLibrary) {
                    tt.stop();
                }
            } else if (pref.layout_mode === 'compact_mode') {
                const lowerBar_tt_hitarea_x = scaleForDisplay(20);
                const lowerBar_tt_hitarea_y = wh - geo.lower_bar_h - scaleForDisplay(15);
                const lowerBar_tt_hitarea_w = ww - btns.playbackTime.w - scaleForDisplay(42);
                const lowerBar_tt_hitarea_h = scaleForDisplay(20);

                if (lowerBar_tt_hitarea_x <= x && lowerBar_tt_hitarea_y <= y && lowerBar_tt_hitarea_x + lowerBar_tt_hitarea_w >= x && 
                    lowerBar_tt_hitarea_y + lowerBar_tt_hitarea_h >= y) {
                    if (this.artist_text_w > this.w * 0.32) {
                        tt.showDelayed(str.artist + "\n" + str.tracknum + str.title_lower + (pref.showComposer ? str.composer : ''));
                    }
                    else if (this.title_text_w > this.w * 0.37) {
                        tt.showDelayed(str.artist + "\n" + str.tracknum + str.title_lower + (pref.showComposer ? str.composer : ''));
                    }
                } else if (!displayLibrary) {
                    tt.stop();
                }
            }
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

class MetadataGrid_tt {
    constructor(height) {
        this.x = 0;
        this.y = 0;
        this.w = albumart_size.x;
        this.h = height;
        this.tooltipText = '';
    }

    setSize(x, y, width) {
        if (this.x !== x || this.y !== y || this.w !== width) {
            this.x = x;
            this.y = y;
            this.w = width;
        }
    };

    setHeight(height) {
        this.h = height;
    };

    draw(gr) {
        this.wh = window.Height;
        this.textLeft = scaleForDisplay(40);
        this.textRight = scaleForDisplay(20);
        this.line_spacing = scaleForDisplay(8);
        this.flag_spacing = scaleForDisplay(15);
        this.tracknum_spacing = scaleForDisplay(8);
        this.timeline_h = scaleForDisplay(60);
        this.flagSize = flagImgs.length === 3 ? scaleForDisplay(62) : flagImgs.length === 2 ? scaleForDisplay(48) : scaleForDisplay(24);

        if (!albumart && cdart) {
            this.gridSpace = Math.round(cdart_size.x - geo.aa_shadow - this.textLeft - this.textRight);
        } else {
            this.gridSpace = Math.round(albumart_size.x - geo.aa_shadow - this.textLeft - this.textRight);
        }

        if (pref.showArtistInGrid) {
            this.artistWidth = gr.MeasureString(str.artist, ft.artist, 0, 0, 0, 0).Width;
            this.artistHeight = gr.MeasureString(str.artist, ft.artist, 0, 0, 0, 0).Height;
            this.artistWidth_oneline = gr.MeasureString(str.artist, ft.artist, 0, 0, this.gridSpace, this.wh).Width;
            this.artistWidth_wrap = this.artistWidth - (this.artistWidth_oneline * 1.5);
            this.artist_txtRec = gr.MeasureString(str.artist, ft.artist, 0, 0, this.gridSpace, this.wh);
            this.artist_numLines = Math.min(2, this.artist_txtRec.Lines);
            this.artist_numLines_h = this.artist_numLines === 3 ? this.artistHeight * 3 : this.artist_numLines === 2 ? this.artistHeight * 2 : this.artistHeight;
        }
        if (pref.showTitleInGrid) {
            this.titleWidth = gr.MeasureString(str.title, ft.title, 0, 0, 0, 0).Width;
            this.titleHeight = gr.MeasureString(str.title, ft.title, 0, 0, 0, 0).Height;
            this.titleWidth_oneline = gr.MeasureString(str.title, ft.title, 0, 0, this.gridSpace, this.wh).Width;
            this.titleWidth_wrap = this.titleWidth - (this.titleWidth_oneline * 1.5);
            this.trackNumWidth = gr.MeasureString(str.tracknum, ft.tracknum, 0, 0, 0, 0).Width;
            this.title_txtRec = gr.MeasureString(str.title, ft.title, 0, 0, this.gridSpace, this.wh);
            this.title_numLines = Math.min(2, this.title_txtRec.Lines);
            this.title_numLines_h = this.title_numLines === 3 ? this.titleHeight * 3 : this.title_numLines === 2 ? this.titleHeight * 2 : this.titleHeight;
        }
            this.albumWidth = gr.MeasureString(str.album, ft.album_lrg, 0, 0, 0, 0).Width;
            this.albumHeight = gr.MeasureString(str.album, ft.album_lrg, 0, 0, 0, 0).Height;
            this.album_txtRec = gr.MeasureString(str.album, ft.album_lrg, 0, 0, this.gridSpace, this.wh);
            this.albumWidth_oneline = gr.MeasureString(str.album, ft.album_lrg, 0, 0, this.gridSpace, this.wh).Width;
            this.albumWidth_wrap = this.albumWidth - (this.albumWidth_oneline * 1.5);
            this.album_numLines = Math.min(2, this.album_txtRec.Lines);
            this.album_numLines_h = !pref.showArtistInGrid && !pref.showTitleInGrid ? this.albumHeight * 3 : this.album_numLines === 2 ? this.albumHeight * 2 : this.albumHeight;
    };

    mouseInThis(x, y) {
        // Artist tooltip hitarea
        if (pref.showArtistInGrid && this.artist_numLines === 1 && pref.showTitleInGrid && this.title_numLines === 1 ||
            pref.showArtistInGrid && this.artist_numLines === 1 && pref.showTitleInGrid && this.title_numLines === 2 ||
            pref.showArtistInGrid && this.artist_numLines === 2 && pref.showTitleInGrid && this.title_numLines === 1 ||
            pref.showArtistInGrid && this.artist_numLines === 2 && pref.showTitleInGrid && this.title_numLines === 2 ||
            pref.showArtistInGrid && this.artist_numLines === 1 && !pref.showTitleInGrid || 
            pref.showArtistInGrid && this.artist_numLines === 2 && !pref.showTitleInGrid) {
            this.top_artist = (albumart_size.y ? albumart_size.y : geo.top_art_spacing) + this.artistHeight + this.line_spacing;
        }
        // Title tooltip hitarea
        if (pref.showTitleInGrid && this.title_numLines === 1 && !pref.showArtistInGrid || 
            pref.showTitleInGrid && this.title_numLines === 2 && !pref.showArtistInGrid) {
            this.top_title = (albumart_size.y ? albumart_size.y : geo.top_art_spacing) + this.titleHeight + this.line_spacing;
        }
        if (pref.showTitleInGrid && this.title_numLines === 1 && pref.showArtistInGrid && this.artist_numLines === 1 ||
            pref.showTitleInGrid && this.title_numLines === 2 && pref.showArtistInGrid && this.artist_numLines === 1) {
            this.top_title = (albumart_size.y ? albumart_size.y : geo.top_art_spacing) + (this.titleHeight * 2) + (this.line_spacing * 2);
        }
        if (pref.showTitleInGrid && this.title_numLines === 1 && pref.showArtistInGrid && this.artist_numLines === 2 ||
            pref.showTitleInGrid && this.title_numLines === 2 && pref.showArtistInGrid && this.artist_numLines === 2) {
            this.top_title = (albumart_size.y ? albumart_size.y : geo.top_art_spacing) + (this.titleHeight * 2 ) + (this.line_spacing * 2) + this.artistHeight;
        }
        // Album tooltip hitarea
        if (!pref.showArtistInGrid && !pref.showTitleInGrid) {
            this.top_album = (albumart_size.y ? albumart_size.y : geo.top_art_spacing) + this.albumHeight + this.line_spacing;
        }
        if (pref.showArtistInGrid && this.artist_numLines === 1 && !pref.showTitleInGrid ||
            pref.showTitleInGrid  && this.title_numLines  === 1 && !pref.showArtistInGrid) {
            this.top_album = (albumart_size.y ? albumart_size.y : geo.top_art_spacing) +
            (this.artistHeight + this.timeline_h + this.albumHeight || this.titleHeight + this.timeline_h + this.albumHeight);
        }
        if (pref.showArtistInGrid && this.artist_numLines === 2 && !pref.showTitleInGrid ||
            pref.showTitleInGrid  && this.title_numLines  === 2 && !pref.showArtistInGrid) {
            this.top_album = (albumart_size.y ? albumart_size.y : geo.top_art_spacing) + 
            ((this.artistHeight * 2) + this.timeline_h + this.albumHeight || (this.titleHeight * 2) + this.timeline_h + this.albumHeight);
        }
        if (pref.showArtistInGrid && this.artist_numLines === 1 && pref.showTitleInGrid && this.title_numLines === 1) {
            this.top_album = (albumart_size.y ? albumart_size.y : geo.top_art_spacing)  +  this.artistHeight + this.titleHeight + this.timeline_h + this.albumHeight;
        }
        if (pref.showArtistInGrid && this.artist_numLines === 1 && pref.showTitleInGrid && this.title_numLines === 2 ||
            pref.showArtistInGrid && this.artist_numLines === 2 && pref.showTitleInGrid && this.title_numLines === 1) {
            this.top_album = (albumart_size.y ? albumart_size.y : geo.top_art_spacing)  + (this.artistHeight * 2 ) + this.titleHeight + this.timeline_h + this.albumHeight;
        }
        if (pref.showArtistInGrid && this.artist_numLines === 2 && pref.showTitleInGrid && this.title_numLines === 2) {
            this.top_album = (albumart_size.y ? albumart_size.y : geo.top_art_spacing)  + (this.artistHeight * 2 ) + (this.titleHeight * 2) + this.timeline_h + this.albumHeight;
        }

        this.inMetadataGrid_artist_tt = (x >= this.x && x < this.x + this.w && y >= this.top_artist && y < this.top_artist + this.artist_numLines_h);
        this.inMetadataGrid_title_tt  = (x >= this.x && x < this.x + this.w && y >= this.top_title  && y < this.top_title  + this.title_numLines_h);
        this.inMetadataGrid_album_tt  = (x >= this.x && x < this.x + this.w && y >= this.top_album  && y < this.top_album  + this.album_numLines_h);
        this.metadataGrid_tt_top      = this.inMetadataGrid_artist_tt + this.inMetadataGrid_title_tt + this.inMetadataGrid_album_tt;

        if (!this.metadataGrid_tt_top && this.tooltipText.length) {
            this.clearTooltip();
        }
        return this.metadataGrid_tt_top;
    };

    on_mouse_move(x, y, m) {
        if (pref.show_tt || pref.show_truncatedText_tt) {
            this.grid_truncatedText_tt(x, y);
        }
    };

    // Metadata Grid truncated text tooltip
    grid_truncatedText_tt(x, y) {
        if (pref.show_truncatedText_tt) {
            // Artist
            if (pref.showArtistInGrid && this.inMetadataGrid_artist_tt && this.artist_numLines === 1) {
                if (pref.show_flags && flagImgs.length) {
                    if (this.artistWidth + this.flag_spacing + this.flagSize > this.gridSpace) {
                        tt.showDelayed(str.artist);
                    }
                } else {
                    if (this.artistWidth > this.gridSpace) {
                        tt.showDelayed(str.artist);
                    }
                }
            }
            else if (pref.showArtistInGrid && this.inMetadataGrid_artist_tt && this.artist_numLines === 2) {
                if (pref.show_flags && flagImgs.length) {
                    if (this.artistWidth + this.flag_spacing + this.flagSize + this.artistWidth_wrap > this.gridSpace * 2) {
                        tt.showDelayed(str.artist);
                    }
                } else {
                    if (this.artistWidth + this.artistWidth_wrap > this.gridSpace * 2) {
                        tt.showDelayed(str.artist);
                    }
                }
            }
            // Title
            if (pref.showTitleInGrid && this.inMetadataGrid_title_tt && this.title_numLines === 1) {
                if (this.titleWidth + this.tracknum_spacing + this.trackNumWidth > this.gridSpace) {
                    tt.showDelayed(str.tracknum + '  ' + str.title + (pref.showComposer ? str.composer : ''));
                }
            }
            else if (pref.showTitleInGrid && this.inMetadataGrid_title_tt && this.title_numLines === 2) {
                if (this.titleWidth + this.tracknum_spacing + this.trackNumWidth + this.titleWidth_wrap > this.gridSpace * 2) {
                    tt.showDelayed(str.tracknum + '  ' + str.title + (pref.showComposer ? str.composer : ''));
                }
            }
            // Album
            if (this.inMetadataGrid_album_tt && this.album_numLines === 1) {
                if (this.albumWidth > this.gridSpace) {
                    tt.showDelayed(str.album + (pref.showComposer ? str.composer : ''));
                }
            }
            else if (this.inMetadataGrid_album_tt && (pref.showArtistInGrid || pref.showTitleInGrid) && this.album_numLines === 2) {
                if (this.albumWidth + this.albumWidth_wrap > this.gridSpace * 2) {
                    tt.showDelayed(str.album + (pref.showComposer ? str.composer : ''));
                }
            }
            else if (this.inMetadataGrid_album_tt && !pref.showArtistInGrid && !pref.showTitleInGrid && this.album_numLines === 2) {
                if (this.albumWidth > this.gridSpace * 3) {
                    tt.showDelayed(str.album + (pref.showComposer ? str.composer : ''));
                }
            }

        } else if (!displayLibrary) {
            tt.stop();
        }
    }
}