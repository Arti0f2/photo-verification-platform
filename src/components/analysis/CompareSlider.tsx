import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Eye, Layers, ZoomIn, Maximize2 } from 'lucide-react';

interface CompareSliderProps {
  originalUrl: string;
  analyzedUrl: string;
  analyzedLabel: string;
}

export const CompareSlider: React.FC<CompareSliderProps> = ({
  originalUrl,
  analyzedUrl,
  analyzedLabel,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // Відсоток від 0 до 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isMagnifierActive, setIsMagnifierActive] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const percent = (clampedX / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  return (
    <div className="space-y-3">
      {/* Панель керування слайдером */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-brand-500" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Інтерактивне накладання шарів:
          </span>
          <span>Перетягуйте повзунок для виявлення зон монтажу</span>
        </div>

        <button
          type="button"
          onClick={() => setIsMagnifierActive(!isMagnifierActive)}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
            isMagnifierActive
              ? 'bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border-brand-300 dark:border-brand-800'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
          }`}
        >
          <ZoomIn className="w-3.5 h-3.5" />
          <span>{isMagnifierActive ? 'Лупа 2.5x: УВІМК' : 'Лупа пікселів'}</span>
        </button>
      </div>

      {/* Головний контейнер порівняння */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[420px] sm:h-[500px] rounded-2xl overflow-hidden shadow-xl select-none bg-slate-950 cursor-ew-resize border border-slate-200 dark:border-slate-800"
      >
        {/* Нижній шар: Карта аналізу (ELA / Heatmap) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={analyzedUrl}
            alt="Теплова карта"
            className="w-full h-full object-contain bg-slate-950"
            draggable={false}
          />
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold text-sky-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span>{analyzedLabel}</span>
          </div>
        </div>

        {/* Верхній шар: Оригінальне зображення (обрізане за кліп-маскою) */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <div
            className="w-full h-full"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
          >
            <img
              src={originalUrl}
              alt="Оригінал"
              className="w-full h-full object-contain bg-slate-950"
              draggable={false}
            />
          </div>
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Оригінальне фото</span>
          </div>
        </div>

        {/* Лінія розділення та ручка повзунка */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)] cursor-ew-resize z-20"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white dark:bg-slate-900 border-2 border-brand-500 shadow-xl flex items-center justify-center text-brand-600 dark:text-brand-400 transition-transform hover:scale-110 active:scale-95">
            <span className="text-xs font-bold tracking-tighter">◀▶</span>
          </div>
        </div>

        {/* Лупа (Magnifier) при активному режимі */}
        {isMagnifierActive && containerRef.current && (
          <div
            className="absolute pointer-events-none rounded-full border-2 border-brand-400 shadow-2xl overflow-hidden z-30"
            style={{
              width: '160px',
              height: '160px',
              left: `${mousePos.x - 80}px`,
              top: `${mousePos.y - 80}px`,
              backgroundColor: '#000000',
            }}
          >
            <div
              className="absolute"
              style={{
                width: `${containerRef.current.clientWidth * 2.5}px`,
                height: `${containerRef.current.clientHeight * 2.5}px`,
                transform: `translate(${-mousePos.x * 2.5 + 80}px, ${-mousePos.y * 2.5 + 80}px)`,
              }}
            >
              <img
                src={mousePos.x < (containerRef.current.clientWidth * sliderPosition) / 100 ? originalUrl : analyzedUrl}
                alt="Збільшення"
                className="w-full h-full object-contain"
              />
            </div>
            {/* Приціл лупи */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-0.5 bg-brand-400/80" />
              <div className="h-4 w-0.5 bg-brand-400/80 -ml-2" />
            </div>
          </div>
        )}
      </div>

      {/* Підказка щодо кольорів ELA */}
      <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-600 dark:text-slate-300">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-800 dark:text-slate-200">Інтерпретація кольорів ELA:</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-sm bg-blue-900 mr-1.5" /> Темний/Синій = Незмінені області
          </span>
          <span className="flex items-center">
            <span className="w-3 h-3 rounded-sm bg-cyan-400 mr-1.5" /> Бірюзовий = Природний шум стиснення
          </span>
          <span className="flex items-center font-bold text-rose-600 dark:text-rose-400">
            <span className="w-3 h-3 rounded-sm bg-rose-500 mr-1.5" /> Яскравий/Червоний = Модифікований шар!
          </span>
        </div>
      </div>
    </div>
  );
};
