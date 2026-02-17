-- ============================================================================
-- COMPLETE SUPABASE DATABASE SETUP
-- ============================================================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS activity_reactions CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS event_participants CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS group_members CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Users table (using TEXT for IDs)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  profile_image TEXT,
  banner_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Groups table
CREATE TABLE groups (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  profile_image TEXT,
  banner_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group members (junction table)
CREATE TABLE group_members (
  group_id TEXT REFERENCES groups(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (group_id, user_id)
);

-- Events table
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  group_id TEXT REFERENCES groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by TEXT REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event participants (junction table)
CREATE TABLE event_participants (
  event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, user_id)
);

-- Transactions table
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  event_id TEXT REFERENCES events(id) ON DELETE SET NULL,
  group_id TEXT REFERENCES groups(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('event', 'split', 'p2p')),
  from_user TEXT REFERENCES users(id),
  to_user TEXT REFERENCES users(id),
  amount NUMERIC(10,2),
  total_amount NUMERIC(10,2) NOT NULL,
  note TEXT,
  splits JSONB,
  participants TEXT[],
  deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity reactions table
CREATE TABLE activity_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  activity_id TEXT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('event', 'split')),
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ensure a user can only react once per emoji per activity
  UNIQUE(user_id, activity_id, emoji)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_transactions_deadline ON transactions(deadline);
CREATE INDEX idx_activity_reactions_activity_id ON activity_reactions(activity_id);
CREATE INDEX idx_activity_reactions_user_id ON activity_reactions(user_id);
CREATE INDEX idx_activity_reactions_created_at ON activity_reactions(created_at DESC);

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert initial test user
INSERT INTO users (id, name) VALUES ('current-user', 'Guillaume');

-- ============================================================================
-- STORAGE SETUP
-- ============================================================================

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true) 
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'images');

-- Allow public upload (change to auth.uid() IS NOT NULL for auth only)
CREATE POLICY "Public Upload" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'images');

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all for authenticated users)
CREATE POLICY "Allow all for authenticated users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON groups FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON group_members FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON events FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON event_participants FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON transactions FOR ALL USING (true);
CREATE POLICY "Allow all operations on activity_reactions" ON activity_reactions FOR ALL USING (true) WITH CHECK (true);
