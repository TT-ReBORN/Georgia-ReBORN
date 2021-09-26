function on_colours_changed() {
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
	txt.paint();
}

function on_font_changed() {
	uiBio.getFont();
	alb_scrollbar.reset();
	art_scrollbar.reset();
	alb_scrollbar.resetAuto();
	art_scrollbar.resetAuto();
	txt.on_size();
	imgBio.on_size();
	window.Repaint();
}

function on_focus(is_focused) {
	resize.focus = is_focused;
}

function on_get_album_art_done(handle, art_id, image, image_path) {
	imgBio.on_get_album_art_done(handle, art_id, image, image_path);
}

function on_item_focus_change() {
	if (!pptBio.panelActive) return;
	if (fb.IsPlaying && !pptBio.focus) return;
	txt.notifyTags();
	if (pptBio.lookUp) panelBio.getList(true);
	else if (!panelBio.updateNeeded()) return;
	if (panelBio.block() && !panelBio.serverBio) {
		imgBio.get = true;
		txt.get = pptBio.focus ? 2 : 1;
		imgBio.artistReset();
		txt.albumReset();
		txt.artistReset();
	} else {
		if (panelBio.block() && panelBio.serverBio) {
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

function on_key_down(vkey) {
	switch (vkey) {
		case 0x10:
		case 0x11:
		case 0x12:
			window.Repaint();
			break;
		case 0x21:
			if (panelBio.trace.text) txt.scrollbar_type().pageThrottle(1);
			else if (panelBio.trace.film) filmStrip.scrollerType().pageThrottle(1);
			break;
		case 0x22:
			if (panelBio.trace.text) txt.scrollbar_type().pageThrottle(-1);
			else if (panelBio.trace.film) filmStrip.scrollerType().pageThrottle(-1);
			break;
		case 35:
			if (panelBio.trace.text) txt.scrollbar_type().scrollToEnd();
			else if (panelBio.trace.film) filmStrip.scrollerType().scrollToEnd();
			break;
		case 36:
			if (panelBio.trace.text) txt.scrollbar_type().checkScroll(0, 'full');
			else if (panelBio.trace.film) filmStrip.scrollerType().checkScroll(0, 'full');
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

function on_key_up(vkey) {
	if (vkey == 0x10 || vkey == 0x11 || vkey == 0x12) window.Repaint();
}

function on_library_items_added() {
	if (!pptBio.panelActive) return;
	if (!lib) return;
	lib.update = true;
}

function on_library_items_removed() {
	if (!pptBio.panelActive) return;
	if (!lib) return;
	lib.update = true;
}

function on_library_items_changed() {
	if (!pptBio.panelActive) return;
	if (!lib) return;
	lib.update = true;
}

function on_load_image_done(task_id, image, image_path) {
	imgBio.on_load_image_done(image, image_path);
	filmStrip.on_load_image_done(image, image_path);
}

function on_metadb_changed() {
	if (!pptBio.panelActive) return;
	if (panelBio.isRadio(pptBio.focus) || panelBio.block() && !panelBio.serverBio || !panelBio.updateNeeded()) return;
	panelBio.getList(true);
	panelBio.focusLoad();
	panelBio.focusServer();
}

function on_mouse_lbtn_dblclk(x, y) {
	if (!pptBio.panelActive) return;
	butBio.lbtn_dn(x, y);
	txt.scrollbar_type().lbtn_dblclk(x, y);
	if (!pptBio.dblClickToggle) return;
	if (pptBio.touchControl) panelBio.id.last_pressed_coord = {
		x: x,
		y: y
	};
	if (!panelBio.trace.film) panelBio.click(x, y);
	else filmStrip.lbtn_dblclk(x, y);
}

function on_mouse_lbtn_down(x, y) {
	if (!pptBio.panelActive) return;
	if (pptBio.touchControl) panelBio.id.last_pressed_coord = {
		x: x,
		y: y
	};
	resize.lbtn_dn(x, y);
	butBio.lbtn_dn(x, y);
	txt.scrollbar_type().lbtn_dn(x, y);
	filmStrip.scrollerType().lbtn_dn(x, y);
	seeker.lbtn_dn(x, y);
	imgBio.lbtn_dn(x);
}

function on_mouse_lbtn_up(x, y) {
	if (!pptBio.panelActive) {panelBio.inactivate(); return;}
	alb_scrollbar.lbtn_drag_up();
	art_scrollbar.lbtn_drag_up();
	art_scroller.lbtn_drag_up();
	cov_scroller.lbtn_drag_up();
	if (!pptBio.dblClickToggle && !butBio.Dn && !seeker.dn && !panelBio.trace.film) panelBio.click(x, y);
	txt.scrollbar_type().lbtn_up();
	panelBio.clicked = false;
	resize.lbtn_up();
	butBio.lbtn_up(x, y);
	filmStrip.lbtn_up(x, y);
	imgBio.lbtn_up();
	seeker.lbtn_up();
}

function on_mouse_leave() {
	if (!pptBio.panelActive) return;
	panelBio.leave();
	butBio.leave();
	alb_scrollbar.leave();
	art_scrollbar.leave();
	art_scroller.leave();
	cov_scroller.leave();
	imgBio.leave();
	filmStrip.leave();
	panelBio.m.y = -1;
}

function on_mouse_mbtn_up(x, y, mask) {
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

function on_mouse_move(x, y) {
	if (!pptBio.panelActive) return;
	if (panelBio.m.x == x && panelBio.m.y == y) return;
	panelBio.move(x, y);
	butBio.move(x, y);
	txt.scrollbar_type().move(x, y);
	filmStrip.scrollerType().move(x, y);
	resize.imgMove(x, y);
	resize.move(x, y);
	resize.filmMove(x, y);
	seeker.move(x, y);
	imgBio.move(x, y);
	filmStrip.move(x, y);
	panelBio.m.x = x;
	panelBio.m.y = y;
}

function on_mouse_rbtn_up(x, y) {
	menBio.rbtn_up(x, y);
	return true;
}

function on_mouse_wheel(step) {
	if (!pptBio.panelActive) return;
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
					txt.scrollbar_type().wheel(step, false);
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

function on_notify_data(name, info) {
	let clone;
	if (uiBio.id.local) {
		clone = typeof info === 'string' ? String(info) : info;
		on_cui_notify(name, clone);
	}
	switch (name) {
		case 'bio_chkTrackRev':
			if (!panelBio.serverBio && panelBio.style.inclTrackRev) {
				clone = JSON.parse(JSON.stringify(info));
				clone.inclTrackRev = true;
				window.NotifyOthers('bio_isTrackRev', clone);
			}
			break;
		case 'bio_isTrackRev':
			if (panelBio.serverBio && info.inclTrackRev == true) {
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
		case 'bio_customStyle':
			clone = String(info);
			panelBio.on_notify(clone);
			break;
		case 'bio_forceUpdate':
			if (panelBio.serverBio) {
				clone = JSON.parse(JSON.stringify(info));
				serverBio.download(1, clone[0], clone[1]);
			}
			break;
		case 'bio_getLookUpList':
			panelBio.getList();
			break;
		case 'bio_getRevImg':
			if (panelBio.serverBio) {
				clone = JSON.parse(JSON.stringify(info));
				serverBio.getRevImg(clone[0], clone[1], clone[2], clone[3], false);
			}
			break;
		case 'bio_getImg':
			imgBio.grab(info ? true : false);
			break;
		case 'bio_getText':
			txt.grab();
			break;
		case 'bio_lookUpItem':
			if (panelBio.serverBio) {
				clone = JSON.parse(JSON.stringify(info));
				serverBio.download(false, clone[0], clone[1]);
			}
			break;
		case 'bio_newCfg':
			cfg.updateCfg($Bio.jsonParse(info, {}));
			break;
		case 'bio_notServer':
			panelBio.serverBio = false;
			timerBio.clear(timerBio.img);
			timerBio.clear(timerBio.zSearch);
			break;
		case 'bio_blacklist':
			imgBio.blackList.artist = '';
			imgBio.check();
			break;
		case 'bio_scriptUnload':
			panelBio.serverBio = true;
			window.NotifyOthers('bio_notServer', 0);
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
			if (pptBio.focus !== info) {
				pptBio.focus = info;
				panelBio.changed();
				txt.on_playback_new_track();
				imgBio.on_playback_new_track();
			}
			break;
		case 'bio_status':
			pptBio.panelActive = info;
			window.Reload();
			break;
	}
}

// function on_paint(gr) {
// 	uiBio.draw(gr);
// 	if (!pptBio.panelActive) {
// 		panelBio.draw(gr);
// 		return;
// 	}
// 	imgBio.draw(gr);
// 	seeker.draw(gr);
// 	filmStrip.draw(gr);
// 	txt.draw(gr);
// 	txt.drawMessage(gr);
// 	butBio.draw(gr);
// 	resize.drawEd(gr);
// 	uiBio.lines(gr);
// }

function on_playback_dynamic_info_track() {
	if (!pptBio.panelActive) return;
	if (panelBio.serverBio) serverBio.downloadDynamic();
	txt.on_playback_new_track();
	imgBio.on_playback_new_track();
}

function on_playback_new_track() {
	if (!pptBio.panelActive) return;
	if (panelBio.serverBio) serverBio.on_playback_new_track();
	if (pptBio.focus) return;
	txt.on_playback_new_track();
	imgBio.on_playback_new_track();
}

function on_playback_stop(reason) {
	if (!pptBio.panelActive) return;
	if (reason == 2) return;
	on_item_focus_change();
}

function on_playlist_items_added() {
	if (!pptBio.panelActive) return;
	on_item_focus_change();
}

function on_playlist_items_removed() {
	if (!pptBio.panelActive) return;
	on_item_focus_change();
}

function on_playlist_switch() {
	if (!pptBio.panelActive) return;
	on_item_focus_change();
}

function on_playlists_changed() {
	if (!pptBio.panelActive) return;
	menBio.playlists_changed();
}

function on_script_unload() {
	if (panelBio.serverBio) {
		window.NotifyOthers('bio_scriptUnload', 0);
		timerBio.clear(timerBio.img);
	}
	butBio.on_script_unload();
}

function on_size() {
	txt.repaint = false;
	panelBio.w = window.Width;
	panelBio.h = window.Height;
	if (!panelBio.w || !panelBio.h) return;
	uiBio.getFont();
	panelBio.getLogo();
	if (!pptBio.panelActive) return;
	panelBio.calcText = true;
	txt.on_size();
	imgBio.on_size();
	filmStrip.on_size();
	txt.repaint = true;
	imgBio.art.displayedOtherPanel = null;
}


class BiographyCallbacks {

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
		if (fb.IsPlaying && !pptBio.focus) return;
		txt.notifyTags();
		if (pptBio.lookUp) panelBio.getList(true);
		else if (!panelBio.updateNeeded()) return;
		if (panelBio.block() && !panelBio.serverBio) {
			imgBio.get = true;
			txt.get = pptBio.focus ? 2 : 1;
			imgBio.artistReset();
			txt.albumReset();
			txt.artistReset();
		} else {
			if (panelBio.block() && panelBio.serverBio) {
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
				if (panelBio.trace.text) txt.scrollbar_type().pageThrottle(1);
				else if (panelBio.trace.film) filmStrip.scrollerType().pageThrottle(1);
				break;
			case 0x22:
				if (panelBio.trace.text) txt.scrollbar_type().pageThrottle(-1);
				else if (panelBio.trace.film) filmStrip.scrollerType().pageThrottle(-1);
				break;
			case 35:
				if (panelBio.trace.text) txt.scrollbar_type().scrollToEnd();
				else if (panelBio.trace.film) filmStrip.scrollerType().scrollToEnd();
				break;
			case 36:
				if (panelBio.trace.text) txt.scrollbar_type().checkScroll(0, 'full');
				else if (panelBio.trace.film) filmStrip.scrollerType().checkScroll(0, 'full');
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
		if (!pptBio.panelActive) return;
		if (!lib) return;
		lib.update = true;
	}

	on_library_items_removed() {
		if (!pptBio.panelActive) return;
		if (!lib) return;
		lib.update = true;
	}

	on_library_items_changed() {
		if (!pptBio.panelActive) return;
		if (!lib) return;
		lib.update = true;
	}

	on_load_image_done(task_id, image, image_path) {
		imgBio.on_load_image_done(image, image_path);
		filmStrip.on_load_image_done(image, image_path);
	}

	on_metadb_changed() {
		if (!pptBio.panelActive) return;
		if (panelBio.isRadio(pptBio.focus) || panelBio.block() && !panelBio.serverBio || !panelBio.updateNeeded()) return;
		panelBio.getList(true);
		panelBio.focusLoad();
		panelBio.focusServer();
	}

	on_mouse_lbtn_dblclk(x, y) {
		if (!pptBio.panelActive) return;
		butBio.lbtn_dn(x, y);
		txt.scrollbar_type().lbtn_dblclk(x, y);
		if (!pptBio.dblClickToggle) return;
		if (pptBio.touchControl) panelBio.id.last_pressed_coord = {
			x: x,
			y: y
		};
		if (!panelBio.trace.film) panelBio.click(x, y);
		else filmStrip.lbtn_dblclk(x, y);
	}

	on_mouse_lbtn_down(x, y) {
		if (!pptBio.panelActive) return;
		if (pptBio.touchControl) panelBio.id.last_pressed_coord = {
			x: x,
			y: y
		};
		resize.lbtn_dn(x, y);
		butBio.lbtn_dn(x, y);
		txt.scrollbar_type().lbtn_dn(x, y);
		filmStrip.scrollerType().lbtn_dn(x, y);
		seeker.lbtn_dn(x, y);
		imgBio.lbtn_dn(x);
	}

	on_mouse_lbtn_up(x, y) {
		if (!pptBio.panelActive) {panelBio.inactivate(); return;}
		alb_scrollbar.lbtn_drag_up();
		art_scrollbar.lbtn_drag_up();
		art_scroller.lbtn_drag_up();
		cov_scroller.lbtn_drag_up();
		if (!pptBio.dblClickToggle && !butBio.Dn && !seeker.dn && !panelBio.trace.film) panelBio.click(x, y);
		txt.scrollbar_type().lbtn_up();
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
		imgBio.leave();
		filmStrip.leave();
		panelBio.m.y = -1;
	}

	on_mouse_mbtn_up(x, y, mask) {
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
		txt.scrollbar_type().move(x, y);
		filmStrip.scrollerType().move(x, y);
		resize.imgMove(x, y);
		resize.move(x, y);
		resize.filmMove(x, y);
		seeker.move(x, y);
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
						txt.scrollbar_type().wheel(step, false);
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
		if (uiBio.id.local) {
			clone = typeof info === 'string' ? String(info) : info;
			on_cui_notify(name, clone);
		}
		switch (name) {
			case 'bio_chkTrackRev':
				if (!panelBio.serverBio && panelBio.style.inclTrackRev) {
					clone = JSON.parse(JSON.stringify(info));
					clone.inclTrackRev = true;
					window.NotifyOthers('bio_isTrackRev', clone);
				}
				break;
			case 'bio_isTrackRev':
				if (panelBio.serverBio && info.inclTrackRev == true) {
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
			case 'bio_customStyle':
				clone = String(info);
				panelBio.on_notify(clone);
				break;
			case 'bio_forceUpdate':
				if (panelBio.serverBio) {
					clone = JSON.parse(JSON.stringify(info));
					serverBio.download(1, clone[0], clone[1]);
				}
				break;
			case 'bio_getLookUpList':
				panelBio.getList();
				break;
			case 'bio_getRevImg':
				if (panelBio.serverBio) {
					clone = JSON.parse(JSON.stringify(info));
					serverBio.getRevImg(clone[0], clone[1], clone[2], clone[3], false);
				}
				break;
			case 'bio_getImg':
				imgBio.grab(info ? true : false);
				break;
			case 'bio_getText':
				txt.grab();
				break;
			case 'bio_lookUpItem':
				if (panelBio.serverBio) {
					clone = JSON.parse(JSON.stringify(info));
					serverBio.download(false, clone[0], clone[1]);
				}
				break;
			case 'bio_newCfg':
				cfg.updateCfg($Bio.jsonParse(info, {}));
				break;
			case 'bio_notServer':
				panelBio.serverBio = false;
				timerBio.clear(timerBio.img);
				timerBio.clear(timerBio.zSearch);
				break;
			case 'bio_blacklist':
				imgBio.blackList.artist = '';
				imgBio.check();
				break;
			case 'bio_scriptUnload':
				panelBio.serverBio = true;
				window.NotifyOthers('bio_notServer', 0);
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
				if (pptBio.focus !== info) {
					pptBio.focus = info;
					panelBio.changed();
					txt.on_playback_new_track();
					imgBio.on_playback_new_track();
				}
				break;
			case 'bio_status':
				pptBio.panelActive = info;
				window.Reload();
				break;
		}
	}

	on_paint(gr) {
		uiBio.draw(gr);
		if (!pptBio.panelActive) {
			panelBio.draw(gr);
			return;
		}
		imgBio.draw(gr);
		seeker.draw(gr);
		filmStrip.draw(gr);
		txt.draw(gr);
		txt.drawMessage(gr);
		butBio.draw(gr);
		resize.drawEd(gr);
		uiBio.lines(gr);
	}

	on_playback_dynamic_info_track() {
		if (!pptBio.panelActive) return;
		if (panelBio.serverBio) serverBio.downloadDynamic();
		txt.on_playback_new_track();
		imgBio.on_playback_new_track();
	}

	on_playback_new_track() {
		if (!pptBio.panelActive) return;
		if (panelBio.serverBio) serverBio.on_playback_new_track();
		if (pptBio.focus) return;
		txt.on_playback_new_track();
		imgBio.on_playback_new_track();
	}

	on_playback_stop(reason) {
		if (!pptBio.panelActive) return;
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
		if (panelBio.serverBio) {
			window.NotifyOthers('bio_scriptUnload', 0);
			timerBio.clear(timerBio.img);
		}
		butBio.on_script_unload();
	}

	on_size() {
		txt.repaint = false;
		panelBio.w = window.Width;
		panelBio.h = window.Height;
		if (!panelBio.w || !panelBio.h) return;
		uiBio.getFont();
		panelBio.getLogo();
		if (!pptBio.panelActive) return;
		panelBio.calcText = true;
		txt.on_size();
		imgBio.on_size();
		filmStrip.on_size();
		txt.repaint = true;
		imgBio.art.displayedOtherPanel = null;
	}

	mouse_in_this(x, y) {
		return (x >= uiBio.x && x < uiBio.x + uiBio.w && y >= uiBio.y && y < uiBio.y + uiBio.h);
	}
}
