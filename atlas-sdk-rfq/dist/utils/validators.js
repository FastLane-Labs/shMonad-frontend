"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBytes = exports.validateBytes32 = exports.validateUint256 = exports.validateAddress = void 0;
const ethers_1 = require("ethers");
function validateAddress(address) {
    // isAddress returns true for ICAP addresses, add a length check to exclude them
    return (0, ethers_1.isAddress)(address) && address.length === 42;
}
exports.validateAddress = validateAddress;
function validateUint256(value) {
    return value <= 2n ** 256n - 1n;
}
exports.validateUint256 = validateUint256;
function validateBytes32(value) {
    return /^0x[0-9a-f]{64}$/.test(value);
}
exports.validateBytes32 = validateBytes32;
function validateBytes(value) {
    return /^0x([0-9a-f][0-9a-f])*$/.test(value);
}
exports.validateBytes = validateBytes;
