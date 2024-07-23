"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCallChainHash = void 0;
const ethers_1 = require("ethers");
const DAppControl_json_1 = __importDefault(require("../abi/DAppControl.json"));
/**
 * Compute the call chain hash.
 * @param callConfig the dApp call configuration
 * @param dAppControl the dApp control contract address
 * @param userOp a user operation
 * @param solverOps an array of solver operations
 * @returns the call chain hash
 */
function getCallChainHash(userOp, solverOps, requirePreOps, dAppControl) {
    let callSequenceHash = (0, ethers_1.zeroPadBytes)("0x", 32);
    let counter = 0;
    if (requirePreOps) {
        const dAppControlInterface = new ethers_1.Interface(DAppControl_json_1.default);
        callSequenceHash = (0, ethers_1.keccak256)((0, ethers_1.solidityPacked)(["bytes32", "address", "bytes", "uint256"], [
            callSequenceHash,
            dAppControl,
            dAppControlInterface.encodeFunctionData("preOpsCall", [
                userOp.toStruct(),
            ]),
            counter++,
        ]));
    }
    // User call
    callSequenceHash = (0, ethers_1.keccak256)((0, ethers_1.solidityPacked)(["bytes32", "bytes", "uint256"], [callSequenceHash, userOp.abiEncode(), counter++]));
    // Solver calls
    for (const solverOp of solverOps) {
        callSequenceHash = (0, ethers_1.keccak256)((0, ethers_1.solidityPacked)(["bytes32", "bytes", "uint256"], [callSequenceHash, solverOp.abiEncode(), counter++]));
    }
    return callSequenceHash;
}
exports.getCallChainHash = getCallChainHash;
