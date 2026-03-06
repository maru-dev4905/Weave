export function debounce(fn, wait = 300) {
  let timeoutId = null;

  return function debounced(...args) {
    const context = this;

    clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
}
