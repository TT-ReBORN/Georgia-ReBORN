"use strict";

window.DrawMode = 1;
let iconsCount = 100;

include(`${fb.ComponentPath}\\docs\\Flags.js`);

let ww = 0;
let wh = 0;
let g_backcolour = 0xFFAAAAAA;

class IconInfo 
{
    constructor(bitmap, screenWidth) {
        this.Bitmap = bitmap;
        this.Reset(screenWidth);
    }

    Reset(screenWidth) {
        this.X = Math.floor(Math.random() * (screenWidth + 100)) - 100;
        this.Y = -100 - Math.floor(Math.random() * 300);
        this.Opacity = (Math.random() * 0.5 + 0.5) * 255;
        this.Speed = Math.random() * 10;
    }
}

let bmps = [
	gdi.Image(`${fb.ComponentPath}\\samples\\d2d\\images\\icons8-car-production-96.png`),
	gdi.Image(`${fb.ComponentPath}\\samples\\d2d\\images\\icons8-himeji-castle-96.png`),
	gdi.Image(`${fb.ComponentPath}\\samples\\d2d\\images\\icons8-home-page-96.png`),
	gdi.Image(`${fb.ComponentPath}\\samples\\d2d\\images\\icons8-music-96.png`),
	gdi.Image(`${fb.ComponentPath}\\samples\\d2d\\images\\icons8-uwu-emoji-96.png`)
];

let icons = [];
let firstSize = true;

function on_size(width, height) {
    ww = width;
    wh = height;
	
	if(ww > 0 && firstSize) {
		firstSize = false;
		for (let i = 0; i < iconsCount; i++)
			icons.push(new IconInfo(bmps[Math.floor(Math.random() * bmps.length)], ww));
		window.SetInterval(() => {
			for (const icon of icons)
			{
				 icon.Y += icon.Speed;
				 if (icon.Y > wh) icon.Reset(ww);
			}
			window.Repaint();
		}
		, 10);
	}
}

let worked = 0, frameCounter = 0;
let fps = 0;
let font = gdi.Font("Segoe UI", 32, 1);

function on_paint(gr) {
	
	let now = performance.now();
	
	gr.FillSolidRect(0, 0, ww, wh, g_backcolour);	
	for (const icon of icons)
	{
		gr.DrawImage(
			icon.Bitmap,
			icon.X, icon.Y, icon.Bitmap.Width, icon.Bitmap.Height,
			0, 0, icon.Bitmap.Width, icon.Bitmap.Height,
			0,
			icon.Opacity
		);
	}

	gr.GdiDrawText(`Mode: ${window.DrawMode == 0 ? "GDI+" : "Direct2D"}`, font, 0xFFFFFFFF, 5, 0, ww, 45);
	gr.GdiDrawText(`Images: ${iconsCount}`, font, 0xFFFFFFFF, 5, 40, ww, 45);
	
	worked += performance.now() - now;
	frameCounter++;
	if (frameCounter == 60)
	{
		fps = Math.floor(60 / (worked / 1000));
		worked = frameCounter = 0;
	}
	gr.GdiDrawText(`${fps} FPS`, font, 0xFFFFFFFF, 0, 0, ww - 5, 45, DT_RIGHT);
}
