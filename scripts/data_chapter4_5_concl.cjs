const { Paragraph, TextRun } = require('docx');

function getChapter4and5(helpers) {
  const { createH1, createH2, createP, createBullet, createSpacer } = helpers;
  const elements = [];

  elements.push(new Paragraph({ pageBreakBefore: true, children: [] }));
  elements.push(createH1('ВИСНОВКИ'));

  elements.push(createP(
    'У процесі виконання індивідуального STEM-проєкту з освітнього компонента «Розробник фронтенду програмних систем» ' +
    'було успішно спроєктовано, розроблено, протестовано та задокументовано повнофункціональну клієнтську вебсистему ' +
    'верифікації автентичності цифрових зображень, аналізу помилок квантування (Error Level Analysis) та виявлення генерацій штучного інтелекту.'
  ));

  elements.push(createP('Основні науково-практичні та інженерні результати роботи:'));

  elements.push(createBullet(
    'Опановано сучасний виробничий стек фронтенд-розробки: бібліотеку React 19, мову TypeScript із суворою статичною типізацією, ' +
    'інструмент збірки Vite та утилітарний CSS-фреймворк Tailwind CSS. Забезпечено відповідність інтерфейсу принципам Mobile-First та доступності a11y.',
    '1. Опанування технологій:'
  ));

  elements.push(createBullet(
    'Реалізовано концепцію Client-Side Heavy Processing (Zero-Data Exposure). Обробка файлів, розрахунок різниці стиснення та аудит ' +
    'метаданих виконуються виключно у браузері користувача на апаратному рівні за допомогою HTML5 Canvas API та Web API, ' +
    'що гарантує повну конфіденційність чутливих зображень.',
    '2. Безпека та приватність:'
  ));

  elements.push(createBullet(
    'Розроблено та оптимізовано алгоритм Error Level Analysis (ELA) з масштабуванням 1200px та прапорцем { willReadFrequently: true }. ' +
    'Створено 3 аналітичні шари: кольорову теплову карту похибок, інвертований висококонтрастний вигляд та спектральну карту шуму матриці камери.',
    '3. Криміналістичний рушій:'
  ));

  elements.push(createBullet(
    'Інтегровано повноцінний аудит метаданих за допомогою exifr із детекцією згадок фоторедакторів (Adobe Photoshop, GIMP тощо), ' +
    'сигнатур генераторів ШІ (Midjourney, Stable Diffusion, FLUX) та автоматичним аналізом розбіжностей у хронології дат.',
    '4. Аудит метаданих:'
  ));

  elements.push(createBullet(
    'Спроєктовано інноваційне рішення проблеми кирилиці у jsPDF шляхом попереднього рендерингу бланка A4 з роздільною здатністю 200 DPI ' +
    'у віртуальному Canvas, що забезпечує бездоганну поліграфічну якість та чіткість шрифтів на роздруківці.',
    '5. Експорт PDF-сертифікатів:'
  ));

  elements.push(createBullet(
    'Побудовано надійну стейт-машину (FSM) віджета завантаження, покриту автоматизованими тестами Vitest для перевірки граничних ' +
    'випадків валідації (ліміт 15 МБ, фільтрація MIME-типів, захист від переповнення LocalStorage).',
    '6. Надійність та тестування:'
  ));

  elements.push(createP(
    'Розроблена система повністю відповідає поставленим вимогам робочої програми навчальної дисципліни (РНПД), ' +
    'має практичну цінність для фактчекерів, журналістів та судових експертів, а також демонструє високий інженерний рівень реалізації.'
  ));

  // СПИСОК ВИКОРИСТАНИХ ДЖЕРЕЛ
  elements.push(new Paragraph({ pageBreakBefore: true, children: [] }));
  elements.push(createH1('СПИСОК ВИКОРИСТАНИХ ДЖЕРЕЛ'));

  const sources = [
    'React Documentation. The Library for Web and Native User Interfaces. URL: https://react.dev (дата звернення: 05.11.2026).',
    'TypeScript Documentation. JavaScript With Syntax For Types. URL: https://www.typescriptlang.org/docs/ (дата звернення: 05.11.2026).',
    'Vite. Next Generation Frontend Tooling. URL: https://vite.dev (дата звернення: 05.11.2026).',
    'Tailwind CSS Documentation. Rapidly build modern websites without ever leaving your HTML. URL: https://tailwindcss.com/docs (дата звернення: 05.11.2026).',
    'Krawetz N. A Picture\'s Worth: Digital Image Analysis and Forensics // Hacker Factor Solutions. – 2007. – Vol. 6. – P. 1–18.',
    'ISO/IEC 10918-1:1994. Information technology — Digital compression and coding of continuous-tone still images: Requirements and guidelines (JPEG standard).',
    'W3C HTML Canvas 2D Context Specification. W3C Recommendation. URL: https://www.w3.org/TR/2dcontext/ (дата звернення: 05.11.2026).',
    'CIPA DC-008-2019. Exchangeable image file format for digital still cameras: Exif Version 2.32. Camera & Imaging Products Association, 2019. – 186 p.',
    'exifr Library Documentation. Fast EXIF and TIFF parser for Node.js and Browser. URL: https://github.com/MikeKovarik/exifr (дата звернення: 05.11.2026).',
    'jsPDF Documentation. Client-side JavaScript PDF generation for everyone. URL: https://github.com/parallax/jsPDF (дата звернення: 05.11.2026).',
    'Vitest. Next Generation Testing Framework. URL: https://vitest.dev (дата звернення: 05.11.2026).',
    'Fridrich J., Soukal D., Lukás J. Detection of Copy-Move Forgery in Digital Images // Proceedings of Digital Forensic Research Workshop. – 2003. – P. 55–61.',
    'Web Content Accessibility Guidelines (WCAG) 2.2. W3C Recommendation. URL: https://www.w3.org/TR/WCAG22/ (дата звернення: 05.11.2026).',
    'Oxlint Documentation. High-performance JavaScript and TypeScript linter written in Rust. URL: https://oxc.rs/docs/guide/usage/linter.html (дата звернення: 05.11.2026).',
    'ISO/IEC 17025:2017. General requirements for the competence of testing and calibration laboratories. International Organization for Standardization, 2017. – 38 p.',
    'Nielsen J. 10 Usability Heuristics for User Interface Design. Nielsen Norman Group, 2020. URL: https://www.nngroup.com/articles/ten-usability-heuristics/ (дата звернення: 05.11.2026).'
  ];

  sources.forEach((src, idx) => {
    elements.push(createBullet(src, `[${idx + 1}]`));
  });

  return elements;
}

module.exports = { getChapter4and5 };
