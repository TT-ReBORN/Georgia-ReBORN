/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Configuration                            * //
// * Author:         TT                                                      * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-x64-DEV                                             * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    15-01-2026                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////////
// * CONFIGURATION * //
///////////////////////
/**
 * A class that defines the structure and properties of an object in a config file.
 */
class ConfigurationObjectSchema {
	/**
	 * Creates the `ConfigurationObjectSchema` instance.
	 * @param {string} name - The name for the object in the config file. If the object is `grid: {}`, then name should be `grid`.
	 * @param {string} container - The type of container for the object. Should be of ConfigurationObjectType.
	 * @param {Array<FieldDefinition>} [fields] - The fields for each entry in the object. If undefined, uses key/value pairs for objects, or comma separated values for arrays.
	 * @param {string} [comment] - Adds a '//' field as first entry in the object. Used for explaining things to the user.
	 */
	constructor(name, container, fields = undefined, comment = undefined) {
		/** @protected @type {string} */
		this.name = name;
		/** @protected @type {string} */
		this.container = container;
		/** @protected @type {Array<FieldDefinition>} */
		this.fields = fields;
		/** @protected @type {string} */
		this.comment = comment;
	}
}


/**
 * A class that reads and writes the theme config to a JSON file.
 */
class Configuration {
	/**
	 * Represents the definition of a single field within a configuration object.
	 * @typedef {object} FieldDefinition
	 * @property {string} name - The identifier for the field.
	 * @property {boolean} optional - Indicates whether the field is optional.
	 */

	/**
	 * Represents a configuration object that is used to store values and comments associated with the object schema.
	 * @typedef {object} ConfigurationObject
	 * @property {ConfigurationObjectSchema} definition - The schema definition of the configuration object.
	 * @property {Array<object>} values - The actual stored values for the configuration object.
	 * @property {Array<object>} comments - Optional comments associated with the configuration values.
	 */

	/**
	 * Creates the `Configuration` instance.
	 * Instantiates a configuration object and specifies a file to read from.
	 * @param {string} configurationPath - The path to the config file.
	 */
	constructor(configurationPath) {
		/** @protected @type {string} */
		this.path = configurationPath;
		/** @protected @type {Array<ConfigurationObject>} */
		this._configuration = [];

		/**
		 * Escapes backslashes in a string.
		 * @param {string} str - The string in which to escape backslashes.
		 * @returns {string} - The string with backslashes escaped.
		 */
		this.escapeBackslashes = (str) => str.replace(Regex.PathBackslash, '\\\\');

		if (!configurationPath.includes('.jsonc')) {
			console.log('<WARNING: Config file is not a .jsonc. Text editors may complain about comments in the file>');
		}
	}

	// * GETTERS & SETTERS * //
	// #region GETTERS & SETTERS
	/**
	 * Checks if the config file exists.
	 * @returns {boolean} True or false.
	 */
	get fileExists() {
		return IsFile(this.path);
	}
	// #endregion

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Gets a config by theme name.
	 * @param {string} name - The theme config name.
	 * @returns {ConfigurationThemeSettings} The config.
	 * @private
	 */
	_getConfigObject(name) {
		const obj = this._configuration.find(c => c.definition.name === name);
		return new ConfigurationThemeSettings(this, name, obj);
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Gets the path to the config file.
	 * @returns {string} The path to the config file.
	 */
	getPath() {
		return this.path;
	}

	/**
	 * Adds a config object to an array, replacing an existing object if it already exists.
	 * @param {ConfigurationObjectSchema} objectDefinition - The description of the object.
	 * @param {*} values - The values that will be written.
	 * @param {string[]} comments - The comment for the entry.
	 * @returns {ConfigurationThemeSettings} Provides getters and setters to automatically update the config file when config value changes.
	 */
	addConfigurationObject(objectDefinition, values, comments = []) {
		const obj = { definition: objectDefinition, values, comments };
		const idx = this._configuration.findIndex(c => c.definition.name === objectDefinition.name);

		if (idx !== -1) { // Replace existing object
			this._configuration.splice(idx, 1, obj);
		} else {
			this._configuration.push(obj);
		}

		return this._getConfigObject(objectDefinition.name);
	}

	/**
	 * Updates the values of the config for the given theme name.
	 * @param {string} objectName - The theme config name.
	 * @param {*} values - The values that will be written.
	 * @param {boolean} writeConfig - Whether to write the config to disk.
	 * @throws {InvalidTypeError} When values provided are not an array and it is expected.
	 */
	updateConfigObjValues(objectName, values, writeConfig = false) {
		const configObj = this._configuration.find(c => c.definition.name === objectName);

		if (Array.isArray(configObj.values)) {
			if (Array.isArray(values)) {
				configObj.values.splice(0, Infinity, ...values);
			} else {
				throw new InvalidTypeError('values', typeof values, 'array', 'Don\'t call updateConfigObjValues() to update Array values with non Array objects.');
			}
		}
		else {
			Object.assign(configObj.values, values);
		}

		if (writeConfig) {
			this.writeConfiguration();
		}
	}

	/**
	 * Reads the config from disk.
	 * @returns {object} An object containing.
	 * @throws {ThemeError} If the configuration file could not be read or if the JSON is invalid.
	 */
	readConfiguration() {
		try {
			const getFile = fso.GetFile(this.path);
			const configFile = getFile.OpenAsTextStream(FileMode.Read, FileType.Unicode);
			const jsonString = StripJsonComments(configFile.ReadAll());
			const config = JSON.parse(jsonString);

			configFile.Close();

			return config;
		}
		catch (e) {
			throw new ThemeError(
				`Could not read config file:\n${this.path}\n\n`
				+ 'The JSON appears to be invalid. If you have edited the config file,\n'
				+ 'ensure that your modifications have the correct syntax and values:\n'
				+ `${e.message}\n\n`
				+ 'The error typically occurs on the line before the one indicated in the error message.\n\n'
				+ 'You can also delete or rename the config file, and on the next startup,\n'
				+ 'a new default one will be created. As a last resort, you can replace your\n'
				+ 'current config with a backup config file.'
			);
		}
	}

	/**
	 * Resets the config to the default values.
	 */
	resetConfiguration() {
		DeleteFile(this.path);
		setTimeout(() => {
			window.Reload();
		}, 1);
	}

	/**
	 * Writes the config file to the path specified when Configuration was instantiated.
	 *
	 * Only needs to be called manually the very first time, or if not calling updateConfigObjValues.
	 * ( Only happens if not using a ConfigurationThemeSettings object received from addConfigurationObject ).
	 */
	writeConfiguration() {
		const configFile = fso.CreateTextFile(this.path, true, true);

		this.writeConfigHeader(configFile);

		for (const configObject of this._configuration) {
			configFile.WriteLine('');
			this.writeConfigObject(configFile, configObject);
		}

		configFile.WriteLine('}');
		configFile.Close();
	}

	/**
	 * Writes the configuration header to the provided output.
	 * @param {object} configFile - The output object where the header is written.
	 * @private
	 */
	writeConfigHeader(configFile) {
		const headerLines = [
			'/////////////////////////////////////////////////////////////////////////////////',
			'// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //',
			'// * Description:    Georgia-ReBORN Configuration File                       * //',
			'// * Author:         TT                                                      * //',
			'// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //',
			'// *                                                                         * //',
			'// * Manual changes to this file will take effect on the next reload.        * //',
			'// * To ensure changes are not overwritten or lost, reload the theme         * //',
			'// * immediately after manually changing values.                             * //',
			'/////////////////////////////////////////////////////////////////////////////////',
			'',
			'',
			'{',
			'/////////////////////////////////////////////////////////////////////////////////',
			`\t"configVersion": "${grCfg.currentVersion}",`,
			'/////////////////////////////////////////////////////////////////////////////////',
			''
		];

		for (const headerLine of headerLines) {
			configFile.WriteLine(headerLine);
		}
	}

	/**
	 * Writes a configuration object to the provided output.
	 * @param {object} configFile - The output object where the configuration is written.
	 * @param {object} configObject - The configuration object to write.
	 * @private
	 */
	writeConfigObject(configFile, configObject) {
		const { container, name, comment, fields } = configObject.definition;
		const array = container === ConfigurationObjectType.Array;
		const containerStart = array ? '[' : '{';
		const containerEnd = array ? ']' : '}';
		const lastConfigObject = configObject === this._configuration[this._configuration.length - 1];
		const separator = lastConfigObject ? '' : ',';

		configFile.WriteLine(`\t"${name}": ${containerStart}`);

		if (comment) {
			this.writeConfigComment(configFile, comment);
		}
		if (fields) {
			this.writeConfigArrayFields(configFile, configObject);
		} else if (array) {
			this.writeConfigArrayValues(configFile, configObject);
		} else {
			this.writeConfigKeyValuePairs(configFile, configObject);
		}

		configFile.WriteLine(`\t${containerEnd}${separator}`);
	}

	/**
	 * Writes a comment to the provided output.
	 * @param {object} configFile - The output object where the comment is written.
	 * @param {string} comment - The comment to write.
	 * @private
	 */
	writeConfigComment(configFile, comment) {
		const lineLengthMax = 200;

		while (comment.length > 0) {
			const line = comment.slice(0, lineLengthMax);
			const lineBackslashCount = (line.match(Regex.PathDoubleBackslash) || []).length;
			const lineLength = lineLengthMax - lineBackslashCount;

			const indexEnd = comment.slice(0, lineLength).lastIndexOf(' ');
			const indexNewLine = indexEnd > 0 ? indexEnd : lineLength;

			const currentLine = comment.slice(0, indexNewLine).trim();
			comment = comment.slice(indexNewLine).trim();

			configFile.WriteLine(`\t\t// ${currentLine}`);
		}
	}

	/**
	 * Writes an array of fields from a configuration object to the provided output.
	 * @param {object} configFile - The output object where the fields are written.
	 * @param {object} configObject - The configuration object containing the fields.
	 * @private
	 */
	writeConfigArrayFields(configFile, configObject) {
		for (const value of configObject.values) {
			const entryString = configObject.definition.fields
				.filter(field => !field.optional || value[field.name])
				.map(field => {
					const fieldValue = value[field.name];
					const quotes = typeof fieldValue === 'string' ? '"' : '';

					return `"${field.name}": ${quotes}${fieldValue}${quotes}`;
				})
				.join(', ');

			const entry = `{ ${entryString} }`;
			const separator = value === configObject.values[configObject.values.length - 1] ? '' : ',';
			const comment = value.comment ? ` // ${this.escapeBackslashes(value.comment)}` : '';

			configFile.WriteLine(`\t\t${entry}${separator}${comment}`);
		}
	}

	/**
	 * Writes an array of fields from a configuration object to the provided output.
	 * @param {object} configFile - The output object where the fields are written.
	 * @param {object} configObject - The configuration object containing the fields.
	 * @private
	 */
	writeConfigArrayValues(configFile, configObject) {
		const lastValue = configObject.values[configObject.values.length - 1];

		for (const value of configObject.values) {
			const val = this.escapeBackslashes(value);
			const separator = value === lastValue ? '' : ',';

			configFile.WriteLine(`\t\t"${val}"${separator}`);
		}
	}

	/**
	 * Writes key-value pairs from a configuration object to the provided output.
	 * @param {object} configFile - The output object where the key-value pairs are written.
	 * @param {object} configObject - The configuration object containing the key-value pairs.
	 * @private
	 */
	writeConfigKeyValuePairs(configFile, configObject) {
		const keys = Object.keys(configObject.values);
		const lastKey = keys[keys.length - 1];

		for (const [key, value] of Object.entries(configObject.values)) {
			const val = typeof value === 'string' ? this.escapeBackslashes(value) : value;
			const quotes = typeof val === 'string' ? '"' : '';
			const separator = key === lastKey ? '' : ',';
			const comment = configObject.comments[key] ? ` // ${this.escapeBackslashes(configObject.comments[key])}` : '';

			configFile.WriteLine(`\t\t"${key}": ${quotes}${val}${quotes}${separator}${comment}`);
		}
	}
	// #endregion
}


/**
 * A class that manages configuration settings by reading and writing configuration files, as well as performing update checks.
 */
class ConfigurationManager {
	/**
	 * Creates the `ConfigurationManager` instance.
	 */
	constructor() {
		// * BASE CONFIG SETUP * //
		// #region BASE CONFIG SETUP
		/** @public @type {string} The Georgia-ReBORN config file path. */
		this.configPath = `${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-config.jsonc`;
		/** @public @type {string} The Georgia-ReBORN custom config file path. */
		this.configPathCustom = `${fb.ProfilePath}georgia-reborn\\configs\\georgia-reborn-custom.jsonc`;
		/** @public @type {Configuration} The instance of the `Configuration` config object. */
		this.config = new Configuration(this.configPath);
		/** @public @type {Configuration} The instance of the `Configuration` custom config object. */
		this.configCustom = new Configuration(this.configPathCustom);
		/** @public @type {string} The Georgia-ReBORN current version. */
		this.currentVersion = '3.0-x64-DEV';
		/** @public @type {string} The Georgia-ReBORN version will be overwritten when loaded from config file. */
		this.configVersion = this.currentVersion;
		/** @public @type {string} The Georgia-ReBORN version will be shown on the right side of the lower bar when nothing is playing. */
		this.lowerBarStoppedTime = this.getCurrentVersionInfo();
		/** @public @type {boolean} The update state if a new update is available on Github releases page. */
		this.updateAvailable = false;
		/** @public @type {Hyperlink} The update link will be shown on the right side of the lower bar. */
		this.updateHyperlink = false;
		/** @private @type {number} The update retry, don't hammer the server if it's not working, used only in checkForUpdates(). */
		this.updateRetryCount = 0;
		/** @private @type {number} The update timeout timer used only in scheduleUpdateCheck(). */
		this.updateTimer = 0;
		// #endregion

		// * GEORGIA-REBORN-CONFIG.JSONC SETUP * //
		// #region GEORGIA-REBORN-CONFIG.JSONC SETUP
		/** @public @type {object} The config `title_format_strings` settings in the main config. */
		this.titleFormat = {};
		/** @public @type {object} The config `artworkImageFormats` settings in the main config. */
		this.artworkImageFormats = {};
		/** @public @type {object} The config `artworkPatterns` settings in the main config. */
		this.artworkPatterns = {};
		/** @public @type {object} The config `Design` settings in the main config. */
		this.design = {};
		/** @public @type {object} The config `Theme` settings in the main config. */
		this.theme = {};
		/** @public @type {object} The config `Style` settings in the main config. */
		this.style = {};
		/** @public @type {object} The config `Preset` settings in the main config. */
		this.preset = {};
		/** @public @type {object} The config `Player size` settings in the main config. */
		this.themePlayerSize = {};
		/** @public @type {object} The config `Layout` settings in the main config. */
		this.themeLayout = {};
		/** @public @type {object} The config `Display` settings in the main config. */
		this.themeDisplay = {};
		/** @public @type {object} The config `Brightness` settings in the main config. */
		this.themeBrightness = {};
		/** @public @type {object} The config `Font size` settings in the main config. */
		this.themeFontSize = {};
		/** @public @type {object} The config `Player controls` settings in the main config. */
		this.themeControls = {};
		/** @public @type {object} The config `Playlist` settings in the main config. */
		this.themePlaylist = {};
		/** @public @type {object} The config `Details` settings in the main config. */
		this.themeDetails = {};
		/** @public @type {MetadataGridEntry[]} The config `metadataGrid` settings in the main config. */
		this.metadataGrid = [];
		/** @public @type {object} The config `Library` settings in the main config. */
		this.themeLibrary = {};
		/** @public @type {object} The config `Biography` settings in the main config. */
		this.themeBiography = {};
		/** @public @type {object} The config `Lyrics` settings in the main config. */
		this.themeLyrics = {};
		/** @public @type {object} The config `Settings` settings in the main config. */
		this.themeSettings = {};
		/** @public @type {object} The config global theme settings in the main config. */
		this.settings = {};
		// #endregion

		// * GEORGIA-REBORN-CUSTOM.JSONC SETUP * //
		// #region GEORGIA-REBORN-CUSTOM.JSONC SETUP
		/** @public @type {object} The custom theme font in the custom config. */
		this.customFont = {};
		/** @public @type {object} The custom style preset in the custom config. */
		this.customStylePreset = {};
		/** @public @type {object} The custom disc art stubs in the custom config. */
		this.customDiscArtStub = {};
		/** @public @type {object} The custom theme object containing custom theme colors. */
		this.cTheme = {};
		/** @public @type {object} The first custom theme in the custom config. */
		this.customTheme01 = {};
		/** @public @type {object} The second custom theme in the custom config. */
		this.customTheme02 = {};
		/** @public @type {object} The third custom theme in the custom config. */
		this.customTheme03 = {};
		/** @public @type {object} The fourth custom theme in the custom config. */
		this.customTheme04 = {};
		/** @public @type {object} The fifth custom theme in the custom config. */
		this.customTheme05 = {};
		/** @public @type {object} The sixth custom theme in the custom config. */
		this.customTheme06 = {};
		/** @public @type {object} The seventh custom theme in the custom config. */
		this.customTheme07 = {};
		/** @public @type {object} The eight custom theme in the custom config. */
		this.customTheme08 = {};
		/** @public @type {object} The ninth custom theme in the custom config. */
		this.customTheme09 = {};
		/** @public @type {object} The tenth custom theme in the custom config. */
		this.customTheme10 = {};
		// #endregion
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Checks if settings exist in the configuration file.
	 * @param {object} settings - The settings object from the configuration file.
	 * @param {...string} settingNames - The names of the settings to check.
	 * @returns {boolean} Returns true if all specified settings exist, otherwise false.
	 * @private
	 */
	_checkSettings(settings, ...settingNames) {
		return settingNames.some(settingName =>
			Object.prototype.hasOwnProperty.call(settings, settingName));
	}

	/**
	 * Checks if settings with specified prefixes exist in the configuration file.
	 * @param {object} settings - The settings object from the configuration file.
	 * @param {...string} prefixes - The prefixes of the settings to check.
	 * @returns {boolean} Returns true if any keys start with the specified prefixes, otherwise false.
	 * @private
	 */
	_checkSettingsByPrefix(settings, ...prefixes) {
		return prefixes.some(prefix =>
			Object.keys(settings).some(key => key.startsWith(prefix))
		);
	}

	/**
	 * Compares a specific setting's value with the old value and updates it to the new value if they match.
	 * @param {object} settings - The settings object from the configuration file.
	 * @param {string} key - The key of the setting to check.
	 * @param {string} oldValue - The old value to check for.
	 * @param {string} newValue - The new value to update to.
	 * @returns {boolean} - Returns true if the setting was updated, otherwise false.
	 * @private
	 */
	_compareSettingValue(settings, key, oldValue, newValue) {
		if (settings && settings[key] === oldValue) {
			settings[key] = newValue;
			console.log(`Updated "${key}" setting to the new value.`);
			return true;
		}

		return false;
	}

	/**
	 * Deletes settings from the configuration file.
	 * @param {object} settings - The settings object from the configuration file.
	 * @param {...string} settingNames - The names of the settings to remove.
	 * @private
	 */
	_deleteSettings(settings, ...settingNames) {
		for (const settingName of settingNames) {
			delete settings[settingName];
		}
	}

	/**
	 * Renames settings based on a prefix in the configuration file.
	 * @param {object} settings - The settings object from the configuration file.
	 * @param {string[]} oldPrefixes - The old prefixes to be replaced.
	 * @param {string[]} newPrefixes - The new prefixes that will replace the old ones.
	 * @private
	 */
	_renameSettings(settings, oldPrefixes, newPrefixes) {
		if (oldPrefixes.length !== newPrefixes.length) {
			console.log('oldPrefixes and newPrefixes arrays must be of the same length');
			return;
		}

		for (const key of Object.keys(settings)) {
			for (let index = 0; index < oldPrefixes.length; index++) {
				const oldPrefix = oldPrefixes[index];

				if (key.startsWith(oldPrefix)) {
					const newKey = key.replace(oldPrefix, newPrefixes[index]);

					if (settings[key] !== undefined) { // Make sure the old key has a value
						settings[newKey] = settings[key];
						console.log(`Renaming ${key} to ${newKey}`);
					} else {
						console.log(`Skipping rename for undefined ${key}`);
					}

					delete settings[key];
					break;
				}
			}
		}
	}

	/**
	 * Processes a list of setting updates. If any setting is updated, it triggers configuration save and reload.
	 * @param {object} settings - The settings object to update.
	 * @param {Array} updates - An array of updates to process.
	 * @param {object} schema - The schema to pass to addConfigurationObject.
	 * @param {object} comments - The comments to pass to addConfigurationObject.
	 */
	_processSettingUpdates(settings, updates, schema, comments) {
		let hasUpdates = false;

		for (const { key, oldValue, newValue } of updates) {
			if (this._compareSettingValue(settings, key, oldValue, newValue)) {
				hasUpdates = true;
			}
		}

		if (!hasUpdates) return;

		this.config.addConfigurationObject(schema, settings, comments);
		this.config.writeConfiguration();
		window.Reload(); // Reinit new config
	}

	/**
	 * Checks if specific entry exist in the metadata grid configuration.
	 * @param {MetadataGridEntry[]} grid - Each element in the array is an object with a `label` property.
	 * @param {...string} labels - The labels of the settings to check.
	 * @returns {boolean} Returns true if all specified labels exist, otherwise false.
	 * @private
	 */
	_gridCheckEntry(grid, ...labels) {
		return labels.every(label => grid.some(gridEntry =>
			gridEntry.label.toLowerCase() === label.toLowerCase()));
	}

	/**
	 * Renames an entry in the metadata grid with a new label name.
	 * @param {MetadataGridEntry[]} grid - Each element in the array is an object with a `label` property.
	 * @param {string} oldLabel - The old label name to rename.
	 * @param {string} newLabel - The new label name that will be replaced in the config file.
	 * @private
	 */
	_gridRenameEntry(grid, oldLabel, newLabel) {
		const entryIdx = grid.findIndex(gridEntry =>
			gridEntry && gridEntry.label.toLowerCase() === oldLabel.toLowerCase());

		if (entryIdx >= 0) {
			grid[entryIdx].label = newLabel;
		}
	}

	/**
	 * Adds or Replaces values in the metadata grid with updated string from defaults.
	 * @param {MetadataGridEntry[]} grid - Each element in the array is an object with a `label` property.
	 * @param {string} label - The label of the value to add or replace.
	 * @param {number} position - 0-based index of place to insert new value if existing entry not found.
	 * @private
	 */
	_gridReplaceEntry(grid, label, position) {
		const entryIdx = grid.findIndex(gridEntry =>
			gridEntry && gridEntry.label.toLowerCase() === label.toLowerCase());

		const newVal = grDef.metadataGridDefaults[
			grDef.metadataGridDefaults.findIndex(e => e && e.label.toLowerCase() === label.toLowerCase())
		];

		if (entryIdx >= 0) {
			grid[entryIdx] = newVal;
		} else {
			grid.splice(position, 0, newVal);
		}
	}
	// #endregion

	// * PUBLIC METHODS - CONFIG FILE * //
	// #region PUBLIC METHODS - CONFIG FILE
	/**
	 * Initializes the configuration by reading from the default and custom configuration files.
	 * If the configuration files do not exist, it creates them with default values.
	 */
	initializeConfigs() {
		if (this.config.fileExists) {
			this.readDefaultConfig();
		} else {
			this.writeDefaultConfig();
		}

		if (this.configCustom.fileExists) {
			this.readCustomConfig();
		} else {
			this.writeCustomConfig();
		}
	}

	/**
	 * Reads the default configuration from the configuration file and sets up the configuration objects.
	 */
	readDefaultConfig() {
		const cfgSet = this.config.readConfiguration();
		/**
		 * While we've read all the values in, we still need to call addConfigurationObject to add the getters/setters
		 * for the objects so that the file gets automatically written when a setting is changed.
		 */
		this.config.addConfigurationObject(grDef.titleFormatSchema, Object.assign({}, grDef.titleFormatDefaults, cfgSet.title_format_strings), grDef.titleFormatComments);
		this.config.addConfigurationObject(grDef.artworkImageFormatsSchema, cfgSet.artworkImageFormats || grDef.artworkImageFormatsDefaults, grDef.artworkImageFormatsComments);
		this.config.addConfigurationObject(grDef.artworkPatternsSchema, cfgSet.artworkPatterns || grDef.artworkPatternsDefaults, grDef.artworkPatternsComments);
		this.config.addConfigurationObject(grDef.imgPathSchema, cfgSet.imgPaths || grDef.imgPathDefaults);
		this.config.addConfigurationObject(grDef.discArtPathSchema, cfgSet.discArtPaths || grDef.discArtPathDefaults);

		this.design          = this.config.addConfigurationObject(grDef.designSchema, Object.assign({}, grDef.designDefaults, cfgSet.design), grDef.designComments);
		this.theme           = this.config.addConfigurationObject(grDef.themeSchema, Object.assign({}, grDef.themeDefaults, cfgSet.theme), grDef.themeComments);
		this.style           = this.config.addConfigurationObject(grDef.themeStyleSchema, Object.assign({}, grDef.themeStyleDefaults, cfgSet.style), grDef.themeStyleComments);
		this.preset          = this.config.addConfigurationObject(grDef.themePresetSchema, Object.assign({}, grDef.themePresetDefaults, cfgSet.preset), grDef.themePresetComments);

		this.themeDisplay    = this.config.addConfigurationObject(grDef.themeDisplaySchema, Object.assign({}, grDef.themeDisplayDefaults, cfgSet.themeDisplay), grDef.themeDisplayComments);
		this.themeLayout     = this.config.addConfigurationObject(grDef.themeLayoutSchema, Object.assign({}, grDef.themeLayoutDefaults, cfgSet.themeLayout), grDef.themeLayoutComments);
		this.themePlayerSize = this.config.addConfigurationObject(grDef.themePlayerSizeSchema, Object.assign({}, grDef.themePlayerSizeDefaults, cfgSet.themePlayerSize), grDef.themePlayerSizeComments);
		this.themeFontSize   = this.config.addConfigurationObject(grDef.themeFontSizesSchema, Object.assign({}, grDef.themeFontSizesDefaults, cfgSet.themeFontSize), grDef.themeFontSizesComments);

		this.themeControls   = this.config.addConfigurationObject(grDef.themePlayerControlsSchema, Object.assign({}, grDef.themePlayerControlsDefaults, cfgSet.themeControls), grDef.themePlayerControlsComments);

		this.themePlaylist   = this.config.addConfigurationObject(grDef.themePlaylistSchema, Object.assign({}, grDef.themePlaylistDefaults, cfgSet.themePlaylist), grDef.themePlaylistComments);
		this.config.addConfigurationObject(grDef.themePlaylistGroupingPresetsSchema, cfgSet.themePlaylistGroupingPresets || grDef.themePlaylistGroupingPresets);

		this.themeDetails    = this.config.addConfigurationObject(grDef.themeDetailsSchema, Object.assign({}, grDef.themeDetailsDefaults, cfgSet.themeDetails), grDef.themeDetailsComments);
		if (cfgSet.metadataGrid) {
			for (const entry of cfgSet.metadataGrid) {
				// Copy comments over to existing object so they aren't lost
				const gridEntryDefinition = grDef.metadataGridDefaults.find(gridDefItem => gridDefItem.label === entry.label);
				if (gridEntryDefinition && gridEntryDefinition.comment) {
					entry.comment = gridEntryDefinition.comment;
				}
			}
		}
		this.config.addConfigurationObject(grDef.metadataGridSchema, cfgSet.metadataGrid || grDef.metadataGridDefaults); // Can't Object.assign here to add new fields. Add new fields in the upgrade section of migrateCheck

		this.themeLibrary   = this.config.addConfigurationObject(grDef.themeLibrarySchema, Object.assign({}, grDef.themeLibraryDefaults, cfgSet.themeLibrary), grDef.themeLibraryComments);
		this.themeBiography = this.config.addConfigurationObject(grDef.themeBiographySchema, Object.assign({}, grDef.themeBiographyDefaults, cfgSet.themeBiography), grDef.themeBiographyComments);
		this.themeLyrics    = this.config.addConfigurationObject(grDef.themeLyricsSchema, Object.assign({}, grDef.themeLyricsDefaults, cfgSet.themeLyrics), grDef.themeLyricsComments);
						      this.config.addConfigurationObject(grDef.lyricsFilenameSchema, cfgSet.lyricsFilenamePatterns || grDef.lyricsFilenameDefaults);
		this.themeSettings  = this.config.addConfigurationObject(grDef.themeSettingsSchema, Object.assign({}, grDef.themeSettingsDefaults, cfgSet.themeSettings), grDef.themeSettingsComments);
		this.settings       = this.config.addConfigurationObject(grDef.settingsSchema, Object.assign({}, grDef.settingsDefaults, cfgSet.settings), grDef.settingsComments);

		// Safety checks. Fix up potentially bad vals from config
		this.titleFormat = cfgSet.title_format_strings;
		this.artworkImageFormats = cfgSet.artworkImageFormats;
		this.artworkPatterns = cfgSet.artworkPatterns;
		this.imgPaths = cfgSet.imgPaths;
		this.discArtPaths = cfgSet.discArtPaths;
		this.lyricsFilenamePatterns = cfgSet.lyricsFilenamePatterns;
		this.metadataGrid = cfgSet.metadataGrid;
		this.configVersion = cfgSet.configVersion || cfgSet.version;
		// When adding new objects to the config file, add them in the version check below

		// Safe guard when playlist grouping presets or metadata grid do not exist in the config
		if (!cfgSet.themePlaylistGroupingPresets || !cfgSet.metadataGrid) {
			const fileName = 'georgia-reborn\\configs\\georgia-reborn-config-backup.jsonc';
			fso.CopyFile(this.configPath, fb.ProfilePath + fileName);
			this.config.writeConfiguration();
		}
	}

	/**
	 * Reads the custom configuration from the custom configuration file and sets up the custom configuration objects.
	 */
	readCustomConfig() {
		const cfgSet = this.configCustom.readConfiguration();

		this.configCustom.addConfigurationObject(grDef.customLibraryDirSchema, cfgSet.customLibraryDir || grDef.customLibraryDirDefaults);
		this.configCustom.addConfigurationObject(grDef.customBiographyDirSchema, cfgSet.customBiographyDir || grDef.customBiographyDirDefaults);
		this.configCustom.addConfigurationObject(grDef.customLyricsDirSchema, cfgSet.customLyricsDir || grDef.customLyricsDirDefaults);
		this.configCustom.addConfigurationObject(grDef.customWaveformBarDirSchema, cfgSet.customWaveformBarDir || grDef.customWaveformBarDirDefaults);
		this.configCustom.addConfigurationObject(grDef.customWebsiteLinksSchema, cfgSet.customWebsiteLinks || grDef.customWebsiteLinksDefaults);

		this.customFont        = this.configCustom.addConfigurationObject(grDef.customFontsSchema, Object.assign({}, grDef.customFontsDefaults, cfgSet.customFont), grDef.customFontsComments);
		this.customStylePreset = this.configCustom.addConfigurationObject(grDef.customStylePresetSchema, Object.assign({}, grDef.customStylePresetDefaults, cfgSet.customStylePreset), grDef.customStylePresetComments);
		this.customDiscArtStub = this.configCustom.addConfigurationObject(grDef.customDiscArtStubSchema, Object.assign({}, grDef.customDiscArtStubDefaults, cfgSet.customDiscArtStub), grDef.customDiscArtStubComments);
		this.customTheme01     = this.configCustom.addConfigurationObject(grDef.customTheme01Schema, Object.assign({}, grDef.customThemeDefaults, cfgSet.customTheme01), grDef.customThemeComments);
		this.customTheme02     = this.configCustom.addConfigurationObject(grDef.customTheme02Schema, Object.assign({}, grDef.customThemeDefaults, cfgSet.customTheme02), grDef.customThemeComments);
		this.customTheme03     = this.configCustom.addConfigurationObject(grDef.customTheme03Schema, Object.assign({}, grDef.customThemeDefaults, cfgSet.customTheme03), grDef.customThemeComments);
		this.customTheme04     = this.configCustom.addConfigurationObject(grDef.customTheme04Schema, Object.assign({}, grDef.customThemeDefaults, cfgSet.customTheme04), grDef.customThemeComments);
		this.customTheme05     = this.configCustom.addConfigurationObject(grDef.customTheme05Schema, Object.assign({}, grDef.customThemeDefaults, cfgSet.customTheme05), grDef.customThemeComments);
		this.customTheme06     = this.configCustom.addConfigurationObject(grDef.customTheme06Schema, Object.assign({}, grDef.customThemeDefaults, cfgSet.customTheme06), grDef.customThemeComments);
		this.customTheme07     = this.configCustom.addConfigurationObject(grDef.customTheme07Schema, Object.assign({}, grDef.customThemeDefaults, cfgSet.customTheme07), grDef.customThemeComments);
		this.customTheme08     = this.configCustom.addConfigurationObject(grDef.customTheme08Schema, Object.assign({}, grDef.customThemeDefaults, cfgSet.customTheme08), grDef.customThemeComments);
		this.customTheme09     = this.configCustom.addConfigurationObject(grDef.customTheme09Schema, Object.assign({}, grDef.customThemeDefaults, cfgSet.customTheme09), grDef.customThemeComments);
		this.customTheme10     = this.configCustom.addConfigurationObject(grDef.customTheme10Schema, Object.assign({}, grDef.customThemeDefaults, cfgSet.customTheme10), grDef.customThemeComments);

		this.customLibraryDir = cfgSet.customLibraryDir;
		this.customBiographyDir = cfgSet.customBiographyDir;
		this.customLyricsDir = cfgSet.customLyricsDir;
		this.customWaveformBarDir = cfgSet.customWaveformBarDir;
		this.customWebsiteLinks = cfgSet.customWebsiteLinks;
		this.customFont = cfgSet.customFont;
		this.customStylePreset = cfgSet.customStylePreset;
		this.customDiscArtStub = cfgSet.customDiscArtStub;
		this.configVersion = cfgSet.configVersion || cfgSet.version;
	}

	/**
	 * Writes the default configuration to the configuration file with default values for all settings.
	 */
	writeDefaultConfig() {
		this.config.addConfigurationObject(grDef.titleFormatSchema, grDef.titleFormatDefaults, grDef.titleFormatComments);
		this.config.addConfigurationObject(grDef.artworkImageFormatsSchema, grDef.artworkImageFormatsDefaults, grDef.artworkImageFormatsComments);
		this.config.addConfigurationObject(grDef.artworkPatternsSchema, grDef.artworkPatternsDefaults, grDef.artworkPatternsComments);
		this.config.addConfigurationObject(grDef.imgPathSchema, grDef.imgPathDefaults);
		this.config.addConfigurationObject(grDef.discArtPathSchema, grDef.discArtPathDefaults);

		this.design          = this.config.addConfigurationObject(grDef.designSchema, grDef.designDefaults, grDef.designComments);
		this.theme           = this.config.addConfigurationObject(grDef.themeSchema, grDef.themeDefaults, grDef.themeComments);
		this.style           = this.config.addConfigurationObject(grDef.themeStyleSchema, grDef.themeStyleDefaults, grDef.themeStyleComments);
		this.preset          = this.config.addConfigurationObject(grDef.themePresetSchema, grDef.themePresetDefaults, grDef.themePresetComments);

		this.themeDisplay    = this.config.addConfigurationObject(grDef.themeDisplaySchema, grDef.themeDisplayDefaults, grDef.themeDisplayComments);
		this.themeLayout     = this.config.addConfigurationObject(grDef.themeLayoutSchema, grDef.themeLayoutDefaults, grDef.themeLayoutComments);
		this.themePlayerSize = this.config.addConfigurationObject(grDef.themePlayerSizeSchema, grDef.themePlayerSizeDefaults, grDef.themePlayerSizeComments);
		this.themeFontSize   = this.config.addConfigurationObject(grDef.themeFontSizesSchema, grDef.themeFontSizesDefaults, grDef.themeFontSizesComments);

		this.themeControls   = this.config.addConfigurationObject(grDef.themePlayerControlsSchema, grDef.themePlayerControlsDefaults, grDef.themePlayerControlsComments);

		this.themePlaylist   = this.config.addConfigurationObject(grDef.themePlaylistSchema, grDef.themePlaylistDefaults, grDef.themePlaylistComments);
		this.config.addConfigurationObject(grDef.themePlaylistGroupingPresetsSchema, grDef.themePlaylistGroupingPresets);

		this.themeDetails    = this.config.addConfigurationObject(grDef.themeDetailsSchema, grDef.themeDetailsDefaults, grDef.themeDetailsComments);
		this.config.addConfigurationObject(grDef.metadataGridSchema, grDef.metadataGridDefaults); // We don't assign an object here because these aren't key/value pairs and thus can't use the get/setters

		this.themeLibrary    = this.config.addConfigurationObject(grDef.themeLibrarySchema, grDef.themeLibraryDefaults, grDef.themeLibraryComments);
		this.themeBiography  = this.config.addConfigurationObject(grDef.themeBiographySchema, grDef.themeBiographyDefaults, grDef.themeBiographyComments);
		this.themeLyrics     = this.config.addConfigurationObject(grDef.themeLyricsSchema, grDef.themeLyricsDefaults, grDef.themeLyricsComments);
						       this.config.addConfigurationObject(grDef.lyricsFilenameSchema, grDef.lyricsFilenameDefaults);
		this.themeSettings   = this.config.addConfigurationObject(grDef.themeSettingsSchema, grDef.themeSettingsDefaults, grDef.themeSettingsComments);
		this.settings        = this.config.addConfigurationObject(grDef.settingsSchema, grDef.settingsDefaults, grDef.settingsComments);

		console.log('> Writing', this.configPath);
		this.config.writeConfiguration();
		window.Reload();
	}

	/**
	 * Writes the custom configuration to the custom configuration file with default values for all custom settings.
	 */
	writeCustomConfig() {
		this.configCustom.addConfigurationObject(grDef.customLibraryDirSchema, grDef.customLibraryDirDefaults);
		this.configCustom.addConfigurationObject(grDef.customBiographyDirSchema, grDef.customBiographyDirDefaults);
		this.configCustom.addConfigurationObject(grDef.customLyricsDirSchema, grDef.customLyricsDirDefaults);
		this.configCustom.addConfigurationObject(grDef.customWaveformBarDirSchema, grDef.customWaveformBarDirDefaults);
		this.configCustom.addConfigurationObject(grDef.customWebsiteLinksSchema, grDef.customWebsiteLinksDefaults);

		this.customFont        = this.configCustom.addConfigurationObject(grDef.customFontsSchema, grDef.customFontsDefaults, grDef.customFontsComments);
		this.customStylePreset = this.configCustom.addConfigurationObject(grDef.customStylePresetSchema, grDef.customStylePresetDefaults, grDef.customStylePresetComments);
		this.customDiscArtStub = this.configCustom.addConfigurationObject(grDef.customDiscArtStubSchema, grDef.customDiscArtStubDefaults, grDef.customDiscArtStubComments);
		this.customTheme01     = this.configCustom.addConfigurationObject(grDef.customTheme01Schema, grDef.customThemeDefaults, grDef.customThemeComments);
		this.customTheme02     = this.configCustom.addConfigurationObject(grDef.customTheme02Schema, grDef.customThemeDefaults, grDef.customThemeComments);
		this.customTheme03     = this.configCustom.addConfigurationObject(grDef.customTheme03Schema, grDef.customThemeDefaults, grDef.customThemeComments);
		this.customTheme04     = this.configCustom.addConfigurationObject(grDef.customTheme04Schema, grDef.customThemeDefaults, grDef.customThemeComments);
		this.customTheme05     = this.configCustom.addConfigurationObject(grDef.customTheme05Schema, grDef.customThemeDefaults, grDef.customThemeComments);
		this.customTheme06     = this.configCustom.addConfigurationObject(grDef.customTheme06Schema, grDef.customThemeDefaults, grDef.customThemeComments);
		this.customTheme07     = this.configCustom.addConfigurationObject(grDef.customTheme07Schema, grDef.customThemeDefaults, grDef.customThemeComments);
		this.customTheme08     = this.configCustom.addConfigurationObject(grDef.customTheme08Schema, grDef.customThemeDefaults, grDef.customThemeComments);
		this.customTheme09     = this.configCustom.addConfigurationObject(grDef.customTheme09Schema, grDef.customThemeDefaults, grDef.customThemeComments);
		this.customTheme10     = this.configCustom.addConfigurationObject(grDef.customTheme10Schema, grDef.customThemeDefaults, grDef.customThemeComments);

		console.log('> Writing', this.configPathCustom);
		this.configCustom.writeConfiguration();
		window.Reload();
	}
	// #endregion

	// * PUBLIC METHODS - UPDATE CHECK * //
	// #region PUBLIC METHODS - UPDATE CHECK
	/**
	 * Checks if there is a new update available, also called in Options > Help > Theme > Updates > Check for latest theme update.
	 * @param {boolean} openUrl - Opens the Georgia-ReBORN Github releases page when hyperlink is available.
	 * @param {boolean} showPopup - Determines whether to show a popup with the update status.
	 */
	checkForUpdates(openUrl, showPopup) {
		MakeHttpRequest('GET', 'https://api.github.com/repos/TT-ReBORN/Georgia-ReBORN/tags', (resp) => {
			try {
				const respObj = JSON.parse(resp);
				const currentVersionMsg = `Current released version of Georgia-ReBORN: v${respObj[0].name}`;
				console.log(currentVersionMsg);

				/** @type {boolean} The current Github master version, used to prevent notifying users for new update when in development state. */
				const developVersion = this.currentVersion.endsWith('DEV');
				this.updateAvailable = developVersion ? false : IsNewerVersion(this.currentVersion, respObj[0].name);

				if (this.updateAvailable) {
					console.log('>>> Georgia-ReBORN new update available. Download it from here: https://github.com/TT-ReBORN/Georgia-ReBORN/releases');
					this.updateHyperlink = new Hyperlink('New Update Available', grFont.lowerBarTitle, 'update', 0, 0, window.Width);
					if (this.updateHyperlink) {
						this.lowerBarStoppedTime = '';
						if (!fb.IsPlaying) {
							grStr.time = this.lowerBarStoppedTime;
							window.Repaint();
						}
						if (openUrl) {
							this.updateHyperlink.click();
						}
					}
				} else {
					console.log(`You are using the latest version: v${this.currentVersion}`);
				}

				if (showPopup) {
					const msg = this.updateAvailable
						? `There is a new update available.\nPlease visit the release page to download the latest version.\n\n${currentVersionMsg}\n\n`
						: `You are using the latest version: v${this.currentVersion}\n\n${currentVersionMsg}\n\n`;
					grm.msg.showPopup(true, msg, msg, 'OK', false, (confirmed) => {});
				}
			}
			catch (e) {
				if (!this.updateHyperlink && this.updateRetryCount < 3) {
					// this.updateHyperlink failed to be created somehow. Let's check again after 1 minute.
					this.updateRetryCount++;
					this.updateAvailable = false;
					this.scheduleUpdateCheck(61000);
				}
			}
		});
	}

	/**
	 * Gets the current version information.
	 * The Georgia-ReBORN version will be shown on the right side of the lower bar when nothing is playing.
	 * @returns {string} The current version information.
	 */
	getCurrentVersionInfo() {
		return `${grSet.layout !== 'default' ? 'GR' : 'Georgia-ReBORN'} v${this.currentVersion}`;
	}

	/**
	 * Compares the latest version with the existing config version.
	 * @param {string} version - The latest version.
	 * @param {string} storedVersion - The config version.
	 */
	migrateCheck(version, storedVersion) {
		const configFile = this.config.readConfiguration();
		const configFileCustom = this.configCustom.readConfiguration();
		const fileName = `georgia-reborn\\configs\\georgia-reborn-config-${storedVersion}.jsonc`;
		const fileNameCustom = `georgia-reborn\\configs\\georgia-reborn-custom-${storedVersion}.jsonc`;

		// * ADJUST OLD CONFIG SETTINGS/NAMES - SOON TO BE REMOVED WHEN ENOUGH TIME HAS PASSED AND EVERYONE HAS THEIR UPDATED CONFIGS * //
		// #region  ADJUST OLD CONFIG SETTINGS/NAMES - SOON TO BE REMOVED WHEN ENOUGH TIME HAS PASSED AND EVERYONE HAS THEIR UPDATED CONFIGS
		// * Remove old settings from the config file and add the new ones
		const oldSettings = ['playlistSortArtistDateAsc', 'playlistSortArtistDateDesc', 'playlistSortAlbum', 'playlistSortTitle', 'playlistSortTracknum', 'playlistSortArtistYearAsc', 'playlistSortArtistYearDesc'];
		if (this._checkSettings(configFile.settings, ...oldSettings)) {
			fso.CopyFile(this.configPath, fb.ProfilePath + fileName);
			this.config.writeConfiguration();
			this._deleteSettings(configFile.settings, ...oldSettings);
			this.config.addConfigurationObject(grDef.settingsSchema, configFile.settings);
			this.config.addConfigurationObject(grDef.settingsSchema, grDef.settingsDefaults, grDef.settingsComments);
			this.config.writeConfiguration(configFile.settings);
		}
		if (!this._gridCheckEntry(configFile.metadataGrid, 'Channels')) {
			fso.CopyFile(this.configPath, fb.ProfilePath + fileName);
			this.config.addConfigurationObject(grDef.metadataGridSchema, grDef.metadataGridDefaults);
			this.config.writeConfiguration();
			window.Reload(); // Reinit new config
		}

		// * Rename old color names in the custom config file with the new ones
		const oldColorNames = [
			'preloaderBg', 'preloaderLogo', 'preloaderLowerBarTitle',
			'preloaderProgressBar', 'preloaderProgressBarFill', 'preloaderProgressBarFrame',
			'g_pl_colors_', 'ui_col_', 'uiBio_col_', 'col_'
		];
		const newColorNames = [
			'grCol_preloaderBg', 'grCol_preloaderLogo', 'grCol_preloaderLowerBarTitle',
			'grCol_preloaderProgressBar', 'grCol_preloaderProgressBarFill',	'grCol_preloaderProgressBarFrame',
			'pl_col_', 'lib_ui_col_', 'bio_ui_col_', 'grCol_'
		];
		if (this._checkSettingsByPrefix(configFileCustom.customTheme01, ...oldColorNames)) {
			this._renameSettings(configFileCustom.customTheme01, oldColorNames, newColorNames);
			this._renameSettings(configFileCustom.customTheme02, oldColorNames, newColorNames);
			this._renameSettings(configFileCustom.customTheme03, oldColorNames, newColorNames);
			this._renameSettings(configFileCustom.customTheme04, oldColorNames, newColorNames);
			this._renameSettings(configFileCustom.customTheme05, oldColorNames, newColorNames);
			this._renameSettings(configFileCustom.customTheme06, oldColorNames, newColorNames);
			this._renameSettings(configFileCustom.customTheme07, oldColorNames, newColorNames);
			this._renameSettings(configFileCustom.customTheme08, oldColorNames, newColorNames);
			this._renameSettings(configFileCustom.customTheme09, oldColorNames, newColorNames);
			this._renameSettings(configFileCustom.customTheme10, oldColorNames, newColorNames);
			configFileCustom.customTheme01 = this.configCustom.addConfigurationObject(grDef.customTheme01Schema, configFileCustom.customTheme01, grDef.customThemeComments);
			configFileCustom.customTheme02 = this.configCustom.addConfigurationObject(grDef.customTheme02Schema, configFileCustom.customTheme02, grDef.customThemeComments);
			configFileCustom.customTheme03 = this.configCustom.addConfigurationObject(grDef.customTheme03Schema, configFileCustom.customTheme03, grDef.customThemeComments);
			configFileCustom.customTheme04 = this.configCustom.addConfigurationObject(grDef.customTheme04Schema, configFileCustom.customTheme04, grDef.customThemeComments);
			configFileCustom.customTheme05 = this.configCustom.addConfigurationObject(grDef.customTheme05Schema, configFileCustom.customTheme05, grDef.customThemeComments);
			configFileCustom.customTheme06 = this.configCustom.addConfigurationObject(grDef.customTheme06Schema, configFileCustom.customTheme06, grDef.customThemeComments);
			configFileCustom.customTheme07 = this.configCustom.addConfigurationObject(grDef.customTheme07Schema, configFileCustom.customTheme07, grDef.customThemeComments);
			configFileCustom.customTheme08 = this.configCustom.addConfigurationObject(grDef.customTheme08Schema, configFileCustom.customTheme08, grDef.customThemeComments);
			configFileCustom.customTheme09 = this.configCustom.addConfigurationObject(grDef.customTheme09Schema, configFileCustom.customTheme09, grDef.customThemeComments);
			configFileCustom.customTheme10 = this.configCustom.addConfigurationObject(grDef.customTheme10Schema, configFileCustom.customTheme10, grDef.customThemeComments);
			this.configCustom.writeConfiguration();
			window.Reload(); // Reinit new config
		}
		if (this._checkSettings(configFile, 'lyricFilenamePatterns')) {
			this._renameSettings(configFile, ['lyricFilenamePatterns'], ['lyricsFilenamePatterns']);
			this.config.writeConfiguration();
			window.Reload(); // Reinit new config
		}

		// * Check for new customWebsiteLinks section and write if it doesn't exist
		if (!configFileCustom.customWebsiteLinks) {
			configFileCustom.customWebsiteLinks = this.configCustom.addConfigurationObject(grDef.customWebsiteLinksSchema, grDef.customWebsiteLinksDefaults, grDef.customWebsiteLinksComments);
			this.configCustom.writeConfiguration();
			window.Reload(); // Reinit new config
		}

		// * Check for new artworkImageFormats section and write if it doesn't exist
		if (!configFile.artworkImageFormats) {
			configFile.artworkImageFormats = this.config.addConfigurationObject(grDef.artworkImageFormatsSchema, grDef.artworkImageFormatsDefaults, grDef.artworkImageFormatsComments);
			this.config.writeConfiguration();
			window.Reload(); // Reinit new config
		}

		// * Check for new artworkPatterns section and write if it doesn't exist
		if (!configFile.artworkPatterns) {
			configFile.artworkPatterns = this.config.addConfigurationObject(grDef.artworkPatternsSchema, grDef.artworkPatternsDefaults, grDef.artworkPatternsComments);
			this.config.writeConfiguration();
			window.Reload(); // Reinit new config
		}

		// * Check for new discArtPaths section and write if it doesn't exist
		if (!configFile.discArtPaths) {
			configFile.discArtPaths = this.config.addConfigurationObject(grDef.discArtPathSchema, grDef.discArtPathDefaults);
			this.config.writeConfiguration();
			window.Reload(); // Reinit new config
		}

		// * Check and update settings if they have old values
		const settingUpdates = [
			{ key: 'disc', oldValue: '$ifgreater(%totaldiscs%,1,CD %discnumber%/%totaldiscs%,)', newValue: '$ifgreater(%totaldiscs%,1,$if($or($if2(%vinylside%,%vinyl side%),$strcmp($lower($if3(%media%,%mediatype%,%media type%)),vinyl)),Vinyl %discnumber%/%totaldiscs%,CD %discnumber%/%totaldiscs%),)' },
			{ key: 'disc', oldValue: '$ifgreater(%totaldiscs%,1,$if($or(%vinyl side%,$strcmp($lower(%media%),vinyl)),Vinyl %discnumber%/%totaldiscs%,CD %discnumber%/%totaldiscs%),)', newValue: '$ifgreater(%totaldiscs%,1,$if($or($if2(%vinylside%,%vinyl side%),$strcmp($lower($if3(%media%,%mediatype%,%media type%)),vinyl)),Vinyl %discnumber%/%totaldiscs%,CD %discnumber%/%totaldiscs%),)' },
			{ key: 'vinyl_side', oldValue: '%vinyl side%', newValue: '$if2(%vinylside%,%vinyl side%)' },
			{ key: 'vinyl_tracknum', oldValue: '%vinyl tracknumber%', newValue: '$if2(%vinyltracknumber%,%vinyl tracknumber%)' },
			{ key: 'vinyl_track', oldValue: '$if2(%vinyl side%[%vinyl tracknumber%]. ,[%tracknumber%. ])', newValue: '$if2([$if2(%vinylside%,%vinyl side%)][$if2(%vinyltracknumber%,%vinyl tracknumber%)]. ,[%tracknumber%. ])' }
		];
		this._processSettingUpdates(configFile.title_format_strings, settingUpdates, grDef.titleFormatSchema, grDef.titleFormatComments);
		// #endregion

		// * Update config settings which have changed since last update
		if (version !== storedVersion) {
			switch (storedVersion) {
				/* eslint-disable no-fallthrough */
				case '3.0-RC1':
					this._gridRenameEntry(configFile.metadataGrid, 'Catalog #', 'Catalog');
					this.config.addConfigurationObject(grDef.metadataGridSchema, configFile.metadataGrid);
				case '3.0-RC2':
					this.config.addConfigurationObject(grDef.themePlaylistGroupingPresetsSchema, grDef.themePlaylistGroupingPresets);
				case '3.0-RC3':
					// This default block ( latest version ) should appear after all previous versions have fallen through
					console.log('> Upgrading Georgia-ReBORN theme settings from', storedVersion);
					console.log(`> Backing up Georgia-ReBORN configuration file to ${fileName}`);
					fso.CopyFile(this.configPath, fb.ProfilePath + fileName);
					this.config.writeConfiguration();
					fso.CopyFile(this.configPathCustom, fb.ProfilePath + fileNameCustom);
					this.configCustom.writeConfiguration();
					break;
				default:
					break;
			}
		}

		grSet.version = this.currentVersion; // Always update the version panel property
	}

	/**
	 * Schedules an update check. Sets at startup and then typically every 24 hours after unless an update is found.
	 * @param {number} delay - In milliseconds.
	 */
	scheduleUpdateCheck(delay) {
		clearTimeout(this.updateTimer);
		this.updateTimer = setTimeout(() => {
			if (!this.updateAvailable) {
				this.checkForUpdates(false);
				this.scheduleUpdateCheck(1000 * 60 * 60 * 24); // Check every 24 hours
			}
		}, delay);
	}
	// #endregion
}


//////////////////////////////////////
// * CONFIGURATION THEME SETTINGS * //
//////////////////////////////////////
/**
 * A class that provides methods to get and set the value for config theme settings.
 */
class ConfigurationThemeSetting {
	/**
	 * Creates the `ConfigurationThemeSetting` instance.
	 * @param {string} name - The name of the setting.
	 * @param {*} settingVal - The value of the setting.
	 */
	constructor(name, settingVal) {
		/** @protected @constant @type {string} */
		this.name = name;
		/** @protected @type {*} */
		this.value = settingVal;
	}

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Gets the value of the config.
	 * @returns {*} The config.
	 */
	get() {
		return this.value;
	}

	/**
	 * Sets the value of the config.
	 * @param {*} newValue - The new value of the config.
	 */
	set(newValue) {
		if (this.value !== newValue) {
			this.value = newValue;
		}
	}
	// #endregion
}


/**
 * A class that manages a collection of `ConfigurationThemeSetting` instances for a specific theme.
 */
class ConfigurationThemeSettings {
	/**
	 * Creates the `ConfigurationThemeSettings` instance.
	 * @param {Configuration} config - The theme configuration object.
	 * @param {string} objName - The name of the settings collection.
	 * @param {object} properties - An object containing the initial settings as key-value pairs.
	 */
	constructor(config, objName, properties = {}) {
		/** @protected @type {Array<string>} */
		this._propertiesNameList = [];
		/** @protected @type {Configuration} */
		this._config = config;
		/** @private @type {string} */
		this.objName = objName;

		if (properties) {
			this.addProperties(properties.values);
		}
	}

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Adds a new ConfigurationThemeSetting instance to the collection with dynamic getter and setter.
	 * @param {Array} setting - An array with two elements: the name of the setting and its default value.
	 * @param {string} itemId - A unique identifier for the setting.
	 * @private
	 */
	_addConfigItem(setting, itemId) {
		this._propertiesNameList[setting[0]] = 1;

		this[`${itemId}_internal`] = new ConfigurationThemeSetting(itemId, setting);

		Object.defineProperty(this, itemId, {
			get() {
				return this[`${itemId}_internal`].get();
			},
			set(newValue) {
				if (this[`${itemId}_internal`].get() !== newValue) {
					this[`${itemId}_internal`].set(newValue);
					this._config.updateConfigObjValues(this.objName, { [itemId]: newValue }, true);
				}
			}
		});
	}

	/**
	 * TODO: validation for item?
	 *
	 * Validates a setting before adding it to ensure it has the correct format and is not using a reserved identifier.
	 * @param {*} item - The setting to validate.
	 * @param {string} itemId - The identifier for the setting.
	 * @throws {ArgumentError} Thrown if itemId is using a reserved identifier or if the identifier is already occupied.
	 * @private
	 */
	_validateConfigItem(item, itemId) {
		// if (!Array.isArray(item) || item.length !== 2 || !IsString(item[0])) {
		// 	throw new InvalidTypeError('property', typeof item, '{ string, [string, any] }', 'Usage: addProperties({\n  property_id: [property_name, property_default_value]\n})');
		// }
		if (itemId === 'add_properties') {
			throw new ArgumentError('property_id', itemId, 'This id is reserved');
		}
		if (this[itemId] || this[`${itemId}_internal`]) {
			throw new ArgumentError('property_id', itemId, 'This id is already occupied');
		}
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Adds multiple ConfigurationThemeSetting instances to the collection based on the provided properties object.
	 * @param {object} properties - An object containing settings as key-value pairs.
	 */
	addProperties(properties) {
		for (const key of Object.keys(properties)) {
			this._validateConfigItem(properties[key], key);
			this._addConfigItem(properties[key], key);
		}
	}
	// #endregion
}
