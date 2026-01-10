/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN File Manager                             * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    10-01-2026                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


//////////////////////
// * FILE MANAGER * //
//////////////////////
/**
 * A class that handles various file management operations including cache deletion,
 * backup/restore functionality, and theme tag writing for Georgia-ReBORN.
 */
class FileManager {
	/**
	 * Creates a FileManager instance.
	 * @constructor
	 */
	constructor() {
		/** @private @type {string} The base profile path for foobar2000. */
		this.profilePath = fb.ProfilePath;

		/** @private @type {string} The backup directory path. */
		this.backupPath = `${this.profilePath}backup\\profile\\`;

		/** @private @type {object} The cache directory paths. */
		this.cachePaths = {
			biography: `${this.profilePath}cache\\biography\\biography-cache`,
			library:   `${this.profilePath}cache\\library\\library-tree-cache`,
			lyrics:    `${this.profilePath}cache\\lyrics\\*.*`,
			waveform:  `${this.profilePath}cache\\waveform\\*.*`
		};
	}

	// * CACHE * //
	// #region CACHE
	/**
	 * Deletes the Biography cache on auto or manual usage.
	 * @returns {void}
	 */
	deleteBiographyCache() {
		const path = grSet.customBiographyDir ? $(`${grCfg.customBiographyDir}\\*.*`, undefined, true) : this.cachePaths.biography;
		DeleteFolder(path);
	}

	/**
	 * Deletes the Library cache on auto or manual usage.
	 * @returns {void}
	 */
	deleteLibraryCache() {
		const path = grSet.customLibraryDir ? $(`${grCfg.customLibraryDir}\\*.*`, undefined, true) : this.cachePaths.library;
		DeleteFolder(path);
	}

	/**
	 * Deletes the Lyrics cache on auto or manual usage.
	 * @returns {void}
	 */
	deleteLyrics() {
		const path = grSet.customLyricsDir ? $(`${grCfg.customLyricsDir}\\*.*`, undefined, true) : this.cachePaths.lyrics;
		DeleteFile(path);
	}

	/**
	 * Deletes the Waveform bar cache on auto or manual usage.
	 * @returns {void}
	 */
	deleteWaveformBarCache() {
		const path = grSet.customWaveformBarDir ? $(`${grCfg.customWaveformBarDir}\\*.*`, undefined, true) : this.cachePaths.waveform;
		DeleteFolder(path);
	}
	// #endregion

	// * BACKUP * //
	// #region BACKUP
	/**
	 * Checks which version of library/playlist folders exist.
	 * @param {object} paths - The version paths to check.
	 * @returns {Promise<object>} The promise that resolves to an object containing directory paths and version flags.
	 * @private
	 */
	async _checkVersion(paths) {
		let libraryDir;
		let playlistDir;
		let oldVersion = false;

		if (IsFolder(paths.libOld)) {
			libraryDir = paths.libOld;
			oldVersion = true;
		}
		else if (IsFolder(paths.libNew)) {
			libraryDir = paths.libNew;
			oldVersion = false;
		}

		if (IsFolder(paths.plistOld)) {
			playlistDir = paths.plistOld;
			oldVersion = true;
		}
		else if (IsFolder(paths.plistNew)) {
			playlistDir = paths.plistNew;
			oldVersion = false;
		}

		return { libraryDir, playlistDir, oldVersion };
	}

	/**
	 * Creates necessary folders for backup operation.
	 * @param {object} backupPaths - The backup paths object.
	 * @param {boolean} oldVersion - The flag if old version is detected.
	 * @returns {Promise<void>} The promise that resolves when all directories are created.
	 * @private
	 */
	async _createBackupFolders(backupPaths, oldVersion) {
		CreateFolder(backupPaths.theme);
		CreateFolder(backupPaths.cfgFb);
		CreateFolder(backupPaths.cfgBp);
		CreateFolder(backupPaths.dspFb);
		CreateFolder(backupPaths.dspBp);

		if (oldVersion) CreateFolder(backupPaths.index);
	}

	/**
	 * Copies all necessary folders for backup/restore operation.
	 * @param {boolean} isMakingBackup - The flag if we're making a backup (vs restoring).
	 * @param {object} versionInfo - The version information object.
	 * @returns {Promise<void>} The promise that resolves when all file copy operations are complete.
	 * @private
	 */
	async _copyBackupFolders(isMakingBackup, versionInfo) {
		const { libraryDir, playlistDir, oldVersion } = versionInfo;
		const fso = new ActiveXObject('Scripting.FileSystemObject');

		// * Paths setup
		const destPath = isMakingBackup ? this.backupPath : this.profilePath;
		const configsPath = isMakingBackup ? `${this.profilePath}georgia-reborn\\configs` : `${this.backupPath}georgia-reborn\\configs`;
		const configsDest = isMakingBackup ? `${this.backupPath}georgia-reborn\\configs` : `${this.profilePath}georgia-reborn\\configs`;
		const cfgPath = isMakingBackup ? `${this.profilePath}configuration` : `${this.backupPath}configuration`;
		const cfgDest = isMakingBackup ? `${this.backupPath}configuration` : `${this.profilePath}configuration`;

		// * Copy Operations
		if (fso.FolderExists(libraryDir))  {
			this._copySafe(() => fso.GetFolder(libraryDir).Copy(destPath, true), 'Could not copy library.');
		}
		if (fso.FolderExists(playlistDir)) {
			this._copySafe(() => fso.GetFolder(playlistDir).Copy(destPath, true), 'Could not copy playlists.');
		}
		if (fso.FolderExists(configsPath)) {
			this._copySafe(() => fso.GetFolder(configsPath).Copy(configsDest, true), 'Could not copy theme configs.');
		}
		if (fso.FolderExists(cfgPath)) {
			this._copySafe(() => fso.GetFolder(cfgPath).Copy(cfgDest, true), 'Could not copy fb2k configuration.');
		}

		// * Cleanup specific to backup creation
		if (isMakingBackup) {
			DeleteFile(`${this.backupPath}configuration\\foo_ui_columns.dll.cfg`);
		}

		// * Version specific files
		if (oldVersion) {
			await this._copyOldVersionFiles(isMakingBackup, fso);
		} else {
			await this._copyNewVersionFiles(isMakingBackup, fso);
		}
	}

	/**
	 * Copies new version specific files (fb2k v2 files).
	 * @param {boolean} isMakingBackup - The flag if we're making a backup.
	 * @param {object} fso - The FileSystemObject instance.
	 * @returns {Promise<void>} The promise that resolves when all file copy operations are complete.
	 * @private
	 */
	async _copyNewVersionFiles(isMakingBackup, fso) {
		const dspPath = isMakingBackup ? `${this.profilePath}dsp-presets` : `${this.backupPath}dsp-presets`;
		const destPath = isMakingBackup ? this.backupPath : this.profilePath;
		const dspPresets = fso.GetFolder(dspPath);

		this._copySafe(() => dspPresets.Copy(destPath, true), 'Theme backup could not copy DSP presets directory.');

		// * Copy individual config files
		const fileConfigs = [
			{ name: 'config.fb2k-dsp', error: 'Theme backup could not copy config.fb2k-dsp file.' },
			{ name: 'config.sqlite', error: 'Theme backup could not copy config.sqlite file.' },
			{ name: 'metadb.sqlite', error: 'Theme backup could not copy metadb.sqlite file.' }
		];

		for (const config of fileConfigs) {
			const filePath = isMakingBackup ? `${this.profilePath}${config.name}` : `${this.backupPath}${config.name}`;
			if (fso.FileExists(filePath)) {
				const file = fso.GetFile(filePath);
				this._copySafe(() => file.Copy(destPath, true), config.error);
			}
		}
	}

	/**
	 * Copies old version specific files (index-data).
	 * @param {boolean} isMakingBackup - The flag if we're making a backup.
	 * @param {object} fso - The FileSystemObject instance.
	 * @returns {Promise<void>} The promise that resolves when all file copy operations are complete.
	 * @private
	 */
	async _copyOldVersionFiles(isMakingBackup, fso) {
		const indexDataPath = isMakingBackup ? `${this.profilePath}index-data` : `${this.backupPath}index-data`;
		const destPath = isMakingBackup ? this.backupPath : this.profilePath;
		const indexData = fso.GetFolder(indexDataPath);

		this._copySafe(() => indexData.Copy(destPath, true), 'Theme backup could not copy index-data files.');
	}

	/**
	 * Copies safely a folder or file with error handling.
	 * @param {Function} copyOperation - The copy operation to perform.
	 * @param {string} errorMessage - The error message to display if copy fails.
	 * @returns {boolean} True if successful, false otherwise.
	 * @private
	 */
	_copySafe(copyOperation, errorMessage) {
		try {
			copyOperation();
			return true;
		}
		catch (e) {
			console.log(`>>> WARNING <<<\n${errorMessage}\nDetails: ${e.message}`);
			return false;
		}
	}

	/**
	 * Gets the backup configuration paths.
	 * @returns {object} The object containing all backup-related paths.
	 * @private
	 */
	_getBackupPaths() {
		return {
			backup: this.backupPath,
			cfgFb: `${this.profilePath}configuration`,
			dspFb: `${this.profilePath}dsp-presets`,
			cfgBp: `${this.backupPath}configuration`,
			dspBp: `${this.backupPath}dsp-presets`,
			index: `${this.backupPath}index-data`,
			theme: `${this.backupPath}georgia-reborn`
		};
	}

	/**
	 * Gets library and playlist directory paths based on version.
	 * @param {boolean} isMakingBackup - The flag if we're making a backup (vs restoring).
	 * @returns {object} The object containing library and playlist paths.
	 * @private
	 */
	_getVersionPaths(isMakingBackup) {
		const basePath = isMakingBackup ? this.profilePath : this.backupPath;

		return {
			libOld:   `${basePath}library`,
			libNew:   `${basePath}library-v2.0`,
			plistOld: `${basePath}playlists-v1.4`,
			plistNew: `${basePath}playlists-v2.0`
		};
	}

	/**
	 * Validates that all required folders exist for backup/restore.
	 * @param {boolean} isMakingBackup - The flag if we're making a backup (vs restoring).
	 * @param {object} versionInfo - The version information object.
	 * @param {object} backupPaths - The backup paths object.
	 * @returns {boolean} True if all folders exist, false otherwise.
	 * @private
	 */
	_validateFolders(isMakingBackup, versionInfo, backupPaths) {
		const { libraryDir, playlistDir } = versionInfo;

		const hasVersionFolders = libraryDir && playlistDir;
		const hasBackupFolders = IsFolder(backupPaths.theme)
			&& IsFolder(backupPaths.dspFb) && IsFolder(backupPaths.dspBp)
			&& IsFolder(backupPaths.cfgFb) && IsFolder(backupPaths.cfgBp);

		if (hasVersionFolders && hasBackupFolders) {
			return true;
		}

		const errorMsg = grm.msg.getMessage('menu', isMakingBackup ? 'makeBackupError' : 'restoreBackupError');
		fb.ShowPopupMessage(errorMsg, 'Theme backup');

		return false;
	}

	/**
	 * Makes a complete theme backup.
	 * @returns {Promise<void>} The promise that resolves when the backup is complete.
	 */
	async makeBackup() {
		const backupPaths = this._getBackupPaths();
		const versionPaths = this._getVersionPaths(true);
		const versionInfo = await this._checkVersion(versionPaths);
		const msg = grm.msg.getMessage('menu', 'makeBackupSuccess');

		await this._createBackupFolders(backupPaths, versionInfo.oldVersion);

		if (!this._validateFolders(true, versionInfo, backupPaths)) {
			return;
		}

		await grm.settings.setThemeSettings(true);
		await this._copyBackupFolders(true, versionInfo);

		if (DetectWine()) {
			fb.ShowPopupMessage(msg, 'Theme backup');
		} else {
			lib.popUpBox.confirm('Georgia-ReBORN', msg, 'OK', false, false, 'center', false);
		}

	}

	/**
	 * Restores a theme backup.
	 * @returns {Promise<void>} The promise that resolves when the restore is complete.
	 */
	async restoreBackup() {
		const backupPaths = this._getBackupPaths();
		const versionPaths = this._getVersionPaths(false);
		const versionInfo = await this._checkVersion(versionPaths);

		if (!this._validateFolders(false, versionInfo, backupPaths)) {
			return;
		}

		await grm.settings.setThemeSettings(false, true);

		// ! We restore backup offline via batch script to avoid file locking issues with metadb.sqlite and playlists.
		this.restoreBackupOffline();
	}

	/**
	 * Creates and executes an external batch script to perform an offline backup restore.
	 */
	restoreBackupOffline() {
		const fso = new ActiveXObject('Scripting.FileSystemObject');
		const shell = new ActiveXObject('WScript.Shell');
		const batchFile = `${this.profilePath}theme_backup_restore.bat`;

		if (!fso.FolderExists(this.backupPath)) {
			const msg = grm.msg.getMessage('menu', 'restoreBackupNotFound');
			fb.ShowPopupMessage(msg, 'Restore Error');
			return;
		}

		const fb2kExe = fso.BuildPath(fb.FoobarPath, 'foobar2000.exe');
		const backupPathShort = GetShortPath(this.backupPath);
		const profilePathShort = GetShortPath(this.profilePath);
		const fb2kExeShort = GetShortPath(fb2kExe);

		const header = [
			'echo /////////////////////////////////////////////////////////////////////////////////',
			'echo // * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //',
			'echo // * Description:    Offline Theme Backup Restore                            * //',
			'echo // * Status:         Restoring theme backup files                            * //',
			'echo /////////////////////////////////////////////////////////////////////////////////',
			'echo.'
		].join('\r\n');

		const batchContent = [
			'@echo off',
			'title Georgia-ReBORN - Theme Backup Restore',
			'color 0B',
			'mode con: cols=90 lines=25 >nul 2>&1',

			// * STEP 1: Wait for locks * //
			'cls',
			header,
			'echo [1/3] Waiting for foobar2000 to release file locks...',
			'echo Status: [ PLEASE WAIT ]',
			'ping 127.0.0.1 -n 4 > nul 2>&1',

			// * STEP 2A: Restore Configuration * //
			'cls',
			header,
			'echo [2/3] Restoring files...',
			'echo Progress: [###-------] 33%% - Processing configuration...',
			`if not exist "${profilePathShort}\\configuration" mkdir "${profilePathShort}\\configuration"`,
			`xcopy "${backupPathShort}\\configuration\\*" "${profilePathShort}\\configuration\\" /E /I /Y /H /R /K > nul 2>&1`,

			// * STEP 2B: Restore Library & Data * //
			'cls',
			header,
			'echo [2/3] Restoring files...',
			'echo Progress: [######----] 66%% - Processing library and database...',

			// * Check for robocopy availability (preferred on Windows, often missing in Wine) * //
			'where robocopy > nul 2>&1',
			'if %errorlevel% equ 0 (',
				// Use robocopy for robust file copying (/E=subdirs /IS=include same /IT=include tweaked /R:3=3 retries /W:1=1s wait)
				`robocopy "${backupPathShort}" "${profilePathShort}" /E /IS /IT /R:3 /W:1 /NFL /NDL /NJH /NJS /nc /ns /np > nul 2>&1`,
			') else (',
				// Fallback to Xcopy for Wine/Linux or stripped Windows
				`xcopy "${backupPathShort}\\*" "${profilePathShort}\\" /E /I /Y /H /R /K /C > nul 2>&1`,
			')',

			// * STEP 3: Restart * //
			'cls',
			header,
			'echo [3/3] Restore complete!',
			'echo Progress: [##########] 100%%',
			'echo.',
			'echo Restarting foobar2000...',
			'ping 127.0.0.1 -n 3 > nul 2>&1',

			`if exist "${fb2kExeShort}" (`,
			`	start "" "${fb2kExeShort}"`,
			') else (',
			'	echo ERROR: Could not find foobar2000.exe',
			'	pause',
			')',

			// Self-delete the batch file after execution
			'(goto) 2>nul & del "%~f0"'
		].join('\r\n');

		try {
			// Create batch file as ASCII for CMD compatibility (overwrite=true, unicode=false)
			const ts = fso.CreateTextFile(batchFile, true, false);
			ts.Write(batchContent);
			ts.Close();

			// Execute batch script and exit foobar2000
			try {
				// Run indirectly via cmd /c for safety
				shell.Run(`cmd /c "${batchFile}"`, 1, false);

				// Small delay via secondary shell to ensure CMD grabs the handle before FB2K closes
				const tempShell = new ActiveXObject("WScript.Shell");
				tempShell.Run("ping 127.0.0.1 -n 1", 0, true);

				fb.Exit();
			}
			catch (runError) {
				// Fallback: direct batch execution if cmd /c fails
				shell.Run(`"${batchFile}"`, 1, false);
				fb.Exit();
			}
		}
		catch (e) {
			// Clean up batch file on error
			try { if (fso.FileExists(batchFile)) fso.DeleteFile(batchFile); } catch (x) {}
			fb.ShowPopupMessage(`Failed to initiate offline restore:\n${e.message}`, 'Theme Manager');
		}
	}
	// #endregion

	// * THEME TAGS * //
	// #region THEME TAGS
	/**
	 * Gets the currently selected items from either playlist or library.
	 * @returns {FbMetadbHandleList|null} The selected items or null if none selected.
	 */
	getSelectedItems() {
		const plItems = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
		const libItems = new FbMetadbHandleList(lib.pop.getHandleList('newItems'));

		const useLibrary =
			(grm.ui.displayLibrary && !grm.ui.displayPlaylist)
			||
			(grm.ui.displayLibrarySplit() && grm.ui.state.mouse_x < grm.ui.ww * 0.5);

		return useLibrary ? libItems : plItems;
	}

	/**
	 * Gets the current theme style configuration as a string.
	 * @returns {string} The semicolon-separated list of active style options.
	 */
	getThemeStyleString() {
		const styleOptions = [
			grSet.styleNighttime && 'styleNighttime',
			grSet.styleBevel && 'bevel',
			grSet.styleBlend && 'blend',
			grSet.styleBlend2 && 'blend2',
			grSet.styleGradient && 'gradient',
			grSet.styleGradient2 && 'gradient2',
			grSet.styleAlternative && 'alternative',
			grSet.styleAlternative2 && 'alternative2',
			grSet.styleBlackAndWhite && 'blackAndWhite',
			grSet.styleBlackAndWhite2 && 'blackAndWhite2',
			grSet.styleBlackReborn && 'blackReborn',
			grSet.styleRebornWhite && 'rebornWhite',
			grSet.styleRebornBlack && 'rebornBlack',
			grSet.styleRebornFusion && 'rebornFusion',
			grSet.styleRebornFusion2 && 'rebornFusion2',
			grSet.styleRandomPastel && 'randomPastel',
			grSet.styleRandomDark && 'randomDark',
			grSet.styleRebornFusionAccent && 'rebornFusionAccent',
			grSet.styleTopMenuButtons === 'filled' && 'topMenuButtons=filled',
			grSet.styleTopMenuButtons === 'bevel' && 'topMenuButtons=bevel',
			grSet.styleTopMenuButtons === 'inner' && 'topMenuButtons=inner',
			grSet.styleTopMenuButtons === 'emboss' && 'topMenuButtons=emboss',
			grSet.styleTopMenuButtons === 'minimal' && 'topMenuButtons=minimal',
			grSet.styleTransportButtons === 'bevel' && 'transportButtons=bevel',
			grSet.styleTransportButtons === 'inner' && 'transportButtons=inner',
			grSet.styleTransportButtons === 'emboss' && 'transportButtons=emboss',
			grSet.styleTransportButtons === 'minimal' && 'transportButtons=minimal',
			grSet.styleProgressBarDesign === 'rounded' && 'progressBarDesign=rounded',
			grSet.styleProgressBarDesign === 'lines' && 'progressBarDesign=lines',
			grSet.styleProgressBarDesign === 'blocks' && 'progressBarDesign=blocks',
			grSet.styleProgressBarDesign === 'dots' && 'progressBarDesign=dots',
			grSet.styleProgressBarDesign === 'thin' && 'progressBarDesign=thin',
			grSet.styleProgressBar === 'bevel' && 'progressBarBg=bevel',
			grSet.styleProgressBar === 'inner' && 'progressBarBg=inner',
			grSet.styleProgressBarFill === 'bevel' && 'progressBarFill=bevel',
			grSet.styleProgressBarFill === 'inner' && 'progressBarFill=inner',
			grSet.styleProgressBarFill === 'blend' && 'progressBarFill=blend',
			grSet.styleVolumeBarDesign === 'rounded' && 'volumeBarDesign=rounded',
			grSet.styleVolumeBar === 'bevel' && 'volumeBarBg=bevel',
			grSet.styleVolumeBar === 'inner' && 'volumeBarBg=inner',
			grSet.styleVolumeBarFill === 'bevel' && 'volumeBarFill=bevel',
			grSet.styleVolumeBarFill === 'inner' && 'volumeBarFill=inner'
		];

		return styleOptions.filter(Boolean).join('; ');
	}

	/**
	 * Writes %GR_THEMECOLOR%, %GR_THEME%, %GR_STYLE%, %GR_PRESET% tags to music files via the Playlist or Library context menu.
	 * @returns {void}
	 */
	writeThemeTags() {
		const items = this.getSelectedItems();

		if (!items || items.Count === 0) {
			return;
		}

		const themeColor = grSet.theme === 'random' ? ColToRgb(grCol.primary) : '';
		const theme = grSet.preset === false ? grSet.theme : '';
		const preset = grSet.preset !== false ? grSet.preset : '';
		const style = grSet.preset === false ? this.getThemeStyleString() : '';
		const grTags = [];

		for (let i = 0; i < items.Count; ++i) {
			grTags.push({
				GR_THEMECOLOR: themeColor,
				GR_THEME: theme,
				GR_STYLE: style,
				GR_PRESET: preset
			});
		}

		items.UpdateFileInfoFromJSON(JSON.stringify(grTags));
	}
	// #endregion
}
