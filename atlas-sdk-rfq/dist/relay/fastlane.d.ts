import { BaseOperationRelay } from "./base";
import { UserOperation, SolverOperation, Bundle } from "../operation";
interface FetchAPI {
    (url: string, init?: any): Promise<Response>;
}
export declare class FastlaneOperationsRelay extends BaseOperationRelay {
    protected fetch: FetchAPI;
    constructor(params: {
        [k: string]: string;
    });
    /**
     * Submit a user operation to the relay
     * @summary Submit a user operation to the relay
     * @param {UserOperation} [userOp] The user operation
     * @param {string[]} [hints] Hints for solvers
     * @param {*} [extra] Extra parameters
     * @returns {Promise<string>} The hash of the user operation
     */
    _submitUserOperation(userOp: UserOperation, hints: string[], extra?: any): Promise<string>;
    /**
     * Get solver operations for a user operation previously submitted
     * @summary Get solver operations for a user operation previously submitted
     * @param {UserOperation} [userOp] The user operation
     * @param {string} userOpHash The hash of the user operation
     * @param {boolean} [wait] Hold the request until having a response
     * @param {*} [extra] Extra parameters
     * @returns {Promise<SolverOperation[]>} The solver operations
     */
    _getSolverOperations(_: UserOperation, userOpHash: string, wait?: boolean, extra?: any): Promise<SolverOperation[]>;
    /**
     * Submit user/solvers/dApp operations to the relay for bundling
     * @summary Submit a bundle of user/solvers/dApp operations to the relay
     * @param {Bundle} [bundle] The user/solvers/dApp operations to be bundled
     * @param {*} [extra] Extra parameters
     * @returns {Promise<string>} The result message
     */
    _submitBundle(bundle: Bundle, extra?: any): Promise<string>;
    /**
     * Get the Atlas transaction hash from a previously submitted bundle
     * @summary Get the Atlas transaction hash from a previously submitted bundle
     * @param {string} userOpHash The hash of the user operation
     * @param {boolean} [wait] Hold the request until having a response
     * @param {*} [extra] Extra parameters
     * @returns {Promise<string>} The Atlas transaction hash
     */
    _getBundleHash(userOpHash: string, wait?: boolean, extra?: any): Promise<string>;
}
export {};
