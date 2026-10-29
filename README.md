# GIFSNAP ⚡

> **Modern GIF Downloader & Video-to-GIF Converter**  
> Built with Next.js, Tailwind CSS, and `gifenc` client-side encoder.  
> Created by **[Artvoid](https://artvoid.vercel.app/)** • [GitHub](https://github.com/artvoidfw)

---

## ✨ Features

- 🎯 **Direct GIF & Video Downloader**:
  - Automatically extracts high-resolution direct `.gif` and `.mp4` streams from **Tenor**, **Giphy**, **Reddit**, **Imgur**, and direct URLs.
  - Multi-format downloading: Original GIF, MP4 Video, WebM Video, and APNG.
  - Built-in CORS proxy stream (`/api/proxy-media`) to bypass cross-origin browser restrictions.

- 🎬 **Video to GIF Studio**:
  - 100% in-browser client-side video conversion with zero server latency.
  - Supports MP4, WebM, MOV, and MKV.
  - Timeline trimming with Start & End sliders.
  - Customizable FPS (8, 12, 16, 20, 24), Resolution/Width (240p to 640p), and Playback speed (0.5x to 2.0x).
  - NeuQuant color depth quantizer (32, 64, 128, 256 colors).
  - Reverse playback and Meme / Caption text overlay generator.
  - 1-click test sample video generator.

- 🔍 **Discover & Explore Engine**:
  - Fast categorized search across Trending, Reactions, Anime, Memes, Gaming, Animals, Movies, and Sports.

- 🧩 **Frame Splitter & ZIP Exporter**:
  - Deconstruct any GIF into individual high-definition PNG frames.
  - 1-click batch ZIP download or single frame extraction.

- 🌍 **18 World Languages**:
  - Complete native translation dictionary across 18 major world languages:
    - 🇦🇿 Azərbaycan, 🇺🇸 English, 🇹🇷 Türkçe, 🇪🇸 Español, 🇷🇺 Русский, 🇰🇷 한국어, 🇯🇵 日本語, 🇸🇦 العربية (RTL), 🇩🇪 Deutsch, 🇫🇷 Français, 🇨🇳 简体中文, 🇮🇹 Italiano, 🇧🇷 Português, 🇮🇳 हिन्दी, 🇮🇩 Bahasa Indonesia, 🇳🇱 Nederlands, 🇵🇱 Polski, 🇮🇷 فارسی (RTL).

- 🎨 **Minimalist Architecture (Zero Gradients)**:
  - High-contrast pure obsidian dark (`#09090b`) and clean paper light theme.
  - Razor-sharp borders, solid accents, and strictly zero gradient styling.

- 🚀 **Full Search Engine Optimization (SEO)**:
  - Google Schema.org structured data (`WebApplication`, `WebSite`, `FAQPage`).
  - Multilingual `sitemap.xml` with Google `hreflang` alternates.
  - Full Open Graph, Twitter Cards, `manifest.json`, and `robots.txt`.

---

## 🛠️ Quick Start

```bash
# Clone the repository
git clone https://github.com/artvoidfw/gif-downloader.git

# Navigate to project directory
cd gif-downloader

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build

```bash
npm run build
npm run start
```

---

## 👨‍💻 Author

**Artvoid**
- Portfolio: [https://artvoid.vercel.app/](https://artvoid.vercel.app/)
- GitHub: [@artvoidfw](https://github.com/artvoidfw)
