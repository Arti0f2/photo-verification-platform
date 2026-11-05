import React from 'react';
import { VerificationDropzoneWidget } from '../upload/VerificationDropzoneWidget';
import { VerificationResult, HistoryRecord } from '../../types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  Eye, 
  Lock,
  ArrowRight
} from 'lucide-react';

interface DashboardOverviewProps {
  onVerificationComplete: (result: VerificationResult) => void;
  mockFailure: boolean;
  history: HistoryRecord[];
  onGoToAnalysis: () => void;
  hasCurrentResult: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onVerificationComplete,
  mockFailure,
  history,
  onGoToAnalysis,
  hasCurrentResult,
}) => {
  // Розрахунок статистики
  const totalVerified = history.length;
  const fakesCount = history.filter(h => h.riskLevel === 'fake').length;
  const authenticCount = history.filter(h => h.riskLevel === 'authentic').length;

  const fakePercent = totalVerified > 0 ? Math.round((fakesCount / totalVerified) * 100) : 0;
  const authenticPercent = totalVerified > 0 ? Math.round((authenticCount / totalVerified) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Привітальне інтро */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-brand-900 via-slate-900 to-slate-900 text-white shadow-xl border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold border border-brand-500/30">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Digital Forensics • Web Platform</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Детекція маніпуляцій та AI-генерацій на фото
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Клієнтська вебсистема для виявлення слідів монтажу, рекомпресії шарів (Error Level Analysis) 
            та синтетичних дифузійних моделей у зображеннях.
          </p>
        </div>

        {hasCurrentResult && (
          <button
            type="button"
            onClick={onGoToAnalysis}
            className="flex-shrink-0 px-5 py-3 rounded-xl font-bold bg-brand-500 hover:bg-brand-400 text-white shadow-lg shadow-brand-500/30 flex items-center space-x-2 transition-all"
          >
            <span>Відкрити останній результат</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Метрики / Статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Всього верифіковано</span>
            <Cpu className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalVerified} <span className="text-sm font-normal text-slate-400">фото</span>
          </div>
          <div className="text-[11px] text-slate-500">У поточному локальному сеансі</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Виявлено маніпуляцій</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
            {fakesCount} <span className="text-sm font-normal text-slate-400">({fakePercent}%)</span>
          </div>
          <div className="text-[11px] text-slate-500">Photoshop, склеювання, AI-генерації</div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Автентичні оригінали</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {authenticCount} <span className="text-sm font-normal text-slate-400">({authenticPercent}%)</span>
          </div>
          <div className="text-[11px] text-slate-500">Підтверджені матриці камер</div>
        </div>
      </div>

      {/* Зона завантаження та аналізу (Dropzone Widget) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Робоча зона завантаження фотографії
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Автоматичний запуск клієнтської валідації
          </span>
        </div>

        <VerificationDropzoneWidget
          onVerificationComplete={onVerificationComplete}
          mockFailure={mockFailure}
        />
      </div>

      {/* Переваги та технологічні особливості */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Безпека та приватність</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            EXIF-метадані та ELA-карти обробляються прямо у браузері через HTML5 Canvas та exifr. Ваші файли не залишають локальний пристрій.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Eye className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Криміналістичний аналіз ELA</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Повторне квантування JPEG з вимірюванням похибки підсвічує відмінності між оригінальним фоном та модифікованими фрагментами.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Сертифікований PDF-звіт</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Формування офіційного висновку з цифровим хешем, порівняльною таблицею та штампом верифікації за один клік.
          </p>
        </div>
      </div>
    </div>
  );
};
