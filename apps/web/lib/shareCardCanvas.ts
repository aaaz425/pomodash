import type { ShareCardData } from '@/types';
import { SHARE_CARD_COLORS, SHARE_CARD_SIZE } from '@/lib/constants/shareCard';

const SIZE = SHARE_CARD_SIZE;
const PADDING = 80;
const CENTER_X = SIZE / 2;

async function loadFonts(): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) return;
  await Promise.all([
    document.fonts.load('700 160px Pretendard'),
    document.fonts.load('600 40px Pretendard'),
    document.fonts.load('400 28px Pretendard'),
  ]);
}

function drawBackground(ctx: CanvasRenderingContext2D): void {
  const gradient = ctx.createLinearGradient(0, 0, 0, SIZE);
  gradient.addColorStop(0, SHARE_CARD_COLORS.backgroundTop);
  gradient.addColorStop(1, SHARE_CARD_COLORS.backgroundBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SIZE, SIZE);

  const glow = ctx.createRadialGradient(
    CENTER_X,
    SIZE * 0.35,
    0,
    CENTER_X,
    SIZE * 0.35,
    SIZE * 0.6,
  );
  glow.addColorStop(0, SHARE_CARD_COLORS.accentSoft);
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SIZE, SIZE);
}

function drawHeader(ctx: CanvasRenderingContext2D, periodLabel: string): void {
  ctx.textBaseline = 'middle';

  ctx.textAlign = 'left';
  ctx.fillStyle = SHARE_CARD_COLORS.accent;
  ctx.font = '700 40px Pretendard';
  ctx.fillText('Pomodash', PADDING, PADDING + 20);

  ctx.font = '600 28px Pretendard';
  const pillText = periodLabel;
  const pillPaddingX = 24;
  const pillWidth = ctx.measureText(pillText).width + pillPaddingX * 2;
  const pillHeight = 52;
  const pillX = SIZE - PADDING - pillWidth;
  const pillY = PADDING + 20 - pillHeight / 2;

  ctx.fillStyle = SHARE_CARD_COLORS.accentSoft;
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillWidth, pillHeight, pillHeight / 2);
  ctx.fill();

  ctx.fillStyle = SHARE_CARD_COLORS.accent;
  ctx.textAlign = 'center';
  ctx.fillText(pillText, pillX + pillWidth / 2, pillY + pillHeight / 2 + 1);
}

function drawHeadline(ctx: CanvasRenderingContext2D, headline: string): void {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = SHARE_CARD_COLORS.accent;
  ctx.font = '600 32px Pretendard';
  ctx.fillText(headline, CENTER_X, PADDING + 130);
}

function drawHeroRing(ctx: CanvasRenderingContext2D, centerY: number): void {
  const radius = 230;
  ctx.beginPath();
  ctx.arc(CENTER_X, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = SHARE_CARD_COLORS.accentSoft;
  ctx.lineWidth = 16;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(CENTER_X, centerY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 1.4);
  ctx.strokeStyle = SHARE_CARD_COLORS.accent;
  ctx.lineWidth = 16;
  ctx.lineCap = 'round';
  ctx.stroke();
}

const HERO_MAX_WIDTH = 420; // 장식 링(반지름 230) 안쪽에 들어오도록 제한

function fittedHeroFontSize(ctx: CanvasRenderingContext2D, text: string): number {
  const maxSize = 120;
  const minSize = 64;
  for (let size = maxSize; size > minSize; size -= 4) {
    ctx.font = `700 ${size}px Pretendard`;
    if (ctx.measureText(text).width <= HERO_MAX_WIDTH) return size;
  }
  return minSize;
}

function drawHeroStat(
  ctx: CanvasRenderingContext2D,
  centerY: number,
  totalFocusLabel: string,
): void {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const fontSize = fittedHeroFontSize(ctx, totalFocusLabel);
  ctx.fillStyle = SHARE_CARD_COLORS.textPrimary;
  ctx.font = `700 ${fontSize}px Pretendard`;
  ctx.fillText(totalFocusLabel, CENTER_X, centerY - 10);

  ctx.fillStyle = SHARE_CARD_COLORS.textSecondary;
  ctx.font = '400 32px Pretendard';
  ctx.fillText('집중 시간', CENTER_X, centerY + 90);
}

function drawSecondaryStats(
  ctx: CanvasRenderingContext2D,
  y: number,
  sessionCount: number,
  streakDays: number,
): void {
  const columnWidth = 260;
  const leftX = CENTER_X - columnWidth / 2;
  const rightX = CENTER_X + columnWidth / 2;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = SHARE_CARD_COLORS.textMuted;
  ctx.font = '400 26px Pretendard';
  ctx.fillText('세션 수', leftX, y);
  ctx.fillText('연속 집중일', rightX, y);

  ctx.fillStyle = SHARE_CARD_COLORS.textPrimary;
  ctx.font = '600 48px Pretendard';
  ctx.fillText(`${sessionCount}`, leftX, y + 60);
  ctx.fillText(`${streakDays}일`, rightX, y + 60);

  ctx.strokeStyle = SHARE_CARD_COLORS.divider;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(CENTER_X, y - 40);
  ctx.lineTo(CENTER_X, y + 90);
  ctx.stroke();
}

function drawFooter(ctx: CanvasRenderingContext2D, generatedAtLabel: string): void {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = SHARE_CARD_COLORS.textMuted;
  ctx.font = '400 26px Pretendard';
  ctx.fillText(generatedAtLabel, CENTER_X, SIZE - PADDING);
}

export async function drawShareCard(
  ctx: CanvasRenderingContext2D,
  data: ShareCardData,
): Promise<void> {
  await loadFonts();

  ctx.clearRect(0, 0, SIZE, SIZE);
  drawBackground(ctx);
  drawHeader(ctx, data.periodLabel);
  drawHeadline(ctx, data.headline);

  const heroCenterY = 490;
  drawHeroRing(ctx, heroCenterY);
  drawHeroStat(ctx, heroCenterY, data.totalFocusLabel);
  drawSecondaryStats(ctx, 860, data.sessionCount, data.streakDays);
  drawFooter(ctx, data.generatedAtLabel);
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('canvas.toBlob failed'));
    }, 'image/png');
  });
}

export async function downloadCanvasAsPng(
  canvas: HTMLCanvasElement,
  filename: string,
): Promise<void> {
  const blob = await canvasToBlob(canvas);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function canShareFiles(): boolean {
  if (typeof navigator === 'undefined' || !navigator.share || !navigator.canShare) return false;
  // 실제 파일 없이 타입만으로 지원 여부를 확정할 수 없는 브라우저도 있어, 여기서는 API 존재 여부만 확인
  return true;
}

export async function shareCanvasAsPng(
  canvas: HTMLCanvasElement,
  filename: string,
  shareText?: string,
): Promise<'shared' | 'cancelled' | 'unsupported'> {
  if (!canShareFiles()) return 'unsupported';

  const blob = await canvasToBlob(canvas);
  const file = new File([blob], filename, { type: 'image/png' });

  if (!navigator.canShare({ files: [file] })) return 'unsupported';

  try {
    await navigator.share({ files: [file], text: shareText });
    return 'shared';
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled';
    throw error;
  }
}
