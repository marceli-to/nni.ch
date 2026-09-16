/**
 * Lazily loads videos once they scroll into view: swaps each <source>'s
 * data-src into src, calls load(), then stops observing.
 */

const selector = '[data-video-lazy]';
const motionSelector = '[data-motion-video]';

const loadVideo = (video) => {
  for (const source of video.children) {
    if (source.tagName === 'SOURCE' && source.dataset.src) {
      source.src = source.dataset.src;
    }
  }

  video.load();
  // Remove the lazy-load marker so the video is never re-loaded.
  if (video.matches(selector)) video.removeAttribute('data-video-lazy');
};

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      loadVideo(entry.target);
      observer.unobserve(entry.target);
    }
  });

  document.querySelectorAll(selector).forEach((video) => observer.observe(video));
}

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionVideos = document.querySelectorAll(motionSelector);

const syncMotionVideo = (video) => {
  if (motionPreference.matches) {
    video.pause();
    return;
  }

  loadVideo(video);
  video.play().catch(() => {
    // The responsive poster remains visible if autoplay is unavailable.
  });
};

motionVideos.forEach(syncMotionVideo);
motionPreference.addEventListener?.('change', () => {
  motionVideos.forEach(syncMotionVideo);
});
