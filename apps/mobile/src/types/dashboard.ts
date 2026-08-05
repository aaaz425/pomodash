export interface FocusTrendItem {
  label: string;
  [key: string]: number | string;
}

export interface FocusTrendMeta {
  data: FocusTrendItem[];
  categories: { name: string; color: string }[];
}

export interface CategoryFocusItem {
  name: string;
  minutes: number;
  percent: number;
  color: string;
}
