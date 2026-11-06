const { Paragraph, TextRun, AlignmentType } = require('docx');

function getCoverAndIntro(helpers) {
  const { createTitle, createH1, createH2, createP, createBullet, createSpacer } = helpers;
  const elements = [];

  // ТИТУЛЬНИЙ АРКУШ
  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 60, line: 240 },
    children: [
      new TextRun({ text: 'МІНІСТЕРСТВО ОСВІТИ І НАУКИ УКРАЇНИ', bold: true, size: 22, font: 'Times New Roman' }),
    ]
  }));
  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 60, line: 240 },
    children: [
      new TextRun({ text: 'КИЇВСЬКИЙ НАЦІОНАЛЬНИЙ УНІВЕРСИТЕТ ІМЕНІ ТАРАСА ШЕВЧЕНКА', bold: true, size: 22, font: 'Times New Roman' }),
    ]
  }));
  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 60, line: 240 },
    children: [
      new TextRun({ text: 'ФАКУЛЬТЕТ КОМП’ЮТЕРНИХ НАУК ТА КІБЕРНЕТИКИ', bold: true, size: 22, font: 'Times New Roman' }),
    ]
  }));
  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 400, line: 240 },
    children: [
      new TextRun({ text: 'Кафедра програмних систем і технологій', italics: true, size: 22, font: 'Times New Roman' }),
    ]
  }));

  elements.push(createSpacer(600));

  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 80 },
    children: [
      new TextRun({ text: 'ПОЯСНЮВАЛЬНА ЗАПИСКА', bold: true, size: 30, font: 'Times New Roman', color: '0F172A' }),
    ]
  }));
  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 120 },
    children: [
      new TextRun({ text: 'до індивідуального STEM-проєкту', bold: true, size: 26, font: 'Times New Roman', color: '0284C7' }),
    ]
  }));
  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 200 },
    children: [
      new TextRun({ text: 'з освітнього компонента «Розробник фронтенду програмних систем»', italics: true, size: 22, font: 'Times New Roman' }),
    ]
  }));

  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 400, line: 280 },
    children: [
      new TextRun({ text: 'на тему: ', size: 22, font: 'Times New Roman' }),
      new TextRun({
        text: '«Клієнтська вебсистема верифікації автентичності цифрових зображень, Error Level Analysis (ELA) та AI-детекції»',
        bold: true,
        size: 24,
        font: 'Times New Roman',
        color: '0F172A'
      }),
    ]
  }));

  elements.push(createSpacer(800));

  // Відомості про студента та викладача (вирівнювання праворуч)
  elements.push(new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { before: 40, after: 40, line: 240 },
    children: [
      new TextRun({ text: 'Виконав: ', bold: true, size: 22, font: 'Times New Roman' }),
      new TextRun({ text: 'студент 3 курсу, ФКНК', size: 22, font: 'Times New Roman' })
    ]
  }));
  elements.push(new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { before: 40, after: 40, line: 240 },
    children: [
      new TextRun({ text: 'Освітня програма: ', bold: true, size: 22, font: 'Times New Roman' }),
      new TextRun({ text: '«Інженерія програмного забезпечення»', size: 22, font: 'Times New Roman' })
    ]
  }));
  elements.push(new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { before: 40, after: 40, line: 240 },
    children: [
      new TextRun({ text: 'Перевірила (лектор): ', bold: true, size: 22, font: 'Times New Roman' }),
      new TextRun({ text: 'доцент кафедри ПСТ, к.т.н. Ірина Юрчук', size: 22, font: 'Times New Roman' })
    ]
  }));

  elements.push(createSpacer(1000));

  elements.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 0 },
    children: [
      new TextRun({ text: 'Київ – 2026', bold: true, size: 22, font: 'Times New Roman' })
    ]
  }));

  // РОЗРИВ СТОРІНКИ ПІСЛЯ ТИТУЛКИ
  elements.push(new Paragraph({ pageBreakBefore: true, children: [] }));

  // ВСТУП ТА ПАСПОРТ ПРОЄКТУ
  elements.push(createH1('ВСТУП'));

  elements.push(createP(
    'Стрімкий розвиток генеративних нейромережевих моделей (Midjourney v6, Stable Diffusion XL, FLUX, DALL-E 3), ' +
    'а також доступність інструментів автоматизованої ретуші та генеративного заповнення (Adobe Photoshop Generative Fill) ' +
    'призвели до безпрецедентного зростання обсягів синтетичного та маніпульованого візуального контенту. ' +
    'У цифрову епоху проблема верифікації медіафайлів набуває вирішального значення для журналістських розслідувань, фактчекінгу, ' +
    'судової експертизи, юридичного документообігу та кібербезпеки.'
  ));

  elements.push(createP(
    'Більшість наявних онлайн-інструментів аналізу мають суттєві недоліки: вони вимагають обов’язкового завантаження файлів ' +
    'на віддалені сервери (що неприпустимо для персональних, конфіденційних або чутливих фотографій), мають високу латентність ' +
    'через передачу великих обсягів даних по мережі та обмежені можливості інтерактивного дослідження.'
  ));

  elements.push(createH2('Мета та завдання STEM-проєкту'));
  elements.push(createP(
    'Мета даного STEM-проєкту полягає у засвоєнні сучасних бібліотек та фреймворків у сфері розробки фронтенду програмних систем ' +
    '(React 19, TypeScript, Tailwind CSS, Vite, HTML5 Canvas API), побудові клієнтської архітектури криміналістичного аналізу зображень, ' +
    'яка відповідає суворим вимогам адаптивності, кросбраузерності, захищеності та забезпечує безкомпромісну зручність користувацького досвіду (UX).'
  ));

  elements.push(createP('Для досягнення поставленої мети сформовано та виконано такі інженерні завдання:'));
  elements.push(createBullet('Опанувати сучасну бібліотеку React та систему суворої статичної типізації TypeScript з огляду на предметну область цифрової криміналістики.', '1.'));
  elements.push(createBullet('Спроєктувати та реалізувати архітектуру Service Layer для обробки зображень безпосередньо у браузері без передачі на бекенд (Zero-Server Processing).', '2.'));
  elements.push(createBullet('Розробити клієнтський модуль аналізу рівня похибок квантування (Error Level Analysis - ELA) на базі апаратного HTML5 Canvas 2D.', '3.'));
  elements.push(createBullet('Реалізувати парсинг та евристичний аудит бінарних метаданих EXIF, TIFF, GPS, XMP за допомогою бібліотеки exifr.', '4.'));
  elements.push(createBullet('Побудувати інтерактивний користувацький інтерфейс зі Split-Screen слайдером порівняння шарів та функцією лінзи-збільшувача (2.5x Zoom Lens).', '5.'));
  elements.push(createBullet('Розробити механізм експорту криміналістичного експертного висновку у формат PDF з підтримкою кирилиці та вбудованим цифровим хешем.', '6.'));
  elements.push(createBullet('Оформити повний комплект технічної документації: діаграму User Flow, діаграму State Machine, керівництво користувача та тестове покриття (Vitest).', '7.'));

  elements.push(createH2('Паспорт та технічні характеристики проєкту'));
  elements.push(createBullet('Клієнтська вебсистема верифікації автентичності зображень Photo Verifier', 'Назва системи:'));
  elements.push(createBullet('ОК «Розробник фронтенду програмних систем», ФКНК КНУ ім. Т. Шевченка', 'Освітній компонент:'));
  elements.push(createBullet('SPA (Single Page Application), Client-Side Heavy Processing, Service Layer Pattern', 'Архітектура:'));
  elements.push(createBullet('React 19, TypeScript 5.8, Vite 8, Tailwind CSS 3.4, HTML5 Canvas API, exifr, jsPDF, Lucide-React, Vitest', 'Технологічний стек:'));
  elements.push(createBullet('JPEG, PNG, WebP (максимальний розмір файлу — до 15 МБ)', 'Підтримувані формати:'));
  elements.push(createBullet('Повна ізоляція обробки у пам’яті клієнта; нульова передача пікселів на зовнішні сервери', 'Рівень безпеки:'));
  elements.push(createBullet('https://github.com/Arti0f2/photo-verification-platform', 'Репозиторій вихідного коду:'));

  return elements;
}

module.exports = { getCoverAndIntro };
