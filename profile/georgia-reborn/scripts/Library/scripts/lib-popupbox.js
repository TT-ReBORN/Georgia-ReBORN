'use strict';

class LibPopUpBox {
	constructor() {
		this.getHtmlCode();
		this.ok = true;
		this.soFeat = { clipboard: true, gecko: true }
	}

	// * METHODS * //

	config(cfg, libSet, cfgWindow, ok_callback) {
		utils.ShowHtmlDialog(0, this.configHtmlCode, {
			data: [cfg, libSet, cfgWindow, ok_callback],
			resizable: true
		});
	}

	confirm(msg_title, msg_content, btn_yes_label, btn_no_label, height_adjust, centered, confirm_callback) {
		utils.ShowHtmlDialog(0, this.confirmHtmlCode, {
			data: [msg_title, msg_content, btn_yes_label, btn_no_label, height_adjust, centered, confirm_callback]
		});
	}

	getHtmlCode() {
		let cssPath = `${lib_my_utils.packagePath}/assets/html/`;
		cssPath += this.getWindowsVersion() === '6.1' ? 'styles7.css' : 'styles10.css';
		this.configHtmlCode = lib_my_utils.getAsset('\\html\\config.html').replace(/href="styles10.css"/i, `href="${cssPath}"`);
		this.inputHtmlCode = lib_my_utils.getAsset('\\html\\input.html').replace(/href="styles10.css"/i, `href="${cssPath}"`);
		this.messageHtmlCode = lib_my_utils.getAsset('\\html\\messageBox.html').replace(/href="styles10.css"/i, `href="${cssPath}"`);
		this.confirmHtmlCode = lib_my_utils.getAsset('\\html\\confirm.html').replace(/href="styles10.css"/i, `href="${cssPath}"`);
	}

	getWindowsVersion() {
		let version = '';
		try {
			version = (libWshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentMajorVersionNumber')).toString();
			version += '.';
			version += (libWshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentMinorVersionNumber')).toString();
			return version;
		} catch (e) {}
		try {
			version = libWshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentVersion');
			return version;
		} catch (e) {}
		return '6.1';
	}

	input(title, msg, ok_callback, input, def) {
		utils.ShowHtmlDialog(0, this.inputHtmlCode, {
			data: [title, msg, 'Cancel', ok_callback, input, def]
		});
	}

	isHtmlDialogSupported() {
		if (libSet.isHtmlDialogSupported != 2) return libSet.isHtmlDialogSupported;

		if (typeof libDoc === 'undefined' || !libDoc) {
			this.soFeat.gecko = false;
		}
		if (this.soFeat.gecko) {
			let cache = null;
			let clText = 'test';
			try {
				cache = libDoc.parentWindow.clipboardData.getData('Text');
			} catch (e) {}
			try {
				libDoc.parentWindow.clipboardData.setData('Text', clText);
				clText = libDoc.parentWindow.clipboardData.getData('Text');
			} catch (e) {
				this.soFeat.clipboard = false;
			}
			if (cache) { // Just in case previous clipboard data is needed
				try {
					libDoc.parentWindow.clipboardData.setData('Text', cache);
				} catch (e) {}
			}
			if (clText !== 'test') {
				this.soFeat.clipboard = false;
			}
		} else {
			this.soFeat.clipboard = false;
		}

		libSet.isHtmlDialogSupported = this.soFeat.gecko && this.soFeat.clipboard || this.isIEInstalled() ? 1 : 0;
		if (!libSet.isHtmlDialogSupported) {
		const caption = 'Show HTML Dialog';
			const prompt =
`A feature check indicates that Spider Monkey Panel show html dialog isn't supported by the current operating system.
This is used to display options. The console will show alternatives on closing this dialog.
Occassionally, the feature check may give the wrong answer.
If you're using windows and have Internet Explorer support it should work, so enter 1 and press OK.
The setting is saved in panel properties as the first item and can be changed there later.
Supported-1; unsupported-0`;
			let ns = '';
			let status = 'ok'
			try {
				ns = utils.InputBox(0, prompt, caption, libSet.isHtmlDialogSupported, true);
			} catch (e) {
				status = 'cancel';
			}
			if (status != 'cancel') {
				libSet.isHtmlDialogSupported = ns == 0 ? 0 : 1;
			}
		}
		return libSet.isHtmlDialogSupported;
	}

	isIEInstalled() {
		const diskLetters = Array.from(Array(26)).map((e, i) => i + 65).map((x) => `${String.fromCharCode(x)}:\\`);
		const paths = ['Program Files\\Internet Explorer\\ieinstal.exe', 'Program Files (x86)\\Internet Explorer\\ieinstal.exe'];
		return diskLetters.some(d => {
			try { // Needed when permission error occurs and current SMP implementation is broken for some devices....
				return utils.IsDirectory(d) ? paths.some(p => utils.IsFile(d + p)) : false;
			} catch (e) { return false; }
		});
	}

	message() {
		utils.ShowHtmlDialog(0, this.messageHtmlCode, {
			data: [this.window_ok_callback, $Lib.scale],
			selection: true
		});
	}

	window_ok_callback(status, clicked) {
		if (clicked) libSet.panelSourceMsg = false;
	}
}
