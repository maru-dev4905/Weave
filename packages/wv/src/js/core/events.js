/**
 * WEAVE Event System
 *
 * 역할
 * - 직접 이벤트 바인딩
 * - 이벤트 위임
 * - 이벤트 해제 함수 반환
 * - 등록된 모든 이벤트 cleanup
 */

export function createEventSystem() {
  /**
   * cleanup 함수 목록
   * destroy 시 전부 실행
   */
  const cleanups = [];

  /**
   * cleanup 등록
   */
  function addCleanup(fn) {
    if (typeof fn !== 'function') return;
    cleanups.push(fn);
    return fn;
  }

  /**
   * 일반 이벤트 바인딩
   *
   * @param {EventTarget} target
   * @param {string} type
   * @param {Function} handler
   * @param {Object|boolean} [options]
   * @returns {Function} off 함수
   */
  function listen(target, type, handler, options) {
    if (!target || typeof target.addEventListener !== 'function') {
      return () => {
      };
    }

    target.addEventListener(type, handler, options);

    const off = () => {
      target.removeEventListener(type, handler, options);
    };

    addCleanup(off);

    return off;
  }

  /**
   * selector 매칭용 closest 유틸
   *
   * @param {EventTarget} target
   * @param {string} selector
   * @param {Element|Document} root
   * @returns {Element|null}
   */
  function getMatchedTarget(target, selector, root) {
    if (!(target instanceof Element)) return null;

    const matched = target.closest(selector);

    if (!matched) return null;

    if (root instanceof Element && !root.contains(matched)) {
      return null;
    }

    return matched;
  }

  /**
   * 이벤트 위임
   *
   * @param {Element|Document} root
   * @param {string} type
   * @param {string} selector
   * @param {Function} handler
   * @param {Object|boolean} [options]
   * @returns {Function} off 함수
   */
  function delegate(root, type, selector, handler, options) {
    if (!root || typeof root.addEventListener !== 'function') {
      return () => {
      };
    }

    const listener = (event) => {
      const matched = getMatchedTarget(event.target, selector, root);

      if (!matched) return;

      handler(event, matched);
    };

    root.addEventListener(type, listener, options);

    const off = () => {
      root.removeEventListener(type, listener, options);
    };

    addCleanup(off);

    return off;
  }

  /**
   * 복수 selector 위임
   *
   * usage:
   * delegateMap(root, "click", {
   *   ".btn_a": (e, el) => {},
   *   ".btn_b": (e, el) => {}
   * })
   *
   * @param {Element|Document} root
   * @param {string} type
   * @param {Object<string, Function>} selectorMap
   * @param {Object|boolean} [options]
   * @returns {Function} off 함수
   */
  function delegateMap(root, type, selectorMap, options) {
    if (!root || typeof root.addEventListener !== 'function') {
      return () => {
      };
    }

    const selectors = Object.keys(selectorMap || {});
    if (!selectors.length) return () => {
    };

    const listener = (event) => {
      for (const selector of selectors) {
        const matched = getMatchedTarget(event.target, selector, root);
        if (!matched) continue;

        const handler = selectorMap[selector];
        if (typeof handler === 'function') {
          handler(event, matched);
        }
        return;
      }
    };

    root.addEventListener(type, listener, options);

    const off = () => {
      root.removeEventListener(type, listener, options);
    };

    addCleanup(off);

    return off;
  }

  /**
   * 수동 cleanup 실행
   * 등록된 모든 이벤트 해제
   */
  function cleanup() {
    while (cleanups.length) {
      const fn = cleanups.pop();

      try {
        fn();
      } catch (error) {
        console.error('[WEAVE] event cleanup error', error);
      }
    }
  }

  /**
   * alias
   */
  const on = listen;
  const off = (offFn) => {
    if (typeof offFn === 'function') {
      offFn();
    }
  };

  return {
    on,
    off,
    listen,
    delegate,
    delegateMap,
    cleanup,
  };
}