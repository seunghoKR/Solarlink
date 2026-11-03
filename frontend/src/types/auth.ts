export type UserRole = 'admin' | 'developer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  email: string;
}

export const PRESET_ACCOUNTS = [
  // 1. 시스템 개발자 (이승호 님)
  {
    username: 'developer',
    password: 'dev2026!',
    user: {
      id: 'usr_dev',
      name: '이승호',
      role: 'developer' as UserRole,
      roleLabel: '시스템 개발자',
      email: 'nuriohga@gmail.com',
    },
  },
  {
    username: 'developer',
    password: 'solar2026!', // 대표님 입력 편의용 추가
    user: {
      id: 'usr_dev',
      name: '이승호',
      role: 'developer' as UserRole,
      roleLabel: '시스템 개발자',
      email: 'nuriohga@gmail.com',
    },
  },
  {
    username: 'leesh',
    password: 'solar2026!',
    user: {
      id: 'usr_dev',
      name: '이승호',
      role: 'developer' as UserRole,
      roleLabel: '시스템 개발자',
      email: 'nuriohga@gmail.com',
    },
  },
  {
    username: 'leesh',
    password: 'dev2026!',
    user: {
      id: 'usr_dev',
      name: '이승호',
      role: 'developer' as UserRole,
      roleLabel: '시스템 개발자',
      email: 'nuriohga@gmail.com',
    },
  },

  // 2. 사이트 관리자
  {
    username: 'admin',
    password: 'admin2026!',
    user: {
      id: 'usr_admin',
      name: '김태영',
      role: 'admin' as UserRole,
      roleLabel: '사이트 관리자',
      email: 'taeyoung@lifety.kr',
    },
  },
  {
    username: 'admin',
    password: 'solar2026!', // 대표님 입력 편의용 추가
    user: {
      id: 'usr_admin',
      name: '관리자',
      role: 'admin' as UserRole,
      roleLabel: '사이트 관리자',
      email: 'admin@lifety.kr',
    },
  },
];
