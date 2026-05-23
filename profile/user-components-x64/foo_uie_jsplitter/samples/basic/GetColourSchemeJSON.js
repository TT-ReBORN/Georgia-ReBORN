"use strict";

window.DrawMode = 1;

include(`${fb.ComponentPath}\\docs\\Flags.js`);
include(`${fb.ComponentPath}\\docs\\Helpers.js`);

const font = gdi.Font("Segoe UI", 24, 1);

const clusters = 10;

const imagesDir = `${fb.ProfilePath}\\covers`;
let imageFiles = utils.Glob(`${imagesDir}\\*.*`);

let nImg = 0;

let img = gdi.Image(imageFiles.length > 0 ? imageFiles[nImg] : `${fb.ComponentPath}\\samples\\d2d\\images\\Flowers.jpg`);

let now = performance.now();
let csj = JSON.parse(img.GetColourSchemeJSON(clusters));
let csp = performance.now() - now;

now = performance.now();
let csjv2 = JSON.parse(img.GetColourSchemeJSONV2(clusters));
let cs2p = performance.now() - now;

function on_paint(gr) {
	gr.DrawImage(img, 0, 0, window.Width, window.Height, 0, 0, img.Width, img.Height);
	
	gr.FillSolidRect(10, 10, 100, 36 * clusters, 0xFFFFFFFF);
	for(let i = 0; i < csj.length; i++) gr.FillSolidRect(15, 15 + i * 35, 90, 35, csj[i].col);
	gr.GdiDrawText(csp, font, 0xFFFFFFFF, 10, 36 * clusters + 10, 100, 50);

	gr.FillSolidRect(120, 10, 100, 36 * clusters, 0xFFFFFFFF);
	for(let i = 0; i < csjv2.length; i++) gr.FillSolidRect(125, 15 + i * 35, 90, 35, csjv2[i].col);
	gr.GdiDrawText(cs2p, font, 0xFFFFFFFF, 120, 36 * clusters + 10, 100, 50);
}

function on_mouse_wheel(step)
{
	nImg += step;
	if(nImg == -1) nImg = imageFiles.length - 1;
	if(nImg == imageFiles.length) nImg = 0;
	
	img = gdi.Image(imageFiles.length > 0 ? imageFiles[nImg] : `${fb.ComponentPath}\\samples\\d2d\\images\\Flowers.jpg`);	
		
	now = performance.now();
	csj = JSON.parse(img.GetColourSchemeJSON(clusters));
	csp = performance.now() - now;
	
	now = performance.now();
	csjv2 = JSON.parse(img.GetColourSchemeJSONV2(clusters));
	cs2p = performance.now() - now;

	window.Repaint();
}
