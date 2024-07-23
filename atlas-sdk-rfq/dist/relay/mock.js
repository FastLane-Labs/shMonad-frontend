"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockOperationsRelay = void 0;
const base_1 = require("./base");
const builder_1 = require("../operation/builder");
const ethers_1 = require("ethers");
class MockOperationsRelay extends base_1.BaseOperationRelay {
    constructor() {
        super();
        this.submittedBundles = {};
    }
    /**
     * Submit a user operation to the relay
     * @summary Submit a user operation to the relay
     * @param {UserOperation} [userOp] The user operation
     * @param {string[]} [hints] Hints for solvers
     * @param {*} [extra] Extra parameters
     * @returns {Promise<string>} The hash of the user operation
     */
    async _submitUserOperation(userOp, hints, extra) {
        return (0, ethers_1.keccak256)(userOp.abiEncode());
    }
    /**
     * Get solver operations for a user operation previously submitted
     * @summary Get solver operations for a user operation previously submitted
     * @param {UserOperation} userOp The user operation
     * @param {string} userOpHash The hash of the user operation
     * @param {boolean} [wait] Hold the request until having a response
     * @param {*} [extra] Extra parameters
     * @returns {Promise<SolverOperation[]>} The solver operations
     */
    async _getSolverOperations(userOp, userOpHash, wait, extra) {
        const solverOps = [];
        for (let i = 0; i < Math.floor(Math.random() * 5 + 1); i++) {
            solverOps.push(builder_1.OperationBuilder.newSolverOperation({
                from: ethers_1.ZeroAddress,
                to: userOp.getField("to").value,
                value: 0n,
                gas: BigInt(10000 * (i + 1)),
                maxFeePerGas: userOp.getField("maxFeePerGas").value,
                deadline: userOp.getField("deadline").value,
                solver: ethers_1.ZeroAddress,
                control: userOp.getField("control").value,
                userOpHash: userOpHash,
                bidToken: ethers_1.ZeroAddress,
                bidAmount: BigInt(30000 * (i + 1)),
                data: builder_1.ZeroBytes,
                signature: builder_1.ZeroBytes,
            }));
        }
        return solverOps;
    }
    /**
     * Submit user/solvers/dApp operations to the relay for bundling
     * @summary Submit a bundle of user/solvers/dApp operations to the relay
     * @param {Bundle} [bundle] The user/solvers/dApp operations to be bundled
     * @param {*} [extra] Extra parameters
     * @returns {Promise<string>} The result message
     */
    async _submitBundle(bundle, extra) {
        const userOpHash = (0, ethers_1.keccak256)(bundle.userOperation.abiEncode());
        this.submittedBundles[userOpHash] = bundle;
        return userOpHash;
    }
    /**
     * Get the Atlas transaction hash from a previously submitted bundle
     * @summary Get the Atlas transaction hash from a previously submitted bundle
     * @param {string} userOpHash The hash of the user operation
     * @param {boolean} [wait] Hold the request until having a response
     * @param {*} [extra] Extra parameters
     * @returns {Promise<string>} The Atlas transaction hash
     */
    async _getBundleHash(userOpHash, wait, extra) {
        const bundle = this.submittedBundles[userOpHash];
        if (bundle === undefined) {
            throw "Bundle not found";
        }
        // Simulate a random transaction hash
        return (0, ethers_1.keccak256)(bundle.dAppOperation.abiEncode());
    }
}
exports.MockOperationsRelay = MockOperationsRelay;
