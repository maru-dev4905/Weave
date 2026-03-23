# WEAVE CSS 설명서

이 문서는 현재 코드 기준으로 `wv.css`와 `common.css`의 역할, 클래스 체계, 토큰 구조, 그리고 실제 사용 방식을 정리한 문서입니다.

- 기준 산출물: `packages/wv/dist/css/wv.css`, `packages/wv/dist/css/common.css`
- 기준 소스: `packages/wv/src/scss`
- 작성 기준: 현재 실제 포함되는 클래스 우선

## 1. 전체 구조

| 파일           | 역할              | 설명                                                                |
|--------------|-----------------|-------------------------------------------------------------------|
| `common.css` | 토큰 레이어          | 색상, inner/gutter, radius 같은 CSS 변수 정의                             |
| `wv.css`     | 유틸리티/기본 스타일 레이어 | reset, a11y, layout, utility class, helper class, motion class 포함 |
| `admin.css`  | 별도 관리자 스타일      | `wv.css`와 별개 성격                                                   |
| `gov.css`    | 별도 관공서 스타일      | `wv.css`와 별개 성격                                                   |

## 2. `common.css`와 `wv.css` 관계

현재 WEAVE CSS는 아래 흐름으로 사용하는 구조입니다.

1. `common.css`가 `:root`에 기본 토큰 값을 선언합니다.
2. `wv.css` 유틸리티 클래스는 이 토큰을 `var(--token)` 형태로 참조합니다.
3. 따라서 `common.css`의 토큰 값을 바꾸면 `wv.css` 클래스가 자동으로 다른 색상/간격/반경 값을 사용하게 됩니다.

즉, `wv.css`는 유틸리티의 "형태"를 제공하고, `common.css`는 그 유틸리티가 참조하는 "값"을 제공합니다.

예시:

| 토큰 파일        | 토큰              | 소비 클래스 예시   | 실제 효과             |
|--------------|-----------------|-------------|-------------------|
| `common.css` | `--g_50`        | `.fc_g_50`  | 텍스트 색상이 바뀜        |
| `common.css` | `--p_40`        | `.bgc_p_40` | 배경색이 바뀜           |
| `common.css` | `--rd_base`     | `.rd_base`  | border-radius가 바뀜 |
| `common.css` | `--inner_base`  | `.inner`    | 최대 너비가 바뀜         |
| `common.css` | `--gutter_base` | `.inner`    | 좌우 패딩이 바뀜         |

## 3. 현재 빌드에 포함되는 SCSS 모듈

`packages/wv/src/scss/index.scss` 기준으로 현재 `wv.css`에 포함되는 항목은 아래와 같습니다.

특히 `width`, `height`, `max-width`, `max-height` 계열은 현재 별도 `Sizing` 모듈로 포함되어 있습니다.

| 분류           | 소스 파일                                         | 포함 여부 | 비고                                 |
|--------------|-----------------------------------------------|-------|------------------------------------|
| Layout       | `_objects/_layout.scss`                       | 포함    | `.inner`, `.gutter_*` 등            |
| Display      | `_utilities/_display.scss`                    | 포함    | `dp_*`                             |
| Flex         | `_utilities/_flex.scss`                       | 포함    | `fd_*`, `al_*`, `jtf_*`            |
| Gap          | `_utilities/_gap.scss`                        | 포함    | `gap*`                             |
| Grid         | `_utilities/_grid.scss`                       | 포함    | `grid_lay`, `colST*`               |
| Opacity      | `_utilities/_opacity.scss`                    | 포함    | `op_*`                             |
| Position     | `_utilities/_position.scss`                   | 포함    | `pos_*`                            |
| Spacing      | `_utilities/_spacing.scss`                    | 포함    | `mt_*`, `pt_*` 등                   |
| Typography   | `_utilities/_typography.scss`                 | 포함    | `fs_*`, `fw_*`, `lih*`             |
| Z-index      | `_utilities/_zindex.scss`                     | 포함    | `z_idx*`                           |
| Visibility   | `_utilities/_visibility.scss`                 | 포함    | `m_show`, `res_*`                  |
| Radius       | `_utilities/_radius.scss`                     | 포함    | `rd_*`                             |
| Sizing       | `_utilities/_sizing.scss`                     | 포함    | `w_*`, `h_*`, `mw_*`, `mh_*`       |
| Aspect Ratio | `_utilities/_aspect_ratio.scss`               | 포함    | `aspect_*`                         |
| Color        | `_utilities/_color.scss`                      | 포함    | `fc_*`, `bgc_*`                    |
| Helpers      | `_utilities/_helpers.scss`                    | 포함    | `.dot`, `.indent`                  |
| Modal        | `_utilities/_modal.scss`                      | 포함    | `.wv_modal`                        |
| Scrollbar    | `_utilities/_scrollbar.scss`                  | 포함    | `.scrollbar_custom`, `.scrollLock` |
| Motion       | `_motion/_fade.scss`, `_motion/_hover.scss`   | 포함    | `.anim.fade`, `.hov_op`            |
| Reset/A11y   | `_generic/_reset.scss`, `_generic/_a11y.scss` | 포함    | reset, `#skipNav`, `.a11y-hidden`  |

## 5. 현재 소스에는 있지만 `wv.css`에 직접 포함되지 않는 항목

| 파일                                              | 상태                    | 설명               |
|-------------------------------------------------|-----------------------|------------------|
| `packages/wv/src/scss/_utilities/_form.scss`    | 현재 `index.scss`에서 미사용 | `.wv_ipt` 정의만 존재 |
| `packages/wv/src/scss/_settings/_css-vars.scss` | 빈 파일                  | 실제 선언 없음         |
| `packages/wv/src/scss/_settings/_config.scss`   | 현재 사용 안 함             | 별도 import 없음     |

## 6. 토큰 체계: `common.css`

### 6.1 Layout 토큰

| 토큰 그룹         | 현재 변수                                                                    | 설명             |
|---------------|--------------------------------------------------------------------------|----------------|
| Inner width   | `--inner_sm`, `--inner_base`, `--inner_lg`, `--inner_xl`                 | 컨테이너 최대 너비     |
| Gutter        | `--gutter_sm`, `--gutter_base`, `--gutter_lg`, `--gutter_xl`             | 좌우 패딩          |
| Mobile inner  | `--md_inner_sm`, `--md_inner_base`, `--md_inner_lg`, `--md_inner_xl`     | 모바일/반응형 inner  |
| Mobile gutter | `--md_gutter_sm`, `--md_gutter_base`, `--md_gutter_lg`, `--md_gutter_xl` | 모바일/반응형 gutter |

### 6.2 Color 토큰

| 토큰 그룹        | 접두사   | 스케일                                                 | 의미      |
|--------------|-------|-----------------------------------------------------|---------|
| Gray         | `g_`  | `0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100` | 회색 스케일  |
| Primary      | `p_`  | `0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100` | 메인 컬러   |
| Secondary 1  | `s1_` | `0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100` | 보조 컬러 1 |
| Secondary 2  | `s2_` | `0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100` | 보조 컬러 2 |
| Accent       | `a_`  | `0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100` | 강조 컬러   |
| Graphic Blue | `gb_` | `20, 40, 60, 80, 100`                               | 그래픽용 블루 |
| Graphic Red  | `gr_` | `20, 40, 60, 80, 100`                               | 그래픽용 레드 |
| Danger       | `d_`  | `0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100` | 에러/위험   |
| Warning      | `w_`  | `0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100` | 경고      |
| Success      | `su_` | `0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100` | 성공      |
| Information  | `i_`  | `0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100` | 정보성 컬러  |

### 6.3 Radius 토큰

| 그룹              | 토큰                                                                     | 설명              |
|-----------------|------------------------------------------------------------------------|-----------------|
| 기본 radius scale | `--rd_1`, `--rd_2`, `--rd_4`, `--rd_6`, `--rd_8`, `--rd_10`, `--rd_12` | 실제 px 값         |
| 의미 기반 alias     | `--rd_xs`, `--rd_sm`, `--rd_md`, `--rd_lg`, `--rd_xl`                  | scale alias     |
| 기본 기준값          | `--rd_base`                                                            | 현재 `--rd_md` 참조 |

## 7. 반응형 접두사 체계

### 7.1 브레이크포인트

| 키    | 값        | 의미               |
|------|----------|------------------|
| `wd` | `1600px` | wide desktop     |
| `ds` | `1440px` | desktop standard |
| `nb` | `1280px` | notebook         |
| `tb` | `1024px` | tablet           |
| `md` | `768px`  | mobile display   |
| `mp` | `500px`  | mobile small     |

### 7.2 클래스 접두사 규칙

| 접두사     | 적용 범위                       | 예시                                    |
|---------|-----------------------------|---------------------------------------|
| 없음      | 기본                          | `.mt_20`, `.w_100`, `.dp_f`           |
| `tb_`   | `max-width: 1024px` 일부 유틸리티 | `.tb_mt_20`, `.tb_w_100`              |
| `md_`   | `max-width: 768px` 반응형 유틸리티 | `.md_fs_16`, `.md_dp_b`, `.md_w_full` |
| `res_*` | 특정 breakpoint show/hide     | `.res_1600_s`, `.res_1440_h`          |

## 8. 클래스 레퍼런스: Layout/Object

### 8.1 컨테이너 계열

| 클래스            | 의미            | 실제 스타일                                                         |
|----------------|---------------|----------------------------------------------------------------|
| `.inner`       | 기본 컨테이너       | `width:100%`, `max-width: var(--inner_base)`, 좌우 `gutter_base` |
| `.inner_sm`    | 좁은 컨테이너       | `max-width: var(--inner_sm)`                                   |
| `.inner_lg`    | 큰 컨테이너        | `max-width: var(--inner_lg)`                                   |
| `.inner_xl`    | 매우 큰 컨테이너     | `max-width: var(--inner_xl)`                                   |
| `.md_inner`    | 모바일 기본 컨테이너   | `max-width: var(--md_inner_base)`                              |
| `.md_inner_sm` | 모바일 작은 컨테이너   | `max-width: var(--md_inner_sm)`                                |
| `.md_inner_lg` | 모바일 큰 컨테이너    | `max-width: var(--md_inner_lg)`                                |
| `.md_inner_xl` | 모바일 매우 큰 컨테이너 | `max-width: var(--md_inner_xl)`                                |

### 8.2 Gutter 계열

| 클래스             | 의미                        |
|-----------------|---------------------------|
| `.gutter_sm`    | 좌우 padding을 `gutter_sm`으로 |
| `.gutter_lg`    | 좌우 padding을 `gutter_lg`로  |
| `.gutter_xl`    | 좌우 padding을 `gutter_xl`로  |
| `.md_gutter_sm` | 모바일 gutter small          |
| `.md_gutter_lg` | 모바일 gutter large          |
| `.md_gutter_xl` | 모바일 gutter xlarge         |

### 8.3 Layout에 포함된 width/height 유틸리티

| 클래스                 | 의미                                          |
|---------------------|---------------------------------------------|
| `.full`             | `width: 100%`                               |
| `.w_100per`         | `width: 100% !important`                    |
| `.w_max_content`    | `width: max-content !important`             |
| `.h_100per`         | `height: 100% !important`                   |
| `.h_max_content`    | 현재 소스상 `width: max-content !important`로 선언됨 |
| `.md_w_100per`      | 모바일 `width: 100%`                           |
| `.md_w_max_content` | 모바일 `width: max-content`                    |
| `.md_h_100per`      | 모바일 `height: 100%`                          |
| `.md_h_max_content` | 현재 소스상 `width: max-content !important`로 선언됨 |

## 9. 클래스 레퍼런스: Display

| 패턴         | 의미                      |
|------------|-------------------------|
| `.dp_b`    | `display: block`        |
| `.dp_ib`   | `display: inline-block` |
| `.dp_i`    | `display: inline`       |
| `.dp_f`    | `display: flex`         |
| `.dp_if`   | `display: inline-flex`  |
| `.dp_n`    | `display: none`         |
| `.dp_g`    | `display: grid`         |
| `.dp_ig`   | `display: inline-grid`  |
| `.md_dp_*` | 위와 동일한 모바일 버전           |

## 10. 클래스 레퍼런스: Flex

### 10.1 방향

| 클래스           | 의미             |
|---------------|----------------|
| `.fd_col`     | column         |
| `.fd_col_rvs` | column-reverse |
| `.fd_row`     | row            |
| `.fd_row_rvs` | row-reverse    |

### 10.2 정렬

| 클래스           | 의미                                                           |
|---------------|--------------------------------------------------------------|
| `.al_start`   | `align-items: flex-start`                                    |
| `.al_center`  | `align-items: center`                                        |
| `.al_end`     | `align-items: flex-end`                                      |
| `.jtf_start`  | `justify-content: flex-start`                                |
| `.jtf_center` | `justify-content: center`                                    |
| `.jtf_end`    | `justify-content: flex-end`                                  |
| `.jtf_bet`    | `justify-content: space-between`                             |
| `.jtf_aro`    | `justify-content: space-around`                              |
| `.fd_center`  | `display:flex + justify-content:center + align-items:center` |

### 10.3 줄바꿈/비율/순서

| 클래스 패턴                                          | 범위    | 의미                  |
|-------------------------------------------------|-------|---------------------|
| `.fd_wrap`                                      | 단일    | `flex-wrap: wrap`   |
| `.fd_nowrap`                                    | 단일    | `flex-wrap: nowrap` |
| `.fx_0` ~ `.fx_12`                              | 숫자 생성 | `flex: n`           |
| `.fx_order0` ~ `.fx_order12`                    | 숫자 생성 | `order: n`          |
| `.md_fd_*`, `.md_al_*`, `.md_jtf_*`, `.md_fx_*` | 모바일   | 동일 규칙               |

## 11. 클래스 레퍼런스: Gap

### 11.1 기본 규칙

간격 값은 아래 interval scale을 사용합니다.

`300, 280, 260, 240, 200, 180, 160, 150, 140, 130, 120, 100, 90, 80, 70, 64, 60, 50, 40, 36, 30, 24, 20, 16, 12, 10, 8, 6, 4, 0`

`rem10()` 함수로 변환되므로 예를 들어:

- `20 -> 2rem`
- `100 -> 10rem`
- `0 -> 0`

### 11.2 클래스 패턴

| 패턴                                       | 의미                      |
|------------------------------------------|-------------------------|
| `.gap0`                                  | `gap: 0`                |
| `.gap4`, `.gap8`, `.gap10` ... `.gap300` | interval scale 기반 `gap` |
| `.md_gap*`                               | 모바일 gap                 |

## 12. 클래스 레퍼런스: Grid

### 12.1 기본 grid

| 클래스            | 의미                                         |
|----------------|--------------------------------------------|
| `.grid_lay`    | 12열 grid 레이아웃                              |
| `.grid_col`    | `grid-column: var(--colST) / var(--colED)` |
| `.md_grid_lay` | 모바일 4열 grid                                |
| `.md_grid_col` | 모바일 컬럼 변수 사용                               |

### 12.2 행/열 시작과 끝

| 패턴                                                     | 범위   | 의미                  |
|--------------------------------------------------------|------|---------------------|
| `.colST1` ~ `.colST12`                                 | 1~12 | `grid-column-start` |
| `.colST-1` ~ `.colST-12`                               | 1~12 | 음수 시작값              |
| `.colED1` ~ `.colED12`                                 | 1~12 | `grid-column-end`   |
| `.colED-1` ~ `.colED-12`                               | 1~12 | 음수 끝값               |
| `.rowST1` ~ `.rowST12`                                 | 1~12 | `grid-row-start`    |
| `.rowED1` ~ `.rowED12`                                 | 1~12 | `grid-row-end`      |
| `.md_colST*`, `.md_colED*`, `.md_rowST*`, `.md_rowED*` | 모바일  | 동일 규칙               |

## 13. 클래스 레퍼런스: Opacity

| 패턴                       | 범위   | 의미                   |
|--------------------------|------|----------------------|
| `.op_0` ~ `.op_10`       | 0~10 | `opacity: 0.0 ~ 1.0` |
| `.md_op_0` ~ `.md_op_10` | 0~10 | 모바일 opacity          |

## 14. 클래스 레퍼런스: Position

| 클래스         | 의미       |
|-------------|----------|
| `.pos_re`   | relative |
| `.pos_ab`   | absolute |
| `.pos_fx`   | fixed    |
| `.pos_sk`   | sticky   |
| `.pos_st`   | static   |
| `.md_pos_*` | 모바일 버전   |

## 15. 클래스 레퍼런스: Spacing

### 15.1 사용 스케일

spacing도 동일하게 interval scale을 사용합니다.

`300, 280, 260, 240, 200, 180, 160, 150, 140, 130, 120, 100, 90, 80, 70, 64, 60, 50, 40, 36, 30, 24, 20, 16, 12, 10, 8, 6, 4, 0`

### 15.2 기본 패턴

| 패턴      | 의미             |
|---------|----------------|
| `.mt_*` | margin-top     |
| `.mr_*` | margin-right   |
| `.mb_*` | margin-bottom  |
| `.ml_*` | margin-left    |
| `.pt_*` | padding-top    |
| `.pr_*` | padding-right  |
| `.pb_*` | padding-bottom |
| `.pl_*` | padding-left   |

예시:

| 클래스      | 실제 값                   |
|----------|------------------------|
| `.mt_20` | `margin-top: 2rem`     |
| `.pb_40` | `padding-bottom: 4rem` |
| `.ml_0`  | `margin-left: 0`       |

### 15.3 반응형 패턴

| 접두사   | 예시                       | 적용 구간               |
|-------|--------------------------|---------------------|
| `tb_` | `.tb_mt_20`, `.tb_pb_40` | `max-width: 1024px` |
| `md_` | `.md_mt_20`, `.md_pb_40` | `max-width: 768px`  |

## 16. 클래스 레퍼런스: Typography

### 16.1 폰트 크기

현재 정의된 font-size scale:

`200, 180, 160, 140, 130, 120, 100, 80, 72, 68, 64, 60, 56, 52, 50, 48, 44, 40, 36, 32, 30, 28, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 14, 11, 12, 10`

| 패턴         | 의미                  |
|------------|---------------------|
| `.fs_16`   | `font-size: 1.6rem` |
| `.fs_20`   | `font-size: 2rem`   |
| `.fs_40`   | `font-size: 4rem`   |
| `.md_fs_*` | 모바일 font-size       |

### 16.2 폰트 굵기

| 클래스            | 값      |
|----------------|--------|
| `.fw_heavy`    | 900    |
| `.fw_exBold`   | 800    |
| `.fw_bold`     | 700    |
| `.fw_semibold` | 600    |
| `.fw_medium`   | 500    |
| `.fw_regular`  | 400    |
| `.fw_light`    | 300    |
| `.fw_exLight`  | 200    |
| `.fw_thin`     | 100    |
| `.md_fw_*`     | 모바일 버전 |

### 16.3 line-height

| 클래스          | 값        |
|--------------|----------|
| `.lih64`     | `6.4rem` |
| `.lih42`     | `4.2rem` |
| `.lih36`     | `3.6rem` |
| `.lih30`     | `3rem`   |
| `.lih24`     | `2.4rem` |
| `.lih20`     | `2rem`   |
| `.lih220per` | `220%`   |
| `.lih170per` | `170%`   |
| `.lih160per` | `160%`   |
| `.lih150per` | `150%`   |
| `.lih135per` | `135%`   |
| `.lih130per` | `130%`   |
| `.lih125per` | `125%`   |
| `.lih120per` | `120%`   |
| `.lih110per` | `110%`   |
| `.lih100per` | `100%`   |
| `.md_lih*`   | 모바일 버전   |

### 16.4 정렬/말줄임/장식

| 클래스                                                           | 의미                 |
|---------------------------------------------------------------|--------------------|
| `.ta_center`                                                  | 가운데 정렬             |
| `.ta_left`                                                    | 왼쪽 정렬              |
| `.ta_right`                                                   | 오른쪽 정렬             |
| `.txt_over_dot`                                               | clamp를 위한 base 스타일 |
| `.clamp1`                                                     | 1줄 말줄임             |
| `.clamp2`                                                     | 2줄 말줄임             |
| `.clamp3`                                                     | 3줄 말줄임             |
| `.clamp4`                                                     | 4줄 말줄임             |
| `.underline`                                                  | underline          |
| `.md_ta_*`, `.md_txt_over_dot`, `.md_clamp*`, `.md_underline` | 모바일 버전             |

## 17. 클래스 레퍼런스: Z-index

| 패턴                           | 범위   | 의미           |
|------------------------------|------|--------------|
| `.z_idx1` ~ `.z_idx20`       | 1~20 | `z-index: n` |
| `.md_z_idx1` ~ `.md_z_idx20` | 1~20 | 모바일 z-index  |

## 18. 클래스 레퍼런스: Visibility / Responsive

### 18.1 기본

| 클래스           | 기본 동작                 |
|---------------|-----------------------|
| `.m_show`     | 기본에서는 `display: none` |
| `.res_1600_s` | 기본에서는 `display: none` |
| `.res_1440_s` | 기본에서는 `display: none` |
| `.res_1280_s` | 기본에서는 `display: none` |
| `.res_1024_s` | 기본에서는 `display: none` |

### 18.2 breakpoint별 show/hide

| 구간          | 표시 클래스        | 숨김 클래스        |
|-------------|---------------|---------------|
| `1600px 이하` | `.res_1600_s` | `.res_1600_h` |
| `1440px 이하` | `.res_1440_s` | `.res_1440_h` |
| `1280px 이하` | `.res_1280_s` | `.res_1280_h` |
| `1024px 이하` | `.res_1024_s` | `.res_1024_h` |
| `768px 이하`  | `.m_show`     | `.m_hide`     |

주의:

- `show` 계열은 대부분 `display: block !important`로 바뀝니다.
- 원래 `flex`나 `grid`였던 요소를 그대로 복원하는 구조는 아닙니다.

## 19. 클래스 레퍼런스: Radius

| 클래스                                                                      | 의미                      |
|--------------------------------------------------------------------------|-------------------------|
| `.rd_base`                                                               | 기본 radius               |
| `.rd_xs`, `.rd_sm`, `.rd_md`, `.rd_lg`, `.rd_xl`                         | alias radius            |
| `.rd_0`, `.rd_1`, `.rd_2`, `.rd_4`, `.rd_6`, `.rd_8`, `.rd_10`, `.rd_12` | 고정 radius               |
| `.rd_t`, `.rd_b`, `.rd_l`, `.rd_r`                                       | 방향별 radius              |
| `.rd_tl`, `.rd_tr`, `.rd_bl`, `.rd_br`                                   | 코너별 radius              |
| `.rd_x`, `.rd_y`                                                         | 전체 모서리 일괄 적용            |
| `.rd_full`                                                               | `border-radius: 9999px` |
| `.md_rd_*`                                                               | 모바일 버전                  |

## 20. 클래스 레퍼런스: Sizing

이 섹션은 "추가 예정" 상태가 아니라, 현재 `wv.css`에 실제 포함되어 있는 sizing 유틸리티 기준입니다.

### 20.1 사용 스케일

sizing도 동일하게 interval scale을 사용합니다.

`300, 280, 260, 240, 200, 180, 160, 150, 140, 130, 120, 100, 90, 80, 70, 64, 60, 50, 40, 36, 30, 24, 20, 16, 12, 10, 8, 6, 4, 0`

### 20.2 기본 패턴

| 패턴        | 의미             |
|-----------|----------------|
| `.w_full` | `width: 100%`  |
| `.h_full` | `height: 100%` |
| `.w_auto` | `width: auto`  |
| `.h_auto` | `height: auto` |
| `.w_*`    | width          |
| `.mw_*`   | max-width      |
| `.h_*`    | height         |
| `.mh_*`   | max-height     |

예시:

| 클래스       | 실제 값                |
|-----------|---------------------|
| `.w_100`  | `width: 10rem`      |
| `.mw_300` | `max-width: 30rem`  |
| `.h_40`   | `height: 4rem`      |
| `.mh_200` | `max-height: 20rem` |

### 20.3 반응형 패턴

| 접두사   | 예시                                     | 적용 구간               |
|-------|----------------------------------------|---------------------|
| `tb_` | `.tb_w_full`, `.tb_h_40`, `.tb_mw_300` | `max-width: 1024px` |
| `md_` | `.md_w_full`, `.md_h_40`, `.md_mw_300` | `max-width: 768px`  |

## 21. 클래스 레퍼런스: Aspect Ratio

| 클래스              | 의미                     |
|------------------|------------------------|
| `.aspect_auto`   | `aspect-ratio: auto`   |
| `.aspect_square` | `aspect-ratio: 1 / 1`  |
| `.aspect_video`  | `aspect-ratio: 16 / 9` |

## 22. 클래스 레퍼런스: Color

### 22.1 텍스트 색상 패턴

기본 패턴은 아래와 같습니다.

| 패턴         | 의미                    |
|------------|-----------------------|
| `.fc_g_*`  | gray token 사용         |
| `.fc_p_*`  | primary token 사용      |
| `.fc_s1_*` | secondary1 token 사용   |
| `.fc_s2_*` | secondary2 token 사용   |
| `.fc_a_*`  | accent token 사용       |
| `.fc_gb_*` | graphic blue token 사용 |
| `.fc_gr_*` | graphic red token 사용  |
| `.fc_d_*`  | danger token 사용       |
| `.fc_w_*`  | warning token 사용      |
| `.fc_su_*` | success token 사용      |
| `.fc_i_*`  | information token 사용  |

예시:

| 클래스         | 참조 토큰          |
|-------------|----------------|
| `.fc_g_50`  | `var(--g_50)`  |
| `.fc_p_40`  | `var(--p_40)`  |
| `.fc_s1_70` | `var(--s1_70)` |
| `.fc_s2_30` | `var(--s2_30)` |
| `.fc_d_50`  | `var(--d_50)`  |

### 22.2 배경색 패턴

| 패턴          | 의미              |
|-------------|-----------------|
| `.bgc_g_*`  | gray 배경         |
| `.bgc_p_*`  | primary 배경      |
| `.bgc_a_*`  | accent 배경       |
| `.bgc_gb_*` | graphic blue 배경 |
| `.bgc_gr_*` | graphic red 배경  |
| `.bgc_d_*`  | danger 배경       |
| `.bgc_w_*`  | warning 배경      |
| `.bgc_su_*` | success 배경      |
| `.bgc_i_*`  | information 배경  |

### 22.3 현재 주의할 점

현재 소스 기준으로 배경색에는 아래 패턴이 존재합니다.

| 패턴         | 현재 선언 형태        | 비고                                                      |
|------------|-----------------|---------------------------------------------------------|
| `.bgc_s_*` | `var(--s_*)` 참조 | `common.css`에는 `--s_*`가 아니라 `--s1_*`, `--s2_*`가 정의되어 있음 |

즉, 색상 유틸리티 문서화 시에는 현재 코드상 클래스 존재 여부와 실제 토큰 정합성을 구분해서 이해하는 것이 좋습니다.

## 23. 클래스 레퍼런스: Helpers

| 클래스           | 의미                    |
|---------------|-----------------------|
| `.dot`        | 앞에 점(`·`)을 두는 flex 헬퍼 |
| `.indent`     | 내어쓰기 형태 텍스트           |
| `.dot.indent` | 점 목록 + 들여쓰기 조합        |

## 24. 클래스 레퍼런스: Modal / Scroll / Motion

### 24.1 Modal

| 클래스                | 의미          |
|--------------------|-------------|
| `.wv_modal`        | 기본 숨김 상태 모달 |
| `.wv_modal.active` | 표시 상태       |

### 24.2 Scroll

| 클래스                 | 의미                                       |
|---------------------|------------------------------------------|
| `.scrollbar_custom` | 웹킷 스크롤바 커스텀                              |
| `.scrollLock`       | `overflow: hidden`, `touch-action: none` |

### 24.3 Motion

| 클래스               | 의미                   |
|-------------------|----------------------|
| `.anim.fade`      | 아래에서 올라오는 fade 초기 상태 |
| `.anim.fade.show` | fade 표시 상태           |
| `.hov_op`         | hover 시 opacity 변환   |

## 25. 기본 요소/접근성 클래스

### 25.1 Reset 성격

`wv.css`는 utility만 있는 파일이 아니라 reset 성격도 포함합니다.

| 대상                  | 현재 기본 동작                                         |
|---------------------|--------------------------------------------------|
| `*`                 | margin/padding 초기화, box-sizing 적용                |
| `html`, `#wv`       | `font-size: 62.5%`                               |
| `body`              | `font-size: var(--fs_body)`                      |
| `a`                 | `text-decoration: none`, `display: inline-block` |
| `button`            | border/background 제거                             |
| `input`, `textarea` | appearance 초기화                                   |
| `img`, `picture`    | block 처리                                         |

### 25.2 접근성 클래스

| 클래스/셀렉터                        | 의미       |
|--------------------------------|----------|
| `#skipNav`                     | 스킵 내비게이션 |
| `.a11y-hidden`                 | 시각적 숨김   |
| `.a11y-hidden.focusable:focus` | 포커스 시 복원 |

## 26. 현재 클래스 네이밍 규칙 요약

| 카테고리              | 규칙                           |
|-------------------|------------------------------|
| Display           | `dp_*`                       |
| Flex direction    | `fd_*`                       |
| Align             | `al_*`                       |
| Justify           | `jtf_*`                      |
| Gap               | `gap*`                       |
| Margin/Padding    | `m?/p?_*`                    |
| Typography size   | `fs_*`                       |
| Typography weight | `fw_*`                       |
| Line-height       | `lih*`                       |
| Width/Height      | `w_*`, `h_*`, `mw_*`, `mh_*` |
| Radius            | `rd_*`                       |
| Position          | `pos_*`                      |
| Opacity           | `op_*`                       |
| Z-index           | `z_idx*`                     |
| Text color        | `fc_*`                       |
| Background color  | `bgc_*`                      |
| Mobile prefix     | `md_*`                       |
| Tablet prefix     | `tb_*`                       |

## 27. 빠르게 찾는 예시

| 목적            | 사용할 클래스 예시                                   |
|---------------|----------------------------------------------|
| 가로 100%       | `.w_full`                                    |
| 높이 100%       | `.h_full`                                    |
| 모바일에서만 block  | `.md_dp_b`                                   |
| 2줄 말줄임        | `.txt_over_dot.clamp2`                       |
| 가운데 정렬 flex   | `.dp_f.al_center.jtf_center` 또는 `.fd_center` |
| 20 간격 상단 마진   | `.mt_20`                                     |
| 기본 radius     | `.rd_base`                                   |
| primary 40 배경 | `.bgc_p_40`                                  |
| gray 70 텍스트   | `.fc_g_70`                                   |
| 모바일에서 숨김      | `.m_hide`                                    |

## 28. 현재 문서 기준 요약

- `common.css`는 "토큰 값 저장소"에 가깝습니다.
- `wv.css`는 "토큰을 소비하는 유틸리티/기본 스타일 레이어"입니다.
- 따라서 프로젝트 성격에 맞춰 `common.css`를 바꾸면 `wv.css` 클래스 동작값도 함께 바뀌는 구조입니다.
- 현재 클래스 체계는 `layout + utility + helper + reset + a11y`가 한 파일에 같이 들어 있는 형태입니다.
- `sizing.scss`는 현재 빌드에 포함되어 있으며, `w_*`, `h_*`, `mw_*`, `mh_*`, `w_full`, `h_full`, `tb_*`, `md_*` 계열을 제공합니다.
- 색상, 간격, 사이즈는 토큰/스케일 기반이고, 반응형은 `tb_`, `md_`, `res_*` 접두사로 분리됩니다.

## 29. 문서 작성 메모

이 문서는 현재 코드 기준 정적 정리 문서입니다. 실제 클래스 추가/삭제가 발생하면 아래 파일을 우선 재검토하면 됩니다.

- `packages/wv/src/scss/index.scss`
- `packages/wv/src/scss/common.scss`
- `packages/wv/src/scss/_objects/_layout.scss`
- `packages/wv/src/scss/_utilities/*.scss`
- `packages/wv/src/scss/_generic/*.scss`
- `packages/wv/src/scss/_motion/*.scss`
