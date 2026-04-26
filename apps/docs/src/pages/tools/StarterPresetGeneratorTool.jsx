import { useState } from 'react';

import { Card } from '../../components/Card.jsx';
import { CopyButton } from '../../components/CopyButton.jsx';
import { starterPluginOptions } from './constants.js';

export function StarterPresetGeneratorTool() {
  const [selected, setSelected] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [result, setResult] = useState('');

  const toggle = (name) => {
    setSelected((prev) => {
      const next = prev.includes(name) ? prev.filter((entry) => entry !== name) : [...prev, name];
      setSelectAll(next.length === starterPluginOptions.length);
      return next;
    });
  };

  const toggleAll = (checked) => {
    setSelectAll(checked);
    setSelected(checked ? [...starterPluginOptions] : []);
  };

  const generate = () => {
    if (!selected.length) {
      setResult("import { createWeave } from '@weave/wv';\n\nconst app = createWeave({\n  plugins: [],\n});\n\napp.mount();");
      return;
    }
    const importLine = `import { createWeave, ${selected.join(', ')} } from '@weave/wv';`;
    const pluginLines = selected.map((name) => `    ${name}(),`).join('\n');
    setResult(`${importLine}\n\nconst app = createWeave({\n  plugins: [\n${pluginLines}\n  ],\n});\n\napp.mount();`);
  };

  return (
    <Card>
      <div className="demo_card_head">
        <div>
          <h3>Starter Preset Generator</h3>
          <p>
            프로젝트 시작 시 어떤 플러그인을 기본 탑재할지 선택하고 `createWeave` 초기화 코드를 자동 생성합니다.
            <br />
            팀 템플릿이나 starter-kit `prj.js` 초안 작성에 바로 붙여넣을 수 있습니다.
          </p>
        </div>
      </div>
      <div className="tools_box mt_20">
        <label className="tools_check">
          <input type="checkbox" checked={selectAll} onChange={(event) => toggleAll(event.target.checked)} />
          전체 선택
        </label>
        <label>플러그인 선택</label>
        <div className="tools_action_row">
          {starterPluginOptions.map((name) => (
            <label key={name} className="tools_check">
              <input type="checkbox" checked={selected.includes(name)} onChange={() => toggle(name)} />
              {name}
            </label>
          ))}
        </div>
        <button type="button" onClick={generate}>코드 생성</button>
        <textarea className="tools_tall_textarea" value={result} readOnly />
        <div className="tools_action_row">
          <CopyButton label="코드 복사" text={result} message="Starter preset 코드를 복사했습니다." />
        </div>
      </div>
    </Card>
  );
}
