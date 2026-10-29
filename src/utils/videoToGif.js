import { GIFEncoder, quantize, applyPalette } from 'gifenc';

/**
 * Converts a video file or URL into an animated GIF client-side
 *
 * @param {File|Blob|string} videoSource - File object or video URL
 * @param {Object} options - Conversion options
 * @param {Function} onProgress - Progress callback ({ stage, percent, currentFrame, totalFrames })
 * @returns {Promise<{ blob: Blob, url: string, size: number, width: number, height: number, frameCount: number }>}
 */
export async function convertVideoToGif(videoSource, options = {}, onProgress = () => {}) {
  const {
    startTime = 0,
    endTime = 0,
    fps = 12,
    targetWidth = 400,
    maxColors = 128,
    speed = 1.0,
    topText = '',
    bottomText = '',
    textColor = '#ffffff',
    reverse = false,
  } = options;

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.muted = true;
    video.crossOrigin = 'anonymous';
    video.playsInline = true;

    let videoUrl = '';
    if (typeof videoSource === 'string') {
      videoUrl = videoSource;
    } else {
      videoUrl = URL.createObjectURL(videoSource);
    }

    video.src = videoUrl;

    video.onerror = () => {
      reject(new Error('Failed to load video. Format may not be supported by your browser.'));
    };

    video.onloadedmetadata = async () => {
      try {
        const videoDuration = video.duration || 5;
        const validStartTime = Math.max(0, Math.min(startTime, videoDuration - 0.1));
        const validEndTime = Math.min(videoDuration, endTime > validStartTime ? endTime : videoDuration);
        const clipDuration = Math.max(0.2, validEndTime - validStartTime);

        // Aspect ratio calculations
        const originalWidth = video.videoWidth || 640;
        const originalHeight = video.videoHeight || 360;
        const ratio = originalHeight / originalWidth;
        const width = Math.min(targetWidth, originalWidth);
        const height = Math.round(width * ratio);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        const totalFrames = Math.max(1, Math.round(clipDuration * fps));
        const frameInterval = clipDuration / totalFrames;

        onProgress({ stage: 'capturing', percent: 5, currentFrame: 0, totalFrames });

        // Collect RGBA frame data
        const rawFrames = [];

        for (let i = 0; i < totalFrames; i++) {
          const seekTime = validStartTime + i * frameInterval;
          video.currentTime = seekTime;

          await new Promise((res) => {
            const onSeeked = () => {
              video.removeEventListener('seeked', onSeeked);
              res();
            };
            video.addEventListener('seeked', onSeeked, { once: true });
            // Fallback timeout in case seeked doesn't fire
            setTimeout(res, 250);
          });

          // Draw frame to canvas
          ctx.drawImage(video, 0, 0, width, height);

          // Draw Meme / Subtitle Text Overlay if specified
          if (topText.trim() || bottomText.trim()) {
            ctx.textAlign = 'center';
            const fontSize = Math.max(14, Math.floor(width * 0.075));
            ctx.font = `900 ${fontSize}px sans-serif`;
            ctx.fillStyle = textColor;
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = Math.max(2, Math.floor(fontSize * 0.18));
            ctx.lineJoin = 'round';

            if (topText.trim()) {
              const y = fontSize + 8;
              ctx.strokeText(topText.toUpperCase(), width / 2, y);
              ctx.fillText(topText.toUpperCase(), width / 2, y);
            }

            if (bottomText.trim()) {
              const y = height - 12;
              ctx.strokeText(bottomText.toUpperCase(), width / 2, y);
              ctx.fillText(bottomText.toUpperCase(), width / 2, y);
            }
          }

          const imgData = ctx.getImageData(0, 0, width, height);
          rawFrames.push(imgData.data);

          const progressPercent = Math.round(5 + (i / totalFrames) * 45);
          onProgress({ stage: 'capturing', percent: progressPercent, currentFrame: i + 1, totalFrames });
        }

        // If reverse playback is active
        if (reverse) {
          rawFrames.reverse();
        }

        // Encode to GIF using gifenc
        onProgress({ stage: 'encoding', percent: 52, currentFrame: 0, totalFrames });
        const gif = GIFEncoder();
        const frameDelay = Math.round((1000 / fps) / speed);

        for (let i = 0; i < rawFrames.length; i++) {
          const frameRgba = rawFrames[i];
          const palette = quantize(frameRgba, maxColors, { format: 'rgb565' });
          const index = applyPalette(frameRgba, palette, 'rgb565');

          gif.writeFrame(index, width, height, {
            palette,
            delay: frameDelay,
            repeat: 0,
          });

          const encodePercent = Math.round(52 + (i / rawFrames.length) * 45);
          onProgress({ stage: 'encoding', percent: encodePercent, currentFrame: i + 1, totalFrames });
        }

        gif.finish();
        const bytes = gif.bytes();
        const blob = new Blob([bytes], { type: 'image/gif' });
        const outputUrl = URL.createObjectURL(blob);

        onProgress({ stage: 'done', percent: 100, currentFrame: totalFrames, totalFrames });

        // Clean up object url if we created one for a File
        if (typeof videoSource !== 'string') {
          URL.revokeObjectURL(videoUrl);
        }

        resolve({
          blob,
          url: outputUrl,
          size: blob.size,
          width,
          height,
          frameCount: totalFrames,
        });
      } catch (err) {
        reject(err);
      }
    };
  });
}

