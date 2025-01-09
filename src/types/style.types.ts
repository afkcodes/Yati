import {Size} from './common.types';

export type Spacing = {
  [key in Size | '0']: number;
};

export type BorderRadius = {
  [key in Exclude<Size, '4xl' | '5xl'> | 'none' | 'full']: number;
};

export type Opacity = {
  0: 0;
  25: 0.25;
  50: 0.5;
  75: 0.75;
  100: 1;
};

export type BorderWidths = {
  [key: string]: number;
};

export type IconSizes = {
  [key in Exclude<Size, '3xs' | '2xs' | '2xl' | '3xl' | '4xl' | '5xl'>]: number;
};
