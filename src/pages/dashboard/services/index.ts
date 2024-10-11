import { UseQueryResult, useQuery } from "react-query";
import {
  Backstop,
  BackstopPool,
  BackstopPoolUser,
  UserBalance,
} from "@blend-capital/blend-sdk";
import { useSettings } from "@/contexts/settings";
import {
  Asset,
  Horizon,
  Account,
  Address,
  Contract,
  SorobanRpc,
  TransactionBuilder,
  scValToNative,
} from "@stellar/stellar-sdk";
import { useWallet } from "@/contexts/wallet";
import { BACKSTOP_CONTRACT } from "@/constants";

const DEFAULT_STALE_TIME = 30 * 1000;

/**
 * Fetch the account from Horizon for the connected wallet.
 * @param enabled - Whether the query is enabled (optional - defaults to true)
 * @returns Query result with the account data.
 */
export function useHorizonAccount(
  enabled: boolean = true
): UseQueryResult<HorizonAccountType, ApiError> {
  const { walletAddress, connected } = useWallet();
  const { network } = useSettings();
  return useQuery({
    // staleTime: USER_STALE_TIME,
    queryKey: ["account", walletAddress],
    enabled: enabled && connected && walletAddress !== "",
    queryFn: async () => {
      if (walletAddress === "") {
        throw new Error("No wallet address");
      }
      let horizon = new Horizon.Server(network.horizonUrl, network.opts);
      return await horizon.loadAccount(walletAddress);
    },
  });
}

export async function getTokenBalance(
  stellar_rpc: SorobanRpc.Server,
  network_passphrase: string,
  token_id: string,
  address: Address
): Promise<bigint> {
  // account does not get validated during simulateTx
  const account = new Account(
    "GANXGJV2RNOFMOSQ2DTI3RKDBAVERXUVFC27KW3RLVQCLB3RYNO3AAI4",
    "123"
  );
  const tx_builder = new TransactionBuilder(account, {
    fee: "1000",
    timebounds: { minTime: 0, maxTime: 0 },
    networkPassphrase: network_passphrase,
  });
  tx_builder.addOperation(
    new Contract(token_id).call("balance", address.toScVal())
  );
  const result: SorobanRpc.Api.SimulateTransactionResponse =
    await stellar_rpc.simulateTransaction(tx_builder.build());
  if (SorobanRpc.Api.isSimulationSuccess(result)) {
    let resultScVal = (
      result as SorobanRpc.Api.SimulateTransactionSuccessResponse
    ).result?.retval;
    if (resultScVal == undefined) {
      console.error(`Error: unable to fetch balance for token: ${token_id}`);
      return BigInt(0);
    } else {
      return scValToNative(resultScVal);
    }
  } else {
    console.error(`Error: unable to fetch balance for token: ${token_id}`);
    return BigInt(0);
  }
}

/**
 * Fetches the backstop data.
 * @param enabled - Whether the query is enabled (optional - defaults to true)
 * @returns Query result with the backstop data.
 */
export function useBackstop(
  enabled: boolean = true
): UseQueryResult<Backstop, Error> {
  const { network } = useSettings();
  return useQuery({
    staleTime: DEFAULT_STALE_TIME,
    queryKey: ["backstop"],
    enabled,
    queryFn: async () => {
      // console.log(BACKSTOP_ID, network);
      return await Backstop.load(network, BACKSTOP_CONTRACT);
    },
  });
}

/**
 * Fetch the backstop pool data for the given pool ID.
 * @param poolId - The pool ID
 * @param enabled - Whether the query is enabled (optional - defaults to true)
 * @returns Query result with the backstop pool data.
 */
export function useBackstopPool(
  poolId: string,
  enabled: boolean = true
): UseQueryResult<BackstopPool, Error> {
  const { network } = useSettings();
  return useQuery({
    staleTime: DEFAULT_STALE_TIME,
    queryKey: ["backstopPool", poolId],
    enabled,
    queryFn: async () => {
      return await BackstopPool.load(network, BACKSTOP_CONTRACT, poolId);
    },
  });
}

/**
 * Fetch the backstop pool user data for the given pool and connected wallet.
 * @param poolId - The pool ID
 * @param enabled - Whether the query is enabled (optional - defaults to true)
 * @returns Query result with the backstop pool user data.
 */
export function useBackstopPoolUser(
  poolId: string,
  enabled: boolean = true
): UseQueryResult<BackstopPoolUser, Error> {
  const { network } = useSettings();
  const { walletAddress, connected } = useWallet();
  return useQuery({
    // staleTime: USER_STALE_TIME,
    queryKey: ["backstopPoolUser", poolId, walletAddress],
    enabled: enabled && connected,
    placeholderData: new BackstopPoolUser(
      walletAddress,
      poolId,
      new UserBalance(BigInt(0), [], BigInt(0), BigInt(0)),
      undefined
    ),
    queryFn: async () => {
      if (walletAddress !== "") {
        return await BackstopPoolUser.load(
          network,
          BACKSTOP_CONTRACT,
          poolId,
          walletAddress
        );
      }
    },
  });
}

export function useTokenBalance(
  tokenId: string | undefined,
  asset: Asset | undefined,
  account: HorizonAccountType | undefined,
  enabled: boolean = true
): UseQueryResult<bigint> {
  const { walletAddress, connected } = useWallet();
  const { network } = useSettings();
  return useQuery({
    // staleTime: USER_STALE_TIME,
    // ...(interval ? { refetchInterval: 10000 } : {}),
    queryKey: [
      "balance",
      tokenId,
      walletAddress,
      account?.last_modified_ledger,
    ],
    enabled: enabled && connected && !!account && walletAddress !== "",
    queryFn: async () => {
      if (walletAddress === "") {
        throw new Error("No wallet address");
      }
      if (tokenId === undefined || tokenId === "") {
        return BigInt(0);
      }

      if (account !== undefined && asset !== undefined) {
        let balance_line = account.balances.find((balance) => {
          if (balance.asset_type == "native") {
            // @ts-ignore
            return asset.isNative();
          }
          return (
            // @ts-ignore
            balance.asset_code === asset.getCode() &&
            // @ts-ignore
            balance.asset_issuer === asset.getIssuer()
          );
        });
        if (balance_line !== undefined) {
          return BigInt(balance_line.balance.replace(".", ""));
        }
      }
      let rpc = new SorobanRpc.Server(network.rpc, network.opts);
      return await getTokenBalance(
        rpc,
        network.passphrase,
        tokenId,
        new Address(walletAddress)
      );
    },
  });
}
