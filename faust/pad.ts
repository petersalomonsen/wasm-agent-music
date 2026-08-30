// Faust-generated Pad
// Auto-transpiled from Faust DSP by faust2as.js (AS backend, native control/frame)
// Source: pad.dsp

import { notefreq, midichannels, MidiChannel, MidiVoice } from '../mixes/globalimports';
import { SAMPLERATE } from '../environment';

function _fmodf(a: f32, b: f32): f32 {
  return a % b;
}

function _remainderf(a: f32, b: f32): f32 {
  return a - _rintf(a / b) * b;
}

function _rintf(x: f32): f32 {
  let floor: f32 = Mathf.floor(x);
  let frac: f32 = x - floor;
  if (frac < 0.5) return floor;
  if (frac > 0.5) return floor + 1.0;
  let i: i32 = <i32>floor;
  return (i & 1) == 0 ? floor : floor + 1.0;
}

function _exp10f(x: f32): f32 {
  return Mathf.pow(10.0, x);
}

function _isnanf(x: f32): i32 {
  return isNaN<f32>(x) ? 1 : 0;
}

function _isinff(x: f32): i32 {
  return isFinite<f32>(x) ? 0 : (isNaN<f32>(x) ? 0 : 1);
}

function _copysignf(a: f32, b: f32): f32 {
  let sign: bool = b < 0.0 || (b == 0.0 && 1.0 / b < 0.0);
  return sign ? -Mathf.abs(a) : Mathf.abs(a);
}

function _fmod(a: f64, b: f64): f64 {
  return a % b;
}

function _remainder(a: f64, b: f64): f64 {
  return a - _rint(a / b) * b;
}

function _rint(x: f64): f64 {
  let floor: f64 = Math.floor(x);
  let frac: f64 = x - floor;
  if (frac < 0.5) return floor;
  if (frac > 0.5) return floor + 1.0;
  let i: i64 = <i64>floor;
  return (i & 1) == 0 ? floor : floor + 1.0;
}

function _exp10(x: f64): f64 {
  return Math.pow(10.0, x);
}

function _isnan(x: f64): i32 {
  return isNaN<f64>(x) ? 1 : 0;
}

function _isinf(x: f64): i32 {
  return isFinite<f64>(x) ? 0 : (isNaN<f64>(x) ? 0 : 1);
}

function _copysign(a: f64, b: f64): f64 {
  let sign: bool = b < 0.0 || (b == 0.0 && 1.0 / b < 0.0);
  return sign ? -Math.abs(a) : Math.abs(a);
}

export class PadDsp {
    fSampleRate: i32;
    fVec66: StaticArray<f32> = new StaticArray<f32>(2);
    fHslider2: f32;
    fSlow0: f32;
    fConst0: f32;
    fHslider0: f32;
    fSlow1: f32;
    fSlow2: f32;
    fSlow3: f32;
    fButton1: f32;
    fSlow4: f32;
    iSlow0: i32;
    fConst1: f32;
    fSlow5: f32;
    fSlow6: f32;
    fSlow7: f32;
    fSlow8: f32;
    fConst2: f32;
    fConst3: f32;
    fConst4: f32;
    fConst5: f32;
    fRec465: StaticArray<f32> = new StaticArray<f32>(2);
    fRec465_1: StaticArray<f32> = new StaticArray<f32>(2);
    fRec478: StaticArray<f32> = new StaticArray<f32>(2);
    fRec478_1: StaticArray<f32> = new StaticArray<f32>(2);
    fRec484: f32;
    iRec494: i32;

    getSampleRate(): i32 {
        return this.fSampleRate;
    }
    getNumInputs(): i32 {
        return 0;
    }
    getNumOutputs(): i32 {
        return 1;
    }
    metadata(m: usize): void {
    }
    buildUserInterface(ui_interface: usize): void {
        // ui openbox pad
        // ui slider freq
        // ui button gate
        // ui slider gain
        // ui closebox
    }
    static classInit(sample_rate: i32): void {
    }
    instanceResetUserInterface(): void {
        this.fHslider2 = 0.4000000059604645;
        this.fHslider0 = 293.6600036621094;
        this.fButton1 = 0.0;
    }
    instanceClear(): void {
        for (let lDelay0: i32 = 0; lDelay0 < <i32>(2); lDelay0 = lDelay0 + 1) {
            this.fVec66[lDelay0] = 0.0;
        }
        for (let lRec1: i32 = 0; lRec1 < <i32>(2); lRec1 = lRec1 + 1) {
            this.fRec465[lRec1] = 0.0;
        }
        for (let lRec2: i32 = 0; lRec2 < <i32>(2); lRec2 = lRec2 + 1) {
            this.fRec465_1[lRec2] = 0.0;
        }
        for (let lRec3: i32 = 0; lRec3 < <i32>(2); lRec3 = lRec3 + 1) {
            this.fRec478[lRec3] = 0.0;
        }
        for (let lRec4: i32 = 0; lRec4 < <i32>(2); lRec4 = lRec4 + 1) {
            this.fRec478_1[lRec4] = 0.0;
        }
        this.fRec484 = 0.0;
        this.iRec494 = <i32>(0);
    }
    instanceConstants(sample_rate: i32): void {
        this.fSampleRate = sample_rate;
        this.fConst0 = min<f32>(192000.0, max<f32>(1.0, <f32>(this.fSampleRate)));
        this.fConst1 = (1.0 / this.fConst0);
        this.fConst2 = max<f32>(1.0, (this.fConst0 * 0.30000001192092896));
        this.fConst3 = (1.0 / this.fConst2);
        this.fConst4 = (0.20000000298023224 / max<f32>(1.0, (this.fConst0 * 0.20000000298023224)));
        this.fConst5 = (1.0 / max<f32>(1.0, (this.fConst0 * 1.5)));
    }
    instanceInit(sample_rate: i32): void {
        this.instanceConstants(sample_rate);
        this.instanceResetUserInterface();
        this.instanceClear();
    }
    init(sample_rate: i32): void {
        PadDsp.classInit(sample_rate);
        this.instanceInit(sample_rate);
    }
    control(): void {
        this.fSlow0 = <f32>(this.fHslider2);
        this.fSlow1 = <f32>(this.fHslider0);
        this.fSlow2 = max<f32>(0.00000011920928955078125, Mathf.abs(this.fSlow1));
        this.fSlow3 = (1.0 - (this.fConst0 / this.fSlow2));
        this.fSlow4 = <f32>(this.fButton1);
        this.iSlow0 = (this.fSlow4 == 0.0);
        this.fSlow5 = (this.fConst1 * this.fSlow2);
        this.fSlow6 = max<f32>(0.00000011920928955078125, Mathf.abs((1.0049999952316284 * this.fSlow1)));
        this.fSlow7 = (this.fConst1 * this.fSlow6);
        this.fSlow8 = (1.0 - (this.fConst0 / this.fSlow6));
    }
    frame(inputs: StaticArray<f32>, outputs: StaticArray<f32>): void {
        let fTemp0: f32 = this.fRec465[<i32>(1)];
        let fTemp1: f32 = (this.fSlow5 + (fTemp0 - 1.0));
        let iTemp0: i32 = (fTemp1 < 0.0);
        let fTemp2: f32 = (this.fSlow5 + fTemp0);
        let fTemp3: f32 = this.fRec478[<i32>(1)];
        let fTemp4: f32 = (this.fSlow7 + (fTemp3 - 1.0));
        let iTemp1: i32 = (fTemp4 < 0.0);
        let fTemp5: f32 = (this.fSlow7 + fTemp3);
        let fRecBody5: f32 = (iTemp0 ? fTemp2 : fTemp1);
        let fRecBody6: f32 = (iTemp0 ? fTemp2 : (this.fSlow5 + (fTemp0 + (this.fSlow3 * fTemp1))));
        this.fRec465[<i32>(0)] = fRecBody5;
        this.fRec465_1[<i32>(0)] = fRecBody6;
        let fRecBody7: f32 = (iTemp1 ? fTemp5 : fTemp4);
        let fRecBody8: f32 = (iTemp1 ? fTemp5 : (this.fSlow7 + (fTemp3 + (this.fSlow8 * fTemp4))));
        this.fRec478[<i32>(0)] = fRecBody7;
        this.fRec478_1[<i32>(0)] = fRecBody8;
        this.fVec66[<i32>(0)] = this.fSlow4;
        let fRecCur484: f32 = (this.fSlow4 + (this.fRec484 * <f32>((this.fVec66[<i32>(1)] >= this.fSlow4))));
        let iRecCur494: i32 = (this.iSlow0 * (this.iRec494 + <i32>(1)));
        outputs[<i32>(0)] = <f32>((-1.0 * (this.fSlow0 * ((1.0 - (this.fRec465_1[<i32>(0)] + this.fRec478_1[<i32>(0)])) * max<f32>((min<f32>((this.fConst3 * fRecCur484), max<f32>(((this.fConst4 * (this.fConst2 - fRecCur484)) + 1.0), 0.800000011920929)) * (1.0 - (this.fConst5 * <f32>(iRecCur494)))), 0.0)))));
        this.fRec465[<i32>(1)] = this.fRec465[<i32>(0)];
        this.fRec465_1[<i32>(1)] = this.fRec465_1[<i32>(0)];
        this.fRec478[<i32>(1)] = this.fRec478[<i32>(0)];
        this.fRec478_1[<i32>(1)] = this.fRec478_1[<i32>(0)];
        this.fVec66[<i32>(1)] = this.fVec66[<i32>(0)];
        this.fRec484 = fRecCur484;
        this.iRec494 = iRecCur494;
    }
    compute(count: i32, inputs: Array<StaticArray<f32>>, outputs: Array<StaticArray<f32>>): void {
    }
}

export class Pad extends MidiVoice {
    readonly dsp: PadDsp = new PadDsp();
    private fin: StaticArray<f32> = new StaticArray<f32>(0);
    private fout: StaticArray<f32> = new StaticArray<f32>(1);
    private silentSamples: i32 = 0;
    private releaseSamples: i32 = 0;

    constructor(channel: MidiChannel) {
        super(channel);
        this.dsp.init(<i32>SAMPLERATE);
    }

    noteon(note: u8, velocity: u8): void {
        super.noteon(note, velocity);
        this.dsp.fHslider0 = notefreq(note);
        this.dsp.fHslider2 = <f32>velocity / 127.0;
        this.dsp.fButton1 = 0.0;
        this.dsp.control();
        this.dsp.frame(this.fin, this.fout);
        this.dsp.fButton1 = 1.0;
        this.dsp.control();
        this.silentSamples = 0;
        this.releaseSamples = 0;
    }

    noteoff(): void {
        this.dsp.fButton1 = 0.0;
        this.dsp.control();
        this.silentSamples = 0;
        this.releaseSamples = 0;
    }

    isDone(): boolean {
        return this.dsp.fButton1 == 0.0 && (this.silentSamples > 4410 || this.releaseSamples > 132300);
    }

    nextframe(): void {
        this.dsp.frame(this.fin, this.fout);
        const output: f32 = this.fout[0];
        if (Mathf.abs(output) < 0.001) {
            this.silentSamples++;
        } else {
            this.silentSamples = 0;
        }
        if (this.dsp.fButton1 == 0.0) this.releaseSamples++;
        this.channel.signal.addMonoSignal(output, 0.5, 0.5);
    }
}

export function initializeMidiSynth(): void {
    midichannels[0] = new MidiChannel(10, (channel: MidiChannel) => new Pad(channel));
    midichannels[0].controlchange(7, 100);
    midichannels[0].controlchange(10, 64);
    midichannels[0].controlchange(91, 10);
}

export function postprocess(): void {
}
