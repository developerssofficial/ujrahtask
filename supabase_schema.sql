-- ==============================================================================
-- UjrahTask - Supabase PostgreSQL Database Schema
-- Run this script in the Supabase SQL Editor (https://app.supabase.com)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Users Profile Table (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  balance NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
  pending_balance NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
  withdrawn_balance NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Offerwall & Survey Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  trans_id TEXT UNIQUE NOT NULL,
  provider TEXT NOT NULL DEFAULT 'CPX Research',
  points NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
  amount_usd NUMERIC(12, 4) DEFAULT 0.0000 NOT NULL,
  amount_bdt NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'completed', 'chargeback'
  ip_click TEXT,
  hold_until TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days') NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_trans_id ON public.transactions(trans_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for Profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile basic info"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 6. RLS Policies for Transactions
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid()::text = user_id);

-- 7. Trigger to automatically create a profile entry when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Optional: Function for serverless function to securely credit user balance with hold period
CREATE OR REPLACE FUNCTION public.credit_user_cpx_survey(
  p_user_id UUID,
  p_trans_id TEXT,
  p_points NUMERIC,
  p_amount_usd NUMERIC,
  p_amount_bdt NUMERIC,
  p_ip_click TEXT,
  p_hold_days INT DEFAULT 14
)
RETURNS JSON AS $$
DECLARE
  v_existing_trans_id TEXT;
  v_transaction_id UUID;
BEGIN
  -- Check for duplicate transaction
  SELECT trans_id INTO v_existing_trans_id
  FROM public.transactions
  WHERE trans_id = p_trans_id;

  IF FOUND THEN
    RETURN json_build_object('success', true, 'duplicate', true, 'message', 'Duplicate trans_id ignored');
  END IF;

  -- Insert transaction record
  INSERT INTO public.transactions (
    user_id,
    trans_id,
    provider,
    points,
    amount_usd,
    amount_bdt,
    status,
    ip_click,
    hold_until
  ) VALUES (
    p_user_id,
    p_trans_id,
    'CPX Research',
    p_points,
    p_amount_usd,
    p_amount_bdt,
    'pending',
    p_ip_click,
    NOW() + (p_hold_days || ' days')::INTERVAL
  ) RETURNING id INTO v_transaction_id;

  -- Increment user's pending balance
  UPDATE public.profiles
  SET pending_balance = pending_balance + p_amount_bdt,
      updated_at = NOW()
  WHERE id = p_user_id;

  RETURN json_build_object(
    'success', true,
    'duplicate', false,
    'transaction_id', v_transaction_id,
    'amount_bdt', p_amount_bdt
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
