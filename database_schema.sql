-- ==============================================================================
-- Lifety Solar Intelligence - Enterprise SaaS Relational Database Schema
-- Compatible with: PostgreSQL 14+, Supabase, CockroachDB, AWS Aurora
-- Created by: AI 디자인실장 영자 🎨💖
-- ==============================================================================

-- 1. 사용자 테이블 (Users & Membership)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'user', -- 'developer', 'admin', 'enterprise', 'user'
    role_label VARCHAR(64) NOT NULL DEFAULT '일반회원',
    company_name VARCHAR(128),
    subscription_plan VARCHAR(32) DEFAULT 'FREE', -- 'FREE', 'PRO', 'ENTERPRISE'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. 사용자 검색 이력 테이블 (Search History)
CREATE TABLE IF NOT EXISTS user_search_history (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    query VARCHAR(255) NOT NULL,
    refined_address VARCHAR(255),
    pnu VARCHAR(19),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(11, 7),
    result_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_search_history_user ON user_search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_time ON user_search_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_history_query ON user_search_history(query);

-- 3. 관심 부지 북마크 테이블 (Bookmarks / Favorited Parcels)
CREATE TABLE IF NOT EXISTS user_bookmarks (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    parcel_id VARCHAR(64) NOT NULL,
    pnu VARCHAR(19) NOT NULL,
    address VARCHAR(255) NOT NULL,
    area_pyeong INT NOT NULL,
    area_sqm INT NOT NULL,
    land_category VARCHAR(32),
    zoning VARCHAR(64),
    suitability VARCHAR(32) NOT NULL, -- '예비적합', '조건부', '제한'
    memo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, parcel_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON user_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_pnu ON user_bookmarks(pnu);

-- 4. SaaS 사용자 감사 및 운영 로그 테이블 (Audit Logs)
CREATE TABLE IF NOT EXISTS user_audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    user_name VARCHAR(100),
    user_role VARCHAR(32),
    action VARCHAR(64) NOT NULL, -- 'LOGIN', 'SEARCH_ADDRESS', 'FILTER_SEARCH', 'VIEW_PARCEL', 'EXPORT_REPORT_PDF', 'EXPORT_CSV', 'RIGHT_CLICK_INSPECT'
    target_address VARCHAR(255),
    target_pnu VARCHAR(19),
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON user_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON user_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_time ON user_audit_logs(created_at DESC);

-- 5. 발굴 필지 GIS 캐시 테이블 (Parcels Metadata Cache)
CREATE TABLE IF NOT EXISTS parcels_cache (
    pnu VARCHAR(19) PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    sido VARCHAR(64) NOT NULL,
    sigungu VARCHAR(64) NOT NULL,
    bjdong VARCHAR(64) NOT NULL,
    land_category VARCHAR(32) NOT NULL,
    area_pyeong INT NOT NULL,
    area_sqm INT NOT NULL,
    zoning VARCHAR(64) NOT NULL,
    official_price BIGINT DEFAULT 0,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(11, 7) NOT NULL,
    slope_degree NUMERIC(4, 1),
    substation_name VARCHAR(64),
    available_capacity_mw NUMERIC(4, 1),
    suitability VARCHAR(32) NOT NULL,
    suitability_score INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_parcels_coords ON parcels_cache(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_parcels_suitability ON parcels_cache(suitability);
CREATE INDEX IF NOT EXISTS idx_parcels_area ON parcels_cache(area_pyeong);

-- ==============================================================================
-- 6. 전국 100만 건 태양광 유효 부지 공간 데이터베이스 (PostGIS Spatial Engine)
-- 4대 컷오프(맹지, 15° 급경사, 음영, 계통포화)를 통과한 전국 100만 건 전수 인덱스
-- ==============================================================================
-- PostGIS 공간 엔진 확장 활성화
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS solar_valid_parcels_1m (
    id BIGSERIAL PRIMARY KEY,
    pnu VARCHAR(19) UNIQUE NOT NULL,
    address VARCHAR(255) NOT NULL,
    sido VARCHAR(64) NOT NULL,
    sigungu VARCHAR(64) NOT NULL,
    bjdong VARCHAR(64) NOT NULL,
    land_category VARCHAR(32) NOT NULL,            -- 대지, 잡종지, 임야, 전, 답 등
    area_pyeong INT NOT NULL,                     -- 면적 (평)
    area_sqm INT NOT NULL,                        -- 면적 (m²)
    zoning VARCHAR(64) NOT NULL,                  -- 계획관리지역, 자연녹지지역 등
    slope_degree NUMERIC(4, 1) NOT NULL,          -- 경사도 (15도 이하 통과)
    aspect VARCHAR(32) NOT NULL,                  -- 향/일조 (정남향, 남동향, 남서향)
    is_landlocked BOOLEAN DEFAULT FALSE,          -- 맹지 여부 (FALSE: 진입로 3~4m 확보)
    road_access VARCHAR(128),                     -- 도로 접면 현황
    substation_name VARCHAR(64),                  -- 연계 154kV 변전소
    available_capacity_mw NUMERIC(4, 1) NOT NULL, -- 변전소 여유 용량 (MW)
    estimated_capacity_kwp INT NOT NULL,          -- 추천 설비용량 (kWp)
    suitability_score INT DEFAULT 85,             -- GIS 적합도 점수 (100점 만점)
    geom GEOMETRY(Point, 4326) NOT NULL,          -- WGS84 EPSG:4326 공간 포인트
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PostGIS 4대 초고속 공간 및 필터 인덱스
CREATE INDEX IF NOT EXISTS idx_solar_1m_geom ON solar_valid_parcels_1m USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_solar_1m_sido ON solar_valid_parcels_1m(sido);
CREATE INDEX IF NOT EXISTS idx_solar_1m_category ON solar_valid_parcels_1m(land_category);
CREATE INDEX IF NOT EXISTS idx_solar_1m_pyeong ON solar_valid_parcels_1m(area_pyeong);
CREATE INDEX IF NOT EXISTS idx_solar_1m_score ON solar_valid_parcels_1m(suitability_score DESC);

-- 시·도 단위 100만 건 유효 부지 고속 실시간 집계 뷰 (지도 Zoom 6~9 광역 버블용)
CREATE OR REPLACE VIEW v_solar_region_aggregates AS
SELECT 
    sido,
    COUNT(*) AS total_valid_sites,
    ROUND(AVG(available_capacity_mw), 1) AS avg_grid_capacity_mw,
    ROUND(AVG(suitability_score), 0) AS avg_suitability_score,
    SUM(estimated_capacity_kwp) AS total_potential_kwp
FROM solar_valid_parcels_1m
GROUP BY sido;

-- 지도 화면 BBOX(시야각) 범위 내 상위 부지 고속 쿼리 함수 (Zoom 14~19 정밀 탐색용)
-- 예시: SELECT * FROM fn_search_parcels_in_bbox(34.80, 126.60, 34.85, 126.70, 100, 100000, 200);
CREATE OR REPLACE FUNCTION fn_search_parcels_in_bbox(
    min_lat NUMERIC,
    min_lng NUMERIC,
    max_lat NUMERIC,
    max_lng NUMERIC,
    min_pyeong INT DEFAULT 100,
    max_pyeong INT DEFAULT 1000000,
    query_limit INT DEFAULT 200
)
RETURNS TABLE (
    pnu VARCHAR(19),
    address VARCHAR(255),
    sido VARCHAR(64),
    sigungu VARCHAR(64),
    land_category VARCHAR(32),
    area_pyeong INT,
    slope_degree NUMERIC(4, 1),
    substation_name VARCHAR(64),
    available_capacity_mw NUMERIC(4, 1),
    suitability_score INT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.pnu,
        p.address,
        p.sido,
        p.sigungu,
        p.land_category,
        p.area_pyeong,
        p.slope_degree,
        p.substation_name,
        p.available_capacity_mw,
        p.suitability_score,
        ST_Y(p.geom) AS latitude,
        ST_X(p.geom) AS longitude
    FROM solar_valid_parcels_1m p
    WHERE p.geom && ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)
      AND p.area_pyeong >= min_pyeong
      AND p.area_pyeong <= max_pyeong
    ORDER BY p.suitability_score DESC
    LIMIT query_limit;
END;
$$ LANGUAGE plpgsql;
