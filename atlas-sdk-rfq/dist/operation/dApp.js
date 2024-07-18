"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAppOperation = void 0;
const base_1 = require("./base");
class DAppOperation extends base_1.BaseOperation {
    constructor() {
        super("DAppApproval");
        this.fields = new Map([
            ["from", { name: "from", solType: "address" }],
            ["to", { name: "to", solType: "address" }],
            ["value", { name: "value", solType: "uint256" }],
            ["gas", { name: "gas", solType: "uint256" }],
            ["nonce", { name: "nonce", solType: "uint256" }],
            ["deadline", { name: "deadline", solType: "uint256" }],
            ["control", { name: "control", solType: "address" }],
            ["bundler", { name: "bundler", solType: "address" }],
            ["userOpHash", { name: "userOpHash", solType: "bytes32" }],
            ["callChainHash", { name: "callChainHash", solType: "bytes32" }],
            ["signature", { name: "signature", solType: "bytes" }],
        ]);
    }
}
exports.DAppOperation = DAppOperation;
