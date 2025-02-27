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

// Enhanced dark mode palette with more consistent levels
const dark = {
  // Background levels
  background: {
    // Main page background (blackest)
    primary: '#000000',
    // Card/container backgrounds
    secondary: '#121212',
    // Elevated/highlighted card backgrounds
    elevated: '#1C1C1E',
    // Input fields, selectable items
    input: '#2C2C2E',
    // Subtle highlights, selected items
    highlight: '#3A3A3C',
  },
  // Text and icon levels
  text: {
    // Primary text - high contrast
    primary: '#FFFFFF',
    // Secondary text - medium contrast
    secondary: '#EBEBF5CC', // Equivalent to white at ~80% opacity
    // Tertiary text - low contrast, for hints/placeholders
    tertiary: '#EBEBF599', // Equivalent to white at ~60% opacity
    // Disabled text - very low contrast
    disabled: '#EBEBF566', // Equivalent to white at ~40% opacity
  },
  // Border and divider levels
  border: {
    // Prominent borders/dividers
    primary: '#3A3A3C',
    // Subtle borders/dividers
    secondary: '#2C2C2E',
  },
};

// Semantic colors for consistent status indicators across the app
const semantic = {
  success: {
    base: '#34C759', // Green
    light: '#34C75933', // Transparent version for backgrounds
  },
  error: {
    base: '#FF3B30', // Red
    light: '#FF3B3033', // Transparent version for backgrounds
  },
  warning: {
    base: '#FF9500', // Orange
    light: '#FF950033', // Transparent version for backgrounds
  },
  info: {
    base: '#0A84FF', // Blue
    light: '#0A84FF33', // Transparent version for backgrounds
  },
};

export const typography = {
  fontFamily: {
    regular: 'Gilroy-Regular',
    medium: 'Gilroy-Medium',
    semibold: 'Gilroy-Semibold',
    bold: 'Gilroy-Bold',
    title: 'JosefinSans-Bold',
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

// Export the colors object with all our color tokens
export const colors = {
  brand,
  dark,
  semantic,
};
