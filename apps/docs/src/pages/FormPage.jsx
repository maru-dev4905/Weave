import { Card } from '../components/Card.jsx';
import { Section } from '../components/Section.jsx';
import { Sidebar } from '../components/Sidebar.jsx';

const sidebarItems = [
  { href: '#overview', label: '개요' },
  { href: '#contact-form', label: '문의 폼' },
  { href: '#signup-form', label: '가입 폼' },
  { href: '#submit-flow', label: '제출 흐름' },
];

export function FormPage() {
  return (
    <div className="page_shell page_shell_with_sidebar">
      <Sidebar items={sidebarItems} />

      <div className="page_content">
        <Section
          id="overview"
          eyebrow="Form"
          title="실전형 폼 제출 흐름 쇼케이스"
          description="여러 input이 있는 실제 폼에서 submit 차단, 첫 에러 포커스, summary, 성공 상태까지 한 화면에서 확인할 수 있도록 구성했습니다."
          align="wide"
        >
          <Card className="intro_banner">
            <div>
              <strong>Flow</strong>
              <span>blur, submit, summary, focus, success</span>
            </div>
            <div>
              <strong>Use Case</strong>
              <span>문의 폼, 가입 폼, 약관 그룹, 비밀번호 확인</span>
            </div>
            <div>
              <strong>Plugin</strong>
              <span>`validationPlugin()`</span>
            </div>
          </Card>
        </Section>

        <Section
          id="contact-form"
          eyebrow="Showcase"
          title="Contact Form Demo"
          description="문의용 폼에서 필수값, 이메일 형식, textarea 길이, 약관 체크를 하나의 submit 흐름으로 묶은 예시입니다."
        >
          <Card>
            <div className="demo_card_head">
              <div>
                <h3>Live Demo</h3>
                <p>submit 시 가장 먼저 막히는 필드로 이동하고, 상단 summary와 하단 필드 메시지를 함께 보여줍니다.</p>
              </div>
            </div>

            <form className="validation_demo_form mt_20" data-weave-validation data-weave-validation-demo>
              <div className="validation_form_summary" data-weave-validation-summary hidden />

              <div className="validation_field_grid">
                <div className="validation_field">
                  <label htmlFor="form-contact-name">이름</label>
                  <input id="form-contact-name" type="text" required minLength="2" data-weave-validation-label="이름" />
                  <div data-weave-validation-message data-weave-validation-for="form-contact-name" hidden />
                </div>
                <div className="validation_field">
                  <label htmlFor="form-contact-email">이메일</label>
                  <input id="form-contact-email" type="email" required data-weave-validation-label="이메일" />
                  <div data-weave-validation-message data-weave-validation-for="form-contact-email" hidden />
                </div>
              </div>

              <div className="validation_field">
                <label htmlFor="form-contact-subject">제목</label>
                <input id="form-contact-subject" type="text" required minLength="4" data-weave-validation-label="제목" />
                <div data-weave-validation-message data-weave-validation-for="form-contact-subject" hidden />
              </div>

              <div className="validation_field">
                <label htmlFor="form-contact-message">문의 내용</label>
                <textarea
                  id="form-contact-message"
                  required
                  minLength="20"
                  maxLength="200"
                  data-weave-validation-label="문의 내용"
                />
                <div data-weave-validation-message data-weave-validation-for="form-contact-message" hidden />
              </div>

              <div className="validation_group">
                <strong>문의 전 확인</strong>
                <label className="validation_check">
                  <input
                    type="checkbox"
                    name="contactTerms"
                    value="agree"
                    required
                    data-weave-validation-group="contactTerms"
                    data-weave-validation-label="문의 전 확인"
                    data-weave-validation-message="#form-contact-terms-feedback"
                  />
                  개인정보 수집 및 답변 안내에 동의합니다.
                </label>
                <div id="form-contact-terms-feedback" data-weave-validation-message hidden />
              </div>

              <div className="validation_form_actions">
                <button type="submit">문의 폼 제출 테스트</button>
              </div>
              <div className="validation_form_success" data-weave-validation-success hidden>
                문의 폼 검증을 통과했습니다. 실제 전송 대신 success 상태만 표시합니다.
              </div>
            </form>
          </Card>
        </Section>

        <Section
          id="signup-form"
          eyebrow="Showcase"
          title="Signup Form Demo"
          description="가입 플로우에서 이메일, 비밀번호 확인, 역할 선택, 약관 그룹까지 함께 검증하는 통합 예시입니다."
        >
          <Card>
            <div className="demo_card_head">
              <div>
                <h3>Live Demo</h3>
                <p>단일 필드 검증과 그룹 검증을 합쳐 실제 회원가입 폼에 가까운 구성을 보여줍니다.</p>
              </div>
            </div>

            <form className="validation_demo_form mt_20" data-weave-validation data-weave-validation-demo>
              <div className="validation_form_summary" data-weave-validation-summary hidden />

              <div className="validation_field_grid">
                <div className="validation_field">
                  <label htmlFor="form-signup-email">이메일</label>
                  <input id="form-signup-email" type="email" required data-weave-validation-label="이메일" />
                  <div data-weave-validation-message data-weave-validation-for="form-signup-email" hidden />
                </div>
                <div className="validation_field">
                  <label htmlFor="form-signup-role">역할</label>
                  <select id="form-signup-role" required data-weave-validation-label="역할" defaultValue="">
                    <option value="" disabled>역할 선택</option>
                    <option value="publisher">Publisher</option>
                    <option value="designer">Designer</option>
                    <option value="developer">Developer</option>
                  </select>
                  <div data-weave-validation-message data-weave-validation-for="form-signup-role" hidden />
                </div>
              </div>

              <div className="validation_field_grid">
                <div className="validation_field">
                  <label htmlFor="form-signup-password">비밀번호</label>
                  <input
                    id="form-signup-password"
                    type="password"
                    required
                    minLength="8"
                    data-weave-validation-label="비밀번호"
                  />
                  <div data-weave-validation-message data-weave-validation-for="form-signup-password" hidden />
                </div>
                <div className="validation_field">
                  <label htmlFor="form-signup-password-confirm">비밀번호 확인</label>
                  <input
                    id="form-signup-password-confirm"
                    type="password"
                    required
                    minLength="8"
                    data-weave-validation-match="#form-signup-password"
                    data-weave-validation-label="비밀번호 확인"
                  />
                  <div data-weave-validation-message data-weave-validation-for="form-signup-password-confirm" hidden />
                </div>
              </div>

              <div className="validation_group">
                <strong>약관 동의</strong>
                <label className="validation_check">
                  <input
                    type="checkbox"
                    name="signupTerms"
                    value="service"
                    required
                    data-weave-validation-group="signupTerms"
                    data-weave-validation-label="약관 동의"
                    data-weave-validation-message="#form-signup-terms-feedback"
                  />
                  서비스 이용약관 동의
                </label>
                <label className="validation_check">
                  <input
                    type="checkbox"
                    name="signupTerms"
                    value="privacy"
                    required
                    data-weave-validation-group="signupTerms"
                    data-weave-validation-label="약관 동의"
                    data-weave-validation-message="#form-signup-terms-feedback"
                  />
                  개인정보 수집 동의
                </label>
                <div id="form-signup-terms-feedback" data-weave-validation-message hidden />
              </div>

              <div className="validation_form_actions">
                <button type="submit">가입 폼 제출 테스트</button>
              </div>
              <div className="validation_form_success" data-weave-validation-success hidden>
                가입 폼 검증을 통과했습니다. 실제 제출 대신 success 상태만 표시합니다.
              </div>
            </form>
          </Card>
        </Section>

        <Section
          id="submit-flow"
          eyebrow="Flow"
          title="Submit Flow"
          description="실제 submit UX에서 어떤 순서로 검증이 진행되는지와 마크업 포인트를 요약합니다."
        >
          <div className="docs_grid_2">
            <Card className="docs_note_card">
              <h3>체크 포인트</h3>
              <ul className="check_list">
                <li>blur 시 개별 필드 검증을 먼저 보여주고, submit에서는 전체 폼을 다시 검사합니다.</li>
                <li>첫 에러 필드에 포커스를 이동하고, 같은 필드 위치로 스크롤해 사용자가 바로 수정할 수 있게 합니다.</li>
                <li>폼 상단 summary와 필드 하단 메시지를 동시에 유지해 데스크톱과 모바일에서 모두 읽기 쉽게 구성합니다.</li>
                <li>연락처 pattern이나 비밀번호 보기 같은 선택형 기능은 `validationPlugin()`의 `fields[id]` 설정으로 스크립트에서 주입하는 흐름을 권장합니다.</li>
                <li>성공 시 docs 데모에서는 실제 전송 대신 success 상태만 표시합니다.</li>
              </ul>
            </Card>

            <Card className="docs_note_card">
              <h3>권장 마크업</h3>
              <p>`data-weave-validation-summary`와 `data-weave-validation-success`를 폼 루트 안에 미리 두는 구조를 권장합니다.</p>
              <p>비밀번호 확인이나 약관 그룹처럼 연결된 검증은 `data-weave-validation-match`, `data-weave-validation-group` 속성으로 묶습니다.</p>
            </Card>
          </div>
        </Section>
      </div>
    </div>
  );
}
