/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Context Menu Control                     * //
// * Author:         TT                                                      * //
// * Org. Author:    TheQwertiest                                            * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-DEV                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    18-02-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


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

		this.cm.AppendTo(parent_menu.cm, this.is_grayed_out ? MF_GRAYED : MF_STRING, this.text);
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


//////////////
// * ITEM * //
//////////////
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
		parent_menu.cm.AppendMenuItem(this.is_grayed_out ? MF_GRAYED : MF_STRING, this.idx, this.text);
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


///////////////////
// * SEPARATOR * //
///////////////////
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


/////////////////////
// * FOOBAR MENU * //
/////////////////////
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


///////////////////
// * MAIN MENU * //
///////////////////
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


///////////////////////////
// * ALL CONTEXT MENUS * //
///////////////////////////
/**
 * A class that holds the collection of all available context menus in the theme.
 */
class ContextMenus {
	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Contains some basic and SMP related options.
	 * Displayed when shift right clicking in playlist panel or playlist manager.
	 * @param {ContextMenu} cm - The context menu object.
	 */
	contextMenuDefault(cm) {
		if (!cm) {
			return;
		}

		if (!cm.empty()) {
			cm.separator();
		}

		cm.appendItem('Console', () => {
			fb.ShowConsole();
		});

		cm.appendItem('Restart', () => {
			fb.RunMainMenuCommand('File/Restart');
		});

		cm.appendItem('Preferences...', () => {
			fb.RunMainMenuCommand('File/Preferences');
		});

		cm.separator();

		cm.appendItem('Configure panel...', () => {
			window.ShowConfigure();
		});

		cm.appendItem('Panel properties...', () => {
			window.ShowProperties();
		});
	}

	/**
	 * Contains top bar related options from top menu "Options" for quick access.
	 * Displayed when right clicking on the top bar.
	 * @param {ContextMenu} cm - The context menu object.
	 */
	contextMenuTopBar(cm) {
		const updateButtons = () => {
			grm.ui.createButtonImages();
			grm.ui.createButtonObjects(grm.ui.ww, grm.ui.wh);
			RepaintWindow();
		};

		const topMenuDisplayMenu = new ContextMenu('Display');

		// * DISPLAY - SHOW TOP MENU BUTTONS - DEFAULT * //
		const topMenuDisplayMenuDefault = new ContextMenu('Default');
		topMenuDisplayMenuDefault.appendItem('Details', () => {
			grSet.showPanelDetails_default = !grSet.showPanelDetails_default;
			updateButtons();
		}, { is_checked: grSet.showPanelDetails_default });
		topMenuDisplayMenuDefault.appendItem('Library', () => {
			grSet.showPanelLibrary_default = !grSet.showPanelLibrary_default;
			updateButtons();
		}, { is_checked: grSet.showPanelLibrary_default });
		topMenuDisplayMenuDefault.appendItem('Biography', () => {
			grSet.showPanelBiography_default = !grSet.showPanelBiography_default;
			updateButtons();
		}, { is_checked: grSet.showPanelBiography_default });
		topMenuDisplayMenuDefault.appendItem('Lyrics', () => {
			grSet.showPanelLyrics_default = !grSet.showPanelLyrics_default;
			updateButtons();
		}, { is_checked: grSet.showPanelLyrics_default });
		topMenuDisplayMenuDefault.appendItem('Rating', () => {
			grSet.showPanelRating_default = !grSet.showPanelRating_default;
			updateButtons();
		}, { is_checked: grSet.showPanelRating_default });
		topMenuDisplayMenu.append(topMenuDisplayMenuDefault);

		// * DISPLAY - SHOW TOP MENU BUTTONS - ARTWORK * //
		const topMenuDisplayMenuArtwork = new ContextMenu('Artwork');
		topMenuDisplayMenuArtwork.appendItem('Details', () => {
			grSet.showPanelDetails_artwork = !grSet.showPanelDetails_artwork;
			updateButtons();
		}, { is_checked: grSet.showPanelDetails_artwork });
		topMenuDisplayMenuArtwork.appendItem('Library', () => {
			grSet.showPanelLibrary_artwork = !grSet.showPanelLibrary_artwork;
			updateButtons();
		}, { is_checked: grSet.showPanelLibrary_artwork });
		topMenuDisplayMenuArtwork.appendItem('Biography', () => {
			grSet.showPanelBiography_artwork = !grSet.showPanelBiography_artwork;
			updateButtons();
		}, { is_checked: grSet.showPanelBiography_artwork });
		topMenuDisplayMenuArtwork.appendItem('Lyrics', () => {
			grSet.showPanelLyrics_artwork = !grSet.showPanelLyrics_artwork;
			updateButtons();
		}, { is_checked: grSet.showPanelLyrics_artwork });
		topMenuDisplayMenuArtwork.appendItem('Rating', () => {
			grSet.showPanelRating_artwork = !grSet.showPanelRating_artwork;
			updateButtons();
		}, { is_checked: grSet.showPanelRating_artwork });
		topMenuDisplayMenu.append(topMenuDisplayMenuArtwork);
		topMenuDisplayMenu.separator();

		// * DISPLAY - ALIGN TOP MENU BUTTONS * //
		const topMenuDisplayAlign = [['Align left', 'left'], ['Align center', 'center']];
		for (const align of topMenuDisplayAlign) {
			topMenuDisplayMenu.appendItem(align[0], ((align) => {
				grSet.topMenuAlignment = align;
				updateButtons();
			}).bind(null, align[1]), { is_radio_checked: align[1] === grSet.topMenuAlignment });
		}
		topMenuDisplayMenu.separator();
		topMenuDisplayMenu.appendItem('Compact top menu', () => {
			grSet.topMenuCompact = !grSet.topMenuCompact;
			if (!grSet.topMenuCompact) {
				grm.button.topMenu(false);
			}
		}, { is_checked: grSet.topMenuCompact });

		cm.append(topMenuDisplayMenu);

		// * STYLE - TOP MENU BUTTONS * //
		const topMenuStyleMenu = new ContextMenu('Style');
		const topMenuButtonStyle = [
			['Default', 'default'],
			['Filled', 'filled'],
			['Bevel', 'bevel'],
			['Inner', 'inner'],
			['Emboss', 'emboss'],
			['Minimal', 'minimal']
		];
		for (const style of topMenuButtonStyle) {
			topMenuStyleMenu.appendItem(style[0], ((style) => {
				grSet.styleTopMenuButtons = style;
				if (!grSet.themeSandbox) grSet.savedStyleTopMenuButtons = grSet.styleTopMenuButtons = style; else grSet.styleTopMenuButtons = style;
				grm.ui.updateStyle();
			}).bind(null, style[1]), { is_radio_checked: style[1] === grSet.styleTopMenuButtons });
		}
		cm.append(topMenuStyleMenu);
	}

	/**
	 * Contains some options not find in top menu "Options" and append panel related top menu "Options" for quick access.
	 * Displayed when right clicking on the big album art on the left side.
	 * @param {ContextMenu} cm - The context menu object.
	 */
	contextMenuAlbumCover(cm) {
		if (!grSet.showTransportControls_default) {
			cm.appendItem('Stop', () => {
				fb.Stop();
			});
			cm.appendItem('Previous', () => {
				fb.Prev();
			});
			cm.appendItem(fb.IsPlaying ? 'Pause' : 'Play', () => {
				fb.PlayOrPause();
			});
			cm.appendItem('Next', () => {
				fb.Next();
			});
			cm.separator();

			const playbackOrderMenu = new ContextMenu('Playback order');
			const playbackOrderModes = ['default', 'repeatPlaylist', 'repeatTrack', 'shuffle'];
			for (const playbackOrder of playbackOrderModes) {
				playbackOrderMenu.appendItem(playbackOrder, () => {
					switch (playbackOrder) {
						case 'default':
							grSet.playbackOrder = 'default';
							fb.RunMainMenuCommand('Playback/Order/Default');
							break;
						case 'repeatPlaylist':
							grSet.playbackOrder = 'repeatPlaylist';
							fb.RunMainMenuCommand('Playback/Order/Repeat (playlist)');
							break;
						case 'repeatTrack':
							grSet.playbackOrder = 'repeatTrack';
							fb.RunMainMenuCommand('Playback/Order/Repeat (track)');
							break;
						case 'shuffle':
							grSet.playbackOrder = 'shuffle';
							fb.RunMainMenuCommand('Playback/Order/Shuffle (tracks)');
							break;
					}
				}, { is_radio_checked: playbackOrder === grSet.playbackOrder });
			}
			cm.append(playbackOrderMenu);
			cm.separator();
		}

		// * Top menu options - Playlist, Details, Library, Lyrics - context menu
		const showPlaylist = grSet.layout === 'artwork' ? grm.ui.displayPlaylistArtwork && !grm.ui.displayLyrics : grm.ui.displayPlaylist && !grm.ui.displayLyrics;
		const showDetails = grm.ui.displayDetails;
		const showArtworkLayoutAlbumArt = grSet.layout === 'artwork' && !grm.ui.displayPlaylist && !grm.ui.displayPlaylistArtwork && !grm.ui.displayLibrary && !grm.ui.displayBiography && !grm.ui.displayLyrics;

		if (!showArtworkLayoutAlbumArt) {
			cm.appendItem(showPlaylist ? 'Playlist options menu' : showDetails ? 'Details options menu' : grm.ui.displayLibrary ? 'Library options menu' : 'Lyrics options menu', () => {
				if (showPlaylist) {
					grm.topMenu.topMenuOptions(grm.ui.displayBiography ? grm.ui.state.mouse_x * 2 : grm.ui.state.mouse_x, grm.ui.state.mouse_y, true, true);
				}
				else if (showDetails) {
					grm.topMenu.topMenuOptions(grm.ui.state.mouse_x, grm.ui.state.mouse_y, true, false, true);
				}
				else if (grm.ui.displayLibrary) {
					grm.topMenu.topMenuOptions(grm.ui.state.mouse_x, grm.ui.state.mouse_y, true, false, false, true);
				}
				else if (grm.ui.displayLyrics) {
					grm.topMenu.topMenuOptions(grm.ui.state.mouse_x, grm.ui.state.mouse_y, true, false, false, false, false, true);
				}
			});
		}

		if (grSet.theme === 'random') {
			cm.appendItem('Generate new color', () => {
				grm.ui.getRandomThemeColorContextMenu = true;
				grm.ui.initTheme();
				setTimeout(() => { grm.ui.getRandomThemeColorContextMenu = false }, 200);
			});
			cm.separator();
		}

		if (grSet.layout === 'default' && grSet.theme.startsWith('custom')) {
			cm.separator();
			cm.appendItem('Edit custom theme', () => {
				grm.ui.displayCustomThemeMenu = true;
				if (showPlaylist) {
					grm.ui.displayPanel('playlist');
					grm.cthMenu.initCustomThemeMenu('pl_bg');
				}
				else if (showDetails) {
					grm.ui.displayPanel('details');
					grm.cthMenu.initCustomThemeMenu(false, 'main_bg');
				}
				else if (grm.ui.displayLibrary) {
					grm.ui.displayPanel('library');
					grm.cthMenu.initCustomThemeMenu(false, false, 'lib_bg');
				}
				else if (grm.ui.displayLyrics) {
					grm.ui.displayPanel('lyrics');
					grm.cthMenu.initCustomThemeMenu(false, 'main_text');
				}
				window.Repaint();
			});
		}

		if (showDetails) {
			cm.appendItem('Edit metadata grid', () => {
				if (grSet.layout === 'default') {
					grm.ui.displayMetadataGridMenu = !grm.ui.displayMetadataGridMenu;
					if (!grm.ui.displayDetails) {
						grm.ui.displayDetails = true;
						grm.ui.displayPlaylist = false;
						grm.ui.displayLibrary = false;
						grm.ui.displayBiography = false;
						grm.ui.displayLyrics = false;
						grm.ui.resizeArtwork(true);
						grm.button.initButtonState();
					}
					grm.gridMenu.initMetadataGridMenu(1);
					RepaintWindow();
				} else {
					fb.ShowPopupMessage(`Metadata grid can only be live edited in default layout:\nOptions > Layout > Default\n\nYou could manually edit your config file while reloading to take effect:\n${grCfg.configPath}\n`, 'Metadata grid live editing');
				}
			});
			cm.separator();
		}

		if (grSet.layout === 'default') {
			if (grm.ui.displayPlaylist && !grm.ui.displayBiography && !grm.ui.displayLyrics) {
				cm.appendItem(grm.ui.displayPlaylist && grSet.playlistLayout === 'normal' ? 'Change layout to full' : 'Change layout to normal', () => {
					grSet.playlistLayout = grSet.playlistLayout === 'normal' ? 'full' : 'normal';
					if (grSet.panelWidthAuto) {
						grm.ui.initPanelWidthAuto();
					}
					RepaintWindowRectAreas();
					plSet.auto_collapse = false;
					pl.playlist.header_expand();
					pl.call.on_size(grm.ui.ww, grm.ui.wh);
					grm.jSearch.on_size();
					grm.button.initButtonState();
				});
				cm.separator();
			}
			else if (grm.ui.displayLibrary) {
				cm.separator();
				cm.appendItem(grm.ui.displayLibrary && grSet.libraryLayout === 'normal' ? 'Change layout to full' : 'Change layout to normal', () => {
					grSet.libraryLayout = grSet.libraryLayout === 'normal' ? 'full' : 'normal';
					grm.ui.displayPlaylist = grSet.libraryLayout === 'split';
					if (grSet.panelWidthAuto) {
						grm.ui.initPanelWidthAuto();
					}
					grm.ui.initLibraryLayout();
					grm.button.initButtonState();
				});
				if (grSet.libraryLayout === 'normal') {
					cm.appendItem(grm.ui.displayLibrary && grSet.libraryLayout === 'normal' ? 'Change layout to split' : 'Change layout to normal', () => {
						grSet.libraryLayout = grSet.libraryLayout === 'normal' ? 'split' : 'normal';
						grm.ui.displayPlaylist = grSet.libraryLayout === 'split';
						if (grSet.panelWidthAuto) {
							grm.ui.initPanelWidthAuto();
						}
						grm.ui.initLibraryLayout();
						grm.button.initButtonState();
					});
					cm.separator();
				}
			}
			else if (grm.ui.displayLyrics) {
				cm.appendItem(grm.ui.displayLyrics && grSet.lyricsLayout === 'normal' ? 'Change layout to full' : 'Change layout to normal', () => {
					grSet.lyricsLayout = grSet.lyricsLayout === 'normal' ? 'full' : 'normal';
					grm.ui.displayPlaylist = !grm.ui.displayPlaylist;
					grm.ui.lyricsLayoutFullWidth = grSet.lyricsLayout === 'full';
					if (grSet.panelWidthAuto) {
						grm.ui.initPanelWidthAuto();
					}
					RepaintWindowRectAreas();
					grm.ui.resizeArtwork(true);
					grm.button.initButtonState();
				});
				cm.separator();
			}
		}

		cm.appendItem(grSet.layout !== 'artwork' && (grm.ui.displayPlaylist || grm.ui.displayLyrics && grSet.lyricsLayout === 'full') ? 'Details' : 'Playlist', () => {
			if (grSet.layout !== 'artwork') {
				grm.ui.btn.details.onClick();
				if (grm.ui.displayPlaylist && !grSet.lyricsPanelState) grm.ui.displayLyrics = false;
			}
			else if (grSet.layout === 'artwork') {
				grm.ui.btn.playlistArtworkLayout.onClick();
				if (grm.ui.displayPlaylistArtwork) grm.ui.displayLyrics = false;
			}
			pl.call.on_size(grm.ui.ww, grm.ui.wh);
			grm.ui.resizeArtwork(true);
			grm.button.initButtonState();
			window.Repaint();
		});
		cm.separator();

		cm.appendItem(grm.ui.displayLyrics ? 'Hide lyrics' : 'Display lyrics', () => {
			if (grSet.layout === 'artwork' && grm.ui.displayPlaylist) grm.ui.btn.details.onClick();
			grm.ui.displayLyrics = !grm.ui.displayLyrics;
			if (!grm.ui.displayLyrics && grSet.lyricsLayout === 'full' || grm.ui.noAlbumArtStub) {
				grm.ui.displayPlaylist = true;
			}
			if (grm.ui.displayLyrics && grSet.lyricsLayout === 'full') {
				grm.ui.displayPlaylist = false;
				grm.ui.displayDetails = false;
			}
			pl.call.on_size(grm.ui.ww, grm.ui.wh);
			grm.lyrics.initLyrics();
			on_playback_seek();
			grm.ui.resizeArtwork(true);
			grm.button.initButtonState();
			window.Repaint();
		});

		if (grm.ui.albumArtList.length > 1) {
			const loadImage = () => {
				setTimeout(() => {
					grm.ui.loadImageFromAlbumArtList(grm.ui.albumArtIndex);
					if (grSet.theme === 'reborn' || grSet.theme === 'random' || grSet.styleBlackAndWhiteReborn || grSet.styleBlackReborn) {
						grm.ui.newTrackFetchingArtwork = true;
						grm.color.getThemeColors(grm.ui.albumArt);
						grm.ui.initTheme();
						DebugLog('\n>>> initTheme -> Album cover context menu -> Display next/previous artwork <<<\n');
					}
					window.Repaint();
				}, !grm.ui.activeMenu);
			}
			if (grm.ui.albumArtIndex !== grm.ui.albumArtList.length - 1) {
				cm.appendItem(fb.IsPlaying ? 'Display next artwork' : '', () => {
					grm.ui.albumArtIndex = (grm.ui.albumArtIndex + 1) % grm.ui.albumArtList.length;
					loadImage();
				});
			}
			if (grm.ui.albumArtIndex !== 0) {
				cm.appendItem(fb.IsPlaying ? 'Display previous artwork' : '', () => {
					grm.ui.albumArtIndex = (grm.ui.albumArtIndex - 1) % grm.ui.albumArtList.length;
					loadImage();
				});
			}
		}

		cm.separator();

		const query = $('$if3(%album artist%, %artist, %composer%)', fb.GetNowPlaying()).replace(/ /g, '%20');
		cm.appendItem('Get disc art', () => {
			RunCmd(`https://fanart.tv/?s=${query}&sect=2`);
		});

		const discArtMenu = new ContextMenu('Disc art placeholder');
		discArtMenu.appendItem('Show placeholder if no disc art found', () => {
			grSet.showDiscArtStub = !grSet.showDiscArtStub;
			grSet.noDiscArtStub = false;
			grm.ui.fetchNewArtwork(fb.GetNowPlaying());
			RepaintWindow();
		}, { is_checked: grSet.showDiscArtStub });
		discArtMenu.separator();
		discArtMenu.appendItem('No placeholder', () => {
			grSet.noDiscArtStub = !grSet.noDiscArtStub;
			grSet.showDiscArtStub = false;
			grm.ui.discArt = grm.ui.disposeDiscArt(grm.ui.discArt);
			grm.ui.discArtCover = grm.ui.disposeDiscArt(grm.ui.discArtCover);
			grm.ui.discArtArray = [];
			grm.ui.discArtArrayCover = [];
			if (!grSet.noDiscArtStub) grm.ui.fetchNewArtwork(fb.GetNowPlaying());
			RepaintWindow();
		}, { is_checked: grSet.noDiscArtStub });
		discArtMenu.separator();
		const displayCdArtMenu = [
			['CD - Album cover', 'cdAlbumCover'],
			['CD - White', 'cdWhite'],
			['CD - Black', 'cdBlack'],
			['CD - Blank', 'cdBlank'],
			['CD - Transparent', 'cdTrans']
		];
		for (const cdArt of displayCdArtMenu) {
			discArtMenu.appendItem(cdArt[0], ((cdArt) => {
				grSet.discArtStub = cdArt;
				grSet.noDiscArtStub = false;
				grm.ui.discArtCover = grm.ui.disposeDiscArt(grm.ui.discArtCover);
				grm.ui.discArtArrayCover = [];
				grm.ui.fetchNewArtwork(fb.GetNowPlaying());
				RepaintWindow();
			}).bind(null, cdArt[1]), { is_radio_checked: cdArt[1] === grSet.discArtStub });
		}
		discArtMenu.separator();
		const displayVinylArtMenu = [
			['Vinyl - Album cover', 'vinylAlbumCover'],
			['Vinyl - White', 'vinylWhite'],
			['Vinyl - Void', 'vinylVoid'],
			['Vinyl - Cold fusion', 'vinylColdFusion'],
			['Vinyl - Ring of fire', 'vinylRingOfFire'],
			['Vinyl - Maple', 'vinylMaple'],
			['Vinyl - Black', 'vinylBlack'],
			['Vinyl - Black hole', 'vinylBlackHole'],
			['Vinyl - Ebony', 'vinylEbony'],
			['Vinyl - Transparent', 'vinylTrans']
		];
		for (const vinylArt of displayVinylArtMenu) {
			discArtMenu.appendItem(vinylArt[0], ((vinylArt) => {
				grSet.discArtStub = vinylArt;
				grSet.noDiscArtStub = false;
				grm.ui.discArtCover = grm.ui.disposeDiscArt(grm.ui.discArtCover);
				grm.ui.discArtArrayCover = [];
				grm.ui.fetchNewArtwork(fb.GetNowPlaying());
				RepaintWindow();
			}).bind(null, vinylArt[1]), { is_radio_checked: vinylArt[1] === grSet.discArtStub });
		}
		cm.append(discArtMenu);
		cm.separator();

		cm.appendItem('Open containing folder', () => {
			fb.RunContextCommand('Open Containing Folder');
		});

		cm.appendItem('Properties', () => {
			fb.RunContextCommand('Properties');
		});

		cm.separator();

		cm.appendItem('Reload theme', () => {
			window.Reload();
		});
	}

	/**
	 * Contains all seekbar ( progress bar, peakmeter bar and waveform bar ) top menu "Options" for quick access.
	 * Displayed when right clicking on the lower bar.
	 * @param {ContextMenu} cm - The context menu object.
	 */
	contextMenuLowerBar(cm) {
		const updateButtons = () => {
			grm.ui.createButtonImages();
			grm.ui.createButtonObjects(grm.ui.ww, grm.ui.wh);
			RepaintWindow();
		};

		const updateSeekbar = () => {
			grm.ui.initMetrics();
			grm.ui.resizeArtwork(true);
			RepaintWindow();
		};

		// * TRANSPORT BUTTON SIZE * //
		const transportSizeMenu = new ContextMenu('Transport button size');
		const transportSizeMenuDefault = new ContextMenu('Default');
		const transportSizeDefault = [['28px', 28], ['30px', 30], ['32px (default)', 32], ['34px', 34], ['36px', 36], ['38px', 38], ['40px', 40], ['42px', 42]];
		for (const size of transportSizeDefault) {
			transportSizeMenuDefault.appendItem(size[0], ((size) => {
				grSet.transportButtonSize_default = size;
				if (size === -1) {
					grSet.transportButtonSize_default -= 2;
				} else if (size === 999) {
					grSet.transportButtonSize_default += 2;
				} else {
					grSet.transportButtonSize_default = size;
				}
				grm.ui.createFonts();
				grm.ui.resizeArtwork(true);
				updateButtons();
			}).bind(null, size[1]), { is_radio_checked: size[1] === grSet.transportButtonSize_default });
		}
		transportSizeMenu.append(transportSizeMenuDefault);

		const transportSizeMenuArtwork = new ContextMenu('Artwork');
		const transportSizeArtwork = [['28px', 28], ['30px', 30], ['32px (default)', 32], ['34px', 34], ['36px', 36], ['38px', 38], ['40px', 40], ['42px', 42]];
		for (const size of transportSizeArtwork) {
			transportSizeMenuArtwork.appendItem(size[0], ((size) => {
				grSet.transportButtonSize_artwork = size;
				if (size === -1) {
					grSet.transportButtonSize_artwork -= 2;
				} else if (size === 999) {
					grSet.transportButtonSize_artwork += 2;
				} else {
					grSet.transportButtonSize_artwork = size;
				}
				grm.ui.createFonts();
				grm.ui.resizeArtwork(true);
				updateButtons();
			}).bind(null, size[1]), { is_radio_checked: size[1] === grSet.transportButtonSize_artwork });
		}
		transportSizeMenu.append(transportSizeMenuArtwork);

		const transportSizeMenuCompact = new ContextMenu('Compact');
		const transportSizeCompact = [['28px', 28], ['30px', 30], ['32px (default)', 32], ['34px', 34], ['36px', 36], ['38px', 38], ['40px', 40], ['42px', 42]];
		for (const size of transportSizeCompact) {
			transportSizeMenuCompact.appendItem(size[0], ((size) => {
				grSet.transportButtonSize_compact = size;
				if (size === -1) {
					grSet.transportButtonSize_compact -= 2;
				} else if (size === 999) {
					grSet.transportButtonSize_compact += 2;
				} else {
					grSet.transportButtonSize_compact = size;
				}
				grm.ui.createFonts();
				grm.ui.resizeArtwork(true);
				updateButtons();
			}).bind(null, size[1]), { is_radio_checked: size[1] === grSet.transportButtonSize_compact });
		}
		transportSizeMenu.append(transportSizeMenuCompact);
		cm.append(transportSizeMenu);

		// * TRANSPORT BUTTON SPACING * //
		const transportSpacingMenu = new ContextMenu('Transport button spacing');
		const transportSpacingMenuDefault = new ContextMenu('Default');
		const transportSpacingDefault = [['-2', -1], ['3px', 3], ['5px (default)', 5], ['7px', 7], ['10px', 10], ['15px', 15], ['+2', 999]];
		for (const spacing of transportSpacingDefault) {
			transportSpacingMenuDefault.appendItem(spacing[0], ((spacing) => {
				grSet.transportButtonSpacing_default = spacing;
				if (spacing === -1) {
					grSet.transportButtonSpacing_default -= 2;
				} else if (spacing === 999) {
					grSet.transportButtonSpacing_default += 2;
				} else {
					grSet.transportButtonSpacing_default = spacing;
				}
				grm.ui.updateStyle();
			}).bind(null, spacing[1]), { is_radio_checked: spacing[1] === grSet.transportButtonSpacing_default });
		}
		transportSpacingMenu.append(transportSpacingMenuDefault);

		const transportSpacingMenuArtwork = new ContextMenu('Artwork');
		const transportSpacingArtwork = [['-2', -1], ['3px', 3], ['5px (default)', 5], ['7px', 7], ['10px', 10], ['15px', 15], ['+2', 999]];
		for (const spacing of transportSpacingArtwork) {
			transportSpacingMenuArtwork.appendItem(spacing[0], ((spacing) => {
				grSet.transportButtonSpacing_artwork = spacing;
				if (spacing === -1) {
					grSet.transportButtonSpacing_artwork -= 2;
				} else if (spacing === 999) {
					grSet.transportButtonSpacing_artwork += 2;
				} else {
					grSet.transportButtonSpacing_artwork = spacing;
				}
				grm.ui.updateStyle();
			}).bind(null, spacing[1]), { is_radio_checked: spacing[1] === grSet.transportButtonSpacing_artwork });
		}
		transportSpacingMenu.append(transportSpacingMenuArtwork);

		const transportSpacingMenuCompact = new ContextMenu('Compact');
		const transportSpacingCompact = [['-2', -1], ['3px', 3], ['5px (default)', 5], ['7px', 7], ['10px', 10], ['15px', 15], ['+2', 999]];
		for (const spacing of transportSpacingCompact) {
			transportSpacingMenuCompact.appendItem(spacing[0], ((spacing) => {
				grSet.transportButtonSpacing_compact = spacing;
				if (spacing === -1) {
					grSet.transportButtonSpacing_compact -= 2;
				} else if (spacing === 999) {
					grSet.transportButtonSpacing_compact += 2;
				} else {
					grSet.transportButtonSpacing_compact = spacing;
				}
				grm.ui.updateStyle();
			}).bind(null, spacing[1]), { is_radio_checked: spacing[1] === grSet.transportButtonSpacing_compact });
		}
		transportSpacingMenu.append(transportSpacingMenuCompact);
		cm.append(transportSpacingMenu);

		cm.separator();
		const transportButtonDisplayMenu = new ContextMenu('Display');

		// * SHOW TRANSPORT CONTROLS * //
		const transportControlsMenu = new ContextMenu('Show transport controls');
		transportControlsMenu.appendItem('Default', () => {
			grSet.showTransportControls_default = !grSet.showTransportControls_default;
			grm.ui.resizeArtwork(true);
			updateButtons();
		}, { is_checked: grSet.showTransportControls_default });
		transportControlsMenu.appendItem('Artwork', () => {
			grSet.showTransportControls_artwork = !grSet.showTransportControls_artwork;
			grm.ui.resizeArtwork(true);
			updateButtons();
		}, { is_checked: grSet.showTransportControls_artwork });
		transportControlsMenu.appendItem('Compact', () => {
			grSet.showTransportControls_compact = !grSet.showTransportControls_compact;
			grm.ui.resizeArtwork(true);
			updateButtons();
		}, { is_checked: grSet.showTransportControls_compact });
		transportButtonDisplayMenu.append(transportControlsMenu);

		// * SHOW PLAYBACK ORDER BUTTON * //
		const playbackOrderBtnMenu = new ContextMenu('Show playback order button');
		playbackOrderBtnMenu.appendItem('Default', () => {
			grSet.showPlaybackOrderBtn_default = !grSet.showPlaybackOrderBtn_default;
			grm.ui.resizeArtwork(true);
			updateButtons();
		}, { is_checked: grSet.showPlaybackOrderBtn_default });
		playbackOrderBtnMenu.appendItem('Artwork', () => {
			grSet.showPlaybackOrderBtn_artwork = !grSet.showPlaybackOrderBtn_artwork;
			grm.ui.resizeArtwork(true);
			updateButtons();
		}, { is_checked: grSet.showPlaybackOrderBtn_artwork });
		playbackOrderBtnMenu.appendItem('Compact', () => {
			grSet.showPlaybackOrderBtn_compact = !grSet.showPlaybackOrderBtn_compact;
			grm.ui.resizeArtwork(true);
			updateButtons();
		}, { is_checked: grSet.showPlaybackOrderBtn_compact });
		transportButtonDisplayMenu.append(playbackOrderBtnMenu);

		// * SHOW RELOAD BUTTON * //
		const reloadBtnMenu = new ContextMenu('Show reload button');
		reloadBtnMenu.appendItem('Default', () => {
			grSet.showReloadBtn_default = !grSet.showReloadBtn_default;
			grm.ui.resizeArtwork(true);
			updateButtons();
		}, { is_checked: grSet.showReloadBtn_default });
		reloadBtnMenu.appendItem('Artwork', () => {
			grSet.showReloadBtn_artwork = !grSet.showReloadBtn_artwork;
			grm.ui.resizeArtwork(true);
			updateButtons();
		}, { is_checked: grSet.showReloadBtn_artwork });
		reloadBtnMenu.appendItem('Compact', () => {
			grSet.showReloadBtn_compact = !grSet.showReloadBtn_compact;
			grm.ui.resizeArtwork(true);
			updateButtons();
		}, { is_checked: grSet.showReloadBtn_compact });
		transportButtonDisplayMenu.append(reloadBtnMenu);

		// * SHOW ADD TRACKS BUTTON * //
		const addTrackBtnMenu = new ContextMenu('Show add tracks button');
		addTrackBtnMenu.appendItem('Default', () => {
			grSet.showAddTracksBtn_default = !grSet.showAddTracksBtn_default;
			grm.ui.resizeArtwork(true);
			updateButtons();
		}, { is_checked: grSet.showAddTracksBtn_default });
		addTrackBtnMenu.appendItem('Artwork', () => {
			grSet.showAddTracksBtn_artwork = !grSet.showAddTracksBtn_artwork;
			grm.ui.resizeArtwork(true);
			updateButtons();
		}, { is_checked: grSet.showAddTracksBtn_artwork });
		addTrackBtnMenu.appendItem('Compact', () => {
			grSet.showAddTrackdBtn_compact = !grSet.showAddTrackdBtn_compact;
			grm.ui.resizeArtwork(true);
			updateButtons();
		}, { is_checked: grSet.showAddTrackdBtn_compact });
		transportButtonDisplayMenu.append(addTrackBtnMenu);

		// * SHOW VOLUME BUTTON * //
		const volumeBtnMenu = new ContextMenu('Show volume button');
		volumeBtnMenu.appendItem('Default', () => {
			grSet.showVolumeBtn_default = !grSet.showVolumeBtn_default;
			grm.ui.resizeArtwork(true);
			updateButtons();
		}, { is_checked: grSet.showVolumeBtn_default });
		volumeBtnMenu.appendItem('Artwork', () => {
			grSet.showVolumeBtn_artwork = !grSet.showVolumeBtn_artwork;
			grm.ui.resizeArtwork(true);
			updateButtons();
		}, { is_checked: grSet.showVolumeBtn_artwork });
		volumeBtnMenu.appendItem('Compact', () => {
			grSet.showVolumeBtn_compact = !grSet.showVolumeBtn_compact;
			grm.ui.resizeArtwork(true);
			updateButtons();
		}, { is_checked: grSet.showVolumeBtn_compact });
		volumeBtnMenu.separator();
		volumeBtnMenu.appendItem('Auto-hide bar', () => {
			grSet.autoHideVolumeBar = !grSet.autoHideVolumeBar;
			grm.ui.resizeArtwork(true);
			updateButtons();
		}, { is_checked: grSet.autoHideVolumeBar });
		transportButtonDisplayMenu.append(volumeBtnMenu);
		transportButtonDisplayMenu.separator();

		// * SHOW PLAYBACK TIME IN LOWER BAR * //
		const playbackTimeMenu = new ContextMenu('Show playback time');
		playbackTimeMenu.appendItem('Default', () => {
			grSet.showPlaybackTime_default = !grSet.showPlaybackTime_default;
			updateButtons();
		}, { is_checked: grSet.showPlaybackTime_default });
		playbackTimeMenu.appendItem('Artwork', () => {
			grSet.showPlaybackTime_artwork = !grSet.showPlaybackTime_artwork;
			updateButtons();
		}, { is_checked: grSet.showPlaybackTime_artwork });
		playbackTimeMenu.appendItem('Compact', () => {
			grSet.showPlaybackTime_compact = !grSet.showPlaybackTime_compact;
			updateButtons();
		}, { is_checked: grSet.showPlaybackTime_compact });
		transportButtonDisplayMenu.append(playbackTimeMenu);

		// * SHOW ARTIST IN LOWER BAR * //
		const showArtistMenu = new ContextMenu('Show artist');
		showArtistMenu.appendItem('Default', () => {
			grSet.showLowerBarArtist_default = !grSet.showLowerBarArtist_default;
			RepaintWindow();
		}, { is_checked: grSet.showLowerBarArtist_default });
		showArtistMenu.appendItem('Artwork', () => {
			grSet.showLowerBarArtist_artwork = !grSet.showLowerBarArtist_artwork;
			RepaintWindow();
		}, { is_checked: grSet.showLowerBarArtist_artwork });
		showArtistMenu.appendItem('Compact', () => {
			grSet.showLowerBarArtist_compact = !grSet.showLowerBarArtist_compact;
			RepaintWindow();
		}, { is_checked: grSet.showLowerBarArtist_compact });
		transportButtonDisplayMenu.append(showArtistMenu);

		// * SHOW TRACK NUMBER IN LOWER BAR * //
		const showTrackNumberMenu = new ContextMenu('Show track number');
		showTrackNumberMenu.appendItem('Default', () => {
			grSet.showLowerBarTrackNum_default = !grSet.showLowerBarTrackNum_default;
			on_metadb_changed();
			RepaintWindow();
		}, { is_checked: grSet.showLowerBarTrackNum_default });
		showTrackNumberMenu.appendItem('Artwork', () => {
			grSet.showLowerBarTrackNum_artwork = !grSet.showLowerBarTrackNum_artwork;
			on_metadb_changed();
			RepaintWindow();
		}, { is_checked: grSet.showLowerBarTrackNum_artwork });
		showTrackNumberMenu.appendItem('Compact', () => {
			grSet.showLowerBarTrackNum_compact = !grSet.showLowerBarTrackNum_compact;
			on_metadb_changed();
			RepaintWindow();
		}, { is_checked: grSet.showLowerBarTrackNum_compact });
		transportButtonDisplayMenu.append(showTrackNumberMenu);

		// * SHOW SONG TITLE IN LOWER BAR * //
		const showTitleMenu = new ContextMenu('Show song title');
		showTitleMenu.appendItem('Default', () => {
			grSet.showLowerBarTitle_default = !grSet.showLowerBarTitle_default;
			RepaintWindow();
		}, { is_checked: grSet.showLowerBarTitle_default });
		showTitleMenu.appendItem('Artwork', () => {
			grSet.showLowerBarTitle_artwork = !grSet.showLowerBarTitle_artwork;
			RepaintWindow();
		}, { is_checked: grSet.showLowerBarTitle_artwork });
		showTitleMenu.appendItem('Compact', () => {
			grSet.showLowerBarTitle_compact = !grSet.showLowerBarTitle_compact;
			RepaintWindow();
		}, { is_checked: grSet.showLowerBarTitle_compact });
		transportButtonDisplayMenu.append(showTitleMenu);

		// * SHOW COMPOSER IN LOWER BAR * //
		const showComposerMenu = new ContextMenu('Show composer');
		showComposerMenu.appendItem('Default', () => {
			grSet.showLowerBarComposer_default = !grSet.showLowerBarComposer_default;
			RepaintWindow();
		}, { is_checked: grSet.showLowerBarComposer_default });
		showComposerMenu.appendItem('Artwork', () => {
			grSet.showLowerBarComposer_artwork = !grSet.showLowerBarComposer_artwork;
			RepaintWindow();
		}, { is_checked: grSet.showLowerBarComposer_artwork });
		showComposerMenu.appendItem('Compact', () => {
			grSet.showLowerBarComposer_compact = !grSet.showLowerBarComposer_compact;
			RepaintWindow();
		}, { is_checked: grSet.showLowerBarComposer_compact });
		transportButtonDisplayMenu.append(showComposerMenu);

		// * SHOW ARTIST COUNTRY FLAGS IN LOWER BAR * //
		const showArtistFlagsMenu = new ContextMenu('Show artist country flags');
		showArtistFlagsMenu.appendItem('Default', () => {
			grSet.showLowerBarArtistFlags_default = !grSet.showLowerBarArtistFlags_default;
			grm.ui.loadCountryFlags();
			RepaintWindow();
		}, { is_checked: grSet.showLowerBarArtistFlags_default });
		showArtistFlagsMenu.appendItem('Artwork', () => {
			grSet.showLowerBarArtistFlags_artwork = !grSet.showLowerBarArtistFlags_artwork;
			grm.ui.loadCountryFlags();
			RepaintWindow();
		}, { is_checked: grSet.showLowerBarArtistFlags_artwork });
		showArtistFlagsMenu.appendItem('Compact', () => {
			grSet.showLowerBarArtistFlags_compact = !grSet.showLowerBarArtistFlags_compact;
			grm.ui.loadCountryFlags();
			RepaintWindow();
		}, { is_checked: grSet.showLowerBarArtistFlags_compact });
		transportButtonDisplayMenu.append(showArtistFlagsMenu);

		// * SHOW SOFTWARE VERSION IN LOWER BAR * //
		const showSoftwareVersionMenu = new ContextMenu('Show software version');
		showSoftwareVersionMenu.appendItem('Default', () => {
			grSet.showLowerBarVersion_default = !grSet.showLowerBarVersion_default;
			grm.ui.initMain();
		}, { is_checked: grSet.showLowerBarVersion_default });
		showSoftwareVersionMenu.appendItem('Artwork', () => {
			grSet.showLowerBarVersion_artwork = !grSet.showLowerBarVersion_artwork;
			grm.ui.initMain();
		}, { is_checked: grSet.showLowerBarVersion_artwork });
		showSoftwareVersionMenu.appendItem('Compact', () => {
			grSet.showLowerBarVersion_compact = !grSet.showLowerBarVersion_compact;
			grm.ui.initMain();
		}, { is_checked: grSet.showLowerBarVersion_compact });
		transportButtonDisplayMenu.append(showSoftwareVersionMenu);
		transportButtonDisplayMenu.separator();

		// * SHOW PROGRESS BAR * //
		const progressBarMenu = new ContextMenu('Show progress bar');
		progressBarMenu.appendItem('Default', () => {
			grSet.showProgressBar_default = !grSet.showProgressBar_default;
			updateSeekbar();
		}, { is_checked: grSet.showProgressBar_default });
		progressBarMenu.appendItem('Artwork', () => {
			grSet.showProgressBar_artwork = !grSet.showProgressBar_artwork;
			updateSeekbar();
		}, { is_checked: grSet.showProgressBar_artwork });
		progressBarMenu.appendItem('Compact', () => {
			grSet.showProgressBar_compact = !grSet.showProgressBar_compact;
			updateSeekbar();
		}, { is_checked: grSet.showProgressBar_compact });
		transportButtonDisplayMenu.append(progressBarMenu);

		// * SHOW PEAKMETER BAR * //
		const peakmeterBarMenu = new ContextMenu('Show peakmeter bar');
		peakmeterBarMenu.appendItem('Default', () => {
			grSet.showPeakmeterBar_default = !grSet.showPeakmeterBar_default;
			updateSeekbar();
		}, { is_checked: grSet.showPeakmeterBar_default });
		peakmeterBarMenu.appendItem('Artwork', () => {
			grSet.showPeakmeterBar_artwork = !grSet.showPeakmeterBar_artwork;
			updateSeekbar();
		}, { is_checked: grSet.showPeakmeterBar_artwork });
		peakmeterBarMenu.appendItem('Compact', () => {
			grSet.showPeakmeterBar_compact = !grSet.showPeakmeterBar_compact;
			updateSeekbar();
		}, { is_checked: grSet.showPeakmeterBar_compact });
		transportButtonDisplayMenu.append(peakmeterBarMenu);

		// * SHOW WAVEFORM BAR * //
		const waveformBarMenu = new ContextMenu('Show waveform bar');
		waveformBarMenu.appendItem('Default', () => {
			grSet.showWaveformBar_default = !grSet.showWaveformBar_default;
			updateSeekbar();
		}, { is_checked: grSet.showWaveformBar_default });
		waveformBarMenu.appendItem('Artwork', () => {
			grSet.showWaveformBar_artwork = !grSet.showWaveformBar_artwork;
			updateSeekbar();
		}, { is_checked: grSet.showWaveformBar_artwork });
		waveformBarMenu.appendItem('Compact', () => {
			grSet.showWaveformBar_compact = !grSet.showWaveformBar_compact;
			updateSeekbar();
		}, { is_checked: grSet.showWaveformBar_compact });
		transportButtonDisplayMenu.append(waveformBarMenu);

		cm.append(transportButtonDisplayMenu);
		cm.separator();

		// * BUTTON CONTROLS * //
		const buttonControlsMenu = new ContextMenu('Controls');
		buttonControlsMenu.appendItem('Add tracks playlist', () => { grm.inputBox.addTracksPlaylist(); });
		buttonControlsMenu.appendItem('Switch to playlist when adding songs', () => {
			grSet.addTracksPlaylistSwitch = !grSet.addTracksPlaylistSwitch;
		}, { is_checked: grSet.addTracksPlaylistSwitch });
		cm.append(buttonControlsMenu);
		cm.separator();

		// * STYLES - TRANSPORT BUTTONS * //
		const transportButtonStyleMenu = new ContextMenu('Style buttons');
		const transportButtonStyles = [
			['Default', 'default'],
			['Bevel', 'bevel'],
			['Inner', 'inner'],
			['Emboss', 'emboss'],
			['Minimal', 'minimal']
		];
		for (const style of transportButtonStyles) {
			transportButtonStyleMenu.appendItem(style[0], ((style) => {
				grSet.styleTransportButtons = style;
				if (!grSet.themeSandbox) grSet.savedStyleTransportButtons = grSet.styleTransportButtons = style; else grSet.styleTransportButtons = style;
				grm.ui.updateStyle();
			}).bind(null, style[1]), { is_radio_checked: style[1] === grSet.styleTransportButtons });
		}
		cm.append(transportButtonStyleMenu);

		// * STYLES - VOLUME BAR * //
		const transportVolumeBarStyleMenu = new ContextMenu('Style volume bar');
		const transportVolumeBarStylesDesignMenu = new ContextMenu('Design');
		const transportVolumeBarStylesDesign = [['Default', 'default'], ['Rounded', 'rounded']];
		for (const design of transportVolumeBarStylesDesign) {
			transportVolumeBarStylesDesignMenu.appendItem(design[0], ((design) => {
				grSet.styleVolumeBarDesign = design;
				if (!grSet.themeSandbox) grSet.savedStyleVolumeBarDesign = grSet.styleVolumeBarDesign = design; else grSet.styleVolumeBarDesign = design;
				grm.ui.updateStyle();
			}).bind(null, design[1]), { is_radio_checked: design[1] === grSet.styleVolumeBarDesign });
		}
		transportVolumeBarStyleMenu.append(transportVolumeBarStylesDesignMenu);

		const transportVolumeBarStylesBgMenu = new ContextMenu('Background');
		const transportVolumeBarStylesBg = [['Default', 'default'], ['Bevel', 'bevel'], ['Inner', 'inner']];
		for (const style of transportVolumeBarStylesBg) {
			transportVolumeBarStylesBgMenu.appendItem(style[0], ((style) => {
				grSet.styleVolumeBar = style;
				if (!grSet.themeSandbox) grSet.savedStyleVolumeBar = grSet.styleVolumeBar = style; else grSet.styleVolumeBar = style;
				grm.ui.updateStyle();
			}).bind(null, style[1]), { is_radio_checked: style[1] === grSet.styleVolumeBar });
		}
		transportVolumeBarStyleMenu.append(transportVolumeBarStylesBgMenu);

		const transportVolumeBarStylesFillMenu = new ContextMenu('Fill');
		const transportVolumeBarStylesFill = [['Default', 'default'], ['Bevel', 'bevel'], ['Inner', 'inner']];
		for (const style of transportVolumeBarStylesFill) {
			transportVolumeBarStylesFillMenu.appendItem(style[0], ((style) => {
				grSet.styleVolumeBarFill = style;
				if (!grSet.themeSandbox) grSet.savedStyleVolumeBarFill = grSet.styleVolumeBarFill = style; else grSet.styleVolumeBarFill = style;
				grm.ui.updateStyle();
			}).bind(null, style[1]), { is_radio_checked: style[1] === grSet.styleVolumeBarFill });
		}
		transportVolumeBarStyleMenu.append(transportVolumeBarStylesFillMenu);
		cm.append(transportVolumeBarStyleMenu);
	}

	/**
	 * Contains all seekbar ( progress bar, peakmeter bar and waveform bar ) top menu "Options" for quick access.
	 * Displayed when right clicking on the lower bar.
	 * @param {ContextMenu} cm - The context menu object.
	 */
	contextMenuSeekbar(cm) {
		const seekbar = [['Progress bar', 'progressbar'], ['Peakmeter bar', 'peakmeterbar'], ['Waveform bar', 'waveformbar']];
		for (const type of seekbar) {
			cm.appendItem(type[0], () => {
				grSet.seekbar = type[1];
				grm.ui.initMetrics();
				grm.ui.setProgressBarRefresh();
				if (grSet.seekbar === 'waveformbar') grm.waveBar.updateBar();
				RepaintWindow();
			}, { is_radio_checked: type[1] === grSet.seekbar });
		}

		// * PROGRESS BAR * //
		if (grSet.seekbar === 'progressbar') {
			cm.separator();
			const progressBarStyleMenu = new ContextMenu('Style');
			const progressBarStyle = [['Default', 'default'], ['Rounded', 'rounded'], ['Lines', 'lines'], ['Blocks', 'blocks'], ['Dots', 'dots'], ['Thin', 'thin']];
			for (const sec of progressBarStyle) {
				progressBarStyleMenu.appendItem(sec[0], () => {
					grSet.styleProgressBarDesign = sec[1];
					grm.ui.initMetrics();
					RepaintWindow();
				}, { is_radio_checked: sec[1] === grSet.styleProgressBarDesign });
			}
			cm.append(progressBarStyleMenu);

			const progressBarSeekSpeedMenu = new ContextMenu('Mouse wheel seek speed');
			const progressBarSeekSpeed = [['  1 sec', 1], ['  2 sec', 2], ['  3 sec', 3], ['  4 sec', 4], ['  5 sec (default)', 5], ['  6 sec', 6], ['  7 sec', 7], ['  8 sec', 8], ['  9 sec', 9], ['10 sec', 10]];
			for (const sec of progressBarSeekSpeed) {
				progressBarSeekSpeedMenu.appendItem(sec[0], () => {
					grSet.progressBarWheelSeekSpeed = sec[1];
				}, { is_radio_checked: sec[1] === grSet.progressBarWheelSeekSpeed });
			}
			cm.append(progressBarSeekSpeedMenu);

			const progressBarRefreshMenu = new ContextMenu('Refresh rate');
			const progressBarRefresh = [['1000 ms (very slow CPU)', 1000], ['  500 ms', 500], ['  333 ms', 333], ['  Variable (default)', 'variable'], ['  250 ms', 250], ['  200 ms', 200], ['  150 ms', 150], ['  100 ms', 100], ['    60 ms', 60], ['    30 ms (very fast CPU)', 30]];
			for (const rate of progressBarRefresh) {
				progressBarRefreshMenu.appendItem(rate[0], () => {
					grSet.progressBarRefreshRate = rate[1];
					grm.ui.setProgressBarRefresh();
				}, { is_radio_checked: rate[1] === grSet.progressBarRefreshRate });
			}
			cm.append(progressBarRefreshMenu);
		}
		// * PEAKMETER BAR * //
		else if (grSet.seekbar === 'peakmeterbar') {
			cm.separator();
			const peakmeterBarDesignMenu = new ContextMenu('Style');
			const peakmeterBarDesign = [['Horizontal', 'horizontal'], ['Horizontal center', 'horizontal_center'], ['Vertical', 'vertical']];
			for (const design of peakmeterBarDesign) {
				peakmeterBarDesignMenu.appendItem(design[0], () => {
					grSet.peakmeterBarDesign = design[1];
					grm.peakBar.on_size(grm.ui.ww, grm.ui.wh);
					RepaintWindow();
				}, { is_radio_checked: design[1] === grSet.peakmeterBarDesign });
			}
			cm.append(peakmeterBarDesignMenu);

			if (grSet.peakmeterBarDesign === 'vertical') {
				const peakmeterBarVertSizeMenu = new ContextMenu('Size');
				const peakmeterBarVertSize = [['  0 px', 0], ['  2 px', 2], ['  4 px', 4], ['  6 px', 6], ['  8 px', 8], ['10 px', 10], [grSet.layout !== 'default' ? '12 px (default)' : '12 px', 12], ['14 px', 14], ['16 px', 16], ['18 px', 18], [grSet.layout !== 'default' ? '20 px' : '20 px (default)', 20], ['25 px', 25], ['30 px', 30], ['35 px', 35], ['40 px', 40], ['Minimum', 'min']];
				for (const size of peakmeterBarVertSize) {
					peakmeterBarVertSizeMenu.appendItem(size[0], () => {
						grSet.peakmeterBarVertSize = size[1];
						grm.peakBar = new PeakmeterBar(grm.ui.ww, grm.ui.wh);
						RepaintWindow();
					}, { is_radio_checked: size[1] === grSet.peakmeterBarVertSize });
				}
				cm.append(peakmeterBarVertSizeMenu);

				const peakmeterBarVertDbRangeMenu = new ContextMenu('Decibel range');
				const peakmeterBarVertDbRange = [['2 to -20 db (default)', 220], ['2 to -15 db', 215], ['2 to -10 db', 210], ['3 to -20 db', 320], ['3 to -15 db', 315], ['3 to -10 db', 310], ['5 to -20 db', 520], ['5 to -15 db', 515], ['5 to -10 db', 510]];
				for (const range of peakmeterBarVertDbRange) {
					peakmeterBarVertDbRangeMenu.appendItem(range[0], () => {
						grSet.peakmeterBarVertDbRange = range[1];
						grm.peakBar = new PeakmeterBar(grm.ui.ww, grm.ui.wh);
						RepaintWindow();
					}, { is_radio_checked: range[1] === grSet.peakmeterBarVertDbRange });
				}
				cm.append(peakmeterBarVertDbRangeMenu);
			}

			const peakmeterBarDisplayMenu = new ContextMenu('Display');
			if (grSet.peakmeterBarDesign === 'horizontal' || grSet.peakmeterBarDesign === 'horizontal_center') {
				peakmeterBarDisplayMenu.appendItem('Show over bars', () => {
					grSet.peakmeterBarOverBars = !grSet.peakmeterBarOverBars;
					RepaintWindow();
				}, { is_checked: grSet.peakmeterBarOverBars });
				peakmeterBarDisplayMenu.separator();
				peakmeterBarDisplayMenu.appendItem('Show outer bars', () => {
					grSet.peakmeterBarOuterBars = !grSet.peakmeterBarOuterBars;
					RepaintWindow();
				}, { is_checked: grSet.peakmeterBarOuterBars });
				peakmeterBarDisplayMenu.appendItem('Show outer peaks', () => {
					grSet.peakmeterBarOuterPeaks = !grSet.peakmeterBarOuterPeaks;
					RepaintWindow();
				}, { is_checked: grSet.peakmeterBarOuterPeaks });
				peakmeterBarDisplayMenu.separator();
				peakmeterBarDisplayMenu.appendItem('Show main bars', () => {
					grSet.peakmeterBarMainBars = !grSet.peakmeterBarMainBars;
					RepaintWindow();
				}, { is_checked: grSet.peakmeterBarMainBars });
				peakmeterBarDisplayMenu.appendItem('Show main peaks', () => {
					grSet.peakmeterBarMainPeaks = !grSet.peakmeterBarMainPeaks;
					RepaintWindow();
				}, { is_checked: grSet.peakmeterBarMainPeaks });
				peakmeterBarDisplayMenu.separator();
				peakmeterBarDisplayMenu.appendItem('Show middle bars', () => {
					grSet.peakmeterBarMiddleBars = !grSet.peakmeterBarMiddleBars;
					RepaintWindow();
				}, { is_checked: grSet.peakmeterBarMiddleBars });
			}

			peakmeterBarDisplayMenu.appendItem('Show progress bar', () => {
				grSet.peakmeterBarProgBar = !grSet.peakmeterBarProgBar;
				RepaintWindow();
			}, { is_checked: grSet.peakmeterBarProgBar });

			if (grSet.peakmeterBarDesign === 'horizontal' || grSet.peakmeterBarDesign === 'horizontal_center') {
				peakmeterBarDisplayMenu.separator();
				peakmeterBarDisplayMenu.appendItem('Show gaps', () => {
					grSet.peakmeterBarGaps = !grSet.peakmeterBarGaps;
					grm.peakBar.on_size(grm.ui.ww, grm.ui.wh);
					RepaintWindow();
				}, { is_checked: grSet.peakmeterBarGaps });
				peakmeterBarDisplayMenu.appendItem('Show grid', () => {
					grSet.peakmeterBarGrid = !grSet.peakmeterBarGrid;
					RepaintWindow();
				}, { is_checked: grSet.peakmeterBarGrid });
			}

			if (grSet.peakmeterBarDesign === 'vertical') {
				peakmeterBarDisplayMenu.appendItem('Show peaks', () => {
					grSet.peakmeterBarVertPeaks = !grSet.peakmeterBarVertPeaks;
					RepaintWindow();
				}, { is_checked: grSet.peakmeterBarVertPeaks });
				peakmeterBarDisplayMenu.appendItem('Show baseline', () => {
					grSet.peakmeterBarVertBaseline = !grSet.peakmeterBarVertBaseline;
					RepaintWindow();
				}, { is_checked: grSet.peakmeterBarVertBaseline });
			}

			peakmeterBarDisplayMenu.appendItem(grSet.layout !== 'default' ? 'Show info (only available in Default layout)' : 'Show info', () => {
				grSet.peakmeterBarInfo = !grSet.peakmeterBarInfo;
				RepaintWindow();
			}, { is_checked: grSet.peakmeterBarInfo });

			cm.append(peakmeterBarDisplayMenu);

			const peakmeterBarRefreshMenu = new ContextMenu('Refresh rate');
			const peakmeterBarRefresh = [['200 ms (very slow CPU)', 200], ['150 ms', 150], ['120 ms', 120], ['100 ms', 100], ['  80 ms (default)', 80], ['  60 ms', 60], ['  30 ms (very fast CPU)', 30]];
			for (const rate of peakmeterBarRefresh) {
				peakmeterBarRefreshMenu.appendItem(rate[0], () => {
					grSet.peakmeterBarRefreshRate = rate[1];
					grm.ui.setProgressBarRefresh();
				}, { is_radio_checked: rate[1] === grSet.peakmeterBarRefreshRate });
			}
			cm.append(peakmeterBarRefreshMenu);
		}
		// * WAVEFORM BAR * //
		else if (grSet.seekbar === 'waveformbar') {
			cm.separator();
			const waveformBarAnalysisMenu = new ContextMenu('Analysis');
			const waveformBarAnalysis = [['RMS level', 'rms_level'], ['Peak level', 'peak_level'], ['RMS peak', 'rms_peak']];
			for (const type of waveformBarAnalysis) {
				waveformBarAnalysisMenu.appendItem(type[0] + (grSet.waveformBarMode === 'ffprobe' ? '' : '\t (ffprobe only)'), () => {
					grSet.waveformBarAnalysis = type[1];
					grm.waveBar.updateConfig({ preset: { analysisMode: type[1] } });
					grm.waveBar.updateBar();
					RepaintWindow();
				}, {
					is_grayed_out: grSet.waveformBarMode !== 'ffprobe',
					is_radio_checked: type[1] === grSet.waveformBarAnalysis
					}
				);
			}
			waveformBarAnalysisMenu.separator();
			waveformBarAnalysisMenu.appendItem('Delete analysis files', () => {
				const msg = 'Do you want to delete all waveform bar cache?\n\nThis will permanently delete analyzed files.\n\nContinue?\n\n\n';

				ShowPopup(false, false, msg, 'Yes', 'No', (confirmed) => {
					if (confirmed) DeleteWaveformBarCache();
				});
			});
			waveformBarAnalysisMenu.separator();
			waveformBarAnalysisMenu.appendItem('Auto-delete analysis files', () => {
				grSet.waveformBarAutoDelete = !grSet.waveformBarAutoDelete;
				grm.waveBar.updateConfig({ analysis: { autoDelete: grSet.waveformBarAutoDelete } });
			}, { is_grayed_out: grSet.waveformBarMode === 'visualizer' });
			cm.append(waveformBarAnalysisMenu);

			const waveformBarModeMenu = new ContextMenu('Mode');
			const waveformBarMode = [['FFprobe', 'ffprobe'], ['Audiowaveform', 'audiowaveform'], ['Visualizer', 'visualizer']];
			if (!IsFile(grm.waveBar.binaries.ffprobe)) {
				waveformBarModeMenu.appendItem('Download FFprobe', () => {
					grm.waveBar.getFFprobe();
				});
				waveformBarModeMenu.separator();
			}
			for (const mode of waveformBarMode) {
				const found = IsFile(grm.waveBar.binaries[mode[1]]);
				waveformBarModeMenu.appendItem(mode[0] + (found ? '' : '\t(not found)'), () => {
					grSet.waveformBarMode = mode[1];
					grm.waveBar.updateConfig({ analysis: { binaryMode: grSet.waveformBarMode } });
					grm.waveBar.updateBar(true);
					RepaintWindow();
				}, {
					is_grayed_out: !found,
					is_radio_checked: mode[1] === grSet.waveformBarMode
					}
				);
			}
			cm.append(waveformBarModeMenu);

			const waveformBarDesignMenu = new ContextMenu('Style');
			const waveformBarDesign = [['Waveform', 'waveform'], ['Bars', 'bars'], ['Dots', 'dots'], ['Halfbars', 'halfbars']];
			for (const design of waveformBarDesign) {
				waveformBarDesignMenu.appendItem(design[0], () => {
					grSet.waveformBarDesign = design[1];
					grm.waveBar.updateConfig({ preset: { barDesign: design[1] } });
				}, { is_radio_checked: design[1] === grSet.waveformBarDesign });
			}
			cm.append(waveformBarDesignMenu);

			const waveformBarSizeMenu = new ContextMenu('Size');
			const waveformBarSizeWaveMenu = new ContextMenu('Waveform');
			const waveformBarSizeWave = [['1', 1], ['2', 2], ['3 (Default)', 3], ['4', 4], ['5', 5]];
			for (const size of waveformBarSizeWave) {
				waveformBarSizeWaveMenu.appendItem(size[0], () => {
					grSet.waveformBarSizeWave = size[1];
					grm.waveBar.updateConfig({ ui: { sizeWave: size[1] } });
					grm.waveBar.updateBar();
					RepaintWindow();
				}, { is_radio_checked: size[1] === grSet.waveformBarSizeWave });
			}
			waveformBarSizeMenu.append(waveformBarSizeWaveMenu);
			const waveformBarSizeBarsMenu = new ContextMenu('Bars');
			const waveformBarSizeBars = [['1 (Default)', 1], ['2', 2], ['3', 3], ['4', 4], ['5', 5]];
			for (const size of waveformBarSizeBars) {
				waveformBarSizeBarsMenu.appendItem(size[0], () => {
					grSet.waveformBarSizeBars = size[1];
					grm.waveBar.updateConfig({ ui: { sizeBars: size[1] } });
					grm.waveBar.updateBar();
					RepaintWindow();
				}, { is_radio_checked: size[1] === grSet.waveformBarSizeBars });
			}
			waveformBarSizeMenu.append(waveformBarSizeBarsMenu);
			const waveformBarSizeDotsMenu = new ContextMenu('Dots');
			const waveformBarSizeDots = [['1', 1], ['2 (Default)', 2], ['3', 3], ['4', 4], ['5', 5]];
			for (const size of waveformBarSizeDots) {
				waveformBarSizeDotsMenu.appendItem(size[0], () => {
					grSet.waveformBarSizeDots = size[1];
					grm.waveBar.updateConfig({ ui: { sizeDots: size[1] } });
					grm.waveBar.updateBar();
					RepaintWindow();
				}, { is_radio_checked: size[1] === grSet.waveformBarSizeDots });
			}
			waveformBarSizeMenu.append(waveformBarSizeDotsMenu);
			const waveformBarSizeHalfMenu = new ContextMenu('Halfbars');
			const waveformBarSizeHalf = [['1', 1], ['2', 2], ['3', 3], ['4 (Default)', 4], ['5', 5]];
			for (const size of waveformBarSizeHalf) {
				waveformBarSizeHalfMenu.appendItem(size[0], () => {
					grSet.waveformBarSizeHalf = size[1];
					grm.waveBar.updateConfig({ ui: { sizeHalf: size[1] } });
					grm.waveBar.updateBar();
					RepaintWindow();
				}, { is_radio_checked: size[1] === grSet.waveformBarSizeHalf });
			}
			waveformBarSizeMenu.append(waveformBarSizeHalfMenu);
			waveformBarSizeMenu.separator();
			waveformBarSizeMenu.appendItem('Normalize width', () => {
				grSet.waveformBarSizeNormalize = !grSet.waveformBarSizeNormalize;
				grm.waveBar.updateConfig({ ui: { sizeNormalizeWidth: grSet.waveformBarSizeNormalize } });
				grm.waveBar.updateBar();
				RepaintWindow();
			}, { is_checked: grSet.waveformBarSizeNormalize });
			cm.append(waveformBarSizeMenu);

			const waveformBarDisplayMenu = new ContextMenu('Display');
			const waveformBarDisplay = [['Full', 'full'], ['Partial', 'partial']];
			for (const paint of waveformBarDisplay) {
				waveformBarDisplayMenu.appendItem(paint[0], () => {
					grSet.waveformBarPaint = paint[1];
					grm.waveBar.updateConfig({ preset: { paintMode: paint[1] } });
				}, { is_radio_checked: paint[1] === grSet.waveformBarPaint });
			}
			waveformBarDisplayMenu.separator();

			waveformBarDisplayMenu.appendItem(`Prepaint${grSet.waveformBarPaint === 'full' ? '\t(partial only)' : ''}`, () => {
				grSet.waveformBarPrepaint = !grSet.waveformBarPrepaint;
				grm.waveBar.updateConfig({ preset: { prepaint: grSet.waveformBarPrepaint } });
			}, {
				is_grayed_out: grSet.waveformBarPaint === 'full',
				is_checked: grSet.waveformBarPrepaint
				}
			);

			const waveformBarPrepaintMenuDisabled = grSet.waveformBarPaint === 'full' || grSet.waveformBarMode === 'visualizer' || !grSet.waveformBarPrepaint;
			const waveformBarPrepaintMenu = new ContextMenu('Prepaint front', { is_grayed_out: waveformBarPrepaintMenuDisabled });
			const waveformBarPrepaint = [['  2 secs', 2], ['  5 secs', 5], ['10 secs', 10], ['     Full', Infinity]];
			for (const time of waveformBarPrepaint) {
				waveformBarPrepaintMenu.appendItem(time[0], () => {
					grSet.waveformBarPrepaintFront = time[1];
					grm.waveBar.updateConfig({ preset: { prepaintFront: time[1] } });
				}, {
					is_grayed_out: waveformBarPrepaintMenuDisabled,
					is_radio_checked: time[1] === grSet.waveformBarPrepaintFront
					}
				);
			}
			waveformBarDisplayMenu.append(waveformBarPrepaintMenu);
			waveformBarDisplayMenu.separator();

			waveformBarDisplayMenu.appendItem('Animate', () => {
				grSet.waveformBarAnimate = !grSet.waveformBarAnimate;
				grm.waveBar.updateConfig({ preset: { animate: grSet.waveformBarAnimate } });
			}, { is_checked: grSet.waveformBarAnimate });

			waveformBarDisplayMenu.appendItem(`Use BPM${grSet.waveformBarPaint === 'full' && grSet.waveformBarMode !== 'visualizer' ? '\t(partial only)' : ''}`, () => {
				grSet.waveformBarBPM = !grSet.waveformBarBPM;
				if (grSet.waveformBarBPM) grSet.waveformBarRefreshRateVar = true;
				grm.waveBar.updateConfig({
					preset: { useBPM: grSet.waveformBarBPM },
					ui: { refreshRateVar: grSet.waveformBarRefreshRateVar }
				});
				}, {
					is_grayed_out: !(grSet.waveformBarPaint === 'partial' && grSet.waveformBarPrepaint || grSet.waveformBarMode === 'visualizer'),
					is_checked: grSet.waveformBarBPM
				}
			);

			waveformBarDisplayMenu.appendItem('Invert halfbars', () => {
				grSet.waveformBarInvertHalfbars = !grSet.waveformBarInvertHalfbars;
				grm.waveBar.updateConfig({ preset: { invertHalfbars: grSet.waveformBarInvertHalfbars } });
			}, { is_checked: grSet.waveformBarInvertHalfbars });
			waveformBarDisplayMenu.separator();

			waveformBarDisplayMenu.appendItem('Show indicator', () => {
				grSet.waveformBarIndicator = !grSet.waveformBarIndicator;
				grm.waveBar.updateConfig({ preset: { indicator: grSet.waveformBarIndicator } });
			}, { is_checked: grSet.waveformBarIndicator });
			cm.append(waveformBarDisplayMenu);

			const waveformBarRefreshMenuDisabled = !(grSet.waveformBarPaint === 'partial' && grSet.waveformBarPrepaint || grSet.waveformBarMode === 'visualizer');
			const waveformBarRefreshMenu = new ContextMenu(`Refresh rate${grSet.waveformBarPaint === 'full' && grSet.waveformBarMode !== 'visualizer' ? '\t(partial only)' : ''}`, { is_grayed_out: waveformBarRefreshMenuDisabled });
			const waveformBarRefresh = [['1000 ms (very slow CPU)', 1000], ['  500 ms', 500], ['  200 ms', 200], ['  100 ms (default)', 100], ['    80 ms', 80], ['    60 ms', 60], ['    30 ms (very fast CPU)', 30]];
			for (const rate of waveformBarRefresh) {
				waveformBarRefreshMenu.appendItem(rate[0], () => {
					grSet.waveformBarRefreshRate = rate[1];
					grm.waveBar.updateConfig({ ui: { refreshRate: rate[1] } });
				}, {
					is_grayed_out: waveformBarRefreshMenuDisabled,
					is_radio_checked: rate[1] === grSet.waveformBarRefreshRate
					}
				);
			}
			waveformBarRefreshMenu.separator();
			waveformBarRefreshMenu.appendItem('    Variable refresh rate', () => {
				grSet.waveformBarRefreshRateVar = !grSet.waveformBarRefreshRateVar;
				grm.waveBar.updateConfig({ ui: { refreshRateVar: grSet.waveformBarRefreshRateVar } });
			}, { is_checked: grSet.waveformBarRefreshRateVar });
			cm.append(waveformBarRefreshMenu);
		}
	}
	// #endregion
}
