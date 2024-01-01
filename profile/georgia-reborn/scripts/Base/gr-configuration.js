/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Configuration                        * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-DEV                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2024-01-01                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////////
// * CONFIGURATION * //
///////////////////////
/** @type {Object} Creates a config object. */
const ConfigurationObjectType = {
	Array:  'array',
	Object: 'object',
	Value:  'value' // Not currently handled
};

/**
 * @typedef {Object} FieldDefinition
 * @property {string} name
 * @property {boolean=} optional
 */

/**
 * Defines the structure and properties of an object in a config file.
 */
class ConfigurationObjectSchema {
	/**
	 * @param {string} name The name for the object in the config file. i.e. if the object is `grid: {}`, then name should be `'grid'`.
	 * @param {string} container The type of container for the object. Should be of ConfigurationObjectType.
	 * @param {Array<FieldDefinition>=} fields The fields for each entry in the object. If undefined, uses key/value pairs for objects, or comma separated values for arrays.
	 * @param {string=} comment Adds a '//' field as first entry in the object. Used for explaining things to the user.
	 * @class
	 */
	constructor(name, container, fields = undefined, comment = undefined) {
		this.name = name;
		this.container = container;
		this.fields = fields;
		this.comment = comment;
	}
}

/**
 * @typedef {Object} ConfigurationObject
 * @property {ConfigurationObjectSchema} definition
 * @property {Array<Object>} values
 * @property {Array<Object>} comments
 */

/**
 * Reads and writes the theme config to a JSON file.
 */
class Configuration {
	/**
	 * Instantiates a Configuration object and specifies a file to read from.
	 * @param {string} configurationPath The path to the config file.
	 * @class
	 */
	constructor(configurationPath) {
		this.path = configurationPath;
		if (!configurationPath.includes('.jsonc')) {
			console.log('<WARNING: Config file is not a .jsonc. Text editors may complain about comments in the file.>');
		}

		/**
		 * @protected
		 * @type {Array<ConfigurationObject>}
		 */
		this._configuration = [];
	}

	/**
	 * Checks if the config file exists.
	 * @returns {boolean} True or false.
	 */
	get fileExists() {
		return IsFile(this.path);
	}

	/**
	 * Adds a config object to an array, replacing an existing object if it already exists.
	 * @param {ConfigurationObjectSchema} objectDefinition The description of the object.
	 * @param {*} values The values that will be written.
	 * @param {*} comments The comment for the entry.
	 * @returns {ThemeSettings} Provides getters and setters to automatically update the config file when config value changes.
	 */
	addConfigurationObject(objectDefinition, values, comments = []) {
		/** @type {ConfigurationObject} */
		const obj = { definition: objectDefinition, values, comments };
		const idx = this._configuration.findIndex(c => c.definition.name === objectDefinition.name);
		if (idx !== -1) {
			// Replace existing object
			this._configuration.splice(idx, 1, obj);
		} else {
			this._configuration.push(obj);
		}
		return this.getConfigObject(objectDefinition.name);
	}

	/**
	 * Gets a config by theme name.
	 * @param {String} name The theme config name.
	 * @returns {ThemeSettings} The config.
	 */
	getConfigObject(name) {
		const obj = this._configuration.find(c => c.definition.name === name);
		return new ThemeSettings(this, name, obj);
	}

	/**
	 * Updates the values of the config for the given theme name.
	 * @param {String} objectName The theme config name.
	 * @param {*} values The values that will be written.
	 * @param {boolean} writeConfig Whether to write the config to disk.
	 */
	updateConfigObjValues(objectName, values, writeConfig = false) {
		const configObj = this._configuration.find(c => c.definition.name === objectName);
		if (Array.isArray(configObj.values)) {
			if (Array.isArray(values)) {
				configObj.values.splice(0, Infinity, ...values);
			} else {
				throw new InvalidTypeError('values', typeof values,  'array', 'Don\'t call updateConfigObjValues() to update Array values with non Array objects.');
			}
		} else {
			Object.assign(configObj.values, values);
		}
		if (writeConfig) {
			this.writeConfiguration();
		}
	}

	/**
	 * Reads the config from disk.
	 * @returns {Object} An object containing.
	 */
	readConfiguration() {
		try {
			const f = fso.GetFile(this.path);
			const p = f.OpenAsTextStream(FileMode.Read, FileType.Unicode);
			const jsonString = StripJsonComments(p.ReadAll());
			const config = JSON.parse(jsonString);
			p.Close();
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
	 * Writes the config file to the path specified when Configuration was instantiated.
	 *
	 * Only needs to be called manually the very first time, or if not calling updateConfigObjValues.
	 * ( Only happens if not using a ThemeSettings object received from addConfigurationObject ).
	 */
	writeConfiguration() {
		const p = fso.CreateTextFile(this.path, true, true);

		p.WriteLine('/////////////////////////////////////////////////////////////////////////////');
		p.WriteLine('// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //');
		p.WriteLine('// * Description:    Georgia-ReBORN Configuration File                   * //');
		p.WriteLine('// * Author:         TT                                                  * //');
		p.WriteLine('// * Org. Author:    Mordred                                             * //');
		p.WriteLine('// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //');
		p.WriteLine('// *                                                                     * //');
		p.WriteLine('// * Manual changes to this file will take effect on the next reload.    * //');
		p.WriteLine('// * To ensure changes are not overwritten or lost, reload the theme     * //');
		p.WriteLine('// * immediately after manually changing values.                         * //');
		p.WriteLine('/////////////////////////////////////////////////////////////////////////////');
		p.WriteLine('');
		p.WriteLine('');
		p.WriteLine('{');
		p.WriteLine('/////////////////////////////////////////////////////////////////////////////');
		p.WriteLine(`\t"configVersion": "${currentVersion}",`);
		p.WriteLine('/////////////////////////////////////////////////////////////////////////////');
		p.WriteLine('');

		this._configuration.forEach((conf, i) => {
			p.WriteLine('');
			const container = conf.definition.container === ConfigurationObjectType.Array ? '[' : '{';
			p.WriteLine(`\t"${conf.definition.name}": ${container}`);

			if (conf.definition.comment) {
				let line = conf.definition.comment;
				let done = false;
				while (!done) {
					const lineLen = 200;
					if (line.length < lineLen) {
						p.WriteLine(`\t\t// ${line.trim()}`);
						done = true;
					} else {
						const idx = line.lastIndexOf(' ', lineLen);
						p.WriteLine(`\t\t// ${line.substr(0, idx).trim()}`);
						line = line.substr(idx);
					}
				}
			}

			if (conf.definition.fields) {
				// Array of fields
				for (let i = 0; i < conf.values.length; i++) {
					let entry = '';
					if (conf.definition.container === ConfigurationObjectType.Array) {
						conf.definition.fields.forEach(field => {
							if (!field.optional || conf.values[i][field.name]) {
								const quotes = typeof conf.values[i][field.name] === 'string' ? '"' : '';
								entry += `, "${field.name}": ${quotes}${conf.values[i][field.name]}${quotes}`;
							}
						});
						entry = `{${entry.substr(1)} }`;
					}
					const comment = conf.values[i].comment ? ` // ${conf.values[i].comment}` : '';
					p.WriteLine(`\t\t${entry}${i < conf.values.length - 1 ? ',' : ''}${comment}`);
				}
			}
			else if (conf.definition.container === ConfigurationObjectType.Array) {
				// Array of comma separated entries
				conf.values.forEach((val, i) => {
					p.WriteLine(`\t\t"${val.replace(/\\/g, '\\\\')}"${i < conf.values.length - 1 ? ',' : ''}`);
				});
			}
			else {
				// Object with key/value pairs
				const keys = Object.keys(conf.values);
				keys.forEach((key, i) => {
					const comment = conf.comments[key] ? ` // ${conf.comments[key]}` : '';
					const quotes = typeof conf.values[key] === 'string' ? '"' : '';
					p.WriteLine(`\t\t"${key}": ${quotes}${conf.values[key]}${quotes}${i < keys.length - 1 ? ',' : ''}${comment}`);
				});
			}
			const closeContainer = conf.definition.container === ConfigurationObjectType.Array ? ']' : '}';
			p.WriteLine(`\t${closeContainer}${i < this._configuration.length - 1 ? ',' : ''}`);
		});

		p.WriteLine('}');
		p.Close();
	}

	/**
	 * Gets the path to the config file
	 * @returns {string} The path to the config file.
	 */
	getPath() {
		return this.path;
	}

	/**
	 * Resets the config to the default values.
	 */
	resetConfiguration() {
		fso.DeleteFile(this.path);
		setTimeout(() => {
			window.Reload();
		}, 1);
	}
}


////////////////////////
// * THEME SETTINGS * //
////////////////////////
/**
 * Provides methods to get and set the value of the config.
 */
class ThemeSetting {
	/**
	 * @param {string} name The name of the setting.
	 * @param {*} settingVal The value of the setting.
	 * @class
	 */
	constructor(name, settingVal) {
		/** @const {string} */
		this.name = name;
		this.value = settingVal;
	}

	/**
	 * Gets the value of the config.
	 * @returns {*} The config.
	 */
	get() {
		return this.value;
	}

	/**
	 * Sets the value of the config.
	 * @param {*} new_value The new value of the config.
	 */
	set(new_value) {
		if (this.value !== new_value) {
			this.value = new_value;
		}
	}
}


/**
 * Creates and manages config settings for a theme.
 */
class ThemeSettings {
	/**
	 * @param {Configuration} config The config.
	 * @param {String} objName The name of the config.
	 * @param {ConfigurationObject} properties The properties to add to the config.
	 * @class
	 */
	constructor(config, objName, properties = undefined) {
		/** @protected */
		this._properties_name_list = [];
		/** @protected */
		/** @type {Configuration} */
		this._config = config;
		this.objName = objName;
		if (properties) {
			this.add_properties(properties.values);
		}
	}

	/**
	 * Adds a set of properties to the config.
	 * @param {ConfigurationObject|*} properties Each item in array is an array of objects
	 */
	add_properties(properties) {
		Object.keys(properties).forEach(key => {
			this.validate_config_item(properties[key], key);
			this.add_config_item(properties[key], key);
		});
	}

	/**
	 * TODO: validation for item?
	 *
	 * Validates a config item throwing an InvalidTypeError if it's not valid when added to the config.
	 * @param {*} item The config item to validate.
	 * @param {String} item_id The id of the config item.
	 */
	validate_config_item(item, item_id) {
		// if (!Array.isArray(item) || item.length !== 2 || !IsString(item[0])) {
		// 	throw new InvalidTypeError('property', typeof item, '{ string, [string, any] }', 'Usage: add_properties({\n  property_id: [property_name, property_default_value]\n})');
		// }
		if (item_id === 'add_properties') {
			throw new ArgumentError('property_id', item_id, 'This id is reserved');
		}
		if (this[item_id] || this[`${item_id}_internal`]) {
			throw new ArgumentError('property_id', item_id, 'This id is already occupied');
		}
	}

	/**
	 * Adds a new item to a config object with getter and setter methods for accessing and updating the item's value.
	 * @param {Array} setting An array with two elements: the name of the setting and its default value.
	 * @param {string} item_id A unique identifier for the config item used to create a property on the object with the same name.
	 */
	add_config_item(setting, item_id) {
		this._properties_name_list[setting[0]] = 1;

		this[`${item_id}_internal`] = new ThemeSetting(item_id, setting);

		Object.defineProperty(this, item_id, {
			get() {
				return this[`${item_id}_internal`].get();
			},
			set(new_value) {
				if (this[`${item_id}_internal`].get() !== new_value) {
					this[`${item_id}_internal`].set(new_value);
					this._config.updateConfigObjValues(this.objName, { [item_id]: new_value }, true);
				}
			}
		});
	}
}
