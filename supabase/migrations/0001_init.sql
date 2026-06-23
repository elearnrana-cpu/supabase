-- Profile table (single row for portfolio owner)
create table if not exists profile (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  title text not null default '',
  tagline text not null default '',
  bio text not null default '',
  avatar_url text,
  resume_url text,
  skills jsonb not null default '[]'::jsonb,
  socials jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Projects table
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  content text not null default '',
  cover_url text,
  demo_url text,
  repo_url text,
  tags text[] not null default '{}',
  featured boolean not null default false,
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Blog posts table
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  cover_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Contact messages table
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Site settings table (single row)
create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  site_title text not null default 'My Portfolio',
  site_description text not null default '',
  default_theme text not null default 'dark',
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table profile enable row level security;
alter table projects enable row level security;
alter table blog_posts enable row level security;
alter table contact_messages enable row level security;
alter table site_settings enable row level security;

-- Public read policies
create policy "Public can read published projects"
  on projects for select using (published = true);

create policy "Public can read published blog posts"
  on blog_posts for select using (published = true);

create policy "Public can read profile"
  on profile for select using (true);

create policy "Public can read site settings"
  on site_settings for select using (true);

-- Public insert for contact form
create policy "Public can insert contact messages"
  on contact_messages for insert with check (true);

-- Admin policies (email-based)
create policy "Admin full access to profile"
  on profile for all
  using (auth.jwt() ->> 'email' = current_setting('app.settings', true) or auth.jwt() ->> 'email' = 'elearnrana@gmail.com');

create policy "Admin full access to projects"
  on projects for all
  using (auth.jwt() ->> 'email' = 'elearnrana@gmail.com');

create policy "Admin full access to blog_posts"
  on blog_posts for all
  using (auth.jwt() ->> 'email' = 'elearnrana@gmail.com');

create policy "Admin can read all contact messages"
  on contact_messages for select using (auth.jwt() ->> 'email' = 'elearnrana@gmail.com');

create policy "Admin can update contact messages"
  on contact_messages for update using (auth.jwt() ->> 'email' = 'elearnrana@gmail.com');

create policy "Admin full access to site_settings"
  on site_settings for all
  using (auth.jwt() ->> 'email' = 'elearnrana@gmail.com');

-- Storage buckets
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('resume', 'resume', true) on conflict (id) do nothing;

create policy "Public can view media"
  on storage.objects for select using (bucket_id = 'media');

create policy "Admin can insert media"
  on storage.objects for insert with check (bucket_id = 'media' and auth.jwt() ->> 'email' = 'elearnrana@gmail.com');

create policy "Public can view resume"
  on storage.objects for select using (bucket_id = 'resume');

create policy "Admin can insert resume"
  on storage.objects for insert with check (bucket_id = 'resume' and auth.jwt() ->> 'email' = 'elearnrana@gmail.com');

-- Seed initial profile
insert into profile (name, title, tagline, bio, skills, socials)
values (
  'Enamul Hasan Rana',
  'Web & App Developer',
  'Building digital solutions from Dhaka, Bangladesh',
  'I''m a Web Developer, App Developer, Digital Marketer, and AI Automation learner based in Dhaka, Bangladesh. Passionate about building innovative digital solutions.',
  '["Web Development", "App Development", "Digital Marketing", "AI Automation", "Next.js", "React", "Supabase"]'::jsonb,
  '{"github": "https://github.com/elearnrana-cpu", "facebook": "https://www.facebook.com/enamulranaofficial", "x": "https://x.com/elearnrana", "email": "elearnrana@gmail.com", "phone": "+8801744552561"}'::jsonb
);

-- Seed site settings
insert into site_settings (site_title, site_description, default_theme)
values ('Enamul Hasan Rana''s Portfolio', 'Web Developer, App Developer, Digital Marketer, and AI Automation learner', 'dark')
on conflict do nothing;