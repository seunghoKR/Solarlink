/**
 * Lifety Solar Intelligence - SaaS Data & Audit Storage Service
 * 사용자 검색 이력, 관심 지역(북마크), 사용자 활동 로그(Audit Log)를 체계적으로 관리합니다.
 */

export interface UserSearchRecord {
  id: string;
  userId: string;
  query: string;
  refinedAddress?: string;
  coordinates?: [number, number];
  searchedAt: string; // ISO String
}

export interface BookmarkRecord {
  id: string;
  userId: string;
  parcelId: string;
  address: string;
  pnu: string;
  areaPyeong: number;
  suitability: string;
  memo?: string;
  createdAt: string;
}

export type AuditActionType =
  | 'LOGIN'
  | 'LOGOUT'
  | 'SEARCH_ADDRESS'
  | 'FILTER_SEARCH'
  | 'VIEW_PARCEL'
  | 'EXPORT_REPORT_PDF'
  | 'EXPORT_CSV'
  | 'RIGHT_CLICK_INSPECT'
  | 'TOGGLE_BOOKMARK';

export interface AuditLogRecord {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: AuditActionType;
  details: string;
  timestamp: string;
}

const STORAGE_KEY_SEARCHES = 'lifety_saas_search_history';
const STORAGE_KEY_BOOKMARKS = 'lifety_saas_bookmarks';
const STORAGE_KEY_AUDIT_LOGS = 'lifety_saas_audit_logs';

/**
 * 1. 최근 검색어 관리 (Search History)
 */
export function getRecentSearches(userId: string = 'guest'): UserSearchRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SEARCHES);
    if (!raw) return [];
    const list: UserSearchRecord[] = JSON.parse(raw);
    return list.filter((item) => item.userId === userId || userId === 'all');
  } catch (e) {
    console.warn('최근 검색어 로드 실패:', e);
    return [];
  }
}

export function addRecentSearch(
  query: string,
  refinedAddress?: string,
  coordinates?: [number, number],
  userId: string = 'usr_dev'
): UserSearchRecord[] {
  const trimmed = query.trim();
  if (!trimmed) return getRecentSearches(userId);

  try {
    const current = getRecentSearches('all');
    // 중복 제거 (동일 쿼리 제거 후 맨 앞에 추가)
    const filtered = current.filter(
      (item) => item.userId !== userId || item.query.toLowerCase() !== trimmed.toLowerCase()
    );

    const newRecord: UserSearchRecord = {
      id: `srch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      query: trimmed,
      refinedAddress,
      coordinates,
      searchedAt: new Date().toISOString(),
    };

    const updated = [newRecord, ...filtered].slice(0, 30); // 최대 30개 보관
    localStorage.setItem(STORAGE_KEY_SEARCHES, JSON.stringify(updated));
    return updated.filter((item) => item.userId === userId);
  } catch (e) {
    console.warn('검색어 저장 실패:', e);
    return [];
  }
}

export function removeRecentSearch(id: string, userId: string = 'usr_dev'): UserSearchRecord[] {
  try {
    const current = getRecentSearches('all');
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY_SEARCHES, JSON.stringify(updated));
    return updated.filter((item) => item.userId === userId);
  } catch (e) {
    console.warn('검색어 삭제 실패:', e);
    return [];
  }
}

export function clearRecentSearches(userId: string = 'usr_dev'): void {
  try {
    const current = getRecentSearches('all');
    const updated = current.filter((item) => item.userId !== userId);
    localStorage.setItem(STORAGE_KEY_SEARCHES, JSON.stringify(updated));
  } catch (e) {
    console.warn('검색어 전체 삭제 실패:', e);
  }
}

/**
 * 2. 사용자 활동 감사 로그 (Audit Logs)
 */
export function recordAuditLog(
  user: { id: string; name: string; role: string } | null,
  action: AuditActionType,
  details: string
): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUDIT_LOGS);
    const logs: AuditLogRecord[] = raw ? JSON.parse(raw) : [];

    const newLog: AuditLogRecord = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: user?.id || 'anonymous',
      userName: user?.name || '방문자',
      userRole: user?.role || 'guest',
      action,
      details,
      timestamp: new Date().toISOString(),
    };

    const updated = [newLog, ...logs].slice(0, 500); // 최대 500개 로그 보관
    localStorage.setItem(STORAGE_KEY_AUDIT_LOGS, JSON.stringify(updated));
  } catch (e) {
    console.warn('감사 로그 기록 실패:', e);
  }
}

export function getAuditLogs(): AuditLogRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUDIT_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function clearAuditLogs(): void {
  localStorage.removeItem(STORAGE_KEY_AUDIT_LOGS);
}

/**
 * 3. 관심 지역 / 북마크 DB (SaaS Bookmarks)
 */
export function getSavedBookmarks(userId: string = 'usr_dev'): BookmarkRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    if (!raw) return [];
    const list: BookmarkRecord[] = JSON.parse(raw);
    return list.filter((item) => item.userId === userId);
  } catch (e) {
    return [];
  }
}

export function saveBookmark(
  userId: string,
  parcel: { id: string; address: string; pnu: string; areaPyeong: number; suitability: string },
  memo?: string
): BookmarkRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    const list: BookmarkRecord[] = raw ? JSON.parse(raw) : [];

    // 이미 존재하면 삭제 (토글)
    const exists = list.some((item) => item.userId === userId && item.parcelId === parcel.id);
    let updated: BookmarkRecord[];

    if (exists) {
      updated = list.filter((item) => !(item.userId === userId && item.parcelId === parcel.id));
    } else {
      const record: BookmarkRecord = {
        id: `bm_${Date.now()}`,
        userId,
        parcelId: parcel.id,
        address: parcel.address,
        pnu: parcel.pnu,
        areaPyeong: parcel.areaPyeong,
        suitability: parcel.suitability,
        memo,
        createdAt: new Date().toISOString(),
      };
      updated = [record, ...list];
    }

    localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(updated));
    return updated.filter((item) => item.userId === userId);
  } catch (e) {
    console.warn('북마크 저장 실패:', e);
    return [];
  }
}
