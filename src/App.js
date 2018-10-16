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

class App extends Component {
  providerEngine: Any;
  contractWrappers: Any;
  web3Wrapper: Any;
  AvailableAddresses: [];

  constructor(props) {
    super(props);
    this.state = {
      tx: "",
      maker: "",
      taker: NULL_ADDRESS,
      makerBalance: Number,
      order: {},
      randomExpiration: Number,
      takerAssetAmount: Number,
      makerAssetAmount: Number
    };
    this.changeMakerAmount = this.changeMakerAmount.bind(this);
    this.changeTakerAmount = this.changeTakerAmount.bind(this);
    this.try = this.try.bind(this);
  }
  async componentDidMount() {
    console.log("hola mundo");
    this.providerEngine = new Web3ProviderEngine();
    this.providerEngine.addProvider(new RPCSubprovider(NETWORK_CONFIGS.rpcUrl));
    this.providerEngine.start();

    this.contractWrappers = new ContractWrappers(this.providerEngine, {
      networkId: NETWORK_CONFIGS.networkId
    });

    this.web3Wrapper = new Web3Wrapper(this.providerEngine);

    this.AvailableAddresses = await this.web3Wrapper.getAvailableAddressesAsync();
    this.setState({
      maker: this.AvailableAddresses[0]
    });
    const balance = await this.web3Wrapper.getBalanceInWeiAsync(
      this.state.maker
    );
    this.setState({
      makerBalance: balance.toNumber() / 1e18
    });
    this.setState({
      randomExpiration: getRandomFutureDateInSeconds()
    });
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
    this.setState({
      makerAssetAmount: makerAssetAmount,
      takerAssetAmount: takerAssetAmount
    });
  }

  async try() {
    const [maker, taker] = await this.web3Wrapper.getAvailableAddressesAsync();
    const zrxTokenAddress = this.contractWrappers.exchange.getZRXTokenAddress();
    const etherTokenAddress = this.contractWrappers.etherToken.getContractAddressIfExists();
    const DECIMALS = 18;
    const makerAssetData = assetDataUtils.encodeERC20AssetData(zrxTokenAddress);
    const takerAssetData = assetDataUtils.encodeERC20AssetData(
      etherTokenAddress
    );

    // Allow the 0x ERC20 Proxy to move ZRX on behalf of makerAccount
    const makerZRXApprovalTxHash = await this.contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
      zrxTokenAddress,
      maker
    );
    await this.web3Wrapper.awaitTransactionSuccessAsync(makerZRXApprovalTxHash);

    // Allow the 0x ERC20 Proxy to move WETH on behalf of takerAccount
    const takerWETHApprovalTxHash = await this.contractWrappers.erc20Token.setUnlimitedProxyAllowanceAsync(
      etherTokenAddress,
      taker
    );
    await this.web3Wrapper.awaitTransactionSuccessAsync(
      takerWETHApprovalTxHash
    );

    // Convert ETH into WETH for taker by depositing ETH into the WETH contract
    const takerWETHDepositTxHash = await this.contractWrappers.etherToken.depositAsync(
      etherTokenAddress,
      this.state.takerAssetAmount,
      taker
    );
    await this.web3Wrapper.awaitTransactionSuccessAsync(takerWETHDepositTxHash);
    // Set up the Order and fill it

    const exchangeAddress = this.contractWrappers.exchange.getContractAddress();
    console.log("exchangeAddress", exchangeAddress);
    // Create the order
    const order: Order = {
      exchangeAddress,
      makerAddress: this.state.maker,
      takerAddress: NULL_ADDRESS,
      senderAddress: NULL_ADDRESS,
      feeRecipientAddress: NULL_ADDRESS,
      expirationTimeSeconds: this.state.randomExpiration,
      salt: generatePseudoRandomSalt(),
      makerAssetAmount: this.state.makerAssetAmount,
      takerAssetAmount: this.state.takerAssetAmount,
      makerAssetData,
      takerAssetData,
      makerFee: ZERO,
      takerFee: ZERO
    };

    this.setState({
      order: order
    });
    // Generate the order hash and sign it
    const orderHashHex = orderHashUtils.getOrderHashHex(order);
    const signature = await signatureUtils.ecSignOrderHashAsync(
      this.providerEngine,
      orderHashHex,
      maker,
      SignerType.Default
    );
    const signedOrder = { ...order, signature };
    const validation = await this.contractWrappers.exchange.validateFillOrderThrowIfInvalidAsync(
      signedOrder,
      this.state.takerAssetAmount,
      taker
    );

    const txHash = await this.contractWrappers.exchange.fillOrderAsync(
      signedOrder,
      this.state.takerAssetAmount,
      taker,
      {
        gasLimit: TX_DEFAULTS.gas
      }
    );

    const txSuccess = await this.web3Wrapper.awaitTransactionSuccessAsync(
      txHash
    );
    this.setState({ tx: txHash });
  }
  changeMakerAmount(e) {
    this.setState({
      makerAssetAmount: e.target.value
    });
  }
  changeTakerAmount(e) {
    this.setState({
      takerAssetAmount: e.target.value
    });
  }
  render() {
    return (
      <div className="container">
        <h2>Zero-X</h2>
        <p>Run ganache node</p>
        <header>
          <div>
            <label>Maker balance: </label>
            <br />
            {this.state.makerBalance}
          </div>
          <div className="input-field">
            <label>Maker address</label>
            <input
              type="text"
              id="maker"
              className="input"
              defaultValue={this.state.maker}
              placeholder="No yet"
            />
          </div>
          <div className="input-field">
            <label>taker address</label>
            <input
              type="text"
              id="maker"
              className="input"
              defaultValue={this.state.taker}
              placeholder="No yet"
            />
          </div>
          <div className="input-field">
            <label>Expiration</label>
            <input
              type="text"
              id="randomExpiration"
              className="input"
              defaultValue={this.state.randomExpiration}
              placeholder="No yet"
            />
          </div>
          <div className="input-field">
            <label>makerAssetAmount</label>
            <input
              type="text"
              id="makerAssetAmount"
              className="input"
              onChange={this.changeMakerAmount}
              defaultValue={this.state.makerAssetAmount}
              placeholder="No yet"
            />
          </div>
          <div className="input-field">
            <label>takerAssetAmount</label>
            <input
              type="text"
              id="takerAssetAmount"
              className="input"
              onChange={this.changeTakerAmount}
              defaultValue={this.state.takerAssetAmount}
              placeholder="No yet"
            />
          </div>
          <button onClick={this.try} className="waves-effect waves-light btn">
            Create Order
          </button>
          <div className="input-field">
            <input type="text" className="input" defaultValue={this.state.tx} />
            <label>Hash</label>
          </div>
          Order:
          <pre className="json">
            {JSON.stringify(this.state.order, null, 4)}
          </pre>
        </header>
      </div>
    );
  }
}

export default App;
