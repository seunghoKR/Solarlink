import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Search,
  Filter,
  TrendingUp,
  MousePointerClick,
  FileText,
  Sparkles,
  Zap,
  MapPin,
  Layers,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GuideTabId = 'new_features' | 'map_interaction' | 'search_filter' | 'diagnosis_5' | 'report_faq';

interface GuideTabItem {
  id: GuideTabId;
  label: string;
  badge?: string;
  icon: React.ReactNode;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<GuideTabId>('new_features');

  if (!isOpen) return null;

  const tabs: GuideTabItem[] = [
    {
      id: 'new_features',
      label: 'v1.2 신기능',
      badge: '100만 풀',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'map_interaction',
      label: '지도 & 지적분석',
      icon: <MousePointerClick className="w-4 h-4 text-sky-400" />,
    },
    {
      id: 'search_filter',
      label: '조건 검색 & 발굴',
      icon: <Filter className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'diagnosis_5',
      label: '5대 정밀 진단',
      icon: <TrendingUp className="w-4 h-4 text-purple-400" />,
    },
    {
      id: 'report_faq',
      label: 'A4 보고서 & FAQ',
      icon: <FileText className="w-4 h-4 text-rose-400" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-slate-800/95 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shadow-inner">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white">Lifety Solar Intelligence 종합 이용 가이드</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-extrabold">
                  v1.2.0 Official
                </span>
              </div>
              <p className="text-xs text-slate-400">
                전국 100만 건 AI 유효부지 전수 인덱스부터 실시간 지적 분석, 계통 연계, A4 보고서 출력까지 완벽 가이드
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            title="가이드 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 🌟 대표님 요청: 주제별 탭 메뉴 바 (Tab Navigation) */}
        <div className="bg-slate-950/80 px-4 pt-2 border-b border-slate-800 flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-3.5 rounded-t-lg text-xs font-bold flex items-center space-x-2 transition cursor-pointer border-t border-x whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 border-slate-700 text-amber-400 border-b-2 border-b-slate-900 shadow-sm'
                    : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-300 leading-relaxed custom-scrollbar flex-1 bg-slate-900/60">
          
          {/* TAB 1: v1.2 신기능 (100만 풀 & 4대 컷오프) */}
          {activeTab === 'new_features' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/15 via-slate-800/80 to-slate-900 border border-amber-500/40 shadow-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h4 className="font-extrabold text-amber-300 text-sm tracking-wide">
                    🚀 v1.2.0 전국 100만 건 AI 유효부지 전수 인덱스 런칭
                  </h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  대한민국 전체 3,950만 필지 중 4대 비효율(맹지, 급경사, 음영, 계통포화)을 배제한 <strong className="text-amber-300">약 100만 개의 진짜 유효 부지 풀</strong>을 지도 줌 레벨에 따라 지능형으로 시각화합니다.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-3.5">
                {/* 1. 전국 100만 건 줌 적응형 클러스터링 */}
                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/70 space-y-1.5">
                  <span className="font-bold text-white text-xs flex items-center text-amber-400">
                    <MapPin className="w-4 h-4 mr-1.5 text-amber-400 shrink-0" />
                    1. 초광역 줌 (Lv 6~9) 시도별 100만 클러스터 마커
                  </span>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    전국 지도를 축소하면 <strong>전남 24.5만건, 경북 21.8만건</strong> 등 시도별 유효부지 총량이 골드 글로우 버블로 표출됩니다. 마커를 클릭하면 부드럽게 줌인(FlyTo)하여 세부 지역으로 이동합니다.
                  </p>
                </div>

                {/* 2. 4대 스마트 컷오프 제외 필터 */}
                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/70 space-y-1.5">
                  <span className="font-bold text-white text-xs flex items-center text-rose-400">
                    <Filter className="w-4 h-4 mr-1.5 text-rose-400 shrink-0" />
                    2. 4대 스마트 컷오프 (비효율 부지 일괄 제외)
                  </span>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    <strong>[스마트 고효율 알짜 부지만 보기]</strong> 스위치 또는 4대 제외 칩(🚫 맹지 제외, 🚫 급경사 15°+ 제외, 🚫 북향/음영 제외, 🚫 계통포화 제외)을 켜면 0.001초 만에 인허가 불가 땅이 싹 걸러집니다.
                  </p>
                </div>

                {/* 3. 지도 줌 레벨 완전 개방 (6.0x ~ 19.0x) */}
                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/70 space-y-1.5">
                  <span className="font-bold text-white text-xs flex items-center text-sky-400">
                    <Layers className="w-4 h-4 mr-1.5 text-sky-400 shrink-0" />
                    3. 지도 줌 제한 완전 해제 & 부드러운 스케일 조절
                  </span>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    전국 전역 조망(6.0x)부터 초정밀 지적 상세(19.0x)까지 마우스 휠, 수직 슬라이더, +/- 버튼으로 걸림돌 없이 자유롭게 확대/축소하며 탐색할 수 있습니다.
                  </p>
                </div>

                {/* 4. 실시간 BBOX 국토부 실필지 발굴 */}
                <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/70 space-y-1.5">
                  <span className="font-bold text-white text-xs flex items-center text-emerald-400">
                    <Zap className="w-4 h-4 mr-1.5 text-emerald-400 shrink-0" />
                    4. 현재 화면 영역 국토부 실필지 실시간 발굴
                  </span>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    원하는 지역으로 지도를 이동한 뒤 <strong>[📡 현재 지도 영역 국토부 실필지 발굴]</strong> 버튼을 누르면, 국토부(VWorld) WFS 서버와 실시간 통신하여 화면 내 진짜 실필지를 긁어와 목록에 추가합니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 지도 & 지적분석 */}
          {activeTab === 'map_interaction' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/80 space-y-3">
                <h4 className="font-bold text-slate-100 text-sm flex items-center text-amber-400">
                  <MousePointerClick className="w-4 h-4 mr-2" />
                  1. 지도 마우스 우클릭 즉시 지적 분석
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  지도를 보시다가 관심 있는 산, 들판, 농지 등 임의의 땅을 <strong>마우스 우클릭</strong>하세요!
                </p>
                <div className="grid md:grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
                    <strong className="text-amber-300 block font-semibold">• 실시간 지적 정보 추출</strong>
                    <p className="text-slate-400 text-[11px]">
                      국토부 연속지적도(VWorld)와 연동되어 정확한 도로명/지번 주소, 지목(전/답/임야/잡종지), 추정 평수(㎡), 한전 여유용량이 팝업에 즉시 출력됩니다.
                    </p>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
                    <strong className="text-emerald-300 block font-semibold">• 화면 전면 동기화 (Sync)</strong>
                    <p className="text-slate-400 text-[11px]">
                      우클릭 팝업에서 <strong>[이 부지 정밀 분석하기]</strong>를 클릭하면 상단 주소창, 좌측 1순위, 우측 5대 정밀 진단까지 새 선택지로 즉시 일괄 전환됩니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/80 space-y-3">
                <h4 className="font-bold text-slate-100 text-sm flex items-center text-sky-400">
                  <Layers className="w-4 h-4 mr-2" />
                  2. 3단 지도 모드 및 GIS 레이어 제어
                </h4>
                <div className="grid md:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <strong className="text-slate-100 block mb-1">🗺️ 3단 지도 전환</strong>
                    우측 상단 컨트롤러에서 <strong>[일반지도 / 위성지도 / 지형지도]</strong>를 자유롭게 전환하며 경사도와 음영을 입체적으로 검토할 수 있습니다.
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <strong className="text-slate-100 block mb-1">📐 지적경계선 (WMS)</strong>
                    17배율 이상 확대 시 국토부 공인 연속지적도 주황색 필지 경계선이 자동으로 오버레이됩니다.
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <strong className="text-slate-100 block mb-1">⭕ 이격거리 완충 버퍼</strong>
                    주거지(200m) 및 도로(100m) 완충 원형 버퍼를 활성화하여 조례 규제 침범 여부를 시각적으로 확인할 수 있습니다.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 조건 검색 & 발굴 */}
          {activeTab === 'search_filter' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/80 space-y-3">
                <h4 className="font-bold text-slate-100 text-sm flex items-center text-emerald-400">
                  <Search className="w-4 h-4 mr-2" />
                  1. 주소 직접 검색 & 최근 검색어 드롭다운
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  상단 검색창에 알고 계신 지번이나 도로명 주소(예: <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">기지로 180</code>, <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">초송리 345-3</code>)를 입력하고 엔터를 치시면 해당 부지의 지적도와 5대 진단 결과를 즉시 판정합니다. 검색창을 클릭하면 과거 검색했던 부지가 드롭다운으로 즉시 재호출됩니다.
                </p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/80 space-y-3">
                <h4 className="font-bold text-slate-100 text-sm flex items-center text-amber-400">
                  <Filter className="w-4 h-4 mr-2" />
                  2. 좌측 패널 정밀 조건 검색 가이드
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start space-x-2 bg-slate-900/70 p-2.5 rounded-lg border border-slate-800">
                    <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200">희망 면적 (평수) 자유 설정</strong>: 100평 이상 원하는 평수(예: 500평, 1,200평 등)를 직접 입력하거나 프리셋 버튼(5천~1만, 1만~3만, 3만평+)을 클릭하세요.
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 bg-slate-900/70 p-2.5 rounded-lg border border-slate-800">
                    <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200">지목 8대 다중선택</strong>: 대지, 잡종지, 임야, 전, 답, 과수원, 목장용지, 염전을 자유롭게 켜고 끌 수 있습니다.
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 bg-slate-900/70 p-2.5 rounded-lg border border-slate-800">
                    <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-200">변전소 최소 여유용량</strong>: 한전 계통 연계가 즉시 가능한 최소 잔여 MW 슬라이더를 조절하여 계통 여유가 충분한 부지만 선별합니다.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 5대 정밀 진단 & 사업성 분석 */}
          {activeTab === 'diagnosis_5' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/80 space-y-3">
                <h4 className="font-bold text-purple-300 text-sm flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-purple-400" />
                  우측 상세 드로어(DetailDrawer) 5대 전문 탭 분석 기준
                </h4>

                <div className="grid md:grid-cols-2 gap-3 text-xs">
                  {/* 1. 규제·조례 */}
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
                    <strong className="text-amber-400 flex items-center font-semibold">
                      ⚖️ 1. 규제·조례 진단
                    </strong>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      해당 지자체 도시계획조례 기준 주거지(인근 인가 200m) 및 도로(100m) 이격거리 저촉 여부, 표고 및 경사도(산지관리법 15° 이하 판정) 적합도를 진단합니다.
                    </p>
                  </div>

                  {/* 2. 배전·계통 */}
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
                    <strong className="text-cyan-400 flex items-center font-semibold">
                      ⚡ 2. 배전·전력계통망
                    </strong>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      관할 154kV 변전소까지의 가상 인입선(청록색 점선), M.Tr(주변압기) 잔여용량, 주변 3대 배전선로(DL)의 여유 MW 및 표준 인입공사비를 자동 산출합니다.
                    </p>
                  </div>

                  {/* 3. 토지 실거래가 */}
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
                    <strong className="text-emerald-400 flex items-center font-semibold">
                      🏢 3. 토지 실거래 시세 & 도로접면
                    </strong>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      인근 1km 최근 3개년 국토부 실거래가 기반 평당 단가 및 추정 토지 매입총액, 도로 접면(폭 4m 포장로/아스팔트/맹지 판정), 공적장부 소유구분을 분류합니다.
                    </p>
                  </div>

                  {/* 4. 일사·발전량 */}
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
                    <strong className="text-amber-300 flex items-center font-semibold">
                      ☀️ 4. 일사량 & 연간 발전량
                    </strong>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      KIER 10개년 실측 일평균 3.75시간 기준 유효 가용 면적(80%)에 최적화된 설비용량(kWp)과 연간 예상 발전량(MWh)을 도출합니다.
                    </p>
                  </div>
                </div>

                {/* 5. 금융 수익 시뮬레이터 */}
                <div className="bg-slate-900/90 p-3.5 rounded-lg border border-slate-700/80 space-y-1.5 mt-2">
                  <strong className="text-rose-400 flex items-center font-semibold text-xs">
                    📈 5. 금융 수익성 시뮬레이션 공학적 산출 기준
                  </strong>
                  <div className="grid md:grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                    <div>• <strong>총 투자비(CAPEX)</strong>: kWp당 125만원 (모듈/인버터 45만, 토목/구조물 35만, 계통/전기 30만, 감리/인허가 15만)</div>
                    <div>• <strong>정산 단가</strong>: SMP 130원 + REC 70원 = 170원/kWh</div>
                    <div>• <strong>연간 운영비(OPEX)</strong>: 총 CAPEX의 1.8% (보험, 정기점검, 시설관리)</div>
                    <div>• <strong>투자 지표</strong>: 15개년 현금흐름할인법(DCF, 열화율 0.5%, 할인율 4.5%) 기반 프로젝트 IRR(%) 및 투자회수기간 산출</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: A4 보고서 & FAQ */}
          {activeTab === 'report_faq' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/80 space-y-3">
                <h4 className="font-bold text-sky-300 text-sm flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-sky-400" />
                  1. 관공서·금융기관 제출용 공식 A4 보고서 발행
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  우클릭 팝업 또는 상세 드로어 상단의 <strong>[분석 보고서 (PDF)]</strong> 버튼을 클릭하세요!
                </p>
                <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
                  💡 단순 화면 캡처가 아닌, <strong>인쇄 전용 순백색 A4 규격의 공식 사업성 평가 보고서</strong>가 즉시 생성됩니다. 브라우저 인쇄 창(<code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">Ctrl + P</code>)에서 바로 종이 인쇄하거나 [PDF로 저장]하여 지자체, 금융기관, 발전사업자 제출용으로 활용하실 수 있습니다.
                </div>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/80 space-y-3">
                <h4 className="font-bold text-slate-100 text-sm flex items-center text-amber-400">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  2. 자주 묻는 질문 (FAQ)
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <strong className="text-slate-100 block mb-1">Q. 검색 결과에 왜 6,844건이 먼저 나오나요?</strong>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      대한민국 3,950만 필지를 브라우저에 한 번에 다 올리면 컴퓨터가 멈추기 때문에, 전국 17개 시도별 핵심 후보지 6,844건을 사전 표본으로 렉 없이 띄워둔 것입니다. 화면을 확대한 뒤 <strong>[국토부 실필지 발굴]</strong> 버튼을 누르시면 화면 내 진짜 실필지를 무제한 확장할 수 있습니다.
                    </p>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                    <strong className="text-slate-100 block mb-1">Q. 맹지나 급경사 제외를 켜면 숫자가 왜 줄어드나요?</strong>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      초기 6,844건 후보지 풀 안에는 실제 토지처럼 맹지(약 12%)와 급경사지(약 30%)가 섞여 있습니다. 4대 스마트 컷오프를 켜시면 인허가가 불가한 땅이 즉시 걸러져 실제 시공 가능한 알짜 부지만 남게 됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
            Lifety Solar Intelligence v1.2.0 (전국 100만 건 AI 유효부지 전수 인덱스 탑재)
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
