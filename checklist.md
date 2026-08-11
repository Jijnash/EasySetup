# EasySetup Feature Checklist

This checklist documents all current, simulated, and prospective features of the EasySetup platform. It serves as a single source of truth for the platform's functional footprint.

---

## 1. Landing Page & Interactive Live Demo
- [x] **Hero Marketing Banner**: Clear value proposition (one-click installer, zero-terminal setup, AI assistant).
- [x] **Interactive Live Simulation (Demo)**:
  - [x] Cyclic simulation representing the setup process.
  - [x] App selection simulation (Chrome, Git, Node, VS Code).
  - [x] Simulated shell execution with installation status feedback.
  - [x] AI session integration mock.
- [x] **3-Step Explainer Cards**: Graphical steps showing Stack Selection, Script Execution, and AI troubleshooting.
- [x] **CLI Template CTA Banner**: Redirect button for fullstack templates.
- [x] **Safety Guides**: Links to Windows SmartScreen and macOS Gatekeeper bypass guides.

## 2. Onboarding & Recommendation Engine
- [x] **Target OS Autodetect**: Detects user's operating system (Windows vs. macOS) via `navigator.userAgent`.
- [x] **Persona Selection**: Distinguishes between General Audience, Developer, or both.
- [x] **Developer Stack Customization**: Filters recommendations based on field (Web Dev, AI/ML, App Dev, Data Science, Cyber Security, or "Not Sure").
- [x] **Student Branch Verification Nudge**: Checks student status and prompts for branch selections to optimize app recommendations.
- [x] **App Recommendation Engine**: Automatically selects a tailored bundle of applications based on persona/field inputs.

## 3. App Catalog & Manifest Customization
- [x] **Categorized Software View**: Grouping software into Essentials, Communication, Productivity, Dev Tools, and Utilities.
- [x] **Individual Selection Controls**: Toggle boxes for adding/removing applications.
- [x] **Bulk Controls**: "Select All" and "Deselect All" options.
- [x] **OS Specific Targets**: Toggles for targeting Windows (Winget) or macOS (Homebrew/Cask) setup paths.
- [x] **Manifest Summarizer**: Live updates on estimated download sizes and installation times.

## 4. Shell Script Generation & Execution Mechanics
- [x] **Windows Setup Script (`.bat`)**:
  - [x] Auto-escalation for Administrator privileges.
  - [x] Temporary PowerShell process-level execution policy configuration (`RemoteSigned`).
  - [x] Automatic validation of Windows Package Manager (`winget`).
  - [x] Registration of Microsoft App Installer if `winget` is missing.
  - [x] Silent installation flags for official vendor installers.
  - [x] Graphic progress tracking with PowerShell `Write-Progress`.
  - [x] Standardized error logging to local file `setup-log.txt`.
  - [x] Custom completed message-box alert.
- [x] **macOS Setup Script (`.command`)**:
  - [x] Automatic validation of Homebrew.
  - [x] Automatic Xcode Command Line Tools / Homebrew installation if missing.
  - [x] Conditional installation logic (Cask vs. standard formulas).
  - [x] Standardized error logging to `$HOME/Desktop/setup-log.txt`.
  - [x] Completion alerts using native AppleScript dialogs and notifications.
- [x] **Local Downloader**: Directly triggers file download on the client side.

## 5. AI Setup Diagnostics & Fix Loop
- [x] **Deterministic Cost-Reduction Safelist**: Pre-analyzes logs on the server for known configuration errors (powershell policies, missing winget/brew, permissions) to reduce AI API usage.
- [x] **Structured AI Diagnosis**: Passes log data to Gemini AI (`gemini-3.6-flash`) to generate student-friendly explanations and correct fix commands.
- [x] **AI Safety Filter**: Prevents generation of destructive system commands.
- [x] **Session-Aware Chat Interface**: Allows users to chat with the AI assistant scoped to their specific setup manifest.
- [x] **Interactive Fix Inclusion**: Option to accept AI fixes and download a regenerated script (`_v2` suffix) that applies the fix and retries failed apps.
- [x] **Pre-built Diagnostic Samples**: Built-in sample logs (Winget error, PowerShell restricted policy, Brew error, Node/Python 1603 exit code) for testing.

## 6. CLI Scaffolding Templates
- [x] **Template Browser**: Browsing pre-configured templates (React, Next.js, FastAPI, Flask).
- [x] **Configurable Scaffolding Command Generator**: Lets users input a custom project name and copy the correct initialization terminal commands.
- [x] **Directory Structure Preview**: Renders an interactive tree representing the folder layout for the selected template.
- [x] **Features List**: Highlights included modules (SQLite, Tailwind, JWT, etc.).

## 7. Admin Panel & CMS Controls
- [x] **Secure Auth Guard**: Protected route `/admin` (passcode locked with `"admin123"` but open by default for demo ease).
- [x] **Usage & Activity Dashboard**: Displays statistics (sessions generated, AI chat sessions, top requested software).
- [x] **Software Catalog CMS**: Live UI to add new apps or delete existing ones from the software catalog list.
- [x] **CLI Scaffold Manager**: Visual list showing scaffold properties.
- [x] **White-label Branding Injector**: CMS fields to dynamically update product name, tagline, developed by credits, support URL, and accent color.
- [x] **Real-time Script Injection**: Branding customizations are immediately written into newly generated script headers without code rebuilds.

## 8. SaaS Account & Subscription Mechanics
- [x] **Subscription Tier Management**: Defined Free, Pro, and Team packages with varying limits.
- [x] **Mock Authentication Gateway**: Support for email signup/login and Google SSO.
- [x] **Quota Tracking**: Visual meter tracking monthly AI Call limit usage.
- [x] **Session History Drawer**: Lists user's generated sessions, timestamps, size details, and quick links to reload sessions.
