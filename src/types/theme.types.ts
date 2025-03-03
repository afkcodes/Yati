export type BackgroundVariant =
  | 'base'
  | 'surface'
  | 'elevated'
  | 'field'
  | 'highlight'
  | 'accent'
  | 'transparent'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

// Text variants
export type TextVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'disabled'
  | 'accent'
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

// Border variants
export type BorderVariant = 'subtle' | 'muted' | 'accent' | 'transparent';

// Border width options
export type BorderWidthOption =
  | 'none'
  | 'hairline'
  | 'thin'
  | 'medium'
  | 'thick';

// Theme categories
export type ColorCategory = 'background' | 'text' | 'border' | 'transparent';

// Available themes
export type ThemeVariant = 'dark' | 'light';

// Theme structure definition
export interface ThemeColors {
  background: Record<BackgroundVariant, string>;
  text: Record<TextVariant, string>;
  border: Record<BorderVariant, string>;
  typography: any; // Define typography type as needed
}

export interface ThemeStructure {
  dark: ThemeColors;
  light: ThemeColors;
}
