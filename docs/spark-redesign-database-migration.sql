-- The Spark Mobile-First Redesign Database Migration
-- Add coach messaging system and coach assignment functionality

-- 1. Extend spark_users table to support coach assignment
ALTER TABLE public.spark_users 
ADD COLUMN IF NOT EXISTS assigned_coach_id UUID REFERENCES auth.users(id);

-- Add index for coach assignment queries
CREATE INDEX IF NOT EXISTS idx_spark_users_assigned_coach 
ON public.spark_users(assigned_coach_id);

-- 2. Create coaches table for coach profiles (if not exists)
CREATE TABLE IF NOT EXISTS public.coaches (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    bio TEXT,
    specialties TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create coaches_messages table for dynamic coach messaging
CREATE TABLE IF NOT EXISTS public.coaches_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_id UUID NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.spark_users(id) ON DELETE CASCADE,
    message_text VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    
    -- Ensure one active message per client at a time
    CONSTRAINT unique_active_message_per_client 
    UNIQUE (client_id, is_active) 
    DEFERRABLE INITIALLY DEFERRED
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_coaches_messages_coach_id 
ON public.coaches_messages(coach_id);

CREATE INDEX IF NOT EXISTS idx_coaches_messages_client_id 
ON public.coaches_messages(client_id);

CREATE INDEX IF NOT EXISTS idx_coaches_messages_active 
ON public.coaches_messages(client_id, is_active) 
WHERE is_active = true;

-- 4. Enable Row Level Security on new tables
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coaches_messages ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for coaches table
CREATE POLICY "Coaches can view own profile" ON public.coaches
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Coaches can update own profile" ON public.coaches
    FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Authenticated users can view coach profiles" ON public.coaches
    FOR SELECT
    USING (auth.uid() IS NOT NULL AND is_active = true);

-- 6. Create RLS policies for coaches_messages table
CREATE POLICY "Coaches can manage their messages" ON public.coaches_messages
    FOR ALL
    USING (
        auth.uid() IS NOT NULL 
        AND coach_id IN (SELECT id FROM public.coaches WHERE id = auth.uid())
    );

CREATE POLICY "Clients can view their messages" ON public.coaches_messages
    FOR SELECT
    USING (
        auth.uid() IS NOT NULL 
        AND client_id IN (SELECT id FROM public.spark_users WHERE id = auth.uid())
    );

-- 7. Create function to automatically expire old messages
CREATE OR REPLACE FUNCTION expire_old_coach_messages()
RETURNS TRIGGER AS $$
BEGIN
    -- Deactivate any existing active messages for this client
    UPDATE public.coaches_messages 
    SET is_active = false 
    WHERE client_id = NEW.client_id 
    AND id != NEW.id 
    AND is_active = true;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Create trigger to maintain one active message per client
CREATE TRIGGER enforce_single_active_message
    BEFORE INSERT ON public.coaches_messages
    FOR EACH ROW
    EXECUTE FUNCTION expire_old_coach_messages();

-- 9. Create function to get active coach message for a client
CREATE OR REPLACE FUNCTION get_active_coach_message(client_user_id UUID)
RETURNS TABLE (
    message_text TEXT,
    coach_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cm.message_text::TEXT,
        c.name::TEXT,
        cm.created_at
    FROM public.coaches_messages cm
    JOIN public.coaches c ON c.id = cm.coach_id
    WHERE cm.client_id = client_user_id
    AND cm.is_active = true
    AND (cm.expires_at IS NULL OR cm.expires_at > NOW())
    ORDER BY cm.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Add helpful comments
COMMENT ON TABLE public.coaches IS 'Coach profiles for The Catalyst platform';
COMMENT ON TABLE public.coaches_messages IS 'Dynamic motivational messages from coaches to clients';
COMMENT ON COLUMN public.coaches_messages.message_text IS 'Short motivational message (max 50 chars)';
COMMENT ON COLUMN public.coaches_messages.expires_at IS 'Optional expiration date for time-limited messages';
COMMENT ON FUNCTION get_active_coach_message(UUID) IS 'Returns the active coach message for a specific client';

-- 11. Insert default coach for testing (optional)
-- INSERT INTO public.coaches (id, name, email, bio) 
-- VALUES (
--     (SELECT id FROM auth.users WHERE email LIKE '%coach%' LIMIT 1),
--     'Coach Sarah',
--     'coach@example.com',
--     'Certified fitness coach specializing in habit formation'
-- ) ON CONFLICT (id) DO NOTHING;

-- Show final table structures
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('spark_users', 'coaches', 'coaches_messages')
ORDER BY tablename;