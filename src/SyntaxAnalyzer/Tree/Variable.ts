import { SymbolBase } from "src/LexicalAnalyzer/Symbols/SymbolBase";
import { TreeNodeBase } from "./TreeNodeBase";

export class Variable extends TreeNodeBase{

    constructor(symbol: SymbolBase) {
        super(symbol);
    }
}