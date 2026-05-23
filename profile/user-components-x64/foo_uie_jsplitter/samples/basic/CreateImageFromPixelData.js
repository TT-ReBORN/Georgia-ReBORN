"use strict";

// Use pixel data from a real image as example
const example = gdi.Image(`${fb.ComponentPath}\\samples\\d2d\\images\\Field.jpg`).GetPixelData();

// Create a temp folder
const filePath = "js_data\\temp\\Field.bin";
if (!utils.IsDirectory(fb.ProfilePath + filePath)) { utils.CreateFolder(fb.ProfilePath + 'js_data\\temp\\'); }

// Write data to a file, and load it
utils.WriteBinaryFile(fb.ProfilePath + filePath, example);
const imgPixelData = utils.ReadBinaryFile(fb.ProfilePath + filePath);
const img = gdi.CreateImageFromPixelData(imgPixelData, 2208, 1242);

function on_paint(gr) {
	gr.DrawImage(img, 0, 0, img.Width, img.Height, 0, 0, img.Width, img.Height);
}
