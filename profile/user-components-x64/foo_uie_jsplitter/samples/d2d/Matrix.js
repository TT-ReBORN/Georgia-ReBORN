"use strict";

window.DrawMode = 1;
window.EraseOnRepaint = false;

include(`${fb.ComponentPath}\\docs\\Effects.js`);
include(`${fb.ComponentPath}\\docs\\Helpers.js`);
include(`${fb.ComponentPath}\\docs\\Flags.js`);

const alphabet = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
const fontSize = 16;
const font = gdi.Font("Consolas", fontSize, 1);
const drops = [];

const img = d2d.Image(`${fb.ComponentPath}\\samples\\d2d\\images\\neo.jpg`);
const scale = d2d.Effect(Effects.Scale.ID);
scale.SetInput(0, img);

const chromakey = d2d.Effect(Effects.ChromaKey.ID);
chromakey.SetInputEffect(0, scale);
const scheme = JSON.parse(img.GetColourSchemeJSONV2(10, 0.02));
const color = scheme[1].col;
chromakey.SetValue(Effects.ChromaKey.Color, new Float32Array([getRed(color)/255, getGreen(color)/255, getBlue(color)/255]));
chromakey.SetValue(Effects.ChromaKey.Feather, true);

let ww = 0, wh = 0;
function on_size(width, height) {
    ww = width;
    wh = height;
	if(ww > 0 && wh > 0) {
		const columns = Math.floor(ww / fontSize);
		drops.length = columns;
		for (let i = 0; i < columns; i++) if (isNaN(drops[i])) drops[i] = 0;
		scale.SetValue(Effects.Scale.Scale, new Float32Array([ww / img.Width, wh / img.Height]));
	}
}

let started = false;
function on_paint(dgr) {
	
	dgr.FillSolidRect(0, 0, ww, wh, 0x0D000000);

	for (let i = 0; i < drops.length; i++) {
		const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
		const x = i * fontSize;
		const y = drops[i] * fontSize;
		
		dgr.DrawText(text, font, 0xFF00FF00, x, y, fontSize, fontSize * 4 / 3);

		if (y > wh && Math.random() > 0.975)
			drops[i] = 0;
		else
			drops[i]++;
	}
	
	if(!started)
	{
		dgr.DrawEffect(scale, 0, 0, 0, 0, ww, wh);
		dgr.DrawText("Clik to enter the matrix...", font, 0xFFFFFFFF, 10, 10, ww, 100, DT_CENTER | DT_VCENTER);
	}
	else
		dgr.DrawEffect(chromakey, 0, 0, 0, 0, ww, wh);
}

function on_mouse_lbtn_down(x, y, mask) {
	if(!started)
	{
		started = true;
		window.SetInterval(() => { window.Repaint(); }, 50);
	}
}
