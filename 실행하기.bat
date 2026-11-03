@echo off
chcp 65001 > nul
echo ========================================================
echo   ☀️ Lifety Solar Intelligence 웹앱 실행 스크립트
echo   AI 디자인실장 영자 제작 💖
echo ========================================================
echo.
cd /d "%~dp0\frontend"
if not exist node_modules (
  echo [안내] 의존성 패키지를 설치합니다...
  call npm install
)
echo [안내] 로컬 Vite 개발 서버를 실행합니다...
echo 브라우저에서 http://localhost:5173 에 접속해주세요!
echo.
npm run dev
pause
