import React from 'react';
import { 
  Shield, 
  Code, 
  Layers, 
  FileCheck, 
  Lock, 
  Sparkles,
  Search
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Заголовок та опис платформи */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Open-Source Forensic Web Platform</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Photo Verifier — Комплексний аналіз автентичності зображень
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Сучасний pet-проєкт вебдодатка для криміналістичного дослідження цифрових зображень на предмет фальсифікацій, 
          монтажу (splicing), локальних ретушей та синтезованих нейромережевих текстур (AI Generated Images). 
          Усі обчислення, побудова теплових карт стиснення та аналіз метаданих виконуються на 100% на стороні клієнта у вашому браузері.
        </p>

        <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
          <div><span className="font-semibold text-slate-700 dark:text-slate-300">Тип проєкту:</span> Незалежний Pet-проєкт (Open Source)</div>
          <div><span className="font-semibold text-slate-700 dark:text-slate-300">Архітектура:</span> Client-First Single Page App</div>
          <div><span className="font-semibold text-slate-700 dark:text-slate-300">Приватність:</span> Локальна обробка без відправки файлів</div>
        </div>
      </div>

      {/* Ключові можливості платформи */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-brand-500" />
          <span>Ключові можливості платформи</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center space-x-2 text-brand-600 dark:text-brand-400">
              <Layers className="w-4 h-4" />
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">1. Error Level Analysis (ELA)</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Побудова теплових карт похибок стиснення JPEG на базі HTML5 Canvas. Дозволяє виявити зони вклеювання сторонніх об'єктів та неоднорідне збереження шарів.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center space-x-2 text-sky-600 dark:text-sky-400">
              <Search className="w-4 h-4" />
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">2. Аудит метаданих EXIF</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Парсинг тегів EXIF, TIFF, GPS та інформації про пристрій зйомки. Зіставлення часових міток для виявлення збереження у графічних редакторах (Photoshop тощо).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
              <FileCheck className="w-4 h-4" />
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">3. Вердикт та PDF-звітність</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Комплексна оцінка ймовірності AI-генерації чи модифікації та генерація офіційного криміналістичного звіту у форматі PDF за 1 клік.
            </p>
          </div>
        </div>
      </div>

      {/* Технологічний стек */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Code className="w-5 h-5 text-sky-500" />
          <span>Реалізований технологічний стек</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200">
            <div className="font-bold text-brand-600 dark:text-brand-400">React + Vite</div>
            <div className="text-slate-400">Швидка збірка та реактивність</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200">
            <div className="font-bold text-brand-600 dark:text-brand-400">TypeScript</div>
            <div className="text-slate-400">Сувора статична типізація</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200">
            <div className="font-bold text-brand-600 dark:text-brand-400">Tailwind CSS</div>
            <div className="text-slate-400">Mobile-First адаптивність</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200">
            <div className="font-bold text-brand-600 dark:text-brand-400">HTML5 Canvas ELA</div>
            <div className="text-slate-400">Клієнтський аналіз стиснення</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200">
            <div className="font-bold text-brand-600 dark:text-brand-400">exifr Parser</div>
            <div className="text-slate-400">Парсинг EXIF, TIFF, GPS</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200">
            <div className="font-bold text-brand-600 dark:text-brand-400">jsPDF Suite</div>
            <div className="text-slate-400">Експорт PDF-висновків</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200">
            <div className="font-bold text-brand-600 dark:text-brand-400">Vitest + RTL</div>
            <div className="text-slate-400">Автоматизовані тести</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200">
            <div className="font-bold text-brand-600 dark:text-brand-400">Service Layer</div>
            <div className="text-slate-400">Модульна архітектура</div>
          </div>
        </div>
      </div>

      {/* Безпека та конфіденційність */}
      <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 flex items-start space-x-3.5">
        <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-slate-900 dark:text-white">Конфіденційність за замовчуванням (Zero-Data Exposure)</div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Усі медіафайли аналізуються виключно в оперативній пам'яті вашого браузера. Жоден піксель або рядок метаданих не завантажується на віддалені сервери чи сторонні аналітичні сервіси.
          </p>
        </div>
      </div>
    </div>
  );
};
