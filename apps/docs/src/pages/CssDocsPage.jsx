import { Card } from '../components/Card.jsx';
import { CodeBlock } from '../components/CodeBlock.jsx';
import { GuideTable } from '../components/GuideTable.jsx';
import { Section } from '../components/Section.jsx';
import { Sidebar } from '../components/Sidebar.jsx';

const sidebarItems = [
  { href: '#css-structure', label: '전체 구조' },
  { href: '#css-relationship', label: 'common.css와 wv.css' },
  { href: '#css-tokens', label: '토큰 체계' },
  { href: '#css-responsive', label: '반응형 체계' },
  { href: '#css-layout', label: 'Layout / Object' },
  { href: '#css-display', label: 'Display' },
  { href: '#css-flex', label: 'Flex' },
  { href: '#css-grid', label: 'Grid' },
  { href: '#css-opacity', label: 'Opacity' },
  { href: '#css-position', label: 'Position' },
  { href: '#css-zindex', label: 'Z-Index' },
  { href: '#css-spacing', label: 'Spacing' },
  { href: '#css-size', label: 'Sizing' },
  { href: '#css-radius', label: 'Radius' },
  { href: '#css-visibility', label: 'Visibility / Overflow' },
  { href: '#css-typography', label: 'Typography' },
  { href: '#css-color', label: 'Color' },
  { href: '#css-aspect', label: 'Aspect Ratio' },
  { href: '#css-helper', label: 'Helpers / Modal / Scroll' },
  { href: '#css-summary', label: '문서 요약' },
];

const structureRows = [
  ['common.css', '토큰 레이어', '색상, inner, gutter, radius 같은 CSS 변수 정의'],
  ['wv.css', '유틸리티 레이어', 'reset, a11y, layout, utility class, helper class, motion class 포함'],
  ['admin.css', '관리자 전용', '별도 스타일 확장용 파일'],
  ['gov.css', '관공서 전용', '별도 스타일 확장용 파일'],
];

const relationRows = [
  ['common.css', '--g_50', '.fc_g_50', '텍스트 색상 변경'],
  ['common.css', '--p_40', '.bgc_p_40', '배경색 변경'],
  ['common.css', '--rd_base', '.rd_base', 'border-radius 변경'],
  ['common.css', '--inner_base', '.inner', '컨테이너 최대 너비 변경'],
];

const tokenRows = [
  ['Layout', '--inner_sm ~ --inner_xl', '컨테이너 최대 너비'],
  ['Gutter', '--gutter_sm ~ --gutter_xl', '좌우 패딩'],
  ['Radius', '--rd_xs ~ --rd_xl', '의미 기반 반경 토큰'],
  ['Gray', 'g_*', '회색 스케일'],
  ['Primary', 'p_*', '메인 컬러'],
  ['Danger / Warning / Success', 'd_* / w_* / su_*', '상태 컬러'],
];

const responsiveRows = [
  ['wd', '1600px', 'wide desktop'],
  ['ds', '1440px', 'desktop standard'],
  ['nb', '1280px', 'notebook'],
  ['tb', '1024px', 'tablet'],
  ['md', '768px', 'mobile display'],
  ['접두사', 'tb_, md_, res_*', '반응형 유틸리티와 show/hide 제어'],
];

const layoutRows = [
  ['.inner', '기본 컨테이너', 'max-width: var(--inner_base)와 gutter 적용'],
  ['.inner_sm ~ .inner_xl', '사이즈별 컨테이너', 'max-width: var(--inner_*)'],
  ['.gutter_*', '좌우 패딩', 'padding-left / right: var(--gutter_*)'],
  ['.w_max_content', '최대 콘텐츠 너비', 'width: max-content !important'],
];

const displayRows = [
  ['.dp_b', 'display: block;', '블록 요소로 표시'],
  ['.dp_i', 'display: inline;', '인라인 요소로 표시'],
  ['.dp_ib', 'display: inline-block;', '인라인 흐름 + 박스 속성 유지'],
  ['.dp_f', 'display: flex;', 'flex 컨테이너 시작'],
  ['.dp_g', 'display: grid;', 'grid 컨테이너 시작'],
  ['.dp_n', 'display: none;', '요소 숨김'],
];

const flexRows = [
  ['.fd_row / .fd_col', 'flex-direction', '주축 방향 지정'],
  ['.al_start / .al_center / .al_end', 'align-items', '교차축 정렬 제어'],
  ['.jtf_start / .jtf_center / .jtf_bet', 'justify-content', '주축 정렬/분배 제어'],
  ['.fd_wrap / .fd_nowrap', 'flex-wrap', '줄바꿈 허용 여부'],
  ['.gap*', 'gap', '아이템 간격 제어'],
];

const gridRows = [
  ['.grid_lay', '12열 grid', '12열 기반 레이아웃 컨테이너'],
  ['.colST1 ~ .colST12, .colST-1 ~ .colST-12', 'grid-column-start', '시작 컬럼(양수/음수) 지정'],
  ['.colED1 ~ .colED12, .colED-1 ~ .colED-12', 'grid-column-end', '종료 컬럼(양수/음수) 지정'],
  ['.rowST1 ~ .rowST12, .rowED1 ~ .rowED12', 'grid-row-start/end', '행 시작/종료 지정'],
  ['.gap*', 'gap', 'grid 셀 간격 제어'],
];

const spacingRows = [
  ['.m_* / .mt_* / .mb_*', 'margin', '외부 여백 제어'],
  ['.pt_* / .pr_* / .pb_* / .pl_*', 'padding', '내부 여백 제어'],
  ['.mx_auto / .my_auto', 'auto margin', '가로/세로 auto 정렬'],
  ['.md_* / .tb_*', 'responsive spacing', '브레이크포인트별 여백 제어'],
];

const typographyRows = [
  ['.fs_10 ~ .fs_200', 'font-size', '글자 크기 스케일 제어'],
  ['.fw_thin ~ .fw_heavy', 'font-weight', '굵기(100~900) 제어'],
  ['.lih20~64 + .lih100per~220per', 'line-height', '줄간격 제어'],
  ['.ta_left / .ta_center / .ta_right', 'text-align', '문단 정렬 제어'],
  ['.txt_over_dot + .clamp*', 'line clamp', '멀티라인 말줄임 처리'],
];

const colorRows = [
  ['.fc_*', 'color', '텍스트 색상 적용 (g/p/s1/s2/d/w/su/i 계열)'],
  ['.bgc_*', 'background-color', '배경 색상 적용 (동일 토큰 계열)'],
  ['토큰 연결', 'var(--g_*), var(--p_*)', 'common.css 토큰 값 참조'],
];

const opacityRows = [
  ['.op_0 ~ .op_10', 'opacity: 0 ~ 1', '0.1 단위 투명도 제어'],
  ['.md_op_0 ~ .md_op_10', 'responsive opacity', '모바일 전용 투명도 제어'],
];

const positionRows = [
  ['.pos_re', 'position: relative;', '기준 좌표 컨테이너'],
  ['.pos_ab', 'position: absolute;', '상대 기준 절대 배치'],
  ['.pos_fx', 'position: fixed;', '뷰포트 고정 배치'],
  ['.pos_sk', 'position: sticky;', '스크롤 구간 고정 배치'],
  ['.pos_st', 'position: static;', '기본 배치'],
];

const zindexRows = [
  ['.z_idx1 ~ .z_idx20', 'z-index', '레이어 우선순위 제어'],
  ['.md_z_idx1 ~ .md_z_idx20', 'responsive z-index', '모바일 구간 레이어 제어'],
];

const sizeRows = [
  ['.w_full / .h_full', 'width/height: 100%', '부모 기준 전체 확장'],
  ['.w_* / .h_*', 'width/height', '스케일 기반 고정 크기'],
  ['.mw_* / .mh_*', 'max-width/max-height', '최대 크기 제한'],
  ['.w_auto / .h_auto', 'auto sizing', '콘텐츠 기준 크기'],
];

const radiusRows = [
  ['.rd_base ~ .rd_xl', 'semantic radius token', '토큰 기반 반경'],
  ['.rd_0 / .rd_1 / ... / .rd_12', 'fixed radius token', '숫자형 반경'],
  ['.rd_t / .rd_b / .rd_l / .rd_r', 'directional radius', '방향별 모서리 라운드'],
  ['.rd_tl / .rd_tr / .rd_bl / .rd_br', 'corner radius', '모서리 단위 제어'],
  ['.rd_full', 'border-radius: 9999px;', 'pill/circle 형태'],
];

const visibilityRows = [
  ['.m_show / .m_hide', 'mobile show/hide', '모바일 구간 표시 제어'],
  ['.res_1600_s / .res_1600_h', 'breakpoint show/hide', '특정 해상도 표시 제어'],
  ['.ov_h / .ov_a / .ov_v', 'overflow', '오버플로우 기본 제어'],
  ['.ovx_* / .ovy_*', 'overflow-x/y', '축 단위 스크롤 제어'],
];

const aspectRows = [
  ['.aspect_auto', 'aspect-ratio: auto;', '기본 비율'],
  ['.aspect_square', 'aspect-ratio: 1 / 1;', '정사각형 비율'],
  ['.aspect_video', 'aspect-ratio: 16 / 9;', '영상 비율'],
];

const helperRows = [
  ['.dot / .indent', 'list helper', '목록/들여쓰기 보조'],
  ['.wv_modal / .wv_modal.active', 'modal visibility', '모달 기본 상태/활성 상태'],
  ['.scrollbar_custom', 'custom scrollbar', '웹킷 스크롤바 스타일'],
  ['.scrollLock', 'scroll lock', '배경 스크롤 잠금'],
];

const gapScale = [300, 280, 260, 240, 200, 180, 160, 150, 140, 130, 120, 100, 90, 80, 70, 64, 60, 50, 40, 36, 30, 24, 20, 16, 12, 10, 8, 6, 4, 0];
const fontScale = [200, 180, 160, 140, 130, 120, 100, 80, 72, 68, 64, 60, 56, 52, 50, 48, 44, 40, 36, 32, 30, 28, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 14, 12, 11, 10];
const lineHeightScale = ['lih64', 'lih42', 'lih36', 'lih30', 'lih24', 'lih20', 'lih220per', 'lih170per', 'lih160per', 'lih150per', 'lih135per', 'lih130per', 'lih125per', 'lih120per', 'lih110per', 'lih100per'];

export function CssDocsPage() {
  return (
    <div className="page_shell page_shell_with_sidebar">
      <Sidebar items={sidebarItems} />

      <div className="page_content">
        <Section
          id="css-structure"
          eyebrow="Docs(CSS)"
          title="전체 구조"
          description="토큰 레이어와 유틸리티 레이어의 관계를 기준으로 실제 사용 파일과 역할을 정리했습니다."
          align="wide"
        >
          <GuideTable
            headers={['파일', '역할', '설명']}
            rows={structureRows}
          />
        </Section>

        <Section
          id="css-relationship"
          eyebrow="Token Link"
          title="common.css와 wv.css 관계"
          description="공통 유틸리티는 변수에 연결되고, 프로젝트는 common.css에서 값만 바꿔 사용할 수 있습니다."
        >
          <Card className="docs_note_card">
            <p>
              <strong>핵심 개념:</strong> <code>wv.css</code>는 유틸리티의 형태를 제공하고,
              <code>common.css</code>는 유틸리티가 참조하는 실제 값을 제공합니다.
            </p>
          </Card>
          <div className="mt_20">
            <GuideTable headers={['토큰 파일', '토큰', '소비 클래스', '효과']} rows={relationRows} />
          </div>
        </Section>

        <Section
          id="css-tokens"
          eyebrow="Tokens"
          title="토큰 체계"
          description="레이아웃, 간격, 반경, 색상 토큰을 중심으로 실제 클래스 연결 방식을 빠르게 볼 수 있습니다."
        >
          <GuideTable headers={['그룹', '토큰 또는 접두사', '의미']} rows={tokenRows} />
        </Section>

        <Section
          id="css-responsive"
          eyebrow="Responsive"
          title="반응형 접두사 체계"
          description="브레이크포인트와 접두사 규칙을 같이 보면 반응형 유틸리티 사용 흐름이 더 명확해집니다."
        >
          <GuideTable headers={['키', '값', '의미']} rows={responsiveRows} />
        </Section>

        <Section
          id="css-layout"
          eyebrow="Layout"
          title="Layout / Object"
          description="페이지 폭과 좌우 여백을 조절하는 기본 컨테이너 계열 클래스입니다."
        >
          <GuideTable headers={['클래스', '의미', '실제 스타일']} rows={layoutRows} />
        </Section>

        <Section
          id="css-display"
          eyebrow="Property"
          title="Display"
          description="요소가 문서 흐름에서 어떻게 배치될지 결정하는 가장 기본 속성입니다."
        >
          <GuideTable headers={['Class', 'Styles', '설명']} rows={displayRows} />
          <ExampleShowcase
            preview={(
              <div className="css_preview_box dp_f al_center jtf_bet bgc_w_40 pt_20 pr_20 pb_20 pl_20">
                <strong>Title</strong>
                <button type="button" className="dp_ib">Action</button>
              </div>
            )}
            code={`<div class="dp_f al_center jtf_bet bgc_w_40 pt_20 pr_20 pb_20 pl_20">
  <strong>Title</strong>
  <button type="button" class="dp_ib">Action</button>
</div>`}
          />
        </Section>

        <Section
          id="css-flex"
          eyebrow="Property"
          title="Flex"
          description="한 줄 또는 여러 줄 레이아웃에서 정렬과 분배를 빠르게 제어할 때 사용합니다."
        >
          <GuideTable headers={['Class', 'Styles', '설명']} rows={flexRows} />
          <ExampleShowcase
            preview={(
              <ul className="css_preview_box dp_f fd_row al_center jtf_bet gap20 bgc_g_10 fc_w_100 pt_20 pr_20 pb_20 pl_20 rd_base">
                <li className="fc_w_100">Home</li>
                <li className="fc_w_100">Docs</li>
                <li className="fc_w_100">API</li>
              </ul>
            )}
            code={`<ul class="dp_f fd_row al_center jtf_bet gap20 bgc_g_10 fc_w_100 pt_20 pr_20 pb_20 pl_20 rd_base">
  <li>Home</li>
  <li>Docs</li>
  <li>API</li>
</ul>`}
          />
          <Card className="docs_note_card mb_20">
            <h3>Gap Scale (px)</h3>
            <p><code>gap*</code> 유틸리티 전체 값입니다.</p>
            <CodeBlock language="txt" code={gapScale.map((value) => `gap${value}`).join(', ')} />
          </Card>
        </Section>

        <Section
          id="css-grid"
          eyebrow="Property"
          title="Grid"
          description="콘텐츠 영역을 열 단위로 안정적으로 분할할 때 사용합니다."
        >
          <GuideTable headers={['Class', 'Styles', '설명']} rows={gridRows} />
          <ExampleShowcase
            preview={(
              <section className="css_preview_box grid_lay gap20 pt_20 pr_20 pb_20 pl_20">
                <article className="colST1 colED8 bgc_w_40 rd_base pt_20 pr_20 pb_20 pl_20">colST1 colED8</article>
                <aside className="colST8 colED-1 bgc_g_10 fc_w_100 rd_base pt_20 pr_20 pb_20 pl_20">colST8 colED-1</aside>
              </section>
            )}
            code={`<section class="grid_lay gap20">
  <article class="colST1 colED8 bgc_w_40 rd_base pt_20 pr_20 pb_20 pl_20">colST1 colED8</article>
  <aside class="colST8 colED-1 bgc_g_10 fc_w_100 rd_base pt_20 pr_20 pb_20 pl_20">colST8 colED-1</aside>
</section>`}
          />
          <Card className="docs_note_card mb_20">
            <h3>Grid Range</h3>
            <ul className="check_list">
              <li><code>colST1 ~ colST12</code>, <code>colED1 ~ colED12</code></li>
              <li><code>colST-1 ~ colST-12</code>, <code>colED-1 ~ colED-12</code></li>
              <li><code>rowST1 ~ rowST12</code>, <code>rowED1 ~ rowED12</code></li>
            </ul>
          </Card>
        </Section>

        <Section
          id="css-opacity"
          eyebrow="Property"
          title="Opacity"
          description="투명도 유틸리티는 인터랙션 상태나 배경 계층의 시각적 강도를 조절할 때 사용합니다."
        >
          <GuideTable headers={['Class', 'Styles', '설명']} rows={opacityRows} />
          <ExampleShowcase
            preview={(
              <div className="css_preview_box dp_f fd_wrap gap10 pt_20 pr_20 pb_20 pl_20">
                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map((step) => (
                  <div key={step} className={`bgc_p_40 fc_w_100 pt_10 pr_10 pb_10 pl_10 rd_base op_${step}`}>
                    op_{step}
                  </div>
                ))}
              </div>
            )}
            code={`<div class="dp_f fd_wrap gap10">
  <div class="op_10">op_10</div>
  <div class="op_9">op_9</div>
  <div class="op_8">op_8</div>
  <div class="op_7">op_7</div>
  <div class="op_6">op_6</div>
  <div class="op_5">op_5</div>
  <div class="op_4">op_4</div>
  <div class="op_3">op_3</div>
  <div class="op_2">op_2</div>
  <div class="op_1">op_1</div>
  <div class="op_0">op_0</div>
</div>`}
          />
        </Section>

        <Section
          id="css-position"
          eyebrow="Property"
          title="Position"
          description="position 유틸리티는 레이어/뱃지/고정 버튼 같은 요소 배치 기준점을 만드는 데 사용합니다."
        >
          <GuideTable headers={['Class', 'Styles', '설명']} rows={positionRows} />
          <ExampleShowcase
            preview={(
              <div className="css_preview_box pos_re bgc_g_10 pt_20 pr_20 pb_20 pl_20 rd_base">
                <div className="bgc_w_100 fc_g_90 pt_20 pr_20 pb_20 pl_20 rd_base">relative container</div>
                <span className="pos_ab css_preview_badge bgc_p_40 fc_w_100 pt_10 pr_10 pb_10 pl_10 rd_full">absolute</span>
              </div>
            )}
            code={`<div class="pos_re bgc_g_10 pt_20 pr_20 pb_20 pl_20 rd_base">
  <div class="bgc_w_100 fc_g_90 pt_20 pr_20 pb_20 pl_20 rd_base">relative container</div>
  <span class="pos_ab">absolute</span>
</div>`}
          />
        </Section>

        <Section
          id="css-zindex"
          eyebrow="Property"
          title="Z-Index"
          description="겹치는 요소의 앞/뒤 순서를 제어합니다."
        >
          <GuideTable headers={['Class', 'Styles', '설명']} rows={zindexRows} />
          <Card className="docs_note_card mt_20 mb_20">
            <h3>Range</h3>
            <p><code>z_idx1</code> ~ <code>z_idx20</code>, <code>md_z_idx1</code> ~ <code>md_z_idx20</code></p>
          </Card>
        </Section>

        <Section
          id="css-visibility"
          eyebrow="Property"
          title="Visibility / Overflow"
          description="반응형 표시 제어와 스크롤 동작 제어를 함께 다룹니다."
        >
          <GuideTable headers={['Class', 'Styles', '설명']} rows={visibilityRows} />
        </Section>

        <Section
          id="css-spacing"
          eyebrow="Property"
          title="Spacing"
          description="여백은 가독성의 핵심입니다. margin과 padding을 역할에 따라 분리해 사용합니다."
        >
          <GuideTable headers={['Class', 'Styles', '설명']} rows={spacingRows} />
          <ExampleShowcase
            preview={(
              <article className="css_preview_box bgc_w_40 rd_base pt_20 pr_20 pb_20 pl_20">
                <h4 className="fs_20">Section title</h4>
                <p className="mt_20">첫 문단은 제목과 간격을 분리해 읽기 흐름을 만듭니다.</p>
                <p className="mt_10">본문 블록 간 간격은 10~20 단위로 통일합니다.</p>
              </article>
            )}
            code={`<article class="bgc_w_40 rd_base pt_20 pr_20 pb_20 pl_20">
  <h4 class="fs_20">Section title</h4>
  <p class="mt_20">첫 문단은 제목과 간격을 분리해 읽기 흐름을 만듭니다.</p>
  <p class="mt_10">본문 블록 간 간격은 10~20 단위로 통일합니다.</p>
</article>`}
          />
        </Section>

        <Section
          id="css-size"
          eyebrow="Property"
          title="Sizing"
          description="width/height 유틸리티로 고정 크기, 반응형 크기, 최대 크기 제한을 제어합니다."
        >
          <GuideTable headers={['Class', 'Styles', '설명']} rows={sizeRows} />
        </Section>

        <Section
          id="css-radius"
          eyebrow="Property"
          title="Radius"
          description="컴포넌트 모서리 형태를 통일할 때 사용합니다."
        >
          <GuideTable headers={['Class', 'Styles', '설명']} rows={radiusRows} />
        </Section>

        <Section
          id="css-typography"
          eyebrow="Property"
          title="Typography"
          description="텍스트 계층을 분명하게 나누면 화면 밀도가 높아져도 읽기 쉬워집니다."
        >
          <GuideTable headers={['Class', 'Styles', '설명']} rows={typographyRows} />
          <ExampleShowcase
            preview={(
              <header className="css_preview_box">
                <div className="bgc_g_10 fc_w_100 pt_20 pr_20 pb_20 pl_20 rd_base">
                  <h3 className="fs_20 fw_bold fc_w_100">문서 제목</h3>
                  <p className="mt_10 fs_16 fc_w_90 ta_left">설명 문구는 본문보다 한 단계 낮은 톤으로 구성합니다.</p>
                  <p className="mt_10 txt_over_dot clamp2 fc_w_80">긴 문장은 clamp 조합으로 2줄 이후 말줄임 처리할 수 있습니다. 긴 문장은 clamp 조합으로 2줄 이후 말줄임 처리할 수 있습니다.</p>
                </div>
              </header>
            )}
            code={`<header>
  <h3 class="fs_20 fw_bold fc_w_100">문서 제목</h3>
  <p class="mt_10 fs_16 fc_w_90 ta_left">설명 문구는 본문보다 한 단계 낮은 톤으로 구성합니다.</p>
  <p class="mt_10 txt_over_dot clamp2 fc_w_80">긴 문장은 clamp 조합으로 2줄 이후 말줄임 처리할 수 있습니다.</p>
</header>`}
          />
          <Card className="docs_note_card mb_20">
            <h3>Typography Scale</h3>
            <p><strong>fs 범위:</strong> {fontScale.map((value) => `fs_${value}`).join(', ')}</p>
            <p><strong>fw 범위:</strong> fw_thin, fw_exLight, fw_light, fw_regular, fw_medium, fw_semibold, fw_bold, fw_exBold, fw_heavy</p>
            <p><strong>lih 범위:</strong> {lineHeightScale.join(', ')}</p>
          </Card>
        </Section>

        <Section
          id="css-color"
          eyebrow="Property"
          title="Color"
          description="컬러 유틸리티는 토큰을 직접 소비합니다. 강조와 상태 표현에 제한적으로 사용하세요."
        >
          <GuideTable headers={['Class', 'Styles', '설명']} rows={colorRows} />
          <ExampleShowcase
            preview={(
              <div className="css_preview_box bgc_g_10 rd_base pt_20 pr_20 pb_20 pl_20">
                <p className="fc_w_90">기본 상태</p>
                <p className="mt_10 fc_p_40">강조 상태</p>
                <p className="mt_10 fc_d_40">주의 상태</p>
              </div>
            )}
            code={`<div class="bgc_g_10 rd_base pt_20 pr_20 pb_20 pl_20">
  <p class="fc_w_90">기본 상태</p>
  <p class="mt_10 fc_p_40">강조 상태</p>
  <p class="mt_10 fc_d_40">주의 상태</p>
</div>`}
          />
        </Section>

        <Section
          id="css-aspect"
          eyebrow="Property"
          title="Aspect Ratio"
          description="카드 썸네일, 미디어 슬롯 등 고정 비율 레이아웃을 만들 때 사용합니다."
        >
          <GuideTable headers={['Class', 'Styles', '설명']} rows={aspectRows} />
        </Section>

        <Section
          id="css-helper"
          eyebrow="Property"
          title="Helpers / Modal / Scroll"
          description="레이아웃 보조 및 공통 인터랙션에 쓰는 유틸리티 그룹입니다."
        >
          <GuideTable headers={['Class', 'Styles', '설명']} rows={helperRows} />
        </Section>

        <Section
          id="css-summary"
          eyebrow="Summary"
          title="문서 요약"
          description="실제 사용 시 기억해두면 좋은 핵심 포인트만 다시 정리했습니다."
        >
          <Card className="docs_note_card">
            <ul className="check_list">
              <li><code>common.css</code>는 토큰 저장소이고 <code>wv.css</code>는 유틸리티 레이어입니다.</li>
              <li>색상, 간격, 반경, 크기 값은 토큰 기준으로 연결됩니다.</li>
              <li>반응형은 <code>tb_</code>, <code>md_</code>, <code>res_*</code> 접두사로 제어합니다.</li>
              <li><code>op_*</code>, <code>pos_*</code>, <code>z_idx*</code>, <code>w_*/h_*</code> 등 누락된 유틸리티 설명을 보강했습니다.</li>
              <li>문서는 최종 사용 기준인 CSS 클래스 중심으로 확인하고 바로 적용하는 흐름에 맞춰 구성했습니다.</li>
            </ul>
          </Card>
        </Section>
      </div>
    </div>
  );
}

function ExampleShowcase({ preview, code }) {
  return (
    <div className="docs_grid_2 mt_20 mb_20">
      <Card className="docs_note_card">
        <h3>Examples</h3>
        <div className="mt_20">{preview}</div>
      </Card>
      <CodeBlock language="html" code={code} />
    </div>
  );
}
