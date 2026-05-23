"use strict";

window.DrawMode = 1;

include(`${fb.ComponentPath}\\docs\\Flags.js`);
include(`${fb.ComponentPath}\\docs\\Helpers.js`);

const imagesDir = `${fb.ComponentPath}\\samples\\d2d\\images`;

const clusters = 10;
const minChroma = 0.02;

const font = gdi.Font("Segoe UI", 18, 1);
const font2 = gdi.Font("Segoe UI", 10, 0);
let showRGB = false;
let showRGB2 = false;

let imageFiles = utils.Glob(`${imagesDir}\\*.*`);

let img = null;
let nImg = 0;

let csj = [];
let csjv2 = [];
let csp = 0;
let cs2p = 0;

// let getSum = 0;
// let get2Sum = 0;
// for(const f of imageFiles)
// {
//     img = gdi.Image(f);
//     
//     let now = performance.now();
//     csj = JSON.parse(img.GetColourSchemeJSON(clusters));
//     csp = performance.now() - now;
//     getSum += csp;

//     now = performance.now();
//     csjv2 = JSON.parse(img.GetColourSchemeJSONV2(clusters, minChroma));
//     cs2p = performance.now() - now;
//     get2Sum += cs2p;
// }
// console.log(getSum / imageFiles.length);
// console.log(get2Sum / imageFiles.length);

on_mouse_wheel(0);

function on_paint(dgr) {
	dgr.DrawImage(img, 0, 0, window.Width, window.Height, 0, 0, img.Width, img.Height);
	
	dgr.FillSolidRect(10, 10, 100, 36 * clusters, 0xFFFFFFFF);
	for(let i = 0; i < csj.length; i++) 
	{
		dgr.FillSolidRect(15, 15 + i * 35, 90, 35, csj[i].col);
		if(showRGB)
			dgr.DrawText(toRGB(csj[i].col), font2, 0xFFFFFFFF, 15, 15 + i * 35, 90, 35, DT_CENTER | DT_VCENTER);
	}
	
	dgr.FillSolidRect(120, 10, 100, 36 * clusters, 0xFFFFFFFF);
	for(let i = 0; i < csjv2.length; i++) 
	{
		dgr.FillSolidRect(125, 15 + i * 35, 90, 35, csjv2[i].col);
		if(showRGB2)
			dgr.DrawText(toRGB(csjv2[i].col), font2, 0xFFFFFFFF, 125, 15 + i * 35, 90, 35, DT_CENTER | DT_VCENTER);
	}
	dgr.SetSmoothingMode(2);
	dgr.DrawStrokedText(csp, font, 0xFF000000, 1, 0xFFFFFFFF, 12, 36 * clusters + 15, 90, 50);
	dgr.DrawStrokedText(cs2p, font, 0xFF000000, 1, 0xFFFFFFFF, 125, 36 * clusters + 15, 90, 50);
}

function on_mouse_wheel(step)
{
	nImg += step;
	if(nImg == -1) nImg = imageFiles.length - 1;
	if(nImg == imageFiles.length) nImg = 0;
	
	img = gdi.Image(imageFiles.length > 0 ? imageFiles[nImg] : `${fb.ComponentPath}\\samples\\d2d\\images\\Flowers.jpg`);	
		
	let now = performance.now();
	csj = JSON.parse(img.GetColourSchemeJSON(clusters));
	csp = performance.now() - now;	

	now = performance.now();
	let csv2 = img.GetColourSchemeJSONV2(clusters, minChroma)
	csjv2 = JSON.parse(csv2);
	cs2p = performance.now() - now;
	
	console.log(csp, cs2p);

	window.Repaint();
}

function on_mouse_lbtn_down(x, y, mask) {
	if(x > 10 && x < 110 && y > 10 && y < 36 * clusters) 
	{
		showRGB = !showRGB;
		window.Repaint();
	}
	if(x > 120 && x < 220 && y > 10 && y < 36 * clusters) 
	{
		showRGB2 = !showRGB2;
		window.Repaint();
	}
}
