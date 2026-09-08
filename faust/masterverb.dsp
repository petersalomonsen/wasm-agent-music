import("stdfaust.lib");

// Master reverb bus — "industrial factory hall" via Zita-rev1 (Fons Adriaensen).
// The voice is silent (this instrument never plays notes); the reverb lives in `effect`,
// which the transpiler turns into MasterverbChannel.preprocess() operating in place on the
// channel's stereo signal. synth.ts instantiates that channel standalone and drives it over
// `outputline` from postprocess() — one global reverb across the whole mix.
process = 0.0;

rdel  = 60.0;    // pre-delay (ms) — sense of physical size
f1    = 200.0;   // low / mid crossover (Hz)
f2    = 7500.0;  // HF damping corner (Hz) — kept high so highs ring off hard surfaces (metallic)
t60dc = 3.0;     // RT60 at low frequencies (s)
t60m  = 4.5;     // RT60 at mid frequencies (s) — long, cavernous tail

effect = _, _ : re.zita_rev1_stereo(rdel, f1, f2, t60dc, t60m, 48000.0);
