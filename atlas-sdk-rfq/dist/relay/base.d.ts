import { UserOperation, SolverOperation, Bundle } from "../operation";
import { IHooksController } from "./hooks";
export interface IOperationsRelay {
    addHooksControllers(hooksControllers: IHooksController[]): void;
    /**
     * Submit a user operation to the relay
     * @summary Submit a user operation to the relay
     * @param {UserOperation} [userOp] The user operation
     * @param {string[]} [hints] Hints for solvers
     * @param {*} [extra] Extra parameters
     * @returns {Promise<string>} The hash of the user operation
     */
    submitUserOperation(userOp: UserOperation, hints: string[], extra?: any): Promise<string>;
    _submitUserOperation(userOp: UserOperation, hints: string[], extra?: any): Promise<string>;
    /**
     * Get solver operations for a user operation previously submitted
     * @summary Get solver operations for a user operation previously submitted
     * @param {UserOperation} userOp The user operation
     * @param {string} userOpHash The hash of the user operation
     * @param {boolean} [wait] Hold the request until having a response
     * @param {*} [extra] Extra parameters
     * @returns {Promise<SolverOperation[]>} The solver operations
     */
    getSolverOperations(userOp: UserOperation, userOpHash: string, wait?: boolean, extra?: any): Promise<SolverOperation[]>;
    _getSolverOperations(userOp: UserOperation, userOpHash: string, wait?: boolean, extra?: any): Promise<SolverOperation[]>;
    /**
     * Submit user/solvers/dApp operations to the relay for bundling
     * @summary Submit a bundle of user/solvers/dApp operations to the relay
     * @param {Bundle} [bundle] The user/solvers/dApp operations to be bundled
     * @param {*} [extra] Extra parameters
     * @returns {Promise<string>} The result message
     */
    submitBundle(bundle: Bundle, extra?: any): Promise<string>;
    _submitBundle(bundle: Bundle, extra?: any): Promise<string>;
    /**
     * Get the Atlas transaction hash from a previously submitted bundle
     * @summary Get the Atlas transaction hash from a previously submitted bundle
     * @param {string} userOpHash The hash of the user operation
     * @param {boolean} [wait] Hold the request until having a response
     * @param {*} [extra] Extra parameters
     * @returns {Promise<string>} The Atlas transaction hash
     */
    getBundleHash(userOpHash: string, wait?: boolean, extra?: any): Promise<string>;
    _getBundleHash(userOpHash: string, wait?: boolean, extra?: any): Promise<string>;
}
export declare abstract class BaseOperationRelay implements IOperationsRelay {
    protected params: {
        [k: string]: string;
    };
    protected hooksControllers: IHooksController[];
    constructor(params?: {
        [k: string]: string;
    });
    addHooksControllers(hooksControllers: IHooksController[]): void;
    submitUserOperation(userOp: UserOperation, hints: string[], extra?: any): Promise<string>;
    getSolverOperations(userOp: UserOperation, userOpHash: string, wait?: boolean, extra?: any): Promise<SolverOperation[]>;
    submitBundle(bundle: Bundle, extra?: any): Promise<string>;
    getBundleHash(userOpHash: string, wait?: boolean, extra?: any): Promise<string>;
    _submitUserOperation(userOp: UserOperation, hints: string[], extra?: any): Promise<string>;
    _getSolverOperations(userOp: UserOperation, userOpHash: string, wait?: boolean, extra?: any): Promise<SolverOperation[]>;
    _submitBundle(bundle: Bundle, extra?: any): Promise<string>;
    _getBundleHash(userOpHash: string, wait?: boolean, extra?: any): Promise<string>;
}
