(function () {

  const selectors = {
    btn: '[data-gdpr-btn]',
    banner: '[data-gdpr-banner]',
  };

  const init = () => {
    document.querySelector(selectors.btn).addEventListener('click', accept);

    const globalConsent = localStorage.getItem('global_consent');
    if (!globalConsent) {
      document.querySelector(selectors.banner).classList.remove('hidden');
      return;
    }  
  };

  const accept = () => {
    localStorage.setItem('global_consent', 'true');
    document.querySelector(selectors.btn).remove();
    document.querySelector(selectors.banner).remove();
  };
  init();
})();


