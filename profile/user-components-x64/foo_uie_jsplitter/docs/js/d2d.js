/**
 * @constructor
 * @param {D2DBitmap} arg
 */
function D2DBitmap(arg) {

    /**
     * @type {number}
     * @readonly
     */
    this.Height = undefined;// (uint) (read)

    /**
     * @type {number}
     * @readonly
     */
    this.Width = undefined;// (uint) (read)

    /**
     * @param {number} alpha Valid values 0-255.
     * @return {D2DBitmap}
     */
    this.ApplyAlpha = function (alpha) { }; // (D2DBitmap)

    /**
     * Apllies alpha for entire image. Unlike {@link D2DBitmap#ApplyAlpha} changes the current object
     * @param {number} alpha Valid values 0-255.
     */
    this.ApplyAlphaIndirect = function (alpha) { }; // (void)

    /**
     * Changes will be saved in the current bitmap.
     *
     * @param {D2DBitmap} img
     *
     * @sourceFile ../../component/samples/basic/ApplyMask.js
     */
    this.ApplyMask = function (img) { }; // (void)

    /**
     * Create partial copy of image represented by D2DBitmap object
     * 
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @return {D2DBitmap}
     */
    this.Clone = function (x, y, w, h) { }; // (D2DBitmap)

    /**
     * Create clone bitmap from D2DBitmap object
     *
     * @return {D2DBitmap}
     */
    this.CreateRawBitmap = function () { }; // (D2DBitmap)

    /**
     * Takes the top of colors found in the image
     * @param {number} max_count
     * @return {Array<number>}
     */
    this.GetColourScheme = function (max_count) { }; // (Array)

    /**
     * Returns a JSON array in string form so you need to use JSON.parse() on the result.<br>
     * Each entry in the array is an object which contains colour and frequency values.<br>
     * Uses a different method for calculating colours than {@link D2DBitmap#GetColourScheme GetColourScheme}.<br>
     * Image is automatically resized during processing for performance reasons so there's no
     * need to resize before calling the method.
     *
     * @param {number} max_count
     * @return {string}
     *
     * @example
     * // See docs\Helpers.js for "toRGB" function.
     * img = ... // use utils.GetAlbumArtV2 / d2d.Image / etc
     * colours = JSON.parse(img.GetColourSchemeJSON(5));
     * console.log(colours[0].col); // -4194304
     * console.log(colours[0].freq); // 0.34
     * console.log(toRGB(colours[0].col)); // [192, 0, 0]
     */
    this.GetColourSchemeJSON = function (max_count) { }; // (string)

    /**
     * Returns a JSON array in string form so you need to use JSON.parse() on the result.<br>
     * Each entry in the array is an object which contains colour and frequency values.<br>
     * Uses a different method than {@link D2DBitmap#GetColourSchemeJSON GetColourSchemeJSON} for calculating colours (K-means++ with Oklab).<br>
     *
     * @param {number} max_count
     * @param {number} [min_chroma=0.0] minimal chroma value for choosing start cluster pixel
     * @return {string}
     */
    this.GetColourSchemeJSONV2 = function (max_count) { }; // (string)

    /**
     * <b>IMPORTANT</b>: You MUST call {@link D2DBitmap#ReleaseGraphics ReleaseGraphics} after work on D2DGraphics is done!<br>
     * It is illegal to call any methods of D2DBitmap object while working with the obtained D2DGraphics object until {@link D2DBitmap#ReleaseGraphics ReleaseGraphics} is called.
     *
     * @return {D2DGraphics}
     */
    this.GetGraphics = function () { };

    /**
     * Extract raw pixels from bitmap as a byte array in specified pixel format
     *
     * @param {string} [format="bgra32"] Pixel format string (default: "bgra32")
     * Supported formats:<br>
     *   "bgra32"  32bpp BGRA<br>
     *   "rgba32"  32bpp RGBA<br>
     *   "bgr24"   24bpp BGR<br>
     *   "rgb24"   24bpp RGB<br>
     * @returns {Uint8Array} null if was an error (for example, bitmap in unsupported format or unsupported format specified)
     * 
     * @sourceFile ../../component/samples/basic/CreateImageFromPixelData.js
     */
    this.GetPixelData = function(format) { };

    /**
     * Inverts the colours in a bitmap, to create a negative image.
     * i.e. White becomes black, black becomes white, etc.
     * @return {D2DBitmap}
     */
    this.InvertColours = function () { }; // (D2DBitmap)

    /**
     * @param {D2DGraphics} gr
     * @return {number}
     */
    this.ReleaseGraphics = function (gr) { }; // (HRESULT)

    /**
     * @param {number} w
     * @param {number} h
     * @param {number=} [mode=0] See {@link module:Flags.AlbumArtId InterpolationMode}
     * @return {D2DBitmap}
     */
    this.Resize = function (w, h, mode) { }; // (D2DBitmap)

    /**
     * Resizes image. Unlike {@link D2DBitmap#Resize} changes the current object
     * @param {number} w
     * @param {number} h
     * @param {number=} [mode=0] See {@link module:Flags.AlbumArtId InterpolationMode}
     * @param {number=} [sharpness=0.0]
     * @param {number=} [border_hard=false]
     * @param {number=} [cx=0] Scale center point x
     * @param {number=} [cy=0] Scale center point y
     */
    this.ResizeIndirect = function (w, h, mode) { }; // (void)

    /**
     * Changes will be saved in the current bitmap.
     *
     * @param {number} mode See {@link module:Flags.AlbumArtId RotateFlipType}
     */
    this.RotateFlip = function (mode) { }; // (void)

    /**
     * @param {string} path Full path including file extension. The parent folder must already exist.
     * @param {string=} [format='image/png']
     *      "image/png"<br>
     *      "image/bmp"<br>
     *      "image/jpeg"<br>
     *      "image/gif"<br>
     *      "image/tiff"
     * @return {boolean}
     *
     * @example
     * let img = utils.GetAlbumArtEmbedded(fb.GetFocusItem().RawPath, 0);
     * if (img) {
     *     img.SaveAs("D:\\export.jpg", "image/jpeg");
     * }
     */
    this.SaveAs = function (path, format) { }; // (boolean) [, format]

    /**
     * Changes will be saved in the current bitmap.
     *
     * @param {number} radius Valid values 2-254.
     *
     * @example <caption>Blur image<caption>
     * // `samples/basic/StackBlur (image).js`
     *
     * @example <caption>Blur text<caption>
     * // `samples/basic/StackBlur (text).js`
     */
    this.StackBlur = function (radius) { }; // (void)
}

/**
 * Constructor may fail if font is not present.<br>
 *
 * Performance note: try caching and reusing `D2DFont` objects,
 * since the maximum amount of such objects is hard-limited by Windows.
 * `D2DFont` creation will fail after reaching this limit.
 *
 * @constructor
 * @param {string} name
 * @param {number} size_px See {@link module:Helpers.Point2Pixel Point2Pixel} function for conversions
 * @param {number=} [style=0] See {@link module:Flags.FontStyle FontStyle} flags
 */
function D2DFont(name, size_px, style) {
    /**
     * @type {number}
     * @readonly
     *
     * @example
     * console.log(my_font.Height); // 15
     */
    this.Height = undefined;//    (uint)(read)

    /**
     * @type {string}
     * @readonly
     *
     * @example
     * console.log(my_font.Name); // Segoe UI
     */
    this.Name = undefined;//    (string)(read)

    /**
     * @type {float}
     * @readonly
     *
     * @example
     * console.log(my_font.Size); // 12
     */
    this.Size = undefined;//    (float)(read)

    /**
     * See {@link module:Flags.FontStyle FontStyle} flags for value interpretation.
     *
     * @type {number}
     * @readonly
     *
     * @example
     * console.log(my_font.Style);
     */
    this.Style = undefined;//    (uint)(read)
}

/**
 * Creates Direct2D effect.
 * @constructor
 * @param {string} CLSID CLSID of Direct2D effect. See {@link module:Effects Effects} for effects' CLSID.
 */
function D2DEffect(CLSID) {

    /**
     * CLSID of this effect.
     * @type {string}
     * @readonly
     */
    this.CLSID = ""; // (string) (read)

    /**
     * Human-readable name of effect.
     * @type {string}
     * @readonly
     */
    this.Name = ""; // (string) (read)

    /**
     * Description string for this effect.
     * @type {string}
     * @readonly
     */
    this.Description = // (string) (read)

    /**
     * Get/Set input count for effect.
     * @type {number}
     * @readonly
     */
    this.InputCount = // (number) (read, write)

    /**
     * @param {number} index Index of effect input
     * @param {D2DBitmap} bitmap Input image
     * @param {boolean} [invalidate=true] Whether to invalidate the graph at the location of the effect input
    * @example
    * window.DrawMode = 1;
    * 
    * include(`${fb.ComponentPath}\\docs\\Effects.js`);
    * 
    * const img = d2d.Image(`${fb.ComponentPath}\\samples\\d2d\\images\\Flowers.jpg`);
    * 
    * const effect = d2d.Effect(Effects.Sepia.ID);
    * effect.SetInput(0, img);
    * effect.SetValue(Effects.Sepia.Intensity, 0.5);
    * 
    * function on_paint(dgr) {	
    *     dgr.DrawEffect(effect, 10, 10, 0, 0, img.Width, img.Height);
    * }
    */
    this.SetInput = function (index, bitmap, invalidate) { }; // (void)

    /**
     * @param {number} index Index of effect input
     * @param {D2DEffect} effect Input effect
     * @param {boolean} [invalidate=true] Whether to invalidate the graph at the location of the effect input
     * @example
     * window.DrawMode = 1;
     * 
     * include(`${fb.ComponentPath}\\docs\\Effects.js`);
     * 
     * const img = d2d.Image(`${fb.ComponentPath}\\samples\\d2d\\images\\Flowers.jpg`);
     * 
     * const sepia = d2d.Effect(Effects.Sepia.ID);
     * sepia.SetInput(0, img);
     * sepia.SetValue(Effects.Sepia.Intensity, 0.5);
     *
     * const contrast = d2d.Effect(Effects.Contrast.ID);
     * contrast.SetInputEffect(0, sepia);
     * contrast.SetValue(Effects.Contrast.Contrast, 1.0);
     *
     * const scale = d2d.Effect(Effects.Scale.ID);
     * scale.SetInputEffect(0, contrast);
     * scale.SetValue(Effects.Scale.Scale, [0.7, 0.7]);
     * 
     * function on_paint(dgr) {	
     *     dgr.DrawEffect(scale, 10, 10, 0, 0, img.Width, img.Height);
     * }
     */
    this.SetInputEffect = function (index, effect, invalidate) { }; // (void)

    /**
     * @param {number} index Index of effect property. See {@link module:Effects Effects}
     * @return {D2DEffectPropertyType} See {@link module:Effects.D2DEffectPropertyType D2DEffectPropertyType}
     */
    this.GetPropertyType = function (index) { }; // (uint32)

    /**
     * Sets the corresponding property by index.
     * @param {number} index Index of input property. See {@link module:Effects Effects}
     * @param {Object} value Property value of corresponding type. See {@link module:Effects.D2DEffectPropertyType D2DEffectPropertyType}
     */
    this.SetValue = function (index, value) { };

    /**
     * Sets the corresponding property by name.
     * @param {string} name Index of input property. See {@link module:Effects Effects}
     * @param {Object} value Property value of corresponding type. See {@link module:Effects.D2DEffectPropertyType D2DEffectPropertyType}
     */
    this.SetValueByName = function (name, value) { };

    /**
     * Gets effect property value by index.
     * @param {number} index Index of input property. See {@link module:Effects Effects}
     * @return {Object} Property value of corresponding type. See {@link module:Effects.D2DEffectPropertyType D2DEffectPropertyType}
     */
    this.GetValue = function (index) { };    
    
    /**
     * Gets effect property value by name.
     * @param {number} index Index of input property. See {@link module:Effects Effects}
     * @return {Object} Property value of corresponding type. See {@link module:Effects.D2DEffectPropertyType D2DEffectPropertyType}
     */
    this.GetValueByName = function (name) { };
}

/**
 * Object used for drawing as alternative for simple colour.<br>
 * Can also be used to reuse brushes for drawing instead of creating them every time for any primitive drawing operation (if just a color is specified in the Draw/Fill methods, a brush is always created).<br>
 * Created by {@link d2d.Brush}
 * @constructor
 * @param {D2DBrush} arg
 * 
 * @sourceFile ../../component/samples/basic/Brushes.js
 */
function D2DBrush(arg) {

    /**
     * Brush type.<br>
     * See {@link module:Flags.BrushType BrushType}
     * @type {BrushType}
     * @readonly
     */
    this.Type = undefined;// (uint) (read)

    /**
     * Wrap mode responsible for how the brush gradient or image is repeated when drawing<br>
     * See {@link module:Flags.BrushWrapMode BrushWrapMode}
     * @type {BrushWrapMode} 
     * @readonly
     */
    this.WrapMode = undefined;// (uint) (read, write)

    /**
     * Applies translation matrix to the current D2DBrush matrix.<br>
     * For more information see {@link https://learn.microsoft.com/en-us/windows/win32/api/d2d1helper/nf-d2d1helper-matrix3x2f-translation(d2d1_size_f)}
     *
     * @param {number} dx
     * @param {number} dy
     */
    this.Translate = function(dx, dy) {}

    /**
     * Applies rotation matrix to the current D2DBrush matrix.<br>
     * For more information see {@link https://learn.microsoft.com/en-us/windows/win32/api/d2d1helper/nf-d2d1helper-matrix3x2f-rotation}
     *
     * @param {float} angle Angle of rotation in degrees
     * @param {number=} [cx=0] Rotation center point x coord
     * @param {number=} [cy=0] Rotation center point y coord
     */
    this.Rotate = function(angle, cx, cy) {}

    /**
     * Applies scale matrix to the current D2DBrush matrix.<br>
     * For more information see {@link https://learn.microsoft.com/en-us/windows/win32/api/d2d1helper/nf-d2d1helper-matrix3x2f-scale(d2d1_size_f_d2d1_point_2f)}
     *
     * @param {float} sx The x-axis scale factor
     * @param {float=} [sy=0] The y-axis scale factor. If zero sx will be used as sy
     * @param {number=} [cx=0] Scale center point x coord
     * @param {number=} [cy=0] Scale center point y coord
     */
    this.Scale = function(sz, sy, cx, cy) {}
    
    /**
     * Applies skew matrix to the current D2DBrush matrix.<br>
     * For more information see {@link https://learn.microsoft.com/en-us/windows/win32/api/d2d1helper/nf-d2d1helper-matrix3x2f-skew}
     *
     * @param {float} angleX The x-axis skew angle, which is measured in degrees counterclockwise from the y-axis.
     * @param {float} angleY The y-axis skew angle, which is measured in degrees clockwise from the x-axis.
     * @param {number=} [cx=0] Skew center point x coord
     * @param {number=} [cy=0] Skew center point y coord
     */
    this.Skew = function(angleX, angleY, cx, cy) {}

    /**
     * Saves current D2DBrush matrix in internal stack. To restore the matrix use {@link D2DGraphics#PopTransform PopTransform}.
     */
    this.PushTransform = function() {}

    /**
     * Restores D2DBrush matrix from internal stack pushed previously by {@link D2DGraphics#PushTransform PushTransform}.
     */
    this.PopTransform = function() {}

    /**
     * Gets D2DBrush current transformation matrix of 3x2 size (Float32Array(6))<br>
     * Matrix3x2 helper class from the component/docs/Matrix.js will be useful
     * @return {Float32Array}
     * 
     * @sourceFile ../../component/docs/Matrix.js
     */
    this.GetTransform = function() {}

    /**
     * Replaces the current D2DBrush matrix with specified transformation matrix of 3x2 size.<br>
     * Matrix3x2 helper class from the component/docs/Matrix.js will be useful
     * @param {Float32Array} matrix Array that presents 3x2 matrix for transformation (length = 6)
     * 
     * @sourceFile ../../component/docs/Matrix.js
     */
    this.SetTransform = function(matrix) {}

    /**
     * Resets current D2DBrush matrix to original identity matrix.
     */
    this.ResetTransform = function () {}

    /**
     * Applies specified transformation matrix of 3x2 size to the current D2DBrush matrix.<br>
     * Matrix3x2 helper class from the component/docs/Matrix.js will be useful
     * @param {Float32Array} matrix Array that presents 3x2 matrix for transformation (length = 6)
     * 
     * @sourceFile ../../component/docs/Matrix.js
     */
    this.ApplyTransform = function(matrix) {}    
}

/**
 * Typically used inside `on_paint`.<br>
 * Use on_paint(dgr) for D2DGraphics members hints in auto-completion list.<br>
 * Note: there are many different ways to get colours:
 * window.GetColourDUI/window.GetColourCUI,
 * RGB function from Helpers.js, utils.ColourPicker and
 * etc.
 *
 * @constructor
 * @hideconstructor
 */
function D2DGraphics() {
    /**
     * Calculates text height for {@link D2DGraphics#DrawText DrawText}.<br>
     * Note: this will only calculate the text height of one line.
     *
     * @param {string} str
     * @param {D2DFont} font
     * @return {number}
     */
    this.CalcTextHeight = function (str, font) { }; // (uint)

    /**
     * Calculates text width for {@link D2DGraphics#DrawText DrawText}.
     * 
     * Note: When the str contains a kerning pair that is found in the specified 
     * font, the return value will be larger than the actual drawn width of the
     * text. If accurate values are required, set use_exact to true.
     *
     * @param {string} str
     * @param {D2DFont} font
     * @param {boolean=} [use_exact=false] Uses a slower, but more accurate method of calculating text width which accounts for kerning pairs.  
     * @return {number}
     */
    this.CalcTextWidth = function (str, font, use_exact) { }; // (uint)

    /**
     * @param {D2DEffect} img
     * @param {number} dstX
     * @param {number} dstY
     * @param {number} srcX
     * @param {number} srcY
     * @param {number} srcW
     * @param {number} srcH
     * @param {CompositeMode=} [compositionMode=CompositeMode.SourceOver] See {@link module:Flags.CompositeMode CompositeMode}
     */
    this.DrawEffect = function (effect, dstX, dstY, srcX, srcY, srcW, srcH, compositionMode) { };

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {number} line_width
     * @param {*} colour_or_brush colour ARGB or {@link D2DBrush} object
     * @param {DashStyle=} [style=DashStyle.Solid] See {@link module:Flags.DashStyle DashStyle}
     */
    this.DrawEllipse = function (x, y, w, h, line_width, colour_or_brush, style) { }; // (void)

    /**
     * @param {D2DBitmap} img
     * @param {number} dstX
     * @param {number} dstY
     * @param {number} dstW
     * @param {number} dstH
     * @param {number} srcX
     * @param {number} srcY
     * @param {number} srcW
     * @param {number} srcH
     * @param {float=} [angle=0]
     * @param {number=} [alpha=255] Valid values 0-255.
     */
    this.DrawImage = function (img, dstX, dstY, dstW, dstH, srcX, srcY, srcW, srcH, angle, alpha) { }; // (void) [, angle][, alpha]

    /**
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} line_width
     * @param {*} colour_or_brush colour ARGB or {@link D2DBrush} object
     * @param {DashStyle=} [style=DashStyle.Solid] See {@link module:Flags.DashStyle DashStyle}
     * @param {CapStyle=} [startCap=CapStyle.Solid] See {@link module:Flags.CapStyle CapStyle}
     * @param {CapStyle=} [endCap=CapStyle.Solid] See {@link module:Flags.CapStyle CapStyle}
     */
    this.DrawLine = function (x1, y1, x2, y2, line_width, colour_or_brush, style, startCap, endCap) { }; // (void)

    /**
     * @param {*} colour_or_brush colour ARGB or {@link D2DBrush} object
     * @param {number} line_width
     * @param {Array<Array<number>>} points
     * @param {DashStyle=} [style=DashStyle.Solid] See {@link module:Flags.DashStyle DashStyle}
     */
    this.DrawPolygon = function (colour_or_brush, line_width, points, style) { }; // (void)

    /**
     * Should be only used when {@link D2DGraphics#DrawText DrawText} is not applicable.
     *
     * @param {string} str
     * @param {D2DFont} font
     * @param {*} colour_or_brush colour ARGB or {@link D2DBrush} object
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {number=} [flags=0] See {@link module:Flags.StringFormatFlags StringFormatFlags} flags
     */
    this.DrawString = function (str, font, colour_or_brush, x, y, w, h, flags) { }; // (void) [, flags]

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {number} line_width
     * @param {*} colour_or_brush colour ARGB or {@link D2DBrush} object
     * @param {DashStyle=} [style=DashStyle.Solid] See {@link module:Flags.DashStyle DashStyle}
     */
    this.DrawRect = function (x, y, w, h, line_width, colour_or_brush, style) { }; // (void)

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {number} arc_width
     * @param {number} arc_height
     * @param {number} line_width
     * @param {*} colour_or_brush colour ARGB or {@link D2DBrush} object
     * @param {DashStyle=} [style=DashStyle.Solid] See {@link module:Flags.DashStyle DashStyle}
     */
    this.DrawRoundRect = function (x, y, w, h, arc_width, arc_height, line_width, colour_or_brush, style) { }; // (void)

    /**
     * @param {string} str
     * @param {D2DFont} font
     * @param {number} max_width
     * @return {Array<Array>}
     *    index | meaning <br>
     *    [0] text line 1 <br>
     *    [1] width of text line 1 (in pixel) <br>
     *    [2] text line 2 <br>
     *    [3] width of text line 2 (in pixel) <br>
     *    ... <br>
     *    [2n + 2] text line n <br>
     *    [2n + 3] width of text line n (px)
     */
    this.EstimateLineWrap = function (str, font, max_width) { }; // (Array)

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {*} colour_or_brush colour ARGB or {@link D2DBrush} object
     */
    this.FillEllipse = function (x, y, w, h, colour_or_brush) { }; // (void)

    /**
     * Note: this may appear buggy depending on rectangle size. The easiest fix is
     * to adjust the "angle" by a degree or two.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {float} angle
     * @param {number} colour1
     * @param {number} colour2
     * @param {float} [focus=1.0] Specify where the centred colour will be at its highest intensity. Valid values between 0 and 1.
     */
    this.FillGradRect = function (x, y, w, h, angle, colour1, colour2, focus) { }; // (void) [, focus]

    /**
     * Fills rect with gradient in arbitrary quantity of stops.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {float} angle
     * @param {Array} stops Specifies gradient stops in form of [pos0, argb0, ..., posN, argbN]
     * @example
     * dgr.FillGradRectV2(10, 10, 200, 100, 0, [0.0, 0xFF0000FF, 0.5, 0xFFFF0000, 1.0, 0xFF000000]);
     */
    this.FillGradRectV2 = function (x, y, w, h, angle, stops) { };

    /**
     * @param {*} colour_or_brush colour ARGB or {@link D2DBrush} object
     * @param {number} fillmode 0 alternate, 1 winding.
     * @param {Array<Array<number>>} points
     */
    this.FillPolygon = function (colour_or_brush, fillmode, points) { }; // (void)

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {number} arc_width
     * @param {number} arc_height
     * @param {*} colour_or_brush colour ARGB or {@link D2DBrush} object
     */
    this.FillRoundRect = function (x, y, w, h, arc_width, arc_height, colour_or_brush) { }; // (void)

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {*} colour_or_brush colour ARGB or {@link D2DBrush} object
     */
    this.FillSolidRect = function (x, y, w, h, colour_or_brush) { }; // (void)

    /**
     * @param {D2DBitmap} img
     * @param {number} dstX
     * @param {number} dstY
     * @param {number} dstW
     * @param {number} dstH
     * @param {number} srcX
     * @param {number} srcY
     * @param {number} srcW
     * @param {number} srcH
     * @param {number=} [alpha=255] Valid values 0-255.
     */
    this.AlphaBlend = function (img, dstX, dstY, dstW, dstH, srcX, srcY, srcW, srcH, alpha) { }; // (void) [, alpha]

    /**
     * Provides faster and better rendering than {@link D2DGraphics#DrawString DrawString}.<br>
     * <br>
     * Do not use this to draw text on transparent background or
     * with D2DGraphics other than the one passed in {@link module:Callbacks.on_paint on_paint} callback:
     * this will result in visual artifacts caused by ClearType hinting.<br>
     * Use {@link D2DGraphics#DrawString DrawString} instead in such cases.<br>
     * <br>
     * To calculate text dimensions use {@link D2DGraphics#CalcTextHeight CalcTextHeight}, {@link D2DGraphics#CalcTextWidth CalcTextWidth}.<br>
     * <br>
     * Note: uses special rules for `&` character by default, which consumes the `&` and causes the next character to be underscored.
     * This behaviour can be changed (or disabled) via `format` parameter.
     *
     * @param {string} str
     * @param {D2DFont} font
     * @param {*} colour_or_brush colour ARGB or {@link D2DBrush} object
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {number=} [format=0] See flags like {@link module:Flags.DT_LEFT DT_LEFT}
     */
    this.DrawText = function (str, font, colour_or_brush, x, y, w, h, format) { };

    /**
     * Draws stroked text in clipped rectangle. Flags for formatting text are not supported.
     * @param {string} str
     * @param {D2DFont} font
     * @param {number} strokeColor
     * @param {number} strokeWidth
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     */
    this.DrawStrokedText = function (str, font, strokeColor, strokeWidth, fillColor, x, y, w, h) { };

    /**
     * Calculates text dimensions for {@link D2DGraphics#DrawString DrawString}.
     *
     * @param {string} str
     * @param {D2DFont} font
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {number=} [flags=0] See {@link module:Flags.StringFormatFlags StringFormatFlags} flags
     * @return {MeasureStringInfo}
     */
    this.MeasureString = function (str, font, x, y, w, h, flags) { }; // (MeasureStringInfo) [, flags]

    /**
     * Applies translation matrix to the current D2DGraphics matrix.<br>
     * For more information see {@link https://learn.microsoft.com/en-us/windows/win32/api/d2d1helper/nf-d2d1helper-matrix3x2f-translation(d2d1_size_f)}
     *
     * @param {number} dx
     * @param {number} dy
     */
    this.Translate = function(dx, dy) {}

    /**
     * Applies rotation matrix to the current D2DGraphics matrix.<br>
     * For more information see {@link https://learn.microsoft.com/en-us/windows/win32/api/d2d1helper/nf-d2d1helper-matrix3x2f-rotation}
     *
     * @param {float} angle Angle of rotation in degrees
     * @param {number=} [cx=0] Rotation center point x coord
     * @param {number=} [cy=0] Rotation center point y coord
     */
    this.Rotate = function(angle, cx, cy) {}

    /**
     * Applies scale matrix to the current D2DGraphics matrix.<br>
     * For more information see {@link https://learn.microsoft.com/en-us/windows/win32/api/d2d1helper/nf-d2d1helper-matrix3x2f-scale(d2d1_size_f_d2d1_point_2f)}
     *
     * @param {float} sx The x-axis scale factor
     * @param {float=} [sy=0] The y-axis scale factor. If zero sx will be used as sy
     * @param {number=} [cx=0] Scale center point x coord
     * @param {number=} [cy=0] Scale center point y coord
     */
    this.Scale = function(sz, sy, cx, cy) {}
    
    /**
     * Applies skew matrix to the current D2DGraphics matrix.<br>
     * For more information see {@link https://learn.microsoft.com/en-us/windows/win32/api/d2d1helper/nf-d2d1helper-matrix3x2f-skew}
     *
     * @param {float} angleX The x-axis skew angle, which is measured in degrees counterclockwise from the y-axis.
     * @param {float} angleY The y-axis skew angle, which is measured in degrees clockwise from the x-axis.
     * @param {number=} [cx=0] Skew center point x coord
     * @param {number=} [cy=0] Skew center point y coord
     */
    this.Skew = function(angleX, angleY, cx, cy) {}

    /**
     * Saves current D2DGraphics matrix in internal stack. To restore the matrix use {@link D2DGraphics#PopTransform PopTransform}.
     */
    this.PushTransform = function() {}

    /**
     * Restores D2DGraphics matrix from internal stack pushed previously by {@link D2DGraphics#PushTransform PushTransform}.
     */
    this.PopTransform = function() {}

    /**
     * Gets D2DGraphics current transformation matrix of 3x2 size (Float32Array(6))<br>
     * Matrix3x2 helper class from the component/docs/Matrix.js will be useful
     * @return {Float32Array}
     * 
     * @sourceFile ../../component/docs/Matrix.js
     */
    this.GetTransform = function() {}

    /**
     * Replaces the current D2DGraphics matrix with specified transformation matrix of 3x2 size.<br>
     * Matrix3x2 helper class from the component/docs/Matrix.js will be useful
     * @param {Float32Array} matrix Array that presents 3x2 matrix for transformation (length = 6)
     * 
     * @sourceFile ../../component/docs/Matrix.js
     */
    this.SetTransform = function(matrix) {}

    /**
     * Resets current D2DGraphics matrix to original identity matrix.
     */
    this.ResetTransform = function () {}

    /**
     * Applies specified transformation matrix of 3x2 size to the current D2DGraphics matrix.<br>
     * Matrix3x2 helper class from the component/docs/Matrix.js will be useful
     * @param {Float32Array} matrix Array that presents 3x2 matrix for transformation (length = 6)
     * 
     * @sourceFile ../../component/docs/Matrix.js
     */
    this.ApplyTransform = function(matrix) {}

    /**
     * @constructor
     * @hideconstructor
     *
     * @example
     * include(`${fb.ComponentPath}docs\\Flags.js`);
     * include(`${fb.ComponentPath}docs\\Helpers.js`);
     *
     * let sf = StringFormat(StringAlignment.Near, StringAlignment.Near);
     * let text = utils.ReadTextFile("z:\\info.txt");
     * let font = window.GetFontDUI(0);
     *
     * function on_paint(gr) {
     *     gr.DrawString(text, font, RGB(255, 0, 0), 0, 0, window.Width, window.Height, sf);
     *     let temp = gr.MeasureString(text, font, 0, 0, window.Width, 10000, sf);
     *     // If we want to calculate height, we must set the height to be far larger than what
     *     // the text could possibly be.
     *
     *     console.log(temp.Height); // 2761.2421875 // far larger than my panel height!
     *     console.log(temp.Chars); // 7967
     * }
     */
    function MeasureStringInfo() {

        /**
         * @type {number}
         * @readonly
         */
        this.Chars = undefined; // (uint) (read)

        /**
         * @type {float}
         * @readonly
         */
        this.Height = undefined; // (float) (read)

        /**
         * @type {number}
         * @readonly
         */
        this.Lines = undefined; // (uint) (read)

        /**
         * @type {float}
         * @readonly
         */
        this.X = undefined; // (float) (read)

        /**
         * @type {float}
         * @readonly
         */
        this.Y = undefined; // (float) (read)

        /**
         * @type {float}
         * @readonly
         */
        this.Width = undefined; // (float) (read)
    }

    /**
     * @param {number=} [mode=0] See {@link module:Flags.InterpolationMode InterpolationMode} enum
     */
    this.SetInterpolationMode = function (mode) { }; // (void)

    /**
     * @param {number=} [mode=0] See {@link module:Flags.SmoothingMode SmoothingMode} enum
     */
    this.SetSmoothingMode = function (mode) { }; // (void)

    /**
     * @param {number=} [mode=0] See {@link module:Flags.TextRenderingHint TextRenderingHint} enum
     */
    this.SetTextRenderingHint = function (mode) { }; // (void)

    /**
     * Currect width of device context surface.
     * @type {number}
     * @readonly
     */
    this.Width = 640;
    /**
     * Currect height of device context surface.
     * @type {number}
     * @readonly
     */
    this.Height = 480;
}

/**
 * Functions for working with Direct2D graphics.
 *
 * @namespace
 */
let d2d = {

    /**
     * Creates a drawing brush of the specified type. The meaning of the brush's input parameters depends on its type.<br>
     * For type == {@link module:Flags.BrushType BrushType.Solid}:<br>
     * - param1: brush colour in ARGB<br>
     * For type == {@link module:Flags.BrushType BrushType.LinearGradient}:<br>
     * - param1: start point coords of linear gradient in form of Array(2) (for ex.: [0, 0])<br>
     * - param2: end point coords of linear gradient in form of Array(2) (for ex.: [100, 0])<br>
     * - param3: gradient stops specified as an array with alternating position and color values for each stop (for ex.: [0.0, 0xFF000000, 0.5, 0xFFFF0000, 1.0, 0xFFFFFFFF])<br>
     * - param4: wrap mode responsible for how the gradient is repeated when drawing. See {@link module:Flags.BrushWrapMode BrushWrapMode}. Default is {@link module:Flags.BrushWrapMode BrushWrapMode.Tile}<br>
     * For type == {@link module:Flags.BrushType BrushType.RadialGradient}:<br>
     * - param1: center point coords of radial gradient in form of Array(2) (for ex.: [50, 50])<br>
     * - param2: radius values for X and Y axes in form of Array(2) (for ex.: [50, 50])<br>
     * - param3: gradient stops specified as an array with alternating position and color values for each stop (for ex.: [0.0, 0xFF000000, 0.5, 0xFFFF0000, 1.0, 0xFFFFFFFF])<br>
     * - param4: wrap mode responsible for how the gradient is repeated when drawing. See {@link module:Flags.BrushWrapMode BrushWrapMode}. Default is {@link module:Flags.BrushWrapMode BrushWrapMode.Tile}<br>
     * For type == {@link module:Flags.BrushType BrushType.Bitmap}:<br>
     * - param1: D2DBitmap object used for drawing by brush<br>
     * - param2: wrap mode responsible for how the image is repeated when drawing. See {@link module:Flags.BrushWrapMode BrushWrapMode}
     * 
     * @param {BrushType} type
     * @param {*} param1
     * @param {*=} [param2=undefined]
     * @param {*=} [param3=undefined]
     * @param {*=} [param4=undefined]
     * @return {D2DBrush} Brush object used in Draw/Fill methods
     * 
     * @sourceFile ../../component/samples/basic/Brushes.js
     */
    Brush: function (type, param1, param2, param3, param4) { }, // (D2DBrush)

    /**
     * @param {number} w
     * @param {number} h
     * @return {D2DBitmap}
     */
    CreateImage: function (w, h) { }, // (D2DBitmap)

    /**
     * Create D2DBitmap from raw pixel data in memory.
     *
     * @param {Uint8Array} pixelData Raw pixel bytes
     * @param {number} width Image width in pixels
     * @param {number} height Image height in pixels
     * @param {string} [format="bgra32"] Pixel format string (default: "bgra32")
     * Supported formats:<br>
     *   "bgra32"  32bpp BGRA<br>
     *   "rgba32"  32bpp RGBA<br>
     *   "bgr24"   24bpp BGR<br>
     *   "rgb24"   24bpp RGB<br>
     * @returns {D2DBitmap} null if was an error (for example pixelData array length is not suitable for the specified parameters)
     * 
     * @sourceFile ../../component/samples/basic/CreateImageFromPixelData.js
     */
    CreateImageFromPixelData: function(pixelData, width, height, format = "bgra32") { }, // (D2DBitmap)

    /**
     * Performance note: avoid using inside `on_paint`.<br>
     * Performance note II: try caching and reusing `D2DFont` objects,
     * since the maximum amount of such objects is hard-limited by Windows.
     * `D2DFont` creation will fail after reaching this limit.
     *
     * @param {string} name
     * @param {number} size_px See {@link module:Helpers.Point2Pixel Point2Pixel} function for conversions
     * @param {number=} [style=0] See {@link module:Flags.FontStyle FontStyle} flags
     * @return {?D2DFont} null, if font is not present.
     */
    Font: function (name, size_px, style) { }, // (D2DFont) [, style]

    /**
     * Load image from file.<br>
     * <br>
     * Performance note: consider using {@link d2d.LoadImageAsync} or {@link d2d.LoadImageAsyncV2} if there are a lot of images to load
     * or if the image is big.
     *
     * @param {string} path
     * @return {?D2DBitmap} null, if image failed to load.
     *
     * @example
     * let img = d2d.Image('e:\\images folder\\my_image.png');
     */
    Image: function (path) { }, // (D2DBitmap)

    /**
     * Load image from file asynchronously.
     *
     * @param {number} window_id unused
     * @param {string} path
     * @return {number} a unique id, which is used in {@link module:Callbacks.on_load_image_done on_load_image_done}.
     *
     * @sourceFile ../../component/samples/basic/LoadImageAsync.js
     */
    LoadImageAsync: function (window_id, path) { }, // (uint)

    /**
     * Load image from file asynchronously.
     * Returns a `Promise` object, which will be resolved when image loading is done.
     *
     * @param {number} window_id unused
     * @param {string} path
     * @return {Promise.<?D2DBitmap>}
     *
     * @sourceFile ../../component/samples/basic/LoadImageAsyncV2.js
     */
    LoadImageAsyncV2: function (window_id, path) { },

    /**
     * Creates Direct2D effect.<br>
     * Minimum system requirements: Windows 7 Platform Update (Direct2D 1.1)
     * @param {string} CLSID CLSID of Direct2D effect. See {@link module:Effects Effects} for effects' CLSID.
     * @return {D2DEffect}
     */
    Effect: function (CLSID) { },

    /**
     * Compiles Direct2D shader.
     * @param {string} source Shader source code (ASCII HLSL code)
     * @param {string} [entryPoint="main"] The name of the shader entry point function where shader execution begins.<br>
     * @param {string} [target=""] A string that specifies the shader target or set of shader features to compile against.<br>
     * The shader target can be shader model 2, shader model 3, shader model 4, or shader model 5.<br>
     * For full target list see {@link https://learn.microsoft.com/en-us/windows/win32/direct3dhlsl/specifying-compiler-targets}<br>
     * Default value: "ps_5_0" if Direct2D 1.1 or higher is available on the system, otherwise "ps_4_0".
     * @param {D2DCompileFlags} [flags=0x4A008] Affects compiler flags. {@link module:Flags.D2DCompileFlags D2DCompileFlags}<br>
     * For flags values see: {@link https://learn.microsoft.com/en-us/windows/win32/direct3dhlsl/d3dcompile-constants}<br>
     * <b>Default value</b>: D3DCOMPILE_OPTIMIZATION_LEVEL3 | D3DCOMPILE_IEEE_STRICTNESS | D3DCOMPILE_WARNINGS_ARE_ERRORS | D3DCOMPILE_PACK_MATRIX_ROW_MAJOR<br>
     * <b>Example for debug build</b>: D3DCOMPILE_DEBUG | D3DCOMPILE_SKIP_OPTIMIZATION | D3DCOMPILE_ALL_RESOURCES_BOUND | D3DCOMPILE_PACK_MATRIX_ROW_MAJOR
     * @return {D2DCompileInfo} Result of compiling shader source
     * @example
     * include(`${fb.ComponentPath}\\docs\\Effects.js`);
     * 
     * window.DrawMode = 1;
     * 
     * // Simple colour inversion shader
     * const shaderSource = `
     *     // Input texture (Direct2D passed it into t0)
     *     Texture2D InputTexture : register(t0);
     *     SamplerState InputSampler : register(s0);
     * 
     *     // Direct2D input data structure
     *     struct VS_OUTPUT {
     *         float4 clipSpacePos : SV_POSITION;
     *         float4 sceneSpacePos : SCENE_POS;
     *         float4 texelSpacePos : TEXEL_POS;
     *     };
     * 
     *     // Simple color inversion shader
     *     float4 main(VS_OUTPUT input) : SV_Target
     *     {
     *         // Selecting a pixel from an input image
     *         float4 color = InputTexture.Sample(InputSampler, input.texelSpacePos.xy);
     * 	
     *         // Invert RGB, keep alpha
     *         return float4(1.0 - color.rgb, color.a) * color.a;
     *     }
     * `;
     * 
     * const img = d2d.Image(`${fb.ComponentPath}\\samples\\d2d\\images\\Flowers.jpg`);
     * const effect = d2d.Effect(Effects.CustomShader.ID);
     * effect.SetInput(0, img);
     * 
     * const shaderCode = d2d.Compile(shaderSource);
     * if (shaderCode.Error !== "") 
     *     fb.ShowPopupMessage(shaderCode.Error, "Direct2D compile error!");
     * else
     *     effect.SetValue(Effects.CustomShader.ShaderCode, shaderCode.Code);
     * 
     * function on_paint(dgr) {	
     *     dgr.DrawEffect(effect, 10, 10, 0, 0, img.Width, img.Height);
     * }
     */
    Compile: function (source, entryPoint, target, flags) { },
};

/**
 * Result of {@link d2d.Compile}
 * @constructor
 * @hideconstructor
 */
function D2DCompileInfo() {

    /**
     * Compiled shader (bytecode)
     * @type {Uint8Array}
     * @readonly
     */
    this.Code = [];

    /**
     * If there's error after {@link d2d.Compile} call it contains non-empty string representing a compiler error message.
     * @type {string}
     * @readonly
     */
    this.Error = "";
}
