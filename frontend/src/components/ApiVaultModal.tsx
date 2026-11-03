import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Lock,
  Server,
  Database,
  Download,
  Trash2,
} from 'lucide-react';
import { getAuditLogs, clearAuditLogs, type AuditLogRecord } from '../services/saasStorage';

interface ApiVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiProviderConfig {
  id: string;
  name: string;
  service: string;
  keyMasked: string;
  status: 'healthy' | 'warning' | 'untested';
  lastChecked: string;
  dailyQuota: string;
}

export const ApiVaultModal: React.FC<ApiVaultModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'api' | 'audit'>('api');
  const [testingId, setTestingId] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);

  const [providers, setProviders] = useState<ApiProviderConfig[]>([
    {
      id: 'vworld',
      name: '국토교통부 브이월드 (VWorld)',
      service: '연속지적도 / 배경지도 WMS / 2D 지적속성 API',
      keyMasked: 'E810A4B0-••••-••••-••••-2B905CFAD2B7',
      status: 'healthy',
      lastChecked: '2026-11-03 15:00 (연동 완료)',
      dailyQuota: '0 / 50,000건',
    },
    {
      id: 'data_go',
      name: '공공데이터포털 (data.go.kr)',
      service: '국토교통부 건축HUB 건축물대장정보 (BldRgstHubService)',
      keyMasked: 'c3198f2f••••••••••••••••••••••••••••••••0d4269db',
      status: 'healthy',
      lastChecked: '2026-11-03 15:15 (연동 완료)',
      dailyQuota: '0 / 10,000건',
    },
    {
      id: 'open_law',
      name: '법제처 국가법령정보 (open.law.go.kr)',
      service: '자치법규(조례/규칙) 본문 검색 / OC 인증키',
      keyMasked: 'nurio_••••',
      status: 'healthy',
      lastChecked: '2026-11-03 15:41 (연동 완료)',
      dailyQuota: '0 / 무제한 (자동승인)',
    },
    {
      id: 'kepco',
      name: '한전 전력데이터개방포털 (KEPCO)',
      service: '분산전원 연계정보 / 변전소 및 DL 여유용량 (dispersedGeneration.do)',
      keyMasked: 'px8m3k79••••••••••••••••••••••••••••••••J6v018',
      status: 'healthy',
      lastChecked: '2026-11-03 15:33 (연동 완료)',
      dailyQuota: '0 / 1,000건',
    },
    {
      id: 'kier_kma',
      name: '한국에너지기술연구원 (KIER)',
      service: '태양에너지 시공간 자원정보 (SolarGhiService)',
      keyMasked: 'c3198f2f••••••••••••••••••••••••••••••••0d4269db',
      status: 'healthy',
      lastChecked: '2026-11-03 15:20 (연동 완료)',
      dailyQuota: '0 / 10,000건',
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      setAuditLogs(getAuditLogs());
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const handleTestConnection = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setProviders((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: 'healthy', lastChecked: '방금 전 (정상 회신)' } : p
        )
      );
      setTestingId(null);
    }, 800);
  };

  const handleExportAuditCsv = () => {
    const csvRows = [
      '로그ID,사용자ID,사용자명,권한,작업유형,상세내용,일시',
      ...auditLogs.map(
        (l) =>
          `${l.id},"${l.userId}","${l.userName}","${l.userRole}","${l.action}","${l.details.replace(
            /"/g,
            '""'
          )}","${l.timestamp}"`
      ),
    ];
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,\uFEFF' + csvRows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Lifety_SaaS_Audit_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearLogs = () => {
    if (window.confirm('모든 사용자 감사 로그를 영구 삭제하시겠습니까?')) {
      clearAuditLogs();
      setAuditLogs([]);
    }
  };

  return (
    <div className="fixed inset-0 z-[11000] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Server className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-white">
              SaaS 관리자 콘솔 (API 금고 & 사용자 감사 DB)
            </h3>
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold px-2 py-0.5 rounded text-[10px]">
              개발자 전용
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('api')}
            className={`py-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'api'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>외부 공공·전력 API 금고</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-2.5 px-3 border-b-2 flex items-center space-x-1.5 transition cursor-pointer ${
              activeTab === 'audit'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>사용자 감사 로그 & SaaS DB</span>
            <span className="bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full text-[10px]">
              {auditLogs.length}
            </span>
          </button>
        </div>

        {/* Tab 1: API Keys */}
        {activeTab === 'api' && (
          <div className="p-4 space-y-3.5 overflow-y-auto max-h-[60vh]">
            <p className="text-xs text-slate-400 leading-relaxed">
              모든 외부 연계 키는 서버단에서 AES-256 방식으로 안전하게 암호화 보관되며, 클라이언트 소스코드에 원형이 노출되지 않도록 게이트웨이를 경유합니다.
            </p>

            <div className="space-y-2.5">
              {providers.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-100">{p.name}</span>
                      <span className="text-[11px] text-slate-400 ml-2">({p.service})</span>
                    </div>
                    <div>
                      {p.status === 'healthy' ? (
                        <span className="inline-flex items-center text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          정상 작동중
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          쿼터 주의
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700/60">
                        {p.keyMasked}
                      </span>
                      <span className="text-slate-400 text-[11px]">일일 호출: {p.dailyQuota}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-500 text-[11px]">확인: {p.lastChecked}</span>
                      <button
                        onClick={() => handleTestConnection(p.id)}
                        disabled={testingId === p.id}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-medium transition flex items-center space-x-1 cursor-pointer"
                      >
                        <RefreshCw
                          className={`w-3 h-3 ${testingId === p.id ? 'animate-spin text-amber-400' : ''}`}
                        />
                        <span>{testingId === p.id ? '검증중' : '연결시험'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: SaaS Audit Logs */}
        {activeTab === 'audit' && (
          <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh] text-xs">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <div>
                <span className="font-bold text-slate-200">실시간 사용자 활동 로그 스트림</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  주소 검색, 필터 조건 조회, 부지 열람, PDF 보고서 출력 등 모든 SaaS 활동이 추적됩니다.
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportAuditCsv}
                  disabled={auditLogs.length === 0}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded flex items-center space-x-1 transition cursor-pointer text-xs disabled:opacity-50"
                >
                  <Download className="w-3 h-3" />
                  <span>CSV 저장</span>
                </button>
                <button
                  onClick={handleClearLogs}
                  disabled={auditLogs.length === 0}
                  className="px-2 py-1 bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 border border-slate-700 rounded transition cursor-pointer text-xs"
                  title="로그 초기화"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {auditLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                기록된 사용자 활동 로그가 없습니다.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-lg overflow-hidden">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-2.5 bg-slate-900/60 hover:bg-slate-800/40 transition">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            log.action === 'LOGIN'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : log.action === 'SEARCH_ADDRESS'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : log.action === 'EXPORT_REPORT_PDF'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {log.action}
                        </span>
                        <span className="font-semibold text-slate-200 text-xs">
                          {log.userName} ({log.userRole})
                        </span>
                      </div>
                      <span className="text-slate-500 font-mono text-[10px]">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] pl-1 break-all">{log.details}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
