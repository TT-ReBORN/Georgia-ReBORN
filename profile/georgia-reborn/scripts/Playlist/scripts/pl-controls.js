/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Playlist Controls                        * //
// * Author:         TT                                                      * //
// * Org. Author:    extremeHunter, TheQwertiest                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-DEV                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    18-02-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


//////////////////////
// * META HANDLER * //
//////////////////////
/**
 * A class that handles metadata operations including retrieving album metadata,
 * and writing meta tags or playlist stats to a file.
 */
class PlaylistMetaHandler {
	/**
	 * Creates the `PlaylistMetaHandler` instance.
	 * @param {FbMetadbHandle} metadb - The metadb of the track.
	 */
	constructor(metadb) {
		/** @private @type {FbMetadbHandle} */
		this.metadb = metadb;
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Gets metadata statistics for artists, albums, and tracks from the current active playlist.
	 * Sets default values where data is missing, computes various stats like ratings, counts, playcounts,
	 * and sorts them to find top rated and most played entries.
	 * @param {object[]} metadata - An array of metadata objects for various music entities.
	 * Each object contains artist, album, year, genre, label, country, and tracks information.
	 * @returns {object} An object with aggregated metadata statistics, including:
	 * - Mappings of artists to genres, countries, and their ratings, counts, and playcounts.
	 * - Mappings of albums to artists, years, genres, labels, countries, and their ratings, counts, and playcounts.
	 * - Mappings of tracks to artists, albums, years, genres, labels, and their ratings, counts.
	 * - Sorted lists of top rated and most played artists, albums, tracks, genres, labels, and countries.
	 * - Total play counts for artists, albums, tracks, genres, labels, and countries.
	 * @private
	 */
	_get_metadata_stats(metadata) {
		const artistGenre = new Map();
		const artistCountry = new Map();

		const albumArtist = new Map();
		const albumYear = new Map();
		const albumGenre = new Map();
		const albumLabel = new Map();
		const albumCountry = new Map();

		const trackArtist = new Map();
		const trackAlbum = new Map();
		const trackYear = new Map();
		const trackGenre = new Map();
		const trackLabel = new Map();

		const artistRatings = new Map();
		const albumRatings = new Map();
		const trackRatings = new Map();
		const artistCounts = new Map();
		const albumCounts = new Map();
		const trackCounts = new Map();

		const artistPlaycounts = new Map();
		const albumPlaycounts = new Map();
		const trackPlaycounts = new Map();
		const genrePlaycounts = new Map();
		const labelPlaycounts = new Map();
		const countryPlaycounts = new Map();

		const SetDefaultStringValue = (value, defaultValue) => (value && value !== '?') ? value : defaultValue;
		const SetDefaultStringList  = (value, defaultValue) => (value && value !== '?') ? value.split(',').map(item => item.trim()) : [defaultValue];
		const SetDefaultSet = (map, key) => map.has(key) || map.set(key, new Set());
		const SetDefaultVal = (map, key, value) => map.has(key) || map.set(key, value);
		const SetDefaultNum = (map, key) => map.has(key) || map.set(key, 0);

		for (const data of metadata) {
			// * Set defaults
			const artist  = SetDefaultStringValue(data.artist, 'NO ARTIST');
			const album   = SetDefaultStringValue(data.album, 'NO ALBUM');
			const year    = SetDefaultStringValue(data.year, 'NO YEAR');
			const genre   = SetDefaultStringList(data.genre, 'NO GENRE');
			const label   = SetDefaultStringList(data.label, 'NO LABEL');
			const country = SetDefaultStringList(data.country, 'NO COUNTRY');

			// * Set maps have entries for artist and album
			SetDefaultSet(artistGenre, artist);
			SetDefaultSet(artistCountry, artist);
			SetDefaultVal(albumArtist, album, artist);
			SetDefaultVal(albumYear, album, year);
			SetDefaultSet(albumGenre, album);
			SetDefaultSet(albumLabel, album);
			SetDefaultSet(albumCountry, album);

			// * Set ratings, counts, and playcounts to 0 if they don't exist
			SetDefaultNum(artistRatings, artist);
			SetDefaultNum(albumRatings, album);
			SetDefaultNum(artistCounts, artist);
			SetDefaultNum(albumCounts, album);
			SetDefaultNum(artistPlaycounts, artist);
			SetDefaultNum(albumPlaycounts, album);
			SetDefaultNum(labelPlaycounts, label);
			SetDefaultNum(countryPlaycounts, country);

			// * Add genres to artist/album, labels to album, and countries to artist/album sets
			for (const genreItem of genre) {
				artistGenre.get(artist).add(genreItem);
				albumGenre.get(album).add(genreItem);
			}
			for (const labelItem of label) {
				albumLabel.get(album).add(labelItem);
			}
			for (const countryItem of country) {
				artistCountry.get(artist).add(countryItem);
				albumCountry.get(album).add(countryItem);
			}

			// * Update all ratings, counts and playcounts
			for (const trackItem of data.tracks) {
				const track = SetDefaultStringValue(trackItem.title, 'NO TRACK');
				SetDefaultVal(trackArtist, track, artist);
				SetDefaultVal(trackAlbum, track, album);
				SetDefaultVal(trackYear, track, year);
				SetDefaultSet(trackGenre, track);
				SetDefaultSet(trackLabel, track);
				SetDefaultNum(trackRatings, track);
				SetDefaultNum(trackCounts, track);

				artistRatings.set(artist, artistRatings.get(artist) + trackItem.rating);
				albumRatings.set(album, albumRatings.get(album) + trackItem.rating);
				trackRatings.set(track, (trackRatings.get(track) || 0) + trackItem.rating);

				artistCounts.set(artist, artistCounts.get(artist) + 1);
				albumCounts.set(album, albumCounts.get(album) + 1);
				trackCounts.set(track, (trackCounts.get(track) || 0) + 1);

				artistPlaycounts.set(artist, artistPlaycounts.get(artist) + trackItem.playcount);
				albumPlaycounts.set(album, albumPlaycounts.get(album) + trackItem.playcount);
				trackPlaycounts.set(track, (trackPlaycounts.get(track) || 0) + trackItem.playcount);

				if (genre.length === 0 || (genre.length === 1 && genre[0] === 'NO GENRE')) {
					trackGenre.get(track).add('NO GENRE');
				} else {
					for (const genreItem of genre) {
						trackGenre.get(track).add(genreItem);
						genrePlaycounts.set(genreItem, (genrePlaycounts.get(genreItem) || 0) + trackItem.playcount);
					}
				}
				if (label.length === 0 || (label.length === 1 && label[0] === 'NO LABEL')) {
					trackLabel.get(track).add('NO LABEL');
				} else {
					for (const labelItem of label) {
						trackLabel.get(track).add(labelItem);
						labelPlaycounts.set(labelItem, (labelPlaycounts.get(labelItem) || 0) + trackItem.playcount);
					}
				}
				for (const countryItem of country) {
					if (countryItem !== 'NO COUNTRY') {
						countryPlaycounts.set(countryItem, (countryPlaycounts.get(countryItem) || 0) + trackItem.playcount);
					}
				}
			}
		}

		// * Set top rated stats
		const topRatedArtists = SortKeyValuesByAvg(artistRatings, artistCounts);
		const topRatedAlbums  = SortKeyValuesByAvg(albumRatings, albumCounts);
		const topRatedTracks  = SortKeyValuesByAvg(trackRatings, trackCounts);

		// * Set top played stats
		const topPlayedArtists   = SortKeyValuesByDsc(artistPlaycounts);
		const topPlayedAlbums    = SortKeyValuesByDsc(albumPlaycounts);
		const topPlayedTracks    = SortKeyValuesByDsc(trackPlaycounts);
		const topPlayedGenres    = SortKeyValuesByDsc(genrePlaycounts);
		const topPlayedLabels    = SortKeyValuesByDsc(labelPlaycounts);
		const topPlayedCountries = SortKeyValuesByDsc(countryPlaycounts);

		// * Set total stats
		const totalArtists = new Set(metadata.map(data => data.artist)).size;
		const totalAlbums = new Set(metadata.map(data => data.album)).size;
		const totalTracks = metadata.reduce((sum, data) => sum + data.tracks.length, 0);
		const totalYears = new Set(metadata.map(data => data.year)).size;
		const totalGenres = new Set(metadata.flatMap(data => data.genre)).size;
		const totalLabels = new Set(metadata.map(data => data.label)).size;
		const totalCountries = new Set(metadata.map(data => data.country)).size;
		const totalRatings = metadata.reduce((sum, data) => sum + data.tracks.reduce((sum, track) => sum + track.rating, 0), 0);
		const totalPlaycounts = metadata.reduce((sum, data) => sum + data.tracks.reduce((sum, track) => sum + track.playcount, 0), 0);

		const totalArtistPlays  = [...artistPlaycounts.values()].reduce((acc, count) => acc + count, 0);
		const totalAlbumPlays   = [...albumPlaycounts.values()].reduce((acc, count) => acc + count, 0);
		const totalTrackPlays   = [...trackPlaycounts.values()].reduce((acc, count) => acc + count, 0);
		const totalGenrePlays   = [...genrePlaycounts.values()].reduce((acc, count) => acc + count, 0);
		const totalLabelPlays   = [...labelPlaycounts.values()].reduce((acc, count) => acc + count, 0);
		const totalCountryPlays = [...countryPlaycounts.values()].reduce((acc, count) => acc + count, 0);

		// * Set best rated stats
		const bestRatedArtist = GetKeyByHighestAvg(artistRatings, artistCounts);
		const bestRatedAlbum = GetKeyByHighestAvg(albumRatings, albumCounts);
		const bestRatedTrack = GetKeyByHighestAvg(trackRatings, trackCounts);

		// * Set most listened stats
		const mostPlayedArtist = GetKeyByHighestVal(artistPlaycounts);
		const mostPlayedAlbum = GetKeyByHighestVal(albumPlaycounts);
		const mostPlayedTrack = GetKeyByHighestVal(trackPlaycounts);
		const mostPlayedGenre = GetKeyByHighestVal(genrePlaycounts);
		const mostPlayedLabel = GetKeyByHighestVal(labelPlaycounts);
		const mostPlayedCountry = GetKeyByHighestVal(countryPlaycounts);

		const artistPlaycount = artistPlaycounts.get(mostPlayedArtist);
		const albumPlaycount = albumPlaycounts.get(mostPlayedAlbum);
		const trackPlaycount = trackPlaycounts.get(mostPlayedTrack);
		const genrePlaycount = genrePlaycounts.get(mostPlayedGenre);
		const labelPlaycount = labelPlaycounts.get(mostPlayedLabel);
		const countryPlaycount = countryPlaycounts.get(mostPlayedCountry);

		const artistPercentage = (artistPlaycount / totalArtistPlays) * 100;
		const albumPercentage = (albumPlaycount / totalAlbumPlays) * 100;
		const trackPercentage = (trackPlaycount / totalTrackPlays) * 100;
		const genrePercentage = (genrePlaycount / totalGenrePlays) * 100;
		const labelPercentage = (labelPlaycount / totalLabelPlays) * 100;
		const countryPercentage = (countryPlaycount / totalCountryPlays) * 100;

		return {
			artistGenre, artistCountry,
			albumArtist, albumYear, albumGenre,
			albumLabel, albumCountry,
			trackArtist, trackAlbum, trackYear, trackGenre, trackLabel,

			artistRatings, albumRatings, trackRatings,
			artistCounts, albumCounts, trackCounts,
			artistPlaycounts, albumPlaycounts, trackPlaycounts, genrePlaycounts, labelPlaycounts, countryPlaycounts,

			topRatedArtists, topRatedAlbums, topRatedTracks,
			topPlayedArtists, topPlayedAlbums, topPlayedTracks, topPlayedGenres, topPlayedLabels, topPlayedCountries,

			totalArtists, totalAlbums, totalTracks, totalYears, totalGenres, totalLabels, totalCountries, totalRatings, totalPlaycounts,
			totalArtistPlays, totalAlbumPlays, totalTrackPlays, totalGenrePlays, totalLabelPlays, totalCountryPlays,

			bestRatedArtist, bestRatedAlbum, bestRatedTrack,

			mostPlayedArtist, mostPlayedAlbum, mostPlayedTrack, mostPlayedGenre, mostPlayedLabel, mostPlayedCountry,
			artistPlaycount, albumPlaycount, trackPlaycount, genrePlaycount, labelPlaycount, countryPlaycount,
			artistPercentage, albumPercentage, trackPercentage, genrePercentage, labelPercentage, countryPercentage
		};
	}

	/**
	 * Gets the playcount for a given track.
	 * If no track is provided, it defaults to the current playlist row.
	 * @param {FbMetadbHandle} [track] - The track to get the playcount for.
	 * @returns {number} The playcount of the provided or default track.
	 * @private
	 */
	_get_track_playcount(track = this.metadb) {
		let currentPlaycount;

		if (plSet.use_rating_from_tags) {
			const fileInfo = track.GetFileInfo();
			const ratingIdx = fileInfo.MetaFind('PLAY COUNT');
			currentPlaycount = ratingIdx !== -1 ? fileInfo.MetaValue(ratingIdx, 0) : 0;
		} else {
			currentPlaycount = $('%play_count%', track);
		}
		return currentPlaycount === '' ? null : Number(currentPlaycount);
	}

	/**
	 * Chooses and returns either the `rating` or `playcount` based on the `statsType`.
	 * The `statsType` string should be in the format 'property_subproperty'.
	 * If it has three parts ('property_subproperty_subproperty'), the third subproperty determines the return value.
	 * If `statsType` does not indicate 'rating' or 'trackPlaycount', the function defaults to returning the `rating`.
	 * @param {string} statsType - The type of stats to return, expected to be either 'rating' or 'trackPlaycount'.
	 * @param {number} rating - The rating value to return if `statsType` is 'rating' or invalid.
	 * @param {number} playcount - The playcount value to return if `statsType` is 'trackPlaycount'.
	 * @returns {number} Either the `rating` or `playcount` value, based on the `statsType`.
	 * @private
	 */
	_write_stats_choose_statistic_by_type(statsType, rating, playcount) {
		const statsArray = statsType.split('_');
		const statsProperty = statsArray.length === 3 ? statsArray[2] : statsArray[0];
		return statsProperty === 'trackPlaycount' ? playcount : rating;
	}

	/**
	 * Gets a sorting function based on the provided statistic type.
	 * The statistic type string should be in the format 'property_direction'.
	 * The property indicates the statistic to sort by, and the direction indicates the order ('asc' for ascending, 'dsc' for descending).
	 * @param {string} statsType - The statistic type to sort by.
	 * @returns {function(any, any): number} A sorting function.
	 * @private
	 */
	_write_stats_get_sorting(statsType) {
		const sortMethods = {
			artist: (a, b) => CompareValues(a.artist, b.artist),
			albumTitle: (a, b) => CompareValues(a.album, b.album),
			albumRating: (a, b) => CompareValues(a.albumAverageRating, b.albumAverageRating),
			albumPlaycount: (a, b) => CompareValues(a.albumAveragePlaycount, b.albumAveragePlaycount),
			albumPlaycountTotal: (a, b) => CompareValues(a.albumTotalPlaycount, b.albumTotalPlaycount),
			albumTrackPlaycount: (a, b) => CompareValues(a.albumTotalPlaycount, b.albumTotalPlaycount),
			trackTitle: (a, b) => CompareValues(a.track, b.track),
			trackRating: (a, b) => CompareValues(a.rating, b.rating),
			trackPlaycount: (a, b) => CompareValues(a.playcount, b.playcount),
			year: (a, b) => CompareValues(a.year, b.year),
			genre: (a, b) => CompareValues(a.genre, b.genre),
			label: (a, b) => CompareValues(a.label, b.label),
			country: (a, b) => CompareValues(a.country, b.country)
		};

		const [property, direction] = statsType.split('_');
		const sortMethod = sortMethods[property];

		// Retrieve sortMethod from sortMethods with the given property.
		// If 'dsc', sort descending by reversing arguments; otherwise, sort ascending.
		return sortMethod && ((direction === 'dsc') ? (a, b) => sortMethod(b, a) : sortMethod);
	}

	/**
	 * Generates a formatted string of total and top statistics from the current active playlist.
	 * @param {object} metadata - An object containing various statistics and counts.
	 * @param {string} statsType - A string that indicates whether to return 'rating' or 'playcount' total statistics.
	 * @param {string} topStatsType - A string that indicates whether to return 'topRated' or 'topPlayed' statistics.
	 * @returns {string} Returns a formatted string with the requested statistics.
	 * @private
	 */
	_write_stats_total_top_stats(metadata, statsType, topStatsType) {
		const rating = statsType.toLowerCase().includes('rating') || statsType.toLowerCase().includes('rated');
		const playcount = statsType.toLowerCase().includes('playcount') || statsType.toLowerCase().includes('played');
		let list = '';

		list += 'Total statistics:\n'
			+ ` \u00B7 Artists: ${metadata.totalArtists}\n`
			+ ` \u00B7 Albums: ${metadata.totalAlbums}\n`
			+ ` \u00B7 Tracks: ${metadata.totalTracks}\n`
			+ ` \u00B7 Years: ${metadata.totalYears}\n`
			+ ` \u00B7 Genres: ${metadata.totalGenres}\n`
			+ ` \u00B7 Labels: ${metadata.totalLabels}\n`
			+ ` \u00B7 Countries: ${metadata.totalCountries}\n`
			+ (rating ? ` \u00B7 Ratings: ${metadata.totalRatings}\n` : '')
			+ (playcount ? ` \u00B7 Playcounts: ${metadata.totalPlaycounts}\n` : '') + '\n';

		if (topStatsType === 'topRated') {
			list += 'Top statistics:\n'
				+ ` \u00B7 Best rated artist: ${metadata.bestRatedArtist}\n`
				+ ` \u00B7 Best rated album: ${metadata.bestRatedAlbum}\n`
				+ ` \u00B7 Best rated track: ${metadata.bestRatedTrack}\n\n\n`;
		}

		if (topStatsType === 'topPlayed') {
			list += 'Top statistics:\n'
				+ ` \u00B7 Most played artist: ${metadata.mostPlayedArtist} - ${metadata.artistPlaycount} plays (${metadata.artistPercentage.toFixed(2)}%)\n`
				+ ` \u00B7 Most played album: ${metadata.mostPlayedAlbum} - ${metadata.albumPlaycount} plays (${metadata.albumPercentage.toFixed(2)}%)\n`
				+ ` \u00B7 Most played track: ${metadata.mostPlayedTrack} - ${metadata.trackPlaycount} plays (${metadata.trackPercentage.toFixed(2)}%)\n`
				+ ` \u00B7 Most played genre: ${metadata.mostPlayedGenre} - ${metadata.genrePlaycount} plays (${metadata.genrePercentage.toFixed(2)}%)\n`
				+ ` \u00B7 Most played label: ${metadata.mostPlayedLabel} - ${metadata.labelPlaycount} plays (${metadata.labelPercentage.toFixed(2)}%)\n`
				+ ` \u00B7 Most played country: ${metadata.mostPlayedCountry} - ${metadata.countryPlaycount} plays (${metadata.countryPercentage.toFixed(2)}%)\n\n\n`;
		}

		return list;
	}

	/**
	 * Writes top statistics list for:
	 * - Top rated artists
	 * - Top rated albums
	 * - Top rated tracks
	 * - Top played artists
	 * - Top played albums
	 * - Top played tracks
	 * - Top played genres
	 * - Top played labels
	 * - Top played countries
	 *
	 * It provides a detailed ranked list from top to bottom for each category from the current active playlist.
	 * @param {Array<object>} metadata - An array of objects, each object representing track metadata with all provided properties.
	 * @param {boolean} topRated - Writes the top rated artist and albums as the list.
	 * @param {boolean} topPlayed - Writes the top played artists, albums, genres, labels and countries as the list.
	 * @returns {string} A string formatted for display, containing the top statistics.
	 * @private
	 */
	_write_stats_top_list(metadata, topRated, topPlayed) {
		const includeArtist  = plSet.playlist_stats_include_artist;
		const includeAlbum   = plSet.playlist_stats_include_album;
		const includeYear    = plSet.playlist_stats_include_year;
		const includeGenre   = plSet.playlist_stats_include_genre;
		const includeLabel   = plSet.playlist_stats_include_label;
		const includeCountry = plSet.playlist_stats_include_country;
		const includeStats   = plSet.playlist_stats_include_stats;

		const data = this._get_metadata_stats(metadata);
		let list = '';

		// * Top rated lists
		if (topRated) {
			list += `${WriteFancyHeader('Top rated artists')}\n`;
			let topRatedArtistIndex = 0;
			for (const artist of data.topRatedArtists) {
				const country = includeCountry ? Array.from(data.artistCountry.get(artist) || []).join(', ') : '';
				const genre = includeGenre ? Array.from(data.artistGenre.get(artist) || []).join(', ') : '';
				const include = country || genre ? ` (${country}${country && genre ? ' \u00B7 ' : ''}${genre})` : '';
				const average = data.artistRatings.get(artist) / data.artistCounts.get(artist);
				const stats = includeStats ? `: ${average.toFixed(2)}` : '';

				list += `${topRatedArtistIndex + 1}: ${artist}${include}${stats}\n`;
				topRatedArtistIndex++;
			}
			list += '\n\n';

			list += `${WriteFancyHeader('Top rated albums')}\n`;
			let topRatedAlbumIndex = 0;
			for (const album of data.topRatedAlbums) {
				const year = includeYear && data.albumYear.get(album) ? `${data.albumYear.get(album)}` : '';
				const genreSet = data.albumGenre.get(album);
				const genre = includeGenre && genreSet.size > 0 ? Array.from(genreSet).join(', ') : '';
				const labelSet = data.albumLabel.get(album);
				const label = includeLabel && labelSet.size > 0 ? Array.from(labelSet).join(', ') : '';
				const includeParts = [year, genre, label].filter(part => part !== '');
				const include = includeParts.length > 0 ? ` (${includeParts.join(' \u00B7 ')})` : '';
				const artist = includeArtist && data.albumArtist.get(album) ? ` - ${data.albumArtist.get(album)}` : '';
				const average = data.albumRatings.get(album) / data.albumCounts.get(album);
				const stats = includeStats ? `: ${average.toFixed(2)}` : '';

				list += `${topRatedAlbumIndex + 1}: ${album}${include}${artist}${stats}\n`;
				topRatedAlbumIndex++;
			}
			list += '\n\n';

			list += `${WriteFancyHeader('Top rated tracks')}\n`;
			let topRatedTracksIndex = 0;
			for (const track of data.topRatedTracks) {
				const album = includeAlbum && data.trackAlbum.get(track) ? ` - ${data.trackAlbum.get(track)}` : '';
				const year = includeYear && data.trackYear.get(track) ? `${data.trackYear.get(track)}` : '';
				const genreSet = data.trackGenre.get(track);
				const genre = includeGenre && genreSet.size > 0 ? Array.from(genreSet).join(', ') : '';
				const labelSet = data.trackLabel.get(track);
				const label = includeLabel && labelSet.size > 0 ? Array.from(labelSet).join(', ') : '';
				const includeParts = [year, genre, label].filter(part => part !== '');
				const include = includeParts.length > 0 ? ` (${includeParts.join(' \u00B7 ')})` : '';
				const artist = includeArtist && data.trackArtist.get(track) ? ` - ${data.trackArtist.get(track)}` : '';
				const average = data.trackRatings.get(track);
				const stats = includeStats ? `: ${average.toFixed(2)}` : '';

				list += `${topRatedTracksIndex + 1}: ${track}${album}${include}${artist}${stats}\n`;
				topRatedTracksIndex++;
			}
		}

		// * Top played lists
		if (topPlayed) {
			list += `${WriteFancyHeader('Top played artists')}\n`;
			let topPlayedArtistsIndex = 0;
			for (const artist of data.topPlayedArtists) {
				const country = includeCountry ? Array.from(data.artistCountry.get(artist) || []).join(', ') : '';
				const genre = includeGenre ? Array.from(data.artistGenre.get(artist) || []).join(', ') : '';
				const include = country || genre ? ` (${country}${country && genre ? ' \u00B7 ' : ''}${genre})` : '';
				const playcount = data.artistPlaycounts.get(artist);
				const percentage = (playcount / data.totalArtistPlays) * 100;
				const stats = includeStats ? ` - ${playcount} plays (${percentage.toFixed(2)}%)` : '';

				list += `${topPlayedArtistsIndex + 1}: ${artist}${include}${stats}\n`;
				topPlayedArtistsIndex++;
			}
			list += '\n\n';

			list += `${WriteFancyHeader('Top played albums')}\n`;
			let topPlayedAlbumsIndex = 0;
			for (const album of data.topPlayedAlbums) {
				const year = includeYear && data.albumYear.get(album) ? data.albumYear.get(album) : '';
				const genreSet = data.albumGenre.get(album);
				const genre = includeGenre && genreSet && genreSet.size > 0 ? Array.from(genreSet).join(', ') : '';
				const labelSet = data.albumLabel.get(album);
				const label = includeLabel && labelSet && labelSet.size > 0 ? Array.from(labelSet).join(', ') : '';
				const includeParts = [year, genre, label].filter(part => part !== '');
				const include = includeParts.length > 0 ? ` (${includeParts.join(' \u00B7 ')})` : '';
				const artist = includeArtist && data.albumArtist.get(album) ? ` - ${data.albumArtist.get(album)}` : '';
				const playcount = data.albumPlaycounts.get(album);
				const percentage = (playcount / data.totalAlbumPlays) * 100;
				const stats = includeStats ? ` - ${playcount} plays (${percentage.toFixed(2)}%)` : '';

				list += `${topPlayedAlbumsIndex + 1}: ${album}${include}${artist}${stats}\n`;
				topPlayedAlbumsIndex++;
			}
			list += '\n\n';

			list += `${WriteFancyHeader('Top played tracks')}\n`;
			let topPlayedTracksIndex = 0;
			for (const track of data.topPlayedTracks) {
				const album = includeAlbum && data.trackAlbum.get(track) ? ` - ${data.trackAlbum.get(track)}` : '';
				const year = includeYear && data.trackYear.get(track) ? data.trackYear.get(track) : '';
				const genreSet = data.trackGenre.get(track);
				const genre = includeGenre && genreSet && genreSet.size > 0 ? Array.from(genreSet).join(', ') : '';
				const labelSet = data.trackLabel.get(track);
				const label = includeLabel && labelSet && labelSet.size > 0 ? Array.from(labelSet).join(', ') : '';
				const includeParts = [year, genre, label].filter(part => part !== '');
				const include = includeParts.length > 0 ? ` (${includeParts.join(' \u00B7 ')})` : '';
				const artist = includeArtist && data.trackArtist.get(track) ? ` - ${data.trackArtist.get(track)}` : '';
				const playcount = data.trackPlaycounts.get(track);
				const percentage = (playcount / data.totalAlbumPlays) * 100;
				const stats = includeStats ? ` - ${playcount} plays (${percentage.toFixed(2)}%)` : '';

				list += `${topPlayedTracksIndex + 1}: ${track}${album}${include}${artist}${stats}\n`;
				topPlayedTracksIndex++;
			}
			list += '\n\n';

			list += `${WriteFancyHeader('Top played genres')}\n`;
			let topPlayedGenresIndex = 0;
			for (const genre of data.topPlayedGenres) {
				const playcount = data.genrePlaycounts.get(genre);
				const percentage = (playcount / data.totalGenrePlays) * 100;
				const stats = includeStats ? ` - ${playcount} plays (${percentage.toFixed(2)}%)` : '';

				list += `${topPlayedGenresIndex + 1}: ${genre}${stats}\n`;
				topPlayedGenresIndex++;
			}
			list += '\n\n';

			list += `${WriteFancyHeader('Top played labels')}\n`;
			let topPlayedLabelsIndex = 0;
			for (const label of data.topPlayedLabels) {
				const playcount = data.labelPlaycounts.get(label);
				if (playcount <= 0) return '';
				const percentage = (playcount / data.totalLabelPlays) * 100;
				const stats = includeStats ? ` - ${playcount} plays (${percentage.toFixed(2)}%)` : '';

				list += `${topPlayedLabelsIndex + 1}: ${label}${stats}\n`;
				topPlayedLabelsIndex++;
			}
			list += '\n\n';

			list += `${WriteFancyHeader('Top played countries')}\n`;
			let topPlayedCountriesIndex = 0;
			for (const country of data.topPlayedCountries) {
				const playcount = data.countryPlaycounts.get(country);
				if (playcount <= 0) return '';
				const percentage = (playcount / data.totalCountryPlays) * 100;
				const stats = includeStats ? ` - ${playcount} plays (${percentage.toFixed(2)}%)` : '';

				list += `${topPlayedCountriesIndex + 1}: ${country}${stats}\n`;
				topPlayedCountriesIndex++;
			}
		}

		return list;
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Iterates through the current active playlist and builds metadata for each album.
	 * @returns {Map} A map where keys are album names and values are objects with properties:
	 * - artist: The name of the artist of the album.
	 * - album: The name of the album.
	 * - year: The year of the album.
	 * - genre: The genre of the album.
	 * - label: The label the artist is signed to.
	 * - country: The country the artist is from.
	 * - albumTrackCount: The total number of tracks on the album.
	 * - albumTotalRating: The calculated total rating of all tracks on the album.
	 * - albumTotalPlaycount: The calculated total playcount of all tracks on the album.
	 * - albumAverageRating: The calculated average album rating.
	 * - albumAveragePlaycount: The calculated average album playcount.
	 * - tracks: An array of track objects, each with properties:
	 *   - track: The track object from the playlist.
	 *   - trackNumber: The track number.
	 *   - title: The title of the track.
	 *   - rating: The rating of the track.
	 *   - playcount: The playcount of the track.
	 */
	get_metadata() {
		const metadata = new Map();
		const getRating = new PlaylistRating();
		const playlistItems = plman.GetPlaylistItems(plman.ActivePlaylist).Convert();

		for (let i = 0; i < playlistItems.length; ++i) {
			const currentItem = playlistItems[i];
			const artist = $('$if2(%album artist%,[%artist%])', currentItem);
			const album = $('%album%', currentItem);
			const trackNumber = $('%tracknumber%', currentItem);
			const title = $('%title%', currentItem);
			const year = $('$if2(%year%,[%date%])', currentItem);
			const genre = $('%genre%', currentItem);
			const label = $('$if2(%label%,[%publisher%])', currentItem);
			const country = $('$if2(%artistcountry%,[%country%])', currentItem);
			const rating = getRating.get_track_rating(currentItem) || 0;
			const playcount = this._get_track_playcount(currentItem) || 0;

			let albumData = metadata.get(album);
			if (!albumData) {
				albumData = {
					artist,
					album,
					year,
					genre,
					label,
					country,
					albumTrackCount: 0,
					albumTotalRating: 0,
					albumTotalPlaycount: 0,
					albumAverageRating: 0,
					albumAveragePlaycount: 0,
					tracks: []
				};
				metadata.set(album, albumData);
			}

			albumData.albumTrackCount += 1;
			albumData.albumTotalRating += rating;
			albumData.albumTotalPlaycount += playcount;

			albumData.tracks.push({
				track: currentItem,
				trackNumber,
				title,
				rating,
				playcount
			});
		}

		// * Calculate the averages after processing all tracks
		for (const [, albumData] of metadata) {
			albumData.albumAverageRating = albumData.albumTrackCount > 0 ? Number((albumData.albumTotalRating / albumData.albumTrackCount).toFixed(2)) : 0;
			albumData.albumAveragePlaycount = albumData.albumTrackCount > 0 ? Math.round(albumData.albumTotalPlaycount / albumData.albumTrackCount) : 0;
		}

		return metadata;
	}

	/**
	 * Calculate Peak Loudness Ratio keeping in mind replayGain 2.0 is implemented in Foobar2000.
	 * Reference value in Foobar 2000 is set on -18 LUFS in order to maintain backwards compatibility with RG1, RG2.
	 * EBU R 128 reference is -23 LUFS.
	 * @param {string} gain - The ReplayGain gain value for track %replaygain_track_gain% | for album %replaygain_album_gain%.
	 * @param {string} peak - The ReplayGain peak value for track %replaygain_track_peak_db% | for album %replaygain_album_peak_db%.
	 * @returns {string} The Peak Loudness Ratio.
	 */
	get_PLR(gain, peak) {
		const lufs = -2300 - (Number(gain.replace(/[^0-9+-]/g, '')) - 500);
		const tpfs = Number(peak.replace(/[^0-9+-]/g, ''));
		const plr = tpfs - lufs;
		const plr_value = plr % 100 > 49 ? plr + 100 : plr;

		return Math.floor(plr_value / 100);
	}

	/**
	 * Writes calculated %ALBUMRATING%, '%ALBUMPLAYCOUNT%' and '%ALBUMPLAYCOUNTTOTAL%' values to music files via the Playlist context menu.
	 * - '%ALBUMRATING%': The calculated average album rating, converted from a 0-5 scale to a 0-100 scale due to Foobar2000's incompatibility with floating point numbers when sorting.
	 * - '%ALBUMPLAYCOUNT%': The calculated average playcount of the album.
	 * - '%ALBUMPLAYCOUNTTOTAL%': The calculated total playcount of all tracks on the album.
	 */
	write_album_stats_to_tags() {
		const metadata = this.get_metadata();
		const plItems = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
		const libItems = new FbMetadbHandleList(lib.pop.getHandleList('newItems'));
		const items = grm.ui.displayLibrary && !grm.ui.displayPlaylist || grm.ui.displayLibrarySplit() && grm.ui.state.mouse_x < grm.ui.ww * 0.5 ? libItems : plItems;
		const handleList = items === libItems ? libItems : plItems;

		if (!items || !items.Count) return;

		const albums = new Map();
		for (let i = 0; i < items.Count; i++) {
			const albumName = $('%album%', items[i]);
			if (!albums.has(albumName)) {
				albums.set(albumName, []);
			}
			albums.get(albumName).push(items[i]);
		}

		const albumUpdates = [];
		for (const [albumName, items] of albums.entries()) {
			const metadataEntry = metadata.get(albumName);
			if (metadataEntry) {
				const { albumAverageRating, albumAveragePlaycount, albumTotalPlaycount } = metadataEntry;

				if (albumAverageRating || albumAveragePlaycount || albumTotalPlaycount) {
					const albumStats = {};
					if (albumAverageRating) {
						// Convert albumAverageRating floating point number from scale 0-5 to an integer on scale 0-100.
						// Foobar2000 does not handle floating point numbers well in its metadata fields when sorting,
						// so we store the ratings as integers to ensure they are processed correctly.
						const convertedRating = Math.round(albumAverageRating * 20);
						albumStats.ALBUMRATING = convertedRating;
					}
					if (albumAveragePlaycount || albumTotalPlaycount) {
						albumStats.ALBUMPLAYCOUNT = albumAveragePlaycount;
						albumStats.ALBUMPLAYCOUNTTOTAL = albumTotalPlaycount;
					}

					for (const item of items) {
						albumUpdates.push(albumStats);
					}
				}
			}
		}

		if (albumUpdates.length) {
			handleList.UpdateFileInfoFromJSON(JSON.stringify(albumUpdates));
		}
	}

	/**
	 * Writes various statistics for the current playlist to a text file.
	 * @param {Array<object>} metadata - The metadata array of objects with properties depending on metadataType.
	 * @param {string} metadataType - The type of metadata: 'album', 'track', 'topRated', or 'topPlayed'.
	 * @param {string} filePath - The path to the text file where statistics will be written.
	 * @param {string} statsName - The name of the statistic type.
	 * @param {string} statsType - The statistic type to be used for sorting.
	 * @param {string} ratingType - The rating type, one of 'albumAverage', 'albumTotal', or 'albumTracks'.
	 * @param {string} playcountType - The playcount type, one of 'albumAverage', 'albumTotal', or 'albumTracks'.
	 * @returns {boolean} True if writing to the text file was successful, false otherwise.
	 */
	write_stats_to_text_file(metadata, metadataType, filePath, statsName, statsType, ratingType, playcountType) {
		const includeArtist  = plSet.playlist_stats_include_artist;
		const includeAlbum   = plSet.playlist_stats_include_album;
		const includeTrack   = plSet.playlist_stats_include_track;
		const includeYear    = plSet.playlist_stats_include_year;
		const includeGenre   = plSet.playlist_stats_include_genre;
		const includeLabel   = plSet.playlist_stats_include_label;
		const includeCountry = plSet.playlist_stats_include_country;
		const includeStats   = plSet.playlist_stats_include_stats;

		const metadataStats = this._get_metadata_stats(metadata);
		const playlistStats = includeStats ? this._write_stats_total_top_stats(metadataStats, statsType, metadataType) : '\n';
		const playlistName  = plman.GetPlaylistName(plman.ActivePlaylist);
		const playlistTitle = `${playlistName} - ${statsName} statistics${metadataType.startsWith('top') ? '' : ` - sorted by ${statsType}`}`;
		const playlistData  = `${WriteFancyHeader(playlistTitle)}\n\n${playlistStats}`;

		const sortFunction = this._write_stats_get_sorting(statsType);

		// * Albums
		const albumMetadataSorted = sortFunction ? metadata.sort(sortFunction) : metadata;
		const albumMetadata = albumMetadataSorted.map((metadata) => {
			const separator = includeArtist && includeAlbum ? ' - ' : '';
			const artist = includeArtist ? metadata.artist ? `${metadata.artist}${separator}` : 'NO ARTIST' : '';
			const album = includeAlbum ? metadata.album ? `${metadata.album}` : 'NO ALBUM' : '';
			const albumTracksRating = includeTrack && metadata.tracks ? `\n${metadata.tracks.map(trackRating => ` ${trackRating.trackNumber}. ${trackRating.title}${includeStats ? `: ${trackRating.rating}` : ''}`).join('\n')}` : '';
			const albumTracksPlaycount = includeTrack && metadata.tracks ? `\n${metadata.tracks.map(trackPlaycount => ` ${trackPlaycount.trackNumber}. ${trackPlaycount.title}${includeStats ? `: ${trackPlaycount.playcount}` : ''}`).join('\n')}` : '';
			const year = includeYear ? metadata.year ? `${metadata.year}` : 'NO YEAR' : '';
			const genre = includeGenre ? metadata.genre && metadata.genre.trim() !== '' && metadata.genre.trim() !== '?' ? `${metadata.genre}` : 'NO GENRE' : '';
			const label = includeLabel ? metadata.label ? `${metadata.label}` : 'NO LABEL' : '';
			const country = includeCountry ? metadata.country ? `${metadata.country}` : 'NO COUNTRY' : '';
			const includeParts = [year, genre, label, country].filter(part => part !== '');
			const include = includeParts.length > 0 ? ` (${includeParts.join(' \u00B7 ')})` : '';

			const ratingTypeMeta = {
				albumAverage: includeStats && metadata.albumAverageRating,
				albumTotal: includeStats && metadata.albumTotalRating,
				albumTracks: albumTracksRating
			};
			const rating = `: ${ratingTypeMeta[ratingType]}`;
			const ratingAvg = includeStats ? `: ${metadata.albumAverageRating}` : '';

			const playcountTypeMeta = {
				albumAverage: includeStats && metadata.albumAveragePlaycount,
				albumTotal: includeStats && metadata.albumTotalPlaycount,
				albumTracks: albumTracksPlaycount
			};
			const playcount = `: ${playcountTypeMeta[playcountType]}`;
			const playcountAvg = includeStats ? `: ${metadata.albumAveragePlaycount}` : '';

			if (ratingType) {
				return ratingType === 'albumTracks' ?
					`${artist}${album}${include}${ratingAvg}${rating}\n` :
					`${artist}${album}${include}${rating}`;
			}
			else if (playcountType) {
				return playcountType === 'albumTracks' ?
					`${artist}${album}${include}${playcountAvg}${playcount}\n` :
					`${artist}${album}${include}${playcount}`;
			}
			else {
				return `${artist}${album}${include}`;
			}
		}).join('\n');

		// * Tracks
		const trackMetadataMap = metadata.flatMap(album =>
			album.tracks.map(track => ({
				artist: album.artist,
				album: album.album,
				trackNumber: track.trackNumber,
				track: track.title,
				year: album.year,
				genre: album.genre,
				label: album.label,
				country: album.country,
				rating: track.rating,
				playcount: track.playcount
			}))
		);

		const trackMetadataSorted = sortFunction ? trackMetadataMap.sort(sortFunction) : trackMetadataMap;
		const trackMetadata = trackMetadataSorted.map((trackData) => {
			const track = includeTrack ? (trackData.trackNumber && trackData.track ? `${trackData.trackNumber}. ${trackData.track}` : 'NO TRACK') : '';
			const album = includeAlbum ? (trackData.album && trackData.album.trim() !== '' ? `${trackData.album}` : 'NO ALBUM') : '';
			const artist = includeArtist ? (trackData.artist && trackData.artist.trim() !== '' ? `${trackData.artist}` : 'NO ARTIST') : '';
			const year = includeYear ? (trackData.year && trackData.year.trim() !== '' && trackData.year.trim() !== '?' ? `${trackData.year}` : 'NO YEAR') : '';
			const genre = includeGenre ? (trackData.genre && trackData.genre.trim() !== '' && trackData.genre.trim() !== '?' ? `${trackData.genre}` : 'NO GENRE') : '';
			const label = includeLabel ? (trackData.label && trackData.label.trim() !== '' && trackData.label.trim() !== '?' ? `${trackData.label}` : 'NO LABEL') : '';
			const country = includeCountry ? (trackData.country && trackData.country.trim() !== '' && trackData.country.trim() !== '?' ? `${trackData.country}` : 'NO COUNTRY') : '';
			const includeParts = [year, genre, label, country].filter(part => part !== '');
			const include = includeParts.length > 0 ? ` (${includeParts.join(' \u00B7 ')})` : '';
			const rating = includeStats ? `: ${trackData.rating}` : '';
			const playcount = includeStats ? `: ${trackData.playcount}` : '';
			const separator1 = includeTrack && includeAlbum ? ' - ' : '';
			const separator2 = includeAlbum && includeArtist || includeTrack && includeArtist ? ' - ' : '';

			return `${track}${separator1}${album}${include}${separator2}${artist}${this._write_stats_choose_statistic_by_type(statsType, rating, playcount)}`;
		}).join('\n');

		// * Write the data to text file
		const data = playlistData + (
			metadataType === 'track' ? trackMetadata :
			metadataType === 'album' ? albumMetadata :
			metadataType === 'topRated' ? this._write_stats_top_list(metadata, true, false) :
			metadataType === 'topPlayed' ? this._write_stats_top_list(metadata, false, true) : ''
		);

		return Save(filePath, data);
	}
	// #endregion
}


//////////////////////////
// * KEYBOARD HANDLER * //
//////////////////////////
/**
 * A class that handles key action events to determine whether a key is pressed.
 */
class PlaylistKeyActionHandler {
	/**
	 * Creates the `PlaylistKeyActionHandler` instance.
	 * The actions registry is an object that maps keys to their respective action callbacks.
	 */
	constructor() {
		/** @private @type {{[key: string]: Function}} */
		this.actions = {};
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Registers a key action.
	 * @param {string|number} key - The key to register.
	 * @param {Function} action_callback - The callback to run when the key is pressed.
	 * @throws {ArgumentError} If the action callback is not a function.
	 * @throws {ArgumentError} If the key is already used.
	 */
	register_key_action(key, action_callback) {
		if (!action_callback) {
			throw new ArgumentError('action_callback', action_callback);
		}

		if (this.actions[key]) {
			throw new ArgumentError('key', key.toString(), 'This key is already used');
		}

		this.actions[key] = action_callback;
	}

	/**
	 * Invokes a key action.
	 * @param {string} key - The key to invoke.
	 * @param {object} [key_modifiers] - The modifiers for the key passed to key action callback.
	 * @param {boolean} [key_modifiers.ctrl] - The option to disable the CTRL key.
	 * @param {boolean} [key_modifiers.alt] - The option to disable the ALT key.
	 * @param {boolean} [key_modifiers.shift] - The option to disable the SHIFT key.
	 * @returns {boolean} True or false.
	 */
	invoke_key_action(key, key_modifiers) {
		const key_action = this.actions[key];
		if (!this.actions[key]) {
			return false;
		}

		key_action(key_modifiers || {});

		return true;
	}
	// #endregion
}


///////////////////////////
// * SELECTION HANDLER * //
///////////////////////////
/**
 * A class that handles selection and manipulation of playlist items.
 */
class PlaylistSelectionHandler {
	/**
	 * Creates the `PlaylistSelectionHandler` instance.
	 * @param {PlaylistContent} cnt_arg - The playlist content.
	 * @param {number} cur_playlist_idx_arg - The current playlist index.
	 */
	constructor(cnt_arg, cur_playlist_idx_arg) {
		/** @private @constant @type {PlaylistContentNavigation} */
		this.cnt_helper = cnt_arg.helper;
		/** @private @constant @type {Array<PlaylistRow>} */
		this.rows = cnt_arg.rows;

		/** @private @constant @type {number} */
		this.cur_playlist_idx = cur_playlist_idx_arg;
		/** @private @type {Array<number>} */
		this.selected_indexes = [];
		/** @private @type {?number} */
		this.last_single_selected_index = undefined;

		/** @public @type {boolean} */
		this.dragging = false;
		/** @public @type {boolean} */
		this.internal_drag_n_drop_active = false;
		/** @public @type {?PlaylistRow} */
		this.last_hover_row = undefined;

		/**
		 * Sorts an array of numbers in ascending order.
		 * @param {number} a - The first number to compare.
		 * @param {number} b - The second number to compare.
		 * @returns {number} The difference between `a` and `b`.
		 */
		this.numeric_ascending_sort = (a, b) => (a - b);

		/**
		 * Checks if two arrays are equal in terms of length and the values at each index.
		 * @param {Array} a - The first array.
		 * @param {Array} b - The second array.
		 * @returns {boolean} True if the arrays are equal, false otherwise.
		 */
		this.arraysEqual = (a, b) => {
			if (a === b) return true;
			if (a == null || b == null || a.length !== b.length) return false;

			for (let i = 0; i < a.length; ++i) {
				if (a[i] !== b[i]) return false;
			}
			return true;
		};

		this.initialize_selection();
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Updates the selection state of the playlist according to the given header.
	 * @param {PlaylistBaseHeader} header - The header to update the selection state for.
	 * @param {boolean} ctrl_pressed - Whether or not the Ctrl key is pressed.
	 * @param {boolean} shift_pressed - Whether or not the Shift key is pressed.
	 * @private
	 */
	_update_selection_with_header(header, ctrl_pressed, shift_pressed) {
		const row_indexes = header.get_row_indexes();

		if (shift_pressed) {
			this.selected_indexes = Union(this._get_shift_selection(row_indexes[0]), row_indexes);
		}
		else {
			if (ctrl_pressed) {
				const is_selected = Difference(row_indexes, this.selected_indexes).length === 0;
				if (is_selected) {
					this.clear_selection();
				}
				else {
					this.selected_indexes = Union(this.selected_indexes, row_indexes);
				}
			}
			else {
				this.selected_indexes = row_indexes;
			}
			this.last_single_selected_index = row_indexes[0];
		}

		plman.ClearPlaylistSelection(this.cur_playlist_idx);
		plman.SetPlaylistSelection(this.cur_playlist_idx, this.selected_indexes, true);
		if (row_indexes.length) {
			plman.SetPlaylistFocusItem(this.cur_playlist_idx, row_indexes[0]);
		}
	}

	/**
	 * Updates the selection state of the playlist according to the given row.
	 * @param {PlaylistRow} row - The row to update the selection state for.
	 * @param {boolean} ctrl_pressed - Whether or not the Ctrl key is pressed.
	 * @param {boolean} shift_pressed - Whether or not the Shift key is pressed.
	 * @private
	 */
	_update_selection_with_row(row, ctrl_pressed, shift_pressed) {
		if (shift_pressed) {
			this.selected_indexes = this._get_shift_selection(row.idx);

			// plman.ClearPlaylistSelection(this.cur_playlist_idx); // * Disabled to enable contiguous Ctrl+shift selection
			plman.SetPlaylistSelection(this.cur_playlist_idx, this.selected_indexes, true);
		}
		else if (ctrl_pressed) {
			const is_selected = this.selected_indexes.find((idx) => row.idx === idx);

			if (is_selected) {
				this.selected_indexes = this.selected_indexes.filter(idx => idx !== row.idx);
			}
			else {
				this.selected_indexes.push(row.idx);
			}

			this.last_single_selected_index = row.idx;

			plman.SetPlaylistSelectionSingle(this.cur_playlist_idx, row.idx, !is_selected);
		}
		else {
			this.selected_indexes.push(row.idx);
			this.last_single_selected_index = row.idx;

			plman.ClearPlaylistSelection(this.cur_playlist_idx);
			plman.SetPlaylistSelectionSingle(this.cur_playlist_idx, row.idx, true);
		}

		plman.SetPlaylistFocusItem(this.cur_playlist_idx, row.idx);
	}

	/**
	 * Gets the indexes of the rows that should be selected when the Shift key is pressed.
	 * @param {number} selected_idx - The index of the row that was selected.
	 * @returns {Range} The range of indexes that should be selected.
	 * @private
	 */
	_get_shift_selection(selected_idx) {
		let a = 0;
		let b = 0;

		if (this.last_single_selected_index == null) {
			this.last_single_selected_index = plman.GetPlaylistFocusItemIndex(this.cur_playlist_idx);
			if (this.last_single_selected_index === -1) {
				this.last_single_selected_index = 0;
			}
		}

		if (this.cnt_helper.is_item_visible(this.rows[this.last_single_selected_index])) {
			if (this.last_single_selected_index < selected_idx) {
				a = this.last_single_selected_index;
				b = selected_idx;
			}
			else {
				a = selected_idx;
				b = this.last_single_selected_index;
			}
		}
		else {
			const last_selected_header = this.cnt_helper.get_visible_parent(this.rows[this.last_single_selected_index]);
			if (this.last_single_selected_index < selected_idx) {
				a = last_selected_header.get_row_indexes()[0];
				b = selected_idx;
			}
			else {
				a = selected_idx;
				b = Last(last_selected_header.get_row_indexes());
			}
		}

		return Range(a, b + 1);
	}

	/**
	 * Checks if the selection is contiguous.
	 * @returns {boolean} True or false.
	 * @private
	 */
	_is_selection_contiguous() {
		for (let i = 1; i < this.selected_indexes.length; i++) {
			if (this.selected_indexes[i] - this.selected_indexes[i - 1] !== 1) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Moves the selection to the given index.
	 * @param {number} new_idx - The new index of the selection.
	 * @private
	 */
	_move_selection(new_idx) {
		plman.UndoBackup(this.cur_playlist_idx);
		let move_delta;

		if (this._is_selection_contiguous()) {
			const focus_idx = plman.GetPlaylistFocusItemIndex(this.cur_playlist_idx);

			move_delta = new_idx < focus_idx ? -(this.selected_indexes[0] - new_idx) : new_idx - (Last(this.selected_indexes) + 1);
		}
		else {
			const item_count_before_drop_idx = this.selected_indexes.filter(idx => idx < new_idx).length;

			move_delta = -(plman.PlaylistItemCount(this.cur_playlist_idx) - this.selected_indexes.length - (new_idx - item_count_before_drop_idx));

			// Move to the end to make it contiguous, then back to drop_idx
			plman.MovePlaylistSelection(this.cur_playlist_idx, plman.PlaylistItemCount(this.cur_playlist_idx));
		}
		plman.MovePlaylistSelection(this.cur_playlist_idx, move_delta);
	}

	/**
	 * Clears the last hover row.
	 * @private
	 */
	_clear_last_hover_row() {
		if (!this.last_hover_row) return;
		this.last_hover_row.is_drop_bottom_selected = false;
		this.last_hover_row.is_drop_top_selected = false;
		this.last_hover_row.is_drop_boundary_reached = false;
		this.last_hover_row.repaint();
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Initializes the selection state.
	 */
	initialize_selection() {
		this.selected_indexes = [];
		let i = 0;
		for (const item of this.rows) {
			if (plman.IsPlaylistItemSelected(this.cur_playlist_idx, item.idx)) {
				this.selected_indexes.push(i);
			}
			i++;
		}
	}

	/**
	 * Updates the selection state.
	 * @param {PlaylistRow|PlaylistBaseHeader} item - The item to update the selection state for.
	 * @param {boolean} [ctrl_pressed] - Whether CTRL key is pressed.
	 * @param {boolean} [shift_pressed] - Whether SHIFT key is pressed.
	 */
	update_selection(item, ctrl_pressed, shift_pressed) {
		if (!item) {
			return;
		}
		Assert(item != null, LogicError, 'update_selection was called with undefined item');

		if (!ctrl_pressed && !shift_pressed) {
			this.selected_indexes = [];
			this.last_single_selected_index = undefined;
		}

		const visible_item = this.cnt_helper.is_item_visible(item) ? item : this.cnt_helper.get_visible_parent(item);
		if (visible_item instanceof PlaylistBaseHeader) {
			this._update_selection_with_header(visible_item, ctrl_pressed, shift_pressed);
		}
		else {
			this._update_selection_with_row(/** @type {PlaylistRow}*/ visible_item, ctrl_pressed, shift_pressed);
		}

		this.selected_indexes.sort(this.numeric_ascending_sort);
	}

	/**
	 * Moves the selection up one row.
	 */
	move_selection_up() {
		if (!this.selected_indexes.length) {
			return;
		}

		this._move_selection(Math.max(0, this.selected_indexes[0] - 1));
	}

	/**
	 * Moves the selection down one row.
	 */
	move_selection_down() {
		if (!this.selected_indexes.length) {
			return;
		}

		this._move_selection(Math.min(this.rows.length, Last(this.selected_indexes) + 2));
	}

	/**
	 * Selects all playlist items.
	 */
	select_all() {
		if (!this.rows.length) {
			return;
		}

		this.selected_indexes = Range(this.rows[0].idx, Last(this.rows).idx + 1);
		this.last_single_selected_index = this.rows[0].idx;

		plman.SetPlaylistSelection(this.cur_playlist_idx, this.selected_indexes, true);
	}

	/**
	 * Clears current selection on the playlist item.
	 */
	clear_selection() {
		if (!this.selected_indexes.length) {
			return;
		}
		this.selected_indexes = [];
		this.last_single_selected_index = undefined;
		plman.ClearPlaylistSelection(this.cur_playlist_idx);
	}

	/**
	 * Gets the indexes of selected playlist items.
	 * @returns {number} The indexes of the selected items.
	 */
	get_selected_items() {
		return this.selected_indexes;
	}

	/**
	 * Whether there are any selected playlist items.
	 * @returns {boolean} True if any items are selected.
	 */
	has_selected_items() {
		return !!this.selected_indexes.length;
	}

	/**
	 * Gets the total number of selected playlist items.
	 * @returns {number} The number of selected items.
	 */
	selected_items_count() {
		return this.selected_indexes.length;
	}

	/**
	 * Performs internal drag and drop of the selected playlist items inside the panel, i.e when reordering.
	 */
	perform_internal_drag_n_drop() {
		this.enable_drag();
		this.internal_drag_n_drop_active = true;

		const cur_playlist_size = plman.PlaylistItemCount(this.cur_playlist_idx);
		const cur_playlist_selection = plman.GetPlaylistSelectedItems(this.cur_playlist_idx);
		const cur_selected_indexes = this.selected_indexes;

		const effect = fb.DoDragDrop(window.ID, cur_playlist_selection, PlaylistDropEffect.copy | PlaylistDropEffect.move | PlaylistDropEffect.link);

		this.internal_drag_n_drop_active = false;

		if (this.dragging) {
			// If drag operation was not cancelled, then it means that nor on_drag_drop, nor on_drag_leave event handlers
			// were triggered, which means that the items were most likely dropped inside the panel
			// (and relevant methods were not called because of async event processing)
			return;
		}

		/**
		 * Checks if the playlist is in the same state and if the selected indexes are equal.
		 * This is necessary to ensure that we can handle the 'move drop' properly.
		 * @returns {boolean} True or false.
		 */
		const can_handle_move_drop = function() {
			// We can handle the 'move drop' properly only when playlist is still in the same state
			return cur_playlist_size === plman.PlaylistItemCount(this.cur_playlist_idx)
				&& this.arraysEqual(cur_selected_indexes, this.selected_indexes);
		};

		if (PlaylistDropEffect.none === effect && can_handle_move_drop()) {
			// DROPEFFECT_NONE needs special handling, because on NT it
			// is returned for some move operations, instead of DROPEFFECT_MOVE.
			// See Q182219 for the details.

			const items_to_remove = [];
			const playlist_items = plman.GetPlaylistItems(this.cur_playlist_idx);
			for (const idx of cur_selected_indexes) {
				const cur_item = playlist_items[idx];
				if (cur_item.RawPath.startsWith('file://') && !fso.FileExists(cur_item.Path)) {
					items_to_remove.push(idx);
				}
			}

			if (items_to_remove.length) {
				plman.ClearPlaylistSelection(this.cur_playlist_idx);
				plman.SetPlaylistSelection(this.cur_playlist_idx, items_to_remove, true);
				plman.RemovePlaylistSelection(this.cur_playlist_idx);
			}
		}
		else if (PlaylistDropEffect.move === effect && can_handle_move_drop()) {
			plman.RemovePlaylistSelection(this.cur_playlist_idx);
		}
	}

	/**
	 * Enables dragging.
	 */
	enable_drag() {
		this._clear_last_hover_row();
		this.dragging = true;
	}

	/**
	 * Disables dragging.
	 */
	disable_drag() {
		this._clear_last_hover_row();
		this.dragging = false;
	}

	/**
	 * Enables external dragging.
	 */
	enable_external_drag() {
		this.enable_drag();
		this.internal_drag_n_drop_active = false;
	}

	/**
	 * Checks whether dragging is active.
	 * @returns {boolean} True or false.
	 */
	is_dragging() {
		return this.dragging;
	}

	/**
	 * Checks whether the internal drag and drop is active.
	 * @returns {boolean} True or false.
	 */
	is_internal_drag_n_drop_active() {
		return this.internal_drag_n_drop_active;
	}

	/**
	 * Updates the hover row's drop state, also calls repaint.
	 * @param {?PlaylistRow} hover_row - The hover row.
	 * @param {boolean} is_above - Whether the hover row is above the dragged item.
	 */
	drag(hover_row, is_above) {
		if (hover_row == null) {
			this._clear_last_hover_row();
			return;
		}

		if (plman.IsPlaylistLocked(this.cur_playlist_idx)) {
			return;
		}

		let is_drop_top_selected = is_above;
		let is_drop_bottom_selected = !is_above;
		const is_drop_boundary_reached = hover_row.idx === 0 || (!is_above && hover_row.idx === this.rows.length - 1);

		if (this.internal_drag_n_drop_active && !utils.IsKeyPressed(VK_CONTROL)) {
			// Can't move selected item on itself
			const is_item_above_selected = hover_row.idx !== 0 && this.rows[hover_row.idx - 1].is_selected();
			const is_item_below_selected = hover_row.idx !== (this.rows.length - 1) && this.rows[hover_row.idx + 1].is_selected();
			is_drop_top_selected = is_drop_top_selected && !hover_row.is_selected() && !is_item_above_selected;
			is_drop_bottom_selected = is_drop_bottom_selected && !hover_row.is_selected() && !is_item_below_selected;
		}

		let needs_repaint = false;
		if (this.last_hover_row) {
			if (this.last_hover_row.idx === hover_row.idx) {
				needs_repaint = this.last_hover_row.is_drop_top_selected !== is_drop_top_selected
					|| this.last_hover_row.is_drop_bottom_selected !== is_drop_bottom_selected
					|| this.last_hover_row.is_drop_boundary_reached !== is_drop_boundary_reached;
			}
			else {
				this._clear_last_hover_row();
				needs_repaint = true;
			}
		}
		else {
			needs_repaint = true;
		}

		hover_row.is_drop_top_selected = is_drop_top_selected;
		hover_row.is_drop_bottom_selected = is_drop_bottom_selected;
		hover_row.is_drop_boundary_reached = is_drop_boundary_reached;

		if (needs_repaint) {
			hover_row.repaint();
		}

		this.last_hover_row = hover_row;
	}

	/**
	 * Checks whether the playlist is in a state where it can accept a drop.
	 * @returns {boolean} True or false.
	 */
	can_drop() {
		let playlistIndex = false;
		return () => {
			if (plman.PlaylistCount > 0 && this.cur_playlist_idx >= 0 && this.cur_playlist_idx < plman.PlaylistCount && !plman.IsPlaylistLocked(this.cur_playlist_idx)) {
				return true;
			} else {
				if (!playlistIndex) { // If no playlist exists, create a new one.
					const playlist_idx = plman.CreatePlaylist(0, 'Default');
					plman.ActivePlaylist = playlist_idx;
					playlistIndex = true;
				}
				return false;
			}
		};
	}

	/**
	 * Handles a drop event.
	 * @param {boolean} copy_selection - Whether to copy the selection instead of moving it.
	 */
	drop(copy_selection) {
		if (!this.dragging) {
			return;
		}

		this.dragging = false;
		if (!this.selected_indexes.length || !this.last_hover_row) {
			return;
		}

		if (!this.last_hover_row.is_drop_top_selected && !this.last_hover_row.is_drop_bottom_selected) {
			this._clear_last_hover_row();
			return;
		}

		let drop_idx = this.last_hover_row.idx;
		if (this.last_hover_row.is_drop_bottom_selected) {
			++drop_idx;
		}

		this._clear_last_hover_row();

		if (!copy_selection) {
			this._move_selection(drop_idx);
		}
		else {
			plman.UndoBackup(this.cur_playlist_idx);

			const cur_selection = plman.GetPlaylistSelectedItems(this.cur_playlist_idx);
			plman.ClearPlaylistSelection(this.cur_playlist_idx);
			plman.InsertPlaylistItems(this.cur_playlist_idx, drop_idx, cur_selection, true);
			plman.SetPlaylistFocusItem(this.cur_playlist_idx, drop_idx);
		}
	}

	/**
	 * Handles external drag and drop.
	 * @param {DropTargetAction} action - The drag and drop action.
	 */
	external_drop(action) {
		plman.ClearPlaylistSelection(this.cur_playlist_idx);

		let playlist_idx;
		if (!plman.PlaylistCount) {
			playlist_idx = plman.CreatePlaylist(0, 'Default');
			plman.ActivePlaylist = playlist_idx;
		}
		else {
			playlist_idx = this.cur_playlist_idx;
			plman.UndoBackup(this.cur_playlist_idx);
		}

		action.Playlist = playlist_idx;
		action.ToSelect = true;

		if (this.last_hover_row) {
			let drop_idx = this.last_hover_row.idx;
			if (this.last_hover_row.is_drop_bottom_selected) {
				++drop_idx;
			}
			action.Base = drop_idx;
		}
		else {
			action.Base = plman.PlaylistCount;
		}

		this.disable_drag();
	}

	/**
	 * Copies the selected playlist items to the clipboard.
	 * @returns {void}
	 */
	copy() {
		if (!this.selected_indexes.length) {
			return fb.CreateHandleList();
		}

		const selected_items = plman.GetPlaylistSelectedItems(this.cur_playlist_idx);
		fb.CopyHandleListToClipboard(selected_items);
	}

	/**
	 * Cuts the selected playlist items to the clipboard.
	 * @returns {void}
	 */
	cut() {
		if (!this.selected_indexes.length) {
			return fb.CreateHandleList();
		}

		const selected_items = plman.GetPlaylistSelectedItems(this.cur_playlist_idx);

		if (fb.CopyHandleListToClipboard(selected_items)) {
			plman.UndoBackup(this.cur_playlist_idx);
			plman.RemovePlaylistSelection(this.cur_playlist_idx);
		}
	}

	/**
	 * Pastes the contents of the clipboard to the playlist.
	 */
	paste() {
		if (!fb.CheckClipboardContents()) {
			return;
		}

		const metadb_list = fb.GetClipboardContents(window.ID);
		if (!metadb_list || !metadb_list.Count) {
			return;
		}

		let insert_idx;
		if (this.selected_indexes.length) {
			insert_idx = this._is_selection_contiguous() ? Last(this.selected_indexes) + 1 : plman.GetPlaylistFocusItemIndex(this.cur_playlist_idx) + 1;
		}
		else {
			const focused_idx = plman.GetPlaylistFocusItemIndex(this.cur_playlist_idx);
			insert_idx = (focused_idx !== -1) ? (focused_idx + 1) : this.rows.length;
		}

		plman.UndoBackup(this.cur_playlist_idx);
		plman.ClearPlaylistSelection(this.cur_playlist_idx);
		plman.InsertPlaylistItems(this.cur_playlist_idx, insert_idx, metadb_list, true);
		plman.SetPlaylistFocusItem(this.cur_playlist_idx, insert_idx);
	}

	/**
	 * Sends the selected playlist items to the specified playlist.
	 * @param {number} playlist_idx - The current playlist index.
	 */
	send_to_playlist(playlist_idx) {
		plman.UndoBackup(playlist_idx);
		plman.ClearPlaylistSelection(playlist_idx);
		plman.InsertPlaylistItems(playlist_idx, plman.PlaylistItemCount(playlist_idx), plman.GetPlaylistSelectedItems(this.cur_playlist_idx), true);
	}
	// #endregion
}


//////////////////////////
// * COLLAPSE HANDLER * //
//////////////////////////
/**
 * A class that handles the folding of the playlist headers.
 */
class PlaylistCollapseHandler {
	/**
	 * Creates the `PlaylistCollapseHandler` instance.
	 * @param {PlaylistContent} cnt_arg - The playlist content instance.
	 */
	constructor(cnt_arg) {
		/** @private @type {object} */
		this.cnt_arg = cnt_arg;
		/** @private @type {boolean} */
		this.changed = false;
		/** @private @type {Array<PlaylistBaseHeader|PlaylistHeader>} */
		this.headers = cnt_arg.sub_items;
		/** @private @type {?Function} */
		this.on_collapse_change_callback = undefined;
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Sets the collapsed state of the header and all its sub-items recursively.
	 * @param {PlaylistBaseHeader} header - The header to set the collapsed state of.
	 * @param {boolean} is_collapsed - Whether the header should be collapsed or not.
	 * @returns {boolean} Whether the collapsed state of any header was changed.
	 * @private
	 */
	_set_collapsed_state_recursive(header, is_collapsed) {
		let changed = header.is_collapsed !== is_collapsed;
		header.is_collapsed = is_collapsed;

		const sub_items = header.sub_items;
		if (sub_items[0] instanceof PlaylistRow) {
			return changed;
		}

		for (const item of sub_items) {
			changed = this._set_collapsed_state_recursive(item, is_collapsed) || changed;
		}

		return changed;
	}

	/**
	 * Triggers the callback if the collapse state has changed.
	 * @private
	 */
	_trigger_callback() {
		if (this.changed && this.on_collapse_change_callback) {
			this.on_collapse_change_callback();
		}
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBILC METHODS
	/**
	 * Collapses a playlist item.
	 * @param {PlaylistBaseHeader} item - The item to collapse.
	 */
	collapse(item) {
		this.changed = this._set_collapsed_state_recursive(item, true);
		this._trigger_callback();
	}

	/**
	 * Collapses all playlist items.
	 */
	collapse_all() {
		this.changed = false;
		for (const item of this.headers) {
			this.changed = this._set_collapsed_state_recursive(item, true) || this.changed;
		}
		this._trigger_callback();
	}

	/**
	 * Collapses all playlist items except the now playing track.
	 */
	collapse_all_but_now_playing() {
		this.changed = false;
		for (const item of this.headers) {
			if (item.is_playing()) {
				this.changed = this._set_collapsed_state_recursive(item, false) || this.changed;
				continue;
			}
			this.changed = this._set_collapsed_state_recursive(item, true) || this.changed;
		}
		this._trigger_callback();
	}

	/**
	 * Toggles the collapse state of a playlist item.
	 * @param {PlaylistBaseHeader} item - The item to toggle.
	 */
	toggle_collapse(item) {
		this.changed = true;
		this._set_collapsed_state_recursive(item, !item.is_collapsed);
		this._trigger_callback();
	}

	/**
	 * Expands a playlist item.
	 * @param {PlaylistBaseHeader} item - The item to expand.
	 */
	expand(item) {
		this.changed = this._set_collapsed_state_recursive(item, false);
		this._trigger_callback();
	}

	/**
	 * Expands all playlist items.
	 */
	expand_all() {
		this.changed = false;
		for (const item of this.headers) {
			this.changed = this._set_collapsed_state_recursive(item, false) || this.changed;
		}
		this._trigger_callback();
	}

	/**
	 * Callback for when the content changes.
	 */
	on_content_change() {
		this.headers = this.cnt_arg.sub_items;
		this.changed = false;

		if (plSet.show_header && plSet.collapse_on_playlist_switch) {
			if (plSet.auto_collapse) {
				this.collapse_all_but_now_playing();
			}
			else {
				this.collapse_all();
			}
		}
	}

	/**
	 * Sets the callback that will be called when the collapse state of a playlist item changes.
	 * @param {Function} on_collapse_change_callback_arg - The callback.
	 */
	set_callback(on_collapse_change_callback_arg) {
		this.on_collapse_change_callback = on_collapse_change_callback_arg;
	}
	// #endregion
}


///////////////////////
// * QUEUE HANDLER * //
///////////////////////
/**
 * A class that handles the playback queue for a playlist by adding, removing, and checking the status of queued items.
 */
class PlaylistQueueHandler {
	/**
	 * Creates the `PlaylistQueueHandler` instance.
	 * @param {Array<PlaylistRow>} rows_arg - The initial set of playlist rows to be handled.
	 * @param {number} cur_playlist_idx_arg - The current index of the playlist being processed.
	 */
	constructor(rows_arg, cur_playlist_idx_arg) {
		/** @private @constant @type {number} */
		this.cur_playlist_idx = cur_playlist_idx_arg;
		/** @private @constant @type {Array<PlaylistRow>} */
		this.rows = rows_arg;
		/** @private @type {Array<PlaylistRow>} */
		this.queued_rows = [];

		this.initialize_queue();
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Resets the queue indexes and count for each item in the `queued_rows` array and clears the array.
	 * @private
	 */
	_reset_queued_status() {
		if (!this.queued_rows.length) {
			return;
		}

		for (const item of this.queued_rows) {
			item.queue_indexes = undefined;
			item.queue_idx_count = 0;
		}

		this.queued_rows = [];
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Initializes the playback queue contents and adding the queued items to the appropriate rows.
	 */
	initialize_queue() {
		if (this.queued_rows.length) {
			this._reset_queued_status();
		}

		const queue_contents = plman.GetPlaybackQueueContents();
		if (!queue_contents.length) {
			return;
		}

		let i = 0;
		for (const queued_item of queue_contents) {
			if (queued_item.PlaylistIndex !== this.cur_playlist_idx || queued_item.PlaylistItemIndex === -1) {
				continue;
			}

			const cur_queued_row = this.rows[queued_item.PlaylistItemIndex];
			if (!cur_queued_row) continue;
			const has_row = this.queued_rows.find(queued_row => queued_row.idx === cur_queued_row.idx);

			if (!has_row) {
				cur_queued_row.queue_indexes = [i + 1];
				cur_queued_row.queue_idx_count = 1;
			}
			else {
				cur_queued_row.queue_indexes.push(i + 1);
				cur_queued_row.queue_idx_count++;
			}

			this.queued_rows.push(cur_queued_row);
			i++;
		}
	}

	/**
	 * Checks if there are any playlist items in the playback queue.
	 * @returns {boolean} True or false.
	 */
	has_items() {
		return !!plman.GetPlaybackQueueHandles().Count;
	}

	/**
	 * Adds a playlist item to the playback queue.
	 * @param {PlaylistRow} row - The playlist row to add to the playback queue.
	 */
	add_row(row) {
		if (!row) return;

		plman.AddPlaylistItemToPlaybackQueue(this.cur_playlist_idx, row.idx);
	}

	/**
	 * Removes a row from the playback queue.
	 * @param {PlaylistRow} row - The playlist row to remove from the playback queue.
	 */
	remove_row(row) {
		if (!row) return;

		const idx = plman.FindPlaybackQueueItemIndex(row.metadb, this.cur_playlist_idx, row.idx);
		if (idx !== -1) {
			plman.RemoveItemFromPlaybackQueue(idx);
		}
	}

	/**
	 * Flushes the playback queue.
	 */
	flush() {
		plman.FlushPlaybackQueue();
	}
	// #endregion
}


//////////////////////////
// * GROUPING HANDLER * //
//////////////////////////
/**
 * A class that handles the grouping settings and behavior for playlists.
 */
class PlaylistGroupingHandler {
	/**
	 * Creates the `PlaylistGroupingHandler` instance.
	 */
	constructor() {
		/** @private @type {PlaylistGroupingSettings} */
		this.settings = new PlaylistGroupingSettings();
		/** @private @type {?Array<string>} */
		this.playlists = [];
		/** @private @type {string} */
		this.cur_playlist_name = '';
		/** @private @type {?PlaylistGroupingSettings} */
		this.cur_group = undefined;
		/** @private @type {?Array<string>} */
		this.group_by_name = undefined;

		this._initialize_name_to_preset_map();
		this._initialize_playlists();
		this._cleanup_settings();
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Initializes the list of playlists.
	 * @private
	 */
	_initialize_playlists() {
		this.playlists = [];
		const playlist_count = plman.PlaylistCount;
		for (let i = 0; i < playlist_count; ++i) {
			this.playlists.push(plman.GetPlaylistName(i));
		}
	}

	/**
	 * Initializes the map from group name to group object.
	 * @private
	 */
	_initialize_name_to_preset_map() {
		this.group_by_name = this.settings.group_presets.map((item) => item.name);
	}

	/**
	 * Opens the group presets manager dialog.
	 * @param {Function} on_execute_callback_fn - The function to call when the dialog is closed.
	 * @private
	 */
	_manage_groupings(on_execute_callback_fn) {
		const on_ok_fn = (ret_val_json) => {
			const ret_val = JSON.parse(ret_val_json);

			this.settings.group_presets = ret_val[0];
			this.settings.default_group_name = ret_val[2];
			this._initialize_name_to_preset_map();

			this.cur_group = this.settings.group_presets[this.group_by_name.indexOf(ret_val[1])];
			this.settings.playlist_group_data[this.cur_playlist_name] = ret_val[1];

			delete this.settings.playlist_custom_group_data[this.cur_playlist_name];

			this.settings.save();
			this.settings.send_sync();

			grCfg.config.addConfigurationObject(grDef.themePlaylistGroupingPresetsSchema, this.settings.group_presets);
			grCfg.config.writeConfiguration();

			on_execute_callback_fn();
		};

		const htmlCode = grm.utils.prepareHTML(`${fb.ProfilePath}georgia-reborn\\scripts\\playlist\\assets\\html\\GroupPresetsMngr.html`);
		utils.ShowHtmlDialog(window.ID, htmlCode, { width: 650, height: 425, data: [JSON.stringify([this.settings.group_presets, this.cur_group.name, this.settings.default_group_name]), on_ok_fn] });
	}

	/**
	 * Opens a dialog box that allows the user to enter a custom grouping query.
	 * The function also takes a callback function that is called when the user clicks the OK button.
	 * @param {Function} on_execute_callback_fn - The callback function to call when the user clicks the OK button.
	 * @private
	 */
	_request_user_query(on_execute_callback_fn) {
		const on_ok_fn = (ret_val) => {
			const groupHandlerSettings = new PlaylistGroupingSettings();
			const custom_group = groupHandlerSettings.group('user_defined', '', ret_val[0], ret_val[1]);
			this.cur_group = custom_group;

			this.settings.playlist_group_data[this.cur_playlist_name] = 'user_defined';
			this.settings.playlist_custom_group_data[this.cur_playlist_name] = custom_group;

			this.settings.save();
			this.settings.send_sync();

			on_execute_callback_fn();
		};

		const parsed_query = this.cur_group.name === 'user_defined' ? [this.cur_group.group_query, this.cur_group.title_query]	: ['', '[%album artist%]'];
		const htmlCode = grm.utils.prepareHTML(`${fb.ProfilePath}georgia-reborn\\scripts\\playlist\\assets\\html\\MsgBox.html`);
		utils.ShowHtmlDialog(window.ID, htmlCode, { width: 650, height: 425, data: ['Foobar2000: Group by', ['Grouping Query', 'Title Query'], parsed_query, on_ok_fn] });
	}

	/**
	 * Removes any playlists that are no longer present from the settings.
	 * @private
	 */
	_cleanup_settings() {
		for (const i in this.settings.playlist_group_data) {
			console.log(i);
			if (!this.playlists.includes(i)) {
				delete this.settings.playlist_group_data[i];
			}
		}

		for (const i in this.settings.playlist_custom_group_data) {
			if (!this.playlists.includes(i)) {
				delete this.settings.playlist_custom_group_data[i];
			}
		}

		this.settings.save();
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Sets the active playlist.
	 * @param {string} cur_playlist_name_arg - The name of the playlist to make active.
	 */
	set_active_playlist(cur_playlist_name_arg) {
		this.cur_playlist_name = cur_playlist_name_arg;
		let group_name = this.settings.playlist_group_data[this.cur_playlist_name];

		this.cur_group = null;
		if (group_name) {
			if (group_name === 'user_defined') {
				this.cur_group = this.settings.playlist_custom_group_data[this.cur_playlist_name];
			}
			else if (this.group_by_name.includes(group_name)) {
				this.cur_group = this.settings.group_presets[this.group_by_name.indexOf(group_name)];
			}

			if (!this.cur_group) {
				delete this.settings.playlist_group_data[this.cur_playlist_name];
				group_name = '';
			}
		}

		if (!this.cur_group) {
			group_name = this.settings.default_group_name;
			this.cur_group = this.settings.group_presets[this.group_by_name.indexOf(group_name)];
		}

		Assert(this.cur_group != null, ArgumentError, 'group_name', group_name);
	}

	/**
	 * Gets the query for the active playlist.
	 * @returns {string} The query for the active playlist.
	 */
	get_query() {
		return this.cur_group.group_query;
	}

	/**
	 * Gets the title query for the active playlist.
	 * @returns {string} The title query for the active playlist.
	 */
	get_title_query() {
		return this.cur_group.title_query;
	}

	/**
	 * Gets the sub-title query for the active playlist.
	 * @returns {string} The sub-title query for the active playlist.
	 */
	get_sub_title_query() {
		return this.cur_group.sub_title_query;
	}

	/**
	 * Gets the name of the current query.
	 * @returns {string} The name of the current query.
	 */
	get_query_name() {
		return this.cur_group.name;
	}

	/**
	 * Whether to show the disc for the current query.
	 * @returns {boolean} True or false.
	 */
	show_disc() {
		return this.cur_group.show_disc;
	}

	/**
	 * Whether to show the date for the current query.
	 * @returns {boolean} True or false.
	 */
	show_date() {
		return this.cur_group.show_date;
	}

	/**
	 * Appends the menu to the given parent menu.
	 * @param {ContextMenu} parent_menu - The parent menu to append to.
	 * @param {Function} on_execute_callback_fn - The callback function to call when an item is executed.
	 */
	append_menu_to(parent_menu, on_execute_callback_fn) {
		const group = new ContextMenu('Grouping');
		parent_menu.append(group);

		group.appendItem('Manage presets', () => {
			this._manage_groupings(on_execute_callback_fn);
		});

		group.separator();

		group.appendItem('Reset to default', () => {
			delete this.settings.playlist_custom_group_data[this.cur_playlist_name];
			delete this.settings.playlist_group_data[this.cur_playlist_name];

			this.cur_group = this.settings.group_presets[this.group_by_name.indexOf(this.settings.default_group_name)];

			this.settings.save();
			this.settings.send_sync();
			this.settings.load();

			grCfg.config.addConfigurationObject(grDef.themePlaylistGroupingPresetsSchema, grDef.themePlaylistGroupingPresets);
			grCfg.config.writeConfiguration();

			on_execute_callback_fn();
		});

		group.separator();

		let group_by_text = 'by...';
		if (this.cur_group.name === 'user_defined') {
			group_by_text += ` [${this.get_query()}]`;
		}
		group.appendItem(group_by_text, () => {
			this._request_user_query(on_execute_callback_fn);
		}, { is_radio_checked: this.cur_group.name === 'user_defined' });

		for (const group_item of this.settings.group_presets) {
			let group_by_text = group_item.description;
			if (group_item.name === this.settings.default_group_name) {
				group_by_text += ' [default]';
			}

			group.appendItem(group_by_text, () => {
				this.cur_group = group_item;

				delete this.settings.playlist_custom_group_data[this.cur_playlist_name];

				this.settings.playlist_group_data[this.cur_playlist_name] = group_item.name;
				this.settings.save();
				this.settings.send_sync();

				on_execute_callback_fn();
			}, { is_radio_checked: this.cur_group.name === group_item.name });
		}
	}

	/**
	 * Called when the sync state is changed.
	 * Updates the settings object with the new state and reinitializes the name to preset map.
	 * It also sets the active playlist to the current playlist name.
	 * @param {?} value - The new sync state.
	 */
	sync_state(value) {
		this.settings.receive_sync(value);
		this._initialize_name_to_preset_map();
		this.set_active_playlist(this.cur_playlist_name);
	}
	// #endregion

	// * CALLBACKS * //
	// #region CALLBACKS
	/**
	 * Callback for when the playlists have changed.
	 */
	on_playlists_changed() {
		const playlist_count = plman.PlaylistCount;
		const new_playlists = [];
		for (let i = 0; i < playlist_count; ++i) {
			new_playlists.push(plman.GetPlaylistName(i));
		}

		let save_needed = false;

		if (this.playlists.length > playlist_count) {
			// Removed

			const playlists_to_remove = Difference(this.playlists, new_playlists);
			for (const playlist_name of playlists_to_remove) {
				delete this.settings.playlist_group_data[playlist_name];
				delete this.settings.playlist_custom_group_data[playlist_name];
			}

			save_needed = true;
		}
		else if (this.playlists.length === playlist_count) {
			// May be renamed?

			const playlist_difference_new = Difference(new_playlists, this.playlists);
			const playlist_difference_old = Difference(this.playlists, new_playlists);
			if (playlist_difference_old.length === 1) {
				// playlist_difference_new.length > 0 and playlist_difference_old.length === 0 means that
				// playlists contained multiple items of the same name (one of which was changed)
				const old_name = playlist_difference_old[0];
				const new_name = playlist_difference_new[0];

				const group_name = this.settings.playlist_group_data[old_name];
				const custom_group = this.settings.playlist_custom_group_data[old_name];

				this.settings.playlist_group_data[new_name] = group_name;
				if (custom_group) {
					this.settings.playlist_custom_group_data[new_name] = custom_group;
				}

				delete this.settings.playlist_group_data[old_name];
				delete this.settings.playlist_custom_group_data[old_name];

				save_needed = true;
			}
		}

		this.playlists = new_playlists;
		if (save_needed) {
			this.settings.save();
		}
	}
	// #endregion
}


/**
 * A class that handles and manipulates settings related to grouping playlists.
 */
class PlaylistGroupingSettings {
	/**
	 * Creates the `PlaylistGroupingSettings` instance.
	 */
	constructor() {
		/**
		 * Reads the configuration from the `config` object and assigns it to the `prefs` variable.
		 * @public @type {ReturnType<typeof config.readConfiguration>}
		 */
		this.prefs = grCfg.config.readConfiguration();
		/**
		 * An object that maps playlist names to their group names.
		 * @public @type {{ [playlistName: string]: string }}
		 */
		this.playlist_group_data = {};
		/**
		 * An object that maps playlist names to their custom grouping settings.
		 * @public @type {{ [playlistName: string]: PlaylistGroupingSettings }}
		 */
		this.playlist_custom_group_data = {};
		/** @public @type {string} */
		this.default_group_name = '';
		/** @public @type {Array<PlaylistGroupingSettings>} */
		this.group_presets = [];

		this._fixup_pl_set();
		this.load();
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Checks and fixes the values of certain properties in the `plSet` object.
	 * @private
	 */
	_fixup_pl_set() {
		if (!plSet.playlist_group_data || !IsObject(JSON.parse(plSet.playlist_group_data))) {
			plSet.playlist_group_data = JSON.stringify({});
		}

		if (!plSet.playlist_custom_group_data || !IsObject(JSON.parse(plSet.playlist_custom_group_data))) {
			plSet.playlist_custom_group_data = JSON.stringify({});
		}

		if (!plSet.group_presets || !Array.isArray(JSON.parse(plSet.group_presets))) {
			plSet.group_presets = JSON.stringify([
				new PlaylistGroupingPreset('artist', 'by artist', '%album artist%', undefined, '', {}),
				new PlaylistGroupingPreset('artist_album', 'by artist / album', '%album artist%%album%', undefined, undefined, { show_date: true }),
				new PlaylistGroupingPreset('artist_album_disc', 'by artist / album / disc number', '%album artist%%album%%discnumber%', undefined, undefined, { show_date: true, show_disc: true }),
				new PlaylistGroupingPreset('artist_album_disc_edition', 'by artist / album / disc number / edition / codec', '%album artist%%album%%discnumber%%edition%%codec%', undefined, undefined, { show_date: true, show_disc: true }),
				new PlaylistGroupingPreset('path', 'by path', '$directory_path(%path%)', undefined, undefined, { show_date: true }),
				new PlaylistGroupingPreset('date', 'by date', '%date%', undefined, undefined, { show_date: true })
			]);
		}

		if (!plSet.default_group_name || !IsString(plSet.default_group_name)) {
			plSet.default_group_name = this.prefs.themePlaylistGroupingPresets[3].name || this.prefs.themePlaylistGroupingPresets[0].name || 'artist_album_disc_edition';
		}
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Loads settings from the properties object.
	 */
	load() {
		this.playlist_group_data = JSON.parse(plSet.playlist_group_data);
		this.playlist_custom_group_data = JSON.parse(plSet.playlist_custom_group_data);
		this.default_group_name = plSet.default_group_name;
		this.group_presets = this.prefs.themePlaylistGroupingPresets || JSON.parse(plSet.group_presets);
	}

	/**
	 * Saves settings to the properties object.
	 */
	save() {
		plSet.playlist_group_data = JSON.stringify(this.playlist_group_data);
		plSet.playlist_custom_group_data = JSON.stringify(this.playlist_custom_group_data);
		plSet.default_group_name = this.default_group_name;
		plSet.group_presets = JSON.stringify(this.group_presets);
	}

	/**
	 * Sends the sync data to the other clients.
	 */
	send_sync() {
		const syncData = {
			g_playlist_group_data:        plSet.playlist_group_data,
			g_playlist_custom_group_data: plSet.playlist_custom_group_data,
			g_default_group_name:         plSet.default_group_name,
			g_group_presets:              plSet.group_presets
		};

		window.NotifyOthers('sync_group_query_state', syncData);
	}

	/**
	 * Receives the sync data from the other clients.
	 * @param {{g_playlist_group_data, g_playlist_custom_group_data, g_default_group_name, g_group_presets}} settings_data - The sync data.
	 */
	receive_sync(settings_data) {
		plSet.playlist_group_data = settings_data.g_playlist_group_data;
		plSet.playlist_custom_group_data = settings_data.g_playlist_custom_group_data;
		plSet.default_group_name = settings_data.g_default_group_name;
		plSet.group_presets = settings_data.g_group_presets;

		this.load();
	}
	// #endregion
}


/**
 * A class that handles a grouping configuration for a playlist within the PlaylistGroupingSettings namespace.
 */
class PlaylistGroupingPreset {
	/**
	 * Creates the `PlaylistGroupingPreset` instance.
	 * @param {string} name - The name of the group.
	 * @param {string} description - A brief description of the group.
	 * @param {?string} [group_query] - The query used to group items within the playlist.
	 * @param {?string} [title_query] - The query used to generate the title for the group.
	 * @param {?string} [sub_title_query] - The query used to generate the subtitle for the group.
	 * @param {object} [options] - Additional options for the group.
	 * @param {boolean} [options.show_date] - A flag indicating whether to show the date within the group.
	 * @param {boolean} [options.show_disc] - A flag indicating whether to show disc information within the group.
	 */
	constructor(name, description, group_query = '', title_query = '[%album artist%]', sub_title_query = "[%album%[ '('%albumsubtitle%')']][ - '['%edition%']']", options = {}) {
		/** @public @type {string} */
		this.name = name;
		/** @public @type {string} */
		this.description = description;
		/** @public @type {string} */
		this.group_query = group_query;
		/** @public @type {string} */
		this.title_query = title_query;
		/** @public @type {string} */
		this.sub_title_query = sub_title_query;
		/** @public @type {boolean} */
		this.show_date = options.show_date || false;
		/** @public @type {boolean} */
		this.show_disc = options.show_disc || false;
	}
}
