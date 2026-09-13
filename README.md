# Prompted

An italo-disco instrumental in D minor at 125 BPM,
made with **[WebAssembly Music](https://github.com/petersalomonsen/javascriptmusic)** —
a browser DAW where the notes, the arrangement, the synth instruments (written in
the [Faust](https://faust.grame.fr/) DSP language) and the reactive visuals are all
*code* that compiles to WebAssembly and runs live in the page.

The track was built by talking to the in-browser studio agent, and that is what the
title is about: the visualizer shows the song as a live agent conversation. Each part
is introduced by a green "prompt" typed out on screen, followed by a blue reply, one
bar before the change it describes actually happens — the pad coming in, the crowd of
dancers being revealed, the disco lights, the italo-disco bass, the running man,
the final pose. The prompts describe what the song already does; none of them alter it.

The human is still the composer: the arrangement was directed step by step, the leads,
chords and the closing synth solo were played in on a MIDI keyboard, and code was read
and edited by hand where it mattered. The agent wrote and reorganised code on
instruction.

## ▶ Play & edit it live

Open it straight in the app — it clones this repo, compiles, and plays entirely in
your browser:

**[▶ Open "Prompted" in WebAssembly Music](https://webassemblymusic.pages.dev/?gitrepo=wasm-music-prompted&remote=https://webassemblymusic.pages.dev/gitproxy/github.com/petersalomonsen/wasm-music-prompted.git)**

## What's in here

| file | what it is |
| --- | --- |
| `song.js` | the sequence — notes, arrangement, visual cues and the on-screen agent prompts |
| `synth.ts` | the synth: the instruments combined in AssemblyScript, plus the Zita-rev1 master reverb and mastering chain |
| `faust/` | the instruments — kick, hi-hat, snare, pads, italo bass, stab pad, solo lead and master reverb — in Faust |
| `shader.glsl` | the visualizer: a 3D stage of dancing figures under sweeping stage lights, with the typed-out prompt layer |
| `studioagent-session.json` | the conversation with the studio agent that built the song — it travels with the repo |

## Structure

| part | what happens |
| --- | --- |
| intro | four-on-the-floor kick, off-beat hats and a pulsing bass on D; the first dancer steps into the spotlight |
| verse / chorus | detuned saw pad over Dm–F–G–Bb–C, then a bright lead on top, harmonised in thirds on the last round |
| break / drop | brass-like stab chords take over, then an octave-pumping italo-disco bass under a recorded lead take |
| breakdown | warm low-pass pad chords with the lead melody over the beat |
| finale | six variation rounds stacking the recorded pad, lead and stab takes, a snare-roll build, an italo section, a live synth solo, and two final chords with the dancers frozen in pose |

## License

Music, code and visuals are © 2026 Peter J. Salomonsen and licensed under
[CC BY-NC 4.0](LICENSE): you may share and adapt this work for non-commercial
purposes with attribution.
