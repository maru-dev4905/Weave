import { Card } from '../components/Card.jsx';
import { CodeBlock } from '../components/CodeBlock.jsx';
import { GuideTable } from '../components/GuideTable.jsx';
import { Section } from '../components/Section.jsx';
import { Sidebar } from '../components/Sidebar.jsx';

const sidebarItems = [
  { href: '#overview', label: '개요' },
  { href: '#basic-rules', label: 'Basic Rules' },
  { href: '#field-types', label: 'Field Types' },
  { href: '#group-validation', label: 'Group Validation' },
  { href: '#api-reference', label: 'API Reference' },
];

const moduleCards = [
  {
    title: 'Root',
    selector: '[data-weave-validation]',
    summary: '폼 루트에 validation 흐름을 연결하고 blur/submit 검증을 시작합니다.',
  },
  {
    title: 'Message',
    selector: '[data-weave-validation-message]',
    summary: '필드별 메시지 출력 위치를 연결해 에러 피드백을 안정적으로 제어합니다.',
  },
  {
    title: 'Summary',
    selector: '[data-weave-validation-summary]',
    summary: 'submit 시 첫 번째 에러 요약을 폼 상단에 보여줍니다.',
  },
  {
    title: 'Match / Group',
    selector: 'data-weave-validation-match / data-weave-validation-group',
    summary: '비밀번호 확인 일치나 체크박스 그룹 필수 선택 같은 연결 검증을 처리합니다.',
  },
];

const basicGuideRows = [
  ['root', '[data-weave-validation]', 'validation 루트 폼 셀렉터입니다.'],
  ['required', 'HTML attribute', '필수 입력 여부를 검사합니다.'],
  ['minlength / maxlength', 'HTML attribute', '텍스트 길이 제한을 검사합니다.'],
  ['message target', '[data-weave-validation-message]', '필드별 메시지 출력 타겟입니다.'],
  ['summary', '[data-weave-validation-summary]', 'submit 시 첫 에러 메시지를 상단에 요약합니다.'],
];

const fieldGuideRows = [
  ['email', 'type="email"', '기본 이메일 형식 검사를 수행합니다.'],
  ['fields[id].pattern', 'string(regex)', '스크립트 객체에서 id 기준 패턴을 주입해 검사합니다.'],
  ['fields[id].messages', 'object', '필드별 에러 문구를 스크립트에서 오버라이드합니다.'],
  ['number', 'min / max', '숫자형 입력값의 최소/최대 범위를 검사합니다.'],
  ['textarea', 'maxlength', '긴 텍스트 입력의 최대 길이를 검사합니다.'],
];

const groupGuideRows = [
  ['match', 'data-weave-validation-match="#selector"', '다른 필드 값과 일치 여부를 검사합니다.'],
  ['group', 'data-weave-validation-group="name"', '체크박스 그룹을 하나의 검증 단위로 묶습니다.'],
  ['label', 'data-weave-validation-label', '메시지 문구에 사용할 필드/그룹 이름을 지정합니다.'],
  ['togglePassword', 'fields[id].togglePassword', '비밀번호 보기/숨기기 토글을 스크립트 옵션으로 추가합니다.'],
];

const apiGuideRows = [
  ['plugin', 'validationPlugin()', 'validation 플러그인을 생성합니다.'],
  ['fields', '{ [id]: { pattern, messages, togglePassword } }', '입력 id 기준으로 패턴, 문구, 선택형 기능을 주입합니다.'],
  ['focusFirstError', 'true | false', 'submit 실패 시 첫 에러 필드에 포커스를 이동합니다.'],
  ['scrollToError', 'true | false', 'submit 실패 시 첫 에러 필드 위치로 스크롤합니다.'],
  ['errorClass', 'string', '에러 상태에 추가할 클래스명입니다.'],
  ['successClass', 'string', '성공 상태에 추가할 클래스명입니다.'],
];

const basicCheckpoints = [
  '1차 범위에서는 blur와 submit 기준으로만 검사해 흐름을 단순하게 유지합니다.',
  '필수, 길이, 이메일 같은 기본 규칙은 네이티브 HTML 속성을 그대로 재사용합니다.',
  '메시지 위치는 별도 타겟으로 분리해 퍼블리셔가 마크업을 제어하기 쉽게 구성합니다.',
];

const fieldCheckpoints = [
  '이메일은 기본 형식 검사만 먼저 제공하고, 전화번호 같은 형식 검사는 `fields[id].pattern`으로 스크립트에서 주입하는 방식을 권장합니다.',
  '필드별 에러 문구도 `fields[id].messages`로 오버라이드할 수 있어 서비스 말투에 맞춘 제어가 가능합니다.',
  'number는 min/max만 다루고, 복잡한 숫자 포맷 검증은 1차 범위에서 제외합니다.',
  '필드가 비어 있고 required가 아니면 대부분의 검사는 통과 처리합니다.',
];

const groupCheckpoints = [
  '비밀번호 확인은 match selector로 연결해 비교하고, 체크박스 그룹은 group key로 묶어서 검사합니다.',
  '비밀번호 보기 토글은 마크업이 아니라 `fields[id].togglePassword` 옵션으로 선택적으로 붙일 수 있습니다.',
  '그룹 검증도 개별 메시지 타겟과 동일한 패턴으로 피드백을 출력할 수 있게 맞춥니다.',
  'submit 시 전체 검증을 다시 돌려 첫 에러 필드 포커스와 요약 메시지를 함께 갱신합니다.',
];

const apiCheckpoints = [
  '객체 인수는 `focusFirstError`, `scrollToError`, 상태 클래스와 `fields[id]` 설정 정도로 최소화했습니다.',
  '실제 기본 규칙은 HTML 속성 중심으로 두고, 민감한 형식 검증이나 문구 제어는 스크립트 오버라이드에 맡기는 방향입니다.',
];

export function ValidationPage() {
  return (
    <div className="page_shell page_shell_with_sidebar">
      <Sidebar title="On this page" items={sidebarItems} />

      <div className="page_content">
        <Section
          id="overview"
          eyebrow="Validation"
          title="폼 유효성 검증 모듈 설명서"
          description="기본 필드 규칙, 그룹 검증, 메시지 타겟, submit 흐름을 퍼블리셔 기준으로 바로 쓸 수 있게 정리했습니다."
          align="wide"
        >
          <Card className="intro_banner">
            <div>
              <strong>Root</strong>
              <span>`data-weave-validation`</span>
            </div>
            <div>
              <strong>Trigger</strong>
              <span>blur + submit</span>
            </div>
            <div>
              <strong>Range</strong>
              <span>Required, Length, Email, Pattern, Match, Group</span>
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
          id="basic-rules"
          eyebrow="Rules"
          title="Basic Rules"
          description="required, 길이 제한, 이메일 같은 가장 기본적인 필드 검증을 한 번에 확인할 수 있습니다."
        >
          <Card>
            <div className="demo_card_head">
              <div>
                <h3>Live Demo</h3>
                <p>blur로 개별 검사하고, submit에서는 전체를 다시 검사해 요약 메시지와 첫 에러 포커스를 함께 처리합니다.</p>
              </div>
            </div>

            <form className="validation_demo_form mt_20" data-weave-validation data-weave-validation-demo>
              <div className="validation_form_summary" data-weave-validation-summary hidden />
              <div className="validation_field">
                <label htmlFor="validation-name">이름</label>
                <input id="validation-name" type="text" required minLength="2" data-weave-validation-label="이름" />
                <div data-weave-validation-message data-weave-validation-for="validation-name" hidden />
              </div>
              <div className="validation_field">
                <label htmlFor="validation-email">이메일</label>
                <input id="validation-email" type="email" required data-weave-validation-label="이메일" />
                <div data-weave-validation-message data-weave-validation-for="validation-email" hidden />
              </div>
              <div className="validation_field">
                <label htmlFor="validation-copy">소개</label>
                <textarea
                  id="validation-copy"
                  required
                  minLength="10"
                  maxLength="40"
                  data-weave-validation-label="소개"
                />
                <div data-weave-validation-message data-weave-validation-for="validation-copy" hidden />
              </div>
              <div className="validation_form_actions">
                <button type="submit">기본 검증 실행</button>
              </div>
              <div className="validation_form_success" data-weave-validation-success hidden>
                기본 검증을 통과했습니다.
              </div>
            </form>

            <ModuleReference
              htmlCode={`<form data-weave-validation>
  <input
    id="name"
    type="text"
    required
    minlength="2"
    data-weave-validation-label="이름"
  />
  <div data-weave-validation-message data-weave-validation-for="name" hidden></div>

  <input
    id="email"
    type="email"
    required
    data-weave-validation-label="이메일"
  />
  <div data-weave-validation-message data-weave-validation-for="email" hidden></div>

  <div data-weave-validation-summary hidden></div>
</form>`}
              jsCode={`import { createWeave, validationPlugin } from '@weave/wv/dist/js/core.js';

const app = createWeave({
  plugins: [validationPlugin()],
});

app.mount();`}
              checkpoints={basicCheckpoints}
              rows={basicGuideRows}
            />
          </Card>
        </Section>

        <Section
          id="field-types"
          eyebrow="Fields"
          title="Field Types"
          description="이메일, 패턴, 숫자, textarea처럼 실제 입력 유형별 검증 포인트를 나눠서 확인합니다."
        >
          <Card>
            <div className="demo_card_head">
              <div>
                <h3>Live Demo</h3>
                <p>field type별로 어떤 HTML 속성을 쓰면 되는지와 메시지 위치를 함께 확인할 수 있습니다.</p>
              </div>
            </div>

            <form className="validation_demo_form mt_20" data-weave-validation data-weave-validation-demo>
              <div className="validation_field_grid">
                <div className="validation_field">
                  <label htmlFor="validation-phone">연락처</label>
                  <input
                    id="validation-phone"
                    type="text"
                    required
                    data-weave-validation-label="연락처"
                  />
                  <div data-weave-validation-message data-weave-validation-for="validation-phone" hidden />
                </div>
                <div className="validation_field">
                  <label htmlFor="validation-number">인원 수</label>
                  <input
                    id="validation-number"
                    type="number"
                    min="1"
                    max="10"
                    required
                    data-weave-validation-label="인원 수"
                  />
                  <div data-weave-validation-message data-weave-validation-for="validation-number" hidden />
                </div>
              </div>
              <div className="validation_form_actions">
                <button type="submit">필드 타입 검증 실행</button>
              </div>
              <div className="validation_form_success" data-weave-validation-success hidden>
                필드 타입 검증을 통과했습니다.
              </div>
            </form>

            <ModuleReference
              htmlCode={`<input
  id="phone"
  type="text"
  required
  data-weave-validation-label="연락처"
/>
<div data-weave-validation-message data-weave-validation-for="phone" hidden></div>

<input
  id="people"
  type="number"
  min="1"
  max="10"
  required
  data-weave-validation-label="인원 수"
/>
<div data-weave-validation-message data-weave-validation-for="people" hidden></div>`}
              jsCode={`import { createWeave, validationPlugin } from '@weave/wv/dist/js/core.js';

const app = createWeave({
  plugins: [
    validationPlugin({
      fields: {
        phone: {
          pattern: '^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$',
          messages: {
            pattern: '연락처는 010-1234-5678 형식으로 입력해주세요.',
          },
        },
      },
    }),
  ],
});

app.mount();`}
              checkpoints={fieldCheckpoints}
              rows={fieldGuideRows}
            />
          </Card>
        </Section>

        <Section
          id="group-validation"
          eyebrow="Groups"
          title="Group Validation"
          description="비밀번호 확인과 체크박스 그룹처럼 둘 이상의 입력이 연결되는 검증을 다룹니다."
        >
          <Card>
            <div className="demo_card_head">
              <div>
                <h3>Live Demo</h3>
                <p>match selector와 group key를 이용해 실전에서 자주 쓰는 연결 검증을 간단하게 붙이는 방식입니다.</p>
              </div>
            </div>

            <form className="validation_demo_form mt_20" data-weave-validation data-weave-validation-demo>
              <div className="validation_field_grid">
                <div className="validation_field">
                  <label htmlFor="validation-password">비밀번호</label>
                  <input
                    id="validation-password"
                    type="password"
                    required
                    minLength="8"
                    data-weave-validation-label="비밀번호"
                  />
                  <div data-weave-validation-message data-weave-validation-for="validation-password" hidden />
                </div>
                <div className="validation_field">
                  <label htmlFor="validation-password-confirm">비밀번호 확인</label>
                  <input
                    id="validation-password-confirm"
                    type="password"
                    required
                    minLength="8"
                    data-weave-validation-match="#validation-password"
                    data-weave-validation-label="비밀번호 확인"
                  />
                  <div data-weave-validation-message data-weave-validation-for="validation-password-confirm" hidden />
                </div>
              </div>

              <div className="validation_group">
                <strong>약관 동의</strong>
                <label className="validation_check">
                  <input
                    type="checkbox"
                    name="termsBasic"
                    value="service"
                    required
                    data-weave-validation-group="termsBasic"
                    data-weave-validation-label="약관 동의"
                    data-weave-validation-message="#validation-terms-feedback"
                  />
                  서비스 이용약관 동의
                </label>
                <label className="validation_check">
                  <input
                    type="checkbox"
                    name="termsBasic"
                    value="privacy"
                    required
                    data-weave-validation-group="termsBasic"
                    data-weave-validation-label="약관 동의"
                    data-weave-validation-message="#validation-terms-feedback"
                  />
                  개인정보 수집 동의
                </label>
                <div id="validation-terms-feedback" data-weave-validation-message hidden />
              </div>

              <div className="validation_form_actions">
                <button type="submit">그룹 검증 실행</button>
              </div>
              <div className="validation_form_success" data-weave-validation-success hidden>
                그룹 검증을 통과했습니다.
              </div>
            </form>

            <ModuleReference
              htmlCode={`<input
  id="password"
  type="password"
  required
  minlength="8"
  data-weave-validation-label="비밀번호"
/>

<input
  id="passwordConfirm"
  type="password"
  required
  minlength="8"
  data-weave-validation-match="#password"
  data-weave-validation-label="비밀번호 확인"
/>

<label class="validation_check">
  <input
    type="checkbox"
    name="terms"
    data-weave-validation-group="terms"
    data-weave-validation-message="#terms-feedback"
  />
  약관 동의
</label>
<div id="terms-feedback" data-weave-validation-message hidden></div>`}
              jsCode={`import { createWeave, validationPlugin } from '@weave/wv/dist/js/core.js';

const app = createWeave({
  plugins: [
    validationPlugin({
      fields: {
        password: {
          togglePassword: true,
        },
        passwordConfirm: {
          togglePassword: true,
          messages: {
            match: '비밀번호 확인 값이 일치하지 않습니다.',
          },
        },
      },
    }),
  ],
});

app.mount();`}
              checkpoints={groupCheckpoints}
              rows={groupGuideRows}
            />
          </Card>
        </Section>

        <Section
          id="api-reference"
          eyebrow="API"
          title="API Reference"
          description="validation 플러그인 객체 인수와 마크업 규칙을 최소 단위로 정리했습니다."
        >
          <Card>
            <ModuleReference
              htmlCode={`<form data-weave-validation>
  <div data-weave-validation-summary hidden></div>
  <div data-weave-validation-success hidden></div>
</form>`}
              jsCode={`const app = createWeave({
  plugins: [
    validationPlugin({
      focusFirstError: true,
      scrollToError: true,
      errorClass: 'is-invalid',
      successClass: 'is-valid',
      fields: {
        phone: {
          pattern: '^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$',
          messages: {
            pattern: '연락처 형식을 확인해주세요.',
          },
        },
        password: {
          togglePassword: true,
        },
      },
    }),
  ],
});`}
              checkpoints={apiCheckpoints}
              rows={apiGuideRows}
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
