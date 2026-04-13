import { Card } from '../components/Card.jsx';
import { GuideTable } from '../components/GuideTable.jsx';
import { Section } from '../components/Section.jsx';
import { Sidebar } from '../components/Sidebar.jsx';

const sidebarItems = [
  { href: '#css-structure', label: '전체 구조' },
  { href: '#css-relationship', label: 'common.css와 wv.css' },
  { href: '#css-build', label: '빌드 포함 모듈' },
  { href: '#css-tokens', label: '토큰 체계' },
  { href: '#css-responsive', label: '반응형 체계' },
  { href: '#css-layout', label: 'Layout / Object' },
  { href: '#css-utilities', label: 'Display / Flex / Gap' },
  { href: '#css-types', label: 'Grid / Spacing / Typography' },
  { href: '#css-helper', label: 'Color / Helpers / Motion' },
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

const buildRows = [
  ['Layout', '_objects/_layout.scss', '포함', '.inner, .gutter_*'],
  ['Display', '_utilities/_display.scss', '포함', '.dp_*'],
  ['Flex', '_utilities/_flex.scss', '포함', '.fd_*, .al_*, .jtf_*'],
  ['Gap', '_utilities/_gap.scss', '포함', '.gap*'],
  ['Grid', '_utilities/_grid.scss', '포함', '.grid_lay, .colST*'],
  ['Spacing', '_utilities/_spacing.scss', '포함', '.mt_*, .pt_*'],
  ['Typography', '_utilities/_typography.scss', '포함', '.fs_*, .fw_*, .ta_*'],
  ['Color', '_utilities/_color.scss', '포함', '.fc_*, .bgc_*'],
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

const utilityRows = [
  ['Display', '.dp_b, .dp_f, .dp_g', 'display block / flex / grid'],
  ['Flex', '.fd_col, .fd_row, .al_center, .jtf_bet', '방향과 정렬 제어'],
  ['Gap', '.gap4 ~ .gap300', 'interval scale 기반 gap'],
  ['Visibility', '.m_show, .m_hide, .res_*', '브레이크포인트별 표시 제어'],
];

const typeRows = [
  ['Grid', '.grid_lay, .colST1, .colED12', '12열 기반 배치'],
  ['Spacing', '.mt_20, .pb_40, .md_pt_10', '마진, 패딩, 반응형 간격'],
  ['Typography', '.fs_16, .fw_bold, .ta_center', '크기, 굵기, 정렬'],
  ['Radius', '.rd_base, .rd_full', '반경 토큰과 pill 형태'],
];

const helperRows = [
  ['Color', '.fc_g_*, .fc_p_*, .bgc_p_*', '텍스트/배경 색상 클래스'],
  ['Helpers', '.dot, .indent', '목록형 텍스트 보조 클래스'],
  ['Modal', '.wv_modal, .wv_modal.active', '기본 숨김 / 활성 시 표시'],
  ['Scroll', '.scrollbar_custom, .scrollLock', '스크롤바와 스크롤 잠금'],
  ['Motion', '.anim.fade, .hov_op', '기본 애니메이션 클래스'],
];

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
          id="css-build"
          eyebrow="Build"
          title="빌드에 포함되는 SCSS 모듈"
          description="현재 산출물 기준으로 실제 빌드에 포함되는 핵심 SCSS 모듈만 우선 정리했습니다."
        >
          <GuideTable headers={['분류', '소스 파일', '포함 여부', '비고']} rows={buildRows} />
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
          id="css-utilities"
          eyebrow="Utilities"
          title="Display / Flex / Gap"
          description="가장 자주 조합하는 배치용 유틸리티를 기준으로 빠르게 확인할 수 있도록 정리했습니다."
        >
          <GuideTable headers={['분류', '예시', '설명']} rows={utilityRows} />
        </Section>

        <Section
          id="css-types"
          eyebrow="Types"
          title="Grid / Spacing / Typography"
          description="실제 화면 조립에서 자주 쓰는 레이아웃, 간격, 타이포그래피 계열 클래스입니다."
        >
          <GuideTable headers={['분류', '예시', '설명']} rows={typeRows} />
        </Section>

        <Section
          id="css-helper"
          eyebrow="Helper"
          title="Color / Helpers / Motion"
          description="색상, 도우미 클래스, 모달/스크롤/모션 계열 클래스를 함께 묶어 정리했습니다."
        >
          <GuideTable headers={['분류', '패턴', '설명']} rows={helperRows} />
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
              <li>반응형은 <code>tb_</code>, <code>md_</code>, <code>res_*</code> 규칙으로 제어합니다.</li>
              <li>실제 수정이 커질 때는 SCSS 원본과 산출물을 함께 확인하는 편이 안전합니다.</li>
            </ul>
          </Card>
        </Section>
      </div>
    </div>
  );
}
