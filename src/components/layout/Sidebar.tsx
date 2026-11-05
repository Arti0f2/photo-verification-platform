import React from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  SlidersHorizontal, 
  FileText, 
  History, 
  Info,
  CheckCircle2
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'upload' | 'analysis' | 'report' | 'history' | 'about';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  hasResult: boolean;
  historyCount: number;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  hasResult,
  historyCount,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Головна панель', icon: LayoutDashboard, badge: null },
    { id: 'upload', label: 'Верифікація фото', icon: UploadCloud, badge: null },
    { id: 'analysis', label: 'Робоча зона ELA', icon: SlidersHorizontal, badge: hasResult ? 'Готово' : null, disabled: !hasResult },
    { id: 'report', label: 'Звіт та EXIF', icon: FileText, badge: hasResult ? 'PDF' : null, disabled: !hasResult },
    { id: 'history', label: 'Історія перевірок', icon: History, badge: historyCount > 0 ? String(historyCount) : null },
    { id: 'about', label: 'Про систему', icon: Info, badge: null },
  ];

  const handleSelect = (tabId: string) => {
    setActiveTab(tabId as ActiveTab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Мобільний оверлей */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Сайдбар контейнер */}
      <aside
        className={`fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-slate-50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between p-4 overflow-y-auto`}
      >
        <div className="space-y-6">
          <div>
            <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Навігація системи
            </div>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isDisabled = item.disabled;

                return (
                  <button
                    key={item.id}
                    disabled={isDisabled}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                        : isDisabled
                        ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Статус поточної сесії */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 shadow-sm text-xs space-y-2">
            <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
              <span>Стан інференсу:</span>
              <span className="flex items-center text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Онлайн
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              Клієнтський аналізатор активний. Метадані EXIF обробляються локально без відправки на сторонні ресурси.
            </p>
          </div>
        </div>

        {/* Інформація про систему */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
          <div className="font-semibold text-slate-700 dark:text-slate-300">Photo Verifier Platform</div>
          <div>Digital Forensics & AI Detection</div>
          <div className="text-slate-400">Версія: 1.0.0</div>
        </div>
      </aside>
    </>
  );
};
