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
			throw (`invalid property: requires array: [string, any, string]`);
		}

		if (item[2] === 'add') {
			throw (`property_id: ${item[2]}\nThis id is reserved`);
		}

		if (this[item[2]] != null || this[item[2] + '_internal'] != null) {
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
var libraryProps = new PanelPropertiesLib(); // library Preferences
let properties = [
	['Colour Swap', false, 'swapCol'],
	['Cover Auto-Fill', true, 'autoFill'],
	['Cover Opacity (0-100)', 10, 'covAlpha'],

	['Custom Colour Text', '171,171,190', 'text'],
	['Custom Colour Text Highlight', '121,194,255', 'text_h'],
	['Custom Colour Text Selected', '255,255,255', 'textSel'],
	['Custom Colour Text Nowplaying Highlight', 'rgb(121-194-255)', 'nowp'],
	['Custom Colour Search Text', '171,171,190', 'search'],
	['Custom Colour Buttons', '113,125,147', 'txt_box'],
	['Custom Colour Background', '4,39,68', 'bg'],
	['Custom Colour Background Accent', '18,52,85', 'bg_h'],
	['Custom Colour Background Selected', '37,71,108', 'bgSel'],
	['Custom Colour Frame Hover', '35,132,182', 'frame'],
	['Custom Colour Frame Selected', '49,145,198', 'bgSelframe'],
	['Custom Colour Item Counts', '171,171,190', 'counts'],
	['Custom Colour Node Collapse', '171,171,190', 'icon_c'],
	['Custom Colour Node Expand', '171,171,190', 'icon_e'],
	['Custom Colour Node Hover', '121,194,255', 'icon_h'],
	['Custom Colour Node Lines', '48,70,90', 'line'],
	['Custom Colour Separators', '48,71,90', 's_line'],
	['Custom Colour Side Marker', '121,194,255', 'sideMarker'],
	['Custom Colour Transparent Fill', '0,0,0,0.06', 'bgTrans'],

	['Custom Colour Text Use', false, 'textUse'],
	['Custom Colour Text Highlight Use', false, 'text_hUse'],
	['Custom Colour Text Selected Use', false, 'textSelUse'],
	['Custom Colour Text Nowplaying Highlight Use', false, 'nowpUse'],
	['Custom Colour Search Text Use', false, 'searchUse'],
	['Custom Colour Buttons Use', false, 'txt_boxUse'],
	['Custom Colour Background Use', false, 'bgUse'],
	['Custom Colour Background Accent Use', false, 'bg_hUse'],
	['Custom Colour Background Selected Use', false, 'bgSelUse'],
	['Custom Colour Frame Hover Use', false, 'frameUse'],
	['Custom Colour Frame Selected Use', false, 'bgSelframeUse'],
	['Custom Colour Item Counts Use', false, 'countsUse'],
	['Custom Colour Node Collapse Use', false, 'icon_cUse'],
	['Custom Colour Node Expand Use', false, 'icon_eUse'],
	['Custom Colour Node Hover Use', false, 'icon_hUse'],
	['Custom Colour Node Lines Use', false, 'lineUse'],
	['Custom Colour Separators Use', false, 's_lineUse'],
	['Custom Colour Side Marker Use', false, 'sideMarkerUse'],
	['Custom Colour Transparent Fill Use', false, 'bgTransUse'],

	['Custom Font', 'Segoe UI,16,0', 'custFont'],
	['Custom Font Album Art Line 1', 'Segoe UI,1', 'custAlbumArtGrpFont'],
	['Custom Font Album Art Line 2', 'Segoe UI,2', 'custAlbumArtLotFont'],

	['Custom Font Use', false, 'custFontUse'],
	['Custom Font Album Art Line 1 Use', false, 'custAlbumArtGrpFontUse'],
	['Custom Font Album Art Line 2 Use', false, 'custAlbumArtLotFontUse'],

	['Custom Font Node Icon', 'Segoe UI Symbol', 'custIconFont'],
	['Custom Font Scroll Icon', 'Segoe UI Symbol', 'butCustIconFont'],

	['Double-Click Action', 1, 'dblClickAction'],
	['Filter By', 0, 'filterBy'],
	['Font Size Library', 12, 'baseFontSize'],
	['Full Line Selection', true, 'fullLineSelection'],
	['Height', 578, 'pn_h'],
	['Height Auto [Expand/Collapse With Root]', false, 'pn_h_auto'],
	['Height Auto-Collapse', 100, 'pn_h_min'],
	['Height Auto-Expand', 578, 'pn_h_max'],
	['Highlight Nowplaying', true, 'highLightNowplaying'],
	['Highlight Row', 1, 'highLightRow'],
	['Highlight Text', false, 'highLightText'],
	['Hot Key [Focus Not Needed]: 1-10 // Assign Spider Monkey Panel index in keyboard shortcuts', 'CollapseAll,0,PlaylistAdd,0,PlaylistInsert,0,PlaylistNew,0,Search,0,SearchClear,0', 'hotKeys'],

	['Image Blur Background Auto-Fill', false, 'blurAutofill'],
	['Image Blur Background Level (%)', 90, 'blurTemp'],
	['Image Blur Background Opacity (%)', 30, 'blurAlpha'],
	['Image Current Root', 3, 'curRootImg'],
	['Image Current No Artist', 2, 'curNoArtistImg'],
	['Image Current No Cover', 9, 'curNoCoverImg'],
	['Image Disk Cache Enabled', true, 'albumArtDiskCache'],
	['Image Group Level', 0, 'albumArtGrpLevel'],
	['Image Flip Labels', false, 'albumArtFlipLabels'],
	['Image Flow Mode', false, 'albumArtFlowMode'],
	['Image Follow Selection Flow Mode', true, 'flowModeFollowSelection'],
	['Image Follow Selection Standard Mode', false, 'stndModeFollowSelection'],
	['Image Item Overlay', 1, 'itemOverlayType'],
	['Image Label', 1, 'albumArtLabelType'],
	['Image Memory Limit MB (0 = default)', 0, 'memoryLimit'],
	['Image No Artist Images', JSON.stringify([]), 'noArtistImages'],
	['Image No Cover Images', JSON.stringify([]), 'noCoverImages'],
	['Image Pre-Load Images In Disk Cache', true, 'albumArtPreLoad'],
	['Image Root Images', JSON.stringify([]), 'rootImages'],
	['Image Show Album Art', false, 'albumArtShow'],
	['Image Show Index Letter', true, 'albumArtLetter'],
	['Image Show Options', true, 'albumArtOptionsShow'],
	['Image Style [Front] Regular-0 Auto-Fill-1 Circular-2', 1, 'imgStyleFront'],
	['Image Style [Back] Regular-0 Auto-Fill-1 Circular-2', 1, 'imgStyleBack'],
	['Image Style [Disc] Regular-0 Auto-Fill-1 Circular-2', 1, 'imgStyleDisc'],
	['Image Style [Icon] Regular-0 Auto-Fill-1 Circular-2', 1, 'imgStyleIcon'],
	['Image Style [Artist] Regular-0 Auto-Fill-1 Circular-2', 1, 'imgStyleArtist'],
	['Image Thumbnail Gap Standard', 0, 'thumbNailGapStnd'],
	['Image Thumbnail Gap Compact', 3, 'thumbNailGapCompact'],
	['Image Thumbnail Size', 1, 'thumbNailSize'],
	['Image Type', 0, 'artId'],
	['Image View By: Same As Tree', false, 'artTreeSameView'],

	['Initial Load Filters', true, 'initialLoadFilters'],
	['Initial Load Views', true, 'initialLoadViews'],
	['Key: Send to Playlist', 0, 'keyAction'],
	['Library Auto-Sync', true, 'libAutoSync'],
	['Library Source', 1, 'libSource'],
	['Library Source: Active Playlist Follow Focus', true, 'followPlaylistFocus'],
	['Library Source: Fixed Playlist', false, 'fixedPlaylist'],
	['Library Source: Fixed Playlist Name', '', 'fixedPlaylistName'],


	['Limit Menu Expand: 10-6000', 500, 'treeExpandLimit'],
	['Limit Tree Auto Expand: 10-1000', 350, 'autoExpandLimit'],
	['Line Padding', 5, 'verticalPad'],
	['Line Padding Album Art', 2, 'verticalAlbumArtPad'],
	['Margin', Math.round(scaleForDisplay(20) * $Lib.scale), 'margin'],

	['Node: Auto Collapse', false, 'autoCollapse'],
	['Node: Highlight on Hover', true, 'highLightNode'],
	['Node: Item Counts Align Right', true, 'countsRight'],
	['Node: Item Counts Hide-0 Tracks-1 Sub-Items-2', 1, 'nodeCounts'],
	['Node: Root Hide-0 All Music-1 View Name-2', 3, 'rootNode'],
	['Node: Root Inline Style', true, 'inlineRoot'],
	['Node: Show Lines', true, 'nodeLines'],
	['Node: Show Tracks', true, 'showTracks'],
	['Node: Style', 4, 'nodeStyle'],
	['Node [Squares]: Windows 0 or 1', false, 'winNode'],
	['Node Custom Icon: +|-', '\uE013|\uE015', 'iconCustom'],
	['Node Custom Icon: Vertical Offset (%)', -2, 'iconVerticalPad'],
	['Play on Enter or Send from Menu', false, 'autoPlay'],
	['Playlist: Add to Current [Alt+Click]', false, 'altAddToCur'],
	['Playlist: Add to Current [MiddleClick]', true, 'mbtnAddToCur'],
	['Playlist: Custom Sort', '', 'customSort'],
	['Playlist: Default', 'Library View', 'libPlaylist'],
	['Playlist: Default Activate on Change', true, 'activateOnChange'],
	['Playlist: Send to Current', false, 'sendToCur'],
	['Prefixes to Strip or Swap (| Separator)', 'A|The', 'prefix'],
	['Preset: Load Current View', true, 'presetLoadCurView'],
	['Remember.Proc', false, 'process'],
	['Remember.Tree', true, 'rememberTree'],
	['Remember.View', false, 'rememberView'],
	['Reset Tree', false, 'reset'],
	['Row Stripes', false, 'rowStripes'],

	['Scroll Step 0-10 (0 = Page)', 3, 'scrollStep'],
	['Scroll Smooth Duration 0-5000 msec (Max)', 500, 'durationScroll'],
	['Scroll Touch Flick Distance 0-10', 0.8, 'flickDistance'],
	['Scroll Touch Flick Duration 0-5000 msec (Max)', 3000, 'durationTouchFlick'],
	['Scroll: Smooth Scroll', true, 'smooth'],
	['Scrollbar Arrow Custom Icon', '\uE0A0', 'arrowSymbol'],
	['Scrollbar Arrow Custom Icon: Vertical Offset (%)', -24, 'sbarButPad'],
	['Scrollbar Arrow Width', Math.round(11 * $Lib.scale), 'sbarArrowWidth'],
	['Scrollbar Button Type', 0, 'sbarButType'],
	['Scrollbar Colour Grey-0 Blend-1', 1, 'sbarCol'],
	['Scrollbar Grip MinHeight', Math.round(scaleForDisplay(20) * $Lib.scale), 'sbarGripHeight'],
	['Scrollbar Height Prefer Full', true, 'sbarFullHeight'],
	['Scrollbar Narrow Bar Width (0 = Auto)', 0, 'narrowSbarWidth'],
	['Scrollbar Padding', 0, 'sbarPad'],
	['Scrollbar Show', 1, 'sbarShow'],
	['Scrollbar Type Default-0 Styled-1 Windows-2', 1, 'sbarType'],
	['Scrollbar Width', Math.round(11 * $Lib.scale), 'sbarWidth'],
	['Scrollbar Width Bar', 11, 'sbarBase_w'],
	['Scrollbar Windows Metrics', false, 'sbarWinMetrics'],

	['Search Enter', false, 'searchEnter'],
	['Search History', JSON.stringify([]), 'searchHistory'],
	['Search Send', 1, 'searchSend'],

	['Show Filter', true, 'filterShow'],
	['Show Panel Source Message', true, 'panelSourceMsg'],
	['Show Search', true, 'searchShow'],
	['Show Settings', true, 'settingsShow'],
	['Single-Click Action', 0, 'clickAction'],
	['Theme', 0, 'theme'],
	['Tooltips', true, 'tooltips'],
	['Touch Step 1-10', 1, 'touchStep'],
	['Tree Auto Expand', false, 'treeAutoExpand'],
	['Tree Auto Expand Single Items', true, 'treeAutoExpandSingle'],
	['Tree Indent', Math.round(19 * $Lib.scale), 'treeIndent'],
	['Tree List View', false, 'treeListView'],
	['Touch Control', false, 'touchControl'],
	['View By', 2, 'viewBy'],
	['View By Album Art', 0, 'albumArtViewBy'],
	['View By Tree', 0, 'treeViewBy'],
	['Zoom Filter Size (%)', 100, 'zoomFilter'],
	['Zoom Font Size (%)', 100, 'zoomFont'],
	['Zoom Node Size (%)', 100, 'zoomNode'],
	['Zoom Image Size (%)', 100, 'zoomImg'],
	['Zoom Tooltip [Button] (%)', 100, 'zoomTooltipBut']
];

class PanelPropertiesUpdate {
	getOrig(name) {
		return window.GetProperty(`\u200A${name}`);
	}

	setNew(name, new_value) {
		window.SetProperty(name, new_value);
	}

	setOrigNull(name) {
		window.SetProperty(`\u200A${name}`, null);
	}

	update(properties) {
		if (this.getOrig(' View 01: Name // Pattern') === null) return;
		let prop, val;
		let nm = '';
		for (let i = 1; i < 100; i++) {
			prop = i == 1 ? ` View by Folder Structure: Name // Pattern` : ` View ${$Lib.padNumber(i - 1, 2)}: Name // Pattern`;
			nm = this.getOrig(prop);
			if (nm && nm != ' // ') this.setNew(`View ${$Lib.padNumber(i, 2)}: Name // Pattern`, nm);
			this.setOrigNull(prop);
		}

		for (let i = 1; i < 100; i++) {
			prop = ` View Filter ${$Lib.padNumber(i, 2)}: Name // Query`;
			nm = this.getOrig(prop);
			if (nm && nm != ' // ') {
				this.setNew(`Filter ${$Lib.padNumber(i, 2)}: Name // Query`, i == 1 ? `Filter // Button Name` : nm);
			}
			this.setOrigNull(prop);
		}

		const cusUsed = this.getOrig('_CUSTOM COLOURS/FONTS: USE');
		let names = [
			'_Custom.Font (Name,Size,Style[0-4])',
			'_Custom.Colour Background',
			'_Custom.Colour Background Highlight',
			'_Custom.Colour Background Selected',
			'_Custom.Colour Frame Highlight',
			'_Custom.Colour Frame Selected',
			'_Custom.Colour Item Counts',
			'_Custom.Colour Node Collapse',
			'_Custom.Colour Node Expand',
			'_Custom.Colour Node Highlight',
			'_Custom.Colour Node Lines',
			'_Custom.Colour Search Name',
			'_Custom.Colour Search Line',
			'_Custom.Colour Search Text',
			'_Custom.Colour Side Marker',
			'_Custom.Colour Text',
			'_Custom.Colour Text Highlight',
			'_Custom.Colour Text Nowplaying',
			'_Custom.Colour Text Selected',
			'_Custom.Colour Transparent Fill',
		];
		let props = [
			'Custom Font Use',
			'Custom Colour Background Use',
			'Custom Colour Background Accent Use',
			'Custom Colour Background Selected Use',
			'Custom Colour Frame Hover Use',
			'Custom Colour Frame Selected Use',
			'Custom Colour Item Counts Use',
			'Custom Colour Node Collapse Use',
			'Custom Colour Node Expand Use',
			'Custom Colour Node Hover Use',
			'Custom Colour Node Lines Use',
			'Custom Colour Buttons Use',
			'Custom Colour Separators Use',
			'Custom Colour Search Text Use',
			'Custom Colour Side Marker Use',
			'Custom Colour Text Use',
			'Custom Colour Text Highlight Use',
			'Custom Colour Text Nowplaying Highlight Use',
			'Custom Colour Text Selected Use',
			'Custom Colour Transparent Fill Use'
		];
		if (cusUsed) {
			names.forEach((n, i) => {
				val = this.getOrig(n);
				if (val && val.length) this.setNew(props[i], true);
			});
		}
		props = [
			'Custom Font',
			'Custom Colour Background',
			'Custom Colour Background Accent',
			'Custom Colour Background Selected',
			'Custom Colour Frame Hover',
			'Custom Colour Frame Selected',
			'Custom Colour Item Counts',
			'Custom Colour Node Collapse',
			'Custom Colour Node Expand',
			'Custom Colour Node Hover',
			'Custom Colour Node Lines',
			'Custom Colour Buttons',
			'Custom Colour Separators',
			'Custom Colour Search Text',
			'Custom Colour Side Marker',
			'Custom Colour Text',
			'Custom Colour Text Highlight',
			'Custom Colour Text Nowplaying Highlight',
			'Custom Colour Text Selected',
			'Custom Colour Transparent Fill'
		];
		names.forEach((n, i) => {
			val = this.getOrig(n);
			if (val && val.length) this.setNew(props[i], val);
			this.setOrigNull(n);
		});
		names = [
			' Node: Custom Icon: Vertical Padding',
			' Scrollbar Arrow Custom: Icon: Vertical Offset %',
			' Scrollbar Narrow Bar Width 2-10 (0 = Default)',
			'ADV.Image Blur Background Level (0-100)',
			'ADV.Image Blur Background Opacity (0-100)',
			'ADV.Scrollbar Height Always Full',
			'ADV.Touch Flick Distance 0-10',
			'SYSTEM.Playlist: ADD to Default [Alt+Click]',
			'SYSTEM.Playlist: ADD to Default [MiddleClick]',
			'SYSTEM.Tree'
		];
		props = [
			'Node Custom Icon: Vertical Offset (%)',
			'Scrollbar Arrow Custom Icon: Vertical Offset (%)',
			'Scrollbar Narrow Bar Width (0 = Auto)',
			'Image Blur Background Level (%)',
			'Image Blur Background Opacity (%)',
			'Scrollbar Height Prefer Full',
			'Scroll Touch Flick Distance 0-10',
			'Playlist: Add to Current [Alt+Click]',
			'Playlist: Add to Current [MiddleClick]',
			'Tree'
		];

		names.forEach((n, i) => {
			this.setNew(props[i], this.getOrig(n));
			this.setOrigNull(n);
		});
		names = [' Node: Custom (No Lines)', ' Node: Line Colour: Grey-0 Blend-1 Text-2', ' Search: Line Colour: Grey-0 Blend-1 Text-2', ' Search Style: Fade-0 Blend-1 Norm-2 Highlight-3', '_CUSTOM COLOURS/FONTS: EMPTY = DEFAULT', '_CUSTOM COLOURS/FONTS: USE', 'ADV.Zoom Key CTRL+ALT-0 CTRL-1 ALT-2 ESC-3 TAB-4', 'SYSTEM.Properties Updated', 'SYSTEM.Search: Hide-0, SearchOnly-1, Search+Filter-2', 'SYSTEM.Software Notice Checked'];
		names.forEach(n => this.setOrigNull(n));
		names = props = undefined;

		const p1 = ['SYSTEM.Remember.Tree', 'SYSTEM.Remember.View'];
			const p2 = ['Remember.Tree', 'Remember.View'];
		p1.forEach((v, i) => {
			val = this.getOrig(v);
			this.setNew(p2[i], val === 0 ? false : true);
			this.setOrigNull(v);
		});

		prop = ' Scrollbar Type Default-0 Styled-1 Themed-2';
		val = parseInt(this.getOrig(prop));
		if (typeof val !== 'number') val = 0;
		val = $Lib.clamp(val, 0, 2);
		this.setNew('Scrollbar Type Default-0 Styled-1 Windows-2', val);
		this.setOrigNull(prop);

		prop = ' Node: Custom Icon: +|- // Examples';
		val = this.getOrig(prop);
		if (typeof val === 'string') {
			let ch = val.split(',')[0].trim();
			if (ch.length) {
				ch = ch.split('//')[0].trim();
				if (ch.includes('|')) this.setNew('Node Custom Icon: +|-', ch);
			}
		}
		this.setOrigNull(prop);

		prop = ' Scrollbar Arrow Custom: Icon // Examples';
		val = this.getOrig(prop);
		if (typeof val === 'string') {
			const ch = val.charAt();
			if (ch.length) this.setNew('Scrollbar Arrow Custom Icon', ch);
		}
		this.setOrigNull(prop);

		prop = '_Custom.Font Icon [Scroll] (Name,Style[0or1])';
		val = this.getOrig(prop);
		if (typeof val === 'string') {
			const ch = val.split(',')[0].trim();
			if (ch.length) this.setNew('Custom Font Scroll Icon', ch);
		}
		this.setOrigNull(prop);

		prop = '_Custom.Font Icon [Node] (Name,Style[0or1])';
		val = this.getOrig(prop);
		if (typeof val === 'string') {
			const ch = val.split(',')[0].trim();
			if (ch.length) this.setNew('Custom Font Node Icon', ch);
		}
		this.setOrigNull(prop);

		prop = ' Scrollbar Size';
		val = this.getOrig(prop);
		if (typeof val === 'string') {
			val = $Lib.split(val, 0);
			if (val.length == 8) {
				const sbarWidth = $Lib.clamp($Lib.value(val[1], 11, 0), 0, 400);
				this.setNew('Scrollbar Width', sbarWidth)
				this.setNew('Scrollbar Arrow Width', Math.min($Lib.value(val[3], 11, 0), sbarWidth, 400));
				this.setNew('Scrollbar Padding', $Lib.value(val[5], 0, 0));
				this.setNew('Scrollbar Grip MinHeight', $Lib.value(val[7], 12, 0));
			}
		}
		this.setOrigNull(prop);

		prop = 'ADV.Hot Key: 1-10 // Assign Spider Monkey Panel index in keyboard shortcuts';
		val = this.getOrig(prop);
		if (typeof val === 'string') {
			this.setNew('Hot Key [Focus Not Needed]: 1-10 // Assign Spider Monkey Panel index in keyboard shortcuts', val);
		}
		this.setOrigNull(prop);

		prop = 'ADV.Library Sync: Auto-0, Initialisation Only-1';
		val = this.getOrig(prop);
		this.setNew('Library Auto-Sync', val == 0 ? true : false);
		this.setOrigNull(prop);

		prop = 'ADV.Smooth Duration 0-5000 msec (Max)';
		val = this.getOrig(prop);
		if (typeof val === 'string') {
			val = $Lib.split(val, 0);
			if (val.length == 4) {
				this.setNew('Scroll Smooth Duration 0-5000 msec (Max)', $Lib.clamp($Lib.value(val[1], 500, 0), 0, 5000));
				this.setNew('Scroll Touch Flick Duration 0-5000 msec (Max)', $Lib.clamp($Lib.value(val[3], 3000, 0), 0, 5000));
			}
		}
		this.setOrigNull(prop);

		prop = ['SYSTEM.Blur Dark Theme', 'SYSTEM.Blur Blend Theme', 'SYSTEM.Blur Light Theme', 'SYSTEM.Image Background'];
		this.setNew('Theme', this.getOrig(prop[0]) ? 1 : this.getOrig(prop[1]) ? 2 : this.getOrig(prop[2]) ? 3 : this.getOrig(prop[3]) ? 4 : 0)
		prop.forEach(v => this.setOrigNull(v));

		prop = 'SYSTEM.Playlist: Send to Default';
		val = this.getOrig(prop);
		if (typeof val === 'boolean') this.setNew('Playlist: Send to Current', !val);
		this.setOrigNull(prop);

		prop = 'ADV.Node [Squares]: Themed 0 or 1';
		val = parseInt(this.getOrig(prop));
		if (typeof val !== 'number') val = 0;
		val = $Lib.clamp(val, 0, 1);
		this.setNew('Node [Squares]: Windows 0 or 1', val);
		this.setOrigNull(prop);

		const pr = [' ', 'ADV.', 'SYSTEM.']
		properties.forEach(v => {
			pr.forEach(w => {
				const val = this.getOrig(w + v[0]);
				if (val !== null) {
					ppt.set(v[0], val);
					this.setOrigNull(w + v[0]);
				}
			})
		});

		ppt.keyAction = ppt.keyAction === true ? 1 : 0;
	}
}

const ppt = new PanelPropertiesLib;
const pptUpdate = new PanelPropertiesUpdate;
pptUpdate.update(properties);
ppt.init('auto', properties);
ppt.set('Image Root Collage', null);
properties = undefined;