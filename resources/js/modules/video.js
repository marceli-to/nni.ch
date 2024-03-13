(function () {

  const selectors = {
    video: '[data-video]',
  };

  let currentSource = 'low';

  const init = () => {
    // if the video element is not found, return
    if (!document.querySelector(selectors.video)) {
      return;
    }
    load();
    window.addEventListener('resize', resize);
  };

  const resize = () => {
    // on resize switch the video source depending on the screen size. keep the video playing
    const video = document.querySelector(selectors.video);
    const current = video.currentTime;

    // Only change source if the width crosses a defined threshold
    const width = window.innerWidth;

    if ((width < 768 && currentSource !== 'low') || (width >= 768 && currentSource !== 'high')) {
      load(current);
    }
  };

  const load = (current = 0) => {
    // get the video element
    const video = document.querySelector(selectors.video);

    // get 'data-video-source' attribute
    const sources = video.getAttribute('data-video-source');

    // parse the source into an object
    const parsedSources = JSON.parse(sources);

    // set the video source depending on the screen size
    const width = window.innerWidth;
    let source;
    
    if (width < 768 && currentSource !== 'low') {
      source = parsedSources.low;
      currentSource = 'low';
    } 
    else if (width >= 768 && currentSource !== 'high') {
      source = parsedSources.high;
      currentSource = 'high';
    } else {
      // No source change needed
      return;
    }
    
    video.src = `/assets/${source}`;

    // move the video to the currentTime
    video.currentTime = current;

    // remove class 'hidden' from the video element
    video.classList.remove('hidden');
  };

  // init();
  
})();
