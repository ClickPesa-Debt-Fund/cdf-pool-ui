//********** Query Client Data **********//

import { MERCURY_ACCESS_TOKEN, MERCURY_API } from "@/constants";
import { useSettings } from "@/contexts/settings";
import { useWallet } from "@/contexts/wallet";
import { RETROSHADES_COMMANDS, retrosharedCommands } from "@/utils/retroshades";
import {
  Pool,
  PoolOracle,
  PoolUser,
  Positions,
} from "@blend-capital/blend-sdk";
import axios from "axios";
import { UseQueryResult, useQuery, useQueryClient } from "react-query";

export function useQueryClientCacheCleaner(): {
  cleanWalletCache: () => void;
  cleanBackstopCache: () => void;
  cleanPoolCache: (poolId: string) => void;
  cleanBackstopPoolCache: (poolId: string) => void;
} {
  const queryClient = useQueryClient();

  const cleanWalletCache = () => {
    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey[0] === "balance" || query.queryKey[0] === "account",
    });
  };

  const cleanBackstopCache = () => {
    queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === "backstop",
    });
  };

  const cleanPoolCache = (poolId: string) => {
    queryClient.invalidateQueries({
      predicate: (query) =>
        (query.queryKey[0] === "pool" ||
          query.queryKey[0] === "poolPositions") &&
        query.queryKey[1] === poolId,
    });
  };

  const cleanBackstopPoolCache = (poolId: string) => {
    cleanBackstopCache();
    queryClient.invalidateQueries({
      predicate: (query) =>
        (query.queryKey[0] === "backstopPool" ||
          query.queryKey[0] === "backstopPoolUser") &&
        query.queryKey[1] === poolId,
    });
  };

  return {
    cleanWalletCache,
    cleanBackstopCache,
    cleanPoolCache,
    cleanBackstopPoolCache,
  };
}

export function usePool(poolId: string, enabled: boolean = true) {
  const { network } = useSettings();
  return useQuery({
    // staleTime: DEFAULT_STALE_TIME,
    queryKey: ["pool", poolId],
    enabled: enabled && !!poolId,
    queryFn: async () => {
      const data = await Pool.load(network, poolId);
      return data;
    },
  });
}

export function usePoolOracle(
  pool: Pool | undefined,
  enabled: boolean = true
): UseQueryResult<PoolOracle, Error> {
  return useQuery({
    // staleTime: DEFAULT_STALE_TIME,
    queryKey: ["poolOracle", pool?.id],
    enabled: pool !== undefined && enabled,
    queryFn: async () => {
      if (pool !== undefined) {
        return await pool.loadOracle();
      }
    },
  });
}

export function usePoolUser(
  pool: Pool | undefined,
  enabled: boolean = true
): UseQueryResult<PoolUser, Error> {
  const { walletAddress, connected } = useWallet();
  return useQuery({
    // staleTime: USER_STALE_TIME,
    queryKey: ["poolPositions", pool?.id, walletAddress],
    enabled: enabled && pool !== undefined && connected,
    placeholderData: new PoolUser(
      walletAddress,
      new Positions(new Map(), new Map(), new Map()),
      new Map()
    ),
    queryFn: async () => {
      if (pool !== undefined && walletAddress !== "") {
        return await pool.loadUser(walletAddress);
      }
    },
  });
}

// get historical data
export const useRetroshades = ({
  command,
  walletAddress,
}: {
  command: RETROSHADES_COMMANDS;
  walletAddress?: string;
}) => {
  const { data, isLoading, error, refetch, isRefetching } = useQuery(
    [command, walletAddress, "retroshades"],
    async () => {
      const { data } = await axios.post(
        MERCURY_API,
        {
          query: retrosharedCommands?.(walletAddress)?.[command],
        },
        {
          headers: {
            Authorization: "Bearer " + MERCURY_ACCESS_TOKEN,
          },
        }
      );
      return data;
    },
    {
      enabled: !!command,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      // refetchInterval: 10000,
    }
  );
  return { data, error, isLoading, refetch, isRefetching };
};
