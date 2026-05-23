"use strict";

window.DrawMode = 1;

include(`${fb.ComponentPath}\\docs\\Flags.js`);
include(`${fb.ComponentPath}\\docs\\Effects.js`);

const img = d2d.Image(`${fb.ComponentPath}\\samples\\d2d\\images\\Flowers.jpg`);

const scale = d2d.Effect(Effects.Scale.ID);
scale.SetInput(0, img);

const emboss = d2d.Effect(Effects.Emboss.ID);
emboss.SetValue(Effects.Emboss.Height, 5.0);
emboss.SetValue(Effects.Emboss.Direction, 90.0);
emboss.SetInputEffect(0, scale);

let ww = 0, wh = 0;
function on_size(width, height) {
    ww = width;
    wh = height;
	scale.SetValue(Effects.Scale.Scale, new Float32Array([ww / img.Width, wh / img.Height]));
}

let font = gdi.Font("Segoe UI", 32, 1);
let g_backcolour = 0xFFFFFFFF;
let height = 1.0;
let direction = 0.0;
function on_paint(dgr) {
    dgr.FillSolidRect(0, 0, ww, wh, g_backcolour);
	emboss.SetValue(Effects.Emboss.Height, height);
	dgr.DrawEffect(emboss, 0, 0, 0, 0, ww, wh);
	dgr.DrawText(`EMBOSS effect\nMove around center and scroll\nDirection (deg): ${direction.toFixed(2)}\nHeight: ${height}`, font, 0xFF000000, 0, 0, ww, wh, DT_CENTER | DT_VCENTER);
}

let lastX = 0, lastY = 0;
function on_mouse_move(x, y, mask) {
    let dx = x - ww / 2;
    let dy = wh / 2 - y;
	if(dx == 0) 
		direction = dy >= 0 ? 90 : 270;
	else
	{
		direction = Math.atan(dy / dx) * 180 / Math.PI;
		if(dx < 0) direction += 180; else if(dy < 0) direction += 360;
	}
    emboss.SetValue(Effects.Emboss.Direction, direction);
	window.Repaint();
}
function on_mouse_wheel(step) {
	height += step;
	if(height == 0) height = 1;
	if(height == 11) height = 10;
	window.Repaint();
}
