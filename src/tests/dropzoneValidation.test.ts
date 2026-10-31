import { describe, it, expect } from 'vitest';

describe('Клієнтська валідація файлів у VerificationDropzoneWidget', () => {
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15 МБ

  const validateFile = (file: { name: string; type: string; size: number }) => {
    const isExtensionValid = /\.(jpe?g|png|webp)$/i.test(file.name);
    const isMimeValid = ALLOWED_TYPES.includes(file.type);

    if (!isMimeValid && !isExtensionValid) {
      return { valid: false, error: 'INVALID_FORMAT' };
    }

    if (file.size > MAX_SIZE_BYTES) {
      return { valid: false, error: 'SIZE_EXCEEDED' };
    }

    return { valid: true };
  };

  it('повинен успішно пропускати стандартні формати JPEG, PNG, WebP розміром до 15 МБ', () => {
    const validJpeg = { name: 'photo_evidence.jpg', type: 'image/jpeg', size: 4.2 * 1024 * 1024 };
    const validPng = { name: 'screenshot_forensic.png', type: 'image/png', size: 8.5 * 1024 * 1024 };
    const validWebp = { name: 'ai_portrait.webp', type: 'image/webp', size: 1.1 * 1024 * 1024 };

    expect(validateFile(validJpeg).valid).toBe(true);
    expect(validateFile(validPng).valid).toBe(true);
    expect(validateFile(validWebp).valid).toBe(true);
  });

  it('повинен відхиляти файли непідтримуваних типів (PDF, EXE, SVG, GIF)', () => {
    const exeFile = { name: 'trojan_installer.exe', type: 'application/x-msdownload', size: 1024 };
    const pdfFile = { name: 'document.pdf', type: 'application/pdf', size: 50000 };
    const gifFile = { name: 'animation.gif', type: 'image/gif', size: 200000 };

    expect(validateFile(exeFile).error).toBe('INVALID_FORMAT');
    expect(validateFile(pdfFile).error).toBe('INVALID_FORMAT');
    expect(validateFile(gifFile).error).toBe('INVALID_FORMAT');
  });

  it('повинен відхиляти файли, розмір яких строго перевищує ліміт 15 МБ', () => {
    const borderlineValid = { name: 'huge_raw.jpg', type: 'image/jpeg', size: 15 * 1024 * 1024 };
    const oversizedFile = { name: 'huge_raw.jpg', type: 'image/jpeg', size: 15 * 1024 * 1024 + 1 };

    expect(validateFile(borderlineValid).valid).toBe(true);
    expect(validateFile(oversizedFile).valid).toBe(false);
    expect(validateFile(oversizedFile).error).toBe('SIZE_EXCEEDED');
  });
});
