/*
 * Copyright (c) 2022-2026 Peter Johan Salomonsen ( petersalomonsen.com )
 * Licensed under CC BY-NC 4.0 — see LICENSE
 *
 * "Much" — "the power of many". A real 3D stage: dancers stand on a reflective
 * tiled floor under sweeping coloured stage lights. A cinematic camera opens on
 * ONE big white hero dancing, holds a while, then slowly dollies back to reveal
 * the whole colourful crowd, then cranes up and orbits above, looking down.
 *
 * Dance is tempo-locked (124 BPM, NOT note-driven): knees dip every beat; arms
 * hold a pose per beat and snap on the downbeat (flat → zigzag → flat → opp.
 * zigzag), the elbow doing the wave. The LIGHTS react to the music.
 */

precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float targetNoteStates[128];     // used only by the lights
uniform float smoothedNoteStates[128];
uniform sampler2D uText;                  // showText() layer
uniform sampler2D uTextPrev;
uniform float uTextMix;
uniform float uCrowd;     // 0 = lone hero .. 1 = full crowd revealed  (song setVisual)
uniform float uZoom;      // 0 = close on the hero .. 1 = pulled back to the group
uniform float uCamMove;   // 0 = locked camera .. 1 = moving orbit/tour
uniform float uLights;    // 0 = dark stage (white hero spot) .. 1 = disco rig up
uniform float uFloor;     // 0 = void .. 1 = tiled dancefloor
uniform float uHero;      // 0 = empty spotlit stage .. 1 = lone hero has stepped in

const float BPM = 125.0;
const float HALFPI = 1.5707963;
const float FIGSCALE = 0.8;     // world metres per local unit

float hash21(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }

float sdSeg(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

// smooth minimum — rounds off the joint where two shapes meet
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// tapered capsule: solid limb, radius ra at a shrinking to rb at b
float capT(vec2 p, vec2 a, vec2 b, float ra, float rb) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  return length(pa - ba * h) - mix(ra, rb, h);
}

// oriented solid ellipse (approx signed distance); dir = unit major-axis direction
float sdEll(vec2 p, vec2 c, vec2 dir, float ha, float hb) {
  vec2 rel = p - c;
  vec2 q = vec2(dot(rel, dir), dot(rel, vec2(-dir.y, dir.x)));
  vec2 n = vec2(q.x / ha, q.y / hb);
  float e = length(n);
  return (e - 1.0) * min(ha, hb);
}

// Project a dancer's local joint (2D, in the figure's own plane) to the screen.
// The figure stands in the WORLD facing a fixed direction (sideways axis WX,
// up = world up), so as the camera orbits we see it from different angles —
// not always front-on. `base` is the feet position on the floor.
vec2 jp(vec2 L, vec3 base, vec3 WX, vec3 ro, vec3 fwd, vec3 rgt, vec3 upv, float focal) {
  vec3 wp = base + (L.x * FIGSCALE) * WX + vec3(0.0, (L.y + 0.46) * FIGSCALE, 0.0);
  vec3 v = wp - ro; float z = dot(v, fwd);
  return z > 0.05 ? vec2(dot(v, rgt), dot(v, upv)) / z * focal : vec2(1e3);
}

// Coloured light reaching a 3D point from the four sweeping stage fixtures.
vec3 lightAt(vec3 P, float t) {
  vec3 acc = vec3(0.0);
  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    vec3 lp = vec3((fi - 1.5) * 3.4, 7.5, -1.5);                  // fixtures above & behind the crowd
    float sweep = sin(t * (0.55 + 0.10 * fi) + fi * 1.7) * 0.6;
    vec3 aim = normalize(vec3(sweep, -1.0, 0.18));
    vec3 cc = 0.55 + 0.45 * cos(2.0944 * fi + vec3(0.0, 2.1, 4.2)); // four distinct hues
    vec3 dv = P - lp; float dist = length(dv) + 1e-3; vec3 dir = dv / dist;
    float cone = smoothstep(0.86, 0.97, dot(dir, aim));
    float fall = 1.0 / (1.0 + 0.06 * dist * dist);
    acc += cc * cone * fall;
  }
  acc *= uLights;                                  // the sweeping rig comes up on the "lights" cue
  // a white follow-spot on the lone hero (front-centre); on until the disco rig takes over
  float introFade = 1.0 - uLights;
  vec3 lpH = vec3(0.0, 6.0, 2.1);
  vec3 aimH = normalize(vec3(0.0, -1.0, -0.22));
  vec3 dh = P - lpH; float distH = length(dh) + 1e-3;
  float coneH = smoothstep(0.95, 0.995, dot(dh / distH, aimH));
  float fallH = 1.0 / (1.0 + 0.09 * distH * distH);
  acc += vec3(1.0, 0.97, 0.9) * coneH * fallH * introFade * 1.2;
  return acc;
}

const int ROWS = 5;
const int COLS = 9;
const float COLGAP = 1.15;
const float ROWGAP = 1.4;
const float FRONTZ = 1.6;       // z of the front row (nearest the opening camera)

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
  float t = time;

  // ---- music → lights only ----
  float energy = 0.0, onset = 0.0;
  for (int i = 0; i < 128; i++) {
    energy += max(0.0, smoothedNoteStates[i] * 0.5 + 0.5);
    onset  += max(0.0, targetNoteStates[i]   * 0.5 + 0.5);
  }
  energy = clamp(energy / 18.0, 0.0, 1.0);
  onset  = clamp(onset  / 18.0, 0.0, 1.0);
  float li = 0.35 + 0.9 * energy + 0.5 * onset;

  // ---- staged camera (driven by the song's setVisual cues) ----
  float pull = uZoom;                                 // 0 close on hero .. 1 pulled back to the group
  float tour = uCamMove;                              // 0 locked .. 1 moving orbit/tour
  float q = t;                                        // orbit clock, blended in by uCamMove

  vec3 Cc = vec3(0.0, 0.0, -1.2);                     // crowd centre on the floor
  vec3 roIntro   = vec3(0.0, 0.75, FRONTZ + 2.1);
  vec3 lookIntro = vec3(0.0, 0.45, FRONTZ);
  vec3 roPull    = vec3(0.0, 2.4, FRONTZ + 7.5);
  vec3 lookPull  = vec3(0.0, 0.6, Cc.z);
  vec3 roDolly   = mix(roIntro, roPull, pull);
  vec3 lookDolly = mix(lookIntro, lookPull, pull);

  // moving tour: oscillate between a HIGH orbit looking down, and a LOW glide
  // through the crowd almost on the floor, looking UP at the dancers' faces.
  float aH = q * 0.45;
  float RH = 10.0 + 2.0 * sin(q * 0.2);
  vec3 roH   = Cc + vec3(sin(aH) * RH, 9.0 + 3.0 * sin(q * 0.27), cos(aH) * RH);
  vec3 lookH = Cc + vec3(0.0, 0.4, 0.0);
  float aL = q * 0.6 + 1.3;
  float RL = 4.3 + 1.3 * sin(q * 0.33);
  vec3 roL   = Cc + vec3(sin(aL) * RL, 0.16, cos(aL) * RL);                  // almost ON the floor
  vec3 lookL = Cc + vec3(sin(aL + 2.0) * 1.2, 0.55, cos(aL + 2.0) * 1.2);    // across the crowd at chest height → full bodies, low angle
  float m = 0.5 + 0.5 * sin(q * 0.38);                // high ↔ low, a bit faster
  vec3 roTour   = mix(roL, roH, m);
  vec3 lookTour = mix(lookL, lookH, m);

  vec3 ro     = mix(roDolly, roTour, tour);
  vec3 lookAt = mix(lookDolly, lookTour, tour);

  float focal = 1.8;
  vec3 fwd = normalize(lookAt - ro);
  vec3 rgt = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
  vec3 upv = cross(rgt, fwd);
  vec3 rd  = normalize(fwd + (uv.x * rgt + uv.y * upv) / focal);

  // ---- floor (3D plane y=0): tiles + light pools, and fog beams in the air ----
  vec3 col = vec3(0.01, 0.01, 0.02);
  float floorDist = 1e9;
  if (rd.y < -0.0005) {
    float fd = -ro.y / rd.y;
    if (fd > 0.0) {
      floorDist = fd;
      vec3 F = ro + rd * fd;
      float chk = mod(floor(F.x * 0.5) + floor(F.z * 0.5), 2.0);
      vec3 tile = mix(vec3(0.02, 0.02, 0.035), vec3(0.06, 0.06, 0.09), chk);
      vec3 pool = lightAt(F, t) * li * (0.4 + 0.5 * chk);          // glossy tiles reflect more
      float distFade = exp(-fd * 0.04);                            // fade toward the horizon
      col = min((tile + pool) * distFade * uFloor, vec3(1.2));     // floor fades in on the "floor" cue
    }
  }

  // volumetric beam haze: a few samples along the ray
  float maxd = min(floorDist, 26.0);
  vec3 fog = vec3(0.0);
  for (int k = 0; k < 6; k++) {
    float ft = (float(k) + 0.5) / 6.0;
    fog += lightAt(ro + rd * (ft * maxd), t);
  }
  col += fog * (maxd / 6.0) * 0.05 * li;

  // ---- crowd (camera-facing billboards standing on the floor) ----
  float beat = t * (BPM / 60.0);
  float crowdFade = uCrowd;                                  // crowd revealed on the "zoom out" cue
  float aa = 1.6 / resolution.y;
  float bestZ = 1e9, bestCov = 0.0;
  vec3  bestCol = vec3(1.0);
  for (int r = 0; r < ROWS; r++) {
    float fr = float(r);
    for (int c = 0; c < COLS; c++) {
      float fc = float(c) - float(COLS - 1) * 0.5;
      float stag = (mod(fr, 2.0) < 0.5) ? 0.0 : 0.5;
      vec3 base = vec3((fc + stag) * COLGAP, 0.0, FRONTZ - fr * ROWGAP);   // feet on the floor
      vec3 v = base - ro;
      float zc = dot(v, fwd);
      if (zc > 0.08) {
        vec2 sp = vec2(dot(v, rgt), dot(v, upv)) / zc * focal;            // feet on screen
        float sca = focal / zc * FIGSCALE;                                // local → screen scale
        vec2 cen = sp + vec2(0.0, 0.55 * sca);
        if (length(uv - cen) < 0.95 * sca) {           // generous bbox (no more head chop)
          float isHero = (r == 0 && c == 4) ? 1.0 : 0.0;
          float jitter = (hash21(vec2(fr, fc)) - 0.5) * 0.06;
          float yaw = (isHero > 0.5) ? 0.0 : (hash21(vec2(fr + 9.0, fc + 4.0)) - 0.5) * 0.9;
          vec3 WX = vec3(cos(yaw), 0.0, sin(yaw));      // sideways axis, FIXED in the world

          // pose — local 2D joints (same dance)
          float bb = beat + jitter;
          float ph = fract(bb), bi = floor(bb);
          float crouch = exp(-3.0 * ph);
          float wv = mix(sin(HALFPI * (bi - 1.0)), sin(HALFPI * bi), smoothstep(0.85, 1.0, ph));
          vec2 hip = vec2(0.0, -0.06 - 0.06 * crouch);
          vec2 shp = hip + vec2(0.0, 0.34);
          vec2 hc  = shp + vec2(0.0, 0.195);
          vec2 hb  = hc - vec2(0.0, 0.085);
          float fx = 0.12 + 0.02 * crouch;
          vec2 fLo = vec2(-fx, -0.46), fRo = vec2(fx, -0.46);
          vec2 hpL = hip + vec2(-0.06, 0.0), hpR = hip + vec2(0.06, 0.0);
          vec2 kLo = mix(hpL, fLo, 0.5) + vec2(-0.045 * crouch, 0.0);
          vec2 kRo = mix(hpR, fRo, 0.5) + vec2( 0.045 * crouch, 0.0);
          vec2 sLo = shp + vec2(-0.03, -0.02), sRo = shp + vec2(0.03, -0.02);
          float aUL = -0.22 * wv; vec2 eLo = sLo + 0.16 * vec2(-cos(aUL), sin(aUL));
          float aFL =  0.62 * wv; vec2 nLo = eLo + 0.15 * vec2(-cos(aFL), sin(aFL));
          float aUR =  0.22 * wv; vec2 eRo = sRo + 0.16 * vec2( cos(aUR), sin(aUR));
          float aFR = -0.62 * wv; vec2 nRo = eRo + 0.15 * vec2( cos(aFR), sin(aFR));

          // project all joints to screen
          vec2 Php = jp(hip, base, WX, ro, fwd, rgt, upv, focal);
          vec2 Psh = jp(shp, base, WX, ro, fwd, rgt, upv, focal);
          vec2 Phb = jp(hb,  base, WX, ro, fwd, rgt, upv, focal);
          vec2 Phc = jp(hc,  base, WX, ro, fwd, rgt, upv, focal);
          vec2 PhL = jp(hpL, base, WX, ro, fwd, rgt, upv, focal);
          vec2 PhR = jp(hpR, base, WX, ro, fwd, rgt, upv, focal);
          vec2 PkL = jp(kLo, base, WX, ro, fwd, rgt, upv, focal);
          vec2 PfL = jp(fLo, base, WX, ro, fwd, rgt, upv, focal);
          vec2 PkR = jp(kRo, base, WX, ro, fwd, rgt, upv, focal);
          vec2 PfR = jp(fRo, base, WX, ro, fwd, rgt, upv, focal);
          vec2 PsL = jp(sLo, base, WX, ro, fwd, rgt, upv, focal);
          vec2 PeL = jp(eLo, base, WX, ro, fwd, rgt, upv, focal);
          vec2 PnL = jp(nLo, base, WX, ro, fwd, rgt, upv, focal);
          vec2 PsR = jp(sRo, base, WX, ro, fwd, rgt, upv, focal);
          vec2 PeR = jp(eRo, base, WX, ro, fwd, rgt, upv, focal);
          vec2 PnR = jp(nRo, base, WX, ro, fwd, rgt, upv, focal);

          // ---- solid body: tapered capsules + torso/pelvis ellipses, smooth-blended ----
          float S = sca;
          float k = 0.040 * S;                       // limb-blend radius (rounds knees/elbows/shoulders)
          vec2 spineDir = Psh - Php;
          float spineLen = max(length(spineDir), 1e-4);
          spineDir /= spineLen;
          vec2 hipDir = PhR - PhL;
          hipDir = (length(hipDir) > 1e-4) ? normalize(hipDir) : vec2(1.0, 0.0);

          float dm = 1e9;
          // legs — thick at the hip, tapering to the ankle
          dm = smin(dm, capT(uv, PhL, PkL, 0.050 * S, 0.037 * S), k);
          dm = smin(dm, capT(uv, PkL, PfL, 0.037 * S, 0.024 * S), k);
          dm = smin(dm, capT(uv, PhR, PkR, 0.050 * S, 0.037 * S), k);
          dm = smin(dm, capT(uv, PkR, PfR, 0.037 * S, 0.024 * S), k);
          // arms — thick at the shoulder, tapering to the wrist
          dm = smin(dm, capT(uv, PsL, PeL, 0.050 * S, 0.031 * S), k);
          dm = smin(dm, capT(uv, PeL, PnL, 0.031 * S, 0.019 * S), k);
          dm = smin(dm, capT(uv, PsR, PeR, 0.050 * S, 0.031 * S), k);
          dm = smin(dm, capT(uv, PeR, PnR, 0.031 * S, 0.019 * S), k);
          // neck
          dm = smin(dm, capT(uv, Psh, Phb, 0.038 * S, 0.030 * S), k);
          // torso ellipse (along the spine) and a smaller pelvis ellipse (across the hips)
          vec2 torsoC = mix(Php, Psh, 0.53);
          dm = smin(dm, sdEll(uv, torsoC, spineDir, 0.50 * spineLen + 0.02 * S, 0.086 * S), k);
          dm = smin(dm, sdEll(uv, Php, hipDir, 0.072 * S, 0.056 * S), k);
          // head — kept a disc, only a light blend so the jaw meets the neck
          dm = smin(dm, length(uv - Phc) - 0.085 * S, 0.018 * S);

          float cov = smoothstep(aa, -aa, dm) * mix(crowdFade, uHero, isHero);
          if (cov > 0.01 && zc < bestZ) {                        // nearest covering dancer wins
            bestZ = zc; bestCov = cov;
            vec3 dc = 0.55 + 0.45 * cos(6.2831 * hash21(vec2(fr + 3.0, fc - 2.0)) + vec3(0.0, 2.1, 4.2));
            vec3 baseC = mix(dc, vec3(1.0), isHero);
            vec3 Lc = lightAt(base + vec3(0.0, 0.9, 0.0), t) * li;
            // a neutral fill arrives with the crowd so they read before the lights,
            // then gives way to the coloured rig once the lights are up
            float bright = 0.26 + 0.75 * uCrowd * (1.0 - uLights) + 1.2 * (Lc.r + Lc.g + Lc.b) / 3.0;
            bestCol = baseC * clamp(bright, 0.0, 1.6) + Lc * 0.12;
          }
        }
      }
    }
  }
  col = mix(col, bestCol, bestCov);

  col *= clamp(t / 1.5, 0.0, 1.0);                  // fade in

  // ---- "live agent" text layer: a typed terminal conversation ----
  // The song sends a 2-line white image per exchange (command on top, reply
  // below). The shader tints the command GREEN and the reply BLUE, and TYPES
  // each line in left-to-right using uTextMix as the per-text clock (0..1 over
  // its fade), with a thinking pause between the lines and a blinking cursor.
  vec2 tuv = gl_FragCoord.xy / resolution.xy;      // fresh 0..1 coords
  tuv.y = 1.0 - tuv.y;                             // texture rows upload top-first
  float p = uTextMix;                              // typing clock, 0..1 then holds
  bool isReply = tuv.y > 0.5;                      // bottom line = agent reply
  float e1 = clamp(p / 0.42, 0.0, 1.0);           // command types over 0.00..0.42
  float e2 = clamp((p - 0.55) / 0.42, 0.0, 1.0);  // reply types over 0.55..0.97
  float x0 = 0.03, x1 = 0.95;
  float revealX = x0 + (isReply ? e2 : e1) * (x1 - x0);
  float typed = 1.0 - smoothstep(revealX - 0.004, revealX + 0.004, tuv.x);  // 1 left of cursor
  vec4 tcur = texture2D(uText, tuv);
  vec3 tcol = isReply ? vec3(0.30, 0.64, 1.0) : vec3(0.28, 1.0, 0.44);      // blue reply / green cmd
  // dilated dark halo so the thin glyphs read over the bright crowd
  float halo = tcur.a;
  for (int i = 0; i < 8; i++) {
    float ha = 0.7853982 * float(i);
    halo = max(halo, texture2D(uText, tuv + vec2(cos(ha), sin(ha)) * 0.006).a);
  }
  halo *= typed;
  col = mix(col, vec3(0.0), clamp(halo, 0.0, 1.0) * 0.82);   // scrim/outline behind typed glyphs
  col = mix(col, tcol, clamp(tcur.a * typed, 0.0, 1.0));     // the typed, coloured glyphs
  // blinking block cursor at the edge of whichever line is currently typing
  bool active = isReply ? (p >= 0.55 && p < 0.99) : (p < 0.42);
  float lineY = isReply ? 0.545 : 0.455;
  if (active && step(0.5, fract(time * 2.2)) > 0.5 &&
      tuv.x > revealX && tuv.x < revealX + 0.013 && abs(tuv.y - lineY) < 0.026) {
    // only draw the cursor when real text sits just left of the edge, so it
    // parks at the end of a short line instead of floating off into empty space
    float near = 0.0;
    for (int k = 1; k <= 6; k++) {
      near = max(near, texture2D(uText, vec2(revealX - float(k) * 0.01, tuv.y)).a);
    }
    if (near > 0.05) col = mix(col, tcol, 0.9);
  }

  gl_FragColor = vec4(col, 1.0);
}
