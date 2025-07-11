import * as THREE from "https://cdn.skypack.dev/three@0.124.0";

// Wave cloth shader vertex code
const waveClothVertexShader = `
#define GLSLIFY 1
// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
float hash(float n){return fract(sin(n)*1e4);}
float hash(vec2 p){return fract(1e4*sin(17.*p.x+p.y*.1)*(.1+abs(sin(p.y*13.+p.x))));}
  
float noise(float x){
 float i=floor(x);
 float f=fract(x);
 float u=f*f*(3.-2.*f);
 return mix(hash(i),hash(i+1.),u);
}
  
float noise(vec2 x){
 vec2 i=floor(x);
 vec2 f=fract(x);
  
 // Four corners in 2D of a tile
 float a=hash(i);
 float b=hash(i+vec2(1.,0.));
 float c=hash(i+vec2(0.,1.));
 float d=hash(i+vec2(1.,1.));
  
 // Simple 2D lerp using smoothstep envelope between the values.
 // return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),
 // mix(c, d, smoothstep(0.0, 1.0, f.x)),
 // smoothstep(0.0, 1.0, f.y)));
  
 // Same code, with the clamps in smoothstep and common subexpressions
 // optimized away.
 vec2 u=f*f*(3.-2.*f);
 return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
}

// This one has non-ideal tiling properties that I'm still tuning
float noise(vec3 x){
 const vec3 step=vec3(110,241,171);
  
 vec3 i=floor(x);
 vec3 f=fract(x);
  
 // For performance, compute the base input to a 1D hash from the integer part of the argument and the
 // incremental change to the 1D based on the 3D -> 1D wrapping
 float n=dot(i,step);
  
 vec3 u=f*f*(3.-2.*f);
 return mix(mix(mix(hash(n+dot(step,vec3(0,0,0))),hash(n+dot(step,vec3(1,0,0))),u.x),
 mix(hash(n+dot(step,vec3(0,1,0))),hash(n+dot(step,vec3(1,1,0))),u.x),u.y),
 mix(mix(hash(n+dot(step,vec3(0,0,1))),hash(n+dot(step,vec3(1,0,1))),u.x),
 mix(hash(n+dot(step,vec3(0,1,1))),hash(n+dot(step,vec3(1,1,1))),u.x),u.y),u.z);
}
  
uniform float uTime;
  
varying vec2 vUv;
varying vec3 vPosition;
  
float xmbNoise(vec3 x){
 return cos(x.z*1.5)*cos(x.z+uTime/10.+x.x*0.4); // Adjusted frequency for wider waves
}
  
void main(){
 vec3 p=vec3(position.x,0.,position.y);
   // noise wave
 p.y=xmbNoise(p)/5.0; // Increased wave amplitude
  
 // distort
 vec3 p2=p;
 p2.x-=uTime/5.;
 p2.x/=2.0; // Decreased division factor for wider waves
 p2.y-=uTime/100.;
 p2.z-=uTime/10.;
 p.y-=noise(p2*4.0)/10.0+cos(p.x*1.5-uTime/2.)/4.0-.3; // Adjusted parameters for larger waves
 p.z-=noise(p2*4.0)/10.0; // Adjusted noise frequency
  
 // vec4 modelPosition=modelMatrix*vec4(position,1.);
 vec4 modelPosition=modelMatrix*vec4(p,1.);
 vec4 viewPosition=viewMatrix*modelPosition;
 vec4 projectedPosition=projectionMatrix*viewPosition;
 gl_Position=projectedPosition;
  
 vUv=uv;
 vPosition=p;
}`;

// Wave cloth shader fragment code
const waveClothFragmentShader = `
#define GLSLIFY 1
// https://community.khronos.org/t/getting-the-normal-with-dfdx-and-dfdy/70177
vec3 computeNormal(vec3 normal){
 vec3 X=dFdx(normal);
 vec3 Y=dFdy(normal);
 vec3 cNormal=normalize(cross(X,Y));
 return cNormal;
}
  
// https://www.shadertoy.com/view/4scSW4
float fresnel(float bias,float scale,float power,vec3 I,vec3 N)
{
 return bias+scale*pow(1.+dot(I,N),power);
}
  
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
  
varying vec2 vUv;
varying vec3 vPosition;
  
void main(){
 // Frutiger Aero colors - teal/blue palette
 vec3 color1 = vec3(0.0, 0.7, 1.0);  // Light blue
 vec3 color2 = vec3(0.0, 0.53, 0.8); // Medium blue
 vec3 color3 = vec3(0.0, 0.3, 0.6);  // Dark blue
 vec3 color4 = vec3(0.0, 0.75, 0.75); // Teal
 
 // Use position for color variation
 float colorMix1 = sin(vPosition.x * 2.0 + uTime * 0.1) * 0.5 + 0.5;
 float colorMix2 = cos(vPosition.z * 3.0 + uTime * 0.15) * 0.5 + 0.5;
 
 vec3 colorA = mix(color1, color2, colorMix1);
 vec3 colorB = mix(color3, color4, colorMix2);
 vec3 color = mix(colorA, colorB, sin(uTime * 0.05) * 0.5 + 0.5);
  
 // alpha
 vec3 cNormal=computeNormal(vPosition);
 vec3 eyeVector=vec3(0.,0.,-1.);
 float F=fresnel(0.,.5,4.,eyeVector,cNormal);
 float alpha=F*.5;
  
 gl_FragColor=vec4(color,alpha);
}`;

const calcAspect = (el) => el.clientWidth / el.clientHeight;

const getNormalizedMousePos = (e) => {
  return {
    x: (e.clientX / window.innerWidth) * 2 - 1,
    y: -(e.clientY / window.innerHeight) * 2 + 1
  };
};

class WaveBackground {
  constructor(selector) {
    this.container = document.querySelector(selector);
    this.clock = new THREE.Clock();
    this.scene = new THREE.Scene();    
    this.cameraPosition = new THREE.Vector3(0, 0.25, 2);
    this.lookAtPoint = new THREE.Vector3(0, 0.25, 0);
    
    // Performance optimization flags
    this.isLowPowerMode = this.checkLowPowerMode();
    this.frameCount = 0;
    this.targetFPS = 60;
    this.fpsInterval = 1000 / this.targetFPS;
    this.lastTime = performance.now();
    
    this.init();
  }
  
  checkLowPowerMode() {
    // Check for mobile devices or low-end hardware
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency <= 4;
    return isMobile || isLowEnd;
  }
  
  init() {
    this.createOrthographicCamera();
    this.createRenderer();
    this.createWaveClothMaterial();
    this.createPlane();
    this.addListeners();
    this.setLoop();
  }

  createOrthographicCamera() {
    const aspect = calcAspect(this.container);
    const zoom = 0.5;
    const camera = new THREE.OrthographicCamera(
      -zoom * aspect,
      zoom * aspect,
      zoom,
      -zoom,
      -100,
      1000
    );
    camera.position.copy(this.cameraPosition);
    camera.lookAt(this.lookAtPoint);
    this.camera = camera;
  }

  createRenderer() {
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !this.isLowPowerMode, // Disable antialiasing on low-end devices
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Optimize renderer settings
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio
    
    const canvas = renderer.domElement;
    canvas.style.position = 'fixed';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    
    this.container.appendChild(renderer.domElement);
    this.renderer = renderer;
    this.resizeRendererToDisplaySize();
  }
  resizeRendererToDisplaySize() {
    const { renderer } = this;
    if (!renderer) {
      return;
    }
    
    // Set to actual window dimensions
    const width = window.innerWidth;
    const height = window.innerHeight;
    const canvas = renderer.domElement;
    
    const isResizeNeeded = canvas.width !== width || canvas.height !== height;
    if (isResizeNeeded) {
      renderer.setSize(width, height, false);
    }
    return isResizeNeeded;
  }

  createWaveClothMaterial() {
    const waveClothMaterial = new THREE.ShaderMaterial({
      vertexShader: waveClothVertexShader,
      fragmentShader: waveClothFragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {
          value: 0
        },
        uMouse: {
          value: new THREE.Vector2(0, 0)
        },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight)
        }
      },
      transparent: true,
      depthTest: false
    });
    this.waveClothMaterial = waveClothMaterial;
  }  createPlane() {
    // Optimize geometry complexity based on device capability
    const segments = this.isLowPowerMode ? 64 : 128;
    const geometry = new THREE.PlaneBufferGeometry(10, 10, segments, segments);
    const material = this.waveClothMaterial;
    const plane = new THREE.Mesh(geometry, material);
    this.scene.add(plane);
    this.plane = plane;
  }

  addListeners() {
    // Throttled resize handler
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (this.waveClothMaterial) {
          this.waveClothMaterial.uniforms.uResolution.value.x = window.innerWidth;
          this.waveClothMaterial.uniforms.uResolution.value.y = window.innerHeight;
          this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
        
        const aspect = calcAspect(this.container);
        const camera = this.camera;
        const zoom = 0.5;
        
        camera.left = -zoom * aspect;
        camera.right = zoom * aspect;
        camera.top = zoom;
        camera.bottom = -zoom;
        camera.updateProjectionMatrix();
        camera.lookAt(this.lookAtPoint);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }, 100); // Debounce resize events
    });
    
    // Throttled mouse movement for wave interaction
    let mouseTimeout;
    window.addEventListener("mousemove", (e) => {
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        if (this.waveClothMaterial) {
          const { x, y } = getNormalizedMousePos(e);
          this.waveClothMaterial.uniforms.uMouse.value.x = x;
          this.waveClothMaterial.uniforms.uMouse.value.y = y;
        }
      }, 16); // ~60fps throttle
    });
  }

  update() {
    const elapsedTime = this.clock.getElapsedTime();
    if (this.waveClothMaterial) {
      this.waveClothMaterial.uniforms.uTime.value = elapsedTime;
    }
  }

  setLoop() {
    // Optimized render loop with FPS control
    this.renderer.setAnimationLoop((currentTime) => {
      // FPS limiting for better performance
      const deltaTime = currentTime - this.lastTime;
      
      if (deltaTime >= this.fpsInterval) {
        this.resizeRendererToDisplaySize();
        this.update();
        this.renderer.render(this.scene, this.camera);
        this.lastTime = currentTime - (deltaTime % this.fpsInterval);
      }
    });
  }
}

// Initialize the wave background when the page is loaded
window.addEventListener('DOMContentLoaded', () => {
  const waveBackground = new WaveBackground('.wave-cloth');
});
