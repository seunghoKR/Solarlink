/**
 * ==============================================================================
 * Lifety Solar Intelligence - PostGIS 1,000,000 Valid Parcels BBOX Server
 * ==============================================================================
 * 역할:
 *  - 대한민국 100만 건 AI 유효부지 PostGIS 공간 DB 연동
 *  - 지도 줌 레벨에 맞춘 BBOX(화면 바운딩박스) 초고속 공간 쿼리 API 제공
 *  - 전국 17개 시도별 100만 유효부지 집계 API 제공
 * 
 * 실행:
 *  node scripts/spatial_bbox_server.js
 * ==============================================================================
 */

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// PostgreSQL / PostGIS 연결 풀 (환경변수 또는 iwinv/로컬 DB)
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'lifety_solar',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
});

/**
 * 1. 전국 17개 시·도 100만 건 유효 부지 집계 API (Zoom 6~9 광역 뷰용)
 * GET /api/regions/aggregates
 */
app.get('/api/regions/aggregates', async (req, res) => {
  try {
    const query = `
      SELECT 
        sido,
        total_valid_sites,
        avg_grid_capacity_mw,
        avg_suitability_score,
        total_potential_kwp
      FROM v_solar_region_aggregates
      ORDER BY total_valid_sites DESC;
    `;
    const result = await pool.query(query);
    res.json({
      success: true,
      totalCount: result.rows.reduce((sum, r) => sum + parseInt(r.total_valid_sites, 10), 0),
      regions: result.rows,
    });
  } catch (err) {
    console.error('Error fetching region aggregates:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 2. 지도 화면 BBOX 내 상위 유효 부지 고속 공간 쿼리 API (Zoom 14~19 정밀 탐색용)
 * GET /api/parcels/bbox?minLat=..&minLng=..&maxLat=..&maxLng=..&minPyeong=100&limit=200
 */
app.get('/api/parcels/bbox', async (req, res) => {
  try {
    const minLat = parseFloat(req.query.minLat);
    const minLng = parseFloat(req.query.minLng);
    const maxLat = parseFloat(req.query.maxLat);
    const maxLng = parseFloat(req.query.maxLng);
    const minPyeong = parseInt(req.query.minPyeong || '100', 10);
    const maxPyeong = parseInt(req.query.maxPyeong || '1000000', 10);
    const limit = parseInt(req.query.limit || '200', 10);

    if (isNaN(minLat) || isNaN(minLng) || isNaN(maxLat) || isNaN(maxLng)) {
      return res.status(400).json({ success: false, message: 'Invalid BBOX coordinates' });
    }

    const query = `
      SELECT * FROM fn_search_parcels_in_bbox($1, $2, $3, $4, $5, $6, $7);
    `;
    const values = [minLat, minLng, maxLat, maxLng, minPyeong, maxPyeong, limit];
    const result = await pool.query(query, values);

    res.json({
      success: true,
      count: result.rows.length,
      parcels: result.rows,
    });
  } catch (err) {
    console.error('Error executing BBOX query:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`📡 [Lifety Spatial Server] Running on http://localhost:${PORT}`);
});
