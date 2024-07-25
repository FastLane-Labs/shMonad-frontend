"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOperation = void 0;
const base_1 = require("./base");
class UserOperation extends base_1.BaseOperation {
    constructor() {
        super("UserOperation");
        this.fields = new Map([
            ["from", { name: "from", solType: "address" }],
            ["to", { name: "to", solType: "address" }],
            ["value", { name: "value", solType: "uint256" }],
            ["gas", { name: "gas", solType: "uint256" }],
            ["maxFeePerGas", { name: "maxFeePerGas", solType: "uint256" }],
            ["nonce", { name: "nonce", solType: "uint256" }],
            ["deadline", { name: "deadline", solType: "uint256" }],
            ["dapp", { name: "dapp", solType: "address" }],
            ["control", { name: "control", solType: "address" }],
            ["sessionKey", { name: "sessionKey", solType: "address" }],
            ["data", { name: "data", solType: "bytes" }],
            ["signature", { name: "signature", solType: "bytes" }],
        ]);
    }
}
exports.UserOperation = UserOperation;
