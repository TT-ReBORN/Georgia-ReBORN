"use strict";

include(`${fb.ComponentPath}\\docs\\Flags.js`);

let ww = 0;
let wh = 0;

function on_size(width, height) {
    ww = width;
    wh = height;
}

let result = DialogResult.None;
const msg = "You clicked ";
let str = msg + "None";

function on_paint(gr) {
	gr.GdiDrawText(
		str, 
		gdi.Font("Segoe UI", 48, 1), 
		window.InstanceType == UIInstanceType.DefaultUI ?
			window.GetColourDUI(ColourTypeDUI.text) : 
			window.GetColourCUI(ColourTypeCUI.text), 
		0, 0, ww, wh, 
		DT_CENTER | DT_VCENTER | DT_CALCRECT
	);
}

function on_mouse_lbtn_down(x, y) {
		
	let result = utils.MessageBox(
		"Want some fun?", "Question", 
		MessageBoxButtons.YesNo, 
		MessageBoxIcon.Question);
	
	if(result == DialogResult.No) {
		utils.MessageBox(
			"You're so boring... OK, good bye.", 
			"Information", 
			MessageBoxButtons.OK, 
			MessageBoxIcon.Information);
		str = "Good bye!";
	}
	else {
		result = utils.MessageBox(
			"OK, choose you totem animal:\n\nYes - A cow\nNo - A dog\nCancel - I don't play this game!\n\nOr maybe you need some help? (press Help)", 
			"Question", 
			MessageBoxButtons.YesNoCancel, 
			MessageBoxIcon.Warning,
			MessageBoxDefaultButton.Button3, 
			"https://google.com");
		switch(result)
		{
		case DialogResult.Yes:
			str = msg + "Yes!";
			break;
		case DialogResult.No:
			str = msg + "No!";
			break;
		default:
			str = msg + "Cancel!";
			break;
		}	
	}
	
	window.Repaint();
}