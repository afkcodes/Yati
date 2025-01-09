import { Dimensions, PixelRatio } from 'react-native';

/**
 * React Native Scaling Utility
 *
 * This utility provides various functions for responsive scaling in React Native applications.
 * Below is a quick reference table for all available scaling functions:
 *
 * | Function | Purpose                                          | When to Use                                    |
 * |----------|--------------------------------------------------|----------------------------------------------------|
 * | s()      | Scales based on screen width and pixel density   | Widths, horizontal padding/margins, icon sizes     |
 * | vs()     | Scales based on screen height and pixel density  | Heights, vertical padding/margins, spacings        |
 * | ms()     | Moderately scales based on width (less dramatic) | Subtle horizontal scaling, maintaining proportions |
 * | mvs()    | Moderately scales based on height (less dramatic)| Subtle vertical scaling, maintaining proportions   |
 * | font()   | Scales fonts considering accessibility settings  | All text sizes                                     |
 * | w()      | Calculates width as percentage of screen width   | Responsive widths, full-width components           |
 * | h()      | Calculates height as percentage of screen height | Responsive heights, full-height components         |
 * | px()     | Converts fixed pixel values to responsive sizes  | Translating exact design values to responsive sizes|
 */

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 14 logical resolution)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

// Base pixel ratio (iPhone 14)
const BASE_PIXEL_RATIO = 3;

const SCALE = SCREEN_WIDTH / BASE_WIDTH;
const VERTICAL_SCALE = SCREEN_HEIGHT / BASE_HEIGHT;

// Get the current device's pixel ratio
const PIXEL_RATIO = PixelRatio.get();

// Calculate a scale factor that takes into account both screen size and pixel density
const DENSITY_SCALE = PIXEL_RATIO / BASE_PIXEL_RATIO;

export const metrics = {
  /**
   * Scales a size horizontally considering both screen width and pixel density.
   * @param {number} size - The size to scale.
   * @returns {number} The scaled size.
   *
   * Use for:
   * - Widths of components
   * - Horizontal padding or margins
   * - Icon sizes
   * - Any horizontal measurement that should scale with screen width
   */
  s: (size: number) => Math.round(SCALE * size * DENSITY_SCALE),

  /**
   * Scales a size vertically considering both screen height and pixel density.
   * @param {number} size - The size to scale.
   * @returns {number} The scaled size.
   *
   * Use for:
   * - Heights of components
   * - Vertical padding or margins
   * - Vertical spacing between components
   * - Any vertical measurement that should scale with screen height
   */
  vs: (size: number) => Math.round(VERTICAL_SCALE * size * DENSITY_SCALE),

  /**
   * Applies a moderate horizontal scaling to a size, considering pixel density.
   * @param {number} size - The size to scale.
   * @param {number} [factor=0.5] - The factor to moderate the scaling (0-1).
   * @returns {number} The moderately scaled size.
   *
   * Use for:
   * - Sizes that should scale, but less dramatically than `s`
   * - Horizontal measurements where you want to maintain closer to original size on larger screens
   * - Padding or margins that need subtle scaling
   */
  ms: (size: number, factor: number = 0.5) => {
    return Math.round((size + (SCALE - 1) * size * factor) * DENSITY_SCALE);
  },

  /**
   * Applies a moderate vertical scaling to a size, considering pixel density.
   * @param {number} size - The size to scale.
   * @param {number} [factor=0.5] - The factor to moderate the scaling (0-1).
   * @returns {number} The moderately scaled size.
   *
   * Use for:
   * - Sizes that should scale vertically, but less dramatically than `vs`
   * - Vertical measurements where you want to maintain closer to original size on taller screens
   * - Vertical padding or margins that need subtle scaling
   */
  mvs: (size: number, factor: number = 0.5) => {
    return Math.round((size + (VERTICAL_SCALE - 1) * size * factor) * DENSITY_SCALE);
  },

  /**
   * Scales a font size based on the screen size, pixel density, and the device's font scale setting.
   * @param {number} size - The font size to scale.
   * @returns {number} The scaled font size.
   *
   * Use for:
   * - All text sizes in your app
   * - Ensures text respects both screen size and user's accessibility settings
   */
  font: (size: number) => {
    const fontScale = PixelRatio.getFontScale();
    return Math.round(SCALE * size * DENSITY_SCALE * fontScale);
  },

  /**
   * Calculates a width based on a percentage of the screen width.
   * @param {number} percentage - The percentage of the screen width (0-100).
   * @returns {number} The calculated width in pixels.
   *
   * Use for:
   * - Creating responsive layouts based on screen width percentages
   * - Widths that should always be a certain percentage of the screen
   * - Full-width components (use w(100))
   */
  w: (percentage: number) => {
    return Math.round((percentage / 100) * SCREEN_WIDTH);
  },

  /**
   * Calculates a height based on a percentage of the screen height.
   * @param {number} percentage - The percentage of the screen height (0-100).
   * @returns {number} The calculated height in pixels.
   *
   * Use for:
   * - Creating responsive layouts based on screen height percentages
   * - Heights that should always be a certain percentage of the screen
   * - Full-height components (use h(100))
   */
  h: (percentage: number) => {
    return Math.round((percentage / 100) * SCREEN_HEIGHT);
  },

  /**
   * Converts a fixed pixel value to a responsive size relative to the base design, considering pixel density.
   * @param {number} px - The pixel value based on the base design (e.g., 120 for a 120x120 view on iPhone 14).
   * @returns {number} The calculated responsive size.
   *
   * Use for:
   * - Translating exact pixel values from designs into responsive sizes
   * - When you need a size to be exactly as specified in the design on the base device,
   *   but scale appropriately on other devices
   */
  px: (px: number) => {
    const ratio = px / BASE_WIDTH;
    return Math.round(SCREEN_WIDTH * ratio * DENSITY_SCALE);
  },
};

export const { s, vs, ms, mvs, font, w, h, px } = metrics;

export default metrics;
