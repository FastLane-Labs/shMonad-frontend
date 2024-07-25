"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseHooksController = void 0;
class BaseHooksController {
    constructor(provider, chainId) {
        this.provider = provider;
        this.chainId = chainId;
    }
    async preSubmitUserOperation(userOp, hints) {
        return [userOp, hints];
    }
    async postSubmitUserOperation(userOp, userOphash) {
        return [userOp, userOphash];
    }
    async preGetSolverOperations(userOp, userOphash) {
        return [userOp, userOphash];
    }
    async postGetSolverOperations(userOp, solverOps) {
        return [userOp, solverOps];
    }
    async preSubmitBundle(bundleOps) {
        return bundleOps;
    }
    async postSubmitBundle(result) {
        return result;
    }
    async preGetBundleHash(userOphash) {
        return userOphash;
    }
    async postGetBundleHash(atlasTxHash) {
        return atlasTxHash;
    }
}
exports.BaseHooksController = BaseHooksController;
