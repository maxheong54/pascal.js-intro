
import fs from 'fs';

export class FileIO {
    charPointer: number;
    lineNumber: number;
    charPosition: number;
    text: string;

    constructor(fileName) {
        this.charPointer = 0;
        this.charPosition = 0;
        this.lineNumber = 1;
        this.text = fs.readFileSync(fileName, 'utf-8');
    }

    nextCh() {
        this.charPosition++;
        return this.charPointer < this.text.length ?
            this.text[this.charPointer++] :
            null;
    }
}