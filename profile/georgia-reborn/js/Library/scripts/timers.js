class Timers {
	constructor() {
		['cursor', 'jsearch1', 'jsearch2', 'tt'].forEach(v => this[v] = {
			id: null
		});
	}

	// Methods

	clear(timer) {
		if (timer) clearTimeout(timer.id);
		timer.id = null;
	}

	lib() {
		setTimeout(() => {
			if ((ui.w < 1 || !window.IsVisible) && ppt.rememberTree) lib.init = true;
			lib.getLibrary(true);
			lib.rootNodes(ppt.rememberTree, ppt.process);
		}, 5);
	}

	searchCursor(clear) {
		if (clear) this.clear(this.cursor);
		if (!panel.search.cursor) panel.search.cursor = true;
		this.cursor.id = setInterval(() => {
			panel.search.cursor = !panel.search.cursor;
			panel.searchPaint();
		}, 530);
	}

	tooltipLib() {
		this.clear(this.tt);
		this.tt.id = setTimeout(() => {
			pop.deactivateTooltip();
			this.tt.id = null;
		}, 5000);
	}
}