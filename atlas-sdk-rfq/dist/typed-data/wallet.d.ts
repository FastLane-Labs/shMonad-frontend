import { Wallet } from "@ethersproject/wallet";
import { TypedDataDomain, TypedDataField } from "@ethersproject/abstract-signer";
export declare function signTypedData_wallet(wallet: Wallet, domain: TypedDataDomain, types: Record<string, Array<TypedDataField>>, value: Record<string, any>): Promise<string>;
