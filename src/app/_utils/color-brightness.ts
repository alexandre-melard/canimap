export function colorGetBrightness(rgb) {
  return Math.round(((parseInt(rgb.r, 10) * 299) +
    (parseInt(rgb.g, 10) * 587) +
    (parseInt(rgb.b, 10) * 114)) / 1000);
  }
