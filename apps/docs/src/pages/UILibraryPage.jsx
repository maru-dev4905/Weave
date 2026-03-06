import { Card } from '../components/Card.jsx';
import { CodeBlock } from '../components/CodeBlock.jsx';
import { Section } from '../components/Section.jsx';

const headers = [
  {
    name: 'Corporate Header',
    preview: (
      <div className="header_preview header_preview_a">
        <div className="header_preview_brand">WEAVE</div>
        <div className="header_preview_links">
          <span>Company</span>
          <span>Projects</span>
          <span>Support</span>
        </div>
      </div>
    ),
    html: `<header class="header header--corporate">
  <a class="brand">WEAVE</a>
  <nav>
    <a>Company</a>
    <a>Projects</a>
    <a>Support</a>
  </nav>
</header>`,
    css: `.header--corporate {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-radius: 20px;
}`,
  },
  {
    name: 'Product Header',
    preview: (
      <div className="header_preview header_preview_b">
        <div className="header_preview_brand">WEAVE Studio</div>
        <button className="header_preview_cta">Launch</button>
      </div>
    ),
    html: `<header class="header header--product">
  <a class="brand">WEAVE Studio</a>
  <button>Launch</button>
</header>`,
    css: `.header--product {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 18px 22px;
}`,
  },
  {
    name: 'Magazine Header',
    preview: (
      <div className="header_preview header_preview_c">
        <span className="header_preview_kicker">Issue 03</span>
        <div className="header_preview_brand">WEAVE Journal</div>
      </div>
    ),
    html: `<header class="header header--magazine">
  <span class="kicker">Issue 03</span>
  <a class="brand">WEAVE Journal</a>
</header>`,
    css: `.header--magazine {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px;
}`,
  },
];

export function UILibraryPage() {
  return (
    <div className="page_shell">
      <Section
        eyebrow="UI Library"
        title="프로젝트에서 재사용하는 UI 패턴 갤러리"
        description="현재는 Header Gallery부터 시작하고, 이후 tabs, accordion, modal, card, navigation 컴포넌트를 확장할 수 있는 구조로 만들었습니다."
        align="wide"
      >
        <div className="ui_library_stack">
          <div className="coming_soon_row">
            <span>Header</span>
            <span>Tabs</span>
            <span>Accordion</span>
            <span>Modal</span>
            <span>Card</span>
            <span>Navigation</span>
          </div>

          {headers.map((header) => (
            <Card key={header.name} className="ui_showcase_card">
              <div className="ui_showcase_head">
                <div>
                  <h3>{header.name}</h3>
                  <p>Preview, HTML, CSS 예시를 함께 제공하는 UI 컴포넌트 문서 카드입니다.</p>
                </div>
              </div>
              <div className="ui_showcase_preview">{header.preview}</div>
              <div className="docs_grid_2">
                <CodeBlock language="html" code={header.html} />
                <CodeBlock language="css" code={header.css} />
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
