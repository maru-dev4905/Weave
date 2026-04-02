const DEFAULT_OPTIONS = {
  selector: '[data-weave-target-button], .weave_target_button, .wv_target_btn',
  defaultClass: 'on',
  defaultAction: 'toggle',
  syncSelf: true,
  defaultSelfClass: '',
  onChange: null,
};

export function targetButtonPlugin(userOptions = {}) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...userOptions,
  };

  return {
    name: 'targetButton',

    setup(ctx) {
      ctx.logger.log('targetButton plugin setup');
    },

    scan(ctx) {
      return Array.from(ctx.root.querySelectorAll(options.selector));
    },

    mount(ctx, el) {
      const offClick = ctx.events.listen(el, 'click', (event) => {
        event.preventDefault();

        const config = readTargetButtonConfig(el, options, ctx.logger);

        if (!config.target) {
          ctx.logger.warn('targetButton target not found in attributes', el);
          return;
        }

        const targetEl = resolveTarget(config.target);

        if (!targetEl) {
          ctx.logger.warn(`targetButton target not found: ${config.target}`);
          return;
        }

        const nextActive = applyAction(targetEl, config.className, config.action);

        if (config.syncSelf) {
          const selfClass = config.selfClass || config.className;
          setClassState(el, selfClass, nextActive);
        }

        const detail = {
          el,
          target: targetEl,
          targetSelector: config.target,
          className: config.className,
          action: config.action,
          active: nextActive,
        };

        if (typeof options.onChange === 'function') {
          options.onChange(detail);
        }

        dispatchTargetButtonEvent(detail);
        ctx.logger.log('targetButton changed', detail);
      });

      return {
        cleanups: [offClick],
      };
    },

    unmount(ctx, el, instance) {
      instance?.cleanups?.forEach((cleanup) => cleanup?.());
      ctx.logger.log('targetButton plugin unmounted', el);
    },

    teardown(ctx) {
      ctx.logger.log('targetButton plugin teardown');
    },
  };
}

function readTargetButtonConfig(el, options, logger) {
  const directTarget =
    el.dataset.weaveTarget ||
    el.getAttribute('data-weave-target') ||
    '';

  const directClassName =
    el.dataset.weaveTargetClass ||
    el.getAttribute('data-weave-target-class') ||
    options.defaultClass;

  const directAction =
    el.dataset.weaveTargetAction ||
    el.getAttribute('data-weave-target-action') ||
    options.defaultAction;

  const directSyncSelf = parseBoolean(
    el.dataset.weaveTargetSelf ||
      el.getAttribute('data-weave-target-self'),
    options.syncSelf,
  );

  const directSelfClass =
    el.dataset.weaveTargetSelfClass ||
    el.getAttribute('data-weave-target-self-class') ||
    options.defaultSelfClass;

  if (directTarget) {
    return {
      target: directTarget,
      className: directClassName,
      action: normalizeAction(directAction, options.defaultAction),
      syncSelf: directSyncSelf,
      selfClass: directSelfClass,
    };
  }

  return readLegacyTargetConfig(el, options, logger);
}

function readLegacyTargetConfig(el, options, logger) {
  const raw = el.getAttribute('data-target');

  if (!raw) {
    return {
      target: '',
      className: options.defaultClass,
      action: options.defaultAction,
      syncSelf: options.syncSelf,
      selfClass: options.defaultSelfClass,
    };
  }

  try {
    const parsed = JSON.parse(raw.replace(/'/g, '"'));

    if (!Array.isArray(parsed) || parsed.length < 1) {
      logger.warn('targetButton legacy data-target must be an array', el);

      return {
        target: '',
        className: options.defaultClass,
        action: options.defaultAction,
        syncSelf: options.syncSelf,
        selfClass: options.defaultSelfClass,
      };
    }

    return {
      target: parsed[0] || '',
      className: parsed[1] || options.defaultClass,
      action: normalizeAction(parsed[2], options.defaultAction),
      syncSelf: options.syncSelf,
      selfClass: options.defaultSelfClass,
    };
  } catch (error) {
    logger.error('targetButton legacy data-target parsing failed', error);

    return {
      target: '',
      className: options.defaultClass,
      action: options.defaultAction,
      syncSelf: options.syncSelf,
      selfClass: options.defaultSelfClass,
    };
  }
}

function resolveTarget(target) {
  if (!target) return null;

  if (target.startsWith('#')) {
    return document.querySelector(target);
  }

  return document.getElementById(target) || document.querySelector(target);
}

function normalizeAction(value, fallback) {
  if (value === 'add' || value === 'remove' || value === 'toggle') {
    return value;
  }

  return fallback;
}

function applyAction(targetEl, className, action) {
  const hasClass = targetEl.classList.contains(className);

  if (action === 'add') {
    if (!hasClass) {
      targetEl.classList.add(className);
    }

    return true;
  }

  if (action === 'remove') {
    if (hasClass) {
      targetEl.classList.remove(className);
    }

    return false;
  }

  targetEl.classList.toggle(className);
  return !hasClass;
}

function setClassState(el, className, active) {
  if (!className) return;

  el.classList.toggle(className, active);
}

function parseBoolean(value, fallback) {
  if (value == null) {
    return fallback;
  }

  if (value === '' || value === 'true' || value === '1') {
    return true;
  }

  if (value === 'false' || value === '0') {
    return false;
  }

  return fallback;
}

function dispatchTargetButtonEvent(detail) {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') {
    return;
  }

  window.dispatchEvent(new CustomEvent('weave:target-button-change', { detail }));
}
