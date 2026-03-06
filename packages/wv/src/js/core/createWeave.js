import { createRegistry } from './registry.js';
import { createLogger } from './logger.js';
import { createObserver } from './observer.js';
import { createEventSystem } from './events.js';
import { guards } from './guards.js';

/**
 * WEAVE Core Engine
 * plugin based UI runtime
 */

export function createWeave(options = {}) {
  const {
    root = document,
    plugins = [],
    debug = false,
    autoObserve = false,
    exposeGlobal = false,
  } = options;

  const logger = createLogger(debug);

  const registry = createRegistry();

  const events = createEventSystem();

  const observer = createObserver();

  let mounted = false;

  const ctx = {
    root,
    registry,
    events,
    guards,
    logger,
    config: {},
  };

  /**
   * plugin registration
   */
  function use(plugin) {
    if (!plugin || !plugin.name) {
      logger.error('Invalid plugin. plugin.name is required.');
      return api;
    }

    registry.register(plugin);

    return api;
  }

  /**
   * mount engine
   */
  function mount(targetRoot = root) {
    if (!targetRoot) return;

    ctx.root = targetRoot;

    logger.log('WEAVE mount start');

    registry.plugins.forEach((plugin) => {
      try {
        if (plugin.setup) {
          plugin.setup(ctx);
        }

        if (!plugin.scan) return;

        const elements = plugin.scan(ctx) || [];

        elements.forEach((el) => {
          mountElement(plugin, el);
        });
      } catch (err) {
        logger.error(`Plugin ${plugin.name} mount error`, err);
      }
    });

    if (autoObserve) {
      observer.observe(targetRoot, refresh);
    }

    mounted = true;

    logger.log('WEAVE mount complete');

    return api;
  }

  /**
   * mount individual element
   */
  function mountElement(plugin, el) {
    const store = registry.getStore(plugin.name);

    if (store.has(el)) return;

    try {
      const instance = plugin.mount ? plugin.mount(ctx, el) : null;

      store.set(el, instance || true);

      logger.log(`${plugin.name} mounted`, el);
    } catch (err) {
      logger.error(`Plugin ${plugin.name} element mount error`, err);
    }
  }

  /**
   * refresh runtime (scan again)
   */
  function refresh() {
    if (!mounted) return;

    logger.log('WEAVE refresh');

    registry.plugins.forEach((plugin) => {
      if (!plugin.scan) return;

      const elements = plugin.scan(ctx) || [];

      elements.forEach((el) => {
        mountElement(plugin, el);
      });
    });
  }

  /**
   * unmount element
   */
  function unmountElement(plugin, el) {
    const store = registry.getStore(plugin.name);

    if (!store.has(el)) return;

    const instance = store.get(el);

    if (plugin.unmount) {
      try {
        plugin.unmount(ctx, el, instance);
      } catch (err) {
        logger.error(`Plugin ${plugin.name} unmount error`, err);
      }
    }

    store.delete(el);
  }

  /**
   * destroy whole engine
   */
  function destroy() {
    logger.log('WEAVE destroy');

    registry.plugins.forEach((plugin) => {
      const store = registry.getStore(plugin.name);
      const entries = Array.from(store.entries());

      entries.forEach(([el, instance]) => {
        if (plugin.unmount) {
          try {
            plugin.unmount(ctx, el, instance);
          } catch (err) {
            logger.error(`Plugin ${plugin.name} unmount error`, err);
          }
        }

        store.delete(el);
      });

      if (plugin.teardown) {
        try {
          plugin.teardown(ctx);
        } catch (err) {
          logger.error(`Plugin ${plugin.name} teardown error`, err);
        }
      }
    });

    observer.disconnect();
    events.cleanup();

    mounted = false;
  }

  /**
   * public api
   */
  const api = {
    use,
    mount,
    refresh,
    destroy,
    registry,
  };

  /**
   * register initial plugins
   */
  plugins.forEach(use);

  if (exposeGlobal) {
    window.weave = api;
  }

  return api;
}
