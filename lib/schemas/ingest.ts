import { z } from "zod";

const optionalNullableString = z.union([z.string(), z.null()]).optional();

export const teamRefSchema = z.object({
  schoolSlug: z.string().min(1),
  schoolName: z.string().min(1),
  tag: z.string().min(1),
  fullName: z.string().min(1),
  logoUrl: optionalNullableString,
});

export const matchIngestSchema = z.object({
  eventSlug: z.string().min(1),
  matchId: z.string().optional(),
  team1: teamRefSchema,
  team2: teamRefSchema,
  scheduledAt: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid datetime" }),
  label: z.string().nullable().optional(),
  score1: z.number().int().min(0).nullable().optional(),
  score2: z.number().int().min(0).nullable().optional(),
  streamUrl: optionalNullableString,
  vodUrl: optionalNullableString,
});

export const standingsRowSchema = z.object({
  schoolSlug: z.string().min(1),
  schoolName: z.string().min(1),
  teamTag: z.string().min(1),
  teamFullName: z.string().min(1),
  teamLogoUrl: optionalNullableString,
  placement: z.number().int().positive().nullable().optional(),
  score: z.number().nullable().optional(),
  seed: z.number().nullable().optional(),
  rankLabel: z.string().nullable().optional(),
  groupName: z.string().nullable().optional(),
  displayOrder: z.number().int().nullable().optional(),
});

export const standingsIngestSchema = z.object({
  eventSlug: z.string().min(1),
  rows: z.array(standingsRowSchema).min(1),
});

export type MatchIngestInput = z.infer<typeof matchIngestSchema>;
export type StandingsIngestInput = z.infer<typeof standingsIngestSchema>;
