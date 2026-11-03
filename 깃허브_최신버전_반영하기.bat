@echo off
chcp 65001 > nul
echo ===================================================
echo [LIFETY] GitHub Solarlink v1.0.0 최신 버전 푸시 도구
echo 원격 저장소: https://github.com/seunghoKR/Solarlink
echo ===================================================
echo.

cd /d "c:\Dev\태양광부지발굴"

echo [1/4] Git 초기화 및 브랜치 설정...
if not exist .git (
    git init -b main
) else (
    git branch -M main
)

echo [2/4] 원격 저장소(origin) 연결 확인...
git remote remove origin 2>nul
git remote add origin https://github.com/seunghoKR/Solarlink.git

echo [3/4] 최신 파일 스테이징 및 커밋 생성...
git add .
git commit -m "feat: Release Lifety Solarlink v1.0.0 (Official Build)"

echo [4/4] 깃허브 main 브랜치로 최신 코드 전면 교체 (Force Push)...
git push -u origin main --force

echo.
echo ===================================================
echo ✓ 깃허브 Solarlink 저장소 업데이트가 성공적으로 완료되었습니다!
echo https://github.com/seunghoKR/Solarlink 에서 확인하세요.
echo ===================================================
pause
