'use strict';

class DldAllmusicBio {
	constructor(state_callback) {
		this.artist = '';
		this.artistLink = '';
		this.fo_bio;
		this.force;
		this.func = null;
		this.pth_bio;
		this.ready_callback = state_callback;
		this.sw = 0;
		this.title = '';
		this.timer = null;
		this.xmlhttp = null;
	}

	onStateChange() {
		if (this.xmlhttp != null && this.func != null) {
			if (this.xmlhttp.readyState == 4) {
				clearTimeout(this.timer);
				this.timer = null;
				if (this.xmlhttp.status == 200) this.func();
				else $Bio.trace(`allmusic review / biography: ${serverBio.album} / ${serverBio.albumArtist}: not found Status error: ${this.xmlhttp.status}`, true);
			}
		}
	}

	search(p_sw, URL, p_title, p_artist, p_fo_bio, p_pth_bio, p_force) {
		this.sw = p_sw;
		if (!this.sw) {
			this.fo_bio = p_fo_bio;
			this.force = p_force;
			this.pth_bio = p_pth_bio;
			this.title = p_title;
			this.artist = p_artist;
			if (!this.title) this.sw = 1;
		}
		this.func = null;
		this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		this.func = this.analyse;
		if (!this.force && serverBio.urlDone(md5Bio.hashStr(this.artist + this.title + this.pth_bio + cfg.partialMatch + URL))) return;
		this.xmlhttp.open('GET', URL);
		this.xmlhttp.onreadystatechange = this.ready_callback;
		if (this.force) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
		if (!this.timer) {
			const a = this.xmlhttp;
			this.timer = setTimeout(() => {
				a.abort();
				this.timer = null;
			}, 30000);
		}
		this.xmlhttp.send();
	}

	analyse() {
		docBio.open();
		const div = docBio.createElement('div');
		let i = 0;
		let list = [];
		switch (this.sw) {
			case 0:
				try {
					div.innerHTML = this.xmlhttp.responseText;
					list = parse.amSearch(div, 'performers', 'song');
					i = serverBio.match(this.artist, this.title, list, 'song');
					if (i != -1) {
						this.artistLink = list[i].artistLink;
						if (this.artistLink) {
							docBio.close();
							return this.search(2, `${this.artistLink}/biography`);
						}
					}
					this.search(1, `${serverBio.url.am}artists/${encodeURIComponent(this.artist)}`);
				} catch (e) {
					serverBio.updateNotFound(`Bio ${cfg.partialMatch} ${this.artist} - ${this.title}`);
					if (!$Bio.file(this.pth_bio)) $Bio.trace(`allmusic biography: ${this.artist}: not found`, true);
				}
				docBio.close();
				break;
			case 1:
				try {
					div.innerHTML = this.xmlhttp.responseText;
					const artists = [];
					const artist = $Bio.strip(this.artist);
					$Bio.htmlParse(div.getElementsByTagName('div'), 'className', 'name', v => {
						const a = v.getElementsByTagName('a');
						let name = a.length && a[0].innerText ? a[0].innerText : '';
						name = $Bio.strip(name);
						const href = a.length && a[0].href ? a[0].href : '';
						if (name && href) {
							if (artist == name) artists.push(href);
						}
					});
					docBio.close();
					if (artists.length == 1) {
						this.sw = 2;
						return this.search(2, `${artists[0]}/biography`);
					}
					serverBio.updateNotFound(`Bio ${cfg.partialMatch} ${this.artist} - ${this.title}`);
					if (!$Bio.file(this.pth_bio)) {
						$Bio.trace(`allmusic biography: ${this.artist}${artists.length > 1 ? ': unable to disambiguate multiple artists of same name: discriminators, album name or track title, either not matched or absent (e.g. menu look ups)' : ': not found'}`, true);
					}
				} catch (e) {
					serverBio.updateNotFound(`Bio ${cfg.partialMatch} ${this.artist} - ${this.title}`);
					if (!$Bio.file(this.pth_bio)) $Bio.trace(`allmusic biography: ${this.artist}: not found`, true);
				}
				break;
			case 2:
				parse.amBio(this.xmlhttp.responseText, this.artist, '', this.title, this.fo_bio, this.pth_bio, '');
				break;
		}
	}
}

class DldAllmusicRev {
	constructor(state_callback) {
		this.albumArtist;
		this.album;
		this.art;
		this.artist = '';
		this.artistLink = '';
		this.dn_type = '';
		this.fo_bio;
		this.fo_rev;
		this.force;
		this.func = null;
		this.pth_bio;
		this.pth_rev;
		this.ready_callback = state_callback;
		this.sw = 0;
		this.va = false;
		this.timer = null;
		this.xmlhttp = null;
	}

	onStateChange() {
		if (this.xmlhttp != null && this.func != null) {
			if (this.xmlhttp.readyState == 4) {
				clearTimeout(this.timer);
				this.timer = null;
				if (this.xmlhttp.status == 200) this.func();
				else $Bio.trace(`allmusic review / biography: ${this.album} / ${this.albumArtist}: not found Status error: ${this.xmlhttp.status}`, true);
			}
		}
	}

	search(p_sw, URL, p_album, p_alb_artist, p_artist, p_va, p_dn_type, p_fo_rev, p_pth_rev, p_fo_bio, p_pth_bio, p_art, p_force) {
		this.sw = p_sw;
		if (!this.sw) {
			this.dn_type = p_dn_type;
			this.fo_rev = p_fo_rev;
			this.pth_rev = p_pth_rev;
			this.fo_bio = p_fo_bio;
			this.pth_bio = p_pth_bio;
			this.album = p_album;
			this.albumArtist = p_alb_artist;
			this.artist = p_artist;
			this.va = p_va;
			this.art = p_art;
			this.force = p_force;
		}
		this.func = null;
		this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		this.func = this.analyse;
		if ((pptBio.multiServer || this.sw == 2) && !this.force && serverBio.urlDone(md5Bio.hashStr(this.albumArtist + this.album + this.dn_type + this.pth_rev + cfg.partialMatch + URL))) return;
		this.xmlhttp.open('GET', URL);
		this.xmlhttp.onreadystatechange = this.ready_callback;
		if (this.force) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
		if (!this.timer) {
			const a = this.xmlhttp;
			this.timer = setTimeout(() => {
				a.abort();
				this.timer = null;
			}, 30000);
		}
		this.xmlhttp.send();
	}

	analyse() {
		docBio.open();
		const div = docBio.createElement('div');
		let list = [];
		switch (this.sw) {
			case 0:
				try {
					div.innerHTML = this.xmlhttp.responseText;
					const item = {};
					if (this.dn_type.startsWith('review') || this.dn_type == 'biography') { item.art = 'artist'; item.type = 'album'; } // this.dn_type choices: 'review+biography'* || 'composition+biography' || 'review' || 'composition' || 'track' || 'biography' // *falls back to trying track / artist based biography if art_upd needed
					else if (this.dn_type == 'track') { item.art = 'performers'; item.type = 'song'; }
					else { item.art = 'composer'; item.type = 'composition'; }
					list = parse.amSearch(div, item.art, item.type);
					const i = serverBio.match(this.albumArtist, this.album, list, item.type);
					if (i != -1) {
						if (!this.va) this.artistLink = list[i].artistLink;
						if (this.dn_type != 'biography') {
							this.sw = 1;
							docBio.close();
							return this.search(this.sw, list[i].titleLink);
						} else if (!this.va) {
							this.sw = 2;
							docBio.close();
							return this.search(this.sw, `${this.artistLink}/biography`);
						}
					}
					serverBio.getBio(this.force, this.art, 1);
					if (this.dn_type.includes('biography')) serverBio.updateNotFound(`Bio ${cfg.partialMatch} ${this.pth_rev}`);
					serverBio.updateNotFound(`Rev ${cfg.partialMatch} ${this.pth_rev}${this.dn_type != 'track' ? '' : ` ${this.album} ${this.albumArtist}`}`);
					$Bio.trace(`allmusic review: ${this.album} / ${this.albumArtist}: not found`, true);
				} catch (e) {
					serverBio.getBio(this.force, this.art, 1);
					serverBio.updateNotFound(`Bio ${cfg.partialMatch} ${this.pth_rev}`);
					serverBio.updateNotFound(`Rev ${cfg.partialMatch} ${this.pth_rev}${this.dn_type != 'track' ? '' : ` ${this.album} ${this.albumArtist}`}`);
					$Bio.trace(`allmusic review: ${this.album} / ${this.albumArtist}: not found`, true);
				}
				docBio.close();
				break;
			case 1:
				try {
					div.innerHTML = this.xmlhttp.responseText;
					const a = div.getElementsByTagName('a');
					const dv = div.getElementsByTagName('div');
					let rating = 'x';
					let releaseDate = '';
					let review = '';
					let reviewAuthor = '';
					let reviewGenre = [];
					let reviewMood = [];
					let reviewTheme = [];
					let songReleaseYear = '';
					let tg = '';

					$Bio.htmlParse(dv, 'className', 'text', v => review = serverBio.format(v.innerHTML));

					if (this.dn_type.startsWith('review')) {
						let json = this.xmlhttp.responseText.match(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/);
						if (json) json = json[0];
						if (json) json = json.replace(/<script\s+type="application\/ld\+json">/, '').replace('</script>', '').trim();
						reviewAuthor = $Bio.jsonParse(json, '', 'get', 'review.name');
					} else {
						$Bio.htmlParse(div.getElementsByTagName('h3'), 'className', this.dn_type.startsWith('composition') ? 'author headline' : 'headline review-author', v => reviewAuthor = v.innerText.trim());
					}

					if (this.dn_type != 'track') {
						$Bio.htmlParse(dv, 'className', 'release-date', v => releaseDate = v.innerText.replace(/Release Date/i, 'Release Date: ').trim());
						$Bio.htmlParse(a, false, false, v => {
							if (v.href.includes('www.allmusic.com/genre') || v.href.includes('www.allmusic.com/style')) {
								tg = v.innerText.trim();
								if (tg) reviewGenre.push(tg);
							}
						});
						$Bio.htmlParse(a, false, false, v => {
							if (v.href.includes('www.allmusic.com/mood')) {
								const tm = v.innerText.trim();
								if (tm) reviewMood.push(tm);
							}
							if (v.href.includes('www.allmusic.com/theme')) {
								const tth = v.innerText.trim();
								if (tth) reviewTheme.push(tth);
							}
						});
						reviewGenre = reviewGenre.length ? `Genre: ${reviewGenre.join('\u200b, ')}` : '';
						reviewMood = reviewMood.length ? `Album Moods: ${reviewMood.join('\u200b, ')}` : '';
						reviewTheme = reviewTheme.length ? `Album Themes: ${reviewTheme.join('\u200b, ')}` : '';
						review = txt.add([reviewGenre, reviewMood, reviewTheme, releaseDate, reviewAuthor], review);
						review = review.trim();
						$Bio.htmlParse(div.getElementsByTagName('li'), 'id', 'microdata-rating', v => rating = v.innerText.replace(/\D+/g, '') / 2);
						review = `>> Album rating: ${rating} <<  ${review}`;
						if (review.length > 22) {
							if (this.fo_rev) {
								$Bio.buildPth(this.fo_rev);
								$Bio.save(this.pth_rev, review, true);
								serverBio.res();
							}
						} else {
							serverBio.updateNotFound(`Rev ${cfg.partialMatch} ${this.pth_rev}`);
							$Bio.trace(`allmusic review: ${this.album} / ${this.albumArtist}: not found`, true);
						}
					} else {
						const composer = [];
						$Bio.htmlParse(div.getElementsByTagName('p'), 'className', 'song-composer', v => {
							const a = v.getElementsByTagName('a');
							if (a.length && a[0].innerText) composer.push(a[0].innerText);
						});
						const m = this.xmlhttp.responseText.match(/data-releaseyear=\s*"\s*\d+\s*"/i);
						if (m) {
							songReleaseYear = m[0].replace(/\D/g, '').trim();
						}
						$Bio.htmlParse(dv, 'className', 'middle', v => {
							const a = v.getElementsByTagName('a');
							$Bio.htmlParse(a, false, false, w => {
								if (w.href.includes('/genre/') || w.href.includes('/style/')) {
									tg = w.title.trim();
									if (tg) reviewGenre.push(tg);
								}
								if (w.href.includes('/mood/')) {
									tg = w.title.trim();
									if (tg) reviewMood.push(tg);
								}
								if (w.href.includes('/theme/')) {
									tg = w.title.trim();
									if (tg) reviewTheme.push(tg);
								}
							});
						});
						const text = $Bio.jsonParse(this.pth_rev, {}, 'file');
						text[this.album] = {
							author: reviewAuthor,
							composer,
							date: songReleaseYear,
							genres: reviewGenre,
							moods: reviewMood,
							themes: reviewTheme,
							wiki: review,
							update: Date.now()
						};
						if (this.fo_rev) {
							$Bio.buildPth(this.fo_rev);
							$Bio.save(this.pth_rev, JSON.stringify($Bio.sortKeys(text), null, 3), true);
						}
						if (reviewAuthor || reviewGenre || reviewMood || reviewTheme || review || songReleaseYear || composer)	{
							serverBio.res();
						} else {
							serverBio.updateNotFound(`Rev ${cfg.partialMatch} ${this.pth_rev} ${this.album} ${this.albumArtist}`);
							$Bio.trace(`allmusic review: ${this.album} / ${this.albumArtist}: not found`, true);
						}
					}
				} catch (e) {
					serverBio.updateNotFound(`Rev ${cfg.partialMatch} ${this.pth_rev}${this.dn_type != 'track' ? '' : ` ${this.album} ${this.albumArtist}`}`);
					$Bio.trace(`allmusic review: ${this.album} / ${this.albumArtist}: not found`, true);
				}
				docBio.close();
				if (!this.dn_type.includes('+biography')) break;
				if (this.artistLink) {
					this.sw = 2;
					return this.search(this.sw, `${this.artistLink}/biography`);
				}
				break;
			case 2:
				docBio.close();
				parse.amBio(this.xmlhttp.responseText, this.artist, this.album, '', this.fo_bio, this.pth_bio, this.pth_rev);
				break;
		}
	}
}

class Parse {
	amBio(responseText, artist, album, title, fo_bio, pth_bio, pth_rev) {
		docBio.open();
		const div = docBio.createElement('div');
		try {
			div.innerHTML = responseText;
			const dv = div.getElementsByTagName('div');
			let active = '';
			let biography = '';
			let biographyAuthor = '';
			let biographyGenre = [];
			let biographyLabel = '';
			let groupMembers = [];
			let end = '';
			let start = '';
			let tg = '';

			$Bio.htmlParse(dv, 'className', 'text', v => biography = serverBio.format(v.innerHTML));
			$Bio.htmlParse(dv, 'className', 'birth', v => start = serverBio.format(v.innerHTML).replace(/Born/i, 'Born:').replace(/Formed/i, 'Formed:'));
			$Bio.htmlParse(dv, 'className', 'death', v => end = serverBio.format(v.innerHTML).replace(/Died/i, 'Died:').replace(/Disbanded/i, 'Disbanded:'));
			$Bio.htmlParse(dv, 'className', 'active-dates', v => active = v.innerText.replace(/Active/i, 'Active: ').trim());

			$Bio.htmlParse(div.getElementsByTagName('a'), false, false, v => {
				if (v.href.includes('www.allmusic.com/genre') || v.href.includes('www.allmusic.com/style')) {
					tg = v.innerText.trim();
					if (tg) biographyGenre.push(tg);
				}
			});

			$Bio.htmlParse(dv, 'className', 'group-members', v => {
				const a = v.getElementsByTagName('a');
				for (let i = 0; i < a.length; i++) {
					groupMembers.push(a[i].innerText.trim());
				}
			});

			biographyGenre = biographyGenre.length ?  `Genre: ${biographyGenre.join('\u200b, ')}` : '';
			groupMembers = groupMembers.length ? `Group Members: ${groupMembers.join('\u200b, ')}` : '';
			$Bio.htmlParse(div.getElementsByTagName('h2'), 'className', 'bio-heading', v => biographyLabel = serverBio.format(v.innerHTML));
			$Bio.htmlParse(div.getElementsByTagName('span'), 'className', 'bio-text', v => biographyAuthor = serverBio.format(v.innerHTML));
			biographyAuthor = `${biographyLabel} ${biographyAuthor}`;

			biography = txt.add([active, start, end, biographyGenre, groupMembers, biographyAuthor], biography);
			biography = biography.trim();

			if (biography.length > 19) {
				if (fo_bio) {
					$Bio.buildPth(fo_bio);
					$Bio.save(pth_bio, biography, true);
					serverBio.res();
				}
			} else {
				album ? serverBio.updateNotFound(`Bio ${cfg.partialMatch} ${pth_rev}`) : serverBio.updateNotFound(`Bio ${cfg.partialMatch} ${artist} - ${title}`);
				if (!$Bio.file(pth_bio)) $Bio.trace(`allmusic biography: ${artist}: not found`, true);
			}
		} catch (e) {
			album ? serverBio.updateNotFound(`Bio ${cfg.partialMatch} ${pth_rev}`) : serverBio.updateNotFound(`Bio ${cfg.partialMatch} ${artist} - ${title}`);
			if (!$Bio.file(pth_bio)) $Bio.trace(`allmusic biography: ${artist}: not found`, true);
		}
		docBio.close();
	}

	amSearch(div, artist, item) {
		let j = 0; const list = [];
		const items = div.getElementsByTagName('li');
		for (let i = 0; i < items.length; i++) {
			if (items[i].className == item) {
				list[j] = {};
				$Bio.htmlParse(items[i].getElementsByTagName('div'), 'className', 'title', v => {
					const a = v.getElementsByTagName('a');
					list[j].title = a.length && a[0].innerText ? a[0].innerText : 'N/A';
					list[j].titleLink = a.length && a[0].href ? a[0].href : '';
				});
				$Bio.htmlParse(items[i].getElementsByTagName('div'), 'className', artist, v => {
					const a = v.getElementsByTagName('a');
					list[j].artist = a.length && a[0].innerText ? a[0].innerText : v.innerText;
					list[j].artistLink = a.length && a[0].href ? a[0].href : '';
				});
				j++;
			}
		}
		return list;
	}
}

const parse = new Parse();
