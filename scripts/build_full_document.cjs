/**
 * Головний скрипт збірки повної пояснювальної записки та бази питань/відповідей
 * у файл Microsoft Word (.docx).
 */

const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  Footer,
  PageNumber
} = require('docx');

// Імпорт хелперів та модулів
const { getCoverAndIntro } = require('./data_cover_intro.cjs');
const { getChapter1Design } = require('./data_chapter1_design.cjs');
const { getChapter2Code } = require('./data_chapter2_code.cjs');
const { getChapter3QA } = require('./data_chapter3_qa.cjs');
const { getChapter3QAPart2 } = require('./data_chapter3_qa_part2.cjs');
const { getChapter4and5 } = require('./data_chapter4_5_concl.cjs');

// Спільні кольори та хелпери
const COLOR_PRIMARY = '0284C7';
const COLOR_SECONDARY = '0F172A';
const COLOR_TEXT = '334155';
const COLOR_BORDER = 'CBD5E1';
const COLOR_SUCCESS = '16A34A';

const helpers = {
  createTitle(text) {
    return new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 120 },
      children: [
        new TextRun({ text, bold: true, size: 30, font: 'Times New Roman', color: COLOR_SECONDARY })
      ]
    });
  },
  createH1(text) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 360, after: 160 },
      children: [
        new TextRun({ text, bold: true, size: 28, font: 'Times New Roman', color: COLOR_SECONDARY })
      ]
    });
  },
  createH2(text) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 260, after: 120 },
      children: [
        new TextRun({ text, bold: true, size: 24, font: 'Times New Roman', color: COLOR_PRIMARY })
      ]
    });
  },
  createH3(text) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 200, after: 80 },
      children: [
        new TextRun({ text, bold: true, size: 22, font: 'Times New Roman', color: '1E293B' })
      ]
    });
  },
  createP(text, options = {}) {
    return new Paragraph({
      alignment: options.alignment || AlignmentType.JUSTIFY,
      spacing: { before: options.before || 60, after: options.after || 100, line: 276 },
      children: [
        new TextRun({
          text,
          bold: options.bold || false,
          italics: options.italics || false,
          size: options.size || 22,
          font: 'Times New Roman',
          color: options.color || COLOR_TEXT
        })
      ]
    });
  },
  createBullet(text, boldPrefix = '') {
    const children = [];
    if (boldPrefix) {
      children.push(new TextRun({ text: boldPrefix + ' ', bold: true, size: 22, font: 'Times New Roman', color: COLOR_SECONDARY }));
    }
    children.push(new TextRun({ text, size: 22, font: 'Times New Roman', color: COLOR_TEXT }));

    return new Paragraph({
      bullet: { level: 0 },
      spacing: { before: 40, after: 60, line: 260 },
      children
    });
  },
  createCodeBlock(codeText) {
    const lines = codeText.split('\n');
    const paragraphs = lines.map(line => new Paragraph({
      spacing: { before: 20, after: 20, line: 220 },
      children: [
        new TextRun({
          text: line.length ? line : ' ',
          font: 'Consolas',
          size: 18,
          color: '0F172A'
        })
      ]
    }));

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER },
        left: { style: BorderStyle.SINGLE, size: 6, color: COLOR_PRIMARY },
        right: { style: BorderStyle.SINGLE, size: 1, color: COLOR_BORDER }
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: 'F1F5F9', type: ShadingType.CLEAR },
              margins: { top: 120, bottom: 120, left: 180, right: 180 },
              children: paragraphs
            })
          ]
        })
      ]
    });
  },
  createQaCard(qNumber, question, quickAnswer, fullAnswer) {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
        bottom: { style: BorderStyle.SINGLE, size: 2, color: 'CBD5E1' },
        left: { style: BorderStyle.SINGLE, size: 8, color: COLOR_PRIMARY },
        right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' }
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              shading: { fill: 'F8FAFC', type: ShadingType.CLEAR },
              margins: { top: 140, bottom: 140, left: 200, right: 200 },
              children: [
                new Paragraph({
                  spacing: { before: 40, after: 80 },
                  children: [
                    new TextRun({ text: `❓ Питання ${qNumber}: `, bold: true, size: 23, font: 'Times New Roman', color: COLOR_SECONDARY }),
                    new TextRun({ text: question, bold: true, size: 23, font: 'Times New Roman', color: COLOR_PRIMARY })
                  ]
                }),
                new Paragraph({
                  spacing: { before: 40, after: 80, line: 260 },
                  children: [
                    new TextRun({ text: '⚡ Коротка суть (відповідь за 10 сек): ', bold: true, size: 21, font: 'Times New Roman', color: COLOR_SUCCESS }),
                    new TextRun({ text: quickAnswer, italics: true, size: 21, font: 'Times New Roman', color: '1E293B' })
                  ]
                }),
                new Paragraph({
                  spacing: { before: 40, after: 40, line: 270 },
                  alignment: AlignmentType.JUSTIFY,
                  children: [
                    new TextRun({ text: '📘 Технічне обґрунтування: ', bold: true, size: 21, font: 'Times New Roman', color: COLOR_SECONDARY }),
                    new TextRun({ text: fullAnswer, size: 21, font: 'Times New Roman', color: COLOR_TEXT })
                  ]
                })
              ]
            })
          ]
        })
      ]
    });
  },
  createSpacer(sizeTwips = 120) {
    return new Paragraph({ spacing: { before: sizeTwips, after: 0 }, children: [] });
  }
};

async function buildDocx() {
  console.log('Збирання розділів документа...');

  const allChildren = [
    ...getCoverAndIntro(helpers),
    ...getChapter1Design(helpers),
    ...getChapter2Code(helpers),
    ...getChapter3QA(helpers),
    ...getChapter3QAPart2(helpers),
    ...getChapter4and5(helpers)
  ];

  console.log(`Всього створено ${allChildren.length} структурних елементів Word.`);

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Times New Roman',
            size: 24, // 12pt
            color: COLOR_TEXT
          },
          paragraph: {
            spacing: { line: 276 } // 1.15 інтервал
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134,    // 20 мм (56.7 * 20)
              bottom: 1134, // 20 мм
              left: 1417,   // 25 мм
              right: 850    // 15 мм
            },
            pageNumbers: { start: 1 }
          }
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 100, after: 0 },
                children: [
                  new TextRun({ text: 'Photo Verifier STEM  |  Сторінка ', size: 18, color: '64748B', font: 'Times New Roman' }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 18, bold: true, color: '0F172A', font: 'Times New Roman' }),
                  new TextRun({ text: ' з ', size: 18, color: '64748B', font: 'Times New Roman' }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: '64748B', font: 'Times New Roman' })
                ]
              })
            ]
          })
        },
        children: allChildren
      }
    ]
  });

  console.log('Пакування у бінарний буфер docx...');
  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.resolve(__dirname, '..', 'Документація_та_Захист_STEM_проєкту_Photo_Verifier.docx');
  fs.writeFileSync(outputPath, buffer);

  console.log(`Готово! Документ Word успішно створено: ${outputPath}`);
  console.log(`Розмір файлу: ${(buffer.length / 1024).toFixed(2)} КБ`);
}

buildDocx().catch(err => {
  console.error('Помилка при формуванні документу:', err);
  process.exit(1);
});
