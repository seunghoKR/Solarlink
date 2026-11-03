import React, { useState } from 'react';
import type { Parcel, LandCategory, Zoning } from '../types/solar';
import {
  SlidersHorizontal,
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Search,
  Check,
} from 'lucide-react';

export interface FilterCriteria {
  minPyeong: number;
  maxPyeong: number;
  selectedCategories: LandCategory[];
  selectedZoning: Zoning | '전체';
  minGridCapacity: number;
  strictRegulationOnly: boolean;
}

interface FilterPanelProps {
  parcels: Parcel[];
  totalPoolCount: number;
  selectedParcelId: string | null;
  onSelectParcel: (parcel: Parcel) => void;
  activeCriteria: FilterCriteria;
  onApplyCriteria: (criteria: FilterCriteria) => void;
  onResetFilters: () => void;
}

const ALL_CATEGORIES: LandCategory[] = [
  '잡종지',
  '임야',
  '전',
  '답',
  '과수원',
  '목장용지',
  '염전',
];

const ALL_ZONINGS: (Zoning | '전체')[] = [
  '전체',
  '계획관리지역',
  '생산관리지역',
  '보전관리지역',
  '농림지역',
  '자연환경보전지역',
  '자연녹지지역',
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  parcels,
  totalPoolCount,
  selectedParcelId,
  onSelectParcel,
  activeCriteria,
  onApplyCriteria,
  onResetFilters,
}) => {
  // 사용자가 버튼을 누르기 전까지 편집할 수 있는 내부 초안(Draft) 상태
  const [draftMinPyeong, setDraftMinPyeong] = useState<number>(activeCriteria.minPyeong);
  const [draftMaxPyeong, setDraftMaxPyeong] = useState<number>(activeCriteria.maxPyeong);
  const [draftCategories, setDraftCategories] = useState<LandCategory[]>(activeCriteria.selectedCategories);
  const [draftZoning, setDraftZoning] = useState<Zoning | '전체'>(activeCriteria.selectedZoning);
  const [draftMinGrid, setDraftMinGrid] = useState<number>(activeCriteria.minGridCapacity);
  const [draftStrictRegulation, setDraftStrictRegulation] = useState<boolean>(activeCriteria.strictRegulationOnly);

  // 리스트 표시 개수 제한 (브라우저 스크롤 60fps 고속 유지)
  const [displayLimit, setDisplayLimit] = useState<number>(60);

  const handleToggleCategory = (category: LandCategory) => {
    setDraftCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleExecuteSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onApplyCriteria({
      minPyeong: draftMinPyeong,
      maxPyeong: draftMaxPyeong,
      selectedCategories: draftCategories,
      selectedZoning: draftZoning,
      minGridCapacity: draftMinGrid,
      strictRegulationOnly: draftStrictRegulation,
    });
    setDisplayLimit(60);
  };

  const handleReset = () => {
    setDraftMinPyeong(100);
    setDraftMaxPyeong(10000);
    setDraftCategories(['잡종지', '임야', '전', '답', '염전']);
    setDraftZoning('전체');
    setDraftMinGrid(0);
    setDraftStrictRegulation(false);
    onResetFilters();
    setDisplayLimit(60);
  };

  const displayedParcels = parcels.slice(0, displayLimit);

  return (
    <aside className="w-88 h-full bg-slate-900/95 border-r border-slate-800 flex flex-col z-20 shrink-0 select-none">
      {/* 1. Header with Reset */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-sm tracking-wide text-slate-200">정밀 부지 조건 검색</span>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center space-x-1 text-xs text-slate-400 hover:text-amber-400 transition cursor-pointer"
          title="필터 초기화"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>초기화</span>
        </button>
      </div>

      {/* 2. Scrollable Condition Controls Form */}
      <form onSubmit={handleExecuteSearch} className="flex flex-col flex-1 overflow-hidden">
        <div className="p-3.5 space-y-3.5 border-b border-slate-800 overflow-y-auto max-h-[50%] text-sm">
          {/* A. 희망 평수 필터 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-200 text-xs">희망 면적 (평수)</span>
              <span className="text-amber-400 font-bold text-xs font-mono">
                {draftMinPyeong.toLocaleString()}평 ~ {draftMaxPyeong.toLocaleString()}평
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={0}
                step={50}
                value={draftMinPyeong}
                onChange={(e) => setDraftMinPyeong(Math.max(0, Number(e.target.value) || 0))}
                className="w-1/2 bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 text-right text-xs focus:outline-none focus:border-amber-500 font-mono"
                placeholder="최소평"
              />
              <span className="text-slate-500">~</span>
              <input
                type="number"
                min={0}
                step={100}
                value={draftMaxPyeong}
                onChange={(e) => setDraftMaxPyeong(Math.max(0, Number(e.target.value) || 0))}
                className="w-1/2 bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 text-right text-xs focus:outline-none focus:border-amber-500 font-mono"
                placeholder="최대평"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              * ㎡ 환산: 약 {(draftMinPyeong * 3.305785).toLocaleString(undefined, { maximumFractionDigits: 0 })}㎡ ~ {(draftMaxPyeong * 3.305785).toLocaleString(undefined, { maximumFractionDigits: 0 })}㎡
            </p>
          </div>

          {/* B. 지목 다중선택 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-200 text-xs">지목 다중선택</span>
              <span className="text-[11px] text-slate-400">{draftCategories.length}개 선택</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {ALL_CATEGORIES.map((cat) => {
                const active = draftCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleToggleCategory(cat)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold border transition cursor-pointer flex items-center space-x-1 ${
                      active
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/10'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:border-slate-600'
                    }`}
                  >
                    {active && <Check className="w-3 h-3 text-amber-400" />}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* C. 용도지역 선택 */}
          <div>
            <span className="font-semibold text-slate-200 block mb-1.5 text-xs">용도지역</span>
            <select
              value={draftZoning}
              onChange={(e) => setDraftZoning(e.target.value as Zoning | '전체')}
              className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              {ALL_ZONINGS.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>

          {/* D. 한전 변전소 여유용량 슬라이더 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-200 text-xs">변전소 최소 여유용량</span>
              <span className="text-emerald-400 font-bold text-xs font-mono">{draftMinGrid} MW 이상</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={draftMinGrid}
              onChange={(e) => setDraftMinGrid(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
            />
          </div>

          {/* E. 이격거리 및 조례 완전충족 토글 */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="font-semibold text-slate-200 block text-xs">이격거리/조례 완전충족만</span>
              <span className="text-[11px] text-slate-400">조건부 및 제한 부지 제외</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={draftStrictRegulation}
                onChange={() => setDraftStrictRegulation(!draftStrictRegulation)}
                className="sr-only peer"
              />
              <div className="w-8 h-4.5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
        </div>

        {/* 🌟 3. 대표님 요청: 검색 실행 버튼 (Search Action Bar) */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 shadow-md">
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 transition shadow-lg shadow-amber-500/25 cursor-pointer active:scale-98"
          >
            <Search className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>설정 조건으로 부지 검색</span>
          </button>
        </div>

        {/* 4. Candidate List Header */}
        <div className="px-3.5 py-2.5 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">
            검색 결과 <span className="text-amber-400 font-extrabold text-sm">{parcels.length.toLocaleString()}</span>건
            <span className="text-slate-500 text-[11px] font-normal ml-1">
              / 전국 {totalPoolCount.toLocaleString()}건 풀
            </span>
          </span>
          <span className="text-[11px] text-slate-400">GIS 적합도순</span>
        </div>

        {/* 5. Candidate List Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
          {parcels.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30 text-amber-400" />
              설정하신 조건에 부합하는 후보지가 없습니다.
              <br />
              평수나 계통 조건을 완화한 후 다시 검색해 보세요.
            </div>
          ) : (
            <>
              {displayedParcels.map((parcel) => {
                const isSelected = parcel.id === selectedParcelId;
                return (
                  <div
                    key={parcel.id}
                    onClick={() => onSelectParcel(parcel)}
                    className={`p-3 cursor-pointer transition relative group ${
                      isSelected
                        ? 'bg-amber-500/10 border-l-3 border-amber-500'
                        : 'hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                            {parcel.landCategory}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium truncate">
                            {parcel.zoning}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-amber-400 transition">
                          {parcel.address}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          <span className="font-extrabold text-slate-200 font-mono">
                            {parcel.areaPyeong.toLocaleString()}평
                          </span>
                          <span className="text-slate-500 ml-1">
                            ({parcel.areaSqm.toLocaleString()}㎡)
                          </span>
                        </p>
                      </div>

                      {/* Suitability Badge */}
                      <div className="text-right shrink-0">
                        {parcel.suitability === '예비적합' && (
                          <span className="inline-flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                            예비적합
                          </span>
                        )}
                        {parcel.suitability === '조건부' && (
                          <span className="inline-flex items-center text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-2.5 h-2.5 mr-0.5" />
                            조건부
                          </span>
                        )}
                        {parcel.suitability === '제한' && (
                          <span className="inline-flex items-center text-[10px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-full">
                            <XCircle className="w-2.5 h-2.5 mr-0.5" />
                            제한
                          </span>
                        )}
                        <div className="text-[11px] font-extrabold text-amber-400 mt-0.5 font-mono">
                          {parcel.suitabilityScore}점
                        </div>
                      </div>
                    </div>

                    {/* Sub Features */}
                    <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center">
                        <Zap className="w-3 h-3 text-emerald-400 mr-1" />
                        여유 {parcel.grid.availableCapacityMw}MW
                      </span>
                      <span className="text-slate-300 font-semibold font-mono">
                        {parcel.solar.estimatedCapacityKwp} kWp
                      </span>
                    </div>
                  </div>
                );
              })}

              {parcels.length > displayLimit && (
                <div className="p-3 text-center bg-slate-900/60 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setDisplayLimit((prev) => prev + 60)}
                    className="w-full py-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold border border-amber-500/30 rounded-lg hover:bg-amber-500/10 transition cursor-pointer"
                  >
                    + 후보지 더 보기 (남은 { (parcels.length - displayLimit).toLocaleString() }건)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </form>
    </aside>
  );
};
