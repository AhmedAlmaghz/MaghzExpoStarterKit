-- ============================================
-- Professional Infrastructure Expansion
-- Migration: 004_professional_infrastructure
-- Description: Adds tables for Public Pages, System Settings, Addresses, and Payments.
-- ============================================

-- ============================================
-- Public Pages Table (for About, Help, etc.)
-- ============================================
CREATE TABLE IF NOT EXISTS public_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    content_ar TEXT,
    content_en TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- System Settings Table (Global Config)
-- ============================================
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    description TEXT,
    category TEXT DEFAULT 'general',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- User Addresses (Multiple support)
-- ============================================
CREATE TABLE IF NOT EXISTS user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label TEXT NOT NULL, -- 'Home', 'Work', etc.
    recipient_name TEXT,
    phone TEXT,
    details TEXT NOT NULL,
    city TEXT,
    country TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- User Payment Methods
-- ============================================
CREATE TABLE IF NOT EXISTS user_payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('card', 'wallet', 'bank_transfer')),
    last_four TEXT,
    provider TEXT, -- 'Visa', 'MasterCard', 'PayPal'
    is_default BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- RLS Policies
-- ============================================

-- Public Pages: Public read, Admin write
ALTER TABLE public_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_pages_read" ON public_pages FOR SELECT USING (is_published = TRUE);
CREATE POLICY "public_pages_admin_write" ON public_pages FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- System Settings: Read by all authenticated, Superadmin write
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "system_settings_read" ON system_settings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "system_settings_superadmin_write" ON system_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'superadmin')
);

-- User Addresses: Owner manage
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_addresses_owner" ON user_addresses FOR ALL USING (auth.uid() = user_id);

-- User Payment Methods: Owner manage
ALTER TABLE user_payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_payment_methods_owner" ON user_payment_methods FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- Triggers for updated_at
-- ============================================
CREATE TRIGGER update_public_pages_updated_at BEFORE UPDATE ON public_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_addresses_updated_at BEFORE UPDATE ON user_addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Seed Data for Public Pages
-- ============================================
INSERT INTO public_pages (slug, title_ar, title_en, content_ar, content_en) VALUES
('about', 'حول التطبيق', 'About Us', 'محتوى صفحة حول التطبيق...', 'About page content...'),
('help', 'المساعدة الدعم', 'Help & Support', 'محتوى صفحة المساعدة...', 'Help page content...'),
('terms', 'شروط الاستخدام', 'Terms of Service', 'محتوى الشروط...', 'Terms content...'),
('privacy', 'سياسة الخصوصية', 'Privacy Policy', 'محتوى السياسة...', 'Privacy content...')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Seed Data for System Settings
-- ============================================
INSERT INTO system_settings (key, value, description, category) VALUES
('maintenance_mode', 'false', 'Enable/Disable maintenance mode', 'maintenance'),
('registration_enabled', 'true', 'Enable/Disable new user registrations', 'auth'),
('min_app_version', '1.0.0', 'Minimum supported app version', 'version')
ON CONFLICT (key) DO NOTHING;
