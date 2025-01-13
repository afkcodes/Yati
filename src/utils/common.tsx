export function hexToRGBA(hex: string, opacity: number): string {
  // Ensure the opacity is within the range of 0 to 100
  const suppliedOpacity = Math.max(0, Math.min(100, opacity));

  // Convert the opacity to a value between 0 and 1
  const alpha: number = suppliedOpacity / 100;

  // Remove the '#' from the hex color if it exists
  const separatedHex = hex.replace('#', '');

  let r: number;
  let g: number;
  let b: number;
  if (hex.length === 3) {
    // Handle shorthand hex color (e.g., #abc)
    r = Number.parseInt(separatedHex[0] + separatedHex[0], 16);
    g = Number.parseInt(separatedHex[1] + separatedHex[1], 16);
    b = Number.parseInt(separatedHex[2] + separatedHex[2], 16);
  } else if (separatedHex.length === 6) {
    // Handle full separatedHex color (e.g., #aabbcc)
    r = Number.parseInt(separatedHex.substring(0, 2), 16);
    g = Number.parseInt(separatedHex.substring(2, 4), 16);
    b = Number.parseInt(separatedHex.substring(4, 6), 16);
  } else {
    throw new Error('Invalid hex color format. Use #abc or #aabbcc.');
  }

  // Return the color in RGBA format
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
