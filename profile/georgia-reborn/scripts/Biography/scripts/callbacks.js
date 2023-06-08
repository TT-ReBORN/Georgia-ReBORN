'use strict';

class BiographyCallbacks {
	mouse_in_this(x, y) {
		return (x >= uiBio.x && x < uiBio.x + uiBio.w && y >= uiBio.y && y < uiBio.y + uiBio.h);
	}

	on_colours_changed() {
		uiBio.getColours();
		alb_scrollbar.setCol();
		art_scrollbar.setCol();
		imgBio.createImages();
		filmStrip.logScrollPos();
		filmStrip.clearCache();
		filmStrip.createBorder();
		butBio.createImages('all');
		butBio.refresh(true);
		alb_scrollbar.resetAuto();
		art_scrollbar.resetAuto();
		if (uiBio.font.heading && uiBio.font.heading.Size) butBio.createStars();
		imgBio.clearCache();
		imgBio.getImages();
		if (panelBio.id.lyricsSource) {
			lyricsBio.transBot = {}
			lyricsBio.transTop = {}
		}
		txt.rev.cur = '';
		txt.bio.cur = '';
		txt.albCalc();
		txt.artCalc();
		txt.paint();
	}

	on_font_changed() {
		uiBio.getFont();
		alb_scrollbar.reset();
		art_scrollbar.reset();
		alb_scrollbar.resetAuto();
		art_scrollbar.resetAuto();
		txt.on_size();
		imgBio.on_size();
		window.Repaint();
	}

	on_focus(is_focused) {
		resize.focus = is_focused;
	}

	on_get_album_art_done(handle, art_id, image, image_path) {
		imgBio.on_get_album_art_done(handle, art_id, image, image_path);
	}

	on_item_focus_change() {
		if (!pptBio.panelActive) return;
		if (fb.IsPlaying && !panelBio.id.focus) return;
		txt.notifyTags();
		if (panelBio.id.lookUp) panelBio.getList(true, true);
		else if (!panelBio.updateNeeded()) return;
		if (panelBio.block() && !$Bio.server) {
			imgBio.get = true;
			txt.get = panelBio.id.focus ? 2 : 1;
			imgBio.artistReset();
			txt.albumReset();
			txt.artistReset();
		} else {
			if (panelBio.block() && $Bio.server) {
				imgBio.get = true;
				txt.get = 1;
				imgBio.artistReset();
				txt.albumReset();
				txt.artistReset();
			} else {
				imgBio.get = false;
				txt.get = 0;
			}
			panelBio.focusLoad();
			panelBio.focusServer();
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
				if (panelBio.trace.text) {
					if (!txt.lyricsDisplayed()) txt.scrollbar_type().pageThrottle(1);
				} else if (panelBio.trace.film) filmStrip.scrollerType().pageThrottle(1);
				break;
			case 0x22:
				if (panelBio.trace.text) {
					if (!txt.lyricsDisplayed()) txt.scrollbar_type().pageThrottle(-1);
				} else if (panelBio.trace.film) filmStrip.scrollerType().pageThrottle(-1);
				break;
			case 35:
				if (panelBio.trace.text) {
					if (!txt.lyricsDisplayed()) txt.scrollbar_type().scrollToEnd();
				} else if (panelBio.trace.film) filmStrip.scrollerType().scrollToEnd();
				break;
			case 36:
				if (panelBio.trace.text) {
					if (!txt.lyricsDisplayed()) txt.scrollbar_type().checkScroll(0, 'full');
				} else if (panelBio.trace.film) filmStrip.scrollerType().checkScroll(0, 'full');
				break;
			case 37:
			case 38:
				if (panelBio.imgBoxTrace(panelBio.m.x, panelBio.m.y)) imgBio.wheel(1);
				else if (panelBio.trace.film) filmStrip.scrollerType().wheel(1);
				break;
			case 39:
			case 40:
				if (panelBio.imgBoxTrace(panelBio.m.x, panelBio.m.y)) imgBio.wheel(-1);
				else if (panelBio.trace.film) filmStrip.scrollerType().wheel(-1);
				break;
		}
	}

	on_key_up(vkey) {
		if (vkey == 0x10 || vkey == 0x11 || vkey == 0x12) window.Repaint();
	}

	on_library_items_added() {
		if (!biographyInitialized || !pptBio.panelActive) return;
		if (!libBio) return;
		libBio.update = true;
	}

	on_library_items_removed() {
		if (!biographyInitialized || !pptBio.panelActive) return;
		if (!libBio) return;
		libBio.update = true;
	}

	on_library_items_changed() {
		if (!biographyInitialized || !pptBio.panelActive) return;
		if (!libBio) return;
		libBio.update = true;
	}

	on_load_image_done(task_id, image, image_path) {
		imgBio.on_load_image_done(image, image_path);
		filmStrip.on_load_image_done(image, image_path);
	}

	on_metadb_changed() {
		if (!pptBio.panelActive) return;
		if (panelBio.isRadio(panelBio.id.focus) || panelBio.block() && !$Bio.server || !panelBio.updateNeeded() || txt.lyricsDisplayed()) return;
		panelBio.getList(true, true);
		panelBio.focusLoad();
		panelBio.focusServer();
	}

	on_mouse_lbtn_dblclk(x, y) {
		if (!pptBio.panelActive) return;
		butBio.lbtn_dn(x, y);
		if (!txt.lyricsDisplayed()) txt.scrollbar_type().lbtn_dblclk(x, y);
		if (!pptBio.dblClickToggle) return;
		if (pptBio.touchControl) {
			panelBio.id.last_pressed_coord = {
				x,
				y
			};
		}
		if (!panelBio.trace.film) panelBio.click(x, y);
		else filmStrip.lbtn_dblclk(x, y);
	}

	on_mouse_lbtn_down(x, y) {
		if (!pptBio.panelActive) return;
		if (pptBio.touchControl) {
			panelBio.id.last_pressed_coord = {
				x,
				y
			};
		}
		if (panelBio.trace.image && vkBio.k('alt')) {
			const imgPth = imgBio.pth().imgPth;
			if (imgPth) $Bio.browser(`explorer /select,"${imgPth}"`, false)
		} else {
			resize.lbtn_dn(x, y);
			butBio.lbtn_dn(x, y);
			if (!txt.lyricsDisplayed()) txt.scrollbar_type().lbtn_dn(x, y);
			// filmStrip.scrollerType().lbtn_dn(x, y); // Causes locked mouse follow on filmstrip click
			seeker.lbtn_dn(x, y);
			imgBio.lbtn_dn(x);
		}
	}

	on_mouse_lbtn_up(x, y) {
		if (!pptBio.panelActive) { panelBio.inactivate(); return; }
		alb_scrollbar.lbtn_drag_up();
		art_scrollbar.lbtn_drag_up();
		art_scroller.lbtn_drag_up();
		cov_scroller.lbtn_drag_up();
		if (!pptBio.dblClickToggle && !butBio.Dn && !seeker.dn && !panelBio.trace.film) panelBio.click(x, y);
		if (!txt.lyricsDisplayed()) txt.scrollbar_type().lbtn_up();
		panelBio.clicked = false;
		resize.lbtn_up();
		butBio.lbtn_up(x, y);
		filmStrip.lbtn_up(x, y);
		imgBio.lbtn_up();
		seeker.lbtn_up();
	}

	on_mouse_leave() {
		if (!pptBio.panelActive) return;
		panelBio.leave();
		butBio.leave();
		alb_scrollbar.leave();
		art_scrollbar.leave();
		art_scroller.leave();
		cov_scroller.leave();
		txt.leave();
		imgBio.leave();
		filmStrip.leave();
		panelBio.m.y = -1;
	}

	on_mouse_mbtn_up(x, y, mask) {
		// UIHacks at default settings blocks on_mouse_mbtn_up, at least in windows; workaround configure hacks: main window > move with > caption only & ensure pseudo-caption doesn't overlap buttons
		switch (true) {
			case mask == 0x0004:
				panelBio.inactivate();
				break;
			case utils.IsKeyPressed(0x12):
				filmStrip.mbtn_up('onOff');
				break;
			case panelBio.trace.film && !butBio.trace('lookUp', x, y):
				filmStrip.mbtn_up('showCurrent');
				break;
			case pptBio.panelActive:
				panelBio.mbtn_up(x, y);
				break;
		}
	}

	on_mouse_move(x, y) {
		if (!pptBio.panelActive) return;
		if (panelBio.m.x == x && panelBio.m.y == y) return;
		panelBio.move(x, y);
		butBio.move(x, y);
		if (!txt.lyricsDisplayed()) txt.scrollbar_type().move(x, y);
		filmStrip.scrollerType().move(x, y);
		resize.imgMove(x, y);
		resize.move(x, y);
		resize.filmMove(x, y);
		seeker.move(x, y);
		txt.move(x, y);
		imgBio.move(x, y);
		filmStrip.move(x, y);
		panelBio.m.x = x;
		panelBio.m.y = y;
	}

	on_mouse_rbtn_up(x, y) {
		menBio.rbtn_up(x, y);
		return true;
	}

	on_mouse_wheel(step) {
		if (!pptBio.panelActive) return;
		txt.deactivateTooltip();
		switch (panelBio.zoom()) {
			case false:
				switch (true) {
					case butBio.trace('lookUp', panelBio.m.x, panelBio.m.y):
						menBio.wheel(step, true);
						break;
					case panelBio.trace.film:
						filmStrip.scrollerType().wheel(step, false);
						break;
					case panelBio.trace.text:
						if (!txt.lyricsDisplayed()) txt.scrollbar_type().wheel(step, false);
						else if (panelBio.id.lyricsSource) lyricsBio.on_mouse_wheel(step);
						break;
					default:
						imgBio.wheel(step);
						break;
				}
				break;
			case true:
				uiBio.wheel(step);
				if (vkBio.k('ctrl')) butBio.wheel(step);
				if (vkBio.k('shift')) {
					imgBio.wheel(step);
					if (butBio.trace('lookUp', panelBio.m.x, panelBio.m.y)) menBio.wheel(step, true);
				}
				break;
		}
	}

	on_notify_data(name, info) {
		let clone;
		if (uiBio.id.local && name.startsWith('opt_')) {
			clone = typeof info === 'string' ? String(info) : info;
			on_cui_notify(name, clone);
		}
		switch (name) {
			case 'bio_chkTrackRev':
				if (!$Bio.server && pptBio.showTrackRevOptions) {
					clone = JSON.parse(JSON.stringify(info));
					clone.inclTrackRev = true;
					window.NotifyOthers('bio_isTrackRev', clone);
				}
				break;
			case 'bio_isTrackRev':
				if ($Bio.server && info.inclTrackRev == true) {
					clone = JSON.parse(JSON.stringify(info));
					serverBio.getTrack(clone);
				}
				break;
			case 'bio_imgChange':
				imgBio.fresh();
				menBio.fresh();
				break;
			case 'bio_checkImgArr':
				clone = JSON.parse(JSON.stringify(info));
				imgBio.checkArr(clone);
				break;
			case 'bio_checkNumServers':
				window.NotifyOthers('bio_serverName', pptBio.serverName);
				break;
			case 'bio_serverName':
				if (info != pptBio.serverName) pptBio.multiServer = true;
				break;
			case 'bio_customStyle':
				clone = String(info);
				panelBio.on_notify(clone);
				break;
			case 'bio_forceUpdate':
				if ($Bio.server) {
					clone = JSON.parse(JSON.stringify(info));
					serverBio.download(1, clone[0], clone[1]);
				}
				break;
			case 'bio_getLookUpList':
				panelBio.getList('', true);
				break;
			case 'bio_getRevImg':
				if ($Bio.server) {
					clone = JSON.parse(JSON.stringify(info));
					serverBio.getRevImg(clone[0], clone[1], clone[2], clone[3], false);
				}
				break;
			case 'bio_getImg':
				imgBio.grab(!!info);
				break;
			case 'bio_getText':
				txt.grab();
				break;
			case 'bio_lookUpItem':
				if ($Bio.server) {
					clone = JSON.parse(JSON.stringify(info));
					serverBio.download(false, clone[0], clone[1], name);
				}
				break;
			case `bio_newCfg${pptBio.serverName}`:
				cfg.updateCfg($Bio.jsonParse(info, {}));
				break;
			case `bio_notServer${pptBio.serverName}`: {
				const recTimestamp = info;
				if (recTimestamp >= panelBio.notifyTimestamp) {
					$Bio.server = false;
					timerBio.clear(timerBio.img);
					timerBio.clear(timerBio.zSearch);
				}
				break;
			}
			case 'bio_blacklist':
				imgBio.blackList.artist = '';
				imgBio.check();
				break;
			case `bio_scriptUnload${pptBio.serverName}`:
				$Bio.server = true;
				panelBio.notifyTimestamp = Date.now();
				window.NotifyOthers(`bio_notServer${pptBio.serverName}`, panelBio.notifyTimestamp);
				break;
			case 'bio_refresh':
				window.Reload();
				break;
			case 'bio_reload':
				if (panelBio.stndItem()) window.Reload();
				else {
					txt.artistFlush();
					txt.albumFlush();
					txt.grab();
					if (pptBio.text_only) txt.paint();
				}
				break;
			case 'bio_followSelectedTrack':
				if (!panelBio.id.lyricsSource && !panelBio.id.nowplayingSource && panelBio.id.focus !== info) { // if enabled, panel has to be in prefer nowplaying mode
					panelBio.id.focus = pptBio.focus = info;
					panelBio.changed();
					txt.on_playback_new_track();
					imgBio.on_playback_new_track();
				}
				break;
			case 'bio_status':
				pptBio.panelActive = info;
				window.Reload();
				break;
			case 'bio_syncTags':
				if ($Bio.server) {
					tagBio.force = true;
					serverBio.call(info);
				}
				break;
			case 'bio_webRequest':
				clone = String(info);
				serverBio.urlRequested[clone] = Date.now(); // if multiServer enabled, limit URL requests for same item to one
				break;
			case 'newThemeColours':
				if (!pptBio.themed) break;
				pptBio.theme = info.theme;
				pptBio.themeBgImage = info.themeBgImage;
				pptBio.themeColour = info.themeColour;
				on_colours_changed();
				break;
			case 'Sync col': {
				if (!pptBio.themed) break;
				const themeLight = pptBio.themeLight;
				if (themeLight != info.themeLight) {
					pptBio.themeLight = info.themeLight;
					on_colours_changed();
				}
				break;
			}
			case 'Sync image':
				if (!pptBio.themed) break;
				syncBio.image(new GdiBitmap(info.image), info.id);
				break
		}
	}

	// on_paint(gr) {
	// 	if (uiBio.pss.checkOnSize) on_size();
	// 	uiBio.draw(gr);
	// 	if (!pptBio.panelActive) {
	// 		panelBio.draw(gr);
	// 		return;
	// 	}
	// 	imgBio.draw(gr);
	// 	seeker.draw(gr);
	// 	txt.draw(gr);
	// 	if (panelBio.id.lyricsSource) lyricsBio.draw(gr);
	// 	filmStrip.draw(gr);
	// 	butBio.draw(gr);
	// 	resize.drawEd(gr);
	// 	uiBio.lines(gr);
	// }

	on_playback_dynamic_info_track() {
		if (!pptBio.panelActive) return;
		txt.rev.amFallback = true;
		txt.rev.wikiFallback = true;
		if ($Bio.server) serverBio.downloadDynamic();
		txt.reader.lyrics3Saved = false;
		txt.reader.ESLyricSaved = false;
		txt.reader.trackStartTime = fb.PlaybackTime;
		txt.on_playback_new_track();
		imgBio.on_playback_new_track();
	}

	on_playback_new_track() {
		if (!pptBio.panelActive) return;
		if ($Bio.server) serverBio.call();
		if (pptBio.focus) return;
		txt.rev.amFallback = true;
		txt.rev.wikiFallback = true;
		txt.reader.lyrics3Saved = false;
		txt.reader.ESLyricSaved = false;
		txt.reader.trackStartTime = 0;
		txt.on_playback_new_track();
		imgBio.on_playback_new_track();
	}

	on_playback_pause(state) {
		if (panelBio.id.lyricsSource) lyricsBio.on_playback_pause(state);
	}

	on_playback_seek() {
		if (panelBio.id.lyricsSource) lyricsBio.seek();
		if (panelBio.block()) return;
		const n = pptBio.artistView ? 'bio' : 'rev';
		if ((txt[n].loaded.txt && txt.reader[n].nowplaying || pptBio.sourceAll) && txt.reader[n].perSec) {
			txt.logScrollPos();
			txt.getText();
			txt.paint();
		}
	}

	on_playback_time(t) {
		if (panelBio.block()) return;
		const n = pptBio.artistView ? 'bio' : 'rev';
		if ((txt[n].loaded.txt && txt.reader[n].nowplaying || pptBio.sourceAll) && txt.reader[n].perSec) {
			txt.logScrollPos();
			txt.getText();
			txt.paint();
		}
	}

	on_playback_stop(reason) {
		if (!pptBio.panelActive) return;
		const n = pptBio.artistView ? 'bio' : 'rev';
		if (reason != 2 && txt[n].loaded.txt && txt.reader[n].lyrics) txt.getText();
		if (panelBio.id.lyricsSource) lyricsBio.clear();
		if (reason == 2) return;
		on_item_focus_change();
	}

	on_playlist_items_added() {
		if (!pptBio.panelActive) return;
		on_item_focus_change();
	}

	on_playlist_items_removed() {
		if (!pptBio.panelActive) return;
		on_item_focus_change();
	}

	on_playlist_switch() {
		if (!pptBio.panelActive) return;
		on_item_focus_change();
	}

	on_playlists_changed() {
		if (!pptBio.panelActive) return;
		menBio.playlists_changed();
	}

	on_script_unload() {
		if ($Bio.server) {
			window.NotifyOthers(`bio_scriptUnload${pptBio.serverName}`, 0);
			timerBio.clear(timerBio.img);
		}
		butBio.on_script_unload();
		txt.deactivateTooltip();
	}

	on_size() {
		txt.repaint = false;
		panelBio.w = window.Width;
		panelBio.h = window.Height;
		if (!window.IsVisible && uiBio.pss.installed && !pptBio.themed) {
			uiBio.pss.checkOnSize = true;
			return;
		}
		uiBio.pss.checkOnSize = false;
		if (!panelBio.w || !panelBio.h) return;
		txt.logScrollPos('bio');
		txt.logScrollPos('rev');
		uiBio.getParams();

		if (!pptBio.panelActive) return;
		txt.deactivateTooltip();
		panelBio.calcText = true;
		txt.on_size();

		if (pptBio.themed && pptBio.theme) {
			const themed_image = pref.customLibraryDir ? `${globals.customLibraryDir}cache\\library\\themed\\themed_image.bmp` :  `${fb.ProfilePath}cache\\library\\themed\\themed_image.bmp`;
			if ($Bio.file(themed_image)) syncBio.image(gdi.Image(themed_image));
		}
		imgBio.on_size();
		filmStrip.on_size();
		txt.repaint = true;
		imgBio.art.displayedOtherPanel = null;

		if (!pptBio.themed) return;
		const windowMetrics = $Bio.jsonParse(windowMetricsPathBio, {}, 'file');
		windowMetrics[window.Name] = {
			w: panelBio.w,
			h: panelBio.h
		}
		$Bio.save(windowMetricsPathBio, JSON.stringify(windowMetrics, null, 3), true);
	}
}


class BiographyPanel {
	constructor() {
		this.x = -1; // not set
		this.y = -1; // not set
		this.w = -1; // not set
		this.h = -1; // not set
	}

	on_paint(gr) {
		if (uiBio.pss.checkOnSize) on_size();
		uiBio.draw(gr);
		if (!pptBio.panelActive) {
			panelBio.draw(gr);
			return;
		}
		imgBio.draw(gr);
		seeker.draw(gr);
		txt.draw(gr);
		if (panelBio.id.lyricsSource) lyricsBio.draw(gr);
		filmStrip.draw(gr);
		butBio.draw(gr);
		if (!displayCustomThemeMenu) resize.drawEd(gr);
		uiBio.lines(gr);
	}

	on_size(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.w = width;
		this.h = height;
		uiBio.x = x;
		uiBio.y = y;
		uiBio.w = width;
		uiBio.h = height;

		txt.repaint = false;
		panelBio.w = width;
		panelBio.h = height;
		if (!window.IsVisible && uiBio.pss.installed) {
			uiBio.pss.checkOnSize = true;
			return;
		}
		uiBio.pss.checkOnSize = false;
		if (!panelBio.w || !panelBio.h) return;
		txt.logScrollPos('bio');
		txt.logScrollPos('rev');
		uiBio.getFont();
		if (!pptBio.panelActive) return;
		txt.deactivateTooltip();
		panelBio.calcText = true;
		txt.on_size();
		imgBio.on_size();
		filmStrip.on_size();
		txt.repaint = true;
		imgBio.art.displayedOtherPanel = null;
	}
}

function initBiographyPanel() {
	if (biographyInitialized) return;
	uiBio = new UserInterfaceBio();
	vkBio = new VkeysBio();
	panelBio = new PanelBio();
	name = new Names();
	alb_scrollbar = new ScrollbarBio();
	art_scrollbar = new ScrollbarBio();
	art_scroller = new ScrollbarBio();
	cov_scroller = new ScrollbarBio();
	butBio = new ButtonsBio();
	popUpBoxBio = new PopUpBoxBio();
	txt = new Text();
	tagBio = new TaggerBio();
	resize = new ResizeHandler();
	libBio = new LibraryBio();
	imgBio = new ImagesBio();
	seeker = new Seeker();
	filmStrip = new FilmStrip();
	timerBio = new TimersBio();
	menBio = new MenuItemsBio();
	serverBio = new ServerBio();
	infoboxBio = new InfoboxBio();
	lyricsBio = new LyricsBio();
	biographyPanel = new BiographyPanel();
	biography = new BiographyCallbacks();
	biographyInitialized = true;
}


////////////////////////
// * INIT CALLBACKS * //
////////////////////////
/** @type {BiographyCallbacks} */
let biography = new BiographyCallbacks();
/** @type {BiographyPanel} */
let biographyPanel = new BiographyPanel();

this.on_colours_changed = () => biography.on_colours_changed();
this.on_font_changed = () => biography.on_font_changed();
this.on_focus = (is_focused) => biography.on_focus(is_focused);
this.on_get_album_art_done = (handle, art_id, image, image_path) => biography.on_get_album_art_done(handle, art_id, image, image_path);
this.on_item_focus_change = () => biography.on_item_focus_change();
this.on_key_down = (vkey) => biography.on_key_down(vkey);
this.on_key_up = (vkey) => biography.on_key_up(vkey);
this.on_library_items_added = () => biography.on_library_items_added();
this.on_library_items_removed = () => biography.on_library_items_removed();
this.on_library_items_changed = () => biography.on_library_items_changed();
this.on_load_image_done = (task_id, image, image_path) => biography.on_load_image_done(task_id, image, image_path);
this.on_metadb_changed = () => biography.on_metadb_changed();
this.on_mouse_lbtn_dblclk = (x, y) => biography.on_mouse_lbtn_dblclk(x, y);
this.on_mouse_lbtn_down = (x, y) => biography.on_mouse_lbtn_down(x, y);
this.on_mouse_lbtn_up = (x, y) => biography.on_mouse_lbtn_up(x, y);
this.on_mouse_leave = () => biography.on_mouse_leave();
this.on_mouse_mbtn_up = (x, y, mask) => biography.on_mouse_mbtn_up(x, y, mask);
this.on_mouse_move = (x, y) => biography.on_mouse_move(x, y);
this.on_mouse_rbtn_up = (x, y) => biography.on_mouse_rbtn_up(x, y);
this.on_mouse_wheel = (step) => biography.on_mouse_wheel(step);
this.on_notify_data = (name, info) => biography.on_notify_data(name, info);
this.on_playback_dynamic_info_track = () => biography.on_playback_dynamic_info_track();
this.on_playback_new_track = () => biography.on_playback_new_track();
this.on_playback_pause = (state) => biography.on_playback_pause(state);
this.on_playback_seek = () => biography.on_playback_seek();
this.on_playback_time = (t) => biography.on_playback_time(t);
this.on_playback_stop = (reason) => biography.on_playback_stop(reason);
this.on_playlist_items_added = () => biography.on_playlist_items_added();
this.on_playlist_items_removed = () => biography.on_playlist_items_removed();
this.on_playlist_switch = () => biography.on_playlist_switch();
this.on_playlists_changed = () => biography.on_playlists_changed();
this.on_script_unload = () => biography.on_script_unload();


//////////////////////////
// * CUSTOM CALLBACKS * //
//////////////////////////
function biographyLayoutFullPreset() {
	pptBio.style = pref.biographyLayoutFullPreset && pref.layout === 'default' && pref.biographyLayout === 'full' ? 3 : 0;
	pptBio.showFilmStrip = false;
	pptBio.filmStripPos = 3;
	setBiographySize();
	window.Repaint();
}

const windowMetricsPathBio = pref.customBiographyDir ? `${globals.customBiographyDir}cache\\biography\\themed\\windowMetrics.json` : `${fb.ProfilePath}cache\\biography\\themed\\windowMetrics.json`;
