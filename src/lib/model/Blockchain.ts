import Block from "./Block";
import BlockInfo from "../interfaces/BlockInfo";
import Validation from "./Validation";

/**
 * Blockchain class
 */
export default class Blockchain {

    blocks: Block[];
    nextIndex: number = 0;
    /**
     * Other ways to generate a mining difficulty factor can be based 
     * on the number of current miners on the blockchain or the number 
     * of pending/already completed transactions.
     * 
     * This attr is unique and unchangeable
     */
    static readonly DIFFICULTY_FACTOR = 5;
    // hash length is 64, prevents the entire hash from being filled entirely with zeros over time
    static readonly MAX_DIFFICULTY_FACTOR = 60;

    /**
     * Inicialize blockchain with genesis block
     */
    constructor() {
        this.blocks = [new Block(this.nextIndex, "", "Genesis Block")];
        this.nextIndex++;
    }

    /**
     * Generates the mining difficulty of the block
     * @returns block mining difficulty 
     */
    getDifficulty() : number {
        return Math.ceil(this.blocks.length / Blockchain.DIFFICULTY_FACTOR);
    }

    /**
     * Return the last block
     */
    getLastBlock() : Block {
        return this.blocks[this.blocks.length-1];
    }

    /**
     * Method to return a block by hash
     * @param hash hash to search
     * @returns the block with the hash
     */
    getBlock(hash: string) : Block | undefined {
        return this.blocks.find(block => block.hash === hash);
    }


    /**
     * Check if the blockchain is valid
     */
    isValid() : Validation {

        for(let i = this.blocks.length-1; i > 0; i--){
            const currentBlock = this.blocks[i];
            const previousBlock = this.blocks[i-1];

            const validation = currentBlock.isValid(previousBlock.hash, previousBlock.index, this.getDifficulty());

            if(!validation.success){
                return new Validation(false, `Invalid block [${currentBlock.index}]: ${validation.message}`);
            }
        }

        return new Validation();
    }

    /**
     * Add new block 
     * @param block block that will be added 
     * @returns whether the add was successful or not
     */
    addBlock(block: Block) : Validation {
        const validation = block.isValid(this.getLastBlock().hash, this.getLastBlock().index, this.getDifficulty());
        if(!validation.success) {
            return new Validation(false, `Invalid block ${validation.message}`);
        }
        this.blocks.push(block);
        this.nextIndex++;
        return new Validation();
    }

    /**
     * Get amount of the smallest fraction of the coin
     * @returns fee per transactions
    */
    getFeePerTx() : number {
        return 1;
    }

    /**
     * Retrieve next block info
     * @returns Next block info
     */
    getNextBlock() : BlockInfo {
        const data = new Date().toString();
        const difficulty = this.getDifficulty();
        const previousHash = this.getLastBlock().hash;
        const index = this.nextIndex;
        const feePerTx = this.getFeePerTx();
        const maxDifficulty = Blockchain.MAX_DIFFICULTY_FACTOR;
        return {
            data,
            difficulty,
            previousHash,
            index,
            feePerTx,
            maxDifficulty
        } as BlockInfo;
    }

}