import { Transaction } from "stellar-sdk";
import {
  activateAccount,
  createTrustline,
  getAccountBalance,
  getRandomKeyPair,
} from "./account/account-setup";
import requestChallengeTransaction from "./auth/request-challenge-transaction";
import signChallengeTransactionAccount from "./auth/sign-challenge-transaction";
import submitSignedTransactionChallenge from "./auth/submit-signed-transaction";
import getToml from "./shared/get-toml-details";
import submitCollectedKYCFields from "./kyc/submit-collected-fields";
import {
  generateDepositInstructions,
  initiateDeposit,
} from "./deposit/initiate-deposit";
import { UseQueryResult, useMutation, useQuery } from "react-query";
import { toast } from "sonner";
import { formatErrorMessage } from "@/utils";
import {
  retrieveSEPInfo,
  retrieveDepositStatus,
} from "./deposit/retrieve-info";
import retrieveKYCInfo from "./kyc/retrieve-required-fields";
import {
  generateWithdrawInstructions,
  initiateWithdraw,
} from "./withdraw/initiate-withdraw";
import { retrieveWithdrawStatus } from "./withdraw/retrieve-info";

import {
  Backstop,
  // BackstopPool,
  // BackstopPoolUser,
  // Pool,
  // PoolOracle,
  // PoolUser,
  // Positions,
  // Reserve,
  // UserBalance,
} from "@blend-capital/blend-sdk";
// import { Address, Asset, Horizon, SorobanRpc } from "@stellar/stellar-sdk";
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

const horizonURL =
  (import.meta.env.VITE_HORIZON_URL as string) ||
  "https://horizon-testnet.stellar.org";
const coreApiURL = import.meta.env.VITE_CORE_API_URL as string;
const networkPassphrase = import.meta.env
  .VITE_STELLAR_NETWORK_PASSPHRASE as string;
const BACKSTOP_ID = import.meta.env.VITE_BACKSTOP || "";
const DEFAULT_STALE_TIME = 30 * 1000;

const anchorDomain = import.meta.env.VITE_API_URL as string;

type DepositInstructionPayload = {
  JWTToken: any;
  amount: string;
  publicKey: string;
  issuer: string;
  assetCode: string;
  customer_id: string;
  investor_asset: string;
};

type WithdrawInstructionPayload = {
  JWTToken: any;
  amount: string;
  publicKey: string;
  issuer: string;
  assetCode: string;
  customer_id: string;
};

type KYCPayload = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  physical_address?: string;
  city?: string;
  country?: string;
};

/**
 * Fetch the account from Horizon for the connected wallet.
 * @param enabled - Whether the query is enabled (optional - defaults to true)
 * @returns Query result with the account data.
 */
export function useHorizonAccount(
  enabled: boolean = true
): UseQueryResult<Horizon.AccountResponse> {
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
    retry: false,
    enabled,
    queryFn: async () => {
      return await Backstop.load(network, BACKSTOP_ID);
    },
  });
}

export const useGetToml = () => {
  const { data, isLoading, refetch, isRefetching, error } = useQuery(
    ["toml"],
    async () => {
      const TOML = await getToml(anchorDomain);
      return TOML;
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  return {
    toml: data,
    tomlLoading: isLoading,
    tomlError: error as ApiError,
    tomlRefetch: refetch,
    tomlRefetching: isRefetching,
  };
};

export const useGetWalletInfo = () => {
  const { toml } = useGetToml();
  const { data, isLoading, refetch, isRefetching, error } = useQuery(
    ["deposit info"],
    async () => {
      const anchorTransferServer = toml?.TRANSFER_SERVER as string;
      const { deposit, withdraw } = await retrieveSEPInfo({
        transferServerUrl: anchorTransferServer,
      });
      return { deposit, withdraw };
    },
    {
      enabled: !!toml,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  return {
    walletInfo: data,
    walletInfoLoading: isLoading,
    walletInfoError: error as ApiError,
    walletInfoRefetch: refetch,
    walletInfoRefetching: isRefetching,
  };
};

export const useCreateAndActivateAccount = () => {
  const { toml } = useGetToml();
  const { mutateAsync, data, isLoading, reset } = useMutation(
    async (asset: string) => {
      const anchorIssuerAccount = toml?.CURRENCIES?.find(
        (currency) => currency.code === asset
      )?.issuer as string;
      const anchorAuthEndpoint = toml?.WEB_AUTH_ENDPOINT as string;

      // ACCOUNT SETUP
      const accountKeyPair = getRandomKeyPair();

      await activateAccount(accountKeyPair);
      await createTrustline({
        horizonURL,
        keyPair: accountKeyPair,
        issuerKey: anchorIssuerAccount,
        asset,
        networkPassphrase,
      });
      const tx = await requestChallengeTransaction({
        publicKey: accountKeyPair.publicKey(),
        anchorHomeDomain: anchorDomain,
        anchorAuthEndpoint,
        serverSigningKey: toml?.SIGNING_KEY as string,
      });
      const signedChallengeTransaction = await signChallengeTransactionAccount({
        challengeTransaction: tx as Transaction,
        networkPassphrase: networkPassphrase as string,
        keyPair: accountKeyPair,
      });
      const JWTToken = await submitSignedTransactionChallenge({
        signedChallengeTransaction,
        anchorAuthEndpoint,
      });

      return { JWTToken, accountKeyPair };
    },
    {
      onError: (error) => {
        toast.error(formatErrorMessage(error), {
          duration: 5000,
        });
      },
    }
  );
  return {
    generateToken: mutateAsync,
    generateTokenReset: reset,
    generateTokenData: data,
    generateTokenLoading: isLoading,
  };
};

export const useGenerateDepositInstructions = () => {
  const { data, mutateAsync, isLoading, reset } = useMutation(
    async ({
      amount,
      publicKey,
      issuer,
      JWTToken,
      assetCode,
      customer_id,
      investor_asset,
    }: DepositInstructionPayload) => {
      const deposit = await initiateDeposit({
        assetCode,
        publicKey: publicKey,
        transferServerUrl: anchorDomain,
        token: JWTToken,
      });
      const depositInstructions = await generateDepositInstructions({
        amount,
        issuer,
        assetCode,
        transaction_id: deposit?.id,
        customer_id,
        transferServerUrl: coreApiURL,
        investor_asset,
      });
      return { deposit: depositInstructions, id: deposit?.id };
    },
    {
      onError: (error) => {
        toast.error(formatErrorMessage(error), {
          duration: 5000,
        });
      },
    }
  );
  return {
    deposit: mutateAsync,
    depositReset: reset,
    depositData: data,
    depositLoading: isLoading,
  };
};

export const useGenerateWithdrawInstructions = () => {
  const { data, mutateAsync, isLoading, reset } = useMutation(
    async ({
      amount,
      publicKey,
      issuer,
      JWTToken,
      assetCode,
      customer_id,
    }: WithdrawInstructionPayload) => {
      const withdraw = await initiateWithdraw({
        assetCode,
        publicKey: publicKey,
        transferServerUrl: anchorDomain,
        token: JWTToken,
      });
      const withdrawInstructions = await generateWithdrawInstructions({
        amount,
        issuer,
        assetCode,
        transaction_id: withdraw?.id,
        customer_id,
        transferServerUrl: coreApiURL,
      });
      return { withdraw: withdrawInstructions, id: withdraw?.id };
    },
    {
      onError: (error) => {
        toast.error(formatErrorMessage(error), {
          duration: 5000,
        });
      },
    }
  );
  return {
    withdraw: mutateAsync,
    withdrawReset: reset,
    withdrawData: data,
    withdrawLoading: isLoading,
  };
};

export const useGetKYC = (publicKey: string) => {
  const { data, isLoading, refetch, isRefetching, error } = useQuery(
    ["retrieve kyc", publicKey],
    async () => {
      const kyc = await retrieveKYCInfo({
        publicKey,
        kycServer: coreApiURL,
      });
      return kyc;
    },
    {
      enabled: !!publicKey,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );
  return {
    kyc: data,
    kycLoading: isLoading,
    kycError: error as ApiError,
    kycRefetch: refetch,
    kycRefetching: isRefetching,
  };
};

export const useSubmitKYC = () => {
  const { data, mutateAsync, isLoading } = useMutation(
    async ({ user, publicKey }: { user: KYCPayload; publicKey: string }) => {
      const successfulKYCDUser = await submitCollectedKYCFields({
        publicKey,
        kycServer: coreApiURL,
        collectedFields: user,
      });
      return successfulKYCDUser;
    },
    {
      onError: (error) => {
        toast.error(formatErrorMessage(error), {
          duration: 5000,
        });
      },
    }
  );
  return {
    kyc: mutateAsync,
    kycData: data,
    kycLoading: isLoading,
  };
};

export const useGetDepositStatus = (id: string, interval?: boolean) => {
  const { data, isLoading, error, refetch, isRefetching } = useQuery(
    ["deposit status", id],
    async () => {
      const data = await retrieveDepositStatus({
        id,
        transferServerUrl: coreApiURL,
      });
      return data;
    },
    {
      enabled: !!id,
      refetchOnMount: false,
      ...(interval ? { refetchInterval: 5000 } : {}),
      refetchOnWindowFocus: false,
    }
  );
  return {
    depositStatus: data,
    depositStatusLoading: isLoading,
    depositStatusError: error as ApiError,
    depositStatusRefetch: refetch,
    depositStatusRefetching: isRefetching,
  };
};

export const useGetWithdrawStatus = (id: string, interval?: boolean) => {
  const { data, isLoading, error, refetch, isRefetching } = useQuery(
    ["deposit status", id],
    async () => {
      const data = await retrieveWithdrawStatus({
        id,
        transferServerUrl: coreApiURL,
      });
      return data;
    },
    {
      enabled: !!id,
      refetchOnMount: false,
      ...(interval ? { refetchInterval: 5000 } : {}),
      refetchOnWindowFocus: false,
    }
  );
  return {
    withdrawStatus: data,
    withdrawStatusLoading: isLoading,
    withdrawStatusError: error as ApiError,
    withdrawStatusRefetch: refetch,
    withdrawStatusRefetching: isRefetching,
  };
};
export const useGetAccountBalance = (publicKey: string) => {
  const { data, isLoading, error, refetch, isRefetching } = useQuery(
    ["account balance", publicKey],
    async () => {
      const res = await getAccountBalance(horizonURL, publicKey);
      return res;
    },
    {
      enabled: !!publicKey,
      refetchOnMount: false,
      // ...(interval ? { refetchInterval: 10000 } : {}),
      refetchOnWindowFocus: false,
    }
  );
  return {
    balance: data,
    balanceLoading: isLoading,
    balanceError: error as ApiError,
    balanceRefetch: refetch,
    balanceRefetching: isRefetching,
  };
};

export function useTokenBalance(
  tokenId: string | undefined,
  asset: Asset | undefined,
  account: Horizon.AccountResponse | undefined,
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

export const useSubmitAddress = () => {
  const { data, isLoading, error, mutateAsync } = useMutation(
    async (publicKey: string) => {
      const res = await getAccountBalance(horizonURL, publicKey);
      return res;
    },
    {
      onError: (error) => {
        toast.error(formatErrorMessage(error), {
          duration: 5000,
        });
      },
    }
  );
  return {
    address: data,
    addressLoading: isLoading,
    addressError: error as ApiError,
    submitAddress: mutateAsync,
  };
};
