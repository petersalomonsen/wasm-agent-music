// Faust-generated Masterverb
// Auto-transpiled from Faust DSP by faust2as.js (AS backend, native control/frame)
// Source: masterverb.dsp

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

export class MasterverbDsp {
    fSampleRate: i32;

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
        // ui openbox masterverb
        // ui closebox
    }
    static classInit(sample_rate: i32): void {
    }
    instanceResetUserInterface(): void {
    }
    instanceClear(): void {
    }
    instanceConstants(sample_rate: i32): void {
        this.fSampleRate = sample_rate;
    }
    instanceInit(sample_rate: i32): void {
        this.instanceConstants(sample_rate);
        this.instanceResetUserInterface();
        this.instanceClear();
    }
    init(sample_rate: i32): void {
        MasterverbDsp.classInit(sample_rate);
        this.instanceInit(sample_rate);
    }
    control(): void {
    }
    frame(inputs: StaticArray<f32>, outputs: StaticArray<f32>): void {
        outputs[<i32>(0)] = <f32>(0.0);
    }
    compute(count: i32, inputs: Array<StaticArray<f32>>, outputs: Array<StaticArray<f32>>): void {
    }
}

export class Masterverb extends MidiVoice {
    readonly dsp: MasterverbDsp = new MasterverbDsp();
    private fin: StaticArray<f32> = new StaticArray<f32>(0);
    private fout: StaticArray<f32> = new StaticArray<f32>(1);
    private silentSamples: i32 = 0;
    private releaseSamples: i32 = 0;
    typedChannel!: MasterverbChannel;

    constructor(channel: MidiChannel) {
        super(channel);
        this.typedChannel = changetype<MasterverbChannel>(changetype<usize>(channel));
        this.dsp.init(<i32>SAMPLERATE);
    }

    noteon(note: u8, velocity: u8): void {
        super.noteon(note, velocity);
        this.dsp.control();
        this.silentSamples = 0;
        this.releaseSamples = 0;
    }

    noteoff(): void {
        this.silentSamples = 0;
        this.releaseSamples = 0;
    }

    isDone(): boolean {
        return this.silentSamples > 4410 || this.releaseSamples > 132300;
    }

    nextframe(): void {
        this.dsp.frame(this.fin, this.fout);
        const output: f32 = this.fout[0];
        if (Mathf.abs(output) < 0.001) {
            this.silentSamples++;
        } else {
            this.silentSamples = 0;
        }
        this.channel.signal.addMonoSignal(output, 0.5, 0.5);
    }
}

export class MasterverbEffectDsp {
    fSampleRate: i32;
    fVec108: StaticArray<f32> = new StaticArray<f32>(16384);
    fVec409: StaticArray<f32> = new StaticArray<f32>(16384);
    fVec4394: StaticArray<f32> = new StaticArray<f32>(32768);
    fVec4396: StaticArray<f32> = new StaticArray<f32>(4096);
    fVec4438: StaticArray<f32> = new StaticArray<f32>(16384);
    fVec4440: StaticArray<f32> = new StaticArray<f32>(4096);
    fVec4482: StaticArray<f32> = new StaticArray<f32>(16384);
    fVec4485: StaticArray<f32> = new StaticArray<f32>(4096);
    fVec4527: StaticArray<f32> = new StaticArray<f32>(16384);
    fVec4530: StaticArray<f32> = new StaticArray<f32>(2048);
    fVec4575: StaticArray<f32> = new StaticArray<f32>(16384);
    fVec4577: StaticArray<f32> = new StaticArray<f32>(2048);
    fVec4621: StaticArray<f32> = new StaticArray<f32>(16384);
    fVec4623: StaticArray<f32> = new StaticArray<f32>(4096);
    fVec4666: StaticArray<f32> = new StaticArray<f32>(32768);
    fVec4669: StaticArray<f32> = new StaticArray<f32>(4096);
    fVec4713: StaticArray<f32> = new StaticArray<f32>(32768);
    fVec4716: StaticArray<f32> = new StaticArray<f32>(2048);
    fConst2: f32;
    iConst0: i32;
    iConst1: i32;
    iConst2: i32;
    iConst3: i32;
    iConst4: i32;
    iConst5: i32;
    iConst6: i32;
    iConst7: i32;
    iConst8: i32;
    iConst9: i32;
    iConst10: i32;
    iConst11: i32;
    iConst12: i32;
    iConst13: i32;
    iConst14: i32;
    iConst15: i32;
    fConst19: f32;
    iConst16: i32;
    fConst21: f32;
    fConst27: f32;
    fConst28: f32;
    fConst29: f32;
    fConst30: f32;
    fConst36: f32;
    fConst37: f32;
    fConst38: f32;
    fConst39: f32;
    fConst45: f32;
    fConst46: f32;
    fConst47: f32;
    fConst48: f32;
    fConst54: f32;
    fConst55: f32;
    fConst56: f32;
    fConst57: f32;
    fConst63: f32;
    fConst64: f32;
    fConst65: f32;
    fConst66: f32;
    fConst72: f32;
    fConst73: f32;
    fConst74: f32;
    fConst75: f32;
    fConst81: f32;
    fConst82: f32;
    fConst83: f32;
    fConst84: f32;
    fConst90: f32;
    fConst91: f32;
    fConst92: f32;
    fRec4827: StaticArray<f32> = new StaticArray<f32>(3);
    fRec4827_1: StaticArray<f32> = new StaticArray<f32>(3);
    fRec4827_2: StaticArray<f32> = new StaticArray<f32>(3);
    fRec4827_3: StaticArray<f32> = new StaticArray<f32>(3);
    fRec4827_4: StaticArray<f32> = new StaticArray<f32>(3);
    fRec4827_5: StaticArray<f32> = new StaticArray<f32>(3);
    fRec4827_6: StaticArray<f32> = new StaticArray<f32>(3);
    fRec4827_7: StaticArray<f32> = new StaticArray<f32>(3);
    fRec4391: f32;
    fRec4381: f32;
    fRec4401: StaticArray<f32> = new StaticArray<f32>(2);
    fRec4401_1: StaticArray<f32> = new StaticArray<f32>(2);
    fRec4435: f32;
    fRec4425: f32;
    fRec4445: StaticArray<f32> = new StaticArray<f32>(2);
    fRec4445_1: StaticArray<f32> = new StaticArray<f32>(2);
    fRec4479: f32;
    fRec4469: f32;
    fRec4490: StaticArray<f32> = new StaticArray<f32>(2);
    fRec4490_1: StaticArray<f32> = new StaticArray<f32>(2);
    fRec4524: f32;
    fRec4514: f32;
    fRec4535: StaticArray<f32> = new StaticArray<f32>(2);
    fRec4535_1: StaticArray<f32> = new StaticArray<f32>(2);
    fRec4572: f32;
    fRec4562: f32;
    fRec4582: StaticArray<f32> = new StaticArray<f32>(2);
    fRec4582_1: StaticArray<f32> = new StaticArray<f32>(2);
    fRec4628: StaticArray<f32> = new StaticArray<f32>(2);
    fRec4628_1: StaticArray<f32> = new StaticArray<f32>(2);
    fRec4618: f32;
    fRec4608: f32;
    fRec4675: StaticArray<f32> = new StaticArray<f32>(2);
    fRec4675_1: StaticArray<f32> = new StaticArray<f32>(2);
    fRec4663: f32;
    fRec4653: f32;
    fRec4722: StaticArray<f32> = new StaticArray<f32>(2);
    fRec4722_1: StaticArray<f32> = new StaticArray<f32>(2);
    fRec4710: f32;
    fRec4700: f32;
    fIOTA: i32;

    getSampleRate(): i32 {
        return this.fSampleRate;
    }
    getNumInputs(): i32 {
        return 2;
    }
    getNumOutputs(): i32 {
        return 2;
    }
    metadata(m: usize): void {
    }
    buildUserInterface(ui_interface: usize): void {
        // ui openbox masterverb
        // ui closebox
    }
    static classInit(sample_rate: i32): void {
    }
    instanceResetUserInterface(): void {
    }
    instanceClear(): void {
        for (let lDelay0: i32 = 0; lDelay0 < <i32>(16384); lDelay0 = lDelay0 + 1) {
            this.fVec108[lDelay0] = 0.0;
        }
        for (let lDelay1: i32 = 0; lDelay1 < <i32>(16384); lDelay1 = lDelay1 + 1) {
            this.fVec409[lDelay1] = 0.0;
        }
        for (let lDelay2: i32 = 0; lDelay2 < <i32>(32768); lDelay2 = lDelay2 + 1) {
            this.fVec4394[lDelay2] = 0.0;
        }
        for (let lDelay3: i32 = 0; lDelay3 < <i32>(4096); lDelay3 = lDelay3 + 1) {
            this.fVec4396[lDelay3] = 0.0;
        }
        for (let lDelay4: i32 = 0; lDelay4 < <i32>(16384); lDelay4 = lDelay4 + 1) {
            this.fVec4438[lDelay4] = 0.0;
        }
        for (let lDelay5: i32 = 0; lDelay5 < <i32>(4096); lDelay5 = lDelay5 + 1) {
            this.fVec4440[lDelay5] = 0.0;
        }
        for (let lDelay6: i32 = 0; lDelay6 < <i32>(16384); lDelay6 = lDelay6 + 1) {
            this.fVec4482[lDelay6] = 0.0;
        }
        for (let lDelay7: i32 = 0; lDelay7 < <i32>(4096); lDelay7 = lDelay7 + 1) {
            this.fVec4485[lDelay7] = 0.0;
        }
        for (let lDelay8: i32 = 0; lDelay8 < <i32>(16384); lDelay8 = lDelay8 + 1) {
            this.fVec4527[lDelay8] = 0.0;
        }
        for (let lDelay9: i32 = 0; lDelay9 < <i32>(2048); lDelay9 = lDelay9 + 1) {
            this.fVec4530[lDelay9] = 0.0;
        }
        for (let lDelay10: i32 = 0; lDelay10 < <i32>(16384); lDelay10 = lDelay10 + 1) {
            this.fVec4575[lDelay10] = 0.0;
        }
        for (let lDelay11: i32 = 0; lDelay11 < <i32>(2048); lDelay11 = lDelay11 + 1) {
            this.fVec4577[lDelay11] = 0.0;
        }
        for (let lDelay12: i32 = 0; lDelay12 < <i32>(16384); lDelay12 = lDelay12 + 1) {
            this.fVec4621[lDelay12] = 0.0;
        }
        for (let lDelay13: i32 = 0; lDelay13 < <i32>(4096); lDelay13 = lDelay13 + 1) {
            this.fVec4623[lDelay13] = 0.0;
        }
        for (let lDelay14: i32 = 0; lDelay14 < <i32>(32768); lDelay14 = lDelay14 + 1) {
            this.fVec4666[lDelay14] = 0.0;
        }
        for (let lDelay15: i32 = 0; lDelay15 < <i32>(4096); lDelay15 = lDelay15 + 1) {
            this.fVec4669[lDelay15] = 0.0;
        }
        for (let lDelay16: i32 = 0; lDelay16 < <i32>(32768); lDelay16 = lDelay16 + 1) {
            this.fVec4713[lDelay16] = 0.0;
        }
        for (let lDelay17: i32 = 0; lDelay17 < <i32>(2048); lDelay17 = lDelay17 + 1) {
            this.fVec4716[lDelay17] = 0.0;
        }
        for (let lRec18: i32 = 0; lRec18 < <i32>(3); lRec18 = lRec18 + 1) {
            this.fRec4827[lRec18] = 0.0;
        }
        for (let lRec19: i32 = 0; lRec19 < <i32>(3); lRec19 = lRec19 + 1) {
            this.fRec4827_1[lRec19] = 0.0;
        }
        for (let lRec20: i32 = 0; lRec20 < <i32>(3); lRec20 = lRec20 + 1) {
            this.fRec4827_2[lRec20] = 0.0;
        }
        for (let lRec21: i32 = 0; lRec21 < <i32>(3); lRec21 = lRec21 + 1) {
            this.fRec4827_3[lRec21] = 0.0;
        }
        for (let lRec22: i32 = 0; lRec22 < <i32>(3); lRec22 = lRec22 + 1) {
            this.fRec4827_4[lRec22] = 0.0;
        }
        for (let lRec23: i32 = 0; lRec23 < <i32>(3); lRec23 = lRec23 + 1) {
            this.fRec4827_5[lRec23] = 0.0;
        }
        for (let lRec24: i32 = 0; lRec24 < <i32>(3); lRec24 = lRec24 + 1) {
            this.fRec4827_6[lRec24] = 0.0;
        }
        for (let lRec25: i32 = 0; lRec25 < <i32>(3); lRec25 = lRec25 + 1) {
            this.fRec4827_7[lRec25] = 0.0;
        }
        this.fRec4391 = 0.0;
        this.fRec4381 = 0.0;
        for (let lRec26: i32 = 0; lRec26 < <i32>(2); lRec26 = lRec26 + 1) {
            this.fRec4401[lRec26] = 0.0;
        }
        for (let lRec27: i32 = 0; lRec27 < <i32>(2); lRec27 = lRec27 + 1) {
            this.fRec4401_1[lRec27] = 0.0;
        }
        this.fRec4435 = 0.0;
        this.fRec4425 = 0.0;
        for (let lRec30: i32 = 0; lRec30 < <i32>(2); lRec30 = lRec30 + 1) {
            this.fRec4445[lRec30] = 0.0;
        }
        for (let lRec31: i32 = 0; lRec31 < <i32>(2); lRec31 = lRec31 + 1) {
            this.fRec4445_1[lRec31] = 0.0;
        }
        this.fRec4479 = 0.0;
        this.fRec4469 = 0.0;
        for (let lRec34: i32 = 0; lRec34 < <i32>(2); lRec34 = lRec34 + 1) {
            this.fRec4490[lRec34] = 0.0;
        }
        for (let lRec35: i32 = 0; lRec35 < <i32>(2); lRec35 = lRec35 + 1) {
            this.fRec4490_1[lRec35] = 0.0;
        }
        this.fRec4524 = 0.0;
        this.fRec4514 = 0.0;
        for (let lRec38: i32 = 0; lRec38 < <i32>(2); lRec38 = lRec38 + 1) {
            this.fRec4535[lRec38] = 0.0;
        }
        for (let lRec39: i32 = 0; lRec39 < <i32>(2); lRec39 = lRec39 + 1) {
            this.fRec4535_1[lRec39] = 0.0;
        }
        this.fRec4572 = 0.0;
        this.fRec4562 = 0.0;
        for (let lRec42: i32 = 0; lRec42 < <i32>(2); lRec42 = lRec42 + 1) {
            this.fRec4582[lRec42] = 0.0;
        }
        for (let lRec43: i32 = 0; lRec43 < <i32>(2); lRec43 = lRec43 + 1) {
            this.fRec4582_1[lRec43] = 0.0;
        }
        for (let lRec46: i32 = 0; lRec46 < <i32>(2); lRec46 = lRec46 + 1) {
            this.fRec4628[lRec46] = 0.0;
        }
        for (let lRec47: i32 = 0; lRec47 < <i32>(2); lRec47 = lRec47 + 1) {
            this.fRec4628_1[lRec47] = 0.0;
        }
        this.fRec4618 = 0.0;
        this.fRec4608 = 0.0;
        for (let lRec50: i32 = 0; lRec50 < <i32>(2); lRec50 = lRec50 + 1) {
            this.fRec4675[lRec50] = 0.0;
        }
        for (let lRec51: i32 = 0; lRec51 < <i32>(2); lRec51 = lRec51 + 1) {
            this.fRec4675_1[lRec51] = 0.0;
        }
        this.fRec4663 = 0.0;
        this.fRec4653 = 0.0;
        for (let lRec54: i32 = 0; lRec54 < <i32>(2); lRec54 = lRec54 + 1) {
            this.fRec4722[lRec54] = 0.0;
        }
        for (let lRec55: i32 = 0; lRec55 < <i32>(2); lRec55 = lRec55 + 1) {
            this.fRec4722_1[lRec55] = 0.0;
        }
        this.fRec4710 = 0.0;
        this.fRec4700 = 0.0;
        this.fIOTA = <i32>(0);
    }
    instanceConstants(sample_rate: i32): void {
        this.fSampleRate = sample_rate;
        let fConst0: f32 = min<f32>(192000.0, max<f32>(1.0, <f32>(this.fSampleRate)));
        let fConst1: f32 = (1.0 / Mathf.tan((628.3185424804688 / fConst0)));
        this.fConst2 = (1.0 - fConst1);
        let fConst3: f32 = Mathf.floor((0.5 + (fConst0 * 0.1531289964914322)));
        let fConst4: f32 = Mathf.floor((0.5 + (fConst0 * 0.02034600079059601)));
        this.iConst0 = <i32>(min<f32>(8192.0, max<f32>(0.0, (fConst3 - fConst4))));
        this.iConst1 = <i32>(min<f32>(1024.0, max<f32>(0.0, (fConst4 - 1.0))));
        let fConst5: f32 = Mathf.floor((0.5 + (fConst0 * 0.17471300065517426)));
        let fConst6: f32 = Mathf.floor((0.5 + (fConst0 * 0.02290399931371212)));
        this.iConst2 = <i32>(min<f32>(8192.0, max<f32>(0.0, (fConst5 - fConst6))));
        this.iConst3 = <i32>(min<f32>(2048.0, max<f32>(0.0, (fConst6 - 1.0))));
        let fConst7: f32 = Mathf.floor((0.5 + (fConst0 * 0.12783700227737427)));
        let fConst8: f32 = Mathf.floor((0.5 + (fConst0 * 0.03160399943590164)));
        this.iConst4 = <i32>(min<f32>(8192.0, max<f32>(0.0, (fConst7 - fConst8))));
        this.iConst5 = <i32>(min<f32>(2048.0, max<f32>(0.0, (fConst8 - 1.0))));
        let fConst9: f32 = Mathf.floor((0.5 + (fConst0 * 0.125)));
        let fConst10: f32 = Mathf.floor((0.5 + (fConst0 * 0.01345799956470728)));
        this.iConst6 = <i32>(min<f32>(8192.0, max<f32>(0.0, (fConst9 - fConst10))));
        this.iConst7 = <i32>(min<f32>(1024.0, max<f32>(0.0, (fConst10 - 1.0))));
        let fConst11: f32 = Mathf.floor((0.5 + (fConst0 * 0.21038900315761566)));
        let fConst12: f32 = Mathf.floor((0.5 + (fConst0 * 0.024421000853180885)));
        this.iConst8 = <i32>(min<f32>(16384.0, max<f32>(0.0, (fConst11 - fConst12))));
        this.iConst9 = <i32>(min<f32>(2048.0, max<f32>(0.0, (fConst12 - 1.0))));
        let fConst13: f32 = Mathf.floor((0.5 + (fConst0 * 0.19230300188064575)));
        let fConst14: f32 = Mathf.floor((0.5 + (fConst0 * 0.029291000217199326)));
        this.iConst10 = <i32>(min<f32>(8192.0, max<f32>(0.0, (fConst13 - fConst14))));
        this.iConst11 = <i32>(min<f32>(2048.0, max<f32>(0.0, (fConst14 - 1.0))));
        let fConst15: f32 = Mathf.floor((0.5 + (fConst0 * 0.25689101219177246)));
        let fConst16: f32 = Mathf.floor((0.5 + (fConst0 * 0.027333000674843788)));
        this.iConst12 = <i32>(min<f32>(16384.0, max<f32>(0.0, (fConst15 - fConst16))));
        this.iConst13 = <i32>(min<f32>(2048.0, max<f32>(0.0, (fConst16 - 1.0))));
        let fConst17: f32 = Mathf.floor((0.5 + (fConst0 * 0.21999099850654602)));
        let fConst18: f32 = Mathf.floor((0.5 + (fConst0 * 0.019122999161481857)));
        this.iConst14 = <i32>(min<f32>(16384.0, max<f32>(0.0, (fConst17 - fConst18))));
        this.iConst15 = <i32>(min<f32>(1024.0, max<f32>(0.0, (fConst18 - 1.0))));
        this.fConst19 = (1.0 / (1.0 + fConst1));
        this.iConst16 = <i32>(min<f32>(8192.0, max<f32>(0.0, (fConst0 * 0.05999999865889549))));
        let fConst20: f32 = Mathf.cos((47123.890625 / fConst0));
        this.fConst21 = Mathf.exp((-1.0 * ((fConst11 * 1.535056710243225) / fConst0)));
        let fConst22: f32 = Mathf.pow(this.fConst21, 2.0);
        let fConst23: f32 = (1.0 - (fConst20 * fConst22));
        let fConst24: f32 = (1.0 - fConst22);
        let fConst25: f32 = (fConst23 / fConst24);
        let fConst26: f32 = Mathf.sqrt(max<f32>(0.0, ((Mathf.pow(fConst23, 2.0) / Mathf.pow(fConst24, 2.0)) - 1.0)));
        this.fConst27 = (fConst25 - fConst26);
        this.fConst28 = ((Mathf.exp((-1.0 * ((fConst11 * 2.3025851249694824) / fConst0))) / this.fConst21) - 1.0);
        this.fConst29 = ((1.0 + fConst26) - fConst25);
        this.fConst30 = Mathf.exp((-1.0 * ((fConst7 * 1.535056710243225) / fConst0)));
        let fConst31: f32 = Mathf.pow(this.fConst30, 2.0);
        let fConst32: f32 = (1.0 - (fConst20 * fConst31));
        let fConst33: f32 = (1.0 - fConst31);
        let fConst34: f32 = (fConst32 / fConst33);
        let fConst35: f32 = Mathf.sqrt(max<f32>(0.0, ((Mathf.pow(fConst32, 2.0) / Mathf.pow(fConst33, 2.0)) - 1.0)));
        this.fConst36 = (fConst34 - fConst35);
        this.fConst37 = ((Mathf.exp((-1.0 * ((fConst7 * 2.3025851249694824) / fConst0))) / this.fConst30) - 1.0);
        this.fConst38 = ((1.0 + fConst35) - fConst34);
        this.fConst39 = Mathf.exp((-1.0 * ((fConst5 * 1.535056710243225) / fConst0)));
        let fConst40: f32 = Mathf.pow(this.fConst39, 2.0);
        let fConst41: f32 = (1.0 - (fConst20 * fConst40));
        let fConst42: f32 = (1.0 - fConst40);
        let fConst43: f32 = (fConst41 / fConst42);
        let fConst44: f32 = Mathf.sqrt(max<f32>(0.0, ((Mathf.pow(fConst41, 2.0) / Mathf.pow(fConst42, 2.0)) - 1.0)));
        this.fConst45 = (fConst43 - fConst44);
        this.fConst46 = ((Mathf.exp((-1.0 * ((fConst5 * 2.3025851249694824) / fConst0))) / this.fConst39) - 1.0);
        this.fConst47 = ((1.0 + fConst44) - fConst43);
        this.fConst48 = Mathf.exp((-1.0 * ((fConst3 * 1.535056710243225) / fConst0)));
        let fConst49: f32 = Mathf.pow(this.fConst48, 2.0);
        let fConst50: f32 = (1.0 - (fConst20 * fConst49));
        let fConst51: f32 = (1.0 - fConst49);
        let fConst52: f32 = (fConst50 / fConst51);
        let fConst53: f32 = Mathf.sqrt(max<f32>(0.0, ((Mathf.pow(fConst50, 2.0) / Mathf.pow(fConst51, 2.0)) - 1.0)));
        this.fConst54 = (fConst52 - fConst53);
        this.fConst55 = ((Mathf.exp((-1.0 * ((fConst3 * 2.3025851249694824) / fConst0))) / this.fConst48) - 1.0);
        this.fConst56 = ((1.0 + fConst53) - fConst52);
        this.fConst57 = Mathf.exp((-1.0 * ((fConst9 * 1.535056710243225) / fConst0)));
        let fConst58: f32 = Mathf.pow(this.fConst57, 2.0);
        let fConst59: f32 = (1.0 - (fConst20 * fConst58));
        let fConst60: f32 = (1.0 - fConst58);
        let fConst61: f32 = (fConst59 / fConst60);
        let fConst62: f32 = Mathf.sqrt(max<f32>(0.0, ((Mathf.pow(fConst59, 2.0) / Mathf.pow(fConst60, 2.0)) - 1.0)));
        this.fConst63 = (fConst61 - fConst62);
        this.fConst64 = ((Mathf.exp((-1.0 * ((fConst9 * 2.3025851249694824) / fConst0))) / this.fConst57) - 1.0);
        this.fConst65 = ((1.0 + fConst62) - fConst61);
        this.fConst66 = Mathf.exp((-1.0 * ((fConst13 * 1.535056710243225) / fConst0)));
        let fConst67: f32 = Mathf.pow(this.fConst66, 2.0);
        let fConst68: f32 = (1.0 - (fConst20 * fConst67));
        let fConst69: f32 = (1.0 - fConst67);
        let fConst70: f32 = (fConst68 / fConst69);
        let fConst71: f32 = Mathf.sqrt(max<f32>(0.0, ((Mathf.pow(fConst68, 2.0) / Mathf.pow(fConst69, 2.0)) - 1.0)));
        this.fConst72 = (fConst70 - fConst71);
        this.fConst73 = ((Mathf.exp((-1.0 * ((fConst13 * 2.3025851249694824) / fConst0))) / this.fConst66) - 1.0);
        this.fConst74 = ((1.0 + fConst71) - fConst70);
        this.fConst75 = Mathf.exp((-1.0 * ((fConst15 * 1.535056710243225) / fConst0)));
        let fConst76: f32 = Mathf.pow(this.fConst75, 2.0);
        let fConst77: f32 = (1.0 - (fConst20 * fConst76));
        let fConst78: f32 = (1.0 - fConst76);
        let fConst79: f32 = (fConst77 / fConst78);
        let fConst80: f32 = Mathf.sqrt(max<f32>(0.0, ((Mathf.pow(fConst77, 2.0) / Mathf.pow(fConst78, 2.0)) - 1.0)));
        this.fConst81 = (fConst79 - fConst80);
        this.fConst82 = ((Mathf.exp((-1.0 * ((fConst15 * 2.3025851249694824) / fConst0))) / this.fConst75) - 1.0);
        this.fConst83 = ((1.0 + fConst80) - fConst79);
        this.fConst84 = Mathf.exp((-1.0 * ((fConst17 * 1.535056710243225) / fConst0)));
        let fConst85: f32 = Mathf.pow(this.fConst84, 2.0);
        let fConst86: f32 = (1.0 - (fConst20 * fConst85));
        let fConst87: f32 = (1.0 - fConst85);
        let fConst88: f32 = (fConst86 / fConst87);
        let fConst89: f32 = Mathf.sqrt(max<f32>(0.0, ((Mathf.pow(fConst86, 2.0) / Mathf.pow(fConst87, 2.0)) - 1.0)));
        this.fConst90 = (fConst88 - fConst89);
        this.fConst91 = ((Mathf.exp((-1.0 * ((fConst17 * 2.3025851249694824) / fConst0))) / this.fConst84) - 1.0);
        this.fConst92 = ((1.0 + fConst89) - fConst88);
    }
    instanceInit(sample_rate: i32): void {
        this.instanceConstants(sample_rate);
        this.instanceResetUserInterface();
        this.instanceClear();
    }
    init(sample_rate: i32): void {
        MasterverbEffectDsp.classInit(sample_rate);
        this.instanceInit(sample_rate);
    }
    control(): void {
    }
    frame(inputs: StaticArray<f32>, outputs: StaticArray<f32>): void {
        let fTemp0: f32 = this.fRec4827_1[<i32>(1)];
        let fRecCur4381: f32 = (-1.0 * (this.fConst19 * ((this.fConst2 * this.fRec4381) - (fTemp0 + this.fRec4827_1[<i32>(2)]))));
        let fRecCur4391: f32 = ((this.fConst27 * this.fRec4391) + (this.fConst21 * ((fTemp0 + (this.fConst28 * fRecCur4381)) * this.fConst29)));
        let iTemp0: i32 = (this.fIOTA & <i32>(32767));
        this.fVec4394[iTemp0] = ((0.3535533845424652 * fRecCur4391) + 0.000000000000000000009999999682655225);
        let iTemp1: i32 = (this.fIOTA & <i32>(16383));
        this.fVec409[iTemp1] = <f32>(inputs[<i32>(1)]);
        let iTemp2: i32 = ((this.fIOTA - this.iConst16) & <i32>(16383));
        let fTemp1: f32 = (0.30000001192092896 * this.fVec409[iTemp2]);
        let fTemp2: f32 = (this.fVec4394[((this.fIOTA - this.iConst8) & <i32>(32767))] + ((0.6000000238418579 * this.fRec4401[<i32>(1)]) + fTemp1));
        let iTemp3: i32 = (this.fIOTA & <i32>(4095));
        this.fVec4396[iTemp3] = fTemp2;
        let fRecBody28: f32 = this.fVec4396[((this.fIOTA - this.iConst9) & <i32>(4095))];
        let fRecBody29: f32 = (-0.6000000238418579 * fTemp2);
        this.fRec4401[<i32>(0)] = fRecBody28;
        this.fRec4401_1[<i32>(0)] = fRecBody29;
        let fTemp3: f32 = this.fRec4827_2[<i32>(1)];
        let fRecCur4425: f32 = (-1.0 * (this.fConst19 * ((this.fConst2 * this.fRec4425) - (fTemp3 + this.fRec4827_2[<i32>(2)]))));
        let fRecCur4435: f32 = ((this.fConst36 * this.fRec4435) + (this.fConst30 * ((fTemp3 + (this.fConst37 * fRecCur4425)) * this.fConst38)));
        this.fVec4438[iTemp1] = ((0.3535533845424652 * fRecCur4435) + 0.000000000000000000009999999682655225);
        this.fVec108[iTemp1] = <f32>(inputs[<i32>(0)]);
        let fTemp4: f32 = (0.30000001192092896 * this.fVec108[iTemp2]);
        let fTemp5: f32 = (this.fVec4438[((this.fIOTA - this.iConst4) & <i32>(16383))] - (fTemp4 + (0.6000000238418579 * this.fRec4445[<i32>(1)])));
        this.fVec4440[iTemp3] = fTemp5;
        let fRecBody32: f32 = this.fVec4440[((this.fIOTA - this.iConst5) & <i32>(4095))];
        let fRecBody33: f32 = (0.6000000238418579 * fTemp5);
        this.fRec4445[<i32>(0)] = fRecBody32;
        this.fRec4445_1[<i32>(0)] = fRecBody33;
        let fTemp6: f32 = this.fRec4827_4[<i32>(1)];
        let fRecCur4469: f32 = (-1.0 * (this.fConst19 * ((this.fConst2 * this.fRec4469) - (fTemp6 + this.fRec4827_4[<i32>(2)]))));
        let fRecCur4479: f32 = ((this.fConst45 * this.fRec4479) + (this.fConst39 * ((fTemp6 + (this.fConst46 * fRecCur4469)) * this.fConst47)));
        this.fVec4482[iTemp1] = ((0.3535533845424652 * fRecCur4479) + 0.000000000000000000009999999682655225);
        let fTemp7: f32 = ((fTemp4 + this.fVec4482[((this.fIOTA - this.iConst2) & <i32>(16383))]) - (0.6000000238418579 * this.fRec4490[<i32>(1)]));
        this.fVec4485[iTemp3] = fTemp7;
        let fRecBody36: f32 = this.fVec4485[((this.fIOTA - this.iConst3) & <i32>(4095))];
        let fRecBody37: f32 = (0.6000000238418579 * fTemp7);
        this.fRec4490[<i32>(0)] = fRecBody36;
        this.fRec4490_1[<i32>(0)] = fRecBody37;
        let fTemp8: f32 = this.fRec4827[<i32>(1)];
        let fRecCur4514: f32 = (-1.0 * (this.fConst19 * ((this.fConst2 * this.fRec4514) - (fTemp8 + this.fRec4827[<i32>(2)]))));
        let fRecCur4524: f32 = ((this.fConst54 * this.fRec4524) + (this.fConst48 * ((fTemp8 + (this.fConst55 * fRecCur4514)) * this.fConst56)));
        this.fVec4527[iTemp1] = ((0.3535533845424652 * fRecCur4524) + 0.000000000000000000009999999682655225);
        let fTemp9: f32 = ((fTemp4 + this.fVec4527[((this.fIOTA - this.iConst0) & <i32>(16383))]) - (0.6000000238418579 * this.fRec4535[<i32>(1)]));
        let iTemp4: i32 = (this.fIOTA & <i32>(2047));
        this.fVec4530[iTemp4] = fTemp9;
        let fRecBody40: f32 = this.fVec4530[((this.fIOTA - this.iConst1) & <i32>(2047))];
        let fRecBody41: f32 = (0.6000000238418579 * fTemp9);
        this.fRec4535[<i32>(0)] = fRecBody40;
        this.fRec4535_1[<i32>(0)] = fRecBody41;
        let fTemp10: f32 = this.fRec4827_6[<i32>(1)];
        let fRecCur4562: f32 = (-1.0 * (this.fConst19 * ((this.fConst2 * this.fRec4562) - (fTemp10 + this.fRec4827_6[<i32>(2)]))));
        let fRecCur4572: f32 = ((this.fConst63 * this.fRec4572) + (this.fConst57 * ((fTemp10 + (this.fConst64 * fRecCur4562)) * this.fConst65)));
        this.fVec4575[iTemp1] = ((0.3535533845424652 * fRecCur4572) + 0.000000000000000000009999999682655225);
        let fTemp11: f32 = (this.fVec4575[((this.fIOTA - this.iConst6) & <i32>(16383))] - (fTemp4 + (0.6000000238418579 * this.fRec4582[<i32>(1)])));
        this.fVec4577[iTemp4] = fTemp11;
        let fRecBody44: f32 = this.fVec4577[((this.fIOTA - this.iConst7) & <i32>(2047))];
        let fRecBody45: f32 = (0.6000000238418579 * fTemp11);
        this.fRec4582[<i32>(0)] = fRecBody44;
        this.fRec4582_1[<i32>(0)] = fRecBody45;
        let fTemp12: f32 = this.fRec4827_5[<i32>(1)];
        let fRecCur4608: f32 = (-1.0 * (this.fConst19 * ((this.fConst2 * this.fRec4608) - (fTemp12 + this.fRec4827_5[<i32>(2)]))));
        let fRecCur4618: f32 = ((this.fConst72 * this.fRec4618) + (this.fConst66 * ((fTemp12 + (this.fConst73 * fRecCur4608)) * this.fConst74)));
        this.fVec4621[iTemp1] = ((0.3535533845424652 * fRecCur4618) + 0.000000000000000000009999999682655225);
        let fTemp13: f32 = ((fTemp1 + (0.6000000238418579 * this.fRec4628[<i32>(1)])) + this.fVec4621[((this.fIOTA - this.iConst10) & <i32>(16383))]);
        this.fVec4623[iTemp3] = fTemp13;
        let fRecBody48: f32 = this.fVec4623[((this.fIOTA - this.iConst11) & <i32>(4095))];
        let fRecBody49: f32 = (-0.6000000238418579 * fTemp13);
        this.fRec4628[<i32>(0)] = fRecBody48;
        this.fRec4628_1[<i32>(0)] = fRecBody49;
        let fTemp14: f32 = this.fRec4827_3[<i32>(1)];
        let fRecCur4653: f32 = (-1.0 * (this.fConst19 * ((this.fConst2 * this.fRec4653) - (fTemp14 + this.fRec4827_3[<i32>(2)]))));
        let fRecCur4663: f32 = ((this.fConst81 * this.fRec4663) + (this.fConst75 * ((fTemp14 + (this.fConst82 * fRecCur4653)) * this.fConst83)));
        this.fVec4666[iTemp0] = ((0.3535533845424652 * fRecCur4663) + 0.000000000000000000009999999682655225);
        let fTemp15: f32 = ((0.6000000238418579 * this.fRec4675[<i32>(1)]) + this.fVec4666[((this.fIOTA - this.iConst12) & <i32>(32767))]);
        this.fVec4669[iTemp3] = (fTemp15 - fTemp1);
        let fRecBody52: f32 = this.fVec4669[((this.fIOTA - this.iConst13) & <i32>(4095))];
        let fRecBody53: f32 = (0.6000000238418579 * (fTemp1 - fTemp15));
        this.fRec4675[<i32>(0)] = fRecBody52;
        this.fRec4675_1[<i32>(0)] = fRecBody53;
        let fTemp16: f32 = this.fRec4827_7[<i32>(1)];
        let fRecCur4700: f32 = (-1.0 * (this.fConst19 * ((this.fConst2 * this.fRec4700) - (fTemp16 + this.fRec4827_7[<i32>(2)]))));
        let fRecCur4710: f32 = ((this.fConst90 * this.fRec4710) + (this.fConst84 * ((fTemp16 + (this.fConst91 * fRecCur4700)) * this.fConst92)));
        this.fVec4713[iTemp0] = ((0.3535533845424652 * fRecCur4710) + 0.000000000000000000009999999682655225);
        let fTemp17: f32 = ((0.6000000238418579 * this.fRec4722[<i32>(1)]) + this.fVec4713[((this.fIOTA - this.iConst14) & <i32>(32767))]);
        this.fVec4716[iTemp4] = (fTemp17 - fTemp1);
        let fRecBody56: f32 = this.fVec4716[((this.fIOTA - this.iConst15) & <i32>(2047))];
        let fRecBody57: f32 = (0.6000000238418579 * (fTemp1 - fTemp17));
        this.fRec4722[<i32>(0)] = fRecBody56;
        this.fRec4722_1[<i32>(0)] = fRecBody57;
        let fTemp18: f32 = this.fRec4401[<i32>(1)];
        let fTemp19: f32 = this.fRec4445[<i32>(1)];
        let fTemp20: f32 = this.fRec4490[<i32>(1)];
        let fTemp21: f32 = this.fRec4535[<i32>(1)];
        let fTemp22: f32 = this.fRec4582[<i32>(1)];
        let fTemp23: f32 = this.fRec4628[<i32>(1)];
        let fTemp24: f32 = this.fRec4675[<i32>(1)];
        let fTemp25: f32 = (this.fRec4722_1[<i32>(0)] + this.fRec4722[<i32>(1)]);
        let fTemp26: f32 = (fTemp24 + (this.fRec4675_1[<i32>(0)] + fTemp25));
        let fTemp27: f32 = (this.fRec4401_1[<i32>(0)] + (fTemp23 + (this.fRec4628_1[<i32>(0)] + fTemp26)));
        let fTemp28: f32 = (this.fRec4401_1[<i32>(0)] + (this.fRec4628_1[<i32>(0)] + fTemp23));
        let fTemp29: f32 = (this.fRec4675_1[<i32>(0)] + fTemp24);
        let fTemp30: f32 = (this.fRec4401_1[<i32>(0)] + fTemp29);
        let fTemp31: f32 = (fTemp23 + (this.fRec4628_1[<i32>(0)] + fTemp25));
        let fTemp32: f32 = (this.fRec4401_1[<i32>(0)] + fTemp25);
        let fTemp33: f32 = (fTemp23 + (this.fRec4628_1[<i32>(0)] + fTemp29));
        let fRecBody58: f32 = (fTemp18 + (fTemp19 + (fTemp20 + (this.fRec4535_1[<i32>(0)] + (fTemp21 + (this.fRec4490_1[<i32>(0)] + (this.fRec4445_1[<i32>(0)] + (fTemp22 + (this.fRec4582_1[<i32>(0)] + fTemp27)))))))));
        let fRecBody59: f32 = ((fTemp19 + (fTemp20 + (this.fRec4535_1[<i32>(0)] + (fTemp21 + (this.fRec4490_1[<i32>(0)] + (this.fRec4445_1[<i32>(0)] + (this.fRec4582_1[<i32>(0)] + fTemp22))))))) - (fTemp18 + fTemp27));
        let fRecBody60: f32 = ((fTemp18 + (fTemp20 + (this.fRec4535_1[<i32>(0)] + (fTemp21 + (this.fRec4490_1[<i32>(0)] + fTemp28))))) - (fTemp19 + (this.fRec4445_1[<i32>(0)] + (fTemp22 + (this.fRec4582_1[<i32>(0)] + fTemp26)))));
        let fRecBody61: f32 = ((fTemp20 + (this.fRec4535_1[<i32>(0)] + (fTemp21 + (this.fRec4490_1[<i32>(0)] + fTemp26)))) - (fTemp18 + (fTemp19 + (this.fRec4445_1[<i32>(0)] + (fTemp22 + (this.fRec4582_1[<i32>(0)] + fTemp28))))));
        let fRecBody62: f32 = ((fTemp18 + (fTemp19 + (this.fRec4535_1[<i32>(0)] + (fTemp21 + (this.fRec4445_1[<i32>(0)] + fTemp30))))) - (fTemp20 + (this.fRec4490_1[<i32>(0)] + (fTemp22 + (this.fRec4582_1[<i32>(0)] + fTemp31)))));
        let fRecBody63: f32 = ((fTemp19 + (this.fRec4535_1[<i32>(0)] + (fTemp21 + (this.fRec4445_1[<i32>(0)] + fTemp31)))) - (fTemp18 + (fTemp20 + (this.fRec4490_1[<i32>(0)] + (fTemp22 + (this.fRec4582_1[<i32>(0)] + fTemp30))))));
        let fRecBody64: f32 = ((fTemp18 + (this.fRec4535_1[<i32>(0)] + (fTemp21 + (fTemp22 + (this.fRec4582_1[<i32>(0)] + fTemp32))))) - (fTemp19 + (fTemp20 + (this.fRec4490_1[<i32>(0)] + (this.fRec4445_1[<i32>(0)] + fTemp33)))));
        let fRecBody65: f32 = ((this.fRec4535_1[<i32>(0)] + (fTemp21 + (fTemp22 + (this.fRec4582_1[<i32>(0)] + fTemp33)))) - (fTemp18 + (fTemp19 + (fTemp20 + (this.fRec4490_1[<i32>(0)] + (this.fRec4445_1[<i32>(0)] + fTemp32))))));
        this.fRec4827[<i32>(0)] = fRecBody58;
        this.fRec4827_1[<i32>(0)] = fRecBody59;
        this.fRec4827_2[<i32>(0)] = fRecBody60;
        this.fRec4827_3[<i32>(0)] = fRecBody61;
        this.fRec4827_4[<i32>(0)] = fRecBody62;
        this.fRec4827_5[<i32>(0)] = fRecBody63;
        this.fRec4827_6[<i32>(0)] = fRecBody64;
        this.fRec4827_7[<i32>(0)] = fRecBody65;
        outputs[<i32>(0)] = <f32>((0.3700000047683716 * (this.fRec4827_1[<i32>(0)] + this.fRec4827_2[<i32>(0)])));
        outputs[<i32>(1)] = <f32>((0.3700000047683716 * (this.fRec4827_1[<i32>(0)] - this.fRec4827_2[<i32>(0)])));
        this.fRec4381 = fRecCur4381;
        this.fRec4391 = fRecCur4391;
        this.fRec4401[<i32>(1)] = this.fRec4401[<i32>(0)];
        this.fRec4401_1[<i32>(1)] = this.fRec4401_1[<i32>(0)];
        this.fRec4425 = fRecCur4425;
        this.fRec4435 = fRecCur4435;
        this.fRec4445[<i32>(1)] = this.fRec4445[<i32>(0)];
        this.fRec4445_1[<i32>(1)] = this.fRec4445_1[<i32>(0)];
        this.fRec4469 = fRecCur4469;
        this.fRec4479 = fRecCur4479;
        this.fRec4490[<i32>(1)] = this.fRec4490[<i32>(0)];
        this.fRec4490_1[<i32>(1)] = this.fRec4490_1[<i32>(0)];
        this.fRec4514 = fRecCur4514;
        this.fRec4524 = fRecCur4524;
        this.fRec4535[<i32>(1)] = this.fRec4535[<i32>(0)];
        this.fRec4535_1[<i32>(1)] = this.fRec4535_1[<i32>(0)];
        this.fRec4562 = fRecCur4562;
        this.fRec4572 = fRecCur4572;
        this.fRec4582[<i32>(1)] = this.fRec4582[<i32>(0)];
        this.fRec4582_1[<i32>(1)] = this.fRec4582_1[<i32>(0)];
        this.fRec4608 = fRecCur4608;
        this.fRec4618 = fRecCur4618;
        this.fRec4628[<i32>(1)] = this.fRec4628[<i32>(0)];
        this.fRec4628_1[<i32>(1)] = this.fRec4628_1[<i32>(0)];
        this.fRec4653 = fRecCur4653;
        this.fRec4663 = fRecCur4663;
        this.fRec4675[<i32>(1)] = this.fRec4675[<i32>(0)];
        this.fRec4675_1[<i32>(1)] = this.fRec4675_1[<i32>(0)];
        this.fRec4700 = fRecCur4700;
        this.fRec4710 = fRecCur4710;
        this.fRec4722[<i32>(1)] = this.fRec4722[<i32>(0)];
        this.fRec4722_1[<i32>(1)] = this.fRec4722_1[<i32>(0)];
        this.fRec4827[<i32>(2)] = fTemp8;
        this.fRec4827[<i32>(1)] = this.fRec4827[<i32>(0)];
        this.fRec4827_1[<i32>(2)] = fTemp0;
        this.fRec4827_1[<i32>(1)] = this.fRec4827_1[<i32>(0)];
        this.fRec4827_2[<i32>(2)] = fTemp3;
        this.fRec4827_2[<i32>(1)] = this.fRec4827_2[<i32>(0)];
        this.fRec4827_3[<i32>(2)] = fTemp14;
        this.fRec4827_3[<i32>(1)] = this.fRec4827_3[<i32>(0)];
        this.fRec4827_4[<i32>(2)] = fTemp6;
        this.fRec4827_4[<i32>(1)] = this.fRec4827_4[<i32>(0)];
        this.fRec4827_5[<i32>(2)] = fTemp12;
        this.fRec4827_5[<i32>(1)] = this.fRec4827_5[<i32>(0)];
        this.fRec4827_6[<i32>(2)] = fTemp10;
        this.fRec4827_6[<i32>(1)] = this.fRec4827_6[<i32>(0)];
        this.fRec4827_7[<i32>(2)] = fTemp16;
        this.fRec4827_7[<i32>(1)] = this.fRec4827_7[<i32>(0)];
        this.fIOTA = (this.fIOTA + <i32>(1));
    }
    compute(count: i32, inputs: Array<StaticArray<f32>>, outputs: Array<StaticArray<f32>>): void {
    }
}

export class MasterverbChannel extends MidiChannel {
    private _paramsDirty: bool = true;


    readonly effectDsp: MasterverbEffectDsp = new MasterverbEffectDsp();
    private efin: StaticArray<f32> = new StaticArray<f32>(2);
    private efout: StaticArray<f32> = new StaticArray<f32>(2);

    constructor(numvoices: i32, factoryFunc: (channel: MidiChannel, voiceindex: i32) => MidiVoice) {
        super(numvoices, factoryFunc);
        this.effectDsp.init(<i32>SAMPLERATE);
    }

    private applyParams(): void {
        this.effectDsp.control();
    }

    preprocess(): void {
        if (this._paramsDirty) {
            this._paramsDirty = false;
            this.applyParams();
        }
        this.efin[0] = this.signal.left;
        this.efin[1] = this.signal.right;
        this.effectDsp.frame(this.efin, this.efout);
        this.signal.left = this.efout[0];
        this.signal.right = this.efout[1];
    }
}

export function initializeMidiSynth(): void {
    midichannels[0] = new MasterverbChannel(10, (channel: MidiChannel) => new Masterverb(channel));
    midichannels[0].controlchange(7, 100);
    midichannels[0].controlchange(10, 64);
    midichannels[0].controlchange(91, 10);
}

export function postprocess(): void {
}
