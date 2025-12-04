'use strict';

class BioCallbacks {
	constructor() {
		/** @type {string} */
		this.windowMetricsPathBio = grSet.customBiographyDir
			? $(`${grCfg.customBiographyDir}cache\\biography\\themed\\windowMetrics.json`, undefined, true)
			: `${fb.ProfilePath}cache\\biography\\themed\\windowMetrics.json`;
	}

	on_colours_changed() {
		bio.ui.getColours();
		bio.alb_scrollbar.setCol();
		bio.art_scrollbar.setCol();
		bio.img.createImages();
		bio.filmStrip.logScrollPos();
		bio.filmStrip.clearCache();
		bio.filmStrip.createBorder();
		bio.but.createImages('all');
		bio.but.refresh(true);
		bio.alb_scrollbar.resetAuto();
		bio.art_scrollbar.resetAuto();
		if (bio.ui.font.heading && bio.ui.font.heading.Size) bio.but.createStars();
		bio.img.clearCache();
		bio.img.getImages();
		if (bio.panel.id.lyricsSource) {
			bio.lyrics.transBot = {}
			bio.lyrics.transTop = {}
		}
		bio.txt.rev.cur = '';
		bio.txt.bio.cur = '';
		bio.txt.albCalc();
		bio.txt.artCalc();
		bio.txt.paint();
	}

	// TT & Regorxxx <- warn about errors downloading files
	on_download_file_done(path, success, error_text) {
		bioXHR.onDownloadFileDone(path, success, error_text);
	}
	// TT & Regorxxx ->

	on_font_changed() {
		bio.ui.getFont();
		bio.alb_scrollbar.reset();
		bio.art_scrollbar.reset();
		bio.alb_scrollbar.resetAuto();
		bio.art_scrollbar.resetAuto();
		bio.txt.on_size();
		bio.img.on_size();
		window.Repaint();
	}

	on_focus(is_focused) {
		bio.resize.focus = is_focused;
	}

	on_get_album_art_done(handle, art_id, image, image_path) {
		bio.img.on_get_album_art_done(handle, art_id, image, image_path);
	}

	// TT & Regorxxx <- Http Requests when utils.HTTPRequestAsync is available
	on_http_request_done(task_id, success, response_text, status, headers) {
		bioXHR.onHttpRequestDone(task_id, success, response_text, status, headers);
	}
	// TT & Regorxxx ->

	on_item_focus_change() {
		if (!bioSet.panelActive) return;
		if (fb.IsPlaying && !bio.panel.id.focus) return;
		bio.txt.notifyTags();
		if (bio.panel.id.lookUp) bio.panel.getList(true, true);
		else if (!bio.panel.updateNeeded()) return;
		if (bio.panel.block() && !$Bio.server) {
			bio.img.get = true;
			bio.txt.get = bio.panel.id.focus ? 2 : 1;
			bio.img.artistReset();
			bio.txt.albumReset();
			bio.txt.artistReset();
		} else {
			if (bio.panel.block() && $Bio.server) {
				bio.img.get = true;
				bio.txt.get = 1;
				bio.img.artistReset();
				bio.txt.albumReset();
				bio.txt.artistReset();
			} else {
				bio.img.get = false;
				bio.txt.get = 0;
			}
			if (!fb.IsPlaying && grSet.panelBrowseMode) {
				bio.panel.focusLoad();
				bio.panel.focusServer();
			}
		}
	}

	on_key_down(vkey) {
		switch (vkey) {
			case 0x10:
			case 0x11:
			case 0x12:
				window.Repaint();
				break;
			case 0x21:
				if (bio.panel.trace.text) {
					if (!bio.txt.lyricsDisplayed()) bio.txt.scrollbar_type().pageThrottle(1);
				} else if (bio.panel.trace.film) bio.filmStrip.scrollerType().pageThrottle(1);
				break;
			case 0x22:
				if (bio.panel.trace.text) {
					if (!bio.txt.lyricsDisplayed()) bio.txt.scrollbar_type().pageThrottle(-1);
				} else if (bio.panel.trace.film) bio.filmStrip.scrollerType().pageThrottle(-1);
				break;
			case 35:
				if (bio.panel.trace.text) {
					if (!bio.txt.lyricsDisplayed()) bio.txt.scrollbar_type().scrollToEnd();
				} else if (bio.panel.trace.film) bio.filmStrip.scrollerType().scrollToEnd();
				break;
			case 36:
				if (bio.panel.trace.text) {
					if (!bio.txt.lyricsDisplayed()) bio.txt.scrollbar_type().checkScroll(0, 'full');
				} else if (bio.panel.trace.film) bio.filmStrip.scrollerType().checkScroll(0, 'full');
				break;
			case 37:
			case 38:
				if (bio.panel.imgBoxTrace(bio.panel.m.x, bio.panel.m.y)) bio.img.wheel(1);
				else if (bio.panel.trace.film) bio.filmStrip.scrollerType().wheel(1);
				break;
			case 39:
			case 40:
				if (bio.panel.imgBoxTrace(bio.panel.m.x, bio.panel.m.y)) bio.img.wheel(-1);
				else if (bio.panel.trace.film) bio.filmStrip.scrollerType().wheel(-1);
				break;
		}
	}

	on_key_up(vkey) {
		if (vkey == 0x10 || vkey == 0x11 || vkey == 0x12) window.Repaint();
	}

	on_library_items_added() {
		if (!bioSet.panelActive) return;
		if (!bio.lib) return;
		bio.lib.update = true;
	}

	on_library_items_removed() {
		if (!bioSet.panelActive) return;
		if (!bio.lib) return;
		bio.lib.update = true;
	}

	on_library_items_changed() {
		if (!bioSet.panelActive) return;
		if (!bio.lib) return;
		bio.lib.update = true;
	}

	on_load_image_done(task_id, image, image_path) {
		bio.img.on_load_image_done(image, image_path);
		bio.filmStrip.on_load_image_done(image, image_path);
	}

	on_metadb_changed() {
		if (!bioSet.panelActive) return;
		if (bio.panel.isRadio(bio.panel.id.focus) || bio.panel.block() && !$Bio.server || !bio.panel.updateNeeded() || bio.txt.lyricsDisplayed()) return;
		bio.panel.getList(true, true);
		bio.panel.focusLoad();
		bio.panel.focusServer();
	}

	on_mouse_lbtn_dblclk(x, y) {
		if (!bioSet.panelActive) return;
		bio.but.lbtn_dn(x, y);
		if (!bio.txt.lyricsDisplayed()) bio.txt.scrollbar_type().lbtn_dblclk(x, y);
		if (!bioSet.dblClickToggle) return;
		if (bioSet.touchControl) {
			bio.panel.id.last_pressed_coord = { x, y };
		}
		if (!bio.panel.trace.film) bio.panel.click(x, y);
		else bio.filmStrip.lbtn_dblclk(x, y);
	}

	on_mouse_lbtn_down(x, y) {
		if (!bioSet.panelActive) return;
		if (bioSet.touchControl) {
			bio.panel.id.last_pressed_coord = { x, y };
		}
		if (bio.panel.trace.image && bio.vk.k('alt')) {
			const imgPth = bio.img.pth().imgPth;
			if (imgPth) $Bio.browser(`explorer /select,"${imgPth}"`, false)
		} else {
			bio.resize.lbtn_dn(x, y);
			bio.but.lbtn_dn(x, y);
			if (!bioSet.dblClickToggle && !bio.but.Dn && !bio.seeker.dn && !bio.panel.trace.film) {
				setTimeout(() => { // Differentiate between a lyrics drag scroll and a normal click
					if (!bio.lyrics.scrollDrag) bio.panel.click(x, y);
				}, 200);
			}
			if (!bio.txt.lyricsDisplayed()) bio.txt.scrollbar_type().lbtn_dn(x, y);
			else if (bio.panel.id.lyricsSource) bio.lyrics.on_mouse_lbtn_down(x, y);
			// bio.filmStrip.scrollerType().lbtn_dn(x, y); // Causes locked mouse follow on filmstrip click
			bio.seeker.lbtn_dn(x, y);
			bio.img.lbtn_dn(x);
		}
	}

	on_mouse_lbtn_up(x, y) {
		if (!bioSet.panelActive) { bio.panel.inactivate(); return; }
		bio.alb_scrollbar.lbtn_drag_up();
		bio.art_scrollbar.lbtn_drag_up();
		bio.art_scroller.lbtn_drag_up();
		bio.cov_scroller.lbtn_drag_up();
		if (!bio.txt.lyricsDisplayed()) bio.txt.scrollbar_type().lbtn_up();
		else if (bio.panel.id.lyricsSource) bio.lyrics.on_mouse_lbtn_up(x, y);
		bio.panel.clicked = false;
		bio.resize.lbtn_up();
		bio.but.lbtn_up(x, y);
		bio.filmStrip.lbtn_up(x, y);
		bio.img.lbtn_up();
		bio.seeker.lbtn_up();
	}

	on_mouse_leave() {
		if (!bioSet.panelActive) return;
		bio.panel.leave();
		bio.but.leave();
		bio.alb_scrollbar.leave();
		bio.art_scrollbar.leave();
		bio.art_scroller.leave();
		bio.cov_scroller.leave();
		bio.lyrics.on_mouse_leave();
		bio.txt.leave();
		bio.img.leave();
		bio.filmStrip.leave();
		bio.panel.m.y = -1;
	}

	on_mouse_mbtn_up(x, y, mask) {
		// UIWizard at default settings blocks on_mouse_mbtn_up, at least in windows; workaround configure UI Wizard: UI Wizard > Move style > Caption only & ensure pseudo-caption doesn't overlap buttons
		switch (true) {
			case mask == 0x0004:
				bio.panel.inactivate();
				break;
			case utils.IsKeyPressed(0x12):
				bio.filmStrip.mbtn_up('onOff');
				break;
			case bio.panel.trace.film && !bio.but.trace('lookUp', x, y):
				bio.filmStrip.mbtn_up('showCurrent');
				break;
			case bioSet.panelActive:
				bio.panel.mbtn_up(x, y);
				break;
		}
	}

	on_mouse_move(x, y) {
		if (!bioSet.panelActive) return;
		if (bio.panel.m.x == x && bio.panel.m.y == y) return;
		bio.panel.move(x, y);
		bio.but.move(x, y);
		if (!bio.txt.lyricsDisplayed()) bio.txt.scrollbar_type().move(x, y);
		else if (bio.panel.id.lyricsSource) bio.lyrics.on_mouse_move(x, y);
		bio.filmStrip.scrollerType().move(x, y);
		bio.resize.imgMove(x, y);
		bio.resize.move(x, y);
		bio.resize.filmMove(x, y);
		bio.seeker.move(x, y);
		bio.txt.move(x, y);
		bio.img.move(x, y);
		bio.filmStrip.move(x, y);
		bio.panel.m.x = x;
		bio.panel.m.y = y;
	}

	on_mouse_rbtn_up(x, y) {
		bio.men.rbtn_up(x, y);
		return true;
	}

	on_mouse_wheel(step) {
		if (!bioSet.panelActive) return;
		bio.txt.deactivateTooltip();
		switch (bio.panel.zoom()) {
			case false:
				switch (true) {
					case bio.but.trace('lookUp', bio.panel.m.x, bio.panel.m.y):
						bio.men.wheel(step, true);
						break;
					case bio.panel.trace.film:
						bio.filmStrip.scrollerType().wheel(step, false);
						break;
					case bio.panel.trace.text:
						if (!bio.txt.lyricsDisplayed()) bio.txt.scrollbar_type().wheel(step, false);
						else if (bio.panel.id.lyricsSource) bio.lyrics.on_mouse_wheel(step);
						break;
					default:
						bio.img.wheel(step);
						break;
				}
				break;
			case true:
				bio.ui.wheel(step);
				if (bio.vk.k('ctrl')) bio.but.wheel(step);
				if (bio.vk.k('shift')) {
					bio.img.wheel(step);
					if (bio.panel.id.lyricsSource) bio.lyrics.on_mouse_wheel(step);
					if (bio.but.trace('lookUp', bio.panel.m.x, bio.panel.m.y)) bio.men.wheel(step, true);
				}
				break;
		}
	}

	on_notify_data(name, info) {
		let clone;
		if (bio.ui.id.local && name.startsWith('opt_')) {
			clone = typeof info === 'string' ? String(info) : info;
			on_cui_notify(name, clone);
		}
		switch (name) {
			case 'bio_chkTrackRev':
				if (!$Bio.server && bioSet.showTrackRevOptions) {
					clone = JSON.parse(JSON.stringify(info));
					clone.inclTrackRev = true;
					window.NotifyOthers('bio_isTrackRev', clone);
				}
				break;
			case 'bio_isTrackRev':
				if ($Bio.server && info.inclTrackRev == true) {
					clone = JSON.parse(JSON.stringify(info));
					bio.server.getTrack(clone);
				}
				break;
			case 'bio_imgChange':
				bio.img.fresh();
				bio.men.fresh();
				break;
			case 'bio_checkImgArr':
				clone = JSON.parse(JSON.stringify(info));
				bio.img.checkArr(clone);
				break;
			case 'bio_checkNumServers':
				window.NotifyOthers('bio_serverName', bioSet.serverName);
				break;
			case 'bio_serverName':
				if (info != bioSet.serverName) bioSet.multiServer = true;
				break;
			case 'bio_customStyle':
				clone = String(info);
				bio.panel.on_notify(clone);
				break;
			case 'bio_forceUpdate':
				if ($Bio.server) {
					clone = JSON.parse(JSON.stringify(info));
					bio.server.download(1, clone[0], clone[1]);
				}
				break;
			case 'bio_getLookUpList':
				bio.panel.getList('', true);
				break;
			case 'bio_getRevImg':
				if ($Bio.server) {
					clone = JSON.parse(JSON.stringify(info));
					bio.server.getRevImg(clone[0], clone[1], clone[2], clone[3], false);
				}
				break;
			case 'bio_getImg':
				bio.img.grab(!!info);
				break;
			case 'bio_getText':
				bio.txt.grab();
				break;
			case 'bio_lookUpItem':
				if ($Bio.server) {
					clone = JSON.parse(JSON.stringify(info));
					bio.server.download(false, clone[0], clone[1], name);
				}
				break;
			case `bio_newCfg${bioSet.serverName}`:
				bioCfg.updateCfg($Bio.jsonParse(info, {}));
				break;
			case `bio_notServer${bioSet.serverName}`: {
				const recTimestamp = info;
				if (recTimestamp >= bio.panel.notifyTimestamp) {
					$Bio.server = false;
					bio.timer.clear(bio.timer.img);
					bio.timer.clear(bio.timer.zSearch);
				}
				break;
			}
			case 'bio_blacklist':
				bio.img.blackList.artist = '';
				bio.img.check();
				break;
			case `bio_scriptUnload${bioSet.serverName}`:
				$Bio.server = true;
				bio.panel.notifyTimestamp = Date.now();
				window.NotifyOthers(`bio_notServer${bioSet.serverName}`, bio.panel.notifyTimestamp);
				break;
			case 'bio_refresh':
				window.Reload();
				break;
			case 'bio_reload':
				if (bio.panel.stndItem()) window.Reload();
				else {
					bio.txt.artistFlush();
					bio.txt.albumFlush();
					bio.txt.grab();
					if (bioSet.text_only) bio.txt.paint();
				}
				break;
			case 'bio_followSelectedTrack':
				if (!bio.panel.id.lyricsSource && !bio.panel.id.nowplayingSource && bio.panel.id.focus !== info) { // if enabled, panel has to be in prefer nowplaying mode
					bio.panel.id.focus = bioSet.focus = info;
					bio.panel.changed();
					bio.txt.on_playback_new_track();
					bio.img.on_playback_new_track();
				}
				break;
			case 'bio_status':
				bioSet.panelActive = info;
				window.Reload();
				break;
			case 'bio_syncTags':
				if ($Bio.server) {
					bio.tag.force = true;
					bio.server.call(info);
				}
				break;
			case 'bio_webRequest':
				clone = String(info);
				bio.server.urlRequested[clone] = Date.now(); // if multiServer enabled, limit URL requests for same item to one
				break;
			case 'newThemeColours':
				if (!bioSet.themed) break;
				bioSet.theme = info.theme;
				bioSet.themeBgImage = info.themeBgImage;
				bioSet.themeColour = info.themeColour;
				this.on_colours_changed();
				break;
			case 'Sync col': {
				if (!bioSet.themed) break;
				const themeLight = bioSet.themeLight;
				if (themeLight != info.themeLight) {
					bioSet.themeLight = info.themeLight;
					this.on_colours_changed();
				}
				break;
			}
			case 'Sync image':
				if (!bioSet.themed) break;
				bioSync.img = { image: new GdiBitmap(info.image), id: info.id };
				if (!bio.panel.block()) {
					bioSync.image(bioSync.img.image, bioSync.img.id);
					bioSync.get = false;
				} else bioSync.get = true;
				break;
		}
	}

	on_paint(gr) {
		if (bio.ui.pss.checkOnSize) on_size();
		bio.ui.draw(gr);
		if (!bioSet.panelActive) {
			bio.panel.draw(gr);
			return;
		}
		bio.img.draw(gr);
		bio.seeker.draw(gr);
		bio.txt.draw(gr);
		if (bio.panel.id.lyricsSource) bio.lyrics.draw(gr);
		bio.filmStrip.draw(gr);
		bio.but.draw(gr);
		// if (!grm.ui.displayCustomThemeMenu) bio.resize.drawEd(gr); // Disabled resize overlay, not needed
		bio.ui.lines(gr);
	}

	on_playback_dynamic_info_track() {
		if (!bioSet.panelActive) return;
		bio.txt.rev.amFallback = true;
		bio.txt.rev.wikiFallback = true;
		if ($Bio.server) bio.server.downloadDynamic();
		bio.txt.reader.lyrics3Saved = false;
		bio.txt.reader.ESLyricSaved = false;
		bio.txt.reader.trackStartTime = fb.PlaybackTime;
		bio.txt.on_playback_new_track();
		bio.img.on_playback_new_track();
	}

	on_playback_new_track() {
		if (!bioSet.panelActive) return;
		if ($Bio.server) bio.server.call();
		if (bioSet.focus) return;
		bio.txt.rev.amFallback = true;
		bio.txt.rev.wikiFallback = true;
		bio.txt.reader.lyrics3Saved = false;
		bio.txt.reader.ESLyricSaved = false;
		bio.txt.reader.trackStartTime = 0;
		bio.txt.on_playback_new_track();
		bio.img.on_playback_new_track();
	}

	on_playback_pause(state) {
		if (bio.panel.id.lyricsSource) bio.lyrics.on_playback_pause(state);
	}

	on_playback_seek() {
		if (bio.panel.id.lyricsSource) bio.lyrics.seek();
		if (bio.panel.block()) return;
		const n = bioSet.artistView ? 'bio' : 'rev';
		if ((bio.txt[n].loaded.txt && bio.txt.reader[n].nowplaying || bioSet.sourceAll) && bio.txt.reader[n].perSec) {
			bio.txt.logScrollPos();
			bio.txt.getText();
			bio.txt.paint();
		}
	}

	on_playback_time() {
		if (bio.panel.block()) return;
		const n = bioSet.artistView ? 'bio' : 'rev';
		if ((bio.txt[n].loaded.txt && bio.txt.reader[n].nowplaying || bioSet.sourceAll) && bio.txt.reader[n].perSec) {
			bio.txt.logScrollPos();
			bio.txt.getText('', '', 'playbackTime');
			bio.txt.paint();
		}
	}

	on_playback_stop(reason) {
		if (!bioSet.panelActive) return;
		const n = bioSet.artistView ? 'bio' : 'rev';
		if (reason != 2 && bio.txt[n].loaded.txt && bio.txt.reader[n].lyrics) bio.txt.getText();
		if (bio.panel.id.lyricsSource) bio.lyrics.clear();
		if (reason == 2) return;
		this.on_item_focus_change();
	}

	on_playlist_items_added() {
		if (!bioSet.panelActive) return;
		this.on_item_focus_change();
	}

	on_playlist_items_removed() {
		if (!bioSet.panelActive) return;
		this.on_item_focus_change();
	}

	on_playlist_switch() {
		if (!bioSet.panelActive) return;
		this.on_item_focus_change();
	}

	on_playlists_changed() {
		if (!bioSet.panelActive) return;
		bio.men.playlists_changed();
	}

	on_script_unload() {
		if ($Bio.server) {
			window.NotifyOthers(`bio_scriptUnload${bioSet.serverName}`, 0);
			bio.timer.clear(bio.timer.img);
		}
		bioAllMusicReq.abortRequest();
		bio.but.on_script_unload();
		bio.txt.deactivateTooltip();
	}

	on_size(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.w = width;
		this.h = height;
		bio.ui.x = x;
		bio.ui.y = y;
		bio.ui.w = width;
		bio.ui.h = height;

		// * Set guard for fixed Biography margin sizes in case user changed them in Biography options
		bioSet.borT  = SCALE(30);
		bioSet.borL  = SCALE(grSet.layout === 'artwork' ? 30 : 40);
		bioSet.borR  = SCALE(grSet.layout === 'artwork' ? 30 : 40);
		bioSet.borB  = SCALE(30);
		bioSet.textT = bioSet.borT;
		bioSet.textL = bioSet.borL;
		bioSet.textR = bioSet.borR;
		bioSet.textB = bioSet.borB;
		bioSet.gap   = SCALE(15);

		bio.txt.repaint = false;
		bio.panel.w = width;
		bio.panel.h = height;
		if (!window.IsVisible && bio.ui.pss.installed) {
			bio.ui.pss.checkOnSize = true;
			return;
		}
		bio.ui.pss.checkOnSize = false;
		if (!bio.panel.w || !bio.panel.h) return;
		bio.txt.logScrollPos('bio');
		bio.txt.logScrollPos('rev');
		bio.ui.getFont();
		if (!bioSet.panelActive) return;
		bio.txt.deactivateTooltip();
		bio.panel.calcText = true;
		bio.txt.on_size();
		bio.img.on_size();
		bio.filmStrip.on_size();
		bio.txt.repaint = true;
		bio.img.art.displayedOtherPanel = null;

		if (!bioSet.themed) return;
		const windowMetrics = $Bio.jsonParse(this.windowMetricsPathBio, {}, 'file');
		windowMetrics[window.Name] = {
			w: bio.panel.w,
			h: bio.panel.h
		}
		$Bio.save(this.windowMetricsPathBio, JSON.stringify(windowMetrics, null, 3), true);
	}
}

bio.call = new BioCallbacks();
