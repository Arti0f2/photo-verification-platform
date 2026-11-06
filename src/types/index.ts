/**
 * Типи даних та інтерфейси для системи верифікації фотографій Photo Verifier.
 * Відповідають діаграмам User Flow та State Diagram.
 */

// Стани інтерактивного віджета згідно з діаграмою станів (State Diagram)
export type DropzoneState =
  | 'Idle'             // Початковий стан очікування
  | 'DragOver'         // Перетягування об'єкта над зоною
  | 'Validating'       // Клієнтська валідація MIME-типу та розміру
  | 'ValidationError'  // Помилка валідації (формат або розмір > 15 МБ)
  | 'ReadyToAnalyze'   // Готовий до аналізу (прев'ю згенеровано, EXIF зчитано)
  | 'Analyzing'        // Процес верифікації (сканування, прогрес 0-100%)
  | 'ProcessingError'  // Помилка мережі або таймаут обробки
  | 'Completed'        // Успішне завершення, показ результатів
  | 'Exporting';       // Генерація звіту PDF

// Рівень ризику маніпуляції
export type RiskLevel = 'authentic' | 'suspicious' | 'fake';

// Конфігурація модулів перевірки (чекбокси користувача)
export interface AnalysisConfig {
  checkExif: boolean;      // Перевірка цілісності EXIF-метаданих
  checkEla: boolean;       // Error Level Analysis (аналіз артефактів стиснення)
  checkAi: boolean;        // Нейромережевий детектор слідів ШІ
  checkNoise: boolean;     // Спектральний аналіз високочастотного шуму
}

// Структуровані EXIF-метадані
export interface ExifRecord {
  make?: string;                // Виробник камери (напр. SONY, Canon)
  model?: string;               // Модель камери (напр. ILCE-7RM4)
  dateTimeOriginal?: string;    // Первинний час зйомки
  modifyDate?: string;          // Час останньої модифікації
  software?: string;            // ПЗ для редагування (Adobe Photoshop, Stable Diffusion)
  fNumber?: number;             // Діафрагма
  exposureTime?: number | string; // Витримка
  iso?: number;                 // ISO чутливість
  focalLength?: number;         // Фокусна відстань
  imageWidth?: number;          // Ширина зображення
  imageHeight?: number;         // Висота зображення
  latitude?: number;            // Географічна широта
  longitude?: number;           // Географічна довгота
  colorSpace?: string;          // Колірний простір (sRGB, Adobe RGB)
  isEditedInSoftware: boolean;  // Чи є згадка фоторедактора в заголовках
  hasMetadataMismatch: boolean; // Чи є розбіжність між датами зйомки та зміни
  rawTagsCount: number;         // Загальна кількість знайдених тегів
}

// Результати клієнтського ELA-аналізу
export interface ElaResult {
  elaDataUrl: string;          // Теплова карта різниці стиснення (Canvas DataURL)
  invertedDataUrl: string;     // Інвертована карта для детального контрасту
  noiseDataUrl: string;        // Виділений високочастотний шум сенсора
  discrepancyFactor: number;   // Коефіцієнт розбіжності квантування (від 1.0 до 10.0)
  suspiciousRegionsCount: number; // Кількість виявлених підозрілих кластерів
}

// Вердикт штучного інтелекту та детекторів
export interface AiVerdict {
  aiProbability: number;       // Ймовірність генерації ШІ (0 - 100%)
  manipulationProbability: number; // Ймовірність стороннього монтажу (0 - 100%)
  authenticityIndex: number;   // Підсумковий індекс автентичності (0 - 100%)
  riskLevel: RiskLevel;        // Категорія ризику (authentic / suspicious / fake)
  primaryVerdictText: string;  // Короткий текстовий висновок
  detailedDescription: string; // Розгорнутий висновок експертизи
  suspiciousFactors: string[]; // Список виявлених аномалій
  safeFactors: string[];       // Список факторів справжності
}

// Фінальний об'єкт верифікації
export interface VerificationResult {
  id: string;                  // Унікальний UUID перевірки
  fileName: string;            // Назва файлу
  fileSize: number;            // Розмір у байтах
  fileType: string;            // MIME-тип (image/jpeg тощо)
  fileHash: string;            // Хеш-ідентифікатор вмісту (SHA-256 симуляція)
  timestamp: string;           // Дата та час проведення аналізу
  originalDataUrl: string;     // URL оригінального фото
  analysisConfig: AnalysisConfig; // Налаштування, з якими проводився запуск
  exif: ExifRecord;            // Зчитані метадані
  ela: ElaResult;              // ELA-карта
  verdict: AiVerdict;          // Підсумковий вердикт
}

// Елемент історії перевірок (для збереження в LocalStorage)
export interface HistoryRecord {
  id: string;
  fileName: string;
  timestamp: string;
  riskLevel: RiskLevel;
  authenticityIndex: number;
  primaryVerdictText: string;
  thumbnailUrl: string;
  fileSizeFormatted: string;
}

// Попередньо завантажені демо-зразки для швидкого тестування функціоналу
export interface DemoPreset {
  id: string;
  name: string;
  fileName: string;
  fileType: string;
  description: string;
  tag: 'camera' | 'photoshop' | 'ai';
  imageUrl: string;
  expectedResult: {
    risk: RiskLevel;
    authenticity: number;
    verdict: string;
  };
}
