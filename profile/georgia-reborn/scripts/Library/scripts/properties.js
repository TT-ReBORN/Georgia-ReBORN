'use strict';

class PanelPropertyLib {
	constructor(name, default_value) {
		this.name = name;
		this.default_value = default_value;
		this.value = ppt.get(this.name, default_value);
	}

	// Methods

	get() {
		return this.value;
	}

	set(new_value) {
		if (this.value !== new_value) {
			ppt.set(this.name, new_value);
			this.value = new_value;
		}
	}
}

class PanelPropertiesLib {
	constructor() {
		// this.name_list = {}; debug
	}

	// Methods

	init(type, properties, thisArg) {
		switch (type) {
			case 'auto':
				properties.forEach(v => {
					// this.validate(v); debug
					this.add(v);
				});
				break;
			case 'manual':
				properties.forEach(v => thisArg[v[2]] = this.get(v[0], v[1]));
				break;
		}
	}

	validate(item) {
		if (!$Lib.isArray(item) || item.length !== 3 || typeof item[2] !== 'string') {
			throw ('invalid property: requires array: [string, any, string]');
		}

		if (item[2] === 'add') {
			throw (`property_id: ${item[2]}\nThis id is reserved`);
		}

		if (this[item[2]] != null || this[`${item[2]}_internal`] != null) {
			throw (`property_id: ${item[2]}\nThis id is already occupied`);
		}

		if (this.name_list[item[0]] != null) {
			throw (`property_name: ${item[0]}\nThis name is already occupied`);
		}
	}

	add(item) {
		// this.name_list[item[0]] = 1; debug
		this[`${item[2]}_internal`] = new PanelPropertyLib(item[0], item[1]);

		Object.defineProperty(this, item[2], {
			get() {
				return this[`${item[2]}_internal`].get();
			},
			set(new_value) {
				this[`${item[2]}_internal`].set(new_value);
			}
		});
	}

	get(name, default_value) {
		return window.GetProperty(name, default_value);
	} // initialisation

	set(name, new_value) {
		return window.SetProperty(name, new_value);
	}

	toggle(name) {
		this[name] = !this[name];
	}
}

let properties = [
	['Panel Library - #Show Html Dialog Unsupported-0 Supported-1 Autocheck-2', 2, 'isHtmlDialogSupported'],
	['Panel Library - Action Mode', 0, 'actionMode'],
	['Panel Library - Alt-Click Action', 1, 'altClickAction'],

	['Panel Library - Colour Line Dark', false, 'colLineDark'],
	['Panel Library - Colour Swap', false, 'swapCol'],
	['Panel Library - Cover Auto-Fill', true, 'autoFill'],
	['Panel Library - Cover Opacity (0-100)', 10, 'covAlpha'],

	['Panel Library - Custom Colour Text', '171,171,190', 'text'],
	['Panel Library - Custom Colour Text Highlight', '121,194,255', 'text_h'],
	['Panel Library - Custom Colour Text Selected', '255,255,255', 'textSel'],
	['Panel Library - Custom Colour Text Nowplaying Highlight', 'rgb(121-194-255)', 'nowp'],
	['Panel Library - Custom Colour Search Text', '171,171,190', 'search'],
	['Panel Library - Custom Colour Buttons', '113,125,147', 'txt_box'],
	['Panel Library - Custom Colour Background', '4,39,68', 'bg'],
	['Panel Library - Custom Colour Background Accent', '18,52,85', 'bg_h'],
	['Panel Library - Custom Colour Background Selected', '37,71,108', 'bgSel'],
	['Panel Library - Custom Colour Frame Hover', '35,132,182', 'frame'],
	['Panel Library - Custom Colour Frame Selected', '49,145,198', 'bgSelframe'],
	['Panel Library - Custom Colour Item Counts', '171,171,190', 'counts'],
	['Panel Library - Custom Colour Node Collapse', '171,171,190', 'icon_c'],
	['Panel Library - Custom Colour Node Expand', '171,171,190', 'icon_e'],
	['Panel Library - Custom Colour Node Hover', '121,194,255', 'icon_h'],
	['Panel Library - Custom Colour Node Lines', '48,70,90', 'line'],
	['Panel Library - Custom Colour Separators', '48,71,90', 's_line'],
	['Panel Library - Custom Colour Side Marker', '121,194,255', 'sideMarker'],
	['Panel Library - Custom Colour Transparent Fill', '0,0,0,0.06', 'bgTrans'],

	['Panel Library - Custom Colour Text Use', false, 'textUse'],
	['Panel Library - Custom Colour Text Highlight Use', false, 'text_hUse'],
	['Panel Library - Custom Colour Text Selected Use', false, 'textSelUse'],
	['Panel Library - Custom Colour Text Nowplaying Highlight Use', false, 'nowpUse'],
	['Panel Library - Custom Colour Search Text Use', false, 'searchUse'],
	['Panel Library - Custom Colour Buttons Use', false, 'txt_boxUse'],
	['Panel Library - Custom Colour Background Use', false, 'bgUse'],
	['Panel Library - Custom Colour Background Accent Use', false, 'bg_hUse'],
	['Panel Library - Custom Colour Background Selected Use', false, 'bgSelUse'],
	['Panel Library - Custom Colour Frame Hover Use', false, 'frameUse'],
	['Panel Library - Custom Colour Frame Selected Use', false, 'bgSelframeUse'],
	['Panel Library - Custom Colour Item Counts Use', false, 'countsUse'],
	['Panel Library - Custom Colour Node Collapse Use', false, 'icon_cUse'],
	['Panel Library - Custom Colour Node Expand Use', false, 'icon_eUse'],
	['Panel Library - Custom Colour Node Hover Use', false, 'icon_hUse'],
	['Panel Library - Custom Colour Node Lines Use', false, 'lineUse'],
	['Panel Library - Custom Colour Separators Use', false, 's_lineUse'],
	['Panel Library - Custom Colour Side Marker Use', false, 'sideMarkerUse'],
	['Panel Library - Custom Colour Transparent Fill Use', false, 'bgTransUse'],

	['Panel Library - Custom Font', 'Segoe UI,16,0', 'custFont'],
	['Panel Library - Custom Font Album Art Line 1', 'Segoe UI,1', 'custAlbumArtGrpFont'],
	['Panel Library - Custom Font Album Art Line 2', 'Segoe UI Semibold,0', 'custAlbumArtLotFont'],
	['Panel Library - Custom Font Album Art Line 3', 'Segoe UI,0', 'custAlbumArtDurFont'],

	['Panel Library - Custom Font Use', false, 'custFontUse'],
	['Panel Library - Custom Font Album Art Line 1 Use', false, 'custAlbumArtGrpFontUse'],
	['Panel Library - Custom Font Album Art Line 2 Use', false, 'custAlbumArtLotFontUse'],
	['Panel Library - Custom Font Album Art Line 3 Use', false, 'custAlbumArtDurFontUse'],

	['Panel Library - Custom Font Node Icon', 'Segoe UI Symbol', 'custIconFont'],
	['Panel Library - Custom Font Scroll Icon', 'Segoe UI Symbol', 'butCustIconFont'],

	['Panel Library - Double-Click Action', 1, 'dblClickAction'],
	['Panel Library - Facet View', false, 'facetView'],
	['Panel Library - Filter By', 0, 'filterBy'],
	['Panel Library - Font Size (Default)', 12, 'baseFontSize_default'],
	['Panel Library - Font Size (Artwork)', 12, 'baseFontSize_artwork'],
	['Panel Library - Full Line Selection', true, 'fullLineSelection'],
	['Panel Library - Height', 578, 'pn_h'],
	['Panel Library - Height Auto [Expand/Collapse With Root]', false, 'pn_h_auto'],
	['Panel Library - Height Auto-Collapse', 100, 'pn_h_min'],
	['Panel Library - Height Auto-Expand', 578, 'pn_h_max'],
	['Panel Library - Highlight Row', 1, 'highLightRow'],
	['Panel Library - Highlight Frame Image', false, 'frameImage'],
	['Panel Library - Highlight Text', false, 'highLightText'],
	['Panel Library - Hot Key [Focus Not Needed]: 1-10 // Assign Spider Monkey Panel index in keyboard shortcuts', 'CollapseAll,0,PlaylistAdd,0,PlaylistInsert,0,PlaylistNew,0,Search,0,SearchClear,0', 'hotKeys'],

	['Panel Library - Image Blur Background Auto-Fill', false, 'blurAutofill'],
	['Panel Library - Image Blur Background Level (%)', 90, 'blurTemp'],
	['Panel Library - Image Blur Background Opacity (%)', 30, 'blurAlpha'],
	['Panel Library - Image Current Root', 3, 'curRootImg'],
	['Panel Library - Image Current No Artist', 2, 'curNoArtistImg'],
	['Panel Library - Image Current No Cover', 9, 'curNoCoverImg'],
	['Panel Library - Image Disk Cache Enabled', true, 'albumArtDiskCache'],
	['Panel Library - Image Drop Shadow', false, 'albumArtDropShadow'],
	['Panel Library - Image Group Level', 0, 'albumArtGrpLevel'],
	['Panel Library - Image Group Names', JSON.stringify({}), 'albumArtGrpNames'],
	['Panel Library - Image Flip Labels', false, 'albumArtFlipLabels'],
	['Panel Library - Image Flow Mode', false, 'albumArtFlowMode'],
	['Panel Library - Image Follow Selection Flow Mode', true, 'flowModeFollowSelection'],
	['Panel Library - Image Follow Selection Standard Mode', false, 'stndModeFollowSelection'],
	['Panel Library - Image Item Overlay', 1, 'itemOverlayType'],
	['Panel Library - Image Label', 1, 'albumArtLabelType'],
	['Panel Library - Image Memory Limit MB (0 = default)', 0, 'memoryLimit'],
	['Panel Library - Image No Artist Images', JSON.stringify([]), 'noArtistImages'],
	['Panel Library - Image No Cover Images', JSON.stringify([]), 'noCoverImages'],
	['Panel Library - Image Preload Images In Disk Cache', false, 'albumArtPreLoad'],
	['Panel Library - Image Root Images', JSON.stringify([]), 'rootImages'],
	['Panel Library - Image Show Album Art', false, 'albumArtShow'],
	['Panel Library - Image Show Index Letter', true, 'albumArtLetter'],
	['Panel Library - Image Show Index Number', 1, 'albumArtLetterNo'],
	['Panel Library - Image Show Index Year Auto', true, 'albumArtYearAuto'],
	['Panel Library - Image Show Options', true, 'albumArtOptionsShow'],
	['Panel Library - Image Style [Front] Regular-0 Auto-Fill-1 Circular-2', 1, 'imgStyleFront'],
	['Panel Library - Image Style [Back] Regular-0 Auto-Fill-1 Circular-2', 1, 'imgStyleBack'],
	['Panel Library - Image Style [Disc] Regular-0 Auto-Fill-1 Circular-2', 1, 'imgStyleDisc'],
	['Panel Library - Image Style [Icon] Regular-0 Auto-Fill-1 Circular-2', 1, 'imgStyleIcon'],
	['Panel Library - Image Style [Artist] Regular-0 Auto-Fill-1 Circular-2', 1, 'imgStyleArtist'],
	['Panel Library - Image Thumbnail Gap Standard', 0, 'thumbNailGapStnd'],
	['Panel Library - Image Thumbnail Gap Compact', 3, 'thumbNailGapCompact'],
	['Panel Library - Image Thumbnail Size', 2, 'thumbNailSize'],
	['Panel Library - Image Type', 0, 'artId'],
	['Panel Library - Image View By: Same As Tree', false, 'artTreeSameView'],

	['Panel Library - Initial Load Filters', true, 'initialLoadFilters'],
	['Panel Library - Initial Load Views', true, 'initialLoadViews'],
	['Panel Library - Key: Send to Playlist', 0, 'keyAction'],
	['Panel Library - Library Auto-Sync', true, 'libAutoSync'],
	['Panel Library - Library Sort Date Before Album', true, 'yearBeforeAlbum'],

	['Panel Library - Library Source', 1, 'libSource'],
	['Panel Library - Library Source: Active Playlist Follow Focus', true, 'followPlaylistFocus'],
	['Panel Library - Library Source: Fixed Playlist', false, 'fixedPlaylist'],
	['Panel Library - Library Source: Fixed Playlist Name', '', 'fixedPlaylistName'],

	['Panel Library - Limit Menu Expand: 10-6000', 500, 'treeExpandLimit'],
	['Panel Library - Limit Tree Auto Expand: 10-1000', 350, 'autoExpandLimit'],
	['Panel Library - Line Padding', 5, 'verticalPad'],
	['Panel Library - Line Padding Album Art', 2, 'verticalAlbumArtPad'],
	['Panel Library - Margin', Math.round(scaleForDisplay(20) * $Lib.scale), 'margin'],
	['Panel Library - Margin Override Top/Bottom (No Top Bar)', Math.round(8 * $Lib.scale), 'marginTopBottom'],
	['Panel Library - Middle-Click Action', 1, 'mbtnClickAction'],
	['Panel Library - Mouse: Always Pointer (no hand)', true, 'mousePointerOnly'],

	['Panel Library - Node: Auto Collapse', false, 'autoCollapse'],
	['Panel Library - Node: Highlight on Hover', true, 'highLightNode'],
	['Panel Library - Node: Item Counts Align Right', true, 'countsRight'],
	['Panel Library - Node: Item Counts Hide-0 Tracks-1 Sub-Items-2', 1, 'nodeCounts'],
	['Panel Library - Node: Root Hide-0 All Music-1 View Name-2', 3, 'rootNode'],
	['Panel Library - Node: Root Inline Style', true, 'inlineRoot'],
	['Panel Library - Node: Root Show Source', false, 'showSource'],
	['Panel Library - Node: Show Lines', true, 'nodeLines'],
	['Panel Library - Node: Show Tracks', true, 'showTracks'],
	['Panel Library - Node: Style', 5, 'nodeStyle'],
	['Panel Library - Node [Squares]: Windows', false, 'winNode'],
	['Panel Library - Node Custom Icon: +|-', '\uE013|\uE015', 'iconCustom'],
	['Panel Library - Node Custom Icon: Vertical Offset (%)', -2, 'iconVerticalPad'],

	['Panel Library - Nowplaying Highlight', true, 'highLightNowplaying'],
	['Panel Library - Nowplaying Highlight Last', false, 'highLightNowplayinglast'],
	['Panel Library - Nowplaying Indicator', false, 'nowPlayingIndicator'],
	['Panel Library - Nowplaying Indicator Last', false, 'nowPlayingIndicatorLast'],
	['Panel Library - Nowplaying Sidemarker', false, 'nowPlayingSidemarker'],
	['Panel Library - Nowplaying Sidemarker Last', false, 'nowPlayingSidemarkerLast'],

	['Panel Library - Play on Enter or Send from Menu', true, 'autoPlay'],
	['Panel Library - Playlist: Custom Sort', '', 'customSort'],
	['Panel Library - Playlist: Default', 'Library View', 'libPlaylist'],
	['Panel Library - Playlist: Default Activate on Change', true, 'activateOnChange'],
	['Panel Library - Playlist: Panel Selection', 'Library Tree Panel Selection', 'panelSelectionPlaylist'],
	['Panel Library - Playlist: Last Panel Selection', 'Library Tree Panel Selection', 'lastPanelSelectionPlaylist'],
	['Panel Library - Playlist: Send to Current', false, 'sendToCur'],
	['Panel Library - Prefixes to Strip or Swap (| Separator)', 'A|The', 'prefix'],
	['Panel Library - Preset: Load Current View', true, 'presetLoadCurView'],
	['Panel Library - Remember.PreSearch', true, 'rememberPreSearch'],
	['Panel Library - Remember.Proc', false, 'process'],
	['Panel Library - Remember.Tree', true, 'rememberTree'],
	['Panel Library - Remember.View', false, 'rememberView'],
	['Panel Library - Reset Tree', false, 'reset'],
	['Panel Library - Row Stripes', false, 'rowStripes'],

	['Panel Library - Scroll Step 0-10 (0 = Page)', 3, 'scrollStep'],
	['Panel Library - Scroll Smooth Duration 0-5000 msec (Max)', 500, 'durationScroll'],
	['Panel Library - Scroll Touch Flick Distance 0-10', 0.8, 'flickDistance'],
	['Panel Library - Scroll Touch Flick Duration 0-5000 msec (Max)', 3000, 'durationTouchFlick'],
	['Panel Library - Scroll: Smooth Scroll', true, 'smooth'],
	['Panel Library - Scrollbar Arrow Custom Icon', '\uE0A0', 'arrowSymbol'],
	['Panel Library - Scrollbar Arrow Custom Icon: Vertical Offset (%)', -24, 'sbarButPad'],
	['Panel Library - Scrollbar Arrow Width', Math.round(11 * $Lib.scale), 'sbarArrowWidth'],
	['Panel Library - Scrollbar Button Type', 0, 'sbarButType'],
	['Panel Library - Scrollbar Colour Grey-0 Blend-1', 1, 'sbarCol'],
	['Panel Library - Scrollbar Grip MinHeight', Math.round(scaleForDisplay(20) * $Lib.scale), 'sbarGripHeight'],
	['Panel Library - Scrollbar Height Prefer Full', true, 'sbarFullHeight'],
	['Panel Library - Scrollbar Narrow Bar Width (0 = Auto)', 0, 'narrowSbarWidth'],
	['Panel Library - Scrollbar Padding', 0, 'sbarPad'],
	['Panel Library - Scrollbar Show', 1, 'sbarShow'],
	['Panel Library - Scrollbar Type Default-0 Styled-1 Windows-2', 1, 'sbarType'],
	['Panel Library - Scrollbar Width', Math.round(11 * $Lib.scale), 'sbarWidth'],
	['Panel Library - Scrollbar Width Bar', 11, 'sbarBase_w'],
	['Panel Library - Scrollbar Windows Metrics', false, 'sbarWinMetrics'],

	['Panel Library - Search Enter', false, 'searchEnter'],
	['Panel Library - Search History', JSON.stringify([]), 'searchHistory'],
	['Panel Library - Search Send', 1, 'searchSend'],

	['Panel Library - Show Filter', true, 'filterShow'],
	['Panel Library - Show Panel Source Message', true, 'panelSourceMsg'],
	['Panel Library - Show Search', true, 'searchShow'],
	['Panel Library - Show Settings', true, 'settingsShow'],
	['Panel Library - Side Marker Width', 0, 'sideMarkerWidth'],
	['Panel Library - Single-Click Action', 0, 'clickAction'],
	['Panel Library - Sort Order', 0, 'sortOrder'],

	['Panel Library - Statistics Show', 0, 'itemShowStatistics'],
	['Panel Library - Statistics Show Last', 0, 'itemShowStatisticsLast'],
	['Panel Library - Statistics Label Show', true, 'labelStatistics'],
	['Panel Library - Statistics Titleformat Added', '[$date(%added%)]', 'tfAdded'],
	['Panel Library - Statistics Titleformat Date', '[$year(%date%)]', 'tfDate'],
	['Panel Library - Statistics Titleformat First Played', '[$date(%first_played%)]', 'tfFirstPlayed'],
	['Panel Library - Statistics Titleformat Last Played', '[$date(%last_played%)]', 'tfLastPlayed'],
	['Panel Library - Statistics Titleformat Playcount DataPinningScheme|Field', '%artist%%album%%discnumber%%tracknumber%%title%|%play_count%', 'tfPc'],
	['Panel Library - Statistics Titleformat Rating', '[%rating%]', 'tfRating'],
	['Panel Library - Statistics Titleformat Popularity', '[$meta(Track Statistics Last.fm,5[score])]', 'tfPopularity'],
	['Panel Library - Statistics Tooltips Show', true, 'tooltipStatistics'],

	['Panel Library - Theme', 0, 'theme'],
	['Panel Library - Theme Panel Source Use Received Item Image', false, 'recItemImage'],
	['Panel Library - Theme Background Image', false, 'themeBgImage'],
	['Panel Library - Theme Colour', 3, 'themeColour'],
	['Panel Library - Theme Light', false, 'themeLight'],
	['Panel Library - Themed', false, 'themed'], // reserved: don't enable
	['Panel Library - Touch Step 1-10', 1, 'touchStep'],
	['Panel Library - Tree Auto Expand', false, 'treeAutoExpand'],
	['Panel Library - Tree Auto Expand Single Items', true, 'treeAutoExpandSingle'],
	['Panel Library - Tree Indent', Math.round(19 * $Lib.scale), 'treeIndent'],
	['Panel Library - Touch Control', false, 'touchControl'],
	['Panel Library - View By', 1, 'viewBy'],
	['Panel Library - View By Album Art', 0, 'albumArtViewBy'],
	['Panel Library - View By Tree', 0, 'treeViewBy'],
	['Panel Library - Zoom Filter Size (%)', 100, 'zoomFilter'],
	['Panel Library - Zoom Font Size (%)', 100, 'zoomFont'],
	['Panel Library - Zoom Node Size (%)', 100, 'zoomNode'],
	['Panel Library - Zoom Image Size (%)', 100, 'zoomImg'],
	['Panel Library - Zoom Tooltip [Button] (%)', 100, 'zoomTooltipBut']
];

const ppt = new PanelPropertiesLib();
ppt.init('auto', properties);
if (!$Lib.file('C:\\check_local\\1450343922.txt')) ppt.themed = false;

if (ppt.get('Panel Library - Tree List View')) {
	ppt.facetView = ppt.get('Panel Library - Tree List View');
	ppt.set('Panel Library - Tree List View', null);
}
ppt.set('Panel Library - Image Pre-Load Images In Disk Cache', null);
ppt.set('Panel Library - Image Root Collage', null);
ppt.set('Panel Library - Image Show Index Number', null);
ppt.set('Panel Library - Image Show Index Year Auto', null);
ppt.set('Panel Library - Node: Item Show Duration', null);
ppt.set('Panel Library - Node [Squares]: Windows 0 or 1', null);
properties = undefined;
