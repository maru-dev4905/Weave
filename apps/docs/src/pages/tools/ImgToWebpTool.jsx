import { useEffect, useState } from 'react';

import JSZip from 'jszip';

import { Card } from '../../components/Card.jsx';
import { CopyButton } from '../../components/CopyButton.jsx';
import { formatBytes } from './utils.js';

export function ImgToWebpTool() {
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
    if (!toastMessage) return undefined;
    const timeoutId = window.setTimeout(() => setToastMessage(''), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const processFiles = async (inputFiles) => {
    if (!inputFiles?.length) return;
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
    files.forEach((file) => zip.file(file.filename, file.blob));
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
                  <p>{formatBytes(file.originalSize)} {'->'} {formatBytes(file.size)}</p>
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

function isImageExtensionFile(file) {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension);
}
