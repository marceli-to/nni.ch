(function () {

  const selectors = {
    video: '[data-video]',
  };

  const breakpoint = 768;

  const init = () => {
    // if no video elements are found, return
    const videos = document.querySelectorAll(selectors.video);
    if (videos.length === 0) {
      return;
    }
    videos.forEach(video => {
      // Initialize each video's current source
      video.setAttribute('data-current-source', 'low');
    });
    load();
    window.addEventListener('resize', resize);
  };

  const resize = () => {
    const width = window.innerWidth;
    load(width);
  };

  const load = (width = window.innerWidth) => {
    const videos = document.querySelectorAll(selectors.video);

    videos.forEach((video) => {
      // get 'data-video-source' attribute
      const sources = video.getAttribute('data-video-source');

      // parse the source into an object
      const parsedSources = JSON.parse(sources);

      // get current source from the video's data attribute
      let currentSource = video.getAttribute('data-current-source');
      let source;

      if (width < breakpoint && currentSource !== 'low') {
        source = parsedSources.low;
        video.setAttribute('data-current-source', 'low');
      } 
      else if (width >= breakpoint && currentSource !== 'high') {
        source = parsedSources.high;
        video.setAttribute('data-current-source', 'high');
      } else {
        // No source change needed
        return;
      }

      video.src = `${source}`;
      video.classList.remove('hidden');
    });
  };

  init();
  
})();
