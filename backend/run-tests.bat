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

set FILENAME=!YYYY!!MM!!DD! - test run T !HH!!NN!!SS!.md
set LOGPATH=..\docs\!FILENAME!

:: ── Run tests, capture raw output ────────────────────────────────────────────
cd /d "%~dp0"
npx ts-node --project tsconfig.test.json tests/run-all.ts > "%TEMP%\grocerytest_raw.txt" 2>&1
set EXIT_CODE=!ERRORLEVEL!

:: ── Print to console ─────────────────────────────────────────────────────────
type "%TEMP%\grocerytest_raw.txt"

:: ── Write MD file ─────────────────────────────────────────────────────────────
(
  echo # Test Run — !YYYY!-!MM!-!DD! T!HH!:!NN!:!SS!
  echo.
  echo ^| Field ^| Value ^|
  echo ^|-------^|-------^|
  echo ^| Date  ^| !YYYY!-!MM!-!DD! ^|
  echo ^| Time  ^| !HH!:!NN!:!SS! ^|
  echo ^| Result ^| %EXIT_CODE% == 0 ? PASS : FAIL ^|
  echo.
  echo ## Output
  echo.
  echo ^^^```
  type "%TEMP%\grocerytest_raw.txt"
  echo ^^^```
  echo.
  if !EXIT_CODE!==0 (
    echo **Status: ✅ ALL PASSED**
  ) else (
    echo **Status: ❌ FAILURES DETECTED**
  )
) > "!LOGPATH!"

echo.
echo Log saved to: docs\!FILENAME!
exit /b !EXIT_CODE!
