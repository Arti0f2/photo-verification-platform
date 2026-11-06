const { Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } = require('docx');

function getChapter1Design(helpers) {
  const { createH1, createH2, createH3, createP, createBullet, createCodeBlock, createSpacer } = helpers;
  const elements = [];

  elements.push(new Paragraph({ pageBreakBefore: true, children: [] }));
  elements.push(createH1('РОЗДІЛ 1. ПРОЄКТУВАННЯ ПРОГРАМНОГО ПРОДУКТУ'));

  // 1.1 Архітектурна концепція
  elements.push(createH2('1.1. Архітектурна концепція Client-Side First (Zero-Data Exposure)'));
  elements.push(createP(
    'При проєктуванні архітектури платформи Photo Verifier ключовим інженерним викликом був вибір між класичною клієнт-серверною ' +
    'моделлю (де фото відправляється на Python/FastAPI сервер) та повністю клієнтською обробкою (Client-Side In-Browser Processing). ' +
    'У результаті аналізу предметної області перевагу було однозначно віддано клієнтській моделі з огляду на такі критичні фактори:'
  ));

  elements.push(createBullet(
    'Абсолютна конфіденційність (Zero-Exposure). Користувачі досліджують чутливі документи, особисті фотографії або матеріали розслідувань. ' +
    'Обробка за допомогою HTML5 Canvas та exifr відбувається суто у пам’яті браузера користувача — жоден байт не надсилається до мережі.',
    '1. Безпека даних:'
  ));
  elements.push(createBullet(
    'Відсутність затримок мережевого транспорту (Round-Trip Time). Великі фотографії високої роздільної здатності (до 15 МБ) ' +
    'не потребують тривалого завантаження на сервер. Аналіз розпочинається миттєво після вибору файлу.',
    '2. Нульова затримка:'
  ));
  elements.push(createBullet(
    'Економічна ефективність та масштабованість. Клієнтська архітектура не вимагає оренди дорогих GPU-серверів для обробки зображень. ' +
    'Усі обчислення виконуються на обчислювальних потужностях пристрою клієнта (CPU/GPU за допомогою апаратного прискорення Canvas).',
    '3. Масштабованість:'
  ));

  // 1.2 User Flow Diagram
  elements.push(createH2('1.2. Діаграма Потоку користувача (User Flow Diagram)'));
  elements.push(createP(
    'Діаграма потоку користувача моделює наскрізний шлях взаємодії користувача із системою від моменту ініціалізації додатку ' +
    'до отримання підсумкового криміналістичного висновку та збереження артефактів експертизи.'
  ));

  const userFlowAscii = 
`+-------------------------------------------------------+
|            Відкриття платформи: App.tsx               |
+-------------------------------------------------------+
                           |
                           v
+-------------------------------------------------------+
|          Головний екран: DashboardOverview            |
+-------------------------------------------------------+
         |                                   |
 [Обрано демо-пресет?]             [Завантаження файлу]
    /             \\                                  |
 (Так)           (Ні)                                v
  |                |          +-------------------------------------+
  |                +--------> | VerificationDropzoneWidget          |
  |                           +-------------------------------------+
  v                                      |
+----------------------+                 v
| demoPresets.ts       |      [Файл коректний? (MIME, <15MB)]
+----------------------+          /                    \\
  |                            (Ні)                    (Так)
  |                             |                        |
  |                             v                        |
  |             +-------------------------------+        |
  |             | Помилка валідації (скидання) |        |
  |             +-------------------------------+        |
  |                             |                        |
  +-----------------------------+------------------------+
                                |
                                v
                +-------------------------------+
                | exifService.ts (EXIF, GPS)    |
                +-------------------------------+
                                |
                                v
                +-------------------------------+
                | elaService.ts + MockBackend   |
                +-------------------------------+
                                |
                                v
                      [Аналіз успішний?]
                         /          \\
                      (Ні)          (Так)
                       |              |
                       v              v
            +------------------+  +--------------------------------+
            | Помилка обробки  |  | Збереження в HistoryList       |
            | (Retry / Скид)   |  +--------------------------------+
            +------------------+                  |
                                                  v
                                  +--------------------------------+
                                  | Робоча область AnalysisWorkspace|
                                  +--------------------------------+
                                       |             |            |
                                       v             v            v
                                 CompareSlider   ExifTable   ReportView
                                                                  |
                                                                  v
                                                        [Експортувати звіт?]
                                                            /          \\
                                                         (Так)         (Ні)
                                                          |              |
                                                          v              v
                                                    pdfExportService  [Нова перевірка?]`;

  elements.push(createCodeBlock(userFlowAscii));

  elements.push(createH3('Вербальний опис кроків діаграми User Flow:'));
  elements.push(createBullet('Користувач відкриває додаток. Відбувається ініціалізація стану теми (Light/Dark), відновлення історії попередніх перевірок з LocalStorage та рендеринг панелі метрик.', 'Крок 1 (Ініціалізація):'));
  elements.push(createBullet('Користувач обирає один із двох шляхів: скористатися вбудованим демонстраційним пресетом (SONY Camera, Photoshop Splicing, AI Diffusion) для миттєвого ознайомлення або завантажити власний файл.', 'Крок 2 (Вибір джерела):'));
  elements.push(createBullet('При перетягуванні файлу у Dropzone спрацьовує валідатор. Перевіряється білий список форматів (image/jpeg, image/png, image/webp) та максимальний обсяг (<= 15 МБ). При невідповідності відображається інформаційне повідомлення з описом помилки.', 'Крок 3 (Клієнтська валідація):'));
  elements.push(createBullet('Виконується паралельний запуск аналітичних сервісів: ExifService витягує теги апаратури та хронології, а ElaService створює віртуальні полотна Canvas для розрахунку похибки рекомпресії.', 'Крок 4 (Криміналістичний аналіз):'));
  elements.push(createBullet('У разі збою (або увімкненої емуляції збою мережі) система переходить у стан ProcessingError із можливістю повторної спроби (Retry). При успішному аналізі результат додається до журналу HistoryList.', 'Крок 5 (Оцінка вердикту):'));
  elements.push(createBullet('Користувач взаємодіє з інтерактивним слайдером Original/ELA, активує лупу 2.5x для дослідження піксельних артефактів, переглядає структуровану таблицю EXIF та детальний опис виявлених факторів.', 'Крок 6 (Дослідження в Workspace):'));
  elements.push(createBullet('Користувач натискає «Завантажити PDF-звіт», сервіс PdfExportService генерує повнорозмірний бланк A4 (200/300 DPI) з цифровим хешем та печаткою експертизи.', 'Крок 7 (Експорт артефактів):'));

  // 1.3 State Diagram
  elements.push(createH2('1.3. Діаграма Станів інтерактивного віджета (State Diagram / FSM)'));
  elements.push(createP(
    'Поведінку інтерактивного компонента VerificationDropzoneWidget спроєктовано за патерном Скінченного автомата станів (Finite State Machine - FSM). ' +
    'Це гарантує детермінованість переходів інтерфейсу та унеможливлює стан «гонки» (Race Conditions) при завантаженні медіафайлів.'
  ));

  const stateDiagramAscii = 
`  [*] --> [Idle: Очікування файлу]
            |             ^
     (onDragEnter)   (onDragLeave)
            v             |
      [DragOver: Активна зона перетягування]
            |
        (onDrop / onFileChange)
            v
      [Validating: Перевірка MIME та розміру]
       /                                  \\
 [файл валідний]                   [помилка валідації]
     v                                     v
[ReadyToAnalyze: Прев'ю та EXIF]    [ValidationError: Помилка формату]
     |                 |                   |
 (startAnalysis)    (onReset)          (onReset)
     v                 +-------------------+-----> [Idle]
[Analyzing: Композитний стан аналізу]
  |-- 1. Парсинг EXIF заголовків (exifr)
  |-- 2. Побудова ELA карти стиснення (Canvas 2D)
  |-- 3. Розрахунок вердикту та індексу ризику
       /                                  \\
 [успішний аналіз]                  [помилка інференсу]
     v                                     v
[Completed: Відкриття Workspace]    [ProcessingError: Збій сервера]
     |                                     |
     |                               (onRetry / onReset)
     v                                     |
[Exporting: Генерація PDF-звіту]           v
     |                                  [Idle]
     v
    [*]`;

  elements.push(createCodeBlock(stateDiagramAscii));

  elements.push(createH3('Таблиця формального опису станів скінченного автомата:'));

  const tableHeaderStyle = { shading: { fill: '0F172A', type: ShadingType.CLEAR } };
  const th = (text) => new TableCell({
    ...tableHeaderStyle,
    margins: { top: 80, bottom: 80, left: 100, right: 100 },
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: 'FFFFFF', size: 20, font: 'Times New Roman' })] })]
  });
  const td = (text, isCode = false) => new TableCell({
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({ children: [new TextRun({ text, size: 20, font: isCode ? 'Consolas' : 'Times New Roman', color: '1E293B' })] })]
  });

  const stateTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' }
    },
    rows: [
      new TableRow({ children: [th('Назва стану (State)'), th('Події (Triggers)'), th('Умови (Guards)'), th('Дії (Actions)')] }),
      new TableRow({ children: [td('Idle', true), td('onDragEnter, onFileChange, onPreset'), td('–'), td('Відображення dropzone та карток пресетів')] }),
      new TableRow({ children: [td('DragOver', true), td('onDragLeave, onDrop'), td('event.dataTransfer != null'), td('Анімація пульсації та підсвітка рамки')] }),
      new TableRow({ children: [td('Validating', true), td('internal check'), td('file.size <= 15MB && validExt'), td('Виклик валідатора, підготовка blob URL')] }),
      new TableRow({ children: [td('ValidationError', true), td('onReset, onSelectNew'), td('isFormatInvalid || isOversized'), td('Показ повідомлення помилки, червона рамка')] }),
      new TableRow({ children: [td('ReadyToAnalyze', true), td('onStartClick, onReset'), td('previewUrl != null'), td('Швидкий попередній EXIF-аудит, вибір опцій')] }),
      new TableRow({ children: [td('Analyzing', true), td('progress events'), td('simulateNetworkFailure == false'), td('Canvas ELA + парсинг EXIF + розрахунок вердикту')] }),
      new TableRow({ children: [td('ProcessingError', true), td('onRetry, onReset'), td('simulateFailure || catch(err)'), td('Показ кнопки Retry, відновлення стану')] }),
      new TableRow({ children: [td('Completed', true), td('onExportPdf, onNewCheck'), td('result != null'), td('Рендеринг AnalysisWorkspace, запуск confetti')] }),
      new TableRow({ children: [td('Exporting', true), td('onSaveSuccess'), td('isExporting == true'), td('Рендеринг Canvas A4 та збереження файлу jsPDF')] })
    ]
  });

  elements.push(stateTable);

  // 1.4 Керівництво користувача
  elements.push(createH2('1.4. Керівництво користувача (User Guide з Wireframes)'));
  elements.push(createP(
    'Керівництво користувача розроблено згідно з додатком до навчально-методичних рекомендацій кафедри ПСТ. ' +
    'Воно описує цільову аудиторію, схеми розташування робочих зон (каркаси екранів / wireframes) та покрокову інструкцію.'
  ));

  elements.push(createH3('Призначення та цільова аудиторія:'));
  elements.push(createP(
    'Програмний комплекс Photo Verifier призначений для швидкого виявлення цифрових фальсифікацій, монтажу (splicing) ' +
    'та нейромережевих синтезованих зображень. Цільова аудиторія: фахівці з цифрової безпеки, фактчекери, журналісти-розслідувачі, ' +
    'криміналістичні аналітики, а також рядові користувачі, які потребують перевірки достовірності фотографій перед публікацією.'
  ));

  elements.push(createH3('Швидкий старт (Quick Start):'));
  elements.push(createP(
    'При першому вході користувач потрапляє на головний екран (Dashboard). Для миттєвого тестування без пошуку файлів на диску ' +
    'передбачено блок швидких пресетів у нижній частині віджета: «Зразок 1: Оригінал SONY» (камера), «Зразок 2: Монтаж Photoshop» ' +
    'та «Зразок 3: AI-генерація». Один клік на картку пресету автоматично запускає повний конвеєр перевірки.'
  ));

  elements.push(createH3('Каркаси робочих екранів (Wireframes):'));

  const wireframeDashboard = 
`+-------------------------------------------------------------------------+
| [LOGO] Photo Verifier [v1.0]      [Фото: 12]  [Mock API: OK]  [Тема: 🌙] |
+-------------------------------------------------------------------------+
| [Навігація] |  Детекція маніпуляцій та AI-генерацій на фото             |
| 📊 Панель   |  +-------------------------------------------------------+ |
| ☁️ Завантаж  |  | Всього: 12       | Фейки: 4 (33%) | Автентичні: 8 (67%)| |
| 🎛️ ELA Зона |  +-------------------------------------------------------+ |
| 📄 Звіт PDF |                                                           |
| 🕒 Історія  |  +-------------------------------------------------------+ |
| ℹ️ Про проєкт|  |               РОБОЧА ЗОНА DROPZONE                    | |
|             |  |        Перетягніть фото (JPEG, PNG, WebP)             | |
| [Статус]    |  |        [Обрати файл]  •  Ліміт до 15 МБ               | |
| Інференс OK |  +-------------------------------------------------------+ |
| Версія 1.0  |  | Пресет 1: Камера | Пресет 2: Монтаж | Пресет 3: AI   | |
+-------------------------------------------------------------------------+`;

  elements.push(createCodeBlock(wireframeDashboard));

  elements.push(createH3('Покрокова інструкція користувача:'));
  elements.push(createBullet('Перетягніть файл у вікно або клацніть «Обрати файл». За бажанням оберіть необхідні аналітичні модулі (чекбокси ELA, EXIF, AI) та натисніть «Розпочати верифікацію».', 'Крок 1 (Завантаження даних):'));
  elements.push(createBullet('Після завершення аналізу система відкриває вікно результату. Використовуйте повзунок Split-слайдера для порівняння оригіналу з тепловою картою ELA. Наведіть курсор миші для вмикання 2.5x лупи. Перемикайте шари між ELA, інвертованою картою та шумом сенсора.', 'Крок 2 (Дослідження та аналіз):'));
  elements.push(createBullet('Перейдіть на вкладку «Звіт та EXIF». Ознайомтеся з підсумковим індексом автентичності, списком факторів ризику та таблицею метаданих. Натисніть кнопку «Завантажити PDF-звіт» для збереження офіційного криміналістичного бланка.', 'Крок 3 (Експорт результатів):'));

  return elements;
}

module.exports = { getChapter1Design };
