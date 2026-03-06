/**
 * WEAVE Copy Plugin
 *
 * 지원:
 * - [data-weave-copy]
 * - .weave_copy
 * - data-text
 * - data-target
 * - data-copy-message
 * - data-copy-alert="true"
 *
 * 동작:
 * - mount 시 click 이벤트 등록
 * - unmount 시 이벤트 제거
 */

const DEFAULT_OPTIONS = {
  selector: '[data-weave-copy], .weave_copy',
  defaultMessage: 'Copied to clipboard.',
  useAlert: false,
  trimText: true,
  successClass: 'is_copied',
  successLabel: 'COPIED',
  successDuration: 1600,
  onSuccess: null,
  onError: null,
};

export function copyPlugin(userOptions = {}) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...userOptions,
  };
  const feedbackTimers = new WeakMap();

  return {
    name: 'copy',
    defaults: options,

    setup(ctx) {
      ctx.logger.log('copy plugin setup');
    },

    scan(ctx) {
      return Array.from(ctx.root.querySelectorAll(options.selector));
    },

    mount(ctx, el) {
      const handleClick = async (event) => {
        event.preventDefault();

        const text = resolveCopyText(el, options);

        if (!text) {
          ctx.logger.warn('copy text not found', el);

          if (typeof options.onError === 'function') {
            options.onError({
              event,
              el,
              reason: 'NO_TEXT',
            });
          }

          return;
        }

        try {
          await copyToClipboard(text);

          const message = getCopyMessage(el, options);
          const shouldAlert = getCopyAlert(el, options);

          if (shouldAlert && message) {
            window.alert(message);
          }

          if (typeof options.onSuccess === 'function') {
            options.onSuccess({
              event,
              el,
              text,
              message,
            });
          }

          applyCopySuccessFeedback(el, options, feedbackTimers);
          dispatchCopyEvent('weave:copy-success', {
            el,
            text,
            message,
          });

          ctx.logger.log('copy success', { el, text });
        } catch (error) {
          ctx.logger.error('copy failed', error);

          dispatchCopyEvent('weave:copy-error', {
            el,
            text,
            error,
          });

          if (typeof options.onError === 'function') {
            options.onError({
              event,
              el,
              reason: 'COPY_FAILED',
              error,
            });
          }
        }
      };

      const offClick = ctx.events.listen(el, 'click', handleClick);

      return {
        offClick,
      };
    },

    unmount(ctx, el, instance) {
      instance?.offClick?.();
      ctx.logger.log('copy plugin unmounted', el);
    },

    teardown(ctx) {
      ctx.logger.log('copy plugin teardown');
    },
  };
}

/**
 * 복사할 텍스트 결정
 * 우선순위:
 * 1. data-text
 * 2. data-target 의 대상 요소 textContent
 */
function resolveCopyText(el, options) {
  const directText = el.dataset.text || el.getAttribute('data-text');
  if (directText) {
    return options.trimText ? directText.trim() : directText;
  }

  const targetSelector =
    el.dataset.target || el.getAttribute('data-target');

  if (!targetSelector) return '';

  const target = document.querySelector(targetSelector);
  if (!target) return '';

  const text = target.textContent || '';
  return options.trimText ? text.trim() : text;
}

/**
 * 복사 완료 메시지
 */
function getCopyMessage(el, options) {
  return (
    el.dataset.copyMessage ||
    el.getAttribute('data-copy-message') ||
    options.defaultMessage
  );
}

/**
 * alert 여부
 */
function getCopyAlert(el, options) {
  const attr = el.dataset.copyAlert || el.getAttribute('data-copy-alert');

  if (attr === 'true') return true;
  if (attr === 'false') return false;

  return options.useAlert;
}

/**
 * clipboard 복사
 * navigator.clipboard 우선
 * fallback: textarea + execCommand
 */
async function copyToClipboard(text) {
  if (
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    await navigator.clipboard.writeText(text);
    return;
  }

  fallbackCopyText(text);
}

/**
 * fallback copy
 */
function fallbackCopyText(text) {
  const textarea = document.createElement('textarea');

  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  textarea.style.left = '-9999px';

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
}

function applyCopySuccessFeedback(el, options, feedbackTimers) {
  if (!supportsCopyButtonFeedback(el)) return;

  const successClass =
    el.dataset.copySuccessClass ||
    el.getAttribute('data-copy-success-class') ||
    options.successClass;
  const successLabel =
    el.dataset.copySuccessLabel ||
    el.getAttribute('data-copy-success-label') ||
    options.successLabel;
  const successDuration = parseSuccessDuration(el, options);

  if (!el.dataset.copyOriginalLabel) {
    el.dataset.copyOriginalLabel = getElementLabel(el);
  }

  const timerId = feedbackTimers.get(el);
  if (timerId) {
    window.clearTimeout(timerId);
  }

  setElementLabel(el, successLabel);
  el.classList.add(successClass);
  el.setAttribute('aria-live', 'polite');

  const nextTimerId = window.setTimeout(() => {
    setElementLabel(el, el.dataset.copyOriginalLabel || '');
    el.classList.remove(successClass);
    feedbackTimers.delete(el);
  }, successDuration);

  feedbackTimers.set(el, nextTimerId);
}

function supportsCopyButtonFeedback(el) {
  if (!el) return false;

  return (
    el.tagName === 'BUTTON' ||
    el.tagName === 'A' ||
    el.getAttribute('role') === 'button'
  );
}

function getElementLabel(el) {
  if (el.dataset.copyLabel) {
    return el.dataset.copyLabel;
  }

  return (el.textContent || '').trim();
}

function setElementLabel(el, value) {
  el.textContent = value;
}

function parseSuccessDuration(el, options) {
  const rawValue =
    el.dataset.copySuccessDuration ||
    el.getAttribute('data-copy-success-duration');
  const parsedValue = Number.parseInt(rawValue, 10);

  if (Number.isNaN(parsedValue)) {
    return options.successDuration;
  }

  return parsedValue;
}

function dispatchCopyEvent(name, detail) {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') {
    return;
  }

  window.dispatchEvent(new CustomEvent(name, { detail }));
}