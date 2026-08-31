export const GLOBE_DISK_RADIUS = 0.8;

const WORLD_MAP = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAACAAQAAAADMzoqnAAAECklEQVR42u3VsW4jRRzH8d94gzfF4Q0VQaC4vBLTRTp0mze4ggfAPAE5XQEFsGNAVIjwBrmW7h7gJE+giKjyABTZE4g06LKJETdRJvtD65kdz6yduKABiW+TVfzRf2bXYxtcE/59YJCz6YdbgQF6ACSRrwYKYImmh5PbwOewlV3wlQNbAN6SEExjUOO+BU0aCSnxReHABUlK4YFQeJeUT3da8IIkZ6NGoSnFY5KsMoVzMKfECUnqxgPYRArarmUCndHwzIEaQEpg5xVdBXROl8mpAQx5dUgPiHoYAAkg5w3JABR06byGAVgcRGAz5bznj6phBQNRFwyqgdxebH6gshJAesWoFhgYpApAFoG8BIZ/fEhSox5jDjQXmV0Ar5XJfAIrALi3URVs09gHIL4XJCkLC5LH9JWiArABFCSrQjdgkBzRJ0WJeUOSNyQAfJJwUSWUBRlJQ8oGHATACGlBynnzy2kEYLNjrxouigD8BZcgOeVPqh12RtufaCN5wCPVDpvQ9lsIrqndsJtDcWqBCpf4hWN7OdWHBw58FwIaNOU/n1TpMW2DFaD48cmr4185T8NHkpUFX749pQPVdgRKC/DGoQPVeAEKv+WHvY8OOWNTPRp5kHuwSf8wzXtVBKR7YwEH9H3lQUaypUfSATOALyVNu5vZJW31Bnx98nkLfDUWJaz6ixvm+RIQRdl3kmRxxiaDoGnZW4CpPfkaQadlcPim1xOSvETQo7Lv75enVAXJ3xGUlony4KQBBWUM1NiDc6qhyS8RgQs18OCMMtPDaAUIyg0PZkRWDqs+wnKJBTDI1Js6BolegOsKmUxNDBAAKqQyMQmidhegBlLZ+wwKYdv5M/8x1khkb1cgKqP2H+MKyV5vS+whrE8DQDgAlUAoRBX056EElJCjJVACeJBZgNfVp+iCCm4RBWCgKsRxASSA9KgDhDtCiTuMyfHsKXzhC6wNAIjjWb8LKAOA2ctk3FmCOlgKFy8f1N0JJtgsxinYnVAHt4t3gPzZXSCTyCWCQmBT91QE3B5yarSN40dNHYPka4TlDhTUI8zLvl0JSL3vZn6DsCFZOeB2yROEpR68sECQQA++xIGCR2X7DwlEoLRgUrZrqlUg50S1uy43YqDcN6UFBVkhAjWiCV2Q0jgQPdplMKxvBXodcOfAwJYvgdL+1etA1YJJfBcZlQV7sO1i2gHoNiyxtQ5sBsCgWyoxCHiFFd2L5nUTCqMAqGUgsQ9f5kCcCiZgRYkMgMTd5WsB1rTzj0Em14BE4r+QxN1lCEsVur2PoF5Wbg8RJXR4djgvBgauhLywoEZQrt1KKRdVS4CdlJ8qafyP+9KIj/nE/d7kKwH9jgS72e9DV+kvfTWgct4ZyP8Byb8BPG7MaaIIkAQAAAAASUVORK5CYII=";

const GLOBE_VERT = `attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const GLOBE_FRAG = `precision highp float;

uniform vec2 uResolution;
uniform vec2 uRotation;
uniform vec3 uOceanColor;
uniform vec3 uLandColor;
uniform float uDots;
uniform float uScale;
uniform float uDiffuse;
uniform sampler2D uTexture;

const float sqrt5 = 2.236068;
const float PI = 3.141593;
const float kTau = 6.283185;
const float kPhi = 1.618034;
const float r = 0.8;

float byDots;

mat3 rotate(float theta, float phi) {
  float cx = cos(theta);
  float cy = cos(phi);
  float sx = sin(theta);
  float sy = sin(phi);
  return mat3(
    cy, sy * sx, -sy * cx,
    0.0, cx, sx,
    sy, cy * -sx, cy * cx
  );
}

vec3 nearestFibonacciLattice(vec3 p, out float m) {
  p = p.xzy;
  float k = max(2.0, floor(log2(sqrt5 * uDots * PI * (1.0 - p.z * p.z)) * 0.72021));
  vec2 f = floor(pow(kPhi, k) / sqrt5 * vec2(1.0, kPhi) + 0.5);
  vec2 br1 = fract((f + 1.0) * (kPhi - 1.0)) * kTau - 3.883222;
  vec2 br2 = -2.0 * f;
  vec2 sp = vec2(atan(p.y, p.x), p.z - 1.0);
  vec2 c = floor(vec2(br2.y * sp.x - br1.y * (sp.y * uDots + 1.0), -br2.x * sp.x + br1.x * (sp.y * uDots + 1.0)) / (br1.x * br2.y - br2.x * br1.y));
  float mindist = PI;
  vec3 minip;
  for (float s = 0.0; s < 4.0; s += 1.0) {
    vec2 o = vec2(mod(s, 2.0), floor(s * 0.5));
    float idx = dot(f, c + o);
    if (idx > uDots) continue;
    float a = idx, b = 0.0;
    if (a >= 16384.0) a -= 16384.0, b += 0.868872;
    if (a >= 8192.0) a -= 8192.0, b += 0.934436;
    if (a >= 4096.0) a -= 4096.0, b += 0.467218;
    if (a >= 2048.0) a -= 2048.0, b += 0.733609;
    if (a >= 1024.0) a -= 1024.0, b += 0.866804;
    if (a >= 512.0) a -= 512.0, b += 0.433402;
    if (a >= 256.0) a -= 256.0, b += 0.216701;
    if (a >= 128.0) a -= 128.0, b += 0.108351;
    if (a >= 64.0) a -= 64.0, b += 0.554175;
    if (a >= 32.0) a -= 32.0, b += 0.777088;
    if (a >= 16.0) a -= 16.0, b += 0.888544;
    if (a >= 8.0) a -= 8.0, b += 0.944272;
    if (a >= 4.0) a -= 4.0, b += 0.472136;
    if (a >= 2.0) a -= 2.0, b += 0.236068;
    if (a >= 1.0) a -= 1.0, b += 0.618034;
    float theta = fract(b) * kTau;
    float cosphi = 1.0 - 2.0 * idx * byDots;
    float sinphi = sqrt(1.0 - cosphi * cosphi);
    vec3 samplePt = vec3(cos(theta) * sinphi, sin(theta) * sinphi, cosphi);
    float dist = length(p - samplePt);
    if (dist < mindist) {
      mindist = dist;
      minip = samplePt;
    }
  }
  m = mindist;
  return minip.xzy;
}

void main() {
  byDots = 1.0 / uDots;
  vec2 inv = 1.0 / uResolution;
  vec2 uv = ((gl_FragCoord.xy * inv) * 2.0 - 1.0) / uScale;
  uv.x *= uResolution.x * inv.y;
  float l = dot(uv, uv);
  if (l > r * r) {
    gl_FragColor = vec4(0.0);
    return;
  }
  float dis;
  vec3 p = normalize(vec3(uv, sqrt(r * r - l)));
  mat3 rot = rotate(uRotation.y, uRotation.x);
  vec3 gP = nearestFibonacciLattice(p * rot, dis);
  float gPhi = asin(gP.y);
  float gTheta = acos(-gP.x / cos(gPhi));
  if (gP.z < 0.0) gTheta = -gTheta;
  float land = texture2D(uTexture, vec2((gTheta * 0.5) / PI, -(gPhi / PI + 0.5))).x;
  float onDot = smoothstep(0.009, 0.003, dis);
  vec3 albedo = mix(uOceanColor, uLandColor, land);
  gl_FragColor = vec4(albedo * onDot, onDot);
}`;

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

function latLonTo3D(location: [number, number]): [number, number, number] {
  const latRad = (location[0] * Math.PI) / 180;
  const lonRad = (location[1] * Math.PI) / 180 - Math.PI;
  const cosLat = Math.cos(latRad);
  return [-cosLat * Math.cos(lonRad), Math.sin(latRad), cosLat * Math.sin(lonRad)];
}

export const LABEL_FADE_START_DEPTH = 0.26;

export function markerDepth(
  location: [number, number],
  phi: number,
  theta: number,
  markerElevation = 0.04,
): number {
  const pos = latLonTo3D(location);
  const rad = 0.8 + markerElevation;
  const p0 = pos[0] * rad;
  const p1 = pos[1] * rad;
  const p2 = pos[2] * rad;
  const cx = Math.cos(theta);
  const sx = Math.sin(theta);
  const cy = Math.cos(phi);
  const sy = Math.sin(phi);
  return -sy * cx * p0 + sx * p1 + cy * cx * p2;
}

export function phiWhenFirstLabelFadesIn(
  locations: readonly [number, number][],
  theta: number,
  markerElevation = 0.04,
  fadeStart = LABEL_FADE_START_DEPTH,
): number {
  const step = 0.002;
  const tau = Math.PI * 2;
  const maxDepth = (phi: number) =>
    locations.reduce(
      (highest, location) => Math.max(highest, markerDepth(location, phi, theta, markerElevation)),
      Number.NEGATIVE_INFINITY,
    );

  for (let phi = 0; phi < tau; phi += step) {
    const previous = maxDepth(phi - step);
    const current = maxDepth(phi);
    if (previous < fadeStart && current >= fadeStart) return phi;
  }
  return 0;
}

function createAnchorManager(wrapper: HTMLElement) {
  const anchors: Record<string, HTMLElement> = {};
  const visibility: Record<string, string> = {};
  const styleEl = document.createElement('style');
  document.head.append(styleEl);

  function writeVars() {
    let vars = '';
    for (const key in visibility) vars += key + ':' + visibility[key] + ';';
    const next = ':root{' + vars + '}';
    if (next !== styleEl.textContent) styleEl.textContent = next;
  }

  return {
    update(
      markers: BrandGlobeMarker[],
      project: (location: [number, number]) => {
        x: number;
        y: number;
        visible: boolean;
        depth: number;
      },
    ) {
      const active: Record<string, boolean> = {};
      for (const marker of markers) {
        const id = marker.id;
        if (!id) continue;
        const pos = project(marker.location);
        active[id] = true;
        let el = anchors[id];
        if (!el) {
          el = document.createElement('div');
          el.style.cssText =
            'position:absolute;width:1px;height:1px;pointer-events:none;anchor-name:--cobe-' + id;
          wrapper.append(el);
          anchors[id] = el;
        }
        el.dataset.x = String(pos.x);
        el.dataset.y = String(pos.y);
        el.dataset.depth = String(pos.depth);
        if (pos.visible) visibility['--cobe-visible-' + id] = '1';
        else delete visibility['--cobe-visible-' + id];
      }
      for (const id in anchors) {
        if (!active[id]) {
          anchors[id].remove();
          delete anchors[id];
          delete visibility['--cobe-visible-' + id];
        }
      }
      writeVars();
    },
    destroy() {
      for (const id in anchors) anchors[id].remove();
      styleEl.remove();
    },
  };
}

export type Rgb = [number, number, number];

export type BrandGlobeMarker = {
  id?: string;
  location: [number, number];
  size: number;
};

export type BrandGlobeOptions = {
  width: number;
  height: number;
  phi: number;
  theta: number;
  devicePixelRatio: number;
  oceanColor: Rgb;
  landColor: Rgb;
  markerColor: Rgb;
  mapSamples?: number;
  markers?: BrandGlobeMarker[];
  scale?: number;
  markerElevation?: number;
  diffuse?: number;
};

export type BrandGlobe = {
  update: (state: Partial<BrandGlobeOptions>) => void;
  destroy: () => void;
};

export function createBrandGlobe(canvas: HTMLCanvasElement, opts: BrandGlobeOptions): BrandGlobe {
  const contextOpts = {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
  };
  let gl = canvas.getContext('webgl2', contextOpts) || canvas.getContext('webgl', contextOpts);
  if (!gl) return { update() {}, destroy() {} };

  let dpr = opts.devicePixelRatio || 1;
  canvas.width = opts.width * dpr;
  canvas.height = opts.height * dpr;

  let phi = opts.phi || 0;
  let theta = opts.theta || 0;
  let markers = opts.markers || [];
  let mapSamples = opts.mapSamples || 16000;
  let oceanColor = opts.oceanColor;
  let landColor = opts.landColor;
  let scale = opts.scale || 1;
  let markerElevation = opts.markerElevation ?? 0.04;
  let diffuse = opts.diffuse ?? 0.85;

  const globeProg = program(gl, GLOBE_VERT, GLOBE_FRAG);
  if (!globeProg) return { update() {}, destroy() {} };

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

  const globePos = gl.getAttribLocation(globeProg, 'aPosition');
  const uResolution = gl.getUniformLocation(globeProg, 'uResolution');
  const uRotation = gl.getUniformLocation(globeProg, 'uRotation');
  const uOceanColor = gl.getUniformLocation(globeProg, 'uOceanColor');
  const uLandColor = gl.getUniformLocation(globeProg, 'uLandColor');
  const uDots = gl.getUniformLocation(globeProg, 'uDots');
  const uScale = gl.getUniformLocation(globeProg, 'uScale');
  const uDiffuse = gl.getUniformLocation(globeProg, 'uDiffuse');
  const uTexture = gl.getUniformLocation(globeProg, 'uTexture');

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0]));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    render();
  };
  image.src = WORLD_MAP;

  function uploadMarkers(next: BrandGlobeMarker[]) {
    markers = next;
  }

  function project(location: [number, number]) {
    const pos = latLonTo3D(location);
    const rad = 0.8 + markerElevation;
    const p = [pos[0] * rad, pos[1] * rad, pos[2] * rad];
    const cx = Math.cos(theta);
    const cy = Math.cos(phi);
    const sx = Math.sin(theta);
    const sy = Math.sin(phi);
    const aspect = canvas.width / canvas.height;
    const rx = cy * p[0] + sy * p[2];
    const ry = sy * sx * p[0] + cx * p[1] - cy * sx * p[2];
    const rz = -sy * cx * p[0] + sx * p[1] + cy * cx * p[2];
    return {
      x: ((rx / aspect) * scale + 1) / 2,
      y: (-ry * scale + 1) / 2,
      visible: rz >= 0 || rx * rx + ry * ry >= 0.64,
      depth: rz,
    };
  }

  const wrapper = document.createElement('div');
  wrapper.style.cssText = 'position:relative;width:100%;height:100%';
  canvas.parentElement?.insertBefore(wrapper, canvas);
  wrapper.append(canvas);
  const anchors = createAnchorManager(wrapper);

  function render() {
    anchors.update(markers, project);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    gl.useProgram(globeProg);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(globePos);
    gl.vertexAttribPointer(globePos, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.uniform2f(uRotation, phi, theta);
    gl.uniform3fv(uOceanColor, oceanColor);
    gl.uniform3fv(uLandColor, landColor);
    gl.uniform1f(uDots, mapSamples);
    gl.uniform1f(uScale, scale);
    gl.uniform1f(uDiffuse, diffuse);
    gl.uniform1i(uTexture, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  uploadMarkers(markers);
  render();

  return {
    update(state) {
      if (state.phi != null) phi = state.phi;
      if (state.theta != null) theta = state.theta;
      if (state.markers) uploadMarkers(state.markers);
      if (state.width && state.height) {
        canvas.width = state.width * dpr;
        canvas.height = state.height * dpr;
      }
      if (state.oceanColor) oceanColor = state.oceanColor;
      if (state.landColor) landColor = state.landColor;
      if (state.mapSamples != null) mapSamples = state.mapSamples;
      if (state.scale != null) scale = state.scale;
      if (state.markerElevation != null) markerElevation = state.markerElevation;
      if (state.diffuse != null) diffuse = state.diffuse;
      render();
    },
    destroy() {
      gl.deleteBuffer(quad);
      gl.deleteProgram(globeProg);
      gl.deleteTexture(texture);
      anchors.destroy();
    },
  };
}
