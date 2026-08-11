import { DiagnosticResponse } from '../types';

export interface SafelistRule {
  id: string;
  keywords: string[];
  os?: 'windows' | 'mac';
  response: DiagnosticResponse;
}

export const SAFELIST_RULES: SafelistRule[] = [
  {
    id: 'winget_not_found',
    keywords: ['winget is not recognized', 'winget : command not found', 'winget is not installed'],
    os: 'windows',
    response: {
      explanation: 'Windows Package Manager (winget) is missing or disabled on this PC. You need the App Installer component from Microsoft.',
      fix_command: 'powershell -Command "Add-AppxPackage -RegisterByFamilyName -MainPackage Microsoft.DesktopAppInstaller_8wekyb3d8bbwe"',
      confidence: 'high',
      source: 'safelist',
      matchedPattern: 'Missing Winget Package Manager',
    },
  },
  {
    id: 'powershell_execution_policy',
    keywords: ['running scripts is disabled', 'executionpolicy', 'ps1 cannot be loaded', 'restricted policy'],
    os: 'windows',
    response: {
      explanation: 'PowerShell script execution is restricted on your Windows machine by default security policy.',
      fix_command: 'Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force',
      confidence: 'high',
      source: 'safelist',
      matchedPattern: 'Restricted PowerShell Execution Policy',
    },
  },
  {
    id: 'mac_brew_not_found',
    keywords: ['command not found: brew', 'brew: command not found', 'homebrew not installed'],
    os: 'mac',
    response: {
      explanation: 'Homebrew package manager is not installed or missing from your shell PATH environment.',
      fix_command: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" && echo \'eval "$(/opt/homebrew/bin/brew shellenv)"\' >> ~/.zprofile',
      confidence: 'high',
      source: 'safelist',
      matchedPattern: 'Missing Homebrew Package Manager',
    },
  },
  {
    id: 'access_denied_admin',
    keywords: ['access is denied', 'error 0x80070005', 'requires administrator', 'permission denied'],
    response: {
      explanation: 'The installation was blocked because it requires Administrator (Windows) or Sudo (Mac) elevated permissions.',
      fix_command: 'powershell -Command "Start-Process powershell -Verb RunAs"',
      confidence: 'high',
      source: 'safelist',
      matchedPattern: 'Missing Administrator Privileges',
    },
  },
  {
    id: 'winget_source_outdated',
    keywords: ['no package found matching input criteria', 'source agreement', 'agreements were not accepted'],
    os: 'windows',
    response: {
      explanation: 'Winget repository indexes need updating or default source terms must be reset.',
      fix_command: 'winget source reset --force && winget source update',
      confidence: 'high',
      source: 'safelist',
      matchedPattern: 'Outdated Winget Sources or Pending Agreements',
    },
  },
];

export function checkSafelist(errorText: string, os: 'windows' | 'mac'): DiagnosticResponse | null {
  const lowerText = errorText.toLowerCase();

  for (const rule of SAFELIST_RULES) {
    if (rule.os && rule.os !== os) continue;
    const match = rule.keywords.some((kw) => lowerText.includes(kw.toLowerCase()));
    if (match) {
      return rule.response;
    }
  }

  return null;
}
