class ArtCache {
    /**
     * Create ArtCache. ArtCache is a Least-Recently Used cache meaning that each cache hit
     * will bump that image to be the last image to be removed from the cache (if maxCacheSize is exceeded).
     * @param {number} maxCacheSize maximum number of images to keep in the cache.
     */
    constructor(maxCacheSize) {
        /** @private @type {Object.<string, GdiBitmap>} */
        this.cache = {};
        /** @private @type {string[]} */
        this.cacheIndexes = [];
        /** @private */ this.cacheMaxSize = maxCacheSize;
        /** @private */ this.imgMaxWidth = scaleForDisplay(1440);   // these are the maximum width and height an image can be displayed in Georgia
        /** @private */ this.imgMaxHeight = scaleForDisplay(872);
    }

    /**
     * Adds a rescaled image to the cache under string `location` and returns the cached image.
     * @param {GdiBitmap} img
     * @param {string} location String value to cache image under. Does not need to be a path.
     * @return {GdiBitmap}
     */
    encache(img, location) {
        try {
            let h = img.Height;
            let w = img.Width;
            if (w > this.imgMaxWidth || h > this.imgMaxHeight) {
                let scaleFactor = w / this.imgMaxWidth;
                if (scaleFactor < h / this.imgMaxHeight) {
                    scaleFactor = h / this.imgMaxHeight;
                }
                h = Math.min(h / scaleFactor);
                w = Math.min(w / scaleFactor);
            }
            this.cache[location] = img.Resize(w, h);
            img = null;
            const pathIndex = this.cacheIndexes.indexOf(location);
            if (pathIndex !== -1) {
                // remove from middle of cache and put on end
                this.cacheIndexes.splice(pathIndex, 1);
            }
            this.cacheIndexes.push(location);
            if (this.cacheIndexes.length > this.cacheMaxSize) {
                const remove = this.cacheIndexes.shift();
                debugLog('Removing img from cache:', remove);
                delete this.cache[remove];
            }
        } catch (e) {
            console.log('<Error: Image could not be properly parsed: ' + location + '>');
        }
        return this.cache[location] || img;
    }

    /**
     * Get cached image if it exists under the location string. If image is found, move it's index to the end of the cacheIndexes.
     * @param {string} location String value to check if image is cached under.
     * @return {GdiBitmap}
     */
    getImage(location) {
        if (this.cache[location]) {
            debugLog('cache hit:', location);
            const pathIndex = this.cacheIndexes.indexOf(location);
            this.cacheIndexes.splice(pathIndex, 1);
            this.cacheIndexes.push(location);
            return this.cache[location];
        }
        return null;
    }

    /**
     * Completely clear all cached entries and release memory held by scaled bitmaps.
     */
    clear() {
        while (this.cacheIndexes.length) {
            const remove = this.cacheIndexes.shift();
            this.cache[remove] = null;
            delete this.cache[remove];
        }
    }
}
