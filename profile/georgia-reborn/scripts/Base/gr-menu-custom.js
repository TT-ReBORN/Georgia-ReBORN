/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Custom Menu                          * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-DEV                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-12-18                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////////////////
// * CUSTOM MENU VARIABLES * //
///////////////////////////////
/** @type {number} The virtual key code for the "Copy" command. */
const VK_COPY = 0x03;

/** @type {number} The virtual key code for the "Cut" command. */
const VK_CUT = 0x18;

/** @type {number} The virtual key code for the "Paste" command. */
const VK_PASTE = 0x16;

/** @type {number} The virtual key code for the "Select All" command. */
const VK_SELECT_ALL = 0x01;

/** @type {GdiBitmap} The GDI image object for getGraphics. */
let getImage;

/** @type {GdiGraphics} The GDI graphics object to calculate text widths. */
let getGraphics;


//////////////////////////////
// * CUSTOM MENU CONTROLS * //
//////////////////////////////
/**
 * Base control for mouse and keyboard events of the custom menu.
 */
class BaseControl {
	/**
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @param {string} label The menu names.
	 * @class
	 */
	constructor(x, y, label) {
		/** @protected */ this.x = x;
		/** @protected */ this.y = y;
		/** @protected */ this.label = label;
		this.state = {};
		this.doubleClickTime = 300;
		this.lastClickTime = null;
		this.focus = false;
		this.disabled = false;
		this._hovered = false;
		this.font = ft.popup;
		this.popupFontSize = pref[`popupFontSize_${pref.layout}`];
		this.closeBtn = this.label === '\u2715';
		/** @protected */ this.g = undefined;
		if (!getImage) {
			getImage = gdi.CreateImage(1, 1);
			getGraphics = getImage.GetGraphics();
		}
		this.g = getGraphics;
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
	 * @param {boolean} value True or false.
	 */
	set hovered(value) {
		this._hovered = value;
	}

	// * METHODS * //

	/**
	 * Calculates the width of a given text using a specified font and optionally rounds the result.
	 * @param {string} text The text for which the width will be calculated.
	 * @param {GdiFont} font The font to use for calculating the width.
	 * @param {boolean=} [round=false] The rounded value if set.
	 * @returns {number} The text width number of the used font.
	 */
	calcTextWidth(text, font, round) {
		const w = this.g.CalcTextWidth(text, font);
		return round ? Math.ceil(w) : w;
	}

	/**
	 * Calculates the height of a given text using a specified font and optionally rounds the result.
	 * @param {string} text The text for which the height will be calculated.
	 * @param {GdiFont} font The font to use for calculating the height.
	 * @param {boolean=} [round=false] The rounded value if set.
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
		getImage.ReleaseGraphics(this.g);
	}

	/**
	 * A placeholder that handles mouse down events.
	 * These aren't really virtually, just stubbed so that not every child needs to create one if it wants to ignore these events.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @virtual
	 */
	mouseDown(x, y) {}

	/**
	 * A placeholder that handles letter keystrokes events.
	 * These aren't really virtually, just stubbed so that not every child needs to create one if it wants to ignore these events.
	 * @param {number} code The character code.
	 * @virtual
	 */
	onChar(code) {}

	/**
	 * A placeholder that handles keyboard events.
	 * These aren't really virtually, just stubbed so that not every child needs to create one if it wants to ignore these events.
	 * @param {number} vkey The virtual key code.
	 * @virtual
	 */
	onKey(vkey) {}

	// * CALLBACKS * //

	/**
	 * Handles character input events for an active control.
	 * @param {number} code The character code.
	 */
	on_char(code) {
		if (activeControl) {
			activeControl.onChar(code);
		}
	}

	/**
	 * Handles key down events and calls the onKey method.
	 * @param {number} vkey The virtual key code.
	 */
	on_key_down(vkey) {
		if (activeControl) {
			activeControl.onKey(vkey);
		}
	}

	/**
	 * Handles left mouse button down events.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 */
	on_mouse_lbtn_down(x, y) {
		mouseDown = true;
	}

	/**
	 * Handles left mouse button up and double click events.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @param {string} m The mouse mask.
	 */
	on_mouse_lbtn_up(x, y, m) {
		if (Date.now() - this.lastClickTime > this.doubleClickTime) {
			this.lastClickTime = Date.now();
			mouseDown = false;
			let found = false;
			if (activeControl && activeControl instanceof DropDownMenu && activeControl.isSelectUp && activeControl.mouseInThis(x, y)) {
				activeControl.clicked(x, y);
				found = true;
			}
			for (let i = controlList.length - 1; i >= 0 && !found; i--) { // Reverse order for better z-index handling
				if (controlList[i].mouseInThis(x, y)) {
					if (activeControl && activeControl !== controlList[i]) activeControl.clearFocus();
					activeControl = controlList[i];
					activeControl.clicked(x, y);
					found = true;
				}
			}
			if (!found && activeControl) {
				activeControl.clearFocus();
				activeControl = undefined;
			}
		}
		else {
			this.lastClickTime = Date.now();
			activeControl && activeControl.doubleClicked(x, y);
		}
	}

	/**
	 * Handles mouse movement events and updates the hovered control based on the mouse cursor's current position.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 */
	on_mouse_move(x, y) {
		if (x === this.state.mouse_x && y === this.state.mouse_y) return;

		this.state.mouse_x = x;
		this.state.mouse_y = y;
		let found = false;

		const setHovered = (control) => {
			if (hoveredControl && hoveredControl !== control) hoveredControl.hovered = false; // Clear last hovered control
			hoveredControl = control;
			hoveredControl.hovered = true;
			found = true;
		};

		if (activeControl && activeControl instanceof DropDownMenu && activeControl.isSelectUp && activeControl.mouseInThis(x, y)) {  // handles z-index stuff in a janky way
			setHovered(activeControl);
		}
		for (let i = controlList.length - 1; i >= 0; i--) { // Traverse list in reverse order to better handle z-index issues
			if (controlList[i].mouseInThis(x, y)) {
				setHovered(controlList[i]);
				if (mouseDown) {
					controlList[i].mouseDown(x, y);
				}
				break;
			}
		}
		if (!found && hoveredControl) {
			hoveredControl.hovered = false;
			hoveredControl = null;
		}
	}

	/**
	 * Handles resizing events and updates the display accordingly.
	 */
	on_size() {
		setTimeout(() => {
			if (displayCustomThemeMenu) reinitCustomThemeMenu();
			else if (displayMetadataGridMenu) initMetadataGridMenu();
			window.Repaint();
		}, 0);
	}
}


//////////////////////////////
// * CUSTOM MENU DROPDOWN * //
//////////////////////////////
/**
 * Drop down top navigation of the custom menu.
 */
class DropDownMenu extends BaseControl {
	/**
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @param {string} label The main drop down menu item.
	 * @param {string[]} labelArray The submenu items of the main.
	 * @param {number=} [activeIndex=-1] The index and state of the drop down main item.
	 * @extends {BaseControl}
	 * @class
	 */
	constructor(x, y, label, labelArray, activeIndex) {
		super(x, y, label);
		/** @private */ this.labelArray = labelArray;
		this.activeIndex = activeIndex || -1;
		/** @private @const */ this.padding = SCALE(5); // The padding between top and label and option and bottom line
		this.labelW = this.calcTextWidth(label, this.font) + this.padding * 4;
		this.optionW = this.calcTextWidth(LongestString(this.labelArray), this.font) + this.padding * 4;
		this.w = Math.max(this.labelW, this.optionW);
		/** @private @const */ this.labelHeight = Math.ceil(this.calcTextHeight('Ag', this.font));
		/** @private @const */ this.optionHeight = Math.ceil(this.calcTextHeight('Ag', this.font));
		this.h = this.labelHeight + this.padding * 2; // This.h = this.labelHeight + this.padding + this.optionHeight + this.padding;
		/** @private @const */ this.borderPadding = SCALE(5);
		/** @private */ this.selectUp = false;
		/** @private */ this.selectUpHeight = (this.optionHeight + this.padding * 2) * this.labelArray.length;  // Height of select up option
		/** @private */ this.selectUpHoveredOption = -1; // When selectUp is visible, which item is hovered
		/** @private {number} */ this.selectUpActiveIndex = -1; // This is the index that is active when the selectUp is toggled

		this.selectedColor = RGB(0, 0, 0);
	}

	/**
	 * Gets the drop down menu item hover state.
	 * @returns {boolean} True or false.
	 */
	get hovered() {
		return this._hovered;
	}

	/**
	 * Sets the drop down menu item hover state.
	 * @param {boolean} value
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
	 * @param {boolean} value
	 */
	set isSelectUp(value) {
		this.selectUp = value;
	}

	// * METHODS * //

	/**
	 * Draws the drop down menu.
	 * @param {GdiGraphics} gr
	 */
	draw(gr) {
		gr.SetSmoothingMode(SmoothingMode.None);
		gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);

		const lightBg =
			new Color(col.bg).brightness + imgBrightness > 285 && (pref.styleBlend || pref.styleBlend2)
			||
			new Color(col.bg).brightness > 150 && !pref.styleBlend && !pref.styleBlend2;

		const textColor = lightBg ? RGB(0, 0, 0) : RGB(255, 255, 255);
		const lineCorr = this.label === 'Main' ? 2 : 0;
		const lineHeight = this.hovered || this.focus ? this.h : 1;
		const optionH = this.optionHeight + this.padding * 2;
		let   optionY = this.getFirstOptionY();

		gr.FillSolidRect(this.x, this.y, this.w, this.h, col.bg);

		if (this.selectUp) {
			gr.SetSmoothingMode(SmoothingMode.AntiAlias);
			gr.FillSolidRect(this.x, this.y, this.w - 1, this.selectUpHeight + this.h, TintColor(col.bg, 10));
			gr.DrawLine(this.x, optionY, this.x + this.w - 1, optionY, 2, ShadeColor(col.bg, 20));
			this.labelArray.forEach((option, i) => {
				const isActive = this.activeIndex === i;
				if (isActive || this.selectUpHoveredOption === i) {
					const color = isActive ? col.progressBarFill : ShadeColor(col.bg, 10);
					gr.FillSolidRect(this.x, optionY, this.w - 1, optionH, color);
				}
				gr.DrawLine(this.x, optionY, this.x + this.w - 1, optionY, 1, ShadeColor(col.bg, 10));
				gr.GdiDrawText(option, this.font, textColor, this.x + this.padding * 2, optionY + this.padding, this.w - this.padding * 4, optionH, StringFormat(0, 0, 4));
				optionY += optionH;
			});
		}
		else { // Line is not visible if select is up
			gr.FillSolidRect(this.x, this.y + this.h - lineHeight, this.w - 1, lineHeight, TintColor(col.bg, 10));
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
	 * Gets the y-coordinate of the main drop down menu item.
	 * @returns {number} The y-coordinate of the first option.
	 */
	getFirstOptionY() {
		return this.y + this.labelHeight + this.padding * 2;
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
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
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
		customMenuButtonHandler(this.label, this.labelArray, this.activeIndex);
		window.Repaint();
	}

	/**
	 * Handles double click events on a drop down menu item.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 */
	doubleClicked(x, y) {
		this.clicked(x, y);
	}

	/**
	 * Checks if the mouse is over a drop down menu item.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
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
	 * @param {number} vkey The virtual key code.
	 */
	onKey(vkey) {
		switch (vkey) {
			case VK_RETURN:
			case VK_SPACE:
				if (!this.selectUp) {
					this.clicked();
				} else {
					this.selectUp = false;
					this.repaint();
				}
				break;
			case VK_UP:
				if (this.activeIndex !== -1) {
					this.activeIndex = Math.max(this.activeIndex - 1, 0);
					this.repaint();
				}
				break;
			case VK_DOWN:
				this.activeIndex = Math.min(this.activeIndex + 1, this.labelArray.length - 1);
				this.repaint();
				break;
			case VK_ESCAPE:
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
}


//////////////////////////////////
// * CUSTOM MENU STRING INPUT * //
//////////////////////////////////
/**
 * The first string input object of the custom menu, draws stored values of variables.
 */
class StringInput extends BaseControl {
	/**
	 * Creates a text input field with a label, value, and position in the custom menu.
	 * @param {string} id The unique identifier for the input field.
	 * @param {string} label The description for the input field.
	 * @param {string|number} value The stored value of the input field.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @param {number} labelWidth The width of the label area.
	 * @param {number} inputWidth The width of the input field.
	 * @extends {BaseControl}
	 * @class
	 */
	constructor(id, label, value, x, y, labelWidth, inputWidth) {
		super(x, y, label);
		this.id = id;
		/** @private */ this.h = this.calcTextHeight('Ag', this.font);
		/** @private */ this.padding = SCALE(3);
		/** @private */ this.lineThickness = SCALE(2);
		/** @private */ this.inputX = this.x + (displayMetadataGridMenu ? SCALE(20) : this.h);
		/** @private */ this.value = value;
		/** @private */ this.labelW = labelWidth;
		/** @private */ this.inputW = inputWidth - this.padding * 2 + this.popupFontSize; // Subtract out padding
		/** @constant @private */ this.cursorRefreshInterval = 350; // Ms
		/** @private */ this.timerId = undefined;
		/** @private */ this.showCursor = false;
		/** @private */ this.selEnd = -1;
		/** @private */ this.selAnchor = -1;
		/** @private */ this.cursorPos = 0;
		/** @private */ this.offsetChars = 0; // Number of chars that are not visible in the input field (scrolled to the left)
	}

	/**
	 * Checks the selection of the string input field.
	 * @returns {boolean} True or false.
	 */
	get hasSelection() {
		return this.selAnchor !== -1;
	}

	/**
	 * Gets the string input field hover state.
	 * @returns {boolean} True or false.
	 */
	get hovered() {
		return this._hovered;
	}

	/**
	 * Sets the string input field hover state.
	 * @param {boolean} value
	 */
	set hovered(value) {
		this._hovered = value;
		this.repaint();
	}

	// * METHODS * //

	/**
	 * Draws the string input field with a label and value.
	 * @param {GdiGraphics} gr
	 */
	draw(gr) {
		gr.SetTextRenderingHint(TextRenderingHint.AntiAlias);
		const margin = SCALE(20);
		const textX = this.inputX + this.padding * 4;
		const lightBg =
			new Color(g_pl_colors.bg).brightness + imgBrightness > 285 && (pref.styleBlend || pref.styleBlend2)
			||
			new Color(g_pl_colors.bg).brightness > 150 && !pref.styleBlend && !pref.styleBlend2;

		const textColor = lightBg ? RGB(0, 0, 0) : RGB(255, 255, 255);
		const outlineColor = this.focus ? HEXtoRGB(this.value) : RGB(120, 120, 120);

		gr.GdiDrawText(this.label, this.font, textColor, this.inputX + this.inputW + margin * 2, this.y, this.labelW, this.h, StringFormat(0, 0, 4));
		gr.FillSolidRect(this.inputX, this.y - this.padding, this.inputW + margin, this.h + this.padding * 2, RGB(255, 255, 255));
		gr.DrawRect(this.inputX, this.y - this.padding, this.inputW + margin, this.h + this.padding * 2, this.lineThickness, outlineColor);
		gr.GdiDrawText(this.value.substr(this.offsetChars), this.font, RGB(0, 0, 0), textX, this.y, this.inputW, this.h, StringFormat(0, 0, 4));

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

			const lightBg =
				new Color(HEXtoRGB(this.value)).brightness + imgBrightness > 285 && (pref.styleBlend || pref.styleBlend2)
				||
				new Color(HEXtoRGB(this.value)).brightness > 150 && !pref.styleBlend && !pref.styleBlend2;

			const textColor = lightBg ? RGB(0, 0, 0) : RGB(255, 255, 255);

			gr.FillSolidRect(start, this.y, maxWidth, this.h, HEXtoRGB(this.value));
			gr.GdiDrawText(this.value.substr(selStartIndex, selEndIndex - selStartIndex), this.font, textColor, start, this.y, maxWidth, this.h, StringFormat(0, 0, 4));
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
		let width = this.g.CalcTextWidth(this.value.substr(this.offsetChars, this.cursorPos - this.offsetChars), this.font, true);
		let j = 0;
		while (width > this.inputW && j < 999) {
			j++;
			this.offsetChars++;
			width = this.g.CalcTextWidth(this.value.substr(this.offsetChars, this.cursorPos - this.offsetChars), this.font, true);
		}
		if (j === 0) {
			while (width < this.inputW && this.offsetChars >= 0) {
				this.offsetChars--;
				width = this.g.CalcTextWidth(this.value.substr(this.offsetChars, this.cursorPos - this.offsetChars), this.font, true);
			}
			this.offsetChars++;
		}
	}

	/**
	 * Clears the focus of the string input field.
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
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 */
	clicked(x, y) {
		if (!this.mouseInThis(x, y)) return;
		this.focus = true;
		const oldCursor = this.cursorPos;
		this.cursorPos = this.getCursorIndex(x);
		if (utils.IsKeyPressed(VK_SHIFT)) {
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
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 */
	doubleClicked(x, y) {
		const clickPos = this.getCursorIndex(x);
		if (this.hasSelection && Math.abs(this.selAnchor - this.selEnd) !== this.value.length &&
			((clickPos >= this.selAnchor && clickPos <= this.selEnd) ||
			(clickPos <= this.selAnchor && clickPos >= this.selEnd))) {
			this.onChar(VK_SELECT_ALL);
		} else {
			this.selAnchor = Math.max(0, this.value.substr(0, clickPos).lastIndexOf(' ') + 1);
			this.selEnd = this.value.indexOf(' ', clickPos);
			if (this.selEnd === -1) this.selEnd = this.value.length;
			this.cursorPos = this.selEnd;
		}
	}

	/**
	 * Flashes the mouse cursor and repaints the control.
	 * @param {boolean=} showImmediate
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
	 * @param {number} x The x-coordinate.
	 * @returns {number} The index of the cursor position.
	 * @private
	 */
	getCursorIndex(x) {
		const inputX = x - this.inputX; // X-position inside control
		let pos = this.padding;
		for (let i = this.offsetChars; i < this.value.length; i++) {
			const charWidth = this.g.CalcTextWidth(this.value.substr(i, 1), this.font, true);
			if (Math.round(pos + (charWidth / 2)) >= inputX) {
				return i;
			}
			pos += charWidth;
		}
		return this.value.length;
	}

	/**
	 * Calculates the x-coordinate of the cursor position based on the given index to determine where to draw the cursor.
	 * @param {number} index The index of the character where the cursor is located.
	 * @returns {number} The x-position of the cursor at that index.
	 * @private
	 */
	getCursorX(index) {
		if (index >= this.offsetChars) {
			return this.g.CalcTextWidth(this.value.substr(this.offsetChars, index - this.offsetChars), this.font, true);
		}
		return 0;
	}

	/**
	 * Checks if the mouse is within the boundaries of the string input field.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	mouseInThis(x, y) {
		return !this.disabled && x >= this.inputX && x <= this.inputX + this.inputW && y >= this.y - this.padding && y <= this.y + this.h + this.padding;
	}

	/**
	 * Handles various keyboard inputs and performs corresponding actions on the text value.
	 * @param {number} code The character code.
	 */
	onChar(code) {
		let clearSelection = true;
		let text = String.fromCharCode(code);
		const start = this.hasSelection ? Math.min(this.cursorPos, this.selAnchor) : this.cursorPos;
		const end = this.hasSelection ?  Math.max(this.cursorPos, this.selAnchor) : this.cursorPos;

		switch (code) {
			case VK_RETURN:
				this.value = this.value.substring(0, start) + this.value.substring(end);
				if (displayCustomThemeMenu) this.updateColors();
				if (displayMetadataGridMenu) this.updateMetadata();
				this.clearFocus();
				break;
			case VK_BACK:
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
			case VK_CUT:
				if (!this.hasSelection) return;
				doc.parentWindow.clipboardData.setData('text', this.value.substring(start, end));
				// Fall through
			case VK_DELETE:
				if (this.hasSelection) {
					this.value = this.value.substring(0, start) + this.value.substring(end);
					this.cursorPos = start;
				} else {
					this.value = this.value.substring(0, start) + this.value.substring(Math.min(end + 1, this.value.length));
				}
				this.calcOffsetIndex();
				break;
			case VK_SELECT_ALL:
				this.selAnchor = 0; this.cursorPos = this.selEnd = this.value.length;
				this.calcOffsetIndex();
				clearSelection = false;
				break;
			case VK_ESCAPE: // Clears selection below
				break;
			case VK_COPY:
				if (this.hasSelection) {
					doc.parentWindow.clipboardData.setData('text', this.value.substring(start, end));
				}
				clearSelection = false;
				break;
			case VK_PASTE:
				text = doc.parentWindow.clipboardData.getData('text');
				this.value = this.value === '' ? this.value : text;
				if (displayCustomThemeMenu) this.updateColors();
				if (displayMetadataGridMenu) this.updateMetadata();
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
	 * @param {number} vkey The virtual key code.
	 */
	onKey(vkey) {
		const ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);
		switch (vkey) {
			case VK_LEFT:
			case VK_RIGHT: {
				const dir = vkey === VK_LEFT ? -1 : 1;
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
			case VK_UP:
			case VK_DOWN:
			case VK_HOME:
			case VK_END: {
				const home = vkey === VK_UP || vkey === VK_HOME;
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
			case VK_DELETE:
				this.onChar(VK_DELETE);
				break;
		}
		this.flashCursor(true);
	}

	/**
	 * Updates the state of the string input field.
	 */
	repaint() {
		window.RepaintRect(this.x - 1, this.y - this.padding - 1, this.x + this.labelW + this.inputW + this.padding * 2 + 2, this.h * this.padding * 2 + 2);
	}

	/**
	 * Returns the clamped value of `index` within the range of 0 and the length of `this.value`.
	 * @param {number} index The position within a string or array that you want to ensure is within a certain range.
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
		initCustomTheme();
		updateColorsFromConfig(this.id, this.value);
		initThemeFull = true;
		initTheme();
		this.repaint();
	}

	/**
	 * Updates the metadata grid based on the provided configuration values and repaints the grid.
	 */
	updateMetadata() {
		updateMetadataGridFromConfig(this.id, this.value, this.value2);
		initMetadataGridMenu();
		this.repaint();
	}
}


////////////////////////////////////
// * CUSTOM MENU STRING INPUT 2 * //
////////////////////////////////////
/**
 * Second string input field object of the custom menu, used in the metadata grid custom menu.
 */
class StringInput2 extends BaseControl {
	/**
	 * Creates a text input field with a label, value, and position in the custom menu.
	 * @param {string} id The unique identifier for the input field.
	 * @param {string} label The description for the input field.
	 * @param {string|number} value The stored value of the input field.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @param {number} labelWidth The width of the label area.
	 * @param {number} inputWidth The width of the input field.
	 * @extends {BaseControl}
	 * @class
	 */
	constructor(id, label, value2, x, y, labelWidth, inputWidth) {
		super(x, y, label);
		this.id = id;
		/** @private */ this.h = this.calcTextHeight('Ag', this.font);
		/** @private */ this.padding = SCALE(3);
		/** @private */ this.lineThickness = SCALE(2);
		/** @private */ this.inputX = this.x + this.h + SCALE(18);
		/** @private */ this.value2 = value2;
		/** @private */ this.labelW = labelWidth;
		/** @private */ this.inputW = inputWidth - this.padding * 2; // Subtract out padding
		/** @constant @private */ this.cursorRefreshInterval = 350; // Ms
		/** @private */ this.timerId = undefined;
		/** @private */ this.showCursor = false;
		/** @private */ this.selEnd = -1;
		/** @private */ this.selAnchor = -1;
		/** @private */ this.cursorPos = 0;
		/** @private */ this.offsetChars = 0; // Number of chars that are not visible in the string input field (scrolled to the left)
	}

	/**
	 * Checks the selection of the string input field.
	 * @returns {boolean} True or false.
	 */
	get hasSelection() {
		return this.selAnchor !== -1;
	}

	/**
	 * Gets the string input field hover state.
	 * @returns {boolean} True or false.
	 */
	get hovered() {
		return this._hovered;
	}

	/**
	 * Sets the string input field hover state.
	 * @param {boolean} value
	 */
	set hovered(value) {
		this._hovered = value;
		this.repaint();
	}

	// * METHODS * //

	/**
	 * Draws the string input field with a label and value.
	 * @param {GdiGraphics} gr
	 */
	draw(gr) {
		const margin = SCALE(20);
		const textX = this.inputX + this.padding * 4;
		const outlineColor = this.focus ? col.lowerBarArtist : this.hovered ? RGB(150, 150, 150) : RGB(120, 120, 120);

		gr.SetTextRenderingHint(TextRenderingHint.AntiAlias);
		gr.FillSolidRect(this.inputX, this.y - this.padding, this.inputW + margin, this.h + this.padding * 2, RGB(255, 255, 255));
		gr.DrawRect(this.inputX, this.y - this.padding, this.inputW + margin, this.h + this.padding * 2, this.lineThickness, outlineColor);
		gr.GdiDrawText(this.value2.substr(this.offsetChars), this.font, RGB(0, 0, 0), textX, this.y, this.inputW, this.h, StringFormat(0, 0, 4));

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
			const lightBg =
				new Color(g_pl_colors.bg).brightness + imgBrightness > 285 && (pref.styleBlend || pref.styleBlend2)
				||
				new Color(g_pl_colors.bg).brightness > 150 && !pref.styleBlend && !pref.styleBlend2;

			const textColor = lightBg ? RGB(0, 0, 0) : RGB(255, 255, 255);
			gr.FillSolidRect(start, this.y, maxWidth, this.h, HEXtoRGB(this.value2));
			gr.GdiDrawText(this.value2.substr(selStartIndex, selEndIndex - selStartIndex), this.font, textColor, start, this.y, maxWidth, this.h, StringFormat(0, 0, 4));
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
		let width = this.g.CalcTextWidth(this.value2.substr(this.offsetChars, this.cursorPos - this.offsetChars), this.font, true);
		let j = 0;
		while (width > this.inputW && j < 999) {
			j++;
			this.offsetChars++;
			width = this.g.CalcTextWidth(this.value2.substr(this.offsetChars, this.cursorPos - this.offsetChars), this.font, true);
		}
		if (j === 0) {
			while (width < this.inputW && this.offsetChars >= 0) {
				this.offsetChars--;
				width = this.g.CalcTextWidth(this.value2.substr(this.offsetChars, this.cursorPos - this.offsetChars), this.font, true);
			}
			this.offsetChars++;
		}
	}

	/**
	 * Clears the focus of the string input field.
	 */
	clearFocus() {
		clearTimeout(this.timerId);
		this.focus = false;
		this.showCursor = false;
		this.offsetChars = 0;
		this.selAnchor = -1;    // I think we want to do this?
		this.repaint();
	}

	/**
	 * Handles mouse button click events and updates the cursor position and selection.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 */
	clicked(x, y) {
		if (!this.mouseInThis(x, y)) return;
		this.focus = true;
		const oldCursor = this.cursorPos;
		this.cursorPos = this.getCursorIndex(x);
		if (utils.IsKeyPressed(VK_SHIFT)) {
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
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 */
	doubleClicked(x, y) {
		const clickPos = this.getCursorIndex(x);
		if (this.hasSelection &&
				Math.abs(this.selAnchor - this.selEnd) !== this.value2.length &&
				((clickPos >= this.selAnchor && clickPos <= this.selEnd) ||
				(clickPos <= this.selAnchor && clickPos >= this.selEnd))) {
			this.onChar(VK_SELECT_ALL);
		} else {
			this.selAnchor = Math.max(0, this.value2.substr(0, clickPos).lastIndexOf(' ') + 1);
			this.selEnd = this.value2.indexOf(' ', clickPos);
			if (this.selEnd === -1) this.selEnd = this.value2.length;
			this.cursorPos = this.selEnd;
		}
	}

	/**
	 * Flashes the mouse cursor and repaints the control.
	 * @private
	 * @param {boolean=} showImmediate
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
	 * @param {number} x The x-coordinate.
	 * @returns {number} The index of the cursor position.
	 * @private
	 */
	getCursorIndex(x) {
		const inputX = x - this.inputX; // X-position inside control
		let pos = this.padding;
		for (let i = this.offsetChars; i < this.value2.length; i++) {
			const charWidth = this.g.CalcTextWidth(this.value2.substr(i, 1), this.font, true);
			if (Math.round(pos + (charWidth / 2)) >= inputX) {
				return i;
			}
			pos += charWidth;
		}
		return this.value2.length;
	}

	/**
	 * Calculates the x-coordinate of the cursor position based on the given index to determine where to draw the cursor.
	 * @param {number} index The index of the character where the cursor is located.
	 * @returns {number} The x-position of the cursor at that index.
	 * @private
	 */
	getCursorX(index) {
		if (index >= this.offsetChars) {
			return this.g.CalcTextWidth(this.value2.substr(this.offsetChars, index - this.offsetChars), this.font, true);
		}
		return 0;
	}

	/**
	 * Checks if the mouse is within the boundaries of the string input field.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	mouseInThis(x, y) {
		return !this.disabled && x >= this.inputX && x <= this.inputX + this.inputW && y >= this.y - this.padding && y <= this.y + this.h + this.padding;
	}

	/**
	 * Handles various keyboard inputs and performs corresponding actions on the text value.
	 * @param {number} code The character code.
	 */
	onChar(code) {
		let clearSelection = true;
		let text = String.fromCharCode(code);
		const start = this.hasSelection ? Math.min(this.cursorPos, this.selAnchor) : this.cursorPos;
		const end = this.hasSelection ?  Math.max(this.cursorPos, this.selAnchor) : this.cursorPos;

		switch (code) {
			case VK_RETURN:
				this.value2 = this.value2.substring(0, start) + this.value2.substring(end);
				this.updateMetadata();
				this.clearFocus();
				break;
			case VK_BACK:
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
			case VK_CUT:
				if (!this.hasSelection) return;
				doc.parentWindow.clipboardData.setData('text', this.value2.substring(start, end));
				// Fall through
			case VK_DELETE:
				if (this.hasSelection) {
					this.value2 = this.value2.substring(0, start) + this.value2.substring(end);
					this.cursorPos = start;
				} else {
					this.value2 = this.value2.substring(0, start) + this.value2.substring(Math.min(end + 1, this.value2.length));
				}
				this.calcOffsetIndex();
				break;
			case VK_SELECT_ALL:
				this.selAnchor = 0; this.cursorPos = this.selEnd = this.value2.length;
				this.calcOffsetIndex();
				clearSelection = false;
				break;
			case VK_ESCAPE: // Clears selection below
				break;
			case VK_COPY:
				if (this.hasSelection) {
					doc.parentWindow.clipboardData.setData('text', this.value2.substring(start, end));
				}
				clearSelection = false;
				break;
			case VK_PASTE:
				text = doc.parentWindow.clipboardData.getData('text');
				this.value2 = this.value2 === '' ? this.value2 : text;
				if (displayMetadataGridMenu) this.updateMetadata();
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
	 * @param {number} vkey The virtual key code.
	 */
	onKey(vkey) {
		const ShiftKeyPressed = utils.IsKeyPressed(VK_SHIFT);
		switch (vkey) {
			case VK_LEFT:
			case VK_RIGHT: {
				const dir = vkey === VK_LEFT ? -1 : 1;
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
			case VK_UP:
			case VK_DOWN:
			case VK_HOME:
			case VK_END: {
				const home = vkey === VK_UP || vkey === VK_HOME;
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
			case VK_DELETE:
				this.onChar(VK_DELETE);
				break;
		}
		this.flashCursor(true);
	}

	/**
	 * Updates the state of the string input field.
	 */
	repaint() {
		window.RepaintRect(this.x - 1, this.y - this.padding - 1, this.x + this.labelW + this.inputW + this.padding * 2 + 2, this.h * this.padding * 2 + 2);
	}

	/**
	 * Returns the clamped value of `index` within the range of 0 and the length of `this.value`.
	 * @param {number} index The position within a string or array that you want to ensure is within a certain range.
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
		updateMetadataGridFromConfig(this.id, this.value, this.value2);
		initMetadataGridMenu();
		this.repaint();
	}
}


//////////////////////////////////
// * CUSTOM MENU COLOR PICKER * //
//////////////////////////////////
/**
 * The color picker object of the custom menu, opens utils.ColourPicker.
 */
class ColorPicker extends BaseControl {
	/**
	 * @param {string} id The id for each individual unique color picker.
	 * @param {number} value The value of the color will be passed to the color picker.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @extends {BaseControl}
	 * @class
	 */
	constructor(id, value, x, y) {
		super(x, y);
		this.id = id;
		this.value = value;
		this.colorPickerColor = value;
		this.x = x;
		this.y = y - SCALE(1);
		this.h = this.calcTextHeight('Ag', this.font) + SCALE(2);
		this.w = this.h;
	}

	// * METHODS * //

	/**
	 * Draws the color picker left of the string input field.
	 * @param {GdiGraphics} gr
	 */
	draw(gr) {
		const lineCol = this.focus ? col.lowerBarArtist : this.hovered ? RGB(150, 150, 150) : RGB(120, 120, 120);
		gr.FillSolidRect(this.x, this.y, this.w, this.h, HEXtoRGB(this.value));
		gr.DrawRect(this.x, this.y, this.w, this.h, SCALE(2), RGB(255, 255, 255));
		gr.DrawRect(this.x - SCALE(2), this.y - SCALE(2), this.w + SCALE(4), this.h + SCALE(4), SCALE(2), lineCol);
	}

	/**
	 * Updates the color picker color based on the value passed as an argument.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 */
	clicked(x, y) {
		this.colorPickerColor = utils.ColourPicker(0, HEXtoRGB(this.value));
		this.updateColors();
	}

	/**
	 * Checks if the mouse is within the boundaries of the color picker.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
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
		initCustomTheme();
		this.value = RGBFtoHEX(this.colorPickerColor);
		updateColorsFromConfig(this.id, this.value);
		initThemeFull = true;
		initTheme();
		this.repaint();
	}
}


//////////////////////////////////
// * CUSTOM MENU COLOR MARKER * //
//////////////////////////////////
/**
 * The color marker of the custom menu drawn as a lightbulb icon, displays UI elements in red color.
 */
class ColorMarker extends BaseControl {
	/**
	 * @param {string} id The id for each individual unique color marker.
	 * @param value The value of the color will be passed to the color marker.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @extends {BaseControl}
	 * @class
	 */
	constructor(id, value, x, y) {
		super(x, y);
		this.id = id;
		this.value = value;
		this.fontAwesome = Font(fontAwesome, this.popupFontSize + 4, 0);
		this.x = x;
		this.y = y - SCALE(1);
		this.h = this.calcTextHeight('Ag', this.font) + SCALE(2);
		this.w = this.h;
	}

	// * METHODS * //

	/**
	 * Draws the color marker background field.
	 * @param {GdiGraphics} gr
	 */
	draw(gr) {
		const lineCol = this.focus ? col.lowerBarArtist : this.hovered ? RGB(150, 150, 150) : RGB(120, 120, 120);
		gr.DrawRect(this.x - 2, this.y - 2, this.w + 4, this.h + 4, SCALE(1), lineCol);
		gr.DrawString('\uF0EB', this.fontAwesome, RGB(0, 0, 0), this.x, this.y, this.w, this.h, StringFormat(1, 1, 4));
	}

	/**
	 * Displays the UI element as an indicator with a red blinking color.
	 * @param {string} id The id of the string input field.
	 * @param {number} value The value of the string input field.
	 */
	colorMarker(id, value) {
		const showSelColor = () => {
			setTimeout(() => {
				updateColorsFromConfig(id, RGBtoHEX(255, 0, 0));
				initThemeFull = true;
				initTheme();
			}, 0);
			setTimeout(() => {
				updateColorsFromConfig(id, value);
				initThemeFull = true;
				initTheme();
			}, 200);
		}
		setTimeout(() => { showSelColor(); }, 100);
		setTimeout(() => { showSelColor(); }, 400);
	}

	/**
	 * Handles mouse click events and activates the color marker.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 */
	clicked(x, y) {
		this.colorMarker(this.id, this.value);
	}

	/**
	 * Checks if the mouse is within the boundaries of the color marker.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	mouseInThis(x, y) {
		return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
	}
}


//////////////////////////
// * CUSTOM MENU INFO * //
//////////////////////////
/**
 * The info page of the custom menu.
 */
class Info extends BaseControl {
	/**
	 * Creates a clickable object with specified dimensions, text, and link.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @param {number} w The width.
	 * @param {number} h The height.
	 * @param {string} text The text content of the button.
	 * @param {string} link The URL that the button should navigate to when clicked.
	 * @extends {BaseControl}
	 * @class
	 */
	constructor(x, y, w, h, text, link) {
		super(x, y, w, h);
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.text = text;
		this.link = link;
	}

	// * METHODS * //

	/**
	 * Draws the info page in the custom menu.
	 * @param {GdiGraphics} gr
	 */
	draw(gr) {
		const lightBg =
			new Color(g_pl_colors.bg).brightness + imgBrightness > 285 && (pref.styleBlend || pref.styleBlend2)
			||
			new Color(g_pl_colors.bg).brightness > 150 && !pref.styleBlend && !pref.styleBlend2;

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
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 */
	clicked(x, y) {
		if (this.link) {
			RunCmd(this.link);
		}
		window.Repaint();
	}

	/**
	 * Handles mouse double click events.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 */
	doubleClicked(x, y) {
		this.clicked();
	}

	/**
	 * Checks if the mouse is within the boundaries info page.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @returns {boolean} True or false.
	 */
	mouseInThis(x, y) {
		return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
	}
}


////////////////////////////////////
// * CUSTOM MENU BUTTON HANDLER * //
////////////////////////////////////
/**
 * Displays and handles the color page of the panel in the custom menu.
 * @param {string} label The current label of the menu item.
 * @param {string} labelArray The panel color page to display.
 * @param {number} activeIndex The index of the currently selected item in the labelArray.
 */
function customMenuButtonHandler(label, labelArray, activeIndex) {
	customThemeMenuCall = true;

	const customThemeMenu = {
		Main_Bg:         () => { displayPanel('details'); initCustomThemeMenu(false, 'main_bg'); },
		Main_Bar:        () => { displayPanel('details'); initCustomThemeMenu(false, 'main_bar'); },
		Main_Bar2:       () => { displayPanel('details'); initCustomThemeMenu(false, 'main_bar2'); },
		Main_Bar3:       () => { displayPanel('details'); initCustomThemeMenu(false, 'main_bar3'); },
		Main_Text:       () => { displayPanel('details'); initCustomThemeMenu(false, 'main_text'); },
		Main_Btns:       () => { displayPanel('details'); initCustomThemeMenu(false, 'main_btns'); },
		Main_Btns2:      () => { displayPanel('details'); initCustomThemeMenu(false, 'main_btns2'); },
		Main_Style:      () => { displayPanel('details'); initCustomThemeMenu(false, 'main_style'); },

		Playlist_Bg:     () => { displayPanel('playlist'); initCustomThemeMenu('pl_bg'); },
		Playlist_Text:   () => { displayPanel('playlist'); initCustomThemeMenu('pl_text1'); },
		Playlist_Text2:  () => { displayPanel('playlist'); initCustomThemeMenu('pl_text2'); },
		Playlist_Misc:   () => { displayPanel('playlist'); initCustomThemeMenu('pl_misc'); },
		Playlist_Btns:   () => { displayPanel('playlist'); initCustomThemeMenu('pl_btns'); },

		Library_Bg:      () => { displayPanel('library'); initCustomThemeMenu(false, false, 'lib_bg'); },
		Library_Text:    () => { displayPanel('library'); initCustomThemeMenu(false, false, 'lib_text'); },
		Library_Node:    () => { displayPanel('library'); initCustomThemeMenu(false, false, 'lib_node'); },
		Library_Btns:    () => { displayPanel('library'); initCustomThemeMenu(false, false, 'lib_btns'); },

		Biography_Bg:    () => { displayPanel('biography'); initCustomThemeMenu(false, false, false, 'bio_bg'); },
		Biography_Text:  () => { displayPanel('biography'); initCustomThemeMenu(false, false, false, 'bio_text'); },
		Biography_Misc:  () => { displayPanel('biography'); initCustomThemeMenu(false, false, false, 'bio_misc'); },
		Biography_Btns:  () => { displayPanel('biography'); initCustomThemeMenu(false, false, false, 'bio_btns'); },

		Options_Info:    () => { initCustomThemeMenu(false, false, false, false, true); window.Repaint(); },
		Options_Theme01: () => { pref.theme = 'custom01'; initCustomTheme(); initTheme(); initCustomThemeMenu('pl_bg'); },
		Options_Theme02: () => { pref.theme = 'custom02'; initCustomTheme(); initTheme(); initCustomThemeMenu('pl_bg'); },
		Options_Theme03: () => { pref.theme = 'custom03'; initCustomTheme(); initTheme(); initCustomThemeMenu('pl_bg'); },
		Options_Theme04: () => { pref.theme = 'custom04'; initCustomTheme(); initTheme(); initCustomThemeMenu('pl_bg'); },
		Options_Theme05: () => { pref.theme = 'custom05'; initCustomTheme(); initTheme(); initCustomThemeMenu('pl_bg'); },
		Options_Theme06: () => { pref.theme = 'custom06'; initCustomTheme(); initTheme(); initCustomThemeMenu('pl_bg'); },
		Options_Theme07: () => { pref.theme = 'custom07'; initCustomTheme(); initTheme(); initCustomThemeMenu('pl_bg'); },
		Options_Theme08: () => { pref.theme = 'custom08'; initCustomTheme(); initTheme(); initCustomThemeMenu('pl_bg'); },
		Options_Theme09: () => { pref.theme = 'custom09'; initCustomTheme(); initTheme(); initCustomThemeMenu('pl_bg'); },
		Options_Theme10: () => { pref.theme = 'custom10'; initCustomTheme(); initTheme(); initCustomThemeMenu('pl_bg'); },
		Options_Rename:  () => { inputBox('renameCustomTheme'); },
		Options_Reset:   () => { initCustomTheme(); resetCustomColors(); initTheme(); initCustomThemeMenu('pl_bg'); }
	};

	const metadataGridMenu = {
		Page1: () => { activeControl.isSelectUp = false; initMetadataGridMenu(1); },
		Page2: () => { activeControl.isSelectUp = false; initMetadataGridMenu(2); },
		Page3: () => { activeControl.isSelectUp = false; initMetadataGridMenu(3); },
		Page4: () => { activeControl.isSelectUp = false; initMetadataGridMenu(4); },
		Info:  () => { initMetadataGridMenu(false, true); window.Repaint(); },
		Reset: () => { resetMetadataGrid(); initMetadataGridMenu(1); }
	}

	const closeBtn = {
		Close: () => {
			activeControl.isSelectUp = false;
			if (displayCustomThemeMenu) displayPanel('playlist');
			displayCustomThemeMenu = false;
			displayMetadataGridMenu = false;
		}
	}

	const index    = labelArray[activeIndex];
	const topIndex = label.replace(/\s/g, '');
	const subIndex = `${label}_${index}`.replace(/\s/g, '');

	// * Button handler
	if (displayCustomThemeMenu && customThemeMenu[subIndex]) {
		customThemeMenu[subIndex]();
	}
	else if (displayMetadataGridMenu && (metadataGridMenu[topIndex] || metadataGridMenu[index])) {
		if (metadataGridMenu[index]) {
			metadataGridMenu[index]();
		} else {
			metadataGridMenu[topIndex]();
		}
	}
	else if (activeControl.closeBtn) {
		closeBtn.Close();
	}
}


///////////////////////////
// * CUSTOM THEME MENU * //
///////////////////////////
/**
 * Draws the custom theme menu.
 * @param {GdiGraphics} gr
 */
function drawCustomThemeMenu(gr) {
	if (!displayCustomThemeMenu || pref.layout !== 'default') return;

	const x = displayBiography || pref.displayLyrics ? ww * 0.5 : displayDetails ? albumArtSize.x : 0;
	const y = geo.topMenuHeight;
	const width = !fb.IsPlaying && !displayPlaylist && !displayLibrary && !displayBiography || pref.displayLyrics && !albumArt ? ww : displayDetails ? albumArtSize.w : ww * 0.5;
	const height = wh - geo.topMenuHeight - geo.lowerBarHeight;

	gr.SetSmoothingMode(SmoothingMode.None);
	gr.FillSolidRect(x, y, width, height, g_pl_colors.bg);
	controlList.forEach(c => c.draw(gr));

	if (activeControl && activeControl instanceof DropDownMenu && activeControl.isSelectUp) {
		activeControl.draw(gr);
	}
}


/**
 * Initializes the custom theme menu with panel sections and options for customizing the theme colors.
 * @param {string} playlist_section The playlist color page to be opened.
 * @param {string} main_section The main color page to be opened.
 * @param {string} library_section The library color page to be opened.
 * @param {string} biography_section The biography color page to be opened.
 * @param {boolean} info The custom theme menu info page to be opened.
 */
function initCustomThemeMenu(playlist_section, main_section, library_section, biography_section, info) {
	if (pref.libraryLayout   === 'full') { pref.libraryLayout   = 'normal'; setLibrarySize(); }
	if (pref.biographyLayout === 'full') { pref.biographyLayout = 'normal'; setBiographySize(); }
	if (pref.lyricsLayout    === 'full') { pref.lyricsLayout    = 'normal'; resizeArtwork(true); }

	controlList = [];

	const margin = SCALE(40);
	const baseX = displayBiography || pref.displayLyrics ? ww * 0.5 + margin : !displayPlaylist && !displayLibrary && !displayBiography ? noAlbumArtStub ? ww * 0.3 : albumArtSize.x + margin : margin;
	let x = baseX;
	let y = geo.topMenuHeight + margin * 0.75;
	const w = ww * 0.5;
	const h = wh - geo.topMenuHeight - geo.lowerBarHeight;

	const mainSection      = ['main_bg', 'main_bar', 'main_bar2', 'main_bar3', 'main_text', 'main_btns', 'main_btns2', 'main_style'].includes(main_section);
	const playlistSection  = ['pl_bg',   'pl_text1', 'pl_text2',  'pl_misc', 'pl_btns'].includes(playlist_section);
	const librarySection   = ['lib_bg',  'lib_text', 'lib_node',  'lib_btns'].includes(library_section);
	const biographySection = ['bio_bg',  'bio_text', 'bio_misc',  'bio_btns'].includes(biography_section);

	const menu = new DropDownMenu(x, y, 'Main', ['Bg', 'Bar', 'Bar 2', 'Bar 3', 'Text', 'Btns', 'Btns 2', 'Style'], 0);
	controlList.push(menu);
	x += controlList[controlList.length - 1].w + 1; controlList.push(new DropDownMenu(x, y, 'Playlist',  ['Bg', 'Text', 'Text 2', 'Misc', 'Btns'], 0));
	x += controlList[controlList.length - 1].w + 1; controlList.push(new DropDownMenu(x, y, 'Library',   ['Bg', 'Text', 'Node', 'Btns'], 0));
	x += controlList[controlList.length - 1].w + 1; controlList.push(new DropDownMenu(x, y, 'Biography', ['Bg', 'Text', 'Misc', 'Btns'], 0));
	x += controlList[controlList.length - 1].w + 1; controlList.push(new DropDownMenu(x, y, 'Options',   ['Info', '', 'Theme 01', 'Theme 02', 'Theme 03', 'Theme 04', 'Theme 05', 'Theme 06', 'Theme 07', 'Theme 08', 'Theme 09', 'Theme 10', '', 'Rename', 'Reset'], 0));
	x += controlList[controlList.length - 1].w + 1; controlList.push(new DropDownMenu(x, y, '\u2715',    ['']));
	x = baseX;
	y += menu.h + margin * 0.75;

	switch (true) {
		case playlistSection:  customPlaylistColors(x, y, w, h, playlist_section); break;
		case mainSection:      customMainColors(x, y, w, h, main_section); break;
		case librarySection:   customLibraryColors(x, y, w, h, library_section); break;
		case biographySection: customBiographyColors(x, y, w, h, biography_section); break;
		case info:             customThemeInfo(x, y, w, h); break;
	}
}


/**
 * Reinitializes the custom theme menu.
 */
function reinitCustomThemeMenu() {
	if (!displayCustomThemeMenu) return;
	if (displayPlaylist)    initCustomThemeMenu('pl_bg');
	if (displayDetails)     initCustomThemeMenu(false, 'main_bg');
	if (displayLibrary)     initCustomThemeMenu(false, false, 'lib_bg');
	if (displayBiography)   initCustomThemeMenu(false, false, false, 'bio_bg');
	if (pref.displayLyrics) initCustomThemeMenu(false, 'main_text');
}


/**
 * The Main colors in the custom theme menu.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} w The width.
 * @param {number} h The height.
 * @param {string} main_section The main color page to be opened.
 */
function customMainColors(x, y, w, h, main_section) {
	const popupFontSize = pref[`popupFontSize_${pref.layout}`];
	const margin = SCALE(20);
	const labelW = SCALE(300) + popupFontSize;
	const inputW = SCALE(80)  + popupFontSize;
	const markerX = x + margin + inputW + (popupFontSize * (RES_4K ? 0.25 : 0.5)) - SCALE(2);

	switch (main_section) {
		case 'main_bg':
			{
				const mainColors = new StringInput('main_bg_01', 'col.bg', customColor.col_bg, x, y, labelW, inputW);
				controlList.push(mainColors);
				controlList.push(new ColorPicker('main_bg_01', customColor.col_bg, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bg_01', customColor.col_bg, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bg_02', 'col.popupBg', customColor.col_popupBg, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bg_02', customColor.col_popupBg, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bg_02', customColor.col_popupBg, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bg_03', 'col.detailsBg', customColor.col_detailsBg, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bg_03', customColor.col_detailsBg, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bg_03', customColor.col_detailsBg, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bg_04', 'col.shadow', customColor.col_shadow, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bg_04', customColor.col_shadow, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bg_04', customColor.col_shadow, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bg_05', 'col.discArtShadow', customColor.col_discArtShadow, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bg_05', customColor.col_discArtShadow, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bg_05', customColor.col_discArtShadow, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bg_06', 'col.noAlbumArtStub', customColor.col_noAlbumArtStub, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bg_06', customColor.col_noAlbumArtStub, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bg_06', customColor.col_noAlbumArtStub, markerX, y, () => {}));
			}
			break;
		case 'main_bar':
			{
				const mainColors = new StringInput('main_bar_01', 'col.timelineAdded', customColor.col_timelineAdded, x, y, labelW, inputW);
				controlList.push(mainColors);
				controlList.push(new ColorPicker('main_bar_01', customColor.col_timelineAdded, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_01', customColor.col_timelineAdded, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bar_02', 'col.timelinePlayed', customColor.col_timelinePlayed, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bar_02', customColor.col_timelinePlayed, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_02', customColor.col_timelinePlayed, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bar_03', 'col.timelineUnplayed', customColor.col_timelineUnplayed, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bar_03', customColor.col_timelineUnplayed, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_03', customColor.col_timelineUnplayed, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bar_04', 'col.timelineFrame', customColor.col_timelineFrame, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bar_04', customColor.col_timelineFrame, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_04', customColor.col_timelineFrame, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bar_05', 'col.progressBar', customColor.col_progressBar, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bar_05', customColor.col_progressBar, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_05', customColor.col_progressBar, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bar_06', 'col.progressBarStreaming', customColor.col_progressBarStreaming, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bar_06', customColor.col_progressBarStreaming, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_06', customColor.col_progressBarStreaming, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bar_07', 'col.progressBarFrame', customColor.col_progressBarFrame, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bar_07', customColor.col_progressBarFrame, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_07', customColor.col_progressBarFrame, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bar_08', 'col.progressBarFill', customColor.col_progressBarFill, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bar_08', customColor.col_progressBarFill, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_08', customColor.col_progressBarFill, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bar_09', 'col.volumeBar', customColor.col_volumeBar, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bar_09', customColor.col_volumeBar, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_09', customColor.col_volumeBar, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bar_10', 'col.volumeBarFrame', customColor.col_volumeBarFrame, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bar_10', customColor.col_volumeBarFrame, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_10', customColor.col_volumeBarFrame, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bar_11', 'col.volumeBarFill', customColor.col_volumeBarFill, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bar_11', customColor.col_volumeBarFill, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_11', customColor.col_volumeBarFill, markerX, y, () => {}));
			}
			break;
		case 'main_bar2':
			{
				const mainColors = new StringInput('main_bar_12', 'col.peakmeterBarProg', customColor.col_peakmeterBarProg, x, y, labelW, inputW);
				controlList.push(mainColors);
				controlList.push(new ColorPicker('main_bar_12', customColor.col_peakmeterBarProg, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_12', customColor.col_peakmeterBarProg, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bar_13', 'col.peakmeterBarProgFill', customColor.col_peakmeterBarProgFill, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bar_13', customColor.col_peakmeterBarProgFill, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_13', customColor.col_peakmeterBarProgFill, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bar_14', 'col.peakmeterBarFillTop', customColor.col_peakmeterBarFillTop, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bar_14', customColor.col_peakmeterBarFillTop, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_14', customColor.col_peakmeterBarFillTop, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bar_15', 'col.peakmeterBarFillMiddle', customColor.col_peakmeterBarFillMiddle, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bar_15', customColor.col_peakmeterBarFillMiddle, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_15', customColor.col_peakmeterBarFillMiddle, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bar_16', 'col.peakmeterBarFillBack', customColor.col_peakmeterBarFillBack, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bar_16', customColor.col_peakmeterBarFillBack, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_16', customColor.col_peakmeterBarFillBack, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bar_17', 'col.peakmeterBarVertProgFill', customColor.col_peakmeterBarVertProgFill, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bar_17', customColor.col_peakmeterBarVertProgFill, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_17', customColor.col_peakmeterBarVertProgFill, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bar_18', 'col.peakmeterBarVertFill', customColor.col_peakmeterBarVertFill, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bar_18', customColor.col_peakmeterBarVertFill, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_18', customColor.col_peakmeterBarVertFill, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bar_19', 'col.peakmeterBarVertFillPeaks', customColor.col_peakmeterBarVertFillPeaks, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bar_19', customColor.col_peakmeterBarVertFillPeaks, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_19', customColor.col_peakmeterBarVertFillPeaks, markerX, y, () => {}));
			}
			break;
		case 'main_bar3':
			{
				const mainColors = new StringInput('main_bar_20', 'col.waveformBarFillFront', customColor.col_waveformBarFillFront, x, y, labelW, inputW);
				controlList.push(mainColors);
				controlList.push(new ColorPicker('main_bar_20', customColor.col_waveformBarFillFront, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_20', customColor.col_waveformBarFillFront, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bar_21', 'col.waveformBarFillBack', customColor.col_waveformBarFillBack, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bar_21', customColor.col_waveformBarFillBack, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_21', customColor.col_waveformBarFillBack, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bar_22', 'col.waveformBarFillPreFront', customColor.col_waveformBarFillPreFront, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bar_22', customColor.col_waveformBarFillPreFront, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_22', customColor.col_waveformBarFillPreFront, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bar_23', 'col.waveformBarFillPreBack', customColor.col_waveformBarFillPreBack, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bar_23', customColor.col_waveformBarFillPreBack, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_23', customColor.col_waveformBarFillPreBack, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_bar_24', 'col.waveformBarIndicator', customColor.col_waveformBarIndicator, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_bar_24', customColor.col_waveformBarIndicator, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_bar_24', customColor.col_waveformBarIndicator, markerX, y, () => {}));
			}
			break;
		case 'main_text':
			{
				const mainColors = new StringInput('main_text_01', 'col.lowerBarArtist', customColor.col_lowerBarArtist, x, y, labelW, inputW);
				controlList.push(mainColors);
				controlList.push(new ColorPicker('main_text_01', customColor.col_lowerBarArtist, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_text_01', customColor.col_lowerBarArtist, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_text_02', 'col.lowerBarTitle', customColor.col_lowerBarTitle, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_text_02', customColor.col_lowerBarTitle, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_text_02', customColor.col_lowerBarTitle, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_text_03', 'col.lowerBarTime', customColor.col_lowerBarTime, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_text_03', customColor.col_lowerBarTime, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_text_03', customColor.col_lowerBarTime, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_text_04', 'col.lowerBarLength', customColor.col_lowerBarLength, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_text_04', customColor.col_lowerBarLength, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_text_04', customColor.col_lowerBarLength, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_text_05', 'col.detailsText', customColor.col_detailsText, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_text_05', customColor.col_detailsText, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_text_05', customColor.col_detailsText, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_text_06', 'col.detailsRating', customColor.col_detailsRating, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_text_06', customColor.col_detailsRating, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_text_06', customColor.col_detailsRating, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_text_08', 'col.popupText', customColor.col_popupText, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_text_08', customColor.col_popupText, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_text_08', customColor.col_popupText, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_text_09', 'col.lyricsNormal', customColor.col_lyricsNormal, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_text_09', customColor.col_lyricsNormal, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_text_09', customColor.col_lyricsNormal, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_text_10', 'col.lyricsHighlight', customColor.col_lyricsHighlight, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_text_10', customColor.col_lyricsHighlight, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_text_10', customColor.col_lyricsHighlight, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_text_11', 'col.lyricsShadow', customColor.col_lyricsShadow, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_text_11', customColor.col_lyricsShadow, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_text_11', customColor.col_lyricsShadow, markerX, y, () => {}));
			}
			break;
		case 'main_btns':
			{
				const mainColors = new StringInput('main_btns_01', 'col.menuBgColor', customColor.col_menuBgColor, x, y, labelW, inputW);
				controlList.push(mainColors);
				controlList.push(new ColorPicker('main_btns_01', customColor.col_menuBgColor, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_btns_01', customColor.col_menuBgColor, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_btns_02', 'col.menuStyleBg', customColor.col_menuStyleBg, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_btns_02', customColor.col_menuStyleBg, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_btns_02', customColor.col_menuStyleBg, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_btns_03', 'col.menuRectStyleEmbossTop', customColor.col_menuRectStyleEmbossTop, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_btns_03', customColor.col_menuRectStyleEmbossTop, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_btns_03', customColor.col_menuRectStyleEmbossTop, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_btns_04', 'col.menuRectStyleEmbossBottom', customColor.col_menuRectStyleEmbossBottom, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_btns_04', customColor.col_menuRectStyleEmbossBottom, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_btns_04', customColor.col_menuRectStyleEmbossBottom, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_btns_05', 'col.menuRectNormal', customColor.col_menuRectNormal, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_btns_05', customColor.col_menuRectNormal, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_btns_05', customColor.col_menuRectNormal, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_btns_06', 'col.menuRectHovered', customColor.col_menuRectHovered, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_btns_06', customColor.col_menuRectHovered, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_btns_06', customColor.col_menuRectHovered, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_btns_07', 'col.menuRectDown', customColor.col_menuRectDown, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_btns_07', customColor.col_menuRectDown, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_btns_07', customColor.col_menuRectDown, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_btns_08', 'col.menuTextNormal', customColor.col_menuTextNormal, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_btns_08', customColor.col_menuTextNormal, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_btns_08', customColor.col_menuTextNormal, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_btns_09', 'col.menuTextHovered', customColor.col_menuTextHovered, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_btns_09', customColor.col_menuTextHovered, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_btns_09', customColor.col_menuTextHovered, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_btns_10', 'col.menuTextDown', customColor.col_menuTextDown, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_btns_10', customColor.col_menuTextDown, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_btns_10', customColor.col_menuTextDown, markerX, y, () => {}));
			}
			break;
		case 'main_btns2':
			{
				const mainColors = new StringInput('main_btns_11', 'col.transportEllipseBg', customColor.col_transportEllipseBg, x, y, labelW, inputW);
				controlList.push(mainColors);
				controlList.push(new ColorPicker('main_btns_11', customColor.col_transportEllipseBg, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_btns_11', customColor.col_transportEllipseBg, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_btns_12', 'col.transportEllipseNormal', customColor.col_transportEllipseNormal, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_btns_12', customColor.col_transportEllipseNormal, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_btns_12', customColor.col_transportEllipseNormal, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_btns_13', 'col.transportEllipseHovered', customColor.col_transportEllipseHovered, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_btns_13', customColor.col_transportEllipseHovered, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_btns_13', customColor.col_transportEllipseHovered, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_btns_14', 'col.transportEllipseDown', customColor.col_transportEllipseDown, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_btns_14', customColor.col_transportEllipseDown, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_btns_14', customColor.col_transportEllipseDown, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_btns_15', 'col.transportStyleBg', customColor.col_transportStyleBg, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_btns_15', customColor.col_transportStyleBg, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_btns_15', customColor.col_transportStyleBg, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_btns_16', 'col.transportStyleTop', customColor.col_transportStyleTop, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_btns_16', customColor.col_transportStyleTop, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_btns_16', customColor.col_transportStyleTop, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_btns_17', 'col.transportStyleBottom', customColor.col_transportStyleBottom, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_btns_17', customColor.col_transportStyleBottom, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_btns_17', customColor.col_transportStyleBottom, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_btns_18', 'col.transportIconNormal', customColor.col_transportIconNormal, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_btns_18', customColor.col_transportIconNormal, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_btns_18', customColor.col_transportIconNormal, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_btns_19', 'col.transportIconHovered', customColor.col_transportIconHovered, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_btns_19', customColor.col_transportIconHovered, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_btns_19', customColor.col_transportIconHovered, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_btns_20', 'col.transportIconDown', customColor.col_transportIconDown, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_btns_20', customColor.col_transportIconDown, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_btns_20', customColor.col_transportIconDown, markerX, y, () => {}));
			}
			break;
		case 'main_style':
			{
				const mainColors = new StringInput('main_style_01', 'col.styleBevel', customColor.col_styleBevel, x, y, labelW, inputW);
				controlList.push(mainColors);
				controlList.push(new ColorPicker('main_style_01', customColor.col_styleBevel, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_style_01', customColor.col_styleBevel, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_style_02', 'col.styleGradient', customColor.col_styleGradient, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_style_02', customColor.col_styleGradient, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_style_02', customColor.col_styleGradient, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_style_03', 'col.styleGradient2', customColor.col_styleGradient2, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_style_03', customColor.col_styleGradient2, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_style_03', customColor.col_styleGradient2, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_style_04', 'col.styleProgressBar', customColor.col_styleProgressBar, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_style_04', customColor.col_styleProgressBar, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_style_04', customColor.col_styleProgressBar, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_style_05', 'col.styleProgressBarLineTop', customColor.col_styleProgressBarLineTop, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_style_05', customColor.col_styleProgressBarLineTop, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_style_05', customColor.col_styleProgressBarLineTop, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_style_06', 'col.styleProgressBarLineBottom', customColor.col_styleProgressBarLineBottom, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_style_06', customColor.col_styleProgressBarLineBottom, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_style_06', customColor.col_styleProgressBarLineBottom, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_style_07', 'col.styleProgressBarFill', customColor.col_styleProgressBarFill, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_style_07', customColor.col_styleProgressBarFill, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_style_07', customColor.col_styleProgressBarFill, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_style_08', 'col.styleVolumeBar', customColor.col_styleVolumeBar, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_style_08', customColor.col_styleVolumeBar, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_style_08', customColor.col_styleVolumeBar, markerX, y, () => {}));
				y += mainColors.h + margin;
				controlList.push(new StringInput('main_style_09', 'col.styleVolumeBarFill', customColor.col_styleVolumeBarFill, x, y, labelW, inputW));
				controlList.push(new ColorPicker('main_style_09', customColor.col_styleVolumeBarFill, x + 2, y, () => {}));
				controlList.push(new ColorMarker('main_style_09', customColor.col_styleVolumeBarFill, markerX, y, () => {}));
			}
			break;
	}
}


/**
 * The Playlist colors in the custom theme menu.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} w The width.
 * @param {number} h The height.
 * @param {string} playlist_section The playlist color page to be opened.
 */
function customPlaylistColors(x, y, w, h, playlist_section) {
	const popupFontSize = pref[`popupFontSize_${pref.layout}`];
	const margin = SCALE(20);
	const labelW = SCALE(300) + popupFontSize;
	const inputW = SCALE(80)  + popupFontSize;
	const markerX = x + margin + inputW + (popupFontSize * (RES_4K ? 0.25 : 0.5)) - SCALE(2);

	switch (playlist_section) {
		case 'pl_bg':
			{
				const plColors = new StringInput('pl_bg_01', 'g_pl_colors.bg', customColor.g_pl_colors_bg, x, y, labelW, inputW);
				controlList.push(plColors);
				controlList.push(new ColorPicker('pl_bg_01', customColor.g_pl_colors_bg, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_bg_01', customColor.g_pl_colors_bg, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_bg_02', 'g_pl_colors.header_nowplaying_bg', customColor.g_pl_colors_header_nowplaying_bg, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_bg_02', customColor.g_pl_colors_header_nowplaying_bg, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_bg_02', customColor.g_pl_colors_header_nowplaying_bg, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_bg_03', 'g_pl_colors.header_sideMarker', customColor.g_pl_colors_header_sideMarker, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_bg_03', customColor.g_pl_colors_header_sideMarker, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_bg_03', customColor.g_pl_colors_header_sideMarker, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_bg_04', 'g_pl_colors.row_nowplaying_bg', customColor.g_pl_colors_row_nowplaying_bg, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_bg_04', customColor.g_pl_colors_row_nowplaying_bg, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_bg_04', customColor.g_pl_colors_row_nowplaying_bg, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_bg_05', 'g_pl_colors.row_stripes_bg', customColor.g_pl_colors_row_stripes_bg, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_bg_05', customColor.g_pl_colors_row_stripes_bg, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_bg_05', customColor.g_pl_colors_row_stripes_bg, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_bg_06', 'g_pl_colors.row_sideMarker', customColor.g_pl_colors_row_sideMarker, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_bg_06', customColor.g_pl_colors_row_sideMarker, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_bg_06', customColor.g_pl_colors_row_sideMarker, markerX, y, () => {}));
			}
			break;
		case 'pl_text1':
			{
				const plColors = new StringInput('pl_text_01', 'g_pl_colors.plman_text_normal', customColor.g_pl_colors_plman_text_normal, x, y, labelW, inputW);
				controlList.push(plColors);
				controlList.push(new ColorPicker('pl_text_01', customColor.g_pl_colors_plman_text_normal, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_text_01', customColor.g_pl_colors_plman_text_normal, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_text_02', 'g_pl_colors.plman_text_hovered', customColor.g_pl_colors_plman_text_hovered, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_text_02', customColor.g_pl_colors_plman_text_hovered, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_text_02', customColor.g_pl_colors_plman_text_hovered, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_text_03', 'g_pl_colors.plman_text_pressed', customColor.g_pl_colors_plman_text_pressed, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_text_03', customColor.g_pl_colors_plman_text_pressed, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_text_03', customColor.g_pl_colors_plman_text_pressed, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_text_04', 'g_pl_colors.header_artist_normal', customColor.g_pl_colors_header_artist_normal, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_text_04', customColor.g_pl_colors_header_artist_normal, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_text_04', customColor.g_pl_colors_header_artist_normal, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_text_05', 'g_pl_colors.header_artist_playing', customColor.g_pl_colors_header_artist_playing, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_text_05', customColor.g_pl_colors_header_artist_playing, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_text_05', customColor.g_pl_colors_header_artist_playing, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_text_06', 'g_pl_colors.header_album_normal', customColor.g_pl_colors_header_album_normal, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_text_06', customColor.g_pl_colors_header_album_normal, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_text_06', customColor.g_pl_colors_header_album_normal, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_text_07', 'g_pl_colors.header_album_playing', customColor.g_pl_colors_header_album_playing, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_text_07', customColor.g_pl_colors_header_album_playing, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_text_07', customColor.g_pl_colors_header_album_playing, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_text_08', 'g_pl_colors.header_info_normal', customColor.g_pl_colors_header_info_normal, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_text_08', customColor.g_pl_colors_header_info_normal, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_text_08', customColor.g_pl_colors_header_info_normal, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_text_09', 'g_pl_colors.header_info_playing', customColor.g_pl_colors_header_info_playing, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_text_09', customColor.g_pl_colors_header_info_playing, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_text_09', customColor.g_pl_colors_header_info_playing, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_text_10', 'g_pl_colors.header_date_normal', customColor.g_pl_colors_header_date_normal, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_text_10', customColor.g_pl_colors_header_date_normal, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_text_10', customColor.g_pl_colors_header_date_normal, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_text_11', 'g_pl_colors.header_date_playing', customColor.g_pl_colors_header_date_playing, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_text_11', customColor.g_pl_colors_header_date_playing, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_text_11', customColor.g_pl_colors_header_date_playing, markerX, y, () => {}));
			}
			break;
		case 'pl_text2':
			{
				const plColors = new StringInput('pl_text_12', 'g_pl_colors.row_title_normal', customColor.g_pl_colors_row_title_normal, x, y, labelW, inputW);
				controlList.push(plColors);
				controlList.push(new ColorPicker('pl_text_12', customColor.g_pl_colors_row_title_normal, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_text_12', customColor.g_pl_colors_row_title_normal, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_text_13', 'g_pl_colors.row_title_playing', customColor.g_pl_colors_row_title_playing, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_text_13', customColor.g_pl_colors_row_title_playing, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_text_13', customColor.g_pl_colors_row_title_playing, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_text_14', 'g_pl_colors.row_title_selected', customColor.g_pl_colors_row_title_selected, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_text_14', customColor.g_pl_colors_row_title_selected, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_text_14', customColor.g_pl_colors_row_title_selected, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_text_15', 'g_pl_colors.row_title_hovered', customColor.g_pl_colors_row_title_hovered, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_text_15', customColor.g_pl_colors_row_title_hovered, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_text_15', customColor.g_pl_colors_row_title_hovered, markerX, y, () => {}));
			}
			break;
		case 'pl_misc':
			{
				const plColors = new StringInput('pl_misc_01', 'g_pl_colors.header_line_normal', customColor.g_pl_colors_header_line_normal, x, y, labelW, inputW);
				controlList.push(plColors);
				controlList.push(new ColorPicker('pl_misc_01', customColor.g_pl_colors_header_line_normal, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_misc_01', customColor.g_pl_colors_header_line_normal, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_misc_02', 'g_pl_colors.header_line_playing', customColor.g_pl_colors_header_line_playing, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_misc_02', customColor.g_pl_colors_header_line_playing, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_misc_02', customColor.g_pl_colors_header_line_playing, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_misc_03', 'g_pl_colors.row_disc_subheader_line', customColor.g_pl_colors_row_disc_subheader_line, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_misc_03', customColor.g_pl_colors_row_disc_subheader_line, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_misc_03', customColor.g_pl_colors_row_disc_subheader_line, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_misc_04', 'g_pl_colors.row_drag_line', customColor.g_pl_colors_row_drag_line, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_misc_04', customColor.g_pl_colors_row_drag_line, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_misc_04', customColor.g_pl_colors_row_drag_line, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_misc_05', 'g_pl_colors.row_drag_line_reached', customColor.g_pl_colors_row_drag_line_reached, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_misc_05', customColor.g_pl_colors_row_drag_line_reached, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_misc_05', customColor.g_pl_colors_row_drag_line_reached, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_misc_06', 'g_pl_colors.row_selection_frame', customColor.g_pl_colors_row_selection_frame, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_misc_06', customColor.g_pl_colors_row_selection_frame, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_misc_06', customColor.g_pl_colors_row_selection_frame, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_misc_07', 'g_pl_colors.row_rating_color', customColor.g_pl_colors_row_rating_color, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_misc_07', customColor.g_pl_colors_row_rating_color, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_misc_07', customColor.g_pl_colors_row_rating_color, markerX, y, () => {}));
			}
			break;
		case 'pl_btns':
			{
				const plColors = new StringInput('pl_btns_01', 'g_pl_colors.sbar_btn_normal', customColor.g_pl_colors_sbar_btn_normal, x, y, labelW, inputW);
				controlList.push(plColors);
				controlList.push(new ColorPicker('pl_btns_01', customColor.g_pl_colors_sbar_btn_normal, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_btns_01', customColor.g_pl_colors_sbar_btn_normal, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_btns_02', 'g_pl_colors.sbar_btn_hovered', customColor.g_pl_colors_sbar_btn_hovered, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_btns_02', customColor.g_pl_colors_sbar_btn_hovered, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_btns_02', customColor.g_pl_colors_sbar_btn_hovered, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_btns_03', 'g_pl_colors.sbar_thumb_normal', customColor.g_pl_colors_sbar_thumb_normal, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_btns_03', customColor.g_pl_colors_sbar_thumb_normal, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_btns_03', customColor.g_pl_colors_sbar_thumb_normal, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_btns_04', 'g_pl_colors.sbar_thumb_hovered', customColor.g_pl_colors_sbar_thumb_hovered, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_btns_04', customColor.g_pl_colors_sbar_thumb_hovered, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_btns_04', customColor.g_pl_colors_sbar_thumb_hovered, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_btns_05', 'g_pl_colors.sbar_thumb_drag', customColor.g_pl_colors_sbar_thumb_drag, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_btns_05', customColor.g_pl_colors_sbar_thumb_drag, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_btns_05', customColor.g_pl_colors_sbar_thumb_drag, markerX, y, () => {}));
			}
			break;
	}
}


/**
 * The Library colors in the custom theme menu.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} w The width.
 * @param {number} h The height.
 * @param {string} library_section The library color page to be opened.
 */
function customLibraryColors(x, y, w, h, library_section) {
	const popupFontSize = pref[`popupFontSize_${pref.layout}`];
	const margin = SCALE(20);
	const labelW = SCALE(300) + popupFontSize;
	const inputW = SCALE(80)  + popupFontSize;
	const markerX = x + margin + inputW + (popupFontSize * (RES_4K ? 0.25 : 0.5)) - SCALE(2);

	switch (library_section) {
		case 'lib_bg':
			{
				const libColors = new StringInput('lib_bg_01', 'ui.col.bg', customColor.ui_col_bg, x, y, labelW, inputW);
				controlList.push(libColors);
				controlList.push(new ColorPicker('lib_bg_01', customColor.ui_col_bg, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_bg_01', customColor.ui_col_bg, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_bg_02', 'ui.col.rowStripes', customColor.ui_col_rowStripes, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_bg_02', customColor.ui_col_rowStripes, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_bg_02', customColor.ui_col_rowStripes, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_bg_03', 'ui.col.nowPlayingBg', customColor.ui_col_nowPlayingBg, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_bg_03', customColor.ui_col_nowPlayingBg, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_bg_03', customColor.ui_col_nowPlayingBg, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_bg_04', 'ui.col.sideMarker', customColor.ui_col_sideMarker, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_bg_04', customColor.ui_col_sideMarker, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_bg_04', customColor.ui_col_sideMarker, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_bg_05', 'ui.col.selectionFrame', customColor.ui_col_selectionFrame, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_bg_05', customColor.ui_col_selectionFrame, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_bg_05', customColor.ui_col_selectionFrame, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_bg_06', 'ui.col.selectionFrame2', customColor.ui_col_selectionFrame2, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_bg_06', customColor.ui_col_selectionFrame2, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_bg_06', customColor.ui_col_selectionFrame2, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_bg_07', 'ui.col.hoverFrame', customColor.ui_col_hoverFrame, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_bg_07', customColor.ui_col_hoverFrame, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_bg_07', customColor.ui_col_hoverFrame, markerX, y, () => {}));
			}
			break;
		case 'lib_text':
			{
				const libColors = new StringInput('lib_text_01', 'ui.col.text', customColor.ui_col_text, x, y, labelW, inputW);
				controlList.push(libColors);
				controlList.push(new ColorPicker('lib_text_01', customColor.ui_col_text, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_text_01', customColor.ui_col_text, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_text_02', 'ui.col.text_h', customColor.ui_col_text_h, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_text_02', customColor.ui_col_text_h, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_text_02', customColor.ui_col_text_h, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_text_03', 'ui.col.text_nowp', customColor.ui_col_text_nowp, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_text_03', customColor.ui_col_text_nowp, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_text_03', customColor.ui_col_text_nowp, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_text_04', 'ui.col.textSel', customColor.ui_col_textSel, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_text_04', customColor.ui_col_textSel, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_text_04', customColor.ui_col_textSel, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_text_05', 'ui.col.txt', customColor.ui_col_txt, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_text_05', customColor.ui_col_txt, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_text_05', customColor.ui_col_txt, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_text_06', 'ui.col.txt_h', customColor.ui_col_txt_h, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_text_06', customColor.ui_col_txt_h, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_text_06', customColor.ui_col_txt_h, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_text_07', 'ui.col.txt_box', customColor.ui_col_txt_box, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_text_07', customColor.ui_col_txt_box, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_text_07', customColor.ui_col_txt_box, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_text_08', 'ui.col.search', customColor.ui_col_search, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_text_08', customColor.ui_col_search, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_text_08', customColor.ui_col_search, markerX, y, () => {}));
			}
			break;
		case 'lib_node':
			{
				const libColors = new StringInput('lib_node_01', 'ui.col.iconPlus', customColor.ui_col_iconPlus, x, y, labelW, inputW);
				controlList.push(libColors);
				controlList.push(new ColorPicker('lib_node_01', customColor.ui_col_iconPlus, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_node_01', customColor.ui_col_iconPlus, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_node_02', 'ui.col.iconPlus_h', customColor.ui_col_iconPlus_h, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_node_02', customColor.ui_col_iconPlus_h, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_node_02', customColor.ui_col_iconPlus_h, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_node_03', 'ui.col.iconPlus_sel', customColor.ui_col_iconPlus_sel, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_node_03', customColor.ui_col_iconPlus_sel, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_node_03', customColor.ui_col_iconPlus_sel, markerX, y, () => {}));
				y += libColors.h + margin;

				if (pref.libraryDesign === 'traditional') {
					controlList.push(new StringInput('lib_node_04', 'ui.col.iconPlusBg', customColor.ui_col_iconPlusBg, x, y, labelW, inputW));
					controlList.push(new ColorPicker('lib_node_04', customColor.ui_col_iconPlusBg, x + 2, y, () => {}));
					controlList.push(new ColorMarker('lib_node_04', customColor.ui_col_iconPlusBg, markerX, y, () => {}));
					y += libColors.h + margin;
					controlList.push(new StringInput('lib_node_05', 'ui.col.iconMinus_e', customColor.ui_col_iconMinus_e, x, y, labelW, inputW));
					controlList.push(new ColorPicker('lib_node_05', customColor.ui_col_iconMinus_e, x + 2, y, () => {}));
					controlList.push(new ColorMarker('lib_node_05', customColor.ui_col_iconMinus_e, markerX, y, () => {}));
					y += libColors.h + margin;
					controlList.push(new StringInput('lib_node_06', 'ui.col.iconMinus_c', customColor.ui_col_iconMinus_c, x, y, labelW, inputW));
					controlList.push(new ColorPicker('lib_node_06', customColor.ui_col_iconMinus_c, x + 2, y, () => {}));
					controlList.push(new ColorMarker('lib_node_06', customColor.ui_col_iconMinus_c, markerX, y, () => {}));
					y += libColors.h + margin;
					controlList.push(new StringInput('lib_node_07', 'ui.col.iconMinus_h', customColor.ui_col_iconMinus_h, x, y, labelW, inputW));
					controlList.push(new ColorPicker('lib_node_07', customColor.ui_col_iconMinus_h, x + 2, y, () => {}));
					controlList.push(new ColorMarker('lib_node_07', customColor.ui_col_iconMinus_h, markerX, y, () => {}));
				}
			}
			break;
		case 'lib_btns':
			{
				const libColors = new StringInput('lib_btns_01', 'ui.col.searchBtn', customColor.ui_col_searchBtn, x, y, labelW, inputW);
				controlList.push(libColors);
				controlList.push(new ColorPicker('lib_btns_01', customColor.ui_col_searchBtn, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_btns_01', customColor.ui_col_searchBtn, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_btns_02', 'ui.col.crossBtn', customColor.ui_col_crossBtn, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_btns_02', customColor.ui_col_crossBtn, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_btns_02', customColor.ui_col_crossBtn, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_btns_03', 'ui.col.filterBtn', customColor.ui_col_filterBtn, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_btns_03', customColor.ui_col_filterBtn, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_btns_03', customColor.ui_col_filterBtn, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_btns_04', 'ui.col.settingsBtn', customColor.ui_col_settingsBtn, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_btns_04', customColor.ui_col_settingsBtn, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_btns_04', customColor.ui_col_settingsBtn, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_btns_05', 'ui.col.line', customColor.ui_col_line, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_btns_05', customColor.ui_col_line, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_btns_05', customColor.ui_col_line, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_btns_06', 'ui.col.s_line', customColor.ui_col_s_line, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_btns_06', customColor.ui_col_s_line, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_btns_06', customColor.ui_col_s_line, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_btns_07', 'ui.col.sbarBtns', customColor.ui_col_sbarBtns, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_btns_07', customColor.ui_col_sbarBtns, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_btns_07', customColor.ui_col_sbarBtns, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_btns_08', 'ui.col.sbarNormal', customColor.ui_col_sbarNormal, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_btns_08', customColor.ui_col_sbarNormal, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_btns_08', customColor.ui_col_sbarNormal, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_btns_09', 'ui.col.sbarHovered', customColor.ui_col_sbarHovered, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_btns_09', customColor.ui_col_sbarHovered, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_btns_09', customColor.ui_col_sbarHovered, markerX, y, () => {}));
				y += libColors.h + margin;
				controlList.push(new StringInput('lib_btns_10', 'ui.col.sbarDrag', customColor.ui_col_sbarDrag, x, y, labelW, inputW));
				controlList.push(new ColorPicker('lib_btns_10', customColor.ui_col_sbarDrag, x + 2, y, () => {}));
				controlList.push(new ColorMarker('lib_btns_10', customColor.ui_col_sbarDrag, markerX, y, () => {}));
			}
			break;
	}
}


/**
 * The Biography colors in the custom theme menu.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} w The width.
 * @param {number} h The height.
 * @param {string} biography_section The biography color page to be opened.
 */
function customBiographyColors(x, y, w, h, biography_section) {
	const popupFontSize = pref[`popupFontSize_${pref.layout}`];
	const margin = SCALE(20);
	const labelW = SCALE(300) + popupFontSize;
	const inputW = SCALE(80)  + popupFontSize;
	const markerX = x + margin + inputW + (popupFontSize * (RES_4K ? 0.25 : 0.5)) - SCALE(2);

	switch (biography_section) {
		case 'bio_bg':
			{
				const bioColors = new StringInput('bio_bg_01', 'uiBio.col.bg', customColor.uiBio_col_bg, x, y, labelW, inputW);
				controlList.push(bioColors);
				controlList.push(new ColorPicker('bio_bg_01', customColor.uiBio_col_bg, x + 2, y, () => {}));
				controlList.push(new ColorMarker('bio_bg_01', customColor.uiBio_col_bg, markerX, y, () => {}));
				y += bioColors.h + margin;
				controlList.push(new StringInput('bio_bg_02', 'uiBio.col.rowStripes', customColor.uiBio_col_rowStripes, x, y, labelW, inputW));
				controlList.push(new ColorPicker('bio_bg_02', customColor.uiBio_col_rowStripes, x + 2, y, () => {}));
				controlList.push(new ColorMarker('bio_bg_02', customColor.uiBio_col_rowStripes, markerX, y, () => {}));
				y += bioColors.h + margin;
				controlList.push(new StringInput('bio_bg_03', 'uiBio.col.noPhotoStubBg', customColor.uiBio_col_noPhotoStubBg, x, y, labelW, inputW));
				controlList.push(new ColorPicker('bio_bg_03', customColor.uiBio_col_noPhotoStubBg, x + 2, y, () => {}));
				controlList.push(new ColorMarker('bio_bg_03', customColor.uiBio_col_noPhotoStubBg, markerX, y, () => {}));
			}
			break;
		case 'bio_text':
			{
				const bioColors = new StringInput('bio_text_01', 'uiBio.col.headingText', customColor.uiBio_col_headingText, x, y, labelW, inputW);
				controlList.push(bioColors);
				controlList.push(new ColorPicker('bio_text_01', customColor.uiBio_col_headingText, x + 2, y, () => {}));
				controlList.push(new ColorMarker('bio_text_01', customColor.uiBio_col_headingText, markerX, y, () => {}));
				y += bioColors.h + margin;
				controlList.push(new StringInput('bio_text_02', 'uiBio.col.source', customColor.uiBio_col_source, x, y, labelW, inputW));
				controlList.push(new ColorPicker('bio_text_02', customColor.uiBio_col_source, x + 2, y, () => {}));
				controlList.push(new ColorMarker('bio_text_02', customColor.uiBio_col_source, markerX, y, () => {}));
				y += bioColors.h + margin;
				controlList.push(new StringInput('bio_text_03', 'uiBio.col.accent', customColor.uiBio_col_accent, x, y, labelW, inputW));
				controlList.push(new ColorPicker('bio_text_03', customColor.uiBio_col_accent, x + 2, y, () => {}));
				controlList.push(new ColorMarker('bio_text_03', customColor.uiBio_col_accent, markerX, y, () => {}));
				y += bioColors.h + margin;
				controlList.push(new StringInput('bio_text_04', 'uiBio.col.summary', customColor.uiBio_col_summary, x, y, labelW, inputW));
				controlList.push(new ColorPicker('bio_text_04', customColor.uiBio_col_summary, x + 2, y, () => {}));
				controlList.push(new ColorMarker('bio_text_04', customColor.uiBio_col_summary, markerX, y, () => {}));
				y += bioColors.h + margin;
				controlList.push(new StringInput('bio_text_05', 'uiBio.col.text', customColor.uiBio_col_text, x, y, labelW, inputW));
				controlList.push(new ColorPicker('bio_text_05', customColor.uiBio_col_text, x + 2, y, () => {}));
				controlList.push(new ColorMarker('bio_text_05', customColor.uiBio_col_text, markerX, y, () => {}));
				y += bioColors.h + margin;
				controlList.push(new StringInput('bio_text_06', 'uiBio.col.lyricsNormal', customColor.uiBio_col_lyricsNormal, x, y, labelW, inputW));
				controlList.push(new ColorPicker('bio_text_06', customColor.uiBio_col_lyricsNormal, x + 2, y, () => {}));
				controlList.push(new ColorMarker('bio_text_06', customColor.uiBio_col_lyricsNormal, markerX, y, () => {}));
				y += bioColors.h + margin;
				controlList.push(new StringInput('bio_text_07', 'uiBio.col.lyricsHighlight', customColor.uiBio_col_lyricsHighlight, x, y, labelW, inputW));
				controlList.push(new ColorPicker('bio_text_07', customColor.uiBio_col_lyricsHighlight, x + 2, y, () => {}));
				controlList.push(new ColorMarker('bio_text_07', customColor.uiBio_col_lyricsHighlight, markerX, y, () => {}));
				y += bioColors.h + margin;
				controlList.push(new StringInput('bio_text_08', 'uiBio.col.noPhotoStubText', customColor.uiBio_col_noPhotoStubText, x, y, labelW, inputW));
				controlList.push(new ColorPicker('bio_text_08', customColor.uiBio_col_noPhotoStubText, x + 2, y, () => {}));
				controlList.push(new ColorMarker('bio_text_08', customColor.uiBio_col_noPhotoStubText, markerX, y, () => {}));
			}
			break;
		case 'bio_misc':
			{
				const bioColors = new StringInput('bio_misc_01', 'uiBio.col.bottomLine', customColor.uiBio_col_bottomLine, x, y, labelW, inputW);
				controlList.push(bioColors);
				controlList.push(new ColorPicker('bio_misc_01', customColor.uiBio_col_bottomLine, x + 2, y, () => {}));
				controlList.push(new ColorMarker('bio_misc_01', customColor.uiBio_col_bottomLine, markerX, y, () => {}));
				y += bioColors.h + margin;
				controlList.push(new StringInput('bio_misc_02', 'uiBio.col.centerLine', customColor.uiBio_col_centerLine, x, y, labelW, inputW));
				controlList.push(new ColorPicker('bio_misc_02', customColor.uiBio_col_centerLine, x + 2, y, () => {}));
				controlList.push(new ColorMarker('bio_misc_02', customColor.uiBio_col_centerLine, markerX, y, () => {}));
				y += bioColors.h + margin;
				controlList.push(new StringInput('bio_misc_03', 'uiBio.col.sectionLine', customColor.uiBio_col_sectionLine, x, y, labelW, inputW));
				controlList.push(new ColorPicker('bio_misc_03', customColor.uiBio_col_sectionLine, x + 2, y, () => {}));
				controlList.push(new ColorMarker('bio_misc_03', customColor.uiBio_col_sectionLine, markerX, y, () => {}));
			}
			break;
		case 'bio_btns':
			{
				const bioColors = new StringInput('bio_btns_01', 'uiBio.col.sbarBtns', customColor.uiBio_col_sbarBtns, x, y, labelW, inputW);
				controlList.push(bioColors);
				controlList.push(new ColorPicker('bio_btns_01', customColor.uiBio_col_sbarBtns, x + 2, y, () => {}));
				controlList.push(new ColorMarker('bio_btns_01', customColor.uiBio_col_sbarBtns, markerX, y, () => {}));
				y += bioColors.h + margin;
				controlList.push(new StringInput('bio_btns_02', 'uiBio.col.sbarNormal', customColor.uiBio_col_sbarNormal, x, y, labelW, inputW));
				controlList.push(new ColorPicker('bio_btns_02', customColor.uiBio_col_sbarNormal, x + 2, y, () => {}));
				controlList.push(new ColorMarker('bio_btns_02', customColor.uiBio_col_sbarNormal, markerX, y, () => {}));
				y += bioColors.h + margin;
				controlList.push(new StringInput('bio_btns_03', 'uiBio.col.sbarHovered', customColor.uiBio_col_sbarHovered, x, y, labelW, inputW));
				controlList.push(new ColorPicker('bio_btns_03', customColor.uiBio_col_sbarHovered, x + 2, y, () => {}));
				controlList.push(new ColorMarker('bio_btns_03', customColor.uiBio_col_sbarHovered, markerX, y, () => {}));
				y += bioColors.h + margin;
				controlList.push(new StringInput('bio_btns_04', 'uiBio.col.sbarDrag', customColor.uiBio_col_sbarDrag, x, y, labelW, inputW));
				controlList.push(new ColorPicker('bio_btns_04', customColor.uiBio_col_sbarDrag, x + 2, y, () => {}));
				controlList.push(new ColorMarker('bio_btns_04', customColor.uiBio_col_sbarDrag, markerX, y, () => {}));
			}
			break;
	}
}


/**
 * Sets the info page in the custom theme menu.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} w The width.
 * @param {number} h The height.
 * @param {string} link The url to be opened.
 */
function customThemeInfo(x, y, w, h, link) {
	link = 'https://github.com/TT-ReBORN/Georgia-ReBORN/discussions/99';
	const margin = SCALE(20);
	const maxWidth = (ww * 0.5) - (margin * 4);

	const text = 'You can modify the main colors, the playlist colors, the library colors and the biography colors. First select a custom theme slot in the drop down menu "Options" that you want to modify. You can either select the color via the color picker or paste a HEX value in the input field.\nIt will apply all changes in real time and saves it automatically in the georgia-reborn-custom.jsonc config file. Each color has a name that you can also find in the georgia-reborn-custom.jsonc config file and modify it there.\n\nTo reset the colors to the default ones, select the "Reset" option from the drop down menu.\n\nTip: Download the resource pack from the Github page to open the custom theme template and modify colors in Photoshop or Gimp.\nIf you are happy with the result, just copy and paste the HEX values.\n\nYou can showcase your custom themes and share your configs here: Click on this text.';

	const height = MeasureString(text, ft.popup, 0, 0, maxWidth, wh).Height;

	const info = new Info(x, y, maxWidth, height, text, link);
	controlList.push(info);
}


/**
 * Updates all colors in the georgia-reborn-custom config file.
 * @param {string} id The id of the UI element.
 * @param {string} value The color of the UI element.
 */
function updateColorsFromConfig(id, value) {
	const customThemeColors = {
		// * MAIN - BG * //
		main_bg_01: 'col_bg',
		main_bg_02: 'col_popupBg',
		main_bg_03: 'col_detailsBg',
		main_bg_04: 'col_shadow',
		main_bg_05: 'col_discArtShadow',
		main_bg_06: 'col_noAlbumArtStub',
		// * MAIN - BAR * //
		main_bar_01: 'col_timelineAdded',
		main_bar_02: 'col_timelinePlayed',
		main_bar_03: 'col_timelineUnplayed',
		main_bar_04: 'col_timelineFrame',
		main_bar_05: 'col_progressBar',
		main_bar_06: 'col_progressBarStreaming',
		main_bar_07: 'col_progressBarFrame',
		main_bar_08: 'col_progressBarFill',
		main_bar_09: 'col_volumeBar',
		main_bar_10: 'col_volumeBarFrame',
		main_bar_11: 'col_volumeBarFill',
		// * MAIN - BAR 2 * //
		main_bar_12: 'col_peakmeterBarProg',
		main_bar_13: 'col_peakmeterBarProgFill',
		main_bar_14: 'col_peakmeterBarFillTop',
		main_bar_15: 'col_peakmeterBarFillMiddle',
		main_bar_16: 'col_peakmeterBarFillBack',
		main_bar_17: 'col_peakmeterBarVertProgFill',
		main_bar_18: 'col_peakmeterBarVertFill',
		main_bar_19: 'col_peakmeterBarVertFillPeaks',
		// * MAIN - BAR 3 * //
		main_bar_20: 'col_waveformBarFillFront',
		main_bar_21: 'col_waveformBarFillBack',
		main_bar_22: 'col_waveformBarFillPreFront',
		main_bar_23: 'col_waveformBarFillPreBack',
		main_bar_24: 'col_waveformBarIndicator',
		// * MAIN - TEXT * //
		main_text_01: 'col_lowerBarArtist',
		main_text_02: 'col_lowerBarTitle',
		main_text_03: 'col_lowerBarTime',
		main_text_04: 'col_lowerBarLength',
		main_text_05: 'col_detailsText',
		main_text_06: 'col_detailsRating',
		main_text_08: 'col_popupText',
		main_text_09: 'col_lyricsNormal',
		main_text_10: 'col_lyricsHighlight',
		main_text_11: 'col_lyricsShadow',
		// * MAIN - BTNS * //
		main_btns_01: 'col_menuBgColor',
		main_btns_02: 'col_menuStyleBg',
		main_btns_03: 'col_menuRectStyleEmbossTop',
		main_btns_04: 'col_menuRectStyleEmbossBottom',
		main_btns_05: 'col_menuRectNormal',
		main_btns_06: 'col_menuRectHovered',
		main_btns_07: 'col_menuRectDown',
		main_btns_08: 'col_menuTextNormal',
		main_btns_09: 'col_menuTextHovered',
		main_btns_10: 'col_menuTextDown',
		// * MAIN - BTNS 2 * //
		main_btns_11: 'col_transportEllipseBg',
		main_btns_12: 'col_transportEllipseNormal',
		main_btns_13: 'col_transportEllipseHovered',
		main_btns_14: 'col_transportEllipseDown',
		main_btns_15: 'col_transportStyleBg',
		main_btns_16: 'col_transportStyleTop',
		main_btns_17: 'col_transportStyleBottom',
		main_btns_18: 'col_transportIconNormal',
		main_btns_19: 'col_transportIconHovered',
		main_btns_20: 'col_transportIconDown',
		// * MAIN - STYLE * //
		main_style_01: 'col_styleBevel',
		main_style_02: 'col_styleGradient',
		main_style_03: 'col_styleGradient2',
		main_style_04: 'col_styleProgressBar',
		main_style_05: 'col_styleProgressBarLineTop',
		main_style_06: 'col_styleProgressBarLineBottom',
		main_style_07: 'col_styleProgressBarFill',
		main_style_08: 'col_styleVolumeBar',
		main_style_09: 'col_styleVolumeBarFill',

		// * PLAYLIST - BG * //
		pl_bg_01: 'g_pl_colors_bg',
		pl_bg_02: 'g_pl_colors_header_nowplaying_bg',
		pl_bg_03: 'g_pl_colors_header_sideMarker',
		pl_bg_04: 'g_pl_colors_row_nowplaying_bg',
		pl_bg_05: 'g_pl_colors_row_stripes_bg',
		pl_bg_06: 'g_pl_colors_row_sideMarker',
		// * PLAYLIST - TEXT * //
		pl_text_01: 'g_pl_colors_plman_text_normal',
		pl_text_02: 'g_pl_colors_plman_text_hovered',
		pl_text_03: 'g_pl_colors_plman_text_pressed',
		pl_text_04: 'g_pl_colors_header_artist_normal',
		pl_text_05: 'g_pl_colors_header_artist_playing',
		pl_text_06: 'g_pl_colors_header_album_normal',
		pl_text_07: 'g_pl_colors_header_album_playing',
		pl_text_08: 'g_pl_colors_header_info_normal',
		pl_text_09: 'g_pl_colors_header_info_playing',
		pl_text_10: 'g_pl_colors_header_date_normal',
		pl_text_11: 'g_pl_colors_header_date_playing',
		pl_text_12: 'g_pl_colors_row_title_normal',
		pl_text_13: 'g_pl_colors_row_title_playing',
		pl_text_14: 'g_pl_colors_row_title_selected',
		pl_text_15: 'g_pl_colors_row_title_hovered',
		// * PLAYLIST - MISC * //
		pl_misc_01: 'g_pl_colors_header_line_normal',
		pl_misc_02: 'g_pl_colors_header_line_playing',
		pl_misc_03: 'g_pl_colors_row_disc_subheader_line',
		pl_misc_04: 'g_pl_colors_row_drag_line',
		pl_misc_05: 'g_pl_colors_row_drag_line_reached',
		pl_misc_06: 'g_pl_colors_row_selection_frame',
		pl_misc_07: 'g_pl_colors_row_rating_color',
		// * PLAYLIST - BTNS * //
		pl_btns_01: 'g_pl_colors_sbar_btn_normal',
		pl_btns_02: 'g_pl_colors_sbar_btn_hovered',
		pl_btns_03: 'g_pl_colors_sbar_thumb_normal',
		pl_btns_04: 'g_pl_colors_sbar_thumb_hovered',
		pl_btns_05: 'g_pl_colors_sbar_thumb_drag',

		// * LIBRARY - BG * //
		lib_bg_01: 'ui_col_bg',
		lib_bg_02: 'ui_col_rowStripes',
		lib_bg_03: 'ui_col_nowPlayingBg',
		lib_bg_04: 'ui_col_sideMarker',
		lib_bg_05: 'ui_col_selectionFrame',
		lib_bg_06: 'ui_col_selectionFrame2',
		lib_bg_07: 'ui_col_hoverFrame',
		// * LIBRARY - TEXT * //
		lib_text_01: 'ui_col_text',
		lib_text_02: 'ui_col_text_h',
		lib_text_03: 'ui_col_text_nowp',
		lib_text_04: 'ui_col_textSel',
		lib_text_05: 'ui_col_txt',
		lib_text_06: 'ui_col_txt_h',
		lib_text_07: 'ui_col_txt_box',
		lib_text_08: 'ui_col_search',
		// * LIBRARY - NODE * //
		lib_node_01: 'ui_col_iconPlus',
		lib_node_02: 'ui_col_iconPlus_h',
		lib_node_03: 'ui_col_iconPlus_sel',
		lib_node_04: 'ui_col_iconPlusBg',
		lib_node_05: 'ui_col_iconMinus_e',
		lib_node_06: 'ui_col_iconMinus_c',
		lib_node_07: 'ui_col_iconMinus_h',
		// * LIBRARY - BTNS * //
		lib_btns_01: 'ui_col_searchBtn',
		lib_btns_02: 'ui_col_crossBtn',
		lib_btns_03: 'ui_col_filterBtn',
		lib_btns_04: 'ui_col_settingsBtn',
		lib_btns_05: 'ui_col_line',
		lib_btns_06: 'ui_col_s_line',
		lib_btns_07: 'ui_col_sbarBtns',
		lib_btns_08: 'ui_col_sbarNormal',
		lib_btns_09: 'ui_col_sbarHovered',
		lib_btns_10: 'ui_col_sbarDrag',

		// * BIOGRAPHY - BG * //
		bio_bg_01: 'uiBio_col_bg',
		bio_bg_02: 'uiBio_col_rowStripes',
		bio_bg_03: 'uiBio_col_noPhotoStubBg',
		// * BIOGRAPHY - TEXT * //
		bio_text_01: 'uiBio_col_headingText',
		bio_text_02: 'uiBio_col_source',
		bio_text_03: 'uiBio_col_accent',
		bio_text_04: 'uiBio_col_summary',
		bio_text_05: 'uiBio_col_text',
		bio_text_06: 'uiBio_col_lyricsNormal',
		bio_text_07: 'uiBio_col_lyricsHighlight',
		bio_text_08: 'uiBio_col_noPhotoStubText',
		// * BIOGRAPHY - MISC * //
		bio_misc_01: 'uiBio_col_bottomLine',
		bio_misc_02: 'uiBio_col_centerLine',
		bio_misc_03: 'uiBio_col_sectionLine',
		// * BIOGRAPHY - BTNS * //
		bio_btns_01: 'uiBio_col_sbarBtns',
		bio_btns_02: 'uiBio_col_sbarNormal',
		bio_btns_03: 'uiBio_col_sbarHovered',
		bio_btns_04: 'uiBio_col_sbarDrag'
	};

	// Update custom theme colors
	if (Object.prototype.hasOwnProperty.call(customThemeColors, id)) {
		customColor[customThemeColors[id]] = value;
	}

	// Update control list colors
	for (const color of controlList) {
		if (color.id === id) {
		color.value = value;
		}
	}
}


/**
 * Resets all colors in the active custom theme to defaults.
 */
function resetCustomColors() {
	const customTheme =
		pref.theme === 'custom01' ? 'customTheme01' :
		pref.theme === 'custom02' ? 'customTheme02' :
		pref.theme === 'custom03' ? 'customTheme03' :
		pref.theme === 'custom04' ? 'customTheme04' :
		pref.theme === 'custom05' ? 'customTheme05' :
		pref.theme === 'custom06' ? 'customTheme06' :
		pref.theme === 'custom07' ? 'customTheme07' :
		pref.theme === 'custom08' ? 'customTheme08' :
		pref.theme === 'custom09' ? 'customTheme09' :
		pref.theme === 'custom10' ? 'customTheme10' : '';

	const defaults = configCustom.updateConfigObjValues(customTheme, customThemeDefaults, true);

	switch (pref.theme) {
		case 'custom01':
			customTheme01 = configCustom.addConfigurationObject(customTheme01Schema, Object.assign({}, defaults, customThemeDefaults), customThemeComments);
			customColor = customTheme01;
			break;
		case 'custom02':
			customTheme02 = configCustom.addConfigurationObject(customTheme02Schema, Object.assign({}, defaults, customThemeDefaults), customThemeComments);
			customColor = customTheme02;
			break;
		case 'custom03':
			customTheme03 = configCustom.addConfigurationObject(customTheme03Schema, Object.assign({}, defaults, customThemeDefaults), customThemeComments);
			customColor = customTheme03;
			break;
		case 'custom04':
			customTheme04 = configCustom.addConfigurationObject(customTheme04Schema, Object.assign({}, defaults, customThemeDefaults), customThemeComments);
			customColor = customTheme04;
			break;
		case 'custom05':
			customTheme05 = configCustom.addConfigurationObject(customTheme05Schema, Object.assign({}, defaults, customThemeDefaults), customThemeComments);
			customColor = customTheme05;
			break;
		case 'custom06':
			customTheme06 = configCustom.addConfigurationObject(customTheme06Schema, Object.assign({}, defaults, customThemeDefaults), customThemeComments);
			customColor = customTheme06;
			break;
		case 'custom07':
			customTheme07 = configCustom.addConfigurationObject(customTheme07Schema, Object.assign({}, defaults, customThemeDefaults), customThemeComments);
			customColor = customTheme07;
			break;
		case 'custom08':
			customTheme08 = configCustom.addConfigurationObject(customTheme08Schema, Object.assign({}, defaults, customThemeDefaults), customThemeComments);
			customColor = customTheme08;
			break;
		case 'custom09':
			customTheme09 = configCustom.addConfigurationObject(customTheme09Schema, Object.assign({}, defaults, customThemeDefaults), customThemeComments);
			customColor = customTheme09;
			break;
		case 'custom10':
			customTheme10 = configCustom.addConfigurationObject(customTheme10Schema, Object.assign({}, defaults, customThemeDefaults), customThemeComments);
			customColor = customTheme10;
			break;
	}
}


////////////////////////////
// * METADATA GRID MENU * //
////////////////////////////
/**
 * Draws the custom metadata grid menu.
 * @param {GdiGraphics} gr
 */
function drawMetadataGridMenu(gr) {
	if (!displayMetadataGridMenu || pref.layout !== 'default' || (displayPlaylist || displayLibrary || displayBiography || pref.displayLyrics)) return;

	const x = albumArtSize.x - 1;
	const y = geo.topMenuHeight;
	const width = ww;
	const height = wh - geo.topMenuHeight - geo.lowerBarHeight;

	gr.FillSolidRect(x, y, width, height, g_pl_colors.bg);
	controlList.forEach(c => c.draw(gr));

	if (activeControl && activeControl instanceof DropDownMenu && activeControl.isSelectUp) {
		activeControl.draw(gr);
	}
}


/**
 * Initializes the custom metadata grid menu.
 * @param {string} page The current page number of the metadata grid.
 * @param {boolean} info Displays the metadata grid info page.
 */
function initMetadataGridMenu(page, info) {
	controlList = [];

	const margin = SCALE(40);
	const baseX = displayBiography || pref.displayLyrics ? ww * 0.5 + margin : displayDetails ? albumArtSize.x + margin : margin;
	let x = baseX;
	let y = albumArtSize.y + margin * 0.75;

	const menu = new DropDownMenu(x, y, 'Page 1', ['Page 1'], 0);
	controlList.push(menu);
	x += controlList[controlList.length - 1].w + 1; controlList.push(new DropDownMenu(x, y, 'Page 2',  ['Page 2'], 0));
	x += controlList[controlList.length - 1].w + 1; controlList.push(new DropDownMenu(x, y, 'Page 3',  ['Page 3'], 0));
	x += controlList[controlList.length - 1].w + 1; controlList.push(new DropDownMenu(x, y, 'Page 4',  ['Page 4'], 0));
	x += controlList[controlList.length - 1].w + 1; controlList.push(new DropDownMenu(x, y, 'Options', ['Info', '', 'Reset'], 0));
	x += controlList[controlList.length - 1].w + 1; controlList.push(new DropDownMenu(x, y, '\u2715',  ['']));
	x =  baseX;
	y += menu.h + margin * 0.75;

	if (info) {
		metadataGridInfo(x, y, ww * 0.5, wh - geo.topMenuHeight - geo.lowerBarHeight);
	} else {
		metadataGridPage(x - margin * 0.5, y, ww * 0.5, wh - geo.topMenuHeight - geo.lowerBarHeight, page);
	}
}


/**
 * Displays the current page of the custom metadata grid menu.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} w The width.
 * @param {number} h The height.
 * @param {number} page The metadata grid page to display, it can have values from 1 to 4.
 */
function metadataGridPage(x, y, w, h, page) {
	const prefs = config.readConfiguration();
	const popupFontSize = pref[`popupFontSize_${pref.layout}`];
	const margin = SCALE(20);
	const inputW = SCALE(80) + popupFontSize;
	const start  = page === 1 ? 0 : page === 2 ?  8 : page === 3 ? 16 : page === 4 ? 24 : 0;
	const end    = page === 1 ? 8 : page === 2 ? 16 : page === 3 ? 24 : page === 4 ? 32 : 8;

	for (let i = start; i < end; i++) {
		try {
			const label = prefs.metadataGrid[i].label ? prefs.metadataGrid[i].label : '""';
			const value = prefs.metadataGrid[i].val ? prefs.metadataGrid[i].val : '""';
			const input = new StringInput(label, '', label, x + 1, y, '', inputW);
			controlList.push(input);
			controlList.push(new StringInput2(label, '', value, x + inputW, y, '', Math.ceil(ww * 0.5 + inputW - margin)));
			y += input.h + margin * 1.25;
		}
		catch (e) {
			break;
		}
	}
}


/**
 * Shows the info page of the custom metadata grid menu.
 * @param {number} x The x-coordinate.
 * @param {number} y The y-coordinate.
 * @param {number} w The width.
 * @param {number} h The height.
 * @param {string} link The url to a website.
 */
function metadataGridInfo(x, y, w, h, link) {
	link = 'https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Title_Formatting_Reference';
	const maxWidth = ww * 0.66 - SCALE(100);

	const text = 'You can modify existing entries or add your new custom patterns.\nTo confirm changes, press "Enter" or paste a new pattern into the input field.\nAll changes will be applied in real time and automatically saved in the\ngeorgia-reborn-config.jsonc file where it can be also manually modified.\n\nTo reset the metadata grid to its default patterns, select the "Reset" option\nfrom the drop down menu.\n\nTip: To reorder the entries, first copy the ones you want to change in your\nnotepad and paste the label and pattern afterwards.\n\nNote: Not all entries will be displayed if the height of the player size is too small,\nchange to a larger player size if desired.\n\nYou can learn more about patterns here, click on this text.';

	const height = MeasureString(text, ft.popup, 0, 0, maxWidth, wh).Height;
	const info = new Info(x, y, maxWidth, height, text, link);
	controlList.push(info);
}


/**
 * Updates the labels and keys from the metadata grid in the georgia-reborn-config file.
 * @param {string} id The metadata gird label name.
 * @param {string} value1 The metadata grid tag name.
 * @param {string} value2 The metadata grid tag value.
 */
function updateMetadataGridFromConfig(id, value1, value2) {
	const prefs = config.readConfiguration();
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

	config.updateConfigObjValues('metadataGrid', metadataGrid, true);
	updateMetadataGrid();
	window.Repaint();
}


/**
 * Resets the labels and keys from the metadata grid in the georgia-reborn-config file.
 */
function resetMetadataGrid() {
	const prefs = config.readConfiguration();
	const metadataGrid = prefs.metadataGrid;

	for (let i = 0; i < metadataGrid.length; i++) {
		metadataGrid[i].label = defaultMetadataGrid[i].label;
		metadataGrid[i].val = defaultMetadataGrid[i].val;
	}

	config.updateConfigObjValues('metadataGrid', metadataGrid, true);
	updateMetadataGrid();
	window.Repaint();
}
