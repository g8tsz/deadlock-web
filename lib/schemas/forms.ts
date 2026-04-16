import { z } from "zod";

const emailSchema = z.string().trim().email().max(320);

export const contactBodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  company: z.string().trim().max(200).optional(),
  email: emailSchema,
  message: z.string().trim().min(1).max(8000),
});

export const newsletterBodySchema = z.object({
  email: emailSchema,
});

export type ContactBody = z.infer<typeof contactBodySchema>;
export type NewsletterBody = z.infer<typeof newsletterBodySchema>;
