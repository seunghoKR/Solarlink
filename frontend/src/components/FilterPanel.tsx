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
  Bookmark,
} from 'lucide-react';

export interface FilterCriteria {
  minPyeong: number;
  maxPyeong: number;
  selectedCategories: LandCategory[];
  selectedZoning: Zoning | '전체';
  minGridCapacity: number;
  strictRegulationOnly: boolean;
  // 🌟 대표님 요청: 4대 스마트 컷오프(비효율 부지 제외) 필터
  smartEfficiencyOnly: boolean;
  excludeLandlocked: boolean;
  excludeSteepSlope: boolean;
  excludeShadedAspect: boolean;
  excludeZeroGridCapacity: boolean;
}

interface FilterPanelProps {
  parcels: Parcel[];
  totalPoolCount: number;
  selectedParcelId: string | null;
  onSelectParcel: (parcel: Parcel) => void;
  activeCriteria: FilterCriteria;
  onApplyCriteria: (criteria: FilterCriteria) => void;
  onResetFilters: () => void;
  showBookmarksOnly?: boolean;
  onDisableBookmarksOnly?: () => void;
  onSearchCurrentMap?: (criteria: FilterCriteria) => void;
  isLiveSearching?: boolean;
}

const ALL_CATEGORIES: LandCategory[] = [
  '대지',
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
  '제1종일반주거지역',
  '제2종일반주거지역',
  '준주거지역',
  '일반상업지역',
];

const QUICK_PYEONG_PRESETS = [
  { label: '전체', min: 100, max: 0 },
  { label: '5천~1만', min: 5000, max: 10000 },
  { label: '1만~3만', min: 10000, max: 30000 },
  { label: '3만평+', min: 30000, max: 0 },
];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  parcels,
  totalPoolCount,
  selectedParcelId,
  onSelectParcel,
  activeCriteria,
  onApplyCriteria,
  onResetFilters,
  showBookmarksOnly = false,
  onDisableBookmarksOnly,
  onSearchCurrentMap,
  isLiveSearching = false,
}) => {
  // 사용자가 버튼을 누르거나 조작할 수 있는 내부 초안(Draft) 상태
  const [draftMinPyeong, setDraftMinPyeong] = useState<number>(activeCriteria.minPyeong);
  const [draftMaxPyeong, setDraftMaxPyeong] = useState<number>(activeCriteria.maxPyeong);
  const [draftCategories, setDraftCategories] = useState<LandCategory[]>(activeCriteria.selectedCategories);
  const [draftZoning, setDraftZoning] = useState<Zoning | '전체'>(activeCriteria.selectedZoning);
  const [draftMinGrid, setDraftMinGrid] = useState<number>(activeCriteria.minGridCapacity);
  const [draftStrictRegulation, setDraftStrictRegulation] = useState<boolean>(activeCriteria.strictRegulationOnly);
  const [draftSmartEfficiency, setDraftSmartEfficiency] = useState<boolean>(activeCriteria.smartEfficiencyOnly || false);
  const [draftExcludeLandlocked, setDraftExcludeLandlocked] = useState<boolean>(activeCriteria.excludeLandlocked || false);
  const [draftExcludeSteepSlope, setDraftExcludeSteepSlope] = useState<boolean>(activeCriteria.excludeSteepSlope || false);
  const [draftExcludeShadedAspect, setDraftExcludeShadedAspect] = useState<boolean>(activeCriteria.excludeShadedAspect || false);
  const [draftExcludeZeroGrid, setDraftExcludeZeroGrid] = useState<boolean>(activeCriteria.excludeZeroGridCapacity || false);

  // 리스트 표시 개수 제한 (브라우저 스크롤 60fps 고속 유지)
  const [displayLimit, setDisplayLimit] = useState<number>(60);

  const buildCriteria = (cats?: LandCategory[]): FilterCriteria => ({
    minPyeong: Number(draftMinPyeong) || 0,
    maxPyeong: draftMaxPyeong > 0 ? Number(draftMaxPyeong) : 0,
    selectedCategories: cats ?? draftCategories,
    selectedZoning: draftZoning,
    minGridCapacity: Number(draftMinGrid) || 0,
    strictRegulationOnly: draftStrictRegulation,
    smartEfficiencyOnly: draftSmartEfficiency,
    excludeLandlocked: draftExcludeLandlocked,
    excludeSteepSlope: draftExcludeSteepSlope,
    excludeShadedAspect: draftExcludeShadedAspect,
    excludeZeroGridCapacity: draftExcludeZeroGrid,
  });

  const handleToggleSmartEfficiency = (checked: boolean) => {
    setDraftSmartEfficiency(checked);
    setDraftExcludeLandlocked(checked);
    setDraftExcludeSteepSlope(checked);
    setDraftExcludeShadedAspect(checked);
    setDraftExcludeZeroGrid(checked);
    onApplyCriteria({
      ...buildCriteria(),
      smartEfficiencyOnly: checked,
      excludeLandlocked: checked,
      excludeSteepSlope: checked,
      excludeShadedAspect: checked,
      excludeZeroGridCapacity: checked,
    });
    setDisplayLimit(60);
  };

  const handleToggleExclusion = (type: 'landlocked' | 'steep' | 'shaded' | 'gridZero') => {
    let nextLandlocked = draftExcludeLandlocked;
    let nextSteep = draftExcludeSteepSlope;
    let nextShaded = draftExcludeShadedAspect;
    let nextGridZero = draftExcludeZeroGrid;

    if (type === 'landlocked') nextLandlocked = !nextLandlocked;
    if (type === 'steep') nextSteep = !nextSteep;
    if (type === 'shaded') nextShaded = !nextShaded;
    if (type === 'gridZero') nextGridZero = !nextGridZero;

    setDraftExcludeLandlocked(nextLandlocked);
    setDraftExcludeSteepSlope(nextSteep);
    setDraftExcludeShadedAspect(nextShaded);
    setDraftExcludeZeroGrid(nextGridZero);

    const allChecked = nextLandlocked && nextSteep && nextShaded && nextGridZero;
    setDraftSmartEfficiency(allChecked);

    onApplyCriteria({
      ...buildCriteria(),
      smartEfficiencyOnly: allChecked,
      excludeLandlocked: nextLandlocked,
      excludeSteepSlope: nextSteep,
      excludeShadedAspect: nextShaded,
      excludeZeroGridCapacity: nextGridZero,
    });
    setDisplayLimit(60);
  };

  // 🌟 대표님 요청: 지목 토글 시 실시간으로 즉시 필터링 반영 + 검색 버튼으로도 언제든 확정 가능!
  const handleToggleCategory = (category: LandCategory) => {
    const nextCategories = draftCategories.includes(category)
      ? draftCategories.filter((c) => c !== category)
      : [...draftCategories, category];
    setDraftCategories(nextCategories);
    onApplyCriteria(buildCriteria(nextCategories));
    setDisplayLimit(60);
  };

  const handleQuickPyeong = (min: number, max: number) => {
    setDraftMinPyeong(min);
    setDraftMaxPyeong(max);
    onApplyCriteria({
      ...buildCriteria(),
      minPyeong: min,
      maxPyeong: max,
    });
    setDisplayLimit(60);
  };

  const handleExecuteSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onApplyCriteria(buildCriteria());
    setDisplayLimit(60);
  };

  const handleReset = () => {
    setDraftMinPyeong(100);
    setDraftMaxPyeong(0);
    setDraftCategories([...ALL_CATEGORIES]);
    setDraftZoning('전체');
    setDraftMinGrid(0);
    setDraftStrictRegulation(false);
    setDraftSmartEfficiency(false);
    setDraftExcludeLandlocked(false);
    setDraftExcludeSteepSlope(false);
    setDraftExcludeShadedAspect(false);
    setDraftExcludeZeroGrid(false);
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

      {/* 🌟 대표님 관심 부지 모아보기 활성화 시 명확한 상태 안내 배너 */}
      {showBookmarksOnly && (
        <div className="m-3 p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-between text-xs text-amber-300 animate-in fade-in">
          <div className="flex items-center space-x-1.5 min-w-0">
            <Bookmark className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
            <span className="font-bold truncate">관심 후보만 모아보기 중</span>
          </div>
          <button
            type="button"
            onClick={onDisableBookmarksOnly || handleReset}
            className="px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] transition cursor-pointer shrink-0 ml-2"
          >
            전체 부지 보기
          </button>
        </div>
      )}

      {/* 2. Scrollable Condition Controls Form */}
      <form onSubmit={handleExecuteSearch} noValidate className="flex flex-col flex-1 overflow-hidden">
        <div className="p-3.5 space-y-3.5 border-b border-slate-800 overflow-y-auto max-h-[50%] text-sm">
          {/* A. 희망 평수 필터 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-200 text-xs">희망 면적 (평수)</span>
              <span className="text-amber-400 font-bold text-xs font-mono">
                {draftMinPyeong.toLocaleString()}평 ~ {draftMaxPyeong > 0 ? `${draftMaxPyeong.toLocaleString()}평` : '제한없음'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={0}
                step="any"
                value={draftMinPyeong}
                onChange={(e) => setDraftMinPyeong(Math.max(0, Number(e.target.value) || 0))}
                className="w-1/2 bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 text-right text-xs focus:outline-none focus:border-amber-500 font-mono"
                placeholder="최소평"
              />
              <span className="text-slate-500">~</span>
              <input
                type="number"
                min={0}
                step="any"
                value={draftMaxPyeong === 0 ? '' : draftMaxPyeong}
                onChange={(e) => setDraftMaxPyeong(Math.max(0, Number(e.target.value) || 0))}
                className="w-1/2 bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-slate-100 text-right text-xs focus:outline-none focus:border-amber-500 font-mono placeholder-slate-500"
                placeholder="제한없음"
              />
            </div>
            <div className="grid grid-cols-4 gap-1 mt-1.5">
              {QUICK_PYEONG_PRESETS.map((preset) => {
                const active = draftMinPyeong === preset.min && draftMaxPyeong === preset.max;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleQuickPyeong(preset.min, preset.max)}
                    className={`py-1 rounded text-[11px] font-semibold border transition cursor-pointer ${
                      active
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              * ㎡ 환산: 약 {(draftMinPyeong * 3.305785).toLocaleString(undefined, { maximumFractionDigits: 0 })}㎡ ~{' '}
              {draftMaxPyeong > 0
                ? `${(draftMaxPyeong * 3.305785).toLocaleString(undefined, { maximumFractionDigits: 0 })}㎡`
                : '제한없음'}
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

          {/* F. 🌟 대표님 요청: 4대 스마트 컷오프 (비효율 부지 제외) 엔진 */}
          <div className="pt-2.5 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between bg-amber-500/10 p-2 rounded-lg border border-amber-500/25">
              <div className="flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-slate-100 text-xs block">스마트 고효율 알짜 부지만 보기</span>
                  <span className="text-[10px] text-amber-300/80">맹지·급경사·음영·계통포화 일괄 컷오프</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-2 shrink-0">
                <input
                  type="checkbox"
                  checked={draftSmartEfficiency}
                  onChange={(e) => handleToggleSmartEfficiency(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-amber-500 peer-checked:to-amber-600"></div>
              </label>
            </div>

            {/* 4대 비효율 부지 개별 제외 칩 */}
            <div className="grid grid-cols-2 gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => handleToggleExclusion('landlocked')}
                className={`py-1.5 px-2 rounded-md text-[11px] font-medium border flex items-center justify-between transition cursor-pointer ${
                  draftExcludeLandlocked
                    ? 'bg-rose-950/70 border-rose-500/60 text-rose-300 font-semibold'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
                }`}
                title="진입로 폭 3~4m 미확보 맹지 부지를 검색에서 제외합니다"
              >
                <span>🚫 맹지 제외</span>
                {draftExcludeLandlocked && <Check className="w-3 h-3 text-rose-400 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => handleToggleExclusion('steep')}
                className={`py-1.5 px-2 rounded-md text-[11px] font-medium border flex items-center justify-between transition cursor-pointer ${
                  draftExcludeSteepSlope
                    ? 'bg-rose-950/70 border-rose-500/60 text-rose-300 font-semibold'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
                }`}
                title="토목공사비 과다 및 산지관리법 허가 불가 급경사지(15° 초과)를 제외합니다"
              >
                <span>🚫 급경사(15°+) 제외</span>
                {draftExcludeSteepSlope && <Check className="w-3 h-3 text-rose-400 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => handleToggleExclusion('shaded')}
                className={`py-1.5 px-2 rounded-md text-[11px] font-medium border flex items-center justify-between transition cursor-pointer ${
                  draftExcludeShadedAspect
                    ? 'bg-rose-950/70 border-rose-500/60 text-rose-300 font-semibold'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
                }`}
                title="일조량이 불리한 북향, 북동향, 북서향 음영 부지를 제외합니다"
              >
                <span>🚫 북향/음영 제외</span>
                {draftExcludeShadedAspect && <Check className="w-3 h-3 text-rose-400 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => handleToggleExclusion('gridZero')}
                className={`py-1.5 px-2 rounded-md text-[11px] font-medium border flex items-center justify-between transition cursor-pointer ${
                  draftExcludeZeroGrid
                    ? 'bg-rose-950/70 border-rose-500/60 text-rose-300 font-semibold'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
                }`}
                title="한전 변전소 여유 용량이 소진된 계통 포화 부지를 제외합니다"
              >
                <span>🚫 계통포화 제외</span>
                {draftExcludeZeroGrid && <Check className="w-3 h-3 text-rose-400 shrink-0" />}
              </button>
            </div>
          </div>
        </div>

        {/* 🌟 3. 대표님 요청: 검색 실행 버튼 (Search Action Bar) */}
        <div className="p-3 bg-slate-900 border-b border-slate-800 shadow-md space-y-2">
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 transition shadow-lg shadow-amber-500/25 cursor-pointer active:scale-98"
          >
            <Search className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>설정 조건으로 부지 검색</span>
          </button>
          {onSearchCurrentMap && (
            <button
              type="button"
              disabled={isLiveSearching}
              onClick={() => onSearchCurrentMap(buildCriteria())}
              className="w-full py-2 px-3 rounded-lg bg-sky-950/80 hover:bg-sky-900 text-sky-300 border border-sky-600/50 font-semibold text-xs flex items-center justify-center space-x-1.5 transition cursor-pointer disabled:opacity-60"
              title="현재 보고 있는 지도 화면 안에서 국토부 VWorld 전 필지를 실시간 조건 검색합니다"
            >
              <span>
                {isLiveSearching ? '⏳ 국토부 DB 실시간 발굴 중...' : '📡 현재 지도 영역 국토부 실필지 발굴'}
              </span>
            </button>
          )}
        </div>

        {/* 4. Candidate List Header */}
        <div className="px-3.5 py-2.5 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">
            검색 결과 <span className="text-amber-400 font-extrabold text-sm">{parcels.length.toLocaleString()}</span>건
            <span className="text-slate-500 text-[11px] font-normal ml-1">
              / 전국 17개 시·도 {totalPoolCount.toLocaleString()}건 풀
            </span>
          </span>
          <span className="text-[11px] text-slate-400">GIS 적합도순</span>
        </div>

        {/* 5. Candidate List Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
          {parcels.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30 text-amber-400" />
              <p className="font-semibold text-slate-200 mb-1">
                {showBookmarksOnly
                  ? '관심 후보로 등록된 부지가 없습니다.'
                  : '설정하신 조건에 부합하는 후보지가 없습니다.'}
              </p>
              <p className="text-[11px] text-slate-400 mb-3">
                {showBookmarksOnly
                  ? '관심 후보 모아보기를 해제하거나 조건을 완화해 보세요.'
                  : '평수나 계통 조건을 완화하거나 필터를 초기화해 보세요.'}
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition cursor-pointer active:scale-95 shadow-sm"
              >
                필터 전체 초기화 (전국 {totalPoolCount.toLocaleString()}건 보기)
              </button>
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
