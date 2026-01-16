'use strict';

/** @namespace */
var Context = {};

/**
 * @param{string} text_arg
 * @constructor
 */
Context.BaseObject = function (text_arg) {

	/**
	 * @param{number} start_idx
	 * @return{number} end_idx
	 * @protected
	 * @abstract
	 */
	this.initialize_menu_idx = function(start_idx) {
		throw LogicError("initialize_menu_idx not implemented");
	};

	/**
	 * @param{Context.Menu} parent_menu
	 * @protected
	 * @abstract
	 */
	this.initialize_menu = function(parent_menu) {
		throw LogicError("initialize_menu not implemented");
	};

	/**
	 * @param{number} idx
	 * @return{boolean}
	 * @protected
	 * @abstract
	 * */
	this.execute_menu = function (idx) {
		throw LogicError("execute_menu not implemented");
	};

	// const

	/** @const{string} */
	this.text = text_arg;

	/** @type{?number} */
	this.idx = undefined;
};

/**
 * @param{string} text_arg
 * @param{object=} [optional_args={}]
 * @param{boolean=} [optional_args.is_grayed_out=false]
 * @param{boolean=} [optional_args.is_checked=false]
 * @constructor
 * @extends {Context.BaseObject}
 */
Context.Menu = function (text_arg, optional_args) {
	Context.BaseObject.call(this, text_arg);

	// public:

	/**
	 * @param{Context.BaseObject} item
	 */
	this.append = function (item) {
		if (!_isInstanceOf(item, Context.BaseObject)) {
			throw TypeError('context_item', typeof item, 'instanceof Context.BaseObject');
		}

		this.menu_items.push(item);
	};

	/**
	 * @param{string} text_arg
	 * @param{function} callback_fn_arg
	 * @param{object=} [optional_args={}]
	 * @param{boolean=} [optional_args.is_grayed_out=false]
	 * @param{boolean=} [optional_args.is_checked=false]
	 * @param{boolean=} [optional_args.is_radio_checked=false]
	 */
	this.append_item = function (text_arg, callback_fn_arg, optional_args) {
		this.append(new Context.Item(text_arg, callback_fn_arg, optional_args));
	};

	this.append_separator = function () {
		this.append(new Context.Separator());
	};

	/**
	 * @param{number} start_idx
	 * @param{number} check_idx
	 */
	this.radio_check = function (start_idx, check_idx) {
		var item = this.menu_items[start_idx + check_idx];
		if (!item) {
			throw ArgumentError('check_idx', check_idx, 'Value is out of bounds');
		}

		if (start_idx >= this.menu_items.length) {
			throw ArgumentError('start_idx', start_idx, 'Value is out of bounds');
		}

		if (_isInstanceOf(item, Context.Separator)) {
			throw ArgumentError('check_idx', check_idx, 'Index points to MenuSeparator');
		}

		item.radio_check(true)
	};

	/**
	 * @return {boolean}
	 */
	this.is_empty = function(){
		return _.isEmpty(this.menu_items);
	};

	this.dispose = function () {
		this.cm = null;
		this.menu_items = null;
	};

	/**
	 * @param{number} start_idx
	 * @return{number} end_idx
	 * @protected
	 */
	this.initialize_menu_idx = function (start_idx) {
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
	 * @param{Context.Menu} parent_menu
	 * @protected
	 */
	this.initialize_menu = function (parent_menu) {
		this.menu_items.forEach(_.bind(function (item) {
			item.initialize_menu(this);
		}, this));

		this.cm.AppendTo(parent_menu.cm, is_grayed_out ? MF_GRAYED : MF_STRING, this.text);
	};

	/**
	 * @param{number} idx
	 * @return{boolean}
	 * @protected
	 * */
	this.execute_menu = function (idx) {
		for (var i = 0; i < this.menu_items.length; ++i) {
			var items = this.menu_items;
			var item = items[i];
			var next_item = items[i + 1];

			if (idx === item.idx || (idx > item.idx && (!next_item || idx < next_item.idx))) {
				return item.execute_menu(idx);
			}
		}
	};

	/** @const{boolean} */
	var is_grayed_out = !!(optional_args && optional_args.is_grayed_out);

	/** @protected */
	this.menu_items = [];

	/** @protected */
	this.cm = window.CreatePopupMenu();
};

Context.Menu.prototype = Object.create(Context.BaseObject.prototype);
Context.Menu.prototype.constructor = Context.Menu;

/**
 * @param{string} text_arg
 * @param{function} callback_fn_arg
 * @param{object=} [optional_args={}]
 * @param{boolean=} [optional_args.is_grayed_out=false]
 * @param{boolean=} [optional_args.is_checked=false]
 * @param{boolean=} [optional_args.is_radio_checked=false]
 * @constructor
 * @extends {Context.BaseObject}
 */

Context.Item = function(text_arg, callback_fn_arg, optional_args) {
	Context.BaseObject.call(this, text_arg);

	// public:

	/**
	 * @param{boolean} is_checked_arg
	 */
	this.check = function(is_checked_arg) {
		is_checked = is_checked_arg;
	};

	/**
	 * @param{boolean} is_checked_arg
	 */
	this.radio_check = function(is_checked_arg) {
		is_radio_checked = is_checked_arg;
	};

	// protected:

	/**
	 * @param{number} start_idx
	 * @return{number} end_idx
	 * @protected
	 */
	this.initialize_menu_idx = function(start_idx) {
		this.idx = start_idx;
		return this.idx + 1;
	};

	/**
	 * @param{Context.Menu} parent_menu
	 * @protected
	 */
	this.initialize_menu = function(parent_menu) {
		parent_menu.cm.AppendMenuItem(is_grayed_out ? MF_GRAYED : MF_STRING, this.idx, this.text);
		if (is_checked) {
			parent_menu.cm.CheckMenuItem(this.idx, true);
		}
		else if (is_radio_checked) {
			parent_menu.cm.CheckMenuRadioItem(this.idx, this.idx, this.idx);
		}
	};

	/**
	 * @param{number} idx
	 * @return{boolean}
	 * @protected
	 */
	this.execute_menu = function (idx) {
		if (this.idx !== idx) {
			return false;
		}

		callback_fn();
		return true;
	};

	// const

	/** @const{function} */
	var callback_fn = callback_fn_arg;

	/** @const{boolean} */
	var is_grayed_out = !!(optional_args && optional_args.is_grayed_out);

	var is_checked = !!(optional_args && optional_args.is_checked);
	var is_radio_checked = !!(optional_args && optional_args.is_radio_checked);
};
Context.Item.prototype = Object.create(Context.BaseObject.prototype);
Context.Item.prototype.constructor = Context.Item;

/**
 * @constructor
 * @extends {Context.BaseObject}
 */
Context.Separator = function () {
	Context.BaseObject.call(this, '');

	/**
	 * @param{number} start_idx
	 * @return{number} end_idx
	 * @protected
	 */
	this.initialize_menu_idx = function(start_idx) {
		this.idx = start_idx;
		return this.idx + 1;
	};

	/**
	 * @param{Context.Menu} parent_menu
	 * @protected
	 */
	this.initialize_menu = function(parent_menu) {
		parent_menu.cm.AppendMenuSeparator();
	};

	/**
	 * @param{number} idx
	 * @return{boolean}
	 * @protected
	 * */
	this.execute_menu = function (idx) {
		return false;
	};
};
Context.Separator.prototype = Object.create(Context.BaseObject.prototype);
Context.Separator.prototype.constructor = Context.Separator;

/**
 * @param {FbMetadbHandleList} metadb_handles_arg
 * @constructor
 * @extends {Context.BaseObject}
 */
Context.FoobarMenu = function (metadb_handles_arg) {
	Context.BaseObject.call(this, '');

	this.dispose = function() {
		this.cm = null;
	};

	/**
	 * @param{number} start_idx
	 * @return{number} end_idx
	 * @protected
	 */
	this.initialize_menu_idx = function(start_idx) {
		this.idx = start_idx;
		return this.idx + 5000;
	};

	/**
	 * @param{Context.Menu} parent_menu
	 * @protected
	 */
	this.initialize_menu = function(parent_menu) {
		this.cm.InitContextPlaylist();
		this.cm.BuildMenu(parent_menu.cm, this.idx, this.idx + 5000);
	};

	/**
	 * @param{number} idx
	 * @return{boolean}
	 * @protected
	 * */
	this.execute_menu = function (idx) {
		this.cm.ExecuteByID(idx - this.idx);
	};

	/** @private{IContextMenuManager} */
	this.cm = fb.CreateContextMenuManager();

	var metadb_handles = metadb_handles_arg;
};
Context.FoobarMenu.prototype = Object.create(Context.BaseObject.prototype);
Context.FoobarMenu.prototype.constructor = Context.FoobarMenu;

/**
 * @final
 * @constructor
 * @extends {Context.Menu}
 */
Context.MainMenu = function() {
	Context.Menu.call(this, '');

	// public:

	/** @return{boolean} true, if some item was clicked*/
	this.execute = function (x, y) {
		// Initialize menu
		var cur_idx = 1;
		this.menu_items.forEach(function(item){
			if (!item.initialize_menu_idx) {
				return;
			}
			cur_idx = item.initialize_menu_idx(cur_idx);
		});

		this.menu_items.forEach(_.bind(function(item){
			item.initialize_menu(this);
		},this));

		// Execute menu
		var idx = this.cm.TrackPopupMenu(x, y);
		if (!idx) {
			return false;
		}

		return this.execute_menu(idx);
	};
};
Context.MainMenu.prototype = Object.create(Context.Menu.prototype);
Context.MainMenu.prototype.constructor = Context.MainMenu;

_.mixin(qwr_utils, {
	/**
	 * @param {Context.Menu} cm
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
				fb.Restart();
			});

		cm.append_item(
			'Preferences...',
			function () {
				fb.RunMainMenuCommand("File/Preferences");
			});

		cm.append_separator();

		cm.append_item(
			'Reload panel',
			function () {
				window.Reload();
			});

		cm.append_separator();

		/*
		var edit = new Context.Menu('Edit panel scripts');
		cm.append(edit);

		var edit_fn = function (script_path) {
			if (!_runCmd("notepad++.exe " + script_path, undefined, true)) {
				_runCmd("notepad.exe " + script_path, undefined, true);
			}
		};

		g_script_list.forEach(function (filename) {
			var script_path = g_theme.script_folder + filename;
			edit.append_item(
				filename,
				edit_fn.bind(null, script_path),
				{is_grayed_out: !utils.IsFile(script_path)}
			);
		});
		*/

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