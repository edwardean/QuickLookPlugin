//
//  TSDCurveInterpolationShader.frag
//
//  Copyright (c) 2012-2013 Apple Inc. All rights reserved.
//
#version 100

precision mediump float;

uniform sampler2D Texture;  // most blurred 
uniform vec2 TextureSize;   // this is really 1/size
uniform sampler2D Texture2; // half blurred
uniform sampler2D Texture3; // not blurred

uniform float CurvedShadowCurve;
uniform float CurvedShadowPadding;

varying vec4 VTexCoord;

void main()
{
    // gl_FragCoord goes from [0,size]
    // make coord go from [0,1]
	vec2 coord = gl_FragCoord.xy*TextureSize;
    vec4 finalColor;

    vec4 blurred = texture2D(Texture, VTexCoord.xy);
    vec4 halfBlurred = texture2D(Texture2, VTexCoord.xy);
    vec4 notBlurred = texture2D(Texture3, VTexCoord.xy);
    
    vec4 blendA[7];
    vec4 blendB[7];
    
    // Now we set which strips blur with which textures
    // This changes based on the curve, but we set the textures in the
    // right position before it goes through the shader
    // In the code, the variables refer to 'curl from edges', with blurred in the center
    // and crisp on the edges. The other curl type will have the opposite effect,
    // crisp in the middle and blurred on the edges (but this is all set in TSDGLCurvedShadow)
    
    // GLSL doesn't support array initialization like this
    // but this is way easier to read/understand what's blending with what
    // so keep this code here for readability/if we ever move to later versions of GLSL
    //blendA = vec4[](notBlurred, notBlurred, halfBlurred, blurred,     blurred, halfBlurred, notBlurred);
    //blendB = vec4[](notBlurred, halfBlurred,    blurred, blurred, halfBlurred,  notBlurred, notBlurred);
    
    // blurred in the center, crisp on the edges
    blendA[0] = blendA[1] = blendA[6] = notBlurred;
    blendA[2] = blendA[5] = halfBlurred;
    blendA[3] = blendA[4] = blurred;
    
    blendB[0] = blendB[5] = blendB[6] = notBlurred;
    blendB[1] = blendB[4] = halfBlurred;
    blendB[2] = blendB[3] = blurred;

    // we can't interpolate from 0 to 1 because of the padding for the blur
    float blurPadding = CurvedShadowPadding;  // our blur padding is set to 30
    float paddingPercentage = blurPadding*TextureSize.x;  // find what percentage of the texture is taken up by the blur padding
    // our "size" is no longer 1.0 (texture goes from 0-1) because of the padding
    float sizeWithoutPadding = 1.0-2.0*paddingPercentage;
    float slice = sizeWithoutPadding/12.0;
    
    int index = 0;
    // start at -slice instead of 0 because between [0,first slice] we want it to be just the blurred texture
    // and we don't start interpolating until the next slice- this gives us 7 slices (as opposed to 6)
    for (float i = -slice+paddingPercentage; i < (1.0-paddingPercentage); i = i+(2.0*slice)) {
        if (coord.x >= i && coord.x <= i+(2.0*slice)) {
            // coord.x-i takes the distance from the center of the slice will range from [0,2*slice]
            // *(1/(slice*2)) calibrates this distance to go from [0,1]
            float interp = (coord.x-i)* (1.0/slice) * 0.5;
            
            // now blend the appropriate textures by this interpolation factor
            finalColor = mix(blendA[index], blendB[index], interp);
        }
        index++;
    }
    
    // deal with the edges that are in the boundaries of the blur padding
    if (coord.x < paddingPercentage || coord.x > (1.0-paddingPercentage)) {
        finalColor = blendA[0];
    }
    
    // vary the alpha based on distance from center/curvature
    const float alphaDampening = 0.5;
    // our span is from [paddingPercentage,1-paddingPercentage] but we want it to go from [0,1]
    float paddedCoord = (1.0/(1.0-2.0*paddingPercentage))*(coord.x-paddingPercentage);
    float distance = abs(paddedCoord-0.5)*2.0;
    if (CurvedShadowCurve > 0.0) {
        // from center to edges, alpha ranges from [.5*alpha, alpha]
        finalColor.a = ((distance*(1.0-alphaDampening)) + alphaDampening) * finalColor.a;
    } else {
        // from center to edges, alpha ranges from [1, .5*alpha]
        finalColor.a = ((distance*(alphaDampening-1.0)) + 1.0 ) * finalColor.a;
    }

	gl_FragColor = finalColor;
}
