import React, { useState, useEffect, useRef } from 'react';
import {
  KeyRound,
  Bookmark,
  Search,
  LogOut,
  ShieldCheck,
  Code,
  BookOpen,
  Clock,
  X,
  Trash2,
  MapPin,
} from 'lucide-react';
import type { User } from '../types/auth';
import {
  getRecentSearches,
  removeRecentSearch,
  clearRecentSearches,
  type UserSearchRecord,
} from '../services/saasStorage';

interface NavbarProps {
  currentUser: User | null;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (queryOverride?: string) => void;
  onOpenVault: () => void;
  onOpenBookmarks: () => void;
  onOpenUserGuide: () => void;
  bookmarkCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onLogout,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onOpenVault,
  onOpenBookmarks,
  onOpenUserGuide,
  bookmarkCount,
}) => {
  const [isRecentDropdownOpen, setIsRecentDropdownOpen] = useState(false);
  const [recentList, setRecentList] = useState<UserSearchRecord[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // 최근 검색어 로드
  const loadRecentSearches = () => {
    const list = getRecentSearches(currentUser?.id || 'guest');
    setRecentList(list);
  };

  useEffect(() => {
    loadRecentSearches();
  }, [currentUser]);

  // 검색창 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsRecentDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectRecent = (record: UserSearchRecord) => {
    onSearchChange(record.query);
    setIsRecentDropdownOpen(false);
    onSearchSubmit(record.query);
  };

  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = removeRecentSearch(id, currentUser?.id || 'guest');
    setRecentList(updated);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearRecentSearches(currentUser?.id || 'guest');
    setRecentList([]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecentDropdownOpen(false);
    onSearchSubmit();
  };

  // 추천 핫스팟 (최근 기록 없을 때 보여줄 예시)
  const RECOMMENDATIONS = [
    '기지로 180',
    '전주시 덕진구 만성동 1345-1',
    '전라남도 해남군 산이면 부동리 124-1',
    '충청남도 태안군 남면 신온리 45-2',
    '경상북도 상주시 화남면 동관리 88',
  ];

  return (
    <header className="h-[58px] bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-[9999] relative select-none no-print">
      {/* 🌟 대표님 요청: 로고 및 v1.0.0 공식 버전 표시 */}
      <div className="flex items-center space-x-2 shrink-0">
        <img
          src="/logo_transparent.png"
          alt="LIFETY"
          className="h-[46px] w-auto object-contain transition hover:opacity-95 cursor-pointer"
          onClick={() => window.location.reload()}
          title="Lifety Solar Intelligence 메인"
        />
        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-extrabold bg-amber-500/15 text-amber-300 border border-amber-500/30 tracking-tight">
          v1.0.0
        </span>
      </div>

      {/* 🌟 대표님 요청 1: 지도 위로 항상 최상위 노출되는 최근 검색어 드롭다운 */}
      <div ref={searchContainerRef} className="flex-1 max-w-md mx-6 relative z-[10000]">
        <form onSubmit={handleFormSubmit} className="flex items-center space-x-1.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => {
                loadRecentSearches();
                setIsRecentDropdownOpen(true);
              }}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="검색할 주소 입력 (예: 기지로 180, 만성동 1345-1, 해남 산이면)"
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-sans"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-1 transition shadow-sm cursor-pointer shrink-0 active:scale-98"
          >
            <Search className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>검색</span>
          </button>
        </form>

        {/* 🕒 최근 검색내용 플로팅 드롭다운 (SaaS Search History Menu) */}
        {isRecentDropdownOpen && (
          <div className="absolute top-full left-0 right-12 mt-1.5 bg-slate-900/98 backdrop-blur-md border border-slate-700/90 rounded-xl shadow-2xl z-[5000] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            {/* Header */}
            <div className="px-3 py-2 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1.5 text-slate-300 font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>최근 검색한 지역</span>
                {recentList.length > 0 && (
                  <span className="text-[10px] text-amber-400/80 font-mono">
                    ({recentList.length})
                  </span>
                )}
              </div>
              {recentList.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-[11px] text-slate-500 hover:text-rose-400 flex items-center space-x-0.5 transition cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>전체 삭제</span>
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60 text-xs">
              {recentList.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-slate-400 text-xs mb-2">최근 검색한 기록이 없습니다.</p>
                  <p className="text-[11px] text-slate-500 mb-2.5">
                    💡 이런 추천 부지를 검색해 보세요:
                  </p>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {RECOMMENDATIONS.map((rec) => (
                      <button
                        key={rec}
                        type="button"
                        onClick={() => {
                          onSearchChange(rec);
                          setIsRecentDropdownOpen(false);
                          onSearchSubmit(rec);
                        }}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-amber-500/10 text-slate-300 hover:text-amber-300 border border-slate-700/60 text-[11px] transition cursor-pointer"
                      >
                        {rec}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                recentList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectRecent(item)}
                    className="px-3 py-2 flex items-center justify-between hover:bg-slate-800/70 transition cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2 min-w-0 pr-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold text-slate-200 group-hover:text-amber-300 transition text-xs">
                          {item.query}
                        </span>
                        {item.refinedAddress && item.refinedAddress !== item.query && (
                          <span className="text-[10px] text-slate-400 block truncate">
                            {item.refinedAddress}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(item.searchedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteItem(e, item.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-700/50 transition cursor-pointer"
                        title="기록 삭제"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-3 py-1.5 bg-slate-950/80 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between items-center">
              <span>SaaS 클라우드 동기화 활성</span>
              <button
                type="button"
                onClick={() => setIsRecentDropdownOpen(false)}
                className="hover:text-slate-300 transition cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Badges & Actions */}
      <div className="flex items-center space-x-2 shrink-0">
        {/* User Guide Button */}
        <button
          onClick={onOpenUserGuide}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 transition shadow-sm cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>이용 가이드</span>
        </button>

        {/* Bookmarks Button */}
        <button
          onClick={onOpenBookmarks}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
        >
          <Bookmark className="w-3.5 h-3.5 text-amber-400" />
          <span>관심 후보</span>
          {bookmarkCount > 0 && (
            <span className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
              {bookmarkCount}
            </span>
          )}
        </button>

        {/* API Vault & SaaS Audit Button (개발자 전용) */}
        {currentUser?.role === 'developer' && (
          <button
            onClick={onOpenVault}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition shadow-sm cursor-pointer"
            title="개발자 전용 API 금고 및 SaaS 감사 로그 관리"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>API·감사 DB</span>
          </button>
        )}

        {/* User Account Info & Logout */}
        {currentUser && (
          <div className="flex items-center space-x-1.5 pl-2 border-l border-slate-800">
            <div className="flex items-center space-x-1.5 bg-slate-800/80 border border-slate-700 px-2.5 py-1.5 rounded text-xs">
              {currentUser.role === 'admin' ? (
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Code className="w-3.5 h-3.5 text-sky-400" />
              )}
              <span className="font-semibold text-slate-200">{currentUser.name}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  currentUser.role === 'admin'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-sky-500/20 text-sky-300'
                }`}
              >
                {currentUser.roleLabel}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 rounded bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 border border-slate-700 transition cursor-pointer"
              title="로그아웃"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
