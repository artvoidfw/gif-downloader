import JSZip from 'jszip';

/**
 * Extracts frames from an animated image/video and allows ZIP download
 */
export async function extractFramesFromMedia(source, isVideo = false, onProgress = () => {}) {
  const zip = new JSZip();
  const framesFolder = zip.folder('frames');
  const frameList = [];

  if (isVideo) {
    const video = document.createElement('video');
    video.muted = true;
    video.crossOrigin = 'anonymous';
    const videoUrl = typeof source === 'string' ? source : URL.createObjectURL(source);
    video.src = videoUrl;

    await new Promise((res, rej) => {
      video.onloadedmetadata = res;
      video.onerror = rej;
    });

    const duration = Math.min(video.duration || 3, 10);
    const fps = 10;
    const total = Math.max(1, Math.round(duration * fps));
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 320;
    const ctx = canvas.getContext('2d');

    for (let i = 0; i < total; i++) {
      video.currentTime = (i / total) * duration;
      await new Promise((r) => {
        video.addEventListener('seeked', r, { once: true });
        setTimeout(r, 200);
      });

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      const base64Data = dataUrl.split(',')[1];
      const filename = `frame_${String(i + 1).padStart(3, '0')}.png`;

      framesFolder.file(filename, base64Data, { base64: true });
      frameList.push({ index: i + 1, dataUrl, filename });

      onProgress(Math.round(((i + 1) / total) * 100));
    }

    if (typeof source !== 'string') {
      URL.revokeObjectURL(videoUrl);
    }
  } else {
    // For image/GIF
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const imgUrl = typeof source === 'string' ? source : URL.createObjectURL(source);
    img.src = imgUrl;

    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
    });

    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || 400;
    canvas.height = img.naturalHeight || 300;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const dataUrl = canvas.toDataURL('image/png');
    const base64Data = dataUrl.split(',')[1];
    framesFolder.file('frame_001.png', base64Data, { base64: true });
    frameList.push({ index: 1, dataUrl, filename: 'frame_001.png' });
    onProgress(100);

    if (typeof source !== 'string') {
      URL.revokeObjectURL(imgUrl);
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const zipUrl = URL.createObjectURL(zipBlob);

  return {
    frames: frameList,
    zipBlob,
    zipUrl,
    count: frameList.length,
  };
}

