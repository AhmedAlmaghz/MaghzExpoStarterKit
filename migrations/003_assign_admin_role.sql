-- Migration: Assign Admin Role to specific user
-- Description: Updates the 'role' in both public.users and auth.users metadata for almaghz@gmail.com.

-- 1. Update the role in the public users table
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'almaghz@gmail.com';

-- 2. Update the role in the Supabase Auth metadata to ensure the change is reflected in the JWT/Session
DO $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Find the user ID based on email
    SELECT id INTO target_user_id FROM auth.users WHERE email = 'almaghz@gmail.com';
    
    IF target_user_id IS NOT NULL THEN
        -- Update the internal Supabase auth metadata
        UPDATE auth.users 
        SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
        WHERE id = target_user_id;
        
        RAISE NOTICE 'Admin role assigned successfully to almaghz@gmail.com';
    ELSE
        RAISE NOTICE 'User almaghz@gmail.com not found in auth.users';
    END IF;
END $$;
