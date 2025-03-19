/*
  # Create interns table

  1. New Tables
    - `interns`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `start_date` (date, not null)
      - `end_date` (date, not null)
      - `role` (text, not null)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `interns` table
    - Add policy for authenticated users to read data
*/

CREATE TABLE IF NOT EXISTS interns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  role text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE interns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON interns
  FOR SELECT
  TO public
  USING (true);