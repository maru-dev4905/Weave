const DEFAULT_OPTIONS = {
  selector: '[data-weave-hide-today], .weave_hide_today, .hide_today_compo',
  buttonSelector:
    '[data-weave-hide-today-button], .weave_hide_today_btn, .hide_today_btn',
  checkboxSelector:
    '[data-weave-hide-today-checkbox], .weave_hide_today_chk, .hide_today_chk',
  storagePrefix: 'weave-hide-today-',
  defaultExpireHours: 24,
};

export function hideTodayPlugin(userOptions = {}) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...userOptions,
  };

  return {
    name: 'hideToday',

    setup(ctx) {
      ctx.logger.log('hideToday plugin setup');
    },

    scan(ctx) {
      return Array.from(ctx.root.querySelectorAll(options.selector));
    },

    mount(ctx, el) {
      applyStoredState(el, options);

      const button = el.querySelector(options.buttonSelector);
      if (!button) {
        ctx.logger.warn('hideToday button not found', el);
        return null;
      }

      const offClick = ctx.events.listen(button, 'click', () => {
        const targetId = getTargetId(el, options);

        if (!targetId) {
          ctx.logger.warn('hideToday target not found', el);
          return;
        }

        hideTargetById(targetId);

        if (shouldPersist(el, options)) {
          const expireMs = getExpireMs(el, options);
          localStorage.setItem(
            getStorageKey(targetId, options),
            String(Date.now() + expireMs),
          );
        } else {
          localStorage.removeItem(getStorageKey(targetId, options));
        }
      });

      return {
        cleanups: [offClick],
      };
    },

    unmount(ctx, el, instance) {
      instance?.cleanups?.forEach((cleanup) => cleanup?.());
      ctx.logger.log('hideToday plugin unmounted', el);
    },

    teardown(ctx) {
      ctx.logger.log('hideToday plugin teardown');
    },
  };
}

function applyStoredState(el, options) {
  const targetId = getTargetId(el, options);
  if (!targetId) return;

  const checkbox = el.querySelector(options.checkboxSelector);
  const stored = localStorage.getItem(getStorageKey(targetId, options));

  if (stored && Date.now() < Number(stored)) {
    hideTargetById(targetId);

    if (checkbox) {
      checkbox.checked = true;
    }

    return;
  }

  localStorage.removeItem(getStorageKey(targetId, options));
  showTargetById(targetId);

  if (checkbox) {
    checkbox.checked = false;
  }
}

function getTargetId(el, options) {
  const checkbox = el.querySelector(options.checkboxSelector);

  return (
    el.dataset.weaveHideTarget ||
    el.getAttribute('data-weave-hide-target') ||
    checkbox?.dataset.weaveHideTarget ||
    checkbox?.getAttribute('data-weave-hide-target') ||
    checkbox?.dataset.close ||
    checkbox?.getAttribute('data-close') ||
    ''
  );
}

function shouldPersist(el, options) {
  const checkbox = el.querySelector(options.checkboxSelector);
  return !!checkbox?.checked;
}

function getExpireMs(el, options) {
  const checkbox = el.querySelector(options.checkboxSelector);
  const raw =
    checkbox?.dataset.weaveHideExpireHours ||
    checkbox?.getAttribute('data-weave-hide-expire-hours') ||
    checkbox?.dataset.expireHours ||
    checkbox?.getAttribute('data-expire-hours') ||
    String(options.defaultExpireHours);

  const hours = Number.parseInt(raw, 10);
  return Math.max(1, Number.isNaN(hours) ? options.defaultExpireHours : hours) * 60 * 60 * 1000;
}

function getStorageKey(targetId, options) {
  return `${options.storagePrefix}${targetId}`;
}

function hideTargetById(id) {
  const el = document.getElementById(id);
  if (!el) return;

  el.hidden = true;
  el.setAttribute('aria-hidden', 'true');
}

function showTargetById(id) {
  const el = document.getElementById(id);
  if (!el) return;

  el.hidden = false;
  el.removeAttribute('aria-hidden');
}
