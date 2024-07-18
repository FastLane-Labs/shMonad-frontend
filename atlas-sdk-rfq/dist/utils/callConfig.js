"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flagExPostBids = exports.flagInvertBidValue = exports.flagTrustedOpHash = exports.flagflagFulfillment = exports.flagForwardReturnData = exports.flagVerifyCallChainHash = exports.flagUnknownAuctioneer = exports.flagSolverAuctioneer = exports.flagUserAuctioneer = exports.flagReuseUserOp = exports.flagZeroSolvers = exports.flagPostOpsCall = exports.flagPostSolver = exports.flagPreSolver = exports.flagDelegateUser = exports.flagTrackUserReturnData = exports.flagTrackPreOpsReturnData = exports.flagRequirePreOps = exports.flagDAppNoncesSequenced = exports.flagUserNoncesSequenced = void 0;
function flagUserNoncesSequenced(callConfig) {
    return (Number(callConfig) & 0) !== 0;
}
exports.flagUserNoncesSequenced = flagUserNoncesSequenced;
function flagDAppNoncesSequenced(callConfig) {
    return (Number(callConfig) & 2) !== 0;
}
exports.flagDAppNoncesSequenced = flagDAppNoncesSequenced;
function flagRequirePreOps(callConfig) {
    return (Number(callConfig) & 4) !== 0;
}
exports.flagRequirePreOps = flagRequirePreOps;
function flagTrackPreOpsReturnData(callConfig) {
    return (Number(callConfig) & 8) !== 0;
}
exports.flagTrackPreOpsReturnData = flagTrackPreOpsReturnData;
function flagTrackUserReturnData(callConfig) {
    return (Number(callConfig) & 16) !== 0;
}
exports.flagTrackUserReturnData = flagTrackUserReturnData;
function flagDelegateUser(callConfig) {
    return (Number(callConfig) & 32) !== 0;
}
exports.flagDelegateUser = flagDelegateUser;
function flagPreSolver(callConfig) {
    return (Number(callConfig) & 64) !== 0;
}
exports.flagPreSolver = flagPreSolver;
function flagPostSolver(callConfig) {
    return (Number(callConfig) & 128) !== 0;
}
exports.flagPostSolver = flagPostSolver;
function flagPostOpsCall(callConfig) {
    return (Number(callConfig) & 256) !== 0;
}
exports.flagPostOpsCall = flagPostOpsCall;
function flagZeroSolvers(callConfig) {
    return (Number(callConfig) & 512) !== 0;
}
exports.flagZeroSolvers = flagZeroSolvers;
function flagReuseUserOp(callConfig) {
    return (Number(callConfig) & 1024) !== 0;
}
exports.flagReuseUserOp = flagReuseUserOp;
function flagUserAuctioneer(callConfig) {
    return (Number(callConfig) & 2048) !== 0;
}
exports.flagUserAuctioneer = flagUserAuctioneer;
function flagSolverAuctioneer(callConfig) {
    return (Number(callConfig) & 4096) !== 0;
}
exports.flagSolverAuctioneer = flagSolverAuctioneer;
function flagUnknownAuctioneer(callConfig) {
    return (Number(callConfig) & 8192) !== 0;
}
exports.flagUnknownAuctioneer = flagUnknownAuctioneer;
function flagVerifyCallChainHash(callConfig) {
    return (Number(callConfig) & 16384) !== 0;
}
exports.flagVerifyCallChainHash = flagVerifyCallChainHash;
function flagForwardReturnData(callConfig) {
    return (Number(callConfig) & 32768) !== 0;
}
exports.flagForwardReturnData = flagForwardReturnData;
function flagflagFulfillment(callConfig) {
    return (Number(callConfig) & 65536) !== 0;
}
exports.flagflagFulfillment = flagflagFulfillment;
function flagTrustedOpHash(callConfig) {
    return (Number(callConfig) & 131072) !== 0;
}
exports.flagTrustedOpHash = flagTrustedOpHash;
function flagInvertBidValue(callConfig) {
    return (Number(callConfig) & 262144) !== 0;
}
exports.flagInvertBidValue = flagInvertBidValue;
function flagExPostBids(callConfig) {
    return (Number(callConfig) & 524288) !== 0;
}
exports.flagExPostBids = flagExPostBids;
