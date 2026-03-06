/**
 * WEAVE Guards
 *
 * 역할
 * - 외부 라이브러리 존재 여부 확인
 * - 플러그인 실행 조건 체크
 */

export const guards = {

  /**
   * window 존재 여부
   */
  hasWindow() {
    return typeof window !== 'undefined';
  },

  /**
   * document 존재 여부
   */
  hasDocument() {
    return typeof document !== 'undefined';
  },

  /**
   * GSAP 존재 여부
   */
  hasGSAP() {
    return typeof window !== 'undefined' && !!window.gsap;
  },

  /**
   * ScrollTrigger 존재 여부
   */
  hasScrollTrigger() {
    return typeof window !== 'undefined' && !!window.ScrollTrigger;
  },

  /**
   * IntersectionObserver 지원 여부
   */
  hasIntersectionObserver() {
    return typeof window !== 'undefined' && 'IntersectionObserver' in window;
  },

  /**
   * MutationObserver 지원 여부
   */
  hasMutationObserver() {
    return typeof window !== 'undefined' && 'MutationObserver' in window;
  },

  /**
   * element 존재 여부
   */
  isElement(el) {
    return el instanceof Element;
  },

  /**
   * element가 DOM에 포함되어 있는지
   */
  inDOM(el) {
    if (!this.isElement(el)) return false;
    return document.body.contains(el);
  },

  /**
   * selector 존재 여부
   */
  hasSelector(selector) {
    if (!selector) return false;
    try {
      document.querySelector(selector);
      return true;
    } catch {
      return false;
    }
  },

};