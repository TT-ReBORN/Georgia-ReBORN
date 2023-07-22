/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Context Menu Control                 * //
// * Author:         TT                                                  * //
// * Org. Author:    TheQwertiest                                        * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-07-22                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////////////
// * BASE OBJECT * //
/////////////////////
/**
 * The base object for creating context menus.
 */
class ContextBaseObject {
	/**
	 * @param {string} text_arg The text value that will be assigned to the `text` property of the object.
	 * @class
	 */
	constructor(text_arg) {
		/** @const {string} */
		this.text = text_arg;

		/** @type {?number} */
		this.idx = undefined;
	}

	/**
	 * @param {number} start_idx The index at which the menu should start initializing.
	 * @returns {number} The end_idx.
	 * @protected
	 * @abstract
	 */
	initialize_menu_idx(start_idx) {
		throw new LogicError('initialize_menu_idx not implemented');
	}

	/**
	 * @param {ContextMenu} parent_menu The parent of the menu being initialized.
	 * @protected
	 * @abstract
	 */
	initialize_menu(parent_menu) {
		throw new LogicError('initialize_menu not implemented');
	}

	/**
	 * @param {number} idx The index of the menu option that needs to be executed.
	 * @returns {boolean} True or false.
	 * @protected
	 * @abstract
	 */
	execute_menu(idx) {
		throw new LogicError('execute_menu not implemented');
	}
}


//////////////////////
// * CONTEXT MENU * //
//////////////////////
/**
 * Provides methods for adding items to the context menu and handling user interactions.
 */
class ContextMenu extends ContextBaseObject {
	/**
	 * Initializes properties and creates a context menu.
	 * @param {string} text_arg The text value for the constructor.
	 * @param {object} [optional_args={}] Additional parameters that can be passed to the constructor.
	 * @param {boolean=} [optional_args.is_grayed_out=false] The item will be grayed out.
	 * @param {boolean=} [optional_args.is_checked=false] The item will be checked.
	 * @extends {ContextBaseObject}
	 * @class
	 */
	constructor(text_arg, optional_args) {
		super(text_arg);

		/** @const {boolean} */
		this.is_grayed_out = !!(optional_args && optional_args.is_grayed_out);

		/** @protected */
		this.menu_items = [];

		this.cm = window.CreatePopupMenu();
	}

	// public:

	/**
	 * Adds an item to the "menu_items" array.
	 * @param {ContextBaseObject} item The item to be append to the "menu_items" array.
	 */
	append(item) {
		if (!(item instanceof ContextBaseObject)) {
			throw new InvalidTypeError('context_item', typeof item, 'instanceof ContextBaseObject');
		}

		this.menu_items.push(item);
	}

	/**
	 * Appends a new ContextItem object to the current context.
	 * @param {string} text_arg The text content of the item to be append.
	 * @param {function} callback_fn_arg A function that will be called when the appended item is clicked or activated.
	 * @param {object} [optional_args={}] Additional parameters that can be passed to the function.
	 * @param {boolean=} [optional_args.is_grayed_out=false] The item will be grayed out.
	 * @param {boolean=} [optional_args.is_checked=false] The item will be checked.
	 * @param {boolean=} [optional_args.is_radio_checked=false] The item will be radio checked.
	 */
	append_item(text_arg, callback_fn_arg, optional_args) {
		this.append(new ContextItem(text_arg, callback_fn_arg, optional_args));
	}

	/**
	 * Appends a menu separator to the current context menu.
	 */
	append_separator() {
		this.append(new ContextSeparator());
	}

	/**
	 * Checks a specific item in a menu and sets it to a radio checked state.
	 * @param {number} start_idx The starting index of the menu_items array where the radio_check should begin checking.
	 * @param {number} check_idx The index of the menu item that you want to perform a radio check on.
	 */
	radio_check(start_idx, check_idx) {
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

		item.radio_check(true);
	}

	/**
	 * Checks if the menu_items array is empty.
	 * @returns {boolean} True or false.
	 */
	is_empty() {
		return IsEmpty(this.menu_items);
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
	 * Initializes the menu index for each menu item recursively, starting from a given index.
	 * @param {number} start_idx The index at which the menu should start initializing.
	 * @returns {number} The end_idx.
	 * @protected
	 */
	initialize_menu_idx(start_idx) {
		let cur_idx = start_idx;

		this.idx = cur_idx++;
		this.menu_items.forEach((item) => {
			if (!item.initialize_menu_idx) {
				return;
			}
			cur_idx = item.initialize_menu_idx(cur_idx);
		});

		return cur_idx;
	}

	/**
	 * Initializes a menu by appending menu items to it and setting their properties based on the state of the parent menu.
	 * @param {ContextMenu} parent_menu The menu to which the current menu will be appended.
	 * @protected
	 */
	initialize_menu(parent_menu) {
		this.menu_items.forEach(item => {
			item.initialize_menu(this);
		});

		this.cm.AppendTo(parent_menu.cm, this.is_grayed_out ? MF_GRAYED : MF_STRING, this.text);
	}

	/**
	 * Executes a menu item based on the given index.
	 * @param {number} idx The index of the menu item that needs to be executed.
	 * @returns {boolean} The result of calling the `execute_menu` method on the menu item that matches the given index (`idx`).
	 * @protected
	 */
	execute_menu(idx) {
		for (let i = 0; i < this.menu_items.length; ++i) {
			const items = this.menu_items;
			const item = items[i];
			const next_item = items[i + 1];

			if (idx === item.idx || (idx > item.idx && (!next_item || idx < next_item.idx))) {
				return item.execute_menu(idx);
			}
		}
	}
}


//////////////
// * ITEM * //
//////////////
/**
 * Context menu items with various properties and methods for customization and interaction.
 */
class ContextItem extends ContextBaseObject {
	/**
	 * Initializes properties and creates a menu item.
	 * @param {string} text_arg The text value for the constructor.
	 * @param {function} callback_fn_arg A callback function that will be assigned to the`callback_fn` property.
	 * @param {object} [optional_args={}] Additional parameters that can be passed to the constructor.
	 * @param {boolean=} [optional_args.is_grayed_out=false] The item will be grayed out.
	 * @param {boolean=} [optional_args.is_checked=false] The item will be checked.
	 * @param {boolean=} [optional_args.is_radio_checked=false] The ratio item will be checked.
	 * @extends {ContextBaseObject}
	 * @class
	 */
	constructor(text_arg, callback_fn_arg, optional_args) {
		super(text_arg);

		// const
		/** @const {function} */
		this.callback_fn = callback_fn_arg;

		/** @const {boolean} */
		this.is_grayed_out = !!(optional_args && optional_args.is_grayed_out);

		this.is_checked = !!(optional_args && optional_args.is_checked);
		this.is_radio_checked = !!(optional_args && optional_args.is_radio_checked);
	}

	// public:

	/**
	 * Sets the state of the check mark ✓ in menu items.
	 * @param {boolean} is_checked_arg Whether something is checked or not.
	 */
	check(is_checked_arg) {
		this.is_checked = is_checked_arg;
	}

	/**
	 * Sets the state of the radio mark 🔘 in menu items.
	 * @param {boolean} is_checked_arg Whether something is checked or not.
	 */
	radio_check(is_checked_arg) {
		this.is_radio_checked = is_checked_arg;
	}

	// protected:

	/**
	 * Initializes a menu index and returns the incremented value.
	 * @param {number} start_idx The initial value for the menu index.
	 * @returns {number} The end_idx.
	 * @protected
	 */
	initialize_menu_idx(start_idx) {
		this.idx = start_idx;
		return this.idx + 1;
	}

	/**
	 * Initializes a menu item by appending it to a parent menu and setting its properties such as grayed out, checked, or radio checked.
	 * @param {ContextMenu} parent_menu The menu object that the current menu item belongs to.
	 * @protected
	 */
	initialize_menu(parent_menu) {
		parent_menu.cm.AppendMenuItem(this.is_grayed_out ? MF_GRAYED : MF_STRING, this.idx, this.text);
		if (this.is_checked) {
			parent_menu.cm.CheckMenuItem(this.idx, true);
		}
		else if (this.is_radio_checked) {
			parent_menu.cm.CheckMenuRadioItem(this.idx, this.idx, this.idx);
		}
	}

	/**
	 * Executes a menu item's callback function if the provided index matches the stored index.
	 * @param {number} idx The index of the menu item that needs to be executed.
	 * @returns {boolean} True or false.
	 * @protected
	 */
	execute_menu(idx) {
		if (this.idx !== idx) {
			return false;
		}

		this.callback_fn();
		return true;
	}
}


///////////////////
// * SEPARATOR * //
///////////////////
/**
 * Handles a separator in a context menu.
 */
class ContextSeparator extends ContextBaseObject {
	/**
	 * @extends {ContextBaseObject}
	 * @class
	 */
	constructor() {
		super('');
	}

	/**
	 * Initializes a menu index and returns the incremented value.
	 * @param {number} start_idx The initial value for the menu index.
	 * @returns {number} The end_idx.
	 * @protected
	 */
	initialize_menu_idx(start_idx) {
		this.idx = start_idx;
		return this.idx + 1;
	}

	/**
	 * Initializes a menu by appending a separator to the parent menu.
	 * @param {ContextMenu} parent_menu The menu to which the new menu item will be added as a child.
	 * @protected
	 */
	initialize_menu(parent_menu) {
		parent_menu.cm.AppendMenuSeparator();
	}

	/**
	 * Execute menu returns false.
	 * @param {number} idx The index of the menu item to execute.
	 * @returns {boolean} False if the menu item was executed successfully, true otherwise.
	 * @protected
	 */
	execute_menu(idx) {
		return false;
	}
}


/////////////////////
// * FOOBAR MENU * //
/////////////////////
/**
 * Provides methods for initializing and executing the foobar2000 context menu.
 */
class ContextFoobarMenu extends ContextBaseObject {
	/**
	 * Initializes a context menu manager.
	 * @param {FbMetadbHandleList} metadb_handles_arg An array of media database handles.
	 * @extends {ContextBaseObject}
	 * @class
	 */
	constructor(metadb_handles_arg) {
		super('');

		/** @private {IContextMenuManager} */
		this.cm = fb.CreateContextMenuManager();

		this.metadb_handles = metadb_handles_arg;
	}

	/**
	 * Disposes the foobar menu.
	 */
	dispose() {
		this.cm = null;
	}

	/**
	 * Initializes a menu index and returns the index plus 5000.
	 * @param {number} start_idx The initial value for the menu index.
	 * @returns {number} The end_idx.
	 * @protected
	 */
	initialize_menu_idx(start_idx) {
		this.idx = start_idx;
		return this.idx + 5000;
	}

	/**
	 * Initializes a menu by initializing the context and building the menu items.
	 * @param {ContextMenu} parent_menu The parent menu to which the new menu will be added as a child.
	 * @protected
	 */
	initialize_menu(parent_menu) {
		this.cm.InitContext(this.metadb_handles);
		this.cm.BuildMenu(parent_menu.cm, this.idx);
	}

	/**
	 * Executes a menu item based on its index.
	 * @param {number} idx The index of the menu that needs to be executed.
	 * @returns {boolean} The result of executing the command with the specified id.
	 * @protected
	 */
	execute_menu(idx) {
		return this.cm.ExecuteByID(idx - this.idx);
	}
}


///////////////////
// * MAIN MENU * //
///////////////////
/**
 * The main context menu with multiple items that can be executed when clicked.
 */
class ContextMainMenu extends ContextMenu {
	/**
	 * @extends {ContextMenu}
	 * @final
	 * @class
	 */
	constructor() {
		super('');
	}

	// public:

	/**
	 * Executes a menu by initializing it, displaying it and executing the selected menu item.
	 * @param {number} x The x-coordinate.
	 * @param {number} y The y-coordinate.
	 * @returns {boolean} True if some item was clicked.
	 */
	execute(x, y) {
		// Initialize menu
		let cur_idx = 1;
		this.menu_items.forEach(item => {
			if (!item.initialize_menu_idx) {
				return;
			}
			cur_idx = item.initialize_menu_idx(cur_idx);
		});

		this.menu_items.forEach(item => {
			item.initialize_menu(this);
		});

		// Execute menu
		const idx = this.cm.TrackPopupMenu(x, y);
		if (!idx) {
			return false;
		}

		return this.execute_menu(idx);
	}
}


//////////////////////////////
// * DEFAULT CONTEXT MENU * //
//////////////////////////////
/**
 * Contains some basic and SMP related options.
 * Displayed when shift right clicking in playlist panel or playlist manager.
 */
Object.assign(qwr_utils, {
	/**
	 * @param {ContextMenu} cm The context menu object.
	 */
	append_default_context_menu_to(cm) {
		if (!cm) {
			return;
		}

		if (!cm.is_empty()) {
			cm.append_separator();
		}

		cm.append_item('Console', () => {
			fb.ShowConsole();
		});

		cm.append_item('Restart', () => {
			fb.RunMainMenuCommand('File/Restart');
		});

		cm.append_item('Preferences...', () => {
			fb.RunMainMenuCommand('File/Preferences');
		});

		cm.append_separator();

		cm.append_item('Configure panel...', () => {
			window.ShowConfigure();
		});

		cm.append_item('Panel properties...', () => {
			window.ShowProperties();
		});
	}
});


////////////////////////////////
// * ALBUM ART CONTEXT MENU * //
////////////////////////////////
/**
 * Contains some options not find in top menu "Options" and append panel related top menu "Options" for quick access.
 * Displayed when right clicking on the big album art on the left side.
 */
Object.assign(qwr_utils, {
	/**
	 * @param {ContextMenu} cmac The context menu object.
	 */
	append_album_cover_context_menu_to(cmac) {
		if (!pref.showTransportControls_default) {
			cmac.append_item('Stop', () => {
				fb.Stop();
			});
			cmac.append_item('Previous', () => {
				fb.Prev();
			});
			cmac.append_item(fb.IsPlaying ? 'Pause' : 'Play', () => {
				fb.PlayOrPause();
			});
			cmac.append_item('Next', () => {
				fb.Next();
			});
			cmac.append_separator();

			const playbackOrderMenu = new ContextMenu('Playback order');
			const playbackOrderModes = ['Default', 'Repeat', 'Shuffle'];
			playbackOrderModes.forEach((playbackOrder) => {
				playbackOrderMenu.append_item(playbackOrder, () => {
					if (playbackOrder === 'Default') {
						pref.playbackOrder = 'Default';
						fb.RunMainMenuCommand('Playback/Order/Default');
					}
					if (playbackOrder === 'Repeat') {
						pref.playbackOrder = 'Repeat';
						fb.RunMainMenuCommand('Playback/Order/Repeat (track)');
					}
					if (playbackOrder === 'Shuffle') {
						pref.playbackOrder = 'Shuffle';
						fb.RunMainMenuCommand('Playback/Order/Shuffle (tracks)');
					}
				}, { is_radio_checked: playbackOrder === pref.playbackOrder });
			});
			cmac.append(playbackOrderMenu);
			cmac.append_separator();
		}

		// * Top menu options - Playlist, Details, Library, Lyrics - context menu
		const showPlaylist = pref.layout === 'artwork' ? displayPlaylistArtworkLayout && !pref.displayLyrics : displayPlaylist && !pref.displayLyrics;

		const showDetails = pref.layout === 'artwork' ? displayPlaylist && !displayPlaylistArtworkLayout && !displayLibrary && !displayBiography && !pref.displayLyrics :
			!displayPlaylist && !displayPlaylistArtworkLayout && !displayLibrary && !displayBiography && !pref.displayLyrics;

		const showArtworkLayoutAlbumArt = pref.layout === 'artwork' && !displayPlaylist && !displayPlaylistArtworkLayout && !displayLibrary && !displayBiography && !pref.displayLyrics;

		if (!showArtworkLayoutAlbumArt) {
			cmac.append_item(showPlaylist ? 'Playlist options menu' : showDetails ? 'Details options menu' : displayLibrary ? 'Library options menu' : 'Lyrics options menu', () => {
				if (showPlaylist) {
					onOptionsMenu(displayBiography ? state.mouse_x * 2 : state.mouse_x, state.mouse_y, true, true);
				}
				else if (showDetails) {
					onOptionsMenu(state.mouse_x, state.mouse_y, true, false, true);
				}
				else if (displayLibrary) {
					onOptionsMenu(state.mouse_x, state.mouse_y, true, false, false, true);
				}
				else if (pref.displayLyrics) {
					onOptionsMenu(state.mouse_x, state.mouse_y, true, false, false, false, false, true);
				}
			});
		}

		if (pref.theme === 'random') {
			cmac.append_item('Generate new color', () => {
				getRandomThemeColorContextMenu = true;
				initTheme();
				setTimeout(() => { getRandomThemeColorContextMenu = false }, 200);
			});
			cmac.append_separator();
		}

		if (pref.layout === 'default' && ['custom01', 'custom02', 'custom03', 'custom04', 'custom05', 'custom06', 'custom07', 'custom08', 'custom09', 'custom10'].includes(pref.theme)) {
			cmac.append_separator();
			cmac.append_item('Edit custom theme', () => {
				displayCustomThemeMenu = true;
				if (showPlaylist) {
					displayPanel('playlist');
					initCustomThemeMenu('pl_bg');
				}
				else if (showDetails) {
					displayPanel('details');
					initCustomThemeMenu(false, 'main_bg');
				}
				else if (displayLibrary) {
					displayPanel('library');
					initCustomThemeMenu(false, false, 'lib_bg');
				}
				else if (pref.displayLyrics) {
					displayPanel('lyrics');
					initCustomThemeMenu(false, 'main_text');
				}
				window.Repaint();
			});
		}

		if (showDetails) {
			cmac.append_item('Edit metadata grid', () => {
				if (pref.layout === 'default') {
					displayMetadataGridMenu = !displayMetadataGridMenu;
					if (!displayDetails) {
						displayDetails = true;
						displayPlaylist = false;
						displayLibrary = false;
						displayBiography = false;
						pref.displayLyrics = false;
						resizeArtwork(true);
						initButtonState();
					}
					initMetadataGridMenu(1);
					repaintWindow();
				} else {
					const configPath = `${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-config.jsonc`;
					fb.ShowPopupMessage(`Metadata grid can only be live edited in default layout:\nOptions > Layout > Default\n\nYou could manually edit your config file while reloading to take effect:\n${configPath}\n`, 'Metadata grid live editing');
				}
			});
			cmac.append_separator();
		}

		if (pref.layout === 'default') {
			if (displayPlaylist && !displayBiography && !pref.displayLyrics) {
				cmac.append_item(displayPlaylist && pref.playlistLayout === 'normal' ? 'Change layout to full' : 'Change layout to normal', () => {
					pref.playlistLayout = pref.playlistLayout === 'normal' ? 'full' : 'normal';
					repaintWindowRectAreas();
					g_properties.auto_collapse = false;
					playlist.expand_header();
					playlist.on_size(ww, wh);
					jumpSearch.on_size();
					initButtonState();
				});
				cmac.append_separator();
			}
			else if (displayLibrary) {
				cmac.append_separator();
				cmac.append_item(displayLibrary && pref.libraryLayout === 'normal' ? 'Change layout to full' : 'Change layout to normal', () => {
					pref.libraryLayout = pref.libraryLayout === 'normal' ? 'full' : 'normal';
					displayPlaylist = pref.libraryLayout === 'split';
					initLibraryLayout();
					initButtonState();
				});
				if (pref.libraryLayout === 'normal') {
					cmac.append_item(displayLibrary && pref.libraryLayout === 'normal' ? 'Change layout to split' : 'Change layout to normal', () => {
						pref.libraryLayout = pref.libraryLayout === 'normal' ? 'split' : 'normal';
						displayPlaylist = pref.libraryLayout === 'split';
						initLibraryLayout();
						initButtonState();
					});
					cmac.append_separator();
				}
			}
			else if (pref.displayLyrics) {
				cmac.append_item(pref.displayLyrics && pref.lyricsLayout === 'normal' ? 'Change layout to full' : 'Change layout to normal', () => {
					pref.lyricsLayout = pref.lyricsLayout === 'normal' ? 'full' : 'normal';
					displayPlaylist = !displayPlaylist;
					lyricsLayoutFullWidth = pref.lyricsLayout === 'full';
					repaintWindowRectAreas();
					resizeArtwork(true);
					initButtonState();
				});
				cmac.append_separator();
			}
		}

		cmac.append_item(pref.layout !== 'artwork' && (displayPlaylist || pref.displayLyrics && pref.lyricsLayout === 'full') ? 'Details' : 'Playlist', () => {
			if (pref.layout !== 'artwork') {
				btns.details.onClick();
				if (displayPlaylist && !pref.lyricsActiveState) pref.displayLyrics = false;
			}
			else if (pref.layout === 'artwork') {
				btns.playlistArtworkLayout.onClick();
				if (displayPlaylistArtworkLayout) pref.displayLyrics = false;
			}
			playlist.on_size(ww, wh);
			resizeArtwork(true);
			initButtonState();
			window.Repaint();
		});
		cmac.append_separator();

		cmac.append_item(pref.displayLyrics ? 'Hide lyrics' : 'Display lyrics', () => {
			if (pref.layout === 'artwork' && displayPlaylist) btns.details.onClick();
			pref.displayLyrics = !pref.displayLyrics;
			if (!pref.displayLyrics && pref.lyricsLayout === 'full' || noAlbumArtStub) {
				displayPlaylist = true;
			}
			if (pref.displayLyrics && pref.lyricsLayout === 'full') {
				displayPlaylist = false;
			}
			playlist.on_size(ww, wh);
			initLyrics();
			on_playback_seek();
			resizeArtwork(true);
			initButtonState();
			window.Repaint();
		});

		if (albumArtList.length > 1) {
			const loadImage = () => {
				setTimeout(() => {
					loadImageFromAlbumArtList(albumArtIndex);
					if (pref.theme === 'reborn' || pref.theme === 'random' || pref.styleBlackAndWhiteReborn || pref.styleBlackReborn) {
						newTrackFetchingArtwork = true;
						getThemeColors(albumArt);
						initTheme();
						DebugLog('initTheme -> Album cover context menu -> Display next/previous artwork');
					}
					window.Repaint();
				}, !activeMenu);
			}
			if (albumArtIndex !== albumArtList.length - 1) {
				cmac.append_item(fb.IsPlaying ? 'Display next artwork' : '', () => {
					albumArtIndex = (albumArtIndex + 1) % albumArtList.length;
					loadImage();
				});
			}
			if (albumArtIndex !== 0) {
				cmac.append_item(fb.IsPlaying ? 'Display previous artwork' : '', () => {
					albumArtIndex = (albumArtIndex - 1) % albumArtList.length;
					loadImage();
				});
			}
		}

		cmac.append_separator();

		const query = $('$if3(%album artist%, %artist, %composer%)', fb.GetNowPlaying()).replace(/ /g, '%20');
		cmac.append_item('Get disc art', () => {
			RunCmd(`https://fanart.tv/?s=${query}&sect=2`);
		});

		const discArtMenu = new ContextMenu('Disc art placeholder');
		discArtMenu.append_item('Show placeholder if no disc art found', () => {
			pref.showDiscArtStub = !pref.showDiscArtStub;
			pref.noDiscArtStub = false;
			fetchNewArtwork(fb.GetNowPlaying());
			repaintWindow();
		}, { is_checked: pref.showDiscArtStub });
		discArtMenu.append_separator();
		discArtMenu.append_item('No placeholder', () => {
			pref.noDiscArtStub = !pref.noDiscArtStub;
			pref.showDiscArtStub = false;
			fetchNewArtwork(fb.GetNowPlaying());
			repaintWindow();
		}, { is_checked: pref.noDiscArtStub });
		discArtMenu.append_separator();
		const displayCdArtMenu = [
			['CD - White', 'cdWhite'],
			['CD - Black', 'cdBlack'],
			['CD - Blank', 'cdBlank'],
			['CD - Transparent', 'cdTrans'],
			['CD - Custom', 'cdCustom']
		];
		displayCdArtMenu.forEach((cdArt) => {
			discArtMenu.append_item(cdArt[0], function (cdArt) {
				pref.discArtStub = cdArt;
				pref.noDiscArtStub = false;
				fetchNewArtwork(fb.GetNowPlaying());
				repaintWindow();
			}.bind(null, cdArt[1]), { is_radio_checked: cdArt[1] === pref.discArtStub });
		});
		discArtMenu.append_separator();
		const displayVinylArtMenu = [
			['Vinyl - White', 'vinylWhite'],
			['Vinyl - Void', 'vinylVoid'],
			['Vinyl - Cold fusion', 'vinylColdFusion'],
			['Vinyl - Ring of fire', 'vinylRingOfFire'],
			['Vinyl - Maple', 'vinylMaple'],
			['Vinyl - Black', 'vinylBlack'],
			['Vinyl - Black hole', 'vinylBlackHole'],
			['Vinyl - Ebony', 'vinylEbony'],
			['Vinyl - Transparent', 'vinylTrans'],
			['Vinyl - Custom', 'vinylCustom']
		];
		displayVinylArtMenu.forEach((vinylArt) => {
			discArtMenu.append_item(vinylArt[0], function (vinylArt) {
				pref.discArtStub = vinylArt;
				pref.noDiscArtStub = false;
				fetchNewArtwork(fb.GetNowPlaying());
				repaintWindow();
			}.bind(null, vinylArt[1]), { is_radio_checked: vinylArt[1] === pref.discArtStub });
		});
		cmac.append(discArtMenu);
		cmac.append_separator();

		cmac.append_item('Open containing folder', () => {
			fb.RunContextCommand('Open Containing Folder');
		});

		cmac.append_item('Properties', () => {
			fb.RunContextCommand('Properties');
		});

		cmac.append_separator();

		cmac.append_item('Reload theme', () => {
			window.Reload();
		});
	}
});


////////////////////////////////
// * LOWER BAR CONTEXT MENU * //
////////////////////////////////
/**
 * Contains all seekbar ( progress bar, peakmeter bar and waveform bar ) top menu "Options" for quick access.
 * Displayed when right clicking on the lower bar.
 */
Object.assign(qwr_utils, {
	/**
	 * @param {ContextMenu} cmac The context menu object.
	 */
	append_lower_bar_context_menu_to(cmac) {
		const seekbar = [['Progress bar', 'progressbar'], ['Peakmeter bar', 'peakmeterbar'], ['Waveform bar', 'waveformbar']];
		seekbar.forEach((type) => {
			cmac.append_item(type[0], () => {
				pref.seekbar = type[1];
				setGeometry();
				setProgressBarRefresh();
				if (pref.seekbar === 'waveformbar') waveformBar.updateBar();
				repaintWindow();
			}, { is_radio_checked: type[1] === pref.seekbar });
		});

		// * PROGRESS BAR * //
		if (pref.seekbar === 'progressbar') {
			cmac.append_separator();
			const progressBarStyleMenu = new ContextMenu('Style');
			const progressBarStyle = [['Default', 'default'], ['Rounded', 'rounded'], ['Lines', 'lines'], ['Blocks', 'blocks'], ['Dots', 'dots'], ['Thin', 'thin']];
			progressBarStyle.forEach((sec) => {
				progressBarStyleMenu.append_item(sec[0], () => {
					pref.styleProgressBarDesign = sec[1];
					setGeometry();
					repaintWindow();
				}, { is_radio_checked: sec[1] === pref.styleProgressBarDesign });
			});
			cmac.append(progressBarStyleMenu);

			const progressBarSeekSpeedMenu = new ContextMenu('Mouse wheel seek speed');
			const progressBarSeekSpeed = [['  1 sec', 1], ['  2 sec', 2], ['  3 sec', 3], ['  4 sec', 4], ['  5 sec (default)', 5], ['  6 sec', 6], ['  7 sec', 7], ['  8 sec', 8], ['  9 sec', 9], ['10 sec', 10]];
			progressBarSeekSpeed.forEach((sec) => {
				progressBarSeekSpeedMenu.append_item(sec[0], () => {
					pref.progressBarWheelSeekSpeed = sec[1];
				}, { is_radio_checked: sec[1] === pref.progressBarWheelSeekSpeed });
			});
			cmac.append(progressBarSeekSpeedMenu);

			const progressBarRefreshMenu = new ContextMenu('Refresh rate');
			const progressBarRefresh = [['1000 ms (very slow CPU)', 1000], ['  500 ms', 500], ['  333 ms', 333], ['  Variable (default)', 'variable'], ['  250 ms', 250], ['  200 ms', 200], ['  150 ms', 150], ['  100 ms', 100], ['    60 ms', 60], ['    30 ms (very fast CPU)', 30]];
			progressBarRefresh.forEach((rate) => {
				progressBarRefreshMenu.append_item(rate[0], () => {
					pref.progressBarRefreshRate = rate[1];
					setProgressBarRefresh();
				}, { is_radio_checked: rate[1] === pref.progressBarRefreshRate });
			});
			cmac.append(progressBarRefreshMenu);
		}
		// * PEAKMETER BAR * //
		else if (pref.seekbar === 'peakmeterbar') {
			cmac.append_separator();
			const peakmeterBarDesignMenu = new ContextMenu('Style');
			const peakmeterBarDesign = [['Horizontal', 'horizontal'], ['Horizontal center', 'horizontal_center'], ['Vertical', 'vertical']];
			peakmeterBarDesign.forEach((design) => {
				peakmeterBarDesignMenu.append_item(design[0], () => {
					pref.peakmeterBarDesign = design[1];
					peakmeterBar.on_size(ww, wh);
					repaintWindow();
				}, { is_radio_checked: design[1] === pref.peakmeterBarDesign });
			});
			cmac.append(peakmeterBarDesignMenu);

			if (pref.peakmeterBarDesign === 'vertical') {
				const peakmeterBarVertSizeMenu = new ContextMenu('Size');
				const peakmeterBarVertSize = [['  0 px', 0], ['  2 px', 2], ['  4 px', 4], ['  6 px', 6], ['  8 px', 8], ['10 px', 10], [pref.layout !== 'default' ? '12 px (default)' : '12 px', 12], ['14 px', 14], ['16 px', 16], ['18 px', 18], [pref.layout !== 'default' ? '20 px' : '20 px (default)', 20], ['25 px', 25], ['30 px', 30], ['35 px', 35], ['40 px', 40], ['Minimum', 'min']];
				peakmeterBarVertSize.forEach((size) => {
					peakmeterBarVertSizeMenu.append_item(size[0], () => {
						pref.peakmeterBarVertSize = size[1];
						peakmeterBar = new PeakmeterBar(ww, wh);
						repaintWindow();
					}, { is_radio_checked: size[1] === pref.peakmeterBarVertSize });
				});
				cmac.append(peakmeterBarVertSizeMenu);

				const peakmeterBarVertDbRangeMenu = new ContextMenu('Decibel range');
				const peakmeterBarVertDbRange = [['2 to -20 db (default)', 220], ['2 to -15 db', 215], ['2 to -10 db', 210], ['3 to -20 db', 320], ['3 to -15 db', 315], ['3 to -10 db', 310], ['5 to -20 db', 520], ['5 to -15 db', 515], ['5 to -10 db', 510]];
				peakmeterBarVertDbRange.forEach((range) => {
					peakmeterBarVertDbRangeMenu.append_item(range[0], () => {
						pref.peakmeterBarVertDbRange = range[1];
						peakmeterBar = new PeakmeterBar(ww, wh);
						repaintWindow();
					}, { is_radio_checked: range[1] === pref.peakmeterBarVertDbRange });
				});
				cmac.append(peakmeterBarVertDbRangeMenu);
			}

			const peakmeterBarDisplayMenu = new ContextMenu('Display');
			if (pref.peakmeterBarDesign === 'horizontal' || pref.peakmeterBarDesign === 'horizontal_center') {
				peakmeterBarDisplayMenu.append_item('Show over bars', () => {
					pref.peakmeterBarOverBars = !pref.peakmeterBarOverBars;
					repaintWindow();
				}, { is_checked: pref.peakmeterBarOverBars });
				peakmeterBarDisplayMenu.append_separator();
				peakmeterBarDisplayMenu.append_item('Show outer bars', () => {
					pref.peakmeterBarOuterBars = !pref.peakmeterBarOuterBars;
					repaintWindow();
				}, { is_checked: pref.peakmeterBarOuterBars });
				peakmeterBarDisplayMenu.append_item('Show outer peaks', () => {
					pref.peakmeterBarOuterPeaks = !pref.peakmeterBarOuterPeaks;
					repaintWindow();
				}, { is_checked: pref.peakmeterBarOuterPeaks });
				peakmeterBarDisplayMenu.append_separator();
				peakmeterBarDisplayMenu.append_item('Show main bars', () => {
					pref.peakmeterBarMainBars = !pref.peakmeterBarMainBars;
					repaintWindow();
				}, { is_checked: pref.peakmeterBarMainBars });
				peakmeterBarDisplayMenu.append_item('Show main peaks', () => {
					pref.peakmeterBarMainPeaks = !pref.peakmeterBarMainPeaks;
					repaintWindow();
				}, { is_checked: pref.peakmeterBarMainPeaks });
				peakmeterBarDisplayMenu.append_separator();
				peakmeterBarDisplayMenu.append_item('Show middle bars', () => {
					pref.peakmeterBarMiddleBars = !pref.peakmeterBarMiddleBars;
					repaintWindow();
				}, { is_checked: pref.peakmeterBarMiddleBars });
			}

			peakmeterBarDisplayMenu.append_item('Show progress bar', () => {
				pref.peakmeterBarProgBar = !pref.peakmeterBarProgBar;
				repaintWindow();
			}, { is_checked: pref.peakmeterBarProgBar });

			if (pref.peakmeterBarDesign === 'horizontal' || pref.peakmeterBarDesign === 'horizontal_center') {
				peakmeterBarDisplayMenu.append_separator();
				peakmeterBarDisplayMenu.append_item('Show gaps', () => {
					pref.peakmeterBarGaps = !pref.peakmeterBarGaps;
					peakmeterBar.on_size(ww, wh);
					repaintWindow();
				}, { is_checked: pref.peakmeterBarGaps });
				peakmeterBarDisplayMenu.append_item('Show grid', () => {
					pref.peakmeterBarGrid = !pref.peakmeterBarGrid;
					repaintWindow();
				}, { is_checked: pref.peakmeterBarGrid });
			}

			if (pref.peakmeterBarDesign === 'vertical') {
				peakmeterBarDisplayMenu.append_item('Show peaks', () => {
					pref.peakmeterBarVertPeaks = !pref.peakmeterBarVertPeaks;
					repaintWindow();
				}, { is_checked: pref.peakmeterBarVertPeaks });
				peakmeterBarDisplayMenu.append_item('Show baseline', () => {
					pref.peakmeterBarVertBaseline = !pref.peakmeterBarVertBaseline;
					repaintWindow();
				}, { is_checked: pref.peakmeterBarVertBaseline });
			}

			peakmeterBarDisplayMenu.append_item(pref.layout !== 'default' ? 'Show info (only available in Default layout)' : 'Show info', () => {
				pref.peakmeterBarInfo = !pref.peakmeterBarInfo;
				repaintWindow();
			}, { is_checked: pref.peakmeterBarInfo });

			cmac.append(peakmeterBarDisplayMenu);

			const peakmeterBarRefreshMenu = new ContextMenu('Refresh rate');
			const peakmeterBarRefresh = [['200 ms (very slow CPU)', 200], ['150 ms', 150], ['120 ms', 120], ['100 ms', 100], ['  80 ms (default)', 80], ['  60 ms', 60], ['  30 ms (very fast CPU)', 30]];
			peakmeterBarRefresh.forEach((rate) => {
				peakmeterBarRefreshMenu.append_item(rate[0], () => {
					pref.peakmeterBarRefreshRate = rate[1];
					setProgressBarRefresh();
				}, { is_radio_checked: rate[1] === pref.peakmeterBarRefreshRate });
			});
			cmac.append(peakmeterBarRefreshMenu);
		}
		// * WAVEFORM BAR * //
		else if (pref.seekbar === 'waveformbar') {
			cmac.append_separator();
			const waveformBarAnalysisMenu = new ContextMenu('Analysis');
			const waveformBarAnalysis = [['RMS level', 'rms_level'], ['Peak level', 'peak_level'], ['RMS peak', 'rms_peak']];
			waveformBarAnalysis.forEach((type) => {
				waveformBarAnalysisMenu.append_item(type[0] + (pref.waveformBarMode === 'ffprobe' ? '' : '\t (ffprobe only)'), () => {
					pref.waveformBarAnalysis = type[1];
					waveformBar.updateConfig({ preset: { analysisMode: type[1] } });
					waveformBar.updateBar();
					repaintWindow();
				}, {
					is_grayed_out: pref.waveformBarMode !== 'ffprobe',
					is_radio_checked: type[1] === pref.waveformBarAnalysis
					}
				);
			});
			waveformBarAnalysisMenu.append_separator();
			waveformBarAnalysisMenu.append_item('Delete analysis files', () => {
				const msg = 'Do you want to delete all waveform bar cache?\n\nThis will permanently delete analyzed files.\n\nContinue?\n\n\n';
				const continue_confirmation = (status, confirmed) => {
					if (confirmed) deleteWaveformBarCache();
				};
				if (detectWine || !detectIE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
					continue_confirmation(false, 'Yes');
				} else {
					popUpBox.confirm('Georgia-ReBORN', msg, 'Yes', 'No', false, 'center', continue_confirmation);
				}
			});
			waveformBarAnalysisMenu.append_separator();
			waveformBarAnalysisMenu.append_item('Auto-delete analysis files', () => {
				pref.waveformBarAutoDelete = !pref.waveformBarAutoDelete;
				waveformBar.updateConfig({ analysis: { autoDelete: pref.waveformBarAutoDelete } });
			}, { is_grayed_out: pref.waveformBarMode === 'visualizer' });
			cmac.append(waveformBarAnalysisMenu);

			const waveformBarModeMenu = new ContextMenu('Mode');
			const waveformBarMode = [['FFprobe', 'ffprobe'], ['Audiowaveform', 'audiowaveform'], ['Visualizer', 'visualizer']];
			if (!IsFile(waveformBar.binaries.ffprobe)) {
				waveformBarModeMenu.append_item('Download FFprobe', () => {
					waveformBar.getFFprobe();
				});
				waveformBarModeMenu.append_separator();
			}
			waveformBarMode.forEach((mode) => {
				const found = IsFile(waveformBar.binaries[mode[1]]);
				waveformBarModeMenu.append_item(mode[0] + (found ? '' : '\t(not found)'), () => {
					pref.waveformBarMode = mode[1];
					waveformBar.updateConfig({ analysis: { binaryMode: pref.waveformBarMode } });
					waveformBar.updateBar(true);
					repaintWindow();
				}, {
					is_grayed_out: !found,
					is_radio_checked: mode[1] === pref.waveformBarMode
					}
				);
			});
			cmac.append(waveformBarModeMenu);

			const waveformBarDesignMenu = new ContextMenu('Style');
			const waveformBarDesign = [['Waveform', 'waveform'], ['Bars', 'bars'], ['Dots', 'dots'], ['Halfbars', 'halfbars']];
			waveformBarDesign.forEach((design) => {
				waveformBarDesignMenu.append_item(design[0], () => {
					pref.waveformBarDesign = design[1];
					waveformBar.updateConfig({ preset: { barDesign: design[1] } });
				}, { is_radio_checked: design[1] === pref.waveformBarDesign });
			});
			cmac.append(waveformBarDesignMenu);

			const waveformBarSizeMenu = new ContextMenu('Size');
			const waveformBarSizeWaveMenu = new ContextMenu('Waveform');
			const waveformBarSizeWave = [['1', 1], ['2', 2], ['3 (Default)', 3], ['4', 4], ['5', 5]];
			waveformBarSizeWave.forEach((size) => {
				waveformBarSizeWaveMenu.append_item(size[0], () => {
					pref.waveformBarSizeWave = size[1];
					waveformBar.updateConfig({ ui: { sizeWave: size[1] } });
					waveformBar.updateBar();
					repaintWindow();
				}, { is_radio_checked: size[1] === pref.waveformBarSizeWave });
			});
			waveformBarSizeMenu.append(waveformBarSizeWaveMenu);
			const waveformBarSizeBarsMenu = new ContextMenu('Bars');
			const waveformBarSizeBars = [['1 (Default)', 1], ['2', 2], ['3', 3], ['4', 4], ['5', 5]];
			waveformBarSizeBars.forEach((size) => {
				waveformBarSizeBarsMenu.append_item(size[0], () => {
					pref.waveformBarSizeBars = size[1];
					waveformBar.updateConfig({ ui: { sizeBars: size[1] } });
					waveformBar.updateBar();
					repaintWindow();
				}, { is_radio_checked: size[1] === pref.waveformBarSizeBars });
			});
			waveformBarSizeMenu.append(waveformBarSizeBarsMenu);
			const waveformBarSizeDotsMenu = new ContextMenu('Dots');
			const waveformBarSizeDots = [['1', 1], ['2 (Default)', 2], ['3', 3], ['4', 4], ['5', 5]];
			waveformBarSizeDots.forEach((size) => {
				waveformBarSizeDotsMenu.append_item(size[0], () => {
					pref.waveformBarSizeDots = size[1];
					waveformBar.updateConfig({ ui: { sizeDots: size[1] } });
					waveformBar.updateBar();
					repaintWindow();
				}, { is_radio_checked: size[1] === pref.waveformBarSizeDots });
			});
			waveformBarSizeMenu.append(waveformBarSizeDotsMenu);
			const waveformBarSizeHalfMenu = new ContextMenu('Halfbars');
			const waveformBarSizeHalf = [['1', 1], ['2', 2], ['3', 3], ['4 (Default)', 4], ['5', 5]];
			waveformBarSizeHalf.forEach((size) => {
				waveformBarSizeHalfMenu.append_item(size[0], () => {
					pref.waveformBarSizeHalf = size[1];
					waveformBar.updateConfig({ ui: { sizeHalf: size[1] } });
					waveformBar.updateBar();
					repaintWindow();
				}, { is_radio_checked: size[1] === pref.waveformBarSizeHalf });
			});
			waveformBarSizeMenu.append(waveformBarSizeHalfMenu);
			waveformBarSizeMenu.append_separator();
			waveformBarSizeMenu.append_item('Normalize width', () => {
				pref.waveformBarSizeNormalize = !pref.waveformBarSizeNormalize;
				waveformBar.updateConfig({ ui: { sizeNormalizeWidth: pref.waveformBarSizeNormalize } });
				waveformBar.updateBar();
				repaintWindow();
			}, { is_checked: pref.waveformBarSizeNormalize });
			cmac.append(waveformBarSizeMenu);

			const waveformBarDisplayMenu = new ContextMenu('Display');
			const waveformBarDisplay = [['Full', 'full'], ['Partial', 'partial']];
			waveformBarDisplay.forEach((paint) => {
				waveformBarDisplayMenu.append_item(paint[0], () => {
					pref.waveformBarPaint = paint[1];
					waveformBar.updateConfig({ preset: { paintMode: paint[1] } });
				}, { is_radio_checked: paint[1] === pref.waveformBarPaint });
			});
			waveformBarDisplayMenu.append_separator();

			waveformBarDisplayMenu.append_item(`Prepaint${pref.waveformBarPaint === 'full' ? '\t(partial only)' : ''}`, () => {
				pref.waveformBarPrepaint = !pref.waveformBarPrepaint;
				waveformBar.updateConfig({ preset: { prepaint: pref.waveformBarPrepaint } });
			}, {
				is_grayed_out: pref.waveformBarPaint === 'full',
				is_checked: pref.waveformBarPrepaint
				}
			);

			const waveformBarPrepaintMenuDisabled = pref.waveformBarPaint === 'full' || pref.waveformBarMode === 'visualizer' || !pref.waveformBarPrepaint;
			const waveformBarPrepaintMenu = new ContextMenu('Prepaint front', { is_grayed_out: waveformBarPrepaintMenuDisabled });
			const waveformBarPrepaint = [['  2 secs', 2], ['  5 secs', 5], ['10 secs', 10], ['     Full', Infinity]];
			waveformBarPrepaint.forEach((time) => {
				waveformBarPrepaintMenu.append_item(time[0], () => {
					pref.waveformBarPrepaintFront = time[1];
					waveformBar.updateConfig({ preset: { prepaintFront: time[1] } });
				}, {
					is_grayed_out: waveformBarPrepaintMenuDisabled,
					is_radio_checked: time[1] === pref.waveformBarPrepaintFront
					}
				);
			});
			waveformBarDisplayMenu.append(waveformBarPrepaintMenu);
			waveformBarDisplayMenu.append_separator();

			waveformBarDisplayMenu.append_item('Animate', () => {
				pref.waveformBarAnimate = !pref.waveformBarAnimate;
				waveformBar.updateConfig({ preset: { animate: pref.waveformBarAnimate } });
			}, { is_checked: pref.waveformBarAnimate });

			waveformBarDisplayMenu.append_item(`Use BPM${pref.waveformBarPaint === 'full' && pref.waveformBarMode !== 'visualizer' ? '\t(partial only)' : ''}`, () => {
				pref.waveformBarBPM = !pref.waveformBarBPM;
				if (pref.waveformBarBPM) pref.waveformBarRefreshRateVar = true;
				waveformBar.updateConfig({
					preset: { useBPM: pref.waveformBarBPM },
					ui: { refreshRateVar: pref.waveformBarRefreshRateVar }
				});
				}, {
					is_grayed_out: !(pref.waveformBarPaint === 'partial' && pref.waveformBarPrepaint || pref.waveformBarMode === 'visualizer'),
					is_checked: pref.waveformBarBPM
				}
			);

			waveformBarDisplayMenu.append_item('Invert halfbars', () => {
				pref.waveformBarInvertHalfbars = !pref.waveformBarInvertHalfbars;
				waveformBar.updateConfig({ preset: { invertHalfbars: pref.waveformBarInvertHalfbars } });
			}, { is_checked: pref.waveformBarInvertHalfbars });
			waveformBarDisplayMenu.append_separator();

			waveformBarDisplayMenu.append_item('Show indicator', () => {
				pref.waveformBarIndicator = !pref.waveformBarIndicator;
				waveformBar.updateConfig({ preset: { indicator: pref.waveformBarIndicator } });
			}, { is_checked: pref.waveformBarIndicator });
			cmac.append(waveformBarDisplayMenu);

			const waveformBarRefreshMenuDisabled = !(pref.waveformBarPaint === 'partial' && pref.waveformBarPrepaint || pref.waveformBarMode === 'visualizer');
			const waveformBarRefreshMenu = new ContextMenu(`Refresh rate${pref.waveformBarPaint === 'full' && pref.waveformBarMode !== 'visualizer' ? '\t(partial only)' : ''}`, { is_grayed_out: waveformBarRefreshMenuDisabled });
			const waveformBarRefresh = [['1000 ms (very slow CPU)', 1000], ['  500 ms', 500], ['  200 ms', 200], ['  100 ms (default)', 100], ['    80 ms', 80], ['    60 ms', 60], ['    30 ms (very fast CPU)', 30]];
			waveformBarRefresh.forEach((rate) => {
				waveformBarRefreshMenu.append_item(rate[0], () => {
					pref.waveformBarRefreshRate = rate[1];
					waveformBar.updateConfig({ ui: { refreshRate: rate[1] } });
				}, {
					is_grayed_out: waveformBarRefreshMenuDisabled,
					is_radio_checked: rate[1] === pref.waveformBarRefreshRate
					}
				);
			});
			waveformBarRefreshMenu.append_separator();
			waveformBarRefreshMenu.append_item('    Variable refresh rate', () => {
				pref.waveformBarRefreshRateVar = !pref.waveformBarRefreshRateVar;
				waveformBar.updateConfig({ ui: { refreshRateVar: pref.waveformBarRefreshRateVar } });
			}, { is_checked: pref.waveformBarRefreshRateVar });
			cmac.append(waveformBarRefreshMenu);
		}
	}
});
