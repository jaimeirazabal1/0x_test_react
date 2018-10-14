import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

//zero x librearies

import {
  assetDataUtils,
  BigNumber,
  ContractWrappers,
  generatePseudoRandomSalt,
  Order,
  orderHashUtils,
  signatureUtils,
  SignerType
} from "0x.js";
import { Web3Wrapper } from "@0xproject/web3-wrapper";
import { RPCSubprovider, Web3ProviderEngine } from "0x.js";
import { DECIMALS, NULL_ADDRESS, ZERO } from "./files/constants";
import { getRandomFutureDateInSeconds } from "./files/utils";
import { NETWORK_CONFIGS, TX_DEFAULTS } from "./files/configs";

export const providerEngine = new Web3ProviderEngine();
providerEngine.addProvider(new RPCSubprovider("http://localhost:8545"));
providerEngine.start();

// Instantiate ContractWrappers with the provider
const contractWrappers = new ContractWrappers(providerEngine, {
  networkId: NETWORK_CONFIGS.networkId
});
const web3Wrapper = new Web3Wrapper(providerEngine);

class App extends Component {
  async try() {
    const [maker, taker] = await web3Wrapper.getAvailableAddressesAsync();
    // Token Addresses
    const zrxTokenAddress = contractWrappers.exchange.getZRXTokenAddress();
    const etherTokenAddress = contractWrappers.etherToken.getContractAddressIfExists();
    const DECIMALS = 18;
    const makerAssetData = assetDataUtils.encodeERC20AssetData(zrxTokenAddress);
    const takerAssetData = assetDataUtils.encodeERC20AssetData(
      etherTokenAddress
    );
    // the amount the maker is selling of maker asset
    const makerAssetAmount = Web3Wrapper.toBaseUnitAmount(
      new BigNumber(5),
      DECIMALS
    );
    // the amount the maker wants of taker asset
    const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(
      new BigNumber(0.1),
      DECIMALS
    );
    // Allow the 0x ERC20 Proxy to move ZRX on behalf of makerAccount
    const makerZRXApprovalTxHash = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
      zrxTokenAddress,
      maker
    );
    await web3Wrapper.awaitTransactionSuccessAsync(makerZRXApprovalTxHash);

    // Allow the 0x ERC20 Proxy to move WETH on behalf of takerAccount
    const takerWETHApprovalTxHash = await contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
      etherTokenAddress,
      taker
    );
    await web3Wrapper.awaitTransactionSuccessAsync(takerWETHApprovalTxHash);

    // Convert ETH into WETH for taker by depositing ETH into the WETH contract
    const takerWETHDepositTxHash = await contractWrappers.etherToken.depositAsync(
      etherTokenAddress,
      takerAssetAmount,
      taker
    );
    await web3Wrapper.awaitTransactionSuccessAsync(takerWETHDepositTxHash);
    // Set up the Order and fill it
    const randomExpiration = getRandomFutureDateInSeconds();
    const exchangeAddress = contractWrappers.exchange.getContractAddress();

    // Create the order
    const order: Order = {
      exchangeAddress,
      makerAddress: maker,
      takerAddress: NULL_ADDRESS,
      senderAddress: NULL_ADDRESS,
      feeRecipientAddress: NULL_ADDRESS,
      expirationTimeSeconds: randomExpiration,
      salt: generatePseudoRandomSalt(),
      makerAssetAmount,
      takerAssetAmount,
      makerAssetData,
      takerAssetData,
      makerFee: ZERO,
      takerFee: ZERO
    };
    console.log("order", order);
    // Generate the order hash and sign it
    const orderHashHex = orderHashUtils.getOrderHashHex(order);
    const signature = await signatureUtils.ecSignOrderHashAsync(
      providerEngine,
      orderHashHex,
      maker,
      SignerType.Default
    );
    const signedOrder = { ...order, signature };
    console.log("signedOrder", signedOrder);
    await contractWrappers.exchange.validateFillOrderThrowIfInvalidAsync(
      signedOrder,
      takerAssetAmount,
      taker
    );
    const txHash = await contractWrappers.exchange.fillOrderAsync(
      signedOrder,
      takerAssetAmount,
      taker,
      {
        gasLimit: TX_DEFAULTS.gas
      }
    );
    await web3Wrapper.awaitTransactionSuccessAsync(txHash);
    console.log("txHash", txHash);
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={this.try}>Click</button>
        </header>
      </div>
    );
  }
}

export default App;
