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
      <main className="weave_main">
        <Outlet />
      </main>
      <div className={copyStatus ? 'copy_toast is_visible' : 'copy_toast'}>{copyStatus}</div>
    </div>
  );
}
