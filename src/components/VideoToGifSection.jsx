import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Upload, 
  Scissors, 
  Play, 
  Pause, 
  Download, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  Check, 
  Sliders, 
  Type, 
  Eye,
  AlertCircle
} from 'lucide-react';
import { convertVideoToGif } from '../utils/videoToGif';

export default function VideoToGifSection({ t, preloadedVideoUrl, autoDownloadSetting, onOpenExtractor }) {
  const [videoFile, setVideoFile] = useState(null);
  const [videoSrc, setVideoSrc] = useState(preloadedVideoUrl || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Conversion Options
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(3);
  const [targetWidth, setTargetWidth] = useState(480);
  const [fps, setFps] = useState(12);
  const [speed, setSpeed] = useState(1.0);
  const [maxColors, setMaxColors] = useState(128);
  const [reverse, setReverse] = useState(false);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');

  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressInfo, setProgressInfo] = useState({ stage: '', percent: 0, currentFrame: 0, totalFrames: 0 });
  const [resultGif, setResultGif] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const videoRef = useRef(null);

  // Handle preloaded video if passed from Downloader section
  useEffect(() => {
    if (preloadedVideoUrl) {
      setVideoSrc(preloadedVideoUrl);
    }
  }, [preloadedVideoUrl]);

  // Video metadata loaded
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration || 5;
    setDuration(dur);
    setStartTime(0);
    setEndTime(Math.min(dur, 4)); // default 4-second clip
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (videoRef.current.currentTime >= endTime) {
        videoRef.current.currentTime = startTime;
      }
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Generate an instant rich sample video locally using canvas & MediaRecorder
  const generateSampleVideo = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 480;
      canvas.height = 320;
      const ctx = canvas.getContext('2d');
      const stream = canvas.captureStream(30);

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setVideoFile(blob);
        setVideoSrc(url);
      };

      recorder.start();

      let frame = 0;
      const totalSampleFrames = 90; // 3 seconds at 30 fps

      const renderSampleFrame = () => {
        if (frame >= totalSampleFrames) {
          recorder.stop();
          return;
        }

        // Draw animated solid minimalist graphics (NO gradients!)
        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Bouncing box
        const t = frame / 30;
        const x = 240 + Math.sin(t * 3) * 140;
        const y = 160 + Math.cos(t * 4) * 60;
        const size = 60 + Math.sin(t * 5) * 15;

        // Solid crisp shapes
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(x - size / 2, y - size / 2, size, size);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GIFSNAP STUDIO', 240, 60);

        ctx.font = 'mono 16px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`FRAME: ${frame + 1} / 90  •  ${(frame / 30).toFixed(2)}s`, 240, 280);

        frame++;
        requestAnimationFrame(renderSampleFrame);
      };

      renderSampleFrame();
    } catch {
      setErrorMessage('Could not generate sample video in this browser.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setResultGif(null);
    setErrorMessage('');
  };

  const handleConvert = async () => {
    if (!videoSrc) {
      setErrorMessage(t.error_video);
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);
    setProgressInfo({ stage: 'starting', percent: 2, currentFrame: 0, totalFrames: 0 });

    try {
      const source = videoFile || videoSrc;
      const result = await convertVideoToGif(
        source,
        {
          startTime: Number(startTime),
          endTime: Number(endTime),
          fps: Number(fps),
          targetWidth: Number(targetWidth),
          maxColors: Number(maxColors),
          speed: Number(speed),
          topText,
          bottomText,
          textColor,
          reverse,
        },
        (prog) => {
          setProgressInfo(prog);
        }
      );

      setResultGif(result);
      setIsProcessing(false);

      // Auto download if enabled in user settings
      if (autoDownloadSetting) {
        const a = document.createElement('a');
        a.href = result.url;
        a.download = `gifsnap_converted_${Date.now()}.gif`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      setErrorMessage(err.message || t.error_video);
      setIsProcessing(false);
    }
  };

  const downloadResultGif = () => {
    if (!resultGif) return;
    const a = document.createElement('a');
    a.href = resultGif.url;
    a.download = `gifsnap_${Date.now()}.gif`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const selectedDuration = Math.max(0, endTime - startTime).toFixed(1);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header Info - Strictly NO gradient */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400">
          <Video className="h-3.5 w-3.5" />
          <span>{t.vg_title}</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
          {t.vg_title}
        </h2>
        <p className="mx-auto max-w-2xl text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          {t.vg_desc}
        </p>
      </div>

      {/* Upload or Sample Selector */}
      {!videoSrc && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 text-center space-y-5">
          <div className="relative mx-auto flex max-w-lg flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 p-8 hover:border-blue-500 dark:border-zinc-700 dark:hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              onChange={handleFileUpload}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 mb-3">
              <Upload className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              {t.vg_upload_title}
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {t.vg_upload_subtitle}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <span className="text-xs text-zinc-400 font-medium">OR</span>
            <button
              onClick={generateSampleVideo}
              type="button"
              className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-2 text-xs font-bold text-zinc-800 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span>{t.vg_sample_btn}</span>
            </button>
          </div>
        </div>
      )}

      {/* Video Studio Workspace */}
      {videoSrc && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Video Preview & Scrub Bar (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-950 shadow-sm dark:border-zinc-800">
              
              {/* Video Element */}
              <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={videoSrc}
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  playsInline
                  className="max-h-full max-w-full object-contain"
                />

                {/* Play/Pause Overlay Button */}
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-md group-hover:scale-110 transition-transform">
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                  </div>
                </button>
              </div>

              {/* Video Player Timeline Bar */}
              <div className="border-t border-zinc-800 bg-zinc-900 px-4 py-3 flex items-center justify-between text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-800 hover:bg-zinc-700 text-white"
                  >
                    {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                  </button>
                  <span className="font-mono text-[11px]">
                    {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded bg-blue-950 px-2 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-900/50">
                    {t.vg_duration}: {selectedDuration}s
                  </span>
                  <button
                    onClick={() => {
                      setVideoSrc('');
                      setVideoFile(null);
                      setResultGif(null);
                    }}
                    className="text-[11px] text-zinc-400 hover:text-white"
                  >
                    Change Video
                  </button>
                </div>
              </div>
            </div>

            {/* Trimming Timeline Sliders */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scissors className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                    {t.vg_trim_label}
                  </span>
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {startTime}s ➔ {endTime}s
                </span>
              </div>

              {/* Start Time Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>{t.vg_start_time}</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{startTime}s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, duration - 0.2)}
                  step="0.1"
                  value={startTime}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setStartTime(val);
                    if (val >= endTime) setEndTime(Math.min(duration, val + 1));
                    if (videoRef.current) videoRef.current.currentTime = val;
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* End Time Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>{t.vg_end_time}</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">{endTime}s</span>
                </div>
                <input
                  type="range"
                  min={Math.min(duration, startTime + 0.1)}
                  max={duration}
                  step="0.1"
                  value={endTime}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setEndTime(val);
                    if (videoRef.current) videoRef.current.currentTime = val;
                  }}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Meme / Caption Text Overlay Tool */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-zinc-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  {t.vg_text_overlay}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={t.vg_top_text}
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  className="rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
                <input
                  type="text"
                  placeholder={t.vg_bottom_text}
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  className="rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Settings & Generation Button (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800">
                <Sliders className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                  Output Optimization
                </span>
              </div>

              {/* Resolution / Width */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  <span>{t.vg_resolution}</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{targetWidth}px</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[240, 360, 480, 640].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setTargetWidth(w)}
                      className={`rounded-lg py-1.5 text-xs font-semibold border transition-colors ${
                        targetWidth === w
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {w}p
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Rate (FPS) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  <span>{t.vg_fps}</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{fps} FPS</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[8, 12, 16, 20, 24].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFps(f)}
                      className={`rounded-lg py-1.5 text-xs font-semibold border transition-colors ${
                        fps === f
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed Multiplier */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  <span>{t.vg_speed}</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{speed}x</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0.5, 1.0, 1.5, 2.0].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSpeed(s)}
                      className={`rounded-lg py-1.5 text-xs font-semibold border transition-colors ${
                        speed === s
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Palette Depth */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  <span>{t.vg_colors}</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{maxColors}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[32, 64, 128, 256].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setMaxColors(c)}
                      className={`rounded-lg py-1.5 text-xs font-semibold border transition-colors ${
                        maxColors === c
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reverse Playback Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={reverse}
                    onChange={(e) => setReverse(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    {t.vg_reverse}
                  </span>
                </label>
              </div>

              {/* Generate GIF Solid Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleConvert}
                  disabled={isProcessing}
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 px-4 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isProcessing ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  <span>{isProcessing ? t.vg_converting : t.vg_convert_btn}</span>
                </button>
              </div>

              {/* Progress Bar (Strictly Solid, NO Gradients) */}
              {isProcessing && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-medium text-zinc-500">
                    <span className="capitalize">{progressInfo.stage || 'Processing'}...</span>
                    <span>{progressInfo.percent}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div
                      className="h-full bg-blue-600 transition-all duration-150"
                      style={{ width: `${progressInfo.percent}%` }}
                    />
                  </div>
                  {progressInfo.totalFrames > 0 && (
                    <div className="text-[10px] text-zinc-400 text-center">
                      Frame {progressInfo.currentFrame} / {progressInfo.totalFrames}
                    </div>
                  )}
                </div>
              )}

              {errorMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Generated GIF Result Card */}
            {resultGif && (
              <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                      {t.vg_preview_title}
                    </span>
                  </div>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Ready
                  </span>
                </div>

                {/* Animated GIF Image */}
                <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 dark:border-zinc-800">
                  <img
                    src={resultGif.url}
                    alt="Converted GIF"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Details Badges */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-800/60">
                    <div className="text-[10px] text-zinc-400">{t.dl_dimensions}</div>
                    <div className="font-bold text-zinc-900 dark:text-white font-mono">
                      {resultGif.width}×{resultGif.height}
                    </div>
                  </div>

                  <div className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-800/60">
                    <div className="text-[10px] text-zinc-400">{t.dl_size}</div>
                    <div className="font-bold text-zinc-900 dark:text-white font-mono">
                      {(resultGif.size / 1024).toFixed(0)} KB
                    </div>
                  </div>

                  <div className="rounded-lg bg-zinc-50 p-2 dark:bg-zinc-800/60">
                    <div className="text-[10px] text-zinc-400">Frames</div>
                    <div className="font-bold text-zinc-900 dark:text-white font-mono">
                      {resultGif.frameCount}
                    </div>
                  </div>
                </div>

                {/* Download and Extract Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={downloadResultGif}
                    type="button"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>{t.vg_dl_gif}</span>
                  </button>

                  <button
                    onClick={() => onOpenExtractor(resultGif.blob)}
                    type="button"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-300 bg-zinc-100 px-3 py-3 text-xs font-bold text-zinc-800 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    title={t.nav_extractor}
                  >
                    <Layers className="h-4 w-4" />
                    <span>Split</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      )}
    </div>
  );
}

