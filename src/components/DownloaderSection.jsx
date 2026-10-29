import React, { useState } from 'react';
import { 
  Download, 
  Link as LinkIcon, 
  Clipboard, 
  Trash2, 
  FileCheck, 
  Film, 
  Image as ImageIcon, 
  Share2, 
  Check, 
  ExternalLink,
  Sparkles,
  Info,
  AlertCircle
} from 'lucide-react';

export default function DownloaderSection({ t, onSwitchToConverter }) {
  const [urlInput, setUrlInput] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [mediaInfo, setMediaInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('gif');

  // Quick paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text.trim());
        analyzeMedia(text.trim());
      }
    } catch {
      setErrorMsg('Could not read from clipboard. Please paste manually.');
    }
  };

  const handleClear = () => {
    setUrlInput('');
    setMediaInfo(null);
    setErrorMsg('');
  };

  const analyzeMedia = async (inputUrl) => {
    const targetUrl = (inputUrl || urlInput).trim();
    if (!targetUrl || !targetUrl.startsWith('http')) {
      setErrorMsg('Zəhmət olmasa düzgün HTTP və ya HTTPS linki daxil edin.');
      return;
    }

    setErrorMsg('');
    setIsFetching(true);
    setMediaInfo(null);

    try {
      // Step 1: Extract real direct media URL (supports Tenor, Giphy, Imgur, Reddit, direct .gif, etc.)
      const extractRes = await fetch(`/api/extract-media-url?url=${encodeURIComponent(targetUrl)}`);
      const extractData = await extractRes.json();

      if (!extractData.success || (!extractData.gifUrl && !extractData.mp4Url)) {
        throw new Error(extractData.error || 'Bu linkdən GIF faylı tapılmadı. Zəhmət olmasa birbaşa və ya başqa GIF linki sınayın.');
      }

      const activeGifUrl = extractData.gifUrl || extractData.mediaUrl;
      const activeMp4Url = extractData.mp4Url;
      const mediaType = extractData.type || 'gif';
      const cleanTitle = (extractData.title || 'gifsnap_media').replace(/[^a-zA-Z0-9_-]/g, '_');

      // Step 2: Test & inspect dimensions using the extracted direct stream via our CORS proxy
      const proxyPreviewUrl = `/api/proxy-media?url=${encodeURIComponent(activeGifUrl || activeMp4Url)}`;

      if (mediaType === 'video' && !activeGifUrl) {
        const video = document.createElement('video');
        video.src = proxyPreviewUrl;
        video.onloadedmetadata = () => {
          setMediaInfo({
            type: 'video',
            source: extractData.source,
            title: cleanTitle,
            originalUrl: targetUrl,
            directGifUrl: activeGifUrl,
            directMp4Url: activeMp4Url,
            proxyUrl: proxyPreviewUrl,
            width: video.videoWidth || 640,
            height: video.videoHeight || 360,
            duration: Math.round(video.duration || 0),
            sizeApprox: 'Video Stream',
          });
          setIsFetching(false);
        };
        video.onerror = () => {
          setMediaInfo({
            type: 'video',
            source: extractData.source,
            title: cleanTitle,
            originalUrl: targetUrl,
            directGifUrl: activeGifUrl,
            directMp4Url: activeMp4Url,
            proxyUrl: proxyPreviewUrl,
            width: 640,
            height: 360,
            sizeApprox: 'Video Media',
          });
          setIsFetching(false);
        };
      } else {
        const img = new Image();
        img.src = proxyPreviewUrl;
        img.onload = () => {
          setMediaInfo({
            type: 'gif',
            source: extractData.source,
            title: cleanTitle,
            originalUrl: targetUrl,
            directGifUrl: activeGifUrl,
            directMp4Url: activeMp4Url,
            proxyUrl: proxyPreviewUrl,
            width: img.naturalWidth || 480,
            height: img.naturalHeight || 320,
            sizeApprox: 'HD GIF',
          });
          setIsFetching(false);
        };
        img.onerror = () => {
          // Even if image tag has issue, still provide download of the verified extracted URL
          setMediaInfo({
            type: 'gif',
            source: extractData.source,
            title: cleanTitle,
            originalUrl: targetUrl,
            directGifUrl: activeGifUrl,
            directMp4Url: activeMp4Url,
            proxyUrl: proxyPreviewUrl,
            width: 500,
            height: 300,
            sizeApprox: 'Animated GIF',
          });
          setIsFetching(false);
        };
      }
    } catch (err) {
      setErrorMsg(err.message || t.error_fetch);
      setIsFetching(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video');

    setMediaInfo({
      type: isVideo ? 'video' : 'gif',
      source: 'local',
      title: file.name.replace(/\.[^/.]+$/, ''),
      originalUrl: fileUrl,
      directGifUrl: isVideo ? null : fileUrl,
      directMp4Url: isVideo ? fileUrl : null,
      proxyUrl: fileUrl,
      isLocal: true,
      filename: file.name,
      width: isVideo ? 640 : 480,
      height: isVideo ? 360 : 320,
      sizeApprox: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
    });
  };

  const triggerDownload = async (format = 'gif') => {
    if (!mediaInfo) return;
    setIsDownloading(true);

    try {
      const filename = `${mediaInfo.title || 'gifsnap'}.${format}`;

      if (mediaInfo.isLocal) {
        const a = document.createElement('a');
        a.href = mediaInfo.proxyUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setIsDownloading(false);
        return;
      }

      // Decide which underlying stream to fetch
      let targetDownloadUrl = mediaInfo.directGifUrl || mediaInfo.directMp4Url;
      if (format === 'mp4' && mediaInfo.directMp4Url) {
        targetDownloadUrl = mediaInfo.directMp4Url;
      } else if (format === 'gif' && mediaInfo.directGifUrl) {
        targetDownloadUrl = mediaInfo.directGifUrl;
      }

      const downloadProxyUrl = `/api/proxy-media?url=${encodeURIComponent(targetDownloadUrl)}&download=1&filename=${encodeURIComponent(filename)}`;

      // Fetch blob to guarantee immediate browser download without redirect blockers
      const res = await fetch(downloadProxyUrl);
      if (!res.ok) throw new Error('Yükləmə xətası baş verdi.');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
      setIsDownloading(false);
    } catch (err) {
      // Fallback to direct navigation download
      const targetDownloadUrl = mediaInfo.directGifUrl || mediaInfo.directMp4Url;
      const filename = `${mediaInfo.title || 'gifsnap'}.${format}`;
      window.location.href = `/api/proxy-media?url=${encodeURIComponent(targetDownloadUrl)}&download=1&filename=${encodeURIComponent(filename)}`;
      setIsDownloading(false);
    }
  };

  const copyToClipboard = () => {
    if (!mediaInfo) return;
    const linkToCopy = mediaInfo.directGifUrl || mediaInfo.directMp4Url || mediaInfo.originalUrl;
    navigator.clipboard.writeText(linkToCopy);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Sample quick test links
  const sampleLinks = [
    { name: 'Tenor GIF', url: 'https://tenor.com/view/cat-dance-gif-25686036' },
    { name: 'Giphy GIF', url: 'https://giphy.com/gifs/cat-dance-JIX9t2j0ZTN9S' },
    { name: 'Direct GIF', url: 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif' },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Main Input Box Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        
        {/* URL Input Bar */}
        <div className="relative flex flex-col sm:flex-row items-stretch gap-2">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
              <LinkIcon className="h-4 w-4" />
            </div>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && analyzeMedia(urlInput)}
              placeholder={t.dl_placeholder}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 py-3 pl-10 pr-20 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-white dark:focus:bg-zinc-800"
            />
            {urlInput && (
              <button
                onClick={handleClear}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                title={t.dl_clear_btn}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePaste}
              type="button"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Clipboard className="h-3.5 w-3.5" />
              <span>{t.dl_paste_btn}</span>
            </button>

            <button
              onClick={() => analyzeMedia(urlInput)}
              disabled={isFetching || !urlInput.trim()}
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isFetching ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <FileCheck className="h-4 w-4" />
              )}
              <span>{t.dl_fetch_btn}</span>
            </button>
          </div>
        </div>

        {/* Quick sample chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="font-semibold text-zinc-400 dark:text-zinc-500">Dəstəklənən Saytlar:</span>
          {sampleLinks.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUrlInput(item.url);
                analyzeMedia(item.url);
              }}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-zinc-600 hover:border-blue-400 hover:text-blue-600 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              {item.name}
            </button>
          ))}
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            • Tenor, Giphy, Reddit, Imgur, Twitter/X və birbaşa linklər
          </span>
        </div>

        {/* Drag and Drop Alternate Box */}
        <div className="relative rounded-xl border border-dashed border-zinc-300 bg-zinc-50/60 p-4 text-center hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/40 dark:hover:bg-zinc-800 transition-colors">
          <input
            type="file"
            accept="image/gif,video/mp4,video/webm"
            onChange={handleFileUpload}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="flex flex-col items-center justify-center gap-1.5">
            <ImageIcon className="h-6 w-6 text-zinc-400" />
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              {t.dl_drop_text}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Media Inspection & Download Card */}
      {mediaInfo && (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 animate-fadeIn">
          <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                {t.dl_details}
              </span>
              {mediaInfo.source && (
                <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50">
                  {mediaInfo.source}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Share2 className="h-3.5 w-3.5" />}
                <span>{copiedLink ? t.dl_copied : t.dl_copy_link}</span>
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Visual Preview */}
            <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 dark:border-zinc-800">
              {mediaInfo.type === 'video' && !mediaInfo.directGifUrl ? (
                <video
                  src={mediaInfo.proxyUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <img
                  src={mediaInfo.proxyUrl}
                  alt={mediaInfo.title || 'GIF Preview'}
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>

            {/* Information & Action Column */}
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-center dark:border-zinc-800 dark:bg-zinc-800/60">
                  <div className="text-[11px] font-medium text-zinc-400">{t.dl_dimensions}</div>
                  <div className="mt-1 font-mono text-sm font-bold text-zinc-900 dark:text-white">
                    {mediaInfo.width} × {mediaInfo.height}
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-center dark:border-zinc-800 dark:bg-zinc-800/60">
                  <div className="text-[11px] font-medium text-zinc-400">{t.dl_size}</div>
                  <div className="mt-1 font-mono text-sm font-bold text-zinc-900 dark:text-white">
                    {mediaInfo.sizeApprox}
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-center dark:border-zinc-800 dark:bg-zinc-800/60">
                  <div className="text-[11px] font-medium text-zinc-400">Type</div>
                  <div className="mt-1 font-mono text-sm font-bold uppercase text-blue-600 dark:text-blue-400">
                    {mediaInfo.type}
                  </div>
                </div>
              </div>

              {/* Format Selection Pills */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {t.dl_formats}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'gif', label: 'GIF', desc: 'Animation' },
                    { id: 'mp4', label: 'MP4', desc: 'Video' },
                    { id: 'webm', label: 'WebM', desc: 'Ultra-small' },
                    { id: 'apng', label: 'APNG', desc: 'Hi-Fi PNG' },
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      onClick={() => setSelectedFormat(fmt.id)}
                      className={`rounded-xl border p-2 text-center transition-all ${
                        selectedFormat === fmt.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300 font-bold'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      <div className="text-xs font-bold">{fmt.label}</div>
                      <div className="text-[10px] text-zinc-400">{fmt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => triggerDownload(selectedFormat)}
                  disabled={isDownloading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 transition-colors"
                >
                  {isDownloading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  <span>
                    {isDownloading ? 'Endirilir...' : `${t.dl_download_now} (.${selectedFormat.toUpperCase()})`}
                  </span>
                </button>

                {(mediaInfo.type === 'video' || mediaInfo.directMp4Url) && (
                  <button
                    onClick={() => onSwitchToConverter(mediaInfo.directMp4Url || mediaInfo.proxyUrl)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-3 text-xs font-bold text-zinc-800 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <Film className="h-4 w-4 text-blue-500" />
                    <span>Studioya Göndər</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
