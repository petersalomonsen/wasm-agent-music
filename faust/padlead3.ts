// Faust-generated Padlead3
// Auto-transpiled from Faust DSP by faust2as.js (AS backend, native control/frame)
// Source: padlead3.dsp

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

export class Padlead3Dsp {
    fSampleRate: i32;
    iVec4: StaticArray<i32> = new StaticArray<i32>(2);
    fVec140: StaticArray<f32> = new StaticArray<f32>(2);
    fVec1265: StaticArray<f32> = new StaticArray<f32>(2);
    fVec1269: StaticArray<f32> = new StaticArray<f32>(4096);
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
    fRec1164: StaticArray<f32> = new StaticArray<f32>(2);
    fRec1164_1: StaticArray<f32> = new StaticArray<f32>(2);
    fRec1177: StaticArray<f32> = new StaticArray<f32>(2);
    fRec1177_1: StaticArray<f32> = new StaticArray<f32>(2);
    fRec1191: StaticArray<f32> = new StaticArray<f32>(2);
    fRec1191_1: StaticArray<f32> = new StaticArray<f32>(2);
    fRec1137: f32;
    fRec1288: StaticArray<f32> = new StaticArray<f32>(3);
    fRec1202: f32;
    iRec1212: i32;
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
        // ui openbox padlead3
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
        this.fHslider2 = 1.2000000476837158;
    }
    instanceClear(): void {
        for (let lDelay0: i32 = 0; lDelay0 < <i32>(2); lDelay0 = lDelay0 + 1) {
            this.iVec4[lDelay0] = <i32>(0);
        }
        for (let lDelay1: i32 = 0; lDelay1 < <i32>(2); lDelay1 = lDelay1 + 1) {
            this.fVec140[lDelay1] = 0.0;
        }
        for (let lDelay2: i32 = 0; lDelay2 < <i32>(2); lDelay2 = lDelay2 + 1) {
            this.fVec1265[lDelay2] = 0.0;
        }
        for (let lDelay3: i32 = 0; lDelay3 < <i32>(4096); lDelay3 = lDelay3 + 1) {
            this.fVec1269[lDelay3] = 0.0;
        }
        for (let lRec4: i32 = 0; lRec4 < <i32>(2); lRec4 = lRec4 + 1) {
            this.fRec1164[lRec4] = 0.0;
        }
        for (let lRec5: i32 = 0; lRec5 < <i32>(2); lRec5 = lRec5 + 1) {
            this.fRec1164_1[lRec5] = 0.0;
        }
        for (let lRec6: i32 = 0; lRec6 < <i32>(2); lRec6 = lRec6 + 1) {
            this.fRec1177[lRec6] = 0.0;
        }
        for (let lRec7: i32 = 0; lRec7 < <i32>(2); lRec7 = lRec7 + 1) {
            this.fRec1177_1[lRec7] = 0.0;
        }
        for (let lRec8: i32 = 0; lRec8 < <i32>(2); lRec8 = lRec8 + 1) {
            this.fRec1191[lRec8] = 0.0;
        }
        for (let lRec9: i32 = 0; lRec9 < <i32>(2); lRec9 = lRec9 + 1) {
            this.fRec1191_1[lRec9] = 0.0;
        }
        this.fRec1137 = 0.0;
        for (let lRec16: i32 = 0; lRec16 < <i32>(3); lRec16 = lRec16 + 1) {
            this.fRec1288[lRec16] = 0.0;
        }
        this.fRec1202 = 0.0;
        this.iRec1212 = <i32>(0);
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
        Padlead3Dsp.classInit(sample_rate);
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
        this.fSlow19 = (1.7999999523162842 * this.fSlow18);
        this.fSlow20 = (0.7739999890327454 * this.fSlow18);
        this.fSlow21 = (this.fConst12 / this.fSlow12);
    }
    frame(inputs: StaticArray<f32>, outputs: StaticArray<f32>): void {
        let fTemp0: f32 = this.fRec1164[<i32>(1)];
        let fTemp1: f32 = (this.fSlow4 + (fTemp0 - 1.0));
        let iTemp0: i32 = (fTemp1 < 0.0);
        let fTemp2: f32 = (this.fSlow4 + fTemp0);
        let fTemp3: f32 = this.fRec1177[<i32>(1)];
        let fTemp4: f32 = (this.fSlow6 + (fTemp3 - 1.0));
        let iTemp1: i32 = (fTemp4 < 0.0);
        let fTemp5: f32 = (this.fSlow6 + fTemp3);
        let fTemp6: f32 = this.fRec1191[<i32>(1)];
        let fTemp7: f32 = (this.fSlow9 + (fTemp6 - 1.0));
        let iTemp2: i32 = (fTemp7 < 0.0);
        let fTemp8: f32 = (this.fSlow9 + fTemp6);
        this.iVec4[<i32>(0)] = <i32>(1);
        let iTemp3: i32 = this.iVec4[<i32>(1)];
        let fTemp9: f32 = ((<i32>(1) - iTemp3) ? 0.0 : (this.fSlow13 + this.fRec1137));
        let fRecCur1137: f32 = (fTemp9 - Mathf.floor(fTemp9));
        let fTemp10: f32 = Mathf.pow(((2.0 * fRecCur1137) - 1.0), 2.0);
        this.fVec1265[<i32>(0)] = fTemp10;
        let fTemp11: f32 = (this.fSlow21 * (<f32>(iTemp3) * (fTemp10 - this.fVec1265[<i32>(1)])));
        this.fVec1269[(this.fIOTA & <i32>(4095))] = fTemp11;
        let fRecBody10: f32 = (iTemp0 ? fTemp2 : fTemp1);
        let fRecBody11: f32 = (iTemp0 ? fTemp2 : (this.fSlow4 + (fTemp0 + (this.fSlow2 * fTemp1))));
        this.fRec1164[<i32>(0)] = fRecBody10;
        this.fRec1164_1[<i32>(0)] = fRecBody11;
        let fRecBody12: f32 = (iTemp1 ? fTemp5 : fTemp4);
        let fRecBody13: f32 = (iTemp1 ? fTemp5 : (this.fSlow6 + (fTemp3 + (this.fSlow7 * fTemp4))));
        this.fRec1177[<i32>(0)] = fRecBody12;
        this.fRec1177_1[<i32>(0)] = fRecBody13;
        let fRecBody14: f32 = (iTemp2 ? fTemp8 : fTemp7);
        let fRecBody15: f32 = (iTemp2 ? fTemp8 : (this.fSlow9 + (fTemp6 + (this.fSlow10 * fTemp7))));
        this.fRec1191[<i32>(0)] = fRecBody14;
        this.fRec1191_1[<i32>(0)] = fRecBody15;
        this.fVec140[<i32>(0)] = this.fSlow3;
        let fRecCur1202: f32 = (this.fSlow3 + (this.fRec1202 * <f32>((this.fVec140[<i32>(1)] >= this.fSlow3))));
        let iRecCur1212: i32 = (this.iSlow0 * (this.iRec1212 + <i32>(1)));
        let fTemp12: f32 = <f32>(iRecCur1212);
        let fTemp13: f32 = Mathf.tan((this.fConst8 * ((4000.0 * max<f32>((min<f32>((this.fConst4 * fRecCur1202), max<f32>(((this.fConst6 * (this.fConst3 - fRecCur1202)) + 1.0), 0.6000000238418579)) * (1.0 - (this.fConst7 * fTemp12))), 0.0)) + 300.0)));
        let fTemp14: f32 = (1.0 / fTemp13);
        let fTemp15: f32 = this.fRec1288[<i32>(1)];
        let fTemp16: f32 = (((fTemp14 + 0.5) / fTemp13) + 1.0);
        this.fRec1288[<i32>(0)] = ((0.3125 * ((0.25 * (fTemp11 - ((this.fSlow17 * this.fVec1269[((this.fIOTA - this.iSlow1) & <i32>(4095))]) + (this.fSlow16 * this.fVec1269[((this.fIOTA - this.iSlow2) & <i32>(4095))])))) - ((2.0 * (1.0 - ((this.fRec1164_1[<i32>(0)] + this.fRec1177_1[<i32>(0)]) + this.fRec1191_1[<i32>(0)]))) + 1.0))) - (((this.fRec1288[<i32>(2)] * (((fTemp14 - 0.5) / fTemp13) + 1.0)) + (2.0 * (fTemp15 * (1.0 - (1.0 / Mathf.pow(fTemp13, 2.0)))))) / fTemp16));
        let fTemp17: f32 = (((this.fRec1288[<i32>(0)] + (2.0 * this.fRec1288[<i32>(1)])) + this.fRec1288[<i32>(2)]) * max<f32>((min<f32>((this.fConst10 * fRecCur1202), max<f32>(((this.fConst11 * (this.fConst9 - fRecCur1202)) + 1.0), 0.800000011920929)) * (1.0 - (this.fConst13 * fTemp12))), 0.0));
        outputs[<i32>(0)] = <f32>((this.fSlow20 * (fTemp17 / (fTemp16 * (Mathf.abs((this.fSlow19 * (fTemp17 / fTemp16))) + 1.0)))));
        this.iVec4[<i32>(1)] = this.iVec4[<i32>(0)];
        this.fRec1137 = fRecCur1137;
        this.fVec1265[<i32>(1)] = this.fVec1265[<i32>(0)];
        this.fRec1164[<i32>(1)] = this.fRec1164[<i32>(0)];
        this.fRec1164_1[<i32>(1)] = this.fRec1164_1[<i32>(0)];
        this.fRec1177[<i32>(1)] = this.fRec1177[<i32>(0)];
        this.fRec1177_1[<i32>(1)] = this.fRec1177_1[<i32>(0)];
        this.fRec1191[<i32>(1)] = this.fRec1191[<i32>(0)];
        this.fRec1191_1[<i32>(1)] = this.fRec1191_1[<i32>(0)];
        this.fVec140[<i32>(1)] = this.fVec140[<i32>(0)];
        this.fRec1202 = fRecCur1202;
        this.iRec1212 = iRecCur1212;
        this.fRec1288[<i32>(2)] = this.fRec1288[<i32>(1)];
        this.fRec1288[<i32>(1)] = this.fRec1288[<i32>(0)];
        this.fIOTA = (this.fIOTA + <i32>(1));
    }
    compute(count: i32, inputs: Array<StaticArray<f32>>, outputs: Array<StaticArray<f32>>): void {
    }
}

export class Padlead3 extends MidiVoice {
    readonly dsp: Padlead3Dsp = new Padlead3Dsp();
    private fin: StaticArray<f32> = new StaticArray<f32>(0);
    private fout: StaticArray<f32> = new StaticArray<f32>(1);
    private silentSamples: i32 = 0;
    private releaseSamples: i32 = 0;
    typedChannel!: Padlead3Channel;

    constructor(channel: MidiChannel) {
        super(channel);
        this.typedChannel = changetype<Padlead3Channel>(changetype<usize>(channel));
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

export class Padlead3EffectDsp {
    fSampleRate: i32;
    fHslider1: f32;
    fSlow0: f32;
    fHslider2: f32;
    fSlow1: f32;
    fConst0: f32;
    fHslider0: f32;
    fSlow2: f32;
    iSlow0: i32;
    iSlow1: i32;
    fSlow3: f32;
    fSlow4: f32;
    fSlow5: f32;
    iSlow2: i32;
    fRec132: StaticArray<f32> = new StaticArray<f32>(262144);
    fIOTA: i32;

    getSampleRate(): i32 {
        return this.fSampleRate;
    }
    getNumInputs(): i32 {
        return 1;
    }
    getNumOutputs(): i32 {
        return 1;
    }
    metadata(m: usize): void {
    }
    buildUserInterface(ui_interface: usize): void {
        // ui openbox padlead3
        // ui slider echotime
        // ui slider echofb
        // ui slider echomix
        // ui closebox
    }
    static classInit(sample_rate: i32): void {
    }
    instanceResetUserInterface(): void {
        this.fHslider1 = 0.6000000238418579;
        this.fHslider2 = 1.0;
        this.fHslider0 = 0.36000001430511475;
    }
    instanceClear(): void {
        for (let lRec0: i32 = 0; lRec0 < <i32>(262144); lRec0 = lRec0 + 1) {
            this.fRec132[lRec0] = 0.0;
        }
        this.fIOTA = <i32>(0);
    }
    instanceConstants(sample_rate: i32): void {
        this.fSampleRate = sample_rate;
        this.fConst0 = min<f32>(192000.0, max<f32>(1.0, <f32>(this.fSampleRate)));
    }
    instanceInit(sample_rate: i32): void {
        this.instanceConstants(sample_rate);
        this.instanceResetUserInterface();
        this.instanceClear();
    }
    init(sample_rate: i32): void {
        Padlead3EffectDsp.classInit(sample_rate);
        this.instanceInit(sample_rate);
    }
    control(): void {
        this.fSlow0 = <f32>(this.fHslider1);
        this.fSlow1 = <f32>(this.fHslider2);
        this.fSlow2 = (this.fConst0 * <f32>(this.fHslider0));
        this.iSlow0 = <i32>(this.fSlow2);
        this.iSlow1 = min<i32>(<i32>(131073), max<i32>(<i32>(0), this.iSlow0));
        this.fSlow3 = Mathf.floor(this.fSlow2);
        this.fSlow4 = (this.fSlow2 - this.fSlow3);
        this.fSlow5 = (this.fSlow3 + (1.0 - this.fSlow2));
        this.iSlow2 = min<i32>(<i32>(131073), max<i32>(<i32>(0), (this.iSlow0 + <i32>(1))));
    }
    frame(inputs: StaticArray<f32>, outputs: StaticArray<f32>): void {
        let fTemp0: f32 = <f32>(inputs[<i32>(0)]);
        let fTemp1: f32 = this.fRec132[((this.fIOTA - <i32>(1)) & <i32>(262143))];
        let iTemp0: i32 = (this.fIOTA & <i32>(262143));
        this.fRec132[iTemp0] = (fTemp0 + (this.fSlow0 * ((this.fSlow4 * this.fRec132[((this.fIOTA - (this.iSlow2 + <i32>(1))) & <i32>(262143))]) + (this.fSlow5 * this.fRec132[((this.fIOTA - (this.iSlow1 + <i32>(1))) & <i32>(262143))]))));
        outputs[<i32>(0)] = <f32>((fTemp0 + (this.fSlow1 * this.fRec132[iTemp0])));
        this.fIOTA = (this.fIOTA + <i32>(1));
    }
    compute(count: i32, inputs: Array<StaticArray<f32>>, outputs: Array<StaticArray<f32>>): void {
    }
}

export class Padlead3Channel extends MidiChannel {
    private _paramsDirty: bool = true;

    private _echotime: f32 = <f32>(0.36);
    /** echotime [init: 0.36, min: 0.02, max: 1.2, step: 0.001] */
    get echotime(): f32 { return this._echotime; }
    set echotime(value: f32) { this._echotime = value; this._paramsDirty = true; }
    private _echofb: f32 = <f32>(0.6);
    /** echofb [init: 0.6, min: 0, max: 0.95, step: 0.01] */
    get echofb(): f32 { return this._echofb; }
    set echofb(value: f32) { this._echofb = value; this._paramsDirty = true; }
    private _echomix: f32 = <f32>(1);
    /** echomix [init: 1, min: 0, max: 1, step: 0.01] */
    get echomix(): f32 { return this._echomix; }
    set echomix(value: f32) { this._echomix = value; this._paramsDirty = true; }

    readonly effectDsp: Padlead3EffectDsp = new Padlead3EffectDsp();
    private efin: StaticArray<f32> = new StaticArray<f32>(1);
    private efout: StaticArray<f32> = new StaticArray<f32>(1);

    constructor(numvoices: i32, factoryFunc: (channel: MidiChannel, voiceindex: i32) => MidiVoice) {
        super(numvoices, factoryFunc);
        this.effectDsp.init(<i32>SAMPLERATE);
    }

    private applyParams(): void {
        this.effectDsp.fHslider0 = this._echotime;
        this.effectDsp.fHslider1 = this._echofb;
        this.effectDsp.fHslider2 = this._echomix;
        this.effectDsp.control();
    }

    preprocess(): void {
        if (this._paramsDirty) {
            this._paramsDirty = false;
            this.applyParams();
        }
        this.efin[0] = this.signal.left;
        this.effectDsp.frame(this.efin, this.efout);
        this.signal.left = this.efout[0];
        this.signal.right = this.efout[0];
    }
}

export function initializeMidiSynth(): void {
    midichannels[0] = new Padlead3Channel(10, (channel: MidiChannel) => new Padlead3(channel));
    midichannels[0].controlchange(7, 100);
    midichannels[0].controlchange(10, 64);
    midichannels[0].controlchange(91, 10);
}

export function postprocess(): void {
}
