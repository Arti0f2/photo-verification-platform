/**
 * Скрипт генерації офіційної пояснювальної записки та повного посібника для захисту
 * індивідуального STEM-проєкту у форматі Microsoft Word (.docx).
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

// Кольорова палітра та константи
const COLOR_PRIMARY = '0284C7';    // Sky Blue
const COLOR_SECONDARY = '0F172A';  // Slate Dark
const COLOR_TEXT = '334155';       // Slate 700
const COLOR_BG_LIGHT = 'F8FAFC';   // Slate 50
const COLOR_BORDER = 'CBD5E1';     // Slate 300
const COLOR_SUCCESS = '16A34A';    // Emerald
const COLOR_ALERT = 'DC2626';      // Red

// Хелпери для форматування
function createTitle(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 32,
        font: 'Times New Roman',
        color: COLOR_SECONDARY
      })
    ]
  });
}

function createH1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 28,
        font: 'Times New Roman',
        color: COLOR_SECONDARY
      })
    ]
  });
}

function createH2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 260, after: 120 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24,
        font: 'Times New Roman',
        color: COLOR_PRIMARY
      })
    ]
  });
}

function createH3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 22,
        font: 'Times New Roman',
        color: '1E293B'
      })
    ]
  });
}

function createP(text, options = {}) {
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
}

function createBullet(text, boldPrefix = '') {
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
}

function createCodeBlock(codeText) {
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
}

function createQaCard(qNumber, question, quickAnswer, fullAnswer) {
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
                  new TextRun({
                    text: `❓ Питання ${qNumber}: `,
                    bold: true,
                    size: 23,
                    font: 'Times New Roman',
                    color: COLOR_SECONDARY
                  }),
                  new TextRun({
                    text: question,
                    bold: true,
                    size: 23,
                    font: 'Times New Roman',
                    color: COLOR_PRIMARY
                  })
                ]
              }),
              new Paragraph({
                spacing: { before: 40, after: 80, line: 260 },
                children: [
                  new TextRun({
                    text: '⚡ Коротка суть (відповідь за 10 сек): ',
                    bold: true,
                    size: 21,
                    font: 'Times New Roman',
                    color: COLOR_SUCCESS
                  }),
                  new TextRun({
                    text: quickAnswer,
                    italics: true,
                    size: 21,
                    font: 'Times New Roman',
                    color: '1E293B'
                  })
                ]
              }),
              new Paragraph({
                spacing: { before: 40, after: 40, line: 270 },
                alignment: AlignmentType.JUSTIFY,
                children: [
                  new TextRun({
                    text: '📘 Технічне обґрунтування: ',
                    bold: true,
                    size: 21,
                    font: 'Times New Roman',
                    color: COLOR_SECONDARY
                  }),
                  new TextRun({
                    text: fullAnswer,
                    size: 21,
                    font: 'Times New Roman',
                    color: COLOR_TEXT
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}

function createSpacer(sizeTwips = 120) {
  return new Paragraph({ spacing: { before: sizeTwips, after: 0 }, children: [] });
}

console.log('Ініціалізація структури документу...');
