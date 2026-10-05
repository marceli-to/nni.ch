/**
 * Lazily loads videos once they come within a screen of the viewport: swaps
 * each <source>'s data-src into src, calls load(), then stops observing.
 * The screen of lead time lets a full-page video buffer before scroll-snapping
 * brings its section into view.
 */

const selector = '[data-video-lazy]';
const motionSelector = '[data-motion-video]';

export const loadVideo = (video) => {
  // Eager videos load by themselves; calling load() again would only restart
  // their download.
  if (!video.matches(selector)) return;

  for (const source of video.children) {
    if (source.tagName === 'SOURCE' && source.dataset.src) {
      source.src = source.dataset.src;
    }
  }

  video.load();
  // Remove the lazy-load marker so the video is never re-loaded.
  video.removeAttribute('data-video-lazy');
};

/**
 * Called when the browser refuses to play (iOS Low Power Mode, data saver).
 * Without this the video would still download in full and never be seen.
 * Dropping the sources and calling load() aborts the download; the marker
 * keeps later calls from starting it again.
 */
export const stopVideo = (video) => {
  video.dataset.autoplayRefused = '';

  for (const source of video.children) {
    if (source.tagName === 'SOURCE') source.removeAttribute('src');
  }

  video.removeAttribute('src');
  video.load();
};

export const playVideo = (video) => {
  if ('autoplayRefused' in video.dataset) return Promise.resolve();

  loadVideo(video);
  return video.play().catch((error) => {
    // An AbortError only means a pause() came first; that is not a refusal.
    if (error.name === 'NotAllowedError') stopVideo(video);
    throw error;
  });
};

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const video = entry.target;
      observer.unobserve(video);

      // An autoplay video is started here rather than by the attribute, so a
      // refusal stops its download (see playVideo).
      if (video.autoplay) {
        playVideo(video).catch(() => {});
      } else {
        loadVideo(video);
      }
    }
  }, { rootMargin: '100% 0px' });

  document.querySelectorAll(selector).forEach((video) => observer.observe(video));
}

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionVideos = document.querySelectorAll(motionSelector);

const syncMotionVideo = (video) => {
  if (motionPreference.matches) {
    video.pause();
    return;
  }

  // A lazy video is started by observer.js when its section is reached.
  if (video.matches(selector)) return;

  playVideo(video).catch(() => {
    // The responsive poster remains visible if autoplay is unavailable.
  });
};

motionVideos.forEach(syncMotionVideo);
motionPreference.addEventListener?.('change', () => {
  motionVideos.forEach(syncMotionVideo);
});
