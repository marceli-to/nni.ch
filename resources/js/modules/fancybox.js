import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

document.addEventListener('DOMContentLoaded', function() {
  Fancybox.bind('[data-fancybox]', {
    hideScrollbar: false,
    Images: {
      zoom: false,
    },
    Thumbs: false,
    Toolbar: {
      display: {
        left: [],
        middle: [],
        right: ['close'],
      },
    },
    caption: function (fancybox, slide) {
      const legend = slide.triggerEl?.querySelector("legend");
      const caption = legend ? legend.innerHTML : slide.caption || "";
      const index = `${slide.index + 1} | ${fancybox.carousel?.slides.length}`;
      return  `<div class="text-xs sm:text-sm lg:text-md flex gap-x-10 lg:gap-x-15 mt-7"><div>${index}</div><div>${caption}</div>`;
    },
  });
});