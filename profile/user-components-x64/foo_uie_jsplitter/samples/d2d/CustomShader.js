"use strict";

include(`${fb.ComponentPath}\\docs\\Effects.js`);

window.DrawMode = 1;

// Simple colour inversion shader
const shaderSource = `
    // Input texture (Direct2D passed it into t0)
    Texture2D InputTexture : register(t0);
    SamplerState InputSampler : register(s0);

    // Direct2D input data structure
    struct VS_OUTPUT {
        float4 clipSpacePos : SV_POSITION;
        float4 sceneSpacePos : SCENE_POS;
        float4 texelSpacePos : TEXEL_POS;
    };

    // Simple color inversion shader
    float4 main(VS_OUTPUT input) : SV_Target
    {
        // Selecting a pixel from an input image
        float4 color = InputTexture.Sample(InputSampler, input.texelSpacePos.xy);
	
        // Invert RGB, keep alpha
        return float4(1.0 - color.rgb, color.a) * color.a;
    }
`;

const img = d2d.Image(`${fb.ComponentPath}\\samples\\d2d\\images\\Flowers.jpg`);
const effect = d2d.Effect(Effects.CustomShader.ID);
effect.SetInput(0, img);

const shaderCode = d2d.Compile(shaderSource);
if (shaderCode.Error !== "") 
    fb.ShowPopupMessage(shaderCode.Error, "Direct2D compile error!");
else
    effect.SetValue(Effects.CustomShader.ShaderCode, shaderCode.Code);

function on_paint(dgr) {	
    dgr.DrawEffect(effect, 10, 10, 0, 0, img.Width, img.Height);
}
