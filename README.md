# WEAVE

Version: `0.1`  
Owner: `Maru`  
Purpose: Company Internal Frontend Utility Framework

## 1. 프로젝트 개요

WEAVE는 회사 내부 프론트엔드 공통 자산을 위한 유틸리티 프레임워크입니다.

핵심 목표는 다음과 같습니다.

- 프로젝트 간 CSS / JS 재사용
- 퍼블리셔가 빠르게 화면 제작
- AI 기반 코드 생성과 조합 가능
- 공통 UI 패턴 관리
- 스타터 킷 자동 생성

WEAVE는 크게 3개의 영역으로 구성됩니다.

```text
WEAVE
├ CSS Utility System (wv.css)
├ JS Plugin Runtime (core.js)
└ Docs & StarterKit Generator
```

## 2. 기술 스택

### Frontend Docs

- React
- Vite
- pnpm workspace

### Core Framework

- Vanilla JS
- SCSS
- Plugin Architecture

### Build

- pnpm
- sass
- vite

## 3. 프로젝트 구조

현재 프로젝트는 `pnpm workspace` 구조입니다.

```text
WEAVE
├ packages
│  └ wv
│     ├ src
│     │  ├ js
│     │  │  ├ core
│     │  │  └ plugins
│     │  └ scss
│     └ dist
│        ├ css
│        └ js
└ apps
   └ docs
      └ React documentation site
```

실제 주요 경로는 다음과 같습니다.

- `packages/wv/src/js/core`
- `packages/wv/src/js/plugins`
- `packages/wv/src/scss`
- `apps/docs`

## 4. CSS 시스템 설계

WEAVE CSS는 Utility Class 기반 시스템입니다.

산출물은 다음과 같습니다.

- `wv.css`
- `common.css`
- `admin.css`
- `gov.css`

### 4.1 `wv.css`

공통 유틸리티 클래스를 제공합니다.

예:

- `mt_20`
- `fc_point1`
- `bgc_primary`
- `rd_base`

이 값들은 고정 값 기반의 유틸리티로 설계됩니다.

### 4.2 `common.css`

프로젝트별 커스터마이즈 레이어입니다.

예:

```css
:root {
  --point1: #ff4d4f;
}
```

즉, `fc_point1` 같은 클래스는 프로젝트 토큰과 연결되어 사용할 수 있습니다.

### 4.3 CSS 설계 원칙

- Utility 중심
- `rem10` 기반
- `1rem = 10px`
- 디자인 토큰 분리
- 프로젝트별 컬러 커스터마이즈

## 5. JS 시스템 설계

WEAVE JS는 Plugin Runtime Engine입니다.

핵심 구조:

- `createWeave()`
- plugin architecture

목표:

- 공통 UI 컴포넌트 관리
- plugin 기반 확장
- `mount / destroy` lifecycle
- SPA / AJAX 대응

## 6. Core Runtime 구조

현재 코어 런타임은 다음 파일로 구성됩니다.

```text
core
├ createWeave.js
├ registry.js
├ logger.js
├ events.js
├ guards.js
└ observer.js
```

각 모듈의 역할은 다음과 같습니다.

- `createWeave.js`: 런타임 생성, 플러그인 등록, mount / refresh / destroy 제어
- `registry.js`: 플러그인 목록과 element-instance 저장소 관리
- `logger.js`: 디버그 로그 래퍼
- `events.js`: 이벤트 등록, 위임, cleanup 관리
- `guards.js`: 브라우저 기능 가드
- `observer.js`: `MutationObserver` 기반 DOM 변경 감지

## 7. Plugin Lifecycle

WEAVE plugin은 다음 lifecycle을 가집니다.

- `setup()`
- `scan()`
- `mount()`
- `unmount()`
- `teardown()`

설명:

- `setup`: plugin 최초 초기화
- `scan`: DOM에서 plugin 대상 element 찾기
- `mount`: element에 기능 연결
- `unmount`: element cleanup
- `teardown`: plugin 종료

## 8. Plugin Selector 규칙

WEAVE는 class + data attribute를 동시에 지원합니다.

data attribute 예:

- `data-weave-modal`
- `data-weave-tabs`
- `data-weave-copy`

class 예:

- `.weave_modal`
- `.weave_tabs`
- `.weave_copy`

scan 예시:

```css
[data-weave-copy], .weave_copy
```

## 9. 현재 구현된 Plugin

현재 구현된 플러그인은 `copy plugin`입니다.

지원 기능:

- `data-text`
- `data-target`
- copy alert
- Clipboard API
- fallback copy

현재 구현 기준 셀렉터:

```text
[data-weave-copy], .weave_copy
```

## 10. JS 이벤트 시스템

`events.js`는 다음 기능을 지원합니다.

- `listen()`
- `delegate()`
- `delegateMap()`
- `cleanup()`

목적:

- event 중복 방지
- destroy 대응
- plugin isolation

## 11. Observer 시스템

WEAVE는 `MutationObserver` wrapper를 사용합니다.

목적:

- AJAX DOM 대응
- SPA 대응

기본 옵션:

- `autoObserve: false`

## 12. 현재 발견된 문제

### 12.1 WeakMap iteration error

destroy 단계에서 `WeakMap.forEach` 또는 순회 불가 문제로 cleanup이 어려웠습니다.

해결 방향:

- instance registry는 `WeakMap`이 아닌 `Map`을 사용

현재 구현도 `Map` 기반 저장소를 사용합니다.

### 12.2 React StrictMode double mount

React 개발 모드에서는 다음 순서가 발생할 수 있습니다.

```text
mount
destroy
mount
```

이는 React `StrictMode`의 개발 환경 동작으로, 현재 구조에서는 정상 케이스로 간주합니다.

## 13. 앞으로 구현할 Plugin

다음 순서로 구현 예정입니다.

1. `copy` (완료)
2. `tabs`
3. `accordion`
4. `modal`
5. `animation`

## 14. Docs 사이트 기능

Docs 사이트 목표:

- WEAVE documentation
- component gallery
- starter kit generator

예상 페이지 구조:

- Home
- Docs
- Palette
- UI Library
- Download

## 15. Starter Kit Generator

사용자는 다음 항목을 선택합니다.

- 컬러
- UI header
- footer
- components

이후 생성 결과:

- custom `common.css`
- template files
- starter project
- zip 다운로드

## 16. 향후 계획

WEAVE의 최종 목표:

- Internal frontend framework
- AI assisted code generator
- StarterKit builder
- Component library

## 17. Cursor AI 역할

Cursor AI는 다음 작업을 담당합니다.

- JS plugin 리팩토링
- plugin 작성 자동화
- docs 코드 생성
- starter kit generator 구현
- 코드 구조 유지보수

## 18. Cursor 작업용 기본 프롬프트

```text
You are helping maintain and extend a frontend framework called WEAVE.

This framework is a plugin-based UI runtime system designed for internal company use.

The project uses:

React (docs site)
Vite
pnpm workspace
Vanilla JS core framework

The framework consists of:

CSS utility system
JS plugin runtime
Docs site with component library

The JS runtime architecture includes:

createWeave
registry
logger
events
guards
observer

Plugins follow a lifecycle:

setup
scan
mount
unmount
teardown

Plugins use selectors:

data-weave-* attributes
.weave_* classes

Example:

data-weave-modal
.weave_modal

The system must support:

DOM scanning
plugin lifecycle
dynamic DOM updates
clean destroy

Currently implemented plugin:

copy plugin

Next plugins to implement:

tabs
accordion
modal
animation

Important rule:

registry stores plugin instances using Map, not WeakMap, because we must iterate during destroy.

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
