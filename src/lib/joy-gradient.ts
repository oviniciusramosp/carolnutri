/**
 * Fullscreen organic gradient — port of the monopo.london hero shader
 * (https://monopo.london/). 45deg CSS stops (dark top-right, cream bottom-left)
 * warped by IQ noise. Seed walks the 3D field so the waves keep flowing.
 *
 * Gradient noise: Inigo Quilez, MIT — https://iquilezles.org/articles/gradientnoise/
 */

const VERT = `attribute vec2 aPosition;
varying vec2 vPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
  vPosition = aPosition;
}`;

const FRAG = `precision highp float;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uStops;
uniform float uDisplacement;
uniform float uSeed;
uniform vec2 uViewportSize;
uniform vec2 uTransformPosition;

varying vec2 vPosition;

vec3 gradientDerivativesNoise3DHash(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}

vec4 gradientDerivativesNoise3D(in vec3 x) {
  vec3 p = floor(x);
  vec3 w = fract(x);
  vec3 u = w * w * w * (w * (w * 6.0 - 15.0) + 10.0);
  vec3 du = 30.0 * w * w * (w * (w - 2.0) + 1.0);

  vec3 ga = gradientDerivativesNoise3DHash(p + vec3(0.0, 0.0, 0.0));
  vec3 gb = gradientDerivativesNoise3DHash(p + vec3(1.0, 0.0, 0.0));
  vec3 gc = gradientDerivativesNoise3DHash(p + vec3(0.0, 1.0, 0.0));
  vec3 gd = gradientDerivativesNoise3DHash(p + vec3(1.0, 1.0, 0.0));
  vec3 ge = gradientDerivativesNoise3DHash(p + vec3(0.0, 0.0, 1.0));
  vec3 gf = gradientDerivativesNoise3DHash(p + vec3(1.0, 0.0, 1.0));
  vec3 gg = gradientDerivativesNoise3DHash(p + vec3(0.0, 1.0, 1.0));
  vec3 gh = gradientDerivativesNoise3DHash(p + vec3(1.0, 1.0, 1.0));

  float va = dot(ga, w - vec3(0.0, 0.0, 0.0));
  float vb = dot(gb, w - vec3(1.0, 0.0, 0.0));
  float vc = dot(gc, w - vec3(0.0, 1.0, 0.0));
  float vd = dot(gd, w - vec3(1.0, 1.0, 0.0));
  float ve = dot(ge, w - vec3(0.0, 0.0, 1.0));
  float vf = dot(gf, w - vec3(1.0, 0.0, 1.0));
  float vg = dot(gg, w - vec3(0.0, 1.0, 1.0));
  float vh = dot(gh, w - vec3(1.0, 1.0, 1.0));

  return vec4(
    va + u.x * (vb - va) + u.y * (vc - va) + u.z * (ve - va)
      + u.x * u.y * (va - vb - vc + vd)
      + u.y * u.z * (va - vc - ve + vg)
      + u.z * u.x * (va - vb - ve + vf)
      + (-va + vb + vc - vd + ve - vf - vg + vh) * u.x * u.y * u.z,
    ga + u.x * (gb - ga) + u.y * (gc - ga) + u.z * (ge - ga)
      + u.x * u.y * (ga - gb - gc + gd)
      + u.y * u.z * (ga - gc - ge + gg)
      + u.z * u.x * (ga - gb - ge + gf)
      + (-ga + gb + gc - gd + ge - gf - gg + gh) * u.x * u.y * u.z
      + du * (vec3(vb, vc, ve) - va
        + u.yzx * vec3(va - vb - vc + vd, va - vc - ve + vg, va - vb - ve + vf)
        + u.zxy * vec3(va - vb - ve + vf, va - vb - vc + vd, va - vc - ve + vg)
        + u.yzx * u.zxy * (-va + vb + vc - vd + ve - vf - vg + vh))
  );
}

vec3 sampleStops(float t) {
  t = clamp(t, 0.0, 1.0);
  float s0 = uStops.x;
  float s1 = uStops.y;
  float s2 = uStops.z;
  float w1 = clamp((t - s0) / max(s1 - s0, 0.0001), 0.0, 1.0);
  float w2 = clamp((t - s1) / max(s2 - s1, 0.0001), 0.0, 1.0);
  return mix(mix(uColor1, uColor2, w1), uColor3, w2);
}

void main() {
  vec2 p = vPosition * uViewportSize;
  float span = uViewportSize.x + uViewportSize.y;
  // Color axis +45deg: t=0 at top-right, t=1 at bottom-left.
  float t = 0.5 - 0.5 * (p.x + p.y) / span;

  float along = (p.y - p.x) / span;
  float across = (p.x + p.y) / span;
  vec2 uv = vec2(along, across);
  vec2 uvA = uv * 1.25 + uTransformPosition;
  vec2 uvB = uv * 0.62 + vec2(uTransformPosition.y, -uTransformPosition.x) * 0.85;
  uvB.y += uSeed * 0.22;

  vec3 blob = gradientDerivativesNoise3D(vec3(uvB, uSeed * 0.55 + 3.1)).xyz;
  vec2 warped = uvA + vec2(blob.x, blob.z) * 0.65;
  vec3 n = gradientDerivativesNoise3D(vec3(warped, uSeed * 0.8)).xyz;

  float warp = 0.32 + uDisplacement * 0.055;
  t += n.x * warp + blob.x * warp * 0.45;
  t = clamp(t, 0.0, 1.0);

  vec3 color = sampleStops(t);
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`;

export type Rgb = [number, number, number];

export type JoyGradientOptions = {
  color1: Rgb;
  color2: Rgb;
  color3: Rgb;
  stops: [number, number, number];
  colorSize: number;
  colorSpacing: number;
  colorRotation: number;
  colorSpread: number;
  colorOffset: [number, number];
  displacement: number;
  seed: number;
  position: [number, number];
  zoom: number;
  spacing: number;
  noiseSize: number;
  noiseIntensity: number;
  lerp: number;
  idleDrift: number;
  idleDelayMs: number;
};

/** Homepage values from monopo.london's `<monopo-gradient>`. */
export const MONOPO_HOME: JoyGradientOptions = {
  color1: hexRgb('#5c331d'),
  color2: hexRgb('#a55c25'),
  color3: hexRgb('#e7d5c1'),
  stops: [0.2084, 0.5011, 0.9823],
  colorSize: 0.58,
  colorSpacing: 0.52,
  colorRotation: -0.381592653589793,
  colorSpread: 4.52,
  colorOffset: [-0.7741174697875977, -0.20644775390624992],
  displacement: 4.66,
  seed: -0.06,
  position: [-0.2816110610961914, -0.43914794921875],
  zoom: 0.72,
  spacing: 4.27,
  noiseSize: 0.5,
  noiseIntensity: 0.04,
  lerp: 0.1,
  idleDrift: 0.52,
  idleDelayMs: 500,
};

export type JoyGradient = {
  destroy: () => void;
};

export function createJoyGradient(
  canvas: HTMLCanvasElement,
  options: Partial<JoyGradientOptions> = {},
): JoyGradient {
  const opts: JoyGradientOptions = {
    ...MONOPO_HOME,
    color1: cssRgb('--color-joy-1', MONOPO_HOME.color1),
    color2: cssRgb('--color-joy-2', MONOPO_HOME.color2),
    color3: cssRgb('--color-joy-3', MONOPO_HOME.color3),
    ...options,
  };
  const contextOpts: WebGLContextAttributes = {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
  };
  const context = canvas.getContext('webgl', contextOpts);
  if (!context) return { destroy() {} };
  const gl: WebGLRenderingContext = context;

  const prog = program(gl, VERT, FRAG);
  if (!prog) return { destroy() {} };

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(prog, 'aPosition');
  const uColor1 = gl.getUniformLocation(prog, 'uColor1');
  const uColor2 = gl.getUniformLocation(prog, 'uColor2');
  const uColor3 = gl.getUniformLocation(prog, 'uColor3');
  const uStops = gl.getUniformLocation(prog, 'uStops');
  const uDisplacement = gl.getUniformLocation(prog, 'uDisplacement');
  const uSeed = gl.getUniformLocation(prog, 'uSeed');
  const uViewportSize = gl.getUniformLocation(prog, 'uViewportSize');
  const uTransformPosition = gl.getUniformLocation(prog, 'uTransformPosition');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const [posX, posY] = opts.position;
  let viewW = 1;
  let viewH = 1;
  let elapsed = 0;
  let lastNow = performance.now();
  let raf = 0;
  let running = true;

  function resize() {
    const width = Math.max(1, canvas.clientWidth);
    const height = Math.max(1, canvas.clientHeight);
    viewW = width;
    viewH = height;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, width, height);
  }

  function draw() {
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    gl.uniform3fv(uColor1, opts.color1);
    gl.uniform3fv(uColor2, opts.color2);
    gl.uniform3fv(uColor3, opts.color3);
    gl.uniform3fv(uStops, opts.stops);
    gl.uniform1f(uDisplacement, opts.displacement + Math.sin(elapsed * 0.33) * 1.35);
    gl.uniform1f(uSeed, opts.seed + elapsed * opts.idleDrift);
    gl.uniform2f(uViewportSize, viewW, viewH);
    gl.uniform2f(
      uTransformPosition,
      posX + Math.sin(elapsed * 0.21) * 0.62 + Math.sin(elapsed * 0.07) * 0.38,
      posY + Math.cos(elapsed * 0.16) * 0.55 + elapsed * 0.08,
    );

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function tick(now: number) {
    if (!running) return;
    if (!reduceMotion.matches) {
      const dt = Math.min(0.05, (now - lastNow) / 1000);
      lastNow = now;
      elapsed += dt;
    }
    draw();
    raf = requestAnimationFrame(tick);
  }

  const observer = new ResizeObserver(() => {
    resize();
    draw();
  });
  observer.observe(canvas);

  resize();
  draw();
  raf = requestAnimationFrame(tick);

  return {
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}

function hexRgb(hex: string): Rgb {
  const value = hex.replace('#', '');
  const n = parseInt(value, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function cssRgb(variable: string, fallback: Rgb): Rgb {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  if (raw.startsWith('#') && (raw.length === 7 || raw.length === 4)) return hexRgb(raw);
  const rgb = raw.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgb) return [Number(rgb[1]) / 255, Number(rgb[2]) / 255, Number(rgb[3]) / 255];
  return fallback;
}

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function program(gl: WebGLRenderingContext, vert: string, frag: string): WebGLProgram | null {
  const vs = compile(gl, gl.VERTEX_SHADER, vert);
  const fs = compile(gl, gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) return null;
  const p = gl.createProgram();
  if (!p) return null;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(p));
    gl.deleteProgram(p);
    return null;
  }
  return p;
}
