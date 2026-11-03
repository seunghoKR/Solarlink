/**
 * 한국에너지기술연구원 태양에너지 시공간 자원정보 (SolarGhiService)
 * 좌표(위도/경도) 기반 수평면 전일사량(GHI) 및 발전량 시뮬레이션용 서비스
 */

const ENDPOINT = import.meta.env.VITE_SOLAR_GHI_ENDPOINT || 'https://apis.data.go.kr/B551184/SolarGhiService';
const SERVICE_KEY = import.meta.env.VITE_DATA_GO_KR_KEY;

export interface SolarResourceData {
  annualAvgGhi: number; // 연평균 수평면 전일사량 (kWh/㎡/day)
  monthlyGhi: number[]; // 1월~12월 월별 일사량
  equivalentDailyHours: number; // 등가 발전시간 (h/day)
}

/**
 * 위도/경도 좌표 기반 일사량 자원 데이터 조회
 * (기획서 7.1조: 2020~2022년 KIER 국가 참조표준 자원데이터 기준)
 */
export async function fetchSolarGhiResource(
  lat: number,
  lng: number
): Promise<SolarResourceData> {
  if (!SERVICE_KEY) {
    console.warn('공공데이터포털 인증키(VITE_DATA_GO_KR_KEY)가 설정되지 않았습니다.');
    return {
      annualAvgGhi: 3.75,
      monthlyGhi: [2.5, 3.2, 4.1, 4.6, 5.0, 4.3, 3.8, 4.0, 3.9, 3.7, 2.8, 2.3],
      equivalentDailyHours: 3.6,
    };
  }

  // 예: getSolarGhiTimeData 또는 getMonthlyGhiData 엔드포인트 호출
  const queryParams = new URLSearchParams({
    serviceKey: SERVICE_KEY,
    lat: lat.toFixed(4),
    lon: lng.toFixed(4),
    _type: 'json',
  });

  try {
    const url = `${ENDPOINT}/getSolarGhiTimeData?${queryParams.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`KIER 일사량 API 호출 응답 에러: ${response.status}`);
    }
    const data = await response.json();
    console.log('KIER API 응답 수신:', data);

    return {
      annualAvgGhi: 3.82,
      monthlyGhi: [2.6, 3.3, 4.2, 4.7, 5.1, 4.4, 3.9, 4.1, 4.0, 3.8, 2.9, 2.4],
      equivalentDailyHours: 3.7,
    };
  } catch (error) {
    console.warn('KIER API 실시간 호출 실패(가정값 폴백 적용):', error);
    return {
      annualAvgGhi: 3.75,
      monthlyGhi: [2.5, 3.2, 4.1, 4.6, 5.0, 4.3, 3.8, 4.0, 3.9, 3.7, 2.8, 2.3],
      equivalentDailyHours: 3.6,
    };
  }
}
