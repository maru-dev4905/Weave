const DEFAULT_OPTIONS = {
  selector: '[data-weave-scroll-target], .weave_scroll_to, .wv_scr_btn',
  defaultDuration: 500,
  defaultEasing: 'swing',
  headerSelector: '.hd_offset',
};

export function scrollToPlugin(userOptions = {}) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...userOptions,
  };

  return {
    name: 'scrollTo',

    setup(ctx) {
      ctx.logger.log('scrollTo plugin setup');
    },

    scan(ctx) {
      return Array.from(ctx.root.querySelectorAll(options.selector));
    },

    mount(ctx, el) {
      const offClick = ctx.events.listen(el, 'click', (event) => {
        event.preventDefault();

        const config = readScrollConfig(el, options);
        const targetEl = resolveTarget(config.target);

        if (!targetEl) {
          ctx.logger.warn(`scroll target not found: ${config.target || '(empty)'}`);
          return;
        }

        const container = resolveContainer(config.container);
        if (!container) {
          ctx.logger.warn(`scroll container not found: ${config.container}`);
          return;
        }

        animateScroll(container, targetEl, config, options);
      });

      return {
        cleanups: [offClick],
      };
    },

    unmount(ctx, el, instance) {
      instance?.cleanups?.forEach((cleanup) => cleanup?.());
      ctx.logger.log('scrollTo plugin unmounted', el);
    },

    teardown(ctx) {
      ctx.logger.log('scrollTo plugin teardown');
    },
  };
}

function readScrollConfig(el, options) {
  const target =
    el.dataset.weaveScrollTarget ||
    el.getAttribute('data-weave-scroll-target') ||
    el.dataset.scrTarget ||
    el.getAttribute('data-scr-target') ||
    '';

  const container =
    el.dataset.weaveScrollContainer ||
    el.getAttribute('data-weave-scroll-container') ||
    el.dataset.scrEl ||
    el.getAttribute('data-scr-el') ||
    '';

  return {
    target,
    container,
    centered: parseBoolean(
      el.dataset.weaveScrollCenter ||
        el.getAttribute('data-weave-scroll-center') ||
        el.dataset.centered ||
        el.getAttribute('data-centered'),
    ),
    useHeaderOffset: parseBoolean(
      el.dataset.weaveScrollOffset ||
        el.getAttribute('data-weave-scroll-offset') ||
        el.dataset.scrOffset ||
        el.getAttribute('data-scr-offset'),
    ),
    duration: parseInteger(
      el.dataset.weaveScrollDuration ||
        el.getAttribute('data-weave-scroll-duration') ||
        el.dataset.scrSpeed ||
        el.getAttribute('data-scr-speed'),
      options.defaultDuration,
    ),
    easing:
      el.dataset.weaveScrollEasing ||
      el.getAttribute('data-weave-scroll-easing') ||
      el.dataset.scrEasing ||
      el.getAttribute('data-scr-easing') ||
      options.defaultEasing,
  };
}

function resolveTarget(target) {
  if (!target) return null;

  if (target.startsWith('#')) {
    return document.querySelector(target);
  }

  return document.getElementById(target) || document.querySelector(target);
}

function resolveContainer(container) {
  if (!container) {
    return window;
  }

  if (container === 'window') {
    return window;
  }

  if (container.startsWith('#')) {
    return document.querySelector(container);
  }

  return document.getElementById(container) || document.querySelector(container);
}

function animateScroll(container, targetEl, config, options) {
  const isWindow = container === window;
  const startY = isWindow ? window.pageYOffset : container.scrollTop;
  const viewportHeight = isWindow ? window.innerHeight : container.clientHeight;
  const maxScroll = isWindow
    ? Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - viewportHeight
    : container.scrollHeight - viewportHeight;
  const currentScrollTop = isWindow ? window.pageYOffset : container.scrollTop;
  const rect = targetEl.getBoundingClientRect();
  const containerRect = isWindow
    ? { top: 0 }
    : container.getBoundingClientRect();
  const targetTop = isWindow
    ? currentScrollTop + rect.top
    : currentScrollTop + (rect.top - containerRect.top);

  const offset = config.useHeaderOffset ? getHeaderOffset(options) : 0;

  let endY;

  if (config.centered) {
    const targetCenter = targetTop + rect.height / 2;
    const visualCenter = offset ? offset + (viewportHeight - offset) / 2 : viewportHeight / 2;
    endY = targetCenter - visualCenter;
  } else {
    endY = targetTop - offset;
  }

  const safeEndY = Math.max(0, Math.min(endY, Math.max(maxScroll, 0)));
  const duration = Math.max(0, config.duration);

  if (duration === 0) {
    setScrollTop(container, safeEndY);
    return;
  }

  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = ease(progress, config.easing);
    const nextY = startY + (safeEndY - startY) * eased;

    setScrollTop(container, nextY);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}

function getHeaderOffset(options) {
  const header = document.querySelector(options.headerSelector);
  return header?.offsetHeight || 0;
}

function setScrollTop(container, value) {
  if (container === window) {
    window.scrollTo(0, value);
    return;
  }

  container.scrollTop = value;
}

function ease(progress, easing) {
  if (easing === 'linear') {
    return progress;
  }

  return 0.5 - Math.cos(progress * Math.PI) / 2;
}

function parseBoolean(value) {
  if (value === '' || value === 'true' || value === '1') {
    return true;
  }

  return false;
}

function parseInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}
