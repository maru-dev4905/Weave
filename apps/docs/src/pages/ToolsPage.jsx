import { useEffect, useState } from 'react';
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
        title="On this page"
        items={[
          { href: activeTool ? '/tools' : '#tools-list', label: 'Tools List' },
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
              eyebrow="TOOLS"
              title="개발과 퍼블리싱 작업을 돕는 보조 도구"
              description="반복적으로 계산하거나 변환하는 작업을 문서 앱 안에서 바로 처리할 수 있습니다."
              align="wide"
            />

            <Section
              id="tools-list"
              eyebrow="LIST"
              title="Tools List"
              description="필요한 도구를 선택해 보다 빠르게 처리해보세요."
            >
              <div className="tools_list_grid">
                {tools.map((tool) => (
                  <Link
                    key={tool.id}
                    to={`/tools/${tool.id}`}
                    className={activeTool?.id === tool.id ? 'tools_list_card is_active' : 'tools_list_card'}
                  >
                    <span className="badge_pill">{tool.title}</span>
                    <strong>{tool.title}</strong>
                    <p>{tool.summary}</p>
                  </Link>
                ))}
              </div>
            </Section>
          </>
        ) : null}

        {activeTool ? (
          <>
            <div className="tools_back_row">
              <Link to="/tools" className="secondary_link_button tools_back_button">
                Tools List로 돌아가기
              </Link>
            </div>

            <Section
              id="tool-detail"
              eyebrow="TOOL"
              title={activeTool.title}
            >
              {renderToolPanel(activeTool.id)}
            </Section>
          </>
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
            <label>Base Width</label>
            <input value={base1} onChange={(event) => setBase1(event.target.value)} />
            <label>Decimals</label>
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
            <label>Base Width</label>
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
            <div className="tools_action_row">
              <CopyButton label="결과 복사" text={cssOutPx} message="CSS PX to VW 결과를 복사했습니다." />
            </div>
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
      setToastMessage('전송이 실패했습니다');
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
      setToastMessage('전송이 실패했습니다');
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
          <input type="file" accept=".jpg,.jpeg,.png,.gif,.bmp,.webp" multiple onChange={handleFileChange} />
          <strong>이미지를 드롭하거나 클릭해서 선택하세요</strong>
          <p>이미지 확장자 파일만 업로드할 수 있으며 변환 실패 시 토스트 메시지가 표시됩니다.</p>
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
                  <p>{formatBytes(file.originalSize)} to {formatBytes(file.size)}</p>
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
