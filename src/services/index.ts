//********** Query Client Data **********//

import { useQueryClient } from "react-query";

export function useQueryClientCacheCleaner(): {
    cleanWalletCache: () => void;
    cleanBackstopCache: () => void;
    cleanPoolCache: (poolId: string) => void;
    cleanBackstopPoolCache: (poolId: string) => void;
  } {
    const queryClient = useQueryClient();
  
    const cleanWalletCache = () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'balance' || query.queryKey[0] === 'account',
      });
    };
  
    const cleanBackstopCache = () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'backstop',
      });
    };
  
    const cleanPoolCache = (poolId: string) => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          (query.queryKey[0] === 'pool' || query.queryKey[0] === 'poolPositions') &&
          query.queryKey[1] === poolId,
      });
    };
  
    const cleanBackstopPoolCache = (poolId: string) => {
      cleanBackstopCache();
      queryClient.invalidateQueries({
        predicate: (query) =>
          (query.queryKey[0] === 'backstopPool' || query.queryKey[0] === 'backstopPoolUser') &&
          query.queryKey[1] === poolId,
      });
    };
  
    return { cleanWalletCache, cleanBackstopCache, cleanPoolCache, cleanBackstopPoolCache };
  }