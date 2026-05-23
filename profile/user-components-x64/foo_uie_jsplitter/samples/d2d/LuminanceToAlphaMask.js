"use strict";

window.DrawMode = 1;

include(`${fb.ComponentPath}\\docs\\Flags.js`);
include(`${fb.ComponentPath}\\docs\\Effects.js`);

const img = d2d.Image(`${fb.ComponentPath}\\samples\\d2d\\images\\Field.jpg`);
const img2 = d2d.Image(`${fb.ComponentPath}\\samples\\d2d\\images\\Flowers.jpg`);

const scale = d2d.Effect(Effects.Scale.ID);
scale.SetInput(0, img);
const scale2 = d2d.Effect(Effects.Scale.ID);
scale2.SetInput(0, img2);

const luminanceToAlpha = d2d.Effect(Effects.LuminanceToAlpha.ID);
luminanceToAlpha.SetInputEffect(0, scale2);
const alphaMask = d2d.Effect(Effects.AlphaMask.ID);
alphaMask.SetInputEffect(0, scale);
alphaMask.SetInputEffect(1, luminanceToAlpha);

let ww = 0, wh = 0;
function on_size(width, height) {
    ww = width;
    wh = height;
	scale.SetValue(Effects.Scale.Scale, new Float32Array([ww / 2 / img.Width, wh / 2 / img.Height]));
	scale2.SetValue(Effects.Scale.Scale, new Float32Array([ww / 2 / img2.Width, wh / 2 / img2.Height]));
}

let font = gdi.Font("Segoe UI", 32, 1);
let g_backcolour = 0xFF000000;
function on_paint(dgr) {
    dgr.FillSolidRect(0, 0, ww, wh, g_backcolour);		
	dgr.DrawEffect(scale, 0, 0, 0, 0, ww / 2, wh / 2);
	dgr.DrawEffect(scale2, ww / 2, 0, 0, 0, ww / 2, wh / 2);	
	dgr.DrawEffect(alphaMask, ww / 4, wh / 2, 0, 0, ww / 2, wh / 2);
}
