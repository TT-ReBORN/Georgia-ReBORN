// ==PREPROCESSOR==
// @name 'ContextMenu Control'
// @author 'TheQwertiest'
// ==/PREPROCESSOR==

g_script_list.push('Control_ContextMenu.js');

class ContextBaseObject {
    /**
     * @param{string} text_arg
     */
    constructor(text_arg) {
        /** @const {string} */
        this.text = text_arg;

        /** @type {?number} */
        this.idx = undefined;
    }

    /**
     * @param{number} start_idx
     * @return{number} end_idx
     * @protected
     * @abstract
     */
    initialize_menu_idx(start_idx) {
        throw new LogicError("initialize_menu_idx not implemented");
    }

    /**
     * @param{ContextMenu} parent_menu
     * @protected
     * @abstract
     */
    initialize_menu(parent_menu) {
        throw new LogicError("initialize_menu not implemented");
    }

    /**
     * @param{number} idx
     * @return{boolean}
     * @protected
     * @abstract
     * */
    execute_menu(idx) {
        throw new LogicError("execute_menu not implemented");
    }
}

class ContextMenu extends ContextBaseObject {

    /**
     * @param {string} text_arg
     * @param {object} [optional_args={}]
     * @param {boolean=} [optional_args.is_grayed_out=false]
     * @param {boolean=} [optional_args.is_checked=false]
     * @constructor
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
     * @param{ContextBaseObject} item
     */
    append(item) {
        if (!(item instanceof ContextBaseObject)) {
            throw new InvalidTypeError('context_item', typeof item, 'instanceof ContextBaseObject');
        }

        this.menu_items.push(item);
    };

    /**
     * @param {string} text_arg
     * @param {function} callback_fn_arg
     * @param {object} [optional_args={}]
     * @param {boolean=} [optional_args.is_grayed_out=false]
     * @param {boolean=} [optional_args.is_checked=false]
     * @param {boolean=} [optional_args.is_radio_checked=false]
     */
    append_item(text_arg, callback_fn_arg, optional_args) {
        this.append(new ContextItem(text_arg, callback_fn_arg, optional_args));
    };

    append_separator() {
        this.append(new ContextSeparator());
    };

    /**
     * @param{number} start_idx
     * @param{number} check_idx
     */
    radio_check(start_idx, check_idx) {
        var item = this.menu_items[start_idx + check_idx];
        if (!item) {
            throw new ArgumentError('check_idx', check_idx, 'Value is out of bounds');
        }

        if (start_idx >= this.menu_items.length) {
            throw new ArgumentError('start_idx', start_idx, 'Value is out of bounds');
        }

        if (item instanceof ContextSeparator) {
            throw new ArgumentError('check_idx', check_idx, 'Index points to MenuSeparator');
        }

        item.radio_check(true)
    };

    /**
     * @return {boolean}
     */
    is_empty() {
        return _.isEmpty(this.menu_items);
    };

    dispose() {
        this.cm = null;

        var items = this.menu_items;
        for (var i = 0; i < items.length; ++i) {
            if (items[i].dispose) {
                items[i].dispose();
            }
            items[i] = null;
        }

        this.menu_items = null;
    };

    /**
     * @param{number} start_idx
     * @return{number} end_idx
     * @protected
     */
    initialize_menu_idx(start_idx) {
        var cur_idx = start_idx;

        this.idx = cur_idx++;
        this.menu_items.forEach(function (item) {
            if (!item.initialize_menu_idx) {
                return;
            }
            cur_idx = item.initialize_menu_idx(cur_idx);
        });

        return cur_idx;
    };

    /**
     * @param{ContextMenu} parent_menu
     * @protected
     */
    initialize_menu(parent_menu) {
        this.menu_items.forEach(item => {
            item.initialize_menu(this);
        });

        this.cm.AppendTo(parent_menu.cm, this.is_grayed_out ? MF_GRAYED : MF_STRING, this.text);
    };

    /**
     * @param{number} idx
     * @return{boolean}
     * @protected
     * */
    execute_menu(idx) {
        for (var i = 0; i < this.menu_items.length; ++i) {
            var items = this.menu_items;
            var item = items[i];
            var next_item = items[i + 1];

            if (idx === item.idx || (idx > item.idx && (!next_item || idx < next_item.idx))) {
                return item.execute_menu(idx);
            }
        }
    }
}

// ContextMenu.prototype = Object.create(ContextBaseObject.prototype);
// ContextMenu.prototype.constructor = ContextMenu;


class ContextItem extends ContextBaseObject {

    /**
     * @param {string} text_arg
     * @param {function} callback_fn_arg
     * @param {object} [optional_args={}]
     * @param {boolean=} [optional_args.is_grayed_out=false]
     * @param {boolean=} [optional_args.is_checked=false]
     * @param {boolean=} [optional_args.is_radio_checked=false]
     * @constructor
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
     * @param{boolean} is_checked_arg
     */
    check(is_checked_arg) {
        this.is_checked = is_checked_arg;
    }

    /**
     * @param{boolean} is_checked_arg
     */
    radio_check(is_checked_arg) {
        this.is_radio_checked = is_checked_arg;
    }

    // protected:

    /**
     * @param{number} start_idx
     * @return{number} end_idx
     * @protected
     */
    initialize_menu_idx(start_idx) {
        this.idx = start_idx;
        return this.idx + 1;
    }

    /**
     * @param {ContextMenu} parent_menu
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
     * @param{number} idx
     * @return{boolean}
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
// ContextItem.prototype = Object.create(ContextBaseObject.prototype);
// ContextItem.prototype.constructor = ContextItem;

/**
 * @constructor
 * @extends {ContextBaseObject}
 */
class ContextSeparator extends ContextBaseObject {

    constructor () {
        super('');
    }

    /**
     * @param{number} start_idx
     * @return{number} end_idx
     * @protected
     */
    initialize_menu_idx(start_idx) {
        this.idx = start_idx;
        return this.idx + 1;
    }

    /**
     * @param{ContextMenu} parent_menu
     * @protected
     */
    initialize_menu(parent_menu) {
        parent_menu.cm.AppendMenuSeparator();
    }

    /**
     * @param{number} idx
     * @return{boolean}
     * @protected
     * */
    execute_menu(idx) {
        return false;
    }
}

/**
 * @param {FbMetadbHandleList} metadb_handles_arg
 * @constructor
 * @extends {ContextBaseObject}
 */
class ContextFoobarMenu extends ContextBaseObject {

    constructor (metadb_handles_arg) {
        super('');

        /** @private {IContextMenuManager} */
        this.cm = fb.CreateContextMenuManager();

        this.metadb_handles = metadb_handles_arg;

    }

    dispose() {
        this.cm = null;
    }

    /**
     * @param {number} start_idx
     * @return {number} end_idx
     * @protected
     */
    initialize_menu_idx(start_idx) {
        this.idx = start_idx;
        return this.idx + 5000;
    }

    /**
     * @param {ContextMenu} parent_menu
     * @protected
     */
    initialize_menu(parent_menu) {
        this.cm.InitContext(this.metadb_handles);
        this.cm.BuildMenu(parent_menu.cm, this.idx);
    }

    /**
     * @param {number} idx
     * @return {boolean}
     * @protected
     * */
    execute_menu(idx) {
        return this.cm.ExecuteByID(idx - this.idx);
    }
}

class ContextMainMenu extends ContextMenu {

    /**
     * @final
     * @constructor
     */
    constructor() {
        super('');
    }

    // public:

    /** @return{boolean} true, if some item was clicked*/
    execute(x, y) {
        // Initialize menu
        var cur_idx = 1;
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
        var idx = this.cm.TrackPopupMenu(x, y);
        if (!idx) {
            return false;
        }

        return this.execute_menu(idx);
    }
}

Object.assign(qwr_utils, {
    /**
     * @param {ContextMenu} cm
     */
    append_default_context_menu_to: function (cm) {
        if (!cm) {
            return;
        }

        if (!cm.is_empty()) {
            cm.append_separator();
        }

        cm.append_item(
            'Console',
            function () {
                fb.ShowConsole();
            });

        cm.append_item(
            'Restart',
            function () {
                fb.RunMainMenuCommand("File/Restart");
            });

        cm.append_item(
            'Preferences...',
            function () {
                fb.RunMainMenuCommand("File/Preferences");
            });

        cm.append_separator();

        var edit = new ContextMenu('Edit panel scripts');
        cm.append(edit);

        var edit_fn = function (script_path) {
            if (!_.runCmd("notepad++.exe " + script_path, undefined, true)) {
                _.runCmd("notepad.exe " + script_path, undefined, true);
            }
        };

        g_script_list.forEach(function (filename) {
            var script_path = g_theme.script_folder + filename;
            edit.append_item(
                filename,
                edit_fn.bind(null, script_path),
                {is_grayed_out: IsFile(script_path)}
            );
        });

        cm.append_item(
            'Configure panel...',
            function () {
                window.ShowConfigure();
            });

        cm.append_item(
            'Panel properties...',
            function () {
                window.ShowProperties();
            });
    }
});

Object.assign(qwr_utils, {
    /**
     * @param {ContextMenu} cmac
     */
     append_albumCover_context_menu_to: function (cmac) {

        if (!transport.enableTransportControls_default) {
            cmac.append_item(
                'Stop', () => {
                    fb.Stop();
                }
            );
            cmac.append_item(
                'Previous', () => {
                    fb.Prev();
                }
            );
            cmac.append_item(
                !fb.IsPlaying ? 'Play' : 'Pause', () => {
                    fb.PlayOrPause();
                }
            );
            cmac.append_item(
                'Next', () => {
                    fb.Next();
                }
            );
            cmac.append_separator();

            const playbackOrderMenu = new ContextMenu('Playback order');
            const playbackOrderModes = ['Default', 'Repeat', 'Shuffle'];
            playbackOrderModes.forEach(function (playbackOrder) {
                playbackOrderMenu.append_item(
                    playbackOrder,
                    () => {
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
                    },
                    { is_radio_checked: playbackOrder === pref.playbackOrder }
                );
            })
            cmac.append(playbackOrderMenu);
            cmac.append_separator();
        }

        cmac.append_item(
            pref.layout_mode !== 'artwork_mode' && displayPlaylist ? 'Details' : 'Playlist', () => {
                if (pref.layout_mode !== 'artwork_mode') {
                    btns.playlist.onClick();
                    btns.playlist.changeState(ButtonState.Down);
                    displayPlaylist ? btns.playlist.changeState(ButtonState.Default) : btns.playlist.changeState(ButtonState.Down);
                    if (displayPlaylist) pref.displayLyrics = false;
                }
                if (pref.layout_mode === 'artwork_mode') {
                    btns.playlistArtworkMode.onClick();
                    btns.playlistArtworkMode.changeState(ButtonState.Down);
                    displayPlaylistArtworkMode ? btns.playlistArtworkMode.changeState(ButtonState.Down) : btns.playlistArtworkMode.changeState(ButtonState.Default);
                    if (displayPlaylistArtworkMode) pref.displayLyrics = false;
                }
            }
        );

        cmac.append_item(
            pref.displayLyrics ? 'Hide lyrics' : 'Display lyrics', () => {
                if (pref.layout_mode === 'artwork_mode' && displayPlaylist) btns.playlist.onClick();
                pref.displayLyrics = !pref.displayLyrics;
                btns.lyrics.changeState(ButtonState.Down);
                pref.displayLyrics ? btns.lyrics.changeState(ButtonState.Down) : btns.lyrics.changeState(ButtonState.Default);
                initLyrics();
                on_playback_seek();
                window.Repaint();
            }
        );

        if (aa_list.length > 1) {
            cmac.append_item(
                fb.IsPlaying ? 'Display next artwork' : '', () => {
                    albumArtIndex = (albumArtIndex + 1) % aa_list.length;
                    loadImageFromAlbumArtList(albumArtIndex, true);
                    lastLeftEdge = 0;
                    if (pref.rebornTheme || pref.randomTheme) { // Update Reborn/Random theme colors on new album art
                        newTrackFetchingArtwork = true;
                        getThemeColors(albumart);
                    }
                }
            );
        }

        cmac.append_separator();

        cmac.append_item(
            'Get disc art', () => {
                _.runCmd('https://fanart.tv/music-fanart');
            }
        );

        cmac.append_separator();

        cmac.append_item(
            'Open containing folder', () => {
                fb.RunContextCommand('Open Containing Folder');
            }
        );

        cmac.append_item(
            'Properties', () => {
                fb.RunContextCommand("Properties");
            }
        );

        cmac.append_separator();

        cmac.append_item(
            'Reload theme', () => {
                window.Reload();
            }
        );
    }
});
