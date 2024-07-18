"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulationHooksController = void 0;
const ethers_1 = require("ethers");
const operation_1 = require("../../operation");
const base_1 = require("./base");
const config_1 = require("../../config");
const Atlas_json_1 = __importDefault(require("../../abi/Atlas.json"));
const Simulator_json_1 = __importDefault(require("../../abi/Simulator.json"));
const Multicall3_json_1 = __importDefault(require("../../abi/Multicall3.json"));
class SimulationHooksController extends base_1.BaseHooksController {
    constructor(provider, chainId) {
        super(provider, chainId);
        this.maxSolutions = 10;
        this.atlas = new ethers_1.Contract(config_1.chainConfig[chainId].contracts.atlas.address, Atlas_json_1.default, provider);
        this.simulator = new ethers_1.Contract(config_1.chainConfig[chainId].contracts.simulator.address, Simulator_json_1.default, provider);
        this.multicall3 = new ethers_1.Contract(config_1.chainConfig[chainId].contracts.multicall3.address, Multicall3_json_1.default, provider);
    }
    async preSubmitUserOperation(userOp, hints) {
        let [success, result, validCallsResult] = await this.simulator
            .getFunction("simUserOperation")
            .staticCall(userOp.toStruct());
        if (!success) {
            throw new Error(`user operation failed simulation, result: ${result}, validCallsResult: ${validCallsResult}`);
        }
        return [userOp, hints];
    }
    async postGetSolverOperations(userOp, solverOps) {
        let sortedSolverOps = solverOps.slice();
        const atlasAddress = await this.atlas.getAddress();
        const simulatorAddress = await this.simulator.getAddress();
        // Get scores (multicall)
        let calls = sortedSolverOps.map((solverOp) => {
            return {
                target: atlasAddress,
                allowFailure: true,
                callData: this.atlas.interface.encodeFunctionData("accessData", [
                    solverOp.getField("from").value,
                ]),
            };
        });
        let results = await this.multicall3
            .getFunction("aggregate3")
            .staticCall(calls);
        for (let i = 0; i < results.length; i++) {
            if (!results[i].success) {
                console.log("Failed to get stats for solver operation", i);
                continue;
            }
            const stats = this.atlas.interface.decodeFunctionResult("accessData", results[i].returnData);
            const auctionWins = Number(stats[2]);
            const auctionFails = Number(stats[3]);
            const total = auctionWins + auctionFails;
            sortedSolverOps[i].score = total === 0 ? 0 : (auctionWins * 100) / total;
        }
        // Sort by score
        sortedSolverOps.sort((a, b) => {
            return a.score - b.score;
        });
        // Keep only the best solutions
        sortedSolverOps = sortedSolverOps.slice(0, this.maxSolutions);
        // Simulate (multicall)
        calls = sortedSolverOps.map((solverOp) => {
            return {
                target: simulatorAddress,
                allowFailure: true,
                callData: this.simulator.interface.encodeFunctionData("simSolverCall", [
                    userOp.toStruct(),
                    solverOp.toStruct(),
                    operation_1.OperationBuilder.newDAppOperation({
                        from: ethers_1.ZeroAddress,
                        to: ethers_1.ZeroAddress,
                        value: 0n,
                        gas: 0n,
                        nonce: 0n,
                        deadline: userOp.getField("deadline").value,
                        control: userOp.getField("control").value,
                        bundler: ethers_1.ZeroAddress,
                        userOpHash: ethers_1.ZeroHash,
                        callChainHash: ethers_1.ZeroHash,
                        signature: operation_1.ZeroBytes,
                    }).toStruct(),
                ]),
            };
        });
        results = await this.multicall3.getFunction("aggregate3").staticCall(calls);
        let simulatedSolverOps = [];
        for (let i = 0; i < results.length; i++) {
            if (!results[i].success) {
                continue;
            }
            const [success, ,] = this.simulator.interface.decodeFunctionResult("simSolverCall", results[i].returnData);
            if (!success) {
                continue;
            }
            simulatedSolverOps.push(sortedSolverOps[i]);
        }
        return [userOp, simulatedSolverOps];
    }
    async preSubmitBundle(bundleOps) {
        // Simulation will throw if the bundle is invalid
        await this.atlas
            .connect(new ethers_1.VoidSigner(bundleOps.dAppOperation.getField("bundler").value, this.provider))
            .getFunction("metacall")
            .staticCall(bundleOps.userOperation.toStruct(), bundleOps.solverOperations.map((solverOp) => solverOp.toStruct()), bundleOps.dAppOperation.toStruct());
        return bundleOps;
    }
}
exports.SimulationHooksController = SimulationHooksController;
