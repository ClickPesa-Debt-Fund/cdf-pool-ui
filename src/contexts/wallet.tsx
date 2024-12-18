import {
  BackstopClaimArgs,
  BackstopContract,
  ContractErrorType,
  Network,
  parseError,
  PoolBackstopActionArgs,
  PoolClaimArgs,
  PoolContract,
  SubmitArgs,
} from "@blend-capital/blend-sdk";
import {
  AlbedoModule,
  FreighterModule,
  ISupportedWallet,
  LobstrModule,
  StellarWalletsKit,
  WalletNetwork,
  XBULL_ID,
  xBullModule,
  // LOBSTR_ID,
  // FREIGHTER_ID
  // allowAllModules,
} from "@creit.tech/stellar-wallets-kit/index";
import { getNetworkDetails as getFreighterNetwork } from "@stellar/freighter-api";
import {
  Asset,
  BASE_FEE,
  Networks,
  Operation,
  SorobanRpc,
  Transaction,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";
import React, { useContext, useEffect, useState } from "react";
import { useLocalStorageState } from "../hooks";
import {
  CometClient,
  CometLiquidityArgs,
  CometSingleSidedDepositArgs,
} from "../utils/comet";
import { useSettings } from "./settings";
import { useQueryClientCacheCleaner } from "@/services";
import axios from "axios";
import {
  BACKSTOP_CONTRACT,
  DEBOUNCE_DELAY,
  NETWORK_PASSPHRASE,
  PLAYGROUND_API,
} from "@/constants";

export interface IWalletContext {
  connected: boolean;
  walletAddress: string;
  txStatus: TxStatus;
  lastTxHash: string | undefined;
  lastTxFailure: string | undefined;
  txType: TxType;
  walletId: string | undefined;
  isSimulating: boolean;
  isLoading: boolean;
  connect: (handleSuccess: (success: boolean) => void) => Promise<void>;
  disconnect: () => void;
  clearLastTx: () => void;
  restore: (
    sim: SorobanRpc.Api.SimulateTransactionRestoreResponse
  ) => Promise<void>;
  poolSubmit: (
    poolId: string,
    submitArgs: SubmitArgs,
    sim: boolean
  ) => Promise<
    | SorobanRpc.Api.SimulateTransactionResponse
    | undefined
    | { message?: string; error?: string }
  >;
  poolClaim: (
    poolId: string,
    claimArgs: PoolClaimArgs,
    sim: boolean
  ) => Promise<SorobanRpc.Api.SimulateTransactionResponse | undefined>;
  backstopDeposit(
    args: PoolBackstopActionArgs,
    sim: boolean
  ): Promise<
    SorobanRpc.Api.SimulateTransactionResponse | { message: string } | undefined
  >;
  backstopWithdraw(
    args: PoolBackstopActionArgs,
    sim: boolean
  ): Promise<SorobanRpc.Api.SimulateTransactionResponse | undefined>;
  backstopQueueWithdrawal(
    args: PoolBackstopActionArgs,
    sim: boolean
  ): Promise<
    SorobanRpc.Api.SimulateTransactionResponse | { message: string } | undefined
  >;
  backstopDequeueWithdrawal(
    args: PoolBackstopActionArgs,
    sim: boolean
  ): Promise<SorobanRpc.Api.SimulateTransactionResponse | undefined>;
  backstopClaim(
    args: BackstopClaimArgs,
    sim: boolean
  ): Promise<SorobanRpc.Api.SimulateTransactionResponse | undefined>;
  cometSingleSidedDeposit(
    cometPoolId: string,
    args: CometSingleSidedDepositArgs,
    sim: boolean
  ): Promise<
    SorobanRpc.Api.SimulateTransactionResponse | { message: string } | undefined
  >;
  cometJoin(
    cometPoolId: string,
    args: CometLiquidityArgs,
    sim: boolean
  ): Promise<
    SorobanRpc.Api.SimulateTransactionResponse | { message: string } | undefined
  >;
  cometExit(
    cometPoolId: string,
    args: CometLiquidityArgs,
    sim: boolean
  ): Promise<
    SorobanRpc.Api.SimulateTransactionResponse | { message: string } | undefined
  >;
  faucet(collateral: boolean): Promise<undefined>;
  createTrustline(asset: Asset): Promise<void>;
  getNetworkDetails(): Promise<Network & { horizonUrl: string }>;
}

export enum TxStatus {
  NONE,
  BUILDING,
  SIGNING,
  SUBMITTING,
  SUCCESS,
  FAIL,
}

export enum TxType {
  // Submit a contract invocation
  CONTRACT,
  // A transaction that is a pre-requisite for another transaction
  PREREQ,
}

const WalletContext = React.createContext<IWalletContext | undefined>(
  undefined
);

export const WalletProvider = ({ children = null as any }) => {
  const { network } = useSettings();

  const {
    cleanWalletCache,
    cleanBackstopCache,
    cleanPoolCache,
    cleanBackstopPoolCache,
  } = useQueryClientCacheCleaner();

  const rpc = new SorobanRpc.Server(network.rpc, network.opts);

  const [connected, setConnected] = useState<boolean>(false);
  const [autoConnect, setAutoConnect] = useLocalStorageState(
    "autoConnectWallet",
    "false"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isSimulating, setSimulating] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatus>(TxStatus.NONE);
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [txFailure, setTxFailure] = useState<string | undefined>(undefined);
  const [txType, setTxType] = useState<TxType>(TxType.CONTRACT);
  // wallet state
  const [walletAddress, setWalletAddress] = useState<string>("");

  const walletKit: StellarWalletsKit = new StellarWalletsKit({
    network: network.passphrase as WalletNetwork,
    selectedWalletId:
      autoConnect !== undefined && autoConnect !== "false"
        ? autoConnect
        : XBULL_ID,
    modules: [
      new xBullModule(),
      new FreighterModule(),
      new LobstrModule(),
      new AlbedoModule(),
    ],
    // modules: allowAllModules(),
  });

  useEffect(() => {
    const isModuleAvailable = async () => {
      const isFreighterAvailable = await new FreighterModule().isAvailable();
      const isLobstr = await new LobstrModule().isAvailable();
      console.log(isFreighterAvailable, isLobstr);
    };
    isModuleAvailable();
  }, []);

  useEffect(() => {
    if (!connected && autoConnect !== "false") {
      setTimeout(() => {
        handleSetWalletAddress();
      }, DEBOUNCE_DELAY);
    }
  }, [autoConnect]);

  function setFailureMessage(message: string | undefined) {
    if (message) {
      let substrings = message.split("Event log (newest first):");
      if (substrings.length > 1) {
        setTxFailure(`Contract Error: ${substrings[0].trimEnd()}`);
      } else {
        setTxFailure(`Stellar Error: ${message}`);
      }
    }
  }

  /**
   * Connect a wallet to the application via the walletKit
   */
  async function handleSetWalletAddress(): Promise<boolean> {
    try {
      const { address: publicKey } = await walletKit.getAddress();
      if (publicKey === "" || publicKey == undefined) {
        console.error("Unable to load wallet key: ", publicKey);
        return false;
      }
      setWalletAddress(publicKey);
      setConnected(true);
      return true;
    } catch (e: any) {
      console.error("Unable to load wallet information: ", e);
      return false;
    }
  }

  /**
   * Open up a modal to connect the user's browser wallet
   */
  async function connect(handleSuccess: (success: boolean) => void) {
    try {
      setLoading(true);
      await walletKit.openModal({
        onWalletSelected: async (option: ISupportedWallet) => {
          walletKit.setWallet(option.id);
          setAutoConnect(option.id);
          let result = await handleSetWalletAddress();
          handleSuccess(result);
        },
      });
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      handleSuccess(false);
      console.error("Unable to connect wallet: ", e);
    }
  }

  function disconnect() {
    setWalletAddress("");
    setConnected(false);
    setAutoConnect("false");
    cleanWalletCache();
  }

  /**
   * Sign an XDR string with the connected user's wallet
   * @param xdr - The XDR to sign
   * @param networkPassphrase - The network passphrase
   * @returns - The signed XDR as a base64 string
   */
  async function sign(xdr: string): Promise<string> {
    if (connected) {
      setTxStatus(TxStatus.SIGNING);
      try {
        let { signedTxXdr } = await walletKit.signTransaction(xdr, {
          address: walletAddress,
          networkPassphrase: network.passphrase as WalletNetwork,
        });
        setTxStatus(TxStatus.SUBMITTING);
        return signedTxXdr;
      } catch (e: any) {
        if (e === "User declined access") {
          setTxFailure("Transaction rejected by wallet.");
        } else if (typeof e === "string") {
          setTxFailure(e);
        }

        setTxStatus(TxStatus.FAIL);
        throw e;
      }
    } else {
      throw new Error("Not connected to a wallet");
    }
  }

  async function restore(
    sim: SorobanRpc.Api.SimulateTransactionRestoreResponse
  ): Promise<void> {
    let account = await rpc.getAccount(walletAddress);
    setTxStatus(TxStatus.BUILDING);
    let fee = parseInt(sim.restorePreamble.minResourceFee) + parseInt(BASE_FEE);
    let restore_tx = new TransactionBuilder(account, { fee: fee.toString() })
      .setNetworkPassphrase(network.passphrase)
      .setTimeout(0)
      .setSorobanData(sim.restorePreamble.transactionData.build())
      .addOperation(Operation.restoreFootprint({}))
      .build();
    let signed_restore_tx = new Transaction(
      await sign(restore_tx.toXDR()),
      network.passphrase
    );
    setTxType(TxType.PREREQ);
    await sendTransaction(signed_restore_tx);
  }

  async function sendTransaction(transaction: Transaction): Promise<boolean> {
    let send_tx_response = await rpc.sendTransaction(transaction);
    let curr_time = Date.now();

    // Attempt to send the transaction and poll for the result
    while (
      send_tx_response.status !== "PENDING" &&
      Date.now() - curr_time < 5000
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      send_tx_response = await rpc.sendTransaction(transaction);
    }
    if (send_tx_response.status !== "PENDING") {
      let error = parseError(send_tx_response);
      console.error(
        "Failed to send transaction: ",
        send_tx_response.hash,
        error
      );
      setFailureMessage(ContractErrorType[error.type]);
      setTxStatus(TxStatus.FAIL);
      return false;
    }

    let get_tx_response = await rpc.getTransaction(send_tx_response.hash);
    while (get_tx_response.status === "NOT_FOUND") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      get_tx_response = await rpc.getTransaction(send_tx_response.hash);
    }

    let hash = transaction.hash().toString("hex");
    setTxHash(hash);
    if (get_tx_response.status === "SUCCESS") {
      console.log("Successfully submitted transaction: ", hash);
      // stall for a bit to ensure data propagates to horizon
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTxStatus(TxStatus.SUCCESS);
      return true;
    } else {
      let error = parseError(get_tx_response);
      console.error(`Transaction failed: `, hash, error);
      setFailureMessage(ContractErrorType[error.type]);
      setTxStatus(TxStatus.FAIL);
      return false;
    }
  }

  async function simulateOperation(
    operation: xdr.Operation
  ): Promise<SorobanRpc.Api.SimulateTransactionResponse> {
    try {
      setSimulating(true);
      const account = await rpc.getAccount(walletAddress);
      const tx_builder = new TransactionBuilder(account, {
        networkPassphrase: network.passphrase,
        fee: BASE_FEE,
        timebounds: {
          minTime: 0,
          maxTime: Math.floor(Date.now() / 1000) + 5 * 60 * 1000,
        },
      }).addOperation(operation);
      const transaction = tx_builder.build();
      const simulation = await rpc.simulateTransaction(transaction);
      setSimulating(false);
      return simulation;
    } catch (e) {
      setSimulating(false);
      throw e;
    }
  }

  async function invokeSorobanOperation(operation: xdr.Operation) {
    try {
      const account = await rpc.getAccount(walletAddress);
      const tx_builder = new TransactionBuilder(account, {
        networkPassphrase: network.passphrase,
        fee: BASE_FEE,
        timebounds: {
          minTime: 0,
          maxTime: Math.floor(Date.now() / 1000) + 5 * 60 * 1000,
        },
      }).addOperation(operation);
      const transaction = tx_builder.build();
      const simResponse = await simulateOperation(operation);
      const assembled_tx = SorobanRpc.assembleTransaction(
        transaction,
        simResponse
      ).build();
      const signedTx = await sign(assembled_tx.toXDR());
      const tx = new Transaction(signedTx, network.passphrase);
      const result = await sendTransaction(tx);
      if (result)
        return {
          message: "Transaction was submitted successfully",
        };
    } catch (e: any) {
      console.error("Unknown error submitting transaction: ", e);
      setFailureMessage(e?.message);
      setTxStatus(TxStatus.FAIL);
    }
  }

  function clearLastTx() {
    setTxStatus(TxStatus.NONE);
    setTxHash(undefined);
    setTxFailure(undefined);
    setTxType(TxType.CONTRACT);
  }

  //********** Pool Functions ***********/

  /**
   * Submit a request to the pool
   * @param poolId - The contract address of the pool
   * @param submitArgs - The "submit" function args
   * @param sim - "true" if simulating the transaction, "false" if submitting
   * @returns The Positions, or undefined
   */
  async function poolSubmit(
    poolId: string,
    submitArgs: SubmitArgs,
    sim: boolean
  ): Promise<
    SorobanRpc.Api.SimulateTransactionResponse | { message: string } | undefined
  > {
    try {
      if (connected) {
        if (!sim) setLoading(true);
        const pool = new PoolContract(poolId);
        const operation = xdr.Operation.fromXDR(
          pool.submit(submitArgs),
          "base64"
        );
        if (sim) {
          return await simulateOperation(operation);
        }
        const result = await invokeSorobanOperation(operation);
        cleanPoolCache(poolId);
        cleanWalletCache();
        setLoading(false);
        return result;
      }
    } catch (error) {
      setLoading(false);
      throw new Error("Something Went wrong");
    }
  }

  /**
   * Claim emissions from the pool
   * @param poolId - The contract address of the pool
   * @param claimArgs - The "claim" function args
   * @param sim - "true" if simulating the transaction, "false" if submitting
   * @returns The Positions, or undefined
   */
  async function poolClaim(
    poolId: string,
    claimArgs: PoolClaimArgs,
    sim: boolean
  ): Promise<SorobanRpc.Api.SimulateTransactionResponse | undefined> {
    if (connected) {
      const pool = new PoolContract(poolId);
      const operation = xdr.Operation.fromXDR(pool.claim(claimArgs), "base64");
      if (sim) {
        return await simulateOperation(operation);
      }
      await invokeSorobanOperation(operation);
      cleanPoolCache(poolId);
      cleanWalletCache();
    }
  }

  //********** Backstop Functions ***********/

  /**
   * Execute an deposit against the backstop
   * @param args - The args of the deposit
   * @param sim - "true" if simulating the transaction, "false" if submitting
   * @returns The Positions, or undefined
   */
  async function backstopDeposit(
    args: PoolBackstopActionArgs,
    sim: boolean
  ): Promise<
    SorobanRpc.Api.SimulateTransactionResponse | { message: string } | undefined
  > {
    try {
      if (connected && BACKSTOP_CONTRACT) {
        if (!sim) setLoading(true);
        let backstop = new BackstopContract(BACKSTOP_CONTRACT);
        let operation = xdr.Operation.fromXDR(backstop.deposit(args), "base64");
        if (sim) {
          return await simulateOperation(operation);
        }
        const result = await invokeSorobanOperation(operation);
        if (typeof args.pool_address === "string") {
          cleanBackstopPoolCache(args.pool_address);
        } else {
          cleanBackstopPoolCache(args.pool_address.toString());
        }
        cleanWalletCache();
        setLoading(false);
        return result;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }

  /**
   * Execute an withdraw against the backstop
   * @param args - The args of the withdraw
   * @param sim - "true" if simulating the transaction, "false" if submitting
   * @returns The Positions, or undefined
   */
  async function backstopWithdraw(
    args: PoolBackstopActionArgs,
    sim: boolean
  ): Promise<SorobanRpc.Api.SimulateTransactionResponse | undefined> {
    try {
      if (connected && BACKSTOP_CONTRACT) {
        if (!sim) setLoading(true);
        let backstop = new BackstopContract(BACKSTOP_CONTRACT);
        let operation = xdr.Operation.fromXDR(
          backstop.withdraw(args),
          "base64"
        );
        if (sim) {
          return await simulateOperation(operation);
        }
        await invokeSorobanOperation(operation);
        if (typeof args.pool_address === "string") {
          cleanBackstopPoolCache(args.pool_address);
        } else {
          cleanBackstopPoolCache(args.pool_address.toString());
        }
        cleanWalletCache();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }

  /**
   * Execute an queue withdrawal against the backstop
   * @param args - The args of the queue withdrawal
   * @param sim - "true" if simulating the transaction, "false" if submitting
   * @returns The Positions, or undefined
   */
  async function backstopQueueWithdrawal(
    args: PoolBackstopActionArgs,
    sim: boolean
  ): Promise<
    SorobanRpc.Api.SimulateTransactionResponse | { message: string } | undefined
  > {
    try {
      if (connected && BACKSTOP_CONTRACT) {
        if (!sim) setLoading(true);
        let backstop = new BackstopContract(BACKSTOP_CONTRACT);
        let operation = xdr.Operation.fromXDR(
          backstop.queueWithdrawal(args),
          "base64"
        );
        if (sim) {
          return await simulateOperation(operation);
        }
        const result = await invokeSorobanOperation(operation);
        if (typeof args.pool_address === "string") {
          cleanBackstopPoolCache(args.pool_address);
        } else {
          cleanBackstopPoolCache(args.pool_address.toString());
        }
        setLoading(false);
        return result;
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }

  /**
   * Execute an dequeue withdrawal against the backstop
   * @param args - The args of the queue withdrawal
   * @param sim - "true" if simulating the transaction, "false" if submitting
   * @returns The Positions, or undefined
   */
  async function backstopDequeueWithdrawal(
    args: PoolBackstopActionArgs,
    sim: boolean
  ): Promise<SorobanRpc.Api.SimulateTransactionResponse | undefined> {
    try {
      if (connected && BACKSTOP_CONTRACT) {
        if (!sim) setLoading(true);
        let backstop = new BackstopContract(BACKSTOP_CONTRACT);
        let operation = xdr.Operation.fromXDR(
          backstop.dequeueWithdrawal(args),
          "base64"
        );
        if (sim) {
          return await simulateOperation(operation);
        }
        await invokeSorobanOperation(operation);
        if (typeof args.pool_address === "string") {
          cleanBackstopPoolCache(args.pool_address);
        } else {
          cleanBackstopPoolCache(args.pool_address.toString());
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }

  /**
   * Claim emissions from the backstop
   * @param claimArgs - The "claim" function args
   * @param sim - "true" if simulating the transaction, "false" if submitting
   * @returns The claimed amount
   */
  async function backstopClaim(
    claimArgs: BackstopClaimArgs,
    sim: boolean
  ): Promise<SorobanRpc.Api.SimulateTransactionResponse | undefined> {
    if (connected && BACKSTOP_CONTRACT) {
      let backstop = new BackstopContract(BACKSTOP_CONTRACT);
      let operation = xdr.Operation.fromXDR(
        backstop.claim(claimArgs),
        "base64"
      );
      if (sim) {
        return await simulateOperation(operation);
      }
      await invokeSorobanOperation(operation);
      if (typeof claimArgs.pool_addresses[0] === "string") {
        cleanBackstopPoolCache(claimArgs.pool_addresses[0]);
      } else {
        cleanBackstopPoolCache(claimArgs.pool_addresses[0].toString());
      }
      cleanWalletCache();
    }
  }

  /**
   * Execute a single sided deposit against a comet pool
   * @param cometPoolId - The comet pool id
   * @param args - The args of the deposit
   * @param sim - "true" if simulating the transaction, "false" if submitting
   * @returns The simulated transaction response, or undefined
   */
  async function cometSingleSidedDeposit(
    cometPoolId: string,
    args: CometSingleSidedDepositArgs,
    sim: boolean
  ): Promise<
    SorobanRpc.Api.SimulateTransactionResponse | { message: string } | undefined
  > {
    try {
      if (connected) {
        if (!sim) setLoading(true);
        let cometClient = new CometClient(cometPoolId);
        let operation = cometClient.depositTokenInGetLPOut(args);
        if (sim) {
          return await simulateOperation(operation);
        }
        const result = await invokeSorobanOperation(operation);
        cleanBackstopCache();
        cleanWalletCache();
        setLoading(false);
        return result;
      }
    } catch (e) {
      setLoading(false);
      throw e;
    }
  }

  async function cometJoin(
    cometPoolId: string,
    args: CometLiquidityArgs,
    sim: boolean
  ): Promise<
    SorobanRpc.Api.SimulateTransactionResponse | { message: string } | undefined
  > {
    try {
      if (connected) {
        if (!sim) setLoading(true);
        let cometClient = new CometClient(cometPoolId);
        let operation = cometClient.join(args);
        if (sim) {
          return await simulateOperation(operation);
        }
        const result = await invokeSorobanOperation(operation);
        cleanBackstopCache();
        cleanWalletCache();
        setLoading(false);
        return result;
      }
    } catch (e) {
      setLoading(false);
      throw e;
    }
  }

  async function cometExit(
    cometPoolId: string,
    args: CometLiquidityArgs,
    sim: boolean
  ): Promise<
    SorobanRpc.Api.SimulateTransactionResponse | { message: string } | undefined
  > {
    try {
      if (connected) {
        if (!sim) setLoading(true);
        let cometClient = new CometClient(cometPoolId);
        let operation = cometClient.exit(args);
        if (sim) {
          return await simulateOperation(operation);
        }
        const result = await invokeSorobanOperation(operation);
        cleanBackstopCache();
        cleanWalletCache();
        setLoading(false);
        return result;
      }
    } catch (e) {
      setLoading(false);
      throw e;
    }
  }

  async function faucet(collateral?: boolean): Promise<any> {
    if (connected && NETWORK_PASSPHRASE === Networks.TESTNET) {
      const url = `${PLAYGROUND_API}/stellar-utils/${
        collateral ? "get-debt-fund-testing-assets" : "get-blend-testing-assets"
      }/${walletAddress}`;
      try {
        setTxStatus(TxStatus.BUILDING);
        const { data } = await axios.get(url);
        let transaction = new Transaction(
          xdr.TransactionEnvelope.fromXDR(data, "base64"),
          network.passphrase
        );

        console.log(transaction, "transaction");

        let signedTx = new Transaction(
          await sign(transaction.toXDR()),
          network.passphrase
        );
        console.log(signedTx, "signed transaction");

        const result = await sendTransaction(signedTx);

        console.log(result, "transaction result");

        if (result) {
          cleanWalletCache();
        }
        if (!result) {
          throw new Error("Transaction failed");
        }
      } catch (e: any) {
        setFailureMessage(e?.message);
        setTxStatus(TxStatus.FAIL);
        throw new Error(e);
      }
    } else {
      throw new Error("You are not on testnet environment");
    }
  }

  async function createTrustline(asset: Asset) {
    try {
      if (connected) {
        const trustlineOperation = Operation.changeTrust({
          asset: asset,
        });
        const account = await rpc.getAccount(walletAddress);
        const tx_builder = new TransactionBuilder(account, {
          networkPassphrase: network.passphrase,
          fee: BASE_FEE,
          timebounds: {
            minTime: 0,
            maxTime: Math.floor(Date.now() / 1000) + 5 * 60 * 1000,
          },
        }).addOperation(trustlineOperation);
        const transaction = tx_builder.build();
        const signedTx = await sign(transaction.toXDR());
        const tx = new Transaction(signedTx, network.passphrase);
        setTxType(TxType.PREREQ);
        const result = await sendTransaction(tx);
        if (result) {
          cleanWalletCache();
        }
      }
    } catch (e) {
      console.error("Failed to create trustline: ", e);
    }
  }

  async function getNetworkDetails() {
    try {
      const freighterDetails: any = await getFreighterNetwork();
      return {
        rpc: freighterDetails.sorobanRpcUrl,
        passphrase: freighterDetails.networkPassphrase,
        maxConcurrentRequests: network.maxConcurrentRequests,
        horizonUrl: freighterDetails.networkUrl,
      };
    } catch (e) {
      console.error("Failed to get network details from freighter", e);
      return network;
    }
  }

  return (
    <WalletContext.Provider
      value={{
        connected,
        walletAddress,
        txStatus,
        lastTxHash: txHash,
        lastTxFailure: txFailure,
        txType,
        walletId: autoConnect,
        isLoading: loading,
        isSimulating,
        connect,
        disconnect,
        clearLastTx,
        restore,
        poolSubmit,
        poolClaim,
        backstopDeposit,
        backstopWithdraw,
        backstopQueueWithdrawal,
        backstopDequeueWithdrawal,
        backstopClaim,
        cometSingleSidedDeposit,
        cometJoin,
        cometExit,
        faucet,
        createTrustline,
        getNetworkDetails,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("Component rendered outside the provider tree");
  }

  return context;
};
