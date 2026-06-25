@echo off
setlocal enabledelayedexpansion

:: ── Timestamp ────────────────────────────────────────────────────────────────
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set DT=%%I

set YYYY=!DT:~0,4!
set MM=!DT:~4,2!
set DD=!DT:~6,2!
set HH=!DT:~8,2!
set NN=!DT:~10,2!
set SS=!DT:~12,2!

set FILENAME=!YYYY!!MM!!DD! - test run T!HH!!NN!!SS!.md
set LOGPATH=..\docs\!FILENAME!
set RAWOUT=%TEMP%\grocerytest_raw.txt
set CLEANOUT=%TEMP%\grocerytest_clean.txt

:: ── Run tests ────────────────────────────────────────────────────────────────
cd /d "%~dp0"
npx ts-node --project tsconfig.json tests/run-all.ts > "!RAWOUT!" 2>&1

:: ── Print raw output to console (with colours) ───────────────────────────────
type "!RAWOUT!"

:: ── Strip ANSI colour codes for the MD file (requires PowerShell) ────────────
powershell -NoProfile -Command ^
  "(Get-Content '%RAWOUT%' -Raw) -replace '\x1b\[[0-9;]*m', '' | Set-Content '%CLEANOUT%' -NoNewline"

:: ── Detect result by reading the cleaned output ──────────────────────────────
set RESULT=FAIL
set STATUS_ICON=❌ FAILURES DETECTED
findstr /C:"ALL SUITES PASSED" "!CLEANOUT!" >nul 2>&1
if !ERRORLEVEL!==0 (
  set RESULT=PASS
  set STATUS_ICON=✅ ALL SUITES PASSED
)

:: ── Write Markdown report ────────────────────────────────────────────────────
(
  echo # Test Run — !YYYY!-!MM!-!DD! T!HH!:!NN!:!SS!
  echo.
  echo ^| Field  ^| Value ^|
  echo ^|--------|-------|
  echo ^| Date   ^| !YYYY!-!MM!-!DD! ^|
  echo ^| Time   ^| !HH!:!NN!:!SS! ^|
  echo ^| Result ^| !RESULT! ^|
  echo.
  echo ## Output
  echo.
  echo ```
  type "!CLEANOUT!"
  echo ```
  echo.
  echo **Status: !STATUS_ICON!**
) > "!LOGPATH!"

echo.
echo Log saved to: docs\!FILENAME!

if "!RESULT!"=="PASS" ( exit /b 0 ) else ( exit /b 1 )
