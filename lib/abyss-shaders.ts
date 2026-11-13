// GLSL from the supplied Abyss — primordial soup effect.

export const surfaceVertex = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

export const surfaceFragment = `
precision highp float;
uniform float uTime;
uniform vec2  uRes;
uniform float uAngle;
uniform sampler2D uSimV;   // (vx, vy, h, \u2013)
uniform sampler2D uSimD;   // (Dx, Dy, luminescence, \u2013)
uniform vec2 uSimTexel;

// --- Ashima simplex 3D ---
vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  vec3 ns = 0.142857142857 * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// Rotated-octave FBM (rotation kills axis-aligned artifacts; 4 octaves is the visual sweet spot here).
const mat2 OCT = mat2(1.6, 1.2, -1.2, 1.6);
float fbm(vec3 p){
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) { s += a * snoise(p); p.xy = OCT * p.xy; p.z *= 1.35; a *= 0.5; }
  return s;
}

// Silk-ribbon height field in the flow frame. Returns (height, shard level).
//  1) two-level low-frequency domain warp w(f)
//  2) ribbon phase \u03C6 = k\xB7f.y + warp  \u2192 parallel sheets along the current, folded by w
//  3) amplitude gate A(f) breaks ribbons into discrete translucent sheets with large voids
vec2 field(vec2 f, float t){
  vec2 p = f * vec2(0.42, 1.25);
  vec2 q = vec2(fbm(vec3(p, t * 0.05)), fbm(vec3(p + vec2(5.2, 1.3), t * 0.05)));
  vec2 w = vec2(fbm(vec3(p + 1.6 * q + vec2(1.7, 9.2), t * 0.07)),
                fbm(vec3(p + 1.6 * q + vec2(8.3, 2.8), t * 0.07)));
  float ph = f.y * 9.0 + 3.2 * w.x + 1.4 * q.y;
  float rib = 0.5 + 0.5 * sin(ph);
  rib = rib * rib * (3.0 - 2.0 * rib);
  float A = smoothstep(-0.15, 0.45, fbm(vec3(p * 0.8 + 0.9 * w + 11.0, t * 0.03)));
  return vec2(rib * A, w.y + 0.35 * q.x);
}

vec3 palette(float v){
  v = clamp(v, 0.0, 1.0);
  vec3 c0 = vec3(0.0);
  vec3 c1 = vec3(2.0, 1.0, 18.0) / 255.0;
  vec3 c2 = vec3(5.0, 6.0, 57.0) / 255.0;
  vec3 c3 = vec3(8.0, 16.0, 124.0) / 255.0;
  vec3 c4 = vec3(17.0, 84.0, 237.0) / 255.0;
  vec3 c5 = vec3(108.0, 178.0, 255.0) / 255.0;
  vec3 c = mix(c0, c1, smoothstep(0.00, 0.12, v));
  c = mix(c, c2, smoothstep(0.12, 0.32, v));
  c = mix(c, c3, smoothstep(0.32, 0.55, v));
  c = mix(c, c4, smoothstep(0.55, 0.82, v));
  c = mix(c, c5, smoothstep(0.82, 1.00, v));
  return c;
}

float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }

vec2 toFlow(vec2 uv, float t){
  vec2 dir = vec2(cos(uAngle), sin(uAngle));
  vec2 f = vec2(dot(uv, dir), dot(uv, vec2(-dir.y, dir.x)));
  f.x -= t * 0.018;                                           // sheets slide downstream
  return f;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float t = uTime;

  // Simulation coupling: sample the soup at its rest (material) position, add the simulated surface to the normal.
  vec2 tc = gl_FragCoord.xy / uRes;
  vec4 M = texture2D(uSimD, tc);
  vec2 X = uv - M.xy;
  // \xB11.5-texel taps through bilinear filtering = smoothed gradient (keeps half-float noise below visibility)
  vec2 o = 1.5 * uSimTexel;
  float sL = texture2D(uSimV, tc - vec2(o.x, 0.0)).z;
  float sR = texture2D(uSimV, tc + vec2(o.x, 0.0)).z;
  float sB = texture2D(uSimV, tc - vec2(0.0, o.y)).z;
  float sT = texture2D(uSimV, tc + vec2(0.0, o.y)).z;
  vec2 gs = vec2(sR - sL, sT - sB) * (0.5 / o.y) * 10.0;
  vec2 f = toFlow(X, t);

  float e = 1.5 / uRes.y;
  vec2 F  = field(toFlow(X, t), t);
  float h1 = field(toFlow(X + vec2(e, 0.0), t), t).x;
  float h2 = field(toFlow(X + vec2(0.0, e), t), t).x;
  vec2 g = vec2(h1 - F.x, h2 - F.x) / e + gs;

  vec3 n = normalize(vec3(-g * 0.02, 1.0));
  vec3 L = normalize(vec3(-0.55, -0.35, 0.75));           // key light from lower-left
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));

  float sheet = F.x;
  float rim   = pow(1.0 - n.z, 2.0);
  float spec  = pow(max(dot(n, H), 0.0), 10.0);
  float shard = smoothstep(0.38, 0.42, F.y);

  float y = f.y + 0.12 * sin(f.x * 1.3 + t * 0.07);
  float band = smoothstep(0.0, 0.42, abs(y + 0.02));
  float vig = smoothstep(1.3, 0.3, length(uv * vec2(0.75, 1.0)));

  float v = sheet * 0.36
          + sheet * rim * 0.25
          + sheet * spec * 0.28
          + sheet * shard * (0.25 + 0.45 * spec)
          + (1.0 - inversesqrt(1.0 + dot(gs, gs) * 4e-4)) * 0.9; // bare water: lit only where the sim tilts it
  v *= mix(0.3, 1.0, band) * mix(0.7, 1.0, vig);
  v = 1.9 * pow(v, 1.45);                                 // tone curve: crush mids, keep cobalt peaks
  v += M.z * (0.7 + 0.3 * sheet);                         // stressed plankton glow (post-curve so faint glow isn't crushed)

  vec3 col = palette(v);

  col += (hash12(gl_FragCoord.xy + fract(t) * 91.7) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`;

export const simulationVertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

const simulationHeader = `
precision highp float;
varying vec2 vUv;
uniform vec2 uTexel;   // 1/simW, 1/simH
uniform float uAspect; // simW/simH
vec2 toTex(vec2 v) { return vec2(v.x / uAspect, v.y); }
`;

export const splatFragment = `${simulationHeader}
uniform sampler2D uV;
uniform vec2 uPoint;
uniform vec3 uForce;
uniform float uRadial;
uniform float uRadius;
void main() {
  vec2 d = vUv - uPoint; d.x *= uAspect;
  float g = exp(-dot(d, d) / (uRadius * uRadius));
  vec4 s = texture2D(uV, vUv);
  s.xyz += uForce * g;
  s.xy += uRadial * (d / uRadius) * g; // \u221D r\xB7e^{\u2212r\xB2/\u03C3\xB2}: zero at centre, peak at \u03C3/\u221A2
  gl_FragColor = s;
}
`;

export const curlFragment = `${simulationHeader}
uniform sampler2D uV;
void main() {
  float L = texture2D(uV, vUv - vec2(uTexel.x, 0.0)).y;
  float R = texture2D(uV, vUv + vec2(uTexel.x, 0.0)).y;
  float B = texture2D(uV, vUv - vec2(0.0, uTexel.y)).x;
  float T = texture2D(uV, vUv + vec2(0.0, uTexel.y)).x;
  gl_FragColor = vec4(((R - L) - (T - B)) * 0.5 / uTexel.y, 0.0, 0.0, 1.0);
}
`;

export const velocityFragment = `${simulationHeader}
uniform sampler2D uV;
uniform sampler2D uC;
uniform sampler2D uD;
uniform float uDt, uG, uK, uDamp, uVort, uNu;
void main() {
  vec2 back = vUv - toTex(texture2D(uV, vUv).xy) * uDt;
  vec4 s = texture2D(uV, back);
  vec2 avg = 0.25 * (texture2D(uV, back - vec2(uTexel.x, 0.0)).xy + texture2D(uV, back + vec2(uTexel.x, 0.0)).xy
                   + texture2D(uV, back - vec2(0.0, uTexel.y)).xy + texture2D(uV, back + vec2(0.0, uTexel.y)).xy);
  s.xy = mix(s.xy, avg, uNu);                                  // numerical viscosity: damps checkerboard modes

  float hL = texture2D(uV, vUv - vec2(uTexel.x, 0.0)).z;
  float hR = texture2D(uV, vUv + vec2(uTexel.x, 0.0)).z;
  float hB = texture2D(uV, vUv - vec2(0.0, uTexel.y)).z;
  float hT = texture2D(uV, vUv + vec2(0.0, uTexel.y)).z;
  s.xy -= uG * vec2(hR - hL, hT - hB) * (0.5 / uTexel.y) * uDt;

  float c  = texture2D(uC, vUv).x;
  float cL = abs(texture2D(uC, vUv - vec2(uTexel.x, 0.0)).x);
  float cR = abs(texture2D(uC, vUv + vec2(uTexel.x, 0.0)).x);
  float cB = abs(texture2D(uC, vUv - vec2(0.0, uTexel.y)).x);
  float cT = abs(texture2D(uC, vUv + vec2(0.0, uTexel.y)).x);
  vec2 n = vec2(cR - cL, cT - cB);
  n /= length(n) + 4.0; // soft-normalised: near-zero (noisy) gradients yield ~zero force instead of full-strength jitter
  s.xy += uVort * vec2(n.y, -n.x) * c * uDt;

  s.xy -= uK * texture2D(uD, vUv).xy * uDt;
  s.xy *= exp(-uDamp * uDt);
  gl_FragColor = s;
}
`;

export const heightFragment = `${simulationHeader}
uniform sampler2D uV;
uniform float uDt, uH0, uHDamp, uNu;
void main() {
  vec4 s = texture2D(uV, vUv);
  float L = texture2D(uV, vUv - vec2(uTexel.x, 0.0)).x;
  float R = texture2D(uV, vUv + vec2(uTexel.x, 0.0)).x;
  float B = texture2D(uV, vUv - vec2(0.0, uTexel.y)).y;
  float T = texture2D(uV, vUv + vec2(0.0, uTexel.y)).y;
  s.z -= uH0 * ((R - L) + (T - B)) * (0.5 / uTexel.y) * uDt;
  float hAvg = 0.25 * (texture2D(uV, vUv - vec2(uTexel.x, 0.0)).z + texture2D(uV, vUv + vec2(uTexel.x, 0.0)).z
                     + texture2D(uV, vUv - vec2(0.0, uTexel.y)).z + texture2D(uV, vUv + vec2(0.0, uTexel.y)).z);
  s.z = mix(s.z, hAvg, uNu);
  s.z *= exp(-uHDamp * uDt);
  gl_FragColor = s;
}
`;

export const materialFragment = `${simulationHeader}
uniform sampler2D uD;
uniform sampler2D uV;
uniform float uDt, uDecay, uKappa, uS0, uLDecay;
void main() {
  vec2 v = texture2D(uV, vUv).xy;
  vec4 m = texture2D(uD, vUv - toTex(v) * uDt);
  vec2 D = m.xy + v * uDt;

  vec2 vL = texture2D(uV, vUv - vec2(uTexel.x, 0.0)).xy;
  vec2 vR = texture2D(uV, vUv + vec2(uTexel.x, 0.0)).xy;
  vec2 vB = texture2D(uV, vUv - vec2(0.0, uTexel.y)).xy;
  vec2 vT = texture2D(uV, vUv + vec2(0.0, uTexel.y)).xy;
  vec2 dx = (vR - vL) * (0.5 / uTexel.y), dy = (vT - vB) * (0.5 / uTexel.y);
  float strain = sqrt(dot(dx, dx) + dot(dy, dy));              // Frobenius \u2016\u2207v\u2016 (1/s)

  float L = m.z;
  L += uKappa * max(strain - uS0, 0.0) * (1.0 - L) * uDt;
  L *= exp(-uLDecay * uDt);
  gl_FragColor = vec4(D * exp(-uDecay * uDt), clamp(L, 0.0, 1.0), 1.0);
}
`;
