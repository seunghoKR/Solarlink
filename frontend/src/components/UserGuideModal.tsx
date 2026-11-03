import React from 'react';
import {
  X,
  BookOpen,
  Search,
  Filter,
  TrendingUp,
  MousePointerClick,
  FileText,
  History,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
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
                  v1.0.0 Official
                </span>
              </div>
              <p className="text-xs text-slate-400">
                실시간 지적 분석부터 부지 발굴, 전면 동기화, 공식 A4 PDF 보고서 출력까지 완벽 가이드
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed custom-scrollbar">
          {/* 🌟 최근 대규모 업데이트 핵심 기능 하이라이트 (NEW) */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/15 via-slate-800/80 to-slate-900 border border-amber-500/40 shadow-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="font-extrabold text-amber-300 text-sm tracking-wide">
                🚀 최근 업데이트된 핵심 개선 기능 4가지
              </h4>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {/* 1. 마우스 우클릭 지적 분석 */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-700/80">
                <span className="font-bold text-white text-xs flex items-center text-amber-400 mb-1">
                  <MousePointerClick className="w-4 h-4 mr-1.5 text-amber-400 shrink-0" />
                  1. 지도 마우스 우클릭 즉시 지적 분석
                </span>
                <p className="text-[11px] text-slate-300 leading-normal">
                  지도 임의 지점을 <strong>마우스 우클릭</strong>하면 국토부 브이월드 연속지적도와 연동되어 <strong>정확한 한글 지번/도로명 주소, 공부 지목, 추정 평수(㎡), 한전 여유용량</strong>이 고대비 팝업창에 즉시 분석됩니다.
                </p>
              </div>

              {/* 2. 전면 동기화 (새 선택지 일괄 전환) */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-700/80">
                <span className="font-bold text-white text-xs flex items-center text-emerald-400 mb-1">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400 shrink-0" />
                  2. 화면 모든 섹션 원클릭 전면 동기화
                </span>
                <p className="text-[11px] text-slate-300 leading-normal">
                  우클릭 후 <strong>[이 부지 정밀 분석하기]</strong>를 클릭하면 이전 검색 잔상(파란 폴리곤)이 완전히 삭제되고, <strong>상단 검색창, 좌측 목록 1순위, 우측 4대 진단, 최근 검색 DB</strong>까지 새 선택지로 일괄 전면 전환됩니다.
                </p>
              </div>

              {/* 3. A4 공식 인쇄 / PDF 보고서 */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-700/80">
                <span className="font-bold text-white text-xs flex items-center text-sky-400 mb-1">
                  <FileText className="w-4 h-4 mr-1.5 text-sky-400 shrink-0" />
                  3. 관공서·금융기관 제출용 A4 PDF 보고서
                </span>
                <p className="text-[11px] text-slate-300 leading-normal">
                  우클릭 팝업 또는 상세 드로어의 <strong>[분석 보고서 (PDF)]</strong>를 누르면 다크 UI 캡처가 아닌, <strong>인쇄 전용 백색 A4 규격의 공식 사업성 평가 보고서</strong>가 즉시 생성되어 원클릭 인쇄 및 PDF 저장이 가능합니다.
                </p>
              </div>

              {/* 4. 최근 검색어 DB & 3단 지도 제어 */}
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-700/80">
                <span className="font-bold text-white text-xs flex items-center text-purple-400 mb-1">
                  <History className="w-4 h-4 mr-1.5 text-purple-400 shrink-0" />
                  4. 최근 검색어 SaaS 히스토리 & 3단 지도
                </span>
                <p className="text-[11px] text-slate-300 leading-normal">
                  검색창 클릭 시 <strong>최근 검색/분석했던 지역 목록</strong>이 표출되어 1초 만에 재방문할 수 있으며, 휠 줌에도 사라지지 않는 <strong>[일반지도/위성지도/지형지도]</strong> 컨트롤러 및 외곽선 투명도 조절 기능을 지원합니다.
                </p>
              </div>
            </div>
          </div>

          {/* 핵심 질문 Q&A */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-2 flex items-center">
              <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded mr-2 text-[11px] font-black">
                Q&A
              </span>
              이 플랫폼은 어떻게 쓰는 건가요? (3가지 핵심 활용법)
            </h4>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-slate-800/60 p-3.5 rounded-lg border border-slate-700/60">
                <span className="font-bold text-white block mb-1 text-xs flex items-center text-amber-400">
                  <Search className="w-3.5 h-3.5 mr-1.5 shrink-0" /> 1. 특정 주소/지번 판가름
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  내가 알고 있는 토지 주소(예: <code>기지로 180</code>, <code>만성동 1345-1</code>)를 상단 검색창에 넣고 <strong>[검색]</strong>을 누르면, 지적 경계와 함께 조례 및 계통 가능 여부를 즉석 판정합니다.
                </p>
              </div>
              <div className="bg-slate-800/60 p-3.5 rounded-lg border border-slate-700/60">
                <span className="font-bold text-white block mb-1 text-xs flex items-center text-emerald-400">
                  <Filter className="w-3.5 h-3.5 mr-1.5 shrink-0" /> 2. 평수 조건으로 부지 발굴
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  좌측에서 <strong>원하는 평수(예: 1,000평~5,000평)</strong>, 지목, 변전소 용량을 설정하고 <strong>[부지 조건 검색]</strong>을 누르면 조건에 부합하는 알짜 필지를 지도에 찾아줍니다.
                </p>
              </div>
              <div className="bg-slate-800/60 p-3.5 rounded-lg border border-slate-700/60">
                <span className="font-bold text-white block mb-1 text-xs flex items-center text-sky-400">
                  <MousePointerClick className="w-3.5 h-3.5 mr-1.5 shrink-0" /> 3. 지도 우클릭 즉시 진단
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  지도를 보다가 관심 가는 산이나 들판이 보이면 <strong>마우스 우클릭</strong>만 하세요. 국토부 지적 정보를 실시간 조회해 주소와 면적을 즉시 뽑아냅니다.
                </p>
              </div>
            </div>
          </div>

          {/* 💡 태양광 수익 분석 공학적/금융적 산출 기준 안내 */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-2.5">
            <h4 className="font-bold text-amber-300 text-sm flex items-center">
              <TrendingUp className="w-4 h-4 mr-1.5 text-amber-400" />
              💡 [수익 분석] 탭의 5대 공학적·금융적 산출 기준
            </h4>
            <div className="grid md:grid-cols-2 gap-2.5 text-xs text-slate-300">
              <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                <strong className="text-slate-100 block mb-0.5">1. 설비용량 (kWp)</strong>
                부지 면적의 <strong>80% 유효 가용율</strong> 기준, 고효율 580W 모듈 및 최적 어레이 간격 기준 <strong>14㎡당 1 kWp</strong> 설치.
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                <strong className="text-slate-100 block mb-0.5">2. 일평균 발전 시간</strong>
                기상청 및 KIER(한국에너지기술연구원) 10개년 실측치 기반 호남·충남 <strong>일평균 3.75시간</strong> (연간 1,368.75h) 적용.
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                <strong className="text-slate-100 block mb-0.5">3. 총 투자비 (CAPEX)</strong>
                <strong>kWp당 125만원</strong> (모듈·인버터 45만, 포스맥 구조물·토목 35만, 한전 계통연계·전기 30만, 인허가·감리 15만).
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800">
                <strong className="text-slate-100 block mb-0.5">4. 예상 매출 & 운영비</strong>
                SMP 130원 + REC 70원 (<strong>170원/kWh</strong> 정산 단가), 연간 운영비는 총 CAPEX의 <strong>1.8%</strong> (보험, 안전관리, 충당금).
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              * 프로젝트 IRR 및 투자 회수기간은 15개년 현금흐름할인법(DCF, 연 0.5% 모듈 열화율, 물가상승률 2%, 할인율 4.5%)을 적용합니다.
            </p>
          </div>

          {/* 3단계 상세 이용 절차 */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-2">
              📌 단계별 상세 이용 절차
            </h4>

            {/* Step 1 */}
            <div className="flex items-start space-x-3 bg-slate-800/40 p-3.5 rounded-lg border border-slate-700/40">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h5 className="font-bold text-slate-100 text-xs mb-1">
                  주소 검색, 최근 검색어 선택 또는 좌측 정밀 조건 검색
                </h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  • <strong>상단 주소창</strong>: 지번 주소 또는 도로명 주소를 입력하고 <strong>[검색]</strong>을 누르세요. 최근 검색창을 클릭하면 과거 검색했던 부지가 바로 나타납니다.<br />
                  • <strong>좌측 정밀 조건</strong>: 희망 평수(최소~최대), 지목, 용도지역, 변전소 용량을 설정하고 황금색 <strong>[부지 조건 검색]</strong>을 클릭하세요.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-3 bg-slate-800/40 p-3.5 rounded-lg border border-slate-700/40">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h5 className="font-bold text-slate-100 text-xs mb-1">
                  지도 인터랙션 & 마우스 우클릭으로 지적 실시간 판정
                </h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  • 지도 상의 부지 폴리곤을 클릭하거나, 관심 있는 임의 지점을 <strong>마우스 우클릭</strong>하세요.<br />
                  • <strong>우측 상단 3단 지도</strong>: 휠 줌을 조작해도 항상 고정되는 컨트롤러에서 <strong>[일반지도 / 위성지도 / 지형지도]</strong>를 자유롭게 전환할 수 있습니다.<br />
                  • <strong>GIS 레이어</strong>: 필요에 따라 필지 외곽선만 보기 또는 이격거리 완충 원형 버퍼(주거 200m / 도로 100m)를 체크하여 켤 수 있습니다.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-3 bg-slate-800/40 p-3.5 rounded-lg border border-slate-700/40">
              <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h5 className="font-bold text-slate-100 text-xs mb-1">
                  우측 4대 정밀 진단 확인 & 공식 A4 PDF 보고서 원클릭 발행
                </h5>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                  우측 서랍에서 <strong>규제·조례 판정 / 한전 계통 연계 / 일사·발전량 / 수익 시뮬레이터</strong>를 한눈에 검토하세요.
                </p>
                <div className="bg-amber-500/10 p-2.5 rounded border border-amber-500/20 text-[11px] text-amber-200">
                  💡 <strong>[분석 보고서 (PDF)]</strong> 버튼을 클릭하면, 지적도와 4대 진단 및 수익성 지표가 완벽하게 정돈된 공식 A4 규격 보고서가 열리며 바로 인쇄 및 PDF 다운로드가 가능합니다.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
            Lifety Solar Intelligence v2.0 (실시간 연속지적도 & A4 PDF 엔진 탑재)
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
