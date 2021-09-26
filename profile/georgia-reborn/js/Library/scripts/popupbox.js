class PopUpBox {
	constructor() {
		this.getHtmlCode();
	}

	// Methods

	config(cfg, ppt, cfgWindow, ok_callback) {
		utils.ShowHtmlDialog(window.ID, this.configHtmlCode, {
			data: [cfg, ppt, cfgWindow, ok_callback],
			resizable: true
		});
	}

	confirm(msg_title, msg_content, btn_yes_label, btn_no_label, height_adjust, confirm_callback) {
		utils.ShowHtmlDialog(window.ID, this.confirmHtmlCode, {
			data: [msg_title, msg_content, btn_yes_label, btn_no_label, height_adjust, confirm_callback]
		});
	}

	getHtmlCode() {
		let cssPath = `${my_utilsLib.packagePath}/assets/html/`;
		if (this.getWindowsVersion() === '6.1') {
			cssPath += 'styles7.css';
		} else {
			cssPath += 'styles10.css';
		}
		this.configHtmlCode = my_utilsLib.getAsset('\\html\\config.html').replace(/href="styles10.css"/i, `href="${cssPath}"`);
		this.inputHtmlCode = my_utilsLib.getAsset('\\html\\input.html').replace(/href="styles10.css"/i, `href="${cssPath}"`);
		this.inputApplyHtmlCode = my_utilsLib.getAsset('\\html\\inputApply.html').replace(/href="styles10.css"/i, `href="${cssPath}"`);
		this.messageHtmlCode = my_utilsLib.getAsset('\\html\\messageBox.html').replace(/href="styles10.css"/i, `href="${cssPath}"`);
		this.confirmHtmlCode = my_utilsLib.getAsset('\\html\\confirm.html').replace(/href="styles10.css"/i, `href="${cssPath}"`);
	}

	getWindowsVersion() {
		let version = '';
		try {
			version = (WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentMajorVersionNumber')).toString();
			version += '.';
			version += (WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentMinorVersionNumber')).toString();
			return version;
		} catch (e) {}
		try {
			version = WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentVersion');
			return version;
		} catch (e) {}
		return '6.1';
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

	message() {
		utils.ShowHtmlDialog(window.ID, this.messageHtmlCode, {
			data: [this.window_ok_callback, $Lib.scale],
		});
	}

	window_ok_callback(status, clicked) {
		if (clicked) ppt.panelSourceMsg = false;
	}
}