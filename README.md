# WEAVE

WEAVE is a publishing-focused frontend utility framework built around a CSS utility system, a plugin-based JavaScript runtime, and a documentation app with downloadable starter assets.

## KOR

### 소개

WEAVE는 퍼블리셔와 프론트엔드 작업 흐름에 맞춘 UI 프레임워크입니다.

핵심 구성은 다음과 같습니다.

- CSS Utility System
- JavaScript Plugin Runtime
- Docs App
- Downloadable Starter Kit

### 주요 특징

- `wv.css` 기반 공통 유틸리티 클래스 제공
- `createWeave()` 기반 플러그인 런타임
- `data-weave-*` / `.weave_*` 셀렉터 규칙 동시 지원
- 문서 앱에서 실시간 데모와 코드 예시 제공
- 스타터 킷 ZIP 다운로드 지원

### 현재 제공 기능

#### CSS

- `wv.css`
- `common.css`
- `admin.css`
- `gov.css`

#### JavaScript Runtime

- `createWeave()`
- registry / events / observer 기반 lifecycle 관리
- `setup -> scan -> mount -> unmount -> teardown` 플로우

#### 구현된 플러그인

- `copyPlugin`
- `fileDropPlugin`
- `linkButtonPlugin`
- `targetButtonPlugin`
- `tabsPlugin`
- `accordionPlugin`
- `modalPlugin`
- `hideTodayPlugin`
- `scrollToPlugin`
- `animPlugin`
  - `fadeAnim()`
  - `parallaxAnim()`
  - `cascadeAnim()`
  - `marqueeAnim()`
  - `tickerAnim()`
  - `countAnim()`
- `validationPlugin`

### Validation 기능 범위

현재 `validationPlugin()`은 다음 기능을 지원합니다.

- `required`
- `minlength`
- `maxlength`
- `pattern`
- `type="email"`
- `min` / `max`
- 비밀번호 확인 일치 검사
- 체크박스 그룹 검증
- blur / submit 기반 검증
- 첫 에러 포커스 및 스크롤
- 필드별 메시지 타겟 출력
- 폼 상단 summary 출력
- 스크립트 기반 `fields[id]` 설정
  - `pattern`
  - `messages`
  - `togglePassword`

예시:

```js
import { createWeave, validationPlugin } from '@weave/wv/dist/js/core.js';

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
        password: {
          togglePassword: true,
        },
      },
    }),
  ],
});

app.mount();
```

### Docs 페이지

현재 docs 앱은 다음 페이지를 제공합니다.

- `Home`
- `Docs(CSS)`
- `Docs(JS)`
- `Anim`
- `Validation`
- `Form`
- `Plate`
- `Download`

### 프로젝트 구조

```text
WEAVE
├─ packages
│  └─ wv
│     ├─ src
│     │  ├─ js
│     │  │  ├─ core
│     │  │  └─ plugins
│     │  └─ scss
│     └─ dist
└─ apps
   └─ docs
      └─ src
```

주요 경로:

- `packages/wv/src/js/core`
- `packages/wv/src/js/plugins`
- `packages/wv/src/scss`
- `apps/docs/src`

### 빌드

```bash
pnpm --dir packages/wv build
pnpm --dir apps/docs build
```

### 스타터 킷

docs의 `Download` 페이지에서는 퍼블리싱 시작용 ZIP 파일을 제공합니다.

기본 구성 예:

```text
public/
├─ js/
│  ├─ core.js
│  └─ prj.js
├─ css/
│  ├─ wv.css
│  ├─ common.css
│  ├─ admin.css
│  ├─ gov.css
│  └─ prj.css
├─ plugins/
├─ images/
│  ├─ common/
│  ├─ samples/
│  ├─ icons/
│  └─ visuals/
└─ index.html
```

## ENG

### Overview

WEAVE is a frontend framework designed for publishing-oriented workflows.

It is organized around four main parts:

- CSS Utility System
- JavaScript Plugin Runtime
- Docs App
- Downloadable Starter Kit

### Highlights

- Shared utility classes built on top of `wv.css`
- Plugin-based runtime driven by `createWeave()`
- Dual selector support for `data-weave-*` and `.weave_*`
- Live demos and code references inside the docs app
- Starter kit ZIP download for publishing projects

### Current Features

#### CSS Outputs

- `wv.css`
- `common.css`
- `admin.css`
- `gov.css`

#### JavaScript Runtime

- `createWeave()`
- lifecycle management with registry / events / observer
- `setup -> scan -> mount -> unmount -> teardown`

#### Implemented Plugins

- `copyPlugin`
- `fileDropPlugin`
- `linkButtonPlugin`
- `targetButtonPlugin`
- `tabsPlugin`
- `accordionPlugin`
- `modalPlugin`
- `hideTodayPlugin`
- `scrollToPlugin`
- `animPlugin`
  - `fadeAnim()`
  - `parallaxAnim()`
  - `cascadeAnim()`
  - `marqueeAnim()`
  - `tickerAnim()`
  - `countAnim()`
- `validationPlugin`

### Validation Scope

`validationPlugin()` currently supports:

- `required`
- `minlength`
- `maxlength`
- `pattern`
- `type="email"`
- `min` / `max`
- password confirmation matching
- checkbox group validation
- blur / submit validation flow
- first invalid field focus and scroll
- field-level message targets
- form-level summary feedback
- script-driven `fields[id]` configuration
  - `pattern`
  - `messages`
  - `togglePassword`

Example:

```js
import { createWeave, validationPlugin } from '@weave/wv/dist/js/core.js';

const app = createWeave({
  plugins: [
    validationPlugin({
      fields: {
        phone: {
          pattern: '^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$',
          messages: {
            pattern: 'Use 010-1234-5678 format for phone numbers.',
          },
        },
        password: {
          togglePassword: true,
        },
      },
    }),
  ],
});

app.mount();
```

### Docs Pages

The docs app currently includes:

- `Home`
- `Docs(CSS)`
- `Docs(JS)`
- `Anim`
- `Validation`
- `Form`
- `Plate`
- `Download`

### Project Structure

```text
WEAVE
├─ packages
│  └─ wv
│     ├─ src
│     │  ├─ js
│     │  │  ├─ core
│     │  │  └─ plugins
│     │  └─ scss
│     └─ dist
└─ apps
   └─ docs
      └─ src
```

Key paths:

- `packages/wv/src/js/core`
- `packages/wv/src/js/plugins`
- `packages/wv/src/scss`
- `apps/docs/src`

### Build

```bash
pnpm --dir packages/wv build
pnpm --dir apps/docs build
```

### Starter Kit

The `Download` page in the docs app provides a starter ZIP for publishing projects.

Typical structure:

```text
public/
├─ js/
│  ├─ core.js
│  └─ prj.js
├─ css/
│  ├─ wv.css
│  ├─ common.css
│  ├─ admin.css
│  ├─ gov.css
│  └─ prj.css
├─ plugins/
├─ images/
│  ├─ common/
│  ├─ samples/
│  ├─ icons/
│  └─ visuals/
└─ index.html
```

Your tasks:

review current WEAVE core architecture

fix lifecycle edge cases

help implement new plugins

maintain clean plugin architecture

avoid memory leaks

maintain performance

When writing plugins follow this structure:

plugin name
setup
scan
mount
unmount
teardown

Avoid global state.

Use the event system provided by ctx.events.

Use ctx.logger for logs.

Ensure plugins support both:

data-weave-* attributes
.weave_* classes.
```
