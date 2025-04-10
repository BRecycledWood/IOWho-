/*
  # Initial Schema Setup for Loan Management System

  1. New Tables
    - `profiles`
      - User profiles with additional information
    - `borrowers`
      - Borrower information and contact details
    - `loans`
      - Loan details, terms, and status
    - `payments`
      - Payment history and tracking
    - `notifications`
      - System notifications and reminders

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure access patterns for different user roles

  3. Enums
    - loan_status
    - payment_status
    - notification_type
*/

-- Create custom types
CREATE TYPE loan_status AS ENUM ('pending', 'active', 'completed', 'defaulted');
CREATE TYPE payment_status AS ENUM ('scheduled', 'paid', 'late', 'missed');
CREATE TYPE notification_type AS ENUM ('payment_due', 'payment_received', 'payment_late', 'loan_approved');

-- Profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Borrowers table
CREATE TABLE borrowers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES auth.users(id),
  full_name text NOT NULL,
  email text UNIQUE,
  phone text,
  address text,
  credit_score integer,
  employment_status text,
  monthly_income decimal(12,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Loans table
CREATE TABLE loans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  borrower_id uuid REFERENCES borrowers(id),
  created_by uuid REFERENCES auth.users(id),
  amount decimal(12,2) NOT NULL,
  interest_rate decimal(5,2) NOT NULL,
  term_months integer NOT NULL,
  status loan_status DEFAULT 'pending',
  start_date date,
  end_date date,
  payment_frequency text DEFAULT 'monthly',
  total_payments integer,
  remaining_balance decimal(12,2),
  next_payment_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payments table
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id uuid REFERENCES loans(id),
  amount decimal(12,2) NOT NULL,
  due_date date NOT NULL,
  payment_date timestamptz,
  status payment_status DEFAULT 'scheduled',
  payment_method text,
  transaction_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrowers ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Borrowers policies
CREATE POLICY "Users can view borrowers they created"
  ON borrowers FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can create borrowers"
  ON borrowers FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update borrowers they created"
  ON borrowers FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

-- Loans policies
CREATE POLICY "Users can view loans they created"
  ON loans FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can create loans"
  ON loans FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update loans they created"
  ON loans FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

-- Payments policies
CREATE POLICY "Users can view payments for their loans"
  ON payments FOR SELECT
  TO authenticated
  USING (
    loan_id IN (
      SELECT id FROM loans WHERE created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create payments for their loans"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (
    loan_id IN (
      SELECT id FROM loans WHERE created_by = auth.uid()
    )
  );

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Functions
CREATE OR REPLACE FUNCTION calculate_loan_schedule(
  p_loan_id uuid
) RETURNS void AS $$
DECLARE
  v_loan loans%ROWTYPE;
  v_payment_amount decimal(12,2);
  v_current_date date;
  v_payment_count integer := 1;
BEGIN
  -- Get loan details
  SELECT * INTO v_loan FROM loans WHERE id = p_loan_id;
  
  -- Calculate monthly payment amount (simple interest)
  v_payment_amount := (v_loan.amount + (v_loan.amount * v_loan.interest_rate * v_loan.term_months / 12)) / v_loan.term_months;
  
  -- Set initial payment date
  v_current_date := v_loan.start_date;
  
  -- Create payment schedule
  WHILE v_payment_count <= v_loan.term_months LOOP
    INSERT INTO payments (
      loan_id,
      amount,
      due_date,
      status
    ) VALUES (
      p_loan_id,
      v_payment_amount,
      v_current_date,
      'scheduled'
    );
    
    -- Increment date by 1 month
    v_current_date := v_current_date + interval '1 month';
    v_payment_count := v_payment_count + 1;
  END LOOP;
  
  -- Update loan total_payments
  UPDATE loans 
  SET 
    total_payments = v_loan.term_months,
    remaining_balance = v_loan.amount,
    next_payment_date = v_loan.start_date
  WHERE id = p_loan_id;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_borrowers_updated_at
  BEFORE UPDATE ON borrowers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_loans_updated_at
  BEFORE UPDATE ON loans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();