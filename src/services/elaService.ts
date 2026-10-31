/**
 * Клієнтський модуль аналізу рівня помилок стиснення (Error Level Analysis - ELA)
 * та спектрального шуму засобами HTML5 Canvas API.
 * 
 * Принцип ELA:
 * При повторному стисненні JPEG-зображення незмінені ділянки мають мінімальну похибку,
 * тоді як вклеєні або модифіковані об'єкти (копіпаст, Photoshop, AI inpainting)
 * демонструють різко підвищений рівень похибки квантування.
 */

import { ElaResult } from '../types';

export class ElaService {
  /**
   * Виконує повний цикл ELA-аналізу для заданого DataURL зображення.
   * @param imageSrc Джерело зображення (DataURL або Blob URL)
   * @param quality Коефіцієнт повторного JPEG-стиснення (за замовчуванням 0.85)
   * @param scaleFactor Множник підсилення амплітуди різниці (за замовчуванням 24)
   */
  public static async generateElaMaps(
    imageSrc: string,
    quality: number = 0.85,
    scaleFactor: number = 24
  ): Promise<ElaResult> {
    const originalImg = await this.loadImage(imageSrc);

    // Обмеження максимального розміру для оптимізації швидкодії у браузері
    const maxDim = 1200;
    let width = originalImg.naturalWidth || originalImg.width;
    let height = originalImg.naturalHeight || originalImg.height;

    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    // 1. Полотно оригінального зображення
    const origCanvas = document.createElement('canvas');
    origCanvas.width = width;
    origCanvas.height = height;
    const origCtx = origCanvas.getContext('2d', { willReadFrequently: true });
    if (!origCtx) throw new Error('Не вдалося отримати контекст Canvas 2D');
    origCtx.drawImage(originalImg, 0, 0, width, height);
    const origData = origCtx.getImageData(0, 0, width, height);

    // 2. Створення повторно стисненого JPEG
    const recompressedUrl = origCanvas.toDataURL('image/jpeg', quality);
    const recompImg = await this.loadImage(recompressedUrl);

    const recompCanvas = document.createElement('canvas');
    recompCanvas.width = width;
    recompCanvas.height = height;
    const recompCtx = recompCanvas.getContext('2d', { willReadFrequently: true });
    if (!recompCtx) throw new Error('Не вдалося отримати контекст Canvas 2D');
    recompCtx.drawImage(recompImg, 0, 0, width, height);
    const recompData = recompCtx.getImageData(0, 0, width, height);

    // 3. Обчислення попіксельної різниці для трьох карт:
    // a) ELA теплова карта (кольорова)
    // b) Інвертована контрастна карта
    // c) Високочастотний шум сенсора (High-Pass Noise)
    const elaCanvas = document.createElement('canvas');
    elaCanvas.width = width;
    elaCanvas.height = height;
    const elaCtx = elaCanvas.getContext('2d');
    if (!elaCtx) throw new Error('Не вдалося створити контекст ELA');
    const elaImgData = elaCtx.createImageData(width, height);

    const invCanvas = document.createElement('canvas');
    invCanvas.width = width;
    invCanvas.height = height;
    const invCtx = invCanvas.getContext('2d');
    if (!invCtx) throw new Error('Не вдалося створити контекст Inverted');
    const invImgData = invCtx.createImageData(width, height);

    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = width;
    noiseCanvas.height = height;
    const noiseCtx = noiseCanvas.getContext('2d');
    if (!noiseCtx) throw new Error('Не вдалося створити контекст Noise');
    const noiseImgData = noiseCtx.createImageData(width, height);

    const len = origData.data.length;
    let totalDiff = 0;
    let highErrorPixelCount = 0;

    for (let i = 0; i < len; i += 4) {
      const r1 = origData.data[i];
      const g1 = origData.data[i + 1];
      const b1 = origData.data[i + 2];

      const r2 = recompData.data[i];
      const g2 = recompData.data[i + 1];
      const b2 = recompData.data[i + 2];

      // Абсолютна похибка стиснення каналів
      const diffR = Math.abs(r1 - r2);
      const diffG = Math.abs(g1 - g2);
      const diffB = Math.abs(b1 - b2);
      const avgDiff = (diffR + diffG + diffB) / 3;

      totalDiff += avgDiff;
      if (avgDiff > 12) {
        highErrorPixelCount++;
      }

      // Підсилене значення для теплової карти
      const amp = Math.min(255, Math.round(avgDiff * scaleFactor));

      // ELA кольоровий мапінг (теплі тони для високих похибок)
      if (amp < 40) {
        // Фоновий слабкий шум (темно-синій)
        elaImgData.data[i] = Math.round(amp * 0.4);
        elaImgData.data[i + 1] = Math.round(amp * 0.7);
        elaImgData.data[i + 2] = Math.round(amp * 1.5);
      } else if (amp < 120) {
        // Помірний рівень (блакитний / бірюзовий)
        elaImgData.data[i] = 10;
        elaImgData.data[i + 1] = amp;
        elaImgData.data[i + 2] = 255 - amp;
      } else if (amp < 190) {
        // Підвищений рівень (жовтий / помаранчевий)
        elaImgData.data[i] = 255;
        elaImgData.data[i + 1] = amp;
        elaImgData.data[i + 2] = 20;
      } else {
        // Критична зона розбіжності (яскраво-червоний / маджента)
        elaImgData.data[i] = 255;
        elaImgData.data[i + 1] = 255 - amp;
        elaImgData.data[i + 2] = Math.round(amp * 0.8);
      }
      elaImgData.data[i + 3] = 255; // Alpha

      // Інвертована карта (високий контраст)
      const invVal = Math.min(255, Math.round(avgDiff * (scaleFactor * 1.2)));
      invImgData.data[i] = invVal;
      invImgData.data[i + 1] = invVal;
      invImgData.data[i + 2] = invVal;
      invImgData.data[i + 3] = 255;

      // Високочастотний спектральний шум (імітація PRNU шуму матриці камери)
      const pseudoNoise = Math.min(255, Math.round(diffR * 12 + diffG * 14 + diffB * 10));
      noiseImgData.data[i] = pseudoNoise;
      noiseImgData.data[i + 1] = Math.round(pseudoNoise * 0.85);
      noiseImgData.data[i + 2] = Math.round(pseudoNoise * 1.15);
      noiseImgData.data[i + 3] = 255;
    }

    elaCtx.putImageData(elaImgData, 0, 0);
    invCtx.putImageData(invImgData, 0, 0);
    noiseCtx.putImageData(noiseImgData, 0, 0);

    const totalPixels = width * height;
    const averageError = totalDiff / totalPixels;
    const highErrorRatio = highErrorPixelCount / totalPixels;

    // Коефіцієнт розбіжності квантування (від 1.0 до 10.0)
    const discrepancyFactor = Math.min(10.0, Math.max(1.0, +(1.0 + highErrorRatio * 25 + averageError * 0.5).toFixed(1)));
    const suspiciousRegionsCount = Math.round(highErrorPixelCount / 400);

    return {
      elaDataUrl: elaCanvas.toDataURL('image/png'),
      invertedDataUrl: invCanvas.toDataURL('image/png'),
      noiseDataUrl: noiseCanvas.toDataURL('image/png'),
      discrepancyFactor,
      suspiciousRegionsCount,
    };
  }

  /**
   * Завантаження зображення у HTMLImageElement через Promise
   */
  private static loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(new Error('Помилка завантаження зображення у Canvas: ' + e));
      img.src = src;
    });
  }
}
