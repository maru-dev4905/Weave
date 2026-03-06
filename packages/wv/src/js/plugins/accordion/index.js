const DEFAULT_OPTIONS = {
  selector: '[data-weave-accordion], .weave_accordion, .wv_accordion',
  itemSelector:
    '[data-weave-accordion-item], .weave_accordion_item, li',
  buttonSelector:
    '[data-weave-accordion-button], .weave_accordion_btn, .wv_accordion_btn',
  panelSelector:
    '[data-weave-accordion-panel], .weave_accordion_panel, .wv_accordion_panel',
  activeClass: 'active',
  defaultMode: 'single',
  syncAria: true,
};

export function accordionPlugin(userOptions = {}) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...userOptions,
  };

  return {
    name: 'accordion',

    setup(ctx) {
      ctx.logger.log('accordion plugin setup');
    },

    scan(ctx) {
      return Array.from(ctx.root.querySelectorAll(options.selector));
    },

    mount(ctx, el) {
      const items = getItems(el, options);
      const cleanups = [];
      let hasExpandedItem = false;

      if (!items.length) {
        ctx.logger.warn('accordion items not found', el);
        return null;
      }

      const mode = getMode(el, options);

      const setExpanded = (item, expanded) => {
        const button = getItemButton(item, options);
        const panel = getItemPanel(item, options);

        item.classList.toggle(options.activeClass, expanded);
        button?.classList.toggle(options.activeClass, expanded);

        if (panel) {
          panel.classList.toggle(options.activeClass, expanded);
          panel.hidden = !expanded;
        }

        if (options.syncAria && button) {
          button.setAttribute('aria-expanded', String(expanded));
        }

        if (options.syncAria && panel) {
          panel.setAttribute('aria-hidden', String(!expanded));
        }
      };

      const closeSiblings = (currentItem) => {
        items.forEach((item) => {
          if (item !== currentItem) {
            setExpanded(item, false);
          }
        });
      };

      items.forEach((item) => {
        const button = getItemButton(item, options);
        const panel = getItemPanel(item, options);

        if (!button) {
          return;
        }

        if (options.syncAria) {
          setupAria(button, panel);
        }

        const initiallyExpanded = isInitiallyExpanded(item, button, options);
        let expanded = initiallyExpanded;

        if (mode === 'single' && initiallyExpanded) {
          if (hasExpandedItem) {
            expanded = false;
          } else {
            hasExpandedItem = true;
          }
        }

        setExpanded(item, expanded);

        const offClick = ctx.events.listen(button, 'click', (event) => {
          if (button.tagName === 'A') {
            event.preventDefault();
          }

          const shouldExpand = !item.classList.contains(options.activeClass);

          if (mode === 'single' && shouldExpand) {
            closeSiblings(item);
          }

          setExpanded(item, mode === 'single' ? shouldExpand : !item.classList.contains(options.activeClass));
        });

        const offKeydown = ctx.events.listen(button, 'keydown', (event) => {
          const buttons = items
            .map((entry) => getItemButton(entry, options))
            .filter(Boolean);
          const currentIndex = buttons.indexOf(button);
          const lastIndex = buttons.length - 1;

          switch (event.key) {
            case 'ArrowUp':
              event.preventDefault();
              buttons[currentIndex > 0 ? currentIndex - 1 : lastIndex]?.focus();
              break;
            case 'ArrowDown':
              event.preventDefault();
              buttons[currentIndex < lastIndex ? currentIndex + 1 : 0]?.focus();
              break;
            case 'Home':
              event.preventDefault();
              buttons[0]?.focus();
              break;
            case 'End':
              event.preventDefault();
              buttons[lastIndex]?.focus();
              break;
            default:
              break;
          }
        });

        cleanups.push(offClick, offKeydown);
      });

      return {
        cleanups,
      };
    },

    unmount(ctx, el, instance) {
      instance?.cleanups?.forEach((cleanup) => cleanup?.());
      ctx.logger.log('accordion plugin unmounted', el);
    },

    teardown(ctx) {
      ctx.logger.log('accordion plugin teardown');
    },
  };
}

function getItems(el, options) {
  return Array.from(el.children).filter((child) =>
    child.matches?.(options.itemSelector),
  );
}

function getItemButton(item, options) {
  return item.querySelector(options.buttonSelector);
}

function getItemPanel(item, options) {
  return (
    item.querySelector(options.panelSelector) ||
    getPanelFromSiblings(item, options)
  );
}

function getPanelFromSiblings(item, options) {
  const button = getItemButton(item, options);
  const nextElement = button?.nextElementSibling;

  if (!nextElement) return null;

  if (
    nextElement.matches?.(options.panelSelector) ||
    nextElement.classList.contains('accordion_panel')
  ) {
    return nextElement;
  }

  return null;
}

function getMode(el, options) {
  const value =
    el.dataset.weaveAccordionMode ||
    el.getAttribute('data-weave-accordion-mode') ||
    el.dataset.mode ||
    el.dataset.type ||
    options.defaultMode;

  return value === 'multi' ? 'multi' : 'single';
}

function isInitiallyExpanded(item, button, options) {
  if (item.classList.contains(options.activeClass)) {
    return true;
  }

  if (button?.classList.contains(options.activeClass)) {
    return true;
  }

  return button?.getAttribute('aria-expanded') === 'true';
}

function setupAria(button, panel) {
  button.setAttribute('aria-expanded', button.getAttribute('aria-expanded') || 'false');

  if (!panel) return;

  const buttonId = button.id || `weave-accordion-button-${createUid()}`;
  const panelId = panel.id || `weave-accordion-panel-${createUid()}`;

  button.id = buttonId;
  panel.id = panelId;

  button.setAttribute('aria-controls', panelId);
  panel.setAttribute('aria-labelledby', buttonId);
}

function createUid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2, 10);
}
