import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import {
  accordionPlugin,
  copyPlugin,
  createWeave,
  hideTodayPlugin,
  modalPlugin,
  scrollToPlugin,
  tabsPlugin,
} from '@weave/wv/dist/js/core.js';

import { Navbar } from '../components/Navbar.jsx';

export function DocsLayout() {
  const location = useLocation();
  const [copyStatus, setCopyStatus] = useState('');
  const pageMeta = getPageMeta(location.pathname);

  useEffect(() => {
    const app = createWeave({
      debug: false,
      autoObserve: true,
      plugins: [
        copyPlugin(),
        tabsPlugin(),
        accordionPlugin(),
        modalPlugin(),
        hideTodayPlugin(),
        scrollToPlugin(),
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
        <header className="site_topbar">
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
            <p>문서, 테스트, 토큰, 다운로드 흐름을 한곳에서 확인할 수 있도록 정리했습니다.</p>
            <button
              type="button"
              className="copy_ghost_button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              위로 올라가기
            </button>
          </div>
        </footer>
      </div>
      <div className={copyStatus ? 'copy_toast is_visible' : 'copy_toast'}>{copyStatus}</div>
    </div>
  );
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
