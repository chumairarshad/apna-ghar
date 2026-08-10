import { z } from 'zod';

// Zod Register Validation Schema
export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phone: z.string().optional(),
  role: z.enum(['DEALER', 'ADMIN'], {
    errorMap: () => ({ message: 'Role must be either DEALER or ADMIN' })
  }),
  agencyName: z.string().optional(),
  city: z.string().optional()
});

// Zod Login Validation Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required')
});
