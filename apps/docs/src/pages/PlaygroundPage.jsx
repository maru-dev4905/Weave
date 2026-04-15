import { useEffect, useMemo, useRef, useState } from 'react';

import {
  accordionPlugin,
  copyPlugin,
  createWeave,
  modalPlugin,
  tabsPlugin,
} from '@weave/wv';

import { Card } from '../components/Card.jsx';
import { CodeBlock } from '../components/CodeBlock.jsx';
import { Section } from '../components/Section.jsx';
import { Sidebar } from '../components/Sidebar.jsx';

const sidebarItems = [
  { href: '#overview', label: '개요' },
  { href: '#editor', label: 'Editor' },
  { href: '#presets', label: 'Presets' },
];

const presets = [
  {
    id: 'copy',
    label: 'Copy Card',
    description: '복사 버튼과 카드 UI를 바로 확인하는 기본 프리셋입니다.',
    html: `<section class="playground-demo-stack">
  <div class="playground-demo-card">
    <span class="badge_pill">COPY</span>
    <h3>문구 복사 테스트</h3>
    <p id="playground-copy-target">WEAVE Playground copy target</p>
    <button
      type="button"
      class="copy_ghost_button weave_copy"
      data-text="WEAVE Playground copy target"
      data-copy-message="Playground 문구를 복사했습니다."
    >
      문구 복사
    </button>
  </div>
</section>`,
  },
  {
    id: 'tabs',
    label: 'Tabs Demo',
    description: '탭 버튼과 패널 바인딩을 미리보기에서 확인할 수 있습니다.',
    html: `<section class="playground-demo-stack">
  <div class="demo_tabs" data-weave-tabs>
    <div class="demo_tabs_buttons">
      <button type="button" class="active" data-weave-tabs-button>HTML</button>
      <button type="button" data-weave-tabs-button>CSS</button>
      <button type="button" data-weave-tabs-button>JS</button>
    </div>
    <div class="demo_tabs_panels">
      <div class="active" data-weave-tabs-panel>HTML structure preview</div>
      <div data-weave-tabs-panel>CSS utility preview</div>
      <div data-weave-tabs-panel>JS runtime preview</div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'accordion',
    label: 'Accordion Demo',
    description: 'single/multi 패턴 중 기본 아코디언 구조를 빠르게 실험합니다.',
    html: `<section class="playground-demo-stack">
  <ul class="demo_accordion" data-weave-accordion data-weave-accordion-mode="single">
    <li class="active" data-weave-accordion-item>
      <button type="button" data-weave-accordion-button>Starter structure</button>
      <div data-weave-accordion-panel>
        public, css, js, images 같은 기본 폴더 흐름을 테스트합니다.
      </div>
    </li>
    <li data-weave-accordion-item>
      <button type="button" data-weave-accordion-button>Plugin runtime</button>
      <div data-weave-accordion-panel>
        data-weave-* 셀렉터와 docs preview mount 동작을 확인합니다.
      </div>
    </li>
  </ul>
</section>`,
  },
];

const defaultPresetId = presets[0].id;
const PLAYGROUND_STORAGE_KEY = 'weave-docs-playground-state';
const previewStyles = `
  :host {
    color: #e2e8f0;
    font-family: Pretendard, "Noto Sans KR", sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  .badge_pill {
    display: inline-flex;
    align-items: center;
    min-height: 28px;
    padding: 0 10px;
    border-radius: 999px;
    background: rgba(79, 156, 249, 0.12);
    color: #91b2ff;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .playground-demo-stack {
    display: grid;
    gap: 16px;
  }

  .playground-demo-card,
  .demo_tabs,
  .demo_accordion {
    padding: 20px;
    border: 1px solid #2d3748;
    border-radius: 18px;
    background: rgba(30, 37, 53, 0.82);
  }

  .playground-demo-card h3 {
    margin: 16px 0 10px;
  }

  .playground-demo-card p,
  .demo_tabs_panels,
  .demo_accordion [data-weave-accordion-panel] {
    color: #a9b1be;
  }

  .copy_ghost_button,
  .demo_tabs_buttons button,
  .demo_accordion button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 42px;
    padding: 0 14px;
    border: 1px solid #2d3748;
    border-radius: 12px;
    background: #1e2535;
    color: #e2e8f0;
    cursor: pointer;
  }

  .demo_tabs_buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 14px;
  }

  .demo_tabs_buttons button.active {
    background: rgba(79, 156, 249, 0.12);
    border-color: #4f9cf9;
    color: #91b2ff;
  }

  .demo_tabs_panels > *:not(.active) {
    display: none;
  }

  .demo_accordion {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .demo_accordion > li + li {
    margin-top: 10px;
  }

  .demo_accordion [data-weave-accordion-panel] {
    padding: 14px 2px 0;
  }
`;

export function PlaygroundPage() {
  const previewRootRef = useRef(null);
  const appRef = useRef(null);
  const initialState = useMemo(() => getInitialPlaygroundState(), []);
  const [selectedPresetId, setSelectedPresetId] = useState(initialState.selectedPresetId);
  const [source, setSource] = useState(initialState.source);
  const [mountedHtml, setMountedHtml] = useState(initialState.mountedHtml);
  const [autoPreview, setAutoPreview] = useState(initialState.autoPreview);

  const activePreset = useMemo(() => getPresetById(selectedPresetId), [selectedPresetId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      window.localStorage.setItem(
        PLAYGROUND_STORAGE_KEY,
        JSON.stringify({
          selectedPresetId,
          source,
          mountedHtml,
          autoPreview,
        }),
      );
    }, 120);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [selectedPresetId, source, mountedHtml, autoPreview]);

  useEffect(() => {
    if (!autoPreview) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setMountedHtml(source);
    }, 240);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [autoPreview, source]);

  useEffect(() => {
    if (!previewRootRef.current) {
      return undefined;
    }

    const host = previewRootRef.current;
    const shadowRoot = host.shadowRoot || host.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
      <style>${previewStyles}</style>
      <div class="playground-preview-inner">${mountedHtml}</div>
    `;

    const app = createWeave({
      root: shadowRoot,
      plugins: [
        copyPlugin(),
        tabsPlugin(),
        accordionPlugin(),
        modalPlugin(),
      ],
    });

    app.mount(shadowRoot);
    appRef.current = app;

    return () => {
      app.destroy();
      appRef.current = null;
    };
  }, [mountedHtml]);

  const handlePresetChange = (presetId) => {
    const preset = getPresetById(presetId);
    setSelectedPresetId(presetId);
    setSource(preset.html);
    if (autoPreview) {
      setMountedHtml(preset.html);
    }
  };

  const handleMount = () => {
    setMountedHtml(source);
  };

  const handleReset = () => {
    const preset = getPresetById(selectedPresetId);
    setSource(preset.html);
    setMountedHtml(preset.html);
  };

  return (
    <div className="page_shell page_shell_with_sidebar">
      <Sidebar items={sidebarItems} />

      <div className="page_content">
        <Section
          id="overview"
          eyebrow="Playground"
          title="에디터형 미리보기 실험실"
          description="HTML을 바로 수정하고 preview 루트에만 마운트해 tabs, accordion, copy 같은 흐름을 빠르게 검증할 수 있습니다."
          align="wide"
        >
          <Card className="intro_banner">
            <div>
              <strong>Editor</strong>
              <span>textarea 기반 HTML 편집</span>
            </div>
            <div>
              <strong>Preview</strong>
              <span>docs 전체가 아닌 전용 루트에만 mount</span>
            </div>
            <div>
              <strong>Use Case</strong>
              <span>마크업 검증, 샘플 실험, 빠른 공유</span>
            </div>
          </Card>
        </Section>

        <Section
          id="editor"
          eyebrow="Editor"
          title="Preview Editor"
          description="프리셋을 고르거나 직접 HTML을 수정한 뒤 mount/reset으로 결과를 즉시 확인합니다."
        >
          <div className="playground_layout">
            <Card className="playground_panel">
              <div className="demo_card_head">
                <div>
                  <h3>Editor</h3>
                  <p>프리셋을 기준으로 시작한 뒤 필요한 마크업만 수정해 실험할 수 있습니다.</p>
                </div>
              </div>

              <div className="playground_controls mt_20">
                <label htmlFor="playground-preset">Preset</label>
                <select
                  id="playground-preset"
                  value={selectedPresetId}
                  onChange={(event) => handlePresetChange(event.target.value)}
                >
                  {presets.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>

              <label className="tools_check mt_20">
                <input
                  type="checkbox"
                  checked={autoPreview}
                  onChange={(event) => setAutoPreview(event.target.checked)}
                />
                자동 미리보기
              </label>

              <div className="playground_editor mt_20">
                <label htmlFor="playground-source">HTML Source</label>
                <textarea
                  id="playground-source"
                  value={source}
                  onChange={(event) => setSource(event.target.value)}
                  spellCheck="false"
                />
              </div>

              <div className="playground_actions mt_20">
                <button type="button" className="primary_button" onClick={handleMount}>
                  Mount Preview
                </button>
                <button type="button" className="secondary_link_button" onClick={handleReset}>
                  Reset Preset
                </button>
                <span className="playground_status">
                  {autoPreview ? '입력 후 자동으로 preview가 반영됩니다.' : '편집 후 Mount Preview를 눌러 반영합니다.'}
                </span>
              </div>
            </Card>

            <Card className="playground_panel">
              <div className="demo_card_head">
                <div>
                  <h3>Preview</h3>
                  <p>선택한 HTML만 전용 preview 루트에 렌더링하고 플러그인을 그 안에서만 다시 마운트합니다.</p>
                </div>
              </div>

              <div className="playground_preview_frame mt_20">
                <div ref={previewRootRef} className="playground_preview_root" />
              </div>
            </Card>
          </div>
        </Section>

        <Section
          id="presets"
          eyebrow="Presets"
          title="Starter Presets"
          description="반복 사용이 많은 기본 샘플을 카드로 정리해 필요한 구조를 바로 가져갈 수 있게 했습니다."
        >
          <div className="docs_grid_2">
            {presets.map((preset) => (
              <Card key={preset.id} className="docs_module_card">
                <span className="badge_pill">{preset.label}</span>
                <h3>{preset.label}</h3>
                <p>{preset.description}</p>
                <button
                  type="button"
                  className="copy_ghost_button"
                  onClick={() => handlePresetChange(preset.id)}
                >
                  이 프리셋 불러오기
                </button>
              </Card>
            ))}
          </div>

          <div className="mt_20">
            <CodeBlock language="html" code={activePreset.html} message="현재 Playground 프리셋 코드를 복사했습니다." />
          </div>
        </Section>
      </div>
    </div>
  );
}

function getPresetById(id) {
  return presets.find((preset) => preset.id === id) || presets[0];
}

function getInitialPlaygroundState() {
  if (typeof window === 'undefined') {
    const preset = getPresetById(defaultPresetId);
    return {
      selectedPresetId: defaultPresetId,
      source: preset.html,
      mountedHtml: preset.html,
      autoPreview: true,
    };
  }

  try {
    const saved = JSON.parse(window.localStorage.getItem(PLAYGROUND_STORAGE_KEY) || 'null');
    const preset = getPresetById(saved?.selectedPresetId || defaultPresetId);

    return {
      selectedPresetId: preset.id,
      source: saved?.source || preset.html,
      mountedHtml: saved?.mountedHtml || preset.html,
      autoPreview: saved?.autoPreview ?? true,
    };
  } catch {
    const preset = getPresetById(defaultPresetId);
    return {
      selectedPresetId: defaultPresetId,
      source: preset.html,
      mountedHtml: preset.html,
      autoPreview: true,
    };
  }
}
