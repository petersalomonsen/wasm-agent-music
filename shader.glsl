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
uniform float uItalo;     // 0 = one arm-move per beat .. 1 = italo 8th-note moves, mirroring every 2 beats
uniform float uRunning;   // 0 = front-facing dance .. 1 = turned sideways doing the running man (finale)
uniform float uEndPose;   // 0 = dancing .. 1 = frozen pose A .. 2 = frozen mirrored pose B (last two chords)

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

// running-man leg pose for eighth-note slot m (0..3): x = thigh angle (+ = forward), y = knee bend.
// slots step: back, back, knee-up, planted-front.
vec2 rmLeg(float m) {
  if (m < 0.5) return vec2( 0.00, 0.20);   // slot 0: standing foot centred under the hip (partner's knee is up)
  if (m < 1.5) return vec2(-0.50, 0.12);   // slot 1: trailing leg behind the hips (both feet down)
  if (m < 2.5) return vec2( 1.10, 1.60);   // slot 2: knee driven high up-front, shin tucked toward centre
  return vec2( 0.50, 0.15);                 // slot 3: foot planted in front of the hips (both feet down)
}

// running-man arm pose for slot m (0..3): x = upper-arm angle, y = forearm angle (both from vertical, + = forward).
// keyed to the SAME slot as that arm's leg, so the front-foot side raises while the trailing side drops.
vec2 rmArm(float m) {
  if (m < 0.5) return vec2( 0.00, 1.57);   // slot 0 (standing/middle): upper arm vertical, forearm forward
  if (m < 1.5) return vec2(-1.30, -0.10);  // slot 1 (behind): upper arm ~straight back, slightly down; forearm down
  if (m < 2.5) return vec2( 0.00, 1.57);   // slot 2 (knee up/middle): forearm forward
  return vec2( 1.30, 3.00);                 // slot 3 (front): upper arm ~straight out, slightly down; forearm up
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
    float cone = smoothstep(0.80, 0.95, dot(dir, aim));
    float fall = 1.0 / (1.0 + 0.035 * dist * dist);
    acc += cc * cone * fall * 1.9;
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

  // running-man finale rounds: sit in the theatre and drift slowly between rows — the front row is
  // low and close (near eye-level, so the front dancers loom and hide the rows behind), the back
  // rows are high and far (up over everyone, seeing the whole stage). The dancers all face +x, so
  // every seat sees them in clean profile.
  float seat = clamp(uRunning, 0.0, 1.0);
  float row = 0.5 + 0.5 * sin(t * 0.30);                       // 0 = front row .. 1 = back row
  vec3 roSeat   = mix(vec3(0.0, 1.5, 6.0),  vec3(0.0, 5.6, 13.2), row);
  vec3 lookSeat = mix(vec3(0.0, 1.25, -1.0), vec3(0.0, 0.55, -1.6), row);
  ro     = mix(ro,     roSeat,   seat);
  lookAt = mix(lookAt, lookSeat, seat);

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
          yaw = mix(yaw, 0.0, clamp(uRunning, 0.0, 1.0));   // running man: everyone turns the same way, seen in profile
          vec3 WX = vec3(cos(yaw), 0.0, sin(yaw));      // sideways axis, FIXED in the world

          // pose — local 2D joints (same dance)
          float bb = beat + jitter;
          float ph = fract(bb), bi = floor(bb);
          float crouch = exp(-3.0 * ph);
          // arms — normal: one snap per beat, 4-beat zigzag cycle (0,1,0,-1)
          float wvNormal = mix(sin(HALFPI * (bi - 1.0)), sin(HALFPI * bi), smoothstep(0.85, 1.0, ph));
          // arms — italo: 8th-note moves over a 2-BEAT cycle, arriving ON the beat.
          // Moves land on the kick (beat 1), the first off-beat hat, and the snare (beat 2);
          // the last off-beat hat is HELD. 3 moves per 2 beats is odd, so the next two beats
          // mirror the previous two. The swing happens in the TAIL of each 8th so the pose
          // arrives on the following hit — the same phrasing as the normal once-per-beat dance.
          float e8 = floor(bb * 2.0);                 // this 8th-note index
          float ef = fract(bb * 2.0);                 // phase within it
          float mThis = floor(e8 / 4.0) * 3.0 + min(mod(e8, 4.0), 2.0);          // slot 3 reuses slot 2 → held
          float e8n = e8 + 1.0;
          float mNext = floor(e8n / 4.0) * 3.0 + min(mod(e8n, 4.0), 2.0);
          float pThis = (mod(mThis, 2.0) < 0.5) ? 1.0 : -1.0;   // poses alternate +1 / -1
          float pNext = (mod(mNext, 2.0) < 0.5) ? 1.0 : -1.0;
          float wvItalo = mix(pThis, pNext, smoothstep(0.72, 1.0, ef));   // swing arrives on the next hit
          float wv = mix(wvNormal, wvItalo, clamp(uItalo, 0.0, 1.0));
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

          // ---- running man (finale): a SIDEWAYS profile drawn in this same plane, so
          // local x now reads as forward/back (the running direction). Blended in by
          // uRunning, leaving the normal/italo dance untouched. Legs alternate a knee-
          // drive on a 2-beat cycle (one knee pops up-front on the beat while the other
          // plants and slides back); arms pump in opposition; the torso leans forward. ----
          float rr = clamp(uRunning, 0.0, 1.0);
          if (rr > 0.001) {
            // 2-beat cycle of DISTINCT stepped poses, snapping onto kick / hi-hat / snare / off-beat.
            float e2 = floor(bb * 2.0);               // eighth-note index
            float ef = fract(bb * 2.0);               // phase within the eighth
            float snap = smoothstep(0.5, 1.0, ef);    // hold the pose, then step to the next ON the hit
            float bobR = 0.012 * (0.5 + 0.5 * cos(6.2831853 * ef));   // small drop between hits
            vec2 rhip = vec2(0.0, -0.05 + bobR);
            vec2 rshp = rhip + vec2(0.028, 0.34);     // torso leans slightly forward (+x)
            vec2 rhc  = rshp + vec2(0.03, 0.195);
            vec2 rhb  = rhc - vec2(0.0, 0.085);
            // two legs one beat (2 eighths) out of phase; leg A drives its knee up on the kick
            vec2 legA = mix(rmLeg(mod(e2 + 2.0, 4.0)), rmLeg(mod(e2 + 3.0, 4.0)), snap);   // (thigh, bend)
            vec2 legB = mix(rmLeg(mod(e2, 4.0)),       rmLeg(mod(e2 + 1.0, 4.0)), snap);
            float tAa = legA.x, sAa = legA.x - legA.y;
            vec2 rhipA = rhip;
            vec2 rkA = rhipA + 0.20 * vec2(sin(tAa), -cos(tAa));
            vec2 rfA = rkA   + 0.22 * vec2(sin(sAa), -cos(sAa));
            float tAb = legB.x, sAb = legB.x - legB.y;
            vec2 rhipB = rhip;
            vec2 rkB = rhipB + 0.20 * vec2(sin(tAb), -cos(tAb));
            vec2 rfB = rkB   + 0.22 * vec2(sin(sAb), -cos(sAb));
            // arms keyed to the same slots as the legs (see rmArm)
            vec2 armA = mix(rmArm(mod(e2 + 2.0, 4.0)), rmArm(mod(e2 + 3.0, 4.0)), snap);   // (upper, forearm) angles
            vec2 armB = mix(rmArm(mod(e2, 4.0)),       rmArm(mod(e2 + 1.0, 4.0)), snap);
            vec2 rsA = rshp + vec2( 0.03, -0.01);
            vec2 rsB = rshp + vec2(-0.03, -0.02);
            vec2 reA = rsA + 0.15 * vec2(sin(armA.x), -cos(armA.x));
            vec2 reB = rsB + 0.15 * vec2(sin(armB.x), -cos(armB.x));
            vec2 rnA = reA + 0.16 * vec2(sin(armA.y), -cos(armA.y));
            vec2 rnB = reB + 0.16 * vec2(sin(armB.y), -cos(armB.y));
            // blend every local joint toward the profile pose
            hip = mix(hip, rhip, rr); shp = mix(shp, rshp, rr); hc = mix(hc, rhc, rr); hb = mix(hb, rhb, rr);
            hpL = mix(hpL, rhipA, rr); kLo = mix(kLo, rkA, rr); fLo = mix(fLo, rfA, rr);
            hpR = mix(hpR, rhipB, rr); kRo = mix(kRo, rkB, rr); fRo = mix(fRo, rfB, rr);
            sLo = mix(sLo, rsA, rr); eLo = mix(eLo, reA, rr); nLo = mix(nLo, rnA, rr);
            sRo = mix(sRo, rsB, rr); eRo = mix(eRo, reB, rr); nRo = mix(nRo, rnB, rr);
          }

          // ---- ending pose (final round, last two chords): freeze the WHOLE body and just snap
          // between two mirrored disco-point positions on each chord stab, then hold — no in-between
          // dance. uEndPose steps 0 -> 1 -> 2 instantly on the stabs, so there is no easing. ----
          float endm = clamp(uEndPose, 0.0, 1.0);
          if (endm > 0.001) {
            float d = (uEndPose < 1.5) ? 1.0 : -1.0;             // pose A points one way, pose B mirrors it
            vec2 ehip = vec2(0.02 * d, -0.06);
            vec2 eshp = ehip + vec2(0.05 * d, 0.34);             // slight lean toward the point
            vec2 ehc  = eshp + vec2(0.02 * d, 0.195);
            vec2 ehb  = ehc - vec2(0.0, 0.085);
            vec2 ehpL = ehip + vec2(-0.06, 0.0), ehpR = ehip + vec2(0.06, 0.0);
            vec2 efL = vec2(-0.13, -0.46), efR = vec2(0.13, -0.46);   // feet planted apart, standing tall
            vec2 ekL = mix(ehpL, efL, 0.5), ekR = mix(ehpR, efR, 0.5);
            vec2 eshL = eshp + vec2(-0.03, -0.02), eshR = eshp + vec2(0.03, -0.02);
            vec2 upDir = normalize(vec2(d * 0.6, 1.0));           // extended arm: up-diagonal toward d
            vec2 dnDir = normalize(vec2(-d * 0.5, -0.85));        // other arm: down-diagonal away
            vec2 shUp = (d > 0.0) ? eshR : eshL;
            vec2 shDn = (d > 0.0) ? eshL : eshR;
            vec2 upE = shUp + 0.16 * upDir, upH = upE + 0.16 * upDir;
            vec2 dnE = shDn + 0.16 * dnDir, dnH = dnE + 0.16 * dnDir;
            vec2 eRoE = (d > 0.0) ? upE : dnE, nRoE = (d > 0.0) ? upH : dnH;
            vec2 eLoE = (d > 0.0) ? dnE : upE, nLoE = (d > 0.0) ? dnH : upH;
            hip = mix(hip, ehip, endm); shp = mix(shp, eshp, endm); hc = mix(hc, ehc, endm); hb = mix(hb, ehb, endm);
            hpL = mix(hpL, ehpL, endm); hpR = mix(hpR, ehpR, endm);
            kLo = mix(kLo, ekL, endm); kRo = mix(kRo, ekR, endm);
            fLo = mix(fLo, efL, endm); fRo = mix(fRo, efR, endm);
            sLo = mix(sLo, eshL, endm); sRo = mix(sRo, eshR, endm);
            eLo = mix(eLo, eLoE, endm); nLo = mix(nLo, nLoE, endm);
            eRo = mix(eRo, eRoE, endm); nRo = mix(nRo, nRoE, endm);
          }

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
            float bright = 0.26 + 0.75 * uCrowd * (1.0 - uLights) + 0.42 * uLights + 2.2 * (Lc.r + Lc.g + Lc.b) / 3.0;
            bestCol = baseC * clamp(bright, 0.0, 1.7) + Lc * 0.25;
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
