import { ethers } from "ethers";
import { UserOperation, SolverOperation, DAppOperation, Bundle } from "./";
export declare const ZeroUint: bigint;
export declare const ZeroBytes = "0x";
export declare abstract class OperationBuilder {
    static newUserOperation(prop: {
        from: string;
        to: string;
        value: bigint | ethers.BigNumber;
        gas: bigint | ethers.BigNumber;
        maxFeePerGas: bigint | ethers.BigNumber;
        nonce?: bigint | ethers.BigNumber;
        deadline: bigint | ethers.BigNumber;
        dapp: string;
        control: string;
        sessionKey?: string;
        data: string;
        signature?: string;
    }): UserOperation;
    static newSolverOperation(prop: {
        from: string;
        to: string;
        value: bigint | ethers.BigNumber;
        gas: bigint | ethers.BigNumber;
        maxFeePerGas: bigint | ethers.BigNumber;
        deadline: bigint | ethers.BigNumber;
        solver: string;
        control: string;
        userOpHash: string;
        bidToken: string;
        bidAmount: bigint | ethers.BigNumber;
        data: string;
        signature: string;
    }, score?: number): SolverOperation;
    static newDAppOperation(prop: {
        from: string;
        to: string;
        value: bigint | ethers.BigNumber;
        gas: bigint | ethers.BigNumber;
        nonce: bigint | ethers.BigNumber;
        deadline: bigint | ethers.BigNumber;
        control: string;
        bundler?: string;
        userOpHash: string;
        callChainHash: string;
        signature: string;
    }): DAppOperation;
    static newDAppOperationFromUserSolvers(userOpHash: string, userOp: UserOperation, solverOps: SolverOperation[], signer: ethers.Wallet, requirePreOps: boolean, bundler?: string): DAppOperation;
    static newBundle(userOp: UserOperation, solverOps: SolverOperation[], dAppOp: DAppOperation): Bundle;
}
