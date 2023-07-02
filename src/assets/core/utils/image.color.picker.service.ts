import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageColorPickerService {
  environment = environment;
  colors: string[] = [
    '#6236FF',
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
    console.log(index);
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
    var dColor = data![2] + 256 * data![1] + 65536 * data![0];
    console.log(pixelColor, dColor.toString(16));
    return '#' + dColor.toString(16);
    //};
    //return colorAsset;
  }
}
