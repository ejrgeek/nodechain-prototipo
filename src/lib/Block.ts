import sha256 from "crypto-js/sha256";
import Validation from "./Validation";
import BlockInfo from "./interfaces/BlockInfo";
import Transaction from "./Transaction";
import TransactionTypeEnum from "./enum/TransactionTypeEnum";

/**
 * Block class
 */
export default class Block {
    index: number;
    timestamp: number;
    hash: string;
    previousHash: string;
    transaction: Transaction[];
    nonce: number;
    miner: string;


    /**
     * Block Constructor
     * @param index block position
     * @param previousHash previous block hash
     * @param transaction block content
     */
    constructor(index: number, previousHash: string, transaction: Transaction[] = [], miner: string = "", nonce: number = 0, ) {
        this.index = index;
        this.timestamp = Date.now();
        this.previousHash = previousHash;
        this.transaction = transaction;
        this.nonce = nonce;
        this.miner = miner;
        this.hash = this.getHash();
    }

    /**
     * Generates the block hash
     * @returns block hash
     */
    getHash() : string {
        const txs = this.transaction && this.transaction.length
            ? this.transaction.map( tx => tx.hash ).reduce((a,b) => a+b)
            : "";

        return sha256(this.index + txs + this.timestamp + this.previousHash + this.miner + this.nonce).toString();
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
        if (this.transaction && this.transaction.length) {
            if(this.transaction.filter(tx => tx.type === TransactionTypeEnum.FEE).length > 1){
                return new Validation(false, "Too many fees.");    
            }

            const validations = this.transaction.map(tx => tx.isValid());
            const validationsErros = validations.filter(v => !v.success).map(v => v.message);

            if(validationsErros.length > 0){
                return new Validation(false, `Invalid block due to invalid transaction. Errors: ${validationsErros.reduce((a,b) => a+" "+b)}`);
            }
        }

        if (previousIndex !== this.index-1) {
            return new Validation(false, "Invalid index.");
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

    /**
     * Convert BlockInfo to Block
     * @param blockInfo blockInfo retrieve from next block
     * @returns new Block with blockInfo information
     */
    static fromBlockInfo(blockInfo: BlockInfo, miner: string): Block {        
        const block = new Block(blockInfo.index, blockInfo.previousHash, blockInfo.transactions, miner);        
        return block;
    }

}