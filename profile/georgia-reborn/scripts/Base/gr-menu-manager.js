/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Menu Manager                             * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    08-01-2026                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////
// * MAIN MENU * //
///////////////////
/**
 * A class that creates menus, submenus, radio groups, toggle items, etc.
 */
class Menu {
	/**
	 * Creates the `Menu` instance.
	 * @param {string} [title] - The title of the menu item. It is optional and defaults to an empty string if not provided.
	 */
	constructor(title = '') {
		if (!Menu.menuItemIndex) {
			/** @static @type {number} The starting index for the menu items. */
			Menu.menuStartIndex = 100;
			/** @static @type {number} The auto-incrementing index for each menu item created. */
			Menu.menuItemIndex = Menu.menuStartIndex;
			/** @static @type {Array<Function>} The callback functions for the menu items. */
			Menu.menuCallbacks = [];
			/** @static @type {Array<any>} The variables related to the menu items. */
			Menu.menuVariables = [];
		}
		Menu.menuItemIndex++;

		/** @private @type {PopupMenu} The instance of the popup menu created for this menu. */
		this.menu = window.CreatePopupMenu();
		/** @private @type {string} The title of the menu item. */
		this.title = title;
		/** @private @type {boolean} Indicates if the menu is a system menu. */
		this.systemMenu = false;
		/** @private @type {LibMenuManager|null} A reference to the menu manager handling this menu, if any. */
		this.menuManager = null;
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Adds a menu item with a label, checked state, callback function, and optional variable to a menu.
	 * @param {string} label - The text that will be displayed for the menu item.
	 * @param {boolean} checked - Whether the menu item should be checked.
	 * @param {*} variable - A variable which will be passed to callback when item is clicked.
	 * @param {Function} callback - A function that will be executed when the menu item is clicked.
	 * @param {boolean} disabled - Whether the item should be disabled or not.
	 * @private
	 */
	_addItemWithVariable(label, checked, variable, callback, disabled) {
		this.menu.AppendMenuItem(MenuFlag.String | (disabled ? MenuFlag.Disabled | MenuFlag.Grayed : 0), Menu.menuItemIndex, label);
		this.menu.CheckMenuItem(Menu.menuItemIndex, checked);
		Menu.menuCallbacks[Menu.menuItemIndex] = callback;
		if (typeof variable !== 'undefined') {
			Menu.menuVariables[Menu.menuItemIndex] = variable;
		}
		Menu.menuItemIndex++;
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Creates the default foobar menu corresponding to `name`.
	 * @param {string} name - The name of the menu.
	 */
	initFoobarMenu(name) {
		if (!name) return;
		if (name === 'Media') name = 'Library'; // Remap `Media` button to foobar's `Library`
		this.systemMenu = true;
		this.menuManager = fb.CreateMainMenuManager();
		this.menuManager.Init(name);
		this.menuManager.BuildMenu(this.menu, 1, 1000);
	}

	/**
	 * Adds an item with a label, checked status, callback function, and optional disabled status.
	 * @param {string} label - The label for the item.
	 * @param {boolean} checked - Whether the menu item should be checked.
	 * @param {Function} callback - A function that will be executed when the item is clicked.
	 * @param {boolean} [disabled] - Whether the item should be disabled or not.
	 */
	addItem(label, checked, callback, disabled = false) {
		this._addItemWithVariable(label, checked, undefined, callback, disabled);
	}

	/**
	 * Adds a toggle item to a list with a label, properties object, property name, callback function, and disabled state.
	 * @param {string} label - The label for the item.
	 * @param {object} propertiesObj - An object which contains propertyName.
	 * @param {string} propertyName - The name of the property to toggle on/off.
	 * @param {?Function} callback - A function that will be executed when the item is clicked.
	 * @param {?boolean} [disabled] - Whether the item should be disabled or not.
	 */
	addToggleItem(label, propertiesObj, propertyName, callback = () => { }, disabled = false) {
		this.addItem(label, propertiesObj[propertyName], () => {
			propertiesObj[propertyName] = !propertiesObj[propertyName];
			if (callback) {
				callback();
			}
		}, disabled);
	}

	/**
	 * Creates a set of toggled items and checks the value specified.
	 * @param {string[]} labels - The label for each item.
	 * @param {*} selectedValues - The value of the item to be checked.
	 * @param {*[]} variables - An array of values which correspond to each entry.
	 * @param {Function} callback - A function that will be executed when the item is clicked.
	 * @param {boolean} [disabled] - Whether the item should be disabled or not.
	 * @param {boolean} [disableCheckMarking] - Whether the check marking should be disabled or not.
	 * @param {number[]} [separator] - Indices after which a separator should be added.
	 */
	addToggleItems(labels, selectedValues, variables, callback = () => { }, disabled = false, disableCheckMarking = false, separator = []) {
		for (let i = 0; i < labels.length; i++) {
			this.menu.AppendMenuItem(MenuFlag.String | (disabled ? MenuFlag.Disabled | MenuFlag.Grayed : 0), Menu.menuItemIndex, labels[i]);
			Menu.menuCallbacks[Menu.menuItemIndex] = callback;
			Menu.menuVariables[Menu.menuItemIndex] = variables[i];
			if (!disableCheckMarking && selectedValues.includes(variables[i])) {
				this.menu.CheckMenuItem(Menu.menuItemIndex, true);
			}
			Menu.menuItemIndex++;
			if (separator.includes(i)) {
				this.menu.AppendMenuSeparator();
			}
		}
	}

	/**
	 * Creates a set of radio items and checks the value specified.
	 * @param {string[]} labels - The label for each radio item.
	 * @param {*} selectedValue - The value of the radio item to be checked.
	 * @param {*[]} variables - An array of values which correspond to each radio entry.
	 * @param {Function} callback - A function that will be executed when the item is clicked.
	 * @param {boolean} [disabled] - Whether the item should be disabled or not.
	 * @param {boolean} [disableCheckMarking] - Whether the radio check marking should be disabled or not.
	 * @param {number[]} [separator] - Indices after which a separator should be added.
	 */
	addRadioItems(labels, selectedValue, variables, callback = () => { }, disabled = false, disableCheckMarking = false, separator = []) {
		const startIndex = Menu.menuItemIndex;
		let selectedIndex;
		for (let i = 0; i < labels.length; i++) {
			this.menu.AppendMenuItem(MenuFlag.String | (disabled ? MenuFlag.Disabled | MenuFlag.Grayed : 0), Menu.menuItemIndex, labels[i]);
			Menu.menuCallbacks[Menu.menuItemIndex] = callback;
			Menu.menuVariables[Menu.menuItemIndex] = variables[i];
			if (selectedValue === variables[i]) {
				selectedIndex = Menu.menuItemIndex;
			}
			Menu.menuItemIndex++;
			if (separator.includes(i)) {
				this.menu.AppendMenuSeparator();
			}
		}
		if (!disableCheckMarking && selectedIndex) {
			this.menu.CheckMenuRadioItem(startIndex, Menu.menuItemIndex - 1, selectedIndex);
		}
	}

	/**
	 * Creates a submenu consisting of radio items.
	 * @param {string} subMenuName - The name of the sub menu.
	 * @param {string[]} labels - The label for each radio item.
	 * @param {*} selectedValue - The value of the radio item to be checked.
	 * @param {*[]} variables - An array of values which correspond to each radio entry.
	 * @param {Function} callback - A function that will be executed when the menu item is clicked.
	 * @param {boolean} [disabled] - Whether the item should be disabled or not.
	 * @param {boolean} [disableCheckMarking] - Whether the radio check marking should be disabled or not.
	 * @param {number[]} [separator] - Indices after which a separator should be added.
	 */
	createRadioSubMenu(subMenuName, labels, selectedValue, variables, callback, disabled = false, disableCheckMarking = false, separator = []) {
		const subMenu = new Menu(subMenuName);
		subMenu.addRadioItems(labels, selectedValue, variables, callback, disabled, disableCheckMarking, separator);
		subMenu.appendTo(this, disabled);
	}

	/**
	 * Adds a separator to the menu.
	 */
	addSeparator() {
		this.menu.AppendMenuSeparator();
	}

	/**
	 * Appends a menu to a parent menu.
	 * @param {Menu} parentMenu - The menu to append the submenu to.
	 * @param {boolean} [disabled] - Whether the menu items should be disabled or not.
	 */
	appendTo(parentMenu, disabled = false) {
		this.menu.AppendTo(parentMenu.menu, MenuFlag.String | (disabled ? MenuFlag.Disabled | MenuFlag.Grayed : 0), this.title);
	}

	/**
	 * Handles callback and automatically disposes the menu.
	 * @param {number} idx - The value of the menu item's callback to call. Comes from menu.trackPopupMenu(x, y).
	 */
	doCallback(idx) {
		if (idx > Menu.menuStartIndex && Menu.menuCallbacks[idx]) {
			Menu.menuCallbacks[idx](Menu.menuVariables[idx]);
		} else if (this.systemMenu && idx) {
			this.menuManager.ExecuteByID(idx - 1);
			this.menuManager = null;
		}
		this.menu = null;

		// Reset static properties as menu is about to be destroyed
		Menu.menuCallbacks = [];
		Menu.menuVariables = [];
		Menu.menuItemIndex = Menu.menuStartIndex;
	}

	/**
	 * Tracks a popup menu at the given coordinates and returns the index of the clicked menu item.
	 * @param {number} x - The x-coordinate where the menu will be displayed.
	 * @param {number} y - The y-coordinate where the menu will be displayed.
	 * @returns {number} The index of the menu item clicked on.
	 */
	trackPopupMenu(x, y) {
		return this.menu.TrackPopupMenu(x, y);
	}
	// #endregion
}


/////////////////////////////
// * CONTEXT BASE OBJECT * //
/////////////////////////////
/**
 * A class that represents the base object for creating context menus.
 */
class ContextBaseObject {
	/**
	 * Creates the `ContextBaseObject` instance.
	 * @param {string} text_arg - The text value that will be assigned to the `text` property of the object.
	 */
	constructor(text_arg) {
		/** @protected @constant {string} */
		this.text = text_arg;
		/** @protected @type {?number} */
		this.idx = undefined;
	}

	// * PROTECTED METHODS * //
	// #region PROTECTED METHODS
	/**
	 * Initializes the menu with a given parent menu context. This should set up any necessary
	 * state or sub-menus that are required for the menu to function properly when it is shown.
	 * This method must be implemented by subclasses to handle their specific initialization logic.
	 * @abstract
	 * @param {ContextMenu} parent_menu - The parent of the menu being initialized.
	 * @protected
	 */
	initMenu(parent_menu) {
		throw new LogicError('initMenu not implemented');
	}

	/**
	 * Initializes menu items starting at the given index. It's used to populate the menu
	 * with options or commands starting at a specific point in the menu structure. The method
	 * should return the index after the last initialized item, allowing for sequential menu
	 * initialization. This method must be implemented by subclasses to handle their specific
	 * menu item initialization logic.
	 * @abstract
	 * @param {number} start_idx - The index at which the menu should start initializing items.
	 * @returns {number} The index after the last initialized menu item (end_idx).
	 * @protected
	 */
	initMenuIndex(start_idx) {
		throw new LogicError('initMenuIndex not implemented');
	}

	/**
	 * Executes the menu option corresponding to the given index. This method is responsible
	 * for handling the action that should be taken when a user selects a menu item. Depending
	 * on the menu option, this may involve running a command, displaying a submenu, or other
	 * actions. This method must be implemented by subclasses to handle the execution logic
	 * for their specific menu options.
	 * @abstract
	 * @param {number} idx - The index of the menu option that needs to be executed.
	 * @returns {boolean} True if the execution was successful, false otherwise.
	 * @protected
	 */
	executeMenu(idx) {
		throw new LogicError('executeMenu not implemented');
	}
	// #endregion
}


//////////////////////
// * CONTEXT MENU * //
//////////////////////
/**
 * A class that provides methods for adding items to the context menu and handling user interactions.
 * @augments {ContextBaseObject}
 */
class ContextMenu extends ContextBaseObject {
	/**
	 * Creates the `ContextMenu` instance.
	 * Initializes properties and creates a context menu.
	 * @param {string} text_arg - The text value for the constructor.
	 * @param {object} [optional_args] - Additional parameters that can be passed to the constructor.
	 * @param {boolean} [optional_args.is_grayed_out] - The item will be grayed out.
	 * @param {boolean} [optional_args.is_checked] - The item will be checked.
	 */
	constructor(text_arg, optional_args) {
		super(text_arg);

		/** @private @constant {boolean} */
		this.is_grayed_out = !!(optional_args && optional_args.is_grayed_out);
		/** @protected @type {array} */
		this.menu_items = [];

		this.cm = window.CreatePopupMenu();
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Initializes a menu by appending menu items to it and setting their properties based on the state of the parent menu.
	 * @param {ContextMenu} parent_menu - The menu to which the current menu will be appended.
	 * @protected
	 */
	initMenu(parent_menu) {
		for (const item of this.menu_items) {
			item.initMenu(this);
		}

		this.cm.AppendTo(parent_menu.cm, this.is_grayed_out ? MenuFlag.Grayed : MenuFlag.String, this.text);
	}

	/**
	 * Initializes the menu index for each menu item recursively, starting from a given index.
	 * @param {number} start_idx - The index at which the menu should start initializing.
	 * @returns {number} The end_idx.
	 * @protected
	 */
	initMenuIndex(start_idx) {
		let cur_idx = start_idx;

		this.idx = cur_idx++;
		for (const item of this.menu_items) {
			if (!item.initMenuIndex) {
				continue;
			}
			cur_idx = item.initMenuIndex(cur_idx);
		}

		return cur_idx;
	}

	/**
	 * Adds an item to the "menu_items" array.
	 * @param {ContextBaseObject} item - The item to be append to the "menu_items" array.
	 * @throws {InvalidTypeError} - If the provided item is not an instance of ContextBaseObject.
	 */
	append(item) {
		if (!(item instanceof ContextBaseObject)) {
			throw new InvalidTypeError('context_item', typeof item, 'instanceof ContextBaseObject');
		}

		this.menu_items.push(item);
	}

	/**
	 * Appends a new ContextItem object to the current context.
	 * @param {string} text_arg - The text content of the item to be append.
	 * @param {Function} callback_fn_arg - A function that will be called when the appended item is clicked or activated.
	 * @param {object} [optional_args] - Additional parameters that can be passed to the function.
	 * @param {boolean} [optional_args.is_grayed_out] - The item will be grayed out.
	 * @param {boolean} [optional_args.is_checked] - The item will be checked.
	 * @param {boolean} [optional_args.is_radio_checked] - The item will be radio checked.
	 */
	appendItem(text_arg, callback_fn_arg, optional_args) {
		this.append(new ContextItem(text_arg, callback_fn_arg, optional_args));
	}

	/**
	 * Disposes of each item in the menu_items array and sets the menu_items property to null.
	 */
	dispose() {
		this.cm = null;

		const items = this.menu_items;
		for (let i = 0; i < items.length; ++i) {
			if (items[i].dispose) {
				items[i].dispose();
			}
			items[i] = null;
		}

		this.menu_items = null;
	}

	/**
	 * Checks if the menu_items array is empty.
	 * @returns {boolean} True or false.
	 */
	empty() {
		return IsEmpty(this.menu_items);
	}

	/**
	 * Executes a menu item based on the given index.
	 * @param {number} idx - The index of the menu item that needs to be executed.
	 * @returns {boolean} The result of calling the `executeMenu` method on the menu item that matches the given index (`idx`).
	 * @protected
	 */
	executeMenu(idx) {
		for (let i = 0; i < this.menu_items.length; ++i) {
			const items = this.menu_items;
			const item = items[i];
			const next_item = items[i + 1];

			if (idx === item.idx || (idx > item.idx && (!next_item || idx < next_item.idx))) {
				return item.executeMenu(idx);
			}
		}
		return false;
	}

	/**
	 * Checks a specific item in a menu and sets it to a radio checked state.
	 * @param {number} start_idx - The starting index of the menu_items array where the radioCheck should begin checking.
	 * @param {number} check_idx - The index of the menu item that you want to perform a radio check on.
	 * @throws {ArgumentError} If the 'start_idx' is out of bounds.
	 * @throws {ArgumentError} If the 'check_idx' is out of bounds or if it points to a ContextSeparator.
	 */
	radioCheck(start_idx, check_idx) {
		const item = this.menu_items[start_idx + check_idx];
		if (!item) {
			throw new ArgumentError('check_idx', check_idx, 'Value is out of bounds');
		}

		if (start_idx >= this.menu_items.length) {
			throw new ArgumentError('start_idx', start_idx, 'Value is out of bounds');
		}

		if (item instanceof ContextSeparator) {
			throw new ArgumentError('check_idx', check_idx, 'Index points to MenuSeparator');
		}

		item.radioCheck(true);
	}

	/**
	 * Appends a menu separator to the current context menu.
	 */
	separator() {
		this.append(new ContextSeparator());
	}
	// #endregion
}


//////////////////////
// * CONTEXT ITEM * //
//////////////////////
/**
 * A class that handles the menu items in a context menu.
 * @augments {ContextBaseObject}
 */
class ContextItem extends ContextBaseObject {
	/**
	 * Creates the `ContextItem` instance.
	 * Initializes properties and creates a menu item.
	 * @param {string} text_arg - The text value for the constructor.
	 * @param {Function} callback_fn_arg - A callback function that will be assigned to the`callback_fn` property.
	 * @param {object} [optional_args] - Additional parameters that can be passed to the constructor.
	 * @param {boolean} [optional_args.is_grayed_out] - The item will be grayed out.
	 * @param {boolean} [optional_args.is_checked] - The item will be checked.
	 * @param {boolean} [optional_args.is_radio_checked] - The ratio item will be checked.
	 */
	constructor(text_arg, callback_fn_arg, optional_args) {
		super(text_arg);

		/** @private @constant {Function} */
		this.callback_fn = callback_fn_arg;
		/** @private @constant {boolean} */
		this.is_grayed_out = !!(optional_args && optional_args.is_grayed_out);
		/** @private @constant {boolean} */
		this.is_checked = !!(optional_args && optional_args.is_checked);
		/** @private @constant {boolean} */
		this.is_radio_checked = !!(optional_args && optional_args.is_radio_checked);
	}

	// * PROTECTED METHODS * //
	// #region PROTECTED METHODS
	/**
	 * Initializes a menu item by appending it to a parent menu and setting its properties such as grayed out, checked, or radio checked.
	 * @param {ContextMenu} parent_menu - The menu object that the current menu item belongs to.
	 * @protected
	 */
	initMenu(parent_menu) {
		parent_menu.cm.AppendMenuItem(this.is_grayed_out ? MenuFlag.Grayed : MenuFlag.String, this.idx, this.text);
		if (this.is_checked) {
			parent_menu.cm.CheckMenuItem(this.idx, true);
		}
		else if (this.is_radio_checked) {
			parent_menu.cm.CheckMenuRadioItem(this.idx, this.idx, this.idx);
		}
	}

	/**
	 * Initializes a menu index and returns the incremented value.
	 * @param {number} start_idx - The initial value for the menu index.
	 * @returns {number} The end_idx.
	 * @protected
	 */
	initMenuIndex(start_idx) {
		this.idx = start_idx;
		return this.idx + 1;
	}

	/**
	 * Executes a menu item's callback function if the provided index matches the stored index.
	 * @param {number} idx - The index of the menu item that needs to be executed.
	 * @returns {boolean} True or false.
	 * @protected
	 */
	executeMenu(idx) {
		if (this.idx !== idx) {
			return false;
		}

		this.callback_fn();
		return true;
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Sets the state of the check mark ✓ in menu items.
	 * @param {boolean} is_checked_arg - Whether something is checked or not.
	 */
	check(is_checked_arg) {
		this.is_checked = is_checked_arg;
	}

	/**
	 * Sets the state of the radio mark 🔘 in menu items.
	 * @param {boolean} is_checked_arg - Whether something is checked or not.
	 */
	radioCheck(is_checked_arg) {
		this.is_radio_checked = is_checked_arg;
	}
	// #endregion
}


///////////////////////////
// * CONTEXT SEPARATOR * //
///////////////////////////
/**
 * A class that handles the separators in a context menu.
 * @augments {ContextBaseObject}
 */
class ContextSeparator extends ContextBaseObject {
	/**
	 * Creates the `ContextSeparator` instance.
	 */
	constructor() {
		super('');
	}

	// * PROTECTED METHODS * //
	// #region PROTECTED METHODS
	/**
	 * Initializes a menu by appending a separator to the parent menu.
	 * @param {ContextMenu} parent_menu - The menu to which the new menu item will be added as a child.
	 * @protected
	 */
	initMenu(parent_menu) {
		parent_menu.cm.AppendMenuSeparator();
	}

	/**
	 * Initializes a menu index and returns the incremented value.
	 * @param {number} start_idx - The initial value for the menu index.
	 * @returns {number} The end_idx.
	 * @protected
	 */
	initMenuIndex(start_idx) {
		this.idx = start_idx;
		return this.idx + 1;
	}

	/**
	 * Execute menu returns false.
	 * @param {number} idx - The index of the menu item to execute.
	 * @returns {boolean} False if the menu item was executed successfully, true otherwise.
	 * @protected
	 */
	executeMenu(idx) {
		return false;
	}
	// #endregion
}


/////////////////////////////
// * CONTEXT FOOBAR MENU * //
/////////////////////////////
/**
 * A class that handles the foobar2000 context menu.
 * @augments {ContextBaseObject}
 */
class ContextFoobarMenu extends ContextBaseObject {
	/**
	 * Creates the `ContextFoobarMenu` instance.
	 * @param {FbMetadbHandleList} metadb_handles_arg - An array of media database handles.
	 */
	constructor(metadb_handles_arg) {
		super('');

		/** @private @type {IContextMenuManager} */
		this.cm = fb.CreateContextMenuManager();
		/** @private @type {FbMetadbHandleList} */
		this.metadb_handles = metadb_handles_arg;
	}

	// * PROTECTED METHODS * //
	// #region PROTECTED METHODS
	/**
	 * Initializes a menu by initializing the context and building the menu items.
	 * @param {ContextMenu} parent_menu - The parent menu to which the new menu will be added as a child.
	 * @protected
	 */
	initMenu(parent_menu) {
		this.cm.InitContext(this.metadb_handles);
		this.cm.BuildMenu(parent_menu.cm, this.idx);
	}

	/**
	 * Initializes a menu index and returns the index plus 5000.
	 * @param {number} start_idx - The initial value for the menu index.
	 * @returns {number} The end_idx.
	 * @protected
	 */
	initMenuIndex(start_idx) {
		this.idx = start_idx;
		return this.idx + 5000;
	}

	/**
	 * Disposes the foobar menu.
	 * @protected
	 */
	dispose() {
		this.cm = null;
	}

	/**
	 * Executes a menu item based on its index.
	 * @param {number} idx - The index of the menu that needs to be executed.
	 * @returns {boolean} The result of executing the command with the specified id.
	 * @protected
	 */
	executeMenu(idx) {
		return this.cm.ExecuteByID(idx - this.idx);
	}
	// #endregion
}


///////////////////////////
// * CONTEXT MAIN MENU * //
///////////////////////////
/**
 * A class that manages the execution of the main context menu.
 * @augments {ContextMenu}
 */
class ContextMainMenu extends ContextMenu {
	/**
	 * Creates the `ContextMainMenu` instance.
	 */
	constructor() {
		super('');
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Executes a menu by initializing it, displaying it and executing the selected menu item.
	 * @param {number} x - The x-coordinate.
	 * @param {number} y - The y-coordinate.
	 * @returns {boolean} True if some item was clicked.
	 */
	execute(x, y) {
		// Initialize menu
		let cur_idx = 1;
		for (const item of this.menu_items) {
			if (!item.initMenuIndex) {
				continue;
			}
			cur_idx = item.initMenuIndex(cur_idx);
		}

		for (const item of this.menu_items) {
			item.initMenu(this);
		}

		// Execute menu
		const idx = this.cm.TrackPopupMenu(x, y);
		if (!idx) {
			return false;
		}

		return this.executeMenu(idx);
	}
	// #endregion
}


////////////////////////
// * MENU INPUT BOX * //
////////////////////////
/**
 * A class that creates menu input boxes for allowing users to customize settings.
 */
class MenuInputBox {
	/**
	 * Create the `MenuInputBox` instance.
	 */
	constructor() {
		/** @private @type {string} The new value of the input box. */
		this.inputBoxNewValue = '';
		/** @private @type {string} The second new value of the input box. */
		this.inputBoxNewValue2 = '';
		/** @private @type {string} The user's new value of the input box. */
		this.inputBoxUserValue = '';
		/** @private @type {string} The user's second new value of the input box. */
		this.inputBoxUserValue2 = '';
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Prompts the user to enter the playlist where tracks will be added when using the add tracks button.
	 * @throws Will throw an error if the new value is not a string.
	 */
	addTracksPlaylist() {
		const inputBoxOldValue = JSON.stringify(grCfg.themeControls.addTracksPlaylist).replace(Regex.PunctQuoteDouble, '');
		this.inputBoxNewValue = '';
		this.inputBoxUserValue = '';

		try {
			const msg = grm.msg.getMessage('inputBox', 'addTracksPlaylist');
			this.inputBoxUserValue = utils.InputBox(window.ID, msg, 'Georgia-ReBORN', inputBoxOldValue, true);
			this.inputBoxNewValue = !this.inputBoxUserValue || typeof this.inputBoxUserValue !== 'string' && !this.inputBoxUserValue.length ? '' : JSON.parse(`"${this.inputBoxUserValue}"`);
			if (typeof this.inputBoxNewValue !== 'string') throw new Error('Invalid type');
		}
		catch (e) {
			if (e.message === 'Invalid type' || e.name === 'SyntaxError') {
				const msg = grm.msg.getMessage('inputBox', 'addTracksPlaylistError');
				fb.ShowPopupMessage(msg, 'Add tracks playlist');
			}
			return;
		}

		grCfg.themeControls.addTracksPlaylist = this.inputBoxNewValue;
		grCfg.config.updateConfigObjValues('themeControls', true);
	}

	/**
	 * Prompts the user to enter a custom directory path for various cache types and updates the configuration.
	 * It supports custom directories for library, biography, lyrics, and waveform bar.
	 * @param {string} directory - One of the following options to specify the type of cache directory:
	 * - 'library' - sets the custom Library cache directory.
	 * - 'biography' - sets the custom Biography cache directory.
	 * - 'lyrics' - sets the custom Lyrics cache directory.
	 * - 'waveformBar' - sets the custom Waveform bar cache directory.
	 * @throws Will throw an error if the new value is not a string.
	 */
	customCacheDir(directory) {
		const dirMap = {
			library: {
				name: 'customLibraryDir',
				path: grCfg.customLibraryDir,
				string: 'library',
				schema: grDef.customLibraryDirSchema
			},
			biography: {
				name: 'customBiographyDir',
				path: grCfg.customBiographyDir,
				string: 'biography',
				schema: grDef.customBiographyDirSchema
			},
			lyrics: {
				name: 'customLyricsDir',
				path: grCfg.customLyricsDir,
				string: 'lyrics',
				schema: grDef.customLyricsDirSchema
			},
			waveformBar: {
				name: 'customWaveformBarDir',
				path: grCfg.customWaveformBarDir,
				string: 'waveform',
				schema: grDef.customWaveformBarDirSchema
			}
		};

		const dirInfo = dirMap[directory] || {};
		const customDirPath = dirInfo.path || '';
		const customDirSchema = dirInfo.schema || '';
		this.customDirString = dirInfo.string || '';

		const inputBoxOldValue = JSON.stringify(customDirPath).replace(Regex.PunctQuoteBracket, '').replace(Regex.PathDoubleBackslash, '\\');
		this.inputBoxNewValue = '';
		this.inputBoxUserValue = '';

		try {
			const msg = grm.msg.getMessage('inputBox', 'customCacheDir');
			this.inputBoxUserValue = utils.InputBox(window.ID, msg, 'Georgia-ReBORN', inputBoxOldValue, true);

			if (!this.inputBoxUserValue || typeof this.inputBoxUserValue !== 'string' || !this.inputBoxUserValue.length) {
				this.inputBoxNewValue = '';
			} else {
				let processedValue = this.inputBoxUserValue.replace(Regex.PathForwardSlash, '\\').replace(Regex.PathBackslashTrailing, '');
				processedValue = `${processedValue.replace(Regex.PathBackslash, '\\\\')}\\\\`;
				this.inputBoxNewValue = JSON.parse(`"${processedValue}"`);
			}

			if (typeof this.inputBoxNewValue !== 'string') {
				throw new Error('Invalid type');
			}

			this.inputBoxNewValue = this.inputBoxNewValue.trim();

			if (dirInfo.name === 'customLyricsDir') {
				grm.msg.showPopupNotice('inputBox', 'customCacheDirLyrics');
			}
		}
		catch (e) {
			if (e.message === 'Invalid type' || e.name === 'SyntaxError') {
				const msg = grm.msg.getMessage('inputBox', 'customCacheDirError');
				fb.ShowPopupMessage(msg, `Custom ${this.customDirString} directory`);
			}

			if (dirInfo.name) grSet[dirInfo.name] = false;
			return;
		}

		grCfg.configCustom.addConfigurationObject(customDirSchema, [this.inputBoxNewValue]);
		grCfg.configCustom.writeConfiguration();

		if (this.inputBoxNewValue) {
			const cacheDir = $(this.inputBoxNewValue, undefined, true);
			const absoluteCacheDir = fso.GetAbsolutePathName(cacheDir);
			if (absoluteCacheDir && !IsFolder(absoluteCacheDir)) CreateFolder(absoluteCacheDir);
		}
	}

	/**
	 * Prompts the user to enter a new name for the currently active custom theme and updates the configuration.
	 * It handles renaming for pre-defined custom themes, identified by keys like 'custom01', 'custom02', etc.
	 * @throws Will throw an error if the new value is not a string.
	 */
	renameCustomTheme() {
		const customThemes = {
			custom01: 'customTheme01',
			custom02: 'customTheme02',
			custom03: 'customTheme03',
			custom04: 'customTheme04',
			custom05: 'customTheme05',
			custom06: 'customTheme06',
			custom07: 'customTheme07',
			custom08: 'customTheme08',
			custom09: 'customTheme09',
			custom10: 'customTheme10'
		};
		const customTheme = customThemes[grSet.theme] || '';

		const customThemeNames = {
			custom01: grCfg.customTheme01,
			custom02: grCfg.customTheme02,
			custom03: grCfg.customTheme03,
			custom04: grCfg.customTheme04,
			custom05: grCfg.customTheme05,
			custom06: grCfg.customTheme06,
			custom07: grCfg.customTheme07,
			custom08: grCfg.customTheme08,
			custom09: grCfg.customTheme09,
			custom10: grCfg.customTheme10
		};
		const customThemeName = customThemeNames[grSet.theme] || '';

		this.inputBoxNewValue = '';
		this.inputBoxUserValue = '';

		try {
			const msg = grm.msg.getMessage('inputBox', 'renameCustomTheme');
			this.inputBoxUserValue = utils.InputBox(window.ID, msg, 'Georgia-ReBORN', customThemeName.name, true);
			this.inputBoxNewValue = !this.inputBoxUserValue || typeof this.inputBoxUserValue !== 'string' && !this.inputBoxUserValue.length ? '' : JSON.parse(`"${this.inputBoxUserValue}"`);
			if (typeof this.inputBoxNewValue !== 'string') throw new Error('Invalid type');
		}
		catch (e) {
			if (e.message === 'Invalid type' || e.name === 'SyntaxError') {
				const msg = grm.msg.getMessage('inputBox', 'renameCustomThemeError');
				fb.ShowPopupMessage(msg, 'Custom theme name');
			}
			return;
		}

		customThemeName.name = this.inputBoxNewValue;
		grCfg.configCustom.updateConfigObjValues(customTheme, true);
	}

	/**
	 * Prompts the user to enter a custom pattern for playlist header information and updates the settings.
	 * @throws Will throw an error if the new value is not a string.
	 */
	playlistCustomHeaderInfo() {
		const inputBoxOldValue = JSON.stringify(grCfg.settings.playlistCustomHeaderInfo).replace(Regex.PunctQuoteDouble, '');
		this.inputBoxNewValue = '';
		this.inputBoxUserValue = '';

		try {
			const msg = grm.msg.getMessage('inputBox', 'playlistCustomHeaderInfo');
			this.inputBoxUserValue = utils.InputBox(window.ID, msg, 'Georgia-ReBORN', inputBoxOldValue, true);
			this.inputBoxNewValue = !this.inputBoxUserValue || typeof this.inputBoxUserValue !== 'string' && !this.inputBoxUserValue.length ? '' : JSON.parse(`"${this.inputBoxUserValue}"`);
			if (typeof this.inputBoxNewValue !== 'string') throw new Error('Invalid type');
		}
		catch (e) {
			if (e.message === 'Invalid type' || e.name === 'SyntaxError') {
				const msg = grm.msg.getMessage('inputBox', 'playlistCustomHeaderInfoError');
				fb.ShowPopupMessage(msg, 'Custom playlist header info');
			}
			return;
		}

		grCfg.settings.playlistCustomHeaderInfo = this.inputBoxNewValue;
		grCfg.config.updateConfigObjValues('settings', true);
	}

	/**
	 * Prompts the user to enter custom patterns for playlist track rows with and without headers.
	 * @throws Will throw an error if the new values are not strings.
	 */
	playlistCustomTrackRow() {
		const inputBoxOldValue1 = JSON.stringify(grCfg.settings.playlistCustomTitle).replace(Regex.PunctQuoteDouble, '');
		const inputBoxOldValue2 = JSON.stringify(grCfg.settings.playlistCustomTitleNoHeader).replace(Regex.PunctQuoteDouble, '');
		this.inputBoxNewValue = '';
		this.inputBoxNewValue2 = '';
		this.inputBoxUserValue = '';
		this.inputBoxUserValue2 = '';

		try {
			const msg = grm.msg.getMessage('inputBox', 'playlistCustomTrackRow1');
			const msg2 = grm.msg.getMessage('inputBox', 'playlistCustomTrackRow2');
			this.inputBoxUserValue = utils.InputBox(window.ID, msg, 'Georgia-ReBORN', inputBoxOldValue1, true);
			this.inputBoxUserValue2 = utils.InputBox(window.ID, msg2, 'Georgia-ReBORN', inputBoxOldValue2, true);
			this.inputBoxNewValue = !this.inputBoxUserValue || typeof this.inputBoxUserValue !== 'string' && !this.inputBoxUserValue.length ? '' : JSON.parse(`"${this.inputBoxUserValue}"`);
			this.inputBoxNewValue2 = !this.inputBoxUserValue2 || typeof this.inputBoxUserValue2 !== 'string' && !this.inputBoxUserValue2.length ? '' : JSON.parse(`"${this.inputBoxUserValue2}"`);
			if (typeof this.inputBoxNewValue !== 'string') throw new Error('Invalid type');
			if (typeof this.inputBoxNewValue2 !== 'string') throw new Error('Invalid type');
		}
		catch (e) {
			if (e.message === 'Invalid type' || e.name === 'SyntaxError') {
				const msg = grm.msg.getMessage('inputBox', 'playlistCustomTrackRowError');
				fb.ShowPopupMessage(msg, 'Custom playlist track row');
			}
			return;
		}

		grCfg.settings.playlistCustomTitle = this.inputBoxNewValue;
		grCfg.settings.playlistCustomTitleNoHeader = this.inputBoxNewValue2;
		grCfg.config.updateConfigObjValues('settings', true);
	}

	/**
	 * Prompts the user to enter a custom sort pattern for the playlist.
	 * @throws Will throw an error if the new value is not a string.
	 */
	playlistSortCustom() {
		const inputBoxOldValue = JSON.stringify(grCfg.settings.playlistSortCustom).replace(Regex.PunctQuoteDouble, '');
		this.inputBoxNewValue = '';
		this.inputBoxUserValue = '';

		try {
			const msg = grm.msg.getMessage('inputBox', 'playlistSortCustom');
			this.inputBoxUserValue = utils.InputBox(window.ID, msg, 'Georgia-ReBORN', inputBoxOldValue, true);
			this.inputBoxNewValue = !this.inputBoxUserValue || typeof this.inputBoxUserValue !== 'string' && !this.inputBoxUserValue.length ? '' : JSON.parse(`"${this.inputBoxUserValue}"`);
			if (typeof this.inputBoxNewValue !== 'string') throw new Error('Invalid type');
		}
		catch (e) {
			if (e.message === 'Invalid type' || e.name === 'SyntaxError') {
				const msg = grm.msg.getMessage('inputBox', 'playlistSortCustomError');
				fb.ShowPopupMessage(msg, 'Custom playlist order');
			}
			return;
		}

		grCfg.settings.playlistSortCustom = this.inputBoxNewValue;
		grCfg.config.updateConfigObjValues('settings', true);
	}
	// #endregion
}
