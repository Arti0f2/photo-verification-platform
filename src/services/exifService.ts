/**
 * Сервіс для парсингу та аналізу EXIF-метаданих безпосередньо у браузері клієнта.
 * Використовує бібліотеку exifr для читання заголовків TIFF, EXIF, IPTC, XMP.
 */

import exifr from 'exifr';
import { ExifRecord } from '../types';

export class ExifService {
  /**
   * Зчитує метадані з файлу або DataURL
   */
  public static async parseMetadata(fileOrUrl: File | string): Promise<ExifRecord> {
    try {
      const raw = await exifr.parse(fileOrUrl, {
        tiff: true,
        xmp: true,
        exif: true,
        iptc: true,
        icc: true,
        gps: true,
        translateKeys: true,
        translateValues: true,
      });

      if (!raw) {
        return this.createEmptyExifRecord();
      }

      // Перевірка на згадки графічних редакторів та генераторів ШІ
      const software = raw.Software || raw.software || raw.ProcessingSoftware || '';
      const artist = raw.Artist || raw.artist || '';
      const documentName = raw.DocumentName || '';
      const combinedStrings = `${software} ${artist} ${documentName}`.toLowerCase();

      const editingKeywords = ['photoshop', 'lightroom', 'gimp', 'canva', 'paint.net', 'coreldraw', 'pixlr', 'snapseed'];
      const aiKeywords = ['midjourney', 'stable diffusion', 'dall-e', 'comfyui', 'automatic1111', 'novelai', 'flux'];

      const isEditedInSoftware = editingKeywords.some(kw => combinedStrings.includes(kw));
      const hasAiSignature = aiKeywords.some(kw => combinedStrings.includes(kw));

      // Перевірка розбіжності дати зйомки та модифікації
      let hasMetadataMismatch = false;
      const origDateStr = raw.DateTimeOriginal || raw.CreateDate;
      const modDateStr = raw.ModifyDate;

      if (origDateStr && modDateStr) {
        const origTime = new Date(origDateStr).getTime();
        const modTime = new Date(modDateStr).getTime();
        if (!isNaN(origTime) && !isNaN(modTime) && Math.abs(modTime - origTime) > 600000) {
          // Якщо різниця більше 10 хвилин — фото ймовірно зберігалось повторно
          hasMetadataMismatch = true;
        }
      }

      const rawTagsCount = Object.keys(raw).length;

      return {
        make: raw.Make ? String(raw.Make).trim() : undefined,
        model: raw.Model ? String(raw.Model).trim() : undefined,
        dateTimeOriginal: origDateStr ? String(origDateStr) : undefined,
        modifyDate: modDateStr ? String(modDateStr) : undefined,
        software: software ? String(software).trim() : (hasAiSignature ? 'Виявлено AI-метадані' : undefined),
        fNumber: raw.FNumber || raw.ApertureValue,
        exposureTime: raw.ExposureTime ? this.formatExposure(raw.ExposureTime) : undefined,
        iso: raw.ISO || raw.ISOSpeedRatings,
        focalLength: raw.FocalLength,
        imageWidth: raw.ImageWidth || raw.ExifImageWidth,
        imageHeight: raw.ImageHeight || raw.ExifImageHeight,
        latitude: raw.latitude,
        longitude: raw.longitude,
        colorSpace: raw.ColorSpace ? String(raw.ColorSpace) : undefined,
        isEditedInSoftware: isEditedInSoftware || hasAiSignature,
        hasMetadataMismatch,
        rawTagsCount,
      };
    } catch (err) {
      console.warn('EXIF парсинг не виявив тегів (можливо, метадані видалені):', err);
      return this.createEmptyExifRecord();
    }
  }

  private static formatExposure(val: number | string): string {
    if (typeof val === 'number') {
      if (val < 1 && val > 0) {
        return `1/${Math.round(1 / val)}s`;
      }
      return `${val}s`;
    }
    return String(val);
  }

  private static createEmptyExifRecord(): ExifRecord {
    return {
      make: undefined,
      model: undefined,
      dateTimeOriginal: undefined,
      modifyDate: undefined,
      software: undefined,
      fNumber: undefined,
      exposureTime: undefined,
      iso: undefined,
      focalLength: undefined,
      imageWidth: undefined,
      imageHeight: undefined,
      latitude: undefined,
      longitude: undefined,
      colorSpace: undefined,
      isEditedInSoftware: false,
      hasMetadataMismatch: false,
      rawTagsCount: 0,
    };
  }
}
