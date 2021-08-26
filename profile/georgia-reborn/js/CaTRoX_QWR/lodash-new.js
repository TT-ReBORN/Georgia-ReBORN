let _exports = (() => {

	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/** Used as a reference to the global object. */
	var root = Function('return this')();

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
		arrayTag = '[object Array]',
		asyncTag = '[object AsyncFunction]',
		boolTag = '[object Boolean]',
		dateTag = '[object Date]',
		domExcTag = '[object DOMException]',
		errorTag = '[object Error]',
		funcTag = '[object Function]',
		genTag = '[object GeneratorFunction]',
		mapTag = '[object Map]',
		numberTag = '[object Number]',
		nullTag = '[object Null]',
		objectTag = '[object Object]',
		promiseTag = '[object Promise]',
		proxyTag = '[object Proxy]',
		regexpTag = '[object RegExp]',
		setTag = '[object Set]',
		stringTag = '[object String]',
		symbolTag = '[object Symbol]',
		undefinedTag = '[object Undefined]',
		weakMapTag = '[object WeakMap]',
		weakSetTag = '[object WeakSet]';

	var arrayBufferTag = '[object ArrayBuffer]',
		dataViewTag = '[object DataView]',
		float32Tag = '[object Float32Array]',
		float64Tag = '[object Float64Array]',
		int8Tag = '[object Int8Array]',
		int16Tag = '[object Int16Array]',
		int32Tag = '[object Int32Array]',
		uint8Tag = '[object Uint8Array]',
		uint8ClampedTag = '[object Uint8ClampedArray]',
		uint16Tag = '[object Uint16Array]',
		uint32Tag = '[object Uint32Array]';

	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
		typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
		typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
		typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
		typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
		typedArrayTags[uint32Tag] = true;
		typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
		typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
		typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
		typedArrayTags[errorTag] = typedArrayTags[funcTag] =
		typedArrayTags[mapTag] = typedArrayTags[numberTag] =
		typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
		typedArrayTags[setTag] = typedArrayTags[stringTag] =
		typedArrayTags[weakMapTag] = false;

	/** Used to identify `toStringTag` values supported by `_.clone`. */
	var cloneableTags = {};
		cloneableTags[argsTag] = cloneableTags[arrayTag] =
		cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
		cloneableTags[boolTag] = cloneableTags[dateTag] =
		cloneableTags[float32Tag] = cloneableTags[float64Tag] =
		cloneableTags[int8Tag] = cloneableTags[int16Tag] =
		cloneableTags[int32Tag] = cloneableTags[mapTag] =
		cloneableTags[numberTag] = cloneableTags[objectTag] =
		cloneableTags[regexpTag] = cloneableTags[setTag] =
		cloneableTags[stringTag] = cloneableTags[symbolTag] =
		cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
		cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
		cloneableTags[errorTag] = cloneableTags[funcTag] =
		cloneableTags[weakMapTag] = false;

	/** Used for built-in method references. */
	var arrayProto = Array.prototype,
		funcProto = Function.prototype,
		objectProto = Object.prototype;

	/** Built-in value references. */
	var Buffer = /*moduleExports ? context.Buffer :*/ undefined,
		// Symbol = context.Symbol,
		// Uint8Array = context.Uint8Array,
		// allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,
		getPrototype = overArg(Object.getPrototypeOf, Object),
		objectCreate = Object.create,
		propertyIsEnumerable = objectProto.propertyIsEnumerable,
		splice = arrayProto.splice,
		spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined,
		symIterator = Symbol ? Symbol.iterator : undefined,
		symToStringTag = Symbol ? Symbol.toStringTag : undefined;

	var defineProperty = (function() {
		try {
			var func = getNative(Object, 'defineProperty');
			func({}, '', {});
			return func;
		} catch (e) {}
	}());

	/** Used to detect overreaching core-js shims. */
	var coreJsData = root['__core-js_shared__'];


	/** Built-in method references without a dependency on `root`. */
	var freeParseFloat = parseFloat,
	freeParseInt = parseInt;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
		funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
		.replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);


	/** Used to compose bitmasks for cloning. */
	var CLONE_DEEP_FLAG = 1,
		CLONE_FLAT_FLAG = 2,
		CLONE_SYMBOLS_FLAG = 4;

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1,
		COMPARE_UNORDERED_FLAG = 2;

	/** Used to compose bitmasks for function metadata. */
	var WRAP_BIND_FLAG = 1,
		WRAP_BIND_KEY_FLAG = 2,
		WRAP_CURRY_BOUND_FLAG = 4,
		WRAP_CURRY_FLAG = 8,
		WRAP_CURRY_RIGHT_FLAG = 16,
		WRAP_PARTIAL_FLAG = 32,
		WRAP_PARTIAL_RIGHT_FLAG = 64,
		WRAP_ARY_FLAG = 128,
		WRAP_REARG_FLAG = 256,
		WRAP_FLIP_FLAG = 512;

	/** Used to detect hot functions by number of calls within a span of milliseconds. */
	var HOT_COUNT = 800,
		HOT_SPAN = 16;

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0,
		MAX_SAFE_INTEGER = 9007199254740991,
		MAX_INTEGER = 1.7976931348623157e+308,
		NAN = 0 / 0;

	/** Used as references for the maximum length and index of an array. */
	var MAX_ARRAY_LENGTH = 4294967295,
		MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1,
		HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
		var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
		return uid ? ('Symbol(src)_1.' + uid) : '';
	}());

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeCeil = Math.ceil,
		nativeFloor = Math.floor,
		nativeGetSymbols = Object.getOwnPropertySymbols,
		// nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
		// nativeIsFinite = context.isFinite,
		nativeJoin = arrayProto.join,
		nativeKeys = overArg(Object.keys, Object),
		nativeMax = Math.max,
		nativeMin = Math.min,
		nativeNow = Date.now,
		// nativeParseInt = context.parseInt,
		nativeRandom = Math.random,
		nativeReverse = arrayProto.reverse;

	/* Built-in method references that are verified to be native. */
	var nativeCreate = getNative(Object, 'create');

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
		symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
		symbolToString = symbolProto ? symbolProto.toString : undefined;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString.call(Object);

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
		reHasRegExpChar = RegExp(reRegExpChar.source);

	/** Used to match leading and trailing whitespace. */
	var reTrim = /^\s+|\s+$/g,
		reTrimStart = /^\s+/,
		reTrimEnd = /\s+$/;

	/** Used to match `RegExp` flags from their coerced string values. */
	var reFlags = /\w*$/;

	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;


	/**
	 * The base implementation of `setToString` without support for hot loop shorting.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var baseSetToString = !defineProperty ? identity : function(func, string) {
		return defineProperty(func, 'toString', {
			'configurable': true,
			'enumerable': false,
			'value': constant(string),
			'writable': true
		});
	};

	/**
	 * Sets the `toString` method of `func` to return `string`.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var setToString = shortOut(baseSetToString);


























	/*------------------------------------------------------------------------*/

	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
		var index = -1,
				length = entries == null ? 0 : entries.length;

		this.size = 0;
		this.__data__ = [];
		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}

	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */
	function listCacheClear() {
		this.__data__ = [];
		this.size = 0;
	}

	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
		var data = this.__data__,
				index = assocIndexOf(data, key);

		if (index < 0) {
			return false;
		}
		var lastIndex = data.length - 1;
		if (index == lastIndex) {
			data.pop();
		} else {
			splice.call(data, index, 1);
		}
		--this.size;
		return true;
	}

	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
		var data = this.__data__,
				index = assocIndexOf(data, key);

		return index < 0 ? undefined : data[index][1];
	}

	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
		return assocIndexOf(this.__data__, key) > -1;
	}

	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
		var data = this.__data__,
				index = assocIndexOf(data, key);

		if (index < 0) {
			++this.size;
			data.push([key, value]);
		} else {
			data[index][1] = value;
		}
		return this;
	}

	// Add methods to `ListCache`.
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype['delete'] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;

	/*------------------------------------------------------------------------*/


	class Stack {
		/**
		 * Creates a stack cache object to store key-value pairs.
		 *
		 * @constructor
		 * @param {Array} [entries] The key-value pairs to cache.
		 */
		constructor(entries) {
			this.__data__ = new ListCache(entries);
			this.data = this.__data__;
			this.size = this.data.size;
		}

		/**
		 * Removes all key-value entries from the stack.
		 */
		clear() {
			this.__data__ = new ListCache;
			this.size = 0;
		}

		/**
		 * Removes `key` and its value from the stack.
		 *
		 * @param {string} key The key of the value to remove.
		 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
		 */
		delete(key) {
			var data = this.__data__,
					result = data['delete'](key);

			this.size = data.size;
			return result;
		}

		/**
		 * Gets the stack value for `key`.
		 *
		 * @param {string} key The key of the value to get.
		 * @returns {*} Returns the entry value.
		 */
		get(key) {
			return this.__data__.get(key);
		}

		/**
		 * Checks if a stack value for `key` exists.
		 *
		 * @param {string} key The key of the entry to check.
		 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
		 */
		has(key) {
			return this.__data__.has(key);
		}

		/**
		 * Sets the stack `key` to `value`.
		 *
		 * @param {string} key The key of the value to set.
		 * @param {*} value The value to set.
		 * @returns {Object} Returns the stack cache instance.
		 */
		set(key, value) {
			var data = this.__data__;
			if (data instanceof ListCache) {
				var pairs = data.__data__;
				if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
					pairs.push([key, value]);
					this.size = ++data.size;
					return this;
				}
				// @ts-ignore
				data = this.__data__ = new MapCache(pairs);
			}
			data.set(key, value);
			this.size = data.size;
			return this;
		}
	}

	/*------------------------------------------------------------------------*/

	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
		var index = -1,
				length = entries == null ? 0 : entries.length;

		this.size = 0;
		this.__data__ = {};
		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}

	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
		this.size = 0;
		this.__data__ = {
			'hash': new Hash,
			'map': new (Map || ListCache),
			'string': new Hash
		};
	}

	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete(key) {
		var result = getMapData(this, key)['delete'](key);
		this.size -= result ? 1 : 0;
		return result;
	}

	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet(key) {
		return getMapData(this, key).get(key);
	}

	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas(key) {
		return getMapData(this, key).has(key);
	}

	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet(key, value) {
		var data = getMapData(this, key),
				size = data.size;

		data.set(key, value);
		this.size += data.size == size ? 0 : 1;
		return this;
	}

	// Add methods to `MapCache`.
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype['delete'] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;

	/*------------------------------------------------------------------------*/

	/**
	 *
	 * Creates an array cache object to store unique values.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [values] The values to cache.
	 */
	function SetCache(values) {
		var index = -1,
				length = values == null ? 0 : values.length;

		this.__data__ = new MapCache;
		while (++index < length) {
			this.add(values[index]);
		}
	}

	/**
	 * Adds `value` to the array cache.
	 *
	 * @private
	 * @name add
	 * @memberOf SetCache
	 * @alias push
	 * @param {*} value The value to cache.
	 * @returns {Object} Returns the cache instance.
	 */
	function setCacheAdd(value) {
		this.__data__.set(value, HASH_UNDEFINED);
		return this;
	}

	/**
	 * Checks if `value` is in the array cache.
	 *
	 * @private
	 * @name has
	 * @memberOf SetCache
	 * @param {*} value The value to search for.
	 * @returns {number} Returns `true` if `value` is found, else `false`.
	 */
	function setCacheHas(value) {
		return this.__data__.has(value);
	}

	// Add methods to `SetCache`.
	SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
	SetCache.prototype.has = setCacheHas;

	/*------------------------------------------------------------------------*/

	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
		var index = -1,
				length = entries == null ? 0 : entries.length;

		this.clear();
		while (++index < length) {
			var entry = entries[index];
			this.set(entry[0], entry[1]);
		}
	}

	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
		this.__data__ = nativeCreate ? nativeCreate(null) : {};
		this.size = 0;
	}

	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function hashDelete(key) {
		var result = this.has(key) && delete this.__data__[key];
		this.size -= result ? 1 : 0;
		return result;
	}

	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(key) {
		var data = this.__data__;
		if (nativeCreate) {
			var result = data[key];
			return result === HASH_UNDEFINED ? undefined : result;
		}
		return hasOwnProperty.call(data, key) ? data[key] : undefined;
	}

	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(key) {
		var data = this.__data__;
		return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
	}

	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet(key, value) {
		var data = this.__data__;
		this.size += this.has(key) ? 0 : 1;
		data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
		return this;
	}

	// Add methods to `Hash`.
	Hash.prototype.clear = hashClear;
	Hash.prototype['delete'] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;

	/*------------------------------------------------------------------------*/













	/**
	 * A faster alternative to `Function#apply`, this function invokes `func`
	 * with the `this` binding of `thisArg` and the arguments of `args`.
	 *
	 * @private
	 * @param {Function} func The function to invoke.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {Array} args The arguments to invoke `func` with.
	 * @returns {*} Returns the result of `func`.
	 */
	function apply(func, thisArg, args) {
		switch (args.length) {
			case 0: return func.call(thisArg);
			case 1: return func.call(thisArg, args[0]);
			case 2: return func.call(thisArg, args[0], args[1]);
			case 3: return func.call(thisArg, args[0], args[1], args[2]);
		}
		return func.apply(thisArg, args);
	}

	/**
	 * A specialized version of `_.forEach` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns `array`.
	 */
	function arrayEach(array, iteratee) {
		var index = -1,
				length = array == null ? 0 : array.length;

		while (++index < length) {
			if (iteratee(array[index], index, array) === false) {
				break;
			}
		}
		return array;
	}

	/**
	 * A specialized version of `_.forEachRight` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns `array`.
	 */
	function arrayEachRight(array, iteratee) {
		var length = array == null ? 0 : array.length;

		while (length--) {
			if (iteratee(array[length], length, array) === false) {
				break;
			}
		}
		return array;
	}

	/**
	 * A specialized version of `_.every` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {boolean} Returns `true` if all elements pass the predicate check,
	 *  else `false`.
	 */
	function arrayEvery(array, predicate) {
		var index = -1,
				length = array == null ? 0 : array.length;

		while (++index < length) {
			if (!predicate(array[index], index, array)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * A specialized version of `_.filter` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {Array} Returns the new filtered array.
	 */
	function arrayFilter(array, predicate) {
		var index = -1,
				length = array == null ? 0 : array.length,
				resIndex = 0,
				result = [];

		while (++index < length) {
			var value = array[index];
			if (predicate(value, index, array)) {
				result[resIndex++] = value;
			}
		}
		return result;
	}

	/**
	 * A specialized version of `_.includes` for arrays without support for
	 * specifying an index to search from.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @returns {boolean} Returns `true` if `target` is found, else `false`.
	 */
	function arrayIncludes(array, value) {
		var length = array == null ? 0 : array.length;
		return !!length && baseIndexOf(array, value, 0) > -1;
	}

	/**
	 * This function is like `arrayIncludes` except that it accepts a comparator.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {Function} comparator The comparator invoked per element.
	 * @returns {boolean} Returns `true` if `target` is found, else `false`.
	 */
	function arrayIncludesWith(array, value, comparator) {
		var index = -1,
				length = array == null ? 0 : array.length;

		while (++index < length) {
			if (comparator(value, array[index])) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Creates an array of the enumerable property names of the array-like `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @param {boolean=} inherited Specify returning inherited property names.
	 * @returns {Array} Returns the array of property names.
	 */
	function arrayLikeKeys(value, inherited) {
		var isArr = isArray(value),
				isArg = false, //!isArr && isArguments(value),
				isBuff = false, //!isArr && !isArg && isBuffer(value),
				isType = false, //!isArr && !isArg && !isBuff && isTypedArray(value),
				skipIndexes = isArr || isArg || isBuff || isType,
				result = skipIndexes ? baseTimes(value.length, String) : [],
				length = result.length;

		for (var key in value) {
			if ((inherited || hasOwnProperty.call(value, key)) &&
					!(skipIndexes && (
							// Safari 9 has enumerable `arguments.length` in strict mode.
							key == 'length' ||
							// Node.js 0.10 has enumerable non-index properties on buffers.
							(isBuff && (key == 'offset' || key == 'parent')) ||
							// PhantomJS 2 has enumerable non-index properties on typed arrays.
							(isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
							// Skip index properties.
							isIndex(key, length)
					))) {
				result.push(key);
			}
		}
		return result;
	}

	/**
	 * A specialized version of `_.map` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function arrayMap(array, iteratee) {
		var index = -1,
				length = array == null ? 0 : array.length,
				result = Array(length);

		while (++index < length) {
			result[index] = iteratee(array[index], index, array);
		}
		return result;
	}

	/**
	 * Appends the elements of `values` to `array`.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to append.
	 * @returns {Array} Returns `array`.
	 */
	function arrayPush(array, values) {
		var index = -1,
			length = values.length,
			offset = array.length;

		while (++index < length) {
		array[offset + index] = values[index];
		}
		return array;
	}

	/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignValue(object, key, value) {
		var objValue = object[key];
		if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
				(value === undefined && !(key in object))) {
			baseAssignValue(object, key, value);
		}
	}

	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
		function assocIndexOf(array, key) {
		var length = array.length;
		while (length--) {
			if (eq(array[length][0], key)) {
				return length;
			}
		}
		return -1;
	}

	/**
	 * The base implementation of `_.assign` without support for multiple sources
	 * or `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */
		function baseAssign(object, source) {
		return object && copyObject(source, keys(source), object);
	}

	/**
	 * The base implementation of `_.assignIn` without support for multiple sources
	 * or `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */
	function baseAssignIn(object, source) {
		return object && copyObject(source, keysIn(source), object);
	}

	/**
	 * The base implementation of `assignValue` and `assignMergeValue` without
	 * value checks.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function baseAssignValue(object, key, value) {
		if (key == '__proto__' && defineProperty) {
			defineProperty(object, key, {
				'configurable': true,
				'enumerable': true,
				'value': value,
				'writable': true
			});
		} else {
			object[key] = value;
		}
	}

	/**
	 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
	 * traversed objects.
	 *
	 * @private
	 * @param {*} value The value to clone.
	 * @param {number} bitmask The bitmask flags.
	 *  1 - Deep clone
	 *  2 - Flatten inherited properties
	 *  4 - Clone symbols
	 * @param {Function=} customizer The function to customize cloning.
	 * @param {string} [key] The key of `value`.
	 * @param {Object} [object] The parent object of `value`.
	 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
	 * @returns {*} Returns the cloned value.
	 */
	function baseClone(value, bitmask, customizer, key, object, stack) {
		var result,
			isDeep = !!(bitmask & CLONE_DEEP_FLAG),
			isFlat = !!(bitmask & CLONE_FLAT_FLAG),
			isFull = !!(bitmask & CLONE_SYMBOLS_FLAG);

		if (customizer) {
			result = object ? customizer(value, key, object, stack) : customizer(value);
		}
		if (result !== undefined) {
			return result;
		}
		if (!isObject(value)) {
			return value;
		}
		var isArr = isArray(value);
		if (isArr) {
			result = initCloneArray(value);
			if (!isDeep) {
				return copyArray(value, result);
			}
		} else {
			var tag = getTag(value),
				isFunc = tag == funcTag || tag == genTag;

			// if (isBuffer(value)) {
			//   return cloneBuffer(value, isDeep);
			// }
			if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
				result = (isFlat || isFunc) ? {} : initCloneObject(value);
				if (!isDeep) {
					return isFlat
						? copySymbolsIn(value, baseAssignIn(result, value))
						: copySymbols(value, baseAssign(result, value));
				}
			} else {
				if (!cloneableTags[tag]) {
					return object ? value : {};
				}
				result = initCloneByTag(value, tag, isDeep);
			}
		}
		// Check for circular references and return its corresponding clone.
		stack || (stack = new Stack);
		var stacked = stack.get(value);
		if (stacked) {
			return stacked;
		}
		stack.set(value, result);

		if (isSet(value)) {
			value.forEach(function(subValue) {
				result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
			});
		} else if (isMap(value)) {
			value.forEach(function(subValue, key) {
				result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
			});
		}

		var keysFunc = isFull
			? (isFlat ? getAllKeysIn : getAllKeys)
			: (isFlat ? keysIn : keys);

		var props = isArr ? undefined : keysFunc(value);
		arrayEach(props || value, function(subValue, key) {
			if (props) {
				key = subValue;
				subValue = value[key];
			}
			// Recursively populate clone (susceptible to call stack limits).
			assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
		});
		return result;
	}

	/**
	 * The base implementation of `_.create` without support for assigning
	 * properties to the created object.
	 *
	 * @private
	 * @param {Object} proto The object to inherit from.
	 * @returns {Object} Returns the new object.
	 */
	var baseCreate = (function() {
		function object() {}
		return function(proto) {
			if (!isObject(proto)) {
				return {};
			}
			if (objectCreate) {
				return objectCreate(proto);
			}
			object.prototype = proto;
			var result = new object;
			object.prototype = undefined;
			return result;
		};
	}());

	/**
	 * The base implementation of `_.range` and `_.rangeRight` which doesn't
	 * coerce arguments.
	 *
	 * @private
	 * @param {number} start The start of the range.
	 * @param {number} end The end of the range.
	 * @param {number} step The value to increment or decrement by.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Array} Returns the range of numbers.
	 */
	function baseRange(start, end, step, fromRight) {
		var index = -1,
				length = nativeMax(nativeCeil((end - start) / (step || 1)), 0),
				result = Array(length);

		while (length--) {
			result[fromRight ? length : ++index] = start;
			start += step;
		}
		return result;
	}

	/**
	 * Attempts to invoke `func`, returning either the result or the caught error
	 * object. Any additional arguments are provided to `func` when it's invoked.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Util
	 * @param {Function} func The function to attempt.
	 * @param {...*} [args] The arguments to invoke `func` with.
	 * @returns {*} Returns the `func` result or error object.
	 * @example
	 *
	 * // Avoid throwing errors for invalid selectors.
	 * var elements = _.attempt(function(selector) {
	 *   return document.querySelectorAll(selector);
	 * }, '>_>');
	 *
	 * if (_.isError(elements)) {
	 *   elements = [];
	 * }
	 */
	var attempt = baseRest(function(func, args) {
		try {
			return apply(func, undefined, args);
		} catch (e) {
			return isError(e) ? e : new Error(e);
		}
	});


	/**
	 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
	 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
	 * symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @param {Function} symbolsFunc The function to get the symbols of `object`.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function baseGetAllKeys(object, keysFunc, symbolsFunc) {
		var result = keysFunc(object);
		return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
	}

	/**
	 * The base implementation of methods like `_.findKey` and `_.findLastKey`,
	 * without support for iteratee shorthands, which iterates over `collection`
	 * using `eachFunc`.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to inspect.
	 * @param {Function} predicate The function invoked per iteration.
	 * @param {Function} eachFunc The function to iterate over `collection`.
	 * @returns {*} Returns the found element or its key, else `undefined`.
	 */
	function baseFindKey(collection, predicate, eachFunc) {
		var result;
		eachFunc(collection, function(value, key, collection) {
			if (predicate(value, key, collection)) {
				result = key;
				return false;
			}
		});
		return result;
	}

	/**
	 * The base implementation of `_.flatten` with support for restricting flattening.
	 *
	 * @private
	 * @param {Array} array The array to flatten.
	 * @param {number} depth The maximum recursion depth.
	 * @param {Function} [predicate=isFlattenable] The function invoked per iteration.
	 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
	 * @param {Array} [result=[]] The initial result value.
	 * @returns {Array} Returns the new flattened array.
	 */
	function baseFlatten(array, depth, predicate, isStrict, result) {
		var index = -1,
				length = array.length;

		predicate || (predicate = isFlattenable);
		result || (result = []);

		while (++index < length) {
			var value = array[index];
			if (depth > 0 && predicate(value)) {
				if (depth > 1) {
					// Recursively flatten arrays (susceptible to call stack limits).
					baseFlatten(value, depth - 1, predicate, isStrict, result);
				} else {
					result.push(...value);  // real lodash uses arrayPush :/
				}
			} else if (!isStrict) {
				result[result.length] = value;
			}
		}
		return result;
	}

	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
		if (value == null) {
			return value === undefined ? undefinedTag : nullTag;
		}
		return (symToStringTag && symToStringTag in Object(value))
			? getRawTag(value)
			: objectToString(value);
	}

	/**
	 * The base implementation of `_.findIndex` and `_.findLastIndex` without
	 * support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Function} predicate The function invoked per iteration.
	 * @param {number} fromIndex The index to search from.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseFindIndex(array, predicate, fromIndex, fromRight) {
		var length = array.length,
				index = fromIndex + (fromRight ? 1 : -1);

		while ((fromRight ? index-- : ++index < length)) {
			if (predicate(array[index], index, array)) {
				return index;
			}
		}
		return -1;
	}

	/**
	 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseIndexOf(array, value, fromIndex) {
		return value === value
			? strictIndexOf(array, value, fromIndex)
			: baseFindIndex(array, baseIsNaN, fromIndex);
	}

	/**
	 * The base implementation of `_.isArguments`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 */
	function baseIsArguments(value) {
		return isObjectLike(value) && baseGetTag(value) == argsTag;
	}

	/**
	 * This function is like `baseIndexOf` except that it accepts a comparator.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @param {Function} comparator The comparator invoked per element.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseIndexOfWith(array, value, fromIndex, comparator) {
		var index = fromIndex - 1,
				length = array.length;

		while (++index < length) {
			if (comparator(array[index], value)) {
				return index;
			}
		}
		return -1;
	}

	/**
	 * The base implementation of `_.isNaN` without support for number objects.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
	 */
	function baseIsNaN(value) {
		return value !== value;
	}

	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
		if (!isObject(value) || isMasked(value)) {
			return false;
		}
		var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
		return pattern.test(toSource(value));
	}

	/**
	 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys(object) {
		if (!isPrototype(object)) {
			return nativeKeys(object);
		}
		var result = [];
		for (var key in Object(object)) {
			if (hasOwnProperty.call(object, key) && key != 'constructor') {
				result.push(key);
			}
		}
		return result;
	}

	/**
	 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeysIn(object) {
		if (!isObject(object)) {
			return nativeKeysIn(object);
		}
		var isProto = isPrototype(object),
				result = [];

		for (var key in object) {
			if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
				result.push(key);
			}
		}
		return result;
	}

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */
	function baseProperty(key) {
		return function(object) {
			return object == null ? undefined : object[key];
		};
	}

	/**
	 * The base implementation of `_.pullAllBy` without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to remove.
	 * @param {Function} [iteratee] The iteratee invoked per element.
	 * @param {Function} [comparator] The comparator invoked per element.
	 * @returns {Array} Returns `array`.
	 */
	function basePullAll(array, values, iteratee, comparator) {
		var indexOf = comparator ? baseIndexOfWith : baseIndexOf,
				index = -1,
				length = values.length,
				seen = array;

		if (array === values) {
			values = copyArray(values);
		}
		if (iteratee) {
			seen = arrayMap(array, baseUnary(iteratee));
		}
		while (++index < length) {
			var fromIndex = 0,
					value = values[index],
					computed = iteratee ? iteratee(value) : value;

			while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
				if (seen !== array) {
					splice.call(seen, fromIndex, 1);
				}
				splice.call(array, fromIndex, 1);
			}
		}
		return array;
	}

	/**
	 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 */
	function baseRest(func, start) {
		return setToString(overRest(func, start, identity), func + '');
	}

	/**
	 * The base implementation of `_.slice` without an iteratee call guard.
	 *
	 * @private
	 * @param {Array} array The array to slice.
	 * @param {number} [start=0] The start position.
	 * @param {number} [end=array.length] The end position.
	 * @returns {Array} Returns the slice of `array`.
	 */
	function baseSlice(array, start, end) {
		var index = -1,
				length = array.length;

		if (start < 0) {
			start = -start > length ? 0 : (length + start);
		}
		end = end > length ? length : end;
		if (end < 0) {
			end += length;
		}
		length = start > end ? 0 : ((end - start) >>> 0);
		start >>>= 0;

		var result = Array(length);
		while (++index < length) {
			result[index] = array[index + start];
		}
		return result;
	}

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
		var index = -1,
				result = Array(n);

		while (++index < n) {
			result[index] = iteratee(index);
		}
		return result;
	}

	/**
	 * The base implementation of `_.unary` without support for storing metadata.
	 *
	 * @private
	 * @param {Function} func The function to cap arguments for.
	 * @returns {Function} Returns the new capped function.
	 */
	function baseUnary(func) {
		return function(value) {
			return func(value);
		};
	}

	/**
	 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Function} [iteratee] The iteratee invoked per element.
	 * @param {Function} [comparator] The comparator invoked per element.
	 * @returns {Array} Returns the new duplicate free array.
	 */
	function baseUniq(array, iteratee, comparator) {
		var index = -1,
				length = array.length,
				isCommon = true,
				result = [];
		let includes;
		includes = arrayIncludes;
		let seen;
		seen = result;

		if (comparator) {
			isCommon = false;
			includes = arrayIncludesWith;
		}
		else if (length >= LARGE_ARRAY_SIZE) {
			var set = iteratee ? null : createSet(array);
			if (set) {
				return setToArray(set);
			}
			isCommon = false;
			includes = cacheHas;
			seen = new SetCache;
		}
		else {
			seen = iteratee ? [] : result;
		}
		outer:
		while (++index < length) {
			var value = array[index],
					computed = iteratee ? iteratee(value) : value;

			value = (comparator || value !== 0) ? value : 0;
			if (isCommon && computed === computed) {
				// @ts-ignore
				var seenIndex = seen.length;
				while (seenIndex--) {
					if (seen[seenIndex] === computed) {
						continue outer;
					}
				}
				if (iteratee) {
					seen.push(computed);
				}
				result.push(value);
			}
			// @ts-ignore
			else if (!includes(seen, computed, comparator)) {
				if (seen !== result) {
					seen.push(computed);
				}
				result.push(value);
			}
		}
		return result;
	}

	/**
	 * Creates a function that invokes `func`, with the `this` binding and arguments
	 * of the created function, while it's called less than `n` times. Subsequent
	 * calls to the created function return the result of the last `func` invocation.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Function
	 * @param {number} n The number of calls at which `func` is no longer invoked.
	 * @param {Function} func The function to restrict.
	 * @returns {Function} Returns the new restricted function.
	 * @example
	 *
	 * jQuery(element).on('click', _.before(5, addContactToList));
	 * // => Allows adding up to 4 contacts to the list.
	 */
	function before(n, func) {
		var result;
		if (typeof func != 'function') {
			throw new TypeError(FUNC_ERROR_TEXT);
		}
		n = toInteger(n);
		return function() {
			if (--n > 0) {
				result = func.apply(this, arguments);
			}
			if (n <= 1) {
				func = undefined;
			}
			return result;
		};
	}

	/**
	 * Checks if a `cache` value for `key` exists.
	 *
	 * @private
	 * @param {Object} cache The cache to query.
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function cacheHas(cache, key) {
		return cache.has(key);
	}

	/**
	 * Creates a function that returns `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {*} value The value to return from the new function.
	 * @returns {Function} Returns the new constant function.
	 * @example
	 *
	 * var objects = _.times(2, _.constant({ 'a': 1 }));
	 *
	 * console.log(objects);
	 * // => [{ 'a': 1 }, { 'a': 1 }]
	 *
	 * console.log(objects[0] === objects[1]);
	 * // => true
	 */
	function constant(value) {
		return function() {
			return value;
		};
	}

	/**
	 * Creates a shallow clone of `value`.
	 *
	 * **Note:** This method is loosely based on the
	 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
	 * and supports cloning arrays, array buffers, booleans, date objects, maps,
	 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
	 * arrays. The own enumerable properties of `arguments` objects are cloned
	 * as plain objects. An empty object is returned for uncloneable values such
	 * as error objects, functions, DOM nodes, and WeakMaps.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to clone.
	 * @returns {*} Returns the cloned value.
	 * @see _.cloneDeep
	 * @example
	 *
	 * var objects = [{ 'a': 1 }, { 'b': 2 }];
	 *
	 * var shallow = _.clone(objects);
	 * console.log(shallow[0] === objects[0]);
	 * // => true
	 */
	function clone(value) {
		return baseClone(value, CLONE_SYMBOLS_FLAG);
	}

	/**
	 * Creates a clone of `arrayBuffer`.
	 *
	 * @private
	 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
	 * @returns {ArrayBuffer} Returns the cloned array buffer.
	 */
	function cloneArrayBuffer(arrayBuffer) {
		var result = new ArrayBuffer(arrayBuffer.byteLength);
		new Uint8Array(result).set(new Uint8Array(arrayBuffer));
		return result;
	}

	/**
	 * Creates a clone of `dataView`.
	 *
	 * @private
	 * @param {Object} dataView The data view to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned data view.
	 */
	function cloneDataView(dataView, isDeep) {
		var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
		return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
	}

	/**
	 * Creates a clone of `regexp`.
	 *
	 * @private
	 * @param {Object} regexp The regexp to clone.
	 * @returns {Object} Returns the cloned regexp.
	 */
	function cloneRegExp(regexp) {
		var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
		result.lastIndex = regexp.lastIndex;
		return result;
	}

	/**
	 * Creates a clone of the `symbol` object.
	 *
	 * @private
	 * @param {Object} symbol The symbol object to clone.
	 * @returns {Object} Returns the cloned symbol object.
	 */
	function cloneSymbol(symbol) {
		return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
	}

	/**
	 * This method is like `_.clone` except that it recursively clones `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 1.0.0
	 * @category Lang
	 * @param {*} value The value to recursively clone.
	 * @returns {*} Returns the deep cloned value.
	 * @see _.clone
	 * @example
	 *
	 * var objects = [{ 'a': 1 }, { 'b': 2 }];
	 *
	 * var deep = _.cloneDeep(objects);
	 * console.log(deep[0] === objects[0]);
	 * // => false
	 */
	function cloneDeep(value) {
		return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
	}

	/**
	 * Copies the values of `source` to `array`.
	 *
	 * @private
	 * @param {Array} source The array to copy values from.
	 * @param {Array} [array=[]] The array to copy values to.
	 * @returns {Array} Returns `array`.
	 */
	function copyArray(source, array) {
		var index = -1,
				length = source.length;

		array || (array = Array(length));
		while (++index < length) {
			array[index] = source[index];
		}
		return array;
	}

	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property identifiers to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Function} [customizer] The function to customize copied values.
	 * @returns {Object} Returns `object`.
	 */
	function copyObject(source, props, object, customizer) {
		var isNew = !object;
		object || (object = {});

		var index = -1,
				length = props.length;

		while (++index < length) {
			var key = props[index];

			var newValue = customizer
				? customizer(object[key], source[key], key, object, source)
				: undefined;

			if (newValue === undefined) {
				newValue = source[key];
			}
			if (isNew) {
				baseAssignValue(object, key, newValue);
			} else {
				assignValue(object, key, newValue);
			}
		}
		return object;
	}

	/**
	 * Copies own symbols of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy symbols from.
	 * @param {Object} [object={}] The object to copy symbols to.
	 * @returns {Object} Returns `object`.
	 */
	function copySymbols(source, object) {
		return copyObject(source, getSymbols(source), object);
	}

	/**
	 * Copies own and inherited symbols of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy symbols from.
	 * @param {Object} [object={}] The object to copy symbols to.
	 * @returns {Object} Returns `object`.
	 */
	function copySymbolsIn(source, object) {
		return copyObject(source, getSymbolsIn(source), object);
	}

	/**
	 * Creates a `_.range` or `_.rangeRight` function.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new range function.
	 */
	function createRange(fromRight) {
		return function(start, end, step) {
			if (step && typeof step != 'number' /*&& isIterateeCall(start, end, step)*/) {
				end = step = undefined;
			}
			// Ensure the sign of `-0` is preserved.
			start = toFinite(start);
			if (end === undefined) {
				end = start;
				start = 0;
			} else {
				end = toFinite(end);
			}
			step = step === undefined ? (start < end ? 1 : -1) : toFinite(step);
			return baseRange(start, end, step, fromRight);
		};
	}

	/**
	 * Creates a set object of `values`.
	 *
	 * @private
	 * @param {Array} values The values to add to the set.
	 * @returns {Object} Returns the new set.
	 */
	var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
		return new Set(values);
	};

	/**
	 * Creates a debounced function that delays invoking `func` until after `wait`
	 * milliseconds have elapsed since the last time the debounced function was
	 * invoked. The debounced function comes with a `cancel` method to cancel
	 * delayed `func` invocations and a `flush` method to immediately invoke them.
	 * Provide `options` to indicate whether `func` should be invoked on the
	 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
	 * with the last arguments provided to the debounced function. Subsequent
	 * calls to the debounced function return the result of the last `func`
	 * invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is
	 * invoked on the trailing edge of the timeout only if the debounced function
	 * is invoked more than once during the `wait` timeout.
	 *
	 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
	 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
	 *
	 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	 * for details over the differences between `_.debounce` and `_.throttle`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to debounce.
	 * @param {number} [wait=0] The number of milliseconds to delay.
	 * @param {Object} [options={}] The options object.
	 * @param {boolean} [options.leading=false]
	 *  Specify invoking on the leading edge of the timeout.
	 * @param {number} [options.maxWait]
	 *  The maximum time `func` is allowed to be delayed before it's invoked.
	 * @param {boolean} [options.trailing=true]
	 *  Specify invoking on the trailing edge of the timeout.
	 * @returns {Function} Returns the new debounced function.
	 * @example
	 *
	 * // Avoid costly calculations while the window size is in flux.
	 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	 *
	 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
	 * jQuery(element).on('click', _.debounce(sendMail, 300, {
	 *   'leading': true,
	 *   'trailing': false
	 * }));
	 *
	 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
	 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
	 * var source = new EventSource('/stream');
	 * jQuery(source).on('message', debounced);
	 *
	 * // Cancel the trailing debounced invocation.
	 * jQuery(window).on('popstate', debounced.cancel);
	 */
	function debounce(func, wait, options) {
		var lastArgs,
				lastThis,
				maxWait,
				result,
				timerId,
				lastCallTime,
				lastInvokeTime = 0,
				leading = false,
				maxing = false,
				trailing = true;

		if (typeof func != 'function') {
			throw new TypeError(FUNC_ERROR_TEXT);
		}
		wait = toNumber(wait) || 0;
		if (isObject(options)) {
			leading = !!options.leading;
			maxing = 'maxWait' in options;
			maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
			trailing = 'trailing' in options ? !!options.trailing : trailing;
		}

		function invokeFunc(time) {
			var args = lastArgs,
					thisArg = lastThis;

			lastArgs = lastThis = undefined;
			lastInvokeTime = time;
			result = func.apply(thisArg, args);
			return result;
		}

		function leadingEdge(time) {
			// Reset any `maxWait` timer.
			lastInvokeTime = time;
			// Start the timer for the trailing edge.
			timerId = setTimeout(timerExpired, wait);
			// Invoke the leading edge.
			return leading ? invokeFunc(time) : result;
		}

		function remainingWait(time) {
			var timeSinceLastCall = time - lastCallTime,
					timeSinceLastInvoke = time - lastInvokeTime,
					timeWaiting = wait - timeSinceLastCall;

			return maxing
				? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
				: timeWaiting;
		}

		function shouldInvoke(time) {
			var timeSinceLastCall = time - lastCallTime,
					timeSinceLastInvoke = time - lastInvokeTime;

			// Either this is the first call, activity has stopped and we're at the
			// trailing edge, the system time has gone backwards and we're treating
			// it as the trailing edge, or we've hit the `maxWait` limit.
			return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
				(timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
		}

		function timerExpired() {
			var time = Date.now();
			if (shouldInvoke(time)) {
				return trailingEdge(time);
			}
			// Restart the timer.
			timerId = setTimeout(timerExpired, remainingWait(time));
		}

		function trailingEdge(time) {
			timerId = undefined;

			// Only invoke if we have `lastArgs` which means `func` has been
			// debounced at least once.
			if (trailing && lastArgs) {
				return invokeFunc(time);
			}
			lastArgs = lastThis = undefined;
			return result;
		}

		function cancel() {
			if (timerId !== undefined) {
				clearTimeout(timerId);
			}
			lastInvokeTime = 0;
			lastArgs = lastCallTime = lastThis = timerId = undefined;
		}

		function flush() {
			return timerId === undefined ? result : trailingEdge(Date.now());
		}

		function debounced() {
			var time = Date.now(),
					isInvoking = shouldInvoke(time);

			lastArgs = arguments;
			lastThis = this;
			lastCallTime = time;

			if (isInvoking) {
				if (timerId === undefined) {
					return leadingEdge(lastCallTime);
				}
				if (maxing) {
					// Handle invocations in a tight loop.
					clearTimeout(timerId);
					timerId = setTimeout(timerExpired, wait);
					return invokeFunc(lastCallTime);
				}
			}
			if (timerId === undefined) {
				timerId = setTimeout(timerExpired, wait);
			}
			return result;
		}
		debounced.cancel = cancel;
		debounced.flush = flush;
		return debounced;
	}


	/**
	 * Creates an array of `array` values not included in the other given arrays
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons. The order and references of result values are
	 * determined by the first array.
	 *
	 * **Note:** Unlike `_.pullAll`, this method returns a new array.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Array
	 * @param {Array} array The array to inspect.
	 * @param {Array} values The values to exclude.
	 * @returns {Array} Returns the new array of filtered values.
	 * @see _.without, _.xor
	 * @example
	 *
	 * _.difference([2, 1], [2, 3]);
	 * // => [1]
	 */
	function difference(array, values) {
		const diff = [];
		for (let i = 0; i < array.length; i++) {
			if (!values.includes(array[i])) {
				diff.push(array[i]);
			}
		}
		return diff;
	}

	/**
	 * Creates a slice of `array` with `n` elements dropped from the beginning.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.5.0
	 * @category Array
	 * @param {Array} array The array to query.
	 * @param {number} [n=1] The number of elements to drop.
	 * @param {Object} [guard] Enables use as an iteratee for methods like `_.map`.
	 * @returns {Array} Returns the slice of `array`.
	 * @example
	 *
	 * _.drop([1, 2, 3]);
	 * // => [2, 3]
	 *
	 * _.drop([1, 2, 3], 2);
	 * // => [3]
	 *
	 * _.drop([1, 2, 3], 5);
	 * // => []
	 *
	 * _.drop([1, 2, 3], 0);
	 * // => [1, 2, 3]
	 */
	function drop(array, n, guard) {
		var length = array == null ? 0 : array.length;
		if (!length) {
			return [];
		}
		n = (guard || n === undefined) ? 1 : toInteger(n);
		return baseSlice(array, n < 0 ? 0 : n, length);
	}

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
		return value === other || (value !== value && other !== other);
	}

	/**
	 * This method is like `_.find` except that it returns the key of the first
	 * element `predicate` returns truthy for instead of the element itself.
	 *
	 * @static
	 * @memberOf _
	 * @since 1.1.0
	 * @category Object
	 * @param {Object} object The object to inspect.
	 * @param {Function} [predicate=_.identity] The function invoked per iteration.
	 * @returns {string|undefined} Returns the key of the matched element,
	 *  else `undefined`.
	 * @example
	 *
	 * var users = {
	 *   'barney':  { 'age': 36, 'active': true },
	 *   'fred':    { 'age': 40, 'active': false },
	 *   'pebbles': { 'age': 1,  'active': true }
	 * };
	 *
	 * _.findKey(users, function(o) { return o.age < 40; });
	 * // => 'barney' (iteration order is not guaranteed)
	 *
	 * // The `_.matches` iteratee shorthand.
	 * _.findKey(users, { 'age': 1, 'active': true });
	 * // => 'pebbles'
	 *
	 * // The `_.matchesProperty` iteratee shorthand.
	 * _.findKey(users, ['active', false]);
	 * // => 'fred'
	 *
	 * // The `_.property` iteratee shorthand.
	 * _.findKey(users, 'active');
	 * // => 'barney'
	 */
	function findKey(object, predicate) {
		const keys = Object.keys(object);
		for (let idx in keys) {
			const key = keys[idx];
			if (predicate(object[key]))
				return key;
		}
	}

	/**
	 * Creates an array of own enumerable property names and symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function getAllKeys(object) {
		return baseGetAllKeys(object, keys, getSymbols);
	}

	/**
	 * Creates an array of own and inherited enumerable property names and
	 * symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function getAllKeysIn(object) {
		return baseGetAllKeys(object, keysIn, getSymbolsIn);
	}

	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData(map, key) {
		var data = map.__data__;
		return isKeyable(key)
			? data[typeof key == 'string' ? 'string' : 'hash']
			: data.map;
	}

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
		var value = getValue(object, key);
		return baseIsNative(value) ? value : undefined;
	}

	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
		var isOwn = hasOwnProperty.call(value, symToStringTag),
				tag = value[symToStringTag];

		try {
			value[symToStringTag] = undefined;
			var unmasked = true;
		} catch (e) {}

		var result = nativeObjectToString.call(value);
		if (unmasked) {
			if (isOwn) {
				value[symToStringTag] = tag;
			} else {
				delete value[symToStringTag];
			}
		}
		return result;
	}

	/**
	 * Creates an array of the own enumerable symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
		if (object == null) {
			return [];
		}
		object = Object(object);
		return arrayFilter(nativeGetSymbols(object), function(symbol) {
			return propertyIsEnumerable.call(object, symbol);
		});
	};

	/**
	 * Creates an array of the own and inherited enumerable symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
		var result = [];
		while (object) {
			result.push(...getSymbols(object));
			object = getPrototype(object);
		}
		return result;
	};

	/**
	 * Gets the `toStringTag` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	var getTag = baseGetTag;

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function getValue(object, key) {
		return object == null ? undefined : object[key];
	}

	/**
	 * This method returns the first argument it receives.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 *
	 * console.log(_.identity(object) === object);
	 * // => true
	 */
		function identity(value) {
		return value;
	}

	/**
	 * Initializes an array clone.
	 *
	 * @private
	 * @param {Array} array The array to clone.
	 * @returns {Array} Returns the initialized clone.
	 */
	function initCloneArray(array) {
		var length = array.length,
				result = new Array(length);

		// Add properties assigned by `RegExp#exec`.
		// if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
		//   result.index = array.index;
		//   result.input = array.input;
		// }
		return result;
	}

	/**
	 * Initializes an object clone.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneObject(object) {
		return (typeof object.constructor == 'function' && !isPrototype(object))
			? baseCreate(getPrototype(object))
			: {};
	}

	/**
	 * Initializes an object clone based on its `toStringTag`.
	 *
	 * **Note:** This function only supports cloning values with tags of
	 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @param {string} tag The `toStringTag` of the object to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneByTag(object, tag, isDeep) {
		var Ctor = object.constructor;
		switch (tag) {
			case arrayBufferTag:
				return cloneArrayBuffer(object);

			case boolTag:
			case dateTag:
				return new Ctor(+object);

			case dataViewTag:
				return cloneDataView(object, isDeep);

			// case float32Tag: case float64Tag:
			// case int8Tag: case int16Tag: case int32Tag:
			// case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
			//   return cloneTypedArray(object, isDeep);

			case mapTag:
				return new Ctor;

			case numberTag:
			case stringTag:
				return new Ctor(object);

			case regexpTag:
				return cloneRegExp(object);

			case setTag:
				return new Ctor;

			case symbolTag:
				return cloneSymbol(object);
		}
	}

	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
		return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
			!propertyIsEnumerable.call(value, 'callee');
	};

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
		function isArrayLike(value) {
			return value != null && isLength(value.length) && !isFunction(value);
		}

	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
		return isObjectLike(value) && isArrayLike(value);
	}

	/**
	 * Checks if `value` is an empty object, collection, map, or set.
	 *
	 * Objects are considered empty if they have no own enumerable string keyed
	 * properties.
	 *
	 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
	 * jQuery-like collections are considered empty if they have a `length` of `0`.
	 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
	 * @example
	 *
	 * _.isEmpty(null);
	 * // => true
	 *
	 * _.isEmpty(true);
	 * // => true
	 *
	 * _.isEmpty(1);
	 * // => true
	 *
	 * _.isEmpty([1, 2, 3]);
	 * // => false
	 *
	 * _.isEmpty({ 'a': 1 });
	 * // => false
	 */
	function isEmpty(value) {
		if (value == null) {
			return true;
		}
		if (isArrayLike(value) &&
				(isArray(value) || typeof value == 'string' || typeof value.splice == 'function' ||
					false/*isTypedArray(value) || isArguments(value)*/)) {
			return !value.length;
		}
		var tag = getTag(value);
		if (tag == mapTag || tag == setTag) {
			return !value.size;
		}
		if (isPrototype(value)) {
			return !baseKeys(value).length;
		}
		for (var key in value) {
			if (hasOwnProperty.call(value, key)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
	 * `SyntaxError`, `TypeError`, or `URIError` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
	 * @example
	 *
	 * _.isError(new Error);
	 * // => true
	 *
	 * _.isError(Error);
	 * // => false
	 */
	function isError(value) {
		if (!isObjectLike(value)) {
			return false;
		}
		var tag = baseGetTag(value);
		return tag == errorTag || tag == domExcTag ||
			(typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value));
	}

	/**
	 * Checks if `value` is a flattenable `arguments` object or array.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
	 */
	function isFlattenable(value) {
		return isArray(value) || isArguments(value) ||
			!!(spreadableSymbol && value && value[spreadableSymbol]);
	}

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
		if (!isObject(value)) {
			return false;
		}
		// The use of `Object#toString` avoids issues with the `typeof` operator
		// in Safari 9 which returns 'object' for typed arrays and other constructors.
		var tag = baseGetTag(value);
		return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
		var type = typeof value;
		length = length == null ? MAX_SAFE_INTEGER : length;

		return !!length &&
			(type == 'number' ||
				(type != 'symbol' && reIsUint.test(value))) &&
					(value > -1 && value % 1 == 0 && value < length);
	}

	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */
	function isKeyable(value) {
		var type = typeof value;
		return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
			? (value !== '__proto__')
			: (value === null);
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
		return typeof value == 'number' &&
			value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	/**
	 * The base implementation of `_.isMap` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
	 */
		function isMap(value) {
		return isObjectLike(value) && getTag(value) == mapTag;
	}

	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
		return !!maskSrcKey && (maskSrcKey in func);
	}

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
		var type = typeof value;
		return value != null && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
		return value != null && typeof value == 'object';
	}
	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
		var Ctor = value && value.constructor,
				proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

		return value === proto;
	}

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
		function isPlainObject(value) {
		if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
			return false;
		}
		var proto = getPrototype(value);
		if (proto === null) {
			return true;
		}
		var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
		return typeof Ctor == 'function' && Ctor instanceof Ctor &&
			funcToString.call(Ctor) == objectCtorString;
	}

	/**
	 * The base implementation of `_.isSet` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
	 */
	function isSet(value) {
		return isObjectLike(value) && getTag(value) == setTag;
	}

	/**
	 * Checks if `value` is classified as a `String` primitive or object.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
	 * @example
	 *
	 * _.isString('abc');
	 * // => true
	 *
	 * _.isString(1);
	 * // => false
	 */
	function isString(value) {
		return typeof value == 'string' ||
			(!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag);
	}

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
		return typeof value == 'symbol' ||
			(isObjectLike(value) && baseGetTag(value) == symbolTag);
	}

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	function keys(object) {
		return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
	}

	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
		return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
	}

	/**
	 * Gets the last element of `array`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Array
	 * @param {Array} array The array to query.
	 * @returns {*} Returns the last element of `array`.
	 * @example
	 *
	 * _.last([1, 2, 3]);
	 * // => 3
	 */
	function last(array) {
		var length = array == null ? 0 : array.length;
		return length ? array[length - 1] : undefined;
	}

	/**
	 * This function is like
	 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * except that it includes inherited enumerable properties.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function nativeKeysIn(object) {
		var result = [];
		if (object != null) {
			for (var key in Object(object)) {
				result.push(key);
			}
		}
		return result;
	}

	/**
	 * This method returns `undefined`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.3.0
	 * @category Util
	 * @example
	 *
	 * _.times(2, _.noop);
	 * // => [undefined, undefined]
	 */
	function noop() {
		// No operation performed.
	}

	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
		// return nativeObjectToString.call(value);
		return Object.prototype.toString.call(value);
	}

	/**
	 * Creates a function that is restricted to invoking `func` once. Repeat calls
	 * to the function return the value of the first invocation. The `func` is
	 * invoked with the `this` binding and arguments of the created function.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to restrict.
	 * @returns {Function} Returns the new restricted function.
	 * @example
	 *
	 * var initialize = _.once(createApplication);
	 * initialize();
	 * initialize();
	 * // => `createApplication` is invoked once
	 */
	function once(func) {
		return before(2, func);
	}

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
		return function(arg) {
			return func(transform(arg));
		};
	}

	/**
	 * A specialized version of `baseRest` which transforms the rest array.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} start The start position of the rest parameter. Defaults to func.length-1
	 * @param {Function} transform The rest array transform.
	 * @returns {Function} Returns the new function.
	 */
	function overRest(func, start, transform) {
		start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
		return function() {
			var args = arguments,
					index = -1,
					length = nativeMax(args.length - start, 0),
					array = Array(length);

			while (++index < length) {
				array[index] = args[start + index];
			}
			index = -1;
			var otherArgs = Array(start + 1);
			while (++index < start) {
				otherArgs[index] = args[index];
			}
			otherArgs[start] = transform(array);
			return apply(func, this, otherArgs);
		};
	}

	/**
	 * This method is like `_.pull` except that it accepts an array of values to remove.
	 *
	 * **Note:** Unlike `_.difference`, this method mutates `array`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Array
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to remove.
	 * @returns {Array} Returns `array`.
	 * @example
	 *
	 * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
	 *
	 * _.pullAll(array, ['a', 'c']);
	 * console.log(array);
	 * // => ['b', 'b']
	 */
	function pullAll(array, values) {
		return (array && array.length && values && values.length)
			? basePullAll(array, values)
			: array;
	}

	/**
	 * Creates an array of numbers (positive and/or negative) progressing from
	 * `start` up to, but not including, `end`. A step of `-1` is used if a negative
	 * `start` is specified without an `end` or `step`. If `end` is not specified,
	 * it's set to `start` with `start` then set to `0`.
	 *
	 * **Note:** JavaScript follows the IEEE-754 standard for resolving
	 * floating-point values which can produce unexpected results.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {number} [start=0] The start of the range.
	 * @param {number} end The end of the range.
	 * @param {number} [step=1] The value to increment or decrement by.
	 * @returns {Array} Returns the range of numbers.
	 * @see _.inRange, _.rangeRight
	 * @example
	 *
	 * _.range(4);
	 * // => [0, 1, 2, 3]
	 *
	 * _.range(-4);
	 * // => [0, -1, -2, -3]
	 *
	 * _.range(1, 5);
	 * // => [1, 2, 3, 4]
	 *
	 * _.range(0, 20, 5);
	 * // => [0, 5, 10, 15]
	 *
	 * _.range(0, -4, -1);
	 * // => [0, -1, -2, -3]
	 *
	 * _.range(1, 4, 0);
	 * // => [1, 1, 1]
	 *
	 * _.range(0);
	 * // => []
	 */
	var range = createRange();

	/**
	 * Converts `set` to an array of its values.
	 *
	 * @private
	 * @param {Object} set The set to convert.
	 * @returns {Array} Returns the values.
	 */
	function setToArray(set) {
		var index = -1,
				result = Array(set.size);

		set.forEach(function(value) {
			result[++index] = value;
		});
		return result;
	}

	/**
	 * Creates a function that'll short out and invoke `identity` instead
	 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
	 * milliseconds.
	 *
	 * @private
	 * @param {Function} func The function to restrict.
	 * @returns {Function} Returns the new shortable function.
	 */
	function shortOut(func) {
		var count = 0,
				lastCalled = 0;

		return function() {
			var stamp = nativeNow(),
					remaining = HOT_SPAN - (stamp - lastCalled);

			lastCalled = stamp;
			if (remaining > 0) {
				if (++count >= HOT_COUNT) {
					return arguments[0];
				}
			} else {
				count = 0;
			}
			return func.apply(undefined, arguments);
		};
	}

	/**
	 * Checks if `string` starts with the given target string.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category String
	 * @param {string} [string=''] The string to inspect.
	 * @param {string} [target] The string to search for.
	 * @param {number} [position=0] The position to search from.
	 * @returns {boolean} Returns `true` if `string` starts with `target`,
	 *  else `false`.
	 * @example
	 *
	 * _.startsWith('abc', 'a');
	 * // => true
	 *
	 * _.startsWith('abc', 'b');
	 * // => false
	 *
	 * _.startsWith('abc', 'b', 1);
	 * // => true
	 */
	function startsWith(string, target, position) {
		position = position == null
			? 0
			: Math.min(Math.max(position, 0), string.length);

		// target = baseToString(target);
		return string.slice(position, position + target.length) == target;
	}

	/**
	 * A specialized version of `_.indexOf` which performs strict equality
	 * comparisons of values, i.e. `===`.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function strictIndexOf(array, value, fromIndex) {
		var index = fromIndex - 1,
				length = array.length;

		while (++index < length) {
			if (array[index] === value) {
				return index;
			}
		}
		return -1;
	}

	/**
	 * This method returns a new empty array.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {Array} Returns the new empty array.
	 * @example
	 *
	 * var arrays = _.times(2, _.stubArray);
	 *
	 * console.log(arrays);
	 * // => [[], []]
	 *
	 * console.log(arrays[0] === arrays[1]);
	 * // => false
	 */
	function stubArray() {
		return [];
	}

	/**
	 * Creates a throttled function that only invokes `func` at most once per
	 * every `wait` milliseconds. The throttled function comes with a `cancel`
	 * method to cancel delayed `func` invocations and a `flush` method to
	 * immediately invoke them. Provide `options` to indicate whether `func`
	 * should be invoked on the leading and/or trailing edge of the `wait`
	 * timeout. The `func` is invoked with the last arguments provided to the
	 * throttled function. Subsequent calls to the throttled function return the
	 * result of the last `func` invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is
	 * invoked on the trailing edge of the timeout only if the throttled function
	 * is invoked more than once during the `wait` timeout.
	 *
	 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
	 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
	 *
	 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	 * for details over the differences between `_.throttle` and `_.debounce`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to throttle.
	 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
	 * @param {Object} [options={}] The options object.
	 * @param {boolean} [options.leading=true]
	 *  Specify invoking on the leading edge of the timeout.
	 * @param {boolean} [options.trailing=true]
	 *  Specify invoking on the trailing edge of the timeout.
	 * @returns {Function} Returns the new throttled function.
	 * @example
	 *
	 * // Avoid excessively updating the position while scrolling.
	 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
	 *
	 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
	 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
	 * jQuery(element).on('click', throttled);
	 *
	 * // Cancel the trailing throttled invocation.
	 * jQuery(window).on('popstate', throttled.cancel);
	 */
	function throttle(func, wait, options) {
		var leading = true,
				trailing = true;

		if (typeof func != 'function') {
			throw new TypeError(FUNC_ERROR_TEXT);
		}
		if (isObject(options)) {
			leading = 'leading' in options ? !!options.leading : leading;
			trailing = 'trailing' in options ? !!options.trailing : trailing;
		}
		return debounce(func, wait, {
			'leading': leading,
			'maxWait': wait,
			'trailing': trailing
		});
	}

	/**
	 * Converts `value` to a finite number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.12.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted number.
	 * @example
	 *
	 * _.toFinite(3.2);
	 * // => 3.2
	 *
	 * _.toFinite(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toFinite(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toFinite('3.2');
	 * // => 3.2
	 */
	function toFinite(value) {
		if (!value) {
			return value === 0 ? value : 0;
		}
		value = toNumber(value);
		if (value === INFINITY || value === -INFINITY) {
			var sign = (value < 0 ? -1 : 1);
			return sign * MAX_INTEGER;
		}
		return value === value ? value : 0;
	}

	/**
	 * Converts `value` to an integer.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted integer.
	 * @example
	 *
	 * _.toInteger(3.2);
	 * // => 3
	 *
	 * _.toInteger(Number.MIN_VALUE);
	 * // => 0
	 *
	 * _.toInteger(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toInteger('3.2');
	 * // => 3
	 */
	function toInteger(value) {
		var result = toFinite(value),
				remainder = result % 1;

		return result === result ? (remainder ? result - remainder : result) : 0;
	}

	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */
	function toNumber(value) {
		if (typeof value == 'number') {
			return value;
		}
		if (isSymbol(value)) {
			return NAN;
		}
		if (isObject(value)) {
			var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
			value = isObject(other) ? (other + '') : other;
		}
		if (typeof value != 'string') {
			return value === 0 ? value : +value;
		}
		value = value.replace(reTrim, '');
		var isBinary = reIsBinary.test(value);
		return (isBinary || reIsOctal.test(value))
			? freeParseInt(value.slice(2), isBinary ? 2 : 8)
			: (reIsBadHex.test(value) ? NAN : +value);
	}

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to convert.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
		if (func != null) {
			try {
				return funcToString.call(func);
			} catch (e) {}
			try {
				return (func + '');
			} catch (e) {}
		}
		return '';
	}

	/**
	 * Creates an array of unique values, in order, from all given arrays using
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Array
	 * @param {...Array} [arrays] The arrays to inspect.
	 * @returns {Array} Returns the new array of combined values.
	 * @example
	 *
	 * _.union([2], [1, 2]);
	 * // => [2, 1]
	 */
	var union = baseRest(function(arrays) {
		return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
	});

	/**
	 * This method is like `_.zip` except that it accepts an array of grouped
	 * elements and creates an array regrouping the elements to their pre-zip
	 * configuration.
	 *
	 * @static
	 * @memberOf _
	 * @since 1.2.0
	 * @category Array
	 * @param {Array} array The array of grouped elements to process.
	 * @returns {Array} Returns the new array of regrouped elements.
	 * @example
	 *
	 * var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
	 * // => [['a', 1, true], ['b', 2, false]]
	 *
	 * _.unzip(zipped);
	 * // => [['a', 'b'], [1, 2], [true, false]]
	 */
	function unzip(array) {
		if (!(array && array.length)) {
			return [];
		}
		var length = 0;
		array = arrayFilter(array, function(group) {
			if (isArrayLikeObject(group)) {
				length = nativeMax(group.length, length);
				return true;
			}
		});
		return baseTimes(length, function(index) {
			return arrayMap(array, baseProperty(index));
		});
	}

	/**
	 * Creates an array of grouped elements, the first of which contains the
	 * first elements of the given arrays, the second of which contains the
	 * second elements of the given arrays, and so on.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Array
	 * @param {...Array} [arrays] The arrays to process.
	 * @returns {Array} Returns the new array of grouped elements.
	 * @example
	 *
	 * _.zip(['a', 'b'], [1, 2], [true, false]);
	 * // => [['a', 1, true], ['b', 2, false]]
	 */
	var zip = baseRest(unzip);

	return {
		attempt,
		before,
		debounce,
		clone,
		cloneDeep,
		difference,
		drop,
		findKey,
		isArray,
		isError,
		isEmpty,
		isObject,
		isString,
		last,
		once,
		pullAll,
		range,
		startsWith,
		throttle,
		union,
		zip
	}
})();



/** @type {any} */
const _ = {};
_.attempt = _exports.attempt;
_.before = _exports.before;
_.debounce = _exports.debounce;
_.clone = _exports.clone;
_.cloneDeep = _exports.cloneDeep;
_.difference = _exports.difference;
_.drop = _exports.drop;
_.findKey = _exports.findKey;
_.isArray = _exports.isArray;
_.isError = _exports.isError;
_.isEmpty = _exports.isEmpty;
_.isObject = _exports.isObject;
_.isString = _exports.isString;
_.last = _exports.last;
_.once = _exports.once;
_.pullAll = _exports.pullAll;
_.range = _exports.range;
_.startsWith = _exports.startsWith;
_.throttle = _exports.throttle;
_.union = _exports.union;
_.zip = _exports.zip;

/**
 *
 * @param {string} command The command for the OS to execute. Typically a webpage, or a path to an executable.
 * @param {boolean=} wait waits?
 * @param {boolean=} show probably whether to show the command?
 * @returns {boolean} Returns true if the command was successfully executed
 */
_.runCmd = function (command, wait, show) {
	try {
		WshShell.Run(command, show ? 1 : 0, wait ? wait : false);
		return true;
	} catch (e) {
		return false;
	}
};
_.scale = function (size) {
	return Math.round(size * DPI / 72);
};
/**
 *
 * @param {number} volume value between 0 and 1 where 1 is full volume
 * @returns {number} a decibel value between -100 and 0, to pass to fb.Volume. 0 is max volume, -100 is min.
 */
_.toDb = function (volume) {
	return 50 * Math.log(0.99 * volume + 0.01) / Math.LN10;
};

///////////////////////////// Georgia-ReBORN functions for LAYOUT MODE SWITCHER ///////////////////////////

_.artistFolder = function (artist) {
	var a = _.fbSanitise(artist);
	var folder = folders.artists + a;
	if (_.isFolder(folder)) {
		return fso.GetFolder(folder) + '\\';
	}
	else {
		folder = folders.artists + _.truncate(a, {
			'length': 64
		});
		_.createFolder(folder);
		return fso.GetFolder(folder) + '\\';
	}
};

_.createFolder = function (folder) {
	if (!_.isFolder(folder)) {
		fso.CreateFolder(folder);
	}
};

_.deleteFile = function (file) {
	if (_.isFile(file)) {
		try {
			fso.DeleteFile(file);
		} catch (e) {
		}
	}
};

_.isFile = function (file) {
	return _.isString(file) ? fso.FileExists(file) : false;
};

_.isFolder = function (folder) {
	return _.isString(folder) ? fso.FolderExists(folder) : false;
};

_.hacks = function () {
	this.disable = function () {
		this.uih.MainMenuState = this.MainMenuState.Show;
		this.uih.FrameStyle = this.FrameStyle.Default;
		this.uih.StatusBarState = true;
	};

	this.enable = function () {
		this.uih.MainMenuState = this.MainMenuState.Hide;
		this.uih.FrameStyle = this.FrameStyle.NoBorder;
		this.uih.StatusBarState = false;
	};

	this.set_caption = function (x, y, w, h) {
		this.uih.SetPseudoCaption(x, y, w, h);
	};

	this.MainMenuState = {
		Show: 0,
		Hide: 1,
		Auto: 2
	};
	this.FrameStyle = {
		Default:      0,
		SmallCaption: 1,
		NoCaption:    2,
		NoBorder:     3
	};
	this.MoveStyle = {
		Default: 0,
		Middle:  1,
		Left:    2,
		Both:    3
	};

	this.uih = new ActiveXObject('UIHacks');
	this.uih.MoveStyle = this.MoveStyle.Default;
	this.uih.DisableSizing = false;
	this.uih.BlockMaximize = false;
	this.uih.MinSize = false;
	this.uih.MaxSize = false;
};
