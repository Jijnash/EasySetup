-- Seed data for Software Catalog

INSERT INTO apps (id, name, category, description, winget_id, brew_id, brew_is_cask, audience, dev_field, icon_url, active) VALUES
('chrome', 'Google Chrome', 'Essentials', 'Fast, secure & modern web browser used worldwide.', 'Google.Chrome', 'google-chrome', true, '{general,both}', '{}', 'Globe', true),
('firefox', 'Mozilla Firefox', 'Essentials', 'Privacy-focused web browser with powerful tracking protection.', 'Mozilla.Firefox', 'firefox', true, '{general,both}', '{}', 'Compass', true),
('libreoffice', 'LibreOffice', 'Essentials', 'Free & open-source office suite for documents, spreadsheets & slides.', 'TheDocumentFoundation.LibreOffice', 'libreoffice', true, '{general,both}', '{}', 'FileText', true),
('pdf_reader', 'Adobe Acrobat Reader', 'Essentials', 'Standard PDF viewer for viewing, signing and annotating PDFs.', 'Adobe.Acrobat.Reader.64-bit', 'adobe-acrobat-reader', true, '{general,both}', '{}', 'FileCode', true),
('vlc', 'VLC Media Player', 'Essentials', 'Universal media player that plays almost any video/audio format.', 'VideoLAN.VLC', 'vlc', true, '{general,both}', '{}', 'Film', true),
('sevenzip', '7-Zip / Keka', 'Essentials', 'High compression archive utility for .zip, .7z, .rar and .tar files.', '7zip.7zip', 'keka', true, '{general,both}', '{}', 'Archive', true),
('notepadplusplus', 'Notepad++ / BBEdit', 'Essentials', 'Lightweight, lightning fast source code & text editor.', 'Notepad++.Notepad++', 'bbedit', true, '{general,developer,both}', '{}', 'Edit3', true),

('whatsapp', 'WhatsApp Desktop', 'Communication', 'Messaging and video calling app connected to your phone.', 'WhatsApp.WhatsApp', 'whatsapp', true, '{general,both}', '{}', 'MessageSquare', true),
('zoom', 'Zoom Workplace', 'Communication', 'Video conferencing, online classes & screen sharing.', 'Zoom.Zoom', 'zoom', true, '{general,both}', '{}', 'Video', true),
('discord', 'Discord', 'Communication', 'Voice, video, and text communication for communities and gaming.', 'Discord.Discord', 'discord', true, '{general,developer,both}', '{}', 'Headphones', true),
('slack', 'Slack', 'Communication', 'Team messaging, collaboration channels & app integrations.', 'SlackTechnologies.Slack', 'slack', true, '{developer,both}', '{}', 'MessageCircle', true),
('teams', 'Microsoft Teams', 'Communication', 'Corporate meetings, chat, file sharing and video calls.', 'Microsoft.Teams', 'microsoft-teams', true, '{general,both}', '{}', 'Users', true),
('telegram', 'Telegram Desktop', 'Communication', 'Cloud-based desktop messaging app with unlimited file transfers.', 'Telegram.TelegramDesktop', 'telegram', true, '{general,both}', '{}', 'Send', true),

('notion', 'Notion', 'Productivity', 'All-in-one workspace for notes, task boards, wikis & project planning.', 'Notion.Notion', 'notion', true, '{general,developer,both}', '{}', 'BookOpen', true),
('obsidian', 'Obsidian', 'Productivity', 'Markdown knowledge base & second brain operating on local files.', 'Obsidian.Obsidian', 'obsidian', true, '{general,developer,both}', '{}', 'Feather', true),
('spotify', 'Spotify', 'Productivity', 'Music & podcast streaming service for study and focus music.', 'Spotify.Spotify', 'spotify', true, '{general,both}', '{}', 'Music', true),
('figma', 'Figma Desktop', 'Productivity', 'Collaborative UI design, prototyping & wireframing tool.', 'Figma.Figma', 'figma', true, '{developer,both}', '{web_dev,app_dev}', 'Layout', true),

('git', 'Git', 'Dev Tools', 'Distributed version control system for source code tracking.', 'Git.Git', 'git', false, '{developer,both}', '{}', 'GitBranch', true),
('vscode', 'Visual Studio Code', 'Dev Tools', 'The premier code editor with rich extension ecosystem & debugger.', 'Microsoft.VisualStudioCode', 'visual-studio-code', true, '{developer,both}', '{}', 'Code', true),
('github_desktop', 'GitHub Desktop', 'Dev Tools', 'Simple visual GUI for Git commits, branches, and Pull Requests.', 'GitHub.GitHubDesktop', 'github', true, '{developer,both}', '{web_dev,not_sure}', 'GitPullRequest', true),
('nodejs', 'Node.js (LTS)', 'Dev Tools', 'JavaScript runtime environment with npm package manager.', 'OpenJS.NodeJS.LTS', 'node', false, '{developer,both}', '{web_dev,app_dev,not_sure}', 'Server', true),
('postman', 'Postman', 'Dev Tools', 'API development platform for testing & debugging HTTP endpoints.', 'Postman.Postman', 'postman', true, '{developer,both}', '{web_dev,app_dev,not_sure}', 'Send', true),
('python', 'Python 3', 'Dev Tools', 'Python programming language interpreter and pip package installer.', 'Python.Python.3.11', 'python@3.11', false, '{developer,both}', '{ai_ml,data_science,cybersecurity,not_sure}', 'Terminal', true),
('anaconda', 'Anaconda Distribution', 'Dev Tools', 'Complete Python & R platform for Data Science & AI/ML packages.', 'Anaconda.Anaconda3', 'anaconda', true, '{developer,both}', '{ai_ml,data_science}', 'Cpu', true),
('jupyter', 'JupyterLab / Notebook', 'Dev Tools', 'Interactive web application for Python code, data & charts.', 'Jupyter.JupyterLab', 'jupyterlab', false, '{developer,both}', '{ai_ml,data_science}', 'Database', true),
('android_studio', 'Android Studio', 'Dev Tools', 'Official IDE for Android app development with Kotlin & Flutter.', 'Google.AndroidStudio', 'android-studio', true, '{developer,both}', '{app_dev}', 'Smartphone', true),
('wireshark', 'Wireshark', 'Dev Tools', 'Network packet analyzer for network troubleshooting & security.', 'WiresharkFoundation.Wireshark', 'wireshark', true, '{developer,both}', '{cybersecurity}', 'ShieldCheck', true),
('docker', 'Docker Desktop', 'Dev Tools', 'Container management platform for running apps in isolated containers.', 'Docker.DockerDesktop', 'docker', true, '{developer,both}', '{web_dev,ai_ml}', 'Box', true),
('dbeaver', 'DBeaver Community', 'Dev Tools', 'Universal database manager for PostgreSQL, MySQL, SQLite & SQL Server.', 'dbeaver.dbeaver', 'dbeaver-community', true, '{developer,both}', '{web_dev,data_science}', 'Database', true),

('powertoys', 'Microsoft PowerToys', 'Utilities', 'Power-user utilities for Windows (FancyZones, ColorPicker, Text Extractor).', 'Microsoft.PowerToys', 'raycast', true, '{general,developer,both}', '{}', 'Zap', true),
('bitwarden', 'Bitwarden', 'Utilities', 'Secure, open-source password manager for auto-filling credentials.', 'Bitwarden.Bitwarden', 'bitwarden', true, '{general,developer,both}', '{}', 'Lock', true),
('everything', 'Everything / Alfred', 'Utilities', 'Instant search engine that locates files and folders by name in milliseconds.', 'voidtools.Everything', 'alfred', true, '{general,developer,both}', '{}', 'Search', true),
('brave', 'Brave Browser', 'Utilities', 'Fast private browser blocking ads & trackers out of the box.', 'Brave.Brave', 'brave-browser', true, '{general,both}', '{}', 'Shield', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO branding_settings (id, product_name, tagline, developed_by, support_url, accent_color, logo_url) VALUES
(1, 'EasySetup', 'Set up your laptop in one click.', 'Developed by Vertex Digital Solutions', 'https://easysetup.dev/fix', '#6366F1', null)
ON CONFLICT (id) DO NOTHING;
