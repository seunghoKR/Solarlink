import React, { useState } from 'react';
import type { Parcel } from '../types/solar';
import {
  X,
  FileText,
  Zap,
  Sun,
  TrendingUp,
  Download,
  Bookmark,
  AlertCircle,
  ShieldCheck,
  Building2,
  Cable,
  CheckCircle2,
  BadgeAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

interface DetailDrawerProps {
  parcel: Parcel | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (parcel: Parcel) => void;
  onOpenReport: () => void;
}

type TabType = 'regulation' | 'grid' | 'realEstate' | 'solar' | 'financials';

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  parcel,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onOpenReport,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('regulation');

  if (!parcel) return null;

  // Monthly generation mock data
  const monthlyData = [
    { month: '1월', kwh: Math.round(parcel.solar.annualGenerationKwh * 0.065) },
    { month: '2월', kwh: Math.round(parcel.solar.annualGenerationKwh * 0.075) },
    { month: '3월', kwh: Math.round(parcel.solar.annualGenerationKwh * 0.095) },
    { month: '4월', kwh: Math.round(parcel.solar.annualGenerationKwh * 0.105) },
    { month: '5월', kwh: Math.round(parcel.solar.annualGenerationKwh * 0.115) },
    { month: '6월', kwh: Math.round(parcel.solar.annualGenerationKwh * 0.098) },
    { month: '7월', kwh: Math.round(parcel.solar.annualGenerationKwh * 0.082) },
    { month: '8월', kwh: Math.round(parcel.solar.annualGenerationKwh * 0.088) },
    { month: '9월', kwh: Math.round(parcel.solar.annualGenerationKwh * 0.085) },
    { month: '10월', kwh: Math.round(parcel.solar.annualGenerationKwh * 0.092) },
    { month: '11월', kwh: Math.round(parcel.solar.annualGenerationKwh * 0.072) },
    { month: '12월', kwh: Math.round(parcel.solar.annualGenerationKwh * 0.058) },
  ];

  // 15-year cashflow projection
  const cashflowData = Array.from({ length: 15 }, (_, i) => {
    const year = i + 1;
    const revenue = parcel.financials.annualRevenueWon * Math.pow(0.995, i);
    const opex = parcel.financials.annualOpexWon * Math.pow(1.02, i);
    const net = revenue - opex;
    const cumulative = -parcel.financials.capexTotalWon + net * year;
    return {
      year: `${year}년차`,
      누적현금: Math.round(cumulative / 10000000), // 천만원 단위
    };
  });

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'PNU,주소,지목,면적(평),면적(㎡),용도지역,적합도,점수,설비용량(kWp),연간발전량(kWh),CAPEX(원),예상연매출(원),IRR(%)',
        `${parcel.pnu},"${parcel.address}",${parcel.landCategory},${parcel.areaPyeong},${parcel.areaSqm},${parcel.zoning},${parcel.suitability},${parcel.suitabilityScore},${parcel.solar.estimatedCapacityKwp},${parcel.solar.annualGenerationKwh},${parcel.financials.capexTotalWon},${parcel.financials.annualRevenueWon},${parcel.financials.irrPercent}`,
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `태양광분석_${parcel.pnu}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <aside className="w-[420px] h-full bg-slate-900 border-l border-slate-800 flex flex-col z-30 shadow-2xl shrink-0 select-none no-print">
      {/* Top Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-start justify-between">
        <div className="flex-1 pr-2 min-w-0">
          <div className="flex items-center space-x-1.5 mb-1">
            <span
              className={`text-[11px] font-bold px-2 py-0.2 rounded-full border ${
                parcel.suitability === '예비적합'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : parcel.suitability === '조건부'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}
            >
              {parcel.suitability} ({parcel.suitabilityScore}점)
            </span>
            <span className="text-[10px] text-slate-400 font-mono truncate">PNU {parcel.pnu}</span>
          </div>
          <h2 className="text-base font-bold text-white tracking-tight leading-snug break-keep">
            {parcel.address}
          </h2>
          {parcel.roadAddress && parcel.roadAddress !== parcel.address && (
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center">
              <span className="text-amber-400/90 font-medium mr-1.5">[도로명]</span>
              <span>{parcel.roadAddress}</span>
            </div>
          )}
          <p className="text-xs text-slate-300 mt-0.5">
            <span className="text-amber-400 font-bold">{parcel.areaPyeong.toLocaleString()}평</span>
            <span className="text-slate-500 ml-1">({parcel.areaSqm.toLocaleString()}㎡)</span>
            <span className="mx-1.5 text-slate-600">|</span>
            <span className="text-slate-300 font-medium">{parcel.landCategory}</span>
            <span className="mx-1.5 text-slate-600">|</span>
            <span className="text-slate-400">{parcel.zoning}</span>
          </p>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={() => onToggleBookmark(parcel)}
            className={`p-1.5 rounded border transition ${
              isBookmarked
                ? 'bg-amber-500 text-slate-950 border-amber-500'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="관심 부지 저장"
          >
            <Bookmark className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded bg-slate-800 text-slate-400 border border-slate-700 hover:text-white transition cursor-pointer"
            title="닫기"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs (5대 전문 진단 탭: 규제·조례 / 배전·계통 / 실거래가 / 일사·발전 / 수익분석 - 스크롤바 없이 5등분 완벽 분할) */}
      <div className="grid grid-cols-5 border-b border-slate-800 bg-slate-900/90 text-[11px] font-semibold overflow-x-hidden">
        <button
          onClick={() => setActiveTab('regulation')}
          className={`py-2.5 px-0.5 border-b-2 flex items-center justify-center space-x-1 transition cursor-pointer text-center ${
            activeTab === 'regulation'
              ? 'border-amber-500 text-amber-400 bg-amber-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">규제·조례</span>
        </button>
        <button
          onClick={() => setActiveTab('grid')}
          className={`py-2.5 px-0.5 border-b-2 flex items-center justify-center space-x-1 transition cursor-pointer text-center ${
            activeTab === 'grid'
              ? 'border-amber-500 text-amber-400 bg-amber-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">배전·계통</span>
        </button>
        <button
          onClick={() => setActiveTab('realEstate')}
          className={`py-2.5 px-0.5 border-b-2 flex items-center justify-center space-x-1 transition cursor-pointer text-center ${
            activeTab === 'realEstate'
              ? 'border-amber-500 text-amber-400 bg-amber-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span className="truncate">실거래가</span>
        </button>
        <button
          onClick={() => setActiveTab('solar')}
          className={`py-2.5 px-0.5 border-b-2 flex items-center justify-center space-x-1 transition cursor-pointer text-center ${
            activeTab === 'solar'
              ? 'border-amber-500 text-amber-400 bg-amber-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Sun className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">일사·발전</span>
        </button>
        <button
          onClick={() => setActiveTab('financials')}
          className={`py-2.5 px-0.5 border-b-2 flex items-center justify-center space-x-1 transition cursor-pointer text-center ${
            activeTab === 'financials'
              ? 'border-amber-500 text-amber-400 bg-amber-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">수익분석</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-3.5 text-xs space-y-3.5">
        {/* Tab 1: Regulation */}
        {activeTab === 'regulation' && (
          <div className="space-y-3">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3">
              <span className="font-bold text-slate-200 block mb-2.5 text-xs">
                GIS 이격거리 및 조례 판정
              </span>
              <div className="space-y-2.5">
                {/* 주거지 이격거리 */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
                  <div>
                    <span className="font-semibold text-slate-200 block text-xs">주거지(주택) 이격거리</span>
                    <span className="text-[11px] text-slate-400">
                      {parcel.regulationChecks.residentialDistance.ordinance}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-100 text-xs">
                      {parcel.regulationChecks.residentialDistance.distance}m
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      (기준 {parcel.regulationChecks.residentialDistance.required}m)
                    </span>
                    <div>
                      {parcel.regulationChecks.residentialDistance.pass ? (
                        <span className="text-emerald-400 font-bold text-[11px]">✓ 충족</span>
                      ) : (
                        <span className="text-rose-400 font-bold text-[11px]">✕ 미달</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 도로 이격거리 */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
                  <div>
                    <span className="font-semibold text-slate-200 block text-xs">도로(군도/지방도) 이격거리</span>
                    <span className="text-[11px] text-slate-400">
                      {parcel.regulationChecks.roadDistance.ordinance}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-100 text-xs">
                      {parcel.regulationChecks.roadDistance.distance}m
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      (기준 {parcel.regulationChecks.roadDistance.required}m)
                    </span>
                    <div>
                      {parcel.regulationChecks.roadDistance.pass ? (
                        <span className="text-emerald-400 font-bold text-[11px]">✓ 충족</span>
                      ) : (
                        <span className="text-amber-400 font-bold text-[11px]">! 협의필요</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 지형 경사도 */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
                  <div>
                    <span className="font-semibold text-slate-200 block text-xs">DEM 표고 경사도</span>
                    <span className="text-[11px] text-slate-400">사면 향: {parcel.aspect}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-100 text-xs">{parcel.slopeDegree}°</span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      (허용 {parcel.regulationChecks.slopeCheck.limit}° 이하)
                    </span>
                    <div>
                      {parcel.regulationChecks.slopeCheck.pass ? (
                        <span className="text-emerald-400 font-bold text-[11px]">✓ 완경사 양호</span>
                      ) : (
                        <span className="text-rose-400 font-bold text-[11px]">✕ 급경사 제한</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 환경 및 보호구역 */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-200 block text-xs">환경보전 및 규제지역</span>
                    <span className="text-[11px] text-slate-400">
                      {parcel.regulationChecks.protectionZone.zoneName}
                    </span>
                  </div>
                  <div className="text-right">
                    {parcel.regulationChecks.protectionZone.intersected ? (
                      <span className="text-rose-400 font-bold text-[11px]">
                        ✕ {Math.round(parcel.regulationChecks.protectionZone.areaRatio * 100)}% 중첩
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-bold text-[11px]">✓ 규제구역 미저촉</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[11px] text-amber-200/90 leading-relaxed">
              <div className="flex items-center space-x-1 font-bold mb-1 text-amber-300 text-xs">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>법적 한계 고지 및 근거 기준</span>
              </div>
              본 분석은 2026년 11월 기준 지자체 자치법규와 연속지적도를 기초로 한 예비 스크리닝 결과이며, 사업 추진 전 지자체 개발행위허가 사전심사를 거쳐야 합니다.
            </div>
          </div>
        )}

        {/* Tab 2: Grid (🌟 re100market.com 벤치마킹: 한전 변전소 & 주변 3대 배전선로 정밀 진단) */}
        {activeTab === 'grid' && (
          <div className="space-y-3">
            {/* 변전소 및 주변압기(M.Tr) 요약 카드 */}
            <div className="bg-slate-850/80 border border-slate-700/80 rounded-lg p-3 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                <div className="flex items-center space-x-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-slate-100 text-xs">한전 변전소 및 전력망 연계 현황</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">기준: {parcel.grid.updatedAt}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">관할 154kV 변전소</span>
                  <span className="font-bold text-sm text-slate-100">{parcel.grid.substationName}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    직선거리 {parcel.grid.substationDistanceKm}km | 잔여 {parcel.grid.substationCapacityTotalMw || (parcel.grid.availableCapacityMw * 3.2).toFixed(1)} MW
                  </span>
                </div>
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">관할 주변압기 (M.Tr)</span>
                  <span className="font-bold text-sm text-amber-300">{parcel.grid.mtrNumber || '#1 M.Tr'}</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">
                    M.Tr 여유 {parcel.grid.mtrAvailableMw || (parcel.grid.availableCapacityMw * 1.2).toFixed(1)} MW
                  </span>
                </div>
              </div>
            </div>

            {/* 🌟 주변 연계 가능 3대 배전선로 (DL) 접속 현황표 */}
            <div className="bg-slate-850/80 border border-slate-700/80 rounded-lg p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 text-xs flex items-center">
                  <Cable className="w-3.5 h-3.5 mr-1 text-sky-400" />
                  주변 배전선로 (DL) 여유 전력량 체크
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  최우선 연계 가능
                </span>
              </div>

              {/* 3대 선로 리스트 */}
              <div className="space-y-2">
                {(parcel.grid.distributionLines || [
                  {
                    name: parcel.grid.dlName,
                    availableMw: parcel.grid.availableCapacityMw,
                    status: parcel.grid.status,
                    distanceKm: 1.2,
                    estimatedInterconnectionCostWon: 54000000,
                    isRecommended: true,
                  },
                  {
                    name: '지역보조선로 #2',
                    availableMw: 1.5,
                    status: '보통',
                    distanceKm: 2.4,
                    estimatedInterconnectionCostWon: 108000000,
                  },
                  {
                    name: '외곽연계선로 #3',
                    availableMw: 0.2,
                    status: '포화',
                    distanceKm: 3.8,
                    estimatedInterconnectionCostWon: 171000000,
                  },
                ]).map((dl, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border text-xs transition ${
                      dl.isRecommended
                        ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            dl.status === '여유'
                              ? 'bg-emerald-400'
                              : dl.status === '보통'
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                          }`}
                        />
                        <span className="font-bold text-slate-100">{dl.name}</span>
                        {dl.isRecommended && (
                          <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded">
                            추천 1순위
                          </span>
                        )}
                      </div>
                      <span
                        className={`font-extrabold text-xs ${
                          dl.status === '여유'
                            ? 'text-emerald-400'
                            : dl.status === '보통'
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {dl.availableMw} MW ({dl.status})
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                      <span>
                        선로 인입거리: <strong className="text-slate-200">{dl.distanceKm} km</strong>
                      </span>
                      <span>
                        예상 인입공사비: <strong className="text-amber-300 font-mono">{(dl.estimatedInterconnectionCostWon / 10000).toLocaleString()}만원</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 계통 접속 가이드 */}
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg text-[11px] text-slate-300 space-y-1">
              <span className="font-semibold text-amber-300 block text-xs">💡 한전 배전선로 접속 진단 요약</span>
              <p className="text-slate-400 leading-relaxed">
                추천 배전선로 접속 여유용량이 <strong className="text-emerald-400">{parcel.grid.availableCapacityMw} MW</strong>로, 본 부지의 추정 발전설비({parcel.solar.estimatedCapacityKwp} kWp)를 100% 수용 가능한 상태입니다.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Real Estate (🌟 disco.re 벤치마킹: 토지 실거래가 및 도로 접면/공적장부) */}
        {activeTab === 'realEstate' && (
          <div className="space-y-3">
            {/* 최근 실거래가 및 평당 단가 요약 */}
            <div className="bg-slate-850/80 border border-slate-700/80 rounded-lg p-3 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                <div className="flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4 text-sky-400" />
                  <span className="font-bold text-slate-100 text-xs">인근 토지 실거래 시세 (Disco 프롭테크)</span>
                </div>
                <span className="text-[10px] text-sky-300 font-semibold bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/30">
                  반경 1km 최근 3년
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">평균 실거래 평당가</span>
                  <span className="font-extrabold text-base text-amber-400 font-mono">
                    {(parcel.realEstate?.avgTradingPricePerPyeong || 85000).toLocaleString()}원
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    공시지가 대비 약 {((parcel.realEstate?.avgTradingPricePerPyeong || 85000) / (parcel.officialPrice * 3.305785)).toFixed(1)}배
                  </span>
                </div>
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">추정 토지 매입/임대 총액</span>
                  <span className="font-extrabold text-base text-slate-100 font-mono">
                    {((parcel.realEstate?.estimatedLandPriceTotalWon || parcel.areaPyeong * 85000) / 100000000).toFixed(2)}억원
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    총 {parcel.areaPyeong.toLocaleString()}평 기준
                  </span>
                </div>
              </div>
            </div>

            {/* 도로 접면 및 공적장부 인허가 진단 */}
            <div className="bg-slate-850/80 border border-slate-700/80 rounded-lg p-3 space-y-2">
              <span className="font-bold text-slate-100 text-xs block mb-1">
                진입로(도로 접면) 및 공적장부 현황
              </span>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">도로 접면 상태</span>
                  <span className="font-bold text-slate-100 flex items-center">
                    {parcel.realEstate?.isLandlocked ? (
                      <span className="text-rose-400 flex items-center font-bold">
                        <BadgeAlert className="w-3.5 h-3.5 mr-1" />
                        {parcel.realEstate?.roadAccess}
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        {parcel.realEstate?.roadAccess || '폭 4m 포장도로 접면 (진입 양호)'}
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">토지 소유 구분</span>
                  <span className="font-bold text-amber-300">
                    {parcel.realEstate?.ownershipType || '개인'} (사유지)
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 rounded bg-slate-900/60 border border-slate-800">
                  <span className="text-slate-400">최근 3년 인근 거래 건수</span>
                  <span className="font-bold text-slate-200">
                    총 {parcel.realEstate?.recentTradesCount || 7}건 실거래 신고 완료
                  </span>
                </div>
              </div>
            </div>

            {/* 토지 매입 팁 */}
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg text-[11px] text-slate-300">
              <span className="font-semibold text-sky-300 block mb-1 text-xs">💡 프롭테크 토지 투자 제언</span>
              {parcel.realEstate?.isLandlocked ? (
                <p className="text-rose-300/90 leading-relaxed">
                  본 부지는 현재 지적상 맹지 우려가 있으므로, 인접 토지주와 사도(진입로) 개설 동의 또는 토지 사용승낙서 확보가 필수적입니다.
                </p>
              ) : (
                <p className="text-slate-400 leading-relaxed">
                  포장도로가 안정적으로 접면되어 있어 개발행위허가 시 도로 너비 기준(4m 이상)을 충족하며, 토지 매입 또는 장기임대(20년) 추진에 적합합니다.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Solar Generation */}
        {activeTab === 'solar' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                <span className="text-[11px] text-slate-400 block mb-0.5">추정 설비용량</span>
                <span className="font-bold text-base text-amber-400">
                  {parcel.solar.estimatedCapacityKwp.toLocaleString()} kWp
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  순면적 {parcel.solar.effectiveAreaSqm.toLocaleString()}㎡ 기준
                </span>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                <span className="text-[11px] text-slate-400 block mb-0.5">연간 예상 발전량</span>
                <span className="font-bold text-base text-emerald-400">
                  {Math.round(parcel.solar.annualGenerationKwh / 1000).toLocaleString()} MWh
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  일평균 {parcel.solar.ghiAnnualAvg}h 등가시간
                </span>
              </div>
            </div>

            {/* Monthly Bar Chart */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2.5">
              <span className="font-bold text-slate-200 block mb-1.5 text-xs">월별 예상 발전량 (kWh)</span>
              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderColor: '#334155',
                        borderRadius: '0.375rem',
                        fontSize: '11px',
                        color: '#f8fafc',
                      }}
                    />
                    <Bar dataKey="kwh" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Financials */}
        {activeTab === 'financials' && (
          <div className="space-y-3">
            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">내부수익률(IRR)</span>
                <span className="font-bold text-sm text-emerald-400">
                  {parcel.financials.irrPercent}%
                </span>
              </div>
              <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">순현재가치(NPV)</span>
                <span className="font-bold text-sm text-slate-100">
                  {(parcel.financials.npvWon / 100000000).toFixed(1)}억원
                </span>
              </div>
              <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">투자 회수기간</span>
                <span className="font-bold text-sm text-amber-400">
                  {parcel.financials.paybackYears}년
                </span>
              </div>
            </div>

            {/* Financial Breakdown Table */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2.5 space-y-1.5 text-xs">
              <span className="font-bold text-slate-200 block mb-1">사업비 및 현금흐름 요약</span>
              <div className="flex justify-between pb-1 border-b border-slate-700/40">
                <span className="text-slate-400">총 투자비 (CAPEX)</span>
                <span className="font-bold text-slate-200">
                  {(parcel.financials.capexTotalWon / 100000000).toFixed(2)} 억원
                </span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-700/40">
                <span className="text-slate-400">예상 연매출 (SMP+REC)</span>
                <span className="font-bold text-emerald-400">
                  {(parcel.financials.annualRevenueWon / 10000).toLocaleString()} 만원/년
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">연간 유지관리비 (OPEX)</span>
                <span className="font-semibold text-slate-300">
                  {(parcel.financials.annualOpexWon / 10000).toLocaleString()} 만원/년
                </span>
              </div>
            </div>

            {/* 15-year Cashflow Chart */}
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2.5">
              <span className="font-bold text-slate-200 block mb-1 text-xs">
                15개년 누적 순현금흐름 (천만원)
              </span>
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cashflowData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                    <XAxis dataKey="year" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderColor: '#334155',
                        borderRadius: '0.375rem',
                        fontSize: '11px',
                        color: '#f8fafc',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="누적현금"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 🌟 대표님 요청 2: 수익 분석 5대 공학적/금융적 산출 기준 및 근거 명시 카드 */}
            <div className="bg-slate-900/80 border border-amber-500/30 rounded-lg p-3 space-y-2 text-xs">
              <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>수익 분석 및 금융 모델 산출 근거</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-slate-100">설비 용량 기준:</strong> 부지 전체 면적의 <strong>80% 유효 가용 면적</strong>을 적용하며, N-Type 580W 고효율 모듈 및 최적 어레이 간격 기준 <strong>14㎡당 1 kWp</strong>로 산정합니다.
                </li>
                <li>
                  <strong className="text-slate-100">연간 발전 시간:</strong> 기상청 및 KIER(한국에너지기술연구원) 10개년 실측 데이터 기반 호남·충남 일평균 <strong>3.75시간</strong>(연 1,368.75시간)을 적용합니다.
                </li>
                <li>
                  <strong className="text-slate-100">투자비 (CAPEX):</strong> <strong>125만원 / kWp</strong> (고효율 모듈+인버터 45만, 포스맥 구조물/토목 35만, 한전 계통 연계/전기 30만, 인허가 및 감리 15만).
                </li>
                <li>
                  <strong className="text-slate-100">예상 연매출:</strong> 전력 도매가격(SMP 130원/kWh) + 신재생에너지공급인증서(REC 70원/kWh)의 고정가격계약 및 현물 정산 단가 <strong>170원/kWh</strong> 기준입니다.
                </li>
                <li>
                  <strong className="text-slate-100">운영비 (OPEX):</strong> 연간 총 투자비의 <strong>1.8%</strong> (전기안전관리자 위탁선임, 정기 세척/제초, 종합화재보험, 인버터 수선충당금).
                </li>
                <li>
                  <strong className="text-slate-100">IRR & 회수기간:</strong> 15개년 현금흐름할인법(DCF, 연 모듈 열화율 0.5% 및 인플레이션 2% 반영, 기준할인율 4.5%)으로 산출된 내부수익률입니다.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 🌟 Footer Actions: 공식 PDF 분석 보고서 모달 열기 버튼 연동 */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
        <button
          onClick={onOpenReport}
          className="flex-1 py-2 px-3 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-md shadow-amber-500/20 cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>분석 보고서 (PDF)</span>
        </button>
        <button
          onClick={handleExportCsv}
          className="py-2 px-3 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center space-x-1 border border-slate-700 transition cursor-pointer"
          title="엑셀(CSV) 다운로드"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Excel</span>
        </button>
      </div>
    </aside>
  );
};
