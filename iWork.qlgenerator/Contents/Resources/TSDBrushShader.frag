#version 100

precision highp float;

uniform sampler2D uTexture;
uniform mediump vec4 uColor;
uniform float DrawParameterized;
uniform float uStrokeEnd;

varying mediump vec2 vTexCoord;
varying mediump vec2 vClampedTexCoords;
varying highp float vPercent;

vec4 EncodeFloatRGBA(float v) {
    vec3 enc = vec3(1.0, 255.0, 65025.0) * v;
    enc = fract(enc);
    enc -= enc.yzz * vec3(1.0/255.0, 1.0/255.0, 1.0/255.0);
    
    return vec4(enc,1);
}
float DecodeFloatRGBA( vec4 rgba ) {
    return dot( rgba, vec4(1.0, 1.0/255.0, 1.0/65025.0, 0.0) );
}

void main()
{
    vec4 color = uColor*texture2D(uTexture, vTexCoord).r;
    color = (vClampedTexCoords.x <= vTexCoord.y && vTexCoord.y <= vClampedTexCoords.y) ? color : vec4(0);
    color = vPercent < uStrokeEnd ? color : vec4(0);

    vec4 parameterizedColor = color.a < 0.01 ? vec4(0) : EncodeFloatRGBA(vPercent);
    
    gl_FragColor = (DrawParameterized < 0.5) ? color : parameterizedColor;
}
