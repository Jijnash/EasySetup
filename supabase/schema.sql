-- Software catalog
create table apps (
  id text primary key,
  name text not null,
  category text not null,
  description text,
  winget_id text,
  brew_id text,
  brew_is_cask boolean default true,
  audience text[],
  dev_field text[],
  icon_url text,
  active boolean default true
);

-- Durable setup session — the object both the download and chat reference
create table setup_sessions (
  id uuid primary key default gen_random_uuid(),
  session_code text unique not null, -- e.g. 'EZS-7K2P'
  selected_apps jsonb not null,
  os text not null,
  script_version int default 1,
  created_at timestamptz default now()
);

-- Full chat history per session — the AI's memory
create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references setup_sessions(id),
  role text not null, -- 'user' | 'assistant'
  content text not null,
  fix_command text,
  fix_accepted boolean default false,
  created_at timestamptz default now()
);

-- Errors + AI diagnoses, powers the safelist over time
create table diagnostics (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references setup_sessions(id),
  app_id text,
  os text,
  error_text text,
  ai_explanation text,
  ai_fix_command text,
  resolved boolean default false,
  created_at timestamptz default now()
);

-- Site-wide branding, singleton row, editable from /admin/branding
create table branding_settings (
  id int primary key default 1,
  product_name text default 'EasySetup',
  tagline text default 'Set up your laptop in one click.',
  developed_by text default 'Developed by Vertex Digital Solutions',
  support_url text default 'https://easysetup.dev/fix',
  accent_color text default '#6366F1',
  logo_url text,
  updated_at timestamptz default now()
);

-- Metadata for the npm/pip scaffolding templates
create table templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  target_cli text not null, -- 'npm' | 'pip' | 'both'
  repo_url text,
  tags text[],
  active boolean default true,
  created_at timestamptz default now()
);
