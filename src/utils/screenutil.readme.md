# React Native Scaling Utility

A comprehensive utility for handling responsive scaling in React Native applications. This utility provides various functions to ensure your UI components scale appropriately across different device sizes and pixel densities.

## Quick Reference

| Function | Purpose | When to Use |
|----------|---------|-------------|
| `s()` | Scales based on screen width and pixel density | Widths, horizontal padding/margins, icon sizes |
| `vs()` | Scales based on screen height and pixel density | Heights, vertical padding/margins, spacings |
| `ms()` | Moderately scales based on width (less dramatic) | Subtle horizontal scaling, maintaining proportions |
| `mvs()` | Moderately scales based on height (less dramatic) | Subtle vertical scaling, maintaining proportions |
| `font()` | Scales fonts considering accessibility settings | All text sizes |
| `w()` | Calculates width as percentage of screen width | Responsive widths, full-width components |
| `h()` | Calculates height as percentage of screen height | Responsive heights, full-height components |
| `px()` | Converts fixed pixel values to responsive sizes | Translating exact design values to responsive sizes |

## Installation

```javascript
import { s, vs, ms, mvs, font, w, h, px } from './metrics';
```

## Common UI Components

### Buttons

Buttons should scale appropriately while maintaining touch-friendly dimensions across devices.

```javascript
const buttonStyles = {
  // Fixed width button
  width: s(200),          
  // OR percentage-based width
  // width: w(80),        // 80% of screen width
  
  height: vs(48),         // Consistent height scaling
  paddingHorizontal: s(16),
  paddingVertical: vs(8),
  borderRadius: s(8),
  fontSize: font(16)      // Accessible font scaling
}
```

### Images

Images can be scaled using different approaches depending on your layout needs.

```javascript
// Square image (maintains aspect ratio)
const squareImageStyles = {
  width: s(120),
  height: s(120),        // Use s() for both dimensions
  borderRadius: s(8)
}

// Full-width image
const fullWidthImageStyles = {
  width: w(100),         // 100% of screen width
  height: vs(200),       // Scaled height
  borderRadius: s(8)
}

// Profile avatar
const avatarStyles = {
  width: s(48),
  height: s(48),
  borderRadius: s(24),   // For circular avatar
}
```

### Cards/Tiles

Cards and tiles often need to maintain consistent spacing and dimensions.

```javascript
const cardStyles = {
  width: w(90),           // 90% of screen width
  height: vs(160),        // Scaled height
  padding: s(16),
  marginVertical: vs(8),
  marginHorizontal: s(12),
  borderRadius: s(12)
}

// Grid tile
const tileStyles = {
  width: s(160),          // Fixed width
  height: s(160),         // Square aspect ratio
  margin: s(8),
  borderRadius: s(8)
}
```

### Lists & List Items

List items should maintain consistent spacing and touch areas.

```javascript
const listItemStyles = {
  width: w(100),          // Full width
  height: vs(60),         // Consistent height
  paddingHorizontal: s(16),
  paddingVertical: vs(12)
}

const listSeparatorStyles = {
  height: vs(1),          // Thin separator
  marginLeft: s(16)
}
```

### Forms & Input Fields

Form elements should maintain usability across different screen sizes.

```javascript
const inputStyles = {
  width: w(90),           // 90% of screen width
  height: vs(48),         // Comfortable touch height
  paddingHorizontal: s(12),
  borderRadius: s(8),
  fontSize: font(16)
}

const labelStyles = {
  marginBottom: vs(8),
  fontSize: font(14)
}
```

## Best Practices

1. **Horizontal Measurements**
   - Use `s()` for fixed widths, horizontal padding, and margins
   - Use `w()` for percentage-based widths
   - Use `ms()` when you need more subtle scaling

2. **Vertical Measurements**
   - Use `vs()` for heights and vertical spacing
   - Use `h()` for percentage-based heights
   - Use `mvs()` for subtle vertical scaling

3. **Text Sizing**
   - Always use `font()` for text to respect accessibility settings
   - Consider using smaller scaling factors for larger text

4. **Component Spacing**
   - Use `s()` for horizontal gaps between components
   - Use `vs()` for vertical gaps between components

5. **Touch Targets**
   - Ensure touch targets are at least `vs(44)` height
   - Use appropriate padding to create comfortable touch areas

6. **Exact Specifications**
   - Use `px()` when you need to match exact design specifications from your base device (iPhone 14)

## Base Device Specifications

The scaling calculations are based on the iPhone 14 as the reference device:
- Base Width: 390
- Base Height: 844
- Base Pixel Ratio: 3

## Tips for Different Screen Sizes

- Test your layouts on both small and large devices
- Use percentage-based widths (`w()`) for flexible layouts
- Consider using `ms()` and `mvs()` for components that shouldn't scale as dramatically
- Always ensure touch targets remain comfortable across device sizes
- Remember that font scaling also respects the user's accessibility settings