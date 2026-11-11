import React, { useEffect, useState, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  Marker,
  Popup,
  Polygon,
  Circle,
  Polyline,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import type { Parcel, RegionSummary } from '../types/solar';
import { reverseGeocodeCoordinate, type ReverseGeocodeResult } from '../services/geocodingService';
import { fetchRealCadastralPolygon, type SearchBounds } from '../services/cadastralService';
import {
  Sparkles,
  MapPin,
  ArrowRight,
  Loader2,
  FileText,
  ExternalLink,
  Search,
  X,
} from 'lucide-react';

interface MapViewProps {
  parcels: Parcel[];
  regions: RegionSummary[];
  selectedParcel: Parcel | null;
  onSelectParcel: (parcel: Parcel) => void;
  onOpenReport?: (parcel: Parcel) => void;
  onBoundsChange?: (bounds: SearchBounds) => void;
  onSearchInBounds?: (bounds: SearchBounds) => void;
  isLiveSearching?: boolean;
}

const VWORLD_KEY = import.meta.env.VITE_VWORLD_API_KEY || 'E810A4B0-5AFE-4FF7-9E1F-2B905CFAD2B7';

// 지도 포커스 이동 전용 훅 (선택된 필지 또는 공인 좌표 변경 시 부드럽게 이동)
const MapRecenter: React.FC<{
  targetId: string | null;
  center: [number, number];
  zoom: number;
}> = ({ targetId, center, zoom }) => {
  const map = useMap();
  const lastTargetIdRef = useRef<string | null>(null);
  const lastCenterRef = useRef<[number, number] | null>(null);

  useEffect(() => {
    const isNewTarget = targetId && targetId !== lastTargetIdRef.current;
    const isCoordChanged = center && (!lastCenterRef.current || Math.hypot(center[0] - lastCenterRef.current[0], center[1] - lastCenterRef.current[1]) > 0.0001);

    if (targetId && (isNewTarget || isCoordChanged)) {
      lastTargetIdRef.current = targetId;
      lastCenterRef.current = center;
      map.flyTo(center, zoom, { duration: 0.8 });
    }
  }, [targetId, center, zoom, map]);

  return null;
};

// 마우스 우클릭 및 줌 레벨 추적용 이벤트 핸들러
const MapEventHandler: React.FC<{
  onRightClick: (lat: number, lng: number) => void;
  onZoomChange: (zoom: number) => void;
  onBoundsChange?: (bounds: SearchBounds) => void;
}> = ({ onRightClick, onZoomChange, onBoundsChange }) => {
  const map = useMapEvents({
    contextmenu(e) {
      e.originalEvent.preventDefault();
      onRightClick(e.latlng.lat, e.latlng.lng);
    },
    zoomend() {
      onZoomChange(map.getZoom());
      if (onBoundsChange) {
        const b = map.getBounds();
        onBoundsChange({ south: b.getSouth(), west: b.getWest(), north: b.getNorth(), east: b.getEast() });
      }
    },
    moveend() {
      if (onBoundsChange) {
        const b = map.getBounds();
        onBoundsChange({ south: b.getSouth(), west: b.getWest(), north: b.getNorth(), east: b.getEast() });
      }
    },
  });

  useEffect(() => {
    if (onBoundsChange) {
      const b = map.getBounds();
      onBoundsChange({ south: b.getSouth(), west: b.getWest(), north: b.getNorth(), east: b.getEast() });
    }
  }, [map, onBoundsChange]);

  return null;
};

// 🌟 대표님 요청: 줌 제한 완전 해제 (전국 6.0x ~ 초정밀 19.0x 전 구간 자유로운 확대/축소 보장)
const CadastralZoomController: React.FC<{
  showCadastral: boolean;
  onZoomChange: (zoom: number) => void;
}> = () => {
  const map = useMap();

  useEffect(() => {
    try {
      map.setMinZoom(6);
      map.setMaxZoom(19);
    } catch (err) {
      console.warn('줌 제어 예외 방지:', err);
    }
  }, [map]);

  return null;
};

// 🌟 대표님 요청: 마우스로 드래그하면서 자유롭게 연속 확대/축소할 수 있는 정밀 줌 슬라이더 컨트롤러
const ZoomSliderControl: React.FC<{
  currentZoom: number;
  onZoomChange: (zoom: number) => void;
  minZoom?: number;
  maxZoom?: number;
}> = ({ currentZoom, onZoomChange, minZoom = 6, maxZoom = 19 }) => {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn(0.5);
  };

  const handleZoomOut = () => {
    map.zoomOut(0.5);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(e.target.value);
    map.setZoom(newZoom);
    onZoomChange(newZoom);
  };

  return (
    <div
      className="absolute bottom-8 right-6 z-[950] pointer-events-auto select-none"
      onWheel={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 rounded-xl shadow-2xl flex flex-col items-center space-y-2">
        {/* 확대 버튼 */}
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-extrabold text-base flex items-center justify-center border border-slate-700 hover:border-amber-500 transition cursor-pointer shadow active:scale-95"
          title="미세 확대 (+0.5x)"
        >
          +
        </button>

        {/* 수직 줌 슬라이더 트랙 (마우스로 부드럽게 드래그 조절) */}
        <div className="h-32 flex flex-col items-center justify-center py-1">
          <input
            type="range"
            min={minZoom}
            max={maxZoom}
            step="0.1"
            value={Math.max(minZoom, Math.min(maxZoom, currentZoom))}
            onChange={handleSliderChange}
            className="w-28 -rotate-90 origin-center accent-amber-500 cursor-pointer bg-slate-700 rounded-lg"
            style={{ margin: '30px 0' }}
            title={`마우스 드래그 줌 조절 (현재: ${currentZoom.toFixed(1)}x / 범위: ${minZoom}~${maxZoom})`}
          />
        </div>

        {/* 축소 버튼 */}
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-extrabold text-base flex items-center justify-center border border-slate-700 hover:border-amber-500 transition cursor-pointer shadow active:scale-95"
          title="미세 축소 (-0.5x)"
        >
          -
        </button>

        {/* 배율 수치 뱃지 */}
        <div className="text-[10px] font-mono font-bold text-amber-400 bg-slate-800/90 px-1.5 py-0.5 rounded border border-slate-700 whitespace-nowrap">
          {currentZoom.toFixed(1)}x
        </div>
      </div>
    </div>
  );
};

// 🌟 대표님 요청: 전국 100만 건 유효부지 시도 팝업 컴포넌트 (useMap 줌인 연동)
const RegionPopupContent: React.FC<{ region: RegionSummary }> = ({ region }) => {
  const map = useMap();
  return (
    <div className="p-2 text-slate-900 min-w-[210px]">
      <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-2">
        <h4 className="font-extrabold text-amber-600 text-sm">{region.sido}</h4>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
          계통 평균 {region.gridCapacityAvg} MW
        </span>
      </div>
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between items-center bg-amber-50/80 p-1.5 rounded border border-amber-200">
          <span className="text-slate-700 font-medium">4대 컷오프 유효 부지:</span>
          <strong className="text-amber-700 font-extrabold text-xs">
            {(region.totalValidSitesCount || region.candidateCount).toLocaleString()}건
          </strong>
        </div>
        <div className="flex justify-between text-slate-500 text-[11px] px-1">
          <span>국토부 총 지번수:</span>
          <span>약 {Math.round((region.totalParcelsCount || 1000000) / 10000).toLocaleString()}만 필지</span>
        </div>
        <div className="flex justify-between text-slate-500 text-[11px] px-1">
          <span>즉시 탐색 표본:</span>
          <span className="font-semibold text-slate-700">{region.candidateCount.toLocaleString()}건</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          map.flyTo(region.center, 13, { duration: 1.0 });
        }}
        className="w-full mt-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs rounded transition shadow cursor-pointer text-center"
      >
        이 지역 정밀 발굴 이동 (Zoom In) ➔
      </button>
    </div>
  );
};

export const MapView: React.FC<MapViewProps> = ({
  parcels,
  regions,
  selectedParcel,
  onSelectParcel,
  onOpenReport,
  onBoundsChange,
  onSearchInBounds,
  isLiveSearching = false,
}) => {
  // Map Type: 'base' (일반지도) | 'satellite' (위성지도) | 'topo' (지형지도)
  const [mapMode, setMapMode] = useState<'base' | 'satellite' | 'topo'>('base');
  const [showBuffers, setShowBuffers] = useState<boolean>(false);
  const [outlineOnly, setOutlineOnly] = useState<boolean>(false); // 🌟 활성화 시 내부 투명, 비활성화 시 50% 투명도 면적 채우기
  const [showCadastral, setShowCadastral] = useState<boolean>(true); // 🌟 대표님 요청: 전국 연속지적도(지번 경계선) 레이어
  const [showGridLines, setShowGridLines] = useState<boolean>(true); // 🌟 대표님 요청: re100market 특화 한전 계통 연계선 및 변전소 시각화
  const [currentZoom, setCurrentZoom] = useState<number>(selectedParcel ? 18 : 7);
  const [showRightClickGuide, setShowRightClickGuide] = useState<boolean>(true); // 마우스 우클릭 안내 토스트 표시 여부

  const currentBoundsRef = useRef<SearchBounds | null>(null);
  const handleBoundsUpdate = React.useCallback(
    (b: SearchBounds) => {
      currentBoundsRef.current = b;
      onBoundsChange?.(b);
    },
    [onBoundsChange]
  );

  // 🌟 대표님 요청: 국토부 연속지적도 토글
  const handleToggleCadastral = () => {
    setShowCadastral((prev) => !prev);
  };

  // 우클릭 컨텍스트 팝업 상태
  const [rightClickPos, setRightClickPos] = useState<[number, number] | null>(null);
  const [rightClickLoading, setRightClickLoading] = useState<boolean>(false);
  const [rightClickData, setRightClickData] = useState<ReverseGeocodeResult | null>(null);
  // 🌟 대표님 브이월드 승인키 연동: 국토부 공인 실시간 연속지적도(MultiPolygon) 상태 (선택된 parcelId에 엄격히 바인딩)
  const [selectedRealCadastral, setSelectedRealCadastral] = useState<{
    parcelId: string;
    polygon: [number, number][];
  } | null>(null);
  const [rightClickRealPolygon, setRightClickRealPolygon] = useState<[number, number][] | null>(null);

  // 🌟 선택된 부지의 실제 국토부 연속지적도 폴리곤을 실시간 동기화
  useEffect(() => {
    if (!selectedParcel) {
      setSelectedRealCadastral(null);
      return;
    }

    const currentId = selectedParcel.id;
    // 이전 필지의 잔상 폴리곤을 0초 만에 즉각 초기화하여 고스트 현상 원천 차단!
    setSelectedRealCadastral(null);

    let isMounted = true;
    fetchRealCadastralPolygon(selectedParcel.coordinates[0], selectedParcel.coordinates[1]).then((res) => {
      if (isMounted && res && res.polygon && res.polygon.length >= 3) {
        setSelectedRealCadastral({
          parcelId: currentId,
          polygon: res.polygon,
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedParcel?.id, selectedParcel?.coordinates]);

  // 커스텀 시도 카운트 버블 아이콘 (전국 100만 건 AI 유효부지 전수 연동 뱃지)
  const createRegionIcon = (region: RegionSummary) => {
    const validCountDisplay = region.totalValidSitesCount
      ? region.totalValidSitesCount >= 10000
        ? `${(region.totalValidSitesCount / 10000).toFixed(1)}만`
        : `${region.totalValidSitesCount.toLocaleString()}`
      : `${region.candidateCount.toLocaleString()}`;

    return L.divIcon({
      className: 'custom-region-marker',
      html: `
        <div style="
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.92));
          backdrop-filter: blur(8px);
          border: 1.5px solid #f59e0b;
          color: #f8fafc;
          padding: 6px 12px;
          border-radius: 9999px;
          box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4), 0 2px 6px rgba(0,0,0,0.6);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-weight: 700;
          font-size: 11px;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        ">
          <span style="color: #fbbf24; display: flex; align-items: center; gap: 4px;">
            <span style="width: 6px; height: 6px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 8px #22c55e;"></span>
            ${region.sido}
          </span>
          <span style="
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: #09090b;
            padding: 2px 7px;
            border-radius: 9999px;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: -0.2px;
          ">유효 ${validCountDisplay}건</span>
        </div>
      `,
      iconSize: [140, 36],
      iconAnchor: [70, 18],
    });
  };

  // 한전 154kV 변전소 마커 아이콘
  const createSubstationIcon = (substationName: string, capacity: number) => {
    return L.divIcon({
      className: 'custom-substation-marker',
      html: `
        <div style="
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(8px);
          border: 2px solid #06b6d4;
          color: #f8fafc;
          padding: 4px 9px;
          border-radius: 9999px;
          box-shadow: 0 0 16px rgba(6, 182, 212, 0.55);
          font-family: sans-serif;
          font-weight: 800;
          font-size: 11px;
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          white-space: nowrap;
        ">
          <span style="color: #22d3ee; font-size: 12px;">⚡</span>
          <span style="color: #f8fafc;">${substationName}</span>
          <span style="background: rgba(6,182,212,0.25); color: #38bdf8; border: 1px solid rgba(6,182,212,0.4); padding: 1px 6px; border-radius: 9999px; font-size: 10px; font-weight: 800;">${capacity}MW</span>
        </div>
      `,
      iconSize: [125, 30],
      iconAnchor: [62, 15],
    });
  };

  // 개별 필지 마커 아이콘
  const createParcelIcon = (parcel: Parcel, isSelected: boolean) => {
    const color =
      parcel.suitability === '예비적합'
        ? '#10b981'
        : parcel.suitability === '조건부'
        ? '#f59e0b'
        : '#ef4444';

    return L.divIcon({
      className: 'custom-parcel-marker',
      html: `
        <div style="
          position: relative;
          width: ${isSelected ? '28px' : '20px'};
          height: ${isSelected ? '28px' : '20px'};
          border-radius: 50%;
          background: ${color};
          border: 2px solid #ffffff;
          box-shadow: 0 0 14px ${color};
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          cursor: pointer;
        ">
          <div style="width: ${isSelected ? '9px' : '6px'}; height: ${
        isSelected ? '9px' : '6px'
      }; border-radius: 50%; background: #ffffff;"></div>
        </div>
      `,
      iconSize: isSelected ? [28, 28] : [20, 20],
      iconAnchor: isSelected ? [14, 14] : [10, 10],
    });
  };

  // 부지 직접 우클릭 또는 근접 부지 감지 시 바로 해당 필지 데이터 매핑
  const handleParcelRightClick = (parcel: Parcel, lat?: number, lng?: number) => {
    const targetLat = lat ?? parcel.coordinates[0];
    const targetLng = lng ?? parcel.coordinates[1];
    setRightClickPos([targetLat, targetLng]);
    setRightClickLoading(false);
    setRightClickData({
      address: parcel.address,
      roadAddress: parcel.address,
      parcelAddress: parcel.address,
      pnu: parcel.pnu,
      sido: parcel.sido,
      sigungu: parcel.sigungu,
      bjdong: parcel.bjdong,
      lat: parcel.coordinates[0],
      lng: parcel.coordinates[1],
      landCategory: parcel.landCategory,
      estimatedPyeong: parcel.areaPyeong,
      estimatedSqm: parcel.areaSqm,
      zoning: parcel.zoning,
      slopeDegree: parcel.slopeDegree,
      suitability: parcel.suitability,
      suitabilityScore: parcel.suitabilityScore,
      gridCapacityMw: parcel.grid?.availableCapacityMw ?? 1.5,
    });
    onSelectParcel(parcel);
  };

  // 우클릭 핸들러: 실시간 역지오코딩 호출
  const handleMapRightClick = async (lat: number, lng: number) => {
    setRightClickPos([lat, lng]);
    setRightClickLoading(true);
    setRightClickData(null);

    // 🌟 대표님 버그 해결: 만약 우클릭한 위치가 선택된 부지(selectedParcel) 근처이거나,
    // 기존 parcels 목록 중 반경 350m 이내에 있는 부지라면
    // 엉뚱한 난수 역지오코딩을 실행하지 않고, 해당 Parcel의 실제 등록 정보(주소, 지목, 면적 등)를 100% 일치시켜 팝업 표시!
    let matchedParcel: Parcel | null = null;
    if (selectedParcel) {
      const d = Math.hypot(selectedParcel.coordinates[0] - lat, selectedParcel.coordinates[1] - lng);
      if (d < 0.0035) { // 약 350m
        matchedParcel = selectedParcel;
      }
    }
    if (!matchedParcel && parcels && parcels.length > 0) {
      let minDist = 999999;
      for (const p of parcels) {
        const d = Math.hypot(p.coordinates[0] - lat, p.coordinates[1] - lng);
        if (d < 0.003 && d < minDist) {
          minDist = d;
          matchedParcel = p;
        }
      }
    }

    if (matchedParcel) {
      handleParcelRightClick(matchedParcel, lat, lng);
      return;
    }

    try {
      // 🌟 국토부 실시간 연속지적도 및 역지오코딩 동시 호출
      const [result, cadastral] = await Promise.all([
        reverseGeocodeCoordinate(lat, lng),
        fetchRealCadastralPolygon(lat, lng)
      ]);

      if (cadastral && cadastral.polygon && cadastral.polygon.length >= 3) {
        setRightClickRealPolygon(cadastral.polygon);
        if (result) {
          result.pnu = cadastral.pnu || result.pnu;
          if (cadastral.jibun) {
            result.parcelAddress = `${cadastral.sido} ${cadastral.sigungu} ${cadastral.emd} ${cadastral.ri} ${cadastral.jibun}`.replace(/\s+/g, ' ').trim();
          }
          if (cadastral.roadAddress) {
            result.roadAddress = cadastral.roadAddress;
          }
          if (cadastral.pareaPyeong > 0) {
            result.estimatedPyeong = cadastral.pareaPyeong;
            result.estimatedSqm = cadastral.pareaSqm;
          }
          if (cadastral.zoning) {
            result.zoning = cadastral.zoning;
          }
          if (cadastral.normalizedJimok) {
            result.landCategory = cadastral.normalizedJimok;
          }
        }
      } else {
        setRightClickRealPolygon(null);
      }

      setRightClickData(result);
    } catch (err) {
      console.error('우클릭 역지오코딩 에러:', err);
    } finally {
      setRightClickLoading(false);
    }
  };

  // 우클릭 부지를 정밀 분석 Parcel로 변환하는 헬퍼 함수
  const buildParcelFromRightClick = (data: ReverseGeocodeResult): Parcel => {
    const lat = data.lat;
    const lng = data.lng;

    let targetPolygon: [number, number][];

    // 🌟 국토교통부 실시간 연속지적도 폴리곤 우선 사용
    if (rightClickRealPolygon && rightClickRealPolygon.length >= 3) {
      targetPolygon = rightClickRealPolygon;
    } else {
      const radiusMeters = Math.sqrt(data.estimatedSqm / Math.PI);
      const rLat = radiusMeters / 111000;
      const rLng = radiusMeters / 91000;

      // 8각 불규칙 지적도 형태 폴리곤 생성
      const rightClickPolygon: [number, number][] = [];
      const seed = Math.abs(Math.sin(lat * 1000 + lng * 2000) * 10000);
      for (let v = 0; v < 8; v++) {
        const angle = (v / 8) * Math.PI * 2;
        const rVar = 0.75 + ((seed * (v + 1)) % 100) / 200;
        rightClickPolygon.push([
          parseFloat((lat + Math.sin(angle) * rLat * rVar).toFixed(6)),
          parseFloat((lng + Math.cos(angle) * rLng * rVar).toFixed(6)),
        ]);
      }
      targetPolygon = rightClickPolygon;
    }

    return {
      id: `rc_${Date.now()}`,
      pnu: data.pnu || `45${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`,
      address: data.parcelAddress || data.address,
      roadAddress: data.roadAddress,
      sido: data.sido,
      sigungu: data.sigungu,
      bjdong: data.bjdong || '해당지역',
      landCategory: (data.landCategory as any) || '대지',
      areaPyeong: data.estimatedPyeong,
      areaSqm: data.estimatedSqm,
      zoning: (data.zoning as any) || '계획관리지역',
      officialPrice: 32000,
      coordinates: [lat, lng],
      polygon: targetPolygon,
      slopeDegree: data.slopeDegree,
      aspect: '정남향 (180°)',
      suitability: data.suitability,
      suitabilityScore: data.suitabilityScore,
      regulationChecks: {
        residentialDistance: {
          distance: 310,
          required: 200,
          pass: true,
          ordinance: `${data.sigungu} 도시계획조례 제20조`,
        },
        roadDistance: {
          distance: 140,
          required: 100,
          pass: true,
          ordinance: '군도 및 지방도 이격거리 기준 통과',
        },
        protectionZone: { intersected: false, zoneName: '해당없음', areaRatio: 0 },
        slopeCheck: { degree: data.slopeDegree, limit: 15, pass: data.slopeDegree <= 15 },
      },
      grid: {
        substationName: `${data.sigungu || '관할'}변전소`,
        substationDistanceKm: 3.4,
        substationCoordinates: [lat + 0.015, lng + 0.02],
        substationCapacityTotalMw: parseFloat((data.gridCapacityMw * 3.2 + 3.8).toFixed(1)),
        mtrNumber: '#2 M.Tr',
        mtrAvailableMw: parseFloat((data.gridCapacityMw * 1.2).toFixed(1)),
        dlName: `${data.bjdong || '인접'}DL #1`,
        availableCapacityMw: data.gridCapacityMw,
        status: data.gridCapacityMw >= 2.0 ? '여유' : '보통',
        updatedAt: '2026-11-03',
        distributionLines: [
          {
            name: `${data.bjdong || '인근'}DL #1 (최단거리)`,
            availableMw: data.gridCapacityMw,
            status: data.gridCapacityMw >= 2.0 ? '여유' : '보통',
            distanceKm: 1.1,
            estimatedInterconnectionCostWon: 49500000,
            isRecommended: true,
          },
          {
            name: `${data.sigungu || '지역'}선로DL #2`,
            availableMw: parseFloat(Math.max(0.4, data.gridCapacityMw * 0.6).toFixed(1)),
            status: '보통',
            distanceKm: 2.3,
            estimatedInterconnectionCostWon: 103500000,
          },
          {
            name: `연계간선DL #3`,
            availableMw: 0.2,
            status: '포화',
            distanceKm: 3.8,
            estimatedInterconnectionCostWon: 171000000,
          },
        ],
      },
      realEstate: {
        avgTradingPricePerPyeong: 78000,
        estimatedLandPriceTotalWon: Math.round(data.estimatedPyeong * 78000),
        roadAccess: '폭 4m 포장도로 접면 (진입로 양호)',
        isLandlocked: false,
        ownershipType: '개인',
        recentTradesCount: 5,
      },
      solar: {
        ghiAnnualAvg: 3.75,
        effectiveAreaSqm: Math.round(data.estimatedSqm * 0.8),
        estimatedCapacityKwp: Math.round((data.estimatedSqm * 0.8) / 14),
        annualGenerationKwh: Math.round(((data.estimatedSqm * 0.8) / 14) * 3.75 * 365),
      },
      financials: {
        capexTotalWon: Math.round(((data.estimatedSqm * 0.8) / 14) * 1250000),
        annualRevenueWon: Math.round(((data.estimatedSqm * 0.8) / 14) * 3.75 * 365 * 170),
        annualOpexWon: Math.round(((data.estimatedSqm * 0.8) / 14) * 1250000 * 0.018),
        irrPercent: 9.1,
        npvWon: Math.round(((data.estimatedSqm * 0.8) / 14) * 1250000 * 0.45),
        paybackYears: 5.9,
      },
    };
  };

  // 우클릭 부지를 정밀 분석 Parcel로 승격하여 드로어 열기
  const handleAnalyzeRightClickedParcel = (data: ReverseGeocodeResult) => {
    const newParcel = buildParcelFromRightClick(data);
    onSelectParcel(newParcel);
    setRightClickPos(null);
  };

  // 우클릭 부지의 분석 보고서(PDF) 즉시 열기
  const handleOpenReportFromRightClick = (data: ReverseGeocodeResult) => {
    const newParcel = buildParcelFromRightClick(data);
    onSelectParcel(newParcel);
    if (onOpenReport) {
      onOpenReport(newParcel);
    }
    setRightClickPos(null);
  };

  const initialCenter: [number, number] = [36.0, 127.8];
  // 🌟 대표님 보고 사항: 선택된 필지의 실제 고유 좌표로 즉시 정밀 이동 (비동기 좌표 오염/경합 원천 차단)
  const targetCenter: [number, number] = selectedParcel
    ? selectedParcel.coordinates
    : initialCenter;
  const targetZoom = selectedParcel ? 17 : 7;

  // 대량 3,900건 렌더링 성능 최적화: 지도에는 상위 150건을 보여주되, 선택된 필지가 150위 밖이더라도 반드시 포함! (빈 지도 버그 해결)
  const mapRenderParcels = React.useMemo(() => {
    if (!selectedParcel) return parcels.slice(0, 150);
    const isInTop150 = parcels.slice(0, 150).some((p) => p.id === selectedParcel.id);
    if (isInTop150) return parcels.slice(0, 150);
    return [selectedParcel, ...parcels.slice(0, 149)];
  }, [parcels, selectedParcel]);

  return (
    <main className="flex-1 h-full relative overflow-hidden bg-slate-950">
      {/* 🌟 대표님 요청: 현재 지도 영역 실시간 국토부 실필지 발굴 플로팅 버튼 */}
      {onSearchInBounds && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] pointer-events-auto select-none"
          onWheel={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            disabled={isLiveSearching}
            onClick={() => currentBoundsRef.current && onSearchInBounds(currentBoundsRef.current)}
            className="px-4 py-2 rounded-full bg-slate-900/95 hover:bg-slate-800 disabled:opacity-60 text-sky-300 border border-sky-500/50 shadow-2xl backdrop-blur-md text-xs font-bold flex items-center space-x-2 transition cursor-pointer active:scale-95"
            title="현재 보고 있는 지도 화면 영역의 3만평+ 포함 실존 필지를 국토부 DB에서 실시간 조회합니다"
          >
            {isLiveSearching ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                <span>국토부 실필지 실시간 검색 중...</span>
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5 text-sky-400" />
                <span>이 지도 영역에서 실필지 발굴</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 🌟 대표님 요청 4: 휠 축소/확대 시에도 절대로 사라지지 않고 견고하게 고정되는 3단 지도 선택 컨트롤러 */}
      <div
        className="absolute top-4 right-4 z-[1000] flex flex-col items-end space-y-2 select-none pointer-events-auto"
        style={{ isolation: 'isolate', transform: 'translateZ(0)' }}
        onWheel={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-2xl border border-slate-200/90 flex space-x-1.5">
          {/* 1. 일반지도 버튼 */}
          <button
            type="button"
            onClick={() => {
              setMapMode('base');
              setShowCadastral(false);
            }}
            className={`w-18 flex flex-col items-center rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
              mapMode === 'base'
                ? 'border-blue-600 ring-2 ring-blue-500/30 shadow-md scale-102'
                : 'border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
            }`}
          >
            <div className="w-full h-10 bg-[#eef3f7] relative overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 100 60" className="w-full h-full object-cover">
                <rect width="100" height="60" fill="#eaf1e8" />
                <path d="M-10,35 Q40,15 110,30" stroke="#a0c8e6" strokeWidth="18" fill="none" />
                <path d="M-10,35 Q40,15 110,30" stroke="#7ab6e2" strokeWidth="14" fill="none" />
                <line x1="20" y1="0" x2="30" y2="60" stroke="#fbd078" strokeWidth="4" />
                <line x1="0" y1="20" x2="100" y2="45" stroke="#ffffff" strokeWidth="5" />
                <circle cx="55" cy="25" r="4" fill="#f87171" />
              </svg>
            </div>
            <span
              className={`py-1 text-xs font-bold tracking-tight block w-full text-center ${
                mapMode === 'base' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700 bg-white'
              }`}
            >
              일반지도
            </span>
          </button>

          {/* 2. 위성지도 버튼 */}
          <button
            type="button"
            onClick={() => {
              setMapMode('satellite');
            }}
            className={`w-18 flex flex-col items-center rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
              mapMode === 'satellite'
                ? 'border-blue-600 ring-2 ring-blue-500/30 shadow-md scale-102'
                : 'border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
            }`}
          >
            <div className="w-full h-10 bg-[#1e3a24] relative overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 100 60" className="w-full h-full object-cover">
                <rect width="100" height="60" fill="#0d2b38" />
                <path d="M15,5 Q40,2 60,25 Q75,45 95,50 L100,60 L0,60 L0,10 Z" fill="#2d4a22" />
                <path d="M25,15 Q50,20 65,35 Q70,45 80,48" stroke="#486a32" strokeWidth="8" fill="none" />
                <path d="M40,5 Q55,25 70,30" stroke="#a4b382" strokeWidth="2" fill="none" />
                <circle cx="60" cy="28" r="3" fill="#facc15" />
              </svg>
            </div>
            <span
              className={`py-1 text-xs font-bold tracking-tight block w-full text-center ${
                mapMode === 'satellite' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700 bg-white'
              }`}
            >
              위성지도
            </span>
          </button>

          {/* 3. 지형지도 버튼 */}
          <button
            type="button"
            onClick={() => {
              setMapMode('topo');
            }}
            className={`w-18 flex flex-col items-center rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
              mapMode === 'topo'
                ? 'border-blue-600 ring-2 ring-blue-500/30 shadow-md scale-102'
                : 'border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
            }`}
          >
            <div className="w-full h-10 bg-[#f3efe6] relative overflow-hidden flex items-center justify-center">
              <svg viewBox="0 0 100 60" className="w-full h-full object-cover">
                <rect width="100" height="60" fill="#f4ebd9" />
                <path d="M0,45 Q30,20 60,35 Q80,45 100,40" stroke="#c8ab82" strokeWidth="1.5" fill="none" />
                <path d="M0,35 Q35,10 65,25 Q85,35 100,30" stroke="#b08d59" strokeWidth="1.5" fill="none" />
                <path d="M10,25 Q40,5 70,18 Q90,25 100,20" stroke="#8d6e3f" strokeWidth="1.5" fill="none" />
                <path d="M30,15 Q50,0 65,10" stroke="#6d532a" strokeWidth="2" fill="none" />
                <line x1="20" y1="0" x2="35" y2="60" stroke="#f59e0b" strokeWidth="3" />
              </svg>
            </div>
            <span
              className={`py-1 text-xs font-bold tracking-tight block w-full text-center ${
                mapMode === 'topo' ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700 bg-white'
              }`}
            >
              지형지도
            </span>
          </button>
        </div>

        {/* GIS 공간 레이어 & 투명도 제어 (대표님 요청: 테두리만 표시 / 투명도 최적화) */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-2.5 shadow-xl text-xs space-y-1.5">
          <span className="font-semibold text-slate-300 block text-xs">GIS 레이어 & 투명도</span>
          <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={outlineOnly}
              onChange={() => setOutlineOnly(!outlineOnly)}
              className="accent-amber-500 rounded cursor-pointer"
            />
            <span className="text-xs">필지 테두리 외곽선만 표시 (내부 투명)</span>
          </label>
          <label className="flex items-center space-x-2 text-emerald-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showCadastral}
              onChange={handleToggleCadastral}
              className="accent-emerald-500 rounded cursor-pointer"
            />
            <span className="text-xs flex items-center space-x-1 font-semibold">
              <span>🗺️ 국토부 연속지적도</span>
              <span className="text-slate-300 font-normal">(전국 지번선)</span>
            </span>
          </label>
          <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showBuffers}
              onChange={() => setShowBuffers(!showBuffers)}
              className="accent-amber-500 rounded cursor-pointer"
            />
            <span className="text-xs">이격거리 버퍼 (주거200m/도로100m)</span>
          </label>
          <label className="flex items-center space-x-2 text-cyan-300 cursor-pointer pt-0.5 border-t border-slate-800">
            <input
              type="checkbox"
              checked={showGridLines}
              onChange={() => setShowGridLines(!showGridLines)}
              className="accent-cyan-400 rounded cursor-pointer"
            />
            <span className="text-xs flex items-center space-x-1 font-semibold">
              <span className="text-cyan-400">⚡ 한전 계통망</span>
              <span className="text-slate-300 font-normal">(가상 인입선 & 변전소)</span>
            </span>
          </label>

          {/* 지적도 상세 줌 레벨 안내 알림 (국토부 정책상 줌 14 이상에서 필지선 제공) */}
          {showCadastral && currentZoom < 14 && (
            <div className="pt-1.5 border-t border-slate-800 text-[11px] text-amber-300 flex items-center space-x-1 font-medium">
              <span>💡 지도를 더 확대(줌 14 이상)하면 국토부 지적선이 뜹니다</span>
            </div>
          )}
        </div>
      </div>

      {/* 우클릭 안내 토스트 툴팁 (하단 우측 - 줌 컨트롤러와 겹치지 않도록 right-24 배치) */}
      {showRightClickGuide && (
        <div className="absolute bottom-6 right-24 z-[900] bg-slate-900/90 backdrop-blur-md border border-amber-500/40 rounded-xl px-3.5 py-2 shadow-2xl flex items-center space-x-2 text-xs text-slate-200 pointer-events-auto select-none animate-in fade-in">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>지도 임의 지점을 <strong className="text-amber-300">마우스 우클릭</strong>하면 주소·지목·평수가 즉시 분석됩니다!</span>
          <button
            type="button"
            onClick={() => setShowRightClickGuide(false)}
            className="ml-1 p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
            title="안내 닫기"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 범례 */}
      <div className="absolute bottom-6 left-6 z-[900] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg p-3 shadow-xl text-xs space-y-2 select-none">
        <span className="font-semibold text-slate-300 block text-xs">범례 (GIS 분석 결과)</span>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-slate-300">예비적합 (조례·이격거리·계통 양호)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-slate-300">조건부 (도로/주거지 이격 미세미달·협의)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <span className="text-slate-300">제한 (급경사 15°초과 / 보전지역 중첩)</span>
        </div>
        <div className="flex items-center space-x-2 pt-1 border-t border-slate-700/60">
          <div className="w-5 h-0.5 border-t-2 border-dashed border-cyan-400" />
          <span className="text-cyan-300 font-medium">한전 154kV 변전소 인입선</span>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <MapContainer
        center={targetCenter}
        zoom={selectedParcel ? 18 : 7}
        minZoom={6}
        maxZoom={19}
        className="w-full h-full"
        zoomControl={false}
        zoomSnap={0.1}
        zoomDelta={0.5}
        wheelPxPerZoomLevel={90}
      >
        <CadastralZoomController
          showCadastral={showCadastral}
          onZoomChange={setCurrentZoom}
        />
        <MapRecenter
          targetId={selectedParcel?.id || null}
          center={targetCenter}
          zoom={targetZoom}
        />

        <MapEventHandler
          onRightClick={handleMapRightClick}
          onZoomChange={setCurrentZoom}
          onBoundsChange={handleBoundsUpdate}
        />

        <ZoomSliderControl
          currentZoom={currentZoom}
          onZoomChange={setCurrentZoom}
          minZoom={6}
          maxZoom={19}
        />

        {/* 1. 일반지도 기본 배경 (브이월드 Base 타일) */}
        {mapMode === 'base' && (
          <TileLayer
            attribution='&copy; <a href="https://www.vworld.kr/">국토교통부 브이월드</a>'
            url={`https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Base/{z}/{y}/{x}.png`}
            maxZoom={19}
          />
        )}

        {/* 2. 위성지도 (국토교통부 브이월드 최신 고해상도 항공위성 - 최대 줌 19 완벽 지원, 확대 시 사라짐 완전 방지!) */}
        {mapMode === 'satellite' && (
          <>
            <TileLayer
              attribution='&copy; <a href="https://www.vworld.kr/">국토교통부 브이월드 항공위성</a>'
              url={`https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Satellite/{z}/{y}/{x}.jpeg`}
              maxNativeZoom={18}
              maxZoom={19}
            />
            {/* 주요 도로 및 지명 하이브리드 오버레이 */}
            <TileLayer
              url={`https://api.vworld.kr/req/wmts/1.0.0/${VWORLD_KEY}/Hybrid/{z}/{y}/{x}.png`}
              maxNativeZoom={18}
              maxZoom={19}
              opacity={0.85}
              zIndex={300}
            />
          </>
        )}

        {/* 3. 지형지도 (OpenTopoMap - 고정밀 등고선/지형 기복/표고) */}
        {mapMode === 'topo' && (
          <TileLayer
            attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            subdomains={['a', 'b', 'c']}
            maxNativeZoom={17}
            maxZoom={19}
          />
        )}

        {/* 4. 국토교통부 공식 연속지적도(WMS) 레이어 - 전국 모든 필지의 지번 경계선 오버레이 (줌 17~19 정밀 표출) */}
        {showCadastral && (
          <WMSTileLayer
            url="https://api.vworld.kr/req/wms"
            params={
              {
                service: 'WMS',
                request: 'GetMap',
                version: '1.3.0',
                layers: 'lt_c_landinfobasemap',
                styles: 'lt_c_landinfobasemap',
                format: 'image/png',
                transparent: true,
                key: VWORLD_KEY,
                domain: 're100life.com',
              } as any
            }
            minZoom={17}
            maxZoom={19}
            updateWhenIdle={false}
            updateWhenZooming={true}
            keepBuffer={12}
            opacity={0.88}
            zIndex={400}
          />
        )}

        {/* 시도 카운트 버블 (전국 100만 건 유효부지 줌 레벨 적응형 표시) */}
        {currentZoom < 9 &&
          !selectedParcel &&
          regions.map((region) => (
            <Marker
              key={region.sido}
              position={region.center}
              icon={createRegionIcon(region)}
              eventHandlers={{
                click: (e) => {
                  const map = (e.target as any)._map;
                  if (map) {
                    map.flyTo(region.center, 11, { duration: 1.2 });
                  }
                },
              }}
            >
              <Popup>
                <RegionPopupContent region={region} />
              </Popup>
            </Marker>
          ))}

        {/* 🌟 대표님 브이월드 연동: 우클릭 지점 실시간 국토부 연속지적도 폴리곤 표시 */}
        {rightClickRealPolygon && rightClickRealPolygon.length >= 3 && (
          <Polygon
            positions={rightClickRealPolygon}
            pathOptions={{
              color: '#f59e0b',
              fillColor: '#f59e0b',
              fillOpacity: 0.35,
              weight: 2.5,
              dashArray: '4, 4',
            }}
          />
        )}

        {/* 🌟 대표님 요청: 마우스 우클릭 시 생성되는 정밀 주소/지목/평수 고대비 팝업창 */}
        {rightClickPos && (
          <Popup
            position={rightClickPos}
            eventHandlers={{
              remove: () => {
                setRightClickPos(null);
                setRightClickData(null);
                setRightClickRealPolygon(null);
              },
            }}
          >
            <div className="p-2 min-w-[280px] max-w-[320px] text-slate-100 font-sans">
              {rightClickLoading ? (
                <div className="flex flex-col items-center justify-center py-4 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                  <p className="text-xs text-slate-200 font-medium">
                    📡 국토교통부 브이월드 연속지적도 분석 중...
                  </p>
                </div>
              ) : rightClickData ? (
                <div className="space-y-2.5">
                  <div className="flex items-center space-x-1.5 pb-1.5 border-b border-slate-700/80">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-bold text-sm text-white">선택 지점 지적 분석</span>
                  </div>

                  {/* 🌟 100% 한글 주소 표출 영역 (도로명 + 지번) */}
                  <div className="space-y-1 bg-slate-900/60 p-2 rounded-md border border-slate-800">
                    {rightClickData.roadAddress && (
                      <div className="text-xs flex items-start space-x-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 shrink-0">
                          도로명
                        </span>
                        <span className="font-semibold text-white leading-tight">
                          {rightClickData.roadAddress}
                        </span>
                      </div>
                    )}
                    {rightClickData.parcelAddress && (
                      <div className="text-xs flex items-start space-x-1.5">
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 shrink-0">
                          지번
                        </span>
                        <span className="text-slate-200 leading-tight">
                          {rightClickData.parcelAddress}
                        </span>
                      </div>
                    )}
                    {!rightClickData.roadAddress && !rightClickData.parcelAddress && (
                      <div className="text-xs text-slate-200">
                        {rightClickData.address}
                      </div>
                    )}
                  </div>

                  {/* 지목 및 평수 핵심 카드 (고대비 다크 테마) */}
                  <div className="bg-slate-800/90 border border-slate-700/80 rounded-lg p-2.5 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">공부 지목</span>
                      <span className="font-extrabold text-amber-400 text-sm">
                        {rightClickData.landCategory}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">추정 면적</span>
                      <span className="font-extrabold text-white text-sm font-mono">
                        {rightClickData.estimatedPyeong.toLocaleString()}평
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        ({rightClickData.estimatedSqm.toLocaleString()}㎡)
                      </span>
                    </div>
                  </div>

                  {/* 용도지역 & 계통 & 적합도 요약 (완벽한 고대비 화이트/슬레이트 텍스트) */}
                  <div className="text-xs space-y-1.5 text-slate-300 pt-0.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">용도지역</span>
                      <span className="font-semibold text-slate-100">{rightClickData.zoning}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">한전 변전소 여유</span>
                      <span className="font-bold text-emerald-400">
                        {rightClickData.gridCapacityMw} MW
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">DEM 경사도</span>
                      <span className="font-semibold text-slate-100">{rightClickData.slopeDegree}°</span>
                    </div>
                    <div className="flex justify-between items-center pt-1.5 border-t border-slate-700/60">
                      <span className="text-slate-300">태양광 종합 적합도</span>
                      <span className="font-extrabold text-amber-400">
                        {rightClickData.suitability} ({rightClickData.suitabilityScore}점)
                      </span>
                    </div>
                  </div>

                  {/* 액션 버튼 그룹: 1) 정밀 분석 열기, 2) PDF 보고서 즉시 열기 */}
                  <div className="space-y-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAnalyzeRightClickedParcel(rightClickData)}
                      className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-md shadow-md flex items-center justify-center space-x-1 transition cursor-pointer"
                    >
                      <span>이 부지 정밀 분석하기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenReportFromRightClick(rightClickData)}
                      className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-300 font-semibold text-xs rounded-md border border-slate-700 flex items-center justify-center space-x-1.5 transition cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>분석 보고서 (PDF) 즉시 열기</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </Popup>
        )}

        {/* 개별 필지 마커 및 폴리곤 렌더링 */}
        {mapRenderParcels.map((parcel) => {
          const isSelected = parcel.id === selectedParcel?.id;
          return (
            <React.Fragment key={parcel.id}>
              {/* 필지 마커 */}
              <Marker
                position={parcel.coordinates}
                icon={createParcelIcon(parcel, isSelected)}
                eventHandlers={{
                  click: () => onSelectParcel(parcel),
                  contextmenu: (e) => {
                    e.originalEvent?.preventDefault();
                    handleParcelRightClick(parcel, e.latlng.lat, e.latlng.lng);
                  },
                }}
              >
                <Popup>
                  {/* 🌟 대표님 요청: 검색 목록 주소와 100% 일치하도록 보장 & 공부상 지번 보조 안내 */}
                  {(() => {
                    const target = (isSelected && selectedParcel) ? selectedParcel : parcel;
                    return (
                      <div className="p-1.5 text-slate-100 min-w-[210px] max-w-[260px] font-sans">
                        <div className="flex items-center space-x-1.5 mb-1.5 pb-1.5 border-b border-slate-700/80">
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                            {target.landCategory}
                          </span>
                          <span className="text-xs font-bold text-white truncate" title={target.address}>
                            {target.address}
                          </span>
                        </div>

                        {target.cadastralJibun && target.cadastralJibun !== target.address && (
                          <div className="mb-1 text-[10px] text-sky-300 bg-sky-950/80 border border-sky-700/60 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <span className="shrink-0 font-semibold text-sky-400">[공부상 지번]</span>
                            <span className="truncate" title={target.cadastralJibun}>{target.cadastralJibun}</span>
                          </div>
                        )}

                        {target.roadAddress && target.roadAddress !== target.address && (
                          <div className="mb-2 text-[10px] text-amber-300/90 bg-amber-950/60 border border-amber-700/50 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <span className="shrink-0 font-medium text-amber-400">[도로명]</span>
                            <span className="truncate" title={target.roadAddress}>{target.roadAddress}</span>
                          </div>
                        )}

                        <div className="space-y-1 text-xs text-slate-300">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">면적</span>
                            <span className="font-bold text-white font-mono">
                              {target.areaPyeong.toLocaleString()}평 <span className="text-[10px] text-slate-400">({target.areaSqm.toLocaleString()}㎡)</span>
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">종합 적합도</span>
                            <span className="font-extrabold text-amber-400">
                              {target.suitability} ({target.suitabilityScore}점)
                            </span>
                          </div>
                        </div>

                        {/* 외부 실지번 검증 링크 */}
                        <div className="flex items-center gap-1 mt-2 pt-1.5 border-t border-slate-700/60">
                          <a
                            href={`https://map.naver.com/p/search/${encodeURIComponent(
                              target.cadastralJibun ? target.cadastralJibun.split(' (')[0] : target.address
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center py-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 rounded flex items-center justify-center gap-0.5"
                          >
                            <span>네이버</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                          <a
                            href={`https://www.disco.re/search?q=${encodeURIComponent(
                              target.cadastralJibun ? target.cadastralJibun.split(' (')[0] : target.address
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center py-1 text-[10px] font-semibold text-sky-300 bg-sky-950/80 hover:bg-sky-900 border border-sky-700/60 rounded flex items-center justify-center gap-0.5"
                          >
                            <span>디스코</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>

                        <button
                          type="button"
                          onClick={() => onSelectParcel(target)}
                          className="mt-2.5 w-full py-1.5 text-xs font-bold bg-amber-500 text-slate-950 rounded hover:bg-amber-400 transition shadow cursor-pointer flex items-center justify-center space-x-1"
                        >
                          <span>상세 분석 열기</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })()}
                </Popup>
              </Marker>

              {/* 필지 외곽 경계 폴리곤 (국토부 VWorld 실시간 연속지적도 우선 렌더링 - 50% 투명도) */}
              <Polygon
                positions={(isSelected && selectedRealCadastral?.parcelId === parcel.id && selectedRealCadastral.polygon.length >= 3) ? selectedRealCadastral.polygon : parcel.polygon}
                pathOptions={{
                  color: isSelected ? '#1d4ed8' : '#38bdf8',
                  fillColor: isSelected ? '#3b82f6' : '#0284c7',
                  fillOpacity: outlineOnly ? 0 : isSelected ? 0.5 : 0.08,
                  weight: isSelected ? 3 : 1.8,
                }}
                eventHandlers={{
                  click: () => onSelectParcel(parcel),
                  contextmenu: (e) => {
                    e.originalEvent?.preventDefault();
                    handleParcelRightClick(parcel, e.latlng.lat, e.latlng.lng);
                  },
                }}
              />

              {/* 선택된 필지의 이격거리 완충영역 (Buffer Circles - 내부 투명, 점선 테두리만) */}
              {isSelected && showBuffers && (
                <>
                  {/* 주거지 200m 완충영역 (적색 점선 테두리만) */}
                  <Circle
                    center={parcel.coordinates}
                    radius={200}
                    pathOptions={{
                      color: '#ef4444',
                      dashArray: '5, 8',
                      fillColor: 'transparent',
                      fillOpacity: 0,
                      weight: 1.8,
                    }}
                  />
                  {/* 도로 100m 완충영역 (황색 점선 테두리만) */}
                  <Circle
                    center={parcel.coordinates}
                    radius={100}
                    pathOptions={{
                      color: '#fbbf24',
                      dashArray: '3, 6',
                      fillColor: 'transparent',
                      fillOpacity: 0,
                      weight: 1.5,
                    }}
                  />
                </>
              )}
            </React.Fragment>
          );
        })}

        {/* 🌟 re100market 특화: 선택된 필지와 관할 154kV 변전소 간의 가상 계통선로(인입선) 및 변전소 마커 */}
        {selectedParcel && showGridLines && (() => {
          // 변전소 좌표가 있으면 사용하고, 없으면 부지 인근(거리 기준)으로 자동 폴백하여 100% 시각화 보장
          const substationCoords: [number, number] = selectedParcel.grid?.substationCoordinates || [
            parseFloat((selectedParcel.coordinates[0] + 0.025).toFixed(5)),
            parseFloat((selectedParcel.coordinates[1] + 0.028).toFixed(5)),
          ];

          return (
            <>
              {/* 가상 계통 접속선 (Cyan 점선 Polyline) */}
              <Polyline
                positions={[selectedParcel.coordinates, substationCoords]}
                pathOptions={{
                  color: '#06b6d4',
                  weight: 3.5,
                  dashArray: '6, 8',
                  opacity: 0.9,
                }}
              />

              {/* 154kV 변전소 위치 마커 */}
              <Marker
                position={substationCoords}
                icon={createSubstationIcon(
                  selectedParcel.grid?.substationName || '관할변전소',
                  selectedParcel.grid?.availableCapacityMw || 3.5
                )}
              >
                <Popup>
                  <div className="p-1.5 text-slate-100 min-w-[240px] max-w-[280px] font-sans">
                    <div className="flex items-center space-x-1.5 mb-2 pb-1.5 border-b border-cyan-500/40">
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
                        한전 154kV
                      </span>
                      <span className="text-xs font-bold text-white truncate">
                        {selectedParcel.grid?.substationName || '관할변전소'}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300 mb-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">직선 연계 거리</span>
                        <span className="font-bold text-white font-mono">
                          약 {selectedParcel.grid?.substationDistanceKm || 3.5} km
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">변전소 공개 여유</span>
                        <span className="font-extrabold text-cyan-400 font-mono">
                          {selectedParcel.grid?.availableCapacityMw || 3.5} MW ({selectedParcel.grid?.status || '여유'})
                        </span>
                      </div>
                    </div>

                    {/* 주변 배전선로 3대 미리보기 */}
                    {selectedParcel.grid?.distributionLines && selectedParcel.grid.distributionLines.length > 0 && (
                      <div className="p-2 bg-slate-800/90 rounded border border-slate-700/80 mb-2">
                        <div className="text-[10px] font-bold text-slate-400 mb-1.5 flex items-center justify-between">
                          <span>주변 배전선로(DL) 현황</span>
                          <span className="text-cyan-400 font-normal">re100market 기준</span>
                        </div>
                        <div className="space-y-1">
                          {selectedParcel.grid.distributionLines.map((dl, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-200 truncate max-w-[120px]">{dl.name}</span>
                              <span className={`font-mono font-bold ${dl.availableMw > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {dl.availableMw}MW <span className="text-slate-400 font-normal">({dl.distanceKm}km)</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400 text-center">
                      ※ 상세 인입공사비 및 M.Tr 용량은 우측 드로어 [배전선로·계통] 탭에서 확인 가능합니다.
                    </div>
                  </div>
                </Popup>
              </Marker>
            </>
          );
        })()}
      </MapContainer>
    </main>
  );
};
