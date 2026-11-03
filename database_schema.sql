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
