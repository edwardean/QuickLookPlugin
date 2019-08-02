//
//  TSDAlphaExtractShader.vert
//
//  Copyright (c) 2012-2013 Apple Inc. All rights reserved.
//
#version 100

attribute vec2 Position;
attribute vec2 TexCoord;

uniform mat4 MVPMatrix;

void main()
{
    gl_Position = MVPMatrix * vec4(Position, 0.0, 1.0);
}
