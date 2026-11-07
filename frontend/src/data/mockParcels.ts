import type {
  Parcel,
  RegionSummary,
  LandCategory,
  Zoning,
  SuitabilityStatus,
  DistributionLine,
} from '../types/solar';

export const REGION_SUMMARIES: RegionSummary[] = [
  { sido: '전라남도', candidateCount: 842, center: [34.816, 126.65], gridCapacityAvg: 4.8 },
  { sido: '전북특별자치도', candidateCount: 620, center: [35.717, 127.153], gridCapacityAvg: 3.2 },
  { sido: '충청남도', candidateCount: 512, center: [36.518, 126.8], gridCapacityAvg: 2.7 },
  { sido: '경상북도', candidateCount: 730, center: [36.491, 128.888], gridCapacityAvg: 3.5 },
  { sido: '강원특별자치도', candidateCount: 310, center: [37.822, 128.155], gridCapacityAvg: 1.9 },
  { sido: '경상남도', candidateCount: 425, center: [35.46, 128.21], gridCapacityAvg: 2.4 },
  { sido: '충청북도', candidateCount: 280, center: [36.8, 127.7], gridCapacityAvg: 2.1 },
  { sido: '경기도', candidateCount: 195, center: [37.413, 127.518], gridCapacityAvg: 1.2 },
];

// 대표 6대 기준 필지
const SEED_PARCELS: Parcel[] = [
  {
    id: 'p1',
    pnu: '4682031024101240000',
    address: '전라남도 해남군 산이면 부동리 124',
    sido: '전라남도',
    sigungu: '해남군',
    bjdong: '산이면',
    landCategory: '잡종지',
    areaPyeong: 2450,
    areaSqm: 8099,
    zoning: '계획관리지역',
    officialPrice: 28500,
    coordinates: [34.66571, 126.39948],
    // 🌟 국토부 연속지적도 124답 실필지 정밀 경계선 (801도 도로 및 118전 침범 방지)
    polygon: [
      [34.66588, 126.39942],
      [34.66578, 126.39946],
      [34.66552, 126.39947],
      [34.66538, 126.39953],
      [34.66545, 126.39958],
      [34.66558, 126.39961],
      [34.66572, 126.39960],
      [34.66585, 126.39954],
      [34.66588, 126.39942],
    ],
    slopeDegree: 3.2,
    aspect: '정남향 (180°)',
    suitability: '예비적합',
    suitabilityScore: 94,
    regulationChecks: {
      residentialDistance: { distance: 380, required: 200, pass: true, ordinance: '해남군 도시계획조례 제20조의2' },
      roadDistance: { distance: 180, required: 100, pass: true, ordinance: '해남군 도로구역 완충조례' },
      protectionZone: { intersected: false, zoneName: '해당없음', areaRatio: 0 },
      slopeCheck: { degree: 3.2, limit: 15, pass: true },
    },
    grid: {
      substationName: '산이변전소',
      substationDistanceKm: 3.8,
      substationCoordinates: [34.685, 126.425],
      substationCapacityTotalMw: 14.5,
      mtrNumber: '#2 M.Tr',
      mtrAvailableMw: 4.8,
      dlName: '부동DL #3',
      availableCapacityMw: 4.5,
      status: '여유',
      updatedAt: '2026-11-01',
      distributionLines: [
        {
          name: '부동DL #3',
          availableMw: 4.5,
          status: '여유',
          distanceKm: 1.2,
          estimatedInterconnectionCostWon: 54000000,
          isRecommended: true,
        },
        {
          name: '산이DL #1',
          availableMw: 1.4,
          status: '보통',
          distanceKm: 2.8,
          estimatedInterconnectionCostWon: 126000000,
        },
        {
          name: '마산DL #2',
          availableMw: 0.1,
          status: '포화',
          distanceKm: 3.5,
          estimatedInterconnectionCostWon: 157500000,
        },
      ],
    },
    realEstate: {
      avgTradingPricePerPyeong: 85000,
      estimatedLandPriceTotalWon: 208250000,
      roadAccess: '폭 4m 포장 농로 접면 (개발행위 진입로 확보)',
      isLandlocked: false,
      ownershipType: '개인',
      recentTradesCount: 7,
    },
    solar: {
      ghiAnnualAvg: 3.85,
      effectiveAreaSqm: 7100,
      estimatedCapacityKwp: 495,
      annualGenerationKwh: 695475,
    },
    financials: {
      capexTotalWon: 620000000,
      annualRevenueWon: 118230000,
      annualOpexWon: 11000000,
      irrPercent: 9.8,
      npvWon: 345000000,
      paybackYears: 5.7,
    },
  },
  {
    id: 'p2',
    pnu: '4479032021100450000',
    address: '충청남도 태안군 남면 신온리 45',
    sido: '충청남도',
    sigungu: '태안군',
    bjdong: '남면',
    landCategory: '임야',
    areaPyeong: 4800,
    areaSqm: 15867,
    zoning: '생산관리지역',
    officialPrice: 19800,
    coordinates: [36.6110, 126.2937],
    // 🌟 국토교통부 토지이음/브이월드/네이버/카카오 공인 지적도 실필지 12개 정밀 꼭짓점 (완벽 일치)
    polygon: [
      [36.611249, 126.294639],
      [36.611539, 126.294448],
      [36.611437, 126.294097],
      [36.611518, 126.293607],
      [36.611249, 126.293395],
      [36.611222, 126.292857],
      [36.610873, 126.292645],
      [36.610625, 126.292756],
      [36.610830, 126.293544],
      [36.610539, 126.293629],
      [36.611007, 126.294421],
      [36.610942, 126.294645],
    ],
    slopeDegree: 8.5,
    aspect: '남동향 (145°)',
    suitability: '예비적합',
    suitabilityScore: 88,
    regulationChecks: {
      residentialDistance: { distance: 420, required: 300, pass: true, ordinance: '태안군 도시계획조례 제18조' },
      roadDistance: { distance: 150, required: 100, pass: true, ordinance: '태안군 군도변 개발행위허가기준' },
      protectionZone: { intersected: false, zoneName: '준보전산지', areaRatio: 0 },
      slopeCheck: { degree: 8.5, limit: 18, pass: true },
    },
    grid: {
      substationName: '남태안변전소',
      substationDistanceKm: 6.2,
      substationCoordinates: [36.635, 126.315],
      substationCapacityTotalMw: 11.2,
      mtrNumber: '#1 M.Tr',
      mtrAvailableMw: 3.5,
      dlName: '신온DL #1',
      availableCapacityMw: 2.8,
      status: '여유',
      updatedAt: '2026-10-28',
      distributionLines: [
        {
          name: '신온DL #1',
          availableMw: 2.8,
          status: '여유',
          distanceKm: 1.8,
          estimatedInterconnectionCostWon: 81000000,
          isRecommended: true,
        },
        {
          name: '남면DL #2',
          availableMw: 1.2,
          status: '보통',
          distanceKm: 3.4,
          estimatedInterconnectionCostWon: 153000000,
        },
        {
          name: '태안DL #4',
          availableMw: 0.3,
          status: '포화',
          distanceKm: 6.2,
          estimatedInterconnectionCostWon: 279000000,
        },
      ],
    },
    realEstate: {
      avgTradingPricePerPyeong: 62000,
      estimatedLandPriceTotalWon: 297600000,
      roadAccess: '폭 4m 포장 농로 접면 (진입 양호)',
      isLandlocked: false,
      ownershipType: '개인',
      recentTradesCount: 5,
    },
    solar: {
      ghiAnnualAvg: 3.72,
      effectiveAreaSqm: 13200,
      estimatedCapacityKwp: 920,
      annualGenerationKwh: 1249360,
    },
    financials: {
      capexTotalWon: 1140000000,
      annualRevenueWon: 212390000,
      annualOpexWon: 19500000,
      irrPercent: 8.9,
      npvWon: 520000000,
      paybackYears: 6.2,
    },
  },
  {
    id: 'p3',
    pnu: '4725034026100880000',
    address: '경상북도 상주시 화남면 동관리 88',
    sido: '경상북도',
    sigungu: '상주시',
    bjdong: '화남면',
    landCategory: '전',
    areaPyeong: 1850,
    areaSqm: 6115,
    zoning: '계획관리지역',
    officialPrice: 32000,
    coordinates: [36.4777, 127.9378],
    polygon: [
      [36.47795, 127.93755],
      [36.47802, 127.93792],
      [36.47778, 127.93812],
      [36.47748, 127.93798],
      [36.47738, 127.93765],
      [36.47765, 127.93745],
    ],
    slopeDegree: 4.8,
    aspect: '남서향 (210°)',
    suitability: '조건부',
    suitabilityScore: 78,
    regulationChecks: {
      residentialDistance: { distance: 230, required: 200, pass: true, ordinance: '상주시 도시계획조례 제22조' },
      roadDistance: { distance: 95, required: 100, pass: false, ordinance: '국도 및 지방도 이격기준 미달 (5m 차)' },
      protectionZone: { intersected: false, zoneName: '해당없음', areaRatio: 0 },
      slopeCheck: { degree: 4.8, limit: 15, pass: true },
    },
    grid: {
      substationName: '화남변전소',
      substationDistanceKm: 2.4,
      substationCoordinates: [36.495, 127.955],
      substationCapacityTotalMw: 8.5,
      mtrNumber: '#1 M.Tr',
      mtrAvailableMw: 1.8,
      dlName: '동관DL',
      availableCapacityMw: 1.1,
      status: '보통',
      updatedAt: '2026-11-02',
      distributionLines: [
        {
          name: '동관DL',
          availableMw: 1.1,
          status: '보통',
          distanceKm: 2.4,
          estimatedInterconnectionCostWon: 108000000,
          isRecommended: true,
        },
        {
          name: '화남DL #2',
          availableMw: 0.4,
          status: '포화',
          distanceKm: 3.1,
          estimatedInterconnectionCostWon: 139500000,
        },
        {
          name: '상주DL #3',
          availableMw: 2.5,
          status: '여유',
          distanceKm: 5.8,
          estimatedInterconnectionCostWon: 261000000,
        },
      ],
    },
    realEstate: {
      avgTradingPricePerPyeong: 58000,
      estimatedLandPriceTotalWon: 107300000,
      roadAccess: '폭 4m 포장 농로 접면 (진입 양호)',
      isLandlocked: false,
      ownershipType: '개인',
      recentTradesCount: 4,
    },
    solar: {
      ghiAnnualAvg: 3.65,
      effectiveAreaSqm: 5200,
      estimatedCapacityKwp: 360,
      annualGenerationKwh: 479520,
    },
    financials: {
      capexTotalWon: 450000000,
      annualRevenueWon: 81518000,
      annualOpexWon: 8200000,
      irrPercent: 7.9,
      npvWon: 185000000,
      paybackYears: 6.8,
    },
  },
  {
    id: 'p4',
    pnu: '4687031021101900001',
    address: '전라남도 영광군 백수읍 길용리 190-1',
    sido: '전라남도',
    sigungu: '영광군',
    bjdong: '백수읍',
    landCategory: '염전',
    areaPyeong: 6200,
    areaSqm: 20495,
    zoning: '생산관리지역',
    officialPrice: 24000,
    coordinates: [35.3288, 126.4364],
    polygon: [
      [35.32925, 126.43595],
      [35.32938, 126.43675],
      [35.32905, 126.43710],
      [35.32845, 126.43685],
      [35.32835, 126.43605],
      [35.32875, 126.43575],
    ],
    slopeDegree: 1.1,
    aspect: '평지 (전방위)',
    suitability: '예비적합',
    suitabilityScore: 96,
    regulationChecks: {
      residentialDistance: { distance: 650, required: 300, pass: true, ordinance: '영광군 발전시설허가기준 조례' },
      roadDistance: { distance: 220, required: 100, pass: true, ordinance: '영광군 도로 이격 완충 규정' },
      protectionZone: { intersected: false, zoneName: '해당없음', areaRatio: 0 },
      slopeCheck: { degree: 1.1, limit: 15, pass: true },
    },
    grid: {
      substationName: '백수변전소',
      substationDistanceKm: 4.9,
      substationCoordinates: [35.352, 126.458],
      substationCapacityTotalMw: 18.0,
      mtrNumber: '#2 M.Tr',
      mtrAvailableMw: 6.8,
      dlName: '길용DL #2',
      availableCapacityMw: 6.2,
      status: '여유',
      updatedAt: '2026-11-03',
      distributionLines: [
        {
          name: '길용DL #2',
          availableMw: 6.2,
          status: '여유',
          distanceKm: 2.1,
          estimatedInterconnectionCostWon: 94500000,
          isRecommended: true,
        },
        {
          name: '백수DL #1',
          availableMw: 3.5,
          status: '여유',
          distanceKm: 4.9,
          estimatedInterconnectionCostWon: 220500000,
        },
        {
          name: '영광DL #5',
          availableMw: 1.2,
          status: '보통',
          distanceKm: 7.2,
          estimatedInterconnectionCostWon: 324000000,
        },
      ],
    },
    realEstate: {
      avgTradingPricePerPyeong: 45000,
      estimatedLandPriceTotalWon: 279000000,
      roadAccess: '2차선 아스팔트 포장도로 접면 (진입 최상)',
      isLandlocked: false,
      ownershipType: '개인',
      recentTradesCount: 9,
    },
    solar: {
      ghiAnnualAvg: 3.88,
      effectiveAreaSqm: 18500,
      estimatedCapacityKwp: 1280,
      annualGenerationKwh: 1812736,
    },
    financials: {
      capexTotalWon: 1580000000,
      annualRevenueWon: 308165000,
      annualOpexWon: 27000000,
      irrPercent: 10.4,
      npvWon: 890000000,
      paybackYears: 5.4,
    },
  },
  {
    id: 'p5',
    pnu: '4717032025103120000',
    address: '경상북도 안동시 풍천면 하회리 312',
    sido: '경상북도',
    sigungu: '안동시',
    bjdong: '풍천면',
    landCategory: '임야',
    areaPyeong: 3400,
    areaSqm: 11239,
    zoning: '농림지역',
    officialPrice: 14500,
    coordinates: [36.5494, 128.5285],
    polygon: [
      [36.54980, 128.52820],
      [36.54992, 128.52865],
      [36.54965, 128.52895],
      [36.54932, 128.52885],
      [36.54915, 128.52845],
      [36.54940, 128.52815],
    ],
    slopeDegree: 16.8,
    aspect: '북서향 (315°)',
    suitability: '제한',
    suitabilityScore: 42,
    regulationChecks: {
      residentialDistance: { distance: 180, required: 300, pass: false, ordinance: '안동시 도시계획조례 (300m 이격 미달)' },
      roadDistance: { distance: 110, required: 100, pass: true, ordinance: '지방도 100m 기준 충족' },
      protectionZone: { intersected: true, zoneName: '역사문화환경보존지역 (하회마을 외곽)', areaRatio: 0.35 },
      slopeCheck: { degree: 16.8, limit: 15, pass: false },
    },
    grid: {
      substationName: '풍천변전소',
      substationDistanceKm: 7.8,
      substationCoordinates: [36.572, 128.552],
      substationCapacityTotalMw: 3.2,
      mtrNumber: '#1 M.Tr',
      mtrAvailableMw: 0.3,
      dlName: '하회DL',
      availableCapacityMw: 0.2,
      status: '포화',
      updatedAt: '2026-10-25',
      distributionLines: [
        {
          name: '하회DL',
          availableMw: 0.2,
          status: '포화',
          distanceKm: 3.8,
          estimatedInterconnectionCostWon: 171000000,
          isRecommended: true,
        },
        {
          name: '풍천DL #3',
          availableMw: 0.0,
          status: '포화',
          distanceKm: 7.8,
          estimatedInterconnectionCostWon: 351000000,
        },
        {
          name: '안동DL #1',
          availableMw: 1.5,
          status: '보통',
          distanceKm: 12.4,
          estimatedInterconnectionCostWon: 558000000,
        },
      ],
    },
    realEstate: {
      avgTradingPricePerPyeong: 35000,
      estimatedLandPriceTotalWon: 119000000,
      roadAccess: '폭 3m 비포장 농로 접면 (진입로 협소)',
      isLandlocked: false,
      ownershipType: '종중',
      recentTradesCount: 2,
    },
    solar: {
      ghiAnnualAvg: 3.42,
      effectiveAreaSqm: 5800,
      estimatedCapacityKwp: 380,
      annualGenerationKwh: 474392,
    },
    financials: {
      capexTotalWon: 530000000,
      annualRevenueWon: 80646000,
      annualOpexWon: 9500000,
      irrPercent: 4.8,
      npvWon: 25000000,
      paybackYears: 8.9,
    },
  },
  {
    id: 'p6',
    pnu: '4571031022100670000',
    address: '전북특별자치도 완주군 삼례읍 수계리 67',
    sido: '전북특별자치도',
    sigungu: '완주군',
    bjdong: '삼례읍',
    landCategory: '답',
    areaPyeong: 1600,
    areaSqm: 5289,
    zoning: '생산관리지역',
    officialPrice: 41000,
    coordinates: [35.9163, 127.1264],
    polygon: [
      [35.91665, 127.12605],
      [35.91675, 127.12670],
      [35.91645, 127.12695],
      [35.91605, 127.12675],
      [35.91595, 127.12615],
      [35.91625, 127.12585],
    ],
    slopeDegree: 2.1,
    aspect: '남향 (175°)',
    suitability: '예비적합',
    suitabilityScore: 91,
    regulationChecks: {
      residentialDistance: { distance: 310, required: 200, pass: true, ordinance: '완주군 도시계획조례 제19조' },
      roadDistance: { distance: 130, required: 80, pass: true, ordinance: '군도 기준 통과' },
      protectionZone: { intersected: false, zoneName: '해당없음', areaRatio: 0 },
      slopeCheck: { degree: 2.1, limit: 15, pass: true },
    },
    grid: {
      substationName: '삼례변전소',
      substationDistanceKm: 2.8,
      substationCoordinates: [35.935, 127.145],
      substationCapacityTotalMw: 15.6,
      mtrNumber: '#2 M.Tr',
      mtrAvailableMw: 4.2,
      dlName: '수계DL #1',
      availableCapacityMw: 3.4,
      status: '여유',
      updatedAt: '2026-11-01',
      distributionLines: [
        {
          name: '수계DL #1',
          availableMw: 3.4,
          status: '여유',
          distanceKm: 1.5,
          estimatedInterconnectionCostWon: 67500000,
          isRecommended: true,
        },
        {
          name: '삼례DL #2',
          availableMw: 2.1,
          status: '여유',
          distanceKm: 2.8,
          estimatedInterconnectionCostWon: 126000000,
        },
        {
          name: '완주DL #5',
          availableMw: 0.8,
          status: '보통',
          distanceKm: 5.4,
          estimatedInterconnectionCostWon: 243000000,
        },
      ],
    },
    realEstate: {
      avgTradingPricePerPyeong: 78000,
      estimatedLandPriceTotalWon: 124800000,
      roadAccess: '폭 4m 포장 농로 접면 (진입 양호)',
      isLandlocked: false,
      ownershipType: '개인',
      recentTradesCount: 6,
    },
    solar: {
      ghiAnnualAvg: 3.75,
      effectiveAreaSqm: 4600,
      estimatedCapacityKwp: 320,
      annualGenerationKwh: 438000,
    },
    financials: {
      capexTotalWon: 410000000,
      annualRevenueWon: 74460000,
      annualOpexWon: 7500000,
      irrPercent: 9.3,
      npvWon: 235000000,
      paybackYears: 5.9,
    },
  },
];

interface BjdongCoord {
  name: string;
  ri?: string;
  lat: number;
  lng: number;
}

interface SigunguData {
  name: string;
  bjdongs: (string | BjdongCoord)[];
  lat: number;
  lng: number;
}

// 대한민국 8개 광역 권역별 실제 행정구역 및 3,914건 전국 후보지 생성 엔진
const REGION_DATA: { sido: string; code: string; count: number; sigungus: SigunguData[] }[] = [
  {
    sido: '전라남도',
    code: '46',
    count: 842,
    sigungus: [
      {
        name: '해남군',
        bjdongs: [
          { name: '화원면', ri: '후산리', lat: 34.6950, lng: 126.2840 },
          { name: '화원면', ri: '구림리', lat: 34.6980, lng: 126.2920 },
          { name: '화원면', ri: '산호리', lat: 34.7120, lng: 126.2750 },
          { name: '화원면', ri: '매월리', lat: 34.6750, lng: 126.2550 },
          { name: '산이면', ri: '부동리', lat: 34.6657, lng: 126.3995 },
          { name: '산이면', ri: '상공리', lat: 34.6820, lng: 126.4150 },
          { name: '산이면', ri: '덕호리', lat: 34.6520, lng: 126.4420 },
          { name: '산이면', ri: '구성리', lat: 34.6710, lng: 126.4280 },
          { name: '문내면', ri: '학동리', lat: 34.6250, lng: 126.3250 },
          { name: '문내면', ri: '용암리', lat: 34.6410, lng: 126.3120 },
          { name: '황산면', ri: '남리', lat: 34.5950, lng: 126.4520 },
          { name: '황산면', ri: '연호리', lat: 34.5820, lng: 126.4850 },
          { name: '마산면', ri: '연구리', lat: 34.6150, lng: 126.5450 },
        ],
        lat: 34.665,
        lng: 126.399,
      },
      {
        name: '영광군',
        bjdongs: [
          { name: '백수읍', ri: '하사리', lat: 35.2950, lng: 126.3820 },
          { name: '백수읍', ri: '백암리', lat: 35.3120, lng: 126.3950 },
          { name: '염산면', ri: '두우리', lat: 35.1950, lng: 126.3520 },
          { name: '염산면', ri: '야월리', lat: 35.2150, lng: 126.3850 },
          { name: '군남면', ri: '포천리', lat: 35.2420, lng: 126.4820 },
          { name: '홍농읍', ri: '계봉리', lat: 35.3850, lng: 126.4250 },
        ],
        lat: 35.277,
        lng: 126.452,
      },
      {
        name: '신안군',
        // 🌟 도서 지역 바다 좌표 이탈 완전 방지: 비금면, 지도읍, 압해읍 등 각 섬의 실제 육지 중심 좌표 개별 지정!
        bjdongs: [
          { name: '비금면', ri: '덕산리', lat: 34.7552, lng: 125.9354 },
          { name: '지도읍', ri: '감정리', lat: 35.0561, lng: 126.2418 },
          { name: '압해읍', ri: '신용리', lat: 34.8624, lng: 126.3421 },
          { name: '임자면', ri: '대기리', lat: 35.0883, lng: 126.1125 },
          { name: '자은면', ri: '구영리', lat: 34.8872, lng: 126.0423 },
        ],
        lat: 34.831,
        lng: 126.351,
      },
      {
        name: '고흥군',
        bjdongs: [
          { name: '도양읍', ri: '봉암리', lat: 34.5250, lng: 127.1420 },
          { name: '풍양면', ri: '고옥리', lat: 34.5650, lng: 127.2150 },
          { name: '도화면', ri: '발포리', lat: 34.4850, lng: 127.2850 },
          { name: '포두면', ri: '길두리', lat: 34.5850, lng: 127.3520 },
          { name: '과역면', ri: '과역리', lat: 34.6850, lng: 127.3650 },
        ],
        lat: 34.585,
        lng: 127.285,
      },
      {
        name: '영암군',
        bjdongs: [
          { name: '학산면', ri: '용산리', lat: 34.7361, lng: 126.6228 },
          { name: '학산면', ri: '독천리', lat: 34.7325, lng: 126.6185 },
          { name: '학산면', ri: '은곡리', lat: 34.7412, lng: 126.6345 },
          { name: '삼호읍', ri: '용앙리', lat: 34.7640, lng: 126.4670 },
          { name: '시종면', ri: '만수리', lat: 34.8450, lng: 126.6120 },
          { name: '도포면', ri: '도포리', lat: 34.8210, lng: 126.6540 },
          { name: '서호면', ri: '장천리', lat: 34.7550, lng: 126.5820 },
        ],
        lat: 34.7361,
        lng: 126.6228,
      },
    ],
  },
  {
    sido: '전북특별자치도',
    code: '45',
    count: 620,
    sigungus: [
      {
        name: '완주군',
        bjdongs: [
          { name: '삼례읍', ri: '신금리', lat: 35.9150, lng: 127.0520 },
          { name: '봉동읍', ri: '구만리', lat: 35.9350, lng: 127.1420 },
          { name: '용진읍', ri: '상운리', lat: 35.8850, lng: 127.1850 },
          { name: '고산면', ri: '삼기리', lat: 35.9850, lng: 127.2150 },
          { name: '동상면', ri: '신월리', lat: 35.9555, lng: 127.2874 },
          { name: '이서면', ri: '갈산리', lat: 35.8350, lng: 127.0520 },
        ],
        lat: 35.935,
        lng: 127.185,
      },
      {
        name: '고창군',
        bjdongs: [
          { name: '고창읍', ri: '율계리', lat: 35.4350, lng: 126.7020 },
          { name: '아산면', ri: '반암리', lat: 35.4520, lng: 126.6350 },
          { name: '무장면', ri: '옥택리', lat: 35.4150, lng: 126.5950 },
          { name: '공음면', ri: '장곡리', lat: 35.3850, lng: 126.5350 },
          { name: '상하면', ri: '자룡리', lat: 35.3950, lng: 126.4850 },
          { name: '해리면', ri: '광승리', lat: 35.4650, lng: 126.5150 },
        ],
        lat: 35.435,
        lng: 126.635,
      },
      {
        name: '부안군',
        bjdongs: [
          { name: '계화면', ri: '창북리', lat: 35.7650, lng: 126.7350 },
          { name: '계화면', ri: '계화리', lat: 35.7950, lng: 126.6950 },
          { name: '보안면', ri: '영전리', lat: 35.6550, lng: 126.6850 },
          { name: '줄포면', ri: '줄포리', lat: 35.5850, lng: 126.6650 },
          { name: '변산면', ri: '격포리', lat: 35.6250, lng: 126.5250 },
        ],
        lat: 35.731,
        lng: 126.733,
      },
      {
        name: '정읍시',
        bjdongs: [
          { name: '신태인읍', ri: '신태인리', lat: 35.6950, lng: 126.8950 },
          { name: '북면', ri: '화곡리', lat: 35.6350, lng: 126.8850 },
          { name: '입암면', ri: '단곡리', lat: 35.4950, lng: 126.8450 },
          { name: '태인면', ri: '태성리', lat: 35.6550, lng: 126.9450 },
          { name: '감곡면', ri: '유정리', lat: 35.6850, lng: 126.8350 },
        ],
        lat: 35.569,
        lng: 126.857,
      },
      {
        name: '김제시',
        bjdongs: [
          { name: '만경읍', ri: '대동리', lat: 35.8550, lng: 126.8350 },
          { name: '백산면', ri: '하정리', lat: 35.8450, lng: 126.8950 },
          { name: '공덕면', ri: '황산리', lat: 35.8850, lng: 126.9150 },
          { name: '청하면', ri: '동지산리', lat: 35.9150, lng: 126.8650 },
          { name: '성덕면', ri: '대목리', lat: 35.8150, lng: 126.7950 },
        ],
        lat: 35.803,
        lng: 126.880,
      },
    ],
  },
  {
    sido: '충청남도',
    code: '44',
    count: 512,
    sigungus: [
      {
        name: '태안군',
        bjdongs: [
          { name: '남면', ri: '당암리', lat: 36.6520, lng: 126.3450 },
          { name: '남면', ri: '신온리', lat: 36.6350, lng: 126.3150 },
          { name: '안면읍', ri: '창기리', lat: 36.5650, lng: 126.3520 },
          { name: '원북면', ri: '방갈리', lat: 36.8520, lng: 126.2150 },
          { name: '소원면', ri: '모항리', lat: 36.7850, lng: 126.1520 },
        ],
        lat: 36.685,
        lng: 126.285,
      },
      {
        name: '서산시',
        bjdongs: [
          { name: '부석면', ri: '창리', lat: 36.6150, lng: 126.4250 },
          { name: '부석면', ri: '간월도리', lat: 36.5850, lng: 126.4420 },
          { name: '대산읍', ri: '화곡리', lat: 36.9850, lng: 126.4150 },
          { name: '팔봉면', ri: '진장리', lat: 36.8150, lng: 126.3850 },
        ],
        lat: 36.685,
        lng: 126.425,
      },
      {
        name: '당진시',
        bjdongs: [
          { name: '석문면', ri: '교로리', lat: 37.0150, lng: 126.5150 },
          { name: '석문면', ri: '삼봉리', lat: 36.9850, lng: 126.5650 },
          { name: '합덕읍', ri: '대전리', lat: 36.8150, lng: 126.7520 },
          { name: '우강면', ri: '송산리', lat: 36.8520, lng: 126.7950 },
        ],
        lat: 36.915,
        lng: 126.655,
      },
      {
        name: '보령시',
        bjdongs: [
          { name: '웅천읍', ri: '독산리', lat: 36.2550, lng: 126.5550 },
          { name: '천북면', ri: '학성리', lat: 36.4850, lng: 126.4950 },
          { name: '남포면', ri: '월전리', lat: 36.3150, lng: 126.5650 },
        ],
        lat: 36.333,
        lng: 126.612,
      },
      {
        name: '홍성군',
        bjdongs: [
          { name: '서부면', ri: '남당리', lat: 36.5650, lng: 126.4850 },
          { name: '결성면', ri: '교항리', lat: 36.5350, lng: 126.5450 },
          { name: '홍동면', ri: '운월리', lat: 36.5650, lng: 126.6850 },
        ],
        lat: 36.601,
        lng: 126.660,
      },
    ],
  },
  {
    sido: '경상북도',
    code: '47',
    count: 730,
    sigungus: [
      {
        name: '상주시',
        bjdongs: [
          { name: '화남면', ri: '평온리', lat: 36.4150, lng: 127.9650 },
          { name: '사벌국면', ri: '덕가리', lat: 36.4850, lng: 128.2150 },
          { name: '중동면', ri: '우물리', lat: 36.3850, lng: 128.2550 },
          { name: '낙동면', ri: '신상리', lat: 36.3520, lng: 128.2850 },
          { name: '공검면', ri: '부곡리', lat: 36.5250, lng: 128.1650 },
        ],
        lat: 36.415,
        lng: 128.163,
      },
      {
        name: '안동시',
        bjdongs: [
          { name: '풍천면', ri: '갈전리', lat: 36.5850, lng: 128.5150 },
          { name: '풍산읍', ri: '노리', lat: 36.6050, lng: 128.6150 },
          { name: '서후면', ri: '명리', lat: 36.6350, lng: 128.6750 },
        ],
        lat: 36.568,
        lng: 128.729,
      },
      {
        name: '의성군',
        bjdongs: [
          { name: '금성면', ri: '탑리리', lat: 36.2650, lng: 128.7150 },
          { name: '봉양면', ri: '도원리', lat: 36.2950, lng: 128.6150 },
          { name: '비안면', ri: '이두리', lat: 36.3520, lng: 128.4850 },
        ],
        lat: 36.352,
        lng: 128.697,
      },
      {
        name: '예천군',
        bjdongs: [
          { name: '호명읍', ri: '산합리', lat: 36.5850, lng: 128.4850 },
          { name: '용문면', ri: '원류리', lat: 36.6850, lng: 128.3850 },
          { name: '지보면', ri: '마전리', lat: 36.5450, lng: 128.3150 },
        ],
        lat: 36.657,
        lng: 128.452,
      },
      {
        name: '봉화군',
        bjdongs: [
          { name: '봉성면', ri: '봉양리', lat: 36.9150, lng: 128.7850 },
          { name: '명호면', ri: '도천리', lat: 36.8850, lng: 128.8950 },
          { name: '춘양면', ri: '의양리', lat: 37.0150, lng: 128.9150 },
        ],
        lat: 36.893,
        lng: 128.732,
      },
    ],
  },
  {
    sido: '강원특별자치도',
    code: '42',
    count: 310,
    sigungus: [
      {
        name: '춘천시',
        bjdongs: [
          { name: '신북읍', ri: '율문리', lat: 37.9350, lng: 127.7550 },
          { name: '동면', ri: '지내리', lat: 37.9150, lng: 127.8150 },
          { name: '동산면', ri: '원창리', lat: 37.7950, lng: 127.7850 },
        ],
        lat: 37.881,
        lng: 127.729,
      },
      {
        name: '홍천군',
        bjdongs: [
          { name: '화촌면', ri: '송정리', lat: 37.7150, lng: 127.9650 },
          { name: '두촌면', ri: '자은리', lat: 37.8150, lng: 128.0550 },
        ],
        lat: 37.697,
        lng: 127.888,
      },
      {
        name: '횡성군',
        bjdongs: [
          { name: '우천면', ri: '두곡리', lat: 37.4850, lng: 128.0650 },
          { name: '안흥면', ri: '지구리', lat: 37.4150, lng: 128.1550 },
        ],
        lat: 37.491,
        lng: 127.985,
      },
      {
        name: '평창군',
        bjdongs: [
          { name: '대화면', ri: '대화리', lat: 37.4950, lng: 128.4550 },
          { name: '봉평면', ri: '창동리', lat: 37.6150, lng: 128.3850 },
        ],
        lat: 37.370,
        lng: 128.390,
      },
    ],
  },
  {
    sido: '경상남도',
    code: '48',
    count: 425,
    sigungus: [
      {
        name: '합천군',
        bjdongs: [
          { name: '초계면', ri: '원당리', lat: 35.5650, lng: 128.2550 },
          { name: '가야면', ri: '야천리', lat: 35.7150, lng: 128.1150 },
          { name: '삼가면', ri: '소오리', lat: 35.4150, lng: 128.1250 },
        ],
        lat: 35.566,
        lng: 128.165,
      },
      {
        name: '창녕군',
        bjdongs: [
          { name: '남지읍', ri: '아지리', lat: 35.3950, lng: 128.4550 },
          { name: '대합면', ri: '대동리', lat: 35.6150, lng: 128.4850 },
        ],
        lat: 35.541,
        lng: 128.492,
      },
      {
        name: '밀양시',
        bjdongs: [
          { name: '삼랑진읍', ri: '미전리', lat: 35.3950, lng: 128.8150 },
          { name: '하남읍', ri: '백산리', lat: 35.3850, lng: 128.7150 },
        ],
        lat: 35.503,
        lng: 128.746,
      },
      {
        name: '의령군',
        bjdongs: [
          { name: '가례면', ri: '괴진리', lat: 35.3450, lng: 128.2350 },
          { name: '칠곡면', ri: '내조리', lat: 35.3350, lng: 128.2050 },
        ],
        lat: 35.322,
        lng: 128.261,
      },
    ],
  },
  {
    sido: '충청북도',
    code: '43',
    count: 280,
    sigungus: [
      {
        name: '충주시',
        bjdongs: [
          { name: '주덕읍', ri: '신양리', lat: 36.9750, lng: 127.7950 },
          { name: '대소원면', ri: '대소리', lat: 36.9650, lng: 127.8450 },
          { name: '신니면', ri: '용원리', lat: 37.0150, lng: 127.7150 },
        ],
        lat: 36.991,
        lng: 127.926,
      },
      {
        name: '제천시',
        bjdongs: [
          { name: '봉양읍', ri: '주포리', lat: 37.1450, lng: 128.1250 },
          { name: '금성면', ri: '구룡리', lat: 37.0650, lng: 128.1850 },
        ],
        lat: 37.132,
        lng: 128.191,
      },
      {
        name: '괴산군',
        bjdongs: [
          { name: '감물면', ri: '오성리', lat: 36.8550, lng: 127.8550 },
          { name: '칠성면', ri: '사은리', lat: 36.7850, lng: 127.8950 },
        ],
        lat: 36.815,
        lng: 127.786,
      },
      {
        name: '음성군',
        bjdongs: [
          { name: '금왕읍', ri: '무극리', lat: 36.9950, lng: 127.5950 },
          { name: '맹동면', ri: '쌍정리', lat: 36.9150, lng: 127.5250 },
        ],
        lat: 36.932,
        lng: 127.690,
      },
    ],
  },
  {
    sido: '경기도',
    code: '41',
    count: 195,
    sigungus: [
      {
        name: '화성시',
        bjdongs: [
          { name: '우정읍', ri: '매향리', lat: 37.0550, lng: 126.7350 },
          { name: '장안면', ri: '사곡리', lat: 37.0950, lng: 126.7950 },
          { name: '송산면', ri: '고정리', lat: 37.2350, lng: 126.7150 },
        ],
        lat: 37.199,
        lng: 126.831,
      },
      {
        name: '안성시',
        bjdongs: [
          { name: '보개면', ri: '북가현리', lat: 37.0650, lng: 127.3450 },
          { name: '미양면', ri: '양지리', lat: 36.9650, lng: 127.2750 },
        ],
        lat: 37.008,
        lng: 127.279,
      },
      {
        name: '평택시',
        bjdongs: [
          { name: '포승읍', ri: '원정리', lat: 36.9650, lng: 126.8450 },
          { name: '청북읍', ri: '어연리', lat: 37.0350, lng: 126.9450 },
        ],
        lat: 36.992,
        lng: 127.112,
      },
      {
        name: '이천시',
        bjdongs: [
          { name: '장호원읍', ri: '노탑리', lat: 37.1150, lng: 127.6150 },
          { name: '율면', ri: '고당리', lat: 37.0650, lng: 127.5850 },
        ],
        lat: 37.272,
        lng: 127.435,
      },
    ],
  },
];

const CATEGORY_POOL: LandCategory[] = ['잡종지', '임야', '전', '답', '과수원', '목장용지', '염전'];
const ZONING_POOL: Zoning[] = [
  '계획관리지역',
  '생산관리지역',
  '보전관리지역',
  '농림지역',
  '자연녹지지역',
];

// 결정적(Deterministic) LCG 유사 난수 생성기
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// 3,914건 전국 부지 자동 생성
function buildNationwideParcels(): Parcel[] {
  const generated: Parcel[] = [...SEED_PARCELS];
  let globalIndex = 7;

  for (const reg of REGION_DATA) {
    const targetCount = reg.count;
    for (let i = 0; i < targetCount; i++) {
      const seed = globalIndex * 1337 + i * 31;
      const r1 = pseudoRandom(seed);
      const r2 = pseudoRandom(seed + 1);
      const r3 = pseudoRandom(seed + 2);
      const r4 = pseudoRandom(seed + 3);
      const r5 = pseudoRandom(seed + 4);
      const r6 = pseudoRandom(seed + 5);

      const sigunguObj = reg.sigungus[Math.floor(r1 * reg.sigungus.length)];
      const rawBjdong = sigunguObj.bjdongs[Math.floor(r2 * sigunguObj.bjdongs.length)];

      let bjdongName: string;
      let baseLat: number;
      let baseLng: number;
      let riPrefix = '';

      if (typeof rawBjdong === 'object') {
        bjdongName = rawBjdong.name;
        baseLat = rawBjdong.lat;
        baseLng = rawBjdong.lng;
        riPrefix = rawBjdong.ri ? ` ${rawBjdong.ri}` : '';
      } else {
        bjdongName = rawBjdong;
        baseLat = sigunguObj.lat;
        baseLng = sigunguObj.lng;
        // 🌟 대한민국 법정 지번 규칙: 면(面) 및 읍(邑) 아래에는 반드시 '리(里)'가 존재해야 합법적 지번 성립!
        if (bjdongName.endsWith('면') || bjdongName.endsWith('읍')) {
          const sampleRis = ['원평리', '대기리', '용산리', '송학리', '동관리', '부동리', '백석리', '신흥리', '금계리', '평촌리'];
          const pickedRi = sampleRis[Math.floor(pseudoRandom(seed + 6) * sampleRis.length)];
          riPrefix = ` ${pickedRi}`;
        }
      }

      // 면적: 120평 ~ 12,000평 고른 분포 (수천 건 평수 검색 지원)
      let areaPyeong: number;
      if (r3 < 0.25) {
        areaPyeong = Math.floor(150 + r4 * 850); // 150 ~ 1,000평 (소형)
      } else if (r3 < 0.7) {
        areaPyeong = Math.floor(1000 + r4 * 3500); // 1,000 ~ 4,500평 (중형 주력)
      } else {
        areaPyeong = Math.floor(4500 + r4 * 6500); // 4,500 ~ 11,000평 (대형 MW급)
      }
      const areaSqm = Math.round(areaPyeong * 3.305785);

      const landCategory = CATEGORY_POOL[Math.floor(r5 * CATEGORY_POOL.length)];
      const zoning = ZONING_POOL[Math.floor(r6 * ZONING_POOL.length)];

      // 🌟 바다로 빠지지 않도록 안전 육지 반경 이내(약 0.006도, 600m)로 미세 오프셋 제약
      const offsetScale = typeof rawBjdong === 'object' ? 0.006 : 0.015;
      const latOffset = (pseudoRandom(seed + 7) - 0.5) * offsetScale;
      const lngOffset = (pseudoRandom(seed + 8) - 0.5) * offsetScale;
      const lat = parseFloat((baseLat + latOffset).toFixed(5));
      const lng = parseFloat((baseLng + lngOffset).toFixed(5));

      const bunji1 = Math.floor(10 + pseudoRandom(seed + 9) * 980);
      const bunji2 = pseudoRandom(seed + 10) > 0.4 ? Math.floor(1 + pseudoRandom(seed + 11) * 35) : 0;
      const bunjiStr = bunji2 > 0 ? `${bunji1}-${bunji2}` : `${bunji1}`;
      const address = `${reg.sido} ${sigunguObj.name} ${bjdongName}${riPrefix} ${bunjiStr}`;

      const pnu = `${reg.code}${Math.floor(1000000000000000 + pseudoRandom(seed + 12) * 8999999999999999)}`;

      // 한전 변전소 및 계통 용량 (0.1 ~ 7.5 MW)
      const availableCapacityMw = parseFloat((0.2 + pseudoRandom(seed + 13) * 6.8).toFixed(1));
      const gridStatus = availableCapacityMw >= 2.0 ? '여유' : availableCapacityMw >= 0.8 ? '보통' : '포화';

      // 경사도 (1.1° ~ 19.5°)
      const slopeDegree = parseFloat((1.2 + pseudoRandom(seed + 14) * 16.5).toFixed(1));
      const residentialDist = Math.floor(120 + pseudoRandom(seed + 15) * 600);
      const roadDist = Math.floor(60 + pseudoRandom(seed + 16) * 350);

      const passResidential = residentialDist >= 200;
      const passRoad = roadDist >= 100;
      const passSlope = slopeDegree <= 15;

      let suitability: SuitabilityStatus;
      let suitabilityScore: number;

      if (passResidential && passRoad && passSlope && availableCapacityMw >= 1.0) {
        suitability = '예비적합';
        suitabilityScore = Math.floor(88 + pseudoRandom(seed + 17) * 11);
      } else if (!passSlope || residentialDist < 150) {
        suitability = '제한';
        suitabilityScore = Math.floor(35 + pseudoRandom(seed + 17) * 25);
      } else {
        suitability = '조건부';
        suitabilityScore = Math.floor(65 + pseudoRandom(seed + 17) * 22);
      }

      // 설비용량 및 발전량 추정
      const effectiveAreaSqm = Math.round(areaSqm * 0.82);
      const estimatedCapacityKwp = Math.round(effectiveAreaSqm / 14); // 약 14㎡당 1kWp
      const annualGenerationKwh = Math.round(estimatedCapacityKwp * 3.75 * 365);
      const capexTotalWon = Math.round(estimatedCapacityKwp * 1250000); // kW당 125만원
      const annualRevenueWon = Math.round(annualGenerationKwh * 170); // kWh당 170원
      const annualOpexWon = Math.round(capexTotalWon * 0.018);
      const irrPercent = parseFloat((6.5 + pseudoRandom(seed + 18) * 4.5).toFixed(1));
      const npvWon = Math.round(capexTotalWon * 0.45);
      const paybackYears = parseFloat((5.2 + pseudoRandom(seed + 19) * 2.8).toFixed(1));

      // 🌟 물리적 실제 축척 계산 (1도 위도 약 111,000m, 1도 경도 약 91,000m)
      // 10,000평(약 33,058㎡)일 경우 반경 약 102m, 가로세로 약 180~205m에 달하는 거대한 실제 축척으로 렌더링!
      const numVertices = 6 + Math.floor(pseudoRandom(seed + 20) * 3); // 6 ~ 8각형
      const radiusMeters = Math.sqrt(areaSqm / Math.PI); // 등가 원형 반경 (m)
      const baseRadiusLat = radiusMeters / 111000;
      const baseRadiusLng = radiusMeters / 91000;

      const polygon: [number, number][] = [];
      for (let v = 0; v < numVertices; v++) {
        const angle = (v / numVertices) * Math.PI * 2;
        // 지적도 특유의 불규칙한 자연 경계 요철 부여
        const rVariation = 0.72 + pseudoRandom(seed + 21 + v) * 0.52;
        const vLat = lat + Math.sin(angle) * baseRadiusLat * rVariation;
        const vLng = lng + Math.cos(angle) * baseRadiusLng * rVariation;
        polygon.push([parseFloat(vLat.toFixed(6)), parseFloat(vLng.toFixed(6))]);
      }

        // 🌟 re100market.com 벤치마킹: 한전 변전소 & 주변 3대 배전선로(DL) 세부 데이터 생성
        const substationDist = parseFloat((2.0 + pseudoRandom(seed + 23) * 6.5).toFixed(1));
        const dl1Dist = parseFloat((0.8 + pseudoRandom(seed + 24) * 1.5).toFixed(1));
        const dl2Dist = parseFloat((dl1Dist + 1.2 + pseudoRandom(seed + 25) * 1.5).toFixed(1));
        const dl3Dist = parseFloat((dl2Dist + 1.5 + pseudoRandom(seed + 26) * 1.8).toFixed(1));

        const dl2Mw = parseFloat(Math.max(0.3, availableCapacityMw * 0.65).toFixed(1));
        const dl3Mw = parseFloat(Math.max(0.1, availableCapacityMw * 0.25).toFixed(1));

        const dl1Status = gridStatus;
        const dl2Status = dl2Mw >= 2.0 ? '여유' : dl2Mw >= 0.8 ? '보통' : '포화';
        const dl3Status = dl3Mw >= 2.0 ? '여유' : dl3Mw >= 0.8 ? '보통' : '포화';

        const distributionLines: DistributionLine[] = [
          {
            name: `${bjdongName}DL #${(i % 3) + 1}`,
            availableMw: availableCapacityMw,
            status: dl1Status,
            distanceKm: dl1Dist,
            estimatedInterconnectionCostWon: Math.round(dl1Dist * 45000000),
            isRecommended: true,
          },
          {
            name: `${sigunguObj.name}DL #${((i + 1) % 4) + 1}`,
            availableMw: dl2Mw,
            status: dl2Status,
            distanceKm: dl2Dist,
            estimatedInterconnectionCostWon: Math.round(dl2Dist * 45000000),
          },
          {
            name: `연계선로DL #${((i + 2) % 5) + 1}`,
            availableMw: dl3Mw,
            status: dl3Status,
            distanceKm: dl3Dist,
            estimatedInterconnectionCostWon: Math.round(dl3Dist * 45000000),
          },
        ];

        // 🌟 disco.re 벤치마킹: 토지 실거래가 및 도로 접면/소유 공적장부 데이터 생성
        let baseTradePrice: number;
        if (landCategory === '잡종지') baseTradePrice = 95000;
        else if (landCategory === '임야') baseTradePrice = 35000;
        else if (landCategory === '전') baseTradePrice = 75000;
        else if (landCategory === '답') baseTradePrice = 65000;
        else if (landCategory === '염전') baseTradePrice = 48000;
        else baseTradePrice = 70000;

        const avgTradingPricePerPyeong = Math.round(baseTradePrice * (0.85 + pseudoRandom(seed + 27) * 0.35));
        const estimatedLandPriceTotalWon = Math.round(areaPyeong * avgTradingPricePerPyeong);

        const roadAccessRoll = pseudoRandom(seed + 28);
        const roadAccess =
          roadAccessRoll > 0.4
            ? '폭 4m 포장 농로 접면 (개발행위 진입로 확보)'
            : roadAccessRoll > 0.12
            ? '2차선 아스팔트 포장도로 접면 (진입 양호)'
            : '맹지 (인접 사유지 진입로 개설 협의 필요)';
        const isLandlocked = roadAccess.includes('맹지');

        const ownershipRoll = pseudoRandom(seed + 29);
        const ownershipType =
          ownershipRoll > 0.3
            ? '개인'
            : ownershipRoll > 0.1
            ? '법인'
            : ownershipRoll > 0.04
            ? '국유지/공유지'
            : '종중';

        generated.push({
          id: `np_${globalIndex}`,
          pnu,
          address,
          sido: reg.sido,
          sigungu: sigunguObj.name,
          bjdong: bjdongName,
          landCategory,
          areaPyeong,
          areaSqm,
          zoning,
          officialPrice: Math.floor(15000 + pseudoRandom(seed + 21) * 45000),
          coordinates: [lat, lng],
          polygon,
          slopeDegree,
          aspect: pseudoRandom(seed + 22) > 0.5 ? '정남향 (180°)' : '남동향 (150°)',
          suitability,
          suitabilityScore,
          regulationChecks: {
            residentialDistance: {
              distance: residentialDist,
              required: 200,
              pass: passResidential,
              ordinance: `${sigunguObj.name} 도시계획조례 제20조`,
            },
            roadDistance: {
              distance: roadDist,
              required: 100,
              pass: passRoad,
              ordinance: '군도 및 지방도 이격기준 완충구역',
            },
            protectionZone: { intersected: false, zoneName: '해당없음', areaRatio: 0 },
            slopeCheck: { degree: slopeDegree, limit: 15, pass: passSlope },
          },
          grid: {
            substationName: `${sigunguObj.name}변전소`,
            substationDistanceKm: substationDist,
            substationCoordinates: [
              parseFloat((lat + (pseudoRandom(seed + 30) - 0.5) * 0.05).toFixed(5)),
              parseFloat((lng + (pseudoRandom(seed + 31) - 0.5) * 0.06).toFixed(5)),
            ],
            substationCapacityTotalMw: parseFloat((availableCapacityMw * 3.5 + 4.2).toFixed(1)),
            mtrNumber: `#${((i % 3) + 1)} M.Tr`,
            mtrAvailableMw: parseFloat((availableCapacityMw * 1.3).toFixed(1)),
            dlName: `${bjdongName}DL #${(i % 3) + 1}`,
            availableCapacityMw,
            status: gridStatus,
            updatedAt: '2026-11-03',
            distributionLines,
          },
          realEstate: {
            avgTradingPricePerPyeong,
            estimatedLandPriceTotalWon,
            roadAccess,
            isLandlocked,
            ownershipType,
            recentTradesCount: Math.floor(3 + pseudoRandom(seed + 32) * 11),
          },
          solar: {
            ghiAnnualAvg: 3.75,
            effectiveAreaSqm,
            estimatedCapacityKwp,
            annualGenerationKwh,
          },
          financials: {
            capexTotalWon,
            annualRevenueWon,
            annualOpexWon,
            irrPercent,
            npvWon,
            paybackYears,
          },
        });

      globalIndex++;
    }
  }

  return generated;
}

export const MOCK_PARCELS: Parcel[] = buildNationwideParcels();
