"use strict";

// window.DrawMode = 1;

include(`${fb.ComponentPath}\\docs\\Helpers.js`);
include(`${fb.ComponentPath}\\docs\\Flags.js`);

let ww = 0;
let wh = 0;
function on_size(width, height) {
    ww = width;
    wh = height;
}

const solidBrush = gdi.Brush(BrushType.Solid, 0xFF000000);

const img = gdi.Image(`${fb.ComponentPath}\\samples\\d2d\\images\\Flowers.jpg`);
const bitmapBrush = gdi.Brush(BrushType.Bitmap, img, BrushWrapMode.TileFlipXY);

const font = gdi.Font("Segoe UI", 96, 1);
const text = "TEST FOR TEXT BRUSH";

function on_paint(gr) {

    gr.FillSolidRect(0, 0, ww, wh, solidBrush);
	
    gr.SetSmoothingMode(SmoothingMode.HighQuality);
    gr.SetTextRenderingHint(TextRenderingHint.AntiAlias);

	const ms = gr.MeasureString(text, font, 0, 0, ww, wh, StringFormat(1));
	const linearGradientBrush = gdi.Brush(
		BrushType.LinearGradient, 
		[ms.X, ms.Y], 
		[ms.X, ms.Y + ms.Height], 
		[0.0, 0xFFFFFFFF, 0.5, 0xFFFF0000, 1.0, 0xFF000000]
	);
	gr.DrawString(text, font, linearGradientBrush, 0, 0, ww, wh, StringFormat(1));
	
	bitmapBrush.Scale(ww / img.Width / 2, (wh - ms.Height) / img.Height / 2);
	bitmapBrush.Translate(0, ms.Height);
	gr.FillEllipse(0, ms.Height, ww, wh - ms.Height, bitmapBrush);
	bitmapBrush.ResetTransform();

	const lightRadius = Math.min(ww, wh) / 2;
	const radialGradientBrush = gdi.Brush(
		BrushType.RadialGradient, 
		[lastX, lastY],
		[lightRadius, lightRadius],
		[0.0, 0x00FFFFFF, 1.0, 0xFFFFFFFF],
		BrushWrapMode.Clamp
	);	
	gr.FillEllipse(lastX - lightRadius, lastY - lightRadius, lightRadius * 2, lightRadius * 2, radialGradientBrush);
}

let lastX = 0, lastY = 0;
function on_mouse_move(x, y) {
	lastX = x;
	lastY = y;
	window.Repaint();
}
