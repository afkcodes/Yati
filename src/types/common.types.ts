import type {typography} from '~styles/tokens';

export type Theme = 'dark' | 'light';
export type FontWeight = keyof typeof typography.fontFamily;

export type Size =
  | '3xs'
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl';

export type FontSize =
  | '3xs'
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl';

export type LineHeights =
  | '3xs'
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl';

export type BorderRadiusSize =
  | 'none'
  | '3xs'
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | 'full';

export type LineCount = 1 | 2 | 3 | 4;
export type ArrangeMode = 'single' | 'multi';
export type Orientation = 'vertical' | 'horizontal';
export type Alignment = 'left' | 'right' | 'center';
