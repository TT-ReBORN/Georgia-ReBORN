"use strict";

window.DrawMode = 1;

include(`${fb.ComponentPath}\\docs\\Flags.js`);
include(`${fb.ComponentPath}\\docs\\Effects.js`);

const img = d2d.Image(`${fb.ComponentPath}\\samples\\d2d\\images\\Flowers.jpg`);

const scale = d2d.Effect(Effects.Scale.ID);
scale.SetInput(0, img);

const emboss = d2d.Effect(Effects.Posterize.ID);
emboss.SetValue(Effects.Posterize.RedValueCount, 4);
emboss.SetValue(Effects.Posterize.GreenValueCount, 4);
emboss.SetValue(Effects.Posterize.BlueValueCount, 4);
emboss.SetInputEffect(0, scale);

let ww = 0, wh = 0;
function on_size(width, height) {
    ww = width;
    wh = height;
	scale.SetValue(Effects.Scale.Scale, new Float32Array([ww / img.Width, wh / img.Height]));
}

let font = gdi.Font("Segoe UI", 32, 1);
let g_backcolour = 0xFFFFFFFF;
let steps = 4;
function on_paint(dgr) {
    dgr.FillSolidRect(0, 0, ww, wh, g_backcolour);
	// emboss.SetValue(Effects.Posterize.RedValueCount, steps);
    // emboss.SetValue(Effects.Posterize.GreenValueCount, steps);
    emboss.SetValue(Effects.Posterize.BlueValueCount, steps);
	dgr.DrawEffect(emboss, 0, 0, 0, 0, ww, wh);
	dgr.DrawText(`POSTERIZE effect\nScroll to change\nSteps: ${steps}`, font, 0xFFFFFFFF, 0, 0, ww, wh, DT_CENTER | DT_VCENTER);
}

function on_mouse_wheel(step) {
	steps += step;
	if(steps == 1) steps = 2;
	if(steps == 17) steps = 16;
	window.Repaint();
}
