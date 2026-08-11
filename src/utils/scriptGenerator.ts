import { SoftwareApp, TargetOS, BrandingSettings } from '../types';

export const DEFAULT_BRANDING: BrandingSettings = {
  id: 1,
  product_name: 'EasySetup',
  tagline: 'Set up your laptop in one click.',
  developed_by: 'Developed by Vertex Digital Solutions',
  support_url: 'https://easysetup.dev/fix',
  accent_color: '#6366F1',
};

export function generateWindowsBatScript(
  apps: SoftwareApp[],
  customPreCommands?: string[],
  sessionCode: string = 'EZS-PREVIEW',
  branding: BrandingSettings = DEFAULT_BRANDING
): string {
  const preCommands = customPreCommands && customPreCommands.length > 0 
    ? customPreCommands.map(cmd => `echo [AI FIX COMMAND] Executing: ${cmd}\n${cmd}`).join('\n\n')
    : '';

  const appInstallBlocks = apps
    .map((app, index) => {
      const stepNum = index + 1;
      const total = apps.length;
      return `
echo.
echo [${stepNum}/${total}] Installing ${app.name}...
echo Installing ${app.name} (${app.winget_id})...
powershell -Command "Write-Progress -Activity '${branding.product_name} Machine Setup' -Status 'Installing ${app.name} (${stepNum}/${total})' -PercentComplete ${Math.round((stepNum / total) * 100)}"

winget install --id ${app.winget_id} --exact --silent --accept-source-agreements --accept-package-agreements
if %ERRORLEVEL% equ 0 (
    echo [OK] ${app.name} >> setup-log.txt
    echo [SUCCESS] ${app.name} installed successfully.
) else (
    echo [FAILED] exit_code=%ERRORLEVEL% app=${app.name} id=${app.winget_id} >> setup-log.txt
    echo [WARNING] Could not install ${app.name} (Exit code %ERRORLEVEL%). Continuing remaining queue...
)
`;
    })
    .join('\n');

  return `@echo off
:: ============================================================
:: ${branding.product_name} - ${branding.tagline}
:: Session ID: ${sessionCode}
:: ${branding.developed_by}
:: Support: ${branding.support_url}
:: Generated at: ${new Date().toLocaleString()}
:: Apps to Install: ${apps.length}
:: ============================================================

:: Request Administrator Privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ============================================================
    echo [${branding.product_name.toUpperCase()}] Requesting Administrator Privileges...
    echo ============================================================
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

title ${branding.product_name} - Automated Machine Installer [Session: ${sessionCode}]
color 0A

echo ============================================================
echo   ███████╗ █████╗ ███████╗██╗   ██╗███████╗████████╗██╗   ██╗██████╗ 
echo   ██╔════╝██╔══██╗██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗
echo   █████╗  ███████║███████╗ ╚████╔╝ ███████╗   ██║   ██║   ██║██████╔╝
echo   ██╔══╝  ██╔══██║╚════██║  ╚██╔╝  ╚════██║   ██║   ██║   ██║██╔═══╝ 
echo   ███████╗██║  ██║███████║   ██║   ███████║   ██║   ╚██████╔╝██║     
echo   ╚══════╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝   ╚═╝    ╚═════╝ ╚═╝     
echo ============================================================
echo   ${branding.tagline}
echo   ${branding.developed_by}
echo   Session ID: ${sessionCode}
echo ============================================================
echo Target OS: Windows 10/11
echo Selected Apps: ${apps.map((a) => a.name).join(', ')}
echo Log File: %CD%\\setup-log.txt
echo ============================================================
echo.

echo [START] Session ${sessionCode} initialized at %DATE% %TIME% > setup-log.txt
echo [INFO] OS: Windows | Session: ${sessionCode} | Total Apps: ${apps.length} >> setup-log.txt

:: Ensure Execution Policy allows process scripts
powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force" >nul 2>&1

:: Verify Winget installation
where winget >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [FAILED] exit_code=9001 app=Winget id=Microsoft.DesktopAppInstaller >> setup-log.txt
    echo [ERROR] Winget (Windows Package Manager) was not found!
    echo Attempting to launch Microsoft App Installer registration...
    powershell -Command "Add-AppxPackage -RegisterByFamilyName -MainPackage Microsoft.DesktopAppInstaller_8wekyb3d8bbwe"
)

${preCommands ? `:: AI Fix Commands Applied First\necho ============================================================\necho [AI FIX PRE-INSTALLATION STEPS]\necho ============================================================\n${preCommands}\necho ============================================================\n` : ''}

${appInstallBlocks}

echo.
echo ============================================================
echo ${branding.product_name.toUpperCase()} COMPLETED!
echo ============================================================
echo [FINISH] Session ${sessionCode} completed at %DATE% %TIME% >> setup-log.txt
echo Log file saved to setup-log.txt
echo Something wrong? Chat with AI using Session ID: ${sessionCode} at ${branding.support_url}

:: Trigger Completion MessageBox
powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('${branding.product_name} installation finished!%System.Environment%::NewLine%System.Environment%::NewLine%Session ID: ${sessionCode}%System.Environment%::NewLine%Check setup-log.txt for status.%System.Environment%::NewLine%If any app failed, visit ${branding.support_url} with your Session ID.', '${branding.product_name} Complete', 0, 64)"

pause
`;
}

export function generateMacCommandScript(
  apps: SoftwareApp[],
  customPreCommands?: string[],
  sessionCode: string = 'EZS-PREVIEW',
  branding: BrandingSettings = DEFAULT_BRANDING
): string {
  const preCommands = customPreCommands && customPreCommands.length > 0 
    ? customPreCommands.map(cmd => `echo "[AI FIX] Executing: ${cmd}"\n${cmd}`).join('\n\n')
    : '';

  const appInstallBlocks = apps
    .map((app, index) => {
      const stepNum = index + 1;
      const total = apps.length;
      const brewCmd = app.brew_is_cask
        ? `brew install --cask "${app.brew_id}"`
        : `brew install "${app.brew_id}"`;

      return `
echo "------------------------------------------------------------"
echo "[${stepNum}/${total}] Installing ${app.name} (${app.brew_id})..."
osascript -e 'display notification "Installing ${app.name} (${stepNum}/${total})..." with title "${branding.product_name}"'

${brewCmd}
if [ $? -eq 0 ]; then
    echo "[OK] ${app.name}" >> "$LOGFILE"
    echo "✓ Successfully installed ${app.name}"
else
    EXIT_CODE=$?
    echo "[FAILED] exit_code=$EXIT_CODE app=${app.name} id=${app.brew_id}" >> "$LOGFILE"
    echo "✗ Failed to install ${app.name} (Exit code: $EXIT_CODE). Continuing..."
fi
`;
    })
    .join('\n');

  return `#!/bin/bash
# ============================================================
# ${branding.product_name} - ${branding.tagline}
# Session ID: ${sessionCode}
# ${branding.developed_by}
# Support: ${branding.support_url}
# Generated at: ${new Date().toLocaleString()}
# Apps to Install: ${apps.length}
# ============================================================

LOGFILE="$HOME/Desktop/setup-log.txt"

GREEN='\\033[0;32m'; RED='\\033[0;31m'; YELLOW='\\033[1;33m'
MAGENTA='\\033[0;35m'; GRAY='\\033[0;90m'; RESET='\\033[0m'

clear
echo -e "\${MAGENTA}"
echo " ███████╗ █████╗ ███████╗██╗   ██╗███████╗████████╗██╗   ██╗██████╗ "
echo " ██╔════╝██╔══██╗██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗"
echo " █████╗  ███████║███████╗ ╚████╔╝ ███████╗   ██║   ██║   ██║██████╔╝"
echo " ██╔══╝  ██╔══██║╚════██║  ╚██╔╝  ╚════██║   ██║   ██║   ██║██╔═══╝ "
echo " ███████╗██║  ██║███████║   ██║   ███████║   ██║   ╚██████╔╝██║     "
echo " ╚══════╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝   ╚═╝    ╚═════╝ ╚═╝     "
echo -e "\${RESET}"
echo -e "\${GRAY} ${branding.tagline}\${RESET}"
echo -e "\${GRAY} ${branding.developed_by} | Session ID: \${YELLOW}${sessionCode}\${RESET}"
echo " ────────────────────────────────────────────────────────────"
echo "Target OS: macOS"
echo "Log File: $LOGFILE"
echo ""

echo "[START] Session ${sessionCode} initialized at $(date)" > "$LOGFILE"
echo "[INFO] OS: macOS | Session: ${sessionCode} | Total Apps: ${apps.length}" >> "$LOGFILE"

# Ensure Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "[INFO] Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    if [ -f "/opt/homebrew/bin/brew" ]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
    elif [ -f "/usr/local/bin/brew" ]; then
        eval "$(/usr/local/bin/brew shellenv)"
    fi
fi

if ! command -v brew &> /dev/null; then
    echo "[FAILED] exit_code=9002 app=Homebrew id=brew" >> "$LOGFILE"
    echo "✗ Error: Homebrew installation failed or path not configured."
    exit 1
fi

${preCommands ? `# AI Fix Pre-Execution\n${preCommands}\n` : ''}

${appInstallBlocks}

echo ""
echo "============================================================"
echo "${branding.product_name.toUpperCase()} FINISHED!"
echo "============================================================"
echo "[FINISH] Session ${sessionCode} completed at $(date)" >> "$LOGFILE"
echo "Log saved to: $LOGFILE"
echo "Need help? Visit ${branding.support_url} with Session ID: ${sessionCode}"

osascript -e 'display dialog "${branding.product_name} installation completed!\\n\\nSession ID: ${sessionCode}\\nLog saved to Desktop/setup-log.txt.\\n\\nIf any app failed, visit ${branding.support_url} with your Session ID." buttons {"OK"} default button "OK" with title "${branding.product_name} Complete" with icon note'
`;
}

export function downloadScriptFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
