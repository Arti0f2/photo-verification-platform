/**
 * Набір демонстраційних пресетів для швидкої демонстрації роботи системи
 * викладачу або під час захисту курсового проєкту.
 */

import { DemoPreset } from '../types';

// Генератор локальних тестових SVG зображень у форматі DataURL
function createDemoSvg(type: 'camera' | 'photoshop' | 'ai'): string {
  if (type === 'camera') {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <defs>
          <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0284c7" />
            <stop offset="100%" stop-color="#bae6fd" />
          </linearGradient>
          <linearGradient id="mount" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#334155" />
            <stop offset="100%" stop-color="#1e293b" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#sky)" />
        <polygon points="100,500 350,180 550,500" fill="url(#mount)" opacity="0.9" />
        <polygon points="380,500 580,240 750,500" fill="url(#mount)" opacity="0.8" />
        <rect y="480" width="800" height="120" fill="#15803d" />
        <circle cx="680" cy="120" r="45" fill="#fef08a" />
        <text x="40" y="560" font-family="sans-serif" font-size="22" font-weight="bold" fill="#ffffff">SONY ILCE-7RM4 / 24-70mm GM (Автентичний знімок)</text>
      </svg>
    `);
  } else if (type === 'photoshop') {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <rect width="800" height="600" fill="#0f172a" />
        <rect x="50" y="50" width="700" height="500" fill="#1e293b" rx="12" />
        <circle cx="280" cy="280" r="140" fill="#0284c7" />
        <!-- Вклеєний сторонній фрагмент із іншим шумом -->
        <g transform="translate(420, 180)">
          <rect width="260" height="220" fill="#f43f5e" rx="8" stroke="#ffffff" stroke-width="3" stroke-dasharray="6,4" />
          <text x="20" y="50" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff">ВКЛЕЄНИЙ ОБ'ЄКТ</text>
          <text x="20" y="90" font-family="sans-serif" font-size="14" fill="#ffe4e6">Неоднорідний шар стиснення</text>
          <text x="20" y="130" font-family="sans-serif" font-size="14" fill="#ffe4e6">Adobe Photoshop 2024</text>
        </g>
        <text x="70" y="520" font-family="sans-serif" font-size="20" fill="#f8fafc">Тестовий зразок цифрового монтажу (Splicing Manipulation)</text>
      </svg>
    `);
  } else {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <defs>
          <radialGradient id="aiGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#a855f7" />
            <stop offset="50%" stop-color="#6366f1" />
            <stop offset="100%" stop-color="#090d16" />
          </radialGradient>
        </defs>
        <rect width="800" height="600" fill="url(#aiGlow)" />
        <circle cx="400" cy="270" r="110" fill="#ec4899" opacity="0.6" filter="blur(20px)" />
        <polygon points="400,160 490,340 310,340" fill="#38bdf8" opacity="0.8" />
        <text x="400" y="440" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">Синтетична нейромережева текстура</text>
        <text x="400" y="480" font-family="sans-serif" font-size="18" fill="#e2e8f0" text-anchor="middle">Відсутній PRNU шум фізичної матриці камери</text>
        <text x="400" y="540" font-family="sans-serif" font-size="16" fill="#a855f7" text-anchor="middle">Згенеровано: Midjourney v6.0 / FLUX.1 Diffusion</text>
      </svg>
    `);
  }
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'demo-authentic',
    name: 'Зразок 1: Оригінал (Камера SONY)',
    description: 'Автентична фотографія прямо з камери із непорушеними метаданими EXIF та природним шумом матриці.',
    tag: 'camera',
    imageUrl: createDemoSvg('camera'),
    expectedResult: {
      risk: 'authentic',
      authenticity: 96,
      verdict: 'Оригінальне цифрове фото',
    },
  },
  {
    id: 'demo-photoshop',
    name: 'Зразок 2: Монтаж (Adobe Photoshop)',
    description: 'Зображення зі слідами склеювання (Splicing), перекомпресією шарів та метаданими графічного редактора.',
    tag: 'photoshop',
    imageUrl: createDemoSvg('photoshop'),
    expectedResult: {
      risk: 'fake',
      authenticity: 22,
      verdict: 'Виявлено цифровий монтаж (88%)',
    },
  },
  {
    id: 'demo-ai',
    name: 'Зразок 3: AI-генерація (FLUX / Midjourney)',
    description: 'Синтетичне зображення без фізичних слідів сенсора камери та з характерними аномаліями частот дифузійних моделей.',
    tag: 'ai',
    imageUrl: createDemoSvg('ai'),
    expectedResult: {
      risk: 'fake',
      authenticity: 12,
      verdict: 'Висока ймовірність AI-генерації (94%)',
    },
  },
];
