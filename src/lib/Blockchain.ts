import Block from "./Block";
import TransactionTypeEnum from "./enum/TransactionTypeEnum";
import BlockInfo from "./interfaces/BlockInfo";
import Transaction from "./Transaction";
import Validation from "./Validation";

/**
 * Blockchain class
 */
export default class Blockchain {

    blocks: Block[];
    mempool: Transaction[];
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
    static readonly MAX_TX_PER_BLOCK = 5;

    /**
     * Inicialize blockchain with genesis block
     */
    constructor() {
        this.mempool = [];
        this.blocks = [new Block(this.nextIndex, "", [new Transaction({
            type: TransactionTypeEnum.FEE,
            data: new Date().toString()
        } as Transaction)])];
        this.nextIndex++;
    }

    addTransaction(transaction: Transaction) : Validation {
        const validation = transaction.isValid();

        if (!validation.success) {
            return new Validation(false, `Invalid tx: ${validation.message}`);
        }

        if(this.blocks.some(b => b.transactions.some(tx => tx.hash === transaction.hash))){
            return new Validation(false, "Duplicated tx in blockchain");
        }

        if(this.mempool.some(tx => tx.hash === transaction.hash)){
            return new Validation(false, "Duplicated tx in mempool");
        }

        this.mempool.push(transaction);

        return new Validation(true, transaction.hash);
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

        const txs = block.transactions.filter(tx => tx.type !== TransactionTypeEnum.FEE).map(tx => tx.hash);
        const newMempool = this.mempool.filter(tx => !txs.includes(tx.hash));

        if (newMempool.length + txs.length !== this.mempool.length) {
            return new Validation(false, `Invalid tx in block: mempool`);
        }

        this.mempool = newMempool;

        this.blocks.push(block);
        this.nextIndex++;

        return new Validation(true, block.hash);
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
    getNextBlock() : BlockInfo | null {
        if(!this.mempool || !this.mempool.length) {
            return null;
        }

        const transactions = this.mempool.slice(0, Blockchain.MAX_TX_PER_BLOCK);
        const difficulty = this.getDifficulty();
        const previousHash = this.getLastBlock().hash;
        const index = this.nextIndex;
        const feePerTx = this.getFeePerTx();
        const maxDifficulty = Blockchain.MAX_DIFFICULTY_FACTOR;
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