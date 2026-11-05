/**
 * Сервісний шар (Service Layer) верифікації фотографій.
 * Поєднує реальний клієнтський аналіз (EXIF, ELA) та Mock API для емуляції ML-сервера.
 * Забезпечує автономну роботу вебдодатка у браузері без обов'язкового підключення зовнішнього бекенду.
 */

import { AnalysisConfig, VerificationResult, AiVerdict, RiskLevel } from '../types';
import { ExifService } from './exifService';
import { ElaService } from './elaService';

export class MockBackendService {
  // Прапорець для примусової симуляції помилки з'єднання (для тестування стану ProcessingError)
  public static simulateNetworkFailure = false;

  /**
   * Головний метод запуску повної верифікації
   */
  public static async verifyPhoto(
    file: File,
    dataUrl: string,
    config: AnalysisConfig,
    onProgress?: (stageText: string, percent: number) => void
  ): Promise<VerificationResult> {
    const updateProgress = (text: string, pct: number) => {
      if (onProgress) onProgress(text, pct);
    };

    updateProgress('Ініціалізація та валідація бінарного потоку файлу...', 10);
    await this.delay(300);

    // 1. Зчитування EXIF-метаданих
    updateProgress('Зчитування EXIF, TIFF та XMP-метаданих у браузері...', 25);
    const exifData = config.checkExif
      ? await ExifService.parseMetadata(file)
      : await ExifService.parseMetadata('');
    await this.delay(350);

    // Перевірка на симуляцію збою мережі
    if (this.simulateNetworkFailure) {
      await this.delay(400);
      throw new Error('503 Service Unavailable: Не вдалося встановити з\'єднання з сервером ML-інференсу.');
    }

    // 2. Генерація ELA-карт
    updateProgress('Побудова карти похибок квантування (Canvas ELA)...', 55);
    const elaResult = config.checkEla
      ? await ElaService.generateElaMaps(dataUrl, 0.85, 24)
      : {
          elaDataUrl: dataUrl,
          invertedDataUrl: dataUrl,
          noiseDataUrl: dataUrl,
          discrepancyFactor: 1.0,
          suspiciousRegionsCount: 0,
        };
    await this.delay(400);

    // 3. Симуляція нейромережевого детектора генерацій ШІ
    updateProgress('Аналіз спектральних частот FFT та детектор артефактів ШІ...', 80);
    await this.delay(500);

    // 4. Формування підсумкового вердикту
    updateProgress('Узагальнення діагностичних факторів та формування вердикту...', 95);
    const verdict = this.evaluateVerdict(file.name, exifData, elaResult, config);
    await this.delay(250);

    const fileHash = await this.calculatePseudoHash(file.name + file.size + file.lastModified);

    updateProgress('Верифікацію успішно завершено!', 100);

    return {
      id: 'VERIF-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || 'image/jpeg',
      fileHash,
      timestamp: new Date().toLocaleString('uk-UA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      originalDataUrl: dataUrl,
      analysisConfig: config,
      exif: exifData,
      ela: elaResult,
      verdict,
    };
  }

  /**
   * Евристична оцінка автентичності зображення
   */
  private static evaluateVerdict(
    fileName: string,
    exif: any,
    ela: any,
    config: AnalysisConfig
  ): AiVerdict {
    const fn = fileName.toLowerCase();
    const suspiciousFactors: string[] = [];
    const safeFactors: string[] = [];

    let aiProb = 10;
    let manipProb = 10;

    // Аналіз імені файлу на натяки
    if (fn.includes('midjourney') || fn.includes('flux') || fn.includes('dalle') || fn.includes('ai') || fn.includes('synthetic')) {
      aiProb += 55;
      suspiciousFactors.push('Назва або сигнатура файлу містить позначення моделі ШІ');
    }
    if (fn.includes('photoshop') || fn.includes('edit') || fn.includes('manip') || fn.includes('crop')) {
      manipProb += 50;
      suspiciousFactors.push('Назва файлу вказує на обробку у графічному редакторі');
    }

    // Аналіз EXIF
    if (config.checkExif) {
      if (exif.software) {
        if (exif.software.toLowerCase().includes('photoshop') || exif.software.toLowerCase().includes('gimp')) {
          manipProb += 40;
          suspiciousFactors.push(`Виявлено тег графічного редактора: ${exif.software}`);
        } else {
          suspiciousFactors.push(`Застосовано стороннє програмне забезпечення: ${exif.software}`);
        }
      }

      if (exif.hasMetadataMismatch) {
        manipProb += 20;
        suspiciousFactors.push('Невідповідність часових міток зйомки та останнього збереження');
      }

      if (exif.make && exif.model) {
        safeFactors.push(`Підтверджена модель сенсора камери: ${exif.make} ${exif.model}`);
        aiProb -= 15;
      } else {
        suspiciousFactors.push('Відсутні апаратні дані камери (Make/Model видалені або синтезовані)');
        aiProb += 15;
      }

      if (exif.fNumber && exif.exposureTime) {
        safeFactors.push(`Фізичні параметри експозиції: f/${exif.fNumber}, ${exif.exposureTime}, ISO ${exif.iso || 'N/A'}`);
      }
    }

    // Аналіз ELA
    if (config.checkEla) {
      if (ela.discrepancyFactor > 4.0) {
        manipProb += 30;
        suspiciousFactors.push(`Високий коефіцієнт аномалій квантування ELA (${ela.discrepancyFactor}x)`);
      } else if (ela.discrepancyFactor > 2.5) {
        manipProb += 15;
        suspiciousFactors.push(`Помірні розбіжності стиснення ELA (${ela.discrepancyFactor}x)`);
      } else {
        safeFactors.push('Однорідний рівень похибки стиснення матриці JPEG');
      }

      if (ela.suspiciousRegionsCount > 5) {
        suspiciousFactors.push(`Локалізовано ${ela.suspiciousRegionsCount} ділянок із неоднорідними артефактами`);
      }
    }

    // Обмеження діапазонів
    aiProb = Math.min(99, Math.max(2, aiProb));
    manipProb = Math.min(99, Math.max(2, manipProb));

    const maxRisk = Math.max(aiProb, manipProb);
    const authenticityIndex = Math.max(1, 100 - maxRisk);

    let riskLevel: RiskLevel = 'authentic';
    let primaryVerdictText = 'Оригінальне цифрове фото';
    let detailedDescription = 'Аналіз не виявив ознак стороннього втручання чи цифрової генерації. Рівні ELA-стиснення та метадані повністю відповідають природній зйомці.';

    if (maxRisk >= 70) {
      riskLevel = 'fake';
      if (aiProb >= manipProb) {
        primaryVerdictText = `Висока ймовірність AI-генерації (${aiProb}%)`;
        detailedDescription = 'Структура зображення та відсутність природного сенсорного шуму вказують на генерацію нейромережевою моделлю (Midjourney / Stable Diffusion).';
      } else {
        primaryVerdictText = `Виявлено цифровий монтаж (${manipProb}%)`;
        detailedDescription = 'Теплова карта ELA зафіксувала явні сліди склеювання шарів або повторного збереження ділянок у графічному редакторі.';
      }
    } else if (maxRisk >= 40) {
      riskLevel = 'suspicious';
      primaryVerdictText = `Підозрілий медіафайл (Ризик ${maxRisk}%)`;
      detailedDescription = 'Знайдено непрямі аномалії (неоднорідність шуму, очищені метадані). Рекомендується додаткова ручна перевірка.';
    }

    return {
      aiProbability: aiProb,
      manipulationProbability: manipProb,
      authenticityIndex,
      riskLevel,
      primaryVerdictText,
      detailedDescription,
      suspiciousFactors,
      safeFactors,
    };
  }

  private static calculatePseudoHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return `sha256:7f9a${hex}e128b940c312...`;
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
