class PopUpBoxBio {
	constructor() {
		this.getHtmlCode();
	}

	// Methods

	confirm(msg_title, msg_content, btn_yes_label, btn_no_label, height_adjust, confirm_callback) {
		utils.ShowHtmlDialog(window.ID, this.confirmHtmlCode, {
			data: [msg_title, msg_content, btn_yes_label, btn_no_label, height_adjust, confirm_callback]
		});
	}

	getHtmlCode() {
		let cssPath = `${my_utilsBio.packagePath}/assets/html/`;
		if (this.getWindowsVersion() === '6.1') {
			cssPath += 'styles7.css';
		} else {
			cssPath += 'styles10.css';
		}
		this.configHtmlCode = my_utilsBio.getAsset('\\html\\config.html').replace(/href="styles10.css"/i, `href="${cssPath}"`);
		this.inputHtmlCode = my_utilsBio.getAsset('\\html\\input.html').replace(/href="styles10.css"/i, `href="${cssPath}"`);
		this.inputApplyHtmlCode = my_utilsBio.getAsset('\\html\\inputApply.html').replace(/href="styles10.css"/i, `href="${cssPath}"`);
		this.confirmHtmlCode = my_utilsBio.getAsset('\\html\\confirm.html').replace(/href="styles10.css"/i, `href="${cssPath}"`);
	}

	getWindowsVersion() {
		let version = '';

		try {
			version = (WshShellBio.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentMajorVersionNumber')).toString();
			version += '.';
			version += (WshShellBio.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentMinorVersionNumber')).toString();
			return version;
		} catch (e) {}
		try {
			version = WshShellBio.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentVersion');
			return version;
		} catch (e) {}
		return '6.1';
	}

	config(ppt, cfg, dialogWindow, ok_callback, lang, recycler) {
		utils.ShowHtmlDialog(window.ID, this.configHtmlCode, {
			data: [ppt, cfg, dialogWindow, window.IsTransparent, ok_callback, this.tf_callback, lang, recycler],
			resizable: true
		});
	}

	input(title, msg, ok_callback, input, def) {
		utils.ShowHtmlDialog(window.ID, this.inputHtmlCode, {
			data: [title, msg, 'Cancel', ok_callback, input, def]
		});
	}

	inputApply(title, msg, ok_callback, input, def) {
		utils.ShowHtmlDialog(window.ID, this.inputApplyHtmlCode, {
			data: [title, msg, 'Cancel', ok_callback, input, def]
		});
	}

	tf_callback(tf, tfAll, type, sFind, sReplace) {
		return cfg.preview(tf, tfAll, type, sFind, sReplace);
	}
}