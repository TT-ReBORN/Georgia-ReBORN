/////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean, Full Dynamic Color Reborn foobar2000 Theme * //
// * Description:    Georgia-ReBORN Configuration                        * //
// * Author:         TT                                                  * //
// * Org. Author:    Mordred                                             * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN         * //
// * Version:        3.0-RC1                                             * //
// * Dev. started:   2017-12-22                                          * //
// * Last change:    2023-04-27                                          * //
/////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////////
// * CONFIGURATION * //
///////////////////////
const ConfigurationObjectType = {
	Array: 'array',
	Object: 'object',
	Value: 'value'	// Not currently handled
};

/**
 * @typedef {Object} FieldDefinition
 * @property {string} name
 * @property {boolean=} optional
 */

class ConfigurationObjectSchema {
	/**
	 * @param {string} name The name to be used for the object in the configuration file. i.e. if the object is `grid: {}`, then name should be `'grid'`
	 * @param {string} container The type of container for the object. Should be of ConfigurationObjectType.
	 * @param {Array<FieldDefinition>=} fields The fields for each entry in the object. If undefined, uses key/value pairs for objects, or comma separated values for arrays.
	 * @param {string=} comment Adds a '//' field as first entry in the object. Used for explaining things to the user.
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
 * Read/write theme configuration to a JSON file
 */
class Configuration {
	/**
	 * Instantiate Configuration object and specify file to read from
	 * @param {string} configurationPath Path to the config file
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

	/** @returns {boolean} */
	get fileExists() {
		return IsFile(this.path);
	}

	/**
	 *
	 * @param {ConfigurationObjectSchema} objectDefinition
	 * @param {*} values
	 * @param {*} comments
	 * @returns {ThemeSettings} Provides getters and setters to automatically update config file when config val changes
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
	 *
	 * @param {String} name
	 * @returns {ThemeSettings}
	 */
	getConfigObject(name) {
		const obj = this._configuration.find(c => c.definition.name === name);
		return new ThemeSettings(this, name, obj);
	}

	/**
	 * Replace the stored values for the object
	 * @param {String} objectName The name to be used for the object in the configuration file. i.e. if the object is `grid: {}`, then objectName should be `'grid'`
	 * @param {*} values
	 * @param {boolean} writeConfig
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
	 * @returns {Object} An object containing
	 */
	readConfiguration() {
		try {
			const f = fso.GetFile(this.path);
			const p = f.OpenAsTextStream(FileMode.Read, FileType.Unicode);
			const jsonString = stripJsonComments(p.ReadAll());
			const config = JSON.parse(jsonString);
			p.Close();
			return config;
		}
		catch (e) {
			throw new ThemeError(`<ERROR: Could not read from ${this.path}, or JSON may be invalid. ` +
				'If the config file exists, please delete or restore it from a backup.>');
		}
	}

	/**
	 * Writes the configuration file to the path specified when Configuration was instantiated.
	 * Only needs to be called manually the very first time, or if not calling updateConfigObjValues.
	 * ( Only happens if not using a ThemeSettings object received from addConfigurationObject )
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

	getPath() {
		return this.path;
	}

	resetConfiguration() {
		fso.DeleteFile(this.path);
		setTimeout(() => {
			window.Reload();
		}, 1);
	}
}


//////////////
// * JSON * //
//////////////
const singleComment = Symbol('singleComment');
const multiComment = Symbol('multiComment');
const stripWithoutWhitespace = () => '';
const stripWithWhitespace = (string, start, end) => string.slice(start, end).replace(/\S/g, ' ');

const isEscaped = (jsonString, quotePosition) => {
	let index = quotePosition - 1;
	let backslashCount = 0;

	while (jsonString[index] === '\\') {
		index--;
		backslashCount++;
	}

	return Boolean(backslashCount % 2);
};


/** https://github.com/sindresorhus/strip-json-comments/blob/master/index.js */
function stripJsonComments(jsonString, options = { whitespace: false }) {
	if (typeof jsonString !== 'string') {
		throw new TypeError(`Expected argument \`jsonString\` to be a \`string\`, got \`${typeof jsonString}\``);
	}

	const strip = options.whitespace === false ? stripWithoutWhitespace : stripWithWhitespace;

	let insideString;
	let insideComment;
	let offset = 0;
	let result = '';

	for (let i = 0; i < jsonString.length; i++) {
		const currentCharacter = jsonString[i];
		const nextCharacter = jsonString[i + 1];

		if (!insideComment && currentCharacter === '"') {
			const escaped = isEscaped(jsonString, i);
			if (!escaped) {
				insideString = !insideString;
			}
		}

		if (insideString) {
			continue;
		}

		if (!insideComment && currentCharacter + nextCharacter === '//') {
			result += jsonString.slice(offset, i);
			offset = i;
			insideComment = singleComment;
			i++;
		}
		else if (insideComment === singleComment && currentCharacter + nextCharacter === '\r\n') {
			i++;
			insideComment = false;
			result += strip(jsonString, offset, i);
			offset = i;
			continue;
		}
		else if (insideComment === singleComment && currentCharacter === '\n') {
			insideComment = false;
			result += strip(jsonString, offset, i);
			offset = i;
		}
		else if (!insideComment && currentCharacter + nextCharacter === '/*') {
			result += jsonString.slice(offset, i);
			offset = i;
			insideComment = multiComment;
			i++;
			continue;
		}
		else if (insideComment === multiComment && currentCharacter + nextCharacter === '*/') {
			i++;
			insideComment = false;
			result += strip(jsonString, offset, i + 1);
			offset = i + 1;
			continue;
		}
	}

	return result + (insideComment ? strip(jsonString.slice(offset)) : jsonString.slice(offset));
}


////////////////////////
// * THEME SETTINGS * //
////////////////////////
/**
 * @param {string} name
 * @param {*} settingVal
 * @constructor
 */
class ThemeSetting {
	constructor(name, settingVal) {
		/** @const {string} */
		this.name = name;
		this.value = settingVal;
	}

	/**
	 * @return {*}
	 */
	get() {
		return this.value;
	}

	/**
	 * @param {*} new_value
	 */
	set(new_value) {
		if (this.value !== new_value) {
			this.value = new_value;
		}
	}
}


class ThemeSettings {
	/**
	 *
	 * @param {Configuration} config
	 * @param {String} objName
	 * @param {ConfigurationObject} properties
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
	 * @param {ConfigurationObject|*} properties Each item in array is an array of objects }
	 */
	add_properties(properties) {
		Object.keys(properties).forEach(key => {
			this.validate_config_item(properties[key], key);
			this.add_config_item(properties[key], key);
		});
	}

	/**
	 * TODO: validation for item?
	 * @param {*} item
	 * @param {String} item_id
	 */
	validate_config_item(item, item_id) {
		// if (!Array.isArray(item) || item.length !== 2 || !isString(item[0])) {
		// 	throw new InvalidTypeError('property', typeof item, '{ string, [string, any] }', 'Usage: add_properties({\n  property_id: [property_name, property_default_value]\n})');
		// }
		if (item_id === 'add_properties') {
			throw new ArgumentError('property_id', item_id, 'This id is reserved');
		}
		if (this[item_id] || this[`${item_id}_internal`]) {
			throw new ArgumentError('property_id', item_id, 'This id is already occupied');
		}
	}

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
