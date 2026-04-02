const DEFAULT_OPTIONS = {
  selector: '[data-weave-link-button], .weave_link_button, .wv_link_btn',
  defaultDelay: 0,
};

export function linkButtonPlugin(userOptions = {}) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...userOptions,
  };

  return {
    name: 'linkButton',

    setup(ctx) {
      ctx.logger.log('linkButton plugin setup');
    },

    scan(ctx) {
      return Array.from(ctx.root.querySelectorAll(options.selector));
    },

    mount(ctx, el) {
      let timeoutId = null;

      const offClick = ctx.events.listen(el, 'click', (event) => {
        event.preventDefault();

        const config = readLinkButtonConfig(el, options);

        if (!config.href) {
          ctx.logger.warn('linkButton href not found', el);
          return;
        }

        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }

        timeoutId = window.setTimeout(() => {
          navigateTo(config.href, config.openBlank);
          timeoutId = null;
        }, config.delay);
      });

      return {
        cleanups: [
          offClick,
          () => {
            if (timeoutId) {
              window.clearTimeout(timeoutId);
            }
          },
        ],
      };
    },

    unmount(ctx, el, instance) {
      instance?.cleanups?.forEach((cleanup) => cleanup?.());
      ctx.logger.log('linkButton plugin unmounted', el);
    },

    teardown(ctx) {
      ctx.logger.log('linkButton plugin teardown');
    },
  };
}

function readLinkButtonConfig(el, options) {
  const href =
    el.dataset.weaveLinkHref ||
    el.getAttribute('data-weave-link-href') ||
    el.dataset.href ||
    el.getAttribute('data-href') ||
    '';

  const delay = parseInteger(
    el.dataset.weaveLinkDelay ||
      el.getAttribute('data-weave-link-delay') ||
      el.dataset.delay ||
      el.getAttribute('data-delay'),
    options.defaultDelay,
  );

  const openBlank = parseBoolean(
    el.dataset.weaveLinkBlank ||
      el.getAttribute('data-weave-link-blank') ||
      el.dataset.blank ||
      el.getAttribute('data-blank'),
  );

  return {
    href,
    delay,
    openBlank,
  };
}

function parseInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function parseBoolean(value) {
  return value === '' || value === 'true' || value === '1';
}

function navigateTo(href, openBlank) {
  if (openBlank) {
    window.open(href, '_blank');
    return;
  }

  window.location.href = href;
}
