import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="az">
      <Head>
        <meta charSet="utf-8" />
        
        {/* Core Search Engine Meta Tags */}
        <meta
          name="description"
          content="GIFSNAP - Pulsuz və sürətli GIF Endirici & Videodan GIF Düzəldən Sistem. Tenor, Giphy, Reddit, Imgur linklərindən GIF yükləyin və ya MP4 videolarınızı saniyələr içində GIF-ə çevirin."
        />
        <meta
          name="keywords"
          content="gif endirici, gif yukle, tenor gif endir, giphy gif yukle, videonu gife cevirmek, video to gif, gif converter, mp4 to gif, gif duzeltmek, pulsuz gif yukle, gif parçalayıcı, frame extractor, gifsnap, artvoid"
        />
        <meta name="author" content="Artvoid" />
        <meta name="publisher" content="Artvoid" />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <link rel="canonical" href="https://gifsnap.vercel.app/" />

        {/* Mobile & App Theme */}
        <meta name="theme-color" content="#09090b" />
        <meta name="color-scheme" content="dark light" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="GIFSNAP" />

        {/* Open Graph / Facebook / WhatsApp / Telegram */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gifsnap.vercel.app/" />
        <meta
          property="og:title"
          content="GIFSNAP • Pulsuz GIF Endirici və Videonu GIF-ə Çevirən Sistem"
        />
        <meta
          property="og:description"
          content="Tenor, Giphy və istənilən linkdən yüksək keyfiyyətli GIF yükləyin və ya videolarınızı brauzerdə dərhal GIF-ə çevirin."
        />
        <meta property="og:image" content="https://artvoid.vercel.app/marc.jpg" />
        <meta property="og:site_name" content="GIFSNAP" />
        <meta property="og:locale" content="az_AZ" />
        <meta property="og:locale:alternate" content="tr_TR" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:locale:alternate" content="ru_RU" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@artvoidfw" />
        <meta name="twitter:creator" content="@artvoidfw" />
        <meta
          name="twitter:title"
          content="GIFSNAP • Free GIF Downloader & Video to GIF Converter"
        />
        <meta
          name="twitter:description"
          content="Download GIFs from Tenor, Giphy, Reddit, Imgur or convert MP4/WebM to high-quality animated GIFs with zero quality loss."
        />
        <meta name="twitter:image" content="https://artvoid.vercel.app/marc.jpg" />

        {/* Icons & Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/artvoid-logo.jpg" />
        <link rel="apple-touch-icon" href="/artvoid-logo.jpg" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
