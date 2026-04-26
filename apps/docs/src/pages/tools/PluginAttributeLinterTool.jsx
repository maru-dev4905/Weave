import { useState } from 'react';

import { Card } from '../../components/Card.jsx';
import { pluginAttributeSpec } from './constants.js';

export function PluginAttributeLinterTool() {
  const [plugin, setPlugin] = useState('all');
  const [markup, setMarkup] = useState('<div data-weave-tabs>\n  <button data-weave-tabs-button="tabA">A</button>\n  <div data-weave-tabs-panel="tabA"></div>\n</div>');
  const [result, setResult] = useState('');

  const lint = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<body>${markup}</body>`, 'text/html');
    const targets = plugin === 'all' ? Object.entries(pluginAttributeSpec) : [[plugin, pluginAttributeSpec[plugin]]];

    const lines = targets.flatMap(([name, spec]) => {
      if (!spec) return [`[${name}] 지원하지 않는 플러그인입니다.`];

      const missingRequired = spec.required
        .filter((attr) => !doc.querySelector(`[${attr}]`))
        .map((attr) => `- 필수 누락: ${attr}`);
      const missingRecommended = spec.recommended
        .filter((entry) => !doc.querySelector(`[${entry.attribute}]`))
        .map((entry) => `- 권장 누락: ${entry.attribute} (${entry.why})`);

      if (!missingRequired.length && !missingRecommended.length) {
        return [`[${name}] OK`];
      }
      return [`[${name}]`, ...missingRequired, ...missingRecommended];
    });

    if (lines.every((line) => line.endsWith('OK'))) {
      setResult('모든 필수/권장 속성이 확인되었습니다.');
      return;
    }

    setResult(lines.join('\n'));
  };

  return (
    <Card>
      <div className="demo_card_head">
        <div>
          <h3>Plugin Attribute Linter</h3>
          <p>
            이 도구는 HTML 안의 `data-weave-*` 속성이 플러그인 실행에 필요한 규칙을 충족하는지 확인합니다.
            필수 누락은 기능 오작동 가능성이 높고, 권장 누락은 접근성/상호작용 품질 저하 위험을 안내합니다.
          </p>
        </div>
      </div>
      <div className="tools_panel_grid mt_20">
        <div className="tools_box">
          <label>플러그인</label>
          <select value={plugin} onChange={(event) => setPlugin(event.target.value)}>
            <option value="all">all</option>
            {Object.keys(pluginAttributeSpec).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
          <label>HTML 마크업</label>
          <textarea value={markup} onChange={(event) => setMarkup(event.target.value)} />
          <button type="button" onClick={lint}>점검</button>
          <textarea className="tools_tall_textarea" value={result} readOnly />
        </div>
      </div>
    </Card>
  );
}
