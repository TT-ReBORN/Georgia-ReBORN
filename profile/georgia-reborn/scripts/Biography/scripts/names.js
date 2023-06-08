'use strict';

class Names {
	constructor() {
		this.cur_artist = '';
		this.lfmUID = '_[a-f0-9]{32}\\.jpg$';
	}

	// Methods

	alb(focus) {
		return $Bio.eval(`[$trim(${cfg.tf.album})]`, focus);
	}

	albID(focus, n) {
		if (!this.alb(focus)) return $Bio.eval(`${cfg.tf.artist + cfg.tf.albumArtist}%path%`, focus);
		switch (n) {
			case 'simple':
				return $Bio.eval(cfg.tf.artist + cfg.tf.albumArtist + cfg.tf.album, focus);
			case 'stnd':
				return $Bio.eval(`${cfg.tf.albumArtist + cfg.tf.album}%discnumber%%date%`, focus);
			case 'full':
				return $Bio.eval(`${cfg.tf.artist + cfg.tf.albumArtist + cfg.tf.album}%discnumber%%date%`, focus);
		}
	}

	albm(focus, ignoreLock) {
		return this.albumTidy($Bio.eval(`[${cfg.tf.album}]`, focus, ignoreLock));
	}

	album(focus, ignoreLock) {
		if (!cfg.albStrip) return this.albm(focus);
		return this.albumClean($Bio.eval(`[${cfg.tf.album}]`, focus, ignoreLock));
	}

	albumArtist(focus, ignoreLock) {
		const albumArtist = $Bio.eval(`[$trim(${cfg.tf.albumArtist})]`, focus, ignoreLock);
		const radioTrackArtist = !isRadioStreamParser || !panelBio.isRadio(focus) ? '' : radioStreamParser.getStreamInfo(focus, ignoreLock).artist;
		return radioTrackArtist || albumArtist;
	}

	albumClean(n) {
		return n.replace(/CD(\s*\d|\.0\d)|CD\s*(One|Two|Three)|Dis(c|k)\s*\d|Dis(c|k)\s*(III|II|I|One|Two|Three)\b|(Bonus\s*Track|Collector's|(Digital\s*|Super\s*|)Deluxe|Digital|Expanded|Limited|Platinum|Reissue|Special)\s*(Edition|Version)|(Bonus\s*(CD|Disc))|\d\d\w\w\s*Anniversary\s*(Expanded\s*|Re(-|)master\s*|)(Edition|Re(-|)master|Version)|((19|20)\d\d(\s*|\s*-\s*)|)(Digital(ly|)\s*|)(Re(-|)master(ed|)|Re(-|)recorded)(\s*Edition|\s*Version|)|\(Deluxe\)|\(Mono\)|\(Reissue\)|\(Revisited\)|\(Stereo\)|\(Web\)|\[Deluxe\]|\[Mono\]|\[Reissue\]|\[Revisited\]|\[Stereo\]|\[Web\]/gi, '').replace(/\(\s*\)|\[\s*\]/g, ' ').replace(/\s\s+/g, ' ').replace(/-\s*$/g, ' ').trim();
	}

	albumTidy(n) {
		return n.replace(/CD(\s*\d|\.0\d)|CD\s*(One|Two|Three)|Dis(c|k)\s*\d|Dis(c|k)\s*(III|II|I|One|Two|Three)\b/gi, '').replace(/\(\s*\)|\[\s*\]/g, ' ').replace(/\s\s+/g, ' ').replace(/-\s*$/g, ' ').trim();
	}

	artist(focus, ignoreLock) {
		const artist = $Bio.eval(`[$trim(${cfg.tf.artist})]`, focus, ignoreLock);
		const radioTrackArtist = !isRadioStreamParser || !panelBio.isRadio(focus) ? '' : radioStreamParser.getStreamInfo(focus, ignoreLock).artist;
		return radioTrackArtist || artist;
	}

	composition(focus, ignoreLock) {
		return $Bio.eval(`[${cfg.tf.composition}]`, focus, ignoreLock);
	}

	isLfmImg(fn, artist) {
		if (artist) {
			if (artist != this.cur_artist) {
				artist = $Bio.regexEscape($Bio.clean(artist));
				this.cur_artist = artist;
			}
			return RegExp(`^${artist + this.lfmUID}`, 'i').test(fn);
		} else return RegExp(this.lfmUID, 'i').test(fn);
	}

	title(focus, ignoreLock) {
		const title = $Bio.eval(`[$trim(${cfg.tf.title})]`, focus, ignoreLock);
		const radioTrackTitle = !isRadioStreamParser || !panelBio.isRadio(focus) ? '' : radioStreamParser.getStreamInfo(focus, ignoreLock).title;
		return radioTrackTitle || title;
	}

	trackID(focus) {
		return $Bio.eval(cfg.tf.artist + cfg.tf.title, focus);
	}
}
