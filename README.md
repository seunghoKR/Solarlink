# ☀️ Lifety Solar Intelligence (v1.0.0 Official Release)
> **대한민국 No.1 AI 태양광 부지 발굴 & 사업성 분석 올인원 인텔리전스 플랫폼**  
> **Official Service**: [https://re100life.com](https://re100life.com) (www.re100life.com)

---

## 🌟 핵심 신규 기능 (v1.0.0)

### 1. ⚡ [re100market 특화] 한전 154kV 전력계통망 & 주변 3대 배전선로(DL) 시각화
* **지도 상 가상 인입선로 (Polyline)**: 부지 선택 시 관할 154kV 변전소까지 **청록색 점선(인입선)** 및 **변전소 핀 마커** 실시간 연계 시각화.
* **주변 연계 3대 배전선로(DL) 체크**: 선로명, 여유용량(MW), 연계거리(km), 한전 표준 인입공사비(만원) 정밀 산출 및 M.Tr(주변압기) 용량 진단.

### 2. 🏢 [disco.re 특화] 토지 실거래 시세 & 도로접면(맹지 판정) 프롭테크
* **인근 1km 최근 3년 실거래가**: 국토교통부 실거래 기반 평당 단가 분석 및 부지 면적 맞춤 **추정 토지 매입총액(억원)** 자동 계산.
* **도로 접면 및 맹지 판정**: 폭 4m 농로, 2차선 아스팔트, 맹지 여부를 즉시 판정하여 개발행위허가 인허가 리스크 사전 차단.
* **공적장부 소유구분**: 개인 사유지, 법인, 종중, 국공유지 분류.

### 3. 📑 5대 전문 상세 드로어 (DetailDrawer)
* 스크롤바 없이 한눈에 들어오는 균등 5대 탭 UI:
  1. ⚖️ **규제·조례**: 주거/도로 이격거리, 표고 경사도, 보전구역 중첩
  2. ⚡ **배전·계통**: 154kV 변전소, M.Tr 잔여, 주변 3대 배전선로 현황표
  3. 🏢 **실거래가**: 디스코 실거래 평당가, 매입총액, 도로접면, 소유구분
  4. ☀️ **일사·발전**: 연평균 일사량, 설비용량(kWp), 연간 발전량(MWh)
  5. 📈 **수익분석**: CAPEX 투자비, 연매출, IRR(%), 투자회수기간

### 4. 📄 공식 A4 사전 타당성 검토 보고서 (PDF 출력)
* 브라우저 인쇄(`Ctrl+P`) 최적화 A4 백색 공식 보고서 시트 내보내기 지원.
* 금융기관, 지자체, 투자자 제출용 고품격 인텔리전스 브리핑 시트 자동 생성.

---

## 🌟 주요 마일스톤 업데이트 (v1.1.0 - 2026-11-05)

1. **국토교통부 브이월드(VWorld) 실시간 공인 지적도 1:1 완벽 연동**
   - 가짜 폴리곤/모의 좌표 완전 제거 및 국토부 공인 법정 지번 좌표 실시간 동기화.
   - 브라우저 CORS 회피를 위한 정밀 JSONP 통신 파이프라인 전면 구축.
2. **연속지적도 100% 가시 보장 줌 락 & 자동 줌인 (17.5x ~ 19.0x)**
   - VWorld WMS 타일 응답 임계 배율(17.5x) 과학적 측정 및 지적도 토글 시 18.0x 자동 줌인.
   - 지적도가 사라지지 않도록 최소 줌(17.5x) 안전 락 및 정밀 슬라이더 컨트롤러 탑재.
3. **타일 투영 엔진 최적화 및 렌더링 무결성 확보**
   - WMS CRS 문자열 충돌 버그(`n.project is not a function`) 및 React 19 지도 생명주기 충돌 완전 해결.
4. **사용자 경험(UX) 극대화: 최근 검색지 기억 & 실시간 라이브 필터링**
   - 로그인 시 가장 최근 검색/분석 부지로 지도가 자동 오픈되며, 신규 사용자에겐 전국 유망 추천 부지 신선 제공.
   - 지목 선택 칩 클릭 시 즉시 0.001초 만에 결과가 바뀌는 실시간(Live) 필터링 및 북마크 모드 안내 배너 제공.

---

## 🛠️ 기술 스택 (Tech Stack)
* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Leaflet / React-Leaflet
* **Charts & Icons**: Recharts, Lucide React
* **GIS Engine**: 국토교통부 브이월드 (Base / Satellite / Topo), OpenStreetMap, ESRI
* **Deployment**: iwinv 고속 웹호스팅, SSL 자동 301 리다이렉트, Synology NAS 백업

---

## 🚀 빠른 시작 가이드 (Quick Start)

### 로컬 실행
```bash
cd frontend
npm install
npm run dev
```

### 운영 배포 (FTP)
```powershell
powershell -ExecutionPolicy Bypass -File deploy_ftp.ps1
```

---
**Created with AI Solopreneur Agent '영자 (Youngja)' & Seung-ho Lee**
