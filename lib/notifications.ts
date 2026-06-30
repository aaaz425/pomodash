export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function sendNotification(title: string, body: string): void {
  if (Notification.permission !== 'granted') return;
  new Notification(title, { body, icon: '/icon-192.png' });
}

import type { SoundType } from '@/types';
import { SOUND_SEQUENCE_INTERVAL } from '@/lib/constants/ux';

let sharedCtx: AudioContext | null = null;
let activeNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
let activeGeneration = 0;

function getAudioContext(): AudioContext {
  if (!sharedCtx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedCtx = new AudioCtx();
  }
  return sharedCtx;
}

// 재생 중인 노드를 짧게 페이드시켜 끈다 — 하드 컷은 클릭/팝 노이즈를 유발한다
function stopActiveSequence(ctx: AudioContext, atTime: number): void {
  for (const { osc, gain } of activeNodes) {
    try {
      const current = gain.gain.value;
      gain.gain.cancelScheduledValues(atTime);
      gain.gain.setValueAtTime(current, atTime);
      gain.gain.linearRampToValueAtTime(0.0001, atTime + 0.03);
      osc.stop(atTime + 0.03);
    } catch {
      // 이미 정지된 노드 — 무시
    }
  }
  activeNodes = [];
}

function playTone(
  ctx: AudioContext,
  {
    type,
    freq,
    startTime,
    duration,
    peakGain,
    rampTo = 0.001,
  }: {
    type: OscillatorType;
    freq: number;
    startTime: number;
    duration: number;
    peakGain: number;
    rampTo?: number;
  },
): OscillatorNode {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(peakGain, startTime);
  gain.gain.exponentialRampToValueAtTime(rampTo, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration);
  activeNodes.push({ osc, gain });
  return osc;
}

// 기본 — 단일 사인파 (기존 동작과 동일한 음색, 길이만 1.5초로 연장)
function playSine(ctx: AudioContext, peakGain: number, startTime: number): OscillatorNode {
  return playTone(ctx, { type: 'sine', freq: 880, startTime, duration: 1.5, peakGain });
}

// 차임 — C6 → E6 상승 2음 레가토 (트라이앵글파)
function playChime(ctx: AudioContext, peakGain: number, startTime: number): OscillatorNode {
  playTone(ctx, { type: 'triangle', freq: 1046.5, startTime, duration: 0.9, peakGain });
  return playTone(ctx, {
    type: 'triangle',
    freq: 1318.5,
    startTime: startTime + 0.25,
    duration: 1.25,
    peakGain: peakGain * 0.9,
  });
}

// 벨 — 기본음 + 비정수배 배음 2개를 동시에 울려 종 특유의 금속성 음색 모사
function playBell(ctx: AudioContext, peakGain: number, startTime: number): OscillatorNode {
  const last = playTone(ctx, { type: 'sine', freq: 660, startTime, duration: 1.5, peakGain });
  playTone(ctx, {
    type: 'sine',
    freq: 660 * 2.4,
    startTime,
    duration: 1.0,
    peakGain: peakGain * 0.5,
  });
  playTone(ctx, {
    type: 'sine',
    freq: 660 * 3.8,
    startTime,
    duration: 0.6,
    peakGain: peakGain * 0.3,
  });
  return last;
}

// 디지털 — 짧은 사각파 틱 4회로 전자기기 비프음 모사
function playDigital(ctx: AudioContext, peakGain: number, startTime: number): OscillatorNode {
  let last: OscillatorNode;
  for (let i = 0; i < 4; i++) {
    last = playTone(ctx, {
      type: 'square',
      freq: 1760,
      startTime: startTime + i * 0.45,
      duration: 0.15,
      peakGain: peakGain * 0.8,
      rampTo: 0.15,
    });
  }
  return last!;
}

const SOUND_PLAYERS: Record<
  SoundType,
  (ctx: AudioContext, peakGain: number, startTime: number) => OscillatorNode
> = {
  sine: playSine,
  chime: playChime,
  bell: playBell,
  digital: playDigital,
};

export function playAlarm({
  type,
  volume,
  repeatCount,
  onEnded,
}: {
  type: SoundType;
  volume: number;
  repeatCount: number;
  onEnded?: () => void;
}): void {
  try {
    const myGeneration = ++activeGeneration;
    const ctx = getAudioContext();
    stopActiveSequence(ctx, ctx.currentTime);

    const peakGain = (Math.max(0, Math.min(100, volume)) / 100) * 0.5;
    const play = SOUND_PLAYERS[type];
    let lastOsc: OscillatorNode | null = null;
    for (let i = 0; i < repeatCount; i++) {
      lastOsc = play(ctx, peakGain, ctx.currentTime + i * SOUND_SEQUENCE_INTERVAL);
    }
    if (lastOsc) {
      lastOsc.onended = () => {
        if (myGeneration === activeGeneration) onEnded?.();
      };
    }
  } catch {
    // 지원 안 하는 환경에서 조용히 실패
  }
}

export function stopAlarm(): void {
  if (!sharedCtx) return; // 한 번도 재생한 적 없으면 안전하게 무시
  try {
    stopActiveSequence(sharedCtx, sharedCtx.currentTime);
  } catch {
    // ignore
  }
}
