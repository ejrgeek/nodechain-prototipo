import sha256 from "crypto-js/sha256";
import TransactionTypeEnum from "../enum/TransactionTypeEnum";
import Validation from "../Validation";

/**
 * Mocked Transaction class
 */
export default class Transaction {

    type: TransactionTypeEnum;
    timestamp: number;
    hash: string;
    data: string;

    constructor(tx?: Transaction){
        this.type = tx?.type || TransactionTypeEnum.REGULAR;
        this.timestamp = tx?.timestamp || Date.now();
        this.data = tx?.data || "tx1";
        this.hash = tx?.hash || this.getHash();
    }

    getHash(): string {
        return "h-tx1";
    }

    isValid() : Validation {
        if (!this.data){
            return new Validation(false, "Invalid mocked data transaction.");
        }

        return new Validation();
    }


}