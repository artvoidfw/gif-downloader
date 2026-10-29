import React, { useState } from 'react';
import { HelpCircle, ChevronDown, CheckCircle2, Zap, Shield, Sparkles } from 'lucide-react';

export default function SeoFaqSection({ currentLang }) {
  const [openIdx, setOpenIdx] = useState(0);

  const isAz = currentLang === 'az';
  const isTr = currentLang === 'tr';

  const faqs = isAz
    ? [
        {
          q: 'Tenor və Giphy-dən GIF-ləri necə endirmək olar?',
          a: 'Tenor, Giphy, Reddit və ya Imgur-dan istədiyiniz GIF səhifəsinin linkini kopyalayın, GIFSNAP daxiletmə xanasına yapışdırın və "Yüklə və Yoxla" düyməsinə basın. Sistemimiz səhifədəki orijinal yüksək keyfiyyətli .gif və ya .mp4 axınını avtomatik çıxararaq bir kliklə endirməyə imkan verir.',
        },
        {
          q: 'Videonu brauzerdə necə GIF formatına çevirmək olar?',
          a: '"Videonu GIF-ə Çevir" menyusuna keçid edin, istənilən MP4, WebM və ya MOV faylını yükləyin və ya nümunə videodan istifadə edin. Taymlayn slayderi ilə başlanğıc və bitmə saniyələrini seçin, FPS (kadr tezliyi) və ölçünü tənzimləyin. "İndi GIF Hazırla" düyməsinə basdıqda video birbaşa brauzerinizin yaddaşında GIF-ə çevrilir.',
        },
        {
          q: 'GIFSNAP xidmətindən istifadə tamamilə pulsuzdurmu?',
          a: 'Bəli, GIFSNAP tamamilə pulsuz və limitsizdir. Heç bir qeydiyyat və ya ödəniş tələb olunmur, yüklədiyiniz fayllar heç bir xarici serverə göndərilmir və məxfiliyiniz 100% qorunur.',
        },
        {
          q: 'GIF faylını ayrı-ayrı kadrlara (PNG) necə parçalamaq olar?',
          a: '"Kadr Parçalayıcı" bölməsinə daxil olun və GIF faylınızı yükləyin. Sistem GIF animasiyasındakı hər bir kadrı yüksək keyfiyyətli tək-tək PNG şəklinə ayıracaq. İstəsəniz kadrları tək-tək, istəsəniz də bircə kliklə hamısını ZIP arxivi kimi endirə bilərsiniz.',
        },
      ]
    : isTr
    ? [
        {
          q: 'Tenor ve Giphy üzerinden GIF nasıl indirilir?',
          a: 'Tenor veya Giphy bağlantısını kopyalayıp GIFSNAP arama kutusuna yapıştırın ve "Getir & İncele" butonuna tıklayın. Sistem orijinal yüksek kaliteli GIF ve MP4 dosyalarını anında bularak tek tıkla cihazınıza kaydetmenizi sağlar.',
        },
        {
          q: 'Videolar programsız nasıl GIF haline getirilir?',
          a: '"Videodan GIF Yap" sekmesine geçin, MP4 veya WebM videonuzu yükleyin. Zaman aralığını, FPS hızını ve genişliği seçip "Şimdi GIF Oluştur" butonuna basın. İşlem doğrudan tarayıcınızda saniyeler içinde tamamlanır.',
        },
        {
          q: 'Hizmet ücretsiz ve güvenli mi?',
          a: 'Evet, GIFSNAP tamamen ücretsizdir. Hiçbir kayıt gerektirmez, dosyalarınız sunuculara yüklenmeden doğrudan kendi tarayıcınızda yerel olarak işlenir.',
        },
      ]
    : [
        {
          q: 'How to download GIFs from Tenor, Giphy, and other sites?',
          a: 'Copy any GIF page URL from Tenor, Giphy, Reddit, or Imgur, paste it into the GIFSNAP input field, and click "Fetch & Analyze". The system automatically extracts the highest quality direct .gif and .mp4 files for 1-click download.',
        },
        {
          q: 'How to convert videos into animated GIFs in your browser?',
          a: 'Go to the "Video to GIF" tab, upload any MP4, WebM, or MOV video file, select your start/end clip duration using the timeline sliders, choose your desired resolution and FPS, then click "Generate GIF Now".',
        },
        {
          q: 'Is GIFSNAP completely free and private?',
          a: 'Yes, GIFSNAP is 100% free with zero limits and zero tracking. All video-to-GIF processing runs locally inside your browser via modern client-side encoders.',
        },
      ];

  return (
    <section className="mx-auto max-w-4xl pt-16 pb-6 space-y-6">
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-10 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          <HelpCircle className="h-3.5 w-3.5 text-blue-500" />
          <span>FAQ & SEO Bələdçi</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {isAz ? 'Tez-Tez Verilən Suallar və Bələdçi' : isTr ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          {isAz
            ? 'GIF endirmə, videodan GIF yaratma və kadr ayırma haqqında ən çox verilən sualların cavabları.'
            : 'Answers to the most common questions regarding GIF downloading and video conversion.'}
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-2.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white transition-colors dark:border-zinc-800 dark:bg-zinc-900"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="flex w-full items-center justify-between p-4 text-left text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-zinc-400 transition-transform duration-200 shrink-0 ml-2 ${
                    isOpen ? 'rotate-180 text-blue-500' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="border-t border-zinc-100 px-4 py-3 text-xs leading-relaxed text-zinc-600 dark:border-zinc-800 dark:text-zinc-400 animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Semantic Keyword Badges for Google Crawlers */}
      <div className="pt-4 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-zinc-400">
        <span className="font-semibold text-zinc-500">Axtarış teqləri:</span>
        <span className="rounded bg-zinc-100 px-2 py-0.5 dark:bg-zinc-900">#gifendirici</span>
        <span className="rounded bg-zinc-100 px-2 py-0.5 dark:bg-zinc-900">#gifyukle</span>
        <span className="rounded bg-zinc-100 px-2 py-0.5 dark:bg-zinc-900">#videonugifecevirmek</span>
        <span className="rounded bg-zinc-100 px-2 py-0.5 dark:bg-zinc-900">#tenorgif</span>
        <span className="rounded bg-zinc-100 px-2 py-0.5 dark:bg-zinc-900">#giphy</span>
        <span className="rounded bg-zinc-100 px-2 py-0.5 dark:bg-zinc-900">#videotogif</span>
        <span className="rounded bg-zinc-100 px-2 py-0.5 dark:bg-zinc-900">#artvoid</span>
      </div>
    </section>
  );
}

