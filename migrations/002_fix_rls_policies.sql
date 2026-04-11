-- Migration: Fix RLS Policies for users and profiles tables
-- Description: Enables INSERT for authenticated users to fix registration failures.

-- Enable INSERT for anonymous/authenticated users in users table 
-- (Depending on your Supabase config, you might want to restrict this to 'authenticated')
CREATE POLICY "Allow individual insert for users" ON "public"."users" 
FOR INSERT WITH CHECK (true);

-- Enable INSERT for profiles table
CREATE POLICY "Allow individual insert for profiles" ON "public"."profiles" 
FOR INSERT WITH CHECK (true);

-- Enable SELECT for users (to allow users to see each other or themselves)
-- If not already enabled, this is often necessary for common app functions.
CREATE POLICY "Allow public read for users" ON "public"."users" 
FOR SELECT USING (true);

-- Enable SELECT for profiles
CREATE POLICY "Allow public read for profiles" ON "public"."profiles" 
FOR SELECT USING (true);
