class LibraryPanel {
	constructor() {
		this.x = -1; // not set
		this.y = -1; // not set
		this.w = -1; // not set
		this.h = -1; // not set
	}

	on_paint(gr) {
		ui.draw(gr);
		lib.checkTree();
		img.draw(gr);
		ui.drawLine(gr);
		search.draw(gr);
		pop.draw(gr);
		sbar.draw(gr);
		but.draw(gr);
		find.draw(gr);

		gr.FillSolidRect(this.x, 0, this.w, geo.top_art_spacing, col.bg); // Hides top row that shouldn't be visible
		gr.FillSolidRect(this.x, this.y + this.h, this.w, this.h, col.bg); // Hides bottom row that shouldn't be visible

		if (ppt.albumArtFlowMode && panel.imgView) {
			gr.FillSolidRect(this.x, this.y, scaleForDisplay(20), this.h - ui.sbar.but_h, ui.col.bg); // Margin left and masking for horizontal flow mode
			gr.FillSolidRect(this.x + this.w - scaleForDisplay(20), this.y, scaleForDisplay(20), this.h - ui.sbar.but_h, ui.col.bg); // Margin right and masking for horizontal flow mode
		}

		// Library's top shadow
		gr.FillGradRect(this.x, is_4k ? this.y - 10 : (pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? this.y - 5 : this.y - 6), this.w, is_4k ? 10 : 6, 90, RGBtoRGBA(col.shadow, 0),
			pref.whiteTheme ? RGBtoRGBA(col.shadow, 24) :
			pref.blackTheme ? RGBtoRGBA(col.shadow, 120) :
			pref.rebornTheme ? RGBtoRGBA(col.shadow, 40) :
			pref.blueTheme ? RGBtoRGBA(col.shadow, 26) :
			pref.darkblueTheme ? RGBtoRGBA(col.shadow, 72) :
			pref.redTheme ? RGBtoRGBA(col.shadow, 72) :
			pref.creamTheme ? RGBtoRGBA(col.shadow, 24) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGBtoRGBA(col.shadow, 120) : ''
		);
		// Library's left shadow
		gr.FillGradRect(this.x - 4, this.y, 4, this.h, 0, RGBtoRGBA(col.shadow, 0),
			pref.whiteTheme ? RGBtoRGBA(col.shadow, 24) :
			pref.blackTheme ? RGBtoRGBA(col.shadow, 120) :
			pref.rebornTheme ? RGBtoRGBA(col.shadow, 40) :
			pref.blueTheme ? RGBtoRGBA(col.shadow, 38) :
			pref.darkblueTheme ? RGBtoRGBA(col.shadow, 60) :
			pref.redTheme ? RGBtoRGBA(col.shadow, 64) :
			pref.creamTheme ? RGBtoRGBA(col.shadow, 28) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGBtoRGBA(col.shadow, 120) : ''
		);
		// Library's bottom shadow
		gr.FillGradRect(this.x, is_4k ? this.y + (pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? this.h : this.h + 1) : this.y + this.h - 1, this.w, scaleForDisplay(5), 90,
			pref.whiteTheme ? RGBtoRGBA(col.shadow, 18) :
			pref.blackTheme ? RGBtoRGBA(col.shadow, 120) :
			pref.rebornTheme ? RGBtoRGBA(col.shadow, 30) :
			pref.blueTheme ? RGBtoRGBA(col.shadow, 26) :
			pref.darkblueTheme ? RGBtoRGBA(col.shadow, 74) :
			pref.redTheme ? RGBtoRGBA(col.shadow, 74) :
			pref.creamTheme ? RGBtoRGBA(col.shadow, 18) :
			pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme ? RGBtoRGBA(col.shadow, 86) : '',
			RGBtoRGBA(col.shadow, 0)
		);
	}

	on_size(x, y, width, height) {
		this.x = x;
		this.y = y;
		this.w = width;
		this.h = height;
		ui.x = x;
		ui.y = y;
		ui.w = width;
		ui.h = height;
		ppt.margin = scaleForDisplay(20);
		ppt.verticalPad = 5; // Setup default line padding value needed, otherwise 0 on reset
		if (!ui.w || !ui.h) return;
		pop.deactivateTooltip();
		ui.blurReset();
		ui.getFont();
		panel.on_size();
		if (ppt.searchShow || ppt.sbarShow) but.refresh(true);
		sbar.resetAuto();
		find.on_size();
		but.createImages();
		pop.createImages();

		if (pref.autoHideScrollbar_Library && sbar.vertical) {
			ui.sbar.but_w = 0;
			sbar.w = 0;
			but.refresh(true);
		} else if (sbar.vertical) {
			ui.sbar.but_w = scaleForDisplay(12);
			sbar.w = scaleForDisplay(12);
			but.refresh(true);
		}
		if (pref.autoHideScrollbar_Library && !sbar.vertical) {
			ui.sbar.but_w = 0;
			sbar.h = 0;
			but.refresh(true);
		} else if (!sbar.vertical) {
			ui.sbar.but_w = scaleForDisplay(12);
			sbar.h = scaleForDisplay(12);
			but.refresh(true);
		}

		if (pref.always_showPlayingLib) {
			pop.nowPlayingShow();
		}

		// Dynamic library album cover thumbnail resizing
		if (pref.libraryThumbnailSize === 'auto') {
			if (!is_4k) {
				if ((pref.layout_mode === 'default_mode' && ww <= 1140 && wh <= 730 || pref.layout_mode === 'artwork_mode' && ww <= 526 && wh <= 686) && (ppt.albumArtShow || pref.libraryDesign === 'albumCovers') && pref.libraryThumbnailSize === 'auto') {
					ppt.thumbNailSize = 1;
					if (pref.libraryDesign === 'listView_albumCovers' || pref.libraryDesign === 'listView_artistPhotos') ppt.thumbNailSize = 0;
				}
				else if ((pref.layout_mode === 'default_mode' && ww >= 1140 && wh >= 730 || pref.layout_mode === 'artwork_mode' && ww >= 526 && wh >= 686) && (ppt.albumArtShow || pref.libraryDesign === 'albumCovers') && pref.libraryThumbnailSize === 'auto') {
					ppt.thumbNailSize = 2;
					if (pref.libraryDesign === 'listView_albumCovers') ppt.thumbNailSize = 1; else if (pref.libraryDesign === 'listView_artistPhotos') ppt.thumbNailSize = 0;
				}
				if ((pref.layout_mode === 'default_mode' && ww > 1600 && wh > 960 || pref.layout_mode === 'artwork_mode' && ww > 700 && wh > 860) && (ppt.albumArtShow || pref.libraryDesign === 'albumCovers') && pref.libraryThumbnailSize === 'auto') {
					ppt.thumbNailSize = 3;
					if (pref.libraryDesign === 'listView_albumCovers' || pref.libraryDesign === 'listView_artistPhotos') ppt.thumbNailSize = 1;
				}
			}
			else if (is_4k) {
				if ((pref.layout_mode === 'default_mode' && ww <= 2300 && wh <= 1470 || pref.layout_mode === 'artwork_mode' && ww <= 1052 && wh <= 1372) && (ppt.albumArtShow || pref.libraryDesign === 'albumCovers') && pref.libraryThumbnailSize === 'auto') {
					pref.libraryLayout === 'normal_width' ? ppt.thumbNailSize = 1 : ppt.thumbNailSize = 2;
					if (pref.libraryDesign === 'listView_albumCovers' || pref.libraryDesign === 'listView_artistPhotos') ppt.thumbNailSize = 0;
				}
				if ((pref.layout_mode === 'default_mode' && ww > 2301 && wh > 1471 || pref.layout_mode === 'artwork_mode' && ww > 1053 && wh > 1373) && (ppt.albumArtShow || pref.libraryDesign === 'albumCovers') && pref.libraryThumbnailSize === 'auto') {
					ppt.thumbNailSize = 2;
					if (pref.libraryDesign === 'listView_albumCovers') ppt.thumbNailSize = 1; else if (pref.libraryDesign === 'listView_artistPhotos') ppt.thumbNailSize = 0;
				}
				if (pref.layout_mode === 'default_mode' && ww > 2800 && wh > 1720 || pref.layout_mode === 'artwork_mode' && ww > 1400 && wh > 1720 && (ppt.albumArtShow || pref.libraryDesign === 'albumCovers') && pref.libraryThumbnailSize === 'auto') {
					ppt.thumbNailSize = 3;
					if (pref.libraryDesign === 'listView_albumCovers' || pref.libraryDesign === 'listView_artistPhotos') ppt.thumbNailSize = 1;
				}
			}
		}
	}
}

/** @type {UserInterface} */
let ui = new UserInterface;
/** @type {Panel} */
let panel = new Panel;
/** @type {Scrollbar} */
let sbar = new Scrollbar;
/** @type {Vkeys} */
let vk = new Vkeys;
/** @type {Library} */
let lib = new Library;
/** @type {Populate} */
let pop = new Populate;
/** @type {Search} */
let search = new Search;
/** @type {Find} */
let find = new Find;
/** @type {Buttons} */
let but = new Buttons;
/** @type {PopUpBox} */
let popUpBox = new PopUpBox;
/** @type {MenuItems} */
let men = new MenuItems;
/** @type {Timers} */
let timer = new Timers;
/** @type {LibraryPanel} */
let libraryPanel = new LibraryPanel;
/** @type {LibraryCallbacks} */
let library;
//timer.lib();

//if (!ppt.get('Software Notice Checked', false)) fb.ShowPopupMessage('License\r\n\r\nCopyright (c) 2021 WilB\r\n\r\nThe above copyright notice shall be included in all copies or substantial portions of the Software.\r\n\r\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.', 'Library Tree');
//ppt.set('Software Notice Checked', true);


var libraryInitialized = false;

function initLibraryPanel() {
	if (!libraryInitialized) {
		ui = new UserInterface();
		panel = new Panel();
		sbar = new Scrollbar();
		vk = new Vkeys();
		lib = new Library();
		pop = new Populate();
		search = new Search();
		find = new Find();
		but = new Buttons();
		popUpBox = new PopUpBox();
		//men = new MenuItems(); // Disabled -> double context menu entries if created
		timer = new Timers();
		timer.lib();
		libraryPanel = new LibraryPanel();
		library = new LibraryCallbacks();

		libraryInitialized = true;
	}
}

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
