import { Multiplication } from './Tree/Multiplication';
import { Division } from './Tree/Division';
import { Addition } from './Tree/Addition';
import { Subtraction } from './Tree/Subtraction';
import { NumberConstant } from './Tree/NumberConstant';
import { SymbolsCodes } from '../LexicalAnalyzer/SymbolsCodes';
import { LexicalAnalyzer } from '../LexicalAnalyzer/LexicalAnalyzer';
import { TreeNodeBase } from './Tree/TreeNodeBase';
import { SymbolBase } from '../LexicalAnalyzer/Symbols/SymbolBase';
import { UnaryMinus } from './Tree/UnaryMinus';
import { Variable } from './Tree/Variable';
import { Assignment } from './Tree/Assignment';

/**
 * Синтаксический анализатор - отвечает за построение синтаксического дерева
 */
export class SyntaxAnalyzer {

	lexicalAnalyzer: LexicalAnalyzer;
	symbol: SymbolBase | null;

	/**
 	* Деревья, которые будут построены (например, для каждой строки исходного кода)
 	*/
	trees: TreeNodeBase[];
	variables: string[];

	constructor(lexicalAnalyzer: LexicalAnalyzer) {
    	this.lexicalAnalyzer = lexicalAnalyzer;
    	this.symbol = null;
    	this.trees = [];
		this.variables = [];
	}

	/**
 	* Перемещаемся по последовательности "символов" лексического анализатора,
 	* получая очередной "символ" ("слово")
 	*/
	nextSym(): void {
    	this.symbol = this.lexicalAnalyzer.nextSym();
	}

	accept(expectedSymbolCode: string): void {
    	if (this.symbol === null) {
        	throw `${expectedSymbolCode} expected but END OF FILE found!`;
    	}

    	if (this.symbol.symbolCode === expectedSymbolCode) {
        	this.nextSym();
    	} else {
        	throw `${expectedSymbolCode} expected but ${this.symbol.symbolCode} found!`;
    	}
	}

	analyze(): TreeNodeBase[] {
    	this.nextSym();

    	while (this.symbol !== null) {
        	let expression: TreeNodeBase = this.scanExpression();

        	this.trees.push(expression);

        	// Последняя строка может не заканчиваться переносом на следующую строку.
        	if (this.symbol !== null) {
            	this.accept(SymbolsCodes.endOfLine);
        	}
    	}

    	return this.trees;
	}

	/**
 	* Разбор выражения
 	*/
	scanExpression(): TreeNodeBase {
		let term: TreeNodeBase = this.scanTerm();;
    	let operationSymbol: SymbolBase | null = null;

    	while (this.symbol !== null && (
        	this.symbol.symbolCode === SymbolsCodes.plus ||
        	this.symbol.symbolCode === SymbolsCodes.minus ||
			this.symbol.symbolCode === SymbolsCodes.equalSymbol
    	)) {

        	operationSymbol = this.symbol;
			let position = this.lexicalAnalyzer.fileIO.charPosition -1;
			let line = this.lexicalAnalyzer.fileIO.lineNumber;
        	this.nextSym();

        	let secondTerm: TreeNodeBase = 
				(operationSymbol.symbolCode === SymbolsCodes.equalSymbol) ? 
					this.scanExpression() : this.scanTerm();

        	switch (operationSymbol.symbolCode) {
            	case SymbolsCodes.plus:
                	term = new Addition(operationSymbol, term, secondTerm);
                	break;
            	case SymbolsCodes.minus:
                	term = new Subtraction(operationSymbol, term, secondTerm);
                	break;
				case SymbolsCodes.equalSymbol:
					if (term.symbol.symbolCode !== SymbolsCodes.identifier) {
						throw `Invalid assignment at position ${position} in line ${line}.`;
					}
					this.variables.push(term.symbol.value.toString());
					term = new Assignment(term.symbol, secondTerm);
					break;
        	}
    	}

    	return term;
	}

	/**
 	* Разбор "слагаемого"
 	*/
	scanTerm(): TreeNodeBase {
    	let multiplier: TreeNodeBase = this.scanMultiplier();
    	let operationSymbol: SymbolBase | null = null;

    	while (this.symbol !== null && (
        	this.symbol.symbolCode === SymbolsCodes.star ||
        	this.symbol.symbolCode === SymbolsCodes.slash
    	)) {

        	operationSymbol = this.symbol;
        	this.nextSym();

        	let secondTerm: TreeNodeBase = this.scanMultiplier();

        	switch (operationSymbol.symbolCode) {
            	case SymbolsCodes.star:
                	multiplier = new Multiplication(operationSymbol, multiplier, secondTerm);
                	break;
            	case SymbolsCodes.slash:
                	multiplier = new Division(operationSymbol, multiplier, secondTerm);
                	break;
        	}
    	}

    	return multiplier;
	}

	/**
 	*  Разбор "множителя"
 	*/

	scanMultiplier(): TreeNodeBase {
    	let integerConstant: SymbolBase | null = this.symbol;
        let parenthesisExpression: TreeNodeBase | null = null;

		switch (this.symbol?.symbolCode) {
			case SymbolsCodes.minus:
				let minus = this.symbol;
				this.nextSym();
				return new UnaryMinus(minus, this.scanMultiplier());

			case SymbolsCodes.openParenthesis:
				this.nextSym();
				parenthesisExpression = this.scanExpression();
				this.accept(SymbolsCodes.closeParenthesis)
				return parenthesisExpression;

			case SymbolsCodes.identifier:
				let variable = this.symbol;
				let line = this.lexicalAnalyzer.fileIO.lineNumber;
				let position = 
					this.lexicalAnalyzer.fileIO.charPosition - variable.value.toString().length;
				this.nextSym();
				if (this.symbol?.stringValue !== SymbolsCodes.equalSymbol &&
					!this.variables.includes(variable.value.toString())) {
						throw `Variable "${variable.value}" is not initialized` +
							` at position ${position} in line ${line}`;
					}
				return new Variable(variable);

			default:
				this.accept(SymbolsCodes.integerConst); // проверим, что текущий символ это именно константа, а не что-то еще
				return new NumberConstant(integerConstant);
		}
	}
};
