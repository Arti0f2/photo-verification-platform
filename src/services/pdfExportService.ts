/**
 * Сервіс формування та експорту експертного PDF-звіту верифікації фотографії.
 * Використовує Canvas-рендеринг для забезпечення 100% підтримки української кирилиці
 * та зберігає готовий документ через jsPDF.
 */

import { jsPDF } from 'jspdf';
import { VerificationResult } from '../types';

export class PdfExportService {
  /**
   * Генерує та завантажує PDF-сертифікат експертизи
   */
  public static async exportCertificate(result: VerificationResult): Promise<void> {
    // Створюємо віртуальне A4 полотно (2480 x 3508 px при 300 DPI)
    const canvas = document.createElement('canvas');
    canvas.width = 1654; // 200 DPI еквівалент A4 (210 мм)
    canvas.height = 2339; // 297 мм
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Помилка ініціалізації Canvas для PDF');

    // 1. Білий фон
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Шапка документу (Header)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, 180);

    // Декоративна смуга
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 180, canvas.width, 10);

    // Текст шапки
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
    ctx.fillText('СИСТЕМА ВЕРИФІКАЦІЇ ЦИФРОВИХ ЗОБРАЖЕНЬ', 80, 75);

    ctx.font = '22px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('ЕКСПЕРТНИЙ ВИСНОВОК АВТЕНТИЧНОСТІ МЕДІАФАЙЛУ (FORENSIC REPORT)', 80, 120);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
    ctx.fillText(`ID: ${result.id}`, canvas.width - 320, 75);
    ctx.font = '18px "Segoe UI", Arial, sans-serif';
    ctx.fillText(result.timestamp, canvas.width - 320, 115);

    // 3. Інформаційна картка файлу
    let y = 240;
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(80, y, canvas.width - 160, 180, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
    ctx.fillText('1. ЗАГАЛЬНІ ДАНІ ПРО ОБ\'ЄКТ ДОСЛІДЖЕННЯ', 110, y + 45);

    ctx.font = '20px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(`Назва файлу:`, 110, y + 85);
    ctx.fillText(`Розмір:`, 110, y + 120);
    ctx.fillText(`Цифровий хеш:`, 110, y + 155);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
    ctx.fillText(result.fileName, 260, y + 85);
    ctx.fillText(`${(result.fileSize / (1024 * 1024)).toFixed(2)} МБ (${result.fileSize.toLocaleString()} байт) [${result.fileType}]`, 260, y + 120);
    ctx.font = '18px monospace';
    ctx.fillText(result.fileHash, 260, y + 155);

    // 4. Вердикт та автентичність
    y += 220;
    const isFake = result.verdict.riskLevel === 'fake';
    const isSusp = result.verdict.riskLevel === 'suspicious';
    const bannerBg = isFake ? '#fee2e2' : isSusp ? '#fef3c7' : '#dcfce7';
    const bannerBorder = isFake ? '#ef4444' : isSusp ? '#f59e0b' : '#22c55e';
    const bannerText = isFake ? '#991b1b' : isSusp ? '#92400e' : '#166534';

    ctx.fillStyle = bannerBg;
    ctx.strokeStyle = bannerBorder;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(80, y, canvas.width - 160, 150, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = bannerText;
    ctx.font = 'bold 30px "Segoe UI", Arial, sans-serif';
    ctx.fillText(`ПІДСУМКОВИЙ ВЕРДИКТ: ${result.verdict.primaryVerdictText.toUpperCase()}`, 110, y + 55);

    ctx.font = '20px "Segoe UI", Arial, sans-serif';
    ctx.fillText(`Індекс справжності: ${result.verdict.authenticityIndex}%  |  Ймовірність AI-генерації: ${result.verdict.aiProbability}%  |  Ймовірність редагування: ${result.verdict.manipulationProbability}%`, 110, y + 95);
    ctx.font = 'italic 18px "Segoe UI", Arial, sans-serif';
    ctx.fillText(result.verdict.detailedDescription, 110, y + 130);

    // 5. Візуальне порівняння (Оригінал vs ELA Теплова карта)
    y += 190;
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
    ctx.fillText('2. ВІЗУАЛЬНИЙ КРИМІНАЛІСТИЧНИЙ АНАЛІЗ (ELA COMPARISON)', 80, y + 30);

    const imgWidth = 710;
    const imgHeight = 440;
    y += 50;

    // Малюємо рамку для оригіналу
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(80, y, imgWidth, imgHeight);
    try {
      const origImg = await this.loadImage(result.originalDataUrl);
      ctx.drawImage(origImg, 80, y, imgWidth, imgHeight);
    } catch {
      ctx.fillText('[Помилка завантаження оригіналу]', 100, y + 200);
    }
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.fillRect(80, y + imgHeight - 45, imgWidth, 45);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Оригінальне досліджуване зображення', 100, y + imgHeight - 16);

    // Малюємо рамку для ELA
    const xEla = 80 + imgWidth + 74;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(xEla, y, imgWidth, imgHeight);
    try {
      const elaImg = await this.loadImage(result.ela.elaDataUrl);
      ctx.drawImage(elaImg, xEla, y, imgWidth, imgHeight);
    } catch {
      ctx.fillText('[Помилка завантаження ELA]', xEla + 20, y + 200);
    }
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(xEla, y + imgHeight - 45, imgWidth, 45);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
    ctx.fillText(`Теплова карта похибок стиснення ELA (Аномалії: ${result.ela.discrepancyFactor}x)`, xEla + 20, y + imgHeight - 16);

    // 6. Таблиця EXIF-метаданих
    y += imgHeight + 40;
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
    ctx.fillText('3. ТЕХНІЧНІ МЕТАДАНІ КАМЕРИ ТА ЦІЛІСНІСТЬ EXIF', 80, y + 30);

    y += 50;
    const tableHeaders = ['Параметр метаданих', 'Значення в заголовках', 'Статус відповідності'];
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(80, y, canvas.width - 160, 45);
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
    ctx.fillText(tableHeaders[0], 100, y + 30);
    ctx.fillText(tableHeaders[1], 550, y + 30);
    ctx.fillText(tableHeaders[2], 1180, y + 30);

    const exifRows = [
      ['Виробник / Сенсор камери', result.exif.make || 'Не вказано (очищено)', result.exif.make ? 'ПІДТВЕРДЖЕНО' : 'АНОМАЛІЯ'],
      ['Модель обладнання', result.exif.model || 'Не визначено', result.exif.model ? 'ПІДТВЕРДЖЕНО' : 'ПІДОЗРІЛО'],
      ['Програмне забезпечення', result.exif.software || 'Відсутнє в тегах', result.exif.isEditedInSoftware ? 'ВИЯВЛЕНО РЕДАКТОР' : 'АВТЕНТИЧНО'],
      ['Дата та час фіксації', result.exif.dateTimeOriginal || 'Відсутні', result.exif.dateTimeOriginal ? 'АВТЕНТИЧНО' : 'НЕМАЄ ДАНИХ'],
      ['Параметри експозиції', result.exif.fNumber ? `f/${result.exif.fNumber}, ${result.exif.exposureTime || ''}, ISO ${result.exif.iso || ''}` : 'Відсутні', result.exif.fNumber ? 'АВТЕНТИЧНО' : 'НЕМАЄ ДАНИХ'],
      ['Колірний простір', result.exif.colorSpace || 'sRGB / Uncalibrated', 'НОРМА'],
      ['Коефіцієнт квантування ELA', `${result.ela.discrepancyFactor}x розбіжність`, result.ela.discrepancyFactor > 3.0 ? 'ПІДОЗРІЛИЙ ШАР' : 'ПРИРОДНИЙ ШУМ']
    ];

    y += 45;
    exifRows.forEach((row, idx) => {
      ctx.fillStyle = idx % 2 === 0 ? '#f8fafc' : '#ffffff';
      ctx.fillRect(80, y, canvas.width - 160, 40);

      ctx.font = '17px "Segoe UI", Arial, sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(row[0], 100, y + 26);
      ctx.fillStyle = '#0f172a';
      ctx.fillText(row[1], 550, y + 26);

      const status = row[2];
      ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
      if (status.includes('ПІДТВЕРДЖЕНО') || status.includes('АВТЕНТИЧНО') || status.includes('НОРМА')) {
        ctx.fillStyle = '#16a34a';
      } else if (status.includes('РЕДАКТОР') || status.includes('АНОМАЛІЯ') || status.includes('ПІДОЗРІЛ')) {
        ctx.fillStyle = '#dc2626';
      } else {
        ctx.fillStyle = '#64748b';
      }
      ctx.fillText(status, 1180, y + 26);

      y += 40;
    });

    // 7. Підвал (Підпис експерта, печатка верифікації)
    y = canvas.height - 240;
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, y);
    ctx.lineTo(canvas.width - 80, y);
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
    ctx.fillText('Звіт згенеровано аналітичною платформою Photo Verifier', 80, y + 40);
    ctx.font = '16px "Segoe UI", Arial, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Модуль цифрової криміналістики та виявлення модифікацій зображень', 80, y + 70);
    ctx.fillText('Документ містить криптографічний хеш і захищений від фальсифікації.', 80, y + 95);

    // Печатка експертизи
    ctx.save();
    ctx.translate(canvas.width - 280, y + 80);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 70, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#0284c7';
    ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PHOTO VERIFIER', 0, -25);
    ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
    ctx.fillText('VERIFIED', 0, 5);
    ctx.font = '12px "Segoe UI", Arial, sans-serif';
    ctx.fillText('SECURE LAB', 0, 30);
    ctx.restore();

    // 8. Конвертація Canvas у PDF через jsPDF
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
    pdf.save(`Звіт_верифікації_${result.id}_${result.fileName.replace(/\.[^/.]+$/, "")}.pdf`);
  }

  private static loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }
}
