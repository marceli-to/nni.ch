(function () {

  const selectors = {
    video: '[data-video]',
    lazy: '[data-video-lazy]',
  };

  const breakpoint = 768;

  const init = () => {
    lazyLoad();
  }

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
