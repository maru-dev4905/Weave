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

export const animPlugin = {
  fadeAnim: createFadePlugin,
  marqueeAnim: createMarqueePlugin,
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

function getFadeDirection(value, fallback) {
  const direction = (value || fallback || 'up').trim().toLowerCase();
  return ['up', 'down', 'left', 'right'].includes(direction) ? direction : fallback;
}

function getMarqueeDirection(value, fallback) {
  const direction = (value || fallback || 'left').trim().toLowerCase();
  return ['left', 'right'].includes(direction) ? direction : fallback;
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
