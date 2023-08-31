export default class ColorFormatter {
  static lightenColor(color: string, factor = 0.7): string {
    color = color.replace('#', '');

    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4, 6), 16);

    const newR = Math.min(r + (255 - r) * factor, 255);
    const newG = Math.min(g + (255 - g) * factor, 255);
    const newB = Math.min(b + (255 - b) * factor, 255);

    const newColor = `#${Math.round(newR)
      .toString(16)
      .padStart(2, '0')}${Math.round(newG)
      .toString(16)
      .padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;

    return newColor;
  }

  static convertColors(color: string): string {
    if (color.startsWith('HSLA(')) return this.convertFromHslaToHex(color);
    if (color.startsWith('RGB(')) return this.convertFromRgbaToHex(color);
    return color;
  }

  static convertFromHslaToHex(hsl: string): string {
    const hslValues = hsl.substring(4, hsl.length - 1).split(',');

    const hue = parseFloat(hslValues[0].trim());
    const saturation = parseFloat(hslValues[1].trim());
    const lightness = parseFloat(hslValues[2].trim());

    const h = hue / 360;
    const s = saturation / 100;
    const l = lightness / 100;

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    const r = this.hueToRgb(p, q, h + 1 / 3);
    const g = this.hueToRgb(p, q, h);
    const b = this.hueToRgb(p, q, h - 1 / 3);

    const redHex = Math.round(r * 255)
      .toString(16)
      .padStart(2, '0');
    const greenHex = Math.round(g * 255)
      .toString(16)
      .padStart(2, '0');
    const blueHex = Math.round(b * 255)
      .toString(16)
      .padStart(2, '0');

    return `#${redHex}${greenHex}${blueHex}`;
  }

  static convertFromRgbaToHex(rgb: string): string {
    const rgbValues = rgb.substring(4, rgb.length - 1).split(',');

    const red = parseInt(rgbValues[0].trim(), 10);
    const green = parseInt(rgbValues[1].trim(), 10);
    const blue = parseInt(rgbValues[2].trim(), 10);

    return `#${((1 << 24) | (red << 16) | (green << 8) | blue)
      .toString(16)
      .slice(1)}`;
  }

  static hueToRgb(p: number, q: number, t: number): number {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
}
