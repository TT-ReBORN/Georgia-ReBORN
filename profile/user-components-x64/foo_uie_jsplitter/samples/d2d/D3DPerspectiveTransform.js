"use strict";

window.DrawMode = 1;

include(`${fb.ComponentPath}\\docs\\Effects.js`);

const img = d2d.Image(`${fb.ComponentPath}\\samples\\d2d\\images\\Flowers.jpg`);

const scale = d2d.Effect(Effects.Scale.ID);
scale.SetInput(0, img);

const effect = d2d.Effect(Effects.D3DPerspectiveTransform.ID);
effect.SetInputEffect(0, scale);

let angles = new Float32Array(3);
let dx = 0, dy = 0;
let drag = false;

window.SetInterval(() => {
	if(drag) return;
	const angleY = Math.abs(angles[1]);
	angles[0] += dy;
	angles[1] += dx;
	angles[0] %= 360;
	angles[1] %= 360;
	window.Repaint();
}, 10);

let ww = 0, wh = 0;
function on_size(width, height) {
	ww = width;
	wh = height;
	scale.SetValue(Effects.Scale.Scale, new Float32Array([ww / img.Width, wh / img.Height]));
	effect.SetValue(Effects.D3DPerspectiveTransform.RotationOrigin, new Float32Array([ww / 2, wh / 2, 0]));
	effect.SetValue(Effects.D3DPerspectiveTransform.PerspectiveOrigin, new Float32Array([ww / 2, wh / 2]));	
}

let font = d2d.Font("Segoe UI", 24, 1);
function on_paint(dgr) {
    dgr.FillSolidRect(0, 0, ww, wh, 0xFFAAAAAA);	

	effect.SetValue(Effects.D3DPerspectiveTransform.Rotation, angles);
	dgr.DrawEffect(effect, 0, 0, 0, 0, ww, wh);
	
	dgr.DrawText("Change direction with mouse", font, 0xFFFFFFFF, 10, 10, ww, 45);
}

let lastX = 0, lastY = 0;
function on_mouse_lbtn_down(x, y, mask) {
	drag = true;
	lastX = x;
	lastY = y;	
}
function on_mouse_move(x, y, mask) {
	if(!drag) return;
	dx = (x - lastX) / 2;
	dy = (y - lastY) / 2;
	lastX = x;
	lastY = y;	
	const angleY = Math.abs(angles[1]);
	if(angleY < 90 || angleY > 270) dy = -dy;
	angles[0] += dy;
	angles[1] += dx;
	angles[0] %= 360;
	angles[1] %= 360;
	window.Repaint();
}
function on_mouse_lbtn_up(x, y, mask) {
	drag = false;
}
