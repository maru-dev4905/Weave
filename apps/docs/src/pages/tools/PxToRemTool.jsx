import { useState } from 'react';

import { Card } from '../../components/Card.jsx';
import { CopyButton } from '../../components/CopyButton.jsx';
import { formatNumber, num } from './utils.js';

export function PxToRemTool() {
  const [px, setPx] = useState('16');
  const [rem, setRem] = useState('1');
  const [baseFont, setBaseFont] = useState('16');
  const [resultValue, setResultValue] = useState('1');
  const [resultUnit, setResultUnit] = useState('REM');

  const handlePxChange = (value) => {
    const nextRem = formatNumber(num(value) / num(baseFont, 16));
    setPx(value);
    setRem(nextRem);
    setResultValue(nextRem || '0');
    setResultUnit('REM');
  };

  const handleRemChange = (value) => {
    const nextPx = formatNumber(num(value) * num(baseFont, 16));
    setRem(value);
    setPx(nextPx);
    setResultValue(nextPx || '0');
    setResultUnit('PX');
  };

  const handleBaseChange = (value) => {
    setBaseFont(value);
    if (px) {
      const nextRem = formatNumber(num(px) / num(value, 16));
      setRem(nextRem);
      setResultValue(nextRem || '0');
      setResultUnit('REM');
    }
  };

  return (
    <Card>
      <div className="demo_card_head">
        <div>
          <h3>PX to REM</h3>
          <p>기준 폰트 크기를 바꾸면 px와 rem 계산값도 같이 갱신됩니다.</p>
        </div>
      </div>

      <div className="tools_rem_layout mt_20">
        <div className="tools_box tools_rem_box">
          <label>Base Font Size</label>
          <input value={baseFont} onChange={(event) => handleBaseChange(event.target.value)} />

          <div className="tools_rem_inputs">
            <div className="tools_rem_field">
              <label>PX</label>
              <input value={px} onChange={(event) => handlePxChange(event.target.value)} />
            </div>
            <span className="tools_rem_to">to</span>
            <div className="tools_rem_field">
              <label>REM</label>
              <input value={rem} onChange={(event) => handleRemChange(event.target.value)} />
            </div>
          </div>

          <div className="tools_rem_result">
            <span className="tools_rem_result_label">RESULT</span>
            <strong>{resultValue}</strong>
            <p>{resultUnit}</p>
          </div>

          <div className="tools_action_row tools_action_row_center">
            <CopyButton
              label="결과 복사"
              text={`${resultValue}${resultUnit.toLowerCase()}`}
              message="PX to REM 결과를 복사했습니다."
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
