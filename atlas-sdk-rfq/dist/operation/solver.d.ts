import { BaseOperation, OpField } from "./base";
export declare class SolverOperation extends BaseOperation {
    protected fields: Map<string, OpField>;
    score: number;
    constructor(score?: number);
}
