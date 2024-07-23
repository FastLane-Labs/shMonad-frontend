import { ethers } from "ethers";
import { BaseOperation, OpField } from "./base";
export declare class UserOperation extends BaseOperation {
    protected fields: Map<string, OpField>;
    constructor();
}
export interface UserOperationParams {
    from: string;
    to?: string;
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
}
