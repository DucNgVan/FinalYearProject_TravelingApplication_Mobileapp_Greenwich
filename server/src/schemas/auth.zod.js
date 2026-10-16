const { z } = require('zod');

/**
 * @typedef {Object} RegisterDto
 * @property {string} email
 * @property {string} password
 * @property {string} fullName
 */
const registerSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .pipe(z.string().email('Invalid email format')),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
  fullName: z
    .string({ required_error: 'Full name is required' })
    .min(1, 'Full name is required')
    .trim(),
});

/**
 * @typedef {Object} LoginDto
 * @property {string} email
 * @property {string} password
 */
const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .pipe(z.string().email('Invalid email format')),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

module.exports = {
  registerSchema,
  loginSchema,
};
