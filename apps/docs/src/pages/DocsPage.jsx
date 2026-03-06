import { Card } from '../components/Card.jsx';
import { CodeBlock } from '../components/CodeBlock.jsx';
import { Section } from '../components/Section.jsx';
import { Sidebar } from '../components/Sidebar.jsx';

const sidebarItems = [
  { href: '#utility-css', label: 'Utility CSS' },
  { href: '#common-tokens', label: 'Common CSS Tokens' },
  { href: '#plugin-lifecycle', label: 'Plugin Lifecycle' },
  { href: '#plugin-demos', label: 'Plugin Demos' },
];

const utilityGroups = [
  {
    name: 'Spacing',
    classes: ['mt_20', 'mb_20', 'pt_20', 'pb_20'],
    description: 'rem10 기준 spacing 유틸리티로 간격을 선언형으로 제어합니다.',
  },
  {
    name: 'Color',
    classes: ['fc_point1', 'bgc_primary', 'fc_g_60', 'bgc_p_10'],
    description: '토큰 변수와 연결되는 text / background color 클래스를 제공합니다.',
  },
  {
    name: 'Radius',
    classes: ['rd_base', 'rd_md', 'rd_full'],
    description: '공통 radius token을 써서 카드, 버튼, pill 형태를 빠르게 맞출 수 있습니다.',
  },
];

const lifecycleSteps = ['setup', 'scan', 'mount', 'unmount', 'teardown'];

export function DocsPage() {
  return (
    <div className="page_shell page_shell_with_sidebar">
      <Sidebar title="On this page" items={sidebarItems} />

      <div className="page_content">
        <Section
          eyebrow="Docs"
          title="WEAVE가 동작하는 방식"
          description="WEAVE는 CSS Utility System과 JS Plugin Runtime을 함께 제공하는 내부 프레임워크입니다. 아래 섹션은 실제 사용 예시와 함께 핵심 개념을 설명합니다."
          align="wide"
        >
          <Card className="intro_banner">
            <div>
              <strong>Core Runtime</strong>
              <span>createWeave, registry, events, observer</span>
            </div>
            <div>
              <strong>Selectors</strong>
              <span>data-weave-* + .weave_* + legacy .wv_*</span>
            </div>
          </Card>
        </Section>

        <Section
          id="utility-css"
          eyebrow="Utility CSS"
          title="공통 UI를 빠르게 조립하는 utility class"
          description="WEAVE CSS는 클래스 이름만 봐도 의도를 파악할 수 있도록 간결한 naming rule을 유지합니다."
        >
          <div className="docs_grid_2">
            {utilityGroups.map((group) => (
              <Card key={group.name}>
                <h3>{group.name}</h3>
                <p>{group.description}</p>
                <div className="token_pill_row">
                  {group.classes.map((item) => (
                    <span key={item} className="token_pill">
                      {item}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
            <Card>
              <h3>Example Markup</h3>
              <CodeBlock
                language="html"
                code={`<section class="mt_20 pt_20 pb_20 bgc_p_10 rd_base">
  <h2 class="fs_24 fw_700 fc_point1">WEAVE Section</h2>
  <p class="fc_g_60">Utility driven layout block</p>
</section>`}
              />
            </Card>
          </div>
        </Section>

        <Section
          id="common-tokens"
          eyebrow="Common CSS"
          title="프로젝트별로 바꾸는 CSS 토큰"
          description="공통 유틸리티는 변수에 연결되고, 프로젝트는 `common.css`에서 토큰 값만 바꿔 사용할 수 있습니다."
        >
          <div className="docs_grid_2">
            <CodeBlock
              language="css"
              code={`:root {
  --point1: #4f7cff;
  --primary: #7c8eff;
  --accent: #71e0ff;
}`}
            />
            <CodeBlock
              language="css"
              code={`.fc_point1 {
  color: var(--point1);
}

.bgc_primary {
  background-color: var(--primary);
}`}
            />
          </div>
        </Section>

        <Section
          id="plugin-lifecycle"
          eyebrow="JS Plugins"
          title="플러그인 라이프사이클"
          description="플러그인은 전역 스크립트가 아니라 lifecycle 기반으로 등록되고 정리됩니다."
        >
          <div className="lifecycle_grid">
            {lifecycleSteps.map((step) => (
              <Card key={step} className="lifecycle_card">
                <span>{step}</span>
              </Card>
            ))}
          </div>
          <div className="docs_grid_2 mt_20">
            <CodeBlock
              language="js"
              code={`export function tabsPlugin() {
  return {
    name: 'tabs',
    setup(ctx) {},
    scan(ctx) {},
    mount(ctx, el) {},
    unmount(ctx, el, instance) {},
    teardown(ctx) {},
  };
}`}
            />
            <CodeBlock
              language="js"
              code={`const app = createWeave({
  autoObserve: true,
  plugins: [copyPlugin(), tabsPlugin(), accordionPlugin()],
});

app.mount();`}
            />
          </div>
        </Section>

        <Section
          id="plugin-demos"
          eyebrow="Live Demos"
          title="copy, tabs, accordion 플러그인 실전 예시"
          description="현재 WEAVE 코어에 연결된 플러그인을 문서 안에서 바로 테스트할 수 있습니다."
        >
          <div className="demo_stack">
            <Card>
              <div className="demo_card_head">
                <div>
                  <h3>Copy Plugin</h3>
                  <p>`data-weave-copy`와 `.weave_copy`를 모두 지원합니다.</p>
                </div>
                <div className="demo_inline_source" id="docs-copy-source">
                  https://weave.internal/docs/demo
                </div>
              </div>
              <div className="demo_button_row">
                <button data-weave-copy data-text="Hello WEAVE" data-copy-success-label="COPIED">
                  텍스트 복사
                </button>
                <button
                  className="weave_copy"
                  data-target="#docs-copy-source"
                  data-copy-success-label="COPIED"
                >
                  source 복사
                </button>
                <button
                  data-weave-copy
                  data-text="WEAVE docs snippet"
                  data-copy-alert="true"
                  data-copy-message="복사 완료!"
                  data-copy-success-label="COPIED"
                >
                  alert 복사
                </button>
              </div>
              <CodeBlock
                language="html"
                code={`<button data-weave-copy data-text="Hello WEAVE">
  텍스트 복사
</button>

<button class="weave_copy" data-target="#docs-copy-source">
  source 복사
</button>`}
              />
            </Card>

            <Card>
              <div className="demo_card_head">
                <div>
                  <h3>Tabs Demo</h3>
                  <p>버튼 상태와 패널 표시가 함께 동기화됩니다.</p>
                </div>
              </div>
              <div data-weave-tabs className="demo_tabs">
                <div className="demo_tabs_buttons">
                  <button data-weave-tabs-button className="active">
                    Overview
                  </button>
                  <button data-weave-tabs-button>Usage</button>
                  <button data-weave-tabs-button>Notes</button>
                </div>
                <div className="demo_tabs_panels">
                  <div data-weave-tabs-panel className="active">
                    Utility CSS와 Plugin Runtime을 조합하는 기본 구조입니다.
                  </div>
                  <div data-weave-tabs-panel>
                    버튼과 패널 인덱스를 기준으로 연결됩니다.
                  </div>
                  <div data-weave-tabs-panel>
                    키보드 방향키와 Home, End 탐색도 지원합니다.
                  </div>
                </div>
              </div>
              <CodeBlock
                language="html"
                code={`<div data-weave-tabs>
  <button data-weave-tabs-button>Overview</button>
  <button data-weave-tabs-button>Usage</button>

  <div data-weave-tabs-panel>...</div>
  <div data-weave-tabs-panel>...</div>
</div>`}
              />
            </Card>

            <Card>
              <div className="demo_card_head">
                <div>
                  <h3>Accordion Demo</h3>
                  <p>single mode 기준으로 하나의 패널만 열리는 예시입니다.</p>
                </div>
              </div>
              <ul data-weave-accordion data-weave-accordion-mode="single" className="demo_accordion">
                <li data-weave-accordion-item className="active">
                  <button data-weave-accordion-button>어떤 selector를 쓰나요?</button>
                  <div data-weave-accordion-panel>
                    `data-weave-*`, `.weave_*`, PF의 `.wv_*` 셀렉터를 함께 고려합니다.
                  </div>
                </li>
                <li data-weave-accordion-item>
                  <button data-weave-accordion-button>왜 lifecycle 구조를 쓰나요?</button>
                  <div data-weave-accordion-panel>
                    SPA와 AJAX 환경에서 mount / cleanup을 안정적으로 처리하기 위해서입니다.
                  </div>
                </li>
                <li data-weave-accordion-item>
                  <button data-weave-accordion-button>observer와 같이 쓸 수 있나요?</button>
                  <div data-weave-accordion-panel>
                    `autoObserve`가 켜져 있으면 동적으로 추가된 DOM도 다시 scan할 수 있습니다.
                  </div>
                </li>
              </ul>
              <CodeBlock
                language="html"
                code={`<ul data-weave-accordion data-weave-accordion-mode="single">
  <li data-weave-accordion-item>
    <button data-weave-accordion-button>Question</button>
    <div data-weave-accordion-panel>Answer</div>
  </li>
</ul>`}
              />
            </Card>
          </div>
        </Section>
      </div>
    </div>
  );
}
