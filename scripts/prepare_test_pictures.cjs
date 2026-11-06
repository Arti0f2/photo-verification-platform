const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const testPicsDir = path.join(rootDir, 'test_pictures');
const publicTestPicsDir = path.join(rootDir, 'public', 'test_pictures');

// Створюємо папку public/test_pictures якщо не існує
if (!fs.existsSync(publicTestPicsDir)) {
  fs.mkdirSync(publicTestPicsDir, { recursive: true });
}

// Файли у папці test_pictures
const files = fs.readdirSync(testPicsDir);
console.log('Знайдені файли в test_pictures:', files);

// Знаходимо 3 файли за ключовими словами
const fileSony = files.find(f => f.toLowerCase().includes('соні') || f.toLowerCase().includes('sony'));
const filePhotoshop = files.find(f => f.toLowerCase().includes('склеюван') || f.toLowerCase().includes('photoshop'));
const fileAi = files.find(f => f.toLowerCase().includes('сгенеровано') || f.toLowerCase().includes('ai'));

if (!fileSony || !filePhotoshop || !fileAi) {
  console.error('Не всі 3 файли знайдено!', { fileSony, filePhotoshop, fileAi });
  process.exit(1);
}

console.log('1. Sony Camera:', fileSony);
console.log('2. Photoshop Splicing:', filePhotoshop);
console.log('3. AI Generated:', fileAi);

// Копіюємо у public/test_pictures
fs.copyFileSync(path.join(testPicsDir, fileSony), path.join(publicTestPicsDir, fileSony));
fs.copyFileSync(path.join(testPicsDir, filePhotoshop), path.join(publicTestPicsDir, filePhotoshop));
fs.copyFileSync(path.join(testPicsDir, fileAi), path.join(publicTestPicsDir, fileAi));
console.log('Скопійовано до public/test_pictures');

// Читаємо у Base64 DataURL
const bufSony = fs.readFileSync(path.join(testPicsDir, fileSony));
const base64Sony = `data:image/jpeg;base64,${bufSony.toString('base64')}`;

const bufPhotoshop = fs.readFileSync(path.join(testPicsDir, filePhotoshop));
const base64Photoshop = `data:image/png;base64,${bufPhotoshop.toString('base64')}`;

const bufAi = fs.readFileSync(path.join(testPicsDir, fileAi));
const base64Ai = `data:image/jpeg;base64,${bufAi.toString('base64')}`;

// Генеруємо src/services/demoImagesData.ts
const code = `/**
 * Автоматично згенеровані DataURL для тестових фотографій із test_pictures.
 */

export const DEMO_PICTURES = {
  sony: {
    fileName: ${JSON.stringify(fileSony)},
    fileType: 'image/jpeg',
    dataUrl: ${JSON.stringify(base64Sony)},
  },
  photoshop: {
    fileName: ${JSON.stringify(filePhotoshop)},
    fileType: 'image/png',
    dataUrl: ${JSON.stringify(base64Photoshop)},
  },
  ai: {
    fileName: ${JSON.stringify(fileAi)},
    fileType: 'image/jpeg',
    dataUrl: ${JSON.stringify(base64Ai)},
  },
};
`;

fs.writeFileSync(path.join(rootDir, 'src', 'services', 'demoImagesData.ts'), code, 'utf8');
console.log('Файл src/services/demoImagesData.ts успішно згенеровано!');
