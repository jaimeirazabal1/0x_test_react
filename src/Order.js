import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class OrderRow extends Component {
  constructor() {
    super();
  }
  render() {
    let orders = [];

    for (let orderItem of this.props.orders) {
      orders.push(
        <tr>
          <td>{orderItem.makerAssetAmount.toNumber()}</td>
          <td>{orderItem.takerAssetAmount.toNumber()}</td>
          <td>{orderItem.expirationTimeSeconds.toNumber()}</td>
        </tr>
      );
    }

    return orders;
  }
}
export default OrderRow;

// 0:
// exchangeAddress: "0x48bacb9266a570d521063ef5dd96e61686dbe788"
// expirationTimeSeconds: BigNumber {s: 1, e: 9, c: Array(1)}
// feeRecipientAddress: "0x0000000000000000000000000000000000000000"
// makerAddress: "0x5409ed021d9299bf6814279a6a1411a7e866a631"
// makerAssetAmount: BigNumber {s: 1, e: 18, c: Array(1)}
// makerAssetData: "0xf47261b0000000000000000000000000871dd7c2b4b25e1aa18728e9d5f2af4c4e431f5c"
// makerFee: BigNumber {s: 1, e: 0, c: Array(1)}
// salt: BigNumber {s: 1, e: 76, c: Array(6)}
// senderAddress: "0x0000000000000000000000000000000000000000"
// signature: "0x1c831de7a1f368077b33d1c03c2c194175d0dc3db99c26e71a3ebc053319549f7061c054abd61832745b0461516b71136c213718b661eeae071bc561aa26c02c6803"
// takerAddress: "0x0000000000000000000000000000000000000000"
// takerAssetAmount: BigNumber {s: 1, e: 18, c: Array(1)}
// takerAssetData: "0xf47261b00000000000000000000000000b1ba0af832d7c05fd64161e0db78e85978e8082"
// takerFee: BigNumber {s: 1, e: 0, c: Array(1)}
// __proto__: Object
// length: 1
