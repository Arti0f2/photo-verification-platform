import React from 'react';
import { HistoryRecord } from '../../types';
import { Trash2, ExternalLink, ShieldCheck, AlertTriangle, FileQuestion } from 'lucide-react';

interface HistoryListProps {
  history: HistoryRecord[];
  onSelectHistoryItem: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  if (history.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-slate-900 dark:text-white">Журнал перевірок порожній</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Після завершення аналізу зображень результати автоматично зберігатимуться у локальному сховищі браузера (LocalStorage).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Історія останніх експертиз ({history.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Дані зберігаються локально у вашому браузері
          </p>
        </div>

        <button
          type="button"
          onClick={onClearHistory}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Очистити журнал</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {history.map((item) => {
          const isFake = item.riskLevel === 'fake';
          const isSusp = item.riskLevel === 'suspicious';

          return (
            <div
              key={item.id}
              onClick={() => onSelectHistoryItem(item.id)}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 shadow-sm hover:shadow transition-all cursor-pointer flex items-center space-x-4 group"
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0">
                <img
                  src={item.thumbnailUrl}
                  alt={item.fileName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {item.fileName}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {item.timestamp}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isFake
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : isSusp
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                    {item.primaryVerdictText}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {item.authenticityIndex}% довіри
                  </span>
                </div>
              </div>

              <div className="text-slate-400 group-hover:text-brand-500 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
