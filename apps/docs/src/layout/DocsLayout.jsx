import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import {
  accordionPlugin,
  animPlugin,
  copyPlugin,
  createWeave,
  fileDropPlugin,
  hideTodayPlugin,
  linkButtonPlugin,
  modalPlugin,
  scrollToPlugin,
  tabsPlugin,
  validationPlugin,
} from '@weave/wv/dist/js/core.js';

import { Navbar } from '../components/Navbar.jsx';

export function DocsLayout() {
  const location = useLocation();
  const [copyStatus, setCopyStatus] = useState('');
  const topbarRef = useRef(null);
  const pageMeta = getPageMeta(location.pathname);

  useEffect(() => {
    const app = createWeave({
      debug: false,
      autoObserve: true,
      plugins: [
        copyPlugin(),
        fileDropPlugin({
          zones: createDocsFileDropZones(),
        }),
        linkButtonPlugin(),
        tabsPlugin(),
        accordionPlugin(),
        modalPlugin(),
        hideTodayPlugin(),
        scrollToPlugin(),
        animPlugin.fadeAnim(),
        animPlugin.parallaxAnim({
          responsive: {
            disableBelow: 768,
          },
        }),
        animPlugin.cascadeAnim(),
        animPlugin.marqueeAnim(),
        animPlugin.tickerAnim(),
        animPlugin.countAnim(),
        validationPlugin({
          fields: {
            validationPhone: {
              pattern: '^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$',
              messages: {
                pattern: '연락처는 010-1234-5678 또는 01012345678 형식으로 입력해주세요.',
              },
            },
            validationPassword: {
              togglePassword: true,
              messages: {
                minlength: '비밀번호는 8자 이상 입력해주세요.',
              },
            },
            validationPasswordConfirm: {
              togglePassword: true,
              messages: {
                match: '비밀번호 확인 값이 원본과 일치해야 합니다.',
              },
            },
            formSignupPassword: {
              togglePassword: true,
            },
            formSignupPasswordConfirm: {
              togglePassword: true,
              messages: {
                match: '가입 비밀번호 확인 값이 일치하지 않습니다.',
              },
            },
          },
          passwordToggleLabels: {
            show: '보기',
            hide: '숨기기',
          },
        }),
      ],
    });

    app.mount();

    return () => {
      app.destroy();
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  useEffect(() => {
    const syncTopbarHeight = () => {
      const nextHeight = topbarRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty('--site-topbar-height', `${nextHeight}px`);
    };

    syncTopbarHeight();

    if (typeof ResizeObserver === 'undefined' || !topbarRef.current) {
      window.addEventListener('resize', syncTopbarHeight);

      return () => {
        window.removeEventListener('resize', syncTopbarHeight);
      };
    }

    const observer = new ResizeObserver(syncTopbarHeight);
    observer.observe(topbarRef.current);
    window.addEventListener('resize', syncTopbarHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncTopbarHeight);
    };
  }, []);

  useEffect(() => {
    let timeoutId = null;

    const handleCopySuccess = (event) => {
      const nextMessage = event.detail?.message || '복사되었습니다.';
      setCopyStatus(nextMessage);

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        setCopyStatus('');
      }, 1800);
    };

    window.addEventListener('weave:copy-success', handleCopySuccess);

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      window.removeEventListener('weave:copy-success', handleCopySuccess);
    };
  }, []);

  return (
    <div className="weave_site_shell">
      <div className="weave_site_bg" aria-hidden="true" />
      <Navbar />
      <div className="weave_site_stage">
        <header ref={topbarRef} className="site_topbar">
          <div className="site_topbar_inner">
            <div className="site_topbar_copy">
              <span className="site_topbar_eyebrow">{pageMeta.eyebrow}</span>
              <h1>{pageMeta.title}</h1>
              <p>{pageMeta.description}</p>
            </div>
          </div>
        </header>

        <main className="weave_main">
          <Outlet />
        </main>

        <footer className="site_footer">
          <div className="site_footer_inner">
            <button
              type="button"
              className="copy_ghost_button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              TOP
            </button>
          </div>
        </footer>
      </div>
      <div className={copyStatus ? 'copy_toast is_visible' : 'copy_toast'}>{copyStatus}</div>
    </div>
  );
}

function createDocsFileDropZones() {
  const MB = 1024 * 1024;

  return {
    docsFileDropSingle: {
      input: '#docs-file-drop-single-input',
      accept: ['jpg', 'png', 'pdf'],
      maxSize: 5 * MB,
      renderList: true,
      listTarget: '#docs-file-drop-single-list',
      onChange(files) {
        renderFileDropStatus(
          '#docs-file-drop-single-status',
          files,
          'JPG, PNG, PDF / 최대 5 MB / 단일 파일',
        );
        renderFileDropMessage('#docs-file-drop-single-feedback', '');
      },
      onError(errors, context) {
        renderFileDropStatus(
          '#docs-file-drop-single-status',
          context.validFiles,
          'JPG, PNG, PDF / 최대 5 MB / 단일 파일',
        );
        renderFileDropMessage('#docs-file-drop-single-feedback', formatFileDropErrors(errors));
      },
    },
    docsFileDropMulti: {
      input: '#docs-file-drop-multi-input',
      accept: ['jpg', 'png', 'webp'],
      multiple: true,
      maxSize: 10 * MB,
      renderList: true,
      listTarget: '#docs-file-drop-multi-list',
      onChange(files) {
        renderFileDropStatus(
          '#docs-file-drop-multi-status',
          files,
          'JPG, PNG, WEBP / 파일당 최대 10 MB / 다중 파일',
        );
        renderFileDropMessage('#docs-file-drop-multi-feedback', '');
      },
      onError(errors, context) {
        renderFileDropStatus(
          '#docs-file-drop-multi-status',
          context.validFiles,
          'JPG, PNG, WEBP / 파일당 최대 10 MB / 다중 파일',
        );
        renderFileDropMessage('#docs-file-drop-multi-feedback', formatFileDropErrors(errors));
      },
    },
  };
}

function renderFileDropStatus(selector, files, fallbackMessage) {
  const target = document.querySelector(selector);
  if (!target) return;

  if (!files.length) {
    target.textContent = fallbackMessage;
    return;
  }

  if (files.length === 1) {
    target.textContent = `${files[0].name} · ${files[0].sizeLabel} · ${files[0].extension || 'file'}`;
    return;
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  target.textContent = `${files.length}개 파일 선택 · 총 ${formatBytes(totalSize)}`;
}

function renderFileDropMessage(selector, message) {
  const target = document.querySelector(selector);
  if (!target) return;
  target.textContent = message;
}

function formatFileDropErrors(errors) {
  return errors
    .map((error) => (error.fileName ? `${error.fileName}: ${error.message}` : error.message))
    .join(' / ');
}

function formatBytes(size) {
  if (!Number.isFinite(size)) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  let nextSize = size;
  let unitIndex = 0;

  while (nextSize >= 1024 && unitIndex < units.length - 1) {
    nextSize /= 1024;
    unitIndex += 1;
  }

  const fixed = nextSize >= 10 || unitIndex === 0 ? 0 : 1;
  return `${nextSize.toFixed(fixed)} ${units[unitIndex]}`;
}

function getPageMeta(pathname) {
  const routeMeta = {
    '/': {
      eyebrow: 'Home',
      title: '문서형 퍼블리싱 허브',
      description: 'CSS 설명서의 톤과 구조를 기반으로 홈, 스크립트 문서, 토큰, 다운로드 화면을 하나의 문서 레이아웃으로 정리했습니다.',
    },
    '/docs/css': {
      eyebrow: 'Docs(CSS)',
      title: 'CSS 설명서',
      description: '색상, 표, TOC 중심 구조를 유지한 CSS 문서를 동일한 사이트 레이아웃 안에서 확인할 수 있습니다.',
    },
    '/docs/js': {
      eyebrow: 'Docs(JS)',
      title: '스크립트 모듈 설명서',
      description: '기능 설명, 테스트, 코드 복사를 모듈별로 바로 확인할 수 있도록 다시 정리했습니다.',
    },
    '/anim': {
      eyebrow: 'Anim',
      title: '애니메이션 모듈 설명서',
      description: 'fade, parallax, cascade, marquee, ticker, count를 GSAP 기반으로 테스트하고 속성 규칙을 바로 확인할 수 있도록 정리했습니다.',
    },
    '/tools': {
      eyebrow: 'Tools',
      title: '개발 보조 도구',
      description: 'px to vw, px to rem, img to webp 같은 퍼블리싱 보조 도구를 한 화면에서 바로 실행할 수 있도록 정리했습니다.',
    },
    '/validation': {
      eyebrow: 'Validation',
      title: '폼 유효성 검증 설명서',
      description: '필드 규칙, 그룹 검증, 메시지 타겟, blur/submit 흐름을 퍼블리셔 기준으로 바로 적용할 수 있게 정리했습니다.',
    },
    '/form': {
      eyebrow: 'Form',
      title: '실전형 폼 쇼케이스',
      description: '문의 폼과 가입 폼 예시로 submit 차단, summary, 첫 에러 포커스, 성공 상태를 한 화면에서 확인할 수 있습니다.',
    },
    '/plate': {
      eyebrow: 'Plate',
      title: '색상 토큰 아카이브',
      description: '공통 토큰을 그룹별로 확인하고 필요한 값을 바로 복사할 수 있습니다.',
    },
    '/download': {
      eyebrow: 'Download',
      title: '압축 파일 다운로드',
      description: '파일 구성 안내와 단일 다운로드 버튼 중심으로 단순한 구조를 유지합니다.',
    },
  };

  return routeMeta[pathname] || routeMeta['/'];
}
