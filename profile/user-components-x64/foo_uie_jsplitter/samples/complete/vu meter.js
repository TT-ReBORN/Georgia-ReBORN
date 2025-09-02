'use strict';

window.DefineScript('Vu Meter', {author:'Case + marc2003', options:{grab_focus:false}});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\vu_meter.js');

// Modified version, auto orientation, no labels

var vu_meter = new _vu_meter(0, 0, 0, 0);

vu_meter.timer_interval = 1000 / 60; // in ms (default: 60 fps update rate)
vu_meter.rms_window = 50 / 1000; // in seconds (default: 50 ms)
vu_meter.peak_hold = 20; // in frames
vu_meter.peak_fall_mul = 0.99;
vu_meter.peak_bar_width = 1; // in pixels

vu_meter.init();

function on_mouse_rbtn_up(x, y) {
	return vu_meter.rbtn_up(x, y);
}

function on_paint(gr) {
	gr.FillSolidRect(0, 0, vu_meter.w, vu_meter.h, vu_meter.properties.custom_background.value);
	vu_meter.paint(gr);
}

function on_playback_new_track() {
	vu_meter.playback_new_track();
}

function on_playback_pause(state) {
	vu_meter.playback_pause(state);
}

function on_playback_stop(reason) {
	vu_meter.playback_stop(reason);
}

function on_size() {
	vu_meter.w = window.Width;
	vu_meter.h = window.Height;
}
