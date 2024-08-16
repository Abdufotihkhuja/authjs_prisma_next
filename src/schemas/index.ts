import { UserRole } from "@prisma/client";
import * as z from "zod";

export const NewPasswordSchema = z.object({
  password: z.string({ required_error: "Please, enter a password" }).min(6, {
    message: "Minimum 6 characters required",
  }),
});

export const LoginSchema = z.object({
  email: z.string({ required_error: "Please, enter an email" }).email({
    message: "Please, enter a valid email",
  }),
  password: z.string({ required_error: "Please, enter a password" }).min(1, {
    message: "Please, enter a password",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string({ required_error: "Please, enter an email" }).email({
    message: "Please, enter a valid email",
  }),
  password: z.string({ required_error: "Please, enter a password" }).min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Please, enter your name",
  }),
});

export const ResetSchema = z.object({
  email: z.string({ required_error: "Please, enter an email" }).email({
    message: "Please, enter a valid email",
  }),
});

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "New password is required",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (!data.password && data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required",
      path: ["password"],
    }
  );
