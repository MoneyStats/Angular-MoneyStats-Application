import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageColorPickerService {
  environment = environment;
  colors: string[] = [
    '#6236FF',
    '#3c3c3d',
    '#d119d0',
    '#bb9df7',
    '#de3454',
    '#407306',
    '#9c413c',
    '#f2ed0a',
    '#fa5c42',
    '#57cb54',
    '#500295',
    '#f7eedc',
  ];

  getColor(img: string, index: number): string {
    if (img.includes('https://'))
      return this.colors[index] || this.getRandomColor();

    let canvas = <HTMLCanvasElement>document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = img;

    try {
      ctx?.drawImage(image, 0, 0);
      const data = ctx?.getImageData(60, 60, 60, 60)?.data ?? [];

      // Creazione del colore
      const pixelColor = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3]})`;
      const hexColor = this.rgbaToHex(pixelColor);

      const finalColor =
        hexColor !== '#000000'
          ? hexColor
          : this.colors[index] || this.getRandomColor();
      return finalColor;
    } catch (e: any) {
      console.error('Error processing image data, getting random color:', e);
      return this.getRandomColor();
    }
  }

  rgbaToHex(color: string): string {
    if (/^rgb/.test(color)) {
      const rgba = color.replace(/^rgba?\(|\s+|\)$/g, '').split(',');

      // rgb to hex
      // eslint-disable-next-line no-bitwise
      let hex = `#${(
        (1 << 24) +
        (parseInt(rgba[0], 10) << 16) +
        (parseInt(rgba[1], 10) << 8) +
        parseInt(rgba[2], 10)
      )
        .toString(16)
        .slice(1)}`;

      // added alpha param if exists
      if (rgba[4]) {
        const alpha = Math.round(0o1 * 255);
        const hexAlpha = (alpha + 0x10000)
          .toString(16)
          .substr(-2)
          .toUpperCase();
        hex += hexAlpha;
      }

      return hex;
    }
    return color;
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
