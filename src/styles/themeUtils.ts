import {themes} from '~styles/theme';
import {Theme} from '~types/common.types';

type ColorCategory = 'background' | 'text' | 'border';

/**
 * Gets a color from the current theme
 * @param theme The current theme ('dark' | 'light')
 * @param category The color category ('background', 'text', or 'border')
 * @param variant The specific color variant within that category
 * @returns The color value as a string
 */
export const getThemeColor = (
  theme: Theme,
  category: ColorCategory,
  variant: string,
): string => {
  if (
    themes[theme] &&
    themes[theme][category] &&
    themes[theme][category][variant]
  ) {
    return themes[theme][category][variant];
  }

  // Fallbacks if the specific color isn't found
  const fallbacks = {
    background: themes[theme].background.primary,
    text: themes[theme].text.primary,
    border: themes[theme].border.primary,
  };

  console.warn(
    `Theme color not found: ${theme}.${category}.${variant}. Using fallback.`,
  );
  return fallbacks[category];
};

/**
 * Creates alpha variants of a color by adding transparency
 * @param color The base color (hex or rgba)
 * @param alpha The alpha value (0-1)
 * @returns The color with applied alpha
 */
export const withAlpha = (color: string, alpha: number): string => {
  // If already rgba, modify the alpha
  if (color.startsWith('rgba')) {
    return color.replace(/[\d.]+\)$/g, `${alpha})`);
  }

  // Convert hex to rgba
  let hex = color.replace('#', '');
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Get semantic color (success, error, warning, info)
 * @param theme The current theme
 * @param type The semantic type
 * @param isBackground Whether to use the background variant
 * @returns The semantic color
 */
export const getSemanticColor = (
  theme: Theme,
  type: 'success' | 'error' | 'warning' | 'info',
  isBackground = false,
): string => {
  const category = isBackground ? 'background' : 'text';
  return getThemeColor(theme, category, type);
};
