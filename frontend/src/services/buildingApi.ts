/**
 * 국토교통부 건축HUB 건축물대장정보 서비스 (BldRgstHubService)
 * 주변 주거용 건축물(주택) 위치 및 이격거리 조례 분석을 위한 API 서비스
 */

const ENDPOINT = import.meta.env.VITE_BUILDING_HUB_ENDPOINT || 'https://apis.data.go.kr/1613000/BldRgstHubService';
const SERVICE_KEY = import.meta.env.VITE_DATA_GO_KR_KEY;

export interface BuildingTitleInfo {
  mgmBldrgstPk: string; // 관리건축물대장PK
  bldNm: string; // 건물명
  mainPurpsCdNm: string; // 주용도코드명 (예: 단독주택, 공동주택)
  etcPurps: string; // 기타용도
  platPlc: string; // 대지위치
  totArea: number; // 연면적(㎡)
  useAprDay: string; // 사용승인일
}

/**
 * 특정 법정동 및 지번의 건축물 표제부 정보 조회 (주거용 건축물 판정)
 * @param sigunguCd 시군구코드 (5자리, 예: 46820 해남군)
 * @param bjdongCd 법정동코드 (5자리, 예: 31024 산이면 부동리)
 * @param platGbCd 대지구분코드 (0: 대지, 1: 산, 2: 블록)
 * @param bun 번 (4자리, 예: 0124)
 * @param ji 지 (4자리, 예: 0001)
 */
export async function fetchBuildingTitleInfo(
  sigunguCd: string,
  bjdongCd: string,
  platGbCd = '0',
  bun = '',
  ji = ''
): Promise<BuildingTitleInfo[]> {
  if (!SERVICE_KEY) {
    console.warn('공공데이터포털 인증키(VITE_DATA_GO_KR_KEY)가 설정되지 않았습니다.');
    return [];
  }

  const queryParams = new URLSearchParams({
    serviceKey: SERVICE_KEY,
    sigunguCd: sigunguCd.padStart(5, '0'),
    bjdongCd: bjdongCd.padStart(5, '0'),
    platGbCd,
    bun: bun ? bun.padStart(4, '0') : '',
    ji: ji ? ji.padStart(4, '0') : '',
    numOfRows: '10',
    pageNo: '1',
    _type: 'json',
  });

  const url = `${ENDPOINT}/getBrTitleInfo?${queryParams.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`건축물대장 API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    const items = data?.response?.body?.items?.item;

    if (!items) return [];

    const list = Array.isArray(items) ? items : [items];
    return list.map((item: any) => ({
      mgmBldrgstPk: item.mgmBldrgstPk || '',
      bldNm: item.bldNm || '',
      mainPurpsCdNm: item.mainPurpsCdNm || '',
      etcPurps: item.etcPurps || '',
      platPlc: item.platPlc || '',
      totArea: Number(item.totArea) || 0,
      useAprDay: item.useAprDay || '',
    }));
  } catch (error) {
    console.error('건축물대장 조회 중 오류 발생:', error);
    return [];
  }
}
