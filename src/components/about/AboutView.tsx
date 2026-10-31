import React from 'react';
import { Award, BookOpen, CheckCircle, Code, Shield, Cpu, HelpCircle, ExternalLink } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Заголовок */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>Індивідуальний STEM-проєкт</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          ОК «Розробник фронтенду програмних систем»
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Проєкт розроблено як фронтенд-складову курсової роботи бакалавра на кафедрі Програмних систем і технологій 
          Факультету комп'ютерних наук та кібернетики Київського національного університету імені Тараса Шевченка.
        </p>

        <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
          <div><span className="font-semibold text-slate-700 dark:text-slate-300">Лектор курсу:</span> Ірина Юрчук</div>
          <div><span className="font-semibold text-slate-700 dark:text-slate-300">Максимальна оцінка:</span> 50 балів</div>
          <div><span className="font-semibold text-slate-700 dark:text-slate-300">Предметна область:</span> Комп'ютерний зір, ELA, AI Forensic</div>
        </div>
      </div>

      {/* Критерії оцінювання за методичкою */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-brand-500" />
          <span>Критерії оцінювання STEM-проєкту (згідно з РНПД)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">1. Програмна якість</span>
              <span className="text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded">
                12 – 20 б.
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Функціональна коректність, архітектура Service Layer, рівень проведеного тестування (Vitest) та якість коду TypeScript.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">2. Захист та демонстрація</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                9 – 15 б.
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Відповіді на питання комісії, демонстрація роботи інтерфейсу на десктопних і мобільних пристроях.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">3. Пояснювальна записка</span>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded">
                9 – 15 б.
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Супровідна технічна документація: User Flow, State Diagram, опис технологій, User Guide з Wireframes, висновки.
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
            <div className="font-bold text-brand-600">React 18 + Vite</div>
            <div className="text-slate-400">Швидка збірка та реактивність</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200">
            <div className="font-bold text-brand-600">TypeScript</div>
            <div className="text-slate-400">Сувора статична типізація</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200">
            <div className="font-bold text-brand-600">Tailwind CSS</div>
            <div className="text-slate-400">Mobile-First адаптивність</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200">
            <div className="font-bold text-brand-600">HTML5 Canvas ELA</div>
            <div className="text-slate-400">Клієнтський аналіз стиснення</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200">
            <div className="font-bold text-brand-600">exifr Parser</div>
            <div className="text-slate-400">Парсинг EXIF, TIFF, GPS</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200">
            <div className="font-bold text-brand-600">jsPDF Suite</div>
            <div className="text-slate-400">Експорт офіційних звітів</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200">
            <div className="font-bold text-brand-600">Vitest + RTL</div>
            <div className="text-slate-400">Автоматизовані тести</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200">
            <div className="font-bold text-brand-600">Service Layer</div>
            <div className="text-slate-400">Mock API + Real Engine</div>
          </div>
        </div>
      </div>
    </div>
  );
};
