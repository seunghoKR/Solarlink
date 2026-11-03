# 🎨 Lifety Solar Intelligence - Design System Guide (DESIGN.md)

> **Design Lead**: AI 디자인실장 영자 (Youngja) 💖  
> **Target Project**: Lifety Solar Intelligence (대한민국 태양광 부지 탐색 및 개발성 분석 플랫폼)  
> **Version**: 1.0.0  
> **Last Updated**: 2026-11-03  

---

## 1. Brand Identity & Design Philosophy

### 1.1 Core Mood: "Clean Energy Meets Intelligent GIS FinTech"
Lifety Solar Intelligence는 태양광 발전사업 부지를 다루는 전문 B2B 엔터프라이즈 솔루션입니다.
- **신뢰성 (Reliability)**: 복잡한 지적도, 계통 용량, 규제 조례 데이터를 왜곡 없이 명확하고 읽기 쉽게 전달합니다.
- **에너지와 생동감 (Vibrancy)**: 태양광 에너지의 상징인 **Amber/Gold** 액센트 컬러를 적절히 배치하여 시각적 몰입감을 높입니다.
- **직관적 가시성 (High Contrast & Visual Hierarchy)**: 3단 Split 레이아웃(검색/필터 ➔ 대형 지도 캔버스 ➔ 우측 분석 드로어)을 통해 정보 탐색과 심층 분석을 원활하게 유도합니다.

---

## 2. Color Palette & Tokens

### 2.1 Primary Brand Colors
- **Solar Amber (Primary)**: `#F59E0B` (Hover: `#D97706`, Active: `#B45309`, Light: `#FEF3C7`)
  - 핵심 액션 버튼(CTA), 선택된 필지 하이라이트, 태양광 발전량 지표.
- **Deep Navy (Brand Dark)**: `#0F172A` (Slate 900)
  - 헤더, 사이드바, 전문적인 엔터프라이즈 배경.
- **Surface Slate (Card/Panel)**: `#1E293B` (Slate 800) / Border: `#334155` (Slate 700)
  - 다크 테마 카드 배경 및 팝업 드로어.

### 2.2 Semantic & Status Colors
- **Success (예비 적합 / 계통 양호)**: `#10B981` (Emerald 500) / Light: `#ECFDF5`
- **Warning (조건부 협의 / 지자체 심의)**: `#FBBF24` (Amber 400) / Light: `#FFFBEB`
- **Danger (규제 저촉 / 급경사 / 계통 포화)**: `#EF4444` (Rose 500) / Light: `#FEF2F2`
- **Info (추가 확인 / 데이터 미입수)**: `#60A5FA` (Blue 400) / Light: `#EFF6FF`

---

## 3. Typography & Layout System

### 3.1 Typography
- **Font Family**: `Pretendard`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, sans-serif
- **Scale**:
  - `Display / KPI`: 28px ~ 36px (Bold 700)
  - `Header 1 (Page Title)`: 20px ~ 24px (SemiBold 600)
  - `Header 2 (Section Title)`: 16px ~ 18px (SemiBold 600)
  - `Body / Data Table`: 13px ~ 14px (Regular 400, Medium 500)
  - `Micro Label / Badges`: 11px ~ 12px (Medium 500, SemiBold 600)

### 3.2 3-Pane Responsive Layout
1. **Left Filter Rail (340px ~ 380px)**:
   - 최소/최대 평수 슬라이더 및 직접 입력
   - 지목 칩(다중선택: 임야, 전, 답, 잡종지 등)
   - 용도지역, 경사도, 이격거리 필터
   - 검색 결과 리스트 및 가상 스크롤
2. **Center Map Viewport (Flexible 100%)**:
   - Leaflet / MapLibre 타일 캔버스
   - 시도/시군구 클러스터 뱃지
   - 필지 폴리곤, 규제 버퍼(주거지 200m, 도로 100m) 오버레이
   - 지도 컨트롤(위성/일반 뷰 토글, 확대/축소, 범례)
3. **Right Slide-over Drawer (420px ~ 480px)**:
   - 선택된 필지 PNU 및 기본 정보 (공부면적, 환산평수, 지목, 공시지가)
   - 규제 & 조례 체크리스트 (적합/조건부/제한 사유)
   - 한전 계통 연계 진단 (관할 변전소/DL, 공개 여유용량)
   - 경제성 퀵 시뮬레이터 (추정 설비용량 kW, 연간 발전량, 예상 IRR/NPV)
   - 리포트 인쇄/내보내기 액션 버튼

---

## 4. UI Components Specification

- **Badge & Status Tag**: 둥근 모서리(`rounded-full`), 미세한 테두리(`border`), 배경 투명도 15% 적용으로 세련된 표현.
- **Glassmorphism Overlay**: 지도 위의 컨트롤러 패널은 `backdrop-blur-md bg-slate-900/80 border border-slate-700/60` 적용.
- **Number & Metric Formatting**:
  - 모든 면적은 `OOO평 (OOO㎡)` 동시 표기
  - 숫자는 3자리 콤마(`1,250 kWp`, `420,000,000원`)
  - 백분율은 소수점 1자리(`IRR 8.7%`)
