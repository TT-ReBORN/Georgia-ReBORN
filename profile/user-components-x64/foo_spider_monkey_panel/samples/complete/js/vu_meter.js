function Clamp(value, min, max) {
	if (value < min)
		return min;
	else if (value > max)
		return max;
	else
		return value;
}

function EnableMenuIf(condition) {
	return condition ? MF_STRING : MF_GRAYED;
}

function _vu_meter(x, y, w, h) {
	this.clear_graph = function () {
		for (var c = 0; c < this.channels.count; ++c) {
			this.RMS_levels[c] = 0;
			this.Peak_levels[c] = 0;
			this.Peak_falldown[c] = 0;
		}

		window.Repaint();
	}

	this.init = function () {
		this.dBrange = this.maxDB - this.minDB;

		if (fb.IsPaused)
			this.update_graph();
		else if (fb.IsPlaying)
			this.start_timer();
	}

	this.start_timer = function () {
		if (!this.timer_id) {
			this.timer_id = window.SetInterval((function () { this.update_graph(); }).bind(this), this.timer_interval);
		}
	}

	this.stop_timer = function () {
		if (this.timer_id) {
			window.ClearInterval(this.timer_id);
		}

		this.timer_id = 0;
	}

	this.to_db = function (num) {
		return 20 * Math.log(num) / Math.LN10;
	}

	this.update_graph = function () {
		var chunk = fb.GetAudioChunk(this.rms_window);

		if (!chunk)
			return;

		this.channels.count = chunk.ChannelCount;
		this.channels.config = chunk.ChannelConfig;
		var data = chunk.Data;
		var frame_len = chunk.SampleCount;

		if (data && this.channels.count > 0 && frame_len > 0) {
			var old_count = this.Peak_levels.length;
			this.RMS_levels.length = this.channels.count;
			this.Peak_levels.length = this.channels.count;
			this.Peak_falldown.length = this.channels.count;

			if (old_count < this.channels.count) {
				for (var c = old_count; c < this.channels.count; ++c) {
					this.Peak_levels[c] = 0;
					this.Peak_falldown[c] = 0;
				}
			}

			for (var c = 0; c < this.channels.count; ++c) {
				var sum = 0, peak = 0;

				for (var i = c; i < data.length; i += this.channels.count) {
					var s = Math.abs(data[i]);

					if (s > peak) {
						peak = s;
					}

					sum += s * s;
				}

				this.RMS_levels[c] = Math.sqrt(sum / frame_len);

				if (peak >= this.Peak_levels[c]) {
					this.Peak_levels[c] = peak;
					this.Peak_falldown[c] = 0;
				} else {
					if (++this.Peak_falldown[c] > this.peak_hold) {
						this.Peak_levels[c] *= this.peak_fall_mul;
					}
				}
			}

			window.Repaint();
		}
	}

// callbacks begin
	this.paint = function (gr) {
		if (this.w < 1 || this.h < 1)
			return;

		var smooth_mode = this.properties.meter_style.value == 0;

		if (this.w > this.h) { // horizontal
			var bar_width = this.w;
			var bar_height = Math.floor(this.h / this.channels.count);

			if (!smooth_mode) {
				var block_count = Math.max(Math.floor(this.dBrange / this.properties.rms_block_db.value), 1);
				var block_width = bar_width / block_count;
				var block_pad = Math.max(Math.ceil(block_width * 0.05), 1);
			}

			for (var c = 0; c < this.channels.count; ++c) {
				if (this.RMS_levels[c]) {
					var rms_db = Clamp(this.to_db(this.RMS_levels[c]), this.minDB, this.maxDB);

					if (smooth_mode) {
						var width = Math.round(bar_width * (rms_db - this.minDB) / this.dBrange);
						gr.FillSolidRect(this.x, this.y + (bar_height * c), width, bar_height - 1, this.properties.custom_bar.value);
					} else {
						var blocks = Math.round(block_count * (rms_db - this.minDB) / this.dBrange);
						var width = blocks * block_width;
						gr.FillSolidRect(this.x, this.y + (bar_height * c), width, bar_height - 1, this.properties.custom_bar.value);

						for (var i = 1; i <= blocks; ++i) {
							gr.FillSolidRect(this.x - Math.ceil(block_pad / 2) + (i * block_width), this.y + (bar_height * c), block_pad, bar_height - 1, this.properties.custom_background.value);
						}
					}
				}

				if (this.peak_bar_width > 0 && this.Peak_levels[c] > 0) {
					var peak_db = Clamp(this.to_db(this.Peak_levels[c]), this.minDB, this.maxDB);

					if (peak_db > this.minDB) {
						var peak_pos = Math.round(bar_width * (peak_db - this.minDB) / this.dBrange);
						gr.FillSolidRect(this.x + peak_pos - this.peak_bar_width / 2, this.y + (bar_height * c), this.peak_bar_width, bar_height - 1, this.properties.custom_peak.value);
					}
				}
			}
		} else { // vertical
			var bar_width = Math.floor(this.w / this.channels.count);
			var bar_height = this.h;

			if (!smooth_mode) {
				var block_count = Math.max(Math.floor(this.dBrange / this.properties.rms_block_db.value), 1);
				var block_height = bar_height / block_count;
				var block_pad = Math.max(Math.ceil(block_height * 0.05), 1);
			}

			for (var c = 0; c < this.channels.count; ++c) {
				if (this.RMS_levels[c]) {
					var rms_db = Clamp(this.to_db(this.RMS_levels[c]), this.minDB, this.maxDB);

					if (smooth_mode) {
						var height = Math.round(bar_height * (rms_db - this.minDB) / this.dBrange);
					} else {
						var blocks = Math.round(block_count * (rms_db - this.minDB) / this.dBrange);
						var height = blocks * block_height;
					}

					gr.FillSolidRect(this.x + (bar_width * c), this.y, bar_width - 1, this.h, this.properties.custom_bar.value);
					gr.FillSolidRect(this.x + (bar_width * c), this.y, bar_width - 1, this.h - height, this.properties.custom_background.value);

					if (!smooth_mode) {
						for (var i = 1; i <= blocks; ++i) {
							gr.FillSolidRect(bar_width * c, this.h - height + Math.ceil(block_pad / 2) + (i * block_height), bar_width - 1, block_pad, this.properties.custom_background.value);
						}
					}
				}

				if (this.peak_bar_width > 0 && this.Peak_levels[c] > 0) {
					var peak_db = Clamp(this.to_db(this.Peak_levels[c]), this.minDB, this.maxDB);

					if (peak_db > this.minDB) {
						var peak_pos = this.h - Math.round(bar_height * (peak_db - this.minDB) / this.dBrange);
						gr.FillSolidRect(this.x + (bar_width * c), this.y + peak_pos, bar_width - 1, this.peak_bar_width, this.properties.custom_peak.value);
					}
				}
			}
		}
	}

	this.playback_new_track = function () {
		this.start_timer();
	}

	this.playback_pause = function (state) {
		state ? this.stop_timer() : this.start_timer();
	}

	this.playback_stop = function (reason) {
		if (reason != 2) {
			this.stop_timer();
		}

		this.clear_graph();
	}

	this.rbtn_up = function (x, y) {
		var menu = window.CreatePopupMenu();
		var style_menu = window.CreatePopupMenu();

		menu.AppendMenuItem(MF_STRING, 3, 'Background...');
		menu.AppendMenuItem(MF_STRING, 4, 'Bar...');
		menu.AppendMenuItem(EnableMenuIf(this.peak_bar_width > 0), 5, 'Peak...');

		style_menu.AppendMenuItem(MF_STRING, 10, 'Smooth');
		style_menu.AppendMenuItem(MF_STRING, 11, 'Blocks');
		style_menu.CheckMenuRadioItem(10, 11, this.properties.meter_style.value + 10);

		if (this.properties.meter_style.value == 1) {
			style_menu.AppendMenuSeparator();
			style_menu.AppendMenuItem(MF_GRAYED, 0, 'Block width (dB)');

			this.rms_block_dbs.forEach(function (item, index) {
				style_menu.AppendMenuItem(MF_STRING, 20 + index, item);
			});

			var rms_block_db_index = this.rms_block_dbs.indexOf(this.properties.rms_block_db.value);
			style_menu.CheckMenuRadioItem(20, 20 + this.rms_block_dbs.length, 20 + rms_block_db_index);
		}

		style_menu.AppendTo(menu, MF_STRING, 'Meter style');

		menu.AppendMenuSeparator();
		menu.AppendMenuItem(MF_STRING, 50, 'Configure...');

		var idx = menu.TrackPopupMenu(x, y);

		switch (idx) {
		case 0:
			break;
		case 3:
			var tmp = utils.ColourPicker(window.ID, this.properties.custom_background.value);

			if (tmp != this.properties.custom_background.value) {
				this.properties.custom_background.value = tmp;
				window.Repaint();
			}
			break;
		case 4:
			var tmp = utils.ColourPicker(window.ID, this.properties.custom_bar.value);

			if (tmp != this.properties.custom_bar.value) {
				this.properties.custom_bar.value = tmp;
				window.Repaint();
			}
			break;
		case 5:
			var tmp = utils.ColourPicker(window.ID, this.properties.custom_peak.value);

			if (tmp != this.properties.custom_peak.value) {
				this.properties.custom_peak.value = tmp;
				window.Repaint();
			}
			break;
		case 10:
		case 11:
			this.properties.meter_style.value = idx - 10;
			window.Repaint();
			break;
		case 20:
		case 21:
		case 22:
		case 23:
			this.properties.rms_block_db.value = this.rms_block_dbs[idx - 20];
			window.Repaint();
			break;
		case 50:
			window.ShowConfigureV2();
			break;
		}

		return true;
	}
// callbacks end

	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	this.minDB = -60; // minimum dB on the meter (meter range)
	this.maxDB = 5; // maximum dB on the meter (meter range)

	this.rms_block_dbs = [0.3125, 0.625, 1.25, 2.5];
	this.RMS_levels = [];
	this.Peak_levels = [];
	this.Peak_falldown = [];
	this.timer_id = 0;
	this.dBrange = 0;

	this.channels = {
		count : 2,
		config : 0,
	};

	this.properties = {
		custom_background : new _p("2K3.METER.BACKGROUND.COLOUR", _RGB(30, 30, 30)),
		custom_bar : new _p("2K3.METER.BAR.COLOUR", _RGB(200, 200, 200)),
		custom_peak : new _p("2K3.METER.PEAK.COLOUR", _RGB(255, 0, 0)), // no default
		meter_style : new _p("2K3.METER.STYLE", 1), // 0: smooth, 1: blocks
		rms_block_db : new _p("2K3.METER.BLOCK.DB", 0.625),
	};
}
