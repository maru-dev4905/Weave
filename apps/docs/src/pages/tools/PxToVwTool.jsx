import { useState } from 'react';

import { Card } from '../../components/Card.jsx';
import { CopyButton } from '../../components/CopyButton.jsx';
import { num, toFixedSafe } from './utils.js';

const removeCssProps = [
  'overflow',
  'display',
  'float',
  'text-align',
  'background-color',
  'background-size',
  'background-repeat',
  'background-position',
  'color',
  'font-weight',
  'z-index',
  'border-collapse',
  'table-layout',
  'vertical-align',
  'position',
  'box-sizing',
  'font-family',
  'content',
];

export function PxToVwTool() {
  const [px, setPx] = useState('300');
  const [vw, setVw] = useState('');
  const [vwInput, setVwInput] = useState('10');
  const [pxOutput, setPxOutput] = useState('');
  const [base1, setBase1] = useState('1920');
  const [base2, setBase2] = useState('1920');
  const [decimals, setDecimals] = useState('2');
  const [cssBase1, setCssBase1] = useState('1920');
  const [cssBase2, setCssBase2] = useState('1920');
  const [cssDecimals, setCssDecimals] = useState('2');
  const [cssSrcPx, setCssSrcPx] = useState('');
  const [cssOutPx, setCssOutPx] = useState('');
  const [cssSrcVw, setCssSrcVw] = useState('');
  const [cssOutVw, setCssOutVw] = useState('');
  const [stripPx, setStripPx] = useState(false);
  const [stripVw, setStripVw] = useState(false);

  const convertPxToVw = () => {
    const result = toFixedSafe(num(px) / (num(base1) / 100), num(decimals, 2));
    setVw(result);
  };

  const convertVwToPx = () => {
    const result = Math.round(num(vwInput) * (num(base2) / 100));
    setPxOutput(String(result));
  };

  const convertCssPxToVw = () => {
    let out = cssSrcPx.replace(/(\d*\.?\d+)\s*px/gi, (_, value) => `${toFixedSafe(num(value) / (num(cssBase1) / 100), num(cssDecimals, 2))}vw`);
    if (stripPx) out = stripProperties(out);
    setCssOutPx(out);
  };

  const convertCssVwToPx = () => {
    let out = cssSrcVw.replace(/(\d*\.?\d+)\s*vw/gi, (_, value) => `${Math.round(num(value) * (num(cssBase2) / 100))}px`);
    if (stripVw) out = stripProperties(out);
    setCssOutVw(out);
  };

  return (
    <div className="tools_stack">
      <Card>
        <div className="demo_card_head">
          <div>
            <h3>숫자 변환</h3>
            <p>단일 값 기준으로 px와 vw를 상호 변환합니다.</p>
          </div>
        </div>
        <div className="tools_panel_grid mt_20">
          <div className="tools_box">
            <h4>PX to VW</h4>
            <label>PX</label>
            <input value={px} onChange={(event) => setPx(event.target.value)} />
            <label>기준 너비</label>
            <input value={base1} onChange={(event) => setBase1(event.target.value)} />
            <label>소수점 자리</label>
            <input value={decimals} onChange={(event) => setDecimals(event.target.value)} />
            <button type="button" onClick={convertPxToVw}>변환</button>
            <textarea value={vw} readOnly />
            <div className="tools_action_row">
              <CopyButton label="결과 복사" text={vw} message="PX to VW 결과를 복사했습니다." />
            </div>
          </div>
          <div className="tools_box">
            <h4>VW to PX</h4>
            <label>VW</label>
            <input value={vwInput} onChange={(event) => setVwInput(event.target.value)} />
            <label>기준 너비</label>
            <input value={base2} onChange={(event) => setBase2(event.target.value)} />
            <button type="button" onClick={convertVwToPx}>변환</button>
            <textarea value={pxOutput} readOnly />
            <div className="tools_action_row">
              <CopyButton label="결과 복사" text={pxOutput} message="VW to PX 결과를 복사했습니다." />
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <div className="demo_card_head">
          <div>
            <h3>CSS 변환</h3>
            <p>CSS 문자열 안 px 또는 vw 단위를 한 번에 치환합니다.</p>
          </div>
        </div>
        <div className="tools_panel_grid mt_20">
          <div className="tools_box">
            <h4>CSS PX to VW</h4>
            <label>원본 CSS</label>
            <textarea value={cssSrcPx} onChange={(event) => setCssSrcPx(event.target.value)} />
            <label>기준 너비</label>
            <input value={cssBase1} onChange={(event) => setCssBase1(event.target.value)} />
            <label>소수점 자리</label>
            <input value={cssDecimals} onChange={(event) => setCssDecimals(event.target.value)} />
            <label className="tools_check">
              <input type="checkbox" checked={stripPx} onChange={(event) => setStripPx(event.target.checked)} />
              속성 제거 목록 적용
            </label>
            <button type="button" onClick={convertCssPxToVw}>변환</button>
            <textarea value={cssOutPx} readOnly />
            <div className="tools_action_row">
              <CopyButton label="결과 복사" text={cssOutPx} message="CSS PX to VW 결과를 복사했습니다." />
            </div>
          </div>
          <div className="tools_box">
            <h4>CSS VW to PX</h4>
            <label>원본 CSS</label>
            <textarea value={cssSrcVw} onChange={(event) => setCssSrcVw(event.target.value)} />
            <label>기준 너비</label>
            <input value={cssBase2} onChange={(event) => setCssBase2(event.target.value)} />
            <label className="tools_check">
              <input type="checkbox" checked={stripVw} onChange={(event) => setStripVw(event.target.checked)} />
              속성 제거 목록 적용
            </label>
            <button type="button" onClick={convertCssVwToPx}>변환</button>
            <textarea value={cssOutVw} readOnly />
            <div className="tools_action_row">
              <CopyButton label="결과 복사" text={cssOutVw} message="CSS VW to PX 결과를 복사했습니다." />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function stripProperties(cssText) {
  const tail = '\\s*:\\s*[^;]*?(?:\\s*!important)?\\s*;';
  let out = cssText;
  removeCssProps.forEach((prop) => {
    const regex = new RegExp(prop + tail, 'gi');
    out = out.replace(regex, '');
  });
  return out;
}
