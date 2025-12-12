'use strict';
//29/10/24

function _lastfm() {
	this.notify_data = (name, data) => {
		if (name == '2K3.NOTIFY.LASTFM') {
			this.username = this.read_ini('username');
			this.sk = this.read_ini('sk');
			if (typeof buttons == 'object' && typeof buttons.update == 'function') {
				buttons.update();
				window.Repaint();
			}
			_.forEach(panel.list_objects, (item) => {
				if (item.mode == 'lastfm_info' && item.properties.mode.value > 0) {
					item.update();
				}
			});
		}
	}

	this.update_username = () => {
		const username = utils.InputBox(window.ID, 'Enter your Last.fm username', window.ScriptInfo.Name, this.username);
		if (username != this.username) {
			this.write_ini('username', username);
			this.update_sk('');
		}
	}

	this.get_base_url = () => {
		return 'http://ws.audioscrobbler.com/2.0/?format=json&api_key=' + this.api_key.value;
	}

	this.read_ini = (k) => {
		return utils.ReadINI(this.ini_file, 'Last.fm', k);
	}

	this.write_ini = (k, v) => {
		utils.WriteINI(this.ini_file, 'Last.fm', k, v);
	}

	this.update_sk = (sk) => {
		this.write_ini('sk', sk);
		window.NotifyOthers('2K3.NOTIFY.LASTFM', 'update');
		this.notify_data('2K3.NOTIFY.LASTFM', 'update');
	}

	this.tfo = {
		key : fb.TitleFormat('$lower(%artist% - %title%)'),
		artist : fb.TitleFormat('%artist%'),
		title : fb.TitleFormat('%title%'),
		album : fb.TitleFormat('[%album%]'),
		loved : fb.TitleFormat('$if2(%SMP_LOVED%,0)'),
		playcount : fb.TitleFormat('$if2(%SMP_PLAYCOUNT%,0)'),
		first_played : fb.TitleFormat('%SMP_FIRST_PLAYED%')
	};

	_createFolder(folders.data);
	this.ini_file = folders.data + 'lastfm.ini';
	this.api_key = new _p('2K3.LASTFM.APIKEY', '');
	this.username = this.read_ini('username');
	this.sk = this.read_ini('sk');
	this.ua = 'spider_monkey_panel_lastfm';
}
