import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../../hooks/useActor';
import type { UserProfile, Balance } from '../../../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetBalance() {
  const { actor, isFetching } = useActor();

  return useQuery<{ usdc: Balance; gold: Balance }>({
    queryKey: ['balance'],
    queryFn: async () => {
      if (!actor) return { usdc: BigInt(0), gold: BigInt(0) };
      try {
        return await actor.getBalance();
      } catch (error: any) {
        // If user has no balance yet, return zeros
        if (error.message?.includes('No balance found')) {
          return { usdc: BigInt(0), gold: BigInt(0) };
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetQuote() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['quote'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getQuote();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSwapUsdcForGold() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: Balance) => {
      if (!actor) throw new Error('Actor not available');
      return actor.swapUsdcForGold(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['quote'] });
    },
  });
}

export function useDepositUsdc() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: Balance) => {
      if (!actor) throw new Error('Actor not available');
      return actor.depositUsdc(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
  });
}
