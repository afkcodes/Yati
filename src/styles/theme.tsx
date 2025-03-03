import {
  borderRadius,
  borderWidths,
  colors,
  opacity,
  spacing,
  typography,
} from './tokens';

import {
  BackgroundVariant,
  BorderVariant,
  ColorCategory,
  TextVariant,
  ThemeStructure,
  ThemeVariant,
} from '~types/theme.types';

export const themes: ThemeStructure = {
  dark: {
    background: {
      base: colors.dark.background.base,
      surface: colors.dark.background.surface,
      elevated: colors.dark.background.elevated,
      field: colors.dark.background.field,
      highlight: colors.dark.background.highlight,
      accent: colors.brand.primary[500],
      transparent: 'transparent',

      success: colors.semantic.success.subtle,
      error: colors.semantic.error.subtle,
      warning: colors.semantic.warning.subtle,
      info: colors.semantic.info.subtle,
    },
    text: {
      primary: colors.dark.text.primary,
      secondary: colors.dark.text.secondary,
      tertiary: colors.dark.text.tertiary,
      disabled: colors.dark.text.disabled,
      accent: colors.brand.primary[400],

      success: colors.semantic.success.base,
      error: colors.semantic.error.base,
      warning: colors.semantic.warning.base,
      info: colors.semantic.info.base,
    },
    border: {
      subtle: colors.dark.border.subtle,
      muted: colors.dark.border.muted,
      accent: colors.brand.primary[500],
      transparent: 'transparent',
    },
    typography: typography,
  },

  light: {
    background: {
      base: '#F8F8FC',
      surface: '#FFFFFF',
      elevated: '#F1F1F6',
      field: '#EFEFF8',
      highlight: '#E8E8F0',
      accent: colors.brand.primary[500],
      transparent: 'transparent',

      success: colors.semantic.success.subtle,
      error: colors.semantic.error.subtle,
      warning: colors.semantic.warning.subtle,
      info: colors.semantic.info.subtle,
    },
    text: {
      primary: '#18181B',
      secondary: 'rgba(24, 24, 27, 0.7)',
      tertiary: 'rgba(24, 24, 27, 0.5)',
      disabled: 'rgba(24, 24, 27, 0.35)',
      accent: colors.brand.primary[600],

      success: colors.semantic.success.base,
      error: colors.semantic.error.base,
      warning: colors.semantic.warning.base,
      info: colors.semantic.info.base,
    },
    border: {
      subtle: 'rgba(0, 0, 0, 0.08)',
      muted: 'rgba(0, 0, 0, 0.04)',
      accent: colors.brand.primary[500],
      transparent: 'transparent',
    },
    typography: typography,
  },
};

export function getThemeColor(
  theme: ThemeVariant,
  category: ColorCategory,
  variant: BackgroundVariant | TextVariant | BorderVariant,
): string {
  if (category === 'background') {
    return themes[theme].background[variant as BackgroundVariant];
  } else if (category === 'text') {
    return themes[theme].text[variant as TextVariant];
  } else {
    return themes[theme].border[variant as BorderVariant];
  }
}

export function withAlpha(color: string, alpha: number): string {
  // Handle rgba colors
  if (color.startsWith('rgba')) {
    return color.replace(/[\d.]+\)$/g, `${alpha})`);
  }

  // Handle hex colors
  let hex = color.replace('#', '');
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const styleUtils = {
  opacity,
  spacing,
  borderWidths,
  borderRadius,
};

export type {
  BackgroundVariant,
  BorderVariant,
  ColorCategory,
  TextVariant,
  ThemeVariant,
};
