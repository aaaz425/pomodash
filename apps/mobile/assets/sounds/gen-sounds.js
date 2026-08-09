// 웹 apps/web/lib/notifications.ts의 Web Audio API 오실레이터 합성을 그대로 수치 계산해
// PCM WAV로 미리 렌더링한다 (RN에는 오실레이터 합성 API가 없어 expo-audio는 파일 재생만 가능).
const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;

function sine(freq, t) {
  return Math.sin(2 * Math.PI * freq * t);
}
function triangle(freq, t) {
  return (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * freq * t));
}
function square(freq, t) {
  return Math.sin(2 * Math.PI * freq * t) >= 0 ? 1 : -1;
}

const WAVEFORMS = { sine, triangle, square };

// Web Audio exponentialRampToValueAtTime과 동일한 포락선
function envelope(t, duration, peakGain, rampTo) {
  if (t < 0 || t > duration) return 0;
  return peakGain * Math.pow(rampTo / peakGain, t / duration);
}

function addTone(buffer, { type, freq, startTime, duration, peakGain, rampTo = 0.001 }) {
  const startSample = Math.floor(startTime * SAMPLE_RATE);
  const numSamples = Math.floor(duration * SAMPLE_RATE);
  const wave = WAVEFORMS[type];
  for (let i = 0; i < numSamples; i++) {
    const idx = startSample + i;
    if (idx >= buffer.length) break;
    const t = i / SAMPLE_RATE;
    const amp = envelope(t, duration, peakGain, rampTo);
    buffer[idx] += wave(freq, t) * amp;
  }
}

function makeBuffer(totalDuration) {
  return new Float64Array(Math.ceil(totalDuration * SAMPLE_RATE));
}

// 항상 목표 천장까지 맞춰 정규화 — 이전엔 peak > ceiling일 때만 줄여서 겹치는 파셜이
// 없는 사운드(예: digital)는 상대적으로 더 작게 재생됐음
function normalize(buffer, ceiling = 0.97) {
  let peak = 0;
  for (const s of buffer) peak = Math.max(peak, Math.abs(s));
  if (peak === 0) return;
  const scale = ceiling / peak;
  for (let i = 0; i < buffer.length; i++) buffer[i] *= scale;
}

function writeWav(filePath, buffer) {
  const numSamples = buffer.length;
  const dataSize = numSamples * 2; // 16-bit mono
  const headerSize = 44;
  const out = Buffer.alloc(headerSize + dataSize);

  out.write('RIFF', 0);
  out.writeUInt32LE(36 + dataSize, 4);
  out.write('WAVE', 8);
  out.write('fmt ', 12);
  out.writeUInt32LE(16, 16); // fmt chunk size
  out.writeUInt16LE(1, 20); // PCM
  out.writeUInt16LE(1, 22); // mono
  out.writeUInt32LE(SAMPLE_RATE, 24);
  out.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
  out.writeUInt16LE(2, 32); // block align
  out.writeUInt16LE(16, 34); // bits per sample
  out.write('data', 36);
  out.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, buffer[i]));
    out.writeInt16LE(Math.round(s * 32767), headerSize + i * 2);
  }

  fs.writeFileSync(filePath, out);
}

const OUT_DIR = process.argv[2];
fs.mkdirSync(OUT_DIR, { recursive: true });

// sine
{
  const buf = makeBuffer(1.5);
  addTone(buf, { type: 'sine', freq: 880, startTime: 0, duration: 1.5, peakGain: 1.0 });
  normalize(buf);
  writeWav(path.join(OUT_DIR, 'sine.wav'), buf);
}

// chime — C6→E6
{
  const buf = makeBuffer(1.5);
  addTone(buf, { type: 'triangle', freq: 1046.5, startTime: 0, duration: 0.9, peakGain: 1.0 });
  addTone(buf, {
    type: 'triangle',
    freq: 1318.5,
    startTime: 0.25,
    duration: 1.25,
    peakGain: 0.9,
  });
  normalize(buf);
  writeWav(path.join(OUT_DIR, 'chime.wav'), buf);
}

// bell — 기본음 + 비정수배 배음
{
  const buf = makeBuffer(1.5);
  addTone(buf, { type: 'sine', freq: 660, startTime: 0, duration: 1.5, peakGain: 1.0 });
  addTone(buf, { type: 'sine', freq: 660 * 2.4, startTime: 0, duration: 1.0, peakGain: 0.5 });
  addTone(buf, { type: 'sine', freq: 660 * 3.8, startTime: 0, duration: 0.6, peakGain: 0.3 });
  normalize(buf);
  writeWav(path.join(OUT_DIR, 'bell.wav'), buf);
}

// digital — 사각파 틱 4회
{
  const buf = makeBuffer(1.5);
  for (let i = 0; i < 4; i++) {
    addTone(buf, {
      type: 'square',
      freq: 1760,
      startTime: i * 0.45,
      duration: 0.15,
      peakGain: 0.8,
      rampTo: 0.15,
    });
  }
  normalize(buf);
  writeWav(path.join(OUT_DIR, 'digital.wav'), buf);
}

console.log('done');
