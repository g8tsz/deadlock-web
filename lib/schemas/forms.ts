import { z } from "zod";

const emailSchema = z.string().trim().email().max(320);

/** Honeypot: must be absent or empty (bots often fill hidden URL fields). */
const honeypotWebsiteUrl = z
  .string()
  .optional()
  .refine((v) => !v?.trim(), { message: "Invalid request" });

const turnstileToken = z.string().trim().min(1).max(8000).optional();

export const contactBodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  company: z.string().trim().max(200).optional(),
  email: emailSchema,
  message: z.string().trim().min(1).max(8000),
  website_url: honeypotWebsiteUrl,
  turnstileToken,
});

export const newsletterBodySchema = z.object({
  email: emailSchema,
  website_url: honeypotWebsiteUrl,
  turnstileToken,
});

export type ContactBody = z.infer<typeof contactBodySchema>;
export type NewsletterBody = z.infer<typeof newsletterBodySchema>;
