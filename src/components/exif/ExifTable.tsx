import React, { useState } from 'react';
import { ExifRecord } from '../../types';
import { Search, AlertCircle, CheckCircle, HelpCircle, Camera, Clock, Wrench } from 'lucide-react';

interface ExifTableProps {
  exif: ExifRecord;
  fileName: string;
}

export const ExifTable: React.FC<ExifTableProps> = ({ exif, fileName }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Формуємо рядки таблиці
  const rows = [
    {
      group: 'Обладнання',
      param: 'Виробник камери (Make)',
      value: exif.make || 'Не вказано в заголовках',
      status: exif.make ? 'authentic' : 'missing',
      statusText: exif.make ? 'Підтверджено' : 'Відсутній',
      note: 'Ідентифікатор фізичного бренду апаратури'
    },
    {
      group: 'Обладнання',
      param: 'Модель обладнання (Model)',
      value: exif.model || 'Не визначено',
      status: exif.model ? 'authentic' : 'missing',
      statusText: exif.model ? 'Підтверджено' : 'Відсутня',
      note: 'Конкретна модель сенсора/тушки'
    },
    {
      group: 'Програмне забезпечення',
      param: 'ПЗ редагування (Software)',
      value: exif.software || 'Відсутнє в заголовках',
      status: exif.isEditedInSoftware ? 'suspicious' : 'authentic',
      statusText: exif.isEditedInSoftware ? 'ВИЯВЛЕНО РЕДАКТОР' : 'Автентично',
      note: exif.isEditedInSoftware ? 'Зображення збережено через сторонній графічний пакет' : 'Ознак пост-обробки не виявлено'
    },
    {
      group: 'Хронологія',
      param: 'Первинна дата зйомки (DateTimeOriginal)',
      value: exif.dateTimeOriginal || 'Не зафіксовано',
      status: exif.dateTimeOriginal ? 'authentic' : 'missing',
      statusText: exif.dateTimeOriginal ? 'Зафіксовано' : 'Немає даних',
      note: 'Час фізичного відкриття затвора'
    },
    {
      group: 'Хронологія',
      param: 'Дата останньої модифікації (ModifyDate)',
      value: exif.modifyDate || 'Не вказано',
      status: exif.hasMetadataMismatch ? 'suspicious' : 'authentic',
      statusText: exif.hasMetadataMismatch ? 'РОЗБІЖНІСТЬ ЧАСУ' : 'Відповідає зйомці',
      note: exif.hasMetadataMismatch ? 'Різниця між створенням та модифікацією > 10 хв' : 'Синхронізовано'
    },
    {
      group: 'Експозиція',
      param: 'Діафрагма (F-Number)',
      value: exif.fNumber ? `f/${exif.fNumber}` : 'Відсутнє',
      status: exif.fNumber ? 'authentic' : 'missing',
      statusText: exif.fNumber ? 'Автентично' : 'Немає даних',
      note: 'Оптичне розкриття лінзи'
    },
    {
      group: 'Експозиція',
      param: 'Витримка (Exposure Time)',
      value: exif.exposureTime || 'Відсутнє',
      status: exif.exposureTime ? 'authentic' : 'missing',
      statusText: exif.exposureTime ? 'Автентично' : 'Немає даних',
      note: 'Тривалість експонування матриці'
    },
    {
      group: 'Експозиція',
      param: 'Світлочутливість (ISO)',
      value: exif.iso ? String(exif.iso) : 'Відсутнє',
      status: exif.iso ? 'authentic' : 'missing',
      statusText: exif.iso ? 'Автентично' : 'Немає даних',
      note: 'Підсилення сенсора'
    },
    {
      group: 'Оптика',
      param: 'Фокусна відстань (Focal Length)',
      value: exif.focalLength ? `${exif.focalLength} мм` : 'Невідомо',
      status: exif.focalLength ? 'authentic' : 'missing',
      statusText: exif.focalLength ? 'Автентично' : 'Немає даних',
      note: 'Оптична фокусна відстань об\'єктива'
    },
    {
      group: 'Геолокація',
      param: 'GPS Координати',
      value: (exif.latitude && exif.longitude)
        ? `${exif.latitude.toFixed(5)}, ${exif.longitude.toFixed(5)}`
        : 'Відсутні в заголовках (видалено або відключено)',
      status: (exif.latitude && exif.longitude) ? 'authentic' : 'neutral',
      statusText: (exif.latitude && exif.longitude) ? 'Присутні' : 'Немає GPS',
      note: 'Дані супутникового позиціонування'
    },
    {
      group: 'Колірний простір',
      param: 'Колірний профіль (Color Space)',
      value: exif.colorSpace || 'sRGB (за замовчуванням)',
      status: 'authentic',
      statusText: 'Норма',
      note: 'Калібрування спектра відображення'
    }
  ];

  const filteredRows = rows.filter(r => 
    r.param.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(r.value).toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Пошук та інформаційна плашка */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Пошук у метаданих..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          Всього зчитано тегів EXIF/TIFF: <strong className="text-slate-800 dark:text-slate-200">{exif.rawTagsCount}</strong>
        </div>
      </div>

      {/* Попередження якщо виявлено графічний редактор */}
      {exif.isEditedInSoftware && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start space-x-3 text-rose-800 dark:text-rose-300 text-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Криміналістичне попередження: </span>
            У службових заголовках фото знайдено згадку стороннього редактора (<code className="font-mono bg-rose-100 dark:bg-rose-900 px-1 py-0.5 rounded">{exif.software}</code>). 
            Це є прямим свідченням того, що зображення повторно експортувалось або монтувалось на комп'ютері.
          </div>
        </div>
      )}

      {/* Таблиця */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Категорія</th>
                <th className="py-3 px-4">Параметр метаданих</th>
                <th className="py-3 px-4">Значення в тегах</th>
                <th className="py-3 px-4 text-center">Статус відповідності</th>
                <th className="py-3 px-4 hidden md:table-cell">Коментар експертизи</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-400">{row.group}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{row.param}</td>
                  <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300">{row.value}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      row.status === 'suspicious'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : row.status === 'authentic'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {row.statusText}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 hidden md:table-cell">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
