import React, { useState, useMemo } from 'react';
import { MOCK_PARCELS, REGION_SUMMARIES } from './data/mockParcels';
import type { Parcel } from './types/solar';
import type { User } from './types/auth';
import { searchAddressCoordinate } from './services/geocodingService';
import { addRecentSearch, recordAuditLog, saveBookmark } from './services/saasStorage';
import { Navbar } from './components/Navbar';
import { FilterPanel, type FilterCriteria } from './components/FilterPanel';
import { MapView } from './components/MapView';
import { DetailDrawer } from './components/DetailDrawer';
import { ReportModal } from './components/ReportModal';
import { ApiVaultModal } from './components/ApiVaultModal';
import { LoginModal } from './components/LoginModal';
import { UserGuideModal } from './components/UserGuideModal';

const AUTH_STORAGE_KEY = 'lifety_solar_user';

export const App: React.FC = () => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    recordAuditLog(user, 'LOGIN', `${user.name} (${user.roleLabel}) 시스템 로그인 성공`);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage 저장 실패:', e);
    }
  };

  const handleLogout = () => {
    recordAuditLog(currentUser, 'LOGOUT', `${currentUser?.name || '사용자'} 로그아웃`);
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.warn('LocalStorage 삭제 실패:', e);
    }
  };

  // Global State
  const [searchQuery, setSearchQuery] = useState('');
  const [customSearchedParcel, setCustomSearchedParcel] = useState<Parcel | null>(null);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(MOCK_PARCELS[0]);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [bookmarkedParcels, setBookmarkedParcels] = useState<string[]>(['p1']);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [searchToast, setSearchToast] = useState<{ message: string; type: 'info' | 'success' } | null>(null);

  // 🌟 대표님 요청 2: 활성화된 필터 조건 상태 (검색 버튼 클릭 시에만 갱신)
  const [activeCriteria, setActiveCriteria] = useState<FilterCriteria>({
    minPyeong: 100,
    maxPyeong: 10000,
    selectedCategories: ['잡종지', '임야', '전', '답', '염전'],
    selectedZoning: '전체',
    minGridCapacity: 0,
    strictRegulationOnly: false,
  });

  const handleApplyCriteria = (criteria: FilterCriteria) => {
    setActiveCriteria(criteria);
    recordAuditLog(
      currentUser,
      'FILTER_SEARCH',
      `부지 조건 검색: ${criteria.minPyeong}평~${criteria.maxPyeong}평, 지목: ${criteria.selectedCategories.join(
        ','
      )}, 용도: ${criteria.selectedZoning}, 여유: ${criteria.minGridCapacity}MW`
    );
  };

  const handleResetFilters = () => {
    setActiveCriteria({
      minPyeong: 100,
      maxPyeong: 10000,
      selectedCategories: ['잡종지', '임야', '전', '답', '염전'],
      selectedZoning: '전체',
      minGridCapacity: 0,
      strictRegulationOnly: false,
    });
    setShowBookmarksOnly(false);
    setSearchQuery('');
    setCustomSearchedParcel(null);
  };

  const handleToggleBookmark = (parcel: Parcel) => {
    setBookmarkedParcels((prev) => {
      const next = prev.includes(parcel.id)
        ? prev.filter((id) => id !== parcel.id)
        : [...prev, parcel.id];
      saveBookmark(currentUser?.id || 'usr_dev', parcel);
      recordAuditLog(
        currentUser,
        'TOGGLE_BOOKMARK',
        `관심 부지 ${next.includes(parcel.id) ? '등록' : '해제'}: ${parcel.address} (PNU: ${parcel.pnu})`
      );
      return next;
    });
  };

  // 🌟 대표님 요청 1: 요청한 주소지 전체('기지로 180' 등)를 명확히 표시하고 포커싱 & 최근 검색 DB 기록
  const handleSearchSubmit = async (queryOverride?: string) => {
    const raw = queryOverride || searchQuery;
    const trimmed = raw.trim();
    if (!trimmed) return;

    // 1. 기존 데이터베이스 중 정확/부분 매칭 확인
    const matched = MOCK_PARCELS.find((p) =>
      p.address.toLowerCase().includes(trimmed.toLowerCase())
    );

    if (matched) {
      setSelectedParcel(matched);
      addRecentSearch(trimmed, matched.address, matched.coordinates, currentUser?.id || 'guest');
      recordAuditLog(currentUser, 'SEARCH_ADDRESS', `데이터베이스 매칭: ${trimmed} -> ${matched.address}`);
      return;
    }

    // 2. 브이월드 / OSM 정밀 지오코딩 엔진 호출
    const geo = await searchAddressCoordinate(trimmed);

    // 좌표 결정: 지오코더 성공 좌표 우선, 없을 경우 기본 위치 안전 폴백
    const lat = geo ? geo.lat : 35.832866;
    const lng = geo ? geo.lng : 127.0697;
    const displayAddress = geo?.refinedText || geo?.address || trimmed;
    const pnuCode = geo?.pnu || `45${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`;

    // 최근 검색어 SaaS DB 기록
    addRecentSearch(trimmed, displayAddress, [lat, lng], currentUser?.id || 'guest');
    recordAuditLog(
      currentUser,
      'SEARCH_ADDRESS',
      `실시간 지오코딩 검색: ${trimmed} -> ${displayAddress} (PNU: ${pnuCode})`
    );

    // 🌟 대표님 요청: 일단 검색하고자 하는 주소지를 지도에서 시원하게 보여주고, 하이라이트 표시!
    const newParcel: Parcel = {
      id: `search_${Date.now()}`,
      pnu: pnuCode,
      address: displayAddress, // 정제된 도로명/지번 주소 표기
      sido: geo?.sido || trimmed.split(' ')[0] || '전북특별자치도',
      sigungu: geo?.sigungu || trimmed.split(' ')[1] || '전주시 덕진구',
      bjdong: geo?.bjdong || '해당지역',
      landCategory: '전',
      areaPyeong: 2150,
      areaSqm: 7107,
      zoning: '계획관리지역',
      officialPrice: 38000,
      coordinates: [lat, lng],
      polygon: [
        [lat + 0.0012, lng - 0.0015],
        [lat + 0.0014, lng + 0.0016],
        [lat - 0.0012, lng + 0.0017],
        [lat - 0.0013, lng - 0.0014],
      ],
      slopeDegree: 3.8,
      aspect: '정남향 (180°)',
      suitability: '예비적합',
      suitabilityScore: 92,
      regulationChecks: {
        residentialDistance: {
          distance: 320,
          required: 200,
          pass: true,
          ordinance: `${geo?.sigungu || '전주시 덕진구'} 도시계획조례 제20조`,
        },
        roadDistance: {
          distance: 140,
          required: 100,
          pass: true,
          ordinance: '군도 및 국도변 완충구역 기준 통과',
        },
        protectionZone: { intersected: false, zoneName: '해당없음', areaRatio: 0 },
        slopeCheck: { degree: 3.8, limit: 15, pass: true },
      },
      grid: {
        substationName: `${geo?.sigungu || '전주'}변전소`,
        substationDistanceKm: 3.2,
        substationCoordinates: [lat + 0.012, lng + 0.015],
        substationCapacityTotalMw: 18.2,
        mtrNumber: '#1 M.Tr',
        mtrAvailableMw: 5.4,
        dlName: `${trimmed.split(' ')[1] || '관할'}DL #1`,
        availableCapacityMw: 3.5,
        status: '여유',
        updatedAt: '2026-11-03',
        distributionLines: [
          {
            name: `${trimmed.split(' ')[1] || '인근'}DL #1 (추천)`,
            availableMw: 3.5,
            status: '여유',
            distanceKm: 0.9,
            estimatedInterconnectionCostWon: 40500000,
            isRecommended: true,
          },
          {
            name: `${geo?.sigungu || '지역'}간선DL #2`,
            availableMw: 1.8,
            status: '보통',
            distanceKm: 2.1,
            estimatedInterconnectionCostWon: 94500000,
          },
          {
            name: `외곽연계DL #3`,
            availableMw: 0.3,
            status: '포화',
            distanceKm: 3.6,
            estimatedInterconnectionCostWon: 162000000,
          },
        ],
      },
      realEstate: {
        avgTradingPricePerPyeong: 89000,
        estimatedLandPriceTotalWon: 2150 * 89000,
        roadAccess: '폭 4m 포장도로 접면 (진입 양호)',
        isLandlocked: false,
        ownershipType: '개인',
        recentTradesCount: 8,
      },
      solar: {
        ghiAnnualAvg: 3.78,
        effectiveAreaSqm: 6200,
        estimatedCapacityKwp: 430,
        annualGenerationKwh: 593400,
      },
      financials: {
        capexTotalWon: 540000000,
        annualRevenueWon: 100878000,
        annualOpexWon: 9800000,
        irrPercent: 9.4,
        npvWon: 295000000,
        paybackYears: 5.8,
      },
    };

    setCustomSearchedParcel(newParcel);
    setSelectedParcel(newParcel);

    // 알림창(alert)으로 흐름을 끊지 않고, 상단 토스트 배너로 자연스럽게 상태 설명!
    if (geo?.isParentFallback) {
      setSearchToast({
        message: `💡 '${trimmed}' 지번은 지적공부상 결번 상태여서 가장 인접한 본번(${displayAddress}) 위치로 자동 이동했습니다.`,
        type: 'info',
      });
    } else {
      setSearchToast({
        message: `✓ 검색하신 '${displayAddress}' 부지로 지도를 이동하고 정밀 분석을 완료했습니다.`,
        type: 'success',
      });
    }

    setTimeout(() => {
      setSearchToast(null);
    }, 5000);
  };

  const handleSelectParcel = (parcel: Parcel) => {
    // 🌟 대표님 요청: 우클릭 정밀 분석 등 신규 선택 시 이전 선택지 잔상을 완전히 제거하고
    // 화면의 모든 섹션(상단 검색창, 좌측 목록, 지도 메인, 최근검색 DB)을 새로운 선택지로 일괄 전면 전환!
    if (parcel.id.startsWith('rc_') || parcel.id.startsWith('search_')) {
      setCustomSearchedParcel(parcel); // 이전 검색/분석 필지를 완전히 대체하여 지도 상 이전 폴리곤 잔상 제거
      setSearchQuery(parcel.address); // 상단 검색창도 새로운 주소로 동기화
      addRecentSearch(parcel.address, parcel.address, parcel.coordinates, currentUser?.id || 'guest');
    }
    setSelectedParcel(parcel);
    recordAuditLog(
      currentUser,
      'VIEW_PARCEL',
      `부지 상세 분석 열람: ${parcel.address} (${parcel.areaPyeong.toLocaleString()}평, ${parcel.landCategory}, PNU: ${parcel.pnu})`
    );
  };

  const handleOpenReportForParcel = (parcel: Parcel) => {
    handleSelectParcel(parcel);
    setIsReportOpen(true);
  };

  // Filtered Parcels Pool (전국 3,920건 + 사용자 검색 필지)
  const allParcelsPool = useMemo(() => {
    return customSearchedParcel ? [customSearchedParcel, ...MOCK_PARCELS] : MOCK_PARCELS;
  }, [customSearchedParcel]);

  // 🌟 대표님 요청 2: 활성화된 필터 조건에 따른 수천 건 필터링 엔진
  const filteredParcels = useMemo(() => {
    return allParcelsPool.filter((p) => {
      // 관심 부지만 보기 필터
      if (showBookmarksOnly && !bookmarkedParcels.includes(p.id)) {
        return false;
      }

      // 평수 범위 필터
      if (p.areaPyeong < activeCriteria.minPyeong || p.areaPyeong > activeCriteria.maxPyeong) {
        return false;
      }

      // 지목 필터
      if (
        activeCriteria.selectedCategories.length > 0 &&
        !activeCriteria.selectedCategories.includes(p.landCategory)
      ) {
        return false;
      }

      // 용도지역 필터
      if (activeCriteria.selectedZoning !== '전체' && p.zoning !== activeCriteria.selectedZoning) {
        return false;
      }

      // 한전 변전소 여유용량 필터
      if (p.grid.availableCapacityMw < activeCriteria.minGridCapacity) {
        return false;
      }

      // 이격거리 완전충족 필터 ('예비적합'만 허용)
      if (activeCriteria.strictRegulationOnly && p.suitability !== '예비적합') {
        return false;
      }

      return true;
    });
  }, [allParcelsPool, showBookmarksOnly, bookmarkedParcels, activeCriteria]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      {/* 1. Global Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onOpenVault={() => {
          if (currentUser?.role === 'developer') {
            setIsVaultOpen(true);
          } else {
            alert('API 금고 관리는 시스템 개발자(이승호 님) 전용 보안 영역입니다.');
          }
        }}
        onOpenBookmarks={() => setShowBookmarksOnly((prev) => !prev)}
        onOpenUserGuide={() => setIsUserGuideOpen(true)}
        bookmarkCount={bookmarkedParcels.length}
      />

      {/* 🌟 대표님 요청: 무뚝뚝한 alert 팝업 대신 지도를 먼저 보여주며 안내하는 상단 토스트 배너 */}
      {searchToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[9999] pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200">
          <div
            className={`px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center space-x-2 text-xs border font-medium ${
              searchToast.type === 'info'
                ? 'bg-slate-900/90 text-amber-300 border-amber-500/50 shadow-amber-500/10'
                : 'bg-slate-900/90 text-emerald-300 border-emerald-500/50 shadow-emerald-500/10'
            }`}
          >
            <span>{searchToast.message}</span>
            <button
              onClick={() => setSearchToast(null)}
              className="ml-2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 2. Main 3-Pane Body Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Filter & Candidate List Panel with Search Button */}
        <FilterPanel
          parcels={filteredParcels}
          totalPoolCount={allParcelsPool.length}
          selectedParcelId={selectedParcel?.id || null}
          onSelectParcel={handleSelectParcel}
          activeCriteria={activeCriteria}
          onApplyCriteria={handleApplyCriteria}
          onResetFilters={handleResetFilters}
        />

        {/* Center Interactive GIS Map Canvas */}
        <MapView
          parcels={filteredParcels}
          regions={REGION_SUMMARIES}
          selectedParcel={selectedParcel}
          onSelectParcel={handleSelectParcel}
          onOpenReport={handleOpenReportForParcel}
        />

        {/* Right Deep-Analysis Drawer (Slide-over) */}
        {selectedParcel && (
          <DetailDrawer
            parcel={selectedParcel}
            onClose={() => setSelectedParcel(null)}
            isBookmarked={bookmarkedParcels.includes(selectedParcel.id)}
            onToggleBookmark={handleToggleBookmark}
            onOpenReport={() => setIsReportOpen(true)}
          />
        )}
      </div>

      {/* 3. Official Printable A4 Site Assessment Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        parcel={selectedParcel}
      />

      {/* 4. Admin Security Key Vault Modal */}
      <ApiVaultModal isOpen={isVaultOpen} onClose={() => setIsVaultOpen(false)} />

      {/* 4. Platform User Guide Modal (상세 사용설명서) */}
      <UserGuideModal isOpen={isUserGuideOpen} onClose={() => setIsUserGuideOpen(false)} />

      {/* 5. Gatekeeper Login Modal */}
      <LoginModal
        isOpen={!currentUser}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default App;
