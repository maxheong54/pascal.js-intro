import { SymbolBase } from "src/LexicalAnalyzer/Symbols/SymbolBase";
import { TreeNodeBase } from "./TreeNodeBase";

export class Variable extends TreeNodeBase{
    equalFlag: boolean;

    constructor(symbol: SymbolBase, equalFlag: boolean) {
        super(symbol);
        this.equalFlag = equalFlag;
    }
}