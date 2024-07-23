import { UserOperation, SolverOperation } from "../operation";
/**
 * Compute the call chain hash.
 * @param callConfig the dApp call configuration
 * @param dAppControl the dApp control contract address
 * @param userOp a user operation
 * @param solverOps an array of solver operations
 * @returns the call chain hash
 */
export declare function getCallChainHash(userOp: UserOperation, solverOps: SolverOperation[], requirePreOps: boolean, dAppControl: string): string;
