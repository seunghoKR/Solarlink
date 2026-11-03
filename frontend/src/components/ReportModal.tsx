import React from 'react';
import type { Parcel } from '../types/solar';
import { Printer, X, ShieldCheck, Zap, Sun, TrendingUp, MapPin, Building2 } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcel: Parcel | null;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, parcel }) => {
  if (!isOpen || !parcel) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const docNo = `LSI-${todayStr.replace(/-/g, '')}-${parcel.pnu.slice(-6)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[12000] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto print-report-modal">
      {/* Container Card */}
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Action Bar (no-print) */}
        <div className="no-print px-6 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <h3 className="font-bold text-sm text-white">
              태양광 부지 사전 타당성 검토 보고서 (인쇄 및 PDF 내보내기)
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center space-x-1.5 shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>PDF 다운로드 / 인쇄하기</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 🌟 Official A4 Printable White Sheet */}
        <div className="p-8 sm:p-12 bg-white text-slate-900 font-sans print-report-sheet overflow-y-auto max-h-[85vh]">
          {/* 1. Report Header */}
          <div className="flex items-start justify-between pb-4 border-b-2 border-slate-900">
            <div className="flex items-center space-x-3">
              <img
                src="/logo_transparent_darktext.png"
                alt="Lifety 로고"
                className="h-10 w-auto object-contain"
              />
              <div>
                <span className="font-extrabold text-base tracking-wider text-slate-900 block leading-tight">
                  LIFETY SOLAR INTELLIGENCE
                </span>
                <span className="text-[11px] text-slate-500 tracking-tight font-medium">
                  대한민국 신재생에너지 인텔리전스 센터
                </span>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-600 space-y-0.5">
              <div><strong className="text-slate-800">문서번호:</strong> {docNo}</div>
              <div><strong className="text-slate-800">발행일자:</strong> {todayStr}</div>
              <div><strong className="text-slate-800">보안등급:</strong> 대외비 (사업 검토용)</div>
            </div>
          </div>

          {/* 2. Title & Suitability Stamp */}
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                태양광 발전사업 부지 사전 타당성 검토 보고서
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                본 문서는 국토교통부 지적도, 지자체 자치법규(조례), 한전 계통망, 기상청 일사량을 종합 진단한 공식 브리핑 시트입니다.
              </p>
            </div>

            {/* Suitability Stamp */}
            <div
              className={`px-4 py-2 border-2 rounded-lg text-center shrink-0 ${
                parcel.suitability === '예비적합'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50'
                  : parcel.suitability === '조건부'
                  ? 'border-amber-600 text-amber-700 bg-amber-50'
                  : 'border-rose-600 text-rose-700 bg-rose-50'
              }`}
            >
              <span className="block text-[10px] font-bold tracking-widest uppercase">
                GIS Screening
              </span>
              <span className="text-base font-black">
                {parcel.suitability} ({parcel.suitabilityScore}점)
              </span>
            </div>
          </div>

          {/* 3. Section 1: 대상 부지 기본 현황 */}
          <div className="mb-6">
            <h2 className="text-xs font-bold text-slate-900 tracking-wider uppercase bg-slate-100 px-3 py-1.5 border-l-4 border-amber-500 mb-2 flex items-center">
              <MapPin className="w-3.5 h-3.5 text-amber-600 mr-1.5" />
              1. 대상 부지 기본 현황 (Site Overview)
            </h2>
            <table className="w-full text-xs border border-slate-300 border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <th className="w-28 bg-slate-50 py-2 px-3 text-left font-bold text-slate-700 border-r border-slate-200">
                    소재지 (주소)
                  </th>
                  <td colSpan={3} className="py-2 px-3 font-bold text-slate-900 text-sm">
                    {parcel.address}
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th className="bg-slate-50 py-2 px-3 text-left font-bold text-slate-700 border-r border-slate-200">
                    고유식별번호(PNU)
                  </th>
                  <td className="py-2 px-3 font-mono text-slate-800 border-r border-slate-200">
                    {parcel.pnu}
                  </td>
                  <th className="w-28 bg-slate-50 py-2 px-3 text-left font-bold text-slate-700 border-r border-slate-200">
                    공부 지목
                  </th>
                  <td className="py-2 px-3 font-bold text-amber-700">
                    {parcel.landCategory}
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th className="bg-slate-50 py-2 px-3 text-left font-bold text-slate-700 border-r border-slate-200">
                    부지 면적
                  </th>
                  <td className="py-2 px-3 text-slate-900 border-r border-slate-200">
                    <strong className="text-slate-900 text-sm">{parcel.areaPyeong.toLocaleString()}평</strong>{' '}
                    <span className="text-slate-500">({parcel.areaSqm.toLocaleString()}㎡)</span>
                  </td>
                  <th className="bg-slate-50 py-2 px-3 text-left font-bold text-slate-700 border-r border-slate-200">
                    용도지역
                  </th>
                  <td className="py-2 px-3 text-slate-800">
                    {parcel.zoning}
                  </td>
                </tr>
                <tr>
                  <th className="bg-slate-50 py-2 px-3 text-left font-bold text-slate-700 border-r border-slate-200">
                    공시지가 (㎡당)
                  </th>
                  <td className="py-2 px-3 text-slate-800 border-r border-slate-200">
                    {parcel.officialPrice.toLocaleString()}원/㎡
                  </td>
                  <th className="bg-slate-50 py-2 px-3 text-left font-bold text-slate-700 border-r border-slate-200">
                    추정 공시지가 합계
                  </th>
                  <td className="py-2 px-3 font-bold text-slate-900">
                    {Math.round((parcel.officialPrice * parcel.areaSqm) / 10000).toLocaleString()}만원
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 🌟 1-2. 디스코(Disco.re) 프롭테크 토지 실거래 & 도로접면 정밀 분석 */}
          {parcel.realEstate && (
            <div className="mb-6">
              <h2 className="text-xs font-bold text-slate-900 tracking-wider uppercase bg-slate-100 px-3 py-1.5 border-l-4 border-amber-600 mb-2 flex items-center justify-between">
                <span className="flex items-center">
                  <Building2 className="w-3.5 h-3.5 text-amber-600 mr-1.5" />
                  1-2. 디스코(Disco) 프롭테크 토지 실거래가 및 도로접면 진단
                </span>
                <span className="text-[10px] text-slate-500 font-normal">반경 1km 최근 3년 실거래 기반</span>
              </h2>
              <table className="w-full text-xs border border-slate-300 border-collapse">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <th className="w-28 bg-slate-50 py-2 px-3 text-left font-bold text-slate-700 border-r border-slate-200">
                      도로 접면 현황
                    </th>
                    <td className="py-2 px-3 text-slate-800 border-r border-slate-200">
                      <span className={`font-bold ${parcel.realEstate.isLandlocked ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {parcel.realEstate.roadAccess}
                      </span>
                    </td>
                    <th className="w-28 bg-slate-50 py-2 px-3 text-left font-bold text-slate-700 border-r border-slate-200">
                      공적장부 소유구분
                    </th>
                    <td className="py-2 px-3 font-semibold text-slate-800">
                      {parcel.realEstate.ownershipType} (최근 거래 {parcel.realEstate.recentTradesCount}건)
                    </td>
                  </tr>
                  <tr>
                    <th className="bg-slate-50 py-2 px-3 text-left font-bold text-slate-700 border-r border-slate-200">
                      인근 실거래 시세
                    </th>
                    <td className="py-2 px-3 text-slate-800 border-r border-slate-200">
                      <strong>평당 {(parcel.realEstate.avgTradingPricePerPyeong || 85000).toLocaleString()}원</strong>{' '}
                      <span className="text-slate-500 text-[11px]">(공시지가 대비 약 {((parcel.realEstate.avgTradingPricePerPyeong || 85000) / (parcel.officialPrice * 3.305785)).toFixed(1)}배)</span>
                    </td>
                    <th className="bg-slate-50 py-2 px-3 text-left font-bold text-slate-700 border-r border-slate-200">
                      추정 토지 매입총액
                    </th>
                    <td className="py-2 px-3 font-bold text-amber-700 text-sm">
                      {((parcel.realEstate.estimatedLandPriceTotalWon || parcel.areaPyeong * 85000) / 100000000).toFixed(2)} 억원
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 4. Section 2 & 3: 규제 분석 + 한전 계통 2열 배치 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* 규제 및 조례 */}
            <div>
              <h2 className="text-xs font-bold text-slate-900 tracking-wider uppercase bg-slate-100 px-3 py-1.5 border-l-4 border-blue-500 mb-2 flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
                2. 법률 및 조례 규제 진단
              </h2>
              <table className="w-full text-[11px] border border-slate-300 border-collapse">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <th className="w-28 bg-slate-50 p-2 text-left font-semibold text-slate-700 border-r border-slate-200">
                      주거지 이격
                    </th>
                    <td className="p-2 text-slate-800">
                      실제 <strong>{parcel.regulationChecks.residentialDistance.distance}m</strong> (기준 {parcel.regulationChecks.residentialDistance.required}m){' '}
                      {parcel.regulationChecks.residentialDistance.pass ? (
                        <span className="text-emerald-600 font-bold ml-1">✓ 충족</span>
                      ) : (
                        <span className="text-rose-600 font-bold ml-1">✕ 미달</span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="bg-slate-50 p-2 text-left font-semibold text-slate-700 border-r border-slate-200">
                      도로 이격
                    </th>
                    <td className="p-2 text-slate-800">
                      실제 <strong>{parcel.regulationChecks.roadDistance.distance}m</strong> (기준 {parcel.regulationChecks.roadDistance.required}m){' '}
                      {parcel.regulationChecks.roadDistance.pass ? (
                        <span className="text-emerald-600 font-bold ml-1">✓ 충족</span>
                      ) : (
                        <span className="text-amber-600 font-bold ml-1">! 협의</span>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="bg-slate-50 p-2 text-left font-semibold text-slate-700 border-r border-slate-200">
                      DEM 표고 경사
                    </th>
                    <td className="p-2 text-slate-800">
                      <strong>{parcel.slopeDegree}°</strong> (허용 {parcel.regulationChecks.slopeCheck.limit}° 이하, {parcel.aspect})
                    </td>
                  </tr>
                  <tr>
                    <th className="bg-slate-50 p-2 text-left font-semibold text-slate-700 border-r border-slate-200">
                      보전/규제구역
                    </th>
                    <td className="p-2 text-slate-800">
                      {parcel.regulationChecks.protectionZone.zoneName || '규제구역 미저촉 (양호)'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 한전 계통 연계 */}
            <div>
              <h2 className="text-xs font-bold text-slate-900 tracking-wider uppercase bg-slate-100 px-3 py-1.5 border-l-4 border-amber-500 mb-2 flex items-center justify-between">
                <span className="flex items-center">
                  <Zap className="w-3.5 h-3.5 text-amber-600 mr-1.5" />
                  3. 한전 전력계통 연계 인프라
                </span>
                <span className="text-[10px] text-cyan-700 font-bold">re100market 계통</span>
              </h2>
              <table className="w-full text-[11px] border border-slate-300 border-collapse mb-2">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <th className="w-24 bg-slate-50 p-2 text-left font-semibold text-slate-700 border-r border-slate-200">
                      관할 변전소
                    </th>
                    <td className="p-2 font-bold text-slate-800">
                      154kV {parcel.grid.substationName} (직선 {parcel.grid.substationDistanceKm}km)
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="bg-slate-50 p-2 text-left font-semibold text-slate-700 border-r border-slate-200">
                      변전소 여유용량
                    </th>
                    <td className="p-2 font-black text-emerald-700">
                      {parcel.grid.availableCapacityMw} MW ({parcel.grid.status})
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* 주변 3대 배전선로(DL) 현황표 */}
              {parcel.grid.distributionLines && parcel.grid.distributionLines.length > 0 && (
                <div className="border border-slate-300 rounded overflow-hidden">
                  <div className="bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-700 border-b border-slate-200 flex justify-between items-center">
                    <span>⚡ 주변 3대 배전선로(DL) 및 표준 인입공사비</span>
                    <span className="text-[9px] text-slate-500">M.Tr 잔여 {parcel.grid.mtrAvailableMw ?? (parcel.grid.availableCapacityMw * 1.2).toFixed(1)}MW</span>
                  </div>
                  <table className="w-full text-[10px] border-collapse text-center">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <th className="p-1 font-semibold text-left pl-2">선로명</th>
                        <th className="p-1 font-semibold">여유도</th>
                        <th className="p-1 font-semibold">거리</th>
                        <th className="p-1 font-semibold">인입비(추정)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parcel.grid.distributionLines.map((dl, idx) => (
                        <tr key={idx} className={`border-b border-slate-200 last:border-b-0 ${idx === 0 ? 'bg-amber-50/60 font-semibold' : ''}`}>
                          <td className="p-1 text-slate-800 text-left pl-2">
                            {idx === 0 && <span className="text-[9px] text-amber-700 mr-0.5">★최적 </span>}
                            {dl.name}
                          </td>
                          <td className={`p-1 font-mono font-bold ${dl.availableMw > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                            {dl.availableMw}MW
                          </td>
                          <td className="p-1 text-slate-600 font-mono">{dl.distanceKm}km</td>
                          <td className="p-1 text-slate-800 font-mono">약 {(dl.estimatedInterconnectionCostWon / 10000).toLocaleString()}만원</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* 5. Section 4 & 5: 일사량/설비규모 + 경제성 시뮬레이션 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* 발전 설비 규모 */}
            <div>
              <h2 className="text-xs font-bold text-slate-900 tracking-wider uppercase bg-slate-100 px-3 py-1.5 border-l-4 border-amber-500 mb-2 flex items-center">
                <Sun className="w-3.5 h-3.5 text-amber-600 mr-1.5" />
                4. 일사량 및 발전 설비 잠재량
              </h2>
              <table className="w-full text-[11px] border border-slate-300 border-collapse">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <th className="w-28 bg-slate-50 p-2 text-left font-semibold text-slate-700 border-r border-slate-200">
                      연평균 일사시간
                    </th>
                    <td className="p-2 text-slate-800">
                      <strong>{parcel.solar.ghiAnnualAvg} 시간/일</strong>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="bg-slate-50 p-2 text-left font-semibold text-slate-700 border-r border-slate-200">
                      발전 유효면적
                    </th>
                    <td className="p-2 text-slate-800">
                      약 {parcel.solar.effectiveAreaSqm.toLocaleString()}㎡ (순면적 82% 기준)
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="bg-slate-50 p-2 text-left font-semibold text-slate-700 border-r border-slate-200">
                      추정 설비용량
                    </th>
                    <td className="p-2 font-black text-amber-700 text-xs">
                      {parcel.solar.estimatedCapacityKwp.toLocaleString()} kWp
                    </td>
                  </tr>
                  <tr>
                    <th className="bg-slate-50 p-2 text-left font-semibold text-slate-700 border-r border-slate-200">
                      연간 예상 발전량
                    </th>
                    <td className="p-2 font-bold text-emerald-700">
                      {Math.round(parcel.solar.annualGenerationKwh / 1000).toLocaleString()} MWh/년
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 경제성 분석 */}
            <div>
              <h2 className="text-xs font-bold text-slate-900 tracking-wider uppercase bg-slate-100 px-3 py-1.5 border-l-4 border-emerald-500 mb-2 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                5. 사업성 및 15개년 경제성 분석
              </h2>
              <table className="w-full text-[11px] border border-slate-300 border-collapse">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <th className="w-28 bg-slate-50 p-2 text-left font-semibold text-slate-700 border-r border-slate-200">
                      총 투자비(CAPEX)
                    </th>
                    <td className="p-2 text-slate-800">
                      <strong>{(parcel.financials.capexTotalWon / 100000000).toFixed(2)} 억원</strong> (kW당 125만원)
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="bg-slate-50 p-2 text-left font-semibold text-slate-700 border-r border-slate-200">
                      예상 연매출
                    </th>
                    <td className="p-2 font-bold text-emerald-700">
                      약 {(parcel.financials.annualRevenueWon / 10000).toLocaleString()} 만원/년 (SMP+REC)
                    </td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <th className="bg-slate-50 p-2 text-left font-semibold text-slate-700 border-r border-slate-200">
                      내부수익률(IRR)
                    </th>
                    <td className="p-2 font-black text-amber-700 text-xs">
                      {parcel.financials.irrPercent}%
                    </td>
                  </tr>
                  <tr>
                    <th className="bg-slate-50 p-2 text-left font-semibold text-slate-700 border-r border-slate-200">
                      투자 회수기간
                    </th>
                    <td className="p-2 text-slate-800">
                      약 <strong>{parcel.financials.paybackYears} 년</strong> (순현재가치 {(parcel.financials.npvWon / 100000000).toFixed(1)}억원)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. Section 6: 종합 의견 및 Action Item */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-relaxed mb-6">
            <h3 className="font-bold text-slate-900 mb-1">📋 전문 분석관 종합 판정 의견</h3>
            <p className="text-slate-700">
              본 대상 부지(<strong>{parcel.address}</strong>)는 관할 변전소 공개 여유 <strong>{parcel.grid.availableCapacityMw} MW</strong> 및 추천 배전선로(<strong>{parcel.grid.distributionLines?.[0]?.name || parcel.grid.dlName}</strong>, 여유 {parcel.grid.distributionLines?.[0]?.availableMw || parcel.grid.availableCapacityMw}MW)가 확보된 <strong>{parcel.suitability}</strong> 등급의 우수 사업 후보지입니다.
              토지 도로접면은 <strong>{parcel.realEstate?.roadAccess || '폭 4m 포장도로 접면'}</strong>이며 인근 실거래 시세 기준 추정 매입가는 약 <strong>{parcel.realEstate ? (((parcel.realEstate.estimatedLandPriceTotalWon || parcel.areaPyeong * 85000) / 100000000).toFixed(2) + '억원') : '협의'}</strong>입니다.
              예상 설비용량은 약 <strong>{parcel.solar.estimatedCapacityKwp} kWp</strong> 규모로 연간 <strong>{Math.round(parcel.solar.annualGenerationKwh / 1000).toLocaleString()} MWh</strong> 발전 및 내부수익률(IRR) <strong>{parcel.financials.irrPercent}%</strong> 수준의 안정적인 현금흐름이 기대됩니다.
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>추천 후속 절차: 1) 지자체 개발행위허가 사전심사 ➔ 2) 한전 선로용량 선착순 접수(한전ON)</span>
              <span className="font-bold text-slate-800">담당 분석관: 이승호 (인텔리전스 총괄)</span>
            </div>
          </div>

          {/* 7. Footer & Stamp */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div>
              <p className="font-semibold text-slate-700">Lifety Solar Intelligence (주식회사 라이프티)</p>
              <p>본 사전 검토서는 지자체 조례 및 공공 포털 기준 시뮬레이션이며 최종 인허가는 관할 행정청의 결정에 따릅니다.</p>
            </div>
            <div className="text-right shrink-0">
              <div className="inline-block border border-amber-600 px-3 py-1 rounded text-amber-800 font-bold text-xs bg-amber-50">
                LIFETY 검토확인필 [印]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
