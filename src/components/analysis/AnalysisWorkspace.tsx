import React, { useState } from 'react';
import { 
  VerificationResult, 
  RiskLevel 
} from '../../types';
import { CompareSlider } from './CompareSlider';
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileDown, 
  Layers, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface AnalysisWorkspaceProps {
  result: VerificationResult;
  onNewAnalysis: () => void;
  onExportPdf: () => void;
  onViewReport: () => void;
  isExporting: boolean;
}

export const AnalysisWorkspace: React.FC<AnalysisWorkspaceProps> = ({
  result,
  onNewAnalysis,
  onExportPdf,
  onViewReport,
  isExporting,
}) => {
  // Вибір активного шару для порівняння
  const [activeLayer, setActiveLayer] = useState<'ela' | 'inverted' | 'noise'>('ela');

  const { verdict, ela, exif } = result;

  // Визначення кольорів вердикту
  const isFake = verdict.riskLevel === 'fake';
  const isSusp = verdict.riskLevel === 'suspicious';

  const riskBadgeClass = isFake
    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800'
    : isSusp
    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800'
    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';

  const gaugeStrokeColor = isFake ? '#ef4444' : isSusp ? '#f59e0b' : '#10b981';

  // Поточне зображення для правого боку слайдера
  const currentAnalyzedUrl =
    activeLayer === 'ela'
      ? ela.elaDataUrl
      : activeLayer === 'inverted'
      ? ela.invertedDataUrl
      : ela.noiseDataUrl;

  const currentLayerLabel =
    activeLayer === 'ela'
      ? 'ELA Теплова карта'
      : activeLayer === 'inverted'
      ? 'Інвертований контраст'
      : 'Спектральний шум PRNU';

  // Розрахунок довжини дуги для спідометра/шкали (SVG кругова діаграма)
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (verdict.authenticityIndex / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Шапка результатів */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400">ID: {result.id}</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {result.timestamp}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Експертиза: {result.fileName}</span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${riskBadgeClass}`}>
              {isFake ? 'ФЕЙК / МОНТАЖ' : isSusp ? 'ПІДОЗРІЛО' : 'АВТЕНТИЧНО'}
            </span>
          </h2>
        </div>

        {/* Кнопки дій */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onExportPdf}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 flex items-center space-x-2 transition-all disabled:opacity-60"
          >
            <FileDown className="w-4 h-4" />
            <span>{isExporting ? 'Генерація PDF...' : 'Завантажити PDF-звіт'}</span>
          </button>

          <button
            type="button"
            onClick={onViewReport}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            <span>Таблиця EXIF</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onNewAnalysis}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Перевірити нове зображення"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Головна сітка: Спідометр/Вердикт + Інтерактивний ELA слайдер */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ліва колонка: Кругова шкала та фактори аналізу */}
        <div className="space-y-6">
          {/* Картка оцінки достовірності */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Індекс автентичності медіа
            </h3>

            {/* Кругова шкала вердикту */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-slate-100 dark:text-slate-800"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={gaugeStrokeColor}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  fill="none"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {verdict.authenticityIndex}%
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {isFake ? 'Низька довіра' : isSusp ? 'Сумнівна якість' : 'Висока довіра'}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                {verdict.primaryVerdictText}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {verdict.detailedDescription}
              </p>
            </div>

            {/* Метрики ризику */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="text-slate-400 text-[11px]">Ймовірність AI</div>
                <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  {verdict.aiProbability}%
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="text-slate-400 text-[11px]">Монтаж шарів</div>
                <div className="text-sm font-bold text-rose-600 dark:text-rose-400">
                  {verdict.manipulationProbability}%
                </div>
              </div>
            </div>
          </div>

          {/* Список виявлених факторів */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Діагностичні ознаки
            </h4>

            <div className="space-y-2 text-xs">
              {verdict.suspiciousFactors.map((factor, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-rose-600 dark:text-rose-400">
                  <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">{factor}</span>
                </div>
              ))}

              {verdict.safeFactors.map((factor, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">{factor}</span>
                </div>
              ))}

              <div className="flex items-start space-x-2 text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-brand-500" />
                <span className="leading-tight">
                  Коефіцієнт квантування ELA: <strong className="text-slate-800 dark:text-slate-200">{ela.discrepancyFactor}x</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Права колонка: Інтерактивний ELA слайдер та перемикач шарів */}
        <div className="lg:col-span-2 space-y-4">
          {/* Перемикач шарів */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveLayer('ela')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeLayer === 'ela'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                🌈 ELA Теплова карта
              </button>

              <button
                type="button"
                onClick={() => setActiveLayer('inverted')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeLayer === 'inverted'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                🔳 Інвертований контраст
              </button>

              <button
                type="button"
                onClick={() => setActiveLayer('noise')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeLayer === 'noise'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                📡 Сенсорний шум PRNU
              </button>
            </div>

            <div className="text-xs text-slate-400 hidden sm:block pr-2">
              Шар: <strong className="text-brand-500">{currentLayerLabel}</strong>
            </div>
          </div>

          {/* Компонент CompareSlider */}
          <CompareSlider
            originalUrl={result.originalDataUrl}
            analyzedUrl={currentAnalyzedUrl}
            analyzedLabel={currentLayerLabel}
          />
        </div>
      </div>
    </div>
  );
};
