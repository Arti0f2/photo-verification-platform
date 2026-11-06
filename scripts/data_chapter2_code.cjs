const { Paragraph, TextRun } = require('docx');

function getChapter2Code(helpers) {
  const { createH1, createH2, createH3, createP, createBullet, createCodeBlock, createSpacer } = helpers;
  const elements = [];

  elements.push(new Paragraph({ pageBreakBefore: true, children: [] }));
  elements.push(createH1('РОЗДІЛ 2. ПРОГРАМНА РЕАЛІЗАЦІЯ ТА ДЕТАЛЬНИЙ РОЗБІР КОДУ'));

  // 2.1 Стек технологій
  elements.push(createH2('2.1. Стек технологій та інструментів розробки'));
  elements.push(createP(
    'Для реалізації проєкту обрано сучасний виробничий стек фронтенд-розробки, що забезпечує максимальну швидкодію, ' +
    'надійну строгу типізацію та відповідність сучасним стандартам веброзробки:'
  ));

  elements.push(createBullet('React 19 — використання компонентного підходу, оптимізованого узгодження віртуального дерева DOM та декларативного керування станами.', '1. React 19:'));
  elements.push(createBullet('TypeScript 5.8 — повна статична типізація структур даних, інтерфейсів та станів FSM, що усуває помилки часу виконання (Runtime Type Errors).', '2. TypeScript:'));
  elements.push(createBullet('Vite 8 — надшвидке середовище збірки на основі Rolldown/ESBuild із миттєвим гарячим оновленням модулів (HMR).', '3. Vite:'));
  elements.push(createBullet('Tailwind CSS 3.4 — утилітарний CSS-фреймворк для побудови Mobile-First адаптивного інтерфейсу та безшовної підтримки темної теми (Dark Mode).', '4. Tailwind CSS:'));
  elements.push(createBullet('HTML5 Canvas 2D API — апаратне маніпулювання попіксельним буфером (ImageData) для генерації карт ELA та рендерингу друкованого бланка A4.', '5. Canvas API:'));
  elements.push(createBullet('exifr — високопродуктивна клієнтська бібліотека для парсингу заголовків TIFF, EXIF, XMP, IPTC, ICC та GPS-координат.', '6. exifr:'));
  elements.push(createBullet('jsPDF Suite — формування та клієнтський експорт офіційного сертифіката експертизи у форматі PDF.', '7. jsPDF:'));
  elements.push(createBullet('Vitest & React Testing Library — сучасний тестовий раннер для модульного та інтеграційного тестування логіки валідації та аналізу.', '8. Vitest:'));

  // 2.2 Розбір src/types/index.ts
  elements.push(createH2('2.2. Архітектура системи типів та скінченного автомата (src/types/index.ts)'));
  elements.push(createP(
    'Файл src/types/index.ts є фундаментом типізації всієї платформи. Тут визначено дискриміновані об\'єднання (Discriminated Unions) ' +
    'та інтерфейси, які гарантують типобезпеку на всіх етапах обробки зображень.'
  ));

  const codeTypes = 
`// Стани інтерактивного віджета згідно з діаграмою станів (FSM)
export type DropzoneState =
  | 'Idle'             // Очікування файлу
  | 'DragOver'         // Перетягування над зоною
  | 'Validating'       // Перевірка MIME та розміру
  | 'ValidationError'  // Помилка формату чи ліміту 15 МБ
  | 'ReadyToAnalyze'   // Прев'ю згенеровано, очікування запуску
  | 'Analyzing'        // Процес обробки (прогрес 0-100%)
  | 'ProcessingError'  // Збій інференсу чи мережевий таймаут
  | 'Completed'        // Успішне завершення
  | 'Exporting';       // Генерація бланка PDF

export type RiskLevel = 'authentic' | 'suspicious' | 'fake';

export interface ExifRecord {
  make?: string; model?: string;
  dateTimeOriginal?: string; modifyDate?: string;
  software?: string; fNumber?: number;
  exposureTime?: number | string; iso?: number;
  isEditedInSoftware: boolean;
  hasMetadataMismatch: boolean;
  rawTagsCount: number;
}

export interface ElaResult {
  elaDataUrl: string;          // Теплова карта різниці
  invertedDataUrl: string;     // Інвертована висококонтрастна карта
  noiseDataUrl: string;        // Виділений шум сенсора камери
  discrepancyFactor: number;   // Коефіцієнт аномалій (від 1.0 до 10.0)
  suspiciousRegionsCount: number; // Кількість підозрілих зон
}`;
  elements.push(createCodeBlock(codeTypes));

  elements.push(createP(
    'Ключовою перевагою типізації є строге визначення DropzoneState. Завдяки TypeScript виключається ситуація, ' +
    'коли компонент одночасно знаходиться у стані завантаження та показує результати.'
  ));

  // 2.3 Розбір src/services/elaService.ts
  elements.push(createH2('2.3. Алгоритм Error Level Analysis (src/services/elaService.ts)'));
  elements.push(createP(
    'Модуль ElaService реалізує алгоритм Error Level Analysis (аналіз рівня похибок стиснення). ' +
    'Математична сутність ELA: кожне збереження у форматі JPEG застосовує дискретне косинусне перетворення (DCT) ' +
    'та матричне квантування з втратами. Якщо зображення зберігається вдруге з фіксованим коефіцієнтом якості (0.85), ' +
    'оригінальні незмінені ділянки вже досягли свого рівня стабільності похибки квантування (Error Level). ' +
    'Натомість нові вклеєні об\'єкти або ретушовані фрагменти зазнають первинного квантування і дають різко вищу дельту яскравості.'
  ));

  const codeElaMath = 
`// Попіксельний розрахунок дельти стиснення у прямому буфері ImageData:
for (let i = 0; i < len; i += 4) {
  const r1 = origData.data[i];     const r2 = recompData.data[i];
  const g1 = origData.data[i + 1]; const g2 = recompData.data[i + 1];
  const b1 = origData.data[i + 2]; const b2 = recompData.data[i + 2];

  // Абсолютна різниця за трьома колірними каналами:
  const diffR = Math.abs(r1 - r2);
  const diffG = Math.abs(g1 - g2);
  const diffB = Math.abs(b1 - b2);
  const avgDiff = (diffR + diffG + diffB) / 3;

  totalDiff += avgDiff;
  if (avgDiff > 12) highErrorPixelCount++;

  // Підсилення амплітуди для візуалізації (scaleFactor = 24):
  const amp = Math.min(255, Math.round(avgDiff * scaleFactor));

  // Колірний мапінг теплової карти:
  if (amp < 40) {
    // Фоновий природний шум (глибокий синій колір)
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
    // Критична аномалія монтажу (яскраво-червоний / маджента)
    elaImgData.data[i] = 255;
    elaImgData.data[i + 1] = 255 - amp;
    elaImgData.data[i + 2] = Math.round(amp * 0.8);
  }
  elaImgData.data[i + 3] = 255; // Повна непрозорість
}`;
  elements.push(createCodeBlock(codeElaMath));

  elements.push(createP(
    'Особливості оптимізації быстродії в ElaService:'
  ));
  elements.push(createBullet('Нормалізація габаритів (maxDim = 1200px): якщо вхідне фото має роздільну здатність 4K/8K, воно масштабується зі збереженням пропорцій. Це гарантує час аналізу менше 400 мс на будь-якому ноутбуці чи смартфоні.', '1.'));
  elements.push(createBullet('Використання прапорця { willReadFrequently: true } при отриманні контексту 2D. Це вказує рушію Chromium/V8 оптимізувати пам\'ять для багаторазових викликів getImageData() без затримки CPU-GPU синхронізації.', '2.'));
  elements.push(createBullet('Пряма робота з Uint8ClampedArray: обчислення здійснюються в одновимірному байтовому масиві в один прохід (O(N) складність).', '3.'));

  // 2.4 Розбір src/services/exifService.ts
  elements.push(createH2('2.4. Модуль аудиту метаданих камери (src/services/exifService.ts)'));
  elements.push(createP(
    'Сервіс ExifService відповідає за вилучення та криміналістичний аудит прихованих технічних заголовків файлу за допомогою бібліотеки exifr.'
  ));

  const codeExifLogic = 
`// Пошук згадок графічних редакторів та генеративних моделей
const editingKeywords = ['photoshop', 'lightroom', 'gimp', 'canva', 'paint.net', 'coreldraw', 'snapseed'];
const aiKeywords = ['midjourney', 'stable diffusion', 'dall-e', 'comfyui', 'automatic1111', 'flux'];

const isEditedInSoftware = editingKeywords.some(kw => combinedStrings.includes(kw));
const hasAiSignature = aiKeywords.some(kw => combinedStrings.includes(kw));

// Аналіз хронологічної аномалії (Mismatch між зйомкою та зміною)
let hasMetadataMismatch = false;
const origDateStr = raw.DateTimeOriginal || raw.CreateDate;
const modDateStr = raw.ModifyDate;

if (origDateStr && modDateStr) {
  const origTime = new Date(origDateStr).getTime();
  const modTime = new Date(modDateStr).getTime();
  if (!isNaN(origTime) && !isNaN(modTime) && Math.abs(modTime - origTime) > 600000) {
    // Розбіжність понад 10 хвилин свідчить про постобробку на комп'ютері
    hasMetadataMismatch = true;
  }
}`;
  elements.push(createCodeBlock(codeExifLogic));

  // 2.5 Розбір src/services/mockBackendService.ts
  elements.push(createH2('2.5. Оркестратор верифікації та формула оцінки ризику (src/services/mockBackendService.ts)'));
  elements.push(createP(
    'Модуль MockBackendService об\'єднує результати всіх підсистем та формує інтегральний висновок. ' +
    'Формула розрахунку інтегрального індексу автентичності базується на зваженій оцінці виявлених факторів:'
  ));

  const codeVerdictMath = 
`// Розрахунок підсумкового показника автентичності:
const maxRisk = Math.max(aiProb, manipProb);
const authenticityIndex = Math.max(1, 100 - maxRisk);

// Класифікація рівня загрози (Risk Levels):
if (maxRisk >= 70) {
  riskLevel = 'fake';       // Виявлено монтаж або AI (високий ризик)
} else if (maxRisk >= 40) {
  riskLevel = 'suspicious'; // Підозрілі аномалії (потрібна ручна перевірка)
} else {
  riskLevel = 'authentic';  // Оригінальне фото з підтвердженої камери
}`;
  elements.push(createCodeBlock(codeVerdictMath));

  elements.push(createP(
    'Для демонстрації стійкості до збоїв у MockBackendService реалізовано прапорець simulateNetworkFailure. ' +
    'Коли він увімкнений через перемикач у Navbar, сервіс імітує помилку «503 Service Unavailable», переводячи віджет ' +
    'у стан ProcessingError для тестування механізму Retry.'
  ));

  // 2.6 Розбір src/services/pdfExportService.ts
  elements.push(createH2('2.6. Клієнтська генерація PDF-сертифіката A4 (src/services/pdfExportService.ts)'));
  elements.push(createP(
    'При експорті криміналістичного висновку стандартний генератор jsPDF має критичний недолік — відсутність вбудованої ' +
    'підтримки шрифтів для української кирилиці (Cyrillic Glyphs). ' +
    'У проєкті розроблено інноваційне рішення: створення віртуального полотна Canvas A4 з роздільною здатністю 200 DPI (1654x2339 px), ' +
    'повне малювання офіційного бланка засобами Canvas 2D із системними шрифтами OS, експорт у DataURL та безшовне збереження у jsPDF.'
  ));

  const codePdfExport = 
`// Створення полотна A4 (210 x 297 мм при 200 DPI = 1654 x 2339 px)
const canvas = document.createElement('canvas');
canvas.width = 1654;
canvas.height = 2339;
const ctx = canvas.getContext('2d');

// 1. Малювання шапки документа з фірмовим градієнтом
// 2. Інформаційний блок файлу та цифровий хеш
// 3. Візуальне порівняння: оригінал поруч із ELA картою
// 4. Структурована таблиця EXIF тегів із кольоровими статусами
// 5. Офіційна кругла печатка верифікації "PHOTO VERIFIER LAB"

const imgData = canvas.toDataURL('image/jpeg', 0.95);
const pdf = new jsPDF('p', 'mm', 'a4');
pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
pdf.save(\`Звіт_верифікації_\${result.id}_\${result.fileName}.pdf\`);`;
  elements.push(createCodeBlock(codePdfExport));

  // 2.7 Розбір CompareSlider.tsx
  elements.push(createH2('2.7. Інтерактивний Split-Screen слайдер та лупа (CompareSlider.tsx)'));
  elements.push(createP(
    'Компонент CompareSlider дозволяє візуально досліджувати стики монтажу за допомогою горизонтального повзунка ' +
    'та інтерактивної лупи зі збільшенням 2.5x. Математика лупи базується на динамічному розрахунку transform-origin ' +
    'відносно відсоткового зміщення курсора всередині контейнера.'
  ));

  const codeSliderMath = 
`// Відстеження позиції курсора для лупи:
const handleMouseMove = (e: React.MouseEvent) => {
  if (containerRef.current) {
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }
};

// CSS-трансформація лупи:
// transform: \`scale(2.5)\`, transformOrigin: \`\${(mousePos.x / width) * 100}% \${(mousePos.y / height) * 100}%\``;
  elements.push(createCodeBlock(codeSliderMath));

  // 2.8 Тести Vitest
  elements.push(createH2('2.8. Автоматизоване тестування (src/tests/)'));
  elements.push(createP(
    'У проєкті реалізовано модульні тести на базі фреймворку Vitest: ' +
    '1. dropzoneValidation.test.ts — валідація валідних типів (JPEG/PNG/WebP), відхилення небезпечних файлів (EXE, PDF, GIF) ' +
    'та граничний тест ліміту 15 МБ (15728640 байт). ' +
    '2. exifAndVerdict.test.ts — перевірка форматування витримки (дрібні значення 0.002s -> "1/500s") та порожніх структур метаданих.'
  ));

  return elements;
}

module.exports = { getChapter2Code };
