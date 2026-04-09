/**
 * Auth Schemas
 *
 * Zod validation schemas for authentication forms and API requests.
 *
 * @module auth/schemas
 */
import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters');

/**
 * Password validation schema
 * Requirements: 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

/**
 * Simple password schema (less strict for development)
 */
export const simplePasswordSchema = z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters');

/**
 * Display name validation schema
 */
export const displayNameSchema = z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\u0600-\u06FF\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

/**
 * Phone number validation schema
 */
export const phoneSchema = z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^\+?[0-9]+$/, 'Invalid phone number format');

/**
 * OTP validation schema
 */
export const otpSchema = z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^[0-9]+$/, 'OTP must contain only numbers');

/**
 * Login form schema
 */
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional().default(false),
});

/**
 * Registration form schema
 */
export const registerSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    displayName: displayNameSchema,
    phone: phoneSchema.optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms and conditions',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

/**
 * Simple registration form schema (less strict password)
 */
export const simpleRegisterSchema = z.object({
    email: emailSchema,
    password: simplePasswordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    displayName: displayNameSchema,
    acceptTerms: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms and conditions',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

/**
 * Forgot password form schema
 */
export const forgotPasswordSchema = z.object({
    email: emailSchema,
});

/**
 * Reset password form schema
 */
export const resetPasswordSchema = z.object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

/**
 * Update password form schema
 */
export const updatePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

/**
 * Phone verification schema
 */
export const phoneVerificationSchema = z.object({
    phone: phoneSchema,
    otp: otpSchema,
});

/**
 * Email verification schema
 */
export const emailVerificationSchema = z.object({
    token: z.string().min(1, 'Verification token is required'),
});

/**
 * Profile update schema
 */
export const profileUpdateSchema = z.object({
    displayName: displayNameSchema.optional(),
    email: emailSchema.optional(),
    phone: phoneSchema.optional(),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
    gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
});

/**
 * Type exports for form data
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type SimpleRegisterFormData = z.infer<typeof simpleRegisterSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
export type PhoneVerificationFormData = z.infer<typeof phoneVerificationSchema>;
export type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
