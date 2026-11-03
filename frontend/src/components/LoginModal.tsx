import React, { useState } from 'react';
import { Lock, ShieldAlert, ArrowRight } from 'lucide-react';
import { PRESET_ACCOUNTS, type User } from '../types/auth';

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const matched = PRESET_ACCOUNTS.find(
      (acc) => acc.username === username.trim() && acc.password === password.trim()
    );

    if (matched) {
      onLoginSuccess(matched.user);
    } else {
      setErrorMessage('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        {/* Glow accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

        {/* Brand Header */}
        <div className="p-6 pb-4 text-center">
          <img
            src="/logo.jpg"
            alt="Lifety Solar Intelligence 로고"
            className="w-16 h-16 rounded-2xl mx-auto mb-3 object-cover ring-2 ring-amber-400/50 shadow-xl shadow-amber-500/20"
          />
          <h2 className="text-xl font-bold text-white tracking-tight">Lifety Solar Intelligence</h2>
          <p className="text-sm text-slate-400 mt-1">
            대한민국 태양광 부지 탐색 & 사업성 분석 플랫폼
          </p>

          <div className="mt-3 inline-flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-xs text-amber-300 font-semibold">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>비공개 인가자 전용 시스템 (Access Restricted)</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-6 pt-2 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
              사용자 아이디 (Username)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디를 입력하세요"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1.5">
              비밀번호 (Password)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 transition shadow-lg shadow-amber-500/25 cursor-pointer mt-2"
          >
            <span>시스템 로그인</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* System Version & Security Footer (v2.0 표기) */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 font-medium">Enterprise Security Active</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 text-xs">Release</span>
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono font-bold px-2.5 py-0.5 rounded text-xs">
              v2.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
