import { ethers } from "ethers";
import { UserOperation, SolverOperation, Bundle } from "../../operation";
export interface IHooksController {
    preSubmitUserOperation(userOp: UserOperation, hints: string[]): Promise<[UserOperation, string[]]>;
    postSubmitUserOperation(userOp: UserOperation, userOphash: string): Promise<[UserOperation, string]>;
    preGetSolverOperations(userOp: UserOperation, userOphash: string): Promise<[UserOperation, string]>;
    postGetSolverOperations(userOp: UserOperation, solverOps: SolverOperation[]): Promise<[UserOperation, SolverOperation[]]>;
    preSubmitBundle(bundleOps: Bundle): Promise<Bundle>;
    postSubmitBundle(result: string): Promise<string>;
    preGetBundleHash(userOphash: string): Promise<string>;
    postGetBundleHash(atlasTxHash: string): Promise<string>;
}
export interface IHooksControllerConstructable {
    new (provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider, chainId: number): IHooksController;
}
export declare abstract class BaseHooksController implements IHooksController {
    protected provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
    protected chainId: number;
    constructor(provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider, chainId: number);
    preSubmitUserOperation(userOp: UserOperation, hints: string[]): Promise<[UserOperation, string[]]>;
    postSubmitUserOperation(userOp: UserOperation, userOphash: string): Promise<[UserOperation, string]>;
    preGetSolverOperations(userOp: UserOperation, userOphash: string): Promise<[UserOperation, string]>;
    postGetSolverOperations(userOp: UserOperation, solverOps: SolverOperation[]): Promise<[UserOperation, SolverOperation[]]>;
    preSubmitBundle(bundleOps: Bundle): Promise<Bundle>;
    postSubmitBundle(result: string): Promise<string>;
    preGetBundleHash(userOphash: string): Promise<string>;
    postGetBundleHash(atlasTxHash: string): Promise<string>;
}
