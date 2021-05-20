function ArtCache(maxCacheSize) {
    const art_cache_max_size = maxCacheSize;
    const art_cache = {};
    /** @type {string[]} */
    const art_cache_indexes = [];
    const max_width = 1440;
    const max_height = 872;

    /**
     * Adds a rescaled image to the cache under string `location` and returns the cached image.
     * @param {GdiBitmap} img
     * @param {string} location
     * @return {GdiBitmap}
     */
    this.encache = function(img, location) {
        try {
            var h = img.Height;
            var w = img.Width;
            var max_w = scaleForDisplay(max_width);
            var max_h = scaleForDisplay(max_height);
            if (w > max_w || h > max_h) {
                var scale_factor = w / max_w;
                if (scale_factor < h / max_h) {
                    scale_factor = h / max_h;
                }
                h = Math.min(h / scale_factor);
                w = Math.min(w / scale_factor);
            }
            art_cache[location] = img.Resize(w, h);
            img = null;
            var pathIdx = art_cache_indexes.indexOf(location);
            if (pathIdx !== -1) {
                // remove from middle of cache and put on end
                art_cache_indexes.splice(pathIdx, 1);
            }
            art_cache_indexes.push(location);
            if (art_cache_indexes.length > art_cache_max_size) {
                const remove = art_cache_indexes.shift();
                debugLog('deleting cached img:', remove);
                delete art_cache[remove];
            }
        } catch (e) {
            console.log('<Error: Image could not be properly parsed: ' + location + '>');
        }
        return art_cache[location] || img;
    }

    /**
     * Get image at the cached location
     * @param {string} location
     * @return {GdiBitmap}
     */
    this.getImage = function(location) {
        if (art_cache[location]) {
            debugLog('cache hit:', location);
            return art_cache[location];
        }
        return null;
    }

    this.clear = function() {
        while (art_cache_indexes.length) {
            var remove = art_cache_indexes.shift();
            art_cache[remove] = null;
            delete art_cache[remove];
        }
    }
}
