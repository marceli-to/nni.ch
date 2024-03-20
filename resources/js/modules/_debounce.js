const debounce = (func, delay) => {
  let debounceTimer;
  return function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      func();
    }, delay);
  };
};
export default debounce;

