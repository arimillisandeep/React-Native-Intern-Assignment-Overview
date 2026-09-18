import type { RegisterForm } from '../types/auth';

export type FormErrors = Partial<Record<keyof RegisterForm, string>>;

export const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
export const validateMobile = (mobile: string) => /^\d{10}$/.test(mobile);

export function validateRegisterForm(form: RegisterForm): FormErrors {
  const errors: FormErrors = {};
  (['fullName', 'email', 'gender', 'mobile', 'address', 'city', 'password', 'confirmPassword'] as const).forEach((field) => {
    if (!form[field].trim()) errors[field] = 'This field is required.';
  });
  if (form.email && !validateEmail(form.email)) errors.email = 'Enter a valid email address.';
  if (form.mobile && !validateMobile(form.mobile)) errors.mobile = 'Enter a 10-digit mobile number.';
  if (form.password && form.password.length < 6) errors.password = 'Password must contain at least 6 characters.';
  if (form.confirmPassword && form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
  return errors;
}
