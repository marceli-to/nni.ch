/**
 * Returns a debounced version of `fn` that delays invocation until `delay`ms
 * have elapsed since the last call. Arguments and `this` are forwarded.
 */
const debounce = (fn, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};

export default debounce;
