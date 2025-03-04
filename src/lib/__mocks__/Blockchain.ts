import Block from "./Block";
import Validation from "../Validation";
import BlockInfo from "../interfaces/BlockInfo";
import Transaction from "../Transaction";
import TransactionTypeEnum from "../enum/TransactionTypeEnum";
import TransactionSearch from "../interfaces/TransactionSearch";

/**
 * Blockchain class
 */
export default class Blockchain {

    blocks: Block[];
    mempool: Transaction[];
    nextIndex: number = 0;
    /**
     * Inicialize mocked blockchain with genesis block
     */
    constructor() {
        this.mempool = [];
        this.blocks = [new Block(this.nextIndex, "", [new Transaction({
            data: "TX1",
            type: TransactionTypeEnum.FEE,
        } as Transaction)])];
        this.nextIndex++;
    }

    /**
     * Method to validate and add transactions to mempool
     * @param transaction validate and add to mempool
     * @returns if transaction is valid
     */
    addTransaction(transaction: Transaction) : Validation {
        const validation = transaction.isValid();

        if (!validation.success) {
            return new Validation(false, `Invalid tx: ${validation.message}`);
        }

        this.mempool.push(transaction);

        return new Validation(true, transaction.hash);
    }
    
    getTransaction(hash: string) : TransactionSearch {
        const mempoolIndex = this.mempool.findIndex(tx => tx.hash === hash);
        if (mempoolIndex !== -1){
            return {
                mempoolIndex,
                transaction: this.mempool[mempoolIndex]
            } as TransactionSearch;
        }

        const blockIndex = this.blocks.findIndex(blk => blk.transactions.some(tx => tx.hash === hash));
        if (blockIndex !== -1){
            return {
                blockIndex,
                transaction: this.blocks[blockIndex].transactions.find(tx => tx.hash === hash)
            } as TransactionSearch;
        }

        return { blockIndex: -1, mempoolIndex: -1} as TransactionSearch;
    }

    /**
     * Generates the mining difficulty of the block
     * @returns block mining difficulty 
     */
    getDifficulty(): number {
        return 1;
    }

    /**
     * Return the lastes mocked block
     */
    getLastBlock(): Block {
        return this.blocks[this.blocks.length - 1];
    }

    getBlock(hash: string): Block | undefined {
        return this.blocks.find(block => block.hash === hash);
    }


    /**
     * Check if the mocked blockchain is valid
     */
    isValid(): Validation {

        for (let i = this.blocks.length - 1; i > 0; i--) {
            const currentBlock = this.blocks[i];
            const previousBlock = this.blocks[i - 1];

            const validation = currentBlock.isValid(previousBlock.hash, previousBlock.index);

            if (!validation.success) {
                return new Validation(false, `Invalid block [${currentBlock.index}]: ${validation.message}`);
            }
        }

        return new Validation();
    }

    /**
     * Add new mocked block 
     * @param block block that will be added 
     * @returns whether the add was successful or not
     */
    addBlock(block: Block): Validation {
        if (block.index <= 0) {
            return new Validation(false, "Invalid mock block");
        }

        this.blocks.push(block);
        this.nextIndex++;

        return new Validation();
    }

    /**
     * Get amount of the smallest fraction of the coin
     * @returns fee per transactions
    */
    getFeePerTx(): number {
        return 1;
    }

    /**
     * Retrieve next block info
     * @returns Next block info
     */
    getNextBlock(): BlockInfo {
        const transactions = [new Transaction({
            data: new Date().toString(),
        } as Transaction)];
        const difficulty = 0;
        const previousHash = this.getLastBlock().hash;
        const index = 1;
        const feePerTx = this.getFeePerTx();
        const maxDifficulty = 60;
        return {
            transactions,
            difficulty,
            previousHash,
            index,
            feePerTx,
            maxDifficulty
        } as BlockInfo;
    }

}