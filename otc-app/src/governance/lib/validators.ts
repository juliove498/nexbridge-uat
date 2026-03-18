// ============================================================================
// Input validation (Zod schemas)
// ============================================================================

import { z } from "zod";

export const ampIdSchema = z
  .string()
  .min(10, "AmpId must be at least 10 characters")
  .max(100, "AmpId too long")
  .regex(/^[a-zA-Z0-9]+$/, "AmpId must be alphanumeric");

export const proposalCreateSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(200, "Title must be under 200 characters"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(5000, "Description must be under 5000 characters"),
  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters")
    .max(280, "Summary must be under 280 characters"),
  assetId: z.string().min(1, "Asset is required"),
  quorumRequired: z.number().min(1).max(100),
  votingPeriodBlocks: z.number().min(4320).max(43200),
  options: z
    .array(
      z.object({
        label: z.string().min(1).max(50),
        description: z.string().max(200).optional(),
      })
    )
    .min(2, "At least 2 options required")
    .max(10, "Maximum 10 options"),
});

export const voteSchema = z.object({
  proposalId: z.string().min(1),
  optionId: z.string().min(1),
  voterAmpId: ampIdSchema,
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type ProposalCreateInput = z.infer<typeof proposalCreateSchema>;
export type VoteInput = z.infer<typeof voteSchema>;
