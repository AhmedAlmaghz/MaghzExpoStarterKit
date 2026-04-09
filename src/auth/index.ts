/**
 * Auth Module - Public API
 *
 * Re-exports all auth module components for convenient access.
 *
 * @module auth
 */

// Store
export { useAuthStore } from './authStore';

// Hooks
export { useAuth } from './hooks/useAuth';
export { usePermission } from './hooks/usePermission';

// Services
export { authService } from './services/authService';
export { permissionService } from './services/permissionService';
export { sessionService } from './services/sessionService';

// Schemas
export {
    emailSchema,
    passwordSchema,
    simplePasswordSchema,
    displayNameSchema,
    phoneSchema,
    otpSchema,
    loginSchema,
    registerSchema,
    simpleRegisterSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    updatePasswordSchema,
    phoneVerificationSchema,
    emailVerificationSchema,
    profileUpdateSchema,
    type LoginFormData,
    type RegisterFormData,
    type SimpleRegisterFormData,
    type ForgotPasswordFormData,
    type ResetPasswordFormData,
    type UpdatePasswordFormData,
    type PhoneVerificationFormData,
    type EmailVerificationFormData,
    type ProfileUpdateFormData,
} from './schemas/authSchema';

// Types
export type {
    AuthStatus,
    LoginMethod,
    EmailCredentials,
    PhoneCredentials,
    RegistrationData,
    PasswordResetRequest,
    PasswordUpdateData,
    AuthSession,
    UserRole,
    Permission,
    RoleWithPermissions,
    AuthState,
    AuthUser,
    AuthActions,
    AuthStore,
    LoginResponse,
    OAuthProvider,
} from './types/auth.types';