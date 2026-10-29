import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Upload, 
  Download, 
  Archive, 
  Sparkles, 
  Check, 
  Trash2,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { extractFramesFromMedia } from '../utils/frameExtractor';

export default function FrameExtractorSection({ t, preloadedMediaBlob }) {
  const [mediaFile, setMediaFile] = useState(preloadedMediaBlob || null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedData, setExtractedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (preloadedMediaBlob) {
      setMediaFile(preloadedMediaBlob);
      const url = URL.createObjectURL(preloadedMediaBlob);
      setMediaUrl(url);
    }
  }, [preloadedMediaBlob]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    const url = URL.createObjectURL(file);
    setMediaUrl(url);
    setExtractedData(null);
    setErrorMessage('');
  };

  const handleExtract = async () => {
    if (!mediaFile && !mediaUrl) {
      setErrorMessage('Please select a GIF or Video to extract frames.');
      return;
    }

    setIsExtracting(true);
    setProgress(5);
    setErrorMessage('');

    try {
      const source = mediaFile || mediaUrl;
      const isVideo = mediaFile?.type?.startsWith('video') || mediaUrl.endsWith('.mp4');

      const result = await extractFramesFromMedia(source, isVideo, (p) => {
        setProgress(p);
      });

      setExtractedData(result);
      setIsExtracting(false);
    } catch (err) {
      setErrorMessage(err.message || 'Frame extraction failed.');
      setIsExtracting(false);
    }
  };

  const downloadSingleFrame = (frame) => {
    const a = document.createElement('a');
    a.href = frame.dataUrl;
    a.download = `gifsnap_${frame.filename}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAllZip = () => {
    if (!extractedData) return;
    const a = document.createElement('a');
    a.href = extractedData.zipUrl;
    a.download = `gifsnap_frames_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Title Header - Strictly NO gradient */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400">
          <Layers className="h-3.5 w-3.5" />
          <span>{t.fe_title}</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
          {t.fe_title}
        </h2>
        <p className="mx-auto max-w-2xl text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          {t.fe_desc}
        </p>
      </div>

      {/* Upload Zone */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div className="relative mx-auto flex max-w-xl flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 p-8 hover:border-blue-500 dark:border-zinc-700 dark:hover:border-blue-500 transition-colors">
          <input
            type="file"
            accept="image/gif,video/mp4,video/webm"
            onChange={handleFileUpload}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 mb-3">
            <Upload className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            Choose GIF to Split
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Supports animated .GIF, MP4 or WebM
          </p>
        </div>

        {mediaUrl && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-lg border border-zinc-200 bg-black flex items-center justify-center dark:border-zinc-700">
                <img src={mediaUrl} alt="Thumbnail" className="max-h-full max-w-full object-contain" />
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white">
                  {mediaFile?.name || 'Selected Media'}
                </div>
                <div className="text-[11px] text-zinc-500">
                  Ready to deconstruct into individual PNG frames
                </div>
              </div>
            </div>

            <button
              onClick={handleExtract}
              disabled={isExtracting}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isExtracting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Layers className="h-4 w-4" />
              )}
              <span>{isExtracting ? t.fe_extracting : t.fe_extract_btn}</span>
            </button>
          </div>
        )}

        {isExtracting && (
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs font-medium text-zinc-500">
              <span>{t.fe_extracting}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className="h-full bg-blue-600 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Extracted Frames Gallery */}
      {extractedData && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                {t.fe_total_frames}: {extractedData.count}
              </h3>
              <p className="text-xs text-zinc-500">
                High-fidelity PNG frames available for individual or batch ZIP download
              </p>
            </div>

            <button
              onClick={downloadAllZip}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm transition-colors"
            >
              <Archive className="h-4 w-4" />
              <span>{t.fe_download_all_zip}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {extractedData.frames.map((frame) => (
              <div
                key={frame.index}
                className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 p-1 dark:border-zinc-800 flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full flex items-center justify-center overflow-hidden">
                  <img
                    src={frame.dataUrl}
                    alt={frame.filename}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="mt-1 flex items-center justify-between bg-zinc-900 px-2 py-1 rounded text-[10px] text-zinc-300">
                  <span className="font-mono font-bold">#{frame.index}</span>
                  <button
                    onClick={() => downloadSingleFrame(frame)}
                    className="text-blue-400 hover:text-white"
                    title="Download Frame"
                  >
                    <Download className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

