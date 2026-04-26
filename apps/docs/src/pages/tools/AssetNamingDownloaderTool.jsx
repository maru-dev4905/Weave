import { useMemo, useState } from 'react';

import JSZip from 'jszip';

import { Card } from '../../components/Card.jsx';
import { dedupeFileName, normalizeAssetName, splitBaseAndExt } from './utils.js';

export function AssetNamingDownloaderTool() {
  const [files, setFiles] = useState([]);
  const [prefix, setPrefix] = useState('weave');
  const [suffix, setSuffix] = useState('');
  const [useSuffixText, setUseSuffixText] = useState(false);
  const [autoNumberSuffix, setAutoNumberSuffix] = useState(false);
  const [useSuffixUnderscore, setUseSuffixUnderscore] = useState(true);
  const [renamed, setRenamed] = useState([]);

  const preview = useMemo(() => '[prefix]_[origin file name]_[suffix].[확장자]', []);

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

  const clearAll = () => {
    setFiles([]);
    setRenamed([]);
  };

  const convert = () => {
    const used = new Set();
    const next = files.map((entry, index) => {
      const normalizedBase = normalizeAssetName(entry.editBase || entry.originalBase || '');
      const numbered = autoNumberSuffix ? String(index + 1) : '';
      const textSuffix = useSuffixText ? suffix : '';
      const suffixWithNumber = `${textSuffix}${numbered}`;
      const prefixPart = prefix ? `${prefix}_` : '';
      const suffixPart = suffixWithNumber ? `${useSuffixUnderscore ? '_' : ''}${suffixWithNumber}` : '';
      const finalName = `${prefixPart}${normalizedBase}${suffixPart}${entry.extension ? `.${entry.extension.toLowerCase()}` : ''}`;

      return {
        ...entry,
        finalName: dedupeFileName(finalName, used),
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
          <label className="tools_dropzone" data-weave-file-drop="assetNamingDrop">
            <input id="asset-naming-file-input" type="file" multiple onChange={handleFileInput} />
            <strong>파일을 드롭하거나 클릭해 업로드하세요</strong>
            <p>업로드 후 아래 목록에서 파일명을 직접 수정할 수 있습니다.</p>
          </label>
          <p id="asset-naming-feedback" className="tools_option_hint" />
          <p className="tools_option_hint">
            업로드 {files.length}건 / 변환 결과 {renamed.length}건
          </p>
          <label>prefix (option)</label>
          <input value={prefix} onChange={(event) => setPrefix(event.target.value)} />
          <label className="tools_check">
            <input type="checkbox" checked={useSuffixText} onChange={(event) => setUseSuffixText(event.target.checked)} />
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
                    <input value={entry.editBase} onChange={(event) => updateBaseName(index, event.target.value)} />
                    <span className="tools_file_ext">.{entry.extension || '확장자없음'}</span>
                    <button type="button" className="tools_file_remove_button" onClick={() => removeFileItem(index)}>
                      지우기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="tools_action_row">
            <button type="button" onClick={convert} disabled={!files.length}>변환</button>
            <button type="button" onClick={clearAll} disabled={!files.length}>전체 지우기</button>
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
