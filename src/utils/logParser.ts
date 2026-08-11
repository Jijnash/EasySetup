import { SOFTWARE_CATALOG } from '../data/appsData';
import { SoftwareApp, TargetOS } from '../types';

export interface ParsedLogResult {
  os: TargetOS;
  successfulApps: string[];
  failedAppIds: string[];
  failedApps: SoftwareApp[];
  rawErrorLines: string[];
  summaryText: string;
}

export function parseSetupLog(logText: string, defaultOS: TargetOS = 'windows'): ParsedLogResult {
  const lines = logText.split(/\r?\n/);
  
  let detectedOS: TargetOS = defaultOS;
  const successfulApps: string[] = [];
  const failedAppIds: string[] = [];
  const failedAppNameSet = new Set<string>();
  const rawErrorLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Detect OS from header
    if (trimmed.includes('OS: Windows') || trimmed.includes('winget') || trimmed.includes('.bat')) {
      detectedOS = 'windows';
    } else if (trimmed.includes('OS: macOS') || trimmed.includes('brew') || trimmed.includes('.command')) {
      detectedOS = 'mac';
    }

    // Check [OK] lines
    if (trimmed.startsWith('[OK]')) {
      const appName = trimmed.replace('[OK]', '').trim();
      successfulApps.push(appName);
    }
    // Check [FAILED] lines
    else if (trimmed.startsWith('[FAILED]')) {
      rawErrorLines.push(trimmed);
      
      // Match ID or App Name if formatted
      const idMatch = trimmed.match(/id=([^\s]+)/i);
      const appMatch = trimmed.match(/app=([^id]+)/i);

      if (idMatch && idMatch[1]) {
        const found = SOFTWARE_CATALOG.find(a => 
          a.winget_id.toLowerCase() === idMatch[1].toLowerCase() || 
          a.brew_id.toLowerCase() === idMatch[1].toLowerCase() ||
          a.id.toLowerCase() === idMatch[1].toLowerCase()
        );
        if (found && !failedAppIds.includes(found.id)) {
          failedAppIds.push(found.id);
        }
      } else if (appMatch && appMatch[1]) {
        const appNameClean = appMatch[1].trim();
        failedAppNameSet.add(appNameClean);
      } else {
        // Fallback search
        const found = SOFTWARE_CATALOG.find(a => 
          trimmed.toLowerCase().includes(a.name.toLowerCase()) || 
          trimmed.toLowerCase().includes(a.id.toLowerCase())
        );
        if (found && !failedAppIds.includes(found.id)) {
          failedAppIds.push(found.id);
        }
      }
    } else if (
      trimmed.toLowerCase().includes('error') || 
      trimmed.toLowerCase().includes('failed') || 
      trimmed.toLowerCase().includes('not recognized') ||
      trimmed.toLowerCase().includes('command not found') ||
      trimmed.toLowerCase().includes('access is denied') ||
      trimmed.toLowerCase().includes('exit_code')
    ) {
      rawErrorLines.push(trimmed);
    }
  }

  // Map any remaining failed names to Catalog apps
  failedAppNameSet.forEach((name) => {
    const found = SOFTWARE_CATALOG.find(a => a.name.toLowerCase().includes(name.toLowerCase()));
    if (found && !failedAppIds.includes(found.id)) {
      failedAppIds.push(found.id);
    }
  });

  const failedApps = SOFTWARE_CATALOG.filter(a => failedAppIds.includes(a.id));

  const summaryText = `Parsed log: ${successfulApps.length} succeeded, ${failedAppIds.length || (rawErrorLines.length > 0 ? 1 : 0)} failed. OS: ${detectedOS}.`;

  return {
    os: detectedOS,
    successfulApps,
    failedAppIds,
    failedApps,
    rawErrorLines,
    summaryText,
  };
}
