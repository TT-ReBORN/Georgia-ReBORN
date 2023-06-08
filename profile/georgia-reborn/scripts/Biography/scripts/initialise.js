'use strict';

/** @type {UserInterfaceBio} */
let uiBio = new UserInterfaceBio();
/** @type {VkeysBio} */
let vkBio = new VkeysBio();
/** @type {PanelBio} */
let panelBio = new PanelBio();
/** @type {Names} */
let name = new Names();
/** @type {ScrollbarBio} */
let alb_scrollbar = new ScrollbarBio();
let art_scrollbar = new ScrollbarBio();
let art_scroller = new ScrollbarBio();
let cov_scroller = new ScrollbarBio();
/** @type {ButtonsBio} */
let butBio = new ButtonsBio();
/** @type {PopUpBoxBio} */
let popUpBoxBio = new PopUpBoxBio();
/** @type {Text} */
let txt = new Text();
/** @type {TaggerBio} */
let tagBio = new TaggerBio();
/** @type {ResizeHandler} */
let resize = new ResizeHandler();
/** @type {LibraryBio} */
let libBio = new LibraryBio();
/** @type {ImagesBio} */
let imgBio = new ImagesBio();
/** @type {Seeker} */
let seeker = new Seeker();
/** @type {FilmStrip} */
let filmStrip = new FilmStrip();
/** @type {TimersBio} */
let timerBio = new TimersBio();
/** @type {MenuItemsBio} */
let menBio = new MenuItemsBio();
/** @type {ServerBio} */
let serverBio = new ServerBio();
/** @type {InfoboxBio} */
let infoboxBio = new InfoboxBio();
/** @type {LyricsBio} */
let lyricsBio; if (panelBio.id.lyricsSource) lyricsBio = new LyricsBio();

alb_scrollbar.type = 'alb';
art_scrollbar.type = 'art';
art_scroller.type = 'film';
cov_scroller.type = 'film';

timerBio.image();

timerBio.clear(timerBio.zSearch);
timerBio.zSearch.id = setTimeout(() => {
	if ($Bio.server && pptBio.panelActive) {
	serverBio.download(false, { ix: 0, focus: false }, { ix: 0, focus: false }); serverBio.download(false, { ix: 0, focus: true }, { ix: 0, focus: true });
	}
	timerBio.zSearch.id = null;
}, 3000);

// if (!pptBio.get('Panel Biography - System: Software Notice Checked', false)) fb.ShowPopupMessage('License\r\n\r\nCopyright (c) 2021-2022 WilB\r\n\r\nThe above copyright notice shall be included in all copies or substantial portions of the Software.\r\n\r\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.', 'Biography');
// pptBio.set('Panel Biography - System: Software Notice Checked', true);
