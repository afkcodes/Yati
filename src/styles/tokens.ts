import type {Alignment} from '~types/common.types';
import type {
  BorderRadius,
  BorderWidths,
  IconSizes,
  Opacity,
  Spacing,
} from '~types/style.types';
import {font, ms, vs} from '~utils/screenUtil';

const brand = {
  primary: {
    '50': '#FFF0F2', // Soft stage light
    '100': '#FFE2E7', // Gentle spotlight
    '200': '#FFCCD5', // Soft curtain light
    '300': '#FF8FA3', // Drama accent
    '400': '#E84A6A', // Emotional accent
    '500': '#C8234A', // New primary crimson
    '600': '#A81D3D', // Theater curtain red
    '700': '#8A1731', // Deep dramatic red
    '800': '#6C1226', // Shadow red
    '900': '#4E0C1B', // Dark theater red
  },
};

const neutral = {
  light: {
    50: '#FFFFFF', // Pure white
    100: '#FCFCFD',
    200: '#F8F9FB',
    300: '#F3F4F8',
    400: '#ECEDF3',
    500: '#E5E7ED',
    600: '#D8DBE5',
    700: '#C1C4CF',
    800: '#AEB1BD',
    900: '#9B9EAC',
  },
  dark: {
    50: '#C1C2C6',
    100: '#A3A4A8',
    200: '#85868B',
    300: '#68696E',
    400: '#4A4B50',
    500: '#202225', // Muted dark
    600: '#1A1D1F', // Elevated dark
    700: '#141517', // Paper dark
    800: '#0A0A0B', // Background dark
    900: '#050506', // Deepest dark
  },
};

const semantic = {
  success: {
    50: '#E8FFF3',
    100: '#D1FFE7',
    200: '#A3FFCF',
    300: '#75FFB7',
    400: '#47FF9F',
    500: '#22C55E', // Main success
    600: '#1B9E4B',
    700: '#147738',
    800: '#0D5025',
    900: '#062912',
  },
  error: {
    50: '#FFF1F0',
    100: '#FFE4E2',
    200: '#FFC9C5',
    300: '#FFADA8',
    400: '#FF928B',
    500: '#EF4444', // Main error
    600: '#BF3636',
    700: '#8F2828',
    800: '#5F1B1B',
    900: '#300D0D',
  },
  warning: {
    50: '#FFF9E5',
    100: '#FFF3CC',
    200: '#FFE799',
    300: '#FFDB66',
    400: '#FFCF33',
    500: '#F59E0B', // Main warning
    600: '#C47E09',
    700: '#935F07',
    800: '#623F04',
    900: '#312002',
  },
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#4048B0', // Using primary as info
    600: '#343B96',
    700: '#2A2F7A',
    800: '#1F235D',
    900: '#151840',
  },
};

const text = {
  light: {
    primary: '#000000',
    gray: {
      100: '#F8F9FA',
      200: '#E9ECEF',
      300: '#DEE2E6',
      400: '#CED4DA',
      500: '#ADB5BD',
      600: '#6C757D',
      700: '#495057',
      800: '#343A40',
      900: '#212529',
    },
  },
  dark: {
    primary: '#FFFFFF',
    gray: {
      100: '#E9ECEF',
      200: '#DDE1E6',
      300: '#CED4DA',
      400: '#ADB5BD',
      500: '#868E96',
      600: '#666D75',
      700: '#495057',
      800: '#343A40',
      900: '#212529',
    },
  },
};

export const typography = {
  fontFamily: {
    regular: 'Gilroy-Regular',
    medium: 'Gilroy-Medium',
    semibold: 'Gilroy-Semibold',
    bold: 'Gilroy-Bold',
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
  '2xs': ms(4),
  xs: ms(6),
  sm: ms(8),
  md: ms(10),
  lg: ms(12),
  xl: ms(16),
  '2xl': ms(20),
  '3xl': ms(24),
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
  thin: ms(1),
  medium: ms(2),
  thick: ms(4),
};

export const iconSizes: IconSizes = {
  sm: ms(16),
  md: ms(24),
  lg: ms(32),
  xl: ms(48),
  xs: 0,
};

export const alignment: {[key in Alignment]: string} = {
  center: 'center',
  right: 'flex-end',
  left: 'flex-start',
};

const colors = {brand, neutral, semantic, text};

export {colors};
