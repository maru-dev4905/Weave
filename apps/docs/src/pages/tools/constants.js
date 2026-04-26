export const starterPluginOptions = [
  'copyPlugin',
  'fileDropPlugin',
  'linkButtonPlugin',
  'targetButtonPlugin',
  'tabsPlugin',
  'accordionPlugin',
  'modalPlugin',
  'hideTodayPlugin',
  'scrollToPlugin',
  'validationPlugin',
];

export const pluginAttributeSpec = {
  copy: {
    required: ['data-weave-copy'],
    recommended: [
      { attribute: 'data-weave-copy-target', why: '복사할 텍스트 소스를 명확히 지정할 수 있습니다.' },
      { attribute: 'data-weave-copy-message', why: '복사 성공 피드백 메시지를 커스텀할 수 있습니다.' },
    ],
  },
  fileDrop: {
    required: ['data-weave-file-drop'],
    recommended: [
      { attribute: 'data-weave-file-drop-list', why: '선택된 파일 목록을 사용자에게 즉시 보여줍니다.' },
    ],
  },
  linkButton: {
    required: ['data-weave-link-button'],
    recommended: [
      { attribute: 'data-weave-link-href', why: '이동 URL을 명시해 버튼 동작을 예측 가능하게 합니다.' },
      { attribute: 'data-weave-link-blank', why: '새 탭 이동 여부를 제어할 수 있습니다.' },
    ],
  },
  targetButton: {
    required: ['data-weave-target-button'],
    recommended: [
      { attribute: 'data-weave-target', why: '제어할 대상 요소를 명확히 지정합니다.' },
      { attribute: 'data-weave-target-action', why: 'toggle/add/remove 등 의도를 명확히 지정합니다.' },
    ],
  },
  tabs: {
    required: ['data-weave-tabs', 'data-weave-tabs-button', 'data-weave-tabs-panel'],
    recommended: [
      { attribute: 'data-weave-tabs-active', why: '초기 활성 탭을 명시해 첫 렌더 혼란을 줄입니다.' },
    ],
  },
  accordion: {
    required: ['data-weave-accordion', 'data-weave-accordion-button', 'data-weave-accordion-panel'],
    recommended: [
      { attribute: 'data-weave-accordion-mode', why: 'single/multi 동작 모드를 명시할 수 있습니다.' },
    ],
  },
  modal: {
    required: ['data-weave-modal', 'data-weave-modal-open', 'data-weave-modal-close'],
    recommended: [
      { attribute: 'data-weave-modal-overlay', why: '오버레이를 통해 닫기 UX를 명확히 제공합니다.' },
    ],
  },
  hideToday: {
    required: ['data-weave-hide-today'],
    recommended: [
      { attribute: 'data-weave-hide-today-button', why: '오늘 하루 숨김 버튼을 분리해 제어성을 높입니다.' },
      { attribute: 'data-weave-hide-today-checkbox', why: '사용자 의사 확인을 체크박스로 명시할 수 있습니다.' },
    ],
  },
  scrollTo: {
    required: ['data-weave-scroll-target'],
    recommended: [
      { attribute: 'data-weave-scroll-offset', why: '고정 헤더가 있는 페이지에서 정확한 위치 정렬에 필요합니다.' },
      { attribute: 'data-weave-scroll-duration', why: '스크롤 속도를 조정해 UX를 안정화할 수 있습니다.' },
    ],
  },
  validation: {
    required: ['data-weave-validation'],
    recommended: [
      { attribute: 'data-weave-validation-message', why: '필드별 오류 위치를 제어해 가독성을 높입니다.' },
      { attribute: 'data-weave-validation-summary', why: '폼 전체 오류를 요약해 제출 실패 원인을 빠르게 파악하게 합니다.' },
    ],
  },
  anim: {
    required: ['data-weave-anim'],
    recommended: [
      { attribute: 'data-weave-anim-type', why: 'fade/parallax/cascade 등 애니메이션 타입을 명시합니다.' },
      { attribute: 'data-weave-anim-duration', why: '지속 시간을 제어해 움직임 일관성을 확보합니다.' },
    ],
  },
};
