import React, { useState } from 'react';
import { LANGUAGES } from '../translations/languages';
import { 
  Settings, 
  Globe, 
  Moon, 
  Sun, 
  Sliders, 
  Trash2, 
  Check, 
  X, 
  ShieldCheck, 
  Download, 
  Sparkles,
  Layers
} from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  currentLang,
  setCurrentLang,
  t,
  themeMode,
  setThemeMode,
  defaultFps,
  setDefaultFps,
  defaultRes,
  setDefaultRes,
  autoDownload,
  setAutoDownload,
  safeSearch,
  setSafeSearch,
  onClearCache,
}) {
  const [langSearch, setLangSearch] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const filteredLangs = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.native.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        
        {/* Header - Solid, strictly NO gradient */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Settings className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white leading-tight">
                {t.st_title}
              </h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {t.st_desc}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Language Selection (18 World Languages) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                  {t.st_language} (18 Languages)
                </span>
              </div>
              <input
                type="text"
                placeholder="Search language..."
                value={langSearch}
                onChange={(e) => setLangSearch(e.target.value)}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
              {filteredLangs.map((lang) => {
                const isSelected = currentLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setCurrentLang(lang.code)}
                    className={`flex items-center justify-between rounded-xl border p-2.5 text-xs text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="flex h-5 w-6 items-center justify-center rounded bg-zinc-100 text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 font-mono shrink-0">
                        {lang.code.charAt(0).toUpperCase() + lang.code.slice(1).toLowerCase()}
                      </span>
                      <div className="truncate">
                        <div className="font-semibold leading-tight truncate">{lang.native}</div>
                        <div className="text-[10px] text-zinc-400">{lang.name}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

          {/* Theme Mode - High Contrast Solid Design (Strictly NO Gradients!) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                {t.st_theme} (Zero Gradients)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'dark', label: t.st_theme_dark, icon: Moon, desc: 'Pure Obsidian #09090b' },
                { id: 'light', label: t.st_theme_light, icon: Sun, desc: 'Clean White #ffffff' },
                { id: 'system', label: t.st_theme_system, icon: Sliders, desc: 'Automatic' },
              ].map((m) => {
                const IconComponent = m.icon;
                const isSelected = themeMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setThemeMode(m.id)}
                    className={`rounded-xl border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300 font-bold'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <IconComponent className="h-4 w-4" />
                      {isSelected && <Check className="h-3.5 w-3.5 text-blue-600" />}
                    </div>
                    <div className="text-xs font-bold">{m.label}</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">{m.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

          {/* Video to GIF Defaults */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              Video Conversion Preferences
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Default FPS */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  {t.st_default_fps}
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[10, 15, 20, 24].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setDefaultFps(f)}
                      className={`rounded-lg py-1.5 text-xs font-semibold border ${
                        defaultFps === f
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {f} FPS
                    </button>
                  ))}
                </div>
              </div>

              {/* Default Width */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  {t.st_default_res}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[320, 480, 640].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setDefaultRes(w)}
                      className={`rounded-lg py-1.5 text-xs font-semibold border ${
                        defaultRes === w
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {w}px
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Auto-download toggle */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  {t.st_auto_dl}
                </div>
                <div className="text-[11px] text-zinc-500">
                  {t.st_auto_dl_desc}
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoDownload}
                onChange={(e) => setAutoDownload(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {/* Safe Search filter */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  {t.st_safe_search}
                </div>
                <div className="text-[11px] text-zinc-500">
                  {t.st_safe_search_desc}
                </div>
              </div>
              <input
                type="checkbox"
                checked={safeSearch}
                onChange={(e) => setSafeSearch(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="h-px bg-zinc-200 dark:bg-zinc-800" />

          {/* Storage & Clear */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-zinc-500">
              Local preferences stored in browser storage
            </div>
            <button
              onClick={onClearCache}
              className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{t.st_clear_cache}</span>
            </button>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-zinc-200 bg-zinc-50 px-6 py-3.5 dark:border-zinc-800 dark:bg-zinc-900/80">
          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition-colors"
          >
            {savedNotice ? <Check className="h-4 w-4" /> : null}
            <span>{savedNotice ? 'Saved!' : t.st_save_btn}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

