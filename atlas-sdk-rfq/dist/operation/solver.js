"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolverOperation = void 0;
const base_1 = require("./base");
class SolverOperation extends base_1.BaseOperation {
    constructor(score) {
        super("SolverOperation");
        this.fields = new Map([
            ["from", { name: "from", solType: "address" }],
            ["to", { name: "to", solType: "address" }],
            ["value", { name: "value", solType: "uint256" }],
            ["gas", { name: "gas", solType: "uint256" }],
            ["maxFeePerGas", { name: "maxFeePerGas", solType: "uint256" }],
            ["deadline", { name: "deadline", solType: "uint256" }],
            ["solver", { name: "solver", solType: "address" }],
            ["control", { name: "control", solType: "address" }],
            ["userOpHash", { name: "userOpHash", solType: "bytes32" }],
            ["bidToken", { name: "bidToken", solType: "address" }],
            ["bidAmount", { name: "bidAmount", solType: "uint256" }],
            ["data", { name: "data", solType: "bytes" }],
            ["signature", { name: "signature", solType: "bytes" }],
        ]);
        this.score = score || 0;
    }
}
exports.SolverOperation = SolverOperation;
