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
import { useMutation, useQuery } from "react-query";
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

const horizonURL = process.env.VITE_HORIZON_URL as string;
const coreApiURL = process.env.VITE_CORE_API_URL as string;
const networkPassphrase = process.env.VITE_STELLAR_NETWORK_PASSPHRASE as string;

const anchorDomain = process.env.VITE_API_URL as string;

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
export const useGetAccountBalance = (publicKey: string, interval?: boolean) => {
  const { data, isLoading, error, refetch, isRefetching } = useQuery(
    ["account balance", publicKey],
    async () => {
      const res = await getAccountBalance(horizonURL, publicKey);
      return res;
    },
    {
      enabled: !!publicKey,
      refetchOnMount: false,
      ...(interval ? { refetchInterval: 10000 } : {}),
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
