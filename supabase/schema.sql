-- SEDNA database schema. Run in the Supabase SQL editor on a fresh project.

CREATE TABLE profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           text,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE TABLE sessions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES profiles(id) ON DELETE CASCADE,
  problem         text NOT NULL,
  belief          text,
  emotion         text,
  body_location   text,
  cost            text,
  secondary_gain  text,
  emotion_goal    text,
  becomes_possible text,
  resolution      text,
  becoming        text,
  created_at      timestamptz DEFAULT now()
);
CREATE INDEX idx_sessions_user_created ON sessions(user_id, created_at DESC);

CREATE TABLE subscriptions (
  user_id              uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id   text NOT NULL UNIQUE,
  stripe_subscription_id text UNIQUE,
  status               text NOT NULL,
  tier                 text NOT NULL,
  trial_end            timestamptz,
  current_period_end   timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  trial_ending_email_sent_at timestamptz,
  updated_at           timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_profile" ON profiles FOR ALL USING (id = auth.uid());
CREATE POLICY "users_own_sessions" ON sessions FOR ALL USING (user_id = auth.uid());
CREATE POLICY "users_own_sub" ON subscriptions FOR ALL USING (user_id = auth.uid());

-- Required when the Supabase project has "Automatically expose new tables"
-- DISABLED (recommended for security). Without these grants, the
-- authenticated role cannot insert/select rows even with passing RLS
-- policies, and the service_role cannot do admin operations.
GRANT USAGE ON SCHEMA public TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles
  TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sessions
  TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriptions
  TO authenticated, service_role;
