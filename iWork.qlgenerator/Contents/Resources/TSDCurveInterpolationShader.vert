//
//  TSDCurveInterpolationShader.vert
//
//  Copyright (c) 2012-2013 Apple Inc. All rights reserved.
//
#version 100

attribute vec2 Position;
attribute vec2 TexCoord;

uniform mat4 MVPMatrix;
uniform mat4 FragCoordMatrix;
varying vec4 VTexCoord;

void main()
{
    gl_Position = MVPMatrix * vec4(Position, 0.0, 1.0);
    VTexCoord = FragCoordMatrix * gl_Position;  // translate the position to go from [0,1] instead of [-1,1]
}
