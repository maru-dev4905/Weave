import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

import JSZip from 'jszip';

import { Card } from '../components/Card.jsx';
import { CopyButton } from '../components/CopyButton.jsx';
import { Section } from '../components/Section.jsx';
import { Sidebar } from '../components/Sidebar.jsx';

const tools = [
  {
    id: 'px-to-vw',
    title: 'PX to VW',
    summary: 'px와 vw를 상호 변환하고 CSS 문자열도 한 번에 바꿀 수 있습니다.',
  },
  {
    id: 'px-to-rem',
    title: 'PX to REM',
    summary: 'base font-size 기준으로 px와 rem을 바로 계산합니다.',
  },
  {
    id: 'img-to-webp',
    title: 'IMG to WEBP',
    summary: '이미지를 WebP로 변환하고 개별 또는 ZIP으로 내려받을 수 있습니다.',
  },
  {
    id: 'plugin-attribute-linter',
    title: 'Plugin Attribute Linter',
    summary: 'HTML의 data-weave-* 속성을 점검해 플러그인 규칙 누락을 찾습니다.',
  },
  {
    id: 'starter-preset-generator',
    title: 'Starter Preset Generator',
    summary: '선택한 플러그인 조합으로 starter kit preset 코드를 생성합니다.',
  },
  {
    id: 'validation-rule-builder',
    title: 'Validation Rule Builder',
    summary: '폼 필드 규칙을 입력하면 validation 설정 객체를 만들어줍니다.',
  },
  {
    id: 'asset-naming-helper',
    title: 'Asset Naming Downloader',
    summary: '파일 업로드 후 파일명을 일괄 변경하고 ZIP으로 내려받을 수 있습니다.',
  },
];

const removeCssProps = [
  'overflow',
  'display',
  'float',
  'text-align',
  'background-color',
  'background-size',
  'background-repeat',
  'background-position',
  'color',
  'font-weight',
  'z-index',
  'border-collapse',
  'table-layout',
  'vertical-align',
  'position',
  'box-sizing',
  'font-family',
  'content',
];

export function ToolsPage() {
  const { toolId } = useParams();
  const activeTool = toolId ? tools.find((tool) => tool.id === toolId) : null;

  if (toolId && !activeTool) {
    return <Navigate to="/tools" replace />;
  }

  return (
    <div className="page_shell page_shell_with_sidebar">
      <Sidebar
        title="이 페이지에서"
        items={[
          { href: activeTool ? '/tools' : '#tools-list', label: '도구 목록' },
          ...tools.map((tool) => ({
            href: `/tools/${tool.id}`,
            label: tool.title,
            depth: 2,
          })),
        ]}
      />

      <div className="page_content">
        {!activeTool ? (
          <>
            <Section
              id="overview"
              eyebrow="도구"
              title="개발과 퍼블리싱 작업을 돕는 보조 도구"
              description="반복적으로 계산하거나 변환하는 작업을 문서 앱 안에서 바로 처리할 수 있습니다."
              align="wide"
            />

            <Section
              id="tools-list"
              eyebrow="목록"
              title="도구 목록"
              description="필요한 도구를 선택해 보다 빠르게 처리해보세요."
            >
              <div className="tools_list_grid">
                {tools.map((tool) => (
                  <Link
                    key={tool.id}
                    to={`/tools/${tool.id}`}
                    className={activeTool?.id === tool.id ? 'tools_list_card is_active' : 'tools_list_card'}
                  >
                    <strong>{tool.title}</strong>
                    <p>{tool.summary}</p>
                  </Link>
                ))}
              </div>
            </Section>
          </>
        ) : null}

        {activeTool ? (
          <Section
            id="tool-detail"
            eyebrow="도구"
            title={activeTool.title}
          >
            {renderToolPanel(activeTool.id)}
          </Section>
        ) : null}
      </div>
    </div>
  );
}

function renderToolPanel(toolId) {
  if (toolId === 'px-to-vw') {
    return <PxToVwTool />;
  }

  if (toolId === 'px-to-rem') {
    return <PxToRemTool />;
  }

  if (toolId === 'img-to-webp') {
    return <ImgToWebpTool />;
  }

  if (toolId === 'plugin-attribute-linter') {
    return <PluginAttributeLinterTool />;
  }

  if (toolId === 'starter-preset-generator') {
    return <StarterPresetGeneratorTool />;
  }

  if (toolId === 'validation-rule-builder') {
    return <ValidationRuleBuilderTool />;
  }

  if (toolId === 'asset-naming-helper') {
    return <AssetNamingHelperTool />;
  }

  return null;
}

function PxToVwTool() {
  const [px, setPx] = useState('300');
  const [vw, setVw] = useState('');
  const [vwInput, setVwInput] = useState('10');
  const [pxOutput, setPxOutput] = useState('');
  const [base1, setBase1] = useState('1920');
  const [base2, setBase2] = useState('1920');
  const [decimals, setDecimals] = useState('2');
  const [cssBase1, setCssBase1] = useState('1920');
  const [cssBase2, setCssBase2] = useState('1920');
  const [cssDecimals, setCssDecimals] = useState('2');
  const [cssSrcPx, setCssSrcPx] = useState('');
  const [cssOutPx, setCssOutPx] = useState('');
  const [cssSrcVw, setCssSrcVw] = useState('');
  const [cssOutVw, setCssOutVw] = useState('');
  const [stripPx, setStripPx] = useState(false);
  const [stripVw, setStripVw] = useState(false);

  const convertPxToVw = () => {
    const result = toFixedSafe(num(px) / (num(base1) / 100), num(decimals, 2));
    setVw(result);
  };

  const convertVwToPx = () => {
    const result = Math.round(num(vwInput) * (num(base2) / 100));
    setPxOutput(String(result));
  };

  const convertCssPxToVw = () => {
    let out = cssSrcPx.replace(/(\d*\.?\d+)\s*px/gi, (_, value) => {
      return `${toFixedSafe(num(value) / (num(cssBase1) / 100), num(cssDecimals, 2))}vw`;
    });

    if (stripPx) {
      out = stripProperties(out);
    }

    setCssOutPx(out);
  };

  const convertCssVwToPx = () => {
    let out = cssSrcVw.replace(/(\d*\.?\d+)\s*vw/gi, (_, value) => {
      return `${Math.round(num(value) * (num(cssBase2) / 100))}px`;
    });

    if (stripVw) {
      out = stripProperties(out);
    }

    setCssOutVw(out);
  };

  return (
    <div className="tools_stack">
      <Card>
        <div className="demo_card_head">
          <div>
            <h3>숫자 변환</h3>
            <p>단일 값 기준으로 px와 vw를 상호 변환합니다.</p>
          </div>
        </div>

        <div className="tools_panel_grid mt_20">
          <div className="tools_box">
            <h4>PX to VW</h4>
            <label>PX</label>
            <input value={px} onChange={(event) => setPx(event.target.value)} />
            <label>기준 너비</label>
            <input value={base1} onChange={(event) => setBase1(event.target.value)} />
            <label>소수점 자리</label>
            <input value={decimals} onChange={(event) => setDecimals(event.target.value)} />
            <button type="button" onClick={convertPxToVw}>변환</button>
            <textarea value={vw} readOnly />
            <div className="tools_action_row">
              <CopyButton label="결과 복사" text={vw} message="PX to VW 결과를 복사했습니다." />
            </div>
          </div>

          <div className="tools_box">
            <h4>VW to PX</h4>
            <label>VW</label>
            <input value={vwInput} onChange={(event) => setVwInput(event.target.value)} />
            <label>기준 너비</label>
            <input value={base2} onChange={(event) => setBase2(event.target.value)} />
            <button type="button" onClick={convertVwToPx}>변환</button>
            <textarea value={pxOutput} readOnly />
            <div className="tools_action_row">
              <CopyButton label="결과 복사" text={pxOutput} message="VW to PX 결과를 복사했습니다." />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="demo_card_head">
          <div>
            <h3>CSS 변환</h3>
            <p>CSS 문자열 안 px 또는 vw 단위를 한 번에 치환합니다.</p>
          </div>
        </div>

        <div className="tools_panel_grid mt_20">
          <div className="tools_box">
            <h4>CSS PX to VW</h4>
            <label>원본 CSS</label>
            <textarea value={cssSrcPx} onChange={(event) => setCssSrcPx(event.target.value)} />
            <label>기준 너비</label>
            <input value={cssBase1} onChange={(event) => setCssBase1(event.target.value)} />
            <label>소수점 자리</label>
            <input value={cssDecimals} onChange={(event) => setCssDecimals(event.target.value)} />
            <label className="tools_check">
              <input type="checkbox" checked={stripPx} onChange={(event) => setStripPx(event.target.checked)} />
              속성 제거 목록 적용
            </label>
            <button type="button" onClick={convertCssPxToVw}>변환</button>
            <textarea value={cssOutPx} readOnly />
            <div className="tools_action_row">
              <CopyButton label="결과 복사" text={cssOutPx} message="CSS PX to VW 결과를 복사했습니다." />
            </div>
          </div>

          <div className="tools_box">
            <h4>CSS VW to PX</h4>
            <label>원본 CSS</label>
            <textarea value={cssSrcVw} onChange={(event) => setCssSrcVw(event.target.value)} />
            <label>기준 너비</label>
            <input value={cssBase2} onChange={(event) => setCssBase2(event.target.value)} />
            <label className="tools_check">
              <input type="checkbox" checked={stripVw} onChange={(event) => setStripVw(event.target.checked)} />
              속성 제거 목록 적용
            </label>
            <button type="button" onClick={convertCssVwToPx}>변환</button>
            <textarea value={cssOutVw} readOnly />
            <div className="tools_action_row">
              <CopyButton label="결과 복사" text={cssOutVw} message="CSS VW to PX 결과를 복사했습니다." />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function PxToRemTool() {
  const [px, setPx] = useState('16');
  const [rem, setRem] = useState('1');
  const [baseFont, setBaseFont] = useState('16');
  const [resultValue, setResultValue] = useState('1');
  const [resultUnit, setResultUnit] = useState('REM');

  const handlePxChange = (value) => {
    const nextRem = formatNumber(num(value) / num(baseFont, 16));
    setPx(value);
    setRem(nextRem);
    setResultValue(nextRem || '0');
    setResultUnit('REM');
  };

  const handleRemChange = (value) => {
    const nextPx = formatNumber(num(value) * num(baseFont, 16));
    setRem(value);
    setPx(nextPx);
    setResultValue(nextPx || '0');
    setResultUnit('PX');
  };

  const handleBaseChange = (value) => {
    setBaseFont(value);
    if (px) {
      const nextRem = formatNumber(num(px) / num(value, 16));
      setRem(nextRem);
      setResultValue(nextRem || '0');
      setResultUnit('REM');
    }
  };

  return (
    <Card>
      <div className="demo_card_head">
        <div>
          <h3>PX to REM</h3>
          <p>기준 폰트 크기를 바꾸면 px와 rem 계산값도 같이 갱신됩니다.</p>
        </div>
      </div>

      <div className="tools_rem_layout mt_20">
        <div className="tools_box tools_rem_box">
          <label>Base Font Size</label>
          <input value={baseFont} onChange={(event) => handleBaseChange(event.target.value)} />

          <div className="tools_rem_inputs">
            <div className="tools_rem_field">
              <label>PX</label>
              <input value={px} onChange={(event) => handlePxChange(event.target.value)} />
            </div>
            <span className="tools_rem_to">to</span>
            <div className="tools_rem_field">
              <label>REM</label>
              <input value={rem} onChange={(event) => handleRemChange(event.target.value)} />
            </div>
          </div>

          <div className="tools_rem_result">
            <span className="tools_rem_result_label">RESULT</span>
            <strong>{resultValue}</strong>
            <p>{resultUnit}</p>
          </div>

          <div className="tools_action_row tools_action_row_center">
            <CopyButton
              label="결과 복사"
              text={`${resultValue}${resultUnit.toLowerCase()}`}
              message="PX to REM 결과를 복사했습니다."
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

function ImgToWebpTool() {
  const [quality, setQuality] = useState(90);
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        URL.revokeObjectURL(file.url);
        URL.revokeObjectURL(file.originalUrl);
      });
    };
  }, [files]);

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage('');
    }, 1800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toastMessage]);

  const processFiles = async (inputFiles) => {
    if (!inputFiles?.length) {
      return;
    }

    const selectedFiles = Array.from(inputFiles);
    const hasInvalidExtension = selectedFiles.some((file) => !isImageExtensionFile(file));

    if (hasInvalidExtension) {
      setToastMessage('이미지 파일만 업로드할 수 있습니다');
      return;
    }

    setIsProcessing(true);
    files.forEach((file) => {
      URL.revokeObjectURL(file.url);
      URL.revokeObjectURL(file.originalUrl);
    });

    try {
      const results = [];
      for (const file of selectedFiles) {
        const converted = await convertImageToWebp(file, quality / 100);
        results.push(converted);
      }

      setFiles(results);
    } catch {
      setToastMessage('이미지 변환에 실패했습니다');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = async (event) => {
    await processFiles(event.target.files);
    event.target.value = '';
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    await processFiles(event.dataTransfer.files);
  };

  const downloadAll = async () => {
    if (!files.length) return;

    const zip = new JSZip();
    files.forEach((file) => {
      zip.file(file.filename, file.blob);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted_images.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tools_stack">
      <Card>
        <div className="demo_card_head">
          <div>
            <h3>IMG to WEBP</h3>
            <p>드래그 앤 드롭 또는 파일 선택으로 이미지를 WebP로 변환하고 품질 값을 함께 제어합니다.</p>
          </div>
        </div>

        <div className="tools_img_controls mt_20">
          <label htmlFor="tools-quality-range">품질: {quality}%</label>
          <input
            id="tools-quality-range"
            type="range"
            min="1"
            max="100"
            value={quality}
            onChange={(event) => setQuality(Number(event.target.value))}
          />
        </div>

        <label
          className="tools_dropzone mt_20"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <input type="file" accept=".jpg,.jpeg,.png,.gif,.bmp,.webp" multiple onChange={handleFileChange} />
          <strong>이미지를 드롭하거나 클릭해서 선택하세요</strong>
          <p>이미지 파일만 업로드할 수 있으며 변환 실패 시 안내 토스트가 표시됩니다.</p>
        </label>

        <div className="tools_img_actions mt_20">
          <button type="button" className="primary_button" onClick={downloadAll} disabled={!files.length}>
            전체 ZIP 다운로드
          </button>
          <CopyButton
            label="파일명 목록 복사"
            text={files.map((file) => file.filename).join('\n')}
            message="WEBP 파일명 목록을 복사했습니다."
          />
          {isProcessing ? <span>변환 중...</span> : null}
        </div>
      </Card>

      <Card>
        <div className="demo_card_head">
          <div>
            <h3>변환 결과</h3>
            <p>원본 파일명과 변환 후 용량을 바로 비교할 수 있습니다.</p>
          </div>
        </div>

        <div className="tools_results_list mt_20">
          {files.length ? files.map((file) => (
            <div key={file.filename} className="tools_result_item">
              <div className="tools_result_preview">
                <div className="tools_result_thumb_group">
                  <div className="tools_result_thumb">
                    <img src={file.originalUrl} alt={`${file.originalName} original preview`} />
                    <span>원본</span>
                  </div>
                  <div className="tools_result_thumb">
                    <img src={file.url} alt={`${file.filename} converted preview`} />
                    <span>WEBP</span>
                  </div>
                </div>
                <div className="tools_result_copy">
                  <strong>{file.originalName}</strong>
                  <p>{file.width} x {file.height}</p>
                  <p>{formatBytes(file.originalSize)} -> {formatBytes(file.size)}</p>
                  <p>{file.savingRate}% 절감</p>
                </div>
              </div>
              <div className="tools_result_actions">
                <CopyButton label="이름 복사" text={file.filename} message="파일명을 복사했습니다." />
                <a href={file.url} download={file.filename}>다운로드</a>
              </div>
            </div>
          )) : <p className="tools_empty_text">아직 변환된 이미지가 없습니다.</p>}
        </div>
      </Card>

      <div className={toastMessage ? 'tools_toast is_visible' : 'tools_toast'}>{toastMessage}</div>
    </div>
  );
}

function PluginAttributeLinterTool() {
  const [plugin, setPlugin] = useState('all');
  const [markup, setMarkup] = useState('<div data-weave-tabs>\n  <button data-weave-tabs-button="tabA">A</button>\n  <div data-weave-tabs-panel="tabA"></div>\n</div>');
  const [result, setResult] = useState('');

  const lint = () => {
    const targetEntries = plugin === 'all'
      ? Object.entries(pluginAttributeSpec)
      : [[plugin, pluginAttributeSpec[plugin]]];

    const lines = targetEntries.flatMap(([name, spec]) => {
      if (!spec) {
        return [`[${name}] 지원하지 않는 플러그인입니다.`];
      }

      const missingRequired = spec.required
        .filter((attribute) => !markup.includes(attribute))
        .map((attribute) => `- 필수 누락: ${attribute}`);

      const missingRecommended = spec.recommended
        .filter((entry) => !markup.includes(entry.attribute))
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

function StarterPresetGeneratorTool() {
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
    const importLine = `import { createWeave, ${selected.join(', ')} } from '@weave/wv';`;
    const pluginLines = selected.map((name) => `    ${name}(),`).join('\n');
    const output = `${importLine}

const app = createWeave({
  plugins: [
${pluginLines}
  ],
});

app.mount();`;
    setResult(output);
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

function ValidationRuleBuilderTool() {
  const [fieldId, setFieldId] = useState('signupPassword');
  const [fieldType, setFieldType] = useState('text');
  const [minLength, setMinLength] = useState('8');
  const [pattern, setPattern] = useState('');
  const [errorMessage, setErrorMessage] = useState('필수 입력 항목입니다.');
  const [patternErrorMessage, setPatternErrorMessage] = useState('');
  const [result, setResult] = useState('');

  const build = () => {
    const isCheckField = fieldType === 'checkbox' || fieldType === 'radio';
    const includeMinLength = !isCheckField && num(minLength) > 0;
    const includePattern = !isCheckField && pattern.trim();

    const config = {
      [fieldId]: {
        type: fieldType,
        required: true,
        ...(includeMinLength ? { minlength: num(minLength) } : {}),
        ...(includePattern ? { pattern: pattern.trim() } : {}),
        messages: {
          required: errorMessage || '필수 입력 항목입니다.',
          ...(includeMinLength ? { minlength: errorMessage || '최소 길이 조건을 만족해야 합니다.' } : {}),
          ...(includePattern ? { pattern: patternErrorMessage || '패턴 형식이 올바르지 않습니다.' } : {}),
        },
      },
    };

    setResult(JSON.stringify(config, null, 2));
  };

  return (
    <Card>
      <div className="demo_card_head">
        <div>
          <h3>Validation Rule Builder</h3>
          <p>
            필드 타입별 검증 규칙을 입력하면 validation `fields` 설정 JSON을 생성합니다.
            <br />
            체크박스/라디오는 선택되지 않았을 때 `required` 에러를 반환하는 형태로 설정됩니다.
          </p>
        </div>
      </div>
      <div className="tools_panel_grid mt_20">
        <div className="tools_box">
          <label>Field ID</label>
          <input value={fieldId} onChange={(event) => setFieldId(event.target.value)} />
          <label>Field Type</label>
          <div className="tools_action_row">
            {['text', 'number', 'email', 'password', 'checkbox', 'radio'].map((type) => (
              <label key={type} className="tools_check">
                <input
                  type="radio"
                  name="validation-field-type"
                  checked={fieldType === type}
                  onChange={() => setFieldType(type)}
                />
                {type}
              </label>
            ))}
          </div>
          {fieldType === 'text' ? (
            <>
              <label>minlength</label>
              <input value={minLength} onChange={(event) => setMinLength(event.target.value)} />
              <label>pattern (optional)</label>
              <input value={pattern} onChange={(event) => setPattern(event.target.value)} />
            </>
          ) : null}
          <label>error message</label>
          <input value={errorMessage} onChange={(event) => setErrorMessage(event.target.value)} />
          <label>pattern error message (optional)</label>
          <input value={patternErrorMessage} onChange={(event) => setPatternErrorMessage(event.target.value)} />
          <button type="button" onClick={build}>생성</button>
          <textarea className="tools_tall_textarea" value={result} readOnly />
          <div className="tools_action_row">
            <CopyButton label="코드 복사" text={result} message="Validation 설정 코드를 복사했습니다." />
          </div>
        </div>
      </div>
    </Card>
  );
}

function AssetNamingHelperTool() {
  const [files, setFiles] = useState([]);
  const [prefix, setPrefix] = useState('weave');
  const [suffix, setSuffix] = useState('');
  const [useSuffixText, setUseSuffixText] = useState(false);
  const [autoNumberSuffix, setAutoNumberSuffix] = useState(false);
  const [useSuffixUnderscore, setUseSuffixUnderscore] = useState(true);
  const [renamed, setRenamed] = useState([]);

  const preview = useMemo(
    () => '[prefix]_[origin file name]_[suffix].[확장자]',
    []
  );

  const handleFileInput = (event) => {
    const nextFiles = Array.from(event.target.files || []);
    if (!nextFiles.length) return;

    setFiles(nextFiles.map((file) => ({
      file,
      originalName: file.name,
      originalBase: splitBaseAndExt(file.name)[0],
      extension: splitBaseAndExt(file.name)[1],
      editBase: splitBaseAndExt(file.name)[0],
    })));
    setRenamed([]);
  };

  const updateBaseName = (index, value) => {
    setFiles((prev) => prev.map((entry, idx) => (idx === index ? { ...entry, editBase: value } : entry)));
  };

  const removeFileItem = (index) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
    setRenamed((prev) => prev.filter((_, idx) => idx !== index));
  };

  const convert = () => {
    const next = files.map((entry, index) => {
      const normalizedBase = normalizeAssetName(entry.editBase || entry.originalBase || '');
      const numbered = autoNumberSuffix ? String(index + 1) : '';
      const textSuffix = useSuffixText ? suffix : '';
      const suffixWithNumber = `${textSuffix}${numbered}`;
      const prefixPart = prefix ? `${prefix}_` : '';
      const suffixPart = suffixWithNumber
        ? `${useSuffixUnderscore ? '_' : ''}${suffixWithNumber}`
        : '';
      const finalName = `${prefixPart}${normalizedBase}${suffixPart}`;
      return {
        ...entry,
        finalName: `${finalName}${entry.extension ? `.${entry.extension.toLowerCase()}` : ''}`,
      };
    });
    setRenamed(next);
  };

  const downloadRenamedZip = async () => {
    if (!renamed.length) return;
    const zip = new JSZip();
    renamed.forEach((entry) => {
      zip.file(entry.finalName, entry.file);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'renamed_assets.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <div className="demo_card_head">
        <div>
          <h3>Asset Naming Downloader</h3>
          <p>
            파일을 업로드하고 파일명을 직접 수정한 뒤 prefix/suffix 규칙으로 일괄 변환하여 ZIP으로 내려받습니다.
            <br />
            드래그 앤 드롭은 WEAVE `fileDrop` 플러그인 규약(`data-weave-file-drop`)을 사용합니다.
          </p>
        </div>
      </div>
      <div className="tools_panel_grid mt_20">
        <div className="tools_box">
          <label
            className="tools_dropzone"
            data-weave-file-drop="assetNamingDrop"
          >
            <input id="asset-naming-file-input" type="file" multiple onChange={handleFileInput} />
            <strong>파일을 드롭하거나 클릭해 업로드하세요</strong>
            <p>업로드 후 아래 목록에서 파일명을 직접 수정할 수 있습니다.</p>
          </label>
          <p id="asset-naming-feedback" className="tools_option_hint" />
          <label>prefix (option)</label>
          <input value={prefix} onChange={(event) => setPrefix(event.target.value)} />
          <label className="tools_check">
            <input
              type="checkbox"
              checked={useSuffixText}
              onChange={(event) => setUseSuffixText(event.target.checked)}
            />
            suffix text type
          </label>
          {useSuffixText ? (
            <>
              <label>suffix text (option)</label>
              <input value={suffix} onChange={(event) => setSuffix(event.target.value)} />
            </>
          ) : null}
          <label className="tools_check">
            <input
              type="checkbox"
              checked={autoNumberSuffix}
              onChange={(event) => setAutoNumberSuffix(event.target.checked)}
            />
            suffix number type (업로드 순서 기준 1..n 자동 부여)
          </label>
          <label className="tools_check">
            <input
              type="checkbox"
              checked={useSuffixUnderscore}
              onChange={(event) => setUseSuffixUnderscore(event.target.checked)}
            />
            suffix 앞 `_` 사용
          </label>
          <p className="tools_option_hint">예시 파일명: {preview}</p>

          {files.length ? (
            <div className="tools_file_edit_list">
              {files.map((entry, index) => (
                <div key={`${entry.originalName}-${index}`} className="tools_file_edit_item">
                  <div className="tools_file_item_row">
                    <label>원본: {entry.originalName}</label>
                    <input
                      value={entry.editBase}
                      onChange={(event) => updateBaseName(index, event.target.value)}
                    />
                    <span className="tools_file_ext">.{entry.extension || '확장자없음'}</span>
                    <button
                      type="button"
                      className="tools_file_remove_button"
                      onClick={() => removeFileItem(index)}
                    >
                      지우기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="tools_action_row">
            <button type="button" onClick={convert} disabled={!files.length}>변환</button>
            {renamed.length ? (
              <button type="button" onClick={downloadRenamedZip}>다운로드</button>
            ) : null}
          </div>

          {renamed.length ? (
            <textarea
              className="tools_tall_textarea"
              value={renamed.map((entry) => `${entry.originalName} -> ${entry.finalName}`).join('\n')}
              readOnly
            />
          ) : null}
        </div>
      </div>
    </Card>
  );
}

async function convertImageToWebp(file, quality) {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0);

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/webp', quality);
  });

  const safeBlob = blob || file;
  const url = URL.createObjectURL(safeBlob);
  const originalUrl = URL.createObjectURL(file);
  const savingRate = Math.max(0, Math.round((1 - (safeBlob.size / Math.max(file.size, 1))) * 100));

  return {
    originalName: file.name,
    originalSize: file.size,
    originalUrl,
    filename: `${file.name.split('.').slice(0, -1).join('.') || file.name}.webp`,
    blob: safeBlob,
    size: safeBlob.size,
    url,
    width: image.width,
    height: image.height,
    savingRate,
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function stripProperties(cssText) {
  const tail = '\\s*:\\s*[^;]*?(?:\\s*!important)?\\s*;';
  let out = cssText;

  removeCssProps.forEach((prop) => {
    const regex = new RegExp(prop + tail, 'gi');
    out = out.replace(regex, '');
  });

  return out;
}

function num(value, fallback = 0) {
  const parsed = Number.parseFloat(String(value ?? '').replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toFixedSafe(value, decimals) {
  return Number(value).toFixed(Math.max(0, decimals));
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return '';
  return String(Number.parseFloat(value.toFixed(4)));
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

function isImageExtensionFile(file) {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension);
}

const pluginAttributeSpec = {
  copy: {
    required: ['data-weave-copy'],
    recommended: [
      { attribute: 'data-weave-copy-target', why: '복사할 텍스트 소스를 명확히 지정할 수 있습니다.' },
      { attribute: 'data-weave-copy-message', why: '복사 성공 피드백 메시지를 커스텀할 수 있습니다.' },
    ],
  },
  fileDrop: {
    required: ['data-weave-file-drop'],
    recommended: [
      { attribute: 'data-weave-file-drop-list', why: '선택된 파일 목록을 사용자에게 즉시 보여줍니다.' },
    ],
  },
  linkButton: {
    required: ['data-weave-link-button'],
    recommended: [
      { attribute: 'data-weave-link-href', why: '이동 URL을 명시해 버튼 동작을 예측 가능하게 합니다.' },
      { attribute: 'data-weave-link-blank', why: '새 탭 이동 여부를 제어할 수 있습니다.' },
    ],
  },
  targetButton: {
    required: ['data-weave-target-button'],
    recommended: [
      { attribute: 'data-weave-target', why: '제어할 대상 요소를 명확히 지정합니다.' },
      { attribute: 'data-weave-target-action', why: 'toggle/add/remove 등 의도를 명확히 지정합니다.' },
    ],
  },
  tabs: {
    required: ['data-weave-tabs', 'data-weave-tabs-button', 'data-weave-tabs-panel'],
    recommended: [
      { attribute: 'data-weave-tabs-active', why: '초기 활성 탭을 명시해 첫 렌더 혼란을 줄입니다.' },
    ],
  },
  accordion: {
    required: ['data-weave-accordion', 'data-weave-accordion-button', 'data-weave-accordion-panel'],
    recommended: [
      { attribute: 'data-weave-accordion-mode', why: 'single/multi 동작 모드를 명시할 수 있습니다.' },
    ],
  },
  modal: {
    required: ['data-weave-modal', 'data-weave-modal-open', 'data-weave-modal-close'],
    recommended: [
      { attribute: 'data-weave-modal-overlay', why: '오버레이를 통해 닫기 UX를 명확히 제공합니다.' },
    ],
  },
  hideToday: {
    required: ['data-weave-hide-today'],
    recommended: [
      { attribute: 'data-weave-hide-today-button', why: '오늘 하루 숨김 버튼을 분리해 제어성을 높입니다.' },
      { attribute: 'data-weave-hide-today-checkbox', why: '사용자 의사 확인을 체크박스로 명시할 수 있습니다.' },
    ],
  },
  scrollTo: {
    required: ['data-weave-scroll-target'],
    recommended: [
      { attribute: 'data-weave-scroll-offset', why: '고정 헤더가 있는 페이지에서 정확한 위치 정렬에 필요합니다.' },
      { attribute: 'data-weave-scroll-duration', why: '스크롤 속도를 조정해 UX를 안정화할 수 있습니다.' },
    ],
  },
  validation: {
    required: ['data-weave-validation'],
    recommended: [
      { attribute: 'data-weave-validation-message', why: '필드별 오류 위치를 제어해 가독성을 높입니다.' },
      { attribute: 'data-weave-validation-summary', why: '폼 전체 오류를 요약해 제출 실패 원인을 빠르게 파악하게 합니다.' },
    ],
  },
  anim: {
    required: ['data-weave-anim'],
    recommended: [
      { attribute: 'data-weave-anim-type', why: 'fade/parallax/cascade 등 애니메이션 타입을 명시합니다.' },
      { attribute: 'data-weave-anim-duration', why: '지속 시간을 제어해 움직임 일관성을 확보합니다.' },
    ],
  },
};

const starterPluginOptions = [
  'copyPlugin',
  'fileDropPlugin',
  'linkButtonPlugin',
  'targetButtonPlugin',
  'tabsPlugin',
  'accordionPlugin',
  'modalPlugin',
  'hideTodayPlugin',
  'scrollToPlugin',
  'validationPlugin',
];

function inferTokenFromClass(className) {
  const colorMatch = className.match(/^(?:fc|bgc)_([a-z0-9]+)_([0-9]+)$/i);
  if (!colorMatch) return null;
  return `${colorMatch[1].toLowerCase()}_${colorMatch[2]}`;
}

function normalizeAssetName(name) {
  return name
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function splitBaseAndExt(name) {
  const index = name.lastIndexOf('.');
  if (index <= 0 || index === name.length - 1) {
    return [name, ''];
  }
  return [name.slice(0, index), name.slice(index + 1)];
}
