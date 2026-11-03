@echo off
chcp 65001 > nul
echo ========================================================
echo   🚀 Lifety Solar Intelligence - iwinv 서버 원클릭 배포
echo   AI 디자인실장 영자 제작 💖
echo ========================================================
echo.
echo [1/2] 프론트엔드 최신 소스를 빌드합니다...
cd /d "%~dp0\frontend"
call npm run build
if %errorlevel% neq 0 (
  echo [오류] 빌드에 실패했습니다.
  pause
  exit /b %errorlevel%
)
cd /d "%~dp0"
echo.
echo [2/2] iwinv 호스팅(re100life.com)으로 FTP 배포를 시작합니다...
powershell -NoProfile -ExecutionPolicy Bypass -File deploy_ftp.ps1
echo.
echo ========================================================
echo   배포가 성공적으로 완료되었습니다!
echo   정식 서비스 도메인: https://re100life.com (www.re100life.com)
echo   기존 접속 도메인: https://agentsolar26.iwinv.net
echo ========================================================
pause
