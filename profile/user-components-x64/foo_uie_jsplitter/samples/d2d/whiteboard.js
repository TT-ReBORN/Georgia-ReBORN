"use strict";

window.DrawMode = 1;

include(`${fb.ComponentPath}\\docs\\Flags.js`);
include(`${fb.ComponentPath}\\docs\\Helpers.js`);

const font = gdi.Font("Segoe UI", 14, 0);
const fontStart = gdi.Font("Segoe UI", 56, 0);

let ww = 0, wh = 0;
let memBmp = null;
let memg = null;

let lastPoint = { x: 0, y: 0 }, cursorPoint = { x: 0, y: 0 };
let isDrawing = false;
let penSize = 5;
let penColor = 0xFF0000FF;
let lastPenColor = 0xFF0000FF;
let showGettingStart = true;

function on_size(width, height) {
	ww = width;
	wh = height;
	if(ww <= 0) return;
	
	memBmp = gdi.CreateImage(ww, wh);	
}

function on_paint(gr) {
	gr.SetSmoothingMode(2);
	gr.DrawImage(memBmp, 0, 0, memBmp.Width, memBmp.Height, 0, 0, memBmp.Width, memBmp.Height);

	gr.GdiDrawText("Tips:\n   Press 1 to 5 to switch color, Right button to erase\n   Scroll to change pen size\n   R to clear whiteboard", font, 0xFF000000, 10, 10, ww, 200);

	if (showGettingStart)
	{
		gr.GdiDrawText("Draw something...", fontStart, 0xFFDAA520, 0, 0, ww, wh, DT_CENTER | DT_VCENTER | DT_CALCRECT);
	}

	drawCursor(gr, cursorPoint);
}

function drawCursor(gr, p)
{
	if (penColor == 0xFFFFFFFF)
		gr.DrawRect(p.x - penSize, p.y - penSize, penSize * 2, penSize * 2, 2, 0xFF000000, DashStyle.Dash);
	else
		gr.DrawEllipse(p.x - penSize / 2, p.y - penSize / 2, penSize, penSize, 2, penColor);
}

function drawPen(x, y)
{
	let diffX = x - lastPoint.x;
	let diffY = y - lastPoint.y;

	memg = memBmp.GetGraphics();
	// memg.SetSmoothingMode(2);
	
	let len = Math.sqrt(diffX * diffX + diffY * diffY);
	let seg = 1.0 / len;

	for (let t = 0; t < 1; t += seg)
	{
		let x = lastPoint.x + diffX * t, y = lastPoint.y + diffY * t;

		if (penColor == 0xFFFFFFFF)
			memg.FillSolidRect(x - penSize, y - penSize, penSize * 2, penSize * 2, penColor);
		else
			memg.FillEllipse(x - penSize / 2, y - penSize / 2, penSize, penSize, penColor);
	}

	memBmp.ReleaseGraphics(memg);

	lastPoint.x = x;
	lastPoint.y = y;
}

function on_key_down(vkey)
{
	switch (vkey)
	{
		case 0x31:
			lastPenColor = 0xFF0000FF;
			penColor = 0xFF0000FF;
			break;
		case 0x32:
			lastPenColor = 0xFFFF0000;
			penColor = 0xFFFF0000;
			break;
		case 0x33:
			lastPenColor = 0xFF00FF00;
			penColor = 0xFF00FF00;
			break;
		case 0x34:
			lastPenColor = 0xFFFFFF00;
			penColor = 0xFFFFFF00;
			break;
		case 0x35:
			lastPenColor = 0xFF00FFFF;
			penColor = 0xFF00FFFF;
			break;
		case 0x52:
			memg = memBmp.GetGraphics();
			memg.FillSolidRect(0, 0, ww, wh, 0xFFFFFFFF);
			memBmp.ReleaseGraphics(memg);
			showGettingStart = true;
			break;
	}
	
	window.Repaint();
}

function on_mouse_lbtn_down(x, y, mask)
{
	penColor = lastPenColor;

	isDrawing = true;
	lastPoint.x = x;
	lastPoint.y = y;
	cursorPoint.x = x;
	cursorPoint.y = y;
	drawPen(x, y);
	showGettingStart = false;

	window.Repaint();
}

function on_mouse_rbtn_down(x, y, mask)
{
	if (penColor != 0xFFFFFFFF) lastPenColor = penColor;
	penColor = 0xFFFFFFFF;

	isDrawing = true;
	lastPoint.x = x;
	lastPoint.y = y;
	cursorPoint.x = x;
	cursorPoint.y = y;
	drawPen(x, y);
	showGettingStart = false;

	window.Repaint();
}

function on_mouse_rbtn_up(x, y, mask)
{
	isDrawing = false;	
	cursorPoint.x = x;
	cursorPoint.y = y;
	return true;
}

function on_mouse_move(x, y, mask)
{
	cursorPoint.x = x;
	cursorPoint.y = y;
	if (isDrawing) drawPen(x, y);
	window.Repaint();
}

function on_mouse_lbtn_up(x, y, mask)
{
	isDrawing = false;
	cursorPoint.x = x;
	cursorPoint.y = y;
}

function on_mouse_wheel(step)
{
	penSize += step * 4;

	if (penSize > 100) penSize = 100;
	if (penSize < 1) penSize = 1;

	window.Repaint();
}
