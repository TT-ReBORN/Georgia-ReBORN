// ==PREPROCESSOR==
// @name "Library Tree"
// @author "WilB"
// @version "1.4.0.4 beta1 -- modified by Mordred"
// ==/PREPROCESSOR==

const FUNC_ERROR_TEXT = 'Expected a function';

const $$ = {
    getDpi : () => {let dpi = 120; try {dpi = WshShell.RegRead("HKCU\\Control Panel\\Desktop\\WindowMetrics\\AppliedDPI");} catch (e) {} return dpi < 121 ? 1 : dpi / 120;},
}

const s = {
    browser: c => {if (!s.run(c)) fb.ShowPopupMessage("Unable to launch your default browser.", "Library Tree");},
    clamp: (num, min, max) => {num = num <= max ? num : max; num = num >= min ? num : min; return num;},
    debounce: (e,r,i) => {var o,u,a,c,v,f,d=0,m=!1,j=!1,n=!0;if("function"!=typeof e)throw new TypeError(FUNC_ERROR_TEXT);function T(i){var n=o,t=u;return o=u=void 0,d=i,c=e.apply(t,n)}function b(i){var n=i-f;return void 0===f||r<=n||n<0||j&&a<=i-d}function l(){var i,n,t=Date.now();if(b(t))return w(t);v=setTimeout(l,(n=r-((i=t)-f),j?Math.min(n,a-(i-d)):n))}function w(i){return v=void 0,n&&o?T(i):(o=u=void 0,c)}function t(){var i,n=Date.now(),t=b(n);if(o=arguments,u=this,f=n,t){if(void 0===v)return d=i=f,v=setTimeout(l,r),m?T(i):c;if(j)return v=setTimeout(l,r),T(f)}return void 0===v&&(v=setTimeout(l,r)),c}return r=parseFloat(r)||0,s.isObject(i)&&(m=!!i.leading,a=(j="maxWait"in i)?Math.max(parseFloat(i.maxWait)||0,r):a,n="trailing"in i?!!i.trailing:n),t.cancel=function(){void 0!==v&&clearTimeout(v),o=f=u=v=void(d=0)},t.flush=function(){return void 0===v?c:w(Date.now())},t}, isObject : function(t) {var e=typeof t;return null!=t&&("object"==e||"function"==e)},
    file: f => IsFile(f),
    // fs : new ActiveXObject("Scripting.FileSystemObject"),
    gr: (w, h, im, func) => {let i = gdi.CreateImage(w, h), g = i.GetGraphics(); func(g, i); i.ReleaseGraphics(g); g = null; if (im) return i; else i = null;},
    // padNumber : (num, len, base) => {if (!base) base = 10; return ('000000' + num.toString(base)).substr(-len);},
    query: (h, q) => {let l = new FbMetadbHandleList(); try {
        if ('audio'.includes(q.toLowerCase())) q = `ARTIST HAS "${q}" OR ALBUM HAS "${q}" OR TITLE HAS "${q} OR LABEL HAS "${q}"`;
        debugLog(`Querying library: ${q}`);
        l = fb.GetQueryItems(h, q);
    } catch (e) {} return l;},
    run: c => _.runCmd(c),
    scale: $$.getDpi(),
    throttle: (e,i,t) => {var n=!0,r=!0;if("function"!=typeof e)throw new TypeError(FUNC_ERROR_TEXT);return s.isObject(t)&&(n="leading"in t?!!t.leading:n,r="trailing"in t?!!t.trailing:r),s.debounce(e,i,{leading:n,maxWait:i,trailing:r})},
    value: (num, def, type) => {num = parseFloat(num); if (isNaN(num)) return def; switch (type) {case 0: return num; case 1: if (num !== 1 && num !== 0) return def; break; case 2: if (num > 2 || num < 0) return def; break;} return num;},
}

function GetPropertyPrefix(system) {
    var prefix = system ? 'SYSTEM.' : ' ';
    var testProp = system ? 'SYSTEM.Font Size' : ' Zoom Filter Size (%)';
    var propertiesSet = window.GetProperty(testProp, '<not_set>');
    if (propertiesSet === '<not_set>') {
        prefix = 'Library: ';
        window.SetProperty(testProp, null);
    }
    return prefix;
}

/** @type {*} */
var libraryProps = new PanelProperties(); // library Preferences
var prefix = GetPropertyPrefix(false);
var systemPrefix = GetPropertyPrefix(true);
libraryProps.add_properties({
    clickAction: ['Library: Single-Click Action', 0],
    dblClickAction: ['Library: Double Click Action', 1],
    keyAction: ['Library: Key: Send to Playlist', false],
    rememberTree: [prefix + 'Tree: Remember State', true],
    fullLine: [prefix + 'Text Whole Line Clickable', true],
    searchMode: [prefix + 'Search: Hide-0, SearchOnly-1, Search+Filter-2', 2],
    searchAutoExpand: [prefix + 'Search: Auto-expand', false],
    tooltips: [prefix + 'Tooltips', true],
    rootNode: [prefix + 'Root Node: 0=Hide 1=All Music 2=View Name', 0],
    autoCollapse: [prefix + 'Node: Auto Collapse', false],
    nodeItemCounts: [prefix + 'Node Item Counts: 0=Hide 1=# Tracks 2=Sub-Items', 1],
    nodeHighlight: ['Library: Highlight Node on Hover', false],
    nodeShowTracks: [prefix + 'Node: Show Tracks', true],
    autoFill: ['Library: Playlist: AutoFill', false],
    playlistCustomSort: [prefix + 'Playlist: Custom Sort', ''],
    sendToCurrent: ['Library: Send to Current Playlist', false],
    libPlaylistName: [prefix + 'Playlist Name', 'Library Playlist'],
    rowVertPadding: [prefix + 'Row Vertical Item Padding', 3],
    showScrollbar: [prefix + 'Scrollbar Show', true],
    pageScroll: ['Library: Scroll: Mouse Wheel Page Scroll', false],
    smoothScroll: ['Library: Scroll: Smooth Scroll', true],
    btnTooltipZoom: [prefix + 'Zoom Tooltip [Button] (%)', 100],
    filterBy: ['Library: Active Filter', 0],
    viewBy: ['Library: Active View', 2],
    zoomFilter: [prefix + 'Zoom Filter Size (%)', 100],
    zoomFont: [prefix + 'Zoom Font Size (%)', 100],
    zoomNode: [prefix + 'Zoom Node Size (%)', 100],
    baseFontSize: [systemPrefix + 'Font Size', is_4k ? 24 : 16],
    searchEnter: ['Library: Search only on enter', false],
    searchSend: ['Library: Send Search to Playlist', 1],
    exp: ['SYSTEM.Remember.Exp', '[]'],
    process: ['SYSTEM.Remember.Proc', false],
    sel: ['SYSTEM.Remember.Sel', '[]'],
    scr: ['SYSTEM.Remember.Scr', '[]'],
    searchText: ['SYSTEM.Remember.Search Text', ''],
});

/** @type {*} setting defaults to avoid changing a bunch of crap */
let pptDefault = {};
pptDefault.autoFit = true;
pptDefault.autoPlay = true;
pptDefault.duration = 'Scroll,500,TouchFlick,3000';
pptDefault.flickDistance = 0.8;
// pptDefault.keyAction = false; // is this what we want?
pptDefault.rowStripes = false;
pptDefault.sBarCol = true;
pptDefault.sBarButPad = -24;
pptDefault.sbarShow = libraryProps.showScrollbar;
pptDefault.scrollStep = 3;
pptDefault.searchShow = libraryProps.searchMode;
pptDefault.showNowplaying = false;  // try true?
pptDefault.touchControl = false;
pptDefault.touchStep = 1;
pptDefault.treeIndent = Math.round(19 * s.scale);
pptDefault.blurBlend = false;
pptDefault.blurDark = false;
pptDefault.blurLight = false;

function userinterface() {
    let dpi;
    try {
        dpi = WshShell.RegRead("HKCU\\Control Panel\\Desktop\\WindowMetrics\\AppliedDPI");
    } catch (e) {
        dpi = 120;
    }
    // this.scale = dpi < 121 ? 1 : dpi / 120;
    this.zoomUpd = window.GetProperty("SYSTEM.Zoom Update", false);
    var k = 0,
        // icon = window.GetProperty(" Node: Custom Icon: +|- // Examples","| // (+)|(−) | | | | | | | | |").trim(),
        // icon_f_name= "Segoe UI",
        // icon_f_style = 0,
        iconcol_c = "",
        // iconcol_e = "",
        iconcol_h = undefined,
        // linecol = window.GetProperty(" Node: Lines: Hide-0 Grey-1 Blend-2 Text-3", 1),
        // mix = 0,
        noimg = [],
        orig_font_sz = 16,
        // s_col = window.GetProperty(" Search Style: Fade-0 Blend-1 Norm-2 Highlight-3", 0),
        sp = 6,
        sp1 = 6,
        sp2 = 6,
        node_sz = Math.round(16 * s.scale),
        zoom = 100;
    let zoomFontSize = 16;
        // zoom_node = 100;
    this.bg = false;
    this.col = {};
    // this.blur_blend = window.GetProperty("SYSTEM.Blur Blend Theme", false);
    // this.blurDark = window.GetProperty("SYSTEM.Blur Dark Theme", false);
    // this.blurLight = window.GetProperty("SYSTEM.Blur Light Theme", false);
    // var blur_tmp = window.GetProperty("ADV.Image Blur Background Level (0-100)", 90),
    //     blurAutofill = window.GetProperty("ADV.Image Blur Background Auto-Fill", false);
    // this.blurLevel = this.blur_blend ? 91.05 - Math.max(Math.min(blur_tmp, 90), 1.05) : Math.max(Math.min(blur_tmp * 2, 254), 0);
    // this.blur = this.blur_blend || this.blurDark || this.blurLight;
    this.collapse = "";
    // this.blurAlpha = window.GetProperty("ADV.Image Blur Background Opacity (0-100)", 30);
    // this.blurAlpha = Math.min(Math.max(this.blurAlpha, 0), 100) / 30;
    var changeBrightness = function (r, g, b, percent) {
        return RGB(Math.min(Math.max(r + (256 - r) * percent / 100, 0), 255), Math.min(Math.max(g + (256 - g) * percent / 100, 0), 255), Math.min(Math.max(b + (256 - b) * percent / 100, 0), 255));
    }
    this.expand =  "";
    // this.ct = false;
    this.drag_drop_id = -1;
    this.dui = window.InstanceType;
    this.font = undefined;
    this.icon_pad = -2; //window.GetProperty(" Node: Custom Icon: Vertical Padding", -2);
    this.icon_w = 17;
    this.iconcol_c = "";
    this.iconcol_e = [];
    this.iconcol_hArr = [];
    this.col.iconPlusbg = "";
    this.imgBg = window.GetProperty("SYSTEM.Image Background", false);
    this.j_font = undefined;
    this.l_s1 = 4;
    this.l_s2 = 6;
    this.l_s3 = 7;
    this.l_width = scaleForDisplay(1);
    this.local = false; //typeof conf === 'undefined' ? false : true;
    this.row_h = 20;
    this.searchFont = undefined;
    this.s_linecol = 0;
    this.sel = 3;
    this.touch_dn_id = -1;
    this.x = 0;
    this.y = 0;
    this.h = 0;
    this.w = 0;
    this.alternate = false; // window.GetProperty(" Row Stripes", false);
    this.margin = scaleForDisplay(20);
    this.node_sz = Math.round(16 * s.scale);
    this.trace = function(message) {
        var trace = true;
        if (trace) console.log("Library Tree" + ": " + message);
    };
    this.nodeStyle = 1;
    // window.GetProperty(" Node: Custom (No Lines)", false) ? 0 : !win_node ? 1 : 2;
    // if (this.node_style > 2 || this.node_style < 0) this.node_style = 1;
    this.node_win = 0;
    // if (!this.node_style) {
    // if (!icon.charAt(0).length) this.node_style = 1;
    // else try {
    // 		icon = icon.split("//");
    // 		icon = icon[0].split("|");
    // 		this.expand = icon[0].trim();
    // 		this.collapse = icon[1].trim();
    // 	} catch (e) {
    // 		this.node_style = 1;
    // 	}
    // }
    // if (!this.expand.length || !this.collapse.length) this.node_style = 1;
    // this.hot = libraryProps.nodeHighlight; //window.GetProperty(" Node: Hot Highlight", true);
    this.pad = Math.round(this.node_sz + (7 * s.scale)); //window.GetProperty(" Tree Indent", 19);
    // window.SetProperty("_CUSTOM COLOURS/FONTS: EMPTY = DEFAULT", "R-G-B (any) or R-G-B-A (not Text...), e.g. 255-0-0");
    // this.scrollbar_show = libraryProps.showScrollbar;
    // try {
    // 	this.scr_type = parseFloat(window.GetProperty(" Scrollbar Type Default-0 Styled-1 Themed-2", "0").replace(/\s+/g, "").charAt(0));
    // 	if (isNaN(this.scr_type)) this.scr_type = 0;  if (this.scr_type > 2 || this.scr_type < 0) this.scr_type = 0;
    // 	if (this.scr_type ==2)  window.SetProperty(" Scrollbar Type Default-0 Styled-1 Themed-2", "2 // Scrollbar Settings N/A For Themed");
    // 	else window.SetProperty(" Scrollbar Type Default-0 Styled-1 Themed-2", "" + this.scr_type + "");
    // } catch (e) {this.scr_type = 0; window.SetProperty(" Scrollbar Type Default-0 Styled-1 Themed-2", "" + 0 + "");}
    this.sbarType = 1;
    // this.scr_col = 1; //Math.min(Math.max( window.GetProperty(" Scrollbar Colour Grey-0 Blend-1", 1), 0), 1);
    if (this.sbarType == 2) {
        this.theme = window.CreateThemeManager("scrollbar");
        s.gr(21, 21, false, g => {
            try {
                this.theme.SetPartAndStateID(6, 1);
                this.theme.DrawThemeBackground(g, 0, 0, 21, 50);
                for (let i = 0; i < 3; i++) {
                    this.theme.SetPartAndStateID(3, i + 1);
                    this.theme.DrawThemeBackground(g, 0, 0, 21, 50);
                }
                for (let i = 0; i < 3; i++) {
                    this.theme.SetPartAndStateID(1, i + 1);
                    this.theme.DrawThemeBackground(g, 0, 0, 21, 21);
                }
            } catch(e) {
                this.sbarType = 1;
                // window.SetProperty(" Scrollbar Type Default-0 Styled-1 Themed-2", "" + 1 + "");
            }
        });
    }

    var themed_w = scaleForDisplay(12);
    try {
        themed_w = scaleForDisplay(12);
    } catch (e) {}
    // var sbw = window.GetProperty(" Scrollbar Size");
    // if (sbw && sbw.indexOf("GripMinHeight") == -1)
    // 	window.SetProperty(" Scrollbar Size", sbw + ",GripMinHeight,20");
    // var sbar_w = window.GetProperty(" Scrollbar Size", "Bar,11,Arrow,11,Gap(+/-),0,GripMinHeight,20").replace(/\s+/g, "").split(",");
    // sbar_w = [,,,,,,,,]
    // this.scr_w = parseFloat(sbar_w[1]);
    // if (isNaN(this.scr_w)) this.scr_w = 11;
    this.scr_w = themed_w;

    // this.scr_w = Math.min(Math.max(this.scr_w, 0), 400);
    // var scr_w_o = Math.min(Math.max(window.GetProperty("SYSTEM.Scrollbar Width Bar", 11), 0), 400);
    // this.arrow_pad = parseFloat(sbar_w[5]);
    // if (isNaN(this.arrow_pad))
    this.arrow_pad = 1;
    // this.grip_h = parseFloat(sbar_w[7]);
    // if (isNaN(this.grip_h))
    this.grip_h = scaleForDisplay(20);
    // if (this.scr_w != scr_w_o) {
    // 	this.scr_but_w = parseFloat(sbar_w[3]);
    // 	if (isNaN(this.scr_but_w))
    // 		this.scr_but_w = 11;
    // 	this.scr_but_w = Math.min(this.scr_but_w, this.scr_w, 400);
    // 	window.SetProperty(" Scrollbar Size", "Bar," + this.scr_w +",Arrow," + this.scr_but_w + ",Gap(+/-)," + this.arrow_pad + ",GripMinHeight," + this.grip_h);
    // } else {
    // this.scr_but_w = parseFloat(sbar_w[3]);
    // if (isNaN(this.scr_but_w))
    // 	this.scr_but_w = 11;
    // this.scr_but_w = Math.min(Math.max(this.scr_but_w, 0), 400);
    this.scr_but_w = themed_w;
    // this.scr_w = parseFloat(sbar_w[1]);
    // if (isNaN(this.scr_w))
    // 	this.scr_w = 11;
    // this.scr_w = Math.min(Math.max(this.scr_w, this.scr_but_w), 400);
        // window.SetProperty(" Scrollbar Size", "Bar," + this.scr_w +",Arrow," + this.scr_but_w + ",Gap(+/-)," + this.arrow_pad + ",GripMinHeight," + this.grip_h);
    // }
    // window.SetProperty("SYSTEM.Scrollbar Width Bar", this.scr_w);
    if (this.sbarType == 2)
        this.scr_w = themed_w;
    if (!libraryProps.showScrollbar)
        this.scr_w = 0;
    this.but_h = this.scr_w + (this.sbarType != 2 ? 1 : 0);
    if (this.sbarType != 2)
        this.scr_but_w += 1;
    this.sbar_sp = this.scr_w ? this.scr_w + (this.scr_w - this.scr_but_w < 5 || this.sbarType == 2 ? 1 : 0) : 0;
    this.arrow_pad = Math.min(Math.max(-this.but_h / 5, this.arrow_pad), this.but_h / 5);
    var R = function(c) {return c >> 16 & 0xff;}; var G = function(c) {return c >> 8 & 0xff;};
    var B = function(c) {return c & 0xff;};
    const A = function (c) {return c >> 24 & 0xff;}
    const colSat = c => {c = toRGB(c); return c[0] + c[1] + c[2];}
    var RGBAtoRGB = function(col, bg) {var r = R(col) / 255, g = G(col) / 255, b = B(col) / 255, a = A(col) / 255, bgr = R(bg) / 255, bgg = G(bg) / 255, bgb = B(bg) / 255, nR = ((1 - a) * bgr) + (a * r), nG = ((1 - a) * bgg) + (a * g), nB = ((1 - a) * bgb) + (a * b); nR = Math.max(Math.min(Math.round(nR * 255), 255), 0); nG = Math.max(Math.min(Math.round(nG * 255), 255), 0); nB = Math.max(Math.min(Math.round(nB * 255), 255), 0); return RGB(nR, nG, nB);}
    const toRGB = c => [c >> 16 & 0xff, c >> 8 & 0xff, c & 0xff];
    const toRGBA = c => [c >> 16 & 0xff, c >> 8 & 0xff, c & 0xff, c >> 24 & 0xff];

    this.get_blend = (c1, c2, f, alpha) => {const nf = 1 - f; let r, g, b, a; switch (true) {case !alpha: c1 = toRGB(c1); c2 = toRGB(c2); r = c1[0] * f + c2[0] * nf; g = c1[1] * f + c2[1] * nf; b = c1[2] * f + c2[2] * nf; return RGB(r, g, b); case alpha: c1 = toRGBA(c1); c2 = toRGBA(c2); r = c1[0] * f + c2[0] * nf; g = c1[1] * f + c2[1] * nf; b = c1[2] * f + c2[2] * nf; a = c1[3] * f + c2[3] * nf; return RGBA(r, g, b, a);}}
    var get_grad = function (c, f1, f2) {return [RGB(Math.min(R(c) + f1, 255), Math.min(G(c) + f1, 255), Math.min(B(c) + f1, 255)), RGB(Math.max(R(c) + f2, 0), Math.max(G(c) + f2, 0), Math.max(B(c) + f2, 0))];}
    var get_textselcol = function(c, n) {var cc = [R(c), G(c), B(c)]; var ccc = []; for (var i = 0; i < cc.length; i++) {ccc[i] = cc[i] / 255; ccc[i] = ccc[i] <= 0.03928 ? ccc[i] / 12.92 : Math.pow(((ccc[i] + 0.055 ) / 1.055), 2.4);} var L = 0.2126 * ccc[0] + 0.7152 * ccc[1] + 0.0722 * ccc[2]; if (L > 0.31) return n ? 50 : RGB(0, 0, 0); else return n ? 200 : RGB(255, 255, 255);}
    this.outline = function(c, but) {if (but) {if (window.IsTransparent || R(c) + G(c) + B(c) > 30) return RGBA(0, 0, 0, 36); else return RGBA(255, 255, 255, 36);} else if (R(c) + G(c) + B(c) > 255 * 1.5) return RGB(30, 30, 10); else return RGB(225, 225, 245);}
    this.reset_colors = () => {
        this.col = {};	// clear all
        iconcol_c = ""; iconcol_h = undefined; this.iconcol_c = ""; this.iconcol_h = [];
        this.s_linecol = 0;
    }

    this.icon_col = () => {
        // if (iconcol_c === "") {this.iconcol_c = this.nodeStyle ? [RGB(252, 252, 252), RGB(223, 223, 223)] : this.textcol;} else if (this.nodeStyle) {if (A(iconcol_c) != 255) {this.iconcol_c = RGBAtoRGB(iconcol_c, this.col.bg);} else this.iconcol_c = iconcol_c; this.iconcol_c = get_grad(this.iconcol_c, 15, -14);}
        // // if (iconcol_e === "") {this.iconcol_e = this.node_style ? [RGB(252, 252, 252), RGB(223, 223, 223)] : this.textcol & 0xC0ffffff;} else if (this.node_style) {if (A(iconcol_e) != 255) {this.iconcol_e = RGBAtoRGB(iconcol_e, this.backcol);} else this.iconcol_e = iconcol_e; this.iconcol_e = get_grad(this.iconcol_e, 15, -14);}
        // this.iconcol_e = [rgb(252, 252, 252), rgb(223, 223, 223)];
        // this.iconpluscol = RGB(72, 72, 92); //get_textselcol(this.iconcol_e[0], true) == 50 ? RGB(41, 66, 114) : RGB(225, 225, 245);
        // if (!libraryProps.nodeHighlight) return;
        // if (iconcol_h === undefined) {
        // 	this.iconcol_h = this.textcol_h;
        // 	iconcol_h = this.iconcol_h;
        // }
        // if (A(iconcol_h) != 255) {
        // 	this.iconcol_h = RGBAtoRGB(iconcol_h, this.backcol);
        // } else if (iconcol_h !== undefined) {
        // 	this.iconcol_h = iconcol_h;
        // }
        // this.iconcol_h = get_grad(this.iconcol_h, 15, -14);
        // this.iconpluscol_h = RGB(72, 72, 92); //get_textselcol(this.iconcol_h[0], true) == 50 ? RGB(41, 66, 114) : RGB(225, 225, 245);

        if (iconcol_c === "") {this.col.icon_c = this.nodeStyle ? [RGB(252, 252, 252), RGB(223, 223, 223)] : this.col.text;} else if (this.nodeStyle) {if (A(iconcol_c) != 255) {this.col.icon_c = RGBAtoRGB(iconcol_c, this.col.bg);} else this.col.icon_c = iconcol_c; this.col.icon_c = get_grad(this.col.icon_c, 15, -14);}
        // if (iconcol_e === "") {this.col.icon_e = this.nodeStyle ? [RGB(252, 252, 252), RGB(223, 223, 223)] : this.col.text & 0xC0ffffff;} else if (this.nodeStyle) {if (A(iconcol_e) != 255) {this.col.icon_e = RGBAtoRGB(iconcol_e, this.col.bg);} else this.col.icon_e = iconcol_e; this.col.icon_e = get_grad(this.col.icon_e, 15, -14);}
        this.col.icon_e = [rgb(252, 252, 252), rgb(223, 223, 223)];
        this.col.iconPlus = RGB(72, 72, 92); //get_textselcol(this.col.icon_e[0], true) == 50 ? RGB(41, 66, 114) : RGB(225, 225, 245);
        this.col.iconMinus_c = get_textselcol(this.col.icon_c[0], true) == 50 ? RGB(75, 99, 167) : RGB(225, 225, 245);
        this.col.iconMinus_e = RGB(72, 72, 92); //get_textselcol(this.col.icon_e[0], true) == 50 ? RGB(75, 99, 167) : RGB(225, 225, 245);
        // if (!libraryProps.nodeHighlight) return;
        /** Code below will probably not execute */
        if (iconcol_h === undefined) {
            this.col.icon_h = this.nodeStyle
                    ? !pptDefault.blurDark && !pptDefault.blurLight
                            // ? !this.local
                                    ? (colSat(this.col.text_h) < 650
                                            ? this.col.text_h
                                            : this.col.text)
                                    // : (colSat(c_iconcol_h) < 650
                                    // 		? c_iconcol_h
                                    // 		: c_textcol)
                            : RGB(50, 50, 50)
                    : this.col.text_h;
            iconcol_h = this.col.icon_h;
        }
        if (this.nodeStyle) {
            if (A(iconcol_h) != 255) {
                this.col.icon_h = RGBAtoRGB(iconcol_h, this.col.bg);
            } else if (iconcol_h !== undefined) {
                this.col.icon_h = iconcol_h;
            }
            this.col.icon_h = get_grad(this.col.icon_h, 15, -14);
        }
        this.col.iconPlus_h = RGB(72, 72, 92); // get_textselcol(this.col.icon_h[0], true) == 50 ? RGB(41, 66, 114) : RGB(225, 225, 245);
        this.col.iconMinus_h = get_textselcol(this.col.icon_h[0], true) == 50 ? RGB(75, 99, 167) : RGB(225, 225, 245);
    }

    this.get_colors = () => {
        this.col.bg = g_theme.colors.pss_back;
        // this.col.bgSel = set_custom_col(window.GetProperty("_Custom.Colour Background Selected", ""), 1);
        this.col.line = g_pl_colors.title_selected & 0x80ffffff;
        this.s_linecol = g_pl_colors.title_selected & 0x80ffffff;
        // this.textcol = g_pl_colors.artist_normal;
        this.col.textsel = rgb(255,255,255);
        this.iconcol_c = '';
        iconcol_c = this.iconcol_c;
        // this.iconcol_e = set_custom_col(window.GetProperty("_Custom.Colour Node Expand", ""), 1); iconcol_e = this.iconcol_e;
        this.iconcol_h = [];
        iconcol_h = this.iconcol_h;
        // this.backcoltrans = set_custom_col(window.GetProperty("_Custom.Colour Transparent Fill", ""), 1);
        this.col.b1 = 0x04ffffff; this.col.b2 = 0x04000000;
        this.blur = false; //this.blurDark || this.blurLight;
        // if (this.blurDark) {
        // 	this.bg_color_light = RGBA(0, 0, 0, Math.min(160 / this.blurAlpha, 255));
        // 	this.bg_color_dark = RGBA(0, 0, 0, Math.min(80 / this.blurAlpha, 255));
        // }
        // if (this.blurLight) {
        // 	this.bg_color_light = RGBA(255, 255, 255, Math.min(160 / this.blurAlpha, 255));
        // 	this.bg_color_dark = RGBA(255, 255, 255, Math.min(205 / this.blurAlpha, 255));
        // }
        // let textCol = 0;
        if (this.dui) { // custom colour mapping: DUI colours can be remapped by changing the numbers (0-3)
            if (this.col.bg === undefined) this.col.bg = window.GetColourDUI(1);
            this.col.bgSel = window.GetColourDUI(3);
            // textCol = window.GetColourDUI(0);
        } else { // custom colour mapping: CUI colours can be remapped by changing the numbers (0-6)
            if (this.col.bg === undefined) this.col.bg = window.GetColourCUI(3);
            this.col.bgSel = window.GetColourCUI(4);
            // textCol = window.GetColourCUI(0);
        }
        this.col.text = g_pl_colors.artist_normal;
        this.col.text_h = rgb(220, 220, 220);	// hovered text col
        // this.textcol_h = textColHover;
        // if (s_linecol == 1 && window.IsTransparent && !this.dui) s_linecol = 0;
        // if (this.col.search === undefined) this.col.search = s_col < 3 ? this.textcol : this.textcol_h;
        // blend = get_blend(this.backcol == 0 ? 0xff000000 : this.backcol, !s_col || s_col == 2 ? this.textcol : this.textcol_h, 0.75);
        // if (this.txt_box === "")
        //     this.txt_box = s_col < 2 ? get_blend(!s_col ? this.textcol : this.textcol_h, this.col.bg == 0 ? 0xff000000 : this.col.bg, !s_col ? 0.65 : 0.7) : s_col == 2 ? this.textcol : this.textcol_h;
        this.col.txt_box = rgb(125, 127, 128);
        this.col.txt_filter = toRGB(this.col.txt_box);
        this.col.search = rgb(180, 182, 184);
        // if (this.s_linecol === "") this.s_linecol = s_linecol == 0 ? RGBA(136, 136, 136, 85) : s_linecol == 1 ? blend : this.txt_box;
        // if (window.IsTransparent && this.backcoltrans) {this.bg = true; this.col.bg = this.backcoltrans}
        if (!window.IsTransparent || this.dui) {this.bg = true; if ((R(this.col.bg) + G(this.col.bg) + B(this.col.bg)) > 759) this.col.b2 = 0x06000000;}
        this.icon_col();
        this.col.t = this.bg ? get_textselcol(this.col.bg, true) : 200;
           this.col.searchSel = window.IsTransparent || !this.col.bgSel ? 0xff0099ff : this.col.bgSel != this.col.search ? this.col.bgSel : 0xff0099ff;
    }
    this.get_colors();

    this.get_font = () => {
        this.font = ft.library_tree;
        orig_font_sz = libraryProps.baseFontSize;
        zoom = libraryProps.zoomFont;
        zoomFontSize = Math.max(Math.round(orig_font_sz * zoom / 100), 1);
        if (!this.sizedNode) {	// prevents node sizes from growing every time this method is called
            this.node_sz = is_4k ? Math.round(this.node_sz * libraryProps.zoomNode / 60) : Math.round(this.node_sz * libraryProps.zoomNode / 100);
            this.sizedNode = true;
        }
        this.font = gdi.Font(this.font.Name, zoomFontSize, this.font.Style);
        libraryProps.zoomFont = Math.round(zoomFontSize / orig_font_sz * 100);
        this.searchFont = gdi.Font(this.font.Name, this.font.Size, 2);
        this.j_font = gdi.Font(this.font.Name, this.font.Size * 1.5, 1);
        calc_text();
    }

    const calc_text = () => {
        s.gr(1, 1, false, (/** @type {GdiGraphics} */ g) => {
            if (!this.local) this.row_h = Math.max(Math.round(g.CalcTextHeight("String", this.font)) + libraryProps.rowVertPadding, 2);
            if (this.nodeStyle) {
                this.node_sz = Math.round(s.clamp(this.node_sz, 7, this.row_h - 6));
                library_tree.create_images();	// is this needed??
                libraryProps.zoomNode = Math.round(this.node_sz / node_sz * 100);}
            else {
                this.node_sz = Math.round(s.clamp(this.node_sz, 7, this.row_h * 1.15));
                this.iconFont = gdi.Font('Segoe UI', this.node_sz, 0);
                libraryProps.zoomNode = Math.round(this.node_sz / libraryProps.baseFontSize * 100);
            }
            sp = Math.max(Math.round(g.CalcTextWidth(" ", this.font)), 4);
            sp1 = Math.max(Math.round(sp * 1.5), 6);
            if (!this.nodeStyle) {
                const sp_e = g.MeasureString(this.expand, this.iconFont, 0, 0, 500, 500).Width;
                const sp_c = g.MeasureString(this.collapse, this.iconFont, 0, 0, 500, 500).Width;
                sp2 = Math.round(Math.max(sp_e, sp_c) + sp / 3);}
        });
        this.l_s1 = Math.round(sp1 / 2) + scaleForDisplay(1); //Math.max(sp1 / 2, 4);
        this.l_s2 = Math.ceil(this.node_sz / 2);
        this.l_s3 = Math.max(scaleForDisplay(8), this.node_sz / 2)
        this.icon_w = this.nodeStyle ? this.node_sz + sp1 : sp + sp2;
        this.sel = (this.nodeStyle ? sp1 : sp + Math.round(sp / 3)) / 2;
        this.tt = this.nodeStyle ? -Math.ceil(sp1 / 2 - 3) + sp1 : sp;
    }

    const nodeZoom = step => {this.node_sz += step; calc_text(); p.on_size();}

    const filterZoom = step => {
        let zoomFilter = libraryProps.zoomFilter / 100;
        if (zoomFilter < 0.8) return;
        zoomFilter += step * 0.1;
        zoomFilter = Math.max(zoomFilter, 0.8);
        p.filterFont = gdi.Font("Segoe UI", 11 * s.scale * zoomFilter, 1);
        p.filterBtnFont = gdi.Font("Segoe UI Symbol", zoomFilter > 1.05 ? Math.floor(9 * s.scale * zoomFilter) : 9 * s.scale * zoomFilter, 1);
        libraryProps.zoomFilter = Math.round(zoomFilter * 100);
        p.calc_text(); but.refresh(true);
    }

    const txtZoom = step => {
        zoomFontSize += step;
        zoomFontSize = Math.max(zoomFontSize, 1);
        const fnm = this.font.Name, fst = this.font.Style;
        this.font = gdi.Font(fnm, zoomFontSize, fst);
        this.searchFont = gdi.Font(fnm, zoomFontSize, 2);
        this.jumpFont = gdi.Font(fnm, zoomFontSize * 1.5, 1);
        calc_text(); p.on_size(); jumpSearch.on_size();
        library_tree.create_tooltip(); if (pptDefault.searchShow || pptDefault.sbarShow) but.refresh(true); sbar.reset(); libraryProps.zoomFont = Math.round(zoomFontSize / libraryProps.baseFontSize * 100);
    }

    this.wheel = (step, all) => {
        const textZoom = p.m_x >= ui.x + Math.round(this.icon_w + ui.margin + (libraryProps.rootNode ? pptDefault.treeIndent : 0));
        if (p.m_y > p.s_h + ui.y && textZoom || all) txtZoom(step);
        if (p.m_y > p.s_h + ui.y && !textZoom || all) nodeZoom(step);
        if (p.m_y <= p.s_h + ui.y || all) filterZoom(step);
        window.Repaint();

        // if (p.m_y > p.s_h + ui.y) {
        // 	if (p.m_x >= ui.x + Math.round(this.icon_w + this.margin + (libraryProps.rootNode ? this.pad : 0))) {
        //		zoom_font_sz += step;
        // 		zoom_font_sz = Math.min(is_4k ? 96 : 60, Math.max(zoom_font_sz, 12));
        // 		this.font = gdi.Font(this.font.Name, zoom_font_sz, this.font.Style);
        // 		this.s_font = gdi.Font(this.font.Name, this.font.Size, 2);
        // 		this.j_font = gdi.Font(this.font.Name, this.font.Size * 1.5, 1);
        // 		this.calc_text();
        // 		p.on_size();
        // 		jumpSearch.on_size();
        // 		library_tree.create_tooltip();
        // 		if (libraryProps.searchMode || libraryProps.showScrollbar)
        // 			but.refresh(true);
        // 		sbar.reset();
        // 		window.Repaint();
        // 		libraryProps.zoomFont = Math.round(zoom_font_sz / orig_font_sz * 100);
        // 	} else {
        // 		this.node_sz += step;
        // 		this.calc_text();
        // 		p.on_size();
        // 		window.Repaint();
        // 		libraryProps.zoomNode = Math.round(this.node_sz / 12 * 100);
        // 	}
        // } else {
        // 	if (p.scale < 0.9)
        // 		return;
        // 	p.scale += step * 0.1;
        // 	p.scale = Math.max(p.scale, 0.9);
        // 	libraryProps.zoomFilter = Math.round(p.scale * 100);
        // 	p.setFilterFont();
        // 	p.calc_text();
        // 	but.refresh(true);
        // 	p.search_paint();
        // }
    }

    this.block = function() {return this.w <= 10 || this.h <= 10 || !window.IsVisible;}
    this.create_images = () => {
        var cc = StringFormat(1, 1),
            font1 = gdi.Font("Segoe UI", 270, 1),
            font2 = gdi.Font("Segoe UI", 120, 1),
            font3 = gdi.Font("Segoe UI", 200, 1),
            font4 = gdi.Font("Segoe UI", 90, 1),
            gb,
            tcol = !pptDefault.blurDark && !pptDefault.blurLight ? this.col.text : this.dui ? window.GetColourDUI(0) : window.GetColourCUI(0);
        const imgTypes = ["COVER", "SELECTION"];
        const noimg = {};
        for (var i = 0; i < imgTypes.length; i++) {
            var n = imgTypes[i];
            noimg[i] = gdi.CreateImage(500, 500);
            gb = noimg[i].GetGraphics();
            gb.SetSmoothingMode(SmoothingMode.HighQuality);
            // if (!pptDefault.blurDark && !pptDefault.blurLight) {
                gb.FillSolidRect(0, 0, 500, 500, tcol);
                gb.FillGradRect(-1, 0, 505, 500, 90, this.col.bg & 0xbbffffff, this.col.bg, 1.0);
            // }
            gb.SetTextRenderingHint(3);
            gb.DrawString("NO", i ? font3 : font1, tcol & 0x25ffffff, 0, 0, 500, 275, cc);
            gb.DrawString(n, i ? font4 : font2, tcol & 0x20ffffff, 2.5, 175, 500, 275, cc);
            gb.FillSolidRect(60, 388, 380, 50, tcol & 0x15ffffff);
            noimg[i].ReleaseGraphics(gb);
        }
        this.get = true;
    };
    this.create_images();
    this.draw = function (gr) {
        try {
            if (this.bg) {
                gr.FillSolidRect(this.x, this.y - scaleForDisplay(12), this.w + (is_4k ? 35 : 17), this.h + scaleForDisplay(12), this.col.bg);
            }
            // if (!this.blur && !this.imgBg)
            // 	return;
            // this.get_img_fallback();
            // if (blurImg)
            // 	gr.DrawImage(blurImg, this.x, this.y, this.w, this.h, 0, 0, blurImg.Width, blurImg.Height);
        } catch (e) {}
    }
    this.focus_changed = function(ms) {k++; if (k == 1) {this.on_playback_new_track(); timer.reset(timer.focus); timer.focus = setTimeout(function() {k = 0; timer.focus = false;}, ms); return;} timer.reset(timer.focus); timer.focus = setTimeout(function() {ui.on_playback_new_track(); k = 0; timer.focus = false;}, ms);}

    var handle_list = new FbMetadbHandleList();
    this.upd_handle_list = true;
    this.handle = function() {
        var handle = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();
        if (!handle) {
            if (this.upd_handle_list) {
                handle_list = plman.GetPlaylistItems(plman.ActivePlaylist);
                this.upd_handle_list = false;
            }
            if (handle_list.Count) handle = handle_list[0];
        }
        return handle;
    }

    this.on_playback_new_track = function (handle) {
        // currently unused
    }
    var stub = function (n) {
        // image_path_o = n ? "noitem" : "stub";
        return noimg[n].Clone(0, 0, noimg[n].Width, noimg[n].Height);
    }
}

function Scrollbar() {
    let period = pptDefault.duration.split(0); period = {drag : 200, inertia : s.clamp(s.value(period[3], 3000, 0), 0, 5000), scroll : s.clamp(s.value(period[1], 500, 0), 0, 5000)}; period.step = period.scroll * 2 / 3;
    let alpha = 255/*!pptDefault.sbarCol ? 75 : (!ui.sbarType ? 68 : 51)*/, amplitude, b_is_dragging = false, bar_ht = 0, bar_timer = null, bar_y = 0, but_h = 0, clock = Date.now(), counter = 0, drag_distance_per_row = 0, duration = period.scroll, elap = 0, event = "", fast = false, frame, hover = false, hover_o = false, init = true, initial_drag_y = 0, initial_scr = 1, initial_y = -1, ix = -1, lastTouchDn = Date.now(), max_scroll, offset = 0, ratio = 1, reference = -1, rows = 0, scrollbar_height = 0, scrollbar_travel = 0, start = 0, startTime = 0, ticker, timestamp, ts, velocity;
    const alpha1 = alpha, alpha2 = 255/*!pptDefault.sbarCol ? 128 : (!ui.sbarType ? 119 : 85)*/, inStep = ui.sbarType && pptDefault.sbarCol ? 12 : 18, ln_sp = pptDefault.searchShow && !ui.local ? Math.floor(ui.row_h * 0.1) : 0, min = 10 * s.scale, mv = 2 * s.scale;
    this.count = -1; this.delta = 0; pptDefault.flickDistance = s.clamp(pptDefault.flickDistance, 0, 10); this.draw_timer = null; this.item_y = pptDefault.searchShow ? ui.row_h + (!ui.local ? ln_sp * 2 : 0) : ui.margin; this.row_count = 0; this.rows_drawn = 0; this.row_h = 0; this.scroll = 0; this.scrollable_lines = 0; pptDefault.scrollStep = s.clamp(pptDefault.scrollStep, 0, 10); pptDefault.touchStep = s.clamp(pptDefault.touchStep, 1, 10); this.stripe_w = 0; this.timer_but = null; this.touch = {dn: false, end: 0, start: 0}; this.tree_w = 0; this.x = 0; this.y = 0; this.w = 0; this.h = 0;

    const upd_debounce = s.debounce(() => lib_manager.treeState(false, libraryProps.rememberTree), 400);
    const nearest = y => {y = (y - but_h) / scrollbar_height * max_scroll; y = y / this.row_h; y = Math.round(y) * this.row_h; return y;}
    const scroll_throttle = s.throttle(() => {this.delta = this.scroll; scroll_to();}, 16);
    const scroll_timer = () => this.draw_timer = setInterval(() => {if (ui.w < 1 || !window.IsVisible) return; smooth_scroll();}, 16);

    this.leave = () => {if (this.touch.dn) this.touch.dn = false; if (b_is_dragging) return; hover = !hover; this.paint(); hover = false; hover_o = false;}
    this.page_throttle = s.throttle(dir => this.check_scroll(Math.round((this.scroll + dir * -(this.rows_drawn - 1) * this.row_h) / this.row_h) * this.row_h), 100);
    this.reset = () => {this.delta = this.scroll = 0; this.item_y = p.s_h; this.metrics(this.x, this.y, this.w, this.h, this.rows_drawn, this.row_h);}
    this.set_rows = row_count => {if (!row_count) this.item_y = p.s_h; this.row_count = row_count; this.metrics(this.x, this.y, this.w, this.h, this.rows_drawn, this.row_h);}
    this.wheel = step => this.check_scroll(Math.round((this.scroll + step * - (!pptDefault.scrollStep ? this.rows_drawn - 1 : pptDefault.scrollStep) * this.row_h) / this.row_h) * this.row_h, pptDefault.scrollStep ? 'step' : "");
    this.isDragging = () => {return b_is_dragging;}

    this.metrics = (x, y, w, h, rows_drawn, row_h) => {
        this.x = x; this.y = Math.round(y); this.w = w; this.h = h; this.rows_drawn = rows_drawn; if (!pptDefault.autoFit) this.rows_drawn = Math.floor(this.rows_drawn); this.row_h = row_h; but_h = ui.but_h;
        // draw info
        scrollbar_height = Math.round(this.h - but_h * 2);
        bar_ht = Math.max(Math.round(scrollbar_height * this.rows_drawn / this.row_count), s.clamp(scrollbar_height / 2, 5, ui.grip_h));
        scrollbar_travel = scrollbar_height - bar_ht;
        // scrolling info
        this.scrollable_lines = this.row_count - this.rows_drawn;
        ratio = this.row_count / this.scrollable_lines;
        bar_y = but_h + scrollbar_travel * (this.delta * ratio) / (this.row_count * this.row_h);
        drag_distance_per_row = scrollbar_travel / this.scrollable_lines;
        // panel info
        this.tree_w = ui.w - Math.max(pptDefault.sbarShow && this.scrollable_lines > 0 ? ui.sbar_sp + ui.sel : ui.sel, ui.margin);
        if (pptDefault.rowStripes) this.stripe_w = pptDefault.sbarShow && this.scrollable_lines > 0 ? ui.w - ui.sbar_sp - Math.round(3 * s.scale) : ui.w;
        max_scroll = this.scrollable_lines * this.row_h;
        but.set_scroll_btns_hide();
    }

    this.draw = gr => {
        if (this.scrollable_lines > 0) {
            switch (ui.sbarType) {
                case 0:
                    if (pptDefault.rowStripes) gr.FillSolidRect(this.x, this.y, this.w, this.h, ui.col.b1);
                    if (!pptDefault.sbarCol) {
                        gr.FillSolidRect(this.x, this.y + bar_y, this.w, bar_ht, RGBA(ui.col.t, ui.col.t, ui.col.t, !hover && !b_is_dragging ? alpha : hover && !b_is_dragging ? alpha : 192));
                    } else {
                        gr.FillSolidRect(this.x, this.y + bar_y, this.w, bar_ht, ui.col.text & (!hover && !b_is_dragging ? RGBA(255, 255, 255, alpha) : hover && !b_is_dragging ? RGBA(255, 255, 255, alpha) : 0x99ffffff));
                    }
                    break;
                case 1:
                    if (pref.whiteTheme) {
                        if (!pptDefault.sbarCol) {
                            if (libraryProps.showScrollbar === true && sbar.w === scaleForDisplay(12) || pref.autoSbar_Library === false && sbar.w === scaleForDisplay(12)) {
                                const thumbColors = [
                                    RGBA(200, 200, 200, alpha), // normal
                                    RGBA(120, 120, 120, alpha), // hover
                                    RGBA(120, 120, 120, alpha)  // drag
                                ]
                                gr.FillSolidRect(this.x - scaleForDisplay(8), this.y - 8, this.w + scaleForDisplay(26), this.h + g_properties.row_h * 2 + 8, ui.col.bg);
                                gr.FillSolidRect(this.x, this.y + bar_y, this.w, bar_ht, b_is_dragging ? thumbColors[2] : hover ? thumbColors[1] : thumbColors[0]);
                            }
                        } else {
                            gr.FillSolidRect(this.x, this.y + bar_y, this.w, bar_ht, RGBA(255, 255, 255, 255) & (!hover && !b_is_dragging ? RGBA(200, 200, 200, 255) : hover && !b_is_dragging ? RGBA(100, 100, 100, 255) : 0xff8c8c8c)); break;
                        }
                        break;
                    } else if (pref.blackTheme) {
                        if (!pptDefault.sbarCol) {
                            if (libraryProps.showScrollbar === true && sbar.w === scaleForDisplay(12) || pref.autoSbar_Library === false && sbar.w === scaleForDisplay(12)) {
                                const thumbColors = [
                                    RGBA(100, 100, 100, alpha), // normal
                                    RGBA(160, 160, 160, alpha), // hover
                                    RGBA(160, 160, 160, alpha)  // drag
                                ]
                                gr.FillSolidRect(this.x - scaleForDisplay(8), this.y - 8, this.w + scaleForDisplay(26), this.h + g_properties.row_h * 2 + 8, ui.col.bg);
                                gr.FillSolidRect(this.x, this.y + bar_y, this.w, bar_ht, b_is_dragging ? thumbColors[2] : hover ? thumbColors[1] : thumbColors[0]);
                            }
                        } else {
                            gr.FillSolidRect(this.x, this.y + bar_y, this.w, bar_ht, RGBA(255, 255, 255, 255) & (!hover && !b_is_dragging ? RGBA(100, 100, 100, 255) : hover && !b_is_dragging ? RGBA(160, 160, 160, 255) : 0xffa0a0a0)); break;
                        }
                        break;
                    } else if (pref.blueTheme) {
                        if (!pptDefault.sbarCol) {
                            if (libraryProps.showScrollbar === true && sbar.w === scaleForDisplay(12) || pref.autoSbar_Library === false && sbar.w === scaleForDisplay(12)) {
                                const thumbColors = [
                                    RGBA(10, 135, 225, alpha),  // normal
                                    RGBA(242, 230, 170, alpha), // hover
                                    RGBA(242, 230, 170, alpha)  // drag
                                ]
                                gr.FillSolidRect(this.x - scaleForDisplay(8), this.y - 8, this.w + scaleForDisplay(26), this.h + g_properties.row_h * 2 + 8, ui.col.bg);
                                gr.FillSolidRect(this.x, this.y + bar_y, this.w, bar_ht, b_is_dragging ? thumbColors[2] : hover ? thumbColors[1] : thumbColors[0]);
                            }
                        } else {
                            gr.FillSolidRect(this.x, this.y + bar_y, this.w, bar_ht, RGBA(255, 255, 255, 255) & (!hover && !b_is_dragging ? RGBA(10, 135, 225, 255) : hover && !b_is_dragging ? RGBA(242, 230, 170, 255) : 0xffffe4cb)); break;
                        }
                        break;
                    } else if (pref.darkblueTheme) {
                        if (!pptDefault.sbarCol) {
                            if (libraryProps.showScrollbar === true && sbar.w === scaleForDisplay(12) || pref.autoSbar_Library === false && sbar.w === scaleForDisplay(12)) {
                                const thumbColors = [
                                    RGBA(27, 55, 90, alpha),    // normal
                                    RGBA(255, 202, 128, alpha), // hover
                                    RGBA(255, 202, 128, alpha)  // drag
                                ]
                                gr.FillSolidRect(this.x - scaleForDisplay(8), this.y - 8, this.w + scaleForDisplay(26), this.h + g_properties.row_h * 2 + 8, ui.col.bg);
                                gr.FillSolidRect(this.x, this.y + bar_y, this.w, bar_ht, b_is_dragging ? thumbColors[2] : hover ? thumbColors[1] : thumbColors[0]);
                            }
                        } else {
                            gr.FillSolidRect(this.x, this.y + bar_y, this.w, bar_ht, RGBA(255, 255, 255, 255) & (!hover && !b_is_dragging ? RGBA(38, 70, 112, 255) : hover && !b_is_dragging ? RGBA(255, 202, 128, 255) : 0xffffca80)); break;
                        }
                        break;
                    } else if (pref.redTheme) {
                        if (!pptDefault.sbarCol) {
                            if (libraryProps.showScrollbar === true && sbar.w === scaleForDisplay(12) || pref.autoSbar_Library === false && sbar.w === scaleForDisplay(12)) {
                                const thumbColors = [
                                    RGBA(145, 25, 25, alpha),   // normal
                                    RGBA(245, 212, 165, alpha), // hover
                                    RGBA(245, 212, 165, alpha)  // drag
                                ]
                                gr.FillSolidRect(this.x - scaleForDisplay(8), this.y - 8, this.w + scaleForDisplay(26), this.h + g_properties.row_h * 2 + 8, ui.col.bg);
                                gr.FillSolidRect(this.x, this.y + bar_y, this.w, bar_ht, b_is_dragging ? thumbColors[2] : hover ? thumbColors[1] : thumbColors[0]);
                            }
                        } else {
                            gr.FillSolidRect(this.x, this.y + bar_y, this.w, bar_ht, RGBA(255, 255, 255, 255) & (!hover && !b_is_dragging ? RGBA(145, 25, 25, 255) : hover && !b_is_dragging ? RGBA(245, 212, 165, 255) : 0xffffc59a)); break;
                        }
                        break;
                    } else if (pref.creamTheme) {
                        if (!pptDefault.sbarCol) {
                            if (libraryProps.showScrollbar === true && sbar.w === scaleForDisplay(12) || pref.autoSbar_Library === false && sbar.w === scaleForDisplay(12)) {
                                const thumbColors = [
                                    RGBA(200, 200, 200, alpha), // normal
                                    RGBA(120, 170, 130, alpha), // hover
                                    RGBA(120, 170, 130, alpha)  // drag
                                ]
                                gr.FillSolidRect(this.x - scaleForDisplay(8), this.y - 8, this.w + scaleForDisplay(26), this.h + g_properties.row_h * 2 + 8, ui.col.bg);
                                gr.FillSolidRect(this.x, this.y + bar_y, this.w, bar_ht, b_is_dragging ? thumbColors[2] : hover ? thumbColors[1] : thumbColors[0]);
                            }
                        } else {
                            gr.FillSolidRect(this.x, this.y + bar_y, this.w, bar_ht, RGBA(255, 255, 255, 255) & (!hover && !b_is_dragging ? RGBA(200, 200, 200, 255) : hover && !b_is_dragging ? RGBA(120, 170, 130, 255) : 0xff668068)); break;
                        }
                        break;
                    } else if (pref.nblueTheme) {
                        if (!pptDefault.sbarCol) {
                            if (libraryProps.showScrollbar === true && sbar.w === scaleForDisplay(12) || pref.autoSbar_Library === false && sbar.w === scaleForDisplay(12)) {
                                const thumbColors = [
                                    RGBA(0, 200, 255, alpha), // normal
                                    RGBA(0, 238, 255, alpha), // hover
                                    RGBA(0, 238, 255, alpha)  // drag
                                ]
                                gr.FillSolidRect(this.x - scaleForDisplay(8), this.y - 8, this.w + scaleForDisplay(26), this.h + g_properties.row_h * 2 + 8, ui.col.bg);
                                gr.FillSolidRect(this.x, this.y + bar_y, this.w, bar_ht, b_is_dragging ? thumbColors[2] : hover ? thumbColors[1] : thumbColors[0]);
                            }
                        } else {
                            gr.FillSolidRect(this.x, this.y + bar_y, this.w, bar_ht, RGBA(255, 255, 255, 255) & (!hover && !b_is_dragging ? RGBA(0, 200, 255, 255) : hover && !b_is_dragging ? RGBA(0, 238, 255, 255) : 0xff00eeff)); break;
                        }
                        break;
                    } else if (pref.ngreenTheme) {
                        if (!pptDefault.sbarCol) {
                            if (libraryProps.showScrollbar === true && sbar.w === scaleForDisplay(12) || pref.autoSbar_Library === false && sbar.w === scaleForDisplay(12)) {
                                const thumbColors = [
                                    RGBA(0, 200, 0, alpha), // normal
                                    RGBA(0, 255, 0, alpha), // hover
                                    RGBA(0, 255, 0, alpha)  // drag
                                ]
                                gr.FillSolidRect(this.x - scaleForDisplay(8), this.y - 8, this.w + scaleForDisplay(26), this.h + g_properties.row_h * 2 + 8, ui.col.bg);
                                gr.FillSolidRect(this.x, this.y + bar_y, this.w, bar_ht, b_is_dragging ? thumbColors[2] : hover ? thumbColors[1] : thumbColors[0]);
                            }
                        } else {
                            gr.FillSolidRect(this.x, this.y + bar_y, this.w, bar_ht, RGBA(255, 255, 255, 255) & (!hover && !b_is_dragging ? RGBA(0, 200, 0, 255) : hover && !b_is_dragging ? RGBA(0, 255, 0, 255) : 0xff00ff00)); break;
                        }
                        break;
                    } else if (pref.nredTheme) {
                        if (!pptDefault.sbarCol) {
                            if (libraryProps.showScrollbar === true && sbar.w === scaleForDisplay(12) || pref.autoSbar_Library === false && sbar.w === scaleForDisplay(12)) {
                                const thumbColors = [
                                    RGBA(229, 7, 44, alpha), // normal
                                    RGBA(255, 0, 0, alpha),  // hover
                                    RGBA(255, 0, 0, alpha)   // drag
                                ]
                                gr.FillSolidRect(this.x - scaleForDisplay(8), this.y - 8, this.w + scaleForDisplay(26), this.h + g_properties.row_h * 2 + 8, ui.col.bg);
                                gr.FillSolidRect(this.x, this.y + bar_y, this.w, bar_ht, b_is_dragging ? thumbColors[2] : hover ? thumbColors[1] : thumbColors[0]);
                            }
                        } else {
                            gr.FillSolidRect(this.x, this.y + bar_y, this.w, bar_ht, RGBA(255, 255, 255, 255) & (!hover && !b_is_dragging ? RGBA(229, 7, 44, 255) : hover && !b_is_dragging ? RGBA(255, 8, 8, 255) : 0xffff0808)); break;
                        }
                        break;
                    } else if (pref.ngoldTheme) {
                        if (!pptDefault.sbarCol) {
                            if (libraryProps.showScrollbar === true && sbar.w === scaleForDisplay(12) || pref.autoSbar_Library === false && sbar.w === scaleForDisplay(12)) {
                                const thumbColors = [
                                    RGBA(254, 204, 3, alpha), // normal
                                    RGBA(255, 242, 3, alpha), // hover
                                    RGBA(255, 242, 3, alpha)  // drag
                                ]
                                gr.FillSolidRect(this.x - scaleForDisplay(8), this.y - 8, this.w + scaleForDisplay(26), this.h + g_properties.row_h * 2 + 8, ui.col.bg);
                                gr.FillSolidRect(this.x, this.y + bar_y, this.w, bar_ht, b_is_dragging ? thumbColors[2] : hover ? thumbColors[1] : thumbColors[0]);
                            }
                        } else {
                            gr.FillSolidRect(this.x, this.y + bar_y, this.w, bar_ht, RGBA(255, 255, 255, 255) & (!hover && !b_is_dragging ? RGBA(254, 204, 3, 255) : hover && !b_is_dragging ? RGBA(255, 242, 3, 255) : 0xfffff203)); break;
                        }
                        break;
                    }
                case 2:
                    ui.theme.SetPartAndStateID(6, 1);
                    ui.theme.DrawThemeBackground(gr, this.x, this.y, this.w, this.h);
                    ui.theme.SetPartAndStateID(3, !hover && !b_is_dragging ? 1 : hover && !b_is_dragging ? 2 : 3);
                    ui.theme.DrawThemeBackground(gr, this.x, this.y + bar_y, this.w, bar_ht);
                    break;
            }
        }
    }

    this.paint = () => {
        if (hover) init = false; if (init) return; alpha = hover ? alpha1 : alpha2;
        clearTimeout(bar_timer); bar_timer = null;
        bar_timer = setInterval(() => {alpha = hover ? Math.min(alpha += inStep, alpha2) : Math.max(alpha -= 3, alpha1); window.RepaintRect(this.x, this.y, this.w, this.h);
        if (hover && alpha == alpha2 || !hover && alpha == alpha1) {hover_o = hover; clearTimeout(bar_timer); bar_timer = null;}}, 25);
    }

    this.lbtn_dn = (p_x, p_y) => {
        if (!pptDefault.sbarShow && pptDefault.touchControl) return tap(p_y);
        const x = p_x - this.x, y = p_y - this.y; let dir;
        if (x > this.w || y < 0 || y > this.h || this.row_count <= this.rows_drawn) return;
        if (x < 0) {if (!pptDefault.touchControl) return; else return tap(p_y);}
        if (y < but_h || y > this.h - but_h) return;
        if (y < bar_y) dir = 1; // above bar
        else if (y > bar_y + bar_ht) dir = -1; // below bar
        if (y < bar_y || y > bar_y + bar_ht) shift_page(dir, nearest(y));
        else { // on bar
            b_is_dragging = true; but.Dn = true; window.RepaintRect(this.x, this.y, this.w, this.h);
            initial_drag_y = y - bar_y + but_h;
        }
    }

    this.lbtn_dblclk = (p_x, p_y) => {
        const x = p_x - this.x, y = p_y - this.y; let dir;
        if (x < 0 || x > this.w || y < 0 || y > this.h || this.row_count <= this.rows_drawn) return;
        if (y < but_h || y > this.h - but_h) return;
        if (y < bar_y) dir = 1; // above bar
        else if (y > bar_y + bar_ht) dir = -1; // below bar
        if (y < bar_y || y > bar_y + bar_ht) shift_page(dir, nearest(y));
    }

    this.move = (p_x, p_y) => {
        if (pptDefault.touchControl) {
            const delta = reference - p_y;
            if (delta > mv || delta < -mv) {
                reference = p_y;
                if (pptDefault.flickDistance) offset = s.clamp(offset + delta, 0, max_scroll);
                if (this.touch.dn) {ui.drag_drop_id = ui.touch_dn_id = -1;}
            }
        }
        if (this.touch.dn && !vk.k('zoom')) {ts = Date.now(); if (ts - startTime > 300) startTime = ts; lastTouchDn = ts; this.check_scroll(initial_scr + (initial_y - p_y) * pptDefault.touchStep, 'drag'); return;}
        const x = p_x - this.x, y = p_y - this.y;
        if (x < 0 || x > this.w || y > bar_y + bar_ht || y < bar_y /*|| but.Dn*/) hover = false; else hover = true;
        if (hover != hover_o && !bar_timer) this.paint();
        if (!b_is_dragging || this.row_count <= this.rows_drawn) return;
        this.check_scroll(Math.round((y - initial_drag_y) / drag_distance_per_row) * this.row_h);
    }

    this.lbtn_up = (p_x, p_y) => {
        if (this.touch.dn) {
            this.touch.dn = false;
            clearInterval(ticker);
            if (!counter) track(true);
            if (Math.abs(velocity) > min && Date.now() - startTime < 300) {
                amplitude = pptDefault.flickDistance * velocity * pptDefault.touchStep;
                timestamp = Date.now();
                this.check_scroll(Math.round((this.scroll + amplitude) / this.row_h) * this.row_h, 'inertia');
            }
        }
        if (!hover && b_is_dragging) this.paint();
        else window.RepaintRect(this.x, this.y, this.w, this.h);
        if (b_is_dragging) {b_is_dragging = false; but.Dn = false;} initial_drag_y = 0;
        if (this.timer_but) {clearTimeout(this.timer_but); this.timer_but = null;}; this.count = -1;
    }

    const tap = p_y => {
        if (amplitude) {clock = 0; this.scroll = this.delta;}
        counter = 0; initial_scr = this.scroll;
        this.touch.dn = true; initial_y = reference = p_y;  if (!offset) offset = p_y;
        velocity = amplitude = 0;
        if (!pptDefault.flickDistance) return;
        frame = offset;
        startTime = timestamp = Date.now();
        clearInterval(ticker);
        ticker = setInterval(track, 100);
    }

    const track = initial => {
        let now, elapsed, delta, v;
        counter++; now = Date.now();
        if (now - lastTouchDn < 10000 && counter == 4) {ui.touch_dn_id = -1; p.last_pressed_coord = {x: -1, y: -1}}
        elapsed = now - timestamp; if (initial) elapsed = Math.max(elapsed, 32);
        timestamp = now;
        delta = offset - frame;
        frame = offset;
        v = 1000 * delta / (1 + elapsed);
        velocity = 0.8 * v + 0.2 * velocity;
    }

    this.check_scroll = (new_scroll, type) => {
        const b = s.clamp(new_scroll, 0, max_scroll);
        if (b == this.scroll) return; this.scroll = b;
        if (libraryProps.smoothScroll) {
            elap = 16; event = type; this.item_y = p.s_h; start = this.delta;
            if (event != 'drag' || pptDefault.touchStep > 1) {
                duration = !event ? period.scroll : period[event];
                if (b_is_dragging) {if (Math.abs(this.delta - this.scroll) < scrollbar_height) fast = false; else {fast = true; duration = period.step;}}
                clock = Date.now(); if (!this.draw_timer) {scroll_timer(); smooth_scroll();}
            } else scroll_drag();
        } else {scroll_throttle(); upd_debounce();}
    }

    const calc_item_y = () => {ix = Math.round(this.delta / this.row_h + 0.4); this.item_y = Math.round(this.row_h * ix + p.s_h - this.delta);}
    const position = (Start, End, Elapsed, Duration, Event) => {if (Elapsed > Duration) return End; const n = Elapsed / Duration; Event = b_is_dragging ? !fast ? ease.bar(n) : ease.barFast(n) : Event != 'inertia' ? ease.scroll(n) : ease.inertia(n); return Start + (End - Start) * Event;}
    const scroll_drag = () => {this.delta = this.scroll; scroll_to(); calc_item_y(); upd_debounce();}
    const scroll_finish = () => {if (!this.draw_timer) return; this.delta = this.scroll; bar_y = but_h + scrollbar_travel * (this.delta * ratio) / (this.row_count * this.row_h); libraryProps.rememberTree ? lib_manager.treeState(false, libraryProps.rememberTree) : p.tree_paint(); calc_item_y(); clearTimeout(this.draw_timer); this.draw_timer = null;}
    const scroll_to = () => {bar_y = but_h + scrollbar_travel * (this.delta * ratio) / (this.row_count * this.row_h); p.tree_paint();}
    const shift = (dir, nearest_y) => {let target = Math.round((this.scroll + dir * -((this.rows_drawn - 1) * this.row_h)) / this.row_h) * this.row_h; if (dir == 1) target = Math.max(target, nearest_y); else target = Math.min(target, nearest_y); return target;}
    const shift_page = (dir, nearest_y) => {this.check_scroll(shift(dir, nearest_y)); if (!this.timer_but) {this.timer_but = setInterval(() => {if (this.count > 1) {this.check_scroll(shift(dir, nearest_y));} else this.count++;}, 100);}}
    const smooth_scroll = () => {
        this.delta = position(start, this.scroll, Date.now() - clock + elap, duration, event);
        if (Math.abs(this.scroll - this.delta) > 0.5) scroll_to(); else scroll_finish();
    }

    this.but = dir => {this.check_scroll(Math.round((this.scroll + dir * -this.row_h) / this.row_h) * this.row_h); if (!this.timer_but) {this.timer_but = setInterval(() => {if (this.count > 6) {this.check_scroll(this.scroll + dir * -this.row_h);} else this.count++;}, 40);}}
    this.scroll_round = () => {if (this.item_y == p.s_h) return; this.check_scroll((this.item_y < p.s_h ? Math.floor(this.scroll / this.row_h) : Math.ceil(this.scroll / this.row_h)) * this.row_h);}
    this.scroll_to_end = () => this.check_scroll(max_scroll);
}


function Bezier(){const i=4,c=.001,o=1e-7,v=10,l=11,s=1/(l-1),n=typeof Float32Array==="function";function e(r,n){return 1-3*n+3*r}function u(r,n){return 3*n-6*r}function a(r){return 3*r}function w(r,n,t){return((e(n,t)*r+u(n,t))*r+a(n))*r}function y(r,n,t){return 3*e(n,t)*r*r+2*u(n,t)*r+a(n)}function h(r,n,t,e,u){let a,f,i=0;do{f=n+(t-n)/2;a=w(f,e,u)-r;if(a>0){t=f}else{n=f}}while(Math.abs(a)>o&&++i<v);return f}function A(r,n,t,e){for(let u=0;u<i;++u){const a=y(n,t,e);if(a===0){return n}const f=w(n,t,e)-r;n-=f/a}return n}function f(r){return r}function bezier(i,t,o,e){if(!(0<=i&&i<=1&&0<=o&&o<=1)){throw new Error("Bezier x values must be in [0, 1] range")}if(i===t&&o===e){return f}const v=n?new Float32Array(l):new Array(l);for(let r=0;r<l;++r){v[r]=w(r*s,i,o)}function u(r){const e=l-1;let n=0,t=1;for(;t!==e&&v[t]<=r;++t){n+=s}--t;const u=(r-v[t])/(v[t+1]-v[t]),a=n+u*s,f=y(a,i,o);if(f>=c){return A(r,a,i,o)}else if(f===0){return a}else{return h(r,n,n+s,i,o)}}return function r(n){if(n===0){return 0}if(n===1){return 1}return w(u(n),t,e)}} this.scroll = bezier(0.25, 0.1, 0.25, 1); this.bar = bezier(0.165,0.84,0.44,1); this.barFast = bezier(0.19, 1, 0.22, 1); this.inertia = bezier(0.23, 1, 0.32, 1);}; const ease = new Bezier();

function panel_operations() {
    this.splitter = '|';
    this.sp_splitter = ` ${this.splitter}`;
    this.multiProcess = false;
    var prefix = GetPropertyPrefix();
    var def_ppt = window.GetProperty(prefix + "View by Folder Structure: Name // Pattern", "View by Folder Structure // Pattern Not Configurable");
    var grps = [],
        i = 0;
    // 	js_stnd = window.GetProperty("ADV.Scrollbar Height Always Full", true);
    // js_stnd = !js_stnd ? 2 : 0;

    // TODO: Move this to config file, create object with properties for each entry and include optional custom sort
    var view_ppt = [
        window.GetProperty(prefix + "View 01: Name // Pattern", "View by Artist // %artist%|%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%"),
        window.GetProperty(prefix + "View 02: Name // Pattern", "View by Artist - Album // %<artist>%|%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%"),
        window.GetProperty(prefix + "View 03: Name // Pattern", "View by Composer // %composer%|%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%"),
        window.GetProperty(prefix + "View 04: Name // Pattern", "View by Album Artist // %album artist%|%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%"),
        window.GetProperty(prefix + "View 05: Name // Pattern", "View by Album Artist ordered by Date // %album artist%|[$year($if3(%original release date%,%originaldate%,%date%)) - ]%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%"),
        window.GetProperty(prefix + "View 06: Name // Pattern", "View by Album Artist - Album // [%album artist% - ][$year($if3(%original release date%,%originaldate%,%date%)) - ]%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%"),
        window.GetProperty(prefix + "View 07: Name // Pattern", "View by Album // %album%[ '['%album artist%']']|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%"),
        window.GetProperty(prefix + "View 08: Name // Pattern", "View by Genre // %<genre>%|[%album artist% - ]%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%"),
        window.GetProperty(prefix + "View 09: Name // Pattern", "View by Year // $year($if3(%original release date%,%originaldate%,%date%))|[%album artist% - ]%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%")
    ];
    var nm = "",
        ppt_l = view_ppt.length + 1;
    for (i = ppt_l; i < ppt_l + 93; i++) {
        nm = window.GetProperty(prefix + "View " + padNumber(i) + ": Name // Pattern");
        if (nm && nm != " // ") view_ppt.push(window.GetProperty(prefix + "View " + padNumber(i) + ": Name // Pattern"));
    }
    if (!window.GetProperty("SYSTEM.View Update", false)) {
        i = view_ppt.length + 1;
        window.SetProperty(prefix + "View " + padNumber(i) + ": Name // Pattern", null);
        view_ppt.push(window.GetProperty(prefix + "View " + padNumber(i) + ": Name // Pattern", "View by Path // $directory_path(%path%)|%filename_ext%$nodisplay{%subsong%}"));
        window.SetProperty("SYSTEM.View Update", true);
    }

    var filter_ppt = [
        window.GetProperty(prefix + "View Filter 01: Name // Query", "Filter // Query Not Configurable"),
        window.GetProperty(prefix + "View Filter 02: Name // Query", "Lossless // \"$info(encoding)\" IS lossless"),
        window.GetProperty(prefix + "View Filter 03: Name // Query", "Lossy // \"$info(encoding)\" IS lossy"),
        window.GetProperty(prefix + "View Filter 04: Name // Query", "Missing Replaygain // %replaygain_track_gain% MISSING"),
        window.GetProperty(prefix + "View Filter 05: Name // Query", "Never Played // %play_count% MISSING"),
        window.GetProperty(prefix + "View Filter 06: Name // Query", "Played Often // %play_count% GREATER 9 OR %lastfm_play_count% GREATER 9"),
        window.GetProperty(prefix + "View Filter 07: Name // Query", "Recently Added // %added% DURING LAST 2 WEEKS"),
        window.GetProperty(prefix + "View Filter 08: Name // Query", "Recently Played // %last_played% DURING LAST 2 WEEKS"),
        window.GetProperty(prefix + "View Filter 09: Name // Query", "Top Rated // %rating% IS 5")
    ];
    var filt_l = filter_ppt.length + 1;
    for (i = filt_l; i < filt_l + 90; i++) {

        nm = window.GetProperty(prefix + "View Filter " + padNumber(i, 2) + ": Name // Query");
        if (nm && nm != " // ") {
            filter_ppt.push(window.GetProperty(prefix + "View Filter " + padNumber(i, 2) + ": Name // Query"));
        }
    }

    this.cc = DrawText.Center | DrawText.VCenter | DrawText.CalcRect | DrawText.NoPrefix;
    this.l = DrawText.Left | DrawText.VCenter | DrawText.SingleLine | DrawText.CalcRect | DrawText.NoPrefix;
    this.lc = DrawText.VCenter | DrawText.SingleLine | DrawText.NoPrefix | DrawText.EndEllipsis;
    // this.rc = DT_RIGHT | DrawText.VCenter | DrawText.CalcRect | DrawText.NoPrefix;
    // this.s_lc = StringFormat(0, 1)
    this.f_w = [];
    this.f_h = 0;
    this.filter_x1 = 0;
    this.filt = [];
    // this.folder_view = 10;
    this.folderView = false;
    this.grp = [];
    this.grp_sort = "";
    this.grp_split = [];
    this.grp_split_clone = [];
    this.grp_split_orig = [];
    this.f_menu = [];
    this.last_pressed_coord = {x: -1, y: -1};
    this.list = new FbMetadbHandleList();
    this.menu = [];
    this.multi_value = [];
    this.m_x = 0;
    this.m_y = 0;
    this.pos = -1;
    this.rootName = "";
    this.s_cursor = false;
    this.search = false;
    this.s_txt = "";
    this.s_x = 0;
    this.s_h = 0;
    this.s_w1 = 0;
    this.s_w2 = 0;
    this.tf = "";
    this.init = true;
    // this.scale = 0;

    libraryProps.rootNode = Math.max(Math.min(libraryProps.rootNode, 2), 0);
    //this.syncType = window.GetProperty(" Library Sync: Auto-0, Initialisation Only-1") !== undefined ? window.GetProperty(" Library Sync: Auto-0, Initialisation Only-1") : 1;
    this.syncType = 1;	// init only
    libraryProps.zoomFilter = Math.max(libraryProps.zoomFilter / 100, 0.9) * 100;

    this.setFilterFont = () => {
        var scale = Math.max(libraryProps.zoomFilter / 100, 0.9);
        this.filterFont = gdi.Font("Segoe UI", is_4k ? libraryProps.baseFontSize * 1.0 : libraryProps.baseFontSize * 0.90, 1);
        this.filterBtnFont = gdi.Font("Segoe UI Symbol", is_4k ? libraryProps.baseFontSize * 1.35 : libraryProps.baseFontSize * 0.90, 1);
    }
    this.setFilterFont();

    // this.filterBy = window.GetProperty("SYSTEM.Filter By", 0);
    // this.pn_h_auto = window.GetProperty("ADV.Height Auto [Expand/Collapse With Root]", false) && libraryProps.rootNode; this.init = true;
    // this.pn_h_max = window.GetProperty("ADV.Height Auto-Expand", 578);
    // this.pn_h_min = window.GetProperty("ADV.Height Auto-Collapse", 100);
    // if (this.pn_h_auto) {this.pn_h = window.GetProperty("SYSTEM.Height", 578); window.MaxHeight = window.MinHeight = this.pn_h;}
    var replaceAt = function(s, n, t) {return s.substring(0, n) + t + s.substring(n + 1);}
    this.reset = window.GetProperty("SYSTEM.Reset Tree", false);
    this.search_paint = function() { window.RepaintRect(ui.x + ui.margin, ui.y, ui.w - ui.margin, this.s_h); }
    // this.setHeight = function(n) {
        // if (!this.pn_h_auto) return; this.pn_h = n ? this.pn_h_max : this.pn_h_min;
        // window.MaxHeight = window.MinHeight = this.pn_h;
        // window.SetProperty("SYSTEM.Height", this.pn_h);
    // }
    this.sort = li => {
        switch (this.folderView) {
            case true:
                li.OrderByRelativePath();
                break;
            default:
                let tfo = fb.TitleFormat(settings.defaultSortString);	// TOOD: Add custom sort to object in settings
                li.OrderByFormat(tfo, 1);
                break;
            }
        }
    var paint_y = Math.floor(libraryProps.searchMode || !libraryProps.showScrollbar ? this.s_h : 0);
    this.search_paint = () => {window.RepaintRect(ui.x + ui.margin, ui.y, ui.w - ui.margin, this.s_h);}
    this.setHeight = n => {}//if (!this.pn_h_auto) return; ppt.pn_h = n ? ppt.pn_h_max : ppt.pn_h_min; window.MaxHeight = window.MinHeight = ppt.pn_h;}
    this.setRootName = () => {this.rootName = libraryProps.rootNode == 2 ? this.grp[libraryProps.viewBy].name : "All Music";}
    this.tree_paint = function() {window.RepaintRect(ui.x, ui.y + paint_y, ui.w, ui.h - paint_y + 1);}
    // this.viewBy = window.GetProperty("SYSTEM.View By", 1);
    this.calc_text = () => {
        s.gr(1, 1, false, g => {
            this.f_h = g.CalcTextHeight("String", this.filterFont);
            this.f_w = this.filt.map(v => g.CalcTextWidth(v.name, this.filterFont));
            this.f_sw = g.CalcTextWidth("   \uE011", this.filterBtnFont);
        });
        this.filter_x1 = ui.x + ui.w - ui.margin - this.f_w[libraryProps.filterBy] - this.f_sw + (is_4k ? 8 : 2);
        this.s_w2 = libraryProps.searchMode > 1 ? this.filter_x1 - this.s_x - 11 : this.s_w1 - Math.round(ui.row_h * 0.75) - this.s_x + 1;
    }

    // this.getBaseName = function() {
    //     return libraryProps.rootNode == 2 ? this.grp[this.viewBy].name : "All Music";
    // }

    this.fields = (view, filter) => {
        // this.filt = [];
        // this.folder_view = 10;
        // this.grp = [];
        // this.grp_sort = "";
        // this.multiProcess = false;
        // this.multi_swap = false;
        // // this.filterBy = filter;
        // // this.mv_sort = "";
        // this.view = "";
        // this.viewBy = view;
        // for (i = 0; i < view_ppt.length; i++) {
        //     if (view_ppt[i].indexOf("//") != -1) {
        //         grps = view_ppt[i].split("//");
        //         this.grp[i] = { name:grps[0].trim(), type:grps[1] };
        //     }
        // }
        // grps = [];
        // for (i = 0; i < filter_ppt.length; i++) {
        //     if (filter_ppt[i].indexOf("//") != -1) {
        //         grps = filter_ppt[i].split("//");
        //         this.filt[i] = { name:grps[0].trim(), type:grps[1].trim() };
        //     }
        // }
        this.filt = [];
        this.folder_view = 10;
        this.grp = [];
        this.grp_sort = "";
        this.multiProcess = false;
        this.multi_swap = false;
        libraryProps.filterBy = filter;
        // this.mv_sort = "";
        this.view = "";
        libraryProps.viewBy = view;
        view_ppt.forEach((v, i) => {
            if (v.includes("//")) {
                grps = v.split("//");
                this.grp[i] = {name:grps[0].trim(), type:grps[1]}
            }
        });
        grps = [];
        filter_ppt.forEach((v, i) => {
            if (v.includes("//")) {
                grps = v.split("//");
                this.filt[i] = {name:grps[0].trim(), type:grps[1].trim()}
            }
        });

        const name = v => v.name;
        const removeEmpty = v => v && v.name != "" && v.type != "";

        // i = this.grp.length;
        // while (i--) if (!this.grp[i] || this.grp[i].name == "" || this.grp[i].type == "") this.grp.splice(i, 1);
        // i = this.filt.length;
        // while (i--) if (!this.filt[i] || this.filt[i].name == "" || this.filt[i].type == "") this.filt.splice(i, 1);
        // this.grp[this.grp.length] = {name: def_ppt.split("//")[0].trim(), type: ""}
        // const folder_view = this.grp.length - 1; // folder view is last group
        // this.filterBy = Math.min(this.filterBy, this.filt.length - 1); this.viewBy = Math.min(this.viewBy, this.grp.length - 1);
        // if (this.grp[this.viewBy].type.indexOf("%<") != -1) {
        //     this.multiProcess = true;
        // }
        // this.folderView = this.viewBy === folder_view;
        this.grp = this.grp.filter(removeEmpty);
        this.filt = this.filt.filter(removeEmpty);
        this.grp[this.grp.length] = {name: def_ppt.split("//")[0].trim(), type: ""}
        this.folder_view = this.grp.length - 1; libraryProps.filterBy = Math.min(libraryProps.filterBy, this.filt.length - 1); libraryProps.viewBy = Math.min(libraryProps.viewBy, this.grp.length - 1);
        if (this.grp[libraryProps.viewBy].type.includes("%<")) this.multiProcess = true;
        this.folderView = libraryProps.viewBy == this.folder_view;

        if (!this.folderView) {
            if (this.multiProcess) {
                if (this.grp[libraryProps.viewBy].type.indexOf("$swapbranchprefix{%<") != -1) {
                    this.multi_swap = true;
                }
                // this.mv_sort = fb.TitleFormat((this.grp[this.view_by].type.indexOf("album artist") != -1 || this.grp[this.view_by].type.indexOf("%artist%") == -1 && this.grp[this.view_by].type.indexOf("%<artist>%") == -1 && this.grp[this.view_by].type.indexOf("$meta(artist") == -1 ? "%album artist%" : "%artist%") + "|%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%");
            }
            // this.grp_split = this.grp[this.viewBy].type.replace(/^\s+/, "").split("|");
            // for (i = 0; i < this.grp_split.length; i++) {
            //     this.multi_value[i] = this.grp_split[i].indexOf("%<") != -1 ? true : false;
            //     if (this.multi_value[i]) {
            //         this.grp_split_orig[i] = this.grp_split[i].slice();
            //         if (this.grp_split[i].indexOf("$swapbranchprefix{%<") != -1) {
            //             var ip1 = this.grp_split[i].indexOf("$swapbranchprefix{%<"),
            //                 ip2 = this.grp_split[i].indexOf(">%}", ip1) + 2;
            //             this.grp_split[i] = replaceAt(this.grp_split[i], ip2, "");
            //             this.grp_split_orig[i] = this.grp_split[i].replace(/\$swapbranchprefix{%</g, "%<");
            //             this.grp_split[i] = this.grp_split[i].replace(/\$swapbranchprefix{%</g, "~%<");
            //         }
            //         this.grp_split[i] = this.grp_split[i].replace(/%<album artist>%/i,"$if3(%<#album artist#>%,%<#artist#>%,%<#composer#>%,%<#performer#>%)").replace(/%<album>%/i,"$if2(%<#album#>%,%<#venue#>%)").replace(/%<artist>%/i,"$if3(%<artist>%,%<album artist>%,%<composer>%,%<performer>%)").replace(/<#/g,"<").replace(/#>/g,">");
            //         this.grp_split_clone[i] = this.grp_split[i].slice();
            //         this.grp_split[i] = this.grp_split_orig[i].replace(/[<>]/g,"");
            //     }
            //     this.grp_sort += (this.grp_split[i] + "  |");
            //     if (this.multi_value[i]) this.grp_split[i] = this.grp_split_clone[i].replace(/%</g, "#!#$meta_sep(").replace(/>%/g, "," + "@@)#!#");
            //     this.view += (this.grp_split[i] + "|");
            // }
            this.grp_split = this.grp[libraryProps.viewBy].type.replace(/^\s+/, "").split("|");
            this.grp_split.forEach((v, i) => {
                this.multi_value[i] = v.includes("%<") ? true : false;
                if (this.multi_value[i]) {
                    this.grp_split_orig[i] = v.slice();
                    if (v.includes("$swapbranchprefix{%<")) {
                        let ip1 = v.indexOf("$swapbranchprefix{%<"), ip2 = v.indexOf(">%}", ip1) + 2;
                        v = s.replaceAt(v, ip2, "");
                        this.grp_split_orig[i] = v.replace(/\$swapbranchprefix{%</g, "%<");
                        v = v.replace(/\$swapbranchprefix{%</g, "~%<");
                    }
                    v = v.replace(/%<album artist>%/i,"$if3(%<#album artist#>%,%<#artist#>%,%<#composer#>%,%<#performer#>%)").replace(/%<album>%/i,"$if2(%<#album#>%,%<#venue#>%)").replace(/%<artist>%/i,"$if3(%<artist>%,%<album artist>%,%<composer>%,%<performer>%)").replace(/<#/g,"<").replace(/#>/g,">");
                    this.grp_split_clone[i] = v.slice();
                    v = this.grp_split_orig[i].replace(/[<>]/g,"");
                }
                this.grp_sort += (v + this.sp_splitter);
                if (this.multi_value[i]) v = this.grp_split_clone[i].replace(/%</g, "#!#$meta_sep(").replace(/>%/g, "," + "@@)#!#");
                this.view += (v + this.splitter);
            });
            let ix1, ix2;
            if (!this.multiProcess) this.view = this.view.replace(/\$nodisplay{.*?}/gi, "");
            else while(this.view.indexOf("$nodisplay{") != -1) {ix1 = this.view.indexOf("$nodisplay{"); ix2 = this.view.indexOf("}", ix1); this.view = replaceAt(this.view, ix2, " #@#"); this.view = this.view.replace("$nodisplay{", "#@#");}
            this.view = this.view.slice(0, -1);
            while(this.grp_sort.indexOf("$nodisplay{") != -1) {ix1 = this.grp_sort.indexOf("$nodisplay{"); ix2 = this.grp_sort.indexOf("}", ix1); this.grp_sort = replaceAt(this.grp_sort, ix2, " "); this.grp_sort = this.grp_sort.replace("$nodisplay{", "");}
        }
        // window.SetProperty("SYSTEM.Filter By", filter); window.SetProperty("SYSTEM.View By", view);
        // this.baseName = this.getBaseName();
        // this.f_menu = [];
        // this.menu = [];
        // for (i = 0; i < this.grp.length; i++) this.menu.push(this.grp[i].name);
        // for (i = 0; i < this.filt.length; i++) this.f_menu.push(this.filt[i].name);
        // this.calc_text();
        this.setRootName();
        this.f_menu = this.filt.map(name);
        this.menu = this.grp.map(name);
        this.calc_text();
    }
    this.fields(libraryProps.viewBy, libraryProps.filterBy);

    var propCount = 0;
    for (i = 1; i < 100; i++) {
        var val = window.GetProperty(prefix + "View " + padNumber(i, 2) + ": Name // Pattern");
        if (val && val != " // ") {
            propCount++;
            window.SetProperty(prefix + "View " + padNumber(propCount, 2) + ": Name // Pattern", val);
        } else {
            window.SetProperty(prefix + "View " + padNumber(i, 2) + ": Name // Pattern", null);
        }
    }
    for (i = propCount + 1; i < propCount + 3; i++) {
        window.SetProperty(prefix + "View " + padNumber(i, 2) + ": Name // Pattern", " // ");
    }
    propCount = 0;
    for (i = 1; i < 100; i++) {
        var val = window.GetProperty(prefix + "View Filter " + padNumber(i, 2) + ": Name // Query");
        if (val && val != " // ") {
            propCount++;
            window.SetProperty(prefix + "View Filter " + padNumber(propCount, 2) + ": Name // Query", val);
        } else window.SetProperty(prefix + "View Filter " + padNumber(i, 2) + ": Name // Query", null);
    }
    for (i = propCount + 1; i < propCount + 3; i++) {
        window.SetProperty(prefix + "View Filter " + padNumber(i, 2) + ": Name // Query", " // ");
    }

    this.on_size = () => {
        this.filter_x1 = ui.x + ui.w - ui.margin - this.f_w[libraryProps.filterBy] - this.f_sw + (is_4k ? 8 : 2);
        this.s_x = ui.x + Math.round(ui.margin + ui.row_h);
        this.s_y = ui.y;
        this.s_w1 = ui.w - ui.margin;
        this.s_w2 = libraryProps.searchMode > 1 ? this.filter_x1 - this.s_x - 11 : this.s_w1 - Math.round(ui.row_h * 0.75) - this.s_x + 1;
        this.ln_sp = libraryProps.searchMode && Math.floor(ui.row_h * 0.1);
        this.s_h = libraryProps.searchMode ? ui.row_h + (this.ln_sp * 2) : ui.margin;
        this.s_sp = this.s_h - this.ln_sp;
        this.sp = ui.h - this.s_h - (libraryProps.searchMode ? 0 : ui.margin);
        this.rows = this.sp / ui.row_h;
        this.rows = Math.floor(this.rows);
        this.sp = ui.row_h * this.rows;
        this.node_y = Math.round((ui.row_h - ui.node_sz) / 2);
        var sbar_top = !ui.sbarType ? 5 : libraryProps.searchMode ? 3 : 0, sbar_bot = !ui.sbarType ? 5 : 0;
        this.sbar_o = [ui.arrow_pad, Math.max(Math.floor(ui.scr_but_w * 0.2), 3) + ui.arrow_pad * 2, 0][ui.sbarType];
        this.sbar_x = ui.x + ui.w - ui.sbar_sp - (is_4k ? 35 : 17);
        var top_corr = [this.sbar_o - (ui.but_h - ui.scr_but_w) / 2, this.sbar_o, 0][ui.sbarType];
        var bot_corr = [(ui.but_h - ui.scr_but_w) / 2 - this.sbar_o, -this.sbar_o, 0][ui.sbarType];
        var sbar_y = ui.y + (libraryProps.searchMode ? this.s_sp + 1 : 0) + sbar_top + top_corr;
        var sbar_h =
                // ui.scr_type < js_stnd && true ?
                this.sp + 1 - sbar_top - sbar_bot + bot_corr * 2 //:
                // ui.y + ui.h - sbar_y - sbar_bot + bot_corr;
        if (ui.sbarType == 2) {
            sbar_y += 1;
            sbar_h -= 2;
        }
        sbar.metrics(this.sbar_x, sbar_y, ui.scr_w, sbar_h, this.rows, ui.row_h);
    }

    this.resetZoom = () => {
        libraryProps.zoomFont = 100;
        libraryProps.zoomNode = 100;
        this.zoomFilter = 1;
        libraryProps.zoomFilter = 100;
        ui.node_sz = Math.round(16 * s.scale);
        // ppt.set(" Zoom Tooltip [Button] (%)", 100);
        this.filterFont = gdi.Font("Segoe UI", is_4k ? libraryProps.baseFontSize * 1.0 : libraryProps.baseFontSize * 0.90, 1);
        this.filterBtnFont = gdi.Font("Segoe UI Symbol", is_4k ? libraryProps.baseFontSize * 1.35 : libraryProps.baseFontSize * 0.90, 1);
        this.calc_text();
        ui.get_font();
        this.on_size(); jumpSearch.on_size();
        but.create_tooltip();
        library_tree.create_tooltip();
        if (libraryProps.searchMode || libraryProps.sbarShow) but.refresh(true); sbar.reset();
        window.Repaint();
    }

    this.set = (n, i) => {
        switch (n) {
            case 'itemCounts': libraryProps.nodeItemCounts = i; /*library_tree.set();*/ lib_manager.rootNodes(1, true); break;
            case 'rootNode':
                libraryProps.rootNode = i; /*library_tree.set();*/ this.setRootName(); lib_manager.rootNodes(1);
                // this.pn_h_auto = ppt.pn_h_auto && libraryProps.rootNode; if (this.pn_h_auto) {window.MaxHeight = window.MinHeight = ppt.pn_h;}
                break;
            case 'view': lib_manager.time.Reset();
                if (this.s_txt) lib_manager.upd_search = true;
                this.fields(i < this.grp.length ? i : libraryProps.viewBy, i < this.grp.length ? libraryProps.filterBy : i - this.grp.length);
                library_tree.subCounts =  {"standard": {}, "search": {}, "filter": {}};
                lib_manager.getLibrary(); lib_manager.rootNodes();
                // if (this.pn_h_auto && ppt.pn_h == ppt.pn_h_min && pop.tree[0]) library_tree.clear_child(library_tree.tree[0]);
                break;
        }
    }
}
if ('DlgCode' in window) { window.DlgCode = 4; }

function Vkeys() {
    // ppt.zoomKey = s.clamp(ppt.zoomKey, 0, 4);
    let zoomKey = 0; if (zoomKey != 0) zoomKey = [, 0x11, 0x12, 0x1B, 0x09][zoomKey];
    this.selAll = 1; this.copy = 3; this.back = 8; this.enter = 13; this.shift = 16; this.paste = 22; this.cut = 24; this.redo = 25; this.undo = 26; this.escape = 27; this.pgUp = 33; this.pgDn = 34; this.end = 35; this.home = 36; this.left = 37; this.up = 38; this.right = 39; this.dn = 40; this.del = 46;
    this.k = n => {switch (n) {case 'enter': return utils.IsKeyPressed(0x0D); break; case 'shift': return utils.IsKeyPressed(0x10); break; case 'ctrl': return utils.IsKeyPressed(0x11); break; case 'alt': return utils.IsKeyPressed(0x12); break; case 'zoom': return !zoomKey ? utils.IsKeyPressed(0x11) && utils.IsKeyPressed(0x12) : utils.IsKeyPressed(zoomKey); break;}}
}


const arraysEqual = (arr1, arr2) => {let i = arr1.length; if (i != arr2.length) return false; while (i--) if (arr1[i] !== arr2[i]) return false; return true;};
const binaryInsert = function(item) {
    var min = 0,
    max = p.list.Count,
    index = Math.floor((min + max) / 2);
    while (max > min) {
        const tmp = new FbMetadbHandleList(item);
        tmp.Add(p.list[index]);
        p.sort(tmp);
        if (item.Compare(tmp[0])) max = index;
        else min = index + 1;
        index = Math.floor((min + max) / 2);
    }
    return index;
}
class Library {
    constructor () {
        this.exp = [];	// stored list of expanded nodes
        this.filterQuery = '';
        this.filterQueryID = 'N/A',
        /** @type {FbMetadbHandleList} */
        this.full_list = undefined;
        this.full_list_need_sort = false;	// TODO: can we remove this and all references?
        this.noListUpd = false;
        this.otherNode = []; // why does this exist???
        this.searchNodes = []; // think this is only populated from search?
        this.scr = [];	// maybe scroll position? I can't figure this out
        this.sel = [];	// selected item(s)
        this.allmusic = [];
        this.init = false;
        /** @type {FbMetadbHandleList} */
        this.list = undefined;
        this.none = "";
        this.node = [];
        this.process = false;
        this.root = [];
        this.time = fb.CreateProfiler();
        this.upd = 0;
        this.upd_search = false;

        this.swapPrefix = window.GetProperty("ADV.$swapbranchprefix. Prefixes to Swap (| Separator)", "A|The").split("|");
        if (libraryProps.rememberTree) {
            this.exp = JSON.parse(libraryProps.exp)
            this.process = libraryProps.process;
            this.scr = JSON.parse(libraryProps.scr)
            this.sel = JSON.parse(libraryProps.sel)
            p.s_txt = libraryProps.searchText;
        } else {
            libraryProps.exp = JSON.stringify(this.exp);
            libraryProps.process = false;
            libraryProps.scr = JSON.stringify(this.scr);
            libraryProps.sel = JSON.stringify(this.sel);
            libraryProps.searchText = '';
        }

        this.search = _.debounce(() => {
            this.time.Reset(); library_tree.subCounts.search = {}; this.treeState(false, libraryProps.rememberTree); this.rootNodes(); p.setHeight(true);
            if (libraryProps.searchSend != 2) return;
            if (p.s_txt) library_tree.load(p.list, false, false, false, true, false);
            else plman.ClearPlaylist(plman.FindOrCreatePlaylist(libraryProps.libPlaylistName, false));
        }, 333);

        this.search500 = _.debounce(() => {
            this.time.Reset(); library_tree.subCounts.search = {}; this.treeState(false, libraryProps.rememberTree); this.rootNodes(); p.setHeight(true);
            if (libraryProps.searchSend != 2) return;
            library_tree.load(p.list, false, false, false, true, false);
        }, 500);

        this.lib_update = _.debounce(() => {this.time.Reset(); library_tree.subCounts =  {"standard": {}, "search": {}, "filter": {}}; this.searchCache = {}; this.rootNodes(2, this.process);}, 500);
    }

    logTree() {
        let i = 0, ix = -1, tr = 0;
        this.exp = [];
        this.sel = [];
        this.scr = [];
        const tr_sort = data => {data.sort((a, b) => parseFloat(a.tr) - parseFloat(b.tr)); return data;}
        libraryProps.process = true;
        library_tree.tree.forEach(v => {
            tr = !libraryProps.rootNode ? v.tr : v.tr - 1; if (v.child.length) this.exp.push({tr:tr, a:tr < 1 ? v.name : library_tree.tree[v.par].name, b:tr < 1 ? "" : v.name});
            tr = v.tr; if (v.sel == true) this.sel.push({tr:tr, a:v.name, b:tr != 0 ? library_tree.tree[v.par].name : "", c:tr > 1 ? library_tree.tree[library_tree.tree[v.par].par].name : ""});
        });
        ix = library_tree.get_ix(0, sbar.item_y + ui.row_h / 2, true, false); tr = 0; let l = Math.min(Math.floor(ix + p.rows), library_tree.tree.length);
        if (ix != -1) {for (i = ix; i < l; i++) {tr = library_tree.tree[i].tr; this.scr.push({tr:tr, a:library_tree.tree[i].name, b:tr != 0 ? library_tree.tree[library_tree.tree[i].par].name : "", c:tr > 1 ? library_tree.tree[library_tree.tree[library_tree.tree[i].par].par].name : ""})}}
        tr_sort(this.exp);
        if (libraryProps.rememberTree) {
            libraryProps.exp = JSON.stringify(this.exp);
            libraryProps.scr = JSON.stringify(this.scr);
            libraryProps.sel = JSON.stringify(this.sel);
        }
    }


    checkTree() {if (!this.upd && !(this.init && libraryProps.rememberTree)) return; this.init = false; timer.reset(timer.update); this.time.Reset(); library_tree.subCounts =  {"standard": {}, "search": {}, "filter": {}}; this.rootNodes(this.upd == 2 ? 2 : 1, this.process); this.upd = 0;}
    eval(n) {if (!n || !fb.IsPlaying) return ""; const tfo = fb.TitleFormat(n); if (fb.IsPlaying && fb.PlaybackLength <= 0) return tfo.Eval(); const handle = fb.GetNowPlaying(); return handle ? tfo.EvalWithMetadb(handle) : "";}
    removed_f(handle_list) {var j = handle_list.Count; while (j--) {var i = this.list.Find(handle_list[j]); if (i != -1) {this.list.RemoveById(i); this.otherNode.splice(i, 1);}}}
    removed_s(handle_list) {var j = handle_list.Count; while (j--) {var i = p.list.Find(handle_list[j]); if (i != -1) {p.list.RemoveById(i); this.searchNodes.splice(i, 1);}}}
    // var sort = function (a, b) {return a.toString().replace(/^\?/,"").replace(/(\d+)/g, function (n) {return ('0000' + n).slice(-5)}).localeCompare(b.toString().replace(/^\?/,"").replace(/(\d+)/g, function (n) {return ('0000' + n).slice(-5)}));}

    /**
     *
     * @param {*} reset
     * @param {*} state
     * @param {FbMetadbHandleList=} handleList
     * @param {number=} handleType update type
     * @returns
     */
    treeState(reset, state, handleList, handleType) {
        // console.log(`treeState ${b} ${state} ${handle_list ? handle_list.Count : '0'} ${n}`);
        if (!state) return;
        p.search_paint();
        p.tree_paint();
        libraryProps.process = false;
        if (!reset) this.logTree();
        if (libraryProps.rememberTree) { libraryProps.searchText = p.s_txt; if (state == 1) return };
        if (!handleList) {this.getLibrary(); this.rootNodes(1, libraryProps.process);}
        else {
            this.noListUpd = false;
            switch (handleType) {
                case 0: this.added(handleList); if (this.noListUpd) break; if (ui.w < 1 || !window.IsVisible) this.upd = 2; else this.lib_update(); break;
                case 1:
                    let i, items, upd_done = false, tree_type = !p.folderView ? 0 : 1;
                    switch (tree_type) { // check for changes to items; any change updates all
                        case 0:
                            let tfo = fb.TitleFormat(p.view); items = tfo.EvalWithMetadbs(handleList);
                            handleList.Convert().some((h, j) => {
                                i = this.list.Find(h);
                                if (i != -1) {
                                    if (!arraysEqual(this.otherNode[i], items[j].split(p.splitter))) {
                                        this.removed(handleList); this.added(handleList); if (ui.w < 1 || !window.IsVisible) this.upd = 2; else this.lib_update();
                                        return upd_done = true;
                                    }
                                }
                            });
                            break;
                        case 1:
                            items = handleList.GetLibraryRelativePaths();
                            handleList.Convert().some((h, j) => {
                                i = this.list.Find(h);
                                if (i != -1) {
                                    if (!arraysEqual(this.otherNode[i], items[j].split("\\"))) {
                                        this.removed(handleList); this.added(handleList); if (ui.w < 1 || !window.IsVisible) this.upd = 2; else this.lib_update();
                                        return upd_done = true;
                                    }
                                }
                            });
                            break;
                    }
                    if (upd_done) break;
                    if (libraryProps.filterBy > 0 && pptDefault.searchShow > 1) { // filter: check if not done
                        let newFilterItems = s.query(handleList, this.filterQuery), origFilter = this.list.Clone();
                        // addns
                        origFilter.Sort();
                        newFilterItems.Sort();
                        newFilterItems.MakeDifference(origFilter);
                        if (newFilterItems.Count) this.added_f(newFilterItems);
                        // removals
                        let removeFilterItems = handleList.Clone();
                        removeFilterItems.Sort();
                        removeFilterItems.MakeIntersection(origFilter); // handles in this.list
                        let handlesInFilter = s.query(removeFilterItems, this.filterQuery); // handles in this.list & filter
                        handlesInFilter.Sort();
                        removeFilterItems.MakeDifference(handlesInFilter); // handles to remove
                        if (removeFilterItems.Count) this.removed_f(removeFilterItems);
                        if (newFilterItems.Count || removeFilterItems.Count) {if (!p.s_txt) p.list = this.list; if (ui.w < 1 || !window.IsVisible) this.upd = 2; else this.lib_update();}
                    }
                    if (p.s_txt) { // search: check if not done
                        let handlesInSearch = new FbMetadbHandleList(), newSearchItems = new FbMetadbHandleList(), origSearch = p.list.Clone();
                        // addns
                        this.validSearch = true; try {newSearchItems = s.query(handleList, p.s_txt);} catch (e) {this.validSearch = false;}
                        origSearch.Sort();
                        newSearchItems.Sort();
                        if (libraryProps.filterBy > 0 && pptDefault.searchShow > 1) {let newFilt = this.list.Clone(); newFilt.Sort(); newSearchItems.MakeIntersection(newFilt);}
                        newSearchItems.MakeDifference(origSearch);
                        if (newSearchItems.Count) this.added_s(newSearchItems);
                        // removals
                        let removeSearchItems = handleList.Clone();
                        removeSearchItems.Sort();
                        removeSearchItems.MakeIntersection(origSearch); // handles in origSearch (present in any filter)
                        this.validSearch = true; try {handlesInSearch = s.query(removeSearchItems, p.s_txt);} catch (e) {this.validSearch = false;}
                        handlesInSearch.Sort();
                        removeSearchItems.MakeDifference(handlesInSearch); // handles to remove
                        if (removeSearchItems.Count) this.removed_s(removeSearchItems);
                        if (newSearchItems.Count || removeSearchItems.Count){
                            if (!p.list.Count) {library_tree.tree = []; sbar.set_rows(0); this.none = this.validSearch ? "Nothing found" : "Invalid search expression"; p.tree_paint(); break;}
                            if (ui.w < 1 || !window.IsVisible) this.upd = 2; else this.lib_update();
                        }
                    }
                    break;
                case 2:
                    this.removed(handleList);
                    if (this.noListUpd) break;
                    if (ui.w < 1 || !window.IsVisible)
                        this.upd = 2;
                    else
                        this.lib_update();
                    break;
            }
        }
        //             if (upd_done) break;
        //             if (libraryProps.filterBy > 0 && pptDefault.searchShow > 1) { // filter: check if not done
        //                 let startFilter = this.list.Clone(),
        //                     newFilterItems = s.query(handleList, this.filterQuery),
        //                     newFilter = this.list.Clone();
        //                 newFilter.InsertRange(newFilter.Count, newFilterItems);
        //                 startFilter.Sort(); newFilter.Sort(); newFilter.MakeDifference(startFilter);
        //                 if (newFilter.Count) {
        //                     this.removed_f(handleList);
        //                     this.added_f(newFilterItems);
        //                     if (!p.s_txt) p.list = this.list;
        //                     if (ui.w < 1 || !window.IsVisible) this.upd = 2;
        //                     else timer.lib_update();
        //                 }
        //             }
        //             if (p.s_txt) { // search: check if not done
        //                 let startSearch = p.list.Clone(), newSearchItems = new FbMetadbHandleList();
        //                 this.validSearch = true;
        //                 try {
        //                     let searchText = p.s_txt;
        //                     if (searchText.length > 1 && 'audio'.includes(searchText.toLowerCase())) {
        //                         // any search with a portion of "audio" in it will return all results:
        //                         searchText = `ARTIST HAS "${searchText}" OR ALBUM HAS "${searchText}" OR TITLE HAS "${searchText} OR LABEL HAS "${searchText}"`;
        //                     }
        //                     console.log(searchText);
        //                     newSearchItems = fb.GetQueryItems(handleList, searchText);
        //                 } catch (e) {
        //                     this.validSearch = false;
        //                 }
        //                 newSearchItems.Sort();
        //                 if (libraryProps.filterBy > 0 && pptDefault.searchShow > 1) {let newFilt = this.list.Clone(); newFilt.Sort(); newSearchItems.MakeIntersection(newFilt);}
        //                 let newSearch = p.list.Clone();
        //                 newSearch.InsertRange(newSearch.Count, newSearchItems);
        //                 startSearch.Sort(); newSearch.Sort(); newSearch.MakeDifference(startSearch);
        //                 if (newSearch.Count) {
        //                     this.removed_s(handleList);
        //                     this.added_s(newSearchItems);
        //                     this.node = this.searchNodes.slice();
        //                     if (!p.list.Count) {
        //                         library_tree.tree = [];
        //                         sbar.set_rows(0);
        //                         this.none = this.validSearch ? "Nothing found" : "Invalid search expression";
        //                         p.tree_paint();
        //                         break;
        //                     }
        //                     if (ui.w < 1 || !window.IsVisible) this.upd = 2; else timer.lib_update();
        //                 }
        //             }
        //             break;
        //         case 2:
        //             this.removed(handleList);
        //             if (ui.w < 1 || !window.IsVisible)
        //                 this.upd = 2;
        //             else
        //                 timer.lib_update();
        //             break;
        //     }
        // }
    }

    getFilterQuery() {
        this.filterQuery = p.filt[libraryProps.filterBy].type;
            while (this.filterQuery.includes("$nowplaying{")) {
                const q = this.filterQuery.match(/\$nowplaying{(.+?)}/);
                this.filterQuery = this.filterQuery.replace(q[0], this.eval(q[1]));
            }
    }

    getLibrary() {
        this.empty = "";
        p.list = null;
        this.time.Reset();
        this.none = "";
        this.list = fb.GetLibraryItems();
        this.full_list = this.list.Clone();
        if (!this.list.Count || !fb.IsLibraryEnabled()) {library_tree.tree = []; sbar.set_rows(0); this.empty = "Nothing to show\n\nConfigure Media Library first\n\nFile>Preferences>Media library"; p.tree_paint(); return;}
        if (libraryProps.filterBy > 0 && libraryProps.searchMode > 1) {
            this.getFilterQuery();
            this.filterQueryID = this.filterQuery;
            this.list = s.query(this.list, this.filterQuery);
        }
        if (!this.list.Count) {library_tree.tree = []; sbar.set_rows(0); this.none = "Nothing found"; p.tree_paint(); return;} this.rootNames("", 0);
    }

    rootNames(li, search) {
        let arr = [];
        switch (search) {
            case 0: p.sort(this.list); li = p.list = this.list; this.otherNode = []; arr = this.otherNode; break;
            case 1: this.searchNodes = []; arr = this.searchNodes; break;}
        let tree_type = !p.folderView ? 0 : 1;
        switch (tree_type) {
            case 0: let tfo = fb.TitleFormat(p.view); tfo.EvalWithMetadbs(li).forEach((v, i) => arr[i] = v.split(p.splitter)); break;
            case 1: li.GetLibraryRelativePaths().forEach((v, i) => arr[i] = v.split("\\")); break;
        }
    }

    prefixes(n) {
        if (n.indexOf("~#!#") == -1) return n;
        var found = false, j = 0, ln = 0;
        for (j = 0; j < this.swapPrefix.length; j++) if (n.indexOf(this.swapPrefix[j] + " ") != -1) {found = true; break;}
        if (!found) return n.replace("~#!#", "#!#");
        var pr1 = n.split("~#!#"), pr2 = pr1[1].split("#!#"), pr = pr2[0].split("@@");
        for (var i = 0; i < pr.length; i++) for (j = 0; j < this.swapPrefix.length; j++)  {ln = this.swapPrefix[j].length + 1; if (pr[i].substr(0, ln) == this.swapPrefix[j] + " ") pr[i] = pr[i].substr(ln) + ", " + this.swapPrefix[j];}
        return pr1[0] + "#!#" + pr.join("@@") + "#!#" + pr2[1];
    }

    rootNodes(lib_update, process) {
        if (!this.list.Count) return; this.root = []; let i = 0, n = "";
        if (p.s_txt && (this.upd_search || lib_update == 1)) {
            this.validSearch = true;
            this.none = "";
            try {p.list = s.query(this.list, p.s_txt);} catch (e) {this.list = this.list.Clone(); p.list.RemoveAll(); this.validSearch = false;}
            if (!p.list.Count) {library_tree.tree = []; sbar.set_rows(0); this.none = this.validSearch ? "Nothing found" : "Invalid search expression"; p.tree_paint(); return;}
            this.rootNames(p.list, 1);
            this.node = this.searchNodes.slice(); this.upd_search = false;
        } else if (!p.s_txt) {
            p.list = this.list;
            this.node = this.otherNode.slice()
        };
        let n_o = "#get_node#",
            nU = "";
        library_tree.getNowplaying();
        if (libraryProps.rootNode) {
            this.root[0] = {name: p.rootName, sel:false, child:[], item:[]};
            this.node.forEach((v, l) => this.root[0].item[l] = l);
        } else switch (p.multiProcess) {
            case false:
                this.node.forEach((v, l) => {
                    n = v[0]; nU = n.toUpperCase();
                    if (nU != n_o) {
                        n_o = nU; this.root[i] = {name:n, sel:false, child:[], item:[]};
                        this.root[i].item.push(l); i++;
                    } else this.root[i - 1].item.push(l);
                });
                break;
            case true:
                switch (p.multi_swap) {
                    case false:
                        this.node.forEach((v, l) => {
                            n = v[0]; nU = n.toUpperCase();
                            if (nU != n_o) {
                                n_o = nU; n = n.replace(/#!##!#/g, "?");
                                this.root[i] = {name:n.replace(/#@#.*?#@#/g,""), sel:false, child:[], item:[], srt:n};
                                this.root[i].item.push(l); i++;
                            } else this.root[i - 1].item.push(l);
                        });
                        break;
                    case true:
                        this.node.forEach((v, l) => {
                            n = v[0]; nU = n.toUpperCase();
                            if (nU != n_o) {
                                n_o = nU; n = n.replace(/~#!##!#|#!##!#/g, "?");
                                n = this.prefixes(n);
                                this.root[i] = {name:n.replace(/#@#.*?#@#/g,""), sel:false, child:[], item:[], srt:n};
                                this.root[i].item.push(l); i++;
                            } else this.root[i - 1].item.push(l);
                        });
                        break;
                }
                break;
        }
        if (!lib_update) sbar.reset();
        /* Draw tree -> */
        if (!libraryProps.rootNode || p.s_txt) library_tree.buildTree(this.root, 0);
        if (libraryProps.rootNode) library_tree.branch(this.root[0], true);
        // if (p.pn_h_auto && (p.init || lib_update) && p.pn_h == p.pn_h_min && library_tree.tree[0]) library_tree.clear_child(library_tree.tree[0]);
        p.init = false;
        console.log("Library Initialized in: " + this.time.Time / 1000 + " seconds");
        if (lib_update && process) {
            try {
                const match = (a, b) =>  a && a.name.toUpperCase() == b.toUpperCase();
                this.exp.forEach(v => {
                    if (v.tr == 0) {
                        library_tree.tree.some(w => { // some ~5x faster than for...of
                            if (match(w, v.a)) {library_tree.branch(w); return true;}
                        });
                    } else if (v.tr > 0) {
                        library_tree.tree.some(w => {
                            if (match(w, v.b) && match(library_tree.tree[w.par], v.a)) {library_tree.branch(w); return true;}
                        });
                    }
                });
                this.sel.forEach(v => {
                    if (v.tr == 0) {
                        library_tree.tree.some(w => {
                            if (match(w, v.a)) return w.sel = true;
                        });
                    } else if (v.tr == 1) {
                        library_tree.tree.some(w => {
                            if (match(w, v.a) && match(library_tree.tree[w.par], v.b)) return w.sel = true;
                        });
                    } else if (v.tr > 1) {
                        library_tree.tree.some(w => {
                            if (match(w, v.a) && match(library_tree.tree[w.par], v.b) && match(library_tree.tree[library_tree.tree[w.par].par], v.c)) return w.sel = true;
                        });
                    }
                });
                let scr_pos = false;
                this.scr.some((v, h) => {
                    if (scr_pos) return true;
                    if (v.tr == 0) {
                        library_tree.tree.some((w, j) => {
                            if (match(w, v.a)) {sbar.check_scroll(!h ? j * ui.row_h : (j - 3) * ui.row_h); return scr_pos = true;}
                        });
                    } else if (v.tr == 1) {
                        library_tree.tree.some((w, j) => {
                            if (match(w, v.a) && match(library_tree.tree[w.par], v.b)) {sbar.check_scroll(!h ? j * ui.row_h : (j - 3) * ui.row_h); return scr_pos = true;}
                        });
                    } else if (v.tr > 1) {
                        library_tree.tree.some((w, j) => {
                            if (match(w, v.a) && match(library_tree.tree[w.par], v.b) && match(library_tree.tree[library_tree.tree[w.par].par], v.c)) {sbar.check_scroll(!h ? j * ui.row_h : (j - 3) * ui.row_h); return scr_pos = true;}
                        });
                    }
                });
                if (!scr_pos) {sbar.reset(); p.tree_paint();}
            } catch (e) {};
        } else this.treeState(false, libraryProps.rememberTree);
        if (lib_update && !process) {sbar.reset(); p.tree_paint();}
    }

    binaryInsert(folder, insert, li, n) {
        let item_a;
        switch (true) {
            case !folder:
                var tfo = fb.TitleFormat(p.view);
                item_a = tfo.EvalWithMetadbs(insert);
                for (var j = 0; j < insert.Count; j++) {var i = binaryInsert(insert[j]); n.splice(i, 0, item_a[j].split("|")); li.Insert(i, insert[j]);} break;
            case folder:
                item_a = insert.GetLibraryRelativePaths(); for (var j = 0; j < insert.Count; j++) {
                var i = binaryInsert(insert[j]); if (i != -1) {n.splice(i, 0, item_a[j].split("\\")); li.Insert(i, insert[j]);}} break;
        }
    }

    /**
     * @param {FbMetadbHandleList} handleList
     */
    added(handleList) {
        let addType = p.multiProcess || /* p.nodisplay ||*/ handleList.Count > 100 ? 0 : 1;
        let i, items;
        const tree_type = !p.folderView ? 0 : 1;
        switch (addType) {
            case 0:
                this.full_list.InsertRange(this.full_list.Count, handleList); this.full_list_need_sort = true;
                if (libraryProps.filterBy > 0 && pptDefault.searchShow > 1) {
                    const newFilterItems = s.query(handleList, this.filterQuery);
                    this.list.InsertRange(this.list.Count, newFilterItems); p.sort(this.list);
                }
                else {if (this.full_list_need_sort) p.sort(this.full_list); this.list = this.full_list.Clone(); this.full_list_need_sort = false;} p.sort(handleList);
                switch (tree_type) {
                    case 0:
                        const tfo = fb.TitleFormat(p.view); items = tfo.EvalWithMetadbs(handleList);
                        handleList.Convert().forEach((h, j) => {
                            i = this.list.Find(h);
                            if (i != -1) this.otherNode.splice(i, 0, items[j].split(p.splitter));
                        });
                        break;
                    case 1:
                        items = handleList.GetLibraryRelativePaths();
                        handleList.Convert().forEach((h, j) => {
                            i = this.list.Find(h);
                            if (i != -1) this.otherNode.splice(i, 0, items[j].split("\\"));
                        });
                        break;
                }
                if (this.list.Count) this.empty = "";
                if (p.s_txt) {
                    let newSearchItems = new FbMetadbHandleList();
                    this.validSearch = true; try {newSearchItems = s.query(handleList, p.s_txt);} catch(e) {this.validSearch = false;}
                    p.list.InsertRange(p.list.Count, newSearchItems); p.sort(p.list); p.sort(newSearchItems);
                    switch (tree_type) {
                        case 0:
                            const tfo = fb.TitleFormat(p.view); items = tfo.EvalWithMetadbs(newSearchItems);
                            newSearchItems.Convert().forEach((h, j) => {
                                i = p.list.Find(h); if (i != -1) this.searchNodes.splice(i, 0, items[j].split(p.splitter));
                            });
                            break;
                        case 1:
                            items = newSearchItems.GetLibraryRelativePaths();
                            newSearchItems.Convert().forEach((h, j) => {
                                i = p.list.Find(h); if (i != -1) this.searchNodes.splice(i, 0, items[j].split("\\"));
                            });
                            break;
                    }
                    this.node = this.searchNodes.slice();
                    if (!p.list.Count) {library_tree.tree = []; sbar.set_rows(0); this.none = this.validSearch ? "Nothing found" : "Invalid search expression"; p.tree_paint(); this.noListUpd = true;}
                } else p.list = this.list;
                break;
            case 1:
                let lis = libraryProps.filterBy > 0 && pptDefault.searchShow > 1 ? s.query(handleList, this.filterQuery) : handleList; p.sort(lis);
                this.binaryInsert(p.folderView, lis, this.list, this.otherNode);
                if (this.list.Count) this.empty = "";
                if (p.s_txt) {
                    let newSearchItems = new FbMetadbHandleList();
                    this.validSearch = true; try {newSearchItems = s.query(handleList, p.s_txt);} catch(e) {this.validSearch = false;}
                    this.binaryInsert(p.folderView, newSearchItems, p.list, this.searchNodes);
                    this.node = this.searchNodes.slice();
                    if (!p.list.Count) {
                        library_tree.tree = [];
                        sbar.set_rows(0); this.none = this.validSearch ? "Nothing found" : "Invalid search expression"; p.tree_paint(); this.noListUpd = true;
                    }
                } else p.list = this.list;
                break
            }
        // const tree_type = !p.folderView ? 0 : 1;
        // switch (true) {
        // 	case handle_list.Count < 100:
        // 		/** @type {FbMetadbHandleList} */
        // 		let lis;
        // 		if (p.filterBy > 0 && pptDefault.searchShow > 1) {
        // 			try {
        // 				lis = fb.GetQueryItems(handle_list, p.filt[p.filterBy].type);
        // 			} catch (e) {}
        // 		} else lis = handle_list;
        // 		p.sort(lis);
        // 		this.binaryInsert(p.view_by == p.folder_view, lis, this.list, this.node);
        // 		if (this.list.Count) this.empty = "";
        // 		if (p.s_txt) {
        // 			/** @type {FbMetadbHandleList} */
        // 			let newSearchItems;// = fb.CreateHandleList();
        // 			try {newSearchItems = fb.GetQueryItems(handle_list, p.s_txt);} catch(e) {}
        // 			this.binaryInsert(p.view_by == p.folder_view, newSearchItems, p.list, this.searchNodes);
        // 			this.node = this.searchNodes.slice();
        // 			if (!p.list.Count) {
        // 				// pop.tree = []; pop.line_l = 0;
        // 				sbar.set_rows(0); this.none = "Nothing found"; p.tree_paint();
        // 			}
        // 		} else p.list = this.list;
        // 		break;
        // 	default:
        // 		this.full_list.InsertRange(this.full_list.Count, handle_list);
        // 		this.full_list_need_sort = true;
        // 		if (p.filterBy > 0 && pptDefault.searchShow > 1) {
        // 			var newFilterItems = fb.CreateHandleList();
        // 			try {newFilterItems = fb.GetQueryItems(handle_list, p.filt[p.filterBy].type);} catch (e) {}
        // 			this.list.InsertRange(this.list.Count, newFilterItems);
        // 			p.sort(this.list);
        // 		}
        // 		else {
        // 			p.sort(this.full_list);
        // 			this.list = this.full_list.Clone();
        // 			this.full_list_need_sort = false;
        // 		}
        // 		p.sort(handle_list);
        // 		let item_a;
        // 		switch (tree_type) {
        // 			case 0: var tfo = fb.TitleFormat(p.view); item_a = tfo.EvalWithMetadbs(handle_list); for (var j = 0; j < handle_list.Count; j++) {var i = this.list.Find(handle_list[j]); if (i != -1) this.node.splice(i, 0, item_a[j].split("|"));} break;
        // 			case 1: item_a = handle_list.GetLibraryRelativePaths(); for (var j = 0; j < handle_list.Count; j++) {var i = this.list.Find(handle_list[j]); if (i != -1) this.node.splice(i, 0, item_a[j].split("\\"));} break;
        // 		}
        // 		if (this.list.Count) this.empty = "";
        // 		if (p.s_txt) {
        // 			var newSearchItems = fb.CreateHandleList();
        // 			try {newSearchItems = fb.GetQueryItems(handle_list, p.s_txt);} catch(e) {}
        // 			p.list.InsertRange(p.list.Count, newSearchItems); p.sort(p.list); p.sort(newSearchItems);
        // 			let item_a;
        // 			switch (tree_type) {
        // 				case 0: var tfo = fb.TitleFormat(p.view); item_a = tfo.EvalWithMetadbs(newSearchItems); for (var j = 0; j < newSearchItems.Count; j++) {var i = p.list.Find(newSearchItems[j]); if (i != -1) this.searchNodes.splice(i, 0, item_a[j].split("|"));} break;
        // 				case 1: item_a = newSearchItems.GetLibraryRelativePaths();
        // 				for (var j = 0; j < newSearchItems.Count; j++) {
        // 					var i = p.list.Find(newSearchItems[j]); if (i != -1) this.searchNodes.splice(i, 0, item_a[j].split("\\"));
        // 				} break;
        // 			}
        // 			this.node = this.searchNodes.slice();
        // 			if (!p.list.Count) {
        // 				// pop.tree = []; pop.line_l = 0;
        // 				sbar.set_rows(0); this.none = "Nothing found"; p.tree_paint();
        // 			}
        // 		} else p.list = this.list;
        // 		break;
        // }
    }

    /**
     * @param {FbMetadbHandleList} handleList
     */
    added_f(handleList) {
        let addType = p.multiProcess || /* p.nodisplay ||*/ handleList.Count > 100 ? 0 : 1, i, items, tree_type = !p.folderView ? 0 : 1;
        switch (addType) {
            case 0:
                this.list.InsertRange(this.list.Count, handleList); p.sort(this.list); p.sort(handleList);
                switch (tree_type) {
                    case 0:
                        const tfo = fb.TitleFormat(p.view); items = tfo.EvalWithMetadbs(handleList);
                        handleList.Convert().forEach((h, j) => {
                            i = this.list.Find(h); if (i != -1) this.otherNode.splice(i, 0, items[j].split(p.splitter));
                        });
                        if (!this.list.Count) this.none = "Nothing found";
                        break;
                    case 1:
                        items = handleList.GetLibraryRelativePaths();
                        handleList.Convert().forEach((h, j) => {
                            i = this.list.Find(h); if (i != -1) this.otherNode.splice(i, 0, items[j].split("\\"));
                        });
                        if (!this.list.Count) this.none = "Nothing found";
                        break;
                }
            case 1: this.binaryInsert(p.folderView, handleList, this.list, this.otherNode); break;
        }
    }

    /**
     * @param {FbMetadbHandleList} handleList
     */
     added_s(handleList) {
        let addType = p.multiProcess || /* p.nodisplay ||*/ handleList.Count > 100 ? 0 : 1, i, items, tree_type = !p.folderView ? 0 : 1;
        switch (addType) {
            case 0:
                p.list.InsertRange(p.list.Count, handleList); p.sort(p.list);
                switch (tree_type) {
                case 0:
                    const tfo = fb.TitleFormat(p.view); items = tfo.EvalWithMetadbs(handleList);
                    handleList.Convert().forEach((h, j) => {
                        i = p.list.Find(h); if (i != -1) this.searchNodes.splice(i, 0, items[j].split(p.splitter));
                    });
                    break;
                case 1:
                    items = handleList.GetLibraryRelativePaths();
                    handleList.Convert().forEach((h, j) => {
                        i = p.list.Find(h); if (i != -1) this.searchNodes.splice(i, 0, items[j].split("\\"))
                    });
                    break;
            }
            case 1:
                this.binaryInsert(p.folderView, handleList, p.list, this.searchNodes);
                break;
        }
    }

    removed(handleList) {
        let i, j = handleList.Count; while (j--) {i = this.list.Find(handleList[j]); if (i != -1) {this.list.RemoveById(i); this.otherNode.splice(i, 1);}}
        if (libraryProps.filterBy > 0 && pptDefault.searchShow > 1) {
            j = handleList.Count;
            if (this.full_list_need_sort) p.sort(this.full_list);
            this.full_list_need_sort = false;
            while (j--) {i = this.full_list.Find(handleList[j]); if (i != -1) this.full_list.RemoveById(i);}
        }
        else this.full_list = this.list.Clone();
        if (p.s_txt) {
            j = handleList.Count; while (j--) {i = p.list.Find(handleList[j]); if (i != -1) {p.list.RemoveById(i); this.searchNodes.splice(i, 1);}}
            this.node = this.searchNodes.slice();
            if (!p.list.Count) {
                library_tree.tree = [];
                sbar.set_rows(0); this.none = this.validSearch ? "Nothing found" : "Invalid search expression";
                p.tree_paint();
                this.noListUpd = true;
            }
        }
        else p.list = this.list;
        if (!this.full_list.Count) {
            this.empty = "Nothing to show\n\nConfigure Media Library first\n\nFile>Preferences>Media library";
            this.root = [];
            library_tree.tree = [];
            sbar.set_rows(0);
            p.tree_paint();
            this.noListUpd = true;
        }
    }
}

const ObjType = {
    Node: 0,
    Item: 1,
    NoObj: 2
};

/** called Populate() in other version */
function LibraryTree() {
    this.setActions = (n, i) => {
        switch (n) {
            case 'click': libraryProps.clickAction = i; break;
            case 'key': libraryProps.keyAction = i; break;
            case 'dblClick': libraryProps.dblClickAction = i; return;
            case 'send': this.autoPlay.send = !this.autoPlay.send; pptDefault.autoPlay = this.autoPlay.send; return;
        }
        this.autoPlay = {click: libraryProps.clickAction < 2 ? false : libraryProps.clickAction, send: pptDefault.autoPlay}
        this.autoFill = {mouse: libraryProps.clickAction == 1 ? true : false, key: libraryProps.keyAction}
        // console.log(`clickAction: ${libraryProps.clickAction}, autoPlay = {click: ${this.autoPlay.click}, send: ${this.autoPlay.send}}, autoFill = {mouse: ${this.autoFill.mouse}, key: ${this.autoFill.key}}`);
    };
    this.setActions();
    var get_pos = -1,
        handles = null,
        is_focused = false,
        ix_o = 0,
        last_pressed_coord = {
            x: undefined,
            y: undefined
        },
        last_sel = -1,
        lbtn_dn = false,
        m_i = -1,
        m_br = -1,
        nd = [],
        row_o = 0,
        tt = g_tooltip,
        //tooltip = window.GetProperty(" Tooltips", false),
        tt_c = 0,
        tt_y = 0,
        tt_id = -1;
    // let autoplay = true; // window.GetProperty(" Playlist: Play On Enter Or Send From Menu", false);
    let clicked_on = ObjType.NoObj;
    let dbl_clicked = false;
    let selList = null;
    let showNowplaying = pptDefault.showNowplaying;
    // var btn_pl  = window.GetProperty(" Playlist Use: 0 or 1", "General,1,Alt+LeftBtn,1,MiddleBtn,1").replace(/\s+/g, "").split(",");
    // if (btn_pl[0] == "LeftBtn") window.SetProperty(" Playlist Use: 0 or 1", "General," + btn_pl[1] + ",Alt+LeftBtn," + btn_pl[3] + ",MiddleBtn," + btn_pl[5]);
    var alt_lbtn_pl = !libraryProps.sendToCurrent; //btn_pl[3] == 1 ? true : false,
    const mbtn_pl = !libraryProps.sendToCurrent; //btn_pl[5] == 1 ? true : false;
    // var hotKeys = window.GetProperty(" Hot Key: 1-10 // Assign JScript Panel index in keyboard shortcuts", "CollapseAll,0,PlaylistAdd,0,PlaylistInsert,0,Search,0,SearchClear,0").replace(/^[,\s]+|[,\s]+$/g, "").split(",");
    // var collapseAllIX = parseFloat(hotKeys[1]),
    // 	addIX = parseFloat(hotKeys[3]),
    // 	insertIX = parseFloat(hotKeys[5]),
    // 	searchFocusIX = parseFloat(hotKeys[7]),
    // 	searchClearIX = parseFloat(hotKeys[9]);
    // var custom_sort = window.GetProperty(" Playlist: Custom Sort", "");
    // if (libraryProps.playlistCustomSort) {
    // 	var tf_customSort = fb.TitleFormat(libraryProps.playlistCustomSort);
    // }
    const tf_customSort = fb.TitleFormat(settings.defaultSortString);	// TODO: Do we still need this?
    // var libraryProps.dblClickAction = window.GetProperty(" Text Double-Click: ExplorerStyle-0 Play-1 Send-2", 1);
    // var lib_playlist = window.GetProperty(" Playlist", "Library View");
    // libraryProps.autoFill = window.GetProperty(" Playlist: AutoFill", true);
    var selection_holder = fb.AcquireUiSelectionHolder(), symb = window.CreateThemeManager("TREEVIEW");
    var im = gdi.CreateImage(ui.node_sz, ui.node_sz),
        g = im.GetGraphics();
    if (ui.node_win) try {
        symb.SetPartAndStateID(2, 1);
        symb.SetPartAndStateID(2, 2);
        symb.DrawThemeBackground(g, 0, 0, ui.node_sz, ui.node_sz);
    } catch (e) {
        ui.node_win = 0;
    }
    im.ReleaseGraphics(g);
    this.line_l = 0; this.nowp = -1; this.rows = 0; this.sel_items = []; this.subCounts =  {"standard": {}, "filter": {}, "search": {}}; this.tree = [];
    // if (!window.GetProperty("SYSTEM.Playlist Checked", false))
    // 	fb.ShowPopupMessage("Default playlist: Library View.\n\nChange in panel properties if required.", "Library Tree");
    // window.SetProperty("SYSTEM.Playlist Checked", true);
    var arr_contains = function(arr, item) {for (var i = 0; i < arr.length; i++) if (arr[i] == item) return true; return false;}
    var arr_index = function(arr, item) {var n = -1; for (var i = 0; i < arr.length; i++) if (arr[i] == item) {n = i; break;} return n;}
    var check_node = function(gr) {if (sbar.draw_timer || !ui.node_win) return; try {symb.SetPartAndStateID(2, 1); symb.SetPartAndStateID(2, 2); symb.DrawThemeBackground(gr, -ui.node_sz, -ui.node_sz, ui.node_sz, ui.node_sz);} catch (e) {ui.node_win = 0;}}
    const clickedOn = (x, y, item) => x < ui.x + Math.round(ui.pad * item.tr) + ui.icon_w + ui.margin ? ObjType.Node : this.check_ix(item, x, y, false) ? ObjType.Item : ObjType.NoObj;
    var draw_node = function (gr, j, x, y) {
        switch (ui.node_win) {
            case 0:
                if (!libraryProps.nodeHighlight && j > 1) j -= 2;
                x = Math.round(x);
                y = Math.round(y);
                gr.DrawImage(nd[j], x, y, nd[j].Width, nd[j].Height, 0, 0, nd[j].Width, nd[j].Height);
                break;
            case 1:
                if (j > 1) j -= 2;
                symb.SetPartAndStateID(2, !j ? 1 : 2);
                symb.DrawThemeBackground(gr, x, y, ui.node_sz, ui.node_sz);
                break;
        }
    }
    const getItems = list => {let handleList = new FbMetadbHandleList(); list.some(v => {if (v >= p.list.Count) return true; handleList.Add(p.list[v]);}); return handleList;}
    const numSort = (a, b) => a - b;
    var sort = function (a, b) {return a.srt.replace(/^\?/,"").replace(/(\d+)/g, function (n) {return ('0000' + n).slice(-5)}).localeCompare(b.srt.replace(/^\?/,"").replace(/(\d+)/g, function (n) {return ('0000' + n).slice(-5)}));}
    var uniq = function(a) {
        return [... new Set(a)];
    }
    this.add = (x, y, pl) => {
        if (y < p.s_h) return;
        const ix = this.get_ix(x, y, true, false);
        p.pos = ix;
        if (ix < this.tree.length && ix >= 0)
            if (this.check_ix(this.tree[ix], x, y, true)) {
                this.clear();
                this.tree[ix].sel = true;
                this.get_sel_items();
                this.load(this.sel_items, true, true, false, pl, false);
                lib_manager.treeState(false, libraryProps.rememberTree);
            }
    }
    // libraryProps.autoCollapse = window.GetProperty(" Node: Auto Collapse", false);
    // this.branch_chg = function (br, unused1, unused2) {
    //     var new_br = 0;
    //     if (br.tr == 0) {
    //         for (var i = 0; i < lib_manager.root.length; i++) {
    //             new_br += lib_manager.root[i].child.length;
    //             lib_manager.root[i].child = [];
    //         }
    //     } else {
    //         var par = this.tree[br.par];
    //         for (var i = 0; i < par.child.length; i++) {
    //             new_br += par.child[i].child.length;
    //             par.child[i].child = [];
    //         }
    //     }
    //     return new_br;
    // }
    const branch_chg = (br) => {
        const arr = br.tr == 0 ? lib_manager.root : this.tree[br.par].child;
        let new_br = 0;
        arr.forEach(v => {
            new_br += v.child.length;
            v.child = [];
        });
        return new_br;
    }
    // this.check_row = function (x, y) {
    //     m_br = -1;
    //     var im = this.get_ix(x, y, true, false);
    //     if (im >= this.tree.length || im < 0) return -1;
    //     var item = this.tree[im];
    //     if (x < Math.round(ui.pad * item.tr) + ui.icon_w + ui.margin + ui.x && (!item.track || libraryProps.rootNode && item.tr == 0)) m_br = im;
    //     return im;
    // }
    const checkRow = (x, y) => {m_br = -1; const im = this.get_ix(x, y, true, false); if (im >= this.tree.length || im < 0) return -1; const item = this.tree[im]; if (x < Math.round(ui.pad * item.tr) + ui.icon_w + ui.margin + ui.x && (!item.track || libraryProps.rootNode && item.tr == 0)) m_br = im; return im;}
    this.clear = () => {this.tree.forEach(v => v.sel = false);}
    this.clear_child = function(br) {br.child = []; this.buildTree(lib_manager.root, 0, true, true);}
    this.deActivate_tooltip = function() {tt_c = 0; tt.Text = ""; tt.TrackActivate = false; tt.Deactivate(); p.tree_paint();}
    // this.expandNodes = function (obj, isRoot) {
    //     this.branch(obj, isRoot, true, true);
    //     if (obj.child)
    //         for (var k = 0; k < obj.child.length; k++)
    //             if (!obj.child[k].track)
    //                 this.expandNodes(obj.child[k], false);
    // }
    this.expandNodes = (obj, am) => {   // am was isRoot?
        this.branch(obj, am, true, true);
        if (obj.child)
            obj.child.forEach(v => {
                if (!v.track)
                    this.expandNodes(v, false);
            });
    }
    this.getNowplaying = (handle, stop) => {if (!showNowplaying) return; if (stop) return this.nowp = -1; if (!handle && fb.IsPlaying) handle = fb.GetNowPlaying(); if (!handle) return this.nowp = -1; this.nowp = p.list.Find(handle); p.tree_paint();}
    this.gen_pl = !libraryProps.sendToCurrent;
    this.get_sel_items = () => {
        p.tree_paint();
        this.sel_items = [];
        this.tree.forEach(v => {
            if (v.sel) {
                this.sel_items.push(... v.item);
            }
        });
        this.sel_items = uniq(this.sel_items);
    }

    // this.getHandles = function(n) {if (n) this.get_sel_items(); var handle_list = new FbMetadbHandleList(); try {for (var i = 0; i < this.sel_items.length; i++) handle_list.Add(p.list[this.sel_items[i]]);} catch (e) {} return handle_list;}
    this.leave = function(){if (men.r_up || tt.Text) return; m_br = -1; row_o = 0; m_i = -1; ix_o = 0; p.tree_paint();}
    this.mbtn_up = function(x, y) {this.add(x, y, mbtn_pl);}
    this.nowPlayingShow = () => {if (this.nowp != -1) {let np_i = -1; this.tree.forEach((v, i) => {if ((!libraryProps.rootNode || libraryProps.rootNode && v.tr) && v.item.includes(this.nowp)) np_i = i;}); if (np_i != -1) {sbar.check_scroll(np_i  * ui.row_h - Math.round(sbar.rows_drawn / 2 - 1) * ui.row_h);}}}
    this.on_char = function(code) {if (p.search || code != vk.copy) return; var handle_list = this.selected(true); fb.CopyHandleListToClipboard(handle_list); }
    this.on_focus = function(p_is_focused) {is_focused = p_is_focused; if (p_is_focused && handles && handles.Count) selection_holder.SetSelection(handles);}
    this.row = function(y) {return Math.round((y - p.s_h - ui.row_h * 0.5) / ui.row_h);}
    this.selected = n => {if (n) this.get_sel_items(); return getItems(this.sel_items);}
    this.setGetPos = function(pos) {m_i = get_pos = pos;}

    this.create_tooltip = function() {
        if (!libraryProps.tooltips) return;
        tt = g_tooltip;
        tt_y = ui.row_h - libraryProps.rowVertPadding;
        tt_y = p.s_h - Math.floor((ui.row_h - tt_y) / 2)
        tt.SetDelayTime(0, 500);
        tt.Text = "";
    }

    this.Activate_tooltip = function(ix, y) {
        if (tt_id == ix || Math.round(ui.pad * this.tree[ix].tr + ui.margin) + ui.icon_w + (!libraryProps.tooltips || !libraryProps.fullLine ? this.tree[ix].w : this.tree[ix].tt_w) <= sbar.tree_w - ui.sel) return;
        if (tt_c == 2) {
            tt_id = ix;
            return;
        }
        tt_c += 1;
        tt.Activate();
        tt.TrackActivate = true;
        tt.Text = this.tree[ix].name + this.tree[ix].count;
        tt.TrackPosition(Math.round(ui.x + ui.pad * this.tree[ix].tr + ui.margin + ui.icon_w - ui.tt + 2), Math.round(this.row(y) * ui.row_h + tt_y));
        p.tree_paint();
        timer.tooltip();
    }

    this.branch = function(br, base, node, block) {
        if (!br || br.track) return;
        var br_l = br.item.length,
            // folderView = p.view_by == p.folder_view ? true : false,
            i = 0,
            k = 0,
            isTrack = false,
            l = base ? 0 : libraryProps.rootNode ? br.tr : br.tr + 1,
            n = "", n_o = "#get_branch#", nU = "", pos = -1;
        if (p.folderView) base = false;
        if (base) node = false;
        var get = !base || p.s_txt;
        if (!p.multiProcess) {
            for (k = 0; k < br_l; k++) {
                pos = br.item[k];
                try {
                    if (base || get && l < lib_manager.node[pos].length - 1) n = lib_manager.node[pos][l]
                    else n = '#get_track#';
                    // if (get) {if (l < lib_manager.node[pos].length - 1) n = lib_manager.node[pos][l]; else n = "#get_track#";}
                    isTrack = libraryProps.nodeShowTracks ? false : l < lib_manager.node[pos].length - 2 ? false : true;
                    if (n == "#get_track#") {n = lib_manager.node[pos][l]; isTrack = true;}
                    nU = n.toUpperCase();
                    if (n_o != nU) {
                        n_o = nU;
                        br.child[i] = {
                            name: n,
                            sel: false,
                            child: [],
                            track: isTrack,
                            item: []
                        };
                        br.child[i].item.push(pos);
                        i++;
                    } else br.child[i - 1].item.push(pos);
                }
                catch (e) {}
            }
        } else {
            if (p.multi_swap) {
                var srt = "";
                for (k = 0; k < br_l; k++) {
                    pos = br.item[k];
                    try {
                        if (base) n = lib_manager.node[pos][l];
                        if (get) {if (l < lib_manager.node[pos].length - 1) n = lib_manager.node[pos][l]; else n = "#get_track#";}
                        isTrack = libraryProps.nodeShowTracks ? false : l < lib_manager.node[pos].length - 2 ? false : true;
                        if (n == "#get_track#") {n = lib_manager.node[pos][l]; isTrack = true;}
                        nU = n.toUpperCase();
                        if (n_o != nU) {
                            n_o = nU;
                            n = n.replace(/~#!##!#|#!##!#/g, "?");
                            n = lib_manager.prefixes(n);
                            srt = n;
                            n = n.replace(/#@#.*?#@#/g, "");
                            br.child[i] = {
                                name: n,
                                sel: false,
                                child: [],
                                track: isTrack,
                                item: [],
                                srt: srt
                            };
                            br.child[i].item.push(pos);
                            i++;
                        } else br.child[i - 1].item.push(pos);
                    } catch (e) {}
                }
            } else {
                var srt = "";
                for (k = 0; k < br_l; k++) {
                    pos = br.item[k];
                    try {
                        if (base) n = lib_manager.node[pos][l];
                        if (get) {if (l < lib_manager.node[pos].length - 1) n = lib_manager.node[pos][l]; else n = "#get_track#";}
                        isTrack = libraryProps.nodeShowTracks ? false : l < lib_manager.node[pos].length - 2 ? false : true;
                        if (n == "#get_track#") {n = lib_manager.node[pos][l]; isTrack = true;}
                        nU = n.toUpperCase();
                        if (n_o != nU) {
                            n_o = nU;
                            n = n.replace(/#!##!#/g, "?");
                            srt = n;
                            n = n.replace(/#@#.*?#@#/g, "");
                            br.child[i] = {
                                name: n,
                                sel: false,
                                child: [],
                                track: isTrack,
                                item: [],
                                srt: srt
                            };
                            br.child[i].item.push(pos);
                            i++;
                        } else br.child[i - 1].item.push(pos);
                    } catch (e) {}
                }
            }
        }
        this.buildTree(lib_manager.root, 0, node, true, block);
    }

    var getAllCombinations = function(n) {
        var combinations = [], divisors = [], nn = [], arraysToCombine = []; nn = n.split("#!#");
        for (var i = 0; i < nn.length; i++) {nn[i] = nn[i].split("@@"); if (nn[i] != "") arraysToCombine.push(nn[i]);}
        for (var i = arraysToCombine.length - 1; i >= 0; i--) divisors[i] = divisors[i + 1] ? divisors[i + 1] * arraysToCombine[i + 1].length : 1;
        function getPermutation(n, arraysToCombine) {
            var result = [], curArray;
            for (var i = 0; i < arraysToCombine.length; i++) {
                curArray = arraysToCombine[i];
                result.push(curArray[Math.floor(n / divisors[i]) % curArray.length]);
            } return result;
        }
        var numPerms = arraysToCombine[0].length;
        for (var i = 1; i < arraysToCombine.length; i++) numPerms *= arraysToCombine[i].length;
        for (var i = 0; i < numPerms; i++) combinations.push(getPermutation(i, arraysToCombine));
        return combinations;
    }

    this.buildTree = (br, tr, node, full, block) => {
        const l = !libraryProps.rootNode ? tr : tr - 1; let i = 0, j = 0;
        if (p.multiProcess) {
            const multi_cond = [], multi_obj = [], multi_rem = [], nm_arr = [];
            let h = -1, multi = [], n = "", n_o = "#condense#", nU = "";
            br.forEach((v, i) => {
                if (v.name.includes("@@")) {
                    multi = getAllCombinations(v.srt);
                    multi_rem.push(i);
                    multi.forEach(w => {
                        multi_obj.push({name:w.join("").replace(/#@#.*?#@#/g,""), item:v.item.slice(), track:v.track, srt:w.join("")});
            });}});
            i = multi_rem.length; while (i--) br.splice(multi_rem[i], 1);
            multi_obj.sort(sort);
            multi_obj.forEach(v => {
                n = v.name; nU = n.toUpperCase();
                if (n_o != nU) {
                    n_o = nU; multi_cond[j] = {name:n, item:v.item.slice(), track:v.track, srt:v.srt};
                    j++;
                } else multi_cond[j - 1].item.push.apply(multi_cond[j - 1].item, v.item.slice());
            });
            br.forEach(v => {v.name = v.name.replace(/#!#/g, ""); nm_arr.push(v.name); if (v.srt) v.srt = v.srt.replace(/#!#/g, "");});
            multi_cond.forEach((v, i) => {
                h = nm_arr.indexOf(v.name);
                if (h != -1) {br[h].item.push.apply(br[h].item, v.item.slice());
                multi_cond.splice(i ,1);
            }});
            multi_cond.forEach((v, i) => br.splice(i + 1, 0, {name:v.name, sel:false, track:v.track, child:[], item:v.item.slice(), srt:v.srt}));
            if (!node || node && !full) br.sort(sort);
            i = br.length; while (i--) {
                if (i != 0 && br[i].name.toUpperCase() == br[i - 1].name.toUpperCase()) {
                    br[i - 1].item.push.apply(br[i - 1].item, br[i].item.slice()); br.splice(i, 1);
                }
            }
        }
        const br_l = br.length, par = this.tree.length - 1; if (tr == 0) this.tree = []; let type;
        if (libraryProps.nodeItemCounts == 2) type = p.s_txt ? "search" : libraryProps.filterBy > 0 && pptDefault.searchShow > 1 ? "filter" : "standard";
        br.forEach((v, i) => {
            j = this.tree.length; this.tree[j] = v;
            this.tree[j].top = !i ? true : false; this.tree[j].bot = i == br_l - 1 ? true : false;
            this.tree[j].ix = j; this.tree[j].tr = tr; this.tree[j].par = par;
            let pr;
            if (libraryProps.nodeItemCounts == 2 && tr > 1) pr = this.tree[par].par;
            switch (true) {
                case l != -1 && !libraryProps.nodeShowTracks:
                    this.tree[j].item.some(v => {
                        if (lib_manager.node[v].length == l + 1 || lib_manager.node[v].length == l + 2) {
                            return this.tree[j].track = true;
                        }
                    });
                    break;
                case l == 0 && lib_manager.node[this.tree[j].item[0]].length == 1: this.tree[j].track = true; break;
            }
            this.tree[j].count = !this.tree[j].track || !libraryProps.nodeShowTracks  ? (libraryProps.nodeItemCounts == 1 ? " (" + this.tree[j].item.length + ")" : libraryProps.nodeItemCounts == 2 ?  " (" + this.branchCounts(this.tree[j], !libraryProps.rootNode || j ? false : true, true, false, tr + (tr > 2 ? this.tree[this.tree[pr].par].name : "") + (tr > 1 ? this.tree[pr].name : "") + (tr > 0 ? this.tree[par].name : "") + this.tree[j].name, type) + ")" : "") : ""; if (!libraryProps.nodeShowTracks && this.tree[j].count == " (0)") this.tree[j].count = "";
            if (v.child.length > 0) this.buildTree(v.child, tr + 1, node, libraryProps.rootNode && tr == 0 ? true : false);
        }, this);
        if (!block) {sbar.set_rows(this.tree.length); p.tree_paint();}
    }

    this.branchCounts = function(br, base, node, block, key, type) {
        if (!br) return; if (this.subCounts[type][key]) return this.subCounts[type][key];
        var b = []; var br_l = br.item.length, k = 0, l = base ? 0 : libraryProps.rootNode ? br.tr : br.tr + 1, n = "", n_o = "#get_branch#", nU = "", pos = -1; if (p.folderView) base = false; if (base) node = false; var get = !p.s_txt && !base || p.s_txt;
        switch (p.multiProcess) {
            case false:
                for (k = 0; k < br_l; k++) {
                    pos = br.item[k];
                    try {
                        if (base) n = lib_manager.node[pos][l];
                        if (get) {if (l < lib_manager.node[pos].length - 1) n = lib_manager.node[pos][l]; else n = "#get_track#";}
                        if (n == "#get_track#") n = lib_manager.node[pos][l]; nU = n.toUpperCase();
                        if (n_o != nU) {n_o = nU; b.push({name:n});}
                    } catch (e) {}
                }
                break;
            case true:
                switch (p.multi_swap) {
                    case false:
                        for (k = 0; k < br_l; k++) {
                            pos = br.item[k];
                            try {
                                if (base) n = lib_manager.node[pos][l];
                                if (get) {if (l < lib_manager.node[pos].length - 1) n = lib_manager.node[pos][l]; else n = "#get_track#";}
                                if (n == "#get_track#") n = lib_manager.node[pos][l]; nU = n.toUpperCase();
                                if (n_o != nU) {
                                    n_o = nU;
                                    n = n.replace(/#!##!#/g, "?");
                                    const srt = n;
                                    n = n.replace(/#@#.*?#@#/g,"");
                                    b.push({name:n, srt:srt});}
                            } catch (e) {}
                        }
                        break;
                    case true:
                        for (k = 0; k < br_l; k++) {
                            pos = br.item[k];
                            try {
                                if (base) n = lib_manager.node[pos][l];
                                if (get) {if (l < lib_manager.node[pos].length - 1) n = lib_manager.node[pos][l]; else n = "#get_track#";}
                                if (n == "#get_track#") n = lib_manager.node[pos][l]; nU = n.toUpperCase();
                                if (n_o != nU) {
                                    n_o = nU;
                                    n = n.replace(/~#!##!#|#!##!#/g, "?");
                                    n = lib_manager.prefixes(n);
                                    const srt = n;
                                    n = n.replace(/#@#.*?#@#/g,"");
                                    b.push({name:n, srt:srt});}
                            } catch (e) {}
                        }
                        break;
                }
                var h = -1, j = 0, multi = [], multi_cond = [], multi_obj = [], multi_rem = [],nm_arr = []; br_l = b.length; n = ""; n_o = "#condense#"; nU = "";
                for (let i = 0; i < br_l; i++) {
                    if (b[i].name.indexOf("@@") != -1) {
                        multi = getAllCombinations(b[i].srt);
                        multi_rem.push(i);
                        for (var m = 0; m < multi.length; m++) multi_obj.push({name:multi[m].join("").replace(/#@#.*?#@#/g,""), srt:multi[m].join("")});
                    }
                }
                let i = multi_rem.length; while (i--) b.splice(multi_rem[i], 1); br_l = b.length; multi_obj.sort(sort);
                i = 0; while (i < multi_obj.length) {n = multi_obj[i].name; nU = n.toUpperCase(); if (n_o != nU) {n_o = nU; multi_cond[j] = {name:n, srt:multi_obj[i].srt}; j++} i++}
                for (i = 0; i < br_l; i++) {b[i].name = b[i].name.replace(/#!#/g, ""); nm_arr.push(b[i].name);}
                for (i = 0; i < br_l; i++) {b[i].name = b[i].name.replace(/#!#/g, ""); nm_arr.push(b[i].name); if (b[i].srt) b[i].srt = b[i].srt.replace(/#!#/g, "");}
                for (i = 0; i < multi_cond.length; i++) {h = arr_index(nm_arr, multi_cond[i].name); if (h != -1) multi_cond.splice(i ,1);}
                for (i = 0; i < multi_cond.length; i++) b.splice(i + 1, 0, {name:multi_cond[i].name, srt:multi_cond[i].srt});
                var full = libraryProps.rootNode && br.tr == 0 ? true : false; if (!node || node && !full) b.sort(sort);
                i = b.length; while (i--) {if (i != 0 && b[i].name.toUpperCase() == b[i - 1].name.toUpperCase()) b.splice(i, 1);}
                break;
        }
        this.subCounts[type][key] = b.length;
        return b.length;
    }

    this.create_images = function() {
        const sz = ui.node_sz,
            ln_w = Math.max(Math.floor(sz / 7), 1);
        let plus = true,
            hot = false,
            sy_w = ln_w,
            x = 0,
            y = 0;
        if (((sz - ln_w * 3) / 2) % 1 != 0)
            sy_w = ln_w > 1 ? ln_w - 1 : ln_w + 1;
        sy_w = Math.max(sy_w, 2);   // set minimum size
        // // if (((sz - ln_w * 3) / 2) % 1 != 0)
        // // 	sy_w = ln_w > 1 ? ln_w - 1 : ln_w + 1;
        // for (var j = 0; j < 4; j++) {
        // 	nd[j] = gdi.CreateImage(sz, sz);
        // 	g = nd[j].GetGraphics();
        // 	g.SetSmoothingMode(SmoothingMode.AntiAlias);
        // 	hot = j > 1 ? true : false;
        // 	plus = !j || j == 2 ? true : false;
        // 	g.FillSolidRect(x, y, sz, sz, RGB(145, 145, 145));
        // 	if (!hot) {
        // 		g.FillGradRect(x + ln_w, y + ln_w, sz - ln_w * 2, sz - ln_w * 2, 91, plus ? ui.iconcol_e[0] : ui.iconcol_c[0],
        // 			plus ? ui.iconcol_e[1] : ui.iconcol_c[1], 1.0);
        // 	} else {
        // 		g.FillGradRect(x + ln_w, y + ln_w, sz - ln_w * 2, sz - ln_w * 2, 91, ui.iconcol_hArr[0], ui.iconcol_hArr[1], 1.0);
        // 	}
        // 	var x_o = [x, x + sz - ln_w, x, x + sz - ln_w],
        // 		y_o = [y, y, y + sz - ln_w, y + sz - ln_w];
        // 	for (var i = 0; i < 4; i++)
        // 		g.FillSolidRect(x_o[i], y_o[i], ln_w, ln_w, RGB(186, 187, 188));
        // 	if (plus)
        // 	// 	g.FillSolidRect(Math.floor(x + (sz - sy_w) / 2), y + ln_w + Math.min(ln_w, sy_w), sy_w, sz - ln_w * 2 - Math.min(ln_w, sy_w) * 2, !hot ? ui.iconpluscol : ui.iconpluscol_h);
        // 	// g.FillSolidRect(x + ln_w + Math.min(ln_w, sy_w), Math.floor(y + (sz - sy_w) / 2), sz - ln_w * 2 - Math.min(ln_w, sy_w) * 2, sy_w, !hot ? ui.iconpluscol : ui.iconpluscol_h);
        // 		g.FillSolidRect(x + (sz - sy_w) / 2, y + ln_w + Math.min(ln_w, sy_w), sy_w, sz - ln_w * 2 - Math.min(ln_w, sy_w) * 2, !hot ? ui.iconpluscol : ui.iconpluscol_h);
        // 	g.FillSolidRect(x + ln_w + Math.min(ln_w, sy_w), y + (sz - sy_w) / 2, sz - ln_w * 2 - Math.min(ln_w, sy_w) * 2, sy_w, !hot ? ui.iconpluscol : ui.iconpluscol_h);
        // 	nd[j].ReleaseGraphics(g);
        // }

        for (let j = 0; j < 4; j++) {
            nd[j] = s.gr(sz, sz, true, (/** @type {GdiGraphics} */ g) => {
                hot = j > 1 ? true : false;
                plus = !(j % 2) ? true : false;
                //g.FillSolidRect(x, y, sz, sz, RGB(145, 145, 145));
                if (pref.lib_design === 'library_traditional') {
                    if (!hot)
                        g.FillGradRect(x + ln_w, y + ln_w, sz - ln_w * 2, sz - ln_w * 2, 91, plus ? ui.col.icon_e[0] : ui.col.icon_c[0], plus ? ui.col.icon_e[1] : ui.col.icon_c[1], 1.0);
                    else
                        g.FillGradRect(x + ln_w, y + ln_w, sz - ln_w * 2, sz - ln_w * 2, 91, ui.col.icon_h[0], ui.col.icon_h[1], 1.0);
                } else if (pref.lib_design === 'library_modern') {
                    if (!hot) {
                        // Hide
                    }
                }
                let x_o = [x, x + sz - ln_w, x, x + sz - ln_w],
                    y_o = [y, y, y + sz - ln_w, y + sz - ln_w];
                for (let i = 0; i < 4; i++)
                    //g.FillSolidRect(x_o[i], y_o[i], ln_w, ln_w, RGB(186, 187, 188));
                    if (pref.whiteTheme && pref.lib_design === 'library_traditional') {
                        g.FillSolidRect(x, y, sz, sz, ui.col.iconPlusbg);
                    } else if (pref.whiteTheme && pref.lib_design === 'library_modern') {
                        // Hide
                    } else if (pref.blackTheme && pref.lib_design === 'library_traditional') {
                        g.FillSolidRect(x, y, sz, sz, ui.col.iconPlusbg);
                    } else if (pref.blackTheme && pref.lib_design === 'library_modern') {
                        // Hide
                    } else if (pref.blueTheme && pref.lib_design === 'library_traditional') {
                        g.FillSolidRect(x, y, sz, sz, ui.col.iconPlusbg);
                    } else if (pref.blueThemee && pref.lib_design === 'library_modern') {
                        // Hide
                    } else if (pref.darkblueTheme && pref.lib_design === 'library_traditional') {
                        g.FillSolidRect(x, y, sz, sz, ui.col.iconPlusbg);
                    } else if (pref.darkblueTheme && pref.lib_design === 'library_modern') {
                        // Hide
                    } else if (pref.redTheme && pref.lib_design === 'library_traditional') {
                        g.FillSolidRect(x, y, sz, sz, ui.col.iconPlusbg);
                    } else if (pref.redTheme && pref.lib_design === 'library_modern') {
                        // Hide
                    } else if (pref.creamTheme && pref.lib_design === 'library_traditional') {
                        g.FillSolidRect(x, y, sz, sz, ui.col.iconPlusbg);
                    } else if (pref.creamTheme && pref.lib_design === 'library_modern') {
                        // Hide
                    } else if (pref.nblueTheme && pref.lib_design === 'library_traditional' || pref.ngreenTheme && pref.lib_design === 'library_traditional' || pref.nredTheme && pref.lib_design === 'library_traditional' || pref.ngoldTheme && pref.lib_design === 'library_traditional') {
                        g.FillSolidRect(x, y, sz, sz, ui.col.iconPlusbg);
                    } else if (pref.nblueTheme && pref.lib_design === 'library_modern' || pref.ngreenTheme && pref.lib_design === 'library_modern' || pref.nredTheme && pref.lib_design === 'library_modern' || pref.ngoldTheme && pref.lib_design === 'library_modern') {
                        // Hide
                    }
                    g.SetSmoothingMode(SmoothingMode.AntiAlias);
                    if (pref.lib_design === 'library_traditional') {
                        // Hide
                    } else if (pref.lib_design === 'library_modern') {
                        g.FillEllipse(x + (is_4k ? 3 : !is_4k && initDPI.dpi() > 120 ? 1 : 0), y + (is_4k ? 3 : !is_4k && initDPI.dpi() > 120 ? 1 : 0),
                                           is_4k ? libraryProps.baseFontSize * 0.95 : !is_4k && initDPI.dpi() > 120 ? libraryProps.baseFontSize * 0.92 :
                                                   libraryProps.baseFontSize > 16 || libraryProps.baseFontSize < 12 ? libraryProps.baseFontSize * 0.80 : libraryProps.baseFontSize * 0.91,
                                           is_4k ? libraryProps.baseFontSize * 0.95 : !is_4k && initDPI.dpi() > 120 ? libraryProps.baseFontSize * 0.92 :
                                                   libraryProps.baseFontSize > 16 || libraryProps.baseFontSize < 12 ? libraryProps.baseFontSize * 0.80 : libraryProps.baseFontSize * 0.91,
                        !plus ? ui.col.bg : ui.col.bg);
                    }

                g.SetSmoothingMode(SmoothingMode.None);
                if (plus)
                    // g.FillSolidRect(Math.floor(x + (sz - sy_w) / 2), y + ln_w + Math.min(ln_w, sy_w), sy_w, sz - ln_w * 2 - Math.min(ln_w, sy_w) * 2, !hot ? ui.col.iconPlus : ui.col.iconPlus_h);
                    g.FillSolidRect(x + (sz - sy_w) / 2, y + ln_w + Math.min(ln_w, sy_w), sy_w, sz - ln_w * 2 - Math.min(ln_w, sy_w) * 2, !hot ? ui.col.iconPlus : ui.col.iconPlus_h);
                    g.FillSolidRect(x + ln_w + Math.min(ln_w, sy_w), Math.floor(y + (sz - sy_w) / 2), sz - ln_w * 2 - Math.min(ln_w, sy_w) * 2, sy_w, !hot ? (plus ? ui.col.iconMinus_e : ui.col.iconMinus_c) : ui.col.iconMinus_h);
            });
        }
    }

    const tracking = list => {
        selList = getItems(list);
        // if (ppt.customSort.length) selList.OrderByFormat(tf_cs, 1);
        selection_holder.SetSelection(selList);
    }

    this.load = function(list, isArray, add, autoPlay, def_pl, insert) {
        let np_item = -1, pid = -1, pln = plman.FindOrCreatePlaylist(libraryProps.libPlaylistName, false);
        if (!def_pl) pln = plman.ActivePlaylist;
        else plman.ActivePlaylist = pln;
        const items = isArray ? getItems(list) : list.Clone();
        // if (p.multi_process && !libraryProps.playlistCustomSort) items.OrderByFormat(p.mv_sort, 1);
        // if (libraryProps.playlistCustomSort) items.OrderByFormat(tf_customSort, 1);
        handles = items.Clone();
        selection_holder.SetSelection(handles);
        if (fb.IsPlaying && !add && fb.GetNowPlaying()) {
            np_item = items.Find(fb.GetNowPlaying());
            let pl_chk = true, np;
            if (np_item != -1) {
                np = plman.GetPlayingItemLocation();
                if (np.IsValid) {
                    if (np.PlaylistIndex != pln) pl_chk = false; else pid = np.PlaylistItemIndex;
                }
                if (pl_chk && pid == -1 && items.Count < 5000) {
                    if (ui.dui) plman.SetActivePlaylistContext();
                    const start = Date.now();
                    for (let i = 0; i < 20; i++) {
                        if (Date.now() - start > 300) break;
                        fb.RunMainMenuCommand("Edit/Undo"); np = plman.GetPlayingItemLocation();
                        if (np.IsValid) {
                            pid = np.PlaylistItemIndex;
                            if (pid != -1) break;
                        }
                    }
                }
            }

            if (pid != -1) {
                plman.ClearPlaylistSelection(pln); plman.SetPlaylistSelectionSingle(pln, pid, true); plman.RemovePlaylistSelection(pln, true);
                const it = items.Clone(); items.RemoveRange(np_item, items.Count); it.RemoveRange(0, np_item + 1);
                if (plman.PlaylistItemCount(pln) < 5000)
                    plman.UndoBackup(pln);
                plman.InsertPlaylistItems(pln, 0, items);
                plman.InsertPlaylistItems(pln, plman.PlaylistItemCount(pln), it);
            } else if (autoPlay === 3) {   // add to playlist if already playing
                pid = plman.ActivePlaylist;
                if (plman.PlaylistItemCount(pln) < 5000)
                    plman.UndoBackup(pln);
                plman.InsertPlaylistItems(pln, plman.PlaylistItemCount(pln), items);
            } else {
                if (plman.PlaylistItemCount(pln) < 5000)
                    plman.UndoBackup(pln);
                plman.ClearPlaylist(pln);
                plman.InsertPlaylistItems(pln, 0, items);
            }
            if (autoPlay === 3) {
                autoPlay = false;   // add to playlist if already playing
            }
        } else if (!add) {
            if (plman.PlaylistItemCount(pln) < 5000) plman.UndoBackup(pln); plman.ClearPlaylist(pln); plman.InsertPlaylistItems(pln, 0, items);
        } else {
            if (plman.PlaylistItemCount(pln) < 5000) plman.UndoBackup(pln);
            plman.InsertPlaylistItems(pln, !insert ? plman.PlaylistItemCount(pln) : plman.GetPlaylistFocusItemIndex(pln), items, true);
            const f_ix = !insert || plman.GetPlaylistFocusItemIndex(pln) == -1 ? plman.PlaylistItemCount(pln) - items.Count: plman.GetPlaylistFocusItemIndex(pln) - items.Count;
            plman.SetPlaylistFocusItem(pln, f_ix); plman.EnsurePlaylistItemVisible(pln, f_ix);
        }
        if (autoPlay) {
            const c = (plman.PlaybackOrder === PlaybackOrder.Random || plman.PlaybackOrder === PlaybackOrder.ShuffleTracks) ? Math.ceil(plman.PlaylistItemCount(pln) * Math.random() - 1) : 0;
            plman.ExecutePlaylistDefaultAction(pln, c);
        }
    }

    // this function seems setup to collapse and scroll to the selected item, but it doesn't take an x,y so it always
    // collapses everything and does a bunch of useless checks given that it always starts from the first node
    this.collapseAll = function() {
        // var ic = this.get_ix(ui.x + 10, ui.y + p.s_h + ui.row_h / 2, true, false),
            // j = this.tree[ic].tr;
        var ic = 0;
        // console.log(ic, j, 10, p.s_h + ui.row_h / 2, this.tree[ic].tr);
        // if (libraryProps.rootNode) j -= 1;
        // if (this.tree[ic].tr != 0) {
        // 	var par = this.tree[ic].par,
        // 		pr_pr = [];
        // 	for (var m = 1; m < j + 1; m++) {
        // 		if (m == 1) pr_pr[m] = par;
        // 		else pr_pr[m] = this.tree[pr_pr[m - 1]].par;
        // 		ic = pr_pr[m];
        // 	}
        // }
        var nm = this.tree[ic].name.toUpperCase();
        for (var h = 0; h < this.tree.length; h++) {
            if (!libraryProps.rootNode || this.tree[h].tr)
                this.tree[h].child = [];
        }
        this.buildTree(lib_manager.root, 0);
        let scr_pos = false;
        for (let j = 0; j < this.tree.length; j++)
            if (this.tree[j].name.toUpperCase() == nm) {
                sbar.check_scroll(j * ui.row_h);
                scr_pos = true;
                break;
            }
        if (!scr_pos) {
            sbar.reset();
            p.tree_paint();
        }
        lib_manager.treeState(false, libraryProps.rememberTree);
    }

    this.expand = (ie, nm) => {
        let h = 0, m = 0; this.tree[ie].sel = true;
        if (libraryProps.autoCollapse) {
            const parent = [], pr_pr = []; let j = 0, par = 0;
            this.tree.forEach((v, j, arr) => {
                if (v.sel) {
                    j = v.tr; if (libraryProps.rootNode) j -= 1; if (v.tr != 0) {
                        par = v.par;
                        for (m = 1; m < j + 1; m++) {
                            if (m == 1) pr_pr[m] = par; else pr_pr[m] = arr[pr_pr[m - 1]].par;
                            parent.push(pr_pr[m]);
                        }
                    }
                }
            });
            this.tree.forEach((v, i) => {
                if (!parent.includes(i) && !v.sel && (!libraryProps.rootNode || v.tr)) v.child = [];
            });
            this.buildTree(lib_manager.root, 0);
        }
        const start_l = this.tree.length; let nm_n = "", nodes = -1; m = this.tree.length; while (m--) if (this.tree[m].sel) {this.expandNodes(this.tree[m], !libraryProps.rootNode || m ? false : true); nodes++;} this.clear();
        sbar.set_rows(this.tree.length); p.tree_paint();
        this.tree.some((v, i, arr) => {
            nm_n = (v.tr ? arr[v.par].name : "") + v.name; nm_n = nm_n.toUpperCase();
            if (nm_n == nm) {h = i; return true;}
        });
        const new_items = this.tree.length - start_l + nodes, b = Math.round(sbar.scroll / ui.row_h + 0.4), n = Math.max(h - b, libraryProps.rootNode ? 1 : 0); let scrollChk = false;
        if (n + 1 + new_items > this.rows) {scrollChk = true; if (new_items > this.rows - 2) sbar.check_scroll(h * ui.row_h); else sbar.check_scroll(Math.min(h * ui.row_h,(h + 1 - sbar.rows_drawn + new_items) * ui.row_h));}
        if (sbar.scroll > h * ui.row_h) {scrollChk = true; sbar.check_scroll(h * ui.row_h);} if (!scrollChk) sbar.scroll_round(); lib_manager.treeState(false, libraryProps.rememberTree);
    }

    this.draw = gr => {
        try {
            // ui.linecol = rgb(0,0,255);
            if (lib_manager.empty)
                return gr.GdiDrawText(lib_manager.empty, ui.font, ui.col.text, ui.x + ui.margin, ui.y + p.s_h, sbar.tree_w, ui.row_h * 5, 0x00000004 | 0x00000400);
            if (!this.tree.length)
                return gr.GdiDrawText(lib_manager.none, ui.font, ui.col.text, ui.x + ui.margin, ui.y + p.s_h, sbar.tree_w, ui.row_h, 0x00000004 | 0x00000400);
            var item_x = 0,
                item_y = 0,
                item_w = 0,
                nm = '',
                start_row = Math.round(sbar.delta / ui.row_h + 0.4),
                last_row = this.tree.length < start_row + p.rows ? this.tree.length : start_row + p.rows,
                sel_x = 0,
                sel_w = 0;
            var lineWidth = scaleForDisplay(1);
            check_node(gr);
            this.rows = 0;
            var depthRows = [];
            for (var j = 0; j <= this.tree[start_row].tr; j++) {
                // first row in the tree needs start_row set for all depths (in case expanded and scrolled tree)
                depthRows[j] = start_row;
            }
            if (this.tree[start_row].tr > 0) {
                var topLevel = this.tree[start_row].par;
                for (i = 1; i < this.tree[start_row].tr; i++) {
                    topLevel = this.tree[topLevel].par;
                }
                if (this.tree[topLevel].bot) {
                    // clear depthRows[0] if the parent node of the first item is the bottom of the main branch
                    depthRows[0] = undefined;
                }
            }
            for (var i = start_row; i < last_row; i++) {
                const item = this.tree[i];
                const depth = item.tr;
                if (item.top) {
                    depthRows[depth] = i;
                }
                if (item.bot || i === last_row - 1) {
                    // if this is the bottom of the branches nodes, draw the line
                    // if it is the last visible row in the tree, draw all lines, if they haven't been drawn previously
                    for (var drawDepth = (i === last_row - 1 ? 0 : depth); drawDepth <= depth; drawDepth++) {
                        if (depthRows[drawDepth] !== undefined) {
                            const line_row_start = depthRows[drawDepth];
                            const line_row_end = i + (item.bot && drawDepth === depth ? .5 : 1);
                            var l_x = (ui.x + Math.round(ui.pad * drawDepth + ui.margin) + Math.floor(ui.node_sz / 2));
                            var l_y = Math.round(ui.y + ui.row_h * line_row_start + p.s_h - sbar.delta);
                            var lineHeight = Math.ceil(ui.row_h * (line_row_end - line_row_start)) + 1;
                            if (pref.lib_design === 'library_traditional') {
								gr.FillSolidRect(l_x, l_y, lineWidth, lineHeight, ui.col.line);
							} else if (pref.lib_design === 'library_modern') {
								// Hide Line
							}
                        }
                    }
                    if (item.bot) {
                        depthRows[depth] = undefined;
                    }
                }

                item_y = Math.round(ui.y + ui.row_h * i + p.s_h - sbar.delta);
                this.rows++;
                if (pptDefault.rowStripes) {
                    if (i % 2 == 0)
                        gr.FillSolidRect(ui.x, item_y + 1, sbar.stripe_w, ui.row_h - 2, ui.col.b1);
                    else
                        gr.FillSolidRect(ui.x, item_y, sbar.stripe_w, ui.row_h, ui.col.b2);
                }
                // item selected
                let bgColor = ui.col.bgSel;
                if (item.sel && (ui.col.bgSel !== 0 || col.primary !== 0)) {
                    nm = item.name + item.count;
                    item_x = Math.round(ui.pad * item.tr + ui.margin) + ui.icon_w;
                    item_w = gr.CalcTextWidth(nm, ui.font);
                    sel_x = ui.x + item_x - ui.sel;
                    sel_w = Math.min(item_w + ui.sel * 2, ui.x + sbar.tree_w - sel_x - 1);
					if (pref.lib_design === 'library_traditional') {
						if (libraryProps.fullLine) sel_w = ui.x + sbar.tree_w - sel_x - (is_4k ? 35 : 17);
					} else if (pref.lib_design === 'library_modern') {
						if (libraryProps.fullLine) sel_x = ui.x; sel_w = ui.x + sbar.tree_w - sel_x + (is_4k ? 40 : 20);
						if (!libraryProps.fullLine) sel_x = ui.x; sel_w = ui.x + sbar.tree_w - sel_x + (is_4k ? 40 : 20);
					}
					if (!tt.Text || tt.Text || m_i != i && tt.Text) {
						if (pref.whiteTheme || pref.blackTheme) {
							bgColor = col.primary;
							gr.FillSolidRect(sel_x, item_y, sel_w, ui.row_h, bgColor);
							//gr.DrawRect(sel_x, item_y, sel_w, ui.row_h, 1, col.lightAccent);
						} else if (pref.blueTheme && pref.lib_design === 'library_traditional') {
							gr.FillSolidRect(sel_x, item_y, sel_w, ui.row_h, RGB(10, 130, 220));
						} else if (pref.blueTheme && pref.lib_design === 'library_modern') {
							gr.FillSolidRect(sel_x, item_y, sel_w, ui.row_h, RGB(10, 130, 220));
							gr.FillSolidRect(sel_x, item_y, scaleForDisplay(8), ui.row_h, rgb(242, 230, 170));
						} else if (pref.darkblueTheme && pref.lib_design === 'library_traditional') {
							gr.FillSolidRect(sel_x, item_y, sel_w, ui.row_h, RGB(24, 50, 82));
						} else if (pref.darkblueTheme && pref.lib_design === 'library_modern') {
							gr.FillSolidRect(sel_x, item_y, sel_w, ui.row_h, RGB(24, 50, 82));
							gr.FillSolidRect(sel_x, item_y, scaleForDisplay(8), ui.row_h, rgb(255, 202, 128));
						} else if (pref.redTheme && pref.lib_design === 'library_traditional') {
							gr.FillSolidRect(sel_x, item_y, sel_w, ui.row_h, RGB(140, 25, 25));
						} else if (pref.redTheme && pref.lib_design === 'library_modern') {
							gr.FillSolidRect(sel_x, item_y, sel_w, ui.row_h, RGB(135, 25, 25));
							gr.FillSolidRect(sel_x, item_y, scaleForDisplay(8), ui.row_h, rgb(245, 212, 165));
						} else if (pref.creamTheme && pref.lib_design === 'library_traditional') {
							gr.FillSolidRect(sel_x, item_y, sel_w, ui.row_h, RGB(120, 170, 130));
						} else if (pref.creamTheme && pref.lib_design === 'library_modern') {
							gr.FillSolidRect(sel_x, item_y, sel_w, ui.row_h, RGB(120, 170, 130));
						} else if (pref.nblueTheme && pref.lib_design === 'library_traditional' || pref.ngreenTheme && pref.lib_design === 'library_traditional' || pref.nredTheme && pref.lib_design === 'library_traditional' || pref.ngoldTheme && pref.lib_design === 'library_traditional') {
							gr.FillSolidRect(sel_x, item_y, sel_w, ui.row_h, RGB(35, 35, 35));
						} else if (pref.nblueTheme && pref.lib_design === 'library_modern' || pref.ngreenTheme && pref.lib_design === 'library_modern' || pref.nredTheme && pref.lib_design === 'library_modern' || pref.ngoldTheme && pref.lib_design === 'library_modern') {
							gr.FillSolidRect(sel_x, item_y, sel_w, ui.row_h, RGB(30, 30, 30));
							gr.FillSolidRect(sel_x, item_y, scaleForDisplay(8), ui.row_h, g_pl_colors.artist_playing);
						}
					}
                }
            }
            for (i = start_row; i < last_row; i++) {
                const item = this.tree[i];
                item_y = Math.round(ui.y + ui.row_h * i + p.s_h - sbar.delta);
                nm = item.name + item.count;
                item_x = Math.round(ui.x + ui.pad * item.tr + ui.margin);
                item_w = gr.CalcTextWidth(nm, ui.font);
                var nodeLineWidth = scaleForDisplay(2);
                if (libraryProps.tooltips && libraryProps.fullLine) item.tt_w = item_w;
                var y2 = Math.round(ui.y + ui.row_h * (i + 0.5) + p.s_h - sbar.delta) - 1;
				if (!item.track) {
					if (pref.lib_design === 'library_traditional') {
						gr.FillSolidRect(item_x + ui.node_sz, y2, ui.l_s1, nodeLineWidth, ui.col.line);
					} else if (pref.lib_design === 'library_modern') {
						// Hide Line
					}
					draw_node(gr, item.child.length < 1 ? m_br != i ? 0 : 2 : m_br != i ? 1 : 3, item_x, item_y + p.node_y);
				}
				else {
					// y2 = Math.round(p.s_h - sbar.delta) + Math.ceil(ui.row_h * (i + 0.5)) - ui.l_widthf; // TODO: Do we need this line?
					if (pref.lib_design === 'library_traditional') {
						gr.FillSolidRect(item_x + ui.l_s2, y2, ui.l_s3, nodeLineWidth, ui.col.line);
					} else if (pref.lib_design === 'library_modern') {
						// Hide Line
					}
				}
                item_x += ui.icon_w;
                let bgColor = item.sel ? col.primary : undefined;
                if (!tt.Text) {
                    if (m_i == i) {	// hovered
                        sel_x = item_x - ui.sel;
                        sel_w = Math.min(item_w + ui.sel * 2, ui.x + sbar.tree_w - sel_x - 1);
                        if (libraryProps.fullLine)
                            sel_w = ui.x + sbar.tree_w - sel_x;
                        //bgColor = shadeColor(col.primary, 10);
                        //gr.FillSolidRect(sel_x, item_y, sel_w, ui.row_h, bgColor);
                        //gr.DrawRect(sel_x, item_y, sel_w, ui.row_h, 1, col.lightAccent);
						if (pref.whiteTheme && pref.lib_design === 'library_traditional') {
							// Hide
						} else if (pref.whiteTheme && pref.lib_design === 'library_modern') {
							sel_x = ui.x; sel_w = ui.w;
							gr.DrawRect(sel_x, item_y - 1, sel_w, ui.row_h + 1, 1, rgb(230, 230, 230));
							gr.FillSolidRect(sel_x, item_y, scaleForDisplay(8), ui.row_h, col.primary);
						} else if (pref.blackTheme && pref.lib_design === 'library_traditional') {
							// Hide
						} else if (pref.blackTheme && pref.lib_design === 'library_modern') {
							sel_x = ui.x; sel_w = ui.w;
							gr.DrawRect(sel_x, item_y, sel_w, ui.row_h, 1, rgb(45, 45, 45));
							gr.FillSolidRect(sel_x, item_y + 1, scaleForDisplay(8), ui.row_h - 1, col.primary);
						} else if (pref.blueTheme && pref.lib_design === 'library_traditional') {
							// Hide
						} else if (pref.blueTheme && pref.lib_design === 'library_modern') {
							sel_x = ui.x; sel_w = ui.w;
							gr.DrawRect(sel_x, item_y, sel_w, ui.row_h, 1, rgb(10, 135, 230));
							gr.FillSolidRect(sel_x, item_y + 1, scaleForDisplay(8), ui.row_h - 1, rgb(242, 230, 170));
						} else if (pref.darkblueTheme && pref.lib_design === 'library_traditional') {
							// Hide
						} else if (pref.darkblueTheme && pref.lib_design === 'library_modern') {
							sel_x = ui.x; sel_w = ui.w;
							gr.DrawRect(sel_x, item_y, sel_w, ui.row_h, 1, rgb(27, 55, 90));
							gr.FillSolidRect(sel_x, item_y + 1, scaleForDisplay(8), ui.row_h - 1, rgb(255, 202, 128));
						} else if (pref.redTheme && pref.lib_design === 'library_traditional') {
							// Hide
						} else if (pref.redTheme && pref.lib_design === 'library_modern') {
							sel_x = ui.x; sel_w = ui.w;
							gr.DrawRect(sel_x, item_y, sel_w, ui.row_h, 1, rgb(145, 25, 25));
							gr.FillSolidRect(sel_x, item_y + 1, scaleForDisplay(8), ui.row_h - 1, rgb(245, 212, 165));
						} else if (pref.creamTheme && pref.lib_design === 'library_traditional') {
							// Hide
						} else if (pref.creamTheme && pref.lib_design === 'library_modern') {
							sel_x = ui.x; sel_w = ui.w;
							gr.DrawRect(sel_x, item_y, sel_w, ui.row_h, 1, rgb(230, 230, 230));
							gr.FillSolidRect(sel_x, item_y + 1, scaleForDisplay(8), ui.row_h - 1, rgb(120, 170, 130));
						} else if (pref.nblueTheme && pref.lib_design === 'library_traditional' || pref.ngreenTheme && pref.lib_design === 'library_traditional' || pref.nredTheme && pref.lib_design === 'library_traditional' || pref.ngoldTheme && pref.lib_design === 'library_traditional') {
							// Hide
						} else if (pref.nblueTheme && pref.lib_design === 'library_modern' || pref.ngreenTheme && pref.lib_design === 'library_modern' || pref.nredTheme && pref.lib_design === 'library_modern' || pref.ngoldTheme && pref.lib_design === 'library_modern') {
							sel_x = ui.x; sel_w = ui.w;
							gr.DrawRect(sel_x, item_y, sel_w, ui.row_h, 1, rgb(40, 40, 40));
							gr.FillSolidRect(sel_x, item_y + 1, scaleForDisplay(8), ui.row_h - 1, g_pl_colors.artist_playing);
						}
                    }
                }
                if (libraryProps.fullLine) {
                    item_w = ui.x + sbar.tree_w - item_x - (is_4k ? 35 : 17);
                }

                item.w = item_w;
				if (!libraryProps.fullLine && pref.lib_design === 'library_modern') {
					item.w = item_w + scaleForDisplay(50);
				}
                var txt_c = item.sel ? ui.col.textsel : m_i == i ? ui.col.text_h : ui.col.text;
                if (pref.whiteTheme || pref.blackTheme) {
                    if (new Color(bgColor).brightness > 180) {
                        txt_c = m_i == i ? rgb(0,0,0) : rgb(48,48,48);
                    }
                }
                gr.GdiDrawText(nm, ui.font, txt_c, item_x, item_y, ui.x + sbar.tree_w - item_x - ui.sel, ui.row_h, p.lc);
            }
        } catch (e) {}
    }

    const nodeExpandCollapse = (x, y, item, ix) => {
        const expanded = item.child.length > 0 ? 1 : 0;
        let recheckScroll = false;
        switch (expanded) {
            case 0:
                if (libraryProps.autoCollapse) branch_chg(item);
                const row = this.row(y);
                this.branch(item, !libraryProps.rootNode || ix ? false : true, true); if (!ix) p.setHeight(true);
                if (libraryProps.autoCollapse) ix = item.ix;
                if (row + 1 + item.child.length > this.rows) {
                    if (item.child.length > (this.rows - 2)) sbar.check_scroll(ix * ui.row_h);
                    else sbar.check_scroll(Math.min(ix * ui.row_h,(ix + 1 - sbar.rows_drawn + item.child.length) * ui.row_h));
                } break;
            case 1:
                const childLength = item.child.length;
                this.clear_child(item);
                if (!ix && this.tree.length == 1) p.setHeight(false);
                if (childLength + this.tree.length > this.rows && this.tree.length < this.rows) {
                    recheckScroll = true;
                }
                break;
        }
        if (sbar.scroll >= ix * ui.row_h || recheckScroll) sbar.check_scroll(ix * ui.row_h); checkRow(x, y);
    }

    const send = (item, x, y) => {
        if (!this.check_ix(item, x, y, false)) return;
        if (vk.k('ctrl')) this.load(this.sel_items, true, false, false, this.gen_pl, false);
        else if (vk.k('shift')) this.load(this.sel_items, true, false, false, this.gen_pl, false);
        else this.load(/* range(item.item) */item.item, true, false, this.autoPlay.click, this.gen_pl, false);
    }

    const track = (item, x, y) => {
        if (!this.check_ix(item, x, y, false)) return;
        if (vk.k('ctrl')) tracking(this.sel_items);
        else if (vk.k('shift')) tracking(this.sel_items);
        else tracking(item.item);
    }

    this.lbtn_dn = (x, y) => {
        lbtn_dn = false;
        dbl_clicked = false;
        if (y < p.s_h) return;
        var ix = this.get_ix(x, y, true, false);
        p.pos = ix;
        if (ix >= this.tree.length || ix < 0)
            return get_selection(-1);
        // var item = this.tree[ix],
        //     clickedOn = x < Math.round(ui.pad * item.tr) + ui.icon_w + ui.margin + ui.x ? ObjType.Node : this.check_ix(item, x, y, false) ? ObjType.Item : ObjType.NoObj,
        //     expanded = item.child.length > 0;
        // switch (clickedOn) {
        const item = this.tree[ix];
        clicked_on = clickedOn(x, y, item);
        switch (clicked_on) {
            case ObjType.Node:
                // if (expanded) {
                //     this.clear_child(item);
                //     // if (!ix && this.tree.length == 1) {
                //     // 	p.setHeight(false);
                //     // }
                // } else {
                //     if (libraryProps.autoCollapse)
                //         this.branch_chg(item, false, true);
                //     var row = this.row(y);
                //     this.branch(item, !libraryProps.rootNode || ix ? false : true, true);
                //     // if (!ix) p.setHeight(true);
                //     if (libraryProps.autoCollapse)
                //         ix = item.ix
                //     if (row + 1 + item.child.length > sbar.rows_drawn) {
                //         if (item.child.length > (sbar.rows_drawn - 2)) {
                //             sbar.check_scroll(ix * ui.row_h);
                //         } else {
                //             sbar.check_scroll(Math.min(ix * ui.row_h, (ix + 1 - sbar.rows_drawn + item.child.length) * ui.row_h));
                //         }
                //     }
                // }
                // if (sbar.scroll > ix * ui.row_h)
                //     sbar.check_scroll(ix * ui.row_h);
                // this.check_row(x, y);
                nodeExpandCollapse(x, y, item, ix);
                lib_manager.treeState(false, libraryProps.rememberTree);
                break;
            case ObjType.Item:
                // only use for this code is drag/drop which doesn't work in Georgia-ReBORN since there's no place to drop to
                // last_pressed_coord.x = x - ui.x;
                // last_pressed_coord.y = y - ui.y;
                // lbtn_dn = true;
                // if (vk.k('alt') && libraryProps.autoFill) return;
                // if (!item.sel && !vk.k('ctrl')) get_selection(ix, item.sel);

                // allows drag/selection
                if (vk.k('alt') && this.autoFill.mouse) return;
                if (vk.k('shift')) get_selection(ix, item.sel);
                break;
        }
    }

    this.lbtn_up = (x, y) => {
        last_pressed_coord = {x: undefined, y: undefined};
        lbtn_dn = false;
        if (y < p.s_h || x < ui.x || dbl_clicked || but.Dn) return;
        const ix = this.get_ix(x, y, true, false);
        p.pos = ix;
        if (ix >= this.tree.length || ix < 0) return;
        // if (ppt.touchControl && (this.autoFill.mouse || this.autoPlay.click) && ui.touch_dn_id != ix) return;
        const item = this.tree[ix];
        if (clicked_on != ObjType.Item) return;
        if (vk.k('alt')) {
            return this.add(x, y, alt_lbtn_pl);
        }
        if (!vk.k('ctrl')) {
            this.clear();	// clear selected items unless ctrl key is down
            if (!item.sel) get_selection(ix, item.sel);
        } else {
            get_selection(ix, item.sel);
        }
        if (this.autoFill.mouse || this.autoPlay.click) {
            window.Repaint(true);
            send(item, x, y);
        } else {
            p.tree_paint();
            track(item, x, y);
        }
        lib_manager.treeState(false, libraryProps.rememberTree);
    }

    this.dragDrop = function(x, y) {
        x -= ui.x; y -= ui.y;  // Mordred: fix mouse offsets
        if (!lbtn_dn) return;
        if (Math.sqrt((Math.pow(last_pressed_coord.x - x, 2) + Math.pow(last_pressed_coord.y - y, 2))) > 7) {
            last_pressed_coord = {x: undefined, y: undefined}
            const handle_list = this.selected();
            fb.DoDragDrop(window.ID, handle_list, handle_list.Count ? 0|1 : 0);
            lbtn_dn = false;
        }
    }

    this.lbtn_dblclk = function(x, y) {
        if (this.autoPlay.click > 2) return;    // already handled in click
        dbl_clicked = true;
        if (y < p.s_h) return;
        let ix = this.get_ix(x, y, true, false);
        if (ix >= this.tree.length || ix < 0) return;
        const item = this.tree[ix];

        // if (!libraryProps.autoFill) this.send(item, x, y);
        // if (!this.check_ix(item, x, y, false) || libraryProps.dblClickAction == 2) return;
        // var mp = 1;
        // if (!libraryProps.dblClickAction) {
        //     if (item.child.length) mp = 0;
        //     switch (mp) {
        //         case 0:
        //             this.clear_child(item);
        //             // if (!ix && this.tree.length == 1) p.setHeight(false);
        //             break;
        //         case 1:
        //             if (libraryProps.autoCollapse) branch_chg(item);
        //             // if (!ix) p.setHeight(true);
        //             var row = this.row(y);
        //             this.branch(item, !libraryProps.rootNode || ix ? false : true, true);
        //             if (libraryProps.autoCollapse) ix = item.ix
        //             if (row + 1 + item.child.length > sbar.rows_drawn) {
        //                 if (item.child.length > (sbar.rows_drawn - 2)) sbar.check_scroll(ix * ui.row_h);
        //                 else sbar.check_scroll(Math.min(ix * ui.row_h,(ix + 1 - sbar.rows_drawn + item.child.length) * ui.row_h));
        //             }
        //             break;
        //     }
        //     if (sbar.scroll > ix * ui.row_h) sbar.check_scroll(ix * ui.row_h);
        //     lib_manager.treeState(false, libraryProps.rememberTree);
        // }
        switch (clicked_on) {
            case ObjType.Node: nodeExpandCollapse(x, y, item, ix); break;
            case ObjType.Item:
                if (!this.check_ix(item, x, y, false)) return;
                if (libraryProps.dblClickAction == 2 && !this.autoFill.mouse && !this.autoPlay.click) return send(item, x, y);
                if (!libraryProps.dblClickAction && !item.track) {nodeExpandCollapse(x, y, item, ix); lib_manager.treeState(false, libraryProps.rememberTree);}
                if (libraryProps.dblClickAction == 2 || this.autoPlay.click == 2) return;
                if (libraryProps.dblClickAction || !libraryProps.dblClickAction && !item.child.length) {
                    if (!this.autoFill.mouse) send(item, x, y);
                    var playlistIndex = plman.FindOrCreatePlaylist(libraryProps.libPlaylistName, false);
                    if (!this.gen_pl)
                        playlistIndex = plman.ActivePlaylist;
                    plman.ActivePlaylist = playlistIndex;
                    var itemIndex = 0;
                    if (plman.PlaybackOrder === PlaybackOrder.Random || plman.PlaybackOrder === PlaybackOrder.ShuffleTracks) {
                        itemIndex = Math.ceil(plman.PlaylistItemCount(playlistIndex) * Math.random() - 1);
                    }
                    library_tree.load(library_tree.sel_items, true, false, true, false, false); // replace current playlist
                    plman.ExecutePlaylistDefaultAction(playlistIndex, itemIndex);
                }
                break;
        }
    }

    const get_selection = (idx, state, add, bypass) => {
        const sel_type = idx == -1 && !add ? 0 : vk.k('shift') && last_sel > -1 && !bypass ? 1 : vk.k('ctrl') && !bypass ? 2 : !state ? 3 : 0;
        switch (sel_type) {
            case 0: this.clear(); this.sel_items = []; break;
            case 1: const direction = (idx > last_sel) ? 1 : -1; if (!vk.k('ctrl')) this.clear(); for (let i = last_sel; ; i += direction) {this.tree[i].sel = true; if (i == idx) break;} this.get_sel_items(); p.tree_paint(); break;
            case 2: this.tree[idx].sel = !this.tree[idx].sel; this.get_sel_items(); last_sel = idx; break;
            case 3:
                this.sel_items = [];
                if (!add) this.clear();
                if (!add) this.tree[idx].sel = true;
                this.sel_items.push.apply(this.sel_items, this.tree[idx].item); this.sel_items = uniq(this.sel_items); last_sel = idx;
                break;
        }
    }

    this.move = function(x, y) {
        if (but.Dn) return;
        var ix = this.get_ix(x, y, false, false);
        get_pos = checkRow(x, y);
        m_i = -1;
        if (ix !== -1) {
            m_i = ix;
            if (libraryProps.tooltips)
                this.Activate_tooltip(ix, y);
        }
        if (m_i == ix_o && m_br == row_o) return;
        tt_id = -1;
        if (libraryProps.tooltips && tt.Text) this.deActivate_tooltip();
        if (!sbar.draw_timer) p.tree_paint();
        ix_o = m_i;
        row_o = m_br;
    }

    this.get_ix = function(x, y, simple, type) {
        var ix;
        y -= ui.y; // Mordred: fix row indexing?
        //x -= ui.x;
        if (pref.lib_design === 'library_traditional') { x -= ui.x; } else if (pref.lib_design === 'library_modern') { x -= ui.x - (ui.margin + ui.icon_w); }
        if (y > p.s_h && y < p.s_h + p.sp) {
            ix = this.row(y + sbar.delta);
        } else {
            ix = -1;
        }
        if (simple) return ix;
        if (this.tree.length > ix && ix >= 0 && x < sbar.tree_w && y > p.s_h && y < p.s_h + p.sp && this.check_ix(this.tree[ix], x + ui.x, y + ui.y, type)) return ix;
        else return -1;
    }

    this.check_ix = function(br, x, y, type, print) {
        if (!br) return false;
        x -= ui.x;  // Mordred: fix row indexing?
        return type ? (x >= Math.round(ui.pad * br.tr + ui.margin) && x < Math.round(ui.pad * br.tr + ui.margin) + br.w + ui.icon_w)
            : (x >= Math.round(ui.pad * br.tr + ui.margin) + ui.icon_w) && x < Math.min(Math.round(ui.pad * br.tr + ui.margin) + ui.icon_w + br.w, sbar.tree_w);
    }

    this.on_key_down = vkey => {
        if (p.search) return;
        if (vk.k('enter')) {
            if (!this.sel_items.length) return;
            switch (true) {
               case vk.k('shift'): return this.load(this.sel_items, true, true, false, false, false);
               case vk.k('ctrl'): return this.load(this.sel_items, true, true, false, false, true);
               default: return this.load(this.sel_items, true, false, this.autoPlay.send, false, false);
            }
        }
        let item = {}, row = -1;
        switch(vkey) {
            case vk.left:
                if (!(p.pos >= 0) && get_pos != -1) p.pos = get_pos;
                else p.pos = p.pos + this.tree.length % this.tree.length;
                p.pos = s.clamp(p.pos, 0, this.tree.length - 1); get_pos = -1; m_i = -1;
                if ((this.tree[p.pos].tr == (libraryProps.rootNode ? 1 : 0)) && this.tree[p.pos].child.length < 1) break;
                if (this.tree[p.pos].child.length > 0) {item = this.tree[p.pos]; this.clear_child(item); get_selection(item.ix); m_i = p.pos = item.ix;}
                else {item = this.tree[this.tree[p.pos].par]; this.clear_child(item); get_selection(item.ix); m_i = p.pos = item.ix;}
                p.tree_paint();
                if (this.autoFill.key) this.load(this.sel_items, true, false, false, this.gen_pl /*ppt.sendPlaylist*/, false);
                sbar.set_rows(this.tree.length);
                if (sbar.scroll > p.pos * ui.row_h) sbar.check_scroll(p.pos * ui.row_h);
                else sbar.scroll_round();
                lib_manager.treeState(false, libraryProps.rememberTree);
                break;
            case vk.right:
                if (!(p.pos >= 0) && get_pos != -1) p.pos = get_pos;
                else p.pos = p.pos + this.tree.length % this.tree.length;
                p.pos = s.clamp(p.pos, 0, this.tree.length - 1); get_pos = -1; m_i = -1;
                item = this.tree[p.pos]; if (libraryProps.autoCollapse) branch_chg(item);
                this.branch(item, libraryProps.rootNode && p.pos == 0 ? true : false, true);
                get_selection(item.ix); p.tree_paint(); m_i = p.pos = item.ix;
                if (this.autoFill.key) this.load(this.sel_items, true, false, false, this.gen_pl /*ppt.sendPlaylist*/, false);
                sbar.set_rows(this.tree.length);
                row = (p.pos * ui.row_h - sbar.scroll) / ui.row_h;
                if (row + 1 + item.child.length > sbar.rows_drawn) {
                    if (item.child.length > (sbar.rows_drawn - 2)) sbar.check_scroll(p.pos * ui.row_h);
                    else sbar.check_scroll(Math.min(p.pos * ui.row_h, (p.pos + 1 - sbar.rows_drawn + item.child.length) * ui.row_h));
                } else sbar.scroll_round();
                lib_manager.treeState(false, libraryProps.rememberTree);
                break;
            case vk.pgUp: if (this.tree.length == 0) break; p.pos = Math.max(Math.round(sbar.scroll / ui.row_h + 0.4) - Math.floor(p.rows) + 1, !libraryProps.rootNode ? 0 : 1); sbar.page_throttle(1); get_selection(this.tree[p.pos].ix); p.tree_paint(); if (this.autoFill.key) this.load(this.sel_items, true, false, false, this.gen_pl /*ppt.sendPlaylist*/, false); lib_manager.treeState(false, libraryProps.rememberTree); break;
            case vk.pgDn: if (this.tree.length == 0) break; p.pos = Math.round(sbar.scroll / ui.row_h + 0.4); p.pos = p.pos + Math.floor(p.rows) * 2 - 2; p.pos = this.tree.length < p.pos ? this.tree.length - 1 : p.pos; sbar.page_throttle(-1); get_selection(this.tree[p.pos].ix); p.tree_paint(); if (this.autoFill.key) this.load(this.sel_items, true, false, false, this.gen_pl /*ppt.sendPlaylist*/, false); lib_manager.treeState(false, libraryProps.rememberTree); break;
            case vk.pgDn: if (this.tree.length == 0) break; p.pos = Math.min(Math.round(sbar.scroll / ui.row_h + 0.4) + Math.floor(p.rows) * 2 - 2, this.tree.length - 1); sbar.page_throttle(-1); get_selection(this.tree[p.pos].ix); p.tree_paint(); if (this.autoFill.key) this.load(this.sel_items, true, false, false, this.gen_pl /*ppt.sendPlaylist*/, false); lib_manager.treeState(false, libraryProps.rememberTree); break;
            case vk.home: if (this.tree.length == 0) break; p.pos = !libraryProps.rootNode ? 0 : 1; sbar.check_scroll(0); get_selection(this.tree[p.pos].ix); p.tree_paint(); if (this.autoFill.key) this.load(this.sel_items, true, false, false, this.gen_pl /*ppt.sendPlaylist*/, false); lib_manager.treeState(false, libraryProps.rememberTree); break;
            case vk.end: if (this.tree.length == 0) break; p.pos = this.tree.length - 1; sbar.check_scroll((this.tree.length) * ui.row_h); get_selection(this.tree[p.pos].ix); p.tree_paint(); if (this.autoFill.key) this.load(this.sel_items, true, false, false, this.gen_pl /*ppt.sendPlaylist*/, false); lib_manager.treeState(false, libraryProps.rememberTree); break;
            case vk.enter: if (!this.sel_items.length) return; this.load(this.sel_items, true, false, true, this.gen_pl, false); break;
            case vk.dn: case vk.up:
                if (this.tree.length == 0) break;
                if ((p.pos == 0 && get_pos == -1 && vkey == vk.up) || (p.pos == this.tree.length - 1 && vkey == vk.dn)) {get_selection(-1); break;}
                if (get_pos != -1) p.pos = get_pos;
                else p.pos = p.pos + this.tree.length % this.tree.length;
                get_pos = -1; m_i = -1; if (vkey == vk.dn) p.pos++; if (vkey == vk.up) p.pos--;
                p.pos = s.clamp(p.pos, !libraryProps.rootNode ? 0 : 1, this.tree.length - 1);
                row = (p.pos * ui.row_h - sbar.scroll) / ui.row_h;
                if (sbar.rows_drawn - row < 3) sbar.check_scroll((p.pos + 3) * ui.row_h - sbar.rows_drawn * ui.row_h);
                else if (row < 2 && vkey == vk.up) sbar.check_scroll((p.pos - 1) * ui.row_h);
                m_i = p.pos; get_selection(p.pos); p.tree_paint();
                if (this.autoFill.key) this.load(this.sel_items, true, false, false, this.gen_pl /*ppt.sendPlaylist*/, false);
                lib_manager.treeState(false, libraryProps.rememberTree);
                break;
        }
    }

}
// var library_tree = new LibraryTree();

function searchLibrary() {
    // p.s_x and p.s_y are already adjusted for start position
    var cx = 0,
        selEnd = 0,
        selStart = 0,
        i = 0,
        lbtn_dn = false,
        lg = [],
        log = [],
        offsetChars = 0,	// the number of characters to skip when drawing search string (due to not enough room for entire string)
        shift = false,
        shift_x = 0,
        txt_w = 0,
        cursor_width = scaleForDisplay(1);
    const calc_text = () => {s.gr(1, 1, false, g => txt_w = g.CalcTextWidth(p.s_txt.substr(offsetChars), ui.font));}
    var drawcursor = (gr) => {
        if (p.search && p.s_cursor && selStart == selEnd && cx >= offsetChars) {
            var x1 = p.s_x + get_cursor_x(cx);
            gr.DrawLine(x1, p.s_y + p.s_sp * 0.1, x1, p.s_y + p.s_sp * 0.85, cursor_width, ui.col.text);
        }
    }
    /**
     * Draws selection background
     * @param {GdiGraphics} gr
     * @return {number} bgColor drawn
     */
    const drawsel = gr => {
        if (selStart == selEnd) return;
        const cursor_y = Math.round(p.s_sp / 2 + ui.y);
        const clamp = p.s_x + p.s_w2;
        const selcol = col.primary;
        gr.DrawLine(Math.min(p.s_x + get_cursor_x(selStart), clamp), cursor_y, Math.min(p.s_x + get_cursor_x(selEnd), clamp), cursor_y, ui.row_h - 3, selcol);
        return selcol;
    }
    const get_cursor_pos = x => {s.gr(1, 1, false, g => {const nx = x - p.s_x; let pos = 0; for (i = offsetChars; i < p.s_txt.length; i++) {pos += g.CalcTextWidth(p.s_txt.substr(i, 1), ui.font); if (pos >= nx + 3) break;}}); return i;}
    const get_cursor_x = pos => {
        let x = 0;
        s.gr(1, 1, false, g => {
            if (pos >= offsetChars) x = g.CalcTextWidth(p.s_txt.substr(offsetChars, pos - offsetChars), ui.font);
        });
        return x;
    }
    const get_offset = gr => {
        let t = gr.CalcTextWidth(p.s_txt.substr(offsetChars, cx - offsetChars), ui.font);
        let j = 0;
        while (t >= p.s_w2 && j < 499) {
            j++; offsetChars++;
            t = gr.CalcTextWidth(p.s_txt.substr(offsetChars, cx - offsetChars), ui.font);
        }
    }
    const record = () => {lg.push(p.s_txt); log = []; if (lg.length > 30) lg.shift();}

    this.clear = () => {
        lib_manager.time.Reset(); library_tree.subCounts.search = {}; offsetChars = selStart = selEnd = cx = 0; p.s_cursor = false; p.search = false; p.s_txt = "";
        but.set_search_btns_hide();
        p.search_paint(); timer.reset(timer.search_cursor); lib_manager.rootNodes();
        // library_tree.checkAutoHeight();
    }
    this.on_key_up = vkey => {if (!p.search) return; if (vkey == vk.shift) {shift = false; shift_x = cx;}}
    this.lbtn_up = (x, y) => {if (selStart != selEnd) timer.reset(timer.search_cursor); lbtn_dn = false;}
    this.move = (x, y) => {if (y > p.s_h || !lbtn_dn) return; const t = get_cursor_pos(x), t_x = get_cursor_x(t); let l; calc_text(); if (t < selStart) {if (t < selEnd) {if (t_x < p.s_x) if (offsetChars > 0) offsetChars--;} else if (t > selEnd) {if (t_x + p.s_x > p.s_x + p.s_w2) {l = (txt_w > p.s_w2) ? txt_w - p.s_w2 : 0; if (l > 0) offsetChars++;}} selEnd = t;} else if (t > selStart) {if (t_x + p.s_x > p.s_x + p.s_w2) {l = (txt_w > p.s_w2) ? txt_w - p.s_w2 : 0; if (l > 0) offsetChars++;} selEnd = t;} cx = t; p.search_paint();}
    this.rbtn_up = (x, y) => {men.search_menu(x, y, selStart, selEnd, doc.parentWindow.clipboardData.getData('text') ? true : false);}

    this.lbtn_dn = (x, y) => {
        p.search_paint();
        lbtn_dn = p.search = (y < p.s_y + p.s_h && x >= p.s_x && x < p.s_x + p.s_w2);
        if (!lbtn_dn) {
            offsetChars = selStart = selEnd = cx = 0;
            timer.clear(timer.search_cursor);
            return;
        } else {
            if (shift) {
                selStart = cx; selEnd = cx = get_cursor_pos(x);
            } else {
                cx = get_cursor_pos(x);
                selStart = selEnd = cx;
            }
            timer.clear(timer.search_cursor);
            p.s_cursor = true;
            timer.search_cursor.id = setInterval(() => {p.s_cursor = !p.s_cursor; p.search_paint();}, 530);
        }
        p.search_paint();
    }

    this.on_mouse_lbtn_dblclk = function(x, y, m) {
        if (y < p.s_y + p.s_h && x >= p.s_x && x < p.s_x + p.s_w2) {
            this.on_char(vk.selAll, true);
            p.search_paint();
        }
    }

    this.searchFocus = () => {
        p.search_paint();
        p.search = true;
        shift = false;
        selStart = selEnd = cx = p.s_x;
        timer.clear(timer.search_cursor);
        p.s_cursor = true;
        timer.search_cursor.id = setInterval(() => {p.s_cursor = !p.s_cursor; p.search_paint();}, 530);
        p.search_paint();
    }

    this.on_char = (code, force) => {
        let done = false;
        let text = String.fromCharCode(code);
        if (force) p.search = true;
        if (!p.search) return;
        p.s_cursor = false;
        p.pos = -1;
        switch (code) {
            case vk.enter: if (libraryProps.searchEnter || libraryProps.searchSend == 1) {lib_manager.upd_search = true; lib_manager.time.Reset(); library_tree.subCounts.search = {}; lib_manager.treeState(false, libraryProps.rememberTree); lib_manager.rootNodes(); p.setHeight(true); lib_manager.search.cancel(); done = true;} if (libraryProps.searchSend == 1) library_tree.load(p.list, false, false, library_tree.autoPlay.send, library_tree.gen_pl, false); break;
            case vk.escape: this.clear(); return;
            case vk.redo: lg.push(p.s_txt); if (lg.length > 30) lg.shift(); if (log.length > 0) {p.s_txt = log.pop() + ""; cx++} break;
            case vk.undo: log.push(p.s_txt); if (log.length > 30) lg.shift(); if (lg.length > 0) p.s_txt = lg.pop() + ""; break;
            case vk.selAll:
                selStart = 0; selEnd = p.s_txt.length;
                break;
            case vk.copy: if (selStart != selEnd) doc.parentWindow.clipboardData.setData('text', p.s_txt.substring(selStart, selEnd)); break; case vk.cut: if (selStart != selEnd) doc.parentWindow.clipboardData.setData('text', p.s_txt.substring(selStart, selEnd));
            case vk.back:
                record();
                if (selStart == selEnd) {if (cx > 0) {p.s_txt = p.s_txt.substr(0, cx - 1) + p.s_txt.substr(cx, p.s_txt.length - cx); if (offsetChars > 0) offsetChars--; cx--;}}
                else {if (selEnd - selStart == p.s_txt.length) {p.s_txt = ""; cx = 0;} else {if (selStart > 0) {var st = selStart, en = selEnd; selStart = Math.min(st, en); selEnd = Math.max(st, en); p.s_txt = p.s_txt.substring(0, selStart) + p.s_txt.substring(selEnd, p.s_txt.length); cx = selStart;} else {p.s_txt = p.s_txt.substring(selEnd, p.s_txt.length); cx = selStart;}}}
                calc_text(); offsetChars = offsetChars >= selEnd - selStart ? offsetChars - selEnd + selStart : 0; selStart = cx; selEnd = selStart; break;
            case "delete":
                record();
                if (selStart == selEnd) {if (cx < p.s_txt.length) {p.s_txt = p.s_txt.substr(0, cx) + p.s_txt.substr(cx + 1, p.s_txt.length - cx - 1);}}
                else {if (selEnd - selStart == p.s_txt.length) {p.s_txt = ""; cx = 0;} else {if (selStart > 0) {var st = selStart, en = selEnd; selStart = Math.min(st, en); selEnd = Math.max(st, en); p.s_txt = p.s_txt.substring(0, selStart) + p.s_txt.substring(selEnd, p.s_txt.length); cx = selStart;} else {p.s_txt = p.s_txt.substring(selEnd, p.s_txt.length); cx = selStart;}}}
                calc_text(); offsetChars = offsetChars >= selEnd - selStart ? offsetChars - selEnd + selStart : 0; selStart = cx; selEnd = selStart; break;
            case vk.paste:
                text = doc.parentWindow.clipboardData.getData('text');
                // fall through
            default:
                record();
                if (selStart == selEnd) {
                    p.s_txt = p.s_txt.substring(0, cx) + text + p.s_txt.substring(cx); cx += text.length; selEnd = selStart = cx;
                }
                else if (selEnd > selStart) {
                    p.s_txt = p.s_txt.substring(0, selStart) + text + p.s_txt.substring(selEnd); calc_text(); offsetChars = offsetChars >= selEnd - selStart ? offsetChars - selEnd + selStart : 0; cx = selStart + text.length;
                    selStart = cx; selEnd = selStart;
                }
                else {
                    p.s_txt = p.s_txt.substring(selStart) + text + p.s_txt.substring(0, selEnd); calc_text(); offsetChars = offsetChars < selEnd - selStart ? offsetChars - selEnd + selStart : 0; cx = selEnd + text.length;
                    selStart = cx; selEnd = selStart;
                }
                break;
        }
        if (code == vk.copy || code == vk.selAll) return;
        if (!timer.search_cursor) timer.search_cursor.id = setInterval(() => {p.s_cursor = !p.s_cursor; p.search_paint();}, 530);
        but.set_search_btns_hide(); p.search_paint();
        // lib_manager.upd_search = true; timer.clear(timer.search);
        // timer.search.id = setTimeout(() => {
        //     lib_manager.time.Reset(); library_tree.subCounts.search = {}; lib_manager.treeState(false, libraryProps.rememberTree); lib_manager.rootNodes();
        //     // p.setHeight(true);
        // }, 160);
        if (libraryProps.searchEnter || done) return;
        if ((libraryProps.searchSend == 2 || lib_manager.list.Count > 200000) && p.s_txt && p.s_txt.length < 4) {lib_manager.upd_search = true; lib_manager.search500();}
        else {lib_manager.search500.cancel(); lib_manager.upd_search = true; lib_manager.search();}
    }

    this.on_key_down = function(vkey) {
        if (!p.search) return;
        switch(vkey) {
            case vk.left:
            case vk.right:
                if (vkey == vk.left) {
                    if (offsetChars > 0) {
                        if (cx <= offsetChars) {
                            offsetChars--; cx--;
                        } else {
                            cx--;
                        }
                    } else if (cx > 0) {
                        cx--;
                    }
                    selStart = selEnd = cx;
                }
                if (vkey == vk.right && cx < p.s_txt.length)
                    cx++;
                selStart = selEnd = cx;
                if (shift) {
                    selStart = Math.min(cx, shift_x);
                    selEnd = Math.max(cx, shift_x);
                }
                p.s_cursor = true;
                timer.clear(timer.search_cursor);
                timer.search_cursor.id = setInterval(() => {p.s_cursor = !p.s_cursor; p.search_paint();}, 530);
                break;
            case vk.home:
            case vk.end:
                if (vkey == vk.home) {
                    offsetChars = selStart = cx = 0;
                    if (!shift) {
                        selEnd = 0;
                    }
                } else {
                    selEnd = cx = p.s_txt.length;
                    if (!shift) {
                        selStart = p.s_txt.length;
                    }
                }
                p.s_cursor = true;
                timer.clear(timer.search_cursor);
                timer.search_cursor.id = setInterval(() => {p.s_cursor = !p.s_cursor; p.search_paint();}, 530);
                break;
            case vk.shift:
                shift = true;
                shift_x = cx;
                break;
            case vk.del:
                this.on_char("delete");
                break;
        }
        p.search_paint();
    }

    this.draw = function(gr) {
        try {
            selStart = Math.min(Math.max(selStart, 0), p.s_txt.length);
            selEnd = Math.min(Math.max(selEnd, 0), p.s_txt.length);
            cx = Math.min(Math.max(cx, 0), p.s_txt.length);
            // divider line
            gr.DrawLine(ui.x + ui.margin, ui.y + p.s_sp, ui.x + p.s_w1 - (is_4k ? 0 : 1), ui.y + p.s_sp, ui.l_width, ui.s_linecol);
            if (p.s_txt) {  // has search text
                const selColor = drawsel(gr);
                get_offset(gr);
                var txt_col = ui.col.search;
                if (selStart !== selEnd) {
                    let selectedTextCol = rgb(230,230,230);
                    if (new Color(selColor).brightness > 180) {
                        selectedTextCol = rgb(0,0,0);
                    }
                    if (selStart === 0 && selEnd === p.s_txt.length) {
                        gr.GdiDrawText(p.s_txt.substr(offsetChars), ui.font, selectedTextCol, p.s_x, p.s_y, p.s_w2, p.s_sp, p.l);
                    } else {
                        // unselected text
                        gr.GdiDrawText(p.s_txt.substr(offsetChars), ui.font, txt_col, p.s_x, p.s_y, p.s_w2, p.s_sp, p.l);
                        const selectedText = p.s_txt.substr(offsetChars).substr(selStart - offsetChars, selEnd - selStart);
                        drawsel(gr);
                        // selected text
                        gr.GdiDrawText(selectedText, ui.font, selectedTextCol, p.s_x + get_cursor_x(selStart), p.s_y, p.s_x + get_cursor_x(selEnd), p.s_sp, p.l);
                    }
                } else {
                    // don't need to adjust colors
                    gr.GdiDrawText(p.s_txt.substr(offsetChars), ui.font, txt_col, p.s_x, p.s_y, p.s_w2, p.s_sp, p.l);
                }
            } else {
                gr.GdiDrawText('Search', ui.searchFont, ui.col.search, p.s_x + scaleForDisplay(2), p.s_y, p.s_w2, p.s_sp, p.l);
            }
            drawcursor(gr);
            if (libraryProps.searchMode > 1) {
                var l_x = p.filter_x1 - 25 - ui.l_width,
                    l_y = p.s_y;
                gr.GdiDrawText(p.filt[libraryProps.filterBy].name, p.filterFont, ui.col.filter, p.filter_x1 + (is_4k ? libraryProps.baseFontSize * 1.21 : libraryProps.baseFontSize * 0.70), ui.y, p.f_w[libraryProps.filterBy], p.s_sp, p.cc);
                //gr.FillSolidRect(l_x, l_y, ui.l_width, p.s_sp, ui.s_linecol);
            }
        } catch (e) {
            console.log('<Error: Library could not be properly drawn>');
        }
    }
}

function JumpSearch() {
    // this is the quick-type search
    var j_x = 5, j_h = 30, j_y = 5, jSearch = "", jump_search = true, rs1 = 5, rs2 = 4;
    this.on_size = function() {
        j_x = Math.round(ui.x + ui.w / 2);
        j_h = Math.round(ui.row_h * 1.5);
        j_y = Math.round(ui.y + (ui.h - j_h) / 2);
        rs1 = Math.min(5, j_h / 2);
        rs2 = Math.min(4, (j_h - 2) / 2);
    }

    this.on_char = function(code) {
        if (utils.IsKeyPressed(0x09) || utils.IsKeyPressed(0x11) || utils.IsKeyPressed(0x1B)) return;
        var text = String.fromCharCode(code);
        if (!p.search) {
            var found = false, i = 0, pos = -1;
            switch(code) {
                case vk.back: jSearch = jSearch.substr(0, jSearch.length - 1); break;
                case vk.enter: jSearch = ""; return;
                default: jSearch += text; break;
            }
            library_tree.clear();
            if (!jSearch)
                return;
            library_tree.sel_items = []; jump_search = true;
            window.RepaintRect(ui.x, j_y, ui.w, j_h + 1);
            timer.reset(timer.jsearch);
            timer.jsearch = setTimeout(function () {
                for (i = 0; i < library_tree.tree.length; i++) {
                    if (/*library_tree.tree[i].name != p.baseName &&*/ library_tree.tree[i].name.substring(0, jSearch.length).toLowerCase() == jSearch.toLowerCase()) {
                        found = true;
                        pos = i;
                        library_tree.tree[i].sel = true;
                        p.pos = pos;
                        library_tree.setGetPos(pos);
                        if (library_tree.autoFill.key)
                            library_tree.get_sel_items();
                        lib_manager.treeState(false, libraryProps.rememberTree);
                        break;
                    }
                }
                if (!found) jump_search = false;
                p.tree_paint();
                sbar.check_scroll((pos - 5) * ui.row_h);
                timer.jsearch = false;
            }, 500);

            timer.reset(timer.clear_jsearch);
            timer.clear_jsearch = setTimeout(function () {
                if (found && library_tree.autoFill.key)
                    library_tree.load(library_tree.sel_items, true, false, false, library_tree.gen_pl, false);
                jSearch = "";
                window.RepaintRect(ui.x, j_y, ui.w, j_h + 1);
                timer.clear_jsearch = false;
            }, 1200);
        }
    }

    this.draw = function(gr) {
        if (jSearch) {try {
            gr.SetSmoothingMode(SmoothingMode.AntiAlias);
            var j_w = gr.CalcTextWidth(jSearch,ui.j_font) + 25;
            gr.FillRoundRect(j_x - j_w / 2, j_y, j_w, j_h, rs1, rs1, 0x96000000);
            gr.DrawRoundRect(j_x - j_w / 2, j_y, j_w, j_h, rs1, rs1, 1, 0x64000000);
            gr.DrawRoundRect(j_x - j_w / 2 + 1, j_y + 1, j_w - 2, j_h - 2, rs2, rs2, 1, 0x28ffffff);
            gr.GdiDrawText(jSearch, ui.j_font, RGB(0, 0, 0), j_x - j_w / 2 + 1, j_y + 1 , j_w, j_h, p.cc);
            gr.GdiDrawText(jSearch, ui.j_font, jump_search ? 0xfffafafa : 0xffff4646, j_x - j_w / 2, j_y, j_w, j_h, p.cc);} catch (e) {}
        }
    }
}
// var jS = new j_Search();

class LibraryPanel {
    constructor() {
        this.x = -1; // not set
        this.y = -1; // not set
        this.w = -1; // not set
        this.h = -1; // not set
    }

    on_paint(gr) {
        ui.draw(gr);
        lib_manager.checkTree();
        if (libraryProps.searchMode) sL.draw(gr);
        library_tree.draw(gr);
        if (libraryProps.showScrollbar) sbar.draw(gr);
        if (libraryProps.searchMode || libraryProps.showScrollbar) but.draw(gr);
        jumpSearch.draw(gr);

		gr.FillSolidRect(this.x, this.y + this.h, this.w, g_properties.row_h * 2, col.bg); // Hide rows that shouldn't be visible
		gr.FillSolidRect(this.x, this.y + this.h - g_properties.row_h, this.w, g_properties.row_h, g_pl_colors.background); // Library Bottom Margin

		if (pref.whiteTheme) {
		gr.FillGradRect(this.x - 1, is_4k ? this.y - scaleForDisplay(17) : this.y - scaleForDisplay(18), this.w + (is_4k ? 35 : 17), is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 24)); // Library's Top Pseudo Shadow Fix
		gr.FillGradRect(is_4k ? this.x - 8 : this.x - 4, this.y - scaleForDisplay(12), is_4k ? 8 : 4, this.h + scaleForDisplay(12), 0, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 24)); // Library's Left Side Pseudo Shadow Fix
		gr.FillGradRect(this.x - 1, is_4k ? this.y + this.h + 1 : this.y + this.h - 1, this.w + (is_4k ? 35 : 17), is_4k ? 10 : 5, 90, RGBtoRGBA(col.shadow, 18), RGBtoRGBA(col.shadow, 0)); // Library's Bottom Pseudo Shadow Fix
		} else if (pref.blackTheme) {
		gr.FillGradRect(this.x - 1, is_4k ? this.y - scaleForDisplay(17) : this.y - scaleForDisplay(18), this.w + (is_4k ? 35 : 17), is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 120)); // Library's Top Pseudo Shadow Fix
		gr.FillGradRect(is_4k ? this.x - 8 : this.x - 4, this.y - scaleForDisplay(12), is_4k ? 8 : 4, this.h + scaleForDisplay(12), 0, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 120)); // Library's Left Side Pseudo Shadow Fix
		gr.FillGradRect(this.x - 1, is_4k ? this.y + this.h + 1 : this.y + this.h - 1, this.w + (is_4k ? 35 : 17), is_4k ? 10 : 5, 90, RGBtoRGBA(col.shadow, 120), RGBtoRGBA(col.shadow, 0)); // Library's Bottom Pseudo Shadow Fix
		} else if (pref.blueTheme) {
		gr.FillGradRect(this.x - 1, is_4k ? this.y - scaleForDisplay(17) : this.y - scaleForDisplay(18), this.w + (is_4k ? 35 : 17), is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 26)); // Library's Top Pseudo Shadow Fix
		gr.FillGradRect(is_4k ? this.x - 8 : this.x - 4, this.y - scaleForDisplay(12), is_4k ? 8 : 4, this.h + scaleForDisplay(12), 0, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 38)); // Library's Left Side Pseudo Shadow Fix
		gr.FillGradRect(this.x - 1, is_4k ? this.y + this.h + 1 : this.y + this.h - 1, this.w + (is_4k ? 35 : 17), is_4k ? 10 : 5, 90, RGBtoRGBA(col.shadow, 26), RGBtoRGBA(col.shadow, 0)); // Library's Bottom Pseudo Shadow Fix
		} else if (pref.darkblueTheme) {
		gr.FillGradRect(this.x - 1, is_4k ? this.y - scaleForDisplay(17) : this.y - scaleForDisplay(18), this.w + (is_4k ? 35 : 17), is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 72)); // Library's Top Pseudo Shadow Fix
		gr.FillGradRect(is_4k ? this.x - 8 : this.x - 4, this.y - scaleForDisplay(12), is_4k ? 8 : 4, this.h + scaleForDisplay(12), 0, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 60)); // Library's Left Side Pseudo Shadow Fix
		gr.FillGradRect(this.x - 1, is_4k ? this.y + this.h + 1 : this.y + this.h - 1, this.w + (is_4k ? 35 : 17), is_4k ? 10 : 5, 90, RGBtoRGBA(col.shadow, 74), RGBtoRGBA(col.shadow, 0)); // Library's Bottom Pseudo Shadow Fix
		} else if (pref.redTheme) {
		gr.FillGradRect(this.x - 1, is_4k ? this.y - scaleForDisplay(17) : this.y - scaleForDisplay(18), this.w + (is_4k ? 35 : 17), is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 72)); // Library's Top Pseudo Shadow Fix
		gr.FillGradRect(is_4k ? this.x - 8 : this.x - 4, this.y - scaleForDisplay(12), is_4k ? 8 : 4, this.h + scaleForDisplay(12), 0, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 64)); // Library's Left Side Pseudo Shadow Fix
		gr.FillGradRect(this.x - 1, is_4k ? this.y + this.h + 1 : this.y + this.h - 1, this.w + (is_4k ? 35 : 17), is_4k ? 10 : 5, 90, RGBtoRGBA(col.shadow, 74), RGBtoRGBA(col.shadow, 0)); // Library's Bottom Pseudo Shadow Fix
		} else if (pref.creamTheme) {
		gr.FillGradRect(this.x - 1, is_4k ? this.y - scaleForDisplay(17) : this.y - scaleForDisplay(18), this.w + (is_4k ? 35 : 17), is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 24)); // Library's Top Pseudo Shadow Fix
		gr.FillGradRect(is_4k ? this.x - 8 : this.x - 4, this.y - scaleForDisplay(12), is_4k ? 8 : 4, this.h + scaleForDisplay(12), 0, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 28)); // Library's Left Side Pseudo Shadow Fix
		gr.FillGradRect(this.x - 1, is_4k ? this.y + this.h + 1 : this.y + this.h - 1, this.w + (is_4k ? 35 : 17), is_4k ? 10 : 5, 90, RGBtoRGBA(col.shadow, 18), RGBtoRGBA(col.shadow, 0)); // Library's Bottom Pseudo Shadow Fix
		} else if (pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme) {
		gr.FillGradRect(this.x - 1, is_4k ? this.y - scaleForDisplay(17) : this.y - scaleForDisplay(17), this.w + (is_4k ? 35 : 17), is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 120)); // Library's Top Pseudo Shadow Fix
		gr.FillGradRect(is_4k ? this.x - 8 : this.x - 4, this.y - scaleForDisplay(12), is_4k ? 8 : 4, this.h + scaleForDisplay(12), 0, RGBtoRGBA(col.shadow, 0), RGBtoRGBA(col.shadow, 120)); // Library's Left Side Pseudo Shadow Fix
		gr.FillGradRect(this.x - 1, is_4k ? this.y + this.h + 1 : this.y + this.h - 1, this.w + (is_4k ? 35 : 17), is_4k ? 10 : 5, 90, RGBtoRGBA(col.shadow, 86), RGBtoRGBA(col.shadow, 0));  // Library's Bottom Pseudo Shadow Fix
		}

    }

    on_size(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
        ui.x = x;
        ui.y = y;
        ui.w = width;
        ui.h = height - g_properties.row_h;
        ui.margin = scaleForDisplay(20);
        if (!ui.w || !ui.h) return;
        ui.get_font();
        p.on_size();
        library_tree.create_tooltip();
        if (libraryProps.searchMode || libraryProps.showScrollbar) but.refresh(true);
        jumpSearch.on_size();
		but.create_images();

		if (pref.autoSbar_Library === true) {
			ui.scr_but_w = 0;
			sbar.w = 0;
			but.refresh(true);
		} else if (pref.autoSbar_Library === false) {
			ui.scr_but_w = scaleForDisplay(17);
			sbar.w = scaleForDisplay(12);
			but.refresh(true);
		}

    }
}

function Buttons() {
    const sbarButPad = s.clamp(pptDefault.sbarButPad / 100, -0.5, 0.3), sAlpha = pptDefault.sbarCol ? [68, 153, 255] : [75, 192, 228], scrBtns = ["scrollUp", "scrollDn"];
    let arrow_symb = '\uE010', b_x, bx, by, bh, byDn, byUp, cur_btn = null, fw, hot_o, i, iconFontName = "Segoe UI Symbol", iconFontStyle = 0, qx, qy, qh, s_img, scrollBtn, scrollBtn_x, scrollDn_y, scrollUp_y, tooltip, transition, tt_start = Date.now() - 2000;
    let scrollBtnStates = {}; //0=normal, 1=hover, 2=down, 3=hot;
    const scrollBtns = {
        lineUp:   {
            ico:  '\uE010',
            stateImgs: {}
        },
        lineDown: {
            ico:  '\uE011',
            stateImgs: {}
        }
    };

    this.btns = {}; this.Dn = false; this.show_tt = true;

    // if (ppt.get(" Scrollbar Arrow Custom", false)) arrow_symb = ppt.arrowSymbol.replace(/\s+/g, "").charAt(); if (!arrow_symb.length) arrow_symb = 0;
    // if (ppt.customCol && ppt.butCustIconFont.length) {
    //     const butCustIconFont = ppt.butCustIconFont.splt(1);
    //     iconFontName = butCustIconFont[0];
    //     iconFontStyle = Math.round(s.value(butCustIconFont[1], 0, 0));
    // }

    const clear = () => {this.Dn = false; Object.values(this.btns).forEach(v => v.down = false);}
    // const tt = (n, force) => {if (tooltip.Text !== n || force) {tooltip.Text = n; tooltip.Activate();}}

    this.create_images = () => {
        const sz = !arrow_symb ? Math.max(Math.round(ui.but_h * 1.666667), 1) : 100,
            sc = sz / 100,
            iconFont = gdi.Font(iconFontName, sz, iconFontStyle);
        s_img = s.gr(100, 100, true, g => {
            g.SetSmoothingMode(2);
            g.DrawLine(69, 71, 88, 90, 12, ui.col.searchBtn);
            g.DrawEllipse(8, 11, 67, 67, 10, ui.col.searchBtn);
            g.FillEllipse(15, 17, 55, 55, ui.col.bg);
            g.SetSmoothingMode(0);
        });
        // scrollBtn = s.gr(sz, sz, true, g => {
        //     g.SetTextRenderingHint(3);
        //     g.SetSmoothingMode(2);

        //     if (pptDefault.sbarCol) {
        //         !arrow_symb ? g.FillPolygon(ui.col.text, 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]) :
        //             g.DrawString(arrow_symb, iconFont, ui.col.text, 0, sz * sbarButPad, sz, sz, StringFormat(1, 1));
        //     } else {
        //         !arrow_symb ? g.FillPolygon(RGBA(ui.col.t, ui.col.t, ui.col.t, 255), 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]) :
        //             g.DrawString(arrow_symb, iconFont, RGBA(ui.col.t, ui.col.t, ui.col.t, 255), 0, 0, sz, sz, StringFormat(1, 2));
        //     }
        //     g.SetSmoothingMode(0);
        // });
       if (pref.whiteTheme) {
            var ico_back_colors =
                [
                    RGB(255, 255, 255),
                    RGB(255, 255, 255),
                    RGB(255, 255, 255),
                    RGB(255, 255, 255)
                ];
            var ico_fore_colors =
                [
                    RGB(120, 120, 120),
                    RGB(0, 0, 0),
                    RGB(0, 0, 0),
                    RGB(120, 120, 120)
                ];
        } else if (pref.blackTheme) {
            var ico_back_colors =
                [
                    RGB(20, 20, 20),
                    RGB(20, 20, 20),
                    RGB(20, 20, 20),
                    RGB(20, 20, 20)
                ];
            var ico_fore_colors =
                [
                    RGB(100, 100, 100),
                    RGB(160, 160, 160),
                    RGB(160, 160, 160),
                    RGB(100, 100, 100)
                ];
        } else if (pref.blueTheme) {
            var ico_back_colors =
                [
                    RGB(10, 115, 200),
                    RGB(10, 115, 200),
                    RGB(10, 115, 200),
                    RGB(10, 115, 200)
                ];
            var ico_fore_colors =
                [
                    RGB(220, 220, 220),
                    RGB(242, 230, 170),
                    RGB(242, 230, 170),
                    RGB(220, 220, 220)
                ];
        } else if (pref.darkblueTheme) {
            var ico_back_colors =
                [
                    RGB(21, 37, 56),
                    RGB(21, 37, 56),
                    RGB(21, 37, 56),
                    RGB(21, 37, 56)
                ];
            var ico_fore_colors =
                [
                    RGB(220, 220, 220),
                    RGB(255, 255, 255),
                    RGB(255, 255, 255),
                    RGB(220, 220, 220)
                ];
        } else if (pref.redTheme) {
            var ico_back_colors =
                [
                    RGB(110, 20, 20),
                    RGB(110, 20, 20),
                    RGB(110, 20, 20),
                    RGB(110, 20, 20)
                ];
            var ico_fore_colors =
                [
                    RGB(220, 220, 220),
                    RGB(255, 255, 255),
                    RGB(255, 255, 255),
                    RGB(220, 220, 220)
                ];
        } else if (pref.creamTheme) {
            var ico_back_colors =
                [
                    RGB(255, 249, 245),
                    RGB(255, 249, 245),
                    RGB(255, 249, 245),
                    RGB(255, 249, 245)
                ];
            var ico_fore_colors =
                [
                    RGB(120, 170, 130),
                    RGB(100, 100, 100),
                    RGB(100, 100, 100),
                    RGB(120, 170, 130)
                ];
        } else if (pref.nblueTheme) {
            var ico_back_colors =
                [
                    RGB(12, 12, 12),
                    RGB(12, 12, 12),
                    RGB(12, 12, 12),
                    RGB(12, 12, 12)
                ];
            var ico_fore_colors =
                [
                    RGB(0, 200, 255),
                    RGB(0, 238, 255),
                    RGB(0, 238, 255),
                    RGB(0, 200, 255)
                ];
        } else if (pref.ngreenTheme) {
            var ico_back_colors =
                [
                    RGB(12, 12, 12),
                    RGB(12, 12, 12),
                    RGB(12, 12, 12),
                    RGB(12, 12, 12)
                ];
            var ico_fore_colors =
                [
                    RGB(0, 200, 0),
                    RGB(0, 255, 0),
                    RGB(0, 255, 0),
                    RGB(0, 200, 0)
                ];
        } else if (pref.nredTheme) {
            var ico_back_colors =
                [
                    RGB(12, 12, 12),
                    RGB(12, 12, 12),
                    RGB(12, 12, 12),
                    RGB(12, 12, 12)
                ];
            var ico_fore_colors =
                [
                    RGB(229, 7, 44),
                    RGB(255, 0, 0),
                    RGB(255, 0, 0),
                    RGB(229, 7, 44)
                ];
        } else if (pref.ngoldTheme) {
            var ico_back_colors =
                [
                    RGB(12, 12, 12),
                    RGB(12, 12, 12),
                    RGB(12, 12, 12),
                    RGB(12, 12, 12)
                ];
            var ico_fore_colors =
                [
                    RGB(254, 204, 3),
                    RGB(255, 242, 3),
                    RGB(255, 242, 3),
                    RGB(254, 204, 3)
                ];
        }
        for (const btnName in scrollBtns) {
            const btn = scrollBtns[btnName];
            const stateImages = [];
            for (let state = 0; state < 4; state++) {
                const img = s.gr(sz, sz, true, g => {
                    g.SetSmoothingMode(SmoothingMode.None);
                    //g.FillSolidRect(0, 0, sz, sz, ico_back_colors[state]);

                    g.SetSmoothingMode(SmoothingMode.HighQuality);
                    g.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

                    g.DrawString(btn.ico, iconFont, ico_fore_colors[state], 0, 0, sz, sz, StringFormat(1, 2));
                })
                stateImages.push(img);
            }
            btn.stateImgs = {
                normal:  stateImages[0],
                hover:   stateImages[1],
                down:    stateImages[2],    // 'pressed' in Control_Scrollbar.js
                hot:     stateImages[3]
            }
        }
    };
    this.create_images();

    this.create_tooltip = () => tooltip = g_tooltip; //window.CreateTooltip("Segoe UI", 15 * s.scale * /* ppt.get(" Zoom Tooltip [Button] (%)", 100)*/ 100 / 100, 0);
    this.create_tooltip();
    this.lbtn_dn = (x, y) => {this.move(x, y); if (!cur_btn || cur_btn.hide) {this.Dn = false; return false} else this.Dn = cur_btn.name; cur_btn.down = true; cur_btn.cs("down"); cur_btn.lbtn_dn(x, y); return true;}
    this.leave = () => {if (cur_btn) {cur_btn.cs("normal"); if (!cur_btn.hide) transition.start();} cur_btn = null;}
    this.on_script_unload = () => tt.stop();
    this.draw = gr => Object.values(this.btns).forEach(v => {if (!v.hide) v.draw(gr);});
    this.reset = () => transition.stop();
    this.set_scroll_btns_hide = (force) => {if (!this.btns || (!pptDefault.sbarShow && !force)) return; scrBtns.forEach((v, i) => {if (this.btns[v]) this.btns[v].hide = sbar.scrollable_lines < 1 || !pptDefault.sbarShow;});}
    this.set_search_btns_hide = () => {
        if (this.btns.s_img) this.btns.s_img.hide = pptDefault.searchShow > 1 && p.s_txt;
        if (this.btns.cross2) this.btns.cross2.hide = !this.btns.s_img.hide;
    }

    const Btn = function(x, y, w, h, type, ft, txt, stat, im, hide, l_dn, l_up, tiptext, hand, name) {
        this.draw = gr => {
            switch (this.type) {
                case 1: case 2: drawScrollBtn(gr); break;
                case 3: ui.theme.SetPartAndStateID(1, im[this.state]); ui.theme.DrawThemeBackground(gr, this.x, this.y, this.w, this.h); break;
                case 4: drawSearch(gr); break;
                case 5: drawCross(gr); break;
                case 6: drawFilter(gr); break;
            }
        }

        let lastState = undefined;  // save last state for hacky button transitions
        this.cs = state => { lastState = this.state; this.state = state; if (state === "down" || state === "normal") tt.stop(); this.repaint(); return true; }
        this.lbtn_dn = () => {if (!but.Dn) return; this.l_dn && this.l_dn(x, y);}
        this.lbtn_up = (x, y) => {if (pptDefault.touchControl && Math.sqrt((Math.pow(p.last_pressed_coord.x - x, 2) + Math.pow(p.last_pressed_coord.y - y, 2))) > 3 * s.scale) return; if (this.l_up) this.l_up();}
        this.repaint = () => {const expXY = 2, expWH = 4; window.RepaintRect(this.x - expXY, this.y - expXY, this.w + expWH, this.h + expWH);}
        this.trace = (x, y) => {return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;}

        this.x = x; this.y = y; this.w = w; this.h = h; this.type = type; this.hide = hide; this.l_dn = l_dn; this.l_up = l_up; this.tt = new TooltipHandler(); this.tiptext = tiptext; this.transition_factor = 0; this.state = "normal"; this.hand = hand; this.name = name;

        const drawCross = gr => {
            let a; if (this.state !== "down") {const b = im.normal, c = im.hover - b; a = Math.min(b + c * this.transition_factor, im.hover);} else a = im.hover;
            gr.DrawLine(Math.round(this.x + bh * 0.67), Math.round(this.y + bh * 0.67), Math.round(this.x + bh * 0.27), Math.round(this.y + bh * 0.27), Math.round(bh / 10), ui.col.crossBtn); gr.DrawLine(Math.round(this.x + bh * 0.67), Math.round(this.y + bh * 0.27), Math.round(this.x + bh * 0.27), Math.round(this.y + bh * 0.67), Math.round(bh / 10), ui.col.crossBtn);
        }

        const drawFilter = gr => {
            const col = !ui.local ? (this.state !== "down" ? ui.get_blend(im.hover, im.normal, this.transition_factor, true) : im.hover) : im.normal;
            gr.SetTextRenderingHint(1);
            gr.DrawString(txt, ft, col, Math.max(this.x, 0), this.y - 3, this.w, this.h, StringFormat(2, 1));
        }

        const drawScrollBtn = gr => {
            // const a = this.state !== "down" ? Math.min(sAlpha[0] + (sAlpha[1] - sAlpha[0]) * this.transition_factor, sAlpha[1]) : sAlpha[2];
            const a = this.transition_factor * 255;
            // if (scrollBtn) gr.DrawImage(scrollBtn, this.x + ft, txt, stat, stat, 0, 0, scrollBtn.Width, scrollBtn.Height, this.type == 1 ? 0 : 180, a);
            const bImg = stat[this.state];
            const xOffset = 0.5;    // since we have a large (100x100) img we're scaling down, draw slightly offset to line up with scrollbar
            const widthAdj = -1;
            gr.DrawImage(stat.normal, this.x + xOffset, this.y, this.w + widthAdj, this.w, 0, 0, bImg.Width, bImg.Height, 0, 255);
            if (this.state !== 'normal') {
                gr.DrawImage(bImg, this.x + xOffset, this.y, this.w + widthAdj, this.w, 0, 0, bImg.Width, bImg.Height, 0, a);
            } else if (this.transition_factor > 0 && lastState !== 'normal') {
                gr.DrawImage(stat[lastState], this.x + xOffset, this.y, this.w + widthAdj, this.w, 0, 0, bImg.Width, bImg.Height, 0, a);
            }
        }

        const drawSearch = gr => {
            let a = !ui.local ? (this.state !== "down" ? Math.min(255 + (240 - 180) * this.transition_factor, 240) : 240) : 255;
            gr.SetInterpolationMode(2);
            if (im.normal) gr.DrawImage(im.normal, this.x, this.y, this.w, this.h, 0, 0, im.normal.Width, im.normal.Height, 0, a);
            gr.SetInterpolationMode(0);
        }
    }

    this.move = (x, y) => {
        let startTransition = false;
        if (!this.btns.scrollUp.hide && x >= sbar.x && x <= sbar.x + sbar.w &&
                                        y >= sbar.y && y <= sbar.y + sbar.h) {
            if (this.btns.scrollUp.state === 'normal' && this.btns.scrollUp.cs('hot')) startTransition = true;
            if (this.btns.scrollDn.state === 'normal' && this.btns.scrollDn.cs('hot')) startTransition = true;
        } else {
            if (this.btns.scrollUp.state === 'hot' && this.btns.scrollUp.cs('normal')) startTransition = true;
            if (this.btns.scrollDn.state === 'hot' && this.btns.scrollDn.cs('normal')) startTransition = true;
        }
        if (startTransition) {
            transition.start();
        }
        const hover_btn = Object.values(this.btns).find(v => {
             if (!v.hide && (!this.Dn || this.Dn == v.name)) return v.trace(x, y);
        });
        let hand = false;
        check_scrollBtns(x, y, hover_btn);
        // if (hover_btn) hand = hover_btn.hand; window.SetCursor(hand ? 32649 : !this.Dn && y < p.s_h && pptDefault.searchShow && x > qx + qh ? 32513 : 32512);
        if (hover_btn && hover_btn.hide) {if (cur_btn) {cur_btn.cs("normal"); transition.start();} cur_btn = null; return null;} // btn hidden, ignore
        if (cur_btn === hover_btn) return cur_btn;
        if (cur_btn) {cur_btn.cs("normal"); transition.start();} // return prev btn to normal state
        if (hover_btn && !(hover_btn.down && hover_btn.type < 4)) {hover_btn.cs("hover"); if (this.show_tt) hover_btn.tt.showDelayed(hover_btn.tiptext); transition.start();}
        cur_btn = hover_btn;
        return cur_btn;
    }

    this.lbtn_up = (x, y) => {
        if (!cur_btn || cur_btn.hide || this.Dn != cur_btn.name) {clear(); return false;}
        clear();
        if (cur_btn.trace(x, y)) cur_btn.cs("hover");
        cur_btn.lbtn_up(x, y);
        return true;
    }

    this.refresh = upd => {
        if (upd) {
            bx = p.s_w1 - Math.round(ui.row_h * 0.75);
            bh = ui.row_h;
            by = ui.y + Math.round((p.s_sp - bh * 0.4) / 2 - bh * 0.27);
            b_x = p.sbar_x;
            byUp = sbar.y;
            byDn = sbar.y + sbar.h - ui.but_h;
            fw = p.f_w[libraryProps.filterBy] + p.f_sw;
            qx = ui.x + ui.margin;
            qy = ui.y + (p.s_sp - ui.row_h * 0.6) / 2;
            qh = ui.row_h * 0.6;
            if (ui.sbarType != 2) {b_x -= 1; hot_o = byUp - p.s_h; scrollBtn_x = (ui.but_h - ui.scr_but_w) / 2; scrollUp_y = -ui.arrow_pad + byUp + (ui.but_h - 1 - ui.scr_but_w) / 2; scrollDn_y = ui.arrow_pad + byDn + (ui.but_h - 1 - ui.scr_but_w) / 2 ;}
        }
        if (pptDefault.sbarShow) {
            switch (ui.sbarType) {
                case 2:
                    this.btns.scrollUp = new Btn(b_x, byUp, ui.but_h, ui.but_h, 3, "", "", "", {normal: 1, hover: 2, down: 3}, sbar.scrollable_lines < 1, () => sbar.but(1), "", "", false, "scrollUp");
                    this.btns.scrollDn = new Btn(b_x, byDn, ui.but_h, ui.but_h, 3, "", "", "", {normal: 5, hover: 6, down: 7}, sbar.scrollable_lines < 1, () => sbar.but(-1), "", "", false, "scrollDn");
                    break;
                default:
                    this.btns.scrollUp = new Btn(b_x - (is_4k ? 4 : 2), scrollUp_y, ui.scr_but_w, ui.but_h, 1, null, null, scrollBtns.lineUp.stateImgs, "", sbar.scrollable_lines < 1, () => sbar.but(1), "", "", false, "scrollUp");
                    this.btns.scrollDn = new Btn(b_x - (is_4k ? 4 : 2), scrollDn_y, ui.scr_but_w, ui.but_h, 2, null, null, scrollBtns.lineDown.stateImgs, "", sbar.scrollable_lines < 1, () => sbar.but(-1), "", "", false, "scrollDn");
                    break;
            }
        }
        if (pptDefault.searchShow) this.btns.s_img = new Btn(qx, qy, qh, qh, 4, "", "", "", {normal: s_img}, pptDefault.searchShow > 1 && p.s_txt, "", () => {let fn = fb.FoobarPath + "doc\\Query Syntax Help.html"; if (!s.file(fn)) fn = fb.FoobarPath + "Query Syntax Help.html"; s.browser("\"" + fn);}, "Open Query Syntax Help", true, "s_img");
        if (pptDefault.searchShow == 2) {
            this.btns.cross2 = new Btn(qx - bh * 0.2, by, bh, bh, 5, "", "", "", {normal: 180, hover: 255}, !p.s_txt, "", () => {sL.clear();}, "Clear Search Text", true, "cross2");
            this.btns.filter = new Btn(p.filter_x1, by - (is_4k ? 1 : 0), fw, p.s_sp, 6, p.filterBtnFont, "\uE011", "", {normal: !ui.local ? (ui.col.filterBtn & 0xc4ffffff) : ui.col.filterBtn, hover: ui.col.filterBtn & 0xffffffff}, pptDefault.searchShow != 2, "", () => {men.button(p.filter_x1, p.s_h); but.btns.filter.x = p.filter_x1; but.btns.filter.w = p.f_w[libraryProps.filterBy] + p.f_sw;}, "Filter", true, "filter");
        }
        if (pptDefault.searchShow == 1) this.btns.cross1 = new Btn(bx, by, bh, bh, 5, "", "", "", {normal: 180, hover: 255}, pptDefault.searchShow != 1, "", () => {sL.clear();}, "Clear Search Text");
        transition = new Transition(this.btns, v => v.state !== 'normal');
    }

    const Transition = function(items_arg, hover_predicate) {
        this.start = () => {
            const hover_in_step = 0.2, hover_out_step = 0.06;
            if (!transition_timer) {
                transition_timer = setInterval(() => {
                    Object.values(items).forEach(v => {
                        const saved = v.transition_factor;
                        if (hover(v)) v.transition_factor = Math.min(1, v.transition_factor += hover_in_step);
                        else v.transition_factor = Math.max(0, v.transition_factor -= hover_out_step);
                        if (saved !== v.transition_factor) v.repaint();
                    });
                    const running = Object.values(items).some(v => v.transition_factor > 0 && v.transition_factor < 1);
                    if (!running) this.stop();
                }, 25);
            }
        }
        this.stop = () => {
            if (transition_timer) {
                clearInterval(transition_timer);
                transition_timer = null;
            }
        }
    const items = items_arg, hover = hover_predicate; let transition_timer = null;
    }

    // const Tooltip = function() {
    //     this.show = text => {if (Date.now() - tt_start > 2000) this.showDelayed(text); else this.showImmediate(text); tt_start = Date.now();}
    //     this.showDelayed = text => tt_timer.start(this.id, text);
    //     this.showImmediate = text => {tt_timer.set_id(this.id); tt_timer.stop(this.id); tt(text);}
    //     this.clear = () => tt_timer.stop(this.id);
    //     this.stop = () => tt_timer.force_stop();
    //     this.id = Math.ceil(Math.random() * 100000);
    //     const tt_timer = TooltipTimer;
    // }

    // const TooltipTimer = new function() {
    //     let delay_timer, tt_caller = undefined;
    //     this.start = (id, text) => {
    //         const old_caller = tt_caller; tt_caller = id;
    //         if (!delay_timer && tooltip.Text) tt(text, old_caller !== tt_caller );
    //         else {
    //             this.force_stop();
    //             if (!delay_timer) {
    //                 delay_timer = setTimeout(() => {
    //                     tt(text);
    //                     delay_timer = null;
    //                 }, 500);
    //             }
    //         }
    //     }
    //     this.set_id = id => tt_caller = id;
    //     this.stop = id => {if (tt_caller === id) this.force_stop();}
    //     this.force_stop = () => {
    //         tt("");
    //         if (delay_timer) {
    //             clearTimeout(delay_timer);
    //             delay_timer = null;
    //         }
    //     }
    // }

    const check_scrollBtns = (x, y, hover_btn) => {
        if (sbar.timer_but) {
            if ((this.btns["scrollUp"].down || this.btns["scrollDn"].down) && !this.btns["scrollUp"].trace(x, y) && !this.btns["scrollDn"].trace(x, y)) {
                this.btns["scrollUp"].cs("normal"); this.btns["scrollDn"].cs("normal"); clearTimeout(sbar.timer_but); sbar.timer_but = null; sbar.count = -1;}
        } else if (hover_btn) scrBtns.forEach(v => {
            if (hover_btn.name == v && hover_btn.down) {this.btns[v].cs("down"); hover_btn.l_dn();}
        });
    }
}

// class button_manager {
// 	constructor() {
// 		var b_x,
// 			b3 = ["scrollUp", "scrollDn"],
// 			but_tt = g_tooltip,
// 			bx, by, bh, byDn, byUp, fw, hot_o, i, qx, qy, qh, s_img = [],
// 			scr = [],
// 			scrollBut_x, scrollDn_y, scrollUp_y;
// 		this.btns = [];
// 		this.b = null;
// 		this.Dn = false;

// 	}
// 	// arrow_symb = 0;
// 	var browser = function(c) {if (!_.runCmd(c)) fb.ShowPopupMessage("Unable to launch your default browser.", "Library Tree");}
// 	var tooltip = function(n) {if (but_tt.text == n) return; but_tt.text = n; but_tt.Activate();}
// 	this.lbtn_dn = function (x, y) {
// 		this.move(x, y);
// 		if (!this.b) return false;
// 		this.Dn = this.b;
// 		if (libraryProps.showScrollbar) {
// 			for (let j = 0; j < b3.length; j++) {
// 				if (this.b == b3[j]) {
// 					if (this.btns[this.b].trace(x, y)) {
// 						this.btns[this.b].down = true;
// 					}
// 					this.btns[this.b].changestate("down");
// 				}
// 			}
// 		}
// 		this.btns[this.b].lbtn_dn(x, y);
// 		return true;
// 	}
// 	this.lbtn_up = function (x, y) {
// 		this.Dn = false;
// 		if (libraryProps.showScrollbar)
// 			for (let j = 0; j < b3.length; j++) this.btns[b3[j]].down = false;
// 		if (!this.b) return false;
// 		if (libraryProps.showScrollbar)
// 			for (let j = 0; j < b3.length; j++)
// 				if (this.b == b3[j]) this.btns[this.b].changestate(this.btns[this.b].trace(x, y) ? "hover" : "normal");
// 		this.move(x, y);
// 		if (!this.b) return false;
// 		this.btns[this.b].lbtn_up(x, y);
// 		return true;
// 	}
// 	this.leave = function () {
// 		if (this.b) this.btns[this.b].changestate("normal");
// 		this.b = null;
// 		tooltip("");
// 	}
// 	this.on_script_unload = function() {tooltip("");}

// 	this.create_images = function() {
// 		var alpha = [75, 192, 228],
// 			c,
// 			col = [ui.textcol & 0x44ffffff, ui.textcol & 0x99ffffff, ui.textcol],
// 			g,
// 			// sz = arrow_symb == 0 ? Math.max(Math.round(ui.but_h * 1.666667), 1) : 100,
// 			sz = Math.max(Math.round(ui.but_h * 1.666667), 1),
// 			sc = sz / 100;
// 		for (var j = 0; j < 2; j++) {
// 			c = j ? 0xe4ffffff : 0x99ffffff;
// 			s_img[j] = gdi.CreateImage(100, 100);
// 			g = s_img[j].GetGraphics();
// 			g.SetSmoothingMode(SmoothingMode.HighQuality);
//             g.DrawLine(69, 71, 88, 90, 12, ui.txt_box & c);
//             g.DrawEllipse(8, 11, 67, 67, 10, ui.txt_box & c);

//             g.FillEllipse(15, 17, 55, 55, 0x0AFAFAFA);
// 			g.SetSmoothingMode(SmoothingMode.Default);
// 			s_img[j].ReleaseGraphics(g);
// 		}
// 		for (j = 0; j < 3; j++) {
// 			scr[j] = gdi.CreateImage(sz, sz);
// 			g = scr[j].GetGraphics();
// 			g.SetTextRenderingHint(3);
// 			g.SetSmoothingMode(SmoothingMode.HighQuality);
// 			if (ui.scr_col) {
// 				g.FillPolygon(col[j], 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]);
// 			} else {
// 				g.FillPolygon(RGBA(ui.col.t, ui.col.t, ui.col.t, alpha[j]), 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]);
// 			}
// 			g.SetSmoothingMode(SmoothingMode.Default);
// 			scr[j].ReleaseGraphics(g);
// 		}
// 	};
// 	this.create_images();

// 	this.draw = function(gr) {
// 		try {
// 			for (i in this.btns) {
// 				if ((libraryProps.searchMode == 1 || libraryProps.searchMode > 1 && !p.s_txt) && i == "s_img") this.btns[i].draw(gr);
// 				if (libraryProps.searchMode == 1 && i == "cross1") this.btns[i].draw(gr);
// 				if (libraryProps.searchMode > 1 && p.s_txt && i == "cross2") this.btns[i].draw(gr);
// 				if (libraryProps.searchMode > 1 && i == "filter") this.btns[i].draw(gr);
// 				if (libraryProps.showScrollbar && sbar.scrollable_lines > 0 && (i == "scrollUp" || i == "scrollDn"))  this.btns[i].draw(gr);
// 			}
// 		} catch (e) {}
// 	}
// 	this.move = function(x, y) {
// 		if (sbar.timer_but) {if ((this.btns["scrollUp"].down || this.btns["scrollDn"].down) && !this.btns["scrollUp"].trace(x, y) && !this.btns["scrollDn"].trace(x, y)) {this.btns["scrollUp"].changestate("normal"); this.btns["scrollDn"].changestate("normal"); clearTimeout(sbar.timer_but); sbar.timer_but = false; sbar.count = -1;}}
// 		else for (let j = 0; j < b3.length; j++) if (this.b == b3[j] && this.btns[this.b].down) {this.btns[this.b].changestate("down"); this.btns[this.b].l_dn();}
// 		var b = null, hand = false;
// 		for (i in this.btns) {
// 			if ((libraryProps.searchMode == 1 || libraryProps.searchMode > 1 && !p.s_txt) && i == "s_img" && (!this.Dn || this.Dn == "s_img") && this.btns[i].trace(x, y)) {b = i; hand = true;}
// 			if (libraryProps.searchMode == 1 && i == "cross1" && (!this.Dn || this.Dn == "cross1") && this.btns[i].trace(x, y)) {b = i; hand = true;}
// 			if (libraryProps.searchMode > 1 && p.s_txt && i == "cross2" && (!this.Dn || this.Dn == "cross2") && this.btns[i].trace(x, y)) {b = i; hand = true;}
// 			if (libraryProps.searchMode > 1 && i == "filter" && (!this.Dn || this.Dn == "filter") && this.btns[i].trace(x, y)) {b = i; hand = true;}
// 			if (libraryProps.showScrollbar && sbar.scrollable_lines > 0) for (let j = 0; j < b3.length; j++) if (i == b3[j] && (!this.Dn || this.Dn == b3[j]) && this.btns[i].trace(x, y)) b = i;
// 		}
// 		window.SetCursor(this.Dn && this.Dn != this.b ? 32512 : hand ? 32649 : y < p.s_h && libraryProps.searchMode && x > qx + qh ? 32513 : 32512);
// 		if (this.b == b) return this.b;
// 		if (b && (!this.Dn || this.Dn == b)) this.btns[b].changestate("hover");
// 		if (this.b) this.btns[this.b].changestate("normal");
// 		this.b = b;
// 		if (!this.b) tooltip("");
// 		return this.b;
// 	}

// 	var btn = function(x, y, w, h, type, ft, txt, stat, img_src, down, l_dn, l_up, tooltext) {
// 		this.draw = function (gr) {
// 			switch (type) {
// 				case 3: gr.SetInterpolationMode(2); if (this.img) gr.DrawImage(this.img, this.x, this.y, this.w, this.h, 0, 0, this.img.Width, this.img.Height); gr.SetInterpolationMode(0); break;
// 				case 4: gr.DrawLine(Math.round(this.x + bh * 0.67), Math.round(this.y + bh * 0.67), Math.round(this.x + bh * 0.27), Math.round(this.y + bh * 0.27), Math.round(bh / 10), RGBA(136, 136, 136, this.img)); gr.DrawLine(Math.round(this.x + bh * 0.67), Math.round(this.y + bh * 0.27), Math.round(this.x + bh * 0.27), Math.round(this.y + bh * 0.67), Math.round(bh / 10), RGBA(136, 136, 136, this.img)); break;
// 				case 5: gr.SetTextRenderingHint(5); gr.DrawString(txt, ft, this.img, this.x, this.y - 1, this.w, this.h, StringFormat(2, 1)); break;
// 				case 6: ui.theme.SetPartAndStateID(1, this.img); ui.theme.DrawThemeBackground(gr, this.x, this.y, this.w, this.h); break;
// 				default: if (this.img) gr.DrawImage(this.img, this.x + ft, txt, stat, stat, 0, 0, this.img.Width, this.img.Height, type == 1 ? 0 : 180); break;
// 			}
// 		}
// 		this.trace = function(x, y) {return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;}
// 		this.lbtn_dn = function () {this.l_dn && this.l_dn(x, y);}
// 		this.lbtn_up = function () {this.l_up && this.l_up(x, y);}

// 		this.changestate = function(state) {
// 			switch (state) {case "hover": this.img = this.img_hover; tooltip(this.tooltext); break; case "down": this.img = this.img_down; break; default: this.img = this.img_normal; break;}
// 			window.RepaintRect(this.x, this.y, this.w + 1, this.h + 1);
// 		}
// 		this.x = x; this.y = y; this.w = w; this.h = h; this.l_dn = l_dn; this.l_up = l_up; this.tooltext = tooltext;
// 		this.img_normal = img_src.normal; this.img_hover = img_src.hover || this.img_normal; this.img_down = img_src.down || this.img_normal; this.img = this.img_normal;
// 	}

// 	this.refresh = function(upd) {
// 		if (upd) {
// 			bx = p.s_w1 - Math.round(ui.row_h * 0.75);
// 			bh = ui.row_h;
// 			by = ui.y + Math.round((p.s_sp - bh * 0.4) / 2 - bh * 0.27);
// 			b_x = p.sbar_x;
// 			byUp = sbar.y;
// 			byDn = sbar.y + sbar.h - ui.but_h;
// 			fw = p.f_w[p.filterBy] + p.f_sw + 12;
// 			qx = ui.x + ui.margin;
// 			qy = ui.y + (p.s_sp - ui.row_h * 0.6) / 2;
// 			qh = ui.row_h * 0.6;
// 			if (ui.scr_type != 2) {b_x -= 1; hot_o = byUp - p.s_h; scrollBut_x = (ui.but_h - ui.scr_but_w) / 2; scrollUp_y = -ui.arrow_pad + byUp + (ui.but_h - 1 - ui.scr_but_w) / 2; scrollDn_y = ui.arrow_pad + byDn + (ui.but_h - 1 - ui.scr_but_w) / 2 ;}
// 		}
// 		if (libraryProps.showScrollbar) {
// 			switch (ui.scr_type) {
// 				case 2:
// 					this.btns.scrollUp = new btn(b_x, byUp, ui.but_h, ui.but_h, 6, "", "", "", {normal: 1, hover: 2, down: 3}, false, function() {sbar.but(1);}, "", "");
// 					this.btns.scrollDn = new btn(b_x, byDn, ui.but_h, ui.but_h, 6, "", "", "", {normal: 5, hover: 6, down: 7}, false, function() {sbar.but(-1);}, "", "");
// 					break;
// 				default:
// 					this.btns.scrollUp = new btn(b_x, byUp - hot_o, ui.but_h, ui.but_h + hot_o, 1, scrollBut_x, scrollUp_y, ui.scr_but_w, {normal: scr[0], hover: scr[1], down: scr[2]}, false, function() {sbar.but(1);}, "", "");
// 					this.btns.scrollDn = new btn(b_x, byDn, ui.but_h, ui.but_h + hot_o, 2, scrollBut_x, scrollDn_y, ui.scr_but_w, {normal: scr[0], hover: scr[1], down: scr[2]}, false, function() {sbar.but(-1);}, "", "");
// 					break;
// 			}
// 		}
// 		if (libraryProps.searchMode)  {
// 			this.btns.s_img = new btn(qx, qy, qh, qh, 3, "", "", "", {normal: s_img[0], hover: s_img[1]}, false, "", function() {browser("\"" + fb.FoobarPath + "doc\\Query Syntax Help.html");}, "Open Query Syntax Help");
// 			this.btns.cross1 = new btn(bx, by, bh, bh, 4, "", "", "", {normal: "85", hover: "192"}, false, "", function() {sL.clear();}, "Clear Search Text");
// 			this.btns.cross2 = new btn(qx - bh * 0.2, by, bh, bh, 4, "", "", "", {normal: "85", hover: "192"}, false, "", function() {sL.clear();}, "Clear Search Text");
// 			this.btns.filter = new btn(p.filter_x1 - 12, ui.y, fw, p.s_sp, 5, p.filter_but_ft, "▼", "", {normal: ui.txt_box & 0x99ffffff, hover: ui.txt_box & 0xe4ffffff}, false, "", function() {men.button(p.filter_x1, p.s_h); but.refresh(true)}, "Filter");
// 		}
// 	}
// }
// var but = new button_manager();

function MenuItems() {
    var use_local = window.GetProperty("SYSTEM.Use Local", false),
        // expand_limit = use_local ? 6000 : Math.min(Math.max(window.GetProperty("ADV.Limit Menu Expand: 10-6000", 500), 10), 6000),
        i = 0,
        MenuMap = [],
        MF_GRAYED = 0x00000001,
        MF_SEPARATOR = 0x00000800,
        MF_STRING = 0x00000000;
    this.baseMenu = null;
    this.clickMenu = null;
    this.doubleClickMenu = null;
    this.itemCountsMenu = null;
    this.keyMenu = null;
    this.menu = null;
    this.modeMenu = null;
    this.rootNodeMenu = null;
    this.showMenu = null;
    this.targetPlaylistMenu = null;
    this.themeMenu = null;
    this.viewMenu = null;
    let expandable = false
    this.treeExpandLimit = 500;
    this.r_up = false;
    // this.NewMenuItem = function(index, type, value) {MenuMap[index] = [{type: ""},{value: 0}]; MenuMap[index].type = type; MenuMap[index].value = value;};
    const newMenuItem = (index, type, value) => {MenuMap[index] = {}; MenuMap[index].type = type; MenuMap[index].value = value;};
    this.r_up = false;
    var box = function(n) {return n != null ? 'Unescape("' + encodeURIComponent(n + "") + '")' : "Empty";}
    var InputBox = function(prompt, title, msg) { vb.Language = "VBScript"; var tmp = vb.eval('InputBox(' + [box(prompt), box(title), box(msg)].join(",") + ')'); if (typeof tmp == "undefined") return; if (tmp.length == 254) fb.ShowPopupMessage("Your entry is too long and will be truncated.\n\nEntries are limited to 254 characters.", "Library Tree"); return tmp.trim();}
    var proceed = function(length) {var ns = InputBox("Create m-TAGS in selected music folders\n\nProceed?\n\nm-TAGS creator settings apply", "Create m-TAGS in Selected Folders", "Create " + length + " m-TAGS" + (length ? "" : ": NO FOLDERS SELECTED")); if (!ns) return false; return true;}
    // this.ConfigTypeMenu = function (Menu, StartIndex) {
    // 	var Index = StartIndex,
    // 		n = ["Panel Properties"];
    // 	if (p.syncType) n.push("Refresh");
    // 	if (v.k('shift')) n.push("Configure...");
    // 	for (var i = 0; i < n.length; i++) {
    // 		this.NewMenuItem(Index, "Config", i + 1);
    // 		Menu.AppendMenuItem(MF_STRING, Index, n[i]);
    // 		Index++;
    // 	}
    // 	return Index;
    // }
    this.OptionsTypeMenu = function (Menu, StartIndex) {
        var Index = StartIndex;
        for (i = 0; i < p.menu.length; i++) {
            newMenuItem(Index, "Options", i);
            Menu.AppendMenuItem(MF_STRING, Index, p.menu[i]);
            Index++;
            if (i == p.menu.length - 1 || i == p.menu.length - 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        }
        Menu.CheckMenuRadioItem(StartIndex, StartIndex + p.grp.length - 1, StartIndex + libraryProps.viewBy);
        return Index;
    }
    const baseTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; return Index;}
    const clickTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Select", "Send to Playlist", "Send to Playlist && Play", "Send to Playlist && Play [Add if Playing]"/*, "Send to Playlist && Play [Add if Content]"*/]; n.forEach((v, i) => {newMenuItem(Index, "Click", i); Menu.AppendMenuItem(MF_STRING, Index, v); if (i == 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); Index++;}); Menu.CheckMenuRadioItem(StartIndex, Index, StartIndex + libraryProps.clickAction); return Index;}
    const doubleClickTypeMenu = (Menu, StartIndex) => {
        let Index = StartIndex;
        const n = ["Expand / Collapse", "Send to Playlist && Play", "Send to Playlist"];
        if (library_tree.autoPlay.click > 2) n.unshift("N/A With Dual Mode Single-Click Actions");
        n.forEach((v, i) => {
            newMenuItem(Index, "DoubleClick", i);
            Menu.AppendMenuItem(library_tree.autoPlay.click < 3 ? MF_STRING : MF_GRAYED, Index, v);
            if (library_tree.autoPlay.click > 2 && i == 0) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); Index++;
        });
        Menu.CheckMenuRadioItem(StartIndex, Index, StartIndex + libraryProps.dblClickAction + (library_tree.autoPlay.click < 3 ? 0 : 1));
        return Index;
    }
    const itemCountsTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Hide", "# Tracks", "# Sub-Items"]; n.forEach((v, i) => {newMenuItem(Index, "ItemCounts", i); Menu.AppendMenuItem(MF_STRING, Index, v); Index++;}); Menu.CheckMenuRadioItem(StartIndex, Index, StartIndex + libraryProps.nodeItemCounts); return Index;}
    const keyTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Select", "Send to Playlist"]; n.forEach((v, i) => {newMenuItem(Index, "Key", i); Menu.AppendMenuItem(MF_STRING, Index, v); Index++;}); Menu.CheckMenuRadioItem(StartIndex, Index, StartIndex + libraryProps.keyAction); return Index;}
    const nowPlayingTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; newMenuItem(Index, "Nowplaying", 0); Menu.AppendMenuItem(library_tree.nowp != -1 ? MF_STRING : MF_GRAYED, Index, "Show Nowplaying"); Index++; return Index;}
    // this.PlaylistTypeMenu = function (Menu, StartIndex) {
    //     var idx = StartIndex,
    //         n = ["Send to Current Playlist", "Insert in Current Playlist", "Add to Current Playlist", "Copy", "Collapse All", "Expand"];
    //     for (i = 0; i < 6; i++) {
    //         this.NewMenuItem(idx, "Playlist", i + 1);
    //         Menu.AppendMenuItem(i < 3 && !plman.IsPlaylistLocked(plman.ActivePlaylist) || i == 3 || i == 4 || i == 5 ? MF_STRING : MF_GRAYED, idx, n[i]);
    //         if (i == 3) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
    //         idx++;
    //     }
    //     return idx;
    // }
    const playlistTypeMenu = (Menu, StartIndex) => {
        let idx = StartIndex;
        const n = ["Send to Current Playlist" + "\tEnter", "Insert in Current Playlist" + "\tCtrl+Enter", "Add to Current Playlist" + "\tShift+Enter", "Copy" + "\tCtrl+C", "Collapse All", "Expand"];
        for (i = 2; i < 6; i++) {
            newMenuItem(idx, "Playlist", i);
            Menu.AppendMenuItem(i < 3 && !plman.IsPlaylistLocked(plman.ActivePlaylist) || i == 3 || i == 4 || i == 5 && expandable ? MF_STRING : MF_GRAYED, idx, n[i]);
            if (i == 3) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
            idx++;
        }
        return idx;
    }
    const rootNodeTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Hide", "All Music", "View Name"]; n.forEach((v, i) => {newMenuItem(Index, "RootNode", i); Menu.AppendMenuItem(MF_STRING, Index, v); Index++;}); Menu.CheckMenuRadioItem(StartIndex, Index, StartIndex + libraryProps.rootNode); return Index;}
    // this.TagTypeMenu = function(Menu, StartIndex) {var Index = StartIndex; newMenuItem(Index, "Tag", 1); Menu.AppendMenuItem(mtags_installed && p.view.replace(/^\s+/, "") == "$directory_path(%path%)|%filename_ext%" ? MF_STRING : MF_GRAYED, Index, "Create m-TAGS..." + (mtags_installed ? (p.view.replace(/^\s+/, "").toLowerCase() == "$directory_path(%path%)|%filename_ext%" ? "" : " N/A Requires View by Path // $directory_path(%path%)|%filename_ext%$nodisplay{%subsong%}") : " N/A m-TAGS Not Installed")); Index++; return Index;}
    // this.ThemeTypeMenu = function (Menu, StartIndex) {
    //     var Index = StartIndex,
    //         c = [!pptDefault.blurDark && !pptDefault.blurBlend && !pptDefault.blurLight && !ui.imgBg, pptDefault.blurDark, pptDefault.blurBlend, pptDefault.blurLight, ui.imgBg, false],
    //         n = ["None", "Dark", "Blend", "Light", "Cover", "Reload"];
    //     for (var i = 0; i < n.length; i++) {
    //         this.NewMenuItem(Index, "Theme", i + 1);
    //         Menu.AppendMenuItem(MF_STRING, Index, n[i]);
    //         Index++;
    //         Menu.CheckMenuRadioItem(StartIndex + i, StartIndex + i, StartIndex + i + 1 - c[i]);
    //         if (!i || i == 4) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
    //     }
    //     return Index;
    // }
    const searchTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [pptDefault.searchShow == 1, pptDefault.searchShow == 2, libraryProps.searchEnter, libraryProps.searchSend == 1, libraryProps.searchSend == 2], n = ["Show Search Bar", "Show Search Bar + Filter", "Require Enter to Search", "Send Results to Playlist on Enter", "Auto-Send Results to Playlist"]; n.forEach((v, i) => {newMenuItem(Index, "SearchMode", i); Menu.AppendMenuItem(i < 2 || pptDefault.searchShow && (!libraryProps.searchEnter || i == 2 || i == 3) ? MF_STRING : MF_GRAYED, Index, v); Menu.CheckMenuItem(Index++, c[i]); if (i == 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
    const viewTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; p.menu.forEach((v, i) => {newMenuItem(Index, "View", i); Menu.AppendMenuItem(MF_STRING, Index, v); Index++; if (i == p.menu.length - 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + p.grp.length - 1, StartIndex + libraryProps.viewBy); return Index;}

    // this.FilterMenu = function(Menu, StartIndex) {
    //     var Index = StartIndex;
    //     for (i = 0; i < p.f_menu.length + 1; i++) {
    //         this.NewMenuItem(Index, "Filter", i + 1);
    //         Menu.AppendMenuItem(MF_STRING, Index, i != p.f_menu.length ? (!i ? "No " : "") + p.f_menu[i] : "Always Reset Scroll");
    //         if (i == p.f_menu.length) Menu.CheckMenuItem(Index++, p.reset); else Index++;
    //         if (i == p.f_menu.length - 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
    //     }
    //     Menu.CheckMenuRadioItem(StartIndex, StartIndex + p.f_menu.length - 1, StartIndex + libraryProps.filterBy);
    //     return Index;
    // }

    const filterMenu = (Menu, StartIndex) => {
        let Index = StartIndex;
        for (i = 0; i < p.f_menu.length + 1; i++) {
            newMenuItem(Index, "Filter", i);
            Menu.AppendMenuItem(MF_STRING, Index, i != p.f_menu.length ? (!i ? "No " : "") + p.f_menu[i] : "Always Reset Scroll");
            if (i == p.f_menu.length) Menu.CheckMenuItem(Index++, p.reset); else Index++;
            if (i == p.f_menu.length - 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        }
        Menu.CheckMenuRadioItem(StartIndex, StartIndex + p.f_menu.length - 1, StartIndex + libraryProps.filterBy);
        return Index;
    }

    // this.button = function(x, y) {
    //     var menu = window.CreatePopupMenu(),
    //         idx;
    //     const Index = this.FilterMenu(menu, 1);
    //     menu_down = true;
    //     idx = menu.TrackPopupMenu(x, y);
    //     menu_down = false;
    //     if (idx >= 1 && idx <= Index) {i = MenuMap[idx].value; library_tree.subCounts.filter = {}; library_tree.subCounts.search = {};
    //         switch (i) {
    //             case p.f_menu.length + 1: p.reset = !p.reset; if (p.reset) {p.search_paint(); lib_manager.treeState(true, 2);} window.SetProperty("SYSTEM.Reset Tree", p.reset); break;
    //             default: p.filterBy = i - 1; p.calc_text(); p.search_paint(); lib_manager.treeState(true, 2); window.SetProperty("SYSTEM.Filter By", p.filterBy); break;
    //         }
    //         // if (p.pn_h_auto && p.pn_h == p.pn_h_min && library_tree.tree[0]) library_tree.clear_child(library_tree.tree[0]);
    //     }
    // }

    this.button = (x, y) => {
        const menu = window.CreatePopupMenu();
        let idx, Index = 1;
        Index = filterMenu(menu, Index);
        menu_down = true;
        idx = menu.TrackPopupMenu(x, y);
        menu_down = false;
        if (idx >= 1 && idx <= Index) {
            i = MenuMap[idx].value; library_tree.subCounts.filter = {}; library_tree.subCounts.search = {};
            switch (i) {
                case p.f_menu.length: p.reset = !p.reset; if (p.reset) {p.search_paint(); lib_manager.treeState(true, 2);} window.SetProperty("SYSTEM.Reset Tree", p.reset); break;
                default:
                    libraryProps.filterBy = i; p.calc_text(); p.search_paint();
                    // lib_manager.treeState(false, libraryProps.rememberTree);
                    if (!libraryProps.rememberTree && !p.reset) lib_manager.logTree();
                    lib_manager.getLibrary();
                    lib_manager.rootNodes(!p.reset ? 1 : 0, true);
                    break;
            }
            // library_tree.checkAutoHeight();
        }
    }

    // this.search = function(Menu, StartIndex, s, f, paste) {
    //     var Index = StartIndex, n = ["Copy", "Cut", "Paste"];
    //     for (i = 0; i < 3; i++) {
    //         this.NewMenuItem(Index, "Search", i + 1);
    //         Menu.AppendMenuItem(s == f && i < 2 || i == 2 && !paste ? MF_GRAYED : MF_STRING, Index, n[i]); Index++;
    //         if (i == 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
    //     }
    //     return Index;
    // }
    const search = (Menu, StartIndex, b, f, paste) => {
        let Index = StartIndex; const n = ["Copy", "Cut", "Paste"];
        n.forEach((v, i) => {
            newMenuItem(Index, "Search", i);
            Menu.AppendMenuItem(b == f && i < 2 || i == 2 && !paste ? MF_GRAYED : MF_STRING, Index, v); Index++;
            if (i == 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        });
        return Index;
    }

    // this.search_menu = function(x, y, s, f, paste) {
    //     var menu = window.CreatePopupMenu(), idx;
    //     const Index = this.search(menu, 1, s, f, paste);
    //     menu_down = true;
    //     idx = menu.TrackPopupMenu(x, y);
    //     menu_down = false;
    //     if (idx >= 1 && idx <= Index) {
    //         i = MenuMap[idx].value;
    //         switch (i) {
    //             case 1: sL.on_char(vk.copy); break;
    //             case 2: sL.on_char(vk.cut); break;
    //             case 3: sL.on_char(vk.paste, true); break;
    //         }
    //     }
    // }
    this.search_menu = (x, y, b, f, paste) => {
        const menu = window.CreatePopupMenu();
        let idx, Index = 1;
        Index = search(menu, Index, b, f, paste);
        idx = menu.TrackPopupMenu(x, y);
        if (idx >= 1 && idx <= Index) {
            i = MenuMap[idx].value;
            switch (i) {
                case 0: sL.on_char(vk.copy); break;
                case 1: sL.on_char(vk.cut); break;
                case 2: sL.on_char(vk.paste, true); break;
            }
        }
    }

    this.rbtn_up = (x, y) => {
        this.r_up = true;
        // var Context = fb.CreateContextMenuManager(),
        //     // FilterMenu = window.CreatePopupMenu(),
        //     idx,
        //     Index = 1,
        //     menu = window.CreatePopupMenu(),
        //     OptionsMenu = window.CreatePopupMenu(),
        //     // PlaylistMenu = window.CreatePopupMenu(),
        //     // ThemeMenu = window.CreatePopupMenu(),
        //     show_context = false;

        const Context = fb.CreateContextMenuManager();
        const popupMenu = ["baseMenu", "clickMenu", "doubleClickMenu", "itemCountsMenu", "keyMenu", "menu", "modeMenu", "rootNodeMenu", "showMenu", "targetPlaylistMenu", "themeMenu", "viewMenu"];
        let idx, Index = 1, items, show_context = false;
        popupMenu.forEach(v => this[v] = window.CreatePopupMenu());
        var ix = library_tree.get_ix(x, y, true, false),
            item = library_tree.tree[ix],
            nm = "",
            row = -1;
        if (y < p.s_h + p.sp + ui.y && library_tree.tree.length > ix && ix != -1 &&
                (x < Math.round(ui.pad * item.tr) + ui.icon_w + ui.margin + ui.x &&
                (!item.track || libraryProps.rootNode && item.tr == 0) ||
                library_tree.check_ix(item, x, y, true))) {
            if (!item.sel) {
                library_tree.clear();
                item.sel = true;
            }
            library_tree.get_sel_items();
            expandable = library_tree.tree[ix].item.length > this.treeExpandLimit || library_tree.tree[ix].track ? false : true;
            if (expandable && library_tree.tree.length) {
                let count = 0;
                library_tree.tree.forEach((v, m, arr) => {
                    if (m == ix || v.sel) {
                        if (row == -1 || m < row) {
                            row = m;
                            nm = (v.tr ? arr[v.par].name : "") + v.name;
                            nm = nm.toUpperCase();
                        }
                        count += v.item.length;
                        expandable = count <= this.treeExpandLimit;
                    }
                });
            }
            Index = playlistTypeMenu(this.menu, Index);
            this.menu.AppendMenuSeparator();
            show_context = true;
        }
        if (show_context) {
            // Index = this.OptionsTypeMenu(OptionsMenu, Index);
            // OptionsMenu.AppendTo(menu, MF_STRING, "Options");
            // // Index = this.ThemeTypeMenu(ThemeMenu, Index); ThemeMenu.AppendTo(OptionsMenu, MF_STRING, "Theme"); OptionsMenu.AppendMenuSeparator();
            // // Index = this.ConfigTypeMenu(OptionsMenu, Index);
            // menu.AppendMenuSeparator();
            // var items = library_tree.getHandles();
            // Context.InitContext(items);
            // Context.BuildMenu(menu, 5000);
            if (pptDefault.showNowplaying) {
                Index = nowPlayingTypeMenu(this.viewMenu, Index);
                this.viewMenu.AppendMenuSeparator();
            }
            Index = viewTypeMenu(this.viewMenu, Index); this.viewMenu.AppendTo(this.menu, MF_STRING, "View");
            Index = baseTypeMenu(this.baseMenu, Index); this.baseMenu.AppendTo(this.menu, MF_STRING, "Options");
            this.menu.AppendMenuSeparator();
        } else {
            // Index = this.OptionsTypeMenu(menu, Index);
            // Index = this.ThemeTypeMenu(ThemeMenu, Index);
            // ThemeMenu.AppendTo(menu, MF_STRING, "Theme");
            // menu.AppendMenuSeparator();
            // Index = this.ConfigTypeMenu(menu, Index);
            if (pptDefault.showNowplaying) {
                Index = nowPlayingTypeMenu(this.menu, Index);
                this.menu.AppendMenuSeparator();
            }
            Index = viewTypeMenu(this.menu, Index);
            this.menu.AppendMenuSeparator();
            Index = baseTypeMenu(this.baseMenu, Index); this.baseMenu.AppendTo(this.menu, MF_STRING, "Options");
        }
        Index = clickTypeMenu(this.clickMenu, Index); this.clickMenu.AppendTo(this.baseMenu, MF_STRING, "Single-Click Action");
        Index = doubleClickTypeMenu(this.doubleClickMenu, Index); this.doubleClickMenu.AppendTo(this.baseMenu, MF_STRING, "Double-Click Action");
        Index = keyTypeMenu(this.keyMenu, Index); this.keyMenu.AppendTo(this.baseMenu, MF_STRING, "Keyboard Action");
        this.baseMenu.AppendMenuSeparator();
        Index = itemCountsTypeMenu(this.itemCountsMenu, Index); this.itemCountsMenu.AppendTo(this.baseMenu, MF_STRING, "Item Counts");
        Index = rootNodeTypeMenu(this.rootNodeMenu, Index); this.rootNodeMenu.AppendTo(this.baseMenu, MF_STRING, "Root Node");
        // this.baseMenu.AppendMenuSeparator();

        if (show_context) {
            items = library_tree.selected();
            Context.InitContext(items); Context.BuildMenu(this.menu, 5000);
        }

        menu_down = true;
        idx = this.menu.TrackPopupMenu(x, y);
        menu_down = false;
        if (idx >= 1 && idx <= Index) {
            i = MenuMap[idx].value;
            switch (MenuMap[idx].type) {
                case 'Playlist':
                    switch (i) {
                        case 0: // Send to Current Playlist
                            library_tree.load(library_tree.sel_items, true, false, library_tree.autoPlay.send, false, false);
                            p.tree_paint();
                            lib_manager.treeState(false, libraryProps.rememberTree);
                            break;
                        case 1: // Insert or Add to Current Playlist
                        case 2:
                            library_tree.load(library_tree.sel_items, true, true, false, false, i == 1 ? true : false);
                            lib_manager.treeState(false, libraryProps.rememberTree);
                            break;
                        case 3: fb.CopyHandleListToClipboard(items); lib_manager.treeState(false, libraryProps.rememberTree); break;
                        case 4: library_tree.collapseAll(); break;
                        case 5: library_tree.expand(ix, nm); break;
                        default:
                            throw new ArgumentError('"Playlist" item index', i, 'in MenuItems.rbtn_up');
                            break;
                    }
                    break;
                case "Nowplaying": library_tree.nowPlayingShow(); break;
                case "View": p.set('view', i); break;
                case "Click": library_tree.setActions('click', i); break;
                case "DoubleClick": library_tree.setActions('dblClick', i); break;
                case "Key": library_tree.setActions('key', i); break;
                case "ItemCounts": p.set('itemCounts', i); break;
                case "RootNode": p.set('rootNode', i); break;

                // case "Tag":
                //     var r = !libraryProps.rootNode ? library_tree.tree[ix].tr : library_tree.tree[ix].tr - 1, list = [];
                //     if (libraryProps.rootNode && !ix || !r) library_tree.tree[ix].sel = true;
                //     if (libraryProps.rootNode && library_tree.tree[0].sel) for (var j = 0; j < library_tree.tree.length; j++) if (library_tree.tree[j].tr == 1) library_tree.tree[j].sel = true; p.tree_paint();
                //     for (j = 0; j < library_tree.tree.length; j++) if ((library_tree.tree[j].tr == (libraryProps.rootNode ? 1 : 0)) && library_tree.tree[j].sel) list.push(library_tree.tree[j].name);
                //     if (!proceed(list.length)) break;
                //     p.syncType = 1; for (j = 0; j < list.length; j++) _.runCmd("\"" + fb.FoobarPath + "\\foobar2000.exe\"" + " /m-TAGS \"" + list[j] + "\"");
                //     p.syncType = window.GetProperty(" Library Sync: Auto-0, Initialisation Only-1", 0); lib_manager.treeState(false, 2);
                //     break;
                case "Options":
                    lib_manager.time.Reset();
                    if (p.s_txt) lib_manager.upd_search = true;
                    p.fields(i < p.grp.length + 1 ? i - 1 : libraryProps.viewBy, i - 1 < p.grp.length ? libraryProps.filterBy : i - 1 - p.grp.length);
                    library_tree.subCounts =  {"standard": {}, "search": {}, "filter": {}};
                    lib_manager.getLibrary();
                    lib_manager.rootNodes();
                    // if (p.pn_h_auto && p.pn_h == p.pn_h_min && library_tree.tree[0]) library_tree.clear_child(library_tree.tree[0]);
                    break;
                // case "Theme": if (i < 6) ui.blurChange(i); else window.Reload(); break;
                // case "Config":
                // 	switch (i) {
                // 		case 1: window.ShowProperties(); break;
                // 		case 2: p.syncType ? lib_manager.treeState(false, 2) : window.ShowConfigure(); break;
                // 		case 3: if (p.syncType) window.ShowConfigure(); break;
                // 	}
                // 	break;
            }
        }
        if (idx >= 5000 && idx <= 5800) {show_context && Context.ExecuteByID(idx - 5000);}
        this.r_up = false;
    }
}
// var men = new menu_object();

/**
 * Class which defines a bunch of timers for intervals and timeouts, and also includes some
 * predefined timer callbacks for some reason.
 */
class Timers {
    constructor () {
        this.clear_jsearch = undefined;
        this.focus = undefined;
        this.jsearch = undefined;
        this.search = { id: undefined };
        this.search_cursor = { id: undefined };
        this.tt = undefined;
        this.update = undefined;
    }

    reset(timer) {
        clearTimeout(timer);	// can always call clearTimeout even on bogus non-timer input
    }

    clear(timer) {
        if (timer) { clearTimeout(timer.id); }
        timer.id = null;
    }

    lib() {
        setTimeout(() => {
            if ((ui.w < 1 || !window.IsVisible) && libraryProps.rememberTree)
                lib_manager.init = true;
            lib_manager.getLibrary();
            lib_manager.rootNodes(libraryProps.rememberTree ? 1 : 0, lib_manager.process);
        }, 5);
    }

    tooltip() {
        clearTimeout(this.tt);
        this.tt = setTimeout(() => {
            library_tree.deActivate_tooltip();
        }, 5000);
    }

    // lib_update() {
    //     clearTimeout(this.update);
    //     this.update = setTimeout(() => {
    //         lib_manager.time.Reset();
    //         library_tree.subCounts = {
    //             standard: {},
    //             search: {},
    //             filter: {}
    //         };
    //         lib_manager.rootNodes(2, lib_manager.process);
    //     }, 500);
    // }
}

class LibraryCallbacks {
    constructor () {
        /** @type {FbMetadbHandleList} */
        this.cached_handles = new FbMetadbHandleList();
    }

    on_char(code) {
        library_tree.on_char(code);
        jumpSearch.on_char(code);
        if (!libraryProps.searchMode) return;
        sL.on_char(code);
    }
    on_focus(is_focused) {if (!is_focused) {timer.reset(timer.search_cursor); p.s_cursor = false; p.search_paint();} library_tree.on_focus(is_focused);}
    // this.on_get_album_art_done = function(handle, art_id, image, image_path) {ui.get_album_art_done(image, image_path);}
    on_metadb_changed(handle_list, fromhook) {
        if (displayLibrary) {
            lib_manager.treeState(false, 2, handle_list, 1);
        } else {
            // TODO: cache list of updated handles, and then call on_metadb_changed with that list once library is visible again
        }
    }
    on_item_focus_change() {if (fb.IsPlaying || !ui.blur && !ui.imgBg) return; if (ui.block()) ui.get = true; else {ui.get = false; ui.focus_changed(250);}}
    on_key_down(vkey) {
        library_tree.on_key_down(vkey);
        if (!libraryProps.searchMode) return;
        sL.on_key_down(vkey);
    }
    on_key_up(vkey) { if (!libraryProps.searchMode) return; sL.on_key_up(vkey); }
    on_library_items_added(handle_list) {if (p.syncType) return; lib_manager.treeState(false, 2, handle_list, 0);}
    on_library_items_removed(handle_list) {if (p.syncType) return; lib_manager.treeState(false, 2, handle_list, 2);}
    on_library_items_changed(handle_list) {if (p.syncType) return; lib_manager.treeState(false, 2, handle_list, 1);}
    on_mouse_lbtn_dblclk(x, y, m) {
        but.lbtn_dn(x, y);
        library_tree.lbtn_dblclk(x, y);
        if (libraryProps.searchMode)
            sL.on_mouse_lbtn_dblclk(x, y, m);
    }
    on_mouse_lbtn_down(x, y) {
        if (libraryProps.searchMode || libraryProps.showScrollbar) {
            but.lbtn_dn(x, y);
        }
        if (libraryProps.searchMode) {
            sL.lbtn_dn(x, y);
        }
        library_tree.lbtn_dn(x, y);
        sbar.lbtn_dn(x, y);
    }
    on_mouse_lbtn_up(x, y) {library_tree.lbtn_up(x, y); if (libraryProps.searchMode) {sL.lbtn_up(); but.lbtn_up(x, y);} sbar.lbtn_up(x, y);}
    on_mouse_leave() {if (libraryProps.searchMode || libraryProps.showScrollbar) but.leave(); sbar.leave(); library_tree.leave();}
    on_mouse_mbtn_up(x, y) {library_tree.mbtn_up(x, y);}
    on_mouse_move(x, y, m) {if (p.m_x == x && p.m_y == y) return; if (libraryProps.searchMode || libraryProps.showScrollbar) but.move(x, y); if (libraryProps.searchMode) sL.move(x, y); library_tree.move(x, y); library_tree.dragDrop(x, y); sbar.move(x, y); p.m_x = x; p.m_y = y;
		// ---> Automatic Scrollbar Hide & Scrollbar Hit Area
		if (pref.autoSbar_Library === true) {
			const trace_pad = 2;
			const scrollBar_hitarea_x = ui.x + ui.w;
			const scrollBar_hitarea_h = ui.h;
			const scrollBar_hitarea_w = is_4k ? 20 : 10;
			const scrollBar_hitarea_y = 0;
			let inScrollArea = '';

			if ((scrollBar_hitarea_x - (is_4k ? 40 : 20) * trace_pad <= x) && (x <= scrollBar_hitarea_x - (is_4k ? 40 : 20) + scrollBar_hitarea_w + trace_pad) && 
				(scrollBar_hitarea_y + (is_4k ? 160 : 80) <= y) && (y <= scrollBar_hitarea_y + scrollBar_hitarea_h + (is_4k ? 60 : 40))) {

				if (!inScrollArea) {
					inScrollArea = true;
					ui.scr_but_w = scaleForDisplay(17);
					sbar.w = scaleForDisplay(12);
					but.refresh(true);
					window.Repaint();
				} else { inScrollArea = false; }

			} else if ((!sbar.isDragging() && scrollBar_hitarea_x - (is_4k ? 60 : 30) * trace_pad <= x) && (x <= scrollBar_hitarea_x - (is_4k ? 60 : 30) + scrollBar_hitarea_w + trace_pad) && 
				(scrollBar_hitarea_y + (is_4k ? 80 : 40) <= y) && (y <= scrollBar_hitarea_y + scrollBar_hitarea_h + (is_4k ? 120 : 80))) {

				if (!inScrollArea) {
					inScrollArea = true;
					ui.scr_but_w = 0;
					sbar.w = 0;
					but.refresh(true);
					window.Repaint();
				} else { inScrollArea = false; }
			}
		} else if (pref.autoSbar_Library === false) {
			ui.scr_but_w = scaleForDisplay(17);
			sbar.w = scaleForDisplay(12);
		}
	}
    on_mouse_rbtn_up(x, y) {if (y < p.s_h && x > p.s_x && x < p.s_x + p.s_w2) {if (libraryProps.searchMode) sL.rbtn_up(x, y); return true;} else {men.rbtn_up(x, y); return true;}}
    on_mouse_wheel(step) {if (!vk.k('zoom')) sbar.wheel(step); else ui.wheel(step);}
    on_notify_data(name, info) {switch (name) {case "!!.tags update": lib_manager.treeState(false, 2); break;}}
    on_playback_new_track(handle) {ui.on_playback_new_track(handle);}
    on_playback_stop(reason) {if (reason == 2) return; on_item_focus_change();}
    on_playlist_items_added(pn) {if (pn == plman.ActivePlaylist) ui.upd_handle_list = true; on_item_focus_change();}
    on_playlist_items_removed(pn) {if (pn == plman.ActivePlaylist) ui.upd_handle_list = true; on_item_focus_change();}
    on_playlist_items_reordered(pn) {if (pn == plman.ActivePlaylist) ui.upd_handle_list = true;}
    on_playlist_switch() {on_item_focus_change();}
    on_script_unload() {but.on_script_unload();}
    mouse_in_this (x, y) {
        return (x >= ui.x && x < ui.x + ui.w &&
                y >= ui.y && y < ui.y + ui.h);
    }
}
// var library = new LibraryCallbacks();

/** @type {userinterface} */
let ui;
/** @type {Scrollbar} */
let sbar;
/** @type {panel_operations} */
let p;
/** @type {Vkeys} */
let vk;
/** @type {Library} */
let lib_manager;
/** @type {LibraryTree} */
let library_tree;
/** @type {searchLibrary} */
let sL;
/** @type {JumpSearch} */
let jumpSearch;
let libraryPanel;
/** @type {Buttons} */
let but;
let men;
/** @type {Timers} */
let timer;
let library;

var libraryInitialized = false;
function initLibraryPanel() {
    if (!libraryInitialized) {
        ui = new userinterface();
        sbar = new Scrollbar();
        p = new panel_operations();
        vk = new Vkeys();
        lib_manager = new Library();
        library_tree = new LibraryTree();
        if (libraryProps.searchMode) {
            sL = new searchLibrary();
        }
        jumpSearch = new JumpSearch();
        libraryPanel = new LibraryPanel();
        // but = new button_manager();
        but = new Buttons();
        men = new MenuItems();
        timer = new Timers();
        timer.lib();
        library = new LibraryCallbacks();

        libraryInitialized = true;
    } else {
        // safely refresh in case changes happened while library was not visible
        // lib_manager.treeState(false, 2);
    }
}

function initLibraryColors() {
	ui = new userinterface();
	if (pref.whiteTheme) {
		ui.col.bg = g_theme.colors.pss_back;
		ui.iconcol_h = rgb(0, 0, 0);
		ui.col.iconPlus = rgb(80, 80, 80);
		ui.col.iconPlus_h = rgb(0, 0, 0);
		ui.col.iconMinus_e = rgb(80, 80, 80);
		ui.col.iconMinus_c = rgb(80, 80, 80);
		ui.col.iconMinus_h = rgb(0, 0, 0);
		ui.col.iconPlussel = rgb(255, 255, 255);
		ui.col.iconPlusbg = rgb(240, 240, 240);
		ui.col.txt_box = rgb(80, 80, 80);
		ui.col.text = rgb(100, 100, 100);
		ui.col.text_h = rgb(0, 0, 0);
		ui.col.textsel = rgb(255, 255, 255);
		ui.col.search = rgb(100, 100, 100);
		ui.col.searchBtn = rgb(0, 0, 0);
		ui.col.crossBtn = rgb(80, 80, 80);
		ui.col.filter = rgb(120, 120, 120);
		ui.col.filterBtn = rgb(120, 120, 120);
		ui.selcol = g_pl_colors.artist_playing;
		ui.col.line = rgb(200, 200, 200);
		ui.s_linecol = rgb(200, 200, 200);
	} else if (pref.blackTheme) {
		ui.col.bg = g_theme.colors.pss_back;
		ui.col.iconPlus = rgb(220, 220, 220);
		ui.col.iconPlus_h = rgb(255, 255, 255);
		ui.col.iconMinus_e = rgb(220, 220, 220);
		ui.col.iconMinus_c = rgb(220, 220, 220);
		ui.col.iconMinus_h = rgb(255, 255, 255);
		ui.col.iconPlussel = rgb(255, 255, 255);
		ui.col.iconPlusbg = rgb(45, 45, 45);
		ui.col.txt_box  = g_pl_colors.artist_playing;
		ui.col.text = rgb(200, 200, 200);
		ui.col.text_h = rgb(255, 255, 255);
		ui.col.textsel = rgb(255, 255, 255);
		ui.col.search = rgb(200, 200, 200);
		ui.col.searchBtn = rgb(255, 255, 255);
		ui.col.crossBtn = rgb(255, 255, 255);
		ui.col.filter = rgb(220, 220, 220);
		ui.col.filterBtn = rgb(220, 220, 220);
		ui.selcol = g_pl_colors.artist_playing;
		ui.col.line = rgb(45, 45, 45);
		ui.s_linecol = rgb(45, 45, 45);
	} else if (pref.blueTheme) {
		ui.col.bg = g_theme.colors.pss_back;
		ui.col.iconPlus = rgb(242, 230, 170);
		ui.col.iconPlus_h = rgb(255, 255, 255);
		ui.col.iconMinus_e = rgb(242, 230, 170);
		ui.col.iconMinus_c = rgb(242, 230, 170);
		ui.col.iconMinus_h = rgb(255, 255, 255);
		ui.col.iconPlussel = rgb(255, 255, 255);
		ui.col.iconPlusbg = rgb(10, 130, 220);
		ui.col.txt_box = rgb(230, 230, 230);
		ui.col.text = rgb(230, 230, 230);
		ui.col.text_h = rgb(255, 255, 255);
		ui.col.textsel = rgb(255, 255, 255);
		ui.col.search = rgb(230, 230, 230);
		ui.col.searchBtn = rgb(242, 230, 170);
		ui.col.crossBtn = rgb(242, 230, 170);
		ui.col.filter = rgb(230, 230, 230);
		ui.col.filterBtn = rgb(230, 230, 230);
		ui.selcol = rgb(242, 230, 170);
		ui.col.line = rgb(17, 100, 182);
		ui.s_linecol = rgb(17, 100, 182);
	} else if (pref.darkblueTheme) {
		ui.col.bg = g_theme.colors.pss_back;
		ui.col.iconPlus = rgb(255, 202, 128);
		ui.col.iconPlus_h = rgb(255, 255, 255);
		ui.col.iconMinus_e = rgb(255, 202, 128);
		ui.col.iconMinus_c = rgb(255, 202, 128);
		ui.col.iconMinus_h = rgb(255, 255, 255);
		ui.col.iconPlussel = rgb(255, 255, 255);
		ui.col.iconPlusbg = rgb(24, 50, 82);
		ui.col.txt_box = rgb(230, 230, 230);
		ui.col.text = rgb(230, 230, 230);
		ui.col.text_h = rgb(255, 255, 255);
		ui.col.textsel = rgb(255, 255, 255);
		ui.col.search = rgb(230, 230, 230);
		ui.col.searchBtn = rgb(255, 202, 128);
		ui.col.crossBtn = rgb(255, 202, 128);
		ui.col.filter = rgb(230, 230, 230);
		ui.col.filterBtn = rgb(230, 230, 230);
		ui.selcol = rgb(242, 230, 170);
		ui.col.line = rgb(12, 21, 31);
		ui.s_linecol = rgb(12, 21, 31);
	} else if (pref.redTheme) {
		ui.col.bg = g_theme.colors.pss_back;
		ui.col.iconPlus = rgb(245, 212, 165);
		ui.col.iconPlus_h = rgb(255, 255, 255);
		ui.col.iconMinus_e = rgb(255, 202, 128);
		ui.col.iconMinus_c = rgb(255, 202, 128);
		ui.col.iconMinus_h = rgb(255, 255, 255);
		ui.col.iconPlussel = rgb(255, 255, 255);
		ui.col.iconPlusbg = rgb(140, 25, 25);
		ui.col.txt_box = rgb(230, 230, 230);
		ui.col.text = rgb(230, 230, 230);
		ui.col.text_h = rgb(255, 255, 255);
		ui.col.textsel = rgb(255, 255, 255);
		ui.col.search = rgb(230, 230, 230);
		ui.col.searchBtn = rgb(245, 212, 165);
		ui.col.crossBtn = rgb(245, 212, 165);
		ui.col.filter = rgb(230, 230, 230);
		ui.col.filterBtn = rgb(230, 230, 230);
		ui.selcol = rgb(230, 230, 230);
		ui.col.line = rgb(75, 18, 18);
		ui.s_linecol = rgb(75, 18, 18);
	} else if (pref.creamTheme) {
		ui.col.bg = g_theme.colors.pss_back;
		ui.col.iconPlus = rgb(100, 150, 110);
		ui.col.iconPlus_h = rgb(0, 0, 0);
		ui.col.iconMinus_e = rgb(100, 150, 110);
		ui.col.iconMinus_c = rgb(100, 150, 110);
		ui.col.iconMinus_h = rgb(0, 0, 0);
		ui.col.iconPlussel = rgb(255, 255, 255);
		ui.col.iconPlusbg = rgb(255, 255, 255);
		ui.col.txt_box = rgb(90, 90, 90);
		ui.col.text = rgb(90, 90, 90);
		ui.col.text_h = rgb(0, 0, 0);
		ui.col.textsel = rgb(255, 255, 255);
		ui.col.search = rgb(90, 90, 90);
		ui.col.searchBtn = rgb(120, 170, 130);
		ui.col.crossBtn = rgb(120, 170, 130);
		ui.col.filter = rgb(120, 120, 120);
		ui.col.filterBtn = rgb(120, 170, 130);
		ui.selcol = rgb(90, 90, 90);
		ui.col.line = rgb(200, 200, 200);
		ui.s_linecol = rgb(200, 200, 200);
	} else if (pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme) {
		ui.col.bg = g_theme.colors.pss_back;
		ui.col.iconPlus = g_pl_colors.artist_playing;
		ui.col.iconPlus_h = rgb(255, 255, 255);
		ui.col.iconMinus_e = g_pl_colors.artist_playing;
		ui.col.iconMinus_c = g_pl_colors.artist_playing;
		ui.col.iconMinus_h = rgb(255, 255, 255);
		ui.col.iconPlussel = rgb(255, 255, 255);
		ui.col.iconPlusbg = rgb(45, 45, 45);
		ui.col.txt_box = rgb(200, 200, 200);
		ui.col.text = rgb(200, 200, 200);
		ui.col.text_h = rgb(255, 255, 255);
		ui.col.textsel = rgb(255, 255, 255);
		ui.col.search = rgb(200, 200, 200);
		ui.col.searchBtn = g_pl_colors.artist_playing;
		ui.col.crossBtn = g_pl_colors.artist_playing;
		ui.col.filter = rgb(200, 200, 200);
		ui.col.filterBtn = g_pl_colors.artist_playing;
		ui.selcol = rgb(25, 25, 25);
		ui.col.line = rgb(45, 45, 45);
		ui.s_linecol = rgb(45, 45, 45);
	}

}
initLibraryColors();

function freeLibraryPanel() {
    ui = null;
    sbar = null;
    p = null;
    vk = null;
    lib_manager = null;
    library_tree = null;
    sL = null;
    jumpSearch = null;
    libraryPanel = null;
    but = null;
    men = null;
    timer = null;
    library = null;
    libraryInitialized = false;
}

window.SetProperty("SYSTEM.Software Notice Checked", true);
window.SetProperty(" Node: Item Counts 0-Hide 1-Tracks 2-Sub-Items", null);
window.SetProperty(" Node: Show All Music", null);
window.SetProperty(" Playlist: Play On Send From Menu", null);
window.SetProperty(" Text Single-Click: AutoFill Playlist", null);
window.SetProperty("ADV.Height Auto [Expand/Collapse With All Music]", null);
window.SetProperty("SYSTEM.Zoom Update", true);