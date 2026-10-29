import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import DownloaderSection from '../components/DownloaderSection';
import VideoToGifSection from '../components/VideoToGifSection';
import SearchSection from '../components/SearchSection';
import FrameExtractorSection from '../components/FrameExtractorSection';
import SeoFaqSection from '../components/SeoFaqSection';
import SettingsModal from '../components/SettingsModal';
import Footer from '../components/Footer';
import { TRANSLATIONS, LANGUAGES } from '../translations/languages';

export default function Home() {
  const [activeTab, setActiveTab] = useState('downloader');
  const [currentLang, setCurrentLang] = useState('az');
  const [themeMode, setThemeMode] = useState('dark');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Preference Defaults
  const [defaultFps, setDefaultFps] = useState(12);
  const [defaultRes, setDefaultRes] = useState(480);
  const [autoDownload, setAutoDownload] = useState(false);
  const [safeSearch, setSafeSearch] = useState(true);

  // Cross-tab payload passing
  const [preloadedVideoUrl, setPreloadedVideoUrl] = useState('');
  const [preloadedMediaBlob, setPreloadedMediaBlob] = useState(null);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('gifsnap_lang');
      if (savedLang && TRANSLATIONS[savedLang]) {
        setCurrentLang(savedLang);
      }
      const savedTheme = localStorage.getItem('gifsnap_theme');
      if (savedTheme) {
        setThemeMode(savedTheme);
      }
      const savedFps = localStorage.getItem('gifsnap_fps');
      if (savedFps) setDefaultFps(Number(savedFps));
      const savedRes = localStorage.getItem('gifsnap_res');
      if (savedRes) setDefaultRes(Number(savedRes));
      const savedAutoDl = localStorage.getItem('gifsnap_autodl');
      if (savedAutoDl !== null) setAutoDownload(savedAutoDl === 'true');
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  // Update localStorage and RTL direction when language changes
  useEffect(() => {
    try {
      localStorage.setItem('gifsnap_lang', currentLang);
    } catch {}

    const langObj = LANGUAGES.find((l) => l.code === currentLang);
    if (langObj && langObj.dir === 'rtl') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  // Apply Theme Mode to document
  useEffect(() => {
    try {
      localStorage.setItem('gifsnap_theme', themeMode);
    } catch {}

    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else if (themeMode === 'light') {
      root.classList.remove('dark');
    } else {
      // System default
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleClearCache = () => {
    try {
      localStorage.clear();
      alert(t.st_cache_cleared);
      window.location.reload();
    } catch {
      alert('Cleared!');
    }
  };

  const handleSwitchToConverter = (url) => {
    setPreloadedVideoUrl(url);
    setActiveTab('converter');
  };

  const handleOpenExtractor = (blob) => {
    setPreloadedMediaBlob(blob);
    setActiveTab('extractor');
  };

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const isDark = themeMode === 'dark';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors">
      <Head>
        <title>{currentLang === 'az' ? 'GIFSNAP • Pulsuz GIF Endirici & Videodan GIF Çevirici' : `${t.brand} • ${t.nav_downloader}`}</title>
        <meta
          name="description"
          content="Tenor, Giphy, Reddit, Imgur linklərindən GIF yükləyin və ya MP4 videolarınızı birbaşa brauzerdə GIF-ə çevirin. Pulsuz və qeydiyyatsız."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebApplication',
                  '@id': 'https://gifsnap.vercel.app/#webapp',
                  name: 'GIFSNAP',
                  url: 'https://gifsnap.vercel.app',
                  description:
                    'Pulsuz və sürətli GIF Endirici & Videodan GIF Düzəldən Sistem. Tenor, Giphy, Reddit, Imgur dəstəyi ilə saniyələr içində GIF yükləyin və ya yaradın.',
                  applicationCategory: 'MultimediaApplication',
                  operatingSystem: 'All',
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                  },
                  creator: {
                    '@type': 'Person',
                    name: 'Artvoid',
                    url: 'https://artvoid.vercel.app',
                    sameAs: 'https://github.com/artvoidfw',
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://gifsnap.vercel.app/#website',
                  url: 'https://gifsnap.vercel.app',
                  name: 'GIFSNAP',
                  description: 'Modern GIF Downloader and Video to GIF Studio',
                },
                {
                  '@type': 'FAQPage',
                  '@id': 'https://gifsnap.vercel.app/#faq',
                  mainEntity: [
                    {
                      '@type': 'Question',
                      name: 'Tenor və Giphy-dən GIF-ləri necə endirmək olar?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Tenor, Giphy, Reddit və ya Imgur linkini GIFSNAP daxiletmə sahəsinə yapışdırın və "Yüklə və Yoxla" düyməsinə basın. Sistem avtomatik olaraq orijinal GIF faylını təqdim edəcək.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'Videonu necə GIF-ə çevirmək olar?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'GIFSNAP "Videonu GIF-ə Çevir" bölməsinə keçin, MP4, WebM və ya MOV faylını seçin, kəsmə saniyələrini təyin edin və "İndi GIF Hazırla" düyməsinə basın.',
                      },
                    },
                    {
                      '@type': 'Question',
                      name: 'GIFSNAP xidməti pulsuzdurmu?',
                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Bəli, GIFSNAP 100% pulsuzdur, qeydiyyat tələb etmir və tam təhlükəsizdir.',
                      },
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </Head>

      {/* Main Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        t={t}
        isDark={isDark}
        toggleTheme={toggleTheme}
        openSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-8 sm:px-6 md:py-12">
        {activeTab === 'downloader' && (
          <DownloaderSection
            t={t}
            onSwitchToConverter={handleSwitchToConverter}
          />
        )}

        {activeTab === 'converter' && (
          <VideoToGifSection
            t={t}
            preloadedVideoUrl={preloadedVideoUrl}
            autoDownloadSetting={autoDownload}
            onOpenExtractor={handleOpenExtractor}
          />
        )}

        {activeTab === 'search' && (
          <SearchSection
            t={t}
            onSelectGifForDownloader={(url) => {
              setActiveTab('downloader');
            }}
          />
        )}

        {activeTab === 'extractor' && (
          <FrameExtractorSection
            t={t}
            preloadedMediaBlob={preloadedMediaBlob}
          />
        )}

        {activeTab === 'settings' && (
          <div className="mx-auto max-w-2xl py-6">
            <SettingsModal
              isOpen={true}
              onClose={() => setActiveTab('downloader')}
              currentLang={currentLang}
              setCurrentLang={setCurrentLang}
              t={t}
              themeMode={themeMode}
              setThemeMode={setThemeMode}
              defaultFps={defaultFps}
              setDefaultFps={setDefaultFps}
              defaultRes={defaultRes}
              setDefaultRes={setDefaultRes}
              autoDownload={autoDownload}
              setAutoDownload={setAutoDownload}
              safeSearch={safeSearch}
              setSafeSearch={setSafeSearch}
              onClearCache={handleClearCache}
            />
          </div>
        )}

        {/* SEO FAQ & Content Guide for Google Crawlers */}
        <SeoFaqSection currentLang={currentLang} />
      </main>

      {/* Settings Modal (when opened from Header gear icon) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        t={t}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        defaultFps={defaultFps}
        setDefaultFps={setDefaultFps}
        defaultRes={defaultRes}
        setDefaultRes={setDefaultRes}
        autoDownload={autoDownload}
        setAutoDownload={setAutoDownload}
        safeSearch={safeSearch}
        setSafeSearch={setSafeSearch}
        onClearCache={handleClearCache}
      />

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        t={t}
        openSettings={() => setIsSettingsOpen(true)}
      />
    </div>
  );
}

