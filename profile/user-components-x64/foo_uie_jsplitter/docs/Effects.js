/**
 * Direct2D effects<br>
 * Minimum system requirements: Windows 7 Platform Update (Direct2D 1.1)<br>
 * Not all effects in this module supported by minimum Direct2D version.<br>
 * {@link d2d.Effect} returns null if effect is not supported.<br>
 * See examples on top and bottom of this page.
 * @module Effects
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
 *     dgr.DrawEffect(effect, 0, 0, 0, 0, img.Width, img.Height);
 * }
 * 
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
 * scale.SetValue(Effects.Scale.Scale, new Float32Array([0.7, 0.7]));
 * 
 * function on_paint(dgr) {	
 *     dgr.DrawEffect(scale, 10, 10, 0, 0, img.Width, img.Height);
 * }
 * 
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

/** 
 * @typedef {Object} Effects
 * @memberof module:Effects
 * 
 * @property {Object} ColorMatrix
 * Use the color matrix effect to alter the RGBA values of a bitmap.<br>
 * You can use this effect to: <br>
 * ● Remove a color channel from an image.<br>
 * ● Reduce the color in an image.<br>
 * ● Swap color channels.<br>
 * ● Combine color channels.<br>
 * Many built-in effects are specializations of color matrix that are optimized for the intended use of the effects. Examples include saturation, hue rotate, sepia, and temperature and tint.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/color-matrix}
 * @property {string} ColorMatrix.ID
 * CLSID of effect.
 * @property {string} ColorMatrix.ColorMatrix
 * Value type: <b>Float32Array(20)</b><br>
 * A 5x4 matrix of float values. The elements in the matrix are not bounded and are unitless. The default is the identity matrix.<br>
 * The default value is [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0]
 * @property {string} ColorMatrix.AlphaMode
 * Value type: <b>{@link module:Effects.ColorMatrixAlphaMode ColorMatrixAlphaMode}</b><br>
 * The alpha mode of the output.<br>
 * The default value is {@link module:Effects.ColorMatrixAlphaMode ColorMatrixAlphaMode.Premultiplied}
 * @property {string} ColorMatrix.ClampOutput
 * Value type: <b>BOOL</b><br>
 * Whether the effect clamps color values to between 0 and 1 before the effect passes the values to the next effect in the graph. The effect clamps the values before it premultiplies the alpha. If you set this to TRUE the effect will clamp the values. If you set this to FALSE, the effect will not clamp the color values, but other effects and the output surface may clamp the values if they are not of high enough precision.<br>
 * The default value is FALSE
 * 
 * @property {Object} HdrToneMap
 * This effect adjusts the dynamic range of an image to better suit its content to the capability of the output display.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/hdr-tone-map-effect}
 * @property {string} HdrToneMap.ID
 * CLSID of effect.
 * @property {string} HdrToneMap.InputMaxLuminance
 * Value type: <b>FLOAT</b><br>
 * The maximum light level (or MaxCLL) of the image, in nits.
 * @property {string} HdrToneMap.OutputMaxLuminance
 * Value type: <b>FLOAT</b><br>
 * The MaxCLL supported by the output target, in nits—typically set to the MaxCLL of the display.
 * @property {string} HdrToneMap.DisplayMode
 * Value type: <b>{@link module:Effects.HdrToneMapDisplayMode HdrToneMapDisplayMode}</b><br>
 * When set to HDR, the tone mapping curve is adjusted to better fit the fit the behavior of common HDR displays.<br>
 * 
 * @property {Object} WhiteLevelAdjustment
 * This effect allows the white level of an image to be linearly scaled. This is especially helpful when you convert between display-referred luminance space and scene-referred luminance space, or vice versa.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/white-level-adjustment-effect}
 * @property {string} WhiteLevelAdjustment.ID
 * CLSID of effect.
 * @property {string} WhiteLevelAdjustment.InputWhiteLevel
 * Value type: <b>FLOAT</b><br>
 * The white level of the input image, in nits.
 * @property {string} WhiteLevelAdjustment.OutputWhiteLevel
 * Value type: <b>FLOAT</b><br>
 * The white level of the output image, in nits.
 * 
 * @property {Object} AlphaMask
 * This effect applies an alpha mask to an image. It has two inputs, named Destination and Mask. Color values in the Destination image are multiplied by the alpha channel of the Mask image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/alpha-mask-effect}
 * @property {string} AlphaMask.ID
 * CLSID of effect.
 * 
 * @property {Object} ArithmeticComposite
 * Use the arithmetic composite effect to combine 2 images using a weighted sum of pixels from the input images.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/arithmetic-composite}
 * @property {string} ArithmeticComposite.ID
 * CLSID of effect.
 * @property {string} ArithmeticComposite.Coefficients
 * Value type: <b>Float32Array(4)</b><br>
 * The coefficients for the equation used to composite the two input images. The coefficients are unitless and unbounded.<br>
 * Default value is [1.0, 0.0, 0.0, 0.0].
 * @property {string} ArithmeticComposite.ClampOutput
 * Value type: <b>BOOL</b><br>
 * The effect clamps color values to between 0 and 1 before the effect passes the values to the next effect in the graph. If you set this to TRUE the effect will clamp the values. If you set this to FALSE, the effect will not clamp the color values, but other effects and the output surface may clamp the values if they are not of high enough precision.<br>
 * Default value is FALSE.
 * 
 * @property {Object} Blend
 * Use the blend effect to combine 2 images. This effect has 26 blend modes.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/blend}
 * @property {string} Blend.ID
 * CLSID of effect.
 * @property {string} Blend.Mode
 * Value type: <b>{@link module:Effects.Blend Blend}</b><br>
 * The interpolation mode the effect uses to scale the image to the corresponding kernel unit length. There are six scale modes that range in quality and speed.<br>
 * The default value is {@link module:Effects.Blend Blend.Multiply}
 * 
 * @property {Object} Composite
 * Use the composite effect to combine 2 or more images. This effect has 13 different composite modes. The composite effect accepts 2 or more inputs. When you specify 2 images, destination is the first input (index 0) and the source is the second input (index 1). If you specify more than 2 inputs the images are composited starting with the first input and the second and so on. This effect implements all of the modes using the blending unit of the graphics processing unit (GPU).<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/composite}
 * @property {string} Composite.ID
 * CLSID of effect.
 * @property {string} Composite.Mode
 * Value type: <b>{@link module:Flags.CompositeMode CompositeMode}</b><br>
 * The mode used for the effect.<br>
 * The default value is {@link module:Flags.CompositeMode CompositeMode.SourceOver}
 * 
 * @property {Object} CrossFade
 * This effect combines two images by adding weighted pixels from input images. It has two inputs, named Destination and Source. The cross fade formula is output = weight * Destination + (1 - weight) * Source.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/cross-fade-effect}
 * @property {string} CrossFade.ID
 * CLSID of effect.
 * @property {string} CrossFade.Weight
 * Value type: <b>FLOAT</b><br>
 * How much to weigh the source image color values versus the destination image. The minimum value is 0.0f (exclusively use the destination image to determine the output) and the maximum value is 1.0f (exclusively use the source image to determine the output).<br>
 * The default value is 0.5
 * 
 * @property {Object} ConvolveMatrix
 * Use the convolve matrix effect to apply an arbitrary 2D kernel to an image. You can use this effect to blur, detect edges, emboss, or sharpen an image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/convolve-matrix}
 * @property {string} ConvolveMatrix.ID
 * CLSID of effect.
 * @property {number} ConvolveMatrix.KernelUnitLength
 * Value type: <b>FLOAT</b><br>
 * The size of one unit in the kernel. The units are in (DIPs/kernel unit), where a kernel unit is the size of the element in the convolution kernel. A value of 1 (DIP/kernel unit) corresponds to one pixel in an image at 96 DPI.<br>
 * The default value is 1.0
 * @property {number} ConvolveMatrix.ScaleMode
 * Value type: <b>{@link module:Effects.ConvolveMatrixScaleMode ConvolveMatrixScaleMode}</b><br>
 * The interpolation mode the effect uses to scale the image to the corresponding kernel unit length. There are six scale modes that range in quality and speed.<br>
 * The default value is {@link module:Effects.ConvolveMatrixScaleMode ConvolveMatrixScaleMode.Linear}
 * @property {number} ConvolveMatrix.KernelSizeX
 * Value type: <b>UINT32</b><br>
 * The width of the kernel matrix. The units are specified in kernel units.<br>
 * The default value is 3
 * @property {number} ConvolveMatrix.KernelSizeY
 * Value type: <b>UINT32</b><br>
 * The height of the kernel matrix. The units are specified in kernel units.<br>
 * The default value is 3
 * @property {number} ConvolveMatrix.KernelMatrix
 * Value type: <b>Float32Array(9)</b><br>
 * The kernel matrix to be applied to the image. The kernel elements aren't bounded and are specified as floats. The first set of KernelSizeX numbers in the FLOAT[] corresponds to the first row in the kernel. The second set of KernelSizeX numbers correspond to the second row, and so on up to KernelSizeY rows.<br>
 * The default value is [0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0]
 * @property {number} ConvolveMatrix.Divisor
 * Value type: <b>FLOAT</b><br>
 * The kernel matrix is applied to a pixel and then the result is divided by this value. 0 behaves as a value of float epsilon.<br>
 * The default value is 1.0
 * @property {number} ConvolveMatrix.Bias
 * Value type: <b>FLOAT</b><br>
 * The effect applies the kernel matrix, the divisor, and then the bias is added to the result. The bias is unbounded and unitless.<br>
 * The default value is 0.0
 * @property {number} ConvolveMatrix.KernelOffset
 * Value type: <b>Float32Array(2)</b><br>
 * Shifts the convolution kernel from a centered position on the output pixel to a position you specify left/right and up/down. The offset is defined in kernel units. With some offsets and kernel sizes, the convolution kernel s samples won't land on a pixel image center. The pixel values for the kernel sample are computed by bilinear interpolation.<br>
 * The default value is [0.0, 0.0]
 * @property {number} ConvolveMatrix.PreserveAlpha
 * Value type: <b>BOOL</b><br>
 * Specifies whether the convolution kernel is applied to the alpha channel or only the color channels. If you set this to TRUE the convolution kernel is applied only to the color channels. If you set this to FALSE the convolution kernel is applied to all channels.<br>
 * The default value is false.
 * @property {number} ConvolveMatrix.BorderMode
 * Value type: <b>{@link module:Effects.BorderMode BorderMode}</b><br>
 * The mode used to calculate the border of the image, soft or hard.<br>
 * The default value is {@link module:Effects.BorderMode BorderMode.Soft}
 * @property {number} ConvolveMatrix.ClampOutput
 * Value type: <b>BOOL</b><br>
 * Whether the effect clamps color values to between 0 and 1 before the effect passes the values to the next effect in the graph. The effect clamps the values before it premultiplies the alpha. If you set this to TRUE the effect will clamp the values. If you set this to FALSE, the effect will not clamp the color values, but other effects and the output surface may clamp the values if they are not of high enough precision.<br>
 * The default value is false.
 * 
 * @property {Object} DirectionalBlur
 * The directional blur effect is similar to Gaussian blur, except you can skew the blur in a particular direction. You can use this effect to make an image look as if it is in motion or to emphasize an animated image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/directional-blur}
 * @property {string} DirectionalBlur.ID
 * CLSID of effect.
 * @property {number} DirectionalBlur.StandardDeviation
 * Value type: <b>FLOAT</b><br>
 * The amount of blur to be applied to the image. You can compute the blur radius of the kernel by multiplying the standard deviation by 3. The units of both the standard deviation and blur radius are DIPs. A value of 0 DIPs disables this effect.<br>
 * The default value is 3.0
 * @property {number} DirectionalBlur.Angle
 * Value type: <b>FLOAT</b><br>
 * The angle of the blur relative to the x-axis, in the counterclockwise direction. The units are specified in degrees. The blur kernel is first generated using the same process as for the Gaussian blur effect. The kernel values are then transformed according to the blur angle.<br>
 * The default value is 0.0
 * @property {number} DirectionalBlur.Optimization
 * Value type: <b>{@link module:Effects.DirectionalBlurOptimization DirectionalBlurOptimization}</b><br>
 * The optimization mode.
 * The default value is  {@link module:Effects.DirectionalBlurOptimization DirectionalBlurOptimization.Balanced}
 * @property {number} DirectionalBlur.BorderMode
 * Value type: <b>{@link module:Effects.BorderMode BorderMode}</b><br>
 * The mode used to calculate the border of the image, soft or hard.<br>
 * The default value is {@link module:Effects.BorderMode BorderMode.Soft}
 *
 * @property {Object} EdgeDetection
 * Filters out the content of an image, leaving lines at the edges of contrasting sections of the image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/edge-detection-effect}
 * @property {string} EdgeDetection.ID
 * CLSID of effect.
 * @property {number} EdgeDetection.Strength
 * Value type: <b>FLOAT</b><br>
 * Value modulating the response of the edge detection filter. A low strength value means that weaker edges will get filtered out, while a high value means stronger edges will get filtered out. The allowed range is 0.0 to 1.0<br>
 * The default value is 0.5
 * @property {number} EdgeDetection.BlurRadius
 * Value type: <b>FLOAT</b><br>
 * Value specifying the amount of blur to apply. Applying blur is used to remove high frequencies and reduce phantom edges. The allowed range is 0.0 to 10.0<br>
 * The default value is 0.0 (no blur applied).
 * @property {number} EdgeDetection.Mode
 * Value type: <b>{@link module:Effects.EdgeDetectionMode EdgeDetectionMode}</b><br>
 * Value which mode to use for edge detection.
 * The default value is {@link module:Effects.EdgeDetectionMode EdgeDetectionMode.Sobel}
 * @property {number} EdgeDetection.OverlayEdges
 * Value type: <b>BOOL</b><br>
 * Edge detection only applies to the RGB channels, the alpha channel is ignored for purposes of detecting edges. If is false, the output edges is fully opaque. If is true, the input opacity is preserved.<br>
 * The default value is false.
 * @property {number} EdgeDetection.AlphaMode
 * Value type: <b>{@link module:Effects.AlphaMode AlphaMode}</b><br>
 * Value indicating the alpha mode of the input file. If the input is not opaque, this value is used to determine whether to unpremultiply the inputs. See the About Alpha Modes section of the {@link https://learn.microsoft.com/en-us/windows/desktop/Direct2D/supported-pixel-formats-and-alpha-modes Supported Pixel Formats and Alpha Modes} topic for additional information.<br>
 * The default value is {@link module:Effects.AlphaMode AlphaMode.Premultiplied}
 * 
 * @property {Object} GaussianBlur
 * Use the Gaussian blur effect to create a blur based on the Gaussian function over the entire input image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/gaussian-blur}
 * @property {string} GaussianBlur.ID
 * CLSID of effect.
 * @property {number} GaussianBlur.StandardDeviation
 * Value type: <b>FLOAT</b><br>
 * The amount of blur to be applied to the image. You can compute the blur radius of the kernel by multiplying the standard deviation by 3.<br>
 * The units of both the standard deviation and blur radius are DIPs. A value of zero DIPs disables this effect entirely.<br>
 * The default value is 3.0
 * @property {number} GaussianBlur.Optimization
 * Value type: <b>{@link module:Effects.GaussianBlurOptimization GaussianBlurOptimization}</b><br>
 * The optimization mode.
 * The default value is  {@link module:Effects.GaussianBlurOptimization GaussianBlurOptimization.Balanced}
 * @property {number} GaussianBlur.BorderMode
 * Value type: <b>{@link module:Effects.BorderMode BorderMode}</b><br>
 * The mode used to calculate the border of the image, soft or hard.<br>
 * The default value is {@link module:Effects.BorderMode BorderMode.Soft}
 *  
 * @property {Object} Morphology
 * Use the morphology effect to thin or thicken edge boundaries in an image. This effect creates a kernel that is 2 times the Width and Height values you specify. This effect centers the kernel on the pixel it is calculating and returns the maximum value in the kernel (if dilating) or minimum value in the kernel (if eroding).<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/morphology}
 * @property {string} Morphology.ID
 * CLSID of effect.
 * @property {number} Morphology.Mode
 * Value type: <b>{@link module:Effects.MorphologyMode MorphologyMode}</b><br>
 * The morphology mode. The available modes are erode (flatten) and dilate (thicken).<br>
 * The default value is {@link module:Effects.MorphologyMode MorphologyMode.Erode}
 * @property {number} Morphology.Width
 * Value type: <b>UINT</b><br>
 * Size of the kernel in the X direction. The units are in DIPs. Values must be between 1 and 100 inclusive.<br>
 * The default value is 1
 * @property {number} Morphology.Height
 * Value type: <b>UINT</b><br>
 * Size of the kernel in the Y direction. The units are in DIPs. Values must be between 1 and 100 inclusive.<br>
 * The default value is 1
 * 
 * @property {Object} Emboss
 * Creates a grayscale version of the image that appears as though it has been stamped into paper.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/emboss-effect}
 * @property {string} Emboss.ID
 * CLSID of effect.
 * @property {number} Emboss.Height
 * Value type: <b>FLOAT</b><br>
 * Value controlling the strength of the embossing effect. The allowed range is 0.0 to 10.0<br>
 * The default value is 1.0
 * @property {number} Emboss.Direction
 * Value type: <b>FLOAT</b><br>
 * Value specifying the light direction used to create the effect. The allowed range is 0.0 to 360.0<br>
 * The default value is 0.0
 *
 * @property {Object} Posterize
 * The posterize effect reduces the number of unique colors in an image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/posterize-effect}
 * @property {string} Posterize.ID
 * CLSID of effect.
 * @property {number} Posterize.RedValueCount
 * Value type: <b>UINT</b><br>
 * Integer value specifying how many evenly spaced steps to divide the red channel range of 0.0 to 1.0 into. For example, a value of 4 generates a table with 4 steps, [0.0, 0.33, 0.67, 1.0]. The allowed range for this property is 2 to 16<br>
 * The default value is 4
 * @property {number} Posterize.GreenValueCount
 * Value type: <b>UINT</b><br>
 * Integer value specifying how many evenly spaced steps to divide the green channel range of 0.0 to 1.0 into. For example, a value of 4 generates a table with 4 steps, [0.0, 0.33, 0.67, 1.0]. The allowed range for this property is 2 to 16<br>
 * The default value is 4
 * @property {number} Posterize.BlueValueCount
 * Value type: <b>UINT</b><br>
 * Integer value specifying how many evenly spaced steps to divide the blue channel range of 0.0 to 1.0 into. For example, a value of 4 generates a table with 4 steps, [0.0, 0.33, 0.67, 1.0]. The allowed range for this property is 2 to 16<br>
 * The default value is 4
 * 
 * @property {Object} Shadow
 * Use the shadow effect to generate a shadow from the alpha channel of an image. The shadow is more opaque for higher alpha values and more transparent for lower alpha values. You can set the amount of blur and the color of the shadow.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/drop-shadow}
 * @property {string} Shadow.ID
 * CLSID of effect.
 * @property {number} Shadow.BlurStandardDeviation
 * Value type: <b>FLOAT</b><br>
 * The amount of blur to be applied to the alpha channel of the image. You can compute the blur radius of the kernel by multiplying the standard deviation by 3. The units of both the standard deviation and blur radius are DIPs. This property is the same as the Gaussian Blur standard deviation property.<br>
 * The default value is 3.0
 * @property {number} Shadow.Color
 * Value type: <b>Float32Array(4)</b><br>
 * The color of the drop shadow. This property is a Float32Array(4) defined as: [R, G, B, A] (normalized in range [0.0, 1.0]). You must specify this color in straight alpha.<br>
 * The default value is [0.0, 0.0, 0.0, 1.0].<br>
 * @property {number} Shadow.Optimization
 * Value type: <b>{@link module:Effects.ShadowOptimization ShadowOptimization}</b><br>
 * The level of performance optimization.
 * The default value is {@link module:Effects.ShadowOptimization ShadowOptimization.Balanced}
 * 
 * @property {Object} Brightness
 * Use the brightness effect to control the brightness of the image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/brightness}
 * @property {string} Brightness.ID
 * CLSID of effect.
 * @property {number} Brightness.WhitePoint
 * Value type: <b>Float32Array(2)</b><br>
 * The upper portion of the brightness transfer curve.<br>
 * The white point adjusts the appearance of the brighter portions of the image.<br>
 * This property is for both the x value and the y value, in that order.<br>
 * Each of the values of this property are between 0 and 1, inclusive.
 * The default value is [1.0, 1.0]
 * @property {number} Brightness.BlackPoint
 * Value type: <b>Float32Array(2)</b><br>
 * The lower portion of the brightness transfer curve.<br>
 * The black point adjusts the appearance of the darker portions of the image.<br>
 * This property is for both the x value and the y value, in that order.<br>
 * Each of the values of this property are between 0 and 1, inclusive.
 * The default value is [0.0, 0.0]
 * 
 * @property {Object} Contrast
 * Increases or decreases the contrast of an image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/contrast-effect}
 * @property {string} Contrast.ID
 * CLSID of effect.
 * @property {number} Contrast.Contrast
 * Value type: <b>FLOAT</b><br>
 * Value indicating the amount by which to adjust the contrast of the image.<br>
 * Negative values reduce contrast, while positive values increase contrast.<br>
 * Minimum value is -1.0, maximum value is 1.0.<br>
 * The default value for the property is 0.0.
 * @property {number} Contrast.ClampInput
 * Value type: <b>BOOL</b><br>
 * Value indicating whether or not to clamp the input to [0.0, 1.0].<br>
 * The default value for the property is false.
 * 
 * @property {Object} Exposure
 * Increase or decreases the exposure of the image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/exposure-effect}
 * @property {string} Exposure.ID
 * CLSID of effect.
 * @property {number} Exposure.ExposureValue
 * Value type: <b>FLOAT</b><br>
 * Specifies how much to increase or decrease the exposure of the image. The allowed range is -2.0 to 2.0.<br>
 * The default value is 0.0 (no change).
 * 
 * @property {Object} Grayscale
 * Converts an image to monochromatic gray.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/grayscale-effect}
 * @property {string} Grayscale.ID
 * CLSID of effect.
 *
 * @property {Object} HighlightsShadows
 * Adjusts the highlights and shadows of the image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/highlights-and-shadows-effect}
 * @property {string} HighlightsShadows.ID
 * CLSID of effect.
 * @property {number} HighlightsShadows.Highlights
 * Value type: <b>FLOAT</b><br>
 * Value indicating how much to increase or decrease highlights. The allowed range is -1.0 to 1.0<br>
 * The default value is 0.0
 * @property {number} HighlightsShadows.Shadows
 * Value type: <b>FLOAT</b><br>
 * Value indicating how much to increase or decrease shadows. The allowed range is -1.0 to 1.0<br>
 * The default value is 0.0
 * @property {number} HighlightsShadows.Clarity
 * Value type: <b>FLOAT</b><br>
 * Value indicating how much to increase or decrease clarity. The allowed range is -1.0 to 1.0<br>
 * The default value is 0.0
 * @property {number} HighlightsShadows.InputGamma
 * Value type: <b>{@link module:Effects.InputGamma InputGamma}</b><br>
 * Value indicating the gamma of the input image.<br>
 * The Highlights and Shadows effect works in linear gamma space, so if the input image is know to be linear, the {@link module:Effects.InputGamma InputGamma.Linear} value should be used to prevent sRGB to linear conversions from being performed.<br>
 * @property {number} HighlightsShadows.MaskBlurRadius
 * Value type: <b>FLOAT</b><br>
 * Value controlling the size of the region used around a pixel to classify the pixel as highlight or shadow. Lower values result in more localized adjustments. The allowed range is 0.0 to 10.0<br>
 * The default value is 1.25
 * 
 * @property {Object} Histogram
 * Use the histogram effect to generate a histogram for the input bitmap based on the specified number of bins.<br>
 * The effect generates a histogram for pixel values between 0 and 1. Values outside of this range are clamped to the range. The range of a particular bucket depends on the number of buckets.<br>
 * This effect works on straight bitmap pixels. The color channels of the input bitmap are divided by the alpha channel to compute this effect.
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/histogram}
 * @property {string} Histogram.ID
 * CLSID of effect.
 * @property {number} Histogram.NumBins
 * Value type: <b>UINT32</b><br>
 * Specifies the number of bins used for the histogram. The range of intensity values that fall into a particular bucket depend on the number of specified buckets.
 * The default value is 256
 * @property {number} Histogram.ChannelSelect
 * Value type: <b>{@link module:Effects.ChannelSelector ChannelSelector}</b><br>
 * Specifies the channel used to generate the histogram. This effect has a single data output corresponding to the specified channel. See Channel selectors for more info.
 * The default value is {@link module:Effects.ChannelSelector ChannelSelector.R}
 * @property {number} Histogram.HistogramOutput
 * Value type: <b>Float32Array (output property only!)</b><br> 
 * This effect outputs a Float32Array, with the number of elements corresponding to the number of specified NumBins.<br>
 * @example
 * //=========================== Histogram ========================================
 * 
 * window.DrawMode = 1;
 * include(`${fb.ComponentPath}\\docs\\Effects.js`);
 * 
 * const img = d2d.Image(`${fb.ComponentPath}\\samples\\d2d\\images\\Flowers.jpg`);
 * 
 * const effect = d2d.Effect(Effects.Histogram.ID);
 * effect.SetInput(0, img);
 * effect.SetValue(Effects.Histogram.NumBins, 10);
 * effect.SetValue(Effects.Histogram.ChannelSelect, ChannelSelector.R);
 * 
 * const dgrImg = d2d.CreateImage(1,1);
 * const dgr = dgrImg.GetGraphics();
 * dgr.DrawEffect(effect, 0, 0, 0, 0, img.Width, img.Height);
 * dgrImg.ReleaseGraphics(dgr);
 * const histogram = effect.GetValue(Effects.Histogram.HistogramOutput);
 * 
 * console.log(histogram); // Float32Array {0=0.04278142377734184, 1=0.03943245857954025, 2=0.06783067435026169, 3=0.08444418758153915, 4=0.12744605541229248, 5=0.13865619897842407, 6=0.14809100329875946, 7=0.16188085079193115, 8=0.15734052658081055, 9=0.03209662064909935}
 * 
 * @property {Object} Invert
 * Inverts the colors of an image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/invert-effect}
 * @property {string} Invert.ID
 * CLSID of effect.
 * 
 * @property {Object} Sepia
 * Increase or decreases the exposure of the image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/sepia-effect}
 * @property {string} Sepia.ID
 * CLSID of effect.
 * @property {number} Sepia.Intensity
 * Value type: <b>FLOAT</b><br>
 * Value indicating the intensity of the sepia effect. The allowed range is 0.0 to 1.0<br>
 * The default value is 0.5
 * @property {number} Sepia.AlphaMode
 * Value type: <b>{@link module:Effects.AlphaMode AlphaMode}</b><br>
 * enumeration value indicating the alpha mode of the input file.<br>
 * The default value is {@link module:Effects.AlphaMode AlphaMode.Premultiplied}
 * 
 * @property {Object} Sharpen
 * Sharpens the image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/sharpen-effect}
 * @property {string} Sharpen.ID
 * CLSID of effect.
 * @property {number} Sharpen.Sharpness
 * Value type: <b>FLOAT</b><br>
 * Value indicating how much to sharpen the input image. The allowed range is 0.0 to 10.0<br>
 * The default value is 0.0
 * @property {number} Sharpen.Threshold
 * Value type: <b>FLOAT</b><br>
 * The allowed range is 0.0 to 1.0<br>
 * The default value is 0.0
 * 
 * @property {Object} Straighten
 * Rotates and optionally scales an image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/straighten-effect}
 * @property {string} Straighten.ID
 * CLSID of effect.
 * @property {number} Straighten.Angle
 * Value type: <b>FLOAT</b><br>
 * Value that specifies how much the image should be rotated. The allowed range is -45.0 to 45.0<br>
 * The default value is 0.0
 * @property {number} Straighten.MaintainSize
 * Value type: <b>BOOL</b><br>
 * Value that specifies whether the image will be scaled such that the original size is maintained without any invalid regions.<br>
 * The default value is false.
 * @property {number} Straighten.ScaleMode
 * Value type: <b>{@link module:Effects.StraightenScaleMode StraightenScaleMode}</b><br>
 * Value indicating the scaling mode that should be used.
 * See {@link module:Effects.StraightenScaleMode}
 * 
 * @property {Object} TemperatureTint
 * Rotates and optionally scales an image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/temperature-and-tint-effect}
 * @property {string} TemperatureTint.ID
 * CLSID of effect.
 * @property {number} TemperatureTint.Temperature
 * Value type: <b>FLOAT</b><br>
 * Value specifying how much to increase or decrease the temperature of the input image. The allowed range is -1.0 to 1.0<br>
 * The default value is 0.0
 * @property {number} TemperatureTint.Tint
 * Value type: <b>FLOAT</b><br>
 * Value specifying how much to increase or decrease the tint of the input image. The allowed range is -1.0 to 1.0<br>
 * The default value is 0.0
 * 
 * @property {Object} Vignette
 * Fades the input image at the edges to a user-set color.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/vignette-effect}
 * @property {string} Vignette.ID
 * CLSID of effect.
 * @property {number} Vignette.Color
 * Value type: <b>Float32Array(4)</b><br>
 * RGBA values (normalized in range [0.0, 1.0]) that specifies the color to fade the image's edges to.<br>
 * The default color is black [0.0, 0.0, 0.0, 1.0]
 * @property {number} Vignette.TransitionSize
 * Value type: <b>FLOAT</b><br>
 * Value that specifies the size of the vignette region as a percentage of the full image region. A size of 0 means the unfaded region is the entire image, while a size of 1 means the faded region is the entire source image. The allowed range is 0.0 to 1.0<br>
 * The default value is 0.1
 * @property {number} Vignette.Strength
 * Value that specifies how much the vignette color bleeds in for a given transition size. The allowed range is 0.0 to 1.0<br>
 * The default value is 0.5
 * 
 * @property {Object} Flood
 * Use the flood effect to generate a bitmap based on the specified color and alpha value. You can use this effect when you want a specific color as an input for an effect, like a background color.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/flood}
 * @property {string} Flood.ID
 * CLSID of effect.
 * @property {number} Flood.Color
 * Value type: <b>Float32Array(4)</b><br>
 * The color and opacity of the bitmap. This property is a Float32Array(4). The individual values for each channel are of type FLOAT, unbounded and unitless. The effect doesn't modify the values for the channels. The RGBA values for each channel range from 0 to 1<br>
 * The default value is [0.0, 0.0, 0.0, 1.0f]
 * 
 * @property {Object} Turbulence
 * Use the turbulence effect to generate a bitmap based on the Perlin noise function.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/turbulence}
 * @property {string} Turbulence.ID
 * CLSID of effect.
 * @property {number} Turbulence.Offset
 * Value type: <b>Float32Array(2)</b><br>
 * The coordinates where the turbulence output is generated.<br>
 * The algorithm used to generate the Perlin noise is position dependent, so a different offset results in a different output. This property is not bounded and the units are specified in DIPs<br>
 * Note: The offset does not have the same effect as a translation because the noise function output is infinite and the function will wrap around the tile.<br>
 * The default value is [0.0, 0.0]
 * @property {number} Turbulence.Size
 * Value type: <b>Float32Array(2)</b><br>
 * The size of the turbulence output. This property is not bounded and the units are specified in DIPs<br>
 * The default value is [0.0, 0.0]
 * @property {number} Turbulence.BaseFrequency
 * Value type: <b>Float32Array(2)</b><br>
 * The base frequencies in the X and Y direction. This property is a float and must be greater than 0. The units are specified in 1/DIPs.<br>
 * A value of 1 (1/DIPs) for the base frequency results in the Perlin noise completing an entire cycle between two pixels. The ease interpolation for these pixels results in completely random pixels, since there is no correlation between the pixels.<br>
 * A value of 0.1(1/DIPs) for the base frequency, the Perlin noise function repeats every 10 DIPs. This results in correlation between pixels and the typical turbulence effect is visible.<br>
 * The default value is [0.01, 0.01]
 * @property {number} Turbulence.NumOctaves
 * Value type: <b>UINT32</b><br>
 * The number of octaves for the noise function. This property is a UINT32 and must be greater than 0.<br>
 * The default value is 1
 * @property {number} Turbulence.Seed
 * Value type: <b>UINT32</b><br>
 * The seed for the pseudo random generator. This property is unbounded.<br>
 * The default value is 0
 * @property {number} Turbulence.Noise
 * Value type: <b>{@link module:Effects.TurbulenceNoise TurbulenceNoise}</b><br>
 * The turbulence noise mode. This property can be either fractal sum or turbulence. Indicates whether to generate a bitmap based on Fractal Noise or the Turbulence function.<br>
 * The default value is {@link module:Effects.TurbulenceNoise TurbulenceNoise.FractalSum}
 * @property {number} Turbulence.Stitchable
 * Value type: <b>BOOL</b><br>
 * Turns stitching on or off. The base frequency is adjusted so that output bitmap can be stitched. This is useful if you want to tile multiple copies of the turbulence effect output.<br>
 * <b>True</b> The output bitmap can be tiled (using the tile effect) without the appearance of seams. The base frequency is adjusted so that output bitmap can be stitched.<br>
 * <b>False</b> The base frequency is not adjusted, so seams may appear between tiles if the bitmap is tiled.<br>
 * The default value is FALSE
 * 
 * @property {Object} AffineTransform
 * The 2D affine transform effect applies a spatial transform to an image based on a 3X2 matrix using the Direct2D matrix transform and any of six interpolation modes. You can use this effect to rotate, scale, skew, or translate an image. Or, you can combine these operations. Affine transfers preserve parallel lines and the ratio of distances between any three points in an image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/2d-affine-transform}
 * @property {string} AffineTransform.ID
 * CLSID of effect.
 * @property {number} AffineTransform.InterpolationMode
 * Value type: <b>{@link module:Effects.D2DAffinetransformInterpolationMode D2DAffinetransformInterpolationMode}</b><br>
 * The interpolation mode used to scale the image. There are 6 scale modes that range in quality and speed.<br>
 * The default value is {@link module:Effects.D2DAffinetransformInterpolationMode D2DAffinetransformInterpolationMode.Linear}
 * @property {number} AffineTransform.BorderMode
 * Value type: <b>{@link module:Effects.BorderMode BorderMode}</b><br>
 * The mode used to calculate the border of the image, soft or hard.<br>
 * The default value is {@link module:Effects.BorderMode BorderMode.Soft}
 * @property {number} AffineTransform.TransformMatrix
 * Value type: <b>Float32Array(6)</b><br>
 * The 3x2 matrix to transform the image using the Direct2D matrix transform.<br>
 * Default value is [1, 0, 0, 1, 0, 0]
 * @property {number} AffineTransform.Sharpness
 * Value type: <b>FLOAT</b><br>
 * In the high quality cubic interpolation mode, the sharpness level of the scaling filter as a float between 0 and 1. The values are unitless. You can use sharpness to adjust the quality of an image when you scale the image. The sharpness factor affects the shape of the kernel. The higher the sharpness factor, the smaller the kernel.<br>
 * <b>Note</b>: This property affects only the high quality cubic interpolation mode.<br>
 * Default value is 0.0
 * 
 * @property {Object} D3DTransform
 * Use the 3D transform effect to apply an arbitrary 4x4 transform matrix to an image.
 * This effect applies the matrix (M) you provide to the corner vertices of the source image ([ x y z 1 ]) using this calculation: [ xr yr zr 1 ]=[ x y z 1 ]*M<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/3d-transform}
 * @property {string} D3DTransform.ID
 * CLSID of effect.
 * @property {number} D3DTransform.InterpolationMode
 * Value type: <b>{@link module:Effects.D3DTransformInterpolationMode D3DTransformInterpolationMode}</b><br>
 * The interpolation mode used to scale the image. There are 6 scale modes that range in quality and speed.<br>
 * The default value is {@link module:Effects.D3DTransformInterpolationMode D3DTransformInterpolationMode.Linear}
 * @property {number} D3DTransform.BorderMode
 * Value type: <b>{@link module:Effects.BorderMode BorderMode}</b><br>
 * The mode used to calculate the border of the image, soft or hard.<br>
 * The default value is {@link module:Effects.BorderMode BorderMode.Soft}
 * @property {number} D3DTransform.TransformMatrix
 * Value type: <b>Float32Array(16)</b><br>
 * A 4x4 transform matrix applied to the projection plane. The following matrix calculation is used to map points from one 3D coordinate system to the transformed 2D coordinate system. The individual matrix elements are not bounded and are unitless.<br>
 * Default value is [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
 * 
 * @property {Object} D3DPerspectiveTransform
 * Use the 3D perspective transform effect to rotate the image in 3 dimensions as if viewed from a distance.<br>
 * The 3D perspective transform is more convenient than the {@link module:Effects.D3DTransform 3D transform effect}, but only exposes a subset of the functionality. You can compute a full 3D transformation matrix and apply a more arbitrary transform matrix to an image using the {@link module:Effects.D3DTransform 3D transform effect}<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/3d-perspective-transform}
 * @property {string} D3DPerspectiveTransform.ID
 * CLSID of effect.
 * @property {number} D3DPerspectiveTransform.InterpolationMode
 * Value type: <b>{@link module:Effects.D3DPerspectiveTransformInterpolationMode D3DPerspectiveTransformInterpolationMode}</b><br>
 * The interpolation mode the effect uses on the image. There are 5 scale modes that range in quality and speed.<br>
 * The default value is {@link module:Effects.D3DPerspectiveTransformInterpolationMode D3DPerspectiveTransformInterpolationMode.Linear}
 * @property {number} D3DPerspectiveTransform.BorderMode
 * Value type: <b>{@link module:Effects.BorderMode BorderMode}</b><br>
 * The mode used to calculate the border of the image, soft or hard.<br>
 * The default value is {@link module:Effects.BorderMode BorderMode.Soft}
 * @property {number} D3DPerspectiveTransform.Depth
 * Value type: <b>FLOAT</b><br>
 * The distance from the PerspectiveOrigin to the projection plane. The value specified in DIPs and must be greater than 0.<br>
 * Default value is 1000.0
 * @property {number} D3DPerspectiveTransform.PerspectiveOrigin
 * Value type: <b>Float32Array(2)</b><br>
 * The X and Y location of the viewer in the 3D scene. This property is a D2D1_VECTOR_2F defined as: (point X, point Y). The units are in DIPs. You set the Z value with the Depth property.<br>
 * Default value is [0.0, 0.0]
 * @property {number} D3DPerspectiveTransform.LocalOffset
 * Value type: <b>Float32Array(3)</b><br>
 * A translation the effect performs before it rotates the projection plane.<br>
 * Default value is [0.0, 0.0, 0.0]
 * @property {number} D3DPerspectiveTransform.GlobalOffset
 * Value type: <b>Float32Array(3)</b><br>
 * A translation the effect performs after it rotates the projection plane.<br>
 * Default value is [0.0, 0.0, 0.0]
 * @property {number} D3DPerspectiveTransform.RotationOrigin
 * Value type: <b>FLOAT</b><br>
 * The center point of the rotation the effect performs.<br>
 * Default value is [0.0, 0.0, 0.0]
 * @property {number} D3DPerspectiveTransform.Rotation
 * Value type: <b>FLOAT</b><br>
 * The angles of rotation for each axis.
 * Default value is [0.0, 0.0, 0.0]
 * @example
 * //=========================== D3DPerspectiveTransform ========================================
 * 
 * window.DrawMode = 1;
 * include(`${fb.ComponentPath}\\docs\\Effects.js`);
 * 
 * const img = d2d.Image(`${fb.ComponentPath}\\samples\\d2d\\images\\Flowers.jpg`);
 * 
 * const scale = d2d.Effect(Effects.Scale.ID);
 * scale.SetInput(0, img);
 * 
 * const transform = d2d.Effect(Effects.D3DPerspectiveTransform.ID);
 * transform.SetInputEffect(0, scale);
 * 
 * const angles = new Float32Array(3);
 * 
 * window.SetInterval(() => {
 * 	
 *   angles[0] += 1;
 *   angles[1] += 0.5;
 *   angles[2] += 0.8;
 *   if(angles[0] >= 360) angles[0] = 0;
 *   if(angles[1] >= 360) angles[1] = 0;
 *   if(angles[2] >= 360) angles[2] = 0;
 * 	
 *   transform.SetValue(Effects.D3DPerspectiveTransform.Rotation, angles);
 *   window.Repaint();
 *
 * }, 10);
 * 
 * var ww = 0, wh = 0;
 * function on_size(width, height) {
 *   ww = width;
 *   wh = height;
 *   scale.SetValue(Effects.Scale.Scale, new Float32Array([ww / img.Width, wh / img.Height]));
 *   transform.SetValue(Effects.D3DPerspectiveTransform.RotationOrigin, new Float32Array([ww / 2, wh / 2, 0]));
 *   transform.SetValue(Effects.D3DPerspectiveTransform.PerspectiveOrigin, new Float32Array([ww / 2, wh / 2]));	
 * }
 * 
 * function on_paint(dgr) {
 *   dgr.FillSolidRect(0, 0, ww, wh, 0xFFAAAAAA);	
 *   dgr.DrawEffect(transform, 0, 0, 0, 0, ww, wh);
 * }
 * 
 * @property {Object} Atlas
 * You can use this effect to output a portion of an image but retain the region outside of the portion for use in subsequent operations.<br>
 * The atlas effect is useful if you want to load a large image made up of many smaller images, such as various frames of a sprite.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/atlas}
 * @property {string} Atlas.ID
 * CLSID of effect.
 * @property {number} Atlas.InputRect
 * Value type: <b>Float32Array(4)</b><br>
 * The portion of the image passed to the next effect.<br>
 * Default value is [-FLT_MAX, -FLT_MAX, FLT_MAX, FLT_MAX].
 * @property {number} Atlas.InputPaddingRect
 * Value type: <b>Float32Array(4)</b><br>
 * The maximum size sampled for the output rectangle.<br>
 * Default value is [-FLT_MAX, -FLT_MAX, FLT_MAX, FLT_MAX].
 *
 * @property {Object} Border
 * Use the border effect to extend an image from the edges. You can use this effect to repeat the pixels from the edges of the image, wrap the pixels from the opposite end of the image, or mirror the pixels across the bitmap border to extend the bitmap region.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/border}
 * @property {string} Border.ID
 * CLSID of effect.
 * @property {number} Border.EdgeModeX
 * Value type: <b>{@link module:Effects.BorderEdgeMode BorderEdgeMode}</b><br>
 * The edge mode in the X direction for the effect. You can set this to clamp, wrap, or mirror.<br>
 * The default value is {@link module:Effects.BorderEdgeMode BorderEdgeMode.Clamp}
 * @property {number} Border.EdgeModeY
 * Value type: <b>{@link module:Effects.BorderEdgeMode BorderEdgeMode}</b><br>
 * The edge mode in the Y direction for the effect. You can set this to clamp, wrap, or mirror.<br>
 * The default value is {@link module:Effects.BorderEdgeMode BorderEdgeMode.Clamp}
 * 
 * @property {Object} Crop
 * Use the crop effect to output a specified region of an image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/crop}
 * @property {string} Crop.ID
 * CLSID of effect.
 * @property {number} Crop.Rect
 * Value type: <b>Float32Array(4)</b><br>
 * The region to be cropped specified as a vector in the form (left, top, right, bottom).<br>
 * The default value is [-FLT_MAX, -FLT_MAX, FLT_MAX, FLT_MAX]
 * @property {number} Crop.BorderMode
 * Value type: <b>{@link module:Effects.BorderMode BorderMode}</b><br>
 * The mode used to calculate the border of the image, soft or hard.<br>
 * The default value is {@link module:Effects.BorderMode BorderMode.Soft}
 * 
 * @property {Object} Scale
 * Use this effect to scale an image up or down.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/high-quality-scale}
 * @property {string} Scale.ID
 * CLSID of effect.
 * @property {number} Scale.Scale
 * Value type: <b>Float32Array(2)</b><br>
 * The scale amount in the X and Y direction as a ratio of the output size to the input size.<br>
 * This property an array defined as: (X scale, Y scale). The scale amounts are FLOAT, unitless, and must be positive or 0.<br>
 * The default value is [1.0, 1.0].
 * @property {number} Scale.CenterPoint
 * Value type: <b>Float32Array(2)</b><br>
 * The image scaling center point. This property is an array defined as: (point X, point Y).<br>
 * Use the center point property to scale around a point other than the upper-left corner.<br>
 * The default value is [0.0, 0.0].
 * @property {number} Scale.InterpolationMode
 * Value type: <b>{@link module:Effects.ScaleInterpolationMode ScaleInterpolationMode}</b><br>
 * The interpolation mode the effect uses to scale the image. There are 6 scale modes that range in quality and speed. See Interpolation modes for more info.<br>
 * The default value is {@link module:Effects.ScaleInterpolationMode ScaleInterpolationMode.Linear}
 * @property {number} Scale.BorderMode
 * Value type: <b>{@link module:Effects.BorderMode BorderMode}</b><br>
 * The mode used to calculate the border of the image, soft or hard.<br>
 * The default value is {@link module:Effects.BorderMode BorderMode.Soft}
 * 
 * @property {Object} Tile
 * Use the tile effect to repeat the specified region of the image.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/tile}
 * @property {string} Tile.ID
 * CLSID of effect.
 * @property {number} Tile.Rect
 * Value type: <b>Float32Array(4)</b><br>
 * The region of the image to be tiled. This property is a Float32Array defined as: [left, top, right, bottom]. <br>
 * The default value is [0, 0, 100, 100]
 * 
 * @property {Object} ChromaKey
 * Converts a given color plus or minus a tolerance to alpha. For example, chroma-key can remove the background of an image for a green-screen overlay effect.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/chromakey-effect}
 * @property {string} ChromaKey.ID
 * CLSID of effect.
 * @property {number} ChromaKey.Color
 * Value type: <b>Float32Array(3)</b><br>
 * Value indicating the color that should be converted to alpha. Array contains RGB values normalized in range [0.0, 1.0]<br>
 * The default color is black [0, 0, 0]
 * @property {number} ChromaKey.Tolerance
 * Value type: <b>FLOAT</b><br>
 * Value indicating the tolerance for matching the color specified in the Color property. The allowed range is 0.0 to 1.0<br>
 * The default value is 0.1
 * @property {number} ChromaKey.InvertAlpha
 * Value type: <b>BOOL</b><br>
 * Value indicating whether the alpha values should be inverted.<br>
 * The default value if FALSE
 * @property {number} ChromaKey.Feather
 * Value type: <b>BOOL</b><br>
 * Value whether the edges of the output should be softened in the alpha channel. When set to FALSE, the alpha output by the effect is 1-bit: either fully opaque or fully transparent. Setting to TRUE results in a softening of edges in the alpha channel of the Chroma Key output.<br>
 * The default value is False.
 * 
 * @property {Object} LuminanceToAlpha
 * Use the luminance to alpha effect to set the alpha channel to the luminance of the image and sets the color channels to 0. You can use the output of this effect to make a semitransparent overlay based on the brightness of the input image. Or you can use it to make an image mask.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/luminance-to-alpha}
 * @property {string} LuminanceToAlpha.ID
 * CLSID of effect.
 * 
 * @property {Object} Opacity
 * This effect adjusts the opacity of an image by multiplying the alpha channel of the input by the specified opacity value. It has a single input.<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/opacity-effect}
 * @property {string} Opacity.ID
 * CLSID of effect.
 * @property {number} Opacity.Opacity
 * Value type: <b>FLOAT</b><br>
 * The multiplier to the input image's alpha channel. The minimum value is 0.0f and the maximum value is 1.0f<br>
 * The default value is 1.0
 * 
 * @property {Object} CustomShader
 * Applies custom shader to image.<br> 
 * @property {string} CustomShader.ID
 * CLSID of effect.
 * @property {number} CustomShader.ShaderCode
 * Value type: <b>Uint8Array (code bytes blob array)</b><br>
 * Compiled shader bytecode. Shader MUST be compiled before setting it as an input value for this effect.<br>
 * Use {@link d2d.Compile} to compile shader source code (see example in the page end).<br>
 * For more information, see: {@link https://learn.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-writing-shaders-9}
 */

/**
 * Contains identifiers of built-in Direct2D effects with their CLSIDs and tuning properties.
 * @memberof module:Effects
 * @default
 */
const Effects = {
    
    // ================================ Color ========================================
    // https://learn.microsoft.com/en-us/windows/win32/direct2d/built-in-effects#color

    ColorMatrix: {
        ID: '{921F03D6-641C-47DF-852D-B4BB6153AE11}',
        ColorMatrix: 0,
        AlphaMode: 1,
        ClampOutput: 2
    },

    HdrToneMap: {
        ID: '{7b0b748d-4610-4486-a90c-999d9a2e2b11}',
        InputMaxLuminance: 0,
        OutputMaxLuminance: 1,
        DisplayMode: 2
    },
    
    WhiteLevelAdjustment: {
        ID: '{44a1cadb-6cdd-4818-8ff4-26c1cfe95bdb}',
        InputWhiteLevel: 0,
        OutputWhiteLevel: 1
    },
    
    // ================================ Composition ========================================
    // https://learn.microsoft.com/en-us/windows/win32/direct2d/built-in-effects#composition

    AlphaMask: {
        ID: '{c80ecff0-3fd5-4f05-8328-c5d1724b4f0a}'
    },

    ArithmeticComposite: {
        ID: '{fc151437-049a-4784-a24a-f1c4daf20987}',
        Coefficients: 0,
        ClampOutput: 1
    },

    Blend: {
        ID: '{81c5b77b-13f8-4cdd-ad20-c890547ac65d}',
        Mode: 0
    },

    Composite: {
        ID: '{48fc9f51-f6ac-48f1-8b58-3b28ac46f76d}',
        Mode: 0
    },

    CrossFade: {
        ID: '{12f575e8-4db1-485f-9a84-03a07dd3829f}',
        Weight: 0
    },

    // ================================== Filter ======================================
    // https://learn.microsoft.com/en-us/windows/win32/direct2d/built-in-effects#filter

    ConvolveMatrix: {
        ID: '{407f8c08-5533-4331-a341-23cc3877843e}',
        KernelUnitLength: 0,
        ScaleMode: 1,
        KernelSizeX: 2,
        KernelSizeY: 3,
        KernelMatrix: 4,
        Divisor: 5,
        Bias: 6,
        KernelOffset: 7,
        PreserveAlpha: 8,
        BorderMode: 9,
        ClampOutput: 10
    },   

    DirectionalBlur: {
        ID: '{174319a6-58e9-49b2-bb63-caf2c811a3db}',
        StandardDeviation: 0,
        Angle: 1,
        Optimization: 2,
        BorderMode: 3
    },

    EdgeDetection: {
        ID: '{EFF583CA-CB07-4AA9-AC5D-2CC44C76460F}',
        Strength: 0,
        BlurRadius: 1,
        Mode: 2,
        OverlayEdges: 3,
        AlphaMode: 4        
    },   

    GaussianBlur: {
        ID: '{1feb6d69-2fe6-4ac9-8c58-1d7f93e7a6a5}',
        StandardDeviation: 0,
        Optimization: 1,
        BorderMode: 2
    },   

    Morphology: {
        ID: '{eae6c40d-626a-4c2d-bfcb-391001abe202}',
        Mode: 0,
        Width: 1,
        Height: 2
    },   

    // ================================== Lighting and Stylizing ======================================
    // https://learn.microsoft.com/en-us/windows/win32/direct2d/built-in-effects#lighting-and-stylizing

    Emboss: {
        ID: '{b1c5eb2b-0348-43f0-8107-4957cacba2ae}',
        Height: 0,
        Direction: 1,
    },

    Posterize: {
        ID: '{2188945e-33a3-4366-b7bc-086bd02d0884}',
        RedValueCount: 0,
        GreenValueCount: 1,
        BlueValueCount: 2
    },

    Shadow: {
        ID: '{C67EA361-1863-4e69-89DB-695D3E9A5B6B}',
        BlurStandardDeviation: 0,
        Color: 1,
        Optimization: 2
    },

    // ================================== Photo ======================================
    // https://learn.microsoft.com/en-us/windows/win32/direct2d/built-in-effects#photo

    Brightness: {
        ID: '{8cea8d1e-77b0-4986-b3b9-2f0c0eae7887}',
        WhitePoint: 0,
        BlackPoint: 1,
    },
    
    Contrast: {
        ID: '{b648a78a-0ed5-4f80-a94a-8e825aca6b77}',
        Contrast: 0,
        ClampInput: 1,
    },

    Exposure: {
        ID: '{b56c8cfa-f634-41ee-bee0-ffa617106004}',
        ExposureValue: 0,
    },

    Grayscale: {
        ID: '{36DDE0EB-3725-42E0-836D-52FB20AEE644}'
    },

    HighlightsShadows: {
        ID: '{CADC8384-323F-4C7E-A361-2E2B24DF6EE4}',
        Highlights: 0,
        Shadows: 1,
        Clarity: 2,
        InputGamma: 3,
        MaskBlurRadius: 4        
    },

    Histogram: {
        ID: '{881db7d0-f7ee-4d4d-a6d2-4697acc66ee8}',
        NumBins: 0,
        ChannelSelect: 1,
        HistogramOutput: 2
    },

    Invert: {
        ID: '{e0c3784d-cb39-4e84-b6fd-6b72f0810263}'
    },

    Sepia: {
        ID: '{3a1af410-5f1d-4dbe-84df-915da79b7153}',
        Intensity: 0,
        AlphaMode: 1,
    },

    Sharpen: {
        ID: '{C9B887CB-C5FF-4DC5-9779-273DCF417C7D}',
        Sharpness: 0,
        Threshold: 1
    },

    Straighten: {
        ID: '{4da47b12-79a3-4fb0-8237-bbc3b2a4de08}',
        Angle: 0,
        MaintainSize: 1,
        ScaleMode: 2
    },

    TemperatureTint: {
        ID: '{89176087-8AF9-4A08-AEB1-895F38DB1766}',
        Temperature: 0,
        Tint: 1
    },

    Vignette: {
        ID: '{c00c40be-5e67-4ca3-95b4-f4b02c115135}',
        Color: 0,
        TransitionSize: 1,
        Strength: 2
    },

    // ================================== Source ======================================
    // https://learn.microsoft.com/en-us/windows/win32/direct2d/built-in-effects#source

    Flood: {
        ID: '{61c23c20-ae69-4d8e-94cf-50078df638f2}',
        Color: 0
    },

    Turbulence: {
        ID: '{CF2BB6AE-889A-4ad7-BA29-A2FD732C9FC9}',
        Offset: 0,
        Size:1 ,
        BaseFrequency: 2,
        NumOctaves: 3,
        Seed: 4,
        Noise: 5,
        Stitchable: 6
    },

    // ================================== Transform ======================================
    // https://learn.microsoft.com/en-us/windows/win32/direct2d/built-in-effects#transform
    
    AffineTransform: {
        ID: '{6AA97485-6354-4cfc-908C-E4A74F62C96C}',
        InterpolationMode: 0,
        BorderMode: 1,
        TransformMatrix: 2,
        Sharpness: 3
    },

    D3DTransform: {
        ID: '{e8467b04-ec61-4b8a-b5de-d4d73debea5a}',
        InterpolationMode: 0,
        BorderMode: 1,
        TransformMatrix: 2
    },

    D3DPerspectiveTransform: {
        ID: '{C2844D0B-3D86-46e7-85BA-526C9240F3FB}',
        InterpolationMode: 0,
        BorderMode: 1,
        Depth: 2,
        PerspectiveOrigin: 3,
        LocalOffset: 4,
        GlobalOffset: 5,
        RotationOrigin: 6,
        Rotation: 7
    },

    Atlas: {
        ID: '{913e2be4-fdcf-4fe2-a5f0-2454f14ff408}',
        InputRect: 0,
        InputPaddingRect: 1
    },

    Border: {
        ID: '{2A2D49C0-4ACF-43c7-8C6A-7C4A27874D27}',
        EdgeModeX: 0,
        EdgeModeY: 1
    },

    Crop: {
        ID: '{E23F7110-0E9A-4324-AF47-6A2C0C46F35B}',
        Rect: 0,
        BorderMode: 1
    },

    Scale: {
        ID: '{9daf9369-3846-4d0e-a44e-0c607934a5d7}',
        Scale: 0,
        CenterPoint: 1,
        InterpolationMode: 2,
        BorderMode: 3,
        Sharpness: 4
    },    

    Tile: {
        ID: '{B0784138-3B76-4bc5-B13B-0FA2AD02659F}',
        Rect: 0
    },

    // ================================== Transparency ======================================
    // https://learn.microsoft.com/en-us/windows/win32/direct2d/built-in-effects#transparency

    ChromaKey: {
        ID: '{74C01F5B-2A0D-408C-88E2-C7A3C7197742}',
        Color: 0,
        Tolerance: 1,
        InvertAlpha: 2,
        Feather: 3
    },
    
    LuminanceToAlpha: {
        ID: '{41251ab7-0beb-46f8-9da7-59e93fcce5de}'
    },

    Opacity: {
        ID: '{811d79a4-de28-4454-8094-c64685f8bd4c}',
        Opacity: 0
    },

    // ================================== Custom ======================================
    // https://learn.microsoft.com/en-us/windows/win32/direct2d/custom-effects

    CustomShader: {
        ID: '{fd4e017c-d9a4-4fb1-ae38-031e3b9cd97e}',
        ShaderCode: 0,
    },

};

/**
 * Specifies the types of properties supported by the Direct2D property interface.<br>
 * Used as return type of {@link D2DEffect#GetPropertyType GetPropertyType}<br>
 * @memberof module:Effects
 * @default
 */
const D2DEffectPropertyType = {
    Unknown: 0,
    String: 1,
    Bool: 2,
    Uint32: 3,
    Int32: 4,
    Float: 5,
    Vector2: 6,
    Vector3: 7,
    Vector4: 8,
    Blob: 9,
    IUnknown: 10,
    Enum: 11,
    Array: 12,
    CLSID: 13,
    Matrix3x2: 14,
    Matrix4x3: 15,
    Matrix4x4: 16,
    Matrix5x4: 17,
    ColorContext: 18
};

/**
 * Used in {@link module:Effects.Effects Effects.Scale}<br>
 * <b>NearestNeighbor</b>: Samples the nearest single point and uses that. This mode uses less processing time, but outputs the lowest quality image.<br>
 * <b>Linear</b>: Uses a four point sample and linear interpolation. This mode uses more processing time than the nearest neighbor mode, but outputs a higher quality image.<br>
 * <b>Cubic</b>: Uses a 16 sample cubic kernel for interpolation. This mode uses the most processing time, but outputs a higher quality image.<br>
 * <b>MultiSampleLinear</b>: Uses 4 linear samples within a single pixel for good edge anti-aliasing. This mode is good for scaling down by small amounts on images with few pixels.<br>
 * <b>Anisotropic</b>: Uses anisotropic filtering to sample a pattern according to the transformed shape of the bitmap.<br>
 * <b>HighQualityCubic</b>: Uses a variable size high quality cubic kernel to perform a pre-downscale the image if downscaling is involved in the transform matrix. Then uses the cubic interpolation mode for the final output.<br>
 * @memberof module:Effects
 * @default
 */
const ScaleInterpolationMode = {
    NearestNeighbor: 0,
    Linear: 1,
    Cubic: 2,
    MultiSampleLinear: 3,
    Anisotropic: 4,
    HighQualityCubic: 5
};

/**
 * Used in {@link module:Effects.Effects Effects.Scale}, {@link module:Effects.Effects Effects.DirectionalBlur}, {@link module:Effects.Effects Effects.GaussianBlur}, {@link module:Effects.Effects Effects.ConvolveMatrix}<br>
 * <b>Soft</b>: The effect pads the input image with transparent black pixels for samples outside of the input bounds when it applies the convolution kernel. This creates a soft edge for the image, and in the process expands the output bitmap by the size of the kernel.<br>
 * <b>Hard</b>: The effect extends the input image with a mirror-type border transform for samples outside of the input bounds. The size of the output bitmap is equal to the size of the input bitmap.
 * @memberof module:Effects
 * @default
 */
const BorderMode = {
    Soft: 0,
    Hard: 1
};

/**
 * Used in {@link module:Effects.Effects Effects.DirectionalBlur}<br>
 * <b>Speed</b>: Applies internal optimizations such as pre-scaling at relatively small radii. Uses linear filtering.<br>
 * <b>Balanced</b>: Uses the same optimization thresholds as Speed mode, but uses trilinear filtering.<br>
 * <b>Quality</b>: Only uses internal optimizations with large blur radii, where approximations are less likely to be visible. Uses trilinear filtering.
 * @memberof module:Effects
 * @default
 */
const DirectionalBlurOptimization = {
    Speed: 0,
    Balanced: 1,
    Quality: 2
};

/**
 * Used in {@link module:Effects.Effects Effects.GaussianBlur}<br>
 * <b>Speed</b>: Applies internal optimizations such as pre-scaling at relatively small radii. Uses linear filtering.<br>
 * <b>Balanced</b>: Uses the same optimization thresholds as Speed mode, but uses trilinear filtering.<br>
 * <b>Quality</b>: Only uses internal optimizations with large blur radii, where approximations are less likely to be visible. Uses trilinear filtering.
 * @memberof module:Effects
 * @default
 */
const GaussianBlurOptimization = {
    Speed: 0,
    Balanced: 1,
    Quality: 2
};

/**
 * Used in {@link module:Effects Effects.Sepia} and {@link module:Effects Effects.EdgeDetection}<br>
 * <b>Unknown</b>: The alpha value might not be meaningful.<br>
 * <b>Premultiplied</b>: The alpha value has been premultiplied. Each color is first scaled by the alpha value. The alpha value itself is the same in both straight and premultiplied alpha. Typically, no color channel value is greater than the alpha channel value. If a color channel value in a premultiplied format is greater than the alpha channel, the standard source-over blending math results in an additive blend.<br>
 * <b>Straight</b>: The alpha value has not been premultiplied. The alpha channel indicates the transparency of the color.<br>
 * <b>Ignore</b>: The alpha value is ignored.
 * @memberof module:Effects
 * @default
 */
const AlphaMode = {
    Unknown: 0,
    Premultiplied: 1,
    Straight: 2,
    Ignore: 3,
};

/**
 * Used in {@link module:Effects Effects.HighlightsShadows}<br>
 * <b>Linear</b>: Indicates the input image is in linear gamma space.<br>
 * <b>SRGB</b>: Indicates the input image is sRGB gamma space.<br>
 * @memberof module:Effects
 * @default
 */
const InputGamma = {
    Linear: 0,
    SRGB: 1
};

/**
 * Used in {@link module:Effects Effects.Histogram}<br>
 * <b>R</b>: The effect generates the histogram output based on the red channel.<br>
 * <b>G</b>: The effect generates the histogram output based on the green channel.<br>
 * <b>B</b>: The effect generates the histogram output based on the blue channel.<br>
 * <b>A</b>: The effect generates the histogram output based on the alpha channel.<br>
 * @memberof module:Effects
 * @default
 */
const ChannelSelector = {
    R: 0,
    G: 1,
    B: 2,
    A: 3
};

/**
 * Used in {@link module:Effects Effects.Straighten}<br>
 * <b>NearestNeighbor</b>: Indicates nearest neighbor interpolation should be used.<br>
 * <b>Linear</b>: Indicates linear interpolation should be used.<br>
 * <b>Cubic</b>: Indicates cubic interpolation should be used.<br>
 * <b>MultisampleLinear</b>: Indicates multi-sample linear interpolation should be used.<br>
 * <b>Anisotropic</b>: Indicates anisotropic filtering should be used.<br>
 * @memberof module:Effects
 * @default
 */
const StraightenScaleMode = {
    NearestNeighbor: 0,
    Linear: 1,
    Cubic: 2,
    MultisampleLinear: 3,
    Anisotropic: 4
};

/**
 * Used in {@link module:Effects.Effects Effects.Scale}<br>
 * <b>NearestNeighbor</b>: Samples the nearest single point and uses that. This mode uses less processing time, but outputs the lowest quality image.<br>
 * <b>Linear</b>: Uses a four point sample and linear interpolation. This mode uses more processing time than the nearest neighbor mode, but outputs a higher quality image.<br>
 * <b>Cubic</b>: Uses a 16 sample cubic kernel for interpolation. This mode uses the most processing time, but outputs a higher quality image.<br>
 * <b>MultiSampleLinear</b>: Uses 4 linear samples within a single pixel for good edge anti-aliasing. This mode is good for scaling down by small amounts on images with few pixels.<br>
 * <b>Anisotropic</b>: Uses anisotropic filtering to sample a pattern according to the transformed shape of the bitmap.<br>
 * <b>HighQualityCubic</b>: Uses a variable size high quality cubic kernel to perform a pre-downscale the image if downscaling is involved in the transform matrix. Then uses the cubic interpolation mode for the final output.<br>
 * @memberof module:Effects
 * @default
 */
const ConvolveMatrixScaleMode = {
    NearestNeighbor: 0,
    Linear: 1,
    Cubic: 2,
    MultiSampleLinear: 3,
    Anisotropic: 4,
    HighQualityCubic: 5
};

/**
 * Used in {@link module:Effects Effects.EdgeDetection}<br>
 * <b>Sobel</b>: Indicates the Sobel operator should be used for edge detection.<br>
 * <b>Prewitt</b>: Indicates the Prewitt operator should be used for edge detection.<br>
 * @memberof module:Effects
 * @default
 */
const EdgeDetectionMode = {
    Sobel: 0,
    Prewitt: 1
};

/**
 * Used in {@link module:Effects Effects.Morphology}<br>
 * <b>Erode</b>: The minimum value from each RGB channel in the kernel is used.<br>
 * <b>Dilate</b>: The maximum value from each RGB channel in the kernel is used.<br>
 * @memberof module:Effects
 * @default
 */
const MorphologyMode = {
    Erode: 0,
    Dilate: 1
};

/**
 * Used in {@link module:Effects.Effects Effects.AffineTransform}<br>
 * <b>NearestNeighbor</b>: Samples the nearest single point and uses that. This mode uses less processing time, but outputs the lowest quality image.<br>
 * <b>Linear</b>: Uses a four point sample and linear interpolation. This mode uses more processing time than the nearest neighbor mode, but outputs a higher quality image.<br>
 * <b>Cubic</b>: Uses a 16 sample cubic kernel for interpolation. This mode uses the most processing time, but outputs a higher quality image.<br>
 * <b>MultiSampleLinear</b>: Uses 4 linear samples within a single pixel for good edge anti-aliasing. This mode is good for scaling down by small amounts on images with few pixels.<br>
 * <b>Anisotropic</b>: Uses anisotropic filtering to sample a pattern according to the transformed shape of the bitmap.<br>
 * <b>HighQualityCubic</b>: Uses a variable size high quality cubic kernel to perform a pre-downscale the image if downscaling is involved in the transform matrix. Then uses the cubic interpolation mode for the final output.<br>
 * @memberof module:Effects
 * @default
 */
const D2DAffinetransformInterpolationMode = {
    NearestNeighbor: 0,
    Linear: 1,
    Cubic: 2,
    MultiSampleLinear: 3,
    Anisotropic: 4,
    HighQualityCubic: 5
};

/**
 * Used in {@link module:Effects.Effects Effects.D3DTransform}<br>
 * <b>NearestNeighbor</b>: Samples the nearest single point and uses that. This mode uses less processing time, but outputs the lowest quality image.<br>
 * <b>Linear</b>: Uses a four point sample and linear interpolation. This mode uses more processing time than the nearest neighbor mode, but outputs a higher quality image.<br>
 * <b>Cubic</b>: Uses a 16 sample cubic kernel for interpolation. This mode uses the most processing time, but outputs a higher quality image.<br>
 * <b>MultiSampleLinear</b>: Uses 4 linear samples within a single pixel for good edge anti-aliasing. This mode is good for scaling down by small amounts on images with few pixels.<br>
 * <b>Anisotropic</b>: Uses anisotropic filtering to sample a pattern according to the transformed shape of the bitmap.<br>
 * @memberof module:Effects
 * @default
 */
const D3DTransformInterpolationMode = {
    NearestNeighbor: 0,
    Linear: 1,
    Cubic: 2,
    MultiSampleLinear: 3,
    Anisotropic: 4
};

/**
 * Used in {@link module:Effects.Effects Effects.D3DPerspectiveTransform}<br>
 * <b>NearestNeighbor</b>: Samples the nearest single point and uses that. This mode uses less processing time, but outputs the lowest quality image.<br>
 * <b>Linear</b>: Uses a four point sample and linear interpolation. This mode uses more processing time than the nearest neighbor mode, but outputs a higher quality image.<br>
 * <b>Cubic</b>: Uses a 16 sample cubic kernel for interpolation. This mode uses the most processing time, but outputs a higher quality image.<br>
 * <b>MultiSampleLinear</b>: Uses 4 linear samples within a single pixel for good edge anti-aliasing. This mode is good for scaling down by small amounts on images with few pixels.<br>
 * <b>Anisotropic</b>: Uses anisotropic filtering to sample a pattern according to the transformed shape of the bitmap.<br>
 * @memberof module:Effects
 * @default
 */
const D3DPerspectiveTransformInterpolationMode = {
    NearestNeighbor: 0,
    Linear: 1,
    Cubic: 2,
    MultiSampleLinear: 3,
    Anisotropic: 4
};

/**
 * Used in {@link module:Effects.Effects Effects.Border}<br>
 * <b>Clamp</b>: Repeats the pixels from the edges of the image.<br>
 * <b>Wrap</b>: Uses pixels from the opposite end edge of the image.<br>
 * <b>Mirror</b>: Reflects pixels about the edge of the image.<br>
 * @memberof module:Effects
 * @default
 */
const BorderEdgeMode = {
    Clamp: 0,
    Wrap: 1,
    Mirror: 2
};

/**
 * Used in {@link module:Effects.Effects Effects.Blend}<br>
 * For blend modes description see: {@link https://learn.microsoft.com/en-us/windows/win32/direct2d/blend#blend-modes}
 * @memberof module:Effects
 * @default
 */
const BlendMode = {
    Multiply: 0,
    Screen: 1,
    Darken: 2,
    Lighten: 3,
    Dissolve: 4,
    Burn: 5,
    LinearBurn: 6,
    DarkerColor: 7,
    LighterColor: 8,
    ColorDodge: 9,
    LinearDodge: 10,
    Overlay: 11,
    SoftLight: 12,
    HardLight: 13,
    VividLight: 14,
    LinearLight: 15,
    PinLight: 16,
    HardMix: 17,
    Difference: 18,
    Exclusion: 19,
    Hue: 20,
    Saturation: 21,
    Color: 22,
    Luminosity: 23,
    Subtract: 24,
    Division: 25
};

/**
 * Used in {@link module:Effects.Effects Effects.Shadow}<br>
 * <b>Speed</b>: Applies internal optimizations such as pre-scaling at relatively small radii. Uses linear filtering.<br>
 * <b>Balanced</b>: Uses the same optimization thresholds as Speed mode, but uses trilinear filtering.<br>
 * <b>Quality</b>: Only uses internal optimizations with large blur radii, where approximations are less likely to be visible. Uses trilinear filtering.
 * @memberof module:Effects
 * @default
 */
const ShadowOptimization = {
    Speed: 0,
    Balanced: 1,
    Quality: 2
};

/**
 * Used in {@link module:Effects Effects.ColorMatrix}<br>
 * <b>Unknown</b>: The alpha value might not be meaningful.<br>
 * <b>Premultiplied</b>: The alpha value has been premultiplied. Each color is first scaled by the alpha value. The alpha value itself is the same in both straight and premultiplied alpha. Typically, no color channel value is greater than the alpha channel value. If a color channel value in a premultiplied format is greater than the alpha channel, the standard source-over blending math results in an additive blend.<br>
 * <b>Straight</b>: The alpha value has not been premultiplied. The alpha channel indicates the transparency of the color.<br>
 * <b>Ignore</b>: The alpha value is ignored.
 * @memberof module:Effects
 * @default
 */
const ColorMatrixAlphaMode = {
    Unknown: 0,
    Premultiplied: 1,
    Straight: 2,
    Ignore: 3,
};

/**
 * Used in {@link module:Effects Effects.HdrToneMap}<br>
 * <b>SDR</b>: Specifies that the tone mapper algorithm be optimized for best appearance on a standard dynamic range (SDR) display.<br>
 * <b>HDR</b>: Specifies that the tone mapper algorithm be optimized for best appearance on a high dynamic range (HDR) display.<br>
 * @memberof module:Effects
 * @default
 */
const HdrToneMapDisplayMode = {
    SDR: 0,
    HDR: 1
};

/**
 * Used in {@link module:Effects Effects.TurbulenceNoise}<br>
 * <b>FractalSum</b>: Computes a sum of the octaves, shifting the output range from [-1, 1], to [0, 1].<br>
 * <b>Turbulence</b>: Computes a sum of the absolute value of each octave.<br>
 * @memberof module:Effects
 * @default
 */
const TurbulenceNoise = {
    FractalSum: 0,
    Turbulence: 1
};
