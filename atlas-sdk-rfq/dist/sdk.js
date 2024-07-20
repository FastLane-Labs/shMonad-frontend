"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtlasSdk = void 0;
var ethers_1 = require("ethers");
var json_rpc_signer_1 = require("./typed-data/json-rpc-signer");
var wallet_1 = require("./typed-data/wallet");
var operation_1 = require("./operation");
var utils_1 = require("./utils");
var config_1 = require("./config");
var Atlas_json_1 = __importDefault(require("./abi/Atlas.json"));
var AtlasVerification_json_1 = __importDefault(require("./abi/AtlasVerification.json"));
var DAppControl_json_1 = __importDefault(require("./abi/DAppControl.json"));
var Sorter_json_1 = __importDefault(require("./abi/Sorter.json"));
/**
 * The main class to submit user operations to Atlas.
 */
var AtlasSdk = /** @class */ (function () {
    /**
     * Creates a new Atlas SDK instance.
     * @param operationsRelay a backend operations relay client
     * @param provider a provider
     * @param chainId the chain ID of the network
     */
    function AtlasSdk(provider, chainId, operationsRelay, hooksControllers) {
        if (hooksControllers === void 0) { hooksControllers = []; }
        this.sessionKeys = new Map();
        this.chainId = chainId;
        this.iAtlas = new ethers_1.ethers.utils.Interface(Atlas_json_1.default);
        this.atlasVerification = new ethers_1.ethers.Contract(config_1.chainConfig[chainId].contracts.atlasVerification.address, AtlasVerification_json_1.default, provider);
        this.dAppControl = new ethers_1.ethers.Contract(ethers_1.ethers.constants.AddressZero, DAppControl_json_1.default, provider);
        this.sorter = new ethers_1.ethers.Contract(config_1.chainConfig[chainId].contracts.sorter.address, Sorter_json_1.default, provider);
        var _hooksControllers = hooksControllers.map(function (HookController) { return new HookController(provider, chainId); });
        this.operationsRelay = operationsRelay;
        this.operationsRelay.addHooksControllers(_hooksControllers);
    }
    /**
     * Creates a new user operation.
     * @param userOpParams The user operation parameters
     * @param generateSessionKey Generate a session key for this user operation
     * @returns The user operation and the call configuration for the target dApp
     */
    AtlasSdk.prototype.newUserOperation = function (userOpParams, generateSessionKey) {
        if (generateSessionKey === void 0) { generateSessionKey = false; }
        return __awaiter(this, void 0, void 0, function () {
            var userOp, dConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userOp = operation_1.OperationBuilder.newUserOperation({
                            from: userOpParams.from,
                            to: userOpParams.to
                                ? userOpParams.to
                                : config_1.chainConfig[this.chainId].contracts.atlas.address,
                            value: userOpParams.value,
                            gas: userOpParams.gas,
                            maxFeePerGas: userOpParams.maxFeePerGas,
                            nonce: userOpParams.nonce,
                            deadline: userOpParams.deadline,
                            dapp: userOpParams.dapp,
                            control: userOpParams.control,
                            sessionKey: userOpParams.sessionKey,
                            data: userOpParams.data,
                            signature: userOpParams.signature,
                        });
                        return [4 /*yield*/, this.dAppControl
                                .attach(userOpParams.control)
                                .getDAppConfig(userOp.toStruct())];
                    case 1:
                        dConfig = _a.sent();
                        if (dConfig.to !== userOpParams.control) {
                            throw new Error("UserOperation control does not match dApp control");
                        }
                        if (!!userOpParams.nonce) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.setUserOperationNonce(userOp, dConfig.callConfig)];
                    case 2:
                        userOp = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (generateSessionKey) {
                            userOp = this.generateSessionKey(userOp);
                        }
                        return [2 /*return*/, [userOp, Number(dConfig.callConfig)]];
                }
            });
        });
    };
    /**
     * Sets the user operation's nonce.
     * @param userOp a user operation
     * @param callConfig the dApp call configuration
     * @returns the user operation with a valid nonce field
     */
    AtlasSdk.prototype.setUserOperationNonce = function (userOp, callConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var nonce;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.atlasVerification.getNextNonce(userOp.getField("from").value, (0, utils_1.flagUserNoncesSequenced)(callConfig))];
                    case 1:
                        nonce = _a.sent();
                        userOp.setField("nonce", BigInt(nonce.toString()));
                        return [2 /*return*/, userOp];
                }
            });
        });
    };
    /**
     * Generates a unique session key for this user operation.
     * @param userOp a user operation
     * @returns the user operation with a valid sessionKey field
     */
    AtlasSdk.prototype.generateSessionKey = function (userOp) {
        var sessionAccount = ethers_1.ethers.Wallet.createRandom();
        userOp.setField("sessionKey", sessionAccount.address);
        this.sessionKeys.set(sessionAccount.address, sessionAccount);
        return userOp;
    };
    /**
     * Prompt the user to sign their operation.
     * @param userOp a user operation
     * @param signer a signer
     * @returns the user operation with a valid signature field
     */
    AtlasSdk.prototype.signUserOperation = function (userOp, signer) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        // const signer = new ethers.VoidSigner(signerAccount, provider);
                        _b = (_a = userOp).setField;
                        _c = ["signature"];
                        return [4 /*yield*/, (0, json_rpc_signer_1.signTypedData_signer)(signer, config_1.chainConfig[this.chainId].eip712Domain, userOp.toTypedDataTypes(), userOp.toTypedDataValues())];
                    case 1:
                        // const signer = new ethers.VoidSigner(signerAccount, provider);
                        _b.apply(_a, _c.concat([_d.sent()]));
                        userOp.validateSignature(config_1.chainConfig[this.chainId].eip712Domain);
                        return [2 /*return*/, userOp];
                }
            });
        });
    };
    /**
     * Submits a user operation to the operation relay.
     * @param userOp a signed user operation
     * @param callConfig the dApp call configuration
     * @param hints an array of addresses used as hints for solvers
     * @returns the user operation hash and an array of solver operations
     */
    AtlasSdk.prototype.submitUserOperation = function (userOp, callConfig, hints) {
        if (hints === void 0) { hints = []; }
        return __awaiter(this, void 0, void 0, function () {
            var sessionKey, _i, hints_1, hint, userOphash, solverOps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionKey = userOp.getField("sessionKey").value;
                        if (sessionKey !== ethers_1.ethers.constants.AddressZero &&
                            !this.sessionKeys.has(sessionKey)) {
                            throw new Error("Session key not found");
                        }
                        userOp.validateFields();
                        // Check the signature only if it's already set
                        if (userOp.getField("signature").value !== operation_1.ZeroBytes) {
                            userOp.validateSignature(config_1.chainConfig[this.chainId].eip712Domain);
                        }
                        for (_i = 0, hints_1 = hints; _i < hints_1.length; _i++) {
                            hint = hints_1[_i];
                            if (!(0, utils_1.validateAddress)(hint)) {
                                throw new Error("Invalid hint address: ".concat(hint));
                            }
                        }
                        return [4 /*yield*/, this.operationsRelay.submitUserOperation(userOp, hints)];
                    case 1:
                        userOphash = _a.sent();
                        return [4 /*yield*/, this.operationsRelay.getSolverOperations(userOp, userOphash, true)];
                    case 2:
                        solverOps = _a.sent();
                        if (solverOps.length === 0 && !(0, utils_1.flagZeroSolvers)(callConfig)) {
                            throw new Error("No solver operations returned");
                        }
                        return [2 /*return*/, [userOphash, solverOps]];
                }
            });
        });
    };
    /**
     * Sorts solver operations and filter out invalid ones.
     * @param userOp a user operation
     * @param solverOps an array of solver operations
     * @param callConfig the dApp call configuration
     * @returns a sorted/filtered array of solver operations
     */
    AtlasSdk.prototype.sortSolverOperations = function (userOp, solverOps, callConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var sortedSolverOpsResp, sortedSolverOps;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if ((0, utils_1.flagExPostBids)(callConfig)) {
                            // Sorting will be done onchain during execution
                            return [2 /*return*/, solverOps];
                        }
                        return [4 /*yield*/, this.sorter.sortBids(userOp.toStruct(), solverOps.map(function (solverOp) { return solverOp.toStruct(); }))];
                    case 1:
                        sortedSolverOpsResp = _a.sent();
                        sortedSolverOps = sortedSolverOpsResp.map(function (op) {
                            return operation_1.OperationBuilder.newSolverOperation(op);
                        });
                        if (sortedSolverOps.length === 0 && !(0, utils_1.flagZeroSolvers)(callConfig)) {
                            throw new Error("No solver operations returned");
                        }
                        return [2 /*return*/, sortedSolverOps];
                }
            });
        });
    };
    /**
     * Creates a valid dApp operation.
     * @param userOp a user operation
     * @param solverOps an array of solver operations
     * @param callConfig the dApp call configuration
     * @returns a valid dApp operation
     */
    AtlasSdk.prototype.createDAppOperation = function (userOpHash, userOp, solverOps, callConfig, bundler) {
        if (bundler === void 0) { bundler = ethers_1.ethers.constants.AddressZero; }
        return __awaiter(this, void 0, void 0, function () {
            var sessionKey, sessionAccount, dAppOp, signature;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionKey = userOp.getField("sessionKey").value;
                        sessionAccount = this.sessionKeys.get(sessionKey);
                        if (!sessionAccount) {
                            throw new Error("Session key not found");
                        }
                        // Only keep the local copy for the rest of the process
                        this.sessionKeys.delete(sessionKey);
                        if (sessionKey !== sessionAccount.address) {
                            throw new Error("User operation session key does not match");
                        }
                        dAppOp = operation_1.OperationBuilder.newDAppOperationFromUserSolvers(userOpHash, userOp, solverOps, sessionAccount, (0, utils_1.flagRequirePreOps)(callConfig), bundler);
                        return [4 /*yield*/, (0, wallet_1.signTypedData_wallet)(sessionAccount, config_1.chainConfig[this.chainId].eip712Domain, dAppOp.toTypedDataTypes(), dAppOp.toTypedDataValues())];
                    case 1:
                        signature = _a.sent();
                        dAppOp.setField("signature", signature);
                        dAppOp.validateSignature(config_1.chainConfig[this.chainId].eip712Domain);
                        return [2 /*return*/, dAppOp];
                }
            });
        });
    };
    /**
     * Gets metacall's encoded calldata.
     * @param userOp a signed user operation
     * @param solverOps an array of solver operations
     * @param dAppOp a signed dApp operation
     * @returns the encoded calldata for metacall
     */
    AtlasSdk.prototype.getMetacallCalldata = function (userOp, solverOps, dAppOp) {
        return this.iAtlas.encodeFunctionData("metacall", [
            userOp.toStruct(),
            solverOps.map(function (solverOp) { return solverOp.toStruct(); }),
            dAppOp.toStruct(),
        ]);
    };
    /**
     * Submits all operations to the operations relay for bundling.
     * @param userOp a signed user operation
     * @param solverOps an array of solver operations
     * @param dAppOp a signed dApp operation
     * @param userOpHash the hash of the user operation
     * @returns the hash of the generated Atlas transaction
     */
    AtlasSdk.prototype.submitBundle = function (userOp, solverOps, dAppOp, userOpHash) {
        return __awaiter(this, void 0, void 0, function () {
            var sessionKey, bundle, atlasTxHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionKey = userOp.getField("sessionKey").value;
                        if (sessionKey !== ethers_1.ethers.constants.AddressZero &&
                            sessionKey !== dAppOp.getField("from").value) {
                            throw new Error("User operation session key does not match dApp operation");
                        }
                        bundle = operation_1.OperationBuilder.newBundle(userOp, solverOps, dAppOp);
                        bundle.validate(config_1.chainConfig[this.chainId].eip712Domain);
                        return [4 /*yield*/, this.operationsRelay.submitBundle(bundle)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.operationsRelay.getBundleHash(userOpHash, true)];
                    case 2:
                        atlasTxHash = _a.sent();
                        return [2 /*return*/, atlasTxHash];
                }
            });
        });
    };
    return AtlasSdk;
}());
exports.AtlasSdk = AtlasSdk;
