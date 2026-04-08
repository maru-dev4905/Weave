import { useEffect, useState } from 'react';

import JSZip from 'jszip';

import { Card } from '../components/Card.jsx';
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
  const [activeToolId, setActiveToolId] = useState(tools[0].id);

  return (
    <div className="page_shell page_shell_with_sidebar">
      <Sidebar
        title="On this page"
        items={[
          { href: '#overview', label: '개요' },
          { href: '#tools-list', label: 'Tools List' },
          { href: '#tool-panel', label: 'Tool Panel' },
        ]}
      />

      <div className="page_content">
        <Section
          id="overview"
          eyebrow="Tools"
          title="개발과 퍼블리싱 작업을 돕는 보조 도구"
          description="반복적으로 계산하거나 변환하는 작업을 문서 앱 안에서 바로 처리할 수 있도록 별도 Tools 페이지로 분리했습니다."
          align="wide"
        >
          <Card className="intro_banner">
            <div>
              <strong>Range</strong>
              <span>PX to VW, PX to REM, IMG to WEBP</span>
            </div>
            <div>
              <strong>Flow</strong>
              <span>{'목록 선택 -> 툴 패널 실행'}</span>
            </div>
            <div>
              <strong>Use Case</strong>
              <span>실무형 퍼블리싱 보조 도구</span>
            </div>
          </Card>
        </Section>

        <Section
          id="tools-list"
          eyebrow="List"
          title="Tools List"
          description="필요한 도구를 선택하면 같은 페이지 안에서 바로 해당 패널이 열리도록 구성했습니다."
        >
          <div className="tools_list_grid">
            {tools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                className={activeToolId === tool.id ? 'tools_list_card is_active' : 'tools_list_card'}
                onClick={() => setActiveToolId(tool.id)}
              >
                <span className="badge_pill">{tool.title}</span>
                <strong>{tool.title}</strong>
                <p>{tool.summary}</p>
              </button>
            ))}
          </div>
        </Section>

        <Section
          id="tool-panel"
          eyebrow="Panel"
          title={tools.find((tool) => tool.id === activeToolId)?.title || 'Tools'}
          description="선택한 도구의 입력값과 결과를 한 화면에서 바로 확인할 수 있습니다."
        >
          {activeToolId === 'px-to-vw' ? <PxToVwTool /> : null}
          {activeToolId === 'px-to-rem' ? <PxToRemTool /> : null}
          {activeToolId === 'img-to-webp' ? <ImgToWebpTool /> : null}
        </Section>
      </div>
    </div>
  );
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
            <label>Base Width</label>
            <input value={base1} onChange={(event) => setBase1(event.target.value)} />
            <label>Decimals</label>
            <input value={decimals} onChange={(event) => setDecimals(event.target.value)} />
            <button type="button" onClick={convertPxToVw}>변환</button>
            <textarea value={vw} readOnly />
          </div>

          <div className="tools_box">
            <h4>VW to PX</h4>
            <label>VW</label>
            <input value={vwInput} onChange={(event) => setVwInput(event.target.value)} />
            <label>Base Width</label>
            <input value={base2} onChange={(event) => setBase2(event.target.value)} />
            <button type="button" onClick={convertVwToPx}>변환</button>
            <textarea value={pxOutput} readOnly />
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
            <label>Source CSS</label>
            <textarea value={cssSrcPx} onChange={(event) => setCssSrcPx(event.target.value)} />
            <label>Base Width</label>
            <input value={cssBase1} onChange={(event) => setCssBase1(event.target.value)} />
            <label>Decimals</label>
            <input value={cssDecimals} onChange={(event) => setCssDecimals(event.target.value)} />
            <label className="tools_check">
              <input type="checkbox" checked={stripPx} onChange={(event) => setStripPx(event.target.checked)} />
              속성 제거 목록 적용
            </label>
            <button type="button" onClick={convertCssPxToVw}>변환</button>
            <textarea value={cssOutPx} readOnly />
          </div>

          <div className="tools_box">
            <h4>CSS VW to PX</h4>
            <label>Source CSS</label>
            <textarea value={cssSrcVw} onChange={(event) => setCssSrcVw(event.target.value)} />
            <label>Base Width</label>
            <input value={cssBase2} onChange={(event) => setCssBase2(event.target.value)} />
            <label className="tools_check">
              <input type="checkbox" checked={stripVw} onChange={(event) => setStripVw(event.target.checked)} />
              속성 제거 목록 적용
            </label>
            <button type="button" onClick={convertCssVwToPx}>변환</button>
            <textarea value={cssOutVw} readOnly />
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

  const handlePxChange = (value) => {
    setPx(value);
    setRem(formatNumber(num(value) / num(baseFont, 16)));
  };

  const handleRemChange = (value) => {
    setRem(value);
    setPx(formatNumber(num(value) * num(baseFont, 16)));
  };

  const handleBaseChange = (value) => {
    setBaseFont(value);
    if (px) {
      setRem(formatNumber(num(px) / num(value, 16)));
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

      <div className="tools_panel_grid mt_20">
        <div className="tools_box">
          <label>PX</label>
          <input value={px} onChange={(event) => handlePxChange(event.target.value)} />
          <label>REM</label>
          <input value={rem} onChange={(event) => handleRemChange(event.target.value)} />
          <label>Base Font Size</label>
          <input value={baseFont} onChange={(event) => handleBaseChange(event.target.value)} />
        </div>
      </div>
    </Card>
  );
}

function ImgToWebpTool() {
  const [quality, setQuality] = useState(90);
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        URL.revokeObjectURL(file.url);
      });
    };
  }, [files]);

  const processFiles = async (inputFiles) => {
    if (!inputFiles?.length) {
      return;
    }

    setIsProcessing(true);
    files.forEach((file) => {
      URL.revokeObjectURL(file.url);
    });

    const results = [];
    for (const file of Array.from(inputFiles)) {
      const converted = await convertImageToWebp(file, quality / 100);
      results.push(converted);
    }

    setFiles(results);
    setIsProcessing(false);
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
            <p>드래그 앤 드롭 또는 파일 선택으로 이미지를 WebP로 변환하고 품질 값도 함께 제어합니다.</p>
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
          <input type="file" accept="image/*" multiple onChange={handleFileChange} />
          <strong>이미지를 드롭하거나 클릭해서 선택하세요</strong>
          <p>JPG, PNG 등 브라우저에서 읽을 수 있는 이미지 파일을 WebP로 변환합니다.</p>
        </label>

        <div className="tools_img_actions mt_20">
          <button type="button" className="primary_button" onClick={downloadAll} disabled={!files.length}>
            전체 ZIP 다운로드
          </button>
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
              <div>
                <strong>{file.originalName}</strong>
                <p>{formatBytes(file.originalSize)} to {formatBytes(file.size)}</p>
              </div>
              <a href={file.url} download={file.filename}>다운로드</a>
            </div>
          )) : <p className="tools_empty_text">아직 변환된 이미지가 없습니다.</p>}
        </div>
      </Card>
    </div>
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

  return {
    originalName: file.name,
    originalSize: file.size,
    filename: `${file.name.split('.').slice(0, -1).join('.') || file.name}.webp`,
    blob: safeBlob,
    size: safeBlob.size,
    url,
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
