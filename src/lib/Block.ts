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
    nonce: number;
    miner: string;


    /**
     * Block Constructor
     * @param index block position
     * @param previousHash previous block hash
     * @param data block content
     */
    constructor(index: number, previousHash: string, data: string, nonce: number = 0, miner: string = "") {
        this.index = index;
        this.timestamp = Date.now();
        this.previousHash = previousHash;
        this.data = data;
        this.nonce = nonce;
        this.miner = miner;
        this.hash = this.getHash();
    }

    /**
     * Generates the block hash
     * @returns block hash
     */
    getHash() : string {
        return sha256(this.index + this.data + this.timestamp + this.previousHash + this.nonce + this.miner).toString();
    }

    /**
     * Generates hash prefix
     * @param difficulty the blockchain current difficulty
     * @returns hash prefix
     */
    /* v8 ignore start */
    __getHashPrefix(difficulty: number) : string {
        return new Array(difficulty + 1).join("0");
    }
    /* v8 ignore stop */

    /**
     * Generates a new valid hash for this block
     * @param difficulty the blockchain current difficulty
     * @param miner miner wallet address
     */
    minePoW(difficulty: number, miner: string) : void {
        this.miner = miner;
        const hashPrefix = this.__getHashPrefix(difficulty);

        do {
            this.nonce++;
            this.hash = this.getHash();
        } while (!this.hash.startsWith(hashPrefix));
    }

    /**
     * Check if the block is valid
     * @param previousHash the previous hash
     * @param previousIndex the previous index
     * @param difficulty the blockchain current difficulty
     * @returns if the block is valid
     */
    isValid(previousHash: string, previousIndex: number, difficulty: number) : Validation {
        if (previousIndex !== this.index-1) {
            return new Validation(false, "Invalid index.");
        }
        if (!this.data){
            return new Validation(false, "Invalid data.");
        }
        if (this.timestamp < 1){
            return new Validation(false, "Invalid timestamp.");
        }
        if (this.previousHash !== previousHash) {
            return new Validation(false, "Invalid previous hash.");
        }
        if (!this.nonce || !this.miner){
            return new Validation(false, "No mined.");
        }

        const hashPrefix = this.__getHashPrefix(difficulty);
        if (!this.hash || this.hash !== this.getHash() || !this.hash.startsWith(hashPrefix)) {
            return new Validation(false, "Invalid hash.");
        }

        return new Validation();
    }

}