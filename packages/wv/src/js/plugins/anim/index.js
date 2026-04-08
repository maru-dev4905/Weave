import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const FADE_DEFAULT_OPTIONS = {
  selector:
    '[data-weave-anim="fade"], [data-weave-anim][data-weave-anim-type="fade"], .weave_anim_fade, .wv_anim_fade',
  fadeDirection: 'up',
  fadeDuration: 0.4,
  fadeDelay: 0,
  fadeDistance: 48,
  fadeTrigger: true,
  fadeScrub: false,
  fadeOnce: false,
  fadeStart: 'top 85%',
  fadeEnd: 'top 35%',
  fadeEase: 'power2.out',
};

const MARQUEE_DEFAULT_OPTIONS = {
  selector:
    '[data-weave-anim="marquee"], [data-weave-anim][data-weave-anim-type="marquee"], .weave_anim_marquee, .wv_anim_marquee',
  marqueeDirection: 'left',
  marqueeSpeed: 80,
  marqueeGap: 32,
};

const TICKER_DEFAULT_OPTIONS = {
  selector:
    '[data-weave-anim="ticker"], [data-weave-anim][data-weave-anim-type="ticker"], .weave_anim_ticker, .wv_anim_ticker',
  tickerDirection: 'left',
  tickerSpeed: 96,
  tickerGap: 40,
  tickerPause: true,
};

const CASCADE_DEFAULT_OPTIONS = {
  selector:
    '[data-weave-anim="cascade"], [data-weave-anim][data-weave-anim-type="cascade"], .weave_anim_cascade, .wv_anim_cascade',
  cascadeChildren: '',
  cascadeDirection: 'up',
  cascadeDuration: 0.5,
  cascadeDelay: 0,
  cascadeStagger: 0.12,
  cascadeDistance: 32,
  cascadeTrigger: true,
  cascadeOnce: false,
  cascadeStart: 'top 85%',
  cascadeEase: 'power2.out',
};

const PARALLAX_DEFAULT_OPTIONS = {
  selector:
    '[data-weave-anim="parallax"], [data-weave-anim][data-weave-anim-type="parallax"], .weave_anim_parallax, .wv_anim_parallax',
  parallaxDirection: 'up',
  parallaxSpeed: 0.2,
  parallaxDistance: 80,
  parallaxStart: 'top bottom',
  parallaxEnd: 'bottom top',
  responsive: {
    disableBelow: 768,
  },
};

const COUNT_DEFAULT_OPTIONS = {
  selector:
    '[data-weave-anim="count"], [data-weave-anim][data-weave-anim-type="count"], .weave_anim_count, .wv_anim_count',
  countFrom: 0,
  countDuration: 1.2,
  countDecimals: 0,
  countPrefix: '',
  countSuffix: '',
  countSeparator: false,
  countTrigger: true,
  countOnce: true,
  countStart: 'top 85%',
  countEase: 'power2.out',
};

let isGsapRegistered = false;

function createFadePlugin(userOptions = {}) {
  const options = {
    ...FADE_DEFAULT_OPTIONS,
    ...userOptions,
  };

  return {
    name: 'animFade',

    setup(ctx) {
      ensureGsapPlugins();
      ctx.logger.log('anim fade plugin setup');
    },

    scan(ctx) {
      return Array.from(ctx.root.querySelectorAll(options.selector));
    },

    mount(ctx, el) {
      const config = readFadeConfig(el, options);
      return mountFade(ctx, el, config);
    },

    unmount(ctx, el, instance) {
      instance?.animation?.scrollTrigger?.kill();
      instance?.animation?.kill();
      gsap.set(el, {
        clearProps: 'opacity,transform,willChange',
      });
      ctx.logger.log('anim fade plugin unmounted', el);
    },

    teardown(ctx) {
      ctx.logger.log('anim fade plugin teardown');
    },
  };
}

function createMarqueePlugin(userOptions = {}) {
  const options = {
    ...MARQUEE_DEFAULT_OPTIONS,
    ...userOptions,
  };

  return {
    name: 'animMarquee',

    setup(ctx) {
      ensureGsapPlugins();
      ctx.logger.log('anim marquee plugin setup');
    },

    scan(ctx) {
      return Array.from(ctx.root.querySelectorAll(options.selector));
    },

    mount(ctx, el) {
      const config = readMarqueeConfig(el, options);
      return mountMarquee(ctx, el, config);
    },

    unmount(ctx, el, instance) {
      instance?.animation?.kill();
      instance?.offResize?.();

      if (typeof instance?.resizeFrame === 'number') {
        cancelAnimationFrame(instance.resizeFrame);
      }

      if (typeof instance?.originalStyle === 'string') {
        el.setAttribute('style', instance.originalStyle);
      } else {
        el.removeAttribute('style');
      }

      if (typeof instance?.originalHtml === 'string') {
        el.innerHTML = instance.originalHtml;
      }

      ctx.logger.log('anim marquee plugin unmounted', el);
    },

    teardown(ctx) {
      ctx.logger.log('anim marquee plugin teardown');
    },
  };
}

function createTickerPlugin(userOptions = {}) {
  const options = {
    ...TICKER_DEFAULT_OPTIONS,
    ...userOptions,
  };

  return {
    name: 'animTicker',

    setup(ctx) {
      ensureGsapPlugins();
      ctx.logger.log('anim ticker plugin setup');
    },

    scan(ctx) {
      return Array.from(ctx.root.querySelectorAll(options.selector));
    },

    mount(ctx, el) {
      const config = readTickerConfig(el, options);
      return mountTicker(ctx, el, config);
    },

    unmount(ctx, el, instance) {
      instance?.animation?.kill();
      instance?.offResize?.();
      instance?.offMouseEnter?.();
      instance?.offMouseLeave?.();

      if (typeof instance?.resizeFrame === 'number') {
        cancelAnimationFrame(instance.resizeFrame);
      }

      restoreInlineStyle(el, instance?.originalStyle);

      if (typeof instance?.originalHtml === 'string') {
        el.innerHTML = instance.originalHtml;
      }

      ctx.logger.log('anim ticker plugin unmounted', el);
    },

    teardown(ctx) {
      ctx.logger.log('anim ticker plugin teardown');
    },
  };
}

function createCascadePlugin(userOptions = {}) {
  const options = {
    ...CASCADE_DEFAULT_OPTIONS,
    ...userOptions,
  };

  return {
    name: 'animCascade',

    setup(ctx) {
      ensureGsapPlugins();
      ctx.logger.log('anim cascade plugin setup');
    },

    scan(ctx) {
      return Array.from(ctx.root.querySelectorAll(options.selector));
    },

    mount(ctx, el) {
      const config = readCascadeConfig(el, options);
      return mountCascade(ctx, el, config);
    },

    unmount(ctx, el, instance) {
      instance?.animation?.scrollTrigger?.kill();
      instance?.animation?.kill();

      if (instance?.targets?.length) {
        gsap.set(instance.targets, {
          clearProps: 'opacity,transform,willChange',
        });
      }

      ctx.logger.log('anim cascade plugin unmounted', el);
    },

    teardown(ctx) {
      ctx.logger.log('anim cascade plugin teardown');
    },
  };
}

function createParallaxPlugin(userOptions = {}) {
  const options = {
    ...PARALLAX_DEFAULT_OPTIONS,
    ...userOptions,
    responsive: {
      ...PARALLAX_DEFAULT_OPTIONS.responsive,
      ...userOptions.responsive,
    },
  };

  return {
    name: 'animParallax',

    setup(ctx) {
      ensureGsapPlugins();
      ctx.logger.log('anim parallax plugin setup');
    },

    scan(ctx) {
      return Array.from(ctx.root.querySelectorAll(options.selector));
    },

    mount(ctx, el) {
      const config = readParallaxConfig(el, options);
      return mountParallax(ctx, el, config);
    },

    unmount(ctx, el, instance) {
      instance?.animation?.scrollTrigger?.kill();
      instance?.animation?.kill();
      instance?.offResize?.();

      if (typeof instance?.resizeFrame === 'number') {
        cancelAnimationFrame(instance.resizeFrame);
      }

      restoreInlineStyle(el, instance?.originalStyle);
      ctx.logger.log('anim parallax plugin unmounted', el);
    },

    teardown(ctx) {
      ctx.logger.log('anim parallax plugin teardown');
    },
  };
}

function createCountPlugin(userOptions = {}) {
  const options = {
    ...COUNT_DEFAULT_OPTIONS,
    ...userOptions,
  };

  return {
    name: 'animCount',

    setup(ctx) {
      ensureGsapPlugins();
      ctx.logger.log('anim count plugin setup');
    },

    scan(ctx) {
      return Array.from(ctx.root.querySelectorAll(options.selector));
    },

    mount(ctx, el) {
      const config = readCountConfig(el, options);
      return mountCount(ctx, el, config);
    },

    unmount(ctx, el, instance) {
      instance?.animation?.scrollTrigger?.kill();
      instance?.animation?.kill();

      if (typeof instance?.originalText === 'string') {
        el.textContent = instance.originalText;
      }

      ctx.logger.log('anim count plugin unmounted', el);
    },

    teardown(ctx) {
      ctx.logger.log('anim count plugin teardown');
    },
  };
}

export const animPlugin = {
  fadeAnim: createFadePlugin,
  parallaxAnim: createParallaxPlugin,
  marqueeAnim: createMarqueePlugin,
  tickerAnim: createTickerPlugin,
  cascadeAnim: createCascadePlugin,
  countAnim: createCountPlugin,
};

function ensureGsapPlugins() {
  if (isGsapRegistered) return;
  gsap.registerPlugin(ScrollTrigger);
  isGsapRegistered = true;
}

function mountFade(ctx, el, config) {
  const { x, y } = getFadeOffset(config.direction, config.distance);
  gsap.set(el, {
    opacity: 0,
    x,
    y,
    willChange: 'transform, opacity',
  });

  let animation;

  if (config.scrub) {
    animation = gsap.to(el, {
      opacity: 1,
      x: 0,
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: config.start,
        end: config.end,
        scrub: true,
      },
    });
  } else if (config.trigger) {
    animation = gsap.to(el, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: config.duration,
      delay: config.delay,
      ease: config.ease,
      scrollTrigger: config.once
        ? {
            trigger: el,
            start: config.start,
            once: true,
          }
        : {
            trigger: el,
            start: config.start,
            toggleActions: 'play none none reverse',
          },
    });
  } else {
    animation = gsap.to(el, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: config.duration,
      delay: config.delay,
      ease: config.ease,
    });
  }

  return {
    type: 'fade',
    animation,
  };
}

function mountMarquee(ctx, el, config) {
  if (!el.childNodes.length) {
    ctx.logger.warn('anim marquee content not found', el);
    return null;
  }

  const originalHtml = el.innerHTML;
  const originalStyle = el.getAttribute('style');
  let animation = null;
  let resizeFrame = null;

  const build = () => {
    animation?.kill();
    el.innerHTML = originalHtml;

    const sourceNodes = Array.from(el.childNodes).map((node) =>
      node.cloneNode(true),
    );

    if (!sourceNodes.length) {
      return;
    }

    const singleContent = document.createElement('div');
    singleContent.className = 'weave_anim_group';
    singleContent.style.display = 'flex';
    singleContent.style.flexShrink = '0';
    singleContent.style.alignItems = 'center';
    singleContent.style.gap = `${config.gap}px`;

    sourceNodes.forEach((node) => {
      singleContent.appendChild(node.cloneNode(true));
    });

    const track = document.createElement('div');
    track.className = 'weave_anim_track';
    track.style.display = 'flex';
    track.style.alignItems = 'center';
    track.style.width = 'max-content';
    track.style.gap = `${config.gap}px`;
    track.style.flexWrap = 'nowrap';
    track.appendChild(singleContent);

    const viewport = document.createElement('div');
    viewport.className = 'weave_anim_viewport';
    viewport.style.display = 'flex';
    viewport.style.width = '100%';
    viewport.style.overflow = 'hidden';

    el.innerHTML = '';
    el.style.overflow = 'hidden';
    el.appendChild(viewport);
    viewport.appendChild(track);

    const viewportWidth = viewport.getBoundingClientRect().width;
    const singleWidth = Math.max(singleContent.getBoundingClientRect().width, 1);
    const requiredCopies = Math.max(3, Math.ceil((viewportWidth * 2) / singleWidth) + 1);

    for (let index = 1; index < requiredCopies; index += 1) {
      const duplicateContent = singleContent.cloneNode(true);
      track.appendChild(duplicateContent);
    }

    const distance = singleWidth + config.gap;
    const duration = distance / Math.max(config.speed, 1);
    const fromX = config.direction === 'right' ? -distance : 0;
    const toX = config.direction === 'right' ? 0 : -distance;

    gsap.set(track, { x: fromX });
    animation = gsap.to(track, {
      x: toX,
      duration,
      ease: 'none',
      repeat: -1,
    });
  };

  build();

  const offResize = ctx.events.listen(window, 'resize', () => {
    if (resizeFrame) {
      cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = requestAnimationFrame(() => {
      build();
      resizeFrame = null;
    });
  });

  return {
    type: 'marquee',
    animation,
    offResize,
    originalHtml,
    originalStyle,
    resizeFrame,
  };
}

function mountTicker(ctx, el, config) {
  if (!el.childNodes.length) {
    ctx.logger.warn('anim ticker content not found', el);
    return null;
  }

  const originalHtml = el.innerHTML;
  const originalStyle = el.getAttribute('style');
  let animation = null;
  let resizeFrame = null;

  const build = () => {
    animation?.kill();
    el.innerHTML = originalHtml;
    restoreInlineStyle(el, originalStyle);

    const sourceNodes = Array.from(el.childNodes).map((node) => node.cloneNode(true));

    if (!sourceNodes.length) {
      return;
    }

    const singleContent = document.createElement('div');
    singleContent.className = 'weave_anim_ticker_group';
    singleContent.style.display = 'inline-flex';
    singleContent.style.flexShrink = '0';
    singleContent.style.alignItems = 'center';
    singleContent.style.gap = `${config.gap}px`;
    singleContent.style.whiteSpace = 'nowrap';

    sourceNodes.forEach((node) => {
      singleContent.appendChild(node.cloneNode(true));
    });

    const track = document.createElement('div');
    track.className = 'weave_anim_ticker_track';
    track.style.display = 'flex';
    track.style.alignItems = 'center';
    track.style.width = 'max-content';
    track.style.gap = `${config.gap}px`;
    track.style.flexWrap = 'nowrap';
    track.appendChild(singleContent);

    const viewport = document.createElement('div');
    viewport.className = 'weave_anim_ticker_viewport';
    viewport.style.display = 'flex';
    viewport.style.width = '100%';
    viewport.style.overflow = 'hidden';

    el.innerHTML = '';
    el.style.overflow = 'hidden';
    el.appendChild(viewport);
    viewport.appendChild(track);

    const viewportWidth = viewport.getBoundingClientRect().width;
    const singleWidth = Math.max(singleContent.getBoundingClientRect().width, 1);
    const requiredCopies = Math.max(3, Math.ceil((viewportWidth * 2) / singleWidth) + 1);

    for (let index = 1; index < requiredCopies; index += 1) {
      track.appendChild(singleContent.cloneNode(true));
    }

    const distance = singleWidth + config.gap;
    const duration = distance / Math.max(config.speed, 1);
    const fromX = config.direction === 'right' ? -distance : 0;
    const toX = config.direction === 'right' ? 0 : -distance;

    gsap.set(track, { x: fromX });
    animation = gsap.to(track, {
      x: toX,
      duration,
      ease: 'none',
      repeat: -1,
    });
  };

  build();

  const offResize = ctx.events.listen(window, 'resize', () => {
    if (resizeFrame) {
      cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = requestAnimationFrame(() => {
      build();
      resizeFrame = null;
    });
  });

  const offMouseEnter = config.pause
    ? ctx.events.listen(el, 'mouseenter', () => {
        animation?.pause();
      })
    : null;

  const offMouseLeave = config.pause
    ? ctx.events.listen(el, 'mouseleave', () => {
        animation?.resume();
      })
    : null;

  return {
    type: 'ticker',
    animation,
    offResize,
    offMouseEnter,
    offMouseLeave,
    originalHtml,
    originalStyle,
    resizeFrame,
  };
}

function mountCascade(ctx, el, config) {
  const targets = getCascadeTargets(ctx, el, config.children);

  if (!targets.length) {
    ctx.logger.warn('anim cascade targets not found', el);
    return null;
  }

  const { x, y } = getFadeOffset(config.direction, config.distance);

  gsap.set(targets, {
    opacity: 0,
    x,
    y,
    willChange: 'transform, opacity',
  });

  let animation;

  if (config.trigger) {
    animation = gsap.to(targets, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: config.duration,
      delay: config.delay,
      stagger: config.stagger,
      ease: config.ease,
      scrollTrigger: config.once
        ? {
            trigger: el,
            start: config.start,
            once: true,
          }
        : {
            trigger: el,
            start: config.start,
            toggleActions: 'play none none reverse',
          },
    });
  } else {
    animation = gsap.to(targets, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: config.duration,
      delay: config.delay,
      stagger: config.stagger,
      ease: config.ease,
    });
  }

  return {
    type: 'cascade',
    animation,
    targets,
  };
}

function mountParallax(ctx, el, config) {
  const instance = {
    type: 'parallax',
    animation: null,
    offResize: null,
    originalStyle: el.getAttribute('style'),
    resizeFrame: null,
  };

  const build = () => {
    instance.animation?.scrollTrigger?.kill();
    instance.animation?.kill();
    instance.animation = null;
    restoreInlineStyle(el, instance.originalStyle);

    if (shouldDisableParallax(config.responsive)) {
      return;
    }

    const distance = getParallaxDistance(config.distance, config.speed);
    const fromY = config.direction === 'down' ? -distance : distance;
    const toY = config.direction === 'down' ? distance : -distance;

    instance.animation = gsap.fromTo(
      el,
      {
        y: fromY,
        willChange: 'transform',
      },
      {
        y: toY,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: config.start,
          end: config.end,
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
  };

  build();

  instance.offResize = ctx.events.listen(window, 'resize', () => {
    if (instance.resizeFrame) {
      cancelAnimationFrame(instance.resizeFrame);
    }

    instance.resizeFrame = requestAnimationFrame(() => {
      build();
      instance.resizeFrame = null;
    });
  });

  return instance;
}

function mountCount(ctx, el, config) {
  const originalText = el.textContent || '';
  const state = { value: config.from };

  const render = (value) => {
    el.textContent = formatCountValue(value, config);
  };

  render(config.from);

  let animation;

  if (config.trigger) {
    animation = gsap.to(state, {
      value: config.to,
      duration: config.duration,
      ease: config.ease,
      paused: true,
      onUpdate: () => {
        render(state.value);
      },
      scrollTrigger: config.once
        ? {
            trigger: el,
            start: config.start,
            once: true,
            onEnter: () => {
              animation.restart(true);
            },
          }
        : {
            trigger: el,
            start: config.start,
            onEnter: () => {
              animation.restart(true);
            },
            onLeaveBack: () => {
              animation.pause(0);
              state.value = config.from;
              render(config.from);
            },
          },
    });
  } else {
    animation = gsap.to(state, {
      value: config.to,
      duration: config.duration,
      ease: config.ease,
      onUpdate: () => {
        render(state.value);
      },
    });
  }

  return {
    type: 'count',
    animation,
    originalText,
  };
}

function readFadeConfig(el, options) {
  return {
    direction: getFadeDirection(
      el.dataset.weaveAnimDirection ||
        el.getAttribute('data-weave-anim-direction'),
      options.fadeDirection,
    ),
    duration: parseNumber(
      el.dataset.weaveAnimDuration ||
        el.getAttribute('data-weave-anim-duration'),
      options.fadeDuration,
    ),
    delay: parseNumber(
      el.dataset.weaveAnimDelay ||
        el.getAttribute('data-weave-anim-delay'),
      options.fadeDelay,
    ),
    distance: parseNumber(
      el.dataset.weaveAnimDistance ||
        el.getAttribute('data-weave-anim-distance'),
      options.fadeDistance,
    ),
    trigger: parseBoolean(
      el.dataset.weaveAnimTrigger ||
        el.getAttribute('data-weave-anim-trigger'),
      options.fadeTrigger,
    ),
    scrub: parseBoolean(
      el.dataset.weaveAnimScrub ||
        el.getAttribute('data-weave-anim-scrub'),
      options.fadeScrub,
    ),
    once: parseBoolean(
      el.dataset.weaveAnimOnce ||
        el.getAttribute('data-weave-anim-once'),
      options.fadeOnce,
    ),
    start:
      el.dataset.weaveAnimStart ||
      el.getAttribute('data-weave-anim-start') ||
      options.fadeStart,
    end:
      el.dataset.weaveAnimEnd ||
      el.getAttribute('data-weave-anim-end') ||
      options.fadeEnd,
    ease:
      el.dataset.weaveAnimEase ||
      el.getAttribute('data-weave-anim-ease') ||
      options.fadeEase,
  };
}

function readMarqueeConfig(el, options) {
  return {
    direction: getMarqueeDirection(
      el.dataset.weaveAnimDirection ||
        el.getAttribute('data-weave-anim-direction'),
      options.marqueeDirection,
    ),
    speed: parseNumber(
      el.dataset.weaveAnimSpeed ||
        el.getAttribute('data-weave-anim-speed'),
      options.marqueeSpeed,
    ),
    gap: parseNumber(
      el.dataset.weaveAnimGap ||
        el.getAttribute('data-weave-anim-gap'),
      options.marqueeGap,
    ),
  };
}

function readTickerConfig(el, options) {
  return {
    direction: getMarqueeDirection(
      el.dataset.weaveAnimDirection ||
        el.getAttribute('data-weave-anim-direction'),
      options.tickerDirection,
    ),
    speed: parseNumber(
      el.dataset.weaveAnimSpeed ||
        el.getAttribute('data-weave-anim-speed'),
      options.tickerSpeed,
    ),
    gap: parseNumber(
      el.dataset.weaveAnimGap ||
        el.getAttribute('data-weave-anim-gap'),
      options.tickerGap,
    ),
    pause: parseBoolean(
      el.dataset.weaveAnimPause ||
        el.getAttribute('data-weave-anim-pause'),
      options.tickerPause,
    ),
  };
}

function readCascadeConfig(el, options) {
  return {
    children:
      el.dataset.weaveAnimChildren ||
      el.getAttribute('data-weave-anim-children') ||
      options.cascadeChildren,
    direction: getFadeDirection(
      el.dataset.weaveAnimDirection ||
        el.getAttribute('data-weave-anim-direction'),
      options.cascadeDirection,
    ),
    duration: parseNumber(
      el.dataset.weaveAnimDuration ||
        el.getAttribute('data-weave-anim-duration'),
      options.cascadeDuration,
    ),
    delay: parseNumber(
      el.dataset.weaveAnimDelay ||
        el.getAttribute('data-weave-anim-delay'),
      options.cascadeDelay,
    ),
    stagger: parseNumber(
      el.dataset.weaveAnimStagger ||
        el.getAttribute('data-weave-anim-stagger'),
      options.cascadeStagger,
    ),
    distance: parseNumber(
      el.dataset.weaveAnimDistance ||
        el.getAttribute('data-weave-anim-distance'),
      options.cascadeDistance,
    ),
    trigger: parseBoolean(
      el.dataset.weaveAnimTrigger ||
        el.getAttribute('data-weave-anim-trigger'),
      options.cascadeTrigger,
    ),
    once: parseBoolean(
      el.dataset.weaveAnimOnce ||
        el.getAttribute('data-weave-anim-once'),
      options.cascadeOnce,
    ),
    start:
      el.dataset.weaveAnimStart ||
      el.getAttribute('data-weave-anim-start') ||
      options.cascadeStart,
    ease:
      el.dataset.weaveAnimEase ||
      el.getAttribute('data-weave-anim-ease') ||
      options.cascadeEase,
  };
}

function readParallaxConfig(el, options) {
  return {
    direction: getParallaxDirection(
      el.dataset.weaveAnimDirection ||
        el.getAttribute('data-weave-anim-direction'),
      options.parallaxDirection,
    ),
    speed: parseNumber(
      el.dataset.weaveAnimSpeed ||
        el.getAttribute('data-weave-anim-speed'),
      options.parallaxSpeed,
    ),
    distance: parseNumber(
      el.dataset.weaveAnimDistance ||
        el.getAttribute('data-weave-anim-distance'),
      options.parallaxDistance,
    ),
    start:
      el.dataset.weaveAnimStart ||
      el.getAttribute('data-weave-anim-start') ||
      options.parallaxStart,
    end:
      el.dataset.weaveAnimEnd ||
      el.getAttribute('data-weave-anim-end') ||
      options.parallaxEnd,
    responsive: options.responsive,
  };
}

function readCountConfig(el, options) {
  const originalText = el.textContent || '';
  const parsedTarget = parseNumericText(originalText);

  const to = parseNumber(
    el.dataset.weaveAnimTo ||
      el.getAttribute('data-weave-anim-to'),
    Number.isNaN(parsedTarget) ? options.countFrom : parsedTarget,
  );

  return {
    from: parseNumber(
      el.dataset.weaveAnimFrom ||
        el.getAttribute('data-weave-anim-from'),
      options.countFrom,
    ),
    to,
    duration: parseNumber(
      el.dataset.weaveAnimDuration ||
        el.getAttribute('data-weave-anim-duration'),
      options.countDuration,
    ),
    decimals: parseInteger(
      el.dataset.weaveAnimDecimals ||
        el.getAttribute('data-weave-anim-decimals'),
      options.countDecimals,
    ),
    prefix:
      el.dataset.weaveAnimPrefix ||
      el.getAttribute('data-weave-anim-prefix') ||
      options.countPrefix,
    suffix:
      el.dataset.weaveAnimSuffix ||
      el.getAttribute('data-weave-anim-suffix') ||
      options.countSuffix,
    separator: parseBoolean(
      el.dataset.weaveAnimSeparator ||
        el.getAttribute('data-weave-anim-separator'),
      options.countSeparator,
    ),
    trigger: parseBoolean(
      el.dataset.weaveAnimTrigger ||
        el.getAttribute('data-weave-anim-trigger'),
      options.countTrigger,
    ),
    once: parseBoolean(
      el.dataset.weaveAnimOnce ||
        el.getAttribute('data-weave-anim-once'),
      options.countOnce,
    ),
    start:
      el.dataset.weaveAnimStart ||
      el.getAttribute('data-weave-anim-start') ||
      options.countStart,
    ease:
      el.dataset.weaveAnimEase ||
      el.getAttribute('data-weave-anim-ease') ||
      options.countEase,
  };
}

function getFadeDirection(value, fallback) {
  const direction = (value || fallback || 'up').trim().toLowerCase();
  return ['up', 'down', 'left', 'right'].includes(direction) ? direction : fallback;
}

function getMarqueeDirection(value, fallback) {
  const direction = (value || fallback || 'left').trim().toLowerCase();
  return ['left', 'right'].includes(direction) ? direction : fallback;
}

function getParallaxDirection(value, fallback) {
  const direction = (value || fallback || 'up').trim().toLowerCase();
  return ['up', 'down'].includes(direction) ? direction : fallback;
}

function getFadeOffset(direction, distance) {
  switch (direction) {
    case 'down':
      return { x: 0, y: -distance };
    case 'left':
      return { x: distance, y: 0 };
    case 'right':
      return { x: -distance, y: 0 };
    case 'up':
    default:
      return { x: 0, y: distance };
  }
}

function getCascadeTargets(ctx, el, selector) {
  if (!selector) {
    return Array.from(el.children);
  }

  try {
    return Array.from(el.querySelectorAll(selector));
  } catch (error) {
    ctx.logger.warn('anim cascade selector is invalid', selector, error);
    return [];
  }
}

function getParallaxDistance(distance, speed) {
  return Math.max(0, distance) * Math.max(0, speed);
}

function shouldDisableParallax(responsive) {
  if (typeof window === 'undefined') {
    return false;
  }

  const breakpoint = responsive?.disableBelow;

  if (typeof breakpoint !== 'number' || Number.isNaN(breakpoint)) {
    return false;
  }

  return window.innerWidth < breakpoint;
}

function restoreInlineStyle(el, originalStyle) {
  if (typeof originalStyle === 'string') {
    el.setAttribute('style', originalStyle);
  } else {
    el.removeAttribute('style');
  }
}

function parseBoolean(value, fallback) {
  if (value === '' || value === 'true' || value === '1') {
    return true;
  }

  if (value === 'false' || value === '0') {
    return false;
  }

  return fallback;
}

function parseNumber(value, fallback) {
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function parseInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function parseNumericText(value) {
  const normalized = String(value || '').replace(/[^0-9.-]/g, '');
  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? Number.NaN : parsed;
}

function formatCountValue(value, config) {
  const safeDecimals = Math.max(0, config.decimals);
  const fixedValue = Number(value).toFixed(safeDecimals);
  const [integerPart, decimalPart] = fixedValue.split('.');
  const displayInteger = config.separator
    ? Number(integerPart).toLocaleString('en-US')
    : integerPart;
  const displayNumber =
    decimalPart && safeDecimals > 0
      ? `${displayInteger}.${decimalPart}`
      : displayInteger;

  return `${config.prefix}${displayNumber}${config.suffix}`;
}
