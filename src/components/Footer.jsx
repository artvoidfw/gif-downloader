import React from 'react';
import { LANGUAGES } from '../translations/languages';
import { ExternalLink, Zap } from 'lucide-react';

function GithubIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function Footer({ currentLang, setCurrentLang, t, openSettings }) {
  const popularLangs = ['az', 'en', 'tr', 'es', 'ru', 'ko', 'ja', 'ar', 'de', 'fr', 'zh'];
  const formatLangCode = (code) => code ? code.charAt(0).toUpperCase() + code.slice(1).toLowerCase() : '';

  return (
    <footer className="mt-20 border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-extrabold text-sm">
                G
              </div>
              <span className="font-extrabold text-lg tracking-tight text-zinc-900 dark:text-white">
                {t.brand}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              GIF Endirmə və Videodan GIF Yaratma Platforması. Sıfır keyfiyyət itkisi, sürətli və minimalist.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Zero-Loss • 100% Client-Side Engine</span>
            </div>
          </div>

          {/* Column 2: Creator & Social Links (Portfolio with Logo + GitHub) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Tərtibatçı
            </h4>
            <div className="flex flex-col gap-2">
              {/* Portfolio Link with Site Logo */}
              <a
                href="https://artvoid.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-900 hover:border-blue-500 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:border-blue-500 dark:hover:bg-zinc-800/80 transition-colors shadow-sm group"
              >
                <img
                  src="/artvoid-logo.jpg"
                  alt="Artvoid"
                  className="h-5 w-5 rounded-md object-cover border border-zinc-200 dark:border-zinc-700"
                />
                <span>Portfolio</span>
                <ExternalLink className="h-3 w-3 text-zinc-400 group-hover:text-blue-500 transition-colors ml-auto" />
              </a>

              {/* GitHub Link */}
              <a
                href="https://github.com/artvoidfw"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-900 hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:border-zinc-600 dark:hover:bg-zinc-800/80 transition-colors shadow-sm group"
              >
                <GithubIcon className="h-4 w-4 text-zinc-700 dark:text-zinc-200" />
                <span>GitHub</span>
                <ExternalLink className="h-3 w-3 text-zinc-400 group-hover:text-white transition-colors ml-auto" />
              </a>
            </div>
          </div>

          {/* Column 3: Core Features */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Funksiyalar
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <li>{t.nav_downloader}</li>
              <li>{t.nav_converter}</li>
              <li>{t.nav_search}</li>
              <li>{t.nav_extractor}</li>
            </ul>
          </div>

          {/* Column 4: Quick Language (Clean single codes: Az, En, Tr...) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                Dillər (18)
              </h4>
              <button
                onClick={openSettings}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Hamısı
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {popularLangs.map((code) => {
                const lang = LANGUAGES.find((l) => l.code === code);
                if (!lang) return null;
                const isSelected = currentLang === code;
                return (
                  <button
                    key={code}
                    onClick={() => setCurrentLang(code)}
                    className={`flex items-center justify-center rounded-lg border px-2.5 py-1 text-[11px] font-bold font-mono transition-colors ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span>{formatLangCode(code)}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Bar with Creator Credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-zinc-200 pt-6 text-xs text-zinc-400 dark:border-zinc-800">
          <div>
            © {new Date().getFullYear()} GIFSNAP. Hazırladı:{' '}
            <a
              href="https://artvoid.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-zinc-700 dark:text-zinc-200 hover:text-blue-500 underline transition-colors"
            >
              Artvoid
            </a>
          </div>
          <div className="mt-2 sm:mt-0 flex items-center gap-4">
            <a
              href="https://github.com/artvoidfw"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-blue-500 transition-colors"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              <span>github.com/artvoidfw</span>
            </a>
            <span>•</span>
            <a
              href="https://artvoid.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors"
            >
              artvoid.vercel.app
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
