'use strict';

/**
 * A collection of all biography class instances.
 * @typedef  {object} bio - The biography main object.
 * @property {BioUserInterface} ui - The instance of `BioUserInterface` class for ui operations.
 * @property {BioVkeys} vk - The instance of `BioVkeys` class for vkeys operations.
 * @property {BioPanel} panel - The instance of `BioPanel` class for panel operations.
 * @property {BioNames} name - The instance of `BioNames` class for name operations.
 * @property {BioScrollbar} alb_scrollbar - The instance of `BioScrollbar` class for scrollbar operations.
 * @property {BioScrollbar} art_scrollbar - The instance of `BioScrollbar` class for scrollbar operations.
 * @property {BioScrollbar} art_scroller - The instance of `BioScrollbar` class for scrollbar operations.
 * @property {BioScrollbar} cov_scroller - The instance of `BioScrollbar` class for scrollbar operations.
 * @property {BioButtons} but - The instance of `BioButtons` class for button operations.
 * @property {BioPopUpBox} popUpBox - The instance of `BioPopUpBox` class for popup operations.
 * @property {BioText} txt - The instance of `BioText` class for text operations.
 * @property {BioTagger} tag - The instance of `BioTagger` class for tagger operations.
 * @property {BioResizeHandler} resize - The instance of `BioResizeHandler` class for resize operations.
 * @property {BioLibrary} lib - The instance of `BioLibrary` class for lib operations.
 * @property {BioImages} img - The instance of `BioImages` class for image operations.
 * @property {BioSeeker} seeker - The instance of `BioSeeker` class for seeker operations.
 * @property {BioFilmStrip} filmStrip - The instance of `BioFilmStrip` class for filmstrip operations.
 * @property {BioTimers} timer - The instance of `BioTimers` class for timer operations.
 * @property {BioMenuItems} men - The instance of `BioMenuItems` class for menu operations.
 * @property {BioServer} server - The instance of `BioServer` class for server operations.
 * @property {BioInfobox} infobox - The instance of `BioInfobox` class for info operations.
 * @property {BioLyrics} lyrics - The instance of `BioLyrics` class for lyric operations.
 * @property {BioCallbacks} call - The instance of `BioCallbacks` class for callback operations.
 */
/** @global @type {bio} */
const bio = {};

bio.initialized = false;

bio.ui            = new BioUserInterface();
bio.vk            = new BioVkeys();
bio.panel         = new BioPanel();
bio.name          = new BioNames();
bio.alb_scrollbar = new BioScrollbar();
bio.art_scrollbar = new BioScrollbar();
bio.art_scroller  = new BioScrollbar();
bio.cov_scroller  = new BioScrollbar();
bio.but           = new BioButtons();
bio.popUpBox      = new BioPopUpBox();
bio.txt           = new BioText();
bio.tag           = new BioTagger();
bio.resize        = new BioResizeHandler();
bio.lib           = new BioLibrary();
bio.img           = new BioImages();
bio.seeker        = new BioSeeker();
bio.filmStrip     = new BioFilmStrip();
bio.timer         = new BioTimers();
bio.men           = new BioMenuItems();
bio.server        = new BioServer();
bio.infobox       = new BioInfobox();
if (bio.panel.id.lyricsSource) {
	bio.lyrics    = new BioLyrics();
}

bio.alb_scrollbar.type = 'alb';
bio.art_scrollbar.type = 'art';
bio.art_scroller.type = 'film';
bio.cov_scroller.type = 'film';

bio.timer.image();
bio.timer.clear(bio.timer.zSearch);
bio.timer.zSearch.id = setTimeout(() => {
	if ($Bio.server && bioSet.panelActive) {
		bio.server.download(false, { ix: 0, focus: false }, { ix: 0, focus: false });
		bio.server.download(false, { ix: 0, focus: true  }, { ix: 0, focus: true });
	}
	bio.timer.zSearch.id = null;
}, 3000);

if (!bioSet.get('Panel Biography - System: Software Notice Checked', true)) fb.ShowPopupMessage('License\r\n\r\nCopyright (c) 2021-2023 WilB\r\n\r\nThe above copyright notice shall be included in all copies or substantial portions of the Software.\r\n\r\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.', 'Biography');
	 bioSet.set('Panel Biography - System: Software Notice Checked', true);
