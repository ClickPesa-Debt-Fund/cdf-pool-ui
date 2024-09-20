import { Network } from "@blend-capital/blend-sdk";
import { SorobanRpc } from "@stellar/stellar-sdk";
import React, { useContext, useState } from "react";
import { useLocalStorageState } from "../hooks";

const DEFAULT_RPC =
  import.meta.env.VITE_RPC_URL || "https://soroban-testnet.stellar.org";
const DEFAULT_HORIZON =
  import.meta.env.VITE_HORIZON_URL || "https://horizon-testnet.stellar.org";
const DEFAULT_PASSPHRASE =
  import.meta.env.VITE_PASSPHRASE || "Test SDF Network ; September 2015";

export interface TrackedPool {
  id: string;
  name: string;
}

export interface ISettingsContext {
  network: Network & { horizonUrl: string };
  setNetwork: (
    rpcUrl: string,
    newHorizonUrl: string,
    opts?: SorobanRpc.Server.Options
  ) => void;
  getRPCServer: () => SorobanRpc.Server;
  getHorizonServer: () => SorobanRpc.Server;
  lastPool: string | undefined;
  setLastPool: (poolId: string) => void;
  trackedPools: TrackedPool[];
  trackPool: (id: string, name: string | undefined) => void;
  showLend: boolean;
  setShowLend: (showLend: boolean) => void;
  showJoinPool: boolean;
  setShowJoinPool: (showJoinPool: boolean) => void;
  openConnectWallet: boolean;
  setOpenConnectWallet: (open: boolean) => void;
  connectedWallet: string;
  setConnectedWallet: (wallet: string) => void;
}

const SettingsContext = React.createContext<ISettingsContext | undefined>(
  undefined
);

export const SettingsProvider = ({ children = null as any }) => {
  const [network, setNetwork] = useState<Network & { horizonUrl: string }>({
    rpc: DEFAULT_RPC,
    passphrase: DEFAULT_PASSPHRASE,
    opts: {
      allowHttp: true,
    },
    horizonUrl: DEFAULT_HORIZON,
  });
  const [openConnectWallet, setOpenConnectWallet] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState("");
  const [lastPool, setLastPool] = useLocalStorageState("lastPool", undefined);
  const [showLend, setShowLend] = useState<boolean>(true);
  const [showJoinPool, setShowJoinPool] = useState<boolean>(true);
  const [trackedPoolsString, setTrackedPoolsString] = useLocalStorageState(
    "trackedPools",
    undefined
  );

  const trackedPools = JSON.parse(trackedPoolsString || "[]") as TrackedPool[];

  function handleSetNetwork(
    newRpcUrl: string,
    newHorizonUrl: string,
    opts?: SorobanRpc.Server.Options
  ) {
    setNetwork({
      rpc: newRpcUrl,
      passphrase: DEFAULT_PASSPHRASE,
      opts,
      horizonUrl: newHorizonUrl,
    });
  }

  function getRPCServer() {
    return new SorobanRpc.Server(network.rpc, network.opts);
  }

  function getHorizonServer() {
    return new SorobanRpc.Server(network.horizonUrl, network.opts);
  }

  function trackPool(id: string, name: string | undefined) {
    if (name !== undefined) {
      if (trackedPools.find((pool) => pool.id === id)) return;
      setTrackedPoolsString(JSON.stringify([...trackedPools, { id, name }]));
    }
  }

  console.log(network, lastPool);

  return (
    <SettingsContext.Provider
      value={{
        network,
        setNetwork: handleSetNetwork,
        getRPCServer,
        getHorizonServer,
        lastPool,
        setLastPool,
        trackedPools,
        trackPool,
        showLend,
        setShowLend,
        showJoinPool,
        setShowJoinPool,
        openConnectWallet,
        setOpenConnectWallet,
        connectedWallet,
        setConnectedWallet,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("Component rendered outside the provider tree");
  }

  return context;
};
