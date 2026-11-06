/**
 * Набір демонстраційних пресетів для швидкої демонстрації та тестування можливостей системи.
 * Використовує реальні тестові фотографії із папки test_pictures.
 */

import { DemoPreset } from '../types';
import { DEMO_PICTURES } from './demoImagesData';

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'demo-authentic',
    name: 'Зразок 1: Оригінал (Камера SONY)',
    fileName: DEMO_PICTURES.sony.fileName,
    fileType: DEMO_PICTURES.sony.fileType,
    description: 'Автентична фотографія прямо з камери із непорушеними метаданими EXIF та природним шумом матриці.',
    tag: 'camera',
    imageUrl: DEMO_PICTURES.sony.dataUrl,
    expectedResult: {
      risk: 'authentic',
      authenticity: 96,
      verdict: 'Оригінальне цифрове фото',
    },
  },
  {
    id: 'demo-photoshop',
    name: 'Зразок 2: Монтаж (Adobe Photoshop)',
    fileName: DEMO_PICTURES.photoshop.fileName,
    fileType: DEMO_PICTURES.photoshop.fileType,
    description: 'Зображення зі слідами склеювання (Splicing), перекомпресією шарів та метаданими графічного редактора.',
    tag: 'photoshop',
    imageUrl: DEMO_PICTURES.photoshop.dataUrl,
    expectedResult: {
      risk: 'fake',
      authenticity: 22,
      verdict: 'Виявлено цифровий монтаж (88%)',
    },
  },
  {
    id: 'demo-ai',
    name: 'Зразок 3: AI-генерація (FLUX / Midjourney)',
    fileName: DEMO_PICTURES.ai.fileName,
    fileType: DEMO_PICTURES.ai.fileType,
    description: 'Синтетичне зображення без фізичних слідів сенсора камери та з характерними аномаліями частот дифузійних моделей.',
    tag: 'ai',
    imageUrl: DEMO_PICTURES.ai.dataUrl,
    expectedResult: {
      risk: 'fake',
      authenticity: 12,
      verdict: 'Висока ймовірність AI-генерації (94%)',
    },
  },
];
