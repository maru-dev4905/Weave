const DEFAULT_OPTIONS = {
  selector: '[data-weave-tabs], .weave_tabs, .wv_tab',
  buttonSelector:
    '[data-weave-tabs-button], .weave_tabs_btn, .wv_tab_btn',
  panelSelector:
    '[data-weave-tabs-panel], .weave_tabs_panel, .wv_tab_panel',
  activeClass: 'active',
  initialIndex: 0,
  syncAria: true,
};

export function tabsPlugin(userOptions = {}) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...userOptions,
  };

  return {
    name: 'tabs',

    setup(ctx) {
      ctx.logger.log('tabs plugin setup');
    },

    scan(ctx) {
      return Array.from(ctx.root.querySelectorAll(options.selector));
    },

    mount(ctx, el) {
      const buttons = getTabButtons(el, options);
      const panels = getTabPanels(el, options);

      if (!buttons.length || !panels.length) {
        ctx.logger.warn('tabs structure is incomplete', el);
        return null;
      }

      const initialIndex = getInitialIndex(buttons, panels, options);

      if (options.syncAria) {
        setupAria(el, buttons, panels);
      }

      const select = (nextIndex, focusButton = false) => {
        const safeIndex = clamp(nextIndex, 0, Math.min(buttons.length, panels.length) - 1);

        buttons.forEach((button, index) => {
          const isActive = index === safeIndex;

          button.classList.toggle(options.activeClass, isActive);

          if (options.syncAria) {
            button.setAttribute('aria-selected', String(isActive));
            button.setAttribute('tabindex', isActive ? '0' : '-1');
          }

          if (focusButton && isActive) {
            button.focus();
          }
        });

        panels.forEach((panel, index) => {
          const isActive = index === safeIndex;

          panel.classList.toggle(options.activeClass, isActive);
          panel.hidden = !isActive;

          if (options.syncAria) {
            panel.setAttribute('aria-hidden', String(!isActive));
          }
        });
      };

      select(initialIndex);

      const cleanups = buttons.flatMap((button, index) => {
        const offClick = ctx.events.listen(button, 'click', (event) => {
          if (button.tagName === 'A') {
            event.preventDefault();
          }

          select(index);
        });

        const offKeydown = ctx.events.listen(button, 'keydown', (event) => {
          const currentIndex = buttons.indexOf(button);
          const lastIndex = buttons.length - 1;

          switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
              event.preventDefault();
              select(currentIndex > 0 ? currentIndex - 1 : lastIndex, true);
              break;
            case 'ArrowRight':
            case 'ArrowDown':
              event.preventDefault();
              select(currentIndex < lastIndex ? currentIndex + 1 : 0, true);
              break;
            case 'Home':
              event.preventDefault();
              select(0, true);
              break;
            case 'End':
              event.preventDefault();
              select(lastIndex, true);
              break;
            default:
              break;
          }
        });

        return [offClick, offKeydown];
      });

      return {
        cleanups,
      };
    },

    unmount(ctx, el, instance) {
      instance?.cleanups?.forEach((cleanup) => cleanup?.());
      ctx.logger.log('tabs plugin unmounted', el);
    },

    teardown(ctx) {
      ctx.logger.log('tabs plugin teardown');
    },
  };
}

function getTabButtons(el, options) {
  return Array.from(el.querySelectorAll(options.buttonSelector));
}

function getTabPanels(el, options) {
  return Array.from(el.querySelectorAll(options.panelSelector));
}

function getInitialIndex(buttons, panels, options) {
  const buttonIndex = buttons.findIndex(
    (button) =>
      button.classList.contains(options.activeClass) ||
      button.getAttribute('aria-selected') === 'true',
  );

  if (buttonIndex >= 0) return buttonIndex;

  const panelIndex = panels.findIndex((panel) =>
    panel.classList.contains(options.activeClass),
  );

  if (panelIndex >= 0) return panelIndex;

  return clamp(options.initialIndex, 0, Math.min(buttons.length, panels.length) - 1);
}

function setupAria(el, buttons, panels) {
  el.setAttribute('role', 'tablist');

  buttons.forEach((button, index) => {
    const buttonId = button.id || `weave-tab-button-${createUid()}`;
    const panel = panels[index];
    const panelId = panel.id || `weave-tab-panel-${createUid()}`;

    button.id = buttonId;
    panel.id = panelId;

    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', panelId);

    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', buttonId);
  });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function createUid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2, 10);
}
