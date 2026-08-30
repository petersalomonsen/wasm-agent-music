setBPM(125);

addInstrument('kick');   // 0
addInstrument('hihat');  // 1
addInstrument('pad');    // 2
addInstrument('bass');   // 3
addInstrument('padlead');// 4

startRecording();

const kick  = createTrack(0, 4);
const hihat = createTrack(1, 4);
const pad   = createTrack(2, 4);
const bass  = createTrack(3, 4);
const padlead = createTrack(4);


createTrack(4).play([[ 2.50, a5(0.53, 72) ],
[ 3.01, c6(0.48, 94) ],
[ 4.01, d6(0.94, 97) ],
[ 4.95, c6(0.45, 83) ],
[ 5.41, a5(0.54, 75) ],
[ 5.99, c6(0.69, 88) ],
[ 6.91, d6(0.56, 82) ],
[ 7.50, c6(0.60, 98) ],
[ 10.48, a5(0.47, 83) ],
[ 10.98, c6(0.58, 94) ],
[ 12.04, d6(1.08, 100) ],
[ 13.04, c6(0.36, 77) ],
[ 13.49, a5(0.40, 60) ],
[ 13.94, c6(0.64, 78) ],
[ 14.93, d6(0.44, 87) ],
[ 15.45, f6(1.11, 95) ],
[ 17.02, e6(0.42, 87) ],
[ 18.00, c6(0.56, 97) ],
[ 18.47, d6(0.54, 87) ],
[ 19.46, f6(1.08, 92) ],
[ 20.93, e6(0.50, 93) ],
[ 21.91, c6(0.53, 98) ],
[ 22.40, d6(0.65, 87) ],
[ 23.42, f6(0.92, 88) ],
[ 24.93, e6(0.62, 92) ],
[ 25.95, c6(0.45, 94) ],
[ 26.43, d6(0.71, 87) ],
[ 27.42, a5(0.68, 89) ],
[ 28.47, g5(0.73, 93) ],
[ 29.45, f5(0.37, 68) ],
[ 30.01, g5(0.50, 87) ],
[ 30.47, a5(0.54, 83) ],
[ 31.01, c6(0.62, 97) ]].quantize(4));


// === Section 1: D minor (8 bars) ===
hihat.steps(4, [ , , fs3, null ].repeat(7));
pad.steps(4, [ [d4, f4, a4], , [d4, f4, a4], , ].repeat(7));
bass.steps(4, [ d2, null, d3, null ].repeat(7));
await kick.steps(4, [ c2, , , , ].repeat(7));

// === Section 2: F major (8 bars) ===
hihat.steps(4, [ , , fs3, null ].repeat(7));
pad.steps(4, [ [f4, a4, c5], , [f4, a4, c5], , ].repeat(7));
bass.steps(4, [ f2, null, f3, null ].repeat(7));
await kick.steps(4, [ c2, , , , ].repeat(7));

// === Section 3: G major (8 bars) ===
hihat.steps(4, [ , , fs3, null ].repeat(7));
pad.steps(4, [ [g4, b4, d5], , [g4, b4, d5], , ].repeat(7));
bass.steps(4, [ g2, null, g3, null ].repeat(7));
await kick.steps(4, [ c2, , , , ].repeat(7));

// === Section 4a: A# major (4 bars) ===
hihat.steps(4, [ , , fs3, null ].repeat(3));
pad.steps(4, [ [as4, d5, f5], , [as4, d5, f5], , ].repeat(3));
bass.steps(4, [ as2, null, as3, null ].repeat(3));
await kick.steps(4, [ c2, , , , ].repeat(3));

// === Section 4b: C major (4 bars) ===
hihat.steps(4, [ , , fs3, null ].repeat(3));
pad.steps(4, [ [c5, e5, g5], , [c5, e5, g5], , ].repeat(3));
bass.steps(4, [ c3, null, c4, null ].repeat(3));
await kick.steps(4, [ c2, , , , ].repeat(3));

stopRecording();

loopHere();