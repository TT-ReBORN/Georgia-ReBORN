/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Main Helpers                             * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred                                                 * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-RC3                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    27-11-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


///////////////////////
// * COMPATIBILITY * //
///////////////////////
/**
 * Detects if Internet Explorer is installed on the user's system by searching for specific file paths
 * in the Program Files directories of all available disk drives. Needed to render HTML popups.
 * @global
 * @returns {boolean} True or false.
 */
function DetectIE() {
	const diskLetters = Array.from(Array(26)).map((e, i) => i + 65).map((x) => `${String.fromCharCode(x)}:\\`);
	const paths = ['Program Files\\Internet Explorer\\ieinstal.exe', 'Program Files (x86)\\Internet Explorer\\ieinstal.exe'];
	return diskLetters.some((d) => {
		try { // Needed when permission error occurs and current SMP implementation is broken for some devices....
			return IsFolder(d) ? paths.some((p) => IsFile(d + p)) : false;
		} catch (e) { return false; }
	});
}


/**
 * Detects if the user's system is running on Win x64 by looking for specific folders
 * in the Program Files (x86) directory on all available disk drives. Actually used only for x86 detection.
 * @global
 * @returns {boolean} True or false.
 */
function DetectWin64() {
	const diskLetters = Array.from(Array(26)).map((e, i) => i + 65).map((x) => `${String.fromCharCode(x)}:\\`);
	const paths = ['Program Files (x86)'];
	return diskLetters.some((d) => {
		try { // Needed when permission error occurs and current SMP implementation is broken for some devices....
			return IsFolder(d) ? paths.some((p) => IsFolder(d + p)) : false;
		} catch (e) { return false; }
	});
}


/**
 * Detects if the user's system is running Wine on Linux or MacOs by looking for specific folder
 * with the name 'bin' and files with the names 'bash', 'ls', 'sh', and 'fstab' on any partitions from A to Z.
 * Default Wine mount point is Z:\.
 * @global
 * @returns {boolean} True or false.
 */
function DetectWine() {
	const diskLetters = Array.from(Array(26)).map((e, i) => i + 65).map((x) => `${String.fromCharCode(x)}:\\`);
	const paths = ['bin\\bash', 'bin\\ls', 'bin\\sh', 'etc\\fstab'];
	return diskLetters.some((d) => {
		try { // Needed when permission error occurs and current SMP implementation is broken for some devices....
			return IsFolder(d) ? paths.some((p) => IsFile(d + p)) : false;
		} catch (e) { return false; }
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


///////////////
// * DEBUG * //
///////////////
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
 * Sanitizes a string to be safe for insertion into a JSON config.
 * Removes double quotes, backslashes, newlines and trailing spaces.
 * @global
 * @param {string} str - The string to sanitize.
 * @returns {string} The sanitized string.
 */
function SanitizeJsonString(str) {
	if (typeof str !== 'string') return '';

	return str
		.replace(/"/g, '')
		.replace(/\\/g, '')
		.replace(/\r?\n|\r/g, ' ')
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
	const stripWithWhitespace = (string, start, end) => string.slice(start, end).replace(/\S/g, ' ');
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
 * Cleans a given file path by replacing illegal characters, normalizing dashes, and removing unnecessary spaces.
 * @param {string} value - The file path to clean.
 * @returns {string} - The cleaned file path.
 */
function CleanFilePath(value) {
	if (!value || !value.length) return '';
	const disk = (value.match(/^[a-zA-Z]:\\/g) || [''])[0];
	const pathWithoutDisk = value.replace(disk, '');

	const cleanedParts = pathWithoutDisk.split('\\').map(part => part
		.replace(/[<>:"/\\|?*]+/g, '_') // Replace illegal characters with '_'
		.replace(/[|–‐—-]/g, '-') // Replace various dash characters with '-'
		.replace(/(?! )\s/g, '') // Remove spaces not preceded by another space
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
		folder = folder.replace(/^\.\\/, fb.FoobarPath).replace(/\\$/, '');

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
 * @param {RegExp|string[]} allowedFormats - The regex pattern or an array of file formats to include in the filter.
 * @param {RegExp|null} excludePattern - The regex pattern to exclude files.
 * @returns {string[]} The filtered array containing only the specified file formats or matching the regex pattern.
 * @example
 * // Filter out only *.jpg and *.png files:
 * FilterFiles(['image.jpg', 'document.pdf', 'photo.png', 'note.txt'], ['jpg', 'png']);
 * // Returns: ['image.jpg', 'photo.png']
 *
 * // Filter out files matching a custom pattern:
 * FilterFiles(['cd1.jpg', 'discA.png', 'vinyl2.jpg', 'cover.jpg', 'note.txt'], ['jpg', 'png'], /(cd|disc|vinyl)([0-9]*|[a-h]).(png|jpg)/i);
 * // Returns: ['cover.jpg']
 */
function FilterFiles(files = [], allowedFormats = [], excludePattern = null) {
	const filePattern =
		Array.isArray(allowedFormats) ? new RegExp(`\\.(${allowedFormats.join('|')})$`, 'i') : allowedFormats;

	return files.filter(file => filePattern.test(file) && (!excludePattern || !excludePattern.test(file)));
}


/**
 * Finds files in a directory that match a given pattern. This function is a replacement for SMP's utils.Glob().
 * @global
 * @param {string} filePath - The file path with an optional pattern (wildcards) to match files.
 * @returns {string[]} The array of matching file paths.
 * @example
 * // Finds all jpg files in the directory C:\Test
 * FindFiles("C:\\Test\\*.jpg");
 *
 * // Finds all files in the directory C:\Test that start with 'folder'
 * FindFiles("C:\\Test\\folder*");
 *
 * // Finds the specific file folder.jpg in the directory C:\Test
 * FindFiles("C:\\Test\\folder.jpg");
 */
function FindFiles(filePath) {
	const lastBackslashIndex = filePath.lastIndexOf('\\');
	if (lastBackslashIndex === -1) return [];

	const directory = filePath.slice(0, lastBackslashIndex);
	if (!IsFolder(directory)) return [];

	const folder = fso.GetFolder(directory);
	const files = folder.Files;
	const filePattern = filePath.slice(lastBackslashIndex + 1);

	// * Early exit for exact match without wildcards
	if (!filePattern.includes('*')) {
		const exactFile = `${folder.Path}\\${filePattern}`;
		return IsFile(exactFile) ? [exactFile] : [];
	}

	// * Search for files that match the pattern
	const result = [];
	const regex = new RegExp(`^${filePattern.replace(/\*/g, '.*')}$`, 'i');

	for (const file of files) {
		if (regex.test(file.Name)) {
			result.push(file.Path);
		}
	}

	return result;
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


/**
 * Wrapper for `utils.Glob`, which does not support file paths with semicolons.
 * Uses the faster SMP's `utils.Glob` method for paths without semicolons, or the slower `FindFiles` helper otherwise.
 * @global
 * @param {string} filePath - The path of the file to process.
 * @returns {string[] | any} The array of matching file paths returned by `utils.Glob` or `FindFiles`.
 */
function UtilsGlob(filePath) {
	return !filePath.includes(';') ? utils.Glob(filePath) : FindFiles(filePath);
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
 * Handles key press actions based on the state of control keys (Ctrl, Alt, Shift).
 * @global
 * @param {object} action - An object mapping key press combinations to their respective actions.
 * @param {Function} [action.ctrlAltShift] - Action to perform if `Ctrl`, `Alt`, and `Shift` keys are all pressed.
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
		// Ctrl combinations
		{ condition: CTRL && ALT && SHIFT, action: action.ctrlAltShift },
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
 * Wraps a synchronous function call that does not return a promise in a promise.
 * This utility function is useful for converting functions that perform synchronous operations
 * into a promise-based interface, allowing them to be used with async/await syntax.
 * Additionally, it can poll for a condition before resolving.
 * @global
 * @param {function(): void} func - The synchronous function to wrap. This function should not return a promise.
 * @param {function(): boolean} [condition] - An optional condition function to check before resolving the promise.
 * @returns {Promise<void>} A promise that resolves immediately after the function call completes or the condition is met.
 */
function MakeAsync(func, condition) {
	return new Promise(resolve => {
		func();

		if (condition) {
			const checkCondition = () => {
				if (condition()) {
					clearInterval(interval);
					resolve();
				}
			};

			const interval = setInterval(checkCondition, 50);
			setTimeout(checkCondition, 0); // Fallback to setTimeout in case the condition is met very quickly
			return;
		}

		resolve();
	});
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
	const rgb = colorStr.match(/\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)/);
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
	const maskWidth = cropWidth ? image.Width - cropWidth : image.Width;
	const maskHeight = cropHeight ? image.Height - cropHeight : image.Height;
	const maskX = cropWidth / 2;
	const maskY = cropHeight / 2;

	// * Mask
	const maskImg = gdi.CreateImage(maskWidth, maskHeight);
	let g = maskImg.GetGraphics();
	g.FillSolidRect(0, 0, maskWidth, maskHeight, 0xff000000);
	maskImg.ReleaseGraphics(g);

	// * Canvas with cropped image
	const croppedImg = gdi.CreateImage(maskWidth, maskHeight);
	g = croppedImg.GetGraphics();
	g.SetSmoothingMode(SmoothingMode.None);
	g.DrawImage(image, 0, 0, maskWidth, maskHeight, cropWidth ? maskX : 0, cropHeight ? maskY : 0, maskWidth, maskHeight);
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
	if (w <= 0 || h <= 0) return null;

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
	// * Mask
	const maskImg = gdi.CreateImage(w + SCALE(1), h + SCALE(1));
	let g = maskImg.GetGraphics();
	g.FillSolidRect(0, 0, w, h, 0xffffffff);
	g.SetSmoothingMode(SmoothingMode.AntiAlias);
	g.FillRoundRect(0, 0, w - SCALE(1), h - SCALE(1), arc_width, arc_height, 0xff000000);
	maskImg.ReleaseGraphics(g);

	// * Blended rect
	const gradRectImg = gdi.CreateImage(w + SCALE(1), h + SCALE(1));
	g = gradRectImg.GetGraphics();
	g.DrawImage(grCol.imgBlended, 0, 0, w - SCALE(1), h - SCALE(1), 0, h, grCol.imgBlended.Width, grCol.imgBlended.Height);
	gradRectImg.ReleaseGraphics(g);

	const mask = maskImg.Resize(w + SCALE(1), h + SCALE(1));
	gradRectImg.ApplyMask(mask);

	return gr.DrawImage(gradRectImg, x, y, w - SCALE(1), h - SCALE(1), 0, 0, w, h, 0, 255);
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
	const lw = SCALE(2);
	// * Mask
	const maskImg = gdi.CreateImage(w + SCALE(1), h + SCALE(1));
	let g = maskImg.GetGraphics();
	g.FillSolidRect(0, 0, w, h, 0xffffffff);
	g.SetSmoothingMode(SmoothingMode.AntiAlias);
	g.FillEllipse(Math.floor(lw / 2), Math.floor(lw / 2), w - lw - SCALE(1), h - lw - SCALE(1), 0xff000000);
	maskImg.ReleaseGraphics(g);

	// * Gradient ellipse
	const gradEllipseImg = gdi.CreateImage(w + SCALE(1), h + SCALE(1));
	g = gradEllipseImg.GetGraphics();
	g.FillGradRect(Math.floor(lw / 2), Math.floor(lw / 2), w - lw - SCALE(1), h - lw - SCALE(1), angle, color1, color2, focus);
	gradEllipseImg.ReleaseGraphics(g);

	const mask = maskImg.Resize(w + SCALE(1), h + SCALE(1));
	gradEllipseImg.ApplyMask(mask);

	return gr.DrawImage(gradEllipseImg, x, y, w - SCALE(1), h - SCALE(1), 0, 0, w, h, 0, 255);
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
 * @param {number} focus - The focus where the centered color will be at its highest intensity. Values 0 or 1.
 * @returns {GdiGraphics} The gradient filled rounded rectangle.
 */
function FillGradRoundRect(gr, x, y, w, h, arc_width, arc_height, angle, color1, color2, focus) {
	if (w <= 0 || h <= 0) return null;

	// * Arc dimension safeguard
	const minArc = Math.min(w, h) / 2;
	arc_width  = Math.max(0, Math.min(arc_width, minArc));
	arc_height = Math.max(0, Math.min(arc_height, minArc));

	// * Mask
	const maskImg = gdi.CreateImage(w + SCALE(1), h + SCALE(1));
	let g = maskImg.GetGraphics();
	g.FillSolidRect(0, 0, w, h, 0xffffffff);
	g.SetSmoothingMode(SmoothingMode.AntiAlias);
	g.FillRoundRect(0, 0, w - SCALE(1), h - SCALE(1), arc_width, arc_height, 0xff000000);
	maskImg.ReleaseGraphics(g);

	// * Gradient rect
	const gradRectImg = gdi.CreateImage(w + SCALE(1), h + SCALE(1));
	g = gradRectImg.GetGraphics();
	g.FillGradRect(0, 0, w - SCALE(1), h - SCALE(1), angle, color1, color2, focus);
	gradRectImg.ReleaseGraphics(g);

	const mask = maskImg.Resize(w + SCALE(1), h + SCALE(1));
	gradRectImg.ApplyMask(mask);

	return gr.DrawImage(gradRectImg, x, y, w - SCALE(1), h - SCALE(1), 0, 0, w, h, 0, 255);
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
	if (w <= 0 || h <= 0) return null;

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
	if (!img || !w || !h) return null;

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
	if (!img || !img.Width || !img.Height) {
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
	const words = text.match(/\S+/g) || []; // Split text into words

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
			availableWidth - line.x_offset, lineHeight, Stringformat.trim_ellipsis_word);
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
	const specialSymbolsRegex = /[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2020-\u2021\u2023-\u26FF]|\uD83E[\uDD10-\uDDFF]/;
	return gr.DrawString(str, specialSymbolsRegex.test(str) ? gdi.Font('Segoe UI Symbol', font.Size, font.Style) : font, color, x, y, w, h, flags);
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
	return ({}).toString.call(a).match(/([a-z]+)(:?\])/i)[1];
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
		return Math.round(2000 * Math.log(volume) / Math.LN10) / 100;
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
 * @param {FbMetadbHandle} metadb - The handle to evaluate string with.
 * @param {boolean} [force] - An optional force evaluate.
 * @returns {string} The formatted title or an error message.
 */
function $(titleFormatString, metadb = undefined, force = false) {
	try {
		return metadb ? fb.TitleFormat(titleFormatString).EvalWithMetadb(metadb) : fb.TitleFormat(titleFormatString).Eval(force);
	} catch (e) {
		return `${e} (Invalid metadb!)`;
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
		.replace(/[()[\],%]/g, "'$&'")
		.replace(/\$/g, "'$$$$'");
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
	return everyWord ? str.replace(/\b\w/g, char => char.toUpperCase()) :
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
 * Takes an array of strings as input and returns the string with the longest length.
 * @global
 * @param {Array} arr - The array to compare.
 * @returns {string} The longest string.
 */
function LongestString(arr) {
	return arr.reduce((a, b) => a.length > b.length ? a : b);
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
 * Replaces unicode characters such as apostrophes and multi-timestamps which will print as crap.
 * May not be needed when using UTF-8 code page.
 * @global
 * @param {string} rawString - The raw string that has certain characters that need to be replaced.
 * @returns {string} The modified string with replaced characters.
 */
function ReplaceChars(rawString) {
	return rawString.trim()
	.replace(/&amp(;|)/g, '&')
	.replace(/&gt(;|)/g, '>')
	.replace(/&lt(;|)/g, '<')
	.replace(/&nbsp(;|)/g, '')
	.replace(/&quot(;|)/g, '"')
	.replace(/<br>/gi, '')
	.replace(/\uFF1A/g, ':')
	.replace(/\uFF08/g, '(')
	.replace(/\uFF09/g, ')')
	.replace(/\u00E2\u20AC\u2122|\u2019|\uFF07|[\u0060\u00B4]|â€™(;|)|â€˜(;|)|&apos(;|)|&#39(;|)|(&#(?:039|8216|8217|8220|8221|8222|8223|x27);)/g, "'") // Apostrophe variants
	.replace(/[\u2000-\u200F\u2028-\u202F\u205F-\u206F\u3000\uFEFF]/g, ' ') // Whitespace variants
	.replace(/(\s*)<(\d{1,2}:|)\d{1,2}:\d{2}(>|\.\d{1,3}>)(\s*)/g, '$1$4'); // Fix enhanced LRC format
}


/**
 * Replaces special characters in filenames.
 * @global
 * @param {string} s - The string to be replaced.
 * @returns {string} The modified string with replaced characters.
 */
function ReplaceFileChars(s) {
	return s.replace(/:/g, '_')
			.replace(/\\/g, '-')
			.replace(/\//g, '-')
			.replace(/\?/g, '')
			.replace(/</g, '')
			.replace(/>/g, '')
			.replace(/\*/g, '')
			.replace(/"/g, '\'')
			.replace(/\|/g, '-');
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
 * Deletes the Biography cache on auto or manual usage.
 * @global
 */
function DeleteBiographyCache() {
	DeleteFolder(grSet.customBiographyDir ? `${grCfg.customBiographyDir}\\*.*` : `${fb.ProfilePath}cache\\biography\\biography-cache`);
}


/**
 * Deletes the Library cache on auto or manual usage.
 * @global
 */
function DeleteLibraryCache() {
	DeleteFolder(grSet.customLibraryDir ? `${grCfg.customLibraryDir}\\*.*` : `${fb.ProfilePath}cache\\library\\library-tree-cache`);
}


/**
 * Deletes the Lyrics cache on auto or manual usage.
 * @global
 */
function DeleteLyrics() {
	DeleteFile(grSet.customLyricsDir ? `${grCfg.customLyricsDir}\\*.*` : `${fb.ProfilePath}cache\\lyrics\\*.*`);
}


/**
 * Deletes the Waveform bar cache on auto or manual usage.
 * @global
 */
function DeleteWaveformBarCache() {
	DeleteFolder(grSet.customWaveformBarDir ? `${grCfg.customWaveformBarDir}\\*.*` : `${fb.ProfilePath}cache\\waveform\\*.*`);
}


/**
 * Formats the theme day/night mode time range string into a more readable format.
 * @global
 * @param {string|null} themeDayNightMode - The time range for theme day/night mode in 24-hour format, e.g. '6-18' for 6am to 6pm. If null or undefined, it returns 'Deactivated (default)'.
 * @returns {string} A formatted string representing the time range in 12-hour format with am/pm suffixes, e.g. '06am (day) - 06pm (night)', or 'Deactivated (default)' if themeDayNightMode is falsy.
 */
function FormatThemeDayNightModeString(themeDayNightMode) {
	if (!themeDayNightMode) return 'Deactivated (default)';

	// * Safeguard to handle number values and convert them to string with default end hour
	if (typeof grSet.themeDayNightMode === 'number') {
		grSet.themeDayNightMode = `${grSet.themeDayNightMode}-18`; // Defaulting end hour to 18 (6 PM)
	} else if (typeof grSet.themeDayNightMode === 'string' && !grSet.themeDayNightMode.includes('-')) {
		grSet.themeDayNightMode = `${grSet.themeDayNightMode}-${grSet.themeDayNightMode}`; // Same start and end hour
	}

	const [start, end] = themeDayNightMode.split('-').map(part => {
		let hour = parseInt(part, 10);
		const suffix = (hour >= 12 && hour < 24) ? ' PM' : ' AM';
		hour = (hour === 0 || hour === 12) ? 12 : hour % 12;
		return `${hour.toString().padStart(2, '0')}${suffix}`;
	});
	return `${start} (day) - ${end} (night)`;
}


/**
 * Makes or restores a theme backup.
 * @global
 * @param {boolean} make - Whether to make a theme backup.
 * @param {boolean} restore - Whether to restore a theme backup.
 * @returns {Promise<void>} A promise that resolves when the processing has finished.
 */
async function ManageBackup(make, restore) {
	const backupPath = `${fb.ProfilePath}backup\\profile\\`;
	const cfgPathFb  = `${fb.ProfilePath}configuration`;
	const dspPathFb  = `${fb.ProfilePath}dsp-presets`;
	const cfgPathBp  = `${backupPath}configuration`;
	const dspPathBp  = `${backupPath}dsp-presets`;
	const indexPath  = `${backupPath}index-data`;
	const themePath  = `${backupPath}georgia-reborn`;

	const libOld   = make ? `${fb.ProfilePath}library`        : `${backupPath}library`;
	const libNew   = make ? `${fb.ProfilePath}library-v2.0`   : `${backupPath}library-v2.0`;
	const plistOld = make ? `${fb.ProfilePath}playlists-v1.4` : `${backupPath}playlists-v1.4`;
	const plistNew = make ? `${fb.ProfilePath}playlists-v2.0` : `${backupPath}playlists-v2.0`;

	let libaryDir;
	let playlistDir;
	let oldVersion = false;

	const checkVersion = async () => {
		if      (IsFolder(libOld)) { libaryDir = libOld; oldVersion = true; }
		else if (IsFolder(libNew)) { libaryDir = libNew; oldVersion = false; }
		if      (IsFolder(plistOld)) { playlistDir = plistOld; oldVersion = true; }
		else if (IsFolder(plistNew)) { playlistDir = plistNew; oldVersion = false; }
	};

	const createFolders = async () => {
		CreateFolder(themePath);
		CreateFolder(cfgPathFb);
		CreateFolder(cfgPathBp);
		CreateFolder(dspPathFb);
		CreateFolder(dspPathBp);
		if (oldVersion) CreateFolder(indexPath);
	};

	const checkFolders = () => {
		// * Safeguard to prevent crash when directories do not exist
		const foldersExist =
			((IsFolder(libOld) && IsFolder(plistOld)) || IsFolder(libNew) && IsFolder(plistNew))
			&&
			(IsFolder(themePath) && IsFolder(dspPathFb) && IsFolder(dspPathBp) && IsFolder(cfgPathFb) && IsFolder(cfgPathBp));

		if (foldersExist) {
			return true;
		}
		else {
			if (make) {
				fb.ShowPopupMessage(`>>> Georgia-ReBORN theme backup was aborted <<<\n\n"configuration" or "dsp-presets" or "georgia-reborn" or "library" or "playlist" directory\ndoes not exist in:\n${fb.ProfilePath}`, 'Theme backup');
			} else {
				fb.ShowPopupMessage(`>>> Georgia-ReBORN restore backup was aborted <<<\n\n"backup" directory does not exist in:\n${fb.ProfilePath}\n\nor\n\n"configuration" or "dsp-presets" or "georgia-reborn" or "library" or "playlist" directory\ndoes not exist in:\n${fb.ProfilePath}backup`, 'Theme backup');
			}
			return false;
		}
	};

	const copyFolders = async () => {
		const backup    = new ActiveXObject('Scripting.FileSystemObject');
		const library   = backup.GetFolder(libaryDir);
		const playlists = backup.GetFolder(playlistDir);
		const configs   = backup.GetFolder(make ? `${fb.ProfilePath}georgia-reborn\\configs` : `${backupPath}georgia-reborn\\configs`);
		const cfg       = backup.GetFolder(make ? cfgPathFb : `${backupPath}configuration`);

		// * If old or new version, copy the library, playlist and config files
		library.Copy(make ? backupPath : `${fb.ProfilePath}`, true);
		playlists.Copy(make ? backupPath : `${fb.ProfilePath}`, true);
		configs.Copy(make ? `${backupPath}georgia-reborn\\configs` : `${fb.ProfilePath}georgia-reborn\\configs`, true);
		try { cfg.Copy(make ? `${backupPath}configuration` : cfgPathFb, true); } catch (e) {}

		// * Delete user's foo_ui_columns.dll.cfg, we use the clean cfg file from the zip
		DeleteFile(`${backupPath}configuration\\foo_ui_columns.dll.cfg`);

		// * If old version, copy the old library data files
		if (oldVersion) {
			const indexData = backup.GetFolder(make ? `${fb.ProfilePath}index-data` : indexPath);
			indexData.Copy(make ? backupPath : `${fb.ProfilePath}`, true);
			return;
		}

		// * If new version, copy the new fb2k v2 files
		const dspPresets = backup.GetFolder(make ? dspPathFb : dspPathBp);
		const dspConfig = backup.GetFile(make ? `${fb.ProfilePath}config.fb2k-dsp` : `${backupPath}config.fb2k-dsp`);
		const fbConfig = backup.GetFile(make ? `${fb.ProfilePath}config.sqlite` : `${backupPath}config.sqlite`);
		const metadb = backup.GetFile(make ? `${fb.ProfilePath}metadb.sqlite` : `${backupPath}metadb.sqlite`);
		dspPresets.Copy(make ? backupPath : `${fb.ProfilePath}`, true);
		dspConfig.Copy(make ? backupPath : `${fb.ProfilePath}`, true);
		fbConfig.Copy(make ? backupPath : `${fb.ProfilePath}`, true);
		metadb.Copy(make ? backupPath : `${fb.ProfilePath}`, true);
	};

	const makeBackup = async () => {
		await checkVersion();
		await createFolders();

		if (!checkFolders()) return;

		await grm.settings.setThemeSettings(true);
		await copyFolders();

		if (Detect.Wine || !Detect.IE) { // Disable fancy popup on Linux or if no IE is installed, otherwise it will crash and is not yet supported
			const msgFb = `>>> Theme backup has been successfully saved <<<\n\n${fb.ProfilePath}backup`;
			fb.ShowPopupMessage(msgFb, 'Theme backup');
		} else {
			const msg = `Theme backup has been successfully saved:\n\n${fb.ProfilePath}backup\n\n\n`;
			lib.popUpBox.confirm('Georgia-ReBORN', msg, 'OK', false, false, 'center', false);
		}
	};

	const restoreBackup = async () => {
		if (!checkFolders()) return;

		grSet.restoreBackupPlaylist = true;

		await checkVersion();
		await copyFolders();
		await grm.settings.setThemeSettings(false, true);
		setTimeout(() => { fb.RunMainMenuCommand('File/Restart'); }, 1000);
	};

	if (make) {
		await makeBackup();
	} else {
		await restoreBackup();
	}
}


/**
 * Restores the backup playlist directory with its playlists.
 * This is a workaround for foobar when the user has installed and launched foobar for the first time after installation.
 * If the theme backup has been successfully restored, foobar automatically deletes all restored playlist files in the playlist directory.
 * On the next foobar restart and initialization, foobar adds default playlist files in the playlist directory making them useless.
 * To fix this issue, all playlist files from the backup directory will be copied and restored again.
 * @global
 * @returns {Promise<void>} A promise that resolves when the processing has finished.
 */
async function RestoreBackupPlaylist() {
	const plistOld = `${fb.ProfilePath}backup\\profile\\playlists-v1.4`;
	const plistNew = `${fb.ProfilePath}backup\\profile\\playlists-v2.0`;

	let playlistDir;

	const checkVersion = async () => {
		if      (IsFolder(plistOld)) { playlistDir = plistOld; }
		else if (IsFolder(plistNew)) { playlistDir = plistNew; }
	};

	const checkFolders = () => {
		// * Safeguard to prevent crash when directories do not exist
		const foldersExist = IsFolder(plistOld) || IsFolder(plistNew);

		if (foldersExist) {
			return true;
		}
		else {
			fb.ShowPopupMessage(`>>> Georgia-ReBORN restore backup was aborted <<<\n\n"playlist" directory does not exist in:\n${fb.ProfilePath}backup`, 'Theme backup');
			return false;
		}
	};

	const copyFolders = async () => {
		const backup = new ActiveXObject('Scripting.FileSystemObject');
		const playlists = backup.GetFolder(playlistDir);
		playlists.Copy(`${fb.ProfilePath}`, true);
	};

	const restoreBackup = async () => {
		grSet.restoreBackupPlaylist = false;
		if (!checkFolders()) return;

		await checkVersion();
		await copyFolders();
		await grm.settings.setThemeSettings(false, true);
		console.log('\n>>> Georgia-ReBORN theme backup has been successfully restored <<<\n\n');
		setTimeout(() => { fb.RunMainMenuCommand('File/Restart'); }, 1000);
	};

	await restoreBackup();
}


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


/**
 * Writes %GR_THEMECOLOR%, %GR_THEME%, %GR_STYLE%, %GR_PRESET% tags to music files via the Playlist or Library context menu.
 * @global
 */
function WriteThemeTags() {
	const plItems = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
	const libItems = new FbMetadbHandleList(lib.pop.getHandleList('newItems'));
	const items = grm.ui.displayLibrary && !grm.ui.displayPlaylist || grm.ui.displayLibrarySplit() && grm.ui.state.mouse_x < grm.ui.ww * 0.5 ? libItems : plItems;

	if (!items || items.Count === 0) return;

	const grTags = [];
	const themeColor = grSet.theme === 'random' ? ColToRgb(grCol.primary) : '';
	const theme = grSet.preset === false ? grSet.theme : '';
	const preset = grSet.preset !== false ? grSet.preset : '';
	let style = '';

	if (grSet.preset === false) {
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
			grSet.styleVolumeBarFill === 'bevel' && 'volumeBarFill=inner'
		];

		// * Filter out the empty strings and join the remaining ones
		style = styleOptions.filter(Boolean).join('; ');
	}

	for (let i = 0; i < items.Count; ++i) {
		grTags.push({
			GR_THEMECOLOR: themeColor,
			GR_THEME: theme,
			GR_STYLE: style,
			GR_PRESET: preset
		});
	}

	if (items.Count) items.UpdateFileInfoFromJSON(JSON.stringify(grTags));
}
