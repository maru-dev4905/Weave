# WEAVE Docs App

`apps/docs`는 WEAVE 문서 사이트와 컴포넌트 데모를 위한 React + Vite 애플리케이션입니다.

현재 역할은 다음과 같습니다.

- `@weave/wv` 패키지 동작 확인
- plugin 예제 페이지 제공
- 향후 component gallery 확장
- starter kit generator UI 연결

프로젝트 전체 기술 개요는 루트의 `README.md`를 참고하면 됩니다.

## 개발

루트에서 실행:

```bash
pnpm dev
```

docs 앱만 실행:

```bash
pnpm --filter docs dev
```

## 빌드

```bash
pnpm --filter docs build
```
