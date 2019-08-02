#version 100

attribute vec4 position;
attribute vec2 texCoord;
attribute vec2 clampedTexCoords;
attribute float percent;

uniform mat4 uTransform;

varying vec2 vTexCoord;
varying vec2 vClampedTexCoords;
varying float vPercent;

void main()
{
    vPercent = percent;
    vTexCoord = texCoord;
    vClampedTexCoords = clampedTexCoords;
    gl_Position = uTransform * position;
}