// Unified Image Meta Context for coordinate conversion
// Stores image natural size, preview scale, and helpers

let naturalWidth = 0;
let naturalHeight = 0;
let previewWidth = 0;
let previewHeight = 0;

/**
 * Set image natural size (call after <img> onload)
 */
export function setNaturalSize(width: number, height: number) {
  naturalWidth = width;
  naturalHeight = height;
}

/**
 * Set preview size (call on preview resize)
 */
export function setPreviewSize(width: number, height: number) {
  previewWidth = width;
  previewHeight = height;
}

export function getNaturalWidth() {
  return naturalWidth;
}
export function getNaturalHeight() {
  return naturalHeight;
}
export function getPreviewScale() {
  return naturalWidth ? previewWidth / naturalWidth : 1;
}

/**
 * Convert percentage to pixels (x or y axis)
 * @param axis 'x' | 'y'
 * @param pct number (percentage, -100 to 100)
 */
export function pctToPx(axis: 'x' | 'y', pct: number) {
  if (axis === 'x') return (pct / 100) * naturalWidth;
  if (axis === 'y') return (pct / 100) * naturalHeight;
  return 0;
}

/**
 * Convert pixels to percentage (x or y axis)
 * @param axis 'x' | 'y'
 * @param px number
 */
export function pxToPct(axis: 'x' | 'y', px: number) {
  if (axis === 'x' && naturalWidth) return (px / naturalWidth) * 100;
  if (axis === 'y' && naturalHeight) return (px / naturalHeight) * 100;
  return 0;
}
