import { SymbolBase } from "src/LexicalAnalyzer/Symbols/SymbolBase";
import { TreeNodeBase } from "./TreeNodeBase";

export class Variable extends TreeNodeBase{
    lineNumber: number;
    charPosition: number;

    constructor(symbol: SymbolBase, lineNumber: number, charPosition: number) {
        super(symbol);
        this.lineNumber = lineNumber;
        this.charPosition = charPosition;
    }
}