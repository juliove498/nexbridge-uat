// ============================================================================
// Voting State (Zustand)
// ============================================================================

import { create } from "zustand";
import type { Proposal, Vote, VoteTally } from "@/governance/types";

interface VotingState {
  proposals: Proposal[];
  activeProposal: Proposal | null;
  userVotes: Record<string, Vote>;
  tallies: Record<string, VoteTally>;
  isLoading: boolean;

  setProposals: (proposals: Proposal[]) => void;
  setActiveProposal: (proposal: Proposal | null) => void;
  addVote: (vote: Vote) => void;
  setTally: (proposalId: string, tally: VoteTally) => void;
  setLoading: (loading: boolean) => void;
}

export const useVotingStore = create<VotingState>()((set) => ({
  proposals: [],
  activeProposal: null,
  userVotes: {},
  tallies: {},
  isLoading: false,

  setProposals: (proposals) => set({ proposals }),
  setActiveProposal: (proposal) => set({ activeProposal: proposal }),
  addVote: (vote) =>
    set((state) => ({
      userVotes: { ...state.userVotes, [vote.proposalId]: vote },
    })),
  setTally: (proposalId, tally) =>
    set((state) => ({
      tallies: { ...state.tallies, [proposalId]: tally },
    })),
  setLoading: (loading) => set({ isLoading: loading }),
}));
