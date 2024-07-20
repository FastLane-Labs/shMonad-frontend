"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseOperation = void 0;
const ethers_1 = require("ethers");
const utils_1 = require("../utils");
class BaseOperation {
    constructor(thPrefix) {
        this.fields = new Map();
        this.TYPE_HASH_PREFIX = thPrefix;
        this.abiCoder = new ethers_1.AbiCoder();
    }
    setFields(fields) {
        Object.entries(fields).forEach(([name, value]) => {
            this.setField(name, value);
        });
    }
    setField(name, value) {
        const f = this.fields.get(name);
        if (f === undefined) {
            throw new Error(`Field ${name} does not exist`);
        }
        f.value = value;
        this.validateField(f);
    }
    getField(name) {
        const f = this.fields.get(name);
        if (f === undefined) {
            throw new Error(`Field ${name} does not exist`);
        }
        return f;
    }
    validate(tdDomain) {
        this.validateFields();
        this.validateSignature(tdDomain);
    }
    validateSignature(tdDomain) {
        const f = this.fields.get("signature");
        if (f === undefined) {
            throw new Error("Field signature does not exist");
        }
        if (f.value === undefined) {
            throw new Error("Field signature is not set");
        }
        if (!(0, utils_1.validateBytes)(f.value)) {
            throw new Error("Field signature is not a valid bytes");
        }
        const signer = (0, ethers_1.verifyTypedData)(tdDomain, this.toTypedDataTypes(), this.toTypedDataValues(), f.value);
        if (signer !== this.getField("from").value) {
            throw new Error("Invalid signature");
        }
    }
    validateFields() {
        Array.from(this.fields.values()).forEach((f) => {
            this.validateField(f);
        });
    }
    validateField(f) {
        if (f.value === undefined) {
            throw new Error(`Field ${f.name} is not set`);
        }
        switch (f.solType) {
            case "address":
                if (!(0, utils_1.validateAddress)(f.value)) {
                    throw new Error(`Field ${f.name} is not a valid address`);
                }
                break;
            case "uint256":
                if (!(0, utils_1.validateUint256)(f.value)) {
                    throw new Error(`Field ${f.name} is not a valid uint256`);
                }
                break;
            case "bytes32":
                if (!(0, utils_1.validateBytes32)(f.value)) {
                    throw new Error(`Field ${f.name} is not a valid bytes32`);
                }
                break;
            case "bytes":
                if (!(0, utils_1.validateBytes)(f.value)) {
                    throw new Error(`Field ${f.name} is not a valid bytes`);
                }
                break;
            default:
                throw new Error(`Field ${f.name} has unknown type ${f.solType}`);
        }
    }
    abiEncode() {
        const f = Array.from(this.fields.values());
        return this.abiCoder.encode([`tuple(${f.map((f) => f.solType).join(", ")})`], [f.map((f) => f.value)]);
    }
    toStruct() {
        return Array.from(this.fields.values()).reduce((acc, f) => ({ ...acc, [f.name]: f.value }), {});
    }
    toTypedDataTypes() {
        return {
            [this.TYPE_HASH_PREFIX]: Array.from(this.fields.values())
                .slice(0, -1)
                .map((f) => ({
                name: f.name,
                // type: f.solType, // TODO: replace with the following line (Atlas contract bug fix)
                type: f.solType !== "bytes" ? f.solType : "bytes32",
            })),
        };
    }
    toTypedDataValues() {
        return Array.from(this.fields.values())
            .slice(0, -1)
            .reduce((acc, f) => ({
            ...acc,
            [f.name]: 
            // f.value, // TODO: replace with the following line (Atlas contract bug fix)
            f.solType !== "bytes" ? f.value : (0, ethers_1.keccak256)(f.value),
        }), {});
    }
}
exports.BaseOperation = BaseOperation;
