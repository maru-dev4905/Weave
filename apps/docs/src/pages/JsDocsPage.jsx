import { Card } from '../components/Card.jsx';
import { CodeBlock } from '../components/CodeBlock.jsx';
import { GuideTable } from '../components/GuideTable.jsx';
import { Section } from '../components/Section.jsx';
import { Sidebar } from '../components/Sidebar.jsx';

const sidebarItems = [
  { href: '#overview', label: '개요' },
  { href: '#copy', label: 'Copy' },
  { href: '#link-button', label: 'Link Button' },
  { href: '#file-drop', label: 'File Drop' },
  { href: '#tabs', label: 'Tabs' },
  { href: '#accordion', label: 'Accordion' },
  { href: '#modal', label: 'Modal' },
  { href: '#scroll', label: 'Scroll To' },
  { href: '#hide-today', label: 'Hide Today' },
];

const moduleCards = [
  {
    title: 'Copy',
    selector: '[data-weave-copy], .weave_copy',
    summary: '버튼 클릭으로 텍스트나 특정 요소의 내용을 복사합니다.',
  },
  {
    title: 'Link Button',
    selector: '[data-weave-link-button], .weave_link_button',
    summary: '지정한 href로 현재 창 또는 새 창 이동을 지연 시간과 함께 제어합니다.',
  },
  {
    title: 'File Drop',
    selector: '[data-weave-file-drop]',
    summary: '드래그 앤 드랍 영역과 file input을 연결하고, 파일 유효성 검사와 리스트 렌더링을 처리합니다.',
  },
  {
    title: 'Tabs',
    selector: '[data-weave-tabs]',
    summary: '버튼과 패널을 인덱스 기준으로 연결해 탭 UI를 제어합니다.',
  },
  {
    title: 'Accordion',
    selector: '[data-weave-accordion]',
    summary: 'single, multi 모드를 지원하는 아코디언 동작을 제공합니다.',
  },
  {
    title: 'Modal',
    selector: '[data-weave-modal], [data-weave-modal-open]',
    summary: '열기, 닫기, ESC, 오버레이 클릭, body lock 흐름을 처리합니다.',
  },
  {
    title: 'Scroll To',
    selector: '[data-weave-scroll-target]',
    summary: '대상 요소까지 부드럽게 스크롤하고 offset, center 옵션을 처리합니다.',
  },
  {
    title: 'Hide Today',
    selector: '[data-weave-hide-today]',
    summary: '하루 동안 숨기기 체크와 localStorage 저장을 함께 다룹니다.',
  },
];

const copyGuideRows = [
  ['selector', '[data-weave-copy], .weave_copy', '복사 동작을 바인딩하는 기본 셀렉터'],
  ['data-text', '문자열', '직접 복사할 텍스트를 지정합니다.'],
  ['data-target', '#id 또는 selector', '대상 요소의 textContent를 복사합니다.'],
  ['data-copy-message', '문자열', '복사 완료 메시지를 지정합니다.'],
  ['data-copy-alert', 'true | false', 'alert 창 사용 여부를 제어합니다.'],
];

const linkButtonGuideRows = [
  ['selector', '[data-weave-link-button], .weave_link_button', '링크 이동 버튼 셀렉터입니다.'],
  ['data-weave-link-href', '/path 또는 https://...', '이동할 주소를 지정합니다.'],
  ['data-weave-link-delay', 'number', '이동 전 지연 시간을 밀리초 단위로 지정합니다.'],
  ['data-weave-link-blank', 'true | false', '새 창으로 열지 여부를 지정합니다.'],
];

const fileDropGuideRows = [
  ['selector', '[data-weave-file-drop]', '드래그 앤 드랍 영역 루트 셀렉터입니다.'],
  ['zone key', 'data-weave-file-drop="docsFileDropSingle"', 'JS `zones` 객체와 연결하는 식별자입니다.'],
  ['input', 'input[type="file"] 또는 config.input', '업로드에 사용할 파일 입력 요소입니다.'],
  ['multiple', 'boolean', '다중 파일 선택 허용 여부를 제어합니다.'],
  ['maxSize', 'number(bytes)', '파일당 허용할 최대 용량입니다.'],
  ['accept', "['jpg', 'png'] | 'image/*'", '허용 확장자 또는 MIME 목록입니다.'],
  ['overClass', '문자열', '드래그 중 루트 요소에 붙일 클래스명입니다.'],
  ['renderList', 'true | false', '선택된 파일 목록 자동 렌더링 여부입니다.'],
  ['listTarget', '#id | Element', '파일 리스트를 출력할 대상입니다.'],
  ['onChange', '(files, context) => {}', '유효한 파일 메타데이터 배열을 콜백으로 반환합니다.'],
  ['onError', '(errors, context) => {}', '용량, 확장자, 다중 선택 오류 정보를 콜백으로 반환합니다.'],
  ['return item', '{ name, size, sizeLabel, type, extension, lastModified, file }', '콜백 배열의 각 파일 항목 구조입니다.'],
];

const tabsGuideRows = [
  ['root', '[data-weave-tabs], .weave_tabs, .wv_tab', '탭 전체를 감싸는 루트 셀렉터'],
  ['button', '[data-weave-tabs-button]', '탭 버튼 요소입니다.'],
  ['panel', '[data-weave-tabs-panel]', '탭 콘텐츠 패널 요소입니다.'],
  ['active class', 'active', '초기 활성 상태와 선택 상태를 제어합니다.'],
  ['접근성', 'aria-selected, role=tab', 'mount 시 aria 속성을 함께 동기화합니다.'],
];

const accordionGuideRows = [
  ['root', '[data-weave-accordion], .weave_accordion, .wv_accordion', '아코디언 루트 셀렉터'],
  ['item', '[data-weave-accordion-item]', '개별 아코디언 항목입니다.'],
  ['button', '[data-weave-accordion-button]', '열기/닫기 제어 버튼입니다.'],
  ['panel', '[data-weave-accordion-panel]', '콘텐츠 패널입니다.'],
  ['mode', 'data-weave-accordion-mode', 'single 또는 multi 모드를 지정합니다.'],
];

const modalGuideRows = [
  ['modal root', '[data-weave-modal], .weave_modal, .wv_modal', '모달 루트 셀렉터입니다.'],
  ['open trigger', 'data-weave-modal-open', '열기 버튼과 모달 id를 연결합니다.'],
  ['close trigger', 'data-weave-modal-close', '모달을 닫는 버튼 셀렉터입니다.'],
  ['overlay', 'data-weave-modal-overlay', '오버레이 클릭 닫기 대상입니다.'],
  ['body lock class', 'scrollLock', '활성 모달이 있을 때 body에 적용됩니다.'],
];

const scrollGuideRows = [
  ['selector', '[data-weave-scroll-target]', '스크롤 이동 트리거 셀렉터입니다.'],
  ['data-weave-scroll-target', '#id 또는 selector', '도착할 대상 요소를 지정합니다.'],
  ['data-weave-scroll-container', 'selector | window', '스크롤 컨테이너를 지정합니다.'],
  ['data-weave-scroll-duration', 'number', '애니메이션 시간을 제어합니다.'],
  ['data-weave-scroll-offset', 'true | false', '헤더 높이를 offset으로 반영합니다.'],
];

const hideTodayGuideRows = [
  ['root', '[data-weave-hide-today], .weave_hide_today, .hide_today_compo', '하루 숨김 제어 루트입니다.'],
  ['button', 'data-weave-hide-today-button', '적용 버튼 셀렉터입니다.'],
  ['checkbox', 'data-weave-hide-today-checkbox', '저장 여부와 expire 옵션을 읽습니다.'],
  ['target', 'data-weave-hide-target', '숨길 대상 id를 지정합니다.'],
  ['storage', 'weave-hide-today-*', 'localStorage에 만료 시간을 저장합니다.'],
];

const copyCheckpoints = [
  '직접 문자열 복사와 대상 요소 복사를 같은 셀렉터 규칙 안에서 함께 쓸 수 있습니다.',
  '`data-target`을 쓰는 경우 복사 대상 요소가 먼저 렌더링되어 있어야 안전합니다.',
  '알림창 사용이 필요 없으면 기본 토스트 피드백만 유지하는 편이 작업 흐름상 자연스럽습니다.',
];

const linkButtonCheckpoints = [
  '앵커 이동과 내부 경로 이동 모두 `data-weave-link-href` 하나로 맞출 수 있습니다.',
  '지연 이동이 필요한 경우 `data-weave-link-delay`만 추가하면 됩니다.',
  '새 창 열기는 `data-weave-link-blank="true"`로 분기되므로 마크업에서 의도가 바로 보입니다.',
];

const fileDropCheckpoints = [
  '실제 업로드는 하지 않고, 브라우저의 `File` 객체 메타데이터만 정리해 반환합니다.',
  '모바일 환경에서는 드래그보다 클릭 선택이 주 경로이므로 클릭 동선도 함께 유지하는 편이 안전합니다.',
  '유효한 파일만 input에 다시 반영하려 시도하므로 검증 실패 파일은 목록에서 제외됩니다.',
];

const tabsCheckpoints = [
  '버튼과 패널 개수는 동일하게 맞추는 편이 안전합니다.',
  '초기 활성화는 `active` 클래스 또는 `initialIndex`로 정할 수 있습니다.',
  '링크 태그를 버튼처럼 써도 클릭 시 기본 이동을 막고 탭만 전환합니다.',
];

const accordionCheckpoints = [
  '`data-weave-accordion-mode="multi"`를 쓰면 여러 항목을 동시에 열 수 있습니다.',
  '초기 활성 항목은 `active` 클래스로 지정할 수 있습니다.',
  '버튼 다음 형제 요소도 패널로 인식할 수 있도록 보조 처리되어 있습니다.',
];

const modalCheckpoints = [
  '활성 상태에서는 `active` 클래스와 `hidden=false`가 함께 적용됩니다.',
  'Escape 키와 오버레이 클릭으로 닫을 수 있습니다.',
  '열기 버튼 포커스를 기억했다가 닫힐 때 다시 돌려줍니다.',
];

const scrollCheckpoints = [
  'target은 id 또는 selector로 지정할 수 있습니다.',
  'container를 지정하지 않으면 기본값은 `window`입니다.',
  'duration이 0이면 즉시 이동합니다.',
];

const hideTodayCheckpoints = [
  '저장 키는 `weave-hide-today-*` prefix를 사용합니다.',
  '체크하지 않으면 숨김만 적용되고 저장은 남지 않습니다.',
  '데모와 동일하게 체크박스와 버튼을 같은 루트 안에 두면 검증 흐름을 맞추기 쉽습니다.',
];

export function JsDocsPage() {
  return (
    <div className="page_shell page_shell_with_sidebar">
      <Sidebar title="On this page" items={sidebarItems} />

      <div className="page_content">
        <Section
          id="overview"
          eyebrow="Docs(JS)"
          title="스크립트 모듈 사용 방법과 기능 테스트"
          description="모듈별 역할, PF 호환 셀렉터, 예제 코드, 동작 테스트를 한 페이지에 모았습니다."
          align="wide"
        >
          <Card className="intro_banner">
            <div>
              <strong>Runtime</strong>
              <span>createWeave, observer, registry</span>
            </div>
            <div>
              <strong>Selector Rule</strong>
              <span>data-weave-* + .weave_* + PF legacy selector</span>
            </div>
            <div>
              <strong>Flow</strong>
              <span>setup, scan, mount, unmount, teardown</span>
            </div>
          </Card>

          <div className="docs_grid_2 mt_20">
            {moduleCards.map((item) => (
              <Card key={item.title} className="docs_module_card">
                <span className="badge_pill">{item.title}</span>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <code>{item.selector}</code>
              </Card>
            ))}
          </div>
        </Section>

        <Section
          id="copy"
          eyebrow="Module"
          title="Copy"
          description="텍스트 직접 복사, 대상 요소 복사, 성공 피드백까지 한 번에 확인할 수 있습니다."
        >
          <Card>
            <div className="demo_card_head">
              <div>
                <h3>Live Demo</h3>
                <p>아래 버튼을 누르면 텍스트 또는 지정된 영역 내용을 바로 복사합니다.</p>
              </div>
            </div>

            <div className="demo_button_row">
              <button data-weave-copy data-text="문자열이 복사되었습니다." data-copy-success-label="DONE">
                텍스트 복사
              </button>
              <button data-weave-copy data-text="https://docs.internal/modules/copy" data-copy-success-label="DONE">
                영역 복사
              </button>
              <button
                data-weave-copy
                data-text="알림 포함 복사"
                data-copy-alert="true"
                data-copy-message="복사 완료"
                data-copy-success-label="DONE"
              >
                alert 복사
              </button>
            </div>

            <div className="docs_grid_2 mt_20">
              <CodeBlock
                language="html"
                code={`<button data-weave-copy data-text="문자열이 복사되었습니다.">
  텍스트 복사
</button>

<button data-weave-copy data-text="https://docs.internal/modules/copy">
  영역 복사
</button>`}
              />
              <CodeBlock
                language="js"
                code={`import { copyPlugin, createWeave } from '@weave/wv/dist/js/core.js';

const app = createWeave({
  plugins: [copyPlugin()],
});

app.mount();`}
              />
            </div>

            <div className="mt_20">
              <Card className="docs_note_card">
                <h3>체크 포인트</h3>
                <ul className="check_list">
                  {copyCheckpoints.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="mt_20">
              <GuideTable headers={['항목', '값 또는 셀렉터', '설명']} rows={copyGuideRows} />
            </div>
          </Card>
        </Section>

        <Section
          id="link-button"
          eyebrow="Module"
          title="Link Button"
          description="새 WEAVE API 기준으로 현재 창 이동, 지연 이동, 새 창 이동을 제어하는 이동 모듈입니다."
        >
          <Card>
            <div className="demo_card_head">
              <div>
                <h3>Live Demo</h3>
                <p>현재 창 이동, 지연 이동, 새 창 이동을 버튼 속성만으로 제어할 수 있습니다.</p>
              </div>
            </div>

            <div className="link_button_demo">
              <div className="demo_button_row">
                <button
                  data-weave-link-button
                  data-weave-link-href="#overview"
                >
                  현재 창 이동
                </button>
                <button
                  data-weave-link-button
                  data-weave-link-href="#hide-today"
                  data-weave-link-delay="600"
                >
                  0.6초 후 이동
                </button>
                <button
                  data-weave-link-button
                  data-weave-link-href="/docs/css"
                  data-weave-link-blank="true"
                >
                  새 창 열기
                </button>
              </div>

              <div className="link_button_panel">
                <strong>테스트 안내</strong>
                <p>
                  현재 창 이동은 문서 내 앵커 또는 동일 사이트 경로를 기준으로 확인할 수 있고,
                  새 창 이동은 `/docs/css`를 별도 탭으로 엽니다.
                </p>
              </div>
            </div>

            <ModuleReference
              htmlCode={`<button
  data-weave-link-button
  data-weave-link-href="/docs/css"
  data-weave-link-delay="300"
  data-weave-link-blank="true"
>
  이동
</button>`}
              jsCode={buildPluginSnippet('linkButtonPlugin')}
              checkpoints={linkButtonCheckpoints}
              rows={linkButtonGuideRows}
            />
          </Card>
        </Section>

        <Section
          id="file-drop"
          eyebrow="Module"
          title="File Drop"
          description="드롭 존 상태 클래스, 파일 검증, 선택 결과 콜백, 파일 목록 렌더링을 한 번에 처리하는 file input 전용 모듈입니다."
        >
          <Card>
            <div className="demo_card_head">
              <div>
                <h3>Live Demo</h3>
                <p>영역 위로 파일을 끌어오면 `over` 클래스가 적용되고, 드롭 또는 클릭 선택 모두 같은 검증 흐름으로 처리됩니다.</p>
              </div>
            </div>

            <div className="file_drop_demo_grid mt_20">
              <div className="file_drop_demo_col">
                <div
                  data-weave-file-drop="docsFileDropSingle"
                  className="file_drop_zone"
                  role="button"
                  tabIndex={0}
                  aria-controls="docs-file-drop-single-input"
                >
                  <input
                    id="docs-file-drop-single-input"
                    className="file_drop_input"
                    type="file"
                  />
                  <span className="badge_pill">Single</span>
                  <strong>단일 파일 업로드 영역</strong>
                  <p id="docs-file-drop-single-status">
                    JPG, PNG, PDF / 최대 5 MB / 단일 파일
                  </p>
                  <small>파일을 드롭하거나 영역을 클릭해 선택하세요.</small>
                </div>
                <p id="docs-file-drop-single-feedback" className="file_drop_feedback" />
                <div id="docs-file-drop-single-list" className="file_drop_list_wrap" />
              </div>

              <div className="file_drop_demo_col">
                <div
                  data-weave-file-drop="docsFileDropMulti"
                  className="file_drop_zone"
                  role="button"
                  tabIndex={0}
                  aria-controls="docs-file-drop-multi-input"
                >
                  <input
                    id="docs-file-drop-multi-input"
                    className="file_drop_input"
                    type="file"
                    multiple
                  />
                  <span className="badge_pill">Multi</span>
                  <strong>다중 파일 업로드 영역</strong>
                  <p id="docs-file-drop-multi-status">
                    JPG, PNG, WEBP / 파일당 최대 10 MB / 다중 파일
                  </p>
                  <small>여러 파일을 한 번에 올리면 리스트가 자동으로 갱신됩니다.</small>
                </div>
                <p id="docs-file-drop-multi-feedback" className="file_drop_feedback" />
                <div id="docs-file-drop-multi-list" className="file_drop_list_wrap" />
              </div>
            </div>

            <ModuleReference
              htmlCode={`<div
  data-weave-file-drop="uploadA"
  class="file_drop_zone"
  role="button"
  tabindex="0"
>
  <input id="upload-input" type="file" />
  <div id="upload-file-list"></div>
</div>`}
              jsCode={`import { createWeave, fileDropPlugin } from '@weave/wv/dist/js/core.js';

const app = createWeave({
  plugins: [
    fileDropPlugin({
      zones: {
        uploadA: {
          input: '#upload-input',
          accept: ['jpg', 'png', 'pdf'],
          maxSize: 5 * 1024 * 1024,
          renderList: true,
          listTarget: '#upload-file-list',
          onChange(files) {
            console.log(files);
          },
          onError(errors) {
            console.warn(errors);
          },
        },
      },
    }),
  ],
});

app.mount();`}
              checkpoints={fileDropCheckpoints}
              rows={fileDropGuideRows}
            />
          </Card>
        </Section>

        <Section
          id="tabs"
          eyebrow="Module"
          title="Tabs"
          description="탭 버튼과 패널을 연결하고, 키보드 이동과 aria 상태까지 함께 처리합니다."
        >
          <Card data-weave-tabs className="demo_tabs">
            <div className="demo_tabs_buttons">
              <button data-weave-tabs-button className="active">
                Overview
              </button>
              <button data-weave-tabs-button>Usage</button>
              <button data-weave-tabs-button>Accessibility</button>
            </div>
            <div className="demo_tabs_panels_wrap">
              <div className="demo_tabs_panels">
                <div data-weave-tabs-panel className="active">
                  버튼과 패널은 같은 순서로 연결됩니다.
                </div>
                <div data-weave-tabs-panel>
                  활성 탭은 class와 hidden 속성으로 함께 제어됩니다.
                </div>
                <div data-weave-tabs-panel>
                  방향키, Home, End 키 이동과 aria-selected 동기화를 지원합니다.
                </div>
              </div>
            </div>
          </Card>

          <ModuleReference
            htmlCode={`<div data-weave-tabs>
  <button data-weave-tabs-button>Overview</button>
  <button data-weave-tabs-button>Usage</button>

  <div data-weave-tabs-panel>...</div>
  <div data-weave-tabs-panel>...</div>
</div>`}
            jsCode={buildPluginSnippet('tabsPlugin')}
            checkpoints={tabsCheckpoints}
            rows={tabsGuideRows}
          />
        </Section>

        <Section
          id="accordion"
          eyebrow="Module"
          title="Accordion"
          description="single 또는 multi 모드로 아코디언 항목을 열고 닫을 수 있습니다."
        >
          <Card>
            <ul data-weave-accordion data-weave-accordion-mode="single" className="demo_accordion">
              <li data-weave-accordion-item className="active">
                <button data-weave-accordion-button>어떤 구조를 쓰나요?</button>
                <div data-weave-accordion-panel>
                  버튼과 패널을 한 항목 안에 두고, 루트에 `data-weave-accordion`을 지정합니다.
                </div>
              </li>
              <li data-weave-accordion-item>
                <button data-weave-accordion-button>single 모드는 어떻게 동작하나요?</button>
                <div data-weave-accordion-panel>
                  하나를 열면 나머지는 자동으로 닫히고, 다시 클릭하면 현재 항목을 닫을 수 있습니다.
                </div>
              </li>
              <li data-weave-accordion-item>
                <button data-weave-accordion-button>키보드 이동도 되나요?</button>
                <div data-weave-accordion-panel>
                  위아래 화살표, Home, End 키로 버튼 포커스를 이동할 수 있습니다.
                </div>
              </li>
            </ul>

            <ModuleReference
              htmlCode={`<ul data-weave-accordion data-weave-accordion-mode="single">
  <li data-weave-accordion-item>
    <button data-weave-accordion-button>Question</button>
    <div data-weave-accordion-panel>Answer</div>
  </li>
</ul>`}
              jsCode={buildPluginSnippet('accordionPlugin')}
              checkpoints={accordionCheckpoints}
              rows={accordionGuideRows}
            />
          </Card>
        </Section>

        <Section
          id="modal"
          eyebrow="Module"
          title="Modal"
          description="열기 버튼, 닫기 버튼, 오버레이 클릭, ESC 닫기, body scroll lock을 함께 처리합니다."
        >
          <Card className="modal_demo_card">
            <div className="demo_button_row">
              <button data-weave-modal-open="sample-modal">기본 모달 열기</button>
            </div>

            <div data-weave-modal id="sample-modal" className="demo_modal" hidden>
              <div className="demo_modal_overlay" data-weave-modal-overlay />
              <div className="demo_modal_panel" role="document">
                <div className="demo_modal_head">
                  <h3>샘플 모달</h3>
                  <button type="button" data-weave-modal-close className="copy_ghost_button">
                    닫기
                  </button>
                </div>
                <p>
                  루트에 `data-weave-modal`을 두고, 열기 버튼에는
                  `data-weave-modal-open="sample-modal"`을 연결하면 됩니다.
                </p>
              </div>
            </div>

            <ModuleReference
              htmlCode={`<button data-weave-modal-open="sample-modal">
  모달 열기
</button>

<div data-weave-modal id="sample-modal" hidden>
  <div data-weave-modal-overlay></div>
  <button data-weave-modal-close>닫기</button>
</div>`}
              jsCode={buildPluginSnippet('modalPlugin')}
              checkpoints={modalCheckpoints}
              rows={modalGuideRows}
            />
          </Card>
        </Section>

        <Section
          id="scroll"
          eyebrow="Module"
          title="Scroll To"
          description="페이지 안 특정 영역으로 자연스럽게 이동하고 offset, centered 옵션도 함께 다룰 수 있습니다."
        >
          <Card>
            <div className="demo_button_row">
              <button
                data-weave-scroll-target="#scroll-demo-target"
                data-weave-scroll-duration="700"
                data-weave-scroll-offset="true"
              >
                대상 위치로 이동
              </button>
            </div>

            <div className="demo_scroll_panel">
              <div className="demo_scroll_spacer">스크롤 이동 테스트 영역</div>
              <div id="scroll-demo-target" className="demo_scroll_target">
                도착 지점
              </div>
            </div>

            <ModuleReference
              htmlCode={`<button
  data-weave-scroll-target="#target"
  data-weave-scroll-duration="700"
  data-weave-scroll-offset="true"
>
  이동
</button>`}
              jsCode={buildPluginSnippet('scrollToPlugin')}
              checkpoints={scrollCheckpoints}
              rows={scrollGuideRows}
            />
          </Card>
        </Section>

        <Section
          id="hide-today"
          eyebrow="Module"
          title="Hide Today"
          description="하루 동안 다시 보지 않기 체크와 함께 대상 요소 숨김 상태를 저장합니다."
        >
          <Card>
            <div className="hide_today_demo_card" data-weave-hide-today data-weave-hide-target="today-banner">
              <div id="today-banner" className="today_notice">
                <strong>오늘 하루 보지 않기 예시 패널</strong>
                <span>체크 후 닫기를 누르면 상단 공지 영역이 숨겨지고 localStorage에 만료 시간이 저장됩니다.</span>
              </div>

              <div className="hide_today_demo">
                <label className="checkbox_card">
                  <input
                    type="checkbox"
                    data-weave-hide-today-checkbox
                    data-weave-hide-target="today-banner"
                  />
                  <span>오늘 하루 보지 않기</span>
                </label>
                <button type="button" data-weave-hide-today-button>
                  닫기
                </button>
              </div>
            </div>

            <ModuleReference
              htmlCode={`<div
  class="hide_today_demo_card"
  data-weave-hide-today
  data-weave-hide-target="today-banner"
>
  <div id="today-banner">공지 영역</div>

  <label class="checkbox_card">
    <input
      type="checkbox"
      data-weave-hide-today-checkbox
      data-weave-hide-target="today-banner"
    />
    <span>오늘 하루 보지 않기</span>
  </label>

  <button type="button" data-weave-hide-today-button>닫기</button>
</div>`}
              jsCode={buildPluginSnippet('hideTodayPlugin')}
              checkpoints={hideTodayCheckpoints}
              rows={hideTodayGuideRows}
            />
          </Card>
        </Section>
      </div>
    </div>
  );
}

function ModuleReference({ htmlCode, jsCode, checkpoints, rows }) {
  return (
    <>
      <div className="docs_grid_2 mt_20">
        <CodeBlock language="html" code={htmlCode} />
        <CodeBlock language="js" code={jsCode} />
      </div>

      <div className="mt_20">
        <Card className="docs_note_card">
          <h3>체크 포인트</h3>
          <ul className="check_list">
            {checkpoints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt_20">
        <GuideTable headers={['항목', '값 또는 셀렉터', '설명']} rows={rows} />
      </div>
    </>
  );
}

function buildPluginSnippet(pluginName) {
  return `import { createWeave, ${pluginName} } from '@weave/wv/dist/js/core.js';

const app = createWeave({
  plugins: [${pluginName}()],
});

app.mount();`;
}
