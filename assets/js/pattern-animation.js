function loadNoisePattern($id, $color, $x, $y){
const vs = `
attribute vec4 position;
void main()	{
  gl_Position = position;
}
`;
const userShader = `

// Variable to a keep a copy of the noise value prior to palettization. Used to run a soft gradient 
// over the surface, just to break things up a little.
float ns;


//float sFract(float x, float sm){ float fx = fract(x); return fx - smoothstep(fwidth(x)*sm, 0., 1. - fx); }
//float sFract(float x, float sm){ float fx = fract(x); return min(fx, fx*(1. - fx)/fwidth(x)/sm); }

// Based on Ollj's smooth "fract" formula.
float sFract(float x, float sm){
    
    // Extra smoothing factor. "1" is the norm.
    const float sf = 1.; 
    
    // The hardware "fwidth" is cheap, but you could take the expensive route and
    // calculate it by hand if more quality was required.
    vec2 u = vec2(x, fwidth(x)*sf*sm);
    
    // Ollj's original formula with a transcendental term omitted.
    u.x = fract(u.x);
    u += (1. - 2.*u)*step(u.y, u.x);
    return clamp(1. - u.x/u.y, 0., 1.); // Cos term ommitted.
}



// Only correct for nonnegative values, but in this example, numbers aren't negative.
float sFloor(float x){ return x - sFract(x, 1.); } 

// Standard hue rotation formula with a bit of streamlining. 
vec3 rotHue(vec3 p, float a){

    vec2 cs = sin(vec2(1.570796, 0) + a);

    mat3 hr = mat3(0.299,  0.587,  0.114,  0.299,  0.587,  0.114,  0.299,  0.587,  0.114) +
        	  mat3(0.701, -0.587, -0.114, -0.299,  0.413, -0.114, -0.300, -0.588,  0.886) * cs.x +
        	  mat3(0.168,  0.330, -0.497, -0.328,  0.035,  0.292,  1.250, -1.050, -0.203) * cs.y;
							 
    return clamp(p*hr, 0., 1.);
}


/*
// Fabrices concise, 2D rotation formula.
mat2 r2(float th){ vec2 a = sin(vec2(1.5707963, 0) + th); return mat2(a, -a.y, a.x); }

// Dave's hash function. More reliable with large values, but will still eventually break down.
//
// Hash without Sine
// Creative Commons Attribution-ShareAlike 4.0 International Public License
// Created by David Hoskins.
// vec3 to vec3.
vec3 hash33(vec3 p){

	p = fract(p * vec3(.1031, .1030, .0973));
    p += dot(p, p.yxz + 19.19);
    p = fract((p.xxy + p.yxx)*p.zyx)*2. - 1.;
    return p;
    
    // Note the "mod" call. Slower, but ensures accuracy with large time values.
    //mat2  m = r2(mod(iGlobalTime*2., 6.2831853));	
	//p.xy = m * p.xy;//rotate gradient vector
    //p.yz = m * p.yz;//rotate gradient vector
    //p.xz = m * p.xz;//rotate gradient vector
    
    //mat3 m = r3(mod(iGlobalTime*2., 6.2831853));	
    //vec3 th = mod(vec3(.31, .53, .97) + iGlobalTime*2., 6.2831853);
    //mat3 m = r3(th.x, th.y, th.z);
    //p *= m;
	return p;

}
*/

// vec3 to vec3 hash algorithm.
vec3 hash33(vec3 p) { 

    // Faster, but doesn't disperse things quite as nicely as the block below it. However, when framerate
    // is an issue, and it often is, this is the one to use. Basically, it's a tweaked amalgamation I put
    // together, based on a couple of other random algorithms I've seen around... so use it with caution,
    // because I make a tonne of mistakes. :)
    float n = sin(dot(p, vec3(7, 157, 113)));    
    return fract(vec3(2097152, 262144, 32768)*n)*2. - 1.; // return fract(vec3(64, 8, 1)*32768.0*n)*2.-1.; 

    // I'll assume the following came from IQ.
    //p = vec3( dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
    //return (fract(sin(p)*43758.5453)*2. - 1.);

}



// Cheap, streamlined 3D Simplex noise... of sorts. I cut a few corners, so it's not perfect, but it's
// artifact free and does the job. I gave it a different name, so that it wouldn't be mistaken for
// the real thing.
// 
// Credits: Ken Perlin, the inventor of Simplex noise, of course. Stefan Gustavson's paper - 
// "Simplex Noise Demystified," IQ, other "ShaderToy.com" people, etc.
float tetraNoise(in vec3 p)
{
    // Skewing the cubic grid, then determining the first vertice and fractional position.
    vec3 i = floor(p + dot(p, vec3(.333333)) );  p -= i - dot(i, vec3(.166666)) ;
    
    // Breaking the skewed cube into tetrahedra with partitioning planes, then determining which side of the 
    // intersecting planes the skewed point is on. Ie: Determining which tetrahedron the point is in.
    vec3 i1 = step(p.yzx, p), i2 = max(i1, 1. - i1.zxy); i1 = min(i1, 1. - i1.zxy);    
    
    // Using the above to calculate the other three vertices -- Now we have all four tetrahedral vertices.
    // Technically, these are the vectors from "p" to the vertices, but you know what I mean. :)
    vec3 p1 = p - i1 + .166666, p2 = p - i2 + .333333, p3 = p - .5;
  

    // 3D simplex falloff - based on the squared distance from the fractional position "p" within the 
    // tetrahedron to the four vertice points of the tetrahedron. 
    vec4 v = max(.5 - vec4(dot(p, p), dot(p1, p1), dot(p2, p2), dot(p3, p3)), 0.);
    
    // Dotting the fractional position with a random vector, generated for each corner, in order to determine 
    // the weighted contribution distribution... Kind of. Just for the record, you can do a non-gradient, value 
    // version that works almost as well.
    vec4 d = vec4(dot(p, hash33(i)), dot(p1, hash33(i + i1)), dot(p2, hash33(i + i2)), dot(p3, hash33(i + 1.)));
     
     
    // Simplex noise... Not really, but close enough. :)
    return clamp(dot(d, v*v*v*8.)*1.732 + .8, 0., 1.); // Not sure if clamping is necessary. Might be overkill.

}


// The function value. In this case, slightly-tapered, quantized Simplex noise.
float func(vec2 p){
    
    // The noise value.
    float n = tetraNoise(vec3(p.x*${$x}., p.y*${$y}., 0) - vec3(0, .25, .5)*(iGlobalTime * 0.03));
    
    // A tapering function, similar in principle to a smooth combine. Used to mutate or shape 
    // the value above. This one tapers it off into an oval shape and punches in a few extra holes.
    // Airtight uses a more interesting triangular version in his "Cartoon Fire" shader.
    float taper = .001 + dot(p, p*vec2(.35, 1));
	n = max(n - taper, 0.)/max(1. - taper, .0001);
    
    // Saving the noise value prior to palettization. Used for a bit of gradient highlighting.
    ns = n; 
    
    // I remember reasoning to myself that the following would take a continuous function ranging
    // from zero to one, then palettize it over "palNum" discreet values between zero and one
    // inclusive. It seems to work, but if my logic is lacking (and it often is), feel free to 
    // let me know. :)
    const float palNum = 10.; 
    // The range should strictly fall between zero and one, but for some crazy reason, numbers fall
    // outside the range, so I've had to clamp it. I know the computer is never wrong, so I'm 
    // probably overlooking something. Having said that, I don't trust the GPU "fract" function much.
    //return clamp(sFloor(n*(palNum - .001))/(palNum - 1.), 0., 1.);
    return n*.0 + clamp(sFloor(n*(palNum - .001))/(palNum - 1.), 0., 1.)*1.;
    
}

/**
 * Convert r, g, b to normalized vec3
 */
vec3 rgb(float r, float g, float b) {
	return vec3(r / 255.0, g / 255.0, b / 255.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord){

    // Screen coordinates.
	vec2 u = (fragCoord.xy - iResolution.xy*.5)/iResolution.y;
    
    // Function value.
    float f = func(u);
    float ssd = ns; // Saving the unpalettized noise value to add a little gradient to the color, etc.
    
    // Four sample values around the original. Used for edging and highlighting.
    vec2 e = vec2(1./iResolution.y, 0);
    float fxl = func(u + e.xy);
    float fxr = func(u - e.xy);
    float fyt = func(u + e.yx);
    float fyb = func(u - e.yx);
    
    // Colorizing the function value, and applying some hue rotation based on position.
    // Most of it was made up.
    vec3 col = ${$color}; //orange color
    // col = rotHue(col, -.25+.4*length(u));

    // Applying the dark edges.
    col *= max(1. - (abs(fxl - fxr) + abs(fyt - fyb))*5., 0.);
    //col *= max(1. - length(vec2(fxl, fyt) - vec2(fxr, fyb))*7., 0.);
    // Resampling with a slightly larger spread to provide some highlighting.
    //fxl = func(u + e.xy*1.5);
    //fyt = func(u + e.yx*1.5);
    //col += vec3(.5, .7, 1)*(max(f - fyt, 0.) + max(f - fxl, 0.))*ssd*10.;
    
    // Subtle, bluish vignette.
    //u = fragCoord/iResolution.xy;
    //col = mix(vec3(0, .1, 1), col, pow( 16.0*u.x*u.y*(1.0-u.x)*(1.0-u.y) , .125)*.15 + .85);

 	
    // Rough gamma correction.
    fragColor = vec4(col, 1);
    
}
`;

// FROM shadertoy.com 
const shadertoyBoilerplate = `
#extension GL_OES_standard_derivatives : enable
//#extension GL_EXT_shader_texture_lod : enable
#ifdef GL_ES
precision highp float;
#endif
uniform vec3      iResolution;
uniform float     iGlobalTime;
uniform float     iChannelTime[4];
uniform vec4      iMouse;
uniform vec4      iDate;
uniform float     iSampleRate;
uniform vec3      iChannelResolution[4];
uniform int       iFrame;
uniform float     iTimeDelta;

${userShader}

void main( void ){
  vec4 color = vec4(0.0,0.0,0.0,1.0);
  mainImage( color, gl_FragCoord.xy );
  color.w = 1.0;
  gl_FragColor = color;
}
`;

const $ = document.querySelector.bind(document);

const camera = new THREE.Camera();
camera.position.z = 1;

const scene = new THREE.Scene();

const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
  -1, -1, 
   1, -1, 
  -1,  1, 
  -1,  1, 
   1, -1, 
   1,  1, 
]);
geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 2 ) );

const uniforms = {
  iGlobalTime: { type: "f", value: 1.0 },
  iResolution: { type: "v3", value: new THREE.Vector3() },
};

const material = new THREE.RawShaderMaterial({
  uniforms: uniforms,
  vertexShader: vs,
  fragmentShader: shadertoyBoilerplate,
});

var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

var orangeCanvas = document.getElementById($id);
var renderer = new THREE.WebGLRenderer({antialias: true, canvas: orangeCanvas});
orangeCanvas.innerHTML = renderer.domElement;


resize(true);
render(0);

function resize(force) {
  var canvas = renderer.domElement;
  var dpr    = window.devicePixelRatio; //window.devicePixelRatio;  // make 1 or less if too slow
  var width  = canvas.clientWidth  * dpr;
  var height = canvas.clientHeight * dpr;
  if (force || width != canvas.width || height != canvas.height) {
    renderer.setSize( width, height, false );
    uniforms.iResolution.value.x = renderer.domElement.width;
    uniforms.iResolution.value.y = renderer.domElement.height;
  }
}

function render(time) {
  resize();
  uniforms.iGlobalTime.value = time * 0.001;
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
}