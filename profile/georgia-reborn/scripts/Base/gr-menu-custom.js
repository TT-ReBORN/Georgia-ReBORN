/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Custom Menu                          * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-06-01                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


//////////////////////////////
// * CUSTOM MENU CONTROLS * //
//////////////////////////////
let getImage;
let getGraphics;

class BaseControl {
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
		this.popupFontSize = pref.layout === 'compact' ? pref.popupFontSize_compact : pref.layout === 'artwork' ? pref.popupFontSize_artwork : pref.popupFontSize_default;
		this.closeBtn = this.label === '\u2715';
		/** @protected */ this.g = undefined;
		if (!getImage) {
			getImage = gdi.CreateImage(1, 1);
			getGraphics = getImage.GetGraphics(); // GdiBitmap used for MeasureString and other functions
		}
		this.g = getGraphics;
	}

	destructor() {
		getImage.ReleaseGraphics(this.g);
	}

	// These aren't really virtually, just stubbed so that not every child needs to create one if it wants to ignore these events
	/** @virtual */
	onKey(vkey) {}

	/** @virtual */
	onChar(code) {}

	/** @virtual */
	mouseDown(x, y) {}

	/**
	 * @param {boolean} value
	 */
	set hovered(value) {
		this._hovered = value;
		// If you need to repaint on hovered value changing do override this method in child class
	}

	get hovered() {
		return this._hovered;
	}

	clearFocus() {
		this.focus = false;
	}

	/**
	 * @param {string} text
	 * @param {GdiFont} font
	 * @param {boolean=} [round=false] Should the value be rounded up?
	 * @returns {number}
	 */
	calcTextWidth(text, font, round) {
		const w = this.g.CalcTextWidth(text, font);
		return round ? Math.ceil(w) : w;
	}

	/**
	 * @param {string} text
	 * @param {GdiFont} font
	 * @param {boolean=} [round=false] Should the value be rounded up?
	 * @returns {number}
	 */
	 calcTextHeight(text, font, round) {
		const h = this.g.CalcTextHeight(text, font);
		return round ? Math.ceil(h) : h;
	}

	on_mouse_move(x, y) {
		if (x !== this.state.mouse_x || y !== this.state.mouse_y) {
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
			for (let i = controlList.length - 1; i >= 0 && !found; i--) { // Traverse list in reverse order to better handle z-index issues
				if (controlList[i].mouseInThis(x, y)) {
					setHovered(controlList[i]);
					if (mouseDown) {
						controlList[i].mouseDown(x, y);
					}
				}
			}
			if (!found && hoveredControl) {
				hoveredControl.hovered = false;
				hoveredControl = null;
			}
		}
	}

	on_mouse_lbtn_down(x, y) {
		mouseDown = true;
	}

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

	on_char(code) {
		if (activeControl) {
			activeControl.onChar(code);
		}
	}

	on_key_down(vkey) {
		if (activeControl) {
			activeControl.onKey(vkey);
		}
	}

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
class DropDownMenu extends BaseControl {
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {string} label Label which will appear above the text
	 * @param {string[]} labelArray
	 * @param {number=} [activeIndex=-1] Active DropDownMenu value
	 */
	constructor(x, y, label, labelArray, activeIndex) {
		super(x, y, label);
		/** @private */ this.labelArray = labelArray;
		this.activeIndex = activeIndex || -1;
		/** @private @const */ this.padding = scaleForDisplay(5); // The padding between top and label and option and bottom line
		this.labelW = this.calcTextWidth(label, this.font) + this.padding * 4;
		this.optionW = this.calcTextWidth(longestString(this.labelArray), this.font) + this.padding * 4;
		this.w = Math.max(this.labelW, this.optionW);
		/** @private @const */ this.labelHeight = Math.ceil(this.calcTextHeight('Ag', this.font));
		/** @private @const */ this.optionHeight = Math.ceil(this.calcTextHeight('Ag', this.font));
		this.h = this.labelHeight + this.padding * 2; // This.h = this.labelHeight + this.padding + this.optionHeight + this.padding;
		/** @private @const */ this.borderPadding = scaleForDisplay(5);
		/** @private */ this.selectUp = false;
		/** @private */ this.selectUpHeight = (this.optionHeight + this.padding * 2) * this.labelArray.length;  // Height of select up option
		/** @private */ this.selectUpHoveredOption = -1; // When selectUp is visible, which item is hovered
		/** @private {number} */ this.selectUpActiveIndex = -1; // This is the index that is active when the selectUp is toggled

		this.selectedColor = RGB(0, 0, 0);
	}

	get isSelectUp() {
		return this.selectUp;
	}

	set isSelectUp(value) {
		this.selectUp = value;
	}

	set hovered(value) {
		this._hovered = value;
		this.repaint();
	}

	get hovered() {
		return this._hovered;
	}

	/**
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
			gr.FillSolidRect(this.x, this.y, this.w - 1, this.selectUpHeight + this.h, tintColor(col.bg, 10));
			gr.DrawLine(this.x, optionY, this.x + this.w - 1, optionY, 2, shadeColor(col.bg, 20));
			this.labelArray.forEach((option, i) => {
				const isActive = this.activeIndex === i;
				if (isActive || this.selectUpHoveredOption === i) {
					const color = isActive ? col.progressBarFill : shadeColor(col.bg, 10);
					gr.FillSolidRect(this.x, optionY, this.w - 1, optionH, color);
				}
				gr.DrawLine(this.x, optionY, this.x + this.w - 1, optionY, 1, shadeColor(col.bg, 10));
				gr.GdiDrawText(option, this.font, textColor, this.x + this.padding * 2, optionY + this.padding, this.w - this.padding * 4, optionH, StringFormat(0, 0, 4));
				optionY += optionH;
			});
		}
		else { // Line is not visible if select is up
			gr.FillSolidRect(this.x, this.y + this.h - lineHeight, this.w - 1, lineHeight, tintColor(col.bg, 10));
		}
		gr.GdiDrawText(this.label, this.font, textColor, this.x + this.padding * 2, this.y + Math.ceil(this.padding / 2), this.w - this.padding * 2, this.h, StringFormat(1, 1));
	}

	getFirstOptionY() {
		return this.y + this.labelHeight + this.padding * 2;
	}

	repaint() {
		const repaintY = Math.min(this.getFirstOptionY(), this.y);
		window.RepaintRect(this.x - this.borderPadding, repaintY - this.borderPadding + this.borderPadding, this.w + this.borderPadding * 2, this.labelHeight + this.selectUpHeight + this.borderPadding * 3 + this.padding);
	}

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

	doubleClicked(x, y) {
		this.clicked(x, y);
	}

	clearFocus() {
		this.focus = false;
		this.selectUp = false;
		this.repaint();
	}

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

	onKey(vkey) {
		switch (vkey) {
			case VK_ENTER:
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

	destructor() {
		this.labelArray = null;
		super.destructor();
	}
}


//////////////////////////////////
// * CUSTOM MENU STRING INPUT * //
//////////////////////////////////
class StringInput extends BaseControl {
	constructor(id, label, value, x, y, labelWidth, inputWidth) {
		super(x, y, label);
		this.id = id;
		/** @private */ this.h = this.calcTextHeight('Ag', this.font);
		/** @private */ this.padding = scaleForDisplay(3);
		/** @private */ this.lineThickness = scaleForDisplay(2);
		/** @private */ this.inputX = this.x + (displayMetadataGridMenu ? scaleForDisplay(20) : this.h);
		/** @private */ this.value = value;
		/** @private */ this.labelW = labelWidth;
		/** @private */ this.inputW = inputWidth - this.padding * 2 + this.popupFontSize; // Subtract out padding
		/** @constant @private */ this.cursorRefreshInterval = 350; //Ms
		/** @private */ this.timerId = undefined;
		/** @private */ this.showCursor = false;
		/** @private */ this.selEnd = -1;
		/** @private */ this.selAnchor = -1;
		/** @private */ this.cursorPos = 0;
		/** @private */ this.offsetChars = 0; // Number of chars that are not visible in the textbox (scrolled to the left)
	}

	/**
	 * Is a selection active on the text control
	 * @returns {boolean}
	 */
	get hasSelection() {
		return this.selAnchor !== -1;
	}

	/**
	 * @param {GdiGraphics} gr
	 */
	draw(gr) {
		gr.SetTextRenderingHint(TextRenderingHint.AntiAlias);
		const margin = scaleForDisplay(20);
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

	set hovered(value) {
		this._hovered = value;
		this.repaint();
	}

	get hovered() {
		return this._hovered;
	}

	/**
	 * Given an index into the value string returns the x-position, used to determine where to draw the cursor
	 * @private
	 * @param {*} index
	 * @returns {number} X-position of the cursor at that index
	 */
	getCursorX(index) {
		if (index >= this.offsetChars) {
			return this.g.CalcTextWidth(this.value.substr(this.offsetChars, index - this.offsetChars), this.font, true);
		}
		return 0;
	}

	/**
	 * Given an x mouse position returns an index into the value string
	 * @private
	 * @param {number} x Mouse position on x-axis
	 * @returns {number} Index into the value text. 0 is before the first character, value.length is after the last character
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
	 * Calculte how many chars (offsetChars) to *not* draw on the left hand side of the text box
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

	mouseInThis(x, y) {
		return !this.disabled && x >= this.inputX && x <= this.inputX + this.inputW && y >= this.y - this.padding && y <= this.y + this.h + this.padding;
	}

	/**
	 * Remove focus from control, clear cursor, and reset offset chars, then redraw
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
	 * Turns the cursor on and off and repaints the control
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

	updateColors() {
		initCustomTheme();
		updateColorsFromConfig(this.id, this.value);
		initThemeFull = true;
		initTheme();
		this.repaint();
	}

	updateMetadata() {
		updateMetadataGridFromConfig(this.id, this.value, this.value2);
		initMetadataGridMenu();
		this.repaint();
	}

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

	repaint() {
		window.RepaintRect(this.x - 1, this.y - this.padding - 1, this.x + this.labelW + this.inputW + this.padding * 2 + 2, this.h * this.padding * 2 + 2);
	}

	/**
	 * Makes sure index is within the range of 0 - value.length
	 * @private
	 * @param {number} index
	 * @returns {number} clamped value
	 */
	strClamp(index) {
		return Math.min(Math.max(index, 0), this.value.length);
	}

	onKey(vkey) {
		const CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
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
			case VK_BACKSPACE:
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
}


////////////////////////////////////
// * CUSTOM MENU STRING INPUT 2 * //
////////////////////////////////////
class StringInput2 extends BaseControl {
	constructor(id, label, value2, x, y, labelWidth, inputWidth) {
		super(x, y, label);
		this.id = id;
		/** @private */ this.h = this.calcTextHeight('Ag', this.font);
		/** @private */ this.padding = scaleForDisplay(3);
		/** @private */ this.lineThickness = scaleForDisplay(2);
		/** @private */ this.inputX = this.x + this.h + scaleForDisplay(18);
		/** @private */ this.value2 = value2;
		/** @private */ this.labelW = labelWidth;
		/** @private */ this.inputW = inputWidth - this.padding * 2; // Subtract out padding
		/** @constant @private */ this.cursorRefreshInterval = 350; // Ms
		/** @private */ this.timerId = undefined;
		/** @private */ this.showCursor = false;
		/** @private */ this.selEnd = -1;
		/** @private */ this.selAnchor = -1;
		/** @private */ this.cursorPos = 0;
		/** @private */ this.offsetChars = 0; // Number of chars that are not visible in the textbox (scrolled to the left)
	}

	/**
	 * Is a selection active on the text control
	 * @returns {boolean}
	 */
	get hasSelection() {
		return this.selAnchor !== -1;
	}

	/**
	 * @param {GdiGraphics} gr
	 */
	draw(gr) {
		const margin = scaleForDisplay(20);
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


	set hovered(value) {
		this._hovered = value;
		this.repaint();
	}

	get hovered() {
		return this._hovered;
	}

	/**
	 * Given an index into the value string returns the x-position, used to determine where to draw the cursor
	 * @private
	 * @param {*} index
	 * @returns {number} X-position of the cursor at that index
	 */
	getCursorX(index) {
		if (index >= this.offsetChars) {
			return this.g.CalcTextWidth(this.value2.substr(this.offsetChars, index - this.offsetChars), this.font, true);
		}
		return 0;
	}

	/**
	 * Given an x mouse position returns an index into the value string
	 * @private
	 * @param {number} x Mouse position on x-axis
	 * @returns {number} Index into the value text. 0 is before the first character, value.length is after the last character
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
	 * Calculte how many chars (offsetChars) to *not* draw on the left hand side of the text box
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

	mouseInThis(x, y) {
		return !this.disabled && x >= this.inputX && x <= this.inputX + this.inputW && y >= this.y - this.padding && y <= this.y + this.h + this.padding;
	}

	/**
	 * Remove focus from control, clear cursor, and reset offset chars, then redraw
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
	 * Turns the cursor on and off and repaints the control
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

	updateMetadata() {
		updateMetadataGridFromConfig(this.id, this.value, this.value2);
		initMetadataGridMenu();
		this.repaint();
	}

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

	repaint() {
		window.RepaintRect(this.x - 1, this.y - this.padding - 1, this.x + this.labelW + this.inputW + this.padding * 2 + 2, this.h * this.padding * 2 + 2);
	}

	/**
	 * Makes sure index is within the range of 0 - value.length
	 * @private
	 * @param {number} index
	 * @returns {number} clamped value
	 */
	strClamp(index) {
		return Math.min(Math.max(index, 0), this.value2.length);
	}

	onKey(vkey) {
		const CtrlKeyPressed = utils.IsKeyPressed(VK_CONTROL);
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
			case VK_BACKSPACE:
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
}


//////////////////////////////////
// * CUSTOM MENU COLOR PICKER * //
//////////////////////////////////
class ColorPicker extends BaseControl {
	constructor(id, value, x, y) {
		super(x, y);
		this.id = id;
		this.value = value;
		this.colorPickerColor = value;
		this.x = x;
		this.y = y - scaleForDisplay(1);
		this.h = this.calcTextHeight('Ag', this.font) + scaleForDisplay(2);
		this.w = this.h;
	}

	/**
	 * @param {GdiGraphics} gr
	 */
	draw(gr) {
		const lineCol = this.focus ? col.lowerBarArtist : this.hovered ? RGB(150, 150, 150) : RGB(120, 120, 120);
		gr.FillSolidRect(this.x, this.y, this.w, this.h, HEXtoRGB(this.value));
		gr.DrawRect(this.x, this.y, this.w, this.h, scaleForDisplay(2), RGB(255, 255, 255));
		gr.DrawRect(this.x - scaleForDisplay(2), this.y - scaleForDisplay(2), this.w + scaleForDisplay(4), this.h + scaleForDisplay(4), scaleForDisplay(2), lineCol);
	}

	/** If the user has selected a color via input or colorpicker, write color to config and update */
	updateColors() {
		initCustomTheme();
		this.value = RGBFtoHEX(this.colorPickerColor);
		updateColorsFromConfig(this.id, this.value);
		initThemeFull = true;
		initTheme();
		this.repaint();
	}

	repaint() {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}

	mouseInThis(x, y) {
		return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
	}

	clicked(x, y) {
		this.colorPickerColor = utils.ColourPicker(0, HEXtoRGB(this.value));
		this.updateColors();
	}
}


//////////////////////////////////
// * CUSTOM MENU COLOR MARKER * //
//////////////////////////////////
class ColorMarker extends BaseControl {
	constructor(id, value, x, y) {
		super(x, y);
		this.id = id;
		this.value = value;
		this.fontAwesome = font(fontAwesome, this.popupFontSize + 4, 0);
		this.x = x;
		this.y = y - scaleForDisplay(1);
		this.h = this.calcTextHeight('Ag', this.font) + scaleForDisplay(2);
		this.w = this.h;
	}

	draw(gr) {
		const lineCol = this.focus ? col.lowerBarArtist : this.hovered ? RGB(150, 150, 150) : RGB(120, 120, 120);
		gr.DrawRect(this.x - 2, this.y - 2, this.w + 4, this.h + 4, scaleForDisplay(1), lineCol);
		gr.DrawString('\uF0EB', this.fontAwesome, RGB(0, 0, 0), this.x, this.y, this.w, this.h, StringFormat(1, 1, 4));
	}

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

	mouseInThis(x, y) {
		return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
	}

	clicked(x, y) {
		this.colorMarker(this.id, this.value);
	}
}


//////////////////////////
// * CUSTOM MENU INFO * //
//////////////////////////
class Info extends BaseControl {
	constructor(x, y, w, h, text, link) {
		super(x, y, w, h);
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.text = text;
		this.link = link;
	}

	draw(gr) {
		const lightBg =
			new Color(g_pl_colors.bg).brightness + imgBrightness > 285 && (pref.styleBlend || pref.styleBlend2)
			||
			new Color(g_pl_colors.bg).brightness > 150 && !pref.styleBlend && !pref.styleBlend2;

		const textColor = lightBg ? RGB(0, 0, 0) : RGB(255, 255, 255);
		gr.DrawString(this.text, this.font, textColor, this.x, this.y, this.w, this.h, StringFormat(0, 0, 4));
	}

	mouseInThis(x, y) {
		return x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h;
	}

	clicked(x, y) {
		if (this.link) {
			runCmd(this.link);
		}
		window.Repaint();
	}

	doubleClicked(x, y) {
		this.clicked();
	}

	destructor() {
		super.destructor();
	}
}


////////////////////////////////////
// * CUSTOM MENU BUTTON HANDLER * //
////////////////////////////////////
function customMenuButtonHandler(label, labelArray, activeIndex) {
	customThemeMenuCall = true;

	switch (true) {
		// * Custom theme menu - Main, Playlist, Library, Biography
		case displayCustomThemeMenu && label === 'Main' && labelArray[activeIndex] === 'Bg':
			displayPanel('details');
			initCustomThemeMenu(false, 'main_bg');
			break;
		case displayCustomThemeMenu && label === 'Main' && labelArray[activeIndex] === 'Bar':
			displayPanel('details');
			initCustomThemeMenu(false, 'main_bar');
			break;
		case displayCustomThemeMenu && label === 'Main' && labelArray[activeIndex] === 'Bar 2':
			displayPanel('details');
			initCustomThemeMenu(false, 'main_bar2');
			break;
		case displayCustomThemeMenu && label === 'Main' && labelArray[activeIndex] === 'Bar 3':
			displayPanel('details');
			initCustomThemeMenu(false, 'main_bar3');
			break;
		case displayCustomThemeMenu && label === 'Main' && labelArray[activeIndex] === 'Text':
			displayPanel('details');
			initCustomThemeMenu(false, 'main_text');
			break;
		case displayCustomThemeMenu && label === 'Main' && labelArray[activeIndex] === 'Btns':
			displayPanel('details');
			initCustomThemeMenu(false, 'main_btns');
			break;
		case displayCustomThemeMenu && label === 'Main' && labelArray[activeIndex] === 'Btns 2':
			displayPanel('details');
			initCustomThemeMenu(false, 'main_btns2');
			break;
		case displayCustomThemeMenu && label === 'Main' && labelArray[activeIndex] === 'Style':
			displayPanel('details');
			initCustomThemeMenu(false, 'main_style');
			break;

		case displayCustomThemeMenu && label === 'Playlist' && labelArray[activeIndex] === 'Bg':
			displayPanel('playlist');
			initCustomThemeMenu('pl_bg');
			break;
		case displayCustomThemeMenu && label === 'Playlist' && labelArray[activeIndex] === 'Text':
			displayPanel('playlist');
			initCustomThemeMenu('pl_text1');
			break;
		case displayCustomThemeMenu && label === 'Playlist' && labelArray[activeIndex] === 'Text 2':
			displayPanel('playlist');
			initCustomThemeMenu('pl_text2');
			break;
		case displayCustomThemeMenu && label === 'Playlist' && labelArray[activeIndex] === 'Misc':
			displayPanel('playlist');
			initCustomThemeMenu('pl_misc');
			break;
		case displayCustomThemeMenu && label === 'Playlist' && labelArray[activeIndex] === 'Btns':
			displayPanel('playlist');
			initCustomThemeMenu('pl_btns');
			break;

		case displayCustomThemeMenu && label === 'Library' && labelArray[activeIndex] === 'Bg':
			displayPanel('library');
			initCustomThemeMenu(false, false, 'lib_bg');
			break;
		case displayCustomThemeMenu && label === 'Library' && labelArray[activeIndex] === 'Text':
			displayPanel('library');
			initCustomThemeMenu(false, false, 'lib_text');
			break;
		case displayCustomThemeMenu && label === 'Library' && labelArray[activeIndex] === 'Node':
			displayPanel('library');
			initCustomThemeMenu(false, false, 'lib_node');
			break;
		case displayCustomThemeMenu && label === 'Library' && labelArray[activeIndex] === 'Btns':
			displayPanel('library');
			initCustomThemeMenu(false, false, 'lib_btns');
			break;

		case displayCustomThemeMenu && label === 'Biography' && labelArray[activeIndex] === 'Bg':
			displayPanel('biography');
			initCustomThemeMenu(false, false, false, 'bio_bg');
			break;
		case displayCustomThemeMenu && label === 'Biography' && labelArray[activeIndex] === 'Text':
			displayPanel('biography');
			initCustomThemeMenu(false, false, false, 'bio_text');
			break;
		case displayCustomThemeMenu && label === 'Biography' && labelArray[activeIndex] === 'Misc':
			displayPanel('biography');
			initCustomThemeMenu(false, false, false, 'bio_misc');
			break;
		case displayCustomThemeMenu && label === 'Biography' && labelArray[activeIndex] === 'Btns':
			displayPanel('biography');
			initCustomThemeMenu(false, false, false, 'bio_btns');
			break;

		// * Custom theme menu - Options
		case displayCustomThemeMenu && labelArray[activeIndex] === 'Info' && displayCustomThemeMenu:
			initCustomThemeMenu(false, false, false, false, true);
			window.Repaint();
			break;
		case displayCustomThemeMenu && labelArray[activeIndex] === 'Theme 01':
			pref.theme = 'custom01';
			initCustomTheme();
			initTheme();
			initCustomThemeMenu('pl_bg');
			break;
		case displayCustomThemeMenu && labelArray[activeIndex] === 'Theme 02':
			pref.theme = 'custom02';
			initCustomTheme();
			initTheme();
			initCustomThemeMenu('pl_bg');
			break;
		case displayCustomThemeMenu && labelArray[activeIndex] === 'Theme 03':
			pref.theme = 'custom03';
			initCustomTheme();
			initTheme();
			initCustomThemeMenu('pl_bg');
			break;
		case displayCustomThemeMenu && labelArray[activeIndex] === 'Theme 04':
			pref.theme = 'custom04';
			initCustomTheme();
			initTheme();
			initCustomThemeMenu('pl_bg');
			break;
		case displayCustomThemeMenu && labelArray[activeIndex] === 'Theme 05':
			pref.theme = 'custom05';
			initCustomTheme();
			initTheme();
			initCustomThemeMenu('pl_bg');
			break;
		case displayCustomThemeMenu && labelArray[activeIndex] === 'Theme 06':
			pref.theme = 'custom06';
			initCustomTheme();
			initTheme();
			initCustomThemeMenu('pl_bg');
			break;
		case displayCustomThemeMenu && labelArray[activeIndex] === 'Theme 07':
			pref.theme = 'custom07';
			initCustomTheme();
			initTheme();
			initCustomThemeMenu('pl_bg');
			break;
		case displayCustomThemeMenu && labelArray[activeIndex] === 'Theme 08':
			pref.theme = 'custom08';
			initCustomTheme();
			initTheme();
			initCustomThemeMenu('pl_bg');
			break;
		case displayCustomThemeMenu && labelArray[activeIndex] === 'Theme 09':
			pref.theme = 'custom09';
			initCustomTheme();
			initTheme();
			initCustomThemeMenu('pl_bg');
			break;
		case displayCustomThemeMenu && labelArray[activeIndex] === 'Theme 10':
			pref.theme = 'custom10';
			initCustomTheme();
			initTheme();
			initCustomThemeMenu('pl_bg');
			break;
		case displayCustomThemeMenu && labelArray[activeIndex] === 'Rename':
			inputBox('renameCustomTheme');
			break;
		case displayCustomThemeMenu && labelArray[activeIndex] === 'Reset':
			initCustomTheme();
			resetCustomColors();
			initTheme();
			initCustomThemeMenu('pl_bg');
			break;

		// * Metadatagrid menu - Page 1, Page 2, Page 3, Page 4
		case displayMetadataGridMenu && label === 'Page 1':
			activeControl.isSelectUp = false;
			initMetadataGridMenu(1);
			break;
		case displayMetadataGridMenu && label === 'Page 2':
			activeControl.isSelectUp = false;
			initMetadataGridMenu(2);
			break;
		case displayMetadataGridMenu && label === 'Page 3':
			activeControl.isSelectUp = false;
			initMetadataGridMenu(3);
			break;
		case displayMetadataGridMenu && label === 'Page 4':
			activeControl.isSelectUp = false;
			initMetadataGridMenu(4);
			break;

		// * Metadatagrid menu - Options
		case displayMetadataGridMenu && labelArray[activeIndex] === 'Info':
			initMetadataGridMenu(false, true);
			break;
		case displayMetadataGridMenu && labelArray[activeIndex] === 'Reset':
			resetMetadataGrid();
			initMetadataGridMenu(1);
			break;

		// * Close
		case activeControl.closeBtn:
			activeControl.isSelectUp = false;
			if (displayCustomThemeMenu) displayPanel('playlist');
			displayCustomThemeMenu = false;
			displayMetadataGridMenu = false;
			break;
	}
}


///////////////////////////
// * CUSTOM THEME MENU * //
///////////////////////////
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


function initCustomThemeMenu(playlist_section, main_section, library_section, biography_section, info) {
	if (pref.libraryLayout   === 'full') { pref.libraryLayout   = 'normal'; setLibrarySize(); }
	if (pref.biographyLayout === 'full') { pref.biographyLayout = 'normal'; setBiographySize(); }
	if (pref.lyricsLayout    === 'full') { pref.lyricsLayout    = 'normal'; resizeArtwork(true); }

	controlList = [];

	const margin = scaleForDisplay(40);
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


function reinitCustomThemeMenu() {
	if (displayCustomThemeMenu) {
		if (displayPlaylist)    initCustomThemeMenu('pl_bg');
		if (displayDetails)     initCustomThemeMenu(false, 'main_bg');
		if (displayLibrary)     initCustomThemeMenu(false, false, 'lib_bg');
		if (displayBiography)   initCustomThemeMenu(false, false, false, 'bio_bg');
		if (pref.displayLyrics) initCustomThemeMenu(false, 'main_text');
	}
}


function customMainColors(x, y, w, h, main_section) {
	const popupFontSize = pref.layout === 'compact' ? pref.popupFontSize_compact : pref.layout === 'artwork' ? pref.popupFontSize_artwork : pref.popupFontSize_default;
	const margin = scaleForDisplay(20);
	const labelW = scaleForDisplay(300) + popupFontSize;
	const inputW = scaleForDisplay(80)  + popupFontSize;
	const markerX = x + margin + inputW + (popupFontSize * (is_4k ? 0.25 : 0.5)) - scaleForDisplay(2);

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


function customPlaylistColors(x, y, w, h, playlist_section) {
	const popupFontSize = pref.layout === 'compact' ? pref.popupFontSize_compact : pref.layout === 'artwork' ? pref.popupFontSize_artwork : pref.popupFontSize_default;
	const margin = scaleForDisplay(20);
	const labelW = scaleForDisplay(300) + popupFontSize;
	const inputW = scaleForDisplay(80)  + popupFontSize;
	const markerX = x + margin + inputW + (popupFontSize * (is_4k ? 0.25 : 0.5)) - scaleForDisplay(2);

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
				controlList.push(new StringInput('pl_misc_04', 'g_pl_colors.row_selection_frame', customColor.g_pl_colors_row_selection_frame, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_misc_04', customColor.g_pl_colors_row_selection_frame, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_misc_04', customColor.g_pl_colors_row_selection_frame, markerX, y, () => {}));
				y += plColors.h + margin;
				controlList.push(new StringInput('pl_misc_05', 'g_pl_colors.row_rating_color', customColor.g_pl_colors_row_rating_color, x, y, labelW, inputW));
				controlList.push(new ColorPicker('pl_misc_05', customColor.g_pl_colors_row_rating_color, x + 2, y, () => {}));
				controlList.push(new ColorMarker('pl_misc_05', customColor.g_pl_colors_row_rating_color, markerX, y, () => {}));
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


function customLibraryColors(x, y, w, h, library_section) {
	const popupFontSize = pref.layout === 'compact' ? pref.popupFontSize_compact : pref.layout === 'artwork' ? pref.popupFontSize_artwork : pref.popupFontSize_default;
	const margin = scaleForDisplay(20);
	const labelW = scaleForDisplay(300) + popupFontSize;
	const inputW = scaleForDisplay(80)  + popupFontSize;
	const markerX = x + margin + inputW + (popupFontSize * (is_4k ? 0.25 : 0.5)) - scaleForDisplay(2);

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


function customBiographyColors(x, y, w, h, biography_section) {
	const popupFontSize = pref.layout === 'compact' ? pref.popupFontSize_compact : pref.layout === 'artwork' ? pref.popupFontSize_artwork : pref.popupFontSize_default;
	const margin = scaleForDisplay(20);
	const labelW = scaleForDisplay(300) + popupFontSize;
	const inputW = scaleForDisplay(80)  + popupFontSize;
	const markerX = x + margin + inputW + (popupFontSize * (is_4k ? 0.25 : 0.5)) - scaleForDisplay(2);

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


function customThemeInfo(x, y, w, h, link) {
	link = 'https://github.com/TT-ReBORN/Georgia-ReBORN/discussions/99';
	const margin = scaleForDisplay(20);
	const maxWidth = (ww * 0.5) - (margin * 4);

	const text = 'You can modify the main colors, the playlist colors, the library colors and the biography colors. First select a custom theme slot in the drop down menu "Options" that you want to modify. You can either select the color via the color picker or paste a HEX value in the input field.\nIt will apply all changes in real time and saves it automatically in the georgia-reborn-custom.jsonc config file. Each color has a name that you can also find in the georgia-reborn-custom.jsonc config file and modify it there.\n\nTo reset the colors to the default ones, select the "Reset" option from the drop down menu.\n\nTip: Download the resource pack from the Github page to open the custom theme template and modify colors in Photoshop or Gimp.\nIf you are happy with the result, just copy and paste the HEX values.\n\nYou can showcase your custom themes and share your configs here: Click on this text.';

	const height = measureString(text, ft.popup, 0, 0, maxWidth, wh).Height;

	const info = new Info(x, y, maxWidth, height, text, link);
	controlList.push(info);
}


function updateColorsFromConfig(id, value) {
	switch (id) {
		// * MAIN - BG * //
		case 'main_bg_01': customColor.col_bg = value; break;
		case 'main_bg_02': customColor.col_popupBg = value; break;
		case 'main_bg_03': customColor.col_detailsBg = value; break;
		case 'main_bg_04': customColor.col_shadow = value; break;
		case 'main_bg_05': customColor.col_discArtShadow = value; break;
		case 'main_bg_06': customColor.col_noAlbumArtStub = value; break;
		// * MAIN - BAR * //
		case 'main_bar_01': customColor.col_timelineAdded = value; break;
		case 'main_bar_02': customColor.col_timelinePlayed = value; break;
		case 'main_bar_03': customColor.col_timelineUnplayed = value; break;
		case 'main_bar_04': customColor.col_timelineFrame = value; break;
		case 'main_bar_05': customColor.col_progressBar = value; break;
		case 'main_bar_06': customColor.col_progressBarStreaming = value; break;
		case 'main_bar_07': customColor.col_progressBarFrame = value; break;
		case 'main_bar_08': customColor.col_progressBarFill = value; break;
		case 'main_bar_09': customColor.col_volumeBar = value; break;
		case 'main_bar_10': customColor.col_volumeBarFrame = value; break;
		case 'main_bar_11': customColor.col_volumeBarFill = value; break;
		// * MAIN - BAR 2 * //
		case 'main_bar_12': customColor.col_peakmeterBarProg = value; break;
		case 'main_bar_13': customColor.col_peakmeterBarProgFill = value; break;
		case 'main_bar_14': customColor.col_peakmeterBarFillTop = value; break;
		case 'main_bar_15': customColor.col_peakmeterBarFillMiddle = value; break;
		case 'main_bar_16': customColor.col_peakmeterBarFillBack = value; break;
		case 'main_bar_17': customColor.col_peakmeterBarVertProgFill = value; break;
		case 'main_bar_18': customColor.col_peakmeterBarVertFill = value; break;
		case 'main_bar_19': customColor.col_peakmeterBarVertFillPeaks = value; break;
		// * MAIN - BAR 3 * //
		case 'main_bar_20': customColor.col_waveformBarFillFront = value; break;
		case 'main_bar_21': customColor.col_waveformBarFillBack = value; break;
		case 'main_bar_22': customColor.col_waveformBarFillPreFront = value; break;
		case 'main_bar_23': customColor.col_waveformBarFillPreBack = value; break;
		case 'main_bar_24': customColor.col_waveformBarIndicator = value; break;
		// * MAIN - TEXT * //
		case 'main_text_01': customColor.col_lowerBarArtist = value; break;
		case 'main_text_02': customColor.col_lowerBarTitle = value; break;
		case 'main_text_03': customColor.col_lowerBarTime = value; break;
		case 'main_text_04': customColor.col_lowerBarLength = value; break;
		case 'main_text_05': customColor.col_detailsText = value; break;
		case 'main_text_06': customColor.col_detailsRating = value; break;
		case 'main_text_08': customColor.col_popupText = value; break;
		case 'main_text_09': customColor.col_lyricsNormal = value; break;
		case 'main_text_10': customColor.col_lyricsHighlight = value; break;
		case 'main_text_11': customColor.col_lyricsShadow = value; break;
		// * MAIN - BTNS * //
		case 'main_btns_01': customColor.col_menuBgColor = value; break;
		case 'main_btns_02': customColor.col_menuStyleBg = value; break;
		case 'main_btns_03': customColor.col_menuRectStyleEmbossTop = value; break;
		case 'main_btns_04': customColor.col_menuRectStyleEmbossBottom = value; break;
		case 'main_btns_05': customColor.col_menuRectNormal = value; break;
		case 'main_btns_06': customColor.col_menuRectHovered = value; break;
		case 'main_btns_07': customColor.col_menuRectDown = value; break;
		case 'main_btns_08': customColor.col_menuTextNormal = value; break;
		case 'main_btns_09': customColor.col_menuTextHovered = value; break;
		case 'main_btns_10': customColor.col_menuTextDown = value; break;
		// * MAIN - BTNS 2 * //
		case 'main_btns_11': customColor.col_transportEllipseBg = value; break;
		case 'main_btns_12': customColor.col_transportEllipseNormal = value; break;
		case 'main_btns_13': customColor.col_transportEllipseHovered = value; break;
		case 'main_btns_14': customColor.col_transportEllipseDown = value; break;
		case 'main_btns_15': customColor.col_transportStyleBg = value; break;
		case 'main_btns_16': customColor.col_transportStyleTop = value; break;
		case 'main_btns_17': customColor.col_transportStyleBottom = value; break;
		case 'main_btns_18': customColor.col_transportIconNormal = value; break;
		case 'main_btns_19': customColor.col_transportIconHovered = value; break;
		case 'main_btns_20': customColor.col_transportIconDown = value; break;
		// * MAIN - STYLE * //
		case 'main_style_01': customColor.col_styleBevel = value; break;
		case 'main_style_02': customColor.col_styleGradient = value; break;
		case 'main_style_03': customColor.col_styleGradient2 = value; break;
		case 'main_style_04': customColor.col_styleProgressBar = value; break;
		case 'main_style_05': customColor.col_styleProgressBarLineTop = value; break;
		case 'main_style_06': customColor.col_styleProgressBarLineBottom = value; break;
		case 'main_style_07': customColor.col_styleProgressBarFill = value; break;
		case 'main_style_08': customColor.col_styleVolumeBar = value; break;
		case 'main_style_09': customColor.col_styleVolumeBarFill = value; break;

		// * PLAYLIST - BG * //
		case 'pl_bg_01': customColor.g_pl_colors_bg = value; break;
		case 'pl_bg_02': customColor.g_pl_colors_header_nowplaying_bg = value; break;
		case 'pl_bg_03': customColor.g_pl_colors_header_sideMarker = value; break;
		case 'pl_bg_04': customColor.g_pl_colors_row_nowplaying_bg = value; break;
		case 'pl_bg_05': customColor.g_pl_colors_row_stripes_bg = value; break;
		case 'pl_bg_06': customColor.g_pl_colors_row_sideMarker = value; break;
		// * PLAYLIST - TEXT * //
		case 'pl_text_01': customColor.g_pl_colors_plman_text_normal = value; break;
		case 'pl_text_02': customColor.g_pl_colors_plman_text_hovered = value; break;
		case 'pl_text_03': customColor.g_pl_colors_plman_text_pressed = value; break;
		case 'pl_text_04': customColor.g_pl_colors_header_artist_normal = value; break;
		case 'pl_text_05': customColor.g_pl_colors_header_artist_playing = value; break;
		case 'pl_text_06': customColor.g_pl_colors_header_album_normal = value; break;
		case 'pl_text_07': customColor.g_pl_colors_header_album_playing = value; break;
		case 'pl_text_08': customColor.g_pl_colors_header_info_normal = value; break;
		case 'pl_text_09': customColor.g_pl_colors_header_info_playing = value; break;
		case 'pl_text_10': customColor.g_pl_colors_header_date_normal = value; break;
		case 'pl_text_11': customColor.g_pl_colors_header_date_playing = value; break;
		case 'pl_text_12': customColor.g_pl_colors_row_title_normal = value; break;
		case 'pl_text_13': customColor.g_pl_colors_row_title_playing = value; break;
		case 'pl_text_14': customColor.g_pl_colors_row_title_selected = value; break;
		case 'pl_text_15': customColor.g_pl_colors_row_title_hovered = value; break;
		// * PLAYLIST - MISC * //
		case 'pl_misc_01': customColor.g_pl_colors_header_line_normal = value; break;
		case 'pl_misc_02': customColor.g_pl_colors_header_line_playing = value; break;
		case 'pl_misc_03': customColor.g_pl_colors_row_disc_subheader_line = value; break;
		case 'pl_misc_04': customColor.g_pl_colors_row_selection_frame = value; break;
		case 'pl_misc_05': customColor.g_pl_colors_row_rating_color = value; break;
		// * PLAYLIST - BTNS * //
		case 'pl_btns_01': customColor.g_pl_colors_sbar_btn_normal = value; break;
		case 'pl_btns_02': customColor.g_pl_colors_sbar_btn_hovered = value; break;
		case 'pl_btns_03': customColor.g_pl_colors_sbar_thumb_normal = value; break;
		case 'pl_btns_04': customColor.g_pl_colors_sbar_thumb_hovered = value; break;
		case 'pl_btns_05': customColor.g_pl_colors_sbar_thumb_drag = value; break;

		// * LIBRARY - BG * //
		case 'lib_bg_01': customColor.ui_col_bg = value; break;
		case 'lib_bg_02': customColor.ui_col_rowStripes = value; break;
		case 'lib_bg_03': customColor.ui_col_nowPlayingBg = value; break;
		case 'lib_bg_04': customColor.ui_col_sideMarker = value; break;
		case 'lib_bg_05': customColor.ui_col_selectionFrame = value; break;
		case 'lib_bg_06': customColor.ui_col_selectionFrame2 = value; break;
		case 'lib_bg_07': customColor.ui_col_hoverFrame = value; break;
		// * LIBRARY - TEXT * //
		case 'lib_text_01': customColor.ui_col_text = value; break;
		case 'lib_text_02': customColor.ui_col_text_h = value; break;
		case 'lib_text_03': customColor.ui_col_text_nowp = value; break;
		case 'lib_text_04': customColor.ui_col_textSel = value; break;
		case 'lib_text_05': customColor.ui_col_txt = value; break;
		case 'lib_text_06': customColor.ui_col_txt_h = value; break;
		case 'lib_text_07': customColor.ui_col_txt_box = value; break;
		case 'lib_text_08': customColor.ui_col_search = value; break;
		// * LIBRARY - NODE * //
		case 'lib_node_01': customColor.ui_col_iconPlus = value; break;
		case 'lib_node_02': customColor.ui_col_iconPlus_h = value; break;
		case 'lib_node_03': customColor.ui_col_iconPlus_sel = value; break;
		case 'lib_node_04': customColor.ui_col_iconPlusBg = value; break;
		case 'lib_node_05': customColor.ui_col_iconMinus_e = value; break;
		case 'lib_node_06': customColor.ui_col_iconMinus_c = value; break;
		case 'lib_node_07': customColor.ui_col_iconMinus_h = value; break;
		// * LIBRARY - BTNS * //
		case 'lib_btns_01': customColor.ui_col_searchBtn = value; break;
		case 'lib_btns_02': customColor.ui_col_crossBtn = value; break;
		case 'lib_btns_03': customColor.ui_col_filterBtn = value; break;
		case 'lib_btns_04': customColor.ui_col_settingsBtn = value; break;
		case 'lib_btns_05': customColor.ui_col_line = value; break;
		case 'lib_btns_06': customColor.ui_col_s_line = value; break;
		case 'lib_btns_07': customColor.ui_col_sbarBtns = value; break;
		case 'lib_btns_08': customColor.ui_col_sbarNormal = value; break;
		case 'lib_btns_09': customColor.ui_col_sbarHovered = value; break;
		case 'lib_btns_10': customColor.ui_col_sbarDrag = value; break;

		// * BIOGRAPHY - BG * //
		case 'bio_bg_01': customColor.uiBio_col_bg = value; break;
		case 'bio_bg_02': customColor.uiBio_col_rowStripes = value; break;
		case 'bio_bg_03': customColor.uiBio_col_noPhotoStubBg = value; break;
		// * BIOGRAPHY - TEXT * //
		case 'bio_text_01': customColor.uiBio_col_headingText = value; break;
		case 'bio_text_02': customColor.uiBio_col_source = value; break;
		case 'bio_text_03': customColor.uiBio_col_accent = value; break;
		case 'bio_text_04': customColor.uiBio_col_summary = value; break;
		case 'bio_text_05': customColor.uiBio_col_text = value; break;
		case 'bio_text_06': customColor.uiBio_col_lyricsNormal = value; break;
		case 'bio_text_07': customColor.uiBio_col_lyricsHighlight = value; break;
		case 'bio_text_08': customColor.uiBio_col_noPhotoStubText = value; break;
		// * BIOGRAPHY - MISC * //
		case 'bio_misc_01': customColor.uiBio_col_bottomLine = value; break;
		case 'bio_misc_02': customColor.uiBio_col_centerLine = value; break;
		case 'bio_misc_03': customColor.uiBio_col_sectionLine = value; break;
		// * BIOGRAPHY - BTNS * //
		case 'bio_btns_01': customColor.uiBio_col_sbarBtns = value; break;
		case 'bio_btns_02': customColor.uiBio_col_sbarNormal = value; break;
		case 'bio_btns_03': customColor.uiBio_col_sbarHovered = value; break;
		case 'bio_btns_04': customColor.uiBio_col_sbarDrag = value; break;
	}
	// Update values of controls
	for (const color of controlList) {
		if (color.id === id) {
			color.value = value;
		}
	}
}


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


function initMetadataGridMenu(page, info) {
	controlList = [];

	const margin = scaleForDisplay(40);
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


function metadataGridPage(x, y, w, h, page) {
	const prefs = config.readConfiguration();
	const popupFontSize = pref.layout === 'compact' ? pref.popupFontSize_compact : pref.layout === 'artwork' ? pref.popupFontSize_artwork : pref.popupFontSize_default;
	const margin = scaleForDisplay(20);
	const inputW = scaleForDisplay(80) + popupFontSize;
	const start = page === 1 ? 0 : page === 2 ?  8 : page === 3 ? 16 : page === 4 ? 24 : 0;
	const end   = page === 1 ? 8 : page === 2 ? 16 : page === 3 ? 24 : page === 4 ? 32 : 8;

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


function metadataGridInfo(x, y, w, h, link) {
	link = 'https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Title_Formatting_Reference';
	const margin = scaleForDisplay(20);
	const maxWidth = ww * 0.66 - scaleForDisplay(100);

	const text = 'You can modify existing entries or add your new custom patterns.\nTo confirm changes, press "Enter" or paste a new pattern into the input field.\nAll changes will be applied in real time and automatically saved in the\ngeorgia-reborn-config.jsonc file where it can be also manually modified.\n\nTo reset the metadata grid to its default patterns, select the "Reset" option\nfrom the drop down menu.\n\nTip: To reorder the entries, first copy the ones you want to change in your\nnotepad and paste the label and pattern afterwards.\n\nNote: Not all entries will be displayed if the height of the player size is too small,\nchange to a larger player size if desired.\n\nYou can learn more about patterns here, click on this text.';

	const height = measureString(text, ft.popup, 0, 0, maxWidth, wh).Height;

	const info = new Info(x, y, maxWidth, height, text, link);
	controlList.push(info);
}


function updateMetadataGridFromConfig(id, value1, value2) {
	const prefs = config.readConfiguration();
	const metadataGrid = prefs.metadataGrid;
	const index = metadataGrid.findIndex(x => x.label === id);
	if (index > -1) {
		if (value1) metadataGrid[index].label = value1;
		else if (value2) metadataGrid[index].val = value2;
	}
	config.updateConfigObjValues('metadataGrid', metadataGrid, true);
	updateMetadataGrid();
	window.Repaint();
}


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
