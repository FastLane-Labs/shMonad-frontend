import { TypedDataDomain } from "@ethersproject/abstract-signer";
export interface ChainConfig {
    contracts: {
        atlas: {
            address: string;
        };
        atlasVerification: {
            address: string;
        };
        sorter: {
            address: string;
        };
        simulator: {
            address: string;
        };
        multicall3: {
            address: string;
        };
    };
    eip712Domain: TypedDataDomain;
}
export declare const chainConfig: {
    [chainId: number]: ChainConfig;
};
