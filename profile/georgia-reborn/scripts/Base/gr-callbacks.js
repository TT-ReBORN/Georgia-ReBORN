/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Callbacks                            * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-06-04                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


////////////////////////////////////////
// * THEME INITIALIZATION FUNCTIONS * //
////////////////////////////////////////
/** Clear all current playing UI strings */
function clearUIVariables() {
	const showLowerBarVersion = pref.layout === 'compact' ? pref.showLowerBarVersion_compact : pref.layout === 'artwork' ? pref.showLowerBarVersion_artwork : pref.showLowerBarVersion_default;
	const margin = pref.layout !== 'default' ? '' : ' ';
	return {
		artist: '',
		tracknum: $(showLowerBarVersion ? pref.layout !== 'default' ? settings.stoppedString1acr : settings.stoppedString1 : ' ', undefined, true),
		title_lower: showLowerBarVersion ? `${margin}${$(settings.stoppedString2, undefined, true)}` : ' ',
		year: '',
		grid: [],
		time: showLowerBarVersion || updateAvailable ? stoppedTime : ' '
	};
}


/** Clears current used color of header and row nowplaying bg to prevent flashing of old primary color */
function clearPlaylistNowPlayingBg() {
	if (['white', 'black', 'reborn', 'random'].includes(pref.theme)) {
		g_pl_colors.header_nowplaying_bg = '';
		g_pl_colors.row_nowplaying_bg = '';
	}
}


/** Create top menu and lowerbar button images for button state 'Enabled', 'Hovered', 'Down' */
function createButtonImages() {
	const createButtonProfiler = timings.showExtraDrawTiming ? fb.CreateProfiler('createButtonImages') : null;
	const transportCircleSize = Math.round(pref.layout === 'compact' ? pref.transportButtonSize_compact * 0.93333 : pref.layout === 'artwork' ? pref.transportButtonSize_artwork * 0.93333 : pref.transportButtonSize_default * 0.93333);
	let btns = {};

	try {
		btns = {
			Stop: {
				ico: g_guifx.stop,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Previous: {
				ico: g_guifx.previous,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Play: {
				ico: g_guifx.play,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Pause: {
				ico: g_guifx.pause,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Next: {
				ico: g_guifx.next,
				font: ft.guifx,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			PlaybackDefault: {
				ico: g_guifx.right,
				font: ft.playback_order_default,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			PlaybackReplay: {
				ico: '\uf021',
				font: ft.playback_order_replay,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			PlaybackShuffle: {
				ico: g_guifx.shuffle,
				font: ft.playback_order_shuffle,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			ShowVolume: {
				ico: g_guifx.volume_down,
				font: ft.guifx_volume,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Reload: {
				ico: g_guifx.power,
				font: ft.guifx_reload,
				type: 'transport',
				w: transportCircleSize,
				h: transportCircleSize
			},
			Minimize: {
				ico: '0',
				font: ft.top_menu_caption,
				type: 'window',
				w: 22,
				h: 22
			},
			Maximize: {
				ico: '2',
				font: ft.top_menu_caption,
				type: 'window',
				w: 22,
				h: 22
			},
			Close: {
				ico: 'r',
				font: ft.top_menu_caption,
				type: 'window',
				w: 22,
				h: 22
			},
			Hamburger: {
				ico: '\uf0c9',
				font: ft.top_menu_compact,
				type: 'compact'
			},
			TopMenu: {
				ico: 'Menu',
				font: ft.top_menu,
				type: 'compact'
			},
			File: {
				ico: 'File',
				font: ft.top_menu,
				type: 'menu'
			},
			Edit: {
				ico: 'Edit',
				font: ft.top_menu,
				type: 'menu'
			},
			View: {
				ico: 'View',
				font: ft.top_menu,
				type: 'menu'
			},
			Playback: {
				ico: 'Playback',
				font: ft.top_menu,
				type: 'menu'
			},
			MediaLibrary: {
				ico: 'Media',
				font: ft.top_menu,
				type: 'menu'
			},
			Help: {
				ico: 'Help',
				font: ft.top_menu,
				type: 'menu'
			},
			Playlists: {
				ico: 'Playlists',
				font: ft.top_menu,
				type: 'menu'
			},
			Options: {
				ico: 'Options',
				font: ft.top_menu,
				type: 'menu'
			},
			Details: {
				ico: 'Details',
				font: ft.top_menu,
				type: 'menu'
			},
			PlaylistArtworkLayout: {
				ico: 'Playlist',
				font: ft.top_menu,
				type: 'menu'
			},
			Library: {
				ico: 'Library',
				font: ft.top_menu,
				type: 'menu'
			},
			Lyrics: {
				ico: 'Lyrics',
				font: ft.top_menu,
				type: 'menu'
			},
			Biography: {
				ico: 'Biography',
				font: ft.top_menu,
				type: 'menu'
			},
			Rating: {
				ico: 'Rating',
				font: ft.top_menu,
				type: 'menu'
			},
			Properties: {
				ico: 'Properties',
				font: ft.top_menu,
				type: 'menu'
			},
			Settings: {
				ico: 'Settings',
				font: ft.top_menu,
				type: 'menu'
			},
			Back: {
				ico: '\uE00E',
				type: 'backforward',
				font: ft.symbol,
				w: 22,
				h: 22
			},
			Forward: {
				ico: '\uE00F',
				type: 'backforward',
				font: ft.symbol,
				w: 22,
				h: 22
			}
		};
	} catch (e) {
		console.log('**********************************');
		console.log('ATTENTION: Buttons could not be created');
		console.log(`Make sure you installed the theme correctly to ${fb.ProfilePath}.`);
		console.log('**********************************');
	}


	btnImg = [];

	for (const i in btns) {
		if (btns[i].type === 'menu') {
			const img = gdi.CreateImage(100, 100);
			const g = img.GetGraphics();
			const measurements = g.MeasureString(btns[i].ico, btns[i].font, 0, 0, 0, 0);

			btns[i].w = Math.ceil(measurements.Width + 20);
			img.ReleaseGraphics(g);
			btns[i].h = Math.ceil(measurements.Height + 5);
		}

		if (btns[i].type === 'compact') {
			const img = gdi.CreateImage(100, 100);
			const g = img.GetGraphics();
			const measurements = g.MeasureString(btns[i].ico, btns[i].font, 0, 0, 0, 0);

			btns[i].w = Math.ceil(measurements.Width + (is_4k ? 32 : 41));
			img.ReleaseGraphics(g);
			btns[i].h = Math.ceil(measurements.Height + (is_4k ? -2 : 5));
		}

		// const { x, y } = btns[i];
		let { w, h } = btns[i];
		const lineW = scaleForDisplay(2);

		if (is_4k && btns[i].type === 'transport') {
			w *= 2;
			h *= 2;
		} else if (is_4k && btns[i].type !== 'menu') {
			w = Math.round(btns[i].w * 1.5);
			h = Math.round(btns[i].h * 1.6);
		} else if (is_4k) {
			w += 20;
			h += 10;
		}

		const stateImages = []; // 0=ButtonState.Default, 1=hover, 2=down, 3=Enabled;
		for (let state = 0; state < Object.keys(ButtonState).length; state++) {
			const btn = btns[i];
			if (state === 3 && btn.type !== 'image') break;
			const img = gdi.CreateImage(w, h);
			const g = img.GetGraphics();
			g.SetSmoothingMode(SmoothingMode.AntiAlias);
			// * Positions playback icons weirdly on AntiAliasGridFit
			if (btns[i].type !== 'transport' && !pref.customThemeFonts) {
				g.SetTextRenderingHint(TextRenderingHint.AntiAliasGridFit);
			}
			// * Positions some top menu buttons weirdly when using custom theme fonts on AntiAliasGridFit and vertical/horizontal centered font alignment, i.e StringFormat(1, 1);
			else if (btns[i].type === 'menu' && pref.customThemeFonts || btns[i].type === 'transport') {
				g.SetTextRenderingHint(TextRenderingHint.AntiAlias);
			}

			let menuTextColor = col.menuTextNormal;
			let menuRectColor = col.menuRectNormal;
			let menuBgColor = col.menuBgColor;
			let transportIconColor = col.transportIconNormal;
			let transportEllipseColor = col.transportEllipseNormal;
			let iconAlpha = 255;

			switch (state) {
				case ButtonState.Hovered:
					menuTextColor = col.menuTextHovered;
					menuRectColor = col.menuRectHovered;
					menuBgColor = col.menuBgColor;
					transportIconColor = col.transportIconHovered;
					transportEllipseColor = col.transportEllipseHovered;
					iconAlpha = 215;
					break;
				case ButtonState.Down:
					menuTextColor = col.menuTextDown;
					menuRectColor = col.menuRectDown;
					menuBgColor = col.menuBgColor;
					transportIconColor = col.transportIconDown;
					transportEllipseColor = col.transportEllipseDown;
					iconAlpha = 215;
					break;
				case ButtonState.Enabled:
					iconAlpha = 255;
					break;
			}

			switch (btn.type) {
				case 'menu': case 'window': case 'compact':
					if (pref.styleTopMenuButtons === 'default' || pref.styleTopMenuButtons === 'filled') {
						if (pref.styleTopMenuButtons === 'filled') state && g.FillRoundRect(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW, 3, 3, menuBgColor);
						state && g.DrawRoundRect(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW, 3, 3, 1, menuRectColor);
					}
					else if (pref.styleTopMenuButtons === 'bevel') {
						state && g.FillRoundRect(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW, 4, 4, menuBgColor);
						state && FillGradRoundRect(g, Math.floor(lineW / 2), Math.floor(lineW / 2) + 1, w, h - 1, 4, 4, 90, 0, col.menuStyleBg, 1);
						state && g.DrawRoundRect(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW, 4, 4, 1, menuRectColor);
					}
					else if (pref.styleTopMenuButtons === 'inner') {
						state && g.FillRoundRect(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW, 4, 4, menuBgColor);
						state && FillGradRoundRect(g, Math.floor(lineW / 2), Math.floor(lineW / 2) + 1, w, h - 1, 4, 4, 90, 0, col.menuStyleBg, 0);
						state && g.DrawRoundRect(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW, 4, 4, 1, menuRectColor);
					}
					else if (pref.styleTopMenuButtons === 'emboss') {
						state && g.FillRoundRect(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW, 4, 4, menuBgColor);
						state && FillGradRoundRect(g, Math.floor(lineW / 2), Math.floor(lineW / 2) + 1, w, h - 1, 4, 4, 90, 0, col.menuStyleBg, 0.33);
						state && g.DrawRoundRect(Math.floor(lineW / 2) + 1, Math.floor(lineW / 2) + 1, w - lineW - 2, h - lineW - 1, 4, 4, 1, col.menuRectStyleEmbossTop);
						state && g.DrawRoundRect(Math.floor(lineW / 2) + 1, Math.floor(lineW / 2), w - lineW - 2, h - lineW - 1, 4, 4, 1, col.menuRectStyleEmbossBottom);
					}
					if (btn.type === 'compact') {
						g.DrawString('\uf0c9', ft.top_menu_compact, menuTextColor, is_4k ? -39 : -19, 0, w, h, StringFormat(1, 1));
						g.DrawString(btn.ico, btn.font, menuTextColor, is_4k ? 20 : 10, is_4k ? -1 : 0, w, h, StringFormat(1, 1));
					} else {
						g.DrawString(btn.ico, btn.font, menuTextColor, 0, 0, w, btn.type === 'window' ? h : h - 1, StringFormat(1, 1));
					}
					break;

				case 'transport':
					if (pref.styleTransportButtons === 'default') {
						g.DrawEllipse(Math.floor(lineW / 2) + 1, Math.floor(lineW / 2) + 1, w - lineW - 2, h - lineW - 2, lineW, transportEllipseColor);
						g.FillEllipse(Math.floor(lineW / 2) + 1, Math.floor(lineW / 2) + 1, w - lineW - 2, h - lineW - 2, col.transportEllipseBg);
					}
					else if (pref.styleTransportButtons === 'bevel') {
						g.FillEllipse(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW - 1, h - lineW - 1, col.transportStyleTop);
						g.DrawEllipse(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW - 1, h - lineW, 1, col.transportStyleBottom);
						FillGradEllipse(g, Math.floor(lineW / 2) - 0.5, Math.floor(lineW / 2), w + 0.5, h + 0.5, 90, 0, col.transportStyleBg, 1);
					}
					else if (pref.styleTransportButtons === 'inner') {
						g.FillEllipse(Math.floor(lineW / 2), Math.floor(lineW / 2), w - lineW, h - lineW - 1, col.transportStyleTop);
						g.DrawEllipse(Math.floor(lineW / 2), Math.floor(lineW / 2) - 1, w - lineW, h - lineW + 1, 1, col.transportStyleBottom);
						FillGradEllipse(g, Math.floor(lineW / 2) - 0.5, Math.floor(lineW / 2), w + 1.5, h + 0.5, 90, 0, col.transportStyleBg, 0);
					}
					else if (pref.styleTransportButtons === 'emboss') {
						g.FillEllipse(Math.floor(lineW / 2) + 1, Math.floor(lineW / 2) + 1, w - lineW - 2, h - lineW - 2, col.transportEllipseBg);
						FillGradEllipse(g, Math.floor(lineW / 2) + 2, Math.floor(lineW / 2) + 2, w - lineW - 2, h - lineW - 2, 90, 0, col.transportStyleBg, 0.33);
						g.DrawEllipse(Math.floor(lineW / 2) + 1, Math.floor(lineW / 2) + 2, w - lineW - 2, h - lineW - 3, lineW, col.transportStyleTop);
						g.DrawEllipse(Math.floor(lineW / 2) + 1, Math.floor(lineW / 2), w - lineW - 2, h - lineW - 2, lineW, col.transportStyleBottom);
					}
					g.DrawString(btn.ico, btn.font, transportIconColor, 1, (i === 'Stop' || i === 'Reload') ? 0 : 1, w, h, StringFormat(1, 1));
					break;

				case 'backforward':
					g.DrawString(btn.ico, btn.font, g_pl_colors.plman_text_hovered, i === 'Back' ? -1 : 0, 0, w, h, StringFormat(1, 1));
					break;
			}

			img.ReleaseGraphics(g);
			stateImages[state] = img;
		}

		btnImg[i] = stateImages;
	}
	if (timings.showExtraDrawTiming) createButtonProfiler.Print();
}


/** Create top menu and lower bar transport button images for button state 'Enabled', 'Hovered', 'Down' */
function createButtonObjects(ww, wh) {
	btns = [];
	const menuFontSize = pref.layout === 'compact' ? pref.menuFontSize_compact : pref.layout === 'artwork' ? pref.menuFontSize_artwork : pref.menuFontSize_default;
	const showingMinMaxButtons = !!((UIHacks && UIHacks.FrameStyle));
	const showTransportControls = pref.layout === 'compact' ? pref.showTransportControls_compact : pref.layout === 'artwork' ? pref.showTransportControls_artwork : pref.showTransportControls_default;

	if (ww <= 0 || wh <= 0) {
		return;
	} else if (typeof btnImg === 'undefined') {
		createButtonImages();
	}

	// * TOP MENU BUTTONS * //
	/** @type {GdiBitmap[]} */
	let img = btnImg.File;
	const w = img[0].Width;
	const h = img[0].Height;
	let   x = is_4k ? 18 : 8;
	const y = Math.round(geo.topMenuHeight * 0.5 - h * 0.5 - scaleForDisplay(1));

	// Top menu font size X-correction for Artwork and Compact layout
	const xOffset = ww > scaleForDisplay(pref.layout === 'compact' ? 570 : 620) ? 0 :
	menuFontSize === 13 && !is_QHD ? scaleForDisplay(3) :
	menuFontSize === 14 && !is_QHD ? scaleForDisplay(5) :
	menuFontSize === 16  ?  is_QHD ? 4 : scaleForDisplay(12) : 0;

	const widthCorrection =
		is_4k ? (pref.customThemeFonts && menuFontSize > 12 && ww < 1080) ? 12 : (pref.customThemeFonts && menuFontSize > 10 && ww < 1080) ? 6 : 3 :
				(pref.customThemeFonts && menuFontSize > 12 && ww <  600) ?  6 : (pref.customThemeFonts && menuFontSize > 10 && ww <  600) ? 4 : 0;
	const correction = widthCorrection + (pref.layout !== 'default' ? xOffset : 0);

	// * Top menu compact
	if (pref.showTopMenuCompact) {
		img = btnImg.TopMenu;
		btns[19] = new Button(x, y, w + scaleForDisplay(41), h, 'Menu', img, 'Open menu');
	}

	// * Default foobar2000 buttons
	if (!pref.showTopMenuCompact) {
		img = btnImg.File;
		btns[20] = new Button(x, y, w, h, 'File', img);
	}

	// These buttons are not available in Artwork layout
	if (pref.layout !== 'artwork') {
		x += img[0].Width - correction;
		img = btnImg.Edit;
		if (!pref.showTopMenuCompact) btns[21] = new Button(x, y, img[0].Width, h, 'Edit', img);

		x += img[0].Width - correction;
		img = btnImg.View;
		if (!pref.showTopMenuCompact) btns[22] = new Button(x, y, img[0].Width, h, 'View', img);

		x += img[0].Width - correction;
		img = btnImg.Playback;
		if (!pref.showTopMenuCompact) btns[23] = new Button(x, y, img[0].Width, h, 'Playback', img);

		x += img[0].Width - correction;
		img = btnImg.MediaLibrary;
		if (!pref.showTopMenuCompact) btns[24] = new Button(x, y, img[0].Width, h, 'Library', img);

		x += img[0].Width - correction;
		img = btnImg.Help;
		if (!pref.showTopMenuCompact) btns[25] = new Button(x, y, img[0].Width, h, 'Help', img);

		x += img[0].Width - correction;
		img = btnImg.Playlists;
		if (!pref.showTopMenuCompact) btns[26] = new Button(x, y, img[0].Width, h, 'Playlists', img);
	}

	// * Theme buttons
	const showPanelDetails   = pref.layout === 'artwork' ? pref.showPanelDetails_artwork   : pref.showPanelDetails_default;
	const showPanelLibrary   = pref.layout === 'artwork' ? pref.showPanelLibrary_artwork   : pref.showPanelLibrary_default;
	const showPanelBiography = pref.layout === 'artwork' ? pref.showPanelBiography_artwork : pref.showPanelBiography_default;
	const showPanelLyrics    = pref.layout === 'artwork' ? pref.showPanelLyrics_artwork    : pref.showPanelLyrics_default;
	const showPanelRating    = pref.layout === 'artwork' ? pref.showPanelRating_artwork    : pref.showPanelRating_default;

	const buttonCount = (showPanelDetails ? 1 : 0) + (showPanelLibrary ? 1 : 0) + (showPanelBiography ? 1 : 0) + (showPanelLyrics ? 1 : 0) + (showPanelRating ? 1 : 0);
	const buttonXCorr = 0.33 + (buttonCount === 5 ? 0 : buttonCount === 4 ? 0.3 : buttonCount === 3 ? 0.6 : buttonCount === 2 ? 1.5 : buttonCount === 1 ? 4 : 0);

	x += img[0].Width - widthCorrection;
	if (pref.layout === 'artwork') x -= xOffset;
	// Options button is available in all layouts
	img = btnImg.Options;
	if (!pref.showTopMenuCompact) btns[27] = new Button(x, y, img[0].Width, h, 'Options', img, 'Theme options');

	// These buttons are not available in Compact layout
	if (pref.layout !== 'compact') {
		if (pref.topMenuAlignment === 'center' && ww > scaleForDisplay(pref.layout === 'artwork' ? 600 : 1380) || pref.showTopMenuCompact) {
			const centerMenu = Math.ceil(w * (buttonCount + (pref.layout === 'artwork' && pref.topMenuCompact ? 0.5 : 0)) + (menuFontSize * buttonCount * buttonXCorr));
			x = Math.round(ww * 0.5 - centerMenu);
		}

		if (showPanelDetails) {
			x += img[0].Width - correction;
			img = btnImg.Details;
			btns.details = new Button(x, y, img[0].Width, h, 'Details', img, 'Display Details');

			// Playlist button only available in Artwork layout
			if (pref.layout === 'artwork') {
				x += img[0].Width - correction;
				img = btnImg.PlaylistArtworkLayout;
				btns.playlistArtworkLayout = new Button(x, y, img[0].Width, h, 'PlaylistArtworkLayout', img, 'Display Playlist');
			}
		}
		if (showPanelLibrary) {
			x += img[0].Width - correction;
			img = btnImg.Library;
			btns.library = new Button(x, y, img[0].Width, h, 'library', img, 'Display Library');
		}
		if (showPanelBiography) {
			x += img[0].Width - correction;
			img = btnImg.Biography;
			btns.biography = new Button(x, y, img[0].Width, h, 'Biography', img, 'Display Biography');
		}
		if (showPanelLyrics) {
			x += img[0].Width - correction;
			img = btnImg.Lyrics;
			btns.lyrics = new Button(x, y, img[0].Width, h, 'Lyrics', img, 'Display Lyrics');
		}
		if (showPanelRating) {
			x += img[0].Width - correction;
			img = btnImg.Rating;
			btns.rating = new Button(x, y, img[0].Width, h, 'Rating', img, 'Rate Song');
		}
	}

	// * Top menu 🗕 🗖 ✖ caption buttons
	if (showingMinMaxButtons) {
		const hideClose = UIHacks.FrameStyle === FrameStyle.SmallCaption && UIHacks.FullScreen !== true;

		const w = scaleForDisplay(22);
		const h = w;
		const p = 3;
		const x = ww - w * (hideClose ? 2 : 3) - p * (hideClose ? 1 : 2) - (is_4k ? 21 : 14);
		const y = Math.round(geo.topMenuHeight * 0.5 - h * 0.5 - scaleForDisplay(1));

		if (pref.layout === 'default') {
			btns.Minimize = new Button(x, y, w, h, 'Minimize', btnImg.Minimize);
			btns.Maximize = new Button(x + w + p, y, w, h, 'Maximize', btnImg.Maximize);
			if (!hideClose) {
				btns.Close = new Button(x + (w + p) * 2, menuFontSize < 10 ? y + 1 : y, menuFontSize < 10 ? w - 1 : w, menuFontSize < 10 ? h - 1 : h, 'Close', btnImg.Close);
			}
		}
		else {
			btns.Minimize = new Button(x + w + p, y, w, h, 'Minimize', btnImg.Minimize);
			if (!hideClose) {
				btns[12] = new Button(x + (w + p) * 2, y, w, h, 'Close', btnImg.Close);
			}
		}
	}

	// * LOWER BAR TRANSPORT BUTTONS * //
	if (showTransportControls) {
		const lowerBarFontSize     = pref.layout === 'compact' ? pref.lowerBarFontSize_compact       : pref.layout === 'artwork' ? pref.lowerBarFontSize_artwork       : pref.lowerBarFontSize_default;
		const showPlaybackOrderBtn = pref.layout === 'compact' ? pref.showPlaybackOrderBtn_compact   : pref.layout === 'artwork' ? pref.showPlaybackOrderBtn_artwork   : pref.showPlaybackOrderBtn_default;
		const showReloadBtn        = pref.layout === 'compact' ? pref.showReloadBtn_compact          : pref.layout === 'artwork' ? pref.showReloadBtn_artwork          : pref.showReloadBtn_default;
		const showVolumeBtn        = pref.layout === 'compact' ? pref.showVolumeBtn_compact          : pref.layout === 'artwork' ? pref.showVolumeBtn_artwork          : pref.showVolumeBtn_default;
		const transportBtnSize     = pref.layout === 'compact' ? pref.transportButtonSize_compact    : pref.layout === 'artwork' ? pref.transportButtonSize_artwork    : pref.transportButtonSize_default;
		const transportBtnSpacing  = pref.layout === 'compact' ? pref.transportButtonSpacing_compact : pref.layout === 'artwork' ? pref.transportButtonSpacing_artwork : pref.transportButtonSpacing_default;

		let count = 4 + (showPlaybackOrderBtn ? 1 : 0) + (showReloadBtn ? 1 : 0) + (showVolumeBtn ? 1 : 0);

		const buttonSize = scaleForDisplay(transportBtnSize);
		const y = wh - buttonSize - scaleForDisplay(pref.layout !== 'default' ? 36 : 78) + scaleForDisplay(lowerBarFontSize);
		const w = buttonSize;
		const h = w;
		const p = scaleForDisplay(transportBtnSpacing); // Space between buttons
		const x = (ww - w * count - p * (count - 1)) / 2;

		const calcX = (index) => x + (w + p) * index;

		count = 0;
		btns.stop = new Button(x, y, w, h, 'Stop', btnImg.Stop, 'Stop');
		btns.prev = new Button(calcX(++count), y, w, h, 'Previous', btnImg.Previous, 'Previous');
		btns.play = new Button(calcX(++count), y, w, h, 'Play/Pause', !fb.IsPlaying || fb.IsPaused ? btnImg.Play : btnImg.Pause, 'Play');
		btns.next = new Button(calcX(++count), y, w, h, 'Next', btnImg.Next, 'Next');

		if (showPlaybackOrderBtn) {
			if (plman.PlaybackOrder === 0) {
				btns.playbackOrder = new Button(calcX(++count), y, w, h, 'PlaybackOrder', btnImg.PlaybackDefault);
			}
			else if (plman.PlaybackOrder === 1 || plman.PlaybackOrder === 2) {
				btns.playbackOrder = new Button(calcX(++count), y, w, h, 'PlaybackOrder', btnImg.PlaybackReplay);
			}
			else if (plman.PlaybackOrder === 3 || plman.PlaybackOrder === 4 || plman.PlaybackOrder === 5 || plman.PlaybackOrder === 6) {
				btns.playbackOrder = new Button(calcX(++count), y, w, h, 'PlaybackOrder', btnImg.PlaybackShuffle);
			}
		}
		if (showReloadBtn) {
			btns.reload = new Button(calcX(++count), y, w, h, 'Reload', btnImg.Reload, 'Reload');
		}
		if (showVolumeBtn) {
			btns.volume = new Button(calcX(++count), y, w, h, 'Volume', btnImg.ShowVolume);
			volumeBtn.setPosition(btns.volume.x, y, w);
		}
	}
}


/** Custom initialization function, called once after variable declarations */
function initMain() {
	console.log('initMain()');
	loadingTheme = true;
	str = clearUIVariables();
	ww = window.Width;
	wh = window.Height;

	artCache = new ArtCache(15);
	g_tooltip_timer = new TooltipTimer();
	tt = new TooltipHandler();
	playlistHistory = new PlaylistHistory(10);
	topMenu = new ButtonEventHandler();
	customMenu = new BaseControl();
	pauseBtn = new PauseButton();
	jumpSearch = new JumpSearch(ww, wh);
	progressBar = new ProgressBar(ww, wh);
	waveformBar = new WaveformBar(ww, wh);
	peakmeterBar = new PeakmeterBar(ww, wh);

	if (pref.libraryAutoDelete) deleteLibraryCache();
	if (pref.biographyAutoDelete) deleteBiographyCache();
	if (pref.lyricsAutoDelete) deleteLyrics();
	if (pref.waveformBarAutoDelete) deleteWaveformBarCache();

	lastFolder = '';
	lastPlaybackOrder = fb.PlaybackOrder;
	displayPanelOnStartup();
	setThemeColors();
	themeColorSet = true;

	if (!pref.lyricsRememberPanelState) {
		pref.displayLyrics = false;
	}
	else if (pref.displayLyrics && pref.lyricsLayout === 'full') {
		displayPlaylist = !displayPlaylist;
		resizeArtwork(true);
	}

	if (pref.loadAsync) {
		on_size();	// Needed when loading async, otherwise just needed in fb.IsPlaying conditional
	}

	setGeometry();

	if (fb.IsPlaying && fb.GetNowPlaying()) {
		on_playback_new_track(fb.GetNowPlaying());
	}

	window.Repaint();	// Needed when loading async, otherwise superfluous

	// * Workaround so we can use the Edit menu or run fb.RunMainMenuCommand("Edit/Something...")
	// * when the panel has focus and a dedicated playlist viewer doesn't.
	plman.SetActivePlaylistContext(); // Once on startup

	if (!libraryInitialized) {
		initLibraryPanel();
		setLibrarySize();
	}
	if (!biographyInitialized) {
		initBiographyPanel();
		setBiographySize();
	}
	if (libraryInitialized && biographyInitialized) {
		setTimeout(() => {
			lib.initialise();
			panel.updateProp(1);
			uiBio.updateProp(1);
			if (pref.libraryLayout === 'split' && (pref.libraryLayoutSplitPreset || pref.libraryLayoutSplitPreset2 || pref.libraryLayoutSplitPreset3 || pref.libraryLayoutSplitPreset4)) {
				libraryLayoutSplitPreset();
			}
			loadingThemeComplete = true;
		}, 100);
	}

	if (pref.theme === 'random' && pref.randomThemeAutoColor !== 'off') {
		randomThemeAutoColor();
	}
	if (pref.themeDayNightMode) {
		themeDayNightMode(new Date());
		console.log(`Theme day/night mode is active, current time is: ${themeDayNightMode(new Date())}. The schedule has been set to ${pref.themeDayNightMode}am (day) - ${pref.themeDayNightMode}pm (night).`);
	}

	initThemeFull = true;
	initCustomTheme();
	initTheme();
	debugLog('initTheme -> initMain');
	loadingTheme = false;
}


/** Custom initialization to update everything necessary in all panels without the need of a window.Reload() */
function initPanels() {
	// * Update Main
	createFonts();
	setGeometry();
	str.timeline = new Timeline(geo.timelineHeight);
	str.metadata_grid_tt = new MetadataGridTooltip(geo.metadataGridTooltipHeight);
	str.lowerBar_tt = new LowerBarTooltip();
	jumpSearch = new JumpSearch(ww, wh);
	volumeBtn = new VolumeBtn();
	progressBar = new ProgressBar(ww, wh);
	peakmeterBar = new PeakmeterBar(ww, wh);
	peakmeterBar.on_size(ww, wh);
	waveformBar = new WaveformBar(ww, wh);
	waveformBar.updateBar();
	createButtonImages();
	createButtonObjects(ww, wh);
	resizeArtwork(true);
	initButtonState();

	// * Update Playlist
	createPlaylistFonts();
	rescalePlaylist(true);
	initPlaylist();
	playlist.on_size(ww, wh);

	setTimeout(() => {
		// * Update Library
		setLibrarySize();
		panel.tree.y = panel.search.h;
		pop.createImages();
		panel.zoomReset();
		if (pref.libraryLayout === 'full') {
			libraryLayoutFullPreset();
		} else if (pref.libraryLayout === 'split') {
			libraryLayoutSplitPreset();
		}

		// * Update Biography
		setBiographySize();
		uiBio.setSbar();
		butBio.createImages();
		butBio.resetZoom();
		initBiographyColors();
		biographyLayoutFullPreset();
	}, loadingThemeComplete);
}


/** Custom initialization function for themes */
async function initTheme() {
	const themeProfiler = timings.showDebugTiming ? fb.CreateProfiler('initTheme') : null;

	const fullInit =
		initThemeFull ||
		ppt.theme !== 0 || pptBio.theme !== 0 ||
		pref.theme === 'reborn' || pref.theme === 'random' ||
		pref.styleBlackAndWhiteReborn || pref.styleBlackReborn;

	// * Setup
	setImageBrightness();
	if (pref.styleBlackAndWhiteReborn) initBlackAndWhiteReborn();
	if (pref.theme === 'random' && !isStreaming && !isPlayingCD) randomThemeColor();
	if (noAlbumArtStub || isStreaming || isPlayingCD) setNoAlbumArtColors();
	if ((pref.styleBlend || pref.styleBlend2 || pref.styleProgressBarFill === 'blend') && albumArt) setStyleBlend();
	setBackgroundColorDefinition();
	// * Playlist
	initPlaylistColors();
	if (fullInit && pref.playlistRowHover) playlist.on_title_color_change();
	// * Library
	initLibraryColors();
	if (fullInit && img.labels.overlayDark) ui.getItemColours();
	// * Biography
	if (fullInit) uiBio.getColours();
	initBiographyColors();
	if (fullInit) txt.getText(true);
	// * Main
	initMainColors();
	// * Styles
	initStyleColors();
	// * Chronflow
	initChronflowColors();
	// * Adjustments
	themeColorAdjustments();

	if (pref.themeBrightness !== 'default') adjustThemeBrightness(pref.themeBrightness);
	if (str.timeline) str.timeline.setColors(col.timelineAdded, col.timelinePlayed, col.timelineUnplayed);

	if (!fullInit) return;
	// * Update Playlist scrollbar buttons
	playlist.initScrollbar();
	// * Update Library buttons
	sbar.setCol();
	pop.createImages();
	but.createImages();
	but.refresh(true);
	// * Update Biography buttons
	alb_scrollbar.setCol();
	art_scrollbar.setCol();
	butBio.createImages('all');
	imgBio.createImages();
	// * Update main buttons
	createButtonImages();
	createButtonObjects(ww, wh);

	// * Pick a new random theme preset
	if (pref.presetSelectMode === 'theme') setThemePresetSelection(false, true);
	if (!['off', 'track', 'album', 'dblclick'].includes(pref.presetAutoRandomMode) && pref.presetSelectMode !== 'harmonic') themePresetRandomPicker();

	initButtonState();
	repaintWindow();

	if (timings.showDebugTiming) themeProfiler.Print();
}


/** Custom initialization function for custom themes */
function initCustomTheme() {
	switch (pref.theme) {
		case 'custom01': customColor = customTheme01; break;
		case 'custom02': customColor = customTheme02; break;
		case 'custom03': customColor = customTheme03; break;
		case 'custom04': customColor = customTheme04; break;
		case 'custom05': customColor = customTheme05; break;
		case 'custom06': customColor = customTheme06; break;
		case 'custom07': customColor = customTheme07; break;
		case 'custom08': customColor = customTheme08; break;
		case 'custom09': customColor = customTheme09; break;
		case 'custom10': customColor = customTheme10; break;
	}
}


/** Custom style initialization function to determine if style is active, used in top menu Options > Style */
function initStyleState() {
	pref.styleDefault =
	!(pref.styleBevel
	|| pref.styleBlend
	|| pref.styleBlend2
	|| pref.styleGradient
	|| pref.styleGradient2
	|| pref.styleAlternative
	|| pref.styleAlternative2
	|| pref.styleBlackAndWhite
	|| pref.styleBlackAndWhite2
	|| pref.styleBlackAndWhiteReborn
	|| pref.styleBlackReborn
	|| pref.styleRebornWhite
	|| pref.styleRebornBlack
	|| pref.styleRebornFusion
	|| pref.styleRebornFusion2
	|| pref.styleRebornFusionAccent
	|| pref.styleRandomPastel
	|| pref.styleRandomDark
	|| pref.styleTopMenuButtons !== 'default'
	|| pref.styleTransportButtons !== 'default'
	|| pref.styleProgressBarDesign !== 'default'
	|| pref.styleProgressBar !== 'default'
	|| pref.styleProgressBarFill !== 'default'
	|| pref.styleVolumeBarDesign !== 'default'
	|| pref.styleVolumeBar !== 'default'
	|| pref.styleVolumeBarFill !== 'default');
}


/** Updates when panel is resized */
function on_size() {
	ww = window.Width;
	wh = window.Height;

	console.log(`in on_size() => width: ${ww}, height: ${wh}`);

	if (ww <= 0 || wh <= 0) return;

	checkForRes(ww, wh);
	checkForPlayerSize();

	if (!sizeInitialized) {
		createFonts();
		setGeometry();
		if (fb.IsPlaying) {
			loadCountryFlags(); // Wrong size flag gets loaded on 4k systems
		}
		rescalePlaylist(true);
		initPlaylist();
		volumeBtn = new VolumeBtn();
		artCache.clear();
		artCache = new ArtCache(15);
		sizeInitialized = true;
		if (str.timeline) {
			str.timeline.setHeight(geo.timelineHeight);
		}
		if (str.metadata_grid_tt) {
			str.metadata_grid_tt.setHeight(geo.metadataGridTooltipHeight);
		}
	}

	customMenu && customMenu.on_size(ww, wh);
	jumpSearch && jumpSearch.on_size(ww, wh);
	progressBar && progressBar.on_size(ww, wh);
	waveformBar && waveformBar.on_size(ww, wh);
	peakmeterBar && peakmeterBar.on_size(ww, wh);

	lastLeftEdge = 0;

	resizeArtwork(true);
	createButtonObjects(ww, wh);
	playlist.on_size(ww, wh);
	setLibrarySize();
	setBiographySize();

	if ((pref.styleBlend || pref.styleBlend2 || pref.styleProgressBarFill === 'blend') && albumArt) setStyleBlend(); // Reposition all drawn blendedImg

	initButtonState();

	// * UIHacks double click on caption in fullscreen
	if (!componentUIHacks) return;

	try { // Needed when double clicking on caption and UIHacks.FullScreen === true; also disabling maximize in Artwork layout
		if (!utils.IsKeyPressed(VK_CONTROL) && UIHacks.FullScreen && UIHacks.MainWindowState === WindowState.Normal || pref.layout === 'artwork' && UIHacks.MainWindowState === WindowState.Maximized) {
			UIHacks.MainWindowState = WindowState.Normal;
		}
	} catch (e) {}
}


/** Album art retrieved from GetAlbumArtAsync */
function on_get_album_art_done(metadb, art_id, image, image_path) {
	if (displayPlaylist || displayPlaylistArtworkLayout) {
		trace_call && console.log('Playlist => on_get_album_art_done');
		playlist.on_get_album_art_done(metadb, art_id, image, image_path);
	}
	else if (displayLibrary) {
		trace_call && console.log('Library => on_get_album_art_done');
		library.on_get_album_art_done(metadb, art_id, image, image_path);
	}
	if (displayBiography) {
		trace_call && console.log('Biography => on_get_album_art_done');
		biography.on_get_album_art_done(metadb, art_id, image, image_path);
	}
}


/** Called when thread created by gdi.LoadImageAsync is done. */
function on_load_image_done(cookie, imagenullable, image_path) {
	trace_call && console.log('Biography => on_load_image_done');
	biography.on_load_image_done(cookie, imagenullable, image_path);
}


/** Called when script is reloaded via context menu > Reload or script is changed via panel menu > Configure or fb2k is exiting normally */
function on_script_unload() {
	console.log('Unloading Script');
	waveformBar.on_script_unload();

	// It appears we don't need to dispose the images which we loaded using gdi.Image in their declaration for some reason. Attempting to dispose them causes a script error.
	if (displayLibrary) {
		library.on_script_unload();
	}
	else if (displayBiography) {
		biography.on_script_unload();
	}
}


/** Reset current player size, used in top menu Options > Player size */
function resetPlayerSize() {
	pref.playerSize_HD_small   = false;
	pref.playerSize_HD_normal  = false;
	pref.playerSize_HD_large   = false;
	pref.playerSize_QHD_small  = false;
	pref.playerSize_QHD_normal = false;
	pref.playerSize_QHD_large  = false;
	pref.playerSize_4k_small   = false;
	pref.playerSize_4k_normal  = false;
	pref.playerSize_4k_large   = false;
}


/** Called when changing themes, used in top menu Options > Theme */
function resetTheme() {
	initThemeFull = true;
	// * Themes that don't have these styles will be reset to default
	if (pref.theme !== 'white' && (pref.styleBlackAndWhite || pref.styleBlackAndWhite2 || pref.styleBlackAndWhiteReborn) ||
		pref.theme !== 'black' && pref.styleBlackReborn ||
		pref.theme !== 'reborn' && (pref.styleRebornWhite || pref.styleRebornBlack || pref.styleRebornFusion || pref.styleRebornFusion2 || pref.styleRebornFusionAccent) ||
		pref.theme !== 'reborn' && pref.theme !== 'random' && pref.theme !== 'blue' && pref.theme !== 'darkblue' && pref.theme !== 'red' && (pref.styleGradient || pref.styleGradient2)) {
		resetStyle('all');
	}
	getThemeColors(albumArt);
	// * Update default theme colors when nothing is playing and changing themes
	if (!fb.IsPlaying) setThemeColors();
}


/** Called when changing styles, resets all styles or grouped styles. Used in top menu Options > Style */
function resetStyle(group) {
	if (group === 'all') {
		initThemeFull                 = true;
		pref.styleDefault             = true;
		pref.styleBevel               = false;
		pref.styleBlend               = false;
		pref.styleBlend2              = false;
		pref.styleGradient            = false;
		pref.styleGradient2           = false;
		pref.styleAlternative         = false;
		pref.styleAlternative2        = false;
		pref.styleBlackAndWhite       = false;
		pref.styleBlackAndWhite2      = false;
		pref.styleBlackAndWhiteReborn = false;
		pref.styleBlackReborn         = false;
		pref.styleRebornWhite         = false;
		pref.styleRebornBlack         = false;
		pref.styleRebornFusion        = false;
		pref.styleRebornFusion2       = false;
		pref.styleRebornFusionAccent  = false;
		pref.styleRandomPastel        = false;
		pref.styleRandomDark          = false;
		pref.styleRandomAutoColor     = 'off';
		pref.styleTopMenuButtons      = 'default';
		pref.styleTransportButtons    = 'default';
		pref.styleProgressBarDesign   = 'default';
		pref.styleProgressBar         = 'default';
		pref.styleProgressBarFill     = 'default';
		pref.styleVolumeBarDesign     = 'default';
		pref.styleVolumeBar           = 'default';
		pref.styleVolumeBarFill       = 'default';
		pref.themeBrightness          = 'default';
	}
	else if (group === 'group_one') {
		pref.styleBlend     = false;
		pref.styleBlend2    = false;
		pref.styleGradient  = false;
		pref.styleGradient2 = false;
	}
	else if (group === 'group_two') {
		pref.styleAlternative         = false;
		pref.styleAlternative2        = false;
		pref.styleBlackAndWhite       = false;
		pref.styleBlackAndWhite2      = false;
		pref.styleBlackAndWhiteReborn = false;
		pref.styleBlackReborn         = false;
		pref.styleRebornWhite         = false;
		pref.styleRebornBlack         = false;
		pref.styleRebornFusion        = false;
		pref.styleRebornFusion2       = false;
		pref.styleRebornFusionAccent  = false;
		pref.styleRandomPastel        = false;
		pref.styleRandomDark          = false;
	}
}


/** Called when changing styles, this will set the choosen style. Used in top menu Options > Style */
function setStyle(style, state) {
	switch (style) {
		case 'blend': resetStyle('group_one'); pref.styleBlend = state; break;
		case 'blend2':  resetStyle('group_one'); pref.styleBlend2 = state; break;
		case 'gradient': resetStyle('group_one'); pref.styleGradient = state; break;
		case 'gradient2': resetStyle('group_one'); pref.styleGradient2 = state; break;
		case 'alternative': resetStyle('group_two'); pref.styleAlternative = state; break;
		case 'alternative2': resetStyle('group_two'); pref.styleAlternative2 = state; break;
		case 'blackAndWhite': resetStyle('group_two'); pref.styleBlackAndWhite = state; break;
		case 'blackAndWhite2': resetStyle('group_two'); pref.styleBlackAndWhite2 = state; break;
		case 'blackAndWhiteReborn': resetStyle('group_two'); pref.styleBlackAndWhiteReborn = state; break;
		case 'blackReborn': resetStyle('group_two'); pref.styleBlackReborn = state; break;
		case 'rebornWhite': resetStyle('group_two'); pref.styleRebornWhite = state; pref.themeBrightness = 'default'; break;
		case 'rebornBlack': resetStyle('group_two'); pref.styleRebornBlack = state; pref.themeBrightness = 'default'; break;
		case 'rebornFusion': resetStyle('group_two'); pref.styleRebornFusion = state; break;
		case 'rebornFusion2': resetStyle('group_two'); pref.styleRebornFusion2 = state; break;
		case 'rebornFusionAccent': resetStyle('group_two'); pref.styleRebornFusionAccent = state; break;
		case 'randomPastel': resetStyle('group_two'); pref.styleRandomPastel = state; break;
		case 'randomDark': resetStyle('group_two'); pref.styleRandomDark = state; break;
	}
}


/** Called when activating or deactivating all theme presets selection, used in top menu Options > Preset > Select presets */
function setThemePresetSelection(state, presetSelectModeTheme) {
	pref.presetSelectWhite     = state;
	pref.presetSelectBlack     = state;
	pref.presetSelectReborn    = state;
	pref.presetSelectRandom    = state;
	pref.presetSelectBlue      = state;
	pref.presetSelectDarkblue  = state;
	pref.presetSelectRed       = state;
	pref.presetSelectCream     = state;
	pref.presetSelectNblue     = state;
	pref.presetSelectNgreen    = state;
	pref.presetSelectNred      = state;
	pref.presetSelectNgold     = state;
	pref.presetSelectCustom    = state;

	if (presetSelectModeTheme) {
		switch (pref.theme) {
			case 'white': pref.presetSelectWhite = true; break;
			case 'black': pref.presetSelectBlack = true; break;
			case 'reborn': pref.presetSelectReborn = true; break;
			case 'random': pref.presetSelectRandom = true; break;
			case 'blue': pref.presetSelectBlue = true; break;
			case 'darkblue': pref.presetSelectDarkblue = true; break;
			case 'red': pref.presetSelectRed = true; break;
			case 'cream': pref.presetSelectCream = true; break;
			case 'nblue': pref.presetSelectNblue = true; break;
			case 'ngreen': pref.presetSelectNgreen = true; break;
			case 'nred':  pref.presetSelectNred = true; break;
			case 'ngold': pref.presetSelectNgold = true; break;
			case 'custom01': case 'custom02': case 'custom03': case 'custom04': case 'custom05':
			case 'custom06': case 'custom07': case 'custom08': case 'custom09': case 'custom10':
				pref.presetSelectCustom = true; break;
		}
	}
}


/** Set Library size and position */
function setLibrarySize() {
	if (!libraryInitialized) return;

	const x = pref.layout === 'artwork' || pref.libraryLayout !== 'normal' ? 0 : ww * 0.5;
	const y = geo.topMenuHeight;
	const libraryWidth = pref.layout === 'artwork' || pref.libraryLayout === 'full' ? ww : ww * 0.5;
	const libraryHeight = Math.max(0, wh - geo.lowerBarHeight - y);

	ppt.zoomNode = 100; // Sets correct node zoom value, i.e when switching to 4k
	panel.setTopBar();	// Resets filter font in case the zoom was reset, also needed when changing font size

	libraryPanel.on_size(x, y, libraryWidth, libraryHeight);
}


/** Set Biography size and position */
function setBiographySize() {
	if (!biographyInitialized) return;

	const x = 0;
	const y = geo.topMenuHeight;
	const biographyWidth = pref.layout === 'artwork' || pref.biographyLayout === 'full' ? ww : ww * 0.5;
	const biographyHeight = Math.max(0, wh - geo.lowerBarHeight - y);

	// * Set guard for fixed Biography margin sizes in case user changed them in Biography options
	pptBio.borT  = scaleForDisplay(30);
	pptBio.borL  = scaleForDisplay(pref.layout === 'artwork' ? 30 : 40);
	pptBio.borR  = scaleForDisplay(pref.layout === 'artwork' ? 30 : 40);
	pptBio.borB  = scaleForDisplay(30);
	pptBio.textT = scaleForDisplay(30);
	pptBio.textL = scaleForDisplay(pref.layout === 'artwork' ? 30 : 40);
	pptBio.textR = scaleForDisplay(pref.layout === 'artwork' ? 30 : 40);
	pptBio.textB = scaleForDisplay(30);
	pptBio.gap   = scaleForDisplay(15);

	biographyPanel.on_size(x, y, biographyWidth, biographyHeight);
}


/** Called on the very first foobar start after installation or when resetting the theme */
async function systemFirstLaunch() {
	if (!pref.systemFirstLaunch) return;

	await setThemeSettings();
	await initMain();
	await autoDetectRes();

	pref.systemFirstLaunch = false;
}


/** Called when updating the metadata grid in Details. Reuses last value for last played unless provided one */
function updateMetadataGrid(currentLastPlayed, currentPlayingPlaylist) {
	currentLastPlayed = (str && str.grid ? str.grid.find(value => value.label === 'Last Played') || {} : {}).val;
	str.grid = [];
	for (let k = 0; k < metadataGrid.length; k++) {
		let val = $(metadataGrid[k].val);
		if (val && metadataGrid[k].label) {
			if (metadataGrid[k].age) {
				val = $(`$date(${val})`); // Never show time
				const age = calcAgeDateString(val);
				if (age) {
					val += ` (${age})`;
				}
			}
			str.grid.push({
				age: metadataGrid[k].age,
				label: metadataGrid[k].label,
				val
			});
		}
	}
	if (typeof currentLastPlayed !== 'undefined') {
		const lp = str.grid.find(value => value.label === 'Last Played');
		if (lp) {
			lp.val = $date(currentLastPlayed);
			if (calcAgeDateString(lp.val)) {
				lp.val += ` (${calcAgeDateString(lp.val)})`;
			}
		}
	}
	if (typeof currentPlayingPlaylist !== 'undefined') {
		const pl = str.grid.find(value => value.label === 'Playing List');
		if (pl) {
			pl.val = `${currentPlayingPlaylist}`;
		}
	}
	return str.grid;
}


/** Called when changing styles, used in top menu Options > Style */
async function updateStyle() {
	initThemeFull = true;
	if (['white', 'black', 'reborn', 'random'].includes(pref.theme)) {
		// * Update col.primary for dynamic themes
		if (fb.IsPlaying) {
			await getThemeColors(albumArt);
		} else {
			await setThemeColors();
		}
	}
	await initTheme();
	debugLog('initTheme -> updateStyle');
	if (pref.theme === 'random' && pref.randomThemeAutoColor !== 'off') randomThemeAutoColor();
	initStyleState();
	initThemePresetState();
	initButtonState();
}


//////////////////////////////
// * NAVIGATION FUNCTIONS * //
//////////////////////////////
/** Called mostly when using the custom menu */
function displayPanel(panel) {
	switch (panel) {
		case 'playlist':  displayPlaylist =  true; displayDetails = false; displayLibrary = false; displayBiography = false; pref.displayLyrics = false; break;
		case 'details':   displayPlaylist = false; displayDetails =  true; displayLibrary = false; displayBiography = false; pref.displayLyrics = false; break;
		case 'library':   displayPlaylist = false; displayDetails = false; displayLibrary =  true; displayBiography = false; pref.displayLyrics = false; break;
		case 'biography': displayPlaylist = false; displayDetails = false; displayLibrary = false; displayBiography =  true; pref.displayLyrics = false; break;
		case 'lyrics':    displayPlaylist =  true; displayDetails = false; displayLibrary = false; displayBiography =  true; pref.displayLyrics = true; break;
	}
	resizeArtwork(true);
	initButtonState();
}


////////////////////////////////////////
// * CUSTOM DRAG AND DROP FUNCTIONS * //
////////////////////////////////////////
/** Called when drag and drop items from Library to Playlist in split layout */
function libraryPlaylistDragDrop() {
	const handleList = pop.getHandleList('newItems');
	pop.sortIfNeeded(handleList);
	fb.DoDragDrop(0, handleList, handleList.Count ? 1 | 4 : 0);

	const pl = plman.ActivePlaylist;
	const drop_idx = playlistDropIndex;

	if (plman.IsPlaylistLocked(pl)) return; // Do nothing it's locked or an auto-playlist

	plman.InsertPlaylistItems(pl, drop_idx, handleList);
	plman.ClearPlaylistSelection(pl);

	setTimeout(() => {
		plman.RemovePlaylistSelection(pl);
		playlist.collapse_header();
		plman.SetPlaylistFocusItem(pl, drop_idx);
	}, 0);
}


/** Called when dragging foobar around, sets temporarily top menu caption for this action to work */
function UIHacksDragWindow(x, y) {
	if (!mouseInPanel) mouseInPanel = true;
	if (!componentUIHacks) return;
	// * Disable mouse middle btn (wheel) to be able to use Library & Biography mouse middle actions
	UIHacks.MoveStyle = displayLibrary && library.mouse_in_this(x, y) || displayBiography && biography.mouse_in_this(x, y) ? 0 : 3;
	try {
		if ((mouseInControl || downButton)) {
			UIHacks.SetPseudoCaption(0, 0, 0, 0);
			if (UIHacks.FrameStyle === 3) UIHacks.DisableSizing = true;
			pseudoCaption = false;
		}
		else if ((!pseudoCaption || pseudoCaptionWidth !== ww)) {
			UIHacks.SetPseudoCaption(0, 0, ww, pref.layout !== 'default' ? geo.topMenuHeight + scaleForDisplay(5) : geo.topMenuHeight);
			if (UIHacks.FrameStyle === 3 && !pref.lockPlayerSize) UIHacks.DisableSizing = false;
			pseudoCaption = true;
			pseudoCaptionWidth = ww;
		}
	} catch (e) {}
}


/////////////////////////
// * TIMER FUNCTIONS * //
/////////////////////////
/** Refresh playback time plus playback time remaining every second */
function on_playback_time() {
	str.time = pref.switchPlaybackTime ? $('-%playback_time_remaining%') : $('%playback_time%');
	waveformBar.on_playback_time(fb.PlaybackTime);
}


/** Seekbar repaint rect */
function refreshSeekbar() {
	// * Time
	window.RepaintRect(lowerBarTimeX, lowerBarTimeY, lowerBarTimeW, lowerBarTimeH, pref.spinDiscArt && !pref.displayLyrics);
	// * Progress bar
	if (pref.seekbar === 'progressbar' || pref.seekbar === 'peakmeterbar') {
		const x = pref.layout !== 'default' ? scaleForDisplay(18) : scaleForDisplay(38);
		const y = (pref.seekbar === 'peakmeterbar' ? peakmeterBarY - scaleForDisplay(4) : progressBarY) - scaleForDisplay(2);
		const w = pref.layout !== 'default' ? ww - scaleForDisplay(36) : ww - scaleForDisplay(76);
		const h = (pref.seekbar === 'peakmeterbar' ? geo.peakmeterBarHeight + scaleForDisplay(8) : geo.progBarHeight) + scaleForDisplay(4);
		window.RepaintRect(x, y, w, h, pref.spinDiscArt && !pref.displayLyrics);
	}
}


/** Updates the progress bar via timer interval */
function setProgressBarRefresh() {
	debugLog('setProgressBarRefresh()');
	if (fb.PlaybackLength > 0) {
		switch (pref.seekbar === 'peakmeterbar' ? pref.peakmeterBarRefreshRate : pref.progressBarRefreshRate) {
			case 'variable':
				progressBarTimerInterval = Math.abs(Math.ceil(1000 / ((ww - scaleForDisplay(80)) / fb.PlaybackLength))); // We want to update the progress bar for every pixel so divide total time by number of pixels in progress bar
				while (progressBarTimerInterval > 500) { // We want even multiples of the base progressBarTimerInterval, so that the progress bar always updates as smoothly as possible
					progressBarTimerInterval = Math.floor(progressBarTimerInterval / 2);
				}
				while (progressBarTimerInterval < 32) { // Roughly 30fps
					progressBarTimerInterval *= 2;
				}
			break;

			case 1000: progressBarTimerInterval = 1000; break;
			case  500: progressBarTimerInterval =  500; break;
			case  333: progressBarTimerInterval =  333; break;
			case  250: progressBarTimerInterval =  250; break;
			case  200: progressBarTimerInterval =  200; break;
			case  150: progressBarTimerInterval =  150; break;
			case  120: progressBarTimerInterval =  120; break;
			case  100: progressBarTimerInterval =  100; break;
			case   80: progressBarTimerInterval =   80; break;
			case   60: progressBarTimerInterval =   60; break;
			case   30: progressBarTimerInterval =   30; break;
		}
	}
	else {
		progressBarTimerInterval = 1000;
	}

	if (timings.showDebugTiming) console.log(`Progress bar will update every ${progressBarTimerInterval}ms or ${1000 / progressBarTimerInterval} times per second.`);

	if (progressBarTimer) clearInterval(progressBarTimer);
	progressBarTimer = null;
	if (!fb.IsPaused) { // Only create progressTimer if actually playing
		progressBarTimer = setInterval(() => {
			refreshSeekbar();
		}, progressBarTimerInterval || 1000);
	}
}


/** Controlled by OS clock and users set pref.themeDayNightMode value, changes the theme to white ( day ) or black ( night ) */
function themeDayNightMode(date) {
	if (!pref.themeDayNightMode || ((pref.theme === 'reborn' && (pref.styleRebornWhite || pref.styleRebornBlack) || pref.theme === 'random')) ||
		pref.styleBlackAndWhite || pref.styleBlackAndWhite2 || pref.styleBlackAndWhiteReborn) {
		return;
	}

	let hours = date.getHours();
	let minutes = date.getMinutes();
		hours %= 12;
		hours = hours || 12;
		minutes = minutes < 10 ? `0${minutes}` : minutes;

	const time = hours >= 12 ? 'pm' : 'am';

	const day =
		hours >= pref.themeDayNightMode && time === 'am' && (hours !== 12 && time === 'am') ||
		hours === 12 && time === 'pm' || hours < pref.themeDayNightMode && time === 'pm';

	pref.theme = day ? 'white' : 'black';

	return `${hours}:${minutes} ${time}`;
}


//////////////////////////
// * HELPER FUNCTIONS * //
//////////////////////////
/** Called when calculating played dates in timeline */
function calcDateRatios(dontUpdateLastPlayed, currentLastPlayed) {
	const newDate = new Date();
	dontUpdateLastPlayed = dontUpdateLastPlayed || false;

	let lfmPlayedTimesJsonLast = '';
	let playedTimesJsonLast = '';
	let playedTimesRatios = [];
	let added = toTime($('$if2(%added_enhanced%,%added%)'));
	const firstPlayed = toTime($('$if2(%first_played_enhanced%,%first_played%)'));
	let lastPlayed = toTime($('$if2(%last_played_enhanced%,%last_played%)'));
	const today = dateToYMD(newDate);
	if (dontUpdateLastPlayed && $date(lastPlayed) === today) {
		lastPlayed = toTime(currentLastPlayed);
	}

	let lfmPlayedTimes = [];
	let playedTimes = [];
	if (componentEnhancedPlaycount) {
		const playedTimesJson = $('[%played_times_js%]', fb.GetNowPlaying());
		const lastfmJson = $('[%lastfm_played_times_js%]', fb.GetNowPlaying());
		let log = settings.showDebugLog;
		if (playedTimesJson === playedTimesJsonLast && lastfmJson === lfmPlayedTimesJsonLast) {
			log = false; // Cut down on spam
		}
		lfmPlayedTimesJsonLast = lastfmJson;
		playedTimesJsonLast = playedTimesJson;
		lfmPlayedTimes = parseJson(lastfmJson, 'lastfm: ', log);
		playedTimes = parseJson(playedTimesJson, 'foobar: ', log);
	}
	else {
		playedTimes.push(firstPlayed);
		playedTimes.push(lastPlayed);
	}

	if (firstPlayed) {
		if (!added) {
			added = firstPlayed;
		}
		const age = calcAge(added);

		timelineFirstPlayedRatio = calcAgeRatio(firstPlayed, age);
		timelineLastPlayedRatio = calcAgeRatio(lastPlayed, age);
		if (timelineLastPlayedRatio < timelineFirstPlayedRatio) {
			// Due to daylight savings time, if there's a single play before the time changed lastPlayed could be < firstPlayed
			timelineLastPlayedRatio = timelineFirstPlayedRatio;
		}

		if (playedTimes.length) {
			for (let i = 0; i < playedTimes.length; i++) {
				const ratio = calcAgeRatio(playedTimes[i], age);
				playedTimesRatios.push(ratio);
			}
		} else {
			playedTimesRatios = [timelineFirstPlayedRatio, timelineLastPlayedRatio];
			playedTimes = [firstPlayed, lastPlayed];
		}

		let j = 0;
		const tempPlayedTimesRatios = playedTimesRatios.slice();
		tempPlayedTimesRatios.push(1.0001); // Pick up every last.fm time after lastPlayed fb knows about
		for (let i = 0; i < tempPlayedTimesRatios.length; i++) {
			const ratio = calcAgeRatio(lfmPlayedTimes[j], age);
			while (j < lfmPlayedTimes.length && ratio < tempPlayedTimesRatios[i]) {
				playedTimesRatios.push(ratio);
				playedTimes.push(lfmPlayedTimes[j]);
				j++;
			}
			if (ratio === tempPlayedTimesRatios[i]) { // Skip one instance
				// console.log('skipped -->', ratio);
				j++;
			}
		}
		playedTimesRatios.sort();
		playedTimes.sort();

		timelineFirstPlayedRatio = playedTimesRatios[0];
		timelineLastPlayedRatio = playedTimesRatios[Math.max(0, playedTimesRatios.length - (dontUpdateLastPlayed ? 2 : 1))];
	}
	else {
		timelineFirstPlayedRatio = 0.33;
		timelineLastPlayedRatio = 0.66;
	}
	str.timeline.setPlayTimes(timelineFirstPlayedRatio, timelineLastPlayedRatio, playedTimesRatios, playedTimes);
}


/** Called in resizeArtwork to create drop shadow for disc art */
function createDropShadow() {
	const shadowProfiler = timings.showDebugTiming ? fb.CreateProfiler('createDropShadow') : null;
	if ((albumArt && albumArtSize.w > 0) || (discArt && pref.displayDiscArt && discArtSize.w > 0)) {
		const discArtMargin = scaleForDisplay(2);
		shadowImg = discArt && !displayPlaylist && !displayLibrary && pref.displayDiscArt ?
			gdi.CreateImage(discArtSize.x + discArtSize.w + 2 * geo.discArtShadow, discArtSize.h + discArtMargin + 2 * geo.discArtShadow) :
			gdi.CreateImage(albumArtSize.x + albumArtSize.w + 2 * geo.discArtShadow, albumArtSize.h + 2 * geo.discArtShadow);
		if (pref.layout === 'default' && shadowImg) {
			const shimg = shadowImg.GetGraphics();
			// if (albumArt && !displayBiography) {
			// 	shimg.FillRoundRect(geo.discArtShadow, geo.discArtShadow, albumArtSize.x + albumArtSize.w, albumArtSize.h,
			// 		0.5 * geo.discArtShadow, 0.5 * geo.discArtShadow, col.shadow);
			// }

			if (discArt && pref.displayDiscArt && !displayPlaylist && !displayLibrary) {
				const offset = discArtSize.w * 0.40; // Don't change this value
				const xVal = discArtSize.x;
				const shadowOffset = geo.discArtShadow * 2;

				shimg.DrawEllipse(xVal + shadowOffset, shadowOffset + discArtMargin, discArtSize.w - shadowOffset, discArtSize.w - shadowOffset, geo.discArtShadow * 2, col.discArtShadow); // outer shadow
				shimg.DrawEllipse(xVal + geo.discArtShadow + offset, offset + geo.discArtShadow + discArtMargin, discArtSize.w - offset * 2, discArtSize.h - offset * 2, 60, col.discArtShadow); // inner shadow
			}
			shadowImg.ReleaseGraphics(shimg);
			shadowImg.StackBlur(geo.discArtShadow);
		}
	}

	if (timings.showDebugTiming) shadowProfiler.Print();
}


/** Called to draw drop shadow for label images */
function createShadowRect(width, height) {
	const shadow = gdi.CreateImage(width + 2 * geo.discArtShadow, height + 2 * geo.discArtShadow);
	const shimg = shadow.GetGraphics();
	shimg.FillRoundRect(geo.discArtShadow, geo.discArtShadow, width, height, 0.5 * geo.discArtShadow, 0.5 * geo.discArtShadow, col.shadow);
	shadow.ReleaseGraphics(shimg);
	shadow.StackBlur(geo.discArtShadow);

	return shadow;
}


/** Called when user auto or manual delete the Biography cache */
function deleteBiographyCache() {
	try { fso.DeleteFolder(pref.customBiographyDir ? `${globals.customBiographyDir}\\*.*` : `${fb.ProfilePath}cache\\biography\\biography-cache`); }
	catch (e) {}
}


/** Called when user auto or manual delete the Library cache */
function deleteLibraryCache() {
	try { fso.DeleteFolder(pref.customLibraryDir ? `${globals.customLibraryDir}\\*.*` : `${fb.ProfilePath}cache\\library\\library-tree-cache`); }
	catch (e) {}
}


/** Called when user auto or manual delete the Lyrics */
function deleteLyrics() {
	try { fso.DeleteFile(pref.customLyricsDir ? `${globals.customLyricsDir}\\*.*` : `${fb.ProfilePath}cache\\lyrics\\*.*`); }
	catch (e) {}
}


/** Called when user auto or manual delete the Waveform bar cache */
function deleteWaveformBarCache() {
	try { fso.DeleteFolder(pref.customWaveformBarDir ? `${globals.customWaveformBarDir}\\*.*` : `${fb.ProfilePath}cache\\waveform\\*.*`); }
	catch (e) {}
}


/** Called on initMain, displays panel when starting foobar */
function displayPanelOnStartup() {
	// * Added additional conditions to show Playlist and not Details in Compact layout if Playlist is not displayed on startup
	// * while starting in Compact layout, this also fixes ugly switch from Default to Compact layout
	if (pref.showPanelOnStartup === 'cover' && pref.layout === 'artwork') {
		displayPlaylist = false;
	}
	else if (pref.showPanelOnStartup === 'playlist' || pref.layout === 'compact') {
		if (pref.layout === 'artwork') displayPlaylistArtworkLayout = true;
		else displayPlaylist = true;
	}
	else if (pref.showPanelOnStartup === 'details' && pref.layout !== 'compact') {
		displayPlaylist = pref.layout === 'artwork';
	}
	else if (pref.showPanelOnStartup === 'library' && pref.layout !== 'compact') {
		displayLibrary = true;
		if (pref.libraryLayout === 'split') displayPlaylist = true;
	}
	else if (pref.showPanelOnStartup === 'biography' && pref.layout !== 'compact') {
		displayPlaylist = true;
		displayBiography = true;
	}
	else if (pref.showPanelOnStartup === 'lyrics' && pref.layout !== 'compact') {
		fb.Play();
		displayPlaylist = pref.layout === 'default';
		setTimeout(() => {
			pref.displayLyrics = true;
			initLyrics();
			initButtonState();
		}, 500);
	}
}


/** Called to display red rectangles to show all redraw areas, used for debugging */
function repaintRectAreas() {
	window.RepaintRect = (x, y, w, h, force = undefined) => {
		if (timings.drawRepaintRects) {
			repaintRects.push({ x, y, w, h });
			window.Repaint();
		} else {
			repaintRectCount++;
			window.oldRepaintRect(x, y, w, h, force);
		}
	};
}


/** Called when a continuous repaint for a short period of time ( 1 sec ) is needed, used when changing layout width */
function repaintWindowRectAreas() {
	debugLog('Repainting from repaintWindowRectAreas()');

	window.RepaintRect = () => {
		window.Repaint();
	};

	setTimeout(() => { // Restore window.RepaintRect afterwards
		window.RepaintRect = (x, y, w, h, force = undefined) => {
			window.oldRepaintRect(x, y, w, h, force);
		};
	}, 1000);
}


/** Called to print logs for window.Repaint() in the console */
function repaintWindow() {
	debugLog('Repainting from repaintWindow()');
	window.Repaint();
}


/**
 * Creates a rotated image for disc art
 * @param {GdiBitmap} img The source image
 * @param {number} w Width of image
 * @param {number} h Height of image
 * @param {number} degrees
 */
function rotateImg(img, w, h, degrees) {
	if (degrees === 0) {
		return img.Clone(0, 0, img.Width, img.Height).Resize(w, h);
	}

	/** @type {GdiBitmap} */
	const rotatedImg = gdi.CreateImage(w, h);
	const gotGraphics = rotatedImg.GetGraphics();
	gotGraphics.DrawImage(img, 0, 0, w, h, 0, 0, img.Width, img.Height, degrees);
	rotatedImg.ReleaseGraphics(gotGraphics);

	return rotatedImg;
}


/** Called when user sorts the Playlist, will sort by defined sort patterns from the config file */
function setPlaylistSortOrder() {
	plman.SortByFormat(plman.ActivePlaylist,
		pref.playlistSortOrder === 'default' ? settings.playlistSortDefault :
		pref.playlistSortOrder === 'artistDateAsc' ? settings.playlistSortArtistDateAsc :
		pref.playlistSortOrder === 'artistDateDesc' ? settings.playlistSortArtistDateDesc :
		pref.playlistSortOrder === 'album' ? settings.playlistSortAlbum :
		pref.playlistSortOrder === 'title' ? settings.playlistSortTitle :
		pref.playlistSortOrder === 'tracknum' ? settings.playlistSortTracknum :
		pref.playlistSortOrder === 'yearAsc' ? settings.playlistSortArtistYearAsc :
		pref.playlistSortOrder === 'yearDesc' ? settings.playlistSortArtistYearDesc :
		pref.playlistSortOrder === 'filePath' ? settings.playlistSortFilePath :
		pref.playlistSortOrder === 'custom' ? settings.playlistSortCustom : '');
}


/** Called when user activates show theme preset indicator */
function showThemePresetIndicator(gr) {
	if (!pref.presetIndicator || !['off', 'dblclick'].includes(pref.presetAutoRandomMode) || pref.presetSelectMode === 'harmonic' && !doubleClicked) return;

	const match = themePresetMatchMode;
	const text = 'Active styles matching:';
	const text2 = themePresetName;
	const arc = scaleForDisplay(6);
	const boxH = gr.CalcTextHeight(text, ft.notification) * (match ? 2.5 : 0) + gr.CalcTextHeight(text2, ft.notification) * 2 + arc;
	const w = Math.max(gr.CalcTextWidth(text, ft.notification) + 50, gr.CalcTextWidth(text2, ft.notification) + 50);
	const h = gr.CalcTextHeight(text, ft.notification);

	const fullW =
		pref.layout === 'default'
		&&
		displayPlaylist && pref.playlistLayout === 'full'
		||
		displayLibrary && pref.libraryLayout  === 'full'
		||
		displayBiography && pref.biographyLayout === 'full'
		||
		pref.displayLyrics && pref.lyricsLayout === 'full';

	const cover = fb.IsPlaying && albumArt && pref.layout !== 'compact' && !fullW;
	const noCoverDefault = pref.layout === 'default' && !fullW;

	const x = Math.round((cover ? albumArtSize.x + albumArtSize.w * 0.5 : noCoverDefault ? ww * 0.25 : ww * 0.5) - w * 0.5);
	const y = Math.round((cover ? albumArtSize.h * 0.5 : wh * 0.5 - geo.lowerBarHeight * 0.5) - (match ? h : -h * 0.5));

	if (themePresetName !== '') {
		gr.SetSmoothingMode(SmoothingMode.AntiAlias);
		gr.FillRoundRect(x, y, w, boxH, arc, arc, col.popupBg);
		gr.DrawRoundRect(x, y, w, boxH, arc, arc, scaleForDisplay(2), 0x64000000);
		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);
		if (match) gr.DrawString(text, ft.notification, col.popupText, x, y + h, w, h, StringFormat(1, 1, 4));
		gr.DrawString(text2, ft.notification, col.popupText, x, y + h * (match ? 2.5 : 0.66), w, h, StringFormat(1, 1, 4));
	}
}


/** Called when user activates enable theme debug overlay in developer options */
function showThemeLogOverlay(gr) {
	if (!settings.showThemeLogOverlay) return;

	const x = albumArtSize.x + scaleForDisplay(pref.layout !== 'default' ? 20 : 40);
	let y = albumArtSize.y;
	const fullW = pref.layout === 'default' && pref.lyricsLayout === 'full' && pref.displayLyrics && noAlbumArtStub || pref.layout === 'artwork';
	const titleWidth = albumArtSize.w - scaleForDisplay(80);
	const titleHeight = gr.CalcTextHeight(' ', ft.popup);
	const logColor = RGB(255, 255, 255);

	const tsBlock1 = pref.styleBevel ? 'Bevel,' : '';
	const tsBlock2 =
		pref.styleBlend ? 'Blend,' : pref.styleBlend2 ? 'Blend 2,' :
		pref.styleGradient ? 'Gradient,' : pref.styleGradient2 ? 'Gradient 2,' : '';
	const tsBlock3 =
		pref.styleAlternative ? 'Alternative' : pref.styleAlternative2 ? 'Alternative 2' :
		pref.styleBlackAndWhite ? 'Black and white' : pref.styleBlackAndWhite2 ? 'Black and white 2' : pref.styleBlackAndWhiteReborn ? 'Black and white reborn' :
		pref.styleBlackReborn ? 'Black reborn' :
		pref.styleRebornWhite ? 'Reborn white' : pref.styleRebornBlack ? 'Reborn black' :
		pref.styleRebornFusion ? 'Reborn fusion' :
		pref.styleRebornFusion2 ? 'Reborn fusion 2' :
		pref.styleRebornFusionAccent ? 'Reborn fusion accent' :
		pref.styleRandomPastel ? 'Random pastel' : pref.styleRandomDark ? 'Random dark' : '';

	const tsTopMenuButtons = pref.styleTopMenuButtons !== 'default' ? capitalize(`${pref.styleTopMenuButtons}`) : '';
	const tsTransportButtons = pref.styleTransportButtons !== 'default' ? capitalize(`${pref.styleTransportButtons}`) : '';
	const tsProgressBar1 = pref.styleProgressBarDesign === 'rounded' ? 'Rounded,' : '';
	const tsProgressBar2 = pref.styleProgressBar !== 'default' ? `Bg: ${capitalize(`${pref.styleProgressBar},`)}` : '';
	const tsProgressBar3 = pref.styleProgressBarFill !== 'default' ? `Fill: ${capitalize(`${pref.styleProgressBarFill}`)}` : '';
	const tsVolumeBar1 = pref.styleVolumeBarDesign === 'rounded' ? 'Rounded,' : '';
	const tsVolumeBar2 = pref.styleVolumeBar !== 'default' ? `Bg: ${capitalize(`${pref.styleVolumeBar},`)}` : '';
	const tsVolumeBar3 = pref.styleVolumeBarFill !== 'default' ? `Fill: ${capitalize(`${pref.styleVolumeBarFill}`)}` : '';

	gr.SetSmoothingMode(SmoothingMode.None);
	gr.FillSolidRect(fullW ? 0 : albumArtSize.x, fullW ? geo.topMenuHeight : albumArtSize.y, fullW ? ww : albumArtSize.w, fullW ? wh - geo.topMenuHeight - geo.lowerBarHeight : albumArtSize.h, RGBA(0, 0, 0, 180));
	gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

	y += titleHeight * 1.5;
	gr.DrawString(`Primary color: ${selectedPrimaryColor}`, ft.popup, logColor, x, y, titleWidth, titleHeight, StringFormat(0, 0, 4));
	y += titleHeight * 1.5;
	gr.DrawString(`Primary 2 color: ${selectedPrimaryColor2}`, ft.popup, logColor, x, y, titleWidth, titleHeight, StringFormat(0, 0, 4));
	y += titleHeight * 1.5;
	gr.DrawString(`Primary color brightness: ${colBrightness}`, ft.popup, logColor, x, y, titleWidth, titleHeight, StringFormat(0, 0, 4));
	y += titleHeight * 1.5;
	gr.DrawString(`Primary 2 color brightness: ${colBrightness2}`, ft.popup, logColor, x, y, titleWidth, titleHeight, StringFormat(0, 0, 4));
	y += titleHeight * 1.5;
	gr.DrawString(`Image brightness: ${imgBrightness}`, ft.popup, logColor, x, y, titleWidth, titleHeight, StringFormat(0, 0, 4));
	y += titleHeight * 1.5;

	if (pref.styleBlend || pref.styleBlend2) {
		gr.DrawString(`Image blur: ${blendedImgBlur}`, ft.popup, logColor, x, y, titleWidth, titleHeight, StringFormat(0, 0, 4));
		y += titleHeight * 1.5;
		gr.DrawString(`Image alpha: ${blendedImgAlpha}`, ft.popup, logColor, x, y, titleWidth, titleHeight, StringFormat(0, 0, 4));
		y += titleHeight * 1.5;
	}
	if (pref.preset) {
		y += titleHeight * 1.5;
		gr.DrawString(`Theme preset: ${pref.preset}`, ft.popup, logColor, x, y, titleWidth, titleHeight, StringFormat(0, 0, 4));
	}
	if (pref.themeBrightness !== 'default') {
		y += titleHeight * 1.5;
		gr.DrawString(`Theme brightness: ${pref.themeBrightness}%`, ft.popup, logColor, x, y, titleWidth, titleHeight, StringFormat(0, 0, 4));
	}
	if (tsBlock1 || tsBlock2 || tsBlock3) {
		y += titleHeight * 1.5;
		gr.DrawString(`Styles: ${tsBlock1} ${tsBlock2} ${tsBlock3}`, ft.popup, logColor, x, y, titleWidth, titleHeight, StringFormat(0, 0, 4));
	}
	if (tsTopMenuButtons) {
		y += titleHeight * 1.5;
		gr.DrawString(`Top menu button style: ${tsTopMenuButtons}`, ft.popup, logColor, x, y, titleWidth, titleHeight, StringFormat(0, 0, 4));
	}
	if (tsTransportButtons) {
		y += titleHeight * 1.5;
		gr.DrawString(`Transport button style: ${tsTransportButtons}`, ft.popup, logColor, x, y, titleWidth, titleHeight, StringFormat(0, 0, 4));
	}
	if (tsProgressBar1 || tsProgressBar2 || tsProgressBar3) {
		y += titleHeight * 1.5;
		gr.DrawString(tsProgressBar1 || tsProgressBar2 || tsProgressBar3 ? `Progressbar styles: ${tsProgressBar1} ${tsProgressBar2} ${tsProgressBar3}` : '', ft.popup, logColor, x, y, titleWidth, titleHeight, StringFormat(0, 0, 4));
	}
	if (tsVolumeBar1 || tsVolumeBar2 || tsVolumeBar3) {
		y += titleHeight * 1.5;
		gr.DrawString(`Volumebar styles: ${tsVolumeBar1} ${tsVolumeBar2} ${tsVolumeBar3}`, ft.popup, logColor, x, y, titleWidth, titleHeight, StringFormat(0, 0, 4));
	}
}


///////////////////////////
// * ARTWORK FUNCTIONS * //
///////////////////////////
/** Used to cycle album artworks with timed auto-feature or album art context menu */
function displayNextImage() {
	debugLog(`Repainting in displayNextImage: ${albumArtIndex}`);
	albumArtIndex = (albumArtIndex + 1) % albumArtList.length;
	loadImageFromAlbumArtList(albumArtIndex);
	if (pref.theme === 'reborn' || pref.theme === 'random' || pref.styleBlackAndWhiteReborn || pref.styleBlackReborn) {
		newTrackFetchingArtwork = true;
		getThemeColors(albumArt);
		initTheme();
		debugLog('initTheme -> displayNextImage');
	}
	lastLeftEdge = 0;
	resizeArtwork(true); // Needed to readjust discArt shadow size if artwork size changes
	repaintWindow();
	albumArtTimeout = setTimeout(() => {
		displayNextImage();
	}, settings.artworkDisplayTime * 1000);
	initButtonState();
}


/** Fetches new album art/disc art when a new album is being played, disc art changed or cycling through album artworks */
function fetchNewArtwork(metadb) {
	if (pref.presetAutoRandomMode === 'album' || pref.presetSelectMode === 'harmonic') initThemeSkip = true;
	const fetchArtworkProfiler = timings.showDebugTiming ? fb.CreateProfiler('fetchNewArtwork') : null;
	albumArtList = [];
	let discArtExists = true;
	let discArtPath;

	// * Vinyl disc art search paths
	const v01 = $(pref.vinylside_path);              // Root -> vinyl side
	const v02 = $(pref.vinylside_path_artwork_root); // Root Artwork -> vinyl%vinyl disc%.png
	const v03 = $(pref.vinylside_path_images_root);  // Root Images -> vinyl%vinyl disc%.png
	const v04 = $(pref.vinylside_path_scans_root);   // Root Scans -> vinyl%vinyl disc%.png
	const v05 = $(pref.vinylside_path_artwork);      // Subfolder Artwork -> vinyl%vinyl disc%.png
	const v06 = $(pref.vinylside_path_images);       // Subfolder Images -> vinyl%vinyl disc%.png
	const v07 = $(pref.vinylside_path_scans);        // Subfolder Scans -> vinyl%vinyl disc%.png
	const v08 = $(pref.vinyl_path);                  // Root -> vinyl.png
	const v09 = $(pref.vinyl_path_artwork_root);     // Root Artwork -> vinyl.png
	const v10 = $(pref.vinyl_path_images_root);      // Root Images -> vinyl.png
	const v11 = $(pref.vinyl_path_scans_root);       // Root Scans -> vinyl.png
	const v12 = $(pref.vinyl_path_artwork);          // Subfolder Artwork -> vinyl.png
	const v13 = $(pref.vinyl_path_images);           // Subfolder Images -> vinyl.png
	const v14 = $(pref.vinyl_path_scans);            // Subfolder Scans -> vinyl.png

	// * CD disc art search paths
	const c01 = $(pref.cdartdisc_path);              // Root -> cd%discnumber%.png
	const c02 = $(pref.cdartdisc_path_artwork_root); // Root Artwork -> cd%discnumber%.png
	const c03 = $(pref.cdartdisc_path_images_root);  // Root Images -> cd%discnumber%.png
	const c04 = $(pref.cdartdisc_path_scans_root);   // Root Scans -> cd%discnumber%.png
	const c05 = $(pref.cdartdisc_path_artwork);      // Subfolder Artwork -> cd%discnumber%.png
	const c06 = $(pref.cdartdisc_path_images);       // Subfolder Images -> cd%discnumber%.png
	const c07 = $(pref.cdartdisc_path_scans);        // Subfolder Scans -> cd%discnumber%.png
	const c08 = $(pref.cdart_path);                  // Root -> cd.png
	const c09 = $(pref.cdart_path_artwork_root);     // Root Artwork -> cd.png
	const c10 = $(pref.cdart_path_images_root);      // Root Images -> cd.png
	const c11 = $(pref.cdart_path_scans_root);       // Root Scans -> cd.png
	const c12 = $(pref.cdart_path_artwork);          // Subfolder Artwork -> cd.png
	const c13 = $(pref.cdart_path_images);           // Subfolder Images -> cd.png
	const c14 = $(pref.cdart_path_scans);            // Subfolder Scans -> cd.png

	const discArtAllPaths = [
		v01, v02, v03, v04, v05, v06, v07, v08, v09, v10, v11, v12, v13, v14,
		c01, c02, c03, c04, c05, c06, c07, c08, c09, c10, c11, c12, c13, c14
	];

	if (pref.displayDiscArt && !isStreaming) { // We must attempt to load CD/vinyl art first so that the shadow is drawn correctly
		if (pref.noDiscArtStub || pref.showDiscArtStub) {
			for (let i = 0; i < discArtAllPaths.length; i++) {
				const found = IsFile(discArtAllPaths[i]);
				if (found) {
					discArtPath = discArtAllPaths[i];
					discArtExists = true;
				}
				// Didn't find anything
				else if (!noAlbumArtStub && pref.noDiscArtStub) discArtExists = false;
			}
		}

		if (IsFile(discArtPath)) {
			discArtExists = true;
		}
		// * Display custom disc art placeholders
		else if (!pref.noDiscArtStub || pref.showDiscArtStub) {
			discArtExists = true;
			switch (pref.discArtStub) {
				case 'cdWhite':         discArtPath = paths.cdArtWhiteStub;	break;
				case 'cdBlack':         discArtPath = paths.cdArtBlackStub;	break;
				case 'cdBlank':         discArtPath = paths.cdArtBlankStub;	break;
				case 'cdTrans':         discArtPath = paths.cdArtTransStub;	break;
				case 'cdCustom':        discArtPath = paths.cdArtCustomStub; break;
				case 'vinylWhite':      discArtPath = paths.vinylArtWhiteStub; break;
				case 'vinylVoid':       discArtPath = paths.vinylArtVoidStub; break;
				case 'vinylColdFusion': discArtPath = paths.vinylArtColdFusionStub;	break;
				case 'vinylRingOfFire': discArtPath = paths.vinylArtRingOfFireStub;	break;
				case 'vinylMaple':      discArtPath = paths.vinylArtMapleStub; break;
				case 'vinylBlack':      discArtPath = paths.vinylArtBlackStub; break;
				case 'vinylBlackHole':  discArtPath = paths.vinylArtBlackHoleStub; break;
				case 'vinylEbony':      discArtPath = paths.vinylArtEbonyStub; break;
				case 'vinylTrans':      discArtPath = paths.vinylArtTransStub; break;
				case 'vinylCustom':     discArtPath = paths.vinylArtCustomStub;	break;
			}
		}

		if (discArtExists) {
			let tempDiscArt;
			if (loadFromCache) {
				tempDiscArt = artCache.getImage(discArtPath);
			}
			if (tempDiscArt) {
				disposeDiscArtImg(discArt);
				discArt = tempDiscArt;
				resizeArtwork(true);
				createRotatedDiscArtImage();
				if (pref.spinDiscArt) {
					discArtArray = [];	// Clear last image
					setupRotationTimer();
				}
			} else {
				gdi.LoadImageAsyncV2(window.ID, discArtPath).then(discArtImg => {
					disposeDiscArtImg(discArt); // Delay disposal so we don't get flashing
					discArt = artCache.encache(discArtImg, discArtPath);
					resizeArtwork(true);
					createRotatedDiscArtImage();
					if (pref.spinDiscArt) {
						discArtArray = [];	// Clear last image
						setupRotationTimer();
					}
					lastLeftEdge = 0; // Recalc label location
					repaintWindow();
				});
			}
		}
		else {
			discArt = disposeDiscArtImg(discArt);
		}
	}

	if (isStreaming || isPlayingCD) {
		discArt = disposeDiscArtImg(discArt);
		albumArt = utils.GetAlbumArtV2(metadb);
		pref.showGridTitle_default = true;
		pref.showGridTitle_artwork = true;
		if (albumArt) {
			getThemeColors(albumArt);
			resizeArtwork(true);
		} else {
			noArtwork = true;
			shadowImg = null;
		}
		initTheme();
		debugLog('initTheme -> fetchNewArtwork -> isStreaming || isPlayingCD');
	}
	else {
		if (!pref.showGridTitle_default && pref.layout === 'default') pref.showGridTitle_default = false;
		if (!pref.showGridTitle_artwork && pref.layout === 'artwork') pref.showGridTitle_artwork = false;

		albumArtList = globals.imgPaths.map(path => utils.Glob($(path), FileAttributes.Directory | FileAttributes.Hidden)).flat();
		const filteredFileTypes = pref.filterDiscJpgsFromAlbumArt ? '(png|jpg)' : 'png';
		const pattern = new RegExp(`(cd|disc|vinyl|${settings.discArtBasename})([0-9]*|[a-h]).${filteredFileTypes}`, 'i');
		const imageType = /jpg|png$/i;	// TODO: Add gifs?
		// * Remove duplicates and cd/vinyl art and make sure all files are jpg or pngs
		albumArtList = [...new Set(albumArtList)].filter(path => !pattern.test(path) && imageType.test(path));

		// * Try loading album art from artwork image paths
		if (albumArtList.length && !pref.loadEmbeddedAlbumArtFirst) {
			noArtwork = false;
			noAlbumArtStub = false;
			embeddedArt = false;
			if (albumArtList.length > 1 && pref.cycleArt) {
				albumArtTimeout = setTimeout(() => {
					displayNextImage();
				}, settings.artworkDisplayTime * 1000);
			}
			albumArtIndex = 0;
			loadImageFromAlbumArtList(albumArtIndex); // Display first image
		}
		// * If not found, try embedded artwork from music file
		else if (metadb && (albumArt = utils.GetAlbumArtV2(metadb))) {
			noArtwork = false;
			noAlbumArtStub = false;
			getThemeColors(albumArt);
			if (!loadingTheme) initTheme(); // * Prevent incorrect theme brightness at startup/reload when using embedded art
			debugLog('initTheme -> fetchNewArtwork -> embeddedArt');
			resizeArtwork(true);
			embeddedArt = true;
		}
		// * No album art found, using noAlbumArtStub
		else {
			noArtwork = true;
			noAlbumArtStub = true;
			albumArt = null;
			initTheme();
			debugLog('initTheme -> fetchNewArtwork -> noAlbumArtStub');
			resizeArtwork(true);
			debugLog('Repainting on_playback_new_track due to no cover image');
			repaintWindow();
		}
	}

	if (timings.showDebugTiming) fetchArtworkProfiler.Print();
}


/**
 * Loads an image from the albumArtList array.
 * @param {number} index Index of albumArtList signifying which image to load
 */
async function loadImageFromAlbumArtList(index) {
	const metadb = fb.GetNowPlaying();
	const tempAlbumArt = artCache && artCache.getImage(albumArtList[index]);

	if (tempAlbumArt) {
		albumArt = tempAlbumArt;
		if (index === 0 && newTrackFetchingArtwork) {
			newTrackFetchingArtwork = false;
			await getThemeColors(albumArt);
			if (!initThemeSkip) {
				await initTheme();
				debugLog('initTheme -> loadImageFromAlbumArtList -> tempAlbumArt');
			}
		}
	}
	else if (on_mouse_wheel_albumart) {
		// ! gdi.LoadImageAsyncV2 only used when cycling through album art via mouse wheel
		// ! Otherwise use utils.GetAlbumArtV2 when loading the first image
		gdi.LoadImageAsyncV2(window.ID, albumArtList[index]).then(coverImage => {
			albumArt = artCache.encache(coverImage, albumArtList[index]);
			if (newTrackFetchingArtwork) {
				if (!albumArt && fb.IsPlaying) { // * Use noAlbumArtStub if album art could not be properly parsed
					if (metadb && (albumArt = utils.GetAlbumArtV2(metadb))) { // * But first try embedded artwork from music file
						noArtwork = false;
						noAlbumArtStub = false;
						embeddedArt = true;
					} else {
						noArtwork = true;
						noAlbumArtStub = true;
						embeddedArt = false;
						console.log('<Error GetAlbumArtV2: Album art could not be properly parsed! Maybe it is corrupt, file format is not supported or has an unusual ICC profile embedded>');
					}
				}
				getThemeColors(albumArt);
				initTheme();
				debugLog('initTheme -> loadImageFromAlbumArtList -> LoadImageAsyncV2');
				newTrackFetchingArtwork = false;
			}
			resizeArtwork(true);
			if (discArt) createRotatedDiscArtImage();
			lastLeftEdge = 0; // Recalc label location
			repaintWindow();
		});
	}
	else {
		// ! We use the older utils.GetAlbumArtV2 method to display the first image because
		// ! gdi.LoadImageAsyncV2, utils.GetAlbumArtAsyncV2 and promises are being blocked in the SMP pipe while context menu is being active.
		const image = utils.GetAlbumArtV2(metadb);
		albumArt = artCache.encache(image, albumArtList[index]);
		if (newTrackFetchingArtwork) {
			if (!albumArt && fb.IsPlaying) { // * Use noAlbumArtStub if album art could not be properly parsed
				noArtwork = true;
				noAlbumArtStub = true;
				embeddedArt = false;
				console.log('<Error GetAlbumArtV2: Album art could not be properly parsed! Maybe it is corrupt, file format is not supported or has an unusual ICC profile embedded>');
			}
			if (activeMenu) {
				getThemeColors(albumArt);
				if (!initThemeSkip) initTheme();
			} else {
				await getThemeColors(albumArt);
				if (!initThemeSkip) await initTheme();
			}

			if (!initThemeSkip) debugLog('initTheme -> loadImageFromAlbumArtList -> GetAlbumArtV2');
			newTrackFetchingArtwork = false;
		}
		resizeArtwork(true);
		if (discArt) createRotatedDiscArtImage();
		lastLeftEdge = 0; // Recalc label location
		repaintWindow();
		initThemeSkip = false;
	}

	resizeArtwork(false); // Recalculate image positions

	if (discArt) {
		createRotatedDiscArtImage();
	}
}


/** Used to resize album art for better drawing performance */
function resizeArtwork(resetDiscArtPosition) {
	debugLog('Resizing artwork');
	let hasArtwork = false;
	const lowerSpace = geo.lowerBarHeight;
	if (albumArt && albumArt.Width && albumArt.Height) {
		// * Size for big albumArt
		let xCenter = 0;
		const albumScale =
			pref.layout === 'artwork' ? Math.min(ww / albumArt.Width, (wh - lowerSpace - geo.topMenuHeight) / albumArt.Height) :
			Math.min(((displayPlaylist || displayLibrary) ?
				UIHacks.FullScreen ? pref.albumArtScale === 'filled' ? 0.545 * ww : 0.5 * ww :
				UIHacks.MainWindowState === WindowState.Maximized ? pref.albumArtScale === 'filled' ? 0.55 * ww : 0.5 * ww :
				0.5 * ww :
			0.75 * ww) / albumArt.Width, (wh - lowerSpace - geo.topMenuHeight) / albumArt.Height);

		if (displayPlaylist || displayLibrary) {
			xCenter =
				pref.layout === 'artwork' ? 0 :
				UIHacks.FullScreen ? is_4k ? 0.261 * ww : 0.23 * ww :
				UIHacks.MainWindowState === WindowState.Maximized ? is_4k ? 0.267 * ww : 0.24 * ww :
				xCenter = 0.25 * ww;
		}
		else if (ww / wh < 1.40) { // When using a roughly 4:3 display the album art crowds, so move it slightly off center
			xCenter = 0.56 * ww; // TODO: check if this is still needed?
		}
		else {
			xCenter = 0.5 * ww;
			artOffCenter = false;
			if (albumScale === 0.75 * ww / albumArt.Width) {
				xCenter += 0.1 * ww;
				artOffCenter = true; // TODO: We should probably suppress labels in this case
			}
		}

		albumArtSize.w = Math.floor(albumArt.Width * albumScale); // Width
		albumArtSize.h = Math.floor(albumArt.Height * albumScale); // Height
		albumArtSize.x = // * When player size is not proportional, album art is aligned via setting 'pref.albumArtAlign' in Default layout and is centered in Artwork layout */
			pref.layout === 'default' ?
				displayPlaylist || displayLibrary ?
					UIHacks.FullScreen || UIHacks.MainWindowState === WindowState.Maximized ? ww * 0.5 - albumArtSize.w :
					pref.albumArtAlign === 'left' ? 0 :
					pref.albumArtAlign === 'leftMargin' ? ww / wh > 1.8 ? scaleForDisplay(40) : 0 :
					pref.albumArtAlign === 'center' ? Math.floor(xCenter - 0.5 * albumArtSize.w) :
					pref.albumArtAlign === 'right' ? ww * 0.5 - albumArtSize.w :
					ww * 0.5 - albumArtSize.w :
				Math.floor(xCenter - 0.5 * albumArtSize.w) :
			pref.layout === 'artwork' ? !displayPlaylist || pref.displayLyrics ? ww * 0.5 - albumArtSize.w * 0.5 : ww : 0;

		if (albumScale !== (wh - geo.topMenuHeight - lowerSpace) / albumArt.Height) {
			// Restricted by width
			const y = Math.floor(((wh - geo.lowerBarHeight + geo.topMenuHeight) / 2) - albumArtSize.h / 2);
			albumArtSize.y = Math.min(y, scaleForDisplay(150) + 10);	// 150 or 300 + 10? Not sure where 160 comes from
		} else {
			albumArtSize.y = geo.topMenuHeight;
		}

		if (albumArtScaled) {
			albumArtScaled = null;
		}
		try { // * Prevent crash if album art is corrupt, file format is not supported or has an unusual ICC profile embedded
			// * Avoid weird anti-aliased scaling along border of images, see: https://stackoverflow.com/questions/4772273/interpolationmode-highqualitybicubic-introducing-artefacts-on-edge-of-resized-im
			albumArtScaled = albumArt.Resize(albumArtSize.w, albumArtSize.h, InterpolationMode.Bicubic); // Old method -> albumArtScaled = albumArt.Resize(albumArtSize.w, albumArtSize.h);
			const sg = albumArtScaled.GetGraphics();
			const HQscaled = albumArt.Resize(albumArtSize.w, albumArtSize.h, InterpolationMode.HighQualityBicubic);
			sg.DrawImage(HQscaled, 2, 2, albumArtScaled.Width - 4, albumArtScaled.Height - 4, 2, 2, albumArtScaled.Width - 4, albumArtScaled.Height - 4);
			albumArtScaled.ReleaseGraphics(sg);
		} catch (e) {
			noArtwork = true;
			albumArt = null;
			noAlbumArtStub = true;
			albumArtSize = new ImageSize(0, geo.topMenuHeight, 0, 0);
			console.log('<Error: Album art could not be scaled! Maybe it is corrupt, file format is not supported or has an unusual ICC profile embedded>');
		}
		pauseBtn.setCoords(albumArtSize.x + albumArtSize.w / 2, albumArtSize.y + albumArtSize.h / 2);
		hasArtwork = true;
	}
	else {
		albumArtSize = new ImageSize(0, geo.topMenuHeight, 0, 0);
	}
	if (discArt) {
		const discArtSizeCorr = scaleForDisplay(4);
		const discArtMargin = scaleForDisplay(2);
		const discArtMarginRight = scaleForDisplay(36);
		if (hasArtwork) {
			if (resetDiscArtPosition) {
				discArtSize.x =
					ww - (albumArtSize.x + albumArtSize.w) < albumArtSize.h * pref.discArtDisplayAmount ? Math.floor(ww - albumArtSize.h - discArtMarginRight) :
					pref.discArtDisplayAmount === 1 ? Math.floor(ww - albumArtSize.h - discArtMarginRight) :
					pref.discArtDisplayAmount === 0.5 ? Math.floor(Math.min(ww - albumArtSize.h - discArtMarginRight,
						albumArtSize.x + albumArtSize.w - (albumArtSize.h - 4) * (1 - pref.discArtDisplayAmount) - (pref.discArtDisplayAmount === 1 || pref.discArtDisplayAmount === 0.5 ? 0 : discArtMarginRight))) :
					Math.floor(albumArtSize.x + albumArtSize.w - (albumArtSize.h - discArtSizeCorr) * (1 - pref.discArtDisplayAmount) - discArtMarginRight);

				discArtSize.y = albumArtSize.y + discArtMargin;
				discArtSize.w = albumArtSize.h - discArtSizeCorr; // Disc art must be square so use the height of album art for width of discArt
				discArtSize.h = discArtSize.w;
			} else { // When disc art moves because folder images are different sizes we want to push it outwards, but not move it back in so it jumps around less
				discArtSize.x = Math.max(discArtSize.x, Math.floor(Math.min(ww - albumArtSize.h - discArtMarginRight,
					albumArtSize.x + albumArtSize.w - (albumArtSize.h - 4) * (1 - pref.discArtDisplayAmount) - (pref.discArtDisplayAmount === 1 || pref.discArtDisplayAmount === 0.5 ? 0 : discArtMarginRight))));

				discArtSize.y = discArtSize.y > 0 ? Math.min(discArtSize.y, albumArtSize.y + discArtMargin) : albumArtSize.y + discArtMargin;
				discArtSize.w = Math.max(discArtSize.w, albumArtSize.h - discArtSizeCorr);
				discArtSize.h = discArtSize.w;
				if (discArtSize.x + discArtSize.w > ww) {
					discArtSize.x = ww - discArtSize.w - discArtMarginRight;
				}
			}
		}
		else { // * No album art so we need to calc size of disc
			const discScale = Math.min(((displayPlaylist || displayLibrary) ? 0.5 * ww : 0.75 * ww) / discArt.Width, (wh - geo.topMenuHeight - lowerSpace - scaleForDisplay(16)) / discArt.Height);
			let xCenter = 0;
			if (displayPlaylist || displayLibrary) {
				xCenter = 0.25 * ww;
			} else if (ww / wh < 1.40) { // When using a roughly 4:3 display the album art crowds, so move it slightly off center
				xCenter = 0.56 * ww; // TODO: check if this is still needed?
			} else {
				xCenter = 0.5 * ww;
				artOffCenter = false;
				if (discScale === 0.75 * ww / discArt.Width) {
					xCenter += 0.1 * ww;
					artOffCenter = true; // TODO: We should probably suppress labels in this case
				}
			}
			// Need to -4 from height and add 2 to y to avoid skipping discArt drawing - not sure this is needed
			discArtSize.w = Math.floor(discArt.Width * discScale) - discArtSizeCorr; // Width
			discArtSize.h = discArtSize.w; // height
			discArtSize.x = Math.floor(xCenter - 0.5 * discArtSize.w); // Left
			if (discScale !== (wh - geo.topMenuHeight - lowerSpace - scaleForDisplay(16)) / discArt.Height) {
				// Restricted by width
				const y = geo.topMenuHeight + Math.floor(((wh - geo.topMenuHeight - lowerSpace - scaleForDisplay(16)) / 2) - discArtSize.h / 2);
				discArtSize.y = Math.min(y, 160);
			} else {
				discArtSize.y = geo.topMenuHeight + discArtMargin; // Top
			}
			pauseBtn.setCoords(discArtSize.x + discArtSize.w / 2, discArtSize.y + discArtSize.h / 2);
			hasArtwork = true;
		}
	}
	else {
		discArtSize = new ImageSize(0, 0, 0, 0);
	}
	if (hasArtwork || noAlbumArtStub) {
		if (gLyrics) {
			const fullW = pref.layout === 'default' && pref.lyricsLayout === 'full' && pref.displayLyrics;
			gLyrics.on_size(noAlbumArtStub ? fullW ? ww * 0.333 : 0 : albumArtSize.x, noAlbumArtStub ? geo.topMenuHeight : albumArtSize.y,
				noAlbumArtStub ? pref.layout === 'artwork' ? ww : fullW ? ww * 0.333 : ww * 0.5 : albumArtSize.w, noAlbumArtStub ? wh - geo.topMenuHeight - geo.lowerBarHeight : albumArtSize.h);
		}
		if (discArt && pref.displayDiscArt && !displayPlaylist && !displayLibrary && pref.layout !== 'compact') {
			createDropShadow();
		}
	}
	if ((displayLibrary || displayPlaylist) && pref.layout !== 'artwork') {
		pauseBtn.setCoords(ww * 0.25, wh * 0.5 - geo.topMenuHeight);
	} else {
		pauseBtn.setCoords(ww * 0.5, wh * 0.5 - geo.topMenuHeight);
	}
}


////////////////////////////
// * DISC ART FUNCTIONS * //
////////////////////////////
/** Called when drawing the disc art rotation animation with rotateImg() */
function createRotatedDiscArtImage() { // TODO: Once spinning art is done, scrap this and the rotation amount crap and just use indexes into the discArtArray when needed // IDEA: Smooth rotation to new position?
	if (pref.displayDiscArt && (discArt && discArtSize.w > 0)) { // Drawing discArt rotated is slow, so first draw it rotated into the rotatedDiscArt image, and then draw rotatedDiscArt image unrotated in on_paint
		let tracknum = parseInt(fb.TitleFormat(`$num($if(${tf.vinyl_tracknum},$sub($mul(${tf.vinyl_tracknum},2),1),$if2(%tracknumber%,1)),1)`).Eval()) - 1;
		if (!pref.rotateDiscArt || Number.isNaN(tracknum)) tracknum = 0; // Avoid NaN issues when changing tracks rapidly
		rotatedDiscArt = rotateImg(discArt, discArtSize.w, discArtSize.h, tracknum * pref.rotationAmt);
	}
}


/** Called when drawing the disc art */
function drawDiscArt(gr) {
	if (pref.layout === 'default' && pref.displayDiscArt && discArtSize.y >= albumArtSize.y && discArtSize.h <= albumArtSize.h) {
		const drawDiscProfiler = timings.showExtraDrawTiming ? fb.CreateProfiler('discArt') : null;
		const discArtImg = discArtArray[rotatedDiscArtIndex] || rotatedDiscArt;
		gr.DrawImage(discArtImg, discArtSize.x, discArtSize.y, discArtSize.w, discArtSize.h, 0, 0, discArtImg.Width, discArtImg.Height, 0);
		if (timings.showExtraDrawTiming) drawDiscProfiler.Print();
	}
	// Show full background when displaying the Lyrics panel and lyrics layout is in full width
	if (pref.displayLyrics && pref.lyricsLayout === 'full' && pref.layout === 'default' && !displayLibrary && !displayPlaylist && !displayBiography) {
		gr.FillSolidRect(albumArtSize.x + albumArtSize.w - scaleForDisplay(1), albumArtSize.y, albumArtSize.x + scaleForDisplay(2), albumArtSize.h, col.detailsBg);
	}
}


/** Called for disposing disc art image, i.e when changing or deactivating */
function disposeDiscArtImg(discArtImg) {
	discArtSize = new ImageSize(0, 0, 0, 0);
	discArtImg = null;
	return null;
}


/** Called as a timer with different user set interval values for rotating disc art  */
function setupRotationTimer() {
	clearInterval(discArtRotationTimer);
	if (pref.layout === 'default' && pref.displayDiscArt && discArt && fb.IsPlaying && !fb.IsPaused && pref.spinDiscArt && !displayPlaylist && !displayLibrary && !displayBiography) {
		console.log(`creating ${pref.spinDiscArtImageCount} rotated disc images, shown every ${pref.spinDiscArtRedrawInterval}ms`);
		discArtRotationTimer = setInterval(() => {
			rotatedDiscArtIndex++;
			rotatedDiscArtIndex %= pref.spinDiscArtImageCount;
			if (!discArtArray[rotatedDiscArtIndex] && discArt && discArtSize.w) {
				debugLog(`creating discArtImg: ${rotatedDiscArtIndex} (${discArtSize.w}x${discArtSize.h}) with rotation: ${360 / pref.spinDiscArtImageCount * rotatedDiscArtIndex} degrees`);
				discArtArray[rotatedDiscArtIndex] = rotateImg(discArt, discArtSize.w, discArtSize.h, 360 / pref.spinDiscArtImageCount * rotatedDiscArtIndex);
			}
			const discArtLeftEdge = pref.detailsAlbumArtOpacity !== 255 || pref.detailsAlbumArtDiscAreaOpacity !== 255 || pref.discArtOnTop ? discArtSize.x : albumArtSize.x + albumArtSize.w - 1; // The first line of discArtImg that will be drawn
			window.RepaintRect(discArtLeftEdge, discArtSize.y, discArtSize.w - (discArtLeftEdge - discArtSize.x), discArtSize.h, !pref.discArtOnTop && !pref.displayLyrics);
		}, pref.spinDiscArtRedrawInterval);
	}
}


/////////////////////////
// * CODEC FUNCTIONS * //
/////////////////////////
/** Called when loading codec logo, displayed in the metadata grid in Details */
function loadCodecLogo() {
	const codec = $('$lower($if2(%codec%,$ext(%path%)))');
	const format = $('$lower($ext(%path%))', fb.GetNowPlaying());
	const lightBg = new Color(col.detailsText).brightness < 140;
	const bw = lightBg ? 'black' : 'white';

	paths.codecLogoAac     = `${imagesPath}codec/aac-${bw}.png`;
	paths.codecLogoAc3Dts  = `${imagesPath}codec/ac3_dts-${bw}.png`;
	paths.codecLogoAlac    = `${imagesPath}codec/alac-${bw}.png`;
	paths.codecLogoApe     = `${imagesPath}codec/ape-${bw}.png`;
	paths.codecLogoDsd     = `${imagesPath}codec/dsd-${bw}.png`;
	paths.codecLogoDsdSacd = `${imagesPath}codec/dsd-sacd-${bw}.png`;
	paths.codecLogoDxd     = `${imagesPath}codec/dxd-${bw}.png`;
	paths.codecLogoFlac    = `${imagesPath}codec/flac-${bw}.png`;
	paths.codecLogoMp3     = `${imagesPath}codec/mp3-${bw}.png`;
	paths.codecLogoMpc     = `${imagesPath}codec/musepack-${bw}.png`;
	paths.codecLogoOgg     = `${imagesPath}codec/ogg-${bw}.png`;
	paths.codecLogoOpus    = `${imagesPath}codec/opus-${bw}.png`;
	paths.codecLogoPcm     = `${imagesPath}codec/pcm-${bw}.png`;
	paths.codecLogoPcmAiff = `${imagesPath}codec/pcm-aiff-${bw}.png`;
	paths.codecLogoPcmWav  = `${imagesPath}codec/pcm-wav-${bw}.png`;
	paths.codecLogoWavpack = `${imagesPath}codec/wavpack-${bw}.png`;

	switch (true) {
		case codec === 'aac'             || format === 'aac':  codecLogo = gdi.Image(paths.codecLogoAac); break;
		case codec === 'ac3'             || format === 'ac3':
		case codec === 'dts'             || format === 'dts':  codecLogo = gdi.Image(paths.codecLogoAc3Dts); break;
		case codec === 'alac'            || format === 'alac': codecLogo = gdi.Image(paths.codecLogoAlac); break;
		case codec === 'monkey\'s audio' || format === 'ape':  codecLogo = gdi.Image(paths.codecLogoApe); break;
		case codec === 'flac'            || format === 'flac': codecLogo = gdi.Image(paths.codecLogoFlac); break;
		case codec === 'mp3'             || format === 'mp3':  codecLogo = gdi.Image(paths.codecLogoMp3); break;
		case codec === 'musepack'        || format === 'mpc':  codecLogo = gdi.Image(paths.codecLogoMpc); break;
		case codec === 'vorbis'          || format === 'ogg':  codecLogo = gdi.Image(paths.codecLogoOgg); break;
		case codec === 'opus'            || format === 'opus': codecLogo = gdi.Image(paths.codecLogoOpus); break;
		case codec === 'wavpack'         || format === 'wv':   codecLogo = gdi.Image(paths.codecLogoWavpack); break;

		case ['dsd64', 'dsd128', 'dsd256', 'dsd512', 'dsd1024', 'dsd2048'].includes(codec):
			codecLogo = gdi.Image(paths.codecLogoDsd); break;
		case ['dxd64', 'dxd128', 'dxd256', 'dxd512', 'dxd1024', 'dxd2048'].includes(codec):
			codecLogo = gdi.Image(paths.codecLogoDxd); break;
		case ['dst64', 'dst128', 'dst256', 'dst512', 'dst1024', 'dst2048'].includes(codec) && format === 'iso':
			codecLogo = gdi.Image(paths.codecLogoDsdSacd); break;

		case codec === 'pcm' && !['aiff', 'w64', 'wav'].includes(format):
			codecLogo = gdi.Image(paths.codecLogoPcm); break;
		case codec === 'pcm' && format === 'aiff':
			codecLogo = gdi.Image(paths.codecLogoPcmAiff); break;
		case codec === 'pcm' && ['w64', 'wav'].includes(format):
			codecLogo = gdi.Image(paths.codecLogoPcmWav); break;
	}
}


////////////////////////
// * FLAG FUNCTIONS * //
////////////////////////
/** Called when loading country flags read from tags, displayed in the lower bar and Details */
function loadCountryFlags() {
	flagImgs = [];
	getMetaValues(tf.artist_country).forEach(country => {
		const flagImage = loadFlagImage(country);
		flagImage && flagImgs.push(flagImage);
	});
}


/** Called when loading flag images from directory */
function loadFlagImage(country) {
	const countryName = convertIsoCountryCodeToFull(country) || country;	// In case we have a 2-digit country code
	const path = `${$(paths.flagsBase) + (is_4k ? '64\\' : '32\\') + countryName.trim().replace(/ /g, '-')}.png`;
	return gdi.Image(path);
}


/** Called when loading release country flags read from tags, displayed in Details */
function loadReleaseCountryFlag() {
	releaseFlagImg = loadFlagImage($(tf.releaseCountry));
}


/////////////////////////
// * LABEL FUNCTIONS * //
/////////////////////////
/** Called when loading label images in Details */
function loadLabelImage(publisherString) {
	let recordLabel = null;
	const d = new Date();
	let labelStr = replaceFileChars(publisherString);
	if (labelStr) {
		// * First check for record label folder
		const lastSrchYear = d.getFullYear();
		let dir = paths.labelsBase; // Also used below
		if (IsFolder(dir + labelStr) ||
			IsFolder(dir + (labelStr = labelStr.replace(/ Records$/, '')
					.replace(/ Recordings$/, '')
					.replace(/ Music$/, '')
					.replace(/\.$/, '')
					.replace(/[\u2010\u2013\u2014]/g, '-')))) { // Hyphen, endash, emdash
			let year = parseInt($('$year(%date%)'));
			for (; year <= lastSrchYear; year++) {
				const yearFolder = `${dir + labelStr}\\${year}`;
				if (IsFolder(yearFolder)) {
					console.log(`Found folder for ${labelStr} for year ${year}.`);
					dir += `${labelStr}\\${year}\\`;
					break;
				}
			}
			if (year > lastSrchYear) {
				dir += `${labelStr}\\`; // We didn't find a year folder so use the "default" logo in the root
				console.log(`Found folder for ${labelStr} and using latest logo.`);
			}
		}
		// * Actually load the label from either the directory we found above, or the base record label folder
		labelStr = replaceFileChars(publisherString); // We need to start over with the original string when searching for the file, just to be safe
		let label = `${dir + labelStr}.png`;
		if (IsFile(label)) {
			recordLabel = gdi.Image(label);
			console.log('Found Record label:', label, !recordLabel ? '<COULD NOT LOAD>' : '');
		} else {
			labelStr = labelStr.replace(/ Records$/, '')
			.replace(/ Recordings$/, '')
			.replace(/ Music$/, '')
			.replace(/[\u2010\u2013\u2014]/g, '-'); // Hyphen, endash, emdash
			label = `${dir + labelStr}.png`;
			if (IsFile(label)) {
				recordLabel = gdi.Image(label);
			} else {
				label = `${dir + labelStr} Records.png`;
				if (IsFile(label)) {
					recordLabel = gdi.Image(label);
				}
			}
		}
	}
	return recordLabel;
}


/////////////////////////////////
// * USER ACTIVITY FUNCTIONS * //
/////////////////////////////////
/** Called when using letter keystrokes from keyboard */
function on_char(code) {
	if (displayCustomThemeMenu || displayMetadataGridMenu) {
		customMenu.on_char(code);
	}
	else if (displayPlaylist && !displayLibrary || !displayPlaylist && !displayLibrary || displayPlaylistLibrary(true)) {
		trace_call && console.log('Playlist => on_char');
		jumpSearch.on_char(code);

		// Switch back to Playlist
		if (pref.layout === 'default' && !displayPlaylist && !displayLibrary) {
			btns.details.onClick();
		}
		else if (pref.layout === 'artwork' && !displayPlaylistArtworkLayout && !displayLibrary) {
			btns.playlistArtworkLayout.onClick();
		}
	}
	else if (displayLibrary) {
		trace_call && console.log('Library => on_char');
		library.on_char(code);
	}
}


/** Called when mouse with content enters another window and determines if that window is a valid drop target, 1. fires first */
function on_drag_enter(action, x, y, mask) {
	if (displayPlaylist || displayPlaylistArtworkLayout) {
		trace_call && console.log('Playlist => on_drag_enter');
		playlist.on_drag_enter(action, x, y, mask);
	}
}


/** Called when content with mouse moves but stays within the same window, 2. fires after on_drag_enter */
function on_drag_over(action, x, y, mask) {
	if (displayPlaylist || displayPlaylistArtworkLayout) {
		trace_call && console.log('Playlist => on_drag_over');
		playlist.on_drag_over(action, x, y, mask);
	}
}


/** Called when mouse with content is being dragged outside of window, 3. fires after on_drag_over */
function on_drag_leave() {
	if (displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) {
		trace_call && console.log('Playlist => on_drag_leave');
		playlist.on_drag_leave();
	}
}


/** Called when mouse with content is being dropped, 4. fires after on_drag_over */
function on_drag_drop(action, x, y, mask) {
	if (displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) {
		trace_call && console.log('Playlist => on_drag_drop');
		playlist.on_drag_drop(action, x, y, mask);
	}
}


/** Called when the panel gets or loses focus */
function on_focus(is_focused) {
	if (displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) {
		trace_call && console.log('Playlist => on_focus');
		playlist.on_focus(is_focused);
	}
	else if (displayLibrary) {
		trace_call && console.log('Library => on_focus');
		library.on_focus(is_focused);
	}
	if (displayBiography) {
		trace_call && console.log('Biography => on_focus');
		biography.on_focus(is_focused);
	}
	if (is_focused) {
		plman.SetActivePlaylistContext(); // When the panel gets focus but not on every click.
	} else {
		clearTimeout(hideCursorTimeout); // Not sure this is required, but I think the mouse was occasionally disappearing
	}
}


/** Called when focused item in playlist has been changed */
function on_item_focus_change(playlist_arg, from, to) {
	if (displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) {
		trace_call && console.log('Playlist => on_item_focus_change');
		playlist.on_item_focus_change(playlist_arg, from, to);
	}
	else if (displayLibrary) {
		trace_call && console.log('Library => on_item_focus_change');
		library.on_item_focus_change();
	}
	if (displayBiography) {
		trace_call && console.log('Biography => on_item_focus_change');
		biography.on_item_focus_change();
	}
}


/** Called when pressing down keyboard keys */
function on_key_down(vkey) {
	const CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
	const ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);

	if (displayCustomThemeMenu || displayMetadataGridMenu) {
		customMenu.on_key_down(vkey);
	}
	else {
		if (displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) {
			trace_call && console.log('Playlist => on_key_down');

			if (key_down_suppress.is_supressed(vkey)) {
				return;
			}

			playlist.on_key_down(vkey);
		}
		else if (displayLibrary) {
			trace_call && console.log('Library => on_key_down');
			library.on_key_down(vkey);
		}
		if (displayBiography) {
			trace_call && console.log('Biography => on_key_down');
			biography.on_key_down(vkey);
		}
	}

	switch (vkey) {
		case 0x6B: // VK_ADD ??
		case 0x6D: // VK_SUBTRACT ??
		if (CtrlKeyPressed && ShiftKeyPressed) {
			const action = vkey === 0x6B ? '+' : '-';
			const metadb = fb.GetNowPlaying();
			if (fb.IsPlaying) {
				fb.RunContextCommandWithMetadb(`Playback Statistics/Rating/${action}`, metadb);
			}
			else if (!metadb && (displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true))) {
				const metadbList = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
				if (metadbList.Count === 1) {
					fb.RunContextCommandWithMetadb(`Playback Statistics/Rating/${action}`, metadbList[0]);
				} else {
					console.log('Won\'t change rating with more than one selected item');
				}
			}
		}
		break;
	}

	// * F11 shortcut for going into/out fullscreen mode, disabled in Artwork layout
	if (utils.IsKeyPressed(VK_F11)) {
		UIHacks.MainWindowState === WindowState.Normal ? UIHacks.FullScreen = true : UIHacks.MainWindowState = WindowState.Normal;
	}
	// * ESC also exits fullscreen mode
	else if (utils.IsKeyPressed(VK_ESCAPE) && UIHacks.FullScreen) {
		UIHacks.MainWindowState = WindowState.Normal;
	}
}


/** Called when releasing keyboard keys from pressed state */
function on_key_up(vkey) {
	if (displayLibrary) {
		trace_call && console.log('Library => on_key_up');
		library.on_key_up(vkey);
	}
	else if (displayBiography) {
		trace_call && console.log('Biography => on_key_up');
		biography.on_key_up(vkey);
	}
}


/** Called when adding new songs to the media library index */
function on_library_items_added(handle_list) {
	if (displayLibrary) {
		trace_call && console.log('Library => on_library_items_added');
		library.on_library_items_added(handle_list);
	}
	else if (displayBiography) {
		trace_call && console.log('Biography => on_library_items_added');
		biography.on_library_items_added(handle_list);
	}
}


/** Called when media library is being changed, i.e updated by removing/adding tracks */
function on_library_items_changed(handle_list) {
	if (displayLibrary) {
		trace_call && console.log('Library => on_library_items_changed');
		library.on_library_items_changed(handle_list);
	}
	else if (displayBiography) {
		trace_call && console.log('Biography => on_library_items_changed');
		biography.on_library_items_changed(handle_list);
	}
}


/** Called when removing songs from the media library index */
function on_library_items_removed(handle_list) {
	if (displayLibrary) {
		trace_call && console.log('Library => on_library_items_removed');
		library.on_library_items_removed(handle_list);
	}
	else if (displayBiography) {
		trace_call && console.log('Biography => on_library_items_removed');
		biography.on_library_items_removed(handle_list);
	}
}


/**
 * Called when playing a new track
 * @param {FbMetadbHandle} metadb
 */
function on_playback_new_track(metadb) {
	if (!metadb) return;	// Solve weird corner case
	const newTrackProfiler = timings.showDebugTiming ? fb.CreateProfiler('on_playback_new_track') : null;
	debugLog('in on_playback_new_track()');
	lastLeftEdge = 0;
	newTrackFetchingArtwork = true;
	newTrackFetchingDone = false;
	themeColorSet = true;
	initThemeFull = false;
	updateTimezoneOffset();
	isPlayingCD = metadb ? metadb.RawPath.startsWith('cdda://') : false;
	isStreaming = metadb ? metadb.RawPath.startsWith('http://') : false;
	currentFolder = !isStreaming ? metadb.Path.substring(0, metadb.Path.lastIndexOf('\\')) : '';

	setProgressBarRefresh();

	if (pref.themeDayNightMode && (pref.theme === 'white' || pref.theme === 'black')) {
		themeDayNightModeTimer = setInterval(() => {
			themeDayNightMode(new Date());
			initTheme();
			debugLog('initTheme -> fetchNewArtwork -> on_playback_new_track -> themeDayNightModeTimer');
		}, 600000);
	}

	if (albumArtTimeout) {
		clearTimeout(albumArtTimeout);
		albumArtTimeout = 0;
	}

	str.timeline = new Timeline(geo.timelineHeight);
	str.metadata_grid_tt = new MetadataGridTooltip(geo.metadataGridTooltipHeight);
	str.lowerBar_tt = new LowerBarTooltip();

	// * Fetch new albumArt
	if ((pref.cycleArt && albumArtIndex !== 0) || isStreaming || embeddedArt || currentFolder !== lastFolder ||	albumArt == null ||
		$('%album%') !== lastAlbum || $('$if2(%discnumber%,0)') !== lastDiscNumber || $(`$if2(${tf.vinyl_side},ZZ)`) !== lastVinylSide) {
		clearPlaylistNowPlayingBg();
		fetchNewArtwork(metadb);
		// * Pick a new random theme preset on new album
		if ((pref.presetAutoRandomMode === 'album' || pref.presetSelectMode === 'harmonic') && !doubleClicked) themePresetRandomPicker();
	}
	else if (pref.cycleArt && albumArtList.length > 1) {
		// Need to do this here since we're no longer always fetching when albumArtList.length > 1
		albumArtTimeout = setTimeout(() => {
			displayNextImage();
		}, settings.artworkDisplayTime * 1000);
	}
	if (discArt) {
		setupRotationTimer();
	}
	if (pref.rotateDiscArt && !pref.spinDiscArt) {
		createRotatedDiscArtImage(); // We need to always setup the rotated image because it rotates on every track
	}

	// * Code to retrieve record label logos
	let labelStrings = [];
	recordLabels = [];	// Will free memory from earlier loaded record label images
	recordLabelsInverted = [];
	for (let i = 0; i < tf.labels.length; i++) {
		labelStrings.push(...getMetaValues(tf.labels[i], metadb));
	}
	labelStrings = [...new Set(labelStrings)];
	for (let i = 0; i < labelStrings.length; i++) {
		const addLabel = loadLabelImage(labelStrings[i]);
		if (addLabel != null) {
			recordLabels.push(addLabel);
			try {
				recordLabelsInverted.push(addLabel.InvertColours());
			} catch (e) {}
		}
	}

	function testArtistLogo(artistStr) {
		// See if artist logo exists at various paths
		const testBandLogoPath = (imgDir, name) => {
			if (name) {
				const logoPath = `${imgDir + name}.png`;
				if (IsFile(logoPath)) {
					console.log(`Found band logo: ${logoPath}`);
					return logoPath;
				}
			}
			return false;
		};

		return testBandLogoPath(paths.artistlogos, artistStr) || // Try 800x310 white
			testBandLogoPath(paths.artistlogosColor, artistStr); // Try 800x310 color
	}

	// * Code to retrieve band logo
	let tryArtistList = [
		...getMetaValues('%album artist%').map(artist => replaceFileChars(artist)),
		...getMetaValues('%album artist%').map(artist => replaceFileChars(artist).replace(/^[Tt]he /, '')),
		replaceFileChars($('[%track artist%]')),
		...getMetaValues('%artist%').map(artist => replaceFileChars(artist)),
		...getMetaValues('%artist%').map(artist => replaceFileChars(artist).replace(/^[Tt]he /, ''))
	];
	tryArtistList = [...new Set(tryArtistList)];

	bandLogo = null;
	invertedBandLogo = null;
	let path;
	tryArtistList.some(artistString => {
		path = testArtistLogo(artistString);
		return path;
	});
	if (path) {
		bandLogo = artCache.getImage(path);
		if (!bandLogo) {
			const logo = gdi.Image(path);
			if (logo) {
				bandLogo = artCache.encache(logo, path);
				invertedBandLogo = artCache.encache(logo.InvertColours(), `${path}-inv`);
			}
		}
		invertedBandLogo = artCache.getImage(`${path}-inv`);
		if (!invertedBandLogo && bandLogo) {
			invertedBandLogo = artCache.encache(bandLogo.InvertColours(), `${path}-inv`);
		}
	}

	lastFolder = currentFolder; // For art caching purposes
	lastAlbum = $('%album%'); // For art caching purposes
	lastDiscNumber = $('$if2(%discnumber%,0)'); // For art caching purposes
	lastVinylSide = $(`$if2(${tf.vinyl_side},ZZ)`);
	currentLastPlayed = $(tf.last_played);
	playingPlaylist = pref.showGridPlayingPlaylist ? $(tf.playing_playlist = plman.GetPlaylistName(plman.PlayingPlaylist)) : '';

	if (fb.GetNowPlaying()) {
		on_metadb_changed(); // Refresh panel
	}

	on_playback_time();
	progressBar.progressLength = 0;
	peakmeterBar.progressLength = 0;
	waveformBar.on_playback_new_track_queue(metadb);
	peakmeterBar.on_playback_new_track(metadb);

	if (displayPlaylist || displayPlaylistArtworkLayout || !displayPlaylist) {
		playlist.on_playback_new_track(metadb);
	}
	if (displayLibrary) {
		library.on_playback_new_track(metadb);
	}
	if (displayBiography) {
		biography.on_playback_new_track();
	}

	if (pref.displayLyrics) { // No need to try retrieving them if we aren't going to display them now
		initLyrics();
	}
	// * Pick a new random theme preset on new track
	if (pref.presetAutoRandomMode === 'track' && !doubleClicked) themePresetRandomPicker();

	// * Generate a new color in Random theme on new track
	if (pref.styleRandomAutoColor === 'track' && !doubleClicked) randomThemeAutoColor();

	// * Load finished, Playlist auto-scroll is ready
	newTrackFetchingDone = true;

	if (timings.showDebugTiming) newTrackProfiler.Print();

	if (timings.showRamUsage) {
		console.log(
		'\n' +
		'Ram usage for current panel:', `${(window.JsMemoryStats.MemoryUsage / 1024 ** 2).toFixed()} MB\n` +
		'Ram usage for all panels:', `${(window.JsMemoryStats.TotalMemoryUsage / 1024 ** 2).toFixed()} MB\n` +
		'Ram usage limit:', `${(window.JsMemoryStats.TotalMemoryLimit / 1024 ** 2).toFixed()} MB\n` +
		'\n');
	}
}


/**
 * Called when metadb contents change, i.e tag or database updates
 * @param {FbMetadbHandleList=} handle_list Can be undefined when called manually from on_playback_new_track
 * @param {boolean=} fromhook
 */
function on_metadb_changed(handle_list, fromhook) {
	console.log(`on_metadb_changed(): ${handle_list ? handle_list.Count : '0'} handles, fromhook: ${fromhook}`);
	if (fb.IsPlaying) {
		let nowPlayingUpdated = !handle_list; // If we don't have a handle_list we called this manually from on_playback_new_track
		const metadb = fb.GetNowPlaying();

		if (metadb && handle_list) {
			for (let i = 0; i < handle_list.Count; i++) {
				if (metadb.RawPath === handle_list[i].RawPath) {
					nowPlayingUpdated = true;
					break;
				}
			}
		}

		if (nowPlayingUpdated) {
			// * The handle_list contains the currently playing song so update
			const title = $(tf.title);
			const artist = $(tf.artist);
			const composer = $(tf.composer);
			const originalArtist = $(tf.original_artist);
			let tracknum = '';
			tracknum = pref.showVinylNums ? $(tf.vinyl_track) : $(tf.tracknum);

			str.tracknum = tracknum.trim();
			str.title = title + originalArtist;
			str.title_lower = title;
			str.original_artist = originalArtist;
			str.artist = artist;
			str.composer = composer;
			str.year = $(tf.year);
			if (str.year === '0000') {
				str.year = '';
			}
			str.album = $(`[%album%][ '['${tf.album_translation}']']`);
			str.album_subtitle = $(`[ '['${tf.album_subtitle}']']`);
			let codec = $('$lower($if2(%codec%,$ext(%path%)))');
			if (codec === 'dca (dts coherent acoustics)') {
				codec = 'dts';
			}
			if (codec === 'cue') {
				codec = $('$ext($info(referenced_file))');
			}
			else if (codec === 'mpc') {
				codec = `${codec}-${$('$info(codec_profile)').replace('quality ', 'q')}`;
			}
			else if (['dts', 'ac3', 'atsc a/52'].includes(codec)) {
				codec += `${$("[ $replace($replace($replace($info(channel_mode), + LFE,),' front, ','/'),' rear surround channels',$if($strstr($info(channel_mode),' + LFE'),.1,.0))] %bitrate%")} kbps`;
				codec = codec.replace('atsc a/52', 'Dolby Digital');
			}
			else if ($('$info(encoding)') === 'lossy') {
				codec = $('$info(codec_profile)') === 'CBR' ? `${codec}-${$('%bitrate%')} kbps` : `${codec}-${$('$info(codec_profile)')}`;
			}
			str.trackInfo = $(codec + settings.extraTrackInfo);
			// TODO: Add LUFS option?
			// str.trackInfo += $('$if(%replaygain_track_gain%, | LUFS $puts(l,$sub(-1800,$replace(%replaygain_track_gain%,.,)))$div($get(l),100).$right($get(l),2) dB,)');

			str.disc = fb.TitleFormat(tf.disc).Eval();

			const h = Math.floor(fb.PlaybackLength / 3600);
			const m = Math.floor(fb.PlaybackLength % 3600 / 60);
			const s = Math.floor(fb.PlaybackLength % 60);
			str.length = `${h > 0 ? `${h}:${m < 10 ? '0' : ''}${m}` : m}:${s < 10 ? '0' : ''}${s}`;

			const lastfmCount = $('%lastfm_play_count%');
			playCountVerifiedByLastFm = lastfmCount !== '0' && lastfmCount !== '?';

			const lastPlayed = $(tf.last_played);
			if (str.timeline) { // TODO: figure out why this is null for foo_input_spotify
				str.timeline.setColors(col.timelineAdded, col.timelinePlayed, col.timelineUnplayed);
				// No need to call calcDateRatios if str.timeline is undefined
				calcDateRatios($date(currentLastPlayed) !== $date(lastPlayed), currentLastPlayed); // lastPlayed has probably changed and we want to update the date bar
			}
			if (lastPlayed.length) {
				const today = dateToYMD(new Date());
				if (!currentLastPlayed.length || $date(lastPlayed) !== today) {
					currentLastPlayed = lastPlayed;
				}
			}

			updateMetadataGrid(currentLastPlayed, playingPlaylist);

			const showGridArtistFlags     = pref.layout === 'artwork' ? pref.showGridArtistFlags_artwork     : pref.showGridArtistFlags_default;
			const showGridReleaseFlags    = pref.layout === 'artwork' ? pref.showGridReleaseFlags_artwork    : pref.showGridReleaseFlags_default;
			const showLowerBarArtistFlags = pref.layout === 'compact' ? pref.showLowerBarArtistFlags_compact : pref.layout === 'artwork' ? pref.showLowerBarArtistFlags_artwork : pref.showLowerBarArtistFlags_default;

			if (showGridArtistFlags || showLowerBarArtistFlags) {
				loadCountryFlags();
			}
			if (showGridReleaseFlags) {
				loadReleaseCountryFlag();
			}
		}
	}
	// * Not called manually from on_playback_new_track
	if (handle_list) {
		if (displayPlaylist || displayPlaylistArtworkLayout || !displayPlaylist) {
			trace_call && console.log('Playlist => on_metadb_changed');
			playlist.on_metadb_changed(handle_list, fromhook);
		}
		if (displayLibrary) {
			trace_call && console.log('Library => on_metadb_changed');
			library.on_metadb_changed(handle_list, fromhook);
		}
		if (displayBiography) {
			trace_call && console.log('Biography => on_metadb_changed');
			biography.on_metadb_changed(handle_list, fromhook);
		}
	}
	repaintWindow();
}


/** Called when double clicking the left mouse button */
function on_mouse_lbtn_dblclk(x, y, m) {
	if ((displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) && playlist.mouse_in_this(x, y)) {
		trace_call && console.log('Playlist => on_mouse_lbtn_dblclk');
		if (displayCustomThemeMenu && pref.displayLyrics) return;
		playlist.on_mouse_lbtn_dblclk(x, y, m);
	}
	else if (displayLibrary && library.mouse_in_this(x, y)) {
		trace_call && console.log('Library => on_mouse_lbtn_dblclk');
		library.on_mouse_lbtn_dblclk(x, y, m);
	}
	else if (displayBiography && biography.mouse_in_this(x, y)) {
		trace_call && console.log('Biography => on_mouse_lbtn_dblclk');
		biography.on_mouse_lbtn_dblclk(x, y, m);
	}
	else if (!displayCustomThemeMenu && !displayMetadataGridMenu || displayCustomThemeMenu && y < geo.topMenuHeight && y > wh - geo.topMenuHeight - geo.lowerBarHeight) {
		if (presetIndicatorTimer) {
			clearTimeout(presetIndicatorTimer);
			presetIndicatorTimer = null;
		}
		doubleClicked = true;
		if (fb.IsPlaying && !mouseInControl && (state.mouse_x > 0 && state.mouse_x && state.mouse_y > wh - scaleForDisplay(120) && state.mouse_y)) {
			// * Pick a new random theme preset
			if (pref.presetAutoRandomMode === 'dblclick') {
				themePresetRandomPicker();
			}
			// * Generate a new color in Random theme
			else if (pref.theme === 'random') {
				initTheme();
				debugLog('initTheme -> on_mouse_lbtn_dblclk -> random theme');
			}
			// * Refresh theme
			else if (settings.doubleClickRefresh) {
				albumArt = null;
				artCache.clear();
				discArtArray = [];
				discArt = null;
				repaintWindow();
				on_playback_new_track(fb.GetNowPlaying());
			}
		}
	}
}


/** Called when left mouse button is pressed */
function on_mouse_lbtn_down(x, y, m) {
	const showProgressBar = pref.layout === 'compact' ? pref.showProgressBar_compact : pref.layout === 'artwork' ? pref.showProgressBar_artwork : pref.showProgressBar_default;
	window.SetCursor(32512); // Arrow

	topMenu.on_mouse_lbtn_down(x, y, m);

	if (pref.seekbar === 'progressbar' && progressBar.mouseInThis(x, y)) {
		progressBar.on_mouse_lbtn_down(x, y);
	}
	else if (pref.seekbar === 'peakmeterbar' && peakmeterBar.mouseInThis(x, y)) {
		peakmeterBar.on_mouse_lbtn_down(x, y);
	}
	else if (!volumeBtn.on_mouse_lbtn_down(x, y, m)) {
		// Not handled by volumeBtn

		// * Clicking on progress bar
		if (showProgressBar && y >= wh - 0.5 * geo.lowerBarHeight && y <= wh - 0.5 * geo.lowerBarHeight + geo.progBarHeight - scaleForDisplay(20) && x >= 0.025 * ww && x < 0.975 * ww) {
			let v = (x - 0.025 * ww) / (0.95 * ww);
			v = (v < 0) ? 0 : (v < 1) ? v : 1;
			if (fb.PlaybackTime !== v * fb.PlaybackLength) fb.PlaybackTime = v * fb.PlaybackLength;
			window.RepaintRect(0, wh - geo.lowerBarHeight, ww, geo.lowerBarHeight);
		}

		if (displayCustomThemeMenu || displayMetadataGridMenu) {
			customMenu.on_mouse_lbtn_down(x, y, m);
		}

		if (updateHyperlink && !fb.IsPlaying && updateHyperlink.trace(x, y)) {
			updateHyperlink.click();
		}

		if ((displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) && playlist.mouse_in_this(x, y)) {
			trace_call && console.log('Playlist => on_mouse_lbtn_down');
			if (displayCustomThemeMenu && displayBiography) return;
			playlist.on_mouse_lbtn_down(x, y, m);
		}
		else if (displayLibrary && library.mouse_in_this(x, y)) {
			trace_call && console.log('Library => on_mouse_lbtn_down');
			library.on_mouse_lbtn_down(x, y, m);
		}
		if (displayBiography && biography.mouse_in_this(x, y)) {
			trace_call && console.log('Biography => on_mouse_lbtn_down');
			biography.on_mouse_lbtn_down(x, y, m);
		}

		// * Clicking on album art
		else if (pref.layout === 'default' && albumArt && (displayPlaylist && !displayLibrary && !displayBiography && pref.playlistLayout !== 'full' ||
			!displayPlaylist && !displayLibrary && !displayBiography || displayLibrary && pref.libraryLayout === 'normal' && pref.libraryDesign !== 'flowMode') ||
			pref.layout === 'artwork' && !displayPlaylistArtworkLayout && !displayLibrary && !displayBiography) {

			// Do not pause when playlist/library layout is in full width or library's flow mode
			if ((!displayCustomThemeMenu && !displayMetadataGridMenu) && (albumArtSize.x <= x && albumArtSize.y <= y && albumArtSize.x + albumArtSize.w >= x && albumArtSize.y + albumArtSize.h >= y) ||
				(discArt && !albumArt && discArtSize.x <= x && discArtSize.y <= y && discArtSize.x + discArtSize.w >= x && discArtSize.y + discArtSize.h >= y)) {
				fb.PlayOrPause();
			}
		}
		// * When noAlbumArtStub, isStreaming, isPlayingCD
		else if (pref.layout === 'default' && !albumArt && (displayPlaylist && !displayLibrary && !displayBiography && pref.playlistLayout !== 'full' ||
			!displayPlaylist && !displayLibrary && !displayBiography || displayLibrary && pref.libraryLayout === 'normal' && pref.libraryDesign !== 'flowMode') ||
			pref.layout === 'artwork' && !displayPlaylistArtworkLayout && !displayLibrary && !displayBiography) {

			// Do not pause when playlist/library layout is in full width or library's flow mode
			if ((!displayCustomThemeMenu && !displayMetadataGridMenu) && state.mouse_x > 0 && state.mouse_x <= (displayPlaylist || displayLibrary ? ww * 0.5 : !displayPlaylist || !displayLibrary ? ww :  ww * 0.5) &&
				state.mouse_y > albumArtSize.y && state.mouse_y <= albumArtSize.h + geo.topMenuHeight) {
				fb.PlayOrPause();
			}
		}
	}
}


/** Called when left mouse button is released from pressed state */
function on_mouse_lbtn_up(x, y, m) {
	topMenu.on_mouse_lbtn_up(x, y, m);

	if (pref.seekbar === 'progressbar') {
		progressBar.on_mouse_lbtn_up(x, y);
	} else if (pref.seekbar === 'peakmeterbar') {
		peakmeterBar.on_mouse_lbtn_up(x, y);
	} else if (pref.seekbar === 'waveformbar') {
		waveformBar.on_mouse_lbtn_up(x, y, m);
	}

	if (displayCustomThemeMenu || displayMetadataGridMenu) {
		customMenu.on_mouse_lbtn_up(x, y, m);
	}

	if (!volumeBtn.on_mouse_lbtn_up(x, y, m)) {
		// Not handled by volumeBtn
		if (displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) { // && playlist.mouse_in_this(x, y)) {
			trace_call && console.log('Playlist => on_mouse_lbtn_up');
			if (displayCustomThemeMenu && displayBiography) return;
			playlist.on_mouse_lbtn_up(x, y, m);

			if (!pref.lockPlayerSize) qwr_utils.EnableSizing(m);
		}
		else if (displayLibrary) { // && library.mouse_in_this(x, y)) {
			trace_call && console.log('Library => on_mouse_lbtn_up');
			library.on_mouse_lbtn_up(x, y, m);
		}
		if (displayBiography && state.mouse_x > uiBio.x && state.mouse_x <= uiBio.x + uiBio.w &&
			state.mouse_y > uiBio.y && state.mouse_y <= uiBio.y + uiBio.h) {
			trace_call && console.log('Biography => on_mouse_lbtn_up');
			biography.on_mouse_lbtn_up(x, y, m);
		}

		if (doubleClicked) {
			doubleClicked = false; // You just did a double-click, so do nothing
		}

		on_mouse_move(x, y);
	}
}


/** Called when mouse leaves the window */
function on_mouse_leave() {
	const showVolumeBtn = pref.layout === 'compact' ? pref.showVolumeBtn_compact : pref.layout === 'artwork' ? pref.showVolumeBtn_artwork : pref.showVolumeBtn_default;

	if (showVolumeBtn && volumeBtn) {
		volumeBtn.on_mouse_leave();
	}
	if (displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) {
		playlist.on_mouse_leave();
	}
	else if (displayLibrary) {
		library.on_mouse_leave();
	}
	if (displayBiography) {
		biography.on_mouse_leave();
	}
}


/** Called when middle mouse (wheel) button is double clicked */
function on_mouse_mbtn_dblclk(x, y, m) {
	if (displayLibrary) {
		library.on_mouse_mbtn_dblclk(x, y, m);
	}
}


/** Called when middle mouse (wheel) button is pressed */
function on_mouse_mbtn_down(x, y, m) {
	if (displayLibrary) {
		library.on_mouse_mbtn_down(x, y, m);
	}
}


/** Called when middle mouse (wheel) button is released from pressed state */
function on_mouse_mbtn_up(x, y, m) {
	if (displayLibrary) {
		library.on_mouse_mbtn_up(x, y, m);
	}
	else if (displayBiography) {
		biography.on_mouse_mbtn_up(x, y, m);
	}
}


/** Called when mouse moves in the panel */
function on_mouse_move(x, y, m) {
	const showGridTimeline      = pref.layout === 'artwork' ? pref.showGridTimeline_artwork      : pref.showGridTimeline_default;
	const showTransportControls = pref.layout === 'compact' ? pref.showTransportControls_compact : pref.layout === 'artwork' ? pref.showTransportControls_artwork : pref.showTransportControls_default;
	const showVolumeBtn         = pref.layout === 'compact' ? pref.showVolumeBtn_compact         : pref.layout === 'artwork' ? pref.showVolumeBtn_artwork         : pref.showVolumeBtn_default;
	const librarySearchBox      = !but.Dn && y > ui.y && y < ui.y + panel.search.h && ppt.searchShow && x > ui.x + but.q.h + but.margin && x < panel.search.x + panel.search.w;

	if (x !== state.mouse_x || y !== state.mouse_y) {
		if (!librarySearchBox) window.SetCursor(32512); // Arrow
		topMenu.on_mouse_move(x, y, m);
		if (pref.seekbar === 'progressbar') {
			progressBar.on_mouse_move(x, y);
		} else if (pref.seekbar === 'peakmeterbar') {
			peakmeterBar.on_mouse_move(x, y, m);
		} else if (pref.seekbar === 'waveformbar') {
			waveformBar.on_mouse_move(x, y, m);
		}

		state.mouse_x = x;
		state.mouse_y = y;

		// * Top menu compact - collapse top menu to compact when mouse is out of top menu area
		if (pref.topMenuCompact && !pref.showTopMenuCompact && state.mouse_y > geo.topMenuHeight * 2) { // Start collapse
			pref.showTopMenuCompact = true;
			setTimeout(() => {
				onTopMenuCompact(x, y, true);
				topMenuCompactExpanded = false;
			}, 2000);
		}
		else if (pref.topMenuCompact && pref.showTopMenuCompact && state.mouse_y < geo.topMenuHeight * 2) { // Cancel collapse
			topMenuCompactExpanded = true;
		}

		if (settings.hideCursor && fb.IsPlaying) {
			clearTimeout(hideCursorTimeout);
			hideCursorTimeout = setTimeout(() => {
				// * If there's a menu id (i.e. a menu is down) we don't want the cursor to ever disappear
				if (!activeMenu && fb.IsPlaying) {
					window.SetCursor(-1); // Hide cursor
				}
			}, 10000);
		}

		if (displayCustomThemeMenu || displayMetadataGridMenu) {
			customMenu.on_mouse_move(x, y, m);
		}

		if (updateHyperlink) hyperlinks_on_mouse_move(updateHyperlink, x, y);

		if ((displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) && playlist.mouse_in_this(x, y)) {
			trace_call && trace_on_move && console.log('Playlist => on_mouse_move');

			if (mouse_move_suppress.is_supressed(x, y, m)) {
				return;
			}

			qwr_utils.DisableSizing(m);
			playlist.on_mouse_move(x, y, m);
		}
		else if (displayLibrary && library.mouse_in_this(x, y)) {
			trace_call && trace_on_move && console.log('Library => on_mouse_move');
			library.on_mouse_move(x, y, m);
		}
		else if (displayBiography && biography.mouse_in_this(x, y)) {
			trace_call && trace_on_move && console.log('Biography => on_mouse_move');
			biography.on_mouse_move(x, y, m);
		}
		else if (showGridTimeline && str.timeline && str.timeline.mouseInThis(x, y) && (pref.layout === 'default' && !displayPlaylist && !displayLibrary && !displayBiography && !pref.displayLyrics ||
			pref.layout === 'artwork' && displayPlaylist && !displayLibrary && !displayBiography)) { // Prevent tooltips on album cover when Artwork layout is active
			str.timeline.on_mouse_move(x, y, m);
		}
		else if (str.metadata_grid_tt && str.metadata_grid_tt.mouseInThis(x, y)) {
			str.metadata_grid_tt.on_mouse_move(x, y, m);
		}
		else if (str.lowerBar_tt && str.lowerBar_tt.mouseInThis(x, y)) {
			str.lowerBar_tt.on_mouse_move(x, y, m);
		}
		else if (showTransportControls && showVolumeBtn && volumeBtn) {
			volumeBtn.on_mouse_move(x, y, m);
		}

		UIHacksDragWindow(x, y);
	}
}


/** Called when right mouse button is pressed */
function on_mouse_rbtn_down(x, y, m) {
	if ((displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) && playlist.mouse_in_this(x, y)) {
		trace_call && console.log('Playlist => on_mouse_rbtn_down');
		if (displayCustomThemeMenu && displayBiography) return;
		playlist.on_mouse_rbtn_down(x, y, m);
	}
}


/** Called when right mouse button is released from pressed state */
function on_mouse_rbtn_up(x, y, m) {
	if ((fb.IsPlaying && !displayBiography && (pref.layout === 'default' || !displayPlaylistArtworkLayout && !displayLibrary && pref.layout === 'artwork')) &&
		state.mouse_x > 0 && state.mouse_x <= ((isStreaming || !albumArt && noArtwork || albumArt) && (displayPlaylist || displayLibrary) && pref.layout === 'default' ? ww * 0.5 : !displayPlaylist && !displayLibrary ? ww : albumArtSize.w) &&
		state.mouse_y > albumArtSize.y && state.mouse_y <= albumArtSize.y + albumArtSize.h) {

		// * Do not show album cover context menu when Playlist/Library layout is in full width or when using Library's flow mode
		if (!displayPlaylist && !displayLibrary && !displayBiography || pref.displayLyrics || displayPlaylist && !displayLibrary && pref.playlistLayout !== 'full' || displayPlaylist && pref.layout === 'artwork' || displayLibrary && pref.libraryLayout === 'normal' && pref.libraryDesign !== 'flowMode') {
			trace_call && console.log('Details => on_mouse_rbtn_up');
			const cmac = new ContextMainMenu();
			qwr_utils.append_album_cover_context_menu_to(cmac);

			activeMenu = true;
			cmac.execute(x, y);
			activeMenu = false;

			return true;
		}
	}
	if (fb.IsPlaying && state.mouse_x > 0 && state.mouse_x && state.mouse_y > wh - scaleForDisplay(120) && state.mouse_y) {
		trace_call && console.log('Lower bar => on_mouse_rbtn_up');
		const cmac = new ContextMainMenu();
		qwr_utils.append_lower_bar_context_menu_to(cmac);

		activeMenu = true;
		cmac.execute(x, y);
		activeMenu = false;

		return true;
	}
	if ((displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) && playlist.mouse_in_this(x, y)) {
		trace_call && console.log('Playlist => on_mouse_rbtn_up');
		if (displayCustomThemeMenu && displayBiography) return;
		return playlist.on_mouse_rbtn_up(x, y, m);
	}
	else if (displayLibrary && library.mouse_in_this(x, y)) {
		trace_call && console.log('Library => on_mouse_rbtn_up');
		return library.on_mouse_rbtn_up(x, y, m);
	}
	else if (displayBiography && biography.mouse_in_this(x, y)) {
		trace_call && console.log('Biography => on_mouse_rbtn_up');
		return biography.on_mouse_rbtn_up(x, y, m);
	}
	else {
		return pref.disableRightClick;
	}
}


/** Called when using the mouse wheel, also used to cycle through album artworks and control the seekbar */
function on_mouse_wheel(delta) {
	const showVolumeBtn = pref.layout === 'compact' ? pref.showVolumeBtn_compact : pref.layout === 'artwork' ? pref.showVolumeBtn_artwork : pref.showVolumeBtn_default;

	if (showVolumeBtn && volumeBtn.on_mouse_wheel(delta)) return;

	if (pref.layout === 'default' && state.mouse_y > wh - 0.5 * geo.lowerBarHeight + 0.5 * geo.peakmeterBarHeight || pref.layout !== 'default' && state.mouse_y > wh - 0.5 * geo.lowerBarHeight - 1.5 * geo.peakmeterBarHeight) {
		peakmeterBar.on_mouse_wheel(delta);
		return;
	}

	if (pref.layout === 'default' && state.mouse_y > wh - 0.5 * geo.lowerBarHeight + 0.5 * geo.progBarHeight || pref.layout !== 'default' && state.mouse_y > wh - 0.5 * geo.lowerBarHeight - 1.5 * geo.progBarHeight) {
		fb.PlaybackTime = fb.PlaybackTime - delta * pref.progressBarWheelSeekSpeed;
		refreshSeekbar();
		return;
	}

	if (pref.cycleArtMWheel && albumArtList.length > 1 && pref.layout !== 'compact' && !pref.displayLyrics && !displayBiography && !displayLibrary && !displayPlaylistArtworkLayout &&
		state.mouse_x > albumArtSize.x && state.mouse_x <= albumArtSize.x + albumArtSize.w && state.mouse_y > albumArtSize.y && state.mouse_y <= albumArtSize.y + albumArtSize.h) {
		on_mouse_wheel_albumart = true;
		if (delta > 0) { // Prev album art image
			if (albumArtIndex !== 0) albumArtIndex = (albumArtIndex - 1) % albumArtList.length;
		} else {		 // Next album art image
			if (albumArtIndex !== albumArtList.length - 1) albumArtIndex = (albumArtIndex + 1) % albumArtList.length;
		}
		loadImageFromAlbumArtList(albumArtIndex);
		if (pref.theme === 'reborn' || pref.theme === 'random' || pref.styleBlackAndWhiteReborn || pref.styleBlackReborn) {
			newTrackFetchingArtwork = true;
			getThemeColors(albumArt);
			initTheme();
			debugLog('initTheme -> on_mouse_wheel');
		}
		resizeArtwork(true); // Needed to readjust discArt shadow size if artwork size changes
		lastLeftEdge = 0;
		repaintWindow();
		return;
	}
	on_mouse_wheel_albumart = false;

	if (pref.displayLyrics && state.mouse_x > albumArtSize.x && state.mouse_x <= albumArtSize.x + albumArtSize.w && state.mouse_y > albumArtSize.y && state.mouse_y <= albumArtSize.y + albumArtSize.h) {
		gLyrics.on_mouse_wheel(delta);
	}
	else if (displayBiography && state.mouse_x > uiBio.x && state.mouse_x <= uiBio.x + uiBio.w && state.mouse_y > uiBio.y && state.mouse_y <= uiBio.y + uiBio.h) {
		trace_call && console.log('Biography => on_mouse_wheel');
		biography.on_mouse_wheel(delta);
	}
	else if ((displayPlaylist && !displayLibrary || displayPlaylistArtworkLayout || displayPlaylistLibrary(true)) && state.mouse_y > playlist.y && state.mouse_y <= playlist.y + playlist.h) {
		trace_call && console.log('Playlist => on_mouse_wheel');
		playlist.on_mouse_wheel(delta);
	}
	else if (displayLibrary) {
		trace_call && console.log('Library => on_mouse_wheel');
		library.on_mouse_wheel(delta);
	}
}


/** Called in other panels after window.NotifyOthers is executed */
function on_notify_data(name, info) {
	if (displayPlaylist || displayPlaylistArtworkLayout) {
		trace_call && console.log('Playlist => on_notify_data');
		playlist.on_notify_data(name, info);
	}
	else if (displayLibrary) {
		trace_call && console.log('Library => on_notify_data');
		library.on_notify_data(name, info);
	}
	if (displayBiography) {
		trace_call && console.log('Biography => on_notify_data');
		biography.on_notify_data(name, info);
	}
}


/** Called when Per-track dynamic info (stream track titles etc) changes. Happens less often than on_playback_dynamic_info */
function on_playback_dynamic_info_track() {
	// How frequently does this get called?
	const metadb = fb.IsPlaying ? fb.GetNowPlaying() : null;
	on_playback_new_track(metadb);

	if (displayPlaylist || displayPlaylistArtworkLayout) {
		playlist.on_playback_dynamic_info_track();
	}
	if (displayBiography) {
		biography.on_playback_dynamic_info_track();
	}
	if (pref.displayLyrics) { // No need to try retrieving them if we aren't going to display them now
		initLyrics();
	}
}


/** Called when playback order is changed via the transport playback order button or foobar's playback menu */
function on_playback_order_changed(thisPlaybackOrder) {
	// Repaint playback order
	if (thisPlaybackOrder !== lastPlaybackOrder) {
		debugLog('Repainting on_playback_order_changed');
		window.RepaintRect(0.5 * ww, wh - geo.lowerBarHeight, 0.5 * ww, geo.lowerBarHeight);
	}
	lastPlaybackOrder = thisPlaybackOrder;

	// Link foobar's playback order menu functions with playback order button
	const showTransportControls = pref.layout === 'compact' ? pref.showTransportControls_compact : pref.layout === 'artwork' ? pref.showTransportControls_artwork : pref.showTransportControls_default;
	const showPlaybackOrderBtn  = pref.layout === 'compact' ? pref.showPlaybackOrderBtn_compact  : pref.layout === 'artwork' ? pref.showPlaybackOrderBtn_artwork  : pref.showPlaybackOrderBtn_default;
	const showBtns = showTransportControls && showPlaybackOrderBtn;
	pbo = thisPlaybackOrder;

	if (pbo === PlaybackOrder.Default) {
		pref.playbackOrder = 'Default';
		if (showBtns) btns.playbackOrder.img = btnImg.PlaybackDefault;
	}
	else if (pbo === PlaybackOrder.RepeatTrack || pbo === PlaybackOrder.RepeatPlaylist) {
		pref.playbackOrder = 'Repeat';
		if (showBtns) btns.playbackOrder.img = btnImg.PlaybackReplay;
	}
	else if (pbo === PlaybackOrder.ShuffleTracks || pbo === PlaybackOrder.ShuffleAlbums || pbo === PlaybackOrder.ShuffleFolders || pbo === PlaybackOrder.Random) {
		pref.playbackOrder = 'Shuffle';
		if (showBtns) btns.playbackOrder.img = btnImg.PlaybackShuffle;
	}
}


/** Called when pausing current playing track */
function on_playback_pause(pausing) {
	refreshPlayButton();
	if (pausing || fb.PlaybackLength < 0) {
		clearInterval(progressBarTimer);
		clearInterval(discArtRotationTimer);
		window.RepaintRect(0, geo.topMenuHeight, Math.max(albumArtSize.x, scaleForDisplay(40)), wh - geo.topMenuHeight - geo.lowerBarHeight);
	}
	else { // Unpausing
		clearInterval(progressBarTimer); // Clear to avoid multiple progressTimers which can happen depending on the playback state when theme is loaded
		debugLog(`on_playback_pause: creating refreshSeekbar() interval with delay = ${progressBarTimerInterval}`);
		progressBarTimer = setInterval(() => {
			refreshSeekbar();
		}, progressBarTimerInterval || 1000);
		if (discArt && pref.spinDiscArt) setupRotationTimer();
	}

	pauseBtn.repaint();

	if ((albumArt || noAlbumArtStub) && pref.displayLyrics) { // If we are displaying lyrics we need to refresh all the lyrics to avoid tearing at the edges of the pause button
		gLyrics.on_playback_pause(pausing);
	}
	if (displayPlaylist || displayPlaylistArtworkLayout) {
		playlist.on_playback_pause(pausing);
	}
	if (displayBiography) {
		biography.on_playback_pause(pausing);
	}
}


/** Called when adding new playlist tracks in queue */
function on_playback_queue_changed(origin) {
	trace_call && console.log('Playlist => on_playback_queue_changed');
	playlist.on_playback_queue_changed(origin);
	library.on_playback_queue_changed();
}


/** Called when playback time is being seeked, float value in seconds */
function on_playback_seek() {
	if (pref.seekbar === 'progressbar') {
		progressBar.progressMoved = true;
	} else if (pref.seekbar === 'peakmeterbar') {
		peakmeterBar.progressMoved = true;
	}

	if (pref.displayLyrics) {
		gLyrics.seek();
	}
	else if (displayBiography) {
		biography.on_playback_seek();
	}
	on_playback_time();
	refreshSeekbar();
}


/** Called when playback process is being initialized, on_playback_new_track should be called soon after this when first file is successfully opened for decoding */
function on_playback_starting(cmd, is_paused) {
	if (settings.hideCursor) {
		window.SetCursor(-1); // Hide cursor
	}
	refreshPlayButton();
}


/** Called when playback is stopped */
function on_playback_stop(reason) {
	if (reason !== 2) { // 2 = Starting_another
		// Clear all variables and repaint
		str = clearUIVariables();
		debugLog('Repainting on_playback_stop:', reason);
		repaintWindow();
		isPlayingCD = false;
		isStreaming = false;
		lastFolder = '';
		btns.playbackTime = '';
		lastDiscNumber = '0';
		recordLabels = [];
		recordLabelsInverted = [];
		refreshPlayButton();
		// * Keep Reborn/Random colors when they are not too bright or too dark otherwise reset colors to default
		if (['reborn', 'random'].includes(pref.theme) && ((colBrightness < 20 || imgBrightness < 20) || (colBrightness > 240 || imgBrightness > 240)) ||
			!['reborn', 'random'].includes(pref.theme)) {
			setThemeColors();
			initTheme();
			debugLog('initTheme -> on_playback_stop');
		}
	}

	waveformBar.on_playback_stop(reason);

	clearInterval(discArtRotationTimer);
	clearInterval(progressBarTimer);
	clearTimeout(albumArtTimeout);

	if (albumArt && ((pref.cycleArt && albumArtIndex !== 0) || lastFolder === '')) {
		debugLog('disposing artwork');
		albumArt = null;
		albumArtScaled = null;
	}
	bandLogo = null;
	invertedBandLogo = null;
	if (pref.displayLyrics && gLyrics) {
		gLyrics.on_playback_stop(reason);
	}

	flagImgs = [];
	rotatedDiscArt = null;
	albumArtTimeout = 0;

	if (reason === 0 || reason === 1) { // Stop or end of playlist
		discArt = disposeDiscArtImg(discArt);
		discArtArray = [];	// Clear Images
		window.Repaint();
	}
	if (displayPlaylist || displayPlaylistArtworkLayout) {
		playlist.on_playback_stop(reason);
	}
	else if (displayLibrary) {
		library.on_playback_stop(reason);
	}
	if (displayBiography) {
		biography.on_playback_stop(reason);
	}
}


/** Called when clicking on playlist items that are visible in the playlist panel */
function on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex) {
	if (displayPlaylist || displayPlaylistArtworkLayout) {
		trace_call && console.log('Playlist => on_playlist_item_ensure_visible');
		playlist.on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex);
	}
}


/** Called when adding tracks to the playlist */
function on_playlist_items_added(playlistIndex) {
	playlistHistory.playlistAltered(PlaylistMutation.Added);
	if (displayPlaylist || displayPlaylistArtworkLayout) {
		trace_call && console.log('Playlist => on_playlist_items_added');
		playlist.on_playlist_items_added(playlistIndex);
	}
	if (displayLibrary || displayPlaylistLibrary()) {
		trace_call && console.log('Library => on_playlist_items_added');
		library.on_playlist_items_added(playlistIndex);
	}
	if (displayBiography) {
		trace_call && console.log('Biography => on_playlist_items_added');
		biography.on_playlist_items_added(playlistIndex);
	}
}


/** Called when removing tracks from the playlist */
function on_playlist_items_removed(playlistIndex) {
	playlistHistory.playlistAltered(PlaylistMutation.Removed);
	if (displayPlaylist || displayPlaylistArtworkLayout) {
		trace_call && console.log('Playlist => on_playlist_items_removed');
		playlist.on_playlist_items_removed(playlistIndex);
	}
	else if (displayLibrary) {
		trace_call && console.log('Library => on_playlist_items_removed');
		library.on_playlist_items_removed(playlistIndex);
	}
	if (displayBiography) {
		trace_call && console.log('Biography => on_playlist_items_removed');
		biography.on_playlist_items_removed(playlistIndex);
	}
}


/** Called when reordering tracks in the playlist, i.e by dragging them up or down */
function on_playlist_items_reordered(playlistIndex) {
	playlistHistory.playlistAltered(PlaylistMutation.Reordered);
	if (displayPlaylist || displayPlaylistArtworkLayout) {
		trace_call && console.log('Playlist => on_playlist_items_reordered');
		playlist.on_playlist_items_reordered(playlistIndex);
	}
	else if (displayLibrary) {
		trace_call && console.log('Library => on_playlist_items_reordered');
		library.on_playlist_items_reordered(playlistIndex);
	}
}


/** Called as a workaround for some 3rd party playlist viewers not working with on_selection_changed */
function on_playlist_items_selection_change() {
	if (displayPlaylist || displayPlaylistArtworkLayout) {
		trace_call && console.log('Playlist => on_playlist_items_selection_change');
		playlist.on_playlist_items_selection_change();
	}
}


/** Called when switching the current active playlist to another */
function on_playlist_switch() {
	playlistHistory.playlistAltered(PlaylistMutation.Switch);
	if (displayPlaylist || displayPlaylistArtworkLayout) {
		trace_call && console.log('Playlist => on_playlist_switch');
		playlist.on_playlist_switch();
	}
	else if (displayLibrary) {
		trace_call && console.log('Library => on_playlist_switch');
		library.on_playlist_switch();
	}
	if (displayBiography) {
		trace_call && console.log('Biography => on_playlist_switch');
		biography.on_playlist_switch();
	}
}


/** Called when playlists are added/removed/reordered/renamed or a playlist's lock status changes */
function on_playlists_changed() {
	playlistHistory.reset(); // When playlists are changed, indexes no longer apply, and so we have to wipe history
	if (displayPlaylist || displayPlaylistArtworkLayout) {
		trace_call && console.log('Playlist => on_playlists_changed');
		playlist.on_playlists_changed();
	}
	else if (displayLibrary) {
		trace_call && console.log('Library => on_playlists_changed');
		library.on_playlists_changed();
	}
	if (displayBiography) {
		trace_call && console.log('Biography => on_playlists_changed');
		biography.on_playlists_changed();
	}
}


/** Called when volume changes, i.e the volume bar in the volume button */
function on_volume_change(val) {
	trace_call && console.log('Volume bar => on_volume_change');
	volumeBtn.on_volume_change(val);
}
