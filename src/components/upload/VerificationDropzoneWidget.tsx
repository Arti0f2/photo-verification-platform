import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  UploadCloud, 
  FileCheck, 
  AlertTriangle, 
  RefreshCw, 
  Trash2, 
  Play, 
  Sliders, 
  Sparkles, 
  Camera, 
  CheckCircle2, 
  Image as ImageIcon,
  Zap,
  Info
} from 'lucide-react';
import { DropzoneState, AnalysisConfig, VerificationResult, DemoPreset } from '../../types';
import { MockBackendService } from '../../services/mockBackendService';
import { ExifService } from '../../services/exifService';
import { DEMO_PRESETS } from '../../services/demoPresets';
import confetti from 'canvas-confetti';

interface VerificationDropzoneWidgetProps {
  onVerificationComplete: (result: VerificationResult) => void;
  mockFailure: boolean;
}

export const VerificationDropzoneWidget: React.FC<VerificationDropzoneWidgetProps> = ({
  onVerificationComplete,
  mockFailure,
}) => {
  // Поточний стан згідно з діаграмою станів
  const [state, setState] = useState<DropzoneState>('Idle');

  // Дані завантаженого файлу
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Швидке попереднє зчитування EXIF у стані ReadyToAnalyze
  const [quickExifSummary, setQuickExifSummary] = useState<string | null>(null);

  // Прогрес аналізу
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressStageText, setProgressStageText] = useState<string>('Ініціалізація...');

  // Конфігурація модулів аналізу
  const [analysisConfig, setAnalysisConfig] = useState<AnalysisConfig>({
    checkExif: true,
    checkEla: true,
    checkAi: true,
    checkNoise: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Валідація файлу (перехідний стан Validating -> ValidationError або ReadyToAnalyze)
  const validateAndProcessFile = useCallback(async (file: File) => {
    setState('Validating');
    setErrorMessage(null);

    // 1. Перевірка типу файлу
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const isExtensionValid = /\.(jpe?g|png|webp)$/i.test(file.name);
    const isMimeValid = allowedTypes.includes(file.type);

    if (!isMimeValid && !isExtensionValid) {
      setState('ValidationError');
      setErrorMessage(`Непідтримуваний формат файлу (${file.type || 'невідомий'}). Дозволені лише JPEG, PNG та WebP.`);
      return;
    }

    // 2. Перевірка розміру (максимум 15 МБ)
    const maxSizeBytes = 15 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setState('ValidationError');
      setErrorMessage(`Розмір файлу (${(file.size / (1024 * 1024)).toFixed(1)} МБ) перевищує допустимий ліміт 15 МБ.`);
      return;
    }

    // 3. Успішна валідація -> генерація прев'ю та парсинг EXIF
    try {
      const dataUrl = await readFileAsDataURL(file);
      setSelectedFile(file);
      setPreviewUrl(dataUrl);

      // Первинне браузерне зчитування метаданих
      const quickExif = await ExifService.parseMetadata(file);
      if (quickExif.make && quickExif.model) {
        setQuickExifSummary(`Камера: ${quickExif.make} ${quickExif.model}`);
      } else if (quickExif.software) {
        setQuickExifSummary(`Знайдено тег: ${quickExif.software}`);
      } else {
        setQuickExifSummary('EXIF: метадані камери відсутні');
      }

      setState('ReadyToAnalyze');
    } catch {
      setState('ValidationError');
      setErrorMessage('Помилка читання файлу на клієнті. Спробуйте інше зображення.');
    }
  }, []);

  // Обробка вставки з буфера обміну (Ctrl + V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (state === 'Analyzing') return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            validateAndProcessFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [state, validateAndProcessFile]);

  // Дії Drag-and-Drop
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (state === 'Idle' || state === 'ReadyToAnalyze' || state === 'ValidationError') {
      setState('DragOver');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (state === 'DragOver') {
      setState(selectedFile ? 'ReadyToAnalyze' : 'Idle');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    } else {
      setState('Idle');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  // Запуск верифікації (ReadyToAnalyze -> Analyzing)
  const startVerification = async () => {
    if (!selectedFile || !previewUrl) return;

    setState('Analyzing');
    setProgressPercent(5);
    setProgressStageText('Ініціалізація інференсу...');

    // Синхронізуємо симуляцію збою
    MockBackendService.simulateNetworkFailure = mockFailure;

    try {
      const result = await MockBackendService.verifyPhoto(
        selectedFile,
        previewUrl,
        analysisConfig,
        (stageText, pct) => {
          setProgressStageText(stageText);
          setProgressPercent(pct);
        }
      );

      setState('Completed');

      // Ефект конфетті для оригінального фото
      if (result.verdict.riskLevel === 'authentic') {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      onVerificationComplete(result);
    } catch (err: any) {
      setState('ProcessingError');
      setErrorMessage(err.message || 'Сталася помилка під час обробки фотографії сервером аналізу.');
    }
  };

  // Скидання віджета до стану Idle
  const resetToIdle = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMessage(null);
    setQuickExifSummary(null);
    setProgressPercent(0);
    setState('Idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Завантаження демо-пресету
  const loadPreset = async (preset: DemoPreset) => {
    setState('Validating');
    try {
      // Конвертуємо SVG DataURL у File об'єкт
      const res = await fetch(preset.imageUrl);
      const blob = await res.blob();
      const file = new File([blob], `${preset.id}.jpg`, { type: 'image/jpeg' });
      await validateAndProcessFile(file);
    } catch (e) {
      console.error('Помилка завантаження пресету:', e);
      setState('Idle');
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Прихований стандартний input для вибору файлів */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Головна інтерактивна зона Dropzone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-full rounded-2xl border-2 transition-all duration-300 p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[340px] ${
          state === 'DragOver'
            ? 'border-brand-500 bg-brand-50/80 dark:bg-brand-950/40 scale-[1.01] shadow-xl shadow-brand-500/10'
            : state === 'ValidationError'
            ? 'border-rose-400 dark:border-rose-700 bg-rose-50/60 dark:bg-rose-950/30'
            : state === 'ReadyToAnalyze' || state === 'Completed'
            ? 'border-emerald-400 dark:border-emerald-700 bg-emerald-50/40 dark:bg-emerald-950/20'
            : state === 'ProcessingError'
            ? 'border-amber-400 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20'
            : 'border-dashed border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 hover:border-brand-400 dark:hover:border-brand-600 shadow-sm'
        }`}
      >
        {/* 1. Стан IDLE або DRAG_OVER */}
        {(state === 'Idle' || state === 'DragOver') && (
          <div className="space-y-4 max-w-lg">
            <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center transition-all ${
              state === 'DragOver'
                ? 'bg-brand-600 text-white scale-110 rotate-3 shadow-lg shadow-brand-500/30'
                : 'bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400'
            }`}>
              <UploadCloud className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {state === 'DragOver' ? 'Відпустіть файл для початку валідації' : 'Перетягніть фотографію сюди'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                або{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 underline focus:outline-none"
                >
                  оберіть файл із комп'ютера
                </button>
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800">JPEG, PNG, WebP</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800">До 15 МБ</span>
              <span className="px-2.5 py-1 rounded-md bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                Вставка Ctrl + V
              </span>
            </div>
          </div>
        )}

        {/* 2. Стан VALIDATING */}
        {state === 'Validating' && (
          <div className="space-y-4 text-center py-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-600 animate-spin">
              <RefreshCw className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-900 dark:text-white">Клієнтська валідація файлу...</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">Перевірка MIME-типу, бінарних сигнатур та розміру</p>
            </div>
          </div>
        )}

        {/* 3. Стан VALIDATION_ERROR */}
        {state === 'ValidationError' && (
          <div className="space-y-4 max-w-md text-center py-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-rose-700 dark:text-rose-300">Помилка валідації файлу</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={resetToIdle}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-colors"
              >
                Скинути та спробувати інший файл
              </button>
            </div>
          </div>
        )}

        {/* 4. Стан READY_TO_ANALYZE або COMPLETED */}
        {(state === 'ReadyToAnalyze' || state === 'Completed') && previewUrl && (
          <div className="w-full max-w-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm">
              {/* Прев'ю зображення */}
              <div className="relative w-36 h-36 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 shadow-md">
                <img
                  src={previewUrl}
                  alt="Прев'ю об'єкта"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white font-mono">
                  {(selectedFile?.size ? selectedFile.size / (1024 * 1024) : 0).toFixed(2)} МБ
                </div>
              </div>

              {/* Інформація про файл */}
              <div className="flex-1 text-left space-y-2">
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[280px]">
                    {selectedFile?.name}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono">
                    {selectedFile?.type || 'image/jpeg'}
                  </span>
                  {quickExifSummary && (
                    <span className="px-2.5 py-1 rounded-md bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                      {quickExifSummary}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Зображення валідовано та готове до комплексного спектрального аналізу.
                </p>
              </div>

              {/* Кнопка видалення */}
              <button
                type="button"
                onClick={resetToIdle}
                className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Видалити файл та повернутися до вибору"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Налаштування модулів верифікації (Чекбокси) */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Модулі криміналістичного аналізу:
                </span>
                <span className="text-xs text-brand-600 dark:text-brand-400 flex items-center">
                  <Sliders className="w-3.5 h-3.5 mr-1" /> Конфігурація
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-brand-400">
                  <input
                    type="checkbox"
                    checked={analysisConfig.checkExif}
                    onChange={(e) => setAnalysisConfig({ ...analysisConfig, checkExif: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">EXIF & Метадані</div>
                    <div className="text-[11px] text-slate-500">Камера, теги графічних редакторів</div>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-brand-400">
                  <input
                    type="checkbox"
                    checked={analysisConfig.checkEla}
                    onChange={(e) => setAnalysisConfig({ ...analysisConfig, checkEla: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">Error Level Analysis (ELA)</div>
                    <div className="text-[11px] text-slate-500">Карта похибок квантування шарів</div>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-brand-400">
                  <input
                    type="checkbox"
                    checked={analysisConfig.checkAi}
                    onChange={(e) => setAnalysisConfig({ ...analysisConfig, checkAi: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">AI-Детектор генерацій</div>
                    <div className="text-[11px] text-slate-500">Синтетичні текстури Midjourney/FLUX</div>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-brand-400">
                  <input
                    type="checkbox"
                    checked={analysisConfig.checkNoise}
                    onChange={(e) => setAnalysisConfig({ ...analysisConfig, checkNoise: e.target.checked })}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">Спектральний шум PRNU</div>
                    <div className="text-[11px] text-slate-500">Однорідність шуму матриці камери</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Кнопка запуску */}
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={startVerification}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 shadow-lg shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Запустити верифікацію</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. Стан ANALYZING */}
        {state === 'Analyzing' && (
          <div className="w-full max-w-lg space-y-6 py-6 text-center">
            {/* Мініатюра зі скануючим лазерним променем */}
            {previewUrl && (
              <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-brand-500">
                <img
                  src={previewUrl}
                  alt="Аналіз"
                  className="w-full h-full object-cover filter brightness-90 contrast-110"
                />
                {/* Анімований лазерний промінь */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_15px_#38bdf8] animate-scan" />
                <div className="absolute inset-0 bg-brand-500/10 backdrop-brightness-105 pointer-events-none" />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center">
                  <Sparkles className="w-4 h-4 text-brand-500 mr-1.5 animate-spin" />
                  {progressStageText}
                </span>
                <span className="font-mono text-brand-600 dark:text-brand-400">{progressPercent}%</span>
              </div>

              {/* Прогрес-бар */}
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-sky-400 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Всі елементи керування заблоковано для забезпечення цілісності обчислень.
            </p>
          </div>
        )}

        {/* 6. Стан PROCESSING_ERROR */}
        {state === 'ProcessingError' && (
          <div className="space-y-4 max-w-md text-center py-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-amber-800 dark:text-amber-300">Збій під час обробки</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={startVerification}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 flex items-center justify-center space-x-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Повторити спробу (Retry)</span>
              </button>

              <button
                type="button"
                onClick={resetToIdle}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Скасувати операцію
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Швидкі демо-пресети для перевірки викладачем */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Демонстраційні зразки для швидкого тестування
            </h4>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            Клацніть для миттєвого завантаження без пошуку файлів
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DEMO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              disabled={state === 'Analyzing'}
              onClick={() => loadPreset(preset)}
              className="p-3.5 rounded-xl text-left border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-600 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all group flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-brand-600">
                    {preset.name}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    preset.tag === 'camera'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : preset.tag === 'photoshop'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                  }`}>
                    {preset.tag === 'camera' ? 'Оригінал' : preset.tag === 'photoshop' ? 'Photoshop' : 'AI-генерація'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {preset.description}
                </p>
              </div>

              <div className="text-[11px] font-medium text-brand-600 dark:text-brand-400 flex items-center pt-1 border-t border-slate-200 dark:border-slate-700/60">
                <span>Завантажити зразок →</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Допоміжна функція читання файлу
function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
