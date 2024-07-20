"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseOperationRelay = void 0;
class BaseOperationRelay {
    constructor(params = {}) {
        this.params = params;
        this.hooksControllers = [];
    }
    addHooksControllers(hooksControllers) {
        this.hooksControllers.push(...hooksControllers);
    }
    async submitUserOperation(userOp, hints, extra) {
        // Pre hooks
        for (const hooksController of this.hooksControllers) {
            [userOp, hints] = await hooksController.preSubmitUserOperation(userOp, hints);
        }
        // Implemented by subclass
        let userOpHash = await this._submitUserOperation(userOp, hints, extra);
        // Post hooks
        for (const hooksController of this.hooksControllers) {
            [userOp, userOpHash] = await hooksController.postSubmitUserOperation(userOp, userOpHash);
        }
        return userOpHash;
    }
    async getSolverOperations(userOp, userOpHash, wait, extra) {
        // Pre hooks
        for (const hooksController of this.hooksControllers) {
            [userOp, userOpHash] = await hooksController.preGetSolverOperations(userOp, userOpHash);
        }
        // Implemented by subclass
        let solverOps = await this._getSolverOperations(userOp, userOpHash, wait, extra);
        // Post hooks
        for (const hooksController of this.hooksControllers) {
            [userOp, solverOps] = await hooksController.postGetSolverOperations(userOp, solverOps);
        }
        return solverOps;
    }
    async submitBundle(bundle, extra) {
        // Pre hooks
        for (const hooksController of this.hooksControllers) {
            bundle = await hooksController.preSubmitBundle(bundle);
        }
        // Implemented by subclass
        let result = await this._submitBundle(bundle, extra);
        // Post hooks
        for (const hooksController of this.hooksControllers) {
            result = await hooksController.postSubmitBundle(result);
        }
        return result;
    }
    async getBundleHash(userOpHash, wait, extra) {
        // Pre hooks
        for (const hooksController of this.hooksControllers) {
            userOpHash = await hooksController.preGetBundleHash(userOpHash);
        }
        // Implemented by subclass
        let atlasTxHash = await this._getBundleHash(userOpHash, wait, extra);
        // Post hooks
        for (const hooksController of this.hooksControllers) {
            atlasTxHash = await hooksController.postGetBundleHash(atlasTxHash);
        }
        return atlasTxHash;
    }
    async _submitUserOperation(userOp, hints, extra) {
        throw new Error("Method not implemented.");
    }
    async _getSolverOperations(userOp, userOpHash, wait, extra) {
        throw new Error("Method not implemented.");
    }
    async _submitBundle(bundle, extra) {
        throw new Error("Method not implemented.");
    }
    async _getBundleHash(userOpHash, wait, extra) {
        throw new Error("Method not implemented.");
    }
}
exports.BaseOperationRelay = BaseOperationRelay;
