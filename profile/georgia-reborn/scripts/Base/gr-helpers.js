/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Main Helpers                             * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    12-01-2026                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


/////////////
// * API * //
/////////////
/**
 * Prepares COM-ready track metadata from metadb handle(s), with fallback to selected items if null.
 * @global
 * @param {FbMetadbHandle|FbMetadbHandleList|null} metadb -
 *  - FbMetadbHandle: fb.GetNowPlaying() or fb.GetSelected();
 *  - FbMetadbHandleList: plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
 *  - null: defaults to plman.GetPlaylistSelectedItems(plman.ActivePlaylist).
 * @returns {Object} { handleList: FbMetadbHandleList, metadata: string[], artists: string[], albums: string[], titles: string[] }
 *  - metadata: Array of "path\u001Fsubsong" strings (e.g., "C:\\song.mp3\u001F0"), auto-marshaled to VT_ARRAY | VT_BSTR for COM.
 */
function GetMetadata(metadb) {
	const handleData = metadb || plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
	const handleList = new FbMetadbHandleList(handleData);
	const handleArray = handleList.Convert();
	const handleCount = handleArray.length;

	const metadata = new Array(handleCount);
	const artists = new Array(handleCount);
	const albums = new Array(handleCount);
	const titles = new Array(handleCount);

	const sep = Unicode.InformationSeparatorOne;
	const combinedTf = fb.TitleFormat(`%artist%${sep}%album%${sep}%title%`);

	for (let i = 0; i < handleCount; i++) {
		const handle = handleArray[i];
		const parts = combinedTf.EvalWithMetadb(handle).split(sep);
		metadata[i] = `${handle.Path}${sep}${handle.SubSong}`;
		artists[i] = parts[0] || "Unknown Artist";
		albums[i]  = parts[1] || "Unknown Album";
		titles[i]  = parts[2] || "Unknown Title";
	}

	return { handleList, metadata, artists, albums, titles };
}


/**
 * Starts full-track metrics analysis using GetFullTrackMetrics (batch retrieval).
 * @global
 * @param {FbMetadbHandle|FbMetadbHandleList|null} metadb - The metadb handle(s).
 * @param {number} [chunkDuration] - The optional chunk duration from 10-1000ms.
 * @returns {Promise<{success: boolean, metrics?: any}>}
 */
async function AWStartFullTrackMetricsBatch(metadb, chunkDuration = 200) {
	if (!AudioWizard || AudioWizard.FullTrackProcessing) {
		return { success: false };
	}

	console.log("Audio Wizard => Starting full-track metrics batch analysis...");

	try {
		const { handleList, metadata, artists, albums, titles } = GetMetadata(metadb);
		console.log(`Audio Wizard => Processing ${artists.length} track(s) via unified format`);

		return await new Promise((resolve) => {
			const onComplete = (success) => {
				try {
					console.log(`Audio Wizard => Batch metrics callback fired, success: ${success}`);

					if (!success) {
						console.log('Audio Wizard => No tracks selected, returning empty batch result');
						resolve({ success: false });
						return;
					}

					console.log("Audio Wizard => Batch metrics analysis complete!");

					const metricsPerTrack = 12;
					const metrics = AudioWizard.GetFullTrackMetrics();

					console.log(`Audio Wizard => Analyzed ${handleList.Count} track(s) with GetFullTrackMetrics:`);

					for (let i = 0; i < handleList.Count; i++) {
						const artist = artists[i];
						const album = albums[i];
						const title = titles[i];
						const offset = i * metricsPerTrack;

						console.log(`Audio Wizard => GetFullTrackMetrics => Track ${i + 1}: ${artist} - ${album} - ${title}`);
						console.log(`  M LUFS: ${metrics[offset + 0].toFixed(2)}`);
						console.log(`  S LUFS: ${metrics[offset + 1].toFixed(2)}`);
						console.log(`  I LUFS: ${metrics[offset + 2].toFixed(2)}`);
						console.log(`  RMS: ${metrics[offset + 3].toFixed(2)}`);
						console.log(`  Sample Peak: ${metrics[offset + 4].toFixed(2)}`);
						console.log(`  True Peak: ${metrics[offset + 5].toFixed(2)}`);
						console.log(`  PSR: ${metrics[offset + 6].toFixed(2)}`);
						console.log(`  PLR: ${metrics[offset + 7].toFixed(2)}`);
						console.log(`  CF: ${metrics[offset + 8].toFixed(2)}`);
						console.log(`  LRA: ${metrics[offset + 9].toFixed(2)}`);
						console.log(`  DR: ${metrics[offset + 10].toFixed(2)}`);
						console.log(`  PD: ${metrics[offset + 11].toFixed(2)}`);
						console.log("\n");
					}

					resolve({ success: true, metrics });
				}
				catch (e) {
					console.log(`Audio Wizard => Error in batch metrics callback: ${e.message}`);
					resolve({ success: false });
				}
			};

			AudioWizard.SetFullTrackAnalysisCallback(onComplete);
			AudioWizard.StartFullTrackAnalysis(metadata, chunkDuration);
		});
	}
	catch (e) {
		console.log(`Audio Wizard => Unexpected error in full-track metrics batch analysis: ${e.message}`);
		return { success: false };
	}
}


/**
 * Starts full-track metrics analysis using single getters (e.g., GetMomentaryLUFSFull).
 * @global
 * @param {FbMetadbHandle|FbMetadbHandleList|null} metadb - The metadb handle(s).
 * @param {number} [chunkDuration] - The optional chunk duration from 10-1000ms.
 * @returns {Promise<{success: boolean, singleMetrics?: any}>}
 */
async function AWStartFullTrackMetricsSingle(metadb, chunkDuration = 200) {
	if (!AudioWizard || AudioWizard.FullTrackProcessing) {
		return { success: false };
	}

	console.log("Audio Wizard => Starting full-track single metrics analysis...");

	try {
		const { handleList, metadata, artists, albums, titles } = GetMetadata(metadb);

		if (!handleList || handleList.Count === 0) {
			console.log("Audio Wizard => No tracks to analyze.");
			return { success: false };
		}

		const trackCount = handleList.Count;

		return await new Promise((resolve) => {
			const onComplete = (success) => {
				if (!success) {
					console.log('Audio Wizard => Analysis failed or was cancelled');
					resolve({ success: false, singleMetrics: new Map() });
					return;
				}

				console.log("Audio Wizard => Single metrics analysis complete!");
				console.log(`Audio Wizard => Analyzed ${trackCount} track(s):`);

				const singleMetrics = new Map();

				for (let i = 0; i < trackCount; i++) {
					const key = `${artists[i]} - ${albums[i]} - ${titles[i]}`;

					const metrics = {
						mLufs: AudioWizard.GetMomentaryLUFSFull(i),
						sLufs: AudioWizard.GetShortTermLUFSFull(i),
						iLufs: AudioWizard.GetIntegratedLUFSFull(i),
						rms: AudioWizard.GetRMSFull(i),
						samplePeak: AudioWizard.GetSamplePeakFull(i),
						truePeak: AudioWizard.GetTruePeakFull(i),
						psr: AudioWizard.GetPSRFull(i),
						plr: AudioWizard.GetPLRFull(i),
						cf: AudioWizard.GetCrestFactorFull(i),
						lra: AudioWizard.GetLoudnessRangeFull(i),
						dr: AudioWizard.GetDynamicRangeFull(i),
						pd: AudioWizard.GetPureDynamicsFull(i)
					};

					singleMetrics.set(key, metrics);

					console.log(`Audio Wizard => Track ${i + 1}: ${key}`);
					console.log(`  M LUFS: ${metrics.mLufs.toFixed(2)} | S LUFS: ${metrics.sLufs.toFixed(2)} | I LUFS: ${metrics.iLufs.toFixed(2)}`);
					console.log(`  RMS: ${metrics.rms.toFixed(2)} | Peak: ${metrics.samplePeak.toFixed(2)} | True Peak: ${metrics.truePeak.toFixed(2)}`);
					console.log(`  PSR: ${metrics.psr.toFixed(2)} | PLR: ${metrics.plr.toFixed(2)} | CF: ${metrics.cf.toFixed(2)}`);
					console.log(`  LRA: ${metrics.lra.toFixed(2)} | DR: ${metrics.dr.toFixed(2)} | PD: ${metrics.pd.toFixed(2)}`);
					console.log("");
				}

				resolve({ success: true, singleMetrics });
			};

			AudioWizard.SetFullTrackAnalysisCallback(onComplete);
			AudioWizard.StartFullTrackAnalysis(metadata, chunkDuration);
		});
	}
	catch (e) {
		console.log(`Audio Wizard => Error in full-track single metrics analysis: ${e.message || e}`);
		return { success: false };
	}
}


/**
 * Starts waveform analysis for single or multiple tracks.
 * @param {FbMetadbHandle|FbMetadbHandleList|null} metadb - The metadb handle(s).
 * @param {number} [resolution] - The optional resolution in points/sec from 1-1000.
 * @returns {Promise<{success: boolean, tracks?: Array<{index: number, path: string, duration: number, channels: number, waveformData: Array}>}>}
 */
async function AWStartWaveformAnalysis(metadb, resolution = 1) {
	if (!AudioWizard || AudioWizard.FullTrackProcessing) {
		return { success: false };
	}

	console.log("Audio Wizard => Starting waveform analysis...");

	try {
		const { metadata } = GetMetadata(metadb);

		return await new Promise((resolve) => {
			const onComplete = (success) => {
				try {
					console.log(`Audio Wizard => Waveform callback fired, success: ${success}`);

					if (!success) {
						console.log('Audio Wizard => Waveform analysis failed');
						resolve({ success: false });
						return;
					}

					const tracks = [];
					const trackCount = AudioWizard.GetWaveformTrackCount();
					console.log(`Audio Wizard => Processing ${trackCount} track(s)`);

					for (let i = 0; i < trackCount; i++) {
						const path = AudioWizard.GetWaveformTrackPath(i);
						const duration = AudioWizard.GetWaveformTrackDuration(i);
						const channels = AudioWizard.GetWaveformTrackChannels(i);
						const waveformData = AudioWizard.GetWaveformData(i);

						const metricsPerPoint = 5 * channels;
						const totalValues = waveformData.length;
						const numPoints = totalValues / metricsPerPoint;
						const durLog = duration.toFixed(2);
						const resLog = (numPoints / duration).toFixed(1);

						tracks.push({ index: i, path, duration, channels, waveformData });
						console.log(`Audio Wizard => Track ${i + 1}: ${totalValues} values (${numPoints} points over ${durLog}s, resolution: ~${resLog} pts/sec)`);
						// console.log(`Audio Wizard => Track ${i + 1}: ${waveformData.map(v => Number(v.toFixed(3))).join(',')}`);
					}

					resolve({ success: true, tracks });
				}
				catch (e) {
					AudioWizard.StopWaveformAnalysis();
					resolve({ success: false });
					console.log(`Audio Wizard => Error in waveform callback: ${e.message}`);
				}
			};

			AudioWizard.SetFullTrackWaveformCallback(onComplete);
			AudioWizard.StartWaveformAnalysis(metadata, resolution);
		});
	}
	catch (e) {
		console.log(`Audio Wizard => Error in waveform analysis: ${e.message}`);
		AudioWizard.StopWaveformAnalysis();
		return { success: false };
	}
}


/**
 * Analyzes tracks and saves multi-channel waveform data to JSON.
 * @param {FbMetadbHandle|FbMetadbHandleList|null} metadb - The metadb handle(s).
 * @param {string} cachePath - The folder where .awz.json files will be stored.
 * @param {number} [resolution] - Resolution in points/sec.
 */
async function AWStartWaveformAnalysisFileSaving(metadb, cachePath, resolution = 1) {
	if (!AudioWizard || AudioWizard.FullTrackProcessing) return;

	console.log(`Audio Wizard => Batch processing ${metadb.Count} tracks...`);

	const result = await AWStartWaveformAnalysis(metadb, resolution);
	if (!result.success) return;

	const tfArtistTitle = fb.TitleFormat('%artist% - %title%');

	for (const track of result.tracks) {
		const structuredData = [];
		const handle = metadb[track.index];

		let fileName = tfArtistTitle.EvalWithMetadb(handle).trim();

		if (!fileName) {
			const baseName = track.path.split('\\').pop().replace(Regex.PathFileExtensionFinal, '');
			fileName = baseName || track.path;
		}

		fileName = fileName.replace(Regex.PathIllegalFilename, '_').substring(0, 100);
		const targetPath = `${cachePath}\\${fileName}.awz.json`;
		const metricsPerPoint = 5 * track.channels;

		for (let i = 0; i < track.waveformData.length; i += metricsPerPoint) {
			const pointSlice = track.waveformData.slice(i, i + metricsPerPoint);
			const roundedSlice = pointSlice.map(v => Math.round(v * 1000) / 1000);
			structuredData.push(roundedSlice);
		}

		const jsonFile = JSON.stringify({
			version: 1,
			channels: track.channels,
			duration: track.duration,
			metricsPerChannel: 5,
			metrics: ['rms', 'rms_peak', 'sample_peak', 'min', 'max'],
			data: structuredData
		});

		if (Save(targetPath, jsonFile, true)) {
			console.log(`Audio Wizard => Saved: ${targetPath}`);
		} else {
			console.log(`Audio Wizard => Failed to save ${track.path}`);
		}
	}
}


/**
 * Starts peakmeter monitoring and logs adjusted RMS and sample peak levels.
 * @global
 * @param {number} [refreshRate] - The optional refresh rate from from 10-1000ms.
 * @param {number} [chunkDuration] - The optional chunk duration from 10-1000ms.
 */
function AWStartPeakmeterMonitoring(refreshRate = 33, chunkDuration = 50) {
	if (!AudioWizard) return;

	AudioWizard.StartPeakmeterMonitoring(refreshRate, chunkDuration);

	console.log('Peakmeter - Adjusted Left RMS:', AudioWizard.PeakmeterAdjustedLeftRMS.toFixed(2));
	console.log('Peakmeter - Adjusted Right RMS:', AudioWizard.PeakmeterAdjustedRightRMS.toFixed(2));
	console.log('Peakmeter - Adjusted Left Sample Peak:', AudioWizard.PeakmeterAdjustedLeftSamplePeak.toFixed(2));
	console.log('Peakmeter - Adjusted Right Sample Peak:', AudioWizard.PeakmeterAdjustedRightSamplePeak.toFixed(2));
	console.log('Peakmeter - Offset:', AudioWizard.PeakmeterOffset.toFixed(2), '\n');

	// Call AudioWizard.StopPeakmeterMonitoring() when done
}


/**
 * Starts raw audio monitoring and processes raw PCM audio samples.
 * @global
 * @param {number} [refreshRate] - The optional refresh rate from from 10-1000ms.
 * @param {number} [chunkDuration] - The optional chunk duration from 10-1000ms.
 */
function AWStartRawAudioMonitoring(refreshRate = 33, chunkDuration = 50) {
	if (!AudioWizard) return;

	AudioWizard.StartRawAudioMonitoring(refreshRate, chunkDuration);

	try {
		const startTime = Date.now();
		const rawData = AudioWizard.RawAudioData;

		if (rawData) {
			const accessTime = Date.now() - startTime;

			console.log('RawData length:', rawData.length);
			console.log('RawData first element:', rawData[0]);
			console.log('RawData middle element:', rawData[Math.floor(rawData.length / 2)]);
			console.log('RawData current element:', rawData[rawData.length - 1]);
			console.log('Array access time (ms):', accessTime.toFixed(2));
			console.log('Last 5 samples:', rawData.slice(-5).join(', '));

			const rmsStartTime = Date.now();
			const windowSize = 100;
			const startIndex = Math.max(0, rawData.length - windowSize);

			const leftSamples = rawData.filter((_, i) => i >= startIndex && i % 2 === 0);
			const rightSamples = rawData.filter((_, i) => i >= startIndex && i % 2 !== 0);
			const sumSquaresLeft = leftSamples.reduce((sum, x) => sum + x * x, 0);
			const sumSquaresRight = rightSamples.reduce((sum, x) => sum + x * x, 0);
			const rmsLeft = leftSamples.length > 0 ? Math.sqrt(sumSquaresLeft / leftSamples.length) : 0;
			const rmsRight = rightSamples.length > 0 ? Math.sqrt(sumSquaresRight / rightSamples.length) : 0;
			const rmsTime = Date.now() - rmsStartTime;

			console.log(`RMS left channel (last ~${leftSamples.length} samples):`, rmsLeft.toFixed(6));
			console.log(`RMS right channel (last ~${rightSamples.length} samples):`, rmsRight.toFixed(6));
			console.log('RMS calculation time (ms):', rmsTime.toFixed(2));
		} else {
			console.log('Audio Wizard => RawData is empty');
		}
	}
	catch (e) {
		console.log('Audio Wizard => Error accessing RawAudioData:', e.message);
	}

	// Call AudioWizard.StopRawAudioMonitoring() when done
}


/**
 * Starts real-time audio monitoring and logs various audio metrics.
 * @global
 * @param {number} [refreshRate] - The optional refresh rate from from 10-1000ms.
 * @param {number} [chunkDuration] - The optional chunk duration from 10-1000ms.
 */
function AWStartRealTimeMonitoring(refreshRate = 33, chunkDuration = 50) {
	if (!AudioWizard) return;

	AudioWizard.StartRealTimeMonitoring(refreshRate, chunkDuration);

	console.log('Real-time - Momentary LUFS:', AudioWizard.MomentaryLUFS.toFixed(2));
	console.log('Real-time - Short Term LUFS:', AudioWizard.ShortTermLUFS.toFixed(2));
	console.log('Real-time - RMS:', AudioWizard.RMS.toFixed(2));
	console.log('Real-time - Left RMS:', AudioWizard.LeftRMS.toFixed(2));
	console.log('Real-time - Right RMS:', AudioWizard.RightRMS.toFixed(2));
	console.log('Real-time - Left Sample Peak:', AudioWizard.LeftSamplePeak.toFixed(2));
	console.log('Real-time - Right Sample Peak:', AudioWizard.RightSamplePeak.toFixed(2));
	console.log('Real-time - True Peak:', AudioWizard.TruePeak.toFixed(2));
	console.log('Real-time - PSR:', AudioWizard.PSR.toFixed(2));
	console.log('Real-time - PLR:', AudioWizard.PLR.toFixed(2));
	console.log('Real-time - Crest Factor:', AudioWizard.CrestFactor.toFixed(2));
	console.log('Real-time - DR:', AudioWizard.DynamicRange.toFixed(2));
	console.log('Real-time - PD:', AudioWizard.PureDynamics.toFixed(2));
	console.log('Real-time - Phase Correlation:', AudioWizard.PhaseCorrelation.toFixed(2));
	console.log('Real-time - Stereo Width:', AudioWizard.StereoWidth.toFixed(2), '\n');
}


/**
 * Adjusts the window's position and size with optional constraints.
 * @global
 */
function UIWAdjustWindowGeometry() {
	if (!UIWizard) return;

	UIWizard.SetWindowPosition(100, 100); // Move window to (100, 100)
	console.log('Window Position:', UIWizard.WindowX, UIWizard.WindowY);

	UIWizard.SetWindowSize(800, 600); // Set size to 800x600
	console.log('Window Size:', UIWizard.WindowWidth, UIWizard.WindowHeight);

	UIWizard.WindowMinSize = true; // Enable minimum size constraints
	UIWizard.WindowMinWidth = 400;
	UIWizard.WindowMinHeight = 300;
	UIWizard.WindowMaxSize = true; // Enable maximum size constraints
	UIWizard.WindowMaxWidth = 1200;
	UIWizard.WindowMaxHeight = 900;
	UIWizard.SetWindowSizeLimits(400, 300, 1200, 900); // Apply constraints
	console.log('Size Constraints:', UIWizard.WindowMinWidth, UIWizard.WindowMinHeight, UIWizard.WindowMaxWidth, UIWizard.WindowMaxHeight);

	UIWizard.SetWindowPositionInGrid('top-left'); // Snap to top-left grid
	console.log('Window snapped to top-left grid');
}


/**
 * Customizes the window's frame style and background color.
 * @global
 */
function UIWCustomizeWindowAppearance() {
	if (!UIWizard) return;

	UIWizard.FrameStyle = 3; // Set to No Border
	console.log('Frame Style set to:', UIWizard.FrameStyle); // 3 (No Border)

	UIWizard.WindowBgColor = RGB(255, 0, 0); // Set background to red (RGB)
	console.log('Window Background Color set to:', UIWizard.WindowBgColor.toString(16));
}


/**
 * Configures window dragging and ESC key behavior.
 * @global
 */
function UIWConfigureWindowBehavior() {
	if (!UIWizard) return;

	UIWizard.MoveStyle = 2; // Ctrl + Alt + Left mouse button
	console.log('Move Style set to:', UIWizard.MoveStyle);

	UIWizard.SetCaptionAreaSize(0, 0, 200, 30); // Set caption area for dragging
	console.log('Caption Area set to: (0, 0, 200, 30)');

	UIWizard.DisableWindowMaximizing = true; // Disable maximizing
	console.log('Window Maximizing disabled:', UIWizard.DisableWindowMaximizing);

	UIWizard.DisableWindowSizing = false; // Enable resizing
	console.log('Window Sizing enabled:', !UIWizard.DisableWindowSizing);
}


/**
 * Retrieves and logs display-related properties.
 * @global
 */
function UIWGetDisplayInfo() {
	if (!UIWizard) return;

	console.log('Display DPI:', UIWizard.DisplayDPI);
	console.log('Display Resolution Mode:', UIWizard.DisplayResolutionMode);
	console.log('Display Resolution:', UIWizard.DisplayResolution);
	console.log('Multi-Monitor Resolution:', UIWizard.DisplayResolutionMultiMonitors);
}


/**
 * Manages window state transitions (e.g., fullscreen, maximized).
 * @global
 */
function UIWManageWindowState() {
	if (!UIWizard) return;

	console.log('Current Window State:', UIWizard.WindowState); // 0 (Normal), 1 (Maximized), 2 (Fullscreen)

	UIWizard.ToggleFullscreen(); // Enter fullscreen
	console.log('Toggled to Fullscreen:', UIWizard.WindowState);

	setTimeout(() => {
		UIWizard.ExitFullscreen(); // Exit fullscreen
		console.log('Exited Fullscreen:', UIWizard.WindowState);
	}, 2000);

	UIWizard.ToggleMaximize(); // Maximize window
	console.log('Toggled to Maximized:', UIWizard.WindowState);

	setTimeout(() => {
		UIWizard.ExitMaximize(); // Restore to normal
		console.log('Exited Maximized:', UIWizard.WindowState);
	}, 4000);
}


///////////////////////
// * COMPATIBILITY * //
///////////////////////
/**
 * Detects if the user's system is running Wine on Linux or MacOs.
 * Caches result after first call for performance.
 * @global
 * @returns {boolean} True if Wine is detected, false otherwise.
 */
function DetectWine() {
	// * Cache check: Return stored result if already computed.
	if (typeof DetectWine.result !== 'undefined') {
		return DetectWine.result;
	}

	// * Method 1: Registry check
	let runningWine = false;
	try {
		const WshShell = new ActiveXObject('WScript.Shell');
		try {
			WshShell.RegRead('HKEY_CURRENT_USER\\Software\\Wine\\');
			runningWine = true;
		} catch (e) {
			try {
				WshShell.RegRead('HKEY_LOCAL_MACHINE\\Software\\Wine\\');
				runningWine = true;
			} catch (e) {}
		}
	}
	catch (e) { /* WScript.Shell unavailable */ }

	// * Method 2: WMI process check (if registry didn't confirm; verifies active Wine).
	if (!runningWine) {
		try {
			const wmi = GetObject("winmgmts:");
			const processes = wmi.ExecQuery("SELECT Name FROM Win32_Process WHERE Name LIKE 'wine%'");
			runningWine = processes.Count > 0; // Covers wineserver.exe, wine-preloader.exe, etc.
		}
		catch (e) { /* WMI unavailable */ }
	}

	// * Method 3: Filesystem check (fallback; checks Z:\ and profile drive for portables).
	if (!runningWine) {
		const drives = ['Z:\\'];
		try {
			const currentDrive = `${fso.GetDriveName(fb.ProfilePath)}\\`;
			if (currentDrive.toUpperCase() !== 'Z:\\') {
				drives.push(currentDrive);
			}
		}
		catch (e) {}

		const unixPaths = ['bin\\bash', 'bin\\ls', 'bin\\sh', 'etc\\fstab', 'usr\\bin\\env'];
		runningWine = drives.some((drive) => {
			try {
				if (!IsFolder(drive)) return false;
				let foundCount = 0;
				for (const unixPath of unixPaths) {
					if (IsFile(drive + unixPath)) {
						foundCount++;
						if (foundCount >= 2) return true; // Threshold for low false positives
					}
				}
				return false;
			}
			catch (e) { return false; }
		});
	}

	// * Cache the result.
	DetectWine.result = runningWine;
	return runningWine;
}


/**
 * Gets the major and minor version of Windows operating system from the registry.
 * Falls back to a default version if registry read is unsuccessful.
 * @returns {string} The Windows version in 'major.minor' format or a default if not obtainable.
 */
function GetWindowsVersion() {
	return Once(() => {
		let version = '';
		let ret = Attempt(() => {
			version = (WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentMajorVersionNumber')).toString();
			version += '.';
			version += (WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentMinorVersionNumber')).toString();
		});
		if (!IsError(ret)) {
			return version;
		}
		ret = Attempt(() => {
			version = WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentVersion');
		});
		if (!IsError(ret)) {
			return version;
		}
		return '6.1';
	});
}


/////////////
// * WEB * //
/////////////
/**
 * Compares two versions to determine if a version has changed.
 * Release must be in form of 2.0.0-beta1, or 2.0.1.
 * @global
 * @param {number|string} oldVer - The old version of the config file.
 * @param {number|string} newVer - The new version of the config file.
 * @returns {boolean} True if the `newVer` is newer.
 */
function IsNewerVersion(oldVer, newVer) {
	const a = newVer.split('-');
	const b = oldVer.split('-');
	const pa = a[0].split('.');
	const pb = b[0].split('.');

	for (let i = 0; i < 3; i++) {
		const na = Number(pa[i]);
		const nb = Number(pb[i]);
		if (na > nb) return true;
		if (nb > na) return false;
		if (!isNaN(na) && isNaN(nb)) return true;
		if (isNaN(na) && !isNaN(nb)) return false;
	}

	if (a[1] && b[1]) {
		return a[1] > b[1];
	}

	return !!(!a[1] && b[1]);
}


/**
 * Makes an HTTP request to a URL and calls a callback when the response is received.
 * @global
 * @param {string} type - The type of request to make. Can be one of 'GET' 'POST' 'PUT' 'DELETE'.
 * @param {string} url - The URL to make the request.
 * @param {Function} successCB - The callback function to call when the request is successful.
 * @returns {void}
 */
function MakeHttpRequest(type, url, successCB) {
	try {
		const xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		xmlhttp.open(type, url, true);
		xmlhttp.setRequestHeader('User-Agent', 'foo_spider_monkey_georgia');
		xmlhttp.onreadystatechange = () => {
			if (xmlhttp.readyState === 4) {
				successCB(xmlhttp.responseText);
			}
		};
		xmlhttp.send();
	} catch (e) {
		console.log('The HTTP request failed:', e);
	}
}


/**
 * Extracts the domain name from a given URL and formats it.
 * @param {string} url - The URL from which to extract the domain name.
 * @returns {string} The formatted domain name.
 */
function WebsiteExtractDomainName(url) {
	const domain = url.match(Regex.WebDomain)[2];
	return domain.charAt(0).toUpperCase() + domain.slice(1).replace(Regex.WebTopLevelDomain, '');
}


/**
 * Generates labels and values for predefined and custom website links.
 * @param {Array} customWebsiteLinks - Array of custom website URLs.
 * @returns {object} - Object containing combined labels and values.
 */
function WebsiteGenerateLinks(customWebsiteLinks) {
	const customLabels = customWebsiteLinks.map((url) => WebsiteExtractDomainName(url));
	const customValues = customWebsiteLinks.map((url) => WebsiteExtractDomainName(url));

	const labels = ['Google', 'Google Images', 'Wikipedia', 'YouTube', 'Last.fm', 'AllMusic', 'Discogs', 'MusicBrainz', 'Bandcamp', 'Album of the Year', 'Rate Your Music', 'Sputnikmusic'];
	const values = ['google', 'googleImages', 'wikipedia', 'youTube', 'lastfm', 'allMusic', 'discogs', 'musicBrainz', 'bandcamp', 'aoty', 'rym', 'sputnikmusic'];

	const websiteLabels = labels.concat(customLabels);
	const websiteValues = values.concat(customValues);

	return { websiteLabels, websiteValues };
}


/**
 * Opens a website (or all predefined websites) based on the provided site name using track metadata.
 * @param {string} [website] - The name of the website to open (optional if openAll is true).
 * @param {FbMetadbHandle} metadb - The metadata handle of the track.
 * @param {boolean} [openAll=false] - Whether to open all predefined websites.
 */
function WebsiteOpen(website, metadb, openAll = false) {
	if (!metadb) return;

	const metaInfo = metadb.GetFileInfo();
	const getMetaValue = (metafield) => {
		const index = metaInfo.MetaFind(metafield);
		return index === -1 ? '' : metaInfo.MetaValue(index, 0);
	};

	const artist = getMetaValue('artist').replace(Regex.SpaceAll, '+').replace(/&/g, '%26');
	const album = getMetaValue('album').replace(Regex.SpaceAll, '+');
	const title = getMetaValue('title').replace(Regex.SpaceAll, '+');
	const searchQuery = artist || title;

	const metadata = { artist, album, title };
	const missingMeta = Object.keys(metadata).filter(key => !metadata[key]).map(key => `%${key}%`);

	if (missingMeta.length > 0) {
		const missingFields = missingMeta.join('\n');
		const msg = `Web search aborted!\n\nPlease provide the necessary\nmetadata fields for:\n\n${missingFields}\n\n`;
		grm.msg.showPopup(true, msg, msg, 'OK', null, (confirmed) => {});
		return;
	}

	const replacePlaceholders = (link) => link
		.replace('{artist}', artist)
		.replace('{title}', title)
		.replace('{album}', album);

	const urls = {
		google: `https://google.com/search?q=${searchQuery}`,
		googleImages: `https://images.google.com/images?hl=en&q=${searchQuery}`,
		wikipedia: `https://en.wikipedia.org/wiki/${artist.replace(Regex.PunctPlus, '_')}`,
		youTube: `https://www.youtube.com/results?search_type=&search_query=${searchQuery}`,
		lastfm: `https://www.last.fm/music/${searchQuery.replace('/', '%252F')}`,
		allMusic: `https://www.allmusic.com/search/all/${searchQuery}`,
		discogs: `https://www.discogs.com/search?q=${searchQuery}+${album}`,
		musicBrainz: `https://musicbrainz.org/taglookup/index?tag-lookup.artist=${searchQuery}&tag-lookup.release=${album}`,
		bandcamp: `https://bandcamp.com/search?q=${searchQuery}&item_type`,
		aoty: `https://www.albumoftheyear.org/search/?q=${searchQuery}+${album}`,
		rym: `https://rateyourmusic.com/search?searchterm=${searchQuery}+${album}`,
		sputnikmusic: `https://www.sputnikmusic.com/search_results.php?search_in=Bands&search_text=${searchQuery}`,
		default: 'https://github.com/TT-ReBORN/Georgia-ReBORN'
	};

	const predefinedWebsites = [
		'google',
		'googleImages',
		'wikipedia',
		'youTube',
		'lastfm',
		'allMusic',
		'discogs',
		'musicBrainz',
		'bandcamp',
		'aoty',
		'rym',
		'sputnikmusic'
	];

	// Add custom URLs to the urls object
	grCfg.customWebsiteLinks.forEach((link) => {
		const domain = WebsiteExtractDomainName(link);
		urls[domain] = replacePlaceholders(link);
	});

	if (openAll) {
		for (const site of predefinedWebsites) {
			const url = urls[site] || urls.default;
			RunCmd(url);
		}
	} else if (website) {
		const url = urls[website] || urls.default;
		RunCmd(url);
	}
}


///////////////
// * DEBUG * //
///////////////
/**
 * A class that handles theme errors with detailed messages.
 * @augments {Error}
 */
class ThemeError extends Error {
	/**
	 * Creates the `ThemeError` instance.
	 * @param {string} msg - The error message.
	 */
	constructor(msg) {
		super(msg);
		/** @private @type {string} */
		this.name = 'ThemeError';
		/** @private @type {string} */
		this.message = `\n${msg}\n`;
	}
}


/**
 * A class that handles logic errors with detailed messages.
 * @augments {Error}
 */
class LogicError extends Error {
	/**
	 * Creates the `LogicError` instance.
	 * @param {string} msg - The error message.
	 */
	constructor(msg) {
		super(msg);
		/** @private @type {string} */
		this.name = 'LogicError';
		/** @private @type {string} */
		this.message = `\n${msg}\n`;
	}
}


/**
 * A class that handles invalid type errors with detailed messages.
 * @augments {Error}
 */
class InvalidTypeError extends Error {
	/**
	 * Creates the `InvalidTypeError` instance.
	 * @param {string} arg_name - The name of the argument that caused the error.
	 * @param {string} arg_type - The actual type of the argument that was passed.
	 * @param {string} valid_type - The expected type of the argument.
	 * @param {string} [additional_msg] - An optional message to provide more information about the error.
	 */
	constructor(arg_name, arg_type, valid_type, additional_msg = '') {
		super('');
		/** @private @type {string} */
		this.name = 'InvalidTypeError';
		/** @private @type {string} */
		this.message = `\n'${arg_name}' is not a ${valid_type}, it's a ${arg_type}${additional_msg ? `\n${additional_msg}` : ''}\n`;
	}
}


/**
 * A class that handles argument errors with detailed messages.
 * @augments {Error}
 */
class ArgumentError extends Error {
	/**
	 * Creates the `ArgumentError` instance.
	 * @param {string} arg_name - The name of the argument that has an invalid value.
	 * @param {*} arg_value - The value of the argument that is considered invalid.
	 * @param {string} [additional_msg] - An optional message to provide more information about the error.
	 */
	constructor(arg_name, arg_value, additional_msg = '') {
		super('');
		/** @private @type {string} */
		this.name = 'ArgumentError';
		/** @private @type {string} */
		this.message = `\n'${arg_name}' has invalid value: ${arg_value}${additional_msg ? `\n${additional_msg}` : ''}\n`;
	}
}


/**
 * Asserts that a condition is true and throws an error if it is not.
 * @global
 * @param {boolean} predicate - The condition to evaluate.
 * @param {new (...args: any[]) => Error} ExceptionType - The error constructor to instantiate if the condition is false.
 * @param {...any} args - Additional arguments to pass to the error constructor.
 * @returns {void}
 * @throws {Error} Throws an error of the type specified by `ExceptionType` if `predicate` is false.
 */
function Assert(predicate, ExceptionType, ...args) {
	if (!predicate) throw new ExceptionType(...args);
}


/**
 * Calculates and logs the average execution time of given functions (code blocks) over a specified number of iterations.
 * Optionally compares the performance of two code blocks with their respective arguments.
 * @global
 * @param {number} iterations - The number of times the code blocks should be executed.
 * @param {Function} func1 - The first function whose performance is to be measured.
 * @param {Array} [args1] - The optional arguments for the first function as an array.
 * @param {Function} [func2] - The optional second function to measure and compare performance against the first.
 * @param {Array} [args2] - The optional arguments for the second function as an array.
 * @example
 * // Usage without arguments:
 * CalcExecutionTime(1000, function1, [], function2, []);
 * @example
 * // Usage with arguments:
 * CalcExecutionTime(1000, function1, ['arg1', 'arg2'], function2, ['arg1', 'arg2']);
 * @example
 * // Usage with methods, use .bind(this):
 * CalcExecutionTime(1000, this.method1.bind(this), [], this.method2.bind(this), []);
 */
function CalcExecutionTime(iterations, func1, args1 = [], func2, args2 = []) {
	// Measure and log function1 performance
	const start1 = Date.now();
	for (let i = 0; i < iterations; i++) {
		func1.apply(this, args1);
	}
	const end1 = Date.now();
	const totalTime1 = end1 - start1;
	console.log(`Function 1 took: ${(totalTime1 / iterations).toFixed(3)} ms`);

	if (!func2) return;

	// Measure and log function2 performance
	const start2 = Date.now();
	for (let i = 0; i < iterations; i++) {
		func2.apply(this, args2);
	}
	const end2 = Date.now();
	const totalTime2 = end2 - start2;
	console.log(`Function 2 took: ${(totalTime2 / iterations).toFixed(3)} ms`);

	// Measure, log and compare both function1 and function2 performances
	const diff = totalTime1 - totalTime2;
	const percent = (Math.abs(diff) / ((totalTime1 + totalTime2) / 2)) * 100;
	const faster = diff > 0 ? 'FUNCTION 2 IS FASTER' : 'FUNCTION 1 IS FASTER';
	console.log(`${faster} BY: ${Math.abs(diff / iterations).toFixed(3)} ms - ${percent.toFixed(2)}%`);
}


/**
 * Calculates and logs one or two given functions over a specified duration and compares their performance if both are provided.
 * @global
 * @param {number} duration - The duration (in milliseconds) for which the functions should be executed.
 * @param {Function} func1 - The first function to be measured.
 * @param {Array} [args1] - The optional arguments for the first function as an array.
 * @param {Function} [func2] - The second function to be measured (optional).
 * @param {Array} [args2] - The optional arguments for the second function as an array.
 * @example
 * // Usage without arguments:
 * CalcExecutionDuration(5000, function1, [], function2, []);
 * @example
 * // Usage with arguments:
 * CalcExecutionDuration(5000, function1, ['arg1', 'arg2'], function2, ['arg1', 'arg2']);
 * @example
 * // Usage with methods, use .bind(this):
 * CalcExecutionDuration(5000, this.method1.bind(this), [], this.method2.bind(this), []);
 */
function CalcExecutionDuration(duration, func1, args1, func2, args2) {
	const profiler1 = fb.CreateProfiler('Performance Profiler 1');
	const profiler2 = func2 ? fb.CreateProfiler('Performance Profiler 2') : null;

	const measureFunc = (func, args, profiler) => {
		console.log(`Starting performance measurement for ${func.name}...`);
		const startTime = Date.now();
		const endTime = startTime + duration;
		let count = 0;

		// Execute the function until the duration elapses
		while (Date.now() < endTime) {
			func(...args);
			count++;
		}

		profiler.Print();
		console.log(`Performance measurement for ${func.name} completed.`);
		return { totalTime: Date.now() - startTime, count };
	};

	// Measure and log function1 performance
	const result1 = measureFunc(func1, args1, profiler1);
	const avgTime1 = result1.totalTime / result1.count;
	console.log(`Function 1 (${func1.name}) took an average of ${avgTime1.toFixed(3)} ms per execution`);

	if (!func2) return;

	// Measure and log function2 performance
	const result2 = measureFunc(func2, args2, profiler2);
	const avgTime2 = result2.totalTime / result2.count;
	console.log(`Function 2 (${func2.name}) took an average of ${avgTime2.toFixed(3)} ms per execution`);

	// Measure, log and compare both function1 and function2 performances
	const diff = avgTime1 - avgTime2;
	const percent = (Math.abs(diff) / ((avgTime1 + avgTime2) / 2)) * 100;
	const faster = diff > 0 ? 'FUNCTION 2 IS FASTER' : 'FUNCTION 1 IS FASTER';
	console.log(`${faster} BY: ${Math.abs(diff).toFixed(3)} ms - ${percent.toFixed(2)}%`);
}


/**
 * Calculates and logs the performance of given functions either by iterations or duration.
 * @global
 * @param {string} mode - The mode of performance measurement ('time' for iterations or 'duration' for time-based).
 * @param {number} metric - The number of iterations or the duration in milliseconds.
 * @param {Function} func1 - The first function whose performance is to be measured.
 * @param {Array} [args1] - The optional arguments for the first function as an array.
 * @param {Function} [func2] - The optional second function to measure and compare performance against the first.
 * @param {Array} [args2] - The optional arguments for the second function as an array.
 * @example
 * // Measure performance by iterations:
 * CalcPerformance('time', 1000, function1, [], function2, []);
 * @example
 * // Measure performance by duration:
 * CalcPerformance('duration', 5000, function1, ['arg'], function2, ['arg']);
 * @example
 * // Measure performance by iterations with arguments:
 * CalcPerformance('time', 1000, function1, ['arg1', 'arg2'], function2, ['arg1', 'arg2']);
 * @example
 * // Measure performance by duration with methods, use .bind(this):
 * CalcPerformance('duration', 5000, this.method1.bind(this), [], this.method2.bind(this), []);
 */
function CalcPerformance(mode, metric, func1, args1 = [], func2, args2 = []) {
	if (mode === 'time') {
		CalcExecutionTime(metric, func1, args1, func2, args2);
	}
	else if (mode === 'duration') {
		CalcExecutionDuration(metric, func1, args1, func2, args2);
	}
	else {
		console.log('Invalid mode. Use "time" for iteration-based or "duration" for time-based performance measurement.');
	}
}


/**
 * Prints logs for specific callback actions.
 * Will be shown in the console when `Show panel calls` in Developer tools is active.
 * @global
 * @param {string} msg - The callback action message to log.
 */
function CallLog(msg) {
	if (!grm.ui.traceCall) return;
	console.log(msg);
}


/**
 * Prints exclusive theme debug logs and avoids cluttering the console constantly.
 * Will be shown in the console when `Enable debug log` in Developer tools is active.
 * @global
 * @param {...any} args - The debug messages to log.
 */
function DebugLog(...args) {
	if (args.length === 0 || !grCfg.settings.showDebugLog) return;
	console.log(...args);
}


/**
 * Prints logs for specific callback on_mouse_move actions.
 * Will be shown in the console when `Show panel moves` in Developer tools is active.
 * @global
 * @param {string} msg - The callback mouse move message to log.
 */
function MoveLog(msg) {
	if (!grm.ui.traceCall || !grm.ui.traceOnMove) return;
	console.log(msg);
}


/**
 * Prints a color object to the console.
 * This is primarily for debugging and for the benefit of other tools that rely on color objects.
 * @global
 * @param {object} obj - The object to print.
 * @returns {void}
 */
function PrintColorObj(obj) {
	console.log('\tname: \'\',\n\tcolors: {');
	for (const propName in obj) {
		const propValue = obj[propName];

		console.log(`\t\t${propName}: ${ColToRgb(propValue, true)},\t\t// #${ToPaddedHexString(0xffffff & propValue, 6)}`);
	}
	console.log(`\t},\n\thint: [${ColToRgb(obj.primary, true)}]`);
}


/**
 * Handles the profiler setup and printing based on the given condition and action.
 * @param {boolean} condition - The condition to check before proceeding with the profiler operation.
 * @param {string} action - The action to perform ('create' or 'print').
 * @param {string} message - The log message to use when creating the profiler (required for 'create' action).
 */
function SetDebugProfile(condition, action, message) {
	// Initialize properties on first call
	if (typeof SetDebugProfile.profiler === 'undefined') {
		SetDebugProfile.profiler = {};
		SetDebugProfile.profilerActive = false;
	}

	if (condition && action === 'create') {
		SetDebugProfile.profiler[message] = fb.CreateProfiler(message);
		SetDebugProfile.profilerActive = condition;
	}
	else if (SetDebugProfile.profiler[message] && SetDebugProfile.profilerActive && action === 'print') {
		SetDebugProfile.profiler[message].Print();
		if (grCfg.settings.showDebugPerformanceOverlay) {
			grm.ui.debugTimingsArray.push(`${message}: ${SetDebugProfile.profiler[message].Time} ms`);
		}
	}
}


/**
 * Mockup method to render all glyphs (symbols) side-by-side at a fixed baseline y-position (y=0 relative to the canvas).
 * @param {GdiGraphics} gr - The graphics context to draw on.
 * @param {number} [startX=25] - Starting x-position for the first glyph.
 * @param {number} [spacing=25] - Horizontal spacing between glyphs.
 * @param {number} [canvasHeight=50] - Height of the mockup canvas.
 * @param {boolean} [showPerGlyphCenters=true] - If true, draws thin vertical lines at each glyph's horizontal center for per-icon alignment checks.
 * @param {SmoothingMode} [SmoothRender=SmoothingMode.AntiAlias] - Smoothing mode for rendering.
 * @param {TextRenderingHint} [TextRender=TextRenderingHint.ClearTypeGridFit] - Text rendering hint.
 */
function MockupGlyphAlignment(gr, startX = 25, spacing = 25, canvasHeight = 50, showPerGlyphCenters = true, SmoothRender = SmoothingMode.AntiAlias, TextRender = TextRenderingHint.ClearTypeGridFit) {
	if (!grm.button.btnMap || IsEmpty(grm.button.btnMap)) {
		grm.button.btnMap = grm.button._createButtonMap();
	}

	// Define the transport glyphs to test (extend as needed)
	const glyphsToTest = [
		{ key: 'Stop', ico: grm.button.btnMap.Stop.ico },
		{ key: 'Previous', ico: grm.button.btnMap.Previous.ico },
		{ key: 'Play', ico: grm.button.btnMap.Play.ico },
		{ key: 'Pause', ico: grm.button.btnMap.Pause.ico },
		{ key: 'Next', ico: grm.button.btnMap.Next.ico },
		{ key: 'PlaybackDefault', ico: grm.button.btnMap.PlaybackDefault.ico },
		{ key: 'PlaybackRepeatPlaylist', ico: grm.button.btnMap.PlaybackRepeatPlaylist.ico },
		{ key: 'PlaybackRepeatTrack', ico: grm.button.btnMap.PlaybackRepeatTrack.ico },
		{ key: 'PlaybackShuffle', ico: grm.button.btnMap.PlaybackShuffle.ico },
		{ key: 'ShowVolume', ico: grm.button.btnMap.ShowVolume.ico },
		{ key: 'Reload', ico: grm.button.btnMap.Reload.ico },
		{ key: 'AddTracks', ico: grm.button.btnMap.AddTracks.ico }
	];

	const font = grFont.lowerBarBtn; // Use the transport button font
	const color = grCol.transportIconNormal; // Default icon color
	const baselineY = 0; // Fixed baseline y-position (relative to gr's origin)
	let currentX = startX;
	let totalWidth = 0; // Accumulate for accurate global center line

	// Pre-compute box widths and totalWidth for precise centering
	const boxWidths = glyphsToTest.map(({ ico }) => {
		const measurements = gr.MeasureString(ico, font, 0, 0, Infinity, canvasHeight);
		const glyphW = Math.ceil(measurements.Width);
		return Math.max(glyphW + 4, 30); // Min width for visibility (outer box)
	});

	totalWidth = boxWidths.reduce((sum, bw) => sum + bw, 0) + spacing * (glyphsToTest.length - 1);
	gr.SetSmoothingMode(SmoothRender);
	gr.SetTextRenderingHint(TextRender);
	gr.FillSolidRect(0, 0, grm.ui.ww, grm.ui.wh, RGB(0, 0, 0));

	glyphsToTest.forEach(({ key, ico }, index) => {
		const outerBoxW = boxWidths[index];
		const glyphMeasurements = gr.MeasureString(ico, font, 0, 0, Infinity, canvasHeight);
		const glyphW = Math.ceil(glyphMeasurements.Width);
		const glyphH = Math.ceil(glyphMeasurements.Height);

		// Draw a horizontal baseline line for reference (green, at vertical center of outer box)
		const hCenter = canvasHeight / 2;

		gr.DrawLine(currentX, baselineY + hCenter, currentX + outerBoxW, baselineY + hCenter, 1, RGBA(0, 255, 0, 180));
		// Optional: Per-glyph vertical center line (purple, thin) for the outer box
		if (showPerGlyphCenters) {
		const vCenterX = currentX + outerBoxW / 2;
			gr.DrawLine(vCenterX, baselineY, vCenterX, baselineY + canvasHeight, 1, RGBA(0, 255, 0, 100));
		}

		// Draw the glyph centered in the outer box
		const drawX = currentX + 2;
		const drawW = outerBoxW - 4;
		gr.DrawString(ico, font, color, drawX, baselineY, drawW, canvasHeight, StringFormat(1, 1));

		// Calculate tight inner bounding box position (centered within draw rect)
		const innerBoxX = drawX + (drawW - glyphW) / 2;
		const innerBoxY = baselineY + (canvasHeight - glyphH) / 2;
		// Draw the new tight bounding box (wireframe, yellow) for exact glyph ink extents
		gr.DrawRect(innerBoxX, innerBoxY, glyphW, glyphH, 1, RGB(255, 0, 0)); // Yellow outline for tight glyph bbox

		// Draw label below for identification
		gr.DrawString(key, gdi.Font('Segoe UI', 10, 0), color, currentX, baselineY + canvasHeight + 2, outerBoxW, 20, StringFormat(0, 0));
		currentX += outerBoxW + spacing;
	});
}


/////////////////
// * PARSING * //
/////////////////
/**
 * Gets the meta values of a specified metadata field from a given metadb object.
 * Will strip leading and trailing %'s from name.
 * @global
 * @param {string} name - The name of the meta field.
 * @param {FbMetadbHandle} metadb - The handle to evaluate string with.
 * @returns {Array<string>} An array of values of the meta field.
 */
function GetMetaValues(name, metadb = undefined) {
	const vals = [];
	const searchName = name.replace(/%/g, '');
	for (let i = 0; i < parseInt($(`$meta_num(${searchName})`, metadb)); i++) {
		vals.push($(`$meta(${searchName},${i})`, metadb));
	}
	if (!vals.length) {
		// This is a fallback in case the `name` property is a complex tf field and meta_num evaluates to 0.
		// In that case we want to evaluate the entire field, after wrapping in brackets and split on commas.
		const unsplit = $(`[${name}]`, metadb);
		if (unsplit.length) {
			return unsplit.split(', ');
		}
	}

	return vals;
}


/**
 * Parses a JSON string into a JavaScript object.
 * @global
 * @param {string} value - The string to parse.
 * @returns {*} The parsed value or null if there was an error.
 */
function JsonParse(value) {
	try {
		return JSON.parse(value);
	} catch (e) {
		return null;
	}
}


/**
 * Parses a JSON file and returns a JavaScript object.
 * @global
 * @param {string} file - The file to parse.
 * @param {number} codePage - The code page of the JSON document.
 * @returns {object} The JSON object parsed from the file.
 */
function JsonParseFile(file, codePage = 0) {
	return JsonParse(Open(file, codePage));
}


/**
 * Parses JSON and returns an array of objects. If there is an error, the error is logged to the console.
 * @global
 * @param {string} json - The JSON to parse as JSON.
 * @param {string} label - A label to print before parsing the JSON.
 * @param {boolean} log - Whether to log the parsing or not.
 * @returns {object} The parsed JSON in an array of objects and returns an array of objects.
 */
function ParseJson(json, label, log) {
	let parsed = [];
	try {
		if (log) {
			console.log(label + json);
		}
		parsed = JSON.parse(json);
	}
	catch (e) {
		console.log(json);
	}
	return parsed;
}


/**
 * Parses a string pattern to a RegExp object.
 * @global
 * @param {string} patternStr - The string representation of the pattern.
 * @returns {RegExp} The RegExp object.
 */
function ParseStringToRegExp(patternStr) {
	const match = patternStr.match(Regex.UtilRegexParser);
	if (!match) return null;

	const [, exclude, pattern, flags] = match;
	const regex = new RegExp(pattern, flags);

	return exclude ? new RegExp(`!${regex.source}`, regex.flags) : regex;
}


/**
 * Sanitizes a string to be safe for insertion into a JSON config.
 * Removes double quotes, backslashes, newlines and trailing spaces.
 * @global
 * @param {string} str - The string to sanitize.
 * @returns {string} The sanitized string.
 */
function SanitizeJsonString(str) {
	if (typeof str !== 'string') return '';

	return str
		.replace(Regex.PunctQuoteDouble, '')
		.replace(Regex.PathBackslash, '')
		.replace(Regex.BreakLine, ' ')
		.trim();
}


/**
 * Strips comments from a JSON string.
 * Https://github.com/sindresorhus/strip-json-comments/blob/master/index.js.
 * @global
 * @param {string} jsonString - The JSON string to strip comments from.
 * @param {object} options - The options to control how whitespace is stripped.
 * @returns {string} The stripped string. Note that the result may be empty.
 * @throws {TypeError} If `jsonString` is not a string.
 */
function StripJsonComments(jsonString, options = { whitespace: false }) {
	if (typeof jsonString !== 'string') {
		throw new TypeError(`Expected argument \`jsonString\` to be a \`string\`, got \`${typeof jsonString}\``);
	}

	const singleComment = Symbol('singleComment');
	const multiComment = Symbol('multiComment');
	const stripWithoutWhitespace = () => '';
	const stripWithWhitespace = (string, start, end) => string.slice(start, end).replace(Regex.SpaceNon, ' ');
	const strip = options.whitespace === false ? stripWithoutWhitespace : stripWithWhitespace;

	const isEscaped = (jsonString, quotePosition) => {
		let index = quotePosition - 1;
		let backslashCount = 0;

		while (jsonString[index] === '\\') {
			index--;
			backslashCount++;
		}

		return Boolean(backslashCount % 2);
	};

	let insideString;
	let insideComment;
	let offset = 0;
	let result = '';

	for (let i = 0; i < jsonString.length;) {
		const currentCharacter = jsonString[i];
		const nextCharacter = jsonString[i + 1];

		if (!insideComment && currentCharacter === '"') {
			const escaped = isEscaped(jsonString, i);
			if (!escaped) {
				insideString = !insideString;
			}
		}

		if (insideString) {
			i++;
			continue;
		}

		if (!insideComment && currentCharacter + nextCharacter === '//') {
			result += jsonString.slice(offset, i);
			offset = i;
			insideComment = singleComment;
			i += 2;
			continue;
		}
		else if (insideComment === singleComment && (currentCharacter === '\n' || currentCharacter + nextCharacter === '\r\n')) {
			insideComment = false;
			result += strip(jsonString, offset, i);
			offset = i;
			i += (currentCharacter + nextCharacter === '\r\n') ? 2 : 1;
			continue;
		}
		else if (!insideComment && currentCharacter + nextCharacter === '/*') {
			result += jsonString.slice(offset, i);
			offset = i;
			insideComment = multiComment;
			i += 2;
			continue;
		}
		else if (insideComment === multiComment && currentCharacter + nextCharacter === '*/') {
			insideComment = false;
			result += strip(jsonString, offset, i + 2);
			offset = i + 2;
			i += 2;
			continue;
		}
		else {
			i++;
		}
	}

	return result + (insideComment ? strip(jsonString.slice(offset)) : jsonString.slice(offset));
}


/////////////////////////
// * FILE MANAGEMENT * //
/////////////////////////
/**
 * Cleans a given file path by replacing illegal characters, normalizing dashes, and removing unnecessary spaces and trailing dots/spaces.
 * @param {string} value - The file path to clean.
 * @returns {string} - The cleaned file path.
 */
function CleanFilePath(value) {
	if (!value || !value.length) return '';
	const disk = (value.match(Regex.PathDrivePrefix) || [''])[0];
	const pathWithoutDisk = value.replace(disk, '');

	const cleanedParts = pathWithoutDisk.split('\\').map(part => part
		.replace(Regex.PathIllegalFilename, '_')
		.replace(Regex.TextDash, '-')
		.replace(Regex.SpaceNonLeading, '')
		.replace(Regex.EdgeDotSpaceTrailing, '')
	);

	return `${disk}${cleanedParts.join('\\')}`;
}


/**
 * Constructs a file path by replacing patterns with the file extension of the provided file.
 * Replace patterns like *.* with the actual file name, and folder.*, cover.*, front.*
 * with folder.<ext>, cover.<ext>, front.<ext> where <ext> is the file extension of 'file'.
 * @global
 * @param {string} basePath - The base path that may contain patterns to replace.
 * @param {string} file - The file name whose extension will be used for replacement.
 * @param {string} fileExtension - The file extension extracted from the file.
 * @param {string[]} patterns - The array of patterns to replace in the base path.
 * @param {RegExp} [precompiledRegex] - Optional precompiled regex for performance when called frequently.
 * @returns {string} - The constructed file path with patterns replaced by the file extension.
 */
function CreateFilePathWithPatterns(basePath, file, fileExtension, patterns, precompiledRegex) {
	const regex = precompiledRegex || new RegExp(`(\\*|\\b(${patterns.join('|')})\\b)\\.\\*`, 'g');
	return basePath.replace(regex, (_, p1, p2) => p2 ? `${p2}.${fileExtension}` : file);
}


/**
 * Creates the complete directory tree up to the specified folder if it doesn't already exist.
 * @global
 * @param {string} folder - The path of the folder to create.
 * @returns {boolean} True if the folder was successfully created, false otherwise.
 */
function CreateFolder(folder) {
	if (!folder.length) return false;

	folder = CleanFilePath(folder); // Handle root directory and illegal characters

	if (IsFolder(folder)) return true;

	if (folder.startsWith('.\\')) { // Adjust for relative path
		folder = `${fb.FoobarPath}${folder.slice(2)}`;
	}

	try { // Create each folder in the path if it doesn't exist
		folder.split('\\').reduce((acc, part) => {
			const path = `${acc}${part}\\`;
			if (!IsFolder(path)) fso.CreateFolder(path);
			return path;
		}, '');
	}
	catch (e) {
		console.log('\n>>> CreateFolder => Error creating folder:\n', e);
		return false;
	}

	return true;
}


/**
 * Deletes a file or files from the file system.
 * @global
 * @param {string} file - The file or files ("dir\*.*") to delete.
 * @param {boolean} [force] - Whether to force the deletion even if the file doesn't exist.
 * @returns {boolean} True if the file or files were successfully deleted, false otherwise.
 */
function DeleteFile(file, force = true) {
	if (IsFile(file) || file.includes('*')) {
		if (file.startsWith('.\\')) {
			file = fb.FoobarPath + file.slice(2);
		}

		try {
			fso.DeleteFile(file, force);
		} catch (e) {
			return false;
		}

		return !(IsFile(file));
	}

	return false;
}


/**
 * Deletes a folder or folders from the file system.
 * @global
 * @param {string} folder - The folder or folders ("dir\*.*") to delete.
 * @param {boolean} [force] - Whether to force the deletion even if the folder doesn't exist.
 * @returns {boolean} True if the folder was deleted.
 */
function DeleteFolder(folder, force = true) {
	if (IsFolder(folder) || folder.includes('*')) {
		folder = folder
			.replace(Regex.PathRelativeStartsWith, fb.FoobarPath)
			.replace(Regex.PathBackslashEndsWith, '');

		try {
			fso.DeleteFolder(folder, force);
		} catch (e) {
			return false;
		}

		return !IsFolder(folder);
	}

	return false;
}


/**
 * Filters an array of file names, returning only those that match the specified file pattern.
 * @global
 * @param {string[]} files - The array of file names to filter.
 * @param {RegExp|null} [pattern] - The regex pattern to include or exclude files. Use `!` prefix for exclusion.
 * @returns {string[]} The filtered array matching the regex pattern.
 * @example
 * // Include only *.jpg and *.png files:
 * FilterFiles(['image.jpg', 'document.pdf', 'photo.png', 'note.txt'], /\.(jpg|png)$/i);
 * // Returns: ['image.jpg', 'photo.png']
 *
 * // Exclude files matching a custom pattern:
 * FilterFiles(['cd1.jpg', 'discA.png', 'vinyl2.jpg', 'cover.jpg', 'note.txt'], /!(cd|disc|vinyl)([0-9]*|[a-h])\\.(png|jpg)/i);
 * // Returns: ['cover.jpg']
 *
 * // Include only a specific image:
 * FilterFiles(['image.jpg', 'document.pdf', 'photo.png', 'note.txt'], /image\\.jpg/i);
 * // Returns: ['image.jpg']
 */
function FilterFiles(files = [], pattern = null) {
	if (!pattern) return files;

	const excludePattern = pattern.source.startsWith('!');
	const filterRegex = excludePattern ? new RegExp(pattern.source.slice(1), pattern.flags) : pattern;

	return excludePattern ? files.filter(file => !filterRegex.test(file)) : files.filter(file => filterRegex.test(file));
}


/**
 * Converts a path to its 8.3 short path name for maximum compatibility.
 * Handles Unicode, spaces, special chars. Should work on Win7/10/11 and Wine.
 * Falls back to original path if short names are disabled or on error.
 * @global
 * @param {string} path - The full path to convert.
 * @returns {string} The short path or original fallback.
 */
function GetShortPath(path) {
	try {
		if (fso.FileExists(path)) {
			return fso.GetFile(path).ShortPath;
		}
		if (fso.FolderExists(path)) {
			return fso.GetFolder(path).ShortPath;
		}
		return path;
	}
	catch (e) {
		return path;
	}
}


/**
 * Checks if a file exists.
 * @global
 * @param {string} filename - The filename to check.
 * @returns {boolean} True if the file exists.
 */
function IsFile(filename) {
	try {
		return utils.IsFile(filename);
	} catch (e) {
		return false;
	}
}


/**
 * Checks if a folder exists.
 * @global
 * @param {string} folder - The folder to check.
 * @returns {boolean} True if the folder exists.
 */
function IsFolder(folder) {
	try {
		return utils.IsDirectory(folder);
	} catch (e) {
		return false;
	}
}


/**
 * Normalizes a path to an absolute Windows-style path ending with a backslash.
 * Handles arrays (uses first element), evaluates title format strings with '%', and ensures string type.
 * @param {string|string[]|*} path - The path to normalize (string, array, or evaluable).
 * @returns {string} The normalized absolute path.
 */
function NormalizePath(path) {
	path = Array.isArray(path) ? path[0] : path;

	const needsEval = typeof path === 'string' && path.includes('%');
	const raw = needsEval ? fb.TitleFormat(path).Eval(true) : path;
	const normalized = String(raw).replace(Regex.PathForwardSlash, '\\');
	const absolute = fso.GetAbsolutePathName(normalized);

	return `${absolute.replace(Regex.PathBackslashTrailing, '')}\\`;
}


/**
 * Opens a file for reading.
 * @global
 * @param {string} file - The file to open.
 * @param {number} codePage - The code page to open the file in.
 * @returns {string} The contents of the file or '' if the file doesn't exist.
 */
function Open(file, codePage = 0) {
	if (IsFile(file)) {
		if (file.startsWith('.\\')) { file = fb.FoobarPath + file.replace('.\\', ''); }
		return TryMethod('ReadTextFile', utils)(file, codePage) || '';  // Bypasses crash on locked files by another process
	} else {
		return '';
	}
}


/**
 * Opens the Windows file explorer.
 * @global
 * @param {string} c - Command "explorer /open" or "explorer /select" with file path.
 * @returns {*} True if Windows file explorer and file path exist.
 */
function OpenExplorer(c) {
	const run = (c, w) => {
		try {
			if (w === undefined) WshShell.Run(c);
			else WshShell.Run(c, w);
			return true;
		} catch (e) {
			return false;
		}
	};
	if (!run(c)) fb.ShowPopupMessage('Unable to open your file explorer');
}


/**
 * Opens a file in VS Code if installed, otherwise in Notepad.
 * @global
 * @param {string} filePath - The path to the file that you want to open.
 * @returns {*} True if the file exists.
 */
function OpenFile(filePath) {
	if (!RunCmd(`Code ${filePath}`, undefined, false)) {
		RunCmd(`notepad.exe ${filePath}`, undefined, true);
	}
}


/**
 * Saves value to file, if file doesn't exist it will be created.
 * @global
 * @param {string} file - The path to file to save to.
 * @param {string} value - The value to save to file.
 * @param {boolean} bBOM - Whether to write BOM or not.
 * @returns {boolean} True if saved or false with error.
 */
function Save(file, value, bBOM = false) {
	if (file.startsWith('.\\')) { file = fb.FoobarPath + file.replace('.\\', ''); }
	const filePath = utils.SplitFilePath(file)[0];
	if (!IsFolder(filePath)) { CreateFolder(filePath); }
	if (IsFolder(filePath) && utils.WriteTextFile(file, value, bBOM)) {
		return true;
	}
	console.log(`Error saving to ${file}`);
	return false;
}


/**
 * Saves value to file, if file doesn't exist it will be created.
 * @global
 * @param {string} file - The file to save to.
 * @param {string} value - The value to save to file.
 * @param {boolean} bUTF16 - True if value is UTF-16.
 * @returns {boolean} True if file was saved.
 */
function SaveFSO(file, value, bUTF16) {
	if (file.startsWith('.\\')) { file = fb.FoobarPath + file.replace('.\\', ''); }
	const filePath = utils.SplitFilePath(file)[0];
	if (!IsFolder(filePath)) { CreateFolder(filePath); }
	if (IsFolder(filePath)) {
		try {
			const fileObj = fso.CreateTextFile(file, true, bUTF16);
			fileObj.Write(value);
			fileObj.Close();
			return true;
		} catch (e) {}
	}
	console.log(`Error saving to ${file}`);
	return false;
}


/////////////////
// * ACTIONS * //
/////////////////
/**
 * Executes a given function with the provided arguments and returns the result or the error if an exception occurs.
 * @global
 * @param {Function} func - The function to execute.
 * @param {...any} args - Allows to pass any number of arguments to the `attempt` function.
 * @returns {any|Error} The result of the function or the error.
 */
function Attempt(func, ...args) {
	try {
		return func(...args);
	} catch (e) {
		return e;
	}
}


/**
 * Delays the execution of a function until a certain amount of time has passed, with an optional leading execution.
 * @global
 * @param {Function} func - The function to be debounced, will be called after the specified delay has passed.
 * @param {number} delay - The amount of time in milliseconds that the function should wait before executing.
 * @param {boolean} [leading] - The debounced function will be invoked immediately with the current arguments and then regular debouncing.
 * @returns {Function} A new function that will execute the provided `func` after a specified `delay` has passed.
 */
function Debounce(func, delay, { leading } = {}) {
	let timerId;

	return (...args) => {
		if (!timerId && leading) {
			func(...args);
		}
		clearTimeout(timerId);

		timerId = setTimeout(() => func(...args), delay);
	};
}


/**
 * Runs a heavy task and waits for a specific state change before proceeding.
 */
async function ExecuteAndWait(func, condition, maxWait = 5000) {
	func(); // Execute the synchronous heavy lifting
	return await WaitUntil(condition, maxWait);
}


/**
 * Creates a function that can only be called once.
 * The result of the first call is cached and returned on subsequent calls.
 * @global
 * @param {Function} fn - A function to be called only once.
 * @returns {Function} A new function that wraps the `fn` function, caching and returning the result of the first invocation.
 */
function Once(fn) {
	let called = false;
	let result;
	return (...args) => {
		if (!called) {
			result = fn(...args);
			called = true;
		}
		return result;
	};
}


/**
 * Repeats the specified function a specified number of times.
 * @global
 * @param {Function} func - The function to be repeated.
 * @param {number} times - The number of times to repeat the function.
 * @returns {void}
 */
function RepeatFunc(func, times) {
	if (times > 0) {
		func();
		RepeatFunc(func, times - 1);
	}
}


/**
 * Runs a Windows command prompt and returns false if it fails to run.
 * @global
 * @param {string} command - The command for the OS to execute. Typically a webpage, or a path to an executable.
 * @param {boolean} [wait] - Whether to wait for the command to finish.
 * @param {boolean} [show] - Whether to show the command prompt window.
 * @returns {boolean} True if the command was successfully executed.
 */
function RunCmd(command, wait, show) {
	try {
		WshShell.Run(command, show ? 1 : 0, wait || false);
		return true;
	} catch (e) {
		console.log(`RunCmd(): failed to run command ${command}(${e})`);
		return false;
	}
}


/**
 * Throttles the execution rate of a function to ensure it is executed no more frequently than the specified delay period.
 * This is the fastest throttle helper with minimal overhead.
 * @param {Function} func - The function to be throttled.
 * @param {number} delay - The minimum time interval, in milliseconds, that must pass between consecutive function executions.
 * @returns {Function} The throttled version of the provided function.
 */
function Throttle(func, delay) {
	let lastCallTime = 0;

	return (...args) => {
		const now = new Date();

		if (now - lastCallTime >= delay) {
			func(...args);
			lastCallTime = now;
		}
	};
}


/**
 * Throttles the execution rate of a function to ensure it is executed no more frequently than the specified delay period.
 * This advanced version has additional features but incurs slightly more overhead.
 * @param {Function} fn - The function to be throttled.
 * @param {number} delay - The minimum time interval, in milliseconds, that must pass between consecutive function executions.
 * @param {boolean} [immediate] - Whether to execute the function immediately on the first call.
 * @param {object} [parent] - The context (`this` value) to bind the function to.
 * @returns {Function} The throttled version of the provided function.
 */
function ThrottleADV(fn, delay, immediate = false, parent = this) {
	let lastCallTime = 0;
	const boundFunc = fn.bind(parent);

	return (...args) => {
		const now = Date.now();

		if (immediate && !lastCallTime) {
			lastCallTime = now;
			boundFunc(...args);
			return;
		}

		if (now - lastCallTime >= delay) {
			lastCallTime = now;
			boundFunc(...args);
		}
	};
}


/**
 * Creates a function that will try to call the given method on the given object, but will not throw an error if the method does not exist.
 * It's used for methods that don't have a parent to avoid infinite recursion.
 * @global
 * @param {string} fn - The name of the method to call.
 * @param {object} parent - The object on which to call the method.
 * @returns {Function} The function that will try to call the method.
 */
function TryMethod(fn, parent) {
	return (...args) => {
		try {
			return parent[fn](...args);
		} catch (e) { }
	};
}


/**
 * Pauses execution until a condition is true or a timeout is reached.
 * @param {function} condition - Function that returns true/false.
 * @param {number} maxWait - Max time in ms (0 = infinite).
 * @returns {Promise<boolean>} Resolves true if timed out, false if condition met.
 */
function WaitUntil(condition, maxWait = 0) {
	const startTime = Date.now();
	return new Promise(resolve => {
		const interval = setInterval(() => {
			const timedOut = maxWait > 0 && (Date.now() - startTime >= maxWait);
			if (condition() || timedOut) {
				clearInterval(interval);
				resolve(timedOut);
			}
		}, 50);
	});
}


//////////////////
// * CONTROLS * //
//////////////////
/**
 * Disables window resizing if certain conditions are met via UI Wizard.
 * @param {number} m - The mouse mask.
 */
function DisableWindowSizing(m) {
	try {
		if (m && UIWizard && UIWizard.FrameStyle === 3 && !UIWizard.DisableSizing) {
			UIWizard.DisableWindowSizing = true;
		}
	} catch (e) {
		console.log(e);
	}
}


/**
 * Enables window resizing if certain conditions are met via UI Wizard.
 * @param {number} m - The mouse mask.
 */
function EnableWindowSizing(m) {
	try {
		if (UIWizard && UIWizard.FrameStyle === 3 && UIWizard.DisableWindowSizing) {
			UIWizard.DisableWindowSizing = false;
		}
	} catch (e) {
		console.log(e);
	}
}


/**
 * Handles key press actions based on the state of control keys (Ctrl, Alt, Shift).
 * @global
 * @param {object} action - An object mapping key press combinations to their respective actions.
 * @param {Function} [action.ctrlAltShift] - Action to perform if `Ctrl`, `Alt`, and `Shift` keys are all pressed.
 * @param {Function} [action.ctrlAltNoShift] - Action to perform if `Ctrl` and `Alt` keys are pressed without `Shift`.
 * @param {Function} [action.ctrlShift] - Action to perform if both `Ctrl` and `Shift` keys are pressed.
 * @param {Function} [action.ctrlNoShift] - Action to perform if `Ctrl` key is pressed and `Shift` key is not pressed.
 * @param {Function} [action.ctrl] - Action to perform if `Ctrl` key is pressed.
 * @param {Function} [action.altShift] - Action to perform if both `Alt` and `Shift` keys are pressed.
 * @param {Function} [action.altNoShift] - Action to perform if `Alt` key is pressed and `Shift` key is not pressed.
 * @param {Function} [action.alt] - Action to perform if `Alt` key is pressed.
 * @param {Function} [action.shiftNoCtrl] - Action to perform if `Shift` key is pressed and `Ctrl` key is not pressed.
 * @param {Function} [action.shiftNoAlt] - Action to perform if `Shift` key is pressed and `Alt` key is not pressed.
 * @param {Function} [action.shift] - Action to perform if `Shift` key is pressed.
 * @param {Function} [action.default] - Default action to perform if no other key combinations match.
 * @example
 * KeyPressAction({
 *     ctrlAltShift: () => console.log('Ctrl, Alt, and Shift keys pressed'),
 *     ctrlAltNoShift: () => console.log('Ctrl and Alt keys pressed without Shift'),
 *     ctrlShift: () => console.log('Ctrl and Shift keys pressed'),
 *     ctrlNoShift: () => console.log('Ctrl key pressed without Shift'),
 *     ctrl: () => console.log('Ctrl key pressed'),
 *     altShift: () => console.log('Alt and Shift keys pressed'),
 *     altNoShift: () => console.log('Alt key pressed without Shift'),
 *     alt: () => console.log('Alt key pressed'),
 *     shiftNoCtrl: () => console.log('Shift key pressed without Ctrl'),
 *     shiftNoAlt: () => console.log('Shift key pressed without Alt'),
 *     shift: () => console.log('Shift key pressed'),
 *     default: () => console.log('No specific key combination matched')
 * });
 */
function KeyPressAction(action = {}) {
	const CTRL = utils.IsKeyPressed(VKey.CONTROL);
	const ALT = utils.IsKeyPressed(VKey.MENU);
	const SHIFT = utils.IsKeyPressed(VKey.SHIFT);

	const combinations = [
		// Ctrl + Alt combinations
		{ condition: CTRL && ALT && SHIFT, action: action.ctrlAltShift },
		{ condition: CTRL && ALT && !SHIFT, action: action.ctrlAltNoShift },
		// Ctrl combinations
		{ condition: CTRL && SHIFT, action: action.ctrlShift },
		{ condition: CTRL && !SHIFT, action: action.ctrlNoShift },
		{ condition: CTRL, action: action.ctrl },
		// Alt combinations
		{ condition: ALT && SHIFT, action: action.altShift },
		{ condition: ALT && !SHIFT, action: action.altNoShift },
		{ condition: ALT, action: action.alt },
		// Shift combinations
		{ condition: SHIFT && !CTRL, action: action.shiftNoCtrl },
		{ condition: SHIFT && !ALT, action: action.shiftNoAlt },
		{ condition: SHIFT, action: action.shift }
	];

	for (const combo of combinations) {
		if (combo.condition && combo.action) {
			combo.action();
			return;
		}
	}

	if (action.default) action.default();
}


/**
 * Suppresses key events for SHIFT, CONTROL, and MENU keys if they are triggered in quick succession.
 * @param {number} key - The keycode of the key to potentially suppress.
 * @returns {boolean} Whether the key event should be suppressed.
 */
function SuppressKey(key) {
	// Initialize on first call
	if (typeof SuppressKey.savedKey === 'undefined') {
		SuppressKey.savedKey = 0;
	}

	if ((VKey.SHIFT === key || VKey.CONTROL === key || VKey.MENU === key) && SuppressKey.savedKey === key) {
		return true;
	}

	SuppressKey.savedKey = key;
	return false;
}


/**
 * Suppresses mouse movement events if the current position and modifier keys are the same as the last.
 * @param {number} x - The current x-coordinate of the mouse.
 * @param {number} y - The current y-coordinate of the mouse.
 * @param {number} m - The current mouse mask.
 * @returns {boolean} Whether the mouse move event should be suppressed.
 */
function SuppressMouseMove(x, y, m) {
	// Initialize on first call
	if (typeof SuppressMouseMove.savedX === 'undefined') {
		SuppressMouseMove.savedX = 0;
		SuppressMouseMove.savedY = 0;
		SuppressMouseMove.savedM = 0;
	}

	if (SuppressMouseMove.savedX === x && SuppressMouseMove.savedY === y && SuppressMouseMove.savedM === m) {
		return true;
	}

	SuppressMouseMove.savedX = x;
	SuppressMouseMove.savedY = y;
	SuppressMouseMove.savedM = m;
	return false;
}


////////////////
// * COLORS * //
////////////////
/**
 * Converts RGB values to a 32 bit integer.
 * @global
 * @param {number} r - The red channel value in the range of 0-255.
 * @param {number} g - The green channel value in the range of 0-255.
 * @param {number} b - The blue channel value in the range of 0-255.
 * @returns {number} The RGB value as a 32 bit integer.
 */
function RGB(r, g, b) {
	return (0xff000000 | (r << 16) | (g << 8) | (b));
}


/**
 * Converts RGBA values to a 32 bit integer.
 * @global
 * @param {number} r - The red channel value in the range of 0-255.
 * @param {number} g - The green channel value in the range of 0-255.
 * @param {number} b - The blue channel value in the range of 0-255.
 * @param {number} a - The alpha channel value in the range of 0-255.
 * @returns {number} The RGBA value as a 32 bit integer.
 */
function RGBA(r, g, b, a) {
	return ((a << 24) | (r << 16) | (g << 8) | (b));
}


/**
 * Converts RGB to RGBA.
 * @global
 * @param {number} rgb - The RGB triplet to convert.
 * @param {number} a - The alpha value of the color.
 * @returns {number} The RGBA triplet converted to the specified alpha value.
 */
function RGBtoRGBA(rgb, a) {
	return a << 24 | (rgb & 0x00FFFFFF);
}


/**
 * Converts RGBA to RGB.
 * @global
 * @param {number} rgb - The RGB value to convert.
 * @param {number} a - The alpha value to convert.
 * @returns {number} The RGBA value.
 */
function RGBAtoRGB(rgb, a) {
	return (rgb & 0x00FFFFFF) | (a << 24);
}


/**
 * Converts RGB to HEX.
 * @global
 * @param {number} r - The red channel value to convert.
 * @param {number} g - The green channel value to convert.
 * @param {number} b - The blue channel value to convert.
 * @returns {string} The hex representation of the RGB value.
 */
function RGBtoHEX(r, g, b) {
	r = r.toString(16);
	g = g.toString(16);
	b = b.toString(16);
	return (r.length === 1 ? `0${r}` : r) + (g.length === 1 ? `0${g}` : g) + (b.length === 1 ? `0${b}` : b);
}


/**
 * Converts full RGB color value to HEX.
 * @global
 * @param {number} rgb - The RGB value to convert.
 * @returns {string} The HEX value of the RGB value.
 */
function RGBFtoHEX(rgb) {
	let r = rgb >> 16 & 0xff;
	let g = rgb >> 8 & 0xff;
	let b = rgb & 0xff;
	r = r.toString(16);
	g = g.toString(16);
	b = b.toString(16);
	return (r.length === 1 ? `0${r}` : r) + (g.length === 1 ? `0${g}` : g) + (b.length === 1 ? `0${b}` : b);
}


/**
 * Converts RGBA to HEX.
 * @global
 * @param {number} r - The red channel value in the range of 0-255.
 * @param {number} g - The green channel value in the range of 0-255.
 * @param {number} b - The blue channel value in the range of 0-255.
 * @param {number} a - The alpha channel value in the range of 0-255.
 * @returns {string} The RGB triplet as a HEX.
 */
function RGBAtoHEX(r, g, b, a) {
	a = a.toString(16);
	r = r.toString(16);
	g = g.toString(16);
	b = b.toString(16);
	return (a.length === 1 ? `0${a}` : a) + (r.length === 1 ? `0${r}` : r) + (g.length === 1 ? `0${g}` : g) + (b.length === 1 ? `0${b}` : b);
}


/**
 * Converts a hexadecimal string to decimal.
 * @global
 * @param {string} hex - The hexadecimal string to convert.
 * @returns {number} The decimal equivalent.
 */
function HEX(hex) {
	return parseInt(hex, 16);
}


/**
 * Converts a hex string to RGB.
 * @global
 * @param {string} hex - The hex string to convert.
 * @returns {number} The RGB in the hex string.
 */
function HEXtoRGB(hex) {
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	return RGB(r, g, b);
}


/**
 * Converts a hex string to RGBA.
 * @global
 * @param {string} hex - The hex string to convert.
 * @param {number} a - The alpha value of the color.
 * @returns {number} The hex string to RGBA.
 */
function HEXtoRGBA(hex, a) {
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	return RGBA(r, g, b, a);
}


/**
 * Converts HSL values to a 32-bit RGB integer using c-x-m conversion.
 * @param {number} h - The hue value (0-360).
 * @param {number} s - The saturation value (0-100).
 * @param {number} l - The lightness value (0-100).
 * @returns {number} The RGB value as 32-bit integer.
 */
function HSLtoRGB(h, s, l) {
	s /= 100;
	l /= 100;

	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;

	const [r, g, b] =
		h < 60  ? [c, x, 0] :
		h < 120 ? [x, c, 0] :
		h < 180 ? [0, c, x] :
		h < 240 ? [0, x, c] :
		h < 300 ? [x, 0, c] :
				  [c, 0, x];

	return RGB(
		Math.round((r + m) * 255),
		Math.round((g + m) * 255),
		Math.round((b + m) * 255)
	);
}


/**
 * Checks if a string is a valid hexadecimal number.
 * @global
 * @param {string} hex - The string to check.
 * @returns {boolean} Whether the string is a valid hexadecimal number.
 */
function IsHEX(hex) {
	return typeof hex === 'string' && hex.length === 6 && !isNaN(Number(`0x${hex}`))
}


/**
 * Gets the alpha value of a color.
 * @global
 * @param {number} color - The RGB color value with or without alpha channel.
 * @returns {number} The alpha value of the color.
 */
function GetAlpha(color) {
	return ((color >> 24) & 0xff);
}


/**
 * Returns a blended color based on blend factor.
 * @global
 * @param {number} c1 - The color to blend with c2.
 * @param {number} c2 - The color to blend with c1.
 * @param {number} f - The blend factor from 0-1.
 * @returns {number} The blended color as RGBA.
 */
function GetBlend(c1, c2, f) {
	const nf = 1 - f;
	c1 = ToRGBA(c1);
	c2 = ToRGBA(c2);
	const r = c1[0] * f + c2[0] * nf;
	const g = c1[1] * f + c2[1] * nf;
	const b = c1[2] * f + c2[2] * nf;
	const a = c1[3] * f + c2[3] * nf;
	return RGBA(Math.round(r), Math.round(g), Math.round(b), Math.round(a));
}


/**
 * Returns the red value of a color.
 * @global
 * @param {number} color - The color value to convert, must be in the range of 0-255.
 * @returns {number} The red value of a color.
 */
function GetRed(color) {
	return ((color >> 16) & 0xff);
}


/**
 * Returns the green value of a color.
 * @global
 * @param {number} color - The color value to convert, must be in the range of 0-255.
 * @returns {number} The green value of a color.
 */
function GetGreen(color) {
	return ((color >> 8) & 0xff);
}


/**
 * Returns the blue value of a color.
 * @global
 * @param {number} color - The color value to convert, must be in the range of 0-255.
 * @returns {number} The blue value of a color.
 */
function GetBlue(color) {
	return (color & 0xff);
}


/**
 * Converts a color value to RGB.
 * @global
 * @param {number} c - The color value to convert.
 * @returns {Array} The RGB value of the color.
 */
function ToRGB(c) {
	return [c >> 16 & 0xff, c >> 8 & 0xff, c & 0xff];
}


/**
 * Converts a color value to RGBA.
 * @global
 * @param {number} c - The color value to convert.
 * @returns {Array} The RGBA value of the color.
 */
function ToRGBA(c) {
	return [c >> 16 & 0xff, c >> 8 & 0xff, c & 0xff, c >> 24 & 0xff];
}


/**
 * Calculates the brightness of a color.
 * @global
 * @param {number} c - The color to calculate the brightness of, must be in the range of 0-255.
 * @returns {number} The brightness of the color in the range of 0-255.
 */
function CalcBrightnessOld(c) {
	const r = GetRed(c);
	const g = GetGreen(c);
	const b = GetBlue(c);
	return Math.round(Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b));
}


/**
 * Calculates the brightness of a color based on the provided color type.
 * @global
 * @param {string} type - The type of the color. Supported types are 'RGB', 'RGBA', 'HEX', 'IMG', 'IMGCOLOR'.
 * @param {number} color - The color to calculate the brightness of, must be in the range of 0-255.
 * @param {GdiBitmap} image - The image to calculate brightness for, used for 'IMG' and 'IMGCOLOR' color types.
 * @returns {number} The brightness of the color.
 */
function CalcBrightness(type, color, image) {
	const colorTypes = {
		RGB: (color) => Color.BRT(color),
		RGBA: (color) => Color.BRT(RGBAtoRGB(color)),
		HEX: (color) => Color.BRT(HEXtoRGB(color)),
		IMG: (color, image) => CalcImgBrightness(image),
		IMGCOLOR: (color, image) => Color.BRT(color) + CalcImgBrightness(image)
	};

	return colorTypes[type](color, image);
}


/**
 * Calculates the average brightness of an image.
 * @global
 * @param {GdiBitmap} image - The image to calculate brightness for.
 * @returns {number} The average brightness of the image.
 */
function CalcImgBrightness(image) {
	try {
		const colorSchemeArray = JSON.parse(image.GetColourSchemeJSON(15));
		let rTot = 0;
		let gTot = 0;
		let bTot = 0;
		let freqTot = 0;

		for (const v of colorSchemeArray) {
			const col = ToRGB(v.col);
			rTot += col[0] ** 2 * v.freq;
			gTot += col[1] ** 2 * v.freq;
			bTot += col[2] ** 2 * v.freq;
			freqTot += v.freq;
		}

		const avgCol =
			Math.round([
			Clamp(Math.round(Math.sqrt(rTot / freqTot)), 0, 255) +
			Clamp(Math.round(Math.sqrt(gTot / freqTot)), 0, 255) +
			Clamp(Math.round(Math.sqrt(bTot / freqTot)), 0, 255)
			] / 3);

		if (grCfg.settings.showDebugThemeLog) console.log('Image brightness:', avgCol);
		return avgCol;
	}
	catch (e) {
		console.log('\n>>> Error => CalcImgBrightness failed!\n');
		return 0;
	}
}


/**
 * Calculates the color distance between two colors.
 * Currently uses the redmean calculation from https://en.wikipedia.org/wiki/Color_difference.
 * The purpose of this method is mostly to determine whether a color drawn next to another color will
 * provide enough visual separation. As such, adding some additional weighting based on individual colors differences.
 * @global
 * @param {number} a - The first color in numeric form (i.e. RGB(150,250,255)).
 * @param {number} b - The second color in numeric form (i.e. RGB(150,250,255)).
 * @param {boolean} [log] - Whether to print the distance in the console. Also requires that settings.showDebugThemeLog is true.
 * @returns {number} The color distance as a numeric value.
 */
function ColorDistance(a, b, log) {
	const aCol = new Color(a);
	const bCol = new Color(b);

	const rho = (aCol.r + bCol.r) / 2;
	const rDiff = aCol.r - bCol.r;
	const gDiff = aCol.g - bCol.g;
	const bDiff = aCol.b - bCol.b;
	const deltaR = rDiff ** 2;
	const deltaG = gDiff ** 2;
	const deltaB = bDiff ** 2;

	// const distance = Math.sqrt(2 * deltaR + 4 * deltaG + 3 * deltaB + (rho * (deltaR - deltaB))/256); // Old version
	let distance = Math.sqrt((2 + rho / 256) * deltaR + 4 * deltaG + (2 + (255 - rho) / 256) * deltaB); // Redmean calculation
	if (rDiff >= 50 || gDiff >= 50 || bDiff >= 50) {
		// Because the colors we are diffing against are usually shades of grey, if one of the colors has a diff of 50 or more,
		// then it's very likely there will be enough visual separation between the two, so bump up the diff percentage.
		distance *= 1.1;
	}
	if (log && grCfg.settings.showDebugThemeLog) {
		console.log('Distance from:', aCol.getRGB(), 'to:', bCol.getRGB(), '=', distance);
	}
	return distance;
}


/**
 * Converts a color to RGB. If the alpha is less than 255, it will be converted to RGBA.
 * @global
 * @param {number} c - The color to convert.
 * @param {boolean} showPrefix - Whether to include the "rgb" or "rgba" prefix.
 * @returns {string} The color in RGB format.
 */
function ColToRgb(c, showPrefix) {
	if (typeof showPrefix === 'undefined') showPrefix = true;
	const alpha = GetAlpha(c);
	let prefix = '';
	if (alpha < 255) {
		if (showPrefix) prefix = 'RGBA';
		return `${prefix}(${GetRed(c)}, ${GetGreen(c)}, ${GetBlue(c)}, ${alpha})`;
	} else {
		if (showPrefix) prefix = 'RGB';
		return `${prefix}(${GetRed(c)}, ${GetGreen(c)}, ${GetBlue(c)})`;
	}
}


/**
 * Converts a color string in hexadecimal or RGB format to an RGB integer value.
 * The function supports colors in hexadecimal format (#FFFFFF) and RGB format (rgb(255,255,255)).
 * @global
 * @param {string} colorStr - The color string to convert.
 * @returns {number} The corresponding RGB value as an integer, or 0xff000000 if the string cannot be parsed.
 */
function ColStringToRGB(colorStr) {
	// If the color is in hex format
	if (colorStr.startsWith('#')) {
		return parseInt(colorStr.slice(1), 16);
	}
	// If the color is in rgb format
	const rgb = colorStr.match(Regex.ColorRGBLoose);
	if (rgb) return RGB(parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3]));

	return 0xff000000;
}


/**
 * Converts a color object to HSL.
 * @global
 * @param {number} col - The color object with hue, saturation and lightness properties.
 * @returns {string} HSL representation of the color.
 */
function ColorToHSLString(col) {
	return `${LeftPad(col.hue, 3)} ${LeftPad(col.saturation, 3)} ${LeftPad(col.lightness, 3)}`;
}


/**
 * Combines two colors based on a fraction. The fraction should be between 0 and 1.
 * @global
 * @param {number} c1 - The first color to combine. This can be an array of [red, green, blue] values or a color object.
 * @param {number} c2 - The second color to combine. This can be an array of [red, green, blue] values or a color object.
 * @param {number} f - The fraction of the colors to combine. 0 means c1 is the same as c2 100% means c2 is the same as c1.
 * @returns {number} When f is 0, result is 100% color1. When f is 1, result is 100% color2.
 */
function CombineColors(c1, c2, f) {
	c1 = ToRGB(c1);
	c2 = ToRGB(c2);

	const r = Math.round(c1[0] + f * (c2[0] - c1[0]));
	const g = Math.round(c1[1] + f * (c2[1] - c1[1]));
	const b = Math.round(c1[2] + f * (c2[2] - c1[2]));

	return (0xff000000 | (r << 16) | (g << 8) | (b));
}


/**
 * Darkens a color value based on a percentage.
 * @global
 * @param {number} color - The color to darken.
 * @param {number} percent - The percentage of the color to darken.
 * @returns {number} The darkened color value in the range of 0-255.
 */
function DarkenColorVal(color, percent) {
	const shift = Math.max(color * percent / 100, percent / 2);
	const val = Math.round(color - shift);
	return Math.max(val, 0);
}


/**
 * Lightens a color value based on a percentage.
 * @global
 * @param {number} color - The color to lighten.
 * @param {number} percent - The percentage of the color to lighten.
 * @returns {number} The lightened color value in the range of 0-255.
 */
function LightenColorVal(color, percent) {
	const val = Math.round(color + ((255 - color) * (percent / 100)));
	return Math.min(val, 255);
}


/**
 * Shades a color by a certain percentage.
 * @global
 * @param {number} color - The color to shade.
 * @param {number} percent - The percentage to shade the color by.
 * @returns {number} Returns the shaded color.
 */
function ShadeColor(color, percent) {
	const red = GetRed(color);
	const green = GetGreen(color);
	const blue = GetBlue(color);

	return RGBA(DarkenColorVal(red, percent), DarkenColorVal(green, percent), DarkenColorVal(blue, percent), GetAlpha(color));
}


/**
 * Tints a color by a certain percentage.
 * @global
 * @param {number} color - The color to tint.
 * @param {number} percent - The percentage to tint the color by.
 * @returns {number} Returns the tinted color.
 */
function TintColor(color, percent) {
	const red = GetRed(color);
	const green = GetGreen(color);
	const blue = GetBlue(color);

	return RGBA(LightenColorVal(red, percent), LightenColorVal(green, percent), LightenColorVal(blue, percent), GetAlpha(color));
}


//////////////////
// * GRAPHICS * //
//////////////////
/**
 * A class that represents the position and dimensions of an image.
 * @global
 */
class ImageSize {
	/**
	 * Creates the `ImageSize` instance.
	 * Initializes the size and position of the image.
	 * @param {number} x - The x-coordinate of the image.
	 * @param {number} y - The y-coordinate of the image.
	 * @param {number} w - The width of the image.
	 * @param {number} h - The height of the image.
	 */
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
}


/**
 * A class that encapsulates the creation and management of GDI image and graphics objects.
 * It ensures that only one instance of each object exists within the application at a time (singleton pattern).
 * @global
 * @example
 * Use GdiService.getInstance() to access the singleton instance of this service throughout the application:
 * const gdiService = GdiService.getInstance();
 * const g = gdiService.getGraphics();
 */
class GdiService {
	/**
	 * Creates the `GdiService` instance.
	 * Initializes a new instance of the GdiService class.
	 */
	constructor() {
		/** @private @type {?GdiBitmap} */
		this.image = null;
		/** @private @type {?GdiGraphics} */
		this.graphics = null;
	}

	/**
	 * Gets the GDI image object, creating it if it doesn't exist.
	 * @returns {GdiBitmap} The GDI image object.
	 */
	getImage() {
		if (!this.image) {
			this.image = gdi.CreateImage(1, 1);
		}
		return this.image;
	}

	/**
	 * Gets the GDI graphics object, creating it if it doesn't exist.
	 * @returns {GdiGraphics} The GDI graphics object.
	 */
	getGraphics() {
		if (!this.graphics) {
			const image = this.getImage();
			this.graphics = image.GetGraphics();
		}
		return this.graphics;
	}

	/**
	 * Releases the graphics object associated with the GDI image.
	 * @param {GdiGraphics} graphics - The GDI graphics object to release.
	 */
	releaseGraphics(graphics) {
		const image = this.getImage();
		image.ReleaseGraphics(graphics);
	}

	/**
	 * Retrieves the singleton instance of the GdiService class, creating it if it doesn't exist.
	 * @returns {GdiService} The singleton instance of the GdiService class.
	 * @static
	 */
	static getInstance() {
		if (!GdiService.instance) {
			GdiService.instance = new GdiService();
		}
		return GdiService.instance;
	}
}


/**
 * Creates a GDI graphics object.
 * @global
 * @param {number} w - The width of the graphics object.
 * @param {number} h - The height of the graphics object.
 * @param {boolean} img - Is the graphics type an image (true) or a text object (false).
 * @param {Function} func - The function to call the graphics object.
 * @returns {GdiGraphics|null} The created or recycled GDI graphics object.
 */
function GDI(w, h, img, func) {
	if (isNaN(w) || isNaN(h)) return null;

	const i = gdi.CreateImage(Math.max(w, 2), Math.max(h, 2));
	let g = i.GetGraphics();

	func(g, i);
	i.ReleaseGraphics(g);
	g = null;

	return img ? i : null;
}


/**
 * Combines two images into a single image.
 * @global
 * @param {GdiBitmap} img1 - The first image.
 * @param {GdiBitmap} img2 - The second image.
 * @param {number} w - The width for the combined image.
 * @param {number} h - The height for the combined image.
 * @returns {GdiBitmap} The combined image.
 */
function CombineImages(img1, img2, w, h) {
	if (w < 1 || h < 1) return null;

	const combinedImg = gdi.CreateImage(w, h);
	const gotGraphics = combinedImg.GetGraphics();

	gotGraphics.DrawImage(img1, 0, 0, w, h, 0, 0, img1.Width, img1.Height);
	gotGraphics.DrawImage(img2, 0, 0, w, h, 0, 0, img2.Width, img2.Height);
	combinedImg.ReleaseGraphics(gotGraphics);

	return combinedImg;
}


/**
 * Crops an image with optional width and/or height.
 * @global
 * @param {GdiBitmap} image - The image to crop.
 * @param {number} [cropWidth] - The width to crop from the image. If 0, no width cropping is performed.
 * @param {number} [cropHeight] - The height to crop from the image. If 0, no height cropping is performed.
 * @returns {GdiBitmap} The cropped image.
 */
function CropImage(image, cropWidth = 0, cropHeight = 0) {
	const SCALE1 = SCALE(1);
	const croppedWidth = Clamp(cropWidth, 0, image.Width);
	const croppedHeight = Clamp(cropHeight, 0, image.Height);
	const maskWidth = image.Width - croppedWidth;
	const maskHeight = image.Height - croppedHeight;

	if (maskWidth < SCALE1 || maskHeight < SCALE1) return image;

	const maskX = croppedWidth / 2;
	const maskY = croppedHeight / 2;

	// * Mask
	const maskImg = gdi.CreateImage(maskWidth + SCALE1, maskHeight + SCALE1);
	let g = maskImg.GetGraphics();
	g.FillSolidRect(0, 0, maskWidth, maskHeight, 0xff000000);
	maskImg.ReleaseGraphics(g);

	// * Canvas with cropped image
	const croppedImg = gdi.CreateImage(maskWidth + SCALE1, maskHeight + SCALE1);
	g = croppedImg.GetGraphics();
	g.SetSmoothingMode(SmoothingMode.None);
	g.DrawImage(image, 0, 0, maskWidth, maskHeight, maskX, maskY, maskWidth, maskHeight);
	croppedImg.ReleaseGraphics(g);
	croppedImg.ApplyMask(maskImg);

	return croppedImg;
}


/**
 * Creates a round rectangle with additional safeguards for arc dimensions.
 * This is a custom method that ensures the arc dimensions are valid and non-negative,
 * preventing crashes not handled by the native SMP's `DrawRoundRect` method.
 * @global
 * @param {GdiGraphics} gr - The GDI graphics object.
 * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
 * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
 * @param {number} w - The width of the rectangle.
 * @param {number} h - The height of the rectangle.
 * @param {number} arc_width - The width of the arcs for the rounded corners.
 * @param {number} arc_height - The height of the arcs for the rounded corners.
 * @param {number} line_width - The line width of the rectangle.
 * @param {number} color - The fill color of the rectangle.
 * @returns {GdiGraphics} The round rectangle.
 */
function DrawRoundRect(gr, x, y, w, h, arc_width, arc_height, line_width, color) {
	if (w < 1 || h < 1) return null;

	// * Arc dimension safeguard
	const minArc = Math.min(w, h) / 2;
	arc_width  = Math.max(0, Math.min(arc_width, minArc));
	arc_height = Math.max(0, Math.min(arc_height, minArc));

	return gr.DrawRoundRect(x, y, w, h, arc_width, arc_height, line_width, color);
}


/**
 * Creates a blended filled round rectangle, a custom method not implemented in SMP.
 * @global
 * @param {GdiGraphics} gr - The GDI graphics object.
 * @param {number} x - The x-coordinate of the rectangle.
 * @param {number} y - The y-coordinate of the rectangle.
 * @param {number} w - The width of the rectangle.
 * @param {number} h - The height of the rectangle.
 * @param {number} arc_width - The width of the arcs.
 * @param {number} arc_height - The height of the arcs.
 * @param {number} [angle] - The angle of the arc in degrees.
 * @param {number} [focus] - The focus where the centered color will be at its highest intensity. Values 0 or 1.
 * @returns {GdiGraphics} The blended filled round rectangle.
 */
function FillBlendedRoundRect(gr, x, y, w, h, arc_width, arc_height, angle, focus) {
	const SCALE1 = SCALE(1);

	if (w < SCALE1 || h < SCALE1) return null;

	// * Mask
	const maskImg = gdi.CreateImage(w + SCALE1, h + SCALE1);
	let g = maskImg.GetGraphics();
	g.FillSolidRect(0, 0, w, h, 0xffffffff);
	g.SetSmoothingMode(SmoothingMode.AntiAlias);
	FillRoundRect(g, 0, 0, w - SCALE1, h - SCALE1, arc_width, arc_height, 0xff000000);
	maskImg.ReleaseGraphics(g);

	// * Blended rect
	const gradRectImg = gdi.CreateImage(w + SCALE1, h + SCALE1);
	g = gradRectImg.GetGraphics();
	g.DrawImage(grCol.imgBlended, 0, 0, w - SCALE1, h - SCALE1, 0, h, grCol.imgBlended.Width, grCol.imgBlended.Height);
	gradRectImg.ReleaseGraphics(g);

	const mask = maskImg.Resize(w + SCALE1, h + SCALE1);
	gradRectImg.ApplyMask(mask);

	return gr.DrawImage(gradRectImg, x, y, w - SCALE1, h - SCALE1, 0, 0, w, h, 0, 255);
}


/**
 * Creates a gradient filled ellipse, a custom method not implemented in SMP.
 * @global
 * @param {GdiGraphics} gr - The GDI graphics object.
 * @param {number} x - The X-coordinate of the ellipse.
 * @param {number} y - The Y-coordinate of the ellipse.
 * @param {number} w - The width of the ellipse.
 * @param {number} h - The height of the ellipse.
 * @param {number} angle - The angle of the ellipse in degrees.
 * @param {number} color1 - The color of the top side of the ellipse.
 * @param {number} color2 - The color of the bottom side of the ellipse.
 * @param {number} focus - The focus where the centered color will be at its highest intensity. Values 0 or 1.
 * @returns {GdiGraphics} The gradient filled ellipse.
 */
function FillGradEllipse(gr, x, y, w, h, angle, color1, color2, focus) {
	const SCALE1 = SCALE(1);
	const SCALE3 = 3 * SCALE1;
	const innerW = w - SCALE3;
	const innerH = h - SCALE3;
	const offset = Math.floor(SCALE1);

	if (w < SCALE3 || h < SCALE3) return null;

	// * Mask
	const maskImg = gdi.CreateImage(w + SCALE1, h + SCALE1);
	let g = maskImg.GetGraphics();
	g.FillSolidRect(0, 0, w, h, 0xffffffff);
	g.SetSmoothingMode(SmoothingMode.AntiAlias);
	g.FillEllipse(offset, offset, innerW, innerH, 0xff000000);
	maskImg.ReleaseGraphics(g);

	// * Gradient ellipse
	const gradEllipseImg = gdi.CreateImage(w + SCALE1, h + SCALE1);
	g = gradEllipseImg.GetGraphics();
	FillGradRect(g, offset, offset, innerW, innerH, angle, color1, color2, focus);
	gradEllipseImg.ReleaseGraphics(g);

	const mask = maskImg.Resize(w + SCALE1, h + SCALE1);
	gradEllipseImg.ApplyMask(mask);

	return gr.DrawImage(gradEllipseImg, x, y, w - SCALE1, h - SCALE1, 0, 0, w, h, 0, 255);
}


/**
 * Creates a filled gradient rectangle with additional safeguards for size dimensions.
 * This is a custom method that ensures the size dimensions are valid and non-negative,
 * preventing crashes not handled by the native SMP's `FillGradRect` method.
 * @global
 * @param {GdiGraphics} gr - The GDI graphics object.
 * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
 * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
 * @param {number} w - The width of the rectangle.
 * @param {number} h - The height of the rectangle.
 * @param {number} angle - The angle of the gradient in degrees.
 * @param {number} color1 - The first color of the gradient.
 * @param {number} color2 - The second color of the gradient.
 * @param {number} [focus] - The focus where the centered color will be at its highest intensity. Values 0 or 1.
 * @returns {GdiGraphics} The filled rectangle.
 */
function FillGradRect(gr, x, y, w, h, angle, color1, color2, focus = 1) {
	if (w < 1 || h < 1) return null;

	return gr.FillGradRect(x, y, w, h, angle, color1, color2, focus);
}


/**
 * Creates a gradient filled round rectangle, a custom method not implemented in SMP.
 * @global
 * @param {GdiGraphics} gr - The GDI graphics object.
 * @param {number} x - The X-coordinate of the rectangle.
 * @param {number} y - The Y-coordinate of the rectangle.
 * @param {number} w - The width of the rectangle.
 * @param {number} h - The height of the rectangle.
 * @param {number} arc_width - The width of the arcs.
 * @param {number} arc_height - The height of the arcs.
 * @param {number} angle - The angle of the arc in degrees.
 * @param {number} color1 - The color of the top side of the gradient.
 * @param {number} color2 - The color of the bottom side of the gradient.
 * @param {number} [focus] - The focus where the centered color will be at its highest intensity. Values 0 or 1.
 * @returns {GdiGraphics} The gradient filled rounded rectangle.
 */
function FillGradRoundRect(gr, x, y, w, h, arc_width, arc_height, angle, color1, color2, focus = 1) {
	const SCALE1 = SCALE(1);

	if (w < SCALE1 || h < SCALE1) return null;

	// * Mask
	const maskImg = gdi.CreateImage(w + SCALE1, h + SCALE1);
	let g = maskImg.GetGraphics();
	g.FillSolidRect(0, 0, w, h, 0xffffffff);
	g.SetSmoothingMode(SmoothingMode.AntiAlias);
	FillRoundRect(g, 0, 0, w - SCALE1, h - SCALE1, arc_width, arc_height, 0xff000000);
	maskImg.ReleaseGraphics(g);

	// * Gradient rect
	const gradRectImg = gdi.CreateImage(w + SCALE1, h + SCALE1);
	g = gradRectImg.GetGraphics();
	FillGradRect(g, 0, 0, w - SCALE1, h - SCALE1, angle, color1, color2, focus);
	gradRectImg.ReleaseGraphics(g);

	const mask = maskImg.Resize(w + SCALE1, h + SCALE1);
	gradRectImg.ApplyMask(mask);

	return gr.DrawImage(gradRectImg, x, y, w - SCALE1, h - SCALE1, 0, 0, w, h, 0, 255);
}


/**
 * Creates a filled rounded rectangle with additional safeguards for arc dimensions.
 * This is a custom method that ensures the arc dimensions are valid and non-negative,
 * preventing crashes not handled by the native SMP's `FillRoundRect` method.
 * @global
 * @param {GdiGraphics} gr - The GDI graphics object.
 * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
 * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
 * @param {number} w - The width of the rectangle.
 * @param {number} h - The height of the rectangle.
 * @param {number} arc_width - The width of the arcs for the rounded corners.
 * @param {number} arc_height - The height of the arcs for the rounded corners.
 * @param {number} color - The fill color of the rectangle.
 * @returns {GdiGraphics} The filled rounded rectangle.
 */
function FillRoundRect(gr, x, y, w, h, arc_width, arc_height, color) {
	if (w < 1 || h < 1) return null;

	// * Arc dimension safeguard
	const minArc = Math.min(w, h) / 2;
	arc_width  = Math.max(0, Math.min(arc_width, minArc));
	arc_height = Math.max(0, Math.min(arc_height, minArc));

	return gr.FillRoundRect(x, y, w, h, arc_width, arc_height, color);
}


/**
 * Masks the given image with the specified rectangular area.
 * @global
 * @param {GdiGraphics} img - The image to be masked.
 * @param {number} x - The x-coordinate of the rectangular mask area.
 * @param {number} y - The y-coordinate of the rectangular mask area.
 * @param {number} w - The width of the rectangular mask area.
 * @param {number} h - The height of the rectangular mask area.
 * @param {boolean} [inverted] - If true, the mask will be inverted.
 * @returns {GdiGraphics} The masked image.
 */
function MaskImage(img, x, y, w, h, inverted = false) {
	const imgW = img.Width;
	const imgH = img.Height;

	if (!imgW || !imgH || w < 1 || h < 1) return null;

	const maskedImg = gdi.CreateImage(imgW, imgH);
	const g = maskedImg.GetGraphics();
	const mask = gdi.CreateImage(imgW, imgH);
	const mg = mask.GetGraphics();

	g.DrawImage(img, 0, 0, imgW, imgH, 0, 0, imgW, imgH);

	const maskColor = inverted ? RGB(0, 0, 0) : RGB(255, 255, 255);
	const unmaskColor = inverted ? RGB(255, 255, 255) : RGB(0, 0, 0);

	mg.FillSolidRect(0, 0, imgW, imgH, maskColor);  // Apply the mask to the entire image
	mg.FillSolidRect(0, 0, imgW, y, unmaskColor); // Unmask the top area
	mg.FillSolidRect(0, y + h, imgW, imgH - (y + h), unmaskColor); // Unmask the bottom area

	maskedImg.ApplyMask(mask);
	mask.ReleaseGraphics(mg);
	maskedImg.ReleaseGraphics(g);

	return maskedImg;
}


/**
 * Creates a rotated image, mostly used for disc art.
 * @global
 * @param {GdiBitmap} img - The source image.
 * @param {number} w - The width of image.
 * @param {number} h - The height of image.
 * @param {number} [degrees] - The degrees are clockwise.
 * @param {number} [imgMaxRes] - The maximum resolution for the image.
 * @returns {GdiBitmap|null} The rotated image or null if an error occurs.
 */
function RotateImage(img, w, h, degrees, imgMaxRes = w) {
	if (!img || !img.Width || !img.Height || w < 1 || h < 1) {
		return null
	}

	w = Math.floor(Math.min(w, imgMaxRes));
	h = Math.floor(Math.min(h, imgMaxRes));

	if (degrees === 0) {
		return img.Clone(0, 0, img.Width, img.Height).Resize(w, h);
	}

	const rotatedImg = gdi.CreateImage(w, h);
	const gotGraphics = rotatedImg.GetGraphics();
	gotGraphics.DrawImage(img, 0, 0, w, h, 0, 0, img.Width, img.Height, degrees);
	rotatedImg.ReleaseGraphics(gotGraphics);

	return rotatedImg;
}


/**
 * Scales an image with various scaling modes.
 * This function includes modes for `default`, `filled`, or `stretched` scaling.
 * @global
 * @param {GdiGraphics} img - The image to draw.
 * @param {string} mode - The mode of drawing the image ('default', 'filled', 'stretched').
 * @param {number} x - The x-coordinate of the top-left corner.
 * @param {number} y - The y-coordinate of the top-left corner.
 * @param {number} w - The width of the area to draw the image in.
 * @param {number} h - The height of the area to draw the image in.
 * @param {number} srcX - The x-coordinate of the top-left corner of the source area.
 * @param {number} srcY - The y-coordinate of the top-left corner of the source area.
 * @param {number} srcW - The width of the source area.
 * @param {number} srcH - The height of the source area.
 * @returns {GdiGraphics} The scaled drawn image.
 */
function ScaleImage(img, mode, x, y, w, h, srcX, srcY, srcW, srcH) {
	if (!img || !img.Width || !img.Height || w < 1 || h < 1) {
		console.log('Invalid image passed to ScaleImage', img);
		return null;
	}

	const imgRatio = img.Width / img.Height;
	const areaRatio = w / h;

	const modes = {
		default: imgRatio > areaRatio ?
		{ width: w, height: w / imgRatio, offsetX: 0, offsetY: (h - w / imgRatio) / 2 } :
		{ width: h * imgRatio, height: h, offsetX: (w - h * imgRatio) / 2, offsetY: 0 },

		filled: imgRatio > areaRatio ?
		{ width: h * imgRatio, height: h, offsetX: (w - h * imgRatio) / 2, offsetY: 0 } :
		{ width: w, height: w / imgRatio, offsetX: 0, offsetY: (h - w / imgRatio) / 2 },

		stretched:
		{ width: w, height: h, offsetX: 0, offsetY: 0 }
	};

	const { width, height, offsetX, offsetY } = modes[mode];
	const scaledImg = gdi.CreateImage(w, h);
	const g = scaledImg.GetGraphics();

	g.DrawImage(img, offsetX, offsetY, width, height, srcX, srcY, srcW, srcH);
	scaledImg.ReleaseGraphics(g);

	return scaledImg;
}


/**
 * Creates a drop shadow rectangle.
 * @global
 * @param {number} x - The x-coordinate.
 * @param {number} y - The y-coordinate.
 * @param {number} w - The width.
 * @param {number} h - The height.
 * @param {number} radius - The shadow radius.
 * @param {number} color - The shadow color.
 * @returns {GdiBitmap} The image object with the applied drop shadow.
 */
function ShadowRect(x, y, w, h, radius, color) {
	if (w < 1 || h < 1) return null;

	const shadow = gdi.CreateImage(w + 2 * radius, h + 2 * radius);
	const shimg = shadow.GetGraphics();

	shimg.FillRoundRect(x, y, w, h, 0.5 * radius, 0.5 * radius, color);
	shadow.ReleaseGraphics(shimg);
	shadow.StackBlur(radius);

	return shadow;
}


/////////////////
// * DISPLAY * //
/////////////////
/**
 * Sets the appropriate value based on detected display mode.
 * @template T
 * @global
 * @param {T} valHD - The value to use for HD display mode.
 * @param {T} valQHD - The value to use for QHD display mode.
 * @param {T|null} val4K - The value to use for 4K display mode.
 * Optional; if not provided, HD or QHD values will be used as fallbacks.
 * @returns {T} The selected value based on the current display mode.
 */
function HD_QHD_4K(valHD, valQHD, val4K = null) {
	if (RES._4K && val4K !== null) return val4K;
	return RES._QHD ? valQHD : valHD;
}


/**
 * Sets the appropriate value based on detected display mode for HD and 4K only.
 * @template T
 * @global
 * @param {T} valHD - The value to use for HD display mode.
 * @param {T|null} val4K - The value to use for 4K display mode.
 * Optional; if not provided, HD value will be used as fallback.
 * @returns {T} The selected value based on the current display mode.
 */
function HD_4K(valHD, val4K = null) {
	if (RES._4K && val4K !== null) return val4K;
	return valHD;
}


/**
 * Scales the value based on 4K mode and the display scale setting.
 * @global
 * @param {number} val - The value that needs to be scaled.
 * @returns {number} The scaled value.
 */
function SCALE(val) {
	const baseScale = RES._4K ? 2 : 1;
	const scaleFactor = grSet.displayScale / 100;
	return val * baseScale * scaleFactor;
}


/**
 * Sets the mouse cursor using the specified cursor symbol name.
 * @global
 * @param {string} symbol - The name of the cursor symbol.
 */
function SetCursor(symbol) {
	if (Cursor[symbol] !== undefined) {
		window.SetCursor(Cursor[symbol]);
	} else {
		window.SetCursor(Cursor.Arrow);
	}
}


///////////////
// * FONTS * //
///////////////
/**
 * Given an array of fonts, returns a single font which the given text will fully fit the availableWidth,
 * or the last font in the list (should be the smallest and text will be truncated).
 * @global
 * @param {GdiGraphics} gr - The GDI graphics object.
 * @param {number} availableWidth - The maximum width the text should be.
 * @param {string} text - The text to be measured.
 * @param {Array} fontList - The list of fonts to choose from.
 * @param {number} maxLines - The maximum number of lines the text should be.
 * @returns {GdiFont|null} The font that fits the given width, or null if no font fits.
 */
function ChooseFontForWidth(gr, availableWidth, text, fontList, maxLines = 1) {
	let fontIndex;
	for (let i = 0; i < fontList.length; i++) {
		fontIndex = i;
		const measurements = gr.MeasureString(text, fontList[fontIndex], 0, 0, availableWidth, 0);
		if (measurements.Lines <= maxLines) {
			break;
		}
	}
	return fontIndex !== undefined ? fontList[fontIndex] : null;
}


/**
 * Loads a font as a GDI object.
 * @global
 * @param {string} name - The name of the font to load.
 * @param {number} size - The size of the font in pixels.
 * @param {string} style - The style of the font. See style constants for valid values.
 * @returns {GdiFont|null} The font or null if there was an error.
 */
function Font(name, size, style) {
	try {
		return gdi.Font(name, Math.round(SCALE(size)), style);
	} catch (e) {
		console.log('\nFailed to load font >>>', name, size, style);
		return null;
	}
}


/**
 * Checks if a font exists and is installed. Prints an error message if the font doesn't exist.
 * @global
 * @param {string} fontName - The name of the font to test.
 * @returns {boolean} True if the font exists and is installed, otherwise error message in the console.
 */
function TestFont(fontName) {
	if (!utils.CheckFont(fontName)) {
		console.log(`\nError: Font "${fontName}" was not found.\nPlease install it from the fonts folder or if you use custom theme fonts, use the correct font name / font family name.`);
		return false;
	}
	return true;
}


//////////////
// * TEXT * //
//////////////
/**
 * Calculates the maximum width of a text grid. It is used to determine the width of the grid's maximal text.
 * @global
 * @param {GdiGraphics} gr - The GDI graphics object.
 * @param {Array} gridArray - The array of grid elements that will be measured.
 * @param {GdiFont} font - The font to use for measuring the text.
 * @returns {number} The maximum width of the text.
 */
function CalcGridMaxTextWidth(gr, gridArray, font) {
	let maxWidth = 0;
	if (gridArray) {
		for (const el of gridArray) {
			const width = Math.ceil(gr.MeasureString(el.label, font, 0, 0, grm.ui.ww, grm.ui.wh).Width) + 1;
			if (width > maxWidth) {
				maxWidth = width;
			}
		}
	}
	return maxWidth;
}


/**
 * Calculates the X and Y positions for drawing text based on alignment.
 * @global
 * @param {number} x - The initial X position.
 * @param {number} y - The initial Y position.
 * @param {number} w - The width of the area.
 * @param {number} h - The height of the area.
 * @param {number} maxWidth - The maximum width available for the text.
 * @param {number} totalHeight - The total height of the text elements.
 * @param {number} padding - The padding from the edges.
 * @param {number} multiplierH - The multiplier for horizontal alignment (0 to 1).
 * @param {number} multiplierV - The multiplier for vertical alignment (0 to 1).
 * @param {boolean} centerInArea - Whether to center the text in the area or not.
 * @returns {object} The calculated X and Y positions: { textX, textY }.
 */
function CalcTextPosition(x, y, w, h, maxWidth, totalHeight, padding, multiplierH = 0.5, multiplierV = 0.5, centerInArea = false) {
	let textX = Math.round((x + w * multiplierH) - (maxWidth * multiplierH + padding));
	let textY = Math.round((y + h * multiplierV) - (totalHeight * multiplierV + padding));

	if (centerInArea) {
		textX = Math.round(x + (w - maxWidth) * 0.5);
		textY = Math.round(y + (h - totalHeight) * 0.5);
	}

	return { textX, textY };
}


/**
 * Calculates the total height of the text elements including padding.
 * @global
 * @param {GdiGraphics} gr - The GDI graphics object used for text measurement.
 * @param {Array<{text: string, font: string}>} textElements - The array of text elements, each containing `text` and `font`.
 * @param {number} maxWidth - The maximum width available for the text.
 * @param {number} lineHeight - The height of each line, including the size of symbols.
 * @param {number} padding - The padding between text elements.
 * @param {number} [lineHeightMultiplier] - The multiplier for line height.
 * @param {number} [paddingMultiplier] - The multiplier for the padding size.
 * @returns {number} The total height of the text elements, including padding.
 * @example
 * const textElements = [
 * 	{ text: "Hello", font: "Helvetica" },
 * 	{ text: "World", font: "Helvetica" }
 * ];
 * const totalHeight = CalcTextTotalHeight(gr, textElements, 100, 20, 15, 2, 1.5);
 */
function CalcTextTotalHeight(gr, textElements, maxWidth, lineHeight, padding, lineHeightMultiplier = 1, paddingMultiplier = 1) {
	let totalHeight = textElements.reduce((acc, textElement) =>
		acc + gr.MeasureString(textElement.text, textElement.font, 0, 0, maxWidth, 0).Height, 0);

	totalHeight += textElements.length * (lineHeight * lineHeightMultiplier + padding * paddingMultiplier);
	return totalHeight;
}


/**
 * Calculates the wrap space for text within a given container width and provides detailed information.
 * @global
 * @param {GdiGraphics} gr - The GDI graphics object used for text measurement.
 * @param {string} text - The text to be wrapped.
 * @param {object} font - The font used for measuring the text.
 * @param {number} containerWidth - The width of the container in which the text is to be wrapped.
 * @param {object} [cache] - An optional object for caching the results of the calculation. The cache should be used when the helper is called in a draw method. This cache object will be mutated.
 * @returns {object} An object containing 'totalWrapSpace', 'lineCount', and 'lineWrapSpaces' (an array representing the wrap space for each line).
 */
function CalcWrapSpace(gr, text, font, containerWidth, cache) {
	// Construct a cache key and check if it is available to avoid recalculating
	const cacheKey = `wrap-space-cache-${text}-${containerWidth}`;
	if (cache && cache[cacheKey]) {
		return cache[cacheKey];
	}

	let line = ''; // Holds the current line being processed
	let lineCount = 0; // Total number of lines
	let totalWrapSpace = 0; // Sum of wrap space for all lines
	const lineWrapSpaces = []; // Individual wrap space for each line
	const words = text.match(Regex.TextWords) || []; // Split text into words

	for (const word of words) {
		// Test if adding the next word exceeds the container width
		const testLine = line + (line ? ' ' : '') + word;
		const metrics = gr.MeasureString(testLine.trim(), font, 0, 0, 0, 0, 0);

		if (metrics.Width > containerWidth) {
			// If the line exceeds container width, calculate wrap space and start a new line
			if (line !== '') {
				const currentWrapSpace = Math.max(containerWidth - gr.MeasureString(line.trim(), font, 0, 0, 0, 0, 0).Width, 0);
				lineWrapSpaces.push(currentWrapSpace);
				totalWrapSpace += currentWrapSpace;
				lineCount++;
			}
			line = `${word} `;
		} else {
			line = testLine;
		}
	}

	// Add wrap space for the last line if it exists. The last line's wrap space is always 0.
	if (line !== '') {
		lineWrapSpaces.push(0); // Ensure the last line's wrap space is acknowledged but set to 0
		lineCount++;
	}

	const result = {
		lineCount,
		lineWrapSpaces: lineWrapSpaces.map(space => Math.round(space)),
		totalWrapSpace: Math.round(totalWrapSpace)
	};

	if (cache) {
		cache[cacheKey] = result;
	}

	return result;
}


/**
 * Draws multiline text string within a specified width.
 * @global
 * @param {GdiGraphics} gr - The GDI graphics object.
 * @param {string} str - The text to be drawn.
 * @param {GdiFont} font - The font to be used for the text.
 * @param {number} color - The color of the text.
 * @param {number} x - The x-coordinate where the text starts.
 * @param {number} y - The initial y-coordinate where the text starts.
 * @param {number} width - The maximum width of the text block.
 * @param {number} textPadding - The padding to be used around the text.
 * @param {number} stringFormat - The string format, see Flags.js > StringFormatFlags.
 * @returns {number} The updated y-coordinate after the text is drawn.
 */
function DrawMultilineString(gr, str, font, color, x, y, width, textPadding, stringFormat) {
	if (!str) return y;

	let currentY = y;
	let currentLine = '';
	const words = str.split(' ');

	for (const word of words) {
		const testLine = currentLine ? `${currentLine} ${word}` : word;
		const testSize = gr.MeasureString(testLine, font, 0, 0, width, 0);

		if (testSize.Width > width && currentLine) {
			const lineHeight = testSize.Height + textPadding;
			gr.DrawString(currentLine, font, color, x, currentY, width, lineHeight, stringFormat);
			currentLine = word;
			currentY += lineHeight;
		} else {
			currentLine = testLine;
		}
	}

	if (currentLine) { // Draw the last line
		const testSize = gr.MeasureString(currentLine, font, 0, 0, width, 0);
		const lineHeight = testSize.Height + textPadding;
		gr.DrawString(currentLine, font, color, x, currentY, width, lineHeight, stringFormat);
		currentY += lineHeight;
	}

	return currentY;
}


/**
 * Given two different texts, and two different font arrays, draws both lines of text
 * in the maximum number of lines available, using the largest font where all of the text will fit.
 * Where text1 ends and text2 begins will be on the same line if possible, switching fonts in between.
 * @global
 * @param {GdiGraphics} gr - The GDI graphics object.
 * @param {number} availableWidth - The maximum width a line of text can occupy.
 * @param {number} left - The X-coordinate of the text.
 * @param {number} top - The Y-coordinate of the text.
 * @param {number} color - The color of the text.
 * @param {string} text1 - The first text snippet.
 * @param {GdiFont[]} fontList1 - The array of fonts to try to fit text1 within availableWidth and maxLines.
 * @param {string} [text2] - The second text snippet if supplied.
 * @param {GdiFont[]} [fontList2] - The array of fonts to try to fit text2 within availableWidth and maxLines after drawing text1.
 * @param {number} [maxLines] - The max number of lines to attempt to draw text1 & text2 in. If text doesn't fit, ellipses will be added.
 * @returns {number} The height of the drawn text.
 */
function DrawMultipleLines(gr, availableWidth, left, top, color, text1, fontList1, text2, fontList2, maxLines = 2) {
	let textArray;
	let lineHeight;
	let continuation;
	for (let fontIndex = 0; fontIndex < fontList1.length && (fontIndex < fontList2.length); fontIndex++) {
		textArray = [];
		lineHeight = Math.max(gr.CalcTextHeight(text1, fontList1[fontIndex]), (text2 ? gr.CalcTextHeight(text2, fontList2[fontIndex]) : 0));
		continuation = false; // Does font change on same line
		/** @type {any[]} */
		const lineText = gr.EstimateLineWrap(text1, fontList1[fontIndex], availableWidth);
		for (let i = 0; i < lineText.length; i += 2) {
			textArray.push({ text: lineText[i].trim(), x_offset: 0, font: fontList1[fontIndex] });
		}
		if (textArray.length <= maxLines && text2) {
			const lastLineWidth = lineText[lineText.length - 1];
			/** @type {any[]} */
			let secondaryText = gr.EstimateLineWrap(text2, fontList2[fontIndex], availableWidth - lastLineWidth - 5);
			const firstSecondaryLine = secondaryText[0]; // Need to subtract the continuation of the previous line from text2
			const textRemainder = text2.slice(firstSecondaryLine.length).trim();
			if (firstSecondaryLine.trim().length) {
				textArray.push({ text: firstSecondaryLine, x_offset: lastLineWidth + 5, font: fontList2[fontIndex] });
				continuation = true; // Font changes on same line
			}
			secondaryText = gr.EstimateLineWrap(textRemainder, fontList2[fontIndex], availableWidth);
			for (let i = 0; i < secondaryText.length; i += 2) {
				textArray.push({ text: secondaryText[i], x_offset: 0, font: fontList2[fontIndex] });
			}
		}
		if (textArray.length - (continuation ? 1 : 0) <= maxLines) break;
	}
	let yOffset = 0;
	let linesDrawn = 0;
	const cutoff = textArray.length > maxLines + (continuation ? 1 : 0);
	textArray.splice(maxLines + (continuation ? 1 : 0));
	for (let i = 0; i < textArray.length; i++) {
		const line = textArray[i];
		if (line.x_offset) {
			// Continuation line, so move back up for drawing
			yOffset -= lineHeight;
		} else if (line.text.length) {
			linesDrawn++;
		}
		if (i === textArray.length - 1 && cutoff) {
			line.text += ' ABCDEFGHIJKMLNOPQRSTUVWXYZABCDEFGHIJKMLNOPQRSTUVWXYZ';	// Trigger ellipses
		}
		gr.DrawString(line.text, line.font, color, left + line.x_offset, top + yOffset,
			availableWidth - line.x_offset, lineHeight, Stringformat.Trim_Ellipsis_Word);
		yOffset += lineHeight;
	}
	return linesDrawn * lineHeight;
}


/**
 * Enhances the original SMP DrawString method to render fonts correctly when text strings contain special symbols.
 * Should be only used for artist, track, album or other metadata text strings.
 * @global
 * @param {GdiGraphics} gr - The GDI graphics object.
 * @param {string} str - The text string to draw. Can be any string but only UTF-8 is supported.
 * @param {GdiFont} font - The font to use. Can be any font supported by GDI.
 * @param {number} color - The X-position to start measuring.
 * @param {number} x - The X-position of the text.
 * @param {number} y - The y-position of the text.
 * @param {number} w - The width of the text.
 * @param {number} h - The height of the text.
 * @param {number} [flags] - The text string format flags.
 * @returns {GdiGraphics} The drawn text string with replaced Segoe UI Symbol font as fallback when the string contains special symbols.
 */
function DrawString(gr, str, font, color, x, y, w, h, flags) {
	const fontToUse = Regex.UtilFontNeedsSymbols.test(str) ? gdi.Font('Segoe UI Symbol', font.Size, font.Style) : font;
	return gr.DrawString(str, fontToUse, color, x, y, w, h, flags);
}


/**
 * Measures the size of a string.
 * @global
 * @param {string} text - The text to measure. Can be any string but only UTF-8 is supported.
 * @param {GdiFont} font - The font to use. Can be any font supported by GDI.
 * @param {number} x - The X-position to start measuring.
 * @param {number} y - The Y-position to start measuring.
 * @param {number} width - The width of the text to measure.
 * @param {number} height - The height of the text to measure.
 * @returns {number} The size of the string in pixels.
 */
function MeasureString(text, font, x, y, width, height) {
	const img = gdi.CreateImage(1, 1);
	const g = img.GetGraphics();
	const size = g.MeasureString(text, font, x, y, width, height);
	img.ReleaseGraphics(g);
	return size;
}


/**
 * Writes a fancy header string with a given title, decorated with slashes and asterisks.
 * @global
 * @param {string} title - The title to be included in the header.
 * @returns {string} A string that represents a fancy header:
 * ///////////////.
 * // * TITLE * //
 * ///////////////
 */
function WriteFancyHeader(title) {
	const line = '/'.repeat(title.length + 10);
	return `${line}\n// * ${title.toUpperCase()} * //\n${line}`;
}


/////////////////
// * OBJECTS * //
/////////////////
/**
 * Deep assign function that accepts objects as arguments.
 * The source objects are copied into the target object.
 * @global
 * @param {boolean} options - The parameter has following options:
 * - nonEnum: Copy only non - enumerable properties.
 * - symbols: Copy symbols from source to target.
 * - descriptors: Copy descriptors from source to target.
 * - proto: Do not copy prototype properties.
 * @returns {Function} Deep assign function with specified options.
 */
function DeepAssign(options = { nonEnum: false, symbols: false, descriptors: false, proto: false }) {
	/**
	 * Deep assign objects with options. This function is identical to deepAssign except
	 * that it accepts objects as arguments instead of using Object.assign.
	 * @param {object} target - The object to receive the deep assignment.
	 * @param {object} sources - The objects to deep assign.
	 * @returns {void} Void if all sources are valid Objects.
	 */
	return function deepAssignWithOptions (target, ...sources) {
		for (const source of sources) {
			if (!IsDeepObject(source) || !IsDeepObject(target)) { continue; }
			// Copy source's own properties into target's own properties
			const copyProperty = (property) => {
				const descriptor = Object.getOwnPropertyDescriptor(source, property);
				// default: omit non-enumerable properties
				if (descriptor.enumerable || options.nonEnum) {
					// Copy in-depth first
					if (IsDeepObject(source[property]) && IsDeepObject(target[property])) {
						descriptor.value = DeepAssign(options)(target[property], source[property]);
					}
					// default: omit descriptors
					if (options.descriptors) {
						Object.defineProperty(target, property, descriptor); // Shallow copy descriptor
					} else {
						target[property] = descriptor.value; // Shallow copy value only
					}
				}
			};
			// Copy string-keyed properties
			for (const property of Object.getOwnPropertyNames(source)) {
				copyProperty(property);
			}
			// default: omit symbol-keyed properties
			if (options.symbols) {
				for (const symbol of Object.getOwnPropertySymbols(source)) {
					copyProperty(symbol);
				}
			}
			// default: omit prototype's own properties
			if (options.proto) {
				// Copy source prototype's own properties into target prototype's own properties
				DeepAssign(Object.assign({}, options, { proto:false }))( // Prevent deeper copy of the prototype chain
					Object.getPrototypeOf(target),
					Object.getPrototypeOf(source)
				);
			}
		}
		return target;
	}
}


/**
 * Finds keys in an object that match a predicate and returns the first match.
 * @global
 * @param {object} obj - An object to search for a key in.
 * @param {Function} predicate - A function that is used to determine whether a given value meets a certain condition.
 * @returns {string} The key of the object that matches the predicate. It takes three arguments:
 * - The value of the current property being evaluated.
 * - The key of the current property.
 * - The entire object being iterated over.
 */
function FindKey(obj, predicate = (o) => o) {
	return Object.keys(obj).find((key) => predicate(obj[key], key, obj));
}


/**
 * Checks if an object is a deep object.
 * This is similar to typeOf except that it returns true for objects that are themselves objects.
 * @global
 * @param {object} obj - The object to check, can be anything.
 * @returns {boolean} True if the object is a deep object.
 */
function IsDeepObject(obj) {
	return ToType(obj) === 'Object';
}


/**
 * Checks if it is either an empty object or an empty array.
 * @global
 * @param {object | Array} obj - An object or an array.
 * @returns {boolean} True if the object is empty, false otherwise.
 */
function IsEmpty(obj) {
	return [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;
}


/**
 * Checks if a given value is an instance of the Error class.
 * @global
 * @param {object} err - An error object.
 * @returns {boolean} True if the object is an error, false otherwise.
 */
function IsError(err) {
	return err instanceof Error;
}


/**
 * Checks if a given value is an object.
 * @global
 * @param {*} a - Any value that we want to check if it is an object.
 * @returns {boolean} True if the object is an object, false otherwise.
 */
function IsObject(a) {
	return a instanceof Object;
}


/**
 * Returns the type of the input parameter.
 * @global
 * @param {*} a - Any value that we want to determine the type of.
 * @returns {string} The type of object or array as it was.
 */
function ToType(a) {
	return ({}).toString.call(a).match(Regex.UtilObjectType)[1];
}


////////////////
// * ARRAYS * //
////////////////
/**
 * Takes two arrays as input and returns a new array containing the elements
 * that are present in the first array but not in the second array.
 * @global
 * @param {Array} arr1 - The first array from which we want to find the difference.
 * @param {Array} arr2 - The second array for comparison.
 * @returns {Array} A new array with the elements of arr1 that are not in arr2.
 */
function Difference(arr1, arr2) {
	return arr1.filter((x) => !arr2.includes(x));
}


/**
 * Checks and compares if two arrays are equal.
 * @global
 * @param {Array} arr1 - The first array to compare.
 * @param {Array} arr2 - The second array to compare. Must be of the same type as the first array.
 * @returns {boolean} True if the arrays are equal, false otherwise.
 */
function Equal(arr1, arr2) {
	if (!IsArray(arr1) || !IsArray(arr2)) return false;
	let i = arr1.length;
	if (i !== arr2.length) return false;
	while (i--) {
		if (arr1[i] !== arr2[i]) return false;
	}
	return true;
}


/**
 * Checks if the passed value is an array.
 * @global
 * @param {Array} arr - The array to check.
 * @returns {boolean} True if the array is an array.
 */
function IsArray(arr) {
	return Array.isArray(arr);
}


/**
 * Returns the last element of the given array.
 * @global
 * @param {Array} arr - The array to get the last element from.
 * @returns {*} The last element of the array.
 */
function Last(arr) {
	return arr[arr.length - 1];
}


/**
 * Creates an array of numbers within a specified range, with an optional increment value.
 * @global
 * @param {number} start - The starting value of the range.
 * @param {number} end - The end value of the range. It specifies the upper limit of the range of numbers that will be generated.
 * @param {number} increment - The value by which each element in the range is incremented.
 * If the `increment` parameter is not provided, it will be set to the sign of the difference between the `end` and `start` values.
 * @returns {Array<number>} An array of numbers that represents a range of values.
 */
function Range(start, end, increment = 1) {
	const result = [];

	for (let i = start; i < end; i += increment) {
		result.push(i);
	}

	return result;
}


/**
 * Removes a specified number of elements from either the beginning or end of an array.
 * @global
 * @param {Array} array - The array parameter is the array that you want to trim.
 * @param {number} count - The number of elements to be removed from the array.
 * @param {boolean} fromHead - Trims from the beginning of the array (if true) or from the end of the array (if false).
 */
function TrimArray(array, count, fromHead) {
	if (fromHead) {
		array.splice(0, count);
	} else {
		array.length -= count;
	}
}


/**
 * Takes an array and any number of additional arrays as arguments,
 * and returns a new array that contains all unique elements from all the arrays.
 * @global
 * @param {Array} arr - The first array.
 * @param {...Array} args - The remaining arrays.
 * @returns {Array} The new array.
 */
function Union(arr, ...args) {
	return [...new Set(arr.concat(...args))];
}


/**
 * Zips the given arrays together into a single array of arrays.
 * @global
 * @param {Array} arr - The first array that will be used as the base for creating a new array.
 * @param {...Array} args - The remaining arrays.
 * @returns {Array} The new array.
 */
function Zip(arr, ...args) {
	const minLength = Math.min(arr.length, ...args.map(a => a.length));
	const result = new Array(minLength);

	for (let i = 0; i < minLength; i++) {
		const group = new Array(1 + args.length);
		group[0] = arr[i];

		for (let j = 0; j < args.length; j++) {
			group[j + 1] = args[j][i];
		}

		result[i] = group;
	}

	return result;
}


/////////////////
// * NUMBERS * //
/////////////////
/**
 * Takes a number and limits it to a specified range.
 * @global
 * @param {number} num - The number to clamp between the minimum and maximum values.
 * @param {number} min - The minimum value that the `num` parameter can be.
 * @param {number} max - The maximum value that the `num` parameter can be.
 * If the `num` parameter is greater than `max`, it will be clamped to `max`.
 * @returns {number} The clamped value of `num`.
 */
function Clamp(num, min, max) {
	return Math.max(min, Math.min(num, max));
}


/**
 * Formats the given file size in bytes to the most appropriate unit (bytes, KB, MB, GB, ...).
 * @global
 * @param {number} sizeInBytes - The size of the file in bytes.
 * @returns {string} The formatted size as a string with the appropriate unit appended.
 */
function FormatSize(sizeInBytes) {
	const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	let unitIndex = 0;
	let size = sizeInBytes;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return `${size.toFixed(unitIndex ? 2 : 0)} ${units[unitIndex]}`;
}


/**
 * Converts a rating from a 0-5 scale to a 0-100 scale.
 * Foobar2000 does not handle floating point numbers well in its metadata fields when sorting,
 * so we store the ratings as integers to ensure they are processed correctly.
 * @global
 * @param {number} rating - The rating to convert, expected to be a floating point number between 0 and 5.
 * @returns {number} - The converted rating, as an integer between 0 and 100.
 */
function ConvertRatingToPercentage(rating) {
	return Math.round(rating * 20);
}


/**
 * Converts the volume to percentage, decibels, or VU meter levels to decibels.
 * Depending on the 'type' parameter, this function behaves as follows:
 * - 'toPercent': Converts the volume (expected between 0 and 1) to a percentage representation.
 * - 'toDecibel': Converts the volume (expected between 0 and 1) to decibels (dB).
 * - 'vuLevelToDecibel': Converts VU meter levels to decibel.
 * @global
 * @param {number} volume - The volume to be converted, expected to be between 0 and 1.
 * @param {string} type - Determines the format of the output.
 * @returns {number|undefined} The converted volume as a number, or undefined if an invalid type is specified.
 */
function ConvertVolume(volume, type) {
	if (type === 'toPercent') {
		return (10 ** (volume / 50) - 0.01) / 0.99 * 100;
	} else if (type === 'toDecibel') {
		return (50 * Math.log(0.99 * volume + 0.01)) / Math.LN10;
	} else if (type === 'vuLevelToDecibel') {
		return 20 * Math.log10(volume);
	} else {
		console.log('Invalid type. Please specify \'toPercent\', \'toDecibel\', or \'vuLevelToDecibel\'.');
		return undefined;
	}
}


/**
 * Generates a random number between a minimum and maximum value.
 * @global
 * @param {number} min - The minimum value that for the random number.
 * @param {number} max - The maximum value that for the random number.
 * @returns {number} A random number between the minimum and maximum values.
 */
function RandomMinMax(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}


/**
 * Rounds the given float number to the specified number of decimals.
 * @global
 * @param {number} floatnum - The float number to round.
 * @param {number} decimals - The number of decimals to round to. If decimals is less than or equal to 0 the number is rounded to the nearest integer.
 * @param {number} eps - A small number to add to the float number to avoid rounding errors.
 * @returns {number} The rounded number.
 */
function Round(floatnum, decimals, eps = 10 ** -14) {
	let result;
	if (decimals > 0) {
		result = decimals === 15 ? floatnum : Math.round(floatnum * 10 ** decimals + eps) / 10 ** decimals;
	} else {
		result = Math.round(floatnum);
	}
	return result;
}


/**
 * Rounds a number to the specified number of decimal places.
 * @global
 * @param {number} number - The number to round, must be non-negative.
 * @param {number} precision - The number of decimal places to round to.
 * @returns {number} The number rounded to the specified precision.
 */
function ToFixed(number, precision) {
	const factor = 10 ** precision;
	return Math.round(number * factor) / factor;
}


/////////////////
// * STRINGS * //
/////////////////
/**
 * Formats a title and returns the result.
 * @global
 * @param {string} titleFormatString - The title format string to evaluate.
 * @param {FbMetadbHandle|FbMetadbHandleList} [metadb] - The handle(s) to evaluate with (single or list).
 * @param {boolean} [force] - An optional force evaluate (for no metadbs).
 * @returns {string|Array<string>} The formatted title(s) or error message(s).
 */
function $(titleFormatString, metadb = undefined, force = false) {
	try {
		const tf = fb.TitleFormat(titleFormatString);
		return metadb ? typeof metadb.Count === 'undefined' ? tf.EvalWithMetadb(metadb) : tf.EvalWithMetadbs(metadb) : tf.Eval(force);
	}
	catch (e) {
		const msg = `${e.message || e} (Invalid metadb!)`;
		return metadb ? typeof metadb.Count === 'undefined' ? msg : new Array(metadb.Count).fill(msg) : msg;
	}
}


/**
 * Escapes special characters in a string for use in title formatting expressions.
 * This includes escaping single quotes, parentheses, square brackets, commas, percent signs, and dollar signs.
 * @global
 * @param {string} string - The string to be escaped.
 * @returns {string} The escaped string, safe for use in title formatting expressions.
 */
function $Escape(string) {
	return string
		.replace(/'/g, "''")
		.replace(Regex.PunctListExtra, "'$&'")
		.replace(Regex.PunctDollar, "'$$$$'");
}


/**
 * Checks if all characters in a string are equal.
 * @global
 * @param {string} str - The string to check.
 * @returns {boolean} True if all characters in the string are equal.
 */
function AllEqual(str) {
	return str.split('').every(char => char === str[0]);
}


/**
 * Capitalizes the first letter of a string or the first letter of every word in a string.
 * @global
 * @param {string} str - The string that will be capitalized.
 * @param {boolean} [everyWord] - If true, capitalizes the first letter of every word.
 * @returns {string} The capitalized string.
 */
function CapitalizeString(str, everyWord = false) {
	if (!str) return '';
	return everyWord ? str.replace(Regex.TextWordBoundary, char => char.toUpperCase()) :
					   str[0].toUpperCase() + str.slice(1);
}


/**
 * Converts a full country name to its ISO country code.
 * @global
 * @param {string} name - The full country name.
 * @returns {string} The country ISO code.
 */
function ConvertFullCountryToIso(name) {
	if (Array.isArray(name)) name = name[0];
	if (typeof name !== 'string') return null;

	for (const code in CountryCodes) {
		if (Object.prototype.hasOwnProperty.call(CountryCodes, code) &&
			CountryCodes[code].toLowerCase() === name.toLowerCase()) {
			return code;
		}
	}
	return null;
}


/**
 * Converts an ISO country code to its full name.
 * @global
 * @param {string} code - The two letter ISO country code.
 * @returns {string} The full name of the country.
 */
function ConvertIsoCountryCodeToFull(code) {
	if (code.length === 2) {
		return CountryCodes[code];
	}
	return code;
}


/**
 * Checks if a given value is a string.
 * @global
 * @param {*} str - The value to check if it is a string.
 * @returns {boolean} True if the value is a string, false otherwise.
 */
function IsString(str) {
	return str != null && typeof str.valueOf() === 'string';
}


/**
 * Left pads a string to a specified size.
 * @global
 * @param {string} val - The value to pad. Can be any type but not necessarily a string.
 * @param {number} size - The size to pad to. Must be greater than or equal to the value of val.
 * @param {string} ch - The character to use for padding. If null, a space will be used.
 * @returns {string} The left padded string.
 */
function LeftPad(val, size, ch) {
	let result = String(val);
	if (!ch) {
		ch = ' ';
	}
	while (result.length < size) {
		result = ch + result;
	}
	return result;
}


/**
 * Pads a number with zeros to a given length.
 * @global
 * @param {number} num - The number to be padded. Must be convertible to the specified base.
 * @param {number} len - The length of the number to be padded.
 * @param {number} base - The base to pad the number to. Default is 10.
 * @returns {string} The number with the specified length and padded with zeros to the specified base.
 */
function PadNumber(num, len, base) {
	if (!base) base = 10;
	return (`000000${num.toString(base)}`).slice(-len);
}


/**
 * Wraps a string in double quotes.
 * @global
 * @param {string} value - The value to be quoted.
 * @returns {string} The quoted value.
 */
function Quotes(value) {
	return `"${value}"`;
}


/**
 * Replaces illegal special characters in names.
 * @global
 * @param {string} s - The string to be replaced.
 * @returns {string} The modified string with replaced characters.
 */
function ReplaceIllegalChars(s) {
	return s.replace(Regex.PathIllegalFilename, '');
}


/**
 * Formats a text string, accepts 1-4 parameters, corresponding to h_align, v_align, trimming, flags.
 * @global
 * @param {number} [h_align] - 0: Near, 1: Center, 2: Far.
 * @param {number} [v_align] - 0: Near, 1: Center, 2: Far.
 * @param {number} [trimming] - 0: None, 1: Char, 2: Word, 3: Ellipses char, 4: Ellipses word, 5: Ellipses path.
 * @param {number} [flags] - `|`'d together flags. See Stringformat in gr-common.js.
 * @returns {number} The string format value.
 */
function StringFormat(h_align, v_align, trimming, flags) {
	if (!h_align) h_align = 0;
	if (!v_align) v_align = 0;
	if (!trimming) trimming = 0;
	if (!flags) flags = 0;

	return ((h_align << 28) | (v_align << 24) | (trimming << 20) | flags);
}


/**
 * Takes an array of strings as input and returns the string with the longest length.
 * @global
 * @param {Array} arr - The array to compare.
 * @returns {string} The longest string.
 */
function StringLongest(arr) {
	return arr.reduce((a, b) => a.length > b.length ? a : b);
}


/**
 * Takes an array of strings as input and returns the string with the widest rendered width.
 * @global
 * @param {GdiGraphics} gr - The GDI graphics object.
 * @param {Array} arr - The array of strings to compare.
 * @param {GdiFont} font - The font to use for calculating text widths.
 * @returns {string} The widest string based on pixel width.
 */
function StringWidest(gr, arr, font) {
	if (!arr || arr.length === 0) return '';

	let widest = arr[0];
	let maxWidth = gr.CalcTextWidth(widest, font);

	for (let i = 1; i < arr.length; i++) {
		const width = gr.CalcTextWidth(arr[i], font);
		if (width > maxWidth) {
			maxWidth = width;
			widest = arr[i];
		}
	}

	return widest;
}


/**
 * Converts a number to a padded hex string.
 * @global
 * @param {number} num - The number to convert.
 * @param {number} len - The length of the padded string.
 * @returns {string} The padded hex string.
 */
function ToPaddedHexString(num, len) {
	return PadNumber(num, len, 16);
}


/////////////////////
// * COMPARISONS * //
/////////////////////
/**
 * Compares two values, providing a safe comparison for strings and numbers.
 * If both values are strings, it uses the localeCompare function and returns -1, 0, or 1.
 * If not, it subtracts b from a (considering undefined or null as 0), and returns the subtraction result, which could be any number.
 * @global
 * @param {string|number} a - The first value to compare.
 * @param {string|number} b - The second value to compare.
 * @returns {number} The result of the comparison.
 * When comparing strings, -1 if a < b, 0 if a = b, 1 if a > b.
 * When comparing numbers, the result of (a - b).
 */
function CompareValues(a, b) {
	return typeof a === 'string' && typeof b === 'string' ? a.localeCompare(b) : (a || 0) - (b || 0);
}


/**
 * Returns the key from `sumObj` and `countObj` with the highest average value.
 * @global
 * @param {(object | Map)} sumObj - The object or map containing sum values, where each key represents a unique category.
 * @param {(object | Map)} countObj - The object or map containing count values, where each key should match a key in `sumObj`.
 * @returns {(string|undefined)} The key associated with the highest average value.
 * Returns `undefined` if `sumObj` and `countObj` do not have any matching keys, or if any value in `countObj` is zero (to avoid division by zero).
 */
function GetKeyByHighestAvg(sumObj, countObj) {
	let highestAverage = -Infinity;
	let highestKey;
	const keys = sumObj instanceof Map ? sumObj.keys() : Object.keys(sumObj);

	for (const key of keys) {
		if (sumObj instanceof Map ? countObj.has(key) : Object.prototype.hasOwnProperty.call(countObj, key)) {
			const sumValue = sumObj instanceof Map ? sumObj.get(key) : sumObj[key];
			const countValue = sumObj instanceof Map ? countObj.get(key) : countObj[key];
			const average = sumValue / countValue;

			if (average > highestAverage) {
				highestAverage = average;
				highestKey = key;
			}
		}
	}
	return highestKey;
}


/**
 * Returns the first key associated with the highest value in an object or map.
 * @global
 * @param {(object | Map)} obj - The input object or map whose key-value pairs are examined.
 * @returns {(string|null)} The first key associated with the highest value, or null if the object or map is empty.
 */
function GetKeyByHighestVal(obj) {
	const entries = obj instanceof Map ? obj.entries() : Object.entries(obj);
	const highestEntry = [...entries].reduce(([keyA, valA], [keyB, valB]) => valA >= valB ? [keyA, valA] : [keyB, valB], [null, -Infinity]);
	return highestEntry[0];
}


/**
 * Sorts the keys of an object or map in descending order based on the average of their corresponding values in two different objects or Maps.
 * @global
 * @param {(object | Map)} sumObj - The object or map whose keys are to be sorted. The values are summed values for each key.
 * @param {(object | Map)} countObj - The object or map with the same keys as sumObj. The values are the count of occurrences for each key.
 * @returns {Array} An array of keys from `sumObj` and `countObj`, sorted in descending order of their corresponding average values (sum / count).
 */
function SortKeyValuesByAvg(sumObj, countObj) {
	const averages = new Map();
	const keys = sumObj instanceof Map ? sumObj.keys() : Object.keys(sumObj);

	for (const key of keys) {
		const sumValue = sumObj instanceof Map ? sumObj.get(key) : sumObj[key];
		const countValue = sumObj instanceof Map ? countObj.get(key) : countObj[key];
		averages.set(key, sumValue / countValue);
	}

	return [...averages.entries()].sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
}


/**
 * Sorts the keys of an object or map in descending order based on their corresponding values.
 * @global
 * @param {(object | Map)} obj - The object or map whose keys are to be sorted.
 * @returns {Array} An array of keys from `obj`, sorted in descending order of their corresponding values.
 */
function SortKeyValuesByDsc(obj) {
	const entries = obj instanceof Map ? obj.entries() : Object.entries(obj);
	return [...entries].sort((a, b) => b[1] - a[1]).map(entry => entry[0]);
}


//////////////
// * TIME * //
//////////////
/**
 * Calculate the age as the difference between the current time and the given date in seconds.
 * @global
 * @param {Date} date - The date to calculate the age for.
 * @returns {number} The aging of the passed time.
 */
function CalcAge(date) {
	const round = 1000;	// Round to the second
	const now = new Date();
	return Math.floor(now.getTime() / round) - Math.floor(date / round);
}


/**
 * Calculates the age ratio.
 * @global
 * @param {number} num - The number to calculate the age ratio for.
 * @param {number} divisor - The number to divide the age by ( should be between 0 and 1 ).
 * @returns {number} The age ratio in 3 decimal places.
 */
function CalcAgeRatio(num, divisor) {
	return ToFixed(1.0 - (CalcAge(num) / divisor), 3);
}


/**
 * Calculates the difference between the input date and the current date.
 * @global
 * @param {string} date - The date to calculate age for.
 * @returns {string} The age date in format YYYY-MM-DD.
 */
function CalcAgeDateString(date) {
	let str = '';
	const timezoneOffset = UpdateTimezoneOffset();
	if (date.length) {
		try {
			str = DateDiff($Date(date), undefined, timezoneOffset);
		} catch (e) {
			console.log('date has invalid value', date, 'in CalcAgeDateString()');
			// Throw new ArgumentError('date', date, 'in CalcAgeDateString()');
		}
	}
	return str.trim();
}


/**
 * Passes any date string to $Date ('Y - m - d H : i : s').
 * @global
 * @param {string} dateStr - A date string in the format YYYY-MM-DD.
 * @returns {string} The formatted date.
 */
function $Date(dateStr) {
	return $(`$date(${dateStr})`);
}


/**
 * Returns the difference between a start and end date in the form of "1y 12m 31d". Order of the two dates does not matter.
 * @global
 * @param {string} startingDate - The start date in YYYY-MM-DD format.
 * @param {string} endingDate - The end date in YYYY-MM-DD format. If no endingDate is supplied, use current time.
 * @param {number} timezoneOffset - The timezone offset in milliseconds. This offset is subtracted from the current time if no endingDate is supplied.
 * @returns {string} The difference between the two dates in the format YYYY-MM-DD.
 */
function DateDiff(startingDate, endingDate, timezoneOffset) {
	if (!startingDate) return '';
	const hasStartDay = (startingDate.length > 7);
	if (!hasStartDay) {
		startingDate += '-02'; // Avoid timezone issues
	}
	let startDate = new Date(new Date(startingDate).toISOString().slice(0, 10));
	if (!endingDate) {
		const now = new Date().getTime() - timezoneOffset; // Subtract timezone offset because we're stripping timezone from ISOString
		endingDate = new Date(now).toISOString().slice(0, 10); // Need date in YYYY-MM-DD format
	}
	let endDate = new Date(endingDate);
	if (startDate > endDate) {
		const swap = startDate;
		startDate = endDate;
		endDate = swap;
	}
	const startYear = startDate.getFullYear();
	const februaryDays = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28;
	const daysInMonth = [31, februaryDays, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	let yearDiff = endDate.getFullYear() - startYear;
	let monthDiff = endDate.getMonth() - startDate.getMonth();
	let dayDiff = 0;
	if (monthDiff < 0) {
		yearDiff--;
		monthDiff += 12;
	}
	if (hasStartDay) {
		dayDiff = endDate.getDate() - startDate.getDate();
		if (dayDiff < 0) {
			if (monthDiff > 0) {
				monthDiff--;
			} else {
				yearDiff--;
				monthDiff = 11;
			}
			dayDiff += daysInMonth[startDate.getMonth()];
		}
	}

	return (yearDiff ? `${yearDiff}y ` : '') + (monthDiff > 0 ? `${monthDiff}m ` : '') + (dayDiff ? `${dayDiff}d` : '');
}


/**
 * Converts a date object to a YYYY-MM-DD string.
 * @global
 * @param {string} date - The date to convert. Must be non null and not out of range.
 * @returns {string} The date in YYYY-MM-DD format.
 */
function DateToYMD(date) {
	const d = date.getDate();
	const m = date.getMonth() + 1; // Month from 0 to 11
	const y = date.getFullYear();
	return `${y}-${(m <= 9 ? `0${m}` : m)}-${(d <= 9 ? `0${d}` : d)}`;
}


/**
 * Returns the elapsed time progress of the current track as a percentage.
 * @global
 * @returns {string} The elapsed time percentage as a string formatted to two decimal places.
 */
function PlaybackTimePercentage() {
	const { PlaybackTime: currentTime, PlaybackLength: totalTime } = fb;
	const percentageElapsed = totalTime > 0 ? (currentTime / totalTime) * 100 : 0;
	return percentageElapsed.toFixed(2);
}


/**
 * Converts a 24-hour time format hour to 12-hour time format.
 * @global
 * @param {number|string} hour - The hour in 24-hour format.
 * @returns {string} The hour in 12-hour format with AM/PM suffix.
 */
function To12HourTimeFormat(hour) {
	const hourInt = parseInt(hour, 10);
	const suffix = hourInt >= 12 ? 'PM' : 'AM';
	const hour12 = hourInt % 12 === 0 ? 12 : hourInt % 12;
	return `${hour12} ${suffix}`;
}


/**
 * Converts a date string to a date time string.
 * @global
 * @param {string} dateTimeStr - The date string to convert.
 * @returns {string} The date time string.
 */
function ToDatetime(dateTimeStr) {
	return dateTimeStr.replace(' ', 'T');
}


/**
 * The foobar time strings are already in local time, so converting them to date objects treats them as UTC time,
 * and again adjusts to local time, and the timezone offset is applied twice. Therefore we need to add it back in here.
 * @global
 * @param {string} dateTimeStr - The date string to convert.
 * @param {number} timezoneOffset - The timezone offset in milliseconds to add back to the time.
 * @returns {number|undefined} The converted time in milliseconds, or undefined if dateTimeStr is 'N/A'.
 */
function ToTime(dateTimeStr, timezoneOffset) {
	if (dateTimeStr === 'N/A') {
		return undefined;
	}
	return new Date(ToDatetime(dateTimeStr)).getTime() + timezoneOffset;
}


/**
 * Updates the current timezone offset based on DST adjustments. This function can be called, for example, from on_playback_new_track.
 * @global
 * @returns {number} The current timezone offset in milliseconds.
 */
function UpdateTimezoneOffset() {
	const temp = new Date();
	return temp.getTimezoneOffset() * 60 * 1000;
}


////////////////////////
// * THEME SPECIFIC * //
////////////////////////
/**
 * Displays red rectangles to show all repaint areas when activating "Draw areas" in dev tools, used for debugging.
 * @global
 */
function RepaintRectAreas() {
	const originalRepaintRect = window.RepaintRect.bind(window);

	window.RepaintRect = (x, y, w, h, force = undefined) => {
		if (grm.ui.drawRepaintRects) {
			grm.ui.repaintRects.push({ x, y, w, h });
			grm.ui.repaintRectCount++;
			window.Repaint();
			return;
		}
		grm.ui.repaintRectCount = 0;
		originalRepaintRect(x, y, w, h, force);
	};
}


/**
 * Prints logs for window.Repaint() in the console, used for debugging.
 * @global
 */
function RepaintWindow() {
	DebugLog('Paint => Repainting from RepaintWindow()');
	window.Repaint();
}


/**
 * Centralizes and manages continuous calls to `window.RepaintRect` across different panels or components
 * within the application for a specified duration, providing a more efficient mechanism for repainting
 * specific areas of the UI. This method optimizes repaint requests by allowing for coordinated updates
 * of UI components, improving performance over making individual `window.RepaintRect` calls from each panel.
 * @global
 * @param {number} duration - The duration in milliseconds for which to continuously repaint the UI. Defaults to 500 milliseconds.
 * @param {number} interval - The interval in milliseconds at which to process and apply repaint requests. Defaults to 100 milliseconds.
 */
function RepaintWindowRectAreas(duration = 500, interval = 100) {
	const originalRepaintRect = window.RepaintRect.bind(window);
	if (window.RepaintRect.overridden) return;
	DebugLog('Paint => Repainting from RepaintWindowRectAreas()');

	let repaintAreas = [];

	window.RepaintRect = (x, y, w, h) => { repaintAreas.push({ x, y, w, h }); };
	window.RepaintRect.overridden = true;

	let repaintInterval = setInterval(() => {
		for (const area of repaintAreas) originalRepaintRect(area.x, area.y, area.w, area.h);
	}, interval);

	setTimeout(() => {
		clearInterval(repaintInterval);
		repaintInterval = null;
		repaintAreas = [];
		window.RepaintRect = originalRepaintRect;
		delete window.RepaintRect.overridden;
		DebugLog('Paint => Restored original RepaintRect function.');
	}, duration);
}
