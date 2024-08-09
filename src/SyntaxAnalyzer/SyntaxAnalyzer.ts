import { Multiplication } from './Tree/Multiplication';
import { Division } from './Tree/Division';
import { Addition } from './Tree/Addition';
import { Subtraction } from './Tree/Subtraction';
import { NumberConstant } from './Tree/NumberConstant';
import { SymbolsCodes } from '../LexicalAnalyzer/SymbolsCodes';
import { LexicalAnalyzer } from '../LexicalAnalyzer/LexicalAnalyzer';
import { TreeNodeBase } from './Tree/TreeNodeBase';
import { SymbolBase } from '../LexicalAnalyzer/Symbols/SymbolBase';
import { BinaryOperation } from './Tree/BinaryOperation';
import { UnaryMinus } from './Tree/UnaryMinus';
import { Variable } from './Tree/Variable';

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
	variables: {[key:string]:any};

	constructor(lexicalAnalyzer: LexicalAnalyzer) {
    	this.lexicalAnalyzer = lexicalAnalyzer;
    	this.symbol = null;
    	this.trees = [];
		this.variables = {};
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
    	let term: TreeNodeBase = this.scanTerm();
    	let operationSymbol: SymbolBase | null = null;

    	while (this.symbol !== null && (
        	this.symbol.symbolCode === SymbolsCodes.plus ||
        	this.symbol.symbolCode === SymbolsCodes.minus
    	)) {

        	operationSymbol = this.symbol;
        	this.nextSym();

        	let secondTerm: TreeNodeBase = this.scanTerm();

        	switch (operationSymbol.symbolCode) {
            	case SymbolsCodes.plus:
                	term = new Addition(operationSymbol, term, secondTerm);
                	break;
            	case SymbolsCodes.minus:
                	term = new Subtraction(operationSymbol, term, secondTerm);
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
	// scanMultiplier(): TreeNodeBase {
    // 	let integerConstant: SymbolBase | null = this.symbol;
    //     let parenthesisExpression: TreeNodeBase | null = null;

    //     if (this.symbol !== null && this.symbol.symbolCode === SymbolsCodes.minus) {
    //         let minus = this.symbol;
    //         this.nextSym();
    //         return new UnaryMinus(minus, this.scanMultiplier());
    //     }

    //     if (this.symbol !== null && this.symbol.symbolCode === SymbolsCodes.openParenthesis) {
    //         this.nextSym();
    //         parenthesisExpression = this.scanExpression();

    //         this.accept(SymbolsCodes.closeParenthesis)

    //         return parenthesisExpression;
    //     }

	// 	if (this.symbol !== null && this.symbol.symbolCode === SymbolsCodes.identifier) {
	// 		let varName = this.symbol.value;
	// 		//@ts-ignore
	// 		let charPosition = this.lexicalAnalyzer.fileIO.charPosition - varName.length;
	// 		this.nextSym();

	// 		if (varName in this.variables) {
	// 			return this.variables[varName];
	// 		}

	// 		// @ts-ignore
	// 		if (this.symbol !== null && this.symbol.symbolCode === SymbolsCodes.equalSymbol) {
	// 			this.nextSym();
	// 			this.variables[varName] = this.scanExpression();
	// 			//@ts-ignore
	// 			return new Variable(integerConstant, varName);
	// 		} else {
	// 			let lineNumber = (this.symbol !== null &&
	// 				//@ts-ignore
	// 				this.symbol.symbolCode === SymbolsCodes.endOfLine) ?
	// 				this.lexicalAnalyzer.fileIO.lineNumber :
	// 				this.lexicalAnalyzer.fileIO.lineNumber + 1;
	// 			let err = `The variable "${varName}" at line ${lineNumber}, position ${charPosition} is not initialized.`;
	// 			throw err;
	// 		}
	// 	}

    // 	this.accept(SymbolsCodes.integerConst); // проверим, что текущий символ это именно константа, а не что-то еще

    // 	return new NumberConstant(integerConstant);
	// }



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
				let varName = this.symbol.value;
				//@ts-ignore
				let charPosition = this.lexicalAnalyzer.fileIO.charPosition - varName.length;
				this.nextSym();

				// @ts-ignore
				if (this.symbol?.symbolCode === SymbolsCodes.equalSymbol) {
					this.nextSym();
					this.variables[varName] = this.scanExpression();
					//@ts-ignore
					return new Variable(integerConstant, varName);
				} else if (varName in this.variables) {
					return this.variables[varName];
				} else {
					
					let lineNumber = (//@ts-ignore
						this.symbol?.symbolCode === SymbolsCodes.endOfLine) ?
						this.lexicalAnalyzer.fileIO.lineNumber :
						this.lexicalAnalyzer.fileIO.lineNumber + 1;
					let err = `The variable "${varName}" at line ${lineNumber}, position ${charPosition} is not initialized.`;
					throw err;
				}
			default:
				this.accept(SymbolsCodes.integerConst); // проверим, что текущий символ это именно константа, а не что-то еще
				return new NumberConstant(integerConstant);
		}
	}
};
