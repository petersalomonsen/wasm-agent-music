setBPM(125);

addInstrument('kick');   // 0
addInstrument('hihat');  // 1
addInstrument('pad');    // 2
addInstrument('bass');   // 3
addInstrument('padlead');// 4



const kick  = createTrack(0, 4);
const hihat = createTrack(1, 4);
const pad   = createTrack(2, 4);
const bass  = createTrack(3, 4);
const padlead = createTrack(4);

function playPadlead() {
    padlead.play([[ 2.50, a6(0.53, 72) ],
    [ 3.01, c7(0.48, 94) ],
    [ 4.01, d7(0.94, 97) ],
    [ 4.95, c7(0.45, 83) ],
    [ 5.41, a6(0.54, 75) ],
    [ 5.99, c7(0.69, 88) ],
    [ 6.91, d7(0.56, 82) ],
    [ 7.50, c7(0.60, 98) ],
    [ 10.48, a6(0.47, 83) ],
    [ 10.98, c7(0.58, 94) ],
    [ 12.04, d7(1.08, 100) ],
    [ 13.04, c7(0.36, 77) ],
    [ 13.49, a6(0.40, 60) ],
    [ 13.94, c7(0.64, 78) ],
    [ 14.93, d7(0.44, 87) ],
    [ 15.45, f7(1.11, 95) ],
    [ 17.02, e7(0.42, 87) ],
    [ 18.00, c7(0.56, 97) ],
    [ 18.47, d7(0.54, 87) ],
    [ 19.46, f7(1.08, 92) ],
    [ 20.93, e7(0.50, 93) ],
    [ 21.91, c7(0.53, 98) ],
    [ 22.40, d7(0.65, 87) ],
    [ 23.42, f7(0.92, 88) ],
    [ 24.93, e7(0.62, 92) ],
    [ 25.95, c7(0.45, 94) ],
    [ 26.43, d7(0.71, 87) ],
    [ 27.42, a6(0.68, 89) ],
    [ 28.47, g6(0.73, 93) ],
    [ 29.45, f6(0.37, 68) ],
    [ 30.01, g6(0.50, 87) ],
    [ 30.47, a6(0.54, 83) ],
    [ 31.01, c7(0.62, 97) ]].quantize(4));
}





// === Intro: 16 beats (4 bars of drums + bass) ===
const introKick  = createTrack(0, 4);
const introHihat = createTrack(1, 4);
const introBass  = createTrack(3, 4);

for (let introRep = 0; introRep < 2; introRep++) {
    introBass.steps(4, [
        d2(0.2), d2(0.1), d2(0.2), d2(0.1),
        d2(0.2), d2(0.1), d2(0.2), d2(0.1),
        d2(0.2), d2(0.1), d2(0.2), d2(0.1),
        d3(0.2), d3(0.1), d3(0.2), d3(0.1),
    ].repeat(3));

    introHihat.steps(4, [ , , fs3, null ].repeat(15));
    await introKick.steps(4, [ c2, , , , ].repeat(15));
}

// === Sections pass 1 (no lead) + pass 2 (with lead) ===
for (let rep = 0; rep < 2; rep++) {
    if (rep === 1) playPadlead();

    // Section 1: D minor
    hihat.steps(4, [ , , fs3, null ].repeat(7));
    pad.steps(4, [ [d4, f4, a4], , [d4, f4, a4], , ].repeat(7));
    bass.steps(4, [ d2, null, d3, null ].repeat(7));
    await kick.steps(4, [ c2, , , , ].repeat(7));

    // Section 2: F major
    hihat.steps(4, [ , , fs3, null ].repeat(7));
    pad.steps(4, [ [f4, a4, c5], , [f4, a4, c5], , ].repeat(7));
    bass.steps(4, [ f2, null, f3, null ].repeat(7));
    await kick.steps(4, [ c2, , , , ].repeat(7));

    // Section 3: G major
    hihat.steps(4, [ , , fs3, null ].repeat(7));
    pad.steps(4, [ [g4, b4, d5], , [g4, b4, d5], , ].repeat(7));
    bass.steps(4, [ g2, null, g3, null ].repeat(7));
    await kick.steps(4, [ c2, , , , ].repeat(7));

    // Section 4a: A# major
    hihat.steps(4, [ , , fs3, null ].repeat(3));
    pad.steps(4, [ [as4, d5, f5], , [as4, d5, f5], , ].repeat(3));
    bass.steps(4, [ as2, null, as3, null ].repeat(3));
    await kick.steps(4, [ c2, , , , ].repeat(3));

    // Section 4b: C major
    hihat.steps(4, [ , , fs3, null ].repeat(3));
    pad.steps(4, [ [c5, e5, g5], , [c5, e5, g5], , ].repeat(3));
    bass.steps(4, [ c3, null, c4, null ].repeat(3));
    await kick.steps(4, [ c2, , , , ].repeat(3));
}

loopHere();