import {
  borderRadius,
  borderWidths,
  colors,
  opacity,
  spacing,
  typography,
} from './tokens';

// Define the dark theme color palette
export const themes = {
  dark: {
    background: {
      // Main backgrounds
      primary: colors.dark.background.primary, // Main page background - darkest
      secondary: colors.dark.background.secondary, // Card backgrounds
      tertiary: colors.dark.background.elevated, // Elevated items
      nav: colors.dark.background.primary, // Navigation background
      accent: colors.brand.primary[500], // Primary accent color
      transparent: 'transparent', // Transparent background

      // Input and interactive elements
      input: colors.dark.background.input, // Input fields
      highlight: colors.dark.background.highlight, // Selected items

      // Status colors (with transparency for backgrounds)
      success: colors.semantic.success.light,
      error: colors.semantic.error.light,
      warning: colors.semantic.warning.light,
      info: colors.semantic.info.light,
    },
    text: {
      primary: colors.dark.text.primary, // Primary text - high contrast
      secondary: colors.dark.text.secondary, // Secondary text - medium contrast
      tertiary: colors.dark.text.tertiary, // Tertiary text - low contrast
      disabled: colors.dark.text.disabled, // Disabled text - very low contrast
      accent: colors.brand.primary[400], // Accent text color

      // Semantic text colors
      success: colors.semantic.success.base,
      error: colors.semantic.error.base,
      warning: colors.semantic.warning.base,
      info: colors.semantic.info.base,
    },
    border: {
      primary: colors.dark.border.primary, // Primary borders/dividers
      secondary: colors.dark.border.secondary, // Subtle borders/dividers
      accent: colors.brand.primary[500], // Accent borders
    },
    typography: typography,
  },

  // Light theme (would need further refinement for a proper light mode)
  light: {
    background: {
      primary: '#F2F2F7',
      secondary: '#FFFFFF',
      tertiary: '#F2F2F7',
      nav: '#F2F2F7',
      accent: colors.brand.primary[500],
      transparent: 'transparent',

      input: '#EFEFF4',
      highlight: '#E5E5EA',

      success: colors.semantic.success.light,
      error: colors.semantic.error.light,
      warning: colors.semantic.warning.light,
      info: colors.semantic.info.light,
    },
    text: {
      primary: '#000000',
      secondary: 'rgba(0, 0, 0, 0.8)',
      tertiary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.4)',
      accent: colors.brand.primary[600],

      success: colors.semantic.success.base,
      error: colors.semantic.error.base,
      warning: colors.semantic.warning.base,
      info: colors.semantic.info.base,
    },
    border: {
      primary: '#C6C6C8',
      secondary: '#E5E5EA',
      accent: colors.brand.primary[500],
    },
    typography: typography,
  },
};

// Helper function to get color values from the theme
export const getColor = (
  theme: 'dark' | 'light',
  category: 'background' | 'text' | 'border',
  variant: string,
): string => {
  return themes[theme][category][variant];
};

// Centralized style utilities
export const styleUtils = {
  opacity: opacity,
  spacing: spacing,
  borderWidths: borderWidths,
  borderRadius: borderRadius,
};
