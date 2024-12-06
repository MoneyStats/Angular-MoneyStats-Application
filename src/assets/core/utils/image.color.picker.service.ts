import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageColorPickerService {
  environment = environment;
  private static colors: string[] = [
    '#6236FF',
    '#3c3c3d',
    '#bb9df7',
    '#d119d0',
    '#407306',
    '#de3454',
    '#9c413c',
    '#f2ed0a',
    '#fa5c42',
    '#57cb54',
    '#500295',
    '#f7eedc',
  ];

  public static getColor(img: string, index: number): string {
    if (img && !img.includes('data:image'))
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

  public static async getColorFromImage(
    img: string,
    defaultValue: string
  ): Promise<string> {
    // Funzione per calcolare la luminosità
    const isColorTooBright = (r: number, g: number, b: number): boolean => {
      const brightness = (r * 299 + g * 587 + b * 114) / 1000; // Calcola la luminosità
      return brightness > 200; // Colore "troppo chiaro" se luminosità > 200
    };

    let canvas = <HTMLCanvasElement>document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let image = new Image();
    image.crossOrigin = 'anonymous'; // Evita problemi di CORS
    image.src = img;

    return new Promise((resolve) => {
      image.onload = () => {
        try {
          canvas.width = image.width;
          canvas.height = image.height;
          ctx?.drawImage(image, 0, 0);

          // Lettura iniziale al centro
          const centerX = Math.floor(image.width / 2);
          const centerY = Math.floor(image.height / 2);
          const data = ctx?.getImageData(centerX, centerY, 1, 1)?.data ?? [];

          if (data.length === 4) {
            let [r, g, b, a] = data;

            // Controllo luminosità
            if (isColorTooBright(r, g, b)) {
              console.log('Colore troppo chiaro, cercando un altro punto...');
              // Leggi da un altro punto (angolo superiore sinistro)
              const dataFallback = ctx?.getImageData(10, 10, 1, 1)?.data ?? [];
              if (dataFallback.length === 4) {
                [r, g, b, a] = dataFallback;
              }
            }

            // Verifica se è ancora troppo chiaro
            if (isColorTooBright(r, g, b)) {
              console.log(
                'Colore fallback troppo chiaro, impostando un colore scuro predefinito.'
              );
              resolve('#333333'); // Colore scuro leggibile
            } else {
              const pixelColor = `rgba(${r}, ${g}, ${b}, ${a})`;
              const hexColor = this.rgbaToHex(pixelColor);

              const finalColor =
                hexColor !== '#000000'
                  ? hexColor
                  : (defaultValue.includes('#')
                      ? defaultValue
                      : '#' + defaultValue) || this.getRandomColor();
              resolve(finalColor);
            }
          } else {
            console.warn('Dati immagine non validi, usando un colore casuale.');
            resolve(this.getRandomColor());
          }
        } catch (e: any) {
          console.error('Errore durante l’elaborazione dell’immagine:', e);
          resolve(defaultValue ?? this.getRandomColor());
        }
      };

      image.onerror = () => {
        console.error('Errore durante il caricamento dell’immagine:', img);
        resolve(defaultValue ?? this.getRandomColor());
      };
    });
  }

  public static rgbaToHex(color: string): string {
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

  public static getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
