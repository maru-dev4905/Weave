import { guards } from './guards.js';

/**
 * WEAVE MutationObserver
 *
 * 역할
 * - DOM 추가 감지
 * - refresh 트리거
 * - addedNodes 기반 처리
 */

export function createObserver() {
  let observer = null;

  /**
   * observe 시작
   */
  function observe(root, callback) {
    if (!guards.hasMutationObserver()) {
      console.warn('[WEAVE] MutationObserver not supported');
      return;
    }

    if (!root) return;

    observer = new MutationObserver((mutations) => {
      let shouldRefresh = false;

      for (const mutation of mutations) {
        if (mutation.type !== 'childList') continue;

        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType !== 1) continue;

            shouldRefresh = true;
            break;
          }
        }

        if (shouldRefresh) break;
      }

      if (shouldRefresh && typeof callback === 'function') {
        callback();
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * observer 종료
   */
  function disconnect() {
    if (!observer) return;

    observer.disconnect();

    observer = null;
  }

  return {
    observe,
    disconnect,
  };
}