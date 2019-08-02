//
//  TSDCurvedShader.frag
//
//  Copyright (c) 2012-2013 Apple Inc. All rights reserved.
//
#version 100

precision mediump float;

uniform sampler2D Texture;
uniform vec2 TextureSize;   // this is really 1/size

uniform float CurvedShadowCurve;  // goes from [-1,1]
uniform float CurvedShadowPadding;

void main()
{
    // gl_FragCoord goes from [0,size]
	float halfWidth = 0.5;
	
	vec2 coord = gl_FragCoord.xy*TextureSize;
    
    // fragCoord.x goes from [0-1] but since we have padding we really vary from [padding,1-padding]
	float boundsWithoutPadding = (gl_FragCoord.x-CurvedShadowPadding)*1.0/(1.0/TextureSize.x-CurvedShadowPadding*2.0);
	float curveOffset = boundsWithoutPadding-halfWidth;
	// make a different shaped parabola, based on curve level
    float curve = CurvedShadowCurve;
	curveOffset = (curveOffset*curveOffset) * curve;
    
    
	vec4 sampled_color = texture2D(Texture, coord + vec2(0,curveOffset*150.0*TextureSize.y));
	gl_FragColor = sampled_color;    
}
