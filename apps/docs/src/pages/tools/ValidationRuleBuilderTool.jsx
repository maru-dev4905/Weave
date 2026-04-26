import { useState } from 'react';

import { Card } from '../../components/Card.jsx';
import { CopyButton } from '../../components/CopyButton.jsx';
import { num } from './utils.js';

export function ValidationRuleBuilderTool() {
  const [fieldId, setFieldId] = useState('signupPassword');
  const [fieldType, setFieldType] = useState('text');
  const [minLength, setMinLength] = useState('8');
  const [pattern, setPattern] = useState('');
  const [errorMessage, setErrorMessage] = useState('필수 입력 항목입니다.');
  const [patternErrorMessage, setPatternErrorMessage] = useState('');
  const [result, setResult] = useState('');

  const build = () => {
    const isCheckField = fieldType === 'checkbox' || fieldType === 'radio';
    const includeMinLength = !isCheckField && num(minLength) > 0;
    const includePattern = !isCheckField && pattern.trim();

    const config = {
      [fieldId]: {
        type: fieldType,
        required: true,
        ...(includeMinLength ? { minlength: num(minLength) } : {}),
        ...(includePattern ? { pattern: pattern.trim() } : {}),
        messages: {
          required: errorMessage || '필수 입력 항목입니다.',
          ...(includeMinLength ? { minlength: errorMessage || '최소 길이 조건을 만족해야 합니다.' } : {}),
          ...(includePattern ? { pattern: patternErrorMessage || '패턴 형식이 올바르지 않습니다.' } : {}),
        },
      },
    };

    setResult(JSON.stringify(config, null, 2));
  };

  return (
    <Card>
      <div className="demo_card_head">
        <div>
          <h3>Validation Rule Builder</h3>
          <p>
            필드 타입별 검증 규칙을 입력하면 validation `fields` 설정 JSON을 생성합니다.
            <br />
            체크박스/라디오는 선택되지 않았을 때 `required` 에러를 반환하는 형태로 설정됩니다.
          </p>
        </div>
      </div>
      <div className="tools_panel_grid mt_20">
        <div className="tools_box">
          <label>Field ID</label>
          <input value={fieldId} onChange={(event) => setFieldId(event.target.value)} />
          <label>Field Type</label>
          <div className="tools_action_row">
            {['text', 'number', 'email', 'password', 'checkbox', 'radio'].map((type) => (
              <label key={type} className="tools_check">
                <input
                  type="radio"
                  name="validation-field-type"
                  checked={fieldType === type}
                  onChange={() => setFieldType(type)}
                />
                {type}
              </label>
            ))}
          </div>
          {fieldType === 'text' ? (
            <>
              <label>minlength</label>
              <input value={minLength} onChange={(event) => setMinLength(event.target.value)} />
              <label>pattern (optional)</label>
              <input value={pattern} onChange={(event) => setPattern(event.target.value)} />
            </>
          ) : null}
          <label>error message</label>
          <input value={errorMessage} onChange={(event) => setErrorMessage(event.target.value)} />
          <label>pattern error message (optional)</label>
          <input value={patternErrorMessage} onChange={(event) => setPatternErrorMessage(event.target.value)} />
          <button type="button" onClick={build}>생성</button>
          <textarea className="tools_tall_textarea" value={result} readOnly />
          <div className="tools_action_row">
            <CopyButton label="코드 복사" text={result} message="Validation 설정 코드를 복사했습니다." />
          </div>
        </div>
      </div>
    </Card>
  );
}
