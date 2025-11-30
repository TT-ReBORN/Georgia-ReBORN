'use strict';

class BioRequestAllmusic {
	constructor() {
		this.request = null;
		this.timer = null;
		this.checkResponse = null;
	}

	abortRequest() {
		if (!this.request) return;
		clearTimeout(this.timer);
		clearInterval(this.checkResponse);
		this.request.Abort();
		this.request = null;
		this.timer = null;
		this.checkResponse = null;
	}

	onStateChange(resolve, reject, func = null) { // credit regorxxx
		if (this.request !== null) {
			if (this.request.Status === 200) {
				return func ? func(this.request.ResponseText, this.request) : resolve(this.request.ResponseText);
			} else if (!func) {
				return reject(this.request.ResponseText);
			}
		} else if (!func) {
			return reject({ status: 408, responseText: 'Request Timeout' });
		}
		return null;
	}

	send({ method = 'GET', URL, body = void (0), func = null, requestHeader = [], bypassCache = false, timeout = 5000 }) { // credit regorxxx
		this.abortRequest();

		return new Promise((resolve, reject) => {
			// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#bypassing_the_cache
			// Add ('&' + new Date().getTime()) to URLS to avoid caching
			const fullUrl = URL + (bypassCache ? (URL.includes('?') ? '&' : '?') + new Date().getTime() : '');
			this.request = new ActiveXObject('WinHttp.WinHttpRequest.5.1');
			this.request.Open(method, fullUrl, true);

			requestHeader.forEach(pair => {
				if (!pair[0] || !pair[1]) {
					console.log(`HTTP Headers missing: ${pair}`);
					return;
				}
				this.request.SetRequestHeader(...pair);
			});

			if (bypassCache) {
				this.request.SetRequestHeader('Cache-Control', 'private');
				this.request.SetRequestHeader('Pragma', 'no-cache');
				this.request.SetRequestHeader('Cache', 'no-store');
				this.request.SetRequestHeader('If-Modified-Since', 'Sat, 1 Jan 2000 00:00:00 GMT');
			}

			this.request.SetTimeouts(timeout, timeout, timeout, timeout);
			this.request.Send(method === 'POST' ? body : void (0));

			this.timer = setTimeout(() => {
				clearInterval(this.checkResponse);
				try {
					this.request.WaitForResponse(-1);
					this.onStateChange(resolve, reject, func);
				} catch (e) {
					let status = 400;
					if (e.message.indexOf('0x80072ee7') !== -1) {
						status = 400;
					} else if (e.message.indexOf('0x80072ee2') !== -1) {
						status = 408;
					} else if (e.message.indexOf('0x8000000a') !== -1) {
						status = 408;
					}
					this.abortRequest();
					reject({ status, responseText: e.message });
				}
			}, timeout);

			this.checkResponse = setInterval(() => {
				let response;
				try {
					response = this.request.Status && this.request.ResponseText;
				} catch (e) {}
				if (!response) return;
				this.onStateChange(resolve, reject, func);
			}, 30);
		});
	}
}

/**
 * The instance of `BioRequestAllmusic` class for biography AllMusic request operations.
 * @typedef {BioRequestAllmusic}
 * @global
 */
const bioAllMusicReq = new BioRequestAllmusic();

class BioDldAllmusic {
	init(URL, referer, p_title, p_artist, p_fo_bio, p_pth_bio, p_force) {
		this.active = '';
		this.artist = p_artist;
		this.artistLink = '';
		this.biography = '';
		this.biographyAuthor = '';
		this.biographyGenre = [];
		this.end = '';
		this.fo_bio = p_fo_bio;
		this.force = p_force;
		this.groupMembers = [];
		this.pth_bio = p_pth_bio;
		this.start = '';
		this.title = p_title;
		this.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36';

		this.search(!this.title ? 'artist' : 'id', URL, referer);
	}

	search(item, URL, referer) {
		let i = 0;
		let list = [];
		switch (item) {
			case 'id':
				bioAllMusicReq.send({
					method: 'GET',
					bypassCache: this.force,
					requestHeader: [
						['referer', referer],
						['user-agent', this.userAgent]
					],
					URL
				}).then(
					(response) => {
						bioDoc.open();
						const div = bioDoc.createElement('div');
						div.innerHTML = response;
						list = bioParse.amSearch(div, 'performers', 'song');
						i = bio.server.match(this.artist, this.title, list, 'song');
						if (i != -1) {
							this.artistLink = list[i].artistLink;
							if (this.artistLink) {
								bioDoc.close();
								return this.search('biography', `${this.artistLink}/biographyAjax`, this.artistLink);
							}
						}
						if (this.artist) this.search('artist', `${bio.server.url.am}artists/${encodeURIComponent(this.artist)}`, 'https://allmusic.com');
						bioDoc.close();
					},
					(error) => {
						$Bio.trace(`allmusic review / biography: ${bio.server.album} / ${bio.server.albumArtist}: not found Status error: ${this.xmlhttp.status}`, true);
					}
				).catch((error) => {
					bio.server.updateNotFound(`Bio ${bioCfg.partialMatch} ${this.artist} - ${this.title}`);
					if (!$Bio.file(this.pth_bio)) $Bio.trace(`allmusic biography: ${this.artist}: not found`, true);
				});
				break;

			case 'artist':
				bioAllMusicReq.send({
					method: 'GET',
					bypassCache: this.force,
					requestHeader: [
						['referer', referer],
						['user-agent', this.userAgent]
					],
					URL
				}).then(
					(response) => {
						bioDoc.open();
						const div = bioDoc.createElement('div');
						div.innerHTML = response;
						const artists = [];
						const artist = $Bio.strip(this.artist);
						$Bio.htmlParse(div.getElementsByTagName('div'), 'className', 'name', v => {
							const a = v.getElementsByTagName('a');
							let name = a.length && a[0].innerText ? a[0].innerText : '';
							name = $Bio.strip(name);
							const href = a.length && a[0].href ? a[0].href : '';
							if (name && href && artist == name) artists.push(href);
						});
						bioDoc.close();
						if (artists.length == 1 && artists[0]) {
							return this.search('biography', `${artists[0]}/biographyAjax`, artists[0]);
						}
						bio.server.updateNotFound(`Bio ${bioCfg.partialMatch} ${this.artist} - ${this.title}`);
						if (!$Bio.file(this.pth_bio)) {
							$Bio.trace(`allmusic biography: ${this.artist}${artists.length > 1 ? ': unable to disambiguate multiple artists of same name: discriminators, album name or track title, either not matched or absent (e.g. menu look ups)' : ': not found'}`, true);
						}
					},
					(error) => {
						$Bio.trace(`allmusic review / biography: ${bio.server.album} / ${bio.server.albumArtist}: not found Status error: ${this.xmlhttp.status}`, true);
					}
				).catch((error) => {
					bio.server.updateNotFound(`Bio ${bioCfg.partialMatch} ${this.artist} - ${this.title}`);
					if (!$Bio.file(this.pth_bio)) $Bio.trace(`allmusic biography: ${this.artist}: not found`, true);
				});
				break;

			case 'biography':
				bioAllMusicReq.send({
					method: 'GET',
					bypassCache: this.force,
					requestHeader: [
						['referer', referer],
						['user-agent', this.userAgent]
					],
					URL
				}).then(
					(response) => {
						bioParse.amBio(this, response);
						if (this.artistLink) {
							this.search('artistPage', this.artistLink, 'https://allmusic.com');
						}
				},
				(error) => {}
				).catch((error) => {});
				break;

			case 'artistPage':
				bioAllMusicReq.send({
					method: 'GET',
					bypassCache: this.force,
					requestHeader: [
						['referer', referer],
						['user-agent', this.userAgent]
					],
					URL
				}).then(
					(response) => {
						bioParse.amArtist(this, response, this.artist, '', this.title, this.fo_bio, this.pth_bio, '');
			},
			(error) => {
				$Bio.trace(`allmusic review / biography: ${this.album} / ${this.albumArtist}: not found Status error: ${JSON.stringify(error)}`, true)
			}
			).catch((error) => {
				if (this.album) {
					bio.server.updateNotFound(`Bio ${bioCfg.partialMatch} ${this.pth_rev}`);
				} else {
					bio.server.updateNotFound(`Bio ${bioCfg.partialMatch} ${this.artist} - ${this.title}`);
				}
				if (!$Bio.file(this.pth_bio)) $Bio.trace(`allmusic biography: ${this.artist}: not found`, true);
			});
				break;
		}
	}
}

class BioDldAllmusicRev {
	init(URL, referer, p_album, p_alb_artist, p_artist, p_va, p_dn_type, p_fo_rev, p_pth_rev, p_fo_bio, p_pth_bio, p_art, p_force) {
		this.album = p_album;
		this.albumArtist = p_alb_artist;
		this.art = p_art;
		this.artist = p_artist;
		this.artistLink = '';
		this.active = '';
		this.biography = '';
		this.biographyAuthor = '';
		this.biographyGenre = [];
		this.composer = [];
		this.dn_type = p_dn_type;
		this.end = '';
		this.fo_bio = p_fo_bio;
		this.fo_rev = p_fo_rev;
		this.force = p_force;
		this.groupMembers = [];
		this.pth_bio = p_pth_bio;
		this.pth_rev = p_pth_rev;
		this.rating = 'x';
		this.releaseDate = '';
		this.review = '';
		this.reviewAuthor = '';
		this.reviewGenre = '';
		this.reviewMood = '';
		this.reviewTheme = '';
		this.songGenre = [];
		this.songMood = [];
		this.songTheme = [];
		this.songReleaseYear = '';
		this.start = '';
		this.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36';
		this.va = p_va;
		this.search('id', URL, referer);
	}

	search(item, URL, referer) {
		let list = [];
		switch (item) {
			case 'id':
				bioAllMusicReq.send({
					method: 'GET',
					bypassCache: this.force,
					requestHeader: [
						['referer', referer],
						['user-agent', this.userAgent]
					],
					URL
				}).then(
					(response) => {
						bioDoc.open();
						const div = bioDoc.createElement('div');
						div.innerHTML = response;
						const item = {};
						if (this.dn_type.startsWith('review') || this.dn_type == 'biography') { item.art = 'artist'; item.type = 'album'; } // this.dn_type choices: 'review+biography'* || 'composition+biography' || 'review' || 'composition' || 'track' || 'biography' // *falls back to trying track / artist based biography if art_upd needed
						else if (this.dn_type == 'track') { item.art = 'performers'; item.type = 'song'; }
						else { item.art = 'composer'; item.type = 'composition'; }
						list = bioParse.amSearch(div, item.art, item.type);
						const i = bio.server.match(this.albumArtist, this.album, list, item.type);
						if (i != -1) {
							if (!this.va) this.artistLink = list[i].artistLink;
							if (this.dn_type != 'biography') {
								bioDoc.close();
								this.titleLink = list[i].titleLink;
								if (this.titleLink) {
									return this.search('review', this.titleLink + (item.type != 'composition' ? '/reviewAjax' : '/descriptionAjax'), this.titleLink);
								}
							} else if (!this.va) {
								bioDoc.close();
								if (this.artistLink) {
									return this.search('biography', `${this.artistLink}/biographyAjax`, this.artistLink);
								}
							}
						}
						bio.server.getBio(this.force, this.art, 1);
						if (this.dn_type.includes('biography')) bio.server.updateNotFound(`Bio ${bioCfg.partialMatch} ${this.pth_rev}`);
						bio.server.updateNotFound(`Rev ${bioCfg.partialMatch} ${this.pth_rev}${this.dn_type != 'track' ? '' : ` ${this.album} ${this.albumArtist}`}`);
						$Bio.trace(`allmusic review: ${this.album} / ${this.albumArtist}: not found`, true);
						bioDoc.close();
					},
					(error) => {
						$Bio.trace(`allmusic review / biography: ${this.album} / ${this.albumArtist}: not found Status error: ${JSON.stringify(error)}`, true)
					}
				).catch((error) => {
					bio.server.getBio(this.force, this.art, 1);
					bio.server.updateNotFound(`Bio ${bioCfg.partialMatch} ${this.pth_rev}`);
					bio.server.updateNotFound(`Rev ${bioCfg.partialMatch} ${this.pth_rev}${this.dn_type != 'track' ? '' : ` ${this.album} ${this.albumArtist}`}`);
					$Bio.trace(`allmusic review: ${this.album} / ${this.albumArtist}: not found`, true);
				});
				break;

			case 'review':
				bioAllMusicReq.send({
					method: 'GET',
					bypassCache: this.force,
					requestHeader: [
						['referer', referer],
						['user-agent', this.userAgent]
					],
					URL
				}).then(
					(response) => {
						bioDoc.open();
						const div = bioDoc.createElement('div');
						div.innerHTML = response;
						const dv = div.getElementsByTagName('div');
						const module = this.dn_type == 'track' ? 'songContentSubModule' : this.dn_type.includes('composition') ? 'compositionContentSubModule' : 'albumContentSubModule';
						$Bio.htmlParse(dv, 'className', module, v => this.review = v.innerHTML);
						this.review = this.dn_type != 'track' && !this.dn_type.includes('composition') ? this.review.split(Regex.HtmlTagH3Close) : this.review.split(Regex.HtmlTagH2Close);
						if (this.review.length == 2) {
							this.reviewAuthor = bio.server.format(this.review[0]);
							this.review = bio.server.format(this.review[1]);
						} else this.review = bio.server.format(this.review[0]);
						bioDoc.close();
						if (this.titleLink) {
							if (!this.dn_type.includes('composition')) this.search('moodsThemes', `${this.titleLink}/moodsThemesAjax`, this.titleLink);
							else this.search('titlePage', this.titleLink, 'https://allmusic.com');
						}
					},
					(error) => {}
				).catch((error) => {});
				break;

			case 'moodsThemes':
				bioAllMusicReq.send({
					method: 'GET',
					bypassCache: this.force,
					requestHeader: [
						['referer', referer],
						['user-agent', this.userAgent]
					],
					URL
				}).then(
					(response) => {
						bioDoc.open();
						const div = bioDoc.createElement('div');
						div.innerHTML = response;
						const a = div.getElementsByTagName('a');
						const reviewMood = [];
						const reviewTheme = [];
						$Bio.htmlParse(a, false, false, v => {
							if (v.href.startsWith('about:/mood/')) {
								const tm = v.innerText.trim();
								if (tm) reviewMood.push(tm.replace(Regex.PunctNumberParen, '').trim());
							}
							if (v.href.startsWith('about:/theme/')) {
								const tth = v.innerText.trim();
								if (tth) reviewTheme.push(tth.replace(Regex.PunctNumberParen, '').trim());
							}
						});
						if (reviewMood.length) {
							if (this.dn_type != 'track') this.reviewMood = `Album Moods: ${reviewMood.join(`${Unicode.ZeroWidthSpace}, `)}`;
							else this.songMood = reviewMood;
						}
						if (reviewTheme.length) {
							if (this.dn_type != 'track') this.reviewTheme = `Album Themes: ${reviewTheme.join(`${Unicode.ZeroWidthSpace}, `)}`
							else this.songTheme = reviewTheme;
						}
						bioDoc.close();
						if (this.titleLink) this.search('titlePage', this.titleLink, 'https://allmusic.com');
					},
					(error) => {}
				).catch((error) => {});
				break;

			case 'titlePage':
				bioAllMusicReq.send({
					method: 'GET',
					bypassCache: this.force,
					requestHeader: [
						['referer', referer],
						['user-agent', this.userAgent]
					],
					URL
				}).then(
					(response) => {
						bioDoc.open();
						const div = bioDoc.createElement('div')
						div.innerHTML = response;
						const a = div.getElementsByTagName('a');
						const dv = div.getElementsByTagName('div');
						const reviewGenre = [];
						let tg = '';
						if (this.dn_type != 'track') {
							$Bio.htmlParse(dv, 'className', 'release-date', v => this.releaseDate = v.innerText.replace(Regex.BioReleaseDate, 'Release Date: ').trim());
							$Bio.htmlParse(a, false, false, v => {
								if (v.href.includes('www.allmusic.com/genre') || v.href.includes('www.allmusic.com/style')) {
									tg = v.innerText.trim();
									if (tg) reviewGenre.push(tg);
								}
							});
							if (reviewGenre.length) this.reviewGenre = `Genre: ${reviewGenre.join(`${Unicode.ZeroWidthSpace}, `)}`;
							const match = response.match(Regex.WebAllMusicRating);
							if (match && match.length == 2) this.rating = match[1] != 0 ? match[1] / 2 + 0.5 : 0;
							this.saveAlbumReview();
						} else {
							$Bio.htmlParse(div.getElementsByTagName('div'), 'className', 'composer', v => {
								const a = v.getElementsByTagName('a');
								for (let i = 0; i < a.length; i++) {
									if (a[i].innerText) this.composer.push(a[i].innerText);
								}
							});
							$Bio.htmlParse(div.getElementsByTagName('div'), 'className', 'genre', v => {
								const a = v.getElementsByTagName('a');
								for (let i = 0; i < a.length; i++) {
									if (a[i].innerText) this.songGenre.push(a[i].innerText);
								}
							});
							$Bio.htmlParse(div.getElementsByTagName('div'), 'className', 'styles', v => {
								const a = v.getElementsByTagName('a');
								for (let i = 0; i < a.length; i++) {
									if (a[i].innerText) this.songGenre.push(a[i].innerText);
								}
							});
							const m = response.match(Regex.WebAllMusicDataReleaseYear);
							if (m) {
								this.songReleaseYear = m[0].replace(Regex.NumNonDigits, '').trim();
							}
							this.saveTrackReview();
						}
						bioDoc.close();

						if (this.dn_type.includes('+biography') && this.artistLink) {
							return this.search('biography', `${this.artistLink}/biographyAjax`, this.artistLink);
						}
					},
					(error) => {
						if (this.dn_type.includes('+biography') && this.artistLink) {
							return this.search('biography', `${this.artistLink}/biographyAjax`, this.artistLink);
						}
						$Bio.trace(`allmusic review / biography: ${this.album} / ${this.albumArtist}: not found Status error: ${JSON.stringify(error)}`, true)
					}
				).catch((error) => {
					if (this.dn_type.includes('+biography') && this.artistLink) {
						return this.search('biography', `${this.artistLink}/biographyAjax`, this.artistLink);
					}
					bio.server.updateNotFound(`Bio ${bioCfg.partialMatch} ${this.pth_rev}`);
					bio.server.updateNotFound(`Rev ${bioCfg.partialMatch} ${this.pth_rev}${this.dn_type != 'track' ? '' : ` ${this.album} ${this.albumArtist}`}`);
					$Bio.trace(`allmusic review: ${this.album} / ${this.albumArtist}: not found`, true);
				});
				break;

			case 'biography':
				bioAllMusicReq.send({
					method: 'GET',
					bypassCache: this.force,
					requestHeader: [
						['referer', referer],
						['user-agent', this.userAgent]
					],
					URL
				}).then(
					(response) => {
						bioParse.amBio(this, response);
						if (this.artistLink) this.search('artistPage', this.artistLink, 'https://allmusic.com');
					},
					(error) => {}
				).catch((error) => {});
				break;

			case 'artistPage':
				bioAllMusicReq.send({
					method: 'GET',
					bypassCache: this.force,
					requestHeader: [
						['referer', referer],
						['user-agent', this.userAgent]
					],
					URL
				}).then(
					(response) => {
						bioParse.amArtist(this, response, this.artist, this.album, '', this.fo_bio, this.pth_bio, this.pth_rev);
				},
					(error) => {
						$Bio.trace(`allmusic review / biography: ${this.album} / ${this.albumArtist}: not found Status error: ${JSON.stringify(error)}`, true)
					}
				).catch((error) => {
					if (this.album) {
						bio.server.updateNotFound(`Bio ${bioCfg.partialMatch} ${this.pth_rev}`);
					} else {
						bio.server.updateNotFound(`Bio ${bioCfg.partialMatch} ${this.artist} - ${this.title}`);
					}
					if (!$Bio.file(this.pth_bio)) $Bio.trace(`allmusic biography: ${this.artist}: not found`, true);
				});
				break;
		}
	}

	saveAlbumReview() {
		this.review = `>> Album rating: ${this.rating} <<  ${this.review}`;
		this.review = bio.txt.add([this.reviewGenre, this.reviewMood, this.reviewTheme, this.releaseDate, this.reviewAuthor], this.review);
		this.review = this.review.trim();
		if (this.review.length > 22) {
			if (this.fo_rev) {
				$Bio.buildPth(this.fo_rev);
				$Bio.save(this.pth_rev, this.review, true);
				bio.server.res();
			}
		} else {
			bio.server.updateNotFound(`Rev ${bioCfg.partialMatch} ${this.pth_rev}`);
			$Bio.trace(`allmusic this.review: ${this.album} / ${this.albumArtist}: not found`, true);
		}
	}

	saveTrackReview() {
		const text = $Bio.jsonParse(this.pth_rev, {}, 'file');
		text[this.album] = {
			author: this.reviewAuthor,
			composer: this.composer,
			date: this.songReleaseYear,
			genres: this.songGenre,
			moods: this.songMood,
			themes: this.songTheme,
			wiki: this.review,
			update: Date.now()
		};
		if (this.fo_rev) {
			$Bio.buildPth(this.fo_rev);
			$Bio.save(this.pth_rev, JSON.stringify($Bio.sortKeys(text), null, 3), true);
		}

		if (this.reviewAuthor || this.reviewGenre || this.reviewMood || this.reviewTheme || this.review || this.songReleaseYear || this.composer)	{
			bio.server.res();
		} else {
			bio.server.updateNotFound(`Rev ${bioCfg.partialMatch} ${this.pth_rev} ${this.album} ${this.albumArtist}`);
			$Bio.trace(`allmusic review: ${this.album} / ${this.albumArtist}: not found`, true);
		}
	}
}


class BioParse {
	amArtist(that, responseText, artist, album, title, fo_bio, pth_bio, pth_rev) {
		bioDoc.open();
		const div = bioDoc.createElement('div');
		div.innerHTML = responseText;
		const dv = div.getElementsByTagName('div');
		let tg = '';
		$Bio.htmlParse(dv, 'className', 'birth', v => that.start = bio.server.format(v.innerHTML).replace(Regex.BioBorn, 'Born:').replace(Regex.BioFormed, 'Formed:'));
		$Bio.htmlParse(dv, 'className', 'death', v => that.end = bio.server.format(v.innerHTML).replace(Regex.BioDied, 'Died:').replace(Regex.BioDisbanded, 'Disbanded:'));
		$Bio.htmlParse(dv, 'className', 'activeDates', v => that.active = v.innerText.replace(Regex.BioActive, 'Active: ').trim());

		$Bio.htmlParse(div.getElementsByTagName('a'), false, false, v => {
			if (v.href.includes('www.allmusic.com/genre') || v.href.includes('www.allmusic.com/style')) {
				tg = v.innerText.trim();
				if (tg) that.biographyGenre.push(tg);
			}
		});

		$Bio.htmlParse(dv, 'className', 'group-members', v => {
			const a = v.getElementsByTagName('a');
			for (let i = 0; i < a.length; i++) {
				if (a[i].innerText) that.groupMembers.push(a[i].innerText.trim());
			}
		});

		that.biographyGenre = that.biographyGenre.length ?  `Genre: ${that.biographyGenre.join(`${Unicode.ZeroWidthSpace}, `)}` : '';
		that.groupMembers = that.groupMembers.length ? `Group Members: ${that.groupMembers.join(`${Unicode.ZeroWidthSpace}, `)}` : '';

		this.saveBiography(that, artist, album, title, fo_bio, pth_bio, pth_rev);
		bioDoc.close();
	}

	amBio(that, responseText) {
		bioDoc.open();
		const div = bioDoc.createElement('div');
		div.innerHTML = responseText;
		const dv = div.getElementsByTagName('div');
		$Bio.htmlParse(dv, 'className', 'artistContentSubModule', v => that.biography = v.innerHTML);
		that.biography = that.biography.split(Regex.HtmlTagH2Close);
		if (that.biography.length == 2) {
			that.biographyAuthor = bio.server.format(that.biography[0]);
			that.biography = bio.server.format(that.biography[1]);
		} else that.biography = bio.server.format(that.biography[0]);
		bioDoc.close();
	}

	amSearch(div, artist, item) {
		let j = 0;
		const list = [];
		const items = div.getElementsByTagName('div');
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

	saveBiography(that, artist, album, title, fo_bio, pth_bio, pth_rev) {
		that.biography = bio.txt.add([that.active, that.start, that.end, that.biographyGenre, that.groupMembers, that.biographyAuthor], that.biography);
		that.biography = that.biography.trim();

		if (that.biography.length > 19) {
			if (fo_bio) {
				$Bio.buildPth(fo_bio);
				$Bio.save(pth_bio, that.biography, true);
				bio.server.res();
			}
		} else {
			if (album) {
				bio.server.updateNotFound(`Bio ${bioCfg.partialMatch} ${pth_rev}`);
			} else {
				bio.server.updateNotFound(`Bio ${bioCfg.partialMatch} ${artist} - ${title}`);
			}
			if (!$Bio.file(pth_bio)) $Bio.trace(`allmusic biography: ${artist}: not found`, true);
		}
	}
}

/**
 * The instance of `BioParse` class for biography parsing operations.
 * @typedef {BioParse}
 * @global
 */
const bioParse = new BioParse();
