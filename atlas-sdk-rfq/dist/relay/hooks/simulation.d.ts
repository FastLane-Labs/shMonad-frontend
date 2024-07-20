import { ethers } from "ethers";
import { UserOperation, SolverOperation, Bundle } from "../../operation";
import { BaseHooksController } from "./base";
export declare class SimulationHooksController extends BaseHooksController {
    private atlas;
    private simulator;
    private multicall3;
    private maxSolutions;
    constructor(provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider, chainId: number);
    preSubmitUserOperation(userOp: UserOperation, hints: string[]): Promise<[UserOperation, string[]]>;
    postGetSolverOperations(userOp: UserOperation, solverOps: SolverOperation[]): Promise<[UserOperation, SolverOperation[]]>;
    preSubmitBundle(bundleOps: Bundle): Promise<Bundle>;
}
