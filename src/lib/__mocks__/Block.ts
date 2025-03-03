import Validation from "../Validation";

/**
 * Mocked Block Class
 */
export default class Block {
    index: number;
    timestamp: number;
    hash: string;
    previousHash: string;
    data: string;


    /**
     * Mock Block Constructor
     * @param index block position
     * @param previousHash previous block hash
     * @param data block content
     */
    constructor(index: number, previousHash: string, data: string) {
        this.index = index;
        this.timestamp = Date.now();
        this.previousHash = previousHash;
        this.data = data;
        this.hash = this.getHash();
    }

    /**
     * Generates the mocked block hash
     * @returns block hash
     */
    getHash() : string {
        return "abc";
    }

    /**
     * Check if the mocked block is valid
     * @param previousHash check the previous hash
     * @param previousIndex check the previous index
     * @returns 
     */
    isValid(previousHash: string, previousIndex: number) : Validation {
        if (previousIndex < 0 || !previousHash || this.index <= 0) {
            return new Validation(false, "Invalid mock block.");
        }
        return new Validation();
    }

}