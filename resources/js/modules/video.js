(function () {

  const selectors = {
    video: '[data-video]',
    lazy: '[data-video-lazy]',
  };

  const breakpoint = 768;

  const init = () => {
    lazyLoad(); // Initialize lazy loading
  }

  // const init = () => {
  //   // if no video elements are found, return
  //   const videos = document.querySelectorAll(selectors.video);
  //   if (videos.length === 0) {
  //     return;
  //   }
  //   videos.forEach(video => {
  //     video.setAttribute('data-current-source', 'low');
  //   });
  //   load();
  //   window.addEventListener('resize', resize);
  //   lazyLoad(); // Initialize lazy loading
  // };

  // const resize = () => {
  //   const width = window.innerWidth;
  //   load(width);
  // };

  // const load = (width = window.innerWidth) => {
  //   const videos = document.querySelectorAll(selectors.video);

  //   videos.forEach((video) => {
  //     // get 'data-video-source' attribute
  //     const sources = video.getAttribute('data-video-source');

  //     // parse the source into an object
  //     const parsedSources = JSON.parse(sources);

  //     // get current source from the video's data attribute
  //     let currentSource = video.getAttribute('data-current-source');
  //     let source;

  //     if (width < breakpoint && currentSource !== 'low') {
  //       source = parsedSources.low;
  //       video.setAttribute('data-current-source', 'low');
  //     } 
  //     else if (width >= breakpoint && currentSource !== 'high') {
  //       source = parsedSources.high;
  //       video.setAttribute('data-current-source', 'high');
  //     } else {
  //       // No source change needed
  //       return;
  //     }

  //     video.src = `${source}`;
  //     video.classList.remove('hidden');
  //   });
  // };

  const lazyLoad = () => {
    let lazyVideos = [...document.querySelectorAll(selectors.lazy)];

    if ("IntersectionObserver" in window) {
      let lazyVideoObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(video) {
          if (video.isIntersecting) {
            for (let source in video.target.children) {
              let videoSource = video.target.children[source];
              if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
                videoSource.src = videoSource.dataset.src;
              }
            }

            video.target.load();
            // remove attribute to prevent loading the video multiple times
            video.target.removeAttribute('data-video-lazy');
            lazyVideoObserver.unobserve(video.target);
          }
        });
      });

      lazyVideos.forEach(function(lazyVideo) {
        lazyVideoObserver.observe(lazyVideo);
      });
    }
  };

  init();
  
})();
