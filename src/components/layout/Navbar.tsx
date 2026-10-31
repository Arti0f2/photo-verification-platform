import React from 'react';
import { ShieldCheck, Moon, Sun, Server, Bug, Menu, X, Award } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  mockFailure: boolean;
  setMockFailure: (val: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (val: boolean) => void;
  verifiedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  mockFailure,
  setMockFailure,
  mobileMenuOpen,
  setMobileMenuOpen,
  verifiedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Логотип та Назва */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Меню"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                  Photo Verifier
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-300 dark:border-brand-800">
                  STEM
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Верифікація автентичності зображень та AI-детекція | Кафедра ПСТ КНУ
              </p>
            </div>
          </div>

          {/* Права частина: Керування */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Лічильник перевірок */}
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <Award className="w-4 h-4 text-brand-500" />
              <span>Перевірено фото:</span>
              <span className="font-bold text-brand-600 dark:text-brand-400">{verifiedCount}</span>
            </div>

            {/* Перемикач симуляції збою мережі (для демонстрації стану ProcessingError) */}
            <button
              onClick={() => setMockFailure(!mockFailure)}
              title={mockFailure ? "Емуляція помилки сервера УВІМКНЕНА (натисніть щоб вимкнути)" : "Емулювати мережевий збій (тест Retry)"}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                mockFailure
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              {mockFailure ? <Bug className="w-3.5 h-3.5 text-rose-500" /> : <Server className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden sm:inline">{mockFailure ? 'Помилка API: ON' : 'Mock API: 200 OK'}</span>
            </button>

            {/* Перемикач темної/світлої теми */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
              title={darkMode ? "Перемкнути на світлу тему" : "Перемкнути на темну тему"}
              aria-label="Тема оформлення"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Профіль користувача / Гостьовий режим */}
            <div className="hidden sm:flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200">
                ГК
              </div>
              <div className="text-left text-xs">
                <div className="font-semibold text-slate-800 dark:text-slate-200">Гість (Студент)</div>
                <div className="text-slate-400">Гостьовий сеанс</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
