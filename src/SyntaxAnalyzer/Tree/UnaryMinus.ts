import { SymbolBase } from '../../LexicalAnalyzer/Symbols/SymbolBase';
import { TreeNodeBase } from './TreeNodeBase';

export class UnaryMinus extends TreeNodeBase
{
    right: TreeNodeBase;

    constructor(symbol: SymbolBase, right: TreeNodeBase)
    {
        super(symbol);
        this.right = right;
    }
}