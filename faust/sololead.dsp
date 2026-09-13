import("stdfaust.lib");

// --- voice controls (MIDI) ---
freq = hslider("freq", 440, 20, 20000, 0.01);
gate = button("gate");
gain = hslider("gain", 0.5, 0, 1, 0.01);

// --- tweakable channel params ---
cutoff = hslider("cutoff", 600, 100, 8000, 1);
resonance = hslider("resonance", 1.5, 0.5, 20, 0.1);
drive = hslider("drive", 1.1, 0.5, 8, 0.1);

// --- delayed vibrato: sine LFO, depth ramps in only after the note is held ~0.5 s ---
vibrate = hslider("vibrate", 5.5, 1, 10, 0.1);
vibcents = hslider("vibcents", 20, 0, 100, 1);
vibdelay = 0.5;   // seconds before the vibrato starts to appear
vibramp = 0.6;    // seconds to reach full depth after that
held = (+(gate / ma.SR) : *(gate)) ~ _;            // seconds since note-on, resets at note-off
vibdepth = min(1, max(0, (held - vibdelay) / vibramp));
vfreq = freq * pow(2, (vibcents / 1200) * vibdepth * os.osc(vibrate));

// --- oscillator: ONE plain sawtooth at note pitch (no detune, no sub) ---
raw = os.sawtooth(vfreq);

// --- filter envelope: gentle, mostly static; small opening, subtle velocity brightness ---
fenv = en.adsr(0.006, 0.08, 0.5, 0.3, gate);
velbright = 0.7 + 0.3 * gain;
fc = min(10000, cutoff * (0.8 + 0.3 * gain) + fenv * velbright * 700);
filtered = raw : fi.resonlp(fc, resonance, 1);

// --- amp envelope: snappy, sustained, moderate release; velocity to level ---
aenv = en.adsr(0.013, 0.12, 0.8, 0.3, gate);
vel = 0.35 + 0.7 * gain;
sat(x) = ma.tanh(x);

process = (filtered * drive : sat) * aenv * vel * 1.2;

// --- channel effect: STEREO 2-in/2-out (verified applied by faust2as), built only from the proven
// single-recursion delay idiom (the earlier `rec ~ (_,_)` with-block + zita_rev1_stereo form produced silence) ---
echotime = hslider("echotime", 0.36, 0.01, 2.0, 0.001);   // dotted eighth at 125 BPM
echofb = hslider("echofb", 0.7, 0, 0.95, 0.01);
echomix = hslider("echomix", 0.6, 0, 1, 0.01);
dt = echotime * ma.SR;
// ping-pong: repeats 1,3,5.. on the left, 2,4,6.. on the right, each fed back by echofb.
// one feedback loop at 2*dt (gain fb^2) fed by the first repeat; the right tap is that loop delayed by dt (gain fb).
pingpong = de.fdelay(131072, dt) : *(echofb) : (+ ~ (de.fdelay(262144, 2 * dt) : *(echofb * echofb)))
           <: _, (de.fdelay(131072, dt) : *(echofb));
echostage(l, r) = ((l + r) * 0.5 : pingpong) : (*(echomix) : +(l)), (*(echomix) : +(r));

effect = echostage;
