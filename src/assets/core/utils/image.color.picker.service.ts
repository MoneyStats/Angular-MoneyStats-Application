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
    //this.getBase64ImageFromUrl(img + '?r=' + Math.floor(Math.random() * 100000))
    //  .then((result) => console.log(result))
    //  .catch((err) => console.error(err));
    let canvas = <HTMLCanvasElement>document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let image = new Image();
    image.crossOrigin = 'anonymous';
    //this._img.addEventListener('load', img, false);
    //image.src = img + '?r=' + Math.floor(Math.random() * 100000);
    image.src = img;
    var data;
    let colorAsset = this.colors[index];
    //image.onload = function () {
    try {
      ctx?.drawImage(image, 0, 0);
      data = ctx?.getImageData(50, 50, 50, 50).data;
    } catch (e: any) {
      return colorAsset;
    }

    let pixelColor: string =
      'rgba(' +
      data![0] +
      ',' +
      data![1] +
      ',' +
      data![2] +
      ',' +
      data![3] +
      ')';

    //let colorPixel = 'rgb(' + data![0] + ',' + data![1] + ',' + data![2] + ')';
    //var dColor = data![2] + 256 * data![1] + 65536 * data![0];
    return this.rgbaToHex(pixelColor) != '#000000'
      ? this.rgbaToHex(pixelColor)
      : this.colors[index];
    //return colorPixel;
    //};
    //return colorAsset;
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
}
