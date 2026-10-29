import React, { useState, useRef, useEffect } from 'react';
import { LANGUAGES } from '../translations/languages';
import { 
  Download, 
  Video, 
  Search, 
  Layers, 
  Settings, 
  Moon, 
  Sun, 
  Check, 
  ChevronDown
} from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  currentLang,
  setCurrentLang,
  t,
  isDark,
  toggleTheme,
  openSettings,
}) {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const dropdownRef = useRef(null);

  const selectedLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];
  const formatLangCode = (code) => code ? code.charAt(0).toUpperCase() + code.slice(1).toLowerCase() : '';

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLangs = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.native.toLowerCase().includes(langSearch.toLowerCase()) ||
      l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/95 transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        
        {/* Brand Logo - Solid pure styling, strictly NO gradient */}
        <div 
          onClick={() => setActiveTab('downloader')}
          className="flex cursor-pointer items-center gap-2.5 select-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-lg tracking-wider shadow-sm">
            G
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-zinc-900 dark:text-white">
                {t.brand}
              </span>
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                PRO
              </span>
            </div>
            <span className="hidden text-[10px] font-medium text-zinc-500 dark:text-zinc-400 sm:inline-block">
              GIF Platform • Fast & Minimalist
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
          <button
            onClick={() => setActiveTab('downloader')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'downloader'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Download className="h-4 w-4" />
            {t.nav_downloader}
          </button>

          <button
            onClick={() => setActiveTab('converter')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'converter'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Video className="h-4 w-4" />
            {t.nav_converter}
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'search'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Search className="h-4 w-4" />
            {t.nav_search}
          </button>

          <button
            onClick={() => setActiveTab('extractor')}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'extractor'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <Layers className="h-4 w-4" />
            {t.nav_extractor}
          </button>
        </nav>

        {/* Right Tools: Language Picker + Theme Toggle + Settings */}
        <div className="flex items-center gap-2">
          
          {/* Language Selector: ONLY show formatted clean code like "Az", "En", "Tr", etc. */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-bold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              title="Dili Dəyiş"
            >
              <span className="font-bold tracking-wide">{formatLangCode(selectedLangObj.code)}</span>
              <ChevronDown className={`h-3 w-3 text-zinc-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 z-50">
                <div className="mb-2 px-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">
                    {t.st_language}
                  </div>
                  <input
                    type="text"
                    value={langSearch}
                    onChange={(e) => setLangSearch(e.target.value)}
                    placeholder="Axtar..."
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    autoFocus
                  />
                </div>

                <div className="max-h-60 overflow-y-auto space-y-0.5">
                  {filteredLangs.map((lang) => {
                    const isSelected = lang.code === currentLang;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLang(lang.code);
                          setLangDropdownOpen(false);
                          setLangSearch('');
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold'
                            : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-6 items-center justify-center rounded bg-zinc-100 text-[10px] font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 font-mono">
                            {formatLangCode(lang.code)}
                          </span>
                          <div>
                            <div className="font-semibold leading-none">{lang.native}</div>
                            <div className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-zinc-400'}`}>
                              {lang.name}
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            title={isDark ? 'Aydın Rejim' : 'Qara Rejim'}
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-zinc-700" />}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={openSettings}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
              activeTab === 'settings'
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800'
            }`}
            title={t.nav_settings}
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>

      </div>

      {/* Mobile Tab Navigation */}
      <div className="flex lg:hidden overflow-x-auto border-t border-zinc-200 bg-zinc-50 px-3 py-1.5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex gap-1.5">
          <button
            onClick={() => setActiveTab('downloader')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1 text-xs font-semibold ${
              activeTab === 'downloader'
                ? 'bg-blue-600 text-white'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            {t.nav_downloader}
          </button>

          <button
            onClick={() => setActiveTab('converter')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1 text-xs font-semibold ${
              activeTab === 'converter'
                ? 'bg-blue-600 text-white'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <Video className="h-3.5 w-3.5" />
            {t.nav_converter}
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1 text-xs font-semibold ${
              activeTab === 'search'
                ? 'bg-blue-600 text-white'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <Search className="h-3.5 w-3.5" />
            {t.nav_search}
          </button>

          <button
            onClick={() => setActiveTab('extractor')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1 text-xs font-semibold ${
              activeTab === 'extractor'
                ? 'bg-blue-600 text-white'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            {t.nav_extractor}
          </button>
        </div>
      </div>
    </header>
  );
}
