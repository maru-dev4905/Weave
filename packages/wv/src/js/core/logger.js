/**
 * WEAVE Logger
 *
 * 역할
 * - debug log
 * - warn once
 * - error log
 * - debug 모드 제어
 */

export function createLogger(debug = false) {

  /**
   * warnOnce 기록용
   */
  const warned = new Set();

  /**
   * 일반 로그 (debug 모드일 때만)
   */
  function log(...args) {
    if (!debug) return;
    console.log('[WEAVE]', ...args);
  }

  /**
   * 경고
   */
  function warn(...args) {
    console.warn('[WEAVE]', ...args);
  }

  /**
   * 동일 경고 1회만 출력
   */
  function warnOnce(key, ...args) {

    if (warned.has(key)) return;

    warned.add(key);

    console.warn('[WEAVE]', ...args);

  }

  /**
   * 에러
   */
  function error(...args) {
    console.error('[WEAVE]', ...args);
  }

  /**
   * 디버그 상태 확인
   */
  function isDebug() {
    return debug;
  }

  return {
    log,
    warn,
    warnOnce,
    error,
    isDebug,
  };

}