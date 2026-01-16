'use strict';

window.DefineScript(
	'CaTRoX Playlist',
	{
		author : 'The Qwertiest',
		features : {
			drag_n_drop : true,
			grab_focus : true
		}
	}
);

const g_theme_path = fb.ComponentPath + 'samples\\complete\\catrox\\';

include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');

[
	'Common.js',
	'Control_ContextMenu.js',
	'Control_Scrollbar.js',
	'Control_List.js',
	'Utility_LinkedList.js',
	'Playlist.js'
].forEach((file) => {
	include(g_theme_path + file);
});
