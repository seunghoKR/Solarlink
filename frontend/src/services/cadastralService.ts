/**
 * 국토교통부 브이월드 (VWorld) 실시간 2D 연속지적도(LT_C_LANDINFOBASEMAP) 연동 서비스
 * 
 * 대표님의 VWorld 승인 키(E810A4B0-...)를 활용하여
 * 대한민국 3,800만 전 필지의 '실제 지적도 경계선(MultiPolygon GeoJSON)'을
 * 브라우저 CORS 제약 없는 JSONP 방식으로 실시간 쿼리합니다.
 */

const VWORLD_KEY = import.meta.env.VITE_VWORLD_API_KEY || 'E810A4B0-5AFE-4FF7-9E1F-2B905CFAD2B7';
const DOMAIN = 're100life.com';

export interface RealCadastralFeature {
  pnu: string;
  jibun: string;
  jimok: string;
  pareaSqm: number;
  pareaPyeong: number;
  sido: string;
  sigungu: string;
  emd: string;
  ri: string;
  polygon: [number, number][]; // Leaflet용 [lat, lng] 배열
}

// 메모리 캐시 (동일 지점 중복 호출 방지)
const cadastralCache = new Map<string, RealCadastralFeature | null>();

/**
 * 특정 위경도 좌표(lat, lng)의 국토부 공인 연속지적도 실필지 경계선 조회
 */
export function fetchRealCadastralPolygon(lat: number, lng: number): Promise<RealCadastralFeature | null> {
  const cacheKey = `${lat.toFixed(5)},${lng.toFixed(5)}`;
  if (cadastralCache.has(cacheKey)) {
    return Promise.resolve(cadastralCache.get(cacheKey) || null);
  }

  return new Promise((resolve) => {
    const callbackName = `__vworld_cb_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const timeoutId = setTimeout(() => {
      cleanup();
      resolve(null);
    }, 4000);

    const cleanup = () => {
      clearTimeout(timeoutId);
      try {
        delete (window as any)[callbackName];
      } catch {
        (window as any)[callbackName] = undefined;
      }
      const existingScript = document.getElementById(callbackName);
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };

    (window as any)[callbackName] = (data: any) => {
      cleanup();
      try {
        if (data?.response?.status === 'OK') {
          const features = data?.response?.result?.featureCollection?.features;
          if (features && features.length > 0) {
            const feat = features[0];
            const props = feat.properties || {};
            const geom = feat.geometry;

            let polygonCoords: [number, number][] = [];

            if (geom?.type === 'MultiPolygon' && geom.coordinates?.[0]?.[0]) {
              polygonCoords = geom.coordinates[0][0].map((pt: [number, number]) => [pt[1], pt[0]]);
            } else if (geom?.type === 'Polygon' && geom.coordinates?.[0]) {
              polygonCoords = geom.coordinates[0].map((pt: [number, number]) => [pt[1], pt[0]]);
            }

            if (polygonCoords.length >= 3) {
              const areaSqm = parseFloat(props.parea || '0');
              const areaPyeong = Math.round(areaSqm * 0.3025);

              const result: RealCadastralFeature = {
                pnu: props.pnu || '',
                jibun: props.jibun || '',
                jimok: props.jimok || '',
                pareaSqm: areaSqm,
                pareaPyeong: areaPyeong,
                sido: props.sido_nm || '',
                sigungu: props.sgg_nm || '',
                emd: props.emd_nm || '',
                ri: props.ri_nm || '',
                polygon: polygonCoords,
              };

              cadastralCache.set(cacheKey, result);
              resolve(result);
              return;
            }
          }
        }
        cadastralCache.set(cacheKey, null);
        resolve(null);
      } catch (err) {
        console.warn('VWorld 지적도 파싱 실패:', err);
        resolve(null);
      }
    };

    const script = document.createElement('script');
    script.id = callbackName;
    script.src = `https://api.vworld.kr/req/data?service=data&request=GetFeature&data=LT_C_LANDINFOBASEMAP&key=${VWORLD_KEY}&domain=${DOMAIN}&format=json&crs=EPSG:4326&geomFilter=POINT(${lng}%20${lat})&callback=${callbackName}`;
    script.onerror = () => {
      cleanup();
      resolve(null);
    };

    document.head.appendChild(script);
  });
}
