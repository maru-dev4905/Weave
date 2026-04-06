import { Card } from '../components/Card.jsx';
import { CodeBlock } from '../components/CodeBlock.jsx';
import { Section } from '../components/Section.jsx';
import { Sidebar } from '../components/Sidebar.jsx';

const sidebarItems = [
  { href: '#overview', label: '개요' },
  { href: '#fade', label: 'Fade' },
  { href: '#marquee', label: 'Marquee' },
];

const moduleCards = [
  {
    title: 'Fade',
    selector: '[data-weave-anim="fade"]',
    summary: '상, 하, 좌, 우 방향의 진입 애니메이션과 duration, delay, trigger, scrub, once 옵션을 다룹니다.',
  },
  {
    title: 'Marquee',
    selector: '[data-weave-anim="marquee"]',
    summary: 'left, right 방향으로 흐르는 연속 marquee 애니메이션과 속도를 단순한 속성으로 제어합니다.',
  },
];

const fadeGuideRows = [
  ['root', '[data-weave-anim]', '애니메이션 루트 셀렉터입니다.'],
  ['type', 'data-weave-anim="fade"', 'fade 모드로 동작합니다.'],
  ['direction', 'up | down | left | right', '초기 진입 방향을 지정합니다.'],
  ['duration', 'number(second)', '애니메이션 재생 시간을 초 단위로 지정합니다.'],
  ['delay', 'number(second)', '재생 전 대기 시간을 초 단위로 지정합니다.'],
  ['trigger', 'true | false', '뷰포트에 들어왔을 때 시작할지 여부입니다.'],
  ['scrub', 'true | false', '스크롤 양에 맞춰 점진적으로 나타날지 여부입니다.'],
  ['once', 'true | false', 'trigger fade가 한 번만 실행될지, 다시 진입하면 재실행될지 정합니다.'],
];

const marqueeGuideRows = [
  ['root', '[data-weave-anim]', '애니메이션 루트 셀렉터입니다.'],
  ['type', 'data-weave-anim="marquee"', 'marquee 모드로 동작합니다.'],
  ['direction', 'left | right', '흐르는 방향을 지정합니다.'],
  ['speed', 'number(px/s)', '초당 이동 속도를 기준으로 marquee 속도를 제어합니다.'],
  ['gap', 'number(px)', '반복 그룹 간 간격을 지정합니다.'],
];

const fadeCheckpoints = [
  'fade 기본값은 `direction=up`, `duration=0.4`, `delay=0`, `trigger=true`, `scrub=false`, `once=false`입니다.',
  '`scrub=true`일 때는 일반 fade보다 스크롤 연동형 의미가 강하므로 trigger 옵션보다 scrub이 우선됩니다.',
  '`once=true`면 한 번만 재생되고, `once=false`면 화면에서 빠졌다 다시 들어올 때 재실행됩니다.',
  'fade는 `up/down/left/right` 네 방향만 먼저 지원해 규칙을 단순하게 유지합니다.',
];

const marqueeCheckpoints = [
  'marquee 속도는 `px/s` 의미의 숫자로 고정해 감각적으로 조절하기 쉽게 정리했습니다.',
  '반복 콘텐츠는 플러그인이 내부에서 자동 복제하므로 사용자는 한 벌의 마크업만 작성하면 됩니다.',
  '1차 범위에서는 gap, hover stop, pause 같은 세부 기능은 제외하고 방향과 속도만 다룹니다.',
];

export function AnimPage() {
  return (
    <div className="page_shell page_shell_with_sidebar">
      <Sidebar title="On this page" items={sidebarItems} />

      <div className="page_content">
        <Section
          id="overview"
          eyebrow="Anim"
          title="GSAP 기반 애니메이션 모듈"
          description="`data-weave-anim` 하나를 기준으로 fade와 marquee를 같은 규칙 안에서 다룰 수 있도록 정리했습니다."
          align="wide"
        >
          <Card className="intro_banner">
            <div>
              <strong>Selector</strong>
              <span>`data-weave-anim` + type 분기</span>
            </div>
            <div>
              <strong>Engine</strong>
              <span>GSAP + ScrollTrigger</span>
            </div>
            <div>
              <strong>Range</strong>
              <span>Fade, Marquee</span>
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
          id="fade"
          eyebrow="Module"
          title="Fade"
          description="방향, 속도, 딜레이, viewport 진입 트리거, 스크롤 연동 scrub fade와 once/replay 옵션을 한 번에 테스트할 수 있습니다."
        >
          <Card>
            <div className="demo_card_head">
              <div>
                <h3>Live Demo</h3>
                <p>기본 fade 방향과 scroll scrub 차이를 같은 섹션 안에서 비교할 수 있도록 구성했습니다.</p>
              </div>
            </div>

            <div className="anim_fade_demo_grid mt_20">
              <div
                className="anim_demo_surface"
                data-weave-anim
                data-weave-anim="fade"
                data-weave-anim-direction="up"
              >
                <span className="badge_pill">UP</span>
                <strong>Fade Up</strong>
                <p>기본 진입 방향은 아래에서 위로 올라오며 나타납니다.</p>
              </div>

              <div
                className="anim_demo_surface"
                data-weave-anim
                data-weave-anim="fade"
                data-weave-anim-direction="down"
                data-weave-anim-duration="1.2"
                data-weave-anim-once="false"
              >
                <span className="badge_pill">DOWN</span>
                <strong>Replay Fade Down</strong>
                <p>once를 끄면 위로 벗어날 때 자연스럽게 역재생되고, 다시 진입하면 같은 fade가 다시 실행됩니다.</p>
              </div>

              <div
                className="anim_demo_surface"
                data-weave-anim
                data-weave-anim="fade"
                data-weave-anim-direction="left"
                data-weave-anim-delay="0.2"
              >
                <span className="badge_pill">LEFT</span>
                <strong>Fade Left</strong>
                <p>delay를 둬서 약간 늦게 들어오는 패턴을 테스트할 수 있습니다.</p>
              </div>

              <div
                className="anim_demo_surface"
                data-weave-anim
                data-weave-anim="fade"
                data-weave-anim-direction="right"
                data-weave-anim-trigger="false"
              >
                <span className="badge_pill">RIGHT</span>
                <strong>Immediate Fade</strong>
                <p>trigger를 끄면 mount 시점에 바로 나타납니다.</p>
              </div>
            </div>

            <div className="anim_scrub_demo mt_20">
              <div className="anim_scrub_spacer">스크롤해서 아래 scrub 예시를 확인하세요.</div>
              <div
                className="anim_demo_surface anim_demo_surface_scrub"
                data-weave-anim
                data-weave-anim="fade"
                data-weave-anim-direction="up"
                data-weave-anim-scrub="true"
                data-weave-anim-start="top 85%"
                data-weave-anim-end="top 30%"
              >
                <span className="badge_pill">SCRUB</span>
                <strong>Scroll Linked Fade</strong>
                <p>스크롤 양에 따라 점진적으로 opacity와 위치가 풀리는 fade 예시입니다.</p>
              </div>
            </div>

            <ModuleReference
              htmlCode={`<div
  data-weave-anim="fade"
  data-weave-anim-direction="up"
  data-weave-anim-duration="0.8"
  data-weave-anim-delay="0.2"
  data-weave-anim-trigger="true"
  data-weave-anim-scrub="false"
  data-weave-anim-once="false"
>
  Fade content
</div>`}
              jsCode={`import { createWeave, animPlugin } from '@weave/wv/dist/js/core.js';

const app = createWeave({
  plugins: [animPlugin.fadeAnim()],
});

app.mount();`}
              checkpoints={fadeCheckpoints}
              rows={fadeGuideRows}
            />
          </Card>
        </Section>

        <Section
          id="marquee"
          eyebrow="Module"
          title="Marquee"
          description="left, right 방향과 속도만으로 단순하게 반복 흐름을 만드는 marquee 모듈입니다."
        >
          <Card>
            <div className="demo_card_head">
              <div>
                <h3>Live Demo</h3>
                <p>한 벌의 마크업만 넣으면 플러그인이 내부에서 자동 복제해 연속 흐름을 만듭니다.</p>
              </div>
            </div>

            <div
              className="anim_marquee_demo mt_20"
              data-weave-anim="marquee"
              data-weave-anim-direction="left"
              data-weave-anim-speed="90"
            >
              <span className="anim_chip">WEAVE</span>
              <span className="anim_chip">Fade</span>
              <span className="anim_chip">ScrollTrigger</span>
              <span className="anim_chip">Marquee</span>
              <span className="anim_chip">Publisher UI</span>
            </div>

            <div
              className="anim_marquee_demo mt_20"
              data-weave-anim="marquee"
              data-weave-anim-direction="right"
              data-weave-anim-speed="140"
            >
              <span className="anim_chip">Right Flow</span>
              <span className="anim_chip">Speed 140</span>
              <span className="anim_chip">Loop</span>
              <span className="anim_chip">GSAP</span>
              <span className="anim_chip">WEAVE Anim</span>
            </div>

            <ModuleReference
              htmlCode={`<div
  data-weave-anim="marquee"
  data-weave-anim-direction="left"
  data-weave-anim-speed="90"
>
  <span>WEAVE</span>
  <span>Fade</span>
  <span>Marquee</span>
</div>`}
              jsCode={`import { createWeave, animPlugin } from '@weave/wv/dist/js/core.js';

const app = createWeave({
  plugins: [animPlugin.marqueeAnim()],
});

app.mount();`}
              checkpoints={marqueeCheckpoints}
              rows={marqueeGuideRows}
            />
          </Card>
        </Section>
      </div>
    </div>
  );
}

function GuideTable({ headers, rows }) {
  return (
    <Card className="guide_table_card">
      <div className="guide_table_wrap">
        <table className="guide_table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`${headers[0]}-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${rowIndex}-${cellIndex}`}>
                    {typeof cell === 'string' && (cell.startsWith('.') || cell.startsWith('[') || cell.startsWith('data-'))
                      ? <code>{cell}</code>
                      : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
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
