import TransactionTypeEnum from "../enum/TransactionTypeEnum";
import Transaction from "../Transaction";
import Validation from "../Validation";

/**
 * Mocked Block Class
 */
export default class Block {
    index: number;
    timestamp: number;
    hash: string;
    previousHash: string;
    transactions: Transaction[];


    /**
     * Mock Block Constructor
     * @param index block position
     * @param previousHash previous block hash
     * @param data block content
     */
    constructor(index: number, previousHash: string, transactions: Transaction[] = []) {
        this.index = index;
        this.timestamp = Date.now();
        this.previousHash = previousHash;
        this.transactions = transactions;
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
        if (this.transactions && this.transactions.length) {
            if(this.transactions.filter(tx => tx.type === TransactionTypeEnum.FEE).length > 1){
                return new Validation(false, "Too many fees.");    
            }

            const validations = this.transactions.map(tx => tx.isValid());
            const validationsErros = validations.filter(v => !v.success).map(v => v.message);

            if(validationsErros.length > 0){
                return new Validation(false, `Invalid block due to invalid transaction. Errors: ${validationsErros.reduce((a,b) => a+" "+b)}`);
            }
        } else {
            return new Validation(false, "No transactions.");
        }
        if (previousIndex < 0 || !previousHash || this.index <= 0) {
            return new Validation(false, "Invalid mock block.");
        }
        return new Validation();
    }

}