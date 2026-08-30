// Faust-generated Padlead
// Auto-transpiled from Faust DSP by faust2as.js (AS backend, native control/frame)
// Source: padlead.dsp

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

export class PadleadDsp {
    fSampleRate: i32;
    iVec4: StaticArray<i32> = new StaticArray<i32>(2);
    fVec140: StaticArray<f32> = new StaticArray<f32>(2);
    fVec1264: StaticArray<f32> = new StaticArray<f32>(2);
    fVec1268: StaticArray<f32> = new StaticArray<f32>(4096);
    fConst0: f32;
    fHslider0: f32;
    fSlow0: f32;
    fSlow1: f32;
    fSlow2: f32;
    fButton1: f32;
    fSlow3: f32;
    iSlow0: i32;
    fConst1: f32;
    fSlow4: f32;
    fSlow5: f32;
    fSlow6: f32;
    fSlow7: f32;
    fSlow8: f32;
    fSlow9: f32;
    fSlow10: f32;
    fSlow11: f32;
    fSlow12: f32;
    fSlow13: f32;
    fConst2: f32;
    fSlow14: f32;
    fSlow15: f32;
    fSlow16: f32;
    fSlow17: f32;
    iSlow1: i32;
    iSlow2: i32;
    fConst3: f32;
    fConst4: f32;
    fConst6: f32;
    fConst7: f32;
    fConst8: f32;
    fConst9: f32;
    fConst10: f32;
    fConst11: f32;
    fHslider2: f32;
    fSlow18: f32;
    fSlow19: f32;
    fSlow20: f32;
    fConst12: f32;
    fSlow21: f32;
    fConst13: f32;
    fRec1163: StaticArray<f32> = new StaticArray<f32>(2);
    fRec1163_1: StaticArray<f32> = new StaticArray<f32>(2);
    fRec1176: StaticArray<f32> = new StaticArray<f32>(2);
    fRec1176_1: StaticArray<f32> = new StaticArray<f32>(2);
    fRec1190: StaticArray<f32> = new StaticArray<f32>(2);
    fRec1190_1: StaticArray<f32> = new StaticArray<f32>(2);
    fRec1136: f32;
    fRec1287: StaticArray<f32> = new StaticArray<f32>(3);
    fRec1201: f32;
    iRec1211: i32;
    fIOTA: i32;

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
        // ui openbox padlead
        // ui slider freq
        // ui button gate
        // ui slider gain
        // ui closebox
    }
    static classInit(sample_rate: i32): void {
    }
    instanceResetUserInterface(): void {
        this.fHslider0 = 440.0;
        this.fButton1 = 0.0;
        this.fHslider2 = 0.6000000238418579;
    }
    instanceClear(): void {
        for (let lDelay0: i32 = 0; lDelay0 < <i32>(2); lDelay0 = lDelay0 + 1) {
            this.iVec4[lDelay0] = <i32>(0);
        }
        for (let lDelay1: i32 = 0; lDelay1 < <i32>(2); lDelay1 = lDelay1 + 1) {
            this.fVec140[lDelay1] = 0.0;
        }
        for (let lDelay2: i32 = 0; lDelay2 < <i32>(2); lDelay2 = lDelay2 + 1) {
            this.fVec1264[lDelay2] = 0.0;
        }
        for (let lDelay3: i32 = 0; lDelay3 < <i32>(4096); lDelay3 = lDelay3 + 1) {
            this.fVec1268[lDelay3] = 0.0;
        }
        for (let lRec4: i32 = 0; lRec4 < <i32>(2); lRec4 = lRec4 + 1) {
            this.fRec1163[lRec4] = 0.0;
        }
        for (let lRec5: i32 = 0; lRec5 < <i32>(2); lRec5 = lRec5 + 1) {
            this.fRec1163_1[lRec5] = 0.0;
        }
        for (let lRec6: i32 = 0; lRec6 < <i32>(2); lRec6 = lRec6 + 1) {
            this.fRec1176[lRec6] = 0.0;
        }
        for (let lRec7: i32 = 0; lRec7 < <i32>(2); lRec7 = lRec7 + 1) {
            this.fRec1176_1[lRec7] = 0.0;
        }
        for (let lRec8: i32 = 0; lRec8 < <i32>(2); lRec8 = lRec8 + 1) {
            this.fRec1190[lRec8] = 0.0;
        }
        for (let lRec9: i32 = 0; lRec9 < <i32>(2); lRec9 = lRec9 + 1) {
            this.fRec1190_1[lRec9] = 0.0;
        }
        this.fRec1136 = 0.0;
        for (let lRec16: i32 = 0; lRec16 < <i32>(3); lRec16 = lRec16 + 1) {
            this.fRec1287[lRec16] = 0.0;
        }
        this.fRec1201 = 0.0;
        this.iRec1211 = <i32>(0);
        this.fIOTA = <i32>(0);
    }
    instanceConstants(sample_rate: i32): void {
        this.fSampleRate = sample_rate;
        this.fConst0 = min<f32>(192000.0, max<f32>(1.0, <f32>(this.fSampleRate)));
        this.fConst1 = (1.0 / this.fConst0);
        this.fConst2 = (this.fConst0 * 0.5);
        this.fConst3 = max<f32>(1.0, (this.fConst0 * 0.009999999776482582));
        this.fConst4 = (1.0 / this.fConst3);
        let fConst5: f32 = max<f32>(1.0, (this.fConst0 * 0.20000000298023224));
        this.fConst6 = (0.4000000059604645 / fConst5);
        this.fConst7 = (1.0 / fConst5);
        this.fConst8 = (3.1415927410125732 / this.fConst0);
        this.fConst9 = max<f32>(1.0, (this.fConst0 * 0.014999999664723873));
        this.fConst10 = (1.0 / this.fConst9);
        this.fConst11 = (0.20000000298023224 / max<f32>(1.0, (this.fConst0 * 0.15000000596046448)));
        this.fConst12 = (this.fConst0 * 0.25);
        this.fConst13 = (1.0 / max<f32>(1.0, (this.fConst0 * 0.30000001192092896)));
    }
    instanceInit(sample_rate: i32): void {
        this.instanceConstants(sample_rate);
        this.instanceResetUserInterface();
        this.instanceClear();
    }
    init(sample_rate: i32): void {
        PadleadDsp.classInit(sample_rate);
        this.instanceInit(sample_rate);
    }
    control(): void {
        this.fSlow0 = <f32>(this.fHslider0);
        this.fSlow1 = max<f32>(0.00000011920928955078125, Mathf.abs(this.fSlow0));
        this.fSlow2 = (1.0 - (this.fConst0 / this.fSlow1));
        this.fSlow3 = <f32>(this.fButton1);
        this.iSlow0 = (this.fSlow3 == 0.0);
        this.fSlow4 = (this.fConst1 * this.fSlow1);
        this.fSlow5 = max<f32>(0.00000011920928955078125, Mathf.abs((1.0080000162124634 * this.fSlow0)));
        this.fSlow6 = (this.fConst1 * this.fSlow5);
        this.fSlow7 = (1.0 - (this.fConst0 / this.fSlow5));
        this.fSlow8 = max<f32>(0.00000011920928955078125, Mathf.abs((0.9920634627342224 * this.fSlow0)));
        this.fSlow9 = (this.fConst1 * this.fSlow8);
        this.fSlow10 = (1.0 - (this.fConst0 / this.fSlow8));
        this.fSlow11 = max<f32>((0.5 * this.fSlow0), 23.448949813842773);
        this.fSlow12 = max<f32>(20.0, Mathf.abs(this.fSlow11));
        this.fSlow13 = (this.fConst1 * this.fSlow12);
        this.fSlow14 = max<f32>(0.0, min<f32>(2047.0, (this.fConst2 / this.fSlow11)));
        this.fSlow15 = Mathf.floor(this.fSlow14);
        this.fSlow16 = (this.fSlow14 - this.fSlow15);
        this.fSlow17 = (this.fSlow15 + (1.0 - this.fSlow14));
        this.iSlow1 = <i32>(this.fSlow14);
        this.iSlow2 = (this.iSlow1 + <i32>(1));
        this.fSlow18 = <f32>(this.fHslider2);
        this.fSlow19 = (1.2999999523162842 * this.fSlow18);
        this.fSlow20 = (1.0399999618530273 * this.fSlow18);
        this.fSlow21 = (this.fConst12 / this.fSlow12);
    }
    frame(inputs: StaticArray<f32>, outputs: StaticArray<f32>): void {
        let fTemp0: f32 = this.fRec1163[<i32>(1)];
        let fTemp1: f32 = (this.fSlow4 + (fTemp0 - 1.0));
        let iTemp0: i32 = (fTemp1 < 0.0);
        let fTemp2: f32 = (this.fSlow4 + fTemp0);
        let fTemp3: f32 = this.fRec1176[<i32>(1)];
        let fTemp4: f32 = (this.fSlow6 + (fTemp3 - 1.0));
        let iTemp1: i32 = (fTemp4 < 0.0);
        let fTemp5: f32 = (this.fSlow6 + fTemp3);
        let fTemp6: f32 = this.fRec1190[<i32>(1)];
        let fTemp7: f32 = (this.fSlow9 + (fTemp6 - 1.0));
        let iTemp2: i32 = (fTemp7 < 0.0);
        let fTemp8: f32 = (this.fSlow9 + fTemp6);
        this.iVec4[<i32>(0)] = <i32>(1);
        let iTemp3: i32 = this.iVec4[<i32>(1)];
        let fTemp9: f32 = ((<i32>(1) - iTemp3) ? 0.0 : (this.fSlow13 + this.fRec1136));
        let fRecCur1136: f32 = (fTemp9 - Mathf.floor(fTemp9));
        let fTemp10: f32 = Mathf.pow(((2.0 * fRecCur1136) - 1.0), 2.0);
        this.fVec1264[<i32>(0)] = fTemp10;
        let fTemp11: f32 = (this.fSlow21 * (<f32>(iTemp3) * (fTemp10 - this.fVec1264[<i32>(1)])));
        this.fVec1268[(this.fIOTA & <i32>(4095))] = fTemp11;
        let fRecBody10: f32 = (iTemp0 ? fTemp2 : fTemp1);
        let fRecBody11: f32 = (iTemp0 ? fTemp2 : (this.fSlow4 + (fTemp0 + (this.fSlow2 * fTemp1))));
        this.fRec1163[<i32>(0)] = fRecBody10;
        this.fRec1163_1[<i32>(0)] = fRecBody11;
        let fRecBody12: f32 = (iTemp1 ? fTemp5 : fTemp4);
        let fRecBody13: f32 = (iTemp1 ? fTemp5 : (this.fSlow6 + (fTemp3 + (this.fSlow7 * fTemp4))));
        this.fRec1176[<i32>(0)] = fRecBody12;
        this.fRec1176_1[<i32>(0)] = fRecBody13;
        let fRecBody14: f32 = (iTemp2 ? fTemp8 : fTemp7);
        let fRecBody15: f32 = (iTemp2 ? fTemp8 : (this.fSlow9 + (fTemp6 + (this.fSlow10 * fTemp7))));
        this.fRec1190[<i32>(0)] = fRecBody14;
        this.fRec1190_1[<i32>(0)] = fRecBody15;
        this.fVec140[<i32>(0)] = this.fSlow3;
        let fRecCur1201: f32 = (this.fSlow3 + (this.fRec1201 * <f32>((this.fVec140[<i32>(1)] >= this.fSlow3))));
        let iRecCur1211: i32 = (this.iSlow0 * (this.iRec1211 + <i32>(1)));
        let fTemp12: f32 = <f32>(iRecCur1211);
        let fTemp13: f32 = Mathf.tan((this.fConst8 * ((4000.0 * max<f32>((min<f32>((this.fConst4 * fRecCur1201), max<f32>(((this.fConst6 * (this.fConst3 - fRecCur1201)) + 1.0), 0.6000000238418579)) * (1.0 - (this.fConst7 * fTemp12))), 0.0)) + 300.0)));
        let fTemp14: f32 = (1.0 / fTemp13);
        let fTemp15: f32 = this.fRec1287[<i32>(1)];
        let fTemp16: f32 = (((fTemp14 + 0.5) / fTemp13) + 1.0);
        this.fRec1287[<i32>(0)] = ((0.3125 * ((0.25 * (fTemp11 - ((this.fSlow17 * this.fVec1268[((this.fIOTA - this.iSlow1) & <i32>(4095))]) + (this.fSlow16 * this.fVec1268[((this.fIOTA - this.iSlow2) & <i32>(4095))])))) - ((2.0 * (1.0 - ((this.fRec1163_1[<i32>(0)] + this.fRec1176_1[<i32>(0)]) + this.fRec1190_1[<i32>(0)]))) + 1.0))) - (((this.fRec1287[<i32>(2)] * (((fTemp14 - 0.5) / fTemp13) + 1.0)) + (2.0 * (fTemp15 * (1.0 - (1.0 / Mathf.pow(fTemp13, 2.0)))))) / fTemp16));
        let fTemp17: f32 = (((this.fRec1287[<i32>(0)] + (2.0 * this.fRec1287[<i32>(1)])) + this.fRec1287[<i32>(2)]) * max<f32>((min<f32>((this.fConst10 * fRecCur1201), max<f32>(((this.fConst11 * (this.fConst9 - fRecCur1201)) + 1.0), 0.800000011920929)) * (1.0 - (this.fConst13 * fTemp12))), 0.0));
        outputs[<i32>(0)] = <f32>((this.fSlow20 * (fTemp17 / (fTemp16 * (Mathf.abs((this.fSlow19 * (fTemp17 / fTemp16))) + 1.0)))));
        this.iVec4[<i32>(1)] = this.iVec4[<i32>(0)];
        this.fRec1136 = fRecCur1136;
        this.fVec1264[<i32>(1)] = this.fVec1264[<i32>(0)];
        this.fRec1163[<i32>(1)] = this.fRec1163[<i32>(0)];
        this.fRec1163_1[<i32>(1)] = this.fRec1163_1[<i32>(0)];
        this.fRec1176[<i32>(1)] = this.fRec1176[<i32>(0)];
        this.fRec1176_1[<i32>(1)] = this.fRec1176_1[<i32>(0)];
        this.fRec1190[<i32>(1)] = this.fRec1190[<i32>(0)];
        this.fRec1190_1[<i32>(1)] = this.fRec1190_1[<i32>(0)];
        this.fVec140[<i32>(1)] = this.fVec140[<i32>(0)];
        this.fRec1201 = fRecCur1201;
        this.iRec1211 = iRecCur1211;
        this.fRec1287[<i32>(2)] = this.fRec1287[<i32>(1)];
        this.fRec1287[<i32>(1)] = this.fRec1287[<i32>(0)];
        this.fIOTA = (this.fIOTA + <i32>(1));
    }
    compute(count: i32, inputs: Array<StaticArray<f32>>, outputs: Array<StaticArray<f32>>): void {
    }
}

export class Padlead extends MidiVoice {
    readonly dsp: PadleadDsp = new PadleadDsp();
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
    midichannels[0] = new MidiChannel(10, (channel: MidiChannel) => new Padlead(channel));
    midichannels[0].controlchange(7, 100);
    midichannels[0].controlchange(10, 64);
    midichannels[0].controlchange(91, 10);
}

export function postprocess(): void {
}
