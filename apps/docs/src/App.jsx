import { useEffect } from 'react';

import { createWeave } from '@weave/wv/dist/js/core.js';
import { copyPlugin } from '@weave/wv/dist/js/core.js';

import '@weave/wv/dist/css/wv.css';

export default function App() {
  useEffect(() => {
    const app = createWeave({
      debug: true,
      plugins: [copyPlugin()],
    });

    app.mount();

    return () => {
      app.destroy();
    };
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <div className="mt_20 fc_point1">WEAVE CSS OK</div>

      {/* copy test 1 */}
      <button data-weave-copy data-text="Hello WEAVE" style={{ marginTop: 20 }}>
        텍스트 복사
      </button>

      {/* copy test 2 */}
      <div id="copy_target" style={{ marginTop: 20 }}>
        Target Copy Text
      </div>

      <button className="weave_copy" data-target="#copy_target" style={{ marginTop: 10 }}>
        타겟 복사
      </button>

      {/* copy alert test */}
      <button
        data-weave-copy
        data-text="Alert Copy"
        data-copy-alert="true"
        data-copy-message="복사 완료!"
        style={{ marginTop: 10 }}
      >
        alert 복사
      </button>

      {/* 컬러 토큰 */}
      <style>{`
        :root{
          --point1:#ff4d4f;
        }
      `}</style>
    </div>
  );
}
