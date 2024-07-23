"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationBuilder = exports.ZeroBytes = exports.ZeroUint = void 0;
const ethers_1 = require("ethers");
const _1 = require("./");
const utils_1 = require("../utils");
exports.ZeroUint = 0n;
exports.ZeroBytes = "0x";
class OperationBuilder {
    static newUserOperation(prop) {
        const userOp = new _1.UserOperation();
        userOp.setFields({
            from: prop.from,
            to: prop.to,
            value: prop.value,
            gas: prop.gas,
            maxFeePerGas: prop.maxFeePerGas,
            nonce: prop.nonce || exports.ZeroUint,
            deadline: prop.deadline,
            dapp: prop.dapp,
            control: prop.control,
            sessionKey: prop.sessionKey || ethers_1.ZeroAddress,
            data: prop.data,
            signature: prop.signature || exports.ZeroBytes,
        });
        userOp.validateFields();
        return userOp;
    }
    static newSolverOperation(prop, score) {
        const solverOp = new _1.SolverOperation(score);
        solverOp.setFields({
            from: prop.from,
            to: prop.to,
            value: prop.value,
            gas: prop.gas,
            maxFeePerGas: prop.maxFeePerGas,
            deadline: prop.deadline,
            solver: prop.solver,
            control: prop.control,
            userOpHash: prop.userOpHash,
            bidToken: prop.bidToken,
            bidAmount: prop.bidAmount,
            data: prop.data,
            signature: prop.signature,
        });
        solverOp.validateFields();
        return solverOp;
    }
    static newDAppOperation(prop) {
        const dAppOp = new _1.DAppOperation();
        dAppOp.setFields({
            from: prop.from,
            to: prop.to,
            value: prop.value,
            gas: prop.gas,
            nonce: prop.nonce,
            deadline: prop.deadline,
            control: prop.control,
            bundler: prop.bundler || ethers_1.ZeroAddress,
            userOpHash: prop.userOpHash,
            callChainHash: prop.callChainHash,
            signature: prop.signature,
        });
        dAppOp.validateFields();
        return dAppOp;
    }
    static newDAppOperationFromUserSolvers(userOp, solverOps, signer, requirePreOps, bundler = ethers_1.ZeroAddress) {
        const userTo = userOp.getField("to").value;
        if (userTo === undefined) {
            throw new Error("UserOperation to is undefined");
        }
        const userDeadline = userOp.getField("deadline").value;
        if (userDeadline === undefined) {
            throw new Error("UserOperation deadline is undefined");
        }
        const dAppControl = userOp.getField("control").value;
        if (dAppControl === undefined) {
            throw new Error("UserOperation control is undefined");
        }
        return this.newDAppOperation({
            from: signer.address,
            to: userTo,
            value: 0n,
            gas: 0n,
            nonce: 1n,
            deadline: userDeadline,
            control: dAppControl,
            bundler: bundler,
            userOpHash: (0, ethers_1.keccak256)(userOp.abiEncode()),
            callChainHash: (0, utils_1.getCallChainHash)(userOp, solverOps, requirePreOps, dAppControl),
            signature: exports.ZeroBytes,
        });
    }
    static newBundle(userOp, solverOps, dAppOp) {
        return new _1.Bundle(userOp, solverOps, dAppOp);
    }
}
exports.OperationBuilder = OperationBuilder;
