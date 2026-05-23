"use strict";

window.DrawMode = 1;

include(`${fb.ComponentPath}\\docs\\Flags.js`);

class Sprite 
{
    constructor(bitmap, originX, originY, width, height) {
        this.bmp = bitmap;
        this.originX = originX;
		this.originY = originY;
		this.width = width;
		this.height = height;
		this.x = 0;
		this.y = 0;
		this.angle = 0;
    }
}

let ww = 0, wh = 0;

const fullImage = gdi.Image(`${fb.ComponentPath}\\samples\\d2d\\images\\Field.jpg`);
const gridCountX = 12, gridCountY = 9;
const gridImageWidth = fullImage.Width / gridCountX;
const gridImageHeight = fullImage.Height / gridCountY;
let screenImageWidth = 0, screenImageHeight = 0;
let initialized = false;
let playClipNumber = 0;
const animationSpeed = 0.07;
const playFinishThreshold = 0.02;

let sprites = [...Array(gridCountX)].map(() => Array(gridCountY).fill(null));

function on_size(width, height) {
	
	if(width > 0) {

		ww = width;
		wh = height;
		
		screenImageWidth = ww / gridCountX;
		screenImageHeight = wh / gridCountY;

		for (let y = 0; y < gridCountY; y++)
		{
			for (let x = 0; x < gridCountX; x++)
			{
				let bmp = gdi.CreateImage(screenImageWidth, screenImageHeight);
				let gr = bmp.GetGraphics();
				gr.DrawImage(
					fullImage, 
					0, 0, screenImageWidth, screenImageHeight, 
					x * gridImageWidth, y * gridImageHeight, gridImageWidth, gridImageHeight);
				bmp.ReleaseGraphics(gr);

				let s = new Sprite(bmp, x * screenImageWidth, y * screenImageHeight, screenImageWidth, screenImageHeight);

				sprites[x][y] = s;
			}
		}
		
		BeginClip();
		
		if(!initialized) {
			initialized = true;
			window.SetInterval(() => {
				let playFinished = true;

				for (let y = 0; y < gridCountY; y++)
				{
					for (let x = 0; x < gridCountX; x++)
					{
						let p = sprites[x][y];

						let diffX = (p.originX - p.x) * animationSpeed;
						let diffY = (p.originY - p.y) * animationSpeed;
						let diffWidth = (screenImageWidth - p.width) * animationSpeed;
						let diffHeight = (screenImageHeight - p.height) * animationSpeed;

						p.x += diffX;
						p.y += diffY;
						p.width += diffWidth;
						p.height += diffHeight;
						p.angle -= p.angle * animationSpeed;

						if (playFinished)
						{
							playFinished = Math.abs(diffX) < playFinishThreshold && Math.abs(diffY) < playFinishThreshold
								&& Math.abs(diffWidth) < playFinishThreshold && Math.abs(diffHeight) < playFinishThreshold
								&& Math.abs(p.angle) < playFinishThreshold;
						}
					}
				}

				if (playFinished)
				{
					playClipNumber++;
					BeginClip();
				}

				window.Repaint();
				
			}, 10);
		}
	}
}

function BeginClip()
{
	for (let y = 0; y < gridCountY; y++)
	{
		for (let x = 0; x < gridCountX; x++)
		{
			let p = sprites[x][y];

			switch (playClipNumber)
			{
				case 0:
					p.x = Math.floor(Math.random() * gridCountX) * screenImageWidth;
					p.y = Math.floor(Math.random() * gridCountY) * screenImageHeight;
					p.width = Math.floor(Math.random() * 1000);
					p.height = Math.floor(Math.random() * 1000);
					break;

				case 1:
					p.x = -gridImageWidth;
					p.y = -gridImageHeight;
					break;

				case 2:
					p.x = ww + Math.floor(Math.random() * 1000);
					p.y = 4 * screenImageWidth;
					break;

				case 3:
					p.x = x * screenImageWidth;
					p.y = y * screenImageHeight;
					p.width = 0;
					p.height = 0;
					break;

				case 4:
					p.x = x * screenImageWidth;
					p.y = y * screenImageHeight;
					p.width = Math.floor(Math.random() * 1000);
					p.height = Math.floor(Math.random() * 1000);
					p.angle = Math.floor(Math.random() * 720) - 360;
					break;

				case 5:
					p.x = ww / 2;
					p.y = wh / 2;
					p.width = 0;
					p.height = 0;
					p.angle = Math.floor(Math.random() * 720) - 360;
					break;

				case 6:
					playClipNumber = 0;
					BeginClip();
					break;
			}
		}
	}
}

let worked = 0, frameCounter = 0;
let fps = 0;
let font = gdi.Font("Segoe UI", 32, 1);

function on_paint(gr) {
	let now = performance.now();
	
	for (let y = 0; y < gridCountY; y++)
	{
		for (let x = 0; x < gridCountX; x++)
		{
			let s = sprites[x][y];

			gr.DrawImage(
				s.bmp, 
				s.x, s.y, s.width + 0.5, s.height + 0.5, 
				0, 0, s.bmp.Width, s.bmp.Height, 
				Math.abs(s.angle) < playFinishThreshold ? 0 : s.angle
			);
		}
	}

	gr.GdiDrawText(`Mode: ${window.DrawMode == 0 ? "GDI+" : "Direct2D"}`, font, 0xFF000000, 5, 0, ww, 45);
	
	worked += performance.now() - now;
	frameCounter++;
	if (frameCounter == 60)
	{
		fps = Math.floor(60 / (worked / 1000));
		worked = frameCounter = 0;
	}
	gr.GdiDrawText(`${fps} FPS`, font, 0XFF000000, 0, 0, ww - 5, 45, DT_RIGHT);
}
