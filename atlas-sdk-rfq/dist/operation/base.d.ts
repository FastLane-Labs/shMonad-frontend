import { TypedDataDomain, TypedDataField } from "@ethersproject/abstract-signer";
export type OpFieldType = string | bigint;
export type OpField = {
    name: string;
    value?: OpFieldType;
    solType: string;
};
export declare abstract class BaseOperation {
    protected fields: Map<string, OpField>;
    private TYPE_HASH_PREFIX;
    private abiCoder;
    constructor(thPrefix: string);
    setFields(fields: {
        [key: string]: OpFieldType;
    }): void;
    setField(name: string, value: OpFieldType): void;
    getField(name: string): OpField;
    validate(tdDomain: TypedDataDomain): void;
    validateSignature(tdDomain: TypedDataDomain): void;
    validateFields(): void;
    validateField(f: OpField): void;
    abiEncode(): string;
    toStruct(): {
        [key: string]: OpFieldType;
    };
    toTypedDataTypes(): {
        [key: string]: TypedDataField[];
    };
    toTypedDataValues(): {
        [key: string]: OpFieldType;
    };
}
