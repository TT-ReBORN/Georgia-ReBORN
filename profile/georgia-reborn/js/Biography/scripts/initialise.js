class BiographyPanel {
	constructor() {
		this.x = -1; // not set
		this.y = -1; // not set
		this.w = -1; // not set
		this.h = -1; // not set
		// Set Biography Window Size and Padding
		pptBio.borT  = pref.layout_mode === 'artwork_mode' ? scaleForDisplay(70) : scaleForDisplay(70);
		pptBio.borL  = pref.layout_mode === 'artwork_mode' ? scaleForDisplay(30) : scaleForDisplay(40);
		pptBio.borR  = pref.layout_mode === 'artwork_mode' ? scaleForDisplay(30) : scaleForDisplay(40);
		pptBio.textT = pref.layout_mode === 'artwork_mode' ? scaleForDisplay(70) : scaleForDisplay(70);
		pptBio.textL = pref.layout_mode === 'artwork_mode' ? scaleForDisplay(30) : scaleForDisplay(40);
		pptBio.textR = pref.layout_mode === 'artwork_mode' ? scaleForDisplay(30) : scaleForDisplay(40);
		pptBio.gap   = scaleForDisplay(11);
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
}


/** @type {UserInterfaceBio} */
let uiBio = new UserInterfaceBio;
/** @type {VkeysBio} */
let vkBio = new VkeysBio;
/** @type {PanelBio} */
let panelBio = new PanelBio;
/** @type {Names} */
let name = new Names;
/** @type {ScrollbarBio} */
let alb_scrollbar = new ScrollbarBio;
let art_scrollbar = new ScrollbarBio;
let art_scroller = new ScrollbarBio;
let cov_scroller = new ScrollbarBio;
/** @type {ButtonsBio} */
let butBio = new ButtonsBio;
/** @type {PopUpBoxBio} */
let popUpBoxBio = new PopUpBoxBio;
/** @type {Text} */
let txt = new Text;
/** @type {TaggerBio} */
let tagBio = new TaggerBio;
/** @type {ResizeHandler} */
let resize = new ResizeHandler;
/** @type {LibraryBio} */
let libBio = new LibraryBio;
/** @type {ImagesBio} */
let imgBio = new ImagesBio;
/** @type {Seeker} */
let seeker = new Seeker;
/** @type {FilmStrip} */
let filmStrip = new FilmStrip;
/** @type {TimersBio} */
let timerBio = new TimersBio;
/** @type {MenuItemsBio} */
let menBio = new MenuItemsBio;
/** @type {ServerBio} */
let serverBio = new ServerBio;
/** @type {BiographyPanel} */
let biographyPanel;
/** @type {BiographyCallbacks} */
let biography;

alb_scrollbar.type = 'alb';
art_scrollbar.type = 'art';
art_scroller.type = 'film';
cov_scroller.type = 'film';

timerBio.image();

timerBio.clear(timerBio.zSearch);
timerBio.zSearch.id = setTimeout(() => {
		if (panelBio.serverBio && pptBio.panelActive) {
		serverBio.download(false, {ix:0, focus:false}, {ix:0, focus:false}); serverBio.download(false, {ix:0, focus:true}, {ix:0, focus:true});
		}
		timerBio.zSearch.id = null;
}, 3000);

//if (!pptBio.get('Software Notice Checked', false)) fb.ShowPopupMessage('License\r\n\r\nCopyright (c) 2021 WilB\r\n\r\nThe above copyright notice shall be included in all copies or substantial portions of the Software.\r\n\r\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.', 'Biography');
//pptBio.set('Software Notice Checked', true);


var biographyInitialized = false;

function initBiographyPanel() {
	if (!biographyInitialized) {
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
		biographyPanel = new BiographyPanel();
		biography = new BiographyCallbacks();

		biographyInitialized = true;
	}
}

function freeBiographyPanel() {
	uiBio = null;
	vkBio = null;
	panelBio = null;
	name = null;
	alb_scrollbar = null;
	art_scrollbar = null;
	butBio = null;
	menBio = null;
	txt = null;
	tagBio = null;
	libBio = null;
	imgBio = null;
	timerBio = null;
	serverBio = null;
	biographyPanel = null;
	biographyInitialized = false;
}

uiBio.getFont();
