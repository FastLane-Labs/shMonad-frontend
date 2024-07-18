import { ethers } from "ethers";
import { UserOperation, SolverOperation, DAppOperation, UserOperationParams } from "./operation";
import { IOperationsRelay } from "./relay";
import { IHooksControllerConstructable } from "./relay/hooks";
/**
 * The main class to submit user operations to Atlas.
 */
export declare class AtlasSdk {
    private iAtlas;
    private atlasVerification;
    private dAppControl;
    private sorter;
    private operationsRelay;
    private sessionKeys;
    private chainId;
    /**
     * Creates a new Atlas SDK instance.
     * @param operationsRelay a backend operations relay client
     * @param provider a provider
     * @param chainId the chain ID of the network
     */
    constructor(provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider, chainId: number, operationsRelay: IOperationsRelay, hooksControllers?: IHooksControllerConstructable[]);
    /**
     * Creates a new user operation.
     * @param userOpParams The user operation parameters
     * @param generateSessionKey Generate a session key for this user operation
     * @returns The user operation and the call configuration for the target dApp
     */
    newUserOperation(userOpParams: UserOperationParams, generateSessionKey?: boolean): Promise<[UserOperation, number]>;
    /**
     * Sets the user operation's nonce.
     * @param userOp a user operation
     * @param callConfig the dApp call configuration
     * @returns the user operation with a valid nonce field
     */
    setUserOperationNonce(userOp: UserOperation, callConfig: number): Promise<UserOperation>;
    /**
     * Generates a unique session key for this user operation.
     * @param userOp a user operation
     * @returns the user operation with a valid sessionKey field
     */
    generateSessionKey(userOp: UserOperation): UserOperation;
    /**
     * Prompt the user to sign their operation.
     * @param userOp a user operation
     * @param signer a signer
     * @returns the user operation with a valid signature field
     */
    signUserOperation(userOp: UserOperation, signer: ethers.providers.JsonRpcSigner): Promise<UserOperation>;
    /**
     * Submits a user operation to the operation relay.
     * @param userOp a signed user operation
     * @param callConfig the dApp call configuration
     * @param hints an array of addresses used as hints for solvers
     * @returns the user operation hash and an array of solver operations
     */
    submitUserOperation(userOp: UserOperation, callConfig: number, hints?: string[]): Promise<[string, SolverOperation[]]>;
    /**
     * Sorts solver operations and filter out invalid ones.
     * @param userOp a user operation
     * @param solverOps an array of solver operations
     * @param callConfig the dApp call configuration
     * @returns a sorted/filtered array of solver operations
     */
    sortSolverOperations(userOp: UserOperation, solverOps: SolverOperation[], callConfig: number): Promise<SolverOperation[]>;
    /**
     * Creates a valid dApp operation.
     * @param userOp a user operation
     * @param solverOps an array of solver operations
     * @param callConfig the dApp call configuration
     * @returns a valid dApp operation
     */
    createDAppOperation(userOpHash: string, userOp: UserOperation, solverOps: SolverOperation[], callConfig: number, bundler?: string): Promise<DAppOperation>;
    /**
     * Gets metacall's encoded calldata.
     * @param userOp a signed user operation
     * @param solverOps an array of solver operations
     * @param dAppOp a signed dApp operation
     * @returns the encoded calldata for metacall
     */
    getMetacallCalldata(userOp: UserOperation, solverOps: SolverOperation[], dAppOp: DAppOperation): string;
    /**
     * Submits all operations to the operations relay for bundling.
     * @param userOp a signed user operation
     * @param solverOps an array of solver operations
     * @param dAppOp a signed dApp operation
     * @param userOpHash the hash of the user operation
     * @returns the hash of the generated Atlas transaction
     */
    submitBundle(userOp: UserOperation, solverOps: SolverOperation[], dAppOp: DAppOperation, userOpHash: string): Promise<string>;
}
