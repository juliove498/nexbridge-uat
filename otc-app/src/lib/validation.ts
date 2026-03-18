import { z } from 'zod';

// Password must be ≥8 chars, include upper, lower, number, and special char
const passwordRules = z
  .string()
  .min(8, 'At least 8 characters')
  .regex(/[A-Z]/, 'At least one uppercase letter')
  .regex(/[a-z]/, 'At least one lowercase letter')
  .regex(/[0-9]/, 'At least one number')
  .regex(/[^A-Za-z0-9]/, 'At least one special character');

export const signUpSchema = z
  .object({
    givenName: z.string().min(1, 'First name is required'),
    familyName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: passwordRules,
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms' }),
    }),
    acceptPrivacy: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the privacy policy' }),
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignUpForm = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type SignInForm = z.infer<typeof signInSchema>;

export const verificationSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits').regex(/^\d+$/, 'Code must be numeric'),
});

export type VerificationForm = z.infer<typeof verificationSchema>;

export const mfaSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits').regex(/^\d+$/, 'Code must be numeric'),
});

export type MfaForm = z.infer<typeof mfaSchema>;

export const walletSchema = z.object({
  label: z.string().min(1, 'Label is required').max(50),
  address: z.string().min(10, 'Invalid wallet address'),
  network: z.string().min(1, 'Network is required'),
});

export type WalletForm = z.infer<typeof walletSchema>;

export const otcRequestSchema = z.object({
  asset: z.string().min(1, 'Asset is required'),
  side: z.enum(['buy', 'sell']),
  amount: z.number().positive('Amount must be positive'),
  walletId: z.string().min(1, 'Wallet is required'),
  notes: z.string().optional(),
});

export type OtcRequestForm = z.infer<typeof otcRequestSchema>;

/** Check individual password rules for the strength meter */
export function checkPasswordRules(password: string) {
  return [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Number', met: /[0-9]/.test(password) },
    { label: 'Special character', met: /[^A-Za-z0-9]/.test(password) },
  ];
}
