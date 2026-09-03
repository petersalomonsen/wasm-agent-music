setBPM(125);

addInstrument('kick');   // 0
addInstrument('hihat');  // 1
addInstrument('pad');    // 2
addInstrument('bass');   // 3
addInstrument('padlead');// 4
addInstrument('jumppad');// 5



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

// === Recorded jumppad chord take, arranged x4 (2 with intro bass, 2 with italo-disco bass) ===
function playJumpChords() {
    createTrack(5).play([[ 1.04, d6(0.53, 95) ],
    [ 1.03, a5(0.57, 99) ],
    [ 1.04, f5(0.56, 99) ],
    [ 1.98, e5(1.33, 88) ],
    [ 1.97, g5(1.34, 98) ],
    [ 2.00, c6(1.35, 97) ],
    [ 3.97, b5(1.05, 100) ],
    [ 3.98, d5(1.04, 89) ],
    [ 3.97, g5(1.08, 102) ],
    [ 5.41, g5(0.58, 104) ],
    [ 5.44, d5(0.60, 89) ],
    [ 5.43, b5(0.63, 104) ],
    [ 6.43, d5(1.50, 90) ],
    [ 6.41, as5(1.54, 94) ],
    [ 6.42, f5(1.56, 82) ],
    [ 8.91, f5(0.69, 92) ],
    [ 8.91, c5(0.73, 98) ],
    [ 8.90, a5(0.76, 94) ],
    [ 9.97, e5(1.62, 87) ],
    [ 9.95, c5(1.68, 88) ],
    [ 9.94, g5(1.71, 94) ],
    [ 12.06, g5(1.05, 90) ],
    [ 12.05, b4(1.06, 99) ],
    [ 12.03, d5(1.09, 95) ],
    [ 13.48, b4(0.56, 99) ],
    [ 13.50, g5(0.57, 97) ],
    [ 13.47, d5(0.68, 83) ],
    [ 14.46, as4(1.37, 96) ],
    [ 14.45, d5(1.38, 63) ],
    [ 14.48, f5(1.38, 88) ]].quantize(4));
}

function introBassLine() {
    introBass.steps(4, [
        d2(0.2), d2(0.1), d2(0.2), d2(0.1),
        d2(0.2), d2(0.1), d2(0.2), d2(0.1),
        d2(0.2), d2(0.1), d2(0.2), d2(0.1),
        d3(0.2), d3(0.1), d3(0.2), d3(0.1),
    ].repeat(3));
}

// Italo-disco octave-pulse bass, roots following the recorded chords: D C G A# F C G A#
function italoBassLine() {
    bass.steps(2, [
        d2, d3, d2, d3,      c2, c3, c2, c3,
        g2, g3, g2, g3,      as2, as3, as2, as3,
        f2, f3, f2, f3,      c2, c3, c2, c3,
        g2, g3, g2, g3,      as2, as3, as2, as3,
    ]);
}

function introHats() {
    introHihat.steps(4, [ , , fs3, null ].repeat(15));
}

// Playthrough 1 - the recorded take (recording armed for this bar)
startRecording();
playJumpChords();
introHats();
introBassLine();
await introKick.steps(4, [ c2, , , , ].repeat(15));
stopRecording();

// Playthrough 2 - repeat as-is (intro bass + drums)
playJumpChords();
introHats();
introBassLine();
await introKick.steps(4, [ c2, , , , ].repeat(15));

// Playthroughs 3 & 4 - italo-disco bass instead of intro bass
for (let r = 0; r < 2; r++) {
    playJumpChords();
    introHats();
    italoBassLine();
    await introKick.steps(4, [ c2, , , , ].repeat(15));
}

loopHere();