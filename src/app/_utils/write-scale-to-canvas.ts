export function writeScaleToCanvas(event, canvas, olscale, option: any = {}) {
  // Scaleline thicknes
  const line = option.line || 6;

  // Offset from the left
  const x_offset = option.x_offset || 50;

  // offset from the bottom
  const y_offset = option.y_offset || 30;
  const fontSize = option.font_size || 15;
  const font = fontSize + 'px Arial';

  // how big should the scale be (original css-width multiplied)
  const multiplier = option.multiplier || 2;
  const ctx = event.context;
  const scaleWidth = parseInt(olscale.css('width'), 10) * multiplier;
  const scale = olscale.text();
  const scaleNumber = parseInt(scale, 10) * multiplier;
  const scaleUnit = scale.match(/[Aa-zZ]{1,}/g);

  // Scale Dimensions
  const xzero = scaleWidth + x_offset;
  const yzero = canvas.height - y_offset;
  const xfirst = x_offset + scaleWidth * 1 / 4;
  const xsecond = xfirst + scaleWidth * 1 / 4;
  const xthird = xsecond + scaleWidth * 1 / 4;
  const xfourth = xthird + scaleWidth * 1 / 4;

  // Scale Text
  ctx.beginPath();
  ctx.textAlign = 'left';
  ctx.strokeStyle = '#ffffff';
  ctx.fillStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.font = font;
  ctx.strokeText([scaleNumber + ' ' + scaleUnit], xsecond - scaleWidth / 8, canvas.height - y_offset - fontSize / 2);
  ctx.fillText([scaleNumber + ' ' + scaleUnit], xsecond - scaleWidth / 8, canvas.height - y_offset - fontSize / 2);

  // Stroke
  ctx.beginPath();
  ctx.lineWidth = line + 2;
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#ffffff';
  ctx.moveTo(x_offset, yzero);
  ctx.lineTo(xzero + 1, yzero);
  ctx.stroke();

  // Sections black/white
  ctx.beginPath();
  ctx.lineWidth = line;
  ctx.strokeStyle = '#000000';
  ctx.moveTo(x_offset, yzero);
  ctx.lineTo(xfirst, yzero);
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = line;
  ctx.strokeStyle = '#FFFFFF';
  ctx.moveTo(xfirst, yzero);
  ctx.lineTo(xsecond, yzero);
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = line;
  ctx.strokeStyle = '#000000';
  ctx.moveTo(xsecond, yzero);
  ctx.lineTo(xthird, yzero);
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = line;
  ctx.strokeStyle = '#FFFFFF';
  ctx.moveTo(xthird, yzero);
  ctx.lineTo(xfourth, yzero);
  ctx.stroke();

  return canvas;
}
