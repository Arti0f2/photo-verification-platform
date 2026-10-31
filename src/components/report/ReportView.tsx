import React, { useState } from 'react';
import { VerificationResult } from '../../types';
import { ExifTable } from '../exif/ExifTable';
import { 
  FileDown, 
  FileCode, 
  Copy, 
  Check, 
  ShieldCheck, 
  Hash, 
  ExternalLink,
  Award
} from 'lucide-react';

interface ReportViewProps {
  result: VerificationResult;
  onExportPdf: () => void;
  isExporting: boolean;
}

export const ReportView: React.FC<ReportViewProps> = ({
  result,
  onExportPdf,
  isExporting,
}) => {
  const [copiedJson, setCopiedJson] = useState(false);
  const [activeTab, setActiveTab] = useState<'exif' | 'json'>('exif');

  const jsonString = JSON.stringify(result, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `верифікація_${result.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Шапка сертифіката */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs text-brand-300 font-semibold tracking-wider uppercase">
              <Award className="w-4 h-4 text-brand-400" />
              <span>Офіційний експертний висновок системи Photo Verifier</span>
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight">
              Сертифікат верифікації #{result.id}
            </h2>

            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Документ містить вичерпний криміналістичний аудит медіафайлу, зведений вердикт нейромереж 
              та протокол відповідності метаданих стандарту ISO/IEC 17025.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-slate-300">
              <span className="px-2.5 py-1 rounded bg-white/10 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-brand-400" /> {result.fileHash}
              </span>
              <span className="px-2.5 py-1 rounded bg-white/10">
                {result.timestamp}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onExportPdf}
              disabled={isExporting}
              className="px-5 py-3 rounded-xl font-bold bg-brand-500 hover:bg-brand-400 text-white shadow-lg shadow-brand-500/30 flex items-center justify-center space-x-2 transition-all"
            >
              <FileDown className="w-5 h-5" />
              <span>{isExporting ? 'Формування...' : 'Завантажити PDF-звіт'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="px-4 py-3 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white flex items-center justify-center space-x-2 transition-all border border-white/20"
            >
              <FileCode className="w-5 h-5 text-sky-300" />
              <span>Експорт JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Вкладки перемикання: EXIF або JSON */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setActiveTab('exif')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'exif'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            📋 Таблиця EXIF-метаданих
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('json')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'json'
                ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            💻 JSON-структура звіту
          </button>
        </div>

        {activeTab === 'json' && (
          <button
            type="button"
            onClick={handleCopyJson}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
          >
            {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedJson ? 'Скопійовано!' : 'Скопіювати'}</span>
          </button>
        )}
      </div>

      {/* Вміст обраної вкладки */}
      {activeTab === 'exif' ? (
        <ExifTable exif={result.exif} fileName={result.fileName} />
      ) : (
        <div className="relative rounded-2xl bg-slate-950 p-4 border border-slate-800 overflow-hidden shadow-inner">
          <pre className="text-xs font-mono text-emerald-400 overflow-x-auto max-h-[500px] leading-relaxed">
            {jsonString}
          </pre>
        </div>
      )}
    </div>
  );
};
