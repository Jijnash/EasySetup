export type AudienceType = 'general' | 'developer' | 'both';

export type DevFieldType = 
  | 'web_dev' 
  | 'ai_ml' 
  | 'app_dev' 
  | 'data_science' 
  | 'cybersecurity' 
  | 'not_sure';

export type AppCategory = 
  | 'Essentials' 
  | 'Communication' 
  | 'Productivity' 
  | 'Entertainment' 
  | 'Dev Tools'
  | 'Utilities';

export interface SoftwareApp {
  id: string;
  name: string;
  category: AppCategory;
  description: string;
  winget_id: string;
  brew_id: string;
  brew_is_cask: boolean;
  audience: AudienceType[];
  dev_field?: DevFieldType[];
  iconName: string;
  estimatedSizeMb: number;
  estimatedTimeMins: number;
  popular?: boolean;
  active?: boolean;
}

export type TargetOS = 'windows' | 'mac';

export interface OnboardingState {
  audience: AudienceType | null;
  devField: DevFieldType | null;
  isStudent: boolean;
  studentBranch?: string;
  showBranchNudge?: boolean;
}

export interface GeneratedSetupSession {
  id: string;
  timestamp: string;
  selectedAppIds: string[];
  os: TargetOS;
  scriptType: '.bat' | '.command';
  totalSizeMb: number;
  totalTimeMins: number;
}

export interface DiagnosticRequest {
  app?: string;
  os: TargetOS;
  error_text: string;
}

export interface DiagnosticResponse {
  explanation: string;
  fix_command: string | null;
  confidence: 'high' | 'medium' | 'low';
  source?: 'safelist' | 'ai' | 'fallback';
  matchedPattern?: string;
}

export interface DiagnosticRecord extends DiagnosticResponse {
  id: string;
  app_id?: string;
  os: TargetOS;
  error_text: string;
  resolved: boolean;
  created_at: string;
}

export interface BrandingSettings {
  id: number;
  product_name: string;
  tagline: string;
  developed_by: string;
  support_url: string;
  accent_color: string;
  logo_url?: string;
  updated_at?: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant';
  content: string;
  fix_command?: string | null;
  fix_accepted?: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'team';
  avatarUrl?: string;
  apiCallsUsed: number;
  apiCallsLimit: number;
  scriptsGeneratedCount: number;
  joinedDate: string;
}

export interface SubscriptionPlan {
  id: 'free' | 'pro' | 'team';
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface ScaffoldingTemplate {
  id: string;
  name: string;
  description: string;
  framework: string;
  type: 'npm' | 'pip';
  command: string;
  tags: string[];
  features: string[];
  fileTree: string[];
}
