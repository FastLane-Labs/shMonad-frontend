"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bundle = void 0;
class Bundle {
    constructor(userOp, solverOps, dAppOp) {
        this.userOperation = userOp;
        this.solverOperations = solverOps;
        this.dAppOperation = dAppOp;
    }
    validate(tdDomain) {
        this.userOperation.validate(tdDomain);
        this.dAppOperation.validate(tdDomain);
        // We don't validate solver operations
    }
}
exports.Bundle = Bundle;
