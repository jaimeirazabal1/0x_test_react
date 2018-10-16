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
/*
==================
(0) 0x5409ed021d9299bf6814279a6a1411a7e866a631 (~100 ETH)
(1) 0x6ecbe1db9ef729cbe972c83fb886247691fb6beb (~100 ETH)
(2) 0xe36ea790bc9d7ab70c55260c66d52b1eca985f84 (~100 ETH)
(3) 0xe834ec434daba538cd1b9fe1582052b880bd7e63 (~100 ETH)
(4) 0x78dc5d2d739606d31509c31d654056a45185ecb6 (~100 ETH)
(5) 0xa8dda8d7f5310e4a9e24f8eba77e091ac264f872 (~100 ETH)
(6) 0x06cef8e666768cc40cc78cf93d9611019ddcb628 (~100 ETH)
(7) 0x4404ac8bd8f9618d27ad2f1485aa1b2cfd82482d (~100 ETH)
(8) 0x7457d5e02197480db681d3fdf256c7aca21bdc12 (~100 ETH)
(9) 0x91c987bf62d25945db517bdaa840a6c661374402 (~100 ETH)

Private Keys
==================
(0) 0xf2f48ee19680706196e2e339e5da3491186e0c4c5030670656b0e0164837257d
(1) 0x5d862464fe9303452126c8bc94274b8c5f9874cbd219789b3eb2128075a76f72
(2) 0xdf02719c4df8b9b8ac7f551fcb5d9ef48fa27eef7a66453879f4d8fdc6e78fb1
(3) 0xff12e391b79415e941a94de3bf3a9aee577aed0731e297d5cfa0b8a1e02fa1d0
(4) 0x752dd9cf65e68cfaba7d60225cbdbc1f4729dd5e5507def72815ed0d8abc6249
(5) 0xefb595a0178eb79a8df953f87c5148402a224cdf725e88c0146727c6aceadccd
(6) 0x83c6d2cc5ddcf9711a6d59b417dc20eb48afd58d45290099e5987e3d768f328f
(7) 0xbb2d3f7c9583780a7d3904a2f55d792707c345f21de1bacb2d389934d82796b2
(8) 0xb2fd4d29c1390b71b8795ae81196bfd60293adf99f9d32a0aff06288fcdac55f
(9) 0x23cb7121166b9a2f93ae0b7c05bde02eae50d64449b2cbb42bc84e9d38d6cc89

*/
