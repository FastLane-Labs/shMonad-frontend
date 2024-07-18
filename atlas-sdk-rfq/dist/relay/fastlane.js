"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FastlaneOperationsRelay = void 0;
const base_1 = require("./base");
const builder_1 = require("../operation/builder");
const ethers_1 = require("ethers");
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
const url = __importStar(require("url"));
const ROUTES = new Map([
    [
        "submitUserOperation",
        {
            method: "POST",
            path: "/userOperation",
        },
    ],
    [
        "getSolverOperations",
        {
            method: "GET",
            path: "/solverOperations",
        },
    ],
    [
        "submitBundle",
        {
            method: "POST",
            path: "/bundleOperations",
        },
    ],
    [
        "getBundleHash",
        {
            method: "GET",
            path: "/bundleHash",
        },
    ],
]);
class FastlaneOperationsRelay extends base_1.BaseOperationRelay {
    constructor(params) {
        super(params);
        this.fetch = isomorphic_fetch_1.default;
    }
    /**
     * Submit a user operation to the relay
     * @summary Submit a user operation to the relay
     * @param {UserOperation} [userOp] The user operation
     * @param {string[]} [hints] Hints for solvers
     * @param {*} [extra] Extra parameters
     * @returns {Promise<string>} The hash of the user operation
     */
    async _submitUserOperation(userOp, hints, extra) {
        const localVarFetchArgs = FastlaneApiFetchParamCreator().submitUserOperation(userOp, hints, extra);
        const response = await fetch(this.params["basePath"] + localVarFetchArgs.url, localVarFetchArgs.options);
        if (response.status >= 200 && response.status < 300) {
            return await response.json();
        }
        else {
            console.log("request error", this.params["basePath"] + localVarFetchArgs.url, localVarFetchArgs.options);
            const reponseBody = await response.json();
            console.log("response", reponseBody, reponseBody.message);
            throw new Error(reponseBody.message);
        }
    }
    /**
     * Get solver operations for a user operation previously submitted
     * @summary Get solver operations for a user operation previously submitted
     * @param {UserOperation} [userOp] The user operation
     * @param {string} userOpHash The hash of the user operation
     * @param {boolean} [wait] Hold the request until having a response
     * @param {*} [extra] Extra parameters
     * @returns {Promise<SolverOperation[]>} The solver operations
     */
    async _getSolverOperations(_, userOpHash, wait, extra) {
        const localVarFetchArgs = FastlaneApiFetchParamCreator().getSolverOperations(userOpHash, wait, extra);
        const response = await fetch(this.params["basePath"] + localVarFetchArgs.url, localVarFetchArgs.options);
        if (response.status >= 200 && response.status < 300) {
            const solverOpsWithScore = await response.json();
            return solverOpsWithScore.map((solverOpWithScore) => builder_1.OperationBuilder.newSolverOperation(solverOpWithScore.solverOperation, solverOpWithScore.score));
        }
        else {
            const reponseBody = await response.json();
            throw new Error(reponseBody.message);
        }
    }
    /**
     * Submit user/solvers/dApp operations to the relay for bundling
     * @summary Submit a bundle of user/solvers/dApp operations to the relay
     * @param {Bundle} [bundle] The user/solvers/dApp operations to be bundled
     * @param {*} [extra] Extra parameters
     * @returns {Promise<string>} The result message
     */
    async _submitBundle(bundle, extra) {
        const localVarFetchArgs = FastlaneApiFetchParamCreator().submitBundle(bundle, extra);
        const response = await fetch(this.params["basePath"] + localVarFetchArgs.url, localVarFetchArgs.options);
        if (response.status >= 200 && response.status < 300) {
            return await response.json();
        }
        else {
            const reponseBody = await response.json();
            throw new Error(reponseBody.message);
        }
    }
    /**
     * Get the Atlas transaction hash from a previously submitted bundle
     * @summary Get the Atlas transaction hash from a previously submitted bundle
     * @param {string} userOpHash The hash of the user operation
     * @param {boolean} [wait] Hold the request until having a response
     * @param {*} [extra] Extra parameters
     * @returns {Promise<string>} The Atlas transaction hash
     */
    async _getBundleHash(userOpHash, wait, extra) {
        const localVarFetchArgs = FastlaneApiFetchParamCreator().getBundleHash(userOpHash, wait, extra);
        const response = await fetch(this.params["basePath"] + localVarFetchArgs.url, localVarFetchArgs.options);
        if (response.status >= 200 && response.status < 300) {
            return await response.json();
        }
        else {
            const reponseBody = await response.json();
            throw new Error(reponseBody.message);
        }
    }
}
exports.FastlaneOperationsRelay = FastlaneOperationsRelay;
const FastlaneApiFetchParamCreator = function () {
    return {
        /**
         * Submit a user operation to the relay
         * @summary Submit a user operation to the relay
         * @param {UserOperation} [userOp] The user operation
         * @param {string[]} [hints] Hints for solvers
         * @param {*} [options] Override http request option.
         */
        submitUserOperation(userOp, hints, options = {}) {
            let body = {
                userOperation: userOp.toStruct(),
            };
            if (hints.length > 0) {
                body["hints"] = hints;
            }
            const localVarUrlObj = url.parse(ROUTES.get("submitUserOperation")?.path, true);
            const localVarRequestOptions = Object.assign({ method: ROUTES.get("submitUserOperation")?.method }, options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter["Content-Type"] = "application/json";
            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            localVarUrlObj.search = null;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
            const needsSerialization = "UserOperation" !== "string" ||
                localVarRequestOptions.headers["Content-Type"] === "application/json";
            localVarRequestOptions.body = needsSerialization
                ? JSON.stringify(body || {}, (_, v) => typeof v === "bigint" ? (0, ethers_1.toQuantity)(v) : v)
                : body || "";
            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Get solver operations for a user operation previously submitted
         * @summary Get solver operations for a user operation previously submitted
         * @param {string} userOpHash The hash of the user operation
         * @param {boolean} [wait] Hold the request until having a response
         * @param {*} [options] Override http request option.
         */
        getSolverOperations(userOpHash, wait, options = {}) {
            // verify required parameter 'userOpHash' is not null or undefined
            if (userOpHash === null || userOpHash === undefined) {
                throw "Required parameter userOpHash was null or undefined when calling solverOperations.";
            }
            const localVarUrlObj = url.parse(ROUTES.get("getSolverOperations")?.path, true);
            const localVarRequestOptions = Object.assign({ method: ROUTES.get("getSolverOperations")?.method }, options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            if (userOpHash !== undefined) {
                localVarQueryParameter["userOpHash"] = userOpHash;
            }
            if (wait !== undefined) {
                localVarQueryParameter["wait"] = wait;
            }
            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            localVarUrlObj.search = null;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Submit user/solvers/dApp operations to the relay for bundling
         * @summary Submit a bundle of user/solvers/dApp operations to the relay
         * @param {Bundle} [bundle] The user/solvers/dApp operations to be bundled
         * @param {*} [options] Override http request option.
         */
        submitBundle(bundle, options = {}) {
            const bundleStruct = {
                userOperation: bundle.userOperation.toStruct(),
                solverOperations: bundle.solverOperations.map((op) => op.toStruct()),
                dAppOperation: bundle.dAppOperation.toStruct(),
            };
            const localVarUrlObj = url.parse(ROUTES.get("submitBundle")?.path, true);
            const localVarRequestOptions = Object.assign({ method: ROUTES.get("submitBundle")?.method }, options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            localVarHeaderParameter["Content-Type"] = "application/json";
            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            localVarUrlObj.search = null;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
            const needsSerialization = "Bundle" !== "string" ||
                localVarRequestOptions.headers["Content-Type"] === "application/json";
            localVarRequestOptions.body = needsSerialization
                ? JSON.stringify(bundleStruct || {}, (_, v) => typeof v === "bigint" ? (0, ethers_1.toQuantity)(v) : v)
                : bundleStruct || "";
            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Get the Atlas transaction hash from a previously submitted bundle
         * @summary Get the Atlas transaction hash from a previously submitted bundle
         * @param {string} userOpHash The hash of the user operation
         * @param {boolean} [wait] Hold the request until having a response
         * @param {*} [options] Override http request option.
         */
        getBundleHash(userOpHash, wait, options = {}) {
            // verify required parameter 'userOpHash' is not null or undefined
            if (userOpHash === null || userOpHash === undefined) {
                throw "Required parameter userOpHash was null or undefined when calling getBundleHash.";
            }
            const localVarUrlObj = url.parse(ROUTES.get("getBundleHash")?.path, true);
            const localVarRequestOptions = Object.assign({ method: ROUTES.get("getBundleHash")?.method }, options);
            const localVarHeaderParameter = {};
            const localVarQueryParameter = {};
            if (userOpHash !== undefined) {
                localVarQueryParameter["userOpHash"] = userOpHash;
            }
            if (wait !== undefined) {
                localVarQueryParameter["wait"] = wait;
            }
            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            localVarUrlObj.search = null;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    };
};
