import { SymbolBase } from "src/LexicalAnalyzer/Symbols/SymbolBase";
import { TreeNodeBase } from "./TreeNodeBase";

export class Variable extends TreeNodeBase{
    varName: string;

    constructor(symbol: SymbolBase, varName: string) {
        super(symbol);
        this.varName = varName;
    }
}