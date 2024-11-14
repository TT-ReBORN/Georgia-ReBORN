/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Custom Menu                              * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred                                                 * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-RC3                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    14-11-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


//////////////////////////////
// * CUSTOM MENU CONTROLS * //
//////////////////////////////
/**
 * A class that creates the base control for handling mouse and keyboard events for the custom menu.
 */
class CustomMenu {
	/**
	 * Creates the `CustomMenu` instance.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {string} label - The menu names.
	 */
	constructor(x, y, label) {
		/** @protected @type {number} */
		this.x = x;
		/** @protected @type {number} */
		this.y = y;
		/** @protected @type {string} */
		this.label = label;

		/** @protected @type {object} */
		this.state = {};
		/** @private @constant @type {number} */
		this.doubleClickTime = 300;
		/** @private @type {number} */
		this.lastClickTime = null;
		/** @protected @type {boolean} */
		this.focus = false;
		/** @protected @type {boolean} */
		this.disabled = false;
		/** @protected @type {boolean} */
		this._hovered = false;
		/** @public @type {object} The hovered control object used in custom theme menu. */
		this.hoveredControl = null;
		/** @public @type {boolean} The mouse button pressed state, used in custom theme menu. */
		this.mouseIsDown = false;

		/** @protected @type {string} */
		this.font = grFont.popup;
		/** @protected @type {boolean} */
		this.closeBtn = this.label === '\u2715';

		const gdiService = GdiService.getInstance();
		/** @protected @type {GdiGraphics} */
		this.g = gdiService.getGraphics();
	}

	// * GETTERS & SETTERS * //
	// #region GETTERS & SETTERS
	/**
	 * Gets the active control.
	 * @returns {CustomMenu | null} The active control instance or null.
	 * @static
	 */
	static get activeControl() {
		return CustomMenu._activeControl;
	}

	/**
	 * Sets the active control.
	 * @param {CustomMenu} control - An instance of CustomMenu to set as active.
	 * @static
	 */
	static set activeControl(control) {
		CustomMenu._activeControl = control;
	}

	/**
	 * Gets the control list.
	 * @returns {CustomMenu | null} The control list instance or null.
	 * @static
	 */
	static get controlList() {
		return CustomMenu._controlList;
	}

	/**
	 * Sets the control list.
	 * @param {CustomMenu} list - An instance of CustomMenu to set as active.
	 * @static
	 */
	static set controlList(list) {
		CustomMenu._controlList = list;
	}

	/**
	 * Gets the menu button hover state.
	 * @returns {boolean} True or false.
	 */
	get hovered() {
		return this._hovered;
	}

	/**
	 * Sets the menu button hover state.
	 * If you need to repaint on hovered value changing do override this method in child class.
	 * @param {boolean} value - True or false.
	 */
	set hovered(value) {
		this._hovered = value;
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Calculates the width of a given text using a specified font and optionally rounds the result.
	 * @param {string} text - The text for which the width will be calculated.
	 * @param {GdiFont} font - The font to use for calculating the width.
	 * @param {boolean} [round] - The rounded value if set.
	 * @returns {number} The text width number of the used font.
	 */
	calcTextWidth(text, font, round) {
		const w = this.g.CalcTextWidth(text, font);
		return round ? Math.ceil(w) : w;
	}

	/**
	 * Calculates the height of a given text using a specified font and optionally rounds the result.
	 * @param {string} text - The text for which the height will be calculated.
	 * @param {GdiFont} font - The font to use for calculating the height.
	 * @param {boolean} [round] - The rounded value if set.
	 * @returns {number} The text height number of the used font.
	 */
	calcTextHeight(text, font, round) {
		const h = this.g.CalcTextHeight(text, font);
		return round ? Math.ceil(h) : h;
	}

	/**
	 * Clears the focus of the control.
	 */
	clearFocus() {
		this.focus = false;
	}

	/**
	 * Releases the graphics object associated with the getImage method.
	 */
	destructor() {
		const gdiService = GdiService.getInstance();
		gdiService.releaseGraphics(this.g);
	}
	// #endregion

	// * VIRTUAL METHODS * //
	// #region VIRTUAL METHODS
	/**
	 * A placeholder that handles mouse down events.
	 * These aren't really virtually, just stubbed so that not every child needs to create one if it wants to ignore these events.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	mouseDown(x, y) {}

	/**
	 * A placeholder that handles letter keystrokes events.
	 * These aren't really virtually, just stubbed so that not every child needs to create one if it wants to ignore these events.
	 * @param {number} code - The character code.
	 */
	onChar(code) {}

	/**
	 * A placeholder that handles keyboard events.
	 * These aren't really virtually, just stubbed so that not every child needs to create one if it wants to ignore these events.
	 * @param {number} vkey - The virtual key code.
	 */
	onKey(vkey) {}
	// #endregion

	// * CALLBACKS * //
	// #region CALLBACKS
	/**
	 * Handles character input events for an active control.
	 * @param {number} code - The character code.
	 */
	on_char(code) {
		if (CustomMenu.activeControl) {
			CustomMenu.activeControl.onChar(code);
		}
	}

	/**
	 * Handles key down events and calls the onKey method.
	 * @param {number} vkey - The virtual key code.
	 */
	on_key_down(vkey) {
		if (CustomMenu.activeControl) {
			CustomMenu.activeControl.onKey(vkey);
		}
	}

	/**
	 * Handles left mouse button down events.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	on_mouse_lbtn_down(x, y) {
		this.mouseIsDown = true;
	}

	/**
	 * Handles left mouse button up and double click events.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {string} m - The mouse mask.
	 */
	on_mouse_lbtn_up(x, y, m) {
		if (Date.now() - this.lastClickTime > this.doubleClickTime) {
			this.lastClickTime = Date.now();
			this.mouseIsDown = false;
			let found = false;
			if (CustomMenu.activeControl && CustomMenu.activeControl instanceof CustomMenuDropDown && CustomMenu.activeControl.isSelectUp && CustomMenu.activeControl.mouseInThis(x, y)) {
				CustomMenu.activeControl.clicked(x, y);
				found = true;
			}
			for (let i = CustomMenu.controlList.length - 1; i >= 0 && !found; i--) { // Reverse order for better z-index handling
				if (CustomMenu.controlList[i].mouseInThis(x, y)) {
					if (CustomMenu.activeControl && CustomMenu.activeControl !== CustomMenu.controlList[i]) CustomMenu.activeControl.clearFocus();
					CustomMenu.activeControl = CustomMenu.controlList[i];
					CustomMenu.activeControl.clicked(x, y);
					found = true;
				}
			}
			if (!found && CustomMenu.activeControl) {
				CustomMenu.activeControl.clearFocus();
				CustomMenu.activeControl = undefined;
			}
		}
		else {
			this.lastClickTime = Date.now();
			CustomMenu.activeControl && CustomMenu.activeControl.doubleClicked(x, y);
		}
	}

	/**
	 * Handles mouse movement events and updates the hovered control based on the mouse cursor's current position.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	on_mouse_move(x, y) {
		if (x === this.state.mouse_x && y === this.state.mouse_y) return;

		this.state.mouse_x = x;
		this.state.mouse_y = y;
		let found = false;

		const setHovered = (control) => {
			if (this.hoveredControl && this.hoveredControl !== control) this.hoveredControl.hovered = false; // Clear last hovered control
			this.hoveredControl = control;
			this.hoveredControl.hovered = true;
			found = true;
		};

		if (CustomMenu.activeControl && CustomMenu.activeControl instanceof CustomMenuDropDown &&
			CustomMenu.activeControl.isSelectUp && CustomMenu.activeControl.mouseInThis(x, y)) {  // handles z-index stuff in a janky way
			setHovered(CustomMenu.activeControl);
		}
		for (let i = CustomMenu.controlList.length - 1; i >= 0; i--) { // Traverse list in reverse order to better handle z-index issues
			if (CustomMenu.controlList[i].mouseInThis(x, y)) {
				setHovered(CustomMenu.controlList[i]);
				if (this.mouseIsDown) {
					CustomMenu.controlList[i].mouseDown(x, y);
				}
				break;
			}
		}
		if (!found && this.hoveredControl) {
			this.hoveredControl.hovered = false;
			this.hoveredControl = null;
		}
	}

	/**
	 * Handles resizing events and updates the display accordingly.
	 */
	on_size() {
		setTimeout(() => {
			if (grm.ui.displayCustomThemeMenu) grm.cthMenu.reinitCustomThemeMenu();
			else if (grm.ui.displayMetadataGridMenu) grm.gridMenu.initMetadataGridMenu();
			window.Repaint();
		}, 0);
	}
	// #endregion
}


///////////////////////////////
// * CUSTOM MENU DROP DOWN * //
///////////////////////////////
/**
 * A class that creates a dropdown menu for the custom menu.
 * @augments {CustomMenu}
 */
class CustomMenuDropDown extends CustomMenu {
	/**
	 * Creates the `CustomMenuDropDown` instance.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {string} label - The main drop down menu item.
	 * @param {string[]} labelArray - The submenu items of the main.
	 * @param {number} [activeIndex] - The index and state of the drop down main item.
	 */
	constructor(x, y, label, labelArray, activeIndex) {
		super(x, y, label);

		/** @private @type {string[]} */
		this.labelArray = labelArray;
		/** @private @type {number} */
		this.activeIndex = activeIndex || -1;
		/** @private @constant @type {number} The padding between top and label and option and bottom line. */
		this.padding = SCALE(5);
		/** @private @type {number} */
		this.labelW = this.calcTextWidth(label, this.font) + this.padding * 4;
		/** @private @type {number} */
		this.optionW = this.calcTextWidth(LongestString(this.labelArray), this.font) + this.padding * 4;
		/** @private @type {number} */
		this.w = Math.max(this.labelW, this.optionW);

		/** @private @constant @type {number} */
		this.labelHeight = Math.ceil(this.calcTextHeight('Ag', this.font));
		/** @private @constant @type {number} */
		this.optionHeight = Math.ceil(this.calcTextHeight('Ag', this.font));
		/** @private @type {number} */
		this.h = this.labelHeight + this.padding * 2;

		/** @private @constant */
		this.borderPadding = SCALE(5);
		/** @private @type {boolean} */
		this.selectUp = false;
		/** @private @type {number} The height of select up option. */
		this.selectUpHeight = (this.optionHeight + this.padding * 2) * this.labelArray.length;
		/** @private @type {number} When selectUp is visible, which item is hovered */
		this.selectUpHoveredOption = -1;
		/** @private @type {number} This is the index that is active when the selectUp is toggled. */
		this.selectUpActiveIndex = -1;
		/** @private @type {number} */
		this.selectedColor = RGB(0, 0, 0);
	}

	// * GETTERS & SETTERS * //
	// #region GETTERS & SETTERS
	/**
	 * Gets the drop down menu item hover state.
	 * @returns {boolean} True or false.
	 */
	get hovered() {
		return this._hovered;
	}

	/**
	 * Sets the drop down menu item hover state.
	 * @param {boolean} value - The hover state to set.
	 */
	set hovered(value) {
		this._hovered = value;
		this.repaint();
	}

	/**
	 * Gets the drop down menu item selection state.
	 * @returns {boolean} True or false.
	 */
	get isSelectUp() {
		return this.selectUp;
	}

	/**
	 * Sets the drop down menu item selection state.
	 * @param {boolean} value - The selection state to set.
	 */
	set isSelectUp(value) {
		this.selectUp = value;
	}
	// #endregion

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Displays and handles the color page of the panel in the custom menu.
	 * @param {string} label - The current label of the menu item.
	 * @param {string} labelArray - The panel color page to display.
	 * @param {number} activeIndex - The index of the currently selected item in the labelArray.
	 * @private
	 */
	_buttonHandler(label, labelArray, activeIndex) {
		const customThemeMenu = {
			Main_Pre:        () => { grm.ui.displayPanel('details', true); grm.cthMenu.initCustomThemeMenu('main', 'main_pre'); },
			Main_Bg:         () => { grm.ui.displayPanel('details', true); grm.cthMenu.initCustomThemeMenu('main', 'main_bg'); },
			Main_Bar:        () => { grm.ui.displayPanel('details', true); grm.cthMenu.initCustomThemeMenu('main', 'main_bar'); },
			Main_Bar2:       () => { grm.ui.displayPanel('details', true); grm.cthMenu.initCustomThemeMenu('main', 'main_bar2'); },
			Main_Bar3:       () => { grm.ui.displayPanel('details', true); grm.cthMenu.initCustomThemeMenu('main', 'main_bar3'); },
			Main_Text:       () => { grm.ui.displayPanel('details', true); grm.cthMenu.initCustomThemeMenu('main', 'main_text'); },
			Main_Btns:       () => { grm.ui.displayPanel('details', true); grm.cthMenu.initCustomThemeMenu('main', 'main_btns'); },
			Main_Btns2:      () => { grm.ui.displayPanel('details', true); grm.cthMenu.initCustomThemeMenu('main', 'main_btns2'); },
			Main_Style:      () => { grm.ui.displayPanel('details', true); grm.cthMenu.initCustomThemeMenu('main', 'main_style'); },

			Playlist_Bg:     () => { grm.ui.displayPanel('playlist', true); grm.cthMenu.initCustomThemeMenu('playlist', 'pl_bg'); },
			Playlist_Text:   () => { grm.ui.displayPanel('playlist', true); grm.cthMenu.initCustomThemeMenu('playlist', 'pl_text1'); },
			Playlist_Text2:  () => { grm.ui.displayPanel('playlist', true); grm.cthMenu.initCustomThemeMenu('playlist', 'pl_text2'); },
			Playlist_Misc:   () => { grm.ui.displayPanel('playlist', true); grm.cthMenu.initCustomThemeMenu('playlist', 'pl_misc'); },
			Playlist_Btns:   () => { grm.ui.displayPanel('playlist', true); grm.cthMenu.initCustomThemeMenu('playlist', 'pl_btns'); },

			Library_Bg:      () => { grm.ui.displayPanel('library', true); grm.cthMenu.initCustomThemeMenu('library', 'lib_bg'); },
			Library_Text:    () => { grm.ui.displayPanel('library', true); grm.cthMenu.initCustomThemeMenu('library', 'lib_text'); },
			Library_Node:    () => { grm.ui.displayPanel('library', true); grm.cthMenu.initCustomThemeMenu('library', 'lib_node'); },
			Library_Btns:    () => { grm.ui.displayPanel('library', true); grm.cthMenu.initCustomThemeMenu('library', 'lib_btns'); },

			Biography_Bg:    () => { grm.ui.displayPanel('biography', true); grm.cthMenu.initCustomThemeMenu('biography', 'bio_bg'); },
			Biography_Text:  () => { grm.ui.displayPanel('biography', true); grm.cthMenu.initCustomThemeMenu('biography', 'bio_text'); },
			Biography_Misc:  () => { grm.ui.displayPanel('biography', true); grm.cthMenu.initCustomThemeMenu('biography', 'bio_misc'); },
			Biography_Btns:  () => { grm.ui.displayPanel('biography', true); grm.cthMenu.initCustomThemeMenu('biography', 'bio_btns'); },

			Options_Info:    () => { grm.cthMenu.initCustomThemeMenu('info'); window.Repaint(); },
			Options_Theme01: () => { grSet.theme = 'custom01'; grm.ui.initCustomTheme(); grm.ui.initTheme(); grm.cthMenu.initCustomThemeMenu('playlist', 'pl_bg'); },
			Options_Theme02: () => { grSet.theme = 'custom02'; grm.ui.initCustomTheme(); grm.ui.initTheme(); grm.cthMenu.initCustomThemeMenu('playlist', 'pl_bg'); },
			Options_Theme03: () => { grSet.theme = 'custom03'; grm.ui.initCustomTheme(); grm.ui.initTheme(); grm.cthMenu.initCustomThemeMenu('playlist', 'pl_bg'); },
			Options_Theme04: () => { grSet.theme = 'custom04'; grm.ui.initCustomTheme(); grm.ui.initTheme(); grm.cthMenu.initCustomThemeMenu('playlist', 'pl_bg'); },
			Options_Theme05: () => { grSet.theme = 'custom05'; grm.ui.initCustomTheme(); grm.ui.initTheme(); grm.cthMenu.initCustomThemeMenu('playlist', 'pl_bg'); },
			Options_Theme06: () => { grSet.theme = 'custom06'; grm.ui.initCustomTheme(); grm.ui.initTheme(); grm.cthMenu.initCustomThemeMenu('playlist', 'pl_bg'); },
			Options_Theme07: () => { grSet.theme = 'custom07'; grm.ui.initCustomTheme(); grm.ui.initTheme(); grm.cthMenu.initCustomThemeMenu('playlist', 'pl_bg'); },
			Options_Theme08: () => { grSet.theme = 'custom08'; grm.ui.initCustomTheme(); grm.ui.initTheme(); grm.cthMenu.initCustomThemeMenu('playlist', 'pl_bg'); },
			Options_Theme09: () => { grSet.theme = 'custom09'; grm.ui.initCustomTheme(); grm.ui.initTheme(); grm.cthMenu.initCustomThemeMenu('playlist', 'pl_bg'); },
			Options_Theme10: () => { grSet.theme = 'custom10'; grm.ui.initCustomTheme(); grm.ui.initTheme(); grm.cthMenu.initCustomThemeMenu('playlist', 'pl_bg'); },
			Options_Rename:  () => { grm.inputBox.renameCustomTheme(); },
			Options_Reset:   () => { grm.ui.initCustomTheme(); grm.cthMenu.resetCustomTheme(); grm.ui.initTheme(); grm.cthMenu.initCustomThemeMenu('playlist', 'pl_bg'); }
		};

		const metadataGridMenu = {
			Page1: () => { CustomMenu.activeControl.isSelectUp = false; grm.gridMenu.initMetadataGridMenu(1); },
			Page2: () => { CustomMenu.activeControl.isSelectUp = false; grm.gridMenu.initMetadataGridMenu(2); },
			Page3: () => { CustomMenu.activeControl.isSelectUp = false; grm.gridMenu.initMetadataGridMenu(3); },
			Page4: () => { CustomMenu.activeControl.isSelectUp = false; grm.gridMenu.initMetadataGridMenu(4); },
			Info:  () => { grm.gridMenu.initMetadataGridMenu(false, true); window.Repaint(); },
			Reset: () => { grm.gridMenu.resetMetadataGrid(); grm.gridMenu.initMetadataGridMenu(1); }
		}

		const closeBtn = {
			Close: () => {
				CustomMenu.activeControl.isSelectUp = false;
				if (grm.ui.displayCustomThemeMenu) grm.ui.initCustomThemeMenuState();
				if (grm.ui.displayMetadataGridMenu) grm.details.initGridMenuState();
			}
		}

		const index    = labelArray[activeIndex];
		const topIndex = label.replace(/\s/g, '');
		const subIndex = `${label}_${index}`.replace(/\s/g, '');

		// * Button handler
		if (grm.ui.displayCustomThemeMenu && customThemeMenu[subIndex]) {
			customThemeMenu[subIndex]();
		}
		else if (grm.ui.displayMetadataGridMenu && (metadataGridMenu[topIndex] || metadataGridMenu[index])) {
			if (metadataGridMenu[index]) {
				metadataGridMenu[index]();
			} else {
				metadataGridMenu[topIndex]();
			}
		}
		else if (CustomMenu.activeControl.closeBtn) {
			closeBtn.Close();
		}
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Draws the drop down menu.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	draw(gr) {
		gr.SetSmoothingMode(SmoothingMode.None);
		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		const lightBg = grm.color.isLightBg(Color.BRT(grCol.bg));
		const textColor = lightBg ? RGB(0, 0, 0) : RGB(255, 255, 255);
		const lineHeight = this.hovered || this.focus ? this.h : 1;
		const optionH = this.optionHeight + this.padding * 2;
		let   optionY = this.getFirstOptionY();

		gr.FillSolidRect(this.x, this.y, this.w, this.h, grCol.bg);

		if (this.selectUp) {
			gr.SetSmoothingMode(SmoothingMode.AntiAlias);
			gr.FillSolidRect(this.x, this.y, this.w - 1, this.selectUpHeight + this.h, TintColor(grCol.bg, 10));
			gr.DrawLine(this.x, optionY, this.x + this.w - 1, optionY, 2, ShadeColor(grCol.bg, 20));
			for (const [i, option] of this.labelArray.entries()) {
				const isActive = this.activeIndex === i;
				if (isActive || this.selectUpHoveredOption === i) {
					const color = isActive ? grCol.progressBarFill : ShadeColor(grCol.bg, 10);
					gr.FillSolidRect(this.x, optionY, this.w - 1, optionH, color);
				}
				gr.DrawLine(this.x, optionY, this.x + this.w - 1, optionY, 1, ShadeColor(grCol.bg, 10));
				gr.GdiDrawText(option, this.font, textColor, this.x + this.padding * 2, optionY + this.padding, this.w - this.padding * 4, optionH, StringFormat(0, 0, 4));
				optionY += optionH;
			}
		}
		else { // Line is not visible if select is up
			gr.FillSolidRect(this.x, this.y + this.h - lineHeight, this.w - 1, lineHeight, TintColor(grCol.bg, 10));
		}
		gr.GdiDrawText(this.label, this.font, textColor, this.x + this.padding * 2, this.y + Math.ceil(this.padding / 2), this.w - this.padding * 2, this.h, StringFormat(1, 1));
	}

	/**
	 * Releases the graphics object associated with the getImage method.
	 */
	destructor() {
		this.labelArray = null;
		super.destructor();
	}

	/**
	 * Clears the focus of the main drop down menu item.
	 */
	clearFocus() {
		this.focus = false;
		this.selectUp = false;
		this.repaint();
	}

	/**
	 * Handles click events on a drop down menu item and shows the selected page based on the clicked position.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	clicked(x, y) {
		if (this.selectUp) { // Made a selection
			const optionH = this.optionHeight + this.padding * 2;
			const yIndex = y - this.getFirstOptionY();
			this.activeIndex = Math.floor(yIndex / optionH);
		}
		this.selectUp = !this.selectUp;
		if (this.selectUp) {
			this.selectUpActiveIndex = this.activeIndex;
			this.activeIndex = -1;
		}
		this._buttonHandler(this.label, this.labelArray, this.activeIndex);
		window.Repaint();
	}

	/**
	 * Handles double click events on a drop down menu item.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	doubleClicked(x, y) {
		this.clicked(x, y);
	}

	/**
	 * Gets the y-coordinate of the main drop down menu item.
	 * @returns {number} The y-coordinate of the first option.
	 */
	getFirstOptionY() {
		return this.y + this.labelHeight + this.padding * 2;
	}

	/**
	 * Checks if the mouse is over a drop down menu item.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	mouseInThis(x, y) {
		let firstOptionY = 0;
		if (this.selectUp) {
			firstOptionY = this.getFirstOptionY();
			this.selectUpHoveredOption = y < firstOptionY || y > firstOptionY + this.selectUpHeight ? -1 : Math.floor((y - firstOptionY) / (this.optionHeight + this.padding * 2));
		}
		return !this.disabled &&
				((!this.selectUp && x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h) ||
				  (this.selectUp && x >= this.x && x <= this.x + this.w && y >= firstOptionY && y <= firstOptionY + this.selectUpHeight));
	}

	/**
	 * Handles keyboard events and performs different actions based on the key pressed.
	 * @param {number} vkey - The virtual key code.
	 */
	onKey(vkey) {
		switch (vkey) {
			case VKey.RETURN:
			case VKey.SPACE:
				if (!this.selectUp) {
					this.clicked();
				} else {
					this.selectUp = false;
					this.repaint();
				}
				break;
			case VKey.UP:
				if (this.activeIndex !== -1) {
					this.activeIndex = Math.max(this.activeIndex - 1, 0);
					this.repaint();
				}
				break;
			case VKey.DOWN:
				this.activeIndex = Math.min(this.activeIndex + 1, this.labelArray.length - 1);
				this.repaint();
				break;
			case VKey.ESCAPE:
				this.clearFocus();
				break;
		}
	}

	/**
	 * Updates the drop down menu.
	 */
	repaint() {
		const repaintY = Math.min(this.getFirstOptionY(), this.y);
		window.RepaintRect(this.x - this.borderPadding, repaintY - this.borderPadding + this.borderPadding, this.w + this.borderPadding * 2, this.labelHeight + this.selectUpHeight + this.borderPadding * 3 + this.padding);
	}
	// #endregion
}


/////////////////////////////////
// * CUSTOM MENU INPUT FIELD * //
/////////////////////////////////
/**
 * A class that creates the first input field object of the custom menu.
 * @augments {CustomMenu}
 */
class CustomMenuInputField extends CustomMenu {
	/**
	 * Creates the `CustomMenuInputField` instance.
	 * @param {string} id - The unique identifier for the input field.
	 * @param {string} label - The description for the input field.
	 * @param {string|number} value - The stored value of the input field.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} labelWidth - The width of the label area.
	 * @param {number} inputWidth - The width of the input field.
	 */
	constructor(id, label, value, x, y, labelWidth, inputWidth) {
		super(x, y, label);

		/** @private @type {string} */
		this.id = id;
		/** @private */
		this.h = this.calcTextHeight('Ag', this.font);
		/** @private @constant @type {number} */
		this.padding = SCALE(3);
		/** @private @constant @type {number} */
		this.lineThickness = SCALE(2);
		/** @private @type {number} */
		this.inputX = this.x + (grm.ui.displayMetadataGridMenu ? SCALE(20) : this.h);
		/** @private @type {string} */
		this.value = value;
		/** @private @type {number} */
		this.labelW = labelWidth;
		/** @private @type {number} */
		this.inputW = inputWidth - this.padding * 2 + grSet.popupFontSize_layout; // Subtract out padding
		/** @private @constant @type {number} */
		this.cursorRefreshInterval = 350;
		/** @private @type {number} */
		this.timerId = undefined;
		/** @private @type {boolean} */
		this.showCursor = false;
		/** @private @type {number} */
		this.selEnd = -1;
		/** @private @type {number} */
		this.selAnchor = -1;
		/** @private @type {number} */
		this.cursorPos = 0;
		/** @private @type {number} The number of chars that are not visible in the input field (scrolled to the left). */
		this.offsetChars = 0;
	}

	// * GETTERS & SETTERS * //
	// #region GETTERS & SETTERS
	/**
	 * Checks the selection of the input field.
	 * @returns {boolean} True or false.
	 */
	get hasSelection() {
		return this.selAnchor !== -1;
	}

	/**
	 * Gets the input field hover state.
	 * @returns {boolean} True or false.
	 */
	get hovered() {
		return this._hovered;
	}

	/**
	 * Sets the input field hover state.
	 * @param {boolean} value - The input field hover state to set.
	 */
	set hovered(value) {
		this._hovered = value;
		this.repaint();
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Draws the input field with a label and value.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	draw(gr) {
		gr.SetTextRenderingHint(TextRenderingHint.AntiAlias);
		const margin = SCALE(20);
		const textX = this.inputX + this.padding * 4;
		const lightBg = grm.color.isLightBg(Color.BRT(pl.col.bg));
		const textColor = lightBg ? RGB(0, 0, 0) : RGB(255, 255, 255);
		const outlineColor = this.focus ? HEXtoRGB(this.value) : RGB(120, 120, 120);

		gr.GdiDrawText(this.label, this.font, textColor, this.inputX + this.inputW + margin * 2, this.y, this.labelW, this.h, StringFormat(0, 0, 4));
		gr.FillSolidRect(this.inputX, this.y - this.padding, this.inputW + margin, this.h + this.padding * 2, RGB(255, 255, 255));
		gr.DrawRect(this.inputX, this.y - this.padding, this.inputW + margin, this.h + this.padding * 2, this.lineThickness, outlineColor);
		gr.GdiDrawText(this.value.slice(this.offsetChars), this.font, RGB(0, 0, 0), textX, this.y, this.inputW, this.h, StringFormat(0, 0, 4));

		if (this.hasSelection) {
			let selStartIndex = this.selAnchor;
			let selEndIndex = this.selEnd;
			if (selStartIndex > selEndIndex) {
				const tmp = selStartIndex; selStartIndex = selEndIndex; selEndIndex = tmp;
			}
			selStartIndex = Math.max(this.offsetChars, selStartIndex);
			const start = textX + this.getCursorX(selStartIndex);
			const end = textX + this.getCursorX(selEndIndex);
			const maxWidth = Math.min(this.inputW - (start - textX), end - start);
			const lightBg = grm.color.isLightBg(Color.BRT(HEXtoRGB(this.value)));
			const textColor = lightBg ? RGB(0, 0, 0) : RGB(255, 255, 255);

			gr.FillSolidRect(start, this.y, maxWidth, this.h, HEXtoRGB(this.value));
			gr.GdiDrawText(this.value.slice(selStartIndex, selEndIndex), this.font, textColor, start, this.y, maxWidth, this.h, StringFormat(0, 0, 4));
		}
		if (this.showCursor) {
			const cursorPos = textX + this.getCursorX(this.cursorPos);
			gr.DrawLine(cursorPos, this.y, cursorPos, this.y + this.h, this.lineThickness, RGB(0, 0, 0));
		}
	}

	/**
	 * Calculates how many chars (offsetChars) to *not* draw on the left hand side of the text box.
	 */
	calcOffsetIndex() {
		let width = this.g.CalcTextWidth(this.value.slice(this.offsetChars, this.cursorPos + this.offsetChars), this.font, true);
		let j = 0;
		while (width > this.inputW && j < 999) {
			j++;
			this.offsetChars++;
			width = this.g.CalcTextWidth(this.value.slice(this.offsetChars, this.cursorPos + this.offsetChars), this.font, true);
		}
		if (j === 0) {
			while (width < this.inputW && this.offsetChars > 0) {
				this.offsetChars--;
				width = this.g.CalcTextWidth(this.value.slice(this.offsetChars, this.cursorPos + this.offsetChars), this.font, true);
			}
			if (this.offsetChars < 0) {
				this.offsetChars = 0;
			}
		}
	}

	/**
	 * Clears the focus of the input field.
	 */
	clearFocus() {
		clearTimeout(this.timerId);
		this.focus = false;
		this.showCursor = false;
		this.offsetChars = 0;
		this.selAnchor = -1; // I think we want to do this?
		this.repaint();
	}

	/**
	 * Handles mouse button click events and updates the cursor position and selection.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	clicked(x, y) {
		if (!this.mouseInThis(x, y)) return;
		this.focus = true;
		const oldCursor = this.cursorPos;
		this.cursorPos = this.getCursorIndex(x);
		if (utils.IsKeyPressed(VKey.SHIFT)) {
			if (!this.hasSelection) {
				this.selAnchor = oldCursor;
			}
			this.selEnd = this.cursorPos;
		} else {
			this.selAnchor = -1;
		}
		this.flashCursor(true);
	}

	/**
	 * Handles mouse double click events and selects a word or a range of words on a specific position in the text.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	doubleClicked(x, y) {
		const clickPos = this.getCursorIndex(x);
		if (this.hasSelection && Math.abs(this.selAnchor - this.selEnd) !== this.value.length &&
			((clickPos >= this.selAnchor && clickPos <= this.selEnd) ||
			 (clickPos <= this.selAnchor && clickPos >= this.selEnd))) {
			this.onChar(VKey.SELECT_ALL);
		} else {
			this.selAnchor = Math.max(0, this.value.slice(0, clickPos).lastIndexOf(' ') + 1);
			this.selEnd = this.value.indexOf(' ', clickPos);
			if (this.selEnd === -1) this.selEnd = this.value.length;
			this.cursorPos = this.selEnd;
		}
	}

	/**
	 * Flashes the mouse cursor and repaints the control.
	 * @param {boolean} [showImmediate] - If true, the cursor is shown immediately, otherwise the cursor visibility is toggled.
	 * @private
	 */
	flashCursor(showImmediate) {
		clearTimeout(this.timerId);
		this.showCursor = showImmediate ? true : !this.showCursor;
		this.timerId = setTimeout(() => {
			this.flashCursor();
		}, this.cursorRefreshInterval);
		this.repaint();
	}

	/**
	 * Calculates the index of the cursor position based on the x-coordinate inside a control.
	 * @param {number} x - The x-coordinate.
	 * @returns {number} The index of the cursor position.
	 * @private
	 */
	getCursorIndex(x) {
		const inputX = x - this.inputX; // X-position inside control
		let pos = this.padding;
		for (let i = this.offsetChars; i < this.value.length; i++) {
			const charWidth = this.g.CalcTextWidth(this.value.slice(i, i + 1), this.font, true);
			if (Math.round(pos + (charWidth / 2)) >= inputX) {
				return i;
			}
			pos += charWidth;
		}
		return this.value.length;
	}

	/**
	 * Calculates the x-coordinate of the cursor position based on the given index to determine where to draw the cursor.
	 * @param {number} index - The index of the character where the cursor is located.
	 * @returns {number} The x-position of the cursor at that index.
	 * @private
	 */
	getCursorX(index) {
		if (index >= this.offsetChars) {
			return this.g.CalcTextWidth(this.value.slice(this.offsetChars, index), this.font, true);
		}
		return 0;
	}

	/**
	 * Checks if the mouse is within the boundaries of the input field.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	mouseInThis(x, y) {
		return !this.disabled && x >= this.inputX && x <= this.inputX + this.inputW && y >= this.y - this.padding && y <= this.y + this.h + this.padding;
	}

	/**
	 * Handles various keyboard inputs and performs corresponding actions on the text value.
	 * @param {number} code - The character code.
	 */
	onChar(code) {
		let clearSelection = true;
		let text = String.fromCharCode(code);
		const start = this.hasSelection ? Math.min(this.cursorPos, this.selAnchor) : this.cursorPos;
		const end = this.hasSelection ?  Math.max(this.cursorPos, this.selAnchor) : this.cursorPos;

		switch (code) {
			case VKey.RETURN:
				this.value = this.value.substring(0, start) + this.value.substring(end);
				if (grm.ui.displayCustomThemeMenu) this.updateColors();
				if (grm.ui.displayMetadataGridMenu) this.updateMetadata();
				this.clearFocus();
				break;
			case VKey.BACK:
				if (this.hasSelection) {
					this.value = this.value.substring(0, start) + this.value.substring(end);
					this.cursorPos = start;
				} else {
					this.value = this.value.substring(0, Math.max(0, start - 1)) + this.value.substring(end);
					this.cursorPos = Math.max(0, start - 1);
				}
				if (this.cursorPos === this.value.length) {
					this.calcOffsetIndex(); // Deleting text from end
				} else if (this.cursorPos < this.offsetChars) {
					this.offsetChars = this.cursorPos;
				}
				break;
			case VKey.CUT:
				if (!this.hasSelection) return;
				doc.parentWindow.clipboardData.setData('text', this.value.substring(start, end));
				// Fall through
			case VKey.DELETE:
				if (this.hasSelection) {
					this.value = this.value.substring(0, start) + this.value.substring(end);
					this.cursorPos = start;
				} else {
					this.value = this.value.substring(0, start) + this.value.substring(Math.min(end + 1, this.value.length));
				}
				this.calcOffsetIndex();
				break;
			case VKey.SELECT_ALL:
				this.selAnchor = 0; this.cursorPos = this.selEnd = this.value.length;
				this.calcOffsetIndex();
				clearSelection = false;
				break;
			case VKey.ESCAPE: // Clears selection below
				break;
			case VKey.COPY:
				if (this.hasSelection) {
					doc.parentWindow.clipboardData.setData('text', this.value.substring(start, end));
				}
				clearSelection = false;
				break;
			case VKey.PASTE:
				text = doc.parentWindow.clipboardData.getData('text');
				this.value = this.value === '' ? this.value : text;
				if (grm.ui.displayCustomThemeMenu) this.updateColors();
				if (grm.ui.displayMetadataGridMenu) this.updateMetadata();
				// Fall through
			default:
				this.value = this.value.substring(0, start) + text + this.value.substring(end);
				this.cursorPos = start + text.length;
				if (this.cursorPos === this.value.length) { // Inserting text at end
					this.calcOffsetIndex();
				} else {
					while (this.getCursorX(this.cursorPos) > this.inputW) { // Ensure new text does not push cursor past input edge
						this.offsetChars++;
					}
				}
		}
		if (clearSelection) this.selAnchor = -1; // Always want to clear selection
	}

	/**
	 * Handles keyboard events and performs different actions based on the key pressed.
	 * @param {number} vkey - The virtual key code.
	 */
	onKey(vkey) {
		const ShiftKeyPressed = utils.IsKeyPressed(VKey.SHIFT);
		switch (vkey) {
			case VKey.LEFT:
			case VKey.RIGHT: {
				const dir = vkey === VKey.LEFT ? -1 : 1;
				if (ShiftKeyPressed) {
					if (this.hasSelection) { // Expand or contract selection
						this.selEnd = this.strClamp(this.selEnd + dir);
					} else { // Start a selection
						this.selAnchor = this.cursorPos;
						this.selEnd = this.strClamp(this.cursorPos + dir);
					}
					this.cursorPos = this.strClamp(this.cursorPos + dir);
				}
				else if (this.hasSelection) {
					if ((this.selAnchor > this.selEnd && dir === 1) ||
						(this.selAnchor < this.selEnd && dir === -1)) {
						this.cursorPos = this.selAnchor;
					}
					this.selAnchor = -1;
				}
				else {
					this.cursorPos = this.strClamp(this.cursorPos + dir);
				}
				if (dir < 0 && this.cursorPos < this.offsetChars) {
					this.offsetChars--;
				}
				else if (dir > 0) {
					while (this.getCursorX(this.cursorPos) > this.inputW) {
						this.offsetChars++;
					}
				}
				break;
			}
			case VKey.UP:
			case VKey.DOWN:
			case VKey.HOME:
			case VKey.END: {
				const home = vkey === VKey.UP || vkey === VKey.HOME;
				if (ShiftKeyPressed) {
					if (!this.hasSelection) {
						this.selAnchor = this.cursorPos;
					}
					this.selEnd = home ? 0 : this.value.length
				} else {
					this.selAnchor = -1;
				}
				this.cursorPos = home ? 0 : this.value.length;
				this.calcOffsetIndex();
				break;
			}
			case VKey.DELETE:
				this.onChar(VKey.DELETE);
				break;
		}
		this.flashCursor(true);
	}

	/**
	 * Updates the state of the input field.
	 */
	repaint() {
		window.RepaintRect(this.x - 1, this.y - this.padding - 1, this.x + this.labelW + this.inputW + this.padding * 2 + 2, this.h * this.padding * 2 + 2);
	}

	/**
	 * Returns the clamped value of `index` within the range of 0 and the length of `this.value`.
	 * @param {number} index - The position within a string or array that you want to ensure is within a certain range.
	 * @returns {number} The clamped value.
	 * @private
	 */
	strClamp(index) {
		return Math.min(Math.max(index, 0), this.value.length);
	}

	/**
	 * Updates the colors of the current active custom theme.
	 */
	updateColors() {
		grm.ui.initCustomTheme();
		grm.cthMenu.updateCustomThemesConfig(this.id, this.value);
		grm.ui.initThemeFull = true;
		grm.ui.initTheme();
		this.repaint();
	}

	/**
	 * Updates the metadata grid based on the provided configuration values and repaints the grid.
	 */
	updateMetadata() {
		grm.gridMenu.updateMetadataGridFromConfig(this.id, this.value, this.value2);
		this.repaint();
	}
	// #endregion
}


///////////////////////////////////
// * CUSTOM MENU INPUT FIELD 2 * //
///////////////////////////////////
/**
 * A class that creates the second input field object of the custom menu, used in the metadata grid custom menu.
 * @augments {CustomMenu}
 */
class CustomMenuInputField2 extends CustomMenu {
	/**
	 * Creates the `CustomMenuInputField2` instance.
	 * @param {string} id - The unique identifier for the input field.
	 * @param {string} label - The description for the input field.
	 * @param {string|number} value2 - The stored value of the input field.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} labelWidth - The width of the label area.
	 * @param {number} inputWidth - The width of the input field.
	 */
	constructor(id, label, value2, x, y, labelWidth, inputWidth) {
		super(x, y, label);

		/** @private @type {string} */
		this.id = id;
		/** @private @type {number} */
		this.h = this.calcTextHeight('Ag', this.font);
		/** @private @constant @type {number} */
		this.padding = SCALE(3);
		/** @private @constant @type {number} */
		this.lineThickness = SCALE(2);
		/** @private @type {number} */
		this.inputX = this.x + this.h + SCALE(18);
		/** @private @type {string} */
		this.value2 = value2;
		/** @private @type {number} */
		this.labelW = labelWidth;
		/** @private @type {number} */
		this.inputW = inputWidth - this.padding * 2; // Subtract out padding
		/** @private @constant @type {number} */
		this.cursorRefreshInterval = 350;
		/** @private @type {number} */
		this.timerId = undefined;
		/** @private @type {boolean} */
		this.showCursor = false;
		/** @private @type {number} */
		this.selEnd = -1;
		/** @private @type {number} */
		this.selAnchor = -1;
		/** @private @type {number} */
		this.cursorPos = 0;
		/** @private @type {number} The number of chars that are not visible in the input field (scrolled to the left). */
		this.offsetChars = 0;
	}

	// * GETTERS & SETTERS * //
	// #region GETTERS & SETTERS
	/**
	 * Checks the selection of the input field.
	 * @returns {boolean} True or false.
	 */
	get hasSelection() {
		return this.selAnchor !== -1;
	}

	/**
	 * Gets the input field hover state.
	 * @returns {boolean} True or false.
	 */
	get hovered() {
		return this._hovered;
	}

	/**
	 * Sets the input field hover state.
	 * @param {boolean} value - The input field hover state to set.
	 */
	set hovered(value) {
		this._hovered = value;
		this.repaint();
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Draws the input field with a label and value.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	draw(gr) {
		const margin = SCALE(20);
		const textX = this.inputX + this.padding * 4;
		const outlineColor = this.focus ? grCol.lowerBarArtist : this.hovered ? RGB(150, 150, 150) : RGB(120, 120, 120);

		gr.SetTextRenderingHint(TextRenderingHint.AntiAlias);
		gr.FillSolidRect(this.inputX, this.y - this.padding, this.inputW + margin, this.h + this.padding * 2, RGB(255, 255, 255));
		gr.DrawRect(this.inputX, this.y - this.padding, this.inputW + margin, this.h + this.padding * 2, this.lineThickness, outlineColor);
		gr.GdiDrawText(this.value2.slice(this.offsetChars), this.font, RGB(0, 0, 0), textX, this.y, this.inputW, this.h, StringFormat(0, 0, 4));

		if (this.hasSelection) {
			let selStartIndex = this.selAnchor;
			let selEndIndex = this.selEnd;
			if (selStartIndex > selEndIndex) {
				const tmp = selStartIndex; selStartIndex = selEndIndex; selEndIndex = tmp;
			}
			selStartIndex = Math.max(this.offsetChars, selStartIndex);
			const start = textX + this.getCursorX(selStartIndex);
			const end = textX + this.getCursorX(selEndIndex);
			const maxWidth = Math.min(this.inputW - (start - textX), end - start);
			const lightBg = grm.color.isLightBg(Color.BRT(pl.col.bg));
			const textColor = lightBg ? RGB(0, 0, 0) : RGB(255, 255, 255);
			gr.FillSolidRect(start, this.y, maxWidth, this.h, HEXtoRGB(this.value2));
			gr.GdiDrawText(this.value2.slice(selStartIndex, selEndIndex), this.font, textColor, start, this.y, maxWidth, this.h, StringFormat(0, 0, 4));
		}
		if (this.showCursor) {
			const cursorPos = textX + this.getCursorX(this.cursorPos);
			gr.DrawLine(cursorPos, this.y, cursorPos, this.y + this.h, this.lineThickness, RGB(0, 0, 0));
		}
	}

	/**
	 * Calculates how many chars (offsetChars) to *not* draw on the left hand side of the text box.
	 */
	calcOffsetIndex() {
		let width = this.g.CalcTextWidth(this.value2.slice(this.offsetChars, this.cursorPos + this.offsetChars), this.font, true);
		let j = 0;
		while (width > this.inputW && j < 999) {
			j++;
			this.offsetChars++;
			width = this.g.CalcTextWidth(this.value2.slice(this.offsetChars, this.cursorPos + this.offsetChars), this.font, true);
		}
		if (j === 0) {
			while (width < this.inputW && this.offsetChars > 0) {
				this.offsetChars--;
				width = this.g.CalcTextWidth(this.value2.slice(this.offsetChars, this.cursorPos + this.offsetChars), this.font, true);
			}
			if (this.offsetChars < 0) {
				this.offsetChars = 0;
			}
		}
	}

	/**
	 * Clears the focus of the input field.
	 */
	clearFocus() {
		clearTimeout(this.timerId);
		this.focus = false;
		this.showCursor = false;
		this.offsetChars = 0;
		this.selAnchor = -1; // I think we want to do this?
		this.repaint();
	}

	/**
	 * Handles mouse button click events and updates the cursor position and selection.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	clicked(x, y) {
		if (!this.mouseInThis(x, y)) return;
		this.focus = true;
		const oldCursor = this.cursorPos;
		this.cursorPos = this.getCursorIndex(x);
		if (utils.IsKeyPressed(VKey.SHIFT)) {
			if (!this.hasSelection) {
				this.selAnchor = oldCursor;
			}
			this.selEnd = this.cursorPos;
		} else {
			this.selAnchor = -1;
		}
		this.flashCursor(true);
	}

	/**
	 * Handles mouse double click events and selects a word or a range of words on a specific position in the text.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	doubleClicked(x, y) {
		const clickPos = this.getCursorIndex(x);
		if (this.hasSelection && Math.abs(this.selAnchor - this.selEnd) !== this.value2.length &&
			((clickPos >= this.selAnchor && clickPos <= this.selEnd) ||
			 (clickPos <= this.selAnchor && clickPos >= this.selEnd))) {
			this.onChar(VKey.SELECT_ALL);
		} else {
			this.selAnchor = Math.max(0, this.value2.slice(0, clickPos).lastIndexOf(' ') + 1);
			this.selEnd = this.value2.indexOf(' ', clickPos);
			if (this.selEnd === -1) this.selEnd = this.value2.length;
			this.cursorPos = this.selEnd;
		}
	}

	/**
	 * Flashes the mouse cursor and repaints the control.
	 * @param {boolean} [showImmediate] - If true, the cursor is shown immediately, otherwise the cursor visibility is toggled.
	 * @private
	 */
	flashCursor(showImmediate) {
		clearTimeout(this.timerId);
		this.showCursor = showImmediate ? true : !this.showCursor;
		this.timerId = setTimeout(() => {
			this.flashCursor();
		}, this.cursorRefreshInterval);
		this.repaint();
	}

	/**
	 * Calculates the index of the cursor position based on the x-coordinate inside a control.
	 * @param {number} x - The x-coordinate.
	 * @returns {number} The index of the cursor position.
	 * @private
	 */
	getCursorIndex(x) {
		const inputX = x - this.inputX; // X-position inside control
		let pos = this.padding;
		for (let i = this.offsetChars; i < this.value2.length; i++) {
			const charWidth = this.g.CalcTextWidth(this.value2.slice(i, i + 1), this.font, true);
			if (Math.round(pos + (charWidth / 2)) >= inputX) {
				return i;
			}
			pos += charWidth;
		}
		return this.value2.length;
	}

	/**
	 * Calculates the x-coordinate of the cursor position based on the given index to determine where to draw the cursor.
	 * @param {number} index - The index of the character where the cursor is located.
	 * @returns {number} The x-position of the cursor at that index.
	 * @private
	 */
	getCursorX(index) {
		if (index >= this.offsetChars) {
			return this.g.CalcTextWidth(this.value2.slice(this.offsetChars, index), this.font, true);
		}
		return 0;
	}

	/**
	 * Checks if the mouse is within the boundaries of the input field.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	mouseInThis(x, y) {
		return !this.disabled &&
			x >= this.inputX && x <= this.inputX + this.inputW &&
			y >= this.y - this.padding && y <= this.y + this.h + this.padding;
	}

	/**
	 * Handles various keyboard inputs and performs corresponding actions on the text value.
	 * @param {number} code - The character code.
	 */
	onChar(code) {
		let clearSelection = true;
		let text = String.fromCharCode(code);
		const start = this.hasSelection ? Math.min(this.cursorPos, this.selAnchor) : this.cursorPos;
		const end = this.hasSelection ?  Math.max(this.cursorPos, this.selAnchor) : this.cursorPos;

		switch (code) {
			case VKey.RETURN:
				this.value2 = this.value2.substring(0, start) + this.value2.substring(end);
				if (grm.ui.displayMetadataGridMenu) this.updateMetadata();
				this.clearFocus();
				break;
			case VKey.BACK:
				if (this.hasSelection) {
					this.value2 = this.value2.substring(0, start) + this.value2.substring(end);
					this.cursorPos = start;
				} else {
					this.value2 = this.value2.substring(0, Math.max(0, start - 1)) + this.value2.substring(end);
					this.cursorPos = Math.max(0, start - 1);
				}
				if (this.cursorPos === this.value2.length) {
					// Deleting text from end
					this.calcOffsetIndex();
				} else if (this.cursorPos < this.offsetChars) {
					this.offsetChars = this.cursorPos;
				}
				break;
			case VKey.CUT:
				if (!this.hasSelection) return;
				doc.parentWindow.clipboardData.setData('text', this.value2.substring(start, end));
				// Fall through
			case VKey.DELETE:
				if (this.hasSelection) {
					this.value2 = this.value2.substring(0, start) + this.value2.substring(end);
					this.cursorPos = start;
				} else {
					this.value2 = this.value2.substring(0, start) + this.value2.substring(Math.min(end + 1, this.value2.length));
				}
				this.calcOffsetIndex();
				break;
			case VKey.SELECT_ALL:
				this.selAnchor = 0; this.cursorPos = this.selEnd = this.value2.length;
				this.calcOffsetIndex();
				clearSelection = false;
				break;
			case VKey.ESCAPE: // Clears selection below
				break;
			case VKey.COPY:
				if (this.hasSelection) {
					doc.parentWindow.clipboardData.setData('text', this.value2.substring(start, end));
				}
				clearSelection = false;
				break;
			case VKey.PASTE:
				text = doc.parentWindow.clipboardData.getData('text');
				this.value2 = this.value2 === '' ? this.value2 : text;
				if (grm.ui.displayMetadataGridMenu) this.updateMetadata();
				// Fall through
			default:
				this.value2 = this.value2.substring(0, start) + text + this.value2.substring(end);
				this.cursorPos = start + text.length;
				if (this.cursorPos === this.value2.length) { // Inserting text at end
					this.calcOffsetIndex();
				} else {
					while (this.getCursorX(this.cursorPos) > this.inputW) { // Ensure new text does not push cursor past input edge
						this.offsetChars++;
					}
				}
		}
		if (clearSelection) this.selAnchor = -1; // Always want to clear selection
	}

	/**
	 * Handles keyboard events and performs different actions based on the key pressed.
	 * @param {number} vkey - The virtual key code.
	 */
	onKey(vkey) {
		const ShiftKeyPressed = utils.IsKeyPressed(VKey.SHIFT);
		switch (vkey) {
			case VKey.LEFT:
			case VKey.RIGHT: {
				const dir = vkey === VKey.LEFT ? -1 : 1;
				if (ShiftKeyPressed) {
					if (this.hasSelection) { // Expand or contract selection
						this.selEnd = this.strClamp(this.selEnd + dir);
					} else { // Start a selection
						this.selAnchor = this.cursorPos;
						this.selEnd = this.strClamp(this.cursorPos + dir);
					}
					this.cursorPos = this.strClamp(this.cursorPos + dir);
				}
				else if (this.hasSelection) {
					if ((this.selAnchor > this.selEnd && dir === 1) ||
						(this.selAnchor < this.selEnd && dir === -1)) {
						this.cursorPos = this.selAnchor;
					}
					this.selAnchor = -1;
				}
				else {
					this.cursorPos = this.strClamp(this.cursorPos + dir);
				}
				if (dir < 0 && this.cursorPos < this.offsetChars) {
					this.offsetChars--;
				}
				else if (dir > 0) {
					while (this.getCursorX(this.cursorPos) > this.inputW) {
						this.offsetChars++;
					}
				}
				break;
			}
			case VKey.UP:
			case VKey.DOWN:
			case VKey.HOME:
			case VKey.END: {
				const home = vkey === VKey.UP || vkey === VKey.HOME;
				if (ShiftKeyPressed) {
					if (!this.hasSelection) {
						this.selAnchor = this.cursorPos;
					}
					this.selEnd = home ? 0 : this.value2.length
				} else {
					this.selAnchor = -1;
				}
				this.cursorPos = home ? 0 : this.value2.length;
				this.calcOffsetIndex();
				break;
			}
			case VKey.DELETE:
				this.onChar(VKey.DELETE);
				break;
		}
		this.flashCursor(true);
	}

	/**
	 * Updates the state of the input field.
	 */
	repaint() {
		window.RepaintRect(this.x - 1, this.y - this.padding - 1, this.x + this.labelW + this.inputW + this.padding * 2 + 2, this.h * this.padding * 2 + 2);
	}

	/**
	 * Returns the clamped value of `index` within the range of 0 and the length of `this.value`.
	 * @param {number} index - The position within a string or array that you want to ensure is within a certain range.
	 * @returns {number} The clamped value.
	 * @private
	 */
	strClamp(index) {
		return Math.min(Math.max(index, 0), this.value2.length);
	}

	/**
	 * Updates the metadata grid based on the provided configuration values and repaints the grid.
	 */
	updateMetadata() {
		grm.gridMenu.updateMetadataGridFromConfig(this.id, this.value, this.value2);
		this.repaint();
	}
	// #endregion
}


//////////////////////////////////
// * CUSTOM MENU COLOR PICKER * //
//////////////////////////////////
/**
 * A class that creates the color picker object for the custom menu, opens utils.ColourPicker.
 * @augments {CustomMenu}
 */
class CustomMenuColorPicker extends CustomMenu {
	/**
	 * Creates the `CustomMenuColorPicker` instance.
	 * @param {string} id - The id for each individual unique color picker.
	 * @param {string|number} value - The value of the color will be passed to the color picker.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	constructor(id, value, x, y) {
		super(x, y);

		/** @private @type {string} */
		this.id = id;
		/** @private @type {string} */
		this.value = value;
		/** @private @type {string} */
		this.colorPickerColor = value;
		/** @private @type {number} */
		this.x = x;
		/** @private @type {number} */
		this.y = y - SCALE(1);
		/** @private @type {number} */
		this.h = this.calcTextHeight('Ag', this.font) + SCALE(2);
		/** @private @type {number} */
		this.w = this.h;
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Draws the color picker left of the input field.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	draw(gr) {
		const lineCol = this.focus ? grCol.lowerBarArtist : this.hovered ? RGB(150, 150, 150) : RGB(120, 120, 120);
		gr.FillSolidRect(this.x, this.y, this.w, this.h, HEXtoRGB(this.value));
		gr.DrawRect(this.x, this.y, this.w, this.h, SCALE(2), RGB(255, 255, 255));
		gr.DrawRect(this.x - SCALE(2), this.y - SCALE(2), this.w + SCALE(4), this.h + SCALE(4), SCALE(2), lineCol);
	}

	/**
	 * Updates the color picker color based on the value passed as an argument.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	clicked(x, y) {
		this.colorPickerColor = utils.ColourPicker(0, HEXtoRGB(this.value));
		this.updateColors();
	}

	/**
	 * Checks if the mouse is within the boundaries of the color picker.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	mouseInThis(x, y) {
		return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
	}

	/**
	 * Updates the color picker state.
	 */
	repaint() {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}

	/**
	 * Updates and writes color to config if the user has selected a color via input or the color picker.
	 */
	updateColors() {
		grm.ui.initCustomTheme();
		this.value = RGBFtoHEX(this.colorPickerColor);
		grm.cthMenu.updateCustomThemesConfig(this.id, this.value);
		grm.ui.initThemeFull = true;
		grm.ui.initTheme();
		this.repaint();
	}
	// #endregion
}


//////////////////////////////////
// * CUSTOM MENU COLOR MARKER * //
//////////////////////////////////
/**
 * A class that creates the color marker of the custom menu drawn as a lightbulb icon, displays UI elements in red color.
 * @augments {CustomMenu}
 */
class CustomMenuColorMarker extends CustomMenu {
	/**
	 * Creates the `CustomMenuColorMarker` instance.
	 * @param {string} id - The id for each individual unique color marker.
	 * @param {string|number} value - The value of the color will be passed to the color marker.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	constructor(id, value, x, y) {
		super(x, y);

		/** @private @type {string} */
		this.id = id;
		/** @private @type {string} */
		this.value = value;
		/** @private @type {GdiFont} */
		this.fontAwesome = Font(grFont.fontAwesome, grSet.popupFontSize_layout + 4, 0);
		/** @private @type {number} */
		this.x = x;
		/** @private @type {number} */
		this.y = y - SCALE(1);
		/** @private @type {number} */
		this.h = this.calcTextHeight('Ag', this.font) + SCALE(2);
		/** @private @type {number} */
		this.w = this.h;
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Draws the color marker background field.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	draw(gr) {
		const lineCol = this.focus ? grCol.lowerBarArtist : this.hovered ? RGB(150, 150, 150) : RGB(120, 120, 120);
		gr.DrawRect(this.x - 2, this.y - 2, this.w + 4, this.h + 4, SCALE(1), lineCol);
		gr.DrawString('\uF0EB', this.fontAwesome, RGB(0, 0, 0), this.x, this.y, this.w, this.h, StringFormat(1, 1, 4));
	}

	/**
	 * Displays the UI element as an indicator with a red blinking color.
	 * @param {string} id - The id of the input field.
	 * @param {number} value - The value of the input field.
	 */
	colorMarker(id, value) {
		const showSelColor = () => {
			setTimeout(() => {
				grm.cthMenu.updateCustomThemesConfig(id, RGBtoHEX(255, 0, 0));
				grm.ui.initThemeFull = true;
				grm.ui.initTheme();
			}, 0);
			setTimeout(() => {
				grm.cthMenu.updateCustomThemesConfig(id, value);
				grm.ui.initThemeFull = true;
				grm.ui.initTheme();
			}, 200);
		}
		setTimeout(() => { showSelColor(); }, 100);
		setTimeout(() => { showSelColor(); }, 400);
	}

	/**
	 * Handles mouse click events and activates the color marker.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	clicked(x, y) {
		this.colorMarker(this.id, this.value);
	}

	/**
	 * Checks if the mouse is within the boundaries of the color marker.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	mouseInThis(x, y) {
		return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
	}
	// #endregion
}


//////////////////////////
// * CUSTOM MENU INFO * //
//////////////////////////
/**
 * A class that creates the info page in the custom menu.
 * @augments {CustomMenu}
 */
class CustomMenuInfo extends CustomMenu {
	/**
	 * Creates the `CustomMenuInfo` instance.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 * @param {string} text - The text content of the button.
	 * @param {string} link - The URL that the button should navigate to when clicked.
	 */
	constructor(x, y, w, h, text, link) {
		super(x, y, w, h);

		/** @private @type {number} */
		this.x = x;
		/** @private @type {number} */
		this.y = y;
		/** @private @type {number} */
		this.w = w;
		/** @private @type {number} */
		this.h = h;
		/** @private @type {string} */
		this.text = text;
		/** @private @type {string} */
		this.link = link;
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Draws the info page in the custom menu.
	 * @param {GdiGraphics} gr - The GDI graphics object.
	 */
	draw(gr) {
		const lightBg = grm.color.isLightBg(Color.BRT(pl.col.bg));
		const textColor = lightBg ? RGB(0, 0, 0) : RGB(255, 255, 255);
		gr.DrawString(this.text, this.font, textColor, this.x, this.y, this.w, this.h, StringFormat(0, 0, 4));
	}

	/**
	 * Releases the graphics object associated with the getImage method.
	 */
	destructor() {
		super.destructor();
	}

	/**
	 * Handles mouse click events and opens the url when link was clicked.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	clicked(x, y) {
		if (this.link) {
			RunCmd(this.link);
		}
		window.Repaint();
	}

	/**
	 * Handles mouse double click events.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 */
	doubleClicked(x, y) {
		this.clicked();
	}

	/**
	 * Checks if the mouse is within the boundaries info page.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	mouseInThis(x, y) {
		return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
	}
	// #endregion
}


///////////////////////////
// * CUSTOM THEME MENU * //
///////////////////////////
/**
 * A class that creates and handles the full custom theme menu.
 */
class CustomThemeMenu {
	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * The Main colors in the custom theme menu.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 * @param {string} main_section - The main color page to be opened.
	 * @private
	 */
	_customMainColors(x, y, w, h, main_section) {
		const margin = SCALE(20);
		const labelW = SCALE(300) + grSet.popupFontSize_layout;
		const inputW = SCALE(80)  + grSet.popupFontSize_layout;
		const markerX = x + margin + inputW + (grSet.popupFontSize_layout * HD_4K(0.5, 0.25)) - SCALE(2);

		const addColorSection = (id, label, value, addMarker = true, x, y, labelW, inputW, markerX) => {
			const mainColors = new CustomMenuInputField(id, label, value, x, y, labelW, inputW);
			CustomMenu.controlList.push(mainColors);
			CustomMenu.controlList.push(new CustomMenuColorPicker(id, value, x + 2, y));
			if (addMarker) CustomMenu.controlList.push(new CustomMenuColorMarker(id, value, markerX, y));
			return mainColors.h;
		};

		const sections = {
			main_pre: [
				{ id: 'main_pre_01', label: 'grCol.preloaderBg', value: grCfg.cTheme.grCol_preloaderBg, addMarker: false },
				{ id: 'main_pre_02', label: 'grCol.preloaderLogo', value: grCfg.cTheme.grCol_preloaderLogo, addMarker: false },
				{ id: 'main_pre_03', label: 'grCol.preloaderLowerBarTitle', value: grCfg.cTheme.grCol_preloaderLowerBarTitle, addMarker: false },
				{ id: 'main_pre_04', label: 'grCol.preloaderProgressBar', value: grCfg.cTheme.grCol_preloaderProgressBar, addMarker: false },
				{ id: 'main_pre_05', label: 'grCol.preloaderProgressBarFill', value: grCfg.cTheme.grCol_preloaderProgressBarFill, addMarker: false },
				{ id: 'main_pre_06', label: 'grCol.preloaderProgressBarFrame', value: grCfg.cTheme.grCol_preloaderProgressBarFrame, addMarker: false },
				{ id: 'main_pre_07', label: 'grCol.preloaderUIHacksFrame', value: grCfg.cTheme.grCol_preloaderUIHacksFrame, addMarker: false }
			],
			main_bg: [
				{ id: 'main_bg_01', label: 'grCol.bg', value: grCfg.cTheme.grCol_bg },
				{ id: 'main_bg_02', label: 'grCol.popupBg', value: grCfg.cTheme.grCol_popupBg },
				{ id: 'main_bg_03', label: 'grCol.detailsBg', value: grCfg.cTheme.grCol_detailsBg },
				{ id: 'main_bg_04', label: 'grCol.shadow', value: grCfg.cTheme.grCol_shadow },
				{ id: 'main_bg_05', label: 'grCol.discArtShadow', value: grCfg.cTheme.grCol_discArtShadow },
				{ id: 'main_bg_06', label: 'grCol.noAlbumArtStub', value: grCfg.cTheme.grCol_noAlbumArtStub }
			],
			main_bar: [
				{ id: 'main_bar_01', label: 'grCol.timelineAdded', value: grCfg.cTheme.grCol_bg },
				{ id: 'main_bar_02', label: 'grCol.timelinePlayed', value: grCfg.cTheme.grCol_timelinePlayed },
				{ id: 'main_bar_03', label: 'grCol.timelineUnplayed', value: grCfg.cTheme.grCol_timelineUnplayed },
				{ id: 'main_bar_04', label: 'grCol.timelineFrame', value: grCfg.cTheme.grCol_timelineFrame },
				{ id: 'main_bar_05', label: 'grCol.progressBar', value: grCfg.cTheme.grCol_progressBar },
				{ id: 'main_bar_06', label: 'grCol.progressBarStreaming', value: grCfg.cTheme.grCol_progressBarStreaming },
				{ id: 'main_bar_07', label: 'grCol.progressBarFrame', value: grCfg.cTheme.grCol_progressBarFrame },
				{ id: 'main_bar_08', label: 'grCol.progressBarFill', value: grCfg.cTheme.grCol_progressBarFill },
				{ id: 'main_bar_09', label: 'grCol.volumeBar', value: grCfg.cTheme.grCol_volumeBar },
				{ id: 'main_bar_10', label: 'grCol.volumeBarFrame', value: grCfg.cTheme.grCol_volumeBarFrame },
				{ id: 'main_bar_11', label: 'grCol.volumeBarFill', value: grCfg.cTheme.grCol_volumeBarFill }
			],
			main_bar2: [
				{ id: 'main_bar_12', label: 'grCol.peakmeterBarProg', value: grCfg.cTheme.grCol_peakmeterBarProg },
				{ id: 'main_bar_13', label: 'grCol.peakmeterBarProgFill', value: grCfg.cTheme.grCol_peakmeterBarProgFill },
				{ id: 'main_bar_14', label: 'grCol.peakmeterBarFillTop', value: grCfg.cTheme.grCol_peakmeterBarFillTop },
				{ id: 'main_bar_15', label: 'grCol.peakmeterBarFillMiddle', value: grCfg.cTheme.grCol_peakmeterBarFillMiddle },
				{ id: 'main_bar_16', label: 'grCol.peakmeterBarFillBack', value: grCfg.cTheme.grCol_peakmeterBarFillBack },
				{ id: 'main_bar_17', label: 'grCol.peakmeterBarVertProgFill', value: grCfg.cTheme.grCol_peakmeterBarVertProgFill },
				{ id: 'main_bar_18', label: 'grCol.peakmeterBarVertFill', value: grCfg.cTheme.grCol_peakmeterBarVertFill },
				{ id: 'main_bar_19', label: 'grCol.peakmeterBarVertFillPeaks', value: grCfg.cTheme.grCol_peakmeterBarVertFillPeaks }
			],
			main_bar3: [
				{ id: 'main_bar_20', label: 'grCol.waveformBarFillFront', value: grCfg.cTheme.grCol_waveformBarFillFront },
				{ id: 'main_bar_21', label: 'grCol.waveformBarFillBack', value: grCfg.cTheme.grCol_waveformBarFillBack },
				{ id: 'main_bar_22', label: 'grCol.waveformBarFillPreFront', value: grCfg.cTheme.grCol_waveformBarFillPreFront },
				{ id: 'main_bar_23', label: 'grCol.waveformBarFillPreBack', value: grCfg.cTheme.grCol_waveformBarFillPreBack },
				{ id: 'main_bar_24', label: 'grCol.waveformBarIndicator', value: grCfg.cTheme.grCol_waveformBarIndicator }
			],
			main_text: [
				{ id: 'main_text_02', label: 'grCol.lowerBarTitle', value: grCfg.cTheme.grCol_lowerBarTitle },
				{ id: 'main_text_03', label: 'grCol.lowerBarTime', value: grCfg.cTheme.grCol_lowerBarTime },
				{ id: 'main_text_04', label: 'grCol.lowerBarLength', value: grCfg.cTheme.grCol_lowerBarLength },
				{ id: 'main_text_05', label: 'grCol.detailsText', value: grCfg.cTheme.grCol_detailsText },
				{ id: 'main_text_06', label: 'grCol.detailsRating', value: grCfg.cTheme.grCol_detailsRating },
				{ id: 'main_text_08', label: 'grCol.popupText', value: grCfg.cTheme.grCol_popupText },
				{ id: 'main_text_09', label: 'grCol.lyricsNormal', value: grCfg.cTheme.grCol_lyricsNormal },
				{ id: 'main_text_10', label: 'grCol.lyricsHighlight', value: grCfg.cTheme.grCol_lyricsHighlight },
				{ id: 'main_text_11', label: 'grCol.lyricsShadow', value: grCfg.cTheme.grCol_lyricsShadow }
			],
			main_btns: [
				{ id: 'main_btns_01', label: 'grCol.menuBgColor', value: grCfg.cTheme.grCol_menuBgColor },
				{ id: 'main_btns_02', label: 'grCol.menuStyleBg', value: grCfg.cTheme.grCol_menuStyleBg },
				{ id: 'main_btns_03', label: 'grCol.menuRectStyleEmbossTop', value: grCfg.cTheme.grCol_menuRectStyleEmbossTop },
				{ id: 'main_btns_04', label: 'grCol.menuRectStyleEmbossBottom', value: grCfg.cTheme.grCol_menuRectStyleEmbossBottom },
				{ id: 'main_btns_05', label: 'grCol.menuRectNormal', value: grCfg.cTheme.grCol_menuRectNormal },
				{ id: 'main_btns_06', label: 'grCol.menuRectHovered', value: grCfg.cTheme.grCol_menuRectHovered },
				{ id: 'main_btns_07', label: 'grCol.menuRectDown', value: grCfg.cTheme.grCol_menuRectDown },
				{ id: 'main_btns_08', label: 'grCol.menuTextNormal', value: grCfg.cTheme.grCol_menuTextNormal },
				{ id: 'main_btns_09', label: 'grCol.menuTextHovered', value: grCfg.cTheme.grCol_menuTextHovered },
				{ id: 'main_btns_10', label: 'grCol.menuTextDown', value: grCfg.cTheme.grCol_menuTextDown }
			],
			main_btns2: [
				{ id: 'main_btns_11', label: 'grCol.transportEllipseBg', value: grCfg.cTheme.grCol_transportEllipseBg },
				{ id: 'main_btns_12', label: 'grCol.transportEllipseNormal', value: grCfg.cTheme.grCol_transportEllipseNormal },
				{ id: 'main_btns_13', label: 'grCol.transportEllipseHovered', value: grCfg.cTheme.grCol_transportEllipseHovered },
				{ id: 'main_btns_14', label: 'grCol.transportEllipseDown', value: grCfg.cTheme.grCol_transportEllipseDown },
				{ id: 'main_btns_15', label: 'grCol.transportStyleBg', value: grCfg.cTheme.grCol_transportStyleBg },
				{ id: 'main_btns_16', label: 'grCol.transportStyleTop', value: grCfg.cTheme.grCol_transportStyleTop },
				{ id: 'main_btns_17', label: 'grCol.transportStyleBottom', value: grCfg.cTheme.grCol_transportStyleBottom },
				{ id: 'main_btns_18', label: 'grCol.transportIconNormal', value: grCfg.cTheme.grCol_transportIconNormal },
				{ id: 'main_btns_19', label: 'grCol.transportIconHovered', value: grCfg.cTheme.grCol_transportIconHovered },
				{ id: 'main_btns_20', label: 'grCol.transportIconDown', value: grCfg.cTheme.grCol_transportIconDown }
			],
			main_style: [
				{ id: 'main_style_01', label: 'grCol.styleBevel', value: grCfg.cTheme.grCol_styleBevel },
				{ id: 'main_style_02', label: 'grCol.styleGradient', value: grCfg.cTheme.grCol_styleGradient },
				{ id: 'main_style_03', label: 'grCol.styleGradient2', value: grCfg.cTheme.grCol_styleGradient2 },
				{ id: 'main_style_04', label: 'grCol.styleProgressBar', value: grCfg.cTheme.grCol_styleProgressBar },
				{ id: 'main_style_05', label: 'grCol.styleProgressBarLineTop', value: grCfg.cTheme.grCol_styleProgressBarLineTop },
				{ id: 'main_style_06', label: 'grCol.styleProgressBarLineBottom', value: grCfg.cTheme.grCol_styleProgressBarLineBottom },
				{ id: 'main_style_07', label: 'grCol.styleProgressBarFill', value: grCfg.cTheme.grCol_styleProgressBarFill },
				{ id: 'main_style_08', label: 'grCol.styleVolumeBar', value: grCfg.cTheme.grCol_styleVolumeBar },
				{ id: 'main_style_09', label: 'grCol.styleVolumeBarFill', value: grCfg.cTheme.grCol_styleVolumeBarFill }
			]
		};

		if (sections[main_section]) {
			for (const section of sections[main_section]) {
				y += addColorSection(section.id, section.label, section.value, section.addMarker, x, y, labelW, inputW, markerX) + margin;
			}
		}
	}

	/**
	 * The Playlist colors in the custom theme menu.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 * @param {string} playlist_section - The playlist color page to be opened.
	 * @private
	 */
	_customPlaylistColors(x, y, w, h, playlist_section) {
		const margin = SCALE(20);
		const labelW = SCALE(300) + grSet.popupFontSize_layout;
		const inputW = SCALE(80)  + grSet.popupFontSize_layout;
		const markerX = x + margin + inputW + (grSet.popupFontSize_layout * HD_4K(0.5, 0.25)) - SCALE(2);

		const addColorSection = (id, label, value, x, y, labelW, inputW, markerX) => {
			const plColors = new CustomMenuInputField(id, label, value, x, y, labelW, inputW);
			CustomMenu.controlList.push(plColors);
			CustomMenu.controlList.push(new CustomMenuColorPicker(id, value, x + 2, y));
			CustomMenu.controlList.push(new CustomMenuColorMarker(id, value, markerX, y));
			return plColors.h;
		};

		const sections = {
			pl_bg: [
				{ id: 'pl_bg_01', label: 'pl.col.bg', value: grCfg.cTheme.pl_col_bg },
				{ id: 'pl_bg_02', label: 'pl.col.header_nowplaying_bg', value: grCfg.cTheme.pl_col_header_nowplaying_bg },
				{ id: 'pl_bg_03', label: 'pl.col.header_sideMarker', value: grCfg.cTheme.pl_col_header_sideMarker },
				{ id: 'pl_bg_04', label: 'pl.col.row_nowplaying_bg', value: grCfg.cTheme.pl_col_row_nowplaying_bg },
				{ id: 'pl_bg_05', label: 'pl.col.row_stripes_bg', value: grCfg.cTheme.pl_col_row_stripes_bg },
				{ id: 'pl_bg_06', label: 'pl.col.row_sideMarker', value: grCfg.cTheme.pl_col_row_sideMarker }
			],
			pl_text1: [
				{ id: 'pl_text_01', label: 'pl.col.plman_text_normal', value: grCfg.cTheme.pl_col_plman_text_normal },
				{ id: 'pl_text_02', label: 'pl.col.plman_text_hovered', value: grCfg.cTheme.pl_col_plman_text_hovered },
				{ id: 'pl_text_03', label: 'pl.col.plman_text_pressed', value: grCfg.cTheme.pl_col_plman_text_pressed },
				{ id: 'pl_text_04', label: 'pl.col.header_artist_normal', value: grCfg.cTheme.pl_col_header_artist_normal },
				{ id: 'pl_text_05', label: 'pl.col.header_artist_playing', value: grCfg.cTheme.pl_col_header_artist_playing },
				{ id: 'pl_text_06', label: 'pl.col.header_album_normal', value: grCfg.cTheme.pl_col_header_album_normal },
				{ id: 'pl_text_07', label: 'pl.col.header_album_playing', value: grCfg.cTheme.pl_col_header_album_playing },
				{ id: 'pl_text_08', label: 'pl.col.header_info_normal', value: grCfg.cTheme.pl_col_header_info_normal },
				{ id: 'pl_text_09', label: 'pl.col.header_info_playing', value: grCfg.cTheme.pl_col_header_info_playing },
				{ id: 'pl_text_10', label: 'pl.col.header_date_normal', value: grCfg.cTheme.pl_col_header_date_normal },
				{ id: 'pl_text_11', label: 'pl.col.header_date_playing', value: grCfg.cTheme.pl_col_header_date_playing }
			],
			pl_text2: [
				{ id: 'pl_text_12', label: 'pl.col.row_title_normal', value: grCfg.cTheme.pl_col_row_title_normal },
				{ id: 'pl_text_13', label: 'pl.col.row_title_playing', value: grCfg.cTheme.pl_col_row_title_playing },
				{ id: 'pl_text_14', label: 'pl.col.row_title_selected', value: grCfg.cTheme.pl_col_row_title_selected },
				{ id: 'pl_text_15', label: 'pl.col.row_title_hovered', value: grCfg.cTheme.pl_col_row_title_hovered }
			],
			pl_misc: [
				{ id: 'pl_misc_01', label: 'pl.col.header_line_normal', value: grCfg.cTheme.pl_col_header_line_normal },
				{ id: 'pl_misc_02', label: 'pl.col.header_line_playing', value: grCfg.cTheme.pl_col_header_line_playing },
				{ id: 'pl_misc_03', label: 'pl.col.row_disc_subheader_line', value: grCfg.cTheme.pl_col_row_disc_subheader_line },
				{ id: 'pl_misc_04', label: 'pl.col.row_drag_line', value: grCfg.cTheme.pl_col_row_drag_line },
				{ id: 'pl_misc_05', label: 'pl.col.row_drag_line_reached', value: grCfg.cTheme.pl_col_row_drag_line_reached },
				{ id: 'pl_misc_06', label: 'pl.col.row_selection_frame', value: grCfg.cTheme.pl_col_row_selection_frame },
				{ id: 'pl_misc_07', label: 'pl.col.row_rating_color', value: grCfg.cTheme.pl_col_row_rating_color }
			],
			pl_btns: [
				{ id: 'pl_btns_01', label: 'pl.col.sbar_btn_normal', value: grCfg.cTheme.pl_col_sbar_btn_normal },
				{ id: 'pl_btns_02', label: 'pl.col.sbar_btn_hovered', value: grCfg.cTheme.pl_col_sbar_btn_hovered },
				{ id: 'pl_btns_03', label: 'pl.col.sbar_thumb_normal', value: grCfg.cTheme.pl_col_sbar_thumb_normal },
				{ id: 'pl_btns_04', label: 'pl.col.sbar_thumb_hovered', value: grCfg.cTheme.pl_col_sbar_thumb_hovered },
				{ id: 'pl_btns_04', label: 'pl.col.sbar_thumb_drag', value: grCfg.cTheme.pl_col_sbar_thumb_drag }
			]
		};

		if (sections[playlist_section]) {
			for (const section of sections[playlist_section]) {
				y += addColorSection(section.id, section.label, section.value, x, y, labelW, inputW, markerX) + margin;
			}
		}
	}

	/**
	 * The Library colors in the custom theme menu.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 * @param {string} library_section - The library color page to be opened.
	 * @private
	 */
	_customLibraryColors(x, y, w, h, library_section) {
		const margin = SCALE(20);
		const labelW = SCALE(300) + grSet.popupFontSize_layout;
		const inputW = SCALE(80)  + grSet.popupFontSize_layout;
		const markerX = x + margin + inputW + (grSet.popupFontSize_layout * HD_4K(0.5, 0.25)) - SCALE(2);

		const addColorSection = (id, label, value, x, y, labelW, inputW, markerX) => {
			const libColors = new CustomMenuInputField(id, label, value, x, y, labelW, inputW);
			CustomMenu.controlList.push(libColors);
			CustomMenu.controlList.push(new CustomMenuColorPicker(id, value, x + 2, y));
			CustomMenu.controlList.push(new CustomMenuColorMarker(id, value, markerX, y));
			return libColors.h;
		};

		const sections = {
			lib_bg: [
				{ id: 'lib_bg_01', label: 'lib.ui.col.bg', value: grCfg.cTheme.lib_ui_col_bg },
				{ id: 'lib_bg_02', label: 'lib.ui.col.rowStripes', value: grCfg.cTheme.lib_ui_col_rowStripes },
				{ id: 'lib_bg_03', label: 'lib.ui.col.nowPlayingBg', value: grCfg.cTheme.lib_ui_col_nowPlayingBg },
				{ id: 'lib_bg_04', label: 'lib.ui.col.sideMarker', value: grCfg.cTheme.lib_ui_col_sideMarker },
				{ id: 'lib_bg_05', label: 'lib.ui.col.selectionFrame', value: grCfg.cTheme.lib_ui_col_selectionFrame },
				{ id: 'lib_bg_06', label: 'lib.ui.col.selectionFrame2', value: grCfg.cTheme.lib_ui_col_selectionFrame2 },
				{ id: 'lib_bg_07', label: 'lib.ui.col.hoverFrame', value: grCfg.cTheme.lib_ui_col_hoverFrame }
			],
			lib_text: [
				{ id: 'lib_text_01', label: 'lib.ui.col.text', value: grCfg.cTheme.lib_ui_col_text },
				{ id: 'lib_text_02', label: 'lib.ui.col.text_h', value: grCfg.cTheme.lib_ui_col_text_h },
				{ id: 'lib_text_03', label: 'lib.ui.col.text_nowp', value: grCfg.cTheme.lib_ui_col_text_nowp },
				{ id: 'lib_text_04', label: 'lib.ui.col.textSel', value: grCfg.cTheme.lib_ui_col_textSel },
				{ id: 'lib_text_05', label: 'lib.ui.col.txt', value: grCfg.cTheme.lib_ui_col_txt },
				{ id: 'lib_text_06', label: 'lib.ui.col.txt_h', value: grCfg.cTheme.lib_ui_col_txt_h },
				{ id: 'lib_text_07', label: 'lib.ui.col.txt_box', value: grCfg.cTheme.lib_ui_col_txt_box },
				{ id: 'lib_text_08', label: 'lib.ui.col.search', value: grCfg.cTheme.lib_ui_col_search }
			],
			lib_node: [
				{ id: 'lib_node_01', label: 'lib.ui.col.iconPlus', value: grCfg.cTheme.lib_ui_col_iconPlus },
				{ id: 'lib_node_02', label: 'lib.ui.col.iconPlus_h', value: grCfg.cTheme.lib_ui_col_iconPlus_h },
				{ id: 'lib_node_03', label: 'lib.ui.col.iconPlus_sel', value: grCfg.cTheme.lib_ui_col_iconPlus_sel },
				...(grSet.libraryDesign === 'traditional' ? [
					{ id: 'lib_node_04', label: 'lib.ui.col.iconPlusBg', value: grCfg.cTheme.lib_ui_col_iconPlusBg },
					{ id: 'lib_node_05', label: 'lib.ui.col.iconMinus_e', value: grCfg.cTheme.lib_ui_col_iconMinus_e },
					{ id: 'lib_node_06', label: 'lib.ui.col.iconMinus_c', value: grCfg.cTheme.lib_ui_col_iconMinus_c },
					{ id: 'lib_node_07', label: 'lib.ui.col.iconMinus_h', value: grCfg.cTheme.lib_ui_col_iconMinus_h }
				] : [])
			],
			lib_btns: [
				{ id: 'lib_btns_01', label: 'lib.ui.col.searchBtn', value: grCfg.cTheme.lib_ui_col_searchBtn },
				{ id: 'lib_btns_02', label: 'lib.ui.col.crossBtn', value: grCfg.cTheme.lib_ui_col_crossBtn },
				{ id: 'lib_btns_03', label: 'lib.ui.col.filterBtn', value: grCfg.cTheme.lib_ui_col_filterBtn },
				{ id: 'lib_btns_04', label: 'lib.ui.col.settingsBtn', value: grCfg.cTheme.lib_ui_col_settingsBtn },
				{ id: 'lib_btns_05', label: 'lib.ui.col.line', value: grCfg.cTheme.lib_ui_col_line },
				{ id: 'lib_btns_06', label: 'lib.ui.col.s_line', value: grCfg.cTheme.lib_ui_col_s_line },
				{ id: 'lib_btns_07', label: 'lib.ui.col.sbarBtns', value: grCfg.cTheme.lib_ui_col_sbarBtns },
				{ id: 'lib_btns_08', label: 'lib.ui.col.sbarNormal', value: grCfg.cTheme.lib_ui_col_sbarNormal },
				{ id: 'lib_btns_09', label: 'lib.ui.col.sbarHovered', value: grCfg.cTheme.lib_ui_col_sbarHovered },
				{ id: 'lib_btns_10', label: 'lib.ui.col.sbarDrag', value: grCfg.cTheme.lib_ui_col_sbarDrag }
			]
		};

		if (sections[library_section]) {
			for (const section of sections[library_section]) {
				y += addColorSection(section.id, section.label, section.value, x, y, labelW, inputW, markerX) + margin;
			}
		}
	}

	/**
	 * The Biography colors in the custom theme menu.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 * @param {string} biography_section - The biography color page to be opened.
	 * @private
	 */
	_customBiographyColors(x, y, w, h, biography_section) {
		const margin = SCALE(20);
		const labelW = SCALE(300) + grSet.popupFontSize_layout;
		const inputW = SCALE(80) + grSet.popupFontSize_layout;
		const markerX = x + margin + inputW + (grSet.popupFontSize_layout * HD_4K(0.5, 0.25)) - SCALE(2);

		const addColorSection = (id, label, value, x, y, labelW, inputW, markerX) => {
			const bioColors = new CustomMenuInputField(id, label, value, x, y, labelW, inputW);
			CustomMenu.controlList.push(bioColors);
			CustomMenu.controlList.push(new CustomMenuColorPicker(id, value, x + 2, y));
			CustomMenu.controlList.push(new CustomMenuColorMarker(id, value, markerX, y));
			return bioColors.h;
		};

		const sections = {
			bio_bg: [
				{ id: 'bio_bg_01', label: 'bio.ui.col.bg', value: grCfg.cTheme.bio_ui_col_bg },
				{ id: 'bio_bg_02', label: 'bio.ui.col.rowStripes', value: grCfg.cTheme.bio_ui_col_rowStripes },
				{ id: 'bio_bg_03', label: 'bio.ui.col.noPhotoStubBg', value: grCfg.cTheme.bio_ui_col_noPhotoStubBg }
			],
			bio_text: [
				{ id: 'bio_text_01', label: 'bio.ui.col.headingText', value: grCfg.cTheme.bio_ui_col_headingText },
				{ id: 'bio_text_02', label: 'bio.ui.col.source', value: grCfg.cTheme.bio_ui_col_source },
				{ id: 'bio_text_03', label: 'bio.ui.col.accent', value: grCfg.cTheme.bio_ui_col_accent },
				{ id: 'bio_text_04', label: 'bio.ui.col.summary', value: grCfg.cTheme.bio_ui_col_summary },
				{ id: 'bio_text_05', label: 'bio.ui.col.text', value: grCfg.cTheme.bio_ui_col_text },
				{ id: 'bio_text_06', label: 'bio.ui.col.lyricsNormal', value: grCfg.cTheme.bio_ui_col_lyricsNormal },
				{ id: 'bio_text_07', label: 'bio.ui.col.lyricsHighlight', value: grCfg.cTheme.bio_ui_col_lyricsHighlight },
				{ id: 'bio_text_08', label: 'bio.ui.col.noPhotoStubText', value: grCfg.cTheme.bio_ui_col_noPhotoStubText }
			],
			bio_misc: [
				{ id: 'bio_misc_01', label: 'bio.ui.col.bottomLine', value: grCfg.cTheme.bio_ui_col_bottomLine },
				{ id: 'bio_misc_02', label: 'bio.ui.col.centerLine', value: grCfg.cTheme.bio_ui_col_centerLine },
				{ id: 'bio_misc_03', label: 'bio.ui.col.sectionLine', value: grCfg.cTheme.bio_ui_col_sectionLine }
			],
			bio_btns: [
				{ id: 'bio_btns_01', label: 'bio.ui.col.sbarBtns', value: grCfg.cTheme.bio_ui_col_sbarBtns },
				{ id: 'bio_btns_02', label: 'bio.ui.col.sbarNormal', value: grCfg.cTheme.bio_ui_col_sbarNormal },
				{ id: 'bio_btns_03', label: 'bio.ui.col.sbarHovered', value: grCfg.cTheme.bio_ui_col_sbarHovered },
				{ id: 'bio_btns_04', label: 'bio.ui.col.sbarDrag', value: grCfg.cTheme.bio_ui_col_sbarDrag }
			]
		};

		if (sections[biography_section]) {
			for (const section of sections[biography_section]) {
				y += addColorSection(section.id, section.label, section.value, x, y, labelW, inputW, markerX) + margin;
			}
		}
	}

	/**
	 * Sets the info page in the custom theme menu.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 * @param {string} link - The url to be opened.
	 * @private
	 */
	_customThemeInfo(x, y, w, h, link) {
		link = 'https://github.com/TT-ReBORN/Georgia-ReBORN/discussions/99';
		const margin = SCALE(20);
		const maxWidth = (grm.ui.ww * 0.5) - (margin * 4);

		const text = grm.msg.getMessage('customMenu', 'customThemeInfo');
		const height = MeasureString(text, grFont.popup, 0, 0, maxWidth, grm.ui.wh).Height;
		const info = new CustomMenuInfo(x, y, maxWidth, height, text, link);

		CustomMenu.controlList.push(info);
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Initializes the custom theme menu with panel sections and options for customizing the theme colors.
	 * @param {string} panel - The panel to be opened. Can be 'main', 'playlist', 'library', 'biography', 'info'.
	 * @param {string} section - The specific section to be opened within the panel.
	 * - For 'main': 'main_pre', 'main_bg', 'main_bar', 'main_bar2', 'main_bar3', 'main_text', 'main_btns', 'main_btns2', 'main_style'.
	 * - For 'playlist': 'pl_bg', 'pl_text1', 'pl_text2', 'pl_misc', 'pl_btns'.
	 * - For 'library': 'lib_bg', 'lib_text', 'lib_node', 'lib_btns'.
	 * - For 'biography': 'bio_bg', 'bio_text', 'bio_misc', 'bio_btns'.
	 */
	initCustomThemeMenu(panel, section) {
		CustomMenu.controlList = [];

		const margin = SCALE(40);
		const menuOnRightSide = grm.ui.displayBiography || grm.ui.displayLyrics && !grm.ui.displayDetails && !grm.ui.displayLibrary;
		const baseX = margin + (menuOnRightSide ? grSet.panelWidthAuto ? grm.ui.albumArtSize.x + grm.ui.albumArtSize.w : pl.playlist.x : grm.ui.displayDetails ? grm.ui.albumArtSize.x : 0);

		let x = baseX;
		let y = grm.ui.topMenuHeight + margin * 0.75;
		const w = menuOnRightSide ? grm.ui.ww - grm.ui.albumArtSize.w : grm.ui.albumArtSize.w;
		const h = grm.ui.wh - grm.ui.topMenuHeight - grm.ui.lowerBarHeight;

		const menu = new CustomMenuDropDown(x, y, 'Main', ['Pre', 'Bg', 'Bar', 'Bar 2', 'Bar 3', 'Text', 'Btns', 'Btns 2', 'Style'], 0);
		CustomMenu.controlList.push(menu);
		x += CustomMenu.controlList[CustomMenu.controlList.length - 1].w + 1; CustomMenu.controlList.push(new CustomMenuDropDown(x, y, 'Playlist',  ['Bg', 'Text', 'Text 2', 'Misc', 'Btns'], 0));
		x += CustomMenu.controlList[CustomMenu.controlList.length - 1].w + 1; CustomMenu.controlList.push(new CustomMenuDropDown(x, y, 'Library',   ['Bg', 'Text', 'Node', 'Btns'], 0));
		x += CustomMenu.controlList[CustomMenu.controlList.length - 1].w + 1; CustomMenu.controlList.push(new CustomMenuDropDown(x, y, 'Biography', ['Bg', 'Text', 'Misc', 'Btns'], 0));
		x += CustomMenu.controlList[CustomMenu.controlList.length - 1].w + 1; CustomMenu.controlList.push(new CustomMenuDropDown(x, y, 'Options',   ['Info', '', 'Theme 01', 'Theme 02', 'Theme 03', 'Theme 04', 'Theme 05', 'Theme 06', 'Theme 07', 'Theme 08', 'Theme 09', 'Theme 10', '', 'Rename', 'Reset'], 0));
		x += CustomMenu.controlList[CustomMenu.controlList.length - 1].w + 1; CustomMenu.controlList.push(new CustomMenuDropDown(x, y, '\u2715',    ['']));
		x = baseX;
		y += menu.h + margin * 0.75;

		const panels = {
			main: () => this._customMainColors(x, y, w, h, section),
			playlist: () => this._customPlaylistColors(x, y, w, h, section),
			library: () => this._customLibraryColors(x, y, w, h, section),
			biography: () => this._customBiographyColors(x, y, w, h, section),
			info: () => this._customThemeInfo(x, y, w, h)
		};

		const action = panels[panel];
		if (action) action();
	}

	/**
	 * Reinitializes the custom theme menu.
	 */
	reinitCustomThemeMenu() {
		if (!grm.ui.displayCustomThemeMenu) return;

		grm.ui.initCustomThemeMenuPosition();

		if (grm.ui.displayPlaylist && !grm.ui.displayBiography && !grm.ui.displayLyrics) {
			this.initCustomThemeMenu('playlist', 'pl_bg');
		} else if (grm.ui.displayDetails) {
			this.initCustomThemeMenu('main', 'main_bg');
		} else if (grm.ui.displayLibrary) {
			this.initCustomThemeMenu('library', 'lib_bg');
		} else if (grm.ui.displayBiography) {
			this.initCustomThemeMenu('biography', 'bio_bg');
		} else if (grm.ui.displayLyrics) {
			this.initCustomThemeMenu('main', 'main_text');
		}
	}

	/**
	 * Resets all colors in the active custom theme to defaults.
	 */
	resetCustomTheme() {
		const customThemes = {
			custom01: { schema: grDef.customTheme01Schema, customTheme: 'customTheme01' },
			custom02: { schema: grDef.customTheme02Schema, customTheme: 'customTheme02' },
			custom03: { schema: grDef.customTheme03Schema, customTheme: 'customTheme03' },
			custom04: { schema: grDef.customTheme04Schema, customTheme: 'customTheme04' },
			custom05: { schema: grDef.customTheme05Schema, customTheme: 'customTheme05' },
			custom06: { schema: grDef.customTheme06Schema, customTheme: 'customTheme06' },
			custom07: { schema: grDef.customTheme07Schema, customTheme: 'customTheme07' },
			custom08: { schema: grDef.customTheme08Schema, customTheme: 'customTheme08' },
			custom09: { schema: grDef.customTheme09Schema, customTheme: 'customTheme09' },
			custom10: { schema: grDef.customTheme10Schema, customTheme: 'customTheme10' }
		};

		if (!customThemes[grSet.theme]) return;

		const { schema, customTheme } = customThemes[grSet.theme];
		const themeDefaults = grCfg.configCustom.updateConfigObjValues(customTheme, grDef.customThemeDefaults, true);
		grCfg.cTheme = grCfg.configCustom.addConfigurationObject(schema, Object.assign({}, themeDefaults, grDef.customThemeDefaults), grDef.customThemeComments);
	}

	/**
	 * Updates all colors in the georgia-reborn-custom config file.
	 * @param {string} id - The id of the UI element.
	 * @param {string} value - The color of the UI element.
	 */
	updateCustomThemesConfig(id, value) {
		const customThemeColors = {
			// * PRELOADER * //
			main_pre_01: 'grCol_preloaderBg',
			main_pre_02: 'grCol_preloaderLogo',
			main_pre_03: 'grCol_preloaderLowerBarTitle',
			main_pre_04: 'grCol_preloaderProgressBar',
			main_pre_05: 'grCol_preloaderProgressBarFill',
			main_pre_06: 'grCol_preloaderProgressBarFrame',
			main_pre_07: 'grCol_preloaderUIHacksFrame',
			// * MAIN - BG * //
			main_bg_01: 'grCol_bg',
			main_bg_02: 'grCol_popupBg',
			main_bg_03: 'grCol_detailsBg',
			main_bg_04: 'grCol_shadow',
			main_bg_05: 'grCol_discArtShadow',
			main_bg_06: 'grCol_noAlbumArtStub',
			// * MAIN - BAR * //
			main_bar_01: 'grCol_timelineAdded',
			main_bar_02: 'grCol_timelinePlayed',
			main_bar_03: 'grCol_timelineUnplayed',
			main_bar_04: 'grCol_timelineFrame',
			main_bar_05: 'grCol_progressBar',
			main_bar_06: 'grCol_progressBarStreaming',
			main_bar_07: 'grCol_progressBarFrame',
			main_bar_08: 'grCol_progressBarFill',
			main_bar_09: 'grCol_volumeBar',
			main_bar_10: 'grCol_volumeBarFrame',
			main_bar_11: 'grCol_volumeBarFill',
			// * MAIN - BAR 2 * //
			main_bar_12: 'grCol_peakmeterBarProg',
			main_bar_13: 'grCol_peakmeterBarProgFill',
			main_bar_14: 'grCol_peakmeterBarFillTop',
			main_bar_15: 'grCol_peakmeterBarFillMiddle',
			main_bar_16: 'grCol_peakmeterBarFillBack',
			main_bar_17: 'grCol_peakmeterBarVertProgFill',
			main_bar_18: 'grCol_peakmeterBarVertFill',
			main_bar_19: 'grCol_peakmeterBarVertFillPeaks',
			// * MAIN - BAR 3 * //
			main_bar_20: 'grCol_waveformBarFillFront',
			main_bar_21: 'grCol_waveformBarFillBack',
			main_bar_22: 'grCol_waveformBarFillPreFront',
			main_bar_23: 'grCol_waveformBarFillPreBack',
			main_bar_24: 'grCol_waveformBarIndicator',
			// * MAIN - TEXT * //
			main_text_01: 'grCol_lowerBarArtist',
			main_text_02: 'grCol_lowerBarTitle',
			main_text_03: 'grCol_lowerBarTime',
			main_text_04: 'grCol_lowerBarLength',
			main_text_05: 'grCol_detailsText',
			main_text_06: 'grCol_detailsRating',
			main_text_08: 'grCol_popupText',
			main_text_09: 'grCol_lyricsNormal',
			main_text_10: 'grCol_lyricsHighlight',
			main_text_11: 'grCol_lyricsShadow',
			// * MAIN - BTNS * //
			main_btns_01: 'grCol_menuBgColor',
			main_btns_02: 'grCol_menuStyleBg',
			main_btns_03: 'grCol_menuRectStyleEmbossTop',
			main_btns_04: 'grCol_menuRectStyleEmbossBottom',
			main_btns_05: 'grCol_menuRectNormal',
			main_btns_06: 'grCol_menuRectHovered',
			main_btns_07: 'grCol_menuRectDown',
			main_btns_08: 'grCol_menuTextNormal',
			main_btns_09: 'grCol_menuTextHovered',
			main_btns_10: 'grCol_menuTextDown',
			// * MAIN - BTNS 2 * //
			main_btns_11: 'grCol_transportEllipseBg',
			main_btns_12: 'grCol_transportEllipseNormal',
			main_btns_13: 'grCol_transportEllipseHovered',
			main_btns_14: 'grCol_transportEllipseDown',
			main_btns_15: 'grCol_transportStyleBg',
			main_btns_16: 'grCol_transportStyleTop',
			main_btns_17: 'grCol_transportStyleBottom',
			main_btns_18: 'grCol_transportIconNormal',
			main_btns_19: 'grCol_transportIconHovered',
			main_btns_20: 'grCol_transportIconDown',
			// * MAIN - STYLE * //
			main_style_01: 'grCol_styleBevel',
			main_style_02: 'grCol_styleGradient',
			main_style_03: 'grCol_styleGradient2',
			main_style_04: 'grCol_styleProgressBar',
			main_style_05: 'grCol_styleProgressBarLineTop',
			main_style_06: 'grCol_styleProgressBarLineBottom',
			main_style_07: 'grCol_styleProgressBarFill',
			main_style_08: 'grCol_styleVolumeBar',
			main_style_09: 'grCol_styleVolumeBarFill',

			// * PLAYLIST - BG * //
			pl_bg_01: 'pl_col_bg',
			pl_bg_02: 'pl_col_header_nowplaying_bg',
			pl_bg_03: 'pl_col_header_sideMarker',
			pl_bg_04: 'pl_col_row_nowplaying_bg',
			pl_bg_05: 'pl_col_row_stripes_bg',
			pl_bg_06: 'pl_col_row_sideMarker',
			// * PLAYLIST - TEXT * //
			pl_text_01: 'pl_col_plman_text_normal',
			pl_text_02: 'pl_col_plman_text_hovered',
			pl_text_03: 'pl_col_plman_text_pressed',
			pl_text_04: 'pl_col_header_artist_normal',
			pl_text_05: 'pl_col_header_artist_playing',
			pl_text_06: 'pl_col_header_album_normal',
			pl_text_07: 'pl_col_header_album_playing',
			pl_text_08: 'pl_col_header_info_normal',
			pl_text_09: 'pl_col_header_info_playing',
			pl_text_10: 'pl_col_header_date_normal',
			pl_text_11: 'pl_col_header_date_playing',
			pl_text_12: 'pl_col_row_title_normal',
			pl_text_13: 'pl_col_row_title_playing',
			pl_text_14: 'pl_col_row_title_selected',
			pl_text_15: 'pl_col_row_title_hovered',
			// * PLAYLIST - MISC * //
			pl_misc_01: 'pl_col_header_line_normal',
			pl_misc_02: 'pl_col_header_line_playing',
			pl_misc_03: 'pl_col_row_disc_subheader_line',
			pl_misc_04: 'pl_col_row_drag_line',
			pl_misc_05: 'pl_col_row_drag_line_reached',
			pl_misc_06: 'pl_col_row_selection_frame',
			pl_misc_07: 'pl_col_row_rating_color',
			// * PLAYLIST - BTNS * //
			pl_btns_01: 'pl_col_sbar_btn_normal',
			pl_btns_02: 'pl_col_sbar_btn_hovered',
			pl_btns_03: 'pl_col_sbar_thumb_normal',
			pl_btns_04: 'pl_col_sbar_thumb_hovered',
			pl_btns_05: 'pl_col_sbar_thumb_drag',

			// * LIBRARY - BG * //
			lib_bg_01: 'lib_ui_col_bg',
			lib_bg_02: 'lib_ui_col_rowStripes',
			lib_bg_03: 'lib_ui_col_nowPlayingBg',
			lib_bg_04: 'lib_ui_col_sideMarker',
			lib_bg_05: 'lib_ui_col_selectionFrame',
			lib_bg_06: 'lib_ui_col_selectionFrame2',
			lib_bg_07: 'lib_ui_col_hoverFrame',
			// * LIBRARY - TEXT * //
			lib_text_01: 'lib_ui_col_text',
			lib_text_02: 'lib_ui_col_text_h',
			lib_text_03: 'lib_ui_col_text_nowp',
			lib_text_04: 'lib_ui_col_textSel',
			lib_text_05: 'lib_ui_col_txt',
			lib_text_06: 'lib_ui_col_txt_h',
			lib_text_07: 'lib_ui_col_txt_box',
			lib_text_08: 'lib_ui_col_search',
			// * LIBRARY - NODE * //
			lib_node_01: 'lib_ui_col_iconPlus',
			lib_node_02: 'lib_ui_col_iconPlus_h',
			lib_node_03: 'lib_ui_col_iconPlus_sel',
			lib_node_04: 'lib_ui_col_iconPlusBg',
			lib_node_05: 'lib_ui_col_iconMinus_e',
			lib_node_06: 'lib_ui_col_iconMinus_c',
			lib_node_07: 'lib_ui_col_iconMinus_h',
			// * LIBRARY - BTNS * //
			lib_btns_01: 'lib_ui_col_searchBtn',
			lib_btns_02: 'lib_ui_col_crossBtn',
			lib_btns_03: 'lib_ui_col_filterBtn',
			lib_btns_04: 'lib_ui_col_settingsBtn',
			lib_btns_05: 'lib_ui_col_line',
			lib_btns_06: 'lib_ui_col_s_line',
			lib_btns_07: 'lib_ui_col_sbarBtns',
			lib_btns_08: 'lib_ui_col_sbarNormal',
			lib_btns_09: 'lib_ui_col_sbarHovered',
			lib_btns_10: 'lib_ui_col_sbarDrag',

			// * BIOGRAPHY - BG * //
			bio_bg_01: 'bio_ui_col_bg',
			bio_bg_02: 'bio_ui_col_rowStripes',
			bio_bg_03: 'bio_ui_col_noPhotoStubBg',
			// * BIOGRAPHY - TEXT * //
			bio_text_01: 'bio_ui_col_headingText',
			bio_text_02: 'bio_ui_col_source',
			bio_text_03: 'bio_ui_col_accent',
			bio_text_04: 'bio_ui_col_summary',
			bio_text_05: 'bio_ui_col_text',
			bio_text_06: 'bio_ui_col_lyricsNormal',
			bio_text_07: 'bio_ui_col_lyricsHighlight',
			bio_text_08: 'bio_ui_col_noPhotoStubText',
			// * BIOGRAPHY - MISC * //
			bio_misc_01: 'bio_ui_col_bottomLine',
			bio_misc_02: 'bio_ui_col_centerLine',
			bio_misc_03: 'bio_ui_col_sectionLine',
			// * BIOGRAPHY - BTNS * //
			bio_btns_01: 'bio_ui_col_sbarBtns',
			bio_btns_02: 'bio_ui_col_sbarNormal',
			bio_btns_03: 'bio_ui_col_sbarHovered',
			bio_btns_04: 'bio_ui_col_sbarDrag'
		};

		// Update custom theme colors
		if (Object.prototype.hasOwnProperty.call(customThemeColors, id)) {
			grCfg.cTheme[customThemeColors[id]] = value;
		}

		// Update control list colors
		for (const color of CustomMenu.controlList) {
			if (color.id === id) {
				color.value = value;
			}
		}
	}
	// #endregion
}


////////////////////////////
// * METADATA GRID MENU * //
////////////////////////////
/**
 * A class that creates and handles the metadata grid menu.
 */
class MetadataGridMenu {
	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Shows the info page of the custom metadata grid menu.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 * @param {string} link - The url to a website.
	 * @private
	 */
	_info(x, y, w, h, link) {
		link = 'https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Title_Formatting_Reference';
		const maxWidth = grm.ui.ww * 0.66 - SCALE(100);

		const text = grm.msg.getMessage('customMenu', 'metadataGridMenuInfo');
		const height = MeasureString(text, grFont.popup, 0, 0, maxWidth, grm.ui.wh).Height;
		const info = new CustomMenuInfo(x, y, maxWidth, height, text, link);

		CustomMenu.controlList.push(info);
	}

	/**
	 * Displays the current page of the custom metadata grid menu.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @param {number} w - The width.
	 * @param {number} h - The height.
	 * @param {number} page - The metadata grid page to display, it can have values from 1 to 4.
	 * @private
	 */
	_page(x, y, w, h, page) {
		const prefs = grCfg.config.readConfiguration();
		const margin = SCALE(20);
		const inputW = SCALE(80) + grSet.popupFontSize_layout;
		const start  = page === 1 ? 0 : page === 2 ?  8 : page === 3 ? 16 : page === 4 ? 24 : 0;
		const end    = page === 1 ? 8 : page === 2 ? 16 : page === 3 ? 24 : page === 4 ? 32 : 8;

		for (let i = start; i < end; i++) {
			try {
				const label = prefs.metadataGrid[i].label ? prefs.metadataGrid[i].label : '""';
				const value = prefs.metadataGrid[i].val ? prefs.metadataGrid[i].val : '""';
				const input = new CustomMenuInputField(label, '', label, x + 1, y, '', inputW);
				CustomMenu.controlList.push(input);
				CustomMenu.controlList.push(new CustomMenuInputField2(label, '', value, x + inputW, y, '', Math.ceil(grm.ui.ww * 0.5 + inputW - margin)));
				y += input.h + margin * 1.25;
			}
			catch (e) {
				break;
			}
		}
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Initializes the custom metadata grid menu.
	 * @param {string} page - The current page number of the metadata grid.
	 * @param {boolean} info - Displays the metadata grid info page.
	 */
	initMetadataGridMenu(page, info) {
		CustomMenu.controlList = [];

		const margin = SCALE(40);
		const baseX = grm.ui.displayBiography || grm.ui.displayLyrics && !grm.ui.displayDetails ? grm.ui.ww * 0.5 + margin : grm.ui.displayDetails ? grm.ui.albumArtSize.x + margin : margin;
		let x = baseX;
		let y = grm.ui.albumArtSize.y + margin * 0.75;

		const menu = new CustomMenuDropDown(x, y, 'Page 1', ['Page 1'], 0);
		CustomMenu.controlList.push(menu);
		x += CustomMenu.controlList[CustomMenu.controlList.length - 1].w + 1; CustomMenu.controlList.push(new CustomMenuDropDown(x, y, 'Page 2',  ['Page 2'], 0));
		x += CustomMenu.controlList[CustomMenu.controlList.length - 1].w + 1; CustomMenu.controlList.push(new CustomMenuDropDown(x, y, 'Page 3',  ['Page 3'], 0));
		x += CustomMenu.controlList[CustomMenu.controlList.length - 1].w + 1; CustomMenu.controlList.push(new CustomMenuDropDown(x, y, 'Page 4',  ['Page 4'], 0));
		x += CustomMenu.controlList[CustomMenu.controlList.length - 1].w + 1; CustomMenu.controlList.push(new CustomMenuDropDown(x, y, 'Options', ['Info', '', 'Reset'], 0));
		x += CustomMenu.controlList[CustomMenu.controlList.length - 1].w + 1; CustomMenu.controlList.push(new CustomMenuDropDown(x, y, '\u2715',  ['']));
		x =  baseX;
		y += menu.h + margin * 0.75;

		if (info) {
			this._info(x, y, grm.ui.ww * 0.5, grm.ui.wh - grm.ui.topMenuHeight - grm.ui.lowerBarHeight);
		} else {
			this._page(x - margin * 0.5, y, grm.ui.ww * 0.5, grm.ui.wh - grm.ui.topMenuHeight - grm.ui.lowerBarHeight, page);
		}
	}

	/**
	 * Resets the labels and keys from the metadata grid in the georgia-reborn-config file.
	 */
	resetMetadataGrid() {
		const prefs = grCfg.config.readConfiguration();
		const metadataGrid = prefs.metadataGrid;

		for (let i = 0; i < metadataGrid.length; i++) {
			metadataGrid[i].label = grDef.metadataGridDefaults[i].label;
			metadataGrid[i].val = grDef.metadataGridDefaults[i].val;
		}

		grCfg.config.updateConfigObjValues('metadataGrid', metadataGrid, true);
		grm.details.updateGrid();
		window.Repaint();
	}

	/**
	 * Updates the labels and keys from the metadata grid in the georgia-reborn-config file.
	 * @param {string} id - The metadata gird label name.
	 * @param {string} value1 - The metadata grid tag name.
	 * @param {string} value2 - The metadata grid tag value.
	 */
	updateMetadataGridFromConfig(id, value1, value2) {
		const prefs = grCfg.config.readConfiguration();
		const metadataGrid = prefs.metadataGrid;
		const index = metadataGrid.findIndex(x => x.label === id);

		if (index > -1) {
			if (value1) {
				metadataGrid[index].label = SanitizeJsonString(value1);
			} else if (value1 === '') {
				metadataGrid[index].label = `Blank ${index}`;
			}

			if (value2) {
				metadataGrid[index].val = SanitizeJsonString(value2);
			} else if (value2 === '') {
				metadataGrid[index].val = '';
			}
		}

		grCfg.config.updateConfigObjValues('metadataGrid', metadataGrid, true);
		grm.details.updateGrid();
		window.Repaint();
	}
	// #endregion
}
