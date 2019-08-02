//
//  TSDAlphaExtractShader.frag
//
//  Copyright (c) 2012-2013 Apple Inc. All rights reserved.
//
#version 100
precision mediump float;

uniform sampler2D Texture;
uniform vec2 TextureSize;   // this is really 1/size

void main()
{
    // gl_FragCoord goes from [0,size]
    vec4 color = texture2D(Texture, gl_FragCoord.xy*TextureSize);
    gl_FragColor = color.aaaa;
}
