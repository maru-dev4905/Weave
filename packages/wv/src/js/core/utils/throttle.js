export function throttle(fn, wait = 300) {
  let isThrottled = false;

  return function throttled(...args) {
    if (isThrottled) return;

    const context = this;

    isThrottled = true;
    fn.apply(context, args);

    window.setTimeout(() => {
      isThrottled = false;
    }, wait);
  };
}
