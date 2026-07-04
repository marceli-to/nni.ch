/**
 * Lazily loads videos once they scroll into view: swaps each <source>'s
 * data-src into src, calls load(), then stops observing.
 */

const selector = '[data-video-lazy]';

const loadVideo = (video) => {
  for (const source of video.children) {
    if (source.tagName === 'SOURCE' && source.dataset.src) {
      source.src = source.dataset.src;
    }
  }

  video.load();
  // Remove the marker so the video is never re-loaded.
  video.removeAttribute('data-video-lazy');
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
