'use strict';

/**
 * A collection of all library class instances.
 * @typedef  {object} lib - The library main object.
 * @property {LibUserInterface} ui - The instance of `LibUserInterface` class for ui operations.
 * @property {LibPanel} panel - The instance of `LibPanel` class for panel operations.
 * @property {LibScrollbar} sbar - The instance of `LibScrollbar` class for scrollbar operations.
 * @property {LibVkeys} vk - The instance of `LibVkeys` class for vkeys operations.
 * @property {LibLibrary} lib - The instance of `LibLibrary` class for lib operations.
 * @property {LibPopulate} pop - The instance of `LibPopulate` class for populating library operations.
 * @property {LibSearch} search - The instance of `LibSearch` class for search operations.
 * @property {LibFind} find - The instance of `LibFind` class for find operations.
 * @property {LibButtons} but - The instance of `LibButtons` class for buttons operations.
 * @property {LibPopUpBox} popUpBox - The instance of `LibPopUpBox` class for popup operations.
 * @property {LibMenuItems} men - The instance of `LibMenuItems` class for menu operations.
 * @property {LibTimers} timer - The instance of `LibTimers` class for timer operations.
 * @property {LibCallbacks} call - The instance of `LibCallbacks` class for callback operations.
 */
/** @global @type {lib} */
const lib = {};

lib.ui       = new LibUserInterface();
lib.panel    = new LibPanel();
lib.sbar     = new LibScrollbar();
lib.vk       = new LibVkeys();
lib.lib      = new LibLibrary();
lib.pop      = new LibPopulate();
lib.search   = new LibSearch();
lib.find     = new LibFind();
lib.but      = new LibButtons();
lib.popUpBox = new LibPopUpBox();
lib.men      = new LibMenuItems();
lib.timer    = new LibTimers();

if (!libSet.get('Panel Library - Software Notice Checked', true)) fb.ShowPopupMessage('License\r\n\r\nCopyright (c) 2021-2022 WilB\r\n\r\nThe above copyright notice shall be included in all copies or substantial portions of the Software.\r\n\r\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.', 'Library Tree');
     libSet.set('Panel Library - Software Notice Checked', true);
