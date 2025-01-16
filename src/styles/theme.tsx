import {
  borderRadius,
  borderWidths,
  colors,
  opacity,
  spacing,
  typography,
} from './tokens';

export const themes = {
  dark: {
    background: {
      primary: colors.neutral.dark[900],
      secondary: colors.neutral.dark[700],
      tertiary: colors.neutral.dark[600],
      accent: colors.brand.primary[500],
      transparent: 'transparent',
    },
    text: {
      primary: colors.text.dark.primary,
      secondary: colors.text.dark.gray[500],
      tertiary: colors.text.dark.gray[700],
      accent: colors.brand.primary[400],
    },
    typography: typography,
  },

  light: {
    background: {
      primary: colors.neutral.light[50],
      secondary: colors.neutral.light[400],
      tertiary: colors.neutral.light[800],
      transparent: 'transparent',
      accent: colors.brand.primary[500],
    },
    text: {
      primary: colors.text.light.primary,
      secondary: colors.text.light.gray[600],
      tertiary: colors.text.light.gray[500],
      accent: colors.brand.primary[500],
    },
    typography: typography,
  },
};

export const styleUtils = {
  opacity: opacity,
  spacing: spacing,
  borderWidths: borderWidths,
  borderRadius: borderRadius,
};
