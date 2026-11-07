export type LandCategory = 
  | '임야' 
  | '전' 
  | '답' 
  | '과수원' 
  | '잡종지' 
  | '목장용지' 
  | '대지' 
  | '염전'
  | '공장용지'
  | '창고용지'
  | string;

export type Zoning = 
  | '계획관리지역' 
  | '생산관리지역' 
  | '보전관리지역' 
  | '농림지역' 
  | '자연환경보전지역' 
  | '일반상업지역' 
  | '자연녹지지역'
  | '제1종일반주거지역'
  | '제2종일반주거지역'
  | '제3종일반주거지역'
  | '준주거지역'
  | '제1종전용주거지역'
  | '제2종전용주거지역'
  | '근린상업지역'
  | '유통상업지역'
  | '전용공업지역'
  | '일반공업지역'
  | '준공업지역'
  | '보전녹지지역'
  | '생산녹지지역'
  | string;

export type SuitabilityStatus = '예비적합' | '조건부' | '추가확인' | '제한';

export interface DistributionLine {
  name: string; // 배전선로 명칭 (예: '부동DL #3')
  availableMw: number; // 잔여 여유용량 (MW)
  status: '여유' | '보통' | '포화';
  distanceKm: number; // 선로 연계 직선거리
  estimatedInterconnectionCostWon: number; // 예상 한전 표준 인입공사비
  isRecommended?: boolean; // 최우선 추천 선로 여부
}

export interface RealEstateInfo {
  avgTradingPricePerPyeong: number; // 인근 최근 3년 실거래 평균 평당 단가 (원)
  estimatedLandPriceTotalWon: number; // 추정 토지 매입/임대 총액 (원)
  roadAccess: string; // 도로 접면 현황 (예: '폭 4m 포장도로 접면', '2차선 아스팔트 대로 접면', '맹지')
  isLandlocked: boolean; // 맹지 여부
  ownershipType: '개인' | '법인' | '국유지/공유지' | '종중'; // 토지 소유 구분
  recentTradesCount: number; // 인근 1km 이내 최근 3년 실거래 건수
}

export interface Parcel {
  id: string;
  pnu: string; // 19자리 고유식별번호
  address: string;
  roadAddress?: string; // 도로명 주소 (예: 전주시 덕진구 월방1길 3-8)
  cadastralJibun?: string; // 국토부 공인 실필지 지번 (예: 전라남도 해남군 황산면 원호리 산43-1임)
  sido: string;
  sigungu: string;
  bjdong: string;
  landCategory: LandCategory;
  areaPyeong: number;
  areaSqm: number;
  zoning: Zoning;
  officialPrice: number; // ㎡당 공시지가 (원)
  
  // 지형 및 공간 위치
  coordinates: [number, number]; // [lat, lng]
  polygon: [number, number][]; // 필지 외곽 경계
  slopeDegree: number; // 평균 경사도
  aspect: string; // 사면 방향 (남향, 남동향 등)

  // 규제 및 조례 분석
  suitability: SuitabilityStatus;
  suitabilityScore: number; // 100점 만점
  regulationChecks: {
    residentialDistance: { distance: number; required: number; pass: boolean; ordinance: string };
    roadDistance: { distance: number; required: number; pass: boolean; ordinance: string };
    protectionZone: { intersected: boolean; zoneName: string; areaRatio: number };
    slopeCheck: { degree: number; limit: number; pass: boolean };
  };

  // 🌟 re100market.com 벤치마킹: 한전 변전소 & 주변 배전선로(DL) 3대 연계 계통망
  grid: {
    substationName: string;
    substationDistanceKm: number;
    substationCoordinates?: [number, number]; // 변전소 실제 좌표 (지도상 점선 연결용)
    substationCapacityTotalMw?: number; // 154kV 변전소 총 잔여 용량
    mtrNumber?: string; // 관할 주변압기 (#1 M.Tr, #2 M.Tr)
    mtrAvailableMw?: number; // 주변압기 잔여 여유용량
    dlName: string; // 대표 추천 선로
    availableCapacityMw: number;
    status: '여유' | '보통' | '포화';
    updatedAt: string;
    distributionLines?: DistributionLine[]; // 인근 3대 배전선로 목록
  };

  // 🌟 disco.re 벤치마킹: 토지 실거래가 및 평당 단가 / 도로 접면 / 공적장부
  realEstate?: RealEstateInfo;

  // 일사량 및 발전량
  solar: {
    ghiAnnualAvg: number; // kWh/m2/day
    estimatedCapacityKwp: number;
    effectiveAreaSqm: number;
    annualGenerationKwh: number;
  };

  // 경제성 시뮬레이션
  financials: {
    capexTotalWon: number;
    annualRevenueWon: number;
    annualOpexWon: number;
    irrPercent: number;
    npvWon: number;
    paybackYears: number;
  };
}

export interface RegionSummary {
  sido: string;
  candidateCount: number;
  center: [number, number];
  gridCapacityAvg: number;
}
