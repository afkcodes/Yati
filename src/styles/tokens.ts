import type {Alignment} from '~/types/common.types';
import type {
  BorderRadius,
  BorderWidths,
  IconSizes,
  Opacity,
  Spacing,
} from '~/types/style.types';
import {font, ms, vs} from '~/utils/screenUtil';

const brand = {
  primary: {
    50: '#F0F2FF', // Softer light tint for better legibility on light backgrounds
    100: '#DEE1FE', // Light tint with slightly more contrast
    200: '#BFC4FC', // Balanced tint for subtle elements
    300: '#9EA3FA', // Secondary elements with good contrast
    400: '#7D82F8', // Brighter accents for visibility
    500: '#5C63F6', // Main brand color, slightly more vivid
    600: '#4A52D0', // Contrast variant for text on dark mode
    700: '#383EAA', // Darker accent with legibility in focus
    800: '#262A84', // Deep contrast without losing saturation
    900: '#131549', // Retained deepest shade for dark contrasts
  },
};

// Refined dark theme with more subtle, elegant contrast levels
const dark = {
  background: {
    base: '#0D0D0F',
    surface: '#18181B',
    elevated: '#1F1F23',
    field: '#27272A',
    highlight: '#2E2E33',
  },

  text: {
    primary: '#F2F2F7',
    secondary: 'rgba(242, 242, 247, 0.78)',
    tertiary: 'rgba(242, 242, 247, 0.55)',
    disabled: 'rgba(242, 242, 247, 0.35)',
  },

  border: {
    subtle: 'rgba(255, 255, 255, 0.08)',

    muted: 'rgba(255, 255, 255, 0.04)',
  },
};

const semantic = {
  success: {
    base: '#10B981',
    subtle: 'rgba(16, 185, 129, 0.12)',
  },
  error: {
    base: '#EF4444',
    subtle: 'rgba(239, 68, 68, 0.12)',
  },
  warning: {
    base: '#F59E0B',
    subtle: 'rgba(245, 158, 11, 0.12)',
  },
  info: {
    base: '#3B82F6',
    subtle: 'rgba(59, 130, 246, 0.12)',
  },
};

// Typography scale
export const typography = {
  fontFamily: {
    regular: 'Gilroy',
    medium: 'Gilroy',
    semibold: 'Gilroy',
    bold: 'Gilroy',
    title: 'JosefinSans',
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    title: '700',
  },
  fontSizes: {
    '3xs': font(8),
    '2xs': font(10),
    xs: font(12),
    sm: font(14),
    md: font(16),
    lg: font(18),
    xl: font(20),
    '2xl': font(24),
    '3xl': font(30),
    '4xl': font(36),
    '5xl': font(42),
  },
  lineHeights: {
    '3xs': vs(12),
    '2xs': vs(14),
    xs: vs(16),
    sm: vs(20),
    md: vs(24),
    lg: vs(28),
    xl: vs(32),
    '2xl': vs(36),
    '3xl': vs(42),
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
};

// Spacing scale
export const spacing: Spacing = {
  '0': ms(0),
  '3xs': ms(2),
  '2xs': ms(4),
  xs: ms(8),
  sm: ms(12),
  md: ms(16),
  lg: ms(20),
  xl: ms(24),
  '2xl': ms(32),
  '3xl': ms(40),
  '4xl': ms(48),
  '5xl': ms(64),
};

export const borderRadius: BorderRadius = {
  none: ms(0),
  '3xs': ms(2),
  '2xs': ms(3),
  xs: ms(5),
  sm: ms(7),
  md: ms(9),
  lg: ms(11),
  xl: ms(14),
  '2xl': ms(18),
  '3xl': ms(22),
  full: 9999,
};

export const opacity: Opacity = {
  0: 0,
  25: 0.25,
  50: 0.5,
  75: 0.75,
  100: 1,
};

export const borderWidths: BorderWidths = {
  none: 0,
  hairline: ms(0.5),
  thin: ms(1),
  medium: ms(1.5),
  thick: ms(2),
};

export const iconSizes: IconSizes = {
  sm: ms(16),
  md: ms(20),
  lg: ms(24),
  xl: ms(32),
  xs: ms(12),
};

export const alignment: {[key in Alignment]: string} = {
  center: 'center',
  right: 'flex-end',
  left: 'flex-start',
};

export const colors = {
  brand,
  dark,
  semantic,
};
