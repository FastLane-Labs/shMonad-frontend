"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtlasSdk = void 0;
const ethers_1 = require("ethers");
const operation_1 = require("./operation");
const utils_1 = require("./utils");
const config_1 = require("./config");
const Atlas_json_1 = __importDefault(require("./abi/Atlas.json"));
const AtlasVerification_json_1 = __importDefault(require("./abi/AtlasVerification.json"));
const DAppControl_json_1 = __importDefault(require("./abi/DAppControl.json"));
const Sorter_json_1 = __importDefault(require("./abi/Sorter.json"));
/**
 * The main class to submit user operations to Atlas.
 */
class AtlasSdk {
    /**
     * Creates a new Atlas SDK instance.
     * @param operationsRelay a backend operations relay client
     * @param provider a provider
     * @param chainId the chain ID of the network
     */
    constructor(provider, chainId, operationsRelay, hooksControllers = []) {
        this.sessionKeys = new Map();
        this.chainId = chainId;
        this.iAtlas = new ethers_1.Interface(Atlas_json_1.default);
        this.atlasVerification = new ethers_1.Contract(config_1.chainConfig[chainId].contracts.atlasVerification.address, AtlasVerification_json_1.default, provider);
        this.dAppControl = new ethers_1.Contract(ethers_1.ZeroAddress, DAppControl_json_1.default, provider);
        this.sorter = new ethers_1.Contract(config_1.chainConfig[chainId].contracts.sorter.address, Sorter_json_1.default, provider);
        const _hooksControllers = hooksControllers.map((HookController) => new HookController(provider, chainId));
        this.operationsRelay = operationsRelay;
        this.operationsRelay.addHooksControllers(_hooksControllers);
    }
    /**
     * Creates a new user operation.
     * @param userOpParams The user operation parameters
     * @param generateSessionKey Generate a session key for this user operation
     * @returns The user operation and the call configuration for the target dApp
     */
    async newUserOperation(userOpParams, generateSessionKey = false) {
        let userOp = operation_1.OperationBuilder.newUserOperation({
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
        const dConfig = await this.dAppControl
            .attach(userOpParams.control)
            .getFunction("getDAppConfig")
            .staticCall(userOp.toStruct());
        if (dConfig.to !== userOpParams.control) {
            throw new Error("UserOperation control does not match dApp control");
        }
        if (!userOpParams.nonce) {
            userOp = await this.setUserOperationNonce(userOp, dConfig.callConfig);
        }
        if (generateSessionKey) {
            userOp = this.generateSessionKey(userOp);
        }
        return [userOp, Number(dConfig.callConfig)];
    }
    /**
     * Sets the user operation's nonce.
     * @param userOp a user operation
     * @param callConfig the dApp call configuration
     * @returns the user operation with a valid nonce field
     */
    async setUserOperationNonce(userOp, callConfig) {
        const nonce = await this.atlasVerification.getNextNonce(userOp.getField("from").value, (0, utils_1.flagUserNoncesSequenced)(callConfig));
        userOp.setField("nonce", nonce);
        return userOp;
    }
    /**
     * Generates a unique session key for this user operation.
     * @param userOp a user operation
     * @returns the user operation with a valid sessionKey field
     */
    generateSessionKey(userOp) {
        const sessionAccount = ethers_1.Wallet.createRandom();
        userOp.setField("sessionKey", sessionAccount.address);
        this.sessionKeys.set(sessionAccount.address, sessionAccount);
        return userOp;
    }
    /**
     * Prompt the user to sign their operation.
     * @param userOp a user operation
     * @param signer a signer
     * @returns the user operation with a valid signature field
     */
    async signUserOperation(userOp, signer) {
        userOp.setField("signature", await signer.signTypedData(config_1.chainConfig[this.chainId].eip712Domain, userOp.toTypedDataTypes(), userOp.toTypedDataValues()));
        userOp.validateSignature(config_1.chainConfig[this.chainId].eip712Domain);
        return userOp;
    }
    /**
     * Submits a user operation to the operation relay.
     * @param userOp a signed user operation
     * @param callConfig the dApp call configuration
     * @param hints an array of addresses used as hints for solvers
     * @returns the user operation hash and an array of solver operations
     */
    async submitUserOperation(userOp, callConfig, hints = []) {
        const sessionKey = userOp.getField("sessionKey").value;
        if (sessionKey !== ethers_1.ZeroAddress && !this.sessionKeys.has(sessionKey)) {
            throw new Error("Session key not found");
        }
        userOp.validateFields();
        // Check the signature only if it's already set
        if (userOp.getField("signature").value !== operation_1.ZeroBytes) {
            userOp.validateSignature(config_1.chainConfig[this.chainId].eip712Domain);
        }
        for (const hint of hints) {
            if (!(0, utils_1.validateAddress)(hint)) {
                throw new Error(`Invalid hint address: ${hint}`);
            }
        }
        // Submit the user operation to the relay
        const userOphash = await this.operationsRelay.submitUserOperation(userOp, hints);
        // Get the solver operations
        const solverOps = await this.operationsRelay.getSolverOperations(userOp, userOphash, true);
        if (solverOps.length === 0 && !(0, utils_1.flagZeroSolvers)(callConfig)) {
            throw new Error("No solver operations returned");
        }
        return [userOphash, solverOps];
    }
    /**
     * Sorts solver operations and filter out invalid ones.
     * @param userOp a user operation
     * @param solverOps an array of solver operations
     * @param callConfig the dApp call configuration
     * @returns a sorted/filtered array of solver operations
     */
    async sortSolverOperations(userOp, solverOps, callConfig) {
        if ((0, utils_1.flagExPostBids)(callConfig)) {
            // Sorting will be done onchain during execution
            return solverOps;
        }
        const sortedSolverOpsResp = await this.sorter.sortBids(userOp.toStruct(), solverOps.map((solverOp) => solverOp.toStruct()));
        const sortedSolverOps = sortedSolverOpsResp.map((op) => operation_1.OperationBuilder.newSolverOperation(op));
        if (sortedSolverOps.length === 0 && !(0, utils_1.flagZeroSolvers)(callConfig)) {
            throw new Error("No solver operations returned");
        }
        return sortedSolverOps;
    }
    /**
     * Creates a valid dApp operation.
     * @param userOp a user operation
     * @param solverOps an array of solver operations
     * @param callConfig the dApp call configuration
     * @returns a valid dApp operation
     */
    async createDAppOperation(userOp, solverOps, callConfig, bundler = ethers_1.ZeroAddress) {
        const sessionKey = userOp.getField("sessionKey").value;
        const sessionAccount = this.sessionKeys.get(sessionKey);
        if (!sessionAccount) {
            throw new Error("Session key not found");
        }
        // Only keep the local copy for the rest of the process
        this.sessionKeys.delete(sessionKey);
        if (sessionKey !== sessionAccount.address) {
            throw new Error("User operation session key does not match");
        }
        const dAppOp = operation_1.OperationBuilder.newDAppOperationFromUserSolvers(userOp, solverOps, sessionAccount, (0, utils_1.flagRequirePreOps)(callConfig), bundler);
        const signature = await sessionAccount.signTypedData(config_1.chainConfig[this.chainId].eip712Domain, dAppOp.toTypedDataTypes(), dAppOp.toTypedDataValues());
        dAppOp.setField("signature", signature);
        dAppOp.validateSignature(config_1.chainConfig[this.chainId].eip712Domain);
        return dAppOp;
    }
    /**
     * Gets metacall's encoded calldata.
     * @param userOp a signed user operation
     * @param solverOps an array of solver operations
     * @param dAppOp a signed dApp operation
     * @returns the encoded calldata for metacall
     */
    getMetacallCalldata(userOp, solverOps, dAppOp) {
        return this.iAtlas.encodeFunctionData("metacall", [
            userOp.toStruct(),
            solverOps.map((solverOp) => solverOp.toStruct()),
            dAppOp.toStruct(),
        ]);
    }
    /**
     * Submits all operations to the operations relay for bundling.
     * @param userOp a signed user operation
     * @param solverOps an array of solver operations
     * @param dAppOp a signed dApp operation
     * @param userOpHash the hash of the user operation
     * @returns the hash of the generated Atlas transaction
     */
    async submitBundle(userOp, solverOps, dAppOp, userOpHash) {
        const sessionKey = userOp.getField("sessionKey").value;
        if (sessionKey !== ethers_1.ZeroAddress &&
            sessionKey !== dAppOp.getField("from").value) {
            throw new Error("User operation session key does not match dApp operation");
        }
        const bundle = operation_1.OperationBuilder.newBundle(userOp, solverOps, dAppOp);
        bundle.validate(config_1.chainConfig[this.chainId].eip712Domain);
        await this.operationsRelay.submitBundle(bundle);
        const atlasTxHash = await this.operationsRelay.getBundleHash(userOpHash, true);
        return atlasTxHash;
    }
}
exports.AtlasSdk = AtlasSdk;
