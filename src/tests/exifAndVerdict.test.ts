import { describe, it, expect } from 'vitest';
import { ExifService } from '../services/exifService';

describe('Модульне тестування логіки парсингу та аналізу метаданих', () => {
  it('повинен коректно форматувати значення витримки (дрібні числа у вигляді 1/X s)', () => {
    // Тестуємо приватний метод через виклики
    const formatExposure = (ExifService as any).formatExposure;
    expect(formatExposure(0.002)).toBe('1/500s');
    expect(formatExposure(0.01)).toBe('1/100s');
    expect(formatExposure(2.5)).toBe('2.5s');
    expect(formatExposure('1/1000')).toBe('1/1000');
  });

  it('повинен створювати безпечну порожню структуру метаданих при відсутності EXIF', () => {
    const emptyRecord = (ExifService as any).createEmptyExifRecord();
    expect(emptyRecord.isEditedInSoftware).toBe(false);
    expect(emptyRecord.hasMetadataMismatch).toBe(false);
    expect(emptyRecord.rawTagsCount).toBe(0);
    expect(emptyRecord.make).toBeUndefined();
  });
});
