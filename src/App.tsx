import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { VerificationDropzoneWidget } from './components/upload/VerificationDropzoneWidget';
import { AnalysisWorkspace } from './components/analysis/AnalysisWorkspace';
import { ReportView } from './components/report/ReportView';
import { HistoryList } from './components/history/HistoryList';
import { AboutView } from './components/about/AboutView';
import { VerificationResult, HistoryRecord } from './types';
import { PdfExportService } from './services/pdfExportService';

export const App: React.FC = () => {
  // Тема оформлення (Dark / Light)
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('photo_verifier_theme') === 'dark';
  });

  // Симуляція мережевого збою для тестування стану ProcessingError
  const [mockFailure, setMockFailure] = useState<boolean>(false);

  // Стан мобільного сайдбару
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Активна вкладка навігації
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Результат поточної верифікації
  const [currentResult, setCurrentResult] = useState<VerificationResult | null>(null);

  // Історія перевірок (LocalStorage)
  const [history, setHistory] = useState<HistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('photo_verifier_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Стан генерації PDF
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Синхронізація теми з класом тегу <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('photo_verifier_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('photo_verifier_theme', 'light');
    }
  }, [darkMode]);

  // Збереження історії в LocalStorage
  const saveToHistory = (result: VerificationResult) => {
    const record: HistoryRecord = {
      id: result.id,
      fileName: result.fileName,
      timestamp: result.timestamp,
      riskLevel: result.verdict.riskLevel,
      authenticityIndex: result.verdict.authenticityIndex,
      primaryVerdictText: result.verdict.primaryVerdictText,
      thumbnailUrl: result.originalDataUrl,
      fileSizeFormatted: `${(result.fileSize / (1024 * 1024)).toFixed(2)} МБ`,
    };

    setHistory((prev) => {
      // Обмежуємо останніми 20 записами
      const filtered = prev.filter((item) => item.id !== result.id);
      const updated = [record, ...filtered].slice(0, 20);
      try {
        localStorage.setItem('photo_verifier_history', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage ліміт перевищено:', e);
      }
      return updated;
    });
  };

  // Обробка завершення верифікації
  const handleVerificationComplete = (result: VerificationResult) => {
    setCurrentResult(result);
    saveToHistory(result);
    setActiveTab('analysis'); // Автоматичний перехід до робочої зони аналізу
  };

  // Експорт PDF-сертифіката
  const handleExportPdf = async () => {
    if (!currentResult) return;
    setIsExporting(true);
    try {
      await PdfExportService.exportCertificate(currentResult);
    } catch (err) {
      console.error('Помилка генерації PDF-звіту:', err);
      alert('Не вдалося згенерувати PDF-звіт. Спробуйте ще раз.');
    } finally {
      setIsExporting(false);
    }
  };

  // Очищення журналу історії
  const handleClearHistory = () => {
    if (window.confirm('Ви впевнені, що бажаєте очистити всю історію перевірок?')) {
      setHistory([]);
      localStorage.removeItem('photo_verifier_history');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* Верхня навігаційна панель */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        mockFailure={mockFailure}
        setMockFailure={setMockFailure}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        verifiedCount={history.length}
      />

      {/* Основний контейнер: Сайдбар + Робоча зона */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasResult={currentResult !== null}
          historyCount={history.length}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Робоча область з динамічним рендерингом вкладок */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              onVerificationComplete={handleVerificationComplete}
              mockFailure={mockFailure}
              history={history}
              onGoToAnalysis={() => setActiveTab('analysis')}
              hasCurrentResult={currentResult !== null}
            />
          )}

          {activeTab === 'upload' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Завантаження фото для експертизи
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Виберіть локальний файл, перетягніть у віджет або скористайтеся готовим зразком
                </p>
              </div>

              <VerificationDropzoneWidget
                onVerificationComplete={handleVerificationComplete}
                mockFailure={mockFailure}
              />
            </div>
          )}

          {activeTab === 'analysis' && currentResult && (
            <AnalysisWorkspace
              result={currentResult}
              onNewAnalysis={() => setActiveTab('upload')}
              onExportPdf={handleExportPdf}
              onViewReport={() => setActiveTab('report')}
              isExporting={isExporting}
            />
          )}

          {activeTab === 'report' && currentResult && (
            <ReportView
              result={currentResult}
              onExportPdf={handleExportPdf}
              isExporting={isExporting}
            />
          )}

          {activeTab === 'history' && (
            <HistoryList
              history={history}
              onSelectHistoryItem={(id) => {
                // Якщо обрано елемент історії, показуємо повідомлення або активуємо
                setActiveTab('dashboard');
              }}
              onClearHistory={handleClearHistory}
            />
          )}

          {activeTab === 'about' && <AboutView />}
        </main>
      </div>
    </div>
  );
};

export default App;
