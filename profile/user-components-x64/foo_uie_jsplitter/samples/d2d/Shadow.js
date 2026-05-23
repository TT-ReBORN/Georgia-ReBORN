"use strict";

window.DrawMode = 1;

include(`${fb.ComponentPath}\\docs\\Flags.js`);
include(`${fb.ComponentPath}\\docs\\Effects.js`);
include(`${fb.ComponentPath}\\docs\\Matrix.js`);

const img = d2d.Image(`${fb.ComponentPath}\\samples\\d2d\\images\\Flowers.jpg`);

const chromakey = d2d.Effect(Effects.ChromaKey.ID);
chromakey.SetValue(Effects.ChromaKey.Color, new Float32Array([0, 0, 0]));
chromakey.SetValue(Effects.ChromaKey.Tolerance, 0.4);
chromakey.SetValue(Effects.ChromaKey.Feather, true);
chromakey.SetInput(0, img);

const shadow = d2d.Effect(Effects.Shadow.ID);
shadow.SetInputEffect(0, chromakey);

const affineTransform = d2d.Effect(Effects.AffineTransform.ID);
affineTransform.SetInputEffect(0, shadow);
affineTransform.SetValue(Effects.AffineTransform.TransformMatrix, Matrix3x2.Translation(20, 20));

const composite = d2d.Effect(Effects.Composite.ID);
composite.SetInputEffect(0, affineTransform);
composite.SetInputEffect(1, chromakey);

let ww = 0, wh = 0;
function on_size(width, height) {
    ww = width;
    wh = height;
}

let font = gdi.Font("Segoe UI", 32, 1);
let g_backcolour = 0xFFFFFFFF;
let steps = 4;
function on_paint(dgr) {
    dgr.FillSolidRect(0, 0, ww, wh, g_backcolour);
	dgr.DrawEffect(composite, 0, 0, 0, 0, ww, wh);
}
