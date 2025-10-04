@echo off
echo Testing Windows batch file...
echo.

echo Current directory: %CD%
echo.

echo Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo Node.js not found
) else (
    echo Node.js found
)

echo.
echo Checking pnpm...
pnpm --version
if %errorlevel% neq 0 (
    echo pnpm not found
) else (
    echo pnpm found
)

echo.
echo Checking PostgreSQL...
psql --version
if %errorlevel% neq 0 (
    echo PostgreSQL not found
) else (
    echo PostgreSQL found
)

echo.
echo Press any key to exit...
pause >nul
