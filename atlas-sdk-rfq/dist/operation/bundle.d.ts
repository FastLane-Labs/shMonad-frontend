import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { UserOperation, SolverOperation, DAppOperation } from "./";
export declare class Bundle {
    userOperation: UserOperation;
    solverOperations: SolverOperation[];
    dAppOperation: DAppOperation;
    constructor(userOp: UserOperation, solverOps: SolverOperation[], dAppOp: DAppOperation);
    validate(tdDomain: TypedDataDomain): void;
}
