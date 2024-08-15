'use strict';

class LibPanel {
	constructor() {
		const DT_CENTER = 0x00000001;
		const DT_RIGHT = 0x00000002;
		const DT_VCENTER = 0x00000004;
		const DT_SINGLELINE = 0x00000020;
		const DT_NOPREFIX = 0x00000800;
		const DT_END_ELLIPSIS = 0x00008000;

		this.cc = DT_CENTER | DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX;
		this.cce = this.cc | DT_END_ELLIPSIS;
		this.curPattern = '';
		this.defaultViews = [];
		this.defFilterPatterns = [];
		this.defViewPatterns = [];
		this.dialogFiltGrps = [];
		this.dialogGrps = [];
		this.draw = true;
		this.folder_view = 10;
		this.folderView = false;
		this.grp = [];
		this.imgView = libSet.albumArtShow;
		this.init = true;
		this.l = DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX;
		this.lc = DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX | DT_END_ELLIPSIS;
		this.lines = libSet.albumArtGrpLevel ? libSet.albumArtGrpLevel : [2, 2, 2, 1, 1][libSet.artId];
		this.list = new FbMetadbHandleList();
		this.menu = [];
		this.paint_y = Math.floor(lib.ui.style.topBarShow || !libSet.sbarShow ? lib.ui.row.h * 1.2 : 0);
		this.pn_h_auto = libSet.pn_h_auto && libSet.rootNode;
		this.propNames = [];
		this.newView = true;
		this.pos = -1;
		this.rc = DT_RIGHT | DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX | DT_END_ELLIPSIS;
		this.rootName = '';
		this.s_lc = StringFormat(0, 1);
		this.samePattern = true;
		this.sbar_x = 0;
		this.softSplitter = '\u00ac';
		this.splitter = '\u00a6';
		this.sortBy = '';
		this.sourceName = '';
		this.statistics = false;
		this.viewName = '';
		this.zoomFilter = Math.max(libSet.zoomFilter / 100, 0.7);
		libSet.zoomFilter = this.zoomFilter * 100;

		this.filter = {
			menu: [],
			mode: [],
			x: 0,
			y: 0,
			w: 0
		};

		this.last_pressed_coord = {
			x: -1,
			y: -1
		};

		this.ln = {
			x: 0,
			w: 100
		};

		this.m = {
			x: -1,
			y: -1
		};

		this.search = {
			active: false,
			cursor: false,
			txt: '',
			x: 0,
			w: 100,
			h: 25,
			sp: 25
		};

		this.settings = {};

		this.tree = {
			sel: {
				w: 0
			},
			stripe: {
				w: 0
			},
			w: 0,
			y: 0
		};

		libSet.get('Panel Library - Library Tree Dialog Box', JSON.stringify({
			w: 85,
			h: 60,
			def_w: 85,
			def_h: 60,
			page: 'behaviour',
			version: `v${window.ScriptInfo.Version}`
		}));

		if (this.pn_h_auto) {
			window.MaxHeight = window.MinHeight = libSet.pn_h;
		}

		this.setTopBar();
		this.getViews();
		this.getFilters();
		libSet.initialLoadFilters = false;
		libSet.initialLoadViews = false;
		this.getFields(libSet.viewBy, libSet.filterBy);
	}

	// * METHODS * //

	calcText() {
		lib.ui.style.topBarShow = libSet.filterShow || libSet.searchShow || libSet.settingsShow;
		if (!lib.ui.style.topBarShow) return;
		$Lib.gr(1, 1, false, g => {
			this.filter.w = libSet.filterShow ? g.CalcTextWidth(this.filter.mode[libSet.filterBy].name, this.filter.font) + (libSet.searchShow ? Math.max(libSet.margin * 2 + (!libSet.settingsBtnStyle ? 2 : 0), 12) : 0) : 0;
			this.settings.w = libSet.settingsShow ? Math.round(g.MeasureString(this.settings.icon, this.settings.font, 0, 0, 500, 500).Width) : 0;
		});
		switch (true) {
			case libSet.settingsShow && libSet.searchShow:
				this.filter.x = lib.ui.x + lib.ui.w - lib.ui.sz.marginSearch - this.filter.w - this.settings.w + this.settings.offset;
				break;
			case !libSet.searchShow:
				this.filter.x = lib.ui.x + lib.ui.sz.marginSearch;
				break;
			case !libSet.settingsShow:
				this.filter.x = lib.ui.x + lib.ui.w - lib.ui.sz.marginSearch - this.filter.w;
				break;
			case !libSet.filterShow:
				this.filter.x = lib.ui.x + lib.ui.w - lib.ui.sz.marginSearch * 2 - this.settings.w + this.settings.offset;
				break;
		}
		this.search.x = Math.round(lib.ui.sz.marginSearch + lib.ui.row.h);
		this.search.w = libSet.searchShow && (libSet.filterShow || libSet.settingsShow) ? this.filter.x - this.search.x - 11 : lib.ui.w - lib.ui.sz.marginSearch - Math.round(lib.ui.row.h * 0.75) - this.search.x + 1;
	}

	clear(type) {
		if (type == 'views' || type == 'both') {
			for (let i = 0; i < 100; i++) {
				libSet.set(`Panel Library - View ${$Lib.padNumber(i, 2)}: Name // Pattern`, null);
			}
		}
		if (type == 'filters' || type == 'both') {
			for (let i = 0; i < 100; i++) libSet.set(`Panel Library - Filter ${$Lib.padNumber(i, 2)}: Name // Query`, null);
		}
	}

	forcePaint() {
		window.RepaintRect(lib.ui.x, lib.ui.y, lib.ui.w, lib.ui.h, true);
	}

	getFields(view, filter, grpsOnly) {
		this.newView = libSet.viewBy != view;
		libSet.filterBy = filter;
		libSet.viewBy = view;
		const prefix = libSet.prefix.split('|');
		let grps = [];
		let ix1 = -1;
		let ix2 = -1;
		this.filter.mode = [];
		this.folder_view = 10;
		this.grp = [];
		this.multiPrefix = false;
		this.multiProcess = false;
		this.noDisplay = false;
		this.playlistSort = '';
		this.statistics = false;
		this.view = '';
		this.view_ppt.forEach((v, i) => {
			if (v.includes('//')) {
				grps = v.split('//');
				this.grp[i] = {
					name: grps[0].trim(),
					type: grps[1]
				};
			}
		});

		grps = [];
		this.filter_ppt.forEach((v, i) => {
			if (v.includes('//')) {
				grps = v.split('//');
				this.filter.mode[i] = {
					name: grps[0].trim(),
					type: grps[1].trim()
				};
			}
		});

		const findClosingBrace = (str, pos) => {
			let depth = 1;
			for (let l = pos + 1; l < str.length; l++) {
				switch (str[l]) {
					case '{':
						depth++;
						break;
					case '}':
						if (--depth == 0) return l;
						break;
				}
			}
			return -1;
		};
		const indexOfAll = (str, item) => {
			const indices = [];
			for (let pos = str.indexOf(item); pos !== -1; pos = str.indexOf(item, pos + 1)) indices.push(pos);
			return indices.reverse();
		};
		const name = v => v.name;
		const removeEmpty = v => v && v.name != '' && v.type != '';

		this.grp = this.grp.filter(removeEmpty);
		this.filter.mode = this.filter.mode.filter(removeEmpty);
		this.folder_view = this.grp.length - 1;
		libSet.filterBy = Math.min(libSet.filterBy, this.filter.mode.length - 1);
		libSet.viewBy = Math.min(libSet.viewBy, this.grp.length - 1);
		this.folderView = libSet.viewBy == this.folder_view;
		if (grpsOnly) return;
		this.colMarker = this.grp[libSet.viewBy].type.includes('$colour{');
		let valid = false;
		if (lib.ui.img.blurDark && libSet.text_hUse) {
			const c = libSet.text_h.replace(/[^0-9.,-]/g, '').split(/[,-]/);
			if (c.length == 3 || c.length == 4) valid = true;
		}
		this.textDiffHighlight = lib.ui.img.blurDark && !libSet.highLightRow && !(libSet.text_hUse && valid) && libSet.highLightText && !this.colMarker;
		if (this.folderView) {
			this.samePattern = !this.newView && !this.init;
		} else {
			this.sortBy = this.view = this.grp[libSet.viewBy].type;
			this.samePattern = !this.colMarker && this.curPattern == this.view;
		}
		this.curPattern = this.view;
		this.lines = libSet.albumArtGrpLevel ? libSet.albumArtGrpLevel : [2, 2, 2, 1, 1][libSet.artId];

		if (!this.folderView) {
			this.statistics = /play(_|)count|auto(_|)rating/.test(this.view);
			if (this.view.includes('%<') || this.view.includes(this.splitter)) this.multiProcess = true;
			if (this.multiProcess) {
				if (this.view.includes('$swapbranchprefix{') || this.view.includes('$stripbranchprefix{')) this.multiPrefix = true;
				this.playlistSort = FbTitleFormat(`${this.view.includes('album artist') || !this.view.includes('%artist%') && !this.view.includes('%<artist>%') && !this.view.includes('$meta(artist') ? '%album artist%' : '%artist%'}  %album%  [[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%`);
			}
			while (this.view.includes('$stripbranchprefix{')) {
				ix1 = this.view.indexOf('$stripbranchprefix{');
				ix2 = findClosingBrace(this.view, ix1 + 18);
				const mvIndices = indexOfAll(this.view, '%<');
				this.sortBy = this.view = $Lib.replaceAt(this.view, ix2, `,${prefix})`);
				mvIndices.forEach(v => {
					if (v > ix1 && v < ix2) this.view = `${this.view.slice(0, v)}~~${this.view.slice(v)}`;
				});
				this.sortBy = this.sortBy.replace(/\$stripbranchprefix{/, '$$stripprefix(').replace(/~~%/, '%');
				this.view = this.view.replace(/\$stripbranchprefix{/, '$$stripprefix(');
			}
			while (this.view.includes('$swapbranchprefix{')) {
				ix1 = this.view.indexOf('$swapbranchprefix{');
				ix2 = findClosingBrace(this.view, ix1 + 17);
				const mvIndices = indexOfAll(this.view, '%<');
				this.sortBy = this.view = $Lib.replaceAt(this.view, ix2, `,${prefix})`);
				mvIndices.forEach(v => {
					if (v > ix1 && v < ix2) this.view = `${this.view.slice(0, v)}~${this.view.slice(v)}`;
				});
				this.sortBy = this.sortBy.replace(/\$swapbranchprefix{/, '$$swapprefix(').replace(/~%/, '%');
				this.view = this.view.replace(/\$swapbranchprefix{/, '$$swapprefix(');
			}
			this.sortBy = this.sortBy.trimStart().replace(RegExp(this.splitter, 'g'), '  ');
			this.view = this.view.trimStart().replace(RegExp(`\\s*${this.splitter}\\s*`, 'g'), this.softSplitter);
			if (this.multiProcess) {
				this.sortBy = this.sortBy.replace(/[<>]/g, '');
				const baseTag = [];
				const origTag = [];
				const rxp = !this.multiPrefix ? /%<.*?>%/g : /(~~%<|~%<|%<).*?>%/g;
				let cur_match;
				while ((cur_match = rxp.exec(this.view))) {
					origTag.push(cur_match[0]);
					baseTag.push(cur_match[0].replace('~~%', '%').replace('~%', '%').replace(/[<>]/g, ''));
				}
				origTag.forEach((v, i) => {
					const qMark = baseTag[i];
					this.view = this.view.replace(RegExp(v), `$if2(${v},${qMark})`);
				});
				this.view = this.view.replace(/%<album artist>%/i, '$if3(%<#album artist#>%,%<#artist#>%,%<#composer#>%,%<#performer#>%)').replace(/%<album>%/i, '$if2(%<#album#>%,%<#venue#>%)').replace(/%<artist>%/i, '$if3(%<artist>%,%<album artist>%,%<composer>%,%<performer>%)').replace(/<#/g, '<').replace(/#>/g, '>');
			}
			if (this.multiProcess) this.view = this.view.replace(/%</g, '#!#$meta_sep(').replace(/>%/g, ',@@)#!#');
			this.sortBy = this.sortBy.replace(/\|/g, this.splitter);
			this.view = this.view.replace(/\|/g, this.splitter);
			if (this.view.includes('$nodisplay{')) this.noDisplay = true;

			while (this.view.includes('$nodisplay{')) {
				ix1 = this.view.indexOf('$nodisplay{');
				ix2 = this.view.indexOf('}', ix1);
				const sub1 = this.view.substring(0, ix1 + 11);
				const sub2 = this.view.substring(ix1 + 11, ix2);
				const sub3 = this.view.substring(ix2);
				this.view = sub1 + sub2.replace(/[\u00a6|]/g, '') + sub3;
				ix1 = this.view.indexOf('$nodisplay{');
				ix2 = this.view.indexOf('}', ix1);
				this.view = $Lib.replaceAt(this.view, ix2, '  #@#');
				this.view = this.view.replace('$nodisplay{', '#@#');
			}
			if (this.colMarker) {
				while (this.view.includes('$colour{')) {
					ix1 = this.view.indexOf('$colour{');
					ix2 = this.view.indexOf('}', ix1);
					this.view = $Lib.replaceAt(this.view, ix2, '@!#');
					this.view = this.view.replace('$colour{', '@!#');
				}
				const colView = this.view.split('@!#');
				colView.forEach((v, i, arr) => {
					if (i % 2 === 1) {
						const colSplit = v.split(',');
						arr[i] = `@!#${lib.ui.setMarkerCol(colSplit[0]) || (!libSet.albumArtShow || libSet.albumArtLabelType != 4 ? lib.ui.col.text : RGB(240, 240, 240))}\`${lib.ui.setMarkerCol(colSplit[1]) || (libSet.highLightText ? lib.ui.col.text_h : (!libSet.albumArtShow || libSet.albumArtLabelType != 4 ? lib.ui.col.text : RGB(240, 240, 240)))}\`${lib.ui.setMarkerCol(colSplit[2]) || (!libSet.albumArtShow || libSet.albumArtLabelType != 4 ? lib.ui.col.textSel : lib.ui.col.text)}@!#`;
					}
				});
				this.view = colView.join('');
			}
			if (lib.ui.col.counts) this.colMarker = true;
			if (this.colMarker) this.sortBy = this.sortBy.replace(/\$colour{.*?}/g, '');
			while (this.sortBy.includes('$nodisplay{')) {
				ix1 = this.sortBy.indexOf('$nodisplay{');
				ix2 = this.sortBy.indexOf('}', ix1);
				this.sortBy = $Lib.replaceAt(this.sortBy, ix2, '  ');
				this.sortBy = this.sortBy.replace('$nodisplay{', '  ');
			}
			this.sortBy = this.sortBy.replace(RegExp(this.splitter, 'g'), '  ');
		}
		this.pn_h_auto = libSet.pn_h_auto && libSet.rootNode;
		if (this.pn_h_auto) window.MaxHeight = window.MinHeight = libSet.pn_h;
		else {
			window.MaxHeight = 2147483647;
			window.MinHeight = 0;
		}
		this.setRootName();
		this.filter.menu = this.filter.mode.map(name);
		this.menu = this.grp.map(name);
	}

	getFilterIndex(arr, name, type) {
		const findFilterIndex = arr.findIndex(v => v.name === name && v.type === type);
		if (findFilterIndex != -1) libSet.filterBy = findFilterIndex;
		return findFilterIndex;
	}

	getFilters() {
		let pt = [
			['Panel Library - Filter 01: Name // Query', 'Filter // Button Name'],
			['Panel Library - Filter 02: Name // Query', 'Lossless // "$info(encoding)" IS lossless'],
			['Panel Library - Filter 03: Name // Query', 'Lossy // "$info(encoding)" IS lossy'],
			['Panel Library - Filter 04: Name // Query', 'Missing Replaygain // %replaygain_track_gain% MISSING'],
			['Panel Library - Filter 05: Name // Query', 'Never Played // %play_count% MISSING'],
			['Panel Library - Filter 06: Name // Query', 'Played Often // %play_count% GREATER 9'],
			['Panel Library - Filter 07: Name // Query', 'Recently Added // %added% DURING LAST 2 WEEKS'],
			['Panel Library - Filter 08: Name // Query', 'Recently Played // %last_played% DURING LAST 2 WEEKS'],
			['Panel Library - Filter 09: Name // Query', 'Top Rated // %rating% IS 5'],
			['Panel Library - Filter 10: Name // Query', 'Nowplaying Artist // artist IS $nowplaying{$meta(artist,0)}']
		];

		let grps = [];
		this.defFilterPatterns = pt.map(v => {
			grps = v[1].split('//');
			return {
				name: grps[0].trim(),
				type: grps[1].trim(),
				menu: true
			};
		});

		const dialogFilters = [];
		this.filter_ppt = [];
		let pptNo = 0;
		for (let i = 0; i < pt.length; i++) {
			const v = pt[i];
			const prop = libSet.initialLoadFilters ? libSet.get(v[0], v[1]) : libSet.get(v[0]);
			if (!i) {
				const defValid = prop && prop.endsWith('// Button Name');
				dialogFilters.push(defValid ? prop : 'Panel Library - Filter // Button Name');
				this.filter_ppt.push(defValid ? prop : 'Panel Library - Filter // Button Name');
				if (!defValid) libSet.set(v[0], v[1]);
				pptNo++;
			}
			else {
				if (prop) {
					if (prop.includes('//') || prop.includes('/hide/')) dialogFilters.push(prop);
					if (prop.includes('//')) this.filter_ppt.push(prop);
				}
				if (prop || prop === null) pptNo++;
			}
		}

		pt = undefined;

		let nm = '';
		for (let i = pptNo + 1; i < 100; i++) {
			nm = libSet.get(`Panel Library - Filter ${$Lib.padNumber(i, 2)}: Name // Query`);
			if (nm) {
				if (nm.includes('//') || nm.includes('/hide/')) dialogFilters.push(nm);
				if (nm.includes('//')) this.filter_ppt.push(nm);
			}
		}

		nm = '';
		this.propNames = [];
		for (let i = 1; i < 100; i++) {
			const propName = `Panel Library - View ${$Lib.padNumber(i, 2)}: Name // Pattern`;
			nm = libSet.get(propName);
			if (nm && nm.includes('//')) {
				this.propNames.push(propName);
			}
		}
		this.propNames.shift();

		this.dialogFiltGrps = dialogFilters.map(v => {
			if (v.includes('//')) {
				grps = v.split('//');
				return {
					name: grps[0].trim(),
					type: grps[1].trim(),
					menu: true
				};
			} else if (v.includes('/hide/')) {
				grps = v.split('/hide/');
				return {
					name: grps[0].trim(),
					type: grps[1].trim(),
					menu: false
				};
			}
		});

		// move filter button to end
		this.dialogFiltGrps.push(this.dialogFiltGrps.shift());
		this.defFilterPatterns.push(this.defFilterPatterns.shift());
	}

	getViewIndex(arr, name, type) {
		const findViewIndex = arr.findIndex(v => v.name.trim() === name && v.type.trimStart() === type);
		if (findViewIndex != -1) libSet.viewBy = findViewIndex;
		return findViewIndex;
	}

	getViews() {
		let pt = [
			['Panel Library - View 01: Name // Pattern', 'View by Folder Structure // Pattern Not Configurable'],
			['Panel Library - View 02: Name // Pattern', 'View by Artist // %artist%|[%album%]|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%'],
			['Panel Library - View 03: Name // Pattern', 'View by Album Artist // %album artist%|[%album%]|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%'],
			['Panel Library - View 04: Name // Pattern', 'View by Album Artist | Album // [%album artist% - ][%album%]|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%'],
			['Panel Library - View 05: Name // Pattern', 'View by Album // %album% - [%album artist%]|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%'],
			['Panel Library - View 06: Name // Pattern', 'View by Composer // [%<composer>%]|[%album%]|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%'],
			['Panel Library - View 07: Name // Pattern', 'View by Country // %artistcountry%|[%album artist%]|[%album%]|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%'],
			['Panel Library - View 08: Name // Pattern', 'View by Country | Genre // %artistcountry%|%<genre>%|[%album artist% - ]%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%'],
			['Panel Library - View 09: Name // Pattern', 'View by Genre // %<genre>%|[%album artist% - ]%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%'],
			['Panel Library - View 10: Name // Pattern', 'View by Label // %label%|[%album artist%]|[%album%]|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%'],
			['Panel Library - View 11: Name // Pattern', 'View by Year // %date%|[%album artist% - ]%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%']
		];
		let grps = [];
		this.defViewPatterns = pt.map(v => {
			grps = v[1].split('//');
			return {
				name: grps[0].trim(),
				type: grps[1].trimStart(),
				menu: true
			};
		});

		this.defaultViews = this.defViewPatterns.map(v => v.type);
		this.defaultViews.shift();

		const names1 = ['Artist', 'Album Artist', 'Album', 'Album', 'Genre', 'Year'];
		const names2 = ['Album', 'Album', 'Track', 'Track', 'Album', 'Album'];
		const albumArtGrpNames = $Lib.jsonParse(libSet.albumArtGrpNames, {});
		this.defaultViews.forEach((v, i) => {
			if (!albumArtGrpNames[`${v}1`]) albumArtGrpNames[`${v}1`] = names1[i];
			if (!albumArtGrpNames[`${v}2`]) albumArtGrpNames[`${v}2`] = names2[i];
		});

		const dialogViews = [];
		this.view_ppt = [];
		let pptNo = 0;
		for (let i = 0; i < pt.length; i++) {
			const v = pt[i];
			const prop = libSet.initialLoadViews ? libSet.get(v[0], v[1]) : libSet.get(v[0]);
			if (!i) {
				const defValid = prop && prop.endsWith('// Pattern Not Configurable');
				dialogViews.push(defValid ? prop : 'Panel Library - View by Folder Structure // Pattern Not Configurable');
				this.view_ppt.push(defValid ? prop : 'Panel Library - View by Folder Structure // Pattern Not Configurable');
				if (!defValid) libSet.set(v[0], v[1]);
				pptNo++;
			}
			else if (prop) {
				if (prop.includes('//') || prop.includes('/hide/')) dialogViews.push(prop);
				if (prop.includes('//')) this.view_ppt.push(prop);
				pptNo++;
			}
		}

		pt = undefined;
		let nm = 0;
		for (let i = pptNo + 1; i < 100; i++) {
			nm = libSet.get(`Panel Library - View ${$Lib.padNumber(i, 2)}: Name // Pattern`);
			if (nm) {
				if (nm.includes('//') || nm.includes('/hide/')) dialogViews.push(nm);
				if (nm.includes('//')) this.view_ppt.push(nm);
			}
		}

		this.dialogGrps = dialogViews.map(v => {
			if (v.includes('//')) {
				grps = v.split('//');
				return {
					name: grps[0].trim(),
					type: grps[1].trimStart(),
					menu: true
				};
			} else if (v.includes('/hide/')) {
				grps = v.split('/hide/');
				return {
					name: grps[0].trim(),
					type: grps[1].trimStart(),
					menu: false
				};
			}
		});

		// move folder structure to end
		this.dialogGrps.push(this.dialogGrps.shift());
		this.defViewPatterns.push(this.defViewPatterns.shift());
		this.view_ppt.push(this.view_ppt.shift());

		const albumArtGrpNameKeys = Object.keys(albumArtGrpNames);
		if (albumArtGrpNameKeys.length > 100) {
			let keysPresent = this.dialogGrps.map(v => `${v.type}1`);
			albumArtGrpNameKeys.forEach(v => {
				if (!keysPresent.includes(`${v}1`)) delete albumArtGrpNames[`${v}1`];
			});
			keysPresent = this.dialogGrps.map(v => `${v.type}2`);
			albumArtGrpNameKeys.forEach(v => {
				if (!keysPresent.includes(`${v}2`)) delete albumArtGrpNames[`${v}2`];
			});
		}
		libSet.albumArtGrpNames = JSON.stringify(albumArtGrpNames);
	}

	load() {
		libSet.nodeLines = true;
		libSet.nodeCounts = 1;
		libSet.sbarButType = 0;
		libSet.searchShow = true;
		libSet.filterShow = true;
		libSet.settingsShow = true;
		if (grm.ui.libraryCanReload) window.Reload();
	}

	on_size(fontChanged) {
		const ln_sp = lib.ui.style.topBarShow && !lib.ui.id.local ? Math.floor(lib.ui.row.h * 0.1) : 0;
		const sbarStyle = !libSet.sbarFullHeight ? 2 : 0;
		this.calcText();
		this.ln.x = libSet.countsRight || libSet.itemShowStatistics || libSet.rowStripes || libSet.fullLineSelection || lib.pop.inlineRoot ? 0 : lib.ui.sz.marginSearch;
		this.ln.w = lib.ui.w - this.ln.x - 1;
		this.search.h = lib.ui.style.topBarShow ? lib.ui.row.h + (!lib.ui.id.local ? ln_sp * 2 + lib.ui.sz.margin + SCALE(7) : 0) : libSet.marginTopBottom;
		this.search.sp = this.search.h - ln_sp;
		let sp = lib.ui.h - this.search.h - (lib.ui.style.topBarShow ? lib.ui.sz.margin / 2 : libSet.marginTopBottom);
		this.rows = sp / lib.ui.row.h;
		this.rows = Math.floor(this.rows);
		sp = lib.ui.row.h * this.rows;
		this.node_y = Math.round((lib.ui.row.h - lib.ui.sz.node) / 1.75);
		this.filter.y = lib.ui.y + sp + this.search.h - lib.ui.row.h * 0.9;
		if (this.init || fontChanged || !this.tree.y) this.tree.y = this.search.h;
		this.paint_y = Math.floor(lib.ui.style.topBarShow || !libSet.sbarShow ? this.search.h : 0);

		const sbar_top = !lib.ui.sbar.type ? 5 : lib.ui.style.topBarShow ? 3 : 0;
		const sbar_bot = !lib.ui.sbar.type ? 5 : 0;
		this.sbar_o = [lib.ui.sbar.arrowPad, Math.max(Math.floor(lib.ui.sbar.but_w * 0.2), 2) + lib.ui.sbar.arrowPad * 2, 0][lib.ui.sbar.type];
		const vertical = !libSet.albumArtFlowMode || lib.ui.h - this.search.h > lib.ui.w - lib.ui.sbar.w;
		switch (true) {
			case !this.imgView || vertical: {
				this.sbar_x = lib.ui.x + lib.ui.w - SCALE(lib.ui.sbar.sp + 18);
				const top_corr = [this.sbar_o - (lib.ui.sbar.but_h - lib.ui.sbar.but_w) / 2, this.sbar_o, 0][lib.ui.sbar.type];
				const bot_corr = [(lib.ui.sbar.but_h - lib.ui.sbar.but_w) / 2 - this.sbar_o, -this.sbar_o, 0][lib.ui.sbar.type];
				let sbar_y = lib.ui.y + (lib.ui.sbar.type < sbarStyle || lib.ui.style.topBarShow ? this.search.sp + 1 : 0) + sbar_top + top_corr;
				let sbar_h = lib.ui.sbar.type < sbarStyle ? sp + 1 - sbar_top - sbar_bot + bot_corr * 2 - lib.ui.sz.margin : lib.ui.y + lib.ui.h - sbar_y - sbar_bot + bot_corr - lib.ui.sz.margin;
				if (lib.ui.sbar.type == 2) {
					sbar_y += 1;
					sbar_h -= 2;
				}
				lib.sbar.metrics(this.sbar_x, sbar_y, lib.ui.sbar.w, sbar_h, this.rows, lib.ui.row.h, !this.imgView ? true : vertical);
				if (this.imgView) libImg.metrics();
				break;
			}
			case !vertical: {
				this.sbar_y = lib.ui.y + lib.ui.h - lib.ui.sbar.sp;
				let sbar_x = lib.ui.x;
				let sbar_w = lib.ui.w;
				if (lib.ui.sbar.type == 2) {
					sbar_x += 1;
					sbar_w -= 2;
				}
				lib.sbar.metrics(sbar_x, this.sbar_y, sbar_w, lib.ui.sbar.w, this.rows, lib.ui.row.h, !this.imgView);
				if (this.imgView) libImg.metrics();
				break;
			}
		}
		if (this.imgView) {
			if (this.init) libImg.sizeDebounce();
			else if (lib.sbar.scroll > lib.sbar.max_scroll) lib.sbar.checkScroll(lib.sbar.max_scroll);
		}
	}

	open(page) {
		const ok_callback = (new_cfg, new_ppt, type, new_cfgWindow) => {
			if (new_cfg) {
				const cfg = $Lib.jsonParse(new_cfg, []);
				this.clear('both');
				let i = cfg[0].length;
				while (i--) {
					if (!cfg[0][i].type) cfg[0].splice(i, 1);
				}
				cfg[0].forEach((v, i) => {
					const nm = v.type ? v.name + (v.menu ? ' // ' : ' /hide/ ') + v.type : null;
					libSet.set(v.type != 'Pattern Not Configurable' ? `Panel Library - View ${$Lib.padNumber(i + 2, 2)}: Name // Pattern` : 'Panel Library - View 01: Name // Pattern', nm);
				});
				i = cfg[1].length;
				while (i--) {
					if (!cfg[1][i].type) cfg[1].splice(i, 1);
				}
				cfg[1].forEach((v, i) => {
					const nm = v.type ? v.name + (v.menu ? ' // ' : ' /hide/ ') + v.type : null;
					libSet.set(v.type != 'Button Name' ? `Panel Library - Filter ${$Lib.padNumber(i + 2, 2)}: Name // Query` : 'Panel Library - Filter 01: Name // Query', nm);
				});
				const view_name = this.grp[libSet.viewBy].name;
				const view_type = this.grp[libSet.viewBy].type.trimStart();
				const filter_name = this.filter.mode[libSet.filterBy].name;
				const filter_type = this.filter.mode[libSet.filterBy].type;
				this.getViews();
				this.getFilters();
				this.getFields(libSet.viewBy, libSet.filterBy, true);
				if (this.getViewIndex(this.grp, view_name, view_type) == -1 || this.getFilterIndex(this.filter.mode, filter_name, filter_type) == -1) {
					lib.lib.logTree();
					window.Reload();
				} else this.getFields(libSet.viewBy, libSet.filterBy);
			}

			if (new_ppt) this.updateProp($Lib.jsonParse(new_ppt, {}), 'value');

			if (new_cfgWindow) libSet.set('Panel Library - Library Tree Dialog Box', new_cfgWindow);

			if (type == 'reset') {
				this.updateProp(libSet, 'default_value');
			}
		};

		this.getViews();
		let cfgWindow = libSet.get('Panel Library - Library Tree Dialog Box');
		cfgWindow = $Lib.jsonParse(cfgWindow);
		if (page !== undefined) cfgWindow.page = page;
		cfgWindow.version = `v${window.ScriptInfo.Version}`;
		cfgWindow = JSON.stringify(cfgWindow);
		libSet.set('Panel Library - Library Tree Dialog Box', cfgWindow);
		if (lib.popUpBox.isHtmlDialogSupported()) lib.popUpBox.config(JSON.stringify([this.dialogGrps, this.dialogFiltGrps, this.defViewPatterns, this.defFilterPatterns]), JSON.stringify(libSet), cfgWindow, ok_callback);
		else {
			lib.popUpBox.ok = false;
			$Lib.trace('options dialog isn\'t available with current operating system. All settings in options are available in panel properties. Common settings are on the menu.');
		}
	}

	searchPaint() {
		window.RepaintRect(lib.ui.x, lib.ui.y, lib.ui.w, this.search.h);
	}

	set(n, i, treeArtToggle) {
		const prompt = `This changes various options ${i < 5 ? 'on the display tab' : i < 13 ? 'on the display and album art tabs' : ''}\n\nContinue?`;
		switch (n) {
			case 'quickSetup':
				switch (i) {
					case 0: {
						// const continue_confirmation = (status, confirmed) => {
						// 	if (confirmed) {
								grSet.libraryDesign = 'traditional';
								grSet.libraryLayout = 'normal';
								if (grSet.libraryThumbnailSize === 'auto') libSet.thumbNailSize = 2;
								libSet.highLightNowplaying = true; // In default does not exist
								libSet.zoomNode = 100; // In default does not exist
								libSet.countsRight = false;
								libSet.itemShowStatistics = 0;
								libSet.nodeStyle = 0;
								libSet.inlineRoot = false;
								libSet.autoCollapse = false;
								libSet.treeAutoExpandSingle = false;
								libSet.facetView = false;
								lib.ui.sbar.type = 1; // lib.ui.sbar.type = 0;
								libSet.sbarType = 1; // libSet.sbarType = 0;
								// libSet.sbarShow = 1; // Disabled here, state controlled in georgia-reborn-main -> library scrollbar menu -> grSet.libraryAutoHideScrollbar // libSet.sbarShow = 2;
								libSet.fullLineSelection = false;
								libSet.highLightText = true;
								libSet.rowStripes = false;
								libSet.highLightRow = 3;
								libSet.highLightNode = true;
								libSet.verticalPad = 3;
								libSet.rootNode = 0; // libSet.rootNode = 1;
								lib.panel.imgView = grSet.savedLibraryAlbumArtShow = libSet.albumArtShow = false;
								libSet.albumArtLabelType = 1;
								libSet.artId = 0;
								libSet.albumArtFlowMode = false; // In default does not exist
								this.load();
						// 	}
						// }
						// const caption = 'Quick Setup: Traditional Style';
						// const wsh = lib.popUpBox.isHtmlDialogSupported() ? lib.popUpBox.confirm(caption, prompt, 'Yes', 'No', '', '', continue_confirmation) : true;
						// if (wsh) continue_confirmation('ok', $Lib.wshPopup(prompt, caption));
						break;
					}
					case 1: {
						// const continue_confirmation = (status, confirmed) => {
						// 	if (confirmed) {
								grSet.libraryDesign = 'modern';
								grSet.libraryLayout = 'normal';
								libSet.highLightNowplaying = true; // In default does not exist
								libSet.zoomNode = 100; // In default does not exist
								libSet.countsRight = true;
								libSet.itemShowStatistics = 0;
								libSet.nodeStyle = 1;
								libSet.inlineRoot = true;
								libSet.autoCollapse = false;
								libSet.treeAutoExpandSingle = false;
								libSet.facetView = false;
								lib.ui.sbar.type = 1;
								libSet.sbarType = 1;
								// libSet.sbarShow = 1; // Disabled here, state controlled in georgia-reborn-main -> library scrollbar menu -> grSet.libraryAutoHideScrollbar
								libSet.fullLineSelection = true;
								libSet.highLightText = false;
								libSet.rowStripes = false; // libSet.rowStripes = true;
								libSet.highLightRow = 2;
								libSet.highLightNode = true;
								libSet.verticalPad = 5;
								libSet.rootNode = 3;
								lib.panel.imgView = grSet.savedLibraryAlbumArtShow = libSet.albumArtShow = false;
								libSet.albumArtLabelType = 1;
								if (grSet.libraryThumbnailSize === 'auto') libSet.thumbNailSize = 2; // In default the same
								libSet.artId = 0;
								libSet.albumArtFlowMode = false; // In default does not exist
								this.load();
						// 	}
						// }
						// const caption = 'Quick Setup: Modern Style';
						// const wsh = lib.popUpBox.isHtmlDialogSupported() ? lib.popUpBox.confirm(caption, prompt, 'Yes', 'No', '', '', continue_confirmation) : true;
						// if (wsh) continue_confirmation('ok', $Lib.wshPopup(prompt, caption));
						break;
					}
					case 2: {
						// const continue_confirmation = (status, confirmed) => {
						// 	if (confirmed) {
								grSet.libraryDesign = 'ultraModern';
								grSet.libraryLayout = 'normal';
								libSet.highLightNowplaying = true; // In default does not exist
								libSet.zoomNode = 100; // In default does not exist
								libSet.countsRight = true;
								libSet.itemShowStatistics = 1;
								libSet.nodeStyle = 3;
								libSet.inlineRoot = true;
								libSet.autoCollapse = true;
								libSet.treeAutoExpandSingle = true;
								libSet.facetView = false;
								lib.ui.sbar.type = 1;
								libSet.sbarType = 1;
								// libSet.sbarShow = 1; // Disabled here, state controlled in georgia-reborn-main -> library scrollbar menu -> grSet.libraryAutoHideScrollbar
								libSet.fullLineSelection = true;
								libSet.highLightText = false;
								libSet.rowStripes = false; // libSet.rowStripes = true;
								libSet.highLightRow = 1;
								libSet.highLightNode = true; // libSet.highLightNode = false;
								libSet.verticalPad = 5;
								libSet.rootNode = 3;
								lib.panel.imgView = grSet.savedLibraryAlbumArtShow = libSet.albumArtShow = false;
								if (!libSet.presetLoadCurView) libSet.viewBy = 1;
								libSet.albumArtFlowMode = false;
								libSet.albumArtLabelType = 1;
								libSet.albumArtFlipLabels = false;
								libSet.imgStyleFront = 1;
								libSet.itemOverlayType = 1;
								libSet.thumbNailSize = 2;
								libSet.albumArtGrpLevel = 0;
								if (grSet.libraryThumbnailSize === 'auto') libSet.thumbNailSize = 2; // In default the same
								libSet.artId = 0;
								this.load();
						// 	}
						// }
						// const caption = 'Quick Setup: Ultra Modern Style';
						// const wsh = lib.popUpBox.isHtmlDialogSupported() ? lib.popUpBox.confirm(caption, prompt, 'Yes', 'No', '', '', continue_confirmation) : true;
						// if (wsh) continue_confirmation('ok', $Lib.wshPopup(prompt, caption));
						break;
					}
					case 3: {
						// const continue_confirmation = (status, confirmed) => {
						// 	if (confirmed) {
								grSet.libraryDesign = 'clean';
								libSet.countsRight = true;
								libSet.itemShowStatistics = 0;
								libSet.nodeStyle = 5;
								libSet.inlineRoot = true;
								libSet.autoCollapse = false;
								libSet.treeAutoExpandSingle = false;
								libSet.facetView = false;
								lib.ui.sbar.type = 0;
								libSet.sbarType = 0;
								// libSet.sbarShow = 1; // Disabled here, state controlled in georgia-reborn-main -> library scrollbar menu -> grSet.libraryAutoHideScrollbar
								libSet.fullLineSelection = true;
								libSet.highLightText = true;
								libSet.rowStripes = false; // libSet.rowStripes = true;
								libSet.highLightRow = 0;
								libSet.highLightNode = true;
								libSet.verticalPad = 5;
								libSet.rootNode = 3;
								lib.panel.imgView = grSet.savedLibraryAlbumArtShow = libSet.albumArtShow = false;
								grSet.libraryLayout = libSet.albumArtShow ? 'full' : 'normal';
								libSet.albumArtLabelType = 1;
								if (grSet.libraryThumbnailSize === 'auto') libSet.thumbNailSize = 2; // In default the same
								libSet.artId = 0;
								this.load();
						// 	}
						// }
						// const caption = 'Quick Setup: Clean';
						// const wsh = lib.popUpBox.isHtmlDialogSupported() ? lib.popUpBox.confirm(caption, prompt, 'Yes', 'No', '', '', continue_confirmation) : true;
						// if (wsh) continue_confirmation('ok', $Lib.wshPopup(prompt, caption));
						break;
					}
					case 4: {
						// const continue_confirmation = (status, confirmed) => {
						// 	if (confirmed) {
								grSet.libraryDesign = 'facet';
								grSet.libraryLayout = 'normal';
								libSet.highLightNowplaying = true; // In default does not exist
								libSet.zoomNode = 100; // In default does not exist
								libSet.countsRight = true;
								libSet.itemShowStatistics = 0;
								libSet.nodeStyle = 1;
								libSet.inlineRoot = true;
								libSet.autoCollapse = false;
								libSet.treeAutoExpandSingle = false;
								libSet.facetView = true;
								lib.panel.imgView = grSet.savedLibraryAlbumArtShow = libSet.albumArtShow = false;
								libSet.albumArtLabelType = 1;
								if (grSet.libraryThumbnailSize === 'auto') libSet.thumbNailSize = 2; // In default the same
								libSet.artId = 0;
								lib.ui.sbar.type = 1;
								libSet.sbarType = 1;
								// libSet.sbarShow = 1; // Disabled here, state controlled in georgia-reborn-main -> library scrollbar menu -> grSet.libraryAutoHideScrollbar
								libSet.fullLineSelection = true;
								libSet.highLightText = false;
								libSet.rowStripes = false; // libSet.rowStripes = true;
								libSet.highLightRow = 2;
								libSet.highLightNode = true;
								libSet.verticalPad = 5;
								libSet.rootNode = 3;
								this.load();
						// 	}
						// }
						// const caption = 'Quick Setup: Facet';
						// const wsh = lib.popUpBox.isHtmlDialogSupported() ? lib.popUpBox.confirm(caption, prompt, 'Yes', 'No', '', '', continue_confirmation) : true;
						// if (wsh) continue_confirmation('ok', $Lib.wshPopup(prompt, caption));
						break;
					}
					case 5: {
						// const continue_confirmation = (status, confirmed) => {
						// 	if (confirmed) {
							grSet.libraryDesign = 'coversLabelsRight';
							grSet.libraryLayout = 'normal';
							if (grSet.libraryThumbnailSize === 'auto') libSet.thumbNailSize = 0;
							libSet.highLightNowplaying = true; // In default does not exist
							libSet.zoomNode = 100; // In default does not exist
							libSet.nodeStyle = 5; // In default does not exist
							libSet.inlineRoot = true; // In default does not exist
							lib.ui.sbar.type = 1;
							libSet.sbarType = 1;
							// libSet.sbarShow = 1; // Disabled here, state controlled in georgia-reborn-main -> library scrollbar menu -> grSet.libraryAutoHideScrollbar
							libSet.fullLineSelection = true;
							libSet.highLightText = false;
							libSet.rowStripes = false; // libSet.rowStripes = true;
							libSet.highLightRow = 1;
							libSet.highLightNode = false;
							libSet.verticalPad = 5;
							libSet.rootNode = 3;
							libSet.facetView = false;
							lib.panel.imgView = grSet.savedLibraryAlbumArtShow = libSet.albumArtShow = true;
							if (!libSet.presetLoadCurView) libSet.viewBy = 0; // libSet.viewBy = 1;
							libSet.albumArtFlowMode = false;
							libSet.albumArtLabelType = 2;
							libSet.imgStyleFront = 1;
							libSet.itemOverlayType = 2;
							libSet.artId = 0;
							libSet.albumArtGrpLevel = 0;
							this.load();
						// 	}
						// }
						// const caption = 'Quick Setup: Covers [Labels Right]';
						// const wsh = lib.popUpBox.isHtmlDialogSupported() ? lib.popUpBox.confirm(caption, prompt, 'Yes', 'No', '', '', continue_confirmation) : true;
						// if (wsh) continue_confirmation('ok', $Lib.wshPopup(prompt, caption));
						break;
					}
					case 6: {
						// const continue_confirmation = (status, confirmed) => {
						// 	if (confirmed) {
								grSet.libraryDesign = 'coversLabelsBottom';
								grSet.libraryLayout = 'normal';
								if (grSet.libraryThumbnailSize === 'auto') libSet.thumbNailSize = 0;
								libSet.highLightNowplaying = true; // In default does not exist
								libSet.zoomNode = 100; // In default does not exist
								libSet.nodeStyle = 5; // In default does not exist
								libSet.inlineRoot = true; // In default does not exist
								lib.ui.sbar.type = 1;
								libSet.sbarType = 1;
								// libSet.sbarShow = 1; // Disabled here, state controlled in georgia-reborn-main -> library scrollbar menu -> grSet.libraryAutoHideScrollbar
								libSet.fullLineSelection = true;
								libSet.highLightText = false;
								libSet.rowStripes = false; // libSet.rowStripes = true;
								libSet.highLightRow = 1;
								libSet.highLightNode = false;
								libSet.verticalPad = 5;
								libSet.rootNode = 3;
								libSet.facetView = false;
								lib.panel.imgView = grSet.savedLibraryAlbumArtShow = libSet.albumArtShow = true;
								if (!libSet.presetLoadCurView) libSet.viewBy = 1; // libSet.viewBy = 1;
								libSet.albumArtFlowMode = false;
								libSet.albumArtLabelType = 1;
								libSet.albumArtFlipLabels = false;
								libSet.itemShowStatistics = 0;
								libSet.imgStyleFront = 1;
								libSet.itemOverlayType = 1;
								libSet.artId = 0;
								this.load();
						// 	}
						// }
						// const caption = 'Quick Setup: Covers [Labels Bottom]';
						// cconst wsh = lib.popUpBox.isHtmlDialogSupported() ? lib.popUpBox.confirm(caption, prompt, 'Yes', 'No', '', '', continue_confirmation) : true;
						// if (wsh) continue_confirmation('ok', $Lib.wshPopup(prompt, caption));
						break;
					}
					case 7: {
						// const continue_confirmation = (status, confirmed) => {
						// 	if (confirmed) {
								grSet.libraryDesign = 'coversLabelsBlend';
								grSet.libraryLayout = 'normal';
								if (grSet.libraryThumbnailSize === 'auto') libSet.thumbNailSize = 0;
								libSet.highLightNowplaying = true; // In default does not exist
								libSet.zoomNode = 100; // In default does not exist
								libSet.nodeStyle = 5; // In default does not exist
								libSet.inlineRoot = true; // In default does not exist
								lib.ui.sbar.type = 1;
								libSet.sbarType = 1;
								// libSet.sbarShow = 1; // Disabled here, state controlled in georgia-reborn-main -> library scrollbar menu -> grSet.libraryAutoHideScrollbar
								libSet.fullLineSelection = true;
								libSet.highLightText = false;
								libSet.rowStripes = false; // libSet.rowStripes = true;
								libSet.highLightRow = 1;
								libSet.highLightNode = false;
								libSet.verticalPad = 5;
								libSet.rootNode = 3;
								libSet.facetView = false;
								lib.panel.imgView = grSet.savedLibraryAlbumArtShow = libSet.albumArtShow = true;
								if (!libSet.presetLoadCurView) libSet.viewBy = 0; // if (!libSet.presetLoadCurView) libSet.viewBy = 1;
								libSet.albumArtFlowMode = false;
								libSet.albumArtLabelType = 4;
								libSet.albumArtFlipLabels = false;
								libSet.itemShowStatistics = 0;
								libSet.imgStyleFront = 0;
								libSet.itemOverlayType = 1;
								libSet.artId = 0;
								libSet.albumArtGrpLevel = 0;
								this.load();
						// 	}
						// }
						// const caption = 'Quick Setup: Covers [Labels Blend]';
						// const wsh = lib.popUpBox.isHtmlDialogSupported() ? lib.popUpBox.confirm(caption, prompt, 'Yes', 'No', '', '', continue_confirmation) : true;
						// if (wsh) continue_confirmation('ok', $Lib.wshPopup(prompt, caption));
						break;
					}
					case 8: {
						// const continue_confirmation = (status, confirmed) => {
						// 	if (confirmed) {
								grSet.libraryDesign = 'artistLabelsRight';
								grSet.libraryLayout = libSet.albumArtShow ? 'full' : 'normal';
								if (grSet.libraryThumbnailSize === 'auto') libSet.thumbNailSize = 0;
								lib.ui.sbar.type = 1;
								libSet.sbarType = 1;
								libSet.sbarShow = 1;
								libSet.fullLineSelection = true;
								libSet.highLightText = false;
								libSet.rowStripes = false; // libSet.rowStripes = true;
								libSet.highLightRow = 1;
								libSet.highLightNode = false;
								libSet.verticalPad = 5;
								libSet.rootNode = 3;
								libSet.facetView = false;
								lib.panel.imgView = grSet.savedLibraryAlbumArtShow = libSet.albumArtShow = true;
								if (!libSet.presetLoadCurView) libSet.viewBy = 0;
								libSet.albumArtFlowMode = false;
								libSet.albumArtLabelType = 2;
								libSet.itemShowStatistics = 0;
								libSet.imgStyleArtist = 1;
								libSet.itemOverlayType = 0;
								libSet.thumbNailSize = 1;
								libSet.artId = 4;
								libSet.albumArtGrpLevel = 0;
								this.load();
						// 	}
						// }
						// const caption = 'Quick Setup: Artist Photos [Labels Right]';
						// const wsh = lib.popUpBox.isHtmlDialogSupported() ? lib.popUpBox.confirm(caption, prompt, 'Yes', 'No', '', '', continue_confirmation) : true;
						// if (wsh) continue_confirmation('ok', $Lib.wshPopup(prompt, caption));
						break;
					}
					case 9: libSet.thumbNailSize++; this.load(); break;
					case 10: libSet.thumbNailSize--; this.load(); break;
					case 11: {
						// const continue_confirmation = (status, confirmed) => {
						// 	if (confirmed) {
								grSet.libraryDesign = 'flowMode';
								lib.panel.imgView = grSet.savedLibraryAlbumArtShow = libSet.albumArtShow = true;
								grSet.libraryLayout = libSet.albumArtShow ? 'full' : 'normal';
								if (grm.display.checkPlayerSize(grm.ui.ww, grm.ui.wh, 'default', 'HD') === 'small' && libSet.thumbNailSize === 'auto') libSet.thumbNailSize = 2;
								libSet.highLightNowplaying = true; // In default does not exist
								libSet.zoomNode = 100; // In default does not exist
								libSet.countsRight = true;
								libSet.nodeStyle = 5; // libSet.nodeStyle = 2;
								libSet.inlineRoot = true;
								libSet.autoCollapse = false;
								libSet.treeAutoExpandSingle = false;
								libSet.facetView = false;
								libSet.highLightRow = 1;
								if (!libSet.presetLoadCurView) libSet.viewBy = 0; // if (!libSet.presetLoadCurView) libSet.viewBy = 1;
								libSet.albumArtFlowMode = true;
								libSet.albumArtLabelType = 1;
								libSet.itemShowStatistics = 0;
								libSet.imgStyleFront = 1;
								libSet.itemOverlayType = 0;
								if (!libSet.presetLoadCurView) libSet.artId = 0;
								libSet.albumArtGrpLevel = 0;
								this.load();
						// 	}
						// }
						// const caption = 'Quick Setup: Flow Mode';
						// const wsh = lib.popUpBox.isHtmlDialogSupported() ? lib.popUpBox.confirm(caption, prompt, 'Yes', 'No', '', '', continue_confirmation) : true;
						// if (wsh) continue_confirmation('ok', $Lib.wshPopup(prompt, caption));
						break;
					}
					case 12: {
						// const continue_confirmation = (status, confirmed) => {
						// 	if (confirmed) {
								grSet.libraryDesign = 'reborn';
								grSet.libraryLayout = 'normal';
								if (grm.display.checkPlayerSize(grm.ui.ww, grm.ui.wh, 'default', 'HD') === 'small' && libSet.thumbNailSize === 'auto') libSet.thumbNailSize = 1;
								libSet.highLightNowplaying = true;
								libSet.zoomNode = 100;
								libSet.countsRight = true;
								libSet.nodeStyle = 5;
								libSet.inlineRoot = true;
								libSet.autoCollapse = false;
								libSet.treeAutoExpandSingle = true;
								libSet.facetView = false;
								lib.ui.sbar.type = 1;
								libSet.sbarType = 1;
								// libSet.sbarShow = 1; // Disabled here, state controlled in georgia-reborn-main -> library scrollbar menu -> grSet.libraryAutoHideScrollbar
								libSet.fullLineSelection = true;
								libSet.highLightText = false;
								libSet.rowStripes = false;
								libSet.highLightRow = 1;
								libSet.highLightNode = true;
								libSet.verticalPad = 5;
								libSet.rootNode = 3;
								lib.panel.imgView = grSet.savedLibraryAlbumArtShow = libSet.albumArtShow = false;
								if (!libSet.presetLoadCurView) libSet.viewBy = 2;
								libSet.albumArtLabelType = 1;
								libSet.albumArtFlipLabels = false;
								libSet.itemShowStatistics = 0;
								libSet.itemOverlayType = 0;
								libSet.artId = 0;
								libSet.albumArtFlowMode = false;
								this.load();
						// 	}
						// }
						// const caption = 'Quick Setup: Georgia-ReBORN Style';
						// const wsh = lib.popUpBox.isHtmlDialogSupported() ? lib.popUpBox.confirm(caption, prompt, 'Yes', 'No', '', '', continue_confirmation) : true;
						// if (wsh) continue_confirmation('ok', $Lib.wshPopup(prompt, caption));
						break;
					}
					case 13:
						libSet.toggle('presetLoadCurView');
				}
				break;
			case 'Filter':
				lib.lib.searchCache = {};
				lib.pop.cache.filter = {};
				lib.pop.cache.search = {};
				switch (i) {
					case this.filter.menu.length:
						libSet.toggle('reset');
						if (libSet.reset) {
							this.searchPaint();
							lib.lib.treeState(true, 2);
						}
						break;
					default:
						libSet.filterBy = i;
						this.calcText();
						if (this.search.txt) lib.lib.upd_search = true;
						if (!libSet.reset) {
							const ix = lib.pop.get_ix(!lib.panel.imgView ? 0 : libImg.panel.x + 1, (!lib.panel.imgView || libImg.style.vertical ? lib.panel.tree.y : lib.panel.tree.x) + lib.sbar.row.h / 2, true, false);
							const l = Math.min(Math.floor(ix + lib.panel.rows), lib.pop.tree.length);
							if (ix != -1) {
								for (i = ix; i < l; i++) {
									if (lib.pop.tree[i].sel) {
										lib.sbar.checkScroll(lib.sbar.row.h * i, 'full', true);
										lib.lib.logTree();
										break;
									}
								}
							}
						if (!libSet.rememberTree && !libSet.reset)
							{ lib.lib.logTree(); }
						else if (libSet.rememberTree)
							{ lib.lib.logFilter(); }
						}
						lib.lib.getLibrary();
						lib.lib.rootNodes(!libSet.reset ? 1 : 0, true);
						lib.but.refresh(true);
						this.searchPaint();
						if (!lib.pop.notifySelection())  {
							const list = !this.search.txt.length || !lib.lib.list.Count ? lib.lib.list : this.list;
							window.NotifyOthers(window.Name, libSet.filterBy ? list : new FbMetadbHandleList());
						}
						if (libSet.searchSend == 2 && this.search.txt.length) lib.pop.load(this.list, false, false, false, true, false);
						break;
				}
				lib.pop.checkAutoHeight();
				break;
			case 'view': {
				if (this.colMarker) this.draw = false;
				if (this.search.txt) lib.lib.upd_search = true;
				this.getFields(i < this.grp.length ? i : libSet.viewBy, libSet.filterBy);
				this.on_size();
				lib.lib.searchCache = {};
				lib.pop.cache = {
					standard: {},
					search: {},
					filter: {}
				};
				lib.lib.checkView();
				const key = !libSet.rememberView ? 'def' : this.viewName;
				if ((libSet.rememberView || treeArtToggle) && lib.lib.exp[key]) lib.lib.readTreeState(false, treeArtToggle);
				lib.lib.getLibrary(treeArtToggle);
				lib.lib.rootNodes((libSet.rememberView || treeArtToggle), !!((libSet.rememberView || treeArtToggle)));
				if (libSet.rememberView) {
					this.calcText();
					lib.but.refresh(true);
					this.searchPaint();
					lib.lib.logTree();
					if (!lib.pop.notifySelection())  {
						const list = !this.search.txt.length || !lib.lib.list.Count ? lib.lib.list : this.list;
						window.NotifyOthers(window.Name, libSet.filterBy ? list : new FbMetadbHandleList());
					}
				}
				this.draw = true;
				if (libSet.searchSend == 2 && this.search.txt.length) lib.pop.load(this.list, false, false, false, true, false);
				lib.pop.checkAutoHeight();
				break;
			}
		}
	}

	setHeight(n) {
		if (!this.pn_h_auto) return;
		libSet.pn_h = n || this.imgView ? libSet.pn_h_max : libSet.pn_h_min;
		window.MaxHeight = window.MinHeight = libSet.pn_h;
	}

	setRootName() {
		this.sourceName = ['Active Playlist', !libSet.fixedPlaylist ? 'Library' : libSet.fixedPlaylistName, 'Panel'][libSet.libSource];
		this.viewName = this.grp[libSet.viewBy].name;
		switch (libSet.rootNode) {
			case 1:
				this.rootName = !libSet.showSource ? 'All Music' : this.sourceName;
				break;
			case 2:
				this.rootName = this.viewName + (!libSet.showSource ? '' : ` [${this.sourceName}]`);
				break;
			case 3: {
				const nm = this.viewName.replace(/view by|^by\b/i, '').trim();
				const basenames = nm.split(' ').map(v => pluralize(v));
				const basename = basenames.join(' ').replace(/(album|artist|top|track)s\s/gi, '$1 ').replace(/(similar artist)\s/gi, '$1s ').replace(/years - albums/gi, 'Year - Albums');
				this.rootName = (!this.imgView ? `${!libSet.showSource ? 'All' : this.sourceName} (#^^^^# ${basename})` : `All #^^^^# ${basename}`);
				this.rootName1 = (!this.imgView ? `${!libSet.showSource ? 'All' : this.sourceName} (1 ${nm})` : `All 1 ${nm}`);
				break;
			}
		}
	}

	setSelection() {
		const flowMode = this.imgView && libSet.albumArtFlowMode;
		return (flowMode && libSet.flowModeFollowSelection || !flowMode && libSet.stndModeFollowSelection) && (!libSet.followPlaylistFocus || libSet.libSource) && lib.panel.m.x == -1;
	}

	setTopBar() {
		// const sz = Math.round(12 * $Lib.scale * this.zoomFilter);
		// const mod = sz > 15 ? (sz % 2) - 1 : 0;
		// this.filter.font = gdi.Font(grFont.fontDefault, SCALE(this.zoomFilter > 1.05 ? Math.floor(11 * $Lib.scale * this.zoomFilter) : Math.max(11 * $Lib.scale * this.zoomFilter, 12), 1);
		const libraryFontSize = SCALE(RES._4K ? grSet.libraryFontSize_layout - 0 : grSet.libraryFontSize_layout || 14);
		this.filter.font = gdi.Font(grFont.fontDefault, this.zoomFilter > 1.05 ? Math.floor(libraryFontSize) : Math.max(libraryFontSize, SCALE(12)), 1);
		this.settings.font = gdi.Font('Segoe UI Symbol', libraryFontSize /*sz + mod*/, 0);
		this.settings.icon = '\uE10C';
		this.settings.offset = Math.round(1 * this.settings.font.Size / 17);
	}

	sort(li) {
		switch (this.folderView) {
			case true:
				li.OrderByRelativePath();
				break;
			default: {
				const tfo = FbTitleFormat(this.sortBy);
				li.OrderByFormat(tfo, 1);
				break;
			}
		}
	}

	treePaint() {
		window.RepaintRect(lib.ui.x, lib.ui.y, lib.ui.w, lib.ui.h);
	}

	updateProp(prop, value) {
		const curActionMode = libSet.actionMode;
		Object.entries(prop).forEach(v => {
			libSet[v[0].replace('_internal', '')] = v[1][value];
		});

		libImg.asyncBypass = Date.now();
		libImg.preLoadItems = [];
		clearInterval(libImg.timer.preLoad);
		libImg.timer.preLoad = null;

		lib.pop.autoPlay.send = libSet.autoPlay;
		lib.pop.setActions();
		if (libSet.actionMode != curActionMode) {
			if (libSet.actionMode != 2) {
				libSet.itemShowStatistics = libSet.itemShowStatisticsLast;
				libSet.highLightNowplaying = libSet.highLightNowplayingLast;
				libSet.nowPlayingIndicator = libSet.nowPlayingIndicatorLast;
				libSet.nowPlayingSidemarker = libSet.nowPlayingSidemarkerLast;
			} else {
				libSet.itemShowStatisticsLast = libSet.itemShowStatistics;
				libSet.highLightNowplayingLast = libSet.highLightNowplaying;
				libSet.nowPlayingIndicatorLast = libSet.nowPlayingIndicator;
				libSet.nowPlayingSidemarkerLast = libSet.nowPlayingSidemarker;
				libSet.itemShowStatistics = 7;
				libSet.highLightNowplaying = true;
				libSet.nowPlayingIndicator = true;
				libSet.nowPlayingSidemarker = true;
			}
		}
		libSet.autoExpandLimit = Math.round(libSet.autoExpandLimit);
		if (isNaN(libSet.autoExpandLimit)) libSet.autoExpandLimit = 350;
		libSet.autoExpandLimit = $Lib.clamp(libSet.autoExpandLimit, 10, 1000);
		libSet.margin = Math.round(libSet.margin);
		if (isNaN(libSet.margin)) libSet.margin = 8 * $Lib.scale;
		libSet.margin = $Lib.clamp(libSet.margin, 0, 100);
		libSet.treeIndent = Math.round(libSet.treeIndent);
		if (isNaN(libSet.treeIndent)) libSet.treeIndent = 19 * $Lib.scale;
		libSet.treeIndent = $Lib.clamp(libSet.treeIndent, 0, 100);

		lib.pop.cache = {
			standard: {},
			search: {},
			filter: {}
		};

		lib.pop.tf = {
			added: FbTitleFormat(libSet.tfAdded),
			bitrate: FbTitleFormat('%bitrate%'),
			bytes: FbTitleFormat('%path%|%filesize%'),
			date: FbTitleFormat(libSet.tfDate),
			firstPlayed: FbTitleFormat(libSet.tfFirstPlayed),
			lastPlayed: FbTitleFormat(libSet.tfLastPlayed),
			pc: FbTitleFormat(libSet.tfPc),
			popularity: FbTitleFormat(libSet.tfPopularity),
			rating: FbTitleFormat(libSet.tfRating)
		}

		lib.pop.tree.forEach(v => {
			v.id = '';
			v.count = '';
			delete v.statistics;
			delete v._statistics;
		});
		lib.lib.checkView();
		lib.lib.logTree();
		libImg.setRoot();
		libSet.zoomImg = Math.round($Lib.clamp(libSet.zoomImg, 10, 500));

		const o = !this.imgView ? 'verticalPad' : 'verticalAlbumArtPad';
		if (libSet[o] === null) libSet[o] = !this.imgView ? 3 : 2;
		libSet[o] = Math.round(libSet[o]);
		if (isNaN(libSet[o])) libSet[o] = !this.imgView ? 3 : 2;
		libSet[o] = $Lib.clamp(libSet[o], 0, !this.imgView ? 100 : 20);

		libSet.iconCustom = libSet.iconCustom.trim();
		lib.ui.setNodes();
		lib.sbar.active = true;
		lib.sbar.duration = {
			drag: 200,
			inertia: libSet.durationTouchFlick,
			full: libSet.durationScroll
		};
		lib.sbar.duration.scroll = Math.round(lib.sbar.duration.full * 0.8);
		lib.sbar.duration.step = Math.round(lib.sbar.duration.full * 2 / 3);
		lib.sbar.duration.bar = lib.sbar.duration.full;
		lib.sbar.duration.barFast = lib.sbar.duration.step;
		if (!libSet.butCustIconFont.length) libSet.butCustIconFont = 'Segoe UI Symbol';
		lib.ui.setSbar();
		lib.call.on_colours_changed();
		if (lib.ui.col.counts) lib.panel.colMarker = true;
		if (libSet.themed && libSet.theme) {
			const themed_image = grSet.customLibraryDir ? `${grCfg.customLibraryDir}cache\\library\\themed\\themed_image.bmp` : `${fb.ProfilePath}cache\\library\\themed\\themed_image.bmp`;
			if ($Lib.file(themed_image)) libSync.image(gdi.Image(themed_image));
		}

		if (libImg.labels.overlayDark) lib.ui.getItemColours();
		grm.theme.initLibraryColors();
		grm.theme.themeColorAdjustments();

		this.setRootName();
		lib.but.setSbarIcon();
		lib.pop.setValues();
		lib.pop.inlineRoot = libSet.rootNode && (libSet.inlineRoot || libSet.facetView);

		lib.ui.getFont();
		this.on_size();
		this.tree.y = this.search.h;
		lib.but.createImages();
		lib.but.refresh(true);
		lib.find.on_size();
		lib.pop.createImages();

		if (libSet.highLightNowplaying || libSet.nowPlayingSidemarker) {
			lib.pop.getNowplaying();
			lib.pop.nowPlayingShow();
		}

		if (lib.panel.imgView && lib.pop.tree.length) {
			libImg.trimCache(lib.pop.tree[0].key);
			libImg.metrics();
		}
		lib.lib.rootNodes(1, true);
		this.pn_h_auto = libSet.pn_h_auto && libSet.rootNode;
		if (this.pn_h_auto) {
			window.MaxHeight = window.MinHeight = libSet.pn_h;
		}
		if (lib.panel.pn_h_auto && !lib.panel.imgView && libSet.pn_h == libSet.pn_h_min && this.tree[0]) this.clearChild(this.tree[0]);
		lib.pop.checkAutoHeight();
		if (lib.sbar.scroll > lib.sbar.max_scroll) lib.sbar.checkScroll(lib.sbar.max_scroll);

		if (lib.ui.sbarType != 0) lib.sbar.narrow.show = false;
		lib.sbar.resetAuto();

		window.Repaint();
	}

	zoomReset() {
		lib.sbar.logScroll();
		libSet.zoomFont = 100;
		libSet.zoomNode = 100;
		this.zoomFilter = 1;
		libSet.zoomFilter = 100;
		libSet.zoomTooltipBut = 100;
		this.setTopBar();
		lib.ui.getFont();
		this.on_size();
		lib.find.on_size();
		if (lib.panel.imgView) {
			libSet.zoomImg = 100;
			libImg.clearCache();
			libImg.metrics();
		}
		if (lib.ui.style.topBarShow || libSet.sbarShow) lib.but.refresh(true);
		window.Repaint();
		lib.sbar.setScroll();
	}
}
