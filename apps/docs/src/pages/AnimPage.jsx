import { Card } from '../components/Card.jsx';
import { CodeBlock } from '../components/CodeBlock.jsx';
import { GuideTable } from '../components/GuideTable.jsx';
import { Section } from '../components/Section.jsx';
import { Sidebar } from '../components/Sidebar.jsx';

const sidebarItems = [
  { href: '#overview', label: '개요' },
  { href: '#fade', label: 'Fade' },
  { href: '#parallax', label: 'Parallax' },
  { href: '#cascade', label: 'Cascade' },
  { href: '#marquee', label: 'Marquee' },
  { href: '#ticker', label: 'Ticker' },
  { href: '#count', label: 'Count' },
];

const moduleCards = [
  {
    title: 'Fade',
    selector: '[data-weave-anim="fade"]',
    summary: '상, 하, 좌, 우 방향의 진입 애니메이션과 duration, delay, trigger, scrub, once 옵션을 다룹니다.',
  },
  {
    title: 'Parallax',
    selector: '[data-weave-anim="parallax"]',
    summary: '스크롤 구간 동안 y축만 이동하는 parallax 모듈로, up/down 방향과 speed, distance, breakpoint 비활성 제어를 다룹니다.',
  },
  {
    title: 'Cascade',
    selector: '[data-weave-anim="cascade"]',
    summary: '컨테이너 안 자식 요소들을 순차적으로 등장시키며 direction, stagger, children selector를 함께 제어합니다.',
  },
  {
    title: 'Marquee',
    selector: '[data-weave-anim="marquee"]',
    summary: 'left, right 방향으로 흐르는 연속 marquee 애니메이션과 속도를 단순한 속성으로 제어합니다.',
  },
  {
    title: 'Ticker',
    selector: '[data-weave-anim="ticker"]',
    summary: '한 줄 뉴스/공지 스트립에 맞춘 ticker 모듈로, direction, speed, gap, hover pause를 단순한 속성으로 제어합니다.',
  },
  {
    title: 'Count',
    selector: '[data-weave-anim="count"]',
    summary: '숫자를 from부터 to까지 증가시키고 prefix, suffix, decimals, separator 포맷을 함께 제어합니다.',
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

const parallaxGuideRows = [
  ['root', '[data-weave-anim]', '애니메이션 루트 셀렉터입니다.'],
  ['type', 'data-weave-anim="parallax"', 'parallax 모드로 동작합니다.'],
  ['direction', 'up | down', '스크롤 구간 동안 이동할 y축 방향입니다.'],
  ['speed', 'number(0.1~1)', 'distance에 곱해지는 체감 속도 배수입니다.'],
  ['distance', 'number(px)', '총 이동 거리 기준값입니다.'],
  ['start / end', 'ScrollTrigger string', 'parallax 스크롤 구간의 시작/종료 지점입니다.'],
  ['responsive.disableBelow', 'number(px)', '플러그인 객체 인수로 받는 비활성 breakpoint입니다.'],
];

const tickerGuideRows = [
  ['root', '[data-weave-anim]', '애니메이션 루트 셀렉터입니다.'],
  ['type', 'data-weave-anim="ticker"', 'ticker 모드로 동작합니다.'],
  ['direction', 'left | right', '한 줄 스트립이 흐르는 방향입니다.'],
  ['speed', 'number(px/s)', '초당 이동 속도를 기준으로 ticker 흐름을 제어합니다.'],
  ['gap', 'number(px)', '반복 그룹 사이 간격을 지정합니다.'],
  ['pause', 'true | false', 'hover 시 일시정지할지 여부입니다.'],
];

const cascadeGuideRows = [
  ['root', '[data-weave-anim]', '애니메이션 루트 셀렉터입니다.'],
  ['type', 'data-weave-anim="cascade"', 'cascade 모드로 동작합니다.'],
  ['children', 'selector', '대상 자식 셀렉터입니다. 비우면 직계 자식을 순차 애니메이션합니다.'],
  ['direction', 'up | down | left | right', '각 아이템의 초기 진입 방향입니다.'],
  ['duration', 'number(second)', '각 아이템의 재생 시간을 초 단위로 지정합니다.'],
  ['stagger', 'number(second)', '아이템 간 순차 시작 간격입니다.'],
  ['delay', 'number(second)', '전체 그룹 재생 전 대기 시간입니다.'],
  ['once', 'true | false', '한 번만 재생할지, 다시 진입하면 재실행할지 정합니다.'],
];

const countGuideRows = [
  ['root', '[data-weave-anim]', '애니메이션 루트 셀렉터입니다.'],
  ['type', 'data-weave-anim="count"', 'count 모드로 동작합니다.'],
  ['from', 'number', '카운트 시작 숫자입니다.'],
  ['to', 'number', '카운트 종료 숫자입니다. 없으면 요소 텍스트의 숫자를 목표값으로 사용합니다.'],
  ['duration', 'number(second)', '카운트 재생 시간을 초 단위로 지정합니다.'],
  ['decimals', 'number', '소수점 자리 수를 지정합니다.'],
  ['prefix', 'string', '숫자 앞에 붙는 문자열입니다.'],
  ['suffix', 'string', '숫자 뒤에 붙는 문자열입니다.'],
  ['separator', 'true | false', '천 단위 구분자를 사용할지 정합니다.'],
  ['once', 'true | false', '한 번만 실행할지, 다시 진입 시 재실행할지 정합니다.'],
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

const parallaxCheckpoints = [
  '1차 범위에서는 `up/down` 두 방향만 지원하고, `x` 이동이나 회전 효과는 넣지 않았습니다.',
  'parallax는 항상 scrub 기반으로 동작하므로 `once` 옵션은 제공하지 않습니다.',
  '소형 화면 비활성은 마크업 속성이 아니라 `animPlugin.parallaxAnim({ responsive: { disableBelow } })` 객체 인수로만 제어합니다.',
  'transform 충돌을 줄이기 위해 실제 비주얼 블록이나 wrapper에 적용하는 사용 패턴을 권장합니다.',
];

const tickerCheckpoints = [
  'ticker는 공지, 뉴스, 헤드라인처럼 한 줄 텍스트 스트립에 맞춘 모듈로 `marquee`보다 텍스트 중심 사용에 가깝습니다.',
  '`pause=true`면 hover 시 흐름을 멈춰 사용자가 내용을 읽기 쉽게 만들 수 있습니다.',
  '플러그인이 내부에서 반복 그룹을 복제하므로 사용자는 한 벌의 문구 세트만 작성하면 됩니다.',
];

const cascadeCheckpoints = [
  '기본적으로는 컨테이너의 직계 자식들을 순서대로 animate하고, 필요하면 `children` 셀렉터로 대상을 좁힐 수 있습니다.',
  '`stagger` 값으로 각 아이템의 등장 간격을 초 단위로 제어해 리스트, 카드 묶음, 메뉴 reveal에 바로 쓸 수 있습니다.',
  '`once=false`면 컨테이너가 화면 위로 빠졌다가 다시 들어올 때 전체 순차 애니메이션이 다시 실행됩니다.',
];

const countCheckpoints = [
  '기본적으로 `to`가 있으면 그 값을 쓰고, 없으면 요소 텍스트 안 숫자를 읽어 목표값으로 사용합니다.',
  '`prefix`, `suffix`, `separator`, `decimals`를 함께 써서 KPI 카드 표현을 바로 맞출 수 있습니다.',
  '`once=false`면 화면 위로 다시 벗어났을 때 시작값으로 리셋되고, 다시 진입하면 다시 카운트됩니다.',
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
          description="`data-weave-anim` 하나를 기준으로 fade, parallax, cascade, marquee, ticker, count를 같은 규칙 안에서 다룰 수 있도록 정리했습니다."
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
              <span>Fade, Parallax, Cascade, Marquee, Ticker, Count</span>
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
                data-weave-anim="fade"
                data-weave-anim-direction="up"
              >
                <span className="badge_pill">UP</span>
                <strong>Fade Up</strong>
                <p>기본 진입 방향은 아래에서 위로 올라오며 나타납니다.</p>
              </div>

              <div
                className="anim_demo_surface"
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
          id="parallax"
          eyebrow="Module"
          title="Parallax"
          description="스크롤 구간 동안 y축만 이동해 깊이감을 만드는 parallax 모듈로, up/down 방향과 breakpoint 기반 비활성 분기를 함께 제공합니다."
        >
          <Card>
            <div className="demo_card_head">
              <div>
                <h3>Live Demo</h3>
                <p>작은 화면은 플러그인 객체 인수에서 끄고, 충분한 높이를 가진 비주얼 블록에 적용하는 방식을 기준으로 구성했습니다.</p>
              </div>
            </div>

            <div className="anim_parallax_demo_stack mt_20">
              <div className="anim_parallax_frame">
                <div
                  className="anim_parallax_panel anim_parallax_panel_up"
                  data-weave-anim="parallax"
                  data-weave-anim-direction="up"
                  data-weave-anim-speed="0.25"
                  data-weave-anim-distance="120"
                >
                  <span className="badge_pill">UP</span>
                  <strong>Layered Editorial Panel</strong>
                  <p>스크롤이 진행될수록 위로 이동하며 깊이감을 만드는 기본 parallax 예시입니다.</p>
                </div>
              </div>

              <div className="anim_parallax_frame">
                <div
                  className="anim_parallax_panel anim_parallax_panel_down"
                  data-weave-anim="parallax"
                  data-weave-anim-direction="down"
                  data-weave-anim-speed="0.18"
                  data-weave-anim-distance="140"
                  data-weave-anim-start="top 90%"
                  data-weave-anim-end="bottom 10%"
                >
                  <span className="badge_pill">DOWN</span>
                  <strong>Floating Depth Block</strong>
                  <p>방향을 down으로 바꾸면 반대 방향 흐름을 만들 수 있고, start/end로 구간도 세밀하게 조정할 수 있습니다.</p>
                </div>
              </div>
            </div>

            <ModuleReference
              htmlCode={`<div
  data-weave-anim="parallax"
  data-weave-anim-direction="up"
  data-weave-anim-speed="0.2"
  data-weave-anim-distance="80"
  data-weave-anim-start="top bottom"
  data-weave-anim-end="bottom top"
>
  Parallax content
</div>`}
              jsCode={`import { createWeave, animPlugin } from '@weave/wv/dist/js/core.js';

const app = createWeave({
  plugins: [
    animPlugin.parallaxAnim({
      responsive: {
        disableBelow: 768,
      },
    }),
  ],
});

app.mount();`}
              checkpoints={parallaxCheckpoints}
              rows={parallaxGuideRows}
            />
          </Card>
        </Section>

        <Section
          id="cascade"
          eyebrow="Module"
          title="Cascade"
          description="컨테이너 안 여러 요소를 순차적으로 드러내는 그룹 애니메이션으로, 카드 리스트나 메뉴 reveal 패턴에 맞는 모듈입니다."
        >
          <Card>
            <div className="demo_card_head">
              <div>
                <h3>Live Demo</h3>
                <p>직계 자식을 그대로 쓰는 기본형과, selector로 특정 아이템만 순차 처리하는 확장형을 같이 확인할 수 있습니다.</p>
              </div>
            </div>

            <div className="anim_cascade_demo_grid mt_20">
              <div
                className="anim_cascade_demo"
                data-weave-anim="cascade"
                data-weave-anim-direction="up"
                data-weave-anim-stagger="0.12"
              >
                <div className="anim_cascade_item">
                  <span className="badge_pill">01</span>
                  <strong>Structure First</strong>
                  <p>여러 카드가 아래에서 위로 순차 등장하는 기본 cascade 패턴입니다.</p>
                </div>
                <div className="anim_cascade_item">
                  <span className="badge_pill">02</span>
                  <strong>Consistent Rhythm</strong>
                  <p>같은 duration 안에서 stagger만으로 리듬감을 만들 수 있습니다.</p>
                </div>
                <div className="anim_cascade_item">
                  <span className="badge_pill">03</span>
                  <strong>Reusable Group</strong>
                  <p>메뉴, 카드, 배지 리스트처럼 반복 구조에 바로 적용하기 좋습니다.</p>
                </div>
              </div>

              <div
                className="anim_cascade_demo"
                data-weave-anim="cascade"
                data-weave-anim-children=".anim_cascade_list_item"
                data-weave-anim-direction="left"
                data-weave-anim-duration="0.55"
                data-weave-anim-stagger="0.08"
                data-weave-anim-once="false"
              >
                <div className="anim_cascade_head">
                  <span className="badge_pill">SELECTOR</span>
                  <strong>Targeted Cascade List</strong>
                  <p>헤더는 고정하고 실제 리스트 아이템만 순차 reveal 하도록 children selector를 분리할 수 있습니다.</p>
                </div>

                <div className="anim_cascade_list">
                  <div className="anim_cascade_list_item">Publisher-ready layout blocks</div>
                  <div className="anim_cascade_list_item">Scroll-triggered entry timing</div>
                  <div className="anim_cascade_list_item">Replay on re-entry with once=false</div>
                  <div className="anim_cascade_list_item">Selector-based target control</div>
                </div>
              </div>
            </div>

            <ModuleReference
              htmlCode={`<div
  data-weave-anim="cascade"
  data-weave-anim-children=".item"
  data-weave-anim-direction="up"
  data-weave-anim-duration="0.5"
  data-weave-anim-stagger="0.12"
  data-weave-anim-once="false"
>
  <div class="item">First</div>
  <div class="item">Second</div>
  <div class="item">Third</div>
</div>`}
              jsCode={`import { createWeave, animPlugin } from '@weave/wv/dist/js/core.js';

const app = createWeave({
  plugins: [animPlugin.cascadeAnim()],
});

app.mount();`}
              checkpoints={cascadeCheckpoints}
              rows={cascadeGuideRows}
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

        <Section
          id="ticker"
          eyebrow="Module"
          title="Ticker"
          description="한 줄 공지/헤드라인 스트립에 맞춘 ticker 모듈로, hover pause와 일정한 흐름 속도를 함께 제공합니다."
        >
          <Card>
            <div className="demo_card_head">
              <div>
                <h3>Live Demo</h3>
                <p>마우스를 올리면 멈추는 기본 공지형 스트립과, 반대 방향으로 흐르는 헤드라인형 스트립을 같이 비교할 수 있습니다.</p>
              </div>
            </div>

            <div
              className="anim_ticker_demo mt_20"
              data-weave-anim="ticker"
              data-weave-anim-direction="left"
              data-weave-anim-speed="120"
              data-weave-anim-gap="36"
              data-weave-anim-pause="true"
            >
              <span className="anim_ticker_badge">NOTICE</span>
              <span className="anim_ticker_item">WEAVE starter kit structure updated</span>
              <span className="anim_ticker_item">Anim docs now include Fade, Cascade, Parallax</span>
              <span className="anim_ticker_item">Hover to pause and inspect the message flow</span>
            </div>

            <div
              className="anim_ticker_demo mt_20"
              data-weave-anim="ticker"
              data-weave-anim-direction="right"
              data-weave-anim-speed="88"
              data-weave-anim-gap="48"
              data-weave-anim-pause="false"
            >
              <span className="anim_ticker_badge">HEADLINE</span>
              <span className="anim_ticker_item">Publisher-ready modules</span>
              <span className="anim_ticker_item">Continuous text band</span>
              <span className="anim_ticker_item">Directional control</span>
              <span className="anim_ticker_item">Simple hover pause option</span>
            </div>

            <ModuleReference
              htmlCode={`<div
  data-weave-anim="ticker"
  data-weave-anim-direction="left"
  data-weave-anim-speed="120"
  data-weave-anim-gap="36"
  data-weave-anim-pause="true"
>
  <span>NOTICE</span>
  <span>WEAVE starter kit updated</span>
  <span>Hover to pause</span>
</div>`}
              jsCode={`import { createWeave, animPlugin } from '@weave/wv/dist/js/core.js';

const app = createWeave({
  plugins: [animPlugin.tickerAnim()],
});

app.mount();`}
              checkpoints={tickerCheckpoints}
              rows={tickerGuideRows}
            />
          </Card>
        </Section>

        <Section
          id="count"
          eyebrow="Module"
          title="Count"
          description="숫자를 from부터 to까지 증가시키고 접두/접미, 소수점, 천 단위 구분자까지 함께 제어하는 count 애니메이션입니다."
        >
          <Card>
            <div className="demo_card_head">
              <div>
                <h3>Live Demo</h3>
                <p>KPI 카드처럼 바로 써볼 수 있도록 정수, 퍼센트, 접두/접미 조합 예시를 함께 구성했습니다.</p>
              </div>
            </div>

            <div className="anim_count_demo_grid mt_20">
              <div className="anim_count_card">
                <span className="badge_pill">ORDERS</span>
                <strong
                  className="anim_count_value"
                  data-weave-anim="count"
                  data-weave-anim-from="0"
                  data-weave-anim-to="1280"
                  data-weave-anim-duration="1.2"
                  data-weave-anim-separator="true"
                  data-weave-anim-suffix="건"
                >
                  1,280건
                </strong>
                <p>천 단위 구분자와 suffix를 붙여 정수 KPI를 표현하는 예시입니다.</p>
              </div>

              <div className="anim_count_card">
                <span className="badge_pill">CONVERSION</span>
                <strong
                  className="anim_count_value"
                  data-weave-anim="count"
                  data-weave-anim-from="0"
                  data-weave-anim-to="98.5"
                  data-weave-anim-duration="1.1"
                  data-weave-anim-decimals="1"
                  data-weave-anim-suffix="%"
                >
                  98.5%
                </strong>
                <p>소수점 자리 수와 suffix를 사용해 퍼센트 지표를 표시합니다.</p>
              </div>

              <div className="anim_count_card">
                <span className="badge_pill">REVENUE</span>
                <strong
                  className="anim_count_value"
                  data-weave-anim="count"
                  data-weave-anim-from="100"
                  data-weave-anim-to="5600"
                  data-weave-anim-duration="1.4"
                  data-weave-anim-prefix="$"
                  data-weave-anim-separator="true"
                  data-weave-anim-once="false"
                >
                  $5,600
                </strong>
                <p>prefix와 separator를 함께 쓰고, once를 꺼서 다시 진입 시 재실행하는 예시입니다.</p>
              </div>
            </div>

            <ModuleReference
              htmlCode={`<strong
  data-weave-anim="count"
  data-weave-anim-from="0"
  data-weave-anim-to="1280"
  data-weave-anim-duration="1.2"
  data-weave-anim-separator="true"
  data-weave-anim-suffix="건"
>
  1,280건
</strong>`}
              jsCode={`import { createWeave, animPlugin } from '@weave/wv/dist/js/core.js';

const app = createWeave({
  plugins: [animPlugin.countAnim()],
});

app.mount();`}
              checkpoints={countCheckpoints}
              rows={countGuideRows}
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
