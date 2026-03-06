const DEFAULT_OPTIONS = {
  selector: '[data-weave-modal], .weave_modal, .wv_modal',
  triggerSelector:
    '[data-weave-modal-open], .weave_modal_open, .wv_modal_btn[data-modal]',
  closeSelector:
    '[data-weave-modal-close], .weave_modal_close, .close_modal',
  overlaySelector: '[data-weave-modal-overlay], .weave_modal_overlay, .dim',
  activeClass: 'active',
  bodyLockClass: 'scrollLock',
  closeOnOverlayClick: true,
  closeOnEscape: true,
  closeOthersByDefault: true,
};

export function modalPlugin(userOptions = {}) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...userOptions,
  };

  const lastTriggerMap = new WeakMap();
  const originalIframeSrcMap = new WeakMap();
  let didSetup = false;

  return {
    name: 'modal',

    setup(ctx) {
      if (didSetup) return;

      didSetup = true;

      if (options.closeOnEscape) {
        ctx.events.listen(document, 'keydown', (event) => {
          if (event.key === 'Escape') {
            closeActiveModals(ctx, options, lastTriggerMap, originalIframeSrcMap);
          }
        });
      }

      if (options.closeOnOverlayClick) {
        ctx.events.delegate(document, 'click', options.overlaySelector, (event) => {
          event.preventDefault();
          closeActiveModals(ctx, options, lastTriggerMap, originalIframeSrcMap);
        });
      }

      ctx.logger.log('modal plugin setup');
    },

    scan(ctx) {
      return Array.from(
        ctx.root.querySelectorAll(`${options.selector}, ${options.triggerSelector}`),
      );
    },

    mount(ctx, el) {
      if (matches(el, options.selector)) {
        return mountModalRoot(ctx, el, options, lastTriggerMap, originalIframeSrcMap);
      }

      if (matches(el, options.triggerSelector)) {
        return mountModalTrigger(ctx, el, options, lastTriggerMap, originalIframeSrcMap);
      }

      return null;
    },

    unmount(ctx, el, instance) {
      instance?.cleanups?.forEach((cleanup) => cleanup?.());

      if (instance?.role === 'modal') {
        setModalState(el, false, options, lastTriggerMap, originalIframeSrcMap);
      }

      ctx.logger.log('modal plugin unmounted', el);
    },

    teardown(ctx) {
      didSetup = false;
      closeActiveModals(ctx, options, lastTriggerMap, originalIframeSrcMap);
      ctx.logger.log('modal plugin teardown');
    },
  };
}

function mountModalRoot(ctx, modal, options, lastTriggerMap, originalIframeSrcMap) {
  initializeModalAccessibility(modal);
  setModalState(modal, false, options, lastTriggerMap, originalIframeSrcMap);

  const offClick = ctx.events.listen(modal, 'click', (event) => {
    const closeButton = event.target.closest(options.closeSelector);

    if (closeButton) {
      event.preventDefault();
      setModalState(modal, false, options, lastTriggerMap, originalIframeSrcMap);
      return;
    }

    if (
      options.closeOnOverlayClick &&
      event.target === modal &&
      shouldTreatRootAsOverlay(modal)
    ) {
      event.preventDefault();
      setModalState(modal, false, options, lastTriggerMap, originalIframeSrcMap);
    }
  });

  return {
    role: 'modal',
    cleanups: [offClick],
  };
}

function mountModalTrigger(ctx, trigger, options, lastTriggerMap, originalIframeSrcMap) {
  const offClick = ctx.events.listen(trigger, 'click', (event) => {
    event.preventDefault();

    const modalId = getModalId(trigger);
    const modal = modalId ? document.getElementById(modalId) : null;

    if (!modal) {
      ctx.logger.warn(`modal target not found: ${modalId || '(empty)'}`);
      return;
    }

    if (shouldCloseOthers(trigger, modal, options)) {
      closeActiveModals(ctx, options, lastTriggerMap, originalIframeSrcMap, modal);
    }

    lastTriggerMap.set(modal, trigger);
    openModal(modal, trigger, options, originalIframeSrcMap);
  });

  return {
    role: 'trigger',
    cleanups: [offClick],
  };
}

function closeActiveModals(ctx, options, lastTriggerMap, originalIframeSrcMap, exceptModal = null) {
  const activeModals = getModalRoots(options).filter((modal) =>
    modal.classList.contains(options.activeClass),
  );

  activeModals.forEach((modal) => {
    if (modal !== exceptModal) {
      setModalState(modal, false, options, lastTriggerMap, originalIframeSrcMap);
    }
  });

  syncBodyLock(options);
  ctx.logger.log('modal close active');
}

function openModal(modal, trigger, options, originalIframeSrcMap) {
  initializeModalAccessibility(modal);

  modal.classList.add(options.activeClass);
  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');

  applyYoutubeEmbed(modal, trigger, originalIframeSrcMap);
  syncBodyLock(options);

  requestAnimationFrame(() => {
    getFocusTarget(modal)?.focus();
  });
}

function setModalState(modal, isOpen, options, lastTriggerMap, originalIframeSrcMap) {
  modal.classList.toggle(options.activeClass, isOpen);
  modal.hidden = !isOpen;
  modal.setAttribute('aria-hidden', String(!isOpen));

  if (!isOpen) {
    resetYoutubeEmbed(modal, originalIframeSrcMap);
    lastTriggerMap.get(modal)?.focus?.();
  }

  syncBodyLock(options);
}

function syncBodyLock(options) {
  const hasActiveModal = getModalRoots(options).some((modal) =>
    modal.classList.contains(options.activeClass),
  );

  document.body.classList.toggle(options.bodyLockClass, !!hasActiveModal);
}

function initializeModalAccessibility(modal) {
  modal.setAttribute('role', modal.getAttribute('role') || 'dialog');
  modal.setAttribute('aria-modal', modal.getAttribute('aria-modal') || 'true');
  modal.setAttribute('aria-hidden', modal.getAttribute('aria-hidden') || 'true');

  if (!modal.hasAttribute('tabindex')) {
    modal.setAttribute('tabindex', '-1');
  }

  if (!modal.classList.contains('active')) {
    modal.hidden = true;
  }
}

function getModalId(trigger) {
  return (
    trigger.dataset.weaveModalOpen ||
    trigger.getAttribute('data-weave-modal-open') ||
    trigger.dataset.modal ||
    trigger.getAttribute('data-modal')
  );
}

function shouldCloseOthers(trigger, modal, options) {
  if (trigger.getAttribute('data-weave-modal-chain') === 'false') {
    return false;
  }

  if (modal.dataset.chain === 'false') {
    return false;
  }

  return options.closeOthersByDefault;
}

function shouldTreatRootAsOverlay(modal) {
  return !modal.querySelector('[data-weave-modal-overlay]');
}

function getFocusTarget(modal) {
  return (
    modal.querySelector(
      '[autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ) || modal
  );
}

function applyYoutubeEmbed(modal, trigger, originalIframeSrcMap) {
  const youtubeId =
    trigger.dataset.youtube || trigger.getAttribute('data-youtube');

  if (!youtubeId) return;

  const iframe = modal.querySelector('iframe');
  if (!iframe) return;

  if (!originalIframeSrcMap.has(iframe)) {
    originalIframeSrcMap.set(iframe, iframe.getAttribute('src') || '');
  }

  iframe.setAttribute('src', `https://www.youtube.com/embed/${youtubeId}`);
  modal.classList.add('is_youtube');
}

function resetYoutubeEmbed(modal, originalIframeSrcMap) {
  const iframe = modal.querySelector('iframe');
  if (!iframe) return;

  const originalSrc = originalIframeSrcMap.get(iframe) || '';
  iframe.setAttribute('src', originalSrc);
  modal.classList.remove('is_youtube');
}

function matches(el, selector) {
  return typeof el?.matches === 'function' && el.matches(selector);
}

function getModalRoots(options) {
  return Array.from(document.querySelectorAll(options.selector));
}
