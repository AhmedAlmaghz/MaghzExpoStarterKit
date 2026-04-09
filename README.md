# ExpoTemplate - Professional React Native Template

A comprehensive, enterprise-grade React Native template built with Expo, TailwindCSS 4, Drizzle ORM, Zod, Zustand, and Supabase.

## 🏗️ Architecture

This template follows **Clean Architecture** principles with a modular, feature-based structure:

```
src/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout with providers
│   ├── (auth)/             # Authentication screens
│   │   ├── login.tsx       # Login screen
│   │   ├── register.tsx   # Registration screen
│   │   └── forgot-password.tsx
│   └── (main)/             # Authenticated screens
│       ├── _layout.tsx     # Tab navigation layout
│       ├── index.tsx       # Dashboard
│       ├── about.tsx       # About screen
│       ├── help.tsx        # Help & FAQ
│       ├── profile/        # Profile screens
│       ├── settings/       # Settings screens
│       ├── notifications/  # Notification center
│       └── admin/          # Admin dashboard
├── auth/                   # Authentication module
│   ├── authStore.ts        # Zustand auth store
│   ├── hooks/
│   │   ├── useAuth.ts      # Auth hook
│   │   └── usePermission.ts # Permission hook
│   ├── schemas/
│   │   └── authSchema.ts   # Zod validation schemas
│   ├── services/
│   │   ├── authService.ts  # Supabase auth integration
│   │   ├── permissionService.ts # RBAC service
│   │   └── sessionService.ts    # Session management
│   └── types/
│       └── auth.types.ts   # TypeScript types
├── theme/                  # Theme system
│   ├── colors.ts           # Color palette (light/dark)
│   ├── ThemeProvider.tsx    # Theme context provider
│   ├── themeStore.ts        # Zustand theme store
│   └── hooks/
│       └── useTheme.ts      # Theme hook
├── i18n/                   # Internationalization
│   ├── i18nStore.ts         # Zustand i18n store
│   ├── hooks/
│   │   └── useTranslation.ts # Translation hook
│   └── locales/
│       ├── en.json          # English translations
│       └── ar.json          # Arabic translations
├── notifications/          # Notification system
│   ├── notificationStore.ts # Zustand notification store
│   ├── hooks/
│   │   └── useNotifications.ts
│   ├── services/
│   │   └── notificationService.ts # FCM + local notifications
│   └── types/
│       └── notification.types.ts
├── components/              # Shared UI components
│   ├── layout/
│   │   ├── Header.tsx      # App header
│   │   ├── Footer.tsx      # App footer
│   │   ├── SideMenu.tsx    # Navigation drawer
│   │   └── MainLayout.tsx  # Main layout wrapper
│   └── ui/
│       ├── Button.tsx      # Reusable button
│       ├── Input.tsx       # Reusable input
│       ├── Card.tsx        # Reusable card
│       └── Loading.tsx     # Loading spinner
├── lib/                    # Core utilities
│   ├── constants.ts        # App constants
│   ├── storage.ts           # Secure storage utility
│   ├── supabase.ts         # Supabase client
│   └── db/
│       ├── index.ts        # Database client
│       └── schema.ts        # Drizzle ORM schema
└── types/
    └── index.ts            # Shared TypeScript types
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Supabase account

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd ExpoTempVS
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Start the development server:**
   ```bash
   npx expo start
   ```

## 🔧 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React Native + Expo | 51.0+ | Core framework |
| TailwindCSS 4 | 4.0+ | Dynamic styling |
| Supabase | Latest | Backend (Auth, DB, Real-time) |
| Drizzle ORM | 0.30+ | Type-safe database |
| Zod | 3.22+ | Schema validation |
| Zustand | 4.4+ | State management |
| Expo Notifications | Latest | Push notifications |

## 📱 Features

### 1. Authentication & Permissions
- Email/password login with Zod validation
- Google & Apple OAuth support
- Session management with refresh tokens
- RBAC (Role-Based Access Control)
- Brute force protection & rate limiting

### 2. Theme System
- Light/Dark/System mode
- Dynamic color palette
- Persistent theme preference
- Smooth transitions

### 3. Internationalization (i18n)
- English & Arabic support
- RTL/LTR automatic switching
- Dynamic language loading
- Persistent language preference

### 4. User Profile
- View/edit profile information
- Avatar upload with compression
- Email & phone verification
- Activity log

### 5. App Settings
- Appearance (theme, language)
- Notification preferences
- Privacy settings
- Advanced settings (cache, reset)

### 6. Admin Dashboard
- User management (activate/deactivate/suspend)
- Analytics & performance metrics
- Content management
- Audit logs

### 7. User Dashboard
- Quick stats & activity overview
- Alert notifications
- Task management

### 8. Notifications
- In-app notifications
- FCM push notifications
- Notification center with history
- Scheduled notifications

### 9. Shared Components
- Header with user info & search
- Footer with links
- Side menu with role-based navigation
- Button, Input, Card, Loading components

## 🔐 Security

- Secure token storage with Expo SecureStore
- Session refresh with automatic token rotation
- Input validation with Zod schemas
- RBAC permission system
- Rate limiting on auth endpoints

## 🌐 Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Enable Email, Google, and Apple auth providers
3. Run the SQL migrations for the database schema
4. Update `.env` with your project URL and anon key

## 📝 Adding a New Language

1. Create a new JSON file in `src/i18n/locales/` (e.g., `fr.json`)
2. Copy the structure from `en.json`
3. Translate all values
4. Add the locale to `LOCALES` in `src/i18n/i18nStore.ts`
5. Add the `LocaleCode` type in `src/types/index.ts`

## 🎨 Customizing the Theme

1. Edit `src/theme/colors.ts` to change the color palette
2. Modify `tailwind.config.js` for TailwindCSS customizations
3. Update `src/theme/themeStore.ts` for theme behavior changes

## 📦 Key Modules Usage

### Auth Hook
```typescript
import { useAuth } from '@/auth/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  // Use auth state and actions
}
```

### Permission Hook
```typescript
import { usePermission } from '@/auth/hooks/usePermission';

function AdminPanel() {
  const { hasRole, can } = usePermission();
  if (!hasRole('admin')) return null;
  // Render admin content
}
```

### Theme Hook
```typescript
import { useTheme } from '@/theme/hooks/useTheme';

function MyComponent() {
  const { isDarkMode, colors, toggleMode } = useTheme();
  // Use theme state and actions
}
```

### Translation Hook
```typescript
import { useTranslation } from '@/i18n/hooks/useTranslation';

function MyComponent() {
  const { t, locale, setLocale } = useTranslation();
  return <Text>{t('common.loading')}</Text>;
}
```

### Notifications Hook
```typescript
import { useNotifications } from '@/notifications/hooks/useNotifications';

function MyComponent() {
  const { notifications, unreadCount, markAsRead } = useNotifications(userId);
  // Use notification state and actions
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

MIT License - Free to use and modify.