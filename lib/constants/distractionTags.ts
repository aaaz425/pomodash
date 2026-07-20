export interface DistractionTag {
  id: string;
  label: string;
}

export const DISTRACTION_TAGS: DistractionTag[] = [
  { id: 'phone', label: '휴대폰' },
  { id: 'noise', label: '소음' },
  { id: 'fatigue', label: '피곤함' },
  { id: 'people', label: '주변 사람' },
  { id: 'notification', label: '알림' },
  { id: 'wandering', label: '딴생각' },
];
