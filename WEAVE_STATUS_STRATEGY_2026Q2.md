# WEAVE 진행 현황 및 개선 전략 (2026 Q2)

이 문서는 현재 저장소 기준으로 WEAVE의 진행 상태를 점검하고, 다음 개선 우선순위와 브랜딩 방향을 정리한 내부 전략 문서입니다.

---

## 1) 현재까지 진행상황

### 제품/구조 관점
- 모노레포 구조로 `@weave/wv`(라이브러리) + `apps/docs`(문서/데모 앱)가 분리되어 있습니다.
- CSS는 `common.css`(토큰) + `wv.css`(유틸/기본 스타일) 이원화 구조가 명확합니다.
- JS는 `createWeave()` 기반 플러그인 런타임 구조가 갖춰져 있어, 플러그인 조합형 아키텍처가 이미 작동합니다.

### 문서/데모 관점
- 문서 앱에 `Home`, `Docs(CSS/JS)`, `Anim`, `Validation`, `Form`, `Plate`, `Download`, `Tools`, `Playground`가 구현되어 있습니다.
- 데모 페이지에서 실제 플러그인 mount를 수행하고 있어, 단순 문서가 아니라 실사용 검증 환경 역할도 수행합니다.
- 현재 라우터 기준 `release` 페이지는 리다이렉트 처리되어 있어 외부 노출은 비활성 상태입니다.

### 저장소 상태 관점
- 현재 브랜치: `dev`
- 워킹트리: 깨끗한 상태(미커밋 변경 없음, 본 문서 추가 전 기준)

---

## 2) 현재까지 만들어진 플러그인

`@weave/wv` 공개 export 기준:

1. `copyPlugin`
2. `fileDropPlugin`
3. `linkButtonPlugin`
4. `targetButtonPlugin`
5. `tabsPlugin`
6. `accordionPlugin`
7. `modalPlugin`
8. `hideTodayPlugin`
9. `scrollToPlugin`
10. `validationPlugin`
11. `animPlugin`
   - `fadeAnim`
   - `parallaxAnim`
   - `cascadeAnim`
   - `marqueeAnim`
   - `tickerAnim`
   - `countAnim`

### 현재 플러그인 구성의 강점
- 퍼블리싱 실무에서 자주 반복되는 UI 동작(탭/아코디언/모달/스크롤/복사)을 빠르게 표준화할 수 있습니다.
- `validation`과 `fileDrop`처럼 옵션 기반 플러그인이 포함되어 있어 단순 토글형을 넘어 실제 업무 케이스를 커버합니다.
- `anim`이 하위 팩토리 구조로 분리되어 있어 확장성이 좋습니다.

---

## 3) WEAVE util CSS 개선점

### A. 즉시 수정 권장 (정합성/버그)
1. `h_max_content`, `md_h_max_content`가 `height`가 아니라 `width`를 설정하는 문제 수정
2. 색상 유틸의 `bgc_s_*` 네이밍/토큰 참조 정합성(`s` vs `s1/s2`) 통일

### B. 단기 개선 (품질/유지보수)
1. `_utilities/_form.scss`의 실제 사용 여부 확정 후 `index.scss` 포함 또는 제거
2. 빈 파일(`_settings/_css-vars.scss`) 정리 또는 로드맵 반영
3. 유틸의 `!important` 사용 범위를 분류(핵심/옵션)해 충돌 디버깅 비용 축소

### C. 중기 개선 (체계화)
1. 토큰 네이밍 규약 문서화(`prefix`, `scale`, alias 규칙)
2. 반응형 접두사(`tb_`, `md_`, `res_*`) 운영 가이드 강화
3. 레거시 클래스 alias 정책(Deprecated → Migration) 도입

---

## 4) 추가로 만들 수 있는 툴 제안

현재 `Tools` 페이지에는 `PX to VW`, `PX to REM`, `IMG to WEBP`가 있습니다. 다음 툴을 우선순위로 제안합니다.

### 1순위 (즉시 가치 높음)
1. **WEAVE Class/Token Inspector**
   - 목적: 클래스명과 토큰 참조 정합성 자동 점검
   - 효과: `bgc_*`, `fc_*`, 토큰 누락/오타를 사전 발견

2. **Plugin Attribute Linter**
   - 목적: `data-weave-*` 속성 계약 검사
   - 효과: 마크업 실수로 인한 런타임 오작동 감소

3. **Starter Preset Generator**
   - 목적: starter-kit의 빈 plugin 배열을 템플릿 기반으로 자동 생성
   - 효과: 초기 세팅 시간 단축, 팀 표준화

### 2순위 (생산성/확장)
4. **SCSS to Docs Sync Generator**
   - 목적: SCSS 스케일/클래스 목록을 문서 페이지와 자동 동기화
   - 효과: 문서-코드 드리프트 감소

5. **Validation Rule Builder**
   - 목적: 필드 규칙/메시지/토글 옵션을 GUI로 생성
   - 효과: 폼 설정 생산성 향상, 온보딩 비용 절감

6. **Asset Naming & Export Helper**
   - 목적: 이미지/아이콘 파일명 정규화 및 포맷 일괄 변환
   - 효과: 퍼블리싱 리소스 관리 표준화

---

## 5) WEAVE 브랜딩 시 강점 (핵심 메시지)

브랜딩에서 가장 중요한 점은 "무엇을 잘하는가"를 명확한 한 문장으로 고정하는 것입니다.

### 제안 핵심 포지셔닝
**"WEAVE는 퍼블리셔의 반복 작업을 유틸 CSS + 플러그인 + 실전 도구로 하나의 흐름에 묶는 실행형 프론트엔드 시스템"**

### WEAVE만의 차별점
1. **퍼블리싱 실무 특화**
   - 일반 UI 프레임워크가 아닌, 퍼블리싱 작업 흐름 중심으로 설계됨

2. **CSS + JS + Tools의 결합**
   - 유틸 클래스, 인터랙션 플러그인, 변환 도구가 문서 앱 안에서 하나로 연결됨

3. **데모 중심 신뢰성**
   - 문서가 단순 설명이 아니라 실제 동작 검증 공간 역할 수행

4. **낮은 진입 장벽**
   - 클래스/속성 기반 적용으로 빠른 도입 가능

5. **확장 가능한 플러그인 런타임**
   - 프로젝트별로 필요한 기능만 조합해 사용 가능

---

## 6) 추천 실행 로드맵 (4주)

### Week 1: 안정화
- util CSS 즉시 이슈(`h_max_content`, 색상 정합성) 수정
- release 페이지 노출 정책 결정(복구 or 비공개 유지)

### Week 2: 도구화
- `Plugin Attribute Linter` 최소기능(MVP) 구현
- `Starter Preset Generator` 초안 반영

### Week 3: 문서 자동화
- `SCSS to Docs Sync` 프로토타입 구축
- 문서-코드 정합성 체크 파이프라인 추가

### Week 4: 브랜딩 정리
- 슬로건/핵심 메시지 확정
- 랜딩 카피를 "실무 흐름 단축" 중심으로 개편
- 플러그인/툴 사례 3개를 대표 use case로 시각화

---

## 7) 브랜딩 문구 예시

- **한 줄 소개**
  - "WEAVE, 퍼블리셔를 위한 실행형 프론트엔드 워크플로우."

- **보조 문구**
  - "유틸 CSS, 플러그인 인터랙션, 실전 변환 도구를 한 번에."
  - "설명서가 아니라, 바로 적용하고 검증하는 퍼블리싱 시스템."

