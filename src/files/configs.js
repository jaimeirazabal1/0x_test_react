import {
  GANACHE_NETWORK_ID,
  KOVAN_NETWORK_ID,
  ROPSTEN_NETWORK_ID
} from "./constants";
import { NetworkSpecificConfigs } from "./types";

export const TX_DEFAULTS = { gas: 400000 };
export const MNEMONIC =
  "concert load couple harbor equip island argue ramp clarify fence smart topic";
export const BASE_DERIVATION_PATH = `44'/60'/0'/0`;
export const GANACHE_CONFIGS: NetworkSpecificConfigs = {
  rpcUrl: "http://localhost:8545",
  networkId: GANACHE_NETWORK_ID
};
export const KOVAN_CONFIGS: NetworkSpecificConfigs = {
  rpcUrl: "https://kovan.infura.io/v3/8c41a1a79e3e4b6a841d28a415ad19aa",
  networkId: KOVAN_NETWORK_ID
};
export const ROPSTEN_CONFIGS: NetworkSpecificConfigs = {
  rpcUrl: "https://ropsten.infura.io/",
  networkId: ROPSTEN_NETWORK_ID
};
export const NETWORK_CONFIGS = GANACHE_CONFIGS; // or KOVAN_CONFIGS or ROPSTEN_CONFIGS
