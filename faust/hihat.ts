// Faust-generated Hihat
// Auto-transpiled from Faust DSP by faust2as.js (AS backend, native control/frame)
// Source: hihat.dsp

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

export class HihatDsp {
    fSampleRate: i32;
    fVec88: StaticArray<f32> = new StaticArray<f32>(2);
    fButton0: f32;
    fSlow0: f32;
    fConst1: f32;
    fConst2: f32;
    fConst3: f32;
    fConst6: f32;
    fConst7: f32;
    fConst8: f32;
    fConst9: f32;
    fConst10: f32;
    fHslider1: f32;
    fSlow1: f32;
    fConst11: f32;
    iRec562: i32;
    fRec615: StaticArray<f32> = new StaticArray<f32>(3);
    fRec629: StaticArray<f32> = new StaticArray<f32>(3);
    iRec177: i32;

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
        // ui openbox hihat
        // ui button gate
        // ui slider gain
        // ui closebox
    }
    static classInit(sample_rate: i32): void {
    }
    instanceResetUserInterface(): void {
        this.fButton0 = 0.0;
        this.fHslider1 = 0.5;
    }
    instanceClear(): void {
        for (let lDelay0: i32 = 0; lDelay0 < <i32>(2); lDelay0 = lDelay0 + 1) {
            this.fVec88[lDelay0] = 0.0;
        }
        this.iRec562 = <i32>(0);
        for (let lRec1: i32 = 0; lRec1 < <i32>(3); lRec1 = lRec1 + 1) {
            this.fRec615[lRec1] = 0.0;
        }
        for (let lRec2: i32 = 0; lRec2 < <i32>(3); lRec2 = lRec2 + 1) {
            this.fRec629[lRec2] = 0.0;
        }
        this.iRec177 = <i32>(0);
    }
    instanceConstants(sample_rate: i32): void {
        this.fSampleRate = sample_rate;
        let fConst0: f32 = min<f32>(192000.0, max<f32>(1.0, <f32>(this.fSampleRate)));
        this.fConst1 = max<f32>(1.0, (fConst0 * 0.0010000000474974513));
        this.fConst2 = (1.0 / this.fConst1);
        this.fConst3 = (1.0 / max<f32>(1.0, (fConst0 * 0.05000000074505806)));
        let fConst4: f32 = Mathf.tan((21991.1484375 / fConst0));
        let fConst5: f32 = (1.0 / fConst4);
        this.fConst6 = (((fConst5 - 1.8477590084075928) / fConst4) + 1.0);
        this.fConst7 = (((1.8477590084075928 + fConst5) / fConst4) + 1.0);
        this.fConst8 = (((fConst5 - 0.7653668522834778) / fConst4) + 1.0);
        this.fConst9 = (((0.7653668522834778 + fConst5) / fConst4) + 1.0);
        this.fConst10 = (1.0 / Mathf.pow(fConst4, 2.0));
        this.fConst11 = ((1.0 - this.fConst10) * 2.0);
    }
    instanceInit(sample_rate: i32): void {
        this.instanceConstants(sample_rate);
        this.instanceResetUserInterface();
        this.instanceClear();
    }
    init(sample_rate: i32): void {
        HihatDsp.classInit(sample_rate);
        this.instanceInit(sample_rate);
    }
    control(): void {
        this.fSlow0 = <f32>(this.fButton0);
        this.fSlow1 = (this.fConst10 * <f32>(this.fHslider1));
    }
    frame(inputs: StaticArray<f32>, outputs: StaticArray<f32>): void {
        let iRecCur562: i32 = ((<i32>(1103515245) * this.iRec562) + <i32>(12345));
        let fTemp0: f32 = this.fRec615[<i32>(1)];
        this.fRec615[<i32>(0)] = ((0.0000000004656612873077393 * <f32>(iRecCur562)) - (((this.fRec615[<i32>(2)] * this.fConst6) + (this.fConst11 * fTemp0)) / this.fConst7));
        let fTemp1: f32 = this.fRec629[<i32>(1)];
        this.fRec629[<i32>(0)] = ((this.fConst10 * (((this.fRec615[<i32>(0)] + this.fRec615[<i32>(2)]) - (2.0 * fTemp0)) / this.fConst7)) - (((this.fRec629[<i32>(2)] * this.fConst8) + (this.fConst11 * fTemp1)) / this.fConst9));
        this.fVec88[<i32>(0)] = this.fSlow0;
        let fTemp2: f32 = this.fVec88[<i32>(1)];
        let iRecCur177: i32 = (((this.iRec177 + (this.iRec177 > <i32>(0))) * (this.fSlow0 <= fTemp2)) + (this.fSlow0 > fTemp2));
        let fTemp3: f32 = <f32>(iRecCur177);
        outputs[<i32>(0)] = <f32>((this.fSlow1 * ((((this.fRec629[<i32>(0)] + this.fRec629[<i32>(2)]) - (2.0 * this.fRec629[<i32>(1)])) * max<f32>(min<f32>((this.fConst2 * fTemp3), ((this.fConst3 * (this.fConst1 - fTemp3)) + 1.0)), 0.0)) / this.fConst9)));
        this.iRec562 = iRecCur562;
        this.fRec615[<i32>(2)] = this.fRec615[<i32>(1)];
        this.fRec615[<i32>(1)] = this.fRec615[<i32>(0)];
        this.fRec629[<i32>(2)] = this.fRec629[<i32>(1)];
        this.fRec629[<i32>(1)] = this.fRec629[<i32>(0)];
        this.fVec88[<i32>(1)] = this.fVec88[<i32>(0)];
        this.iRec177 = iRecCur177;
    }
    compute(count: i32, inputs: Array<StaticArray<f32>>, outputs: Array<StaticArray<f32>>): void {
    }
}

export class Hihat extends MidiVoice {
    readonly dsp: HihatDsp = new HihatDsp();
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
        this.dsp.fHslider1 = <f32>velocity / 127.0;
        this.dsp.fButton0 = 0.0;
        this.dsp.control();
        this.dsp.frame(this.fin, this.fout);
        this.dsp.fButton0 = 1.0;
        this.dsp.control();
        this.silentSamples = 0;
        this.releaseSamples = 0;
    }

    noteoff(): void {
        this.dsp.fButton0 = 0.0;
        this.dsp.control();
        this.silentSamples = 0;
        this.releaseSamples = 0;
    }

    isDone(): boolean {
        return this.dsp.fButton0 == 0.0 && (this.silentSamples > 4410 || this.releaseSamples > 132300);
    }

    nextframe(): void {
        this.dsp.frame(this.fin, this.fout);
        const output: f32 = this.fout[0];
        if (Mathf.abs(output) < 0.001) {
            this.silentSamples++;
        } else {
            this.silentSamples = 0;
        }
        if (this.dsp.fButton0 == 0.0) this.releaseSamples++;
        this.channel.signal.addMonoSignal(output, 0.5, 0.5);
    }
}

export function initializeMidiSynth(): void {
    midichannels[0] = new MidiChannel(10, (channel: MidiChannel) => new Hihat(channel));
    midichannels[0].controlchange(7, 100);
    midichannels[0].controlchange(10, 64);
    midichannels[0].controlchange(91, 10);
}

export function postprocess(): void {
}
