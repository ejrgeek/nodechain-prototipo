import sha256 from "crypto-js/sha256";
import Validation from "./Validation";

/**
 * Block class
 */
export default class Block {
    index: number;
    timestamp: number;
    hash: string;
    previousHash: string;
    data: string;


    /**
     * Block Constructor
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
     * Generates the block hash
     * @returns block hash
     */
    getHash() : string {
        return sha256(this.index + this.data + this.timestamp + this.previousHash).toString();
    }

    /**
     * Check if the block is valid
     * @param previousHash check the previous hash
     * @param previousIndex check the previous index
     * @returns 
     */
    isValid(previousHash: string, previousIndex: number) : Validation {
        if (previousIndex !== this.index-1) {
            return new Validation(false, "Invalid index.");
        }
        if (!this.data){
            return new Validation(false, "Invalid data.");
        }
        if (this.timestamp < 1){
            return new Validation(false, "Invalid timestamp.");
        }
        if (!this.hash){
            return new Validation(false, "Invalid hash.");
        }
        if (this.previousHash !== previousHash) {
            return new Validation(false, "Invalid previous hash.");;
        }
        return new Validation();
    }

}