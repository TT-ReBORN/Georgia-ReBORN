"use strict";

window.DrawMode = 1;
const starCount = 3000;

include(`${fb.ComponentPath}\\docs\\Flags.js`);
include(`${fb.ComponentPath}\\docs\\Helpers.js`);

class Star 
{
    constructor() {
		this.x = 0;
		this.y = 0;
		this.size = 0;
		this.color = 0;
		this.speed = 0;
	}
}

let stars = Array.from({ length: starCount }, () => new Star());

window.SetInterval(() => {
	for (const s of stars)
	{
		if (s.x < 1 || s.y < 1 || s.x > window.Width || s.y > window.Height)
		{
			s.x = Math.floor(Math.random() * window.Width);
			s.y = Math.floor(Math.random() * window.Height);

			s.size = Math.random() * 3.0 + 0.2;
			s.speed = Math.random() * 0.03 + 0.002;

			const gray = (Math.random() * 0.7 + 0.3) * 255;
			s.color = RGB(gray, gray, gray);
		}

		s.x += (s.x - window.Width / 2) * s.speed;
		s.y += (s.y - window.Height / 2) * s.speed;
	}
	
	window.Repaint();
	
}, 10);

let worked = 0, frameCounter = 0;
let fps = 0;
let font = gdi.Font("Segoe UI", 32, 1);

function on_paint(gr) {

	let now = performance.now();
	
	gr.FillSolidRect(0, 0, window.Width, window.Height, 0xFF000000);
	for (const s of stars) gr.FillEllipse(s.x, s.y, s.size, s.size, s.color);

	gr.GdiDrawText(`Mode: ${window.DrawMode == 0 ? "GDI+" : "Direct2D"}`, font, 0xFFFFFFFF, 5, 0, window.Width, 45);
	gr.GdiDrawText(`Stars count: ${starCount}`, font, 0xFFFFFFFF, 5, 40, window.Width, 45);
	
	worked += performance.now() - now;
	frameCounter++;
	if (frameCounter == 60)
	{
		fps = Math.floor(60 / (worked / 1000));
		worked = frameCounter = 0;
	}
	gr.GdiDrawText(`${fps} FPS`, font, 0xFFFFFFFF, 0, 0, window.Width - 5, 45, DT_RIGHT);	
}
