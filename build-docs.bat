@setlocal
@echo off
pushd %~dp0

if not exist "%CHEM_PHP%" (
  echo %%CHEM_PHP%% not defined or not path to existing file
  exit /b 1
)

if exist docs rd /s /q docs
rem If yours is in a different location then give --esprima-node argument to
rem this batch script's command-line.
set NODE=cmd /C """cd /D """"""C:\\Program Files\\Node.js"""""" ^&^& node.exe -"""

set COMMIT=master
git rev-parse --verify HEAD >tmp
if %errorlevel% equ 0 set /p COMMIT=<tmp
del tmp

php "%CHEM_PHP%" --esprima-node="%NODE%" -p=docs -z ^
  -iid=nodash -ititle=NoDash -iwww=https://squizzle.me/js/nodash/ ^
  --f-startPage=NoDash ^
  --f-codeLineURL=https://github.com/ProgerXP/NoDash/blob/%COMMIT%/%%s#L%%d-L%%d ^
  --f-codeSnippets ^
  --f-link-GitHub=https://github.com/ProgerXP/NoDash ^
  --f-link-download=https://github.com/ProgerXP/NoDash/archive/master.zip ^
  --f-link-issues=https://github.com/ProgerXP/NoDash/issues ^
  --extchem-un=https://underscorejs.org/[#%%r] ^
  --extchem-lo=https://lodash.com/[docs/#%%r] ^
  --extchem-sq=https://squizzle.me/js/sqimitive/ ^
  --extchem-o=https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/%%u ^
  --extchem-mdn=https://developer.mozilla.org/en-US/docs/Web/%%u ^
  main.js extra.js ^
  COMPATIBILITY.chem -c=COMPATIBILITY.php %*
